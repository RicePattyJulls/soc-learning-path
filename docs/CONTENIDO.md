# Estructura derivada de SC-200.md

Generado desde los títulos reales. La apertura y los estados/XP son metadatos de navegación.

Origen SHA-256: `51a94cb1da0c26cbdf70bef92daf3c01383f5d22658457a0943ac67305d22f89`.

- Apertura del documento: texto anterior al primer capítulo, líneas 1–55.

## 1 · Licencia y onboarding

Línea 56. 4 lecturas.

- 1 · Licencia y onboarding (líneas 56–62)
- Por usuario (líneas 63–126)
  - MDO (línea 64)
  - MDE (línea 73)
  - MDCA (línea 82)
  - MDI (línea 88)
  - Entra ID (línea 99)
  - Microsoft Purview (línea 108)
  - Microsoft Defender for Business (línea 119)
- Por recurso (líneas 127–160)
- Por consumo (líneas 161–213)

## 2 · Permisos y RBAC

Línea 214. 6 lecturas.

- 2 · Permisos y RBAC (líneas 214–216)
- 1 · Modelos y scopes (líneas 217–228)
- 2 · Azure RBAC para Microsoft Sentinel (líneas 229–281)
  - Roles de Microsoft Sentinel (línea 256)
  - Workspace y recursos auxiliares (línea 270)
- 3 · Unified RBAC en el portal de Defender (líneas 282–380)
  - Permisos relevantes (línea 319)
  - Alcance y Sentinel scoping (línea 355)
  - Advanced Hunting y custom detections (línea 368)
- 4 · Roles de Entra y del Data Lake (líneas 381–417)
- 5 · Permisos especiales por tarea (líneas 418–541)
  - Plataforma e ingesta (línea 420)
  - Detección e investigación (línea 442)
  - Respuesta y automatización (línea 456)
  - Microsoft Entra ID Protection (línea 481)
  - Microsoft Security Copilot (línea 497)
  - Microsoft Purview (línea 523)

## 3 · Protección y configuración de workloads

Línea 542. 9 lecturas.

- 3 · Protección y configuración de workloads (líneas 542–544)
- Microsoft Defender for Endpoint (MDE) (líneas 545–825)
  - Optional features (línea 548)
  - Device groups (línea 580)
  - Rules: indicators, web content filtering y exclusiones (línea 592)
  - Deception (línea 653)
  - Endpoint security policies (línea 656)
    - Plantillas disponibles al crear la política (línea 673)
  - Qué control se configura desde dónde (línea 688)
    - A nivel de endpoint (línea 692)
    - A nivel de tenant (línea 706)
  - Reglas ASR (línea 714)
    - Capas de exclusión de ASR, de más general a más específica (línea 747)
    - Dos trampas prácticas (línea 760)
    - Conflicto entre Group Policy y MDM (Intune) (línea 765)
    - Dónde se ve la actividad en modo Audit (línea 771)
    - Códigos de evento (línea 777)
    - No todo bloqueo genera alerta (línea 788)
    - Condición extra dentro de las 8 (línea 803)
    - Lectura red team (línea 807)
  - Vulnerability Management y baseline compliance (línea 811)
- Microsoft Defender for Office 365 (líneas 826–941)
  - EOP: políticas base de protección (línea 868)
  - Preset security policies: Built-in, Standard y Strict (línea 897)
  - Safe Attachments y Safe Links (línea 913)
  - Tenant Allow/Block List y Advanced Delivery (línea 932)
- Microsoft Defender for Identity (líneas 942–1014)
- Microsoft Defender for Cloud Apps (líneas 1015–1044)
- Microsoft Defender for Cloud (líneas 1045–1074)
- Microsoft Purview (líneas 1075–1093)
- Microsoft Entra ID Protection (líneas 1094–1111)
- Microsoft Secure Score (líneas 1112–1124)

## 4 · Ingesta

Línea 1125. 9 lecturas.

- 4 · Ingesta (líneas 1125–1144)
- Mapa principal (líneas 1145–1173)
- Origen (líneas 1174–1194)
- Conector o ruta (líneas 1195–1223)
- Tipo de conexión (líneas 1224–1234)
- Data collection method (líneas 1235–1243)
- Configuración clave (líneas 1244–1335)
  - Microsoft Defender XDR (línea 1248)
  - Microsoft Entra ID, Microsoft 365 y Purview (línea 1254)
  - Microsoft Defender for Cloud (línea 1263)
  - Configuración de API y conectores personalizados (línea 1269)
  - Windows Security Events y WEF (línea 1277)
  - Syslog y CEF mediante AMA (línea 1305)
  - Actividad de Azure mediante Diagnostic settings (línea 1316)
  - Custom Data Collection de MDE (línea 1328)
- Transformación (líneas 1336–1349)
- Tabla (líneas 1350–1368)

## 5 · Almacenamiento y Retención

Línea 1369. 8 lecturas.

