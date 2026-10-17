import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './adventure.css';
import './premium.css';
import './full-width.css';
import './world.css';
import './experience.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
