// Builds the demo database: Supabase stand-ins + the STI-360 schema (read from the live
// catalog, structure only) + made-up sample data, then saves a PGlite data-dir dump that
// the browser loads. Usage: node build-db.mjs [out.tar.gz]
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSeed, authSql } from "./seed.mjs";
import { splitSql } from "./tools/split-sql.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || join(here, "../../demos/sti-360/app/sti360-demo.tar.gz");
const chedCsv = process.env.STI360_REPO
  ? join(process.env.STI360_REPO, "data/List of Higher Education Institutions_10302026.csv")
  : join(here, "../../../sti-360/data/List of Higher Education Institutions_10302026.csv");

const db = await PGlite.create({ extensions: { pgcrypto, pg_trgm, uuid_ossp } });
const read = (f) => readFileSync(join(here, f), "utf8");

await db.exec(read("supabase-stubs.sql"));
await db.exec("set check_function_bodies = off;");
const files = readdirSync(join(here, "schema")).filter((f) => f.endsWith(".sql")).sort();
let viewsDone = false;
for (const f of files) {
  if (!f.startsWith("04-")) { await db.exec(read(`schema/${f}`)); continue; }
  if (viewsDone) continue;
  viewsDone = true;
  // Views reference each other: create them in passes until every one exists.
  let pending = files.filter((x) => x.startsWith("04-")).flatMap((x) => splitSql(read(`schema/${x}`)));
  for (let pass = 0; pending.length && pass < 10; pass++) {
    const next = [];
    for (const st of pending) { try { await db.exec(st); } catch (e) { next.push(st); if (pass === 9) console.error(String(e.message)); } }
    pending = next;
  }
  if (pending.length) throw new Error(`${pending.length} views could not be created`);
}
console.log("schema ok");

// ---- seed ----
const T = buildSeed({ chedCsvPath: chedCsv });
await db.exec("set sti.skip_audit = 'on';");
const order = ["programs", "semester_settings", "scholarships", "curriculum_subjects", "sections", "schools", "ched_hei_list", "deped_masterlist",
  "leads", "enrollments", "enrollment_requirements", "scholar_batch", "graduating_students", "employment_surveys", "fari_questions",
  "temp_exam_accounts", "fari_submissions", "form138_grades", "at_risk_cases", "counseling_records", "authorized_accounts"];
await db.exec(authSql()); // before accounts: their trigger fills public.users from auth.users
for (const table of order) await insertRows(table, T[table] || []);
for (const table of ["reports", "student_profiles", "student_grades", "archived_records", "audit_logs"]) await insertRows(table, T[table] || []);
await db.exec("reset sti.skip_audit;");

async function insertRows(table, rows) {
  if (!rows.length) return;
  const groups = new Map();
  for (const r of rows) { const k = Object.keys(r).join(","); (groups.get(k) || groups.set(k, []).get(k)).push(r); }
  for (const [k, list] of groups) {
    const cols = k.split(",").map((c) => `"${c}"`).join(", ");
    try {
      await db.query(`insert into public.${table} (${cols}) select ${cols} from jsonb_populate_recordset(null::public.${table}, $1::jsonb)`, [JSON.stringify(list)]);
    } catch (e) { throw new Error(`seed ${table}: ${e.message}`); }
  }
}

const counts = await db.query(`select relname, n_live_tup from pg_stat_user_tables where schemaname='public' and n_live_tup > 0 order by relname`);
console.log(counts.rows.map((r) => `${r.relname}:${r.n_live_tup}`).join(" "));
await db.exec("vacuum analyze;");
const dump = await db.dumpDataDir("gzip");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(await dump.arrayBuffer()));
console.log("wrote", out, (dump.size / 1e6).toFixed(1), "MB");
