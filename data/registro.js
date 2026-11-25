// data/registro.js — public record of checks and corrections (newest first).
// Every daily run that changes content adds an entry here (see automation/DAILY_UPDATE.md).
// kind: 'verifica' (sources re-checked), 'correzione' (something we had wrong), 'aggiornamento' (new data).
const REPORTS = 'https://github.com/romeoalessandro2712-crypto/democraclick.ut/blob/main/automation/reports/';
export const REGISTRO = [
  {
    date: '2026-11-25', kind: 'aggiornamento',
    text: {
      it: 'Nuovo tema del giorno sull’esame della legge di bilancio 2027 alla Camera (emendamenti inammissibili, calendario, condono), dalle fonti ANSA, AGI e Adnkronos del 23-25 novembre. Sondaggi invariati: nessuna nuova Supermedia dopo quella del 19 novembre.',
      en: 'New topic of the day on the Chamber’s examination of the 2027 budget law (inadmissible amendments, timetable, amnesty), from ANSA, AGI and Adnkronos reports of 23-25 November. Polls unchanged: no new Supermedia after the 19 November one.',
    },
    link: `${REPORTS}2026-11-25.md`,
  },
  {
    date: '2026-11-24', kind: 'aggiornamento',
    text: {
      it: 'Nuovo tema del giorno sull’intervento del Presidente Mattarella sul fisco ai nuovi magistrati tributari, dalle fonti ANSA, AGI e Adnkronos del 23 novembre. Sondaggi invariati: nessuna nuova Supermedia dopo quella del 19 novembre.',
      en: 'New topic of the day on President Mattarella’s remarks on taxation to the new tax judges, from ANSA, AGI and Adnkronos reports of 23 November. Polls unchanged: no new Supermedia after the 19 November one.',
    },
    link: `${REPORTS}2026-11-24.md`,
  },
  {
    date: '2026-11-23', kind: 'aggiornamento',
    text: {
      it: 'Nuovo tema del giorno sulla tassa sui grandi patrimoni e le posizioni dei partiti, dalle fonti ANSA, AGI e Adnkronos del 22 novembre. Sondaggi invariati: nessuna nuova Supermedia dopo quella del 19 novembre.',
      en: 'New topic of the day on the tax on large fortunes and where the parties stand, from ANSA, AGI and Adnkronos reports of 22 November. Polls unchanged: no new Supermedia after the 19 November one.',
    },
    link: `${REPORTS}2026-11-23.md`,
  },
  {
    date: '2026-11-22', kind: 'aggiornamento',
    text: {
      it: 'Nuovo tema del giorno sulla legge di bilancio 2027 (exit tax, pensioni, sanità), dalle fonti ANSA e AGI del 21 novembre e dal dossier della Camera. Sondaggi invariati: nessuna nuova Supermedia dopo quella del 19 novembre.',
      en: 'New topic of the day on the 2027 budget law (exit tax, pensions, health), from ANSA and AGI reports of 21 November and the Chamber dossier. Polls unchanged: no new Supermedia after the 19 November one.',
    },
    link: `${REPORTS}2026-11-22.md`,
  },
  {
    date: '2026-11-21', kind: 'verifica',
    text: {
      it: 'Ricontrollate tutte le 35 fonti delle schede dei partiti. Le affermazioni che nessuna fonte confermava sono state rimosse, altre corrette; ora ogni affermazione indica la sua fonte numerata.',
      en: 'All 35 sources of the party cards re-checked. Statements no source confirmed were removed and others corrected; every statement now shows its numbered source.',
    },
    link: `${REPORTS}2026-11-21-verifica-partiti.md`,
  },
  {
    date: '2026-11-21', kind: 'correzione',
    text: {
      it: 'Sondaggi: avevamo scritto che la Supermedia del 19 novembre non riportava dati di coalizione. Li riporta (campo largo 44,7%, centrodestra 42,5%): ora li mostriamo e le somme sono indicate come simulazioni.',
      en: 'Polls: we had written that the 19 November Supermedia gave no coalition figures. It does (campo largo 44.7%, centre-right 42.5%): we now show them, and sums are labelled as simulations.',
    },
    link: 'https://www.lettera43.it/sondaggi-politici-supermedia-19-novembre-campo-largo-avanti-due-punti-centrodestra/',
  },
];
