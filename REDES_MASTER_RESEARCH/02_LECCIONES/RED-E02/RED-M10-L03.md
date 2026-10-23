# RED-M10-L03 — Guardias y protecciones

<!-- redes-meta {"schemaVersion":1,"courseId":"redes","id":"RED-M10-L03","moduleId":"RED-M10","stageId":"RED-E02","objective":"Elegir protecciones de borde sin confundir sus objetivos.","prerequisites":["RED-M10-L02"],"referenceIds":["STP","BRIDGE","BONDING"],"humanReview":"pending_independent_review","educationalReview":{"date":"2026-10-18","reviewer":"Codex","kind":"author_self_review","status":"completed_with_corrections","independent":false,"scope":["clarity","concept_sequence","objective_activity_alignment","answer_reasoning","documentary_rubrics"]},"practicalStatus":"not_assessed","examplesSynthetic":true,"questionIds":["RED-M10-L03-Q01","RED-M10-L03-Q02"],"practiceId":"RED-M10-L03-P01","solutionsFile":"03_SOLUCIONES/RED-M10-L03.md"} -->

## 1. Objetivo

Elegir protecciones de borde sin confundir sus objetivos.

Prerrequisitos: [RED-M10-L02](../RED-E02/RED-M10-L02.md).

## 2. Comprende el mecanismo

Un puerto de borde acelera el paso a forwarding cuando conecta a un extremo, pero no convierte en seguro cualquier dispositivo conectado. BPDU Guard puede deshabilitar o proteger un puerto que recibe BPDUs bajo condiciones configuradas; Root Guard impide aceptar un root no deseado por ese camino. Loop Guard atiende otros fallos de recepción de BPDUs según implementación. Elegir la protección exige identificar función del puerto, comportamiento ante fallo y método de recuperación; no todos los enlaces entre switches deben tratarse como borde.

### Vocabulario de apoyo

- **STP, root y BPDU**: Protocolo para evitar bucles L2, puente de referencia y mensajes usados por ese control.
- **LACP**: Protocolo que negocia qué enlaces pertenecen a una agregación.
- **Convergencia**: Adaptación del estado de red tras un cambio; la recuperación de servicio también debe medirse.

[Glosario por módulos](../../05_RECURSOS/GLOSARIO.md). Estas definiciones sirven de consulta; no necesitas memorizar todas las siglas antes de resolver.

## 3. Caso resuelto

**Datos sintéticos para análisis; no son una captura ni una ejecución real.**

> Diseño docente: p7 conecta un PC y tiene BPDU Guard. Se conecta accidentalmente un switch y llegan BPDUs; puerto protegido.

La protección reacciona a una condición definida del borde. Antes de reactivarlo debe corregirse la conexión o el diseño; repetir resets no elimina el riesgo.

## 4. Práctica individual

Un enlace debe admitir un switch autorizado, pero nunca convertirlo en root. ¿Qué objetivo de protección corresponde?

Entrega una respuesta razonada: identifica los datos que utilizas, la decisión o cálculo, y el límite de tu conclusión. Resuelve antes de consultar el solucionario. Esta práctica es de análisis documental; su resolución no acredita haber configurado o intervenido una red real.

## 5. Evalúa lo aprendido

Responde ambas preguntas y justifica por qué las otras opciones no se sostienen con los datos.

### Pregunta 1

¿Qué objetivo tiene Root Guard?

- A. Asignar direcciones DHCP
- B. Cifrar tráfico Ethernet
- C. Impedir un root no deseado por el puerto protegido
- D. Autenticar contraseñas SSH

### Pregunta 2

¿Qué hacer antes de reactivar p7?

- A. Resolver la conexión o diseño que provocó la condición
- B. Ignorar las BPDUs
- C. Desactivar todas las protecciones del campus
- D. Cambiar el resolver DNS

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
