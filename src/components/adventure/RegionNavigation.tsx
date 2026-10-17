import { ArrowLeft, ArrowRight, Map } from 'lucide-react';
import { chapters, chapterUrl } from '../../lib/catalog';
import type { Chapter } from '../../types';
import type { Progress } from '../../types';
import { lessonMap } from '../../lib/catalog';
import { chapterStatus } from '../../lib/progress';
import MapLegend from './MapLegend';

// This selector previews region indexes. Unlocks remain the responsibility of the learning engine.
export default function RegionNavigation({ chapter,progress }: { chapter: Chapter;progress:Progress }) {
  const index = chapters.indexOf(chapter);
  return <nav className="region-navigation" aria-label="Navegación directa entre regiones">
    <label><Map size={18} aria-hidden="true"/><span>Explorar regiones</span>
      <select name="region" value={chapter.id} onChange={event => { location.hash = chapterUrl(event.target.value).slice(1); }}>
        {chapters.map(item => {const status=chapterStatus(item,chapters,progress,lessonMap);return <option value={item.id} key={item.id}>{item.title} · {status==='locked'?'Bloqueada':status==='completed'?'Completada':'Disponible'}</option>;})}
      </select>
    </label>
    <div className="region-navigation-arrows">
      {index > 0 ? <a href={chapterUrl(chapters[index - 1].id)} aria-label={`Región anterior: ${chapters[index - 1].title}`}><ArrowLeft size={18} aria-hidden="true"/><span>Anterior</span></a> : <span/>}
      <span className="region-position">{index + 1} / {chapters.length}</span>
      {index < chapters.length - 1 ? <a href={chapterUrl(chapters[index + 1].id)} aria-label={`Región siguiente: ${chapters[index + 1].title}`}><span>Siguiente</span><ArrowRight size={18} aria-hidden="true"/></a> : <span/>}
    </div>
    <MapLegend/>
  </nav>;
}
