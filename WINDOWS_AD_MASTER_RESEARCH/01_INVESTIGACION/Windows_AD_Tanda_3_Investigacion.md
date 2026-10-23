---
title: "Windows + Active Directory | Investigación técnica"
subtitle: "Tanda 3/4 · Red Team autorizado y SOC nativo Windows/AD"
date: "2026-10-18"
lang: es
status: "Investigación documental; laboratorios diseñados, NO ejecutados"
---

# TANDA 3 — RED TEAM + SOC EN WINDOWS Y ACTIVE DIRECTORY

**Alcance:** metodología de evaluación autorizada; descubrimiento y exposición de privilegios en Windows/AD; autenticación, delegación, credenciales, movimiento lateral, GPO, AD CS; medición de controles, remediación y retest; auditoría avanzada y registros nativos de Windows/AD; PowerShell Logging, Sysmon, WEF, preservación, análisis y respuesta. **Fuera de alcance:** explotar organizaciones reales, extraer credenciales reales, desplegar persistencia, instrucciones de evasión, reglas KQL/SPL, operación de Sentinel o Splunk y ejecución de pruebas sobre sistemas del usuario.

**Procedencia:** temas pedidos en `adwin(1).txt`; continuidad con `Windows_AD_Tanda_1_Investigacion.md` y `Windows_AD_Tanda_2_Investigacion.md`. Investigación documental contrastada con Microsoft Learn, Sysinternals y MITRE ATT&CK, consultados el **18/10/2026**. Los IDs [Rxx] enlazan la bibliografía al final. **Ningún laboratorio, comando o configuración ha sido probado por el asistente**: toda actividad operativa es propuesta, no resultado. No se auditaron los 155 Markdown del otro encargo, que no forman parte del prompt actual.

## 0. Hallazgos y decisiones centrales

1. El Red Team no debe enseñarse como una lista de herramientas; cada técnica requiere **precondición, ruta de acceso, control que la permitiría, evidencia esperable, impacto mínimo y remediación verificable**. [R01, R02, R20]
2. **Visibilidad no equivale a detección**. Un evento puede registrarse sin haberse configurado su recolección, sin contextualización y sin indicar actividad maliciosa. No convertir un Event ID en un veredicto. [R03–R09]
3. **El host que produce un evento importa**: 4768/4769 se generan principalmente en el KDC/DC, mientras 4624 se registra en el sistema de destino. Las fuentes deben relacionarse mediante identidad, equipo, sesión y tiempo. [R04, R05, R11, R12]
4. La auditoría **5136 y 4662 depende también de SACL**, además de las subcategorías correspondientes. Su ausencia no demuestra inexistencia de cambios/accesos. [R03, R08, R09]
5. **4688 no garantiza command line**: la opción adicional para incluirla debe estar habilitada, implica exposición de argumentos sensibles y necesita protección de accesos al log. [R06, R07]
6. **Sysmon no es un SIEM ni un detector autónomo**. Es un servicio/controlador que escribe telemetría; su cobertura depende de instalación, versión, reglas de configuración y capacidad del registro. [R13, R14]
7. **AD CS es una vía de identidad**. Auditar plantillas, permisos, solicitudes y emisión, sin confundir evento 4887 con compromiso ni asumir que el filtro de CA por sí solo produce todos los eventos. [R15]
8. **Kerberoasting, DCSync y abuso de GPO** describen riesgos distintos; cada uno exige condiciones particulares. No usar 4769, 4662 o 5136 como “detección definitiva” sin contexto. [R20–R23]
9. **Versiones actuales importan**: Windows 11 24H2+/Server 2025 endurecen por defecto firma SMB; los ejercicios deben comparar la postura real de los equipos del laboratorio, no dar por hecho que carecen de firma. [R24]
10. Una evaluación sólida termina con **corrección, verificación negativa y positiva y trazabilidad documental**; la demostración ofensiva no sustituye el trabajo de administración/defensa. [R01, R02]

**Decisión curricular:** un único mundo Windows + AD; itinerario común de fundamentos, con prácticas diferenciadas por rol que convergen en ejercicios conjuntos Purple Team. Se propone empezar por análisis *de permisos y configuraciones*, usar escenarios reversibles para validar hipótesis y estudiar la telemetría al mismo tiempo que el comportamiento que la genera.

## 1. Modelo operativo y autorización

### 1.1. Reglas de actuación (ROE)

Cada ejercicio debe documentar: `scope_id`, responsable/autorizante, entorno, FQDN/hosts/segmentos **de laboratorio**, identidades sintéticas, ventana horaria, propósitos, pruebas permitidas/prohibidas, límites de volumen, forma de custodiar evidencias, contacto de emergencia, condición de parada, restauración y criterio de éxito. Una prueba sobre un activo no nombrado se considera **fuera de alcance**, aunque técnicamente sea alcanzable.

| Nivel | Tipo de actividad | Requisito mínimo | Lo que NO demuestra |
|---|---|---|---|
| N0 | Revisión documental/offline | Inventario y fuentes | Estado real del dominio |
| N1 | Consultas de solo lectura sobre lab | Acceso explícitamente autorizado, bajo volumen | Explotabilidad de una ACL |
| N2 | Validación sin cambios de configuraciones | Evidencia de permisos y rutas, confirmación por admin | Impacto real materializado |
| N3 | Modificación reversible de un objeto señuelo | Aprobación específica, snapshot/backup, rollback | Que el mismo camino funcionaría en producción |
| N4 | Emulación avanzada sensible (credenciales/replicación/etc.) | Laboratorio desechable, datos falsos, aprobación ampliada | Legitimidad de repetirlo en terceros |

**Prohibiciones de la ruta central:** phishing a personas, extracción de secretos reales, dumping de LSASS o NTDS de terceros, persistencia no consentida, modificación de GPO que impacte hosts no autorizados, exfiltración de información, técnicas destructivas o evasión de controles reales. La investigación documenta riesgos y condiciones, no convierte esas prácticas en requisitos para principiantes.

### 1.2. Escala de certeza de hallazgos

- **Inventario:** existe un objeto o configuración observable. Ej.: cuenta con SPN.
- **Indicio:** hay una propiedad potencialmente riesgosa; falta contexto. Ej.: permiso delegado de escritura.
- **Condición explotable demostrada:** todos los requisitos de una ruta concreta existen en la configuración analizada.
- **Acceso validado en laboratorio:** una acción de mínima repercusión demuestra el permiso o efecto sobre objeto sintético.
- **Impacto confirmado:** la consecuencia de negocio o control Tier 0 se demuestra con evidencia aceptable y aprobada.

No elevar un hallazgo de “indicio” a “compromiso” por una sola herramienta, puntuación o gráfico. Si faltan identidades efectivas, ACL heredadas, requisitos de autenticación o visibilidad sobre hosts, indicar **incertidumbre**.

### 1.3. Evidencia y retest

Ficha mínima: `finding_id`, control, activo, precondición, identidad de prueba, permisos efectivos, procedimiento reproducible de lectura, línea temporal UTC, captura o export EVTX/JSON redactado, limitaciones, severidad razonada, dueño de remediación, resultado del retest y medidas de restauración. Los artefactos sensibles permanecen en el laboratorio y se borran según ROE.

## 2. Modelo de amenaza: rutas de control y autenticación

La seguridad real de AD se mide por **control efectivo sobre objetos y credenciales**, no solo por membresía explícita de Domain Admins. Es especialmente importante conocer quién puede cambiar GPO enlazadas, grupos privilegiados, cuentas de servicio, permisos de replicación, plantillas y CA, delegaciones Kerberos, servidores donde inician sesión cuentas de alto privilegio y sistemas que administran DC. [R01, R02, R16]

**Grafo conceptual:** identidad → pertenencia a grupo → ACE explícita/heredada → permiso efectivo → objeto/control → posible efecto → evidencia de uso → recurso de destino. Cada arista debe contener: fuente, alcance, condición, vigencia, fecha, nivel de confianza y vía de remediación. Una relación de *lectura* o proximidad a un objeto no constituye automáticamente una escalada de privilegios.

