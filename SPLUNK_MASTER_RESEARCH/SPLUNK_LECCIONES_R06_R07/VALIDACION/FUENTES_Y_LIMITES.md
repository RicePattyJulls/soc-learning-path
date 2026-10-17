# Fuentes y limitaciones — R06/R07

**Fecha de revisión documental:** 16 octubre 2026. URLs de producto oficiales. Son fuentes sobre comportamientos y contratos; no se comprobó versión/licencia de la instancia del usuario.

## Catálogo
- **D01:** Condiciones de alertas y resultados — https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.0/manage-alert-trigger-conditions-and-throttling/configure-alert-trigger-conditions
- **D02:** Throttle en alertas, distinto del umbral — https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.0/manage-alert-trigger-conditions-and-throttling/throttle-alerts
- **D03:** Retraso de indexación y campos _time/_indextime — https://help.splunk.com/en/data-management/monitor-data-onboarding/troubleshoot-splunk-enterprise/10.6/data-acquisition-problems/event-indexing-delay
- **D04:** Splunk Enterprise Security 8.7: detecciones — https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/use-detections-to-search-for-threats-in-splunk-enterprise-security
- **D05:** Splunk ES 8.7: análisis de riesgo RBA — https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/mission-control/analyze-risk-with-risk-based-alerting-in-splunk-enterprise-security
- **D06:** Windows: 4625 fallo de inicio de sesión — https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625
- **D07:** Windows: 4769 solicitud de ticket de servicio — https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769
- **D08:** MITRE ATT&CK T1558.003 Kerberoasting — https://attack.mitre.org/techniques/T1558/003/
- **D09:** MITRE DET0157 detección Kerberoasting — https://attack.mitre.org/detectionstrategies/DET0157/
- **D10:** Kerberos y RC4: cambios de auditoría Windows — https://www.microsoft.com/en-us/windows-server/blog/2025/12/03/beyond-rc4-for-windows-authentication/
- **D11:** Splunk ES 8.7: finding-based detections — https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/create-finding-based-detections-in-splunk-enterprise-security
- **D12:** Splunk ES 8.7: findings/analyst queue — https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/findings/monitor-your-security-operations-center-with-findings-in-splunk-enterprise-security
- **D13:** Splunk Security Content: solicitud de ticket Kerberos sospechosa (detección de otra técnica) — https://research.splunk.com/endpoint/8b1297bc-6204-11ec-b7c4-acde48001122/
- **D14:** Splunk: estadísticas stats, eventstats, streamstats — https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.0/calculate-statistics/use-the-stats-command-and-functions

## Verdad de las pruebas

- [DOC] guía oficial/documentación; [DISEÑO] ejercicios, hipótesis, preguntas, umbrales y escenarios creados para aprendizaje.
- [OFFLINE] Python lee CSV estáticos y verifica recuentos, IDs, ventanas, delay y resultados sintéticos. No evalúa ni ejecuta SPL real, no mide precisión real del detector.
- [NO PROBADO] consultas SPL de lectura ilustrativas; no hay evidencia sobre índices, sourcetypes, parser, DC audit, versiones, permisos ni SOAR/ES instalados.
- Los umbrales (>=5 cuentas/15m) no son recomendaciones de producción. El campo ServiceName de fixture equivale a nombre de servicio sintético y **no está verificado como SPN real**. La detectabilidad de Kerberoasting varía con cifrado, baseline y esquema Windows (2025+).
- RBA/finding groups sólo se describen con referencia ES 8.7; no asumir esas capacidades en Splunk Enterprise base.
- El ejercicio D13 sobre TGS de Splunk Security Content se refiere a otra condición de escalada, no se debe reutilizar como “regla Kerberoasting” ni atribuirle ese propósito.
- `earliest`/`latest` en ejemplos con fechas son interpretados según configuración y zona del search head, mientras las fixtures son UTC; deben verificarse antes de ejecutar.
- La calificación offline no equivale a certificación de preguntas, UX, React, rendimiento ni legitimidad de una investigación real.

## Enlaces internos a corpus original

Desde este archivo: `../../01_FUENTE_ORIGINAL/SC-200.md`; `../../03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json`; `../../02_INVESTIGACION/SPLUNK_MASTER_RESEARCH_FASE3_R04_R11.md`. Son referencias históricas de consulta; no se modifican con esta corrección editorial.

## Tareas restantes

Revisión técnica independiente de actividades; comprobar campos 4624,4625,4769,4662 en versión real y auditoría DC; prueba de sintaxis SPL en entorno no productivo autorizado; validación de datasets importados y zonas horarias; línea de base de falsos positivos; compatibilidad de ids/estado de progreso con app V2.5.
