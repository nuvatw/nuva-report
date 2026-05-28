# Final Recommendation Report｜Week 20

## Executive Recommendation

Adopt the Week 19 `VPS Docker Compose + PostgreSQL + Caddy` deployment package as the first self-hosted baseline for teams that can own basic operations. Use n8n Cloud when the team does not have an operations owner. Use PaaS when speed and lower VM maintenance matter more than fixed baseline cost. Consider AWS/GCP only after VPC, IAM, audit, RPO/RTO, queue workers, centralized logs, and FinOps are real requirements.

## Primary Path

| Decision | Recommendation |
| --- | --- |
| Primary self-hosted baseline | VPS Docker Compose + PostgreSQL + Caddy |
| Beginner or no ops owner | n8n Cloud |
| Freelancer | VPS baseline or small PaaS with managed/external PostgreSQL |
| Agency | Standardized isolated client blueprint |
| Production team | AWS/GCP or n8n Enterprise after operational gates are met |

## Why This Path

| Reason | Evidence |
| --- | --- |
| It is handoff-ready | Week 19 package includes README, compose, env template, Caddyfile, backup, update, troubleshooting, and demo checklist. |
| It preserves durable state | PostgreSQL and named volumes are explicit. |
| It controls public URL risk | Caddy, `WEBHOOK_URL`, `N8N_PROXY_HOPS`, and HTTPS are documented. |
| It protects credentials | `N8N_ENCRYPTION_KEY` is treated as a critical secret. |
| It can scale gradually | Week 16 defines the path from single instance to Redis queue workers. |
| It avoids premature complexity | Kubernetes and AWS/GCP are reserved for proven requirements. |

## Key Risks

| Risk | First control |
| --- | --- |
| wrong webhook URL | Verify `WEBHOOK_URL`, `N8N_DOMAIN`, Caddy route, and editor Production URL. |
| lost credentials | Preserve and restore the original `N8N_ENCRYPTION_KEY`. |
| database connection failed | Check `/healthz/readiness`, PostgreSQL logs, and `DB_POSTGRESDB_*`. |
| secure cookie error | Keep HTTPS and `N8N_SECURE_COOKIE=true`; fix proxy headers. |
| DB storage growth | Set execution retention and review database size monthly. |
| binary data growth | Keep binary mode explicit and monitor storage. |
| unsafe update | Backup first, review release notes, keep rollback image tag. |
| cost drift | Track RAM, CPU, storage, egress, logs, Redis, and maintenance labor. |

## Backup Answer

Back up PostgreSQL, `n8n_data`, Caddy volumes, `.env`, `N8N_ENCRYPTION_KEY`, and current deployment package files. A backup is not accepted until a restore drill proves `/healthz`, `/healthz/readiness`, credential decryption, and a Production URL webhook.

## Update Answer

Update in a maintenance window. Review release notes, create backup, record current image tag, pull target image, start n8n, verify health/readiness, test credential-backed workflow, test production webhook, then record the result. Roll back by restoring the previous image tag and database backup if needed.

## Scaling Answer

Do not start with Kubernetes. First measure p95 execution latency, active executions, DB connections, memory, storage, and webhook response time. Then apply pruning, concurrency control, and workflow tuning. Move to Redis queue mode and workers only when production executions or webhook latency repeatedly exceed the single-instance capacity. Evaluate AWS/GCP only when queue operations, managed state, centralized logs, security, and FinOps are mature.

## Final Decision Table

| Scenario | Decision |
| --- | --- |
| Individual learning | n8n Cloud or Local Docker Desktop |
| First paid automation | VPS package or PaaS with managed/external PostgreSQL |
| Repeatable agency delivery | Standardize Week 19 package per client |
| Low-ops client | n8n Cloud Business or Enterprise |
| Heavy production workload | PostgreSQL + Redis queue mode + workers after scaling gate |
| Enterprise governance | AWS/GCP or n8n Enterprise after security and FinOps review |

## Source Links

| Source | Link |
| --- | --- |
| n8n pricing | https://n8n.io/pricing/ |
| Docker installation | https://docs.n8n.io/hosting/installation/docker/ |
| Docker Compose setup | https://docs.n8n.io/hosting/installation/server-setups/docker-compose/ |
| Webhook URL behind proxy | https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/ |
| Updating self-hosted n8n | https://docs.n8n.io/hosting/installation/updating/ |
| Security audit | https://docs.n8n.io/hosting/securing/security-audit/ |
| Logging | https://docs.n8n.io/hosting/logging-monitoring/logging/ |
| Monitoring | https://docs.n8n.io/hosting/logging-monitoring/monitoring/ |
| Scaling overview | https://docs.n8n.io/hosting/scaling/overview/ |
| Queue mode | https://docs.n8n.io/hosting/scaling/queue-mode/ |
| Concurrency control | https://docs.n8n.io/hosting/scaling/concurrency-control/ |
| Execution data | https://docs.n8n.io/hosting/scaling/execution-data/ |
| Binary data | https://docs.n8n.io/hosting/scaling/binary-data/ |
