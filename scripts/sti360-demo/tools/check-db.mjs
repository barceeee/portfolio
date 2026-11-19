import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { readFileSync } from "node:fs";
const db = await PGlite.create({ extensions: { pgcrypto, pg_trgm, uuid_ossp }, loadDataDir: new Blob([readFileSync(process.argv[2])]) });
const as = async (sub, email, sql) => {
  await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify({ sub, email, role: "authenticated" })]);
  try { const r = await db.query(sql); return JSON.stringify(r.rows).slice(0, 300); } catch (e) { return "ERR " + e.message; }
};
const A = ["00000000-0000-4000-a000-000000000001", "academic.head@sti360.demo"];
const S = ["00000000-0000-4000-a000-000000000002", "bianca.reyes@sti360.demo"];
for (const q of ["select * from get_my_authorized_account()", "select standing_counts()", "select retention_summary('2026-2027','1st Semester')", "select get_superuser_status()",
  "select superuser_failsafe_check()", "select form138_status_counts()", "select fari_question_counts()", "select * from archive_modules()", "select count(*) from fari_submissions_program_v",
  "select count(*) from standing_students_v", "select count(*) from scholar_batch_v", "select count(*) from enrollment_list_v", "select count(*), min(wss), max(wss) from fari_submissions", "select session_heartbeat()", "select count(*) from public.users"])
  { const t0 = Date.now(); const r = await as(...A, q); console.log(Date.now() - t0, "ms", q, "=>", r); }
console.log("student:", await as(...S, "select * from get_my_authorized_account()"));
