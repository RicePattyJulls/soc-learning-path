import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseDocument, hash } from './content.mjs';
import { buildEducation } from './education.mjs';
import { compatibility } from './v25/index.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = process.env.SC200_SOURCE || '/home/tommy/Documentos/AZURE/OBSIDIAN/SC200/SC-200.md';
let original;
try { original = await readFile(source, 'utf8'); }
catch { throw new Error('No se encuentra SC-200.md. Indica su ubicación con SC200_SOURCE=/ruta/SC-200.md.'); }
const parsed = parseDocument(original);
const education = parsed.lessons.map(lesson => buildEducation(lesson, process.env.SOC_EDUCATION_PHASE || 'full'));
const out = path.join(root, 'public/content');
// Only generated files in this new project are replaced.
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await mkdir(path.join(root, 'src/generated'), { recursive: true });
const catalog = {
  schemaVersion: 1, source: 'SC-200.md', sourceHash: hash(original),
  prelude: parsed.prelude, modules: parsed.modules,
  lessons: parsed.lessons.map(({ markdown, start, end, ...lesson }, index) => ({
    ...lesson, file: `content/${index + 1}-${lesson.version.slice(0, 10)}-${education[index].revision.slice(0, 8)}.json`,
    learning: { revision: education[index].revision, coverage: education[index].coverage, stepIds: education[index].steps.map(s => s.id),
      practiceIds: education[index].questions.filter(q => q.phase === 'practice').map(q => q.id), assessmentIds: education[index].questions.filter(q => q.phase === 'assessment').map(q => q.id),
      ...(education[index].review && compatibility[lesson.id]?.sourceVersion===lesson.version && compatibility[lesson.id].questions.length===0 && JSON.stringify(compatibility[lesson.id].stepIds)===JSON.stringify(education[index].steps.map(s=>s.id)) ? {previousRevision:compatibility[lesson.id].revision} : {}) },
  })),
  report: parsed.report,
};
await Promise.all(catalog.lessons.map((lesson, index) => writeFile(path.join(root, 'public', lesson.file), JSON.stringify({ version: lesson.version, markdown: parsed.lessons[index].markdown, education: education[index] }))));
await writeFile(path.join(root, 'src/generated/catalog.json'), JSON.stringify(catalog));
await writeFile(path.join(root, 'src/generated/search-index.json'), JSON.stringify(parsed.lessons.map(l => ({ id: l.id, text: l.markdown.replace(/\s+/g, ' ') }))));
await writeFile(path.join(root, 'docs/content-audit.json'), JSON.stringify(parsed.report, null, 2) + '\n');
const outline = ['# Estructura derivada de SC-200.md', '', 'Generado desde los títulos reales. La apertura y los estados/XP son metadatos de navegación.', '', `Origen SHA-256: \`${parsed.report.sourceHash}\`.`, ''];
if (parsed.prelude) {
  const preludeLesson = parsed.lessons.find(l => l.id === parsed.prelude);
  outline.push(`- Apertura del documento: texto anterior al primer capítulo, líneas ${preludeLesson.line}–${preludeLesson.endLine}.`, '');
}
for (const chapter of parsed.modules) {
  outline.push(`## ${chapter.title}`, '', `Línea ${chapter.line}. ${chapter.lessonIds.length} lecturas.`, '');
  for (const id of chapter.lessonIds) {
    const lesson = parsed.lessons.find(l => l.id === id);
    outline.push(`- ${lesson.title} (líneas ${lesson.line}–${lesson.endLine})`);
    for (const section of lesson.sections.filter(s => s.depth > 2)) outline.push(`${'  '.repeat(section.depth - 2)}- ${section.title} (línea ${section.line})`);
  }
  outline.push('');
}
await writeFile(path.join(root, 'docs/CONTENIDO.md'), outline.join('\n') + '\n');
const coverage = { phase: process.env.SOC_EDUCATION_PHASE || 'full', sourceHash: catalog.sourceHash, guidedLessons: education.length,
  reviewedLessons: education.filter(e => e.coverage === 'reviewed').length, activities: education.reduce((n, e) => n + e.questions.length, 0),
  lessons: education.map(e => ({ id: e.lessonId, coverage: e.coverage, pilot: e.pilot, steps: e.steps.length, activities: e.questions.length, revision: e.revision })) };
await writeFile(path.join(root, 'docs/education-coverage.json'), JSON.stringify(coverage, null, 2) + '\n');
console.log(`Educación: ${coverage.guidedLessons} recorridos guiados, ${coverage.reviewedLessons} con actividades revisadas, ${coverage.activities} actividades con evidencia.`);
const after = await readFile(source, 'utf8');
if (hash(after) !== hash(original)) throw new Error('El origen ha cambiado durante la preparación. Vuelve a ejecutar.');
console.log(`SC-200.md → ${catalog.modules.length} capítulos, ${catalog.lessons.length} lecturas, ${parsed.report.headings} encabezados. Partición íntegra verificada.`);
console.log(`Datos ocultos: ${parsed.report.redactions.length}. Recursos sin resolver: ${parsed.report.unresolved.length}. Original sin modificar.`);
