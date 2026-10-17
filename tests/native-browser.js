/* Runs inside the browser against the real production application in a same-origin iframe. */
(async () => {
  const frame = document.getElementById('app'), output = document.getElementById('results');
  const catalog = window.__QA_CATALOG__, key = 'soc-learning-path:progress:v1';
  const results = [], errors = [];
  const tick = () => new Promise(resolve => setTimeout(resolve, 25));
  const doc = () => frame.contentDocument;
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const wait = async (predicate, description) => {
    for (let i = 0; i < 500; i++) { if (predicate()) return; await tick(); }
    throw new Error('Tiempo agotado: ' + description);
  };
  const check = async (name, fn) => { await fn(); results.push(name); output.textContent = JSON.stringify({ status: 'running', passed: results.length, results }, null, 2); };
  const find = (selector, text) => Array.from(doc().querySelectorAll(selector)).find(node => node.textContent.trim() === text);
  const route = async hash => { frame.contentWindow.location.hash = hash; await tick(); };
  const reload = async () => { frame.contentWindow.location.reload(); await tick(); await wait(() => doc()?.querySelector('h1'), 'recarga'); await tick(); };
  const openLesson = async lesson => {
    await route('#/leccion/' + encodeURIComponent(lesson.id));
    await wait(() => doc().querySelector('h1')?.textContent === lesson.title && doc().querySelector('.markdown'), 'lectura ' + lesson.title);
  };
  const stored = () => JSON.parse(localStorage.getItem(key));
  const noOverflow = () => assert(doc().documentElement.scrollWidth <= frame.contentWindow.innerWidth + 1, 'Desbordamiento horizontal a ' + frame.contentWindow.innerWidth + 'px');
  const complete = async () => {
    const button = find('button', 'Marcar como completada'); assert(button && !button.disabled, 'Botón de completar disponible'); button.click();
    await wait(() => find('button', 'Lectura completada')?.disabled, 'confirmación de lectura'); await tick();
  };
  try {
    await wait(() => doc()?.querySelector('.stage'), 'arranque');
    frame.contentWindow.addEventListener('error', event => errors.push(event.message));
    await check('arranque real del build y 13 capítulos derivados del documento', async () => {
      assert(doc().querySelectorAll('.stage').length === catalog.modules.length, 'Número de capítulos');
      assert(doc().querySelectorAll('.stage.available').length === 1, 'Primer capítulo disponible');
      assert(doc().querySelectorAll('.stage.locked').length === catalog.modules.length - 1, 'Capítulos posteriores bloqueados');
      assert(doc().querySelector('[aria-label="Progreso general"]').getAttribute('aria-valuenow') === '0', 'Progreso inicial'); noOverflow();
    });
    const prelude = catalog.lessons[0];
    await check('leer el texto original y reservar el panel de Splunk', async () => {
      find('a', 'Empezar mi aventura').click();
      await wait(() => doc().querySelector('.markdown'), 'lector');
      assert(doc().querySelector('.markdown').textContent.includes('Telemetría'), 'Contenido inicial fiel');
      assert(doc().querySelector('.splunk-placeholder').textContent.includes('Aprender este concepto en Splunk'), 'Splunk reservado');
      assert(doc().querySelectorAll('.splunk-pane button, .splunk-pane a').length === 0, 'No hay controles ficticios de Splunk');
    });
    await check('completar, recargar y conservar 25 XP sin duplicarlos', async () => {
      await complete();
      assert(Object.keys(stored().completed).length === 1, 'Una lectura completada');
      await reload(); await wait(() => doc().querySelector('.markdown'), 'lector tras recargar');
      assert(find('button', 'Lectura completada')?.disabled, 'Completada persiste');
      assert(doc().querySelector('.profile').getAttribute('aria-label').includes('25 XP'), '25 XP persistentes');
    });
    await check('bloqueos por URL y acceso al índice de capítulos bloqueados', async () => {
      const second = catalog.lessons.find(l => l.id === catalog.modules[1].lessonIds[0]);
      await route('#/leccion/' + encodeURIComponent(second.id));
      await wait(() => doc().querySelector('h1')?.textContent === 'Esta lectura aún está bloqueada', 'bloqueo de lectura');
      assert(!doc().querySelector('.markdown'), 'No se carga la lectura bloqueada');
      await route('#/capitulo/' + encodeURIComponent(catalog.modules[1].id));
      await wait(() => doc().querySelectorAll('.lesson-row.locked').length > 0, 'índice bloqueado');
      assert(doc().querySelectorAll('.lesson-row[href]').length === 0, 'No hay enlaces de lectura habilitados');
    });
    await check('navegación entre lecciones y anclas de subapartados', async () => {
      const l = catalog.lessons.find(l => l.id === catalog.modules[0].lessonIds[1]);
      await openLesson(l);
      const anchor = doc().querySelector('[aria-label="Subapartados de la lectura"] a');
      assert(anchor, 'Subapartados disponibles'); anchor.click(); await tick(); await tick();
      assert(frame.contentWindow.location.hash.includes('seccion='), 'Ancla representada en la URL');
      await wait(() => /^H[1-6]$/.test(doc().activeElement.tagName), 'foco trasladado al subapartado');
      const next = Array.from(doc().querySelectorAll('[aria-label="Lecturas del capítulo"] a')).find(a => !a.hasAttribute('aria-current'));
      assert(next, 'Enlace a otra lectura'); next.click(); await tick();
      await wait(() => doc().querySelector('.markdown') && doc().querySelector('h1')?.textContent !== l.title, 'siguiente lectura');
    });
    await check('completar una etapa desbloquea la siguiente y concede un solo bonus', async () => {
      for (const id of catalog.modules[0].lessonIds) { const l = catalog.lessons.find(l => l.id === id); await openLesson(l); if (find('button', 'Marcar como completada')) await complete(); }
      await route('#/ruta'); await wait(() => doc().querySelector('.stage.completed'), 'etapa completada');
      assert(doc().querySelectorAll('.stage.locked').length === catalog.modules.length - 2, 'Segunda etapa desbloqueada');
      const xp = (catalog.modules[0].lessonIds.length + 1) * 25 + 100;
      assert(doc().querySelector('.profile').getAttribute('aria-label').includes(xp + ' XP'), 'XP de lecturas más bonus');
      await reload(); await wait(() => doc().querySelector('.stage.completed'), 'recarga de ruta');
      assert(doc().querySelector('.profile').getAttribute('aria-label').includes(xp + ' XP'), 'Bonus sin duplicar');
    });
    await check('búsqueda en el contenido, filtro por capítulo y estado sin resultados', async () => {
      await route('#/biblioteca'); await wait(() => doc().querySelector('input[type="search"]'), 'biblioteca');
      const search = doc().querySelector('input[type="search"]');
      const setSearch = value => { Object.getOwnPropertyDescriptor(frame.contentWindow.HTMLInputElement.prototype, 'value').set.call(search, value); search.dispatchEvent(new frame.contentWindow.Event('input', { bubbles: true })); };
      setSearch('automatizacion'); await wait(() => doc().querySelector('.search-snippet'), 'búsqueda sin acentos');
      assert(doc().querySelectorAll('.library-result').length > 0, 'Búsqueda encuentra contenido');
      setSearch('termino-imposible-zzzx'); await wait(() => doc().querySelector('.empty-state'), 'sin resultados');
      find('button', 'Ver todo el contenido').click(); await wait(() => doc().querySelectorAll('.library-result').length === catalog.lessons.length, 'limpiar filtros');
      const select = doc().querySelector('select'); select.value = catalog.modules[0].id; select.dispatchEvent(new frame.contentWindow.Event('change', { bubbles: true }));
      await wait(() => doc().querySelectorAll('.library-result').length === catalog.modules[0].lessonIds.length, 'filtro de capítulo');
      await reload(); await wait(() => doc().querySelector('select'), 'filtro al recargar');
      assert(doc().querySelector('select').value === catalog.modules[0].id, 'Filtro conserva URL');
    });
    await check('las 76 lecturas reales renderizan; tablas y todos los bloques de código se conservan', async () => {
      localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, completed: Object.fromEntries(catalog.lessons.map(l => [l.id, l.version])), lastLesson: null }));
      await reload();
      let tables = 0, code = 0;
      for (const lesson of catalog.lessons) {
        await openLesson(lesson);
        assert(doc().querySelector('.markdown').textContent.trim().length > 0, 'Contenido de ' + lesson.title);
        let previousLevel = 2;
        for (const heading of doc().querySelectorAll('.markdown h3, .markdown h4, .markdown h5, .markdown h6')) {
          const level = Number(heading.tagName.slice(1));
          assert(level <= previousLevel + 1, 'Jerarquía accesible en ' + lesson.title);
          previousLevel = level;
        }
        tables += doc().querySelectorAll('.markdown table').length; code += doc().querySelectorAll('.markdown pre').length; noOverflow();
      }
      assert(tables > 40, 'Tablas presentes'); assert(code === catalog.codeBlocks, 'Todos los bloques de código: ' + code + '/' + catalog.codeBlocks);
    });
    await check('390 y 320 píxeles: ruta, lector, biblioteca y estadísticas sin desbordamiento', async () => {
      for (const width of [390, 320]) {
        frame.style.width = width + 'px'; await tick();
        await route('#/ruta'); await wait(() => doc().querySelector('.stage'), 'ruta móvil'); noOverflow();
        await openLesson(prelude); noOverflow();
        assert(Array.from(doc().querySelectorAll('.table-scroll')).some(el => el.scrollWidth > el.clientWidth), 'Tablas con scroll propio');
        await route('#/biblioteca'); await wait(() => doc().querySelector('select'), 'biblioteca móvil'); noOverflow();
        await route('#/progreso'); await wait(() => doc().querySelector('.statistics-summary'), 'estadísticas móviles'); noOverflow();
      }
      frame.style.width = '1280px';
    });
    await check('etiquetas accesibles, enlace de salto y controles reales', async () => {
      await route('#/biblioteca'); await wait(() => doc().querySelector('input'), 'biblioteca accesible');
      assert(doc().querySelector('.skip-link'), 'Enlace de salto');
      assert(doc().querySelector('input').closest('label'), 'Buscador etiquetado');
      assert(doc().querySelector('select').closest('label'), 'Filtro etiquetado');
      assert(doc().querySelector('nav[aria-label]'), 'Navegación etiquetada');
      assert(Array.from(doc().querySelectorAll('button')).every(el => el.textContent.trim() || el.getAttribute('aria-label')), 'Botones con nombre');
      doc().querySelector('.skip-link').click(); assert(doc().activeElement.id === 'main-content', 'Salto al contenido');
    });
    await check('progreso corrupto y fallo de almacenamiento se comunican sin bloquear la lectura', async () => {
      localStorage.setItem(key, '{broken'); await reload(); await wait(() => doc().querySelector('[role="alert"]'), 'aviso JSON');
      await openLesson(prelude);
      const storage = frame.contentWindow.Storage.prototype, original = storage.setItem;
      storage.setItem = () => { throw new DOMException('Denied', 'QuotaExceededError'); };
      await complete(); await wait(() => doc().querySelector('[role="alert"]')?.textContent.includes('guardar'), 'aviso guardado');
      storage.setItem = original;
    });
    if (new URLSearchParams(location.search).has('reduced')) await check('movimiento reducido: feedback sin traslación y transiciones solo de opacidad', async () => {
      assert(frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').matches, 'Preferencia reduce activa');
      const style = frame.contentWindow.getComputedStyle(doc().querySelector('.completion-feedback'));
      assert(style.transform === 'none', 'Confirmación sin transform'); assert(style.transitionProperty === 'opacity', 'Solo opacidad');
    });
    assert(errors.length === 0, 'Errores de página: ' + errors.join(';'));
    const external = frame.contentWindow.performance.getEntriesByType('resource').filter(e => e.name.startsWith('http') && new URL(e.name).origin !== location.origin);
    assert(external.length === 0, 'No hay solicitudes externas de la aplicación');
    document.getElementById('status').textContent = 'PASS: ' + results.length + ' grupos de comprobaciones';
    document.body.dataset.status = 'passed';
    output.textContent = JSON.stringify({ status: 'passed', testedAt: new Date().toISOString(), viewport: '1280, 390 y 320', inspectedLessons: catalog.lessons.length, results, errors, outsideRequests: external.length }, null, 2);
  } catch (error) {
    document.getElementById('status').textContent = 'FAIL: ' + error.message;
    document.body.dataset.status = 'failed';
    output.textContent = JSON.stringify({ status: 'failed', passed: results.length, results, error: error.stack }, null, 2);
  }
})();
