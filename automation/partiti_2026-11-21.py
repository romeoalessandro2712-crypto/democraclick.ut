# One-off: party entries re-verified on 21/11/2026. Every statement below was checked against the
# listed source on that date (see automation/reports/2026-11-21-verifica-partiti.md). Statements of
# the 13/11 prototype that no listed source supported were removed, not rewritten from memory.
import json, re, sys
P = '/home/claude/agora/data/partiti.js'
s = open(P, encoding='utf-8').read()
m = re.search(r'export const PARTITI = (\[.*?\n\]);', s, re.S)
parties = json.loads(m.group(1))
by = {p['id']: p for p in parties}
T = lambda it, en: {'it': it, 'en': en}
S = lambda label, url: {'label': label, 'url': url}
ANSA_2011 = S('ANSA: dieci giorni per il programma del campo largo (20/11/2026)', 'https://www.ansa.it/sito/notizie/politica/2026/11/20/dieci-giorni-per-il-programma-del-campo-largo-lincognita-della-piazza_ee585449-c649-41c2-997b-afc12ff8b12a.html')
ANSA_0711 = S('ANSA: parte il cantiere del programma progressista (7/11/2026)', 'https://www.ansa.it/sito/notizie/politica/2026/11/07/parte-il-cantiere-del-programma-progressista-un-mese-per-chiudere_d0a97c66-1eec-40ec-b8ab-b92f19c5bbd3.html')
GIORNO_1910 = S('Il Giorno: salute, salari e casa, così PD, M5S e AVS preparano l’alternativa (19/10/2026)', 'https://www.quotidiano.net/politica/salute-salari-e-casa-cosi-pd-m5s-e-avs-preparano-lalternativa-resta-il-nodo-su-kiev-5f10b07d')

def upd(pid, **kw):
    by[pid].update(kw)

# ── +Europa
upd('piueuropa',
  updated=T('2022, 2024 e 2026', '2022, 2024 and 2026'),
  status=T('Non abbiamo trovato un programma 2027 pubblicato. Dal 7 novembre 2026 +Europa partecipa al cantiere del programma del centrosinistra; a ottobre Magi ha avviato la formazione di un gruppo autonomo alla Camera con Tabacci e Soumahoro, secondo Il Foglio.',
           'We found no published 2027 programme. Since 7 November 2026 +Europa has taken part in drafting the centre-left programme; in October Magi began forming an autonomous group in the Chamber with Tabacci and Soumahoro, according to Il Foglio.'),
  points=[
    T('Stati Uniti d’Europa come percorso «non più rimandabile», secondo Magi (2024).', 'A United States of Europe as a path that can “no longer be postponed”, according to Magi (2024).'),
    T('Superamento del voto all’unanimità nel Consiglio europeo (programma 2022 con Azione).', 'Ending unanimity voting in the European Council (2022 programme with Azione).'),
    T('Obbligo di redistribuzione dei migranti tra gli Stati europei (2024).', 'Mandatory redistribution of migrants among European states (2024).'),
    T('Critica alla manovra: secondo Magi il saldo per sanità e scuola è negativo (5 novembre 2026).', 'Criticism of the budget law: according to Magi the balance for health and schools is negative (5 November 2026).'),
    T('Nel tavolo del centrosinistra chiede di inserire la legalizzazione della cannabis, secondo ANSA (20 novembre 2026).', 'At the centre-left table it asks for cannabis legalisation to be included, according to ANSA (20 November 2026).'),
  ],
  themes={'lavoro': None,
    'sanita': T('Contesta che il governo abbia aumentato le risorse per sanità e scuola: secondo Magi il saldo è negativo.', 'Disputes that the government has increased resources for health and schools: according to Magi the balance is negative.'),
    'esteri': None,
    'europa': T('Stati Uniti d’Europa; superamento del voto all’unanimità nel Consiglio europeo; redistribuzione obbligatoria dei migranti.', 'A United States of Europe; ending unanimity in the European Council; mandatory redistribution of migrants.'),
    'energia': None},
  sources=[
    S('La Nazione: Magi punta agli Stati Uniti d’Europa (5/2/2024)', 'https://www.lanazione.it/cosa-fare/magi-punta-agli-stati-uniti-deuropa-e-sui-migranti-urge-redistribuzione-d566f483'),
    S('Affaritaliani: Magi sulla manovra (5/11/2026)', 'https://www.affaritaliani.it/coffee/video/vista/manovra-magi-europa-da-respingere-al-mittente-tra-poco-se-ne-vergogneranno-anche-loro.html'),
    S('Startmag: programma Azione e +Europa (25/7/2022)', 'https://www.startmag.it/?p=200772'),
    S('Il Foglio: Magi forma un gruppo alla Camera (23/10/2026)', 'https://www.ilfoglio.it/en/politics/2026/10/23/news/magi-is-forming-a-parliamentary-group-in-the-chamber-of-deputies-with-soumahoro-and-tabacci-but-without-the-pd-the-pd-is-considering-acerbo--411430'),
    ANSA_0711, ANSA_2011,
  ])

