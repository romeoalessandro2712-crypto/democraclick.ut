// tools/validate.mjs — the gate every update must pass before it is built or published.
// Run: npm run validate   (exit code 1 = errors: do NOT publish)
// It checks data shape, arithmetic, dates, links and the approved-source rules. It cannot judge
// whether a sentence is true: that is the job of the person or agent who reads the source.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);
const SRC = JSON.parse(fs.readFileSync(path.join(ROOT, 'automation/sources.json'), 'utf8'));
const approved = new Set([...SRC.institutions, ...SRC.agencies, ...SRC.polls, ...SRC.factcheck, ...Object.values(SRC.parties).flat()]);
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
const isApproved = (u) => { const h = host(u); return !!h && [...approved].some((d) => h === d || h.endsWith(`.${d}`)); };
const isoOk = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(new Date(`${d}T12:00:00`).getTime());
// "today" in Italy, whatever the server's time zone
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
const r1 = (x) => Math.round(x * 10) / 10;

const { POLL, COALITIONS, SIMS, EXTRA, BLOCS, OUTSIDE, valueOf, LAW } = await import('../data/sondaggi.js');
const { PARTITI, THEMES, COLLECTED } = await import('../data/partiti.js');
const { TOPICS, currentTopic } = await import('../data/topic.js');
const { UPDATED } = await import('../data/edition.js');
const { dict } = await import('../i18n.js');

// ── polls
if (!isoOk(POLL.source.dataDate) || !isoOk(POLL.source.published)) err('POLL: dataDate/published must be YYYY-MM-DD');
if (POLL.source.dataDate > today) err(`POLL: dataDate ${POLL.source.dataDate} is in the future`);
if (POLL.source.published < POLL.source.dataDate) err('POLL: published before dataDate');
const ids = new Set();
let sum = 0;
for (const p of POLL.parties) {
  if (ids.has(p.id)) err(`POLL: duplicate party ${p.id}`); ids.add(p.id);
  if (typeof p.pct !== 'number' || p.pct < 0 || p.pct > 100) err(`POLL: ${p.id} pct out of range`);
  if (p.delta != null && (typeof p.delta !== 'number' || Math.abs(p.delta) > 20)) err(`POLL: ${p.id} delta implausible`);
  if (Math.round(p.pct * 10) !== p.pct * 10 && Math.abs(Math.round(p.pct * 10) - p.pct * 10) > 1e-9) err(`POLL: ${p.id} has more than one decimal`);
  sum += p.pct;
}
if (sum > 100.05) err(`POLL: parties add up to ${r1(sum)}% (> 100)`);
if (!POLL.source.links.some(([, u]) => isApproved(u))) err('POLL: no link from an approved source');
const age = (new Date(`${today}T12:00:00`) - new Date(`${POLL.source.dataDate}T12:00:00`)) / 864e5;
if (age > 21) warn(`POLL: data is ${Math.round(age)} days old — a newer Supermedia is probably out`);

// ── coalitions + simulations
for (const k of ['cl', 'cd']) {
  const c = COALITIONS[k];
  if (typeof c.pct !== 'number' || c.pct <= 0 || c.pct >= 100) err(`COALITIONS.${k}: pct out of range`);
  c.members.forEach((m) => { if (!ids.has(m)) err(`COALITIONS.${k}: member ${m} not in POLL`); });
}
if (COALITIONS.date !== POLL.source.dataDate) err(`COALITIONS.date (${COALITIONS.date}) ≠ POLL dataDate (${POLL.source.dataDate}): update both from the same Supermedia`);
if (Math.abs(COALITIONS.cd.pct - BLOCS.cd.members.reduce((a, id) => a + POLL.parties.find((p) => p.id === id).pct, 0)) > 3) warn('COALITIONS.cd differs from the sum of its parties by > 3 points: check composition');
if (!COALITIONS.links.some(([, u]) => isApproved(u))) err('COALITIONS: no link from an approved source');
const known = new Set([...ids, ...EXTRA.map((e) => e.id)]);
for (const s of SIMS) {
  for (const [k, id] of s.parts) {
    if (k === 'party' && !known.has(id)) err(`SIMS.${s.id}: unknown party ${id}`);
    if (k === 'coal' && !COALITIONS[id]) err(`SIMS.${s.id}: unknown coalition ${id}`);
    if (k === 'sim' && !SIMS.some((x) => x.id === id)) err(`SIMS.${s.id}: unknown simulation ${id}`);
  }
  const v = valueOf('sim', s.id).v;
  if (!(v >= 0 && v <= 100)) err(`SIMS.${s.id}: value ${v} out of range`);
}
OUTSIDE.forEach((id) => { if (!ids.has(id)) err(`OUTSIDE: ${id} not in POLL`); });
if (LAW.bonusThreshold !== 42) warn('LAW: threshold is not 42 — make sure the law really changed');

