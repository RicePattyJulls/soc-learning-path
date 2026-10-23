import { BookOpen, ShieldCheck } from 'lucide-react';
import { caseUrl, catalog } from './data';

const reviewDate = (iso?: string) => (iso ? iso.split('-').reverse().join('/') : '');

export default function Sources() {
  const sources = [...catalog.sources].sort((a, b) => Number(b.global) - Number(a.global) || b.caseIds.length - a.caseIds.length || a.url.localeCompare(b.url));
  const domains = new Map<string, number>();
  for (const source of sources) {
    try {
      const host = new URL(source.url).hostname.replace(/^www\./, '');
      domains.set(host, (domains.get(host) ?? 0) + 1);
    } catch { /* una URL editorial con formato raro se muestra igualmente */ }
  }
  return <section className="soc-sources">
    <div className="soc-page-title">
      <div>
        <p>De dónde sale cada técnica</p>
        <h1>Fuentes y bibliografía</h1>
        <p>{sources.length} referencias públicas citadas por los cuarenta casos. Ninguna sustituye la validación en tu propio entorno.</p>
      </div>
      <BookOpen size={40} aria-hidden="true" />
    </div>

    <ul className="soc-domain-row">
      {[...domains.entries()].sort((a, b) => b[1] - a[1]).map(([host, count]) => <li key={host}><b>{host}</b><span>{count}</span></li>)}
    </ul>

    <ol className="soc-source-list">
      {sources.map(source => <li key={source.url}>
        <a href={source.url} target="_blank" rel="noopener noreferrer">{source.url}<span className="sr-only"> (nueva pestaña)</span></a>
        <small>{source.global ? 'Bibliografía general · ' : ''}{source.caseIds.length} {source.caseIds.length === 1 ? 'caso' : 'casos'}</small>
        <span className="soc-source-cases">{source.caseIds.slice(0, 6).map(id => <a key={id} href={caseUrl(id)}>{id}</a>)}{source.caseIds.length > 6 ? <em>+{source.caseIds.length - 6}</em> : null}</span>
      </li>)}
    </ol>

    <p className="soc-helper"><ShieldCheck size={15} aria-hidden="true" />
      {catalog.educationalReview.kind === 'owner_editorial_review'
        ? <>Contenido sintético de laboratorio, revisado editorialmente por el propietario{reviewDate(catalog.educationalReview.reviewedAt) ? ` el ${reviewDate(catalog.educationalReview.reviewedAt)}` : ''}, sin cambios en la fuente. La revisión independiente y la ejecución real de las consultas siguen pendientes.</>
        : <>Contenido sintético de laboratorio con revisión editorial pendiente.</>}
    </p>
  </section>;
}
