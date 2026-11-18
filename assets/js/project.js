import { h, has, safeUrl, loadSite, initNav, renderBrand, renderFooter, setCanonical, devNote, reducedMotion } from "./common.js";

const main = document.getElementById("main");

init().catch((err) => {
  console.error(err);
  main.replaceChildren(h("p", { class: "state" }, "Couldn’t load this case study."));
});

function currentSlug() {
  const fromPath = location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (fromPath) return decodeURIComponent(fromPath[1]);
  return new URLSearchParams(location.search).get("slug") || "";
}

async function init() {
  initNav();
  const { profile, categories } = await loadSite();
  renderBrand(profile);
  renderFooter(profile);
  setCanonical(profile);

  const slug = currentSlug();
  const item = categories.filter((c) => c.caseStudies).flatMap((c) => c.items).find((i) => i.slug === slug);
  if (!item) {
    document.title = "Not found";
    main.replaceChildren(h("div", { class: "state" },
      h("h1", { class: "hero__title" }, "Not found"),
      h("p", {}, "This case study doesn’t exist (yet)."),
      h("a", { class: "btn btn--primary", href: "/" }, "Back to portfolio")));
    return;
  }
  document.title = `${item.shortTitle || item.title}${profile.name ? ` — ${profile.name}` : ""}`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", item.description || item.title);
  render(item);
}

function render(item) {
  const cs = item.caseStudy || {};
  const live = safeUrl(cs.liveUrl), repo = safeUrl(cs.repoUrl);
  const meta = [item._cat.title, item.role, item.client, item.date].filter(has).join(" · ");
  const missing = [
    !has(cs.problem) && "caseStudy.problem",
    !has(item.techStack) && "techStack",
    !(cs.features || []).every((f) => has(f.description)) && "caseStudy.features[].description",
    !has(cs.outcomes) && "caseStudy.outcomes",
    !has(item.date) && "date",
    !has(item.role) && "role",
  ].filter(Boolean);

  const cover = safeUrl(item.image);
  const hero = h("section", { class: `study-hero${cover ? " hero--cover" : ""}`, style: `--hue:${item._cat.hue}` },
    h("div", { class: "hero__art", "aria-hidden": "true" },
      cover ? h("img", { class: "hero__cover", src: cover, alt: "" }) : null,
      h("span", { class: "hero__blob hero__blob--a" }), h("span", { class: "hero__blob hero__blob--b" })),
    h("a", { class: "back-link", href: "/" }, "← Back to portfolio"),
    h("p", { class: "hero__eyebrow reveal" }, h("b", {}, item.badge || "Case study"), meta ? ` · ${meta}` : ""),
    h("h1", { class: "hero__title reveal", style: "--delay:80ms" }, item.shortTitle || item.title),
    item.shortTitle ? h("p", { class: "hero__subtitle reveal", style: "--delay:140ms" }, item.title) : null,
    has(item.description) ? h("p", { class: "hero__desc reveal", style: "--delay:200ms" }, item.description) : null,
    (live || repo) ? h("div", { class: "hero__actions reveal", style: "--delay:260ms" },
      live ? h("a", { class: "btn btn--primary", href: live, target: "_blank", rel: "noopener" }, "Live site ↗") : null,
      repo ? h("a", { class: "btn btn--ghost", href: repo, target: "_blank", rel: "noopener" }, "Source code ↗") : null) : null);

  const sections = [
    missing.length ? devNote(`Still empty in data/${item._cat.file}: ${missing.join(", ")}. Empty sections are hidden on the live site.`) : null,
    has(cs.problem) && block("The problem", h("p", {}, cs.problem)),
    has(item.techStack) && block("Tech stack", h("ul", { class: "chips" }, item.techStack.map((t) => h("li", {}, t)))),
    has(cs.features) && block("Key features", h("ul", { class: "features" }, cs.features.map((f, i) =>
      h("li", { class: "reveal", style: `--delay:${i * 80}ms` }, h("h3", {}, f.title), has(f.description) ? h("p", {}, f.description) : null)))),
    has(cs.outcomes) && block("Outcomes", h("ul", { class: "outcomes" }, cs.outcomes.map((o) => h("li", {}, o)))),
    has(cs.images) && block("Gallery", h("div", { class: "gallery" }, cs.images.filter((img) => safeUrl(img.src)).map((img) =>
      h("img", { src: safeUrl(img.src), alt: img.alt || "", loading: "lazy" })))),
  ].filter(Boolean);

  main.replaceChildren(hero, h("div", { class: "study" }, sections));
  reveal();
}

function block(title, body) {
  return h("section", { class: "reveal" }, h("h2", {}, title), body);
}

function reveal() {
  const els = document.querySelectorAll(".reveal");
  if (reducedMotion() || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  els.forEach((e) => io.observe(e));
}
