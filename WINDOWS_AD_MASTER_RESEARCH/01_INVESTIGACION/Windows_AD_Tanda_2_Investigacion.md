---
title: "Windows + Active Directory | Investigación técnica"
subtitle: "Tanda 2/4 · Active Directory Domain Services, seguridad, AD CS y PKI"
author: "Investigación documental · Administración, SOC y Red Team autorizado"
date: "2026-10-18"
lang: es
status: "Diseño documental; laboratorios no ejecutados"
---

# TANDA 2 — ACTIVE DIRECTORY COMPLETO: ADMINISTRACIÓN, ARQUITECTURA Y SEGURIDAD

**Cobertura:** AD DS, bosque/dominio/OU/esquema, DNS y DC Locator, catálogo global, sitios y replicación, FSMO, GPO/SYSVOL, Kerberos/NTLM, LDAP, objetos y grupos, ACL/delegación, cuentas de servicio, trusts, Tier 0, Windows LAPS, AD CS/PKI, diagnóstico y recuperación conceptual.

> **Alcance y trazabilidad.** Basado en los temas de `adwin(1).txt` y enlazado con `Windows_AD_Tanda_1_Investigacion.md`. Es la **segunda de cuatro tandas** pactadas. Se han consultado fuentes públicas de Microsoft Learn y Microsoft Support el 18/10/2026. No se han ejecutado laboratorios, modificado sistemas, reproducido ataques ni comprobado comandos en una VM. Los ejercicios y los tiempos son **propuestas**; las afirmaciones basadas en fuentes llevan identificadores `[Axx]`. La Tanda 3 desarrollará, sin duplicar, metodología Red Team y análisis SOC; la 4 ampliará recuperación, laboratorios integrados y currículo final.

## 0. Resumen ejecutivo y hallazgos de mayor importancia

**AD DS no es un servidor ni un protocolo:** es un servicio de directorio distribuido con múltiples fronteras y dependencias: identidad, DNS, Kerberos, LDAP, RPC, tiempo, replicación, políticas, PKI, control de acceso y recuperación. Un estudiante que sabe enumerar usuarios o explotar una delegación no necesariamente sabe operar, reparar o proteger un bosque.

1. **Bosque ≠ dominio ≠ OU ≠ sitio.** Un bosque comparte esquema y configuración; una OU organiza y delega dentro del dominio; un sitio representa proximidad de red, no un límite administrativo equivalente al bosque. [A01–A03]
2. **El límite de seguridad principal de AD DS es el bosque.** La separación en dominios y OUs no sustituye una frontera forestal para requisitos estrictos de aislamiento. Los trusts hacen interoperables las identidades pero no conceden automáticamente permisos sobre recursos. [A02, A27, A28]
3. **DNS y sincronización temporal son dependencias funcionales, no añadidos.** Un cliente puede resolver una IP y, aun así, fallar al localizar un DC apropiado, iniciar Kerberos o aplicar GPO. [A04, A05, A15]
4. **La replicación de AD no es la replicación de SYSVOL.** AD DS distribuye objetos/atributos; las GPO mantienen componentes tanto en AD como en SYSVOL, normalmente replicado mediante DFSR. Divergencia de ambas capas puede producir políticas inconsistentes. [A06, A11, A20]
5. **Windows Server 2025 añade un nivel funcional 2025 real.** No confundir SO del DC con nivel funcional: Server 2019/2022 tienen como máximo el nivel funcional 2016; un bosque con nivel funcional 2025 solo admite DC Server 2025. [A07]
6. **Kerberos no es simplemente “más seguro que NTLM” en todas las circunstancias.** Es necesario entender SPN, PAC, tickets, delegación, tipos de cifrado y fallbacks, y demostrar qué protocolo se utilizó en cada caso. [A12, A13]
7. **ACL y Tier 0 son rutas de control.** Una cuenta fuera de Domain Admins puede tener control efectivo de objetos críticos mediante permisos heredados, control de GPO, AD CS o sistemas que administran DCs. El etiquetado Tier 0 se determina por control real, no por nombre de OU. [A21–A23]
8. **AD CS es infraestructura de identidad.** Una CA que emite credenciales de autenticación, sus claves privadas, políticas, administradores y plantillas relevantes merecen tratamiento Tier 0 cuando pueden afectar a la identidad del dominio. [A21, A29–A33]
9. **Las modificaciones de mapeo fuerte de certificados ya entraron en aplicación obligatoria.** La referencia KB5014754 indica finalización de compatibilidad de la clave `StrongCertificateBindingEnforcement` a partir de la actualización del 09/09/2025: los tutoriales que proponen desactivar permanentemente el endurecimiento están obsoletos. [A34]
10. **Una copia de seguridad no equivale a recuperación demostrada.** Incluye recuperación de System State, SYSVOL, CA y plan forestal, con dependencias externas y prueba en aislamiento. El tratamiento integral corresponde a la tanda 4. [A35–A38]

**Decisión curricular:** primero arquitectura y operación básica de un dominio de laboratorio; después autenticación/GPO/replicación; luego delegación, PKI y hardening; por último auditoría integrada, diagnóstico y recuperación. No usar una lista de ataques como índice de aprendizaje.

## 1. Modelo de Active Directory: términos y fronteras

### 1.1. Servicio, base de datos, estructura y protocolos

- **AD DS:** almacén lógico distribuido de objetos (usuarios, grupos, equipos, servicios, políticas y más). Los DC ofrecen autenticación y consultas/escrituras autorizadas al directorio. [A01]
- **Bosque:** conjunto de dominios que comparten esquema, configuración y catálogo global de alcance forestal. Limita la confianza administrativa efectiva y la capacidad de control de identidad dentro del bosque. [A02]
- **Dominio:** ámbito de identidades, directivas de dominio y replicación de la partición de dominio. No asumir aislamiento pleno entre dominios del mismo bosque. [A02]
- **OU:** contenedor para delegación y aplicación de políticas; no es un límite de seguridad por sí mismo. Distinto de contenedores integrados como `CN=Users` y `CN=Computers` respecto a enlaces GPO. [A02, A10]
- **DC escribible:** aloja particiones y atiende escrituras autorizadas; DC adicionales ofrecen redundancia, pero no corrigen por sí solos errores lógicos replicados. [A01, A06]
- **RODC:** DC de solo lectura con modelo especial de caché de contraseñas y escenarios de sucursales. Tratar como extensión avanzada, no como equivalente funcional de un DC escribible.
- **Catálogo global (GC):** ofrece información parcial sobre objetos de otros dominios del bosque; importante en búsquedas y pertenencia a grupos universales. La existencia de GC no significa copia completa de todas las particiones. [A06]
- **LDAP/LDAPS:** protocolo/interfaz de consulta y operaciones de directorio; LDAP no equivale a AD DS ni a autenticación Windows. LDAP con TLS y LDAP firmado no son conceptos intercambiables. [A19]

### 1.2. Objetos, atributos y particiones

Los objetos tienen clases y atributos definidos por el **esquema**; las particiones (`naming contexts`) separan ámbitos de replicación. Particiones base: `Schema`, `Configuration` y partición de dominio; pueden existir particiones de aplicación (por ejemplo, DNS). El atributo **`distinguishedName`** identifica la posición actual del objeto; un **`objectGUID`** identifica al objeto más establemente ante cambios de nombre/movimiento, mientras **`objectSid`** identifica al principal de seguridad cuando procede. No todos los objetos tienen SID ni todas las propiedades son modificables por cualquiera.

| Concepto | Ejemplo sintético | Significado práctico |
|---|---|---|
| DN | `CN=Ana,OU=Ventas,DC=lab,DC=example` | Ruta del objeto en el directorio; puede cambiar |
| UPN | `ana@lab.example` | Nombre de inicio de sesión; no necesariamente coincide con correo |
| sAMAccountName | `ana` | Identificador de compatibilidad habitual |
| objectGUID | GUID reservado del objeto | Seguimiento lógico de modificaciones |
| objectSid | SID del principal | Autorización de identidades |
| memberOf / member | Atributos de pertenencia | La pertenencia anidada exige expansión para evaluar permisos |
| servicePrincipalName | `HTTP/app.lab.example` | Identificador de instancia de servicio para Kerberos |
| nTSecurityDescriptor | Descriptor de seguridad | Owner/DACL/SACL y su interpretación |
| gPLink / gPOptions | Atributos del contenedor | Enlaces GPO, herencia y alcance |

