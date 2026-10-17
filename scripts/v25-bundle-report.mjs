import {readFile,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import path from 'node:path';
const report={date:new Date().toISOString(),scope:'Solo JS/CSS referenciados por index.html, gzip por archivo (zlib nivel predeterminado 6); excluye chunks diferidos. Payloads: únicamente los 76 archivos del catálogo de cada versión, bajo demanda.',reference:'V2.2 0.2.2 extraída del respaldo del proyecto; mismo sourceHash e IDs.'};
for(const [label,dir,catalogPath] of [['v22','/tmp/soc-v22-reference','output/v25/reanudacion/baseline-v22-catalog.json'],['v25','dist','src/generated/catalog.json']]){
 const html=await readFile(path.join(dir,'index.html'),'utf8'),catalog=JSON.parse(await readFile(catalogPath,'utf8'));
 const files=[...html.matchAll(/(?:src|href)="(?:\.\/|\/)(assets\/[^" ]+\.(?:js|css))"/g)].map(m=>m[1]);
 const initial=await Promise.all(files.map(f=>readFile(path.join(dir,f)))),payloads=await Promise.all(catalog.lessons.map(l=>readFile(path.join(dir,l.file))));
 report[label]={version:label==='v22'?'0.2.2':JSON.parse(await readFile('package.json','utf8')).version,files,bytes:initial.reduce((n,b)=>n+b.length,0),gzip:initial.reduce((n,b)=>n+gzipSync(b).length,0),payloads:payloads.length,payloadsBytes:payloads.reduce((n,b)=>n+b.length,0),payloadsGzip:payloads.reduce((n,b)=>n+gzipSync(b).length,0),largestPayloadBytes:Math.max(...payloads.map(b=>b.length)),sourceHash:catalog.sourceHash,indexHash:createHash('sha256').update(html).digest('hex')};
}
if(report.v22.sourceHash!==report.v25.sourceHash)throw Error('Origen distinto');
report.deltaBytes=report.v25.bytes-report.v22.bytes;report.deltaGzip=report.v25.gzip-report.v22.gzip;
await writeFile('output/v25/reanudacion/bundle-final.json',JSON.stringify(report,null,2)+'\n');console.log(report);
