// Keep the conventional runner usable with an already running local academy.
const baseIndex = process.argv.indexOf('--base-url');
const outputIndex = process.argv.indexOf('--output-dir');
if(outputIndex>=0) {
  const output=process.argv[outputIndex+1];
  if(!output||!/^output\/playwright\/[\w/-]+$/.test(output)||output.includes('..'))throw new Error('El informe debe estar bajo output/playwright');
  process.env.BROWSER_OUTPUT=output;
}
if (baseIndex >= 0) {
  const base = process.argv[baseIndex + 1];
  if (!base || !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/$/.test(base)) throw new Error('Indica un origen local HTTP terminado en /');
  process.env.BROWSER_BASE_URL = base;
}
if(process.argv.includes('--v25-compatibility')) await import('./v25-browser.mjs');
else if(process.argv.includes('--world-report')) await import('./world-report.mjs');
else if(process.argv.includes('--experience')) await import('./experience.mjs');
else if(process.argv.includes('--world-performance')) await import('./world-performance.mjs');
else if(process.argv.includes('--world')) await import('./world.mjs');
else if(process.argv.includes('--layout-report')) await import('./layout-report.mjs');
else if(process.argv.includes('--full-width')) await import('./full-width.mjs');
else if(process.argv.includes('--a11y')) await import('./accessibility.mjs');
else if(process.argv.includes('--performance')) await import('./performance.mjs');
else if(process.argv.includes('--premium')) await import('./premium.mjs');
else if(process.argv.includes('--visual-pilot')||process.argv.includes('--visual')) await import('./visual.mjs');
else await import('./browser.mjs');
