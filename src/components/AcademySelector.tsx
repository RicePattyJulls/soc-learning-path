export default function AcademySelector({ course }: { course: 'sc200' | 'splunk' | 'redes' | 'windows-ad' | 'linux' | 'soc' | 'repaso-soc' }) {
  return <nav className="academy-selector" aria-label="Elegir academia">
    <span className="academy-selector-label">Tu academia</span>
    <a href="#/ruta" aria-current={course === 'sc200' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot sc200-dot" />Microsoft SC-200</a>
    <a href="#/splunk/ruta" aria-current={course === 'splunk' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot splunk-dot" />Splunk SOC</a>
    <a href="#/redes/ruta" aria-current={course === 'redes' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot" />Redes</a>
    <a href="#/windows-ad/ruta" aria-current={course === 'windows-ad' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot" />Windows + AD</a>
    <a href="#/linux/ruta" aria-current={course === 'linux' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot" />Linux</a>
    <a href="#/soc/ruta" aria-current={course === 'soc' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot" />Mundo SOC</a>
    <a href="#/soc/repaso_soc" aria-current={course === 'repaso-soc' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot" />Repaso SOC</a>
    <a href={course === 'splunk' ? '#/simulador/splunk' : '#/simulador/microsoft'}>Centro SOC · Simulador</a>
  </nav>;
}
