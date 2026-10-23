import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, FlaskConical } from 'lucide-react';
import { catalog, fetchResource, lessonUrl, resourceById, resourceUrl } from './data';
import { activeLesson } from './progress';
import Markdown from './Markdown';
import type { ResourceContent, Store } from './types';

export default function Resources({ id, store }: { id?: string; store: Store }) {
  const resource = id ? resourceById.get(id) : undefined;
  const [state, setState] = useState<{ id: string; data?: ResourceContent; error?: string }>({ id: '' });
  const [retry, setRetry] = useState(0), [kind, setKind] = useState('all');
  const active = activeLesson(store);
  useEffect(() => {
    if (!resource || active) return;
    const controller = new AbortController(); setState({ id: resource.id });
    fetchResource(resource, controller.signal).then(data => { if (!controller.signal.aborted) setState({ id: resource.id, data }); })
      .catch(() => { if (!controller.signal.aborted) setState({ id: resource.id, error: 'No se pudo cargar este recurso. Reintenta.' }); });
    return () => controller.abort();
  }, [resource?.id, active?.id, retry]);
  if (active) return <section className="rd-panel"><h1>Termina tu evaluación</h1><p>Los recursos vuelven a estar disponibles al entregar las dos preguntas.</p><a className="button primary" href={lessonUrl(active.id, 'evalua')}>Volver a la evaluación</a></section>;
  if (id && !resource) return <section className="rd-panel"><h1>Este recurso no existe</h1><a href={resourceUrl()}>Ver los recursos de Redes</a></section>;
  if (resource) return <section className="rd-resource-reader"><a className="back-link" href={resourceUrl()}><ArrowLeft size={17} aria-hidden="true"/>Volver a recursos</a><h1>{resource.title}</h1>{state.id !== resource.id || !state.data && !state.error ? <p role="status">Cargando recurso…</p> : state.error ? <div role="alert"><p>{state.error}</p><button className="button secondary" onClick={() => setRetry(n => n + 1)}>Reintentar</button></div> : <Markdown>{state.data!.markdown}</Markdown>}</section>;
  return <section className="rd-resources"><div className="rd-page-title"><div><p>Tu mesa de trabajo</p><h1>Recursos y laboratorios</h1><p>Consulta términos, trabaja con los datos sintéticos y prepara tus prácticas.</p></div><FlaskConical size={40} aria-hidden="true"/></div><p className="rd-notice">Las veinte guías son diseños de laboratorio por ejecutar. Revisa sus objetivos, requisitos y restauración antes de preparar el entorno.</p><label className="rd-filter">Mostrar<select value={kind} onChange={event => setKind(event.target.value)}><option value="all">Todos los recursos</option><option value="lab">Laboratorios</option><option value="glossary">Glosario</option><option value="fixture">Casos y datos</option></select></label><div className="rd-resource-grid">{catalog.resources.filter(r => kind === 'all' || r.kind === kind).map(r => <a key={r.id} href={resourceUrl(r.id)}>{r.kind === 'lab' ? <FlaskConical size={25} aria-hidden="true"/> : <BookOpen size={25} aria-hidden="true"/>}<h2>{r.title}</h2><p>{r.kind === 'lab' ? `${r.id} · Guía para preparar y ejecutar` : r.kind === 'fixture' ? 'Dataset sintético para las prácticas' : 'Vocabulario por módulos'}</p><span>Abrir recurso</span></a>)}</div></section>;
}
