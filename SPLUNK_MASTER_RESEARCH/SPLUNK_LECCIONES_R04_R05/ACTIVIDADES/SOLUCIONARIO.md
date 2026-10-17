# Solucionario editorial sincronizado — SPLUNK_LECCIONES_R04_R05

**Política educativa aprobada:** teoría autocorregible con umbral del 80 %; práctica abierta formativa, sin calificación automática ni premio de dominio práctico. Aprobar teoría no acredita dominio práctico de Splunk. La revisión humana independiente del contenido y la ejecución real siguen pendientes.

Respuestas orientativas; sin ejecución de Splunk/ES/SOAR.

## SP-R04-L01-Q01

**A — eventstats**. eventstats adjunta una métrica a filas originales. stats las transforma en filas agregadas.

## SP-R04-L01-Q02

**D — No equivale a contar todos los eventos; hay que inspeccionar nulos**. El número de eventos y la cardinalidad de un campo pueden divergir por valores ausentes.

## SP-R04-L01-P01

`stats count dc(user) BY src` resume; `eventstats count BY src` preserva filas. Con el filtro de fallos y la fixture: 203.0.113.9 tiene 9 fallos totales en todo el dataset (7 de 09:00 a 09:14 y 2 de 09:15 a 09:29); para 09:00 específicamente 7 fallos / 5 usuarios. Sin filtro, se incluyen éxitos en los totales.

## SP-R04-L02-Q01

**B — El conteo acumulado hasta cada fila, siguiendo el orden que recibe streamstats en ese pipeline**. El cálculo se emite progresivamente en el orden del pipeline.

## SP-R04-L02-Q02

**D — Verificar el orden temporal y la semántica de _time, y resolver empates con un criterio estable**. Sin orden temporal, el acumulado no responde a la hipótesis cronológica.

## SP-R04-L02-P01

La secuencia para 203.0.113.9 en el primer bucket es 1,2,3,4,5,6,7. Al sexto evento el acumulado es 6. El orden de entrada controla la respuesta.

## SP-R04-L03-Q01

**A — Agrupación en bloques temporales discretos**. bin asigna cada timestamp a un bloque; no realiza agregación por sí solo.

## SP-R04-L03-Q02

**B — Bins distintos con alineación estándar de 15m**. Cruzan la frontera de 09:15 pese a estar separados por dos segundos.

## SP-R04-L03-P01

Para la IP 203.0.113.9: bucket 09:00, 7 fallos y 5 usuarios; bucket 09:15, 2 fallos y 2 usuarios. Sólo 09:00 cumple `cuentas>=5`. Variación válida: ventanas solapadas/rolling con coste y semántica documentados.

## SP-R04-L04-Q01

**A — dc cuenta valores distintos presentes; count sin argumento cuenta los eventos recuperados del grupo**. La cardinalidad no equivale al volumen de eventos.

## SP-R04-L04-Q02

**C — Una discrepancia semántica de campos de fuentes diferentes**. Coalesce ayuda con valores faltantes pero no garantiza equivalencia de significado.

## SP-R04-L04-P01

En los datos completos: 9 fallos desde 203.0.113.9, 6 identidades distintas no vacías (alice,bob,carol,dave,erin,frank), 1 usuario vacío. En el primer bucket: 7 fallos, 5 identidades, 1 vacío. Evita mezclar ambos ámbitos.

## SP-R04-L05-Q01

**D — Agrupar con stats por la entidad común, si ambos tipos de eventos ya están en el flujo normalizado**. stats agrupa sin abrir una subbúsqueda.

## SP-R04-L05-Q02

**C — Correlación potencial que requiere análisis**. La asociación estadística no prueba causalidad ni atribución.

## SP-R04-L05-P01

La búsqueda de ejemplo usa `count(eval(...))` por user/src. Ambigüedades: IP NAT/VPN, identidad compartida, errores de reloj y eventos duplicados. Requiere comprobar orden de eventos y ventana de investigación.

## SP-R04-L06-Q01

**B — Un conjunto secundario incompleto puede reducir las coincidencias aunque la lógica aparente sea correcta**. Los límites pueden afectar al conjunto consultado y, por tanto, a la cobertura.

## SP-R04-L06-Q02

**A — Job Inspector**. Job Inspector permite analizar comportamiento y recursos de search jobs.

## SP-R04-L06-P01

Comprobar ventana/índices/roles, expansión/truncamiento de subsearch, número de filas, semántica de claves y Job Inspector (etapas/coste). Ensayar agregación con stats sobre los mismos datos; no reclamar mejora cuantitativa sin medir.

## SP-R04-L07-Q01

**C — Tres**. mvexpand crea una fila por valor del campo multivalor.

## SP-R04-L07-Q02

**B — Extrae campos al buscar**. rex realiza extracción en el pipeline, no reindexación.

## SP-R04-L07-P01

Un evento fuente genera dos filas tras expandir roles. Regex `user=(?<usuario_extraido>[^ ]+)` captura alice; si falta user no debe inventar identidad. Mantener un identificador original para comparar cardinalidad antes/después.

