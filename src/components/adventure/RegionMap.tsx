import { ArrowRight, Compass, Flag } from 'lucide-react';
import { chapterMap, chapters, chapterUrl, lessonMap, lessonUrl } from '../../lib/catalog';
import { chapterStatus, isComplete } from '../../lib/progress';
import { learningStatus } from '../../lib/learning';
import type { Chapter, Progress } from '../../types';
import { themes } from '../../lib/adventure';
import { regionStations } from '../../lib/adventure-catalog';
import { ProgressBar } from '../Primitives';
import AdventureMap from './AdventureMap';
import { Robot } from './Artwork';
import { regionVisual } from '../../lib/region-visuals';

export default function RegionMap({chapter,progress,focusStation}:{chapter:Chapter;progress:Progress;focusStation?:string}) {
  const index=chapters.indexOf(chapter),state=chapterStatus(chapter,chapters,progress,lessonMap),locked=state==='locked';
  const done=chapter.lessonIds.filter(id=>isComplete(lessonMap.get(id)!,progress)).length;
  const required=chapters.slice(0,index).find(c=>chapterStatus(c,chapters,progress,lessonMap)!=='completed');
  const stations=regionStations(chapter,progress);
  const target=chapter.lessonIds.map(id=>lessonMap.get(id)!).find(l=>!isComplete(l,progress));
  const visual=regionVisual(chapter.id);
  return <AdventureMap premium={!!visual} visual={visual} stations={stations} focusStation={focusStation} theme={themes[index%themes.length]} label={`Mapa de lecturas: ${chapter.title}`} complete={done===chapter.lessonIds.length}
    requiredHref={required?chapterUrl(required.id):undefined} requiredTitle={required?.title} lockedHint="completa las regiones anteriores; tu progreso y tus lecturas ya terminadas se conservan.">
    <div className="region-welcome"><Robot/><div><span className="map-eyebrow"><Compass size={14} aria-hidden="true"/>Región {index+1} · Microsoft SC-200</span><h2>{visual?.name||(locked?'Tu siguiente horizonte':'Elige tu próximo paso')}</h2><p>{locked?'Explora el mapa. Sus lecturas se abrirán al completar las regiones anteriores.':'Cada nodo es una lectura. Aprende, practica y vuelve al camino con lo que has descubierto.'}</p>{!locked&&target?<a className="button primary" href={lessonUrl(target.id)}>Continuar esta región<ArrowRight size={17} aria-hidden="true"/></a>:!locked?<a className="button primary" href={lessonUrl(chapter.lessonIds[0])}>Repasar esta región<ArrowRight size={17} aria-hidden="true"/></a>:required?<a className="button primary" href={chapterUrl(required.id)}>Volver a la región disponible<ArrowRight size={17} aria-hidden="true"/></a>:null}</div></div>
    <div className="region-meter"><span><Flag size={17} aria-hidden="true"/>Tu progreso en la región</span><div><ProgressBar value={done/chapter.lessonIds.length*100} label="Progreso del capítulo"/><b>{Math.round(done/chapter.lessonIds.length*100)}%</b></div><small>{done} de {chapter.lessonIds.length} lecturas completadas · {chapter.lessonIds.filter(id=>learningStatus(lessonMap.get(id)!,progress)==='mastered').length} dominadas</small></div>
  </AdventureMap>;
}