| Superficie | Pregunta Red Team | Pregunta SOC | Administración/hardening |
|---|---|---|---|
| Grupo privilegiado | ¿Qué identidad controla el grupo, directa o indirectamente? | ¿Quién añadió miembro y desde dónde? | Revisar miembros/delegación, separar cuentas |
| GPO | ¿Quién puede editar/linkar y sobre qué equipos se aplica? | ¿Cambió AD y SYSVOL? ¿Hay cambio autorizado? | Delegar por mínimo privilegio; backups |
| Cuenta servicio/SPN | ¿Tiene privilegios excesivos y secreto gestionado? | ¿Su patrón de TGS difiere de la línea base? | gMSA cuando corresponda, AES, mínimos permisos |
| Trust/delegación | ¿Qué identidades y servicios son delegables? | ¿Qué autenticación/tráfico observado sustenta la hipótesis? | Autenticación selectiva/alcance, cuentas sensibles |
| DC/replicación | ¿Quién tiene control/replication rights? | ¿La operación corresponde a DC conocido? | Proteger Tier 0, auditoría focalizada |
| CA/plantilla AD CS | ¿Quién puede inscribir, gestionar plantillas o CA? | ¿Hubo solicitud, aprobación, cambio de permisos? | Separar roles, plantillas, aprobación y auditoría |

## 3. Reconocimiento y enumeración de solo lectura

### 3.1. Orden metodológico recomendado

1. Confirmar identidad y autorización de laboratorio; nunca partir de “hay conectividad, entonces hay permiso”.
2. Descubrir **contexto de dominio**: bosque, dominio, DC, sitios, subredes, DNS, trusts y niveles funcionales. Usar lo investigado en la tanda 2.
3. Inventariar **principales**: usuarios, equipos, grupos y anidamiento; no exportar atributos de secretos ni datos personales.
4. Mapear **cuentas de servicio y SPN** (existencia, tipo, antigüedad de contraseña, pertenencias, sin extraer material autenticador).
5. Inspeccionar **ACL/ACE y propietarios** de objetos expresamente dentro del laboratorio, distinguiendo `GenericAll`, `GenericWrite`, `WriteDacl`, `WriteOwner`, derechos extendidos y herencia/denegaciones.
6. Identificar **control sobre GPO**, delegación, cuentas sensibles, certificados y rutas hacia Tier 0.
7. Contrastar con una cuenta de **bajo privilegio** y otra de **administración del lab**, si ROE lo permite, sin modificar nada.
8. Generar un grafo de hipótesis y una lista de incertidumbres que requieren validación.

### 3.2. Consultas inocuas propuestas (solo laboratorio)

```powershell
# Ejecutar con RSAT/ActiveDirectory y credenciales autorizadas.
Get-ADDomain | Select-Object DNSRoot, DomainMode, PDCEmulator
Get-ADForest | Select-Object Name, ForestMode, RootDomain
Get-ADDomainController -Filter * | Select-Object HostName, Site, IsGlobalCatalog
Get-ADGroup -Filter * -SearchBase 'OU=Lab,DC=lab,DC=example' |
  Select-Object Name, DistinguishedName
Get-ADUser -Filter * -SearchBase 'OU=Lab,DC=lab,DC=example' -Properties ServicePrincipalName | Select-Object SamAccountName, ServicePrincipalName
```

**Atención:** Reemplazar `OU=Lab,DC=lab,DC=example` con una OU **sintética existente**. **No ejecutados**.

```powershell
# Solo lectura: derechos sobre una OU de laboratorio, con proveedor AD: disponible.
(Get-Acl 'AD:\OU=Lab,DC=lab,DC=example').Access |
  Select-Object IdentityReference,ActiveDirectoryRights,AccessControlType,IsInherited
```

**Criterios de calidad:** documentar si el proveedor `AD:` está montado, si hay permisos de lectura para el usuario y qué ACE aplican realmente a la clase/objeto y nivel de herencia. Una ACE aislada no permite afirmar capacidad de administrar un DC.

### 3.3. Grafos y herramientas

Los visualizadores de caminos de privilegios (por ejemplo, herramientas de análisis de relaciones de AD) son **instrumentos de hipótesis**, no certificadores automáticos de explotabilidad. Exigir fecha de captura, alcance, política de recogida, cardinalidad y tratamiento de los datos. Un grafo desactualizado puede mostrar relaciones antiguas o deducidas. En producción, cualquier colección debe pactarse y limitarse a los sistemas autorizados; en la ruta central se puede trabajar con un grafo generado a partir de **objetos sintéticos**.

## 4. Credenciales, Kerberos, NTLM y delegación: contexto ofensivo/defensivo

### 4.1. Kerberoasting (ATT&CK T1558.003)

**Mecanismo conceptual:** un principal autenticado puede solicitar TGS para un SPN; la seguridad de la contraseña de la cuenta de servicio, cifrado y configuración contribuyen al riesgo de ataque offline. **Un SPN no es una vulnerabilidad**. La mera emisión de 4769 no prueba Kerberoasting: ocurre en operaciones normales de Kerberos. [R11, R20]

- **Condiciones:** servicio con SPN, autenticación funcional, cuenta asociada y propiedades concretas del ticket; exposición depende de claves/secreto/cifrado y controles de autenticación.
- **Validación no invasiva:** inventariar SPN, privilegios, gMSA, política criptográfica y uso legítimo; no descargar tickets ni intentar recuperar contraseñas.
- **SOC:** 4769 en KDC/DC; agrupar por identidad solicitante, SPN, cliente, etype y volumen contextual, cambios de patrón, excepciones legítimas. Campo de etype y semántica exactos dependen de versión/parches y deben validarse con el XML real.
- **Prevención:** secretos largos/gestionados (gMSA si viable), mínimo privilegio de servicios, tipos de cifrado modernos y retiro de RC4 donde se haya validado compatibilidad. [R20, R25]

### 4.2. AS-REP roasting (ATT&CK T1558.004)

Asociado a cuentas donde la preautenticación Kerberos está deshabilitada. No enseñar que “4768 exitoso = ataque” ni que todas las cuentas sin preautenticación sean igualmente explotables. Validación central: revisar atributo/capacidad de preautenticación y corregir excepciones documentadas. La detección debe interpretar campo de preautenticación y contexto de 4768, no asumir el comportamiento genérico de todos los DC. [R10, R26]

### 4.3. NTLM y relay

NTLM sigue existiendo por compatibilidad; analizar **dónde**, **por qué** y **con qué controles** se usa. La exposición a relay depende de que los servicios destino acepten el flujo, del estado de firma/protecciones específicas y de la posición del actor; no equivale a “NTLM habilitado = relay explotable”. Windows 11 24H2 y Windows Server 2025 introdujeron **firma SMB requerida por defecto**, con implicaciones para laboratorios de tutoriales antiguos. [R24, R27]

**SOC:** 4624 (Authentication Package), 4776 en validación NTLM cuando proceda, actividad SMB/LDAP según telemetría disponible y controles; correlacionar hosts. No afirmar que todo 4624 tipo 3 sea un ataque lateral.

### 4.4. Delegación Kerberos

Distinguir **unconstrained**, **constrained** y **resource-based constrained delegation (RBCD)**; quién configura la relación y qué principal puede usarla. El hecho de que exista delegación no implica automáticamente compromiso. Cuentas críticas deberían estar protegidas contra delegación si los requisitos funcionales lo permiten; probar compatibilidad antes de endurecer. [R17, R25]

### 4.5. DCSync / abuso de replicación (T1003.006)

Un actor con derechos pertinentes puede abusar de interfaces de replicación para obtener material sensible; esa es la razón para vigilar **derechos de replicación**, identidades con acceso, red origen y operaciones de directorio. **No se propone ejecutar DCSync ni extraer hashes** en esta tanda. En lugar de ello, el estudiante evalúa permisos delegados y sujeta un supuesto camino de ataque a revisión. [R21, R09]

