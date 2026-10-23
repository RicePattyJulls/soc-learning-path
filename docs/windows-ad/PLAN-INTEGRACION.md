# Windows + Active Directory: revisión y propuesta de integración

Última actualización: 19/10/2026. Estado real: **mundo completo y publicado en local (28 de 28 etapas)**; investigación íntegramente adaptada y con los mismos contratos de integridad que los mundos Sentinel y Redes.

> Este documento tenía dos partes: la propuesta inicial (cuando la investigación aún no se había localizado) y el estado real. La propuesta inicial se conserva íntegra y fechada al final, bajo «Revisión inicial (histórica)», porque su premisa ya está resuelta pero su método editorial sigue vigente.

## Estado real a 19/10/2026

La investigación Windows/AD se localizó y está en `/home/tommy/Documentos/SOC_LEARNING_PATH/WINDOWS_AD_MASTER_RESEARCH/`. El mundo ya no es «arquitectura preliminar»: los seis bloques verticales —Windows, AD DS, Recuperación, Red Team, SOC e Integración— están implementados, verificados en navegador y con los mismos contratos de integridad que los mundos Sentinel y Redes.

### Investigación de origen

- `01_INVESTIGACION/Windows_AD_Tanda_4_Estructurado.json` es la fuente de verdad del recorrido: **28 etapas** y **84 lecciones propuestas**, con fecha de corte 18/10/2026.
- Estado declarado por la propia investigación: `diseño_documental_para_revision`. Registra **0 laboratorios ejecutados** y **0 validados empíricamente**; las cantidades y procedimientos son propuesta, no ejecución acreditada.
- Los apuntes privados de Windows/AD siguen en `WINplusAD/` y se preservan como referencia; su inventario de huellas es [INVENTARIO-REVISION.json](INVENTARIO-REVISION.json).

### Mundo publicado (mundo completo, WAD-01 → WAD-28)

| Elemento | Estado real |
| --- | --- |
| `courseId` / ruta | `windows-ad` · entrada `#/windows-ad/ruta` (mapa, lector, recursos bajo el mismo prefijo) |
| Etapas publicadas | **28 de 28** (mundo completo): (1–7) bloque Windows; (8–17) bloque AD DS: Directorio y confianza · DC/DNS/hora · LDAP y ACL · Kerberos/NTLM/SPN · GPO/SYSVOL · Replicación/FSMO/GC · trusts y segmentación · Tier 0 y LAPS · AD CS/PKI · troubleshooting integral; (18–20) bloque Recuperación: continuidad y RPO/RTO · recuperación de objeto y DC · bosque, SYSVOL, PKI y reintegración; (21–23) bloque Red Team: ROE y descubrimiento · rutas de control y misconfiguraciones · validación mínima, remediación y retest; (24–26) bloque SOC: fuentes y política de auditoría · autenticación, procesos y PowerShell · Sysmon, WEF y preservación; (27–28) bloque Integración: SOC contextual y Purple Team · proyecto final |
| Lecciones | **84** (`WAD-01-L01` … `WAD-28-L03`) |
| Preguntas | **168** (2 por lección) |
| Actividades en banco | **252** (168 de opción múltiple + 84 de práctica abierta) |
| Laboratorios | **24** (`WAD-LAB01` … `WAD-LAB24`), con bloques A/B cuando comparten etapa; `WAD-LAB16` corresponde a LAB-16 (adversarial), `WAD-LAB17` a LAB-17 (soc), `WAD-LAB18` a LAB-18 (soc), `WAD-LAB19` a LAB-19 (integración, A: WAD-23 / B: WAD-27), `WAD-LAB20` a LAB-20 (proyecto final) y `WAD-LAB21` … `WAD-LAB24` a los laboratorios avanzados EXT-01 … EXT-04 |
| Glosario | 298 líneas; 279 términos (129 en «Active Directory», 29 en «SOC y monitorización» y 17 en «Integración y proyecto final») |
| Fuentes | **157** (2 nuevas del bloque Integración, verificadas en HTTP 200) |
| Progreso | Almacén propio `soc-learning-path:windows-ad:learning:v1` |
| `editorialVersion` | `1.0-mundo-completo-28-etapas` |
| `status` | `mundo_completo_pendiente_de_revision_independiente` |

