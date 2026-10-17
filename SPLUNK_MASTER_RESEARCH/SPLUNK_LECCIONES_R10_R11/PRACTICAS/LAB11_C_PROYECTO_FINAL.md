# LAB11-C — Proyecto SOC Splunk de extremo a extremo

**Asociación curricular:** R11-L07. **Estado:** práctica offline, no ejecutada en producto.

**Datos identificados:** `../../SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/auth_activity.csv` y `../../SPLUNK_LECCIONES_R06_R07/PRACTICAS/fixtures/authorized_context.csv`, más los seis CSV de este paquete para administración/API/aprobaciones. Las rutas anteriores son relativas a PRACTICAS. No se usa el auth_activity.csv homónimo de R08–R09. Cada dataset conserva su escenario; compartir una IP entre archivos no demuestra una relación de ejecución.

**Salida de autenticación esperada:** eventos UTC del 15/10/2026 [09:00,09:15), snapshot posterior a 09:24: 198.51.100.23=7/6, svc-batch/203.0.113.15=5/1, proxy/192.0.2.44=4/3. La regla >=5 fallos y >=5 usuarios selecciona solo .23 como candidata no confirmada. En snapshot anterior a 09:16 es 6/6. Mantenimiento tiene contexto benigno; proxy no tiene verdad de benignidad. No inventar TP/FN de ataque.

**Objetivo:** demostrar que puedes diseñar un mini-SOC reproducible sin usar una cuenta de administrador ni ejecutar respuesta real.

Entregables del alumno: (1) mapa de fuentes y campos, (2) roles y permisos, (3) SPL de lectura con index+ventana, (4) tabla de cobertura, (5) caso sospechoso y control benigno, (6) criterio de alerta y triage, (7) contrato de aprobación/rollback, (8) pruebas negativas de permisos y (9) plan de ejecución futura en un sandbox autorizado.

**Rúbrica 0–10:** 1 punto por cada elemento 1–8; 2 puntos por un protocolo de validación que diferencia documentos/fixtures/Splunk real y añade responsables, limitación de datos y seguridad.

**Solución orientativa:** fuente auth sintética → búsqueda ventana acotada (no hay índice real) → señal por usuario/IP → comprobar NAT y service accounts → aviso mínimo → triage → aprobación explícita para una futura acción con asset/target concretos → observabilidad y rollback. Si no hay Splunk/ES/SOAR licenciado, mantener el paso como diseño conceptual.

**Seguridad:** ningún paso aplica cambios en Splunk/REST/SOAR/firewall/AD. Los valores son materiales pedagógicos, no evidencia de producción.
