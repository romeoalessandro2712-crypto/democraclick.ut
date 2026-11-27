// worlds/community.js — COMMUNITY: the daily discussion.
//   • "Tema del giorno" (data/topic.js): one current topic, neutral summary, open question, external links
//   • taking part needs a Google account (Google Identity Services), loaded ONLY after the visitor
//     presses "Accedi con Google" — before that, no request reaches Google
//   • posts go to TUNE.community.endpoint (your server, which must verify the Google ID token);
//     until the Client ID and the endpoint are set, the section says plainly that it is not active.
//     Nothing is invented: no sample posts, no fake participants. The 3D nodes are decoration.
import { CONTENT } from '../data/content.js';
import { TOPICS, currentTopic, isToday } from '../data/topic.js';
import { topicHTML } from './topic-card.js';
import { esc, loc, damp, restOrbs, seeded, labelLayer } from './util.js';

const C = CONTENT.community;
export const COMMUNITY_ORIGIN = [0, 1.7, 22];
const BASE = 44;
const MAX = 120;
const GIS_SRC = 'https://accounts.google.com/gsi/client';

/** Display-only decoding of the Google ID token. The SERVER must verify it (signature, aud, exp). */
function decodeJwt(token) {
  try {
    const b = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(b).split('').map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''));
    return JSON.parse(json);
  } catch (e) { return null; }
}

let gisPromise = null;
function loadGIS() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = GIS_SRC; s.async = true;
    s.onload = () => resolve(); s.onerror = () => { gisPromise = null; reject(new Error('gis')); };
    document.head.appendChild(s);
  });
  return gisPromise;
}

