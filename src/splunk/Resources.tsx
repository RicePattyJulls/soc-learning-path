import { useEffect, useState } from 'react';
import { catalog, digest } from './data';
import type { SplunkResources } from './types';
import SplunkMarkdown from './SplunkMarkdown';

export default function Resources({ examActive, regionId }: { examActive: boolean; regionId?: string }) {
  const region = catalog.regions.find(r => r.id === regionId);
  const [resource, setResource] = useState<{ id: string; data?: SplunkResources; error?: boolean }>();
  useEffect(() => {
    if (examActive || !region) return;
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}${region.resourceFile}`, { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('missing'); return r.text(); }).then(async text => {
      if (await digest(text) !== region.resourcesHash) throw new Error('integrity');
      const parsed: SplunkResources = JSON.parse(text);
      if (parsed.courseId !== 'splunk' || parsed.regionId !== region.id || typeof parsed.lab !== 'string' || typeof parsed.note !== 'string') throw new Error('contract');
      if (parsed.fixture && (parsed.fixture.synthetic !== true || await digest(parsed.fixture.text) !== parsed.fixture.sha256)) throw new Error('fixture');
      if (parsed.fixtures) for (const fixture of parsed.fixtures) {
        if (fixture.synthetic !== true || typeof fixture.file !== 'string' || typeof fixture.rowCount !== 'number' || await digest(fixture.text) !== fixture.sha256) throw new Error('fixture');
      }
      if (parsed.documents?.some(doc => typeof doc.file !== 'string' || typeof doc.markdown !== 'string')) throw new Error('documents');
      if (!controller.signal.aborted) setResource({ id: region.id, data: parsed });
    }).catch(() => { if (!controller.signal.aborted) setResource({ id: region.id, error: true }); });
    return () => controller.abort();
  }, [examActive, region]);
  if (examActive) return <section className="sp-card"><h1>Recursos pausados durante la evaluación</h1><p>Finaliza el intento para consultar laboratorios y soluciones.</p><a href="#/splunk/ruta">Volver al mapa y retomar tu intento</a></section>;
  if (regionId && !region) return <section className="sp-card"><h1>Recurso no incorporado</h1><a href="#/splunk/recursos">Ver recursos disponibles</a></section>;
  const data = region && resource?.id === region.id ? resource.data : undefined;
  return <section className="sp-card sp-resources"><h1>{region ? `Laboratorio · ${region.title}` : 'Laboratorios y recursos Splunk'}</h1><p>Formativos, sin instalaciones ni ejecución de SPL, envíos HTTP o acciones sobre equipos. Contienen soluciones: consúltalos fuera de la evaluación.</p><nav className="sp-region-tabs" aria-label="Laboratorios por región">{catalog.regions.map(r => <a key={r.id} href={`#/splunk/recursos/${r.id}`} aria-current={r.id === region?.id ? 'page' : undefined}>{r.id} · {r.title}</a>)}</nav>
    {region ? resource?.id === region.id && resource.error ? <p role="alert">Recurso ausente o hash incorrecto. Vuelve al índice y reintenta; no se sustituyó por contenido de otra ruta.</p> : data ? <><SplunkMarkdown>{data.lab}</SplunkMarkdown><p>{data.note}</p>{data.fixture && <details><summary>CSV sintético · {data.fixture.file}</summary><p>10 filas; UTC del 16/10/2026. Solo lectura, no se ejecuta ni ingiere. IPs de documentación e identidades example.test.</p><pre tabIndex={0} aria-label="Contenido CSV sintético"><code>{data.fixture.text}</code></pre><p className="sp-anchor">SHA-256: {data.fixture.sha256}</p></details>}{data.fixtures?.map(fixture=><details key={fixture.file}><summary>CSV sintético · {fixture.file}</summary><p>{fixture.rowCount} filas. Solo lectura; conserva el escenario y namespace del contrato editorial.</p><pre tabIndex={0} role="region" aria-label={`CSV sintético ${fixture.file}`}><code>{fixture.text}</code></pre><p className="sp-anchor">SHA-256: {fixture.sha256}</p></details>)}{data.documents?.map(doc=><details key={doc.file}><summary>Documento editorial · {doc.file}</summary><SplunkMarkdown>{doc.markdown}</SplunkMarkdown></details>)}<details><summary>Contrato de columnas, mapeos y UTC</summary><p>Diseño documental del paquete; no equivale a extracciones configuradas.</p><pre tabIndex={0} aria-label="Contrato de datasets"><code>{JSON.stringify(data.datasets, null, 2)}</code></pre></details></> : <p role="status">Cargando laboratorio…</p> : <p>Elige una región. Solo se descarga su recurso al abrirlo; no se cargan las otras regiones del currículo.</p>}
    <a className="button secondary" href={region ? `#/splunk/region/${region.id}` : '#/splunk/ruta'}>Volver al mapa</a>
  </section>;
}
