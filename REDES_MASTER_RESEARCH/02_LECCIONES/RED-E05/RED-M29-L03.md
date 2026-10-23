# RED-M29-L03 — Pivotes DNS/flow/identidad

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M29-L03","moduleId":"RED-M29","stageId":"RED-E05","objective":"Corroborar identidad usando concesiones, traducciones y sesiones.","prerequisites":["RED-M29-L02"],"referenceIds":["NIST-IR","ZEEK-DNS","RFC3022"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M29-L03-Q01","RED-M29-L03-Q02"],"practiceId":"RED-M29-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M29-L03.md"} -->

## 1. Objetivo

Corroborar identidad usando concesiones, traducciones y sesiones.

Prerrequisitos: [RED-M29-L02](../RED-E05/RED-M29-L02.md).

## 2. Comprende el mecanismo

DNS, DHCP, NAT, VPN y endpoint aportan relaciones distintas entre nombres, direcciones e identidades. Sus registros deben coincidir en tiempo y alcance; una concesión no prueba qué persona ejecutó un proceso y una IP de VPN puede ser compartida o reasignada. Usa pivotes explícitos con su calidad, no uniones que multiplican filas y aparentan más evidencia. Cuando faltan logs NAT o precisión temporal, registra varios candidatos si corresponde. Dos tablas derivadas del mismo mensaje no son dos fuentes independientes.

### Vocabulario de apoyo

- **Hipótesis discriminante**: Explicación con una observación prevista que la distingue de otras alternativas.
- **Pivote y cardinalidad**: Clave para relacionar fuentes y número de correspondencias que produce esa relación.
- **Incertidumbre temporal**: Intervalo admisible de la hora real según resolución y precisión del reloj.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Caso docente: DHCP asigna .10 a equipo A hasta 10:00; equipo B desde 10:05; alerta externa solo indica 10:00 ±10 min.

La incertidumbre temporal abarca candidatos distintos. No es defendible atribuir de forma exclusiva al equipo A usando solo la primera concesión encontrada.

## 4. Práctica individual

El endpoint B registra la conexión exacta a 10:07 y NAT confirma puerto. ¿Qué nueva relación queda respaldada?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué relación aporta DHCP de manera más directa?

- A. Validación criptográfica del proceso
- B. Concesión de dirección a un cliente durante un período
- C. Intención humana de cada conexión
- D. Payload completo de toda sesión

### Pregunta 2

¿Qué limita la atribución exclusiva en el caso?

- A. El uso de una dirección IPv4
- B. Los equipos tienen nombres diferentes
- C. Hay una hora en el registro
- D. La ventana temporal abarca reasignaciones

## 6. Aplicación profesional

- SOC: Competencia central de investigación.
- Red Team autorizado: Formular prueba adicional mínima y autorizada.
- Evidencia del módulo: Timeline, alternativas, alcance y solicitud de datos.
- Criterio del módulo: Decisión reproducible basada en evidencias.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L15](../../05_RECURSOS/LABORATORIOS/RED-L15.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **NIST-IR**: [SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). Contexto de preparación, detección, respuesta y recuperación.
- **ZEEK-DNS**: [dns.log](https://docs.zeek.org/en/current/reference/logs/dns.html). Registros DNS y significado de campos por versión.
- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