**SOC:** 4662 con SACL y derechos relevantes puede contribuir a la investigación, pero también recoge usos legítimos y no aporta por sí solo certeza de DCSync. El tráfico RPC/DC y la identidad solicitante aumentan contexto. Comparar con máquinas DC autorizadas y procesos de replicación esperados.

### 4.6. LSASS, SAM, Credential Guard y cuentas protegidas

La extracción de secretos desde memoria o bases locales es una amenaza conocida, pero el **recorrido central no exige extraer credenciales**. Enseñar límites de privilegios, PPL/LSA Protection, Credential Guard, Protected Users y efectos operativos; verificar controles y eventos de acceso a procesos con agentes adecuados, sin interpretar un acceso a LSASS como prueba automática de robo. Microsoft documenta restricciones importantes de **Protected Users** (NTLM, DES/RC4, delegación, tickets), que pueden romper servicios si se despliega sin planificación. [R19, R25]

## 5. Movimiento lateral y abuso administrativo: análisis sin comprometer hosts

**Superficies:** RDP, SMB/ADMIN$, WinRM/PowerShell Remoting, WMI/DCOM, RPC, administración remota de servicios, tareas programadas y uso legítimo de credenciales. El objetivo es evaluar si un principal puede acceder, desde qué origen y con qué control, no desplegar cargas ni automatizar desplazamientos. [R22]

| Canal | Validación segura (lab) | Evidencia origen/destino | Riesgo de confusión |
|---|---|---|---|
| RDP | Sesión aprobada entre VMs sintéticas | 4624 tipo 10 destino, logs TerminalServices; 4778/4779 según contexto | Acceso de TI legítimo |
| SMB | Consultar recursos de prueba sin copiar datos sensibles | 4624 tipo 3 destino, 5140/5145 si auditoría habilitada; Sysmon 3 si configurado | Acceso a archivos normal |
| WinRM | Comando de inventario remoto de solo lectura | PowerShell/Operational, WinRM/Operational, 4688/1 según ejecución | Gestión de configuración |
| WMI | Consulta `Win32_OperatingSystem` autorizada | WMI-Activity/Operational y contexto de procesos; campos varían | Inventario empresarial |
| Servicio | Revisar servicio ficticio, sin instalar persistencia | System 7045 y/o Security 4697 si condiciones lo permiten | Instalaciones normales de software |
| Tarea | Inventario de tarea programada de lab | Security 4698/4702 si auditoría correspondiente; TaskScheduler/Operational | Orquestadores internos |

**Patrones útiles:** identidad privilegiada en host no habitual; acceso remoto seguido de modificación de servicio/GPO; accesos a sistemas Tier 0 desde estación no autorizada. Estos patrones requieren baseline y autorización, no listas rígidas de nombres de herramientas.

**Cierre de hardening:** segmentación de administración, restricciones de logon privilegiado, cuentas separadas, LAPS, MFA donde sea compatible, minimización de SMB/RDP/WinRM y control de hosts administrativos. [R01, R02, R24]

## 6. GPO, ACL y AD CS: rutas hacia control de dominio

### 6.1. Delegación, herencia y GPO

Una cuenta puede ser capaz de **editar GPO** o modificar enlaces con efectos sobre una OU; deben verificarse permisos de objeto, alcance del enlace, filtros y procesamiento de políticas. Distinguir GPC en AD y GPT en SYSVOL; registrar cambios a ambos si la instrumentación lo permite. **Un 5136 en una GPO no implica necesariamente que su contenido de SYSVOL haya cambiado; ni un cambio en SYSVOL garantiza que toda la GPO se aplique al equipo destino.** [R08, R23]

Práctica propuesta: una GPO `GPO-LAB-AVISO` enlazada a una OU de VMs descartables; cambio inocuo explícitamente aprobado (por ejemplo, mensaje informativo), observación del efecto, reversión por GPMC y comprobación con `gpresult`. Nunca modificar las Default Domain Policy/Default Domain Controllers Policy para demostraciones genéricas.

### 6.2. AD CS y PKI

Superficies a estudiar: configuración de CA, emisión y aprobación, publicación de plantillas, permisos de solicitud/inscripción, EKU, SAN, autorizaciones de inscripción en nombre de otros, asignación de certificados a identidades y protección de claves de CA. La enumeración de plantillas expuestas **no equivale** a emitir un certificado para un tercero. Los patrones conocidos de misconfiguración de AD CS se enseñan como **clases de controles a auditar**, no como un catálogo de explotación automatizada. [R15]

**Registro:** 4886 solicitud, 4887 emisión, 4888 denegación, 4882 permisos CA, 4885 filtro de auditoría, 4890/4892 cambios de administración/propiedades; el artículo oficial advierte que hay que configurar tanto auditoría del SO como el filtro de auditoría CA. Asegurar volumen de Security y preservación. [R15]

**Verificación:** solicitud sintética autorizada → observar 4886/4887 o 4888 según política; confirmar plantilla, solicitante, número de solicitud y certificado en caso válido; revocación de certificado de laboratorio si se aprobó; comprobar que se impide una solicitud no autorizada. No usar cuentas o datos reales.

## 7. SOC: modelo de evidencia y límites de la telemetría

### 7.1. Cadena de observabilidad

**Acción → proveedor ETW/subsistema → configuración de auditoría/sensor → canal local → espacio/retención → exportación o reenvío → normalización → investigación**. Una pérdida en cualquiera de estas etapas puede producir ausencia de evidencia. Configurar un SIEM no habilita retrospectivamente Windows Auditing ni recupera eventos sobrescritos. [R03, R04, R13, R14, R18]

**Puntos de control antes de interpretar un evento:**

1. ¿En qué **host** ocurre esta actividad? ¿DC, CA, servidor de aplicación o cliente?
2. ¿Cuál es el proveedor y canal, además del Event ID?
3. ¿Qué subcategoría de auditoría y qué SACL/sensor aplica?
4. ¿Se generó realmente y hubo espacio/tiempo para preservarlo?
5. ¿Qué identidad, SID, LogonId, ProcessGuid, EventRecordID, RequestID o SPN permiten correlación?
6. ¿Están sincronizados los relojes y correctamente representado UTC?
7. ¿Qué hipótesis legítima compite con la maliciosa?
8. ¿Cuál es la conclusión mínima sustentada, y qué otra evidencia falta?

### 7.2. Inventario de canales nativos

- **Security:** logon, auditoría avanzada, cuentas/grupos, directorio, GPO/AD CS con configuración adecuada.
- **System:** servicios (p.ej. SCM 7045), controladores y problemas del host.
- **Application:** aplicación y servicios específicos; no garantiza hechos de autenticación.
- **Directory Service (DC):** salud del servicio de directorio, replicación, diagnósticos específicos.
- **DNS Server (DC o servidor DNS):** eventos operativos según rol y canal; consulta DNS requiere telemetría configurada, no suponer cobertura completa.
- **Microsoft-Windows-GroupPolicy/Operational:** aplicación/procesamiento de GPO.
- **Microsoft-Windows-PowerShell/Operational** y canales de **PowerShellCore/Operational**, según motor/versión.
- **Microsoft-Windows-WinRM/Operational**, **WMI-Activity/Operational**, **TaskScheduler/Operational**.
- **Microsoft-Windows-Sysmon/Operational:** solo donde Sysmon está presente y configurado.
- **ForwardedEvents:** eventos reenviados al colector WEF, con datos de origen preservados más metadatos de reenvío. [R13, R14, R18]

## 8. Matriz de eventos Windows/AD y precauciones

La siguiente matriz describe **posibles evidencias**, no una garantía universal de generación. Se deben comprobar políticas, canales, formato XML y versión de cada equipo. [R03–R15]

