// Splits a SQL script into statements, respecting quotes, dollar-quotes and comments.
export function splitSql(sql) {
  const out = []; let cur = ""; let i = 0;
  while (i < sql.length) {
    const c = sql[i], n = sql[i + 1];
    if (c === "-" && n === "-") { const e = sql.indexOf("\n", i); const j = e < 0 ? sql.length : e; cur += sql.slice(i, j); i = j; continue; }
    if (c === "/" && n === "*") { const e = sql.indexOf("*/", i + 2); const j = e < 0 ? sql.length : e + 2; cur += sql.slice(i, j); i = j; continue; }
    if (c === "'" ) { let j = i + 1; while (j < sql.length) { if (sql[j] === "'" && sql[j + 1] === "'") j += 2; else if (sql[j] === "'") break; else j++; } cur += sql.slice(i, j + 1); i = j + 1; continue; }
    if (c === '"') { const e = sql.indexOf('"', i + 1); cur += sql.slice(i, e + 1); i = e + 1; continue; }
    if (c === "$") { const m = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i)); if (m) { const tag = m[0]; const e = sql.indexOf(tag, i + tag.length); const j = e < 0 ? sql.length : e + tag.length; cur += sql.slice(i, j); i = j; continue; } }
    if (c === ";") { if (cur.trim()) out.push(cur.trim()); cur = ""; i++; continue; }
    cur += c; i++;
  }
  if (cur.replace(/--[^\n]*/g, "").trim()) out.push(cur.trim());
  return out;
}
