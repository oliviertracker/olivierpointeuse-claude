import { useState, useEffect } from 'react';
import {
  WorkType, WORK_TYPE_LABELS, DEFAULT_TIMES,
  saveEntry, getEntry, getDurationMinutes, formatDuration, todayISO,
} from '../utils/storage';
import { formatDateFR } from '../utils/dateUtils';

const TYPE_COLORS: Record<WorkType, string> = {
  midi: '#ff9800',
  soir: '#7c4dff',
  journee: '#1a73e8',
};

export default function HomeScreen() {
  const today = new Date();
  const dateStr = todayISO();

  const [type, setType] = useState<WorkType>('midi');
  const [worked, setWorked] = useState(false);
  const [startTime, setStartTime] = useState('11:30');
  const [endTime, setEndTime] = useState('15:00');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const entry = getEntry(dateStr, type);
    if (entry) {
      setWorked(entry.worked);
      setStartTime(entry.startTime || DEFAULT_TIMES[type].start);
      setEndTime(entry.endTime || DEFAULT_TIMES[type].end);
    } else {
      setWorked(false);
      setStartTime(DEFAULT_TIMES[type].start);
      setEndTime(DEFAULT_TIMES[type].end);
    }
    setSaved(false);
  }, [type, dateStr]);

  const handleSave = () => {
    saveEntry({ date: dateStr, type, worked, startTime: worked ? startTime : '', endTime: worked ? endTime : '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const duration = worked ? getDurationMinutes(startTime, endTime) : 0;
  const color = TYPE_COLORS[type];

  return (
    <div className="screen">
      <div className="date-card" style={{ borderLeftColor: color }}>
        <div className="date-label">Aujourd'hui</div>
        <div className="date-text">{formatDateFR(today)}</div>
      </div>

      <div className="section-label">Type de service</div>
      <div className="type-col">
        {(Object.entries(WORK_TYPE_LABELS) as [WorkType, string][]).map(([k, label]) => (
          <button
            key={k}
            className="type-btn"
            style={type === k ? { backgroundColor: TYPE_COLORS[k], borderColor: TYPE_COLORS[k], color: '#fff' } : {}}
            onClick={() => setType(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="worked-row">
          <div>
            <div className="worked-label">Travaillé</div>
            <div className="worked-sub">
              {worked ? 'Oui — saisir les horaires ci-dessous' : 'Non — jour non travaillé'}
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={worked} onChange={e => setWorked(e.target.checked)} />
            <span className="slider" style={worked ? { backgroundColor: '#34a853' } : {}} />
          </label>
        </div>
      </div>

      {worked && (
        <div className="card">
          <div className="times-title">Horaires</div>

          <div className="time-row">
            <label className="time-label" htmlFor="start">Début</label>
            <input
              id="start"
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="time-input"
              style={{ color }}
            />
          </div>

          <div className="separator" />

          <div className="time-row">
            <label className="time-label" htmlFor="end">Fin</label>
            <input
              id="end"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="time-input"
              style={{ color }}
            />
          </div>

          {duration > 0 && (
            <div className="duration-badge" style={{ backgroundColor: color + '18', color }}>
              Durée : {formatDuration(duration)}
            </div>
          )}
        </div>
      )}

      <button
        className="save-btn"
        style={{ backgroundColor: saved ? '#34a853' : color }}
        onClick={handleSave}
      >
        {saved ? '✓  Journée enregistrée !' : 'Enregistrer la journée'}
      </button>
    </div>
  );
}
