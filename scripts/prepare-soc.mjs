import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, sanitize } from './content.mjs';

// Generator for the SOC world. It reads only the editorial master under
// SOC_MASTER_RESEARCH, verifies every source against the manifest, sanitizes,
// and writes the world's own content. It never touches the other worlds.
const root = fileURLToPath(new URL('../', import.meta.url));
const base = path.join(root, 'SOC_MASTER_RESEARCH');
const json = data => JSON.stringify(data, null, 2) + '\n';
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const read = relative => readFile(path.join(base, relative), 'utf8');

// The corpus only contains documentation and synthetic constants. They are
// protected explicitly so the normal privacy sanitizer keeps its full strength:
//   - `.example` is reserved for documentation (RFC 2606);
//   - RFC 5737 ranges, 0.0.0.0 and 127.0.0.1 are documentation/loopback values;
//   - 10.60.0.0/16 is this project's declared synthetic laboratory range;
//   - the GUIDs are public Active Directory extended-right identifiers;
//   - the AWS key and C:\Users\Public are official documentation examples.
const ALLOWED_GUIDS = new Set([
  '1131f6aa-9c07-11d1-f79f-00c04fc2dcd2',
  '1131f6ad-9c07-11d1-f79f-00c04fc2dcd2',
  '89e95b76-444d-4c62-991a-0facbeda640c',
]);
const ALLOWED_TOKENS = new Set(['AKIAIOSFODNN7EXAMPLE']);
const ipOk = ip => {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  return /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/.test(ip)
    || ip === '0.0.0.0' || ip === '127.0.0.1' || /^10\.60\./.test(ip);
};

function sanitizeSoc(text) {
  const protect = new Set();
  for (const match of text.matchAll(/\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g)) {
    if (/@(?:[\w-]+\.)*example$/i.test(match[0])) protect.add(match[0]);
  }
  for (const match of text.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)) {
    if (ipOk(match[0])) protect.add(match[0]);
  }
  for (const match of text.matchAll(/\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/gi)) {
    if (ALLOWED_GUIDS.has(match[0].toLowerCase())) protect.add(match[0]);
  }
  for (const match of text.matchAll(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16})\b/g)) {
    if (ALLOWED_TOKENS.has(match[0])) protect.add(match[0]);
  }
  for (const match of text.matchAll(/C:\\Users\\Public/g)) protect.add(match[0]);

  // Longest first: a shorter address must not split a longer one.
  const values = [...protect].sort((a, b) => b.length - a.length);
  let protectedText = text;
  values.forEach((value, index) => { protectedText = protectedText.replaceAll(value, `SOCALLOWED${index}END`); });
  const sanitized = sanitize(protectedText);
  values.forEach((value, index) => { sanitized.text = sanitized.text.replaceAll(`SOCALLOWED${index}END`, value); });
  assert(sanitized.redactions.length === 0,
    `Un caso SOC necesita revisión de saneado: ${sanitized.redactions.map(r => `${r.kind}@${r.line}`).join(', ')}`);
  assert(sanitized.text === text, 'El saneado alteró contenido que no está en la lista permitida');
  return sanitized.text;
}

// Every string of the answers travels through the sanitizer; the structure and
// the field names stay exactly as the editorial master declares them.
function sanitizeDeep(value) {
  if (Array.isArray(value)) return value.map(sanitizeDeep);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, sanitizeDeep(inner)]));
  }
  return typeof value === 'string' ? sanitizeSoc(value) : value;
}

