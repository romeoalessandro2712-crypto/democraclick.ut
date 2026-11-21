// data/sondaggi.js — voting intentions for the next Italian general election.
// Figures exactly as published by the Supermedia YouTrend/Agi (a weighted average of polls),
// data as of 19 November 2026, published 20 November 2026. Collected by Claude via web search
// on 20 November 2026. Update this file (or point TUNE.polls.feed at a JSON with the same shape)
// when a new Supermedia comes out.

export const POLL = {
  source: {
    name: 'Supermedia YouTrend/Agi',
    dataDate: '2026-11-19',
    published: '2026-11-20',
    window: { from: '2026-11-05', to: '2026-11-18' }, // "sondaggi realizzati dal 5 al 18 novembre"
    method: {
      it: 'Media ponderata dei sondaggi nazionali sulle intenzioni di voto, pesati per ampiezza del campione, data di realizzazione e metodo di raccolta.',
      en: 'Weighted average of national voting-intention polls, weighted by sample size, fieldwork date and data-collection method.',
    },
    // institutes and the publication dates of their polls, as listed by the source
    institutes: [['Eumetra', '12/11'], ['Ixè', '11/11'], ['Noto', '5/11'], ['Only Numbers', '6/11, 12/11'], ['SWG', '9/11, 16/11'], ['YouTrend', '11/11, 17/11']],
    links: [
      ['Supermedia YouTrend/Agi, 19/11/2026 (Agenzia Giornalistica Opinione)', 'https://www.agenziagiornalisticaopinione.it/lancio-dagenzia/supermedia-youtrend-agi-intenzioni-di-voto-19-11-2026-fdi-278-pd-205-m5s-128-fi-71-fn-65-avs-62-lega-56/'],
      ['YouTrend: Supermedia', 'https://www.youtrend.it/2026/11/02/supermedia-youtrend-agi-fdi-sale-al-279-cala-futuro-nazionale/'],
    ],
  },
  // id matches data/partiti.js where the party has a card; others get a monogram
  parties: [
    { id: 'fdi', label: 'FdI', pct: 27.8, delta: -0.1 },
    { id: 'pd', label: 'PD', pct: 20.5, delta: 0.3 },
    { id: 'm5s', label: 'M5S', pct: 12.8, delta: -0.3 },
    { id: 'fi', label: 'FI', pct: 7.1, delta: 0.1 },
    { id: 'fn', label: 'FN', pct: 6.5, delta: -0.4 },
    { id: 'avs', label: 'AVS', pct: 6.2, delta: -0.1 },
    { id: 'lega', label: 'Lega', pct: 5.6, delta: -0.1 },
    { id: 'azione', label: 'Azione', pct: 3.2, delta: 0 },
    { id: 'iv', label: 'IV', pct: 2.4, delta: 0.1 },
    { id: 'piueuropa', label: '+E', pct: 1.2, delta: -0.3 },
    { id: 'nm', label: 'NM', name: 'Noi Moderati', pct: 1.0, delta: 0 },
    // "SCN" in the Supermedia; AGI's 12/11 Supermedia names Sud chiama Nord in the centre-right
    { id: 'scn', label: 'SCN', name: 'Sud chiama Nord', pct: 1.0, delta: null },
  ],
  deltaNote: { it: 'Variazione rispetto alla Supermedia del 5 novembre.', en: 'Change from the 5 November Supermedia.' },
};

// Coalition make-up as listed by Euromedia Research for PiazzaPulita (La7), data of 11/11/2026.
// (Correction 21/11: the 19/11 Supermedia DOES publish coalition figures, see COALITIONS below.)
export const BLOCS = {
  cs: { label: { it: 'Centrosinistra', en: 'Centre-left' }, members: ['pd', 'm5s', 'avs', 'iv', 'piueuropa'] },
  cd: { label: { it: 'Centrodestra', en: 'Centre-right' }, members: ['fdi', 'fi', 'lega', 'nm', 'scn'] },
};
export const OUTSIDE = ['fn', 'azione'];
export const BLOC_SOURCE = ['Euromedia Research per PiazzaPulita, dati all’11/11/2026 (StrettoWeb)', 'https://www.strettoweb.com/2026/11/sondaggi-politici-testa-a-testa-tra-centrodestra-e-centrosinistra-cresce-meloni-cala-vannacci-bene-anche-de-luca-dati/2179620/'];

// Other recent polls, for context (each institute measures differently)
export const OTHER_POLLS = [
  { who: 'YouTrend per Sky TG24', date: '18/11/2026', cs: 45.0, cd: 40.8, cdfn: 47.4, url: 'https://adnkronos.com/politica/sondaggio-elezioni-youtrend-sky-tg24_3HMZ4mZ1SbEvTPCve4wwXe' },
  { who: 'Euromedia Research per PiazzaPulita', date: '11/11/2026', cs: 44.1, cd: 44.0, cdfn: null, url: BLOC_SOURCE[1] },
];

// Electoral law ("Stabilicum"): approved by the Chamber on 8/10/2026, promulgated 9/10/2026.
export const LAW = {
  bonusThreshold: 42, bonusChamber: 70, bonusSenate: 35, capChamber: 220, capSenate: 113,
  listThreshold: 3, coalitionThreshold: 10,
  links: [
    ['Pagella Politica: cosa prevede lo Stabilicum', 'https://pagellapolitica.it/articoli/approvata-legge-elettorale-stabilicum-cosa-prevede'],
    ['Adnkronos: le novità dello Stabilicum', 'https://www.adnkronos.com/cronaca/legge-elettorale-novita-stabilicum_6doJ1erPyV74pA93Zk2NkI'],
    ['Money.it: la nuova legge elettorale in 10 punti', 'https://www.money.it/nuova-legge-elettorale-2026-cosa-prevede-le-novita-in-10-punti'],
    ['Quotidiano.net: Mattarella ha promulgato la legge elettorale', 'https://www.quotidiano.net/politica/mattarella-ha-promulgato-la-legge-elettorale-k4h7v22a'],
  ],
};

