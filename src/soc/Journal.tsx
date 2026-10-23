import { Download, Repeat, Trophy } from 'lucide-react';
import { catalog, caseUrl, reviewUrl, sourcesUrl } from './data';
import { ProgressBar } from '../components/Primitives';
import { STATUS_LABEL, recordFor, scoreFor, statsFor, statusFor } from './progress';
import { reviewLabel, reviewOverview } from './review';
import type { Store } from './types';

export default function Journal({ store, exportProgress }: { store: Store; exportProgress: () => void }) {
  const stats = statsFor(store);
  const now = Date.now();
  const due = reviewOverview(store, now).due;
  return <section className="soc-journal">
    <div className="soc-page-title">
      <div>
        <p>Tu recorrido, a tu ritmo</p>
        <h1>Mi progreso en el Mundo SOC</h1>
        <p>{stats.answered} casos respondidos · {stats.revealed} respuestas comparadas · {stats.checks} criterios autoevaluados</p>
      </div>
      <Trophy size={40} aria-hidden="true" />
    </div>

    <div className="soc-journal-summary">
      <b>{stats.closed} de {stats.total} casos evaluados</b>
      <ProgressBar value={(stats.closed / stats.total) * 100} label="Casos evaluados en el Mundo SOC" />
      <ul className="soc-stat-row">
        <li><b>{stats.counts.dominado}</b><span>Dominados</span></li>
        <li><b>{stats.counts.casi}</b><span>Casi dominados</span></li>
        <li><b>{stats.counts.repasar}</b><span>Para repasar</span></li>
        <li><b>{stats.counts['en-curso']}</b><span>En curso</span></li>
        <li><b>{stats.counts.pendiente}</b><span>Pendientes</span></li>
      </ul>
      <p>No hay XP ni desbloqueos: aquí solo cuenta qué has respondido y cómo te has evaluado. Tus respuestas se guardan en este navegador.</p>
      <p className="soc-helper"><Repeat size={15} aria-hidden="true" /> {due.length ? <>Toca repasar <b>{due.length}</b> {due.length === 1 ? 'caso' : 'casos'} hoy. <a href={reviewUrl()}>Abrir la cola de repaso</a></> : <>Nada vencido hoy. <a href={reviewUrl()}>Ver el calendario de repaso</a></>}</p>
      <button className="button primary" onClick={exportProgress}><Download size={17} aria-hidden="true" />Exportar mi progreso del Mundo SOC</button>
    </div>

    {catalog.blocks.map(block => {
      const entries = block.caseIds.map(id => catalog.cases.find(item => item.id === id)!).filter(Boolean);
      const done = entries.filter(entry => statusFor(entry, recordFor(store, entry)) === 'dominado').length;
      return <details key={block.id} className="soc-journal-block">
        <summary><span><span className="soc-level-tag">{block.nivel}</span>{block.title}</span><b>{done}/{entries.length}</b></summary>
        <ProgressBar value={(done / entries.length) * 100} label={`Casos dominados: ${block.title}`} />
        <ol>
          {entries.map(entry => {
            const record = recordFor(store, entry);
            const status = statusFor(entry, record);
            const score = scoreFor(record, entry);
            return <li key={entry.id}>
              <span className={`soc-status soc-status-${status}`}>{STATUS_LABEL[status]}</span>
              <a href={caseUrl(entry.id)}>{entry.id} · {entry.titulo}</a>
              <small>
                {score && score.checked ? `${score.total}/${score.max} puntos · ${score.checked}/${entry.rubricSize} criterios` : record.answer.trim() ? 'Respuesta guardada' : 'Aún sin respuesta'}
                {record.review.due !== null ? ` · Repaso ${reviewLabel(record.review.due, now)}` : ''}
              </small>
            </li>;
          })}
        </ol>
      </details>;
    })}

    <p className="soc-journal-foot">¿Quieres revisar de dónde sale cada consulta? Consulta las <a href={sourcesUrl()}>fuentes y bibliografía</a>.</p>
  </section>;
}
