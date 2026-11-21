// tools/prerender.mjs — writes each section's real content into the HTML at build time, in
// Italian (the primary language), so search engines, link previews, printouts and readers
// without JavaScript get the full text. With JavaScript on, the interactive version replaces it.
import { PARTITI, THEMES, COLLECTED } from '../data/partiti.js';
import { CONTENT, GROUPS, VOTES, SYMBOLS_NOTE } from '../data/content.js';
import { POLL, BLOCS, OUTSIDE, LAW, COALITIONS, SIMS, valueOf, sumOf, pctOf, OTHERS } from '../data/sondaggi.js';
import { currentTopic, isToday } from '../data/topic.js';
import { UPDATED } from '../data/edition.js';
import { topicHTML, longDate } from '../worlds/topic-card.js';
import { briefingHTML } from '../worlds/briefing.js';
import { t } from '../i18n.js';
import { REGISTRO } from '../data/registro.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const it = (o) => (o == null ? '' : typeof o === 'string' ? o : o.it);
const n1 = (v) => v.toFixed(1).replace('.', ',');
const box = (b) => `<p><strong>${esc(it(b.title))}</strong> ${esc(it(b.body))}</p>`;
const link = (label, url) => `<a href="${esc(url)}" rel="noopener noreferrer">${esc(label)}</a>`;
const cite = (p, src) => (src?.length ? ` <sup>${src.map((i) => `<a href="${esc(p.sources[i].url)}" rel="noopener noreferrer">[${i + 1}]</a>`).join('')}</sup>` : '');
const alpha = [...PARTITI].sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));

function partiti() {
  return `<p>Fonti verificate il ${esc(COLLECTED.it)}. L’ordine è alfabetico. ${esc(SYMBOLS_NOTE.it)}</p>` + alpha.map((p) => `
    <article>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.leader)} · ${esc(it(p.role))} · Fonti del ${esc(it(p.updated))}</p>
      <p><strong>Stato del programma.</strong> ${esc(it(p.status))}${cite(p, p.status.src)}</p>
      <h4>Programma in sintesi</h4>
      <ol>${p.points.map((x) => `<li>${esc(it(x))}${cite(p, x.src)}</li>`).join('')}</ol>
      <h4>Temi</h4>
      <dl>${THEMES.map((th) => `<dt>${esc(it(th.label))}</dt><dd>${p.themes[th.id] ? esc(it(p.themes[th.id])) + cite(p, p.themes[th.id].src) : 'Non emerso dalle fonti consultate.'}</dd>`).join('')}</dl>
      <h4>Fonti</h4>
      <ol>${p.sources.map((s) => `<li>${link(s.label, s.url)}</li>`).join('')}</ol>
    </article>`).join('');
}

function sondaggi() {
  const name = (id) => (PARTITI.find((p) => p.id === id) || POLL.parties.find((p) => p.id === id) || {}).name || POLL.parties.find((p) => p.id === id).label;
  const rows = [...POLL.parties].sort((a, b) => b.pct - a.pct).map((r) => `<tr><th scope="row">${esc(name(r.id))}</th><td>${n1(r.pct)}%</td></tr>`).join('');
  return `<p><strong>Un sondaggio non è un risultato ufficiale.</strong> Fonte: ${esc(POLL.source.name)}, dati al ${esc(POLL.source.dataDate.split('-').reverse().join('/'))}. ${esc(POLL.source.method.it)}</p>
    <table><caption>Intenzioni di voto per partito (%)</caption><tbody>${rows}<tr><th scope="row">Altri</th><td>${n1(OTHERS)}%</td></tr></tbody></table>
    <h4>Coalizioni — dato Supermedia (%)</h4>
    <ul><li>Campo largo: ${n1(COALITIONS.cl.pct)}%</li><li>Centrodestra: ${n1(COALITIONS.cd.pct)}%</li></ul>
    <p>${esc(COALITIONS.def.it)}</p>
    <h4>Simulazioni con il centro</h4>
    <p>Somme aritmetiche dei consensi riportati: non sono sondaggi di coalizione e non considerano come potrebbe cambiare il voto dopo un accordo.</p>
    <ul>${SIMS.map((sm) => { const r = valueOf('sim', sm.id); return `<li>${esc(sm.title.it)}: ${n1(r.v)}% (somma indicativa${r.missing.length ? '; PLD non rilevato nella Supermedia del 19/11, non compreso' : ''})</li>`; }).join('')}</ul>
    <p>Legge elettorale: premio di maggioranza alla lista o coalizione vincitrice che ottiene almeno il ${LAW.bonusThreshold}% (${LAW.bonusChamber} seggi alla Camera, ${LAW.bonusSenate} al Senato; tetto ${LAW.capChamber} e ${LAW.capSenate}); altrimenti seggi proporzionali. Soglie: ${LAW.listThreshold}% liste, ${LAW.coalitionThreshold}% coalizioni.</p>
    <p>${POLL.source.links.concat(COALITIONS.links, LAW.links).map(([l, u]) => link(l, u)).join(' · ')}</p>`;
}

