# WAD-LAB03 — PowerShell seguro y repetibilidad

Guía de laboratorio **diseñada**, no ejecutada ni validada. Ejecútala solo sobre un host propio o un laboratorio aislado y autorizado.

## Objetivo

Construir un **inventario estructurado** por objetos y una operación de mantenimiento **idempotente**, con ayuda consultada antes de ejecutar, captura explícita de errores, ejecución en seco donde exista y un **registro** que permita atribuir cada efecto.

## Competencia

Automatización de confianza: distinguir lo que se consulta de lo que se cambia y demostrar que repetir la operación es seguro.

## Nivel y prerrequisitos

Fundamentos. Requiere la etapa `WAD-05` (`WAD-05-L01` a `WAD-05-L03`) y conviene haber recorrido la etapa `WAD-02` por lo que respecta a leer estado frente a modificarlo.

## Preparación

- Un equipo Windows con PowerShell y una **instantánea** creada antes de empezar.
- Una carpeta **temporal** de laboratorio y datos **no personales** de ejemplo; nada de información real de personas ni de la organización.
- Registra fecha y hora en **UTC** al empezar.
- Anota el **estado inicial** de la carpeta temporal y de cualquier objeto que vayas a consultar.

## Tarea (solo lectura primero)

1. Consulta la **ayuda** y los ejemplos del comando de consulta que usarás en el inventario, y anota qué devuelve y qué parámetros acepta.
2. Con el comando que enumera **propiedades y métodos**, identifica la propiedad que contiene el estado de cada objeto del inventario.
3. Construye el **inventario** como objetos, filtra por **propiedad** —no por texto— y guarda la salida en un formato estructurado (JSON o CSV) junto a la marca de tiempo.
4. Lee el **estado inicial** de la carpeta temporal y del objeto que vayas a modificar.

## Tarea (operación idempotente, registro y reversión)

5. Diseña una operación de mantenimiento **idempotente** sobre la carpeta temporal: antes de cambiar, comprueba si el objeto ya está en el estado deseado y, si lo está, no lo modifica.
6. Ejecútala primero en **seco**, revisando el alcance que se aplicaría; después, aplícala de verdad.
7. Ejecútala una **segunda vez** con el mismo dato de entrada y demuestra que el resultado es el mismo, sin duplicar objetos ni fallar por «ya existe».
8. Provoca un escenario de **permiso denegado** (por ejemplo, un objeto fuera del alcance de tu cuenta) y comprueba que el error se reporta de forma **explícita**, sin confundirse con un éxito.
9. Registra **qué** se hizo, **cuándo** en UTC, **sobre qué** objeto y **con qué resultado**, y define el **plan de reversión**.
10. **Revierte** la operación y confirma que el estado coincide con el inicial.

## Evidencia esperada

- El script o la secuencia de comandos, legible y sin credenciales incorporadas.
- La salida estructurada (JSON o CSV) del inventario con su marca de tiempo.
- El registro de la operación: comprobación previa, ejecución en seco, ejecución real, segunda ejecución y error explícito.
- El plan de reversión y la confirmación del retorno al estado inicial.

## Criterios verificables

- El inventario se construye con **objetos** y se filtra por **propiedad**, no por texto.
- El script es **idempotente**: repetirlo deja el mismo resultado.
- Se usa la **ejecución en seco** antes de aplicar y se revisa el alcance.
- Los **errores** se tratan de forma explícita y no se confunden con éxito.
- Existe **registro** con hora en UTC y **reversión** confirmada.
- Reconoce los límites: qué no se pudo observar y qué no prueban los resultados.

## Autorización y límites

Solo lectura salvo las tareas 5 a 10, que exigen una máquina virtual con instantánea. **No** eleves privilegios de forma innecesaria ni ejecutes la operación sobre rutas del sistema. **No** incorpores credenciales ni tokens dentro del script. No uses datos personales reales: el laboratorio trabaja con datos sintéticos. No publiques las salidas si contienen nombres de cuentas de tu entorno.

## Limpieza

Elimina los archivos temporales generados, revierte la operación aplicada a la carpeta temporal y confirma el estado inicial (o recupera la instantánea).

## Estado declarado

**Diseñado**, no ejecutado. La guía no acredita haber ejecutado el laboratorio.
