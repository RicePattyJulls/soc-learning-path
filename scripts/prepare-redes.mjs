import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import { hash, sanitize } from './content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const base = path.join(root, 'REDES_MASTER_RESEARCH');
const json = data => JSON.stringify(data, null, 2) + '\n';
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const read = relative => readFile(path.join(base, relative), 'utf8');
const parser = unified().use(remarkParse).use(remarkGfm);

// Only explicitly synthetic addressing survives the normal privacy sanitizer.
function sanitizeTeaching(text, invalidExercise = false, lab = false) {
  const ips = [...new Set(text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [])];
  let protectedText = text;
  for (const [i, ip] of ips.entries()) {
    const valid = ip.split('.').every(n => +n <= 255);
    const allowed = valid && /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/.test(ip)
      || ip === '0.0.0.0' || lab && valid && /^10\.60\./.test(ip)
      || invalidExercise && ['999.0.2.70', '999.0.2.1'].includes(ip);
    if (allowed) protectedText = protectedText.replaceAll(ip, `REDESADDRESS${i}END`);
  }
  const sanitized = sanitize(protectedText);
  ips.forEach((ip, i) => { sanitized.text = sanitized.text.replaceAll(`REDESADDRESS${i}END`, ip); });
  assert(sanitized.redactions.length === 0, 'Un artefacto Redes necesita revisión de saneado antes de servirse');
  return sanitized.text;
}
export async function generateRedes({ write = false } = {}) {
  const manifest = JSON.parse(await read('VALIDACION/MANIFIESTO-EDITORIAL.json'));
  const verifiedInput = async relative => {
    const text = await read(relative);
    assert(hash(text) === manifest.hashes[relative], `Fuente modificada sin revisar: ${relative}`);
    return JSON.parse(text);
  };
  const editorial = await verifiedInput('VALIDACION/CATALOGO-EDITORIAL.json');
  const bank = await verifiedInput('04_ACTIVIDADES/BANCO-ACTIVIDADES.json');
  const sourceRegistry = await verifiedInput('05_RECURSOS/FUENTES.json');
  const plan = JSON.parse(await readFile(path.join(root, 'docs/redes/CATALOGO-PROPUESTO.json'), 'utf8'));
  assert(editorial.lessons.length === 168 && editorial.stages.length === 8, 'Catálogo Redes incompleto');
  const outputs = new Map();
  const put = (file, value) => {
    assert(file.startsWith('public/redes-content/') || file === 'src/redes/generated/catalog.json', 'Destino fuera del Mundo Redes');
    assert(!file.includes('..'), 'Destino inseguro');
    outputs.set(file, json(value));
  };
  const checkedRead = async relative => {
    const text = await read(relative);
    assert(hash(text) === manifest.hashes[relative], `Fuente modificada sin revisar: ${relative}`);
    return text;
  };
  const resources = [];
  for (const source of [
    { id: 'glosario', file: '05_RECURSOS/GLOSARIO.md', title: 'Glosario de Redes', kind: 'glossary' },
    ...editorial.labFiles.map(l => ({ id: l.id, file: l.file, title: plan.labs.find(p => p.id === l.id).title, kind: 'lab' })),
    { id: 'empresa-lab', file: '05_RECURSOS/EMPRESA-LAB.json', title: 'Empresa-Lab: caso integrador', kind: 'fixture' },
    { id: 'deteccion-120', file: '05_RECURSOS/DETECCION-120.json', title: 'Métricas de detección: 120 casos', kind: 'fixture' },
  ]) {
    const sourceText = await checkedRead(source.file);
    const markdown = sanitizeTeaching(source.file.endsWith('.json') ? `# ${source.title}\n\nDatos sintéticos para resolver las prácticas.\n\n\`\`\`json\n${sourceText.trimEnd()}\n\`\`\`\n` : sourceText, false, source.kind === 'lab');
    const file = `redes-content/recursos/${source.id}.json`;
    const resource = { courseId: 'redes', id: source.id, title: source.title, markdown, synthetic: true };
    put(`public/${file}`, resource);
    resources.push({ id: source.id, title: source.title, kind: source.kind, file, hash: hash(json(resource)) });
  }
  const lessons = [], reconstructions = [];
  for (const lesson of editorial.lessons) {
    const original = await checkedRead(lesson.file);
    assert(hash(original) === lesson.sha256, `${lesson.id}: huella editorial distinta`);
    const tree = parser.parse(original);
    const headings = tree.children.filter(n => n.type === 'heading' && n.depth === 2);
    assert(headings.length === 7, `${lesson.id}: se esperaban siete secciones`);
    const preamble = original.slice(0, headings[0].position.start.offset);
    const sections = headings.map((node, i) => ({ title: toString(node),
      markdown: original.slice(node.position.start.offset, headings[i + 1]?.position.start.offset ?? original.length),
      line: node.position.start.line }));
    assert(preamble + sections.map(s => s.markdown).join('') === original, `${lesson.id}: reconstrucción fallida`);
    const invalid = lesson.id.startsWith('RED-M36-');
    const cleaned = sections.map(s => ({ ...s, markdown: sanitizeTeaching(s.markdown, invalid) }));
    const items = bank.activities.filter(a => a.lessonId === lesson.id);
    const questions = items.filter(a => a.type === 'multiple_choice');
    const practice = items.find(a => a.type === 'open_practice');
    assert(questions.length === 2 && practice && questions.every(q => sections[4].markdown.includes(q.prompt) && q.options.every(o => sections[4].markdown.includes(`${o.id}. ${o.text}`))), `${lesson.id}: evaluación ajena al Markdown`);
    const study = [
      { id: `${lesson.id}-S01`, title: 'Comprende el mecanismo', markdown: cleaned[0].markdown + cleaned[1].markdown },
      { id: `${lesson.id}-S02`, title: 'Sigue el caso resuelto', markdown: cleaned[2].markdown },
      { id: `${lesson.id}-S03`, title: 'Conecta con tu trabajo', markdown: cleaned[5].markdown + cleaned[6].markdown },
    ];
    const answers = { courseId: 'redes', id: lesson.id, sourceHash: lesson.sha256,
      questions: questions.map(q => ({ id: q.id, correctOptionId: q.correctOptionId, explanation: sanitizeTeaching(q.explanation, invalid) })),
      practice: { referenceAnswer: sanitizeTeaching(practice.referenceAnswer, invalid), rubric: practice.rubric },
    };
    const payload = { schemaVersion: 1, courseId: 'redes', id: lesson.id, title: lesson.title, sourceHash: lesson.sha256,
      practicalStatus: 'not_assessed', study,
      practice: { id: practice.id, prompt: sanitizeTeaching(practice.prompt, invalid), markdown: cleaned[3].markdown },
      questions: questions.map(q => ({ id: q.id, prompt: q.prompt, options: q.options })),
      referencesMarkdown: cleaned[6].markdown,
    };
    const revision = hash(json({ payload, answers })).slice(0, 24);
    payload.revision = revision;
    answers.revision = revision;
    const stem = `redes-content/${lesson.id}-${revision}`;
    put(`public/${stem}.json`, payload);
    put(`public/${stem}.answers.json`, answers);
    assert(!/"(?:correctOptionId|referenceAnswer|rubric)":/.test(json(payload)), `${lesson.id}: soluciones en contenido del estudiante`);
    lessons.push({ id: lesson.id, title: lesson.title, stageId: lesson.stageId, moduleId: lesson.moduleId,
      objective: lesson.objective, prerequisites: lesson.prerequisites, revision, sourceHash: lesson.sha256,
      file: `${stem}.json`, hash: hash(json(payload)), answersFile: `${stem}.answers.json`, answersHash: hash(json(answers)),
      stepIds: study.map(s => s.id), questionIds: questions.map(q => q.id), labIds: lesson.labIds });
    reconstructions.push({ id: lesson.id, sourceHash: lesson.sha256, sections: 7, verified: true });
  }
  const catalog = { schemaVersion: 1, courseId: 'redes', revision: hash(json(lessons)).slice(0, 24),
    stages: editorial.stages, lessons, resources, sources: sourceRegistry.sources,
    practicalStatus: 'not_assessed', labsExecuted: false, educationalReview: editorial.educationalReview };
  put('src/redes/generated/catalog.json', catalog);
  if (write) for (const [file, content] of outputs) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), content);
  }
  return { catalog, outputs, report: { lessons: lessons.length, stages: catalog.stages.length, questions: lessons.length * 2,
    resources: resources.length, solutionsSeparated: true, reconstructions, files: outputs.size } };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { report } = await generateRedes({ write: true });
  await mkdir(path.join(root, 'docs/redes'), { recursive: true });
  await writeFile(path.join(root, 'docs/redes/VALIDACION-WEB-CONTENIDO.json'), json(report));
  console.log(json({ ...report, reconstructions: `${report.reconstructions.length}/${report.lessons}` }));
}