function dati() {
  const C = CONTENT.dati;
  const tot = [0, 0, 0, 0];
  GROUPS.forEach(([g]) => VOTES[g].forEach((x, i) => { tot[i] += x; }));
  return `${box(C.warn)}
    <h4>${esc(it(C.step1))}</h4><ul>${GROUPS.map(([g, nm, n]) => `<li>${esc(it(nm))}: ${n} seggi su 100</li>`).join('')}</ul>
    <h4>${esc(it(C.step2))}</h4><p>${esc(tot[0] > tot[1] ? it(C.approved) : it(C.rejected))}: ${tot[0]} sì, ${tot[1]} no, ${tot[2]} astenuti, ${tot[3]} in missione. ${esc(it(C.passRule))}</p>
    <h4>${esc(it(C.certain))}</h4>${box(C.deputies)}${box(C.senators)}
    <h4>${esc(it(C.step3))}</h4><ol>${C.path.map((p) => `<li><strong>${esc(it(p.title))}</strong> ${esc(it(p.body))}</li>`).join('')}</ol>
    <h4>${esc(it(C.limitsTitle))}</h4>${C.limits.map((x) => `<p><strong>${esc(it(x.title))}</strong> ${x.parts.map((q) => (q.link ? link(q.link[0], q.link[1]) : esc(it(q)))).join(' ')}</p>`).join('')}`;
}

function fonti() {
  return `<h4>Registro delle verifiche e correzioni</h4><ul>${REGISTRO.map((r) => `<li>${esc(r.date.split('-').reverse().join('/'))} · ${esc(r.text.it)}${r.link ? ` ${link('Dettagli', r.link)}` : ''}</li>`).join('')}</ul>` + alpha.map((p) => `<h4>${esc(p.name)} (fonti del ${esc(it(p.updated))})</h4><ul>${p.sources.map((s) => `<li>${link(s.label, s.url)}</li>`).join('')}</ul>`).join('');
}

function metodo() {
  const M = CONTENT.metodo;
  return [M.synth, M.same, M.six, M.missing, M.evolving, M.partiesSpeak, M.which].map(box).join('')
    + `<h4>${esc(it(M.provTitle))}</h4><p>${esc(it(M.provBody))} ${M.provTags.map(it).map(esc).join(' · ')}</p>`
    + `<h4>${esc(it(M.verifyTitle))}</h4>${M.levels.map(box).join('')}`
    + `<h4>${esc(it(M.fundTitle))}</h4><p>${esc(it(M.fundNote))}</p><ul>${M.fund.map((x) => `<li>${esc(it(x))}</li>`).join('')}</ul>`
    + `<h4>${esc(it(M.roadTitle))}</h4><ol>${M.road.map((x) => `<li>${esc(it(x))}</li>`).join('')}</ol>`;
}

function community() {
  const C = CONTENT.community;
  const topic = currentTopic();
  return `<article class="topic-static">${topicHTML(topic, 'it', { today: isToday(topic), h: 3, id: 'topic-title-static' })}</article>
    <p><strong>${esc(t('cm.join'))}.</strong> ${esc(t('cm.why'))} ${esc(t('cm.notActive'))}</p>
    <h4>${esc(t('cm.rules'))}</h4><ul>${['r1', 'r2', 'r3', 'r4', 'r5'].map((k) => `<li>${esc(t(`cm.rule.${k}`))}</li>`).join('')}</ul>
    <h4>${esc(it(C.about.title))}</h4>${C.about.boxes.map(box).join('')}
    <h4>${esc(it(C.experts.title))}</h4><p><strong>${esc(it(C.experts.planned))}</strong> ${esc(it(C.experts.lead))}</p>${C.experts.boxes.map(box).join('')}`;
}

export function prerender() {
  return { partiti: partiti(), sondaggi: sondaggi(), dati: dati(), fonti: fonti(), metodo: metodo(), community: community() };
}

/** Fill every <div class="prerender" data-prerender="id"></div> in an HTML string, plus the HOME
 *  briefing and the footer's update date (visible without JavaScript; the script redraws them). */
export function injectPrerender(html) {
  const blocks = prerender();
  html = html.replace('<ol id="brief-list"></ol>', `<ol id="brief-list">${briefingHTML(t, 'it')}</ol>`)
    .replace('<span id="foot-upd" class="foot-upd"></span>', `<span id="foot-upd" class="foot-upd">${esc(t('footer.updated', { d: longDate(UPDATED, 'it', false) }))}</span>`);
  return html.replace(/<div class="prerender" data-prerender="([a-z]+)"><\/div>/g, (m, id) => (blocks[id] ? `<div class="prerender" data-prerender="${id}">${blocks[id]}</div>` : m));
}
