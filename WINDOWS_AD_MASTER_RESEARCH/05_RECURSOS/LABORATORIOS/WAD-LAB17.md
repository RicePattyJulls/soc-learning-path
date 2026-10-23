# WAD-LAB17 — Auditoría y timeline de identidad

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-17**, de tipo soc. El **bloque A** (auditoría medida) pertenece a la etapa `WAD-24` y el **bloque B** (timeline de identidad) a la etapa `WAD-25`. **No** se capturan credenciales en claro y los registros se protegen.

## Objetivo

**Configurar** una auditoría medible, **producir** eventos inocuos y **reconstruir** una línea de tiempo de identidad con su incertidumbre, distinguiendo en todo momento el hecho registrado de la interpretación.

## Competencia

Auditoría y timeline: enlazar política de auditoría, SACL y evento nativo, y ordenar identidad y proceso por hora en UTC sin inferir malicia automáticamente.

## Nivel y prerrequisitos

Avanzado. El bloque A requiere la etapa `WAD-24` y el bloque B, la etapa `WAD-25`. Esta guía corresponde al laboratorio de referencia LAB-17.

## Bloque A — Auditoría medida (etapa WAD-24)

### Preparación A

- Un laboratorio **aislado** con `DC01`, un servidor miembro y un puesto; **no** se conecta a ninguna red corporativa.
- Una **GPO de auditoría** preparada y una **cuenta sintética** de nombres inventados.
- Un **plan de eventos esperado**: qué evento se debería registrar para cada actividad prevista.
- Registra fecha y hora en **UTC** y anota la **línea base** de la política de auditoría.

### Tarea A

1. **Configura** las **subcategorías** de auditoría necesarias para la actividad elegida y una **SACL** sobre el objeto que quieres observar.
2. Recuerda y documenta que la **SACL** no concede acceso: eso corresponde a la **DACL**.
3. **Produce eventos inocuos**: un inicio de sesión correcto, uno incorrecto y un cambio de grupo, sin dañar nada.
4. **Mapea los eventos nativos** en una **matriz** actividad → registro → evento → condición → limitación.
5. Comprueba la **cobertura efectiva**: al menos un caso con visibilidad esperada y otro **sin** visibilidad esperada, explicando por qué falta.
6. **No** capturar credenciales en claro; protege los registros durante el ejercicio.

### Evidencia A

- La **matriz** de auditpol, SACL y evento por actividad.
- Los **eventos esperados** obtenidos en los casos con y sin visibilidad.
- La **línea base** de la política de auditoría y su restauración.

### Criterios A

- **Muestra** al menos un caso **con** y otro **sin** visibilidad esperada.
- Distingue **SACL** de **DACL** por su función.
- **No** captura credenciales en claro y **protege** los registros.
- Demuestra la prueba **positiva** (evento esperado) y la **negativa** (caso sin visibilidad, con su causa).

## Bloque B — Timeline de identidad (etapa WAD-25)

### Preparación B

- Los eventos obtenidos en el bloque A, con su **hora en UTC** y su **host** de origen.
- Una plantilla de **timeline** con columnas de fuente, host, hora UTC, evento y cuenta objetivo.
- Reglas de enfrentamiento y alcance escritos; identidades de prueba con nombres sintéticos.

### Tarea B

1. **Construye** una **línea de tiempo** con fuente, host, hora en UTC, evento y cuenta objetivo.
2. Ordena los hechos y **marca la incertidumbre**: qué está registrado y qué se infiere.
3. Aplica la regla de prudencia: un evento de solicitud de servicio (**4769**) **no** se declara Kerberoasting sin contexto.
4. Formula **hipótesis alternativas** que expliquen la misma secuencia y anota qué prueba las descartaría.
5. Cierra con la **prueba negativa**: no se concluye malicia a partir de un único evento sin contexto.

### Evidencia B

- La **timeline** con fuente, host, hora en UTC, evento y cuenta objetivo.
- Las **incertidumbres** y las **hipótesis alternativas** con su prueba de descarte.
- El evento aislado descartado como prueba de malicia por sí solo.

### Criterios B

- Distingue el **hecho registrado** de la **interpretación** en cada línea.
- **No** declara Kerberoasting por un **4769** sin contexto.
- Demuestra la prueba **positiva** (timeline reproducible) y la **negativa** (un evento aislado no prueba malicia).
- Registra hora en **UTC** y protege los registros.

## Autorización y límites

Todo el trabajo se realiza en un laboratorio **aislado**. **No** se capturan credenciales en claro y **no** se recogen datos personales. **No** uses nombres ni datos de una organización real.

## Limpieza

**Elimina** los usuarios sintéticos y **restaura** la política de auditoría a su estado inicial. Confirma que el estado coincide con la línea base.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
