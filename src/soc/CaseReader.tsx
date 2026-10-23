import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { boardUrl, caseUrl, caseById, mitreUrl, neighboursOf, siblingsOf } from './data';
import type { Action } from './progress';
import { useCaseAnswers, useCaseContent } from './hooks';
import type { Answers, CaseEntry, Query, Store } from './types';

type Send = (entry: CaseEntry, action: Action) => void;

// Modo lectura: la respuesta modelo se muestra directamente, sin responder ni autoevaluarse.
export default function CaseReader({ id, send }: { id: string; store?: Store; send: Send }) {
  const entry = caseById.get(id);
  if (!entry) return <section className="soc-panel"><h1>Este caso no existe</h1><a className="button secondary" href={boardUrl()}>Volver al tablero</a></section>;
  return <CaseShell key={`${entry.id}:${entry.revision}`} entry={entry} send={send} />;
}

function CaseShell({ entry, send }: { entry: CaseEntry; send: Send }) {
  const content = useCaseContent(entry);
  const solutions = useCaseAnswers(entry, true);
  const solution: Answers | undefined = solutions.data;
  const { previous, next } = neighboursOf(entry);
  const siblings = siblingsOf(entry);

  useEffect(() => { send(entry, { type: 'visit' }); }, [entry, send]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.getElementById('soc-case-title')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [entry.id]);

  return <article className="soc-reader">
    <nav className="soc-reader-back" aria-label="Navegación del caso">
      <a href={boardUrl()}><ArrowLeft size={16} aria-hidden="true" />Tablero de casos</a>
      <span>{entry.nivel} · {entry.bloque}</span>
    </nav>

    <header className="soc-case-head">
      <p className="soc-eyebrow">{entry.id}</p>
      <h1 id="soc-case-title" tabIndex={-1}>{entry.titulo}</h1>
      <p className="soc-case-question">{content.data?.pregunta ?? 'Cargando la pregunta…'}</p>
    </header>

    {content.error ? <section className="soc-panel" role="alert">
      <h2>No se pudo cargar el caso</h2>
      <p>{content.error}</p>
      <button className="button secondary" onClick={content.retry}>Reintentar</button>
    </section> : null}

    {content.data ? <section className="soc-scenario" aria-labelledby="soc-scenario-title">
      <h2 id="soc-scenario-title">Escenario</h2>
      <p>{content.data.escenario}</p>
      <p className="soc-objective"><strong>Objetivo:</strong> {content.data.objetivo}</p>
    </section> : null}

    {solutions.error ? <section className="soc-error" role="alert"><p>No se pudo verificar la respuesta modelo. Recarga la página para reintentar.</p></section> : null}
    {!solution && !solutions.error ? <p className="soc-panel" role="status">Cargando la respuesta modelo…</p> : null}
    {solution ? <>
      <section className="soc-model" aria-labelledby="soc-model-title">
        <h2 id="soc-model-title"><ShieldAlert size={22} aria-hidden="true" />Respuesta modelo</h2>
        <p>{solution.respuesta_entrevista}</p>
      </section>
      <CaseDetails solution={solution} />
    </> : null}

    <nav className="soc-case-nav" aria-label="Otros casos">
      {previous ? <a className="button secondary" href={caseUrl(previous.id)}><ArrowLeft size={16} aria-hidden="true" />{previous.id}</a> : <span />}
      <a className="button secondary" href={boardUrl()}>Tablero</a>
      {next ? <a className="button secondary" href={caseUrl(next.id)}>{next.id}<ArrowRight size={16} aria-hidden="true" /></a> : <span />}
    </nav>
    <p className="soc-siblings">{siblings.filter(item => item.id !== entry.id).map(item => <a key={item.id} href={caseUrl(item.id)}>{item.id}</a>)}</p>
  </article>;
}

