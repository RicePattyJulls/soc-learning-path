// Programación de repaso espaciado del Mundo SOC.
// Módulo puro: no importa nada, para que progreso y vistas puedan usarlo sin ciclos.
export const DAY = 86_400_000;
export const INTERVALS = [1, 3, 7, 16, 35];
export type Band = 'good' | 'partial' | 'weak';

export interface Schedule {
  due: number | null;
  interval: number;
  streak: number;
  lapses: number;
  band: Band | null;
  updated: number;
}

export const emptySchedule = (): Schedule => ({ due: null, interval: 0, streak: 0, lapses: 0, band: null, updated: 0 });
export const bandFor = (ratio: number): Band => (ratio >= 0.75 ? 'good' : ratio >= 0.5 ? 'partial' : 'weak');
const RANK: Record<Band, number> = { weak: 0, partial: 1, good: 2 };

// Un veredicto nuevo solo reprograma si el caso ya toca o si empeora. Así,
// volver a marcar la misma nota el mismo día no infla el intervalo y editar la
// rúbrica criterio a criterio no reescribe la fecha con cada clic.
export function scheduleFrom(previous: Schedule, ratio: number, now: number): Schedule {
  const band = bandFor(ratio);
  const isDue = previous.due === null || now >= previous.due;
  if (!isDue && !(previous.band !== null && RANK[band] < RANK[previous.band])) return previous;
  const lapse = previous.band === 'good' && band !== 'good' ? 1 : 0;
  if (band === 'good') {
    const streak = previous.band === 'good' ? previous.streak + 1 : 1;
    const interval = INTERVALS[Math.min(streak, INTERVALS.length) - 1];
    return { due: now + interval * DAY, interval, streak, lapses: previous.lapses, band, updated: now };
  }
  if (band === 'partial') return { due: now + DAY, interval: 1, streak: 0, lapses: previous.lapses + lapse, band, updated: now };
  return { due: now, interval: 0, streak: 0, lapses: previous.lapses + lapse, band, updated: now };
}

export function dueLabel(due: number | null, now: number): string {
  if (due === null) return 'sin programar';
  const days = Math.round((due - now) / DAY);
  if (due <= now) {
    const overdue = Math.floor((now - due) / DAY);
    return overdue <= 0 ? 'toca hoy' : `vencido hace ${overdue} ${overdue === 1 ? 'día' : 'días'}`;
  }
  if (days <= 0) return 'toca hoy';
  if (days === 1) return 'mañana';
  if (days < 30) return `en ${days} días`;
  const months = Math.round(days / 30);
  return `en ${months} ${months === 1 ? 'mes' : 'meses'}`;
}
