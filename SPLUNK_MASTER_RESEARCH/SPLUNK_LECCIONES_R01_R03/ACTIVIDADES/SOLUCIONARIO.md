# Solucionario editorial sincronizado — SPLUNK_LECCIONES_R01_R03

**Política educativa aprobada:** teoría autocorregible con umbral del 80 %; práctica abierta formativa, sin calificación automática ni premio de dominio práctico. Aprobar teoría no acredita dominio práctico de Splunk. La revisión humana independiente del contenido y la ejecución real siguen pendientes.

Respuestas orientativas; sin ejecución de Splunk/ES/SOAR.

## SP-R01-L01-Q01

**D — Splunk Enterprise Security, con Mission Control y sus flujos SOC en versiones compatibles**. ES es la solución SecOps específica; la plataforma base no hereda automáticamente sus pantallas.

## SP-R01-L01-Q02

**B — Que esa telemetría está disponible si fue indexada; recibirla no demuestra prevención ni respuesta**. Recibir y buscar telemetría no equivale a ejecutar la prevención del EDR.

## SP-R01-L01-P01

Búsquedas: plataforma; correlación/experiencia de riesgo específica: valorar ES; aislamiento automatizado: integración explícita con EDR y posible SOAR, con permisos y aprobación. Ninguna función se da por incluida sin revisar contrato y versión.

## SP-R01-L02-Q01

**B — Los indexers almacenan los datos indexados y buscan en ellos; el search head coordina resultados**. Los indexers almacenan y buscan sus datos; el search head coordina.

## SP-R01-L02-Q02

**C — Sí, en despliegues apropiados**. Los roles son lógicos y pueden coexistir en una sola instancia.

## SP-R01-L02-P01

Evento: Windows → entrada/forwarder → parser → indexer; consulta: analista → interfaz/search head → indexer → resultados. En una instancia única varias etapas comparten host.

## SP-R01-L03-Q01

**B — Universal Forwarder**. UF no indexa localmente ni ejecuta SPL.

## SP-R01-L03-Q02

**A — Cuando el flujo requiere parsing o routing intermedio; HF aporta esa capacidad sin ser obligatorio**. HF admite transformaciones y rutas más avanzadas; no es obligatorio.

## SP-R01-L03-P01

UF en servidores; syslog por una entrada autorizada/relay; indexer central y search head según escala. HF opcional para parsing/routing; añade mantenimiento y recursos.

## SP-R01-L04-Q01

**A — _time**. _time se usa habitualmente en búsquedas temporales.

## SP-R01-L04-Q02

**D — Retraso o timestamp erróneo**. La diferencia sugiere revisar origen, parsing y latencia, no una conclusión única.

## SP-R01-L04-P01

Si `_time` se asignó fuera de la ventana, el filtro temporal lo excluye; investigar fuente del timestamp, zona, parsing y filtros de índice.

## SP-R01-L05-Q01

**A — Índice, fuente, tiempo y semántica de resultado**. Sin cobertura y definición del campo de resultado los conteos no son interpretables.

## SP-R01-L05-Q02

**C — Conteo de eventos recuperados agrupados por sourcetype**. La estadística resume eventos devueltos, no su naturaleza maliciosa.

## SP-R01-L05-P01

Pregunta operativa: para servicios e identidades identificados, ¿cuántos intentos fallidos hubo por IP/usuario en la ventana verificada, comparado con su baseline? Primero localizar cobertura y esquema.

## SP-R02-L01-Q01

**C — HTTP Event Collector, como entrada HTTP(S) autenticada para eventos enviados por la aplicación**. HEC es una entrada HTTP autenticada, no lenguaje de búsqueda.

## SP-R02-L01-Q02

**A — Que parsing y sourcetype representan la fuente**. Llegada, clasificación y extracción son comprobaciones independientes.

## SP-R02-L01-P01

Windows→UF/input de eventos (permisos/canales); JSON→HEC (token/TLS); syslog→receiver/relay (pérdida de UDP, timestamps y normalización según diseño).

## SP-R02-L02-Q01

**C — No, depende del input/TA/formato**. El campo observado depende del origen y las extracciones.

## SP-R02-L02-Q02

**D — No hay cobertura suficiente para concluir sin más comprobaciones**. Puede faltar auditoría, ruta, campo o ventana de tiempo.

## SP-R02-L02-P01

Partir de inventario de canales y orígenes, índice/sourcetype reales, ventana y muestra; mapear esquema y distinguir ausencia de eventos de ausencia de extracción.

## SP-R02-L03-Q01

**C — Autenticar el envío al receptor HEC con el ámbito de índices configurado; no autoriza búsquedas**. Token HEC pertenece a la recepción de eventos; no a la cuenta de búsqueda.

## SP-R02-L03-Q02

**A — No: falta comprobar indexación, tiempo y campos en la población que utilizará el informe SOC**. La evidencia end-to-end requiere hallar el evento, campos y tiempo esperados.

## SP-R02-L03-P01

Usar endpoint autorizado con TLS validado y token restringido, payload sintético, respuesta controlada y búsqueda posterior con índice/tiempo/sourcetype confirmados; registrar errores sin exponer token.

## SP-R02-L04-Q01

**D — outputs.conf**. outputs.conf define forwarding y grupos de destino.

