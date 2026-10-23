# WAD-LAB06 — Usuarios, grupos, delegación y GPO

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

Crear y **consultar** objetos de identidad sintéticos, **delegar** una tarea concreta sobre una unidad organizativa sin otorgar privilegios de dominio y **aplicar una política** de alcance conocido que sea reversible. El bloque B extiende el mismo dominio a la gestión de la política resultante y a su reversión.

## Competencia

Gestión de identidad con permiso mínimo: demostrar con una prueba positiva y una negativa que un delegado hace **solo** lo permitido y que una política alcanza **solo** a las identidades esperadas.

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-10` (`WAD-10-L01` a `WAD-10-L03`) para el bloque A y, para el bloque B, la etapa `WAD-12` (`WAD-12-L01` a `WAD-12-L03`). Esta guía corresponde al laboratorio de referencia LAB-06.

## Bloque A — Identidad y delegación (etapa WAD-10)

### Preparación A

- El dominio aislado del laboratorio de referencia LAB-05, con una **instantánea** hecha antes de empezar.
- Unidades organizativas de laboratorio (por ejemplo `Operaciones` y `Helpdesk`), nombres **sintéticos** y ningún dato personal real.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de las OUs.

### Tarea A

1. Consulta el directorio con una operación de **solo lectura** y localiza un objeto por su nombre distinguido; anota los atributos que lees y por qué no modificas nada.
2. Crea cuentas y grupos **sintéticos** dentro de la OU `Operaciones`, con nombres inventados.
3. Anida un grupo dentro de otro y explica qué permite y qué **no** permite el **ámbito** elegido al cruzar dominios.
4. Mueve una cuenta de una OU a otra y describe qué cambia en su alcance administrativo.
5. **Deshabilita** una cuenta y, por separado, sobre otra cuenta de prueba, ensaya el borrado; explica por qué deshabilitar es reversible y eliminar no lo es igual.
6. Delega en una cuenta de soporte la tarea concreta de **restablecer contraseñas** dentro de la OU `Operaciones`, aplicando permiso mínimo (asistente de delegación o ajuste equivalente).
7. Verifica con una prueba **positiva** (el delegado restablece una contraseña dentro de la OU) y una **negativa** (el delegado no puede hacerlo fuera de la OU ni realizar otra tarea).

### Evidencia A

- La consulta de solo lectura con los atributos leídos.
- Las cuentas y grupos creados y su ubicación.
- La justificación del ámbito de grupo al anidar.
- El estado de la cuenta deshabilitada y la reflexión sobre el borrado.
- El ajuste de delegación y las pruebas positiva y negativa.

### Criterios A

- Distingue **consulta** de **modificación** del directorio.
- Justifica el **ámbito de grupo** por su consecuencia al anidar.
- Prefiere **deshabilitar** cuando la acción debe poder revertirse.
- Delega con **alcance mínimo** y **rechaza explícitamente** añadir la cuenta a Domain Admins.
- Demuestra el permiso con una prueba **positiva** y una **negativa**.

## Bloque B — Política, resultado y reversión (etapa WAD-12)

### Preparación B

- El mismo dominio del bloque A, con la instantánea previa y las OUs ya creadas.
- Una OU de laboratorio para vincular la política y una OU **exenta** para la contraprueba.
- Registra de nuevo fecha y hora en **UTC** y anota el **estado inicial** de la política.

### Tarea B

1. Crea una GPO con un ajuste **inocuo y visible** (por ejemplo, un elemento de personalización del escritorio) y **vincúlala** a la OU de laboratorio.
2. Predice, antes de aplicarla, a qué identidades debería alcanzar según el vínculo, el orden y la herencia; anota la predicción.
3. Ajusta el **filtrado de seguridad** para que la política alcance solo a un grupo de laboratorio concreto.
4. Aplica la política y en un cliente de la OU obtén la **política resultante** con la herramienta de resultados; localiza el ajuste y de dónde viene.
5. Comprueba la contraprueba **negativa**: un cliente de la OU exenta **no** recibe el ajuste.
6. Aplica un segundo cambio de política inocuo sobre la OU de laboratorio, demuestra su alcance efectivo y **reviértelo**.
7. Elimina el vínculo creado y confirma que la política resultante vuelve al estado inicial.

### Evidencia B

- La predicción de alcance escrita antes de aplicar la política.
- La política resultante del cliente con el ajuste y su origen.
- La contraprueba negativa en la OU exenta.
- El antes/después del cambio aplicado y su reversión confirmada.

### Criterios B

- Distingue «**configurado**» de «**aplicado**» y lo verifica antes de concluir.
- Explica el alcance por **vínculo**, **orden** y **herencia**, no por intuición.
- Confirma el efecto con la **política resultante** y con una **contraprueba negativa**.
- El cambio elegido es **inocuo** y **reversible**.
- Documenta con hora en **UTC** y confirma la **reversión** final.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre el dominio de laboratorio. **No** apliques políticas ni delegaciones sobre un dominio real. **No** otorgues Domain Admin para «resolver» una tarea. **No** uses datos personales reales: los nombres de los objetos son sintéticos. **No** escribas contraseñas en la evidencia.

## Limpieza

Revierte la GPO y el ajuste de delegación, elimina las cuentas señuelo y el vínculo creado, y confirma que la política resultante y el estado de las OUs coinciden con el inicial (o recupera la instantánea).

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
