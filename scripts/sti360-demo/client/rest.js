// A small PostgREST stand-in: turns the requests supabase-js makes (/rest/v1/<table>,
// /rest/v1/rpc/<fn>) into SQL against the in-browser Postgres (PGlite) and answers in
// PostgREST's response format. Covers what STI-360 uses: select with embedded resources,
// filters incl. or/and/not, order, limit/offset, counts, single/maybeSingle, insert,
// upsert, update, delete, and calls to the real SQL functions.

const qi = (s) => `"${String(s).replace(/"/g, '""')}"`;

export class RestError extends Error {
  constructor(status, body) { super(body.message); this.status = status; this.body = body; }
}

// ---------- catalog ----------
export async function loadCatalog(db) {
  const rels = await db.query(`
    select c.relname, c.relkind, a.attname, format_type(a.atttypid, a.atttypmod) typ, a.attgenerated <> '' gen
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
    where n.nspname = 'public' and c.relkind in ('r','v','m') order by c.relname, a.attnum`);
  const relations = {};
  for (const r of rels.rows) {
    const rel = (relations[r.relname] ||= { name: r.relname, kind: r.relkind, cols: {}, colList: [] });
    rel.cols[r.attname] = { type: r.typ, generated: r.gen };
    rel.colList.push(r.attname);
  }
  const fks = await db.query(`
    select c.conname, src.relname src, a.attname srccol, dst.relname dst, b.attname dstcol
    from pg_constraint c
    join pg_class src on src.oid = c.conrelid join pg_namespace ns on ns.oid = src.relnamespace
    join pg_class dst on dst.oid = c.confrelid join pg_namespace nd on nd.oid = dst.relnamespace
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = c.conkey[1]
    join pg_attribute b on b.attrelid = c.confrelid and b.attnum = c.confkey[1]
    where c.contype = 'f' and ns.nspname = 'public' and nd.nspname = 'public' and array_length(c.conkey, 1) = 1`);
  const funcs = await db.query(`
    select p.proname, p.proretset, t.typtype, format_type(p.prorettype, null) rettype, p.pronargs, p.pronargdefaults,
      coalesce(p.proargnames, '{}') argnames, p.proargmodes::text[] argmodes,
      array(select format_type(x, null) from unnest(p.proargtypes) x) argtypes
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace join pg_type t on t.oid = p.prorettype
    where n.nspname = 'public' and p.prokind = 'f'`);
  const functions = {};
  for (const f of funcs.rows) {
    let names = f.argnames;
    if (f.argmodes) names = names.filter((_, i) => ["i", "b", "v"].includes(f.argmodes[i]));
    names = names.slice(0, f.pronargs);
    (functions[f.proname] ||= []).push({
      name: f.proname, retset: f.proretset, composite: f.typtype === "c" || f.rettype === "record",
      void: f.rettype === "void", args: names.map((n, i) => ({ name: n, type: f.argtypes[i] })),
      required: f.pronargs - f.pronargdefaults,
    });
  }
  return { relations, fks: fks.rows, functions };
}

// ---------- tiny parsers ----------
function splitTop(s, sep = ",") {
  const out = []; let depth = 0, cur = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' && s[i - 1] !== "\\") q = !q;
    if (!q && c === "(") depth++;
    if (!q && c === ")") depth--;
    if (!q && depth === 0 && c === sep) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  if (cur !== "") out.push(cur);
  return out.map((x) => x.trim()).filter((x) => x !== "");
}

