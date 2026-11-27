// worlds/sondaggi.js — SONDAGGI: voting intentions as glass towers, each topped by the party's
// symbol, then regrouped into coalition stacks against the 42% majority-bonus line.
//   parties — one tower per party, height = % (Supermedia YouTrend/Agi)
//   blocs   — centre-left and centre-right stacks; Futuro Nazionale and Azione apart
//   (panel) the Supermedia's own coalition figures, then "simulazioni con il centro": arithmetic sums
//   of reported figures, each shown with its parts (symbols, values) and labelled as indicative.
import { PARTITI } from '../data/partiti.js';
import { POLL, BLOCS, OUTSIDE, BLOC_SOURCE, OTHER_POLLS, LAW, COALITIONS, EXTRA, SIMS, valueOf, sumOf, pctOf, OTHERS } from '../data/sondaggi.js';
import { esc, loc, damp, restOrbs, labelLayer } from './util.js';

export const SONDAGGI_ORIGIN = [-15, 0, 12];
const VIEWS = ['parties', 'blocs'];
const H = 0.12; // world units per percentage point
const NEUTRAL = '#7F8C93'; // your --faint, for parties without a card

/** Party info for a poll row: card data when the party has one, otherwise a neutral monogram. */
const INFO = Object.fromEntries([...POLL.parties, ...EXTRA].map((r) => {
  const p = PARTITI.find((x) => x.id === r.id);
  return [r.id, { id: r.id, label: r.label, name: p ? p.name : (r.name || r.label), color: p ? p.color : NEUTRAL, logo: p ? p.logo : null }];
}));
const ROWS = [...POLL.parties].sort((a, b) => b.pct - a.pct);
const r1 = (x) => Math.round(x * 10) / 10;
const fmt = (v, lang) => v.toFixed(1).replace('.', lang === 'it' ? ',' : '.');
const fmtD = (d, lang) => (d == null ? 'n.d.' : d === 0 ? '=' : `${d > 0 ? '+' : '−'}${fmt(Math.abs(d), lang)}`);
const dateIt = (iso, lang) => new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function sondaggiUI({ root, t, getLang, view, announce, tune }) {
  const seg = root.querySelector('#sv-seg');
  const body = root.querySelector('#sv-body');
  const pill = root.querySelector('#sv-live');
  let mode = 'parties';
  const L = (o) => loc(o, getLang());
  const logo = (i, size) => (i.logo
    ? `<img class="plogo ${size}" src="${i.logo}" alt="" width="64" height="64">`
    : `<span class="plogo mono ${size}" style="--ac:${i.color}" aria-hidden="true">${esc(i.label)}</span>`);

  // freshness: the pill says LIVE only while the data is recent (TUNE.polls.freshDays)
  function freshness() {
    const days = (Date.now() - new Date(`${POLL.source.dataDate}T12:00:00`).getTime()) / 864e5;
    const fresh = days <= (tune.polls.freshDays ?? 8);
    pill.dataset.state = fresh ? 'live' : 'stale';
    pill.innerHTML = `<i aria-hidden="true"></i><b>${esc(fresh ? 'LIVE' : t('sv.stale'))}</b><span>${esc(POLL.source.name)} · ${esc(dateIt(POLL.source.dataDate, getLang()))}</span>`;
  }

  // legal blackout: no polls in the 15 days before the vote (law 28/2000, art. 8)
  function blackout() {
    const d = tune.polls.electionDate;
    if (!d) return false;
    const until = (new Date(`${d}T00:00:00`).getTime() - Date.now()) / 864e5;
    return until >= 0 && until <= 15;
  }

  function partiesTable() {
    const lang = getLang();
    return `<table class="svtab" data-anim>
      <caption class="sr-only">${esc(t('sv.byParty'))}</caption>
      <thead><tr><th scope="col">${esc(t('sv.party'))}</th><th scope="col" class="num">%</th><th scope="col" class="num">${esc(t('sv.change'))}</th></tr></thead>
      <tbody>${ROWS.map((r) => {
        const i = INFO[r.id];
        return `<tr style="--ac:${i.color}"><th scope="row"><span class="ppn">${logo(i, 'xs')}${esc(i.name)}</span></th>
          <td class="num"><b>${fmt(r.pct, lang)}</b><span class="bar" style="width:${(r.pct / 30) * 100}%" aria-hidden="true"></span></td>
          <td class="num d">${fmtD(r.delta, lang)}</td></tr>`;
      }).join('')}</tbody></table>
      <p class="fine" data-anim>${esc(L(POLL.deltaNote))} ${esc(t('sv.others', { n: fmt(OTHERS, lang) }))}</p>`;
  }

  // ── coalitions, remade for reading: a head-to-head on a 30–50% scale with the 42% line, then
  //    one table per coalition (logo, name, %, bar), then the parties outside. Every total is a sum.
  const n = (v) => fmt(v, getLang());
  const big = (v) => `${n(v)}<small>%</small>`;

  function headToHead(a, b) {
    const side = (s, cls) => `<div class="h2h-side ${cls}"><span class="nm">${s.term ? `<button type="button" class="term" aria-expanded="false" aria-controls="cl-def">${esc(s.name)}</button>` : esc(s.name)}</span><b class="num">${big(s.v)}</b>
      <span class="st ${s.v >= LAW.bonusThreshold ? 'up' : 'down'}">${esc(t(s.v >= LAW.bonusThreshold ? 'sv.above' : 'sv.below', { th: LAW.bonusThreshold }))}</span></div>`;
    return `<figure class="h2h" data-anim>
      <figcaption class="sr-only">${esc(t('sv.h2h.sr', { a: a.name, av: n(a.v), b: b.name, bv: n(b.v), th: LAW.bonusThreshold }))}</figcaption>
      <div class="h2h-row">${side(a, 'a')}<span class="vs" aria-hidden="true">vs</span>${side(b, 'b')}</div>
      <div class="duel" aria-hidden="true" style="--th:${(LAW.bonusThreshold / 50) * 100}%">
        ${[a, b].map((s) => `<div class="drow"><span class="dn">${esc(s.name)}</span><span class="dt"><span class="df" style="width:${(s.v / 50) * 100}%"></span></span><b>${n(s.v)}</b></div>`).join('')}
        <div class="daxis"><span class="dn"></span><span class="dt"><em style="left:0">0</em><em class="thr" style="left:var(--th)">${LAW.bonusThreshold}%</em><em style="left:100%">50</em></span><b></b></div>
      </div>
      <p class="h2h-gap">${esc(t('sv.gap', { n: n(Math.abs(a.v - b.v)) }))}${a.v === b.v ? '' : ` · ${esc(t('sv.ahead', { who: (a.v > b.v ? a : b).name }))}`}</p>
    </figure>`;
  }

  function coalition(title, ids, opts = {}) {
    const total = sumOf(ids);
    const rows = [...ids].sort((x, y) => pctOf(y) - pctOf(x));
    return `<section class="coal" data-anim aria-label="${esc(title)}">
      <header><h3 class="h4">${esc(title)}</h3>${opts.tag ? `<span class="tag">${esc(opts.tag)}</span>` : ''}<b class="tot num">${big(total)}</b></header>
      <div class="stackbar" aria-hidden="true">${rows.map((id) => `<span style="width:${(pctOf(id) / 50) * 100}%;background:${INFO[id].color}" class="${opts.mark === id ? 'mark' : ''}"></span>`).join('')}<i style="left:${(LAW.bonusThreshold / 50) * 100}%"></i></div>
      <table class="svtab mini"><caption class="sr-only">${esc(t('sv.members', { name: title }))}</caption><tbody>
        ${rows.map((id) => `<tr style="--ac:${INFO[id].color}" class="${opts.mark === id ? 'mark' : ''}"><th scope="row"><span class="ppn">${logo(INFO[id], 'xs')}${esc(INFO[id].name)}${opts.mark === id ? ` <span class="tag hyp">${esc(t('sv.hyp'))}</span>` : ''}</span></th>
          <td class="num"><b>${n(pctOf(id))}</b><span class="bar" style="width:${(pctOf(id) / 30) * 100}%" aria-hidden="true"></span></td></tr>`).join('')}
      </tbody></table>
    </section>`;
  }

  function outsideBlock(ids) {
    return `<section class="coal out" data-anim aria-label="${esc(t('sv.outside'))}">
      <header><h3 class="h4">${esc(t('sv.outside'))}</h3></header>
      <table class="svtab mini"><caption class="sr-only">${esc(t('sv.outside'))}</caption><tbody>
        ${ids.map((id) => `<tr style="--ac:${INFO[id].color}"><th scope="row"><span class="ppn">${logo(INFO[id], 'xs')}${esc(INFO[id].name)}</span></th>
          <td class="num"><b>${n(pctOf(id))}</b><span class="bar" style="width:${(pctOf(id) / 30) * 100}%" aria-hidden="true"></span></td></tr>`).join('')}
        <tr style="--ac:${NEUTRAL}"><th scope="row"><span class="ppn"><span class="plogo mono xs" style="--ac:${NEUTRAL}" aria-hidden="true">…</span>${esc(t('sv.othersRow'))}</span></th>
          <td class="num"><b>${n(OTHERS)}</b><span class="bar" style="width:${(OTHERS / 30) * 100}%" aria-hidden="true"></span></td></tr>
      </tbody></table></section>`;
  }

  // one part of a simulation: party (symbol + short name + value), coalition or another simulation
  function partChip([kind, id, sign = 1], first) {
    const op = first ? '' : `<span class="op" aria-hidden="true">${sign < 0 ? '−' : '+'}</span>`;
    const r = valueOf(kind, id);
    const val = r.missing.length ? t('sv.nd') : n(r.v);
    if (kind === 'party') {
      const i = INFO[id];
      return `${op}<span class="pc" style="--ac:${i.color}">${logo(i, 'xs')}<span class="pn">${esc(i.label)}</span><b>${val}</b></span>`;
    }
    const name = kind === 'coal' ? L(COALITIONS[id].label) : L(SIMS.find((x) => x.id === id).title);
    const ids = kind === 'coal' ? COALITIONS[id].members : [];
    return `${op}<span class="pc coal-chip">${ids.length ? `<span class="stackl" aria-hidden="true">${ids.slice(0, 4).map((x) => logo(INFO[x], 'xs')).join('')}</span>` : ''}<span class="pn">${esc(name)}</span><b>${kind === 'sim' && r.missing.length ? n(r.v) + '*' : val}</b></span>`;
  }

  function simRow(sim) {
    const r = valueOf('sim', sim.id);
    const max = 55;
    const formula = sim.parts.map(([k, id, sign = 1], i) => {
      const v = valueOf(k, id);
      return `${i ? (sign < 0 ? ' − ' : ' + ') : ''}${v.missing.length && k === 'party' ? t('sv.nd') : n(v.v)}`;
    }).join('');
    const miss = r.missing.map((id) => INFO[id].label).join(', ');
    return `<li class="sim" data-anim>
      <div class="sim-h"><h3 class="sim-t">${esc(L(sim.title))}</h3><b class="sim-v num">${n(r.v)}<small>%</small>${r.missing.length ? '<sup aria-hidden="true">*</sup>' : ''}</b></div>
      <div class="sim-bar" aria-hidden="true"><span class="fill${r.v >= LAW.bonusThreshold ? ' over' : ''}" style="width:${(Math.max(0, r.v) / max) * 100}%"></span><i style="left:${(LAW.bonusThreshold / max) * 100}%"></i></div>
      <p class="sim-parts">${sim.parts.map((p, i) => partChip(p, i === 0)).join('')}</p>
      <p class="sim-f">${esc(formula)} · ${esc(t('sv.indic'))}${r.missing.length ? ` · <span class="miss">* ${esc(t('sv.missing', { p: miss }))}</span>` : ''}</p>
    </li>`;
  }

  function blocsHTML() {
    const lang = getLang();
    const cl = COALITIONS.cl, cd = COALITIONS.cd;
    const clName = L(cl.label), cdName = L(cd.label);
    const others = OTHER_POLLS.map((o) => `<li><a href="${esc(o.url)}" target="_blank" rel="noopener noreferrer">${esc(o.who)}</a>, ${esc(o.date)}: ${esc(L(BLOCS.cs.label))} ${n(o.cs)} · ${esc(cdName)} ${n(o.cd)}</li>`).join('');
    const clGap = r1(cl.pct - sumOf(cl.members));
    return `<section class="sv-sec" data-anim aria-labelledby="sv-coal-h">
        <h2 id="sv-coal-h" class="sv-h">${esc(t('sv.coalTitle'))}</h2>
        ${headToHead({ name: clName, short: clName, v: cl.pct, term: true }, { name: cdName, short: cdName, v: cd.pct })}
        <div id="cl-def" class="term-def" hidden><p>${esc(L(COALITIONS.def))}</p>
          <p class="fine">${esc(t('sv.clGap', { cl: n(cl.pct), sum: n(sumOf(cl.members)), d: n(clGap) }))}</p></div>
        <p class="fine">${esc(t('sv.read.blocs', { cl: n(cl.pct), cd: n(cd.pct), gap: n(Math.abs(cl.pct - cd.pct)), th: LAW.bonusThreshold }))}</p>
      </section>
      <section class="sv-sec" aria-labelledby="sv-sim-h">
        <h2 id="sv-sim-h" class="sv-h" data-anim>${esc(t('sv.simTitle'))}</h2>
        <p class="fine sim-note" data-anim>${esc(t('sv.simNote'))}</p>
        <ol class="simlist">${SIMS.map(simRow).join('')}</ol>
        <p class="fine" data-anim>${esc(t('sv.simScale', { th: LAW.bonusThreshold }))}</p>
      </section>
      <details class="more" data-anim><summary>${esc(t('sv.compo'))}</summary>
        ${coalition(clName, cl.members, { tag: t('sv.sumTag') })}
        ${coalition(cdName, cd.members, { tag: t('sv.sumTag') })}
        ${outsideBlock(OUTSIDE)}
        <p class="fine">${esc(t('sv.blocSource'))} <a href="${esc(BLOC_SOURCE[1])}" target="_blank" rel="noopener noreferrer">${esc(BLOC_SOURCE[0])}</a></p></details>
      <div class="rules" data-anim><h3 class="h4">${esc(t('sv.law'))}</h3>
        <ul class="plain">
          <li>${esc(t('sv.law.bonus', { th: LAW.bonusThreshold, c: LAW.bonusChamber, s: LAW.bonusSenate, cc: LAW.capChamber, cs: LAW.capSenate }))}</li>
          <li>${esc(t('sv.law.none', { th: LAW.bonusThreshold }))}</li>
          <li>${esc(t('sv.law.thr', { l: LAW.listThreshold, c: LAW.coalitionThreshold }))}</li>
          <li>${esc(t('sv.law.unknown'))}</li>
        </ul>
        <p class="fine">${LAW.links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join(' · ')}</p></div>
      <details class="more" data-anim><summary>${esc(t('sv.otherPolls'))}</summary><ul class="plain">${others}</ul></details>
      <p class="fine" data-anim>${esc(t('sv.coalSrc'))} ${COALITIONS.links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join(' · ')}</p>`;
  }

  function sourceHTML() {
    const s = POLL.source;
    return `<details class="more" data-anim><summary>${esc(t('sv.note'))}</summary>
      <dl class="meta">
        <div><dt>${esc(t('sv.src'))}</dt><dd>${esc(s.name)}</dd></div>
        <div><dt>${esc(t('sv.date'))}</dt><dd>${esc(dateIt(s.dataDate, getLang()))} (${esc(t('sv.pub'))} ${esc(dateIt(s.published, getLang()))})</dd></div>
        <div><dt>${esc(t('sv.window'))}</dt><dd>${esc(dateIt(s.window.from, getLang()))} – ${esc(dateIt(s.window.to, getLang()))}</dd></div>
        <div><dt>${esc(t('sv.method'))}</dt><dd>${esc(L(s.method))}</dd></div>
        <div><dt>${esc(t('sv.institutes'))}</dt><dd>${s.institutes.map(([n, d]) => `${esc(n)} (${esc(d)})`).join(', ')}</dd></div>
        <div><dt>${esc(t('sv.sample'))}</dt><dd>${esc(t('sv.sample.v'))}</dd></div>
      </dl>
      <p class="fine">${s.links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(l)}</a>`).join(' · ')}</p></details>`;
  }

  function render() {
    freshness();
    seg.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === mode)));
    if (blackout()) {
      body.innerHTML = `<div class="warn" data-anim>${esc(t('sv.blackout'))}</div>`;
      const v = view(); if (v) v.setMode('hidden');
      return;
    }
    body.innerHTML = `<p class="disclaimer" data-anim><strong>${esc(t('sv.notResult'))}</strong> ${esc(t('sv.notResult.b'))}</p>
      ${mode === 'parties' ? partiesTable() : blocsHTML()}
      ${sourceHTML()}
      <p class="fine" data-anim>${esc(t('sv.blackout'))}</p>`;
    const v = view(); if (v) v.setMode(mode);
  }

  function setMode(m) {
    if (!VIEWS.includes(m)) return;
    mode = m; render();
    document.dispatchEvent(new CustomEvent('dc:panel', { detail: body }));
    announce(seg.querySelector(`[data-view="${m}"]`)?.textContent || m);
  }
  // links elsewhere on the site can open a given view: <a href="#sondaggi" data-sv="blocs">
  let pending = null;
  document.addEventListener('click', (e) => { const a = e.target.closest?.('a[data-sv]'); if (a && VIEWS.includes(a.dataset.sv)) pending = a.dataset.sv; }, true);
  body.addEventListener('click', (e) => {
    const b = e.target.closest('.term'); if (!b) return;
    const d = body.querySelector('#cl-def'); if (!d) return;
    const open = d.hidden; d.hidden = !open; b.setAttribute('aria-expanded', String(open));
  });
  seg.addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) setMode(b.dataset.view); });

  // optional live feed: a JSON with the same shape as POLL (TUNE.polls.feed)
  async function pull() {
    const url = tune.polls.feed;
    if (!url) return;
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) return;
      const d = await r.json();
      if (d && Array.isArray(d.parties) && d.source && d.source.dataDate) { Object.assign(POLL, d); render(); }
    } catch (e) { /* keep the bundled data */ }
  }

  return {
    enter() { if (pending) { mode = pending; pending = null; } render(); pull(); },
    leave() {},
    sync() { render(); },
    rerender() { render(); },
    onHit(hit) { if (hit.type === 'tower') setMode(VIEWS[(VIEWS.indexOf(mode) + 1) % VIEWS.length]); },
    tip(hit) {
      if (hit.type !== 'tower') return '';
      const r = POLL.parties.find((x) => x.id === hit.id);
      const lang = getLang();
      return `${INFO[hit.id].name} · ${fmt(r.pct, lang)}% (${fmtD(r.delta, lang)})`;
    },
  };
}

/** Round symbol texture: the logo when there is one, otherwise a monogram on the party colour. */
function symbolTexture(THREE, info) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const ring = () => { g.lineWidth = 12; g.strokeStyle = info.color; g.beginPath(); g.arc(128, 128, 120, 0, Math.PI * 2); g.stroke(); };
  g.beginPath(); g.arc(128, 128, 116, 0, Math.PI * 2); g.fillStyle = '#ffffff'; g.fill();
  if (!info.logo) {
    g.fillStyle = '#121A22'; g.font = '600 72px "Inter Tight", system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(info.label, 128, 132); ring(); tex.needsUpdate = true;
    return tex;
  }
  const img = new Image();
  img.onload = () => {
    g.save(); g.beginPath(); g.arc(128, 128, 116, 0, Math.PI * 2); g.clip();
    const s = Math.max(232 / img.width, 232 / img.height);
    g.drawImage(img, 128 - (img.width * s) / 2, 128 - (img.height * s) / 2, img.width * s, img.height * s);
    g.restore(); ring(); tex.needsUpdate = true;
  };
  img.src = info.logo;
  return tex;
}

export function sondaggiView(ctx) {
  const { THREE, orbs } = ctx;
  const V3 = THREE.Vector3;
  const O = new V3(...SONDAGGI_ORIGIN);
  const N = ROWS.length + 1; // + "altri"
  const CLX = N; // extra instance: campo largo minor lists (coalition figure minus its listed parties)
  const CLX_V = r1(COALITIONS.cl.pct - sumOf(COALITIONS.cl.members));
  let built = null, disposeTimer = 0, active = false, mode = 'parties', hovered = -1;

  function build() {
    if (built) return built;
    const geo = new THREE.BoxGeometry(0.6, 1, 0.6);
    geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2, envMapIntensity: 0.35 });
    const mesh = new THREE.InstancedMesh(geo, mat, N + 1);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    const st = Array.from({ length: N + 1 }, (_, i) => ({ p: new V3().copy(O), tp: new V3().copy(O), y: 0, ty: 0, h: 0.0001, th: 0.0001, w: 1, tw: 1 }));
    const colors = [...ROWS.map((r) => INFO[r.id].color), NEUTRAL, '#B8C2C6'];
    colors.forEach((c, i) => mesh.setColorAt(i, new THREE.Color(c)));
    // reference planes: 3% list threshold, 42% majority bonus
    const planeMat = new THREE.MeshBasicMaterial({ color: ctx.accent.clone(), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    const edgeMat = new THREE.LineBasicMaterial({ color: ctx.glow.clone(), transparent: true, opacity: 0 });
    const edgeGeo = new THREE.BufferGeometry().setFromPoints([new V3(-0.5, 0, 0), new V3(0.5, 0, 0)]);
    const edge = new THREE.Line(edgeGeo, edgeMat);
    const ps = { y: 0, ty: 0, w: 1, tw: 1, x: 0, tx: 0, op: 0, top: 0 };
    // symbols on top of each tower
    const sprites = ROWS.map((r) => {
      const m = new THREE.SpriteMaterial({ map: symbolTexture(THREE, INFO[r.id]), transparent: true, opacity: 0, depthWrite: false });
      const sp = new THREE.Sprite(m); sp.renderOrder = 2;
      return { sp, m, o: 0 };
    });
    ctx.scene.add(mesh, plane, edge, ...sprites.map((s) => s.sp));
    const labels = labelLayer(ctx.labelsRoot, 'sondaggi');
    built = { geo, mat, mesh, st, planeMat, planeGeo, plane, edgeMat, edgeGeo, edge, ps, sprites, labels };
    layout();
    return built;
  }

  function dispose() {
    if (!built) return;
    const b = built;
    ctx.scene.remove(b.mesh, b.plane, b.edge, ...b.sprites.map((s) => s.sp));
    b.geo.dispose(); b.mat.dispose(); b.mesh.dispose(); b.planeGeo.dispose(); b.planeMat.dispose(); b.edgeGeo.dispose(); b.edgeMat.dispose();
    b.sprites.forEach((s) => { s.m.map && s.m.map.dispose(); s.m.dispose(); });
    b.labels.remove();
    built = null;
  }

  // stacks for the coalition views. The two coalitions stand side by side with their party
  // labels on the OUTER sides (centre-left reads leftwards, centre-right rightwards), so labels never
  // collide; the parties outside and "altri" follow, narrower. Bottom of each stack = largest party.
  const MAIN_W = 1.5, SIDE_W = 1.0, LABEL_ROOM = 2.5;
  // compact = phones and small laptops/tablets: only the two coalitions are drawn, names go in the totals
  const compact = () => ctx.isNarrow() || window.innerWidth < 1200;
  function stacks() {
    const cd = COALITIONS.cd.members;
    const out = OUTSIDE;
    const cols = [
      { key: 'cs', ids: [...COALITIONS.cl.members, ...(CLX_V > 0 ? ['__clx'] : [])], x: -3.4, w: MAIN_W, side: -1 },
      { key: 'cd', ids: cd, x: compact() ? -1.4 : -1.7, w: MAIN_W, side: 1 },
    ];
    if (compact()) return cols; // phones and small screens: the two coalitions only; the panel lists the parties outside
    let x = -1.7 + MAIN_W / 2 + LABEL_ROOM + SIDE_W / 2;
    out.forEach((id) => { cols.push({ key: id, ids: [id], x, w: SIDE_W, side: 0 }); x += 1.35; });
    cols.push({ key: 'altri', ids: ['__altri'], x, w: SIDE_W, side: 0 });
    return cols;
  }
  const extent = (cols) => { const z = cols[cols.length - 1]; return [cols[0].x - cols[0].w / 2 - LABEL_ROOM, z.x + z.w / 2 + (z.side > 0 ? LABEL_ROOM : 0)]; };

  function layout() {
    if (!built) return;
    const b = built;
    if (mode === 'hidden') { b.st.forEach((s) => { s.th = 0.0001; }); b.ps.top = 0; return; }
    if (mode === 'parties') {
      [...ROWS, { id: '__altri', pct: OTHERS }].forEach((r, i) => {
        const x = (i - (N - 1) / 2) * 0.86;
        const s = b.st[i];
        s.tp.set(O.x + x, O.y, O.z - 0.035 * x * x); s.ty = 0; s.th = r.pct * H; s.tw = 1;
      });
      b.ps.ty = LAW.listThreshold * H; b.ps.tw = N * 0.86 + 0.6; b.ps.tx = 0; b.ps.top = 0.5;
      return;
    }
    const cols = stacks();
    const idx = (id) => (id === '__altri' ? N - 1 : id === '__clx' ? CLX : ROWS.findIndex((r) => r.id === id));
    const val = (id) => (id === '__altri' ? OTHERS : id === '__clx' ? CLX_V : pctOf(id));
    b.st.forEach((s) => { s.th = 0.0001; s.ty = 0; s.tw = 0.0001; }); // columns not drawn (small screens) shrink away
    cols.forEach((c) => {
      let y = 0;
      [...c.ids].sort((a, z) => val(z) - val(a)).forEach((id) => {
        const s = b.st[idx(id)], h = val(id) * H;
        s.tp.set(O.x + c.x, O.y, O.z); s.ty = y; s.th = h; s.tw = c.w;
        y += h + 0.025;
      });
    });
    const [l, r] = extent(cols);
    b.ps.ty = LAW.bonusThreshold * H; b.ps.tw = r - l + 0.4; b.ps.tx = (l + r) / 2; b.ps.top = 0.75;
  }

  const P = {}, tmp = new V3();
  return {
    pose() {
      // each view has its own framing: fit the width (towers or stacks) and the height
      // (tallest tower ≈ 28%, tallest stack ≈ 49%, plus their labels)
      const n = ctx.isNarrow();
      const vfit = (half) => half / Math.tan((ctx.camera.fov * Math.PI) / 360);
      const stacksView = mode === 'blocs';
      layout(); // the column set depends on the screen width
      let cx = 0, halfW = 6.1;
      if (stacksView) { const [l, r] = extent(stacks()); cx = (l + r) / 2; halfW = (r - l) / 2 + 0.2; }
      const halfH = stacksView ? 3.8 : 2.5;
      const tg = new V3(O.x + cx, stacksView ? 3.0 : 2.05, O.z);
      if (n) {
        // phones: the panel is a bottom sheet (44vh), so the chart is framed in the top half
        const d = Math.max(ctx.fitDist(halfW, 1.02), vfit(halfH) * (stacksView ? 4.0 : 2.0));
        return { pos: new V3(tg.x, tg.y + d * 0.08, tg.z + d), target: tg, shiftY: stacksView ? 0.15 : 0.13 };
      }
      // desktop: title on the left, panel on the right, chart in the middle half of the width
      // (small laptops/tablets: the panel takes more of the width, so the chart gets ~40% and moves left)
      const small = window.innerWidth < 1200;
      const d = Math.max(ctx.fitDist(halfW, 1.04, small ? 0.4 : 0.5), vfit(halfH));
      return { pos: new V3(tg.x, tg.y + 0.9, tg.z + d), target: tg, shift: small ? 0.11 : 0.07 };
    },
    enter() {
      clearTimeout(disposeTimer);
      const fresh = !built; build(); active = true; restOrbs(orbs);
      built.st.forEach((s) => { if (fresh) s.p.copy(s.tp); s.h = 0.0001; s.y = 0; }); // rise from the floor
      layout();
    },
    leave() {
      active = false; hovered = -1;
      if (built) { built.st.forEach((s) => { s.th = 0.0001; }); built.ps.top = 0; }
      clearTimeout(disposeTimer);
      disposeTimer = setTimeout(() => { if (!active) dispose(); }, 2500);
    },
    setMode(m) {
      const changed = m !== mode;
      mode = m; layout();
      if (active && changed && m !== 'hidden') ctx.flyTo(this.pose(), { duration: 1.1 }); // re-frame for the new view
    },
    setHover(i) { hovered = i; },
    update(t, dt, isActive) {
      if (!built) return;
      const b = built;
      const k = damp(dt, 3.2);
      const d = new ctx.THREE.Object3D();
      b.st.forEach((s, i) => {
        s.p.lerp(s.tp, k); s.y += (s.ty - s.y) * k; s.h += (s.th - s.h) * k * 0.9; s.w += (s.tw - s.w) * k;
        d.position.set(s.p.x, s.p.y + s.y, s.p.z);
        const lift = i === hovered && active ? 1.06 : 1;
        d.scale.set(s.w * lift, Math.max(0.0001, s.h), s.w * lift);
        d.updateMatrix();
        b.mesh.setMatrixAt(i, d.matrix);
      });
      b.mesh.instanceMatrix.needsUpdate = true;
      b.mesh.boundingSphere = null;
      // reference plane + its glowing edge
      const ps = b.ps;
      ps.y += (ps.ty - ps.y) * k; ps.w += (ps.tw - ps.w) * k; ps.x += (ps.tx - ps.x) * k; ps.op += ((active ? ps.top : 0) - ps.op) * k;
      b.plane.position.set(O.x + ps.x, O.y + ps.y, O.z - 0.2); b.plane.scale.set(ps.w, 2.4, 1);
      b.planeMat.color.copy(ctx.accent); b.planeMat.opacity = ps.op * 0.12;
      b.edge.position.set(O.x + ps.x, O.y + ps.y, O.z + 1.0); b.edge.scale.set(ps.w, 1, 1);
      b.edgeMat.color.copy(ctx.glow); b.edgeMat.opacity = ps.op;

      // symbols ride on top of their towers in the parties view; in the coalition views the party
      // symbols move into the HTML labels beside each segment, so the sprites fade out
      const lang = ctx.getLang();
      const chip = (v) => `<b>${fmt(v, lang)}</b><small>%</small>`;
      let n = 0;
      b.sprites.forEach((sp, i) => {
        const s = b.st[i];
        const want = active && mode === 'parties' ? 1 : 0;
        sp.o += (want - sp.o) * k; sp.m.opacity = sp.o; sp.sp.visible = sp.o > 0.01;
        sp.sp.position.set(s.p.x, s.p.y + s.y + s.h + 0.42, s.p.z + 0.3); sp.sp.scale.setScalar(0.62);
        if (active && isActive && mode === 'parties' && (!ctx.isNarrow() || ROWS[i].pct >= 5)) { // phones: big parties only; the table has all
          tmp.set(s.p.x, s.p.y + s.y + s.h + 0.86, s.p.z + 0.3); ctx.project(tmp, P);
          const el = b.labels.get(n++, 'lbl-chip'); el.style.setProperty('--ac', INFO[ROWS[i].id].color);
          b.labels.place(el, P, chip(ROWS[i].pct), Math.min(1, sp.o), 'translate(-50%, -100%)', true);
          tmp.set(s.p.x, s.p.y - 0.05, s.p.z + 0.4); ctx.project(tmp, P);
          b.labels.place(b.labels.get(n++, 'lbl-pname'), P, INFO[ROWS[i].id].label, Math.min(1, sp.o), 'translate(-50%, 0)');
        }
      });
      if (active && isActive && mode !== 'hidden') {
        if (mode === 'parties') {
          if (!ctx.isNarrow()) { // phones: the table lists the small parties
            const s = b.st[N - 1];
            tmp.set(s.p.x, s.p.y + s.h + 0.3, s.p.z + 0.3); ctx.project(tmp, P);
            const el = b.labels.get(n++, 'lbl-chip'); el.style.setProperty('--ac', NEUTRAL);
            b.labels.place(el, P, chip(OTHERS), 0.85, 'translate(-50%, -100%)', true);
            tmp.set(s.p.x, s.p.y - 0.05, s.p.z + 0.4); ctx.project(tmp, P);
            b.labels.place(b.labels.get(n++, 'lbl-pname'), P, lang === 'it' ? 'Altri' : 'Others', 0.8, 'translate(-50%, 0)');
          }
        } else {
          const Q = {};
          const val = (id) => (id === '__altri' ? OTHERS : id === '__clx' ? CLX_V : pctOf(id));
          stacks().forEach((c) => {
            const total = c.key === 'cs' ? COALITIONS.cl.pct : c.key === 'cd' ? COALITIONS.cd.pct : c.ids[0] === '__altri' ? OTHERS : sumOf(c.ids);
            const main = c.side !== 0;
            // total on top
            // phones: the two totals open outwards from the gap between the stacks, so they never overlap
            const nar = compact() && main;
            tmp.set(O.x + c.x + (nar ? -c.side * c.w / 2 : 0), O.y + total * H + 0.18, O.z + 0.3); ctx.project(tmp, P);
            const tl = b.labels.get(n++, main ? 'lbl-chip lbl-total' : 'lbl-chip');
            tl.style.setProperty('--ac', main ? 'var(--ink)' : (c.key === 'altri' ? NEUTRAL : INFO[c.key].color));
            const cname = c.key === 'cs' ? loc(COALITIONS.cl.label, lang) : loc(COALITIONS.cd.label, lang);
            const plus = nar ? `<span class="plus">${esc(cname)}</span>` : '';
            b.labels.place(tl, P, `<span class="tv">${chip(total)}</span>${plus}`, 1, nar ? (c.side < 0 ? 'translate(-100%, -100%)' : 'translate(0, -100%)') : 'translate(-50%, -100%)', true);
            // name under the stack
            const name = c.key === 'cs' ? loc(COALITIONS.cl.label, lang) : c.key === 'cd' ? loc(COALITIONS.cd.label, lang) : c.key === 'altri' ? (lang === 'it' ? 'Altri' : 'Others') : INFO[c.key].label;
            tmp.set(O.x + c.x, O.y - 0.05, O.z + 0.4); ctx.project(tmp, P);
            if (!nar) b.labels.place(b.labels.get(n++, main ? 'lbl-pname lbl-cname' : 'lbl-pname'), P, name, 1, 'translate(-50%, 0)');
            if (!main) return;
            // one label per party segment, on the outer side, when the segment is tall enough to point at
            let y = 0;
            [...c.ids].sort((a, z) => val(z) - val(a)).forEach((id) => {
              const h = val(id) * H;
              const sx = O.x + c.x + c.side * (c.w / 2 + 0.08);
              tmp.set(sx, O.y + y, O.z + 0.3); ctx.project(tmp, Q);
              tmp.set(sx, O.y + y + h, O.z + 0.3); ctx.project(tmp, P);
              const px = Math.abs(Q.y - P.y);
              y += h + 0.025;
              if (px < (ctx.isNarrow() ? 13 : 15)) return; // too thin: the table lists it
              P.y = (P.y + Q.y) / 2;
              const i = id === '__clx' ? { label: lang === 'it' ? 'Altre liste' : 'Other lists', color: '#B8C2C6', logo: null, mono: '+' } : INFO[id];
              const el = b.labels.get(n++, `lbl-seg${id === '__clx' ? ' hyp' : ''}`);
              el.style.setProperty('--ac', i.color);
              const sym = i.logo ? `<img src="${i.logo}" alt="">` : `<i>${esc(i.mono || i.label)}</i>`;
              const txt = `${sym}<span>${esc(i.label)}</span><b>${fmt(val(id), lang)}</b>`;
              b.labels.place(el, P, c.side < 0 ? txt.replace(/^(<img[^>]*>|<i>.*?<\/i>)(.*)$/, '$2$1') : txt, 1,
                c.side < 0 ? 'translate(-100%, -50%)' : 'translate(0, -50%)', true);
              el.dataset.side = c.side < 0 ? 'l' : 'r';
            });
          });
        }
        tmp.set(O.x + ps.x - ps.w / 2 + (ctx.isNarrow() && mode !== 'parties' ? 0.25 : -0.1), O.y + ps.y, O.z + 1.0); ctx.project(tmp, P);
        const phoneStacks = ctx.isNarrow() && mode !== 'parties'; // phones: a short tag just under the line
        b.labels.place(b.labels.get(n++, 'lbl-line'), P, mode === 'parties'
          ? (lang === 'it' ? `Soglia ${LAW.listThreshold}%` : `${LAW.listThreshold}% threshold`)
          : phoneStacks ? `${LAW.bonusThreshold}%` : (lang === 'it' ? `${LAW.bonusThreshold}% · premio di maggioranza` : `${LAW.bonusThreshold}% · majority bonus`), Math.min(1, ps.op * 1.3),
          phoneStacks ? 'translate(2px, calc(-100% - 3px))' : 'translate(calc(-100% - 6px), -50%)');
      }
      b.labels.hideFrom(n);
    },
    pickables() { return active && built ? [built.mesh] : []; },
    resolve(hit) {
      const i = hit.instanceId;
      if (i == null || i >= ROWS.length) return null;
      return { type: 'tower', index: i, id: ROWS[i].id, point: hit.point };
    },
  };
}
