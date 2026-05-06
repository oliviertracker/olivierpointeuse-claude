import { useState, useEffect } from 'react';
import {
  getAllEntries, WorkEntry, getDurationMinutes, formatDuration, WorkType, WORK_TYPE_LABELS,
} from '../utils/storage';
import { formatDateShort, formatMonthYear, getMonday, formatWeekRange } from '../utils/dateUtils';

type Period = 'jour' | 'semaine' | 'mois' | 'annee';

const TYPE_COLORS: Record<WorkType, string> = {
  midi: '#ff9800',
  soir: '#7c4dff',
  journee: '#1a73e8',
};

interface DaySummary { date: string; entries: WorkEntry[]; totalMin: number; }
interface GroupSummary { key: string; label: string; totalMin: number; workedDays: number; }

function entryMin(e: WorkEntry) {
  return e.worked && e.startTime && e.endTime ? getDurationMinutes(e.startTime, e.endTime) : 0;
}

function buildDays(entries: WorkEntry[]): DaySummary[] {
  const map: Record<string, WorkEntry[]> = {};
  for (const e of entries) {
    if (!map[e.date]) map[e.date] = [];
    map[e.date].push(e);
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, ents]) => ({ date, entries: ents, totalMin: ents.reduce((s, e) => s + entryMin(e), 0) }));
}

function groupDays(days: DaySummary[], keyFn: (d: DaySummary) => string, labelFn: (k: string) => string): GroupSummary[] {
  const map: Record<string, DaySummary[]> = {};
  for (const d of days) { const k = keyFn(d); if (!map[k]) map[k] = []; map[k].push(d); }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([k, ds]) => ({ key: k, label: labelFn(k), totalMin: ds.reduce((s, d) => s + d.totalMin, 0), workedDays: ds.filter(d => d.totalMin > 0).length }));
}

export default function SummaryScreen() {
  const [period, setPeriod] = useState<Period>('semaine');
  const [days, setDays] = useState<DaySummary[]>([]);

  useEffect(() => { setDays(buildDays(getAllEntries())); }, []);

  const totalMin = days.reduce((s, d) => s + d.totalMin, 0);
  const totalDays = days.filter(d => d.totalMin > 0).length;

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'jour', label: 'Jour' },
    { key: 'semaine', label: 'Semaine' },
    { key: 'mois', label: 'Mois' },
    { key: 'annee', label: 'Année' },
  ];

  const weeks = groupDays(days, d => getMonday(d.date), k => `Sem. ${formatWeekRange(k)}`);
  const months = groupDays(days, d => d.date.slice(0, 7), formatMonthYear);
  const years = groupDays(days, d => d.date.slice(0, 4), k => k);

  return (
    <div>
      <div className="stat-bar">
        <div className="stat-item">
          <div className="stat-value">{formatDuration(totalMin)}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">{totalDays}</div>
          <div className="stat-label">Jours travaillés</div>
        </div>
      </div>

      <div className="period-row">
        {PERIODS.map(p => (
          <button key={p.key} className={`period-btn ${period === p.key ? 'active' : ''}`} onClick={() => setPeriod(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="list">
        {period === 'jour' && (days.length === 0 ? <EmptyState /> : days.map(d => (
          <div key={d.date} className="card">
            <div className="row-between">
              <span className="card-title">{formatDateShort(d.date)}</span>
              <span className="card-hours" style={d.totalMin > 0 ? { color: '#1a73e8' } : {}}>
                {d.totalMin > 0 ? formatDuration(d.totalMin) : '—'}
              </span>
            </div>
            <div className="chip-row">
              {d.entries.map(e => (
                <span key={e.type} className="chip"
                  style={{ backgroundColor: TYPE_COLORS[e.type] + (e.worked ? '22' : '10'), color: TYPE_COLORS[e.type], opacity: e.worked ? 1 : 0.5 }}>
                  {WORK_TYPE_LABELS[e.type]}{e.worked && e.startTime ? ` ${e.startTime}–${e.endTime}` : ' (absent)'}
                </span>
              ))}
            </div>
          </div>
        )))}
        {period === 'semaine' && <GroupList groups={weeks} />}
        {period === 'mois' && <GroupList groups={months} />}
        {period === 'annee' && <GroupList groups={years} />}
      </div>
    </div>
  );
}

function GroupList({ groups }: { groups: GroupSummary[] }) {
  if (groups.length === 0) return <EmptyState />;
  return <>{groups.map(g => (
    <div key={g.key} className="card">
      <div className="row-between">
        <span className="card-title">{g.label}</span>
        <span className="card-hours" style={g.totalMin > 0 ? { color: '#1a73e8' } : {}}>{g.totalMin > 0 ? formatDuration(g.totalMin) : '—'}</span>
      </div>
      <div className="card-sub">{g.workedDays} jour{g.workedDays > 1 ? 's' : ''} travaillé{g.workedDays > 1 ? 's' : ''}</div>
    </div>
  ))}</>;
}

function EmptyState() {
  return <div className="empty"><div className="empty-text">Aucune donnée</div><div className="empty-sub">Commencez à pointer depuis l'onglet Pointeuse</div></div>;
}
