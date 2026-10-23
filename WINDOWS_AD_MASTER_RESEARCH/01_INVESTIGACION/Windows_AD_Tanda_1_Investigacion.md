---
title: "Windows + Active Directory | Investigación técnica"
subtitle: "Tanda 1/4 · Windows cliente y Windows Server"
author: "Informe de investigación · enfoque Administración, SOC y Red Team autorizado"
date: "18 de octubre de 2026"
lang: es
---

# TANDA 1 — WINDOWS CLIENTE Y WINDOWS SERVER

**Investigación documental y propuesta curricular.** Arquitectura, identidad local, privilegios, procesos, servicios, NTFS, registro, PowerShell, operación, red, actualización, hardening, telemetría de origen y diagnóstico.

> **Alcance:** la fuente de requisitos es `adwin(1).txt` (apartado Windows y administración). Esta entrega corresponde a la primera de cuatro tandas. **No se han instalado programas, ejecutado laboratorios ni auditado los 155 apuntes mencionados en un documento diferente.** Las prácticas son diseños verificables, no resultados empíricos. La parte completa de Active Directory, AD CS, Red Team y SOC se abordará en tandas posteriores.

## 0. Resumen ejecutivo y decisiones

La competencia en seguridad Windows requiere tres planos que deben enseñarse conjuntamente, pero evaluarse por separado:

1. **Operación:** instalar, configurar, administrar, automatizar y recuperar un host Windows sin comprometer su servicio.
2. **Seguridad del host:** razonar sobre usuarios, tokens, permisos, procesos y superficies de administración; implementar controles y verificar que funcionen.
3. **Evidencia:** observar actividad mediante herramientas y registros locales, distinguir hipótesis de hechos, conservar contexto y diagnosticar causas raíz.

**Decisiones de arquitectura curricular:**

- Referencia primaria: **Windows 11 26H2** y **Windows Server 2025**. Se contemplan Windows 11 25H2 y Server 2022 como entornos alternativos / heredados; verificar siempre edición, build y nivel de parche antes de aplicar comandos. [F01–F03]
- Enseñar **Server Core y Desktop Experience**. Core debe ser administrable mediante `sconfig`, PowerShell o herramientas remotas, sin depender de la GUI. [F03]
- Enseñar **Windows PowerShell 5.1 y PowerShell 7 en paralelo**. Son productos relacionados, pero no equivalentes en módulos, remoting, rutas ni logs. [F10–F11]
- Evaluar **administración antes de ataque**: quien identifica una ACL débil debe poder explicar la ACL correcta y restaurarla.
- **No duplicar** guías de KQL, SPL, Sentinel ni Splunk. En esta tanda solo se estudian mecanismos y pruebas de **origen** Windows; integración y correlación profunda, en la tanda SOC.
- Introducir desde el principio seguridad operacional: **leer primero, cambiar después**, copia de configuración antes de modificar, evidencia antes de contención cuando sea viable y autorización para tareas disruptivas.

### Resultado esperado

Al terminar esta tanda, un estudiante competente debería poder:

- Explicar la cadena de arranque y distinguir modo usuario de kernel, proceso de servicio y token de identidad.
- Administrar usuarios y grupos locales, derechos, permisos NTFS y permisos de compartición; identificar acceso efectivo.
- Inventariar software, procesos, servicios, conexiones, tareas y configuración sin introducir alteraciones innecesarias.
- Automatizar comprobaciones idempotentes con PowerShell, exportar resultados y gestionar errores.
- Configurar y diagnosticar Windows Firewall, DNS cliente, SMB, WinRM/PowerShell Remoting y servicios asociados.
- Diferenciar hardening **prescrito** de hardening **comprobado**.
- Localizar las evidencias que un host puede generar, comprobar prerrequisitos de auditoría y describir límites de observabilidad.
- Formular hipótesis de diagnóstico, probarlas, encontrar causa raíz, remediar en un laboratorio y demostrar recuperación.

## 1. Vigencia, ediciones y selección de plataformas

| Sistema | Estado relevante a 18/10/2026 | Uso pedagógico |
|---|---|---|
| Windows 11 26H2 | Disponibilidad general 29/09/2026; verificar variaciones de despliegue por hardware/edición. [F01] | Cliente principal |
| Windows 11 25H2 | Rama anterior aún mantenida. [F01] | Cliente alternativo |
| Windows Server 2025 LTSC | Lanzado 01/11/2024. Fin estándar 2029 y extendido 2034. [F02] | Servidor principal |
| Windows Server 2022 LTSC | Soporte estándar finalizado 13/10/2026; soporte extendido hasta 2031. [F02] | Administración de legado |
| Windows 10 22H2 | Soporte general finalizado 14/10/2025; existen programas/ediciones con condiciones distintas. | Solo legado / análisis contextual |

**Advertencia:** soporte de producto y disponibilidad de una función no equivalen a licencia para utilizarla; algunas capacidades dependen de SKU, configuración, hardware, políticas, suscripción o derechos de virtualización. Los costes y términos concretos del laboratorio **no están validados** en esta tanda.

### 1.1. Windows cliente frente a Windows Server

Windows cliente se orienta a sesiones interactivas, productividad y gestión de dispositivos. Windows Server ofrece roles y capacidades de infraestructura (DNS, archivos, virtualización, AD DS, etc.) con configuraciones y modelos de administración diferentes. No se debe enseñar «Windows Server = Windows 11 con más opciones»; difieren las superficies operativas y condiciones de despliegue.

### 1.2. Server Core y Desktop Experience

| Propiedad | Server Core | Desktop Experience |
|---|---|---|
| GUI estándar | Ausente | Presente |
| Administración | PowerShell, SConfig, WinRM, WAC, MMC remota | Lo anterior + interfaz local |
| Exposición operativa | Menos componentes gráficos instalados | Más componentes, según función |
| Riesgo pedagógico | Aprendizaje incorrecto si se confunde «sin GUI» con «sin administración» | Dependencia excesiva de asistentes |
| Elección | Preferible si los roles/aplicaciones son compatibles | Si alguna necesidad concreta exige escritorio |

Microsoft recomienda Core salvo necesidad específica de GUI; no se debe enseñar un cambio in situ entre las dos opciones de instalación: la conversión exige una reinstalación según la documentación actual. [F03]

