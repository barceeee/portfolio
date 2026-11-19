// Builds the offline STI-360 demo into /demos/sti-360/app:
//   1. Vite build of the real STI-360 app (its own vite.config.js), with src/lib/supabase.js
//      swapped for ./client/supabase.js and no .env (no real project URL or keys get in).
//   2. The sample database dump (build-db.mjs) next to it.
// Usage: node build.mjs            (expects the STI-360 repo at ../../../sti-360, or set STI360_REPO)
import { mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(process.env.STI360_REPO || join(here, "../../../sti-360"));
const portfolio = resolve(here, "../..");
const outDir = join(portfolio, "demos/sti-360/app");
const BASE = "/demos/sti-360/app/";
if (!existsSync(join(repo, "src/lib/supabase.js"))) throw new Error(`STI-360 repo not found at ${repo} (set STI360_REPO)`);

const { build } = await import(pathToFileURL(join(repo, "node_modules/vite/dist/node/index.js")).href);
const norm = (p) => resolve(p).replace(/\\/g, "/").toLowerCase();
const realClient = norm(join(repo, "src/lib/supabase.js"));
const demoClient = join(here, "client/supabase.js");
const emptyEnv = join(here, ".no-env");
mkdirSync(emptyEnv, { recursive: true });

const demoPlugin = {
  name: "sti360-demo",
  enforce: "pre",
  async resolveId(source, importer) {
    if (!importer || !/supabase(\.js)?$/.test(source) || source.startsWith("@")) return null;
    if (norm(importer) === norm(demoClient)) return null;
    const r = await this.resolve(source, importer, { skipSelf: true });
    return r && norm(r.id) === realClient ? demoClient : null;
  },
  transform(code, id) {
    // The app lives under /demos/sti-360/app, not at the site root.
    if (norm(id).endsWith("/src/main.jsx")) return code.replace("<BrowserRouter>", `<BrowserRouter basename="${BASE.slice(0, -1)}">`);
    return null;
  },
  transformIndexHtml(html) {
    const banner = `
<style>
  #sti360-demo-bar{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:2147483000;display:flex;gap:10px;align-items:center;
    background:rgba(17,17,20,.92);color:#f4f4f6;font:500 12.5px/1.3 system-ui,sans-serif;padding:7px 12px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.3)}
  #sti360-demo-bar a{color:#fbbf24;text-decoration:none;font-weight:700}
  #sti360-demo-bar a:focus-visible{outline:2px solid #fbbf24;outline-offset:2px}
  #sti360-demo-status:empty{display:none}
  @media (max-width:600px){#sti360-demo-bar{bottom:8px;font-size:11.5px}}
</style>
<div id="sti360-demo-bar" role="note"><span>Offline demo · sample data only</span><span id="sti360-demo-status" role="status" aria-live="polite"></span><a href="/demos/sti-360">Switch role</a></div>
<script>window.addEventListener('sti360-demo-status',function(e){var s=document.getElementById('sti360-demo-status');if(s)s.textContent=e.detail?'· '+e.detail:'';});</script>`;
    return html
      .replace(/<title>[^<]*<\/title>/, "<title>STI-360 — Offline Demo</title>")
      .replace(/<!--[^]*?-->\s*<link rel="preconnect"[^>]*>/, "")
      .replace(/<link rel="preconnect"[^>]*>/, "")
      .replace(/<meta name="robots"[^>]*>/, "")
      .replace("</head>", '<meta name="robots" content="noindex">\n</head>')
      .replace("</body>", `${banner}\n</body>`);
  },
};

await build({
  root: repo,
  configFile: join(repo, "vite.config.js"),
  base: BASE,
  envDir: emptyEnv,
  mode: "production",
  logLevel: "warn",
  plugins: [demoPlugin],
  resolve: {
    alias: [{ find: /^@supabase\/supabase-js$/, replacement: join(repo, "node_modules/@supabase/supabase-js") }],
  },
  optimizeDeps: { exclude: ["@electric-sql/pglite"] },
  build: { outDir, emptyOutDir: true, sourcemap: false, chunkSizeWarningLimit: 4000 },
  worker: { format: "es" },
});
// The real site's public files (search-console token, sitemap, robots) don't belong here.
for (const f of readdirSync(outDir)) if (/^google.*\.html$|^sitemap\.xml$|^robots\.txt$|^vite\.svg$/.test(f)) rmSync(join(outDir, f));
console.log("app built ->", outDir);

execFileSync(process.execPath, [join(here, "build-db.mjs"), join(outDir, "sti360-demo.tar.gz")], { stdio: "inherit", env: { ...process.env, STI360_REPO: repo } });
console.log("done");
