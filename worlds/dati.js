// worlds/dati.js — DATI: "data becomes architecture".
// 100 extruded columns (one per seat) rise from the floor and morph between three views:
//   seats  — who sits in the chamber (your example parliament: 5 groups, 100 seats)
//   vote   — how a vote ends: each column's height is that seat's vote
//   fixed  — the fixed numbers: 400 deputies and 200 elected senators, one column = 10 seats
// The seats/vote numbers are your prototype's invented example and always carry its warning.
import { CONTENT, GROUPS, VOTES, GROUP_COLORS } from '../data/content.js';
import { esc, loc, damp, restOrbs, labelLayer } from './util.js';

const C = CONTENT.dati;
export const DATI_ORIGIN = [-17, 0, -4];
const VIEWS = ['seats', 'vote', 'fixed'];
// [sì, no, astenuti, in missione] → column height
const VOTE_H = [1.5, 0.42, 0.8, 0.12];

/** Seat geometry shared by the DOM fallback text and the 3D view. */
function buildSeats() {
  const rows = 5, radii = Array.from({ length: rows }, (_, k) => 1.9 + k * 0.56);
  const sum = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.round((100 * r) / sum));
  counts[rows - 1] += 100 - counts.reduce((a, b) => a + b, 0);
  const seats = [];
  radii.forEach((r, k) => {
    for (let i = 0; i < counts[k]; i++) {
      const a = Math.PI + 0.14 + (counts[k] === 1 ? 0.5 : i / (counts[k] - 1)) * (Math.PI - 0.28);
      seats.push({ a, x: Math.cos(a) * r, z: Math.sin(a) * r * 0.9, row: k });
    }
  });
  seats.sort((p, q) => p.a - q.a || p.row - q.row); // left to right, like a chamber's sectors
  // groups by sector, then each group's votes in the same order
  let i = 0;
  GROUPS.forEach(([g, , n]) => {
    const v = VOTES[g];
    let k = 0;
    for (let j = 0; j < n; j++, i++) {
      let vote = 0, acc = v[0];
      while (k + j >= acc && vote < 3) { vote++; acc += v[vote]; }
      seats[i].group = g; seats[i].vote = vote;
    }
  });
  return seats;
}

