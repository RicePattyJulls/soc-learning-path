import {simulatorChange} from './simulator-reconciliation.mjs';
import {redesChange} from './redes-reconciliation.mjs';
import {windowsAdChange} from './windows-ad-reconciliation.mjs';
import {linuxChange} from './linux-reconciliation.mjs';
import {socChange} from './soc-reconciliation.mjs';
import {repasoSocChange} from './repaso-soc-reconciliation.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
// Each authorized extension is a path + historical SHA + final SHA triple.
// The manifest itself is pinned after validation; no wildcard/source exemption.
const MANIFEST_SHA='4d9dcfe4f5a1d058a3d0374bb9c992b5e2362032901de7bb3412ed7032713724';
function edits(){
  const bytes=readFileSync(path.join(root,'output/splunk-v20/cambios-autorizados.json'));
  if(createHash('sha256').update(bytes).digest('hex')!==MANIFEST_SHA)throw Error('DETENER V2.0: inventario de cambios no verificable');
  return JSON.parse(bytes);
}
export function v20Change(file,expected,actual){
  if(redesChange(file,expected,actual))return true;
  if(windowsAdChange(file,expected,actual))return true;
  if(linuxChange(file,expected,actual))return true;
  if(socChange(file,expected,actual))return true;
  if(repasoSocChange(file,expected,actual))return true;
  if(simulatorChange(file,expected,actual))return true;
  const change=edits()[file];return !!change&&change.before.includes(expected)&&change.after===actual;
}
export function v20FileSet(dir,old,current){
  if(!['public/splunk-content','src/generated'].includes(dir))return false;
  const counts=[5,6,7,8,7,8,8,8,8,8,7];
  const ids=counts.flatMap((n,r)=>Array.from({length:n},(_,l)=>`SP-R${String(r+1).padStart(2,'0')}-L${String(l+1).padStart(2,'0')}`));
  const expected=dir==='src/generated'?old:[...ids.map(id=>`${dir}/${id}.json`),`${dir}/resources.json`,...counts.slice(1).map((_,i)=>`${dir}/resources-SP-R${String(i+2).padStart(2,'0')}.json`)];
  return JSON.stringify([...expected].sort())===JSON.stringify([...current].sort());
}
