# Fuentes, alcance y límites — 16/10/2026

## Procedencia

Este paquete reusa el currículo original `SPLUNK_CURRICULO_R01_R11.json` y el trabajo `SPLUNK_MASTER_RESEARCH_FASE2_BLOQUE1.md`, previamente archivados dentro de `SPLUNK_MASTER_RESEARCH/`. No se generó un nuevo currículo ni se alteraron IDs, título ni resultados del índice de las 18 lecciones. El trabajo de 2026-10-16 es documental, centrado en Splunk Enterprise 10.6 donde la referencia indica versión.

Las referencias **A1–A15** se transcriben de la bibliografía de la Fase 2 original, salvo A9 cuyo enlace se actualizó a la ruta canónica `get-data-in/get-started-with-getting-data-in/10.6/...`. Se añadieron los enlaces complementarios HEC y comparación de forwarders tras consulta a documentación oficial. Los documentos enlazados pueden cambiar y deben revisarse antes de publicar.

## Atribución de estado

- **Documentado:** teoría apoyada en documentación Splunk y contraste con SC-200.
- **Desarrollado editorialmente:** texto, 36 MCQ y 18 prácticas abiertas nuevos, con respuestas y rúbrica.
- **Comprobado offline:** integridad JSON, enlaces relativos del paquete, IDs únicos y fixture synthetic CSV con script de verificación independiente.
- **NO comprobado:** sintaxis SPL con parser/servicio real, precisión de campos del laboratorio, rendimiento, condiciones de RBAC/licencias, UX y progreso en React.

En los ejemplos `INDICE_AUTH`, `INDICE_REAL`, `INDICE_CONFIRMADO`, `INDICE_WINDOWS`, `SOURCETYPE_REAL`, `TOKEN_NO_REAL`, etc. **son marcadores**. No copiarlos directamente en producción.

## Referencias

- [ES_MC](https://help.splunk.com/en/splunk-enterprise-security-8/user-guide/8.7/mission-control/overview-of-mission-control-in-splunk-enterprise-security) — ES 8.7, Mission Control y analyst queue; contraste específico de SP-R01-L01, consultado 16/10/2026. No presupone ES instalado.
- [SOAR](https://help.splunk.com/en/splunk-soar/soar-cloud/build-playbooks/introduction-to-splunk-soar-playbooks/use-playbooks-to-automate-analyst-workflows-in-splunk-soar-cloud) — SOAR Cloud y playbooks; producto independiente.
- [DC](https://help.splunk.com/en/splunk-enterprise/search/spl-search-reference/10.2/statistical-and-charting-functions/aggregate-functions) — dc frente a estdc, consultado 16/10/2026. No equivalencia automática con dcount de KQL.

- [A1](https://help.splunk.com/en/data-management/manage-splunk-enterprise-indexers/10.6/indexing-overview/indexers-in-a-distributed-deployment) — https://help.splunk.com/en/data-management/manage-splunk-enterprise-indexers/10.6/indexing-overview/indexers-in-a-distributed-deployment
- [A2](https://help.splunk.com/en/splunk-enterprise/administer/distributed-deployment-manual/10.6/overview-of-splunk-enterprise-distributed-deployments/scale-your-deployment-with-splunk-enterprise-components) — https://help.splunk.com/en/splunk-enterprise/administer/distributed-deployment-manual/10.6/overview-of-splunk-enterprise-distributed-deployments/scale-your-deployment-with-splunk-enterprise-components
- [A3](https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.6/indexing-overview/how-indexing-works) — https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.6/indexing-overview/how-indexing-works
- [A4](https://help.splunk.com/en/splunk-enterprise/forward-and-process-data/forwarding-and-receiving-data/10.6/deploy-heavy-and-light-forwarders/deploy-a-heavy-forwarder) — https://help.splunk.com/en/splunk-enterprise/forward-and-process-data/forwarding-and-receiving-data/10.6/deploy-heavy-and-light-forwarders/deploy-a-heavy-forwarder
- [A5](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/administer-splunk-enterprise-with-configuration-files/configuration-parameters-and-the-data-pipeline) — https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/administer-splunk-enterprise-with-configuration-files/configuration-parameters-and-the-data-pipeline
- [A6](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/time-format-variables-and-modifiers/time-modifiers) — https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/time-format-variables-and-modifiers/time-modifiers
- [A7](https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.6/indexing-overview/index-time-versus-search-time) — https://help.splunk.com/en/splunk-enterprise/administer/manage-indexers-and-indexer-clusters/10.6/indexing-overview/index-time-versus-search-time
- [A8](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/configuration-file-reference/10.6.0-configuration-file-reference/props.conf) — https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.6/configuration-file-reference/10.6.0-configuration-file-reference/props.conf
- [A9](https://help.splunk.com/en/splunk-enterprise/get-data-in/get-started-with-getting-data-in/10.6/get-data-with-http-event-collector/set-up-and-use-http-event-collector-in-splunk-web) — https://help.splunk.com/en/splunk-enterprise/get-data-in/get-started-with-getting-data-in/10.6/get-data-with-http-event-collector/set-up-and-use-http-event-collector-in-splunk-web
- [A10](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/stats) — https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/stats
- [A11](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/bin) — https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/bin
- [A12](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/where) — https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/where
- [A13](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/fieldsummary) — https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/search-commands/fieldsummary
- [A14](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.6/optimize-searches/quick-tips-for-optimization) — https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.6/optimize-searches/quick-tips-for-optimization
- [A15](https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/quick-reference/commands-by-category) — https://help.splunk.com/en/splunk-enterprise/spl-search-reference/10.6/quick-reference/commands-by-category
- [HEC](https://help.splunk.com/en/splunk-enterprise/get-data-in/collect-http-event-data/http-event-collector-examples) — https://help.splunk.com/en/splunk-enterprise/get-data-in/collect-http-event-data/http-event-collector-examples
- [FWD](https://help.splunk.com/en/splunk-cloud-platform/forward-and-process-data/ingest-actions/process-data-with-forwarders/forwarder-comparison) — https://help.splunk.com/en/splunk-cloud-platform/forward-and-process-data/ingest-actions/process-data-with-forwarders/forwarder-comparison

## Puentes SC-200

Capítulos 01, 03, 04, 05, 07, 09, 10 y 13: consulta referencias y rangos en cada lección. No existe traducción exacta entre tablas de Sentinel/XDR y índices/sourcetypes Splunk.

## QA pendiente

Se requiere revisión editorial independiente de respuestas, validación de SPL en una instancia con índice/sourcetype observados, comprobación de campos Windows/Linux, y adaptación al contrato de la aplicación tras consultar su código. No instalar ni conectar nada automáticamente.
