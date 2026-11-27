// worlds/feed.js — the HOME feed and the right-hand column, as plain HTML cards.
// Pure functions (no DOM): used by main.js at run time and by the build prerender.
// Everything shown comes from the same data files as the sections, so nothing drifts out of sync.
import { PARTITI } from '../data/partiti.js';
import { COALITIONS, POLL, LAW } from '../data/sondaggi.js';
import { currentTopic, isToday } from '../data/topic.js';
import { REGISTRO } from '../data/registro.js';
import { esc, loc } from './util.js';

const dateFmt = (iso, lang, o) => new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', o);
const shortDate = (iso, lang) => dateFmt(iso, lang, { day: 'numeric', month: 'long' });
const num = (v, lang) => v.toFixed(1).replace('.', lang === 'en' ? '.' : ',');
export const ALPHA = [...PARTITI].sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));

const logo = (p, cls = '') => (p.logo
  ? `<img class="plogo ${cls}" src="${p.logo}" alt="" width="40" height="40" loading="lazy" style="--ac:${p.color}">`
  : `<span class="plogo mono ${cls}" style="--ac:${p.color}" aria-hidden="true">${esc(p.short || p.name.slice(0, 3))}</span>`);

/** Card: topic of the day (compact). */
export function topicCard(t, lang, now = new Date(), cls = '') {
  const topic = currentTopic(undefined, now);
  const first = loc(topic.summary, lang).split(/(?<=\.)\s/)[0];
  return `<article class="card topic-mini ${cls}" aria-labelledby="tm-${cls || 'x'}">
    <p class="card-k"><span class="tod-badge${isToday(topic, now) ? '' : ' old'}">${esc(t(isToday(topic, now) ? 'feed.today' : 'feed.lastTopic'))}</span>
      <time datetime="${topic.date}">${esc(shortDate(topic.date, lang))}</time></p>
    <h2 class="card-t" id="tm-${cls || 'x'}"><a href="#community">${esc(loc(topic.title, lang))}</a></h2>
    <p class="card-p">${esc(first)}</p>
    <p class="card-q">${esc(loc(topic.question, lang))}</p>
    <a class="btn" href="#community">${esc(t('feed.join'))}</a>
  </article>`;
}

/** Card: the two Supermedia coalition figures, on an honest 0–50 scale with the 42% line. */
export function pollsCard(t, lang, cls = '') {
  const rows = [COALITIONS.cl, COALITIONS.cd];
  const th = (LAW.bonusThreshold / 50) * 100;
  return `<article class="card polls-mini ${cls}" aria-labelledby="pm-${cls || 'x'}">
    <p class="card-k">${esc(t('feed.polls.k', { d: shortDate(POLL.source.dataDate, lang) }))}</p>
    <h2 class="card-t" id="pm-${cls || 'x'}"><a href="#sondaggi" data-sv="blocs">${esc(t('feed.polls.t'))}</a></h2>
    <div class="mini-bars" style="--th:${th}%">
      ${rows.map((c) => `<div class="mb-row"><span class="mb-n">${esc(loc(c.label, lang))}</span>
        <span class="mb-t" aria-hidden="true"><span class="mb-f" style="width:${(c.pct / 50) * 100}%"></span></span>
        <b class="mb-v">${num(c.pct, lang)}%</b></div>`).join('')}
    </div>
    <p class="card-s">${esc(t('feed.polls.s', { th: LAW.bonusThreshold }))}</p>
    <a class="btn ghost-btn" href="#sondaggi">${esc(t('feed.polls.more'))}</a>
  </article>`;
}

/** Card: the parties, alphabetical, same size for all. Buttons open the party's card. */
export function partiesCard(t, lang) {
  return `<article class="card" aria-labelledby="pc-t">
    <p class="card-k">${esc(t('feed.parties.k'))}</p>
    <h2 class="card-t" id="pc-t">${esc(t('feed.parties.t'))}</h2>
    <ul class="party-grid">${ALPHA.map((p) => `<li><a class="party-tile" href="#partiti" data-party="${esc(p.id)}" style="--ac:${p.color}">
      ${logo(p, 'md')}<span class="pt-n">${esc(p.name)}</span><span class="pt-l">${esc(p.leader)}</span></a></li>`).join('')}</ul>
    <p class="card-s">${esc(t('feed.parties.s'))}</p>
  </article>`;
}

/** Card: who we are, in three promises, each linking to its proof. */
export function aboutCard(t, cls = '') {
  return `<article class="card about ${cls}" aria-labelledby="ab-${cls || 'x'}">
    <h2 class="card-t" id="ab-${cls || 'x'}">${esc(t('feed.about.t'))}</h2>
    <ul class="promise">
      <li><a href="#partiti"><b>1</b><span>${esc(t('pledge.src'))}</span></a></li>
      <li><a href="#metodo"><b>€</b><span>${esc(t('pledge.money'))}</span></a></li>
      <li><a href="#fonti" data-open-registro><b>✓</b><span>${esc(t('pledge.fix'))}</span></a></li>
    </ul>
  </article>`;
}

/** Card: the latest entry of the public record of checks and corrections. */
export function recordCard(t, lang) {
  const r = REGISTRO[0];
  if (!r) return '';
  return `<article class="card" aria-labelledby="rc-t">
    <p class="card-k">${esc(t(`reg.${r.kind}`))} · <time datetime="${r.date}">${esc(shortDate(r.date, lang))}</time></p>
    <h2 class="card-t" id="rc-t">${esc(t('feed.record.t'))}</h2>
    <p class="card-p">${esc(loc(r.text, lang))}</p>
    <a class="btn ghost-btn" href="#fonti" data-open-registro>${esc(t('feed.record.more'))}</a>
  </article>`;
}

/** The whole HOME feed (centre column). Topic + polls cards are marked "dup": on wide screens the
 *  right-hand column already shows them, so the feed hides its copies there. */
export function feedHTML(t, lang, now = new Date()) {
  return topicCard(t, lang, now, 'dup') + pollsCard(t, lang, 'dup') + partiesCard(t, lang) + recordCard(t, lang);
}

/** Right-hand column (wide screens). */
export function railHTML(t, lang, now = new Date()) {
  return topicCard(t, lang, now, 'r') + pollsCard(t, lang, 'r') + aboutCard(t, 'r');
}
