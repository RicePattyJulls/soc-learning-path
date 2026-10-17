import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {catalog} from '../src/splunk/data';
import {emptySplunk,recordFor} from '../src/splunk/progress';
import {LessonBody} from '../src/splunk/SplunkReader';
import SplunkMarkdown from '../src/splunk/SplunkMarkdown';
import {studyPosition} from '../src/splunk/reader-presentation';
const payloads=await Promise.all(catalog.lessons.map(async l=>JSON.parse(await readFile(new URL('../public/'+l.file,import.meta.url),'utf8'))));

test('lector: reanudar pasos 1–3 estudiados significa 4; una selección explícita conserva 1,2,3,4,5',()=>{
  for(const lesson of catalog.lessons){
    const seen=lesson.stepIds.slice(0,3),saved=JSON.stringify(seen);
    assert.deepEqual(studyPosition(new URLSearchParams(),lesson.stepIds,seen),{index:3,resumeIndex:3});
    for(let step=1;step<=5;step++)assert.equal(studyPosition(new URLSearchParams('paso='+step),lesson.stepIds,seen).index,step-1);
    assert.equal(JSON.stringify(seen),saved);
    assert.equal(studyPosition(new URLSearchParams(),lesson.stepIds,[]).index,0);
    assert.equal(studyPosition(new URLSearchParams(),lesson.stepIds,lesson.stepIds).index,0);
  }
});
test('lector: las 90 secciones tienen un único encabezado; Markdown y demás contenidos no se modifican',()=>{
  for(const [i,lesson] of catalog.lessons.entries()){
    const data=payloads[i],before=JSON.stringify(data);
    for(const [j,section] of data.sections.entries()){
      const markup=renderToStaticMarkup(createElement(LessonBody,{lesson,data,params:new URLSearchParams('fase=estudio&paso='+(j+1)),store:emptySplunk(),send:()=>{}}));
      const heading=renderToStaticMarkup(createElement('h2',{tabIndex:-1},section.title));
      const duplicate=renderToStaticMarkup(createElement('h3',null,section.title));
      assert.equal(markup.split(heading).length-1,1,section.id);
      assert.ok(!markup.includes(duplicate),section.id+': sin título duplicado');
      const body=renderToStaticMarkup(createElement(SplunkMarkdown,{children:section.markdown,omitLeadingHeading:true}));
      assert.ok(markup.includes(body),section.id+': cuerpo completo');
      assert.ok(renderToStaticMarkup(createElement(SplunkMarkdown,{children:section.markdown})).includes(duplicate),'Render normal y fuente completa conservan el título');
    }
    assert.equal(JSON.stringify(data),before);
  }
});
test('lector: omitir el título repetido conserva subtítulos, bloques de código y el render predeterminado',()=>{
  const markdown='## Título original\n\nTexto completo.\n\n## Otro encabezado\n\n```text\n## Esto es código\n```';
  const normal=renderToStaticMarkup(createElement(SplunkMarkdown,{children:markdown}));
  const body=renderToStaticMarkup(createElement(SplunkMarkdown,{children:markdown,omitLeadingHeading:true}));
  assert.ok(normal.includes('<h3>Título original</h3>'));assert.ok(!body.includes('<h3>Título original</h3>'));
  assert.ok(body.includes('<h3>Otro encabezado</h3>'));assert.ok(body.includes('## Esto es código'));assert.ok(body.includes('Texto completo.'));
});
test('lector: reanudación anunciada sin cambiar pasos estudiados ni acciones educativas al renderizar',()=>{
  const lesson=catalog.lessons[0],data=payloads[0],store=emptySplunk();
  const record=recordFor(store,lesson);record.seen=lesson.stepIds.slice(0,3);store.records[lesson.id]={[lesson.revision]:record};
  const before=JSON.stringify(store),actions:unknown[]=[];
  const markup=renderToStaticMarkup(createElement(LessonBody,{lesson,data,params:new URLSearchParams('fase=mision'),store,send:(_l,_p,a)=>actions.push(a)}));
  assert.ok(markup.includes('Reanudarás en el paso 4 de 5'));assert.deepEqual(actions,[]);assert.equal(JSON.stringify(store),before);
});
