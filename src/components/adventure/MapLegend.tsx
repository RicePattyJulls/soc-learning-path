import { Check,LockKeyhole,Play,Star } from 'lucide-react';

export default function MapLegend() {
  return <ul className="map-legend" aria-label="Estados del recorrido">
    <li><Play size={13} aria-hidden="true"/><span>Disponible</span></li>
    <li><LockKeyhole size={14} aria-hidden="true"/><span>Bloqueado</span></li>
    <li><Check size={15} aria-hidden="true"/><span>Completado</span></li>
    <li><Star size={14} aria-hidden="true"/><span>Dominado</span></li>
  </ul>;
}
