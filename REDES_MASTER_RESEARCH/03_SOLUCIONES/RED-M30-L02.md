# Soluciones — RED-M30-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Declarar puerto desconocido y limitación de esa fuente; no rellenar un valor supuesto. La representación canónica debe admitir cobertura parcial.

### Criterios observables

- Declara puerto origen desconocido.
- Documenta cobertura parcial sin rellenar valores supuestos.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: A. Una política de recolección o transformación de datos en su contexto**

DCR configura recolección o transformación en Azure; CIM es un modelo y CEF un formato, no sinónimos.

## Pregunta 2

**Respuesta: D. Validación del mapeo y de la semántica de campos**

Recibir CEF no acredita conformidad CIM: hace falta validar campos y significado del mapeo.

## Referencias

- **CIM**: [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model). Modelo y normalización; etiqueta no demuestra conformidad.
- **DCR**: [Data collection rules in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview). Recolección y transformación; DCR no se equipara a un modelo CIM.
- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
