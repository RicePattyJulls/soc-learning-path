// Temporary same-origin harness for environments where Playwright's sockets are unavailable.
// Run AFTER build. These files are removed after validation and never belong to public/.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('src/generated/catalog.json', root), 'utf8'));
const metadata = { modules: catalog.modules, lessons: catalog.lessons, codeBlocks: catalog.report.codeBlocks };
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><title>Validación SOC Learning Path</title><style>body{font:14px sans-serif;background:#eef2fa;margin:20px}pre{white-space:pre-wrap}iframe{border:0;width:1280px;height:900px;max-width:100%;background:white}</style><h1>Comprobación de la V1 en Chromium</h1><p id="status">Ejecutando…</p><pre id="results"></pre><iframe id="app" title="Academia en pruebas" src="./index.html"></iframe><script>window.__QA_CATALOG__=${JSON.stringify(metadata).replaceAll('<', '\\u003c')}</script><script src="./__qa.js"></script></html>`;
await writeFile(new URL('dist/__qa.html', root), html);
await writeFile(new URL('dist/__qa.js', root), await readFile(new URL('tests/native-browser.js', root)));