**Comprobación medible:** dado un DN, reconstruir ámbito de dominio/OU; identificar qué atributos son estables y cuáles pueden cambiar, qué particiones se replican a qué DC y cuándo una lectura puede ser parcial.

### 1.3. Arquitectura física

Separar **topología lógica** (dominios, OUs, identidades) de **topología física** (sitios, subredes, enlaces, DC, latencia). En un diseño con dos ubicaciones se debe documentar: redes, subredes asignadas a sitios, enlaces/costes, DC/GC/DNS por sitio, tolerancia a caída, latencia esperada y servicio durante la pérdida del enlace WAN. [A02, A03, A06]

### 1.4. Niveles funcionales y compatibilidad

| Nivel del bosque/dominio | DC Windows Server 2025 | DC Server 2022/2019/2016 | Consideraciones |
|---|---|---|---|
| 2025 | Sí | No | Todos los DC compatibles deben ser 2025; capacidades nuevas como opción de páginas 32K |
| 2016 | Sí | Sí | Compatibilidad moderna con DC 2016–2025 |
| 2012 R2 | **No** para DC 2025 | Depende de versión (2022/2019/2016 compatibles según matriz) | Planificar elevación antes de introducir DC 2025 |

**Dato verificable:** en Server 2019/2022 no existe nivel funcional “2019/2022”; se utiliza el de 2016. Subir el nivel funcional requiere estado de replicación sano, compatibilidad de DC y plan de cambio; no elevarlo solo por usar un DC nuevo. [A07, A08]

## 2. Diseño y despliegue de un dominio de laboratorio

### 2.1. Decisiones previas

Un laboratorio mínimo: `DC01` (Windows Server 2025; DNS y AD DS), `W11-01` (Windows 11), red **aislada** `LAB-AD` con salida a Internet opcional y muy controlada; expansión a `DC02`, `SRV-APP` y segundo sitio para pruebas posteriores. Usar un namespace reservado como `lab.example` **solo de forma ilustrativa**; elegir nombre DNS que no colisione con una infraestructura real y documentar resolución. Definir IP fija del DC, DNS interno del cliente, DNS forwarders si procede, NTP, credenciales de administración separadas y estrategia de snapshots/backups de laboratorio.

**No se ha desplegado el laboratorio.** Los costes/licencias, recursos de RAM y compatibilidad de hipervisor dependerán del hardware y edición concreta; verificar antes de ejecutarlo.

### 2.2. Promoción y validación operativa

Secuencia de diseño (no ejecución): prevalidar IP/DNS/hostname/actualizaciones → instalar rol AD DS → promover a DC/crear bosque → validar registros SRV y servicios → crear OU, usuario/grupo y estación miembro → comprobar inicios de sesión, recursos, GPO y auditoría. Capturar siempre estado previo y posterior.

| Validación | Herramienta orientativa de **lectura** | Evidencia esperada |
|---|---|---|
| Existencia y funcionalidad de DC | `Get-ADDomainController -Filter *`, `dcdiag` | DC y pruebas categorizadas; investigar fallos concretos |
| Dominio y bosque | `Get-ADDomain`, `Get-ADForest` | FQDN, niveles, DC, GC, roles |
| DNS del dominio | `Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.lab.example` | Respuestas SRV plausibles y resolubles |
| Localización DC desde cliente | `nltest /dsgetdc:lab.example` | DC encontrado; revisar sitio y flags |
| Salud inicial replicación | `repadmin /replsummary` | Sin fallos en topología con varios DC; no aporta utilidad con un solo DC para replicación entre DC |
| SYSVOL y NETLOGON | `Get-SmbShare` desde DC, `Test-Path \\DC01\SYSVOL` | Recursos publicados y accesibles según permisos |
| Canal seguro | `Test-ComputerSecureChannel` **desde un miembro** | Resultado saludable; no asumir que es herramienta de diagnóstico DC |

**Distinción:** comandos de consulta y diagnóstico pueden requerir permisos; no deben emitirse automáticamente contra un dominio de producción sin alcance autorizado.

## 3. DNS, DC Locator, catálogo global, sitios y tiempo

### 3.1. Por qué DNS es una dependencia de identidad

El **DC Locator** utiliza, entre otros mecanismos, registros SRV de DNS para descubrir servicios de directorio y un DC adecuado; Netlogon puede almacenar el resultado en caché. No basta con que `ping dc01` tenga respuesta. Registros orientativos:

- `_ldap._tcp.dc._msdcs.<dominio>`: localización de DC para servicio LDAP.
- `_kerberos._tcp.<dominio>`: descubrimiento de KDC.
- `_ldap._tcp.<sitio>._sites.dc._msdcs.<dominio>`: selección sensible a sitio.
- `_gc._tcp.<bosque>`: acceso a catálogo global cuando proceda.

**Síntomas frecuentes:** inicio de sesión intermitente, cliente localizando DC remoto, GPO que no se aplica, unión al dominio fallida o errores de replicación. Diagnóstico ordenado: IP y adaptador → servidores DNS usados → resolución SRV/A → respuesta TCP/UDP según servicio → localización DC/sitio → hora → autenticación y política. [A04, A05]

### 3.2. Sites, subnets y links

- Los **sitios** agrupan subredes con conectividad razonable para optimizar afinidad de cliente y replicación.
- Los **site links** describen rutas lógicas, costes, intervalos y calendarios entre sitios. No son el trazado físico del cable ni un firewall.
- KCC crea conexiones de replicación y puede reajustarlas; **no se deben crear enlaces/conexiones manuales sin evidencia de necesidad**. [A06, A09]
- Un cliente cuya subred no está asignada puede elegir DC no óptimo. Diagnosticar sitio con `nltest /dsgetsite`, y documentar la topología.

### 3.3. Hora, Kerberos y sincronización

La sincronización horaria afecta a Kerberos y a la causalidad forense. Diferenciar **zona horaria**, **UTC de los logs** y **desfase de reloj real**. Revisar jerarquía de tiempo de dominio, PDC Emulator y fuente confiable. Herramientas como `w32tm /query /status` y `/query /source` sirven para evidenciar estado; no cambiar servidores NTP sin aprobación. Un fallo temporal debe demostrarse, no inferirse exclusivamente de “no puedo iniciar sesión”.

## 4. Replicación, FSMO, GC y SYSVOL

### 4.1. Replicación de AD DS

Replicación **multimaster** para la mayoría de escrituras, condicionada por los roles especiales FSMO. Estudiar `USN`, `invocationID`, metadatos/versionado, vectores de actualización, objetos lingering/tombstones y convergencia. `repadmin /showrepl` permite examinar conexiones entrantes y fallos por partición; `repadmin /replsummary` ofrece un resumen. No confundir un último éxito reciente con consistencia semántica universal. [A06, A09]

**Diagnóstico por hipótesis** de replicación:

1. Confirmar existencia y accesibilidad de ambos DC y particiones.
2. Revisar DNS, TCP/RPC, autenticación Kerberos, tiempo, errores de red y credenciales.
3. Relacionar mensajes de `Directory Service`, `DNS Server`, `DFS Replication` y resultado `repadmin`.
4. Determinar alcance (un DC, una partición, un site link o todo el bosque).
5. Proponer corrección de mínimo impacto, respaldo previo y criterio de rollback.
6. Tras corregir, verificar convergencia con lectura desde DC distintos.

Microsoft identifica DNS, red y seguridad como causas habituales de fallos de replicación. [A09]

### 4.2. Los cinco roles FSMO (no son cinco “superadministradores”)

