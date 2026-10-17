import { readFile,readdir,writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { ROOT,sha256 } from './splunk-integrity.mjs';
import { checkV12Protected } from './splunk-v12-integrity.mjs';
const destination=process.argv[2];
if(!/^output\/splunk-v12\/validacion\/[\w-]+$/.test(destination||''))throw new Error('Destino de artefactos no permitido');
const html=await readFile(path.join(ROOT,'dist/index.html'),'utf8');
const entries=[...html.matchAll(/(?:src|href)="\.\/(assets\/[^" ]+\.(?:js|css))"/g)].map(m=>m[1]);
const assets=await Promise.all((await readdir(path.join(ROOT,'dist/assets'))).filter(f=>/\.(js|css)$/.test(f)).map(async f=>{const bytes=await readFile(path.join(ROOT,'dist/assets',f));return {file:f,bytes:bytes.length,gzip:gzipSync(bytes).length,sha256:sha256(bytes),initial:entries.includes('assets/'+f)};}));
const code=(await Promise.all(assets.filter(a=>a.file.endsWith('.js')).map(a=>readFile(path.join(ROOT,'dist/assets',a.file),'utf8')))).join('\n');
const initialCode=(await Promise.all(assets.filter(a=>a.initial&&a.file.endsWith('.js')).map(a=>readFile(path.join(ROOT,'dist/assets',a.file),'utf8')))).join('\n');
if(/SP-R(?:0[4-9]|1[01])-L\d\d/.test(code))throw new Error('Lecciones no autorizadas empaquetadas');
if(initialCode.includes('SP-R02-L01'))throw new Error('Catálogo Splunk no diferido');
const catalog=JSON.parse(await readFile(path.join(ROOT,'src/generated/splunk/catalog.json'),'utf8'));
for(const lesson of catalog.lessons){const payload=JSON.parse(await readFile(path.join(ROOT,'public',lesson.file),'utf8'));if(code.includes(payload.originalMarkdown))throw new Error('Fuente completa en bundle JS');}
const report={date:new Date().toISOString(),scope:'V1.2 visual_only',integrity:await checkV12Protected(),assets,initialBytes:assets.filter(a=>a.initial).reduce((n,a)=>n+a.bytes,0),initialGzip:assets.filter(a=>a.initial).reduce((n,a)=>n+a.gzip,0),lazySplunk:true,otherRegionsInBundle:false,lessonMarkdownInBundle:false,benchmark:false,review:'18 fichas siguen pendientes; no se modifica el contenido',browser:'Separate evidence, pending where environment blocks'};
await writeFile(path.join(ROOT,destination,'artefactos.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
