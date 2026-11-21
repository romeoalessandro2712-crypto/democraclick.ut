// data/registro.js — public record of checks and corrections (newest first).
// Every daily run that changes content adds an entry here (see automation/DAILY_UPDATE.md).
// kind: 'verifica' (sources re-checked), 'correzione' (something we had wrong), 'aggiornamento' (new data).
const REPORTS = 'https://github.com/romeoalessandro2712-crypto/democraclick.ut/blob/main/automation/reports/';
export const REGISTRO = [
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
