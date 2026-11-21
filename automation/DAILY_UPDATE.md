# DemocraClick · daily automatic update (runbook)

This file is the exact procedure the scheduled task follows every day. The site must show
**only facts found on approved sources** (`automation/sources.json`) and must **never publish on doubt**.
Target: data online by **10:00 Europe/Rome**; the run starts at 09:31.

## 0 · Setup
1. Get the repository (GitHub, `main` branch) and run `npm ci`.
2. Today = the date in Europe/Rome. Read `data/sondaggi.js`, `data/topic.js`, `data/partiti.js`, `data/edition.js`.
3. Election blackout (law 28/2000, art. 8): if `TUNE.polls.electionDate` (main.js) is set and today is
   within 15 days of it, **do not touch polls**. If a decree calling the election has been published in
   the Gazzetta Ufficiale (gazzettaufficiale.it) and the date is not yet set, set it and report it.

## 1 · Polls (Supermedia YouTrend/AGI)
1. Look on youtrend.it and agi.it for a Supermedia **newer** than `POLL.source.dataDate`.
   If there is none, change nothing in polls.
2. If there is one: copy every party figure and change **exactly as published** (no rounding, no
   computing), the polling window, the institutes and their dates, the publication date, and the
   coalition figures (`COALITIONS.cl`, `COALITIONS.cd`, `COALITIONS.date` = the same data date).
3. Cross-check: each figure must match on a second approved source (agi.it ↔ youtrend.it) when both
   publish it. **Any mismatch → do not update polls**, write it in the report.
4. A party missing from the release keeps `pct: null` in `EXTRA` (never estimated). A new party that
   appears gets a row with `label` and `name` exactly as the source writes them.
5. Update the links in `POLL.source.links` and `COALITIONS.links` to the new release.

## 2 · Tema del giorno
1. Read the politics sections of ansa.it, agi.it and adnkronos.com. Pick the **national policy topic**
   covered by all three (a bill, a reform, the budget, a parliamentary vote, an institutional decision).
   Avoid crime news, private individuals, polls, and purely internal party quarrels.
2. Write a new entry at the **top** of `TOPICS` (shape: see the existing entry):
   - `summary` and `points`: facts only, each sentence supported by one of the links; positions
     attributed to whoever holds them ("secondo…", "chiede…"); when parties disagree, give each
     side's position with equal space and tone.
   - `question`: open, ending with "?", not suggesting an answer.
   - `links`: 2–4, all from approved domains; **at least one institutional** (camera.it, senato.it,
     governo.it, gazzettaufficiale.it, istat.it…) when one exists; `host` = the URL's host.
   - `checked` = today; Italian and English for every text.
3. If no topic meets these rules, add nothing (the site will show the latest one with its date).

## 3 · Party programmes
For each of the 10 parties:
1. Open every URL in `sources`. If one no longer exists or no longer supports its statement, replace it
   with an approved source that does, or remove the statement (a theme becomes `null`).
2. Search ansa.it, agi.it, adnkronos.com, pagellapolitica.it and the party's official site for programme
   news since the party's `checked` date (new programme documents, official proposals, votes).
   Add or replace a point only when the source states it explicitly; keep at most 6 points.
3. Set `checked` = today for each party whose sources were all opened today.
4. `COLLECTED` = the **oldest** `checked` date, written like "21 novembre 2026" / "21 November 2026"
   (the validator enforces this, so the page never claims a check that did not happen).

## 4 · Finish
1. `data/edition.js`: `UPDATED` = today if anything changed.
2. `npm run validate` → must end with "✔ data valid". Then `npm run build`.
   On any error: undo the change that caused it. Never "fix" a figure to make the check pass.
3. Write `automation/reports/YYYY-MM-DD.md`: what changed, every new fact with its URL, what was
   skipped and why, validator warnings.
4. Commit to `main` with message `Aggiornamento quotidiano YYYY-MM-DD` and push. The hosting service
   rebuilds from the repository (its build runs the validator again).
5. Update the preview page (the Claude artifact) with `dist/preview.html`, `privacy.html` and `og-image.jpg`.
6. Send the owner a short summary: changes, sources, anything skipped. If nothing changed, say so.

## Never
- Publish a figure, quote or date not found on an approved source today.
- Estimate a missing number, merge figures from different releases, or round published figures.
- Describe a party or a person with evaluative words that the source does not attribute to someone.
- Change the design or code. This run touches only the `data/` files, `main.js` (`TUNE.polls.electionDate`)
  and `automation/reports/`.
