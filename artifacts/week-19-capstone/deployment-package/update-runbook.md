# Update and Rollback Runbook

## Update Policy

Update at least monthly, and sooner for security fixes. Do not update production without a fresh backup, release note review, and rollback point.

## Pre-update Checklist

| Check | Required evidence |
| --- | --- |
| Release notes reviewed | Version being installed and breaking changes recorded. |
| Backup completed | PostgreSQL dump, volume evidence, and `.env` secret archive exist. |
| Current version recorded | `docker compose --env-file .env -f compose.yaml exec n8n n8n --version`. |
| Rollback image known | Previous `N8N_IMAGE` tag recorded in the update note. |
| Maintenance window approved | Owner and expected impact recorded. |

## Update Steps

1. Set `N8N_IMAGE` in `.env` to the target stable image tag.
2. Run `docker compose --env-file .env -f compose.yaml pull n8n`.
3. Run `docker compose --env-file .env -f compose.yaml up -d n8n`.
4. Wait for `docker compose --env-file .env -f compose.yaml ps` to show n8n healthy.
5. Check `https://N8N_DOMAIN/healthz`.
6. Check `https://N8N_DOMAIN/healthz/readiness`.
7. Run one manual workflow.
8. Run one production webhook test.
9. Review logs for database, migration, encryption, cookie, proxy, and credential errors.
10. Record final version and update result.

## Rollback Steps

1. Set `N8N_IMAGE` back to the previous image tag.
2. Run `docker compose --env-file .env -f compose.yaml pull n8n`.
3. Run `docker compose --env-file .env -f compose.yaml up -d n8n`.
4. If migrations or data changes broke compatibility, stop n8n and restore the PostgreSQL dump.
5. Verify `/healthz`, `/healthz/readiness`, credentials, and webhook execution.
6. Record root cause in an incident note.

## Post-update Verification

| Check | Pass condition |
| --- | --- |
| n8n version | Expected target version is running. |
| UI login | Owner can log in through HTTPS. |
| Readiness | `/healthz/readiness` returns 200. |
| Credentials | Credential-backed workflow succeeds. |
| Webhook URL | Production URL uses public HTTPS domain. |
| Logs | No new startup or migration errors. |

## Update Risks

| Risk | Control |
| --- | --- |
| Breaking changes | Read release notes and test first. |
| Migration failure | Back up PostgreSQL before update. |
| Credential decrypt error | Preserve `N8N_ENCRYPTION_KEY`. |
| Public URL regression | Recheck `WEBHOOK_URL` and Caddy route after update. |
