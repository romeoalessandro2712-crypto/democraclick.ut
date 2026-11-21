// worlds/partiti.js — PARTITI: a hemicycle of identical orbs.
// Pick one → the camera dollies in and its themes orbit it.
// Pick a second → both move to the centre, a bridge forms, themes align row by row.
//
// NEUTRALITY (enforced here, not just in the brief):
// - every orb shares one geometry, one material, one scale, one breathing phase;
// - order is reshuffled on every visit (crypto-random when available);
// - no party colour anywhere: nodes, lines and bridge use the neutral PARTITI accent;
// - receding orbs fade toward the fog colour, never toward black or grey "losers".

function shuffle(n) {
  const a = Array.from({ length: n }, (_, i) => i);
  const rnd = () => {
    if (window.crypto && crypto.getRandomValues) { const u = new Uint32Array(1); crypto.getRandomValues(u); return u[0] / 2 ** 32; }
    return Math.random();
  };
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

import { createChamber } from './chamber.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** DOM side — the accessible source of truth. Works with or without WebGL. */
export function partitiUI({ root, parties, themes, t, getLang, announce, onChange, onHover, orderMode = 'alphabetical' }) {
  const dock = root.querySelector('#party-dock');
  const panel = root.querySelector('#party-panel');
  let order = parties.map((_, i) => i); // slot → party index
  let sel = []; // slots, in pick order (max 2)
  const L = (o) => (o ? (o[getLang()] || o.it) : null);

  function partyAt(slot) { return parties[order[slot]]; }
  const logo = (p, size = '') => (p.logo ? `<img class="plogo ${size}" src="${p.logo}" alt="" width="64" height="64">` : '');

  // keep the panel clear of the dock, however many rows the dock wraps into
  if (window.ResizeObserver) {
    new ResizeObserver(([e]) => root.style.setProperty('--dock-h', `${Math.ceil(e.contentRect.height)}px`)).observe(dock);
  }

  function renderDock() {
    dock.innerHTML = order.map((pi, slot) => {
      const p = parties[pi];
      return `<li><button type="button" class="chip" style="--ac:${p.color}" data-slot="${slot}" aria-pressed="${sel.includes(slot)}">${logo(p, 'xs')}<span>${esc(p.name)}</span></button></li>`;
    }).join('');
  }

  // numbered citation links: every statement points to the source(s) it comes from
  function cite(p, src) {
    if (!src || !src.length) return '';
    return `<span class="cites">${src.map((i) => {
      const f = p.sources[i];
      return f ? `<a class="cite" href="${esc(f.url)}" target="_blank" rel="noopener noreferrer" title="${esc(f.label)}" aria-label="${esc(t('partiti.cite.aria', { n: i + 1, l: f.label }))}">${i + 1}</a>` : '';
    }).join('')}</span>`;
  }

  function themeValue(p, th) {
    const o = p.themes[th.id];
    const v = L(o);
    return v ? `<p>${esc(v)} ${cite(p, o.src)}</p>` : `<p class="none">${esc(t('partiti.theme.none'))}</p>`;
  }

  function onePanel(p) {
    return `
      <header class="panel-head party-head" style="--ac:${p.color}" data-anim>
        ${logo(p, 'lg')}
        <p class="eyebrow">${esc(p.leader)} · ${esc(L(p.role))}</p>
        <h3>${esc(p.name)}</h3>
        <button type="button" class="ghost" data-clear aria-label="${esc(t('partiti.clear.aria'))}">${esc(t('partiti.clear'))}</button>
      </header>
      <section class="block" data-anim>
        <h4>${esc(t('partiti.status'))}</h4>
        <p>${esc(L(p.status))} ${cite(p, p.status.src)}</p>
      </section>
      <section class="block" style="--ac:${p.color}" data-anim>
        <h4>${esc(t('partiti.program'))}</h4>
        <ol class="points">${p.points.map((x) => `<li>${esc(L(x))} ${cite(p, x.src)}</li>`).join('')}</ol>
        <p class="fine">${esc(t('partiti.program.note'))}</p>
      </section>
      <section class="block" data-anim>
        <h4>${esc(t('partiti.themes'))}</h4>
        <dl class="themes">${themes.map((th) => `<div class="theme-row"><dt>${esc(L(th.label))}</dt><dd>${themeValue(p, th)}</dd></div>`).join('')}</dl>
      </section>
      <section class="block" data-anim>
        <h4>${esc(t('partiti.sources'))} <span class="tag">${esc(t('partiti.sources.year', { y: L(p.updated) }))}</span></h4>
        <ol class="sources numbered">${p.sources.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.label)}</a> <span class="host">${esc(new URL(f.url).hostname.replace(/^www\./, ''))}</span></li>`).join('')}</ol>
        <p class="fine">${esc(t('partiti.checked', { d: new Date(`${p.checked}T12:00:00`).toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) }))}</p>
      </section>
      <p class="hint" data-anim>${esc(t('partiti.compare.hint'))}</p>`;
  }

  function twoPanel(a, b) {
    const rows = themes.map((th) => `<tr data-anim><th scope="row">${esc(L(th.label))}</th>
        <td data-label="${esc(a.name)}">${themeValue(a, th)}</td>
        <td data-label="${esc(b.name)}">${themeValue(b, th)}</td></tr>`).join('');
    return `
      <header class="panel-head" data-anim>
        <p class="eyebrow">${esc(t('partiti.compare'))}</p>
        <h3>${esc(a.name)} <span aria-hidden="true">·</span> ${esc(b.name)}</h3>
        <button type="button" class="ghost" data-clear aria-label="${esc(t('partiti.clear.aria'))}">${esc(t('partiti.clear'))}</button>
      </header>
      <div class="box" data-anim><strong>${esc(t('partiti.dates.title'))}</strong> ${esc(t('partiti.dates.body'))}</div>
      <div class="table-wrap"><table class="compare">
        <caption class="sr-only">${esc(t('partiti.comparing', { a: a.name, b: b.name }))}</caption>
        <thead><tr><th scope="col">${esc(t('partiti.theme'))}</th>
          <th scope="col" class="pcol" style="--ac:${a.color}">${logo(a, 'xs')}${esc(a.name)}<span class="yr">${esc(t('partiti.sources.year', { y: L(a.updated) }))}</span></th>
          <th scope="col" class="pcol" style="--ac:${b.color}">${logo(b, 'xs')}${esc(b.name)}<span class="yr">${esc(t('partiti.sources.year', { y: L(b.updated) }))}</span></th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  }

  function renderPanel() {
    if (!sel.length) { panel.hidden = true; panel.innerHTML = ''; root.dataset.mode = 'none'; return; }
    panel.hidden = false;
    panel.scrollTop = 0;
    if (sel.length === 1) { root.dataset.mode = 'one'; panel.innerHTML = onePanel(partyAt(sel[0])); }
    else {
      const [sa, sb] = [...sel].sort((x, y) => x - y); // left/right by hemicycle position
      root.dataset.mode = 'two';
      panel.innerHTML = twoPanel(partyAt(sa), partyAt(sb));
    }
  }

  function emit() {
    renderDock(); renderPanel();
    onChange(sel.slice(), order.map((pi) => parties[pi]));
    if (!sel.length) announce(t('partiti.none'));
    else if (sel.length === 1) announce(t('partiti.selected', { name: partyAt(sel[0]).name }));
    else { const [x, y] = [...sel].sort((m, n) => m - n); announce(t('partiti.comparing', { a: partyAt(x).name, b: partyAt(y).name })); }
  }

  function toggle(slot) {
    if (slot == null || slot < 0 || slot >= order.length) return;
    const hadFocus = document.activeElement && document.activeElement.closest && document.activeElement.closest('#party-dock');
    const i = sel.indexOf(slot);
    if (i >= 0) sel.splice(i, 1);
    else { sel.push(slot); if (sel.length > 2) sel.shift(); }
    emit();
    if (hadFocus) dock.querySelector(`[data-slot="${slot}"]`)?.focus();
  }

  function clear() { if (!sel.length) return; sel = []; emit(); }

  dock.addEventListener('click', (e) => {
    const b = e.target.closest('[data-slot]');
    if (b) toggle(Number(b.dataset.slot));
  });
  dock.addEventListener('keydown', (e) => {
    const b = e.target.closest('[data-slot]');
    if (!b) return;
    const s = Number(b.dataset.slot);
    let n = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (s + 1) % order.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (s - 1 + order.length) % order.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = order.length - 1;
    if (n != null) { e.preventDefault(); dock.querySelector(`[data-slot="${n}"]`).focus(); }
  });
  const hov = (e) => { const b = e.target.closest && e.target.closest('[data-slot]'); onHover(b ? Number(b.dataset.slot) : -1); };
  dock.addEventListener('pointerover', hov);
  dock.addEventListener('focusin', hov);
  dock.addEventListener('pointerleave', () => onHover(-1));
  dock.addEventListener('focusout', () => onHover(-1));
  panel.addEventListener('click', (e) => { if (e.target.closest('[data-clear]')) clear(); });

  return {
    /** New visit: reshuffle, clear selection. */
    enter() {
      order = orderMode === 'shuffle'
        ? shuffle(parties.length)
        : parties.map((p, i) => i).sort((a, b) => parties[a].name.localeCompare(parties[b].name, 'it', { sensitivity: 'base' }));
      sel = []; emit();
    },
    onHit(hit) { if (hit.type === 'orb') toggle(hit.slot); },
    onEmpty() { clear(); },
    onEscape() { if (!sel.length) return false; clear(); return true; },
    tip() { return ''; },
    leave() { sel = []; renderPanel(); },
    toggle, clear,
    hasSelection: () => sel.length > 0,
    rerender() { renderDock(); renderPanel(); },
    order: () => order.map((pi) => parties[pi]),
  };
}

