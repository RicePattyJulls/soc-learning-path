# LAB09-B — Threat Intel, analyst queue y diseño seguro de playbook

**Lecciones:** SP-R09-L05–L08. **Modo:** planeación sobre papel; sin API, sin credenciales, sin ejecución, sin aislamiento.

## Datos

`fixtures/ti_indicators.csv` incluye tres indicadores sintéticos en rangos RFC 5737 reservados para documentación. `fixtures/synthetic_es_findings.csv` aporta los findings para hacer el caso.

## Tareas

1. Comprueba fecha de expiración para cada indicador al 16/10/2026 y justifica su confiabilidad sin tratarlo como amenaza real.
2. Construye un caso de `alice` (F01–F03), separando hechos, hipótesis y lagunas.
3. Diseña un playbook de lectura: recolectar evidencias de identidad, obtener contexto TI y activos, anotar hallazgo.
4. Diseña puerta de aprobación **explícita** antes de resetear credenciales, aislar endpoint o bloquear IP. Explica riesgos de NAT y de IOC obsoleto.
5. Define tratamiento fail-closed si faltan permisos, pairing, respuesta de app, contexto o confirmación humana.

## Resultado offline esperado

- I01 e I03 mantienen fecha `expires_at_utc` posterior al 16/10/2026, pero **son simulados, no maliciosos reales**.
- I02 caducó el 01/01/2025; no declarar match vigente.
- `alice` suma 75 puntos de ejercicio y necesita revisión, no respuesta automática.

## Entregable del alumno

Diagrama: finding → verificación de entidad → enriquecimiento read-only → validación de contexto → decisión → aprobación para medidas disruptivas → acción autorizada → auditoría y rollback. Si faltan garantías, **no actuar**.

Documentación de TI y limitaciones native/TIM Cloud [D12]; integración/pairing SOAR [D13/D14].
