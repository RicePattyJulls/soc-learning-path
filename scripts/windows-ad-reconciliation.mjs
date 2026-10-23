import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Exact files and hashes authorized by the owner's request to integrate the
// Windows + Active Directory world. Historical inventories stay intact; this
// grants no exception to course engines or existing content.
const manifestSHA = 'cbc2da12f463cb4d1b521e9efd70f1cc6db72722246006b77a74694d41a0ae62';
export function windowsAdChange(file, expected, actual) {
  const bytes = readFileSync(new URL('../docs/windows-ad/CONCILIACION-INTEGRACION.json', import.meta.url));
  if (createHash('sha256').update(bytes).digest('hex') !== manifestSHA) throw new Error('Inventario de integración Windows + AD no verificable');
  const change = JSON.parse(bytes).changes[file];
  return !!change && change.before.includes(expected) && change.after === actual;
}
export function withWindowsAdDispatcher(source) {
  return source
    .replace("const RedesApp = lazy(() => import('./redes/RedesApp'));", "const RedesApp = lazy(() => import('./redes/RedesApp'));\nconst WindowsAdApp = lazy(() => import('./windows-ad/WindowsAdApp'));")
    .replace("const course = route.page === 'redes' ? 'redes' : route.page === 'splunk'", "const course = route.page === 'redes' ? 'redes' : route.page === 'windows-ad' ? 'windows-ad' : route.page === 'splunk'")
    .replace(": course === 'splunk' ? <CourseBoundary>", ": course === 'windows-ad' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo el mundo Windows + AD…</main>}><WindowsAdApp /></Suspense> : course === 'splunk' ? <CourseBoundary>");
}
export function withWindowsAdSelector(source) {
  return source.replace("course: 'sc200' | 'splunk' | 'redes'", "course: 'sc200' | 'splunk' | 'redes' | 'windows-ad'")
    .replace('Redes</a>', 'Redes</a>\n    <a href="#/windows-ad/ruta" aria-current={course === \'windows-ad\' ? \'true\' : undefined}><span aria-hidden="true" className="academy-dot" />Windows + AD</a>');
}
