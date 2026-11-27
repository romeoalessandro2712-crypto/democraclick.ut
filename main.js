// main.js — boot, router, theme, language. Plain pages, no 3D: one section is shown at a time,
// the page scrolls normally, and the address (#partiti, #sondaggi…) works with back/forward.
import { applyI18n, initialLang, t, getLang } from './i18n.js';
import { PARTITI, THEMES, COLLECTED } from './data/partiti.js';
import { partitiUI } from './worlds/partiti.js';
import { datiUI } from './worlds/dati.js';
import { fontiUI } from './worlds/fonti.js';
import { metodoUI } from './worlds/metodo.js';
import { communityUI } from './worlds/community.js';
import { sondaggiUI } from './worlds/sondaggi.js';
import { SYMBOLS_NOTE } from './data/content.js';
import { UPDATED } from './data/edition.js';
import { feedHTML, railHTML } from './worlds/feed.js';

// ───────────────────────── SETTINGS ─────────────────────────
export const TUNE = {
  // polls: LIVE label while data is at most freshDays old; electionDate (YYYY-MM-DD) starts the
  // 15-day legal blackout on polls; feed = URL of a JSON shaped like data/sondaggi.js POLL (optional)
  polls: { freshDays: 8, electionDate: null, feed: null },
  // community: taking part needs a Google account. Paste your OAuth Web Client ID (Google Cloud
  // console → APIs & Services → Credentials) and the URL of your posts API. Until both are set the
  // section says the discussion is not active yet. topicFeed (optional) = JSON array shaped like
  // data/topic.js, to publish the daily topic without a rebuild. See INTEGRATION.md.
  community: { googleClientId: '[GOOGLE_CLIENT_ID_PLACEHOLDER]', endpoint: '[ENDPOINT_PLACEHOLDER]', topicFeed: null },
  // parties are always listed in alphabetical order (see Metodo)
  partiti: { order: 'alphabetical' },
};

const PAGES = ['home', 'partiti', 'sondaggi', 'community', 'dati', 'fonti', 'metodo'];
const html = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const S = { page: null, theme: 'light', keyboard: false };

const live = $('#live');
function announce(msg) { if (!live) return; live.textContent = ''; requestAnimationFrame(() => { live.textContent = msg; }); }

// ───────────────────────── PAGES ─────────────────────────
const UIS = {};
let parties;

function title(id) { return id === 'home' ? t('meta.title') : `${t(`nav.${id}`)} · DemocraClick`; }