**Práctica observacional:** registrar edición, compilación y modalidades de instalación con `Get-ComputerInfo`, `systeminfo` y herramientas de información del sistema. Comprobar resultados entre Windows 11 y Server.

## 2. Arquitectura interna: los conceptos que explican los incidentes

### 2.1. Secuencia de arranque y cadena de confianza

Modelo didáctico: firmware UEFI/BIOS → gestor de arranque → cargador de Windows → kernel y controladores necesarios → procesos de sistema → subsistemas, servicios e inicio de sesión. La secuencia exacta depende del modo de arranque, la versión y la configuración. Diferenciar:

- **UEFI / Secure Boot:** confianza en componentes de arranque; no reemplaza el parcheo del sistema.
- **TPM y BitLocker:** protección de claves y volumen, especialmente frente a extracción fuera de línea; puede exigir procedimientos de recuperación documentados.
- **Kernel y controladores:** componentes de alta confianza; un fallo de controlador puede provocar BSOD o afectar red/almacenamiento.
- **Event Log y servicios de seguridad:** no todos los artefactos existen desde el primer instante del arranque.

**SOC:** precisar qué parte de la secuencia está observada y qué parte es inferencia. **Red Team autorizado:** evaluar exposición de arranque/almacenamiento solo en laboratorio, sin alterar firmware de equipos de terceros.

### 2.2. Modo usuario, modo kernel, procesos y hilos

Windows utiliza separación de privilegios entre código en **user mode** y **kernel mode**. Un proceso es un contenedor de recursos (espacio virtual de direcciones, handles, token, etc.); un hilo es la unidad de ejecución programable. Múltiples hilos pueden vivir en un proceso; un servicio no equivale necesariamente a un proceso único.

Los conceptos imprescindibles son: PID/TID, proceso padre, token primario, handles, DLL cargadas, espacios de memoria, memoria virtual, pagefile, I/O, controladores, firma de binarios y rutas de ejecutables. Un PID puede reutilizarse: **identificar una ejecución por PID + hora + host y contexto**, no solo por número.

Herramientas recomendadas: Administrador de tareas, Monitor de recursos, `Get-Process`, `Get-CimInstance Win32_Process`, `tasklist /svc`, Process Explorer y Process Monitor (uso controlado, volumen elevado). Process Explorer aporta relación entre procesos, cuentas, handles y módulos. [F12]

### 2.3. Procesos de sistema y superficies sensibles

Conocer, sin confundir sus funciones, `System`, `smss.exe`, `csrss.exe`, `wininit.exe`, `services.exe`, `svchost.exe`, `winlogon.exe` y `lsass.exe`. La lista de procesos legítimos y su topología **varía** con build, arranque y servicios instalados. No establecer reglas basadas únicamente en el nombre.

- `services.exe`: Service Control Manager (SCM), punto central de administración de servicios.
- `svchost.exe`: alojamiento de determinados servicios Windows; no implica que todos los servicios vivan en un `svchost`.
- `lsass.exe`: proceso de autoridad de seguridad local (LSA). Su función es crítica y existen protecciones modernas como LSA Protection y Credential Guard. [F16]

**Limitación crucial:** que un binario esté firmado no prueba que la operación concreta sea legítima. La investigación requiere ruta, editor, argumentos, parent-child, cuenta, conexiones, cambios y tiempo.

## 3. Identidad y seguridad local

### 3.1. SAM, LSA, SID y autenticación

Una cuenta local tiene identidad y atributos gestionados localmente, con información de seguridad en la SAM. La LSA participa en la política de seguridad y los procesos de autenticación; LSASS es su proceso principal. **No confundir SAM con Active Directory**: pertenecer a un grupo local y pertenecer a un grupo de dominio son hechos diferentes.

Un **SID** identifica un principal de seguridad de forma más estable que el nombre visible. Cambiar el nombre de una cuenta no implica cambiar su SID. Los grupos aportan SIDs al contexto de seguridad; las pertenencias y restricciones determinan su uso efectivo.

### 3.2. Access token, derechos y privilegios

El token primario de un proceso incluye identidad, grupos, privilegios y otros atributos del contexto; un hilo también puede operar con token de suplantación. Privilegios tales como `SeBackupPrivilege` no son lo mismo que permisos NTFS sobre una ruta. Un token de usuario elevado no es idéntico al token filtrado por UAC. [F04]

**Modelo mental correcto:** identidad del sujeto (SID, grupos, token) + descriptor del objeto (owner, DACL y otros elementos) + tipo de acceso solicitado → decisión de autorización. Los detalles varían entre recursos y operaciones.

### 3.3. UAC e integridad

UAC separa experiencias estándar y elevadas y reduce la ejecución accidental con privilegios administrativos. No es frontera absoluta frente a todos los adversarios ni sustituye la separación real de cuentas. Distinguir:

- Cuenta estándar vs. miembro de administradores locales.
- Proceso normal vs. elevado.
- Token filtrado vs. token elevado; niveles de integridad.
- Privilegio requerido para tarea, no «siempre ejecutar como administrador».

**Práctica:** comparar `whoami /user`, `whoami /groups`, `whoami /priv` y el contexto de dos consolas (sin elevación y elevadas) en un equipo de laboratorio. Documentar diferencias y cuándo aparecen.

### 3.4. Descriptores, DACL, SACL, ACE, herencia y propietario

| Concepto | Qué representa | Error frecuente |
|---|---|---|
| Owner | Propietario de un objeto protegible | Confundir propiedad con permiso irrestricto |
| DACL | ACE que permiten/deniegan derechos | Asumir que una DACL vacía equivale a DACL nula |
| SACL | Información de auditoría / control aplicable según objeto | Suponer que auditar se activa solo añadiendo SACL |
| ACE | Entrada individual de identidad + máscara/tipo de acceso | Leer «Allow» sin considerar orden, herencia y contexto |
| Herencia | Propagación de ACE en jerarquías | Diagnosticar solo permisos explícitos |
| SID | Identificador de principal | Interpretar únicamente el nombre mostrado |

Una **DACL nula** puede conceder acceso general, mientras una **DACL vacía** deniega el acceso discrecional: no son equivalentes. Los descriptores de seguridad incluyen campos de propietario, DACL y SACL, pero los objetos y APIs tienen matices. [F05]

### 3.5. NTFS, permisos de compartición y acceso efectivo