## SP-R02-L04-Q02

**B — No, no reescribe automáticamente metadatos históricos**. Cambios index-time afectan nuevos datos procesados; soluciones históricas requieren tratamiento específico.

## SP-R02-L04-P01

HF puede ser primer parser; revisar parámetros aplicables allí y efectuar prueba autorizada con evento nuevo. No cambiar datos históricos ni tocar servicios sin permiso.

## SP-R02-L05-Q01

**A — Un desfase que requiere comprobar colas y timestamps**. Puede reflejar demora real o errores de tiempo; no permite causalidad directa.

## SP-R02-L05-Q02

**B — Porque usa `_time` de evento normalmente**. La búsqueda temporal estándar filtra por tiempo de evento.

## SP-R02-L05-P01

Puede haber retraso de envío/cola, reloj de origen mal configurado o parsing/timezone incorrecto. Contrastar raw timestamp y logs del pipeline.

## SP-R02-L06-Q01

**D — Distinguir eventos ausentes de problemas de extracción o selección: un panel vacío no separa esas causas**. Puede haber ingestión correcta y una extracción de campo incompleta.

## SP-R02-L06-Q02

**B — Diseñar checklist y consultas de lectura sobre datos permitidos**. Las verificaciones de lectura y el diseño de pruebas no destructivas son el punto de partida.

## SP-R02-L06-P01

Índice vacío: fuente/transporte/recepción/permisos/ventana. Campos vacíos: parsing, sourcetype, TA, extracción. Desfase: relojes, zona, timestamps, colas.

## SP-R03-L01-Q01

**D — Seleccionar un índice y un rango temporal conocidos antes de aplicar transformaciones costosas**. Acotar datos hace la búsqueda más eficiente y reproducible.

## SP-R03-L01-Q02

**C — El tiempo de evento _time; no se sustituye por _indextime porque el evento se reciba ahora**. Los modificadores de tiempo estándar se basan en hora de evento.

## SP-R03-L01-P01

`index=INDICE_CONFIRMADO earliest=-1h | stats count by host` después de sustituir el índice por su valor observado.

## SP-R03-L02-Q01

**B — Después de stats: primero se calcula la columna fallos y luego se aplica el umbral sobre ella**. La columna agregada no existe antes de ejecutar stats.

## SP-R03-L02-Q02

**A — Verificar índice, sourcetype y campos de evento**. Los esquemas no se traducen automáticamente.

## SP-R03-L02-P01

Primero seleccionar solo eventos relevantes (si se confirma action), después `stats count AS fallos by user`, al final `where fallos>5`. Aclara si el umbral significa >5 o ≥5.

## SP-R03-L03-Q01

**C — Inspeccionar los campos y su cobertura en los resultados observados, sin garantizar eventos futuros**. Describe presencia y características de campos en el conjunto de resultados.

## SP-R03-L03-Q02

**D — Puede eliminar el campo requerido**. La eliminación de un campo puede impedir pasos posteriores.

## SP-R03-L03-P01

Acotar índice/sourcetype/tiempo, inspeccionar muestras y fieldsummary, distinguir `src_ip` de `src` y documentar población/nulos.

## SP-R03-L04-Q01

**B — No: eval calcula valores del pipeline de búsqueda y no reescribe el evento guardado en el índice**. Un campo calculado en búsqueda no reescribe el evento indexado.

## SP-R03-L04-Q02

**D — Posible desfase/reloj/time parsing o tiempo futuro**. Una demora negativa requiere revisar supuestos temporales; no basta descartarla.

## SP-R03-L04-P01

`| eval demora_min=(_indextime-_time)/60` y explicar que es una métrica aproximada dependiente del timestamp.

## SP-R03-L05-Q01

**B — La cantidad de valores distintos observados en user; no cuenta cada repetición del mismo usuario**. dc trabaja sobre cardinalidad de valores del campo.

## SP-R03-L05-Q02

**C — Un resultado agregado por cada src observado**. stats transforma el conjunto en filas agregadas por agrupador.

## SP-R03-L05-P01

count=6, dc(user)=5 si la extracción y los filtros son fiables. NAT, pruebas autorizadas o errores de campo son hipótesis alternativas; buscar baseline y éxitos posteriores.

## SP-R03-L06-Q01

**A — Asignar _time a bloques discretos de quince minutos; el conteo y la agrupación se hacen después**. Discretiza la columna _time de la búsqueda para agrupar.

## SP-R03-L06-Q02

**D — Para retener IP y ventana en cada agregado**. Cada fila representa un origen dentro de un bucket temporal.

## SP-R03-L06-P01

El total diario puede superar el umbral, pero `dc(user)` por ventana de 15 min da 3 y 3. No se debe concluir spray por esa regla concreta.

## SP-R03-L07-Q01

**C — Sospecha que requiere contexto**. Un patrón estadístico es indicio, no atribución ni prueba de éxito.

## SP-R03-L07-Q02

**A — Cuando faltan campos o cobertura esencial**. Sin evidencia suficiente no se puede clasificar con garantías.

## SP-R03-L07-P01

Para 203.0.113.9 a las 09:00: seis fallos, cinco identidades, 15 min. Hipótesis de spraying; comprobar NAT/VPN, baseline y éxitos. Sin evidencias de acceso correcto no se afirma compromiso.

