# Troubleshooting Playbook

## Fixed Check Order

| Order | Gate | First action |
| --- | --- | --- |
| 1 | log | Read `docker compose --env-file .env -f compose.yaml logs --since 30m`. |
| 2 | env | Compare `.env` with `.env.template` and secret-store records. |
| 3 | DNS | Confirm `N8N_DOMAIN` resolves to the VPS public IP. |
| 4 | proxy | Confirm Caddy owns 80/443 and reverse proxies to `n8n:5678`. |
| 5 | DB | Check `/healthz/readiness` and PostgreSQL logs. |
| 6 | container | Check `docker compose --env-file .env -f compose.yaml ps`. |
| 7 | credentials | Confirm `N8N_ENCRYPTION_KEY` matches the original instance key. |
| 8 | OAuth | Confirm OAuth Redirect URL uses the public HTTPS domain. |
| 9 | security | Confirm `N8N_SECURE_COOKIE=true` with HTTPS. |
| 10 | resource | Check memory, CPU, disk, DB storage, and binary data growth. |
| 11 | queue | Not enabled in this baseline; if added later, check Redis and workers. |
| 12 | workflow | Inspect failed execution and first failed node. |

## Required Incident Cards

| Incident | First check | Repair direction |
| --- | --- | --- |
| wrong webhook URL | Compare editor Production URL, `WEBHOOK_URL`, `N8N_DOMAIN`, and Caddy route. | Set `WEBHOOK_URL=https://N8N_DOMAIN/`, keep `N8N_PROXY_HOPS=1`, restart n8n, reactivate or re-register webhook. |
| lost credentials | Confirm current `N8N_ENCRYPTION_KEY` matches original deployment secret. | Restore the original key or restore DB and key from backup; recreate credentials only after confirming key loss. |
| database connection failed | Check `/healthz/readiness`, PostgreSQL logs, and `DB_POSTGRESDB_*`. | Fix DB host, database, user, password, Docker network, or SSL settings; restart n8n after DB is healthy. |
| secure cookie error | Confirm user enters through HTTPS and Caddy passes the correct forwarded scheme. | Keep production HTTPS, keep `N8N_SECURE_COOKIE=true`, fix Caddy/DNS/TLS rather than weakening cookie security. |

## Common Commands

```bash
docker compose --env-file .env -f compose.yaml ps
docker compose --env-file .env -f compose.yaml logs --since 30m n8n
docker compose --env-file .env -f compose.yaml logs --since 30m postgres
docker compose --env-file .env -f compose.yaml logs --since 30m caddy
curl -I "https://${N8N_DOMAIN}/healthz"
curl -I "https://${N8N_DOMAIN}/healthz/readiness"
```

## Escalation

| Symptom | Escalate to |
| --- | --- |
| DB cannot restore | Backup owner and database maintainer. |
| Credentials cannot decrypt | Secret owner and deployment owner. |
| TLS cannot renew | DNS owner and VPS owner. |
| Memory or storage repeatedly exceeds limits | Platform owner for Week 16 scaling review. |
| Client-facing outage exceeds SLA | Incident owner and business owner. |

## Prevention

| Risk | Preventive action |
| --- | --- |
| wrong webhook URL | Verify public URL after every DNS/proxy change. |
| lost credentials | Store `N8N_ENCRYPTION_KEY` in the secret store and include it in restore drills. |
| database connection failed | Keep DB env in one source of truth and monitor readiness. |
| secure cookie error | Keep HTTPS enabled and test browser login after proxy changes. |
| noisy incidents | Keep logs structured with `N8N_LOG_FORMAT=json`. |
