import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ExternalLink, LockKeyhole, Terminal, Trophy } from 'lucide-react';
import { chapters, chapterMap, chapterUrl, lessonMap, lessons, lessonUrl } from '../lib/catalog';
import { isComplete, lessonStatus } from '../lib/progress';
import type { Lesson, Progress } from '../types';
import { StatusIcon, Xp } from './Primitives';
import type { Education } from '../education';
import { regionVisual } from '../lib/region-visuals';

const cache = new Map<string, { markdown: string; education?: Education }>();
// The only raw HTML supported by the source is a line break; scripts/HTML are never executed.
function preserveBreakTags() {
  return (tree: Root) => visit(tree, 'html', (node, index, parent) => {
    if (/^<br\s*\/?>$/i.test(node.value) && parent && typeof index === 'number') {
      parent.children.splice(index, 1, { type: 'break' } as never);
    }
  });
}

export function useContent(lesson: Lesson | undefined) {
  const [state, setState] = useState<{ id: string; markdown?: string; education?: Education; error?: string }>({ id: '' });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!lesson) return;
    const cacheKey = lesson.learning?.revision || lesson.version;
    if (cache.has(cacheKey)) { setState({ id: lesson.id, ...cache.get(cacheKey)! }); return; }
    const controller = new AbortController();
    setState({ id: lesson.id });
    fetch(`${import.meta.env.BASE_URL}${lesson.file}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('missing'); return response.json(); })
      .then((data: { version: string; markdown: string; education?: Education }) => {
        if (data.version !== lesson.version || typeof data.markdown !== 'string') throw new Error('version');
        cache.set(cacheKey, { markdown: data.markdown, education: data.education });
        if (cache.size > 8) cache.delete(cache.keys().next().value!);
        if (!controller.signal.aborted) setState({ id: lesson.id, markdown: data.markdown, education: data.education });
      })
      .catch(() => { if (!controller.signal.aborted) setState({ id: lesson.id, error: 'No se ha podido abrir esta lectura. Reintenta; si falta el archivo, ejecuta npm run prepare:content.' }); });
    return () => controller.abort();
  }, [lesson?.id, lesson?.version, lesson?.learning?.revision, retry]);
  return { ...(state.id === lesson?.id ? state : { id: lesson?.id || '' }), retry: () => setRetry(r => r + 1) };
}

export function MarkdownContent({ lesson, markdown, snippet = false }: { lesson: Lesson; markdown: string; snippet?: boolean }) {
  const components = useMemo<Components>(() => {
    const heading: Components['h1'] = ({ node, children }) => {
      const line = lesson.line + (node?.position?.start.line || 1) - 1;
      const section = lesson.sections.find(s => s.line === line);
      const level = Math.min(6, 3 + (section?.depth || 1) - (lesson.sections[0]?.depth || 1));
      return createElement(`h${level}`, { id: snippet ? undefined : section?.anchor, tabIndex: -1 }, children);
    };
    return {
      h1: heading, h2: heading, h3: heading, h4: heading, h5: heading, h6: heading,
      code: ({ node: _node, ...props }) => <code {...props} translate="no" />,
      table: ({ children }) => <div className="table-scroll" role="region" tabIndex={0} aria-label="Tabla del documento; desplaza horizontalmente si es necesario"><table>{children}</table></div>,
      a: ({ href, children }) => {
        if (href?.startsWith('https://')) return <a href={href} target="_blank" rel="noopener noreferrer">{children}<ExternalLink size={12} className="external-link-icon" aria-hidden="true" /><span className="sr-only"> (enlace externo, nueva pestaña)</span></a>;
        if (href?.startsWith('#')) {
          let key = href.slice(1);
          try { key = decodeURIComponent(key); } catch { /* show unresolved reference */ }
          const target = lessons.flatMap(l => l.sections.map(s => ({ lesson: l, section: s }))).find(({ section }) => section.anchor === key || section.anchor.replace(/-\d+$/, '') === key);
          return target ? <a href={lessonUrl(target.lesson.id, target.section.anchor)}>{children}</a> : <span className="unresolved-ref">{children} (referencia pendiente)</span>;
        }
        return <span className="unresolved-ref">{children} (enlace local no resuelto)</span>;
      },
      img: ({ alt }) => <span className="unresolved-ref">Imagen pendiente de resolver: {alt || 'sin descripción'}</span>,
    };
  }, [lesson, snippet]);
  return <div className="markdown"><Markdown remarkPlugins={[remarkGfm, preserveBreakTags]} components={components}>{markdown}</Markdown></div>;
}

export default function Reader({ id, section, progress, complete, visitLesson }: {
  id: string; section: string | null; progress: Progress; complete: (id: string) => void; visitLesson: (id: string) => void;
}) {
  const lesson = lessonMap.get(id);
  const status = lesson ? lessonStatus(lesson, chapters, progress, lessonMap) : 'locked';
  const content = useContent(status !== 'locked' ? lesson : undefined);
  const [celebration, setCelebration] = useState('');
  const completionRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setCelebration(''); if (lesson && status !== 'locked') visitLesson(lesson.id); }, [lesson?.id, status === 'locked', visitLesson]);
  useEffect(() => {
    if (section && content.markdown !== undefined) {
      const heading = document.getElementById(section);
      heading?.scrollIntoView({ block: 'start' });
      heading?.focus({ preventScroll: true });
    }
  }, [section, content.markdown]);
  if (!lesson) return <div className="page-shell empty-state"><h1>No se encuentra esta lectura</h1><p>Puede que el documento se haya actualizado.</p><a href="#/biblioteca">Consultar la biblioteca</a></div>;
  if (status === 'locked') return <div className="page-shell empty-state"><LockKeyhole size={40} aria-hidden="true" /><h1>Esta lectura aún está bloqueada</h1><p>Completa las etapas anteriores para desbloquearla.</p><a className="button primary" href={chapterUrl(lesson.moduleId!)}>Ver el índice del capítulo</a><a href="#/ruta">Volver a la ruta</a></div>;
  const chapter = lesson.moduleId ? chapterMap.get(lesson.moduleId)! : null;
  const siblings = chapter ? chapter.lessonIds.map(id => lessonMap.get(id)!) : [lesson];
  const index = lessons.indexOf(lesson), previous = lessons[index - 1], next = lessons[index + 1];
  const nextAvailable = next && lessonStatus(next, chapters, progress, lessonMap) !== 'locked';
  const done = isComplete(lesson, progress);
  return <div className="page-shell reader-page" style={chapter?{'--journey-accent':regionVisual(chapter.id)?.palette.water} as CSSProperties:undefined}><a className="back-link" href={chapter ? `${chapterUrl(chapter.id)}?nodo=${encodeURIComponent(id)}` : '#/ruta'}><ArrowLeft size={17} aria-hidden="true" />{chapter ? 'Volver al mapa de la región' : 'Volver a la ruta'}</a><div className="reader-heading"><p>{chapter?.title || 'Texto previo al primer capítulo'} · SC-200.md</p><h1>{lesson.title}</h1><div><span>Líneas {lesson.line}–{lesson.endLine}</span><span>Modo apuntes originales · sin XP por abrir</span>{done ? <span className="completed-label"><CheckCircle2 size={15} aria-hidden="true" />Completada</span> : null}</div></div>
    <div className="reader-layout"><aside className="reader-index" aria-label="Índice de la lectura"><details open><summary>En este capítulo</summary><nav aria-label="Lecturas del capítulo">{siblings.map(l => <a href={`${lessonUrl(l.id)}?modo=apuntes`} key={l.id} aria-current={l.id === lesson.id ? 'page' : undefined}><StatusIcon status={isComplete(l, progress) ? 'completed' : 'available'} size={14} /><span>{l.title}</span></a>)}</nav></details>{lesson.sections.length > 0 ? <details open><summary>En esta lectura</summary><nav aria-label="Subapartados de la lectura">{lesson.sections.map(s => <a className={s.depth > 2 ? 'nested-section' : ''} key={s.anchor} href={lessonUrl(lesson.id, s.anchor)} aria-current={section === s.anchor ? 'location' : undefined}>{s.title}</a>)}</nav></details> : null}</aside>
    <div className="comparison-area"><section className="source-pane" aria-labelledby="source-pane-title"><div className="pane-heading"><span className="microsoft-mark" aria-hidden="true"><i /><i /><i /><i /></span><div><h2 id="source-pane-title">Microsoft SC-200</h2><span>Contenido del documento original</span></div></div><div className="reading-content">{content.error ? <div className="content-error" role="alert"><p>{content.error}</p><button className="button secondary" onClick={content.retry}>Reintentar lectura</button></div> : content.markdown !== undefined ? <MarkdownContent lesson={lesson} markdown={content.markdown} /> : <p role="status">Abriendo tus apuntes…</p>}</div></section><aside className="splunk-pane" aria-labelledby="splunk-pane-title"><div className="pane-heading"><Terminal size={22} aria-hidden="true" /><div><h2 id="splunk-pane-title">Splunk</h2><span>Tu siguiente horizonte</span></div></div><div className="splunk-placeholder"><span className="splunk-symbol" aria-hidden="true">&gt;_</span><span className="coming-soon">Próximamente</span><h3>Aprender este concepto en Splunk</h3><p>Este espacio acompañará a tus apuntes de SC-200 cuando incorporemos la siguiente fase.</p><span className="splunk-caption"><BookOpen size={14} aria-hidden="true" />Sin equivalencias añadidas todavía</span></div></aside></div></div>
    <section className="completion-panel original-mode-notice"><div><h2>Estás consultando tus apuntes originales.</h2><p>Este modo conserva la lectura completa. Los pasos, la práctica y las evaluaciones están en la lección.</p></div><a className="button primary" href={lessonUrl(id)}>Volver a la lección<ArrowRight size={17} aria-hidden="true" /></a></section>
    <nav className="reader-navigation" aria-label="Entre lecturas">{previous ? <a href={`${lessonUrl(previous.id)}?modo=apuntes`}><ArrowLeft size={17} aria-hidden="true" /><span>Lectura anterior<b>{previous.title}</b></span></a> : <span />}{nextAvailable ? <a href={`${lessonUrl(next.id)}?modo=apuntes`}><span>Lectura siguiente<b>{next.title}</b></span><ArrowRight size={17} aria-hidden="true" /></a> : next ? <span className="next-locked"><LockKeyhole size={16} aria-hidden="true" />Completa este capítulo para continuar.</span> : <a href="#/progreso"><span>Final del documento<b>Ver mi progreso</b></span><Trophy size={18} aria-hidden="true" /></a>}</nav>
  </div>;
}
