import { h, has, isDev, safeUrl, loadSite, caseStudyUrl, initials, initNav, renderBrand, renderFooter, setCanonical, devNote, reducedMotion } from "./common.js";

const main = document.getElementById("main");
const dialog = document.getElementById("details");

init().catch((err) => {
  console.error(err);
  main.replaceChildren(h("p", { class: "state" }, "Couldn’t load the portfolio data. If you opened the file directly, run a local server (see README)."));
});

async function init() {
  initNav();
  const { profile, categories } = await loadSite();
  renderBrand(profile);
  renderFooter(profile);
  setCanonical(profile);
  document.title = profile.name ? `${profile.name} — Portfolio` : "Portfolio";

  const all = categories.flatMap((c) => c.items);
  const featured = all.find((i) => i.featured) || all[0];
  const skills = await fetch("/data/skills.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

  renderNavLinks(categories);
  main.replaceChildren(
    renderHero(featured, profile, categories),
    renderTop10(skills),
    renderSoftSkills(skills),
    ...clustered(categories),
    renderCaseStudies(categories)
  );
  observeEntrances();
}

/* ---------- Stats strip (computed from the data, nothing hard-coded) ---------- */
function computeStats(categories) {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c.items]));
  const work = ["capstone", "freelancing", "projects"].flatMap((id) => byId[id] || []);
  const live = work.filter((i) => /vercel\.app|https?:\/\//.test(i.caseStudy?.liveUrl || "") || /live/i.test(i.link?.label || "")).length;
  return [
    [work.length, work.length === 1 ? "project" : "projects"],
    [live, live === 1 ? "live site" : "live sites"],
    [(byId.freelancing || []).length, "freelance builds"],
    [(byId.certifications || []).length, (byId.certifications || []).length === 1 ? "certification" : "certifications"],
    [(byId.languages || []).length, "languages & tools"],
  ].filter(([n]) => n > 0);
}

/* ---------- Top 10 row (Netflix-style ranked posters) — hard skills from data/skills.json ---------- */
const HARD_CAT = { id: "hard-skills", title: "Hard Skills", hue: 350, details: [{ key: "shownIn", label: "Shown in" }] };

function renderTop10(skills) {
  const items = (skills?.hard || []).slice(0, 10).map((s) => ({ ...s, _cat: HARD_CAT }));
  if (!items.length) return null;
  const top = { title: skills.hardTitle || "Top 10 Hard Skills" };
  const track = h("ol", { class: "row__track top10__track", "aria-labelledby": "top10-title" },
    items.map((item, i) => h("li", { class: "top10__item", style: `--i:${i}` },
      h("span", { class: "top10__num", "aria-hidden": "true" }, String(i + 1)),
      h("button", { class: "top10__poster", type: "button", style: `--hue:${(200 + i * 37) % 360}`, "aria-haspopup": "dialog",
        "aria-label": `Number ${i + 1}: ${item.title}`, onclick: (e) => openDetails(item, e.currentTarget) },
        h("span", { class: "top10__art", "aria-hidden": "true" }, cardArt(item)),
        h("span", { class: "top10__label" },
          h("span", { class: "top10__name" }, item.title),
          h("span", { class: "top10__meta" }, skillMeta(item)))))));
  return h("section", { class: "row row--top10", id: "row-top10", style: "--hue:350" },
    h("div", { class: "row__head" },
      h("h2", { class: "row__title top10__title", id: "top10-title" }, h("span", { class: "top10__badge" }, "TOP", h("b", {}, "10")), top.title)),
    withArrows(track, top.title));
}

function skillMeta(item) {
  const shown = item.shownIn || item.usedIn || [];
  return shown.length ? `Shown in ${shown.slice(0, 2).join(", ")}${shown.length > 2 ? ` +${shown.length - 2}` : ""}` : [item.level, item.group].filter(has).join(" · ");
}

