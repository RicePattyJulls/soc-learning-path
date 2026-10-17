export default function AcademySelector({ course }: { course: 'sc200' | 'splunk' }) {
  return <nav className="academy-selector" aria-label="Elegir academia">
    <span className="academy-selector-label">Tu academia</span>
    <a href="#/ruta" aria-current={course === 'sc200' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot sc200-dot" />Microsoft SC-200</a>
    <a href="#/splunk/ruta" aria-current={course === 'splunk' ? 'true' : undefined}><span aria-hidden="true" className="academy-dot splunk-dot" />Splunk SOC <small>R01–R03</small></a>
    <a href={course === 'splunk' ? '#/simulador/splunk' : '#/simulador/microsoft'}>Centro SOC · Simulador</a>
  </nav>;
}
