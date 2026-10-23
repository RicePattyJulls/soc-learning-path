import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Exact files and hashes authorized by the owner's request to integrate the
// Mundo SOC. Historical inventories stay intact; this grants no exception to
// course engines or existing content.
const manifestSHA = '11ec5e959daf25e1e354145b052f5570ff69626be9b2828bbd20692eff042011';
export function socChange(file, expected, actual) {
  const bytes = readFileSync(new URL('../docs/soc/CONCILIACION-INTEGRACION.json', import.meta.url));
  if (createHash('sha256').update(bytes).digest('hex') !== manifestSHA) throw new Error('Inventario de integración del Mundo SOC no verificable');
  const change = JSON.parse(bytes).changes[file];
  return !!change && change.before.includes(expected) && change.after === actual;
}
export function withSocDispatcher(source) {
  return source
    .replace("const LinuxApp = lazy(() => import('./linux/LinuxApp'));", "const LinuxApp = lazy(() => import('./linux/LinuxApp'));\nconst SocApp = lazy(() => import('./soc/SocApp'));")
    .replace("? 'splunk' : 'sc200';", "? 'splunk' : route.page === 'soc' ? 'soc' : 'sc200';")
    .replace("course === 'linux' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo el mundo Linux…</main>}><LinuxApp /></Suspense> : course === 'splunk' ? <CourseBoundary>", "course === 'linux' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo el mundo Linux…</main>}><LinuxApp /></Suspense> : course === 'soc' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo el Mundo SOC…</main>}><SocApp /></Suspense> : course === 'splunk' ? <CourseBoundary>");
}
export function withSocSelector(source) {
  return source.replace("course: 'sc200' | 'splunk' | 'redes' | 'windows-ad' | 'linux'", "course: 'sc200' | 'splunk' | 'redes' | 'windows-ad' | 'linux' | 'soc'")
    .replace('Linux</a>', 'Linux</a>\n    <a href="#/soc/ruta" aria-current={course === \'soc\' ? \'true\' : undefined}><span aria-hidden="true" className="academy-dot" />Mundo SOC</a>');
}
