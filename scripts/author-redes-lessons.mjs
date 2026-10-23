import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { sanitize } from './content.mjs';
import { sources, moduleReferences } from './redes-editorial/sources.mjs';
import { reviewInfo, moduleReview, lessonEdits, questionEdits } from './redes-editorial/review.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'REDES_MASTER_RESEARCH');
const json = value => JSON.stringify(value, null, 2) + '\n';
const sha = value => createHash('sha256').update(value).digest('hex');
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
const args = process.argv.slice(2);
ensure(args.every(a => ['--write', '--replace'].includes(a)), 'Argumentos: --write [--replace]');
ensure(args.includes('--write'), 'Usa --write para materializar los borradores; --replace solo tras revisar ediciones existentes.');
const planBytes = await readFile(path.join(root, 'docs/redes/CATALOGO-PROPUESTO.json'));
const plan = JSON.parse(planBytes);
const moduleMap = new Map(plan.modules.map(m => [m.id, m]));
const sourceMap = new Map(sources.map(s => [s.id, s]));
const inputs = ['e01', 'e02', 'e03-routing', 'e03-wan', 'e04', 'e05', 'e06', 'e07', 'e08'];
const editorial = {}, authoringSources = [];
for (const name of [...inputs, 'format', 'sources', 'review']) {
  const file = `scripts/redes-editorial/${name}.mjs`;
  authoringSources.push({ file, sha256: sha(await readFile(path.join(root, file))) });
  if (!inputs.includes(name)) continue;
  const data = (await import(`./redes-editorial/${name}.mjs`)).default;
  for (const [id, entries] of Object.entries(data)) {
    ensure(!editorial[id], `Módulo duplicado: ${id}`);
    editorial[id] = entries;
  }
}
ensure(Object.keys(editorial).length === 42 && plan.lessons.length === 168, 'Inventario editorial inesperado');
ensure(Object.keys(editorial).every(id => moduleMap.has(id)), 'Módulo fuera de catálogo');
ensure(Object.keys(moduleReview).length === 42 && Object.keys(moduleReview).every(id => moduleMap.has(id)), 'Revisión incompleta de módulos');
const lessonMap = new Map(plan.lessons.map(lesson => [lesson.id, lesson]));
ensure(Object.keys(lessonEdits).every(id => lessonMap.has(id)), 'Corrección para lección inexistente');
const usedQuestionEdits = new Set();
authoringSources.push({ file: 'scripts/author-redes-lessons.mjs', sha256: sha(await readFile(path.join(root, 'scripts/author-redes-lessons.mjs'))) });