# ── AVS
upd('avs',
  updated=T('2026', '2026'),
  status=T('Il 18 ottobre 2026 AVS ha presentato 16 proposte scelte con la piattaforma partecipativa «Decidiamo», online da maggio 2026, da portare al tavolo del programma del centrosinistra. Il programma comune è atteso entro fine novembre; secondo ANSA AVS non cede sulla patrimoniale.',
           'On 18 October 2026 AVS presented 16 proposals chosen through its “Decidiamo” participatory platform, online since May 2026, to take to the centre-left programme table. The joint programme is expected by the end of November; according to ANSA, AVS will not give ground on the wealth tax.'),
  points=[
    T('Italia al 100% rinnovabile entro il 2040, con una legge sul clima nei primi 100 giorni di governo; no al nucleare.', 'Italy 100% renewable by 2040, with a climate law in the government’s first 100 days; no to nuclear power.'),
    T('Salario minimo legale (10 euro l’ora) e orario di lavoro ridotto a parità di stipendio.', 'A legal minimum wage (10 euros an hour) and shorter working hours at the same pay.'),
    T('Sanità: più fondi pubblici e cure in tempi certi indipendentemente dal territorio di residenza.', 'Health: more public funding and timely care regardless of where people live.'),
    T('Patrimoniale solo per i più ricchi, milionari e miliardari.', 'A wealth tax only on the richest, millionaires and billionaires.'),
    T('Stop all’aumento delle spese militari: Fratoianni ha definito «una follia» l’uso di 15 miliardi del fondo Safe per il riarmo annunciato da Tajani.', 'Stop increasing military spending: Fratoianni called the use of 15 billion of the Safe fund for rearmament announced by Tajani “madness”.'),
    T('Casa come diritto sociale: più edilizia popolare e regole sugli affitti brevi.', 'Housing as a social right: more public housing and rules on short-term lets.'),
  ],
  themes={
    'lavoro': T('Salario minimo legale a 10 euro l’ora; orario ridotto a parità di stipendio; patrimoniale solo per i più ricchi.', 'Legal minimum wage of 10 euros an hour; shorter hours at the same pay; wealth tax only on the richest.'),
    'sanita': T('Più fondi alla sanità pubblica e cure in tempi certi ovunque si viva.', 'More funding for public health and timely care wherever people live.'),
    'esteri': T('Contraria all’aumento delle spese militari e agli aiuti militari all’Ucraina; chiede una soluzione diplomatica.', 'Against higher military spending and military aid to Ukraine; calls for a diplomatic solution.'),
    'europa': T('Redistribuzione dei migranti in Europa oltre il regolamento di Dublino; interruzione volontaria di gravidanza nella Carta dei diritti fondamentali Ue.', 'Redistribution of migrants in Europe beyond the Dublin Regulation; abortion in the EU Charter of Fundamental Rights.'),
    'energia': T('100% rinnovabili entro il 2040, no al nucleare, prezzi dell’energia calmierati.', '100% renewables by 2040, no nuclear power, capped energy prices.')},
  sources=[
    S('Pagella Politica: le proposte di AVS per le elezioni 2027 (19/10/2026)', 'https://pagellapolitica.it/articoli/proposte-avs-decidiamo-elezioni-2027'),
    S('Il Sole 24 Ore: le proposte AVS al voto dell’assemblea (17/10/2026)', 'https://en.ilsole24ore.com/art/avs-universal-basic-income-renewables-all-proposals-to-be-voted-on-at-sundays-assembly-AJFxYomB'),
    S('Il Resto del Carlino: AVS pronta a presentare il programma', 'https://www.ilrestodelcarlino.it/ultimaora/avs-pronti-a-presentare-programma-f61a32f9'),
    S('Il Giorno: Bonelli e Fratoianni, «follia» nuove spese per le armi (28/7/2026)', 'https://www.ilgiorno.it/ultimaora/bonelli-e-fratoianni-follia-ipotizzare-de3f0c04'),
    GIORNO_1910, ANSA_2011,
  ])

