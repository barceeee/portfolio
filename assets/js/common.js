// Shared helpers for every page. No framework, no build step.

/** True on localhost — enables "fill this in" notes that never show in production. */
export const isDev = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Small element builder. Text is always set with textContent (no HTML injection). */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false || c === "") continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/** Only http(s), mailto and same-site paths are rendered as links. */
export function safeUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  try {
    const u = new URL(url);
    return ["http:", "https:", "mailto:"].includes(u.protocol) ? u.href : "";
  } catch { return ""; }
}

export const has = (v) => Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && String(v).trim() !== "";

async function getJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
  return res.json();
}

/** Loads profile, category config and every category's entries. */
export async function loadSite() {
  const [profile, categories] = await Promise.all([getJSON("/data/profile.json"), getJSON("/data/categories.json")]);
  const lists = await Promise.all(categories.map((c) => getJSON(`/data/${c.file}`).catch((e) => { console.error(e); return []; })));
  categories.forEach((c, i) => {
    c.items = lists[i].map((item, j) => ({ ...item, _cat: c, _key: item.slug || item.id || `${c.id}-${j}` }));
  });
  return { profile, categories };
}

export const caseStudyUrl = (item) => (item._cat.caseStudies && item.slug ? `/projects/${encodeURIComponent(item.slug)}` : "");

export function initials(text = "") {
  return text.replace(/\(.*?\)/g, "").split(/[\s-]+/).filter(Boolean).slice(0, 3).map((w) => w[0]).join("").toUpperCase();
}

/** Nav turns solid after the user scrolls past the top. */
export function initNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const update = () => nav.classList.toggle("is-solid", window.scrollY > 24);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

export function renderBrand(profile) {
  const name = profile.name || "Portfolio";
  document.querySelectorAll("[data-brand]").forEach((el) => { el.textContent = name.split(" ")[0]; });
  document.querySelectorAll("[data-name]").forEach((el) => { el.textContent = name; });
}

export function renderFooter(profile) {
  const footer = document.querySelector(".footer");
  if (!footer) return;
  const links = [
    profile.email && { label: "Email", url: `mailto:${profile.email}` },
    profile.resumeUrl && { label: "Résumé", url: profile.resumeUrl },
    ...(profile.socials || []),
  ].filter((l) => l && safeUrl(l.url));
  footer.replaceChildren(
    h("p", { style: "margin:0" }, `© ${new Date().getFullYear()} ${profile.name || ""}`),
    links.length ? h("ul", {}, links.map((l) => h("li", {}, h("a", { href: safeUrl(l.url), rel: "noopener", target: l.url.startsWith("mailto:") ? null : "_blank" }, l.label)))) : null
  );
}

/** Sets canonical + og:url from wherever the site is served — no hard-coded domain. */
export function setCanonical(profile) {
  const base = (profile.siteUrl || location.origin).replace(/\/$/, "");
  const href = base + location.pathname.replace(/\.html$/, "").replace(/\/index$/, "/");
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) { link = h("link", { rel: "canonical" }); document.head.append(link); }
  link.href = href;
  const og = document.querySelector('meta[property="og:url"]');
  if (og) og.content = href;
}

export function devNote(text) {
  return isDev ? h("p", { class: "dev-note", role: "note" }, "Author note (localhost only): ", text) : null;
}

/** Pause the hero's endless background motion while it's scrolled out of view (saves GPU work). */
export function pauseHeroWhenOffscreen() {
  const hero = document.querySelector(".hero, .study-hero");
  if (!hero || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(([e]) => hero.classList.toggle("is-offscreen", !e.isIntersecting)).observe(hero);
}

/* ---------- GitHub language bars (data/github-languages.json, refreshed with `npm run languages`) ---------- */
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", HTML: "#e34c26", CSS: "#663399", PHP: "#4F5D95",
  "C#": "#178600", PLpgSQL: "#336790", TSQL: "#e38c00", Python: "#3572A5", Java: "#b07219", Hack: "#878787",
};
const LANG_LABELS = { PLpgSQL: "PL/pgSQL", TSQL: "T-SQL" };

export async function loadLanguages() {
  try {
    const res = await fetch("/data/github-languages.json", { cache: "no-cache" });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

/** Byte counts for one repo (public or manual), or summed across all of them when repo is omitted. */
export function repoLanguages(gh, repo) {
  if (!gh) return null;
  const all = { ...(gh.repos || {}), ...(gh.manual || {}) };
  if (repo) return all[repo] || null;
  const sum = {};
  for (const langs of Object.values(all)) for (const [l, b] of Object.entries(langs)) sum[l] = (sum[l] || 0) + b;
  return Object.keys(sum).length ? sum : null;
}

/** GitHub-style stacked bar + legend. Languages under 1% are grouped as "Other". */
export function languageBar(langs, { caption } = {}) {
  if (!langs) return null;
  const total = Object.values(langs).reduce((a, b) => a + b, 0);
  if (!total) return null;
  let rows = Object.entries(langs).map(([l, b]) => [l, (b / total) * 100]).sort((a, b) => b[1] - a[1]);
  const small = rows.filter(([, p]) => p < 1);
  rows = rows.filter(([, p]) => p >= 1);
  if (small.length) rows.push(["Other", small.reduce((a, [, p]) => a + p, 0)]);
  const color = (l) => LANG_COLORS[l] || "#8b8b95";
  const name = (l) => LANG_LABELS[l] || l;
  return h("div", { class: "langbar" },
    caption ? h("p", { class: "langbar__caption" }, caption) : null,
    h("div", { class: "langbar__track", role: "img", "aria-label": rows.map(([l, p]) => `${name(l)} ${p.toFixed(1)}%`).join(", ") },
      rows.map(([l, p]) => h("span", { style: `width:${p}%;background:${color(l)}`, title: `${name(l)} ${p.toFixed(1)}%` }))),
    h("ul", { class: "langbar__legend" }, rows.map(([l, p]) =>
      h("li", {}, h("i", { style: `background:${color(l)}`, "aria-hidden": "true" }), h("b", {}, name(l)), ` ${p.toFixed(1)}%`))));
}
