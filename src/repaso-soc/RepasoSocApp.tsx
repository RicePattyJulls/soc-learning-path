import { useEffect, useState } from 'react';
import { Check, NotebookText, Search } from 'lucide-react';
import { useRoute } from '../lib/router';
import { BLOCKS, CARDS, type BlockId, type Card } from './cards';
import { useRepasoProgress } from './progress';
import '../soc/soc.css';
import './repaso-soc.css';

const url = (bloque = '') => `#/soc/repaso_soc${bloque ? `?bloque=${bloque}` : ''}`;
const normal = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function RepasoSocApp() {
  const route = useRoute();
  const { store, warning, toggle } = useRepasoProgress();
  const [query, setQuery] = useState('');
  const [hideKnown, setHideKnown] = useState(false);
  const requested = route.params.get('bloque') ?? '';
  const bloque = BLOCKS.some(block => block.id === requested) ? requested as BlockId : '';
  const known = new Set(store.known);
  const valid = route.id === 'repaso_soc';

  useEffect(() => {
    const title = BLOCKS.find(block => block.id === bloque)?.titulo;
    document.title = `${title ? `${title} · ` : ''}Repaso SOC · SOC Learning Path`;
    document.querySelector('.rs-academy .soc-primary-nav a[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [bloque]);

  const terms = normal(query.trim());
  const visible = CARDS.filter(card => (!bloque || card.bloque === bloque) && (!hideKnown || !known.has(card.id))
    && (!terms || normal(`${card.titulo} ${card.concepto} ${card.uso} ${card.codigo ?? ''}`).includes(terms)));
  const scope = bloque ? CARDS.filter(card => card.bloque === bloque) : CARDS;
  const scopeKnown = scope.filter(card => known.has(card.id)).length;

  return <div className="soc-academy rs-academy">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Saltar al contenido</a>
    <header className="site-header soc-header rs-header">
      <div className="soc-header-inner">
        <a className="soc-brand" href={url()}>
          <span><NotebookText size={28} aria-hidden="true" /></span>
          <div><strong>Repaso SOC</strong><small>Sentinel, XDR, Splunk y método</small></div>
        </a>
        <nav className="soc-primary-nav" aria-label="Bloques de Repaso SOC">
          <a href={url()} aria-current={!bloque ? 'page' : undefined}>Todo</a>
          {BLOCKS.map(block => <a key={block.id} href={url(block.id)} aria-current={bloque === block.id ? 'page' : undefined}>{block.titulo}</a>)}
        </nav>
        <div className="soc-profile">
          <span>{store.known.length}</span>
          <div><b>{store.known.length} de {CARDS.length} sabidas</b><small>Marca las que ya dominas</small></div>
        </div>
      </div>
    </header>

    {warning ? <p className="storage-warning" role="alert">{warning}</p> : null}

    <main id="main-content" tabIndex={-1} className="soc-shell">
      {!valid ? <section className="soc-panel"><h1>Este camino de Repaso SOC no existe</h1><a className="button secondary" href={url()}>Volver al repaso</a></section> : <>
        <div className="soc-page-title">
          <div>
            <p>Solo lo importante para leer y memorizar</p>
            <h1>{BLOCKS.find(block => block.id === bloque)?.titulo ?? 'Repaso SOC'}</h1>
            <p>{BLOCKS.find(block => block.id === bloque)?.resumen ?? 'Conceptos y uso en fichas cortas. Lee, y marca «Me la sé» cuando la domines.'}</p>
          </div>
        </div>

        <div className="soc-filters">
          <label className="soc-search">Buscar
            <span className="soc-search-field"><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="NRT, tstats, Kerberoasting…" /></span>
          </label>
          <label className="rs-check"><input type="checkbox" checked={hideKnown} onChange={event => setHideKnown(event.target.checked)} />Ocultar las que ya me sé</label>
        </div>
        <p className="soc-counter" aria-live="polite">{visible.length} fichas · {scopeKnown} de {scope.length} sabidas en este bloque</p>

        {BLOCKS.filter(block => !bloque || block.id === bloque).map(block => {
          const cards = visible.filter(card => card.bloque === block.id);
          if (!cards.length) return null;
          const temas = [...new Set(cards.map(card => card.tema))];
          return <section key={block.id} className="rs-block" aria-labelledby={`rs-${block.id}`}>
            {!bloque ? <h2 id={`rs-${block.id}`} className="rs-block-title">{block.titulo}</h2> : <h2 id={`rs-${block.id}`} className="sr-only">{block.titulo}</h2>}
            {temas.map(tema => <section key={tema} className="soc-block" aria-label={tema}>
              <header><div><h3 className="rs-tema">{tema}</h3></div></header>
              <ul className="rs-grid">{cards.filter(card => card.tema === tema).map(card => <li key={card.id}><CardView card={card} known={known.has(card.id)} toggle={toggle} /></li>)}</ul>
            </section>)}
          </section>;
        })}
        {!visible.length ? <p className="soc-empty">No hay fichas con ese filtro.</p> : null}
      </>}
    </main>

    <footer className="soc-footer">
      <a href={url()}>Repaso SOC</a>
      <span>Contenido de referencia; las consultas son ejemplos no ejecutados.</span>
      <span>Progreso guardado en este navegador</span>
    </footer>
  </div>;
}

function CardView({ card, known, toggle }: { card: Card; known: boolean; toggle: (id: string) => void }) {
  return <article className={`rs-card${known ? ' is-known' : ''}`}>
    <h4>{card.titulo}</h4>
    <p>{card.concepto}</p>
    <p className="rs-use"><b>Uso:</b> {card.uso}</p>
    {card.codigo ? <pre><code>{card.codigo}</code></pre> : null}
    <button type="button" className={`button ${known ? 'primary' : 'secondary'} rs-known`} aria-pressed={known} onClick={() => toggle(card.id)}>
      {known ? <><Check size={16} aria-hidden="true" />Me la sé</> : 'Marcar «Me la sé»'}
    </button>
  </article>;
}