### Contratos replicados de Redes

- Manifiesto de huellas que firma cada Markdown maestro y estampa el `sha256` por lección.
- JSON por lección con verificación de hash **en cliente** (SHA-256 contra catálogo), `courseId` y `schemaVersion` forzados, y comprobación de que `stepIds`/`questionIds` coincidan.
- Soluciones y respuestas separadas del material del alumno: el payload no incluye `correctOptionId`, `referenceAnswer` ni `rubric`.
- Saneado estricto (IPs solo de documentación, sin rutas de usuario reales, sin correos, sin claves) con **objetivo de 0 redacciones** en glosario y lecciones.
- Guardias de integridad propias: manifiesto de autorización (`authorization`), `windowsAdChange()` / `withWindowsAdDispatcher()` / `withWindowsAdSelector()`, con huellas fijadas y deltas textuales exactos. Sin comodines y sin excepción para los mundos existentes.

### Verificación del mundo publicado

- `npm run prepare:windows-ad`: 84 lecciones · 28 etapas · 168 preguntas · 25 recursos (glosario + 24 laboratorios) · **84/84 reconstrucciones** · **0 redacciones de saneado**.
- `npx tsc -b`: limpio.
- `npm test`: **118/118 correctas, 0 fallos**.
- Guardias de integridad: 5/5 con salida 0 y sin necesidad de re-fijar huellas.
- Auditoría del contenido generado: solo IPs documentales; 0 rutas `C:\Users`, 0 correos, 0 `[DATO OCULTO]`; metadatos ↔ banco coherentes en las 84 lecciones; 168 archivos servidos = 168 referenciados, 0 huérfanos.
- Verificación en navegador (Playwright): atlas con 28 etapas / 84 lecciones, eyebrow correcto, bloqueo por prerrequisitos correcto en frío, 84/84 lecciones aprobadas 2/2, 28/28 etapas al 100 %, 1680 XP, vistas de fuente y referencias correctas (con las fuentes nuevas por lección), 24 laboratorios y glosario renderizados, **0 errores de consola**. Evidencia: [VALIDACION-WEB-CONTENIDO.json](VALIDACION-WEB-CONTENIDO.json).

### Revisión educativa

El catálogo declara `educationalReview.kind = author_pilot_slice` con `independent: false` y `status = draft_pending_owner_review`. Es decir: **la cobertura está completa para las 28 etapas (mundo completo), pero la revisión educativa independiente sigue pendiente**. Una aprobación automática no sustituye la revisión del propietario.

### Cobertura

**0 de 28 etapas pendientes**: el mundo está completo. Los seis bloques —Windows (WAD-01 → WAD-07), AD DS (WAD-08 → WAD-17), Recuperación (WAD-18 → WAD-20), Red Team (WAD-21 → WAD-23), SOC (WAD-24 → WAD-26) e Integración (WAD-27 → WAD-28)— están redactados, integrados y publicados en local. Lo que queda es la **revisión independiente** del propietario, no la autoría.

| Bloque | Etapas | Estado |
| --- | --- | --- |
| Windows | WAD-01 → WAD-07 | completo y publicado |
| AD DS | WAD-08 → WAD-17 | completo y publicado |
| Recuperación | WAD-18 → WAD-20 | completo y publicado |
| Red Team | WAD-21 → WAD-23 | completo y publicado |
| SOC | WAD-24 → WAD-26 | completo y publicado |
| Integración | WAD-27 → WAD-28 | completo y publicado |

Cada etapa se ha redactado repitiendo el ciclo ya probado: 3 lecciones + 3 soluciones + banco, actualización de glosario/fuentes/catálogo, alta o extensión de laboratorio, `prepare:windows-ad`, `tsc`, `test`, guardias y verificación en navegador. Para ampliar el mundo (nuevas etapas, correcciones editoriales o reejecución de laboratorios) basta con repetir ese ciclo.

---

## Revisión inicial (histórica)

Fechada el 18/10/2026, **antes** de localizar la investigación Windows/AD. Se conserva por trazabilidad; su premisa (paquete disponible identificado como Redes) ya está resuelta.

### Hallazgo que determinó el siguiente paso

