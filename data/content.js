// data/content.js — copy for DATI, FONTI, METODO and COMMUNITY, taken verbatim (with its
// English) from your DemocraClick prototype. Three English strings were missing from your
// dictionary and were translated by Claude: "Favorevoli", "Contrari" and the rule
// "Una proposta passa quando i sì sono più dei no."
// Left out on purpose: the poll (marked "Fonte da indicare" in your file) and the "Limiti"
// box (it lists features of your prototype that this site does not have).

export const CONTENT = {
 "dati": {
  "title": {
   "it": "Parlamento in dati",
   "en": "Parliament in data"
  },
  "certain": {
   "it": "Numeri certi",
   "en": "Fixed numbers"
  },
  "deputies": {
   "title": {
    "it": "400 deputati.",
    "en": "400 deputies."
   },
   "body": {
    "it": "È il numero dei componenti della Camera fissato dalla Costituzione (articolo 56) dopo la riforma del 2020.",
    "en": "This is the number of members of the Chamber set by the Constitution (article 56) after the 2020 reform."
   }
  },
  "senators": {
   "title": {
    "it": "200 senatori eletti.",
    "en": "200 elected senators."
   },
   "body": {
    "it": "A questi si aggiungono i senatori a vita (articoli 57 e 59 della Costituzione).",
    "en": "Senators for life are added to these (articles 57 and 59 of the Constitution)."
   }
  },
  "three": {
   "it": "Il Parlamento in tre passi",
   "en": "Parliament in three steps"
  },
  "warn": {
   "title": {
    "it": "Esempio con dati inventati.",
    "en": "Example with invented data."
   },
   "body": {
    "it": "Gruppi, seggi e voti qui sotto non sono quelli veri: servono a spiegare come si legge la grafica.",
    "en": "The groups, seats and votes below are not the real ones: they explain how to read the chart."
   }
  },
  "step1": {
   "it": "Chi siede in Aula",
   "en": "Who sits in the chamber"
  },
  "step2": {
   "it": "Come finisce una votazione",
   "en": "How a vote ends"
  },
  "step3": {
   "it": "Come una proposta diventa legge",
   "en": "How a proposal becomes law"
  },
  "hint": {
   "it": "Ogni pallino è un seggio. I seggi sono 100, divisi in cinque gruppi. Tocca un gruppo per evidenziarlo.",
   "en": "Each dot is a seat. There are 100 seats, divided into five groups. Tap a group to highlight it."
  },
  "seats100": {
   "it": "100 seggi (esempio)",
   "en": "100 seats (example)"
  },
  "approved": {
   "it": "Approvata",
   "en": "Approved"
  },
  "rejected": {
   "it": "Respinta",
   "en": "Rejected"
  },
  "passRule": {
   "it": "Una proposta passa quando i sì sono più dei no.",
   "en": "A proposal passes when the yes votes outnumber the no votes."
  },
  "vnames": [
   {
    "it": "Favorevoli",
    "en": "In favour"
   },
   {
    "it": "Contrari",
    "en": "Against"
   },
   {
    "it": "Astenuti",
    "en": "Abstained"
   },
   {
    "it": "In missione",
    "en": "On official duty"
   }
  ],
  "vshort": [
   {
    "it": "Sì",
    "en": "Yes"
   },
   {
    "it": "No",
    "en": "No"
   },
   {
    "it": "Astenuti",
    "en": "Abstained"
   },
   {
    "it": "In missione",
    "en": "On official duty"
   }
  ],
  "absNote": {
   "title": {
    "it": "Astenuti:",
    "en": "Abstained:"
   },
   "body": {
    "it": "sono presenti ma non votano né sì né no.",
    "en": "they are present but vote neither yes nor no."
   }
  },
  "missNote": {
   "title": {
    "it": "In missione:",
    "en": "On official duty:"
   },
   "body": {
    "it": "sono assenti per un incarico ufficiale.",
    "en": "they are absent because of an official assignment."
   }
  },
  "path": [
   {
    "title": {
     "it": "Deposito.",
     "en": "Tabling."
    },
    "body": {
     "it": "Un parlamentare, il governo o i cittadini presentano il testo.",
     "en": "A member of Parliament, the government or citizens present the text."
    }
   },
   {
    "title": {
     "it": "Commissione.",
     "en": "Committee."
    },
    "body": {
     "it": "Un gruppo ristretto di parlamentari lo esamina e lo modifica.",
     "en": "A small group of members examines and amends it."
    }
   },
   {
    "title": {
     "it": "Voto in Aula.",
     "en": "Floor vote."
    },
    "body": {
     "it": "Camera e Senato devono approvare lo stesso identico testo.",
     "en": "The Chamber and the Senate must approve exactly the same text."
    }
   },
   {
    "title": {
     "it": "Gazzetta Ufficiale.",
     "en": "Official Gazette."
    },
    "body": {
     "it": "Il Presidente della Repubblica promulga la legge e lo Stato la pubblica.",
     "en": "The President of the Republic promulgates the law and the State publishes it."
    }
   }
  ],
  "limitsTitle": {
   "it": "Per chi vuole approfondire: i limiti dei dati reali",
   "en": "For those who want more: the limits of the real data"
  },
  "limits": [
   {
    "title": {
     "it": "Presenze.",
     "en": "Attendance."
    },
    "parts": [
     {
      "it": "Secondo",
      "en": "According to"
     },
     {
      "link": [
       "Pagella Politica",
       "https://pagellapolitica.it/articoli/trasparenza-presenze-parlamentari"
      ]
     },
     {
      "it": "le presenze in Aula si registrano solo nelle votazioni elettroniche. Alla Camera chi è «in missione» conta tra i presenti, al Senato no. Per questo useremo «in missione» e «in congedo» e non la sola etichetta «assente». L’articolo potrebbe non essere aggiornato.",
      "en": "attendance in the chamber is recorded only in electronic votes. In the Chamber those “on official duty” count as present, in the Senate they do not. This is why we will use “on official duty” and “on leave” and not just the label “absent”. The article may not be up to date."
     }
    ]
   },
   {
    "title": {
     "it": "Commissioni.",
     "en": "Committees."
    },
    "parts": [
     {
      "it": "Gli stessi dati non sono pubblicati in dettaglio sui siti ufficiali, quindi la grafica non potrà mostrarle.",
      "en": "The same data are not published in detail on official websites, so the chart will not be able to show them."
     }
    ]
   },
   {
    "title": {
     "it": "Chi parla.",
     "en": "Who speaks."
    },
    "parts": [
     {
      "it": "Il portale",
      "en": "The portal"
     },
     {
      "link": [
       "dati.camera.it",
       "https://dati.camera.it/dataset/5340"
      ]
     },
     {
      "it": "ha un dataset sugli interventi con licenza CC BY-SA 4.0. Quello che abbiamo aperto riguarda le legislature precedenti; per il Senato e per la legislatura attuale serve ancora verificare.",
      "en": "has a dataset on speeches under a CC BY-SA 4.0 licence. The one we opened covers previous parliaments; for the Senate and the current parliament this still needs checking."
     }
    ]
   },
   {
    "title": {
     "it": "Tempo reale.",
     "en": "Real time."
    },
    "parts": [
     {
      "it": "Non abbiamo trovato conferma di un flusso in tempo reale. Servirà un servizio che scarichi i dati ufficiali a intervalli regolari.",
      "en": "We found no confirmation of a real-time feed. A service that downloads the official data at regular intervals will be needed."
     }
    ]
   }
  ]
 },
 "fonti": {
  "title": {
   "it": "Fonti",
   "en": "Sources"
  },
  "lead": {
   "it": "Link agli articoli e ai documenti usati per ogni partito.",
   "en": "Links to the articles and documents used for each party."
  }
 },
 "metodo": {
  "title": {
   "it": "Metodo",
   "en": "Method"
  },
  "lead": {
   "it": "Come leggere DemocraClick e come intendiamo lavorare.",
   "en": "How to read DemocraClick and how we intend to work."
  },
  "same": {
   "title": {
    "it": "Stesso formato per tutti.",
    "en": "Same format for everyone."
   },
   "body": {
    "it": "Ogni partito ha lo stesso spazio: stato del programma, sei punti e fonti. L’ordine è alfabetico.",
    "en": "Every party has the same space: status of the programme, six points and sources. The order is alphabetical."
   }
  },
  "synth": {
   "title": {
    "it": "Sintesi, non programmi ufficiali.",
    "en": "Summaries, not official programmes."
   },
   "body": {
    "it": "I testi riassumono articoli di stampa e documenti pubblici; la data dell’ultima verifica è indicata nella sezione Partiti. Prima di decidere, leggi il programma sul sito del partito.",
    "en": "The texts summarise press articles and public documents; the date of the last check is shown in the Parties section. Before deciding, read the programme on the party's website."
   }
  },
  "missing": {
   "title": {
    "it": "Dove manca una voce.",
    "en": "Where an entry is missing."
   },
   "body": {
    "it": "Se le fonti consultate non riportano una posizione, il sito lo dice e non la riempie con ipotesi.",
    "en": "If the sources consulted do not report a position, the site says so and does not fill the gap with guesses."
   }
  },
  "evolving": {
   "title": {
    "it": "Programmi in evoluzione.",
    "en": "Programmes still evolving."
   },
   "body": {
    "it": "Le elezioni sono previste nel 2027 e molti partiti stanno ancora scrivendo il programma. I contenuti possono cambiare.",
    "en": "The election is expected in 2027 and many parties are still writing their programme. The content may change."
   }
  },
  "partiesSpeak": {
   "title": {
    "it": "Proposta dei partiti.",
    "en": "Proposed by the parties."
   },
   "body": {
    "it": "I partiti potranno spiegare le proprie idee direttamente in questo spazio. Finché non lo fanno, il sito mostra quanto trovato nelle fonti pubbliche.",
    "en": "Parties will be able to explain their ideas directly in this space. Until they do, the site shows what was found in public sources."
   }
  },
  "six": {
   "title": {
    "it": "Come scegliamo i sei punti.",
    "en": "How we choose the six points."
   },
   "body": {
    "it": "Prendiamo le proposte più recenti riportate dalle fonti e cerchiamo di coprire temi diversi. Se un partito non ha ancora un programma per il 2027 usiamo l’ultimo pubblicato e lo scriviamo. La scelta resta nostra: per questo ogni scheda ha le fonti e l’anno.",
    "en": "We take the most recent proposals reported by the sources and try to cover different topics. If a party does not yet have a programme for 2027 we use the latest one published and say so. The choice remains ours: that is why every card shows its sources and their year."
   }
  },
  "which": {
   "title": {
    "it": "Quali partiti ci sono.",
    "en": "Which parties are included."
   },
   "body": {
    "it": "Oggi le schede sono dieci. L’elenco non è completo: mancano, tra gli altri, Noi Moderati e le liste minori. Un partito assente non è stato escluso per le sue idee.",
    "en": "Today there are ten cards. The list is not complete: Noi Moderati and the smaller lists, among others, are missing. A missing party has not been excluded because of its ideas."
   }
  },
  "provTitle": {
   "it": "Da dove viene ogni informazione",
   "en": "Where each piece of information comes from"
  },
  "provBody": {
   "it": "Ogni dato avrà un’etichetta di provenienza.",
   "en": "Every piece of data will carry a label showing its origin."
  },
  "provTags": [
   {
    "it": "Dato ufficiale",
    "en": "Official data"
   },
   {
    "it": "Dichiarato dal partito",
    "en": "Stated by the party"
   },
   {
    "it": "Verificato da DemocraClick",
    "en": "Verified by DemocraClick"
   }
  ],
  "verifyTitle": {
   "it": "Come verifichiamo le proposte",
   "en": "How we verify proposals"
  },
  "levels": [
   {
    "title": {
     "it": "Livello 1: tracciabilità.",
     "en": "Level 1: traceability."
    },
    "body": {
     "it": "Per ogni proposta indichiamo se è un annuncio, una proposta di legge depositata o un voto, con data e fonte.",
     "en": "For every proposal we state whether it is an announcement, a tabled bill or a vote, with date and source."
    }
   },
   {
    "title": {
     "it": "Livello 2: fact-checking esterno.",
     "en": "Level 2: external fact-checking."
    },
    "body": {
     "it": "Rimandiamo a fact-checker già esistenti invece di rifare il loro lavoro.",
     "en": "We link to existing fact-checkers instead of redoing their work."
    }
   },
   {
    "title": {
     "it": "Livello 3: costi e fattibilità.",
     "en": "Level 3: costs and feasibility."
    },
    "body": {
     "it": "Solo con esperti esterni, metodo pubblico, stessi criteri per tutti e diritto di replica del partito.",
     "en": "Only with external experts, a public method, the same criteria for everyone and the party's right of reply."
    }
   }
  ],
  "fundTitle": {
   "it": "Come vogliamo sostenerci",
   "en": "How we want to fund ourselves"
  },
  "fundNote": {
   "it": "Sono principi che ci proponiamo, non ancora in vigore.",
   "en": "These are principles we set for ourselves; they are not yet in force."
  },
  "fund": [
   {
    "it": "Nessun pagamento compra visibilità, posizione o trattamento diverso.",
    "en": "No payment buys visibility, position or different treatment."
   },
   {
    "it": "Fonti preferite: bandi, fondazioni, università, donazioni di cittadini, servizi dati per media e ricercatori.",
    "en": "Preferred sources: grants, foundations, universities, donations from citizens, data services for media and researchers."
   },
   {
    "it": "Un’eventuale quota dei partiti coprirebbe solo gli strumenti (area riservata, modulo, storico), uguale per fascia, solo dopo un parere legale.",
    "en": "Any fee from parties would cover only the tools (reserved area, form, history), the same for each tier, and only after legal advice."
   },
   {
    "it": "Elenco pubblico di chi ci finanzia.",
    "en": "A public list of who funds us."
   }
  ],
  "roadTitle": {
   "it": "Tabella di marcia",
   "en": "Roadmap"
  },
  "road": [
   {
    "it": "Parere legale su neutralità, finanziamenti e uso dei dati.",
    "en": "Legal advice on neutrality, funding and data use."
   },
   {
    "it": "Prototipo dell’emiciclo con una votazione reale.",
    "en": "Prototype of the hemicycle with a real vote."
   },
   {
    "it": "Area riservata e modulo identico per tutti i partiti.",
    "en": "Reserved area and an identical form for all parties."
   },
   {
    "it": "Verifica di base delle proposte.",
    "en": "Basic verification of proposals."
   },
   {
    "it": "Estensione a tutte le viste, con dati aggiornati.",
    "en": "Extension to all views, with updated data."
   }
  ]
 },
 "community": {
  "about": {
   "title": {
    "it": "Chi siamo",
    "en": "About us"
   },
   "lead": {
    "it": "Chi c’è dietro DemocraClick, chi lo paga e che cosa fare se trovi un errore.",
    "en": "Who is behind DemocraClick, who pays for it and what to do if you find an error."
   },
   "boxes": [
    {
     "title": {
      "it": "Che cos’è.",
      "en": "What it is."
     },
     "body": {
      "it": "DemocraClick è un prototipo realizzato da un gruppo di studenti per un progetto universitario. Non è un servizio pubblico e non è collegato ad alcun partito.",
      "en": "DemocraClick is a prototype built by a group of students for a university project. It is not a public service and it is not linked to any party."
     }
    },
    {
     "title": {
      "it": "Chi lo finanzia.",
      "en": "Who funds it."
     },
     "body": {
      "it": "A oggi nessuno: non abbiamo ricevuto denaro da partiti, candidati, aziende o enti. Se cambierà, l’elenco dei finanziatori sarà pubblicato in questa pagina.",
      "en": "So far nobody: we have received no money from parties, candidates, companies or institutions. If that changes, the list of funders will be published on this page."
     }
    },
    {
     "title": {
      "it": "Se trovi un errore.",
      "en": "If you find an error."
     },
     "body": {
      "it": "Vogliamo saperlo. Ogni correzione sarà annotata qui sotto con la data, senza cancellare la versione precedente. Il modulo per le segnalazioni è in programma.",
      "en": "We want to know. Every correction will be logged below with its date, without deleting the previous version. The reporting form is planned."
     }
    },
    {
     "title": {
      "it": "Diritto di replica.",
      "en": "Right of reply."
     },
     "body": {
      "it": "Un partito che ritiene inesatta la propria scheda potrà chiedere una rettifica, che pubblicheremo indicandone la fonte.",
      "en": "A party that believes its card is inaccurate will be able to ask for a correction, which we will publish with its source."
     }
    }
   ]
  },
  "experts": {
   "title": {
    "it": "Esperti",
    "en": "Experts"
   },
   "lead": {
    "it": "Professori e ricercatori discutono se una proposta è realizzabile: quanto costa, quali leggi servono, che cosa dicono i dati.",
    "en": "Professors and researchers discuss whether a proposal is feasible: how much it costs, which laws are needed, what the data say."
   },
   "planned": {
    "it": "Funzione in programma.",
    "en": "Planned feature."
   },
   "who": {
    "it": "Chi può scrivere",
    "en": "Who can write"
   },
   "boxes": [
    {
     "title": {
      "it": "Identità verificata.",
      "en": "Verified identity."
     },
     "body": {
      "it": "Nome, università o ente di ricerca e materia sono controllati e visibili accanto a ogni intervento.",
      "en": "Name, university or research body and subject are checked and shown next to every contribution."
     }
    },
    {
     "title": {
      "it": "Conflitti di interesse dichiarati.",
      "en": "Declared conflicts of interest."
     },
     "body": {
      "it": "Incarichi politici, consulenze per partiti e candidature, presenti o passate, vanno indicati.",
      "en": "Political posts, consultancy for parties and candidacies, present or past, must be stated."
     }
    },
    {
     "title": {
      "it": "Stessi criteri per tutti.",
      "en": "Same criteria for everyone."
     },
     "body": {
      "it": "Ogni proposta riceve le stesse domande: costo, coperture, tempi, norme da cambiare.",
      "en": "Every proposal gets the same questions: cost, funding, timing, rules to change."
     }
    },
    {
     "title": {
      "it": "Diritto di replica.",
      "en": "Right of reply."
     },
     "body": {
      "it": "Il partito interessato può rispondere, nello stesso spazio.",
      "en": "The party concerned can answer, in the same space."
     }
    }
   ]
  }
 }
};