// Preserve only documentation addresses/constants and two explicitly invalid
// validation examples. No broad exemption for real network addresses or secrets.
function clean(text, lessonId) {
  ensure(!text.includes('REDESDOCIPMARKER'), 'Marcador reservado en fuente');
  const addresses = [...new Set(text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || [])];
  for (const ip of addresses) {
    const octets = ip.split('.').map(Number);
    const documentation = octets.every(v => v >= 0 && v <= 255) && /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/.test(ip);
    const constant = ip === '0.0.0.0';
    const invalidExercise = ['RED-M36-L01', 'RED-M36-L03'].includes(lessonId) && ip === '999.0.2.70';
    // M36-L03 uses a distinct invalid row in its regression example.
    const invalidRegression = lessonId === 'RED-M36-L03' && ip === '999.0.2.1';
    ensure(documentation || constant || invalidExercise || invalidRegression, `${lessonId}: dirección no aprobada para el ejemplo docente`);
  }
  let protectedText = text;
  addresses.forEach((ip, i) => { protectedText = protectedText.replaceAll(ip, `REDESDOCIPMARKER${i}END`); });
  const result = sanitize(protectedText);
  ensure(result.redactions.length === 0, `${lessonId}: patrón sensible requiere revisión (${result.redactions.map(r => r.kind).join(', ')})`);
  addresses.forEach((ip, i) => { result.text = result.text.replaceAll(`REDESDOCIPMARKER${i}END`, ip); });
  ensure(result.text === text, `${lessonId}: el saneado alteró el ejemplo`);
  return text;
}
function shuffleOptions(id, question) {
  const ordered = [...question.options];
  const seed = createHash('sha256').update(id).digest();
  for (let i = ordered.length - 1; i > 0; i--) {
    const at = seed[i] % (i + 1);
    [ordered[i], ordered[at]] = [ordered[at], ordered[i]];
  }
  return { options: ordered.map((text, i) => ({ id: String.fromCharCode(65 + i), text })),
    correctOptionId: String.fromCharCode(65 + ordered.indexOf(question.options[0])) };
}
function sectionsOf(markdown) {
  const starts = [...markdown.matchAll(/^## (.+)$/gm)];
  const preamble = markdown.slice(0, starts[0].index);
  const sections = starts.map((m, i) => ({ title: m[1], markdown: markdown.slice(m.index, starts[i + 1]?.index ?? markdown.length),
    line: markdown.slice(0, m.index).split('\n').length,
    endLine: markdown.slice(0, starts[i + 1]?.index ?? markdown.length).trimEnd().split('\n').length }));
  ensure(preamble + sections.map(s => s.markdown).join('') === markdown, 'Reconstrucción incompleta');
  return sections;
}

const outputs = new Map();
function add(file, text) {
  ensure(!outputs.has(file) && !path.isAbsolute(file) && !file.split('/').includes('..'), `Destino inválido: ${file}`);
  outputs.set(file, text);
}
const activities = [], lessons = [], cases = [];
for (const lesson of plan.lessons) {
  const module = moduleMap.get(lesson.moduleId);
  const position = module.lessonIds.indexOf(lesson.id);
  ensure(editorial[module.id].length === 4 && position >= 0, `${lesson.id}: posición inválida`);
  const entry = { ...editorial[module.id][position], ...lessonEdits[lesson.id] };
  const reviewModule = moduleReview[module.id];
  const review = reviewModule.lessons[position];
  ensure(reviewModule.lessons.length === 4 && review?.feedback.length === 2 && review.evidence.length >= 2, `${lesson.id}: revisión educativa incompleta`);
  ensure(review.feedback.every(text => typeof text === 'string' && text.length >= 45), `${lesson.id}: feedback incompleto`);
  ensure(review.evidence.every(text => typeof text === 'string' && text.length >= 25), `${lesson.id}: criterios incompletos`);
  for (const key of ['objective', 'theory', 'example', 'reasoning', 'task', 'expected']) ensure(typeof entry[key] === 'string' && entry[key].length >= 25, `${lesson.id}: ${key} incompleto`);
  ensure(entry.theory.length >= 300, `${lesson.id}: explicación insuficiente`);
  ensure(entry.questions.length === 2 && entry.questions.every(q => q.prompt.length > 10 && q.options.length === 4 && new Set(q.options).size === 4), `${lesson.id}: preguntas inválidas`);
  const refs = moduleReferences[module.id];
  ensure(refs?.length && refs.every(id => sourceMap.has(id)), `${lesson.id}: referencias inválidas`);
  const file = `02_LECCIONES/${lesson.stageId}/${lesson.id}.md`;
  const solutionFile = `03_SOLUCIONES/${lesson.id}.md`;
  const questions = entry.questions.map((original, i) => {
    const id = `${lesson.id}-Q0${i + 1}`;
    const edit = questionEdits[id];
    if (edit) usedQuestionEdits.add(id);
    const question = { prompt: edit?.prompt ?? original.prompt,
      options: edit?.options ?? (edit?.distractors ? [original.options[0], ...edit.distractors] : original.options) };
    ensure(question.options.length === 4 && new Set(question.options).size === 4, `${id}: corrección inválida`);
    return { id, prompt: question.prompt, ...shuffleOptions(id, question), feedback: review.feedback[i] };
  });
  const metadata = { schemaVersion: 1, courseId: 'redes', id: lesson.id, moduleId: module.id, stageId: lesson.stageId,
    objective: entry.objective, prerequisites: lesson.prerequisites, referenceIds: refs,
    humanReview: 'pending_independent_review', educationalReview: reviewInfo, practicalStatus: 'not_assessed', examplesSynthetic: true,
    questionIds: questions.map(q => q.id), practiceId: `${lesson.id}-P01`, solutionsFile: solutionFile };
  const questionText = questions.map((q, i) => `### Pregunta ${i + 1}\n\n${q.prompt}\n\n${q.options.map(o => `- ${o.id}. ${o.text}`).join('\n')}`).join('\n\n');
  const referenceText = refs.map(id => { const s = sourceMap.get(id); return `- **${id}**: [${s.title}](${s.url}). ${s.scope}`; }).join('\n');
  const resourceLinks = module.labIds.map(id => `- [Guía de laboratorio ${id}](../../05_RECURSOS/LABORATORIOS/${id}.md)`).join('\n')
    + (['RED-M40', 'RED-M41'].includes(module.id) ? '\n- [Caso integrador Empresa-Lab](../../05_RECURSOS/EMPRESA-LAB.json)' : '')
    + (lesson.id === 'RED-M30-L04' ? '\n- [Dataset sintético para calcular métricas](../../05_RECURSOS/DETECCION-120.json)' : '');
  const markdown = clean(`# ${lesson.id} — ${lesson.title}\n\n<!-- redes-meta ${JSON.stringify(metadata)} -->\n\n## 1. Objetivo\n\n${entry.objective}\n\nPrerrequisitos: ${lesson.prerequisites.join(', ') || 'ninguno; puedes comenzar desde cero'}.\n\n## 2. Comprende el mecanismo\n\n${entry.theory}\n\n## 3. Caso resuelto\n\n**Datos sintéticos para análisis; no son una captura ni una ejecución real.**\n\n> ${entry.example}\n\n${entry.reasoning}\n\n## 4. Práctica individual\n\n${entry.task}\n\nEntrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.\n\n## 5. Evalúa lo aprendido\n\nResponde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.\n\n${questionText}\n\n## 6. Aplicación profesional\n\n- SOC: ${module.socApplication}.\n- Red Team autorizado: ${module.redTeamApplication}.\n- Evidencia del módulo: ${module.observableEvidence}.\n- Criterio del módulo: ${module.acceptanceCriterion}.\n\n## 7. Referencias y ampliación\n\n${referenceText}\n\nConsulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.\n`, lesson.id);
  const vocabulary = reviewModule.vocabulary.map(([term, definition]) => `- **${term}**: ${definition}`).join('\n');
  const criteria = review.evidence.map(text => `- ${text}`).join('\n');
  const prerequisiteLinks = lesson.prerequisites.map(id => {
    const previous = lessonMap.get(id);
    ensure(previous, `${lesson.id}: previo inexistente`);
    return `[${id}](../${previous.stageId}/${id}.md)`;
  }).join(', ') || 'ninguno; puedes comenzar desde cero';
  const supported = markdown
    .replace(`Prerrequisitos: ${lesson.prerequisites.join(', ') || 'ninguno; puedes comenzar desde cero'}.`, `Prerrequisitos: ${prerequisiteLinks}.`)
    .replace('\n\n## 3. Caso resuelto', `\n\n### Vocabulario de apoyo\n\n${vocabulary}\n\n[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.\n\n## 3. Caso resuelto`);
  const withResources = supported.replace('## 7. Referencias y ampliación\n\n', `## 7. Referencias y ampliación\n\n${resourceLinks}\n\nLas guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.\n\n`);
  const finalMarkdown = clean(withResources, lesson.id);
  const sections = sectionsOf(finalMarkdown);
  const sourceHash = sha(finalMarkdown);
  const theoryAnchor = { file, sourceHash, line: sections[1].line, endLine: sections[1].endLine, quote: sections[1].markdown.trimEnd() };
  const caseAnchor = { file, sourceHash, line: sections[2].line, endLine: sections[2].endLine, quote: sections[2].markdown.trimEnd() };
  for (const question of questions) {
    const answer = question.options.find(o => o.id === question.correctOptionId).text;
    activities.push({ id: question.id, lessonId: lesson.id, stageId: lesson.stageId, type: 'multiple_choice',
      autoGradable: true, prompt: question.prompt, options: question.options, correctOptionId: question.correctOptionId,
      correctAnswer: answer, explanation: `La opción correcta es «${answer}».\n\n${question.feedback}`,
      anchors: [theoryAnchor, caseAnchor], sourceIds: refs, humanReview: 'pending_independent_review', educationalReview: reviewInfo });
  }
  activities.push({ id: `${lesson.id}-P01`, lessonId: lesson.id, stageId: lesson.stageId, type: 'open_practice', autoGradable: false,
    prompt: entry.task, referenceAnswer: entry.expected,
    rubric: [...review.evidence.map((evidence, i) => ({ criterion: `Resultado observable ${i + 1}`, evidence })),
      { criterion: 'Límites', evidence: 'Distingue lo observado de lo inferido e indica qué comprobación falta cuando procede.' }],
    practicalMasteryEligible: false, status: 'documentary_exercise_not_executed', sourceIds: refs,
    humanReview: 'pending_independent_review', educationalReview: reviewInfo });
  const solution = clean(`# Soluciones — ${lesson.id}\n\nMaterial de revisión: consultar después de resolver.\n\n## Práctica individual\n\n${entry.expected}\n\n### Criterios observables\n\n${criteria}\n\nValora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.\n\n${questions.map((question, i) => {
    const answer = question.options.find(o => o.id === question.correctOptionId);
    return `## Pregunta ${i + 1}\n\n**Respuesta: ${answer.id}. ${answer.text}**\n\n${question.feedback}\n`;
  }).join('\n')}\n## Referencias\n\n${referenceText}\n`, lesson.id);
  add(file, finalMarkdown); add(solutionFile, solution);
  cases.push({ id: `${lesson.id}-CASE`, lessonId: lesson.id, synthetic: true, acquisition: 'authored_not_captured',
    data: entry.example, workedInterpretation: entry.reasoning, inferenceLimitsTaughtInLesson: true });
  lessons.push({ id: lesson.id, title: lesson.title, stageId: lesson.stageId, moduleId: module.id, objective: entry.objective,
    prerequisites: lesson.prerequisites, file, sha256: sourceHash, solutionFile, solutionSha256: sha(solution),
    questionIds: questions.map(q => q.id), practiceId: `${lesson.id}-P01`, referenceIds: refs,
    labIds: module.labIds, editorialRequirementIds: module.editorialRequirements.map(r => r.id),
    learningWordCount: sections.slice(0, 6).map(s => s.markdown).join(' ').split(/\s+/).filter(Boolean).length,
    contentStatus: 'author_educational_review_complete', humanReview: 'pending_independent_review', educationalReview: reviewInfo, practicalStatus: 'not_assessed',
    reconstructionVerified: true, theoryFingerprint: sha(entry.theory), exampleFingerprint: sha(entry.example) });
}
ensure(new Set(lessons.map(l => l.theoryFingerprint)).size === 168, 'Explicaciones duplicadas');
ensure(new Set(lessons.map(l => l.exampleFingerprint)).size === 168, 'Casos duplicados');
ensure(activities.length === 504 && activities.filter(a => a.type === 'multiple_choice').length === 336, 'Inventario de actividades incorrecto');
ensure(usedQuestionEdits.size === Object.keys(questionEdits).length, 'Corrección para pregunta inexistente');

