# LAB08-B — DCSync: evidencia y condiciones de observabilidad

**Lecciones:** SP-R08-L01/L03/L07. **Modo:** dataset sintético y análisis de solo lectura. **No ejecutar herramientas de DCSync ni cambios de auditoría.**

## Contrato

`fixtures/replication_events.csv` contiene ocho filas D01–D08. `operation_kind=replication_right` es **una etiqueta pedagógica inventada**, no un campo Windows ni prueba de GUID/permiso. `authorization_context` es información externa aportada al caso.

## Tareas

1. Identifica los registros aprobados de DC01↔DC02 (D01–D03), la delegación aprobada de backup (D04–D05) y el origen no inventariado WKST-17 (D06–D08).
2. Explica por qué un 4662 genérico no demuestra extracción de secretos y de qué dependen auditoría, SACL y derechos.
3. Diseña un control de inventario para distinguir DC y delegaciones; no asumas que `subject=DC01$` basta sin validar identidad técnica.
4. Especifica qué información faltaría: operación en GUID real, auditoría de dominio, actividad RPC/replicación, mapeo principal y trazas de cambios de permisos.
5. Presenta hipótesis principal, hipótesis benigna y estado «indeterminado/candidato a escalado».

## SPL descriptivo, no listo para Windows real

```spl
index=IDX_WINDOWS sourcetype=ST_WINSEC EventCode=4662
| search operation_kind="replication_right"
| stats count AS operaciones values(object_name) AS objetos BY subject src dc
```

**`operation_kind` no es propiedad 4662 nativa**: reemplazar por lógica de campos/GUID verificados antes de cualquier búsqueda real. No hay consultas ejecutadas.

## Control offline esperado

- 8 operaciones sintéticas en total.
- 5 bajo autorización descrita por el fixture (3 DC y 2 servicio delegado).
- 3 registros D06–D08 desde WKST-17 no inventariado.

**Conclusión defendible:** anomalía de origen a investigar, NO DCSync confirmado. MITRE [D02] y auditoría Windows [D05].
