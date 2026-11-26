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
    id: '2026-11-26-manovra-vertice-superbonus',
    date: '2026-11-26',
    area: { it: 'Legge di bilancio', en: 'Budget law' },
    title: {
      it: 'Manovra, vertice di maggioranza a Palazzo Chigi: sul tavolo Superbonus, pensioni, sanità e condono',
      en: 'Budget: majority summit at Palazzo Chigi on the Superbonus, pensions, health and the building amnesty',
    },
    summary: {
      it: 'Secondo AGI, il 25 novembre si è svolto a Palazzo Chigi un vertice di maggioranza con la presidente del Consiglio Giorgia Meloni, i vicepremier Antonio Tajani e Matteo Salvini, il leader di Noi Moderati Maurizio Lupi e il ministro dell’Economia Giancarlo Giorgetti. Secondo AGI, sanità, pensioni e Superbonus restano i principali nodi della legge di bilancio 2027. Secondo ANSA e Adnkronos, la maggioranza valuta di eliminare la norma che spalma su dieci anni i crediti residui del Superbonus; non risulta ancora una decisione. Secondo AGI, la commissione Bilancio della Camera ha fissato il calendario: votazioni da giovedì 3 dicembre, esame degli emendamenti da concludere entro martedì 15 dicembre.',
      en: 'According to AGI, a majority summit was held at Palazzo Chigi on 25 November with Prime Minister Giorgia Meloni, deputy prime ministers Antonio Tajani and Matteo Salvini, Noi Moderati leader Maurizio Lupi and Economy Minister Giancarlo Giorgetti. According to AGI, health, pensions and the Superbonus remain the main open issues of the 2027 budget law. According to ANSA and Adnkronos, the majority is considering scrapping the rule that spreads the remaining Superbonus credits over ten years; no decision has been reported yet. According to AGI, the Chamber’s Budget Committee set its timetable: votes from Thursday 3 December, with the examination of amendments to be completed by Tuesday 15 December.',
    },
    points: [
      { it: 'Superbonus: Maurizio Lupi (Noi Moderati): «Speriamo rimanga la vecchia norma. Però vediamo» (AGI); secondo ANSA, Lupi ha detto: «Stiamo lavorando per cancellarlo», riferito allo spalma crediti.', en: 'Superbonus: Maurizio Lupi (Noi Moderati): “we hope the old rule stays. But we’ll see” (AGI); according to ANSA, Lupi said “we are working to cancel it”, referring to the credit-spreading rule.' },
      { it: 'Condono: secondo AGI e Adnkronos, Lupi ha detto che la proposta, a cui lavora Matteo Salvini (Lega), arriverà nei prossimi giorni; secondo ANSA, Antonio Tajani (Forza Italia) ha detto: «Non sarà senza limiti».', en: 'Building amnesty: according to AGI and Adnkronos, Lupi said the proposal, being drafted by Matteo Salvini (Lega), will come in the next few days; according to ANSA, Antonio Tajani (Forza Italia) said: “it will not be without limits”.' },
      { it: 'Giuseppe Conte, presidente del Movimento 5 Stelle: «È una manovra da campagna elettorale» e «il condono non può essere una soluzione per far cassa» (AGI).', en: 'Giuseppe Conte, president of the Five Star Movement: “it is an election-campaign budget” and “the amnesty cannot be a way to raise cash” (AGI).' },
      { it: 'Secondo ANSA, le opposizioni non ridurranno i loro emendamenti con il meccanismo dei «super segnalati»; Elena Bonetti (Azione): «Va garantito uno svolgimento corretto dei lavori», linea che secondo lei condividono anche PD, M5S, AVS e IV.', en: 'According to ANSA, the opposition will not cut its amendments through the “super-flagged” mechanism; Elena Bonetti (Azione): “the work must be conducted properly”, a line she said PD, M5S, AVS and IV also share.' },
      { it: 'Secondo Adnkronos, dopo l’esame in commissione il testo è atteso in Aula alla Camera venerdì 18 dicembre.', en: 'According to Adnkronos, after the committee stage the bill is expected on the Chamber floor on Friday 18 December.' },
    ],
    question: {
      it: 'Secondo te, come andrebbero bilanciate la certezza delle regole per chi ha già usato un’agevolazione e le esigenze dei conti pubblici?',
      en: 'In your view, how should certainty of the rules for those who have already used a tax incentive be balanced against the needs of the public finances?',
    },
    links: [
      { label: { it: 'AGI: manovra, nuovo vertice: i nodi di sanità, pensioni e Superbonus (25/11)', en: 'AGI: budget, new summit on health, pensions and the Superbonus (25/11, in Italian)' }, host: 'www.agi.it', url: 'https://www.agi.it/economia/news/2026-11-25/manovra-vertice-centrodestra-pensioni-superbonus-40191262/' },
      { label: { it: 'ANSA: verso la retromarcia sul Superbonus, via lo spalma crediti (25/11)', en: 'ANSA: towards a U-turn on the Superbonus credit-spreading rule (25/11, in Italian)' }, host: 'www.ansa.it', url: 'https://www.ansa.it/sito/notizie/politica/2026/11/25/verso-la-retromarcia-sul-superbonus-via-lo-spalma-crediti_89646261-4185-4169-ae7b-46ca88eab534.html' },
      { label: { it: 'ANSA: le opposizioni attaccano sulla manovra, «non faremo super segnalati» (25/11)', en: 'ANSA: the opposition attacks on the budget, “we won’t do super-flagged amendments” (25/11, in Italian)' }, host: 'ansa.it', url: 'https://ansa.it/sito/notizie/topnews/2026/11/25/le-opposizioni-attaccano-sulla-manovra-non-faremo-super-segnalati_ac2c08f1-cfdd-4ba5-a504-5b7737742089.html' },
      { label: { it: 'Adnkronos: manovra, possibile stop allo spalma-crediti del Superbonus (25/11)', en: 'Adnkronos: budget, possible stop to the Superbonus credit-spreading rule (25/11, in Italian)' }, host: 'www.adnkronos.com', url: 'https://www.adnkronos.com/economia/manovra-maggioranza-accelera-su-modifiche-possibile-stop-spalma-crediti-superbonus_SyQlsTeJZ0z3ma4ZBQM6D' },
    ],
    checked: '2026-11-26',
  },
  {
    id: '2026-11-25-manovra-emendamenti',
    date: '2026-11-25',
    area: { it: 'Legge di bilancio', en: 'Budget law' },
    title: {
      it: 'Manovra alla Camera: la commissione Bilancio scarta oltre 1.700 emendamenti, il testo in Aula dal 18 dicembre',
      en: 'Budget at the Chamber: the Budget Committee rules out more than 1,700 amendments, the bill reaches the floor on 18 December',
    },
    summary: {
      it: 'Secondo ANSA, AGI e Adnkronos, la commissione Bilancio della Camera ha dichiarato inammissibili oltre 1.700 emendamenti alla legge di bilancio 2027, circa un quarto di quelli presentati. Secondo Adnkronos, i gruppi dovranno indicare entro giovedì 26 novembre alle 14 un totale di 700 emendamenti «segnalati». Secondo ANSA e Adnkronos, la commissione dovrà chiudere i lavori il 16 dicembre e il testo dovrebbe arrivare in Aula il 18 dicembre. Sul possibile condono edilizio, maggioranza e opposizione hanno posizioni diverse.',
      en: 'According to ANSA, AGI and Adnkronos, the Chamber’s Budget Committee declared more than 1,700 amendments to the 2027 budget law inadmissible, about a quarter of those tabled. According to Adnkronos, the groups must pick a total of 700 “flagged” amendments by 2 pm on Thursday 26 November. According to ANSA and Adnkronos, the committee must finish its work on 16 December and the bill is expected on the floor on 18 December. On a possible building amnesty, the majority and the opposition hold different positions.',
    },
    points: [
      { it: 'Tra gli emendamenti dichiarati inammissibili c’è quello della Lega che aumentava l’Ires per le banche (ANSA, AGI).', en: 'Among the amendments ruled inadmissible is the Lega’s proposal to raise the corporate tax (Ires) on banks (ANSA, AGI).' },
      { it: 'L’emendamento di Fratelli d’Italia sulla exit tax, che secondo Adnkronos alza la soglia dei redditi da 800mila a 2 milioni, era stato scartato (AGI) ed è stato riammesso dopo il ricorso (ANSA, Adnkronos).', en: 'The Brothers of Italy amendment on the exit tax, which according to Adnkronos raises the income threshold from 800,000 to 2 million, had been ruled out (AGI) and was readmitted after an appeal (ANSA, Adnkronos).' },
      { it: 'Condono: secondo ANSA e Adnkronos, Matteo Salvini (Lega) ha detto che sul tema ci sarà di certo un emendamento della maggioranza.', en: 'Building amnesty: according to ANSA and Adnkronos, Matteo Salvini (Lega) said a majority amendment on the issue will certainly be tabled.' },
      { it: 'Elly Schlein (PD): «Trovo incredibile che il governo stia parlando di condono» (ANSA, Adnkronos).', en: 'Elly Schlein (PD): “I find it incredible that the government is talking about an amnesty” (ANSA, Adnkronos).' },
      { it: 'Per i Comuni, il presidente dell’ANCI Gaetano Manfredi: «Non possiamo far ricadere sui Comuni problemi che sono decennali»; secondo ANSA e Adnkronos, il governo si è detto disponibile a verificare margini per gli enti locali durante l’esame della manovra.', en: 'For the municipalities, ANCI president Gaetano Manfredi: “we cannot pass problems that are decades old onto the municipalities”; according to ANSA and Adnkronos, the government said it was willing to look for room for local authorities during the budget’s examination.' },
    ],
    question: {
      it: 'Quali criteri dovrebbero guidare, secondo te, la scelta delle modifiche da apportare alla legge di bilancio in Parlamento?',
      en: 'In your view, what criteria should guide the choice of the changes Parliament makes to the budget law?',
    },
    links: [
      { label: { it: 'ANSA: riammesso l’emendamento FdI su exit tax, pressing di Salvini sul condono (24/11)', en: 'ANSA: FdI exit tax amendment readmitted, Salvini presses on the amnesty (24/11, in Italian)' }, host: 'www.ansa.it', url: 'https://www.ansa.it/sito/notizie/politica/2026/11/24/pressing-di-salvini-sul-condono.-alt-dei-sindaci-non-ricada-tutto_afb633f3-0b1a-4acd-8a7c-858433efc830.html' },
      { label: { it: 'AGI: gli emendamenti alla manovra dichiarati inammissibili (23/11)', en: 'AGI: the budget amendments ruled inadmissible (23/11, in Italian)' }, host: 'www.agi.it', url: 'https://www.agi.it/economia/news/2026-11-23/emendamenti-bocciati-manovra-bilancio-40161770/' },
      { label: { it: 'Adnkronos: manovra, testo alla Camera il 18 dicembre (25/11)', en: 'Adnkronos: budget bill on the Chamber floor on 18 December (25/11, in Italian)' }, host: 'www.adnkronos.com', url: 'https://www.adnkronos.com/economia/manovra-2027-condono-pensioni-spalmacrediti-ipotesi-governo_7DRQw8yvMpeqVKSdXfEIfp' },
      { label: { it: 'Camera dei deputati: dossier sulla legge di bilancio 2027 (documento ufficiale)', en: 'Chamber of Deputies: dossier on the 2027 budget law (official document)' }, host: 'temi.camera.it', url: 'https://temi.camera.it/leg19/dossier/OCD18-23875/legge-bilancio-2027-profili-finanziari-vol-1.html' },
    ],
    checked: '2026-11-25',
  },
  {
    id: '2026-11-24-mattarella-fisco',
    date: '2026-11-24',
    area: { it: 'Fisco', en: 'Taxation' },
    title: {
      it: 'Mattarella ai nuovi magistrati tributari: «per contribuire di meno bisogna contribuire tutti»',
      en: 'Mattarella to the new tax judges: “to contribute less, everyone has to contribute”',
    },
    summary: {
      it: 'Il 23 novembre il Presidente della Repubblica Sergio Mattarella ha incontrato al Quirinale i primi magistrati tributari in tirocinio. Secondo ANSA, AGI e Adnkronos, ha richiamato i principi costituzionali sul fisco: il dovere di solidarietà dell’articolo 2 e il concorso di tutti alle spese pubbliche in base alla capacità contributiva dell’articolo 53, e ha detto che «per contribuire di meno bisogna contribuire tutti». Secondo ANSA, il richiamo arriva mentre la legge di bilancio è ancora in costruzione.',
      en: 'On 23 November the President of the Republic, Sergio Mattarella, met the first tax judges in training at the Quirinale. According to ANSA, AGI and Adnkronos, he recalled the constitutional principles on taxation: the duty of solidarity in Article 2 and everyone’s contribution to public spending according to their ability to pay in Article 53, and said that “to contribute less, everyone has to contribute”. According to ANSA, the remarks come while the budget law is still being shaped.',
    },
    points: [
      { it: 'Mattarella: «Il pagamento dei tributi è l’adempimento di uno dei doveri inderogabili di solidarietà economica e sociale» previsti dall’articolo 2 della Costituzione (ANSA, Adnkronos).', en: 'Mattarella: “paying taxes is the fulfilment of one of the inviolable duties of economic and social solidarity” set by Article 2 of the Constitution (ANSA, Adnkronos).' },
      { it: 'Ha citato l’articolo 53: «Tutti sono tenuti a concorrere alle spese pubbliche in ragione della loro capacità contributiva», (AGI, Adnkronos); secondo AGI ha richiamato anche i «criteri di progressività».', en: 'He quoted Article 53: “everyone is required to contribute to public spending according to their ability to pay”, (AGI, Adnkronos); according to AGI he also recalled the “criteria of progressivity”.' },
      { it: '«Tutti auspichiamo, anche nei periodi di crescenti esigenze di natura pubblica, un fisco più leggero», ha detto, aggiungendo che il fisco «deve essere regolato secondo equità, trasparenza e rispetto dei diritti» (ANSA, AGI).', en: '“We all hope, even at times of growing public needs, for a lighter tax burden”, he said, adding that taxation “must be governed by fairness, transparency and respect for rights” (ANSA, AGI).' },
      { it: 'Sull’evasione: «La violazione degli obblighi tributari ostacola la coesione sociale e l’unità nazionale»; «un sistema giudiziario efficiente e tempestivo scoraggia i comportamenti elusivi ed evasivi» (ANSA, AGI, Adnkronos).', en: 'On evasion: “breaching tax obligations hinders social cohesion and national unity”; “an efficient and timely judicial system discourages avoidance and evasion” (ANSA, AGI, Adnkronos).' },
      { it: 'Secondo ANSA e AGI, Mattarella ha osservato che «non mancano gli strumenti tecnologici per tracciare la ricchezza»; secondo ANSA, ha aggiunto «senza violazioni dei diritti».', en: 'According to ANSA and AGI, Mattarella observed that “technological tools to trace wealth are not lacking”; according to ANSA, he added “without violating rights”.' },
    ],
    question: {
      it: 'Come si dovrebbero bilanciare, secondo te, un fisco più leggero e il dovere di tutti di contribuire alle spese pubbliche?',
      en: 'In your view, how should a lighter tax burden be balanced with everyone’s duty to contribute to public spending?',
    },
    links: [
      { label: { it: 'Quirinale: intervento del Presidente all’incontro con i primi magistrati tributari in tirocinio (23/11)', en: 'Quirinale: the President’s address to the first tax judges in training (23/11, in Italian)' }, host: 'www.quirinale.it', url: 'https://www.quirinale.it/it/discorso/intervento-presidente-repubblica-sergio-mattarella-occasione-incontro-primi-magistrati-tributari-attualmente-tirocinio' },
      { label: { it: 'ANSA: Mattarella, «per un fisco più leggero contribuiscano tutti» (23/11)', en: 'ANSA: Mattarella, “for a lighter tax burden everyone must contribute” (23/11, in Italian)' }, host: 'www.ansa.it', url: 'https://www.ansa.it/sito/notizie/politica/2026/11/23/mattarella-per-un-fisco-piu-leggero-contribuiscano-tutti-serve-progressivita_b77f620d-611d-4e8e-b64a-0b31f44c9803.html' },
      { label: { it: 'AGI: Mattarella, «il fisco sia regolato da equità e trasparenza» (23/11)', en: 'AGI: Mattarella, “taxation must be governed by fairness and transparency” (23/11, in Italian)' }, host: 'www.agi.it', url: 'https://www.agi.it/politica/news/2026-11-23/mattarella-fisco-equit-trasparenza-40160116/' },
      { label: { it: 'Adnkronos: Mattarella, «per pagare meno tasse bisogna contribuire tutti» (23/11)', en: 'Adnkronos: Mattarella, “to pay less tax, everyone has to contribute” (23/11, in Italian)' }, host: 'www.adnkronos.com', url: 'https://www.adnkronos.com/politica/fisco-tasse-mattarella-incontro-primi-magistrati-tributari-in-tirocinio_5Qknxw9PKfT2ZRX7WrWBCP' },
    ],
    checked: '2026-11-24',
  },
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
