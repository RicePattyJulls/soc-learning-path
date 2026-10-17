import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import type { Question, Response } from '../education';
import { lessonUrl } from '../lib/catalog';
import { grade } from '../lib/learning';
import { animatePresentation,focusLearningElement } from '../lib/presentation';

export default function QuestionCard({ question: q, response: savedResponse, mode, onAnswer }: {
  question: Question; response?: Response; mode: 'practice' | 'assessment' | 'review'; onAnswer: (answer: string[]) => void;
}) {
  const [localResponse, setLocalResponse] = useState<Response>();
  const response = mode === 'review' ? localResponse : savedResponse;
  const options = [...q.options].sort((a, b) => ((a.id + q.id).split('').reduce((n, c) => n + c.charCodeAt(0), 0) % 37) - ((b.id + q.id).split('').reduce((n, c) => n + c.charCodeAt(0), 0) % 37));
  const [answer, setAnswer] = useState<string[]>(response?.answer || (q.type === 'order' ? options.map(o => o.id).reverse() : q.type === 'match' ? q.rows!.map(() => '') : []));
  const [editing, setEditing] = useState(mode === 'review' || !response);
  const feedback = useRef<HTMLDivElement>(null);
  const shown = !editing && response;
  useEffect(() => {
    if(!shown)return;
    focusLearningElement(feedback.current);
    const animation=animatePresentation(feedback.current,[{opacity:.65,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],'feedback');
    return()=>animation?.cancel();
  }, [response?.at, !!shown]);
  const move = (index: number, delta: number) => setAnswer(values => { const copy = [...values]; [copy[index], copy[index + delta]] = [copy[index + delta], copy[index]]; return copy; });
  const ready = q.type === 'match' ? answer.length === q.rows!.length && answer.every(Boolean) : answer.length > 0;
  const submit = () => { if (!ready) return; setLocalResponse({ answer, correct: grade(q, answer), at: Date.now() }); onAnswer(answer); setEditing(false); };
  const selected = q.options.filter(o => response?.answer.includes(o.id));
  return <div className="question-card" data-question={q.id} data-type={q.type}>
    {q.didactic ? <span className="educational-label">Situación didáctica basada en los apuntes</span> : null}
    <fieldset disabled={!!shown}><legend>{q.prompt}</legend>
      {q.type === 'match' ? <div className="matching-rows">{q.rows!.map((row, i) => <label key={row.id}><span>{row.label}</span><select name={`relacion-${q.id}-${row.id}`} value={answer[i] || ''} onChange={event => setAnswer(values => values.map((value, n) => n === i ? event.target.value : value))}><option value="">Elige una relación…</option>{options.map(option => <option key={option.id} value={option.id}>{option.text}</option>)}</select></label>)}</div> :
        q.type === 'order' ? <ol className="ordering-rows">{answer.map((id, i) => <li key={id}><span className="order-number">{i + 1}</span><span>{q.options.find(o => o.id === id)?.text}</span><span className="order-controls"><button type="button" disabled={i === 0 || !!shown} aria-label={`Subir paso: ${q.options.find(o => o.id === id)?.text}`} onClick={() => move(i, -1)}><ArrowUp size={17} aria-hidden="true" /></button><button type="button" disabled={i === answer.length - 1 || !!shown} aria-label={`Bajar paso: ${q.options.find(o => o.id === id)?.text}`} onClick={() => move(i, 1)}><ArrowDown size={17} aria-hidden="true" /></button></span></li>)}</ol> :
        <div className="answer-options">{options.map(option => <label key={option.id} className={answer.includes(option.id) ? 'selected' : ''}><input type={q.type === 'multi' ? 'checkbox' : 'radio'} name={`respuesta-${q.id}`} value={option.id} checked={answer.includes(option.id)} onChange={event => setAnswer(q.type === 'multi' ? event.target.checked ? [...answer, option.id] : answer.filter(id => id !== option.id) : [option.id])} /><span>{option.text}</span></label>)}</div>}
    </fieldset>
    {!shown ? <button className="button primary check-answer" disabled={!ready} onClick={submit}>Comprobar respuesta</button> : <div ref={feedback} tabIndex={-1} role="status" aria-live="polite" className={`answer-feedback ${response.correct ? 'correct' : 'incorrect'}`}>
      <h3>{response.correct ? <CheckCircle2 size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}{response.correct ? '¡Bien razonado!' : 'Vamos a revisar el concepto'}</h3>
      {selected.filter(o => o.why).map(o => <p key={o.id}>{o.why}</p>)}<p>{q.explanation}</p>
      {!response.correct ? <div className="correct-solution"><b>Respuesta respaldada por el documento</b><ol>{q.solution.map((id, i) => <li key={`${id}-${i}`}>{q.type === 'match' ? `${q.rows![i].label}: ` : ''}{q.options.find(o => o.id === id)?.text}</li>)}</ol></div> : null}
      <details className="answer-source"><summary>Consultar el fundamento en SC-200.md</summary>{q.references.map((ref, i) => <div key={i}><p>Líneas {ref.line}–{ref.endLine}</p><blockquote>{ref.quote}</blockquote></div>)}<a href={`${lessonUrl(q.references[0].lessonId)}?modo=apuntes`}>Abrir mis apuntes originales</a></details>
      {mode === 'assessment' ? <p className="attempt-note">Cuenta tu primera respuesta de este intento. Podrás repetir la evaluación al terminar; no se duplica el XP.</p> : <button className="button secondary" onClick={() => { setEditing(true); setAnswer(q.type === 'order' ? options.map(o => o.id).reverse() : q.type === 'match' ? q.rows!.map(() => '') : []); }}><RotateCcw size={16} aria-hidden="true" />{response.correct ? 'Practicar de nuevo' : 'Volver a intentarlo'}</button>}
    </div>}
  </div>;
}
