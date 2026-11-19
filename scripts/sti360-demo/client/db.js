// The demo's database: Postgres compiled to WebAssembly (PGlite), started from the
// prebuilt sample-data dump and kept in IndexedDB so a visitor's changes survive a reload.
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp";
import { loadCatalog } from "./rest.js";

export const DB_VERSION = "sti360-demo-v1";
const READY_KEY = `${DB_VERSION}:ready`;
const extensions = { pgcrypto, pg_trgm, uuid_ossp };

let ready = null;

function storage() {
  try { return window.localStorage; } catch { return null; }
}

async function open() {
  const ls = storage();
  const persisted = ls?.getItem(READY_KEY) === "1" && "indexedDB" in window;
  const dumpUrl = `${import.meta.env.BASE_URL}sti360-demo.tar.gz`;
  status("Starting the in-browser database…");
  if (persisted) {
    try {
      const db = await PGlite.create(`idb://${DB_VERSION}`, { extensions, relaxedDurability: true });
      await db.query("select 1 from public.semester_settings limit 1");
      return db;
    } catch (e) {
      console.warn("[demo] saved database unusable, loading a fresh copy", e);
      ls?.removeItem(READY_KEY);
      try { indexedDB.deleteDatabase(`/pglite/${DB_VERSION}`); } catch { /* ignore */ }
    }
  }
  // A half-written copy (e.g. a reload during the first load) is replaced, not merged.
  await new Promise((res) => {
    try { const r = indexedDB.deleteDatabase(`/pglite/${DB_VERSION}`); r.onsuccess = r.onerror = r.onblocked = () => res(); } catch { res(); }
  });
  status("Downloading sample data…");
  const blob = await (await fetch(dumpUrl)).blob();
  status("Loading sample data…");
  let db;
  try {
    db = await PGlite.create(`idb://${DB_VERSION}`, { extensions, loadDataDir: blob, relaxedDurability: true });
    ls?.setItem(READY_KEY, "1");
  } catch (e) {
    console.warn("[demo] IndexedDB unavailable, changes won't be kept", e);
    db = await PGlite.create({ extensions, loadDataDir: blob });
  }
  return db;
}

function status(text) {
  window.dispatchEvent(new CustomEvent("sti360-demo-status", { detail: text }));
}

export function getDb() {
  if (!ready) {
    ready = (async () => {
      const db = await open();
      await db.exec("set search_path = public, extensions;");
      const cat = await loadCatalog(db);
      status("");
      return { db, cat };
    })();
  }
  return ready;
}

// One request at a time: the request's identity (request.jwt.claims) and its queries
// must not interleave with another request's.
let chain = Promise.resolve();
export function withDb(claims, fn) {
  const run = chain.then(async () => {
    const { db, cat } = await getDb();
    await db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(claims || {})]);
    return fn(db, cat);
  });
  chain = run.catch(() => null);
  return run;
}

export async function resetDemoDatabase() {
  storage()?.removeItem(READY_KEY);
  await new Promise((res) => {
    const r = indexedDB.deleteDatabase(`/pglite/${DB_VERSION}`);
    r.onsuccess = r.onerror = r.onblocked = () => res();
  });
}
