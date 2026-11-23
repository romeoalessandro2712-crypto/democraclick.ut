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
    id: '2026-11-23-patrimoniale',
    date: '2026-11-23',
    area: { it: 'Fisco', en: 'Taxation' },
    title: {
      it: 'Tassa sui grandi patrimoni: le posizioni dei partiti dopo la proposta di Schlein',
      en: 'A tax on large fortunes: where the parties stand after Schlein’s proposal',
    },
    summary: {
      it: 'Il 22 novembre, al summit di Parigi contro le oligarchie, la segretaria del PD Elly Schlein ha sostenuto lo schema proposto da Zucman: un contributo del 2% sui patrimoni superiori a 100 milioni di euro. Secondo ANSA, AGI e Adnkronos, la proposta ha diviso gli alleati del centrosinistra ed è stata criticata da Forza Italia. Secondo ANSA, il tema è all’ordine del giorno del tavolo del programma del centrosinistra lunedì 23 novembre.',
      en: 'On 22 November, at the Paris summit against oligarchy, PD leader Elly Schlein backed the scheme proposed by Zucman: a 2% contribution on fortunes above 100 million euros. According to ANSA, AGI and Adnkronos, the proposal divided the centre-left allies and was criticised by Forza Italia. According to ANSA, the issue is on the agenda of the centre-left programme table on Monday 23 November.',
    },
    points: [
      { it: 'PD: Schlein ha detto «Appoggiamo la proposta di Zucman» e «Noi non tasseremo il ceto medio» (AGI).', en: 'PD: Schlein said “We support Zucman’s proposal” and “We will not tax the middle class” (AGI).' },
      { it: 'AVS: secondo ANSA chiede un’imposta progressiva sui patrimoni oltre 5,4 milioni e ritiene troppo alta la soglia di 100 milioni; secondo AGI Nicola Fratoianni ha detto nei giorni scorsi «Senza patrimoniale non c’è coalizione».', en: 'AVS: according to ANSA it wants a progressive tax on wealth above 5.4 million and considers the 100 million threshold too high; according to AGI, Nicola Fratoianni said in recent days “Without a wealth tax there is no coalition”.' },
      { it: 'Movimento 5 Stelle: secondo AGI Giuseppe Conte ritiene un errore una patrimoniale sui grandi patrimoni perché potrebbe spingere gli investimenti fuori dall’Italia; secondo Adnkronos il M5S ha avanzato proposte sui redditi finanziari.', en: 'Five Star Movement: according to AGI, Giuseppe Conte considers a tax on large fortunes a mistake because it could push investment out of Italy; according to Adnkronos, the M5S has put forward proposals on financial income.' },
      { it: 'Italia Viva e +Europa: secondo ANSA Matteo Renzi sostiene che le tasse vadano ridotte, non aumentate, e +Europa è «molto tiepida».', en: 'Italia Viva and +Europa: according to ANSA, Matteo Renzi argues taxes should be cut, not raised, and +Europa is “very lukewarm”.' },
      { it: 'Forza Italia: secondo ANSA Antonio Tajani ha affermato che «Il Pd si mette al servizio dell’internazionale delle tasse». Schlein ha replicato che Tajani «ha alzato le tasse agli italiani», citando dati Istat sulla pressione fiscale (Adnkronos).', en: 'Forza Italia: according to ANSA, Antonio Tajani said that “the PD is putting itself at the service of the tax international”. Schlein replied that Tajani “raised taxes on Italians”, citing Istat data on the tax burden (Adnkronos).' },
    ],
    question: {
      it: 'Quale ruolo dovrebbe avere, secondo te, la tassazione dei grandi patrimoni nel sistema fiscale italiano?',
      en: 'In your view, what role should the taxation of large fortunes play in Italy’s tax system?',
    },
    links: [
      { label: { it: 'ANSA: alleati tiepidi sulla «patrimoniale» di Schlein, e Tajani la attacca (22/11)', en: 'ANSA: allies lukewarm on Schlein’s wealth tax, Tajani attacks it (22/11, in Italian)' }, host: 'www.ansa.it', url: 'https://www.ansa.it/sito/notizie/politica/2026/11/22/alleati-tiepidi-sulla-patrimoniale-di-schlein-e-tajani-la-attacca_8832c861-009e-4826-9077-8b8df8ecc0e3.html' },
      { label: { it: 'AGI: patrimoniale, Schlein rilancia il 2% sopra i 100 milioni (22/11)', en: 'AGI: wealth tax, Schlein backs 2% above 100 million (22/11, in Italian)' }, host: 'www.agi.it', url: 'https://www.agi.it/politica/news/2026-11-22/patrimoniale-schlein-avs-zucman-campo-largo-40136439/' },
      { label: { it: 'Adnkronos: patrimoniale, botta e risposta Tajani-Schlein (22/11)', en: 'Adnkronos: wealth tax, Tajani–Schlein exchange (22/11, in Italian)' }, host: 'www.adnkronos.com', url: 'https://www.adnkronos.com/politica/patrimoniale-scontro-tajani-schlein-tasse-summit-parigi_14soFXa3cTLafxQUavV98s' },
    ],
    checked: '2026-11-23',
  },
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