# ── Azione
upd('azione',
  updated=T('2025 e 2026', '2025 and 2026'),
  status=T('Calenda ha annunciato che Azione correrà da sola, fuori dal centrodestra e dal campo largo, puntando a una lista di centro decisiva dopo il voto (2 novembre 2026). Non abbiamo trovato un programma 2027 completo: il 4 ottobre Calenda ha indicato cinque punti.',
           'Calenda has announced that Azione will run alone, outside both the centre-right and the campo largo, aiming for a centrist list that is decisive after the vote (2 November 2026). We found no complete 2027 programme: on 4 October Calenda set out five points.'),
  points=[
    T('Centro autonomo dalle due coalizioni: «Correrò da solo, saremo decisivi».', 'A centre independent of both coalitions: “I will run alone, we will be decisive”.'),
    T('Armi all’Ucraina finché servirà a fermare l’avanzata russa e costruzione di una «Nato europea».', 'Arms to Ukraine for as long as needed to halt Russia’s advance, and building a “European NATO”.'),
    T('Superamento del diritto di veto nel Consiglio europeo, verso un’Europa federale.', 'Ending the veto in the European Council, towards a federal Europe.'),
    T('Ritorno al nucleare e «radicale cambiamento del green deal».', 'A return to nuclear power and a “radical change to the Green Deal”.'),
    T('Salario minimo, tra le proposte della sinistra che Calenda dice di condividere.', 'A minimum wage, among the left’s proposals that Calenda says he shares.'),
    T('Proposta di legge contro la propaganda russa, con sanzioni a doppio binario, alla base del polo riformista con Pina Picierno.', 'A bill against Russian propaganda, with twin-track sanctions, at the basis of the reformist pole with Pina Picierno.'),
  ],
  themes={
    'lavoro': T('Favorevole al salario minimo, tra le proposte della sinistra che Calenda dice di condividere.', 'In favour of a minimum wage, among the left’s proposals Calenda says he shares.'),
    'sanita': None,
    'esteri': T('Armi all’Ucraina finché servirà; «Nato europea»; spese militari allineate alle necessità di difesa; legge contro la propaganda russa.', 'Arms to Ukraine as long as needed; a “European NATO”; military budgets aligned with defence needs; a law against Russian propaganda.'),
    'europa': T('Superamento del veto nel Consiglio europeo verso un’Europa federale; legge elettorale proporzionale pura con accordo di programma dopo il voto.', 'Ending the veto in the European Council towards a federal Europe; a purely proportional electoral law with a programme agreement after the vote.'),
    'energia': T('Ritorno al nucleare e «radicale cambiamento del green deal».', 'A return to nuclear power and a “radical change to the Green Deal”.')},
  sources=[
    S('Adnkronos: Calenda, «Azione correrà da sola» (2/11/2026)', 'https://www.adnkronos.com/internazionale/esteri/elezioni-carlo-calenda-azione-campo-largo_3sjiJdWduugh1UrK9r5fSh'),
    S('Adnkronos: Calenda, i 5 punti del programma (4/10/2026)', 'https://www.adnkronos.com/politica/calenda-ucraina-nato-programma_3TpjDoUBlsLipQmeExooPw'),
    S('Affaritaliani: Calenda, né col centrodestra né col centrosinistra', 'https://www.affaritaliani.it/coffee/video/vista/calenda-ne-col-centrodestra-ne-col-centrosinistra-da-terzi-abbiamo-sempre-preso-l8.html'),
    S('Il Foglio: pdl contro la propaganda russa (20/7/2026)', 'https://www.ilfoglio.it/politica/2026/07/20/news/una-proposta-di-legge-anti-propaganda-russa-per-il-via-del-polo-calenda-picierno--402690'),
    S('Il Foglio: la mappa di Calenda (28/11/2025)', 'https://www.ilfoglio.it/politica/2025/11/28/news/la-mappa-di-calenda-proporzionale-puro-sviluppo-giovani-e-tour-liberale-da-marzo-parla-il-leader-di-azione--122702'),
  ])

