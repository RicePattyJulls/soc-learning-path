# Soluciones — RED-M12-L01

Material de revisión: consultar después de resolver.

## Práctica individual

Puede perder resolución o instalación efectiva; contrastar RIB/FIB, estado de interfaz y vecino. Una línea guardada expresa intención, no disponibilidad demostrada.

### Criterios observables

- Contrasta configuración con RIB/FIB y estado de interfaz.
- Explica que guardar la línea no conserva por sí solo disponibilidad.

Valora precisión, relación con los datos y límites. Una respuesta alternativa puede ser válida si justifica sus supuestos y no contradice el caso. No se autocorrige como dominio práctico.

## Pregunta 1

**Respuesta: C. Una decisión administrativa de encaminamiento**

La estática expresa intención administrativa; todavía puede faltar instalación, vecino o respuesta de aplicación.

## Pregunta 2

**Respuesta: D. La red conectada 192.0.2.0/24**

La conectada incluye .1 y permite resolver ese siguiente salto en el enlace local.

## Referencias

- **FRR-STATIC**: [STATIC](https://docs.frrouting.org/en/latest/static.html). Rutas estáticas y siguiente salto.
- **RFC4632**: [RFC 4632: Classless Inter-domain Routing](https://www.rfc-editor.org/rfc/rfc4632.html). Prefijos y agregación IPv4.
