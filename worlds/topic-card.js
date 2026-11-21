// worlds/topic-card.js — the "Tema del giorno" card as an HTML string.
// Pure function (no DOM): used by the COMMUNITY panel, the HOME briefing and the build prerender.
import { esc, loc } from './util.js';

const L = {
  it: { today: 'Tema del giorno', last: 'Ultimo tema pubblicato', q: 'La domanda di oggi', more: 'Per approfondire', checked: 'Fonti consultate il {d}. DemocraClick riassume i fatti e non prende posizione.', newTab: '(si apre in una nuova scheda)' },
  en: { today: 'Topic of the day', last: 'Latest topic published', q: 'Today’s question', more: 'Read more', checked: 'Sources checked on {d}. DemocraClick summarises the facts and takes no side.', newTab: '(opens in a new tab)' },
};

export const longDate = (iso, lang, weekday = true) => new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', { ...(weekday ? { weekday: 'long' } : {}), day: 'numeric', month: 'long', year: 'numeric' });

/** @param {object} topic  @param {'it'|'en'} lang  @param {{today:boolean, h:number, id:string}} o */
export function topicHTML(topic, lang, o = {}) {
  const s = L[lang] || L.it;
  const h = o.h || 3;
  const id = o.id || 'topic-title';
  return `
    <p class="tod-kicker" data-anim><span class="tod-badge${o.today === false ? ' old' : ''}">${esc(o.today === false ? s.last : s.today)}</span>
      <time datetime="${esc(topic.date)}">${esc(longDate(topic.date, lang))}</time></p>
    <p class="tod-area" data-anim>${esc(loc(topic.area, lang))}</p>
    <h${h} id="${esc(id)}" class="tod-title" data-anim>${esc(loc(topic.title, lang))}</h${h}>
    <p class="tod-sum" data-anim>${esc(loc(topic.summary, lang))}</p>
    ${topic.points?.length ? `<ul class="tod-points" data-anim>${topic.points.map((p) => `<li>${esc(loc(p, lang))}</li>`).join('')}</ul>` : ''}
    <div class="tod-q" data-anim><span>${esc(s.q)}</span><p>${esc(loc(topic.question, lang))}</p></div>
    <h${h + 1} class="tod-more" data-anim>${esc(s.more)}</h${h + 1}>
    <ul class="tod-links" data-anim>${topic.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(loc(l.label, lang))}<span class="host">${esc(l.host)} <span aria-hidden="true">↗</span><span class="sr-only"> ${esc(s.newTab)}</span></span></a></li>`).join('')}</ul>
    <p class="fine" data-anim>${esc(s.checked.replace('{d}', longDate(topic.checked || topic.date, lang, false)))}</p>`;
}
