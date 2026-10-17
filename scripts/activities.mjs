// Educational adaptations reviewed against the local Markdown, never against external sources.
// Evidence strings are checked verbatim at preparation time. Do not weaken that check.
const choice = (id, phase, prompt, options, correct, explanation, evidence, extra = {}) => ({
  id, phase, type: 'choice', prompt, options: options.map(([id, text, why]) => ({ id, text, why })), solution: [correct], explanation, evidence, ...extra,
});
const tf = (id, phase, prompt, correct, explanation, evidence) => choice(id, phase, prompt,
  [['true', 'Verdadero', explanation], ['false', 'Falso', explanation]], String(correct), explanation, evidence, { type: 'true-false' });
const match = (id, phase, prompt, pairs, explanation, evidence) => ({ id, phase, type: 'match', prompt,
  rows: pairs.map(([id, label]) => ({ id, label })), options: pairs.map(([id, , text]) => ({ id, text })),
  solution: pairs.map(([id]) => id), explanation, evidence });

export const pilots = [
  {
    lessonId: 'capitulo-1-licencia-y-onboarding/1-licencia-y-onboarding-1', pilot: true,
    introduction: 'Una licencia habilita capacidades; incorporar un recurso es otro paso. Distinguirlos ayuda a no confundir el derecho de uso con una conexión técnica que todavía falta.',
    goals: ['Distinguir licenciamiento de onboarding.', 'Reconocer que no todos los servicios requieren incorporación ni licencia premium.', 'Separar cambios de licencia de la retención del workspace.'],
    notes: [{ quote: '`Licenciamiento`: derecho de uso', text: 'Piensa en dos preguntas distintas: ¿está habilitada la capacidad? y ¿se ha realizado la incorporación técnica cuando corresponde? Una licencia no conecta ni ingiere los datos.' }],
    summary: ['Licenciamiento habilita capacidades; no conecta ni ingiere datos.', 'El onboarding es técnico y solo aplica donde existe ese paso.', 'Los datos ya ingeridos en un workspace conservan su propia retención.'],
    questions: [
      choice('licencia-no-ingesta', 'practice', '¿Qué describe el licenciamiento en estos apuntes?', [
        ['use', 'El derecho de uso que habilita capacidades.', 'La definición habla de habilitar capacidades y del nivel cubierto.'],
        ['connect', 'La conexión técnica de cada dispositivo.', 'Esa incorporación corresponde al onboarding cuando aplica. Una licencia no conecta datos.'],
        ['ingest', 'La ingesta automática de todos los datos.', 'El documento dice expresamente que el licenciamiento no conecta ni ingiere datos.'],
      ], 'use', 'Licenciamiento y onboarding responden a preguntas diferentes. Habilitar una capacidad no realiza la incorporación técnica.', ['`Licenciamiento`: derecho de uso que habilita capacidades y determina qué nivel del producto está cubierto. No conecta ni ingiere datos.']),
      tf('licencia-premium', 'practice', 'Todas las funciones citadas exigen una licencia premium.', false,
        'El texto ofrece excepciones: funciones básicas de Entra Free, Audit Standard en suscripciones compatibles y Defender Antivirus como parte de Windows. No equivale a decir que todos sus productos sean gratuitos.', ['No todo exige una licencia premium: Entra Free conserva funciones básicas, Purview Audit Standard se incluye en suscripciones compatibles y Microsoft Defender Antivirus forma parte de Windows.']),
      choice('incorporacion-cuando-aplica', 'assessment', '¿Qué afirmación respeta el alcance del onboarding?', [
        ['all', 'Todos los servicios cloud requieren siempre el mismo onboarding.', 'El texto limita la incorporación a donde existe ese paso; no todos los servicios cloud lo necesitan.'],
        ['scope', 'Solo aplica donde existe ese paso; Entra ID y la protección base de correo generan datos nativamente.', 'Conserva la condición y las excepciones explícitas del documento.'],
        ['none', 'MDE y Sentinel nunca requieren incorporación.', 'Ambos figuran entre los productos que sí requieren activación o incorporación.'],
      ], 'scope', 'No generalices el onboarding a toda la nube ni lo omitas para los productos que sí lo requieren.', ['Solo aplica donde existe ese paso: servicios cloud como Entra ID y la protección base de correo generan datos nativamente, mientras que MDE, los sensores de MDI, Endpoint DLP, los planes de Defender for Cloud y Sentinel sí requieren activación o incorporación.']),
      choice('licencia-retencion', 'assessment', 'Según los apuntes, tras un cambio de licencia, ¿qué regla siguen los datos ya ingeridos en un Log Analytics workspace?', [
        ['own', 'Siguen su propia retención.', 'Es la afirmación explícita del documento sobre los datos ya ingeridos.'],
        ['delete', 'Se borran inmediatamente por el cambio de licencia.', 'El texto no establece ese borrado inmediato; distingue la retención del workspace.'],
        ['forever', 'Se conservan para siempre.', 'Tener una retención propia no significa conservación ilimitada.'],
      ], 'own', 'La retención de lo ya ingerido es distinta de la disponibilidad de capacidades. El párrafo también contiene una inferencia sobre telemetría futura, que no se utiliza aquí como hecho evaluable.', ['Los datos ya ingeridos en un Log Analytics workspace siguen su propia retención;']),
    ],
  },
  {
    lessonId: 'capitulo-2-permisos-y-rbac/1-modelos-y-scopes-1', pilot: true,
    introduction: 'El control de acceso cambia según la superficie. Antes de elegir un rol, identifica qué recurso o experiencia quieres administrar y qué alcance necesita la tarea.',
    goals: ['Relacionar modelos RBAC y superficies.', 'Reconocer permisos acumulativos.', 'Aplicar mínimo privilegio sin asumir que un scope estrecho anula otro amplio.'],
    notes: [{ quote: 'Los permisos son acumulativos.', text: 'Un alcance estrecho en una asignación no cancela automáticamente un permiso amplio recibido por otra vía. Revisa las asignaciones que se acumulan.' }],
    summary: ['No existe un único RBAC para toda la plataforma.', 'Azure RBAC, Unified RBAC y los role groups de Purview/correo gobiernan ámbitos distintos.', 'Los permisos se acumulan: parte de mínimo privilegio y del scope más pequeño que permita la tarea.'],
    questions: [
      match('rbac-superficies', 'practice', 'Relaciona cada modelo con su ámbito descrito.', [
        ['unified', 'Unified RBAC', 'Experiencias y acciones en security.microsoft.com con sus scopes.'],
        ['azure', 'Azure RBAC', 'Sentinel SIEM, workspace y recursos Azure como DCR, workbooks y Logic Apps.'],
        ['entra', 'Entra ID RBAC / roles del Data Lake', 'Acceso amplio al Tenant Data Lake y operaciones de incorporación del tenant.'],
      ], 'El modelo se elige por la superficie y el recurso; no hay un único RBAC común a todo.', ['No existe un único RBAC para toda la plataforma:', 'Experiencias y acciones dentro de `security.microsoft.com`', 'Microsoft Sentinel SIEM, el `Log Analytics workspace` y recursos de Azure', 'Acceso amplio al Tenant Data Lake y operaciones de incorporación que afectan al tenant']),
      tf('rbac-acumula', 'practice', 'Una asignación estrecha cancela siempre los permisos amplios recibidos por otra asignación.', false,
        'Los permisos son acumulativos. Una asignación amplia de Azure o Entra puede imponerse al alcance estrecho de otra; hay que revisar el conjunto.', ['Los permisos son acumulativos. Una asignación amplia de Azure o Entra puede imponerse al alcance más estrecho de otra asignación;']),
      choice('rbac-dcr', 'assessment', 'Situación didáctica: debes administrar una DCR de Azure. ¿Qué modelo incluye ese recurso en la tabla?', [
        ['azure', 'Azure RBAC.', 'La fila de Azure RBAC incluye expresamente las DCR.'],
        ['unified', 'Exclusivamente Unified RBAC.', 'Esa fila se refiere a experiencias y acciones del portal; no sustituye el ámbito Azure de la DCR.'],
        ['purview', 'Exclusivamente los role groups de Purview.', 'La fila de Purview y correo enumera otras funciones, no la administración de la DCR.'],
      ], 'azure', 'La tabla coloca DCR, workspace, workbooks y Logic Apps dentro del ámbito de Azure RBAC. No se está afirmando un rol concreto ni permisos adicionales.', ['Microsoft Sentinel SIEM, el `Log Analytics workspace` y recursos de Azure como `Data Collection Rule (DCR)`, workbooks y Logic Apps'], { didactic: true }),
      choice('rbac-minimo', 'assessment', '¿Qué criterio de diseño propone el texto al combinar asignaciones?', [
        ['broad', 'Empezar siempre con alcance de tenant y no revisar otras asignaciones.', 'Contradice mínimo privilegio y omite que las asignaciones amplias se acumulan.'],
        ['small', 'Mínimo privilegio y el scope más pequeño que permita la tarea.', 'Conserva tanto el mínimo privilegio como la condición de que la tarea pueda realizarse.'],
        ['smallest', 'El scope más pequeño posible aunque impida realizar la tarea.', 'El texto añade una condición: el scope debe permitir la tarea.'],
      ], 'small', 'El alcance mínimo es funcional, no meramente pequeño. También hay que comprobar las otras asignaciones acumuladas.', ['por eso el diseño parte de mínimo privilegio y del scope más pequeño que permita la tarea.']),
    ],
  },
  {
    lessonId: 'capitulo-4-ingesta/tabla-1', pilot: true,
    introduction: 'Ingerir un formato propio exige coordinar tabla, esquema y DCR. El recorrido termina comprobando filas reales con el esquema esperado, no solo creando recursos.',
    goals: ['Reconocer el procedimiento de tablas personalizadas.', 'Distinguir tabla, esquema, DCR y outputStream.', 'Detectar el error de cambiar el esquema sin revisar la DCR.'],
    notes: [{ quote: 'Modificar el esquema de la tabla no actualiza automáticamente', text: 'La tabla y la DCR deben seguir encajando. Cambiar una no actualiza automáticamente la otra; revisa ambas y valida el resultado.' }],
    summary: ['Las tablas personalizadas terminan en _CL y el esquema asegura TimeGenerated.', 'La DCR describe entrada, transformación necesaria y destino; outputStream debe coincidir con la tabla.', 'Tras cambios, revisa tabla y DCR juntas y valida filas con el esquema esperado.'],
    questions: [
      { id: 'tabla-procedimiento', phase: 'practice', type: 'order', prompt: 'Reconstruye el procedimiento tal como aparece en el documento. Usa las flechas para mover cada paso.',
        options: [
          { id: 'create', text: 'Crear la tabla en el workspace, con nombre terminado en _CL.' },
          { id: 'schema', text: 'Definir el esquema y asegurar TimeGenerated.' },
          { id: 'dcr', text: 'Crear o seleccionar la DCR para entrada, transformación necesaria y destino.' },
          { id: 'stream', text: 'Hacer coincidir outputStream con la tabla.' },
          { id: 'authorize', text: 'Asociar la DCR al recurso o autorizar la aplicación emisora.' },
          { id: 'validate', text: 'Validar filas con el esquema esperado.' },
        ], solution: ['create', 'schema', 'dcr', 'stream', 'authorize', 'validate'],
        explanation: 'Esta actividad reproduce el orden de los seis pasos de los apuntes. Crear recursos no basta: la validación de filas es el último paso del procedimiento descrito.',
        evidence: ['1. Crear la tabla en el `Log Analytics workspace`; su nombre termina en `_CL`.\n2. Definir el esquema y asegurar la columna `TimeGenerated`.\n3. Crear o seleccionar una `DCR` que describa el flujo de entrada, la transformación necesaria y el destino.\n4. Hacer coincidir el `outputStream` con la tabla.\n5. Asociar la `DCR` con el recurso o autorizar la aplicación que envía los datos.\n6. Validar que la tabla recibe filas con el esquema esperado.'] },
      choice('tabla-tiempo', 'practice', '¿Qué columna debe asegurarse al definir el esquema en este procedimiento?', [
        ['tg', 'TimeGenerated.', 'Es la columna indicada en el segundo paso.'],
        ['ts', 'Timestamp como sustituto obligatorio de TimeGenerated.', 'El procedimiento pide TimeGenerated; no indica esa sustitución.'],
        ['none', 'Ninguna columna temporal.', 'El paso segundo exige asegurar TimeGenerated.'],
      ], 'tg', 'La respuesta se refiere a este procedimiento del workspace; no se generaliza a las tablas nativas de Defender.', ['2. Definir el esquema y asegurar la columna `TimeGenerated`.']),
      tf('tabla-cambio-esquema', 'assessment', 'Cambiar el esquema de la tabla actualiza automáticamente las DCR que escriben en ella.', false,
        'El último párrafo niega esa actualización automática. Deben revisarse tabla y DCR juntas para mantener la coincidencia de esquemas.', ['Modificar el esquema de la tabla no actualiza automáticamente las `DCR` que escriben en ella: ambas partes deben revisarse juntas.']),
      choice('tabla-transformacion', 'assessment', 'Situación didáctica: una transformación de la DCR adapta registros antes de almacenarlos. ¿Qué debe cumplir su salida?', [
        ['match', 'Coincidir con el esquema de la tabla.', 'Es la condición explícita para la salida de la transformación.'],
        ['any', 'Usar cualquier esquema, porque la tabla se adapta siempre automáticamente.', 'La adaptación automática afirmada no está en el texto; se exige coincidencia.'],
        ['ignore', 'Omitir la validación de las filas.', 'El procedimiento termina validando que llegan filas con el esquema esperado.'],
      ], 'match', 'Transformar no elimina el contrato con el esquema de destino. Mantén esa condición y comprueba los registros resultantes.', ['Una transformación de la `DCR` puede filtrar o adaptar cada registro antes de almacenarlo; su salida debe coincidir con el esquema de la tabla.'], { didactic: true }),
    ],
  },
];

