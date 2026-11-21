// data/partiti.js — content taken verbatim from the DemocraClick prototype you supplied
// (its party data, theme list and English translations). Re-verified on 21/11/2026: every statement
// was checked against its listed source; unsupported statements were removed (see automation/reports).
// A theme set to null means "Non emerso dalle fonti consultate." and is shown that way.
// Only the date's English form and "e" → "and" in source years were added here.
// Party colours and symbols are also yours: colours loosely recall each party's area
// (your wording), symbols belong to the parties and are shown at the same size.
import { LOGOS } from './logos.js';

// Date on which every statement and source below was last checked (see automation/reports).
export const COLLECTED = { it: '21 novembre 2026', en: '21 November 2026' };

export const THEMES = [
 {
  "id": "lavoro",
  "label": {
   "it": "Lavoro e fisco",
   "en": "Work and taxes"
  }
 },
 {
  "id": "sanita",
  "label": {
   "it": "Sanità e welfare",
   "en": "Health and welfare"
  }
 },
 {
  "id": "esteri",
  "label": {
   "it": "Difesa",
   "en": "Defence"
  }
 },
 {
  "id": "europa",
  "label": {
   "it": "Europa e istituzioni",
   "en": "Europe and institutions"
  }
 },
 {
  "id": "energia",
  "label": {
   "it": "Energia e clima",
   "en": "Energy and climate"
  }
 }
];

