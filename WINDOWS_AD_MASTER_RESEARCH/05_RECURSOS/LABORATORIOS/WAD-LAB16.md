# WAD-LAB16 — Auditoría Red Team autorizada de permisos

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-16**, de tipo adversarial. El **bloque A** (inventario autorizado) pertenece a la etapa `WAD-21` y el **bloque B** (rutas de control y grado de certeza) a la etapa `WAD-22`. Todo el trabajo es de **lectura** y con reglas de enfrentamiento escritas.

## Objetivo

**Enumerar** de forma limitada ACL, delegaciones, SPN, confianzas y configuración de la PKI, y **priorizar** los hallazgos defensivamente, separando el **riesgo teórico** de la **condición explotable** y del **acceso probado** en el laboratorio.

## Competencia

Auditoría autorizada de permisos: describir la superficie con consultas de solo lectura, trazar rutas de control con su grado de certeza y redactar un hallazgo con evidencia y sin recoger secretos.

## Nivel y prerrequisitos

Avanzado. El bloque A requiere la etapa `WAD-21` y el bloque B, la etapa `WAD-22`. Esta guía corresponde al laboratorio de referencia LAB-16.

## Bloque A — Inventario autorizado (etapa WAD-21)

### Preparación A

- Un laboratorio **aislado** con `DC01` y **cuentas señuelo** de nombres sintéticos; **no** se conecta a ninguna red corporativa.
- **Reglas de enfrentamiento por escrito**: autorización, alcance con inclusiones y exclusiones, ventana de trabajo, finalidad y condiciones de **parada**.
- Una **lista de objetos** a inventariar y una identidad de solo lectura para las consultas.
- Registra fecha y hora en **UTC** y anota el **estado inicial** como **línea base**.

### Tarea A

1. **Confirma** por escrito la autorización, el alcance y las condiciones de **parada** antes de ejecutar ninguna consulta.
2. **Inventaria** la superficie con consultas de **solo lectura** (usuarios, equipos, grupos y directivas), sin recoger secretos ni valores de credenciales.
3. Lleva un **registro de consultas**: qué se consultó, con qué identidad, a qué hora y para qué.
4. **Detente** ante cualquier objeto fuera de alcance y anota la consulta no realizada; no la amplíes por tu cuenta.
5. Anota los **límites** del inventario: qué no se revisó y por qué.

### Evidencia A

- Las **reglas de enfrentamiento** con alcance y parada.
- El **inventario** de la superficie descrito con consultas de solo lectura.
- El **registro de consultas** con hora en UTC y la identidad usada.
- La nota de **límites** y los objetos que quedaron fuera de alcance.

### Criterios A

- **El 100 %** de las consultas y los objetos quedan dentro del alcance autorizado.
- **No** se recogen secretos ni valores de credenciales durante el inventario.
- Se **detiene** y se documenta ante un objeto fuera de alcance en lugar de ampliarlo.
- Demuestra la prueba **positiva** (inventario útil) y la **negativa** (objeto fuera de alcance no consultado).

## Bloque B — Rutas de control y grado de certeza (etapa WAD-22)

### Preparación B

- El inventario del bloque A y el **grafo inicial** de identidades y recursos del laboratorio.
- **Cuentas señuelo** para comprobar de forma positiva un permiso concreto, sin tocar identidades reales.
- Una **ventana** acotada y una identidad de solo lectura; **no** se extraen credenciales ni se mueve a hosts ajenos.

### Tarea B

1. **Traza** la cadena desde una **ACE** o una **delegación** hasta el control al que encadena y anota la **ruta de control**.
2. Clasifica cada hallazgo con su **grado de certeza**: riesgo teórico, condición explotable o acceso probado, sin saltar de uno a otro sin prueba.
3. Lee **SPN**, **NTLM** y **confianzas** como hechos de configuración; **no** eleves su mera presencia a acceso.
4. Documenta la **configuración de AD CS** (plantillas, EKU y puntos de publicación) como evidencia de solo lectura, **sin** emitir, revocar ni tocar la clave de la autoridad.
5. **Contraprueba** en una cuenta señuelo el permiso que afirmas y registra el resultado.
6. Redacta un **hallazgo** con recurso, permiso, comprobación y límites.

### Evidencia B

- El **grafo de privilegios** con el grado de certeza de cada ruta.
- La **contraprueba** positiva sobre la cuenta señuelo.
- La evidencia de configuración de **AD CS** leída sin operar la autoridad.
- El **hallazgo redactado** y su nota de límites.

### Criterios B

- **No** declara acceso ni impacto por la mera presencia de un **SPN** o una **ACE**.
- Distingue **riesgo teórico**, **condición explotable** y **acceso probado** con evidencia.
- Demuestra la prueba **positiva** (hallazgo con recurso, permiso y comprobación) y la **negativa** (no concluye acceso sin prueba).
- **No** extrae credenciales ni se mueve a hosts fuera del alcance.

## Autorización y límites

Todo el trabajo es de **lectura** y se realiza en un laboratorio **aislado**, con reglas de enfrentamiento escritas. **No** se extraen credenciales, **no** se persiste y **no** se mueve a hosts ajenos. **No** uses nombres ni datos de una organización real.

## Limpieza

**Revierte** cualquier delegación temporal creada para la prueba y **borra** los datos sintéticos y las cuentas señuelo. Confirma que el estado coincide con la línea base.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