# ── Fratelli d'Italia: all statements confirmed; sources dated
by['fdi']['sources'] = [
  S('Sky TG24: i 25 punti del programma di FdI (2022)', 'https://tg24.sky.it/politica/approfondimenti/giorgia-meloni-programma-fratelli-italia'),
  S('Fratelli d’Italia: accordo quadro di programma del centrodestra (2022)', 'https://fratelli-italia.it/programmacentrodestr'),
  S('Programma FdI per le europee 2024 (PDF)', 'https://www.qualenergia.it/wp-content/uploads/2024/05/Fdi.pdf'),
  S('Startmag: il programma del centrodestra (12/8/2022)', 'https://www.startmag.it/?p=202492'),
]
by['fdi']['themes']['energia'] = T('Europee 2024: «Difendere la natura senza eco-follie», con obiettivi climatici economicamente sostenibili e lo stop al divieto dei motori a combustione nel 2035.', 'European elections 2024: “Protect nature without eco-madness”, with economically sustainable climate goals and scrapping the 2035 combustion-engine ban.')

# ── Forza Italia: all confirmed; sources dated
by['fi']['sources'] = [
  S('QuiFinanza: Manovra 2027, le proposte di Tajani', 'https://quifinanza.it/politica/manovra-2027-tajani-tasse-giovani-ceto-medio-pensionati/1020073/'),
  S('Italpress: Tajani su tredicesime e bollo auto (27/7/2026)', 'https://www.italpress.com/?p=721347'),
  S('Italianismo: Forza Italia e la burocrazia (10/8/2026)', 'https://italianismo.com.br/flash/forza-italia-anuncia-projeto-de-lei-para-reduzir-burocracia-na-italia/'),
]
by['fi']['status'] = T('Tajani ha presentato proposte per la manovra 2027 e per la prossima legislatura, da portare al tavolo della coalizione. Non abbiamo trovato un programma elettorale completo.', 'Tajani has presented proposals for the 2027 budget and for the next parliament, to take to the coalition table. We found no complete electoral programme.')

# ── Futuro Nazionale
upd('fn',
  status=T('Futuro Nazionale ha pubblicato la prima parte della «Base ideologica e programmatica» 2027-2037 l’11 agosto 2026 e la seconda e ultima parte il 24 agosto. Le fonti consultate non indicano un accordo di coalizione.',
           'Futuro Nazionale published the first part of its 2027-2037 “Ideological and programmatic basis” on 11 August 2026 and the second and final part on 24 August. The sources consulted show no coalition agreement.'),
  sources=[
    S('Adnkronos: il manifesto di Futuro Nazionale (11/8/2026)', 'https://www.adnkronos.com/politica/futuro-nazionale-vannacci-programma_3XBNWfx3oEFLZlWE1baDAN'),
    S('Sky TG24: Futuro Nazionale completa il programma (24/8/2026)', 'https://tg24.sky.it/politica/2026/08/24/vannacci-programma-futuro-nazionale'),
  ])
by['fn']['points'][2] = T('No a nuovi invii di armi all’Ucraina senza una strategia diplomatica di pace; priorità al negoziato.', 'No further arms to Ukraine without a diplomatic peace strategy; priority to negotiation.')
by['fn']['themes']['esteri'] = T('No a nuovi invii di armi senza una strategia diplomatica; riapertura dei canali con la Russia; no a una strategia Nato espansiva; contrario all’obiettivo del 5% del Pil per la difesa.', 'No further arms without a diplomatic strategy; reopening channels with Russia; no to an expansive NATO strategy; against the 5% of GDP defence target.')