| Evento | Ubicación/Canal | Qué aporta | Condición y límite principal |
|---|---|---|---|
| 4624 | Destino / Security | Sesión de logon exitosa, tipo y autenticación | No identifica solo uso malicioso |
| 4625 | Destino / Security | Logon fallido | Puede ser error normal/servicio |
| 4648 | Host que usa credenciales explícitas / Security | Intento de logon con credenciales explícitas | No equivale a robo ni éxito remoto |
| 4672 | Host de logon / Security | Privilegios especiales asignados | SYSTEM y admins legítimos generan ruido |
| 4688 | Equipo que ejecuta / Security | Nuevo proceso | Command line vacía sin política adicional |
| 4689 | Equipo que ejecuta / Security | Terminación de proceso | Subcategoría y actividad condicionan volumen |
| 4697 | Equipo destino / Security | Instalación de servicio | Depende de Audit Security System Extension |
| 7045 | Equipo destino / System | Servicio instalado | SCM; contexto y autor requieren otros eventos |
| 4698/4702 | Equipo destino / Security | Tarea creada/actualizada | Requiere auditoría/cobertura relevante |
| 4768 | KDC/DC / Security | TGT solicitado | No equivale a AS-REP roasting |
| 4771 | KDC/DC / Security | Preautenticación Kerberos fallida | Errores de contraseña/tiempo habituales |
| 4769 | KDC/DC / Security | TGS solicitado | No equivale a Kerberoasting |
| 4770 | KDC/DC / Security | TGS renovado | Depende de auditoría |
| 4776 | Equipo que valida credenciales NTLM, típicamente DC para cuentas de dominio / Security | Validación NTLM | No identifica por sí solo al servicio de destino |
| 4720/4726 | DC / Security | Usuario dominio creado/eliminado | Corrección de identidad y autorización requerida |
| 4722/4725 | DC / Security | Cuenta habilitada/deshabilitada | Procesos legítimos de IAM |
| 4728/4729 | DC / Security | Cambio de miembro grupo global | Grupos de otros alcances tienen IDs diferentes |
| 4732/4733 | Equipo apropiado / Security | Cambio de miembro grupo local/domain-local | Contextualizar grupo y host/DC |
| 4756/4757 | DC / Security | Cambio de miembro grupo universal | Depende de política de gestión de grupos |
| 4742 | DC / Security | Cambio de cuenta de equipo | Puede ser automatización normal |
| 4739 | DC / Security | Cambio de política de dominio | Contextualizar política, autor y change ticket |
| 5136 | DC / Security | Modificación objeto AD | Requiere Advanced Audit Directory Service Changes + SACL aplicable |
| 5137/5139/5141 | DC / Security | Crear/mover/borrar objeto AD | SACL y subcategoría; no cubre todos los detalles |
| 4662 | DC / Security | Operación sobre objeto AD | Requiere SACL + Audit Directory Service Access; gran volumen |
| 5140/5145 | Servidor de recursos / Security | Acceso/chequeo detallado a recurso compartido | Subcategorías distintas, configuraciones y ruido |
| 4719 | Host / Security | Cambios de política de auditoría | No indica por sí solo intención maliciosa |
| 1102 | Host / Security | Borrado del registro Security | Requiere investigar causa; pérdida de evidencia |
| 4882/4885 | Servidor CA / Security | Permisos CA / filtro auditoría cambiado | Auditoría CA + SO, cambios administrativos posibles |
| 4886/4887/4888 | Servidor CA / Security | Solicitud / emisión / denegación de certificado | Actividad normal PKI; correlacionar solicitud/plantilla |
| Sysmon 1 | Host instrumentado / Sysmon Operational | Proceso, command line, ProcessGuid | Instalación y regla de inclusión/configuración |
| Sysmon 3 | Host instrumentado / Sysmon Operational | Conexión de red asociada al proceso | No habilitado necesariamente; volumen/ruido |
| Sysmon 10 | Host instrumentado / Sysmon Operational | Acceso de proceso a otro proceso | No prueba extracción de secretos |
| Sysmon 11 | Host instrumentado / Sysmon Operational | Creación de archivo | No contiene necesariamente archivo completo |
| Sysmon 12–14 | Host instrumentado / Sysmon Operational | Cambios de registro | Reglas específicas; no todo cambio se registra |
| Sysmon 22 | Host instrumentado / Sysmon Operational | Consulta DNS | No equivale a conexión establecida |
| PowerShell 4104 | Motor/canal correspondiente / PowerShell Operational | Contenido de script block | Política/versión; contenido sensible posible |

### 8.1. Correlación: ejemplos de interpretación incorrecta

- `4769 + etype 0x17 = atacante`: **incorrecto**. Es un factor posible para una hipótesis, no atribución. Ver baseline, servicio, cuenta, políticas actuales y versión de evento. [R11, R20]
- `4662 = DCSync`: **incorrecto**. Puede corresponder a muchas operaciones sobre objetos, cuando hay SACL. Evaluar derechos, objeto, sujeto, origen y condición de replicación. [R09, R21]
- `5136 = GPO alterada y desplegada`: **incompleto**. Puede ser otro objeto/atributo; revisar GPC, GPT, versiones, scope y eventos de aplicación. [R08, R23]
- `4624 tipo 3 = movimiento lateral`: **incorrecto**. SMB, tareas de red y servicios normales también producen ese tipo. [R05]
- `4688 sin argumentos = no se ejecutó comando sospechoso`: **incorrecto** si no estaba habilitado el registro de línea de comandos. [R06, R07]
- `Sysmon 3 ausente = no hubo conexión`: **incorrecto** si el tipo está deshabilitado o filtrado. [R13]
- `Sysmon 10 sobre LSASS = dump exitoso`: **incorrecto**. El evento describe acceso al proceso bajo reglas; se necesita evidencia adicional. [R13]
- `4887 = certificado fraudulento`: **incorrecto**. Una emisión normal debe producir el evento cuando se cumplen requisitos de auditoría. [R15]

## 9. Auditoría avanzada y habilitación segura

### 9.1. Política efectiva versus intención GPO

`Advanced Audit Policy Configuration` se subdivide por eventos funcionales. Verificar estado **efectivo** con `auditpol /get /category:*`; no asumir que GPO diseñada = GPO aplicada. Identificar GPO ganadora, subcategorías en DC vs clientes, coexistencia de auditoría clásica/avanzada y opciones para forzar precedencia de subcategorías. [R03, R28]

```powershell
# Consultas de solo lectura, propuestas y no ejecutadas.
auditpol /get /category:*
Get-WinEvent -ListLog Security | Select-Object LogName,IsEnabled,MaximumSizeInBytes,RecordCount
Get-WinEvent -ListLog 'Microsoft-Windows-PowerShell/Operational' |
  Select-Object LogName,IsEnabled,MaximumSizeInBytes,RecordCount
Get-WinEvent -LogName Security -MaxEvents 5 |
  Select-Object TimeCreated,Id,ProviderName,MachineName,RecordId
```

El acceso a Security requiere derechos adecuados; realizar la lectura con una cuenta cuyo privilegio esté aprobado y documentado. Los nombres de subcategorías varían con el idioma del sistema: preferir identificadores/GUI o enumeración local antes que scripts frágiles.

**Diseño de auditoría:** 1) objetivos de observación; 2) eventos y hosts; 3) subcategorías; 4) SACL de objetos sensibles; 5) volumen/retención; 6) prueba positiva; 7) prueba negativa; 8) restauración; 9) monitoreo continuo de cobertura.

### 9.2. SACL y auditoría de cambios de directorio

5136 se genera en DC si la subcategoría `Directory Service Changes` y la SACL aplicable coinciden. 4662 necesita `Directory Service Access` y SACL pertinente. Configurar SACL indiscriminadas sobre todo el dominio causa alto volumen y puede dificultar operar la investigación. Empezar por objeto señuelo/OU de laboratorio y cuentas autorizadas; no usar el grupo Domain Admins como “señuelo” en entornos reales. [R08, R09]

### 9.3. Retención, pérdida y privacidad

La `MaximumSizeInBytes` y modo de retención local afectan cuánto sobrevive; WEF puede tener retrasos o interrupciones. Los eventos de líneas de comando y script blocks pueden contener contraseñas, tokens, rutas de usuarios o información empresarial. Definir permisos de lectura, cifrado, eliminación/mascarado y periodo de conservación según normativa del entorno. No exportar el evento completo a repositorios públicos sin revisión. [R07, R12, R18]