// DATI example parliament — invented numbers from your prototype, always shown with its warning.
export const GROUPS = [['A', { it: 'Gruppo A', en: 'Group A' }, 34], ['B', { it: 'Gruppo B', en: 'Group B' }, 26], ['C', { it: 'Gruppo C', en: 'Group C' }, 18], ['D', { it: 'Gruppo D', en: 'Group D' }, 12], ['E', { it: 'Gruppo E', en: 'Group E' }, 10]];
// [sì, no, astenuti, in missione] per group
export const VOTES = { A: [30, 2, 0, 2], B: [3, 20, 1, 2], C: [16, 0, 0, 2], D: [1, 9, 1, 1], E: [2, 6, 2, 0] };

// Your notes on symbols and colours (now that both are shown)
export const SYMBOLS_NOTE = {"it": "I simboli appartengono ai rispettivi partiti e sono usati solo per riconoscerli; hanno tutti la stessa dimensione. I colori richiamano in modo indicativo l’area di ogni partito.", "en": "The symbols belong to their respective parties and are used only to identify them; they are all the same size. Colours loosely recall each party's political area."};
export const COLORS_BOX = { title: { it: 'Colori.', en: 'Colours.' }, body: {"it": "Ogni partito ha un colore che ne richiama in modo indicativo l’area o la tradizione. Non sono marchi ufficiali e hanno lo stesso peso grafico.", "en": "Each party has a colour that loosely recalls its political area or tradition. They are not official brand colours and they all carry the same visual weight."} };
// Example-group colours from your prototype (--gA … --gE)
export const GROUP_COLORS = {"A": "#e07a1f", "B": "#2b7de0", "C": "#8a63d2", "D": "#1f9d6b", "E": "#d6455d"};
