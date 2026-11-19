# STI-360 offline demo

Builds `/demos/sti-360` of the portfolio: the real STI-360 React app, running in the
browser against Postgres compiled to WebAssembly ([PGlite](https://pglite.dev) 0.5.12),
with made-up sample data. It never contacts Supabase or any other server.

```
npm install            # once (PGlite)
node build.mjs         # Vite build of ../../../sti-360 + database dump -> demos/sti-360/app
```

Set `STI360_REPO` if the STI-360 repo isn't next to the portfolio. The STI-360 repo needs
its own `npm install`. Its `.env` is **not** used (the build points Vite at an empty env
dir), so no real project URL or key ends up in the bundle.

## How it works

| Piece | What it does |
|---|---|
| `supabase-stubs.sql` | Stand-ins for Supabase's built-in schemas: `auth.uid()/jwt()/role()`, `auth.users`, storage, pg_cron, vault, pg_net, roles. |
| `schema/*.sql` | The STI-360 database **structure only** (no rows), read from the live project's catalog: tables, constraints, indexes, 112 functions, 23 views, 53 triggers. `03-functions-from-migrations.sql` / `04-views-from-migrations.sql` are the definitions identical in the repo migrations (md5-checked); the rest is copied from `pg_get_functiondef` / `pg_get_viewdef` / `pg_get_triggerdef`. The exam-taker functions (`exam_login`, `exam_submit`, ...) are left out: the demo has the Admin and Student dashboards only. |
| `seed.mjs` | Sample data: fake students, leads, enrollments over five terms, grades, scholarships, FARI exam results, graduates, tracer surveys, reports. Schools are public institution names; the CHED list comes from `sti-360/data`. |
| `build-db.mjs` | Applies stubs + schema + seed in PGlite and writes `app/sti360-demo.tar.gz` (`dumpDataDir`). |
| `client/supabase.js` | Replaces `src/lib/supabase.js` in the demo build. A real supabase-js client whose `fetch` is answered locally; a demo session (fake JWT) for the role in the URL (`/app/admin`, `/app/student`); realtime channels are no-ops. |
| `client/rest.js` | PostgREST stand-in: select with embedded resources, filters (`eq`…`fts`, `or`/`and`/`not`), order, limit/offset, counts, single/maybeSingle, insert/upsert/update/delete, and `rpc/<fn>` calling the real SQL functions with `request.jwt.claims` set per request. |
| `client/functions.js` | Edge-function stand-ins (`analyze-assessment` returns a rule-based sample analysis instead of Gemini). |
| `client/db.js` | Loads the dump into PGlite, kept in IndexedDB (`/pglite/sti360-demo-v1`) so changes survive reloads. Bump `DB_VERSION` when the seed changes. |

`demos/sti-360/index.html` is the launcher: nothing loads until the visitor presses
*Launch as Admin* or *Launch as Student*. The app's routes (`/demos/sti-360/app/admin`,
`/student`, `/login`) are rewritten to its `index.html` in `vercel.json` and `serve.json`.

### Refreshing the schema

When the live schema changes, re-read the definitions that changed (structure only, never
rows) into `schema/`. `tools/migrate-hash.mjs` replays the repo migrations and prints md5
hashes so only definitions that differ from the migrations need copying.
`tools/test-rest.mjs <dump>` and `tools/check-db.mjs <dump>` are quick checks of the
emulator and the SQL functions.
