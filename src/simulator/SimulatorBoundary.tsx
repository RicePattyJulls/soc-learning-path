import {Component,type ReactNode} from 'react';
export default class SimulatorBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<main id="main-content" tabIndex={-1} className="page-shell"><h1>No se pudo abrir el simulador</h1><p role="alert">Conservamos los guardados de las academias y del simulador. Recarga la aplicación para reintentar.</p><a className="button secondary" href="#/ruta">Volver a Microsoft SC-200</a><a className="button secondary" href="#/splunk/ruta">Volver a Splunk SOC</a></main>:this.props.children;}
}
