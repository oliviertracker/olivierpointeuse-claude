const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function formatDateFR(d: Date): string {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${JOURS[d.getDay()].slice(0, 3)}. ${d.getDate()} ${MOIS[d.getMonth()].slice(0, 3)}.`;
}

export function formatMonthYear(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  const label = MOIS[m - 1];
  return `${label.charAt(0).toUpperCase() + label.slice(1)} ${y}`;
}

export function getMonday(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().split('T')[0];
}

export function formatWeekRange(monday: string): string {
  const d = new Date(monday + 'T00:00:00');
  const sun = new Date(d);
  sun.setDate(d.getDate() + 6);
  return `${d.getDate()} ${MOIS[d.getMonth()].slice(0, 3)}. – ${sun.getDate()} ${MOIS[sun.getMonth()].slice(0, 3)}.`;
}
