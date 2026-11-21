// main.js — boot, state machine, router, UI composition, cursor, sound, theme, language.
// This file never imports three.js. The WebGL scene (scene.js) is loaded on demand,
// so if WebGL or the CDN is unavailable the site keeps working in 2D.
import { applyI18n, initialLang, t, getLang } from './i18n.js';
import { PARTITI, THEMES, COLLECTED } from './data/partiti.js';
import { homeUI, homeView } from './worlds/home.js';
import { partitiUI, partitiView } from './worlds/partiti.js';
import { datiUI, datiView } from './worlds/dati.js';
import { fontiUI, fontiView } from './worlds/fonti.js';
import { metodoUI, metodoView } from './worlds/metodo.js';
import { communityUI, communityView } from './worlds/community.js';
import { sondaggiUI, sondaggiView } from './worlds/sondaggi.js';
import { SYMBOLS_NOTE } from './data/content.js';
import { UPDATED } from './data/edition.js';
import { briefingHTML } from './worlds/briefing.js';

// ───────────────────────── TUNABLES ─────────────────────────
// The five knobs worth touching. Everything else derives from these.
export const TUNE = {
  // 1. Accent per world: [light theme, dark theme]. All desaturated on purpose.
  //    PARTITI is a neutral stone grey so no hue can be read as a party colour.
  //    Brand palette from your prototype: petrol teal on paper, saffron on ink.
  //    Every world uses the brand pair for now; give a world its own pair to tint it.
  accents: {
    home:      ['#0E4A5A', '#E9A944'],
    partiti:   ['#0E4A5A', '#E9A944'],
    sondaggi:  ['#0E4A5A', '#E9A944'],
    dati:      ['#0E4A5A', '#E9A944'],
    fonti:     ['#0E4A5A', '#E9A944'],
    metodo:    ['#0E4A5A', '#E9A944'],
    community: ['#0E4A5A', '#E9A944'],
  },
  //    The one light source that glows (the Click orb, its halo, the shockwave): saffron.
  glow: '#E9A944',
  // 2. Fog density per world (higher = closer, softer horizon)
  fog: { home: 0.06, partiti: 0.042, sondaggi: 0.04, dati: 0.05, fonti: 0.05, metodo: 0.032, community: 0.055 },
  // 3. Motion: seconds and amplitudes
  motion: { flightMin: 1.2, flightMax: 1.8, focus: 1.1, ripple: 0.6, breath: 0.03, panelStagger: 0.06 },
  // 4. Quality tiers: DPR cap, frame budget (ms) before dropping a tier, grain amount, start tier (2 full → 0 lean)
  quality: { dprCap: 1.75, frameBudget: 20, grain: 0.035, startTier: 2 },
  // 5. Counts and sizes for PARTITI
  //    order: 'alphabetical' matches your Metodo text ("L'ordine è alfabetico"); 'shuffle' reshuffles per visit
  // polls: LIVE pill while data is at most freshDays old; electionDate (YYYY-MM-DD) triggers the
  // 15-day legal blackout; feed = URL of a JSON shaped like data/sondaggi.js POLL (optional)
  polls: { freshDays: 8, electionDate: null, feed: null },
  // community: taking part needs a Google account. Paste your OAuth Web Client ID (Google Cloud
  // console → APIs & Services → Credentials) and the URL of your posts API. Until both are set the
  // section says the discussion is not active yet. topicFeed (optional) = JSON array shaped like
  // data/topic.js, to publish the daily topic without a rebuild. See INTEGRATION.md.
  community: { googleClientId: '[GOOGLE_CLIENT_ID_PLACEHOLDER]', endpoint: '[ENDPOINT_PLACEHOLDER]', topicFeed: null },
  partiti: { maxThemes: 8, radius: 4.6, radiusNarrow: 3.9, order: 'alphabetical' },
};

// ───────────────────────── STATE MACHINE ─────────────────────────
// world → layout (UI composition) + cursor style. Camera pose comes from each world's view.
const WORLDS = {
  home:      { layout: 'hero',    cursor: 'ring' },
  partiti:   { layout: 'dock',    cursor: 'ring' },
  sondaggi:  { layout: 'rail',    cursor: 'ring' },
  dati:      { layout: 'rail',    cursor: 'ring' },
  fonti:     { layout: 'focus',   cursor: 'ring' },
  metodo:    { layout: 'stepper', cursor: 'ring' },
  community: { layout: 'float',   cursor: 'ring' },
};

