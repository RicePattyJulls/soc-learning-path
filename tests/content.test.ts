import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseDocument, sanitize, hash } from '../scripts/content.mjs';

test('el documento real se conserva íntegro, con todos sus capítulos, tablas y código', async () => {
  const file = process.env.SC200_SOURCE || '/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md';
  const source = await readFile(file, 'utf8');
  const doc = parseDocument(source);
  assert.equal(doc.modules.length, 13);
  assert.equal(doc.modules[0].title, '1 · Licencia y onboarding');
  assert.equal(doc.modules.at(-1).title, '13 · Mapa de tablas y relaciones KQL');
  assert.equal(doc.lessons.map(l => l.markdown).join(''), sanitize(source).text);
  assert.equal(new Set(doc.lessons.map(l => l.id)).size, doc.lessons.length);
  assert.equal(doc.report.sourceHash, hash(source));
  assert.ok(doc.report.codeBlocks > 20);
  assert.equal(hash(await readFile(file, 'utf8')), hash(source));
  assert.ok(doc.lessons.some(l => l.markdown.includes('```kql')));
  assert.ok(doc.lessons.some(l => l.markdown.includes('| Concepto')));
  assert.equal(doc.report.unresolved.length, 0);
  assert.equal(doc.report.redactions.filter(r => r.kind === 'email').length, 1);
});

test('los encabezados dentro de código no crean capítulos y la jerarquía no se aplana', () => {
  const source = 'Texto inicial\n\n# Capítulo real\n\nIntroducción\n\n## Tema\n\n### Subtema\n\n#### Detalle\n\n```kql\n# No es un capítulo\n## Tampoco una lección\nprint x=1\n```\n\n## Tema\n\nRepetido\n';
  const doc = parseDocument(source);
  assert.equal(doc.modules.length, 1);
  assert.equal(doc.lessons.length, 4);
  assert.deepEqual(doc.lessons[2].sections.map(s => s.depth), [2, 3, 4]);
  assert.notEqual(doc.lessons[2].id, doc.lessons[3].id);
  assert.equal(doc.lessons.map(l => l.markdown).join(''), source);
  assert.equal(doc.lessons[2].sections[1].title, 'Subtema');
});

test('un capítulo sin H2 conserva todo el contenido y no inventa subdivisiones', () => {
  const doc = parseDocument('# Threat Intelligence\n\nTexto\n\n- Indicador\n\n```text\nSTIX\n```\n');
  assert.equal(doc.modules[0].lessonIds.length, 1);
  assert.equal(doc.lessons[0].title, 'Threat Intelligence');
  assert.equal(doc.lessons[0].syntheticTitle, false);
});

test('se rechazan documentos sin capítulos sin inventar títulos técnicos', () => {
  assert.throws(() => parseDocument('Texto sin capítulos'), /no contiene capítulos/);
});

test('secretos y datos personales desaparecen; el informe nunca incluye sus valores', () => {
  const examples = ['person@example.invalid', 'client_secret=SuperSecretValue42', 'AccountKey=abcdef0123456789', '192.168.1.2', '11111111-2222-3333-4444-555555555555', 'ghp_abcdefghijklmnopqrstuvwxyz12345'];
  const source = '# Ejemplos\n\n```text\n' + examples.join('\n') + '\n```\n\nhttps://example.invalid/?sig=abc12345\n';
  const doc = parseDocument(source);
  for (const value of examples) {
    assert.ok(!doc.text.includes(value));
    assert.ok(!JSON.stringify(doc.report).includes(value));
  }
  assert.ok(!doc.text.includes('abc12345'));
  assert.equal(doc.text.split('\n').length, source.split('\n').length);
  assert.equal(doc.report.codeBlocks, 1);
});

test('las imágenes y los enlaces de Obsidian se registran como recursos pendientes', () => {
  const doc = parseDocument('# Recursos\n\n![[imagen.png]]\n\n[[Otra nota|Etiqueta]]\n\n![Imagen](secreto.png)\n\n[Local](otra.md)\n');
  assert.ok(doc.report.unresolved.some(r => r.kind === 'obsidian-embed'));
  assert.ok(doc.report.unresolved.some(r => r.kind === 'obsidian-link'));
  assert.ok(doc.report.unresolved.some(r => r.kind === 'image'));
  assert.ok(doc.report.unresolved.some(r => r.kind === 'link'));
});

test('títulos con un prefijo común no cambian los IDs de otras lecciones', () => {
  const doc = parseDocument('# Capítulo\n\n## Cloud Apps\n\nUno\n\n## Cloud\n\nDos\n');
  assert.equal(doc.lessons[1].id, 'capitulo-capitulo/cloud-1');
});

test('el catálogo y los archivos públicos corresponden al origen y están saneados', async () => {
  const catalog = JSON.parse(await readFile(new URL('../src/generated/catalog.json', import.meta.url), 'utf8'));
  const source = await readFile(process.env.SC200_SOURCE || '/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md', 'utf8');
  const doc = parseDocument(source);
  assert.equal(catalog.sourceHash, hash(source));
  assert.equal(catalog.lessons.length, doc.lessons.length);
  const payloads = await Promise.all(catalog.lessons.map(async lesson => JSON.parse(await readFile(new URL('../public/' + lesson.file, import.meta.url), 'utf8'))));
  assert.equal(payloads.map(payload => payload.markdown).join(''), doc.text);
  payloads.forEach((payload, i) => assert.equal(hash(payload.markdown), catalog.lessons[i].version));
  assert.ok(!/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/.test(JSON.stringify(catalog)));
});