Una carpeta SMB añade una capa de autorización de compartición a la autorización de NTFS y demás controles; el acceso real depende del conjunto aplicable. La herencia NTFS, las ACE de denegación, los grupos y el token concreto dificultan inferir acceso efectivo leyendo una única entrada.

**Demostración segura:** carpeta temporal `C:\Lab-Win\Datos`, usuarios locales de prueba, permisos de lectura/escritura, acceso directo y mediante recurso SMB aislado; comprobar y restaurar ACL, guardar antes un respaldo de su configuración.

Comandos **solo lectura** útiles:

```powershell
whoami /all
Get-LocalUser
Get-LocalGroup
Get-LocalGroupMember -Group 'Administrators'
Get-Acl 'C:\Lab-Win\Datos' | Format-List
icacls 'C:\Lab-Win\Datos'
Get-SmbShare
Get-SmbShareAccess -Name 'NombreDeRecurso'
```

`Get-SmbShareAccess` requiere un recurso existente y permisos pertinentes. No asumir que esos comandos funcionarán igual en todas las ediciones, políticas o versiones de PowerShell. `icacls` documenta lectura, verificación y cambios de DACL. [F06]

**SOC:** los eventos de acceso a archivos dependen de políticas de auditoría y SACL aplicables; no todo acceso queda registrado por defecto. **Red Team autorizado:** analizar derechos innecesarios y su impacto demostrable con cuentas de prueba, sin exponer carpetas reales.

## 4. Servicios, tareas, registro, WMI y persistencia legítima

### 4.1. Administración de servicios

Un servicio posee nombre, tipo, ruta/configuración, identidad de ejecución, estado y, en algunos casos, dependencias. Las configuraciones inseguras de ruta, binario, permisos del servicio o cuenta pueden producir riesgo. Ciertas configuraciones son válidas por diseño: una ruta con espacios **no basta** para concluir explotabilidad.

```powershell
Get-Service | Sort-Object Name
Get-CimInstance Win32_Service |
  Select-Object Name, State, StartMode, StartName, PathName
sc.exe qc Spooler
```

**Triángulo de validación:** configuración del SCM + ACL del servicio/archivo + cuenta y contexto real de arranque. Investigar también errores de dependencias, fallos repetidos, recuperación automática y eventos asociados.

**Prohibición operativa en diagnóstico inicial:** no matar PID ni deshabilitar servicios como primera reacción ante una alerta de red. Podría detener un servicio compartido, provocar pérdida de datos o destruir evidencia.

### 4.2. Tareas programadas

Investigar triggers, principal/cuenta, acciones, condiciones, historiales y última ejecución. Un trabajo periódico puede ser completamente legítimo. No equivale a cron: Windows tiene su propio servicio y modelo de seguridad.

```powershell
Get-ScheduledTask | Select-Object TaskPath, TaskName, State
Get-ScheduledTaskInfo -TaskName 'NombreDePrueba'
```

La segunda línea requiere adaptar el nombre a una tarea existente. Enseñar cambios en laboratorio con un objetivo administrativo (inventario diario), no con técnicas persistentes encubiertas.

### 4.3. Registro Windows

Jerarquías clave: `HKLM`, `HKCU`, `HKU`, `HKCR` y `HKCC` (vistas y alias según caso). Distinguir **hives**, claves, valores y tipos (`REG_SZ`, `REG_DWORD`, `REG_MULTI_SZ`, etc.), vistas 32/64 bits y configuración volátil o persistente.

```powershell
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\ComputerName\ComputerName'
```

El registro no reemplaza ni agota las fuentes de configuración: existen GPO, CSP/MDM, archivos, bases de datos y opciones propias de cada servicio. **No editar directamente claves sensibles** cuando existe una herramienta o API soportada.

### 4.4. WMI/CIM

WMI/CIM ofrece inventario y consulta de recursos Windows. Diferenciar proveedor, clase, namespace, instancia y permisos. En administración moderna, preferir cmdlets CIM cuando proceda; no asumir que toda propiedad se puede modificar por escribirla.

```powershell
Get-CimInstance Win32_OperatingSystem |
  Select-Object Caption, Version, BuildNumber, LastBootUpTime
Get-CimInstance Win32_LogicalDisk |
  Select-Object DeviceID, DriveType, Size, FreeSpace
```

**SOC:** procesos, tareas y cambios en WMI pueden ser relevantes, pero requieren cobertura y fuente específica. **Red Team:** análisis de superficies de autorización y persistencia, en modo de auditoría, sin crear suscripciones WMI maliciosas.

## 5. PowerShell: administrar con garantías y no solo ejecutar comandos

### 5.1. Dos entornos que no debemos confundir

| Dimensión | Windows PowerShell 5.1 | PowerShell 7.x |
|---|---|---|
| Ejecutable habitual | `powershell.exe` | `pwsh.exe` |
| Plataforma base | .NET Framework | .NET moderno; multiplataforma |
| Instalación | Habitual en Windows | Se instala de forma paralela |
| Módulos | Integración amplia con módulos heredados Windows | Compatibilidad variable, a verificar por módulo |
| Remoting | Principalmente WSMan/WinRM | WSMan y SSH según plataforma/configuración |
| Telemetría | Canales y políticas propios | Canales y configuración distintos en varios escenarios |

PowerShell 7 **no reemplaza** en sitio Windows PowerShell 5.1, y sus módulos no son universalmente intercambiables. Verificar `$PSVersionTable`, `Get-Module -ListAvailable` y disponibilidad real antes de diseñar automatizaciones. [F10–F11]

### 5.2. Ruta de competencia técnica

1. **Descubrimiento:** `Get-Command`, `Get-Help`, `Get-Member`.
2. **Objetos y pipeline:** filtrar antes de formatear, `Where-Object`, `Select-Object`, `Group-Object`, exportación.
3. **Datos:** CSV, JSON, fechas UTC, codificación, conversión de tipos.
4. **Automatización:** funciones, módulos, parámetros validados, `try/catch`, `-ErrorAction Stop`, `-WhatIf` cuando esté soportado.
5. **Higiene:** no escribir credenciales, secretos ni contenido sensible en argumentos o salidas; minimizar ejecución elevada.
6. **Seguridad:** ejecución firmada/política como capa de gobernanza, **no** como límite definitivo de seguridad; controles reales: permisos, JEA, control de aplicaciones, registro y restricciones de ejecución apropiadas.

