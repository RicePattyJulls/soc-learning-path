# WAD-LAB23 — Recuperación separada de AD CS

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

> Corresponde al laboratorio de referencia **EXT-03**, avanzado y **opcional**. El **bloque A** (custodia y respaldo de la CA) pertenece a la etapa `WAD-16`; el **bloque B** (restauración en un clon aislado) pertenece a la etapa `WAD-20`. La clave privada de prueba se maneja con custodia estricta.

## Objetivo

**Preparar** el respaldo de una autoridad de certificación de laboratorio —base de datos y clave privada de prueba— y **ensayar** su restauración en un clon aislado hasta verificar que conserva su identidad, su cadena y su revocación.

## Competencia

Continuidad de la PKI: distinguir la copia de la base de datos de la copia de la clave privada, restaurar una CA en un entorno aislado y comprobar que emisor, CRL y AIA siguen siendo válidos.

## Nivel y prerrequisitos

Avanzado y **opcional**. El bloque A requiere la etapa `WAD-16`; el bloque B, la etapa `WAD-20`. Esta guía corresponde al laboratorio de referencia EXT-03.

## Bloque A — Custodia y respaldo de la CA (etapa WAD-16)

### Preparación A

- Una máquina `CA01` **desechable** y un cliente, en una **red virtual cerrada** y en el dominio `ad.lab.test`.
- La configuración de la CA **capturada** de antemano: nombre, plantillas, EKU y puntos de la CRL y del AIA.
- Un medio de respaldo separado para la **base de datos** y para el **PFX de prueba** de la clave privada, con **custodia estricta**.
- Registra fecha y hora en **UTC** y anota el **catálogo de plantillas** como **línea base**.

### Tarea A

1. **Captura** la configuración de la CA y **cataloga** sus plantillas y sus permisos de inscripción.
2. **Respalda** la **base de datos** de la CA y **exporta** una copia de prueba de la **clave privada**, cada una con su **hash**.
3. **Custodia** el PFX de prueba: describe quién puede acceder a él y dónde se guarda. **No** lo adjuntes a ninguna evidencia.
4. Distingue por escrito qué se recupera con la **base de datos** y qué exige la **clave privada**.
5. **No** declares probada una recuperación mientras no se haya restaurado en un clon.

### Evidencia A

- La **configuración** de la CA y el **catálogo de plantillas**.
- Los **hashes** de la copia de la base de datos y del PFX de prueba.
- La nota de **custodia** del PFX y su alcance de acceso.
- La distinción entre recuperar con la **base de datos** y recuperar con la **clave privada**.

### Criterios A

- Distingue la copia de la **base de datos** de la copia de la **clave privada** por lo que cada una permite recuperar.
- **No** adjunta el PFX ni escribe ningún valor de clave en la evidencia.
- Reconoce que una base de datos sin su clave privada **no** recupera la identidad de la CA.

## Bloque B — Restauración en clon aislado (etapa WAD-20)

### Preparación B

- Un **clon aislado** y desechable, sin conexión con la red donde vive la CA original.
- La copia de la **base de datos** y el **PFX de prueba** disponibles, con su hash y su custodia registrados.
- Confirmación de que la CA original **no** se toca durante el ejercicio.

### Tarea B

1. **Restaura** la CA en el clon aislado a partir de la base de datos y la clave privada de prueba.
2. **Verifica** que el **emisor** de los certificados de prueba coincide con el esperado.
3. Comprueba que la **cadena de confianza**, la **CRL** y el **AIA** siguen siendo válidas y que la **revocación** de un certificado de prueba se refleja.
4. **Mide** el tiempo del ejercicio y anota cualquier paso que dependiera de un servicio externo.
5. Cierra con la **prueba negativa**: comprueba que, **sin** la clave privada correcta, la base de datos **sola** no recupera la identidad de la CA.

### Evidencia B

- El **emisor** de los certificados de prueba y su comparación con la CA original.
- El estado de la **cadena**, la **CRL** y el **AIA**, y la prueba de **revocación**.
- El **tiempo** del ejercicio y las dependencias externas que aparecieron.
- La prueba **negativa** sobre una base de datos sin su clave privada.

### Criterios B

- Comprueba **emisor**, **cadena**, **CRL** y **AIA** tras restaurar, no solo el arranque del servicio.
- **No** conecta el clon a la red donde vive la CA original.
- Demuestra la prueba **positiva** (mismo emisor y revocación válida) y la **negativa** (sin clave privada no hay identidad de CA).
- Registra hora en **UTC** y **no** escribe valores de clave en la evidencia.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre máquinas **desechables**. **Custodia estricta** del PFX de prueba: **no** se adjunta al informe ni se escribe su valor. **No** uses certificados ni datos de un entorno real.

## Limpieza

**Elimina** el PFX de prueba y la máquina de laboratorio de forma **segura**, y confirma que la CA original no se modificó.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
