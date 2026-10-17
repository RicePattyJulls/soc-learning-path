# LAB07-B — Peer review de detección 4769/TGS sin ataques

**Vinculación:** SP-R07-L03,L04,L05,L06,L08 · **Duración:** 60–90 min · **Sin ejecutar ataques ni tocar DC**.

## Contexto y cuidado
El CSV simula 4769 de un DC con **campos estandarizados solo para esta práctica**. Un `ServiceName` en Windows **no siempre representa un SPN íntegro** ni sigue el formato de esta fixture. Windows Server actualizado puede exponer formatos/campos de auditoría distintos. Validar con el evento original del KDC y las extracciones reales antes de adaptar una regla. RBA/finding groups son producto **Splunk Enterprise Security**, no por defecto en Splunk Enterprise.

## Actividades
1. Para cada user/src agrupa `count`, `dc(ServiceName)` y `TicketEncryptionType`.
2. Evalúa detector ingenuo A: "cualquier 0x17 = Kerberoasting" y especifica al menos un falso positivo.
3. Evalúa detector ingenuo B: `count>=5` y explica por qué detecta el backup legítimo.
4. Diseña candidato C: `count>=5 AND dc(ServiceName)>=5`, documenta qué gana y qué pierde.
5. Examina `app-admin` con AES 0x12 en varios servicios: no lo declares benigno ni malicioso sin contexto; un filtro 0x17 ni siquiera lo revisaría.
6. Analiza K016 sin cifrado: salida "esquema incompleto", no marcar falsedad por no coincidir.
7. Haz peer review de cobertura, falso positivo/falso negativo potencial, fuentes complementarias y grado de evidencia, sin ejecutar ataques.

## SPL ilustrativo: base Splunk, lectura
```spl
index=IDX_WINDOWS sourcetype=ST_WINSEC EventCode=4769
| bin _time span=15m
| stats count AS tgs dc(ServiceName) AS servicios values(TicketEncryptionType) AS etypes BY user src _time
| where tgs>=5 AND servicios>=5
```

## Solución de referencia
K001–K006: `audit-user`, 6 TGS / 6 servicios distintos, RC4 0x17 → candidato compatible con actividad de riesgo, **no confirmado**. K007–K011: `svc-backup`, 5 TGS / 1 servicio RC4, contexto CHG-TEST-108 → negativo documentado en fixture (aun requiere validación real). K012–K015: `app-admin`, 4 TGS / 4 servicios AES 0x12 → inconcluso, no clasificar como FN probado. K016: campo TicketEncryptionType vacío, calidad insuficiente para detector basado en cifrado.

## Criterios de aceptación
Calcular tres cohortes exactas, explicar FP backup, explicar posibles FN, separar `ServiceName` de SPN real, identificar al menos dos comprobaciones faltantes, no atribuir cracking ni ataque confirmado.

## Fuentes
MITRE T1558.003 y DET0157; Microsoft 4769 y actualizaciones de auditoría; Splunk Enterprise Security 8.7 documentación de findings.
