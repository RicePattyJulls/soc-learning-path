import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Exact files and hashes authorized by the owner's request to add the
// Repaso SOC world (23/10/2026). Historical inventories stay intact; this
// grants no exception to course engines or existing content.
const manifestSHA = '58221d7abb44f4500fa0ef1afb587e4d7f2a393759bf7066576c99fc9cc5b956';
const manifestURL = new URL('../docs/repaso-soc/CONCILIACION-INTEGRACION.json', import.meta.url);
export function repasoSocChange(file, expected, actual) {
  const bytes = readFileSync(manifestURL);
  if (createHash('sha256').update(bytes).digest('hex') !== manifestSHA) throw new Error('Inventario de integración de Repaso SOC no verificable');
  const change = JSON.parse(bytes).changes[file];
  return !!change && change.before.includes(expected) && change.after === actual;
}
export function withRepasoSocDispatcher(source) {
  return source
    .replace("const SocApp = lazy(() => import('./soc/SocApp'));", "const SocApp = lazy(() => import('./soc/SocApp'));\nconst RepasoSocApp = lazy(() => import('./repaso-soc/RepasoSocApp'));")
    .replace("route.page === 'soc' ? 'soc' : 'sc200';", "route.page === 'soc' && route.id.split('/')[0] === 'repaso_soc' ? 'repaso-soc' : route.page === 'soc' ? 'soc' : 'sc200';")
    .replace("course === 'soc' ? <Suspense", "course === 'repaso-soc' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo Repaso SOC…</main>}><RepasoSocApp /></Suspense> : course === 'soc' ? <Suspense");
}
export function withRepasoSocSelector(source) {
  return source.replace("'linux' | 'soc' }", "'linux' | 'soc' | 'repaso-soc' }")
    .replace('Mundo SOC</a>', 'Mundo SOC</a>\n    <a href="#/soc/repaso_soc" aria-current={course === \'repaso-soc\' ? \'true\' : undefined}><span aria-hidden="true" className="academy-dot" />Repaso SOC</a>');
}

// CLI: comprueba que los ficheros registrados están exactamente en su estado autorizado.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const { changes } = JSON.parse(readFileSync(manifestURL));
  for (const [file, change] of Object.entries(changes)) {
    const actual = createHash('sha256').update(readFileSync(path.join(root, file))).digest('hex');
    if (!repasoSocChange(file, change.before[change.before.length - 1], actual)) throw new Error(`Cambio no autorizado: ${file}`);
  }
  console.log(JSON.stringify({ repasoSoc: 'integración conciliada', files: Object.keys(changes).length }));
}