**Ejemplo de inventario de solo lectura con evidencia reproducible:**

```powershell
$stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$hostName = $env:COMPUTERNAME
$target = Join-Path $env:TEMP "inventory-$hostName-$stamp.csv"
Get-CimInstance Win32_Service |
  Select-Object Name, State, StartMode, StartName, PathName |
  Export-Csv -Path $target -NoTypeInformation -Encoding UTF8
Get-FileHash -Path $target -Algorithm SHA256
```

**Criterios de evaluación:** resultado válido, rutas documentadas, hora UTC, integridad SHA-256, permisos sobre el fichero, errores tratados y ausencia de datos secretos. Un CSV con información de cuentas y rutas puede ser sensible: limitar su acceso y borrarlo según política tras la evaluación.

### 5.3. Remoting, WinRM y administración delegada

`Enter-PSSession`, `Invoke-Command` y `New-PSSession` permiten administración remota con distintos modelos. Windows Server mantiene habilitado el remoting de PowerShell en condiciones por defecto desde versiones anteriores; Windows cliente puede requerir configuración. No abrir WinRM indiscriminadamente a Internet. [F13]

```powershell
Get-Service WinRM
Test-WSMan localhost
Get-NetFirewallProfile
```

No asumir que un `Test-WSMan` exitoso implica que la autenticación, autorización o elevación remota esté bien configurada. Diferenciar listener, transporte, firewall, autenticación y permisos del endpoint. **JEA (Just Enough Administration)** permite restringir los comandos y operaciones disponibles para funciones de administración delegadas. [F14]

### 5.4. Eventing de PowerShell

Module Logging, Script Block Logging y transcripción sirven para observabilidad y auditoría; tienen diferencias de cobertura, volumen, privacidad y configuración por edición/versión. El registro de bloques puede incluir secretos presentes en scripts o parámetros: **activar sin gobierno de acceso crea exposición adicional**. [F15]

En la tanda SOC se detallarán eventos, prerrequisitos de habilitación y pruebas de cobertura. Aquí basta que el administrador sepa identificar **qué motor** y **qué configuración** están en uso.

## 6. Redes y servicios Windows desde la perspectiva del host

No sustituye al mundo Redes: aquí interesa cómo Windows resuelve, establece conexiones y aplica políticas.

### 6.1. Pila mínima de diagnóstico

- Interfaz/adaptador y dirección: estado, IPv4/IPv6, máscara, ruta, DNS configurado.
- Resolución: stub resolver Windows, caché, servidor consultado, sufijos; fallo DNS **no implica** fallo de red física.
- TCP/UDP: socket, dirección local, remota, estado, PID y proceso responsable.
- Firewall: perfil Domain/Private/Public, reglas efectivas, dirección de tráfico, ámbito y origen de política.
- Servicios habituales: SMB (445/TCP), RDP (3389/TCP), WinRM (5985/5986 según listener) y DNS cliente (53/TCP/UDP). **Que un puerto sea típico no demuestra que un servicio esté presente ni autorizado.**

```powershell
Get-NetIPConfiguration
Get-DnsClientServerAddress
Resolve-DnsName example.org
Get-NetRoute | Select-Object -First 12
Get-NetTCPConnection | Select-Object -First 20
Get-NetFirewallProfile
Test-NetConnection example.org -Port 443
```

**Precisión esencial para un escenario de exfiltración:** `Get-NetTCPConnection` solo expone conexiones presentes en ese instante. No demuestra ausencia de actividad anterior, no ofrece automáticamente el volumen transferido y no atribuye intención. El análisis requiere correlación con procesos, identidad, DNS, telemetría histórica, logs y contexto de negocio.

### 6.2. Windows Defender Firewall

El firewall de Windows es un control *stateful* con perfiles y reglas. Enseñar política de entrada/salida, reglas locales y de GPO, puertos remotos vs. locales, protocolos, servicios, programas y protección por alcance. En incidentes:

- Una regla de salida puntual puede reducir exposición, pero no es garantía de contención.
- El adversario podría variar IP/destino/proceso; la contención en red debe combinarse con aislamiento controlado, revocación de acceso y eliminación de la causa.
- No desactivar globalmente el firewall para «probar que funciona»; hacer cambios aprobados, acotados y reversibles. [F17]

### 6.3. SMB, RDP y acceso remoto

**SMB:** distinguir recurso compartido, credenciales, autenticación, permisos NTFS/compartición, firma y cifrado cuando proceda. **RDP:** distinguir habilitación, accesibilidad de red, autenticación, NLA, cuenta autorizada y controles de acceso. **WinRM:** distinguir canal de gestión de protocolos orientados a escritorio o archivos.

En Windows/AD avanzado se desarrollarán Kerberos/NTLM, SPN, delegación y conexiones a dominio. No mezclar aquí la autenticación local con el ticketing Kerberos de una infraestructura de dominio.

## 7. Actualizaciones, mantenimiento y continuidad de host

### 7.1. Política operacional de parches

Inventariar versión/build, parches, dependencias, ventana, pruebas de regresión, plan de reversión y evidencias de cumplimiento. No confundir `HotFixID` con inventario integral de todo software y controladores.

```powershell
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 12
Get-Service wuauserv, bits -ErrorAction SilentlyContinue
```

Distinguir Windows Update, Microsoft Update, WSUS y sistemas corporativos de administración, que requieren licencias/diseños según entorno. La estrategia apropiada depende de tamaño y dependencia operacional.

### 7.2. Diagnóstico y recuperación de integridad

Evaluar problemas de arranque, controladores, espacio, disco, componentes, actualización y logs. `DISM /Online /Cleanup-Image /ScanHealth`, `/RestoreHealth` y `sfc /scannow` son herramientas de diagnóstico/reparación, **no** un sustituto del análisis de causa raíz. Ejecutar una reparación altera el sistema y puede afectar evidencia, por lo que requiere autorización en una investigación forense. [F18–F19]

**Orden de respuesta a fallo de servicio:** identificar síntoma → alcance → último cambio → dependencias → logs y métrica → hipótesis → prueba acotada → solución → comprobación → documentación.

### 7.3. Backup y rollback

