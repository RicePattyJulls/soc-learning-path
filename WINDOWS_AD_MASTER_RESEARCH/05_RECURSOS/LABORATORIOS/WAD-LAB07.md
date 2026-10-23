# WAD-LAB07 — Kerberos, SPN y cuenta servicio

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

**Trazar** una autenticación Kerberos sintética hasta el servicio concreto, **consultar** los nombres de entidad de seguridad de servicio registrados y **diagnosticar** un fallo de autenticación por un SPN ausente o duplicado, sin extraer claves ni material de tickets. Cierra con la cuenta de servicio adecuada como alternativa de diseño.

## Competencia

Explicación de la autenticación: describir el flujo entre tickets y servicios y distinguir un síntoma de configuración de una evidencia de ataque.

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-11` (`WAD-11-L01` a `WAD-11-L03`). Esta guía corresponde al laboratorio de referencia LAB-07.

## Preparación

- El dominio aislado del laboratorio, un equipo miembro y un **servicio de ejemplo** propio del laboratorio, sin credenciales reutilizadas de ningún entorno real.
- Una **instantánea** creada antes de empezar y nombres **sintéticos** para todos los objetos.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de la cuenta y de los SPN del servicio.

## Tarea

1. Describe el **flujo** entre el cliente, el centro de distribución de claves y el servicio: petición del ticket de concesión de tickets y, después, del ticket de servicio para el SPN concreto.
2. Ejecuta una **consulta de solo lectura** de los SPN registrados para la cuenta del servicio y anótalos.
3. Realiza una autenticación **sintética y autorizada** contra el servicio y comprueba, con la evidencia de lectura disponible, que el servicio recibe el ticket esperado.
4. Retira de forma **reversible** un SPN del servicio (o regístralo mal a propósito) y documenta el **síntoma**: el cliente deja de autenticar por Kerberos.
5. Comprueba si el sistema **recurre al método heredado** (NTLM) como respaldo y anota cómo lo mediste en lugar de suponerlo.
6. Enuncia la **hipótesis** que explica el fallo (SPN ausente o duplicado), la prueba que la confirma y la que la descarta.
7. Corrige el registro del SPN **sin tocar claves ni secretos**, restaura la configuración original y verifica que la autenticación Kerberos vuelve.
8. Como cierre de diseño, compara la **cuenta de servicio** usada con una **gMSA** y explica qué problema de gestión de secretos resolvería.

## Evidencia esperada

- El flujo AS/TGS descrito y el SPN que identifica al servicio.
- La consulta de SPN con su resultado.
- El síntoma del SPN ausente con la **medición** del respaldo NTLM.
- La hipótesis, su prueba y su descarte.
- La corrección reversible y la verificación del retorno a Kerberos.
- La comparación con la gMSA y su justificación.

## Criterios verificables

- Explica el flujo Kerberos y el **papel del SPN** sin confundirlo con una credencial.
- Distingue un **síntoma de configuración** de una **evidencia de ataque**; no concluye un ataque por un ticket o un SPN.
- **Mide** el respaldo NTLM en lugar de darlo por supuesto.
- Corrige sin **extraer claves**, **tickets ajenos** ni **volcar secretos** de la memoria de un proceso.
- Documenta con hora en **UTC**, revierte y reconoce los límites de lo observado.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre el dominio de laboratorio. **Nunca** extraigas claves a largo plazo, tickets de otras cuentas ni volcados de memoria. **No** uses datos ni credenciales de un entorno real. **No** escribas contraseñas en la evidencia. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

Restaura los SPN originales del servicio, detén el servicio de prueba, elimina la cuenta señuelo si la creaste y confirma que el estado coincide con el inicial (o recupera la instantánea).

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