/* ---------- Soft skills strip ---------- */
function renderSoftSkills(skills) {
  const soft = skills?.soft || [];
  if (!soft.length) return null;
  return h("section", { class: "soft reveal", id: "soft-skills", "aria-labelledby": "soft-title" },
    h("h2", { class: "row__title", id: "soft-title" }, skills.softTitle || "Soft Skills"),
    h("ul", { class: "soft__list" }, soft.map((s, i) =>
      h("li", { class: "soft__item", style: `--hue:${(350 + i * 47) % 360}` },
        h("span", { class: "soft__icon", "aria-hidden": "true" }, s.icon || "★"),
        h("span", { class: "soft__text" }, h("b", {}, s.title), has(s.evidence) ? h("span", {}, s.evidence) : null)))));
}

/* Scroll arrows for any horizontal track (mouse users can't side-scroll with a wheel). */
function withArrows(track, title) {
  const prev = h("button", { class: "row__arrow row__arrow--prev", type: "button", "aria-label": `Scroll ${title} left`, hidden: true, onclick: () => page(-1) }, "‹");
  const next = h("button", { class: "row__arrow row__arrow--next", type: "button", "aria-label": `Scroll ${title} right`, onclick: () => page(1) }, "›");
  function page(dir) { track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reducedMotion() ? "auto" : "smooth" }); }
  function sync() {
    prev.hidden = track.scrollLeft <= 4;
    next.hidden = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  }
  track.addEventListener("scroll", sync, { passive: true });
  new ResizeObserver(sync).observe(track);
  return h("div", { class: "row__viewport" }, prev, track, next);
}

/* ---------- Hero ---------- */
function renderHero(item, profile, categories) {
  const hue = item?._cat.hue ?? 350;
  const cover = safeUrl(item?.image);
  const section = h("section", { class: `hero${cover ? " hero--cover" : ""}`, style: `--hue:${hue}`, "aria-labelledby": "hero-title" },
    h("div", { class: "hero__art", "aria-hidden": "true" },
      cover ? h("img", { class: "hero__cover", src: cover, alt: "" }) : null,
      h("span", { class: "hero__blob hero__blob--a" }), h("span", { class: "hero__blob hero__blob--b" })));

  if (!item) {
    section.append(h("div", { class: "hero__content" }, h("h1", { id: "hero-title", class: "hero__title reveal" }, profile.name || "Portfolio")));
    return section;
  }
  const url = caseStudyUrl(item);
  const stats = computeStats(categories);
  section.append(h("div", { class: "hero__content" },
    renderIntro(profile),
    h("p", { class: "hero__eyebrow reveal" }, h("b", {}, item.badge || "Featured"), ` · ${item._cat.title}`),
    h("h1", { id: "hero-title", class: "hero__title reveal", style: "--delay:80ms" }, item.shortTitle || item.title),
    item.shortTitle ? h("p", { class: "hero__subtitle reveal", style: "--delay:160ms" }, item.title) : null,
    has(item.description) ? h("p", { class: "hero__desc reveal", style: "--delay:220ms" }, item.description) : null,
    h("div", { class: "hero__actions reveal", style: "--delay:300ms" },
      url ? h("a", { class: "btn btn--primary", href: url }, "▶ View case study") : null,
      h("button", { class: "btn btn--ghost", type: "button", onclick: (e) => openDetails(item, e.currentTarget) }, "ⓘ More info")),
    stats.length ? h("ul", { class: "stats reveal", style: "--delay:380ms", "aria-label": "At a glance" },
      stats.map(([n, label]) => h("li", {}, h("b", {}, String(n)), h("span", {}, label)))) : null
  ));
  return section;
}

function renderIntro(profile) {
  if (!has(profile.bio) && !has(profile.name)) return null;
  return h("div", { class: "intro reveal", "aria-label": "About" },
    has(profile.photo) ? h("img", { class: "intro__photo", src: profile.photo, alt: "", width: 44, height: 44, onerror: (e) => e.currentTarget.remove() }) : null,
    h("p", { class: "intro__text" }, h("strong", {}, profile.name), profile.headline ? h("span", {}, profile.headline) : null, has(profile.bio) ? h("span", {}, profile.bio) : null),
    has(profile.email) ? h("a", { class: "intro__email", href: `mailto:${profile.email}`, title: profile.email }, "✉ Email me") : null);
}