// select=... into a tree: [{type:'star'} | {type:'col', name, alias, path, cast} | {type:'embed', rel, alias, hint, inner, children}]
function parseSelect(str) {
  if (!str) return [{ type: "star" }];
  return splitTop(str.replace(/\s+/g, "")).map(parseItem);
}
function parseItem(item) {
  const open = item.indexOf("(");
  if (open > 0 && item.endsWith(")")) {
    let head = item.slice(0, open);
    const inner = item.slice(open + 1, -1);
    let alias = null;
    if (head.includes(":")) [alias, head] = head.split(":");
    const parts = head.split("!");
    const rel = parts[0];
    const flags = parts.slice(1);
    if (["count", "sum", "avg", "min", "max"].includes(rel) && inner === "") return { type: "agg", fn: rel, alias: alias || rel };
    return { type: "embed", rel, alias: alias || rel, inner: flags.includes("inner"), hint: flags.find((f) => f !== "inner" && f !== "left") || null, children: parseSelect(inner) };
  }
  if (item === "*") return { type: "star" };
  let alias = null, rest = item;
  const colon = rest.indexOf(":");
  if (colon > 0 && rest[colon + 1] !== ":") { alias = rest.slice(0, colon); rest = rest.slice(colon + 1); }
  let cast = null;
  const castAt = rest.indexOf("::");
  if (castAt > 0) { cast = rest.slice(castAt + 2); rest = rest.slice(0, castAt); }
  const m = /^([^-]+)((?:->>?[^-]+)*)$/.exec(rest);
  const name = m ? m[1] : rest;
  const path = m && m[2] ? m[2].match(/->>?[^-]+/g) : [];
  const last = path.length ? path[path.length - 1].replace(/^->>?/, "") : null;
  return { type: "col", name, path, cast, alias: alias || last || name };
}

function colExpr(alias, name, path = [], cast = null) {
  let e = `${alias}.${qi(name)}`;
  for (const p of path) {
    const op = p.startsWith("->>") ? "->>" : "->";
    const key = p.slice(op.length);
    e += /^\d+$/.test(key) ? `${op}${key}` : `${op}'${key.replace(/'/g, "''")}'`;
  }
  if (cast) e = `(${e})::${cast.replace(/[^a-z0-9_ \[\]]/gi, "")}`;
  return e;
}

// ---------- query builder ----------
class Builder {
  constructor(cat) { this.cat = cat; this.params = []; this.n = 0; }
  p(v) { this.params.push(v); return `$${this.params.length}`; }
  alias() { return `t${++this.n}`; }

  findEmbed(parentRel, item) {
    const fks = this.cat.fks;
    const target = item.rel;
    // many-to-one: parent has a column pointing at target
    let fk = fks.find((f) => f.src === parentRel && f.dst === target && (!item.hint || f.conname === item.hint || f.srccol === item.hint));
    if (fk) return { kind: "one", rel: target, on: (pa, ca) => `${ca}.${qi(fk.dstcol)} = ${pa}.${qi(fk.srccol)}` };
    // one-to-many: target points at parent
    fk = fks.find((f) => f.src === target && f.dst === parentRel && (!item.hint || f.conname === item.hint || f.srccol === item.hint));
    if (fk) return { kind: "many", rel: target, on: (pa, ca) => `${ca}.${qi(fk.srccol)} = ${pa}.${qi(fk.dstcol)}` };
    // a column used as the relation name: school_id(...) style
    fk = fks.find((f) => f.src === parentRel && f.srccol === target);
    if (fk) return { kind: "one", rel: fk.dst, on: (pa, ca) => `${ca}.${qi(fk.dstcol)} = ${pa}.${qi(fk.srccol)}` };
    // views: guess through a same-named column (e.g. school_id -> schools.id)
    const parent = this.cat.relations[parentRel];
    const guess = Object.keys(parent?.cols || {}).find((c) => c === `${target.replace(/s$/, "")}_id`);
    if (guess && this.cat.relations[target]) return { kind: "one", rel: target, on: (pa, ca) => `${ca}."id" = ${pa}.${qi(guess)}` };
    throw new RestError(400, { code: "PGRST200", message: `Could not find a relationship between '${parentRel}' and '${target}' in the schema cache`, details: null, hint: null });
  }

