# WAD-LAB02 — Tokens, DACL y acceso efectivo

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

Demostrar, con evidencia, **por qué** una identidad puede o no puede realizar una acción: identidad del token, DACL del objeto y nivel de integridad, con una prueba positiva y una negativa y su reversión. El bloque B extiende el mismo método a los permisos de archivo en NTFS y al recurso compartido.

## Competencia

Autorización efectiva: pasar de «parece que puede» a «puede, y aquí está la prueba».

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-03` (`WAD-03-L01` a `WAD-03-L03`) para el bloque A y, para el bloque B, la etapa `WAD-04` (`WAD-04-L01` a `WAD-04-L03`). Esta guía corresponde al laboratorio de referencia LAB-02, cuyas dos mitades cubren la identidad efectiva y el acceso a archivos y recursos compartidos.

## Bloque A — Tokens, DACL e integridad (etapa WAD-03)

### Preparación A

- Una máquina virtual de Windows con **instantánea** creada antes de empezar.
- Dos cuentas locales de laboratorio y un grupo de laboratorio; una carpeta **señuelo** en una ubicación no crítica.
- Registra de nuevo fecha y hora en **UTC** al empezar.
- Anota el **estado inicial** de la carpeta (propietario y ACL) para poder revertir.

### Tarea A (solo lectura primero)

1. Identifica la cuenta y el **token** con el que actúas: nombre, SID, grupos y privilegios efectivos.
2. Lee el **descriptor de seguridad** de la carpeta señuelo: propietario, DACL y ACE heredadas frente a propias.
3. Anota el **nivel de integridad** de la carpeta y el de tu proceso.
4. Construye una **matriz** sujeto/objeto/permiso con lo observado, separando lo medido de lo supuesto.

### Tarea A (cambio controlado y reversión)

5. En la máquina virtual, asigna a un usuario permiso de escritura y deniega explícitamente al otro, aunque ambos compartan grupo.
6. Ejecuta la **prueba positiva** (el primero escribe) y la **prueba negativa** (el segundo no puede), registrando en cada caso el motivo por capas.
7. Revierte la ACL al **estado inicial** y confirma que coincide con lo anotado al empezar.

### Evidencia A

- La matriz identidad/objeto/permiso.
- Las dos pruebas testigo (positiva y negativa) con su motivo.
- El estado inicial y la confirmación de la reversión.

### Criterios A

- Diferencia **permiso** de **privilegio** y **DACL** de **SACL**.
- Explica el resultado por capas: token, DACL (incluida la herencia), integridad.
- Demuestra el caso con una prueba **positiva** y una **negativa**.
- Documenta la **reversión** y reconoce los límites de lo observado.

## Bloque B — NTFS, share y restauración (etapa WAD-04)

### Preparación B

- La misma máquina virtual, con la **instantánea** previa aún disponible y una carpeta **señuelo** publicada como recurso compartido en la red virtual cerrada.
- Dos cuentas de laboratorio con acceso a esa carpeta: una que debe poder escribir y otra a la que se denegará.
- Registra de nuevo fecha y hora en **UTC** y anota el **estado inicial** de la ACL NTFS y de los permisos del recurso compartido.

### Tarea B (solo lectura primero)

1. Lee el propietario, la DACL y la **herencia** de la carpeta señuelo: separa ACE propias de heredadas y anota el origen de cada una.
2. Enumera el **recurso compartido** y los permisos asociados a la capa del share.
3. Calcula y anota el **permiso efectivo** esperado por **acceso local** (solo NTFS) y por **acceso por red** (share ∩ NTFS).
4. Construye la **matriz NTFS ∩ share** con lo observado, marcando lo medido y lo supuesto.

### Tarea B (cambio controlado, auditoría y reversión)

5. En la máquina virtual, identifica un permiso **excesivo** (por ejemplo, una concesión amplia heredada o un permiso de share más amplio del necesario) y corrígelo con alcance mínimo, tocando **solo** la capa que lo causa.
6. Ejecuta la **prueba positiva** por la ruta que debe funcionar y la **prueba negativa** por la ruta que debe seguir denegada, registrando en cada caso el motivo por capa.
7. Configura la **auditoría mínima** de accesos denegados a la carpeta (selección en el objeto y habilitación en la política), provoca un **intento fallido** controlado y localiza el **evento** con su hora en UTC y su cuenta.
8. **Restaura** la ACL, los permisos del share y la configuración de auditoría al estado inicial, y confirma que coinciden con lo anotado al empezar.

### Evidencia B

- La matriz NTFS ∩ share con el permiso efectivo por ruta.
- Las dos pruebas testigo (positiva y negativa) con su motivo y la capa que las explica.
- El evento del intento denegado con hora en UTC, cuenta y objeto.
- El estado inicial y la confirmación de la restauración.

### Criterios B

- Distingue acceso **local** (solo NTFS) de acceso **por red** (share ∩ NTFS).
- Corrige **solo** la capa que falla y sin dejar permisos amplios residuales.
- Explica las denegaciones indicando la capa y, dentro de NTFS, el origen de cada ACE.
- Demuestra el caso con una prueba **positiva** y una **negativa**.
- Verifica la **auditoría** con el evento del intento fallido y la **restauración** del estado inicial.

## Autorización y límites

Solo lectura salvo las tareas A.5 y B.5 a B.8, que exigen una máquina virtual con instantánea. **No** alteres los permisos del host físico ni de rutas del sistema. No cambies la pertenencia a grupos integrados del sistema fuera de las cuentas de laboratorio. No publiques recursos compartidos en redes que no controles ni abras reglas de firewall generales. No exportes ni publiques material sensible de identidades.

## Limpieza

Restaura la ACL, los permisos del recurso compartido y la configuración de auditoría al estado inicial, elimina usuarios, grupo, carpeta señuelo y recurso compartido, y confirma el baseline (o recupera la instantánea).

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
