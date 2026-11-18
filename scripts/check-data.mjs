// Checks the data files before you deploy: valid JSON, required fields, unique slugs.
// Run: npm run check
import { readFile } from "node:fs/promises";

const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
let problems = 0;
const warn = (msg) => { problems++; console.log("  ✗ " + msg); };

const categories = await read("categories.json");
await read("profile.json");
const slugs = new Set();

for (const cat of categories) {
  let items;
  try { items = await read(cat.file); } catch (e) { warn(`${cat.file}: ${e.message}`); continue; }
  if (!Array.isArray(items)) { warn(`${cat.file} must be a JSON array [ ... ]`); continue; }
  console.log(`${cat.title}: ${items.length} item(s)`);
  items.forEach((it, i) => {
    const where = `${cat.file} #${i + 1}`;
    if (!it.title) warn(`${where}: "title" is required`);
    if (cat.caseStudies && it.slug) {
      if (!/^[a-z0-9-]+$/.test(it.slug)) warn(`${where}: slug "${it.slug}" should use only a-z, 0-9 and -`);
      if (slugs.has(it.slug)) warn(`${where}: slug "${it.slug}" is used twice`);
      slugs.add(it.slug);
    }
    if (it.link && it.link.url && !/^(https?:|mailto:|\/)/.test(it.link.url)) warn(`${where}: link.url must start with https://, mailto: or /`);
  });
}
console.log(problems ? `\n${problems} problem(s) found.` : "\nAll data files look good.");
process.exit(problems ? 1 : 0);
