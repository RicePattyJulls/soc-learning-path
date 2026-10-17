import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { ROOT, sha256 } from './splunk-integrity.mjs';
import { checkV11Protected } from './splunk-v11-integrity.mjs';
import { catalog } from '../src/splunk/data';
import { applySplunk, emptySplunk, splunkStats } from '../src/splunk/progress';
import type { SplunkPayload, SplunkAction } from '../src/splunk/types';

const destination=process.argv[2] || 'output/splunk-v11';
if(!/^output\/splunk-v11(?:\/[\w.-]+)*$/.test(destination)||destination.includes('..'))throw new Error('Destino de informe no permitido');
const out=path.join(ROOT,destination);await mkdir(out,{recursive:true});
const lessons=await Promise.all(catalog.lessons.map(async lesson=>({lesson,payload:JSON.parse(await readFile(path.join(ROOT,'public',lesson.file),'utf8')) as SplunkPayload})));
const fichas=lessons.map(({lesson,payload})=>({id:lesson.id,title:lesson.title,revision:lesson.revision,sourceVersion:lesson.sourceVersion,prerequisites:lesson.prerequisites,reviewer:null,reviewedAt:null,approved:false,humanReview:lesson.humanReview,splunkExecuted:false,questions:payload.questions,formative:payload.formative,reviewChecklist:['Exactitud técnica, producto/versión y citas','Claridad y distractores/pistas por longitud','Suficiencia de rúbrica, cobertura y dificultad','No confundir teoría con dominio práctico'],reviewNotes:lesson.id==='SP-R02-L06'?['Q01 conserva un distractor sobre colores de severidad, posiblemente demasiado fácil; revisión humana pendiente sin alterar el banco protegido.']:lesson.id==='SP-R03-L07'?['Validar didácticamente nulos/NAT/ventana UTC, no inferir compromiso ni benignidad del umbral sintético.']:['Anclas amplias de enseñanza; confirmar afirmación concreta y suficiencia de rúbrica genérica.']}));
await writeFile(path.join(out,'revision-educativa.json'),JSON.stringify({status:'pending_independent_review',lessons:fichas},null,2)+'\n');
let state=emptySplunk(),now=0;
for(const {lesson,payload} of lessons) {
  const send=(action:SplunkAction)=>{state=applySplunk(state,catalog,lesson,payload,action,++now);};
  for(const stepId of lesson.stepIds)send({type:'seen',stepId});send({type:'summary'});send({type:'start',attemptId:'offline-'+lesson.id});
  for(const q of payload.questions)send({type:'answer',questionId:q.id,optionId:q.solution});send({type:'finish'});send({type:'formative'});send({type:'review'});
}
const html=await readFile(path.join(ROOT,'dist/index.html'),'utf8');
const initialFiles=[...html.matchAll(/(?:src|href)="\.\/(assets\/[^" ]+\.(?:js|css))"/g)].map(m=>m[1]);
const initial=await Promise.all(initialFiles.map(async file=>{const bytes=await readFile(path.join(ROOT,'dist',file));return {file,bytes:bytes.length,gzip:gzipSync(bytes).length,sha256:sha256(bytes)};}));
const jsFiles=(await readdir(path.join(ROOT,'dist/assets'))).filter(file=>file.endsWith('.js'));
const chunks=await Promise.all(jsFiles.map(async file=>({file,bytes:await readFile(path.join(ROOT,'dist/assets',file),'utf8')})));
const css=await Promise.all((await readdir(path.join(ROOT,'dist/assets'))).filter(file=>file.endsWith('.css')).map(async file=>({file,bytes:(await readFile(path.join(ROOT,'dist/assets',file))).length})));
if(chunks.some(c=>/SP-R(?:0[4-9]|1[01])-L/.test(c.bytes)))throw new Error('Lección no autorizada en JavaScript');
if(initial.some(f=>f.file.endsWith('.js')&&chunks.find(c=>'assets/'+c.file===f.file)?.bytes.includes('SP-R02-L01')))throw new Error('Splunk en entrada inicial');
for(const {payload} of lessons)if(chunks.some(c=>c.bytes.includes(payload.originalMarkdown)))throw new Error('Markdown completo empaquetado en JS');
const report={date:new Date().toISOString(),scope:'R01–R03 only, offline',coverage:{regions:catalog.regions.length,lessons:lessons.length,questions:lessons.flatMap(l=>l.payload.questions).length,formative:lessons.flatMap(l=>l.payload.formative).length},integrity:await checkV11Protected(),xpSynthetic:splunkStats(state,catalog),regionAwards:state.regionAwards,bundle:{initial,initialBytes:initial.reduce((n,f)=>n+f.bytes,0),initialGzip:initial.reduce((n,f)=>n+f.gzip,0),chunks:chunks.map(c=>({file:c.file,bytes:Buffer.byteLength(c.bytes)})),css,lessonPayloadsInInitial:false,unauthorizedIdsInJS:false,benchmark:false},browser:'Separate evidence required; old R01 PASS does not validate V1.1',humanReview:'pending_independent_review',realSplunk:'not_executed'};
await writeFile(path.join(out,'resultados-offline.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
