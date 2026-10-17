import { chapters, chapterUrl, lessonMap, lessonUrl } from './catalog';
import { chapterStatus, isComplete } from './progress';
import { learningStatus } from './learning';
import type { Chapter, Progress } from '../types';
import type { AdventureRoute, MapStation } from './adventure';

export const sc200Adventure: AdventureRoute = { id:'sc-200',title:'Microsoft SC-200',regionIds:chapters.map(c=>c.id) };
export function regionStations(chapter: Chapter, progress: Progress): MapStation[] {
  const locked=chapterStatus(chapter,chapters,progress,lessonMap)==='locked',index=chapters.indexOf(chapter);
  return chapter.lessonIds.map(id=>{
    const lesson=lessonMap.get(id)!;
    return {id,title:lesson.title,state:locked?'locked':learningStatus(lesson,progress),href:locked?undefined:lessonUrl(id),
      detail:lesson.learning?.coverage==='reviewed'?`${lesson.learning.practiceIds.length+lesson.learning.assessmentIds.length} actividades revisadas`:'Estudio guiado · actividades pendientes',
      reward:lesson.learning?.coverage==='reviewed'?'Hasta 50 XP':'Hasta 10 XP',iconIndex:index,current:progress.lastLesson===id};
  });
}
export function worldStations(progress: Progress): MapStation[] {
  return chapters.map((chapter,index)=>{
    const state=chapterStatus(chapter,chapters,progress,lessonMap),done=chapter.lessonIds.filter(id=>isComplete(lessonMap.get(id)!,progress)).length;
    return {id:chapter.id,title:chapter.title,state:state==='available'?(done?'in-progress':'not-started'):state,href:chapterUrl(chapter.id),
      detail:`${done}/${chapter.lessonIds.length} lecturas · ${chapter.lessonIds.filter(id=>learningStatus(lessonMap.get(id)!,progress)==='mastered').length} dominadas`,
      reward:'+100 XP al completar',iconIndex:index,current:chapter.lessonIds.includes(progress.lastLesson||'')};
  });
}
