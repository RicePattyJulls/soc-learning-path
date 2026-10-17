# Plan visual V2

## Lectura de la referencia

La referencia organiza una aventura en tres capas: cabecera azul y progreso; paisaje continuo de montaña, bosque y río con un camino de arena; nodos elevados con una placa blanca que muestra título, avance y recompensa. La mascota acompaña la bienvenida y un cofre señala el final. Las tarjetas apoyan al escenario: no lo sustituyen.

## Dirección

- Paleta: noche `#10284d`, cielo `#bfe6ff`, bosque `#397e54`, pradera `#a6c963`, río `#4bbfe4`, violeta `#8050e9`; oro `#ffc44d` reservado a tesoros y dominio.
- Tipografía: Trebuchet MS/DejaVu Sans locales, títulos con peso 800; nombres originales completos y texto de estado oscuro sobre placas claras.
- Composición: escenario a todo el ancho; bienvenida con robot a la izquierda y progreso real a la derecha. Camino serpenteante con nodos elevados y terreno ilustrado bajo ellos. Pie con nivel y logros reales.
- Capítulos = regiones en el atlas. Lecturas = nodos dentro de una región. Pasos = actividades en el lector existente. Sin progreso nuevo.

```text
[marca]                  [Ruta Biblioteca Progreso Repaso] [nivel/XP]
[robot + continuar]       [progreso] [estadísticas reales]
            montañas / ciudad / bosque / río
     nodo ─── curva ─── nodo       nodo
                  bosque / puentes
[perfil de nivel]       [cofre y logros existentes]
```

## Implementación por fases

1. Construir solo el capítulo 1 como región completa, manteniendo el atlas V1.5 hasta validar. Ilustración SVG original local con profundidad, montañas, bosque, río, rocas y puente; camino y nodos coincidentes. Mascota y cofre en SVG.
2. Validar clic de cada lectura, retorno, progreso V1/V2, bloqueo, teclado, objetivos táctiles, movimiento reducido, capturas y métricas con Chromium. Comparar con la referencia antes de ampliar.
3. Extender con un modelo visual independiente del catálogo y guardado. Temas decorativos por región; títulos e IDs permanecen intactos. Construir el atlas general con los mismos nodos/caminos.
4. Ejecutar regresión V1.5 y nuevas pruebas sobre los 13 capítulos, mantener capturas e informes.

## Límites y criterios

Los gráficos se crean expresamente en SVG, sin imágenes remotas, motores 3D ni dependencias nuevas. No se distribuye la referencia como fondo del producto. No hay rachas, certificados, misiones ni premios ficticios. Solo se anima feedback de interacción con transform/opacity y el token de curva existente; sin bucles decorativos fuera de pantalla. Se conserva el lector y el motor educativo.


## Puerta de validación de la región piloto

Antes de activar el resto de regiones y el atlas nuevo, `node tests/e2e.mjs --visual-pilot` terminó con cinco grupos aprobados. Se inspeccionaron capturas de 1440, 768, 390 y 320 px. Se corrigieron solapamientos entre nodos y con el panel de progreso, además del recorte del cofre en tableta. El informe `output/playwright/v2-pilot-results.json` conserva métricas y fecha de esa ejecución. La composición conserva paisaje continuo, profundidad por capas, camino real, nodos elevados, mascota y cofre; el trazo es vectorial 2D y más sencillo que el render de referencia. No usa el PNG como fondo ni como interfaz ficticia.
