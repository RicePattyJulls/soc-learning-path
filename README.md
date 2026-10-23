# SOC Learning Path

Academia web personal para estudiar y practicar análisis SOC (N1/N2): seis cursos con progreso propio, un entrenador de casos de entrevista/triaje y un simulador de investigaciones. Hecha con React, TypeScript y Vite. No tiene backend, cuentas ni conexión a ningún SIEM real: todo se ejecuta en el navegador.

**Demo:** https://ricepattyjulls.github.io/soc-learning-path/

> Proyecto de estudio personal. No es material oficial ni está afiliado a Microsoft ni a Splunk. Todos los datos, usuarios, IPs y eventos son **sintéticos de laboratorio**.

## Qué incluye

| Mundo | Ruta | Contenido |
| --- | --- | --- |
| Microsoft SC-200 (Sentinel + Defender XDR) | `#/ruta` | 13 módulos, 76 lecturas, 272 actividades |
| Splunk SOC | `#/splunk/ruta` | 11 regiones, 80 lecciones, 240 actividades |
| Redes | `#/redes/ruta` | 8 etapas, 168 lecciones |
| Windows + Active Directory | `#/windows-ad/ruta` | 28 etapas, 84 lecciones |
| Linux | `#/linux/ruta` | 32 etapas, 96 lecciones |
| Mundo SOC | `#/soc/ruta` | 40 casos de entrevista/triaje en 8 bloques |
| Repaso SOC | `#/soc/repaso_soc` | 98 fichas de conceptos en 4 bloques |
| Simulador | `#/simulador/microsoft`, `#/simulador/splunk` | 2 plataformas, 4 investigaciones |

- Los cursos siguen el patrón *misión → aprende → practica → evaluación*, con desbloqueo por prerrequisitos.
- El **Mundo SOC** no es un curso: respondes en texto libre, se revela una respuesta modelo (con KQL/SPL) y te autoevalúas con una rúbrica. `#/soc/repaso` muestra las 40 respuestas modelo en modo lectura.
- El progreso se guarda en el **LocalStorage** del navegador, con una clave distinta por mundo. No se sincroniza entre navegadores ni dispositivos; cada mundo permite exportar una copia desde *Mi progreso*.

## Estado real (léelo antes de fiarte del contenido)

- **Ninguna consulta KQL/SPL, comando ni laboratorio se ha ejecutado contra sistemas reales.** Los catálogos lo declaran (`practicalStatus: not_assessed`, `labsExecuted: false`, `splunkExecuted: false`).
- **Ningún mundo tiene revisión independiente.** El contenido se elaboró con ayuda de herramientas de IA y su revisión es la siguiente:

| Mundo | Revisión declarada |
| --- | --- |
| SC-200 | Sin declaración formal; 2 introducciones pendientes de revisión |
| Splunk | Pendiente de revisión independiente |
| Redes | Autorrevisión del autor (Codex, 18/10/2026), con correcciones |
| Windows + AD | Borrador pendiente de revisión del propietario |
| Linux | Borrador pendiente de revisión del propietario |
| Mundo SOC | Revisada por el propietario (19/10/2026); sin revisión independiente |

Detalle por mundo en [docs/MAPA-MUNDOS.md](docs/MAPA-MUNDOS.md).

## Ejecutar en local

Requiere Node.js 22.12 o posterior.

```sh
npm ci
npm run build:pages   # compila con el contenido ya preparado del repositorio
npm run preview       # http://127.0.0.1:4174/soc-learning-path/
```

Para desarrollo sin regenerar contenido: `npm run dev:pilot -- --port 5187 --strictPort` y abrir `http://127.0.0.1:5187/soc-learning-path/`.

`npm run dev`, `npm test` y `npm run build` regeneran primero el contenido y necesitan un archivo fuente externo (`SC-200.md`) y respaldos locales de `output/` que **no** están en este repositorio, así que en un clon limpio no funcionan completos. Más detalle en [PUBLICACION.md](PUBLICACION.md).

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `src/` | Aplicación; un subdirectorio por mundo (`redes/`, `windows-ad/`, `linux/`, `splunk/`, `soc/`, `repaso-soc/`, `simulator/`) |
| `public/*-content/` | Lecciones y casos ya generados que la app descarga |
| `*_MASTER_RESEARCH/` | Fuente editorial de cada mundo (lecciones, soluciones, actividades, recursos) |
| `scripts/` | Generadores de contenido y guardias de integridad |
| `tests/` | Pruebas unitarias y de navegador |
| `docs/` | Arquitectura, mapa de mundos e historial de decisiones |

## Despliegue

Cada push a `main` ejecuta [.github/workflows/pages.yml](.github/workflows/pages.yml), que compila con `build:pages` y publica `dist/` en GitHub Pages.
