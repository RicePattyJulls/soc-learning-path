# RED-M07-L04 — Fallos de servicio y dependencia

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M07-L04","moduleId":"RED-M07","stageId":"RED-E02","objective":"Diagnosticar dependencias en orden y formular una prueba discriminante.","prerequisites":["RED-M07-L03"],"referenceIds":["RFC1034","RFC2131","RFC8415","RFC5905"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M07-L04-Q01","RED-M07-L04-Q02"],"practiceId":"RED-M07-L04-P01","solutionsFile":"03_SOLUCIONES/RED-M07-L04.md"} -->

## 1. Objetivo

Diagnosticar dependencias en orden y formular una prueba discriminante.

Prerrequisitos: [RED-M07-L03](../RED-E02/RED-M07-L03.md).

## 2. Comprende el mecanismo

Un servicio puede depender de dirección, resolución, rutas, transporte, tiempo y autenticación. Comprobar cada dependencia por separado evita cambiar permisos cuando el cliente usa una IP antigua. Define origen, nombre, dirección elegida, puerto, fase fallida y resultado esperado. Una conexión por IP no reproduce siempre la prueba por nombre: puede modificar selección de servidor, SNI o validación de certificado. Usa una prueba que cambie una variable controlada y documenta qué mecanismos de la aplicación conserva.

### Vocabulario de apoyo

- **Resolver y autoridad DNS**: El resolver consulta por el cliente; la autoridad responde por las zonas a su cargo.
- **DHCP y relay**: DHCP entrega configuración de red; el relay comunica la red cliente con un servidor en otra red.
- **TTL y offset**: TTL limita vigencia o recorrido según protocolo; offset es el desfase de un reloj frente a una referencia.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Cliente resuelve .20; servicio vigente está en .21; TCP a .20 falla y a .21 funciona en la topología docente.

La diferencia apunta a resolución/configuración del destino. Aun así, la prueba por IP no valida la identidad TLS o el virtual host por nombre.

## 4. Práctica individual

DNS devuelve la IP correcta, TCP conecta y el servicio rechaza por tiempo. ¿Qué siguiente comparación realizarías?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué mejora el diagnóstico por dependencias?

- A. Ignorar el destino elegido
- B. Una prueba que distingue hipótesis concretas
- C. Confundir error TLS y timeout
- D. Cambiar todas las variables a la vez

### Pregunta 2

¿Qué no valida necesariamente conectar por IP?

- A. La identidad TLS y el servidor virtual elegido por nombre
- B. Que hubo un intento de transporte
- C. El puerto utilizado en esa prueba
- D. La existencia de la IP destino

## 6. Aplicación profesional

- SOC: Investigar DNS anómalo con baseline.
- Red Team autorizado: Verificar que servicios de pruebas no salen del lab.
- Evidencia del módulo: Trazas de consultas, leases, cronología y causa.
- Criterio del módulo: Recupera los tres servicios y verifica hora.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L03](../../05_RECURSOS/LABORATORIOS/RED-L03.md)
- [Guía de laboratorio RED-L05](../../05_RECURSOS/LABORATORIOS/RED-L05.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **RFC1034**: [RFC 1034: Domain Names — Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034.html). Resolver, autoridad, caché y funciones DNS.
- **RFC2131**: [RFC 2131: Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131.html). Concesiones, cliente/servidor/relay DHCPv4.
- **RFC8415**: [RFC 8415: Dynamic Host Configuration Protocol for IPv6](https://www.rfc-editor.org/rfc/rfc8415.html). Funciones DHCPv6; no reemplazo de Router Discovery.
- **RFC5905**: [RFC 5905: Network Time Protocol Version 4](https://www.rfc-editor.org/rfc/rfc5905.html). Referencia temporal, offset y sincronización.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
