import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Authoring helper for the Linux world. It stamps lesson hashes into the
// editorial catalog and writes a manifest of every source file the web
// generator is allowed to read. It never touches application code or content.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'LINUX_MASTER_RESEARCH');
const sha = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const read = relative => readFile(path.join(base, relative), 'utf8');

const catalogPath = 'VALIDACION/CATALOGO-EDITORIAL.json';
const manifestPath = 'VALIDACION/MANIFIESTO-EDITORIAL.json';
const catalog = JSON.parse(await read(catalogPath));

for (const lesson of catalog.lessons) lesson.sha256 = sha(await read(lesson.file));
await writeFile(path.join(base, catalogPath), serialize(catalog));

const entries = await readdir(base, { recursive: true, withFileTypes: true });
const hashes = {};
for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
  if (!entry.isFile()) continue;
  const absolute = path.join(entry.parentPath ?? entry.path, entry.name);
  const relative = path.relative(base, absolute).split(path.sep).join('/');
  if (relative === manifestPath) continue;
  hashes[relative] = sha(await readFile(absolute));
}
await writeFile(path.join(base, manifestPath), serialize({ schemaVersion: 1, courseId: 'linux', hashes }));
console.log(JSON.stringify({ lessons: catalog.lessons.length, files: Object.keys(hashes).length }));
