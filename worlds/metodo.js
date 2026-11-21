// worlds/metodo.js — METODO: a transparent machine that turns raw sources into comparable
// information. 50 tiles = 10 parties × 5 themes from the real data. Each click advances one step;
// the tiles re-arrange and the stepper's panel rewrites itself with your Metodo text.
import { PARTITI, THEMES } from '../data/partiti.js';
import { CONTENT, COLORS_BOX } from '../data/content.js';
import { esc, loc, damp, restOrbs, seeded, labelLayer } from './util.js';

const C = CONTENT.metodo;
export const METODO_ORIGIN = [0, 0, -34]; // beyond the colonnade, so no column stands in front of the camera
const ALPHA = [...PARTITI].sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
const TILES = ALPHA.flatMap((p) => THEMES.map((th) => ({ party: p, theme: th, has: !!p.themes[th.id] })));
export const MISSING = TILES.filter((x) => !x.has).length;

const STEPS = [
  { id: 'raw',     title: C.synth.title },
  { id: 'format',  title: C.same.title },
  { id: 'missing', title: C.missing.title },
  { id: 'prov',    title: C.provTitle },
  { id: 'verify',  title: C.verifyTitle },
  { id: 'next',    title: C.evolving.title },
];

export function metodoUI({ root, t, getLang, view, announce }) {
  const list = root.querySelector('#steps');
  const panel = root.querySelector('#step-panel');
  const prev = root.querySelector('#step-prev');
  const next = root.querySelector('#step-next');
  let step = 0;
  const L = (o) => loc(o, getLang());
  const box = (b) => `<div class="box" data-anim><strong>${esc(L(b.title))}</strong> ${esc(L(b.body))}</div>`;

  function body() {
    switch (STEPS[step].id) {
      case 'raw': return box(C.synth);
      case 'format': return box(C.same) + box(C.six) + box(COLORS_BOX);
      case 'missing': return box(C.missing) + `<p class="stat" data-anim><b>${MISSING}</b> ${esc(t('metodo.missing.stat', { n: TILES.length }))}</p>`;
      case 'prov': return `<p data-anim>${esc(L(C.provBody))}</p><div class="prov" data-anim>${C.provTags.map((x) => `<span class="tag">${esc(L(x))}</span>`).join('')}</div>`;
      case 'verify': return C.levels.map(box).join('');
      default: return box(C.evolving) + box(C.partiesSpeak) + box(C.which)
        + `<h4 data-anim>${esc(L(C.fundTitle))}</h4><p class="fine" data-anim>${esc(L(C.fundNote))}</p><ul class="plain" data-anim>${C.fund.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul>`
        + `<h4 data-anim>${esc(L(C.roadTitle))}</h4><ol class="plain" data-anim>${C.road.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ol>`;
    }
  }

  function render() {
    list.innerHTML = STEPS.map((s, i) => `<li><button type="button" data-step="${i}" aria-label="${i + 1}. ${esc(L(s.title))}" ${i === step ? 'aria-current="step"' : ''}><span class="n" aria-hidden="true">${i + 1}</span><span>${esc(L(s.title))}</span></button></li>`).join('');
    panel.innerHTML = `<h3 data-anim>${esc(L(STEPS[step].title))}</h3>${body()}`;
    panel.scrollTop = 0;
    prev.disabled = step === 0;
    next.disabled = step === STEPS.length - 1;
    const v = view(); if (v) v.setStep(step);
  }

  function go(i, say = true) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    render();
    document.dispatchEvent(new CustomEvent('dc:panel', { detail: panel }));
    if (say) announce(`${t('metodo.step', { n: step + 1, of: STEPS.length })}: ${L(STEPS[step].title)}`);
  }

  list.addEventListener('click', (e) => { const b = e.target.closest('[data-step]'); if (b) go(Number(b.dataset.step)); });
  list.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    go(step + (e.key === 'ArrowDown' ? 1 : -1));
    list.querySelector(`[data-step="${step}"]`)?.focus();
  });
  prev.addEventListener('click', () => go(step - 1));
  next.addEventListener('click', () => go(step + 1));

  return {
    enter() { step = 0; render(); },
    leave() {},
    sync() { render(); },
    rerender() { render(); },
    onEmpty() { if (step < STEPS.length - 1) go(step + 1); },
    onHit() { if (step < STEPS.length - 1) go(step + 1); },
    tip(hit) { if (hit.type !== 'tile') return ''; const x = TILES[hit.index]; return `${x.party.name} · ${loc(x.theme.label, getLang())}${x.has ? '' : ` · ${t('partiti.theme.none')}`}`; },
  };
}

