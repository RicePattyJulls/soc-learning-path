# LAB-R01 — Arquitectura sin instalaciones

**Tipo:** práctica en papel; sin Splunk ni cambios de configuración.

## Escenario

Una empresa tiene 30 Windows, 5 Linux y un firewall syslog. Quiere buscar autenticaciones fallidas y conservar evidencia durante un periodo que aún debe acordar.

## Encargo

1. Dibuja fuente → input/receptor → parser → indexer y analista → search head → indexer.
2. Etiqueta UF, HF (opcional), receptor syslog y los componentes realmente imprescindibles.
3. Identifica tres preguntas de capacidad: eventos/segundo, retención y red.
4. Explica qué producto Splunk puede buscar eventos y qué capacidades ES/SOAR **no** están demostradas.

## Solución de referencia

UF es opción razonable para Windows/Linux cuando el input lo permite; firewall a receptor syslog apropiado; indexer almacena y search head coordina (una sola instancia puede combinar funciones en laboratorio). HF no es obligatorio. ES/SOAR requieren comprobación independiente de producto y licencia. La topología exacta queda pendiente de volumen, permisos y disponibilidad.

## Criterio de éxito

No confundir UF con indexer; diferenciar flujo de eventos de consultas; justificar HF y declarar supuestos. No requiere acceso real.
