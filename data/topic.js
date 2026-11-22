// data/topic.js — "Tema del giorno": one current topic per day for the COMMUNITY discussion.
// Add a new entry on top each day (newest first). The page shows the newest entry whose date is
// today or earlier, and always prints its date, so an old topic is never presented as today's.
// Rules for writing an entry (same as the rest of the site):
//   • describe the facts, do not take a side; attribute positions to who holds them
//   • every fact must come from the linked sources; write "secondo …" when only the press reports it
//   • the question must be open (no yes/no that favours one side)
// TUNE.community.topicFeed can point to a JSON array with the same shape to update without a rebuild.

export const TOPICS = [
  {
    id: '2026-11-22-manovra',
    date: '2026-11-22',
    area: { it: 'Economia e conti pubblici', en: 'Economy and public finances' },
    title: {
      it: 'Manovra 2027: la maggioranza tratta su exit tax e pensioni',
      en: '2027 budget: the majority negotiates on the exit tax and pensions',
    },
    summary: {
      it: 'La legge di bilancio per il 2027 è all’esame della Commissione Bilancio della Camera, dove sono stati presentati circa 6.600 emendamenti. Secondo AGI, lunedì 23 novembre la Commissione stabilirà quali testi non sono ammissibili e giovedì 26 i partiti dovrebbero indicare gli emendamenti segnalati. Secondo ANSA, nella maggioranza restano aperti diversi nodi e la prossima settimana è atteso un nuovo vertice dei leader.',
      en: 'The 2027 budget law is being examined by the Chamber’s Budget Committee, where about 6,600 amendments have been filed. According to AGI, on Monday 23 November the Committee will decide which texts are inadmissible, and on Thursday 26 the parties are expected to name their priority amendments. According to ANSA, several issues remain open within the majority and a new leaders’ meeting is expected next week.',
    },
    points: [
      { it: 'Exit tax (l’imposta sulle plusvalenze per chi sposta la residenza fiscale all’estero): secondo ANSA un compromesso potrebbe essere l’emendamento di FdI che alza la soglia a 2 milioni; Forza Italia propone 5 milioni; la Lega chiede di escludere le partecipazioni in start up e PMI innovative.', en: 'Exit tax (the capital-gains tax on those who move their tax residence abroad): according to ANSA a compromise could be the FdI amendment raising the threshold to 2 million; Forza Italia proposes 5 million; the Lega asks to exclude stakes in start-ups and innovative SMEs.' },
      { it: 'Pensioni: secondo ANSA il fondo da 850 milioni è conteso. La Lega vuole usarlo per «quota 64»; FdI, con un emendamento, propone di attingervi per riaprire Opzione Donna per caregiver, donne disabili e disoccupate.', en: 'Pensions: according to ANSA the 850 million fund is contested. The Lega wants to use it for “quota 64”; FdI, with an amendment, proposes drawing on it to reopen “Opzione Donna” for carers, disabled women and unemployed women.' },
      { it: 'Sanità: secondo AGI le Regioni chiedono almeno 500 milioni in più e il tema è ancora in discussione tra i leader del centrodestra.', en: 'Health: according to AGI the Regions ask for at least 500 million more, and the issue is still under discussion among the centre-right leaders.' },
      { it: 'Tra gli emendamenti delle opposizioni, AGI segnala la proposta del PD di revocare tutti i finanziamenti per il Ponte sullo Stretto.', en: 'Among the opposition amendments, AGI reports the PD’s proposal to revoke all funding for the Strait of Messina bridge.' },
    ],
    question: {
      it: 'Quali modifiche alla legge di bilancio ritieni più importanti, e con quali risorse andrebbero finanziate?',
      en: 'Which changes to the budget law do you consider most important, and how should they be funded?',
    },
    links: [
      { label: { it: 'Camera dei deputati: dossier sulla legge di bilancio 2027 (documento ufficiale)', en: 'Chamber of Deputies: dossier on the 2027 budget law (official document)' }, host: 'temi.camera.it', url: 'https://temi.camera.it/leg19/dossier/OCD18-23875/legge-bilancio-2027-profili-finanziari-vol-1.html' },
      { label: { it: 'ANSA: maggioranza verso l’intesa sulla exit tax, resta il nodo pensioni (21/11)', en: 'ANSA: majority nears a deal on the exit tax, pensions still open (21/11, in Italian)' }, host: 'www.ansa.it', url: 'https://www.ansa.it/sito/notizie/politica/2026/11/21/manovra-maggioranza-verso-lintesa-sulla-exit-tax-resta-il-nodo-pensioni_eaa34634-ed55-4417-82fe-031e30349e39.html' },
      { label: { it: 'AGI: 6.600 emendamenti, pensioni, condono, exit tax (21/11)', en: 'AGI: 6,600 amendments, pensions, amnesty, exit tax (21/11, in Italian)' }, host: 'www.agi.it', url: 'https://www.agi.it/economia/news/2026-11-21/manovra-emendamenti-pensioni-condono-exit-tax-40135099/' },
    ],
    checked: '2026-11-22',
  },
  {
    id: '2026-11-21-manovra',
    date: '2026-11-21',
    area: { it: 'Economia e conti pubblici', en: 'Economy and public finances' },
    title: {
      it: 'Manovra 2027: circa 6.600 emendamenti alla Camera',
      en: '2027 budget: about 6,600 amendments in the Chamber',
    },
    summary: {
      it: 'Il disegno di legge di bilancio per il 2027 (A.C. 3174-bis) è all’esame della Commissione Bilancio della Camera. Entro la scadenza del 17 novembre sono stati depositati circa 6.600 emendamenti, secondo i conteggi riportati dalla stampa: circa 2.000 dalla maggioranza, circa 1.600 dal PD e 1.500 dal Movimento 5 Stelle.',
      en: 'The 2027 budget bill (A.C. 3174-bis) is being examined by the Chamber’s Budget Committee. By the 17 November deadline about 6,600 amendments had been filed, according to press counts: about 2,000 from the majority, about 1,600 from the PD and 1,500 from the Five Star Movement.',
    },
    // what is on the table, attributed
    points: [
      { it: 'Nella maggioranza, secondo le cronache, restano aperti i nodi su pensioni, fondi per la sanità, tassazione delle banche e Superbonus.', en: 'Within the majority, according to press reports, pensions, health funding, bank taxation and the Superbonus are still open issues.' },
      { it: 'PD e Movimento 5 Stelle chiedono, tra l’altro, più risorse per la sanità e propongono il salario minimo.', en: 'The PD and the Five Star Movement ask, among other things, for more health funding and propose a minimum wage.' },
      { it: 'Per molti emendamenti, riferiscono le stesse fonti, le coperture finanziarie non sono ancora state individuate.', en: 'For many amendments, the same sources report, the funding has not yet been identified.' },
    ],
    question: {
      it: 'Su quali priorità dovrebbe concentrarsi la legge di bilancio, e dove andrebbero trovate le risorse?',
      en: 'Which priorities should the budget law focus on, and where should the money come from?',
    },
    links: [
      { label: { it: 'Camera dei deputati: dossier sulla legge di bilancio 2027 (documento ufficiale)', en: 'Chamber of Deputies: dossier on the 2027 budget law (official document)' }, host: 'temi.camera.it', url: 'https://temi.camera.it/leg19/dossier/OCD18-23875/legge-bilancio-2027-profili-finanziari-vol-1.html' },
      { label: { it: 'Adnkronos: la valanga di emendamenti in Commissione Bilancio (17/11)', en: 'Adnkronos: the flood of amendments in the Budget Committee (17/11, in Italian)' }, host: 'adnkronos.com', url: 'https://www.adnkronos.com/economia/manovra-legge-di-bilancio-emendamenti-ultime-notizie_7fKXgC6R7y2gpDXG9N7deK' },
      { label: { it: 'Metro: 6.600 proposte, i nodi da sciogliere (20/11)', en: 'Metro: 6,600 proposals, the open issues (20/11, in Italian)' }, host: 'metrotoday.it', url: 'https://metrotoday.it/manovra-6-600-proposte-e-una-partita-aperta-sulle-coperture' },
    ],
    checked: '2026-11-21', // when DemocraClick read the sources
  },
];

/** Newest topic dated today or earlier (local date). Falls back to the newest one. */
export function currentTopic(list = TOPICS, now = new Date()) {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const sorted = [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  return sorted.find((x) => x.date <= today) || sorted[sorted.length - 1];
}

export const isToday = (topic, now = new Date()) => {
  const d = new Date(`${topic.date}T12:00:00`);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};