| Rol | Ámbito | Propósito / síntoma de fallo | Evidencia de diagnóstico |
|---|---|---|---|
| Schema Master | Bosque | Coordina modificaciones al esquema | `Get-ADForest` o `netdom query fsmo` |
| Domain Naming Master | Bosque | Adición/eliminación de dominios o particiones según función | Dueño del rol y conectividad |
| RID Master | Dominio | Asigna pools RID a DC para crear SIDs únicos | Errores de asignación RID; pools restantes |
| PDC Emulator | Dominio | Funciones de referencia para contraseña/tiempo y compatibilidad | PDC, W32time, autenticación |
| Infrastructure Master | Dominio | Actualiza referencias a objetos de otros dominios | Dependencia de GC y configuración multi-dominio |

**Regla operativa:** **transferir** roles de forma controlada si el DC anterior funciona; **seize** solo tras analizar pérdida prolongada y las consecuencias de reintroducir al anterior. Las operaciones de rol son disruptivas y no pertenecen a una práctica introductoria. [A10]

### 4.3. SYSVOL, DFSR y consistencia de GPO

Una GPO tiene un **Group Policy Container (GPC)** en AD y un **Group Policy Template (GPT)** en SYSVOL. AD replica GPC; DFSR replica SYSVOL. Comparar versiones, permisos y accesibilidad. Un evento favorable en `repadmin` no demuestra que SYSVOL esté íntegro; revisar logs `DFS Replication`, shares y versiones de GPO. FRS es herencia tecnológica; en entornos modernos enseñar DFSR y la ruta de migración cuando proceda, no configurar FRS como norma. [A07, A11]

## 5. GPO: creación, alcance, precedencia, aplicación y troubleshooting

### 5.1. Modelo de procesamiento

Orden general **L-S-D-OU**: Local → Site → Domain → OU padre → OU hija. Por defecto las aplicaciones posteriores con configuración equivalente pueden prevalecer. Sin embargo, el resultado concreto depende de enlace, orden, estado GPO, filtros de seguridad, WMI, **Enforced**, **Block Inheritance**, loopback y CSE. No enseñar «la OU siempre gana» como axioma. [A11, A12]

- **Link vs objeto GPO:** la política es un objeto; su ámbito proviene de enlaces. Modificar un GPO compartido puede afectar múltiples OU.
- **Read y Apply Group Policy:** permisos distintos; la efectividad depende de ambos y del contexto apropiado.
- **WMI filter:** se evalúa en el dispositivo y añade coste/fragilidad si está mal diseñado.
- **Enforced:** propiedad del enlace que modifica precedencia respecto al bloqueo de herencia.
- **Block Inheritance:** propiedad del contenedor; no neutraliza enlaces forzados aplicables.
- **Loopback (Merge/Replace):** políticas de usuario condicionadas por el equipo (kioscos, RDS); requiere práctica específica.
- **Política del equipo vs del usuario:** son ámbitos diferentes; no asumir que una regla de ordenador “siempre sustituye” a una configuración de usuario de naturaleza distinta.

### 5.2. Herramientas y criterios de verificación

| Operación | Lectura / comprobación | Cambios (solo laboratorio) |
|---|---|---|
| Resultado efectivo | `gpresult /r`, `gpresult /h resultado.html`, `rsop.msc` (con límites) | Ajustes en GPMC tras diseño |
| Actualización de políticas | Historial/eventos `Microsoft-Windows-GroupPolicy/Operational` | `gpupdate /force` cuando justificado |
| Análisis de GPO | GPMC, `Get-GPO`, `Get-GPInheritance` | Edición con backup/rollback |
| Capa GPT | SYSVOL, versiones y accesibilidad SMB | Corregir DFSR/ACL únicamente con plan |

**Laboratorio diferencial:** GPO de firewall enlazada a OU y filtrada a un grupo. El estudiante debe predecir **quién** la recibe, evidenciar que se aplicó a un equipo permitido y no a otro, descubrir un filtro WMI erróneo y demostrar recuperación tras rectificarlo. Un `gpupdate` que termina sin error **no** demuestra que un ajuste específico tenga efecto.

## 6. Autenticación: Kerberos, NTLM, LDAP y cuentas

### 6.1. Flujo Kerberos (lo que realmente hay que comprender)

1. Cliente solicita un **TGT** al KDC (AS). La autenticación inicial puede incorporar diversos métodos conforme a configuración.
2. Con TGT, solicita un **service ticket** para un SPN (TGS).
3. Presenta el ticket al servicio; el servicio lo valida y aplica controles de autorización.
4. El **PAC** transporta información relevante para autorización y tiene validaciones/condiciones dependientes del escenario.

Conceptos: KDC en DC, secreto de cuenta del servicio, `krbtgt`, SPN único, cifrados negociados, preautenticación, ticket lifetime, clock skew, delegación, PAC, `klist` y eventos de DC. Kerberos ofrece autenticación mutua en condiciones soportadas; su uso efectivo **no prueba** por sí solo que el servicio final esté bien autorizado. [A13]

**Ejercicio de diagnóstico:** un acceso SMB por FQDN funciona pero por alias falla: evaluar DNS, SPN, cuenta de servicio, ámbito y protocolo efectivamente negociado; no concluir automáticamente “Kerberos roto” ni añadir SPN duplicados indiscriminadamente.

### 6.2. NTLM y mecanismos de fallback

NTLM opera en escenarios de compatibilidad y no ofrece todas las propiedades de Kerberos. Su presencia puede indicar legado, negociación no deseada o una dependencia legítima aún sin migrar. Investigar causa, alcance, aplicación, evento/fuente y plan de reducción gradual antes de imponer bloqueo. Un rechazo NTLM podría interrumpir aplicaciones y cuentas de servicio heredadas. No atribuir autenticación NTLM a una “brecha confirmada”. [A14]

### 6.3. SPN y delegación

- **SPN:** asociación entre servicio e identidad. Duplicados/ausencias causan fallos; un SPN no otorga derechos de acceso.
- **Delegación no restringida:** servicio puede actuar por usuarios hacia múltiples destinos según mecanismo; alto impacto, evitar salvo excepcionalidad avalada.
- **Delegación restringida clásica:** limita servicios destino, pero exige validar confianza y rutas de configuración.
- **Resource-based constrained delegation (RBCD):** decisión de autorización en el lado del recurso destino; no equivale a «siempre segura», ya que controlar el descriptor que autoriza a los delegantes crea riesgo. [A15]

**SOC/Red Team:** priorizar la identificación y justificación de relaciones de delegación, quién puede modificarlas y qué servicios/identidades quedarían expuestos; la ejecución de técnicas ofensivas queda para Tanda 3 en entorno cerrado.

### 6.4. LDAP: autenticación, integridad, confidencialidad

Distinguir:

- LDAP en TCP 389 y LDAP sobre TLS por StartTLS según configuración/cliente.
- LDAPS en 636 con TLS y cadena de confianza válida.
- Firma LDAP en ciertos mecanismos SASL para integridad y protección frente a manipulación.
- **Channel Binding Tokens (CBT)** para ligar autenticación a un canal TLS según política/cliente.
- Simple bind sin TLS: **no aceptable** para credenciales reales; auditar y remediar por fases.

Las políticas de LDAP signing y channel binding y su telemetría dependen de versión, parches y configuración. Revisar documentación oficial antes de usar IDs de evento; no memorizar un ID sin conocer contexto ni habilitación. [A16]

### 6.5. Cuentas y objetos de servicio

- **Usuario humano:** identidad nominativa; separar cuentas administrativas y de trabajo.
- **Equipo:** principal de seguridad con secreto/canal seguro; unión al dominio no concede administración global.
- **Cuenta de servicio tradicional:** rotación, uso compartido, SPN y privilegios requieren inventario; evitar contraseñas fijas reutilizadas.
- **sMSA/gMSA:** gestionan automáticamente credenciales dentro de sus condiciones de soporte; gMSA permite escenarios de servicios en varios hosts autorizados y requiere planificación de KDS y permisos de hosts. [A17]
- **dMSA (Server 2025):** funcionalidad posterior para migración/cuentas gestionadas delegadas; **optativa avanzada** hasta confirmar compatibilidad exacta, mitigaciones publicadas y flujo de migración vigente en la versión objetivo. [A18]