## 10. PowerShell Logging: motores, alcance y sensibilidad

| Opción | Qué observa | Precaución |
|---|---|---|
| Script Block Logging | Script blocks procesados (p.ej. 4104 para Windows PowerShell clásico) | Puede registrar secretos usados por scripts; protección y retención |
| Module Logging | Invocación/pipeline en módulos definidos | Sujeto a configuración específica y ruido |
| Transcription | Entrada/salida de sesión donde sea compatible/configurado | Datos personales, rutas, manejo del archivo de salida |
| Protected Event Logging | Protección criptográfica de contenido compatible | Gestión de certificados y recuperación de clave privada |

**Diferencia de motores:** Windows PowerShell 5.1 y PowerShell 7 tienen documentación y rutas de política/canales que pueden diferir; **no usar los mismos supuestos para cualquier `pwsh.exe`**. Microsoft recomienda Protected Event Logging cuando se habilita Script Block Logging fuera de diagnósticos; probar visibilidad local y la versión del motor. [R12, R29]

**Escenario seguro:** ejecutar un script administrativo de solo lectura en una VM de laboratorio, registrar marca temporal y contenido sintético (`Get-Process`/`Get-Service`), localizar 4104 cuando corresponde y comprobar que la colección preserve proveedor/canal/hora, sin secretos.

## 11. Sysmon: capacidades, cobertura y diseño de filtros

Sysmon (Sysinternals) es **telemetría endpoint**, no un motor de prevención ni prueba automática de malware. Su versión y esquema evolucionan: la documentación oficial consultada describe Sysmon **v15.22 publicado el 10/09/2026** y un conjunto de Event IDs que debe cotejarse con la versión instalada. [R13, R14]

**Matriz de diseño de sensorización:**

- **1 ProcessCreate**: procesos, padre, ruta, hash, ProcessGuid. Verificar campos emitidos y regla.
- **3 NetworkConnect**: atribuir conexiones a procesos, pero su volumen suele exigir selección; una ausencia no niega tráfico.
- **7 ImageLoad**: gran volumen; seleccionar casos cuando aporte investigación real.
- **10 ProcessAccess**: relaciones de acceso entre procesos; no equivale a volcado de memoria.
- **11 FileCreate**: archivos creados; no necesariamente contenidos ni todas las escrituras.
- **12/13/14 RegistryEvent**: cambios de registro definidos por filtros.
- **19/20/21 WmiEvent**: artefactos relacionados con filtros/consumidores WMI.
- **22 DnsQuery**: resolución de nombre atribuible al proceso; no asegura salida a Internet.
- **16**: cambio de configuración Sysmon, contextualizar autorizaciones.

**Verificación necesaria por evento:** versión/schema, regla include/exclude, volumen real, CPU/almacenamiento, canal y retención, campo de identidad, presencia del evento en `Microsoft-Windows-Sysmon/Operational`, export y comparación con acción de prueba. Preferir el esquema oficial; no desplegar configuraciones comunitarias desconocidas en producción sin revisión. [R13, R14]

**Instrumentación separada de la generación de acciones:** los laboratorios pueden medir acciones administrativas inocuas: creación de archivo señuelo, consulta DNS ficticia, apertura de una herramienta aprobada. No se necesita malware real para demostrar cobertura básica.

## 12. WEF/WEC y conservación de evidencia

**Windows Event Forwarding** usa la infraestructura Windows Event Collector y permite suscripciones iniciadas por el origen o por el colector. Un servidor collector puede recibir eventos y almacenarlos en su registro de eventos. La información original se conserva junto con metadatos añadidos, según la documentación oficial. [R18]

| Modalidad | Ventaja | Condición / límite |
|---|---|---|
| Source-initiated | Escala cuando muchos clientes conocen al collector vía configuración de GPO | Confirmar WinRM/política, ACL del Security log, DNS, TLS/seguridad |
| Collector-initiated | Listado explícito de hosts cuando el conjunto es pequeño | Mantenimiento del inventario y conectividad |

**Puntos de comprobación:** collector habilitado; suscripción válida; origen conectado; evento sintético visible primero en origen y luego en destino; `Computer` de origen conservado; diferencia temporal de recepción; cola, pérdida y límite de volumen. El colector **no habilita** por sí solo las auditorías del host ni evita que el origen sobrescriba su log. [R18, R15]

```powershell
# En laboratorio, como comprobaciones documentales; no ejecutadas.
wecutil es                  # Enumera suscripciones, desde colector.
wecutil gr LabSubscription  # Estado de ejecución si existe esa suscripción.
wevtutil gl Security        # Propiedades del registro local.
# Exportar SOLO datos sintéticos con autorización:
wevtutil epl Security C:\LabEvidence\security-lab.evtx
```

El último ejemplo necesita permisos, espacio, destino autorizado y revisión de privacidad; **no recomienda exportar el log Security de equipos reales a archivos sin control**.

**Cadena de custodia en el laboratorio:** conservar `source_hostname`, UTC, zona/hora local, fuente, RecordId, hash SHA-256 del EVTX exportado, identidad de operador y resumen de acciones. El RecordId es secuencial **dentro de un registro**, no una clave global. Comprobar sincronización de reloj y posible overwrite/clearing.

## 13. Hipótesis de investigación SOC por escenario

### H1. Inicio remoto de sesión de cuenta privilegiada

**Pregunta:** ¿un usuario de Tier 0 accedió desde equipo permitido al host previsto? Fuentes: 4624 en destino, 4648 en origen si disponible, 4672, RDP/WinRM/SMB, proceso relacionado. Hipótesis legítimas: mantenimiento, soporte o tarea automatizada. **Conclusión válida:** sesión y contexto observados; no atribuir “movimiento lateral malicioso” sin evidencia de objetivo, identidad y autorización.

### H2. Solicitudes Kerberos inusuales

**Pregunta:** ¿un principal solicitó muchos TGS para SPN no habituales o con tipos de cifrado inesperados? Fuente: 4769 del DC, inventario de cuentas/servicios, baseline de procesos/solicitantes. **Falsos positivos:** aplicaciones empresariales que autentican a muchos servicios, cambios de despliegue y uso heredado de RC4. No afirmar que se recuperó contraseña. [R11, R20]

### H3. Modificación de grupo privilegiado

**Pregunta:** ¿quién añadió o quitó quién, en qué grupo y con qué ticket? Fuentes: 4728/4732/4756 según alcance; `Subject`, `Member`, `Target`, atributos del grupo y posible 4624. **Conclusión:** cambio observable, no compromiso automático. Validar pertenencia final y operaciones previstas. [R03]

### H4. Cambio de GPO con alcance sensible

**Pregunta:** ¿se modificó AD GPC, SYSVOL GPT o el enlace GPO? Fuentes: 5136 si SACL habilitada, cambios de archivos SYSVOL cuando exista auditoría, GPMC/versión/replicación y GroupPolicy/Operational en cliente. **Conclusión:** distinguir edición de aplicación y observar propagación. [R08, R23]

### H5. Replicación sensible o acceso a objeto crítico

**Pregunta:** ¿una identidad no/DC operó sobre objetos con derechos especiales de replicación? Fuentes: 4662 filtrado por tipo y GUID, inventario de delegaciones, otros logs RPC/host si existen. **Límite:** la auditoría puede no estar configurada y un 4662 no demuestra extracción de hashes. [R09, R21]

### H6. Emisión de certificado inesperado

**Pregunta:** ¿una solicitud autorizada se emitió bajo plantilla y para sujeto correctos? Fuentes: CA 4886/4887/4888, auditoría de plantillas y permisos, registro CA, validación de cadena. **Límite:** la emisión puede ser legítima; control de identidad requiere configuración completa. [R15]

### H7. Persistencia administrativa mal etiquetada

**Pregunta:** ¿se instaló un servicio o creó una tarea sin cambio aprobado? Fuentes: System 7045/Security 4697, TaskScheduler y proceso creador. **Límite:** actualización de software, agentes y mantenimiento pueden coincidir con la señal. [R03, R06]

