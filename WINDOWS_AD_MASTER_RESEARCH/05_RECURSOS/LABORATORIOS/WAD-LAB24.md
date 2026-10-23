# WAD-LAB24 — Trusts y recuperación de dominio multidominio

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **EXT-04**, avanzado y opcional. El **bloque A** es de análisis documental y pertenece a la etapa `WAD-14`. El **bloque B** trata la restauración de un dominio dentro de un escenario multidominio y pertenece a la etapa `WAD-20`. **No** se ejecutan comandos de confianza sobre entornos de terceros.

## Objetivo

**Analizar** los límites de confianza entre dominios con un **grafo documental** y **pruebas sintéticas de aislamiento**, y preparar el razonamiento que se usará cuando haya que restaurar un dominio sin romper las dependencias del otro.

## Competencia

Análisis de límites de confianza: describir la dirección y la transitividad de las confianzas, trazar rutas de control entre dominios y reconocer las referencias cruzadas que un aislamiento o una restauración pueden romper.

## Nivel y prerrequisitos

Intermedio. El bloque A requiere la etapa `WAD-14` (`WAD-14-L01` a `WAD-14-L03`) y el bloque B requiere además la etapa `WAD-20` (`WAD-20-L01` a `WAD-20-L03`). Esta guía corresponde al laboratorio de referencia EXT-04 y es de nivel **avanzado y opcional**.

## Bloque A — Mapa de confianzas (etapa WAD-14)

### Preparación A

- Solo papel o editor de texto: el bloque A es de **diseño y análisis**, no de ejecución.
- Un escenario sintético con **dos dominios**, por ejemplo `ad.lab.test` y `socio.lab.test`, en el mismo bosque o en bosques distintos según el caso que quieras estudiar.
- Una **matriz** de roles, vínculos, catálogo global y DNS, y datos **no personales**: nombres de objetos inventados.

### Tarea A

1. Dibuja el **grafo de confianzas**: qué dominio confía en qué, en qué **dirección** y si la confianza es **transitiva**.
2. Anota para cada confianza si es de **bosque** o **externa** y qué implica para la autenticación entre dominios.
3. Marca dónde aplicarías **autenticación selectiva** y **filtrado de SID**, y explica qué restringe cada control.
4. Traza una **ruta de control**: desde una identidad de un dominio hasta un recurso del otro, indicando por qué confianzas y pertenencias pasa.
5. **Prueba sintética de aislamiento**: describe qué cambiaría si una confianza se rompiera o se restringiera, y qué dependencias se romperían con ello.
6. Lista los **riesgos de referencias cruzadas**: catálogo global, vínculos, DNS y pertenencias que cruzan el límite.
7. Escribe un **runbook mínimo** que identificaría el catálogo global, las referencias y la secuencia de confianzas, sin tocar ningún entorno real.

### Evidencia A

- El **grafo** de confianzas antes y después del aislamiento propuesto.
- La tabla de **dirección y transitividad** por confianza.
- La **ruta de control** trazada con sus dependencias.
- La lista de **riesgos de referencias cruzadas**.
- El **runbook** que ordena la identificación de dependencias sin ejecutar cambios.

### Criterios A

- Distingue **dirección** de **transitividad** de una confianza.
- Distingue **autenticación selectiva** de **filtrado de SID** por lo que cada control restringe.
- **No** equipara restaurar un dominio con restaurar el bosque completo.
- **No** ejecuta comandos de confianza sobre terceros; el bloque es documental.
- Reconoce los **límites**: el modelo es una hipótesis hasta que se despliega y se prueba.

## Bloque B — Restauración de un dominio multidominio (etapa WAD-20)

### Preparación B

- El **grafo de confianzas** obtenido en el bloque A y un escenario documental con **dos dominios** sintéticos (`ad.lab.test` y `socio.lab.test`).
- Una **matriz** de roles, vínculos, catálogo global y DNS que permita ver qué referencias cruzan el límite.
- Copias de referencia del escenario para decidir cuál es la confiable.
- **No** se exige ninguna máquina virtual: el bloque puede resolverse sobre papel o un editor de texto.

### Tarea B

1. **Diseña** el aislamiento de **un solo dominio** sin comprometer las dependencias del otro.
2. Traza el **grafo antes y después**: qué confianzas, entradas de catálogo global, referencias de DNS y vínculos cruzan el límite.
3. **Ordena** la restauración del dominio: primer controlador, DNS y roles, y después la **secuencia de confianzas**.
4. Distingue restaurar **un dominio** de restaurar el **bosque completo** y explica por qué no son equivalentes.
5. Lista los **riesgos de referencias cruzadas** que el aislamiento puede romper.
6. Escribe el **runbook** que identifica el catálogo global, las referencias y la secuencia de confianzas, sin tocar ningún entorno real.

### Evidencia B

- El **grafo** de confianzas antes y después del aislamiento propuesto.
- El **runbook** con la secuencia de confianzas y las dependencias identificadas.
- La lista de **riesgos de referencias cruzadas**.
- La distinción explícita entre restaurar un dominio y restaurar el bosque completo.

### Criterios B

- El runbook **identifica** el catálogo global, las referencias y la secuencia de confianzas.
- **No** equipara restaurar un dominio con restaurar el bosque completo.
- **No** ejecuta comandos de confianza sobre terceros: el bloque es documental.
- Demuestra la prueba **positiva** (el runbook cubre las dependencias) y la **negativa** (no se equipara dominio y bosque).

## Autorización y límites

Todo el trabajo de los bloques A y B se realiza sobre papel o un editor de texto. **No** ejecutes comandos de confianza sobre un dominio real ni de terceros. **No** uses nombres ni datos de una organización real. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

No hay cambios que revertir en ninguno de los dos bloques. Elimina los datos de laboratorio independientes y confirma que no queda ninguna configuración de confianza activa.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
