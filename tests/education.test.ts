import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildEducation } from '../scripts/education.mjs';
import { grade } from '../src/lib/learning';

const catalog = JSON.parse(await readFile(new URL('../src/generated/catalog.json', import.meta.url), 'utf8'));
const baseline = JSON.parse(await readFile(new URL('fixtures/v1-catalog.json', import.meta.url), 'utf8'));
const payloads = await Promise.all(catalog.lessons.map(async lesson => JSON.parse(await readFile(new URL('../public/' + lesson.file, import.meta.url), 'utf8'))));
test('V1 conserva exactamente sus 13 capítulos, 76 IDs y versiones de contenido', () => {
  assert.deepEqual(catalog.modules, baseline.modules);
  assert.deepEqual(catalog.lessons.map(({ id, version, title, line, endLine }) => ({ id, version, title, line, endLine })), baseline.lessons);
  assert.equal(catalog.sourceHash, baseline.sourceHash);
});
test('las 76 lecturas tienen pasos y su original completo, sin simular evaluación en la cobertura pendiente', () => {
  let code = 0;
  for (const [i, payload] of payloads.entries()) {
    const edu = payload.education, lesson = catalog.lessons[i];
    assert.equal(edu.lessonId, lesson.id);
    assert.equal(edu.revision, lesson.learning.revision);
    assert.ok(edu.steps.length > 0 && payload.markdown.length > 0);
    assert.equal(new Set(edu.steps.map(s => s.id)).size, edu.steps.length);
    for (const step of edu.steps) {
      assert.ok(payload.markdown.includes(step.source.quote));
      assert.equal(step.source.sourceVersion, lesson.version);
      assert.ok(step.source.line >= lesson.line && step.source.endLine <= lesson.endLine);
      assert.ok(step.context.length > 0);
      if (step.kind === 'code') { code++; assert.ok(step.markdown.startsWith('```')); }
      if (step.kind === 'comparison') assert.ok(step.cards.every(card => card.fields.length > 0));
    }
    if (edu.reviewRequired) {
      assert.equal(edu.questions.length, 0);
      assert.equal(edu.coverage, 'guided');
    } else {
      assert.ok(edu.questions.filter(q => q.phase === 'practice').length >= 1);
      assert.ok(edu.questions.some(q => q.phase === 'assessment'));
    }
  }
  assert.equal(code, catalog.report.codeBlocks);
});
test('todas las actividades, soluciones y citas se verifican contra su lectura real', () => {
  const ids = new Set(); let count = 0;
  for (const [index, payload] of payloads.entries()) for (const q of payload.education.questions) {
    assert.ok(!ids.has(q.id)); ids.add(q.id); count++;
    assert.ok(q.explanation.length > 30);
    assert.ok(q.references.length > 0);
    for (const ref of q.references) {
      assert.ok(payload.markdown.includes(ref.quote), q.id);
      const actual = catalog.lessons[index].line + payload.markdown.slice(0, payload.markdown.indexOf(ref.quote)).split('\n').length - 1;
      assert.equal(ref.line, actual);
      assert.equal(ref.lessonId, catalog.lessons[index].id);
      assert.equal(ref.sourceVersion, catalog.lessons[index].version);
    }
    assert.equal(grade(q, q.solution), true, q.id);
    assert.equal(grade(q, []), false, q.id);
    assert.equal(grade(q, ['inexistente']), false, q.id);
    if (q.type === 'match' || q.type === 'order') assert.equal(grade(q, [...q.solution].reverse()), false, q.id);
    if (q.type === 'choice' || q.type === 'true-false') for (const option of q.options.filter(o => !q.solution.includes(o.id))) {
      assert.equal(grade(q, [option.id]), false, q.id);
      assert.ok(option.why?.length > 20, q.id);
    }
  }
  assert.ok(count >= 12);
});
test('un cambio que deja una cita sin respaldo hace fallar la preparación', () => {
  const i = catalog.lessons.findIndex(l => l.id.includes('/1-licencia-y-onboarding-'));
  assert.throws(() => buildEducation({ ...catalog.lessons[i], markdown: payloads[i].markdown.replace('No conecta ni ingiere datos.', 'TEXTO CAMBIADO.') }, 'pilots'), /Evidencia no encontrada/);
});