# ── Italia Viva
upd('iv',
  updated=T('2025 e 2026', '2025 and 2026'),
  status=T('Dal 7 novembre 2026 Italia Viva partecipa al cantiere del programma del centrosinistra. Renzi chiede un contratto di programma «alla tedesca» con gli alleati e tre garanzie a Conte.',
           'Since 7 November 2026 Italia Viva has taken part in drafting the centre-left programme. Renzi asks for a German-style programme contract with the allies and three guarantees from Conte.'),
  points=[
    T('«Decreto Ceto Medio», con circa il 2% del Pil per la prossima legislatura.', 'A “Middle Class Decree”, worth about 2% of GDP over the next parliament.'),
    T('Quattordicesima dal 2028 per insegnanti, infermieri e forze dell’ordine.', 'A fourteenth monthly salary from 2028 for teachers, nurses and police.'),
    T('«Start tax»: agevolazione Irpef per i giovani, inserita tra le proposte del campo largo (2025).', '“Start tax”: an income-tax break for young people, included among the campo largo proposals (2025).'),
    T('No a una maxi patrimoniale: secondo Renzi bisogna ridurre le tasse ai redditi bassi.', 'No to a large wealth tax: according to Renzi, taxes should be cut for low incomes.'),
    T('Contratto di programma scritto con gli alleati, sul modello dei contratti di coalizione tedeschi.', 'A written programme contract with the allies, on the model of German coalition agreements.'),
    T('Sì agli aiuti militari all’Ucraina: voto favorevole alla proroga l’11 febbraio 2026.', 'Yes to military aid to Ukraine: voted for the extension on 11 February 2026.'),
  ],
  themes={
    'lavoro': T('Quattordicesima per insegnanti, infermieri e agenti dal 2028; «Start tax» Irpef per i giovani; no a una maxi patrimoniale.', 'Fourteenth salary for teachers, nurses and police from 2028; “Start tax” for young people; no to a large wealth tax.'),
    'sanita': None,
    'esteri': T('L’11 febbraio 2026 ha votato sì al decreto sulla proroga degli aiuti militari all’Ucraina.', 'On 11 February 2026 it voted for the decree extending military aid to Ukraine.'),
    'europa': T('Contratto di programma «alla tedesca» con gli alleati; chiede un presidente della Repubblica europeista.', 'A German-style programme contract with the allies; asks for a pro-European President of the Republic.'),
    'energia': None},
  sources=[
    S('Affaritaliani: la quattordicesima di Renzi', 'https://www.affaritaliani.it/politica/renzi-propone-la-quattordicesima-per-insegnanti-infermieri-e-agenti-come-funzionerebbe.html'),
    S('Affaritaliani: il contratto alla tedesca di Renzi (7/9/2026)', 'https://www.affaritaliani.it/politica/cose-il-contratto-alla-tedesca-la-ricetta-di-matteo-renzi-per-il-centrosinistra.html'),
    S('Adnkronos: Renzi chiede tre garanzie a Conte (4/10/2026)', 'https://www.adnkronos.com/politica/renzi-conte-m5s-elezioni-centrosinistra_5CGLUiQ1fs7Oa6fDAh8Gim'),
    S('Il Foglio: Renzi nel campo largo (10/10/2025)', 'https://ilfoglio.it/economia/2025/10/10/news/renzi-nel-campo-largo-il-collante-laumento-del-deficit--125179'),
    S('Tecnica della Scuola: Renzi e la patrimoniale (5/6/2026)', 'https://www.tecnicadellascuola.it/renzi-dice-no-alla-maxi-patrimoniale-per-i-ricchi-andrebbero-in-svizzera-e-avremo-meno-soldi-per-la-scuola-pubblica-invece-riduciamo-le-tasse-ai-poveri'),
    S('La Notizia: l’alleanza di Renzi e il voto sull’Ucraina', 'https://www.lanotiziagiornale.it/?p=427100'),
    ANSA_0711,
  ])