## 7. Identidades, grupos, ACL y delegación administrativa

### 7.1. Tipos y ámbitos de grupo

Los ámbitos **Global**, **Universal** y **Domain Local** tienen reglas de membresía y asignación distintas, relevantes especialmente en escenarios multidominio o con trusts. El patrón **AGDLP/AGUDLP** es una **convención de diseño** (Accounts → Global → Domain Local → Permissions; con Universal cuando conviene), no una propiedad obligatoria del motor de autorización. Debe explicarse con ejemplos positivos y negativos de acceso efectivo. [A19]

### 7.2. Seguridad de los objetos AD

Un descriptor de seguridad contiene propietario, DACL/SACL (cuando corresponda) y ACE. Los derechos de AD sobre objetos/atributos no son idénticos a `icacls` sobre NTFS: existen derechos extendidos, permisos por propiedad/propiedad de conjunto y ACE heredadas sujetas a clase/alcance. Conceptos de alto impacto para **revisión defensiva**:

| Capacidad autorizada sobre objeto | Riesgo si se delega indebidamente | Verificación segura |
|---|---|---|
| Cambiar miembros de grupo privilegiado | Conceder acceso de alto impacto | Leer ACE y verificar cambio denegado a identidad no autorizada |
| Modificar DACL/propietario | Crear rutas de control persistente | Inspeccionar nTSecurityDescriptor e identificar principal y herencia |
| Modificar GPO / sus enlaces | Alterar configuración masiva | Revisar permisos GPC+GPT y enlaces; prueba positiva/negativa |
| Restablecer contraseña de usuario | Suplantación de identidad | Delimitar OU/objetos y prueba en usuario sintético |
| Escribir propiedades sensibles de equipo/servicio | Cambio indirecto en autenticación/delegación | Leer metadatos, delegaciones y autoridad de modificación |
| Controlar plantillas de AD CS | Emisión de credenciales de confianza | Inspeccionar ACL, atributos, publicación y alcance de inscripción |

**Regla:** una configuración permisiva es un **indicio**; para afirmar vía explotable se requieren prerrequisitos completos y validación apropiada. No escribir listas de ataques como sustituto del razonamiento de control de acceso.

### 7.3. Delegación segura: qué probar

Documentar propósito, identidad/grupo delegado, objetos de destino, derechos mínimos, duración, dueño del cambio, revocación, prueba positiva (debe poder hacer una operación permitida) y negativa (no debe modificar objetos prohibidos). **No usar Domain Admins para operaciones ordinarias** por conveniencia. Diseñar un caso de Help Desk autorizado a restablecer contraseña **solo en `OU=Usuarios-Prueba`**, pero incapaz de modificar usuarios protegidos o cuentas de otros departamentos.

### 7.4. AdminSDHolder, SDProp y cuentas protegidas

Los objetos protegidos no heredan permisos de modo habitual. El objeto `AdminSDHolder` actúa como plantilla; **SDProp** compara y restaura descriptores sobre cuentas/grupos protegidos periódicamente (por defecto ~60 minutos desde el DC PDC Emulator). Una delegación sobre la OU puede parecer “rota” debido a estas protecciones; no deshabilitarlas para “hacer que funcione”. El atributo `adminCount` **por sí solo** no demuestra pertenencia actual a un grupo protegido. [A22]

## 8. Trusts: alcance real y análisis de la frontera

### 8.1. Tipos y propiedades

Las relaciones de confianza permiten aceptar comprobaciones de identidad entre dominios/bosques. Diferenciar **dominio que confía** (con recursos) de **dominio confiado** (identidades); la dirección de trust se expresa desde el punto de vista de una de las partes, por lo que es fácil invertirla al explicarla. Consultar `Get-ADTrust`, `netdom trust` (lectura según sintaxis) y el `trustDirection` de la especificación. [A26–A28]

| Tipo | Relación habitual | Transitividad típica | Estudio recomendado |
|---|---|---|---|
| Parent–child | Dominios de un árbol | Transitiva | Central |
| Tree-root | Árboles de un bosque | Transitiva | Central |
| Forest trust | Entre bosques | Transitiva bajo su modelo | Avanzado central |
| External trust | Dominios de bosques distintos | No transitiva | Avanzado |
| Shortcut trust | Dominios de un bosque | Transitiva según configuración | Optativo |
| Realm trust | AD ↔ reino Kerberos externo | Depende del diseño | Optativo |

**Confianza no implica permisos sobre un share, base de datos o DC.** Es necesario comprobar autenticación autorizada y ACL en el recurso final. La autenticación selectiva, SID filtering, `SIDHistory`, resolución de nombres y la dirección de flujo necesitan comprobaciones independientes. [A27]

### 8.2. Escenario pedagógico

Bosque A (recursos) y bosque B (usuarios). Requerimiento: usuarios B pueden acceder únicamente a un recurso de prueba en A. Verificar trust, DNS entre bosques, autenticación selectiva cuando proceda, grupo de autorización del recurso y denegación para un usuario B no permitido. No crear trusts reales ni emitir credenciales desde una red que no sea íntegramente de laboratorio.

## 9. Tier 0, separación de funciones, hardening y postura

### 9.1. El verdadero alcance de Tier 0

Tier 0 comprende activos que controlan el **plano de identidad** (DC, cuentas/grupos privilegiados, administradores de hypervisor de DC, sistemas de backup con capacidad de restaurar DC, CA con credenciales relevantes, servidores que controlan agentes privilegiados, Entra Connect según privilegios). Tier 1 administra servidores/aplicaciones; Tier 2, puestos y usuarios ordinarios. Es un modelo de confianza de credenciales y control, no simplemente tres VLAN. [A21]

El **Enterprise Access Model** amplía el alcance a entornos híbridos, separando plano de control, administración, cargas de trabajo y acceso de usuarios/aplicaciones. Para el mundo AD DS, enseñar el modelo de tiers como base, y la extensión híbrida como enlace al mundo Microsoft; **AD DS no es Entra ID**. [A23]

### 9.2. Controles mínimos a auditar

| Riesgo | Control razonado | Evidencia requerida | Riesgo residual |
|---|---|---|---|
| Uso diario de Domain Admin | Cuentas separadas, PAW y roles delegados | Logon de identidad privilegiada restringido y pruebas negativas | Compromiso de PAW / procesos Tier 0 |
| Contraseñas admin locales repetidas | Windows LAPS en AD DS | Rotación y acceso de recuperación según ACL; cifrado cuando soportado | Lectura por operadores mal autorizados |
| SPN/cuentas servicio sin gobernanza | Inventario, mínimo privilegio, gMSA cuando soportado | Titular, hosts permitidos, SPN, fecha/rol | Aplicación incompatible o permisos heredados |
| LDAP simple bind sin protección | Migración a firma/TLS y CBT | Clients inventariados, eventos y pruebas con clientes reales | Dependencia heredada no remediada |
| GPO modificable por grupos amplios | Restricción de DACL/GPT; control de cambios | Inventario de delegados y resultado de prueba negativa | Credenciales de administradores de GPO |
| CA o plantillas sobreprivilegiadas | Segregación de rol, plantillas mínimas, auditoría | ACL, solicitudes, emisores, claves y logs | Dependencia de clave privada/backup CA |
| DC sin backup verificable | Backup System State/BMR y ensayo de restore | Recuperación en red aislada y RTO medido | Pérdida de cambios posteriores |

No hacer del endurecimiento una lista universal de interruptores: cada control requiere compatibilidad, prueba piloto, cobertura y rollback.

### 9.3. Windows LAPS

