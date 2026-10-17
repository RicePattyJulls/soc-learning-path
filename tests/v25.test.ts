import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {emptyLearning,emptyRecord,currentRecord,applyLearning,totalXP,learningStatus,facade,attemptScore} from '../src/lib/learning';
import type {Education} from '../src/education';
import type {Lesson,Chapter} from '../src/types';
const metadata={revision:'new',previousRevision:'v24',coverage:'reviewed',stepIds:['step-1','step-2'],practiceIds:['practice-1'],assessmentIds:['exam-1','exam-2']};
const lesson:Lesson={id:'stable',moduleId:null,title:'Test',syntheticTitle:false,line:1,endLine:2,version:'source',file:'',sections:[],learning:metadata};
test('V25 conserva estudio/completado por revisión V24 explícita, sin regalar dominio ni duplicar XP',()=>{
 const record={...emptyRecord(),started:true,seen:['step-1','step-2'],cursor:1,summary:true,completed:true,updated:10};
 const store={...emptyLearning(),records:{stable:{v24:record}},awards:{stable:['study','summary'] as ('study'|'summary')[]}};
 assert.deepEqual(currentRecord(store,lesson),record);assert.equal(learningStatus(lesson,facade(store,[lesson])),'completed');assert.equal(totalXP(store),10);
 const next=applyLearning(store,lesson,{type:'visit'},[],20);assert.deepEqual(next.records.stable.v24,record);assert.equal(next.records.stable.new.cursor,1);assert.deepEqual(next.records.stable.new.seen,record.seen);assert.equal(next.records.stable.new.mastered,false);assert.equal(totalXP(next),10);
 assert.equal(currentRecord(next,lesson),next.records.stable.new);
 assert.equal(currentRecord(store,{...lesson,learning:{...metadata,previousRevision:undefined}}).started,false);
});
test('V25 conserva el avance parcial V24 y no permite evaluar ni dominar al abrir',()=>{
 const old={...emptyRecord(),started:true,seen:['step-1'],cursor:1,updated:10};const store={...emptyLearning(),records:{stable:{v24:old}}};
 const next=applyLearning(store,lesson,{type:'exam-start',attemptId:'no'},[],20);assert.equal(next,store);assert.deepEqual(currentRecord(store,lesson).seen,['step-1']);
 const visit=applyLearning(store,lesson,{type:'visit'},[],21);assert.equal(totalXP(visit),0);assert.equal(currentRecord(visit,lesson).mastered,false);
});
test('V25 los datos nuevos tienen objetivo/dificultad y las actividades V24 permanecen idénticas',async()=>{
 const catalog=JSON.parse(await readFile(new URL('../src/generated/catalog.json',import.meta.url),'utf8'));
 const baseline=JSON.parse(await readFile(new URL('../scripts/v25/compatibility.json',import.meta.url),'utf8'));
 let originals=0,newCount=0;
 for(const l of catalog.lessons){const p=JSON.parse(await readFile(new URL('../public/'+l.file,import.meta.url),'utf8'));const old=baseline[l.id];assert.equal(l.version,old.sourceVersion);assert.deepEqual(l.learning.stepIds,old.stepIds);
  if(old.questions.length){originals+=old.questions.length;assert.deepEqual(p.education.questions,old.questions);assert.equal(p.education.revision,old.revision);}
  for(const q of p.education.questions.filter((q:{id:string})=>q.id.startsWith('v25-'))){newCount++;assert.ok(q.objective.length>15);assert.ok(['basica','intermedia','avanzada'].includes(q.difficulty));assert.equal(p.education.review.human,false);assert.equal(l.learning.previousRevision,old.revision);}
 }
 assert.equal(originals,35);assert.ok(newCount>0);
});

test('una lectura breve permite evaluar sin inflar preguntas; exige 80%, conserva historial V24 y premios únicos',async()=>{
 const catalog=JSON.parse(await readFile(new URL('../src/generated/catalog.json',import.meta.url),'utf8'));
 const lesson:Lesson=catalog.lessons.find((l:Lesson)=>l.id==='capitulo-5-almacenamiento-y-retencion/5-almacenamiento-y-retencion-1');
 const edu:Education=JSON.parse(await readFile(new URL('../public/'+lesson.file,import.meta.url),'utf8')).education;
 const practice=edu.questions.find(q=>q.phase==='practice')!,exam=edu.questions.filter(q=>q.phase==='assessment');
 assert.equal(exam.length,1);
 const previous={...emptyRecord(),started:true,seen:lesson.learning!.stepIds,summary:true,completed:true};
 let state={...emptyLearning(),records:{[lesson.id]:{[lesson.learning!.previousRevision!]:previous}},awards:{[lesson.id]:['study','summary'] as ('study'|'summary')[]}};
 const act=(a:Parameters<typeof applyLearning>[2])=>{state=applyLearning(state,lesson,a,[]);};
 assert.equal(totalXP(state),10);
 act({type:'practice',question:practice,answer:practice.solution});assert.equal(totalXP(state),15);
 act({type:'exam-start',attemptId:'fallo'});act({type:'exam-answer',attemptId:'fallo',question:exam[0],answer:[exam[0].options.find(o=>!exam[0].solution.includes(o.id))!.id]});
 assert.equal(attemptScore(currentRecord(state,lesson),'fallo',lesson.learning!.assessmentIds).passed,false);
 assert.equal(currentRecord(state,lesson).mastered,false);
 for(const attemptId of ['acierto','repetido']){act({type:'exam-start',attemptId});act({type:'exam-answer',attemptId,question:exam[0],answer:exam[0].solution});}
 assert.equal(currentRecord(state,lesson).mastered,true);assert.equal(totalXP(state),45);
 for(let i=0;i<3;i++)act({type:'review',question:exam[0],answer:exam[0].solution});
 assert.equal(totalXP(state),50);assert.deepEqual(state.records[lesson.id][lesson.learning!.previousRevision!],previous);
 const emptyExam={...lesson,learning:{...lesson.learning!,assessmentIds:[]}};
 assert.equal(applyLearning(state,emptyExam,{type:'exam-start',attemptId:'vacio'},[]),state);
});
