# Soluciones — RED-M30-L04

Material de revisión: consultar después de resolver.

## Práctica individual

TP=10, FN=10 y FNR=50% sobre 20 positivos reales. La falta de telemetría puede reducir cobertura aunque la lógica no cambie.

### Criterios observables

- Recalcula TP=10 y FN=10 al perder cinco detecciones positivas.
- Obtiene FNR=10/20=50% y relaciona la pérdida de telemetría con cobertura.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: B. Todos los benignos reales evaluados**

FPR = FP/(FP+TN): todos los benignos evaluados, no todas las alertas ni los positivos reales.

## Pregunta 2

**Respuesta: C. 60 %**

Precisión = TP/(TP+FP) = 15/25 = 60%; 10% es FPR y 25% es FNR.

## Referencias

- **CIM**: [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model). Modelo y normalización; etiqueta no demuestra conformidad.
- **DCR**: [Data collection rules in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview). Recolección y transformación; DCR no se equipara a un modelo CIM.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