- 5 · Almacenamiento y Retención (líneas 1369–1371)
- 1 · Mapa de almacenes (líneas 1372–1394)
- 2 · Microsoft Defender XDR (líneas 1395–1405)
- 3 · Microsoft Entra ID (líneas 1406–1417)
- 4 · Microsoft Purview Audit (líneas 1418–1462)
- 5 · Log Analytics Workspace + Sentinel y Data lake (líneas 1463–1505)
- 6 · Modelo de costes de Sentinel (líneas 1506–1526)
- 7 · Optimización y coste del workspace (líneas 1527–1546)

## 6 · Threat Intelligence

Línea 1547. 1 lecturas.

- 6 · Threat Intelligence (líneas 1547–1600)

## 7 · Detección y alertas

Línea 1601. 6 lecturas.

- 7 · Detección y alertas (líneas 1601–1654)
- Los motores nativos (líneas 1655–1666)
- Las reglas que escribe el analista (líneas 1667–1828)
  - Reglas Scheduled (línea 1687)
  - Reglas NRT (línea 1725)
  - Custom detection rules de Defender XDR (línea 1737)
- Motores de lógica administrada (líneas 1829–1839)
- Lo que no alerta aunque lo parezca (líneas 1840–1846)
- Anatomía, supresión y cobertura de la alerta (líneas 1847–1879)

## 8 · Correlación e incidentes

Línea 1880. 3 lecturas.

- 8 · Correlación e incidentes (líneas 1880–1933)
- Quién correlaciona (líneas 1934–1962)
- El incidente ya formado (líneas 1963–1986)

## 9 · Investigación

Línea 1987. 7 lecturas.

- 9 · Investigación (líneas 1987–2028)
- 1. El incidente como punto de partida (líneas 2029–2049)
- 2. Pivote por entidad (cuando el incidente no alcanza) (líneas 2050–2058)
- 3. Service & Detection Source (líneas 2059–2073)
- 4. Actividad de Microsoft 365 (líneas 2074–2082)
- 5. Alertas de IRM y DLP (motores que ya decidieron, no consultas) (líneas 2083–2094)
- 6. Security Copilot (capa transversal, no un paso más) (líneas 2095–2104)

## 10 · Hunting

Línea 2105. 4 lecturas.

- 10 · Hunting (líneas 2105–2145)
- 1 · Formular la pregunta o hipótesis (líneas 2146–2161)
- 2 · Elegir la superficie, conservar el hallazgo y decidir si debe repetirse (líneas 2162–2175)
- 3 · Consultar, interpretar y ampliar (líneas 2176–2235)
  - Advanced Hunting (línea 2179)
  - Logs (línea 2191)
  - Data lake exploration (línea 2207)
  - Workbooks (línea 2217)
  - Servidor MCP de Sentinel (línea 2220)
  - Sentinel Graph (línea 2224)

## 11 · Respuesta y remediación

Línea 2236. 5 lecturas.

- 11 · Respuesta y remediación (líneas 2236–2253)
- 1 · Ejecutar la acción sobre el activo (líneas 2254–2354)
  - Dispositivo · MDE (línea 2256)
  - Fichero · MDE (línea 2270)
  - Identidad · Entra ID Protection y MDI (línea 2283)
  - Correo · MDO (línea 2300)
  - Aplicaciones y archivos SaaS · MDCA (línea 2314)
  - Recursos cloud · MDC (línea 2328)
  - Datos · Purview (línea 2346)
- 2 · Live response para remediar (líneas 2355–2369)
- 3 · Action center (líneas 2370–2383)
- 4 · Verificar y recuperar (líneas 2384–2389)

## 12 · Automatización

Línea 2390. 6 lecturas.

- 12 · Automatización (líneas 2390–2407)
- 1 · Automatización nativa de Defender (líneas 2408–2442)
  - ZAP: protección después de la entrega (línea 2409)
  - AIR: investigación y remediación (línea 2412)
  - Automatic attack disruption (línea 2434)
- 2 · Reglas de automatización de Sentinel (líneas 2443–2462)
- 3 · Playbooks y orquestación (líneas 2463–2495)
- 4 · Comprobar la ejecución y notificar (líneas 2496–2510)
- 5 · Acciones (líneas 2511–2516)

## 13 · Mapa de tablas y relaciones KQL

Línea 2517. 7 lecturas.

- 13 · Mapa de tablas y relaciones KQL (líneas 2517–2520)
- 1 · Orientarse antes de escribir KQL (líneas 2521–2532)
- 2 · Defender XDR (líneas 2533–2599)
  - Alertas y evidencias (línea 2537)
  - Endpoint (línea 2546)
  - Correo, Teams y vínculos (línea 2566)
  - Identidades, aplicaciones y relaciones (línea 2579)
- 3 · Tablas esenciales del workspace de Sentinel (líneas 2600–2638)
- 4 · Relaciones que sí conviene memorizar (líneas 2639–2655)
- 5 · KQL que hay que manejar (líneas 2656–2733)
  - Visualizar con render (línea 2710)
  - Funciones guardadas y parsers ASIM (línea 2725)
- 6 · Patrones de consulta que debes comprender (líneas 2734–2810)
  - Alerta con sus evidencias (línea 2736)
  - Password spray en los inicios de sesión del workspace (línea 2758)
  - Del clic permitido al proceso iniciado después (línea 2770)
  - Estado más reciente de cada dispositivo (línea 2792)
  - Eventos ASR en Audit (línea 2801)