## SP-R04-L08-Q01

**D — Patrón sospechoso pendiente de contexto**. Los hechos permiten sospecha y solicitud de contexto, no atribución.

## SP-R04-L08-Q02

**C — SPL, fuente, ventana y condiciones**. Sin trazabilidad de consulta y fuentes no se puede revisar el resultado.

## SP-R04-L08-P01

Evidencia: 09:01–09:10 7 fallos, 5 usuarios distintos desde 203.0.113.9; éxito de alice 09:11. Interpretación: patrón compatible con spraying pero también NAT/prueba legítima. Pendientes: origen real, reputación/propiedad, baseline, resultado de autenticación en fuentes independientes, cobertura. No hay prueba de compromiso.

## SP-R05-L01-Q01

**B — Un nombre alternativo del campo en búsqueda; el alias no inventa su valor ni demuestra su significado**. Un alias no transforma los eventos almacenados ni demuestra semántica.

## SP-R05-L01-Q02

**A — Mantenerlo fuera de Authentication: el 4688 del ejercicio es creación de proceso, no inicio de sesión**. 4688 es creación de proceso; no cumple por sí mismo el propósito de Authentication.

## SP-R05-L01-P01

Windows 4624→success y 4625→failure cuando representan logon; Linux accepted→success y failed→failure si el mensaje realmente es de autenticación; 4688 no entra en Authentication. Los eventos sin IP quedan con src ausente y bandera de calidad.

## SP-R05-L02-Q01

**A — Contexto del activo que debe contrastarse con la vigencia y calidad del inventario, sin cierre automático**. Es una fuente auxiliar que necesita verificación.

## SP-R05-L02-Q02

**D — Evitar reemplazar campos de salida ya presentes en los eventos que se enriquecen mediante lookup**. OUTPUTNEW se usa para no reemplazar valores ya existentes en los campos de salida.

## SP-R05-L02-P01

No se cierra automáticamente: puede haber múltiples usuarios detrás. Registrar identidad del proxy, propietarios, zona horaria y logs del proxy si existen; cotejar con ventanas y conexiones individuales.

## SP-R05-L03-Q01

**C — Unificar significado de campos y datasets para búsquedas comparables, sin fabricar datos de la fuente**. El CIM define un esquema semántico consumible por búsquedas y modelos.

## SP-R05-L03-Q02

**D — source es metadato de origen del dato; src puede ser IP/host origen del evento**. Los nombres tienen significados distintos.

## SP-R05-L03-P01

Los eventos Windows 4624/4625 y Linux accepted/failed pueden entrar si hay mapeo y tags correctos; 4688 no es autenticación. El src vacío no se fabrica: queda como brecha observable de calidad.

## SP-R05-L04-Q01

**C — Una jerarquía de datasets y restricciones de búsqueda que determina qué eventos forman parte del modelo**. Los datasets y sus restricciones componen el modelo.

## SP-R05-L04-Q02

**A — Tags, constraints, campos y permisos**. La presencia en un índice no implica pertenencia automática al dataset.

## SP-R05-L04-P01

Causas posibles: tags ausentes, campo action incorrecto, permissions/app context, constraints adicionales, parsing de timestamps, índices/roles o fuentes fuera de periodo. Verificar antes de atribuir fallo al producto.

## SP-R05-L05-Q01

**A — Cobertura de datos y corrección semántica por fuente**. Los datos deben estar presentes y representar conceptos correctos.

## SP-R05-L05-Q02

**B — No: representa otro tipo de evento**. El tipo de evento define su inclusión; un nombre de campo no basta.

## SP-R05-L05-P01

El conjunto tiene 6 filas: cinco eventos etiquetados login (Windows dos éxitos/fallos + Linux accepted/failed + Windows sin IP), uno proceso 4688 excluido. De los cinco login, 4 tienen IP no vacía, 5 identidad, 5 acción reconocible. Estos valores se comprueban con Python; no garantizan compatibilidad real con CIM.

## SP-R05-L06-Q01

**B — Puede omitir datos no incluidos en summaries**. Ese modo limita el ámbito a resúmenes existentes.

## SP-R05-L06-Q02

**D — Campos indexados o datos de modelos acelerados según sintaxis**. tstats se apoya en estructuras de indexación y resúmenes del modelo.

## SP-R05-L06-P01

raw_count=19; summarized_count=12; faltan 7 del resumen. La simulación no permite inferir causa real de backfill ni rendimiento; sería incorrecto concluir que no existieron los 7 eventos.

## SP-R05-L07-Q01

**B — Compatibilidad real de fuentes/campos y caso de uso**. Sin un esquema fiable se acelera una representación potencialmente incorrecta.

## SP-R05-L07-Q02

**C — Semántica de pérdida de cobertura simulada**. La simulación valida cálculos conceptuales, no tiempos de Splunk.

## SP-R05-L07-P01

Primero auditar normalización y datos; luego establecer consultas de referencia y medir coste; sólo después valorar aceleración y su capacidad/ventanas; revisar impacto y regresiones bajo autorización. No afirmar ahorro de CPU sin métrica real.

