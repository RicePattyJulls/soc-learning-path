import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Architecture artifacts only. This generator never writes application content,
// learning progress, source research, or src/generated/.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const research = path.join(root, 'REDES_MASTER_RESEARCH/01_INVESTIGACION');
const destination = path.join(root, 'docs/redes');
const sha = value => createHash('sha256').update(value).digest('hex');
const serialize = value => JSON.stringify(value, null, 2) + '\n';
const files = new Map();
for (const name of (await readdir(research)).sort()) {
  const buffer = await readFile(path.join(research, name));
  files.set(name, { name, sha256: sha(buffer), bytes: buffer.length, text: buffer.toString('utf8') });
}
const artifact = n => {
  const candidates = [...files.values()].filter(f => f.name.includes(`TANDA${n}_`) && f.name.endsWith('.json'));
  if (candidates.length !== 1) throw new Error(`Tanda ${n}: se esperaba un JSON`);
  return { file: candidates[0].name, data: JSON.parse(candidates[0].text) };
};
const [t2, t3, t4, t5, t6, t7] = [2, 3, 4, 5, 6, 7].map(artifact);
const checks = [];
function check(name, condition, detail = '') {
  checks.push({ name, passed: Boolean(condition), detail });
}
const unique = array => new Set(array).size === array.length;
const moduleMap = new Map(t2.data.modules.map(m => [m.id, m]));
const labMap = new Map(t5.data.labs.map(l => [l.id, l]));
const caseMap = new Map(t4.data.cases.map(c => [c.id, c]));
const linkMap = new Map(t6.data.links.map(l => [l.id, l]));
const worldIds = new Set(t6.data.worlds.map(w => w.id));
const known = (ids, map) => Array.isArray(ids) && ids.every(id => map.has(id));
check('research_file_count', files.size === 14);
for (const [name, expected] of Object.entries(t7.data.reference_artifacts_sha256)) {
  check(`t7_provenance:${name}`, files.get(name)?.sha256 === expected);
}
check('t3_baseline_sha256', files.get(t3.data.source_baseline)?.sha256 === t3.data.source_baseline_sha256);
for (const [tanda, value] of [[t4, t4.data.baseline], [t6, t6.data.baseline]]) {
  for (const [key, expected] of Object.entries(value)) {
    const match = /^t([2-5])_sha256$/.exec(key);
    if (match) check(`${tanda.file}:${key}`, files.get(artifact(Number(match[1])).file)?.sha256 === expected);
  }
}
for (const [name, expected] of Object.entries(t5.data.origin.baseline_sha256)) {
  check(`t5_provenance:${name}`, files.get(name)?.sha256 === expected);
}
check('unique_modules', unique(t2.data.modules.map(m => m.id)));
check('unique_labs', unique(t5.data.labs.map(l => l.id)));
check('unique_cases', unique(t4.data.cases.map(c => c.id)));
check('unique_links', unique(t6.data.links.map(l => l.id)));
check('module_prerequisites_resolve', t2.data.modules.every(m => known(m.prerequisites, moduleMap)));
check('stage_ids_resolve', t2.data.modules.every(m => t2.data.stages.some(s => s.id === m.stage)));
check('t3_audit_exhaustive', t3.data.module_audit.length === moduleMap.size && unique(t3.data.module_audit.map(m => m.id)) && t3.data.module_audit.every(m => moduleMap.has(m.id)));
check('t3_mapping_targets_resolve', t3.data.mapping.every(r => known(r.modules, moduleMap)));
check('t4_improvements_resolve', t4.data.module_improvements.every(m => moduleMap.has(m.id)));
check('case_module_targets_resolve', t4.data.cases.every(c => known(c.modules, moduleMap)));
check('lab_targets_resolve', t5.data.labs.every(l => known(l.modules, moduleMap) && known(l.blue_red_cases, caseMap)));
check('module_lab_index_resolve', Object.entries(t5.data.module_to_labs).length === moduleMap.size && Object.entries(t5.data.module_to_labs).every(([id, labs]) => moduleMap.has(id) && labs.length > 0 && known(labs, labMap)));
check('module_lab_index_bidirectional', t5.data.labs.every(l => l.modules.every(id => t5.data.module_to_labs[id]?.includes(l.id))) && Object.entries(t5.data.module_to_labs).every(([id, labs]) => labs.every(l => labMap.get(l)?.modules.includes(id))));
check('link_targets_resolve', t6.data.links.every(l => known(l.module_ids, moduleMap) && known(l.lab_ids, labMap) && known(l.case_ids, caseMap) && worldIds.has(l.world_id)));
check('link_sources_resolve', t6.data.links.every(l => l.source_ids.every(id => t6.data.sources.some(s => s.id === id))));
check('link_competencies_resolve', t6.data.links.every(l => l.competency_ids.every(id => t6.data.competencies.some(c => c.id === id))));
check('module_hooks_resolve', t6.data.module_hooks.length === moduleMap.size && unique(t6.data.module_hooks.map(h => h.module_id)) && t6.data.module_hooks.every(h => moduleMap.has(h.module_id) && known(h.validated_reference_links, linkMap)));
check('lab_hooks_resolve', t6.data.lab_hooks.every(h => labMap.has(h.lab_id) && known(h.world_link_ids, linkMap) && known(h.linked_case_ids, caseMap)));
check('case_hooks_resolve', t6.data.case_hooks.every(h => caseMap.has(h.case_id) && known(h.related_link_ids, linkMap)));