function renderNavLinks(categories) {
  const ul = document.querySelector(".nav__links");
  const visible = categories.filter((c) => c.items.length || isDev);
  ul.replaceChildren(
    h("li", {}, h("a", { href: "#row-top10" }, "Top 10")),
    h("li", {}, h("a", { href: "#soft-skills" }, "Soft Skills")),
    ...visible.map((c) => h("li", {}, h("a", { href: `#row-${c.id}` }, c.title))),
    h("li", {}, h("a", { href: "#case-studies" }, "Case studies"))
  );
}

/* Consecutive categories sharing a "cluster" (categories.json) sit side by side on wide screens. */
function clustered(categories) {
  const out = [];
  let group = null;
  for (const cat of categories) {
    const row = renderRow(cat);
    if (!row) continue;
    if (cat.cluster && group?.key === cat.cluster) { group.el.append(row); continue; }
    group = cat.cluster ? { key: cat.cluster, el: h("div", { class: "row-cluster" }, row) } : null;
    out.push(group ? group.el : row);
  }
  out.forEach((el) => el.classList?.contains("row-cluster") && el.style.setProperty("--cols", el.children.length));
  return out;
}

/* ---------- Rows ---------- */
function renderRow(cat) {
  if (!cat.items.length && !isDev) return null;
  if (!cat.groups) return renderTrackRow(cat, cat.items, { id: `row-${cat.id}`, title: cat.title, level: "h2" });

  // A category split into sub-rows (e.g. Frontend / Backend / Database).
  const rows = cat.groups
    .map((g) => [g, cat.items.filter((i) => i.group === g)])
    .filter(([, items]) => items.length)
    .map(([g, items]) => renderTrackRow(cat, items, { id: `row-${cat.id}-${g.toLowerCase()}`, title: g, level: "h3" }));
  return h("section", { class: "row-group", id: `row-${cat.id}`, "aria-labelledby": `row-${cat.id}-heading` },
    h("h2", { class: "row-group__title", id: `row-${cat.id}-heading` }, cat.title),
    h("div", { class: "row-group__rows" }, rows));
}

function renderTrackRow(cat, items, { id, title, level }) {
  const titleId = `${id}-title`;
  const track = h("ul", { class: "row__track", "aria-labelledby": titleId });

  if (!items.length) {
    track.append(h("li", { style: "--i:0" }, h("div", { class: "card card--empty" },
      h("span", {}, "No entries yet — add them to ", h("code", {}, `data/${cat.file}`)))));
  }
  items.forEach((item, i) => track.append(h("li", { style: `--i:${Math.min(i, 8)}` }, renderCard(item))));

  return h("section", { class: `row${level === "h3" ? " row--sub" : ""}`, id, style: `--hue:${cat.hue}` },
    h("div", { class: "row__head" },
      h(level, { class: "row__title", id: titleId }, title),
      h("span", { class: "row__count" }, items.length ? `${items.length} ${items.length === 1 ? "item" : "items"}` : "")),
    withArrows(track, title));
}

const cardMeta = (item) => [item.issuer || item.client, item.date].filter(has).join(" · ") || [item.level, item.years].filter(has).join(" · ");

// Optional per-item crop, e.g. "imagePosition": "center" (default: top of the screenshot).
const imagePos = (item) => (/^[a-z0-9% .-]+$/i.test(item.imagePosition || "") ? `object-position:${item.imagePosition}` : null);

function cardArt(item) {
  if (safeUrl(item.image)) return h("img", { src: safeUrl(item.image), alt: "", loading: "lazy", style: imagePos(item) });
  if (safeUrl(item.icon)) return h("img", { class: "card__icon", src: safeUrl(item.icon), alt: "", loading: "lazy" });
  return h("span", { class: "card__monogram" }, initials(item.shortTitle || item.title));
}

function renderCard(item) {
  const meta = cardMeta(item);
  const art = h("div", { class: `card__art${item.icon && !item.image ? " card__art--icon" : ""}`, "aria-hidden": "true" }, cardArt(item));
  return h("button", { class: "card", type: "button", style: `--hue:${item._cat.hue}`, "aria-haspopup": "dialog", onclick: (e) => openDetails(item, e.currentTarget) },
    art,
    has(item.badge) ? h("span", { class: "card__badge" }, item.badge) : null,
    h("span", { class: "card__body" },
      h("span", { class: "card__title" }, item.shortTitle || item.title),
      meta ? h("span", { class: "card__meta" }, meta) : null,
      h("span", { class: "card__preview" }, h("div", {},
        has(item.description) ? h("span", { class: "card__desc" }, item.description) : null,
        h("span", { class: "card__hint" }, caseStudyUrl(item) ? "Details · case study →" : "Details →")))));
}

