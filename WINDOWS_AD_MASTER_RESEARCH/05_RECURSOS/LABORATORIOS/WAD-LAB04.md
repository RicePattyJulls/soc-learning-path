# WAD-LAB04 — Servicio, DNS cliente y firewall

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

Sembrar un fallo **benigno** de conectividad en una red virtual cerrada, **distinguir** si la causa está en la resolución de nombres, en el filtro o en el servicio, y remediarla con la regla mínima. El bloque B extiende el mismo escenario a la aplicación y verificación de un control y a la preservación de evidencia.

## Competencia

Diagnóstico por capas y por hipótesis: aislar la causa, corregir solo su alcance y demostrar el resultado con pruebas antes/después.

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-06` (`WAD-06-L01` a `WAD-06-L03`) para el bloque A y, para el bloque B, la etapa `WAD-07` (`WAD-07-L01` a `WAD-07-L03`). Esta guía corresponde al laboratorio de referencia LAB-04.

## Bloque A — Causa raíz y regla mínima (etapa WAD-06)

### Preparación A

- Dos hosts virtuales, o un host Windows y un servicio local, en una **red virtual cerrada** y aislada de la red anfitriona.
- Direcciones de **documentación** para el escenario; ninguna dirección real de una organización.
- Registra fecha y hora en **UTC** y anota la configuración inicial de nombres, rutas y reglas.

### Tarea A

1. Comprueba la conectividad **por dirección** y **por nombre** hacia el servicio de destino y registra el contraste observado.
2. Recorre las capas **en orden**: direccionamiento del cliente, ruta, resolución de nombres y, por último, puerto y servicio. Anota en cada paso la prueba y su resultado.
3. Siembra **un** fallo benigno y reversible: una entrada de nombres incorrecta, una regla que no cubra el origen o un servicio detenido. Elige solo uno.
4. Enuncia la **hipótesis** que explica el síntoma, la prueba que la confirma y la que la descarta.
5. Corrige con la **regla o ajuste mínimo** que ataque la causa, sin desactivar el filtro ni ampliar el alcance.
6. Verifica el resultado con una prueba **después** y una **contraprueba negativa** desde un origen o una ruta que debe seguir sin acceso.
7. Revierte el fallo sembrado y confirma que la conectividad vuelve al estado inicial.

### Evidencia A

- El contraste por dirección y por nombre.
- La secuencia de capas con su prueba y su resultado.
- El antes/después de la comprobación de conexión y de la regla aplicada.
- La contraprueba negativa y la confirmación de la reversión.

### Criterios A

- Isola la **causa** del síntoma y la nombra por su capa.
- Ordena las comprobaciones de forma dependiente y **cambia una cosa a la vez**.
- Corrige con **alcance mínimo** y **rechaza explícitamente** la regla general «permitir todo».
- Demuestra el resultado con una prueba **positiva** y una **negativa**.
- Documenta la **reversión** y reconoce los límites de lo observado.

## Bloque B — Control, evidencia y respuesta breve (etapa WAD-07)

### Preparación B

- El mismo escenario del bloque A, con la instantánea previa disponible.
- Un objeto o carpeta de laboratorio para auditar y un ajuste de protección o de visibilidad que puedas aplicar y revertir.
- Registra de nuevo fecha y hora en **UTC** y anota el **estado inicial** del ajuste que vas a cambiar.

### Tarea B

1. Diseña una **auditoría mínima** del objeto de laboratorio: habilitación en la política y selección en el objeto, registrando **fallos** de acceso.
2. Provoca un **intento denegado** controlado y localiza el **evento** con su hora en UTC, su cuenta y su objeto.
3. Ajusta el **tamaño del registro** para no perder el periodo que necesitas y explica la decisión.
4. Aplica **un control** de protección o de visibilidad con alcance mínimo, después de anotar el estado inicial.
5. Verifica que el control está **en vigor** —no solo configurado— y realiza una **contraprueba** de que la función legítima sigue disponible.
6. Simula una **alerta benigna** (por ejemplo, un proceso no reconocido lanzado por ti) y aplica el orden **preservar → contener → remediar → verificar → documentar**, eligiendo la contención de menor impacto y reversible.
7. Revertir el control y la auditoría, y confirmar el retorno al estado inicial.

### Evidencia B

- El evento del intento denegado con hora en UTC, cuenta y objeto.
- El estado inicial, la verificación del control en vigor, la contraprueba y el registro del cambio.
- La línea de tiempo en UTC de la alerta benigna, con la evidencia preservada y el impacto de la contención.
- La confirmación de la reversión del control y de la auditoría.

### Criterios B

- No confunde **ausencia de evento** con ausencia de actividad.
- Distingue «configurado» de «**en vigor**» y lo verifica antes de concluir.
- Preserva **evidencia volátil** antes de contener y evita reiniciar o borrar.
- La contención elegida es de **mínimo impacto** y reversible.
- Documenta todo con hora en **UTC** y confirma la **reversión** final.

## Autorización y límites

Todo el trabajo se realiza en una **red virtual cerrada** y sobre hosts propios o de laboratorio. **Nunca** interfieras con la red anfitriona ni con equipos de producción. **No** desactives el firewall ni la protección del host como atajo. **No** alteres reglas, servicios ni auditoría fuera del escenario de laboratorio. No apliques exclusiones permanentes sin documentar motivo y revisión. Las direcciones usadas son de documentación y los datos, sintéticos.

## Limpieza

Revierte el fallo sembrado, la regla creada, el control aplicado y la configuración de auditoría; restaura el tamaño del registro si lo modificaste; detén el objeto de prueba; y comprueba que la conectividad y el estado del host coinciden con el inicial (o recupera la instantánea).

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
