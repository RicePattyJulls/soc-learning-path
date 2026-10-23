import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { caseUrl, catalog } from './data';

// Modo lectura: sin estados de progreso; el tablero solo filtra y abre casos.
export default function CaseBoard() {
  const [level, setLevel] = useState('todos');
  const [block, setBlock] = useState('todos');
  const [query, setQuery] = useState('');

  const rows = useMemo(() => catalog.cases.map(entry => ({ entry })), []);

  const filtered = rows.filter(row => (level === 'todos' || row.entry.nivel === level)
    && (block === 'todos' || row.entry.blockId === block)
    && (!query.trim() || `${row.entry.titulo} ${row.entry.bloque} ${row.entry.id}`.toLowerCase().includes(query.trim().toLowerCase())));

  const visibleBlocks = catalog.blocks.filter(item => filtered.some(row => row.entry.blockId === item.id));

  return <section className="soc-board">
    <div className="soc-page-title">
      <div>
        <p>Cuarenta casos, sin orden obligatorio</p>
        <h1>Mundo SOC · preguntas de entrevista y triaje</h1>
        <p>Elige un caso y léelo: la respuesta modelo, el plan, las evidencias y las consultas ya están resueltas. No hace falta escribir nada.</p>
      </div>
      <Filter size={40} aria-hidden="true" />
    </div>

    <form className="soc-filters" onSubmit={event => event.preventDefault()} role="search" aria-label="Filtros de casos SOC">
      <label><span>Nivel</span>
        <select value={level} onChange={event => setLevel(event.target.value)}>
          <option value="todos">Todos los niveles</option>
          {catalog.levels.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
      <label><span>Bloque</span>
        <select value={block} onChange={event => setBlock(event.target.value)}>
          <option value="todos">Todos los bloques</option>
          {catalog.blocks.map(item => <option key={item.id} value={item.id}>{`${item.nivel} · ${item.title}`}</option>)}
        </select>
      </label>
      <label className="soc-search"><span>Buscar</span>
        <span className="soc-search-field"><Search size={17} aria-hidden="true" /><input type="search" value={query} placeholder="Título, bloque o N1-01" onChange={event => setQuery(event.target.value)} /></span>
      </label>
      <button className="button secondary" type="button" onClick={() => { setLevel('todos'); setBlock('todos'); setQuery(''); }}>Limpiar filtros</button>
    </form>

    <p className="soc-counter" role="status">{filtered.length} de {rows.length} casos visibles</p>

    {visibleBlocks.map(item => {
      const blockRows = filtered.filter(row => row.entry.blockId === item.id);
      return <section key={item.id} className="soc-block" aria-labelledby={`soc-block-${item.id}`}>
        <header>
          <div>
            <span className="soc-level-tag">{item.nivel}</span>
            <h2 id={`soc-block-${item.id}`}>{item.title}</h2>
          </div>
          <span className="soc-block-count">{blockRows.length} {blockRows.length === 1 ? 'caso' : 'casos'}</span>
        </header>
        <ul className="soc-case-grid">
          {blockRows.map(({ entry }) => <li key={entry.id}>
            <a className="soc-case-card" href={caseUrl(entry.id)}>
              <span className="soc-case-top"><b>{entry.id}</b></span>
              <strong>{entry.titulo}</strong>
              <small>{entry.stepCount} pasos · {entry.queryCount} consultas</small>
            </a>
          </li>)}
        </ul>
      </section>;
    })}

    {!filtered.length ? <p className="soc-empty" role="status">Ningún caso coincide con esos filtros. Prueba a limpiarlos.</p> : null}
  </section>;
}
