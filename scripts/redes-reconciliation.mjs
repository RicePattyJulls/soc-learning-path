import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Exact files and hashes authorized by the owner's request to integrate Redes.
// Historical inventories stay intact; this grants no exception to course engines.
const manifestSHA = '769e75a254be42bd7234f89e71ce5630a444d20eb12485877cb0bcb6997bab6c';
export function redesChange(file, expected, actual) {
  const bytes = readFileSync(new URL('../docs/redes/CONCILIACION-INTEGRACION.json', import.meta.url));
  if (createHash('sha256').update(bytes).digest('hex') !== manifestSHA) throw new Error('Inventario de integración Redes no verificable');
  const change = JSON.parse(bytes).changes[file];
  return !!change && change.before.includes(expected) && change.after === actual;
}
export function withRedesDispatcher(source) {
  return source
    .replace("const SplunkApp = lazy(() => import('./splunk/SplunkApp'));", "const SplunkApp = lazy(() => import('./splunk/SplunkApp'));\nconst RedesApp = lazy(() => import('./redes/RedesApp'));")
    .replace("const course = route.page === 'splunk'", "const course = route.page === 'redes' ? 'redes' : route.page === 'splunk'")
    .replace(": course === 'splunk' ? <CourseBoundary>", ": course === 'redes' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo el mundo Redes…</main>}><RedesApp /></Suspense> : course === 'splunk' ? <CourseBoundary>");
}
export function withRedesSelector(source) {
  return source.replace("course: 'sc200' | 'splunk'", "course: 'sc200' | 'splunk' | 'redes'")
    .replace('Splunk SOC <small>R01–R03</small></a>', 'Splunk SOC</a>\n    <a href="#/redes/ruta" aria-current={course === \'redes\' ? \'true\' : undefined}><span aria-hidden="true" className="academy-dot" />Redes</a>');
}
