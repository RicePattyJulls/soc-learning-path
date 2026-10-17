import { BookOpen, Map, RotateCcw, ShieldCheck, Trophy } from 'lucide-react';
import type { statistics } from '../lib/progress';
import { ProgressBar } from './Primitives';
import { useEffect,useRef,useState } from 'react';
import { animatePresentation } from '../lib/presentation';
import { chapters } from '../lib/catalog';

export default function Header({ page, stats }: { page: string; stats: ReturnType<typeof statistics> }) {
  const active = page === 'capitulo' || page === 'leccion' ? 'ruta' : page;
  const previous=useRef({xp:stats.xp,level:stats.level,modules:stats.modulesDone,mastered:stats.mastered});
  const avatar=useRef<HTMLSpanElement>(null);
  const [feedback,setFeedback]=useState('');
  useEffect(()=>{
    const old=previous.current;
    previous.current={xp:stats.xp,level:stats.level,modules:stats.modulesDone,mastered:stats.mastered};
    if(stats.xp<=old.xp&&stats.mastered<=old.mastered)return;
    const message=[stats.xp>old.xp?`Has ganado ${stats.xp-old.xp} XP.`:'',stats.level>old.level?`¡Nuevo nivel: ${stats.level}!`:'',stats.modulesDone>old.modules?stats.modulesDone===chapters.length?'¡Todas las regiones completadas!':'Región completada. Consulta tu siguiente región disponible.':'',stats.mastered>old.mastered?'Nuevo dominio demostrado.':''].filter(Boolean).join(' ');
    setFeedback(message);
    const animation=animatePresentation(avatar.current,[{transform:'scale(.94)',opacity:.7},{transform:'scale(1.08)',opacity:1},{transform:'scale(1)',opacity:1}],stats.level>old.level?'region':'feedback');
    return()=>animation?.cancel();
  },[stats.xp,stats.level,stats.modulesDone,stats.mastered]);
  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href="#/ruta" aria-label="SOC Learning Path, inicio"><span className="brand-shield"><ShieldCheck size={30} aria-hidden="true" /></span><span><strong>SOC <span>Learning Path</span></strong><small>Tu conocimiento. Tu siguiente aventura.</small></span></a>
      <nav className="primary-nav" aria-label="Navegación principal">
        {[{ page: 'ruta', title: 'Ruta', icon: Map }, { page: 'biblioteca', title: 'Biblioteca', icon: BookOpen }, { page: 'progreso', title: 'Mi progreso', icon: Trophy }, { page: 'repaso', title: 'Repaso', icon: RotateCcw }].map(item => <a href={`#/${item.page}`} key={item.page} aria-current={active === item.page ? 'page' : undefined}><item.icon size={17} aria-hidden="true" /><span>{item.title}</span></a>)}
      </nav>
      <a href="#/progreso" className="profile" aria-label={`Tu progreso: nivel ${stats.level}, ${stats.xp} XP`}><span ref={avatar} className="avatar">{stats.level}</span><span className="profile-summary"><b>Nivel {stats.level}</b><ProgressBar value={stats.levelXp/250*100} label="XP del perfil hasta el próximo nivel" small/><small>{stats.xp} XP</small></span></a>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
  </header>;
}
