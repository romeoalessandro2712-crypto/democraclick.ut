# DemocraClick · L'Agorà

Click-driven 3D civic site: seven worlds (Home, Partiti, Sondaggi, Dati, Fonti, Metodo, Community)
in one WebGL scene, with a full 2D/no-JS version of the same content.

## Publish (recommended)
```
npm install
npm run build        # → dist/site/
```
Upload the **contents of `dist/site/`** to your web root. That folder is the production site:
- minified, code-split JS (the 3D layer and three.js load only when needed), source maps
- three.js, GSAP and the fonts self-hosted: **no third-party requests** (better privacy and speed)
- every section's text written into the HTML for search engines, link previews, print and no-JS
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, icons, `og-image.jpg` (link previews)
- `_headers` (Netlify / Cloudflare Pages) and `.htaccess` (Apache): Content-Security-Policy,
  HSTS, nosniff, referrer and permissions policies, gzip, 1-year caching for hashed assets
  (on nginx or another host, copy the same headers into its config)

Preview the build with its real headers: `npm run serve` → http://localhost:8080

## Other outputs
- `dist/democraclick-agora.html`: everything in one file (loads three.js/GSAP/fonts from CDNs).
- The un-built source (`index.html` + modules) also runs as-is from any static server.

## Day-to-day edits
- Polls: `data/sondaggi.js` after each new Supermedia (or set `TUNE.polls.feed`), then rebuild.
  Set `TUNE.polls.electionDate` once the vote is called (15-day legal blackout).
- Tema del giorno: add today's entry at the top of `data/topic.js` (rules inside), then rebuild.
  Update `data/edition.js` (footer date) when you publish new content.
- Parties: `data/partiti.js`. Copy: `i18n.js` and `data/content.js`. Tunables: `TUNE` in `main.js`.
- After any edit: `npm run build` and upload `dist/site/` again.

## Before launch (open items)
- Privacy page placeholders: data controller, contact email, date, server log retention.
- FONTI reliability notes are still placeholders.
- COMMUNITY: Google Client ID and posts API (`TUNE.community`), plus the privacy-page section on
  Google sign-in. Until then the section shows that discussion is not active. See INTEGRATION.md.
- If your server serves `/privacy` (not `/privacy.html`), add a redirect.
- Software-rendering fallback: devices that would draw 3D without a GPU get the 2D version.
  To force 3D for testing: `localStorage.setItem('dc-3d', 'force')`.

See `INTEGRATION.md` for hooks, data sources and what was deliberately left out.

## Daily automatic update (10:00, Europe/Rome)
- Procedure: `automation/DAILY_UPDATE.md`. Approved sources: `automation/sources.json`.
- Gate: `npm run validate` (also runs before every `npm run build`): wrong sums, mismatched dates,
  unapproved sources or a "verified" date that was not really checked stop the build.
- Reports of each run: `automation/reports/`.
- Needs: this project in a GitHub repository, with your host (Netlify / Cloudflare Pages) building
  from it with `npm run build` and publishing `dist/site`.