Windows LAPS puede respaldar contraseñas locales administradas a AD DS; **el cifrado del secreto en AD exige nivel funcional de dominio 2016 o superior**, con condiciones de versión. Diferenciar ACL que protege una contraseña almacenada sin cifrar del cifrado integrado, derechos de lectura y capacidad de descifrado. Para DC se contempla gestión de contraseña DSRM bajo condiciones específicas; tener únicamente la contraseña en AD no resuelve un fallo completo de todos los DC sin respaldo externo. [A24, A25]

## 10. Active Directory Certificate Services y PKI

### 10.1. Qué hay que comprender antes de auditar AD CS

Una **PKI** combina emisión, validación, revocación y ciclo de vida de claves/certificados. Un certificado no es una contraseña; su riesgo depende de usos (EKU, identidad vinculada, aplicación, confianza, posesión de clave privada, revocación, mapeo y políticas). Conceptos obligatorios: CA raíz vs emisora, CA offline/online, clave privada, cadena, almacenes Windows, EKU, Key Usage, CSR, plantillas, SAN, autoenrollment, CRL, CDP, AIA, OCSP, `certutil`, `certreq`, `certlm.msc`, `certmgr.msc`, PKINIT y trust anchors. [A29–A33]

### 10.2. Enterprise CA frente a Standalone CA

- **Enterprise CA:** integrada con AD DS, utiliza plantillas de certificado que residen en el directorio; puede habilitar inscripción automática según diseño.
- **Standalone CA:** no necesita AD DS ni usa plantillas empresariales; proceso de solicitud/administración diferente.
- **Raíz offline + CA emisora online:** patrón de separación de confianza/operación a valorar, no obligación universal para cualquier laboratorio de una sola VM. [A29]

### 10.3. Plantillas, permisos y riesgos de identidad

Examinar conjuntamente: quién puede **leer**, **enroll** o **autoenroll**; quién puede **modificar** la plantilla; quién decide el **subject/SAN**; qué EKU permite autenticación; si hacen falta aprobaciones/agentes autorizados; en qué CAs está **publicada**; qué políticas de mapeo y parches existen; qué CA se considera confiable para autenticación.

| Elemento | Pregunta de control | Evidencia de aceptación |
|---|---|---|
| EKU | ¿Permite autenticación de cliente u otra capacidad sensible? | EKU y dependencia real de la aplicación |
| Subject/SAN | ¿Quién aporta la identidad del certificado? | Configuración y prueba de emisión en piloto |
| DACL plantilla | ¿Quién puede modificar o inscribirse? | DACL, grupo esperado, pruebas positiva/negativa |
| Publicación CA | ¿CA realmente emite la plantilla? | Lista de plantillas de CA y solicitud piloto |
| Mapeo usuario-certificado | ¿Existe un vínculo fuerte aprobado con la cuenta? | Resultado del KDC, compatibilidad y eventos |
| Revocación | ¿CRL/OCSP disponibles cuando una aplicación lo exige? | Verificación de rutas CDP/AIA y respuesta según política |
| Clave privada CA | ¿Está bajo control, backup y segregación? | Evidencia de custodia y ensayo de recuperación autorizado |
| Roles operativos | ¿CA admin, certificate manager, enrollment agent y auditor segregados? | Matriz de roles y autorizaciones efectivas |

**No equivale** “plantilla permite enrolar” a “se puede suplantar cualquier usuario”; se necesitan condiciones y una ruta concreta de confianza/autenticación. No extrapolar clasificaciones técnicas de herramientas ofensivas a vulnerabilidad demostrada sin verificar precondiciones. [A30, A31]

### 10.4. Endurecimiento moderno del mapeo de certificados

Microsoft publicó KB5014754 para introducir mapeo fuerte en autenticación basada en certificados después de vulnerabilidades de suplantación. El modo de compatibilidad que se describía en artículos antiguos **ya no es una solución persistente soportada después de septiembre de 2025**. Para un laboratorio 2026 hay que explicar SID extension/mapeo explícito fuerte y distinguir certificados emitidos antes/después, CA Microsoft/no Microsoft, vigencia de parches y logs del KDC. [A34]

### 10.5. Revocación y continuidad

Revocar un certificado, publicar CRL y comprobar que el consumidor ejecuta comprobaciones de revocación son **tres hechos distintos**. Planificar disponibilidad de CDP/OCSP, expiraciones, renovación, revocación, publicación y restauración de CA. No exponer clave privada CA en ejercicios, incluso si se usa un entorno de laboratorio compartido. [A32]

## 11. Diagnóstico transversal: escenarios y árbol de decisión

| Síntoma | Hipótesis inicial | Pruebas de lectura | Error habitual a evitar |
|---|---|---|---|
| No se puede unir cliente a dominio | DNS equivocado / credenciales / servicio DC | DNS del cliente, SRV, `nltest`, conectividad | Abrir todos los puertos del firewall |
| Usuario inicia sesión solo con DC01 | Replicación o DC Locator | `repadmin`, consultas fijando `-Server`, DNS y site | Resetear cuentas indiscriminadamente |
| GPO “no funciona” | Scope, Read/Apply, WMI, CSE, SYSVOL | `gpresult`, GroupPolicy/Operational, GPMC y DFSR | Repetir `gpupdate /force` sin diagnóstico |
| Acceso por IP pero no FQDN | DNS/SPN o diferencia de autenticación | `klist`, DNS/SPN, eventos y contexto de recurso | Añadir SPNs sin revisar duplicados |
| Cuenta de servicio falla tras rotación | Secreto, SPN o permisos de host | Identity de servicio, gMSA, logs | Revertir a contraseña estática compartida |
| DCs muestran grupos distintos | Replicación / consulta a GC parcial | `repadmin /showrepl`, consulta explícita por DC | Concluir intrusión por inconsistencias |
| Solicitud certificado denegada | ACL plantilla, publicación, policy, compatibilidad | CA + plantilla + principal + logs | Dar Enrollment a Authenticated Users |
| Certificado emitido no autentica | Cadena, EKU, mapeo fuerte, reloj o revocación | KDC, CA, almacén, CRL y eventos | Desactivar endurecimiento del KDC |
| Permiso delegado se revierte | AdminSDHolder/SDProp | Permisos objeto protegido, pertenencia, `adminCount` contextual | Modificar AdminSDHolder sin plan |
| Fallo al recuperar DC virtualizado | VM GenID, backup, replicación o SYSVOL | Inventario de backups, logs, DC compañero | Usar snapshot como única estrategia de backup |

**Método obligatorio del estudiante:** síntoma → hipótesis falsable → datos precisos (host/DC, fecha UTC, cuenta, versión, error exacto) → prueba reproducible → conclusión **con incertidumbre** → remediación reversible → prueba positiva/negativa → registro final.

## 12. Aproximación SOC y Red Team: conexión sin duplicar la tanda 3

### 12.1. Matriz de observabilidad en origen

| Actividad nativa AD | Fuente típica | Límite probatorio que debe enseñarse |
|---|---|---|
| Autenticación Kerberos | Security DC (4768, 4769, 4771), según política/configuración | Solicitud de ticket ≠ acceso exitoso al recurso |
| Validación NTLM | Security DC (4776), según escenario | Validación ≠ prueba completa de sesión maliciosa |
| Cambios de usuario/grupo | Security DC (4720, 4726, 4728, 4732, 4756, 4738...), según auditoría | Diferenciar grupo global/local/universal y tipo de cambio |
| Cambios de objeto directorio | Security DC (5136; auditoría DS Changes) | Requiere configuración; evento no explica intención |
| Acceso a objetos sensibles | Security DC (4662 con SACL adecuada) | Depende de SACL, permisos, volumen y contexto |
| GPO | AD + GroupPolicy/Operational en cliente, SYSVOL/DFSR | Un cambio AD no demuestra aplicación efectiva |
| CA | Security CA (p. ej., 4886/4887, si se habilitan auditorías apropiadas) | Solicitud o emisión ≠ autenticación real con certificado |
| LDAP signing/CBT | Directory Service DC | IDs específicos y semántica cambian según versiones/documentación |
| Replicación fallida | Directory Service, DFS Replication, `repadmin` | Error operativo no confirma sabotaje |

