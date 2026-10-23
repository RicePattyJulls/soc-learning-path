import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));const MANIFEST_SHA='26851d59fd510f3e41eb7cd495a79d5d42871425e0f71920437424114f9bcf8f';
export function simulatorChange(file,expected,actual){
 const bytes=readFileSync(path.join(root,'docs/HANDOFF-CONCILIACION-SIMULATOR.json'));
 if(createHash('sha256').update(bytes).digest('hex')!==MANIFEST_SHA)throw Error('DETENER: conciliación del simulador no verificable');
 const change=JSON.parse(bytes)[file];return !!change&&change.before.includes(expected)&&change.after===actual;
}
