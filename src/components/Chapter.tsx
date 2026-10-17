import RegionMap from './adventure/RegionMap';
import RegionNavigation from './adventure/RegionNavigation';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';
import { chapterMap, chapters, chapterUrl, lessonMap, lessonUrl } from '../lib/catalog';
import { chapterStatus, isComplete } from '../lib/progress';
import type { Progress } from '../types';
import { learningStatus, learningStatusText } from '../lib/learning';
import { ChapterIcon, StatusIcon, statusText, Xp } from './Primitives';

export default function Chapter({ id, progress, focusStation }: { id: string; progress: Progress; focusStation?: string }) {
  const chapter = chapterMap.get(id);
  if (!chapter) return <div className="page-shell empty-state"><h1>No se encuentra este capítulo</h1><a href="#/ruta">Volver a la ruta</a></div>;
  const index = chapters.indexOf(chapter), status = chapterStatus(chapter, chapters, progress, lessonMap);
  const done = chapter.lessonIds.filter(id => isComplete(lessonMap.get(id)!, progress)).length;
  const previous = chapters.slice(0, index).find(c => chapterStatus(c, chapters, progress, lessonMap) !== 'completed');
  return <div className="page-shell chapter-page"><a className="back-link" href={`#/ruta?nodo=${encodeURIComponent(chapter.id)}`}><ArrowLeft size={17} aria-hidden="true" />Volver al mapa del mundo</a><section className="chapter-intro"><span className="chapter-symbol"><ChapterIcon index={index} size={36} /></span><div><p>Etapa {index + 1} de {chapters.length} · {statusText[status]}</p><h1>{chapter.title}</h1><p>{chapter.lessonIds.length} lecturas del documento original · Línea {chapter.line}</p></div></section>
    <RegionNavigation chapter={chapter} progress={progress}/>
    {status === 'locked' ? <div className="notice"><LockKeyhole size={20} aria-hidden="true" /><div><b>Esta etapa se desbloquea al completar las anteriores.</b>{previous ? <p>Continúa en <a href={chapterUrl(previous.id)}>{previous.title}</a>.</p> : null}<p>Puedes consultar su índice mientras avanzas.</p></div></div> : null}
    <RegionMap key={chapter.id} chapter={chapter} progress={progress} focusStation={focusStation}/>
    <details className="region-original-index"><summary>Índice de lecturas y subapartados originales</summary><ol className="lesson-list">{chapter.lessonIds.map((id, i) => {
      const lesson = lessonMap.get(id)!, lessonState = status === 'locked' ? 'locked' : isComplete(lesson, progress) ? 'completed' : 'available';
      const body = <><span className={`lesson-list-icon ${lessonState}`}><StatusIcon status={lessonState} size={20} /></span><div className="lesson-list-main"><span className="muted">Lección {i + 1} · {learningStatusText[learningStatus(lesson, progress)]}</span><h2>{lesson.title}</h2><p>{lesson.learning?.coverage === 'reviewed' ? 'Actividades revisadas' : 'Estudio guiado · evaluación pendiente'} · Líneas {lesson.line}–{lesson.endLine}</p></div><Xp>{lesson.learning?.coverage === 'reviewed' ? 'Hasta 50 XP' : 'Hasta 10 XP'}</Xp>{lessonState !== 'locked' ? <ArrowRight size={19} aria-hidden="true" /> : null}</>;
      return <li key={id}>{lessonState === 'locked' ? <div className="lesson-row locked" aria-label={`${lesson.title}, bloqueada`}>{body}</div> : <a className="lesson-row" href={lessonUrl(id)}>{body}</a>}{lesson.sections.filter(s => s.depth > 2).length ? <details className="chapter-subsections"><summary>Ver subapartados del documento</summary><ul>{lesson.sections.filter(s => s.depth > 2).map(s => <li key={s.anchor}>{lessonState === 'locked' ? s.title : <a href={lessonUrl(id, s.anchor)}>{s.title}</a>}</li>)}</ul></details> : null}</li>;
    })}</ol></details>
    <nav className="chapter-navigation" aria-label="Entre capítulos">{index > 0 ? <a href={chapterUrl(chapters[index - 1].id)}><ArrowLeft size={17} aria-hidden="true" />Capítulo anterior</a> : <span />}{index < chapters.length - 1 ? <a href={chapterUrl(chapters[index + 1].id)}>Capítulo siguiente<ArrowRight size={17} aria-hidden="true" /></a> : null}</nav>
  </div>;
}
