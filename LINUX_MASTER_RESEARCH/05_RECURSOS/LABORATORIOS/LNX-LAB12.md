# LNX-LAB12 — Hardening con análisis de compatibilidad

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado. Todo el material es **sintético**: no reproduce una captura, una ejecución real ni datos personales.

## Objetivo

Revisar la unidad didáctica de usuario y diseñar **dos perfiles de seguridad** (base y reforzado) evaluando la **compatibilidad funcional** y el **rollback**, sin tocar servicios críticos (base documental: F22, F28).

## Competencia

Diseño defensivo razonado: proponer controles de endurecimiento, contrastarlos con los requisitos reales del programa y justificar por escrito lo que **no** se aplica y por qué.

## Nivel y prerrequisitos

Intermedio. Conviene haber recorrido la etapa `LNX-11`. Requiere VM propia y una unidad de laboratorio (`lab-marker`) con la documentación de sus necesidades. No se requieren privilegios root.

## Material sintético

- VM de laboratorio aislada con nombre de ejemplo `lab-lnx-12`, cuenta sin privilegios `analista` y sin datos personales.
- Las direcciones que aparezcan, si aparecen, pertenecen **solo** al rango de laboratorio `10.60.0.0/16` (p. ej. `10.60.12.120`). No se usan IPs reales.
- Unidad de ejemplo `lab-marker.service` y su copia de evidencia si ya fue retirada; perfiles de ejemplo `perfil A` (mínimo) y `perfil B` (reforzado).
- Directorio de trabajo aislado: `"$HOME/linux-lab/LAB12"`.

## Procedimiento por pasos

### Preparación

1. Crea el directorio aislado de evidencia: `mkdir -p "$HOME/linux-lab/LAB12"`
2. Registra fecha y hora en **UTC**: `date -u -Is`
3. Localiza la **definición efectiva** de la unidad o su copia: `systemctl --user cat lab-marker.service` (si la unidad fue retirada, analiza la copia **sin ejecutarla**).

### Tarea (diseño, sin tocar servicios críticos)

4. **Identifica requisitos reales** de la unidad: qué archivos escribe, qué UID ejecuta y si necesita red (según `ExecStart`, `User` y la documentación del laboratorio).
5. Consulta la ayuda de la herramienta de análisis: `systemd-analyze security --help`
6. **Propón el perfil A (mínimo)**: `User` no privilegiado, `NoNewPrivileges=true`, `PrivateTmp=true` y permisos de archivos justificados.
7. **Propón el perfil B (aislamiento adicional)**: evalúa `ProtectSystem`, `ProtectHome`, `CapabilityBoundingSet` y acceso de red conforme a los requisitos **reales** del programa.
8. **Verifica la sintaxis** solo si el archivo existe: `systemd-analyze verify "$HOME/.config/systemd/user/lab-marker.service"`
9. Documenta qué directivas **no** funcionan en gestores de usuario (limitaciones de namespaces o de plataforma) y por qué.

> **No** apliques perfiles genéricos a producción. Una directiva que rompa una escritura legítima debe **rechazarse** o tener una excepción específica. Documenta el impacto y la reversión de cada control.

### Verificación y limpieza

10. Comprueba el estado final: si creaste un override de prueba, **elimínalo**, ejecuta `systemctl --user daemon-reload` y verifica que el valor efectivo volvió al original.
11. Confirma que no se modificó ninguna unidad crítica y que no se exponen secretos.
12. Deja constancia de que un **puntaje** de análisis no equivale a una **certificación** de seguridad.

## Evidencia a entregar

- Una **matriz** `control | amenaza | dependencia | evidencia | coste operativo | rollback`.
- El **perfil base** y el **perfil reforzado**, con la justificación de cada control.
- La justificación de los ajustes **rechazados** por incompatibilidad o por impacto en escrituras legítimas.
- La prueba de funcionamiento o la explicación documentada del impedimento técnico.

## Criterios de aceptación

- Análisis (6): al menos **cuatro controles** evaluados, cada uno con su límite y su coste.
- Compatibilidad (5): se contrastan los controles con los requisitos reales y se rechazan los incompatibles.
- Reversión (5): existe un **plan de reversión expreso** por control.
- Seguridad (4): no se exponen secretos ni se modifican unidades críticas.
- **Fallo crítico:** aplicar un perfil genérico a producción sin verificar compatibilidad ni documentar la reversión, o confundir el puntaje con una certificación.

## Autorización y límites

Actividad de **diseño y análisis** sobre la unidad de laboratorio. **Prohibido** aplicar perfiles genéricos a producción y modificar servicios críticos. Documenta siempre el impacto y la reversión. No confundas el **scoring** con una certificación. No publiques datos del host de laboratorio.

## Limpieza

Elimina cualquier override de prueba si existe, ejecuta `systemctl --user daemon-reload` y comprueba el estado final de la unidad. Conserva la matriz y los perfiles en `"$HOME/linux-lab/LAB12"`.

## Nota y estado declarado

Este documento es un **diseño por ejecutar**: describe un laboratorio que aún no se ha corrido ni validado, y todo su contenido es sintético. La guía **no acredita** haber ejecutado el laboratorio ni certifica resultados.