// ── topic of the day
const t = currentTopic(TOPICS, new Date(`${today}T12:00:00`));
const tids = new Set();
for (const x of TOPICS) {
  if (tids.has(x.id)) err(`TOPICS: duplicate id ${x.id}`); tids.add(x.id);
  if (!isoOk(x.date)) err(`TOPICS ${x.id}: bad date`);
  if (x.date > today) warn(`TOPICS ${x.id}: dated in the future (${x.date}); it will appear on that day`);
  for (const f of ['title', 'summary', 'question', 'area']) if (!x[f]?.it || !x[f]?.en) err(`TOPICS ${x.id}: ${f} needs it + en`);
  if (!Array.isArray(x.links) || x.links.length < 2) err(`TOPICS ${x.id}: at least 2 links`);
  else {
    if (!x.links.some((l) => SRC.institutions.includes(host(l.url)) || SRC.institutions.some((d) => host(l.url)?.endsWith(`.${d}`)))) warn(`TOPICS ${x.id}: no link to an institution (Parliament, government, ISTAT…)`);
    x.links.forEach((l) => { if (host(l.url) !== l.host.replace(/^www\./, '')) err(`TOPICS ${x.id}: host label "${l.host}" ≠ URL host ${host(l.url)}`); });
  }
  if (/\?$/.test(x.question.it) === false) err(`TOPICS ${x.id}: the question must end with "?"`);
}
if (t.date !== today) warn(`TOPICS: no topic for today (${today}); the page shows the latest one (${t.date}) labelled as such`);
// topics added from 21/11/2026 on must use approved sources only
TOPICS.filter((x) => x.date > '2026-11-21').forEach((x) => x.links.forEach((l) => { if (!isApproved(l.url)) err(`TOPICS ${x.id}: ${host(l.url)} is not an approved source`); }));

// ── parties
const themeIds = THEMES.map((x) => x.id);
for (const p of PARTITI) {
  if (!p.checked || !isoOk(p.checked)) err(`PARTITI ${p.id}: missing "checked" date`);
  if (!p.sources?.length) err(`PARTITI ${p.id}: no sources`);
  p.sources?.forEach((s) => { if (!/^https:\/\//.test(s.url) || !host(s.url)) err(`PARTITI ${p.id}: bad URL ${s.url}`); });
  if (!p.points?.length || p.points.some((x) => !x.it || !x.en)) err(`PARTITI ${p.id}: points need it + en`);
  themeIds.forEach((k) => { const v = p.themes[k]; if (v !== null && (!v?.it || !v?.en)) err(`PARTITI ${p.id}: theme ${k} needs it + en or null`); });
}
const oldest = PARTITI.map((p) => p.checked).sort()[0];
const collectedIso = new Date(`${oldest}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
if (COLLECTED.it !== collectedIso) err(`PARTITI: COLLECTED says "${COLLECTED.it}" but the oldest party check is ${oldest} (${collectedIso}). The page must show the OLDEST check date.`);

// ── edition date, i18n
if (!isoOk(UPDATED) || UPDATED > today) err(`edition.js: UPDATED ${UPDATED} invalid or in the future`);
const latest = [POLL.source.published, t.date <= today ? t.date : '0', oldest].sort().pop();
if (UPDATED < latest) warn(`edition.js: UPDATED (${UPDATED}) is older than the newest content (${latest})`);
const missingEn = Object.keys(dict.it).filter((k) => !(k in dict.en));
if (missingEn.length) err(`i18n: keys missing in English: ${missingEn.join(', ')}`);

// ── report
console.log(`validate · today ${today} (Europe/Rome)`);
warnings.forEach((w) => console.log(`  ! ${w}`));
errors.forEach((e) => console.log(`  ✖ ${e}`));
console.log(errors.length ? `✖ ${errors.length} error(s): do not publish` : `✔ data valid (${warnings.length} warning(s))`);
process.exit(errors.length ? 1 : 0);