  // jsonb expression for one row of `rel` aliased `a`, following the select tree.
  projection(rel, a, items, embedOpts) {
    const parts = [];
    let pairs = [];
    const flush = () => { if (pairs.length) { parts.push(`jsonb_build_object(${pairs.join(", ")})`); pairs = []; } };
    for (const it of items) {
      if (it.type === "star") { flush(); parts.push(`to_jsonb(${a})`); continue; }
      if (it.type === "col") { pairs.push(`'${it.alias.replace(/'/g, "''")}'`, colExpr(a, it.name, it.path, it.cast)); if (pairs.length >= 90) flush(); continue; }
      if (it.type === "agg") continue;
      if (it.type === "embed") {
        const e = this.findEmbed(rel, it);
        const ca = this.alias();
        const sub = embedOpts?.[it.alias] || embedOpts?.[it.rel] || {};
        const where = [e.on(a, ca), ...this.filterSql(sub.filters || [], ca, e.rel)];
        const order = this.orderSql(sub.order, ca);
        const inner = this.projection(e.rel, ca, it.children, sub.embeds);
        let expr;
        if (e.kind === "one") expr = `(select ${inner} from public.${qi(e.rel)} ${ca} where ${where.join(" and ")} limit 1)`;
        else {
          const lim = sub.limit != null ? ` limit ${Number(sub.limit)}` : "";
          const off = sub.offset != null ? ` offset ${Number(sub.offset)}` : "";
          expr = `coalesce((select jsonb_agg(x.j) from (select ${inner} j from public.${qi(e.rel)} ${ca} where ${where.join(" and ")}${order}${lim}${off}) x), '[]'::jsonb)`;
        }
        pairs.push(`'${it.alias.replace(/'/g, "''")}'`, expr);
        if (pairs.length >= 90) flush();
      }
    }
    flush();
    return parts.length ? parts.join(" || ") : "'{}'::jsonb";
  }

  // where-clauses for the parent from !inner embeds
  innerJoins(rel, a, items, embedOpts) {
    const out = [];
    for (const it of items) {
      if (it.type !== "embed" || !it.inner) continue;
      const e = this.findEmbed(rel, it);
      const ca = this.alias();
      const sub = embedOpts?.[it.alias] || embedOpts?.[it.rel] || {};
      const where = [e.on(a, ca), ...this.filterSql(sub.filters || [], ca, e.rel)];
      out.push(`exists (select 1 from public.${qi(e.rel)} ${ca} where ${where.join(" and ")})`);
    }
    return out;
  }

  filterSql(filters, a, rel) {
    return filters.map((f) => this.cond(f, a, rel)).filter(Boolean);
  }

