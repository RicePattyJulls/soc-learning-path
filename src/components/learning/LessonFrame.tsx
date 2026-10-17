import type { CSSProperties, ReactNode, Ref } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ProgressBar } from '../Primitives';

export interface LessonStage {
  id: string; title: string; done?: string; disabled?: boolean;
}
// The structural classes and slot order are those of LearningReader. This
// presentation frame has no course catalog, learning engine or storage access.
export default function LessonFrame({id,region,title,status,tags,original,back,studied,total,stages,current,onStage,children,context,footer,surfaceRef,motion=false,phase,accent}: {
  id:string;region:string;title:string;status:ReactNode;tags:ReactNode;original?:ReactNode;
  back:{href:string;label:string};studied:number;total:number;stages:readonly LessonStage[];
  current:string;onStage:(id:string,event:{detail:number})=>void;children:ReactNode;
  context:ReactNode;footer:ReactNode;surfaceRef?:Ref<HTMLElement>;motion?:boolean;phase:string;accent:string;
}) {
  return <article className="page-shell academy-lesson sp-reader" data-lesson={id} style={{'--journey-accent':accent} as CSSProperties}>
    <a className="back-link" href={back.href}><ArrowLeft size={17} aria-hidden="true"/>{back.label}</a>
    <div className="lesson-title-row"><div><p>{region}</p><h1>{title}</h1><div className="lesson-tags">{status}{tags}</div></div>{original}</div>
    <div className="lesson-progress"><span>{studied} / {total} pasos estudiados</span><ProgressBar value={studied/total*100} label="Progreso de estudio de la lección Splunk"/></div>
    <div className="academy-grid">
      <aside className="lesson-phases" aria-label="Fases de la lección Splunk"><nav aria-label="Cinco etapas de la lección Splunk">{stages.map((stage,index)=><button type="button" key={stage.id} disabled={stage.disabled} aria-current={stage.id===current?'step':undefined} onClick={event=>onStage(stage.id,event)}><span>{index+1}</span><b>{stage.title}</b>{stage.done?<Check size={16} role="img" aria-label={stage.done}/>:null}</button>)}</nav><p>Teoría piloto.<br/>Práctica no evaluada.</p></aside>
      <section ref={surfaceRef} className="activity-surface sp-reader-content" data-phase={phase} data-motion={motion}>{children}</section>
      {context}
    </div>
    <nav className="reader-navigation academy-navigation" aria-label="Entre lecciones Splunk"><a href={back.href}><ArrowLeft size={17} aria-hidden="true"/>Ver la región</a>{footer}</nav>
  </article>;
}