function go(id, { focus = false, keepScroll = false } = {}) {
  if (!PAGES.includes(id)) id = 'home';
  if (id === S.page) return;
  const prev = S.page;
  S.page = id;
  html.dataset.page = id;
  PAGES.forEach((p) => { const el = document.getElementById(p); if (el) el.hidden = p !== id; });
  $$('a[data-world]').forEach((a) => { if (a.dataset.world === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (prev) UIS[prev]?.leave?.();
  UIS[id]?.enter?.();
  closeMore();
  if (!keepScroll) window.scrollTo(0, 0);
  document.title = title(id);
  if (prev) announce(t('world.now', { name: t(`nav.${id}`) }));
  if (focus) document.getElementById(id)?.querySelector('h1, h2')?.focus({ preventScroll: true });
}

function pageFromHash() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === '') return 'home';
  return PAGES.includes(h) ? h : null; // other anchors (e.g. #main) are ignored
}
window.addEventListener('hashchange', () => { const p = pageFromHash(); if (p) go(p, { focus: S.keyboard }); });

// ───────────────────────── THEME ─────────────────────────
function initialTheme() {
  try { const s = localStorage.getItem('dc-theme'); if (s === 'light' || s === 'dark') return s; } catch (e) { /* ignore */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function setTheme(theme, persist) {
  S.theme = theme;
  html.setAttribute('data-theme', theme);
  $$('#theme-toggle, .theme-toggle').forEach((b) => b.setAttribute('aria-pressed', String(theme === 'dark')));
  if (persist) { try { localStorage.setItem('dc-theme', theme); } catch (e) { /* ignore */ } }
  Object.values(UIS).forEach((u) => u.onThemeChange?.(theme));
}

// ───────────────────────── PHONE: "Altro" menu ─────────────────────────
const moreBtn = $('#more-btn'), moreMenu = $('#more-menu');
function closeMore() { if (moreMenu && !moreMenu.hidden) { moreMenu.hidden = true; moreBtn?.setAttribute('aria-expanded', 'false'); } }
moreBtn?.addEventListener('click', () => {
  const open = moreMenu.hidden;
  moreMenu.hidden = !open; moreBtn.setAttribute('aria-expanded', String(open));
  if (open) moreMenu.querySelector('a, button')?.focus();
});
document.addEventListener('click', (e) => { if (moreMenu && !moreMenu.hidden && !e.target.closest('#more-menu, #more-btn')) closeMore(); });

// ───────────────────────── BOOT ─────────────────────────
function boot() {
  setTheme(initialTheme());
  applyI18n(initialLang());

  parties = partitiUI({
    root: $('#partiti'), parties: PARTITI, themes: THEMES, t, getLang, announce,
    onChange() { /* the card re-renders itself; scroll it into view on phones */
      const panel = $('#party-panel');
      if (panel && !panel.hidden && innerWidth < 1000) panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    },
    onHover() {},
    orderMode: TUNE.partiti.order,
  });
  const ui = (id) => ({ root: $(`#${id}`), t, getLang, announce, tune: TUNE, view: () => null });
  UIS.partiti = parties;
  UIS.sondaggi = sondaggiUI(ui('sondaggi'));
  UIS.community = communityUI(ui('community'));
  UIS.dati = datiUI(ui('dati'));
  UIS.fonti = fontiUI(ui('fonti'));
  UIS.metodo = metodoUI(ui('metodo'));

  // the controls live in the side menu; on phones the same controls appear in the "Altro" menu
  const ctl = $('.side .controls');
  if (ctl && $('#more-ctl')) {
    const copy = ctl.cloneNode(true);
    copy.querySelector('#theme-toggle')?.removeAttribute('id');
    copy.querySelector('button[aria-pressed]')?.classList.add('theme-toggle');
    $('#more-ctl').appendChild(copy);
  }
  $$('#theme-toggle, .theme-toggle').forEach((b) => b.addEventListener('click', () => setTheme(S.theme === 'dark' ? 'light' : 'dark', true)));
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => applyI18n(b.dataset.lang)));

  const furniture = () => {
    const lang = getLang(), loc = lang === 'en' ? 'en-GB' : 'it-IT';
    const feed = $('#feed'); if (feed) feed.innerHTML = feedHTML(t, lang);
    const rail = $('#rail'); if (rail) rail.innerHTML = railHTML(t, lang);
    const fu = $('#foot-upd'); if (fu) fu.textContent = t('footer.updated', { d: new Date(`${UPDATED}T12:00:00`).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) });
    const el = $('#collected'); if (el) el.textContent = t('partiti.collected', { d: COLLECTED[lang] || COLLECTED.it });
    const sn = $('#symbols-note'); if (sn) sn.textContent = SYMBOLS_NOTE[lang] || SYMBOLS_NOTE.it;
  };
  furniture();
  document.addEventListener('dc:lang', () => {
    furniture();
    Object.values(UIS).forEach((u) => u.rerender?.());
    document.title = title(S.page || 'home');
  });

  // links that open a specific party card (HOME party grid)
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('[data-party]');
    if (!a) return;
    e.preventDefault();
    if (S.page !== 'partiti') { location.hash = 'partiti'; go('partiti'); }
    const slot = parties.order().findIndex((p) => p.id === a.dataset.party);
    if (slot >= 0) parties.toggle(slot);
  });
  // "Correzioni" links open the public record in FONTI
  document.addEventListener('click', (e) => {
    if (!e.target.closest?.('[data-open-registro]')) return;
    setTimeout(() => { const r = $('#registro'); if (r) { r.open = true; r.scrollIntoView({ block: 'start' }); r.querySelector('summary')?.focus({ preventScroll: true }); } }, 60);
  });
  $('.skip')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(S.page)?.querySelector('h1, h2')?.focus(); });

  addEventListener('keydown', (e) => {
    S.keyboard = true;
    if (e.key === 'Escape') { if (moreMenu && !moreMenu.hidden) { closeMore(); moreBtn?.focus(); return; } if (UIS[S.page]?.onEscape?.()) e.preventDefault(); }
  });
  addEventListener('pointerdown', () => { S.keyboard = false; }, { passive: true });

  go(pageFromHash() || 'home', { keepScroll: true });
}

boot();