  // f: {col, value} where value is "op.val" / "not.op.val", or logic {logic:'or'|'and', not, items:[...]}
  cond(f, a, rel) {
    if (f.logic) {
      const parts = f.items.map((x) => this.cond(x, a, rel)).filter(Boolean);
      if (!parts.length) return null;
      const s = `(${parts.join(f.logic === "or" ? " or " : " and ")})`;
      return f.not ? `not ${s}` : s;
    }
    let v = f.value;
    let neg = false;
    if (v.startsWith("not.")) { neg = true; v = v.slice(4); }
    const dot = v.indexOf(".");
    let op = dot < 0 ? v : v.slice(0, dot);
    let val = dot < 0 ? "" : v.slice(dot + 1);
    const m = /^(\w+)(?:\(([^)]*)\))?$/.exec(op);
    op = m ? m[1] : op;
    const opArg = m ? m[2] : null;
    const pm = /^([^-]+)((?:->>?[^-]+)*)$/.exec(f.col);
    const path = pm && pm[2] ? pm[2].match(/->>?[^-]+/g) : [];
    const col = colExpr(a, pm ? pm[1] : f.col, path);
    const textCol = path.length ? col : `${col}::text`;
    let s;
    const unq = (x) => (x.startsWith('"') && x.endsWith('"') ? x.slice(1, -1).replace(/\\"/g, '"') : x);
    switch (op) {
      case "eq": s = `${col} = ${this.p(unq(val))}`; break;
      case "neq": s = `${col} <> ${this.p(unq(val))}`; break;
      case "gt": s = `${col} > ${this.p(unq(val))}`; break;
      case "gte": s = `${col} >= ${this.p(unq(val))}`; break;
      case "lt": s = `${col} < ${this.p(unq(val))}`; break;
      case "lte": s = `${col} <= ${this.p(unq(val))}`; break;
      case "like": case "ilike": {
        const kw = op === "like" ? "like" : "ilike";
        if (opArg === "any" || opArg === "all") {
          const list = splitTop(val.replace(/^\{|\}$/g, "")).map((x) => unq(x).replace(/\*/g, "%"));
          s = `${textCol} ${kw} ${opArg}(${this.p(list)}::text[])`;
        } else s = `${textCol} ${kw} ${this.p(unq(val).replace(/\*/g, "%"))}`;
        break;
      }
      case "match": s = `${textCol} ~ ${this.p(val)}`; break;
      case "imatch": s = `${textCol} ~* ${this.p(val)}`; break;
      case "is": {
        const lv = val.toLowerCase();
        s = lv === "null" ? `${col} is null` : lv === "not_null" ? `${col} is not null` : lv === "true" ? `${col} is true` : lv === "false" ? `${col} is false` : `${col} is unknown`;
        break;
      }
      case "isdistinct": s = `${col} is distinct from ${this.p(unq(val))}`; break;
      case "in": {
        const list = splitTop(val.replace(/^\(|\)$/g, "")).map(unq);
        s = list.length ? `${textCol} = any(${this.p(list)}::text[])` : "false";
        break;
      }
      case "cs": s = `${col} @> ${this.p(val)}`; break;
      case "cd": s = `${col} <@ ${this.p(val)}`; break;
      case "ov": s = `${col} && ${this.p(val.startsWith("(") ? `{${val.slice(1, -1)}}` : val)}`; break;
      case "fts": case "plfts": case "phfts": case "wfts": {
        const fn = { fts: "to_tsquery", plfts: "plainto_tsquery", phfts: "phraseto_tsquery", wfts: "websearch_to_tsquery" }[op];
        const cfg = opArg ? `${this.p(opArg)}::regconfig, ` : "";
        const target = this.cat.relations[rel]?.cols[pm ? pm[1] : f.col]?.type === "tsvector" ? col : `to_tsvector(${col}::text)`;
        s = `${target} @@ ${fn}(${cfg}${this.p(val)})`;
        break;
      }
      default: throw new RestError(400, { code: "PGRST100", message: `Unknown filter operator: ${op}`, details: null, hint: null });
    }
    return neg ? `not (${s})` : s;
  }

  orderSql(order, a) {
    if (!order) return "";
    const parts = splitTop(order).map((term) => {
      const bits = term.split(".");
      let dir = "", nulls = "";
      const col = [];
      for (const b of bits) {
        if (b === "asc" || b === "desc") dir = ` ${b}`;
        else if (b === "nullsfirst") nulls = " nulls first";
        else if (b === "nullslast") nulls = " nulls last";
        else col.push(b);
      }
      const name = col.join(".");
      const pm = /^([^-]+)((?:->>?[^-]+)*)$/.exec(name);
      return `${colExpr(a, pm ? pm[1] : name, pm && pm[2] ? pm[2].match(/->>?[^-]+/g) : [])}${dir}${nulls}`;
    });
    return parts.length ? ` order by ${parts.join(", ")}` : "";
  }
}

// Group URL params into top-level filters and per-embed options.
function parseParams(params, embedNames) {
  const top = { filters: [], order: null, limit: null, offset: null, embeds: {} };
  const target = (path) => {
    let node = top;
    for (const seg of path) node = (node.embeds[seg] ||= { filters: [], order: null, limit: null, offset: null, embeds: {} });
    return node;
  };
  for (const [key, value] of params) {
    if (["select", "columns", "on_conflict"].includes(key)) continue;
    const segs = key.split(".");
    let path = [], last = key;
    // "schools.name" / "schools.order" -> embed path; but "data->>a.b" isn't, so only split on known embed names
    while (segs.length > 1 && embedNames.has(segs[0])) { path.push(segs.shift()); last = segs.join("."); }
    const node = target(path);
    if (last === "order") node.order = value;
    else if (last === "limit") node.limit = value;
    else if (last === "offset") node.offset = value;
    else if (last === "or" || last === "and" || last === "not.or" || last === "not.and") node.filters.push(parseLogic(last, value));
    else node.filters.push({ col: last, value });
  }
  return top;
}
function parseLogic(kind, value) {
  const not = kind.startsWith("not.");
  const logic = kind.replace("not.", "");
  const inner = value.replace(/^\(/, "").replace(/\)$/, "");
  return { logic, not, items: splitTop(inner).map(parseLogicItem) };
}
function parseLogicItem(item) {
  const m = /^(not\.)?(or|and)\((.*)\)$/.exec(item);
  if (m) return { logic: m[2], not: !!m[1], items: splitTop(m[3]).map(parseLogicItem) };
  const dot = item.indexOf(".");
  return { col: item.slice(0, dot), value: item.slice(dot + 1) };
}
function embedNamesOf(items, set = new Set()) {
  for (const it of items) if (it.type === "embed") { set.add(it.alias); set.add(it.rel); embedNamesOf(it.children, set); }
  return set;
}

// ---------- request handling ----------
export async function handleRest({ db, cat, method, path, params, headers, body }) {
  const prefer = headers.get("prefer") || "";
  const accept = headers.get("accept") || "";
  const wantObject = accept.includes("vnd.pgrst.object");
  const countMode = /count=(exact|planned|estimated)/.test(prefer);
  const returnRep = prefer.includes("return=representation");

  if (path.startsWith("rpc/")) return handleRpc({ db, cat, fn: path.slice(4), method, params, body, wantObject, countMode });

  const rel = decodeURIComponent(path);
  const meta = cat.relations[rel];
  if (!meta) throw new RestError(404, { code: "42P01", message: `relation "public.${rel}" does not exist`, details: null, hint: null });

  const select = parseSelect(params.get("select"));
  const opts = parseParams(params, embedNamesOf(select));
  const b = new Builder(cat);
  const a = "r";

  if (method === "GET" || method === "HEAD") {
    const where = [...b.filterSql(opts.filters, a, rel), ...b.innerJoins(rel, a, select, opts.embeds)];
    const whereSql = where.length ? ` where ${where.join(" and ")}` : "";
    const aggs = select.filter((x) => x.type === "agg");
    let rows, total = null;
    if (aggs.length && aggs.length === select.length) {
      const r = await db.query(`select count(*)::int n from public.${qi(rel)} ${a}${whereSql}`, b.params);
      rows = [{ [aggs[0].alias]: r.rows[0].n }];
    } else {
      const proj = method === "HEAD" ? "'{}'::jsonb" : b.projection(rel, a, select, opts.embeds);
      const lim = opts.limit != null ? ` limit ${Number(opts.limit)}` : "";
      const off = opts.offset != null ? ` offset ${Number(opts.offset)}` : "";
      const sql = `select coalesce(jsonb_agg(x.j), '[]'::jsonb) rows from (select ${proj} j from public.${qi(rel)} ${a}${whereSql}${b.orderSql(opts.order, a)}${lim}${off}) x`;
      const r = await db.query(sql, b.params);
      rows = r.rows[0].rows;
    }
    if (countMode) {
      const r = await db.query(`select count(*)::int n from public.${qi(rel)} ${a}${whereSql}`, b.params);
      total = r.rows[0].n;
    }
    return respond(rows, { wantObject, total, offset: Number(opts.offset || 0), head: method === "HEAD" });
  }

  if (method === "POST") {
    const list = Array.isArray(body) ? body : [body];
    const onConflict = params.get("on_conflict");
    const merge = prefer.includes("resolution=merge-duplicates");
    const ignore = prefer.includes("resolution=ignore-duplicates");
    let colsParam = params.get("columns");
    colsParam = colsParam ? colsParam.replace(/"/g, "").split(",") : null;
    const out = [];
    // rows with the same keys go together, so missing keys keep their column defaults
    const groups = new Map();
    for (const row of list) {
      const keys = (colsParam || Object.keys(row)).filter((k) => meta.cols[k] && !meta.cols[k].generated);
      const k = keys.join(",");
      (groups.get(k) || groups.set(k, []).get(k)).push(row);
    }
    for (const [k, rowsIn] of groups) {
      const keys = k ? k.split(",") : [];
      const bb = new Builder(cat);
      const cols = keys.map(qi).join(", ");
      const conflictCols = onConflict ? onConflict.split(",").map((c) => qi(c.trim())).join(", ") : null;
      let conflict = "";
      if (merge || ignore) {
        const target = conflictCols ? `(${conflictCols})` : `on constraint ${qi(`${rel}_pkey`)}`;
        const upd = keys.filter((c) => !(onConflict || "").split(",").map((x) => x.trim()).includes(c));
        conflict = ignore || !upd.length ? ` on conflict ${conflictCols ? `(${conflictCols})` : ""} do nothing` : ` on conflict ${target} do update set ${upd.map((c) => `${qi(c)} = excluded.${qi(c)}`).join(", ")}`;
      }
      const insert = keys.length
        ? `insert into public.${qi(rel)} (${cols}) select ${cols} from jsonb_populate_recordset(null::public.${qi(rel)}, ${bb.p(JSON.stringify(rowsIn))}::jsonb)${conflict} returning *`
        : `insert into public.${qi(rel)} default values returning *`;
      const proj = bb.projection(rel, a, select, opts.embeds);
      const r = await db.query(`with w as (${insert}) select coalesce(jsonb_agg(${proj}), '[]'::jsonb) rows from w ${a}`, bb.params);
      out.push(...r.rows[0].rows);
    }
    if (!returnRep) return { status: 201, body: null };
    return respond(out, { wantObject, status: 201 });
  }

  if (method === "PATCH") {
    const keys = Object.keys(body || {}).filter((k) => meta.cols[k] && !meta.cols[k].generated);
    if (!keys.length) return returnRep ? respond([], { wantObject }) : { status: 204, body: null };
    const where = b.filterSql(opts.filters, a, rel);
    const src = b.p(JSON.stringify(body));
    const sets = keys.map((c) => `${qi(c)} = v.${qi(c)}`).join(", ");
    const proj = b.projection(rel, a, select, opts.embeds);
    const sql = `with w as (update public.${qi(rel)} ${a} set ${sets} from jsonb_populate_record(null::public.${qi(rel)}, ${src}::jsonb) v${where.length ? ` where ${where.join(" and ")}` : ""} returning ${a}.*)
      select coalesce(jsonb_agg(${proj}), '[]'::jsonb) rows from w ${a}`;
    const r = await db.query(sql, b.params);
    if (!returnRep) return { status: 204, body: null };
    return respond(r.rows[0].rows, { wantObject });
  }

  if (method === "DELETE") {
    const where = b.filterSql(opts.filters, a, rel);
    const proj = b.projection(rel, a, select, opts.embeds);
    const r = await db.query(`with w as (delete from public.${qi(rel)} ${a}${where.length ? ` where ${where.join(" and ")}` : ""} returning ${a}.*)
      select coalesce(jsonb_agg(${proj}), '[]'::jsonb) rows from w ${a}`, b.params);
    if (!returnRep) return { status: 204, body: null };
    return respond(r.rows[0].rows, { wantObject });
  }

  throw new RestError(405, { code: "PGRST000", message: `Method ${method} not supported`, details: null, hint: null });
}

function respond(rows, { wantObject, total = null, offset = 0, status = 200, head = false }) {
  const headers = {};
  const n = rows.length;
  headers["content-range"] = n ? `${offset}-${offset + n - 1}/${total ?? "*"}` : `*/${total ?? "*"}`;
  if (wantObject) {
    if (n !== 1) throw new RestError(406, { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned", details: `The result contains ${n} rows`, hint: null });
    return { status, headers, body: rows[0] };
  }
  return { status: head ? 200 : status, headers, body: head ? null : rows };
}

function toParam(value, type) {
  if (value === null || value === undefined) return null;
  if (type.endsWith("[]")) {
    if (!Array.isArray(value)) return value;
    return `{${value.map((x) => (x === null ? "NULL" : `"${String(x).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)).join(",")}}`;
  }
  if (type === "json" || type === "jsonb") return JSON.stringify(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

async function handleRpc({ db, cat, fn, method, params, body, wantObject, countMode }) {
  const overloads = cat.functions[fn];
  if (!overloads) throw new RestError(404, { code: "PGRST202", message: `Could not find the function public.${fn} in the schema cache`, details: null, hint: null });
  let args = body && typeof body === "object" && !Array.isArray(body) ? body : {};
  if (method === "GET" || method === "HEAD") { args = {}; for (const [k, v] of params) if (!["select", "order", "limit", "offset"].includes(k) && !v.includes(".")) args[k] = v; }
  const given = Object.keys(args).filter((k) => args[k] !== undefined);
  const f = overloads
    .filter((o) => given.every((g) => o.args.some((x) => x.name === g)) && o.args.slice(0, o.required).every((x) => given.includes(x.name)))
    .sort((x, y) => x.args.length - y.args.length)[0] || overloads[0];
  const b = new Builder(cat);
  const call = `public.${qi(fn)}(${f.args.filter((x) => given.includes(x.name)).map((x) => `${qi(x.name)} => ${b.p(toParam(args[x.name], x.type))}::${x.type}`).join(", ")})`;

  if (f.retset || f.composite) {
    const select = parseSelect(params.get("select"));
    const opts = parseParams(params, embedNamesOf(select));
    const a = "r";
    const where = b.filterSql(opts.filters, a, null);
    const whereSql = where.length ? ` where ${where.join(" and ")}` : "";
    const proj = select.length === 1 && select[0].type === "star" ? `to_jsonb(${a})` : b.projection(null, a, select, {});
    const lim = opts.limit != null ? ` limit ${Number(opts.limit)}` : "";
    const off = opts.offset != null ? ` offset ${Number(opts.offset)}` : "";
    const r = await db.query(`select coalesce(jsonb_agg(x.j), '[]'::jsonb) rows from (select ${proj} j from ${call} ${a}${whereSql}${b.orderSql(opts.order, a)}${lim}${off}) x`, b.params);
    let rows = r.rows[0].rows;
    if (!f.retset) {
      // a single composite: PostgREST returns the object (or null when all fields are null)
      const obj = rows[0] && Object.values(rows[0]).some((v) => v !== null) ? rows[0] : null;
      return { status: 200, headers: {}, body: obj };
    }
    let total = null;
    if (countMode) total = rows.length;
    return respond(rows, { wantObject, total, offset: Number(opts.offset || 0), head: method === "HEAD" });
  }
  const r = await db.query(`select to_jsonb(${call}) v`, b.params);
  return { status: 200, headers: {}, body: f.void ? null : r.rows[0].v };
}
