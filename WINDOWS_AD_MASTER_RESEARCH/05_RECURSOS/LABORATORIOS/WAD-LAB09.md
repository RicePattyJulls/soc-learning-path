# WAD-LAB09 — Tier 0 y custodia DSRM

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

**Mapear** las identidades y los sistemas de Tier 0 del laboratorio, **reducir** un permiso excesivo sobre el controlador y **diseñar** la custodia de la contraseña de recuperación DSRM con Windows LAPS. El cierre demuestra una recuperación segura sin exponer el valor de la credencial.

## Competencia

Administración con el privilegio mínimo: separar las identidades de administración, medir el derecho efectivo y diseñar una custodia que se pueda auditar, sin escribir secretos en la evidencia.

## Nivel y prerrequisitos

Intermedio. Requiere la etapa `WAD-15` (`WAD-15-L01` a `WAD-15-L03`). Esta guía corresponde al laboratorio de referencia LAB-09.

## Preparación

- Un controlador `DC01` y un equipo miembro `Win11` en una **red virtual cerrada** y en el dominio `ad.lab.test`.
- Cuentas administrativas **distintas** para el trabajo de laboratorio y roles y listas de control **ficticios**; ningún dato personal ni de un entorno real.
- Una **instantánea** creada antes de empezar y nombres **sintéticos** para todos los objetos.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de las delegaciones y de la cuenta de recuperación.

## Tarea

1. **Mapea** qué identidades y qué sistemas son Tier 0 en el laboratorio y justifica cada uno por lo que controla, no por su nombre.
2. Localiza una **delegación o permiso excesivo** sobre el controlador (por ejemplo, una cuenta generalista con derechos de administración) y **redúcelo** al mínimo necesario.
3. Demuestra la prueba **positiva**: una identidad de administración **dedicada** ejerce su función permitida sin recurrir a una cuenta generalista.
4. Demuestra la prueba **negativa**: una cuenta de soporte generalista **no** tiene permisos sobre el controlador ni puede **leer** la contraseña de recuperación custodiada.
5. Diseña la **custodia** de la contraseña de recuperación DSRM con **Windows LAPS**: en qué directorio se guarda, quién puede leerla, con qué periodicidad **rota** y cómo se registra cada lectura.
6. Describe una **recuperación segura** de principio a fin: autorización, recuperación por el mecanismo previsto, uso en una ventana de mantenimiento, **rotación** posterior y confirmación de que el controlador vuelve al servicio normal.
7. **No** escribas el valor de ninguna contraseña en la evidencia; documenta el procedimiento y su registro, no el secreto.

## Evidencia esperada

- La **matriz de roles** de Tier 0 con la función que justifica cada identidad.
- El derecho efectivo **antes y después** de reducir el permiso excesivo.
- La prueba **positiva** (función permitida) y la **negativa** (sin permiso ni lectura).
- El **diseño de custodia**: ubicación, permiso de lectura, periodicidad de rotación y auditoría.
- El procedimiento de **recuperación segura**, sin el valor de la credencial.

## Criterios verificables

- Distingue Tier 0 por lo que cada identidad **controla**, no por su nombre.
- Reduce un permiso excesivo y lo demuestra con el derecho efectivo.
- Demuestra la prueba **positiva** y la **negativa**.
- **No** escribe la contraseña ni su valor en la evidencia ni en un repositorio.
- Documenta con hora en **UTC** y reconoce qué no se pudo observar.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre el dominio de laboratorio. **Nunca** guardes la contraseña DSRM en la evidencia ni en un repositorio. **No** uses nombres ni datos de una organización real. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

**Revierte** las políticas y los permisos modificados, elimina las cuentas de prueba y confirma que el estado coincide con el inicial (o recupera la instantánea).

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