/** 3D side. Receives THREE through ctx so this module never imports three itself. */
export function partitiView(ctx) {
  const { THREE, orbs, tune } = ctx;
  const V3 = THREE.Vector3;
  const N = orbs.count;
  const MAXT = tune.partiti.maxThemes;

  let active = false;
  let parties = [];
  let themeList = [];
  let sel = [];
  let hovered = -1;
  let built = null;
  let disposeTimer = 0;
  const STAGE = new V3(0, 1.5, 0.1); // where the two compared orbs meet, behind the lectern
  const spread = () => (ctx.isNarrow() ? 1.75 : 2.3);

  // ---------- lazy build / dispose ----------
  function build() {
    if (built) return built;
    const nodeGeo = new THREE.SphereGeometry(0.07, 16, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // unlit dots, tinted per party below
    const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, MAXT * 2);
    nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    nodes.frustumCulled = false;
    for (let i = 0; i < MAXT * 2; i++) nodes.setColorAt(i, new THREE.Color(1, 1, 1));
    const nodeState = Array.from({ length: MAXT * 2 }, () => ({ p: new V3(), tp: new V3(), s: 0, ts: 0 }));

    const segCount = MAXT * 2 + MAXT; // spokes + row connectors
    const linePos = new Float32Array(segCount * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    const lineMat = new THREE.LineBasicMaterial({ color: ctx.accent.clone(), transparent: true, opacity: 0, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    lines.frustumCulled = false;

    const BR = 80;
    const bridgePos = new Float32Array(BR * 3);
    const bridgeGeo = new THREE.BufferGeometry();
    bridgeGeo.setAttribute('position', new THREE.BufferAttribute(bridgePos, 3).setUsage(THREE.DynamicDrawUsage));
    bridgeGeo.setDrawRange(0, 0);
    const bridgeMat = new THREE.LineBasicMaterial({ color: ctx.accent.clone(), transparent: true, opacity: 0.9, depthWrite: false });
    const bridge = new THREE.Line(bridgeGeo, bridgeMat);
    bridge.frustumCulled = false;
    const bridgeState = { grow: 0, tgrow: 0 };

    ctx.scene.add(nodes, lines, bridge);

    // aria-hidden labels (the accessible copies live in the dock and panel)
    const layer = document.createElement('div');
    layer.className = 'labels-partiti';
    layer.setAttribute('aria-hidden', 'true');
    ctx.labelsRoot.appendChild(layer);
    const orbLabels = Array.from({ length: N }, () => { const el = document.createElement('span'); el.className = 'lbl lbl-orb'; layer.appendChild(el); return el; });
    const themeLabels = Array.from({ length: MAXT * 2 }, () => { const el = document.createElement('span'); el.className = 'lbl lbl-theme'; layer.appendChild(el); return el; });

    const chamber = createChamber(ctx);
    built = { nodes, nodeGeo, nodeMat, nodeState, lines, lineGeo, lineMat, linePos, bridge, bridgeGeo, bridgeMat, bridgePos, bridgeState, BR, layer, orbLabels, themeLabels, chamber };
    return built;
  }

  function dispose() {
    if (!built) return;
    const b = built;
    ctx.scene.remove(b.nodes, b.lines, b.bridge);
    b.nodeGeo.dispose(); b.nodeMat.dispose(); b.nodes.dispose();
    b.lineGeo.dispose(); b.lineMat.dispose();
    b.bridgeGeo.dispose(); b.bridgeMat.dispose();
    b.layer.remove();
    b.chamber.dispose();
    built = null;
  }

  // ---------- layout ----------
  const radius = () => (ctx.isNarrow() ? tune.partiti.radiusNarrow : tune.partiti.radius);
  const hemi = () => orbs.hemicycle(radius(), 1.0);
  const camRight = new V3(), camUp = new V3(), tmp = new V3();

  // each orb's glass takes a tint of its party's colour (same strength for all)
  const white = new THREE.Color(1, 1, 1);
  function applyTints() {
    orbs.state.forEach((st, i) => {
      const p = parties[i];
      st.ttint.copy(white);
      if (p && p.color) st.ttint.lerp(new THREE.Color(p.color), 0.55);
    });
  }

  function sortedSel() { return [...sel].sort((a, b) => a - b); }

  // every party gets the same theme list; a theme with no position found is drawn smaller
  function themesOf(slot) {
    const p = parties[slot];
    return p ? themeList.slice(0, MAXT).map((th) => ({ label: th.label, has: !!p.themes[th.id] })) : [];
  }

  function layoutOrbs() {
    const H = hemi();
    orbs.state.forEach((s, i) => {
      s.tp.copy(H[i]);
      s.ts = 1; s.tdim = 1;
      if (sel.length && !sel.includes(i)) {
        // recede: outward, lower, into the fog
        s.tp.x *= 1.45; s.tp.z = s.tp.z * 1.4 - 2.6; s.tp.y -= 0.5;
        s.ts = 0.75; s.tdim = 0.25;
      }
    });
    if (sel.length === 2) {
      const [a, b] = sortedSel();
      orbs.state[a].tp.set(STAGE.x - spread(), STAGE.y, STAGE.z);
      orbs.state[b].tp.set(STAGE.x + spread(), STAGE.y, STAGE.z);
    }
  }

  function basePose() {
    const n = ctx.isNarrow();
    if (n) {
      // Phones: look down at ~50° so the arc opens up vertically and labels have room.
      const d = ctx.fitDist(radius() + 0.7, 1.0);
      return { pos: new V3(0, 1.0 + d * 0.9, -0.9 + d * 0.44), target: new V3(0, 0.1, -0.9) };
    }
    return { pos: new V3(0, 5.1, 9.8), target: new V3(0, 0.5, -2.1) }; // high enough to read the tiers
  }

  // distance needed so a half-width `hw` fits horizontally
  function fitDist(hw, margin = 1.2, usable = 1) {
    const vfov = (ctx.camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * ctx.aspect() * usable);
    return Math.max(hw / Math.tan(hfov / 2), hw * 1.2) * margin;
  }

  function pose() {
    const n = ctx.isNarrow();
    // Desktop: the side panel covers the right ~40%, so the focus shifts left (viewShift).
    // Narrow: the panel is a bottom sheet, so the focus rises (target drops).
    const SHIFT = n ? 0 : 0.2;
    if (sel.length === 1) {
      const p = hemi()[sel[0]];
      const toCam = new V3(0, p.y, 9).sub(p).setY(0).normalize();
      const d = n ? fitDist(1.4, 1.2) : 4.6;
      const pos = p.clone().addScaledVector(toCam, d).add(new V3(0, n ? 1.4 : 0.9, 0));
      const target = p.clone();
      if (n) target.y -= 0.95;
      return { pos, target, shift: SHIFT };
    }
    if (sel.length === 2) {
      const d = n ? fitDist(spread() + 1.05, 1.05) : Math.max(7.2, fitDist(spread() + 1.2, 1.0, 0.56));
      const target = STAGE.clone();
      if (n) target.y -= 1.25; else target.y += 0.45;
      return { pos: new V3(STAGE.x, STAGE.y + (n ? 2.4 : 1.6), STAGE.z + d), target, shift: SHIFT };
    }
    return basePose();
  }

  function refly(instant) { ctx.flyTo(pose(), { duration: tune.motion.focus, instant }); }

  // ---------- per frame ----------
  const P = {};
  function update(t, dt, isActive) {
    if (!built) return;
    const b = built;
    const k = 1 - Math.exp(-dt * 5);

    b.lineMat.color.copy(ctx.accent); b.bridgeMat.color.copy(ctx.accent);

    camRight.setFromMatrixColumn(ctx.camera.matrixWorld, 0);
    camUp.setFromMatrixColumn(ctx.camera.matrixWorld, 1);

    const live = isActive && active;
    const S = sortedSel();
    const lang = ctx.getLang();
    // node targets
    b.nodeState.forEach((s) => { s.ts = 0; });
    const themeText = [];
    if (live && sel.length === 1) {
      const slot = sel[0];
      const c = orbs.state[slot].p;
      const th = themesOf(slot);
      th.forEach((x, j) => {
        const a = (j / th.length) * Math.PI * 2 + t * 0.18;
        const s = b.nodeState[j];
        s.tp.copy(c).addScaledVector(camRight, Math.cos(a) * 0.85).addScaledVector(camUp, Math.sin(a) * 0.85);
        s.ts = x.has ? 1 : 0.5;
        themeText[j] = { text: x.label[lang] || x.label.it, at: s.p, side: Math.cos(a) >= 0 ? 'r' : 'l', dim: !x.has };
      });
    } else if (live && sel.length === 2) {
      const [sa, sb] = S;
      const ta = themesOf(sa), tb = themesOf(sb);
      const rows = Math.max(ta.length, tb.length);
      const pa = orbs.state[sa].p, pb = orbs.state[sb].p;
      for (let j = 0; j < rows; j++) {
        const y = STAGE.y + ((rows - 1) / 2 - j) * 0.36;
        if (j < ta.length) { const s = b.nodeState[j]; s.tp.set(pa.x + 0.95, y, pa.z); s.ts = ta[j].has ? 1 : 0.5; }
        if (j < tb.length) { const s = b.nodeState[MAXT + j]; s.tp.set(pb.x - 0.95, y, pb.z); s.ts = tb[j].has ? 1 : 0.5; }
        const lbl = (ta[j] || tb[j]);
        themeText[j] = { text: lbl.label[lang] || lbl.label.it, at: new V3(STAGE.x, y, STAGE.z), side: 'c' };
      }
    }

    // nodes
    const d = new ctx.THREE.Object3D();
    b.nodeState.forEach((s, i) => {
      if (s.s < 0.01 && s.ts > 0) s.p.copy(s.tp); // bloom out of their target, no fly-in from origin
      s.p.lerp(s.tp, k);
      s.s += (s.ts - s.s) * k;
      d.position.copy(s.p);
      d.scale.setScalar(Math.max(0.0001, s.s));
      d.updateMatrix();
      b.nodes.setMatrixAt(i, d.matrix);
    });
    b.nodes.instanceMatrix.needsUpdate = true;

    // node colour = its party's colour (same treatment for every party)
    const nc = new ctx.THREE.Color();
    for (let i = 0; i < MAXT * 2; i++) {
      const owner = i < MAXT ? (S.length === 2 ? S[0] : sel[0]) : S[1];
      const pc = owner != null && parties[owner] ? parties[owner].color : null;
      nc.set(pc || '#5b6878');
      b.nodes.setColorAt(i, nc);
    }
    b.nodes.instanceColor.needsUpdate = true;

    b.chamber.update(t, dt, live, parties, orbs, hovered, sel);

    // lines: spokes orb→node, then row connectors (compare)
    const L = b.linePos;
    let w = 0;
    const put = (v) => { L[w++] = v.x; L[w++] = v.y; L[w++] = v.z; };
    const zero = { x: 0, y: -999, z: 0 };
    for (let i = 0; i < MAXT * 2; i++) {
      const s = b.nodeState[i];
      const owner = i < MAXT ? (S.length === 2 ? S[0] : sel[0]) : S[1];
      if (s.s > 0.02 && owner != null) { put(orbs.state[owner].p); put(s.p); } else { put(zero); put(zero); }
    }
    for (let j = 0; j < MAXT; j++) {
      const A = b.nodeState[j], B = b.nodeState[MAXT + j];
      if (S.length === 2 && A.s > 0.02 && B.s > 0.02) { put(A.p); put(B.p); } else { put(zero); put(zero); }
    }
    b.lineGeo.attributes.position.needsUpdate = true;
    b.lineMat.opacity += ((live && sel.length ? 0.6 : 0) - b.lineMat.opacity) * k;

    // bridge: an arch from A to B that grows from both ends
    b.bridgeState.tgrow = live && sel.length === 2 ? 1 : 0;
    b.bridgeState.grow += (b.bridgeState.tgrow - b.bridgeState.grow) * (1 - Math.exp(-dt * 2.4));
    if (S.length === 2 || b.bridgeState.grow > 0.01) {
      const pa = orbs.state[S[0] ?? 0].p, pb = orbs.state[S[1] ?? 0].p;
      for (let i = 0; i < b.BR; i++) {
        const u = i / (b.BR - 1);
        tmp.lerpVectors(pa, pb, u);
        tmp.y += Math.sin(u * Math.PI) * 1.9;
        b.bridgePos[i * 3] = tmp.x; b.bridgePos[i * 3 + 1] = tmp.y; b.bridgePos[i * 3 + 2] = tmp.z;
      }
      b.bridgeGeo.attributes.position.needsUpdate = true;
    }
    b.bridgeGeo.setDrawRange(0, Math.round(b.bridgeState.grow * b.BR));
    b.bridgeMat.opacity = 0.85 * b.bridgeState.grow;

    // HTML labels
    for (let i = 0; i < N; i++) {
      const el = b.orbLabels[i];
      if (!live || !parties[i]) { el.style.opacity = '0'; continue; }
      tmp.copy(orbs.state[i].p); tmp.y -= 0.66 * orbs.state[i].s;
      ctx.project(tmp, P);
      if (el.textContent !== parties[i].name) el.textContent = parties[i].name;
      const isSel = sel.includes(i);
      el.style.transform = `translate(${P.x | 0}px, ${P.y | 0}px) translate(-50%, 0)`;
      // phones: only selected orbs carry a 3D label (the dock lists every name in the same order)
      const show = P.visible && (!ctx.isNarrow() || isSel);
      el.style.opacity = !show ? '0' : String(sel.length && !isSel ? 0.28 : 1);
      el.classList.toggle('on', isSel);
    }
    for (let j = 0; j < MAXT * 2; j++) {
      const el = b.themeLabels[j];
      const tt = themeText[j];
      if (!tt) { el.style.opacity = '0'; continue; }
      ctx.project(tt.at, P);
      if (el.textContent !== tt.text) el.textContent = tt.text;
      const shift = tt.side === 'r' ? 'translate(14px, -50%)' : tt.side === 'l' ? 'translate(calc(-100% - 14px), -50%)' : 'translate(-50%, -50%)';
      el.style.transform = `translate(${P.x | 0}px, ${P.y | 0}px) ${shift}`;
      el.style.opacity = P.visible ? (tt.dim ? '0.55' : '1') : '0';
      el.dataset.side = tt.side;
    }

    // hover lift — identical for every orb
    orbs.state.forEach((s, i) => { s.hover += ((live && i === hovered ? 1 : 0) - s.hover) * k; });
  }

  return {
    pose,
    enter() {
      clearTimeout(disposeTimer);
      build();
      active = true;
      sel = [];
      orbs.setSync(true);
      applyTints();
      layoutOrbs();
      built.chamber.setActive(true);
    },
    leave() {
      active = false; sel = []; hovered = -1;
      orbs.state.forEach((s) => { s.hover = 0; s.ttint.setRGB(1, 1, 1); });
      if (built) built.chamber.setActive(false);
      clearTimeout(disposeTimer);
      disposeTimer = setTimeout(() => { if (!active) dispose(); }, 2500); // dispose what we leave
    },
    update,
    setParties(list, themes) { parties = list; if (themes) themeList = themes; if (active) applyTints(); },
    setSelection(slots) {
      const changed = slots.length !== sel.length || slots.some((s, i) => s !== sel[i]);
      sel = slots.slice();
      layoutOrbs();
      if (active && changed) refly();
    },
    setHover(i) { hovered = i; },
    onResize() { if (active) refly(true); },
    pickables() { return active ? [orbs.mesh] : []; },
    resolve(hit) { return hit.instanceId != null ? { type: 'orb', slot: hit.instanceId, point: hit.point } : null; },
  };
}