En la primera tanda: restauración de archivos/estado del host y registros de cambios. **La recuperación de AD DS, System State de controladores de dominio, restauración de bosque y SYSVOL** queda reservada para la tanda 4. Un snapshot de VM **no sustituye** una estrategia completa de backup, ni se debe recomendar restauración indiscriminada de snapshots de controladores de dominio.

## 8. Endurecimiento y límites reales de los controles

| Control | Objetivo | Qué verificar | Limitación a enseñar |
|---|---|---|---|
| Microsoft Defender Antivirus | Prevención/análisis antimalware | Estado, firmas, exclusiones, eventos | Una alerta ausente no demuestra host limpio |
| LSA protection / Credential Guard | Reducir exposición de credenciales y código en LSA | Disponibilidad real, VBS, estado y requisitos | Cobertura depende de versión, hardware, configuración; no elimina todo robo de credenciales [F16] |
| BitLocker / TPM | Protección de datos fuera de línea | Estado, método, custodia de recovery keys | No evita todas las acciones con sesión iniciada |
| Windows Defender Firewall | Restringir tráfico por política | Perfiles, reglas efectivas, cobertura | No garantiza bloqueo de actividad autorizada |
| App Control for Business | Política de ejecución de software/código | Modo auditoría/obligatorio, política aplicada, eventos | Despliegue y compatibilidad críticos |
| AppLocker | Control por reglas y grupos | Colecciones, enforcement, auditoría | Defensa en profundidad; Microsoft diferencia sus garantías de App Control [F08] |
| AMSI | Interfaz para inspección de contenido por proveedor antimalware | Presencia de proveedor y resultados observables | No equivale a análisis universal de todos los scripts [F20] |
| ETW | Infraestructura de tracing | Provider, sesión, eventos, pérdidas | El evento existe solo si hay proveedor/captura adecuada [F21] |
| Script Block Logging | Telemetría PowerShell | Edición, directiva, canal, acceso a logs | Puede capturar datos confidenciales [F15] |
| JEA | Administración delegada restringida | Role capabilities, endpoint, pruebas negativas | Requiere diseño, revisión y mantenimiento [F14] |

Microsoft dispone de baselines y herramientas para comparar configuraciones (Security Compliance Toolkit); Windows Server 2025 dispone de guía oficial de baselines mediante OSConfig. **Una baseline es un punto de partida**, no una garantía ni sustituto de pruebas de funcionamiento. [F09]

**Regla de evaluación:** configuración declarada + verificación efectiva + prueba negativa controlada + evidencia + plan de reversión.

## 9. Registros nativos y preservación: la frontera con la tanda SOC

La infraestructura básica de observabilidad en Windows incluye Windows Event Log, proveedores ETW, auditoría avanzada y, si se instala y configura, Sysmon. El marco de registro local no implica que todos los eventos estén activos ni se conserven el tiempo deseado.

### 9.1. Fuentes que deben reconocerse

| Fuente | Uso orientativo | Precaución |
|---|---|---|
| `Security` | Autenticación, auditoría de procesos, accesos/privilegios según política | Configuración de audit policy / SACL y permisos |
| `System` | Servicios, drivers, arranque y sistema | Falta de causalidad automática |
| `Application` | Eventos publicados por aplicaciones | Cobertura propia de cada app |
| `Microsoft-Windows-PowerShell/Operational` | Eventos operativos de Windows PowerShell | Dependen de edición y directivas |
| `PowerShellCore/Operational` | Registros relacionados con PowerShell 7 en escenarios aplicables | No son equivalentes a los de 5.1 |
| `Microsoft-Windows-WinRM/Operational` | Diagnóstico del servicio remoto | No equivale a historial completo de comandos |
| `Microsoft-Windows-Sysmon/Operational` | Telemetría adicional de Sysmon si está instalado | Configuración de reglas y errores/límites de cobertura |

Ejemplo de prerrequisitos: el evento **4688 (creación de proceso)** requiere habilitar la subcategoría correspondiente; el campo **línea de comandos** exige además una política específica. El campo puede contener credenciales en claro y requiere restricciones de lectura y tratamiento de datos. [F22]

Sysmon registra procesos, conexiones de red opcionales y otras actividades, pero **no analiza ni clasifica el comportamiento**. Por defecto, el evento de conexión de red (Sysmon ID 3) no se habilita automáticamente. Los timestamps de eventos Sysmon se expresan en UTC según Microsoft. [F23]

### 9.2. Comprobación local de cobertura — consultas seguras

```powershell
auditpol /get /category:*
wevtutil gl Security
Get-WinEvent -ListLog '*PowerShell*' | Select-Object LogName, IsEnabled, RecordCount
Get-WinEvent -LogName System -MaxEvents 10 |
  Select-Object TimeCreated, Id, ProviderName, LevelDisplayName
```

**Interpretación:** obtener un log no certifica que el sistema tenga cobertura suficiente para la actividad buscada. Se necesita evento esperado, condición de generación, prueba autorizada, retención y examen de pérdidas/ausencias.

### 9.3. Cadena mínima de evidencia

1. Anotar host, cuenta actuante, zona horaria y reloj del sistema; usar timestamps UTC para correlación.
2. Recoger contexto efímero (procesos y conexiones activas) con mínimos cambios posibles.
3. Exportar logs nativos relevantes sin borrarlos; documentar rango y origen.
4. Calcular hash de exportaciones; conservar permisos y ubicación de almacenamiento.
5. Registrar comandos ejecutados, hora, resultado y limitaciones.
6. Evitar concluir «no ocurrió» porque un log no contiene una fila; puede faltar política, fuente o retención.

Un curso de SOC profundo abordará los eventos exactos, correlación y detección; esta tanda solo crea la alfabetización del host.

## 10. Troubleshooting profesional: método basado en hipótesis

Un administrador competente no es quien memoriza más comandos, sino quien identifica la **causa raíz**, recupera el servicio y puede demostrar por qué su cambio era necesario.

### 10.1. Árbol de diagnóstico orientativo

