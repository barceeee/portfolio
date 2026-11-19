// Exercises client/rest.js against the built database (node tools/test-rest.mjs <dump.tar.gz>).
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { readFileSync } from "node:fs";
import { loadCatalog, handleRest } from "../client/rest.js";
const db = await PGlite.create({ extensions: { pgcrypto, pg_trgm, uuid_ossp }, loadDataDir: new Blob([readFileSync(process.argv[2])]) });
await db.exec("set search_path = public, extensions");
await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify({ sub: "00000000-0000-4000-a000-000000000001", email: "academic.head@sti360.demo", role: "authenticated" })]);
const cat = await loadCatalog(db);
const call = async (method, path, qs = "", body, h = {}) => {
  try { const r = await handleRest({ db, cat, method, path, params: new URLSearchParams(qs), headers: new Headers(h), body });
    return `${r.status} ${JSON.stringify(r.body)?.slice(0, 160)} ${r.headers?.["content-range"] || ""}`; }
  catch (e) { return `ERR ${e.status || ""} ${e.message}`; }
};
const t = [
  ["GET", "leads", "select=id,first_name,status,schools(name,type)&status=in.(new,contacted)&order=created_at.desc&limit=2", null, { prefer: "count=exact" }],
  ["GET", "leads", "select=first_name&or=(status.eq.lost,and(status.eq.new,source.eq.referral))&limit=3"],
  ["GET", "schools", "select=name,leads(count)&limit=2"],
  ["GET", "schools", "select=name,leads(first_name)&leads.limit=1&limit=1"],
  ["HEAD", "enrollments", "select=*&school_year=eq.2026-2027", null, { prefer: "count=exact" }],
  ["GET", "semester_settings", "select=school_year,semester&id=eq.1", null, { accept: "application/vnd.pgrst.object+json" }],
  ["PATCH", "semester_settings", "id=eq.1&select=*", { enrollment_open: false }, { prefer: "return=representation" }],
  ["POST", "scholarships", "select=id,name", { name: "Demo Grant", min_gwa: 80, coverage: "20% tuition" }, { prefer: "return=representation" }],
  ["POST", "programs", "on_conflict=code", [{ code: "BSIT", name: "BS Information Technology", sort_order: 1 }], { prefer: "resolution=merge-duplicates,return=representation" }],
  ["DELETE", "scholarships", "name=eq.Demo Grant", null, { prefer: "return=representation" }],
  ["GET", "enrollments", "select=first_name&first_name=ilike.*ann*&limit=2"],
  ["GET", "ched_hei_list", "select=institution_name&search_vec=wfts(simple).muntinlupa&limit=2"],
  ["GET", "scholarships", "select=name&requirements=cs.{Form 138}"],
  ["POST", "rpc/standing_counts", "", { p_category: "irregular" }],
  ["POST", "rpc/retention_students", "select=display_name&limit=2", { p_school_year: "2026-2027", p_semester: "1st Semester" }],
  ["POST", "rpc/check_archived_duplicate", "", { p_source_table: "leads", p_email: "x@y.z" }],
  ["POST", "rpc/fari_renumber_questions", "", {}],
];
for (const x of t) console.log(x[0], x[1], x[2]?.slice(0, 60), "=>", await call(...x));
await db.close();