Estos eventos son **puntos de investigación**, no reglas SIEM ni una garantía universal. La tanda 3 precisará prerequisitos, campos, sesgos y pruebas de cobertura; las consultas SPL/KQL quedan en mundos existentes.

### 12.2. Perspectiva Red Team autorizada

El evaluador aprende a describir **rutas de control** (permisos de OU/GPO, credenciales de servicios, delegaciones, trusts y certificados) con un grafo explicativo y sin tocar recursos fuera de alcance. Todo hallazgo debe etiquetarse: **configuración → indicio → condición verificable → acceso demostrado en laboratorio → impacto confirmado**. La existencia de una cuenta privilegiada o un SPN no prueba una ruta explotable. El análisis técnico ofensivo operativo irá en la tanda 3.

## 13. Diseño curricular provisional: etapas secuenciales

Cada etapa es provisional. La numeración `AD-xx` se integra con las `WIN-01…WIN-09` de la Tanda 1. Las horas son **estimaciones**, no valores observados; no equivalen a horarios oficiales de Microsoft. Se distingue **lectura**, **práctica hecha**, **evaluación superada** y **dominio** (competencia repetible con nueva evidencia).

| ID | Etapa | Prerrequisitos | Evidencia de dominio | Dedicación estimada |
|---|---|---|---|---|
| AD-01 | Directorio, bosque/dominio/OU, esquema | WIN-03, Redes DNS | Dibujar relaciones y determinar fronteras de seguridad | 5–8 h |
| AD-02 | Despliegue de DC y cliente | AD-01, WIN-07 | Validar unión, DC Locator y salud inicial | 6–10 h |
| AD-03 | DNS, GC, sitios y reloj | AD-02 | Diagnosticar DC no óptimo y SRV/hora | 6–9 h |
| AD-04 | LDAP, objetos y PowerShell AD | AD-02, WIN-06 | Inventario read-only con DN/GUID/SID y filtro correcto | 5–8 h |
| AD-05 | Kerberos, NTLM, SPN y servicios | AD-03, AD-04 | Identificar protocolo y causa de un fallo de autenticación | 9–14 h |
| AD-06 | Grupos, autorización y ACL AD | AD-04, WIN-03 | Resolver acceso efectivo y delegación mínima | 7–11 h |
| AD-07 | GPO, SYSVOL, precedencia | AD-03, AD-06 | Acreditar aplicación/denegación y corregir scope | 8–12 h |
| AD-08 | Replicación, FSMO y GC | AD-03, AD-04 | Explicar y diagnosticar desincronización entre DC | 9–14 h |
| AD-09 | Cuentas de servicio y delegación Kerberos | AD-05, AD-06 | Diseñar uso de gMSA y límites RBCD | 7–11 h |
| AD-10 | Trusts y multidominio | AD-05, AD-08, AD-06 | Explicar dirección/acceso y pruebas negativas | 7–11 h |
| AD-11 | Tier 0, AdminSDHolder, LAPS | AD-06, AD-07, AD-09 | Matriz de control Tier 0 y prueba de privilegios mínimos | 9–13 h |
| AD-12 | PKI, CA, plantillas y revocación | AD-05, AD-06, AD-11 | Auditoría de plantilla con confianza/mapeo fuerte | 12–18 h |
| AD-13 | Diagnóstico AD integral | AD-07, AD-08, AD-09, AD-12 | Caso multi-causa con pruebas de hipótesis | 9–14 h |
| AD-14 | Recuperación AD (fundamentos) | AD-08, AD-11, AD-12 | Proponer plan y validaciones sin confundir snapshot/backup | 7–11 h |
| AD-15 | Auditoría integradora de dominio | AD-10, AD-13, AD-14 | Informe verificable, plan de remediación y retest | 10–16 h |

**Carga orientativa de estas 15 etapas:** 116–180 horas, dependiente de experiencia y complejidad de los labs (intervalo sumado, no duración real validada). El proyecto final y plan definitivo se consolidan en la Tanda 4.

### 13.1. Diagnóstico para perfiles con experiencia

Proponer **prueba diagnóstica opcional** a quien ya hace Red Team/Blue Team:

- Dibujar `bosque → dominio → OU → sitio → DC` y justificar qué constituye frontera de control.
- Con un SPN y una lista de eventos, reconstruir el flujo Kerberos sin tratar el ticket como acceso confirmado.
- Deducir por qué una GPO no se aplica combinando filtros, enlace, CSE y SYSVOL.
- Dada una DACL, identificar quién puede cambiar un grupo privilegiado o modificar una plantilla.
- Con informes contradictorios de dos DC, proponer pruebas de replicación y DNS.
- Justificar una CA Tier 0, sus rutas de recuperación y riesgos de certificados de autenticación.

**Convalidación conceptual:** si supera diagnóstico + práctica nueva + evaluación de caso con evidencia, no repetir una lección dominada; la práctica de recuperación/operación **no** se convalida por conocer técnicas ofensivas.

## 14. Laboratorios propuestos (diseñados, no ejecutados)

### Reglas comunes

- Todos los nombres/usuarios/dominios son **sintéticos** y aislados; consentimiento formal para entornos ajenos.
- Topología base con `DC01`, `W11-01`; expansión con `DC02` y `CA01`. Evitar salida hacia redes domésticas, corporativas o VPN. No publicar DC, LDAP, SMB, RPC o CA en Internet.
- Registrar versión, edición, build, parche, nivel funcional, DNS, red y hora. Identificar recursos y licencias **antes** de reservar VMs; no afirmar coste cero universal.
- Baselines previos, snapshots solo como herramienta auxiliar de laboratorio, nunca como reemplazo de backup de DC; respaldos de System State cuando aplique.
- Cada práctica exige **una prueba positiva, una negativa, evidencia antes/después, y limpieza/rollback**.

| Lab | Nivel | Objetivo medible | Topología | Evidencia / aprobación | Horas est. |
|---|---|---|---|---|---|
| AD-L01 | Intro | Diseñar bosque/dominio/OU y justificar frontera de seguridad | Papel + `DC01` futuro | Diagrama + decisiones y tres anti-patrones | 2–3 |
| AD-L02 | Básico | Validar DC Locator, registros SRV y unión de W11 | DC01 + W11-01 | Consultas DNS, nltest, inicio de sesión funcional | 3–5 |
| AD-L03 | Básico | Gestionar identidades, grupos y OU sin derechos de más | DC01 + W11-01 | Inventario, grupo permitido/denegado, rollback | 3–4 |
| AD-L04 | Intermedio | Configurar GPO acotada y demostrar filtro/precedencia | DC01 + dos clientes/OU | gpresult de ambos, aplicada/no aplicada | 4–6 |
| AD-L05 | Intermedio | Explicar ticket/servicio/SPN con evidencia | DC01 + W11 + servicio prueba | klist y logs; protocolo realmente usado | 4–6 |
| AD-L06 | Intermedio | Introducir DC02, site/subnet, medir convergencia | DC01 + DC02 + W11 | repadmin, lecturas comparadas por DC, fallo sembrado | 5–8 |
| AD-L07 | Intermedio | Delegar helpdesk solo sobre OU sintética | DC01 + usuarios de prueba | Permiso positivo y negativa sobre cuenta protegida | 4–6 |
| AD-L08 | Avanzado | Revisar derechos de GPO, cuentas protegidas y Tier 0 | DC01 + cliente PAW ficticio | Grafo de permisos y plan de mínimo privilegio | 4–7 |
| AD-L09 | Avanzado | Diseñar y verificar gMSA en hosts designados | DC01 + SRV-APP | Test de host autorizado/no autorizado | 4–6 |
| AD-L10 | Avanzado | Diferenciar trust de permiso sobre recurso | Dos dominios/bosques aislados | Acceso permitido/denegado y explicación de dirección | 5–9 |
| AD-L11 | Avanzado | Auditar plantilla y CA, emisión autorizada | DC01 + CA01 + cliente | ACL/EKU/publicación, solicitud piloto, negativa | 6–10 |
| AD-L12 | Avanzado | Diagnosticar fallos DNS/GPO/replicación mezclados | DC01 + DC02 + W11 | Cronología, causa raíz, evidencia remediación | 5–8 |
| AD-L13 | Avanzado | Diseñar backup de AD DS y PKI, ensayo aislado posterior | DC01 + CA01 + almacenamiento aislado | Plan de recuperación/validación y pruebas de restauración futuras | 5–9 |
| AD-L14 | Integrador | Auditoría de postura: ACL, trust, SPN, LAPS, CA y DC | Topología ampliada | Informe + prioridades + retest propuesto | 7–11 |

