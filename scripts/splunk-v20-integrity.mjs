import {simulatorChange} from './simulator-reconciliation.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT,filesUnder,hashes,sha256} from './splunk-integrity.mjs';
import {checkV122Protected} from './splunk-v122-integrity.mjs';
import {v20Change} from './splunk-v20-reconciliation.mjs';
import {buildSplunk} from './prepare-splunk.mjs';
export async function checkV20Protected(root=ROOT){
  const backup=path.join(root,'output/splunk-v20/respaldo');
  const inventory=JSON.parse(await readFile(path.join(backup,'inventario.json')));
  const copies=await hashes(Object.keys(inventory.original),path.join(backup,'archivos'));
  assert.deepEqual(copies,inventory.original,'Respaldo V2.0 alterado');
  assert.equal(sha256(JSON.stringify(copies)),inventory.inventorySha256);
  assert.deepEqual(await hashes(Object.keys(inventory.protected),root),inventory.protected,'Fuentes/evidencias alteradas');
  const current=await hashes(Object.keys(inventory.original),root);
  const changed=Object.keys(current).filter(file=>current[file]!==inventory.original[file]);
  for(const file of changed)assert.ok(v20Change(file,inventory.original[file],current[file]),`Cambio no autorizado: ${file}`);
  // These may never be included in the extension allowlist.
  for(const file of Object.keys(current).filter(f=>(f.startsWith('src/')&&!f.startsWith('src/splunk/')&&!f.startsWith('src/generated/splunk/'))||f.startsWith('public/content/')||['src/splunk/progress.ts','src/splunk/useSplunk.ts','src/splunk/data.ts','src/splunk/PremiumWorld.tsx','src/splunk/RegionScene.tsx','src/splunk/premium-world.css'].includes(f)))assert.ok(current[file]===inventory.original[file]||['src/App.tsx','src/components/AcademySelector.tsx'].includes(file)&&simulatorChange(file,inventory.original[file],current[file]),file);
  const generated=await buildSplunk(root);
  assert.equal(generated.catalog.regions.length,11);assert.equal(generated.catalog.lessons.length,80);
  for(const [file,text] of generated.outputs)assert.equal(await readFile(path.join(root,file),'utf8'),text,`Derivado no determinista: ${file}`);
  for(const dir of ['public/splunk-content','src/generated/splunk'])assert.deepEqual(await filesUnder(dir,root),generated.outputs.map(([f])=>f).filter(f=>f.startsWith(dir+'/')).sort(),`Conjunto exacto ${dir}`);
  for(const lesson of inventory.catalog.lessons)assert.deepEqual(generated.catalog.lessons.find(l=>l.id===lesson.id),lesson,'Metadatos de las primeras 18');
  for(const region of inventory.catalog.regions)assert.deepEqual(generated.catalog.regions.find(r=>r.id===region.id),region,'Regiones y recursos anteriores');
  const before=await readFile(path.join(backup,'archivos/src/splunk/world-model.ts'),'utf8'),after=await readFile(path.join(root,'src/splunk/world-model.ts'),'utf8');
  for(const key of ['const palette =','  harbor:','  river:','  forest:'])assert.equal(after.split('\n').find(l=>l.startsWith(key)),before.split('\n').find(l=>l.startsWith(key)),`Paisaje R01–R03: ${key}`);
  return {historical:await checkV122Protected(root),verifiedCopies:Object.keys(copies).length,protectedSources:Object.keys(inventory.protected).length,changedAuthorized:changed,sc200:'13/76/719/272 intactos',splunk:{regions:11,lessons:80,activities:240},storage:'Motores, clave y esquema idénticos; sin migración',riverR02:'Configuración, renderizador, geometría y CSS intactos'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await checkV20Protected(),null,2));