### H8. Pérdida de visibilidad

**Pregunta:** ¿una caída de eventos refleja menor actividad o fallo de sensores/colección? Fuentes: 1102, 4719, estado Sysmon, canal de Windows Event Log, heartbeat del origen y WEF. **Límite:** comprobar fallos técnicos, reinicios y cambios administrativos antes de inferir sabotaje. [R13, R18]

## 14. Respuesta y recuperación inmediata en Windows/AD

**Orden conceptual de tratamiento de incidentes:** confirmar severidad e identidad del activo → recoger evidencia volátil y configuración antes de interferir → delimitar alcance e impacto → coordinar contención autorizada → erradicar causa → restaurar servicio/identidades desde estado confiable → validar telemetría → documentar lecciones y retest. La **Tanda 4** profundizará backup, forest recovery y ejercicios integradores.

- Un PID sospechoso no debe matarse ciegamente: riesgo de interrumpir servicio y destruir evidencia. Primero proceso, árbol, firma, ruta, usuario, conexiones, handles y función del host; después contención según severidad.
- Bloquear una IP o puerto **puede ser insuficiente** ante abuso de cuentas legítimas, conexiones ya establecidas o cambio de infraestructura. Aislamiento y revocación de acceso requieren valorar servicios críticos.
- En DC: no aplicar acciones destructivas ni restablecer cuentas Tier 0 sin un plan de crisis/identidad, comunicaciones y rollback. Los cambios pueden replicarse.
- En CA: no apagar/revocar certificados a ciegas; evaluar dependencia de servicios y recuperación de PKI.
- Para cualquier evidencia: registrar quién recogió, cuándo, cómo, hash, almacenamiento y límites.

## 15. Casos de estudio integrados (sin ejecutar ataques)

### Caso A — SPN de cuenta de servicio sobredimensionada

**Inventario**: servicio sintético `svc-demo` con SPN y membresía excesiva. **Red Team**: evalúa si tiene permisos que amplían impacto; no requiere obtener tickets ni secreto. **SOC**: observa patrón habitual 4769 y comprueba si la cobertura permitiría distinguir anomalías. **Blue**: migra a cuenta gestionada apropiada o endurece secreto/cifrado, elimina membresía sobrante. **Retest**: acceso funcional del servicio, privilegios reducidos y registro de operaciones benignas. **Falsos positivos**: TGS normal.

### Caso B — Delegación incorrecta de GPO en OU de prueba

**Inventario**: una identidad no privilegiada tiene permiso de edición de una GPO `GPO-LAB-AVISO`. **Red Team**: demuestra solamente capacidad de leer/permisos; si se autoriza, modifica un ajuste informativo reversible en OU señuelo. **SOC**: 5136 sujeto a SACL, cambio de GPT/SYSVOL con auditoría local y resultado de política en VM. **Blue**: restringe permisos y verifica bloqueo de modificación por la identidad. **Retest**: administrador legítimo conserva capacidad; identidad de prueba recibe denegación.

### Caso C — Uso de RDP a un servidor de laboratorio

**Inventario**: dos cuentas autorizadas y una estación no autorizada; Windows Firewall permite RDP solo a segmento admin. **Red Team**: verifica acceso de cuenta permitida desde admin host, rechazos previstos desde estación fuera de segmento; sin obtención de credenciales. **SOC**: 4624 tipo 10 destino y logs de TerminalServices, correlación origen/usuario. **Blue**: refuerza restricciones y baseline. **Retest**: administración legítima funciona; intento fuera de política permanece bloqueado.

### Caso D — Solicitud de certificado de identidad sintética

**Inventario**: plantilla `LAB-USER` y grupos de inscripción. **Red Team**: compara permisos/enrollment para solicitante legítimo y no autorizado, sin suplantar cuentas. **SOC**: comprueba CA 4886/4887/4888 en condición adecuada. **Blue**: corrige autorización y realiza revisión de EKU/SAN/mapear identidad. **Retest**: solicitud permitida funciona; la no autorizada queda bloqueada; logs completos.

## 16. Laboratorios diseñados — Tanda 3 (no ejecutados)

**Topología de referencia**: `DC01` Windows Server 2025 (AD DS/DNS), `WIN11-01` Windows 11, `SRV01` Server 2025, `COL01` WEC opcional, `CA01` Server 2025 AD CS opcional. Red privada de hipervisor aislada del entorno doméstico/empresarial. Dominio ilustrativo `lab.example`; usuarios `ana.lab`, `auditor.lab`, `ops.lab`, `svc-demo` sintéticos. No compartir bridge corporativo ni usar identidades reales. **Costes/licencias y consumo final: pendientes de comprobar según hipervisor, hardware y licencias de evaluación**; no se han probado en este entorno.

| ID | Objetivo | Evidencia mínima | Criterio de aprobación | Riesgo/control |
|---|---|---|---|---|
| RT-L01 | Definir ROE, inventario y grafo de alcance | Scope + hostlist + plan de parada | 100% activos dentro de alcance | Solo docs |
| RT-L02 | Inventario seguro AD de OU sintética | Objetos/grupos/SPN con datos falsos | Resultados trazables, sin credenciales | N1, bajo volumen |
| RT-L03 | Auditoría de ACL y propietario sobre señuelos | DACL heredada/explicación de derecho | Distinguir `Read` de `WriteDacl` | N1/2 |
| RT-L04 | Cuenta de servicio con privilegios excesivos | Comparación antes/después | Servicio funcional y menos derechos | Datos sintéticos |
| RT-L05 | Validación GPO de mensaje inocuo | Backup GPO, gpresult, logs, rollback | Cambios solo en OU de prueba | N3, snapshot |
| RT-L06 | Revisión de delegación/trust | Matriz de riesgos sin explotación | Preconditions documentadas | N1/2 |
| SOC-L01 | 4624, 4625, 4672 entre hosts del lab | EVTX + cronología correlacionada | Identificar origen/destino sin confundirlos | Datos sintéticos |
| SOC-L02 | 4688 + línea de comandos sensible | Política antes/después + 4688 sin secreto | Explicar prerequisito y privacidad | No usar secretos |
| SOC-L03 | 4768/4769 de autenticación legítima | Ticket/DC/servicio + baseline | Rechazar falso positivo de Kerberoasting | Sin cracking |
| SOC-L04 | 5136/4662 con SACL focalizada | GPO auditoría + SACL + eventos | Demostrar cuándo NO se genera | N3 reversible |
| SOC-L05 | Sysmon: proceso, DNS y archivo señuelo | Event IDs 1/11/22 si configurados | Verificar filtros y fuentes | Instalar solo tras autorización futura |
| SOC-L06 | PowerShell 5.1/7 logging comparativo | Logs de acciones de solo lectura | Distinguir canales y campos | Contenido inocuo |
| SOC-L07 | WEF ida/vuelta de evento sintético | Evento origen y `ForwardedEvents` | Coincidencia de host/ID y latencia | Red privada |
| SOC-L08 | Control de alta/baja de grupo sintético | Eventos 4728/4732/4756 pertinentes | Identificar tipo real de grupo | Rollback |
| PT-L01 | Simulación coordinada GPO + SOC | ROE, acción, logs, corrección y retest | Prueba positiva y negativa | N3 exclusivamente lab |
| PT-L02 | Auditoría de CA/solicitud ficticia | 4886–4888 + permisos + rollback | Emisión solo para sujeto permitido | CA opcional, coste pendiente |

**Plantilla obligatoria por laboratorio:** ID, objetivo, nivel, prerrequisitos, topología/versión, componentes/licencias, preparación, técnica controlada, datos de prueba, telemetría esperada y condicionada, evidencia/tiempos UTC, pruebas positiva/negativa, rúbrica, restauración, limitaciones y fuentes. Estos diseños son **borradores**; la Tanda 4 tendrá el catálogo final detallado con recursos, rubricas completas y estimaciones revisables.

