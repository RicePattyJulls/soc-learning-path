import type { ReactNode } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { ProgressBar } from '../components/Primitives';
import { readerStages } from './reader-presentation';

// The academy's established reader layout, with Linux labels and slots.
// It owns no content, progress, XP or prerequisite decisions.
export default function LessonFrame({ title, region, status, studied, current, active, done, back, original, context, footer, onPhase, children }: {
  title: string; region: string; status: string; studied: number; current: string; active: boolean;
  done: Record<string, boolean>; back: string; original?: ReactNode; context: ReactNode; footer: ReactNode;
  onPhase: (id: string) => void; children: ReactNode;
}) {
  return <article className="page-shell academy-lesson rd-reader rd-course-reader">
    <a className="back-link" href={back}><ArrowLeft size={17} aria-hidden="true"/>Volver a la etapa</a>
    <div className="lesson-title-row"><div><p>{region}</p><h1>{title}</h1><div className="lesson-tags"><span className={`learning-status ${done.evalua ? 'completed' : 'in-progress'}`}>{status}</span><span>3 actividades · Hasta 20 XP de aprendizaje</span><span>Práctica de análisis</span></div></div>{original}</div>
    <div className="lesson-progress"><span>{studied} / 3 pasos estudiados</span><ProgressBar value={studied / 3 * 100} label="Progreso de estudio de esta lección de Linux"/></div>
    <div className="academy-grid">
      <aside className="lesson-phases"><nav aria-label="Cinco secciones de la lección de Linux">{readerStages.map((stage, i) => <button key={stage.id} type="button" disabled={active && stage.id !== 'evalua'} aria-current={current === stage.id ? 'step' : undefined} onClick={() => onPhase(stage.id)}><span>{i + 1}</span><b>{stage.title}</b>{done[stage.id] ? <Check size={16} role="img" aria-label={`${stage.title} completado`}/> : null}</button>)}</nav><p>Teoría y práctica documental.<br/>Avanza paso a paso.</p></aside>
      <section className="activity-surface rd-learning-surface rd-lesson-surface" aria-labelledby="rd-reading-title">{children}</section>
      {context}
    </div>
    <nav className="reader-navigation academy-navigation" aria-label="Entre lecciones de Linux"><a href={back}><ArrowLeft size={17} aria-hidden="true"/>Ver la etapa</a>{footer}</nav>
  </article>;
}
