import { readdirSync,readFileSync } from 'node:fs';
export const v25 = readdirSync(new URL('./',import.meta.url)).filter(n=>/^batch-\d+\.json$/.test(n)).sort().flatMap(n=>JSON.parse(readFileSync(new URL(n,import.meta.url),'utf8')).lessons.filter(l=>!l.blocked));
if(new Set(v25.map(l=>l.lessonId)).size!==v25.length)throw Error('Lectura V25 duplicada');
export const compatibility=JSON.parse(readFileSync(new URL('./compatibility.json',import.meta.url),'utf8'));