function QueryCard({ query }: { query: Query }) {
  return <div className="soc-query">
    <h4>{query.nombre}</h4>
    <p className="soc-query-env">{query.entorno}</p>
    <pre tabIndex={0} role="region" aria-label={`Consulta: ${query.nombre}`}><code translate="no">{query.consulta}</code></pre>
    <p><strong>Interpretación:</strong> {query.interpretacion}</p>
    <p><strong>Limitaciones:</strong> {query.limitaciones}</p>
  </div>;
}

function CaseDetails({ solution }: { solution: Answers }) {
  return <div className="soc-details">
    <section aria-labelledby="soc-plan">
      <h2 id="soc-plan">Plan de investigación</h2>
      <ol className="soc-steps">{solution.pasos.map(step => <li key={step.fase}><strong>{step.fase}</strong><span>{step.accion}</span></li>)}</ol>
    </section>

    <section aria-labelledby="soc-hypothesis">
      <h2 id="soc-hypothesis">Hipótesis a contrastar</h2>
      <ul>{solution.hipotesis.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <section aria-labelledby="soc-evidence">
      <h2 id="soc-evidence">Evidencia que mirar</h2>
      <div className="soc-table-scroll" tabIndex={0} role="region" aria-label="Tabla de evidencia, desplazamiento con teclado">
        <table>
          <thead><tr><th scope="col">Dato</th><th scope="col">Qué te dice</th></tr></thead>
          <tbody>{solution.evidencias.map(item => <tr key={item.dato}><th scope="row">{item.dato}</th><td>{item.lectura}</td></tr>)}</tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="soc-kql">
      <h2 id="soc-kql">Microsoft Sentinel · KQL</h2>
      {solution.kql.map(query => <QueryCard key={query.nombre} query={query} />)}
    </section>

    <section aria-labelledby="soc-spl">
      <h2 id="soc-spl">Splunk · SPL (CIM)</h2>
      {solution.spl.map(query => <QueryCard key={query.nombre} query={query} />)}
    </section>

    <section aria-labelledby="soc-commands">
      <h2 id="soc-commands">Comandos de lectura</h2>
      {solution.comandos.map(command => <div key={command.comando} className="soc-query">
        <h4>{command.entorno}</h4>
        <p className="soc-query-env">{command.proposito}</p>
        <pre tabIndex={0} role="region" aria-label={`Comando: ${command.entorno}`}><code translate="no">{command.comando}</code></pre>
      </div>)}
    </section>

    <section aria-labelledby="soc-containment">
      <h2 id="soc-containment">Contención</h2>
      <p>{solution.contencion}</p>
      <h3>Escalar si ocurre</h3>
      <ul>{solution.escalation.map(item => <li key={item}>{item}</li>)}</ul>
    </section>

    <div className="soc-two-col">
      <section aria-labelledby="soc-fp">
        <h2 id="soc-fp">Falsos positivos</h2>
        <ul>{solution.falsos_positivos.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
      <section aria-labelledby="soc-mistakes">
        <h2 id="soc-mistakes">Errores frecuentes</h2>
        <ul>{solution.errores.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
    </div>

    <section aria-labelledby="soc-redteam">
      <h2 id="soc-redteam">Perspectiva Red Team</h2>
      <p>{solution.perspectiva_red_team}</p>
    </section>

    {solution.mitre.length ? <section aria-labelledby="soc-mitre">
      <h2 id="soc-mitre">MITRE ATT&amp;CK</h2>
      <ul className="soc-mitre">{solution.mitre.map(technique => <li key={technique}><a href={mitreUrl(technique)} target="_blank" rel="noopener noreferrer">{technique}<span className="sr-only"> (nueva pestaña)</span></a></li>)}</ul>
    </section> : null}

    <section aria-labelledby="soc-refs">
      <h2 id="soc-refs">Fuentes del caso</h2>
      <ul className="soc-refs">{solution.fuentes.map(url => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}<span className="sr-only"> (nueva pestaña)</span></a></li>)}</ul>
      <p className="soc-helper"><CheckCircle2 size={15} aria-hidden="true" /> Contenido sintético de laboratorio: valida ingesta, esquema, campos y permisos en tu entorno antes de usar cualquier consulta.</p>
    </section>
  </div>;
}
