# Soluciones — RED-M30-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Inventa una decisión que la fuente no emitió. Mantener desconocido/null y registrar cobertura del campo; no contar esa fila como permiso confirmado.

### Criterios observables

- Mantiene action desconocido/null.
- Registra cobertura y evita contar la ausencia como permiso confirmado.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Significado, unidad, origen y transformación**

Un nombre común solo ayuda si conserva semántica, unidades, origen y transformación de los datos.

## Pregunta 2

**Respuesta: C. Confunde total con un sentido del tráfico**

bytes_total no significa bytes_out; igual valor numérico no hace equivalentes ambas medidas.

## Referencias

- **CIM**: [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model). Modelo y normalización; etiqueta no demuestra conformidad.
- **DCR**: [Data collection rules in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview). Recolección y transformación; DCR no se equipara a un modelo CIM.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
