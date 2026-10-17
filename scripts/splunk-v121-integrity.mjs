import {v20FileSet} from './splunk-v20-reconciliation.mjs';
import { authorizedHistoricalChange } from './splunk-checkpoint-reconciliation.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, filesUnder, hashes, sha256 } from './splunk-integrity.mjs';
import { checkV12Protected } from './splunk-v12-integrity.mjs';
export async function checkV121Protected(root=ROOT) {
  const baseline=JSON.parse(await readFile(path.join(root,'output/splunk-v121/respaldo/inventario.json')));
  const current=await hashes(Object.keys(baseline.protected),root);
  const changed=Object.keys(current).filter(f=>current[f]!==baseline.protected[f]&&!authorizedHistoricalChange(f,baseline.protected[f],current[f]));
  for(const dir of ['src/generated','public/content','public/splunk-content','SPLUNK_MASTER_RESEARCH']) {
    const old=Object.keys(baseline.protected).filter(f=>f.startsWith(dir+'/')).sort();
    if(JSON.stringify(await filesUnder(dir,root))!==JSON.stringify(old)&&!v20FileSet(dir,old,await filesUnder(dir,root)))changed.push(dir+': conjunto');
  }
  const copies=await hashes(Object.keys(baseline.original),path.join(root,'output/splunk-v121/respaldo/archivos'));
  for(const file of Object.keys(copies))if(copies[file]!==baseline.original[file])changed.push('respaldo: '+file);
  if(sha256(JSON.stringify(baseline.original))!==baseline.inventorySha256)changed.push('inventario original');
  if(changed.length)throw Error('DETENER V1.2.1: '+changed.join(', '));
  return {historical:await checkV12Protected(root),checked:Object.keys(current).length,verifiedCopies:Object.keys(copies).length,changed:[],documentaryCheckpoint:'RETOMAR exacto conciliado; inventarios históricos intactos'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await checkV121Protected(),null,2));
