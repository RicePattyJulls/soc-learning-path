# Fuentes verificables y limitaciones — R08/R09

**Fecha de revisión documental: 16 de octubre de 2026.** Las URLs corresponden a referencias de Microsoft, MITRE ATT&CK y Splunk Help. Para ES se priorizó **8.7**; no está probada su disponibilidad en tu entorno. 

- **D01 — MITRE ATT&CK — Kerberoasting (T1558.003):** https://attack.mitre.org/techniques/T1558/003/
- **D02 — MITRE ATT&CK — DCSync (T1003.006):** https://attack.mitre.org/techniques/T1003/006/
- **D03 — MITRE ATT&CK — Password Spraying (T1110.003):** https://attack.mitre.org/techniques/T1110/003/
- **D04 — MITRE ATT&CK — Remote Services (T1021):** https://attack.mitre.org/techniques/T1021/
- **D05 — Windows — Audit Directory Service Access (4662 y SACL):** https://learn.microsoft.com/windows/security/threat-protection/auditing/audit-directory-service-access
- **D06 — Windows Security Event 4769:** https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769
- **D07 — Splunk ES 8.7 — Use detections to search for threats:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/use-detections-to-search-for-threats-in-splunk-enterprise-security
- **D08 — Splunk ES 8.7 — Create event-based detections:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/create-event-based-detections-in-splunk-enterprise-security
- **D09 — Splunk ES 8.7 — Guidelines for finding-based detections:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/guidelines-to-create-a-custom-finding-based-detection
- **D10 — Splunk ES 8.7 — Risk scoring:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/risk-based-alerting/risk-scoring-in-splunk-enterprise-security
- **D11 — Splunk ES 8.7 — Overview of Mission Control:** https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/mission-control/overview-of-mission-control-in-splunk-enterprise-security
- **D12 — Splunk ES 8.7 — Threat intelligence overview:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/threat-intelligence/overview-of-threat-intelligence-in-splunk-enterprise-security
- **D13 — Splunk ES 8.7 — Pair Splunk with SOAR:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/configuration-and-settings/pair-splunk-enterprise-security-with-splunk-soar
- **D14 — Splunk ES 8.7 — Configure SOAR apps:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/automation-with-playbooks/configure-splunk-soar-apps-in-splunk-enterprise-security
- **D15 — Splunk ES 8.7 — Tune detections:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/tune-detections-in-splunk-enterprise-security
- **D16 — Splunk ES 8.7 — Customize finding-group display:** https://help.splunk.com/en/splunk-enterprise-security-8/administer/8.7/detections/specify-the-display-of-finding-groups-in-the-analyst-queue-of-splunk-enterprise-security

## Grados de evidencia

- **LOOKUP:** https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.2/search-commands/lookup — nombres de campos de tabla, AS y OUTPUT/OUTPUTNEW; consultado 16/10/2026 para R09-L07. El lookup del ejercicio no está instalado.

- **[DOC]:** afirmación contrastable en documentación externa; URL incluida. No equivale a prueba del producto.
- **[DISEÑO]:** propuesta de ejercicios, umbrales, matrices y runbooks; no es política productiva.
- **[OFFLINE]:** cálculo determinista comprobado por Python con CSV fabricados, sin motor SPL ni búsqueda indexada.
- **[NO PROBADO]:** los fragmentos SPL no se ejecutaron en Splunk; no se ha comprobado sintaxis ni campos en ninguna instancia.

## Cuestiones de precisión decisivas

1. `ServiceName` del evento 4769 no es necesariamente un SPN completo. La columna `service` del CSV no representa automáticamente el campo de evento real. Kerberoasting no queda confirmado por RC4, ni excluido por AES.
2. Los eventos 4662 requieren condiciones de auditoría y SACL; el CSV aporta `operation_kind` inventado como abstracción, **no un parser de `Properties`/GUID de AD**. DCSync no queda probado por 4662 aislado ni descartado por su ausencia.
3. La investigación de spraying depende de la fuente; 4625 no cubre todos los protocolos ni identidades. IP detrás de NAT no atribuye actor único.
4. Risk-Based Alerting de ES 8.7 utiliza configuración/modelo específico. `sum(risk_points)` sobre CSV es solo aritmética educativa: NO reproduce `entity risk score` interno ni scoring real.
5. Las event-based detections y finding-based detections son funciones de ES con requisitos por versión. Una saved search de la plataforma base no produce automáticamente objetos ES ni Mission Control.
6. ES 8.7 diferencia Threat Intelligence nativa y TIM Cloud; la pestaña Intelligence tiene requisitos de configuración específicos.
7. SOAR requiere producto, permisos, conectores y pairing. No se ha implementado ni ejecutado ninguna acción; propuestas disruptivas tienen puerta humana explícita.
8. Direcciones IP RFC 5737 y todos los datos de los CSV son **sintéticos**. La fecha es UTC, mientras `_time` de Splunk exige extracción/mapeo real.

## Próximos pasos antes de React

- Revisión humana independiente del contenido y de opciones de preguntas.
- Comprobación de licencia/versión/permisos de Splunk y ES, índice/sourcetype, field aliases y timezone en laboratorio autorizado.
- Prueba de SPL en sandbox de lectura con datos ingestados y aprobación; comparación con cálculos Python; pruebas de falsos positivos/negativos.
- Auditoría del contrato actual de contenidos/XP/progreso e identificadores en la academia 0.2.5; este ZIP es **editorial**, no un plugin compatible automáticamente.
