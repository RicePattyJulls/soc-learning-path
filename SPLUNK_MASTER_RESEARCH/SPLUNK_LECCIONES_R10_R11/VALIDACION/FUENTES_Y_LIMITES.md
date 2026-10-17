# Fuentes y límites — Splunk R10–R11

Fecha de revisión documental: 2026-10-16. Las URLs apuntan a documentación del fabricante, con versiones concretas **distintas entre sí**. Verificar compatibilidad con el laboratorio y suscripción real antes de operar.

- **D01:** [Splunk Enterprise 10.4 — Configuration file precedence](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.4/administer-splunk-enterprise-with-configuration-files/configuration-file-precedence)
- **D02:** [Splunk Enterprise 10.2 — btool CLI help](https://help.splunk.com/en/splunk-enterprise/administer/troubleshoot/10.2/contact-splunk-support/command-line-tools-for-use-with-support)
- **D03:** [Splunk Enterprise 10.2 — Manage roles in authorize.conf](https://help.splunk.com/en/splunk-enterprise/administer/manage-users-and-security/10.2/perform-advanced-user-and-role-management-in-splunk-enterprise/create-and-manage-roles-in-splunk-enterprise-using-the-authorize.conf-configuration-file)
- **D04:** [Splunk Enterprise 10.2 — indexes.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.2/configuration-file-reference/10.2.4-configuration-file-reference/indexes.conf)
- **D05:** [Splunk Enterprise 10.2 — Search optimization](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.2/optimize-searches/write-better-searches)
- **D06:** [Splunk Enterprise 10.2 — Search Job Inspector](https://help.splunk.com/en/splunk-enterprise/search/search-manual/10.2/manage-jobs/view-search-job-properties)
- **D07:** [Splunk Enterprise 10.2 — Search head cluster prerequisites](https://help.splunk.com/en/splunk-enterprise/administer/distributed-search/10.2/deploy-search-head-clustering/system-requirements-and-other-deployment-considerations-for-search-head-clusters)
- **D08:** [Splunk Enterprise 10.2 — Deploy distributed search](https://help.splunk.com/en/splunk-enterprise/administer/distributed-search/10.2/deploy-distributed-search/deploy-a-distributed-search-environment)
- **D09:** [Splunk Enterprise 10.2 — Backup before UNIX upgrade](https://help.splunk.com/en/splunk-enterprise/get-started/install-and-upgrade/10.2/upgrade-or-migrate-splunk-enterprise/upgrade-to-version-10.2-on-unix)
- **D10:** [Splunk Enterprise 10.2 — Search REST endpoint descriptions](https://help.splunk.com/en/splunk-enterprise/rest-api-reference/10.2/search-endpoints/search-endpoint-descriptions)
- **D11:** [Splunk SOAR Cloud — Playbooks overview](https://help.splunk.com/en/splunk-soar/soar-cloud/build-playbooks/introduction-to-splunk-soar-playbooks/use-playbooks-to-automate-analyst-workflows-in-splunk-soar-cloud)
- **D12:** [Splunk SOAR Cloud — Playbook automation API approvals](https://help.splunk.com/en/splunk-soar/soar-cloud/develop-apps/python-playbook-api-reference/automation-api/playbook-automation-api)
- **D13:** [Splunk SOAR Cloud — Approve actions](https://help.splunk.com/en/splunk-soar/soar-cloud/use-soar-cloud/get-started-using-splunk-soar-cloud/approve-actions-before-they-run-in-splunk-soar-cloud)
- **D14:** [Splunk SOAR Cloud — Add action block](https://help.splunk.com/en/splunk-soar/soar-cloud/develop-apps/build-playbooks/use-the-playbook-editor-to-create-and-view-playbooks-to-automate-analyst-workflows/add-an-action-block-to-your-splunk-soar-cloud-playbook)
- **D15:** [Splunk SOAR Cloud — Create playbook with approval](https://help.splunk.com/en/splunk-soar/soar-cloud/build-playbooks/use-the-playbook-editor-to-create-and-view-playbooks-to-automate-analyst-workflows/create-a-new-playbook-in-splunk-soar-cloud)
- **D16:** [Splunk Enterprise 10.2 — authorize.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.2/configuration-file-reference/10.2.3-configuration-file-reference/authorize.conf)
- **D17:** [Splunk SOAR Cloud — Better playbook guidelines](https://help.splunk.com/en/splunk-soar/soar-cloud/develop-apps/build-playbooks/introduction-to-splunk-soar-playbooks/write-better-playbooks-by-following-these-guidelines)
- **D18:** [Splunk Enterprise 10.2 — app.conf](https://help.splunk.com/en/splunk-enterprise/administer/admin-manual/10.2/configuration-file-reference/10.2.0-configuration-file-reference/app.conf)
- **D19:** [Splunk Enterprise 10.6 — Role inheritance basics](https://help.splunk.com/en/splunk-enterprise/administer/manage-users-and-security/10.6/manage-splunk-platform-users-and-roles/about-configuring-role-based-user-access)
- **D20:** [Splunk Enterprise 10.6 — Introducción a TLS](https://help.splunk.com/en/splunk-enterprise/administer/manage-users-and-security/10.6/secure-splunk-platform-communications-with-transport-layer-security-certificates/introduction-to-securing-the-splunk-platform-with-tls)
- **D21:** [Splunk Enterprise 10.2 — Webhook alert action](https://help.splunk.com/en/splunk-enterprise/alert-and-respond/alerting-manual/10.2/configure-alert-actions/use-a-webhook-alert-action)
- **D22:** [Splunk Enterprise 10.2 — Indexing performance Monitoring Console](https://help.splunk.com/en/splunk-enterprise/administer/monitor/10.2/monitoring-console-dashboard-reference/indexing-performance)

## Distinciones obligatorias

- **Splunk Enterprise:** ejemplos de configuración, btool, roles, Search Job Inspector, índices y alertas de plataforma. Splunk Cloud puede distribuir administración diferente y gestionar aspectos restringidos al proveedor.
- **Splunk SOAR Cloud:** app/asset/action/playbook y autorizaciones específicas. No está incluido automáticamente en Splunk Enterprise ni en Splunk Cloud Platform. ES tampoco equivale a SOAR.
- **[DOC]:** descripciones razonadas de documentación oficial. Una referencia puede documentar una capacidad sin verificar su disponibilidad en tu versión/edición.
- **[DISEÑO]:** actividades, casos, esquemas, umbrales y soluciones propuestos por este paquete.
- **[OFFLINE]:** operaciones aritméticas o de lógica verificadas contra CSV sintéticos por Python. NO evidencia de funcionalidades reales de Splunk.
- **[NO PROBADO]:** ningún SPL fue ejecutado; no se abrió REST, no se probó SOAR, no hay benchmarks reales.
- **[PENDIENTE]:** revisión humana independiente de rigor técnico y compatibilidad, en especial control de acceso, efectos de API, rutas según versión y guardrails de productos.

### Precauciones prácticas

1. `btool` permite investigar configuración fusionada de esa instancia; no valida el pipeline y la precedence difiere por contexto.
2. Heredar roles amplía privilegios; un índice restringido en consulta visible no garantiza RBAC.
3. La caducidad y la identidad del certificado TLS se validan; jamás usar `-k` como solución permanente.
4. `capacity/daily_gib` es estimación; buckets, overhead, replicación y política pueden adelantar frozen; jamás afirmar plazos de retención medidos con este cálculo.
5. Search Job Inspector es la herramienta real. `search_jobs.csv` es enteramente ficticio y su hash solo una marca pedagógica, no una comparación criptográfica de resultados Splunk.
6. REST v2: creación de job mediante POST puede dejar un job en Splunk; aunque la SPL sea de lectura, no describir «HTTP POST sin efectos». Ningún código del ZIP se conecta a un host.
7. El webhook integrado 10.2 envía POST con JSON de alerta; documentación detalla first result row, SID, enlace, owner y app; una extracción posterior debe minimizar PII y usar URL en allowlist. El esquema en R11-L03 es un **payload recomendado transformado por un gateway**, no necesariamente body que envía la acción nativa.
8. SOAR assets/reviewers pueden bloquear acciones hasta revisión, pero un workflow incompleto o detenido puede tener efectos parciales; el alumno jamás debe accionar sistemas reales.
9. Los dominios `*.example.test` y direcciones IP de documentación RFC 5737 no describen tu infraestructura.

### Para integrar en SOC Learning Path

Revisar el esquema de progreso/XP de React 0.2.5 con Codex y migrar desde el banco editorial en una fase posterior. Las rutas `SP-R10-Lxx` y `SP-R11-Lxx` conservan los IDs originales del currículo. Evitar mezclar el progreso de Microsoft con Splunk. Antes de habilitar laboratorio real, inventario de licencia/versiones, índices y datos autorizados, security review de API/acciones y pruebas de respuesta del motor educativo.
