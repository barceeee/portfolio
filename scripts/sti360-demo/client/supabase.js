// Demo build replacement for STI-360's src/lib/supabase.js. Same exports, but the client
// never talks to the network: its fetch is answered by the in-browser database, sign-in
// is a pre-made demo session, and realtime/storage/edge functions are local stand-ins.
import { createClient } from "@supabase/supabase-js";
import { withDb } from "./db.js";
import { handleRest, RestError } from "./rest.js";
import { invokeFunction } from "./functions.js";

export const DB_REGION = "ap-southeast-1";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // /demos/sti-360/app
const supabaseUrl = `${window.location.origin}/__sti360-demo-api`;
const b64url = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const fakeJwt = (payload) => `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(payload)}.demo-signature`;
const supabaseAnonKey = fakeJwt({ role: "anon", iss: "sti360-demo" });
const storageKey = "sti-session-demo";

export const DEMO_USERS = {
  admin:   { id: "00000000-0000-4000-a000-000000000001", email: "academic.head@sti360.demo", name: "Teresa Villanueva", session: "00000000-0000-4000-b000-000000000001" },
  student: { id: "00000000-0000-4000-a000-000000000002", email: "bianca.reyes@sti360.demo", name: "Bianca Reyes", session: "00000000-0000-4000-b000-000000000002" },
};

function sessionFor(role) {
  const u = DEMO_USERS[role];
  const exp = Math.floor(Date.now() / 1000) + 10 * 365 * 86400;
  const user = {
    id: u.id, aud: "authenticated", role: "authenticated", email: u.email,
    app_metadata: { provider: "google", providers: ["google"] },
    user_metadata: { full_name: u.name, name: u.name, email: u.email },
    created_at: "2025-06-01T00:00:00Z", last_sign_in_at: "2026-11-18T08:00:00Z", identities: [],
  };
  const claims = { sub: u.id, email: u.email, role: "authenticated", aud: "authenticated", exp, session_id: u.session, user_metadata: user.user_metadata, app_metadata: user.app_metadata };
  return { access_token: fakeJwt(claims), refresh_token: `demo-refresh-${role}`, token_type: "bearer", expires_in: exp - Math.floor(Date.now() / 1000), expires_at: exp, user };
}

// The launcher opens /admin or /student: sign in as that demo account.
const path = window.location.pathname.slice(BASE.length) || "/";
const wanted = path.startsWith("/admin") ? "admin" : path.startsWith("/student") ? "student" : null;
function currentRole() {
  try {
    const s = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    return Object.keys(DEMO_USERS).find((k) => DEMO_USERS[k].id === s?.user?.id) || null;
  } catch { return null; }
}
if (wanted && currentRole() !== wanted) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(sessionFor(wanted)));
    // the app caches the last authorization per tab; start clean for the new role
    Object.keys(window.sessionStorage).filter((k) => k.startsWith("sti360:")).forEach((k) => window.sessionStorage.removeItem(k));
  } catch { /* storage blocked: the app will show its sign-in page */ }
}

function claimsFromAuth(header) {
  const token = (header || "").replace(/^Bearer\s+/i, "");
  try { return JSON.parse(decodeURIComponent(escape(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))))); } catch { return { role: "anon" }; }
}

const json = (status, body, headers = {}) => new Response(body == null ? null : JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

async function demoFetch(input, init = {}) {
  const req = input instanceof Request ? input : null;
  const url = new URL(req ? req.url : String(input));
  if (!url.pathname.startsWith("/__sti360-demo-api/")) return fetch(input, init);
  const method = (init.method || req?.method || "GET").toUpperCase();
  const headers = new Headers(init.headers || req?.headers || {});
  let body = init.body ?? (req ? await req.text() : undefined);
  const route = url.pathname.slice("/__sti360-demo-api/".length);
  const claims = claimsFromAuth(headers.get("authorization"));

  try {
    if (route.startsWith("rest/v1/")) {
      let parsed = null;
      if (typeof body === "string" && body) parsed = JSON.parse(body);
      const res = await withDb(claims, (db, cat) => handleRest({ db, cat, method, path: route.slice(8), params: url.searchParams, headers, body: parsed }));
      return json(res.status, res.body, res.headers);
    }
    if (route.startsWith("auth/v1/")) return authRoute(route.slice(8), method, claims, url);
    if (route.startsWith("functions/v1/")) {
      let parsed = null;
      try { parsed = typeof body === "string" && body ? JSON.parse(body) : null; } catch { parsed = null; }
      const res = await invokeFunction(route.slice(13), parsed, claims, withDb);
      return json(res.status ?? 200, res.body);
    }
    if (route.startsWith("storage/v1/")) {
      if (method === "POST" && route.includes("/list/")) return json(200, []);
      return json(400, { statusCode: "400", error: "Demo", message: "Files aren't stored in the offline demo." });
    }
    return json(404, { message: "Not available in the demo" });
  } catch (e) {
    if (e instanceof RestError) return json(e.status, e.body);
    const status = e.code === "42501" ? 403 : e.code === "23505" ? 409 : e.code === "P0001" ? 400 : 400;
    console.warn("[demo db]", e.message, e.query || "");
    return json(status, { code: e.code || "XX000", message: e.message, details: e.detail ?? null, hint: e.hint ?? null });
  }
}

function authRoute(route, method, claims, url) {
  const role = Object.keys(DEMO_USERS).find((k) => DEMO_USERS[k].id === claims.sub);
  if (route.startsWith("user")) return role ? json(200, sessionFor(role).user) : json(401, { code: 401, msg: "Not signed in" });
  if (route.startsWith("token")) {
    const r = currentRole();
    return r ? json(200, sessionFor(r)) : json(400, { error: "invalid_grant", error_description: "Demo session ended" });
  }
  if (route.startsWith("logout")) return new Response(null, { status: 204 });
  return json(200, {});
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, storageKey, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: demoFetch },
});

// Sign-in buttons: Google sign-in isn't available offline; go back to the demo launcher.
supabase.auth.signInWithOAuth = async () => { window.location.assign(BASE.replace(/\/app$/, "")); return { data: {}, error: null }; };

// Realtime: no server. Channels "subscribe" at once and never deliver changes; screens
// still refresh after their own saves and on their timers.
const fakeChannel = (name) => {
  const ch = {
    topic: `realtime:${name}`, state: "joined",
    on() { return ch; },
    subscribe(cb) { setTimeout(() => cb?.("SUBSCRIBED"), 0); return ch; },
    unsubscribe() { return Promise.resolve("ok"); },
    send() { return Promise.resolve("ok"); },
    track() { return Promise.resolve("ok"); },
    untrack() { return Promise.resolve("ok"); },
    presenceState() { return {}; },
  };
  return ch;
};
supabase.channel = (name) => fakeChannel(name);
supabase.removeChannel = () => Promise.resolve("ok");
supabase.removeAllChannels = () => Promise.resolve([]);
supabase.getChannels = () => [];
supabase.realtime.setAuth = () => Promise.resolve();
supabase.realtime.connect = () => {};

/**
 * Every row of a query, fetched in pages (same helper as the real app).
 */
export async function fetchAllRows(build, pageSize = 1000, parallel = 1) {
  const rows = [];
  for (let first = 0; ; first += parallel) {
    const pages = await Promise.all(
      Array.from({ length: parallel }, (_, i) => {
        const from = (first + i) * pageSize;
        return build().range(from, from + pageSize - 1);
      }),
    );
    for (const { data, error } of pages) {
      if (error) return { data: rows, error };
      rows.push(...(data || []));
      if (!data || data.length < pageSize) return { data: rows, error: null };
    }
  }
}
