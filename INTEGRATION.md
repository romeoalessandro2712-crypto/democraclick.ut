# DemocraClick · L'Agorà

## Files
```
index.html            semantic HTML for all seven pages; layout: side menu · reading column · right column; phone tabs
styles.css            tokens (your palette, light + dark), the simple layout (desktop / tablet / phone), components
i18n.js               UI strings, IT primary + EN (section titles come from data/content.js)
main.js               boot, hash router (one page shown at a time), TUNE (the tunables), theme, language, phone "Altro" menu
worlds/feed.js        HOME feed cards and the right column (topic, polls, parties, latest record entry)
worlds/partiti.js     PARTITI: party list + party card, compare two (its old 3D view is no longer used)
worlds/dati.js        DATI: flat seat chart (one dot per seat); seats → vote → fixed numbers
worlds/fonti.js       FONTI: index of sources + focus card + public record
worlds/metodo.js      METODO: six method steps
worlds/community.js   COMMUNITY: daily discussion (topic, Google sign-in, posts)
worlds/topic-card.js  "Tema del giorno" card (shared by Community and the prerender)
scene.js, worlds/chamber.js   former 3D layer, not loaded by the site any more (kept only because partiti.js references it; safe to delete with that code)
data/topic.js         Tema del giorno entries (newest first) + writing rules
data/edition.js       date of the latest editorial update (footer)
worlds/sondaggi.js    SONDAGGI: party table with symbols; coalition bars vs the 42% bonus line
worlds/util.js        shared helpers
privacy.html          plain privacy page (no third-party requests), IT/EN
data/partiti.js       party data + party colours, verbatim from your prototype
data/logos.js         party symbols (WebP, base64) from your prototype
data/content.js       Dati / Fonti / Metodo / Community copy, verbatim from your prototype
data/sondaggi.js      Supermedia YouTrend/Agi figures (data as of 19/11/2026), coalition blocs, electoral-law facts, with links
dist/democraclick-agora.html   everything bundled into one file
```

## Install
Recommended: `npm install && npm run build`, then upload the contents of `dist/site/` (see README.md).
Alternatives: the un-built folder on any static server (ES modules need HTTP, not `file://`), or
`dist/democraclick-agora.html` as a single `index.html`.

## Hooks into your site
- Hashes: `#home #partiti #sondaggi #dati #fonti #metodo #community` (`#partiti`, `#sondaggi` are new).
- Privacy: the nav now links to `privacy.html`. If your server serves `/privacy`, rename or redirect.
- Theme: `data-theme="light|dark"` on `<html>` + `localStorage['dc-theme']`. The scene follows any change.
- Language: `data-i18n` / `data-i18n-aria` + `localStorage['dc-lang']`.

## Placeholders still open (labelled on screen)
- FONTI reliability note: `[NOTA_AFFIDABILITÀ_PLACEHOLDER]`. Your data has no per-source note or date.
- COMMUNITY: `TUNE.community.googleClientId` and `TUNE.community.endpoint` are placeholders, so sign-in and posting are switched off and say so. Nothing is sent or stored today.

## Polls: keeping them current
- Edit `data/sondaggi.js` after each new Supermedia, or set `TUNE.polls.feed` (main.js) to a JSON with
  the same shape as `POLL`; the page fetches it when SONDAGGI opens.