function topologicalSort(items) {
  const result = [], visiting = new Set(), visited = new Set();
  function visit(id) {
    if (visited.has(id)) return;
    if (visiting.has(id)) throw new Error(`Ciclo: ${id}`);
    const item = items.get(id);
    if (!item) throw new Error(`Dependencia desconocida: ${id}`);
    visiting.add(id);
    item.prerequisites.forEach(visit);
    visiting.delete(id); visited.add(id); result.push(id);
  }
  [...items.keys()].forEach(visit);
  return result;
}
let moduleOrder = [];
try { moduleOrder = topologicalSort(moduleMap); check('module_dag_acyclic', true); }
catch (error) { check('module_dag_acyclic', false, error.message); }
check('baseline_topological_order_valid', unique(t2.data.topological_order) && t2.data.topological_order.length === moduleMap.size && t2.data.topological_order.every((id, i, order) => moduleMap.has(id) && moduleMap.get(id).prerequisites.every(p => order.indexOf(p) >= 0 && order.indexOf(p) < i)));
check('stage_hour_sums', t2.data.stages.every(s => t2.data.modules.filter(m => m.stage === s.id).reduce((sum, m) => sum + m.hours_estimate, 0) === s.hours_estimated));
check('total_hours', t2.data.modules.reduce((sum, m) => sum + m.hours_estimate, 0) === t2.data.hours_total_estimated);
const totals = t7.data.consolidated_totals;
check('declared_inventory_counts', t2.data.stages.length === totals.stages && moduleMap.size === totals.modules && t2.data.modules.flatMap(m => m.proposed_lessons).length === totals.proposed_lesson_titles && labMap.size === totals.core_labs_designed && caseMap.size === totals.soc_red_cases_designed && linkMap.size === totals.cross_world_links);
check('lab_hours_inside_total', t5.data.labs.reduce((sum, l) => sum + l.hours_estimated_within_curriculum, 0) === totals.estimated_lab_hours_included_in_curriculum && totals.estimated_lab_hours_included_in_curriculum <= t2.data.hours_total_estimated);

const t1 = [...files.values()].find(f => f.name.includes('TANDA1_') && f.name.endsWith('.md'));
const t1References = t1.text.split('\n').filter(line => /^\| [A-Z]\d\d \|/.test(line)).map(line => {
  const cells = line.split('|').map(s => s.trim());
  return { id: cells[1], description: cells[2], url: cells[3], supportedClaim: cells[4], sourceConfidence: cells[5] };
});
check('module_reference_ids_resolve_in_t1', t2.data.modules.every(m => m.sources_from_tanda1.every(id => t1References.some(r => r.id === id))));

