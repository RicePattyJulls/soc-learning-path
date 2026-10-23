import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { lessonUrl, resourceUrl } from './data';

function localLink(href: string) {
  const lesson = /(RED-M\d{2}-L\d{2})\.md$/.exec(href);
  if (lesson) return lessonUrl(lesson[1]);
  const lab = /(RED-L\d{2})\.md$/.exec(href);
  if (lab) return resourceUrl(lab[1]);
  if (href.endsWith('GLOSARIO.md')) return resourceUrl('glosario');
  if (href.endsWith('EMPRESA-LAB.json')) return resourceUrl('empresa-lab');
  if (href.endsWith('DETECCION-120.json')) return resourceUrl('deteccion-120');
}
export default function Markdown({ children }: { children: string }) {
  return <div className="markdown rd-markdown"><ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} components={{
    h1: ({ children }) => <h2>{children}</h2>, h2: ({ children }) => <h3>{children}</h3>, h3: ({ children }) => <h4>{children}</h4>,
    a: ({ href, children }) => {
      if (href?.startsWith('https://')) return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (nueva pestaña)</span></a>;
      const local = href ? localLink(href) : undefined;
      return local ? <a href={local}>{children}</a> : <span>{children}</span>;
    },
    img: ({ alt }) => <span>{alt || 'Ilustración de referencia'}</span>,
    pre: ({ children }) => <pre tabIndex={0} role="region" aria-label="Código del ejemplo, desplazamiento con teclado">{children}</pre>,
    table: ({ children }) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabla, desplazamiento con teclado"><table>{children}</table></div>,
    code: ({ children, className }) => <code className={className} translate="no">{children}</code>,
  }}>{children}</ReactMarkdown></div>;
}