La carpeta proporcionada `WINplusAD/INFOCHATGPT` contiene **investigación de Redes**, no de Windows + AD. Se comprobaron títulos, contenido y referencias de los 14 archivos: siete Markdown de tandas, seis JSON y `redes.txt`.

El paquete proponía para Redes 8 etapas, 42 módulos, 168 títulos de lección, 20 laboratorios y 29 cruces entre mundos. Son cantidades declaradas por sus documentos; esta revisión no acredita su validez técnica ni ejecución.

**Decisión (vigente):** conservar ese paquete como investigación de Redes. Para Windows + AD solo se reutilizan cruces concretos de protocolos o competencias de red, tras resolverlos contra los dos catálogos. No se convirtieron las tandas de Redes en lecciones de Windows/AD.

**Resolución:** se solicitó y se recibió la investigación Windows/AD correcta, hoy en `WINDOWS_AD_MASTER_RESEARCH/01_INVESTIGACION/` (tandas 1 a 4).

### Material Windows/AD disponible

Origen privado, leído sin modificar: `/home/tommy/Desktop/IMPLEMENTAR_REDES_LINUX_WIN_EN_MI_WEB_ESTILO_DUOLINGO/WINplusAD/`

- 98 Markdown de Windows.
- 57 Markdown de Active Directory.
- 226 recursos asociados.
- 381/381 archivos coinciden con las huellas registradas en `MANIFIESTO-SHA256.json`.
- El inventario de referencias original registra 74 referencias pendientes de localizar; ese registro no prueba por sí solo que una referencia esté rota.

Se leyeron los Markdown para inventario estructural y se examinaron áreas del corpus y la arquitectura de la aplicación. **No se han validado técnicamente todos los comandos, identificadores ATT&CK, versiones, procedimientos o capturas.** La integridad de bytes no equivale a validez técnica o pedagógica. El inventario no reproduce contenido de los apuntes ni valores sensibles.

Evidencia reproducible de rutas, tamaños y SHA-256: [INVENTARIO-REVISION.json](INVENTARIO-REVISION.json).

### Método editorial (sigue vigente)

La unidad de integración es una **competencia/lección**, no un archivo ni una tanda de ChatGPT.

1. Catálogo de competencias Windows/AD con IDs propios.
2. Relación de cada competencia con fragmentos concretos de apuntes: archivo, huella, líneas o sección.
3. Asociación de los hallazgos de la investigación a esas competencias, registrando si completa una explicación, corrige una nota, aporta práctica o justifica contenido nuevo.
4. Redacción de una adaptación educativa nueva; las notas se preservan como referencia y las discrepancias se resuelven en un registro editorial.
5. Separación de explicación, práctica, evaluación, soluciones y referencias. Cada pregunta se justifica con el contenido de enseñanza, no solo con un solucionario.
6. Saneado y revisión de ejemplos y recursos gráficos antes de servirlos.
7. Generación de catálogo, búsqueda y JSON del lector mediante un adaptador específico, con reconstrucción íntegra verificada y procedencia de cada salida.

### Agrupaciones educativas preliminares

El orden responde a fundamentos → operación → evaluación y defensa → recuperación. Las rutas de origen de esta tabla son relativas a `01_FUENTES/`.

| Grupo provisional | Material existente relacionado | Aporte contrastado con la investigación Windows/AD |
| --- | --- | --- |
| Windows y administración | Reconocimiento local, servicios, recursos compartidos y extras de Windows | Recorrido de administración diaria, PowerShell, paquetes/parches, procesos y diagnóstico. |
| Autenticación y autorización local | `WINDOWS/0. TRIADA DE SEGURIDAD/`: tokens, principales, descriptores, objetos y auditoría | Secuencia didáctica, ejemplos coherentes y evaluación de permisos. |
| Arquitectura y autenticación AD | `ACTIVE_DIRECTORY/0. OVERVIEW/` y enumeración de dominio | Arquitectura operativa y dependencias de DNS, tiempo, Kerberos y LDAP. |
| Administración y diagnóstico AD | Enumeración de usuarios/grupos, GPO/OU y DNS; troubleshooting | Creación y mantenimiento del dominio, replicación, FSMO, sitios, políticas y cuentas de servicio. |
| Permisos, delegación y trusts | ACL, delegaciones, conceptos de bosques y escenarios entre dominios/bosques | Configuración legítima y límites de confianza primero; después evaluación autorizada y corrección. |
| PKI y AD CS | `ACTIVE_DIRECTORY/10. AD CS/MAIN.md` | Operación de PKI, plantillas, permisos, confianza, mantenimiento y verificación. |
| Seguridad del host y privilegios | Controles locales, escalada y persistencia de Windows | Contexto, versiones, prácticas acotadas, observación y remediación. |
| Identidades, credenciales y acceso remoto | Credenciales, enumeración, movimiento lateral y herramientas | Prerrequisitos, evidencia mínima, configuración segura, remediación y retest. |
| Investigación SOC desde Windows/AD | Auditoría de la tríada y `ACTIVE_DIRECTORY/11. MITIGATION & REMEDIATION/9. LOGGING & DETECTION.md` | Significado y requisitos de telemetría, cobertura, corroboración y límites. |
| Hardening, respuesta y recuperación | Mitigaciones/remediación y `WINDOWS/7. EXTRAS/Backup & Volumenes.md` | Recuperación de AD y bosque, restauración comprobable, continuidad y proyecto integrador. |