const stages = t2.data.stages.map(s => ({
  id: `RED-E${s.id.slice(1).padStart(2, '0')}`, researchId: s.id, title: s.title,
  entryLevel: s.entry_level, estimatedHours: s.hours_estimated,
  moduleIds: t2.data.modules.filter(m => m.stage === s.id).map(m => m.id),
  lessonIds: [], source: { file: t2.file, pointer: `/stages/${t2.data.stages.indexOf(s)}` },
}));
const lessons = [];
const modules = t2.data.modules.map((m, moduleIndex) => {
  const stage = stages.find(s => s.researchId === m.stage);
  const lessonIds = m.proposed_lessons.map((_, i) => `${m.id}-L${String(i + 1).padStart(2, '0')}`);
  m.proposed_lessons.forEach((title, i) => {
    const prerequisites = i ? [lessonIds[i - 1]] : m.prerequisites.map(id => `${id}-L${String(moduleMap.get(id).proposed_lessons.length).padStart(2, '0')}`);
    lessons.push({ id: lessonIds[i], title, stageId: stage.id, moduleId: m.id, prerequisites,
      dependencyBasis: 'architectural_proposal_module_dependencies_plus_internal_order',
      contentStatus: 'title_only_not_written', objective: null, markdownFile: null, questionIds: [],
      source: { file: t2.file, pointer: `/modules/${moduleIndex}/proposed_lessons/${i}` },
    });
  });
  stage.lessonIds.push(...lessonIds);
  const audit = t3.data.module_audit.find(a => a.id === m.id);
  const enhancement = t4.data.module_improvements.find(a => a.id === m.id);
  const editorialRequirements = [{ id: `${m.id}-T3`, source: { file: t3.file, pointer: `/module_audit/${t3.data.module_audit.indexOf(audit)}` },
    finding: audit.finding, change: audit.required_change, minimumEvidence: audit.minimum_evidence_proposed,
    status: 'required_for_content_authoring_not_implemented', }];
  if (enhancement) editorialRequirements.push({ id: `${m.id}-T4`, source: { file: t4.file, pointer: `/module_improvements/${t4.data.module_improvements.indexOf(enhancement)}` },
    finding: enhancement.gap, objectives: enhancement.objectives, practices: enhancement.practices,
    acceptance: enhancement.acceptance, referenceKeys: enhancement.sources.map(id => `T4:${id}`),
    status: 'required_for_content_authoring_not_implemented', });
  return { id: m.id, stageId: stage.id, title: m.title, lessonIds, prerequisites: m.prerequisites,
    estimatedHours: m.hours_estimate, objective: m.outcome, depth: m.depth,
    proposedPractice: m.proposed_practice, observableEvidence: m.observable_evidence,
    acceptanceCriterion: m.acceptance_criterion, criticalFailure: m.critical_failure,
    socApplication: m.soc_application, redTeamApplication: m.red_team_application,
    referenceKeys: m.sources_from_tanda1.map(id => `T1:${id}`),
    labIds: t5.data.module_to_labs[m.id], caseIds: t4.data.cases.filter(c => c.modules.includes(m.id)).map(c => c.id),
    crossLinkIds: t6.data.links.filter(l => l.module_ids.includes(m.id)).map(l => l.id), editorialRequirements,
    source: { file: t2.file, pointer: `/modules/${moduleIndex}` },
  };
});
check('unique_planned_lesson_ids', unique(lessons.map(l => l.id)));
check('lesson_ids_do_not_collide_with_labs', lessons.every(l => !labMap.has(l.id)));
check('stage_lesson_membership', stages.flatMap(s => s.lessonIds).length === lessons.length && unique(stages.flatMap(s => s.lessonIds)) && lessons.every(l => stages.find(s => s.id === l.stageId)?.lessonIds.includes(l.id)));
const lessonMap = new Map(lessons.map(l => [l.id, l]));
let lessonOrder = [];
try { lessonOrder = topologicalSort(lessonMap); check('planned_lesson_dag_acyclic', true); }
catch (error) { check('planned_lesson_dag_acyclic', false, error.message); }

function closure(targets) {
  const result = new Set();
  const visit = id => { if (result.has(id)) return; result.add(id); moduleMap.get(id).prerequisites.forEach(visit); };
  targets.forEach(visit);
  return moduleOrder.filter(id => result.has(id));
}
const routeSpecs = [
  ['ingenieria', ['RED-M25'], 'Diseño e ingeniería de red', 'troncal_ingenieria_hasta_segmentacion'],
  ['soc', ['RED-M31'], 'Investigación y respuesta SOC', 'ruta_soc_hasta_respuesta'],
  ['red-team', ['RED-M35'], 'Validación Red Team y retest', 'ruta_red_team_hasta_retest'],
  ['automatizacion', ['RED-M38', 'RED-M39'], 'Automatización y operación', 'ruta_automatizacion_operaciones'],
  ['integral', ['RED-M42'], 'Recorrido integral y defensa final', 'proyectos_finales_ambas_ramas'],
];
const learningPaths = routeSpecs.map(([id, targets, title, originalPath]) => {
  const ids = closure(targets);
  const sourceIds = t2.data.paths[originalPath].modules;
  return { id: `redes:${id}`, title, targets, moduleIds: ids,
    estimatedHours: ids.reduce((sum, m) => sum + moduleMap.get(m).hours_estimate, 0),
    estimateIncludesLabs: true, sourcePath: originalPath,
    changesFromResearch: { added: ids.filter(i => !sourceIds.includes(i)), removed: sourceIds.filter(i => !ids.includes(i)) },
    reason: id === 'automatizacion' ? 'Incluye M36–M38 además de M39; el camino de origen terminaba en M39 y no incluía los módulos explícitos de automatización.' : 'Cierre transitivo calculado desde los hitos indicados.',
  };
});
check('learning_paths_are_prerequisite_closed', learningPaths.every(p => p.moduleIds.every(id => moduleMap.get(id).prerequisites.every(prev => p.moduleIds.includes(prev)))));
check('automation_path_contains_automation_modules', ['RED-M36', 'RED-M37', 'RED-M38', 'RED-M39'].every(id => learningPaths.find(p => p.id === 'redes:automatizacion').moduleIds.includes(id)));

