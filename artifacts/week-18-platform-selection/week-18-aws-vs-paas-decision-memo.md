# AWS vs PaaS Decision Memo｜Week 18

## Decision

Use simpler cloud options by default. Choose AWS or GCP only when the workload, team, compliance, networking, and operations maturity justify the extra moving parts.

## Recommended Default

| Situation | Default |
| --- | --- |
| Learning and early automation | n8n Cloud or Local Docker Desktop |
| First paid client | VPS Docker Compose + PostgreSQL, or PaaS + managed/external PostgreSQL |
| Repeatable agency delivery | Standardized isolated client blueprint |
| Production platform team | AWS/GCP with managed PostgreSQL, Redis queue, centralized logs, IaC, budgets, and on-call |

## PaaS Advantages

| Advantage | Why it matters |
| --- | --- |
| Faster deployment | Reduces setup time for freelancer and agency delivery. |
| Managed public endpoint | Simplifies TLS, domain, and routing compared with raw VM networking. |
| Managed or external database options | Reduces the chance that SQLite or unmanaged Postgres becomes the hidden production risk; Railway template databases still require operator-owned backups, DR, security, and monitoring unless Enterprise or an external managed provider is used. |
| Lower cognitive load | Fewer services to debug during Week 17-style incidents. |
| Easier client explanation | Costs can be explained as app, database, storage, and usage rather than a large AWS bill of materials. |

## PaaS Risks

| Risk | Control |
| --- | --- |
| Usage-priced RAM/CPU/storage/egress drift | Set monthly budgets, usage alerts, storage alerts, and max instance limits. |
| Free tier behavior | Do not use free tier for production webhooks or client credentials. |
| Platform-specific migration | Keep workflow exports, env inventory, PostgreSQL backups, and OAuth redirect documentation. |
| Limited low-level control | Move to AWS/GCP only when private networking, IAM, queue workers, or compliance require it. |

## AWS/GCP Advantages

| Advantage | Why it matters |
| --- | --- |
| VPC and private networking | Required for internal APIs, private DBs, and enterprise network boundaries. |
| IAM and audit controls | Required for production teams with compliance and access governance. |
| Managed PostgreSQL and Redis | Supports queue mode, HA, backup, and operational dashboards. |
| Centralized logs and metrics | Supports SLO, incident response, and capacity planning. |
| Infrastructure as code | Makes production changes reviewable and repeatable. |

## AWS/GCP Risks

| Risk | Control |
| --- | --- |
| Cost stack complexity | Estimate app compute, RDS, Redis, logs, LB, NAT, egress, backup, storage, support, and labor together. |
| More troubleshooting layers | Require Week 17 incident process, centralized logs, and runbooks before production cutover. |
| Overengineering small workloads | Keep small freelancer/client projects on VPS/PaaS unless compliance or networking proves otherwise. |
| Autoscaling bill shock | Set max instances, queue thresholds, budget alerts, and anomaly detection before launch. |

## Decision Gates

| Gate | Choose PaaS or VPS if | Choose AWS/GCP if |
| --- | --- | --- |
| Operations owner | No dedicated cloud ops exists | A production team owns IaC, on-call, and FinOps |
| Networking | Public HTTPS webhook is enough | Private VPC, internal APIs, peering, or IAM boundaries are required |
| Data layer | Managed Postgres plan is enough | RDS/Cloud SQL with explicit RPO/RTO and backup governance is required |
| Scaling | Single instance or simple worker process is enough | Redis queue, worker pools, central logs, and separate webhook processors are required |
| Cost model | Client needs predictable simple billing | Team can manage multi-service budgets and anomaly alerts |
| Compliance | Basic credential hygiene and backups are enough | Audit, SSO, private networking, data residency, or formal review is required |

## Final Recommendation

Beginner should use n8n Cloud. Freelancer should use VPS Compose or a small PaaS with managed/external PostgreSQL; Railway template databases need explicit backup, DR, security, and monitoring ownership. Agency should standardize isolated client blueprints or use n8n Cloud Business/Enterprise. Production team should choose AWS/GCP only when they have the operational maturity to own managed state, queue mode, logs, budgets, and incident response.

## Source Links

| Source | Link |
| --- | --- |
| n8n Docker install | https://docs.n8n.io/hosting/installation/docker/ |
| n8n scaling overview | https://docs.n8n.io/hosting/scaling/overview/ |
| n8n queue mode | https://docs.n8n.io/hosting/scaling/queue-mode/ |
| n8n execution data | https://docs.n8n.io/hosting/scaling/execution-data/ |
| n8n binary data | https://docs.n8n.io/hosting/scaling/binary-data/ |
| n8n external storage | https://docs.n8n.io/hosting/scaling/external-storage/ |
| n8n logging | https://docs.n8n.io/hosting/logging-monitoring/logging/ |
| n8n monitoring | https://docs.n8n.io/hosting/logging-monitoring/monitoring/ |
| Render pricing | https://render.com/pricing |
| Render free usage | https://render.com/free |
| Railway pricing | https://docs.railway.com/pricing |
| Railway databases | https://docs.railway.com/databases |
| Fly.io pricing | https://fly.io/pricing/ |
| Google Cloud Run pricing | https://cloud.google.com/run/pricing |
| AWS Fargate pricing | https://aws.amazon.com/fargate/pricing/ |
| Amazon RDS pricing | https://aws.amazon.com/rds/pricing/ |
| AWS data transfer pricing | https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer |
| Amazon Lightsail pricing | https://aws.amazon.com/lightsail/pricing/ |