# ── Lega
upd('lega',
  updated=T('2025 e 2026', '2025 and 2026'),
  status=T('A settembre 2026 Salvini e i governatori del Nord hanno avviato la stesura di un manifesto programmatico. Salvini è stato rieletto segretario federale il 25 ottobre 2026.',
           'In September 2026 Salvini and the northern governors began drafting a policy manifesto. Salvini was re-elected federal secretary on 25 October 2026.'),
  points=[
    T('Pensioni: uscita volontaria a 64 anni, con calcolo contributivo.', 'Pensions: voluntary retirement at 64, with a contribution-based calculation.'),
    T('Dieci proposte per rilanciare il Servizio sanitario nazionale, tra cui un piano Marshall per gli ospedali (2025).', 'Ten proposals to relaunch the National Health Service, including a Marshall plan for hospitals (2025).'),
    T('Pacchetto contro l’integralismo islamico: scuole, cittadinanza, enti religiosi senza intesa, finanziamenti dall’estero.', 'A package against Islamic fundamentalism: schools, citizenship, religious bodies without state agreements, foreign funding.'),
    T('Al congresso del 25 ottobre Salvini ha detto: «Stop ad armi e a soldi all’Ucraina».', 'At the 25 October congress Salvini said: “Stop arms and money to Ukraine”.'),
    T('Sospensione del Patto di stabilità e blocco di bollette e carburanti ai prezzi di febbraio 2026.', 'Suspending the Stability Pact and freezing energy bills and fuel at February 2026 prices.'),
  ],
  themes={
    'lavoro': T('Pensioni: uscita volontaria a 64 anni con calcolo contributivo.', 'Pensions: voluntary retirement at 64 with a contribution-based calculation.'),
    'sanita': T('Dieci proposte per il Servizio sanitario nazionale: personale, liste d’attesa, piano Marshall per gli ospedali.', 'Ten proposals for the National Health Service: staff, waiting lists, a Marshall plan for hospitals.'),
    'esteri': T('Al congresso Salvini ha detto «Stop ad armi e a soldi all’Ucraina».', 'At the congress Salvini said “Stop arms and money to Ukraine”.'),
    'europa': T('Chiede all’Unione europea di sospendere il Patto di stabilità.', 'Asks the EU to suspend the Stability Pact.'),
    'energia': T('Chiede di bloccare il costo di bollette e carburanti ai prezzi di febbraio 2026.', 'Asks to freeze the cost of energy bills and fuel at February 2026 prices.')},
  sources=[
    S('Il Giorno: Salvini rieletto segretario (25/10/2026)', 'https://www.quotidiano.net/politica/lega-nuovo-simbolo-matteo-salvini-w8ix2mnu'),
    S('Eunews: Salvini rieletto, «stop ad armi e soldi all’Ucraina» (26/10/2026)', 'https://www.eunews.it/2026/10/26/lincognita-italia-sullucraina-salvini-rieletto-leader-della-lega-tra-le-promesse-di-abbandonare-kiev/'),
    S('Il Sole 24 Ore: Salvini e i governatori, il manifesto (9/9/2026)', 'https://en.ilsole24ore.com/art/salvinis-coalition-governors-the-manifesto-and-the-road-map-AJuzrH8'),
    S('Il Giorno: pensione a 64 anni (26/8/2026)', 'https://www.quotidiano.net/economia/pensione-a-64-anni-pressing-della-lega-che-propone-un-nuovo-anticipo-tzoifhg0'),
    S('Quotidiano Sanità: le dieci proposte della Lega per il Ssn (2025)', 'https://www.quotidianosanita.it/governo-e-parlamento/ssn-la-lega-presenta-le-sue-dieci-proposte-per-il-suo-rilancio-dalla-valorizzazione-del-personale-ad-un-piano-marshall-per-gli-ospedali/'),
    S('Open: Salvini e il Patto di stabilità (15/4/2026)', 'https://www.open.online/2026/04/15/matteo-salvini-ue-guerra-patto-stabilita-gas-benzina-trump-gesu/'),
    S('Libero: il piano contro l’integralismo islamico (24/9/2026)', 'https://www.liberoquotidiano.it/news/politica/49225849/piano-lega-contro-integralismo-islamico.amp'),
  ])

# ── M5S: statements confirmed; status updated with the coalition tables
by['m5s']['status'] = T('Venti punti del percorso «Nova», votati dagli iscritti fino al 20 settembre 2026, da portare al tavolo della coalizione progressista. Il programma comune è atteso entro fine novembre; sulla patrimoniale Conte chiede una «redistribuzione seria», secondo ANSA.',
  'Twenty points from the “Nova” process, voted on by members until 20 September 2026, to take to the progressive coalition table. The joint programme is expected by the end of November; on the wealth tax Conte calls for “serious redistribution”, according to ANSA.')
by['m5s']['sources'] = [
  S('Open: i 20 punti del programma M5S (18/9/2026)', 'https://www.open.online/2026/09/18/programma-m5s-20-punti-voto-iscritti/'),
  S('Open: il nuovo reddito di cittadinanza (3/11/2026)', 'https://www.open.online/2026/11/03/m5s-nuovo-reddito-di-cittadinanza/'),
  S('Money.it: programma M5S 2027 (5/8/2026)', 'https://www.money.it/programma-movimento-5-stelle-2027-punti-fondamentali-prossime-elezioni'),
  S('La Notizia: i 20 punti di Nova (18/9/2026)', 'https://www.lanotiziagiornale.it/?p=425272'),
  ANSA_2011,
]

