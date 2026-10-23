import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Compass, Flag, LockKeyhole, Network, RefreshCw, Target, Trophy } from 'lucide-react';
import { ProgressBar, Xp } from '../components/Primitives';
import { catalog, fetchSolutions, lessonById, lessonUrl, stageById, stageUrl } from './data';
import { useWindowsAdContent } from './hooks';
import { activeLesson, available, passed, recordFor, studied, type Action } from './progress';
import Markdown from './Markdown';
import LessonFrame from './LessonFrame';
import { connectionMarkdown, learningMarkdown, missionIntroduction, readerStages, sourceMarkdown } from './reader-presentation';
import type { Lesson, LessonContent, Solutions, Store } from './types';

type Send = (lesson: Lesson, content: LessonContent, action: Action) => void;
export default function Reader({ id, params, store, send }: { id: string; params: URLSearchParams; store: Store; send: Send }) {
  const lesson = lessonById.get(id), otherAttempt = activeLesson(store);
  const canOpen = lesson && available(store, lesson) && (!otherAttempt || otherAttempt.id === id);
  const content = useWindowsAdContent(canOpen ? lesson : undefined);
  if (!lesson) return <section className="rd-panel"><h1>Esta lección no existe</h1><a href="#/windows-ad/ruta">Volver al mundo Windows + AD</a></section>;
  if (otherAttempt && otherAttempt.id !== id) return <section className="rd-panel"><h1>Hay una evaluación en curso</h1><p>Termina las dos preguntas para volver al resto de lecciones.</p><a className="button primary" href={lessonUrl(otherAttempt.id, 'evalua')}>Continuar evaluación</a></section>;
  if (!canOpen) return <section className="rd-panel"><LockKeyhole size={30} aria-hidden="true"/><h1>{lesson.title}</h1><p>Completa el estudio y aprueba la teoría de sus prerrequisitos:</p><ul>{lesson.prerequisites.map(previous => <li key={previous}><a href={lessonUrl(previous)}>{lessonById.get(previous)?.title ?? previous}</a></li>)}</ul><a className="button secondary" href={stageUrl(lesson.stageId, lesson.id)}>Volver al mapa de etapa</a></section>;
  if (content.error) return <section className="rd-panel" role="alert"><h1>{lesson.title}</h1><p>{content.error}</p><button className="button secondary" onClick={content.retry}>Reintentar</button><a href={stageUrl(lesson.stageId, lesson.id)}>Volver al mapa</a></section>;
  if (!content.data) return <p className="rd-panel" role="status">Preparando tu lección…</p>;
  return <LessonReader key={`${id}:${lesson.revision}`} lesson={lesson} content={content.data} params={params} store={store} send={send}/>;
}
export function LessonReader({ lesson, content, params, store, send }: { lesson: Lesson; content: LessonContent; params: URLSearchParams; store: Store; send: Send }) {
  const record = recordFor(store, lesson), active = record.active ? record.attempts[record.active] : undefined;
  const selectedPhase = params.get('fase') ?? 'mision';
  const phase = active ? 'evalua' : [...readerStages.map(s => s.id), 'fuente', 'referencias'].includes(selectedPhase) ? selectedPhase : 'mision';
  const selected = readerStages.some(s => s.id === phase) ? phase : 'conecta';
  const stageIndex = readerStages.findIndex(s => s.id === selected);
  const parsedStep = Number(params.get('paso') ?? 0), step = Number.isInteger(parsedStep) ? Math.min(2, Math.max(0, parsedStep)) : 0;
  const stepContent = content.study[step], studyComplete = studied(record, lesson), theoryComplete = passed(record, lesson);
  const resume = Math.max(0, content.study.findIndex(s => !record.seen.includes(s.id)));
  const latest = Object.values(record.attempts).filter(a => a.finished !== null).sort((a, b) => b.started - a.started)[0];
  const [solutions, setSolutions] = useState<Solutions>();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const act = (action: Action) => send(lesson, content, action);
  useEffect(() => { send(lesson, content, { type: 'visit' }); }, [lesson.id, content.revision, send]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.getElementById('rd-reading-title')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [content.revision]);
  useEffect(() => { if (active) setSolutions(undefined); }, [active?.id]);
  const navigate = (next: string, nextStep = step) => { if (!active) location.hash = lessonUrl(lesson.id, next, nextStep); };
  const loadSolutions = async () => {
    setBusy(true); setError('');
    try { const data = await fetchSolutions(lesson); setSolutions(data); return data; }
    catch { setError('No se pudo verificar el solucionario. Tu respuesta sigue guardada; reintenta.'); return undefined; }
    finally { setBusy(false); }
  };
  const start = () => { setSolutions(undefined); setError(''); act({ type: 'start', attemptId: crypto.randomUUID() }); location.hash = lessonUrl(lesson.id, 'evalua'); };
  const finish = async () => {
    if (!active) return;
    const data = await loadSolutions();
    if (data) act({ type: 'finish', attemptId: active.id, solutions: data });
  };
  const nextLesson = catalog.lessons.find(l => l.id !== lesson.id && l.prerequisites.includes(lesson.id) && available(store, l));
  const Icon = selected === 'mision' ? Compass : selected === 'aprende' ? BookOpen : selected === 'conecta' ? Flag : Target;
  return <LessonFrame title={lesson.title} region={stageById.get(lesson.stageId)?.title ?? lesson.stageId} status={theoryComplete ? 'Teoría aprobada' : studyComplete ? 'Estudio completado' : 'En curso'} studied={record.seen.length} current={selected} active={!!active} done={{ aprende: studyComplete, practica: record.practiceSubmitted, evalua: theoryComplete }} back={stageUrl(lesson.stageId, lesson.id)} onPhase={id => navigate(id, id === 'aprende' ? resume : step)}
    original={!active ? <button className="button secondary original-toggle" onClick={() => navigate('fuente')}><BookOpen size={17} aria-hidden="true"/>Ver fuente editorial completa</button> : undefined}
    context={<aside className="rd-context-pane" aria-label="Tu bitácora de Windows + AD"><div className="pane-heading"><Network size={21} aria-hidden="true"/><div><h2>Tu bitácora Windows + AD</h2><span>{lesson.id}</span></div></div><div className="rd-context-body"><p><strong>{stageById.get(lesson.stageId)?.title}</strong></p><p>{active ? 'Evaluación en curso. Entrega el intento antes de consultar los materiales.' : lesson.objective}</p><ProgressBar value={theoryComplete ? 100 : 0} label="Teoría aprobada de esta lección de Windows + AD"/><p>{theoryComplete ? 'Teoría aprobada' : 'Teoría pendiente'} · Práctica documental</p><p>Tu respuesta se guarda en este navegador. Los laboratorios requieren ejecución aparte.</p>{!active ? <nav aria-label="Material complementario de Windows + AD"><button onClick={() => navigate('aprende', resume)}>Repasar enseñanza</button><button onClick={() => navigate('referencias')}>Referencias</button><a href="#/windows-ad/recursos">Laboratorios y recursos</a></nav> : null}</div></aside>}
    footer={!active && nextLesson ? <a href={lessonUrl(nextLesson.id)}>Lección siguiente<ArrowRight size={17} aria-hidden="true"/></a> : <a href="#/windows-ad/progreso">Ver mi bitácora<Trophy size={17} aria-hidden="true"/></a>}>
        <span className="activity-symbol"><Icon size={27} aria-hidden="true"/></span><span className="educational-label">Sección {stageIndex + 1} de 5 · {readerStages[stageIndex].title} · Mundo Windows + AD</span>
        {error ? <p className="rd-error" role="alert">{error}</p> : null}
        {phase === 'mision' ? <>
          <h2 id="rd-reading-title" tabIndex={-1}>Tu misión en esta lección</h2><p className="lesson-introduction">{missionIntroduction(content)}</p><ul className="learning-goals"><li><Target size={17} aria-hidden="true"/>{lesson.objective}</li></ul><div className="lesson-reward-note"><Xp>Hasta 20 XP de aprendizaje</Xp><span>Completar el estudio suma 5 XP y aprobar la teoría, 15 XP. Los reintentos conservan tu historial sin repetir recompensas.</span></div>{record.seen.length ? <p className="phase-hint">{studyComplete ? 'Ya completaste los tres pasos. Puedes repasarlos y continuar con tu práctica.' : `Continuarás en el paso ${resume + 1} de 3.`}</p> : null}<button className="button primary" onClick={() => navigate('aprende', resume)}>{record.seen.length ? 'Continuar aprendiendo' : 'Empezar a aprender'}<ArrowRight size={18} aria-hidden="true"/></button>
        </> : phase === 'fuente' ? <><h2 id="rd-reading-title" tabIndex={-1}>Fuente editorial completa</h2><p className="lesson-introduction">Consulta la enseñanza, el caso y las actividades de esta lección. Las soluciones se contrastan en Practica y después de entregar la evaluación.</p><Markdown>{sourceMarkdown(content)}</Markdown></> : phase === 'referencias' ? <><h2 id="rd-reading-title" tabIndex={-1}>Referencias y ampliación</h2><Markdown>{content.referencesMarkdown.replace(/^##[^\n]*\n+/, '')}</Markdown></> : phase === 'conecta' ? <>
          <h2 id="rd-reading-title" tabIndex={-1}>Consolida lo aprendido</h2><p className="lesson-introduction">Relaciona el mecanismo y tu respuesta con las decisiones que tomarías en una investigación o evaluación de red.</p><ul className="learning-goals"><li><Target size={17} aria-hidden="true"/>{lesson.objective}</li></ul><Markdown>{connectionMarkdown(content)}</Markdown>{record.practiceSubmitted ? <div className="rd-reflection"><h3>Tu razonamiento</h3><p>{record.practice}</p></div> : <p className="rd-notice">Guarda tu respuesta en Practica para contrastar tus ideas antes de evaluar.</p>}<div className="activity-actions"><button className="button secondary" onClick={() => navigate('practica')}>Revisar mi práctica</button><button className="button primary" onClick={() => navigate('evalua')}>Ir a Demuestra<ArrowRight size={17} aria-hidden="true"/></button></div>
        </> : phase === 'aprende' ? <>
          <div className="rd-step-heading"><span>Paso {step + 1} de 3</span><span>{record.seen.includes(stepContent.id) ? 'Estudiado' : 'Por estudiar'}</span></div><h2 id="rd-reading-title" tabIndex={-1}>{stepContent.title}</h2><Markdown>{learningMarkdown(content, step)}</Markdown>
          <nav className="rd-step-nav" aria-label="Pasos de estudio"><button className="button secondary" disabled={step === 0} onClick={() => navigate('aprende', step - 1)}><ArrowLeft size={16} aria-hidden="true"/>Anterior</button><button className="button primary" onClick={() => { act({ type: 'seen', stepId: stepContent.id }); navigate(step < 2 ? 'aprende' : 'practica', Math.min(2, step + 1)); }}>{record.seen.includes(stepContent.id) ? step < 2 ? 'Siguiente paso' : 'Ir a la práctica' : step < 2 ? 'Entendido, continuar' : 'Completar estudio'}<ArrowRight size={16} aria-hidden="true"/></button></nav>
        </> : phase === 'practica' ? <>
          <h2 id="rd-reading-title" tabIndex={-1}>Resuelve antes de mirar</h2><Markdown>{content.practice.markdown}</Markdown>
          <label className="rd-answer-label" htmlFor="rd-practice">Tu respuesta razonada</label><textarea id="rd-practice" value={record.practice} rows={8} maxLength={12000} onChange={event => { setSolutions(undefined); act({ type: 'practice', text: event.target.value }); }} placeholder="Relaciona los datos, explica tu decisión e indica qué queda por comprobar." aria-describedby="rd-practice-note"/>
          <p id="rd-practice-note" className="rd-helper">Se guarda en este navegador. Es una práctica documental, sin nota automática ni acreditación de ejecución real.</p>
          {!studyComplete ? <p className="rd-notice">Completa los tres pasos de Aprende para entregar tu respuesta.</p> : null}
          <div className="rd-actions"><button className="button primary" disabled={!studyComplete || !record.practice.trim() || record.practiceSubmitted} onClick={() => act({ type: 'submitPractice' })}>{record.practiceSubmitted ? <><Check size={17} aria-hidden="true"/>Respuesta guardada</> : 'Guardar mi respuesta'}</button>{record.practiceSubmitted ? <button className="button secondary" disabled={busy} onClick={() => void loadSolutions()}>{busy ? 'Cargando…' : 'Contrastar con la solución'}</button> : null}</div>
          {record.practiceSubmitted && solutions ? <section className="rd-feedback" aria-label="Solución de referencia de la práctica"><h3>Compara tu razonamiento</h3><Markdown>{solutions.practice.referenceAnswer}</Markdown><h4>Criterios para revisar tu respuesta</h4><ul>{solutions.practice.rubric.map(r => <li key={r.criterion}>{r.evidence}</li>)}</ul><p>Una alternativa puede ser válida si sus supuestos y límites están justificados.</p></section> : null}
          {record.practiceSubmitted ? <button className="button primary rd-bottom-action" onClick={() => navigate('conecta')}>Conectar ideas<ArrowRight size={17} aria-hidden="true"/></button> : null}
        </> : <>
          <h2 id="rd-reading-title" tabIndex={-1}>{active ? 'Demuestra lo aprendido' : latest ? 'Tu resultado' : 'Comprueba tu comprensión'}</h2>
          {active ? <form onSubmit={event => { event.preventDefault(); void finish(); }}><p>Acierta las dos preguntas. Puedes revisar tus elecciones antes de entregar.</p>{content.questions.map((question, i) => <fieldset key={question.id} className="rd-question"><legend>{i + 1}. {question.prompt}</legend>{question.options.map(option => <label key={option.id} className={active.answers[question.id] === option.id ? 'selected' : ''}><input type="radio" name={question.id} value={option.id} checked={active.answers[question.id] === option.id} disabled={busy} onChange={() => act({ type: 'choose', attemptId: active.id, questionId: question.id, optionId: option.id })}/><span><b>{option.id}.</b> {option.text}</span></label>)}</fieldset>)}<button className="button primary" type="submit" disabled={busy || content.questions.some(q => !active.answers[q.id])}>{busy ? 'Comprobando…' : 'Entregar evaluación'}</button><p className="rd-helper">El intento se guarda aunque cierres la página. Las soluciones aparecen después de entregar.</p></form> : <>
            {latest ? <section className={`rd-result ${latest.score === 2 ? 'success' : ''}`} aria-label="Resultado de la evaluación"><CheckCircle2 size={32} aria-hidden="true"/><h3>{latest.score === 2 ? 'Dos conexiones bien hechas' : 'Una oportunidad para afinar'}</h3><p><strong>{latest.score} / 2 respuestas correctas</strong></p><p>{latest.score === 2 ? 'Teoría aprobada. Has sumado 15 XP una sola vez por esta lección.' : 'Revisa el mecanismo y vuelve a intentarlo. Conservamos tu historial.'}</p><button className="button secondary" disabled={busy} onClick={() => void loadSolutions()}>{busy ? 'Cargando…' : 'Ver explicaciones'}</button></section> : <p>Dos preguntas sobre lo que acabas de estudiar. Necesitas acertar ambas para avanzar.</p>}
            {latest && solutions ? <section className="rd-feedback" aria-label="Explicaciones del intento">{content.questions.map(question => { const answer = solutions.questions.find(q => q.id === question.id)!; return <div key={question.id}><h3>{question.prompt}</h3><p>Tu elección: {latest.answers[question.id]}. Correcta: {answer.correctOptionId}.</p><Markdown>{answer.explanation}</Markdown></div>; })}</section> : null}
            {!studyComplete || !record.practiceSubmitted ? <div className="rd-notice"><p>Completa los tres pasos de Aprende y guarda tu respuesta de práctica antes de evaluar.</p><button className="button secondary" onClick={() => navigate(studyComplete ? 'practica' : 'aprende', 0)}>Continuar {studyComplete ? 'práctica' : 'estudio'}</button></div> : <button className="button primary" onClick={start}><RefreshCw size={17} aria-hidden="true"/>{latest ? 'Nuevo intento' : 'Empezar evaluación'}</button>}
            {theoryComplete && nextLesson ? <a className="button primary rd-bottom-action" href={lessonUrl(nextLesson.id)}>Continuar con {nextLesson.title}<ArrowRight size={17} aria-hidden="true"/></a> : null}
          </>}
        </>}
        {!active && readerStages.some(s => s.id === phase) ? <nav className="activity-actions rd-stage-continuation" aria-label="Recorrer las secciones de la lección">{stageIndex > 0 ? <button className="button secondary" onClick={() => navigate(readerStages[stageIndex - 1].id)}>Sección anterior<ArrowLeft size={17} aria-hidden="true"/></button> : null}{stageIndex < 4 ? <button className="button secondary" onClick={() => navigate(readerStages[stageIndex + 1].id, readerStages[stageIndex + 1].id === 'aprende' ? resume : step)}>Siguiente sección<ArrowRight size={17} aria-hidden="true"/></button> : null}</nav> : null}
  </LessonFrame>;
}