const sourcesDocument = { schemaVersion: 1, consultedOn: '2026-10-18', scope: 'Primary documents consulted for authoring; not exhaustive validation of every assertion, erratum or implementation.', sources };
add('04_ACTIVIDADES/BANCO-ACTIVIDADES.json', json({ schemaVersion: 1, courseId: 'redes', delivery: 'private_editorial_answer_bank_not_student_payload',
  policy: { humanReview: 'pending_independent_review', educationalReview: reviewInfo, theoryMasteryThreshold: null, practicalAutoGrading: false, practicalMasteryEligible: false }, activities }));
add('05_RECURSOS/CASOS-DOCENTES.json', json({ schemaVersion: 1, synthetic: true, origin: 'authored_examples_not_network_capture', cases }));
add('05_RECURSOS/FUENTES.json', json(sourcesDocument));
add('05_RECURSOS/GLOSARIO.md', `# Glosario de apoyo del Mundo Redes\n\nConsulta por módulo, sin obligación de memorizar todo el listado. Las definiciones se limitan al contexto docente; los contratos técnicos completos están en las referencias de cada módulo.\n\n${plan.modules.map(module => `## ${module.id} — ${module.title}\n\n${moduleReview[module.id].vocabulary.map(([term, definition]) => `- **${term}**: ${definition}`).join('\n')}\n\n${moduleReferences[module.id].map(id => { const source = sourceMap.get(id); return `[${id}](${source.url})`; }).join(', ')}.`).join('\n\n')}\n`);
add('VALIDACION/REVISION-EDUCATIVA.json', json({ schemaVersion: 1, ...reviewInfo,
  scopeLimits: ['No revisión independiente', 'No ejecución de laboratorios', 'No certificación de profundidad o preparación profesional', 'No calibración con estudiantes'],
  lessonReviews: lessons.map(lesson => ({ lessonId: lesson.id, moduleId: lesson.moduleId,
    sourceHash: lesson.sha256, objective: lesson.objective, prerequisites: lesson.prerequisites,
    feedbackReviewed: lesson.questionIds, practiceCriteria: moduleReview[lesson.moduleId].lessons[moduleMap.get(lesson.moduleId).lessonIds.indexOf(lesson.id)].evidence,
    caseClarified: Boolean(lessonEdits[lesson.id]), questionsChanged: lesson.questionIds.filter(id => questionEdits[id]),
  })), questionChanges: Object.entries(questionEdits).map(([id, edit]) => ({ id, reason: edit.reason })),
}));

const detectionRows = Array.from({ length: 120 }, (_, i) => ({
  id: `NET-EVT-${String(i + 1).padStart(3, '0')}`, synthetic: true,
  actualPositive: i < 20, ruleAlerts: i < 15 || i >= 20 && i < 30,
  telemetryLostInVariant: i >= 10 && i < 15,
}));
add('05_RECURSOS/DETECCION-120.json', json({ schemaVersion: 'redes-docente/v1', synthetic: true,
  purpose: 'Ground truth elegido para calcular matriz de confusión; no resultados de un detector real.',
  rows: detectionRows }));
const company = { schemaVersion: 'redes-docente/v1', synthetic: true, acquisition: 'authored_not_captured',
  title: 'Empresa-Lab', businessRequirements: { employees: 120, guests: 60, servers: 20, recoveryTargetSeconds: 5,
    recoveryTargetMeasured: false, availableUserServicesBlock: '192.0.2.0/24' },
  networks: [
    { vlan: 10, role: 'employees', ipv4: '192.0.2.0/25', gateway: '192.0.2.1', ipv6: '2001:db8:10::/64' },
    { vlan: 20, role: 'guests', ipv4: '192.0.2.128/26', gateway: '192.0.2.129', ipv6: '2001:db8:20::/64' },
    { vlan: 30, role: 'servers', ipv4: '192.0.2.192/27', gateway: '192.0.2.193', ipv6: '2001:db8:30::/64' },
    { vlan: 40, role: 'management', ipv4: '192.0.2.224/27', gateway: '192.0.2.225', ipv6: '2001:db8:40::/64' },
  ],
  assets: [{ id: 'GUEST-A', ip: '192.0.2.130' }, { id: 'EMPLOYEE-A', ip: '192.0.2.10' },
    { id: 'ADMIN-A', ip: '192.0.2.227' }, { id: 'MGMT-A', ip: '192.0.2.226' }, { id: 'WEB-A', ip: '192.0.2.200' }],
  policy: [{ id: 'POL-1', fromRole: 'guests', toRole: 'management', protocol: 'tcp', destinationPort: 22, expected: 'deny' },
    { id: 'POL-2', fromAsset: 'ADMIN-A', toAsset: 'MGMT-A', protocol: 'tcp', destinationPort: 22, expected: 'allow' },
    { id: 'POL-3', fromRole: 'employees', toAsset: 'WEB-A', protocol: 'tcp', destinationPort: 443, expected: 'allow' }],
  beforeRules: [{ id: 'R10', fromRole: 'guests', destination: 'any', action: 'allow' },
    { id: 'R20', fromRole: 'guests', toRole: 'management', protocol: 'tcp', destinationPort: 22, action: 'deny' }],
  beforeEvidence: [{ id: 'P1-ACTIVITY', timestamp: '2026-10-18T10:00:00Z', source: 'GUEST-A', destination: 'MGMT-A', destinationPort: 22, activity: 'authorized_docent_test' },
    { id: 'P1-FW', timestamp: '2026-10-18T10:00:02Z', clockOffsetSeconds: 2, source: 'GUEST-A', destination: 'MGMT-A', destinationPort: 22, action: 'allow', ruleId: 'R10' },
    { id: 'P1-COLLECTOR', receivedAt: '2026-10-18T10:00:05Z', originalEventId: 'P1-FW' }],
  studentDeliverables: ['Plan de direccionamiento y capacidad', 'Diagrama y rutas de ida/retorno', 'Matriz IPv4/IPv6',
    'Cronología con offset y procedencia', 'Hipótesis y causa respaldada', 'Cambio propuesto, riesgo y rollback', 'Plan de retest y límites'],
};
add('05_RECURSOS/EMPRESA-LAB.json', json(company));
add('03_SOLUCIONES/EMPRESA-LAB-SOLUCION.json', json({ synthetic: true, referenceOnly: true,
  cause: 'R10 anterior a R20 permite el flujo invitado→gestión bajo primera coincidencia.',
  correctedEventTime: '2026-10-18T10:00:00Z', collectorDelaySeconds: 5,
  correction: 'Situar denegación específica antes del permiso o acotar los permisos sin introducir un bloqueo administrativo.',
  retest: [{ id: 'P1-RETEST', source: 'GUEST-A', destination: 'MGMT-A', destinationPort: 22, expected: 'deny' },
    { id: 'P2-RETEST', source: 'ADMIN-A', destination: 'MGMT-A', destinationPort: 22, expected: 'allow' },
    { id: 'P3-RETEST', source: 'EMPLOYEE-A', destination: 'WEB-A', destinationPort: 443, expected: 'allow' }],
  unsupportedClaims: ['Acceso administrativo exitoso', 'Validación de todos los caminos', 'Validación IPv6 por datos IPv4', 'Ejecución real de estos eventos'] }));

const bullet = values => (values || []).map(v => `- ${v}`).join('\n');
for (const lab of plan.labs) {
  const referenceKeys = [...new Set(lab.modules.flatMap(id => moduleReferences[id]))];
  add(`05_RECURSOS/LABORATORIOS/${lab.id}.md`, `# ${lab.id} — ${lab.title}\n\n**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**\n\n## Objetivo y previos\n\n${lab.goal}\n\nMódulos: ${lab.modules.join(', ')}. Previos del diseño: ${lab.prerequisites.join(', ') || 'los de los módulos asociados'}.\n\n${bullet(lab.competencies)}\n\n## Topología y preparación\n\n${lab.topology}\n\nDireccionamiento del diseño: ${lab.addressing}\n\n${lab.preparation}\n\n${lab.isolation}\n\n${lab.authorization}\n\nHerramientas candidatas de la investigación: ${lab.preferred_tools.join(', ')}. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: ${lab.alternate_path}\n\n## Tareas\n\n${bullet(lab.main_activities)}\n\n## Pruebas positivas\n\n${bullet(lab.positive_tests)}\n\n## Controles negativos y fallos para ensayar\n\n${bullet(lab.negative_controls)}\n\n${bullet(lab.seeded_failures)}\n\n## Evidencias y evaluación\n\n${bullet(lab.required_evidence)}\n\n${lab.acceptance}\n\nNo presentar como ejecución real la resolución de una ficha documental. Evaluar dominio práctico solo con observaciones de la práctica correspondiente y revisión adecuada.\n\n## Restauración\n\n${lab.cleanup}\n\n## Referencias\n\n${referenceKeys.map(id => `- [${sourceMap.get(id).title}](${sourceMap.get(id).url})`).join('\n')}\n\n## Procedencia\n\nAdaptación de la ficha ${lab.id} de T5 conservada en investigación. Estimación original: ${lab.hours_estimated_within_curriculum} h, incluidas en el recorrido total, no medidas en una ejecución.\n`);
}

add('VALIDACION/REQUISITOS-EDITORIALES.json', json({ schemaVersion: 1,
  scope: 'Trazabilidad de adendas; la asociación a lecciones no demuestra cierre técnico automático.',
  requirements: plan.modules.flatMap(module => module.editorialRequirements.map(requirement => ({ ...requirement,
    moduleId: module.id, lessonIds: module.lessonIds, status: 'requires_human_coverage_review_against_written_lessons' }))) }));
const catalog = { schemaVersion: 1, courseId: 'redes', editorialVersion: '1.1-author-reviewed', status: 'author_educational_review_complete', educationalReview: reviewInfo,
  planSha256: sha(planBytes), planSourcesRevision: plan.sourcesRevision,
  stages: plan.stages.map(s => ({ id: s.id, title: s.title, lessonIds: s.lessonIds })), lessons,
  activityBank: '04_ACTIVIDADES/BANCO-ACTIVIDADES.json', sourcesFile: '05_RECURSOS/FUENTES.json',
  labFiles: plan.labs.map(l => ({ id: l.id, file: `05_RECURSOS/LABORATORIOS/${l.id}.md`, status: 'designed_not_executed' })),
  invariants: { appIntegrated: false, originalResearchModified: false, practicalMasteryAutomatic: false,
    labsExecutedByThisWork: 0, humanReview: 'pending_independent_review' } };
add('VALIDACION/CATALOGO-EDITORIAL.json', json(catalog));
add('00_INDICE-LECCIONES.md', `# Redes: lecciones redactadas\n\n168 lecciones de estudio y análisis documental, 336 preguntas y 168 prácticas con solucionarios separados. Revisión educativa del autor completada con correcciones; revisión independiente pendiente. Las 20 guías de laboratorio conservan estado de diseño sin ejecución.\n\n## Recorrido\n\n${plan.stages.map(stage => `### ${stage.id} — ${stage.title}\n\n${lessons.filter(l => l.stageId === stage.id).map(l => `- [${l.id}: ${l.title}](${l.file})`).join('\n')}`).join('\n\n')}\n\n## Recursos\n\n- [Glosario de apoyo](05_RECURSOS/GLOSARIO.md).\n- [Fuentes consultadas](05_RECURSOS/FUENTES.json).\n- [Caso integrador Empresa-Lab](05_RECURSOS/EMPRESA-LAB.json).\n- [Fixture para métricas de detección](05_RECURSOS/DETECCION-120.json).\n- [Catálogo editorial y procedencia](VALIDACION/CATALOGO-EDITORIAL.json).\n- [Revisión educativa por lección](VALIDACION/REVISION-EDUCATIVA.json).\n\nEl banco de respuestas, los solucionarios y datos de solución son material de revisión; no deben servirse como parte visible de un intento de evaluación. La preparación del mundo web será una fase posterior.\n`);
const manifest = { schemaVersion: 1, courseId: 'redes', editorialVersion: '1.1-author-reviewed', educationalReview: reviewInfo, authoringSources,
  planSha256: sha(planBytes), totals: { lessons: lessons.length, questions: 336, openPractices: 168, syntheticLessonCases: cases.length,
    labGuidesDesigned: plan.labs.length, learningWords: lessons.reduce((sum, l) => sum + l.learningWordCount, 0) },
  hashes: Object.fromEntries([...outputs].map(([file, text]) => [file, sha(text)])),
  reviewStatus: 'pending_independent_review', technicalLabExecution: false, webIntegration: false };
add('VALIDACION/MANIFIESTO-EDITORIAL.json', json(manifest));

// Preflight every destination before writing any file. Identical reruns are safe;
// manual edits require an explicit reviewed --replace, never a silent overwrite.
for (const [file, content] of outputs) {
  try {
    const old = await readFile(path.join(base, file), 'utf8');
    ensure(old === content || args.includes('--replace'), `Destino editado: ${file}; revisar antes de --replace`);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
for (const [file, content] of outputs) {
  const target = path.join(base, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}
console.log(json({ ...manifest.totals, filesWritten: outputs.size, sourceCount: sources.length, appIntegrated: false }));