### 16.1. Ejemplo de rúbrica base (100 puntos)

- Alcance/ROE y reversibilidad: **15**.
- Modelo técnico de prerrequisitos y controles: **20**.
- Evidencias fiables y procedencia: **25**.
- Interpretación con hipótesis alternativas, falsos positivos y lagunas: **20**.
- Remediación y retest positivo/negativo: **20**.

**Umbrales sugeridos para diseño, no reglas oficiales:** aprobar ≥80/100 **y** aprobar obligatoriamente alcance/seguridad; un ejercicio fuera de alcance se invalida independientemente de la puntuación.

## 17. Etapas provisionales, competencias y dependencia

Las etapas son **propuesta de diseño**; el número definitivo se decidirá en la Tanda 4 al unificar Windows+AD y eliminar duplicidades. `WIN-*` y `AD-*` aluden a etapas provisionales de tandas anteriores; se resolverán IDs estables en la integración final.

| ID | Etapa | Prerrequisitos mínimos | Resultado verificable | Prácticas |
|---|---|---|---|---|
| RT-01 | ROE, límites y reporte | WIN básico, AD básico | ROE y hallazgo trazable | RT-L01 |
| RT-02 | Descubrimiento autorizado de identidad | AD arquitectura/LDAP/grupos | Inventario y aristas de grafo | RT-L02 |
| RT-03 | Permisos efectivos y caminos de control | AD ACL/GPO/Tier0 | Describir prerequisito y riesgo sin exagerar | RT-L03, RT-L05 |
| RT-04 | Exposición Kerberos/NTLM y servicios | AD Kerberos/NTLM/SPN | Identificar postura y controles | RT-L04, SOC-L03 |
| RT-05 | Delegaciones, trusts y cuentas sensibles | AD delegación/trust/Tier0 | Matriz de condiciones y alcance | RT-L06 |
| RT-06 | AD CS desde evaluación segura | AD AD CS/PKI | Auditar CA/plantilla con identidades ficticias | PT-L02 |
| RT-07 | Movimiento remoto y control operacional | WIN red/servicios, AD auth | Mapa de permisos y restricciones | SOC-L01, PT-L01 |
| RT-08 | Evidencia, remediación, retest | RT-01 a RT-07 | Informe con prueba negativa y positiva | PT-L01 |
| SOC-01 | Dónde nace la evidencia Windows/AD | WIN procesos/eventos, AD roles | Matriz canal/host/condición | SOC-L01 |
| SOC-02 | Auditoría avanzada y SACL | SOC-01, AD ACL | Demostrar cobertura y ausencia explicable | SOC-L04 |
| SOC-03 | Identidades y autenticación Windows/AD | SOC-01, AD Kerberos/NTLM | Trazar 4624↔4769 con límites | SOC-L01, SOC-L03 |
| SOC-04 | Procesos, PowerShell y persistencia administrativa | SOC-01, WIN servicios/PowerShell | Comparar 4688/4104/Sysmon | SOC-L02, SOC-L06 |
| SOC-05 | Sysmon y validación de sensor | SOC-04 | Determinar eventos activados/filtrados | SOC-L05 |
| SOC-06 | WEF, UTC, retención y preservación | SOC-01, WIN red | Export controlado y prueba extremo a extremo | SOC-L07 |
| SOC-07 | Detección contextual y falsos positivos | SOC-02 a SOC-06 | Resolver 8 hipótesis con confianza graduada | SOC-L08 |
| SOC-08 | Coordinación respuesta y Purple Team | RT-08, SOC-07 | Causa, contención proporcional, remediación y retest | PT-L01, PT-L02 |

**Regla pedagógica:** ninguna etapa de Red Team se considera dominada solo por “conocer el nombre de una técnica”; ninguna etapa SOC se aprueba por memorizar un Event ID. Cada desbloqueo requiere explicar una configuración real, el contexto observacional y la acción correctiva apropiada.

## 18. Matriz ATT&CK ↔ control ↔ evidencia (no reglas de SIEM)

| Técnica MITRE | Condición principal a analizar | Observables posibles | No concluye automáticamente |
|---|---|---|---|
| T1558.003 Kerberoasting | SPN, secreto/cifrado, solicitudes TGS | 4769 + inventario SPN y baseline | Que se rompió contraseña |
| T1558.004 AS-REP Roasting | Cuentas sin preautenticación | 4768 con campos pertinentes | Que cualquier TGT es anómalo |
| T1003.006 DCSync | Derechos de replicación y acceso RPC | 4662 focalizado, red y DC autorizado | Que todo 4662 es replicación abusiva |
| T1484.001 GPO Modification | Permiso modificar GPO/link; alcance | 5136 + SYSVOL/GP/Operational | Que GPO se aplicó a host |
| T1021.001 RDP | Logon derecho/red/host/identidad | 4624 tipo 10; RDP Operational | Que todo soporte remoto es lateral malicioso |
| T1021.002 SMB/Admin Shares | Cuenta con derechos y SMB permitido | 4624 tipo 3, 5140/5145, Sysmon3 | Que el acceso fue para ejecutar malware |
| T1021.006 WinRM | Acceso remoto configurado | WinRM, PowerShell, 4688/1 | Que `winrm` implica intrusión |
| T1053.005 Scheduled Task | Permiso de crear tareas | 4698/4702 y TaskScheduler | Que la tarea es persistencia adversaria |
| T1543.003 Windows Service | Permiso de instalar servicio | 4697/7045 y ejecución de binario | Que el servicio es malicioso |

Los enlaces ATT&CK sirven de **taxonomía de comportamientos** y no sustituyen la documentación de Microsoft sobre condiciones de emisión de eventos. Algunas capacidades y tácticas ATT&CK cambian; registrar fecha de consulta y versión al implementar. [R20–R23, R30]

## 19. Auditoría crítica de esta tanda

| Riesgo de diseño | Hallazgo crítico | Tratamiento |
|---|---|---|
| Dependencia excesiva de Event IDs | Event ID sin host/canal/política no demuestra cobertura | Requerir matriz de prerrequisitos por evento |
| Falsa certeza en Kerberoasting | 4769 es tráfico Kerberos normal en DC | Baseline y control preventivo además de indicadores |
| Falsa certeza DCSync | 4662 tiene usos generales y SACL | Correlacionar derechos/host/RPC/identidad |
| Confundir GPC/GPT | Evento de AD no mide automáticamente SYSVOL ni aplicación GPO | Validar ambas capas y `gpresult` |
| Exposición de datos por logging | Command line/4104 puede recoger secretos | Gobernanza de logs y datos sintéticos |
| Configuración de Sysmon genérica | Exceso de eventos o omisiones por filtros | Baseline y pruebas de inclusión/exclusión |
| Tutoriales antiguos de SMB | Supuestos de firma desactivada pueden no aplicar a Server 2025 | Verificar configuración real por versión |
| CA audit a medias | Ajustar `AuditFilter` no garantiza eventos si falta auditoría SO | Validar extremo a extremo en CA |
| Modelo de ataque sin retest | Hallazgo sin corrección reproducible | Prueba positiva + negativa obligatoria |
| Duplicación de mundos SOC | Repetir KQL/SPL/Sentinel/Splunk distrae del origen | Solo telemetría nativa y enlaces cruzados |

### 19.1. Limitaciones expresas de la investigación

- **Sin validación de ejecución:** no se han observado eventos ni medido rendimiento, compatibilidad ni coste de un laboratorio real.
- **Sin auditoría de notas privadas:** este prompt corto no entrega los 155 ficheros Markdown; los archivos existentes del usuario no se han leído ni contrastado individualmente.
- **Sin matriz completa CVE/exploit:** se requiere inventario de versiones y permisos, y no corresponde a este entregable elaborar cadenas de explotación destructivas.
- **Sin licencias/costes cerrados:** las licencias de laboratorio/evaluación y requisitos mínimos dependerán de edición y programas vigentes.
- **Sin promesas de eventos universales:** algunos eventos dependen de políticas, versiones, sensores, SACL y funciones de rol; cada lab exigirá prueba de generación.
- **Sin inferir funcionalidades de productos SIEM:** análisis en origen; no se diseñaron reglas de Sentinel/Splunk.