| Síntoma | Comprobar primero | Evidencia observable | No concluir solo por… |
|---|---|---|---|
| Equipo sin acceso a recurso | interfaz, ruta, DNS, firewall, puerto, autenticación | IP/ruta, resolución, TCP, error concreto | ping fallido |
| Servicio no inicia | dependencias, cuenta, ruta, permiso, logs SCM | código de error, evento, config SCM | estado `Stopped` |
| Acceso denegado a fichero | token, DACL, herencia, EFS/otros controles, share | SID, ACL efectiva, tipo de acceso | ser administrador local |
| Rendimiento degradado | CPU, memoria, IO, cola, logs, workload | muestra temporal, métricas y proceso | una captura puntual |
| Windows Update falla | espacio, errores Windows Update, componentes, política | ID/código, hora, logs, estado | «reiniciar siempre lo arregla» |
| RDP no accesible | red, listener, firewall, NLA, usuario autorizado | prueba de puerto + logs + configuración | 3389 abierto |
| Actividad saliente sospechosa | proceso, identidad, destino, historial, red/host | proceso/servicio, DNS, eventos, contexto | IP desconocida o PID aislado |

### 10.2. Caso SOC simulado: salida masiva de datos

**Escenario:** aparece una alerta de varios gigabytes hacia un destino desconocido; el panel de sesiones muestra cero usuarios interactivos. No hay prueba de que el host esté libre de actividad: servicios, tareas, procesos bajo cuentas no interactivas, APIs y sesiones remotas pueden operar sin usuario interactivo visible.

**Respuesta técnica correcta de alto nivel:**

1. **Calificar criticidad y alcance**: qué host, cuánto tráfico, desde cuándo, sensibilidad de datos y confiabilidad del sensor.
2. **Contener según procedimiento**: aislamiento EDR/red del host o controles de salida bien definidos si el riesgo lo justifica; coordinar impacto en producción y continuidad.
3. **Preservar evidencia básica** antes de hacer cambios destructivos si el tiempo/impacto lo permite.
4. **Triangular atribución**: conexiones, PID, ruta binaria, cuenta, servicio/tarea, árbol de procesos, DNS, evento de creación y accesos a datos si existen.
5. **Erradicar causa** según hallazgo y validar que no existan otros mecanismos activos.
6. **Recuperar y monitorizar**, documentar falsos positivos y medidas preventivas.

**Por qué `kill PID` no es solución general:** un proceso puede ser benigno, un servicio reiniciarse, otra cuenta volver a ejecutar la tarea o un atacante ya haber obtenido datos. Bloquear una IP aislada puede ser insuficiente si el destino rota. El control debe centrarse en identidad, host, flujo, causa y arquitectura defensiva.

## 11. Diseño de prácticas para la tanda 1 (no ejecutadas)

Las siguientes propuestas están dimensionadas para VM aisladas, snapshots **solo como mecanismo de laboratorio** y cuentas sintéticas. Los tiempos son estimaciones docentes, no mediciones. Herramientas y licencias requieren validación específica antes de implementación.

| ID | Práctica | Objetivo | Evidencia mínima | Tiempo estimado |
|---|---|---|---|---|
| W01 | Inventario del host | Identificar versión, edición, servicios, procesos, recursos | informe CSV/JSON + SHA-256 | 1,5–2 h |
| W02 | Identidades y ACL | Diferenciar token, grupos, NTFS, herencia y share | tabla de acceso efectivo + ACL original/restaurada | 2–3 h |
| W03 | Servicio y fallo sembrado | Diagnosticar un servicio de prueba que no arranca | hipótesis, eventos, causa raíz y restauración | 2–3 h |
| W04 | PowerShell seguro | Función de inventario de solo lectura con errores y exportación | script, pruebas negativas, salida y hash | 3–4 h |
| W05 | Red/firewall de host | Localizar diferencia entre DNS, TCP, puerto y regla | mapa de pruebas y captura de reglas efectiva | 2–3 h |
| W06 | Telemetría nativa | Comprobar política de auditoría y visibilidad real | matriz esperado/observado/ausente + razones | 3–4 h |
| W07 | Hardening controlado | Aplicar solo un control soportado en modo seguro/prueba | antes/después, fallo permitido, reversión | 2–3 h |
| W08 | Incidente integrador | Resolver actividad sospechosa sin destruir evidencias | timeline, alcance, diagnóstico, contención y retest | 4–6 h |

### Ficha W02 · Identidades, token y permisos

- **Topología propuesta:** Windows 11 en VM aislada con un disco NTFS, dos usuarios locales sintéticos y una carpeta de prueba.
- **Preparación:** snapshot de laboratorio; registrar usuarios/grupos; crear archivo inocuo; exportar ACL de carpeta.
- **Tarea:** mostrar qué acciones realiza cada cuenta bajo permisos distintos. Comparar acceso de consola estándar/elevada, cambio de herencia y acceso por SMB solo si se habilita un recurso de prueba.
- **Restricciones:** no trabajar en carpetas del sistema ni en información real; no relajar permisos fuera de `C:\Lab-Win`.
- **Criterio de dominio:** anticipar el resultado de al menos cuatro accesos, explicar diferencias efectivas, restaurar ACL y comprobar la restauración.
- **Recuperación:** eliminar recursos sintéticos, comprobar usuarios y permisos originales, documentar estado final.

### Ficha W05 · Host, DNS, socket y firewall

- **Topología propuesta:** cliente Windows en red host-only/aislada y segundo endpoint sintético; no exposición a red pública.
- **Preparación:** servicios y puertos conocidos, registro de regla original, captura de rutas y DNS.
- **Tarea:** sembrar un error de DNS y, por separado, bloqueo de conexión TCP; diferenciar en evidencia si falla resolución o transporte; observar PID y regla pertinente.
- **Restricciones:** no desactivar Windows Firewall globalmente; no reutilizar direcciones o nombres de hosts ajenos.
- **Criterio de dominio:** justificar causa raíz con 2 o más pruebas independientes y revertir el cambio sin perder conectividad del laboratorio.
- **Recuperación:** restablecer regla y configuración DNS, validar de nuevo resolución y TCP.

### Ficha W08 · Respuesta a actividad saliente inesperada

- **Topología propuesta:** máquina Windows + servidor receptor de prueba dentro de red aislada; archivo de datos generado sin contenido sensible.
- **Preparación:** transferencia de archivo sintético previamente autorizada; logs del receptor y endpoint; reloj coherente.
- **Tarea:** partir de una alerta de salida, confirmar transferencia, asociarla a cuenta/proceso/servicio, escoger contención proporcional y demostrar ausencia posterior del flujo.
- **Restricciones:** nunca enviar archivos fuera de la red aislada ni realizar pruebas en servicios de terceros.
- **Criterio de dominio:** separar hipótesis de evidencia y argumentar por qué bloqueo de IP, terminación de PID y aislamiento del host tienen impactos distintos.
- **Recuperación:** detener emisor de prueba, revertir reglas, eliminar archivos sintéticos, conservar paquete de evidencias.

