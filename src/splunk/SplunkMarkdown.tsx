import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SplunkMarkdown({ children, omitLeadingHeading=false }: { children: string; omitLeadingHeading?: boolean }) {
  return <div className="markdown splunk-markdown"><Markdown remarkPlugins={[remarkGfm]} components={{
    h1: ({ children }) => <h2>{children}</h2>, h2: ({ children, node }) => omitLeadingHeading&&node?.position?.start.offset===0?null:<h3>{children}</h3>, h3: ({ children }) => <h4>{children}</h4>,
    a: ({ href, children }) => {
      if (href && /^https:\/\/(?:help\.splunk\.com|research\.splunk\.com|learn\.microsoft\.com|www\.microsoft\.com|attack\.mitre\.org)\//.test(href)) return <a href={href} target="_blank" rel="noreferrer noopener">{children}<span className="sr-only"> (documentación oficial, nueva pestaña)</span></a>;
      if (href === '../VALIDACION/DATASETS.json') return <a href="#/splunk/recursos">{children} (recursos, fuera de evaluación)</a>;
      return <span>{children} (referencia local del paquete editorial)</span>;
    },
    img: ({ alt }) => <span>{alt || 'Recurso de la fuente editorial'}</span>,
    pre: ({ children }) => <pre tabIndex={0} role="region" aria-label="Código ilustrativo, desplazamiento horizontal con teclado">{children}</pre>,
    table: ({ children }) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabla de la lección"> <table>{children}</table></div>,
    code: ({ children, className }) => <code className={className} translate="no">{children}</code>,
  }}>{children}</Markdown></div>;
}
