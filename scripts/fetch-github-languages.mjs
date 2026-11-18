// Refreshes data/github-languages.json from GitHub's public API (no token needed).
// Run: npm run languages
// Private repos can't be read without a login; list them under "manual" in the JSON by hand.
import { readFile, writeFile } from "node:fs/promises";

const USER = "barceeee";
const FILE = new URL("../data/github-languages.json", import.meta.url);
// GitHub's detector sometimes labels PHP files as Hack (a PHP dialect); count them as PHP.
const ALIASES = { Hack: "PHP" };

const api = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-languages" } });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${res.statusText}`);
  return res.json();
};

const existing = await readFile(FILE, "utf8").then(JSON.parse).catch(() => ({}));
const repos = (await api(`/users/${USER}/repos?per_page=100`)).filter((r) => !r.fork);
const out = {};
for (const r of repos) {
  const langs = await api(`/repos/${USER}/${r.name}/languages`);
  const merged = {};
  for (const [lang, bytes] of Object.entries(langs)) {
    const name = ALIASES[lang] || lang;
    merged[name] = (merged[name] || 0) + bytes;
  }
  if (Object.keys(merged).length) out[r.name] = merged;
}

const data = { user: USER, updated: new Date().toISOString().slice(0, 10), repos: out, manual: existing.manual || {} };
await writeFile(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(`Saved ${Object.keys(out).length} public repos (+ ${Object.keys(data.manual).length} manual) to data/github-languages.json`);