export function communityUI({ root, t, getLang, view, announce, tune }) {
  const cfg = tune.community || {};
  const endpoint = cfg.endpoint && !/PLACEHOLDER/.test(cfg.endpoint) ? cfg.endpoint : null;
  const clientId = cfg.googleClientId && !/PLACEHOLDER/.test(cfg.googleClientId) ? cfg.googleClientId : null;
  const topicEl = root.querySelector('#cm-topic');
  const auth = root.querySelector('#cm-auth');
  const form = root.querySelector('#cm-form');
  const field = root.querySelector('#cm-text');
  const send = root.querySelector('#cm-send');
  const count = root.querySelector('#cm-count');
  const out = root.querySelector('#cm-out');
  const list = root.querySelector('#cm-list');
  const info = root.querySelector('#cm-about');
  const rules = root.querySelector('#cm-rules');
  const L = (o) => loc(o, getLang());
  const box = (b) => `<div class="box"><strong>${esc(L(b.title))}</strong> ${esc(L(b.body))}</div>`;

  let topics = TOPICS;
  let topic = currentTopic(topics);
  let user = null;        // { name, picture, credential, exp } — memory only, never stored
  let gisState = 'idle';  // idle | loading | ready | error
  let posts = [];         // loaded from the endpoint only
  let loadState = endpoint ? 'idle' : 'off'; // off | idle | loading | ok | error

  function renderTopic() {
    topicEl.innerHTML = topicHTML(topic, getLang(), { today: isToday(topic), h: 2, id: 'topic-title' });
  }

  function renderInfo() {
    rules.innerHTML = `<ul class="plain">${['r1', 'r2', 'r3', 'r4', 'r5'].map((k) => `<li>${esc(t(`cm.rule.${k}`))}</li>`).join('')}</ul>`;
    info.innerHTML = `<h4>${esc(L(C.about.title))}</h4><p class="fine">${esc(L(C.about.lead))}</p>
      <div class="stack">${C.about.boxes.map(box).join('')}</div>
      <h4>${esc(L(C.experts.title))}</h4><div class="warn"><strong>${esc(L(C.experts.planned))}</strong></div>
      <p class="fine">${esc(L(C.experts.lead))}</p><div class="stack">${C.experts.boxes.map(box).join('')}</div>`;
  }

  function renderAuth() {
    const canPost = !!(user && endpoint);
    field.disabled = !canPost; send.disabled = !canPost;
    form.setAttribute('aria-disabled', String(!canPost));
    field.placeholder = canPost ? t('cm.placeholder') : t('cm.locked');
    if (user) {
      auth.innerHTML = `<div class="who">${user.picture ? `<img src="${esc(user.picture)}" alt="" width="32" height="32" referrerpolicy="no-referrer">` : `<span class="avatar" aria-hidden="true">${esc((user.name || '?').slice(0, 1))}</span>`}
        <p><span class="fine">${esc(t('cm.signedAs'))}</span><b>${esc(user.name || '')}</b></p>
        <button type="button" class="ghost" data-act="signout">${esc(t('cm.signout'))}</button></div>
        ${endpoint ? '' : `<p class="fine">${esc(t('cm.noEndpoint'))}</p>`}`;
      return;
    }
    const why = `<p class="auth-why">${esc(t('cm.why'))}</p>`;
    if (!clientId) {
      auth.innerHTML = `${why}<button type="button" class="gbtn" disabled aria-describedby="cm-auth-off">${esc(t('cm.google'))}</button>
        <p id="cm-auth-off" class="fine">${esc(t('cm.notActive'))}</p>`;
      return;
    }
    auth.innerHTML = `${why}
      <button type="button" class="gbtn" data-act="google" ${gisState === 'loading' ? 'aria-busy="true" disabled' : ''} ${gisState === 'ready' ? 'hidden' : ''}>${esc(t('cm.google'))}</button>
      <div id="cm-gslot" class="gslot"></div>
      <p class="fine">${esc(gisState === 'ready' ? t('cm.gReady') : gisState === 'error' ? t('cm.gError') : t('cm.gConsent'))} <a href="privacy.html">${esc(t('nav.privacy'))}</a></p>`;
    if (gisState === 'ready') mountGoogleButton();
  }

  function mountGoogleButton() {
    const slot = auth.querySelector('#cm-gslot');
    if (!slot || !window.google?.accounts?.id) return;
    window.google.accounts.id.renderButton(slot, {
      type: 'standard', theme: document.documentElement.dataset.theme === 'dark' ? 'filled_black' : 'outline',
      size: 'large', text: 'signin_with', shape: 'rectangular', locale: getLang(), width: Math.min(320, slot.clientWidth || 280),
    });
  }

  function onCredential(resp) {
    const p = decodeJwt(resp?.credential || '');
    if (!p) { out.textContent = t('cm.gError'); return; }
    user = { name: p.name || p.given_name || '', picture: p.picture || '', credential: resp.credential, exp: (p.exp || 0) * 1000 };
    renderAuth();
    announce(t('cm.welcome', { name: user.name }));
    if (!field.disabled) field.focus({ preventScroll: true });
  }

  async function startGoogle() {
    gisState = 'loading'; renderAuth();
    try {
      await loadGIS();
      window.google.accounts.id.initialize({ client_id: clientId, callback: onCredential, auto_select: false, cancel_on_tap_outside: true, ux_mode: 'popup' });
      gisState = 'ready';
    } catch (e) { gisState = 'error'; }
    renderAuth();
    const btn = auth.querySelector('#cm-gslot [role="button"], #cm-gslot div[tabindex]');
    if (btn) btn.focus?.();
    announce(gisState === 'ready' ? t('cm.gReady') : t('cm.gError'));
  }

  auth.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'google') startGoogle();
    if (b.dataset.act === 'signout') {
      user = null;
      try { window.google?.accounts?.id?.disableAutoSelect(); } catch (err) { /* ignore */ }
      renderAuth(); announce(t('cm.signedOut'));
    }
  });

  const fmtTime = (iso) => { try { return new Date(iso).toLocaleString(getLang() === 'en' ? 'en-GB' : 'it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };

  function renderPosts() {
    if (loadState === 'off') { list.innerHTML = `<li class="empty">${esc(t('cm.emptyOff'))}</li>`; return; }
    if (loadState === 'loading') { list.innerHTML = `<li class="empty">${esc(t('cm.loading'))}</li>`; return; }
    if (loadState === 'error') { list.innerHTML = `<li class="empty">${esc(t('cm.loadError'))}</li>`; return; }
    if (!posts.length) { list.innerHTML = `<li class="empty">${esc(t('cm.empty0'))}</li>`; return; }
    list.innerHTML = posts.map((p) => `<li class="post"><article>
      <header>${p.author?.picture ? `<img src="${esc(p.author.picture)}" alt="" width="28" height="28" referrerpolicy="no-referrer" loading="lazy">` : `<span class="avatar" aria-hidden="true">${esc((p.author?.name || '?').slice(0, 1))}</span>`}
        <b>${esc(p.author?.name || t('cm.anon'))}</b>${p.created ? `<time datetime="${esc(p.created)}">${esc(fmtTime(p.created))}</time>` : ''}</header>
      <p>${esc(p.text || '')}</p></article></li>`).join('');
  }

  async function loadPosts() {
    if (!endpoint) return;
    loadState = 'loading'; renderPosts();
    try {
      const r = await fetch(`${endpoint}${endpoint.includes('?') ? '&' : '?'}topic=${encodeURIComponent(topic.id)}`, { headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      posts = Array.isArray(d) ? d : Array.isArray(d.posts) ? d.posts : [];
      loadState = 'ok';
    } catch (e) { loadState = 'error'; }
    renderPosts();
  }

  // optional remote topic list (same shape as data/topic.js)
  async function loadTopics() {
    if (!cfg.topicFeed) return;
    try {
      const r = await fetch(cfg.topicFeed, { cache: 'no-store' });
      if (!r.ok) return;
      const d = await r.json();
      if (Array.isArray(d) && d.length && d.every((x) => x.id && x.date && x.title && x.links)) {
        topics = d; const next = currentTopic(topics);
        if (next.id !== topic.id) { topic = next; renderTopic(); loadPosts(); }
      }
    } catch (e) { /* keep the bundled topic */ }
  }

  field.addEventListener('input', () => { count.textContent = `${field.value.length}/${field.maxLength}`; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!user || !endpoint) { out.textContent = t('cm.locked'); return; }
    if (user.exp && Date.now() > user.exp) { user = null; renderAuth(); out.textContent = t('cm.expired'); return; }
    const text = field.value.replace(/\s+/g, ' ').trim();
    if (text.length < 3) { out.textContent = t('community.empty'); field.focus(); return; }
    send.disabled = true; out.textContent = t('cm.sending');
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${user.credential}` },
        body: JSON.stringify({ topic: topic.id, text }),
      });
      if (!r.ok) throw new Error(String(r.status));
      let post = null; try { post = await r.json(); } catch (err) { /* server may return 204 */ }
      if (post && post.text) { posts.unshift(post); loadState = 'ok'; renderPosts(); }
      else loadPosts(); // the server may hold posts for moderation; show what it returns
      field.value = ''; count.textContent = '';
      out.textContent = t('cm.sent'); announce(t('cm.sent'));
      const v = view(); if (v) v.addPoint(text, null);
    } catch (err) { out.textContent = t('cm.sendError'); }
    send.disabled = false;
  });

  function renderAll() { renderTopic(); renderInfo(); renderAuth(); renderPosts(); }
  renderAll();

  return {
    enter() { renderAll(); out.textContent = ''; if (loadState === 'idle') loadPosts(); loadTopics(); },
    leave() {},
    sync() {},
    rerender() { renderAll(); },
    onThemeChange() { if (gisState === 'ready' && !user) renderAuth(); },
    onHit(hit) {
      if (hit.type !== 'place') return;
      const target = !field.disabled ? field : auth.querySelector('button:not([disabled]), [role="button"]') || topicEl.querySelector('a');
      target?.focus({ preventScroll: true });
    },
    onEscape() { if (document.activeElement === field && field.value) { field.value = ''; return true; } return false; },
    tip() { return t('cm.tip'); },
  };
}

export function communityView(ctx) {
  const { THREE, orbs } = ctx;
  const V3 = THREE.Vector3;
  const O = new V3(...COMMUNITY_ORIGIN);
  let built = null, disposeTimer = 0, active = false;
  const rnd = seeded(42);
  const nodes = []; // {home, phase, s, ts, born, text}
  for (let i = 0; i < BASE; i++) {
    const u = rnd() * Math.PI * 2, v = Math.acos(2 * rnd() - 1);
    const r = 0.55 + rnd() * 0.45;
    nodes.push({ home: new V3(Math.sin(v) * Math.cos(u) * 4.2 * r, Math.cos(v) * 1.7 * r, Math.sin(v) * Math.sin(u) * 1.6 * r), phase: rnd() * 6.28, s: 0, ts: 1, born: -1, text: '' });
  }
  let links = [];
  function relink() {
    links = [];
    nodes.forEach((n, i) => {
      const near = nodes.map((m, j) => [j, n.home.distanceToSquared(m.home)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
      near.forEach(([j]) => { if (!links.some(([a, b]) => (a === j && b === i))) links.push([i, j]); });
    });
  }
  relink();

  function build() {
    if (built) return built;
    const geo = new THREE.SphereGeometry(0.075, 16, 12);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geo, mat, MAX);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    for (let i = 0; i < MAX; i++) mesh.setColorAt(i, new THREE.Color(1, 1, 1));
    const lpos = new Float32Array(MAX * 3 * 2 * 3);
    const lgeo = new THREE.BufferGeometry();
    lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3).setUsage(THREE.DynamicDrawUsage));
    const lmat = new THREE.LineBasicMaterial({ color: ctx.accent.clone(), transparent: true, opacity: 0, depthWrite: false });
    const lines = new THREE.LineSegments(lgeo, lmat);
    lines.frustumCulled = false;
    // invisible plane through the network: clicks on it become "add your point here"
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshBasicMaterial({ visible: false }));
    plane.position.copy(O);
    const ghostMat = new THREE.MeshBasicMaterial({ color: ctx.glow.clone(), transparent: true, opacity: 0, depthWrite: false });
    const ghost = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.14, 48), ghostMat);
    ctx.scene.add(mesh, lines, plane, ghost);
    const labels = labelLayer(ctx.labelsRoot, 'community');
    built = { geo, mat, mesh, lpos, lgeo, lmat, lines, plane, ghost, ghostMat, labels };
    return built;
  }

  function dispose() {
    if (!built) return;
    const b = built;
    ctx.scene.remove(b.mesh, b.lines, b.plane, b.ghost);
    b.geo.dispose(); b.mat.dispose(); b.mesh.dispose(); b.lgeo.dispose(); b.lmat.dispose();
    b.plane.geometry.dispose(); b.plane.material.dispose(); b.ghost.geometry.dispose(); b.ghostMat.dispose();
    b.labels.remove();
    built = null;
  }

  const pos = (n, t, out) => out.copy(n.home).add(O).add(new V3(Math.sin(t * 0.3 + n.phase) * 0.12, Math.sin(t * 0.4 + n.phase * 1.7) * 0.1, 0));
  const P = {}, tmp = new V3(), tmpB = new V3();
  let time = 0;

  return {
    pose() {
      const n = ctx.isNarrow();
      if (n) {
        const d = ctx.fitDist(4.6, 1.0);
        return { pos: new V3(O.x, O.y + 1.6, O.z + d), target: new V3(O.x, O.y + 0.9, O.z), shiftY: 0.16 };
      }
      // desktop: topic on the left, taking part on the right, the network in between
      return { pos: new V3(O.x, O.y + 0.9, O.z + 11), target: new V3(O.x, O.y - 0.2, O.z), shift: 0.02 };
    },
    enter() { clearTimeout(disposeTimer); build(); active = true; restOrbs(orbs); nodes.forEach((n) => { n.ts = 1; }); },
    leave() {
      active = false;
      nodes.forEach((n) => { n.ts = 0; });
      clearTimeout(disposeTimer);
      disposeTimer = setTimeout(() => { if (!active) dispose(); }, 2500);
    },
    preview(point) {
      if (!built) return;
      built.ghost.position.copy(point);
      built.ghost.quaternion.copy(ctx.camera.quaternion);
      built.ghostMat.opacity = 0.9;
    },
    addPoint(text, point) {
      if (nodes.length >= MAX) nodes.splice(BASE, 1); // keep the newest additions
      const home = point ? point.clone().sub(O) : new V3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 1.5);
      nodes.push({ home, phase: Math.random() * 6.28, s: 0, ts: 1, born: time, text: text.slice(0, 80) });
      relink();
      if (built) built.ghostMat.opacity = 0;
    },
    update(t, dt, isActive) {
      time = t;
      if (!built) return;
      const b = built;
      const k = damp(dt, 3);
      const d = new ctx.THREE.Object3D();
      const col = new THREE.Color();
      nodes.forEach((n, i) => {
        n.s += (n.ts - n.s) * k;
        const age = n.born < 0 ? 99 : t - n.born;
        const bloom = age < 1.2 ? 1 + Math.sin((age / 1.2) * Math.PI) * 1.4 : 1; // blooms, then settles
        pos(n, t, d.position);
        d.scale.setScalar(Math.max(0.0001, n.s * bloom * (n.born >= 0 ? 1.25 : 1)));
        d.updateMatrix();
        b.mesh.setMatrixAt(i, d.matrix);
        col.copy(ctx.accent).lerp(ctx.glow, n.born >= 0 ? Math.max(0, 1 - age / 6) : 0);
        b.mesh.setColorAt(i, col);
      });
      for (let i = nodes.length; i < MAX; i++) { d.scale.setScalar(0.0001); d.updateMatrix(); b.mesh.setMatrixAt(i, d.matrix); }
      b.mesh.count = MAX;
      b.mesh.instanceMatrix.needsUpdate = true;
      b.mesh.instanceColor.needsUpdate = true;
      let w = 0;
      const L = b.lpos;
      for (const [i, j] of links) {
        if (w + 6 > L.length) break;
        pos(nodes[i], t, tmp); pos(nodes[j], t, tmpB);
        const grow = Math.min(nodes[i].s, nodes[j].s);
        tmpB.lerp(tmp, 1 - grow);
        L[w++] = tmp.x; L[w++] = tmp.y; L[w++] = tmp.z; L[w++] = tmpB.x; L[w++] = tmpB.y; L[w++] = tmpB.z;
      }
      for (; w < L.length; w++) L[w] = 0;
      b.lgeo.attributes.position.needsUpdate = true;
      b.lgeo.setDrawRange(0, links.length * 2);
      b.lmat.color.copy(ctx.accent);
      b.lmat.opacity += ((active ? 0.42 : 0) - b.lmat.opacity) * k;
      b.ghostMat.color.copy(ctx.glow);
      if (!active) b.ghostMat.opacity *= 0.9;
      b.ghost.scale.setScalar(1 + Math.sin(t * 3) * 0.12);

      // the newest point shows its words for a few seconds (aria-hidden; the form announces it)
      let n = 0;
      const last = nodes[nodes.length - 1];
      if (active && isActive && last && last.born >= 0 && t - last.born < 5) {
        pos(last, t, tmp); tmp.y += 0.22; ctx.project(tmp, P);
        b.labels.place(b.labels.get(n++, 'lbl-note'), P, last.text, Math.min(1, 5 - (t - last.born)), 'translate(-50%, -100%)');
      }
      b.labels.hideFrom(n);
    },
    pickables() { return active && built ? [built.plane] : []; },
    resolve(hit) { return { type: 'place', point: hit.point.clone() }; },
  };
}