export const enrichment = [
  {
    lessonId: 'capitulo-6-threat-intelligence/6-threat-intelligence-1',
    introduction: 'La inteligencia aporta contexto; un indicador aislado no es una detección. Distinguir formato, transporte y vigencia evita confundir objetos de inteligencia con resultados de análisis.',
    goals: ['Distinguir STIX de TAXII.', 'Interpretar la vigencia de un indicador.', 'Localizar indicadores y otros objetos en sus tablas.'],
    summary: ['STIX describe objetos y relaciones; TAXII transporta colecciones de objetos STIX.', 'Un indicador no es una detección.', 'ValidUntil limita la validez; la permanencia del registro depende de la retención.'],
    questions: [
      match('ti-formato-transporte', 'practice', 'Relaciona formato y protocolo.', [['stix', 'STIX', 'Formato que describe objetos y relaciones.'], ['taxii', 'TAXII', 'Protocolo para transportar colecciones de objetos STIX.']],
        'STIX describe qué se intercambia y TAXII cómo se transportan las colecciones: son funciones distintas.', ['Structured Threat Information eXpression (`STIX`) es el formato que describe los objetos y sus relaciones.', 'Trusted Automated eXchange of Indicator Information (`TAXII`) es el protocolo utilizado para transportar colecciones de objetos `STIX`.']),
      tf('ti-no-deteccion', 'practice', 'Un indicador equivale por sí mismo a una detección.', false, 'El documento distingue el indicador de la detección: los IoC se cruzan con telemetría para encontrar coincidencias.', ['Un indicador no es una detección.']),
      choice('ti-expiracion', 'assessment', 'Al alcanzar ValidUntil, ¿qué ocurre según el texto?', [
        ['valid', 'Deja de considerarse válido; sus registros permanecen según la retención.', 'Distingue validez del indicador y retención del registro.'],
        ['erase', 'Se borran inmediatamente todos sus registros.', 'El texto conserva los registros según la retención; no impone ese borrado inmediato.'],
        ['forever', 'Sigue siendo válido indefinidamente.', 'ValidUntil marca el fin de su validez.'],
      ], 'valid', 'Expirar no equivale a desaparecer de todas las tablas. No elimines la condición de retención.', ['Al alcanzar `ValidUntil`, deja de considerarse válido, aunque sus registros permanecen en las tablas según la retención.']),
      match('ti-tablas', 'assessment', 'Relaciona cada clase de objeto con su destino.', [['indicator', 'Objetos indicator', 'ThreatIntelIndicators'], ['other', 'Otros objetos de inteligencia', 'ThreatIntelObjects']], 'Los objetos indicator se separan de los demás objetos STIX en las tablas descritas.', ['Los objetos `indicator` se escriben en `ThreatIntelIndicators`; los demás, en `ThreatIntelObjects`.']),
    ],
  },
  {
    lessonId: 'capitulo-11-respuesta-y-remediacion/3-action-center-1',
    introduction: 'Distingue una acción pendiente de una ya ejecutada y verifica en la superficie adecuada. El estado del incidente no demuestra por sí solo la remediación del activo.',
    goals: ['Distinguir Pending, History y Action source.', 'Reconocer el límite de Undo.', 'Separar cierre de incidente de remediación.'],
    summary: ['Pending permite aprobar o rechazar; History permite comprobar ejecuciones y deshacer acciones compatibles.', 'Undo no está disponible para cualquier acción.', 'Cerrar un incidente de Sentinel no demuestra por sí solo que el recurso esté remediado.'],
    questions: [
      match('actions-vistas', 'practice', 'Relaciona cada vista con su función.', [['pending', 'Pending', 'Aprobar o rechazar; agrupar acciones del mismo tipo.'], ['history', 'History', 'Comprobar lo ejecutado y deshacer acciones compatibles.'], ['source', 'Action source', 'Distinguir el origen manual, automatizado, Explorer, Advanced Hunting o Live response.']], 'Cada vista responde a una pregunta distinta: qué falta decidir, qué se ejecutó y de dónde procede la acción.', ['Aprobar o rechazar; se pueden agrupar acciones del mismo tipo', 'Comprobar lo ejecutado y deshacer acciones compatibles', 'Distinguir acción manual, automatizada, de Explorer, Advanced Hunting o Live response']),
      tf('actions-undo', 'practice', 'Undo está disponible para cualquier acción del historial.', false, 'La posibilidad de deshacer se limita a acciones compatibles; el documento excluye una garantía universal.', ['`Undo` no está disponible para cualquier acción.']),
      choice('actions-live-response', 'assessment', '¿Qué etiqueta identifica acciones mediante las API de MDE?', [['api', 'Live response action.', 'Es la etiqueta asociada a las API de MDE.'], ['manual', 'Manual live response action.', 'Corresponde a la sesión remota, no a la distinción de API evaluada.'], ['pending', 'Pending.', 'Pending es una vista para aprobar o rechazar acciones.']], 'api', 'El historial distingue la sesión remota manual de las acciones mediante API.', ['`Manual live response action` corresponde a la sesión remota; `Live response action` identifica acciones mediante las API de MDE.']),
      tf('actions-cierre', 'assessment', 'El cierre de un incidente de Sentinel demuestra que el recurso ya está remediado.', false, 'El último párrafo lo niega. Hay que comprobar la actuación en el producto y en el activo correspondiente.', ['El cierre de un incidente de Sentinel tampoco demuestra que el recurso esté remediado.']),
    ],
  },
  {
    lessonId: 'capitulo-11-respuesta-y-remediacion/4-verificar-y-recuperar-1',
    introduction: 'Recuperar un activo requiere verificar el resultado de la respuesta. La automatización no sustituye la comprobación posterior del analista.',
    goals: ['Reconocer las comprobaciones antes de liberar.', 'Decidir qué hacer si persiste el compromiso.', 'Aplicar la verificación también a contenciones automáticas.'],
    summary: ['Confirma que la acción terminó, que se trataron amenaza y persistencia, y que el activo puede volver al servicio.', 'Si sigue comprometido, mantén o ajusta la contención.', 'La contención automática también requiere comprobación posterior.'],
    questions: [
      { id: 'recuperar-comprobaciones', phase: 'practice', type: 'multi', prompt: 'Selecciona las tres comprobaciones que enumera el documento antes de liberar un activo.', options: [
        { id: 'done', text: 'Confirmar que la acción terminó.' }, { id: 'threat', text: 'Confirmar que se trataron la amenaza y su persistencia.' }, { id: 'service', text: 'Confirmar que el activo puede volver al servicio.' }, { id: 'incident', text: 'Sustituir las comprobaciones por el cierre del incidente.' },
      ], solution: ['done', 'threat', 'service'], explanation: 'Son tres comprobaciones sobre el resultado real. El cierre del incidente no figura como sustituto de ellas.', evidence: ['Antes de liberar: confirmar que la acción terminó, que la amenaza y su persistencia se trataron y que el activo puede volver al servicio.'] },
      choice('recuperar-comprometido', 'assessment', 'Si el activo sigue comprometido, ¿qué indica el apartado?', [['contain', 'Mantener o ajustar la contención.', 'Conserva la instrucción condicionada a que siga comprometido.'], ['release', 'Liberarlo igualmente.', 'Contradice la condición expresa del documento.'], ['ignore', 'Omitir la persistencia.', 'La persistencia forma parte de lo que hay que comprobar.']], 'contain', 'La recuperación depende de la comprobación del activo; no se libera mientras continúe comprometido.', ['Si sigue comprometido, mantener o ajustar la contención.']),
      tf('recuperar-automatico', 'assessment', 'Si la contención la inició Automatic attack disruption, ya no hace falta comprobación posterior del analista.', false, 'El segundo párrafo mantiene esa comprobación aunque la contención haya sido automática.', ['Esto también aplica cuando la contención la inició Automatic attack disruption: la automatización no sustituye la comprobación posterior del analista.']),
    ],
  },
  {
    lessonId: 'capitulo-13-mapa-de-tablas-y-relaciones-kql/1-orientarse-antes-de-escribir-kql-1',
    introduction: 'Antes de escribir una consulta, identifica la familia de datos y la superficie. El nombre de una columna temporal no permite asumir por sí solo cuándo se ingirió el registro.',
    goals: ['Distinguir las columnas temporales por familia.', 'Reconocer ingestion_time().', 'Consultar Schema para verificar columnas y ActionType.'],
    summary: ['Las tablas nativas de Defender usan Timestamp; las del workspace usan TimeGenerated.', 'TimeGenerated no debe asumirse automáticamente como hora de ingesta.', 'Comprueba columnas y ActionType en Schema.'],
    questions: [
      match('kql-tiempo-familias', 'practice', 'Relaciona la familia con la columna temporal descrita, conservando el matiz del Data Lake.', [['xdr', 'Tablas nativas de Defender XDR', 'Timestamp'], ['workspace', 'Tablas del workspace de Sentinel', 'TimeGenerated'], ['lake', 'Datos exclusivos del Sentinel data lake', 'Normalmente TimeGenerated']], 'La tabla distingue origen y superficie; en Data Lake dice normalmente, no siempre.', ['Tablas nativas de Defender XDR', '`Timestamp`', 'Tablas del workspace de Sentinel', 'Datos exclusivos del Sentinel data lake', 'Normalmente `TimeGenerated`']),
      choice('kql-ingestion', 'practice', '¿Qué utiliza el documento para medir cuándo llegó un registro al workspace?', [['ingest', 'ingestion_time().', 'Es la función indicada para la llegada al workspace.'], ['tg', 'TimeGenerated, asumiendo siempre que es la hora de ingesta.', 'El texto prohíbe asumir esa equivalencia automáticamente.'], ['ts', 'Timestamp, sin comprobar la familia de tablas.', 'Se identifica como tiempo del evento en las tablas nativas, no como la función de llegada evaluada.']], 'ingest', 'Distingue tiempo del registro, tiempo del evento nativo y momento de llegada al workspace.', ['Para medir cuándo llegó un registro al workspace se usa `ingestion_time()`.']),
      tf('kql-no-asumir', 'assessment', 'TimeGenerated representa automáticamente y en todos los casos la hora de ingesta.', false, 'El texto dice expresamente que no debe tratarse automáticamente como hora de ingesta.', ['`TimeGenerated` representa el tiempo del registro en Log Analytics, pero no debe tratarse automáticamente como hora de ingesta.']),
      choice('kql-schema', 'assessment', '¿Cómo propone el texto comprobar las columnas y ActionType de una familia?', [['schema', 'Consultar el panel Schema.', 'Es el procedimiento indicado en la nota.'], ['memorize', 'Asumir que todos los schemas son idénticos.', 'La nota exige reconocer la familia y comprobar sus columnas.'], ['ignore', 'Omitir ActionType porque nunca es necesario comprobarlo.', 'ActionType se menciona expresamente entre los elementos que se deben comprobar.']], 'schema', 'Reconocer la familia guía la consulta; el panel Schema confirma los nombres reales.', ['Hay que saber reconocer la familia correcta y consultar el panel `Schema` para comprobar columnas y `ActionType`.']),
    ],
  },
  {
    lessonId: 'capitulo-13-mapa-de-tablas-y-relaciones-kql/4-relaciones-que-si-conviene-memorizar-1',
    introduction: 'Una unión necesita una clave adecuada y una comprobación del contexto. El mismo nombre no garantiza la misma relación.',
    goals: ['Reconocer claves entre familias.', 'Interpretar la relación entre incidentes y alertas de Sentinel.', 'Conservar las condiciones de SearchKey y de normalización.'],
    summary: ['AlertInfo y AlertEvidence se relacionan por AlertId.', 'SecurityIncident requiere expandir AlertIds y compararlos con SystemAlertId.', 'Comprueba tipo, formato, mayúsculas, ámbito y ventana temporal antes de unir.'],
    questions: [
      match('kql-claves', 'practice', 'Relaciona cada relación con su clave indicada.', [['alerts', 'AlertInfo → AlertEvidence', 'AlertId'], ['devices', 'Tablas Device* entre sí', 'DeviceId; Timestamp y ReportId ayudan con el evento concreto.'], ['email', 'EmailEvents → EmailAttachmentInfo / EmailUrlInfo', 'NetworkMessageId']], 'La clave depende de la familia. En Device* el texto distingue la relación de dispositivo de la identificación de un evento concreto.', ['`AlertInfo` → `AlertEvidence`', '`AlertId`', '`DeviceId`; para identificar un evento concreto también ayudan `Timestamp` y `ReportId`', '`EmailEvents` → `EmailAttachmentInfo` / `EmailUrlInfo`', '`NetworkMessageId`']),
      tf('kql-nombres', 'practice', 'Que dos columnas tengan el mismo nombre basta para unirlas correctamente.', false, 'Antes de unir se comprueban tipo, formato, mayúsculas, ámbito y ventana temporal. El nombre por sí solo no basta.', ['Una coincidencia de nombre no basta para unir tablas. Primero se comprueban tipo, formato, mayúsculas, ámbito y ventana temporal.']),
      choice('kql-incidentes-alertas', 'assessment', '¿Qué relación describe la tabla entre SecurityIncident y SecurityAlert?', [['expand', 'Expandir AlertIds y compararlos con SystemAlertId.', 'Es la relación que figura para esas tablas.'], ['device', 'Unir siempre por DeviceId.', 'La fila de esas tablas no utiliza DeviceId.'], ['title', 'Unir solo por el título sin comprobar más.', 'El documento no propone el título y exige comprobaciones de compatibilidad.']], 'expand', 'La fila de incidentes/alertas exige expandir la colección de identificadores y compararla con el identificador de alerta.', ['`SecurityIncident` → `SecurityAlert`', 'expandir `AlertIds` y compararlos con `SystemAlertId`']),
      choice('kql-watchlist', 'assessment', '¿Qué matiz conserva el texto sobre SearchKey en una watchlist?', [['recommended', 'Es recomendada por rendimiento, no obligatoria.', 'Mantiene ambos matices de la fila.'], ['mandatory', 'Es obligatoria en todos los casos.', 'La fila dice expresamente que no es obligatoria.'], ['name', 'Permite unir cualquier dato sin comprobar compatibilidad.', 'La nota final exige comprobar el contexto y la compatibilidad de la relación.']], 'recommended', 'No conviertas una recomendación de rendimiento en un requisito obligatorio.', ['la columna elegida como `SearchKey`; es recomendada por rendimiento, no obligatoria']),
    ],
  },
  {
    lessonId: 'capitulo-10-hunting/1-formular-la-pregunta-o-hipotesis-1',
    introduction: 'El hunting empieza por una pregunta. Puede preceder a un incidente, ampliar una investigación o ayudar a mejorar detecciones después; no necesita que ya exista una alerta.',
    goals: ['Reconocer cuándo iniciar hunting.', 'Distinguir activos impactados de exposición.', 'Conservar condiciones y requisitos de los informes.'],
    summary: ['El hunting puede iniciarse antes, durante o después de una investigación.', 'Impacted assets describe detección real; Endpoints exposure incluye vulnerabilidad o mala configuración aunque no haya pasado nada.', 'Las pestañas de OSINT que dependen del entorno pueden estar vacías.'],
    questions: [
      tf('hunting-alerta', 'practice', 'El hunting requiere siempre una alerta previa.', false, 'Busca también amenazas que no generaron una alerta y puede iniciarse antes del incidente.', ['El hunting parte de una pregunta o hipótesis para buscar amenazas que no generaron una alerta. Puede iniciarse antes de un incidente, ampliar una investigación en curso o aplicarse después para mejorar las detecciones.']),
      match('hunting-impacto-exposicion', 'practice', 'Distingue dos secciones de Threat Analytics.', [['impact', 'Impacted assets', 'Detección real en los activos enumerados por el informe.'], ['exposure', 'Endpoints exposure', 'Vulnerables o mal configurados aunque no haya pasado nada.']], 'Exposición no equivale a detección real: el informe separa las dos secciones.', ['`Impacted assets` (detección real, por devices/users/mailboxes/apps/cloud resources)', '`Endpoints exposure` (vulnerables o mal configurados aunque no haya pasado nada)']),
      choice('hunting-osint', 'assessment', 'En OSINT, ¿qué matiz deben conservar las pestañas que dependen del entorno?', [['empty', 'Pueden venir vacías.', 'Es la condición expresada en la lista de categorías.'], ['always', 'Siempre tienen datos de la organización.', 'El texto permite que estén vacías.'], ['gone', 'Su ausencia demuestra por sí sola que no hubo actividad maliciosa.', 'No se establece esa conclusión: el dato depende del entorno.']], 'empty', 'Una pestaña dependiente del entorno vacía no permite inventar una conclusión de seguridad.', ['En `OSINT` las pestañas que dependen del entorno pueden venir vacías.']),
      choice('hunting-permisos', 'assessment', '¿Qué dice el texto de MDE P1 respecto al acceso a Threat Analytics?', [['alone', 'No da acceso por sí solo.', 'Conserva la limitación explícita.'], ['all', 'Da por sí solo acceso completo a todas las secciones.', 'El texto lo niega y detalla permisos adicionales por tarea.'], ['no', 'Hace innecesarios los permisos de lectura.', 'La lista exige permisos de lectura y otros permisos para exposición y recomendaciones.']], 'alone', 'Distingue licencia y permisos. El apartado detalla lectura básica y permisos adicionales para exposición y acciones recomendadas.', ['`MDE P1` no da acceso por sí solo.']),
    ],
  },
];
