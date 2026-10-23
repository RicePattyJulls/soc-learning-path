import { useState } from 'react';
import { BookOpenCheck, ExternalLink } from 'lucide-react';
import { caseUrl, catalog, caseById, mitreUrl, ordered } from './data';
import { useCaseAnswers, useCaseContent } from './hooks';
import type { CaseEntry, Query } from './types';

// Modo lectura: las 40 respuestas modelo listas para memorizar, sin responder,
// autoevaluarse ni programar fechas. No lee ni escribe progreso.
export default function Review() {
  const [nivel, setNivel] = useState('');
  const blocks = ordered.blocks.filter(block => !nivel || block.nivel === nivel);

  return <section className="soc-review">
    <div className="soc-page-title">
      <div>
        <p>Solo leer y memorizar</p>
        <h1>Repaso de respuestas</h1>
        <p>Las {catalog.cases.length} respuestas modelo ya resueltas. Abre un caso y léelo: pregunta, respuesta, plan, evidencias, contención y consultas. No hace falta escribir nada.</p>
      </div>
      <BookOpenCheck size={40} aria-hidden="true" />
    </div>

    <div className="soc-filters">
      <label>Nivel
        <select value={nivel} onChange={event => setNivel(event.target.value)}>
          <option value="">Todos</option>
          {ordered.levels.map(level => <option key={level.id} value={level.id}>{level.id} · {level.title}</option>)}
        </select>
      </label>
    </div>

    {blocks.map(block => <section key={block.id} className="soc-block" aria-labelledby={`soc-rv-${block.id}`}>
      <header><div><span className="soc-level-tag">{block.nivel}</span><h2 id={`soc-rv-${block.id}`}>{block.title}</h2></div><span className="soc-block-count">{block.caseIds.length} casos</span></header>
      <div className="soc-rv-list">
        {block.caseIds.map(id => caseById.get(id)).filter((entry): entry is CaseEntry => !!entry).map(entry => <CaseItem key={entry.id} entry={entry} />)}
      </div>
    </section>)}
  </section>;
}

function CaseItem({ entry }: { entry: CaseEntry }) {
  const [open, setOpen] = useState(false);
  return <details className="soc-rv-case" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary><b>{entry.id}</b><span>{entry.titulo}</span></summary>
    {open ? <CaseAnswer entry={entry} /> : null}
  </details>;
}

function CaseAnswer({ entry }: { entry: CaseEntry }) {
  const content = useCaseContent(entry);
  const answers = useCaseAnswers(entry, true);
  const solution = answers.data;
  if (content.error || answers.error) return <p className="soc-error" role="alert">No se pudo cargar o verificar este caso. Cierra y vuelve a abrirlo.</p>;
  if (!content.data || !solution) return <p role="status" className="soc-helper">Cargando la respuesta…</p>;

  return <div className="soc-rv-body">
    <p className="soc-case-question">{content.data.pregunta}</p>

    <section className="soc-rv-key">
      <h3>Respuesta modelo</h3>
      <p>{solution.respuesta_entrevista}</p>
    </section>

    <section>
      <h3>Plan</h3>
      <ol className="soc-steps">{solution.pasos.map(step => <li key={step.fase}><strong>{step.fase}</strong><span>{step.accion}</span></li>)}</ol>
    </section>

    <section>
      <h3>Hipótesis</h3>
      <ul>{solution.hipotesis.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section>
      <h3>Evidencia que mirar</h3>
      <ul>{solution.evidencias.map(item => <li key={item.dato}><b>{item.dato}</b>: {item.lectura}</li>)}</ul>
    </section>

    <section>
      <h3>Contención</h3>
      <p>{solution.contencion}</p>
      <h4>Escalar si</h4>
      <ul>{solution.escalation.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section>
      <h3>Falsos positivos</h3>
      <ul>{solution.falsos_positivos.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    {solution.kql.length ? <section><h3>Sentinel · KQL</h3>{solution.kql.map(query => <QueryBlock key={query.nombre} query={query} />)}</section> : null}
    {solution.spl.length ? <section><h3>Splunk · SPL</h3>{solution.spl.map(query => <QueryBlock key={query.nombre} query={query} />)}</section> : null}

    {solution.mitre.length ? <ul className="soc-mitre">{solution.mitre.map(item => <li key={item}><a href={mitreUrl(item)} target="_blank" rel="noreferrer">{item}</a></li>)}</ul> : null}

    <p className="soc-rv-more"><a href={caseUrl(entry.id)}><ExternalLink size={15} aria-hidden="true" />Abrir el caso completo</a></p>
  </div>;
}

function QueryBlock({ query }: { query: Query }) {
  return <div className="soc-query">
    <h4>{query.nombre}</h4>
    <pre><code>{query.consulta}</code></pre>
    <p>{query.interpretacion}</p>
  </div>;
}