Clasificaciones que requieren tratamiento aparte:

- El manual largo de AD es una fuente transversal, no una lección gigante ni una etapa adicional automática.
- Los apuntes de CVE de Linux dentro de `WINDOWS/6. EXPLOTATIONS/CVEs/` se reservan para Linux tras confirmar su ámbito.
- BOF, aplicaciones de cliente pesado, phishing e infraestructura especializada se evalúan como especialización o material complementario según prerrequisitos.
- Una marca «falta», «no testeado» o una verificación histórica del autor conserva su significado; no se convierte en validación actual.

### Integración técnica con SOC Learning Path

El resultado visible sigue el patrón de Sentinel y Splunk: **mundo → mapa de etapas → nodos de lección → lector con estudio, práctica y evaluación**. Los desbloqueos dependen de los prerrequisitos educativos, no de las coordenadas del mapa.

| Responsabilidad | Realizado para Windows + AD |
| --- | --- |
| Mundo y rutas | `courseId: windows-ad`; entrada `#/windows-ad/ruta`, etapas y lector bajo el mismo prefijo |
| Catálogo y contenido | Fuentes editoriales en `WINDOWS_AD_MASTER_RESEARCH/`; generador `scripts/prepare-windows-ad.mjs`; salidas propias en `src/generated/windows-ad/` y `public/windows-ad-content/` |
| Presentación del mundo | `src/windows-ad/` con adaptador de mapa y metadatos visuales propios sobre las primitivas de `src/components/adventure/` |
| Lector | Estructura visual coherente y neutral, con contenido y actividades Windows/AD |
| Progreso | Almacén propio `soc-learning-path:windows-ad:learning:v1`; no reutiliza las claves de otros mundos |
| Estado educativo | Distingue estudiado, teoría aprobada y práctica evaluada; la práctica documental no se presenta como ejecución real |
| Recursos | Solo contenido y recursos saneados/revisados necesarios para cada lección |

### Orden para convertir la propuesta en un mundo utilizable

1. ~~Recibir/localizar las tandas de investigación Windows/AD y verificar su alcance.~~ **Hecho** (tandas 1–4).
2. ~~Completar la matriz competencia → apuntes → investigación → adaptación, y fijar etapas y dependencias.~~ **Hecho** para los seis bloques: Windows (WAD-01 → WAD-07), AD DS (WAD-08 → WAD-17), Recuperación (WAD-18 → WAD-20), Red Team (WAD-21 → WAD-23), SOC (WAD-24 → WAD-26) e Integración (WAD-27 → WAD-28).
3. ~~Preparar un primer recorrido vertical con lecciones completas, actividades trazables y recursos saneados.~~ **Hecho** (28 etapas).
4. ~~Integrar ese recorrido con selector, mapa, lector y progreso propio, con comprobaciones de navegación, teclado y 320 px.~~ **Hecho**.
5. Ampliar por etapas con los mismos contratos, manteniendo un listado claro de contenido preparado, revisado y pendiente. **Completo**: 0 de 28 etapas pendientes de autoría.
6. Tras cambios de código, ejecutar pruebas, build y comprobaciones de integridad y navegador. Una aprobación automática no sustituye la revisión educativa del propietario.