const html = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const S = {
  world: null,
  theme: 'light',
  mode: '2d',          // '2d' | '3d'
  sound: false,
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  keyboard: false,     // last input was keyboard → move focus on world change
};

// ───────────────────────── GSAP (with a no-motion shim) ─────────────────────────
const gsap = window.gsap || makeShim();
function makeShim() {
  const apply = (targets, vars) => {
    const list = Array.isArray(targets) || targets instanceof NodeList ? [...targets] : [targets];
    list.forEach((el) => {
      for (const k in vars) {
        if (['duration', 'delay', 'ease', 'stagger', 'onComplete', 'onUpdate', 'onStart', 'clearProps'].includes(k)) continue;
        if (el && el.style && (k === 'opacity' || k === 'y')) { if (k === 'opacity') el.style.opacity = vars[k]; if (k === 'y') el.style.transform = `translateY(${vars[k]}px)`; }
        else if (el) el[k] = vars[k];
      }
    });
    vars.onStart && vars.onStart(); vars.onUpdate && vars.onUpdate(); vars.onComplete && vars.onComplete();
    return { kill() {} };
  };
  return { to: apply, set: apply, fromTo: (t, _f, v) => apply(t, v), killTweensOf() {} };
}

// ───────────────────────── SOUND (synthesised, OFF by default) ─────────────────────────
const Sound = (() => {
  let ac = null;
  const ensure = () => {
    if (!ac) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ac = new AC(); }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  const env = (a, g, peak, att, rel) => {
    g.gain.setValueAtTime(0.0001, a.currentTime);
    g.gain.exponentialRampToValueAtTime(peak, a.currentTime + att);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + att + rel);
  };
  return {
    tick() {
      if (!S.sound) return; const a = ensure(); if (!a) return;
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.value = 1500;
      env(a, g, 0.02, 0.004, 0.06);
      o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + 0.1);
    },
    swell() {
      if (!S.sound) return; const a = ensure(); if (!a) return;
      const g = a.createGain(), f = a.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 520;
      [98, 147].forEach((hz) => {
        const o = a.createOscillator(); o.type = 'triangle'; o.frequency.value = hz;
        o.connect(f); o.start(); o.stop(a.currentTime + 2);
      });
      f.connect(g).connect(a.destination);
      env(a, g, 0.05, 0.45, 1.3);
    },
    unlock: ensure,
  };
})();

// ───────────────────────── HELPERS ─────────────────────────
const section = (id) => document.getElementById(id);
const live = $('#live');
function announce(msg) { if (!live) return; live.textContent = ''; requestAnimationFrame(() => { live.textContent = msg; }); }

let lastPointer = { x: innerWidth / 2, y: innerHeight / 2, at: 0 };
const recentPointer = () => (performance.now() - lastPointer.at < 600 ? lastPointer : { x: innerWidth / 2, y: innerHeight / 2 });

function accentFor(id) { const a = TUNE.accents[id] || TUNE.accents.home; return S.theme === 'dark' ? a[1] : a[0]; }
function applyAccent(instant) {
  const hex = accentFor(S.world);
  html.style.setProperty('--accent', hex);
  if (scene) scene.setAccent(hex, instant);
}

// ───────────────────────── TOOLTIP (crisp HTML, never 3D text) ─────────────────────────
function showTip(text, x, y) {
  const tip = $('#tip');
  if (!tip) return;
  if (!text) { tip.hidden = true; return; }
  if (tip.textContent !== text) tip.textContent = text;
  tip.hidden = false;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  const tx = Math.min(innerWidth - w - 12, x + 16), ty = Math.max(12, y - h - 14);
  tip.style.transform = `translate(${tx}px, ${ty}px)`;
}

// ───────────────────────── PANELS: exit / enter with stagger ─────────────────────────
function exitPanel(sec, done) {
  const items = $$('[data-anim]', sec);
  gsap.killTweensOf(items);
  if (!items.length) { done(); return; }
  gsap.to(items, {
    opacity: 0, y: S.reduced ? 0 : -10, duration: S.reduced ? 0.2 : 0.35, ease: 'power2.in',
    stagger: S.reduced ? 0 : 0.035, onComplete: done,
  });
}
function enterPanel(sec, delay = 0) {
  sec.hidden = false;
  const items = $$('[data-anim]', sec);
  gsap.killTweensOf(items);
  if (!items.length) return;
  gsap.fromTo(items, { opacity: 0, y: S.reduced ? 0 : 14 }, {
    opacity: 1, y: 0, duration: S.reduced ? 0.3 : 0.7, ease: 'power3.out',
    stagger: S.reduced ? 0 : TUNE.motion.panelStagger, delay, clearProps: 'transform',
  });
}

