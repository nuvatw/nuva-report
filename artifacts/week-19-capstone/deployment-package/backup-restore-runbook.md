# Backup and Restore Runbook

## Backup Scope

| Scope | Required artifact |
| --- | --- |
| PostgreSQL | Compressed `pg_dump` output. |
| n8n local state | `n8n_data` Docker volume archive or host snapshot. |
| Caddy state | `caddy_data` and `caddy_config` volume archive or host snapshot. |
| Secrets | `.env` plus secret-store record for `N8N_ENCRYPTION_KEY` and `POSTGRES_PASSWORD`. |
| Documentation | Current `README.md`, `compose.yaml`, `Caddyfile`, and runbooks. |

## Backup Commands

Run from the deployment package directory after `.env` exists.

```bash
mkdir -p backups
docker compose --env-file .env -f compose.yaml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \
  | gzip > "backups/n8n-postgres-$(date +%Y%m%d-%H%M%S).sql.gz"
docker compose --env-file .env -f compose.yaml ps > "backups/compose-status-$(date +%Y%m%d-%H%M%S).txt"
docker volume ls > "backups/docker-volumes-$(date +%Y%m%d-%H%M%S).txt"
```

## Secret Backup Rules

| Secret | Rule |
| --- | --- |
| `N8N_ENCRYPTION_KEY` | Store in a managed secret store and include in restore drills. |
| `POSTGRES_PASSWORD` | Store in a managed secret store and rotate only with a planned DB credential change. |
| `.env` | Do not commit to source control; store encrypted with deployment records. |

## Restore Order

1. Provision a clean host with Docker and Docker Compose.
2. Restore `compose.yaml`, `Caddyfile`, `.env`, and runbooks.
3. Create Docker volumes or restore host volume snapshots.
4. Start only PostgreSQL with `docker compose --env-file .env -f compose.yaml up -d postgres`.
5. Restore the PostgreSQL dump into the `postgres` service.
6. Start n8n and Caddy with `docker compose --env-file .env -f compose.yaml up -d`.
7. Verify `https://N8N_DOMAIN/healthz`.
8. Verify `https://N8N_DOMAIN/healthz/readiness`.
9. Verify credentials can decrypt by running a known workflow that uses a saved credential.
10. Verify a Production URL webhook reaches the expected workflow.

## Restore Verification

| Check | Pass condition |
| --- | --- |
| Container state | `postgres`, `n8n`, and `caddy` are running. |
| Health | `/healthz` returns 200. |
| Readiness | `/healthz/readiness` returns 200. |
| Credentials | Existing credential-backed workflow succeeds. |
| Webhook | Production URL uses `https://N8N_DOMAIN/` and creates an execution. |
| Logs | No database connection, encryption, cookie, or proxy errors in recent logs. |

## Recovery Risks

| Risk | Prevention |
| --- | --- |
| Lost credentials | Preserve the original `N8N_ENCRYPTION_KEY`. |
| Empty database | Verify PostgreSQL dump size and restore output. |
| Wrong domain | Verify DNS and `WEBHOOK_URL` before enabling production workflows. |
| Broken TLS | Restore Caddy config and confirm ports 80/443 are reachable. |
