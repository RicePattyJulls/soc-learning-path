import { Component, type ReactNode } from 'react';

export default class CourseBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <main id="main-content" tabIndex={-1} className="page-shell"><h1>No se pudo abrir el piloto Splunk</h1><p role="alert">Puede faltar un archivo de la compilación. No se ha sustituido por contenido de SC-200.</p><a className="button secondary" href="#/ruta">Volver a Microsoft SC-200</a></main> : this.props.children;
  }
}
