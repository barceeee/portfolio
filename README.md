# Credential Portfolio

A Netflix-style personal portfolio: a featured hero at the top, then horizontal rows of
"credential cards" (Languages, Certifications, Education, Projects, Freelancing, Capstone)
that animate in as you scroll, with hover previews and a details pop-up. Freelancing,
Capstone and Projects entries can each have their own case-study page.

**Stack:** plain HTML, CSS and JavaScript (ES modules). No framework and no build step,
so Vercel serves the files as they are.

## File structure

```
index.html              Home page (hero + rows + case studies)
project.html            Case-study page template, served at /projects/<slug>
404.html                Not-found page
vercel.json             Vercel config (clean URLs, /projects/<slug> rewrite, headers)
serve.json              Same rewrite for local preview with `npx serve`
data/
  profile.json          Your name, headline, bio, photo, links
  categories.json       Row order, titles, colors, which extra fields to show
  languages.json        One file per category: a JSON array of entries
  certifications.json
  education.json
  projects.json
  freelancing.json
  capstone.json
assets/
  css/styles.css        All styles; colors, spacing and motion are tokens at the top
  js/common.js          Shared helpers (data loading, nav, footer, canonical URL)
  js/home.js            Home page rendering and animation
  js/project.js         Case-study page rendering
  img/                  Profile photo (profile.jpg), favicon, project screenshots
  icons/                Technology icons (Devicon / Simple Icons, MIT / CC0)
  certificates/         Certificate scans
scripts/check-data.mjs  `npm run check` validates the data files
```

## Editing your credentials

Every entry lives in `data/<category>.json`, which is a JSON array. To add an entry, copy an
existing `{ ... }` block, paste it after a comma, and change the values. Leave a field as `""`
or `[]` if you don't have it: empty fields are simply not shown.

Fields every category understands:

| Field | Meaning |
| --- | --- |
| `title` | Full name of the item (required) |
| `shortTitle` | Optional short name for the card and hero |
| `issuer` | Who issued it / the school / the client |
| `date` | Any text, e.g. `"June 16, 2023"` or `"2022 – 2026"` |
| `description` | One or two sentences |
| `badge` | Small label on the card, e.g. `"Featured"` or `"NC II"` |
| `link` | `{ "label": "Verify", "url": "https://…" }` |
| `image` | Optional card image, e.g. `"/assets/img/ball-lalo.png"` |
| `featured` | `true` puts this entry in the big hero at the top (first one wins) |
| `monogram` | Optional letters shown on a card with no image, e.g. `"BSIT"` (default: initials) |

Extra fields per category (shown in the details pop-up; edit the list in `categories.json`):

```jsonc
// languages.json — languages and tools, split into rows by "group"
// (the groups and their order are set in categories.json → "groups")
{ "group": "Frontend", "title": "JavaScript", "icon": "/assets/icons/javascript.svg",
  "level": "Intermediate", "years": "3 years", "usedIn": ["STI-360"], "description": "…" }
// Icons live in assets/icons/. New ones: download the SVG from devicon.dev or simpleicons.org.

// certifications.json
{ "title": "…", "issuer": "…", "date": "…", "validUntil": "…", "credentialId": "…",
  "skills": ["…"],
  "image": "/assets/certificates/file.jpg",            // card thumbnail
  "certificateImage": "/assets/certificates/file.jpg", // full scan shown in the pop-up
  "link": { "label": "Verify", "url": "https://…" } }

// education.json
{ "title": "BS Information Technology", "issuer": "University name", "period": "2022 – 2026",
  "location": "City", "honors": "Dean's Lister", "description": "…" }

// projects.json / freelancing.json / capstone.json
{ "slug": "my-project", "title": "…", "role": "…", "client": "…", "date": "…", "techStack": ["…"],
  "description": "…",
  "caseStudy": {
    "problem": "…",
    "features": [{ "title": "…", "description": "…" }],
    "outcomes": ["…"],
    "liveUrl": "", "repoUrl": "",
    "images": [{ "src": "/assets/img/shot-1.png", "alt": "…" }]
  } }
```

Any Projects/Freelancing/Capstone entry with a `slug` gets its own page at `/projects/<slug>`.
Freelancing and Capstone entries with a slug are also listed in the "Freelancing & Capstone"
section on the home page.

**Profile photo:** save it as `assets/img/profile.jpg` (or change `photo` in `profile.json`).

**Reorder rows:** change the order of entries in `categories.json`.

Check your edits before deploying:

```bash
npm run check
```

## Run locally

The pages load JSON with `fetch`, so open them through a local server, not by double-clicking:

```bash
npm run dev
```

Then open http://localhost:3000. On localhost, empty rows and empty case-study sections show
dashed **author notes** telling you which file and field to fill in. These notes never appear on
the deployed site.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com: **Add New → Project**, import the repository.
3. Framework preset: **Other**. Leave Build Command and Output Directory empty.
4. Deploy. The site is live at `https://<project-name>.vercel.app`.

Or from the terminal: `npx vercel` (preview) then `npx vercel --prod`.

Every push to the main branch redeploys automatically.

## Adding a custom domain later

No domain is hard-coded anywhere: canonical and social URLs are computed from the address the
site is served on. When you have a domain:

1. Vercel → your project → **Settings → Domains → Add**, enter the domain.
2. Add the DNS records Vercel shows at your domain registrar.
3. Optional: set `"siteUrl": "https://your-domain"` in `data/profile.json` so canonical URLs
   always point to the custom domain, even when the site is opened via the vercel.app URL.

## Accessibility and motion

- All animation respects the operating system's **Reduce motion** setting: entrances, hover
  zoom and background drift are switched off.
- Cards are buttons: Tab to them, Enter opens details, Esc closes.
- Rows scroll by touch, trackpad, or the arrow buttons on hover.

## Skills, Top 10 and the intro

- **`data/skills.json`** holds the **Top 10 Hard Skills** row (`hard`, order = rank, first 10 shown)
  and the **Soft Skills** strip (`soft`). Each hard skill lists `shownIn`: the projects or
  certificate that prove it. Icons are in `assets/icons/skills/`.
- **Languages & Tools** (`data/languages.json`) stays the tech grid, split into Frontend /
  Backend / Database by each entry's `group`.
- **Side-by-side rows:** categories with the same `cluster` in `categories.json` sit next to
  each other on wide screens.
- **Playable demos:** a case study with `caseStudy.demoUrl` gets a "Play the demo" section.
  The Pagpag web build lives in `demos/pagpag/` (rebuild it in Unity with
  **Pagpag ▸ Build Web Demo**, then copy `Builds/WebGL/*` into `demos/pagpag/`).
- **Opening animation** ("RANDY · Now streaming"): `assets/css/intro.css` + `assets/js/intro.js`.
  It plays once per browser session, can be skipped with a click or any key, and never plays
  with "Reduce motion" turned on. Add `?nointro` to the URL to skip it while editing.
