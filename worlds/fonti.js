// worlds/fonti.js — FONTI: a ring of floating document planes, one per source in the party data.
// Click one: it flies to the camera, flips, and the centred card shows party, publisher, title,
// the year of that party's sources, the link and a reliability note. Others fade to 20%.
// Your data has no per-source reliability note or date, so those stay labelled placeholders.
import { PARTITI } from '../data/partiti.js';
import { CONTENT } from '../data/content.js';
import { esc, loc, damp, restOrbs, withInstanceFade } from './util.js';

const C = CONTENT.fonti;
export const FONTI_ORIGIN = [17, 1.7, -4];

function host(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }

/** Flat list, grouped by party in alphabetical order (as in your Metodo). */
export const SOURCES = [...PARTITI]
  .sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }))
  .flatMap((p) => p.sources.map((s) => {
    const i = s.label.indexOf(': ');
    return {
      party: p, url: s.url, label: s.label,
      publisher: i > 0 ? s.label.slice(0, i) : host(s.url),
      title: i > 0 ? s.label.slice(i + 2) : s.label,
    };
  }));

import { REGISTRO } from '../data/registro.js';

export function fontiUI({ root, t, getLang, view, announce }) {
  const index = root.querySelector('#src-index');
  const card = root.querySelector('#src-card');
  let open = -1;
  const L = (o) => loc(o, getLang());

  function renderIndex() {
    const groups = [];
    SOURCES.forEach((s, i) => {
      let g = groups[groups.length - 1];
      if (!g || g.party !== s.party) { g = { party: s.party, items: [] }; groups.push(g); }
      g.items.push(i);
    });
    const kind = (k) => t(`reg.${k}`);
    const fmtD = (d) => new Date(`${d}T12:00:00`).toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
    const wasOpen = index.querySelector('#registro')?.open ?? false;
    index.innerHTML = `<details id="registro" class="registro"${wasOpen ? ' open' : ''}>
        <summary>${esc(t('reg.title'))} <span class="tag">${REGISTRO.length}</span></summary>
        <p class="fine">${esc(t('reg.lead'))}</p>
        <ol class="reg-list">${REGISTRO.map((r) => `<li class="reg ${r.kind}"><span class="reg-k">${esc(kind(r.kind))}</span><time datetime="${r.date}">${esc(fmtD(r.date))}</time>
          <p>${esc(L(r.text))}${r.link ? ` <a href="${esc(r.link)}" target="_blank" rel="noopener noreferrer">${esc(t('reg.more'))}</a>` : ''}</p></li>`).join('')}</ol>
      </details>` + groups.map((g) => `
      <div class="src-group">
        <h2 style="--ac:${g.party.color}">${g.party.logo ? `<img class="plogo xs" src="${g.party.logo}" alt="" width="64" height="64">` : ''}${esc(g.party.name)} <span class="tag">${esc(t('partiti.sources.year', { y: L(g.party.updated) }))}</span></h2>
        <ul>${g.items.map((i) => `<li><button type="button" class="src-btn" data-src="${i}" aria-pressed="${open === i}"><span class="pub">${esc(SOURCES[i].publisher)}</span> ${esc(SOURCES[i].title)}</button></li>`).join('')}</ul>
      </div>`).join('');
  }

  function renderCard() {
    if (open < 0) { card.hidden = true; card.innerHTML = ''; root.dataset.mode = 'none'; return; }
    const s = SOURCES[open];
    root.dataset.mode = 'open';
    card.hidden = false;
    card.innerHTML = `
      <p class="eyebrow party-eyebrow" style="--ac:${s.party.color}" data-anim>${s.party.logo ? `<img class="plogo sm" src="${s.party.logo}" alt="" width="64" height="64">` : ''}${esc(s.party.name)} · ${open + 1} / ${SOURCES.length}</p>
      <h2 id="src-card-title" tabindex="-1" data-anim>${esc(s.title)}</h2>
      <dl class="meta" data-anim>
        <div><dt>${esc(t('fonti.publisher'))}</dt><dd>${esc(s.publisher)}</dd></div>
        <div><dt>${esc(t('fonti.year'))}</dt><dd>${esc(L(s.party.updated))}</dd></div>
        <div><dt>${esc(t('fonti.reliability'))}</dt><dd class="ph">${esc(t('fonti.reliability.ph'))}</dd></div>
      </dl>
      <p data-anim><a class="open-src" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(t('fonti.open'))} <span aria-hidden="true">↗</span></a> <span class="host">${esc(host(s.url))}</span></p>
      <div class="card-nav" data-anim>
        <button type="button" class="ghost" data-step="-1">${esc(t('fonti.prev'))}</button>
        <button type="button" class="ghost" data-step="1">${esc(t('fonti.next'))}</button>
        <button type="button" class="ghost" data-close aria-label="${esc(t('partiti.clear.aria'))}">${esc(t('partiti.clear'))}</button>
      </div>`;
  }

  function show(i, { focus = true } = {}) {
    open = i;
    renderIndex(); renderCard();
    const v = view(); if (v) v.focus(i);
    if (i >= 0) {
      announce(`${SOURCES[i].party.name}: ${SOURCES[i].title}`);
      if (focus) setTimeout(() => card.querySelector('#src-card-title')?.focus({ preventScroll: true }), 50);
    }
    document.dispatchEvent(new CustomEvent('dc:panel', { detail: card }));
  }

  function close() {
    if (open < 0) return false;
    const was = open;
    show(-1);
    index.querySelector(`[data-src="${was}"]`)?.focus({ preventScroll: true });
    return true;
  }

  index.addEventListener('click', (e) => { const b = e.target.closest('[data-src]'); if (b) show(Number(b.dataset.src)); });
  card.addEventListener('click', (e) => {
    const st = e.target.closest('[data-step]');
    if (st) show((open + Number(st.dataset.step) + SOURCES.length) % SOURCES.length);
    if (e.target.closest('[data-close]')) close();
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show((open + 1) % SOURCES.length);
    if (e.key === 'ArrowLeft') show((open - 1 + SOURCES.length) % SOURCES.length);
  });

  return {
    enter() { open = -1; renderIndex(); renderCard(); const v = view(); if (v) v.focus(-1); },
    leave() { open = -1; renderCard(); },
    sync() { const v = view(); if (v) v.focus(open); },
    rerender() { renderIndex(); renderCard(); },
    onHit(hit) { if (hit.type === 'doc') show(hit.index); },
    onEmpty() { close(); },
    onEscape() { return close(); },
    tip(hit) { if (hit.type !== 'doc') return ''; const s = SOURCES[hit.index]; return `${s.party.name} · ${s.publisher}`; },
  };
}

function docTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 344;
  const g = c.getContext('2d');
  g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, 256, 344);
  g.fillStyle = '#0E4A5A'; g.fillRect(0, 0, 256, 10);
  g.fillStyle = '#121A22';
  g.fillRect(24, 34, 150, 12); g.fillRect(24, 54, 110, 12);
  g.fillStyle = '#9aa6ab';
  for (let y = 92; y < 320; y += 16) g.fillRect(24, y, y % 64 === 28 ? 140 : 208, 5);
  g.strokeStyle = '#d6dddd'; g.lineWidth = 2; g.strokeRect(1, 1, 254, 342);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function fontiView(ctx) {
  const { THREE, orbs, gsap } = ctx;
  const V3 = THREE.Vector3;
  const O = new V3(...FONTI_ORIGIN);
  const N = SOURCES.length;
  let built = null, disposeTimer = 0, active = false, focused = -1, hovered = -1;
  let ringRot = 0;

  // ring angles with a small gap between parties
  const angles = (() => {
    const gaps = SOURCES.reduce((n, s, i) => n + (i > 0 && SOURCES[i - 1].party !== s.party ? 1 : 0), 0);
    const unit = (Math.PI * 2) / (N + gaps * 0.8);
    let a = 0;
    return SOURCES.map((s, i) => { if (i > 0 && SOURCES[i - 1].party !== s.party) a += unit * 0.8; const r = a; a += unit; return r; });
  })();
  const R = Math.max(3.2, (N * 0.78) / (Math.PI * 2) * 1.25);

  function build() {
    if (built) return built;
    const geo = new THREE.PlaneGeometry(0.62, 0.84);
    const tex = docTexture(THREE);
    const mat = withInstanceFade(new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, depthWrite: true }));
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    const fade = new THREE.InstancedBufferAttribute(new Float32Array(N).fill(1), 1);
    fade.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aFade', fade);
    const st = SOURCES.map(() => ({ f: 0, tf: 1, s: 0, ts: 1 }));
    // the flying "hero" copy of the chosen document
    const heroMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true, depthWrite: false });
    const hero = new THREE.Mesh(geo, heroMat);
    hero.visible = false;
    ctx.scene.add(mesh, hero);
    built = { geo, tex, mat, mesh, fade, st, hero, heroMat, fly: null };
    return built;
  }

  function dispose() {
    if (!built) return;
    ctx.scene.remove(built.mesh, built.hero);
    built.geo.dispose(); built.tex.dispose(); built.mat.dispose(); built.heroMat.dispose(); built.mesh.dispose();
    built = null;
  }

  const dummy = new THREE.Object3D();
  function slot(i, out) {
    const a = angles[i] + ringRot;
    out.position.set(O.x + Math.sin(a) * R, O.y + Math.sin(a * 3 + i) * 0.08, O.z + Math.cos(a) * R);
    out.rotation.set(0, a, 0); // faces outward
    return out;
  }

  function flyHero(i) {
    const b = built; if (!b) return;
    if (b.fly) b.fly.kill();
    slot(i, dummy);
    b.hero.position.copy(dummy.position);
    b.hero.quaternion.setFromEuler(dummy.rotation);
    b.hero.scale.setScalar(1);
    b.hero.visible = true;
    b.heroMat.opacity = 1;
    const from = { p: b.hero.position.clone(), q: b.hero.quaternion.clone() };
    const prog = { u: 0 };
    const flip = new THREE.Quaternion();
    const toQ = new THREE.Quaternion();
    const to = new V3();
    if (ctx.reducedMotion) { b.hero.visible = false; return; }
    b.fly = gsap.to(prog, {
      u: 1, duration: 1.15, ease: 'power3.inOut',
      onUpdate() {
        // target: just in front of the camera, facing it, after one half-turn flip
        const cam = ctx.camera;
        to.set(0, 0, -2.4).applyQuaternion(cam.quaternion).add(cam.position);
        flip.setFromAxisAngle(new V3(0, 1, 0), Math.PI * prog.u);
        toQ.copy(cam.quaternion).multiply(flip);
        b.hero.position.lerpVectors(from.p, to, prog.u);
        b.hero.quaternion.slerpQuaternions(from.q, toQ, prog.u);
        b.heroMat.opacity = prog.u < 0.75 ? 1 : 1 - (prog.u - 0.75) / 0.25; // hands over to the HTML card
      },
      onComplete() { b.hero.visible = false; b.fly = null; },
    });
  }

  return {
    pose() {
      const n = ctx.isNarrow();
      if (n) {
        const d = ctx.fitDist(R + 0.6, 1.0);
        return { pos: new V3(O.x, O.y + 1.6 + d * 0.3, O.z + d), target: new V3(O.x, O.y - 0.9, O.z) };
      }
      return { pos: new V3(O.x, O.y + 1.8, O.z + R + 6.2), target: new V3(O.x, O.y - 0.15, O.z), shift: -0.12 };
    },
    enter() { clearTimeout(disposeTimer); build(); active = true; restOrbs(orbs); built.st.forEach((s) => { s.ts = 1; s.tf = 1; }); },
    leave() {
      active = false; focused = -1; hovered = -1;
      if (built) built.st.forEach((s) => { s.ts = 0; s.tf = 0; });
      clearTimeout(disposeTimer);
      disposeTimer = setTimeout(() => { if (!active) dispose(); }, 2500);
    },
    focus(i) {
      if (!built) return;
      focused = i;
      built.st.forEach((s, k) => { s.tf = i < 0 || k === i ? 1 : 0.2; s.ts = i >= 0 && k === i ? 0 : 1; });
      if (i >= 0) flyHero(i); else if (built.hero) built.hero.visible = false;
    },
    setHover(i) { hovered = i; },
    update(t, dt, isActive) {
      if (!built) return;
      const b = built;
      const k = damp(dt, 4);
      if (focused < 0 && hovered < 0 && !ctx.reducedMotion) ringRot += dt * 0.04;
      const dark = ctx.dark();
      b.mat.color.setScalar(1 - 0.18 * dark);
      b.heroMat.color.copy(b.mat.color);
      b.st.forEach((s, i) => {
        s.f += (s.tf - s.f) * k;
        s.s += (s.ts - s.s) * k;
        slot(i, dummy);
        const lift = i === hovered && active ? 1.1 : 1;
        dummy.position.y += i === hovered && active ? 0.08 : 0;
        dummy.scale.setScalar(Math.max(0.0001, s.s * lift));
        dummy.updateMatrix();
        b.mesh.setMatrixAt(i, dummy.matrix);
        b.fade.array[i] = s.f;
      });
      b.fade.needsUpdate = true;
      b.mesh.instanceMatrix.needsUpdate = true;
      b.mesh.boundingSphere = null;
    },
    pickables() { return active && built ? [built.mesh] : []; },
    resolve(hit) { return hit.instanceId != null ? { type: 'doc', index: hit.instanceId, point: hit.point } : null; },
  };
}