## 12. Propuesta de secuencia formativa y prerrequisitos

La investigación de la tanda 1 recomienda **9 etapas provisionales**, con avance por pruebas de dominio, no por lectura. El número final de etapas puede cambiar tras la integración con AD, SOC y Red Team.

| Etapa | Competencia | Prerrequisito real | Prueba de dominio |
|---|---|---|---|
| WIN-01 | Entorno, versiones y arranque | ninguno | identificar plataforma y diagnosticar arranque simulado |
| WIN-02 | Arquitectura y recursos | WIN-01 | explicar proceso, hilo, servicio, memoria y kernel con evidencia |
| WIN-03 | Identidad, tokens y permisos | WIN-02 | demostrar permisos efectivos y justificar UAC |
| WIN-04 | NTFS, archivos, shares | WIN-03 | corregir una ACL de prueba sin romper acceso previsto |
| WIN-05 | Servicios, registro y tareas | WIN-02–04 | diagnosticar servicio de prueba y restaurar configuración |
| WIN-06 | PowerShell administración | WIN-02–05 | inventario automatizado, reproducible y seguro |
| WIN-07 | Redes y acceso remoto | WIN-03 + WIN-06 + fundamentos Redes | discriminar DNS, conectividad, firewall y autorización |
| WIN-08 | Hardening y auditoría local | WIN-05–07 | medir aplicación y limitaciones de un control |
| WIN-09 | Diagnóstico e incidente integrador | WIN-01–08 | análisis, contención, recuperación y retest documentados |

**Grafo mínimo de dependencias:**

```text
WIN-01 -> WIN-02 -> WIN-03 -> WIN-04 -> WIN-05 -> WIN-06
                   \__________________________/
WIN-03 + WIN-06 + Redes-basico -> WIN-07
WIN-05 + WIN-06 + WIN-07 -> WIN-08 -> WIN-09
```

**Nota de diseño:** el grafo simplifica dependencias; la lista de prerrequisitos de la tabla es la autoridad para la versión preliminar. Posteriormente se descompondrá en lecciones con IDs estables y diagnósticos de entrada.

### Cómo evitar repetir contenido a quien ya viene de SOC / Red Team

El salto de nivel debe depender de evidencia observable, no de experiencia declarada. Proponer **diagnóstico práctico**:

- P1. Explicar qué representa un token y qué diferencia hay entre SID, privilegio y ACL (evaluación oral/caso).
- P2. Diagnosticar acceso denegado a carpeta sintética (ejecución).
- P3. Diagnosticar error de inicio de servicio ficticio (ejecución).
- P4. Obtener inventario con PowerShell, exportar y evidenciar integridad (ejecución).
- P5. Atribuir conexión a proceso y separar síntoma de causa probable (caso).
- P6. Indicar qué registros serían necesarios y qué condiciones faltan para generarlos (caso).

Quien apruebe demostrablemente algunos bloques podrá **omitir lecciones introductorias correspondientes**, pero mantendrá las prácticas integradoras de seguridad y operación.

### Criterios de evaluación propuestos

- **No aprobado:** resultado casual, sin prerrequisitos ni evidencia reproducible.
- **Básico:** ejecución correcta de una tarea guiada, con validación.
- **Competente:** selecciona método, registra antes/después y recupera de un error conocido.
- **Avanzado:** analiza alternativas e impacto, encuentra causa raíz no indicada y escribe remediación/retest.

Rubrica integradora (propuesta): exactitud técnica 25%; método y causa raíz 25%; evidencias y trazabilidad 20%; seguridad y reversibilidad 20%; claridad de informe 10%. **No es una puntuación validada externamente**: debe calibrarse con pilotos.

## 13. Conexiones con tandas y mundos posteriores

| Competencia T1 | Activa posteriormente | Qué NO se debe duplicar |
|---|---|---|
| SID, token, ACL y UAC | AD: grupos, ACL/ACE, delegación, Tier 0; Red Team: evaluación de permisos | no explicar otra vez acceso local desde cero |
| Windows DNS cliente y servicios | Redes + AD: DNS integrado, registros SRV, resolución de DC | no repetir toda la teoría de DNS de Redes |
| Servicios, tareas, WMI | SOC: visibilidad de ejecución; Red Team: auditoría de superficies | no repetir inventario básico de host |
| PowerShell 5.1/7 y remoting | AD: automatización; SOC: eventos y recolección; Red Team: revisión autorizada | no rehacer módulos de KQL/SPL |
| Eventos y auditoría local | SOC: cobertura/detecciones Sentinel y Splunk | no duplicar consultas ni conectores del SIEM |
| Hardening, Credential Guard, App Control | AD: protección cuentas privilegiadas, Tier 0 | no equiparar protección de host a seguridad total del dominio |
| Backup del host | Tanda 4: System State y recuperación AD | no enseñar snapshot DC como backup habitual |

## 14. Riesgos, lagunas y decisiones pendientes

1. **Licencias y costes:** no se ha probado la disponibilidad de imágenes de evaluación, derechos de virtualización ni recursos del entorno del estudiante. Validar antes de generar laboratorios publicados.
2. **Ediciones/roles:** varias opciones dependen de Windows Home/Pro/Enterprise, Server Standard/Datacenter o de características opcionales. Documentar matriz de compatibilidad en la futura implementación.
3. **Seguridad de aplicación:** AppLocker y App Control no son intercambiables; se necesita evaluación en modo auditoría, tolerancias y recuperación.
4. **Telemetry gap:** los eventos 4688, PowerShell y Sysmon dependen de políticas específicas y pueden exponer datos personales. Diseñar controles de volumen, acceso, retención y anonimización.
5. **Protecciones de credenciales:** validar VBS/LSA real y requisitos antes de afirmar que un host está protegido.
6. **Profundidad en internals:** teoría de kernel, memoria, IO y NTFS debe graduarse; el objetivo no es formar desarrolladores de drivers en la ruta central.
7. **No inferir Red Team = administrador:** un pentester que identifica permisos peligrosos puede no dominar rollback, parcheo o continuidad.
8. **Riesgo en cambios de producción:** modificar firewall, auditoría o políticas sin pruebas puede cortar servicios o producir pérdida de logs por volumen.
9. **Dependencias con Redes:** el estudiante debería dominar IP, TCP, DNS y segmentación; esta tanda usa esos conocimientos, no los sustituye.
10. **Verificación faltante:** no se ha ejecutado ninguno de los comandos en Windows 11 26H2 ni Server 2025; la compatibilidad sintáctica se basa en documentación, no en test de laboratorio.

