# LAB09-A — Del finding al grupo y al score de práctica

**Lecciones:** SP-R09-L01–L06. **Modo:** CSV de enseñanza; NO reproduce Risk data model ni algoritmos internos de ES 8.7.

## Datos

`fixtures/synthetic_es_findings.csv` contiene F01–F08 (8 registros) con entidad, categoría, tipo y puntos **inventados**. Ninguna fila fue generada por Splunk.

## Tareas

1. Distingue `finding` de `intermediate_finding` por el campo sintético `finding_type`.
2. Agrega por `entity`: número de hallazgos, categorías distintas y suma de `risk_points`.
3. Aplica un umbral editorial de 60 a **la suma del CSV**, no a ES. Explica por qué 75 no significa «75 % de compromiso».
4. Diseña agrupación por identidad canónica y período; señala el riesgo de unir usuarios por IP de NAT.
5. Dibuja el recorrido EVENT → event-based detection → (intermediate) finding → finding-based detection (con configuración ES) → analyst queue → investigación.

## SPL únicamente ilustrativo (lectura sobre índice hipotético)

```spl
index=IDX_FINDINGS_PRACTICA sourcetype=ST_SYNTH_FINDING
| stats sum(risk_points) AS puntos_ejercicio count AS hallazgos dc(category) AS categorias BY entity
| sort - puntos_ejercicio
```

No es el SPL prescrito por ES para finding-based detections: ver guía del Risk data model ES 8.7 [D09].

## Resultado esperado

| Entidad | Filas | Suma sintética |
|---|---:|---:|
| alice | 3 | 75 |
| svc-backup | 2 | 36 |
| bob | 1 | 22 |
| sys-rproxy | 1 | 20 |
| charlie | 1 | 15 |

Solo `alice` supera 60 en **este ejercicio**. El caso sigue indeterminado. ES 8.7 RBA [D10].
