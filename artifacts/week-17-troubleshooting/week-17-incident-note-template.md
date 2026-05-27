# Incident Note Template｜n8n troubleshooting

## Incident Header

| Field | Value |
| --- | --- |
| Incident ID | （填入實際 incident id） |
| Owner | （填入負責人） |
| Severity | （填入 SEV 等級） |
| Start time | （填入 Asia/Taipei 時間） |
| Detected time | （填入 Asia/Taipei 時間） |
| Resolved time | （填入 Asia/Taipei 時間） |
| Affected workflow | （填入 workflow 名稱或 id） |
| Affected users or systems | （填入受影響對象） |

## Symptom

| Evidence | Value |
| --- | --- |
| Exact error text | （貼上原始錯誤文字） |
| HTTP status | （填入狀態碼） |
| Execution id | （填入 execution id） |
| Container or process | （填入 main、worker、webhook processor、DB、Redis、proxy） |
| First observed by | （填入來源，例如 alert、user、provider callback） |

## Architecture Context

| Field | Value |
| --- | --- |
| Deployment type | （填入 Docker、Compose、VPS、PaaS、queue mode） |
| Public URL | （填入 public base URL） |
| Proxy | （填入 Caddy、Nginx、Traefik、load balancer） |
| Database | （填入 SQLite、PostgreSQL、自管或 managed） |
| Redis or workers | （填入無、Redis、worker 數量） |
| n8n version | （填入版本） |
| Last deploy or config change | （填入時間與變更摘要） |

## Check Sequence

| Order | Gate | Result | Evidence link or command output |
| --- | --- | --- | --- |
| 1 | log | （填入結果） | （填入證據） |
| 2 | env | （填入結果） | （填入證據） |
| 3 | DNS | （填入結果） | （填入證據） |
| 4 | proxy | （填入結果） | （填入證據） |
| 5 | DB | （填入結果） | （填入證據） |
| 6 | container | （填入結果） | （填入證據） |
| 7 | credentials | （填入結果） | （填入證據） |
| 8 | OAuth | （填入結果） | （填入證據） |
| 9 | security | （填入結果） | （填入證據） |
| 10 | resource | （填入結果） | （填入證據） |
| 11 | queue | （填入結果） | （填入證據） |
| 12 | workflow | （填入結果） | （填入證據） |

## Hypothesis Matrix

| Layer | Hypothesis | Evidence | Status | Next action |
| --- | --- | --- | --- | --- |
| container | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| DB | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| URL | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| proxy | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| OAuth | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| security | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| resource | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |
| workflow | （填入假設） | （填入證據） | open / ruled out / confirmed | （填入下一步） |

## Fix Applied

| Field | Value |
| --- | --- |
| Change owner | （填入執行者） |
| Change description | （填入實際變更） |
| Commands or deployment link | （填入指令或連結） |
| Environment diff | （填入變更前後的 env 差異） |
| Rollback point | （填入可回滾版本或備份） |

## Verification

| Check | Result |
| --- | --- |
| `/healthz` | （填入結果） |
| `/healthz/readiness` | （填入結果） |
| Webhook test | （填入結果） |
| OAuth reconnect | （填入結果） |
| Credential decrypt | （填入結果） |
| Successful execution id | （填入 execution id） |
| User-facing confirmation | （填入確認方式） |

## Root Cause

| Type | Statement |
| --- | --- |
| Direct cause | （填入直接原因） |
| Contributing cause | （填入促成原因） |
| Detection gap | （填入為何沒有更早發現） |
| Recovery gap | （填入為何修復花費時間） |

## Prevention

| Action | Owner | Due date | Verification |
| --- | --- | --- | --- |
| （填入預防措施） | （填入負責人） | （填入日期） | （填入如何驗證） |

## Closure

| Field | Value |
| --- | --- |
| Final status | resolved / mitigated / monitoring |
| Follow-up owner | （填入負責人） |
| Follow-up location | （填入 issue、doc、runbook 連結） |
| Closed time | （填入 Asia/Taipei 時間） |
