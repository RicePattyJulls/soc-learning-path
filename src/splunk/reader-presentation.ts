import type { SplunkRecord } from './types';

export const READER_STAGES = [
  {id:'mision',title:'Tu misión'}, {id:'estudio',title:'Aprende'},
  {id:'practica',title:'Practica'}, {id:'resumen',title:'Conecta ideas'},
  {id:'teoria',title:'Demuestra'},
] as const;
export type ReaderStage = typeof READER_STAGES[number]['id'];
export const SECONDARY_PHASES = ['repaso','soluciones','referencias','original'] as const;
export function readerPresentation(params:URLSearchParams,record:SplunkRecord) {
  const requested=params.get('fase') || 'mision';
  // Old map URLs still enter via estudio. An untouched lesson opens its mission;
  // explicit step URLs and previous study keep their original study destination.
  const phase=requested==='estudio'&&!params.has('paso')&&!record.seen.length?'mision':requested;
  const known=READER_STAGES.some(s=>s.id===phase)||SECONDARY_PHASES.some(p=>p===phase);
  const selected:ReaderStage=record.activeAttempt?'teoria':SECONDARY_PHASES.some(p=>p===phase)?'resumen':READER_STAGES.find(s=>s.id===phase)?.id||'mision';
  return {phase:known?phase:'unknown',selected,stages:READER_STAGES.map(stage=>({...stage,
    disabled:!!record.activeAttempt&&stage.id!=='teoria',
    done:stage.id==='estudio'&&record.studyCompleted?'Estudio completado':stage.id==='practica'&&record.formativeSeen?'Práctica consultada, no evaluada':stage.id==='resumen'&&record.summary?'Resumen confirmado':stage.id==='teoria'&&record.theoryPassed?'Teoría aprobada, práctica no evaluada':undefined,
  }))};
}

// Resume is a separate intent from revisiting an explicitly selected step.
// Both values are presentation only; no cursor is added to the saved record.
export function studyPosition(params:URLSearchParams,stepIds:readonly string[],seen:readonly string[]) {
  const pending=stepIds.findIndex(id=>!seen.includes(id));
  const resumeIndex=Math.max(0,pending);
  const requested=Number(params.get('paso'));
  const index=params.has('paso')&&Number.isInteger(requested)
    ? Math.max(0,Math.min(stepIds.length-1,requested-1)) : resumeIndex;
  return {index,resumeIndex};
}
