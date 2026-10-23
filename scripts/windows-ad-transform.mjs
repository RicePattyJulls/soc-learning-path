import { readdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// One-shot transform: adapt the copied Redes world module into a self-contained
// Windows + Active Directory module. Only touches src/windows-ad/.
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/windows-ad');
const files = (await readdir(dir)).filter(f => /\.(ts|tsx|css)$/.test(f));
const ordered = [
  ['redes.css', 'windows-ad.css'],
  ['redes-content', 'windows-ad-content'],
  ['redes-academy', 'windows-ad-academy'],
  ['redes-progreso.json', 'windows-ad-progreso.json'],
  ['soc-learning-path-redes-v1', 'soc-learning-path-windows-ad-v1'],
  ['soc-learning-path:redes:learning:v1', 'soc-learning-path:windows-ad:learning:v1'],
  ['REDES_KEY', 'WINDOWS_AD_KEY'],
  ['useRedesProgress', 'useWindowsAdProgress'],
  ['useRedesContent', 'useWindowsAdContent'],
  ['RedesBoundary', 'WindowsAdBoundary'],
  ['RedesMap', 'WindowsAdMap'],
  ['RedesApp', 'WindowsAdApp'],
  ['red-node-', 'wad-node-'],
  ['#/redes', '#/windows-ad'],
  ["'redes'", "'windows-ad'"],
  ['Mundo Redes', 'Mundo Windows + AD'],
  ['Redes', 'Windows + AD'],
  ['redes', 'windows-ad'],
];
for (const file of files) {
  const filePath = path.join(dir, file);
  let text = await readFile(filePath, 'utf8');
  for (const [from, to] of ordered) text = text.replaceAll(from, to);
  await writeFile(filePath, text);
}
await rename(path.join(dir, 'RedesApp.tsx'), path.join(dir, 'WindowsAdApp.tsx'));
console.log('transformed', files.join(', '));
