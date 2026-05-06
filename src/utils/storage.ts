export type WorkType = 'midi' | 'soir' | 'journee';

export interface WorkEntry {
  date: string;
  type: WorkType;
  worked: boolean;
  startTime: string;
  endTime: string;
}

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  midi: 'Service Midi',
  soir: 'Service Soir',
  journee: 'Journée Continue',
};

export const DEFAULT_TIMES: Record<WorkType, { start: string; end: string }> = {
  midi: { start: '11:30', end: '15:00' },
  soir: { start: '18:00', end: '23:00' },
  journee: { start: '09:00', end: '17:00' },
};

const key = (date: string, type: WorkType) => `pointeuse_${date}_${type}`;

export function saveEntry(entry: WorkEntry): void {
  localStorage.setItem(key(entry.date, entry.type), JSON.stringify(entry));
}

export function getEntry(date: string, type: WorkType): WorkEntry | null {
  const raw = localStorage.getItem(key(date, type));
  return raw ? JSON.parse(raw) : null;
}

export function getAllEntries(): WorkEntry[] {
  const entries: WorkEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith('pointeuse_')) continue;
    const raw = localStorage.getItem(k);
    if (raw) entries.push(JSON.parse(raw));
  }
  return entries;
}

export function getDurationMinutes(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let d = eh * 60 + em - (sh * 60 + sm);
  if (d < 0) d += 1440;
  return d;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}`;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