# ── PD
upd('pd',
  status=T('Il programma comune del centrosinistra (PD, M5S, AVS, Italia Viva, +Europa) è in costruzione dopo dieci tavoli tematici e dovrebbe chiudersi entro fine novembre; patrimoniale e Ucraina restano i nodi, secondo ANSA. La segreteria del PD, citata dal Foglio, indica come programma il discorso di Schlein alla Direzione del 2 ottobre.',
           'The centre-left joint programme (PD, M5S, AVS, Italia Viva, +Europa) is being drafted after ten thematic tables and should be finished by the end of November; the wealth tax and Ukraine remain the sticking points, according to ANSA. The PD secretariat, quoted by Il Foglio, points to Schlein’s 2 October speech to the party leadership as the programme.'),
  points=[
    T('Salario minimo e lotta alla precarietà.', 'A minimum wage and action against job insecurity.'),
    T('Sanità pubblica: spesa al 7-7,5% del Pil e almeno 20 miliardi per invertire i tagli.', 'Public health: spending at 7-7.5% of GDP and at least 20 billion to reverse cuts.'),
    T('«Diritto a restare»: 200 euro al mese in più per tre anni agli under 35 con redditi sotto i 45.000 euro.', '“Right to stay”: 200 euros more a month for three years for under-35s earning under 45,000 euros.'),
    T('Orario di lavoro ridotto a parità di salario (da 40 a 32 ore) e congedo parentale paritario.', 'Shorter working hours at the same pay (from 40 to 32 hours) and equal parental leave.'),
    T('Piano casa nazionale, rifinanziamento del fondo affitti e recupero di oltre 100.000 alloggi pubblici sfitti.', 'A national housing plan, refinancing the rent-support fund and bringing back over 100,000 empty public homes.'),
    T('Contraria alla legge elettorale della maggioranza.', 'Against the majority’s electoral law.'),
  ],
  themes={
    'lavoro': T('Salario minimo; lotta alla precarietà; orario ridotto a parità di salario; «Diritto a restare» per gli under 35.', 'Minimum wage; action against job insecurity; shorter hours at the same pay; “Right to stay” for under-35s.'),
    'sanita': T('Spesa sanitaria al 7-7,5% del Pil e almeno 20 miliardi per invertire i tagli al Servizio sanitario nazionale.', 'Health spending at 7-7.5% of GDP and at least 20 billion to reverse cuts to the National Health Service.'),
    'esteri': T('Favorevole al sostegno all’Ucraina, anche militare.', 'In favour of supporting Ukraine, including militarily.'),
    'europa': T('Contraria alla legge elettorale della maggioranza.', 'Against the majority’s electoral law.'),
    'energia': None},
  sources=[
    S('Il Foglio: il programma del PD (7/11/2026)', 'https://www.ilfoglio.it/politica/2026/11/07/news/il-programma-del-pd-in-esclusiva--413011'),
    GIORNO_1910,
    S('Money.it: il ddl sul diritto a restare (6/6/2026)', 'https://www.money.it/cosa-prevede-il-ddl-del-pd-sul-diritto-a-restare-in-italia'),
    S('Il Foglio: la settimana a 32 ore (31/3/2026)', 'https://ilfoglio.it/economia/2026/03/31/news/schlein-e-la-caldaia-a-gas-perche-il-vero-punto-debole-del-pd-e-leconomia--268445'),
    S('Open: Schlein alla Festa dell’Unità di Reggio Emilia (13/9/2026)', 'https://www.open.online/2026/09/13/elly-schlein-chiusura-festa-unita-reggio-emilia-pd-governo-meloni/'),
    ANSA_2011,
  ])

for p in parties: p['checked'] = '2026-11-21'
out = json.dumps(parties, ensure_ascii=False, indent=1)
s = s[:m.start(1)] + out + s[m.end(1):]
s = s.replace('export const COLLECTED = { it: "13 novembre 2026", en: \'13 November 2026\' };',
              "// Date on which every statement and source below was last checked (see automation/reports).\nexport const COLLECTED = { it: '21 novembre 2026', en: '21 November 2026' };")
s = s.replace("// (its party data, theme list and English translations). Not rewritten, not verified by Claude:\n// the sources are dated after Claude's knowledge cutoff (June 2026).",
              "// (its party data, theme list and English translations). Re-verified on 21/11/2026: every statement\n// was checked against its listed source; unsupported statements were removed (see automation/reports).")
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(parties))