const scBytes = await readFile(path.join(root, 'src/generated/catalog.json'));
const splBytes = await readFile(path.join(root, 'src/generated/splunk/catalog.json'));
const existing = { MS: JSON.parse(scBytes).lessons, SPL: JSON.parse(splBytes).lessons };
// These are editorial candidates backed by existing catalog entries. Existence
// is checked; precise teaching coverage remains pending review of each payload.
const candidateIds = {
  'RED-X001': ['capitulo-4-ingesta/conector-o-ruta-1', 'capitulo-4-ingesta/tabla-1'],
  'RED-X002': ['capitulo-13-mapa-de-tablas-y-relaciones-kql/3-tablas-esenciales-del-workspace-de-sentinel-1'],
  'RED-X003': ['capitulo-13-mapa-de-tablas-y-relaciones-kql/4-relaciones-que-si-conviene-memorizar-1'],
  'RED-X004': ['capitulo-13-mapa-de-tablas-y-relaciones-kql/2-defender-xdr-1'],
  'RED-X005': ['capitulo-4-ingesta/transformacion-1', 'capitulo-4-ingesta/configuracion-clave-1'],
  'RED-X006': ['capitulo-11-respuesta-y-remediacion/4-verificar-y-recuperar-1', 'capitulo-12-automatizacion/3-playbooks-y-orquestacion-1'],
  'RED-X007': ['SP-R02-L04', 'SP-R02-L05'],
  'RED-X008': ['SP-R05-L03', 'SP-R05-L05', 'SP-R05-L06'],
  'RED-X009': ['SP-R05-L04', 'SP-R07-L04'],
  'RED-X010': ['SP-R04-L05', 'SP-R06-L04'],
  'RED-X011': ['SP-R02-L06', 'SP-R07-L04', 'SP-R07-L07'],
};
const crossLinks = t6.data.links.map(link => {
  const ids = candidateIds[link.id] || [];
  const candidates = ids.map(id => {
    const found = existing[link.world_id]?.find(l => l.id === id);
    check(`catalog_candidate_exists:${link.id}:${id}`, Boolean(found));
    return { courseId: link.world_id === 'MS' ? 'sc200' : 'splunk', lessonId: id,
      title: found?.title, url: link.world_id === 'MS' ? `#/leccion/${encodeURIComponent(id)}` : `#/splunk/leccion/${id}`,
      status: 'catalog_entry_exists_specific_coverage_pending_review' };
  });
  const resolution = candidates.length ? 'candidate_lessons_in_existing_world' : ['AD', 'LX'].includes(link.world_id)
    ? 'future_world_no_runtime_url' : link.world_id === 'SIM' ? 'existing_simulator_requires_new_case_design' : 'internal_soc_red_team_connection_not_a_separate_world';
  return { ...link, resolution, runtimeEnabled: false, candidateDestinations: candidates };
});