export const PARTITI = [
 {
  "id": "piueuropa",
  "name": "+Europa",
  "short": "+E",
  "leader": "Riccardo Magi (segretario)",
  "role": {
   "it": "Opposizione",
   "en": "Opposition"
  },
  "updated": {
   "it": "2022, 2024 e 2026",
   "en": "2022, 2024 and 2026"
  },
  "status": {
   "it": "Non abbiamo trovato un programma 2027 pubblicato. Dal 7 novembre 2026 +Europa partecipa al cantiere del programma del centrosinistra; a ottobre Magi ha avviato la formazione di un gruppo autonomo alla Camera con Tabacci e Soumahoro, secondo Il Foglio.",
   "en": "We found no published 2027 programme. Since 7 November 2026 +Europa has taken part in drafting the centre-left programme; in October Magi began forming an autonomous group in the Chamber with Tabacci and Soumahoro, according to Il Foglio.",
   "src": [
    4,
    3
   ]
  },
  "points": [
   {
    "it": "Stati Uniti d’Europa come percorso «non più rimandabile», secondo Magi (2024).",
    "en": "A United States of Europe as a path that can “no longer be postponed”, according to Magi (2024).",
    "src": [
     0
    ]
   },
   {
    "it": "Superamento del voto all’unanimità nel Consiglio europeo (programma 2022 con Azione).",
    "en": "Ending unanimity voting in the European Council (2022 programme with Azione).",
    "src": [
     2
    ]
   },
   {
    "it": "Obbligo di redistribuzione dei migranti tra gli Stati europei (2024).",
    "en": "Mandatory redistribution of migrants among European states (2024).",
    "src": [
     0
    ]
   },
   {
    "it": "Critica alla manovra: secondo Magi il saldo per sanità e scuola è negativo (5 novembre 2026).",
    "en": "Criticism of the budget law: according to Magi the balance for health and schools is negative (5 November 2026).",
    "src": [
     1
    ]
   },
   {
    "it": "Nel tavolo del centrosinistra chiede di inserire la legalizzazione della cannabis, secondo ANSA (20 novembre 2026).",
    "en": "At the centre-left table it asks for cannabis legalisation to be included, according to ANSA (20 November 2026).",
    "src": [
     5
    ]
   }
  ],
  "themes": {
   "lavoro": null,
   "sanita": {
    "it": "Contesta che il governo abbia aumentato le risorse per sanità e scuola: secondo Magi il saldo è negativo.",
    "en": "Disputes that the government has increased resources for health and schools: according to Magi the balance is negative.",
    "src": [
     1
    ]
   },
   "esteri": null,
   "europa": {
    "it": "Stati Uniti d’Europa; superamento del voto all’unanimità nel Consiglio europeo; redistribuzione obbligatoria dei migranti.",
    "en": "A United States of Europe; ending unanimity in the European Council; mandatory redistribution of migrants.",
    "src": [
     0,
     2
    ]
   },
   "energia": null
  },
  "sources": [
   {
    "label": "La Nazione: Magi punta agli Stati Uniti d’Europa (5/2/2024)",
    "url": "https://www.lanazione.it/cosa-fare/magi-punta-agli-stati-uniti-deuropa-e-sui-migranti-urge-redistribuzione-d566f483"
   },
   {
    "label": "Affaritaliani: Magi sulla manovra (5/11/2026)",
    "url": "https://www.affaritaliani.it/coffee/video/vista/manovra-magi-europa-da-respingere-al-mittente-tra-poco-se-ne-vergogneranno-anche-loro.html"
   },
   {
    "label": "Startmag: programma Azione e +Europa (25/7/2022)",
    "url": "https://www.startmag.it/?p=200772"
   },
   {
    "label": "Il Foglio: Magi forma un gruppo alla Camera (23/10/2026)",
    "url": "https://www.ilfoglio.it/en/politics/2026/10/23/news/magi-is-forming-a-parliamentary-group-in-the-chamber-of-deputies-with-soumahoro-and-tabacci-but-without-the-pd-the-pd-is-considering-acerbo--411430"
   },
   {
    "label": "ANSA: parte il cantiere del programma progressista (7/11/2026)",
    "url": "https://www.ansa.it/sito/notizie/politica/2026/11/07/parte-il-cantiere-del-programma-progressista-un-mese-per-chiudere_d0a97c66-1eec-40ec-b8ab-b92f19c5bbd3.html"
   },
   {
    "label": "ANSA: dieci giorni per il programma del campo largo (20/11/2026)",
    "url": "https://www.ansa.it/sito/notizie/politica/2026/11/20/dieci-giorni-per-il-programma-del-campo-largo-lincognita-della-piazza_ee585449-c649-41c2-997b-afc12ff8b12a.html"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "avs",
  "name": "Alleanza Verdi e Sinistra",
  "short": "AVS",
  "leader": "Angelo Bonelli e Nicola Fratoianni",
  "role": {
   "it": "Opposizione",
   "en": "Opposition"
  },
  "updated": {
   "it": "2026",
   "en": "2026"
  },
  "status": {
   "it": "Il 18 ottobre 2026 AVS ha presentato 16 proposte scelte con la piattaforma partecipativa «Decidiamo», online da maggio 2026, da portare al tavolo del programma del centrosinistra. Il programma comune è atteso entro fine novembre; secondo ANSA AVS non cede sulla patrimoniale.",
   "en": "On 18 October 2026 AVS presented 16 proposals chosen through its “Decidiamo” participatory platform, online since May 2026, to take to the centre-left programme table. The joint programme is expected by the end of November; according to ANSA, AVS will not give ground on the wealth tax.",
   "src": [
    0,
    2,
    5
   ]
  },
  "points": [
   {
    "it": "Italia al 100% rinnovabile entro il 2040, con una legge sul clima nei primi 100 giorni di governo; no al nucleare.",
    "en": "Italy 100% renewable by 2040, with a climate law in the government’s first 100 days; no to nuclear power.",
    "src": [
     0,
     1
    ]
   },
   {
    "it": "Salario minimo legale (10 euro l’ora) e orario di lavoro ridotto a parità di stipendio.",
    "en": "A legal minimum wage (10 euros an hour) and shorter working hours at the same pay.",
    "src": [
     0,
     1
    ]
   },
   {
    "it": "Sanità: più fondi pubblici e cure in tempi certi indipendentemente dal territorio di residenza.",
    "en": "Health: more public funding and timely care regardless of where people live.",
    "src": [
     0,
     4
    ]
   },
   {
    "it": "Patrimoniale solo per i più ricchi, milionari e miliardari.",
    "en": "A wealth tax only on the richest, millionaires and billionaires.",
    "src": [
     0
    ]
   },
   {
    "it": "Stop all’aumento delle spese militari: Fratoianni ha definito «una follia» l’uso di 15 miliardi del fondo Safe per il riarmo annunciato da Tajani.",
    "en": "Stop increasing military spending: Fratoianni called the use of 15 billion of the Safe fund for rearmament announced by Tajani “madness”.",
    "src": [
     3,
     0
    ]
   },
   {
    "it": "Casa come diritto sociale: più edilizia popolare e regole sugli affitti brevi.",
    "en": "Housing as a social right: more public housing and rules on short-term lets.",
    "src": [
     1,
     4
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Salario minimo legale a 10 euro l’ora; orario ridotto a parità di stipendio; patrimoniale solo per i più ricchi.",
    "en": "Legal minimum wage of 10 euros an hour; shorter hours at the same pay; wealth tax only on the richest.",
    "src": [
     1,
     0
    ]
   },
   "sanita": {
    "it": "Più fondi alla sanità pubblica e cure in tempi certi ovunque si viva.",
    "en": "More funding for public health and timely care wherever people live.",
    "src": [
     4,
     0
    ]
   },
   "esteri": {
    "it": "Contraria all’aumento delle spese militari e agli aiuti militari all’Ucraina; chiede una soluzione diplomatica.",
    "en": "Against higher military spending and military aid to Ukraine; calls for a diplomatic solution.",
    "src": [
     0,
     4
    ]
   },
   "europa": {
    "it": "Redistribuzione dei migranti in Europa oltre il regolamento di Dublino; interruzione volontaria di gravidanza nella Carta dei diritti fondamentali Ue.",
    "en": "Redistribution of migrants in Europe beyond the Dublin Regulation; abortion in the EU Charter of Fundamental Rights.",
    "src": [
     1
    ]
   },
   "energia": {
    "it": "100% rinnovabili entro il 2040, no al nucleare, prezzi dell’energia calmierati.",
    "en": "100% renewables by 2040, no nuclear power, capped energy prices.",
    "src": [
     1,
     0
    ]
   }
  },
  "sources": [
   {
    "label": "Pagella Politica: le proposte di AVS per le elezioni 2027 (19/10/2026)",
    "url": "https://pagellapolitica.it/articoli/proposte-avs-decidiamo-elezioni-2027"
   },
   {
    "label": "Il Sole 24 Ore: le proposte AVS al voto dell’assemblea (17/10/2026)",
    "url": "https://en.ilsole24ore.com/art/avs-universal-basic-income-renewables-all-proposals-to-be-voted-on-at-sundays-assembly-AJFxYomB"
   },
   {
    "label": "Il Resto del Carlino: AVS pronta a presentare il programma",
    "url": "https://www.ilrestodelcarlino.it/ultimaora/avs-pronti-a-presentare-programma-f61a32f9"
   },
   {
    "label": "Il Giorno: Bonelli e Fratoianni, «follia» nuove spese per le armi (28/7/2026)",
    "url": "https://www.ilgiorno.it/ultimaora/bonelli-e-fratoianni-follia-ipotizzare-de3f0c04"
   },
   {
    "label": "Il Giorno: salute, salari e casa, così PD, M5S e AVS preparano l’alternativa (19/10/2026)",
    "url": "https://www.quotidiano.net/politica/salute-salari-e-casa-cosi-pd-m5s-e-avs-preparano-lalternativa-resta-il-nodo-su-kiev-5f10b07d"
   },
   {
    "label": "ANSA: dieci giorni per il programma del campo largo (20/11/2026)",
    "url": "https://www.ansa.it/sito/notizie/politica/2026/11/20/dieci-giorni-per-il-programma-del-campo-largo-lincognita-della-piazza_ee585449-c649-41c2-997b-afc12ff8b12a.html"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "azione",
  "name": "Azione",
  "short": "AZ",
  "leader": "Carlo Calenda",
  "role": {
   "it": "Opposizione",
   "en": "Opposition"
  },
  "updated": {
   "it": "2025 e 2026",
   "en": "2025 and 2026"
  },
  "status": {
   "it": "Calenda ha annunciato che Azione correrà da sola, fuori dal centrodestra e dal campo largo, puntando a una lista di centro decisiva dopo il voto (2 novembre 2026). Non abbiamo trovato un programma 2027 completo: il 4 ottobre Calenda ha indicato cinque punti.",
   "en": "Calenda has announced that Azione will run alone, outside both the centre-right and the campo largo, aiming for a centrist list that is decisive after the vote (2 November 2026). We found no complete 2027 programme: on 4 October Calenda set out five points.",
   "src": [
    0,
    1
   ]
  },
  "points": [
   {
    "it": "Centro autonomo dalle due coalizioni: «Correrò da solo, saremo decisivi».",
    "en": "A centre independent of both coalitions: “I will run alone, we will be decisive”.",
    "src": [
     0,
     2
    ]
   },
   {
    "it": "Armi all’Ucraina finché servirà a fermare l’avanzata russa e costruzione di una «Nato europea».",
    "en": "Arms to Ukraine for as long as needed to halt Russia’s advance, and building a “European NATO”.",
    "src": [
     1
    ]
   },
   {
    "it": "Superamento del diritto di veto nel Consiglio europeo, verso un’Europa federale.",
    "en": "Ending the veto in the European Council, towards a federal Europe.",
    "src": [
     1
    ]
   },
   {
    "it": "Ritorno al nucleare e «radicale cambiamento del green deal».",
    "en": "A return to nuclear power and a “radical change to the Green Deal”.",
    "src": [
     1,
     2
    ]
   },
   {
    "it": "Salario minimo, tra le proposte della sinistra che Calenda dice di condividere.",
    "en": "A minimum wage, among the left’s proposals that Calenda says he shares.",
    "src": [
     2
    ]
   },
   {
    "it": "Proposta di legge contro la propaganda russa, con sanzioni a doppio binario, alla base del polo riformista con Pina Picierno.",
    "en": "A bill against Russian propaganda, with twin-track sanctions, at the basis of the reformist pole with Pina Picierno.",
    "src": [
     3
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Favorevole al salario minimo, tra le proposte della sinistra che Calenda dice di condividere.",
    "en": "In favour of a minimum wage, among the left’s proposals Calenda says he shares.",
    "src": [
     2
    ]
   },
   "sanita": null,
   "esteri": {
    "it": "Armi all’Ucraina finché servirà; «Nato europea»; spese militari allineate alle necessità di difesa; legge contro la propaganda russa.",
    "en": "Arms to Ukraine as long as needed; a “European NATO”; military budgets aligned with defence needs; a law against Russian propaganda.",
    "src": [
     1,
     3
    ]
   },
   "europa": {
    "it": "Superamento del veto nel Consiglio europeo verso un’Europa federale; legge elettorale proporzionale pura con accordo di programma dopo il voto.",
    "en": "Ending the veto in the European Council towards a federal Europe; a purely proportional electoral law with a programme agreement after the vote.",
    "src": [
     1,
     4
    ]
   },
   "energia": {
    "it": "Ritorno al nucleare e «radicale cambiamento del green deal».",
    "en": "A return to nuclear power and a “radical change to the Green Deal”.",
    "src": [
     1,
     2
    ]
   }
  },
  "sources": [
   {
    "label": "Adnkronos: Calenda, «Azione correrà da sola» (2/11/2026)",
    "url": "https://www.adnkronos.com/internazionale/esteri/elezioni-carlo-calenda-azione-campo-largo_3sjiJdWduugh1UrK9r5fSh"
   },
   {
    "label": "Adnkronos: Calenda, i 5 punti del programma (4/10/2026)",
    "url": "https://www.adnkronos.com/politica/calenda-ucraina-nato-programma_3TpjDoUBlsLipQmeExooPw"
   },
   {
    "label": "Affaritaliani: Calenda, né col centrodestra né col centrosinistra",
    "url": "https://www.affaritaliani.it/coffee/video/vista/calenda-ne-col-centrodestra-ne-col-centrosinistra-da-terzi-abbiamo-sempre-preso-l8.html"
   },
   {
    "label": "Il Foglio: pdl contro la propaganda russa (20/7/2026)",
    "url": "https://www.ilfoglio.it/politica/2026/07/20/news/una-proposta-di-legge-anti-propaganda-russa-per-il-via-del-polo-calenda-picierno--402690"
   },
   {
    "label": "Il Foglio: la mappa di Calenda (28/11/2025)",
    "url": "https://www.ilfoglio.it/politica/2025/11/28/news/la-mappa-di-calenda-proporzionale-puro-sviluppo-giovani-e-tour-liberale-da-marzo-parla-il-leader-di-azione--122702"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "fi",
  "name": "Forza Italia",
  "short": "FI",
  "leader": "Antonio Tajani",
  "role": {
   "it": "Governo",
   "en": "Government"
  },
  "updated": {
   "it": "2026",
   "en": "2026"
  },
  "status": {
   "it": "Tajani ha presentato proposte per la manovra 2027 e per la prossima legislatura, da portare al tavolo della coalizione. Non abbiamo trovato un programma elettorale completo.",
   "en": "Tajani has presented proposals for the 2027 budget and for the next parliament, to take to the coalition table. We found no complete electoral programme.",
   "src": [
    0,
    1
   ]
  },
  "points": [
   {
    "it": "Irpef al 33% fino a 60.000 euro di reddito, allargando il secondo scaglione.",
    "en": "Irpef at 33% up to 60,000 euros of income, widening the second bracket.",
    "src": [
     0
    ]
   },
   {
    "it": "Detassazione delle tredicesime: al 100% le più basse, poi tassazione progressiva.",
    "en": "Tax relief on thirteenth-month pay: 100% for the lowest, then progressive taxation.",
    "src": [
     1
    ]
   },
   {
    "it": "Riduzione del bollo auto.",
    "en": "A lower car tax.",
    "src": [
     1
    ]
   },
   {
    "it": "Esenzione fiscale totale per i lavoratori fino a 30-35 anni alle prime esperienze.",
    "en": "Full tax exemption for workers up to 30-35 years old in their first jobs.",
    "src": [
     0
    ]
   },
   {
    "it": "Carta Sanità per i pensionati.",
    "en": "A Health Card for pensioners.",
    "src": [
     0
    ]
   },
   {
    "it": "Disegno di legge per ridurre la burocrazia nei ministeri e integrare le banche dati pubbliche.",
    "en": "A bill to cut bureaucracy in ministries and integrate public databases.",
    "src": [
     2
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Irpef al 33% fino a 60.000 euro; esenzione fiscale per i lavoratori fino a 30-35 anni alla prima esperienza.",
    "en": "Irpef at 33% up to 60,000 euros; tax exemption for workers up to 30-35 years old in their first job.",
    "src": [
     0
    ]
   },
   "sanita": {
    "it": "Carta Sanità per i pensionati.",
    "en": "A Health Card for pensioners.",
    "src": [
     0
    ]
   },
   "esteri": null,
   "europa": null,
   "energia": null
  },
  "sources": [
   {
    "label": "QuiFinanza: Manovra 2027, le proposte di Tajani",
    "url": "https://quifinanza.it/politica/manovra-2027-tajani-tasse-giovani-ceto-medio-pensionati/1020073/"
   },
   {
    "label": "Italpress: Tajani su tredicesime e bollo auto (27/7/2026)",
    "url": "https://www.italpress.com/?p=721347"
   },
   {
    "label": "Italianismo: Forza Italia e la burocrazia (10/8/2026)",
    "url": "https://italianismo.com.br/flash/forza-italia-anuncia-projeto-de-lei-para-reduzir-burocracia-na-italia/"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "fdi",
  "name": "Fratelli d’Italia",
  "short": "FdI",
  "leader": "Giorgia Meloni",
  "role": {
   "it": "Governo",
   "en": "Government"
  },
  "updated": {
   "it": "2022 e 2024",
   "en": "2022 and 2024"
  },
  "status": {
   "it": "Non abbiamo trovato un programma 2027 pubblicato. Le fonti più recenti trovate sono il programma 2022 (25 punti) e quello per le europee 2024 (15 punti).",
   "en": "We found no published 2027 programme. The most recent sources found are the 2022 programme (25 points) and the one for the 2024 European elections (15 points).",
   "src": [
    0,
    2
   ]
  },
  "points": [
   {
    "it": "Sostegno alla natalità e alla famiglia, con quoziente familiare (programma 2022).",
    "en": "Support for births and families, with a family quotient (2022 programme).",
    "src": [
     0
    ]
   },
   {
    "it": "Fisco più equo e difesa del potere d’acquisto degli italiani (programma 2022).",
    "en": "Fairer taxes and protection of Italians' purchasing power (2022 programme).",
    "src": [
     0
    ]
   },
   {
    "it": "Patto fiscale, con saldo e stralcio delle cartelle fino a 3.000 euro (programma 2022).",
    "en": "A tax pact, with a partial write-off of tax bills up to 3,000 euros (2022 programme).",
    "src": [
     0
    ]
   },
   {
    "it": "Uso efficiente delle risorse del Pnrr e dei fondi europei (programma 2022).",
    "en": "Efficient use of Pnrr resources and European funds (2022 programme).",
    "src": [
     0
    ]
   },
   {
    "it": "Elezione diretta del Presidente della Repubblica, insieme alla riforma della giustizia (centrodestra).",
    "en": "Direct election of the President of the Republic, together with justice reform (centre-right).",
    "src": [
     1,
     3
    ]
   },
   {
    "it": "Detassazione per le imprese che assumono, sul modello «più assumi meno paghi» (europee 2024).",
    "en": "Tax relief for companies that hire, on the “the more you hire, the less you pay” model (2024 European elections).",
    "src": [
     2
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Europee 2024: detassazione per le aziende che creano occupazione, sul modello «più assumi meno paghi».",
    "en": "2024 European elections: tax relief for companies that create jobs, on the “the more you hire, the less you pay” model.",
    "src": [
     2
    ]
   },
   "sanita": null,
   "esteri": null,
   "europa": {
    "it": "Europee 2024: «Europa dei popoli, della libertà e delle identità», con i conservatori europei.",
    "en": "2024 European elections: a “Europe of peoples, freedom and identities”, with the European conservatives.",
    "src": [
     2
    ]
   },
   "energia": {
    "it": "Europee 2024: «Difendere la natura senza eco-follie», con obiettivi climatici economicamente sostenibili e lo stop al divieto dei motori a combustione nel 2035.",
    "en": "European elections 2024: “Protect nature without eco-madness”, with economically sustainable climate goals and scrapping the 2035 combustion-engine ban.",
    "src": [
     2
    ]
   }
  },
  "sources": [
   {
    "label": "Sky TG24: i 25 punti del programma di FdI (2022)",
    "url": "https://tg24.sky.it/politica/approfondimenti/giorgia-meloni-programma-fratelli-italia"
   },
   {
    "label": "Fratelli d’Italia: accordo quadro di programma del centrodestra (2022)",
    "url": "https://fratelli-italia.it/programmacentrodestr"
   },
   {
    "label": "Programma FdI per le europee 2024 (PDF)",
    "url": "https://www.qualenergia.it/wp-content/uploads/2024/05/Fdi.pdf"
   },
   {
    "label": "Startmag: il programma del centrodestra (12/8/2022)",
    "url": "https://www.startmag.it/?p=202492"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "fn",
  "name": "Futuro Nazionale",
  "short": "FN",
  "leader": "Roberto Vannacci (leader)",
  "role": {
   "it": "Da verificare",
   "en": "To be verified"
  },
  "updated": {
   "it": "2026",
   "en": "2026"
  },
  "status": {
   "it": "Futuro Nazionale ha pubblicato la prima parte della «Base ideologica e programmatica» 2027-2037 l’11 agosto 2026 e la seconda e ultima parte il 24 agosto. Le fonti consultate non indicano un accordo di coalizione.",
   "en": "Futuro Nazionale published the first part of its 2027-2037 “Ideological and programmatic basis” on 11 August 2026 and the second and final part on 24 August. The sources consulted show no coalition agreement.",
   "src": [
    0,
    1
   ]
  },
  "points": [
   {
    "it": "Piano di «remigrazione» articolato in 22 misure.",
    "en": "A “remigration” plan made up of 22 measures.",
    "src": [
     0
    ]
   },
   {
    "it": "Cittadinanza dopo 20 anni di residenza regolare, con italiano di livello C1 e nessuna condanna; esclusi ius soli e ius scholae.",
    "en": "Citizenship after 20 years of legal residence, with C1-level Italian and no convictions; ius soli and ius scholae excluded.",
    "src": [
     0
    ]
   },
   {
    "it": "No a nuovi invii di armi all’Ucraina senza una strategia diplomatica di pace; priorità al negoziato.",
    "en": "No further arms to Ukraine without a diplomatic peace strategy; priority to negotiation.",
    "src": [
     0
    ]
   },
   {
    "it": "Permanenza nell’euro con una ridefinizione delle politiche monetarie, valutando anche l’uscita.",
    "en": "Staying in the euro while redefining monetary policy, also considering leaving it.",
    "src": [
     0
    ]
   },
   {
    "it": "Sgravi per assumere lavoratori italiani nei settori dove prevalgono lavoratori extracomunitari.",
    "en": "Tax breaks for hiring Italian workers in sectors where non-EU workers are the majority.",
    "src": [
     0
    ]
   },
   {
    "it": "Abrogazione della legge Mancino e opposizione ai «reati d’opinione».",
    "en": "Repeal of the Mancino law and opposition to “crimes of opinion”.",
    "src": [
     0
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Sgravi per assumere lavoratori italiani; risorse risparmiate con la remigrazione destinate a ridurre il cuneo fiscale.",
    "en": "Tax breaks for hiring Italian workers; money saved through remigration used to reduce the tax wedge.",
    "src": [
     0
    ]
   },
   "sanita": {
    "it": "Esclusione dei non cittadini dai benefici sociali straordinari (case popolari, bonus, sussidi); assistenza garantita nelle situazioni di grave bisogno.",
    "en": "Exclusion of non-citizens from extraordinary social benefits (public housing, bonuses, subsidies); assistance guaranteed in cases of serious need.",
    "src": [
     0
    ]
   },
   "esteri": {
    "it": "No a nuovi invii di armi senza una strategia diplomatica; riapertura dei canali con la Russia; no a una strategia Nato espansiva; contrario all’obiettivo del 5% del Pil per la difesa.",
    "en": "No further arms without a diplomatic strategy; reopening channels with Russia; no to an expansive NATO strategy; against the 5% of GDP defence target.",
    "src": [
     0,
     1
    ]
   },
   "europa": {
    "it": "Permanenza nell’euro ridefinendo le politiche monetarie, valutando anche l’uscita; cooperazione tra nazioni sovrane come possibile alternativa alla Ue.",
    "en": "Staying in the euro while redefining monetary policy, also considering leaving it; cooperation among sovereign nations as a possible alternative to the EU.",
    "src": [
     0
    ]
   },
   "energia": {
    "it": "Ora legale permanente tutto l’anno; priorità agli interessi nazionali rispetto alla transizione verde.",
    "en": "Permanent summer time all year round; national interests given priority over the green transition.",
    "src": [
     0
    ]
   }
  },
  "sources": [
   {
    "label": "Adnkronos: il manifesto di Futuro Nazionale (11/8/2026)",
    "url": "https://www.adnkronos.com/politica/futuro-nazionale-vannacci-programma_3XBNWfx3oEFLZlWE1baDAN"
   },
   {
    "label": "Sky TG24: Futuro Nazionale completa il programma (24/8/2026)",
    "url": "https://tg24.sky.it/politica/2026/08/24/vannacci-programma-futuro-nazionale"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "iv",
  "name": "Italia Viva",
  "short": "IV",
  "leader": "Matteo Renzi",
  "role": {
   "it": "Opposizione",
   "en": "Opposition"
  },
  "updated": {
   "it": "2025 e 2026",
   "en": "2025 and 2026"
  },
  "status": {
   "it": "Dal 7 novembre 2026 Italia Viva partecipa al cantiere del programma del centrosinistra. Renzi chiede un contratto di programma «alla tedesca» con gli alleati e tre garanzie a Conte.",
   "en": "Since 7 November 2026 Italia Viva has taken part in drafting the centre-left programme. Renzi asks for a German-style programme contract with the allies and three guarantees from Conte.",
   "src": [
    6,
    1,
    2
   ]
  },
  "points": [
   {
    "it": "«Decreto Ceto Medio», con circa il 2% del Pil per la prossima legislatura.",
    "en": "A “Middle Class Decree”, worth about 2% of GDP over the next parliament.",
    "src": [
     0
    ]
   },
   {
    "it": "Quattordicesima dal 2028 per insegnanti, infermieri e forze dell’ordine.",
    "en": "A fourteenth monthly salary from 2028 for teachers, nurses and police.",
    "src": [
     0
    ]
   },
   {
    "it": "«Start tax»: agevolazione Irpef per i giovani, inserita tra le proposte del campo largo (2025).",
    "en": "“Start tax”: an income-tax break for young people, included among the campo largo proposals (2025).",
    "src": [
     3
    ]
   },
   {
    "it": "No a una maxi patrimoniale: secondo Renzi bisogna ridurre le tasse ai redditi bassi.",
    "en": "No to a large wealth tax: according to Renzi, taxes should be cut for low incomes.",
    "src": [
     4
    ]
   },
   {
    "it": "Contratto di programma scritto con gli alleati, sul modello dei contratti di coalizione tedeschi.",
    "en": "A written programme contract with the allies, on the model of German coalition agreements.",
    "src": [
     1,
     2
    ]
   },
   {
    "it": "Sì agli aiuti militari all’Ucraina: voto favorevole alla proroga l’11 febbraio 2026.",
    "en": "Yes to military aid to Ukraine: voted for the extension on 11 February 2026.",
    "src": [
     5
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Quattordicesima per insegnanti, infermieri e agenti dal 2028; «Start tax» Irpef per i giovani; no a una maxi patrimoniale.",
    "en": "Fourteenth salary for teachers, nurses and police from 2028; “Start tax” for young people; no to a large wealth tax.",
    "src": [
     0,
     3,
     4
    ]
   },
   "sanita": null,
   "esteri": {
    "it": "L’11 febbraio 2026 ha votato sì al decreto sulla proroga degli aiuti militari all’Ucraina.",
    "en": "On 11 February 2026 it voted for the decree extending military aid to Ukraine.",
    "src": [
     5
    ]
   },
   "europa": {
    "it": "Contratto di programma «alla tedesca» con gli alleati; chiede un presidente della Repubblica europeista.",
    "en": "A German-style programme contract with the allies; asks for a pro-European President of the Republic.",
    "src": [
     1,
     2
    ]
   },
   "energia": null
  },
  "sources": [
   {
    "label": "Affaritaliani: la quattordicesima di Renzi",
    "url": "https://www.affaritaliani.it/politica/renzi-propone-la-quattordicesima-per-insegnanti-infermieri-e-agenti-come-funzionerebbe.html"
   },
   {
    "label": "Affaritaliani: il contratto alla tedesca di Renzi (7/9/2026)",
    "url": "https://www.affaritaliani.it/politica/cose-il-contratto-alla-tedesca-la-ricetta-di-matteo-renzi-per-il-centrosinistra.html"
   },
   {
    "label": "Adnkronos: Renzi chiede tre garanzie a Conte (4/10/2026)",
    "url": "https://www.adnkronos.com/politica/renzi-conte-m5s-elezioni-centrosinistra_5CGLUiQ1fs7Oa6fDAh8Gim"
   },
   {
    "label": "Il Foglio: Renzi nel campo largo (10/10/2025)",
    "url": "https://ilfoglio.it/economia/2025/10/10/news/renzi-nel-campo-largo-il-collante-laumento-del-deficit--125179"
   },
   {
    "label": "Tecnica della Scuola: Renzi e la patrimoniale (5/6/2026)",
    "url": "https://www.tecnicadellascuola.it/renzi-dice-no-alla-maxi-patrimoniale-per-i-ricchi-andrebbero-in-svizzera-e-avremo-meno-soldi-per-la-scuola-pubblica-invece-riduciamo-le-tasse-ai-poveri"
   },
   {
    "label": "La Notizia: l’alleanza di Renzi e il voto sull’Ucraina",
    "url": "https://www.lanotiziagiornale.it/?p=427100"
   },
   {
    "label": "ANSA: parte il cantiere del programma progressista (7/11/2026)",
    "url": "https://www.ansa.it/sito/notizie/politica/2026/11/07/parte-il-cantiere-del-programma-progressista-un-mese-per-chiudere_d0a97c66-1eec-40ec-b8ab-b92f19c5bbd3.html"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "lega",
  "name": "Lega",
  "short": "LG",
  "leader": "Matteo Salvini",
  "role": {
   "it": "Governo",
   "en": "Government"
  },
  "updated": {
   "it": "2025 e 2026",
   "en": "2025 and 2026"
  },
  "status": {
   "it": "A settembre 2026 Salvini e i governatori del Nord hanno avviato la stesura di un manifesto programmatico. Salvini è stato rieletto segretario federale il 25 ottobre 2026.",
   "en": "In September 2026 Salvini and the northern governors began drafting a policy manifesto. Salvini was re-elected federal secretary on 25 October 2026.",
   "src": [
    2,
    0
   ]
  },
  "points": [
   {
    "it": "Pensioni: uscita volontaria a 64 anni, con calcolo contributivo.",
    "en": "Pensions: voluntary retirement at 64, with a contribution-based calculation.",
    "src": [
     3
    ]
   },
   {
    "it": "Dieci proposte per rilanciare il Servizio sanitario nazionale, tra cui un piano Marshall per gli ospedali (2025).",
    "en": "Ten proposals to relaunch the National Health Service, including a Marshall plan for hospitals (2025).",
    "src": [
     4
    ]
   },
   {
    "it": "Pacchetto contro l’integralismo islamico: scuole, cittadinanza, enti religiosi senza intesa, finanziamenti dall’estero.",
    "en": "A package against Islamic fundamentalism: schools, citizenship, religious bodies without state agreements, foreign funding.",
    "src": [
     6
    ]
   },
   {
    "it": "Al congresso del 25 ottobre Salvini ha detto: «Stop ad armi e a soldi all’Ucraina».",
    "en": "At the 25 October congress Salvini said: “Stop arms and money to Ukraine”.",
    "src": [
     1
    ]
   },
   {
    "it": "Sospensione del Patto di stabilità e blocco di bollette e carburanti ai prezzi di febbraio 2026.",
    "en": "Suspending the Stability Pact and freezing energy bills and fuel at February 2026 prices.",
    "src": [
     5
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Pensioni: uscita volontaria a 64 anni con calcolo contributivo.",
    "en": "Pensions: voluntary retirement at 64 with a contribution-based calculation.",
    "src": [
     3
    ]
   },
   "sanita": {
    "it": "Dieci proposte per il Servizio sanitario nazionale: personale, liste d’attesa, piano Marshall per gli ospedali.",
    "en": "Ten proposals for the National Health Service: staff, waiting lists, a Marshall plan for hospitals.",
    "src": [
     4
    ]
   },
   "esteri": {
    "it": "Al congresso Salvini ha detto «Stop ad armi e a soldi all’Ucraina».",
    "en": "At the congress Salvini said “Stop arms and money to Ukraine”.",
    "src": [
     1
    ]
   },
   "europa": {
    "it": "Chiede all’Unione europea di sospendere il Patto di stabilità.",
    "en": "Asks the EU to suspend the Stability Pact.",
    "src": [
     5
    ]
   },
   "energia": {
    "it": "Chiede di bloccare il costo di bollette e carburanti ai prezzi di febbraio 2026.",
    "en": "Asks to freeze the cost of energy bills and fuel at February 2026 prices.",
    "src": [
     5
    ]
   }
  },
  "sources": [
   {
    "label": "Il Giorno: Salvini rieletto segretario (25/10/2026)",
    "url": "https://www.quotidiano.net/politica/lega-nuovo-simbolo-matteo-salvini-w8ix2mnu"
   },
   {
    "label": "Eunews: Salvini rieletto, «stop ad armi e soldi all’Ucraina» (26/10/2026)",
    "url": "https://www.eunews.it/2026/10/26/lincognita-italia-sullucraina-salvini-rieletto-leader-della-lega-tra-le-promesse-di-abbandonare-kiev/"
   },
   {
    "label": "Il Sole 24 Ore: Salvini e i governatori, il manifesto (9/9/2026)",
    "url": "https://en.ilsole24ore.com/art/salvinis-coalition-governors-the-manifesto-and-the-road-map-AJuzrH8"
   },
   {
    "label": "Il Giorno: pensione a 64 anni (26/8/2026)",
    "url": "https://www.quotidiano.net/economia/pensione-a-64-anni-pressing-della-lega-che-propone-un-nuovo-anticipo-tzoifhg0"
   },
   {
    "label": "Quotidiano Sanità: le dieci proposte della Lega per il Ssn (2025)",
    "url": "https://www.quotidianosanita.it/governo-e-parlamento/ssn-la-lega-presenta-le-sue-dieci-proposte-per-il-suo-rilancio-dalla-valorizzazione-del-personale-ad-un-piano-marshall-per-gli-ospedali/"
   },
   {
    "label": "Open: Salvini e il Patto di stabilità (15/4/2026)",
    "url": "https://www.open.online/2026/04/15/matteo-salvini-ue-guerra-patto-stabilita-gas-benzina-trump-gesu/"
   },
   {
    "label": "Libero: il piano contro l’integralismo islamico (24/9/2026)",
    "url": "https://www.liberoquotidiano.it/news/politica/49225849/piano-lega-contro-integralismo-islamico.amp"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "m5s",
  "name": "Movimento 5 Stelle",
  "short": "M5S",
  "leader": "Giuseppe Conte",
  "role": {
   "it": "Opposizione",
   "en": "Opposition"
  },
  "updated": {
   "it": "2026",
   "en": "2026"
  },
  "status": {
   "it": "Venti punti del percorso «Nova», votati dagli iscritti fino al 20 settembre 2026, da portare al tavolo della coalizione progressista. Il programma comune è atteso entro fine novembre; sulla patrimoniale Conte chiede una «redistribuzione seria», secondo ANSA.",
   "en": "Twenty points from the “Nova” process, voted on by members until 20 September 2026, to take to the progressive coalition table. The joint programme is expected by the end of November; on the wealth tax Conte calls for “serious redistribution”, according to ANSA.",
   "src": [
    0,
    2,
    4
   ]
  },
  "points": [
   {
    "it": "Stop all’invio di armi a Kiev; restano gli aiuti economici e le sanzioni alla Russia.",
    "en": "A stop to sending weapons to Kyiv; economic aid and sanctions on Russia remain.",
    "src": [
     0,
     2
    ]
   },
   {
    "it": "No al 5% del Pil per il riarmo.",
    "en": "No to 5% of GDP for rearmament.",
    "src": [
     0
    ]
   },
   {
    "it": "Scuola e sanità pubbliche al centro del programma.",
    "en": "Public schools and healthcare at the centre of the programme.",
    "src": [
     0
    ]
   },
   {
    "it": "«Reddito 2.0»: nuovo sostegno al reddito al posto del vecchio reddito di cittadinanza.",
    "en": "“Reddito 2.0”: a new income support to replace the old citizenship income.",
    "src": [
     1
    ]
   },
   {
    "it": "Patto generazionale in dodici punti, elaborato dal Network giovani del Movimento.",
    "en": "A twelve-point pact between generations, drawn up by the Movement's youth network.",
    "src": [
     3
    ]
   },
   {
    "it": "Matrimonio egualitario, tra i venti punti sottoposti al voto degli iscritti.",
    "en": "Marriage equality, among the twenty points put to a members' vote.",
    "src": [
     0
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Salario minimo; proposta di «Reddito 2.0» presentata a novembre 2026.",
    "en": "Minimum wage; “Reddito 2.0” proposal presented in November 2026.",
    "src": [
     0,
     1
    ]
   },
   "sanita": {
    "it": "Sanità e scuola pubbliche tra i punti centrali.",
    "en": "Public healthcare and schools among the central points.",
    "src": [
     0
    ]
   },
   "esteri": {
    "it": "Non voterà nuovi invii di armi all’Ucraina; sostiene aiuti economici e sanzioni alla Russia.",
    "en": "Will not vote for new weapons shipments to Ukraine; supports economic aid and sanctions on Russia.",
    "src": [
     2
    ]
   },
   "europa": null,
   "energia": null
  },
  "sources": [
   {
    "label": "Open: i 20 punti del programma M5S (18/9/2026)",
    "url": "https://www.open.online/2026/09/18/programma-m5s-20-punti-voto-iscritti/"
   },
   {
    "label": "Open: il nuovo reddito di cittadinanza (3/11/2026)",
    "url": "https://www.open.online/2026/11/03/m5s-nuovo-reddito-di-cittadinanza/"
   },
   {
    "label": "Money.it: programma M5S 2027 (5/8/2026)",
    "url": "https://www.money.it/programma-movimento-5-stelle-2027-punti-fondamentali-prossime-elezioni"
   },
   {
    "label": "La Notizia: i 20 punti di Nova (18/9/2026)",
    "url": "https://www.lanotiziagiornale.it/?p=425272"
   },
   {
    "label": "ANSA: dieci giorni per il programma del campo largo (20/11/2026)",
    "url": "https://www.ansa.it/sito/notizie/politica/2026/11/20/dieci-giorni-per-il-programma-del-campo-largo-lincognita-della-piazza_ee585449-c649-41c2-997b-afc12ff8b12a.html"
   }
  ],
  "checked": "2026-11-21"
 },
 {
  "id": "pd",
  "name": "Partito Democratico",
  "short": "PD",
  "leader": "Elly Schlein",
  "role": {
   "it": "Opposizione",
   "en": "Opposition"
  },
  "updated": {
   "it": "2026",
   "en": "2026"
  },
  "status": {
   "it": "Il programma comune del centrosinistra (PD, M5S, AVS, Italia Viva, +Europa) è in costruzione dopo dieci tavoli tematici e dovrebbe chiudersi entro fine novembre; patrimoniale e Ucraina restano i nodi, secondo ANSA. La segreteria del PD, citata dal Foglio, indica come programma il discorso di Schlein alla Direzione del 2 ottobre.",
   "en": "The centre-left joint programme (PD, M5S, AVS, Italia Viva, +Europa) is being drafted after ten thematic tables and should be finished by the end of November; the wealth tax and Ukraine remain the sticking points, according to ANSA. The PD secretariat, quoted by Il Foglio, points to Schlein’s 2 October speech to the party leadership as the programme.",
   "src": [
    5,
    0
   ]
  },
  "points": [
   {
    "it": "Salario minimo e lotta alla precarietà.",
    "en": "A minimum wage and action against job insecurity.",
    "src": [
     0
    ]
   },
   {
    "it": "Sanità pubblica: spesa al 7-7,5% del Pil e almeno 20 miliardi per invertire i tagli.",
    "en": "Public health: spending at 7-7.5% of GDP and at least 20 billion to reverse cuts.",
    "src": [
     1
    ]
   },
   {
    "it": "«Diritto a restare»: 200 euro al mese in più per tre anni agli under 35 con redditi sotto i 45.000 euro.",
    "en": "“Right to stay”: 200 euros more a month for three years for under-35s earning under 45,000 euros.",
    "src": [
     2
    ]
   },
   {
    "it": "Orario di lavoro ridotto a parità di salario (da 40 a 32 ore) e congedo parentale paritario.",
    "en": "Shorter working hours at the same pay (from 40 to 32 hours) and equal parental leave.",
    "src": [
     3,
     0
    ]
   },
   {
    "it": "Piano casa nazionale, rifinanziamento del fondo affitti e recupero di oltre 100.000 alloggi pubblici sfitti.",
    "en": "A national housing plan, refinancing the rent-support fund and bringing back over 100,000 empty public homes.",
    "src": [
     1
    ]
   },
   {
    "it": "Contraria alla legge elettorale della maggioranza.",
    "en": "Against the majority’s electoral law.",
    "src": [
     4
    ]
   }
  ],
  "themes": {
   "lavoro": {
    "it": "Salario minimo; lotta alla precarietà; orario ridotto a parità di salario; «Diritto a restare» per gli under 35.",
    "en": "Minimum wage; action against job insecurity; shorter hours at the same pay; “Right to stay” for under-35s.",
    "src": [
     0,
     3,
     2
    ]
   },
   "sanita": {
    "it": "Spesa sanitaria al 7-7,5% del Pil e almeno 20 miliardi per invertire i tagli al Servizio sanitario nazionale.",
    "en": "Health spending at 7-7.5% of GDP and at least 20 billion to reverse cuts to the National Health Service.",
    "src": [
     1
    ]
   },
   "esteri": {
    "it": "Favorevole al sostegno all’Ucraina, anche militare.",
    "en": "In favour of supporting Ukraine, including militarily.",
    "src": [
     1
    ]
   },
   "europa": {
    "it": "Contraria alla legge elettorale della maggioranza.",
    "en": "Against the majority’s electoral law.",
    "src": [
     4
    ]
   },
   "energia": null
  },
  "sources": [
   {
    "label": "Il Foglio: il programma del PD (7/11/2026)",
    "url": "https://www.ilfoglio.it/politica/2026/11/07/news/il-programma-del-pd-in-esclusiva--413011"
   },
   {
    "label": "Il Giorno: salute, salari e casa, così PD, M5S e AVS preparano l’alternativa (19/10/2026)",
    "url": "https://www.quotidiano.net/politica/salute-salari-e-casa-cosi-pd-m5s-e-avs-preparano-lalternativa-resta-il-nodo-su-kiev-5f10b07d"
   },
   {
    "label": "Money.it: il ddl sul diritto a restare (6/6/2026)",
    "url": "https://www.money.it/cosa-prevede-il-ddl-del-pd-sul-diritto-a-restare-in-italia"
   },
   {
    "label": "Il Foglio: la settimana a 32 ore (31/3/2026)",
    "url": "https://ilfoglio.it/economia/2026/03/31/news/schlein-e-la-caldaia-a-gas-perche-il-vero-punto-debole-del-pd-e-leconomia--268445"
   },
   {
    "label": "Open: Schlein alla Festa dell’Unità di Reggio Emilia (13/9/2026)",
    "url": "https://www.open.online/2026/09/13/elly-schlein-chiusura-festa-unita-reggio-emilia-pd-governo-meloni/"
   },
   {
    "label": "ANSA: dieci giorni per il programma del campo largo (20/11/2026)",
    "url": "https://www.ansa.it/sito/notizie/politica/2026/11/20/dieci-giorni-per-il-programma-del-campo-largo-lincognita-della-piazza_ee585449-c649-41c2-997b-afc12ff8b12a.html"
   }
  ],
  "checked": "2026-11-21"
 }
];

// Party colours from your prototype's palette (--c-*). Same weight for every party.
export const PARTY_COLORS = {"piueuropa": "#12909e", "avs": "#1fa35b", "azione": "#7a4fc8", "fi": "#1aa0e0", "fdi": "#2646b8", "iv": "#d83a8c", "lega": "#4f8a2e", "m5s": "#f2b705", "pd": "#d93a3a", "fn": "#5b6878"};
PARTITI.forEach((p) => { p.color = PARTY_COLORS[p.id]; p.logo = LOGOS[p.id]; });
