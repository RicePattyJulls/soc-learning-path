# RED-M10-L01 — STP/RSTP/MSTP

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M10-L01","moduleId":"RED-M10","stageId":"RED-E02","objective":"Reconocer funciones de STP y distinguir sus variantes.","prerequisites":["RED-M08-L04","RED-M09-L04"],"referenceIds":["STP","BRIDGE","BONDING"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M10-L01-Q01","RED-M10-L01-Q02"],"practiceId":"RED-M10-L01-P01","solutionsFile":"03_SOLUCIONES/RED-M10-L01.md"} -->

## 1. Objetivo

Reconocer funciones de STP y distinguir sus variantes.

Prerrequisitos: [RED-M08-L04](../RED-E02/RED-M08-L04.md), [RED-M09-L04](../RED-E02/RED-M09-L04.md).

## 2. Comprende el mecanismo

STP construye una topología lógica sin bucles bloqueando caminos redundantes. RSTP mejora mecanismos de convergencia y MSTP permite agrupar VLAN en instancias; sus estados y compatibilidades deben interpretarse por variante. Rapid PVST+ es una implementación por VLAN de Cisco, no un nombre genérico de todo RSTP. Un enlace físico redundante puede permanecer sin forwarding para una instancia sin estar averiado. Desactivar STP para recuperar un enlace puede introducir tormentas y duplicación de tramas.

### Vocabulario de apoyo

- **STP, root y BPDU**: Protocolo para evitar bucles L2, puente de referencia y mensajes usados por ese control.
- **LACP**: Protocolo que negocia qué enlaces pertenecen a una agregación.
- **Convergencia**: Adaptación del estado de red tras un cambio; la recuperación de servicio también debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Triángulo docente A-B-C-A. Para una instancia, un puerto queda en discarding; el resto conserva conectividad.

El estado puede ser precisamente la protección contra el bucle. Hace falta contrastar roles y root antes de declarar el puerto defectuoso.

## 4. Práctica individual

VLAN10 y VLAN20 se agrupan en una misma instancia MST. ¿Qué debes coordinar entre switches?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué problema evita STP?

- A. La pérdida de claves TLS
- B. Bucles de capa 2 en la topología de forwarding
- C. Todos los errores de aplicación
- D. La necesidad de routing

### Pregunta 2

¿Qué puede significar discarding en el triángulo?

- A. Fallo físico confirmado
- B. Una sesión SSH activa
- C. Ausencia total de VLAN
- D. Un bloqueo lógico previsto para evitar un bucle

## 6. Aplicación profesional

- SOC: Reconocer pérdida/duplicación por convergencia.
- Red Team autorizado: Ensayar controles solo en switches simulados.
- Evidencia del módulo: Estados de puerto, cambios y pruebas de recuperación.
- Criterio del módulo: Restaurar la topología y justificar árbol activo.

## 7. Referencias y ampliación

- [Guía de laboratorio RED-L04](../../05_RECURSOS/LABORATORIOS/RED-L04.md)

Las guías enlazadas pueden integrar otros módulos; consulta sus previos antes de ejecutarlas.

- **STP**: [Understand Rapid Spanning Tree Protocol](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html). Roles, estados y comparación de convergencia RSTP.
- **BRIDGE**: [Ethernet Bridging](https://docs.kernel.org/networking/bridge.html). Learning, forwarding, VLAN y controles de bridge; kAPI no se presenta como estable.
- **BONDING**: [Linux Ethernet Bonding Driver HOWTO](https://docs.kernel.org/networking/bonding.html). Agregación y modos de reparto; verificar soporte por implementación.

Consulta editorial: 18/10/2026. Las recomendaciones del ejercicio son una adaptación docente; los ejemplos no reproducen un despliegue del fabricante. Para practicar configuración, usa la guía de laboratorio vinculada al módulo con plataforma/versiones compatibles.
