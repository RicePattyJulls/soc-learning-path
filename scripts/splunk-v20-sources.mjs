import {readFile,readdir} from 'node:fs/promises';

// Names from the existing Phase 3 curriculum. Presentation metadata only.
export const additionalRegions = [
  {id:'SP-R04',title:'Laboratorio SPL II',theme:'laboratory',description:'Agregaciones, secuencias y correlación con evidencia.'},
  {id:'SP-R05',title:'Valle de Normalización',theme:'normalization',description:'Campos, CIM y cobertura de los modelos.'},
  {id:'SP-R06',title:'Centro SOC',theme:'soc',description:'Triage, cronología y decisiones de escalado.'},
  {id:'SP-R07',title:'Fábrica de Detecciones',theme:'detections',description:'De la hipótesis a una detección revisable.'},
  {id:'SP-R08',title:'Cordillera Threat Hunting',theme:'hunting',description:'Hipótesis, alcance y límites de la evidencia.'},
  {id:'SP-R09',title:'Torre Enterprise Security',theme:'security',description:'Findings, entidades e investigación conceptual.'},
  {id:'SP-R10',title:'Fortaleza Administradora',theme:'administration',description:'Operación, permisos y diagnósticos documentales.'},
  {id:'SP-R11',title:'Cumbre de Automatización',theme:'automation',description:'Respuesta con aprobación, trazabilidad y reintentos.'},
];
// Resolve only region references actually present in the package preambles.
// R08/R09 share a preamble: R08 is required for the R09 grouping/escalation.
// R10's "revisar R06–R07" is advisory, not an additional gate.
export function newPrerequisites(original,id,ids) {
  const region=Number(id.slice(4,6));
  const line=original.match(/^\*\*Prerrequisitos:\*\* (.+)$/m)?.[1];
  if(!line)throw Error(`${id}: falta contrato de prerrequisitos`);
  const expected={4:'R03 completada',5:'R02 y R04',6:'R01–R05',7:'R01–R06',8:'R01–R07 según tema; R08 para agrupación/escalado R09.',9:'R01–R07 según tema; R08 para agrupación/escalado R09.',10:'R01–R05; revisar R06–R07',11:'R07, R09 (conceptual), R10'}[region];
  if(!expected||!line.startsWith(expected))throw Error(`${id}: prerrequisitos editoriales desconocidos`);
  const ranges={4:[3],5:[2,4],6:[1,2,3,4,5],7:[1,2,3,4,5,6],8:[1,2,3,4,5,6,7],9:[1,2,3,4,5,6,7,8],10:[1,2,3,4,5],11:[7,9,10]};
  return ids.filter(candidate=>ranges[region].includes(Number(candidate.slice(4,6))));
}
// Only RFC 5737 documentation ranges, never private or arbitrary addresses.
export function documentationIPs(source) {
  return [...new Set(source.match(/\b(?:192\.0\.2|198\.51\.100|203\.0\.113)\.(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g)||[])];
}
export async function additionalResource(root,pkg,region,{json,safePath,sanitizeSplunk,sha256,ensure}) {
  const datasets=await json(root,`${pkg}/VALIDACION/DATASETS.json`);
  const manifest=await json(root,`${pkg}/VALIDACION/MANIFIESTO.json`);
  const clean=source=>sanitizeSplunk(source,documentationIPs(source)).text;
  const read=async file=>readFile(await safePath(root,file),'utf8');
  const labs=(await readdir(await safePath(root,`${pkg}/PRACTICAS`))).filter(f=>f.startsWith(`LAB${region.id.slice(4)}_`)&&f.endsWith('.md')).sort();
  ensure(labs.length>0,`${region.id}: faltan laboratorios`);
  const lab=(await Promise.all(labs.map(async file=>clean(await read(`${pkg}/PRACTICAS/${file}`))))).join('\n\n');
  const fixtures=[];
  for(const contract of datasets.datasets) {
    const file=`${pkg}/${contract.file}`,text=await read(file);
    ensure(sha256(text)===contract.sha256&&manifest.sha256_by_path[contract.file]===contract.sha256,`CSV no autorizado: ${file}`);
    // Byte-exact allowlist of synthetic package fixtures, not a sanitizer bypass
    // for arbitrary CSV/addresses/credentials. Originals remain read-only.
    fixtures.push({file,sha256:contract.sha256,text,synthetic:true,rowCount:contract.row_count});
  }
  if(region.id==='SP-R11') {
    const shared='SPLUNK_MASTER_RESEARCH/SPLUNK_LECCIONES_R06_R07';
    const sharedContracts=await json(root,`${shared}/VALIDACION/DATASETS.json`);
    const sharedManifest=await json(root,`${shared}/VALIDACION/MANIFIESTO.json`);
    for(const name of ['auth_activity.csv','authorized_context.csv']) {
      const contract=sharedContracts.datasets.find(d=>d.file===`PRACTICAS/fixtures/${name}`);
      const file=`${shared}/${contract.file}`,text=await read(file);
      ensure(sha256(text)===contract.sha256&&sharedManifest.sha256_by_path[contract.file]===contract.sha256,`CSV transversal no autorizado: ${file}`);
      fixtures.push({file,sha256:contract.sha256,text,synthetic:true,rowCount:contract.row_count});
    }
  }
  const documents=await Promise.all(['ACTIVIDADES/RUBRICA.md','ACTIVIDADES/SOLUCIONARIO.md','VALIDACION/FUENTES_Y_LIMITES.md'].map(async file=>({file:`${pkg}/${file}`,markdown:clean(await read(`${pkg}/${file}`))})));
  return {courseId:'splunk',regionId:region.id,lab,datasets,fixtures,documents,note:'Material editorial existente, sintético y documental. Revisión humana independiente pendiente. Sin ejecución SPL, ingesta, envíos HTTP ni acciones SOAR. Los CSV conservan su namespace y escenario; sus campos son contratos de diseño, no extracciones instaladas.'};
}
