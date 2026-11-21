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
