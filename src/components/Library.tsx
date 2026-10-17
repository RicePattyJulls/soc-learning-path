import { useDeferredValue, useMemo } from 'react';
import { ArrowRight, BookOpen, Search } from 'lucide-react';
import { catalog, chapters, chapterUrl, lessonMap, lessons, lessonUrl, normalize } from '../lib/catalog';
import { lessonStatus } from '../lib/progress';
import { replaceQuery } from '../lib/router';
import type { Progress } from '../types';
import { StatusIcon, statusText } from './Primitives';
import index from '../generated/search-index.json';

const excerpts = new Map(index.map(item => [item.id, item.text]));
const searchable = new Map(index.map(item => [item.id, normalize(item.text)]));
export default function Library({ progress, query, module }: { progress: Progress; query: string; module: string }) {
  const search = useDeferredValue(normalize(query.trim()));
  const filtered = useMemo(() => {
    const words = search.split(/\s+/).filter(Boolean);
    return lessons.filter(l => (!module || l.moduleId === module || module === 'apertura' && l.moduleId === null) && words.every(word => searchable.get(l.id)!.includes(word)));
  }, [search, module]);
  return <div className="page-shell library-page"><div className="page-heading"><span className="page-heading-icon"><BookOpen size={26} aria-hidden="true" /></span><div><h1>Tu biblioteca SOC</h1><p>Encuentra un concepto en tus apuntes y vuelve a su lugar en la ruta.</p></div></div><div className="library-controls"><label className="search-box"><Search size={20} aria-hidden="true" /><span className="sr-only">Buscar en títulos y contenido</span><input type="search" name="busqueda" autoComplete="off" placeholder="Busca un concepto: ASR, ingesta, KQL…" value={query} onChange={event => replaceQuery('q', event.target.value)} /></label><label className="chapter-filter"><span className="sr-only">Filtrar por capítulo</span><select name="capitulo" value={module} onChange={e => replaceQuery('capitulo', e.target.value)}><option value="">Todos los capítulos</option><option value="apertura">Apertura del documento</option>{chapters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label></div><p className="result-count" role="status">{filtered.length} {filtered.length === 1 ? 'lectura encontrada' : 'lecturas encontradas'}{query ? ` para “${query}”` : ''}</p>
    <div className="library-results">{filtered.map(lesson => {
      const status = lessonStatus(lesson, chapters, progress, lessonMap);
      const chapter = chapters.find(c => c.id === lesson.moduleId);
      const hit = search ? searchable.get(lesson.id)!.indexOf(search.split(/\s+/)[0]) : -1;
      // Snippets are exact excerpts of the sanitized Markdown, not generated explanations.
      const snippet = hit >= 0 ? excerpts.get(lesson.id)!.slice(Math.max(0, hit - 55), hit + 155) : null;
      return <article className="library-result" key={lesson.id}><div><span className="result-chapter">{chapter?.title || 'Antes del primer capítulo'}</span><h2><a href={status === 'locked' ? chapterUrl(lesson.moduleId!) : lessonUrl(lesson.id)}>{lesson.title}</a></h2>{snippet ? <p className="search-snippet">…{snippet}…</p> : <p className="muted">SC-200.md · Líneas {lesson.line}–{lesson.endLine} · {lesson.sections.length} encabezados</p>}<span className={`result-status ${status}`}><StatusIcon status={status} size={13} />{statusText[status]}{status === 'locked' ? ' · Ver índice del capítulo' : ''}</span></div><a className="icon-link" href={status === 'locked' ? chapterUrl(lesson.moduleId!) : lessonUrl(lesson.id)} aria-label={`${status === 'locked' ? 'Ver índice para' : 'Leer'} ${lesson.title}`}><ArrowRight size={20} aria-hidden="true" /></a></article>;
    })}</div>{!filtered.length ? <div className="empty-state"><Search size={34} aria-hidden="true" /><h2>No aparece en estas lecturas</h2><p>Prueba otro término o selecciona todos los capítulos.</p><button className="button secondary" onClick={() => { replaceQuery('q', ''); replaceQuery('capitulo', ''); }}>Ver todo el contenido</button></div> : null}
    <details className="source-audit"><summary>Cómo se ha organizado el documento</summary><p>{catalog.report.modules} capítulos H1, {catalog.report.headings} encabezados y {catalog.report.codeBlocks} bloques de código. Se ha verificado que las lecturas conservan todo el Markdown, salvo los datos ocultos por privacidad.</p><p>Los títulos técnicos y el orden son los del archivo. “Apertura del documento” es una etiqueta de navegación para su texto inicial.</p><p>{catalog.report.externalLinks} enlaces externos conservados; no se consultan al abrir las lecturas. {catalog.report.redactions.length} dato(s) oculto(s). {catalog.report.unresolved.length} recurso(s) pendiente(s).</p>{catalog.report.unresolved.length ? <ul>{catalog.report.unresolved.map((r, i) => <li key={i}>Línea {r.line}: {r.reason}</li>)}</ul> : <p>No se encontraron imágenes ni enlaces de Obsidian en esta versión del documento.</p>}</details>
  </div>;
}