export async function generateSoc({ write = false } = {}) {
  const manifest = JSON.parse(await read('VALIDACION/MANIFIESTO-EDITORIAL.json'));
  const verifiedInput = async relative => {
    const text = await read(relative);
    assert(hash(text) === manifest.hashes[relative], `Fuente modificada sin revisar: ${relative}`);
    return JSON.parse(text);
  };
  const editorial = await verifiedInput('VALIDACION/CATALOGO-EDITORIAL.json');
  const sourceRegistry = await verifiedInput('03_RECURSOS/FUENTES.json');
  assert(editorial.cases.length === 40, 'El catálogo SOC debe declarar cuarenta casos');
  assert(editorial.blocks.length === 8 && editorial.levels.length === 2, 'El catálogo SOC no es coherente con sus bloques o niveles');
  const declared = editorial.blocks.reduce((total, block) => total + block.caseIds.length, 0);
  assert(declared === editorial.cases.length, 'Los bloques SOC no cubren todos los casos');

  // La declaración de revisión editorial viaja con su registro: si el catálogo
  // dice que el propietario la completó, el registro debe existir, estar en el
  // manifiesto y corresponder exactamente a estos casos.
  const caseDigest = () => hash([...editorial.cases].sort((a, b) => a.id.localeCompare(b.id))
    .map(item => `${item.id}=${item.sha256}`).join(':'));
  const educationalReview = editorial.educationalReview
    ?? { kind: 'pending', independent: false, status: 'pending_owner_review' };
  if (educationalReview.kind === 'owner_editorial_review') {
    const record = await verifiedInput(educationalReview.record ?? 'VALIDACION/REVISION-PROPIETARIO.json');
    assert(record.kind === educationalReview.kind && record.independent === educationalReview.independent,
      'El registro de revisión editorial no coincide con el catálogo');
    assert(record.result === 'aprobado_sin_cambios_en_la_fuente' && record.changes.length === 0,
      'El registro de revisión editorial debe declarar los cambios aplicados en la fuente');
    assert(record.evidence.casesDigest === caseDigest(),
      'El registro de revisión editorial no corresponde a los casos publicados');
  }

  const outputs = new Map();
  const put = (file, value) => {
    assert(file.startsWith('public/soc-content/') || file === 'src/soc/generated/catalog.json', 'Destino fuera del Mundo SOC');
    assert(!file.includes('..'), 'Destino inseguro');
    outputs.set(file, json(value));
  };

  const cases = [];
  const verifications = [];
  for (const entry of editorial.cases) {
    const raw = await read(entry.file);
    assert(hash(raw) === entry.sha256, `Caso modificado sin revisar: ${entry.file}`);
    const source = JSON.parse(raw);
    assert(source.id === entry.id, `${entry.id}: el archivo declara otro identificador`);
    const answersSource = sanitizeDeep({
      hipotesis: source.hipotesis,
      pasos: source.pasos,
      evidencias: source.evidencias,
      kql: source.kql,
      spl: source.spl,
      comandos: source.comandos,
      contencion: source.contencion,
      escalation: source.escalation,
      falsos_positivos: source.falsos_positivos,
      errores: source.errores,
      perspectiva_red_team: source.perspectiva_red_team,
      respuesta_entrevista: source.respuesta_entrevista,
      criterios_evaluacion: source.criterios_evaluacion,
      mitre: source.mitre,
      fuentes: source.fuentes,
    });
    const payloadSource = sanitizeDeep({
      nivel: source.nivel,
      bloque: source.bloque,
      blockId: entry.blockId,
      titulo: source.titulo,
      pregunta: source.pregunta,
      escenario: source.escenario,
      objetivo: source.objetivo,
    });
    const revision = hash(json({ payload: payloadSource, answers: answersSource })).slice(0, 24);
    const payload = { schemaVersion: 1, courseId: 'soc', id: entry.id, sourceHash: entry.sha256, revision, ...payloadSource };
    const answers = { schemaVersion: 1, courseId: 'soc', id: entry.id, sourceHash: entry.sha256, revision, ...answersSource };
    const stem = `soc-content/${entry.id}-${revision}`;
    put(`public/${stem}.json`, payload);
    put(`public/${stem}.answers.json`, answers);
    assert(!/"(?:respuesta_entrevista|criterios_evaluacion|contencion|escalation|hipotesis|pasos|evidencias|kql|spl|comandos|falsos_positivos|errores|perspectiva_red_team|mitre|fuentes)":/.test(json(payload)),
      `${entry.id}: la respuesta modelo se filtró al contenido del estudiante`);
    cases.push({
      id: entry.id, nivel: source.nivel, bloque: source.bloque, blockId: entry.blockId, titulo: source.titulo,
      revision, sourceHash: entry.sha256,
      file: `${stem}.json`, hash: hash(json(payload)),
      answersFile: `${stem}.answers.json`, answersHash: hash(json(answers)),
      rubricSize: answersSource.criterios_evaluacion.length,
      stepCount: answersSource.pasos.length,
      queryCount: answersSource.kql.length + answersSource.spl.length,
    });
    verifications.push({
      id: entry.id,
      fields: Object.keys(answersSource).length,
      answerHash: hash(json(answers)),
      payloadHash: hash(json(payload)),
      verified: true,
    });
  }

  const catalog = {
    schemaVersion: 1,
    courseId: 'soc',
    revision: hash(json(cases)).slice(0, 24),
    title: editorial.title,
    description: editorial.description,
    editorialStatus: editorial.editorialStatus,
    levels: editorial.levels,
    blocks: editorial.blocks,
    cases,
    sources: sourceRegistry.sources,
    practicalStatus: 'not_assessed',
    commandsExecuted: false,
    educationalReview,
  };
  put('src/soc/generated/catalog.json', catalog);
  if (write) {
    for (const [file, content] of outputs) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await writeFile(path.join(root, file), content);
    }
  }
  return {
    catalog,
    outputs,
    report: {
      cases: cases.length,
      blocks: catalog.blocks.length,
      levels: catalog.levels.length,
      queries: cases.reduce((total, item) => total + item.queryCount, 0),
      sources: catalog.sources.length,
      answersSeparated: true,
      educationalReview: educationalReview.status,
      verifications,
      files: outputs.size,
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { report } = await generateSoc({ write: true });
  await mkdir(path.join(root, 'docs/soc'), { recursive: true });
  await writeFile(path.join(root, 'docs/soc/VALIDACION-WEB-CONTENIDO.json'), json(report));
  console.log(json({ ...report, verifications: `${report.verifications.length}/${report.cases}` }));
}
