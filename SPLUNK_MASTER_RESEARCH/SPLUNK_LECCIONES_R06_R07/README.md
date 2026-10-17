# SOC Learning Path — Splunk R06–R07 | Centro SOC y fábrica de detecciones

**Entrega:** 2026-10-16 · **Estado:** 16 lecciones (8+8) redactadas **para revisión**, **no integradas en React ni ejecutadas en Splunk real**.

## Lo que contiene

- **R06 — Centro SOC (8 lecciones)**: alerta→triage, pivotes, eventos Windows, cronología, falso positivo, handoff N1, decisión de escalado y caso integrado.
- **R07 — Fábrica de detecciones (8 lecciones)**: especificación, saved searches/alerts, ATT&CK, pruebas y matriz confusión, tuning, correlación y RBA condicionado a ES, mantenimiento y peer review de Kerberos.
- **48 actividades**: 32 MCQ con justificación y 16 prácticas abiertas con rúbrica y solución. Revisión humana/técnica pendiente.
- **4 laboratorios guiados**, 3 CSV sintéticos, verificador Python offline, test de integridad, fuentes, solución, rúbrica, índice, banco JSON y manifiesto de hashes.
- **Caso temporal intencional:** A021 ocurrió a las 09:04 y se indexó a las 09:24, de modo que un corte temprano ve 6 fallos y uno retrospectivo ve 7. **No es una medición de Splunk.**
- **Caso Kerberos:** detectores ingenuos de RC4 y volumen fallan frente a backup legítimo; AES/campo faltante requieren análisis, no conclusiones.

## Instalación en tu Parrot OS

Desde la raíz de investigación que ya tienes:

```bash
cd /home/tommy/Documentos/SOC_LEARNING_PATH/SPLUNK_MASTER_RESEARCH
7z x ~/Descargas/SPLUNK_LECCIONES_R06_R07.zip
```

Quedará `SPLUNK_LECCIONES_R06_R07/` junto a `SPLUNK_LECCIONES_R01_R03/` y `SPLUNK_LECCIONES_R04_R05/`, **sin sustituir la investigación**.

## Orden sugerido

1. `R06_CENTRO_SOC/INDICE.md` y LAB06-A/B.
2. `R07_DETECTION_ENGINEERING/INDICE.md` y LAB07-A/B.
3. `ACTIVIDADES/BANCO_ACTIVIDADES_R06_R07.json`, solucionario y rúbrica.
4. `VALIDACION/FUENTES_Y_LIMITES.md` y comprobaciones offline.

## Comprobación local sin red ni Splunk

```bash
python3 SPLUNK_LECCIONES_R06_R07/PRACTICAS/scripts/verificar_fixtures.py
python3 SPLUNK_LECCIONES_R06_R07/VALIDACION/comprobar_paquete.py
```

## Protección del proyecto

No modifica el repositorio, no crea saved searches, no habilita alarmas, no arranca contenedores, no usa servicios externos ni ejecuta ataques. Sus índices y sourcetypes son marcadores, no los de tu laboratorio. Ningún ejemplo recibe credenciales ni toca configuración.

IDs `SP-R06-L01`…`SP-R07-L08`, títulos y objetivos preservados del currículo `03_CURRICULO/SPLUNK_CURRICULO_R01_R11.json`. Las 48 actividades utilizan `SP-Rxx-Lxx-Q01/Q02/P01`, sin colisión con R01–R05. Aún hay que revisar el contrato de progreso de V2.5 antes de integración.

**Siguiente bloque:** R08–R09 (Threat Hunting y Enterprise Security); Codex puede seguir cerrado.

## Corrección editorial r1

16/10/2026: IDs originales conservados; MCQ con distractores revisados y opciones con identidad estable, distribuidas sin posición dominante por región. Teoría: umbral 80 %. Abiertas: formativas, sin calificación automática. Aprobar teoría no acredita dominio práctico. Revisión humana independiente pendiente.

VALIDACION/DATASETS.json fija archivos, columnas, horas y mapeos de diseño; no importa CSV ni configura Splunk. Los verificadores requieren conservar el directorio padre con currículo y VALIDACION compartida. Ejecutar con python3 -B. El comprobador llama al test de fixtures local y comprueba sincronización/hashes.

La nueva política sustituye umbrales de dominio práctico editoriales anteriores: no existe autocorrección de P01. Ver ../CORRECCIONES_FINALES.md y ../PLAN_INTEGRACION.md. No se ha integrado React ni ejecutado Splunk/ES/SOAR.
