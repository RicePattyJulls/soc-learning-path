# LAB05-A — Validar mapeos de Authentication CIM

**Región:** R05 · **Estado:** mapeo conceptual/offline. **No instala** un TA ni crea tags en Splunk.

## Datos

`auth_raw.csv` simula seis registros: 3 Windows login (4625, 4624 y 4625 sin IP), 2 Linux login (failed, accepted), y un Windows 4688 de proceso que NO debe incluirse en Authentication.

## Actividades

1. Propón user = Account_Name (Windows) o linux_user (Linux) cuando representen realmente la identidad que inicia sesión.
2. Propón src = Source_Network_Address (Windows) o src_ip (Linux), sin inventar una dirección donde no se registró.
3. Alinea action=success/failure con EventCode 4624/4625 y mensajes accepted/failed, verificando contexto de autenticación.
4. Excluye `r6` (Windows EventCode 4688) de Authentication; justifica por qué no basta con que contenga Account_Name.
5. Audita cobertura sobre **cinco** logins: 5/5 con identidad, 4/5 con IP, 5/5 con acción interpretable en el fixture. Separa calidad de los campos de validez del tag CIM.
6. Diseña un esquema de eventtypes/tags y una checklist de verificación de los constraints reales.

## SPL conceptual de lectura

```spl
index=INDICE_AUTH sourcetype=SOURCETYPE_AUTH tag=authentication earliest=-24h
| eval falta_user=if(isnull(user) OR len(trim(user))=0,1,0)
| eval falta_src=if(isnull(src) OR len(trim(src))=0,1,0)
| stats count AS eventos sum(falta_user) AS sin_user sum(falta_src) AS sin_src BY sourcetype
```

**No se ejecuta automáticamente:** el add-on, eventtypes, tags y fuente del laboratorio NO están comprobados.

## Resultado de referencia

Total de 6 eventos, 5 login, 1 no login, 1 login sin IP, 0 login sin user, 0 login sin action interpretable para este fixture. Son estadísticas de datos inventados, NO métricas de tu laboratorio.

Rúbrica /4: clasificación correcta, mapeos no inventados, auditoría con denominador, limitaciones por fuente.