export function datiUI({ root, t, getLang, view, announce }) {
  const body = root.querySelector('#dati-body');
  const seg = root.querySelector('#dati-seg');
  let mode = 'seats';
  let group = null;
  const L = (o) => loc(o, getLang());
  const tot = [0, 0, 0, 0];
  GROUPS.forEach(([g]) => VOTES[g].forEach((n, i) => { tot[i] += n; }));

  function warn() { return `<div class="warn" data-anim><strong>${esc(L(C.warn.title))}</strong> ${esc(L(C.warn.body))}</div>`; }

  function seatsHTML() {
    const g0 = group && GROUPS.find((g) => g[0] === group);
    return `${warn()}
      <p class="hint" data-anim>${g0 ? `<strong>${esc(L(g0[1]))}</strong> · ${g0[2]} / 100` : esc(L(C.hint))}</p>
      <div class="legend" data-anim role="group" aria-label="${esc(L(C.step1))}">
        ${GROUPS.map(([g, name, n]) => `<button type="button" class="lg" data-grp="${g}" aria-pressed="${group === g}"><i class="sw g${g}" aria-hidden="true"></i><span>${esc(L(name))}</span><b>${n}</b></button>`).join('')}
      </div>`;
  }

  function voteHTML() {
    const pass = tot[0] > tot[1];
    const yes = L(C.vshort[0]).toLowerCase(), no = L(C.vshort[1]).toLowerCase();
    const rows = GROUPS.map(([g, name, n]) => {
      const v = VOTES[g];
      return `<div class="vrow" data-anim><span class="nm"><i class="sw g${g}" aria-hidden="true"></i>${esc(L(name))}</span>
        <span class="vbar" aria-hidden="true">${v.map((x, i) => `<span class="s${i}" style="width:${(100 * x) / n}%"></span>`).join('')}</span>
        <span class="vnum">${v.map((x, i) => `${x} ${esc(L(C.vshort[i]).toLowerCase())}`).join(' · ')}</span></div>`;
    }).join('');
    return `${warn()}
      <div class="verd ${pass ? 'yes' : 'nope'}" data-anim><b>${esc(L(pass ? C.approved : C.rejected))}</b>
        <span>${tot[0]} ${esc(yes)}, ${tot[1]} ${esc(no)}. ${esc(L(C.passRule))}</span></div>
      ${rows}
      <div class="vleg" data-anim>${C.vshort.map((v, i) => `<span><i class="s${i}" aria-hidden="true"></i>${esc(L(v))}</span>`).join('')}</div>
      <p class="fine" data-anim><strong>${esc(L(C.absNote.title))}</strong> ${esc(L(C.absNote.body))} <strong>${esc(L(C.missNote.title))}</strong> ${esc(L(C.missNote.body))}</p>
      <p class="fine" data-anim>${esc(t('dati.height'))}</p>`;
  }

  function fixedHTML() {
    return `<div class="box" data-anim><strong>${esc(L(C.deputies.title))}</strong> ${esc(L(C.deputies.body))}</div>
      <div class="box" data-anim><strong>${esc(L(C.senators.title))}</strong> ${esc(L(C.senators.body))}</div>
      <p class="fine" data-anim>${esc(t('dati.perColumn'))}</p>`;
  }

  // the law path and the data limits: your text, rendered once per language
  function renderStatic() {
    const path = root.querySelector('#dati-path');
    const lim = root.querySelector('#dati-limits');
    if (path) path.innerHTML = C.path.map((p) => `<li><b>${esc(L(p.title))}</b> ${esc(L(p.body))}</li>`).join('');
    if (lim) lim.innerHTML = C.limits.map((x) => `<div class="box"><strong>${esc(L(x.title))}</strong> ${x.parts.map((q) => (q.link
      ? `<a href="${esc(q.link[1])}" target="_blank" rel="noopener noreferrer">${esc(q.link[0])}</a>`
      : esc(L(q)))).join(' ')}</div>`).join('');
  }

  function render() {
    seg.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === mode)));
    body.innerHTML = mode === 'seats' ? seatsHTML() : mode === 'vote' ? voteHTML() : fixedHTML();
    const v = view(); if (v) { v.setMode(mode); v.setGroup(mode === 'seats' ? group : null); }
  }

  function setMode(m, say = true) {
    if (!VIEWS.includes(m)) return;
    mode = m; if (m !== 'seats') group = null;
    render();
    document.dispatchEvent(new CustomEvent('dc:panel', { detail: body }));
    if (say) announce(seg.querySelector(`[data-view="${m}"]`)?.textContent || m);
  }

  seg.addEventListener('click', (e) => { const b = e.target.closest('[data-view]'); if (b) setMode(b.dataset.view); });
  body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-grp]');
    if (!b) return;
    group = group === b.dataset.grp ? null : b.dataset.grp;
    render();
    body.querySelector(`[data-grp="${b.dataset.grp}"]`)?.focus();
  });

  return {
    enter() { renderStatic(); render(); },
    leave() {},
    sync() { render(); },
    rerender() { renderStatic(); render(); },
    setMode,
    next() { setMode(VIEWS[(VIEWS.indexOf(mode) + 1) % VIEWS.length]); },
    onHit(hit) { if (hit.type === 'column') this.next(); },
    onEscape() { if (group) { group = null; render(); return true; } return false; },
    tip(hit) {
      if (hit.type !== 'column') return '';
      const s = hit.seat;
      const lang = getLang();
      if (mode === 'fixed') return s.house === 'camera' ? `${L(C.deputies.title)} · ${t('dati.tenSeats')}` : `${L(C.senators.title)} · ${t('dati.tenSeats')}`;
      const g = GROUPS.find((x) => x[0] === s.group);
      if (mode === 'vote') return `${loc(g[1], lang)} · ${L(C.vnames[s.vote])}`;
      return `${loc(g[1], lang)} · ${g[2]} / 100`;
    },
    get mode() { return mode; },
  };
}

