# RED-L07 — BGP, filtros, políticas y redistribución segura

**Guía de diseño de laboratorio: no ejecutada ni técnicamente validada.**

## Objetivo y previos

Demostrar de forma reproducible bgp, filtros, políticas y redistribución segura en un entorno docente controlado.

Módulos: RED-M14, RED-M15. Previos del diseño: RED-M12, RED-M13.

- Justificar selección de rutas y aplicar filtros BGP en dos AS simulados
- Evitar bucles y fugas mediante redistribución y separación de planos

## Topología y preparación

AS65010 R1—AS65020 R2—AS65030 R3; prefix origination en R1, consumidor R3

Direccionamiento del diseño: Tránsitos 10.60.60.0/30 y 10.60.60.4/30; prefijo anunciado 10.60.61.0/24; anuncio no permitido 10.60.62.0/24

Registrar host/hipervisor, versiones exactas e imágenes/sha256 autorizadas; respaldar configuraciones, plan de direccionamiento y prueba de aislamiento; no distribuir credenciales reales.

Namespaces/redes virtuales sin bridge al LAN real, sin salida a Internet por defecto; dirección 10.60.0.0/16 y 2001:db8::/32 reservadas para topología didáctica (las subredes concretas se asignan por laboratorio).

Autorización expresa del propietario del entorno; exclusivamente nodos propios, ventana docente y objetivos inventariados; parar ante pérdida de aislamiento, indisponibilidad inesperada o tráfico ajeno.

Herramientas candidatas de la investigación: FRRouting, Containerlab. Seleccionar plataforma y versión compatibles antes de ejecutar; esta guía no distribuye imágenes ni acredita soporte. Alternativa de análisis: Versión segmentada y offline: material sintético claramente marcado, razonamiento + validaciones menores en entorno ligero

## Tareas

- Configurar pares eBGP e interpretar AS_PATH, next-hop, rutas aceptadas
- Probar route-map/prefix-list para permitido/no permitido
- Sembrar mala redistribución y verificar ruta de retorno

## Pruebas positivas

- Se anuncia 10.60.61.0/24 y se rechaza 10.60.62.0/24

## Controles negativos y fallos para ensayar

- Anuncio prohibido no entra en tabla, con log o estado que lo demuestre

- Prefix-list al revés
- Next-hop no alcanzable
- Redistribución en bucle

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

- [RFC 4271: Border Gateway Protocol 4](https://www.rfc-editor.org/rfc/rfc4271.html)
- [BGP](https://docs.frrouting.org/en/latest/bgp.html)
- [RFC 7454: BGP Operations and Security](https://www.rfc-editor.org/rfc/rfc7454.html)
- [Route Maps](https://docs.frrouting.org/en/latest/routemap.html)
- [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html)

## Procedencia

Adaptación de la ficha RED-L07 de T5 conservada en investigación. Estimación original: 16 h, incluidas en el recorrido total, no medidas en una ejecución.
