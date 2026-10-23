// Fichas de Repaso SOC: solo concepto y uso, para leer y memorizar.
// Contenido de referencia redactado a mano; las consultas son ejemplos no ejecutados.

export type BlockId = 'sentinel' | 'xdr' | 'splunk' | 'metodo';
export interface Card { id: string; bloque: BlockId; tema: string; titulo: string; concepto: string; uso: string; codigo?: string }
export interface Block { id: BlockId; titulo: string; resumen: string }

export const BLOCKS: Block[] = [
  { id: 'sentinel', titulo: 'Microsoft Sentinel', resumen: 'SIEM y SOAR: reglas, incidentes, automatización, enriquecimiento, tablas y KQL.' },
  { id: 'xdr', titulo: 'Defender XDR', resumen: 'Productos, Advanced Hunting, acciones de respuesta y correlación de incidentes.' },
  { id: 'splunk', titulo: 'Splunk', resumen: 'Arquitectura, datos, SPL y Enterprise Security.' },
  { id: 'metodo', titulo: 'Método SOC', resumen: 'Ciclo de respuesta, verdaderos y falsos positivos, escalado y MITRE ATT&CK.' },
];

const c = (bloque: BlockId, tema: string) => (id: string, titulo: string, concepto: string, uso: string, codigo?: string): Card =>
  ({ id, bloque, tema, titulo, concepto, uso, ...(codigo ? { codigo } : {}) });

const sBase = c('sentinel', 'Qué es');
const sRules = c('sentinel', 'Analytic rules');
const sInc = c('sentinel', 'Incidentes, alertas y entidades');
const sAuto = c('sentinel', 'Automatización (SOAR)');
const sEnrich = c('sentinel', 'Watchlists, UEBA, TI y conectores');
const sTables = c('sentinel', 'Tablas clave');
const sKql = c('sentinel', 'Patrones KQL');

const xBase = c('xdr', 'Productos');
const xHunt = c('xdr', 'Advanced Hunting');
const xResp = c('xdr', 'Acciones de respuesta');
const xInc = c('xdr', 'Correlación de incidentes');

const pArch = c('splunk', 'Arquitectura');
const pData = c('splunk', 'Índices, sourcetypes y CIM');
const pSpl = c('splunk', 'SPL');
const pEs = c('splunk', 'Splunk ES');

const mCycle = c('metodo', 'Ciclo de respuesta');
const mFp = c('metodo', 'Falsos positivos y escalado');
const mMitre = c('metodo', 'MITRE ATT&CK');

