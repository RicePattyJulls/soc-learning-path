import {authorizedHistoricalChange} from './splunk-checkpoint-reconciliation.mjs';
import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, filesUnder, hashes, sha256, checkProtected } from './splunk-integrity.mjs';

export const V11_BACKUP = 'output/splunk-v11/respaldo';
const inventoryPath = root => path.join(root, V11_BACKUP, 'inventario.json');
export async function checkV11Protected(root = ROOT) {
  const sc200 = await checkProtected(root);
  const baseline = JSON.parse(await readFile(inventoryPath(root), 'utf8'));
  const actual = await hashes(Object.keys(baseline.protected), root);
  const changed = Object.keys(actual).filter(file => actual[file] !== baseline.protected[file] && !authorizedHistoricalChange(file,baseline.protected[file],actual[file]));
  const frozenEngine = ['src/splunk/progress.ts', 'src/splunk/useSplunk.ts', 'src/splunk/data.ts'];
  const engineHashes = await hashes(frozenEngine, root);
  for (const file of frozenEngine) if (engineHashes[file] !== baseline.original[file]) changed.push(file);
  const catalog = JSON.parse(await readFile(path.join(root, 'src/generated/splunk/catalog.json'), 'utf8'));
  for (const lesson of baseline.r01.lessons) {
    if (JSON.stringify(catalog.lessons.find(item => item.id === lesson.id)) !== JSON.stringify(lesson)) changed.push(`${lesson.id}: metadatos/revisión`);
  }
  if (changed.length) throw new Error(`DETENER V1.1: contenido protegido modificado: ${changed.join(', ')}`);
  return { sc200, additionalChecked: Object.keys(actual).length + frozenEngine.length, r01Lessons: baseline.r01.lessons.length, changed: [] };
}
async function backup() {
  await checkProtected();
  try { await readFile(inventoryPath(ROOT)); throw new Error('El respaldo V1.1 ya existe; no se sobrescribe'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const roots = ['src', 'scripts', 'tests', 'docs', 'public'];
  const files = (await Promise.all(roots.map(dir => filesUnder(dir)))).flat();
  for (const file of ['AGENTS.md', 'package.json', 'package-lock.json', 'index.html', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'vite.config.ts']) {
    try { await readFile(path.join(ROOT, file)); files.push(file); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const original = await hashes(files);
  const destination = path.join(ROOT, V11_BACKUP);
  for (const file of files) {
    const target = path.join(destination, 'archivos', file);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(ROOT, file), target);
    if (sha256(await readFile(target)) !== original[file]) throw new Error(`Copia no verificable: ${file}`);
  }
  const catalog = JSON.parse(await readFile(path.join(ROOT, 'src/generated/splunk/catalog.json'), 'utf8'));
  const evidence = await filesUnder('output/playwright/splunk-piloto-r01');
  const protectedFiles = [...catalog.lessons.map(l => `public/${l.file}`), 'public/splunk-content/resources.json', 'src/App.tsx', 'src/academies.css', 'docs/SPLUNK-PILOTO-R01.md', 'output/splunk-pilot-r01/revision-educativa.json', ...evidence];
  const inventory = { createdAt: new Date().toISOString(), backup: { verifiedFiles: files.length, inventorySha256: sha256(JSON.stringify(original)), excludes: ['secretos', 'perfiles de navegador', 'LocalStorage', 'archivos de entorno'] }, original, protected: await hashes(protectedFiles), r01: { lessons: catalog.lessons, regions: catalog.regions, resourcesHash: catalog.resourcesHash }, sc200: await checkProtected() };
  await writeFile(inventoryPath(ROOT), JSON.stringify(inventory, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ backup: inventory.backup, invariants: await checkV11Protected() }));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--backup')) await backup();
  else console.log(JSON.stringify(await checkV11Protected()));
}
