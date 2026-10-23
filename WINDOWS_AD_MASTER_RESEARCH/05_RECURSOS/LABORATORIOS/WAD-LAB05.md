# WAD-LAB05 — DC aislado, DNS y cliente

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

**Modelar** un bosque y su estructura de confianza en papel y, después, **construir** un dominio mínimo en una red virtual cerrada: promover un controlador de dominio, comprobar que publica sus registros, unir un cliente y verificar que resuelve, autentica y mantiene el reloj. El bloque B extiende el modelado a la puesta en marcha y a la evidencia de salud.

## Competencia

Diseño y verificación de identidad: describir los límites administrativos antes de crearlos y demostrar con evidencia que el dominio funciona, sin confundir «aparece en el directorio» con «autentica de verdad».

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-08` (`WAD-08-L01` a `WAD-08-L03`) para el bloque A y la etapa `WAD-09` (`WAD-09-L01` a `WAD-09-L03`) para el bloque B. Esta guía corresponde al laboratorio de referencia LAB-05.

## Bloque A — Modelar el directorio (etapa WAD-08)

### Preparación A

- Solo papel o editor de texto: el bloque A es de **diseño**, no de ejecución.
- Un escenario sintético: una organización ficticia con dos áreas, soporte y ventas, y un dominio `ad.lab.test`.
- Datos **no personales**: nombres de objetos inventados.

### Tarea A

1. Dibuja la relación entre **bosque**, **dominio** y **OU** y anota para cada nivel su consecuencia real: qué delimita la seguridad, qué delimita la replicación y la administración, y qué sirve solo para organizar y delegar.
2. Señala en tu dibujo las **particiones** (de esquema, de configuración, de dominio y de aplicación) y qué contiene cada una.
3. Decide en qué OU colocarías un equipo de soporte, un usuario externo y un grupo de seguridad, y justifica cada decisión por su consecuencia administrativa.
4. Distingue el efecto de **mover un objeto entre OUs** del de moverlo **entre dominios**.
5. Escribe qué te permite leer el directorio por **LDAP** y para qué sirve el **catálogo global** en un bosque con más de un dominio.

### Evidencia A

- El diagrama de relaciones con la consecuencia anotada en cada nivel.
- La tabla de objetos con su ubicación propuesta y su justificación.
- La distinción entre mover dentro del dominio y entre dominios.
- La explicación del papel de LDAP y del catálogo global.

### Criterios A

- Distingue **OU**, **dominio** y **bosque** por sus consecuencias, no por su tamaño.
- Reconoce que la OU **no** es una frontera de seguridad.
- Sitúa correctamente los objetos según su función administrativa.
- Explica el catálogo global y la consulta LDAP sin confundirlos con un cambio del directorio.
- Reconoce los límites: el modelo es una hipótesis hasta que se despliega y se prueba.

## Bloque B — Promover DC, DNS y unir cliente (etapa WAD-09)

### Preparación B

- Dos máquinas virtuales en una **red virtual cerrada** y aislada de la red anfitriona: un servidor que será el controlador de dominio y un cliente.
- Direcciones de **documentación** para el escenario; ninguna dirección real de una organización.
- Registra fecha y hora en **UTC** y anota el **estado inicial** de ambos hosts y su configuración de red.

### Tarea B

1. Instala el **rol de AD DS** en el servidor y promuévelo creando un **bosque nuevo** con el dominio `ad.lab.test`, dejando que el asistente integre **DNS**; documenta el nivel funcional elegido.
2. Menciona la **contraseña de recuperación** del modo de restauración de servicios de directorio como dato que se guarda aparte; **no** la escribas en la evidencia.
3. Comprueba que el DC publica los **registros SRV** del dominio en la zona DNS y que el nombre de dominio se resuelve desde el propio servidor.
4. En el cliente, apunta el servidor **DNS** al controlador de dominio, une el equipo al dominio y reinicia cuando corresponda.
5. Verifica la pertenencia con el **canal seguro** del equipo y ejecuta una comprobación de salud del controlador. Anota el resultado.
6. Comprueba la **hora**: el cliente debe sincronizarse con el dominio; si desvías el reloj unos minutos, documenta el fallo de autenticación que aparece.
7. Realiza una prueba **positiva** (el equipo autentica e inicia sesión) y una **negativa** (un cliente con DNS ajeno al dominio falla de forma explicada).

### Evidencia B

- La configuración resultante de la promoción: nombre de dominio, zona DNS y nivel funcional.
- La resolución del nombre de dominio y los registros SRV localizados.
- El resultado del canal seguro y de la comprobación de salud del DC.
- La línea de tiempo del fallo por desviación de reloj y su corrección.
- La prueba positiva de inicio de sesión y la contraprueba negativa de un cliente sin DNS del dominio.

### Criterios B

- Distingue «el equipo figura en el dominio» de «el equipo **autentica** contra el dominio».
- Trata DNS como **requisito** del dominio, no como una opción decorativa.
- Relaciona la **hora** con la autenticación y lo demuestra con un caso.
- Demuestra el resultado con prueba **positiva** y **negativa**.
- Documenta con hora en **UTC** y reconoce qué no se pudo observar.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre hosts propios o de laboratorio. **Nunca** conectes el laboratorio a la red corporativa ni a Internet de terceros. **No** uses nombres ni datos de una organización real. **No** escribas contraseñas en la evidencia. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

Desconecta la red virtual, destruye las máquinas tras exportar un inventario despersonalizado y confirma que no queda ninguna configuración del laboratorio activa en el host anfitrión.

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