// ───────────────────────── TRANSITION ─────────────────────────
let scene = null;
let home, parties;
const UIS = {}; // world id → DOM controller (enter/leave/sync/rerender/onHit/onEmpty/onEscape/tip)

function go(id, opts = {}) {
  if (!WORLDS[id]) id = 'home';
  if (id === S.world) return;
  const prev = S.world;
  S.world = id;

  html.dataset.world = id;
  html.dataset.layout = WORLDS[id].layout;
  html.dataset.cursor = WORLDS[id].cursor;
  applyAccent(opts.instant);
  $$('.nav a[data-world]').forEach((a) => {
    if (a.dataset.world === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  // (c) UI: old panels exit with a stagger, new ones enter
  const out = prev && section(prev);
  const inn = section(id);
  if (out) exitPanel(out, () => { if (S.world !== prev) out.hidden = true; });
  if (prev) UIS[prev]?.leave?.();

  // (a) ripple, (b) camera flight, (d) accent + fog
  let flight = 0;
  if (scene) {
    if (!opts.instant) scene.ripple(opts.origin?.x ?? innerWidth / 2, opts.origin?.y ?? innerHeight / 2, 1);
    scene.setFog(TUNE.fog[id] ?? 0.05, opts.instant);
    if (S.reduced && !opts.instant) veil(() => scene.setWorld(id, { instant: true }));
    else flight = scene.setWorld(id, { instant: opts.instant });
  }
  UIS[id]?.enter?.();
  enterPanel(inn, opts.instant ? 0 : Math.min(0.55, flight * 0.4 + 0.2));

  if (!opts.instant) Sound.swell();
  document.title = id === 'home' ? t('meta.title') : `${t(`nav.${id}`)} · DemocraClick`;
  announce(t('world.now', { name: t(`nav.${id}`) }));
  if (opts.focus) {
    const h = inn.querySelector('h1, h2');
    if (h) setTimeout(() => h.focus({ preventScroll: true }), opts.instant ? 0 : 400);
  }
}

// reduced motion: crossfade instead of flight
function veil(swap) {
  const v = $('#veil');
  gsap.killTweensOf(v);
  gsap.to(v, { opacity: 1, duration: 0.22, ease: 'power1.out', onComplete() {
    swap();
    gsap.to(v, { opacity: 0, duration: 0.4, ease: 'power1.in' });
  } });
}

// ───────────────────────── ROUTER (hash = world) ─────────────────────────
function worldFromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === '') return 'home';
  return WORLDS[h] ? h : null; // non-world anchors (e.g. #main) are ignored
}
window.addEventListener('hashchange', () => {
  const w = worldFromHash();
  if (w) go(w, { origin: recentPointer(), focus: S.keyboard });
});
function navigate(id) {
  if (location.hash.slice(1) === id) return;
  location.hash = id; // adds a history entry → back/forward work
}

// ───────────────────────── THEME ─────────────────────────
function initialTheme() {
  try { const s = localStorage.getItem('dc-theme'); if (s === 'light' || s === 'dark') return s; } catch (e) { /* ignore */ }
  const attr = html.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
let themeMutating = false;
function setTheme(theme, { instant, persist } = {}) {
  S.theme = theme;
  themeMutating = true;
  html.setAttribute('data-theme', theme);
  themeMutating = false;
  $('#theme-toggle')?.setAttribute('aria-pressed', String(theme === 'dark'));
  if (persist) { try { localStorage.setItem('dc-theme', theme); } catch (e) { /* ignore */ } }
  applyAccent(instant);
  if (scene) scene.setTheme(theme, instant);
  Object.values(UIS).forEach((u) => u.onThemeChange?.(theme));
}
// if something else (the host page, an old toggle) flips data-theme, follow it
new MutationObserver(() => {
  if (themeMutating) return;
  const v = html.getAttribute('data-theme');
  if ((v === 'light' || v === 'dark') && v !== S.theme) setTheme(v);
}).observe(html, { attributes: true, attributeFilter: ['data-theme'] });

// ───────────────────────── CURSOR ─────────────────────────
function initCursor() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const c = $('#cursor');
  if (!c) return;
  html.classList.add('has-cursor');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, tgt = { ...pos };
  let hoverEl = null;
  addEventListener('pointermove', (e) => { tgt.x = e.clientX; tgt.y = e.clientY; c.classList.add('on'); }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('on'));
  addEventListener('pointerdown', () => c.classList.add('press'));
  addEventListener('pointerup', (e) => {
    c.classList.remove('press');
    if (S.reduced) return;
    const r = document.createElement('span');
    r.className = 'cursor-ripple';
    r.style.left = `${e.clientX}px`; r.style.top = `${e.clientY}px`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
  addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('a, button, [data-slot], label');
    if (el !== hoverEl) { hoverEl = el; c.classList.toggle('hover', !!el); if (el) Sound.tick(); }
  });
  const loop = () => {
    const k = S.reduced ? 1 : 0.28;
    pos.x += (tgt.x - pos.x) * k; pos.y += (tgt.y - pos.y) * k;
    c.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  window.__setCursorHover3D = (v) => { if (!hoverEl) c.classList.toggle('hover', v); };
}

// ───────────────────────── 3D CAPABILITY ─────────────────────────
function canRun3D() {
  let force = false;
  try {
    const pref = localStorage.getItem('dc-3d');
    if (pref === 'off') return false; // the visitor chose the light version
    force = pref === 'force';
  } catch (e) { /* ignore */ }
  try {
    // failIfMajorPerformanceCaveat: no context when the browser would draw 3D in software
    // (no usable GPU). Those visitors get the fast 2D version instead of a stuttering scene.
    const opts = force ? {} : { failIfMajorPerformanceCaveat: true };
    const c = document.createElement('canvas');
    const gl = window.WebGLRenderingContext && (c.getContext('webgl2', opts) || c.getContext('webgl', opts));
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // free the probe context right away
  } catch (e) { return false; }
  if (force) return true;
  const lowMem = navigator.deviceMemory && navigator.deviceMemory < 2;
  // Only a single-core device is treated as low-end up front; everything else is
  // handled by the adaptive quality tiers in scene.js.
  const fewCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2;
  const saveData = navigator.connection && navigator.connection.saveData;
  return !(lowMem || fewCores || saveData);
}

// ───────────────────────── LOADER ─────────────────────────
const loader = $('#loader');
function loaderProgress(p) { loader?.style.setProperty('--p', String(p)); }
function hideLoader() {
  if (!loader || loader.dataset.done) return;
  loader.dataset.done = '1';
  loaderProgress(1);
  gsap.to(loader, { opacity: 0, duration: 0.45, delay: 0.15, ease: 'power1.out', onComplete: () => loader.remove() });
}

// ───────────────────────── BOOT ─────────────────────────
async function boot() {
  loaderProgress(0.15);
  const loaderCap = setTimeout(hideLoader, 1800); // content visible within 2 s, whatever happens

  S.theme = initialTheme();
  setTheme(S.theme, { instant: true });
  applyI18n(initialLang());

  // DOM-side worlds (these work with or without WebGL)
  home = homeUI({
    root: section('home'), gsap, reducedMotion: () => S.reduced,
    onWord: (i, instant) => scene && scene.view('home').light(i, instant),
  });
  parties = partitiUI({
    root: section('partiti'), parties: PARTITI, themes: THEMES, t, getLang, announce,
    onChange(sel, ordered) {
      const items = $$('#party-panel [data-anim]');
      if (items.length) gsap.fromTo(items, { opacity: 0, y: S.reduced ? 0 : 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: S.reduced ? 0 : 0.045, ease: 'power3.out', clearProps: 'transform' });
      Sound.tick();
      if (scene) { const v = scene.view('partiti'); v.setParties(ordered, THEMES); v.setSelection(sel); }
    },
    onHover(slot) { if (scene) scene.view('partiti').setHover(slot); },
    orderMode: TUNE.partiti.order,
  });
  const ui = (id) => ({ root: section(id), t, getLang, announce, tune: TUNE, view: () => (scene ? scene.view(id) : null) });
  UIS.home = { enter: () => home.reveal() };
  UIS.partiti = parties;
  UIS.dati = datiUI(ui('dati'));
  UIS.fonti = fontiUI(ui('fonti'));
  UIS.metodo = metodoUI(ui('metodo'));
  UIS.community = communityUI(ui('community'));
  UIS.sondaggi = sondaggiUI(ui('sondaggi'));
  // panels that rewrite themselves animate their new content in
  document.addEventListener('dc:panel', (e) => {
    const items = e.detail ? $$('[data-anim]', e.detail) : [];
    if (items.length) gsap.fromTo(items, { opacity: 0, y: S.reduced ? 0 : 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: S.reduced ? 0 : 0.04, ease: 'power3.out', clearProps: 'transform' });
    Sound.tick();
  });

  // all sections hidden except the current one
  const start = worldFromHash() || 'home';
  Object.keys(WORLDS).forEach((id) => { const s = section(id); if (s) s.hidden = true; });
  go(start, { instant: true });

  // controls
  $('#theme-toggle')?.addEventListener('click', () => setTheme(S.theme === 'dark' ? 'light' : 'dark', { persist: true }));
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => applyI18n(b.dataset.lang)));
  const collected = () => {
    const el = $('#collected'); if (el) el.textContent = t('partiti.collected', { d: COLLECTED[getLang()] || COLLECTED.it });
    const sn = $('#symbols-note'); if (sn) sn.textContent = SYMBOLS_NOTE[getLang()] || SYMBOLS_NOTE.it;
  };
  // newsroom furniture: today's date in the masthead, the HOME briefing, the footer's update date
  const editorial = () => {
    const lang = getLang(), loc = lang === 'en' ? 'en-GB' : 'it-IT';
    const dl = $('#dateline');
    if (dl) {
      const now = new Date();
      const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      dl.innerHTML = `<time datetime="${iso}">${now.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</time>`;
    }
    const bl = $('#brief-list'); if (bl) bl.innerHTML = briefingHTML(t, lang);
    const fu = $('#foot-upd'); if (fu) fu.textContent = t('footer.updated', { d: new Date(`${UPDATED}T12:00:00`).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) });
  };
  collected(); editorial();
  document.addEventListener('dc:lang', () => { collected(); editorial(); document.title = S.world === 'home' ? t('meta.title') : `${t(`nav.${S.world}`)} · DemocraClick`; Object.values(UIS).forEach((u) => u.rerender?.()); announce(t('world.now', { name: t(`nav.${S.world}`) })); });
  // light version: same content and navigation, no 3D (faster, calmer, kinder to old phones).
  // The button starts hidden: it appears only where the 3D actually runs, or where the visitor
  // chose the light version (so they can switch back). Devices without 3D never see it.
  const lite = $('#lite-toggle');
  let liteChosen = false; try { liteChosen = localStorage.getItem('dc-3d') === 'off'; } catch (e) { /* ignore */ }
  if (lite) {
    const off = liteChosen;
    lite.setAttribute('aria-pressed', String(off));
    if (off) lite.hidden = false;
    lite.addEventListener('click', () => {
      try { if (off) localStorage.removeItem('dc-3d'); else localStorage.setItem('dc-3d', 'off'); } catch (e) { /* ignore */ }
      location.reload();
    });
  }
  // "Correzioni" links open the public record in FONTI
  document.addEventListener('click', (e) => {
    if (!e.target.closest?.('[data-open-registro]')) return;
    setTimeout(() => { const r = $('#registro'); if (r) { r.open = true; r.querySelector('summary')?.focus({ preventScroll: true }); } }, 60);
  });
  const snd = $('#sound-toggle');
  snd?.addEventListener('click', () => {
    S.sound = !S.sound;
    snd.setAttribute('aria-pressed', String(S.sound)); // the visible label stays "Suono"; the state is aria-pressed + style
    if (S.sound) { Sound.unlock(); Sound.tick(); }
  });
  $('.skip')?.addEventListener('click', (e) => {
    e.preventDefault();
    section(S.world)?.querySelector('h1, h2')?.focus();
  });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (e) => {
    S.reduced = e.matches; if (scene) scene.setReducedMotion(e.matches);
  });

  // input modality + keyboard shortcuts
  addEventListener('keydown', (e) => {
    S.keyboard = true;
    if (e.key === 'Escape' && UIS[S.world]?.onEscape?.()) e.preventDefault();
  });
  addEventListener('pointerdown', (e) => { S.keyboard = false; lastPointer = { x: e.clientX, y: e.clientY, at: performance.now() }; }, { passive: true });
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => addEventListener(ev, () => scene && scene.poke(), { passive: true }));

  initCursor();

  document.fonts?.ready.then(() => loaderProgress(0.45));

  // ── progressive enhancement: the 3D layer ──
  if (!canRun3D()) {
    html.classList.add('no-webgl');
    if (!liteChosen) $('#fallback-note')?.removeAttribute('hidden'); // "your device does not support 3D" only when true
    clearTimeout(loaderCap); hideLoader();
    return;
  }
  // let the page paint its text first: the 3D layer loads when the browser is idle (≤ 1.2 s)
  await new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 1200 }) : setTimeout(r, 300)));
  try {
    const mod = await import('./scene.js');
    await mod.loadThree();
    loaderProgress(0.75);
    scene = mod.createScene({
      canvas: $('#agora'), tune: TUNE, gsap, theme: S.theme, reducedMotion: S.reduced,
      orbCount: PARTITI.length, labelsRoot: $('#labels'), getLang,
      views: { home: homeView, partiti: partitiView, dati: datiView, fonti: fontiView, metodo: metodoView, community: communityView, sondaggi: sondaggiView },
    });
    if (lite) lite.hidden = false; // 3D is running here, so offering the light version makes sense
  } catch (err) {
    console.warn('[DemocraClick] 3D unavailable, staying in 2D:', err);
    html.classList.add('no-webgl');
    $('#fallback-note')?.removeAttribute('hidden');
    clearTimeout(loaderCap); hideLoader();
    return;
  }

  S.mode = '3d';
  html.classList.add('webgl');
  scene.setTheme(S.theme, true);
  applyAccent(true);
  scene.setFog(TUNE.fog[S.world], true);

  // intro: HOME lights the scene word by word; any other entry point starts fully lit
  // HOME: the text is already on screen, so the scene lights up word by word behind it
  if (S.world === 'home' && !S.reduced) {
    const hv = scene.view('home');
    hv.dimForIntro();
    [0, 1, 2].forEach((i) => setTimeout(() => hv.light(i), 250 + i * 450));
  }
  scene.setWorld(S.world, { instant: true });
  if (S.world === 'partiti') { const v = scene.view('partiti'); v.setParties(parties.order(), THEMES); v.setSelection([]); }
  if (S.world !== 'home') UIS[S.world]?.sync?.(); // the DOM state was set before the 3D existed

  // pin the literal "Click" button to the glowing orb
  const P = {};
  scene.onFrame(() => {
    if (S.world === 'home') home.place(scene.ctx.project(scene.view('home').anchor, P));
  });

  // canvas input: hover, tap/click, gentle drag parallax
  const canvas = $('#agora');
  let hoverQueued = false, hp = null, drag = null;
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') scene.setParallax((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1, 0.05);
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 8) drag.moved = true;
      scene.setParallax(-dx / innerWidth * 2.2, -dy / innerHeight * 2.2, 0.14); // ±8°
    }
    hp = e;
    if (!hoverQueued) {
      hoverQueued = true;
      requestAnimationFrame(() => {
        hoverQueued = false;
        const hit = scene.pick(hp.clientX, hp.clientY);
        canvas.style.cursor = hit ? 'pointer' : '';
        window.__setCursorHover3D && window.__setCursorHover3D(!!hit);
        const v = scene.view(S.world);
        if (v && v.setHover) v.setHover(hit ? (hit.slot ?? hit.index ?? -1) : -1);
        showTip(hit ? UIS[S.world]?.tip?.(hit) : '', hp.clientX, hp.clientY);
      });
    }
  });
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') drag = { x: e.clientX, y: e.clientY, moved: false }; });
  addEventListener('pointerup', () => { if (drag) { drag = null; setTimeout(() => scene.setParallax(0, 0), 1200); } });
  canvas.addEventListener('pointerleave', () => { scene.view(S.world)?.setHover?.(-1); showTip('', 0, 0); });
  canvas.addEventListener('click', (e) => {
    if (drag && drag.moved) return;
    const hit = scene.pick(e.clientX, e.clientY);
    if (!hit) {
      scene.ripple(e.clientX, e.clientY, 0.35);
      UIS[S.world]?.onEmpty?.(); // e.g. PARTITI steps back, METODO advances, FONTI closes
      return;
    }
    if (hit.type === 'enter') { scene.ctx.shockwave(hit.point); navigate('partiti'); return; }
    scene.ripple(e.clientX, e.clientY, 0.6);
    const panel = UIS[S.world]?.onHit?.(hit);
    if (panel) document.dispatchEvent(new CustomEvent('dc:panel', { detail: panel }));
    showTip('', 0, 0);
  });

  // the HTML "Click" button also launches the shockwave
  home.enter?.addEventListener('click', () => { if (scene && !S.reduced) scene.ctx.shockwave(scene.view('home').anchor); });

  scene.start();
  requestAnimationFrame(() => { html.classList.add('scene-ready'); loaderProgress(1); clearTimeout(loaderCap); setTimeout(hideLoader, 250); });
}

boot();
