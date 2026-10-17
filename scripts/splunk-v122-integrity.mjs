import {v20FileSet} from './splunk-v20-reconciliation.mjs';
import { authorizedHistoricalChange } from './splunk-checkpoint-reconciliation.mjs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT,hashes,filesUnder,sha256} from './splunk-integrity.mjs';
import {checkV121Protected} from './splunk-v121-integrity.mjs';
export async function checkV122Protected(root=ROOT){
  const baseline=JSON.parse(await readFile(path.join(root,'output/splunk-v122/respaldo/inventario.json')));
  const current=await hashes(Object.keys(baseline.protected),root);
  const changed=Object.keys(current).filter(f=>current[f]!==baseline.protected[f]&&!authorizedHistoricalChange(f,baseline.protected[f],current[f]));
  // The CSS must load from the application entry, leaving the reader's pure
  // render importable in Node. Accept exactly one scoped stylesheet import.
  const app='src/splunk/SplunkApp.tsx';
  const originalApp=await readFile(path.join(root,'output/splunk-v122/respaldo/archivos',app),'utf8');
  const expectedApp=originalApp.replace("import './splunk.css';","import './splunk.css';\nimport './reader.css';");
  const readerStyleImport=changed.includes(app)&&await readFile(path.join(root,app),'utf8')===expectedApp;
  if(readerStyleImport)changed.splice(changed.indexOf(app),1);
  for(const dir of ['src/generated','public/content','public/splunk-content','SPLUNK_MASTER_RESEARCH']){
    const old=Object.keys(baseline.protected).filter(f=>f.startsWith(dir+'/')).sort();
    if(JSON.stringify(await filesUnder(dir,root))!==JSON.stringify(old)&&!v20FileSet(dir,old,await filesUnder(dir,root)))changed.push(dir+': conjunto');
  }
  const copies=await hashes(Object.keys(baseline.original),path.join(root,'output/splunk-v122/respaldo/archivos'));
  for(const f of Object.keys(copies))if(copies[f]!==baseline.original[f])changed.push('respaldo: '+f);
  if(sha256(JSON.stringify(baseline.original))!==baseline.inventorySha256)changed.push('inventario original');
  if(changed.length)throw Error('DETENER V1.2.2: '+changed.join(', '));
  return {historical:await checkV121Protected(root),checked:Object.keys(current).length,readerStyleImport:readerStyleImport?app:null,verifiedCopies:Object.keys(copies).length,changed:[],maps:'R01–R03, río R02, geometría y CSS de mapas idénticos al checkpoint V1.2.1'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await checkV122Protected(),null,2));
