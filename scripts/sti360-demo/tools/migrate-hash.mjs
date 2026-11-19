// Dev tool: stubs + tables + every repo migration (statement by statement), then md5 of
// each function/view/trigger definition, to compare against the live catalog so only the
// definitions that differ need to be fetched.
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { splitSql } from "./split-sql.mjs";

const migDir = `${process.env.STI360_REPO || "../../../sti-360"}/supabase/migrations`;
const db = await PGlite.create({ extensions: { pgcrypto, pg_trgm, uuid_ossp } });
await db.exec(readFileSync("supabase-stubs.sql", "utf8"));
await db.exec("set check_function_bodies = off;");
await db.exec(readFileSync("schema/01-tables.sql", "utf8"));
await db.exec(readFileSync("schema/02-constraints.sql", "utf8"));

const TX = /^(begin|commit|start transaction|end)( transaction| work)?$/i;
const stripComments = (s) => s.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n").trim();
const files = readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort();
let ok = 0, bad = 0;
for (const f of files) {
  const sql = readFileSync(`${migDir}/${f}`, "utf8").replace(/create extension if not exists pg_net[^;]*;/gi, "");
  for (const st of splitSql(sql)) {
    if (TX.test(stripComments(st))) continue;
    try { await db.exec(st); ok++; }
    catch (e) {
      bad++;
      try { await db.exec("rollback"); } catch { /* not in a transaction */ }
      if (process.env.V) console.log(`FAIL ${f}: ${String(e.message).split("\n")[0]}`);
    }
  }
}
console.log(`${ok} statements ok, ${bad} failed`);

const q = (s) => db.query(s).then((r) => r.rows);
const funcs = await q(`select p.proname||'('||pg_get_function_identity_arguments(p.oid)||')' k, md5(pg_get_functiondef(p.oid)) h
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace left join pg_depend d on d.objid=p.oid and d.deptype='e'
  where n.nspname='public' and d.objid is null and p.prokind in ('f','p')`);
const views = await q(`select c.relname k, md5(pg_get_viewdef(c.oid)) h from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and relkind in ('v','m')`);
const trig = await q(`select n.nspname||'.'||c.relname||'.'||t.tgname k, md5(pg_get_triggerdef(t.oid)) h
  from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
  where n.nspname in ('public','auth','storage') and not t.tgisinternal`);
if (process.env.HASHES) writeFileSync(process.env.HASHES, JSON.stringify({ funcs, views, trig }));
console.log(funcs.length, "funcs", views.length, "views", trig.length, "triggers");

// Export the definitions that are identical on the live project (hash prefixes / names
// confirmed against the live catalog) so the schema files hold the live versions only.
const LIVE_FUNCS = "82e7d4e12f,017c4ca24a,60ffdeb7cc,8ed0788fb7,01bf4f1849,2cb4153c67,f521334b39,dfe772f3c8,2bbc5fa02f,7024b817a9,2e1165c798,ceaab7619c,e60abc5cb4,d27133e442,8e247a7fb0,c4ddb4ecbe,85569d64fa,0b85bc8425,e49e3499ef,6a0203cb79,9486c5a022,e221bfcd4d,78720ca47e,c9c567d8af,1bd4111865,77ff661afc".split(",");
const LIVE_VIEWS = "school_lead_counts_v,student_standing_flags,enrollment_classification,fari_submissions_program_v,school_origin_v,scholar_batch_v,standing_students_v,leads_list_v,enrollment_list_v,qualified_leads_v,temp_accounts_v,form138_students_v,document_students_v".split(",");
const fdefs = await q(`select pg_get_functiondef(p.oid) d, left(md5(pg_get_functiondef(p.oid)),10) h from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.prokind='f' order by p.proname`);
const keep = fdefs.filter((r) => LIVE_FUNCS.includes(r.h));
writeFileSync("schema/03-functions-from-migrations.sql",
  "-- Functions identical on the live project and in the repo migrations (md5-checked).\n" + keep.map((r) => r.d.replace(/\r/g, "") + ";\n").join("\n"));
const vdefs = await q(`select c.relname n, pg_get_viewdef(c.oid) d from pg_class c join pg_namespace s on s.oid=c.relnamespace where s.nspname='public' and relkind='v'`);
const vk = vdefs.filter((r) => LIVE_VIEWS.includes(r.n));
writeFileSync("schema/04-views-from-migrations.sql",
  "-- Views identical on the live project and in the repo migrations (md5-checked).\n" + vk.map((r) => `create or replace view public.${r.n} as\n${r.d}\n`).join("\n"));
console.log("exported", keep.length, "functions,", vk.length, "views");
