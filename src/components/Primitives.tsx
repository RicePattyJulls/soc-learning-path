import { BookOpen, Check, Database, Fingerprint, LockKeyhole, Radar, Search, ShieldCheck, Sparkles, Swords, Workflow, Zap, FolderArchive, KeyRound, Bell, Network } from 'lucide-react';
import type { Status } from '../types';

const icons = [KeyRound, Fingerprint, ShieldCheck, Database, FolderArchive, Radar, Bell, Network, Search, Radar, Swords, Workflow, BookOpen];
export function ChapterIcon({ index, size = 25 }: { index: number; size?: number }) {
  const Icon = icons[index % icons.length];
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
export function StatusIcon({ status, size = 16 }: { status: Status; size?: number }) {
  return status === 'locked' ? <LockKeyhole size={size} aria-hidden="true" /> : status === 'completed' ? <Check size={size} aria-hidden="true" /> : <Sparkles size={size} aria-hidden="true" />;
}
export const statusText = { completed: 'Completado', available: 'Disponible', locked: 'Bloqueado' };
export function ProgressBar({ value, label, small = false }: { value: number; label: string; small?: boolean }) {
  return <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} className={`progress-track ${small ? 'small' : ''}`}><span style={{ transform: `scaleX(${Math.min(100, Math.max(0, value)) / 100})` }} /></div>;
}
export function Xp({ children }: { children: React.ReactNode }) {
  return <span className="xp"><Zap size={15} fill="currentColor" aria-hidden="true" />{children}</span>;
}