export const CARDS: Card[] = [
  // ── Sentinel ─────────────────────────────────────────────
  sBase('S-01', 'Microsoft Sentinel',
    'SIEM y SOAR nativo de nube. Guarda los datos en un área de trabajo de Log Analytics, detecta con reglas, agrupa alertas en incidentes y automatiza la respuesta.',
    'Se consulta con KQL. Hoy se opera también desde el portal de Defender, en la plataforma unificada de operaciones de seguridad.'),
  sBase('S-02', 'Content hub',
    'Catálogo de soluciones empaquetadas: conectores, plantillas de reglas, workbooks, hunting queries y playbooks por producto o escenario.',
    'Instalar la solución de una fuente (por ejemplo, Windows Security Events) y activar sus plantillas de reglas en lugar de escribirlas de cero.'),

  sRules('S-03', 'Scheduled rule',
    'Consulta KQL que se ejecuta con una frecuencia fija sobre una ventana de tiempo (lookback). Si el resultado supera el umbral, genera alertas.',
    'La detección personalizada típica. Se configura frecuencia, lookback, umbral, entity mapping, agrupación de alertas en incidentes y supresión.'),
  sRules('S-04', 'NRT rule',
    'Near-real-time: se ejecuta cada minuto sobre los datos recién ingeridos.',
    'Detecciones que piden reacción inmediata, como el borrado del registro de auditoría o el uso de una cuenta de emergencia. Tiene más limitaciones que una scheduled.'),
  sRules('S-05', 'Fusion',
    'Detección multietapa con machine learning: correlaciona señales de baja fidelidad de varios productos y genera un incidente de alta fidelidad.',
    'Viene habilitada por defecto. Detecta ataques en varias fases, por ejemplo un inicio de sesión anómalo seguido de una exfiltración.'),
  sRules('S-06', 'Microsoft security rules',
    'Reglas que crean incidentes automáticamente a partir de las alertas de otros productos Microsoft (Defender, Entra ID Protection…).',
    'Evitan reescribir en KQL lo que el producto ya detecta. Con Defender XDR conectado, la correlación de esas alertas la hace XDR.'),
  sRules('S-07', 'Entity mapping',
    'Asignar columnas del resultado de una regla a entidades: Account, Host, IP, URL, File, Process, Mailbox…',
    'Sin entidades no hay gráfico de investigación, ni UEBA, ni correlación entre alertas que comparten usuario o equipo.'),

  sInc('S-08', 'Evento, alerta e incidente',
    'Evento: registro crudo. Alerta: lo que genera una regla al detectar algo. Incidente: agrupación de alertas relacionadas que se investiga como un caso.',
    'El analista trabaja incidentes: asigna propietario, ajusta severidad y estado (New, Active, Closed) y clasifica al cerrar.'),
  sInc('S-09', 'Clasificación al cerrar',
    'True Positive (actividad maliciosa), Benign Positive (detección correcta de algo esperado, como un pentest autorizado), False Positive (lógica o datos incorrectos) y Undetermined.',
    'Alimenta el ajuste de las reglas: los FP indican que hay que corregir la lógica o el umbral.'),
  sInc('S-10', 'Investigación de entidades',
    'Gráfico de investigación que relaciona el incidente con sus entidades. Las entity pages muestran la línea temporal y las anomalías de un usuario, equipo o IP.',
    'Pivotar desde una entidad para ver qué más hizo y en qué otros incidentes aparece.'),

  sAuto('S-11', 'Automation rules',
    'Reglas ligeras que se ejecutan cuando se crea o actualiza un incidente o se crea una alerta. Pueden asignar, cambiar severidad o estado, etiquetar, cerrar y lanzar playbooks.',
    'Triaje automático y orquestación central, con un orden de ejecución configurable. Ejemplo: cerrar como Benign Positive las alertas de un escáner autorizado.'),
  sAuto('S-12', 'Playbooks (Logic Apps)',
    'Flujos de Azure Logic Apps con lógica compleja e integraciones: Teams, ticketing, deshabilitar un usuario, aislar un equipo o enriquecer con TI.',
    'Los lanzan las automation rules o se ejecutan manualmente. Necesitan permisos, normalmente mediante una identidad administrada.'),
  sAuto('S-13', 'Automation rule frente a playbook',
    'La automation rule decide cuándo actuar y hace acciones simples. El playbook ejecuta lo complejo.',
    'Patrón habitual: la automation rule filtra el incidente y llama al playbook que hace la respuesta.'),

  sEnrich('S-14', 'Watchlists',
    'Listas importadas (CSV) que se consultan desde KQL: VIPs, IP de confianza, activos críticos, cuentas de servicio.',
    'Enriquecer detecciones o excluir falsos positivos conocidos de forma acotada.',
    `_GetWatchlist('VIPUsers')
| project UserPrincipalName = SearchKey`),
  sEnrich('S-15', 'UEBA',
    'User and Entity Behavior Analytics: perfila el comportamiento normal de usuarios y equipos y puntúa las desviaciones.',
    'Tablas BehaviorAnalytics e IdentityInfo. Ayuda a priorizar y a detectar cuentas comprometidas o amenazas internas.'),
  sEnrich('S-16', 'Threat intelligence',
    'Indicadores (IP, dominios, URL, hashes) que llegan por conectores TAXII, Microsoft Defender Threat Intelligence o plataformas de TI.',
    'Las reglas «TI map» cruzan esos indicadores con los logs. Tabla clásica: ThreatIntelligenceIndicator (en entornos nuevos, ThreatIntelIndicators).'),
  sEnrich('S-17', 'Data connectors',
    'Conectan las fuentes: Entra ID, Defender XDR, Azure Activity, Windows (Azure Monitor Agent), Syslog y CEF (AMA en un reenviador Linux) y APIs de terceros.',
    'Sin conector no hay datos. Un primer paso del triaje es comprobar que la ingesta está sana y no hay huecos.'),
  sEnrich('S-18', 'Hunting, bookmarks y workbooks',
    'Hunting queries: búsquedas proactivas. Bookmarks: resultados guardados como evidencia. Workbooks: paneles visuales.',
    'Un bookmark se puede promover a incidente si la búsqueda encuentra algo real.'),

  sTables('S-19', 'SigninLogs',
    'Inicios de sesión interactivos de Entra ID. Columnas clave: UserPrincipalName, IPAddress, ResultType ("0" = éxito), Location, AppDisplayName, ConditionalAccessStatus.',
    'Fuerza bruta, password spraying, viaje imposible y accesos desde países inusuales. Los no interactivos están en AADNonInteractiveUserSignInLogs.'),
  sTables('S-20', 'AuditLogs',
    'Cambios en Entra ID: usuarios, grupos, roles, aplicaciones, consentimientos y métodos de autenticación.',
    'Detectar persistencia en la nube: un rol admin añadido, consentimiento a una app maliciosa o un nuevo método MFA.'),
  sTables('S-21', 'SecurityEvent',
    'Eventos de seguridad de Windows recogidos por el agente. Columnas: EventID, Account, Computer, LogonType, IpAddress.',
    'Inicios de sesión, creación de procesos y cambios en cuentas y grupos de servidores y controladores de dominio.'),
  sTables('S-22', 'Event IDs de Windows',
    '4624 inicio OK (LogonType 2 interactivo, 3 red, 10 RDP) · 4625 fallo · 4648 credenciales explícitas · 4672 privilegios especiales · 4688 proceso creado · 4698 tarea programada creada · 7045 servicio instalado · 4720 usuario creado · 4728/4732/4756 añadido a grupo · 4740 cuenta bloqueada · 4768 TGT · 4769 TGS · 4771 fallo de preautenticación Kerberos · 4776 validación NTLM · 1102 registro de auditoría borrado.',
    '4769 con cifrado 0x17 (RC4) en masa apunta a Kerberoasting. Un 1102 casi siempre merece escalado.'),
  sTables('S-23', 'Otras tablas',
    'OfficeActivity (auditoría de Exchange, SharePoint y Teams) · AzureActivity (plano de control de Azure) · CommonSecurityLog (firewalls y proxies por CEF) · Syslog (Linux) · tablas Device*, Email*, Identity* y CloudAppEvents de Defender XDR.',
    'Elegir la tabla según la pregunta: identidad, endpoint, correo, red o nube.'),

  sKql('S-24', 'Estructura de una consulta',
    'Tabla seguida de operadores encadenados con «|». Filtrar pronto por tiempo y por campos reduce coste y tiempo.',
    'Base de cualquier detección o búsqueda.',
    `SigninLogs
| where TimeGenerated > ago(1d)
| where ResultType != "0"
| summarize Fallos = count() by UserPrincipalName, IPAddress
| where Fallos > 20
| order by Fallos desc`),
  sKql('S-25', 'where, project y extend',
    'where filtra filas. project elige columnas. extend crea columnas calculadas. Comparación: == distingue mayúsculas, =~ no; has busca términos (rápido), contains subcadenas (lento); in y has_any comparan contra listas.',
    'Acotar resultados y mostrar solo lo útil.',
    `DeviceProcessEvents
| where FileName =~ "powershell.exe"
| where ProcessCommandLine has_any ("-enc", "FromBase64String")
| extend Usuario = tolower(AccountName)
| project Timestamp, DeviceName, Usuario, ProcessCommandLine`),
  sKql('S-26', 'summarize y bin',
    'summarize agrega: count(), dcount(), make_set(), arg_max(). bin() agrupa el tiempo en intervalos.',
    'Detectar volumen y patrones. Muchas cuentas distintas desde una IP sugiere password spraying.',
    `SigninLogs
| where TimeGenerated > ago(1h) and ResultType != "0"
| summarize Cuentas = dcount(UserPrincipalName), Intentos = count()
    by IPAddress, bin(TimeGenerated, 10m)
| where Cuentas > 10`),
  sKql('S-27', 'join',
    'Combina dos tablas por una columna común. kind=inner (coinciden en ambas), leftouter (todas las de la izquierda), leftanti (las de la izquierda sin pareja).',
    'Correlacionar: fallos seguidos de un éxito desde la misma IP.',
    `let fallos = SigninLogs
    | where TimeGenerated > ago(1h) and ResultType != "0"
    | summarize Fallos = count() by UserPrincipalName, IPAddress;
SigninLogs
| where TimeGenerated > ago(1h) and ResultType == "0"
| join kind=inner fallos on UserPrincipalName, IPAddress
| where Fallos > 10`),
  sKql('S-28', 'ago y filtros de tiempo',
    'ago(1h), ago(7d) son relativos a ahora. between(datetime(...) .. datetime(...)) fija un rango. En Sentinel la columna es TimeGenerated; en Advanced Hunting, Timestamp.',
    'Ajustar la ventana a la línea temporal del incidente.'),
  sKql('S-29', 'let, top, distinct y render',
    'let define variables o subconsultas. top N by ordena y limita. distinct devuelve valores únicos. take muestra filas de ejemplo. render timechart dibuja una serie temporal.',
    'Reutilizar valores (un usuario, una lista de IP) y explorar datos rápido.'),

  // ── Defender XDR ─────────────────────────────────────────
  xBase('X-01', 'Microsoft Defender XDR',
    'Une las señales de endpoint, identidad, correo y apps en la nube en un único portal (security.microsoft.com). Correlaciona alertas en incidentes y permite respuesta automática.',
    'Una sola cola de incidentes con la historia completa del ataque entre productos.'),
  xBase('X-02', 'MDE · Defender for Endpoint',
    'EDR para Windows, macOS, Linux y móviles: telemetría de procesos, red, ficheros y registro, antivirus, reglas ASR y aislamiento.',
    'Tablas DeviceProcessEvents, DeviceNetworkEvents, DeviceFileEvents, DeviceRegistryEvents, DeviceLogonEvents y DeviceEvents.'),
  xBase('X-03', 'MDI · Defender for Identity',
    'Sensores en los controladores de dominio (y AD FS, AD CS, Entra Connect) que detectan ataques contra Active Directory.',
    'Pass-the-Hash, Pass-the-Ticket, Kerberoasting, DCSync, Golden Ticket y reconocimiento LDAP. Tablas IdentityLogonEvents, IdentityQueryEvents e IdentityDirectoryEvents.'),
  xBase('X-04', 'MDO · Defender for Office 365',
    'Protección de correo y colaboración: antiphishing, antimalware, Safe Links, Safe Attachments y ZAP (borrado automático tras la entrega). Threat Explorer para investigar campañas.',
    'Tablas EmailEvents, EmailAttachmentInfo, EmailUrlInfo, UrlClickEvents y EmailPostDeliveryEvents.'),
  xBase('X-05', 'MDCA · Defender for Cloud Apps',
    'CASB: descubre shadow IT, controla sesiones y detecta actividad anómala en SaaS, como descargas masivas, viaje imposible o reglas de reenvío sospechosas.',
    'Tabla CloudAppEvents. Útil para M365, apps OAuth y exfiltración en la nube.'),
  xBase('X-06', 'Entra ID Protection',
    'Calcula el riesgo del usuario y del inicio de sesión: credenciales filtradas, IP anónimas, viaje atípico, password spraying.',
    'Se combina con acceso condicional basado en riesgo: exigir MFA o cambio de contraseña, o bloquear.'),

  xHunt('X-07', 'Advanced Hunting',
    'Búsqueda con KQL sobre los datos crudos de Defender XDR (30 días) en el portal. Si Sentinel está integrado, también ve sus tablas.',
    'Hunting proactivo e investigación de un incidente: qué más hizo ese proceso, usuario o IP.',
    `DeviceNetworkEvents
| where Timestamp > ago(7d)
| where RemoteIP == "203.0.113.10"
| summarize Conexiones = count() by DeviceName, InitiatingProcessFileName`),
  xHunt('X-08', 'Custom detection rules',
    'Convierten una consulta de Advanced Hunting en una detección programada que genera alertas y puede lanzar acciones automáticas (aislar, recoger paquete, poner en cuarentena).',
    'La consulta debe devolver Timestamp y una columna de entidad, como DeviceId o ReportId.'),
  xHunt('X-09', 'AlertInfo y AlertEvidence',
    'AlertInfo: metadatos de cada alerta (título, severidad, categoría, producto). AlertEvidence: entidades implicadas (equipos, usuarios, ficheros, IP).',
    'Buscar todas las alertas que tocaron un mismo equipo o usuario.'),

  xResp('X-10', 'Acciones sobre el dispositivo',
    'Aislar (completo o selectivo; mantiene la conexión con Defender), restringir la ejecución de apps, lanzar un análisis antivirus y recoger el paquete de investigación.',
    'Aislar corta el movimiento lateral y la exfiltración sin apagar el equipo, así no se pierde la evidencia en memoria.'),
  xResp('X-11', 'Live response',
    'Shell remota sobre el equipo: listar procesos y conexiones, descargar ficheros (getfile), analizar y ejecutar scripts aprobados.',
    'Recoger evidencia o remediar sin acceso físico. Requiere permisos específicos.'),
  xResp('X-12', 'Acciones sobre ficheros e indicadores',
    'Detener y poner en cuarentena un fichero en todos los equipos. Crear indicadores (allow, block o alert) de hash, IP, URL o certificado.',
    'Bloquear un malware o un dominio C2 en toda la flota.'),
  xResp('X-13', 'Acciones sobre usuario y correo',
    'Usuario: deshabilitar en AD (MDI), forzar cambio de contraseña, revocar sesiones o marcar como comprometido en Entra. Correo: borrado suave o duro, mover a no deseado, purgar una campaña desde Threat Explorer.',
    'Contener una cuenta comprometida o retirar un phishing de todos los buzones.'),
  xResp('X-14', 'AIR y Action center',
    'Automated Investigation and Response: investiga alertas automáticamente y propone o aplica remediaciones según el nivel de automatización.',
    'El Action center centraliza las acciones pendientes y realizadas, con aprobación y opción de deshacer.'),

  xInc('X-15', 'Correlación de alertas en un incidente',
    'XDR agrupa en un incidente las alertas de distintos productos que comparten entidades (usuario, equipo, buzón, IP) en una ventana de tiempo, y muestra la historia del ataque.',
    'Ejemplo: phishing (MDO), ejecución del adjunto (MDE), uso de credenciales robadas (MDI) y descarga masiva (MDCA) quedan en un solo incidente.'),
  xInc('X-16', 'Sentinel junto a XDR',
    'El conector de Defender XDR sincroniza incidentes en ambos sentidos. En el portal unificado comparten la cola de incidentes y Advanced Hunting.',
    'Investigar en un único sitio con datos de Microsoft y de terceros.'),

  // ── Splunk ───────────────────────────────────────────────
  pArch('P-01', 'Universal Forwarder',
    'Agente ligero que recoge y envía datos a los indexers casi sin procesarlos (puerto 9997 por convención).',
    'Instalado en servidores y endpoints para enviar logs.'),
  pArch('P-02', 'Heavy Forwarder',
    'Instancia completa de Splunk que puede parsear, filtrar, enmascarar y enrutar datos antes de indexarlos.',
    'Recoger de APIs con add-ons, filtrar ruido o anonimizar antes de enviar.'),
  pArch('P-03', 'Indexer',
    'Recibe, parsea, indexa y almacena los datos en buckets (hot, warm, cold y frozen) y responde a las búsquedas.',
    'En un clúster replica los datos (replication factor y search factor) para no perderlos.'),
  pArch('P-04', 'Search Head',
    'Interfaz donde se busca: reparte la búsqueda entre los indexers y combina los resultados. Las apps como ES viven aquí.',
    'En un clúster de search heads se reparte la carga de usuarios y búsquedas.'),
  pArch('P-05', 'Deployment server y cluster manager',
    'El deployment server distribuye configuración y apps a los forwarders. El cluster manager gestiona el clúster de indexers.',
    'Administrar cientos de forwarders e indexers de forma centralizada.'),

  pData('P-06', 'Índice',
    'Repositorio lógico de datos (por ejemplo wineventlog, firewall o proxy) con su propia retención y permisos.',
    'Poner siempre index= al buscar: es el filtro que más rendimiento da.'),
  pData('P-07', 'Sourcetype, source y host',
    'Sourcetype: formato de los datos, que decide el parseo y la extracción de campos. Source: fichero o entrada de origen. Host: equipo que generó el evento. También existen _time y _raw.',
    'Filtrar y entender de dónde viene cada evento.'),
  pData('P-08', 'CIM',
    'Common Information Model: normaliza los nombres de campos (src, dest, user, action) en data models como Authentication, Network_Traffic, Endpoint, Web o Email.',
    'Una misma búsqueda sirve para cualquier fabricante. Es la base de Splunk ES.'),
  pData('P-09', 'Data models acelerados',
    'Resúmenes precalculados (tsidx) de un data model que permiten buscar muy rápido sobre grandes volúmenes.',
    'Se consultan con tstats. Las detecciones de ES dependen de ellos.'),

  pSpl('P-10', 'Estructura de una búsqueda',
    'Filtro inicial (index, sourcetype, términos y rango de tiempo) seguido de comandos encadenados con «|».',
    'Filtrar todo lo posible antes del primer «|».',
    `index=wineventlog EventCode=4625
| stats count by user, src
| where count > 20
| sort - count`),
  pSpl('P-11', 'stats',
    'Agrega: count, dc (distinct count), values, min, max, earliest, latest… by campo.',
    'Volumen y patrones. Muchas cuentas distintas desde una IP sugiere password spraying.',
    `index=wineventlog EventCode=4625
| stats count dc(user) as usuarios values(user) as cuentas by src
| where usuarios > 10`),
  pSpl('P-12', 'eval',
    'Crea o transforma campos con funciones: if, case, in, lower, len, strftime, round…',
    'Clasificar, normalizar o calcular campos durante la búsqueda.',
    `| eval privilegiada=if(in(user, "administrator", "svc_backup"), "sí", "no")`),
  pSpl('P-13', 'rex',
    'Extrae campos de un texto con expresiones regulares y grupos con nombre.',
    'Sacar un dato que no viene extraído, como un usuario o un dominio dentro de _raw.',
    `| rex field=_raw "user=(?<usuario>\\S+)"`),
  pSpl('P-14', 'timechart',
    'Serie temporal agregada por intervalos (span) y, opcionalmente, por un campo.',
    'Ver picos: una ráfaga de fallos o un aumento de tráfico saliente.',
    `index=firewall | timechart span=5m count by action`),
  pSpl('P-15', 'dedup, table, sort y rename',
    'dedup elimina duplicados por campo. table elige columnas. sort ordena («-» descendente). rename cambia nombres de campos.',
    'Dejar el resultado limpio para leer o exportar.'),
  pSpl('P-16', 'tstats',
    'Busca sobre índices tsidx y data models acelerados en lugar de los eventos crudos. Mucho más rápido que una búsqueda normal.',
    'Detecciones y búsquedas sobre grandes volúmenes con CIM.',
    `| tstats count from datamodel=Authentication
    where Authentication.action=failure
    by Authentication.src, Authentication.user`),
  pSpl('P-17', 'lookup, inputlookup y transaction',
    'lookup enriquece eventos con una tabla (activos, VIPs, IoC). inputlookup lee la tabla entera. transaction agrupa eventos relacionados en uno (lento; mejor stats cuando se pueda).',
    'Enriquecer con contexto y reconstruir sesiones.'),

  pEs('P-18', 'Splunk Enterprise Security',
    'SIEM premium sobre Splunk: correlation searches, notables, Incident Review, risk-based alerting y frameworks de activos, identidades y threat intelligence.',
    'El SOC triaja desde Incident Review.'),
  pEs('P-19', 'Correlation search',
    'Búsqueda programada que detecta un patrón y genera un notable o una entrada de riesgo. En ES 8 se llaman detections.',
    'Equivale a una scheduled rule de Sentinel.'),
  pEs('P-20', 'Notable event',
    'Alerta de ES que se triaja en Incident Review con propietario, estado y urgencia. En ES 8 se llaman findings.',
    'Equivale a una alerta o incidente de Sentinel.'),
  pEs('P-21', 'Urgencia y activos e identidades',
    'La urgencia combina la severidad de la detección con la prioridad del activo o la identidad afectada (asset and identity framework).',
    'La misma alerta es más urgente sobre un controlador de dominio o un VIP.'),
  pEs('P-22', 'Risk-Based Alerting (RBA)',
    'Las detecciones suman puntuación de riesgo a usuarios y sistemas en el índice risk en lugar de crear notables. Cuando el riesgo acumulado o el número de tácticas MITRE supera un umbral, una risk incident rule crea el notable.',
    'Reduce mucho el ruido y detecta ataques lentos formados por señales débiles.'),
  pEs('P-23', 'Adaptive response y Splunk SOAR',
    'Acciones al disparar una detección: crear notable, añadir riesgo, enviar correo o ejecutar un script. Splunk SOAR orquesta playbooks de respuesta.',
    'Equivalen a las automation rules y los playbooks de Sentinel.'),

  // ── Método SOC ───────────────────────────────────────────
  mCycle('M-01', 'Ciclo de respuesta (NIST SP 800-61)',
    'Preparación · detección y análisis · contención, erradicación y recuperación · actividades posteriores al incidente (lecciones aprendidas). La revisión r3 (2025) lo alinea con NIST CSF 2.0.',
    'Marco de referencia para estructurar cualquier respuesta.'),
  mCycle('M-02', 'Triaje en cinco pasos',
    'Validar si la alerta es real · alcance (quién, qué, desde cuándo, cuántos) · contener · erradicar y recuperar · documentar y escalar.',
    'Orden fijo para cualquier alerta, sea de Sentinel, XDR o Splunk.'),
  mCycle('M-03', 'Validar',
    'Revisar la lógica de la regla, la evidencia cruda, la salud de la ingesta, el contexto del usuario o activo, el historial (¿ha pasado antes?) y la threat intelligence.',
    'Separar ruido de amenaza antes de actuar.'),
  mCycle('M-04', 'Alcance',
    'Pivotar por entidades: usuario → otros equipos; IP → otras cuentas; hash → otros equipos; remitente → otros buzones. Construir la línea temporal.',
    'Saber cuánto afecta antes de contener, para no dejar nada fuera.'),
  mCycle('M-05', 'Contener',
    'Aislar el equipo, deshabilitar la cuenta, revocar sesiones o bloquear indicadores. Preservar la evidencia antes de borrar y actuar con la autorización del playbook.',
    'Parar el daño sin destruir pruebas.'),
  mCycle('M-06', 'Erradicar y recuperar',
    'Eliminar persistencia y malware, restablecer credenciales, parchear, restaurar desde una copia limpia y vigilar la reincidencia.',
    'Cerrar el incidente sin dejar al atacante dentro.'),
  mCycle('M-07', 'Documentar',
    'Línea temporal, evidencias, IoC, acciones realizadas y quién las autorizó.',
    'Necesario para el traspaso de turno, el escalado y las lecciones aprendidas.'),
  mCycle('M-08', 'Niveles SOC',
    'L1: triaje y escalado. L2: investigación profunda y contención. L3: hunting, ingeniería de detección, forense y respuesta a incidentes.',
    'Saber qué se espera en cada nivel y cuándo pasar el caso.'),

  mFp('M-09', 'TP, FP, BP y FN',
    'True Positive: amenaza real. False Positive: la detección se equivocó. Benign Positive: detección correcta de actividad legítima. False Negative: ataque no detectado, el peor caso.',
    'Clasificar bien cada cierre para mejorar las reglas.'),
  mFp('M-10', 'Reducir falsos positivos',
    'Ajustar umbrales, añadir contexto (activos, VIPs, horario), excluir con listas acotadas y documentadas, y medir la tasa de FP por regla.',
    'Nunca silenciar una regla entera ni excluir sin dejar constancia.'),
  mFp('M-11', 'Criterios de escalado',
    'Cuenta privilegiada o VIP · activo crítico · éxito tras un ataque (login correcto, ejecución) · movimiento lateral · exfiltración · ransomware · varios equipos o usuarios · datos regulados.',
    'Ante la duda, escalar con la evidencia recogida.'),
  mFp('M-12', 'Severidad y prioridad',
    'Severidad: gravedad técnica de la detección. Prioridad: severidad combinada con la criticidad del activo y la confianza en la alerta.',
    'Atender primero lo más prioritario, no solo lo más severo.'),
  mFp('M-13', 'IoC e IoA',
    'IoC (indicador de compromiso): artefacto de algo que ya ocurrió (hash, IP, dominio). IoA (indicador de ataque): comportamiento en curso (técnica, secuencia de acciones).',
    'Los IoC caducan rápido. Detectar comportamiento (IoA) es más robusto.'),

  mMitre('M-14', 'MITRE ATT&CK',
    'Base de conocimiento de tácticas (el porqué), técnicas (el cómo) y subtécnicas de adversarios reales, identificadas como Txxxx.xxx.',
    'Mapear detecciones, medir cobertura y describir incidentes en un lenguaje común.'),
  mMitre('M-15', 'Las 14 tácticas (Enterprise)',
    'Reconnaissance · Resource Development · Initial Access · Execution · Persistence · Privilege Escalation · Defense Evasion · Credential Access · Discovery · Lateral Movement · Collection · Command and Control · Exfiltration · Impact.',
    'Situar en qué fase está el ataque.'),
  mMitre('M-16', 'T1566 · Phishing',
    'Acceso inicial por correo: .001 adjunto malicioso, .002 enlace malicioso.',
    'EmailEvents, UrlClickEvents y el proceso hijo de Outlook o Office en DeviceProcessEvents.'),
  mMitre('M-17', 'T1078 · Valid Accounts',
    'Uso de credenciales legítimas robadas para entrar y moverse.',
    'Inicios de sesión anómalos: país, horario, dispositivo o viaje imposible (SigninLogs, 4624).'),
  mMitre('M-18', 'T1110 · Brute Force',
    '.001 adivinación de contraseñas, .003 password spraying (pocas contraseñas contra muchas cuentas), .004 credential stuffing.',
    'Muchos 4625 o fallos en SigninLogs, sobre todo si después hay un éxito.'),
  mMitre('M-19', 'T1059.001 · PowerShell',
    'Ejecución de comandos y scripts con PowerShell, a menudo codificados u ofuscados.',
    'Línea de comandos con -enc, IEX o DownloadString (DeviceProcessEvents, 4688, Script Block Logging 4104).'),
  mMitre('M-20', 'T1053.005 · Scheduled Task',
    'Persistencia o ejecución mediante tareas programadas.',
    'Evento 4698 y schtasks.exe /create en la creación de procesos.'),
  mMitre('M-21', 'T1547.001 · Registry Run Keys',
    'Persistencia en las claves Run/RunOnce del registro o en la carpeta de inicio.',
    'DeviceRegistryEvents sobre ...\\CurrentVersion\\Run.'),
  mMitre('M-22', 'T1003.001 · LSASS Memory',
    'Robo de credenciales volcando la memoria de lsass.exe (Mimikatz, procdump, comsvcs.dll).',
    'Accesos a lsass.exe desde procesos inusuales. MDE lo alerta.'),
  mMitre('M-23', 'T1558.003 · Kerberoasting',
    'Pedir tickets de servicio (TGS) de cuentas con SPN para crackear su contraseña sin conexión.',
    'Muchos 4769 con cifrado RC4 (0x17) desde una cuenta. MDI lo detecta.'),
  mMitre('M-24', 'T1550.002 · Pass the Hash',
    'Autenticarse con el hash NTLM sin conocer la contraseña.',
    '4624 con LogonType 3 y NTLM desde un equipo hacia muchos servidores. MDI lo detecta.'),
  mMitre('M-25', 'T1021 · Remote Services',
    '.001 RDP y .002 SMB/recursos administrativos (C$, ADMIN$) para el movimiento lateral.',
    '4624 LogonType 10 (RDP) o 3 (red), PsExec y servicios remotos (7045).'),
  mMitre('M-26', 'T1562.001 · Disable or Modify Tools',
    'Desactivar el antivirus, el EDR o el registro para evadir la defensa.',
    'Cambios en Defender (exclusiones, protección en tiempo real desactivada) o servicios de seguridad detenidos.'),
  mMitre('M-27', 'T1070.001 · Clear Windows Event Logs',
    'Borrar registros para ocultar el rastro.',
    'Evento 1102 (Security) o 104 (System) y wevtutil cl.'),
  mMitre('M-28', 'T1071.004 · DNS y T1048 · Exfiltración',
    'C2 por DNS (tunneling) y exfiltración por un protocolo alternativo.',
    'Consultas DNS largas y de alta entropía, muchos subdominios únicos y volumen saliente anómalo.'),
  mMitre('M-29', 'T1114.003 · Email Forwarding Rule',
    'Regla de reenvío en el buzón para recibir el correo de la víctima.',
    'New-InboxRule o Set-Mailbox con ForwardingSmtpAddress en OfficeActivity o CloudAppEvents.'),
  mMitre('M-30', 'T1486 y T1490 · Ransomware',
    'T1486: cifrar datos para extorsionar. T1490: impedir la recuperación (borrar shadow copies o copias de seguridad).',
    'vssadmin delete shadows, wbadmin, bcdedit y renombrado masivo de ficheros.'),
];