/* ---------- Case studies (Freelancing + Capstone) ---------- */
function renderCaseStudies(categories) {
  const items = categories.filter((c) => ["freelancing", "capstone"].includes(c.id)).flatMap((c) => c.items).filter((i) => i.slug);
  const list = h("ul", { class: "cases" }, items.map((item, i) =>
    h("li", { class: "reveal", style: `--delay:${i * 80}ms` },
      h("a", { class: "case", href: caseStudyUrl(item), style: `--hue:${item._cat.hue}` },
        h("span", { class: "case__kicker" }, [item._cat.title, item.date].filter(has).join(" · ")),
        h("h3", { class: "case__title" }, item.shortTitle || item.title),
        has(item.description) ? h("p", { class: "case__desc" }, item.description) : null,
        h("span", { class: "case__cta" }, "Read case study →")))));

  if (!items.length && !isDev) return null;
  return h("section", { class: "section", id: "case-studies", "aria-labelledby": "cs-title" },
    h("h2", { class: "section__title reveal", id: "cs-title" }, "Freelancing & Capstone"),
    h("p", { class: "section__lead reveal" }, "In-depth case studies: the problem, the stack, what I built and how it turned out."),
    items.length ? list : devNote("Add entries with a \"slug\" to data/freelancing.json and data/capstone.json and they appear here, each with its own page at /projects/<slug>."));
}

/* ---------- Details dialog ---------- */
function openDetails(item, opener) {
  const cat = item._cat;
  const facts = (cat.details || []).filter((d) => has(item[d.key]));
  const url = caseStudyUrl(item);
  const link = item.link && safeUrl(item.link.url);

  const meta = [item.issuer || item.client, item.date].filter(has).join(" · ");
  const cert = safeUrl(item.certificateImage);
  dialog.replaceChildren(
    h("div", { class: `dialog__art card__art${item.icon ? " card__art--icon" : ""}`, style: `--hue:${cat.hue}` },
      item.icon ? cardArt(item) : h("span", { class: "card__monogram", "aria-hidden": "true" }, initials(item.shortTitle || item.title)),
      h("button", { class: "dialog__close", type: "button", "aria-label": "Close", onclick: () => dialog.close() }, "×")),
    h("div", { class: "dialog__body" },
      h("p", { class: "dialog__kicker" }, [cat.title, item.group].filter(has).join(" · ")),
      h("h2", { class: "dialog__title", id: "details-title" }, item.title),
      meta ? h("p", { class: "dialog__meta" }, meta) : null,
      has(item.description) ? h("p", { class: "dialog__desc" }, item.description) : null,
      cert ? h("a", { class: "dialog__cert", href: cert, target: "_blank", rel: "noopener" },
        h("img", { src: cert, alt: `Scan of the ${item.title} certificate`, loading: "lazy" }),
        h("span", {}, "Open full size ↗")) : null,
      facts.length ? h("dl", { class: "facts" }, facts.flatMap((d) => [
        h("dt", {}, d.label),
        h("dd", {}, Array.isArray(item[d.key]) ? h("ul", { class: "chips" }, item[d.key].map((v) => h("li", {}, v))) : item[d.key]),
      ])) : null,
      h("div", { class: "dialog__actions" },
        url ? h("a", { class: "btn btn--primary btn--small", href: url }, "View case study") : null,
        link ? h("a", { class: "btn btn--ghost btn--small", href: link, target: "_blank", rel: "noopener" }, `${item.link.label || "Open link"} ↗`) : null)));

  dialog.setAttribute("aria-labelledby", "details-title");
  dialog.showModal();
  dialog.addEventListener("close", () => opener?.focus(), { once: true });
}
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

/* ---------- Scroll entrances ---------- */
function observeEntrances() {
  const targets = document.querySelectorAll(".reveal, .row, .row-group");
  if (reducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  targets.forEach((t) => io.observe(t));
}
