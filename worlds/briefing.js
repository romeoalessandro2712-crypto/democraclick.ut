// worlds/briefing.js — HOME "In primo piano": four links to the site's current content, built from
// the same data as the sections (no separate copy to keep in sync). Pure function: also prerendered.
import { PARTITI, COLLECTED } from '../data/partiti.js';
import { POLL, COALITIONS, LAW } from '../data/sondaggi.js';
import { currentTopic, isToday } from '../data/topic.js';
import { esc, loc } from './util.js';

const shortDate = (iso, lang) => new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long' });
const num = (v, lang) => v.toFixed(1).replace('.', lang === 'en' ? '.' : ',');

export function briefingHTML(t, lang, now = new Date()) {
  const topic = currentTopic(undefined, now);
  const items = [
    { href: '#community', k: t(isToday(topic, now) ? 'brief.topic.k' : 'brief.topic.kOld', { d: shortDate(topic.date, lang) }), h: loc(topic.title, lang), m: t('brief.topic.m'), lead: true },
    { href: '#sondaggi', sv: 'blocs', k: t('brief.polls.k', { d: shortDate(POLL.source.dataDate, lang) }), h: t('brief.polls.h', { cs: num(COALITIONS.cl.pct, lang), cd: num(COALITIONS.cd.pct, lang) }), m: t('brief.polls.m') },
    { href: '#sondaggi', sv: 'blocs', k: t('brief.law.k'), h: t('brief.law.h', { th: LAW.bonusThreshold }), m: t('brief.law.m') },
    { href: '#partiti', k: t('brief.prog.k'), h: t('brief.prog.h', { n: PARTITI.length }), m: t('brief.prog.m', { d: loc(COLLECTED, lang) }) },
  ];
  return items.map((i) => `<li${i.lead ? ' class="lead"' : ''}><a class="brief" href="${i.href}"${i.sv ? ` data-sv="${i.sv}"` : ''}>
      <span class="bk">${esc(i.k)}</span><span class="bh">${esc(i.h)}</span><span class="bm">${esc(i.m)}</span></a></li>`).join('');
}