const sourceManifest = [...files.values()].map(({ name, sha256, bytes }) => ({ file: name, sha256, bytes }));
const catalog = {
  schemaVersion: 1, courseId: 'redes', status: 'architecture_draft_not_runtime_content',
  sourcesRevision: sha(serialize(sourceManifest)), sourceSnapshot: 'REDES_MASTER_RESEARCH/01_INVESTIGACION',
  definitions: { stage: 'Mapa de una de las ocho etapas', module: 'Agrupación editorial, sin pantalla adicional obligatoria', lesson: 'Nodo educativo dentro de su etapa; actualmente solo título', lab: 'Diseño separado; no ejecutado ni validado' },
  stages, modules, lessons, moduleOrder, lessonOrder, learningPaths,
  labs: t5.data.labs, cases: t4.data.cases, crossLinks, competencies: t6.data.competencies,
  t1References: t1References.map(r => ({ ...r, key: `T1:${r.id}`, status: 'inherited_research_reference_not_rechecked_online_by_this_generator' })),
  openIssuesInherited: t7.data.issues,
  evaluation: { moduleCriteria: 'preserved_from_research_not_calibrated', labPolicyProposed: t5.data.grade_policy,
    practicalMasteryFromReading: false, rewardsConfigured: false, progressMigration: false },
  integrationProposal: { routePrefix: '#/redes', storageKey: 'soc-learning-path:redes:learning:v1',
    contentDirectory: 'public/redes-content', generatedCatalog: 'src/generated/redes/catalog.json',
    appDirectory: 'src/redes', requiresContentAuthoringBeforePlayable: true },
};
const report = {
  scope: 'Local structural and referential checks; no online verification, laboratory execution, application or browser tests.',
  sourceManifest, existingCatalogHashes: { sc200: sha(scBytes), splunk: sha(splBytes) },
  totals: { stages: stages.length, modules: modules.length, lessonTitles: lessons.length,
    authoredLessons: 0, labsDesigned: labMap.size, labsExecutedByThisWork: 0, casesDesigned: caseMap.size,
    crossLinks: crossLinks.length, checksPassed: checks.filter(c => c.passed).length, checksTotal: checks.length },
  checks, changesToApp: false, changesToOriginalResearch: false,
  architecturalAdjustments: learningPaths.filter(p => p.changesFromResearch.added.length || p.changesFromResearch.removed.length).map(p => ({ path: p.id, ...p.changesFromResearch, reason: p.reason })),
};
const failures = checks.filter(c => !c.passed);
if (failures.length) throw new Error(`No se generan artefactos: ${serialize(failures)}`);
const stageRows = stages.map(s => `| ${s.id} | ${s.title} | ${s.moduleIds.length} | ${s.lessonIds.length} | ${s.estimatedHours} |`).join('\n');
const routeRows = learningPaths.map(p => `| ${p.title} | ${p.moduleIds.length} | ${p.estimatedHours} |`).join('\n');
const content = `# Redes: catálogo propuesto\n\nGenerado por \`node scripts/prepare-redes-plan.mjs\`. Arquitectura; no lecciones listas para estudiar.\n\n| Etapa | Título | Módulos | Títulos de lección | Horas estimadas |\n| --- | --- | ---: | ---: | ---: |\n${stageRows}\n\nLas 275 horas de laboratorio diseñadas están incluidas en las 592 horas totales estimadas; no se suman dos veces.\n\n## Recorridos calculados\n\n| Recorrido | Módulos incluidos por dependencias | Horas estimadas |\n| --- | ---: | ---: |\n${routeRows}\n\nEl recorrido de automatización incorpora M36–M38, ausentes del recorrido así denominado en T2. El origen se conserva intacto y el cambio figura en la validación. Las estimaciones no han sido medidas en estudiantes ni en laboratorios.\n\n## Inventario de nodos\n\n${stages.map(s => `### ${s.id}: ${s.title}\n\n${modules.filter(m => m.stageId === s.id).map(m => `**${m.id}: ${m.title}**\n\n${lessons.filter(l => l.moduleId === m.id).map(l => `- ${l.id}: ${l.title}`).join('\n')}\n\nRequisitos de módulo: ${m.prerequisites.join(', ') || 'ninguno'}. Laboratorios diseñados: ${m.labIds.join(', ')}.\n`).join('\n')}`).join('\n')}\n`;
let mermaid = 'flowchart TD\n';
for (const stage of stages) {
  mermaid += `  subgraph ${stage.id.replaceAll('-', '_')}["${stage.id}: ${stage.title.replaceAll('"', "'")}"]\n`;
  for (const id of stage.moduleIds) mermaid += `    ${id.replaceAll('-', '_')}["${id}: ${moduleMap.get(id).title.replaceAll('"', "'")}"]\n`;
  mermaid += '  end\n';
}
for (const m of modules) for (const previous of m.prerequisites) mermaid += `  ${previous.replaceAll('-', '_')} --> ${m.id.replaceAll('-', '_')}\n`;
await mkdir(destination, { recursive: true });
for (const [name, value] of [
  ['CATALOGO-PROPUESTO.json', serialize(catalog)], ['VALIDACION-ESTRUCTURAL.json', serialize(report)],
  ['ETAPAS-Y-LECCIONES.md', content], ['DEPENDENCIAS.mmd', mermaid],
]) await writeFile(path.join(destination, name), value);
console.log(serialize(report.totals));
