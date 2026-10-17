import { BookOpen, RotateCcw, Target } from 'lucide-react';
import { chapters, lessonMap, lessons, lessonUrl } from '../lib/catalog';
import { currentRecord, learningStatus } from '../lib/learning';
import { lessonStatus } from '../lib/progress';
import type { Progress } from '../types';

export default function Review({ progress }: { progress: Progress }) {
  const items = progress.learning ? lessons.flatMap(lesson => {
    const record = currentRecord(progress.learning!, lesson);
    return Object.entries(record.mistakes).filter(([, m]) => m.count > 0).map(([qid, mistake]) => ({ lesson, qid, mistake }));
  }) : [];
  const pending = lessons.filter(l => learningStatus(l, progress) === 'completed' && lessonStatus(l, chapters, progress, lessonMap) !== 'locked');
  return <div className="page-shell review-page"><div className="page-heading"><span className="page-heading-icon"><RotateCcw size={27} aria-hidden="true" /></span><div><h1>Los errores también enseñan</h1><p>Vuelve a las ideas difíciles. Repetir sirve para aprender; los XP de repaso se conceden una sola vez por lección.</p></div></div>
    <h2 className="standalone-heading">Conceptos que has necesitado revisar</h2>{items.length ? <div className="review-items">{items.map(({ lesson, qid, mistake }) => <article key={`${lesson.id}-${qid}`}><RotateCcw size={22} aria-hidden="true" /><div><h3>{lesson.title}</h3><p>{mistake.lastWrong > mistake.lastCorrect ? 'Respuesta pendiente de corregir' : 'Has vuelto a responder correctamente'} · {mistake.count} {mistake.count === 1 ? 'error registrado' : 'errores registrados'}</p></div><a className="button secondary" href={`${lessonUrl(lesson.id)}?fase=repaso&actividad=${encodeURIComponent(qid)}`}>Repasar concepto</a></article>)}</div> : <div className="review-empty"><Target size={28} aria-hidden="true" /><p>Todavía no hay respuestas incorrectas registradas. Cuando aparezcan, podrás revisarlas aquí con su explicación y fuente.</p><a className="text-link" href="#/ruta">Volver a mi ruta</a></div>}
    <h2 className="standalone-heading">Completadas, pendientes de dominio</h2>{pending.length ? <div className="review-items">{pending.map(lesson => <article key={lesson.id}><BookOpen size={23} aria-hidden="true" /><div><h3>{lesson.title}</h3><p>{lesson.learning?.coverage === 'reviewed' ? 'Practica y evalúate para demostrar lo aprendido.' : 'Estudio conservado; actividades evaluables pendientes de enriquecimiento.'}</p></div><a className="button secondary" href={`${lessonUrl(lesson.id)}?fase=${lesson.learning?.coverage === 'reviewed' ? 'practica' : 'resumen'}`}>{lesson.learning?.coverage === 'reviewed' ? 'Practicar' : 'Repasar apuntes'}</a></article>)}</div> : <p className="muted">Aquí aparecerán las lecciones estudiadas que aún no hayas dominado.</p>}
  </div>;
}
