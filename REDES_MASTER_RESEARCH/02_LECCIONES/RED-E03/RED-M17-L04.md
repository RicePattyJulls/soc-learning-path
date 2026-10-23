# RED-M17-L04 — Rutas asimétricas y atribución

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M17-L04","moduleId":"RED-M17","stageId":"RED-E03","objective":"Corroborar atribución y efectos del routing asimétrico.","prerequisites":["RED-M17-L03"],"referenceIds":["RFC3022","RFC3704"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M17-L04-Q01","RED-M17-L04-Q02"],"practiceId":"RED-M17-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M17-L04.md"} -->

## 1. Objetivo

Corroborar atribución y efectos del routing asimétrico.

Prerrequisitos: [RED-M17-L03](../RED-E03/RED-M17-L03.md).

## 2. Comprende el mecanismo

La asimetría no es siempre un fallo, pero puede afectar controles que esperan observar ambos sentidos y al análisis de capturas unidireccionales. Tras NAT, DHCP o VPN, una IP requiere contexto temporal para relacionarla con un activo o identidad. Combina traducciones, concesiones, sesiones y tiempos con incertidumbre explícita. Una ruta legítima de retorno alternativa puede eludir un sensor sin que desaparezca el tráfico. No atribuyas al host inicial todas las acciones de una IP compartida durante un día entero.

### Vocabulario de apoyo

- **SNAT, DNAT y PAT**: Traducción del origen, del destino y de direcciones con distinción de puertos.
- **Proxy y backend**: Intermediario que atiende o reenvía peticiones y servicio situado detrás de él.
- **Asimetría**: Uso de caminos diferentes para los sentidos de una comunicación.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> DNS registra cliente .10; NAT reasigna puertos durante el día; alerta externa solo trae IP de salida y una hora aproximada de ±10 min.

La precisión disponible puede dejar varios candidatos. La conclusión debe expresar atribución incompleta en lugar de escoger el primer host que coincida.

## 4. Práctica individual

El firewall A observa SYN y B observa SYN/ACK. Formula una hipótesis de red y una comprobación.

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué necesita una atribución basada en NAT?

- A. Traducción y tiempo con precisión suficiente
- B. Solo la IP pública de salida durante todo el día
- C. Solo el prefijo interno esperado sin el registro de la sesión
- D. Una concesión DHCP de otro intervalo sin puertos traducidos

### Pregunta 2

¿Qué explicación admite el caso SYN en A y SYN/ACK en B?

- A. Asimetría del camino
- B. Cifrado de la cabecera Ethernet
- C. Autenticación fallida demostrada
- D. Ausencia de toda respuesta

## 6. Aplicación profesional

- SOC: Construir pivotes temporales con NAT.
- Red Team autorizado: Validar una regla NAT de alcance delimitado.
- Evidencia del módulo: Tabla pre/post traducción con UTC y grado de confianza.
- Criterio del módulo: No atribuye persona solo por IP pública.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L09](../../05_RECURSOS/LABORATORIOS/RED-L09.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC3022**: [RFC 3022: Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022.html). Traducción de direcciones y puertos; referencia conceptual, no guía de despliegue.
- **RFC3704**: [RFC 3704: Ingress Filtering for Multihomed Networks](https://www.rfc-editor.org/rfc/rfc3704.html). uRPF y compromisos ante caminos asimétricos.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