- The LIVE pill turns grey ("Non aggiornato") when the data is older than `TUNE.polls.freshDays` (8).
- Set `TUNE.polls.electionDate` (YYYY-MM-DD) once the vote is called: in the 15 days before it the
  section hides the figures, as required by law 28/2000, art. 8 (your prototype's note).
- Coalition totals are sums computed by the page, labelled as such on screen. No seat projection.

## Privacy page placeholders
`[NOME_TITOLARE_PLACEHOLDER]`, `[EMAIL_CONTATTO_PLACEHOLDER]`, `[DATA_PLACEHOLDER]`, and a decision on
self-hosting fonts/libraries. The page describes this build's code only; if your live site adds
analytics or other tools, list them there.

## Symbols and colours
Party symbols and colours come from your prototype, all at the same size and weight, with your
note shown under the party dock and your "Colori" box in METODO. The chamber's seats are not
coloured by party: real seat counts are not in the data.

## Deliberately left out of your prototype's content
- The poll ("Sondaggi"): your file marks it "Fonte da indicare" (no institute, dates or sample).
- Metodo box "Limiti": it lists features of your prototype that this site does not have.

## SEO
The build writes every section's content into the HTML (tools/prerender.mjs), plus canonical,
Open Graph / Twitter tags, JSON-LD, sitemap and robots. The page title follows the section.

## Third-party
Development and single-file versions load Fraunces + Inter Tight from Google Fonts. The production
build (`dist/site/`) self-hosts them; the site makes no third-party requests until someone signs in
with Google in Community.

## Community: Tema del giorno
- Add one entry per day at the top of `data/topic.js` (date, area, title, summary, points, question,
  links, checked). The page shows the newest entry dated today or earlier and always prints its date;
  if no entry is added, it shows "Ultimo tema pubblicato" with the old date rather than pretending.
- Rules (also in the file): facts only from the linked sources, positions attributed ("secondo…"),
  an open question, at least one primary source (Parliament, ministry, authority) among the links.
- Without a rebuild: set `TUNE.community.topicFeed` to a JSON array with the same shape.
- The 21/11/2026 topic (Manovra 2027) was written from: temi.camera.it dossier on A.C. 3174-bis,
  Adnkronos 17/11/2026, Metro 20/11/2026 (linked on the card).

## Community: Google sign-in and posts (to switch on)
1. Google Cloud console → APIs & Services → Credentials → OAuth client ID → "Web application".
   Authorised JavaScript origins: `https://www.democraclick.com` (and `http://localhost:8080` to test).
   Configure the OAuth consent screen (app name, privacy-policy URL = `/privacy.html`).
2. Paste the client ID into `TUNE.community.googleClientId` (main.js).
3. Build a small API and put its URL in `TUNE.community.endpoint`:
   - `GET  {endpoint}?topic={id}` → `[{ "id", "text", "created": ISO date, "author": { "name", "picture" } }]`
   - `POST {endpoint}` with `Authorization: Bearer <Google ID token>` and JSON `{ "topic", "text" }`
     → the stored post (same shape) or `204` if it waits for moderation.
   - The server MUST verify the ID token (Google's signature, `aud` = your client ID, `iss`, `exp`)
     with Google's official library for your language; the browser decodes it only to show the name.
   - Store only what you publish (Google `sub`, name, picture, text, date); rate-limit; moderate.
4. If the API is on another origin, add it to `connect-src` in build.mjs (CSP) and allow CORS.
5. Fill the privacy page section "Community: accesso con Google" (where data is kept, how long,
   who moderates, legal basis, how to delete posts) BEFORE switching on.
- Privacy by design: Google's script is loaded only when the visitor presses "Accedi con Google";
  until then no request reaches Google. The sign-in lives in page memory only (no storage).
- Headers: CSP allows `accounts.google.com/gsi/*` and `lh3.googleusercontent.com` (profile photos);
  `Cross-Origin-Opener-Policy: same-origin-allow-popups` so Google's popup can return.
- Please check these against Google's current "Google Identity Services" documentation when you
  set it up: I wrote them from memory and could not test against the real Google service here.

## Polls: coalitions and "Simulazioni con il centro" (21/11/2026)
- `COALITIONS` in `data/sondaggi.js`: the Supermedia's own coalition figures (campo largo, centrodestra),
  with the definition shown behind the dotted "Campo largo" term. Update them with each Supermedia.
- `SIMS`: the simulations, written as parts (`['coal'|'party'|'sim', id, sign]`); totals are computed.
  A party without a figure (`pct: null`, e.g. PLD in `EXTRA`) is shown as "n.d." and the total is marked
  with * and "non lo comprende". Never replace a missing figure with an estimate.
- The "Scenario con FN" tab was removed; "Centrodestra + Futuro Nazionale" is now one simulation among six.
