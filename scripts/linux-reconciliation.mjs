import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// Exact files and hashes authorized by the owner's request to integrate the
// Linux world. Historical inventories stay intact; this grants no exception to
// course engines or existing content.
const manifestSHA = 'e5bafa2d9be94a3f32f4e0980def940627857106bb090329ffdeddfb15cfb135';
export function linuxChange(file, expected, actual) {
  const bytes = readFileSync(new URL('../docs/linux/CONCILIACION-INTEGRACION.json', import.meta.url));
  if (createHash('sha256').update(bytes).digest('hex') !== manifestSHA) throw new Error('Inventario de integración Linux no verificable');
  const change = JSON.parse(bytes).changes[file];
  return !!change && change.before.includes(expected) && change.after === actual;
}
export function withLinuxDispatcher(source) {
  return source
    .replace("const WindowsAdApp = lazy(() => import('./windows-ad/WindowsAdApp'));", "const WindowsAdApp = lazy(() => import('./windows-ad/WindowsAdApp'));\nconst LinuxApp = lazy(() => import('./linux/LinuxApp'));")
    .replace("route.page === 'windows-ad' ? 'windows-ad' : route.page === 'splunk'", "route.page === 'windows-ad' ? 'windows-ad' : route.page === 'linux' ? 'linux' : route.page === 'splunk'")
    .replace(": course === 'splunk' ? <CourseBoundary>", ": course === 'linux' ? <Suspense fallback={<main id=\"main-content\" tabIndex={-1} className=\"page-shell\" role=\"status\">Abriendo el mundo Linux…</main>}><LinuxApp /></Suspense> : course === 'splunk' ? <CourseBoundary>");
}
export function withLinuxSelector(source) {
  return source.replace("course: 'sc200' | 'splunk' | 'redes' | 'windows-ad'", "course: 'sc200' | 'splunk' | 'redes' | 'windows-ad' | 'linux'")
    .replace('Windows + AD</a>', 'Windows + AD</a>\n    <a href="#/linux/ruta" aria-current={course === \'linux\' ? \'true\' : undefined}><span aria-hidden="true" className="academy-dot" />Linux</a>');
}
