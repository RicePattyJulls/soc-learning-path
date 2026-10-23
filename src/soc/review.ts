// Cola de repaso espaciado: qué toca hoy y qué viene después.
// La cola se deriva del progreso guardado, así que no hace falta estado de sesión.
import { catalog } from './data';
import { DAY, dueLabel } from './schedule';
import { recordFor, statusFor } from './progress';
import type { CaseEntry, CaseRecord, CaseStatus, Store } from './types';

export interface ReviewItem {
  entry: CaseEntry;
  record: CaseRecord;
  status: CaseStatus;
  due: number;
  overdueDays: number;
}

export interface UpcomingItem {
  entry: CaseEntry;
  status: CaseStatus;
  due: number;
  days: number;
}

export function dueItems(store: Store, now: number): ReviewItem[] {
  return catalog.cases.flatMap(entry => {
    const record = recordFor(store, entry);
    const due = record.review.due;
    if (due === null || due > now) return [];
    return [{ entry, record, status: statusFor(entry, record), due, overdueDays: Math.floor((now - due) / DAY) }];
  }).sort((a, b) => a.due - b.due || a.entry.id.localeCompare(b.entry.id));
}

export function upcomingItems(store: Store, now: number): UpcomingItem[] {
  return catalog.cases.flatMap(entry => {
    const record = recordFor(store, entry);
    const due = record.review.due;
    if (due === null || due <= now) return [];
    return [{ entry, status: statusFor(entry, record), due, days: Math.max(1, Math.round((due - now) / DAY)) }];
  }).sort((a, b) => a.due - b.due || a.entry.id.localeCompare(b.entry.id));
}

// Agrupa los próximos repasos por día para no listar cuarenta fechas seguidas.
export function upcomingByDay(items: UpcomingItem[]) {
  const buckets = new Map<number, UpcomingItem[]>();
  for (const item of items) {
    const list = buckets.get(item.days);
    if (list) list.push(item);
    else buckets.set(item.days, [item]);
  }
  return [...buckets.entries()].sort((a, b) => a[0] - b[0]).map(([days, group]) => ({ days, items: group }));
}

export function reviewOverview(store: Store, now: number) {
  const due = dueItems(store, now);
  const upcoming = upcomingItems(store, now);
  const scheduled = due.length + upcoming.length;
  const unscheduled = catalog.cases.length - scheduled;
  return { due, upcoming, scheduled, unscheduled, nextDue: upcoming[0] ?? null };
}

export function reviewLabel(due: number | null, now: number) {
  return dueLabel(due, now);
}