// Coalition figures published WITH the Supermedia of 19/11/2026 (as reported by Lettera43, 19/11).
// They are the Supermedia's own coalition estimates, not sums: the campo largo figure (44,7) is higher
// than the sum of its listed parties (43,1) because, according to AGI, the coalition also includes
// minor lists (e.g. Progetto Civico, Avanti-PSI) whose make-up is still being defined.
export const COALITIONS = {
  date: '2026-11-19',
  cl: { label: { it: 'Campo largo', en: 'Campo largo (broad centre-left)' }, pct: 44.7, delta: -0.3, members: ['pd', 'm5s', 'avs', 'iv', 'piueuropa'] },
  cd: { label: { it: 'Centrodestra', en: 'Centre-right' }, pct: 42.5, delta: null, members: ['fdi', 'fi', 'lega', 'nm', 'scn'] },
  def: {
    it: 'Campo largo è il nome giornalistico dell’alleanza di centrosinistra. Nella Supermedia comprende PD, Movimento 5 Stelle, AVS e liste minori; secondo AGI l’organizzazione e le alleanze di alcune liste minori sono ancora in via di definizione. Le schede di composizione qui sotto seguono Euromedia Research (dati all’11/11), che vi include anche Italia Viva e +Europa.',
    en: '“Campo largo” (broad field) is the press name for the centre-left alliance. In the Supermedia it includes the PD, the Five Star Movement, AVS and minor lists; according to AGI the organisation and alliances of some minor lists are still being defined. The make-up below follows Euromedia Research (data of 11/11), which also includes Italia Viva and +Europa.',
  },
  links: [
    ['Lettera43: la Supermedia del 19 novembre, campo largo avanti di due punti', 'https://www.lettera43.it/sondaggi-politici-supermedia-19-novembre-campo-largo-avanti-due-punti-centrodestra/'],
    ['AGI: Supermedia del 29 ottobre (composizione del campo largo, liste minori, PLD)', 'https://www.agi.it/politica/news/2026-10-29/supermedia-pari-centrodestra-centrosinistra-vannacci-scende-39764231/'],
  ],
};

// Parties used in the simulations that the 19/11 Supermedia does not report. pct: null = no figure
// (never replaced by a guess). PLD = Partito Liberaldemocratico: last Supermedia figure we found is
// 1,3% on 29/10, and AGI reports rumours of it joining the centre-right; neither is used here.
export const EXTRA = [{ id: 'pld', label: 'PLD', name: 'Partito Liberaldemocratico', pct: null }];

// "Simulazioni con il centro": arithmetic sums of reported figures. Not coalition polls; they do not
// consider how votes could shift after an agreement. Each part: ['coal'|'party'|'sim', id, sign].
export const SIMS = [
  { id: 'cdfn', title: { it: 'Centrodestra + Futuro Nazionale', en: 'Centre-right + Futuro Nazionale' }, parts: [['coal', 'cd'], ['party', 'fn']] },
  { id: 'centro', title: { it: 'Centro autonomo: Azione + PLD', en: 'Stand-alone centre: Azione + PLD' }, parts: [['party', 'azione'], ['party', 'pld']] },
  { id: 'centrox', title: { it: 'Centro allargato con Italia Viva e +Europa', en: 'Wider centre with Italia Viva and +Europa' }, parts: [['party', 'azione'], ['party', 'pld'], ['party', 'iv'], ['party', 'piueuropa']] },
  { id: 'cdcentro', title: { it: 'Centrodestra + centro allargato', en: 'Centre-right + wider centre' }, parts: [['coal', 'cd'], ['sim', 'centrox']] },
  { id: 'clnet', title: { it: 'Campo largo al netto di Italia Viva e +Europa', en: 'Campo largo without Italia Viva and +Europa' }, parts: [['coal', 'cl'], ['party', 'iv', -1], ['party', 'piueuropa', -1]] },
  { id: 'csxcentro', title: { it: 'Centrosinistra netto + centro allargato', en: 'Net centre-left + wider centre' }, parts: [['sim', 'clnet'], ['sim', 'centrox']] },
];

const r1 = (x) => Math.round(x * 10) / 10;
export const pctOf = (id) => (POLL.parties.find((p) => p.id === id) || { pct: 0 }).pct;
export const sumOf = (ids) => r1(ids.reduce((a, id) => a + pctOf(id), 0));
export const OTHERS = r1(100 - POLL.parties.reduce((a, p) => a + p.pct, 0)); // parties not listed by the source

/** Value of a party / coalition / simulation. Returns { v, missing: [party ids with no figure] }. */
export function valueOf(kind, id) {
  if (kind === 'coal') return { v: COALITIONS[id].pct, missing: [] };
  if (kind === 'party') {
    const p = POLL.parties.find((x) => x.id === id) || EXTRA.find((x) => x.id === id);
    return p && p.pct != null ? { v: p.pct, missing: [] } : { v: 0, missing: [id] };
  }
  const sim = SIMS.find((x) => x.id === id);
  let v = 0; const missing = [];
  sim.parts.forEach(([k, pid, sign = 1]) => { const r = valueOf(k, pid); v += sign * r.v; missing.push(...r.missing); });
  return { v: r1(v), missing: [...new Set(missing)] };
}
