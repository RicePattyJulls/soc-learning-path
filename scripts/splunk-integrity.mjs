import { checkpointDocumentChange, authorizedHistoricalChange } from './splunk-checkpoint-reconciliation.mjs';
import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const BACKUP = 'output/splunk-pilot-r01/respaldo';
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export async function filesUnder(relative, root = ROOT) {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const file = path.posix.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`No se admiten enlaces en el inventario: ${file}`);
    if (entry.isDirectory()) result.push(...await filesUnder(file, root));
    else if (entry.isFile()) result.push(file);
  }
  return result.sort();
}
export async function hashes(files, root = ROOT) {
  return Object.fromEntries(await Promise.all(files.map(async file => [file, sha256(await readFile(path.join(root, file)))])));
}
export async function checkProtected(root = ROOT) {
  const inventory = JSON.parse(await readFile(path.join(root, BACKUP, 'inventario.json'), 'utf8'));
  const actual = await hashes(Object.keys(inventory.protected), root);
  const changed = Object.keys(actual).filter(file => actual[file] !== inventory.protected[file] && !authorizedHistoricalChange(file, inventory.protected[file], actual[file]));
  if (changed.length) throw new Error(`DETENER: cambios protegidos no autorizados: ${changed.join(', ')}`);
  for (const dir of ['public/content', 'src/generated']) {
    const old = Object.keys(inventory.protected).filter(file => file.startsWith(dir + '/'));
    const now = (await filesUnder(dir, root)).filter(file => !file.startsWith('src/generated/splunk/'));
    if (JSON.stringify(old.sort()) !== JSON.stringify(now.sort())) changed.push(`${dir}: conjunto de archivos`);
  }
  if (changed.length) throw new Error(`DETENER: cambios protegidos no autorizados: ${changed.join(', ')}`);
  return { checked: Object.keys(actual).length, changed: [], reconciled: Object.keys(actual).filter(file => checkpointDocumentChange(file, inventory.protected[file], actual[file])), sc200: inventory.sc200 };
}

async function backup() {
  const destination = path.join(ROOT, BACKUP);
  await mkdir(destination, { recursive: true });
  try { await readFile(path.join(destination, 'inventario.json')); throw new Error('El respaldo ya existe: no se sobrescribe'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const roots = ['src', 'scripts', 'tests', 'docs', 'public'];
  const config = ['AGENTS.md', 'package.json', 'package-lock.json', 'index.html', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'vite.config.ts'];
  const files = (await Promise.all(roots.map(dir => filesUnder(dir)))).flat();
  for (const file of config) { try { await readFile(path.join(ROOT, file)); files.push(file); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
  const original = await hashes(files);
  // Only application code/sanitized derivatives: no browser profiles, storage,
  // environment files, external source Markdown, credentials or dot directories.
  const copies = path.join(destination, 'archivos');
  for (const file of files) {
    await mkdir(path.dirname(path.join(copies, file)), { recursive: true });
    await copyFile(path.join(ROOT, file), path.join(copies, file));
    const bytes = await readFile(path.join(copies, file));
    if (sha256(bytes) !== original[file]) throw new Error(`Respaldo no verificable: ${file}`);
  }
  const research = (await filesUnder('SPLUNK_MASTER_RESEARCH')).filter(file => !file.includes('/RESPALDOS/'));
  const protectedFiles = [...files.filter(file => file !== 'src/App.tsx' && file !== 'package.json' && !file.startsWith('scripts/splunk')), ...research];
  const catalog = JSON.parse(await readFile(path.join(ROOT, 'src/generated/catalog.json'), 'utf8'));
  const inventory = { createdAt: new Date().toISOString(), backup: { directory: 'archivos', inventorySha256: sha256(JSON.stringify(original)), verifiedFiles: files.length }, original, protected: await hashes(protectedFiles), sc200: { chapters: catalog.modules.length, lessons: catalog.lessons.length, steps: catalog.lessons.reduce((n,l) => n + l.learning.stepIds.length, 0), activities: catalog.lessons.reduce((n,l) => n + l.learning.practiceIds.length + l.learning.assessmentIds.length, 0), sourceHash: catalog.sourceHash } };
  await writeFile(path.join(destination, 'inventario.json'), JSON.stringify(inventory, null, 2) + '\n');
  console.log(JSON.stringify({ backup: inventory.backup, protected: protectedFiles.length, sc200: inventory.sc200 }));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--backup')) await backup();
  else console.log(JSON.stringify(await checkProtected()));
}
