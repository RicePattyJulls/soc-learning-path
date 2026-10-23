# RED-L20 — Misión final Purple: actividad autorizada, SOC y retest

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible misión final purple: actividad autorizada, soc y retest en un entorno docente controlado.

Módulos: RED-M30, RED-M31, RED-M35, RED-M41, RED-M42. Previos del diseño: RED-M22, RED-M26, RED-M27, RED-M29, RED-M34, RED-M40.

- Diseñar y evaluar una detección docente multiplataforma
- Proponer contención proporcionada, preservación y verificación
- Coordinar ensayo controlado, investigación SOC y corrección
- Unir actividad autorizada, observación, investigación y corrección
- Defender decisiones ante revisión y mostrar retención de competencias

## Topología y preparación

Zona usuarios → firewall → zona servidor; generador de tráfico + sensor PCAP/EVE + colector; entorno aislado, módulos en turnos

Direccionamiento del diseño: Usuarios 10.60.200.0/24; servidor 10.60.201.0/24; gestión/sensor 10.60.209.0/24

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Zeek/Suricata offline, nftables, FRR/Linux, dataset sintético de entrenamiento. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Red Team propone ROE y genera sólo actividad controlada con archivos ficticios
- SOC registra alerta y hipótesis alternativas, crea cronología y alcance
- Equipo diseña contención, ejecuta solo en entorno autorizado, valida revertibilidad y repite prueba
- Defensa final incluye demostración, diferencia pre/post y límites de prueba

## Pruebas positivas

- Flujo autorizado genera evidencia y detector positivo documentado

## Controles negativos y fallos para ensayar

- Tráfico benigno o prueba bloqueada no se sobredimensionan; regla no debe marcar ambos por defecto

- Pérdida de visibilidad
- Alerta falsa
- Rollback falla (se evalúa plan, no se expone sistema externo)

## Evidencias y evaluación

- Topología numerada y tabla de interfaces/direcciones
- Configuración inicial/final o captura de resultados y comandos usados
- Resultado de prueba positiva y control negativo
- Diagnóstico causal más limitaciones y evidencia contradictoria
- Manifest de versiones, UTC, hashes SHA-256 de ficheros y rúbrica

Todas las pruebas positivas pasan, el control negativo confirma el límite previsto, y el estudiante explica el mecanismo y el origen de los datos; ninguna infracción del aislamiento.

No presentar como ejecución real la resolución de una ficha documental. Evaluar dominio práctico solo con observaciones de la práctica correspondiente y revisión adecuada.

## Restauración

Guardar artefactos y checksum; restaurar snapshot/config inicial; eliminar identidades/tokens de prueba y sesiones/recursos temporales; comprobar ausencia de conexiones hacia LAN externo.

## Referencias

- [Overview of the Splunk Common Information Model](https://help.splunk.com/en/data-management/common-information-model/6.4/introduction/overview-of-the-splunk-common-information-model)
- [Data collection rules in Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/data-collection-rule-overview)
- [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)

## Procedencia

Adaptación de la ficha RED-L20 de T5 conservada en investigación. Estimación original: 26 h, incluidas en el recorrido total, no medidas en una ejecución.
