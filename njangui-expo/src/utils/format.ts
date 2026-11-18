export const MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

/** Équivalent de `montant.toStringAsFixed(0)`. */
export function formatMontant(montant: number): string {
  return montant.toFixed(0);
}

/** « 1er Janvier », « 12 Février » — utilisé sur le détail et la création. */
export function formatDateLongue(date: Date): string {
  const jour = date.getDate() === 1 ? '1er' : String(date.getDate());
  return `${jour} ${MOIS[date.getMonth()]}`;
}

/** « 1 Janvier » — utilisé sous « Prochaine échéance ». */
export function formatDateCourte(date: Date): string {
  return `${date.getDate()} ${MOIS[date.getMonth()]}`;
}

/** Temps écoulé depuis une notification. */
export function tempsEcoule(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `Il y a ${Math.max(minutes, 0)} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `Il y a ${heures}h`;
  if (heures < 48) return 'Hier';
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