export function metodoView(ctx) {
  const { THREE, orbs } = ctx;
  const V3 = THREE.Vector3;
  const O = new V3(...METODO_ORIGIN);
  const N = TILES.length;
  let built = null, disposeTimer = 0, active = false, step = 0, hovered = -1;
  const rnd = seeded(2027);
  const scatter = TILES.map(() => ({
    p: new V3((rnd() - 0.5) * 9, 0.4 + rnd() * 3.4, (rnd() - 0.5) * 5),
    q: new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3)),
  }));

  function build() {
    if (built) return built;
    const geo = new THREE.BoxGeometry(0.34, 0.46, 0.035);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, envMapIntensity: 0.4 });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    const st = TILES.map((_, i) => ({ p: scatter[i].p.clone().add(O), tp: new V3(), q: scatter[i].q.clone(), tq: new THREE.Quaternion(), s: 0, ts: 1, c: new THREE.Color(1, 1, 1), tc: new THREE.Color() }));
    for (let i = 0; i < N; i++) mesh.setColorAt(i, new THREE.Color(1, 1, 1));
    const ringMat = new THREE.MeshBasicMaterial({ color: ctx.accent.clone(), transparent: true, opacity: 0, depthWrite: false });
    const ringGeo = new THREE.TorusGeometry(1, 0.012, 8, 160);
    const rings = [0, 1, 2].map(() => { const m = new THREE.Mesh(ringGeo, ringMat); m.rotation.x = Math.PI / 2; m.position.copy(O); return m; });
    const rs = rings.map(() => ({ r: 1, tr: 1, y: 0, ty: 0 }));
    ctx.scene.add(mesh, ...rings);
    const labels = labelLayer(ctx.labelsRoot, 'metodo');
    built = { geo, mat, mesh, st, ringMat, ringGeo, rings, rs, ringOp: 0, labels };
    return built;
  }

  function dispose() {
    if (!built) return;
    ctx.scene.remove(built.mesh, ...built.rings);
    built.geo.dispose(); built.mat.dispose(); built.mesh.dispose(); built.ringGeo.dispose(); built.ringMat.dispose();
    built.labels.remove();
    built = null;
  }

  const e = new THREE.Euler();
  const face = new THREE.Quaternion(); // tiles face the front (+z)
  function layout() {
    if (!built) return;
    const id = STEPS[step].id;
    const paper = ctx.dark() > 0.5 ? '#C6D1D4' : '#FBFAF6';
    built.st.forEach((s, i) => {
      const x = TILES[i];
      const pi = Math.floor(i / THEMES.length), ti = i % THEMES.length;
      s.ts = 1; s.tc.set(paper);
      if (id === 'raw') {
        s.tp.copy(scatter[i].p).add(O); s.tq.copy(scatter[i].q);
      } else if (id === 'format' || id === 'next') {
        // ten identical stacks along a gentle arc: same format for everyone
        const a = (pi / (ALPHA.length - 1) - 0.5) * 1.6;
        s.tp.set(O.x + Math.sin(a) * 5.2, O.y + 0.35 + ti * 0.52, O.z - Math.cos(a) * 1.4 + 1.4);
        s.tq.setFromEuler(e.set(0, -a * 0.6, 0));
      } else if (id === 'missing') {
        // the comparison grid: party columns × theme rows. Missing positions stay hollow.
        s.tp.set(O.x + (pi - (ALPHA.length - 1) / 2) * 0.52, O.y + 0.45 + (THEMES.length - 1 - ti) * 0.62, O.z);
        s.tq.copy(face);
        if (!x.has) { s.ts = 0.55; s.tc.copy(ctx.bgColor).lerp(new THREE.Color(paper), 0.35); }
      } else if (id === 'prov') {
        // a compact block at the centre, waiting to be labelled
        const c = i % 5, r = Math.floor(i / 5) % 5, d = Math.floor(i / 25);
        s.tp.set(O.x + (c - 2) * 0.38, O.y + 0.6 + r * 0.5, O.z + (d - 0.5) * 0.12);
        s.tq.copy(face);
      } else if (id === 'verify') {
        // a column rising through three levels
        const a = i * 0.62;
        s.tp.set(O.x + Math.cos(a) * 0.55, O.y + 0.25 + i * 0.07, O.z + Math.sin(a) * 0.55);
        s.tq.setFromEuler(e.set(0, -a + Math.PI / 2, 0));
      }
    });
    const ring = (k, r, y) => { built.rs[k].tr = r; built.rs[k].ty = y; };
    if (id === 'prov') { ring(0, 1.55, 1.6); ring(1, 2.1, 1.6); ring(2, 2.65, 1.6); built.ringOp = 0.75; }
    else if (id === 'verify') { ring(0, 1.5, 0.9); ring(1, 1.5, 2.1); ring(2, 1.5, 3.3); built.ringOp = 0.8; }
    else { ring(0, 0.3, 0.1); ring(1, 0.3, 0.1); ring(2, 0.3, 0.1); built.ringOp = 0; }
  }

  const P = {}, tmp = new V3();
  return {
    pose() {
      const n = ctx.isNarrow();
      if (n) {
        const d = Math.min(19, ctx.fitDist(4.0, 1.0));
        return { pos: new V3(O.x, 2.2 + d * 0.2, O.z + d), target: new V3(O.x, 1.7, O.z), shiftY: 0.2 };
      }
      const d = Math.max(8.6, ctx.fitDist(4.0, 1.05, 0.6)); // grid + row labels, beside the stepper
      return { pos: new V3(O.x, 3.4, O.z + d), target: new V3(O.x, 1.75, O.z), shift: 0.19 };
    },
    enter() { clearTimeout(disposeTimer); build(); active = true; restOrbs(orbs); layout(); },
    leave() {
      active = false; hovered = -1;
      if (built) { built.st.forEach((s) => { s.ts = 0; }); built.ringOp = 0; }
      clearTimeout(disposeTimer);
      disposeTimer = setTimeout(() => { if (!active) dispose(); }, 2500);
    },
    setStep(i) { step = i; layout(); },
    setHover(i) { hovered = i; },
    onThemeChange() { layout(); },
    update(t, dt, isActive) {
      if (!built) return;
      const b = built;
      const k = damp(dt, 3.2);
      const d = new ctx.THREE.Object3D();
      b.st.forEach((s, i) => {
        s.p.lerp(s.tp, k);
        s.q.slerp(s.tq, k);
        s.s += (s.ts - s.s) * k;
        s.c.lerp(s.tc, k);
        d.position.copy(s.p);
        if (STEPS[step].id === 'raw') d.position.y += Math.sin(t * 0.6 + i) * 0.06; // raw material drifts
        d.quaternion.copy(s.q);
        d.scale.setScalar(Math.max(0.0001, s.s * (i === hovered && active ? 1.12 : 1)));
        d.updateMatrix();
        b.mesh.setMatrixAt(i, d.matrix);
        b.mesh.setColorAt(i, s.c);
      });
      b.mesh.instanceMatrix.needsUpdate = true;
      b.mesh.instanceColor.needsUpdate = true;
      b.mesh.boundingSphere = null;
      b.ringMat.color.copy(ctx.accent);
      b.ringMat.opacity += (b.ringOp - b.ringMat.opacity) * k;
      b.rings.forEach((m, j) => {
        const r = b.rs[j];
        r.r += (r.tr - r.r) * k; r.y += (r.ty - r.y) * k;
        m.scale.setScalar(r.r); m.position.set(O.x, O.y + r.y, O.z);
        m.rotation.z = t * 0.1 * (j % 2 ? -1 : 1);
      });

      // annotations (aria-hidden)
      const lang = ctx.getLang();
      const id = STEPS[step].id;
      let n = 0;
      if (active && isActive && id === 'missing') {
        ALPHA.forEach((p, pi) => {
          tmp.set(O.x + (pi - (ALPHA.length - 1) / 2) * 0.52, O.y + 0.45 + THEMES.length * 0.62 - 0.1, O.z);
          ctx.project(tmp, P); b.labels.place(b.labels.get(n++, 'lbl-col'), P, p.short);
        });
        THEMES.forEach((th, ti) => {
          tmp.set(O.x - (ALPHA.length / 2) * 0.52 - 0.15, O.y + 0.45 + (THEMES.length - 1 - ti) * 0.62, O.z);
          ctx.project(tmp, P); b.labels.place(b.labels.get(n++, 'lbl-row'), P, loc(th.label, lang), 1, 'translate(-100%, -50%)');
        });
      } else if (active && isActive && id === 'prov') {
        C.provTags.forEach((tag, j) => {
          const th = 0.35 + j * 0.42; // spread the three tags round the front of their rings
          tmp.set(O.x + b.rs[j].r * Math.sin(th), O.y + 1.6, O.z + b.rs[j].r * Math.cos(th));
          ctx.project(tmp, P); b.labels.place(b.labels.get(n++, 'lbl-tag'), P, loc(tag, lang), Math.min(1, b.ringMat.opacity * 1.4));
        });
      } else if (active && isActive && id === 'verify') {
        C.levels.forEach((lv, j) => {
          tmp.set(O.x + 1.65, O.y + b.rs[j].y, O.z);
          ctx.project(tmp, P); b.labels.place(b.labels.get(n++, 'lbl-tag'), P, loc(lv.title, lang).replace(/\.$/, ''), Math.min(1, b.ringMat.opacity * 1.4), 'translate(8px, -50%)');
        });
      }
      b.labels.hideFrom(n);
    },
    pickables() { return active && built ? [built.mesh] : []; },
    resolve(hit) { return hit.instanceId != null ? { type: 'tile', index: hit.instanceId, point: hit.point } : null; },
  };
}