**Importante:** las 13+ prácticas son un catálogo provisional de la Tanda 2; se consolidará con los laboratorios Windows (Tanda 1) y SOC/Red Team (Tanda 3), sin multiplicar artificialmente ejercicios.

## 15. Rúbrica, dependencias, seguridad y riesgos curriculares

### 15.1. Rúbrica propuesta (100 puntos por práctica)

- **20:** modelo y precondiciones (versión, nivel funcional, DNS, permisos).
- **25:** ejecución/diagnóstico reproducible y justificación del mecanismo.
- **20:** evidencia suficiente (host/DC, hora UTC, comando de consulta, resultado claro).
- **15:** control de acceso y prueba negativa (lo prohibido debe seguir prohibido).
- **10:** rollback, continuidad y ausencia de efectos colaterales.
- **10:** explicación SOC/Red Team sin confundir actividad con atribución.

Aprobación sugerida ≥80/100 **y** requisitos críticos superados: autorización, aislamiento, reversibilidad, evidencia mínima y no divulgación de claves. Una práctica que viola esas condiciones no puede considerarse superada por puntos.

### 15.2. Grafo esencial de dependencias

```text
WIN-03 + Redes(DNS) ---> AD-01 ---> AD-02 ---> AD-03 ------> AD-05 ----> AD-09
                                  |          |                |              |
WIN-06 --------------------------> AD-04 ----+---> AD-06 ---> AD-07 ----------+--> AD-13
                                                 |        |                   |
                                                 +------> AD-11 ---> AD-12 ----+
                                  AD-03 + AD-04 --> AD-08 ----> AD-10 ----------+
                                                          +--> AD-14 ---> AD-15
```

Las dependencias reales pueden ser múltiples y no necesariamente lineales; el mapa final usará desbloqueos fundamentados y rutas alternativas por diagnóstico.

### 15.3. Riesgos y preguntas pendientes antes de implementación

1. **No se probó ninguna VM ni comando** en Windows Server 2025 y Windows 11 26H2: los ejemplos son conceptuales/documentales.
2. **No se dispuso de los 155 apuntes** del documento diferente `adwin.txt`. No se hace auditoría de corpus ni se atribuyen afirmaciones a notas no vistas.
3. **Sin topología real del alumno:** CPU, RAM, almacenamiento, hipervisor y derechos de evaluación no verificados; ninguna cifra de costes está confirmada.
4. **DMSA y nuevas funciones 2025:** requieren verificación de parches/hardening específicos justo antes de una guía práctica, por su vigencia cambiante. [A18]
5. **No todos los eventos aparecen por defecto:** distinguir habilitación de auditoría, SACL, emisión real, cobertura, pérdida y retención.
6. **La guía de recuperación de bosque puede describir procedimientos históricos** aunque su cabecera marque Server 2025. Verificar aplicabilidad de cada paso contra el entorno concreto. [A35–A38]
7. **LDAP signing/CBT:** no imponer bloqueo sin inventario de aplicaciones heredadas, prueba piloto y plan de reversión. [A16]
8. **No asumir que trust forestal = frontera segura suficiente**: revisar administración cruzada, SID filtering, recursos y opciones de autenticación selectiva.
9. **AD CS:** distinguir problema de seguridad reproducible de recomendaciones genéricas, y evitar la enseñanza de bypass del mapeo fuerte basado en documentación anterior a 09/2025.
10. **Diferenciación SOC/Red Team:** solo instrumentación y superficies AD de origen ahora; explotación autorizada y análisis detallado de eventos se documentarán en Tanda 3.
11. **Alcance AD DS, no Entra:** las relaciones híbridas son referencia cruzada, no sustitución del modelo del directorio local.
12. **Un lab no es una validación:** hasta ejecutarlo con evidencia reproducible, su estado es `diseñado`.

## 16. Matriz de cobertura y aceptación de la Tanda 2

| Requisito de `adwin(1).txt` | Secciones | Estado |
|---|---|---|
| AD: DNS, sitios, replicación, FSMO, GPO | 3–5 | Investigado/diseñado, no validado en VM |
| AD: Kerberos, NTLM, LDAP, cuentas de servicio | 6 | Investigado/diseñado |
| Seguridad: delegación, ACL, privilegios, tiers, trusts | 7–9 | Investigado/diseñado |
| AD CS/PKI: arquitectura, permisos, riesgos, auditoría, hardening | 10 | Investigado/diseñado |
| Backup, recuperación y continuidad | 4, 11, 14 + referencias | Fundamentos; profundización operativa Tanda 4 |
| Red Team autorizado en AD | 7–10, 12 | Superficies; metodología/técnicas controladas Tanda 3 |
| SOC nativo en AD | 11–12 | Fuentes y límites; investigación pormenorizada Tanda 3 |
| Laboratorios seguros | 14 | Catorce diseños provisionales, no ejecutados |
| Secuencia y evaluaciones | 13–15 | 15 etapas provisionales y rúbrica; integración final Tanda 4 |

### Criterio de aceptación

**Cumplido documentalmente:** mapa conceptual AD DS, decisiones de seguridad, prerrequisitos, 15 etapas, 14 laboratorios diseñados, matriz de fuentes y riesgos pendientes. **No cumplido empíricamente:** ejecución, test de versiones/comandos, coste real, medición de resultados de los labs y auditoría de corpus personal. **Próxima tanda:** Red Team + SOC en Windows/AD, usando los conceptos aquí establecidos y la telemetría del sistema como origen, sin rehacer cursos de Sentinel o Splunk.


## 17. Fuentes primarias y trazabilidad documental

**Consulta:** 18/10/2026 · **Alta** = fuente primaria oficial que documenta el concepto, **no** prueba en laboratorio. La fecha de última edición de cada página puede variar; se deben revisar de nuevo las notas de versión al producir lecciones. Las fuentes históricas se marcan explícitamente.

