import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../',import.meta.url));
const raw=file=>readFile(path.join(root,file),'utf8'),read=async file=>JSON.parse(await raw(file));
const sha=data=>createHash('sha256').update(data).digest('hex');
const catalog=await read('src/generated/catalog.json'),state=await read('docs/V25-COBERTURA.json'),baseline=await read('scripts/v25/compatibility.json');
const protectedHashes=await read('output/v25/baseline-v24.json');
const report={date:new Date().toISOString(),sourceHash:catalog.sourceHash,batches:[],chapters:[],pending:[],originalActivities:0,newActivities:0,steps:0,types:{},protectedFiles:[],review:'Estructura y citas verificadas automáticamente. Revisión semántica del agente conservada mediante hashes de los lotes; no revisión humana ni independiente.'};
for(const batch of state.batches){
 const definition=await raw('scripts/v25/batch-'+batch.batch+'.json'),validation=await read(batch.report);
 assert.equal(sha(definition),batch.definitionHash);assert.equal(validation.passed,true);assert.equal(validation.testsPassed,true);
 assert.equal(JSON.parse(definition).lessons.reduce((n,l)=>n+l.questions.length,0),batch.activities);
 report.batches.push({batch:batch.batch,activities:batch.activities,definitionHash:batch.definitionHash,validation:batch.report});
}
const ids=new Set(),prompts=new Set();
for(const l of catalog.lessons){
 const p=await read('public/'+l.file),edu=p.education,old=baseline[l.id],record=state.lessons.find(r=>r.id===l.id);
 assert.equal(l.version,old.sourceVersion);assert.deepEqual(edu.steps.map(s=>s.id),old.stepIds);report.steps+=edu.steps.length;
 if(old.questions.length){assert.deepEqual(edu.questions,old.questions);assert.equal(edu.revision,old.revision);report.originalActivities+=old.questions.length;}
 else{report.newActivities+=edu.questions.length;if(edu.questions.length)assert.equal(l.learning.previousRevision,old.revision);}
 assert.equal(edu.questions.length,record.existingActivities+record.newActivities);
 if(!edu.questions.length){assert.equal(edu.reviewRequired,true);assert.ok(['BLOQUEADA','PENDIENTE_REVISION'].includes(record.status));report.pending.push({id:l.id,title:l.title,line:l.line,endLine:l.endLine,reason:record.limitations});}
 for(const q of edu.questions){
  assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(!prompts.has(q.prompt.trim().toLowerCase()));prompts.add(q.prompt.trim().toLowerCase());
  assert.ok(q.references.length&&q.solution.length);assert.ok(q.solution.every(id=>q.options.some(o=>o.id===id)));
  assert.ok(q.explanation.length>30);
  for(const ref of q.references){const at=p.markdown.indexOf(ref.quote);assert.ok(at>=0,q.id);assert.equal(ref.lessonId,l.id);assert.equal(ref.sourceVersion,l.version);assert.equal(ref.line,l.line+p.markdown.slice(0,at).split('\n').length-1);assert.equal(ref.endLine,ref.line+ref.quote.split('\n').length-1);assert.ok(ref.endLine<=l.endLine);}
  if(q.id.startsWith('v25-'))assert.ok(q.options.every(o=>q.type==='match'||o.why?.length>20));
  report.types[q.type]=(report.types[q.type]||0)+1;
 }
}
for(const chapter of catalog.modules){const entries=state.lessons.filter(l=>l.chapter===chapter.id);report.chapters.push({id:chapter.id,title:chapter.title,readings:entries.length,enriched:entries.filter(l=>l.newActivities+l.existingActivities>0).length,activities:entries.reduce((n,l)=>n+l.newActivities+l.existingActivities,0)});}
const protectedPaths=Object.keys(protectedHashes).filter(p=>p.endsWith('/SC-200.md')||/^src\/(components\/adventure\/|lib\/(region-visuals|adventure|pilot-landscape)|.*\.css$)/.test(p)||p==='scripts/activities.mjs');
for(const file of protectedPaths){assert.equal(sha(await readFile(path.isAbsolute(file)?file:path.join(root,file))),protectedHashes[file],file);report.protectedFiles.push(file);}
assert.equal(report.originalActivities,35);assert.equal(report.newActivities,state.metrics.newActivities);assert.equal(report.steps,719);assert.equal(catalog.lessons.length,76);assert.equal(catalog.modules.length,13);assert.equal(report.pending.length,state.metrics.blocked+(state.metrics.pendingReview||0));
report.readings=76;report.withActivities=76-report.pending.length;report.totalActivities=ids.size;report.passed=true;
await mkdir(path.join(root,'output/v25/reanudacion'),{recursive:true});await writeFile(path.join(root,'output/v25/reanudacion/content-audit-final.json'),JSON.stringify(report,null,2)+'\n');
console.log({passed:report.passed,readings:report.readings,withActivities:report.withActivities,activities:report.totalActivities,steps:report.steps,pending:report.pending.length,protectedFiles:report.protectedFiles.length});
