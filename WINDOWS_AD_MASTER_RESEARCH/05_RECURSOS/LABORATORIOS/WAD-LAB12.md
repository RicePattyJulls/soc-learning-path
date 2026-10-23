# WAD-LAB12 — Backup y restauración de archivo en host

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-12**, de la etapa `WAD-18`.

## Objetivo

**Observar** cómo se elige una estrategia de respaldo a partir del RPO y el RTO objetivo, **crear** una copia y **restaurar** una versión comprobada de un archivo. La meta es medir el RPO real observado y demostrar con evidencia que la copia sirve, sin confundir un respaldo con una instantánea.

## Competencia

Diseño y prueba de respaldo a nivel de host: fijar objetivos de recuperación, crear una copia confiable y verificarla, y reconocer los límites de lo que la copia permite recuperar.

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-18` (`WAD-18-L01` a `WAD-18-L03`). Esta guía corresponde al laboratorio de referencia LAB-12.

## Preparación

- Una máquina virtual de laboratorio (un puesto o un servidor miembro) en una **red virtual cerrada**.
- Un **directorio señuelo** con archivos de nombres sintéticos y un **almacenamiento de respaldo separado** del disco original.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de los archivos como **línea base**.
- Define antes de ejecutar el **RPO** y el **RTO** objetivo del escenario y déjalos por escrito.

## Tarea

1. **Define** el RPO y el RTO objetivo del escenario y explica por qué esa frecuencia de copia los cumple.
2. Crea los archivos señuelo, **regístralos** con su **hash** y su **marca temporal** en UTC.
3. **Crea el respaldo** en el almacenamiento separado y comprueba que la copia es legible.
4. **Modifica** uno de los archivos y añade otro **después** del respaldo, para tener un cambio posterior a la copia.
5. **Restaura** la versión respaldada y **verifica** el archivo con su **hash** y su marca temporal esperada.
6. **Mide** el **RPO observado** (diferencia entre la última copia y el cambio perdido) y el **tiempo** de respaldo y de restauración.
7. Anota la **custodia** de la copia: dónde vive, quién puede leerla y cómo se conserva.
8. Cierra con la **prueba negativa**: comprueba que el archivo posterior al respaldo **no** debe declararse restaurado desde esa copia.

## Evidencia esperada

- El RPO y el RTO objetivo, y el RPO **observado** tras la prueba.
- El **hash** y la marca temporal del archivo restaurado, comparados con la línea base.
- Los **tiempos** de respaldo y de restauración.
- La nota de **custodia** de la copia y su alcance de lectura.
- La distinción explícita entre **respaldo** e **instantánea**.

## Criterios verificables

- **Mide** el RPO observado en lugar de suponerlo y registra hora en **UTC**.
- **Verifica** la restauración con **hash**, no solo por el nombre del archivo.
- Distingue un **respaldo** de una **instantánea** y no usa una como si fuera la otra.
- Demuestra la prueba **positiva** (la copia restaura la versión esperada) y la **negativa** (el cambio posterior no se declara recuperado).
- **No** concluye de más: la copia protege lo observado, no todo lo que pueda necesitarse después.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada**. Las copias **no** quedan disponibles para lectura amplia de usuarios del laboratorio. **No** uses nombres ni datos de una organización real. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

**Borra** la copia sintética y los archivos señuelo tras verificar los hashes y exportar la evidencia.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