| ID | Organización · documento | Qué respalda | Confianza |
|---|---|---|---|
| **A01** | Microsoft Learn · [Active Directory Domain Services overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) | AD DS service, objects and replication | Alta (documental) |
| **A02** | Microsoft Learn · [Understanding the Active Directory Logical Model](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/understanding-the-active-directory-logical-model) | Forest, domain, OU, scope of administration | Alta (documental) |
| **A03** | Microsoft Learn · [Designing the Site Topology](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/designing-the-site-topology) | Sites, subnets, site links and topology | Alta (documental) |
| **A04** | Microsoft Learn · [Locating AD Domain Controllers (DC Locator)](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/dc-locator) | DNS SRV, discovery, site-aware locator | Alta (documental) |
| **A05** | Microsoft Learn · [Site functions](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/site-functions) | Client affinity, replication, SYSVOL | Alta (documental) |
| **A06** | Microsoft Learn · [Active Directory Replication Concepts](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/replication/active-directory-replication-concepts) | KCC, sites, connection objects, global catalog | Alta (documental) |
| **A07** | Microsoft Learn · [AD DS functional levels](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-functional-levels) | Functional levels and supported DC versions | Alta (documental) |
| **A08** | Microsoft Learn · [Raise domain and forest functional levels](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/raise-domain-forest-functional-levels) | Version prerequisites, safety before raising functional level | Alta (documental) |
| **A09** | Microsoft Learn · [Troubleshooting Active Directory Replication Problems](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/troubleshoot/troubleshooting-active-directory-replication-problems) | Repadmin, replication failures and diagnostic hypotheses | Alta (documental) |
| **A10** | Microsoft Learn · [Transfer FSMO roles](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/manage-fsmo-roles) | Five operations master roles and role transfer | Alta (documental) |
| **A11** | Microsoft Learn · [Group Policy overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-overview) | Group Policy infrastructure and client side extensions | Alta (documental) |
| **A12** | Microsoft Learn · [Group Policy processing](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing) | LSDOU, enforcement, blocking, loopback and filtering | Alta (documental) |
| **A13** | Microsoft Learn · [Kerberos authentication overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-authentication-overview) | KDC, TGT, TGS, PAC, mutual authentication | Alta (documental) |
| **A14** | Microsoft Learn · [Windows Authentication Overview](https://learn.microsoft.com/en-us/windows-server/security/windows-authentication/windows-authentication-overview) | Authentication protocols including NTLM | Alta (documental) |
| **A15** | Microsoft Learn · [Kerberos Constrained Delegation Overview](https://learn.microsoft.com/en-us/windows-server/security/kerberos/kerberos-constrained-delegation-overview) | Classical constrained delegation and RBCD | Alta (documental) |
| **A16** | Microsoft Learn · [LDAP signing for AD DS](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/ldap-signing) | LDAP signing, CBT, version-sensitive audit events | Alta (documental) |
| **A17** | Microsoft Learn · [Manage group Managed Service Accounts](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-managed-service-accounts/group-managed-service-accounts/manage-group-managed-service-accounts) | gMSA, KDS root key, host restrictions | Alta (documental) |
| **A18** | Microsoft Learn · [Setting up delegated Managed Service Accounts in Server 2025](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/delegated-managed-service-accounts/delegated-managed-service-accounts-set-up-dmsa) | dMSA and migration prerequisites; optional until checked | Alta (documental) |
| **A19** | Microsoft Learn · [Active Directory Security Groups](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-groups) | Group scopes, special and privileged groups | Alta (documental) |
| **A20** | Microsoft Learn · [Migrate SYSVOL replication from FRS to DFSR](https://learn.microsoft.com/en-us/windows-server/storage/dfs-replication/migrate-sysvol-to-dfsr) | SYSVOL current replication engine and FRS legacy migration | Alta (documental) |
| **A21** | Microsoft Learn · [Tier model for Active Directory Domain Services](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/tier-model) | Tier 0/1/2 control, PAWs, dependencies | Alta (documental) |
| **A22** | Microsoft Learn · [Appendix C: Protected Accounts and Groups](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/appendix-c--protected-accounts-and-groups-in-active-directory) | AdminSDHolder, SDProp and protected groups | Alta (documental) |
| **A23** | Microsoft Learn · [Enterprise access model](https://learn.microsoft.com/en-us/security/privileged-access-workstations/privileged-access-access-model) | Cloud/hybrid extension of AD tiering | Alta (documental) |
| **A24** | Microsoft Learn · [Windows LAPS with Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-scenarios-windows-server-active-directory) | AD-backed local admin passwords, DFL requirement | Alta (documental) |
| **A25** | Microsoft Learn · [Windows LAPS architecture](https://learn.microsoft.com/en-us/windows-server/identity/laps/laps-concepts) | Encrypted secrets, DSRM and recovery dependencies | Alta (documental) |
| **A26** | Microsoft Open Specifications · [[MS-ADTS]: trustDirection](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-adts/5026a939-44ba-47b2-99cf-386a9e674b04) | Direction and semantics of trustDirection bits | Alta (documental) |
| **A27** | Microsoft Learn · [Windows Authentication Concepts](https://learn.microsoft.com/en-us/windows-server/security/windows-authentication/windows-authentication-concepts) | Trust relationships, direction and authorization | Alta (documental) |
| **A28** | Microsoft Learn · [Design a Multi-Domain or Multi-Forest Active Directory Environment](https://learn.microsoft.com/en-us/training/modules/design-multi-domain-forest-trust/) | Trust design, selective authentication and SID filtering | Alta (documental) |
| **A29** | Microsoft Learn · [Certification Authority role service](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/certification-authority-role) | Enterprise vs standalone CA | Alta (documental) |
| **A30** | Microsoft Learn · [Manage AD CS certificate templates](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/manage-certificate-templates) | Templates, ACL, enrollment and publication | Alta (documental) |
| **A31** | Microsoft Learn · [Secure, Delegate and Audit CA Administration](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/secure-delegate-audit-certification-authority) | Certificate managers, Enrollment Agents and CA audit | Alta (documental) |
| **A32** | Microsoft Learn · [Operate revocation, CRL and CDP](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/operate-certificate-revocation-crl-cdp) | CRL publication, revocation and validation | Alta (documental) |
| **A33** | Microsoft Learn · [Request and Renew AD CS Certificates](https://learn.microsoft.com/en-us/windows-server/identity/ad-cs/request-renew-certificates-certificates-mmc) | Requests, stores and actual issuance prerequisites | Alta (documental) |
| **A34** | Microsoft Support · [KB5014754: Certificate-based authentication changes](https://support.microsoft.com/en-us/servicing/os/windows-server/2022/05/kb5014754-certificate-based-authentication-changes-on-windows-domain-controllers) | Strong certificate mapping enforcement timeline to 2025-09-09 | Alta (documental) |
| **A35** | Microsoft Learn · [Forest Recovery: Back up System State](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-backing-up-system-state) | System State backups | Alta (documental) |
| **A36** | Microsoft Learn · [AD Forest Recovery: Steps to restore](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-steps-for-restoring-the-forest) | Forest recovery in isolation and redevelopment | Alta (documental) |
| **A37** | Microsoft Learn · [AD Forest Recovery: Determine how to recover](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-determine-how-to-recover) | Trusted backup selection and data loss | Alta (documental) |
| **A38** | Microsoft Learn · [Safely virtualizing Active Directory Domain Services](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/introduction-to-active-directory-domain-services-ad-ds-virtualization-level-100) | VM Generation ID safeguards and limits of snapshots | Alta (documental) |
| **A39** | Microsoft Learn · [Enable and use Active Directory Recycle Bin](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/adac/active-directory-recycle-bin) | Recovering deleted objects and prerequisites | Alta (documental) |
| **A40** | Microsoft Learn · [Devise an AD forest recovery plan](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/ad-forest-recovery-guide) | Forest recovery planning and rehearsal | Alta (documental) |
| **A41** | Microsoft Learn · [Advanced Audit Policy Configuration](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/advanced-audit-policy-configuration) | Kerberos security audit event families | Alta (documental) |
| **A42** | Microsoft Learn · [Audit Directory Service Changes](https://learn.microsoft.com/en-us/windows/security/threat-protection/auditing/audit-directory-service-changes) | Events 5136–5141, SACL and event coverage limits | Alta (documental) |
| **A43** | Microsoft Learn · [Group Policy Storage (historical document)](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/policy/group-policy-storage) | GPC and GPT architecture; FRS references are obsolete for modern SYSVOL | Alta (histórica; contrastar con A20) |

**Notas de trazabilidad:** A18 (dMSA) se clasifica como contenido de rápido cambio pendiente de reconfirmación antes de práctica; A34 tiene el calendario específico de endurecimiento de mapeo fuerte; A43 se usa solo para GPC/GPT, no como recomendación de FRS actual. Enlaces de alto impacto: [A07] compatibilidad del nivel funcional, [A21] Tier 0, [A30–A34] CA/certificados y [A35–A40] recuperación.

**Estado final:** investigación documental de Tanda 2 cerrada para revisión, no validada empíricamente. Se espera aprobación antes de convertirla en lecciones, instalar VMs o ejecutar prácticas.
