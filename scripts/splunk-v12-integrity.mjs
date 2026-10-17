import {v20FileSet} from './splunk-v20-reconciliation.mjs';
import { authorizedHistoricalChange } from './splunk-checkpoint-reconciliation.mjs';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, filesUnder, hashes, sha256 } from './splunk-integrity.mjs';
import { checkV11Protected } from './splunk-v11-integrity.mjs';

export const V12_BACKUP = 'output/splunk-v12/respaldo';
const inventoryFile = root => path.join(root,V12_BACKUP,'inventario.json');
// Visual surface and tests only. Learning, generated files, SC-200 and sources
// remain immutable, including any files added to an existing content directory.
const allowed = new Set(['src/splunk/SplunkMap.tsx','src/splunk/SplunkMarkdown.tsx','src/splunk/SplunkApp.tsx','src/splunk/splunk.css','tests/splunk.test.ts','tests/splunk-v11.test.ts']);
export async function checkV12Protected(root = ROOT) {
  const prior = await checkV11Protected(root);
  const inventory = JSON.parse(await readFile(inventoryFile(root),'utf8'));
  const actual = await hashes(Object.keys(inventory.protected),root);
  const changed=Object.keys(actual).filter(file=>actual[file]!==inventory.protected[file]&&!authorizedHistoricalChange(file,inventory.protected[file],actual[file]));
  for(const dir of ['public/splunk-content','src/generated/splunk']) {
    const current=await filesUnder(dir,root);
    const old=Object.keys(inventory.protected).filter(f=>f.startsWith(dir+'/')).sort();
    if(JSON.stringify(current)!==JSON.stringify(old)&&!v20FileSet(dir,old,current))changed.push(dir+': conjunto');
  }
  if(changed.length)throw new Error('DETENER V1.2: '+changed.join(', '));
  return {prior,checked:Object.keys(actual).length,changed:[],splunk:inventory.splunk};
}
async function backup() {
  await checkV11Protected();
  try{await readFile(inventoryFile(ROOT));throw new Error('Respaldo V1.2 existente: no sobrescribir');}catch(e){if(e.code!=='ENOENT')throw e;}
  const files=(await Promise.all(['src','scripts','tests','docs','public'].map(dir=>filesUnder(dir)))).flat();
  files.push('AGENTS.md','package.json','package-lock.json','index.html','tsconfig.json','vite.config.ts');
  const original=await hashes(files);
  for(const file of files) {
    const target=path.join(ROOT,V12_BACKUP,'archivos',file);
    await mkdir(path.dirname(target),{recursive:true});await copyFile(path.join(ROOT,file),target);
    if(sha256(await readFile(target))!==original[file])throw new Error('Copia no verificable: '+file);
  }
  const evidence=await filesUnder('output/playwright/splunk-r01-r03/2026-10-16T18-44-40-251Z');
  const protectedFiles=[...files.filter(f=>!allowed.has(f)),...evidence];
  const catalog=JSON.parse(await readFile(path.join(ROOT,'src/generated/splunk/catalog.json'),'utf8'));
  const inventory={createdAt:new Date().toISOString(),verifiedCopies:files.length,inventorySha256:sha256(JSON.stringify(original)),excludes:['secretos','archivos de entorno','perfiles de navegador','LocalStorage'],original,protected:await hashes(protectedFiles),splunk:{regions:catalog.regions.length,lessons:catalog.lessons.length,activities:catalog.lessons.reduce((n,l)=>n+l.questionIds.length+l.formativeIds.length,0),catalogHash:sha256(await readFile(path.join(ROOT,'src/generated/splunk/catalog.json')))}};
  await writeFile(inventoryFile(ROOT),JSON.stringify(inventory,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({verifiedCopies:files.length,inventorySha256:inventory.inventorySha256,integrity:await checkV12Protected()}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv.includes('--backup'))await backup();else console.log(JSON.stringify(await checkV12Protected()));
}