## 15. Referencias oficiales verificadas

**Metodología de fuentes:** documentación pública consultada durante esta investigación el **18/10/2026**. Las fechas editoriales y aplicabilidad deben revisarse de nuevo al implementar las lecciones. `Alta` significa fuente primaria aplicable al hecho indicado, no que todos los supuestos del proyecto estén verificados. Los códigos [Fxx] en el documento remiten a las referencias siguientes.

| ID | Organización / documento | Afirmación principal / confianza |
|---|---|---|
| F01 | Microsoft Learn · Windows 11 release information | Disponibilidad de 26H2/25H2 y mantenimiento / Alta |
| F02 | Microsoft Learn · Windows Server release information | Fechas de soporte de Server 2025/2022 / Alta |
| F03 | Microsoft Learn · Server Core vs Desktop Experience | Administración de Core y elección de instalación / Alta |
| F04 | Microsoft Learn · Access Tokens | Token primario, grupos, privilegios, impersonation / Alta |
| F05 | Microsoft Learn · Security descriptors | Owner, DACL, SACL, ACL / Alta |
| F06 | Microsoft Learn · icacls | Interpretación y manejo de DACL NTFS / Alta |
| F07 | Microsoft Learn · Access Control Model | Modelo de autorización / Alta |
| F08 | Microsoft Learn · App Control and AppLocker | Diferencias y límites de control de aplicaciones / Alta |
| F09 | Microsoft Learn · Security Compliance Toolkit / OSConfig | Baselines y comparación / Alta |
| F10 | Microsoft Learn · PowerShell 5.1 vs 7.x | Diferencias y compatibilidad / Alta |
| F11 | Microsoft Learn · Install PowerShell 7 on Windows | Coexistencia con Windows PowerShell / Alta |
| F12 | Microsoft Sysinternals · Process Explorer | Procesos, handles y DLL / Alta |
| F13 | Microsoft Learn · Remote Requirements | WinRM y prerrequisitos remoting / Alta |
| F14 | Microsoft Learn · Just Enough Administration | Delegación restringida / Alta |
| F15 | Microsoft Learn · about_Logging | PowerShell Script Block y riesgos / Alta |
| F16 | Microsoft Learn · Credential Guard | Protección por VBS y límites / Alta |
| F17 | Microsoft Learn · Windows Firewall configuration | Políticas y gestión de firewall / Alta |
| F18 | Microsoft Learn · Repair a Windows Image | Uso de DISM / Alta |
| F19 | Microsoft Learn · sfc | Integridad de archivos protegidos / Alta |
| F20 | Microsoft Learn · AMSI + Defender Antivirus | Función de AMSI / Alta |
| F21 | Microsoft Learn · About Event Tracing | ETW providers, sessions, consumers / Alta |
| F22 | Microsoft Learn · Command-line Process Auditing | Prerrequisitos y privacidad de 4688 / Alta |
| F23 | Microsoft Sysinternals · Sysmon | Eventos, UTC y configuración de red / Alta |
| F24 | Microsoft Learn · Advanced Audit Policy | Configuración de categorías de auditoría / Alta |
| F25 | Microsoft Learn · wevtutil | Enumeración, consulta y exportación de logs / Alta |
| F26 | Microsoft Learn · auditpol | Consulta y administración de política de auditoría / Alta |

**Enlaces directos:**

- **F01:** https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information
- **F02:** https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info
- **F03:** https://learn.microsoft.com/en-us/windows-server/get-started/install-options-server-core-desktop-experience
- **F04:** https://learn.microsoft.com/en-us/windows/win32/secauthz/access-tokens
- **F05:** https://learn.microsoft.com/en-us/windows/win32/secauthz/security-descriptors
- **F06:** https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls
- **F07:** https://learn.microsoft.com/en-us/windows/win32/secauthz/access-control-model
- **F08:** https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/appcontrol-and-applocker-overview
- **F09:** https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/security-compliance-toolkit-10
- **F09b:** https://learn.microsoft.com/en-us/windows-server/security/osconfig/osconfig-how-to-configure-security-baselines
- **F10:** https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell
- **F11:** https://learn.microsoft.com/en-us/powershell/scripting/install/install-powershell-on-windows
- **F12:** https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer
- **F13:** https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_remote_requirements
- **F14:** https://learn.microsoft.com/en-us/powershell/scripting/learn/remoting/jea/overview
- **F15:** https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging
- **F16:** https://learn.microsoft.com/en-us/windows/security/identity-protection/credential-guard/
- **F17:** https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/configure
- **F18:** https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image
- **F19:** https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sfc
- **F20:** https://learn.microsoft.com/en-us/defender-endpoint/amsi-on-mdav
- **F21:** https://learn.microsoft.com/en-us/windows/win32/etw/about-event-tracing
- **F22:** https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing
- **F23:** https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon
- **F24:** https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/advanced-audit-policy-configuration
- **F25:** https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil
- **F26:** https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/auditpol

---

### Cierre y criterio de aceptación de esta tanda

**Hecho (documentación):** se identificaron las capas fundamentales de administración, los controles Windows, sus supuestos y varias referencias oficiales para su validación.

**Propuesta (diseño):** nueve etapas provisionales, ocho prácticas y un diagnóstico de competencias. Los tiempos, rúbrica y grafo son sugerencias revisables.

**No verificado:** ejecución real de laboratorios, licencias/costes de VMs, comportamiento de cada comando en las compilaciones de referencia, capacidades disponibles en una edición específica y correlación con los mundos SOC existentes.

**Salida hacia tanda 2:** arquitectura AD DS, DNS de dominio, sitios, replicación, FSMO, GPO, Kerberos/NTLM, LDAP, cuentas de servicio, ACL de directorio, delegación, trusts, Tier 0 y AD CS; sin volver a enseñar desde cero NTFS, tokens o PowerShell general.
