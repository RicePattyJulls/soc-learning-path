import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {v25,compatibility} from './v25/index.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),read=async p=>JSON.parse(await readFile(path.join(root,p),'utf8'));
const batch=process.argv.find(a=>a.startsWith('--batch='))?.split('=')[1];assert.ok(batch);
const catalog=await read('src/generated/catalog.json'),definition=await read(`scripts/v25/batch-${batch}.json`),baseline=await read('output/v25/baseline-v24.json');
const prompts=new Set(),ids=new Set();let total=0,original=0,steps=0;
for(const lesson of catalog.lessons){
 const payload=await read('public/'+lesson.file),education=payload.education,old=compatibility[lesson.id];
 assert.equal(payload.version,old.sourceVersion);assert.deepEqual(education.steps.map(s=>s.id),old.stepIds);steps+=education.steps.length;
 if(old.questions.length){assert.deepEqual(education.questions,old.questions);assert.equal(education.revision,old.revision);original+=old.questions.length;}
 for(const q of education.questions){
  assert.ok(!ids.has(q.id),q.id);ids.add(q.id);assert.ok(!prompts.has(q.prompt.trim().toLowerCase()),'Prompt duplicado '+q.id);prompts.add(q.prompt.trim().toLowerCase());
  assert.ok(q.explanation.length>30);assert.ok(q.references.length);assert.ok(q.solution.length);assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);assert.equal(new Set(q.options.map(o=>o.text)).size,q.options.length);assert.ok(q.solution.every(s=>q.options.some(o=>o.id===s)));
  for(const ref of q.references){assert.equal(ref.lessonId,lesson.id);assert.equal(ref.sourceVersion,lesson.version);const at=payload.markdown.indexOf(ref.quote);assert.ok(at>=0);assert.equal(ref.line,lesson.line+payload.markdown.slice(0,at).split('\n').length-1);assert.equal(ref.endLine,ref.line+ref.quote.split('\n').length-1);assert.ok(ref.endLine<=lesson.endLine);}
  if(q.id.startsWith('v25-')){assert.ok(q.objective.length>15);assert.ok(['basica','intermedia','avanzada'].includes(q.difficulty));assert.ok(q.options.every(o=>q.type==='match'||o.why?.length>20));assert.equal(education.review.human,false);total++;}
 }
}
assert.equal(original,35);assert.equal(steps,719);assert.equal(catalog.lessons.length,76);assert.equal(catalog.modules.length,13);
const source='/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md';assert.equal(createHash('sha256').update(await readFile(source)).digest('hex'),baseline[source]);
for(const d of definition.lessons){assert.ok(d.audit.mainConcepts.length);if(d.blocked){assert.ok(d.limitations.length);assert.equal(d.questions.length,0);}else{assert.ok(v25.some(l=>l.lessonId===d.lessonId));assert.ok(d.questions.some(q=>q.phase==='practice'));assert.ok(d.questions.some(q=>q.phase==='assessment'));}}
const log=await readFile(path.join(root,`output/v25/batch-${batch}-tests.log`),'utf8');assert.match(log,/# fail 0/);assert.ok(log.includes(`${total+original} actividades con evidencia.`),'Log obsoleto para los datos actuales');
const report={date:new Date().toISOString(),batch,passed:true,testsPassed:true,activities:definition.lessons.reduce((n,l)=>n+l.questions.length,0),totalNewActivities:total,originalConserved:original,steps,readings:76,tests:['npm test (unitarias educativas, contenido, progreso y geometría)','citas exactas/líneas/versiones','IDs/prompts/opciones/soluciones únicos y válidos','35 actividades/revisiones originales intactas; 719 pasos e IDs conservados','revisión semántica del agente contra fuente local (no humana/independiente)'],humanReview:false,independentReview:false};
await writeFile(path.join(root,`output/v25/batch-${batch}-validation.json`),JSON.stringify(report,null,2)+'\n');console.log(report);
