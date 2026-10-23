# WAD-LAB20 — Proyecto final: operar, auditar y recuperar

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **LAB-20**, de integración, de la etapa `WAD-28`. Es el **proyecto final** del mundo: integra administración, auditoría y recuperación en un **entorno aislado** y con **separación de roles**.

## Objetivo

**Administrar** un entorno aislado de inicio a fin: operar un cambio de identidad aprobado, **diagnosticar** una falla, **investigar** los eventos, **auditar** los permisos, **recuperar** la identidad afectada y **demostrar** el retest, reuniendo un **expediente técnico** con evidencias reproducibles.

## Competencia

Integración: encadenar cambio aprobado, diagnóstico, análisis de eventos y recuperación con evidencias y límites, y defender el resultado ante otra persona sin inventar detección ni impacto.

## Nivel y prerrequisitos

Integrador. Requiere las etapas `WAD-20`, `WAD-23` y `WAD-27` (`WAD-28-L01` a `WAD-28-L03`). Esta guía corresponde al laboratorio de referencia LAB-20.

## Preparación

- La **topología entregada**: `DC01`, `DC02` y un puesto `Win11` en una **red aislada** (una autoridad de certificación es opcional).
- **3 fallas inocuas** sembradas, **1 permiso excesivo** preparado y un **backup previo** verificado.
- Un **guion de cambio** aprobado con su ventana y una **reversión** definida.
- **Separación de roles** declarada (quién administra, quién audita y quién responde).
- Registra fecha y hora en **UTC** y anota la **línea base** del entorno.

## Tarea

1. **Opera un cambio** de identidad **aprobado** y reversible, con evidencias y su plan de reversión.
2. **Diagnostica** una de las fallas sembradas y documenta el método, la causa y la corrección.
3. **Investiga los eventos** del cambio y de la falla: construye la línea de tiempo con fuente, host, hora en **UTC**, evento y cuenta.
4. **Audita** una **ACL** o delegación y eleva el **hallazgo** con recurso, permiso, comprobación y grado de certeza.
5. **Recupera** la identidad afectada desde una **copia confiable** y **mide** el **RPO** y el **RTO observados**.
6. **Retestea** el control corregido y comprueba la **ausencia de regresión**.
7. **Defiende oralmente** el expediente ante otra persona del laboratorio.
8. Cierra con la **prueba negativa**: las cuentas **fuera de alcance** no se modifican y los **falsos positivos** quedan descartados.

## Evidencia esperada

- El **expediente** con runbooks, matriz de eventos, gráficos de dependencias y **roles RACI**.
- La **evidencia** del cambio aprobado, del diagnóstico y del hallazgo auditado.
- La **recuperación** con la copia usada y el **RPO/RTO observados**.
- El **retest** sin regresión y la **defensa** con límites.

## Criterios verificables

- El **servicio principal** queda accesible y la falla, diagnosticada, con su causa documentada.
- **Mide** el **RPO/RTO** en lugar de suponerlos y **mide** en **UTC**.
- **No** modifica cuentas fuera de alcance y **descarta** los falsos positivos con evidencia.
- Demuestra la prueba **positiva** (entorno operativo y recuperado) y la **negativa** (sin daños colaterales ni falsos positivos).
- Reconoce el **límite**: todo ocurre en un laboratorio aislado y no acredita producción.

## Autorización y límites

Todo se ejecuta en un **entorno aislado** y con **separación de roles**. La práctica se **valida antes** de cualquier acción de impacto. **No** uses nombres ni datos de una organización real.

## Limpieza

**Restaura la línea base** o **descarta las máquinas virtuales** y las claves de la autoridad de certificación. Confirma que el estado coincide con la línea base.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
