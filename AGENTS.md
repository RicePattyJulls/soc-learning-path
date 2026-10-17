# Repository Guidelines

Este proyecto es una academia local nueva e independiente. No modifiques `SC-200.md`, las skills enlazadas ni otros proyectos.

## Contenido

Lee el origen completo mediante `scripts/prepare-content.mjs`. Los capítulos, títulos, explicaciones y código deben proceder del Markdown. No inventes equivalencias Splunk. Mantén el saneado de datos y la comprobación de reconstrucción. Los archivos de `src/generated/`, `public/content/` y `docs/CONTENIDO.md` son derivados: regénéralos, no los edites a mano.

## Desarrollo

Usa React, TypeScript estricto y CSS/Tailwind. Mantén separados contenido, progreso y presentación del mapa. Comprueba con `npm test` y `npm run build`. Ejecuta pruebas del navegador cuando sea posible y distingue pruebas preparadas de pruebas ejecutadas. Respeta movimiento reducido, foco visible y diseños de 320 px.

## Skills

Las skills instaladas están en `.agents/skills`, enlazadas al directorio original. Lee las instrucciones pertinentes antes de aplicarlas. No añadas backend, autenticación, cloud ni integraciones externas a esta V1.