## 20. Tanda 4: insumos que quedan preparados

Integrar laboratorios de recuperación de System State, restauración de objetos/AD, backup SYSVOL, CA, cambio de DC/FSMO, contención de dominio y restauración con verificación. Unificar dependencias Windows↔AD↔Red Team↔SOC. Crear tabla final de lecciones con criterios de dominio, rangos de tiempo estimados, recursos por topología y costes verificados, rúbricas completas, diagnóstico inicial y misión integradora. El diseño debe distinguir `propuesto` de `ejecutado` y `validado`.

## 21. Bibliografía verificada y trazabilidad

**Consulta documental:** 2026-10-18. Las URL están asociadas a artículos/documentación accesibles durante esta investigación. Las fechas de publicación se indican solo cuando resultaron visibles y verificables; otras quedan `fecha de publicación no comprobada`. Las fuentes de Microsoft sustentan semántica y condiciones de telemetría; MITRE sustenta taxonomía/posibles comportamientos, no confirma por sí solo una implementación. **Confianza alta** para el alcance del documento oficial y **media** para inferencias pedagógicas o matrices de hipótesis pendientes de prueba.


- **[R01] Microsoft.** *Best practices for securing Active Directory*. [https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/best-practices-for-securing-active-directory). Uso: Hardening y monitorización de AD; activos privilegiados. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R02] Microsoft.** *Implementing Least-Privilege Administrative Models*. [https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models). Uso: Permisos, RBAC, cuentas administrativas y privilegios. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R03] Microsoft.** *Advanced Audit Policy Configuration settings*. [https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/advanced-audit-policy-configuration](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/advanced-audit-policy-configuration). Uso: Eventos y subcategorías de auditoría. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R04] Microsoft.** *Audit logon events*. [https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/basic-audit-logon-events](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/basic-audit-logon-events). Uso: Tipos de logon y eventos generales. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R05] Microsoft.** *4624(S): An account was successfully logged on*. [https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4624). Uso: Origen de emisión, campos y tipos de logon. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R06] Microsoft.** *4688(S): A new process has been created*. [https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688). Uso: Proceso y requisitos de command line. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R07] Microsoft.** *ADMX_AuditSettings Policy CSP*. [https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-auditsettings](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-auditsettings). Uso: Argumentos de procesos en claro y privacidad. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R08] Microsoft.** *Audit Directory Service Changes*. [https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-directory-service-changes](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-directory-service-changes). Uso: SACL y eventos 5136-5141. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R09] Microsoft.** *4662(S,F): An operation was performed on an object*. [https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4662](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4662). Uso: Operaciones AD y SACL; limitaciones. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R10] Microsoft.** *Audit Kerberos Authentication Service*. [https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-kerberos-authentication-service](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-kerberos-authentication-service). Uso: 4768, 4771 y 4772 en KDC. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R11] Microsoft.** *Audit Kerberos Service Ticket Operations*. [https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-kerberos-service-ticket-operations](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-kerberos-service-ticket-operations). Uso: 4769/4770/4773 y volumen DC. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R12] Microsoft.** *about_Logging (Windows PowerShell 5.1)*. [https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging?view=powershell-5.1](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging?view=powershell-5.1). Uso: Script Block Logging 4104 y Protected Event Logging. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R13] Microsoft Sysinternals.** *Sysmon v15.22 (10-09-2026)*. [https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon](https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon). Uso: Funciones, instalación, controles y Event IDs. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R14] Microsoft.** *Sysmon events*. [https://learn.microsoft.com/en-us/windows/security/operating-system-security/sysmon/sysmon-events](https://learn.microsoft.com/en-us/windows/security/operating-system-security/sysmon/sysmon-events). Uso: Semántica eventos Sysmon y correlación. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R15] Microsoft.** *Secure, delegate, and audit certification authority administration*. [https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/secure-delegate-audit-certification-authority](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/secure-delegate-audit-certification-authority). Uso: CA audit-filter + auditoría Windows; 4882, 4885, 4886–4888. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R16] Microsoft.** *Appendix B: Privileged Accounts and Groups*. [https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/appendix-b--privileged-accounts-and-groups-in-active-directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/appendix-b--privileged-accounts-and-groups-in-active-directory). Uso: Privilegios y grupos protegidos. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R17] Microsoft.** *Accounts security posture assessment — Defender for Identity*. [https://learn.microsoft.com/en-us/defender-for-identity/security-posture-assessments/accounts](https://learn.microsoft.com/en-us/defender-for-identity/security-posture-assessments/accounts). Uso: Riesgos de delegación y cuentas privilegiadas; solo referencia de postura. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R18] Microsoft.** *Windows Event Collector*. [https://learn.microsoft.com/en-us/windows/win32/wec/windows-event-collector](https://learn.microsoft.com/en-us/windows/win32/wec/windows-event-collector). Uso: WEF/WEC, suscripciones y conservación. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R19] Microsoft.** *Configuring Additional LSA Protection*. [https://learn.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/configuring-additional-lsa-protection](https://learn.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/configuring-additional-lsa-protection). Uso: LSASS protección y controles. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R20] MITRE ATT&CK.** *T1558.003 Kerberoasting*. [https://attack.mitre.org/techniques/T1558/003/](https://attack.mitre.org/techniques/T1558/003/). Uso: Contexto ofensivo y mitigaciones, no prueba de detección. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R21] MITRE ATT&CK.** *T1003.006 DCSync*. [https://attack.mitre.org/techniques/T1003/006/](https://attack.mitre.org/techniques/T1003/006/). Uso: Condiciones de abuso de replicación. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R22] MITRE ATT&CK.** *T1021.002 SMB/Windows Admin Shares*. [https://attack.mitre.org/techniques/T1021/002/](https://attack.mitre.org/techniques/T1021/002/). Uso: Servicios remotos y movimiento lateral. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R23] MITRE ATT&CK.** *T1484.001 Group Policy Modification*. [https://attack.mitre.org/techniques/T1484/001/](https://attack.mitre.org/techniques/T1484/001/). Uso: Riesgo de permisos GPO y aplicación a equipos. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R24] Microsoft.** *SMB security hardening*. [https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security-hardening](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-security-hardening). Uso: Firma SMB predeterminada Windows 11 24H2+/Server 2025. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R25] Microsoft.** *Protected Users security group*. [https://learn.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/protected-users-security-group](https://learn.microsoft.com/en-us/windows-server/security/credentials-protection-and-management/protected-users-security-group). Uso: Protecciones y limitaciones funcionales. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R26] MITRE ATT&CK.** *T1558.004 AS-REP Roasting*. [https://attack.mitre.org/techniques/T1558/004/](https://attack.mitre.org/techniques/T1558/004/). Uso: Preautenticación y protección contra cracking offline. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R27] Microsoft.** *Kerberos authentication overview*. [https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview). Uso: KDC, TGT/TGS y delegación. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R28] Microsoft.** *auditpol get*. [https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/auditpol-get](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/auditpol-get). Uso: Inspección de política efectiva. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R29] Microsoft.** *about_Logging_Windows (PowerShell 7.6)*. [https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows?view=powershell-7.6](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_logging_windows?view=powershell-7.6). Uso: Diferencias de motores, proveedores y políticas. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R30] MITRE ATT&CK.** *Enterprise tactics*. [https://attack.mitre.org/tactics/enterprise/](https://attack.mitre.org/tactics/enterprise/). Uso: Taxonomía de tácticas; versión vigente consultada. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R32] Microsoft.** *wevtutil*. [https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil). Uso: Inspección, exportación y propiedades del log. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
- **[R33] Microsoft.** *Audit Security Group Management*. [https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/audit-security-group-management](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/audit-security-group-management). Uso: 4728/4732/4756 y alcance de grupos. Consulta: 2026-10-18; confianza: alta para documentación/taxonomía dentro de su alcance.
