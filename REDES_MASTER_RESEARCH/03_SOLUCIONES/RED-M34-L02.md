# Soluciones — RED-M34-L02

Material de revisión: consultar después de resolver.

## Práctica individual

Encaminar por el punto previsto y verificar trazas/contadores, servicio permitido y flujo denegado; comprobar que el camino alternativo no siga abierto.

### Criterios observables

- Verifica encaminamiento por el control previsto.
- Repite flujo permitido y denegado y comprueba que se cierre el camino alternativo.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. El punto de enforcement y camino efectivos**

El mismo resultado puede venir de controles diferentes; camino y enforcement localizan qué se comprobó.

## Pregunta 2

**Respuesta: A. Un camino que evita el firewall previsto**

La ruta usa otro gateway: el flujo evita el firewall y no demuestra que su regla lo permitiera.

## Referencias

- **NIST-TEST**: [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final). Planificación, alcance, evaluación y reporte de pruebas técnicas.
- **NIST-ZT**: [SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final). Decisiones por recurso, identidad y contexto; no confianza automática por ubicación.