export function datiView(ctx) {
  const { THREE, orbs } = ctx;
  const V3 = THREE.Vector3;
  const O = new V3(...DATI_ORIGIN);
  const seats = buildSeats();
  const N = 100;
  let built = null, disposeTimer = 0, active = false;
  let mode = 'seats', group = null, hovered = -1;

  // your prototype's colours: example groups (--gA…--gE), votes (--ok / --no / --muted / --faint),
  // Camera in petrol teal, Senato in your warm --mid
  const VOTE_COL = { light: ['#2E9E6B', '#C8433D', '#4C5A63', '#7F8C93'], dark: ['#4CC38F', '#FF8A80', '#A8B7BD', '#72858D'] };
  const HOUSE_COL = { light: { camera: '#0E4A5A', senato: '#E9A93A' }, dark: { camera: '#4BA3B8', senato: '#E9A93A' } };

  function build() {
    if (built) return built;
    const geo = new THREE.BoxGeometry(0.2, 1, 0.2);
    geo.translate(0, 0.5, 0); // grow from the floor
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0, envMapIntensity: 0.35 });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    const st = Array.from({ length: N }, () => ({ p: new V3().copy(O), tp: new V3().copy(O), h: 0.0001, th: 0.0001, c: new THREE.Color(), tc: new THREE.Color() }));
    for (let i = 0; i < N; i++) mesh.setColorAt(i, new THREE.Color(1, 1, 1));
    ctx.scene.add(mesh);
    const labels = labelLayer(ctx.labelsRoot, 'dati');
    built = { mesh, geo, mat, st, labels };
    layout();
    return built;
  }

  function dispose() {
    if (!built) return;
    ctx.scene.remove(built.mesh);
    built.geo.dispose(); built.mat.dispose(); built.mesh.dispose();
    built.labels.remove();
    built = null;
  }

  const tone = (g) => GROUP_COLORS[g] || '#7F8C93';
  const themeKey = () => (ctx.dark() > 0.5 ? 'dark' : 'light');

  // where the fixed-numbers columns stand: Camera 8×5 = 40, Senato 4×5 = 20 (one column = 10 seats)
  function fixedSlot(i) {
    if (i < 40) { const c = i % 8, r = Math.floor(i / 8); return { x: -3.4 + c * 0.42, z: -0.9 - r * 0.42, house: 'camera' }; }
    if (i < 60) { const j = i - 40, c = j % 4, r = Math.floor(j / 4); return { x: 1.4 + c * 0.42, z: -0.9 - r * 0.42, house: 'senato' }; }
    return null;
  }

  function layout() {
    if (!built) return;
    built.st.forEach((s, i) => {
      const seat = seats[i];
      let x = seat.x, z = seat.z, h = 0.5 + seat.row * 0.07, col = tone(seat.group), fade = 1;
      if (mode === 'vote') {
        h = VOTE_H[seat.vote];
        col = VOTE_COL[themeKey()][seat.vote]; // coloured by vote, like your bars
        if (seat.vote === 3) fade = 0.45;
      } else if (mode === 'fixed') {
        const f = fixedSlot(i);
        if (f) { x = f.x; z = f.z; h = 1.1; col = HOUSE_COL[themeKey()][f.house]; seat.house = f.house; }
        else { h = 0.0001; seat.house = null; }
      }
      if (mode === 'seats' && group && seat.group !== group) { fade = 0.28; h *= 0.6; }
      s.tp.set(O.x + x, O.y, O.z + z);
      s.th = h;
      s.tc.set(col);
      if (fade < 1) s.tc.lerp(ctx.bgColor, 1 - fade);
    });
  }

  const P = {};
  const tmp = new V3();

  return {
    pose() {
      const n = ctx.isNarrow();
      if (n) { // the rail is a bottom sheet: lift the skyline into the free upper part
        const d = ctx.fitDist(4.5, 1.05);
        const tg = new V3(O.x, 0.4, O.z - 1.8);
        return { pos: new V3(tg.x, tg.y + d * 0.62, tg.z + d * 0.78), target: tg, shiftY: 0.22 };
      }
      // fit the hemicycle into the ~62% of the screen the rail leaves free, seen from ~38° above
      const d = Math.max(9, ctx.fitDist(4.5, 1.05, 0.62));
      const tg = new V3(O.x, 0.4, O.z - 1.8);
      return { pos: new V3(tg.x, tg.y + d * 0.62, tg.z + d * 0.78), target: tg, shift: -0.18 };
    },
    enter() {
      clearTimeout(disposeTimer);
      const fresh = !built;
      build();
      active = true;
      restOrbs(orbs);
      if (fresh) built.st.forEach((s) => { s.p.copy(s.tp); s.h = 0.0001; }); // rise from the floor on entry
      else built.st.forEach((s) => { s.h = 0.0001; });
      layout();
    },
    leave() {
      active = false; hovered = -1;
      if (built) built.st.forEach((s) => { s.th = 0.0001; });
      clearTimeout(disposeTimer);
      disposeTimer = setTimeout(() => { if (!active) dispose(); }, 2500);
    },
    setMode(m) { mode = m; layout(); },
    setGroup(g) { group = g; layout(); },
    setHover(i) { hovered = i; },
    onThemeChange() { layout(); },
    update(t, dt, isActive) {
      if (!built) return;
      const b = built;
      // the skyline rises with a stagger from the centre aisle outwards
      const k = damp(dt, 3.4);
      const d = new ctx.THREE.Object3D();
      b.st.forEach((s, i) => {
        s.p.lerp(s.tp, k);
        const lag = active ? Math.min(1, k * (1.6 - Math.abs(seats[i].a - 1.5 * Math.PI) * 0.4)) : k * 1.4;
        s.h += (s.th - s.h) * Math.max(0.02, lag);
        s.c.lerp(s.tc, k);
        d.position.copy(s.p);
        const lift = i === hovered && active ? 1.08 : 1;
        d.scale.set(lift, Math.max(0.0001, s.h), lift);
        d.updateMatrix();
        b.mesh.setMatrixAt(i, d.matrix);
        b.mesh.setColorAt(i, s.c);
      });
      b.mesh.instanceMatrix.needsUpdate = true;
      b.mesh.instanceColor.needsUpdate = true;
      b.mesh.boundingSphere = null;

      // 3D annotations (aria-hidden): only for the fixed numbers
      const lang = ctx.getLang();
      if (active && isActive && mode === 'fixed') {
        tmp.set(O.x - 1.93, 1.5, O.z - 0.9); ctx.project(tmp, P);
        b.labels.place(b.labels.get(0, 'lbl-big'), P, loc(C.deputies.title, lang));
        tmp.set(O.x + 2.03, 1.5, O.z - 0.9); ctx.project(tmp, P);
        b.labels.place(b.labels.get(1, 'lbl-big'), P, loc(C.senators.title, lang));
      } else if (active && isActive && mode === 'seats') {
        tmp.set(O.x, 0.05, O.z + 0.6); ctx.project(tmp, P);
        b.labels.place(b.labels.get(0, 'lbl-big'), P, loc(C.seats100, lang), 0.8);
        b.labels.hideFrom(1);
      } else b.labels.hideFrom(0);
    },
    pickables() { return active && built ? [built.mesh] : []; },
    resolve(hit) {
      if (hit.instanceId == null) return null;
      const s = seats[hit.instanceId];
      if (mode === 'fixed' && !s.house) return null;
      return { type: 'column', index: hit.instanceId, seat: s, point: hit.point };
    },
  };
}
