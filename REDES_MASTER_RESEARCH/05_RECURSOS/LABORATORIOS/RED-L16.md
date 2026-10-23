# RED-L16 — Reglas de detección, normalización y respuesta SOC

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible reglas de detección, normalización y respuesta soc en un entorno docente controlado.

Módulos: RED-M30, RED-M31. Previos del diseño: RED-M22, RED-M26, RED-M27, RED-M29.

- Diseñar y evaluar una detección docente multiplataforma
- Proponer contención proporcionada, preservación y verificación

## Topología y preparación

Dataset multi-fuente → motor de reglas docentes → incidente de muestra; sin acceso real a SIEM

Direccionamiento del diseño: Orígenes de eventos 10.60.150.0/24; fechas UTC sintéticas sin direcciones externas reales

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: Python local, JSONL, matriz de reglas independiente SIEM. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Captura/evidencia sintética y diagrama revisables sin levantar servicios

## Tareas

- Definir campos de contrato + regla conceptual y casos de prueba
- Comparar dataset positivo, benigno y ambiguo
- Proponer contención y comprobar efecto en mesa; nunca aplicarla a producción

## Pruebas positivas

- Detecta variante positiva y justifica falsos positivos/negativos

## Controles negativos y fallos para ensayar

- Caso benigno no desencadena afirmación de incidente confirmado

- Parser descarta puerto
- Timezone desalineado
- Regla sobreajustada

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

Adaptación de la ficha RED-L16 de T5 conservada en investigación. Estimación original: 16 h, incluidas en el recorrido total, no medidas en una ejecución.
