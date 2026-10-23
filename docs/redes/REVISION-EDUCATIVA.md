# Redes: revisión educativa completada

18/10/2026. Revisión realizada por Codex sobre su propia redacción. Versión editorial: `1.1-author-reviewed`.

**Actualización posterior:** el contenido ya se ha integrado en la aplicación local; véase [INTEGRACION-LOCAL.md](INTEGRACION-LOCAL.md). Este informe conserva el alcance y resultados de la revisión educativa previa.

## Alcance revisado

Se leyó el contenido de las **168 lecciones**, en sus **8 etapas y 42 módulos**: objetivo, explicación, caso, práctica, respuesta de referencia y dos preguntas. Se contrastó la coherencia entre esos elementos y el orden de los conceptos. Los prerrequisitos declarados conservan el recorrido arquitectónico; ahora tienen enlaces y todos remiten a lecciones anteriores.

La evidencia de esta revisión es la intervención editorial registrada, no el número de comprobaciones automáticas. El [registro por lección](../../REDES_MASTER_RESEARCH/VALIDACION/REVISION-EDUCATIVA.json) identifica objetivo, prerrequisitos, huella de la versión revisada, preguntas y criterios de práctica. El material de revisión se conserva en [review.mjs](../../scripts/redes-editorial/review.mjs), con 168 filas redactadas expresamente.

## Correcciones realizadas

| Aspecto | Resultado |
| --- | --- |
| Preguntas | **45 corregidas**: 36 conjuntos de distractores ajenos al concepto y 9 ajustes de ambigüedad, alcance o precisión |
| Explicaciones | **336 justificaciones específicas**, en lugar de repetir toda la explicación de la lección después de cada respuesta |
| Prácticas | **168 rúbricas** con dos resultados observables propios de cada actividad y un criterio de límites |
| Vocabulario | **119 entradas de apoyo por módulo**, incluidas en las lecciones y en un glosario consultable |
| Secuencia | Prerrequisitos enlazados y comprobados; aviso de que las guías integradoras pueden requerir otros módulos |
| Casos | **3 casos precisados**: filtros DNS, resultado de ticket Kerberos y alcance de la evidencia Empresa-Lab |

Las rúbricas con resultados y valores esperados permanecen en el banco editorial y en los solucionarios. Las lecciones del estudiante conservan el enunciado de práctica sin añadirle la respuesta de referencia. La evaluación sigue separada de sus claves.

### Cambios que afectan a la interpretación

- **RED-M05-L01:** el filtro TCP/443 excluye el DNS convencional UDP/TCP 53 definido en el escenario. Se explica que DNS cifrado puede usar otros transportes, evitando generalizar la exclusión a toda resolución. Referencia añadida: [RFC 8484](https://www.rfc-editor.org/rfc/rfc8484.html).
- **RED-M28-L03:** se declara `Status=0x0` para respaldar la emisión del ticket del caso. El ID 4769 aislado también puede corresponder a un fallo; emitir un ticket no demuestra acceso al recurso. Contraste: [documentación de Microsoft sobre 4769](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4769).
- **RED-M41-L03:** se retira la respuesta de servicio que no figuraba en el fixture común. La conclusión se limita al permiso del firewall contrario a la política; conexión efectiva y autenticación no quedan demostradas.
- Las preguntas sobre ruta de ida, pertenencia a una VLAN, SSID y cierre de recuperación se reformulan para evitar que varias opciones puedan defenderse con una lectura razonable.
- Se añade documentación primaria para CoPP y sus límites por plataforma: [Cisco IOS XE 17.x](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/qos/b-quality-of-service/m_qos-plcshp-ctrl-pln-plc-0.html). El registro pasa de 75 a **77 referencias**.

## Comprobaciones ejecutadas después de corregir

```sh
node scripts/check-redes-lessons.mjs
python3 -B scripts/check-redes-numerical.py
```

- **5.142/5.142 comprobaciones** de inventario, procedencia, reconstrucción Markdown, dependencias, enlaces, preguntas, rúbricas, claves, anclas y contratos de entrega de la revisión.
- **16/16 comprobaciones numéricas independientes**, incluidos direccionamiento, MSS, tasas, métricas y casos integradores.
- La investigación original y los catálogos Sentinel/SC-200 y Splunk conservan sus huellas de referencia.

Informes: [validación de contenido](VALIDACION-CONTENIDO.json) y [validación numérica](VALIDACION-NUMERICA.json). Las comprobaciones estructurales no calculan una nota de calidad educativa ni sustituyen la lectura realizada.

## Estado para continuar

La **revisión educativa del autor está terminada**, y esta versión del contenido queda preparada para la siguiente fase de integración en la **web local**. El estado de revisión independiente permanece separado: no se ha atribuido a otra persona una revisión que hizo el propio autor.

Las prácticas son análisis documentales y las 20 guías conservan estado de diseño sin ejecución. Esta revisión no mide aprendizaje con estudiantes, no valida técnicamente los laboratorios ni acredita equivalencia con una certificación Cisco. Las 52 adendas conservan su trazabilidad, sin convertir su asociación a módulos en un cierre técnico automático.

No se cambiaron interfaz, progreso ni despliegue. Las pruebas npm/build/navegador corresponden a la posterior implementación local; en esta fase se comprobaron los artefactos educativos.

## Conservación

Antes de modificar se guardaron **402 archivos**, con inventario SHA-256, en `output/redes-educational-review/20261018-171429/`. Incluyen el paquete previo, fuentes de autoría, generador, verificador y documentación de Redes.

La regeneración incorpora las correcciones desde `scripts/redes-editorial/review.mjs`; no depende de parches manuales a los Markdown generados. `--replace` sigue siendo una opción explícita para sobrescribir diferencias revisadas.
