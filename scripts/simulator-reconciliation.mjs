import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));const MANIFEST_SHA='f70658e4a020ca412091715b07d0405daa1cd883bc8ca32f172dba9883d89cbe';
export function simulatorChange(file,expected,actual){
 const bytes=readFileSync(path.join(root,'docs/HANDOFF-CONCILIACION-SIMULATOR.json'));
 if(createHash('sha256').update(bytes).digest('hex')!==MANIFEST_SHA)throw Error('DETENER: conciliación del simulador no verificable');
 const change=JSON.parse(bytes)[file];return !!change&&change.before.includes(expected)&&change.after===actual;
}
