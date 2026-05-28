#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputFile = path.join(rootDir, "reports/2026-05-28-n8n-deployment-complete-guide.html");

const metadata = {
  title: "[課程成果]搬家：n8n 部署全攻略",
  subtitle: "20 週逐步閱讀、製作與驗收的 n8n 部署課程成果報告",
  date: "2026-05-28",
  period: "2026/05/27-2026/05/28",
  category: "課程成果",
  client: "NUVA",
  clientGroup: "內部課程與技術導入",
  timeline: "2026 五月",
  tags: [
    "n8n",
    "部署",
    "Docker",
    "PostgreSQL",
    "Caddy",
    "PaaS",
    "AWS",
    "Runbook",
    "課程成果"
  ],
  thumbnail: "",
  visibility: "public"
};

const phases = [
  {
    id: "phase-1",
    label: "Phase 1",
    weeks: "Week 01-04",
    title: "部署判斷與 URL 基礎",
    summary: "先學會判斷 Cloud、local、VPS、PaaS、hyperscaler 的責任邊界，再把 state、DNS、public URL 與 proxy 概念放到同一張圖上。"
  },
  {
    id: "phase-2",
    label: "Phase 2",
    weeks: "Week 05-08",
    title: "本機實作到公開測試",
    summary: "從 Docker Desktop 開始做出可保留資料的本機 n8n，再比較 npm 與 container，最後用 tunnel 安全地練習 webhook。"
  },
  {
    id: "phase-3",
    label: "Phase 3",
    weeks: "Week 09-12",
    title: "低維運與雲端路線",
    summary: "把 n8n Cloud、VPS、PaaS、Cloud Run 與 AWS 類型平台放進同一個決策表，用成本、持久化與維運責任做選擇。"
  },
  {
    id: "phase-4",
    label: "Phase 4",
    weeks: "Week 13-16",
    title: "Production 維運能力",
    summary: "補齊資料庫、binary data、備份還原、更新、安全修補與 scaling gate，讓部署不是只停在能開機。"
  },
  {
    id: "phase-5",
    label: "Phase 5",
    weeks: "Week 17-20",
    title: "演練、成本、交接與導入",
    summary: "用 troubleshooting drill、cost-risk worksheet、可複製作品包與最終驗收，把學習成果轉成能交接的部署方法。"
  }
];

const weeks = [
  {
    number: "01",
    phase: "phase-1",
    doc: "docs/week-01-n8n-deployment-framework.md",
    title: "n8n 部署全景與決策框架",
    icon: "MAP",
    mission: "建立部署方式全貌，避免一開始就把問題簡化成 cloud 或 local 二選一。",
    read: [
      "n8n Cloud、Local Docker、Local npm、Local + Tunnel、VPS + Compose、PaaS、Hyperscaler、Kubernetes 的定位。",
      "state、public URL、maintenance responsibility、production readiness 四個判斷軸。",
      "為什麼能啟動服務，不等於可以長期承載 public webhook。"
    ],
    make: [
      "做出一頁部署選項矩陣。",
      "畫出需求判斷流程圖。",
      "建立風險詞彙表，至少涵蓋 uptime、public URL、persistence、patching、backup。"
    ],
    practice: [
      "先用矩陣回答：目前是學習、展示、個人 production、客戶交付，還是企業導入。",
      "每個部署選項都要指出誰負責資料、網路、安全與更新。",
      "用三分鐘說明 local Docker 為什麼適合學習，但不適合長期 production webhook。"
    ],
    acceptance: "能清楚說出各部署方式的責任分工，並用需求流程圖選出合理起點。",
    outputs: [
      "部署選項矩陣",
      "需求判斷流程圖",
      "風險詞彙表",
      "三分鐘驗收說明"
    ]
  },
  {
    number: "02",
    phase: "phase-1",
    doc: "docs/week-02-n8n-runtime-state-model.md",
    title: "n8n Runtime 與 State 模型",
    icon: "STATE",
    mission: "理解 n8n 不是單純的網頁服務，而是由 app、database、credentials、executions、binary data 與 environment 一起組成。",
    read: [
      "runtime process、editor UI、webhook endpoint、executions 與 credentials 的關係。",
      "SQLite 與 PostgreSQL 的差異，以及為什麼 production-like 部署要及早思考資料庫。",
      "N8N_ENCRYPTION_KEY、environment variables 與 volume 的責任。"
    ],
    make: [
      "整理 runtime state map。",
      "建立 state inventory，列出每一類資料的保存位置與遺失後果。",
      "寫出最小可用的 environment checklist。"
    ],
    practice: [
      "把 workflow、execution、credential、binary data 分別標到圖上。",
      "說明如果刪掉 volume、換掉 encryption key、換掉 database URL，會各自壞在哪裡。",
      "練習用 state inventory 檢查一個部署方案是否可交接。"
    ],
    acceptance: "能把 n8n 的 state 拆成可備份、可還原、可交接的項目，而不是只記得容器名稱。",
    outputs: [
      "Runtime state map",
      "State inventory",
      "Environment checklist",
      "風險說明表"
    ]
  },
  {
    number: "03",
    phase: "phase-1",
    doc: "docs/week-03-data-safety-foundation.md",
    title: "資料安全與持久化基礎",
    icon: "DATA",
    mission: "把資料安全從口號變成可檢查的 deployment baseline。",
    read: [
      "volume、database、credential encryption、backup、restore test 的基本關係。",
      "哪些資料是 workflow 能否重建的關鍵，哪些資料是營運稽核與追蹤需要保留的紀錄。",
      "資料安全不是只備份資料庫，也包含 key、env、binary data 與 reverse proxy state。"
    ],
    make: [
      "建立資料安全責任表。",
      "列出 backup target 與 restore target。",
      "寫出資料遺失情境與對應恢復動作。"
    ],
    practice: [
      "對每一個 state 項目標記 owner、backup cadence、restore proof。",
      "用一個 credential 遺失情境測試你是否能指出根因。",
      "把資料安全表接到 Week 14 的 runbook 預留欄位。"
    ],
    acceptance: "能用資料安全表回答：備份什麼、誰負責、多久一次、如何證明可還原。",
    outputs: [
      "資料安全責任表",
      "Backup target 清單",
      "Restore target 清單",
      "資料遺失情境表"
    ]
  },
  {
    number: "04",
    phase: "phase-1",
    doc: "docs/week-04-public-url-dns-proxy.md",
    title: "Public URL、DNS 與 Reverse Proxy",
    icon: "URL",
    mission: "弄懂瀏覽器能打開、webhook URL 正確、OAuth callback 正確、TLS 正確是四件不同的事。",
    read: [
      "A record、CNAME、domain、TLS、reverse proxy、forwarded headers 的分工。",
      "WEBHOOK_URL 與 N8N_PROXY_HOPS 在 proxy 後方的角色。",
      "secure cookie、wrong webhook URL、callback mismatch 的常見成因。"
    ],
    make: [
      "畫出 DNS 到 n8n container 的 request path。",
      "寫出 public URL readiness checklist。",
      "整理 proxy 風險表。"
    ],
    practice: [
      "從使用者 browser、外部 webhook provider、OAuth provider 三種角度走一次 URL path。",
      "檢查是否能說明 TLS terminates 在哪裡。",
      "列出 production URL 改名時必須同步修改的設定。"
    ],
    acceptance: "能把 URL 問題拆成 DNS、TLS、proxy headers、n8n webhook config 與 cookie policy 分別排查。",
    outputs: [
      "Request path 圖",
      "Public URL readiness checklist",
      "Proxy 風險表",
      "Webhook 與 OAuth 驗收題"
    ]
  },
  {
    number: "05",
    phase: "phase-2",
    doc: "docs/week-05-local-docker-desktop.md",
    title: "Local Docker Desktop 實作",
    icon: "DOCK",
    mission: "用 Docker Desktop 建出可重啟、可保留資料、可被初學者重做的本機 n8n。",
    read: [
      "Docker Desktop、Docker Engine、Docker CLI、Docker Compose 與 volume 的基本角色。",
      "本機持久化、container lifecycle、port mapping 與 health check。",
      "本機環境如何為後續 Compose、VPS 與 PaaS 做準備。"
    ],
    make: [
      "產出 Docker Desktop 檢查清單。",
      "建立 local n8n 啟動與重啟紀錄。",
      "整理本機資料保存、刪除與恢復的操作記錄。"
    ],
    practice: [
      "啟動 n8n，建立一個測試 workflow，重啟容器後確認資料仍在。",
      "用 docker volume 與 logs 找到 state 與錯誤訊息。",
      "把本機操作寫成下一位學員也能照做的步驟。"
    ],
    acceptance: "能證明本機 n8n 不是一次性開啟，而是有持久化與基本排錯能力的學習環境。",
    outputs: [
      "Docker Desktop 檢查清單",
      "Local runbook",
      "資料持久化驗收紀錄",
      "Week 05 handoff"
    ]
  },
  {
    number: "06",
    phase: "phase-2",
    doc: "docs/week-06-npm-vs-docker-single-container.md",
    title: "npm 與 Docker Single Container 比較",
    icon: "CMP",
    mission: "把啟動快慢、環境隔離、升級難度與可交接性放在同一張比較表。",
    read: [
      "npm install/start 與 Docker run 的差異。",
      "Node.js 版本、global package、local filesystem、container image 在維護上的影響。",
      "為什麼教學展示可以很快，但 production baseline 要更重視可重做。"
    ],
    make: [
      "建立 npm route 與 Docker route 對照表。",
      "寫出 single-container deployment limitation。",
      "整理從 Week 06 走向 Week 07 Compose 的升級理由。"
    ],
    practice: [
      "用同一組需求分別判斷 npm 與 Docker 的適用性。",
      "寫出 npm route 需要額外控管的 Node.js 與 package 風險。",
      "指出 single container 在 database、backup、reverse proxy 上的缺口。"
    ],
    acceptance: "能說明 Docker single container 為什麼比 npm 更可交接，也能說出它仍然不是完整 production 架構。",
    outputs: [
      "npm vs Docker 比較表",
      "Single-container limitation",
      "升級至 Compose 理由",
      "驗收問答"
    ]
  },
  {
    number: "07",
    phase: "phase-2",
    doc: "docs/week-07-docker-compose-postgresql.md",
    title: "Docker Compose + PostgreSQL",
    icon: "PG",
    mission: "把 n8n 與 PostgreSQL 拆成可重啟、可備份、可交接的本機 production-like baseline。",
    read: [
      "Compose service、network、volume、env file 與 dependency 的工作方式。",
      "PostgreSQL 作為正式資料庫時的環境變數與連線責任。",
      "為什麼 Compose file 本身就是交接文件的一部分。"
    ],
    make: [
      "建立 n8n + PostgreSQL Compose baseline。",
      "寫出 .env.example 與 secrets handling 說明。",
      "完成 DB persistence 與 restart 驗收。"
    ],
    practice: [
      "用 compose up/down 測試資料是否保留。",
      "確認 PostgreSQL volume 與 n8n volume 的用途不同。",
      "把 DB 連線失敗、env 缺漏、port conflict 寫進排錯筆記。"
    ],
    acceptance: "能用 Compose 重建 n8n + PostgreSQL，並證明 workflow 與 credentials 不會因重啟消失。",
    outputs: [
      "Compose baseline",
      ".env.example",
      "Persistence 驗收紀錄",
      "DB troubleshooting notes"
    ]
  },
  {
    number: "08",
    phase: "phase-2",
    doc: "docs/week-08-tunnel-public-webhook.md",
    title: "Tunnel 與 Public Webhook 測試",
    icon: "HOOK",
    mission: "用 tunnel 練習外部服務打進本機，但清楚標記它是測試工具，不是 production edge。",
    read: [
      "n8n tunnel、Cloudflare Quick Tunnel、ngrok 類型工具的用途與限制。",
      "random subdomain、callback URL、webhook URL 與測試有效期。",
      "為什麼公開測試與長期公開部署是不同層級。"
    ],
    make: [
      "建立 tunnel webhook 測試流程。",
      "整理 tunnel risk checklist。",
      "寫出 production 禁用條件與替代方案。"
    ],
    practice: [
      "建立一個 webhook workflow，讓外部請求打進本機。",
      "記錄 tunnel URL 更換後 workflow 或 provider 端要改哪些欄位。",
      "把測試完成後的清理動作寫入 checklist。"
    ],
    acceptance: "能成功做 public webhook 測試，也能明確說明為什麼 quick tunnel 不能當正式入口。",
    outputs: [
      "Tunnel webhook 測試流程",
      "Tunnel risk checklist",
      "Production 禁用條件",
      "清理與回復紀錄"
    ]
  },
  {
    number: "09",
    phase: "phase-3",
    doc: "docs/week-09-n8n-cloud-low-maintenance.md",
    title: "n8n Cloud 與低維運路線",
    icon: "CLOUD",
    mission: "把低維運的價值講清楚，並知道什麼情況下 Cloud 比 self-host 更合理。",
    read: [
      "n8n Cloud 的 managed hosting、OAuth、upgrade、monitoring 與 plan shape。",
      "Cloud 路線少了哪些 infra 責任，但仍保留 workflow governance、credential governance 與成本控管責任。",
      "beginner、非工程團隊與需要快速上線者的部署判斷。"
    ],
    make: [
      "建立 n8n Cloud evaluation sheet。",
      "整理 Cloud 適用與不適用情境。",
      "寫出 Cloud-first 的 30 天導入節奏。"
    ],
    practice: [
      "把一個真實需求放進 Cloud vs self-host 判斷表。",
      "估算 workflow executions、協作者、credential 管理與資料留存需求。",
      "列出從 Cloud 轉 self-host 時需要搬遷的決策項。"
    ],
    acceptance: "能說明低維運不是功能少，而是把 infra responsibility 交給平台，以換取速度與穩定性。",
    outputs: [
      "Cloud evaluation sheet",
      "Cloud 適用性表",
      "30 天導入節奏",
      "Cloud to self-host 決策項"
    ]
  },
  {
    number: "10",
    phase: "phase-3",
    doc: "docs/week-10-vps-docker-compose-caddy.md",
    title: "VPS + Docker Compose + Caddy",
    icon: "VPS",
    mission: "把 Week 07 的 Compose baseline 搬上 VPS，補上 domain、TLS、reverse proxy 與基本維運責任。",
    read: [
      "VPS 上的 OS、Docker、Compose、firewall、Caddy 與 domain 設定。",
      "Caddy 自動 TLS、reverse proxy headers 與 WEBHOOK_URL 的關係。",
      "self-hosted sweet spot 的成本、控制權與維護責任。"
    ],
    make: [
      "建立 VPS deployment checklist。",
      "產出 Caddyfile 與 Compose 部署骨架。",
      "完成 DNS/TLS/webhook readiness 驗收。"
    ],
    practice: [
      "從 DNS 指向 VPS，再由 Caddy proxy 到 n8n。",
      "設定 WEBHOOK_URL 與 N8N_PROXY_HOPS。",
      "用 health endpoint、browser、webhook provider 三個角度驗收。"
    ],
    acceptance: "能把 n8n 穩定放到自有 domain 後方，並知道 VPS 維運責任包含 OS、Docker、backup、security 與 updates。",
    outputs: [
      "VPS deployment checklist",
      "Caddyfile",
      "Compose deployment skeleton",
      "DNS/TLS/webhook 驗收紀錄"
    ]
  },
  {
    number: "11",
    phase: "phase-3",
    doc: "docs/week-11-paas-persistence-platforms.md",
    title: "PaaS、Persistence 與平台比較",
    icon: "PAAS",
    mission: "學會判斷 PaaS 是否真的適合 n8n，而不是只看它能不能按一下 deploy。",
    read: [
      "Railway、Render、Zeabur、Fly 類型平台的 persistent storage、managed database、custom domain 與 secrets 能力。",
      "ephemeral filesystem 對 n8n 的風險。",
      "PaaS 減少 VM 維運，但不會消除 state、backup、env、URL 與 cost 責任。"
    ],
    make: [
      "建立 PaaS platform comparison matrix。",
      "整理 persistence readiness checklist。",
      "寫出從 VPS baseline 移植到 PaaS 的注意事項。"
    ],
    practice: [
      "對每個平台確認 volume、PostgreSQL、secrets、domain、logs 與 backup。",
      "標記免費方案、休眠、冷啟動、磁碟限制與 outbound 限制。",
      "練習用同一份 n8n 需求排出平台優先順序。"
    ],
    acceptance: "能判斷 PaaS 部署是否具備 production-like persistence，而不是只有容器成功啟動。",
    outputs: [
      "PaaS 比較矩陣",
      "Persistence readiness checklist",
      "移植注意事項",
      "平台優先順序"
    ]
  },
  {
    number: "12",
    phase: "phase-3",
    doc: "docs/week-12-cloud-run-aws-hyperscaler.md",
    title: "Cloud Run、AWS 與 Hyperscaler 路線",
    icon: "HYPER",
    mission: "理解大型雲端平台的優勢、組裝成本與責任邊界，避免過早複雜化。",
    read: [
      "Cloud Run、AWS 類型平台中的 compute、managed database、secret manager、load balancer、storage 與 IAM。",
      "serverless container 與 stateful app 的張力。",
      "企業治理、VPC、IAM、audit、centralized logs 與成本治理。"
    ],
    make: [
      "建立 hyperscaler architecture option map。",
      "整理 Cloud Run/AWS route 的 cost-risk table。",
      "寫出何時不該使用 hyperscaler 的判斷。"
    ],
    practice: [
      "把 n8n 拆成 app、database、storage、secrets、public edge、logs、monitoring。",
      "對每一層指出可用 managed service 與維運責任。",
      "用企業需求判斷何時 hyperscaler 才值得。"
    ],
    acceptance: "能說明 hyperscaler 強在治理與整合，但沒有明確企業需求時，初期不一定比 VPS 或 n8n Cloud 更好。",
    outputs: [
      "Hyperscaler option map",
      "Cost-risk table",
      "不採用條件",
      "企業治理檢核表"
    ]
  },
  {
    number: "13",
    phase: "phase-4",
    doc: "docs/week-13-database-binary-capacity-planning.md",
    title: "Database、Binary Data 與容量規劃",
    icon: "CAP",
    mission: "把 n8n 的資料成長問題前置，避免 execution data 與 binary data 在 production 後才失控。",
    read: [
      "execution data retention、manual execution data、success/error execution logging 對 DB size 的影響。",
      "binary data storage mode、file size、object storage 與 memory/storage 壓力。",
      "capacity planning 的估算欄位：workflow 數、execution 數、binary payload、保留天數、成長率。"
    ],
    make: [
      "建立 database capacity worksheet。",
      "整理 binary data risk checklist。",
      "設定 retention 與 cleanup 的決策建議。"
    ],
    practice: [
      "估算一個每日 1,000 次 execution 的資料成長。",
      "區分 DB growth 與 binary data growth。",
      "把容量門檻接到 Week 16 scaling gate。"
    ],
    acceptance: "能用容量表回答 n8n 何時需要調整 execution retention、binary data storage 或 database plan。",
    outputs: [
      "Database capacity worksheet",
      "Binary data risk checklist",
      "Retention 建議",
      "Scaling gate input"
    ]
  },
  {
    number: "14",
    phase: "phase-4",
    doc: "docs/week-14-backup-restore-update-runbook.md",
    title: "Backup、Restore、Update Runbook",
    icon: "RUN",
    mission: "把備份、還原、更新與 rollback 寫成可演練的 SOP。",
    read: [
      "PostgreSQL dump、n8n data volume、Caddy state、env、encryption key 的備份責任。",
      "restore test 比 backup success 更重要。",
      "更新前檢查 release notes、先備份、維護窗口、驗收與 rollback。"
    ],
    make: [
      "完成 backup runbook。",
      "完成 restore drill。",
      "完成 update 與 rollback runbook。"
    ],
    practice: [
      "用 staging restore 證明備份可用。",
      "模擬更新失敗，寫出回復到前一版本的指令順序。",
      "把每個 runbook 加上 owner、頻率、驗收項與 log 欄位。"
    ],
    acceptance: "能在沒有原作者口頭補充的情況下完成備份、還原、更新與 rollback。",
    outputs: [
      "Backup runbook",
      "Restore drill",
      "Update runbook",
      "Rollback checklist"
    ]
  },
  {
    number: "15",
    phase: "phase-4",
    doc: "docs/week-15-security-responsibility-patch-cadence.md",
    title: "Security Responsibility 與 Patch Cadence",
    icon: "SEC",
    mission: "把 self-hosted 的安全責任拆清楚，建立固定修補節奏。",
    read: [
      "shared responsibility：平台、OS、Docker、n8n、database、credentials、workflow owner 分別負責什麼。",
      "n8n security audit、credential governance、public exposure 與 least privilege。",
      "patch cadence、release notes review、maintenance window 與 emergency update。"
    ],
    make: [
      "建立 security responsibility matrix。",
      "整理 patch cadence calendar。",
      "完成 security audit checklist。"
    ],
    practice: [
      "把每個安全項目指定 owner。",
      "檢查 credentials、users、webhook exposure、node usage、env secrets。",
      "建立每月更新節奏與緊急漏洞處理流程。"
    ],
    acceptance: "能明確說出 self-hosted n8n 的安全責任不是 n8n 官方單方面承擔，而是部署方必須維持的流程。",
    outputs: [
      "Security responsibility matrix",
      "Patch cadence calendar",
      "Security audit checklist",
      "Emergency update flow"
    ]
  },
  {
    number: "16",
    phase: "phase-4",
    doc: "docs/week-16-scaling-single-queue-workers.md",
    title: "Scaling：Single Instance、Queue 與 Workers",
    icon: "SCALE",
    mission: "學會先觀察瓶頸，再從 single instance 漸進到 queue mode，而不是一開始就追求複雜架構。",
    read: [
      "single main instance、webhook processors、queue mode、Redis、workers、PostgreSQL 的關係。",
      "active executions、p95 latency、DB connections、memory、CPU、queue backlog 的 scaling signal。",
      "N8N_ENCRYPTION_KEY 與 shared config 在多 worker 架構中的重要性。"
    ],
    make: [
      "建立 scaling decision tree。",
      "整理 single-instance tuning checklist。",
      "寫出 queue mode readiness checklist。"
    ],
    practice: [
      "先用 concurrency control 與 execution retention 降低壓力。",
      "列出導入 queue mode 前必須具備的 PostgreSQL、Redis、workers、logs、backup。",
      "把 scaling decision 接到 Week 18 cost-risk worksheet。"
    ],
    acceptance: "能說明何時留在 single instance，何時調整 concurrency，何時導入 queue mode 與 workers。",
    outputs: [
      "Scaling decision tree",
      "Single-instance tuning checklist",
      "Queue mode readiness checklist",
      "Scaling signals table"
    ]
  },
  {
    number: "17",
    phase: "phase-5",
    doc: "docs/week-17-troubleshooting-drills.md",
    title: "Troubleshooting Drills",
    icon: "FIX",
    mission: "把常見事故變成可練習的排錯劇本，讓 production 問題有路徑可走。",
    read: [
      "wrong webhook URL、DB connection failed、secure cookie error、credential lost、disk full、update failed 的典型症狀。",
      "logs、health endpoint、container status、database connectivity、DNS/TLS check 的排查順序。",
      "incident note、root cause、fix、prevention 的紀錄格式。"
    ],
    make: [
      "建立 troubleshooting drill table。",
      "整理 incident response checklist。",
      "完成常見錯誤的 symptom-to-root-cause map。"
    ],
    practice: [
      "針對每個 drill 寫出觀察、假設、驗證、修復、預防。",
      "把排錯流程控制在可交接的文字，而不是只靠操作人記憶。",
      "用至少三個情境做演練。"
    ],
    acceptance: "能在常見故障下快速定位到 URL、DB、cookie、storage、update 或 credential 類型問題。",
    outputs: [
      "Troubleshooting drill table",
      "Incident response checklist",
      "Symptom-to-root-cause map",
      "演練紀錄"
    ]
  },
  {
    number: "18",
    phase: "phase-5",
    doc: "docs/week-18-platform-selection-cost-risk.md",
    title: "平台選擇、成本與風險",
    icon: "RISK",
    mission: "把技術偏好轉成可討論的決策表，讓 cost、risk、maintenance、scale 一起被看見。",
    read: [
      "n8n Cloud、VPS、PaaS、Hyperscaler、Enterprise 的成本與責任差異。",
      "固定成本、用量成本、維運工時、事故成本、遷移成本。",
      "決策不只看月費，也看 owner 能力、SLA、RPO/RTO、資料治理與客戶要求。"
    ],
    make: [
      "建立 platform selection scorecard。",
      "完成 cost-risk worksheet。",
      "整理 platform recommendation memo。"
    ],
    practice: [
      "用同一個情境比較 Cloud、VPS、PaaS、AWS。",
      "把風險分成 technical、operational、financial、governance。",
      "寫出首選方案、替代方案、暫不採用方案與理由。"
    ],
    acceptance: "能用成本風險表支撐平台選擇，而不是只用熟悉度或價格直覺決策。",
    outputs: [
      "Platform selection scorecard",
      "Cost-risk worksheet",
      "Recommendation memo",
      "方案排序"
    ]
  },
  {
    number: "19",
    phase: "phase-5",
    doc: "docs/week-19-capstone-replicable-deployment-package.md",
    title: "Capstone：可複製部署作品包",
    icon: "PACK",
    mission: "把前 18 週的知識包成下一個人可以複製、部署、驗收與維護的作品包。",
    read: [
      "README、architecture、compose、env template、Caddyfile、backup/update/troubleshooting/runbook 的交接價值。",
      "作品包不是 demo 資料夾，而是可重建、可驗收、可維護的 deployment package。",
      "Gate 05 前的 capstone package acceptance。"
    ],
    make: [
      "建立 deployment package folder。",
      "補齊 README、architecture、compose、env template、Caddyfile、runbooks。",
      "建立 demo checklist 與 handoff notes。"
    ],
    practice: [
      "用全新環境閱讀 README，確認不靠口頭補充也能理解。",
      "跑一次 deployment checklist 與 rollback checklist。",
      "把每一個 artifact 對應到它解決的風險。"
    ],
    acceptance: "能交出可複製作品包，並讓接手者知道部署、設定、備份、更新、排錯與驗收順序。",
    outputs: [
      "Deployment package",
      "README",
      "Architecture notes",
      "Runbooks",
      "Demo checklist"
    ]
  },
  {
    number: "20",
    phase: "phase-5",
    doc: "docs/week-20-final-acceptance-next-stage.md",
    title: "期末驗收與下一階段導入排序",
    icon: "NEXT",
    mission: "把 20 週部署能力轉成下一階段導入判斷，回答為什麼選這條路、風險在哪、如何維運。",
    read: [
      "最終建議報告、90 天維運節奏、導入候選清單與 owner。",
      "Gate 05 final scorecard 與 3 小時成果交流 agenda。",
      "從部署完成走向組織導入時，owner、cadence、候選流程與驗收指標如何排序。"
    ],
    make: [
      "完成 final recommendation report。",
      "建立 90 天 maintenance cadence。",
      "整理 adoption candidates and owners。",
      "完成 final scorecard。"
    ],
    practice: [
      "用期末必答五題檢查整個部署方案。",
      "排出下一階段 90 天導入節奏。",
      "把候選 workflow 依風險、價值、owner 成熟度排序。"
    ],
    acceptance: "能把 20 週內容講成一個可落地的導入方案，並清楚安排下一階段責任與節奏。",
    outputs: [
      "Final recommendation report",
      "90 天維運節奏",
      "導入候選清單與 owner",
      "Gate 05 final scorecard",
      "成果交流 agenda"
    ]
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function compactId(value) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function sourceLink(docPath) {
  return `../${docPath}`;
}

function countLines(source) {
  const matches = source.match(/\n/g);
  return matches ? matches.length : 0;
}

function phaseById(id) {
  return phases.find((phase) => phase.id === id);
}

function pageNumber(index) {
  return `<span class="pgn">${String(index).padStart(2, "0")}</span>`;
}

function renderPhaseCards() {
  return phases
    .map((phase) => {
      const weekLinks = weeks
        .filter((week) => week.phase === phase.id)
        .map((week) => `<a href="#week-${week.number}">W${week.number}</a>`)
        .join("");

      return `
        <article class="phase-card">
          <div class="phase-topline">
            <span>${escapeHtml(phase.label)}</span>
            <strong>${escapeHtml(phase.weeks)}</strong>
          </div>
          <h3>${escapeHtml(phase.title)}</h3>
          <p>${escapeHtml(phase.summary)}</p>
          <div class="week-links">${weekLinks}</div>
        </article>`;
    })
    .join("");
}

function renderWeekMiniMap() {
  return weeks
    .map((week) => {
      const phase = phaseById(week.phase);
      return `
        <a class="week-mini" href="#week-${week.number}">
          <span>${week.number}</span>
          <strong>${escapeHtml(week.title)}</strong>
          <em>${escapeHtml(phase.label)}</em>
        </a>`;
    })
    .join("");
}

function renderFlowDiagram() {
  return `
    <div class="flow-row">
      <div class="flow-node">
        <span>01</span>
        <strong>讀</strong>
        <p>先看本週任務、關鍵概念與原始講義全文。</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-node">
        <span>02</span>
        <strong>做</strong>
        <p>依照交付物清單做出可保存的文件、設定或演練紀錄。</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-node">
        <span>03</span>
        <strong>驗</strong>
        <p>用 acceptance criteria 檢查是否能被下一週接住。</p>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-node">
        <span>04</span>
        <strong>交</strong>
        <p>把成果放進 handoff、runbook 或作品包，留下 owner 與證據。</p>
      </div>
    </div>`;
}

function renderDecisionLadder() {
  return `
    <div class="ladder">
      <div><span>Learn</span><strong>Local Docker Desktop</strong><p>學概念、保留資料、建立本機操作信心。</p></div>
      <div><span>Test</span><strong>Local + Tunnel</strong><p>短期測試 webhook 與 OAuth callback，不當 production edge。</p></div>
      <div><span>Launch</span><strong>n8n Cloud or VPS</strong><p>低維運優先 Cloud；需要控制權則用 VPS + Compose。</p></div>
      <div><span>Operate</span><strong>Backup, Security, Scale</strong><p>用 runbook、patch cadence、capacity gate 管理長期風險。</p></div>
      <div><span>Grow</span><strong>PaaS, Hyperscaler, Queue</strong><p>在需求證明後擴展，不用一開始過度工程。</p></div>
    </div>`;
}

function renderReportTable(headers, rows, className = "") {
  return `
    <table class="report-table ${className}">
      <thead>
        <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>`;
}

function renderCodeBlock(value, className = "") {
  return `<pre class="command-block ${className}"><code>${escapeHtml(value.trim())}</code></pre>`;
}

function renderChapterShell(week, pageIndex, chapterLabel, sectionTitle, body, id = "") {
  const phase = phaseById(week.phase);
  const idAttr = id ? ` id="${escapeAttr(id)}"` : "";
  return `
    <section class="page chapter-page"${idAttr}>
      <div class="rh">
        <span>${escapeHtml(metadata.title)}</span>
        <span>${escapeHtml(phase.weeks)}</span>
      </div>
      <div class="chapter-head">
        <span>${escapeHtml(chapterLabel)}</span>
        <h2>${sectionTitle}</h2>
      </div>
      ${body}
      ${pageNumber(pageIndex)}
    </section>`;
}

function renderWeekOneChapter(week, startIndex) {
  const source = "docs/week-01-n8n-deployment-framework.md";
  const pages = [];

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["一頁部署選項矩陣", "完成", "1.3", "能快速比較 Cloud、local、VPS、PaaS、hyperscaler、Kubernetes 的定位。"],
      ["一張需求判斷流程圖", "完成", "1.4", "能從需求回答走到合理部署路線。"],
      ["一份風險詞彙表", "完成", "1.5", "至少涵蓋 uptime、public URL、persistence、patching、backup。"],
      ["三分鐘驗收說明", "完成", "1.6", "能說清楚 local Docker 適合學習，但不適合長期 public webhook production。"]
    ]
  );

  pages.push(renderChapterShell(
    week,
    startIndex,
    "Chapter 1 · Week 01",
    "n8n 部署全景與決策框架",
    `
      <div class="chapter-summary">
        <div class="week-icon">MAP</div>
        <div>
          <p class="kicker">1.0 本週定位</p>
          <p>第一週的任務，是先回答「n8n 到底有哪些部署方式，為什麼不能只問 cloud 還是 local？」這不是實作指令週，而是部署決策週。你要先看懂每種部署路線背後的責任邊界，再決定後續要往本機、Cloud、VPS、PaaS 或企業雲端走。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">1.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週已完成三個主要交付物與一個口頭驗收稿。閱讀時請把它們視為同一套決策工具：先用矩陣比較部署方式，再用流程圖選路線，最後用風險詞彙表檢查自己是否漏掉 production responsibility。</p>
          ${deliverables}
        </div>
      </section>
      <div class="note-band">
        <strong>本週學習目標</strong>
        <p>不要急著把 n8n 跑起來。先學會判斷部署路線，因為後面每一週的 Docker、PostgreSQL、Tunnel、VPS、PaaS、backup、security、scaling 都會回到這張 Week 01 決策地圖。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-01"
  ));

  const officialSources = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "n8n 建議多數 self-hosting 使用 Docker；self-hosting 需要能管理伺服器、容器、資源、擴展與安全。",
        "Docker 是主要 self-hosting 路線；缺乏維運經驗時，n8n 建議使用 n8n Cloud。",
        "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker Installation</a>"
      ],
      [
        "n8n Cloud 是託管方案，主打免技術設定與維護、uptime monitoring、managed OAuth、one-click upgrades。",
        "這是 beginner 與低維運團隊的低風險起點。",
        "<a href=\"https://docs.n8n.io/choose-n8n/cloud/\">n8n Cloud Overview</a>"
      ],
      [
        "self-hosted n8n 預設使用 SQLite 儲存 credentials、past executions、workflows，也支援 PostgreSQL。",
        "production-like 部署應優先把資料庫責任納入設計。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">n8n Supported Databases</a>"
      ],
      [
        "反向代理後需要明確設定 public webhook URL，並處理 proxy hops。",
        "<code>WEBHOOK_URL</code> 與 <code>N8N_PROXY_HOPS=1</code> 是 webhook 與 OAuth URL 正確性的核心。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Webhook URL with Reverse Proxy</a>"
      ],
      [
        "n8n 內建 tunnel 僅供本機開發與測試，不適合 production。",
        "不能把隨機或開發 tunnel 當長期 public edge。",
        "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker Installation</a>"
      ],
      [
        "Cloudflare Quick Tunnels 僅供 testing and development；production 應使用 remotely-managed tunnel。",
        "Quick Tunnel 的 random subdomain 不適合長期 callback。",
        "<a href=\"https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/\">Cloudflare Quick Tunnels</a>"
      ],
      [
        "Docker Desktop 包含 Docker Engine、Docker CLI、Docker Compose。",
        "這就是 Week 05 本機實作採用 Docker Desktop 的原因。",
        "<a href=\"https://docs.docker.com/desktop/\">Docker Desktop Docs</a>"
      ],
      [
        "n8n queue mode 透過 worker instances 擴展，並可加入 webhook processors 作為下一層 scaling。",
        "這是 Week 16 的內容，本週只放入決策圖，不提前實作。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">n8n Queue Mode</a>"
      ],
      [
        "self-hosted n8n 必須保持版本更新。",
        "patching 是 public self-hosted 的基本責任。",
        "<a href=\"https://docs.n8n.io/hosting/installation/updating/\">Update self-hosted n8n</a>"
      ],
      [
        "Railway、Render、Zeabur、Fly 均提供某種 persistent storage 或 managed database 能力，但使用方式與限制不同。",
        "PaaS 可行性取決於 volume、database、domain、TLS 與 secrets 是否正確配置。",
        "<a href=\"https://docs.railway.com/data-storage\">Railway</a> · <a href=\"https://render.com/docs/disks\">Render</a> · <a href=\"https://zeabur.com/docs/en-US/get-started/best-practices\">Zeabur</a> · <a href=\"https://fly.io/docs/database-storage-guides/\">Fly</a>"
      ]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 1,
    "Chapter 1 · Section 1.2",
    "官方來源核對",
    `
      <section class="chapter-section full">
        <div class="section-number">1.2</div>
        <div>
          <h3>官方來源核對</h3>
          <p>本週只採用官方文件作為事實基礎，避免把部落格、二手整理或平台行銷話術直接當成部署決策。讀這一節時，請把每一列當成後續章節的判斷前提。</p>
          ${officialSources}
        </div>
      </section>
    `
  ));

  const deploymentMatrix = renderReportTable(
    ["部署選項", "最適合情境", "State 層", "Public URL", "維運責任", "Production 判斷", "第一週結論"],
    [
      ["n8n Cloud", "初學者、非工程團隊、想專注做 workflow 而不是管伺服器", "n8n 管理", "n8n 管理", "最低，主要是 workflow 與帳號治理", "是，視 plan 與功能需求而定", "最低風險起點。若沒有明確 self-host 理由，應優先評估。"],
      ["Local Docker Desktop", "學習、練習、短期 prototype、本機測試", "Docker volume 或本機 <code>.n8n</code>", "無；只在 localhost", "使用者本機", "否", "適合學習 n8n 概念與本機持久化，不適合長期公開 webhook。"],
      ["Local npm", "快速看 editor、一次性測試、教學展示", "本機 <code>.n8n</code>", "無；只在 localhost", "使用者本機與 Node.js 環境", "否", "啟動最快，但環境隔離與長期維護弱於 Docker。"],
      ["Local + Tunnel", "本機測試外部 webhook、短期 demo、OAuth callback 實驗", "本機 Docker volume 或 <code>.n8n</code>", "tunnel provider 提供", "使用者本機加 tunnel provider", "通常否", "可學習 public webhook，但 random 或 quick tunnel 不能當長期 production edge。"],
      ["VPS + Docker Compose", "個人 production、小團隊、freelancer、需要穩定 domain 與完整控制", "PostgreSQL 加 Docker volumes", "自有 domain 加 reverse proxy", "使用者負責 OS、Docker、n8n、DB、backup、security", "是", "self-hosted sweet spot。複雜度可控，責任也明確。"],
      ["PaaS container platform", "想減少 Linux server 維運，但仍想 self-host container", "managed Postgres 加 persistent volume", "平台 domain 或 custom domain", "平台負責部分 infra，使用者負責 app config、storage、secrets、backup 策略", "有條件是", "可行，但必須先確認 storage 非 ephemeral。不能只看部署成功。"],
      ["Hyperscaler managed stack", "已在 AWS/GCP/Azure、有 IAM、合規、內網、企業治理需求", "managed DB、secret manager、object storage", "load balancer 或 managed ingress", "shared responsibility，架構與成本較高", "是", "強大但組裝成本高。沒有治理或規模需求時，不是第一週建議起點。"],
      ["Kubernetes / GKE / EKS / AKS", "已有 Kubernetes 團隊、需要多環境、HA、標準化平台能力", "managed DB、PVC、secret manager", "ingress controller 或 load balancer", "最高，需要平台工程能力", "是", "不應作為初學起點。只有既有平台能力或明確 HA 需求時才合理。"]
    ],
    "matrix-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 2,
    "Chapter 1 · Section 1.3",
    "交付物一：部署選項矩陣",
    `
      <section class="chapter-section full">
        <div class="section-number">1.3</div>
        <div>
          <h3>一頁部署選項矩陣</h3>
          <p>第一週的核心判斷不是「哪個平台最好」，而是「哪個平台的責任剛好匹配目前需求」。n8n Cloud 把最多維運責任交給 n8n；local Docker 把學習成本降到最低；VPS + Compose 在控制、成本與理解度之間取得平衡；PaaS 用平台能力換取部分維運簡化；hyperscaler 與 Kubernetes 則用複雜度換取企業級控制。</p>
          ${deploymentMatrix}
        </div>
      </section>
      <div class="three-rules">
        <div><strong>01</strong><span>能啟動 n8n，不等於 state 已經安全。</span></div>
        <div><strong>02</strong><span>有 HTTPS，不等於 webhook 與 OAuth callback URL 一定正確。</span></div>
        <div><strong>03</strong><span>可以 public access，不等於適合 production exposure。</span></div>
      </div>
    `
  ));

  const decisionRules = renderReportTable(
    ["問題", "如果答案是「是」", "如果答案是「否」"],
    [
      ["只是學習嗎？", "用 Local Docker Desktop，先理解 state 與 workflow。", "繼續問是否需要 public access 與 production 責任。"],
      ["需要長期 public webhook 嗎？", "需要穩定 domain、HTTPS、<code>WEBHOOK_URL</code>、backup、patching。", "可以先留在 localhost 或短期 tunnel。"],
      ["想避免伺服器維運嗎？", "優先看 n8n Cloud 或 PaaS。", "可以評估 VPS + Compose。"],
      ["需要 host-level control 嗎？", "self-host 比 Cloud 更合理。", "Cloud 通常是更穩的低維運路線。"],
      ["是否已有雲端平台治理需求？", "可以進 AWS/GCP/Azure managed stack。", "不要為了看起來正式而過早採用 hyperscaler。"],
      ["是否已有 Kubernetes 操作能力？", "Kubernetes 可被列入長期架構。", "不把 Kubernetes 當第一階段部署方案。"]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 3,
    "Chapter 1 · Section 1.4",
    "交付物二：需求判斷流程圖",
    `
      <section class="chapter-section full">
        <div class="section-number">1.4</div>
        <div>
          <h3>需求判斷流程</h3>
          <p>使用這張流程時，不要從平台名稱開始選，而是從需求責任開始問。每一個答案都會把你推向更合適的部署路線。</p>
          <div class="decision-chain">
            <div><span>Start</span><strong>我要部署 n8n</strong></div>
            <div><span>Learn</span><strong>只學習或 prototype</strong><em>Local Docker Desktop</em></div>
            <div><span>Demo</span><strong>需要短期外部 webhook</strong><em>Local + development tunnel</em></div>
            <div><span>Ops</span><strong>想避免伺服器維運</strong><em>n8n Cloud 或 PaaS</em></div>
            <div><span>Control</span><strong>需要完整控制權</strong><em>VPS + Compose + PostgreSQL</em></div>
            <div><span>Enterprise</span><strong>已有雲端治理或平台團隊</strong><em>Hyperscaler 或 Kubernetes</em></div>
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 4,
    "Chapter 1 · Section 1.4 continued",
    "需求判斷流程圖：使用規則",
    `
      <section class="chapter-section full">
        <div class="section-number">1.4</div>
        <div>
          <h3>流程圖使用規則</h3>
          <p>這張表把流程圖中的關鍵分岔整理成可操作的問題。每次評估一個 n8n 部署需求，都先逐列回答，再把答案對應回部署選項。</p>
          ${decisionRules}
        </div>
      </section>
    `
  ));

  const coreRiskTerms = renderReportTable(
    ["詞彙", "本週定義", "常見錯誤", "正確判斷", "第一個檢查點"],
    [
      ["uptime", "n8n 可以被使用者、外部服務或排程穩定觸發的時間比例。", "以為本機能跑就等於服務穩定。", "本機 uptime 等於電腦、網路、Docker、睡眠設定都穩定；正式使用要看平台與維運能力。", "服務是否依賴個人電腦開機與網路？"],
      ["public URL", "外部服務、OAuth provider、使用者實際看到並呼叫的 n8n 網址。", "用 <code>localhost</code>、random tunnel URL 或錯誤 proxy host 設 webhook。", "production webhook 需要穩定、可預期、HTTPS 的 public URL。", "<code>WEBHOOK_URL</code> 與 <code>N8N_EDITOR_BASE_URL</code> 是否等於外部看到的網址？"],
      ["persistence", "workflow、credentials、executions、binary data、community nodes、設定能否在重啟、redeploy、換機後保留。", "只看到容器啟動，沒有確認 volume 或 DB。", "production-like 部署要明確設計 database、volume、encryption key。", "重建 container 後資料是否還在？"],
      ["patching", "持續更新 n8n、OS、container image、proxy、database 的安全與相容性責任。", "以為 automation tool 裝好後可以不更新。", "public self-hosted instance 必須有固定更新節奏與 rollback 方法。", "目前 n8n 版本、image tag、更新流程是否記錄？"],
      ["backup", "可以在資料遺失、升級失敗、主機故障後恢復 n8n 的完整資料集合與流程。", "只備份 workflow JSON，忘了 DB、volume、encryption key。", "backup 至少要涵蓋 database、n8n volume、encryption key、Compose/env/proxy config。", "是否做過 restore drill，而不是只有 backup 檔？"]
    ],
    "risk-table"
  );

  const extendedRiskTerms = renderReportTable(
    ["詞彙", "本週定義", "決策影響"],
    [
      ["state layer", "n8n 依賴的資料層，包含 DB、volume、binary data、credential encryption key。", "決定 local、VPS、PaaS、cloud stack 是否可靠。"],
      ["public edge", "接收 internet traffic 的入口，可能是 tunnel、reverse proxy、platform ingress、load balancer。", "決定 HTTPS、headers、domain、firewall、exposure risk。"],
      ["shared responsibility", "平台與使用者各自負責的維運邊界。", "Cloud 責任較少，VPS 責任較多，PaaS 介於兩者之間。"],
      ["ephemeral filesystem", "redeploy 或 restart 後可能消失的檔案系統。", "對 n8n 是高風險，因為 user folder 與 community nodes 可能需要持久化。"],
      ["stable callback", "OAuth 或 webhook provider 設定中可長期使用、不會隨機改變的 callback URL。", "影響 tunnel 是否可用、domain 是否必買、production 是否穩定。"],
      ["scaling path", "從單機到 PostgreSQL、Redis queue、worker、webhook processor 的漸進路線。", "防止太早 Kubernetes，也防止單機過載後沒有升級路線。"],
      ["cost model", "plan、execution、RAM、CPU、storage、egress、always-on 的計價方式。", "PaaS 與 hyperscaler 必須估算使用量，不能只看起始價格。"],
      ["recovery point", "發生事故時可以回復到哪個時間點的資料。", "決定 backup 頻率與是否需要 managed DB snapshot。"],
      ["recovery time", "發生事故後多久可以恢復服務。", "決定 Cloud、VPS、PaaS 或 managed stack 是否符合業務要求。"],
      ["security perimeter", "public exposure、login、2FA、SSO、firewall、proxy、secret handling 的整體邊界。", "public self-hosted n8n 的風險遠高於 local-only instance。"]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 5,
    "Chapter 1 · Section 1.5",
    "交付物三：風險詞彙表",
    `
      <section class="chapter-section full">
        <div class="section-number">1.5</div>
        <div>
          <h3>必備風險詞彙</h3>
          <p>這些詞不是背誦用，而是部署前的檢查語言。只要你開始談 production，就要能用這些詞拆解責任。</p>
          ${coreRiskTerms}
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 6,
    "Chapter 1 · Section 1.5 continued",
    "風險詞彙表：擴充詞彙",
    `
      <section class="chapter-section full">
        <div class="section-number">1.5</div>
        <div>
          <h3>擴充風險詞彙</h3>
          <p>這些詞會在後續週次反覆出現。Week 01 先建立語言，後面再把它們落到 Docker、PostgreSQL、Tunnel、VPS、PaaS、backup 與 scaling 的具體操作。</p>
          ${extendedRiskTerms}
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 7,
    "Chapter 1 · Section 1.6",
    "驗收條件：三分鐘說明稿",
    `
      <section class="chapter-section">
        <div class="section-number">1.6</div>
        <div>
          <h3>三分鐘驗收說明稿</h3>
          <div class="script-box">
            <p>Local Docker 適合學習，但不適合長期 public webhook production。Local Docker Desktop 是很好的 n8n 學習起點，因為它能用最少設定讓使用者看見 n8n editor、建立 workflow、測試 credential，並透過 Docker volume 學到「資料需要持久化」這件事。它也比 npm 更接近正式部署，因為 container、port mapping、volume、image tag 這些概念會延伸到 Docker Compose 與 VPS。</p>
            <p>但 local Docker 不適合長期 public webhook production，原因有五個。第一，uptime 依賴個人電腦；只要電腦睡眠、關機、網路斷線、Docker Desktop 停止，webhook 就無法被外部服務觸發。第二，localhost 不是外部服務可以長期呼叫的 public URL；如果透過 tunnel 補上 public access，random 或 development tunnel 又會帶來 URL 不穩定、callback 變動與 production exposure 的問題。第三，本機環境通常沒有正式的 reverse proxy、TLS、firewall、monitoring、alerting 與 backup discipline。第四，production n8n 要保護 database、volume、encryption key 與 workflow execution data，本機測試環境很容易漏掉 restore drill。第五，公開 self-hosted n8n 必須持續 patch，local Docker 學習環境通常沒有明確的更新、rollback 與安全責任分工。</p>
            <p>所以 Week 01 的結論是：local Docker 適合學習 n8n 如何運作，也適合作為 Week 05 到 Week 08 的實作基礎；但只要需求變成長期 public webhook、OAuth callback、多人使用、客戶服務或營運流程，部署路線就要升級到 n8n Cloud、VPS + Docker Compose + PostgreSQL + reverse proxy，或具備 persistent storage 與 managed database 的 PaaS。</p>
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 8,
    "Chapter 1 · Section 1.7",
    "本週決策地圖",
    `
      <section class="chapter-section">
        <div class="section-number">1.7</div>
        <div>
          <h3>本週決策地圖</h3>
          <div class="route-map">
            <div><span>Learning Need</span><strong>Local Docker</strong><p>先理解 n8n editor、workflow、credential、volume 與 state。</p></div>
            <div><span>State</span><strong>Understand State</strong><p>確認資料不只在 container 裡，還包含 DB、volume、key 與 binary data。</p></div>
            <div><span>Public URL</span><strong>Understand Public URL</strong><p>釐清 localhost、tunnel、domain、reverse proxy、callback 的差異。</p></div>
            <div><span>Production</span><strong>Long-term Public Webhook?</strong><p>若答案是 yes，就要選 Cloud、VPS、PaaS 或 managed stack。</p></div>
            <div><span>Operate</span><strong>Backup + Patching</strong><p>正式路線必須能回答 backup、restore、update、monitoring 與 rollback。</p></div>
          </div>
        </div>
      </section>
    `
  ));

  const recommendation = renderReportTable(
    ["使用者型態", "第一週推薦路線", "理由"],
    [
      ["完全初學者", "n8n Cloud 或 Local Docker Desktop", "Cloud 降低維運風險；Local Docker 建立技術理解。"],
      ["想做個人自動化", "Local Docker Desktop 開始，之後依 public webhook 需求進 VPS 或 PaaS", "不先過度設計，保留升級路徑。"],
      ["需要長期 webhook 的 freelancer", "VPS + Docker Compose + PostgreSQL + reverse proxy", "成本、控制與可理解性平衡。"],
      ["想少管伺服器的小團隊", "n8n Cloud 或 PaaS container platform", "維運責任較低，但 PaaS 必須確認 persistence。"],
      ["已有企業雲端治理需求的團隊", "Hyperscaler managed stack", "IAM、network、secrets、logging、compliance 可整合。"],
      ["已有 Kubernetes 團隊", "Kubernetes 可列入長期選項", "只有既有平台能力時才值得承擔複雜度。"]
    ],
    "compact-table"
  );

  const completion = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 01 計畫要求", "通過"],
      ["已核對官方來源", "通過"],
      ["已完成部署選項矩陣", "通過"],
      ["已完成需求判斷流程圖", "通過"],
      ["已完成風險詞彙表", "通過"],
      ["已完成三分鐘驗收說明", "通過"],
      ["未把後續週次內容提前實作", "通過"],
      ["未使用未核對的第三方平台宣稱作為核心依據", "通過"]
    ],
    "check-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 9,
    "Chapter 1 · Section 1.8",
    "第一週結論與推薦路線",
    `
      <section class="chapter-section">
        <div class="section-number">1.8</div>
        <div>
          <h3>第一週結論</h3>
          <p>本週完成的判斷是：n8n 部署不是二選一題，而是責任分配題。最重要的五個變數是 uptime、public URL、persistence、patching、backup。只要其中任何一項變成 production requirement，local-only 或 random tunnel setup 就不能被視為正式部署。</p>
          <h3 class="subsection-title">推薦路線</h3>
          ${recommendation}
          <div class="note-band">
            <strong>下一週銜接</strong>
            <p>Week 02 會進入「n8n 如何運作」，把本週 decision matrix 往下拆到 application、database、credentials、executions、binary data、public URL 的關係。Week 01 不實作部署指令，因為本週的工作是防止一開始選錯路線。</p>
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 10,
    "Chapter 1 · Section 1.9",
    "第一週完成檢查",
    `
      <section class="chapter-section">
        <div class="section-number">1.9</div>
        <div>
          <h3>第一週完成檢查</h3>
          ${completion}
        </div>
      </section>
    `
  ));

  return pages;
}

function renderWeekTwoChapter(week, startIndex) {
  const source = "docs/week-02-n8n-runtime-state-model.md";
  const pages = [];

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["n8n runtime architecture 圖", "完成", "2.3", "能看懂 browser、public edge、n8n process、database、user folder、binary data、external APIs 的關係。"],
      ["state inventory 表", "完成", "2.4", "能逐項說明 workflow、credential、execution history、binary data、<code>.n8n</code>、encryption key 的保存位置與備份責任。"],
      ["credential-loss 風險說明卡", "完成", "2.5", "能判斷 credentials 為什麼會在換容器、換主機、換 volume 或換 encryption key 時失效。"],
      ["驗收說明", "完成", "2.6", "能解釋為什麼換容器或換主機時，保存 encryption key 與 volume 不是可選項。"]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex,
    "Chapter 2 · Week 02",
    "n8n 如何運作：Runtime 與 State Model",
    `
      <div class="chapter-summary">
        <div class="week-icon">STATE</div>
        <div>
          <p class="kicker">2.0 本週定位</p>
          <p>Week 02 的核心問題是：n8n 的 application、database、credentials、executions、binary data、public URL 如何互相影響？這一週要把 n8n 從「一個可以打開的 UI」拆成 runtime process、state layer、public edge 與 external integrations。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">2.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週所有產出都在回答同一件事：換容器、換主機、換資料庫或換 URL 時，哪些東西不能丟。請先看交付物，再回到後面每一張 state 圖與 inventory 表。</p>
          ${deliverables}
        </div>
      </section>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Week 01 教你選路線；Week 02 開始拆「搬家清單」。如果你只能記一句話：n8n container 可以重建，但 n8n state 不能靠重建補回。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-02"
  ));

  const officialSources = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "self-hosted n8n 預設使用 SQLite，資料庫儲存 credentials、past executions、workflows，也支援 PostgreSQL。",
        "database 是 n8n state layer 的核心，不是附屬品。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">n8n Supported Databases</a>"
      ],
      [
        "n8n 會在使用者的 <code>.n8n</code> 資料夾保存 user-specific data，例如 encryption key、SQLite database file、tunnel ID。",
        "<code>.n8n</code> 不是暫存目錄，對本機與 Docker volume 都是關鍵。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/user-folder/\">Specify user folder path</a>"
      ],
      [
        "Docker 安裝範例會把 <code>n8n_data</code> volume 掛到 <code>/home/node/.n8n</code>，用來在 container restart 後保留資料。",
        "container 本身可重建，但 volume 不可隨便丟。",
        "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker Installation</a>"
      ],
      [
        "n8n 第一次啟動會產生 random encryption key 並保存在 <code>~/.n8n</code>；credentials 在存進 database 前會用這個 key 加密。",
        "資料庫和 encryption key 必須成對保存。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/\">Set a custom encryption key</a>"
      ],
      [
        "<code>N8N_ENCRYPTION_KEY</code> 可提供自訂 key；queue mode 下所有 workers 都必須指定同一個 encryption key。",
        "多 process 或 worker 架構更不能讓 key 漂移。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/\">Encryption key</a> · <a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>"
      ],
      [
        "<code>N8N_EDITOR_BASE_URL</code> 是使用者可存取 editor 的 public URL，也用於 email 與 SAML redirect URL。",
        "public URL 不只影響瀏覽器，也影響身份驗證與通知連結。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">Deployment environment variables</a>"
      ],
      [
        "reverse proxy 後需設定 <code>WEBHOOK_URL</code>，並設定 <code>N8N_PROXY_HOPS=1</code>，讓 n8n 註冊正確 webhook URL。",
        "public edge 與 n8n process 的內外網址不一致時，必須顯式設定。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Configure webhook URLs with reverse proxy</a>"
      ],
      [
        "execution data 會讓 database 成長；n8n 建議不要保存不必要資料，並啟用 pruning。",
        "execution history 是容量與隱私風險來源。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>"
      ],
      [
        "binary data 位置依版本與 <code>N8N_DEFAULT_BINARY_DATA_MODE</code> 設定而定；memory mode 可能因大檔案造成 crash，v2 breaking changes 說 regular mode 預設 filesystem、queue mode 預設 database。",
        "不能在文件裡把 binary data 永遠寫死在單一位置。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data scaling</a> · <a href=\"https://docs.n8n.io/2-0-breaking-changes/\">n8n v2.0 breaking changes</a>"
      ],
      [
        "community nodes 安裝在硬碟；Docker 重建或升級時若沒有保存 <code>~/.n8n/nodes</code>，可能出現 missing packages。",
        "custom/community nodes 也屬於 state inventory。",
        "<a href=\"https://docs.n8n.io/integrations/community-nodes/troubleshooting/\">Community nodes troubleshooting</a>"
      ]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 1,
    "Chapter 2 · Section 2.2",
    "官方來源核對",
    `
      <section class="chapter-section full">
        <div class="section-number">2.2</div>
        <div>
          <h3>官方來源核對</h3>
          <p>本週只採用官方文件作為事實基礎。尤其是 state 與 encryption key，不能靠印象處理。每一列都是後面「搬家清單」的依據。</p>
          ${officialSources}
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 2,
    "Chapter 2 · Section 2.3",
    "Runtime Architecture：單一 Instance",
    `
      <section class="chapter-section full">
        <div class="section-number">2.3</div>
        <div>
          <h3>單一 instance 的核心運作</h3>
          <p>n8n 的 browser/editor 與 webhook endpoint 都會回到同一個 application process；process 再讀寫 database、user folder、binary data storage，並呼叫 external APIs。credential records 在 database 裡，但解密依賴 encryption key。</p>
          <div class="runtime-diagram single-instance">
            <div class="diagram-card actor">User browser<br><span>editor UI</span></div>
            <div class="diagram-card actor">External services<br><span>webhook endpoint</span></div>
            <div class="diagram-arrow">→</div>
            <div class="diagram-card process">n8n application process<br><span>runtime / workflow executor</span></div>
            <div class="diagram-arrow">→</div>
            <div class="diagram-stack">
              <div>Database<br><span>workflows · encrypted credentials · executions</span></div>
              <div>.n8n user folder / volume<br><span>key · settings · local files</span></div>
              <div>Binary data storage<br><span>files · payloads · attachments</span></div>
              <div>External APIs<br><span>OAuth · API calls · integrations</span></div>
            </div>
          </div>
          <div class="state-equation">
            <span>Workflows</span>
            <span>Credentials</span>
            <span>Executions</span>
            <span>Binary Data</span>
            <strong>= n8n State</strong>
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 3,
    "Chapter 2 · Section 2.3 continued",
    "Runtime Architecture：Docker 單機學習模式",
    `
      <section class="chapter-section full">
        <div class="section-number">2.3</div>
        <div>
          <h3>Docker 單機學習模式</h3>
          <p>Docker learning mode 的重點是：container 可以刪掉重建，但 <code>n8n_data</code> volume 不可以被當成暫存物。若使用預設 SQLite，database file 與 encryption key 都會落在 <code>.n8n</code> 這個 state boundary 裡。</p>
          <div class="mini-architecture">
            <div>Host machine</div>
            <span>localhost:5678</span>
            <div>n8n container</div>
            <span>mount</span>
            <div>n8n_data volume<br><small>/home/node/.n8n</small></div>
            <span>contains</span>
            <div>key · SQLite · settings</div>
          </div>
        </div>
      </section>
      <div class="tip-callout">
        <strong>小補充</strong>
        <p>這就是為什麼 Week 05 做 Docker Desktop 時，驗收重點不是「n8n 打得開」，而是「container 重建後，volume 裡的 workflow 與 credential probe 還在」。</p>
      </div>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 4,
    "Chapter 2 · Section 2.3 continued",
    "Runtime Architecture：Production-shaped self-hosted",
    `
      <section class="chapter-section full">
        <div class="section-number">2.3</div>
        <div>
          <h3>Production-shaped self-hosted 模式</h3>
          <p>Production-shaped 模式要把三層分清楚：public edge 負責接 internet traffic，n8n application process 負責執行 workflow，state layer 負責保存 workflow、credential、execution、binary data 與 encryption material。三層任何一層錯，都會讓同一個 workflow 呈現不同錯誤。</p>
          <div class="three-layer-map">
            <div><span>Public Edge</span><strong>Reverse proxy / ingress</strong><p>domain、TLS、headers、WEBHOOK_URL、N8N_EDITOR_BASE_URL。</p></div>
            <div><span>Application</span><strong>n8n process</strong><p>執行 workflow、接 webhook、呼叫 external APIs。</p></div>
            <div><span>State Layer</span><strong>PostgreSQL + volume + binary storage</strong><p>保存 workflows、credentials、executions、key、files。</p></div>
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 5,
    "Chapter 2 · Section 2.3 continued",
    "Runtime Architecture：Queue Mode 的概念位置",
    `
      <section class="chapter-section full">
        <div class="section-number">2.3</div>
        <div>
          <h3>Queue mode 的概念位置</h3>
          <p>Queue mode 是 Week 16 才深入的擴展主題。本週只建立一個基本觀念：只要同一個 n8n deployment 有多個 main 或 worker process，所有 process 都必須共享能讀取 credentials 的同一組 encryption key，並共同指向一致的 database state。</p>
          <div class="queue-map">
            <div class="diagram-card actor">Webhook or timer</div>
            <div class="diagram-arrow">→</div>
            <div class="diagram-card process">n8n main instance</div>
            <div class="diagram-arrow">→</div>
            <div class="diagram-card storage">Redis queue</div>
            <div class="diagram-arrow">→</div>
            <div class="worker-stack">
              <div>Worker instance 1</div>
              <div>Worker instance 2</div>
            </div>
          </div>
          <div class="shared-state-band">
            <span>Shared database</span>
            <span>Same N8N_ENCRYPTION_KEY</span>
            <span>Redis queue</span>
          </div>
          <div class="tip-callout">
            <strong>小補充</strong>
            <p>Queue mode 不是「加幾台機器」這麼簡單。worker 能不能跑，取決於它是否能讀到同一個 database、同一個 queue，以及同一把 key。</p>
          </div>
        </div>
      </section>
    `
  ));

  const stateInventoryA = renderReportTable(
    ["State 項目", "主要用途", "典型保存位置", "可否重建", "遺失後影響", "第一備份責任"],
    [
      ["Workflows", "保存節點、連線、trigger、workflow 設定與版本內容。", "n8n database：預設 SQLite，production 常用 PostgreSQL。", "可從 export 或 source control 部分重建，但不是完整替代 database。", "workflow 消失、trigger 不存在、團隊無法編輯或執行既有流程。", "database backup；另可搭配 workflow export。"],
      ["Credentials", "保存 API key、OAuth token、database password 等敏感連線資料。", "n8n database 中的 encrypted credentials。", "不能靠 workflow JSON 完整重建；通常要重新授權或重新輸入。", "workflow 仍在，但節點無法連外部服務；OAuth integration 失效。", "database backup 加同一個 encryption key。"],
      ["Encryption key", "解密 credentials 與敏感資料的 master key 或 instance key。", "<code>~/.n8n</code> settings file，或以 <code>N8N_ENCRYPTION_KEY</code> 環境變數注入。", "不可等價重建；新 key 不能解舊資料。", "database 還在但 credentials 無法解密，等同 credential loss。", "secret manager、<code>.env</code> 安全備份、deployment config。"],
      ["Executions", "保存 workflow run 的狀態、輸入輸出、錯誤與除錯資訊。", "n8n database；保存量受 execution settings 與 pruning 影響。", "歷史紀錄不可完整重建。", "無法追蹤歷史錯誤、稽核與除錯資訊消失。", "database backup；同時設定 pruning 策略。"],
      ["Binary data", "工作流處理的檔案，例如圖片、PDF、文件、音訊。", "依版本與 <code>N8N_DEFAULT_BINARY_DATA_MODE</code>：memory、filesystem、database、S3-compatible storage。", "通常不可重建，除非來源系統仍保留原檔。", "文件處理 workflow 失敗，歷史 execution 的檔案參照失效。", "依實際 mode 備份 volume、database 或 external storage。"]
    ],
    "inventory-table"
  );

  const stateInventoryB = renderReportTable(
    ["State 項目", "主要用途", "典型保存位置", "可否重建", "遺失後影響", "第一備份責任"],
    [
      ["<code>.n8n</code> user folder", "保存 user-specific data，例如 encryption key、SQLite database file、tunnel ID、settings、部分本機資料。", "Linux/macOS 常見為 <code>~/.n8n</code>；Docker official path 為 <code>/home/node/.n8n</code>，通常掛 volume。", "不可當成純 cache。", "使用預設 SQLite 時可能同時失去 database 與 encryption key。", "Docker volume backup 或 host folder backup。"],
      ["Community nodes", "自行安裝的 community node packages。", "<code>~/.n8n/nodes</code> 等本機硬碟位置。", "可重新安裝，但版本與啟動時間會有風險。", "workflow 找不到 node package，啟動或執行失敗。", "保存 <code>.n8n/nodes</code> 或記錄版本並配置 reinstall 策略。"],
      ["Environment variables", "控制 DB、URL、execution、binary data、security、proxy、feature flags。", "<code>.env</code>、平台 env settings、secret manager、container config。", "可重建，但前提是有文件與 secret。", "public URL 錯、DB 連不上、credentials 無法解密、binary data mode 改變。", "deployment config backup 與 secret manager。"],
      ["Public URL settings", "讓 n8n 產生正確 editor links、webhook URL、email link、SAML/OAuth redirect。", "<code>N8N_EDITOR_BASE_URL</code>、<code>WEBHOOK_URL</code>、<code>N8N_HOST</code>、<code>N8N_PROTOCOL</code>、<code>N8N_PROXY_HOPS</code>。", "可修正，但錯誤期間會造成 integration 失敗。", "webhook 註冊錯誤、OAuth callback mismatch、email 或 SAML redirect 錯誤。", "<code>.env</code>、reverse proxy config、DNS 記錄。"],
      ["Reverse proxy config", "TLS termination、domain routing、forwarded headers、public edge。", "Caddyfile、Nginx config、Traefik labels、platform ingress settings。", "可重建，但需知道 domain 與 headers。", "HTTPS、webhook、OAuth、UI 存取錯誤。", "proxy config backup 與 DNS 記錄。"]
    ],
    "inventory-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 6,
    "Chapter 2 · Section 2.4",
    "State Inventory：核心資料項目",
    `
      <section class="chapter-section full">
        <div class="section-number">2.4</div>
        <div>
          <h3>核心 State Inventory 上半部</h3>
          <p>這張表是 Week 02 最重要的搬家清單。每一個 state 項目都要回答：用途是什麼、存在哪裡、能不能重建、遺失後會怎樣、誰要備份。</p>
          ${stateInventoryA}
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 7,
    "Chapter 2 · Section 2.4 continued",
    "State Inventory：設定、URL 與 Proxy",
    `
      <section class="chapter-section full">
        <div class="section-number">2.4</div>
        <div>
          <h3>核心 State Inventory 下半部</h3>
          <p>n8n 的 state 不只在 database。user folder、community nodes、environment variables、public URL 與 proxy config 都會影響「搬家後能不能照常運作」。</p>
          ${stateInventoryB}
        </div>
      </section>
    `
  ));

  const priorityRows = renderReportTable(
    ["優先級", "State", "原因"],
    [
      ["P0", "Encryption key", "沒有同一把 key，encrypted credentials 可能無法解密。"],
      ["P0", "Database", "workflows、credentials、executions 的主要保存地。"],
      ["P0", "<code>.n8n</code> volume 或 user folder", "預設 SQLite、settings、generated encryption key、community nodes 都可能在這裡。"],
      ["P1", "Environment variables and secrets", "決定 database、URL、binary data、security 與 worker 是否正確。"],
      ["P1", "Reverse proxy and DNS config", "決定 public access、OAuth、webhook URL 是否正確。"],
      ["P1", "Binary data storage", "檔案型 workflow 與 execution data 需要它才能完整回復。"],
      ["P2", "Workflow exports", "可當輔助備份，但不能取代 database 與 credentials。"],
      ["P2", "Screenshots and manual setup notes", "可協助人工恢復，但不是正式 backup。"]
    ],
    "compact-table"
  );

  const boundaryRows = renderReportTable(
    ["情境", "需要保存什麼", "不保存會怎樣"],
    [
      ["只刪除並重建 Docker container", "保留 <code>n8n_data</code> volume；若使用 external DB，也要保留 DB 連線與 encryption key。", "container 會回來，但 workflows、credentials 或 SQLite DB 可能消失。"],
      ["從 SQLite 搬到 PostgreSQL", "保存舊 SQLite database、encryption key、migration/export 流程、volume。", "credentials 可能不可讀，workflow migration 不完整。"],
      ["從一台 VPS 搬到另一台 VPS", "搬 database、<code>.n8n</code> volume、<code>N8N_ENCRYPTION_KEY</code>、env、proxy、DNS。", "新主機能啟動 n8n，但舊 credentials、webhook URL 或 binary data 失效。"],
      ["PaaS redeploy", "確認 database 是 managed 或 volume 持久化，確認 env secrets 沒有變。", "service 看似 redeploy 成功，但 state 被重置。"],
      ["加入 queue workers", "所有 main 與 workers 使用同一 database、Redis、<code>N8N_ENCRYPTION_KEY</code>。", "worker 拿到 execution ID 卻無法讀取或解密 workflow credential。"],
      ["改變 binary data mode", "記錄舊 mode，確保舊資料仍能被讀取或遷移。", "historical execution 的 binary references 可能無法被 pruning 或讀取。"]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 8,
    "Chapter 2 · Section 2.4 continued",
    "State Inventory：優先保護順序",
    `
      <section class="chapter-section full">
        <div class="section-number">2.4</div>
        <div>
          <h3>優先保護順序</h3>
          <p>保護順序的重點是先保住不可等價重建的東西。workflow export 很有用，但它不能取代 database、encryption key 與 volume。</p>
          ${priorityRows}
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 9,
    "Chapter 2 · Section 2.4 continued",
    "State Inventory：State Boundary 判斷表",
    `
      <section class="chapter-section full">
        <div class="section-number">2.4</div>
        <div>
          <h3>State Boundary 判斷表</h3>
          <p>這張表把常見遷移、重建與擴展情境拆成「要保存什麼」與「不保存會怎樣」。這就是 Week 03 備份責任表的前置資料。</p>
          ${boundaryRows}
        </div>
      </section>
    `
  ));

  function riskCard(title, rows) {
    return `
      <article class="risk-card">
        <h3>${title}</h3>
        ${renderReportTable(["欄位", "說明"], rows, "risk-card-table")}
      </article>`;
  }

  pages.push(renderChapterShell(
    week,
    startIndex + 10,
    "Chapter 2 · Section 2.5",
    "Credential-loss 風險說明卡 I",
    `
      <section class="chapter-section full">
        <div class="section-number">2.5</div>
        <div>
          <h3>風險卡 01-02</h3>
          <p>Credential loss 通常不是「credential 不見了」這麼單純，而是 database、key、volume、URL 或 storage 其中一層失配。</p>
          <div class="risk-card-grid">
            ${riskCard("風險卡 01：Database 在，key 不在", [
              ["症狀", "workflows 還在，credential records 也可能還在 database 裡，但節點授權失敗或 credential 無法正常使用。"],
              ["根因", "n8n credentials 存入 database 前會用 encryption key 加密；換了 key，就不能等價解舊資料。"],
              ["高風險動作", "刪掉 <code>.n8n</code> folder、換 Docker volume、換 VPS 沒帶 <code>N8N_ENCRYPTION_KEY</code>、PaaS 重建 env secrets。"],
              ["預防", "production-like deployment 一律顯式設定 <code>N8N_ENCRYPTION_KEY</code>，並放在 secret manager 或安全的 <code>.env</code> 備份中。"],
              ["修復", "找回原 key；若找不回，只能重新建立或重新授權 credentials。"],
              ["驗收句", "database backup 沒有 encryption key，不是完整 backup。"]
            ])}
            ${riskCard("風險卡 02：Key 在，database 不在", [
              ["症狀", "n8n 能啟動，key 也正確，但 workflow、credential、execution history 不存在。"],
              ["根因", "database 是 workflows、credentials、past executions 的主要保存地；只有 key 沒有資料可解。"],
              ["高風險動作", "SQLite database file 隨 <code>.n8n</code> 消失、PostgreSQL volume 被刪、PaaS 沒有 managed DB 或 persistent volume。"],
              ["預防", "使用 PostgreSQL 時安排 database backup；使用 SQLite 學習時保留整個 <code>.n8n</code> volume。"],
              ["修復", "還原 database backup，再使用同一把 key 啟動。"],
              ["驗收句", "encryption key 是鑰匙，database 是保險箱；兩者缺一個都不能恢復 credential state。"]
            ])}
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 11,
    "Chapter 2 · Section 2.5 continued",
    "Credential-loss 風險說明卡 II",
    `
      <section class="chapter-section full">
        <div class="section-number">2.5</div>
        <div>
          <h3>風險卡 03-04</h3>
          <div class="risk-card-grid">
            ${riskCard("風險卡 03：Volume 在，但 public URL 設錯", [
              ["症狀", "workflow 與 credentials 都存在，但 webhook 或 OAuth callback 失敗。"],
              ["根因", "n8n process 內部可能只知道 <code>localhost:5678</code>，但外部服務需要看到 <code>https://n8n.example.com</code>。"],
              ["高風險動作", "加 reverse proxy 或 tunnel 後，沒設定 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>。"],
              ["預防", "public edge 一變，就同步檢查 n8n public URL env vars、OAuth provider callback、proxy headers。"],
              ["修復", "設定正確 public URL，重新註冊或更新外部服務 webhook/OAuth callback。"],
              ["驗收句", "state 正確只能保證資料還在，不能保證外部世界打得到正確入口。"]
            ])}
            ${riskCard("風險卡 04：Binary data storage 漂移", [
              ["症狀", "workflow history 還在，但歷史 execution 的檔案、圖片、PDF 或附件讀不到；或大檔 workflow 不穩定。"],
              ["根因", "binary data 位置依 <code>N8N_DEFAULT_BINARY_DATA_MODE</code> 與 n8n 版本而定，可能在 memory、filesystem、database 或 S3-compatible storage。"],
              ["高風險動作", "改 binary data mode、換 worker/queue mode、只備份 DB 但漏備 volume 或 external storage。"],
              ["預防", "在 deployment inventory 中記錄實際 binary data mode，並把對應 storage 納入 backup。"],
              ["修復", "回復原 storage mode 與資料位置；若原始 binary files 已遺失，只能從外部來源重跑或重新上傳。"],
              ["驗收句", "binary data 不是「一定在 database」或「一定在 volume」，它必須按實際設定檢查。"]
            ])}
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 12,
    "Chapter 2 · Section 2.5 continued",
    "Credential-loss 風險說明卡 III",
    `
      <section class="chapter-section full">
        <div class="section-number">2.5</div>
        <div>
          <h3>風險卡 05：Community nodes 消失</h3>
          ${riskCard("風險卡 05：Community nodes 消失", [
            ["症狀", "n8n 啟動後提示 missing packages，或 workflow 裡的 community node 無法載入。"],
            ["根因", "community nodes 安裝在 hard disk；Docker 重建或升級時如果沒保存 <code>~/.n8n/nodes</code>，package 可能消失。"],
            ["高風險動作", "沒有掛載 <code>.n8n</code> volume、清空 node package folder、PaaS filesystem 是 ephemeral。"],
            ["預防", "保存 <code>~/.n8n/nodes</code>，或清楚記錄 community node package 與版本。"],
            ["修復", "還原 nodes folder 或重新安裝相同 packages。"],
            ["驗收句", "workflow JSON 只能描述 node，用不到 node package 時照樣跑不起來。"]
          ])}
          <div class="tip-callout">
            <strong>視覺化總結</strong>
            <p>Credential 能不能恢復，不是只看 credential record。你需要 database、同一把 encryption key、正確 volume、正確 public URL、正確 binary storage 與必要 node packages 一起到位。</p>
          </div>
        </div>
      </section>
    `
  ));

  pages.push(renderChapterShell(
    week,
    startIndex + 13,
    "Chapter 2 · Section 2.6",
    "驗收條件說明",
    `
      <section class="chapter-section">
        <div class="section-number">2.6</div>
        <div>
          <h3>題目</h3>
          <p>為什麼換容器或換主機時，保存 encryption key 與 volume 不是可選項？</p>
          <div class="script-box">
            <p>換容器或換主機時，保存 encryption key 與 volume 不是可選項，因為 n8n 不是無狀態 web app。n8n 的 database 會保存 workflows、credentials 和 past executions；credentials 在進 database 前會用 encryption key 加密；<code>.n8n</code> user folder 或 Docker volume 又可能保存 generated encryption key、SQLite database file、settings、tunnel ID 和 community nodes。這代表 container image 本身只是一個可重建的 application package，真正能讓舊 workflow 繼續工作的，是 database、volume、encryption key 與 deployment config。</p>
            <p>如果只搬 database、不搬 encryption key，encrypted credentials 可能無法解密。反過來，如果只搬 key、不搬 database，workflow、credential records 和 execution history 都不在。若只搬 database 和 key，但漏掉 <code>.n8n</code> volume、binary data storage、community nodes 或 public URL settings，則可能出現檔案遺失、node package missing、webhook URL 錯誤或 OAuth callback mismatch。這就是為什麼 Week 02 的核心結論是：n8n 遷移與備份要以 state inventory 為單位，不是以 container 為單位。</p>
          </div>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">2.6</div>
        <div>
          <h3>30 秒版本</h3>
          <div class="note-band">
            <strong>短答</strong>
            <p>n8n container 可以重建，但 n8n state 不能靠重建補回。database 保存 workflows、credentials、executions；encryption key 決定 credentials 能不能被解密；<code>.n8n</code> volume 可能保存 SQLite、key、settings 和 community nodes。因此換容器或換主機時，database、volume、encryption key、env 與 public URL config 必須一起管理。</p>
          </div>
        </div>
      </section>
    `
  ));

  const practicalChecklist = renderReportTable(
    ["檢查項", "通過標準"],
    [
      ["Database type 已知", "明確知道目前是 SQLite 還是 PostgreSQL。"],
      ["<code>.n8n</code> 位置已知", "明確知道 host path、Docker volume 或 <code>N8N_USER_FOLDER</code>。"],
      ["Encryption key 已保存", "production-like deployment 有固定 <code>N8N_ENCRYPTION_KEY</code>，不是只靠未備份的 generated key。"],
      ["Credential restore 路徑已知", "能說明 credentials 需要 database 加同一把 key。"],
      ["Execution data policy 已知", "知道是否保存成功/失敗/手動 execution，以及 pruning 設定。"],
      ["Binary data mode 已知", "知道實際 <code>N8N_DEFAULT_BINARY_DATA_MODE</code> 與對應 storage。"],
      ["Public URL 已知", "<code>N8N_EDITOR_BASE_URL</code> 與 <code>WEBHOOK_URL</code> 對得上外部可見網址。"],
      ["Reverse proxy hops 已知", "behind reverse proxy 時有設定 <code>N8N_PROXY_HOPS</code> 與 forwarded headers。"],
      ["Community nodes 已盤點", "若有使用 community nodes，知道 package 保存位置與版本。"],
      ["Migration bundle 已定義", "搬家時至少包含 database、volume、encryption key、env、proxy/DNS、binary storage。"]
    ],
    "compact-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 14,
    "Chapter 2 · Section 2.7",
    "Week 02 實務檢查表",
    `
      <section class="chapter-section full">
        <div class="section-number">2.7</div>
        <div>
          <h3>實務檢查表</h3>
          <p>這張表可以直接拿來檢查任何一個 n8n deployment。只有全部通過，才可以說自己知道這個 instance 的 state 在哪裡。</p>
          ${practicalChecklist}
          <div class="migration-bundle">
            <span>Migration Bundle</span>
            <strong>database + volume + encryption key + env + proxy/DNS + binary storage</strong>
          </div>
        </div>
      </section>
    `
  ));

  const completion = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 02 計畫要求", "通過"],
      ["已核對官方來源", "通過"],
      ["已完成 n8n runtime architecture 圖", "通過"],
      ["已完成 state inventory 表", "通過"],
      ["已完成 credential-loss 風險說明卡", "通過"],
      ["已完成驗收說明", "通過"],
      ["已處理 binary data 版本差異，不寫死單一保存位置", "通過"],
      ["未把 Week 05 或 Week 07 的部署實作提前執行", "通過"]
    ],
    "check-table"
  );

  pages.push(renderChapterShell(
    week,
    startIndex + 15,
    "Chapter 2 · Sections 2.8-2.9",
    "完成檢查與下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">2.8</div>
        <div>
          <h3>Week 02 完成檢查</h3>
          ${completion}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">2.9</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 03 會進入「資料保存與安全基礎」，把本週的 state inventory 轉成 SQLite vs PostgreSQL、最小備份組合與 binary-heavy workflow 風險。Week 02 的輸出會直接成為 Week 03 的備份責任表基礎。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>n8n 的搬家不是 container 搬家，而是 state 搬家。能啟動新容器，只代表 application package 回來了；能解密 credentials、保留 executions、讀到 binary data、維持 webhook URL，才代表真正搬完。</p>
          </div>
        </div>
      </section>
    `
  ));

  return pages;
}

function renderWeekThreeChapter(week, startIndex) {
  const source = "docs/week-03-data-safety-foundation.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["SQLite vs PostgreSQL 決策表", "完成", "3.3", "能說明 SQLite 適合學習與單機低風險使用，PostgreSQL 適合 production-like self-hosted 部署。"],
      ["最小備份組合 checklist", "完成", "3.4", "能列出 production self-host n8n 的最小備份內容：database、volume、encryption key、Compose/env/proxy config。"],
      ["binary-heavy workflow 注意事項", "完成", "3.5", "能判斷 binary data mode、容量、queue mode、pruning 與 external storage 的影響。"],
      ["驗收說明", "完成", "3.6", "能在 60 秒內列出 production self-host n8n 的最小備份內容與理由。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 3 · Week 03",
    "資料保存與安全基礎",
    `
      <div class="chapter-summary">
        <div class="week-icon">DATA</div>
        <div>
          <p class="kicker">3.0 本週定位</p>
          <p>Week 03 的核心問題是：SQLite、PostgreSQL、volume、binary data、encryption key 各自承擔什麼責任？這週把 Week 02 的 state inventory 轉成資料安全與備份判斷，開始回答 production self-host n8n 到底要備份什麼。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">3.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週的交付物是一套資料安全基礎：先選資料庫，再定義最小備份組合，最後把 binary-heavy workflow 的額外風險補進去。</p>
          ${deliverables}
        </div>
      </section>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Week 03 開始，請不要再把「有 workflow JSON」當成「有備份」。production recovery 看的是 recovery bundle，不是單一 export。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-03"
  );

  const sourceRowsA = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "self-hosted n8n 預設使用 SQLite；SQLite 會保存 credentials、past executions、workflows；n8n 也支援 PostgreSQL。",
        "database 是 workflows、credentials、executions 的主要保存地。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">Supported databases and settings</a>"
      ],
      [
        "SQLite database file 位置是 <code>~/.n8n/database.sqlite</code>。",
        "若使用 Docker 預設 volume，這個檔案會落在 container 的 <code>/home/node/.n8n</code> 對應 volume 中。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">Supported databases and settings</a>"
      ],
      [
        "n8n database env vars 使用 <code>DB_TYPE=sqlite</code> 或 <code>DB_TYPE=postgresdb</code>；MySQL/MariaDB 已 deprecated。",
        "Week 03 決策表只比較 SQLite 與 PostgreSQL。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">Database environment variables</a>"
      ],
      [
        "n8n CLI 可 export entities，支援從 SQLite 匯出並匯入到 Postgres；execution history data tables 預設排除，因為可能很大。",
        "CLI export 是遷移與輔助備份工具，不等於完整基礎設施備份。",
        "<a href=\"https://docs.n8n.io/hosting/cli-commands/\">CLI commands</a>"
      ],
      [
        "workflow JSON 可匯出/匯入；匯出的 workflow JSON 會包含 credential names 和 IDs。",
        "workflow export 是輔助備份，不可當成完整 credential backup。",
        "<a href=\"https://docs.n8n.io/workflows/export-import/\">Export and import workflows</a>"
      ],
      [
        "credentials 可用 CLI export；<code>--decrypted</code> 會輸出明文敏感資料。",
        "明文 credential export 只應作為受控遷移手段，不應成為一般備份習慣。",
        "<a href=\"https://docs.n8n.io/hosting/cli-commands/\">CLI commands</a>"
      ]
    ],
    "compact-table"
  );

  const sourceRowsB = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "execution data 會讓 database 成長；n8n 建議不要保存不必要 execution data，並啟用 pruning；SQLite pruning 後磁碟空間不一定立即釋放，可用 <code>DB_SQLITE_VACUUM_ON_STARTUP</code> 或 manual VACUUM。",
        "execution retention 是 storage 與隱私管理議題。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>"
      ],
      [
        "binary data 是檔案型資料，例如 image 或 document；大型 binary data 若留在 memory 可能造成 crash；可用 <code>N8N_DEFAULT_BINARY_DATA_MODE=filesystem</code> 讓資料存到 disk。",
        "binary-heavy workflow 必須檢查 storage mode 與容量。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data scaling</a>"
      ],
      [
        "queue mode 不支援 filesystem binary data storage；queue mode 文件也不建議 SQLite database。",
        "需要 worker/queue 時，Week 03 的資料層建議必須升級。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>"
      ],
      [
        "binary data environment variables 文件仍列出 memory/default 模式；v2 breaking changes 說 v2 起 regular mode 使用 filesystem、queue mode 使用 database，且 <code>N8N_AVAILABLE_BINARY_DATA_MODES</code> 會移除。",
        "文件不得寫死「永遠 memory」或「永遠 filesystem」，必須要求檢查實際版本與 <code>N8N_DEFAULT_BINARY_DATA_MODE</code>。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/binary-data/\">Binary data environment variables</a> · <a href=\"https://docs.n8n.io/2-0-breaking-changes/\">n8n v2.0 breaking changes</a>"
      ],
      [
        "S3 external storage for binary data 是 Self-hosted Enterprise 功能；n8n 支援 AWS S3，其他 S3-compatible service 可用但不屬官方支援。",
        "不能把 S3 external storage 當所有 self-hosted 方案的預設選項。",
        "<a href=\"https://docs.n8n.io/hosting/scaling/external-storage/\">External storage for binary data</a>"
      ],
      [
        "source control / environments 不會同步 credentials 與 variable values 到 Git。",
        "Git/source control 不是 credential backup。",
        "<a href=\"https://docs.n8n.io/source-control-environments/understand/environments/\">Environments in n8n</a>"
      ]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 3 · Section 3.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">3.2</div>
        <div>
          <h3>官方來源核對：Database、CLI 與 Export</h3>
          <p>本週只採用官方文件作為事實基礎。資料保存與備份不能靠平台印象或「應該會在某處」來判斷。</p>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">3.2</div>
        <div>
          <h3>官方來源核對：Execution、Binary Data 與 Source Control</h3>
          <p>這一頁補上資料成長、binary data mode、queue mode 與 source control 邊界。這些都是 Week 03 不能被簡化的資料安全細節。</p>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  const dbDecisionTable = renderReportTable(
    ["判斷維度", "SQLite", "PostgreSQL", "Week 03 結論"],
    [
      ["預設性", "self-hosted n8n 沒有設定 database 時的預設。", "需要明確設定 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_*</code>。", "初學可以接受預設；正式環境應主動選擇。"],
      ["保存內容", "保存 credentials、past executions、workflows。", "同樣保存 credentials、past executions、workflows。", "兩者都不是「只放設定」；都是核心 state。"],
      ["檔案位置", "<code>~/.n8n/database.sqlite</code>。Docker 中通常在 <code>/home/node/.n8n</code> volume。", "外部 PostgreSQL server、managed DB 或 Compose 裡的 postgres volume。", "SQLite 備份常和 <code>.n8n</code> volume 綁一起；PostgreSQL 要有 DB backup 策略。"],
      ["適合情境", "本機學習、短期測試、低風險單 instance。", "production-like self-hosted、VPS、PaaS、multi-worker、可恢復性要求高的情境。", "只要進入長期 public automation，PostgreSQL 優先。"],
      ["備份方式", "備份 <code>.n8n</code> folder 或 SQLite file，停機/一致性要小心。", "<code>pg_dump</code>、managed DB backup、snapshot、PITR 視平台能力。", "PostgreSQL 的備份與還原流程更適合長期維運。"],
      ["execution data 成長", "pruning 後空間可能被重用而非立即釋放；可能需 VACUUM。", "可搭配成熟 DB 維運、監控與容量管理。", "execution retention policy 對 SQLite 更容易變成隱性磁碟問題。"],
      ["queue mode", "官方文件不建議 queue mode 搭配 SQLite。", "queue mode 的合理資料庫基礎。", "想走 scaling path，就不要停在 SQLite。"],
      ["搬遷能力", "可用 CLI export entities 作為 SQLite 到 Postgres 的遷移工具。", "可作為遷移目標，也可再用 DB backup/restore 管理。", "遷移前要保留 encryption key 和完整備份。"],
      ["操作複雜度", "最低，幾乎不需另外管理 DB。", "需要 DB 帳密、權限、連線、backup、監控。", "初期省事，後期可能把風險留到事故時才爆出來。"],
      ["production 建議", "不建議作為嚴肅 production default。", "建議作為 meaningful self-hosted default。", "Week 03 的標準建議：production self-host 以 PostgreSQL 為基準。"]
    ],
    "decision-table"
  );

  addPage(
    "Chapter 3 · Section 3.3",
    "交付物一：SQLite vs PostgreSQL 決策表",
    `
      <section class="chapter-section full">
        <div class="section-number">3.3</div>
        <div>
          <h3>一頁決策表</h3>
          <p>這張表的重點不是說 SQLite 不好，而是把它放在正確位置：學習、短期測試、低風險單 instance。只要進入長期 public automation，PostgreSQL 就應該成為 production-like baseline。</p>
          ${dbDecisionTable}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.3 continued",
    "SQLite vs PostgreSQL：決策流程",
    `
      <section class="chapter-section full">
        <div class="section-number">3.3</div>
        <div>
          <h3>決策流程圖</h3>
          <div class="db-flow">
            <div><span>Start</span><strong>選擇 n8n database</strong></div>
            <div><span>Learn</span><strong>只是本機學習或短期測試？</strong><p>是：SQLite 可接受。</p></div>
            <div><span>Production</span><strong>長期 workflow / public webhook / team usage？</strong><p>是：PostgreSQL。</p></div>
            <div><span>Recovery</span><strong>需要備份還原演練？</strong><p>是：PostgreSQL。</p></div>
            <div><span>Scale</span><strong>需要 queue mode 或 workers？</strong><p>PostgreSQL + Redis + shared encryption key。</p></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.3 continued",
    "SQLite vs PostgreSQL：不可犯錯的判斷",
    `
      <section class="chapter-section full">
        <div class="section-number">3.3</div>
        <div>
          <h3>不可犯錯的判斷</h3>
          <div class="mistake-grid">
            <div>SQLite 不是「沒有資料庫」；它就是資料庫，只是以檔案形式存在。</div>
            <div>PostgreSQL 不只是為了效能；它也是為了備份、遷移、監控、可靠性與 scaling path。</div>
            <div>workflow JSON export 不能取代 database backup。</div>
            <div>source control 不同步 credentials 和 variable values；Git 不是完整 recovery plan。</div>
            <div>PostgreSQL backup 沒有 encryption key，credentials 仍可能不可用。</div>
          </div>
        </div>
      </section>
    `
  );

  const minBackupRowsA = renderReportTable(
    ["必備等級", "備份項目", "為什麼必備", "最低可接受形式", "驗收方式"],
    [
      ["P0", "Database", "保存 workflows、encrypted credentials、past executions。", "PostgreSQL：<code>pg_dump</code>、managed backup 或 volume snapshot；SQLite：一致性備份 <code>database.sqlite</code>。", "能在測試環境還原並看到 workflow 和 credential records。"],
      ["P0", "Encryption key", "解密 credentials 與敏感資料。", "<code>N8N_ENCRYPTION_KEY</code> 的 secret backup，或保留含 generated key 的 <code>.n8n</code> settings。", "還原後既有 credentials 可正常使用。"],
      ["P0", "<code>.n8n</code> user folder / Docker volume", "可能保存 SQLite file、generated encryption key、settings、binary data path、community nodes。", "Docker volume archive、host folder backup、平台 persistent volume snapshot。", "重建 container 後 <code>.n8n</code> 內容一致。"],
      ["P0", "Deployment config", "定義 DB、URL、binary mode、security、execution settings。", "<code>docker-compose.yml</code>、<code>.env</code>、platform env export、secret inventory。", "新環境可用同一設定啟動。"],
      ["P0", "Reverse proxy config", "決定 TLS、domain、headers、public edge。", "Caddyfile、Nginx config、Traefik labels、platform ingress 設定。", "public editor URL、webhook URL、OAuth callback 都正確。"]
    ],
    "backup-table"
  );

  const minBackupRowsB = renderReportTable(
    ["必備等級", "備份項目", "為什麼必備", "最低可接受形式", "驗收方式"],
    [
      ["P1", "Binary data storage", "檔案型 workflow 需要的實際 binary payload。", "依 mode 備份 filesystem path、database、S3 bucket 或 managed storage。", "歷史 execution 的檔案可讀，binary-heavy workflow 可重跑。"],
      ["P1", "Community nodes", "workflow 執行所需的 community package。", "<code>.n8n/nodes</code> backup 或 package/version inventory。", "重建後 workflow 不出現 missing packages。"],
      ["P1", "Workflow exports", "輔助版本管理與人工比對。", "<code>n8n export:workflow --backup --output=backups/latest/workflows/</code>。", "可獨立檢視 workflow JSON，但不把它當唯一備份。"],
      ["P1", "Credentials export", "輔助遷移，特別是跨 database 或特殊情境。", "<code>n8n export:credentials --backup --output=backups/latest/credentials/</code>；必要時受控使用 <code>--decrypted</code>。", "未授權人員無法讀取 sensitive data；若用 decrypted export，必須加密保存。"],
      ["P2", "Restore procedure", "避免只有 backup 沒有 recovery。", "一份可執行 restore checklist。", "至少每個 phase gate 做一次文件演練，正式前做測試還原。"]
    ],
    "backup-table"
  );

  addPage(
    "Chapter 3 · Section 3.4",
    "交付物二：最小備份組合 Checklist I",
    `
      <section class="chapter-section full">
        <div class="section-number">3.4</div>
        <div>
          <h3>Production self-host n8n 最小備份內容：P0</h3>
          <p>production self-host n8n 的備份不是單一檔案，而是一組 recovery bundle。這一頁先列 P0：缺少任一項，就可能無法恢復可用服務。</p>
          ${minBackupRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.4 continued",
    "交付物二：最小備份組合 Checklist II",
    `
      <section class="chapter-section full">
        <div class="section-number">3.4</div>
        <div>
          <h3>Production self-host n8n 最小備份內容：P1-P2</h3>
          <p>P1 與 P2 不是不重要，而是它們通常依 workload 與維運成熟度決定深度。binary-heavy workflow 與 community nodes 一旦存在，就不能被視為可忽略。</p>
          ${minBackupRowsB}
          <div class="migration-bundle">
            <span>一句話版本</span>
            <strong>database + .n8n volume/user folder + N8N_ENCRYPTION_KEY + Compose/env/proxy config + binary storage backup</strong>
          </div>
        </div>
      </section>
    `
  );

  const coverageMatrix = renderReportTable(
    ["備份方式", "Workflow", "Credentials", "Executions", "Encryption key", "Binary data", "Config", "適合作為唯一備份嗎"],
    [
      ["Workflow JSON export", "部分可", "否，只含 credential names/IDs 等參照", "否", "否", "否", "否", "否"],
      ["CLI workflow + credentials backup", "可", "可，但仍需 key 或安全處理", "通常否", "否", "否", "否", "否"],
      ["CLI export entities", "可", "可", "可選，需 <code>--includeExecutionHistoryDataTables=true</code>，但可能很大", "否", "視模式而定", "否", "否"],
      ["PostgreSQL backup", "可", "可，仍需同一 encryption key", "可", "否", "若 binary mode=database 才包含 binary payload", "否", "否"],
      ["<code>.n8n</code> volume backup", "視 DB 而定；SQLite 情境可", "視 DB/key 而定", "視 DB 而定", "可能可", "若 binary mode=filesystem 且 path 在此 volume 可", "部分可", "否"],
      ["Full recovery bundle", "可", "可", "可", "可", "可", "可", "是"]
    ],
    "coverage-table"
  );

  addPage(
    "Chapter 3 · Section 3.4 continued",
    "Backup Coverage Matrix",
    `
      <section class="chapter-section full">
        <div class="section-number">3.4</div>
        <div>
          <h3>Backup coverage matrix</h3>
          <p>這張矩陣的關鍵訊息很直白：任何單一 export 幾乎都不是完整備份。唯一能當 recovery baseline 的，是完整 recovery bundle。</p>
          ${coverageMatrix}
        </div>
      </section>
    `
  );

  const backupTiming = renderReportTable(
    ["時機", "必做備份", "原因"],
    [
      ["第一次正式上線前", "Full recovery bundle", "建立 baseline。"],
      ["每次 n8n 版本升級前", "Database、volume、encryption key、config", "防 migration 或 breaking change。"],
      ["改 <code>N8N_ENCRYPTION_KEY</code> 或啟用 key rotation 前", "Full database backup、key inventory", "key 相關變更不可草率。"],
      ["SQLite 轉 PostgreSQL 前", "SQLite DB、<code>.n8n</code> volume、key、CLI export entities", "遷移失敗時可回退。"],
      ["改 binary data mode 前", "原 mode 對應 storage、DB、config", "避免歷史 binary references 失效。"],
      ["加 queue workers 前", "DB、key、env、binary mode 記錄", "workers 需要共同 DB 與 key；filesystem binary mode 不適用 queue mode。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 3 · Section 3.4 continued",
    "最小備份流程圖",
    `
      <section class="chapter-section full">
        <div class="section-number">3.4</div>
        <div>
          <h3>最小備份流程圖</h3>
          <div class="backup-flow">
            <div>Identify DB type</div>
            <span>→</span>
            <div>Backup DB</div>
            <span>→</span>
            <div>Backup .n8n volume</div>
            <span>→</span>
            <div>Backup encryption key</div>
            <span>→</span>
            <div>Backup config</div>
            <span>→</span>
            <div>Backup binary storage by mode</div>
            <span>→</span>
            <div>Restore drill</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.4 continued",
    "備份時機",
    `
      <section class="chapter-section full">
        <div class="section-number">3.4</div>
        <div>
          <h3>備份時機</h3>
          ${backupTiming}
        </div>
      </section>
    `
  );

  const binaryModeTable = renderReportTable(
    ["Mode", "典型意義", "優點", "風險", "備份責任", "Week 03 建議"],
    [
      ["memory / default legacy", "binary data 在 execution 期間留在 memory。", "最少設定。", "大檔案可能造成 crash；不適合嚴肅 binary-heavy workload。", "通常不應依賴它保存 binary payload。", "若處理大檔案，應改成明確 storage mode。"],
      ["filesystem", "binary data 存到 disk，預設 storage path 與 <code>N8N_USER_FOLDER/binaryData</code> 相關。", "減少 memory 壓力，適合一般 single-instance regular mode。", "需要 disk capacity、volume backup；queue mode 不支援 filesystem binary data storage。", "備份 binary data path 或包含它的 volume。", "single-instance self-host 可優先評估。"],
      ["database", "binary data 存到 database。", "queue mode 情境更一致；DB backup 可涵蓋更多 state。", "DB 成長快，backup/restore 變大，效能與容量要監控。", "DB backup、retention policy、storage monitoring。", "queue mode 或多 worker 情境優先確認。"],
      ["s3 / external storage", "binary data 存到 S3 或 S3-compatible store。", "避免本機 filesystem 承擔大量檔案；適合大規模 binary storage。", "Self-hosted Enterprise 功能；AWS S3 是官方支援，其他 S3-compatible 非官方支援；bucket lifecycle 需要管理。", "bucket data、bucket policy、lifecycle、S3 credentials。", "只有 enterprise 或大規模 binary data 才納入主方案。"]
    ],
    "binary-table"
  );

  addPage(
    "Chapter 3 · Section 3.5",
    "交付物三：Binary-heavy Workflow 注意事項 I",
    `
      <section class="chapter-section full">
        <div class="section-number">3.5</div>
        <div>
          <h3>Binary-heavy 的定義與 mode 判斷表</h3>
          <p>Binary-heavy workflow 是大量處理 file-type data 的 workflow，例如圖片、PDF、文件、壓縮檔、音訊、影片、附件、爬蟲下載檔案、AI 生成檔案、OCR 或報表輸出。它的風險不是 workflow 節點多，而是檔案 payload 會佔用 memory、disk、database 或 external storage。</p>
          ${binaryModeTable}
        </div>
      </section>
    `
  );

  const binaryRiskTable = renderReportTable(
    ["風險", "觸發情境", "影響", "預防"],
    [
      ["Memory crash", "大圖片、PDF、影片、批次附件留在 memory。", "workflow 或 instance crash。", "設定 filesystem/database/S3 mode，並限制單次檔案大小。"],
      ["Disk fill-up", "filesystem mode 沒有容量監控或 pruning。", "n8n 無法寫入 execution/binary data，甚至整機不穩。", "監控 <code>binaryData</code> path、設定 retention、安排 volume backup。"],
      ["Database bloat", "database mode 保存大量 binary payload 或 execution data。", "DB backup 變慢、storage 成本增加、restore time 拉長。", "調整 execution save policy、pruning、DB capacity planning。"],
      ["Queue incompatibility", "queue mode 搭配 filesystem binary data。", "worker 架構不符合官方支援模式。", "queue mode 使用 database 或 enterprise external storage。"],
      ["S3 lifecycle gap", "external storage 沒有 lifecycle policy。", "舊 binary data 無限累積，成本與隱私風險上升。", "設定 bucket lifecycle，並記錄 retention policy。"],
      ["Mode drift", "從 S3 改回 filesystem 或反向切換，沒有保留舊 mode。", "舊 binary data 可能讀不到或不會被正確 pruning。", "保留 <code>N8N_AVAILABLE_BINARY_DATA_MODES</code> 與舊 storage credentials，遷移前先盤點。"],
      ["File node security", "Read/Write Files from Disk 或 Local File 類 workflow 讀寫主機檔案。", "安全邊界擴大，可能讀到不該讀的檔案。", "限制可讀寫路徑，審核需要 file access 的 workflow。"]
    ],
    "compact-table"
  );

  const binaryChecklist = renderReportTable(
    ["檢查項", "通過標準"],
    [
      ["實際 mode 已確認", "知道目前 <code>N8N_DEFAULT_BINARY_DATA_MODE</code> 與 n8n 版本。"],
      ["storage path 已確認", "若是 filesystem，知道 <code>N8N_BINARY_DATA_STORAGE_PATH</code> 或實際 <code>binaryData</code> path。"],
      ["queue compatibility 已確認", "若使用 queue mode，不使用 filesystem binary data storage。"],
      ["capacity 已估算", "預估單檔大小、每日檔案數、retention days、總 storage。"],
      ["pruning 已設定", "execution data 和 binary data retention 都有政策。"],
      ["backup 已覆蓋", "binary payload 所在位置已納入 backup，不只備份 workflow JSON。"],
      ["restore 已驗證", "還原後能開啟歷史 execution 的 binary file 或重跑 workflow。"],
      ["security 已審核", "Read/Write Files from Disk、Local File Trigger、Execute Command 類能力有明確邊界。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 3 · Section 3.5 continued",
    "Binary-heavy Workflow 風險卡",
    `
      <section class="chapter-section full">
        <div class="section-number">3.5</div>
        <div>
          <h3>Binary-heavy 風險卡</h3>
          ${binaryRiskTable}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.5 continued",
    "Binary-heavy Workflow Checklist",
    `
      <section class="chapter-section full">
        <div class="section-number">3.5</div>
        <div>
          <h3>Binary-heavy checklist</h3>
          ${binaryChecklist}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 3 · Section 3.6",
    "驗收條件說明",
    `
      <section class="chapter-section">
        <div class="section-number">3.6</div>
        <div>
          <h3>60 秒標準回答</h3>
          <div class="script-box">
            <p>production self-host n8n 的最小備份內容不是單一檔案，而是一組 recovery bundle。第一是 database，因為 workflows、encrypted credentials、past executions 都在裡面；如果是 PostgreSQL，要有 <code>pg_dump</code>、managed backup 或等價方式，如果是 SQLite，要有一致性的 <code>database.sqlite</code> 備份。第二是 <code>.n8n</code> volume 或 user folder，因為它可能保存 SQLite file、generated encryption key、settings、binary data path 和 community nodes。第三是 encryption key，尤其是 <code>N8N_ENCRYPTION_KEY</code>，因為 database 裡的 credentials 需要同一把 key 才能解密。第四是 Compose/env/proxy config，因為 DB 連線、public URL、binary data mode、TLS 和 reverse proxy 都靠這些設定恢復。第五是 binary data storage，要依實際 mode 備份 filesystem path、database 或 S3 bucket。workflow JSON export 可以當輔助，但不能取代完整備份。</p>
          </div>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">3.6</div>
        <div>
          <h3>15 秒版本</h3>
          <div class="note-band">
            <strong>短答</strong>
            <p>最小備份內容是 database、<code>.n8n</code> volume 或 user folder、<code>N8N_ENCRYPTION_KEY</code>、Compose/env/proxy config，再依 binary data mode 補上 binary storage。少了其中任何一項，都可能出現 workflow 在、credential 不能用，或資料在、public URL 與檔案失效。</p>
          </div>
        </div>
      </section>
    `
  );

  const practicalChecklist = renderReportTable(
    ["檢查項", "通過標準"],
    [
      ["Database decision 已完成", "明確知道目前使用 SQLite 或 PostgreSQL，並知道為什麼。"],
      ["PostgreSQL trigger point 已定義", "一旦進入 public webhook、長期 automation、team usage、queue mode 或 production，就切換 PostgreSQL。"],
      ["SQLite backup 風險已理解", "知道 SQLite file 在 <code>.n8n</code>，並知道 pruning 後可能需要 VACUUM 才釋放磁碟空間。"],
      ["Encryption key 已納入 P0", "<code>N8N_ENCRYPTION_KEY</code> 或 generated key 被視為 P0 secret。"],
      ["Full recovery bundle 已列出", "database、volume、key、env、proxy、binary storage 全部列入。"],
      ["Workflow export 定位正確", "workflow JSON export 只作輔助，不當唯一備份。"],
      ["Credential export 安全", "若使用 <code>--decrypted</code>，必須加密保存並限制存取。"],
      ["Execution retention 已決定", "知道保存成功/失敗/手動 executions 的策略，並配置 pruning。"],
      ["Binary mode 已確認", "不寫死預設值，依實際版本和 <code>N8N_DEFAULT_BINARY_DATA_MODE</code> 判斷。"],
      ["Restore drill 已排程", "至少有文件演練，正式前要做測試還原。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 3 · Section 3.7",
    "Week 03 實務檢查表",
    `
      <section class="chapter-section full">
        <div class="section-number">3.7</div>
        <div>
          <h3>實務檢查表</h3>
          <p>這張表可以直接用來檢查一個 n8n instance 是否已具備基本資料安全意識。若任一項不明確，就表示還不能進正式導入。</p>
          ${practicalChecklist}
        </div>
      </section>
    `
  );

  const completion = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 03 計畫要求", "通過"],
      ["已核對官方來源", "通過"],
      ["已完成 SQLite vs PostgreSQL 決策表", "通過"],
      ["已完成最小備份組合 checklist", "通過"],
      ["已完成 binary-heavy workflow 注意事項", "通過"],
      ["已完成驗收說明", "通過"],
      ["已避免把 workflow JSON export 誤寫為完整備份", "通過"],
      ["已處理 binary data 版本差異，不寫死單一預設模式", "通過"],
      ["未把 Week 07 Docker Compose 實作或 Week 14 backup command runbook 提前執行", "通過"]
    ],
    "check-table"
  );

  addPage(
    "Chapter 3 · Sections 3.8-3.9",
    "完成檢查與下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">3.8</div>
        <div>
          <h3>Week 03 完成檢查</h3>
          ${completion}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">3.9</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 04 會進入 DNS、HTTPS、反向代理與公開 URL。Week 03 的資料安全結論會在 Week 04 補上 public edge：資料就算保存正確，只要 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、TLS 或 reverse proxy headers 錯，外部服務仍然無法可靠觸發 workflow。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>資料安全的底線是 recovery bundle：database、volume、key、config、binary storage。workflow JSON 是好輔助，但不是救命繩本身。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekFourChapter(week, startIndex) {
  const source = "docs/week-04-public-url-dns-proxy.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["public URL troubleshooting flow", "完成", "4.3", "能從 DNS、TLS、reverse proxy、n8n env vars、webhook publish 狀態逐層排查。"],
      ["OAuth callback checklist", "完成", "4.4", "能確認 provider callback、<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、domain 或 tunnel 穩定性。"],
      ["DNS/TLS glossary", "完成", "4.5", "能解釋 domain、A record、CNAME、subdomain、dynamic DNS、TLS certificate、reverse proxy。"],
      ["驗收說明", "完成", "4.6", "看到 OAuth callback mismatch 時，能先查 provider callback、public URL env vars、proxy headers 與 domain/tunnel。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 4 · Week 04",
    "DNS、HTTPS、反向代理與公開 URL",
    `
      <div class="chapter-summary">
        <div class="week-icon">URL</div>
        <div>
          <p class="kicker">4.0 本週定位</p>
          <p>Week 04 的核心問題是：為什麼 webhook 與 OAuth 常常不是 workflow 錯，而是 URL、DNS、proxy 錯？這週把 Week 03 的資料安全往外接到 public edge，理解外部服務如何找到 n8n，以及 n8n 如何生成正確的 webhook 與 callback URL。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">4.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週不是要急著公開本機服務，而是先建立排查順序：DNS、TLS、reverse proxy、forwarded headers、n8n public URL env vars、webhook 狀態與 OAuth provider callback。</p>
          ${deliverables}
        </div>
      </section>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>瀏覽器打得開，只代表 UI path 可能通了。Webhook 與 OAuth 還需要 n8n 生成的 public URL、provider 設定、proxy headers 與 TLS 都同時正確。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-04"
  );

  const sourcesA = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "n8n 會用 <code>N8N_PROTOCOL</code>、<code>N8N_HOST</code>、<code>N8N_PORT</code> 組 webhook URL；在 reverse proxy 後這通常不正確。",
        "因為 n8n 內部可能跑在 <code>5678</code>，但外部是 <code>443</code> 與正式 domain。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Configure webhook URLs with reverse proxy</a>"
      ],
      [
        "reverse proxy 情境應設定 <code>WEBHOOK_URL</code>，讓 n8n 在 editor UI 顯示並向外部服務註冊正確 webhook URL。",
        "這是 public webhook 成敗核心。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Configure webhook URLs with reverse proxy</a>"
      ],
      [
        "reverse proxy 情境應設定 <code>N8N_PROXY_HOPS=1</code>，並讓最後一層 proxy 傳遞 <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code>。",
        "proxy hop 與 forwarded headers 會影響 n8n 對外部 scheme 與 host 的理解。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Configure webhook URLs with reverse proxy</a>"
      ],
      [
        "<code>N8N_EDITOR_BASE_URL</code> 是使用者可存取 editor 的 public URL，也用於 n8n email 與 SAML redirect URL。",
        "它不是單純 UI 顯示設定。",
        "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">Deployment environment variables</a>"
      ],
      [
        "Webhook node 有 Test URL 與 Production URL；Test URL 要先 Listen for test event，且測試 webhook 只維持 120 秒。",
        "把 Test URL 當 production endpoint 是錯誤排查常見陷阱。",
        "<a href=\"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/workflow-development/\">Webhook workflow development</a>"
      ],
      [
        "Production webhook URL 要在 workflow 準備好後使用，並 publish workflow 才會自動觸發。",
        "production webhook 失敗不一定是 DNS，有可能 workflow 沒 publish。",
        "<a href=\"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/workflow-development/\">Webhook workflow development</a>"
      ]
    ],
    "compact-table"
  );

  const sourcesB = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "n8n 官方 Cloud Run 指南的 OAuth redirect URI 範例是 <code>&lt;YOUR-N8N-URL&gt;/rest/oauth2-credential/callback</code>，且同時更新 <code>N8N_HOST</code>、<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>。",
        "OAuth provider 裡的 redirect URI 必須與 n8n public URL 精準一致。",
        "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run/\">Google Cloud Run setup</a>"
      ],
      [
        "Cloudflare 建立 subdomain 時，需建立 <code>A</code>、<code>AAAA</code> 或 <code>CNAME</code>，依目標是 IPv4、IPv6 或 FQDN 決定。",
        "DNS record type 不是任意選。",
        "<a href=\"https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-subdomain/\">Cloudflare subdomain records</a>"
      ],
      [
        "CNAME 是 alias，指向 canonical domain。",
        "PaaS 或 tunnel provider 常要求 CNAME 指到平台 hostname。",
        "<a href=\"https://www.cloudflare.com/en-in/learning/dns/dns-records/dns-cname-record/\">Cloudflare CNAME record</a>"
      ],
      [
        "Caddy 可作 reverse proxy；若使用非 localhost domain，Caddy 會嘗試取得 publicly trusted certificate，前提是 DNS 指向機器且 80/443 對外開放。",
        "TLS 自動化仍依賴 DNS 與 port 可達。",
        "<a href=\"https://caddyserver.com/docs/quick-starts/reverse-proxy\">Caddy reverse proxy quick-start</a>"
      ],
      [
        "Let’s Encrypt 提供 SSL/TLS certificates，用於推廣 HTTPS。",
        "TLS certificate 是 HTTPS public edge 的必要元件。",
        "<a href=\"https://letsencrypt.org/docs/faq/\">Let’s Encrypt FAQ</a>"
      ],
      [
        "n8n 建議設定 SSL 來強制安全連線。",
        "public self-hosted n8n 不應長期停留在 HTTP。",
        "<a href=\"https://docs.n8n.io/hosting/securing/overview/\">Securing n8n</a>"
      ]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 4 · Section 4.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">4.2</div>
        <div>
          <h3>官方來源核對：n8n URL 與 Webhook</h3>
          <p>本週只採用官方文件作為事實基礎。公開 URL 問題不能靠「瀏覽器打得開」就判定成功。</p>
          ${sourcesA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">4.2</div>
        <div>
          <h3>官方來源核對：OAuth、DNS、TLS 與 Proxy</h3>
          <p>OAuth callback、DNS record、Caddy reverse proxy 與 TLS certificate 是同一條 public edge 路徑的不同層。任何一層錯，都會讓外部服務回不到 n8n。</p>
          ${sourcesB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.3",
    "交付物一：Public URL Troubleshooting Flow",
    `
      <section class="chapter-section full">
        <div class="section-number">4.3</div>
        <div>
          <h3>一張總圖</h3>
          <p>排查 public URL 問題時，請照層級往內查。不要一看到 webhook 或 OAuth 失敗就先改 workflow node。</p>
          <div class="url-flow">
            <div><span>01</span><strong>DNS resolves?</strong><p>domain、A record、CNAME、subdomain、DDNS。</p></div>
            <div><span>02</span><strong>TLS certificate valid?</strong><p>certificate issuance、DNS validation、80/443、proxy status。</p></div>
            <div><span>03</span><strong>Reverse proxy routes?</strong><p>Caddy/Nginx/Traefik/platform ingress upstream and firewall。</p></div>
            <div><span>04</span><strong>n8n knows public URL?</strong><p>WEBHOOK_URL、N8N_EDITOR_BASE_URL、N8N_PROXY_HOPS。</p></div>
            <div><span>05</span><strong>Webhook state correct?</strong><p>Test vs Production URL、Listen for test event、workflow publish。</p></div>
            <div><span>06</span><strong>Provider callback matches?</strong><p>OAuth redirect URI 與 stable domain/tunnel。</p></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.3 continued",
    "Public URL Troubleshooting：總結卡",
    `
      <section class="chapter-section full">
        <div class="section-number">4.3</div>
        <div>
          <h3>排查總結</h3>
          <div class="tip-callout">
            <strong>先查 URL 層</strong>
            <p>DNS/TLS/proxy/public URL 都通過後，才進 workflow logic、credential scopes、payload、auth 與 response handling。</p>
          </div>
          <div class="note-band">
            <strong>三個觀察角度</strong>
            <p>使用者 browser 要能開 editor；外部 webhook provider 要能打到 production webhook；OAuth provider 要能回到精準 callback URL。三者都通，public URL 才算真的 ready。</p>
          </div>
        </div>
      </section>
    `
  );

  const troubleshootingOrder = renderReportTable(
    ["順序", "檢查層", "要問的問題", "通過標準", "失敗時先修什麼"],
    [
      ["1", "DNS", "<code>n8n.example.com</code> 是否解析到正確 server、platform 或 tunnel target？", "<code>A</code>、<code>AAAA</code> 或 <code>CNAME</code> 指向正確目標。", "DNS record、subdomain、DDNS 更新、Cloudflare proxy 狀態。"],
      ["2", "TLS", "外部看到的是有效 <code>https://</code> 嗎？", "瀏覽器與外部 service 都接受 certificate。", "certificate issuance、80/443 port、reverse proxy、provider SSL 設定。"],
      ["3", "Reverse proxy", "public domain 是否轉到 n8n internal port？", "request 能到 <code>n8n:5678</code> 或 <code>localhost:5678</code> 等正確 upstream。", "Caddyfile、Nginx config、Traefik labels、platform ingress、firewall。"],
      ["4", "Forwarded headers", "n8n 是否知道原始 request 的 host 與 protocol？", "最後一層 proxy 傳 <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code>。", "proxy header 設定與 <code>N8N_PROXY_HOPS</code>。"],
      ["5", "n8n public URL env", "editor 與 webhook 產出的 URL 是否是外部 URL？", "<code>WEBHOOK_URL</code> 與 <code>N8N_EDITOR_BASE_URL</code> 指向穩定 public HTTPS URL。", "env vars 與 container restart。"]
    ],
    "url-table"
  );

  const troubleshootingOrderB = renderReportTable(
    ["順序", "檢查層", "要問的問題", "通過標準", "失敗時先修什麼"],
    [
      ["6", "Webhook mode", "使用的是 Test URL 還是 Production URL？", "測試用 Test URL 且已 Listen；正式用 Production URL 且 workflow 已 publish。", "URL 類型、workflow publish、provider registered URL。"],
      ["7", "OAuth provider", "provider 裡的 redirect URI 是否完全一致？", "redirect URI 精準等於 n8n 的 callback URL，例如 <code>https://n8n.example.com/rest/oauth2-credential/callback</code>。", "provider console 的 authorized redirect URI。"],
      ["8", "Tunnel/domain stability", "URL 會不會每次重啟就變？", "production 使用穩定 domain 或 named tunnel，不使用 random tunnel。", "domain、named tunnel、provider hostname。"],
      ["9", "Workflow layer", "DNS/TLS/proxy/URL 都正確後，才查 workflow。", "payload、method、auth、response code、node logic 正確。", "Webhook node method、auth、Respond to Webhook、credential scopes。"]
    ],
    "url-table"
  );

  addPage(
    "Chapter 4 · Section 4.3 continued",
    "Public URL Troubleshooting：排查順序 I",
    `
      <section class="chapter-section full">
        <div class="section-number">4.3</div>
        <div>
          <h3>排查順序：DNS 到 n8n public URL</h3>
          ${troubleshootingOrder}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.3 continued",
    "Public URL Troubleshooting：排查順序 II",
    `
      <section class="chapter-section full">
        <div class="section-number">4.3</div>
        <div>
          <h3>排查順序：Webhook、OAuth 與 Workflow Layer</h3>
          ${troubleshootingOrderB}
        </div>
      </section>
    `
  );

  const urlVarMatrix = renderReportTable(
    ["變數", "用途", "常見錯誤", "正確範例"],
    [
      ["<code>N8N_HOST</code>", "n8n host name，用於基礎 host 設定。", "寫成 <code>localhost</code>，但外部使用 <code>n8n.example.com</code>。", "<code>N8N_HOST=n8n.example.com</code>"],
      ["<code>N8N_PROTOCOL</code>", "n8n 對外 protocol 設定。", "reverse proxy 外部是 HTTPS，n8n 仍生成 HTTP。", "<code>N8N_PROTOCOL=https</code>"],
      ["<code>N8N_PORT</code>", "n8n process 內部 port。", "外部 443 與內部 5678 混淆。", "<code>N8N_PORT=5678</code>"],
      ["<code>WEBHOOK_URL</code>", "n8n 顯示與註冊 webhook 用的 public URL。", "沒設定，導致 webhook URL 變成 internal host 或錯誤 port。", "<code>WEBHOOK_URL=https://n8n.example.com</code>"],
      ["<code>N8N_EDITOR_BASE_URL</code>", "使用者可存取 editor 的 public URL，也用於 email 與 SAML redirect。", "editor link、auth flow 或 email link 指錯 domain。", "<code>N8N_EDITOR_BASE_URL=https://n8n.example.com</code>"],
      ["<code>N8N_PROXY_HOPS</code>", "告訴 n8n 前面有幾層 reverse proxy。", "behind proxy 但仍為 <code>0</code>，n8n 不信任 forwarded headers。", "<code>N8N_PROXY_HOPS=1</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 4 · Section 4.3 continued",
    "n8n URL 變數矩陣",
    `
      <section class="chapter-section full">
        <div class="section-number">4.3</div>
        <div>
          <h3>n8n URL 變數矩陣</h3>
          ${urlVarMatrix}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.3 continued",
    "正確公開 URL 心智模型",
    `
      <section class="chapter-section full">
        <div class="section-number">4.3</div>
        <div>
          <h3>正確公開 URL 心智模型</h3>
          <div class="public-url-model">
            <div>External service / browser</div>
            <span>→</span>
            <div>DNS<br><small>n8n.example.com</small></div>
            <span>→</span>
            <div>HTTPS certificate</div>
            <span>→</span>
            <div>Reverse proxy / ingress</div>
            <span>→</span>
            <div>n8n internal :5678</div>
            <span>→</span>
            <div>Public URL env vars</div>
          </div>
          <p>public URL 的正確性不是單點設定，而是 DNS、TLS、reverse proxy、forwarded headers、n8n env vars 和 provider callback 六層一起正確。</p>
        </div>
      </section>
    `
  );

  const oauthChecklist = renderReportTable(
    ["檢查項", "通過標準", "失敗症狀"],
    [
      ["Provider callback 精準一致", "OAuth provider console 中的 redirect URI 等於 n8n public callback URL。", "<code>redirect_uri_mismatch</code>、callback mismatch、invalid redirect URI。"],
      ["Callback path 正確", "常見 n8n OAuth callback path 是 <code>/rest/oauth2-credential/callback</code>。", "provider 回到錯誤 endpoint，n8n 收不到 token。"],
      ["Scheme 正確", "provider 使用 <code>https://</code>，不是 <code>http://</code>。", "provider 拒絕 redirect 或 browser blocked。"],
      ["Host 正確", "provider 使用 <code>n8n.example.com</code>，不是 <code>localhost</code>、container name 或舊 tunnel host。", "OAuth 成功登入 provider 後回不到 n8n。"],
      ["Domain 穩定", "production 不使用每次重啟會變的 random tunnel。", "昨天可用，今天 callback 失效。"],
      ["<code>N8N_EDITOR_BASE_URL</code> 正確", "指向使用者實際打開 editor 的 public URL。", "auth/email/SAML 或 editor redirect 指錯。"]
    ],
    "oauth-table"
  );

  const oauthChecklistB = renderReportTable(
    ["檢查項", "通過標準", "失敗症狀"],
    [
      ["<code>WEBHOOK_URL</code> 正確", "指向外部 service 能呼叫的 public base URL。", "webhook 或 OAuth-like provider registration 顯示錯誤 base URL。"],
      ["<code>N8N_PROXY_HOPS</code> 正確", "reverse proxy 前方設定 <code>N8N_PROXY_HOPS=1</code>，多層 proxy 依實際層數評估。", "n8n 誤判 protocol 或 host。"],
      ["Forwarded headers 正確", "最後一層 proxy 傳 <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code>。", "n8n 看到 internal host 或 HTTP。"],
      ["TLS certificate 有效", "provider 與 browser 都信任 certificate。", "OAuth provider 拒絕 callback，或 browser 顯示 certificate warning。"],
      ["Credential scopes 正確", "OAuth client scopes 與 n8n credential 所需服務一致。", "callback 成功但 credential 無權限或 API call 失敗。"]
    ],
    "oauth-table"
  );

  addPage(
    "Chapter 4 · Section 4.4",
    "交付物二：OAuth Callback Checklist I",
    `
      <section class="chapter-section full">
        <div class="section-number">4.4</div>
        <div>
          <h3>OAuth callback 正確性檢查表：Provider 與 Base URL</h3>
          ${oauthChecklist}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.4 continued",
    "OAuth Callback Checklist II",
    `
      <section class="chapter-section full">
        <div class="section-number">4.4</div>
        <div>
          <h3>OAuth callback 正確性檢查表：Proxy、TLS 與 Scopes</h3>
          ${oauthChecklistB}
        </div>
      </section>
    `
  );

  const providerExamples = renderReportTable(
    ["欄位", "正確值範例", "不正確值範例"],
    [
      ["Authorized JavaScript origin", "<code>https://n8n.example.com</code>", "<code>http://localhost:5678</code>"],
      ["Authorized redirect URI", "<code>https://n8n.example.com/rest/oauth2-credential/callback</code>", "<code>https://random-tunnel.trycloudflare.com/rest/oauth2-credential/callback</code>"],
      ["n8n editor base", "<code>N8N_EDITOR_BASE_URL=https://n8n.example.com</code>", "<code>N8N_EDITOR_BASE_URL=http://localhost:5678</code>"],
      ["n8n webhook base", "<code>WEBHOOK_URL=https://n8n.example.com</code>", "<code>WEBHOOK_URL=http://n8n:5678</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 4 · Section 4.4 continued",
    "OAuth Callback 排查流程",
    `
      <section class="chapter-section full">
        <div class="section-number">4.4</div>
        <div>
          <h3>OAuth callback 排查流程</h3>
          <div class="callback-flow">
            <div>Copy redirect URI from provider error</div>
            <span>→</span>
            <div>Compare scheme</div>
            <span>→</span>
            <div>Compare host</div>
            <span>→</span>
            <div>Compare path</div>
            <span>→</span>
            <div>Check n8n public URL vars</div>
            <span>→</span>
            <div>Update provider redirect URI</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.4 continued",
    "OAuth Provider 設定範例",
    `
      <section class="chapter-section full">
        <div class="section-number">4.4</div>
        <div>
          <h3>Provider 設定範例</h3>
          ${providerExamples}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.4 continued",
    "不可犯錯的 OAuth 判斷",
    `
      <section class="chapter-section full">
        <div class="section-number">4.4</div>
        <div>
          <h3>不可犯錯的 OAuth 判斷</h3>
          <div class="mistake-grid">
            <div>OAuth callback mismatch 先查 URL，不先改 workflow node。</div>
            <div>provider console 裡的 redirect URI 必須和 n8n public URL 精準一致，包含 scheme、host、path。</div>
            <div>tunnel URL 若會變，就不適合作為 production OAuth callback。</div>
            <div><code>N8N_EDITOR_BASE_URL</code> 與 <code>WEBHOOK_URL</code> 服務不同目的，但 production 應共同指向同一個穩定 public base URL。</div>
            <div>reverse proxy 能打開 UI，不代表 OAuth callback 一定正確；callback 還依賴 forwarded headers 與 n8n env vars。</div>
          </div>
        </div>
      </section>
    `
  );

  const glossaryA = renderReportTable(
    ["詞彙", "定義", "n8n 部署影響", "第一檢查點"],
    [
      ["Domain name", "人類可讀的網域，例如 <code>example.com</code>。", "提供穩定 public identity。", "是否擁有並控制該 domain？"],
      ["Subdomain", "root domain 底下的子網域，例如 <code>n8n.example.com</code>。", "建議給 n8n 獨立 subdomain，避免 path proxy 複雜度。", "是否已建立 <code>n8n</code> 這個 DNS record？"],
      ["DNS", "將 domain 解析到 IP 或另一個 hostname 的系統。", "外部服務能否找到 n8n 的第一層。", "domain 是否解析到正確 server/platform/tunnel？"],
      ["A record", "將 hostname 指向 IPv4 address。", "VPS 常用 <code>A</code> record 指向 server IP。", "<code>n8n.example.com A 203.0.113.10</code> 是否正確？"],
      ["AAAA record", "將 hostname 指向 IPv6 address。", "IPv6 環境使用；若設錯可能導致部分 client 走錯路。", "是否真的有 IPv6 service 可用？"],
      ["CNAME record", "將 hostname 作為另一個 hostname 的 alias。", "PaaS、tunnel、managed platform 常要求 CNAME。", "target 是否為 provider 給的 FQDN？"],
      ["TTL", "DNS record cache 時間。", "變更 DNS 後外部可能仍暫時看到舊值。", "是否等 TTL 與 DNS propagation？"],
      ["Dynamic DNS", "當 residential IP 改變時，自動更新 DNS record。", "home server 或 dynamic IP 情境可能需要。", "更新腳本或 provider API 是否可靠？"],
      ["HTTPS", "HTTP over TLS。", "public n8n 應使用 HTTPS，尤其是 credentials 與 OAuth callback。", "browser 是否顯示 valid HTTPS？"],
      ["TLS certificate", "用來證明 server identity 並加密連線的 certificate。", "certificate invalid 會導致 browser 或 provider 拒絕連線。", "certificate domain 是否符合 public hostname？"],
      ["Certificate authority", "簽發 certificate 的受信任機構，例如 Let’s Encrypt。", "讓外部 client 信任你的 n8n domain。", "certificate 是否由受信任 CA 簽發？"]
    ],
    "glossary-table"
  );

  const glossaryB = renderReportTable(
    ["詞彙", "定義", "n8n 部署影響", "第一檢查點"],
    [
      ["Reverse proxy", "位於 internet 與 n8n 之間，處理 TLS、routing、headers 的前置服務。", "把 <code>https://n8n.example.com</code> 轉到 internal <code>n8n:5678</code>。", "proxy upstream 是否正確？"],
      ["Public edge", "外部流量第一個進入點，可能是 reverse proxy、platform ingress、tunnel 或 load balancer。", "決定外部看到的 scheme、host、port。", "public edge 是否穩定且可監控？"],
      ["Origin service", "reverse proxy 後方真正跑 n8n 的服務。", "通常是 <code>localhost:5678</code> 或 Docker service <code>n8n:5678</code>。", "proxy 是否能連到 origin？"],
      ["Forwarded headers", "<code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code> 等 header。", "讓 n8n 知道原始 request 的 public host 與 protocol。", "proxy 是否傳遞這些 headers？"],
      ["<code>WEBHOOK_URL</code>", "n8n 用來顯示與註冊 webhook 的 public base URL。", "webhook URL 錯誤時第一優先檢查。", "是否為 <code>https://n8n.example.com</code>？"],
      ["<code>N8N_EDITOR_BASE_URL</code>", "n8n editor 的 public base URL，也影響 email 與 SAML redirect。", "auth redirect 與 editor link 錯誤時必查。", "是否為實際使用者打開的 URL？"],
      ["<code>N8N_PROXY_HOPS</code>", "告訴 n8n 前方 proxy hop 數。", "behind reverse proxy 時必須正確設定。", "單層 reverse proxy 通常設 <code>1</code>。"],
      ["Test webhook URL", "Webhook node 的測試 URL。", "需要 Listen for test event，且短時間有效。", "是否按下 Listen 並在 120 秒內測試？"],
      ["Production webhook URL", "Webhook node 的正式 URL。", "workflow publish 後才適合外部 production service 使用。", "workflow 是否已 publish？"],
      ["OAuth callback URL", "OAuth provider 完成授權後回到 n8n 的 URL。", "mismatch 時 credential connection 失敗。", "provider console 是否完全符合 n8n callback？"]
    ],
    "glossary-table"
  );

  addPage(
    "Chapter 4 · Section 4.5",
    "交付物三：DNS/TLS Glossary I",
    `
      <section class="chapter-section full">
        <div class="section-number">4.5</div>
        <div>
          <h3>DNS/TLS Glossary：DNS 與 TLS</h3>
          ${glossaryA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.5 continued",
    "DNS/TLS Glossary II",
    `
      <section class="chapter-section full">
        <div class="section-number">4.5</div>
        <div>
          <h3>DNS/TLS Glossary：Proxy、Webhook 與 OAuth</h3>
          ${glossaryB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 4 · Section 4.6",
    "驗收條件說明",
    `
      <section class="chapter-section">
        <div class="section-number">4.6</div>
        <div>
          <h3>60 秒標準回答</h3>
          <div class="script-box">
            <p>看到 OAuth callback mismatch 時，不要先改 workflow。第一步先把 provider 錯誤訊息中的 redirect URI 複製出來，逐字比對 scheme、host、port 與 path。n8n 常見 OAuth callback path 是 <code>/rest/oauth2-credential/callback</code>，所以 provider 裡應該是類似 <code>https://n8n.example.com/rest/oauth2-credential/callback</code>。第二步檢查 n8n 的 public URL env vars：<code>N8N_EDITOR_BASE_URL</code> 是否是使用者實際開 editor 的 public URL，<code>WEBHOOK_URL</code> 是否是外部服務能呼叫的 public base URL，<code>N8N_HOST</code>、<code>N8N_PROTOCOL</code> 是否和 domain/HTTPS 一致。第三步檢查 reverse proxy：<code>N8N_PROXY_HOPS</code> 是否正確，proxy 是否傳 <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code>。第四步檢查 DNS 與 TLS：domain 是否解析到正確 public edge，certificate 是否有效。第五步檢查 tunnel 或 domain 是否穩定；如果用 random tunnel，callback 變掉是預期風險，不應當 production callback。</p>
          </div>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">4.6</div>
        <div>
          <h3>15 秒版本</h3>
          <div class="note-band">
            <strong>短答</strong>
            <p>OAuth callback mismatch 先查 provider redirect URI、<code>N8N_EDITOR_BASE_URL</code>、<code>WEBHOOK_URL</code>、<code>N8N_PROXY_HOPS</code>、forwarded headers、DNS/TLS，以及 tunnel 或 domain 是否穩定；這些都正確後，才查 credential scopes 或 workflow。</p>
          </div>
        </div>
      </section>
    `
  );

  const practicalChecklist = renderReportTable(
    ["檢查項", "通過標準"],
    [
      ["Domain 已固定", "production 使用穩定 domain 或 named tunnel，不使用 random tunnel。"],
      ["DNS record 正確", "<code>A</code>、<code>AAAA</code> 或 <code>CNAME</code> 指向正確 server、platform 或 tunnel target。"],
      ["HTTPS 有效", "public URL 使用有效 TLS certificate。"],
      ["Reverse proxy upstream 正確", "public edge 能轉到 n8n internal port。"],
      ["Forwarded headers 正確", "proxy 傳 <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code>。"],
      ["<code>N8N_PROXY_HOPS</code> 正確", "單層 reverse proxy 設 <code>1</code>，多層依實際情境評估。"],
      ["<code>WEBHOOK_URL</code> 正確", "指向外部服務能呼叫的 HTTPS public base URL。"],
      ["<code>N8N_EDITOR_BASE_URL</code> 正確", "指向使用者實際打開 editor 的 HTTPS public base URL。"],
      ["Webhook URL 類型正確", "測試使用 Test URL 與 Listen；正式使用 Production URL 與 published workflow。"],
      ["OAuth callback 正確", "provider redirect URI 精準等於 n8n callback URL。"],
      ["DNS/TLS 變更有等待", "變更 DNS 或 certificate 後，考慮 TTL、propagation、certificate issuance 時間。"],
      ["Workflow 排查放後面", "DNS/TLS/proxy/public URL 都通過後，才查 method、auth、payload、response logic。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 4 · Section 4.7",
    "Week 04 實務檢查表",
    `
      <section class="chapter-section full">
        <div class="section-number">4.7</div>
        <div>
          <h3>實務檢查表</h3>
          <p>這張表可以直接拿來驗收 public URL 是否真的 ready。全部通過前，不要把問題歸咎於 workflow node。</p>
          ${practicalChecklist}
        </div>
      </section>
    `
  );

  const completion = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 04 計畫要求", "通過"],
      ["已核對官方來源", "通過"],
      ["已完成 public URL troubleshooting flow", "通過"],
      ["已完成 OAuth callback checklist", "通過"],
      ["已完成 DNS/TLS glossary", "通過"],
      ["已完成驗收說明", "通過"],
      ["已明確區分 Test webhook URL 與 Production webhook URL", "通過"],
      ["已明確標示 OAuth callback path 與 provider redirect URI 必須精準一致", "通過"],
      ["未提前執行 Week 08 tunnel 實作或 Week 10 VPS/Caddy 部署", "通過"]
    ],
    "check-table"
  );

  addPage(
    "Chapter 4 · Sections 4.8-4.9",
    "完成檢查與下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">4.8</div>
        <div>
          <h3>Week 04 完成檢查</h3>
          ${completion}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">4.9</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 05 會進入本機快速啟動：Docker Desktop。Week 04 的公開 URL 模型會先放在腦中，不急著公開本機服務；Week 05 的目標是把 n8n 在本機穩定跑起來，確認 volume persistence，等 Week 08 才正式處理 tunnel 與本機 public webhook。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>URL 問題要先分層：DNS 找不找得到、TLS 信不信任、proxy 轉不轉得到、n8n 知不知道 public URL、provider callback 是否逐字一致。這些都通過後，才進 workflow 本身。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekFiveChapter(week, startIndex) {
  const source = "docs/week-05-local-docker-desktop.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["本機部署紀錄", "完成", "5.3", "使用 Docker Desktop、官方 n8n image、<code>n8n_data</code> volume 與 <code>5678:5678</code> port mapping 啟動 n8n。"],
      ["container / volume 截圖或文字紀錄", "完成", "5.4", "以 <code>docker ps</code>、<code>docker inspect</code>、<code>docker volume inspect</code> 留下文字紀錄。"],
      ["重啟後 persistence 驗證", "完成", "5.5", "刪除並重建 container 後，workflow 與 credential 仍可由 n8n CLI 匯出。"],
      ["本週圖解與排錯流程", "完成", "5.6", "能判斷資料是否在 volume，而不是 container writable layer。"],
      ["驗收說明", "完成", "5.7", "能說明重建 container 後 workflow 與 credential 為什麼仍存在。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 5 · Week 05",
    "本機快速啟動：Docker Desktop",
    `
      <div class="chapter-summary">
        <div class="week-icon">DOCK</div>
        <div>
          <p class="kicker">5.0 本週定位</p>
          <p>Week 05 的核心問題是：如何用最少摩擦在 macOS 或 Windows 上跑起可保存狀態的本機 n8n？本週不是 production 部署，而是用 Docker Desktop、官方 n8n image 與 named volume，建立一個可重建、可驗收、可學習的本機 baseline。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">5.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週狀態為完成：三個主要交付物已產出，並已做 Docker Desktop 真機 persistence 驗證。判斷標準不是「UI 打得開」，而是「刪除並重建 container 後，workflow 與 credential 還在」。</p>
          ${deliverables}
        </div>
      </section>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Week 05 的主角不是 container，而是 volume。container 是可以重做的 runtime；<code>n8n_data</code> 才是本機 state 能跨重建保留下來的邊界。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-05"
  );

  const sourceRows = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      [
        "n8n 官方 Docker 安裝範例使用 <code>docker volume create n8n_data</code>，並把 <code>n8n_data</code> 掛到 <code>/home/node/.n8n</code>。",
        "確認。本週使用同一個 volume name 與 mount path。",
        "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>"
      ],
      [
        "n8n 官方 Docker 安裝範例以 <code>-p 5678:5678</code> 將本機 port 對到 container port。",
        "確認。本週實測 <code>http://localhost:5678</code> 回應 <code>200</code>。",
        "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>"
      ],
      [
        "n8n Server CLI 可在 Docker container 內用 <code>docker exec</code> 執行。",
        "確認。本週使用 <code>n8n export:workflow --all</code> 與 <code>n8n export:credentials --all</code> 驗證資料仍存在。",
        "<a href=\"https://docs.n8n.io/hosting/cli-commands/\">n8n Server CLI commands</a>"
      ],
      [
        "n8n Server CLI 支援匯入 workflow 與 credentials。",
        "確認。本週使用 <code>import:workflow</code> 與 <code>import:credentials</code> 建立 persistence probes。",
        "<a href=\"https://docs.n8n.io/hosting/cli-commands/\">n8n Server CLI commands</a>"
      ],
      [
        "Docker volume 的內容存在於單一 container lifecycle 之外；container 被刪除時 writable layer 會被刪掉，但 volume 仍可保留資料。",
        "確認。這是本週 persistence 驗證的核心。",
        "<a href=\"https://docs.docker.com/engine/storage/volumes/\">Docker volumes</a>"
      ],
      [
        "<code>docker volume create [VOLUME]</code> 會建立可供 container 使用與存放資料的 volume。",
        "確認。本週建立 <code>n8n_data</code>。",
        "<a href=\"https://docs.docker.com/reference/cli/docker/volume/create/\">docker volume create</a>"
      ],
      [
        "Docker Desktop for Mac 官方文件提供安裝、啟動與系統需求；本機 macOS 使用 Docker Desktop context。",
        "確認。本週實測 context 為 <code>desktop-linux</code>。",
        "<a href=\"https://docs.docker.com/desktop/setup/install/mac-install/\">Install Docker Desktop on Mac</a>"
      ],
      [
        "Docker Desktop for Windows 官方文件提供 WSL 2 / Hyper-V 安裝模式與啟動方式。",
        "確認。Windows 使用者可依同一份 Docker command 模型啟動 n8n。",
        "<a href=\"https://docs.docker.com/desktop/setup/install/windows-install/\">Install Docker Desktop on Windows</a>"
      ]
    ],
    "week5-source-table"
  );

  addPage(
    "Chapter 5 · Section 5.2",
    "官方來源核對",
    `
      <section class="chapter-section full">
        <div class="section-number">5.2</div>
        <div>
          <h3>官方來源核對</h3>
          <p>本週只採用官方文件作為安裝與驗證依據。Docker Desktop 是本機 runtime；n8n 的 workflows、credentials、settings 與 encryption key 需要留在 persistent volume 才能跨 container 重建保存。</p>
          ${sourceRows}
        </div>
      </section>
    `
  );

  const environmentRows = renderReportTable(
    ["項目", "本週實測值"],
    [
      ["作業系統端", "macOS Docker Desktop"],
      ["Docker context", "<code>desktop-linux</code>"],
      ["Docker client", "<code>29.2.1</code>"],
      ["Docker server", "<code>29.2.1</code>"],
      ["Docker server OS / arch", "<code>linux / arm64</code>"],
      ["n8n image", "<code>docker.n8n.io/n8nio/n8n:latest</code>"],
      ["n8n version", "<code>2.22.4</code>"],
      ["image digest", "<code>docker.n8n.io/n8nio/n8n@sha256:a3ea08b6b923d909b125c7b06273c16679491f07a05857a2dc0df9d9124080db</code>"],
      ["container name", "<code>n8n-week5-local</code>"],
      ["volume name", "<code>n8n_data</code>"],
      ["n8n data mount", "<code>n8n_data:/home/node/.n8n</code>"],
      ["port mapping", "<code>0.0.0.0:5678->5678/tcp</code>"],
      ["local URL", "<code>http://localhost:5678</code>"]
    ],
    "env-table"
  );

  addPage(
    "Chapter 5 · Section 5.3",
    "交付物一：本機部署紀錄",
    `
      <section class="chapter-section full">
        <div class="section-number">5.3</div>
        <div>
          <h3>5.3.1 實測環境</h3>
          <p>這一頁保留本週實際環境值。後續若要重跑 Week 05，先比對 Docker 版本、image tag、container name、volume name 與 mount path。</p>
          ${environmentRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.3 continued",
    "啟動 Docker Desktop、建立 Volume、拉取 Image",
    `
      <section class="chapter-section">
        <div class="section-number">5.3</div>
        <div>
          <h3>5.3.2 啟動 Docker Desktop</h3>
          <p>本機一開始 Docker CLI 已安裝，但 Docker Desktop daemon 尚未啟動，因此先啟動 Docker Desktop，再確認 daemon 可用。</p>
          ${renderCodeBlock("open -a Docker", "short")}
          ${renderCodeBlock("docker version --format 'client={{.Client.Version}} server={{.Server.Version}}'", "short")}
          ${renderCodeBlock("client=29.2.1 server=29.2.1", "short output")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">5.3</div>
        <div>
          <h3>5.3.3 建立 persistent volume 與拉取官方 image</h3>
          ${renderCodeBlock("docker volume create n8n_data", "short")}
          ${renderCodeBlock("n8n_data", "short output")}
          ${renderCodeBlock("docker pull docker.n8n.io/n8nio/n8n", "short")}
          ${renderCodeBlock("Using default tag: latest\nStatus: Downloaded newer image for docker.n8n.io/n8nio/n8n:latest\ndocker.n8n.io/n8nio/n8n:latest", "output")}
        </div>
      </section>
    `
  );

  const workflowProbeRows = renderReportTable(
    ["欄位", "值"],
    [
      ["workflow id", "<code>week05PersistenceProbe</code>"],
      ["workflow name", "<code>Week 05 Persistence Probe</code>"],
      ["node 1", "<code>Manual Trigger</code>"],
      ["node 2", "<code>Persistence Marker</code>"],
      ["marker payload", "<code>week=5</code>、<code>persisted=true</code>、<code>checkedDate=2026-05-27</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 5 · Section 5.3 continued",
    "匯入 Persistence Probe Workflow",
    `
      <section class="chapter-section full">
        <div class="section-number">5.3</div>
        <div>
          <h3>5.3.4 匯入 persistence probe workflow</h3>
          <p>測試 workflow 檔案：<code>artifacts/week-05-persistence-workflow.json</code>。這個 probe 用來在重建 container 後確認 workflow 仍能由 n8n CLI 匯出。</p>
          ${renderCodeBlock(`docker run --rm --name n8n-week5-import \\
  -e GENERIC_TIMEZONE=Asia/Taipei \\
  -e TZ=Asia/Taipei \\
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
  -e N8N_RUNNERS_ENABLED=true \\
  -v n8n_data:/home/node/.n8n \\
  -v /Users/linshangche/Desktop/projects/nuva-report/artifacts/week-05-persistence-workflow.json:/tmp/week-05-persistence-workflow.json:ro \\
  docker.n8n.io/n8nio/n8n \\
  import:workflow --input=/tmp/week-05-persistence-workflow.json`)}
          ${renderCodeBlock("Importing 1 workflows\nSuccessfully imported 1 workflow.", "output")}
          ${workflowProbeRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.3 continued",
    "啟動 n8n Container",
    `
      <section class="chapter-section full">
        <div class="section-number">5.3</div>
        <div>
          <h3>5.3.5 啟動 n8n container</h3>
          <p>本週以官方 n8n image 啟動單一 container，將本機 <code>5678</code> 對到 container <code>5678</code>，並將 <code>n8n_data</code> 掛到 <code>/home/node/.n8n</code>。</p>
          ${renderCodeBlock(`docker run -d --name n8n-week5-local \\
  -p 5678:5678 \\
  -e GENERIC_TIMEZONE=Asia/Taipei \\
  -e TZ=Asia/Taipei \\
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
  -e N8N_RUNNERS_ENABLED=true \\
  -v n8n_data:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n`)}
          ${renderCodeBlock("aa3a92326847edea6ff41de72f358a8fc70f59ad1923195f8cae4ec0615310c3", "output")}
          <div class="command-grid">
            <div>
              <h3>HTTP readiness 檢查</h3>
              ${renderCodeBlock("curl -s -o /dev/null -w '%{http_code}' http://localhost:5678", "short")}
            </div>
            <div>
              <h3>實際結果</h3>
              ${renderCodeBlock("200", "short output")}
            </div>
          </div>
        </div>
      </section>
    `
  );

  const credentialProbeRows = renderReportTable(
    ["欄位", "值"],
    [
      ["credential id", "<code>week05CredentialProbe</code>"],
      ["credential name", "<code>Week 05 Credential Probe</code>"],
      ["credential type", "<code>httpBasicAuth</code>"],
      ["data 性質", "dummy username/password，僅用於 persistence 驗證"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 5 · Section 5.3 continued",
    "匯入 Persistence Probe Credential",
    `
      <section class="chapter-section full">
        <div class="section-number">5.3</div>
        <div>
          <h3>5.3.6 匯入 persistence probe credential</h3>
          <p>測試 credential 檔案：<code>artifacts/week-05-persistence-credential.json</code>。credential probe 只使用 dummy data，不包含真實 API key、OAuth token 或客戶資料。</p>
          ${renderCodeBlock(`docker cp /Users/linshangche/Desktop/projects/nuva-report/artifacts/week-05-persistence-credential.json n8n-week5-local:/tmp/week-05-persistence-credential.json
docker exec n8n-week5-local n8n import:credentials --input=/tmp/week-05-persistence-credential.json`)}
          ${renderCodeBlock("Successfully imported 1 credential.", "output")}
          ${credentialProbeRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.4",
    "交付物二：Container / Volume 文字紀錄",
    `
      <section class="chapter-section">
        <div class="section-number">5.4</div>
        <div>
          <h3>5.4.1 container 狀態紀錄</h3>
          <p>重建後目前仍在執行的 container：</p>
          ${renderCodeBlock("CONTAINER ID   NAMES             IMAGE                     STATUS          PORTS\n4a1ae7f019d1   n8n-week5-local   docker.n8n.io/n8nio/n8n   Up 13 seconds   0.0.0.0:5678->5678/tcp, [::]:5678->5678/tcp", "output")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">5.4</div>
        <div>
          <h3>container inspect 摘要</h3>
          ${renderCodeBlock("id=4a1ae7f019d1e4669201c3d91a834bb8a604a2cbbc861ba656cd32a1421c3a84\nimage=docker.n8n.io/n8nio/n8n\nstatus=running\nstarted=2026-05-27T14:21:05.621583133Z\nmounts=n8n_data:/home/node/.n8n:volume\nenv=GENERIC_TIMEZONE=Asia/Taipei TZ=Asia/Taipei N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true N8N_RUNNERS_ENABLED=true", "output")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.4 continued",
    "Volume 狀態與資料流圖",
    `
      <section class="chapter-section">
        <div class="section-number">5.4</div>
        <div>
          <h3>5.4.2 volume 狀態紀錄</h3>
          ${renderCodeBlock("name=n8n_data driver=local mountpoint=/var/lib/docker/volumes/n8n_data/_data created=2026-05-27T14:17:22Z", "output")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">5.4</div>
        <div>
          <h3>5.4.3 資料流圖</h3>
          <div class="docker-path-map">
            <div>Browser<br><small>localhost:5678</small></div>
            <span>→</span>
            <div>Port mapping<br><small>5678 to 5678</small></div>
            <span>→</span>
            <div>n8n container<br><small>n8n-week5-local</small></div>
            <span>→</span>
            <div>Mounted path<br><small>/home/node/.n8n</small></div>
            <span>→</span>
            <div>Named volume<br><small>n8n_data</small></div>
            <span>→</span>
            <div>Local state<br><small>SQLite · config · key</small></div>
          </div>
        </div>
      </section>
    `
  );

  const boundaryRows = renderReportTable(
    ["元件", "角色", "被刪除時的影響", "本週判斷"],
    [
      ["<code>n8n-week5-local</code> container", "執行 n8n process、提供 <code>localhost:5678</code> UI。", "container writable layer 會消失。", "可重建。"],
      ["<code>n8n_data</code> volume", "保存 <code>/home/node/.n8n</code> 裡的 n8n state。", "不會因 <code>docker rm n8n-week5-local</code> 自動刪除。", "必須保留。"],
      ["<code>docker.n8n.io/n8nio/n8n</code> image", "提供 n8n runtime。", "可重新 pull。", "可替換，但升級前要備份 volume。"],
      ["<code>/home/node/.n8n/config</code>", "保存 auto-generated encryption key。", "若遺失，credentials 可能無法解密。", "已在 volume 內。"],
      ["SQLite database", "保存 workflows、credentials metadata、executions。", "若 volume 遺失，workflow 與 credential 會消失。", "已在 volume 內。"]
    ],
    "docker-table"
  );

  addPage(
    "Chapter 5 · Section 5.4 continued",
    "Container 與 Volume 的責任邊界",
    `
      <section class="chapter-section full">
        <div class="section-number">5.4</div>
        <div>
          <h3>5.4.4 Container 與 Volume 的責任邊界</h3>
          <p>這張表是 Week 05 的核心心智模型：container 是執行層，volume 是狀態層。把兩者混在一起，就會誤以為 container 刪掉還能自動保留資料。</p>
          ${boundaryRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.5",
    "交付物三：重建後 Persistence 驗證",
    `
      <section class="chapter-section full">
        <div class="section-number">5.5</div>
        <div>
          <h3>5.5.1 驗證流程</h3>
          <p>本週使用「刪除並重建 container」作為 persistence 驗證。這符合第 5 週驗收條件中的「重啟 Docker Desktop 或重建 container 後，workflow 與 credential 仍存在」。</p>
          <div class="persistence-flow">
            <div><span>CLI</span><strong>import workflow probe</strong><small>寫入 n8n_data</small></div>
            <div><span>C1</span><strong>start first container</strong><small>掛載 /home/node/.n8n</small></div>
            <div><span>CLI</span><strong>import credential probe</strong><small>dummy credential</small></div>
            <div><span>C1</span><strong>stop and remove</strong><small>刪除 container</small></div>
            <div><span>C2</span><strong>recreate container</strong><small>使用同一 volume</small></div>
            <div><span>CLI</span><strong>export workflows / credentials</strong><small>確認資料仍在</small></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.5 continued",
    "重建 Container 命令",
    `
      <section class="chapter-section full">
        <div class="section-number">5.5</div>
        <div>
          <h3>5.5.2 重建 container 命令</h3>
          <p>停止舊 container、刪除舊 container，然後用同一個 <code>n8n_data</code> volume 重建。</p>
          <div class="command-grid">
            <div>
              <h3>停止與刪除</h3>
              ${renderCodeBlock("docker stop n8n-week5-local\ndocker rm n8n-week5-local")}
            </div>
            <div>
              <h3>重建 container</h3>
              ${renderCodeBlock(`docker run -d --name n8n-week5-local \\
  -p 5678:5678 \\
  -e GENERIC_TIMEZONE=Asia/Taipei \\
  -e TZ=Asia/Taipei \\
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
  -e N8N_RUNNERS_ENABLED=true \\
  -v n8n_data:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n`)}
            </div>
          </div>
          <p>重建後 container id：</p>
          ${renderCodeBlock("4a1ae7f019d1e4669201c3d91a834bb8a604a2cbbc861ba656cd32a1421c3a84", "output")}
          <p>重建後 HTTP readiness：</p>
          ${renderCodeBlock("http_status=200\ncontainer=4a1ae7f019d1 name=n8n-week5-local status=Up 5 seconds ports=0.0.0.0:5678->5678/tcp, [::]:5678->5678/tcp", "output")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.5 continued",
    "Workflow 與 Credential Persistence 證據",
    `
      <section class="chapter-section">
        <div class="section-number">5.5</div>
        <div>
          <h3>5.5.3 workflow persistence 證據</h3>
          ${renderCodeBlock("docker exec n8n-week5-local n8n export:workflow --all", "short")}
          ${renderCodeBlock("id=week05PersistenceProbe\nname=Week 05 Persistence Probe\nnode=Manual Trigger\nnode=Persistence Marker\npersisted=true\ncheckedDate=2026-05-27", "output")}
          <p>判斷：workflow 在 container 刪除並重建後仍存在，通過。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">5.5</div>
        <div>
          <h3>5.5.4 credential persistence 證據</h3>
          ${renderCodeBlock("docker exec n8n-week5-local n8n export:credentials --all", "short")}
          ${renderCodeBlock("id=week05CredentialProbe\nname=Week 05 Credential Probe\ntype=httpBasicAuth\ndata=encrypted payload", "output")}
          <p>判斷：credential 在 container 刪除並重建後仍存在，通過。</p>
        </div>
      </section>
    `
  );

  const acceptanceRows = renderReportTable(
    ["驗收條件", "實測結果", "結論"],
    [
      ["Docker Desktop 可用", "daemon 啟動後 <code>client=29.2.1 server=29.2.1</code>", "通過"],
      ["<code>n8n_data</code> volume 建立成功", "<code>docker volume create n8n_data</code> 回傳 <code>n8n_data</code>", "通過"],
      ["n8n container 可啟動", "<code>n8n-week5-local</code> running", "通過"],
      ["<code>localhost:5678</code> 可回應", "HTTP status <code>200</code>", "通過"],
      ["workflow 寫入 persistent storage", "<code>Week 05 Persistence Probe</code> 可匯出", "通過"],
      ["credential 寫入 persistent storage", "<code>Week 05 Credential Probe</code> 可匯出", "通過"],
      ["重建 container 後 workflow 仍存在", "重建後 <code>export:workflow --all</code> 仍含 <code>week05PersistenceProbe</code>", "通過"],
      ["重建 container 後 credential 仍存在", "重建後 <code>export:credentials --all</code> 仍含 <code>week05CredentialProbe</code>", "通過"]
    ],
    "evidence-table"
  );

  addPage(
    "Chapter 5 · Section 5.5 continued",
    "驗收結論",
    `
      <section class="chapter-section full">
        <div class="section-number">5.5</div>
        <div>
          <h3>5.5.5 驗收結論</h3>
          ${acceptanceRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.6",
    "圖解與操作心智模型 I",
    `
      <section class="chapter-section full">
        <div class="section-number">5.6</div>
        <div>
          <h3>5.6.1 最少摩擦路線：啟動階段</h3>
          <div class="least-friction-flow">
            <div>Install and start Docker Desktop</div>
            <div>Create n8n_data volume</div>
            <div>Pull official n8n image</div>
            <div>Run n8n container with port 5678</div>
            <div>Open localhost:5678</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.6 continued",
    "圖解與操作心智模型 II",
    `
      <section class="chapter-section full">
        <div class="section-number">5.6</div>
        <div>
          <h3>5.6.1 最少摩擦路線：Persistence 驗證階段</h3>
          <div class="least-friction-flow">
            <div>Create workflow and credential</div>
            <div>Remove container</div>
            <div>Recreate with same volume</div>
            <div>Export workflow and credential</div>
            <div>Persistence confirmed</div>
          </div>
        </div>
      </section>
    `
  );

  const mountRows = renderReportTable(
    ["做法", "命令片段", "結果"],
    [
      ["正確", "<code>-v n8n_data:/home/node/.n8n</code>", "n8n state 寫入 named volume，container 可刪可重建。"],
      ["錯誤", "不掛 volume", "n8n state 留在 container writable layer，刪 container 後資料消失。"],
      ["錯誤", "<code>-v n8n_data:/tmp/n8n</code>", "volume 存在，但 n8n 不會把主要 state 寫到正確路徑。"],
      ["高風險", "每次用不同 volume name", "新 container 看不到舊 workflow 與 credential。"],
      ["高風險", "刪除 <code>n8n_data</code>", "workflows、credentials、config 與 encryption key 會一起消失。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 5 · Section 5.6 continued",
    "正確與錯誤 Mount 對照",
    `
      <section class="chapter-section full">
        <div class="section-number">5.6</div>
        <div>
          <h3>5.6.2 正確與錯誤 mount 對照</h3>
          ${mountRows}
          <div class="tip-callout">
            <strong>小補充</strong>
            <p>volume name 對，但 mount path 錯，也等於沒有把 n8n 主要 state 放到正確位置。Week 05 的正確答案必須同時包含 <code>n8n_data</code> 與 <code>/home/node/.n8n</code>。</p>
          </div>
        </div>
      </section>
    `
  );

  const mistakeRows = renderReportTable(
    ["檢查項", "正確答案"],
    [
      ["volume name", "<code>n8n_data</code>"],
      ["n8n state path", "<code>/home/node/.n8n</code>"],
      ["local port mapping", "<code>-p 5678:5678</code>"],
      ["local URL", "<code>http://localhost:5678</code>"],
      ["container 可重建嗎", "可以，只要同一個 volume 還在。"],
      ["volume 可以隨手 prune 嗎", "不可以，<code>docker volume prune</code> 可能刪掉未使用但仍重要的 n8n volume。"],
      ["credential persistence 只看 workflow 夠嗎", "不夠，必須用 <code>export:credentials --all</code> 或 UI 確認 credential 仍存在。"],
      ["本機 Docker 適合 production public webhook 嗎", "不適合，本週只驗本機學習與低摩擦啟動。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 5 · Section 5.6 continued",
    "第 5 週不可犯錯清單",
    `
      <section class="chapter-section full">
        <div class="section-number">5.6</div>
        <div>
          <h3>5.6.3 第 5 週不可犯錯清單</h3>
          ${mistakeRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.7",
    "驗收條件說明",
    `
      <section class="chapter-section">
        <div class="section-number">5.7</div>
        <div>
          <h3>題目</h3>
          <div class="note-band">
            <strong>驗收題</strong>
            <p>重建 container 後，workflow 與 credential 為什麼仍存在？</p>
          </div>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">5.7</div>
        <div>
          <h3>60 秒標準回答</h3>
          <div class="script-box">
            <p>因為 n8n 的本機狀態沒有留在 container writable layer，而是透過 <code>-v n8n_data:/home/node/.n8n</code> 寫進 Docker named volume。Docker 官方文件說明，volume 的內容存在於特定 container lifecycle 之外；container 被刪除時 writable layer 會消失，但 volume 仍保留。n8n 官方 Docker 安裝也把 <code>n8n_data</code> 掛到 <code>/home/node/.n8n</code>，這個路徑會保存 SQLite database、config、encryption key、workflow、credential metadata 與本機 instance state。本週已刪除並重建 <code>n8n-week5-local</code> container，重建後 <code>n8n export:workflow --all</code> 仍看到 <code>Week 05 Persistence Probe</code>，<code>n8n export:credentials --all</code> 仍看到 <code>Week 05 Credential Probe</code>，所以 persistence 驗證通過。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.7 continued",
    "15 秒版本",
    `
      <section class="chapter-section full">
        <div class="section-number">5.7</div>
        <div>
          <h3>15 秒版本</h3>
          <div class="note-band">
            <strong>短答</strong>
            <p>資料能留下來，是因為 <code>n8n_data</code> 掛到 <code>/home/node/.n8n</code>。container 可刪可重建，但同一個 volume 保留了 workflow、credential、SQLite database 與 encryption key。</p>
          </div>
          <div class="state-equation">
            <span>container</span>
            <strong>可重建</strong>
            <span>n8n_data volume</span>
            <strong>不可隨手刪</strong>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.8",
    "本機部署操作手冊 I",
    `
      <section class="chapter-section full">
        <div class="section-number">5.8</div>
        <div>
          <h3>8.1-8.6 啟動、停止、查看狀態、logs、匯出</h3>
          <div class="ops-grid">
            <div><span>啟動</span>${renderCodeBlock("docker start n8n-week5-local", "short")}</div>
            <div><span>停止</span>${renderCodeBlock("docker stop n8n-week5-local", "short")}</div>
            <div><span>查看狀態</span>${renderCodeBlock("docker ps --filter name='^/n8n-week5-local$'", "short")}</div>
            <div><span>查看 logs</span>${renderCodeBlock("docker logs --tail=120 n8n-week5-local", "short")}</div>
            <div><span>匯出 workflows</span>${renderCodeBlock("docker exec n8n-week5-local n8n export:workflow --all", "short")}</div>
            <div><span>匯出 credentials</span>${renderCodeBlock("docker exec n8n-week5-local n8n export:credentials --all", "short")}</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.8 continued",
    "本機部署操作手冊 II",
    `
      <section class="chapter-section">
        <div class="section-number">5.8</div>
        <div>
          <h3>8.7 重建 container</h3>
          ${renderCodeBlock(`docker stop n8n-week5-local
docker rm n8n-week5-local
docker run -d --name n8n-week5-local \\
  -p 5678:5678 \\
  -e GENERIC_TIMEZONE=Asia/Taipei \\
  -e TZ=Asia/Taipei \\
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
  -e N8N_RUNNERS_ENABLED=true \\
  -v n8n_data:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n`)}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">5.8</div>
        <div>
          <h3>8.8 清理測試環境</h3>
          ${renderCodeBlock("docker stop n8n-week5-local\ndocker rm n8n-week5-local\n\ndocker volume rm n8n_data")}
          <div class="tip-callout">
            <strong>清理警告</strong>
            <p>清理 volume 會刪除本週 n8n 本機資料，包括 workflow、credential、config 與 encryption key。除非已完成備份或確定不再需要本機 n8n state，否則不要執行。</p>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 05 計畫要求", "通過"],
      ["已核對官方 n8n Docker 文件", "通過"],
      ["已核對官方 Docker volume 文件", "通過"],
      ["Docker Desktop daemon 已啟動", "通過"],
      ["已建立 <code>n8n_data</code> volume", "通過"],
      ["已拉取官方 n8n image", "通過"],
      ["已啟動 <code>n8n-week5-local</code> container", "通過"],
      ["已確認 <code>localhost:5678</code> 回應", "通過"],
      ["已建立 workflow persistence probe", "通過"],
      ["已建立 credential persistence probe", "通過"],
      ["已刪除並重建 container", "通過"],
      ["已驗證 workflow 重建後仍存在", "通過"],
      ["已驗證 credential 重建後仍存在", "通過"],
      ["未使用真實 API key 或客戶 credential", "通過"],
      ["未刪除既有 Supabase containers 或既有 user volumes", "通過"],
      ["未提前執行 Week 06 npm 比較或 Week 10 VPS/Caddy 部署", "通過"]
    ],
    "week5-completion-table"
  );

  addPage(
    "Chapter 5 · Section 5.9",
    "Week 05 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">5.9</div>
        <div>
          <h3>Week 05 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 5 · Section 5.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">5.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>第 6 週可以進入 <code>npm</code> 與單容器路線比較。第 5 週已證明「本機 Docker Desktop + named volume」能低摩擦啟動並保留狀態；第 6 週要回答的是：如果不用 Docker，改用 <code>npm</code> 或直接跑單一 runtime，安裝、升級、資料保存、rollback、隔離性與可移植性會差在哪裡。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 05 的最低合格答案是：我能用 Docker Desktop 跑起 n8n，也能證明資料不是靠 container 活著，而是靠 <code>n8n_data:/home/node/.n8n</code> 這條 state boundary 活著。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekSixChapter(week, startIndex) {
  const source = "docs/week-06-npm-vs-docker-single-container.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["npm vs Docker 比較表", "完成", "6.4", "能從啟動速度、Node.js 版本、全域依賴、升級、rollback、隔離性、資料保存與 production 風險比較。"],
      ["本機啟動命令筆記", "完成", "6.5", "實際執行 <code>npx --yes n8n --version</code> 與 <code>npx --yes n8n start</code>，並避開第 5 週 Docker port。"],
      ["不適合 production 的原因清單", "完成", "6.6", "能說明 npm quick start 何時應停止作為長期方案。"],
      ["路線決策圖", "完成", "6.7", "能從 local learning、durable local self-host、team/production 三種狀態選路線。"],
      ["驗收說明", "完成", "6.8", "能同時說明 npm quick start 的價值與停止使用它的時機。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 6 · Week 06",
    "npm 與單容器路線比較",
    `
      <div class="chapter-summary">
        <div class="week-icon">CMP</div>
        <div>
          <p class="kicker">6.0 本週定位</p>
          <p>Week 06 的核心問題是：npm 為什麼快，但 Docker 為什麼通常更適合長期 self-host？本週不是否定 npm，而是把「快速啟動」和「可維運部署」拆開看，避免把能打開 UI 誤認成可以長期承載真實 credentials、public webhook 與 uptime。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">6.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週狀態為完成：三個交付物已全部產出，並已做 npm/npx 實機啟動驗證。驗收重點是能同時承認 npm/npx 的速度價值，也能清楚指出何時必須停止把它當長期方案。</p>
          ${deliverables}
        </div>
      </section>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p><code>npx n8n</code> 是很好的第一步，因為它讓你最快看到 n8n。但只要問題開始涉及資料保存、升級回退、團隊交接、public URL 或 uptime，就要從「快」切換到「可重建」。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-06"
  );

  const sourceRowsA = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      ["n8n npm 安裝頁說明 npm 是在本機快速開始 n8n 的方式，且需要 Node.js。", "確認。本週本機 Node.js 為 <code>v24.13.1</code>。", "<a href=\"https://docs.n8n.io/hosting/installation/npm/\">n8n npm installation</a>"],
      ["n8n npm 安裝頁要求 Node.js 版本介於 <code>20.19</code> 到 <code>24.x</code>，含兩端。", "確認。本週本機 <code>v24.13.1</code> 符合要求。", "<a href=\"https://docs.n8n.io/hosting/installation/npm/\">n8n npm installation</a>"],
      ["n8n 可用 <code>npx n8n</code> 不安裝到 global 直接試跑。", "確認。本週使用 <code>npx --yes n8n --version</code> 與 <code>npx --yes n8n start</code> 實測。", "<a href=\"https://docs.n8n.io/hosting/installation/npm/\">n8n npm installation</a>"],
      ["n8n 可用 <code>npm install n8n -g</code> 安裝到 global，啟動命令是 <code>n8n</code> 或 <code>n8n start</code>。", "確認。本週保留為命令筆記，未污染 global install。", "<a href=\"https://docs.n8n.io/hosting/installation/npm/\">n8n npm installation</a>"],
      ["n8n npm 更新可用 <code>npm update -g n8n</code>，也可用 <code>npm install -g n8n@next</code> 安裝 next。", "確認。這同時代表 npm 路線的升級責任落在本機 npm/global package 管理上。", "<a href=\"https://docs.n8n.io/hosting/installation/npm/\">n8n npm installation</a>"],
      ["n8n tunnel 文件明確標示 tunnel 用於 local development/testing，不安全於 production。", "確認。npm quick start 若要 public webhook，常會自然走到 tunnel，因此 production 界線要特別清楚。", "<a href=\"https://docs.n8n.io/hosting/installation/npm/\">n8n npm installation</a>"]
    ],
    "week6-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      ["npx 可以從 local 或 remote npm package 執行 command；缺少 package 時會裝到 npm cache 並加到 PATH。", "確認。本週第一次 npx 執行下載了 n8n package 並出現 npm dependency warnings。", "<a href=\"https://docs.npmjs.com/cli/v11/commands/npx/\">npm npx command</a>"],
      ["n8n Docker 安裝頁建議 Docker 用於多數 self-host 需求，因為它提供乾淨、隔離的環境並降低 OS/tooling incompatibility。", "確認。這是 Docker single-container 勝過 npm 長期路線的核心。", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>"],
      ["n8n Docker 安裝頁使用 <code>n8n_data:/home/node/.n8n</code> 保存資料。", "確認。第 5 週已真機驗證重建 container 後 workflow 與 credential 仍存在。", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>"],
      ["Docker volume 是 Docker 管理的 persistent data store。", "確認。Docker single-container 以 named volume 取得比 npm user folder 更清楚的資料邊界。", "<a href=\"https://docs.docker.com/engine/storage/volumes/\">Docker volumes</a>"],
      ["<code>N8N_USER_FOLDER</code> 可指定 n8n 建立 <code>.n8n</code> 的路徑，該目錄保存 database file 與 encryption key 等 user-specific data。", "確認。本週使用獨立 user folder 實測後移除，避免把 encryption key 留在 repo。", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">n8n deployment environment variables</a>"],
      ["n8n 預設使用 SQLite，也支援 PostgreSQL。", "確認。第 6 週先比較 npm 與 single-container；第 7 週再進入 Docker Compose + PostgreSQL。", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">n8n database environment variables</a>"]
    ],
    "week6-source-table"
  );

  addPage(
    "Chapter 6 · Section 6.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">6.2</div>
        <div>
          <h3>npm route 官方來源</h3>
          <p>本週只採用官方文件作為事實基礎。npm 路線不是錯；它的價值是快。真正要分清楚的是：快啟動不等於長期可維運。</p>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">6.2</div>
        <div>
          <h3>npx、Docker、Volume 與 State 官方來源</h3>
          <p>這一頁補上 npx 的快啟動機制，以及 Docker / volume / <code>N8N_USER_FOLDER</code> 在 state boundary 上的差異。</p>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  const npmRuntimeRows = renderReportTable(
    ["項目", "實測值"],
    [
      ["Node.js", "<code>v24.13.1</code>"],
      ["npm", "<code>11.8.0</code>"],
      ["npx", "<code>11.8.0</code>"],
      ["npx n8n version", "<code>2.22.4</code>"],
      ["npm/npx 測試 port", "<code>5686</code>"],
      ["npm/npx 測試 URL", "<code>http://localhost:5686</code>"],
      ["npm/npx readiness", "HTTP status <code>200</code>"],
      ["npm/npx 測試 user folder", "<code>artifacts/week-06-npm-user-folder</code>"],
      ["npm/npx 測試 user folder 狀態", "測試後已刪除，只保留去敏紀錄"],
      ["去敏紀錄", "<code>artifacts/week-06-npm-launch-record.json</code>"]
    ],
    "env-table"
  );

  const dockerBaselineRows = renderReportTable(
    ["項目", "實測值"],
    [
      ["Docker container", "<code>n8n-week5-local</code>"],
      ["Docker n8n version", "<code>2.22.4</code>"],
      ["Docker image", "<code>docker.n8n.io/n8nio/n8n:latest</code>"],
      ["Docker volume", "<code>n8n_data</code>"],
      ["Docker mount", "<code>n8n_data:/home/node/.n8n</code>"],
      ["Docker port", "<code>0.0.0.0:5678->5678/tcp</code>"],
      ["Docker persistence", "第 5 週已驗證 workflow 與 credential 重建 container 後仍存在"]
    ],
    "env-table"
  );

  addPage(
    "Chapter 6 · Section 6.3",
    "實測環境與結果 I",
    `
      <section class="chapter-section">
        <div class="section-number">6.3</div>
        <div>
          <h3>3.1 本機 runtime</h3>
          ${npmRuntimeRows}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">6.3</div>
        <div>
          <h3>3.2 第 5 週 Docker baseline</h3>
          ${dockerBaselineRows}
        </div>
      </section>
    `
  );

  const observationRows = renderReportTable(
    ["觀察", "結果", "判讀"],
    [
      ["<code>npx --yes n8n --version</code>", "回傳 <code>2.22.4</code>", "npm quick start 能快速取得 n8n。"],
      ["首次 npx 下載", "出現多個 <code>ERESOLVE overriding peer dependency</code> warning", "npm 路線直接暴露在本機 npm dependency resolution 中。"],
      ["首次 npx 下載", "出現多個 deprecated package warning", "npm quick start 不等於「無維運成本」。"],
      ["<code>npx --yes n8n start</code>", "啟動成功，editor 可由 <code>http://localhost:5686</code> 存取", "本機快速試跑通過。"],
      ["runtime user folder", "產生 <code>.n8n/config</code>、<code>database.sqlite</code>、WAL/SHM、event log、nodes package file", "npm route 的 state 會落在 user folder，不是 Docker volume。"],
      ["n8n runtime warning", "<code>N8N_RUNNERS_ENABLED</code> 在 <code>2.22.4</code> 已提示不再需要", "實際版本與文件範例可能有時間差，production 應以當前版本 release notes 與 logs 校正。"],
      ["test cleanup", "已停止 port <code>5686</code> npx process，並刪除測試 user folder", "避免臨時 encryption key 與 SQLite state 留在 repo。"]
    ],
    "week6-observation-table"
  );

  addPage(
    "Chapter 6 · Section 6.3 continued",
    "實測環境與結果 II",
    `
      <section class="chapter-section full">
        <div class="section-number">6.3</div>
        <div>
          <h3>3.3 npm/npx 實測觀察</h3>
          ${observationRows}
        </div>
      </section>
    `
  );

  const comparisonA = renderReportTable(
    ["比較面向", "npm / npx quick start", "npm global install", "Docker single-container", "判斷"],
    [
      ["啟動速度", "最快，<code>npx n8n</code> 可直接下載並跑。", "快，但要先 global install。", "中等，要有 Docker Desktop 或 Docker Engine。", "學習與臨時 demo：npm/npx 勝。"],
      ["本機污染", "主要污染 npm cache；若不指定 <code>N8N_USER_FOLDER</code>，會寫到使用者 <code>.n8n</code>。", "污染 global npm package space，升級也在 global。", "狀態集中在 Docker volume，runtime 在 container。", "長期管理：Docker 勝。"],
      ["Node.js 版本", "依賴本機 Node.js，必須符合 n8n 支援範圍。", "同左。", "image 內已封裝 runtime，不依賴 host Node.js。", "版本隔離：Docker 勝。"],
      ["npm dependency warnings", "可能直接看到 peer/deprecated warnings。", "同左，且 global 更容易累積歷史狀態。", "使用 image 交付，host 不直接解 npm dependency tree。", "降低本機 dependency friction：Docker 勝。"]
    ],
    "week6-comparison-table"
  );

  const comparisonB = renderReportTable(
    ["比較面向", "npm / npx quick start", "npm global install", "Docker single-container", "判斷"],
    [
      ["升級方式", "下次 npx 可能抓新 package；可用版本 spec 固定。", "<code>npm update -g n8n</code> 或 <code>npm install -g n8n@version</code>。", "<code>docker pull</code> image，重建 container 並沿用 volume。", "可重建性與 rollback：Docker 較清楚。"],
      ["rollback", "需指定舊 npm version，且 database migration 仍要小心。", "同左。", "可改用舊 image tag，但 database migration 仍要搭配備份與 release notes。", "兩者都要備份；Docker 的 runtime 回退較明確。"],
      ["資料保存", "取決於 <code>N8N_USER_FOLDER</code> 或 default user <code>.n8n</code>。", "同左。", "<code>n8n_data:/home/node/.n8n</code> 很明確。", "persistence 邊界：Docker 勝。"],
      ["encryption key", "存在 user folder 的 <code>.n8n/config</code>。", "同左。", "存在 volume 的 <code>/home/node/.n8n/config</code>。", "兩者都要備份；Docker 更容易制度化。"]
    ],
    "week6-comparison-table"
  );

  const comparisonC = renderReportTable(
    ["比較面向", "npm / npx quick start", "npm global install", "Docker single-container", "判斷"],
    [
      ["public URL / webhook", "常搭配 tunnel 做 local testing，但不該當 production。", "同左。", "可接 reverse proxy、fixed domain、TLS，但 single-container 仍不是完整 production 架構。", "public self-host：Docker 起步較合理。"],
      ["process supervision", "手動 terminal process，終端關掉就停。", "仍需 PM2/systemd/launchd 等額外配置。", "Docker restart policy / Compose / orchestrator 更自然。", "長期運行：Docker 勝。"],
      ["port 管理", "直接占 host port，容易與其他本機服務衝突。", "同左。", "port mapping 明確，例如 <code>5678:5678</code>。", "可讀性：Docker 稍勝。"],
      ["team 可移植性", "每個人本機 Node/npm 狀態可能不同。", "同左，global install 更不一致。", "image、env、volume、compose file 可文件化。", "團隊一致性：Docker 勝。"],
      ["適合場景", "快速學習、CLI 測試、短期 demo、探索 nodes。", "個人長期本機開發但仍不建議 production。", "本機 durable self-host、低摩擦保存狀態、進入 Compose 前的穩定過渡。", "npm 是入口，Docker 是更好的長期起點。"]
    ],
    "week6-comparison-table"
  );

  addPage(
    "Chapter 6 · Section 6.4",
    "交付物一：npm vs Docker 比較表 I",
    `
      <section class="chapter-section full">
        <div class="section-number">6.4</div>
        <div>
          <h3>4.1 總表：啟動、污染、版本與依賴</h3>
          ${comparisonA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.4 continued",
    "npm vs Docker 比較表 II",
    `
      <section class="chapter-section full">
        <div class="section-number">6.4</div>
        <div>
          <h3>4.1 總表：升級、rollback、資料與 key</h3>
          ${comparisonB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.4 continued",
    "npm vs Docker 比較表 III",
    `
      <section class="chapter-section full">
        <div class="section-number">6.4</div>
        <div>
          <h3>4.1 總表：public URL、監督、port、團隊與場景</h3>
          ${comparisonC}
        </div>
      </section>
    `
  );

  const oneLineRows = renderReportTable(
    ["路線", "一句話"],
    [
      ["<code>npx n8n</code>", "最快看到 n8n UI，但最不像 production。"],
      ["<code>npm install -g n8n</code>", "比 npx 固定一點，但仍受 host Node/npm/global state 影響。"],
      ["Docker single-container", "還不是完整 production，但已把 runtime、port、volume 與重建流程整理成可維運的形狀。"],
      ["Docker Compose + PostgreSQL", "第 7 週目標，開始把 database、service definition、backup 與升級流程制度化。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 6 · Section 6.4 continued",
    "一句話判斷",
    `
      <section class="chapter-section full">
        <div class="section-number">6.4</div>
        <div>
          <h3>4.2 一句話判斷</h3>
          ${oneLineRows}
          <div class="tip-callout">
            <strong>本頁抓重點</strong>
            <p>npm/npx 是速度工具；Docker single-container 是秩序工具；Compose + PostgreSQL 才開始接近 production-like 維運工具。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.5",
    "交付物二：本機啟動命令筆記 I",
    `
      <section class="chapter-section">
        <div class="section-number">6.5</div>
        <div>
          <h3>5.1.1 檢查本機 Node/npm/npx</h3>
          ${renderCodeBlock("node --version\nnpm --version\nnpx --version")}
          ${renderCodeBlock("v24.13.1\n11.8.0\n11.8.0", "output")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">6.5</div>
        <div>
          <h3>5.1.2 檢查 npx 可取得的 n8n 版本</h3>
          ${renderCodeBlock(`N8N_USER_FOLDER=/Users/linshangche/Desktop/projects/nuva-report/artifacts/week-06-npm-user-folder \\
N8N_PORT=5686 \\
GENERIC_TIMEZONE=Asia/Taipei \\
TZ=Asia/Taipei \\
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
N8N_RUNNERS_ENABLED=true \\
npx --yes n8n --version`)}
          ${renderCodeBlock("2.22.4", "output")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.5 continued",
    "用 npx 短暫啟動 n8n",
    `
      <section class="chapter-section full">
        <div class="section-number">6.5</div>
        <div>
          <h3>5.1.3 用 npx 短暫啟動 n8n</h3>
          <p>本週沒有直接使用 default <code>~/.n8n</code>，而是指定獨立 <code>N8N_USER_FOLDER</code>，避免污染使用者真正的 n8n state。因第 5 週 Docker container 已占用 <code>5678</code>，本週 npm/npx route 使用 <code>5686</code>。</p>
          ${renderCodeBlock(`N8N_USER_FOLDER=/Users/linshangche/Desktop/projects/nuva-report/artifacts/week-06-npm-user-folder \\
N8N_PORT=5686 \\
GENERIC_TIMEZONE=Asia/Taipei \\
TZ=Asia/Taipei \\
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
N8N_RUNNERS_ENABLED=true \\
npx --yes n8n start`)}
          ${renderCodeBlock("No encryption key found - Auto-generating and saving to: /Users/linshangche/Desktop/projects/nuva-report/artifacts/week-06-npm-user-folder/.n8n/config\nn8n ready on ::, port 5686\nVersion: 2.22.4\nEditor is now accessible via:\nhttp://localhost:5686", "output")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.5 continued",
    "HTTP Readiness 與 npm/npx State",
    `
      <section class="chapter-section">
        <div class="section-number">6.5</div>
        <div>
          <h3>HTTP readiness</h3>
          ${renderCodeBlock("curl -s -o /dev/null -w 'npm_http_status=%{http_code}\\n' http://localhost:5686", "short")}
          ${renderCodeBlock("npm_http_status=200", "short output")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">6.5</div>
        <div>
          <h3>5.1.4 npm/npx route 產生的 state</h3>
          ${renderCodeBlock(".n8n/config\n.n8n/database.sqlite\n.n8n/database.sqlite-shm\n.n8n/database.sqlite-wal\n.n8n/n8nEventLog.log\n.n8n/nodes/package.json", "output")}
          <p>這些檔案說明 npm route 不是「無狀態」。只要 n8n 啟動，就會建立 user-specific state。<code>.n8n/config</code> 包含 encryption key，<code>database.sqlite</code> 保存本機 instance database。測試後已刪除該 user folder，只留下去敏的 <code>artifacts/week-06-npm-launch-record.json</code>。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.5 continued",
    "npm Global Route 與 Docker Baseline 命令",
    `
      <section class="chapter-section">
        <div class="section-number">6.5</div>
        <div>
          <h3>5.2 npm global route：命令筆記</h3>
          <p>本週未執行 global install，原因是它會改變使用者全域 npm 狀態；但依官方文件，正確命令如下。</p>
          ${renderCodeBlock("npm install n8n -g\nnpm install -g n8n@2.22.4\nn8n\nn8n start\nnpm update -g n8n\nnpm install -g n8n@next")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">6.5</div>
        <div>
          <h3>5.3 Docker single-container route：第 5 週 baseline</h3>
          ${renderCodeBlock(`docker volume create n8n_data
docker run -d --name n8n-week5-local \\
  -p 5678:5678 \\
  -e GENERIC_TIMEZONE=Asia/Taipei \\
  -e TZ=Asia/Taipei \\
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \\
  -e N8N_RUNNERS_ENABLED=true \\
  -v n8n_data:/home/node/.n8n \\
  docker.n8n.io/n8nio/n8n`)}
        </div>
      </section>
    `
  );

  const npmValueRows = renderReportTable(
    ["情境", "為什麼 npm/npx 合理"],
    [
      ["第一次看 n8n UI", "<code>npx n8n</code> 可以最快進入 editor。"],
      ["本機短期 demo", "不需要先寫 Docker/Compose 文件。"],
      ["CLI command 試驗", "可以快速跑 <code>n8n --version</code> 或其他 CLI command。"],
      ["個人探索 nodes", "適合短時間確認功能概念。"],
      ["教學現場", "只要學員已有符合版本的 Node.js，就能快速進入操作。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 6 · Section 6.6",
    "交付物三：npm quick start 何時有價值",
    `
      <section class="chapter-section full">
        <div class="section-number">6.6</div>
        <div>
          <h3>6.1 npm quick start 何時有價值</h3>
          ${npmValueRows}
          <div class="note-band">
            <strong>公平評價</strong>
            <p>npm/npx 的價值很真實：它降低第一步摩擦。但它應該停在 learning、demo、CLI 試驗與探索，不應默默升級成無人維護的 production runtime。</p>
          </div>
        </div>
      </section>
    `
  );

  const stopRowsA = renderReportTable(
    ["停止訊號", "原因", "建議下一步"],
    [
      ["開始放真實 credentials", "encryption key、SQLite、credential state 要有明確備份與 restore discipline。", "轉 Docker single-container，然後規劃 Compose + PostgreSQL。"],
      ["需要穩定 public webhook", "npm 本機 process 加 tunnel 只適合 development/testing。", "轉固定 domain、reverse proxy、TLS。"],
      ["需要 OAuth callback", "random local/tunnel URL 會破壞 callback 穩定性。", "用穩定 public URL 與正式 reverse proxy。"],
      ["需要 uptime", "terminal process、sleep、logout、OS reboot 都可能停服務。", "Docker restart policy、Compose 或 systemd。"],
      ["多人共用 instance", "host global npm state 不適合當團隊一致環境。", "用 image tag、env file、Compose 文件化。"]
    ],
    "stop-table"
  );

  const stopRowsB = renderReportTable(
    ["停止訊號", "原因", "建議下一步"],
    [
      ["要做可預期升級", "npm update 與 host dependency tree 會讓升級責任分散。", "image pinning、backup、staging、rollback procedure。"],
      ["要做 rollback", "npm rollback 還要面對 database migration，不只是降 package。", "先備份 DB/user folder，再按 release notes 回退。"],
      ["要處理大量 executions", "SQLite 與本機 user folder 對長期 execution growth 不理想。", "進入 PostgreSQL 與 pruning 策略。"],
      ["要裝 community nodes", "npm route 會加重 host package 與 supply-chain 管理責任。", "容器化、鎖版本、審查來源。"],
      ["需要監控與告警", "npm process 本身不提供 production supervision。", "Docker/Compose + logs/metrics/health check。"]
    ],
    "stop-table"
  );

  addPage(
    "Chapter 6 · Section 6.6 continued",
    "何時停止把 npm 當長期方案 I",
    `
      <section class="chapter-section full">
        <div class="section-number">6.6</div>
        <div>
          <h3>6.2 停止訊號：credentials、public URL、OAuth、uptime、team</h3>
          ${stopRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.6 continued",
    "何時停止把 npm 當長期方案 II",
    `
      <section class="chapter-section full">
        <div class="section-number">6.6</div>
        <div>
          <h3>6.2 停止訊號：upgrade、rollback、executions、nodes、monitoring</h3>
          ${stopRowsB}
        </div>
      </section>
    `
  );

  const coreReasonsA = renderReportTable(
    ["#", "原因"],
    [
      ["1", "它依賴 host Node.js 版本；n8n 支援範圍會隨版本變動。"],
      ["2", "它依賴 host npm/npx dependency resolution；本週實測出現 peer dependency 與 deprecated package warnings。"],
      ["3", "它的 state 預設落在使用者 <code>.n8n</code>，如果沒有明確設定 <code>N8N_USER_FOLDER</code>，很容易混在個人環境裡。"],
      ["4", "它沒有自然的 container boundary；Node runtime、package cache、global npm package 與 process 都在 host。"],
      ["5", "它沒有自然的 port mapping 文件；port 衝突常被當成 n8n 問題，但其實是 host process 管理問題。"]
    ],
    "compact-table"
  );

  const coreReasonsB = renderReportTable(
    ["#", "原因"],
    [
      ["6", "它沒有自然的 restart policy；terminal 關閉、登出、睡眠或 reboot 都會中斷服務。"],
      ["7", "它不自然支援固定 public URL、TLS termination、reverse proxy、headers 與 webhook/OAuth production flow。"],
      ["8", "它不自然支援 image pinning；production 更需要明確知道目前 runtime 從哪個 artifact 啟動。"],
      ["9", "它不自然支援 team handoff；另一台機器的 Node/npm/global state 可能完全不同。"],
      ["10", "它容易讓人誤判「能打開 UI」等於「能長期維運」。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 6 · Section 6.6 continued",
    "npm quick start 不是 production 的核心原因 I",
    `
      <section class="chapter-section full">
        <div class="section-number">6.6</div>
        <div>
          <h3>6.3 核心原因 1-5</h3>
          ${coreReasonsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.6 continued",
    "npm quick start 不是 production 的核心原因 II",
    `
      <section class="chapter-section full">
        <div class="section-number">6.6</div>
        <div>
          <h3>6.3 核心原因 6-10</h3>
          ${coreReasonsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.7",
    "路線決策圖",
    `
      <section class="chapter-section full">
        <div class="section-number">6.7</div>
        <div>
          <h3>7.1 何時用哪條路線</h3>
          <div class="week6-decision-flow">
            <div><span>Learning?</span><strong>Only learning or short demo</strong><p>Yes → <code>npx n8n</code></p></div>
            <div><span>State?</span><strong>Need state to survive restarts?</strong><p>No → <code>npx n8n</code></p></div>
            <div><span>Isolation?</span><strong>Need clear runtime isolation?</strong><p>No → npm global + explicit <code>N8N_USER_FOLDER</code></p></div>
            <div><span>Durable</span><strong>Docker single-container</strong><p><code>n8n_data:/home/node/.n8n</code></p></div>
            <div><span>Production?</span><strong>Real users, credentials, public webhook, uptime?</strong><p>Yes → Docker Compose + PostgreSQL</p></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.7 continued",
    "npm 與 Docker 的 State Map",
    `
      <section class="chapter-section full">
        <div class="section-number">6.7</div>
        <div>
          <h3>7.2 npm 與 Docker 的 state map</h3>
          <div class="state-map-compare">
            <div>
              <span>NPM / NPX ROUTE</span>
              <strong>npx or global package → host Node.js → N8N_USER_FOLDER/.n8n</strong>
              <p>state 內容：config、SQLite、logs、nodes。風險是 host Node/npm 狀態與 user folder 管理必須自己制度化。</p>
            </div>
            <div>
              <span>DOCKER SINGLE-CONTAINER ROUTE</span>
              <strong>docker image → n8n container → n8n_data volume</strong>
              <p>state 內容：<code>/home/node/.n8n</code> 裡的 config、SQLite、logs、nodes。優點是 runtime 與 state 邊界更清楚。</p>
            </div>
          </div>
        </div>
      </section>
    `
  );

  const upgradeRows = renderReportTable(
    ["路線", "升級動作", "回退動作", "風險"],
    [
      ["npx", "下次執行可能解析到新 package，或用 <code>npx n8n@version</code> 固定。", "改指定舊 version。", "package 可回退不代表 database migration 可安全回退。"],
      ["npm global", "<code>npm update -g n8n</code> 或 <code>npm install -g n8n@version</code>。", "<code>npm install -g n8n@olderVersion</code>。", "global npm state、host Node.js、migration 都要一起考慮。"],
      ["Docker single-container", "<code>docker pull</code> 新 image，stop/rm/run 新 container，沿用 volume。", "使用舊 image tag 重建 container。", "volume 內 database 若已 migrate，仍需 backup/restore 或官方 revert 流程。"],
      ["Compose + PostgreSQL", "更新 compose image tag，配合 DB backup。", "回退 compose tag 與 DB backup/restore。", "較重，但最接近可制度化維運。"]
    ],
    "upgrade-table"
  );

  addPage(
    "Chapter 6 · Section 6.7 continued",
    "升級與 Rollback 心智模型",
    `
      <section class="chapter-section full">
        <div class="section-number">6.7</div>
        <div>
          <h3>7.3 升級與 rollback 心智模型</h3>
          ${upgradeRows}
          <div class="note-band">
            <strong>不可簡化</strong>
            <p>無論 npm 或 Docker，runtime 回退不等於資料庫 migration 回退。只要有真實資料，升級前都要有 backup 與 restore path。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.8",
    "驗收條件說明",
    `
      <section class="chapter-section">
        <div class="section-number">6.8</div>
        <div>
          <h3>題目</h3>
          <div class="note-band">
            <strong>驗收題</strong>
            <p>npm quick start 的價值是什麼？何時該停止使用它當長期方案？</p>
          </div>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">6.8</div>
        <div>
          <h3>60 秒標準回答</h3>
          <div class="script-box">
            <p>npm quick start 的價值是「最快看到 n8n 跑起來」。如果本機 Node.js 符合 n8n 支援版本，<code>npx n8n</code> 可以不用 global install 就下載並啟動 n8n；<code>npm install n8n -g</code> 則可以把 n8n 裝到 global 後用 <code>n8n</code> 或 <code>n8n start</code> 啟動。它非常適合第一次學習、短期 demo、CLI 試驗與個人探索。但一旦開始保存真實 workflow、credentials、OAuth callback、public webhook 或需要 uptime，就應停止把 npm 當長期方案。原因是 npm route 依賴 host Node.js、npm cache、global package 或 user folder；資料會落在 <code>.n8n</code>，包含 database 與 encryption key；process supervision、backup、public URL、TLS、rollback 與 team handoff 都不自然。長期 self-host 應先轉 Docker single-container，讓 runtime、port 與 volume 邊界清楚；再於第 7 週進入 Docker Compose + PostgreSQL。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.8 continued",
    "15 秒版本",
    `
      <section class="chapter-section full">
        <div class="section-number">6.8</div>
        <div>
          <h3>15 秒版本</h3>
          <div class="note-band">
            <strong>短答</strong>
            <p><code>npx n8n</code> 很適合快速學習；但只要有真實 credentials、public webhook、OAuth、uptime、升級回退或團隊使用，就該停止把 npm 當長期方案，改走 Docker，下一步是 Compose + PostgreSQL。</p>
          </div>
          <div class="state-equation">
            <span>npx</span>
            <strong>最快看到 UI</strong>
            <span>Docker</span>
            <strong>更容易長期管理</strong>
            <span>Compose + PostgreSQL</span>
            <strong>production-like baseline</strong>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 06 計畫要求", "通過"],
      ["已核對 n8n npm 官方文件", "通過"],
      ["已核對 n8n Docker 官方文件", "通過"],
      ["已核對 npm npx 官方文件", "通過"],
      ["已核對 Docker volume 官方文件", "通過"],
      ["已核對 <code>N8N_USER_FOLDER</code> 官方說明", "通過"],
      ["已確認本機 Node.js 版本", "通過，<code>v24.13.1</code>"],
      ["已確認本機 npm/npx 版本", "通過，<code>11.8.0</code>"],
      ["已執行 <code>npx --yes n8n --version</code>", "通過，回傳 <code>2.22.4</code>"],
      ["已短暫啟動 npm/npx n8n", "通過，<code>http://localhost:5686</code> 回應 <code>200</code>"],
      ["已停止 npm/npx 測試 process", "通過"],
      ["已移除 npm/npx 測試 user folder", "通過"],
      ["已保留去敏啟動紀錄", "通過，<code>artifacts/week-06-npm-launch-record.json</code>"],
      ["已完成 npm vs Docker 比較表", "通過"],
      ["已完成本機啟動命令筆記", "通過"],
      ["已完成不適合 production 的原因清單", "通過"],
      ["未污染 global npm install", "通過"],
      ["未破壞第 5 週 Docker <code>n8n_data</code> volume", "通過"],
      ["未提前執行 Week 07 Docker Compose + PostgreSQL", "通過"]
    ],
    "week6-completion-table"
  );

  addPage(
    "Chapter 6 · Section 6.9",
    "Week 06 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">6.9</div>
        <div>
          <h3>Week 06 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 6 · Section 6.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">6.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>第 7 週要進入 Docker Compose + PostgreSQL。第 6 週的結論是：npm/npx 是最好的「第一眼看到 UI」路線；Docker single-container 是更穩的本機 self-host 路線；但只要開始需要 production-like reliability，就不能停在 SQLite + single container，下一步要把 database 與 service definition 拆清楚，讓 backup、restore、upgrade 與 rollback 進入可維運狀態。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 06 的核心能力，是把「可以跑」拆成三個等級：可以快速看到 UI、可以保留狀態、可以制度化維運。npm/npx 解第一題；Docker single-container 解第二題；Week 07 的 Compose + PostgreSQL 開始解第三題。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekSevenChapter(week, startIndex) {
  const source = "docs/week-07-docker-compose-postgresql.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "對應章節", "驗收方式"],
    [
      ["Compose 架構解說", "完成", "7.4", "能逐行說明 <code>services</code>、<code>postgres</code>、<code>n8n</code>、<code>depends_on</code>、<code>volumes</code>、<code>ports</code>、<code>environment</code> 的用途。"],
      ["env vars 對照表", "完成", "7.5", "能說明 <code>DB_TYPE=postgresdb</code>、<code>DB_POSTGRESDB_*</code>、<code>N8N_ENCRYPTION_KEY</code> 與 Postgres <code>POSTGRES_*</code> 的用途。"],
      ["PostgreSQL-backed n8n 啟動紀錄", "完成", "7.6", "Compose stack 成功啟動，n8n 走 <code>5687</code>，PostgreSQL healthy，n8n tables 與 workflow probe 寫入 PostgreSQL。"],
      ["production-shaped local stack 判斷", "完成", "7.7", "能說明為什麼它比單容器更接近 production，也能說明它尚未是完整 production。"],
      ["驗收說明", "完成", "7.8", "能逐行解釋 Compose 檔中的 n8n、postgres、volumes、environment。"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 7 · Week 07",
    "Docker Compose + PostgreSQL",
    `
      <div class="chapter-summary">
        <div class="week-icon">PG</div>
        <div>
          <p class="kicker">7.0 本週定位</p>
          <p>Week 07 的核心問題是：如何把單一 container 升級成 production-shaped local stack？這週把 Week 05 的本機 container 與 Week 06 的路線比較往前推一步：用 Compose 描述 n8n 與 PostgreSQL，讓 service、network、volumes、healthcheck、env vars 與啟動順序都能被重建。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">7.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          <p>本週狀態為完成：三個交付物已全部產出，並已做 Docker Compose + PostgreSQL 實機啟動驗證。驗收重點不是只有 UI 可開，而是 n8n 確實以 PostgreSQL 作為 database backend。</p>
          ${deliverables}
        </div>
      </section>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Compose 的價值不是「多開幾個容器」，而是把 app、database、volume、env、network、healthcheck 與啟動順序寫成一份可重建的說明書。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-07"
  );

  const sourceRows = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      ["Docker Compose 用單一 YAML 定義並啟動 multi-container application。", "確認。本週用 <code>compose.yaml</code> 管理 <code>n8n</code> 與 <code>postgres</code> 兩個 service。", "<a href=\"https://docs.docker.com/compose/\">Docker Compose</a>"],
      ["Compose service 的 <code>environment</code> 可以用 map 或 array 設定 container environment variables。", "確認。本週採 map syntax，避免布林與字串混淆。", "<a href=\"https://docs.docker.com/reference/compose-file/services/#environment\">Compose services: environment</a>"],
      ["Compose 的 top-level <code>volumes</code> 可宣告 named volumes；<code>docker compose up</code> 會建立缺少的 volume。", "確認。本週建立 <code>n8n-week7_postgres_data</code> 與 <code>n8n-week7_n8n_data</code>。", "<a href=\"https://docs.docker.com/reference/compose-file/volumes/\">Compose volumes</a>"],
      ["Compose 的 <code>depends_on</code> 可表達 service dependency；本週使用 health condition 讓 n8n 等 PostgreSQL healthy 後再啟動。", "確認。<code>n8n</code> service 依賴 <code>postgres: service_healthy</code>。", "<a href=\"https://docs.docker.com/reference/compose-file/services/\">Compose services</a>"],
      ["n8n 預設使用 SQLite，也支援 PostgreSQL。", "確認。本週明確設定 <code>DB_TYPE=postgresdb</code>。", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">n8n database environment variables</a>"]
    ],
    "week7-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["事實", "核對結果", "官方來源"],
    [
      ["n8n PostgreSQL 設定包含 <code>DB_POSTGRESDB_DATABASE</code>、<code>DB_POSTGRESDB_HOST</code>、<code>DB_POSTGRESDB_PORT</code>、<code>DB_POSTGRESDB_USER</code>、<code>DB_POSTGRESDB_PASSWORD</code>、<code>DB_POSTGRESDB_SCHEMA</code> 等。", "確認。本週使用 database、host、port、user、password；schema 採預設 <code>public</code>。", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">n8n database environment variables</a>"],
      ["n8n <code>N8N_ENCRYPTION_KEY</code> 可提供自訂 key，用於加密 database 中的 credentials；預設是首次啟動隨機產生。", "確認。本週固定 local-only test key，避免重建 n8n user folder 時 credential key 漂移。", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">n8n deployment environment variables</a>"],
      ["n8n 官方 Docker Compose setup 文件提供 Compose 路線，並提醒 self-hosting 需要 server、security、configuration 等知識。", "確認。本週只是 production-shaped local stack，不宣稱已達完整 production。", "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/docker-compose/\">n8n Docker Compose setup</a>"],
      ["Postgres Official Image 使用 <code>POSTGRES_PASSWORD</code> 設定 superuser password，並可用 <code>POSTGRES_USER</code>、<code>POSTGRES_DB</code> 指定使用者與初始 database。", "確認。本週 Postgres service 使用 <code>POSTGRES_DB=n8n_week7</code>、<code>POSTGRES_USER=n8n_week7</code>、<code>POSTGRES_PASSWORD</code> local test value。", "<a href=\"https://hub.docker.com/_/postgres/\">Postgres Official Image</a>"]
    ],
    "week7-source-table"
  );

  addPage(
    "Chapter 7 · Section 7.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">7.2</div>
        <div>
          <h3>Compose、environment、volumes 與 depends_on</h3>
          <p>本週只採用官方文件作為事實基礎。Compose 的任務是讓 multi-container stack 變成可以閱讀、重建與交接的 YAML。</p>
          ${sourceRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">7.2</div>
        <div>
          <h3>n8n PostgreSQL、encryption key 與 Postgres image</h3>
          <p>這一頁補上 n8n database environment variables、固定 encryption key，以及 Postgres 官方 image 的初始化變數。</p>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  const fileRows = renderReportTable(
    ["檔案", "用途"],
    [
      ["<code>artifacts/week-07-compose/compose.yaml</code>", "第 7 週 Docker Compose stack 定義。"],
      ["<code>artifacts/week-07-compose/.env</code>", "第 7 週 local-only environment values。"],
      ["<code>artifacts/week-07-compose/week-07-postgres-workflow.json</code>", "用來驗證 n8n workflow 會寫入 PostgreSQL 的 dummy workflow。"],
      ["<code>artifacts/week-07-compose/week-07-marker.sql</code>", "PostgreSQL 狀態檢查 SQL。"],
      ["<code>artifacts/week-07-compose/week-07-launch-record.json</code>", "去敏後的第 7 週啟動與驗證紀錄。"]
    ],
    "compact-table"
  );

  const stackRows = renderReportTable(
    ["項目", "實測值"],
    [
      ["Docker Compose version", "<code>v5.1.0</code>"],
      ["Compose project", "<code>n8n-week7</code>"],
      ["n8n service", "<code>n8n-week7-n8n-1</code>"],
      ["n8n image", "<code>docker.n8n.io/n8nio/n8n:2.22.4</code>"],
      ["n8n version", "<code>2.22.4</code>"],
      ["n8n host URL", "<code>http://localhost:5687</code>"],
      ["n8n HTTP readiness", "<code>200</code>"],
      ["Postgres service", "<code>n8n-week7-postgres-1</code>"],
      ["Postgres image", "<code>postgres:16-alpine</code>"],
      ["Postgres status", "<code>running</code>"],
      ["Postgres health", "<code>healthy</code>"],
      ["Postgres host exposure", "未發布到 host，只在 Compose network 內提供 <code>5432</code>"],
      ["n8n data volume", "<code>n8n-week7_n8n_data:/home/node/.n8n</code>"],
      ["PostgreSQL data volume", "<code>n8n-week7_postgres_data:/var/lib/postgresql/data</code>"]
    ],
    "week7-stack-table"
  );

  addPage(
    "Chapter 7 · Section 7.3",
    "實測環境與結果 I",
    `
      <section class="chapter-section">
        <div class="section-number">7.3</div>
        <div>
          <h3>3.1 實測檔案</h3>
          ${fileRows}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">7.3</div>
        <div>
          <h3>3.2 Docker Compose stack</h3>
          ${stackRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.3 continued",
    "實測環境與結果 II",
    `
      <section class="chapter-section full">
        <div class="section-number">7.3</div>
        <div>
          <h3>3.3 PostgreSQL-backed 證據</h3>
          <div class="command-grid">
            <div>
              <h3>PostgreSQL 狀態查詢</h3>
              ${renderCodeBlock("database_name | database_user | public_table_count\nn8n_week7     | n8n_week7     | 93", "output")}
            </div>
            <div>
              <h3>關鍵 n8n tables</h3>
              ${renderCodeBlock("credentials_entity\nexecution_entity\nmigrations\nworkflow_entity", "output")}
            </div>
            <div>
              <h3>workflow probe 查詢</h3>
              ${renderCodeBlock("id                   | name                      | active\nweek07PostgresProbe  | Week 07 PostgreSQL Probe  | f", "output")}
            </div>
            <div>
              <h3>restart 後再次驗證</h3>
              ${renderCodeBlock("http_status_after_restart=200\nworkflow_count=1\nmigration_count=184", "output")}
            </div>
          </div>
          <div class="tip-callout">
            <strong>證據判讀</strong>
            <p>n8n 並不是只啟動 UI，而是以 <code>DB_TYPE=postgresdb</code> 連到 Compose network 內的 <code>postgres</code> service，完成 migration，建立 PostgreSQL tables，並能將 workflow 寫入 PostgreSQL。</p>
          </div>
        </div>
      </section>
    `
  );

  const composeYaml = `name: n8n-week7

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 5s
      timeout: 5s
      retries: 20
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: docker.n8n.io/n8nio/n8n:2.22.4
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "5687:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: \${POSTGRES_DB}
      DB_POSTGRESDB_USER: \${POSTGRES_USER}
      DB_POSTGRESDB_PASSWORD: \${POSTGRES_PASSWORD}
      N8N_ENCRYPTION_KEY: \${N8N_ENCRYPTION_KEY}
      N8N_HOST: \${N8N_HOST}
      N8N_PORT: \${N8N_PORT}
      N8N_PROTOCOL: \${N8N_PROTOCOL}
      GENERIC_TIMEZONE: \${GENERIC_TIMEZONE}
      TZ: \${TZ}
      N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS: "true"
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  n8n_data:`;

  addPage(
    "Chapter 7 · Section 7.4",
    "交付物一：Compose 檔完整內容",
    `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div>
          <h3>4.1 Compose 檔完整內容</h3>
          ${renderCodeBlock(composeYaml, "yaml-block")}
        </div>
      </section>
    `
  );

  const explainA = renderReportTable(
    ["行或區塊", "用途", "本週判斷"],
    [
      ["<code>name: n8n-week7</code>", "固定 Compose project name。", "讓 containers、network、volumes 都以 <code>n8n-week7</code> 命名，避免和第 5 週 <code>n8n-week5-local</code> 混淆。"],
      ["<code>services:</code>", "宣告這個 stack 由哪些 container services 組成。", "本週有 <code>postgres</code> 與 <code>n8n</code> 兩個 service。"],
      ["<code>postgres:</code>", "定義 PostgreSQL database service。", "讓 database 從 n8n container 分離出來。"],
      ["<code>image: postgres:16-alpine</code>", "使用官方 Postgres image。", "local stack 使用輕量 Alpine 版本；真 production 要評估版本、備份與升級策略。"],
      ["<code>restart: unless-stopped</code>", "Docker daemon 重啟後，除非曾手動停止，否則嘗試重啟 service。", "比手動 npm process 更接近長期運行。"]
    ],
    "compose-explain-table"
  );

  const explainB = renderReportTable(
    ["行或區塊", "用途", "本週判斷"],
    [
      ["<code>POSTGRES_DB</code>", "初始化 database name。", "本週為 <code>n8n_week7</code>。"],
      ["<code>POSTGRES_USER</code>", "初始化 database user。", "本週為 <code>n8n_week7</code>。"],
      ["<code>POSTGRES_PASSWORD</code>", "初始化 database user password。", "本週使用 local-only test value，不可重用於 production。"],
      ["<code>healthcheck:</code>", "定義 Postgres 健康檢查。", "n8n 可等待 database ready 後再啟動。"],
      ["<code>pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB</code>", "用 Postgres 工具確認 database 可接受連線。", "<code>$$</code> 讓 Compose 保留 <code>$</code> 給 container shell 展開。"],
      ["<code>interval: 5s</code> / <code>timeout: 5s</code> / <code>retries: 20</code>", "設定檢查頻率、timeout 與重試次數。", "給首次 database init 足夠時間，同時避免健康檢查卡太久。"]
    ],
    "compose-explain-table"
  );

  const explainC = renderReportTable(
    ["行或區塊", "用途", "本週判斷"],
    [
      ["<code>postgres_data:/var/lib/postgresql/data</code>", "把 Postgres data directory 放到 named volume。", "database 不會因 container 重建消失。"],
      ["<code>n8n:</code>", "定義 n8n application service。", "這是 workflow editor 與 execution runtime。"],
      ["<code>image: docker.n8n.io/n8nio/n8n:2.22.4</code>", "使用 pin 版 n8n image。", "比 floating <code>latest</code> 更可追蹤。"],
      ["<code>depends_on: postgres: condition: service_healthy</code>", "n8n 等 Postgres healthy 後才啟動。", "降低 n8n 啟動時 database 尚未 ready 的失敗機率。"],
      ["<code>ports: \"5687:5678\"</code>", "host <code>5687</code> 對 container <code>5678</code>。", "避開第 5 週 <code>5678</code>，本週 editor URL 是 <code>http://localhost:5687</code>。"]
    ],
    "compose-explain-table"
  );

  const explainD = renderReportTable(
    ["行或區塊", "用途", "本週判斷"],
    [
      ["<code>DB_TYPE: postgresdb</code>", "告訴 n8n 使用 PostgreSQL。", "第 7 週核心設定。"],
      ["<code>DB_POSTGRESDB_HOST: postgres</code>", "n8n 用 Compose service name 連 database。", "在 Compose network 裡，service name 可作 internal hostname。"],
      ["<code>DB_POSTGRESDB_PORT: 5432</code>", "PostgreSQL container internal port。", "不需要 publish 到 host。"],
      ["<code>DB_POSTGRESDB_DATABASE</code>", "n8n 要連的 database name。", "與 <code>POSTGRES_DB</code> 對齊。"],
      ["<code>DB_POSTGRESDB_USER</code>", "n8n 要使用的 database user。", "與 <code>POSTGRES_USER</code> 對齊。"],
      ["<code>DB_POSTGRESDB_PASSWORD</code>", "n8n 連 PostgreSQL 的 password。", "與 <code>POSTGRES_PASSWORD</code> 對齊。"]
    ],
    "compose-explain-table"
  );

  const explainE = renderReportTable(
    ["行或區塊", "用途", "本週判斷"],
    [
      ["<code>N8N_ENCRYPTION_KEY</code>", "固定 n8n credential encryption key。", "避免 credentials 因 key 漂移而無法解密。"],
      ["<code>N8N_HOST</code>", "n8n 自身 host 設定。", "本週 local 為 <code>localhost</code>。"],
      ["<code>N8N_PORT</code>", "n8n container 內部 port。", "本週保持 <code>5678</code>，host port mapping 才是 <code>5687</code>。"],
      ["<code>N8N_PROTOCOL</code>", "n8n protocol 設定。", "本週 local 為 <code>http</code>；production public edge 應使用 HTTPS。"],
      ["<code>GENERIC_TIMEZONE</code> / <code>TZ</code>", "n8n schedule-oriented nodes timezone 與 container OS timezone。", "本週使用 <code>Asia/Taipei</code>。"],
      ["<code>N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS: \"true\"</code>", "強制 n8n config file 權限更安全。", "使用字串避免 YAML boolean 解析歧義。"],
      ["<code>n8n_data:/home/node/.n8n</code>", "保存 n8n user folder。", "即使用 PostgreSQL，仍要保存 config、encryption key 相關 local state。"],
      ["top-level <code>volumes:</code>", "宣告 Compose-managed named volumes。", "Compose 會建立並管理 <code>n8n-week7_postgres_data</code> 與 <code>n8n-week7_n8n_data</code>。"]
    ],
    "compose-explain-table"
  );

  addPage("Chapter 7 · Section 7.4 continued", "逐行說明 I", `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div><h3>4.2 project、services 與 postgres service</h3>${explainA}</div>
      </section>`);
  addPage("Chapter 7 · Section 7.4 continued", "逐行說明 II", `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div><h3>4.2 Postgres 初始化與 healthcheck</h3>${explainB}</div>
      </section>`);
  addPage("Chapter 7 · Section 7.4 continued", "逐行說明 III", `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div><h3>4.2 volumes、n8n service、depends_on 與 ports</h3>${explainC}</div>
      </section>`);
  addPage("Chapter 7 · Section 7.4 continued", "逐行說明 IV", `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div><h3>4.2 n8n database variables</h3>${explainD}</div>
      </section>`);
  addPage("Chapter 7 · Section 7.4 continued", "逐行說明 V", `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div><h3>4.2 runtime variables 與 top-level volumes</h3>${explainE}</div>
      </section>`);

  addPage(
    "Chapter 7 · Section 7.4 continued",
    "架構圖",
    `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div>
          <h3>4.3 架構圖</h3>
          <div class="compose-architecture-map">
            <div>Browser</div><span>→</span>
            <div>Host port<br><small>5687</small></div><span>→</span>
            <div>n8n service<br><small>container 5678</small></div><span>→</span>
            <div>postgres service<br><small>5432 internal</small></div>
            <div class="wide">n8n_data volume<br><small>/home/node/.n8n</small></div>
            <div class="wide">postgres_data volume<br><small>/var/lib/postgresql/data</small></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.4 continued",
    "啟動順序圖",
    `
      <section class="chapter-section full">
        <div class="section-number">7.4</div>
        <div>
          <h3>4.4 啟動順序圖</h3>
          <div class="compose-startup-flow">
            <div>docker compose up</div>
            <div>Create network</div>
            <div>Start postgres</div>
            <div>Initialize DB</div>
            <div>pg_isready healthy</div>
            <div>Start n8n</div>
            <div>Run migrations</div>
            <div>Editor on localhost:5687</div>
          </div>
        </div>
      </section>
    `
  );

  const envFile = `POSTGRES_DB=n8n_week7
POSTGRES_USER=n8n_week7
POSTGRES_PASSWORD=week7_local_postgres_password_do_not_reuse
N8N_ENCRYPTION_KEY=week7_fixed_local_encryption_key_2026_05_27_do_not_reuse
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
GENERIC_TIMEZONE=Asia/Taipei
TZ=Asia/Taipei`;

  addPage(
    "Chapter 7 · Section 7.5",
    "交付物二：env vars 對照表 I",
    `
      <section class="chapter-section full">
        <div class="section-number">7.5</div>
        <div>
          <h3>5.1 <code>.env</code> 檔內容</h3>
          ${renderCodeBlock(envFile, "dotenv-block")}
          <div class="note-band">
            <strong>local-only</strong>
            <p>這是 local-only test <code>.env</code>。其中 <code>POSTGRES_PASSWORD</code> 與 <code>N8N_ENCRYPTION_KEY</code> 是第 7 週驗證用固定值，不可重用在 production。</p>
          </div>
        </div>
      </section>
    `
  );

  const postgresEnvRows = renderReportTable(
    ["變數", "設定值", "給誰用", "用途", "錯誤後果"],
    [
      ["<code>POSTGRES_DB</code>", "<code>n8n_week7</code>", "<code>postgres</code> service", "初始化 database name。", "n8n 連到不存在的 database，或連到錯誤 database。"],
      ["<code>POSTGRES_USER</code>", "<code>n8n_week7</code>", "<code>postgres</code> service", "初始化 database user。", "n8n 使用者不存在，連線失敗。"],
      ["<code>POSTGRES_PASSWORD</code>", "local-only test value", "<code>postgres</code> service", "初始化 user password。", "password 不一致時 n8n 無法連 DB。"]
    ],
    "env-var-table"
  );

  const n8nDbEnvRows = renderReportTable(
    ["變數", "設定值", "給誰用", "用途", "錯誤後果"],
    [
      ["<code>DB_TYPE</code>", "<code>postgresdb</code>", "<code>n8n</code> service", "讓 n8n 使用 PostgreSQL，不使用預設 SQLite。", "忘記時 n8n 可能回到 SQLite。"],
      ["<code>DB_POSTGRESDB_HOST</code>", "<code>postgres</code>", "<code>n8n</code> service", "Compose network 內的 Postgres service hostname。", "寫 <code>localhost</code> 會指向 n8n container 自己，不是 Postgres container。"],
      ["<code>DB_POSTGRESDB_PORT</code>", "<code>5432</code>", "<code>n8n</code> service", "Postgres internal port。", "port 錯誤會 connection refused 或 timeout。"],
      ["<code>DB_POSTGRESDB_DATABASE</code>", "<code>${POSTGRES_DB}</code>", "<code>n8n</code> service", "n8n 要連的 database。", "database name 不一致時連線或 migration 失敗。"],
      ["<code>DB_POSTGRESDB_USER</code>", "<code>${POSTGRES_USER}</code>", "<code>n8n</code> service", "n8n 要使用的 database user。", "user 不一致時 authentication failed。"],
      ["<code>DB_POSTGRESDB_PASSWORD</code>", "<code>${POSTGRES_PASSWORD}</code>", "<code>n8n</code> service", "n8n 連 DB 的 password。", "password 不一致時 authentication failed。"]
    ],
    "env-var-table"
  );

  addPage(
    "Chapter 7 · Section 7.5 continued",
    "env vars 對照表 II",
    `
      <section class="chapter-section">
        <div class="section-number">7.5</div>
        <div>
          <h3>5.2 Postgres 初始化變數</h3>
          ${postgresEnvRows}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">7.5</div>
        <div>
          <h3>5.3 n8n database 變數</h3>
          ${n8nDbEnvRows}
        </div>
      </section>
    `
  );

  const runtimeEnvRows = renderReportTable(
    ["變數", "設定值", "用途", "第 7 週判斷"],
    [
      ["<code>N8N_ENCRYPTION_KEY</code>", "fixed local-only test value", "加密 database 中的 credentials。", "必須固定，不能靠首次啟動隨機 key。"],
      ["<code>N8N_HOST</code>", "<code>localhost</code>", "n8n host 設定。", "local stack 合理；public self-host 時要改成正式 domain。"],
      ["<code>N8N_PORT</code>", "<code>5678</code>", "n8n container 內部 port。", "不等於 host port；host port 是 <code>5687</code>。"],
      ["<code>N8N_PROTOCOL</code>", "<code>http</code>", "n8n protocol。", "local stack 合理；production public edge 應改成 HTTPS。"],
      ["<code>GENERIC_TIMEZONE</code>", "<code>Asia/Taipei</code>", "n8n schedule-oriented nodes timezone。", "保持工作流排程符合台北時間。"],
      ["<code>TZ</code>", "<code>Asia/Taipei</code>", "container OS timezone。", "讓 container 內系統時間行為一致。"],
      ["<code>N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS</code>", "<code>\"true\"</code>", "強制 config file 權限。", "使用字串避免 YAML boolean 解析歧義。"]
    ],
    "env-var-table"
  );

  addPage(
    "Chapter 7 · Section 7.5 continued",
    "env vars 對照表 III",
    `
      <section class="chapter-section full">
        <div class="section-number">7.5</div>
        <div>
          <h3>5.4 n8n runtime 變數</h3>
          ${runtimeEnvRows}
        </div>
      </section>
    `
  );

  const configRows = renderReportTable(
    ["項目", "結果"],
    [
      ["project name", "<code>n8n-week7</code>"],
      ["n8n image", "<code>docker.n8n.io/n8nio/n8n:2.22.4</code>"],
      ["Postgres image", "<code>postgres:16-alpine</code>"],
      ["n8n port mapping", "host <code>5687</code> to container <code>5678</code>"],
      ["n8n database host", "<code>postgres</code>"],
      ["top-level volumes", "<code>n8n_data</code>、<code>postgres_data</code>"],
      ["depends_on", "<code>postgres: service_healthy</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 7 · Section 7.6",
    "交付物三：PostgreSQL-backed n8n 啟動紀錄 I",
    `
      <section class="chapter-section">
        <div class="section-number">7.6</div>
        <div>
          <h3>6.1 Compose config 解析</h3>
          ${renderCodeBlock("docker compose --env-file artifacts/week-07-compose/.env -f artifacts/week-07-compose/compose.yaml config")}
          ${configRows}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">7.6</div>
        <div>
          <h3>6.2 啟動 stack</h3>
          ${renderCodeBlock("docker compose --env-file artifacts/week-07-compose/.env -f artifacts/week-07-compose/compose.yaml up -d")}
          ${renderCodeBlock("Network n8n-week7_default Created\nVolume n8n-week7_n8n_data Created\nVolume n8n-week7_postgres_data Created\nContainer n8n-week7-postgres-1 Healthy\nContainer n8n-week7-n8n-1 Started", "output")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.6 continued",
    "PostgreSQL-backed n8n 啟動紀錄 II",
    `
      <section class="chapter-section">
        <div class="section-number">7.6</div>
        <div>
          <h3>6.3 服務狀態</h3>
          ${renderCodeBlock("NAME                   IMAGE                            SERVICE    STATUS\nn8n-week7-n8n-1        docker.n8n.io/n8nio/n8n:2.22.4   n8n        Up\nn8n-week7-postgres-1   postgres:16-alpine               postgres   Up healthy", "output")}
          <p>n8n readiness：</p>
          ${renderCodeBlock("http_status=200", "short output")}
          <p>restart 後 readiness：</p>
          ${renderCodeBlock("http_status_after_restart=200", "short output")}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">7.6</div>
        <div>
          <h3>6.4 n8n log 重點</h3>
          ${renderCodeBlock("Version: 2.22.4\nBuilding workflow dependency index\nFinished building workflow dependency index\nEditor is now accessible via:\nhttp://localhost:5678", "output")}
          <p>log 裡 editor 顯示的是 container 內部 n8n port <code>5678</code>；從 host 瀏覽器要開的是 Compose port mapping 後的 <code>http://localhost:5687</code>。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.6 continued",
    "PostgreSQL 查詢",
    `
      <section class="chapter-section full">
        <div class="section-number">7.6</div>
        <div>
          <h3>6.5 PostgreSQL 查詢</h3>
          <p>database 與 table count：</p>
          ${renderCodeBlock("select\n  current_database() as database_name,\n  current_user as database_user,\n  count(*) filter (where schemaname = 'public') as public_table_count\nfrom pg_tables;", "sql-block")}
          ${renderCodeBlock("database_name=n8n_week7\ndatabase_user=n8n_week7\npublic_table_count=93", "output")}
          <p>必要 tables：</p>
          ${renderCodeBlock("select tablename\nfrom pg_tables\nwhere schemaname='public'\n  and tablename in ('workflow_entity','credentials_entity','execution_entity','migrations')\norder by tablename;", "sql-block")}
          ${renderCodeBlock("credentials_entity\nexecution_entity\nmigrations\nworkflow_entity", "output")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.6 continued",
    "workflow probe 寫入 PostgreSQL",
    `
      <section class="chapter-section full">
        <div class="section-number">7.6</div>
        <div>
          <h3>6.6 workflow probe 寫入 PostgreSQL</h3>
          <p>匯入命令：</p>
          ${renderCodeBlock("docker cp artifacts/week-07-compose/week-07-postgres-workflow.json n8n-week7-n8n-1:/tmp/week-07-postgres-workflow.json\ndocker compose --env-file artifacts/week-07-compose/.env -f artifacts/week-07-compose/compose.yaml exec -T n8n n8n import:workflow --input=/tmp/week-07-postgres-workflow.json")}
          ${renderCodeBlock("Importing 1 workflows\nSuccessfully imported 1 workflow.", "output")}
          <p>PostgreSQL 查詢：</p>
          ${renderCodeBlock("select id, name, active\nfrom workflow_entity\nwhere id='week07PostgresProbe';", "sql-block")}
          ${renderCodeBlock("week07PostgresProbe | Week 07 PostgreSQL Probe | f", "output")}
          <p>restart n8n 後：</p>
          ${renderCodeBlock("workflow_count=1", "short output")}
          <div class="tip-callout">
            <strong>證據結論</strong>
            <p>這證明 workflow state 寫入 PostgreSQL，而不是留在 n8n container layer。</p>
          </div>
        </div>
      </section>
    `
  );

  const betterRows = renderReportTable(
    ["改善點", "單容器 Docker", "Compose + PostgreSQL"],
    [
      ["database", "通常預設 SQLite。", "PostgreSQL 獨立 service。"],
      ["service boundary", "n8n process 與 local DB state 容易綁在同一 user folder。", "n8n 與 database 分 service。"],
      ["startup order", "手動啟動單 container。", "<code>depends_on</code> + healthcheck。"],
      ["state boundary", "<code>n8n_data</code> 保存 <code>.n8n</code>。", "<code>n8n_data</code> 保存 n8n local state，<code>postgres_data</code> 保存 DB state。"],
      ["network", "單 container 對外 port。", "n8n 與 postgres 走 internal Compose network。"],
      ["DB host", "不需要 DB host。", "n8n 用 service name <code>postgres</code> 連 DB。"],
      ["image control", "可 pin，也常被寫成 latest。", "本週 pin <code>docker.n8n.io/n8nio/n8n:2.22.4</code>。"],
      ["migration visibility", "SQLite file 內部狀態較不直覺。", "可用 <code>psql</code> 查 <code>migrations</code> 與 n8n tables。"],
      ["production 過渡", "離正式架構較遠。", "可延伸 reverse proxy、TLS、backup、monitoring。"]
    ],
    "production-shape-table"
  );

  addPage(
    "Chapter 7 · Section 7.7",
    "production-shaped local stack 判斷 I",
    `
      <section class="chapter-section full">
        <div class="section-number">7.7</div>
        <div>
          <h3>7.1 比單一 container 更像 production 的原因</h3>
          ${betterRows}
        </div>
      </section>
    `
  );

  const gapRows = renderReportTable(
    ["缺口", "為什麼還不夠"],
    [
      ["TLS", "本週仍是 local HTTP。"],
      ["Reverse proxy", "尚未接 Caddy/Nginx/Traefik。"],
      ["Public URL", "尚未有穩定 domain 與 <code>WEBHOOK_URL</code>。"],
      ["Secrets management", "<code>.env</code> 仍是 local file，production 應改用 secrets manager 或至少權限嚴格控管。"],
      ["Backups", "尚未做 <code>pg_dump</code>、volume backup、restore drill。"],
      ["Monitoring", "尚未做 health alerts、log retention、metrics。"],
      ["Upgrade staging", "尚未做 staging stack 與 release notes 驗證。"],
      ["External task runners", "n8n log 提醒 Python task runner internal mode 不建議 production。"],
      ["Resource limits", "尚未設定 CPU/memory limits。"],
      ["Access control", "尚未完成正式使用者、SSO、network policy 或 firewall。"]
    ],
    "production-gap-table"
  );

  addPage(
    "Chapter 7 · Section 7.7 continued",
    "production-shaped local stack 判斷 II",
    `
      <section class="chapter-section full">
        <div class="section-number">7.7</div>
        <div>
          <h3>7.2 仍不是完整 production 的原因</h3>
          ${gapRows}
          <div class="note-band">
            <strong>定位準確</strong>
            <p>Week 07 是 production-shaped local stack，不是 production。它把資料庫、service definition 與 volume 邊界拆清楚，但還沒補上 public edge、backup、monitoring 與安全治理。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.8",
    "驗收條件說明",
    `
      <section class="chapter-section">
        <div class="section-number">7.8</div>
        <div>
          <h3>題目</h3>
          <div class="note-band">
            <strong>驗收題</strong>
            <p>能逐行說明 Compose 檔裡 n8n、postgres、volumes、environment 的用途。</p>
          </div>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">7.8</div>
        <div>
          <h3>60 秒標準回答</h3>
          <div class="script-box">
            <p>這份 Compose 檔用 <code>name: n8n-week7</code> 固定 project name，避免和其他 Docker 資源混在一起。<code>services.postgres</code> 使用 <code>postgres:16-alpine</code>，透過 <code>POSTGRES_DB</code>、<code>POSTGRES_USER</code>、<code>POSTGRES_PASSWORD</code> 初始化 <code>n8n_week7</code> database 與 user，並把 <code>/var/lib/postgresql/data</code> 掛到 <code>postgres_data</code> named volume，確保 DB state 不因 container 重建消失。<code>healthcheck</code> 用 <code>pg_isready</code> 確認 PostgreSQL healthy。<code>services.n8n</code> 使用 <code>docker.n8n.io/n8nio/n8n:2.22.4</code>，透過 <code>depends_on.postgres.condition=service_healthy</code> 等 database ready 後再啟動，<code>ports</code> 將 host <code>5687</code> 對到 container <code>5678</code>。n8n 的 <code>environment</code> 裡最重要的是 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_HOST=postgres</code>，這讓 n8n 透過 Compose network 連 PostgreSQL，而不是用 SQLite；<code>DB_POSTGRESDB_DATABASE</code>、<code>USER</code>、<code>PASSWORD</code> 要和 Postgres 初始化變數一致。<code>N8N_ENCRYPTION_KEY</code> 必須固定，因為 credentials 需要同一把 key 才能解密。<code>volumes.n8n_data:/home/node/.n8n</code> 保存 n8n local state，top-level <code>volumes</code> 讓 Compose 建立並管理 <code>postgres_data</code> 與 <code>n8n_data</code>。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.8 continued",
    "15 秒版本",
    `
      <section class="chapter-section full">
        <div class="section-number">7.8</div>
        <div>
          <h3>15 秒版本</h3>
          <div class="note-band">
            <strong>短答</strong>
            <p><code>postgres</code> service 保存 PostgreSQL data，<code>n8n</code> service 用 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_HOST=postgres</code> 連它；<code>depends_on</code> 等 DB healthy；<code>postgres_data</code> 存 DB，<code>n8n_data</code> 存 n8n user folder；<code>N8N_ENCRYPTION_KEY</code> 固定 credential 加密 key。</p>
          </div>
          <div class="state-equation">
            <span>postgres service</span>
            <strong>DB state</strong>
            <span>n8n service</span>
            <strong>app runtime</strong>
            <span>Compose file</span>
            <strong>可重建描述</strong>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已讀 Week 07 計畫要求", "通過"],
      ["已核對 Docker Compose 官方文件", "通過"],
      ["已核對 Compose services / environment / volumes 官方文件", "通過"],
      ["已核對 n8n PostgreSQL environment variables", "通過"],
      ["已核對 <code>N8N_ENCRYPTION_KEY</code> 官方說明", "通過"],
      ["已核對 Postgres Official Image environment variables", "通過"],
      ["已建立 <code>artifacts/week-07-compose/compose.yaml</code>", "通過"],
      ["已建立 <code>artifacts/week-07-compose/.env</code>", "通過"],
      ["已固定 <code>N8N_ENCRYPTION_KEY</code>", "通過"],
      ["已設定 <code>DB_TYPE=postgresdb</code>", "通過"],
      ["已設定 <code>DB_POSTGRESDB_*</code>", "通過"],
      ["已使用 <code>depends_on</code> 與 Postgres healthcheck", "通過"],
      ["已建立 Postgres named volume", "通過"],
      ["已建立 n8n named volume", "通過"],
      ["已啟動 PostgreSQL-backed n8n", "通過"],
      ["已確認 <code>http://localhost:5687</code> 回應", "通過"],
      ["已確認 PostgreSQL 有 n8n tables", "通過"],
      ["已匯入 workflow probe 並查到 PostgreSQL row", "通過"],
      ["已重啟 n8n service 後確認 workflow 仍存在", "通過"],
      ["未影響第 5 週 <code>n8n-week5-local</code> container", "通過"],
      ["未提前執行 Week 08 tunnel 與穩定網域", "通過"]
    ],
    "week7-completion-table"
  );

  addPage(
    "Chapter 7 · Section 7.9",
    "Week 07 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">7.9</div>
        <div>
          <h3>Week 07 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 7 · Section 7.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">7.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>第 8 週要處理本機公開、tunnel 與穩定網域。第 7 週已把 n8n 從單容器升級為 Compose + PostgreSQL local stack；第 8 週的重點不是再換 database，而是讓外部服務能穩定呼叫這個 stack，並處理 tunnel URL、<code>WEBHOOK_URL</code>、OAuth callback 與 public URL 穩定性。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 07 的成果，是把 n8n 從「一個 container」升級成「可描述的 local stack」：n8n app、PostgreSQL database、named volumes、healthcheck、env vars 與啟動順序都能被閱讀、重建與驗收。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekEightChapter(week, startIndex) {
  const source = "docs/week-08-tunnel-public-webhook.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["tunnel comparison table", "完成", "本章 8.4"],
      ["public webhook 測試紀錄", "完成", "<code>artifacts/week-08-tunnel/week-08-public-webhook-record.json</code>"],
      ["learning-only vs production-ready 判斷表", "完成", "本章 8.6"],
      ["n8n public URL override", "完成", "<code>artifacts/week-08-tunnel/compose.public-url.override.yaml</code>"],
      ["webhook workflow artifact", "完成", "<code>artifacts/week-08-tunnel/week-08-public-webhook-workflow.json</code>"],
      ["Week 08 驗證腳本", "完成", "<code>scripts/verify-week-eight.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 8 · Week 08",
    "本機公開：Tunnel 與穩定網域",
    `
      <div class="chapter-summary">
        <div class="week-icon">TUN</div>
        <div>
          <p class="kicker">8.0 本週定位</p>
          <p>Week 08 的目標是讓外部服務真的碰到本機 n8n，同時明確切開 learning-only tunnel 與 production-ready public URL。本週完成 Cloudflare Quick Tunnel 公開 POST webhook 測試，HTTP 200；測試完成後已取消發布 workflow、移除 live container 的臨時公開 URL、停止 quick tunnel。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">8.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week8-public-pipeline">
        <div>External POST request</div><span>→</span>
        <div>Cloudflare Quick Tunnel random URL</div><span>→</span>
        <div>cloudflared container</div><span>→</span>
        <div>host.docker.internal:5687</div><span>→</span>
        <div>n8n Webhook node</div><span>→</span>
        <div>HTTP 200 JSON response</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>本週真正驗證的不是「可以開一個公開網址」，而是 public URL 真的能進入 production webhook。測試完成後立刻收回公開入口，這是本週安全邊界的一部分。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-08"
  );

  const sourceRows = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Webhook 測試與 production webhook", "<a href=\"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/workflow-development/\">n8n Webhook workflow development</a>", "Test URL 只適合建置與調試；Production URL 需要 workflow 已保存並發布。"],
      ["<code>WEBHOOK_URL</code> 與 reverse proxy", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">n8n webhook URL with reverse proxy</a>", "n8n 在 proxy 後面時，要用 <code>WEBHOOK_URL</code> 讓 editor 與外部服務看到正確公開 URL。"],
      ["deployment env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">n8n deployment environment variables</a>", "本週使用 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>；計劃書的 <code>EDITOR_BASE_URL</code> 在 n8n 實際變數名稱是 <code>N8N_EDITOR_BASE_URL</code>。"],
      ["n8n built-in tunnel", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>", "n8n built-in tunnel 是 local development/testing convenience，不是 production 安全做法。"],
      ["Cloudflare Quick Tunnel", "<a href=\"https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/\">Cloudflare Quick Tunnel</a>", "Quick Tunnel 會產生 random <code>trycloudflare.com</code> subdomain，適合測試與開發，不適合 production。"]
    ],
    "week8-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Cloudflare named tunnel / routing", "<a href=\"https://developers.cloudflare.com/tunnel/routing/\">Cloudflare Tunnel routing</a>", "production 需要把穩定 hostname 映射到 tunnel service，通常搭配 Cloudflare DNS CNAME 或 tunnel route dns。"],
      ["ngrok domains", "<a href=\"https://ngrok.com/docs/universal-gateway/domains\">ngrok domains</a>", "ngrok 可用 managed/custom domain；random domain 適合臨時分享，reserved/custom domain 才比較適合 callback。"],
      ["Tailscale Funnel", "<a href=\"https://tailscale.com/docs/features/tailscale-funnel\">Tailscale Funnel</a>", "Tailscale Funnel 可把 tailnet 內本機服務公開到 broader internet；適合 controlled sharing，但仍要看 beta、policy 與 domain 穩定性。"],
      ["DDNS", "<a href=\"https://developers.cloudflare.com/dns/manage-dns-records/how-to/managing-dynamic-ip-addresses/\">Cloudflare DDNS</a>", "DDNS 是把動態 IP 更新到 DNS 的方法，仍需要 TLS、reverse proxy、firewall 與 ISP port 條件。"]
    ],
    "week8-source-table"
  );

  addPage(
    "Chapter 8 · Section 8.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">8.2</div>
        <div>
          <h3>Webhook、WEBHOOK_URL、deployment env 與 Quick Tunnel</h3>
          ${sourceRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">8.2</div>
        <div>
          <h3>Named tunnel、ngrok、Tailscale Funnel 與 DDNS</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  const envRows = renderReportTable(
    ["項目", "實測值"],
    [
      ["本機 n8n stack", "Week 07 Compose stack：<code>n8n-week7</code>"],
      ["n8n URL", "<code>http://localhost:5687</code>"],
      ["n8n image", "<code>docker.n8n.io/n8nio/n8n:2.22.4</code>"],
      ["database", "PostgreSQL 16 Alpine，DB <code>n8n_week7</code>"],
      ["quick tunnel image", "<code>cloudflare/cloudflared:latest</code>"],
      ["cloudflared version", "<code>2026.5.2</code>"],
      ["quick tunnel public URL", "<code>https://gif-decent-pharmacies-eligibility.trycloudflare.com</code>"],
      ["temporary <code>WEBHOOK_URL</code>", "<code>https://gif-decent-pharmacies-eligibility.trycloudflare.com</code>"],
      ["temporary <code>N8N_EDITOR_BASE_URL</code>", "<code>https://gif-decent-pharmacies-eligibility.trycloudflare.com</code>"],
      ["temporary <code>N8N_PROXY_HOPS</code>", "<code>1</code>"],
      ["workflow ID", "<code>week08PublicWebhookProbe</code>"],
      ["production webhook path", "<code>/webhook/week-08-public-post</code>"],
      ["POST result", "HTTP 200"],
      ["cleanup result", "workflow 已取消發布；n8n 已重啟回 local-only；quick tunnel 已停止"]
    ],
    "week8-env-table"
  );

  addPage(
    "Chapter 8 · Section 8.3",
    "實測環境與結果",
    `
      <section class="chapter-section full">
        <div class="section-number">8.3</div>
        <div>
          <h3>短時間公開、完成測試、立刻收回</h3>
          ${envRows}
          <div class="note-band">
            <strong>安全邊界</strong>
            <p>本週採取「短時間公開、完成測試、立刻收回」的方式。這讓我們可以證明 public webhook pipeline 成立，同時不留下長時間公開的本機 editor 或 webhook。</p>
          </div>
        </div>
      </section>
    `
  );

  const tunnelRowsA = renderReportTable(
    ["路線", "網域穩定性", "設定複雜度", "優點", "主要風險", "建議定位"],
    [
      ["n8n built-in tunnel", "通常是臨時或版本實作相關", "低", "與 n8n local dev 整合，快速測試 trigger webhook", "官方明確定位 local development/testing；production 安全性與穩定性不足", "learning-only"],
      ["Cloudflare Quick Tunnel", "random <code>trycloudflare.com</code>", "低", "不需 Cloudflare account 或 DNS，能快速驗證外部 POST", "random URL 無 uptime 保證，不適合 OAuth callback 或長期 webhook", "learning-only"],
      ["Cloudflare named tunnel", "自有穩定 hostname", "中", "不需開 inbound port，可配 DNS、Access、WAF、DDoS protection", "需管理 Cloudflare account、DNS、tunnel lifecycle 與 access policy", "production-ready candidate"],
      ["ngrok random domain", "random domain", "低", "開發者體驗好，適合短期分享與 webhook debug", "random URL 會變，外部 service callback 容易失效", "learning-only"]
    ],
    "tunnel-table"
  );

  const tunnelRowsB = renderReportTable(
    ["路線", "網域穩定性", "設定複雜度", "優點", "主要風險", "建議定位"],
    [
      ["ngrok reserved/custom domain", "reserved ngrok domain 或自有 domain", "中", "穩定 callback、TLS 與 inspection tooling 友善", "依方案、流量、domain ownership 與帳號設定", "production-ready candidate"],
      ["Tailscale Funnel", "tailnet DNS name，公開到 internet", "中", "對既有 Tailscale 使用者很方便，可用 policy 控制誰能建立 Funnel", "公開面要小心權限；Funnel 狀態、beta 屬性與 DNS propagation 需納入 runbook", "controlled sharing / selective production"],
      ["DDNS + reverse proxy", "自有 domain 或 subdomain", "中到高", "可用家用或小型辦公室動態 IP，成本低", "ISP CGNAT、port blocking、TLS renew、router/firewall、IP 更新延遲都會影響可靠性", "lab / small self-host candidate"]
    ],
    "tunnel-table"
  );

  addPage(
    "Chapter 8 · Section 8.4",
    "交付物一：tunnel comparison table I",
    `
      <section class="chapter-section full">
        <div class="section-number">8.4</div>
        <div>
          <h3>learning-only 與 production-ready candidate</h3>
          ${tunnelRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.4 continued",
    "交付物一：tunnel comparison table II",
    `
      <section class="chapter-section full">
        <div class="section-number">8.4</div>
        <div>
          <h3>reserved/custom domain、Funnel、DDNS</h3>
          ${tunnelRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.4 continued",
    "Tunnel 路線決策圖",
    `
      <section class="chapter-section full">
        <div class="section-number">8.4</div>
        <div>
          <h3>決策圖</h3>
          <div class="week8-decision-flow">
            <div><span>Need public n8n URL</span><strong>外部服務需要打進 n8n？</strong></div>
            <div><span>One-off?</span><strong>只是一次性測試？</strong><p>Quick Tunnel / random ngrok / n8n built-in tunnel</p></div>
            <div><span>Persistent?</span><strong>外部服務會保存 callback？</strong><p>必須穩定 hostname。</p></div>
            <div><span>Domain?</span><strong>你是否擁有或控制 domain？</strong><p>named tunnel / reserved ngrok / VPS reverse proxy / DDNS with TLS</p></div>
            <div><span>Set URL</span><strong>設定 <code>WEBHOOK_URL</code> + <code>N8N_EDITOR_BASE_URL</code></strong><p>驗證 production webhook。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const testRows = renderReportTable(
    ["步驟", "執行結果"],
    [
      ["1. 匯入 workflow", "<code>week08PublicWebhookProbe</code> 成功匯入 PostgreSQL-backed n8n。"],
      ["2. 發布 workflow", "<code>n8n publish:workflow --id=week08PublicWebhookProbe</code> 成功，並重啟 n8n 讓 production webhook 生效。"],
      ["3. 啟動 quick tunnel", "<code>cloudflared tunnel --url http://host.docker.internal:5687</code> 產生 <code>https://gif-decent-pharmacies-eligibility.trycloudflare.com</code>。"],
      ["4. 注入公開 URL", "Compose override 設定 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS=1</code>。"],
      ["5. 外部 POST", "<code>POST https://gif-decent-pharmacies-eligibility.trycloudflare.com/webhook/week-08-public-post</code> 回 HTTP 200。"],
      ["6. 回應確認", "n8n 回傳 <code>ok=true</code>、<code>week=8</code>、<code>receivedSource=week08-external-post</code>、<code>forwardedProto=https</code>。"],
      ["7. 清理", "<code>unpublish:workflow</code> 後重啟 n8n，移除 TryCloudflare env，停止 cloudflared container。"]
    ],
    "webhook-test-table"
  );

  const responseJson = `{
  "ok": true,
  "week": 8,
  "probe": "public-webhook",
  "tunnel": "cloudflare-quick-tunnel",
  "receivedSource": "week08-external-post",
  "receivedWeek": 8,
  "publicHost": "gif-decent-pharmacies-eligibility.trycloudflare.com",
  "forwardedProto": "https",
  "checkedDate": "2026-05-27"
}`;

  addPage(
    "Chapter 8 · Section 8.5",
    "交付物二：public webhook 測試紀錄 I",
    `
      <section class="chapter-section full">
        <div class="section-number">8.5</div>
        <div>
          <h3>外部 POST production webhook 測試</h3>
          ${testRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.5 continued",
    "交付物二：public webhook 測試紀錄 II",
    `
      <section class="chapter-section full">
        <div class="section-number">8.5</div>
        <div>
          <h3>實際回應摘要</h3>
          ${renderCodeBlock(responseJson, "json-block")}
          <div class="week8-success-card">
            <span>Webhook Pipeline Verified</span>
            <strong>External POST → Quick Tunnel → n8n production webhook → HTTP 200 JSON response</strong>
          </div>
        </div>
      </section>
    `
  );

  const readinessRows = renderReportTable(
    ["判斷項", "learning-only 可以接受", "production-ready 必須具備", "Week 08 實測結論"],
    [
      ["URL 穩定性", "random URL 可接受", "stable hostname、可長期持有、可被外部服務固定設定", "Quick Tunnel 是 random URL，因此只屬 learning-only。"],
      ["OAuth callback", "不接 OAuth，或只做短期 sandbox", "provider callback URL 固定、HTTPS、domain ownership 清楚", "random tunnel URL 不可作正式 OAuth callback。"],
      ["Webhook lifetime", "單次測試，測完就關", "webhook URL 長期不變，並有監控與重試策略", "本週測完立刻停止 tunnel。"],
      ["TLS", "provider 自動給臨時 HTTPS 即可", "TLS renew、proxy headers、secure cookie、domain policy 都要有 runbook", "Quick Tunnel 可驗證 HTTPS path，但不等於 production TLS ownership。"],
      ["n8n env", "臨時注入 <code>WEBHOOK_URL</code>", "env 持久化、版本控管、secret 管理、restart 流程可重複", "本週 override 留作學習 artifact，live stack 已還原 local-only。"],
      ["access control", "本機短期測試", "editor 不應裸露；需 SSO、2FA、IP/access policy 或 Cloudflare Access", "Quick Tunnel 不應長時間公開 editor。"],
      ["operational ownership", "手動可接受", "backup、restore、logging、incident response、update cadence", "第 14 週後才進入正式維運 runbook。"]
    ],
    "readiness-table"
  );

  addPage(
    "Chapter 8 · Section 8.6",
    "交付物三：learning-only vs production-ready 判斷表",
    `
      <section class="chapter-section full">
        <div class="section-number">8.6</div>
        <div>
          <h3>learning-only vs production-ready</h3>
          ${readinessRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.7",
    "random tunnel URL 風險說明 I",
    `
      <section class="chapter-section">
        <div class="section-number">8.7</div>
        <div>
          <h3>第一層：URL 會變</h3>
          <p>OAuth provider 通常要求 callback URL 事先登錄，random tunnel 一旦重開就換網址，callback mismatch 會讓授權流程失敗。就算今天能登入，明天重啟 tunnel 也可能失效。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">8.7</div>
        <div>
          <h3>第二層：external service 會記住舊網址</h3>
          <p>Slack、GitHub、Stripe、Line、Meta 或任何 webhook provider 一旦保存舊 URL，新 URL 不會自動同步。random tunnel 對「一次打通」很方便，對「下週還要穩定收事件」不可靠。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.7 continued",
    "random tunnel URL 風險說明 II",
    `
      <section class="chapter-section">
        <div class="section-number">8.7</div>
        <div>
          <h3>第三層：ownership 與 incident response 不清楚</h3>
          <p>production URL 應該能回答誰擁有 domain、誰能改 DNS、TLS 如何續期、proxy headers 是否正確、editor 是否受保護、出事時如何切回。random <code>trycloudflare.com</code> URL 不能承擔這些責任。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">8.7</div>
        <div>
          <h3>結論</h3>
          <div class="note-band">
            <strong>Architecture mismatch</strong>
            <p>random tunnel URL 對 OAuth callback 與長期 webhook 的風險不是小瑕疵，而是 architecture mismatch。Week 08 只能把它標記為 learning-only；production-ready 必須換成 named tunnel、reserved/custom domain、VPS reverse proxy、DDNS with TLS-aware reverse proxy，或 n8n Cloud 這類穩定入口。</p>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已比較 n8n built-in tunnel、Cloudflare Quick Tunnel、Cloudflare named tunnel、ngrok、Tailscale Funnel、DDNS", "通過"],
      ["已設定並驗證 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>", "通過"],
      ["已完成外部 POST production webhook 測試", "通過"],
      ["已記錄 public webhook 測試紀錄", "通過"],
      ["已指出 random tunnel URL 對 OAuth callback 與長期 webhook 的風險", "通過"],
      ["已避免把 quick tunnel 留在 live production-like 狀態", "通過"]
    ],
    "week8-completion-table"
  );

  addPage(
    "Chapter 8 · Section 8.8",
    "Week 08 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">8.8</div>
        <div>
          <h3>Week 08 完成檢查</h3>
          ${completionRows}
          <div class="tip-callout">
            <strong>驗收完成</strong>
            <p>可以明確說明 random tunnel URL 不適合 OAuth callback 與長期 webhook，並能用實測紀錄證明 production webhook pipeline 成功。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 8 · Section 8.9",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">8.9</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 09 會進入 n8n Cloud 與最低維運路線。第 8 週留下的核心判斷是：如果團隊不想管理 public URL、TLS、DB、backup 與 patch cadence，n8n Cloud 是合理的低維運起點；如果要 self-host，就不能只看「能不能公開」，還要把 stable URL、資料保存、安全與操作責任一起納入。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 08 的成果是一條短暫但完整的 public webhook pipeline，以及一條清楚的紅線：random tunnel 能用來學，不能默默變成 production callback。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekNineChapter(week, startIndex) {
  const source = "docs/week-09-n8n-cloud-low-maintenance.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["Cloud 適用情境卡", "完成", "本章 9.3；<code>artifacts/week-09-cloud/week-09-cloud-fit-matrix.json</code>"],
      ["execution volume 估算表", "完成", "本章 9.4；<code>artifacts/week-09-cloud/week-09-execution-volume-estimator.csv</code>"],
      ["Cloud vs self-host 責任分界", "完成", "本章 9.5"],
      ["beginner / 非工程團隊建議", "完成", "本章 9.7"],
      ["Week 09 驗證腳本", "完成", "<code>scripts/verify-week-nine.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 9 · Week 09",
    "n8n Cloud 與最低維運路線",
    `
      <div class="chapter-summary">
        <div class="week-icon">CLD</div>
        <div>
          <p class="kicker">9.0 本週定位</p>
          <p>Week 09 要回答「什麼情況下最好的部署就是不要 self-host？」本週結論是：beginner 或非工程團隊預設應先選 n8n Cloud，除非已經有明確的 custom nodes、CLI、bash、host-level control、特殊資料治理或高階 scaling 需求。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">9.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week9-routing-map">
        <div><span>Need production n8n</span><strong>需要正式 n8n</strong></div>
        <i>→</i>
        <div><span>No hard infra control</span><strong>Start with n8n Cloud</strong></div>
        <i>→</i>
        <div><span>Fit plan?</span><strong>看 execution 與 concurrency</strong></div>
        <i>→</i>
        <div><span>Lowest maintenance</span><strong>Cloud 優先</strong></div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>第 8 週證明本機可以透過 tunnel 收公開 webhook，但也證明 random tunnel 不該承擔 production callback。第 9 週把問題往前推一步：如果團隊真正需要穩定 public URL、低維運、可預估費用與快速上線，那最好的部署可能就是 n8n Cloud。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-09"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n Cloud / pricing snapshot", "<a href=\"https://n8n.io/pricing/\">n8n pricing</a>", "官方 pricing page 顯示 Cloud Starter / Pro / Enterprise 的 executions、concurrency、saved executions、retention、projects、users 與部分功能差異；本文件數字是 2026-05-27 查核快照。"],
      ["execution quota", "<a href=\"https://docs.n8n.io/workflows/executions/\">n8n executions</a>", "paid plan 的 quota 只計 production executions；manual executions 不計入 quota。"],
      ["Cloud data management", "<a href=\"https://docs.n8n.io/manage-cloud/cloud-data-management/\">n8n Cloud data management</a>", "Cloud 仍有 memory、storage、execution data retention 與 pruning 限制；heavy workflow 需要降低保存資料與切批。"],
      ["Cloud concurrency", "<a href=\"https://docs.n8n.io/manage-cloud/concurrency/\">n8n Cloud concurrency</a>", "Cloud 依 plan 限制 concurrent production executions；超過限制會排隊，且 regular mode 的 concurrency 是 instance-level。"]
    ],
    "week9-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Cloud version update", "<a href=\"https://docs.n8n.io/hosting/updating/cloud/\">n8n Cloud updates</a>", "Cloud 仍需要 owner 管理版本選擇；n8n 建議至少每月更新，且長期不更新會進入自動更新節奏。"],
      ["Cloud workflow export", "<a href=\"https://docs.n8n.io/manage-cloud/download-workflows/\">Download workflows from Cloud</a>", "Cloud instance owner 可從最新 backup 下載 workflows；trial 結束後有 90 天下載窗口。"],
      ["Projects / RBAC", "<a href=\"https://docs.n8n.io/user-management/rbac/projects/\">n8n Projects and RBAC</a>", "n8n 用 projects 管理 workflows 與 credentials，並按角色控制權限；不同 plan 的 projects/roles 數量不同。"]
    ],
    "week9-source-table"
  );

  addPage(
    "Chapter 9 · Section 9.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">9.2</div>
        <div>
          <h3>Pricing、execution quota、data 與 concurrency</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">9.2</div>
        <div>
          <h3>更新、匯出與 Projects / RBAC</h3>
          ${sourceRowsB}
          <div class="note-band">
            <strong>來源判讀</strong>
            <p>本章不把 Cloud 說成「不用管任何事」，而是把責任縮到 workflow correctness、execution volume、版本選擇與團隊權限；底層 hosting、public URL 與資料庫維護則由 Cloud 承擔較多。</p>
          </div>
        </div>
      </section>
    `
  );

  const fitRowsA = renderReportTable(
    ["情境", "建議", "為什麼"],
    [
      ["beginner、創辦人、行銷或營運團隊要把 webhook 與 schedule workflow 放上正式環境", "Cloud first", "不需要自行管理 DNS、TLS、reverse proxy、PostgreSQL、volume、encryption key、OS patch、Docker image update。"],
      ["小團隊有多個 production workflows，但沒有特殊 runtime 控制需求", "Cloud with plan review", "用 execution volume 和 concurrency 選 Starter、Pro 或 Enterprise，比一開始維運 VPS 更少摩擦。"],
      ["團隊需要穩定 public URL 與 OAuth callback，但沒有 DevOps 能量", "Cloud first", "Cloud 的 hosted URL 比本機 random tunnel 更適合長期 callback。"]
    ],
    "cloud-fit-table"
  );

  const fitRowsB = renderReportTable(
    ["情境", "建議", "為什麼"],
    [
      ["工作流程以 SaaS API、webhook、schedule、HTTP Request、Google Sheets、Slack、Notion、CRM 等常見節點為主", "Cloud first", "這些通常不需要主機層權限，讓團隊把精力放在 workflow correctness。"],
      ["工作流程需要 custom nodes、CLI、bash scripts、host-level packages、私有網段直連、特殊 file system、特殊 binary storage", "Self-host candidate", "這些需求不是單純 workflow 問題，而是 runtime / infrastructure control 問題。"],
      ["工作流程長時間處理大型檔案、AI 批次、上萬列資料、影音或大量 binary data", "Cloud only with proof", "Cloud 有 memory 與 storage guardrails；先切批與降低 execution data saving，仍不夠才 self-host 或 Enterprise。"]
    ],
    "cloud-fit-table"
  );

  addPage(
    "Chapter 9 · Section 9.3",
    "交付物一：Cloud 適用情境卡 I",
    `
      <section class="chapter-section full">
        <div class="section-number">9.3</div>
        <div>
          <h3>Cloud first 的典型情境</h3>
          ${fitRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.3 continued",
    "交付物一：Cloud 適用情境卡 II",
    `
      <section class="chapter-section full">
        <div class="section-number">9.3</div>
        <div>
          <h3>Cloud first 的邊界與例外</h3>
          ${fitRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.3 continued",
    "Cloud-first 判斷圖",
    `
      <section class="chapter-section full">
        <div class="section-number">9.3</div>
        <div>
          <h3>Cloud-first 判斷圖</h3>
          <div class="week9-cloud-flow">
            <div><span>Workflow requirement</span><strong>先看 workflow 需要什麼</strong></div>
            <div><span>Host-level control?</span><strong>需要主機層控制？</strong><p>No：看執行量；Yes：進 self-host evaluation。</p></div>
            <div><span>Monthly executions</span><strong>能估算月 production executions？</strong><p>能估就做 Cloud plan review；不能估就先試算。</p></div>
            <div><span>Cloud route</span><strong>n8n Cloud</strong><p>把精力放在 workflow correctness 與團隊使用。</p></div>
            <div><span>Self-host route</span><strong>custom nodes / CLI / bash / private network / storage control</strong><p>這些才是 self-host 的真理由。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const estimatorRowsA = renderReportTable(
    ["工作負載", "trigger 型態", "估算公式", "月執行量", "對 Cloud 的含義"],
    [
      ["Daily CRM cleanup", "schedule", "<code>1 run/day * 31 days</code>", "31", "Starter 友善，主要看 credential 與錯誤通知。"],
      ["Hourly support digest", "schedule", "<code>24 runs/day * 31 days</code>", "744", "Starter 友善，但 7 天 execution retention 可能只夠短期 debug。"],
      ["Every 5 minute monitor", "schedule", "<code>12 runs/hour * 24 hours/day * 31 days</code>", "8,928", "接近或超過 Pro 起點；要看 peak concurrency。"],
      ["Lead intake webhook", "webhook", "<code>80 events/day * 31 days</code>", "2,480", "幾乎吃滿 Starter baseline，launch 前要留 buffer。"]
    ],
    "execution-table"
  );

  const estimatorRowsB = renderReportTable(
    ["工作負載", "trigger 型態", "估算公式", "月執行量", "對 Cloud 的含義"],
    [
      ["Payment event webhook", "webhook", "<code>500 events/day * 31 days</code>", "15,500", "Pro 或 Enterprise candidate；burst concurrency 比平均值更重要。"],
      ["Support chatbot", "chatbot", "<code>120 conversations/week * 8 messages/conversation * 4.345 weeks/month</code>", "4,172", "通常 Pro candidate；還要另估 AI provider 成本。"],
      ["AI document processing", "webhook", "<code>50 documents/day * 31 days</code>", "1,550", "execution 數不高，但 binary data 與 memory 可能先成為瓶頸。"],
      ["Manual workflow testing", "manual", "manual testing during development", "0", "不計 quota，但大型 manual run 仍會消耗 memory。"]
    ],
    "execution-table"
  );

  addPage(
    "Chapter 9 · Section 9.4",
    "交付物二：execution volume 估算表 I",
    `
      <section class="chapter-section full">
        <div class="section-number">9.4</div>
        <div>
          <h3>低量與中量 schedule / webhook 估算</h3>
          <p class="section-lead">執行量估算的核心規則很簡單：production execution 是 workflow 自動被 trigger、schedule、polling 或 webhook 啟動的一次完整執行。manual testing 不計入 paid execution quota，但仍會吃 instance memory。</p>
          ${estimatorRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.4 continued",
    "交付物二：execution volume 估算表 II",
    `
      <section class="chapter-section full">
        <div class="section-number">9.4</div>
        <div>
          <h3>高峰 webhook、chatbot、AI 與 manual testing</h3>
          ${estimatorRowsB}
        </div>
      </section>
    `
  );

  const formulaRows = renderReportTable(
    ["類型", "公式"],
    [
      ["schedule", "<code>每次排程觸發 = 1 production execution</code>；每月量等於觸發次數。"],
      ["webhook", "<code>外部事件數 = production executions</code>；每天事件數乘以 30 或 31。"],
      ["polling trigger", "<code>polling 次數 = production executions</code>；即使沒有新資料，也要確認 trigger 行為與實際 execution 計算。"],
      ["chatbot", "<code>conversation 數 * 平均 message 數</code>；每則 message 是否啟動一次 workflow 要按設計確認。"],
      ["manual test", "不計 paid execution quota；但仍可能造成 memory 壓力。"]
    ],
    "formula-table"
  );

  addPage(
    "Chapter 9 · Section 9.4 continued",
    "估算公式",
    `
      <section class="chapter-section full">
        <div class="section-number">9.4</div>
        <div>
          <h3>估算公式</h3>
          ${formulaRows}
          <div class="tip-callout">
            <strong>不要只看平均值</strong>
            <p>Cloud plan review 要同時看月 production executions 與 peak concurrency。payment event、webhook burst、chatbot message 這類流量，平均值看起來溫和，尖峰時才會把 queue、timeout 與 retry 問題暴露出來。</p>
          </div>
        </div>
      </section>
    `
  );

  const responsibilityRowsA = renderReportTable(
    ["責任項", "n8n Cloud", "self-host"],
    [
      ["public URL", "由 hosted instance 提供穩定入口", "自行處理 DNS、TLS、reverse proxy、port、proxy headers、callback URL。"],
      ["database", "不需要自行維護 PostgreSQL", "自行維護 PostgreSQL、backup、restore、migration、capacity。"],
      ["encryption key", "不需要自行保存 host volume 的 key", "必須保存 <code>N8N_ENCRYPTION_KEY</code>，否則 credential 復原會出問題。"],
      ["updates", "Cloud dashboard 管理版本；長期不更新會觸發自動更新節奏", "自行決定 image、版本、maintenance window、rollback。"],
      ["execution quota", "按 plan 與 production executions 管理", "仍可能有 license quota；硬體資源由自己負責。"]
    ],
    "responsibility-table"
  );

  const responsibilityRowsB = renderReportTable(
    ["責任項", "n8n Cloud", "self-host"],
    [
      ["concurrency", "plan-based production concurrency；超過會 queue", "可用 own sizing、queue mode、workers 調整，但維運成本上升。"],
      ["execution data retention", "Starter / Pro / Enterprise 有不同 saved executions 與 retention", "自行設定 pruning、DB 容量、binary data storage。"],
      ["custom nodes", "需按 Cloud 支援與 policy", "自行安裝與維護，承擔供應鏈與相容性風險。"],
      ["CLI / bash / host-level control", "不適合作為主要理由", "self-host 的核心理由之一，但也意味著要負責安全邊界。"],
      ["incident response", "Cloud 承擔底層 hosting，團隊仍要處理 workflow-level errors", "團隊要處理 infrastructure + workflow 雙層事故。"]
    ],
    "responsibility-table"
  );

  addPage(
    "Chapter 9 · Section 9.5",
    "交付物三：Cloud vs self-host 責任分界 I",
    `
      <section class="chapter-section full">
        <div class="section-number">9.5</div>
        <div>
          <h3>入口、資料、金鑰、更新與 quota</h3>
          ${responsibilityRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.5 continued",
    "交付物三：Cloud vs self-host 責任分界 II",
    `
      <section class="chapter-section full">
        <div class="section-number">9.5</div>
        <div>
          <h3>concurrency、retention、custom runtime 與事故責任</h3>
          ${responsibilityRowsB}
          <div class="note-band">
            <strong>責任分界</strong>
            <p>Cloud 不是把責任歸零，而是把底層 hosting 責任降到最低；self-host 不是能力展示題，而是把 infrastructure + workflow 的雙層事故都接到自己身上。</p>
          </div>
        </div>
      </section>
    `
  );

  const planRows = renderReportTable(
    ["Plan", "hosted by", "execution 起點", "concurrency", "saved executions", "log retention", "shared projects", "適合"],
    [
      ["Starter", "n8n", "2,500 / month", "5", "2,500", "7 days", "1", "初學、低量正式 automation、早期 validation。"],
      ["Pro", "n8n", "10,000 / month 起", "20", "25,000", "30 days", "3", "小團隊、需要 execution search、global variables、更多 collaboration。"],
      ["Enterprise", "n8n or self-hosted", "custom", "200+", "50,000", "extended / unlimited per Cloud data docs", "unlimited", "governance、SLA、SSO、external secrets、log streaming、scale。"]
    ],
    "cloud-plan-table"
  );

  const limitRows = renderReportTable(
    ["限制", "Starter", "Pro", "Enterprise", "設計含義"],
    [
      ["Memory", "320MiB RAM", "Pro-1 640MiB；Pro-2 1280MiB", "4096MiB", "execution 數低不代表安全；大型資料、Code node、binary data 仍可能 OOM。"],
      ["CPU", "10 millicore burstable", "20 或 80 millicore burstable", "80 millicore burstable", "長時間 CPU-heavy workflow 不應只用 execution count 判斷。"],
      ["Data storage", "up to 100GB per instance", "up to 100GB per instance", "up to 100GB per instance", "要降低不必要 execution data 保存，避免靠人工 pruning 救火。"],
      ["Queue mode", "不適用", "不適用", "Cloud Enterprise 可洽 n8n", "若 queue mode 是剛需，通常已不是 beginner 路線。"]
    ],
    "cloud-limit-table"
  );

  addPage(
    "Chapter 9 · Section 9.6",
    "Cloud 方案快照",
    `
      <section class="chapter-section full">
        <div class="section-number">9.6</div>
        <div>
          <h3>Cloud 方案快照</h3>
          ${planRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.6 continued",
    "Cloud 限制與設計含義",
    `
      <section class="chapter-section full">
        <div class="section-number">9.6</div>
        <div>
          <h3>補充限制</h3>
          ${limitRows}
          <div class="tip-callout">
            <strong>Plan 不是只有 executions</strong>
            <p>大型資料、Code node、binary data、AI enrichment、PDF 或影音處理，可能先撞到 memory、CPU 或 storage，而不是先撞到 execution quota。</p>
          </div>
        </div>
      </section>
    `
  );

  const beginnerRows = renderReportTable(
    ["理由", "實際價值"],
    [
      ["少掉 infrastructure choices", "團隊不用先成為 Docker、PostgreSQL、DNS、TLS、reverse proxy 專家。"],
      ["stable public URL", "webhook provider 與 OAuth callback 不必依賴 random tunnel。"],
      ["execution billing 可估算", "用 schedule、webhook、chatbot 的觸發頻率估月量，比估 VPS incident 成本容易。"],
      ["manual testing 不計 quota", "初學者能先測 workflow correctness，不會因手動測試直接吃掉 paid execution quota。"],
      ["可以晚點再 self-host", "只有在 custom nodes、CLI、bash、host-level control、data residency、heavy binary / AI workload 真的出現時再轉。"]
    ],
    "beginner-table"
  );

  addPage(
    "Chapter 9 · Section 9.7",
    "beginner 或非工程團隊為什麼應 Cloud 優先",
    `
      <section class="chapter-section">
        <div class="section-number">9.7</div>
        <div>
          <h3>Cloud 優先不是因為 self-host 不好</h3>
          <p>對 beginner 或非工程團隊，n8n Cloud 優先不是因為 self-host 不好，而是因為它把錯誤面積縮小。前 8 週已經看到 self-host 要同時處理 volume、PostgreSQL、encryption key、public URL、tunnel、proxy、webhook、OAuth callback 與 cleanup。這些都不是 workflow automation 本身，卻都會讓 production 失敗。</p>
          <div class="week9-error-surface">
            <div><span>Self-host surface</span><strong>Docker、DB、DNS、TLS、proxy、backup、patch、incident</strong></div>
            <div><span>Cloud surface</span><strong>workflow correctness、執行量、權限、版本選擇</strong></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.7 continued",
    "Cloud 優先的理由",
    `
      <section class="chapter-section full">
        <div class="section-number">9.7</div>
        <div>
          <h3>Cloud 優先的理由</h3>
          ${beginnerRows}
        </div>
      </section>
    `
  );

  const decisionRows = renderReportTable(
    ["問題", "答案是「否」時", "答案是「是」時"],
    [
      ["需要 custom nodes 嗎？", "Cloud first", "self-host candidate"],
      ["需要 CLI 或 bash 嗎？", "Cloud first", "self-host candidate"],
      ["需要安裝 host-level packages 或私有網段直連嗎？", "Cloud first", "self-host candidate"],
      ["月 production executions 能被估算嗎？", "先做試算，不急著部署", "Cloud plan review"],
      ["有專人負責 DB / backup / TLS / patch / incident 嗎？", "Cloud first", "可以評估 VPS / Compose"],
      ["需要 queue mode、workers、external storage 或 multi-main 嗎？", "Cloud / Pro 足夠", "Enterprise 或成熟 self-host"]
    ],
    "minimal-rule-table"
  );

  addPage(
    "Chapter 9 · Section 9.7 continued",
    "最小決策規則",
    `
      <section class="chapter-section full">
        <div class="section-number">9.7</div>
        <div>
          <h3>最小決策規則</h3>
          ${decisionRows}
        </div>
      </section>
    `
  );

  const workloadRowsA = renderReportTable(
    ["工作負載", "建議", "判斷理由"],
    [
      ["小量 SaaS sync、daily report、CRM cleanup、Slack/Notion 通知", "留在 Cloud", "低量、標準節點、低 runtime 控制需求。"],
      ["穩定 webhook，例如 lead form、calendar booking、support ticket", "留在 Cloud", "需要 stable URL，Cloud 比 random tunnel 更合理。"],
      ["小團隊 production workflows，月量 10k 左右", "Cloud Pro review", "execution search、global variables、更多 concurrency 對 production debugging 有價值。"],
      ["高峰 webhook burst、payment events、大量 chatbot message", "Cloud Pro / Enterprise review", "要看 peak concurrency、retry、queue 行為，不只看月量。"]
    ],
    "workload-table"
  );

  const workloadRowsB = renderReportTable(
    ["工作負載", "建議", "判斷理由"],
    [
      ["大型檔案、影音、PDF、AI enrichment 批次", "Proof before Cloud", "先用小批量證明 memory 與 storage；必要時 self-host 或 Enterprise。"],
      ["私有套件、custom nodes、shell scripts、內網 database 直連", "self-host", "這些是 runtime control，不只是 plan upgrade。"],
      ["合規要求指定 data residency、private network、external secret store、central log streaming", "Enterprise / self-host", "需求本質是 governance 與 control。"]
    ],
    "workload-table"
  );

  addPage(
    "Chapter 9 · Section 9.8",
    "留在 Cloud 的工作負載",
    `
      <section class="chapter-section full">
        <div class="section-number">9.8</div>
        <div>
          <h3>留在 Cloud / Cloud Pro review</h3>
          ${workloadRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.8 continued",
    "需要 proof、Enterprise 或 self-host 的工作負載",
    `
      <section class="chapter-section full">
        <div class="section-number">9.8</div>
        <div>
          <h3>Proof before Cloud / self-host / Enterprise</h3>
          ${workloadRowsB}
          <div class="note-band">
            <strong>判斷核心</strong>
            <p>留在 Cloud 的關鍵不是「流量永遠小」，而是需求仍然是 workflow 與 hosted plan 可處理的問題；需要 self-host 的關鍵也不是「我想更自由」，而是 runtime control、governance 或 infrastructure ownership 已經成為必要條件。</p>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["檢查項", "結果"],
    [
      ["已理解 n8n Cloud hosted plan 與 execution billing", "通過"],
      ["已估算 schedule / webhook / chatbot 月執行量", "通過"],
      ["已列出 self-host 才適合的需求：custom nodes、CLI、bash、host-level control", "通過"],
      ["已完成 Cloud 適用情境卡", "通過"],
      ["已完成 execution volume 估算表", "通過"],
      ["已完成 Cloud vs self-host 責任分界", "通過"],
      ["已能為 beginner 或非工程團隊提出 n8n Cloud 優先理由", "通過"]
    ],
    "week9-completion-table"
  );

  addPage(
    "Chapter 9 · Section 9.9",
    "Week 09 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">9.9</div>
        <div>
          <h3>Week 09 完成檢查</h3>
          ${completionRows}
          <div class="tip-callout">
            <strong>驗收結論</strong>
            <p>beginner 或非工程團隊若沒有硬性的 runtime control 需求，應先選 n8n Cloud。self-host 不是能力展示題，而是責任承接題；等需求真的超出 Cloud plan、Cloud policy 或 hosted runtime，再進入 Week 10 的 VPS + Docker Compose + Caddy 設計。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 9 · Section 9.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">9.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 10 會設計 VPS + Docker Compose + Caddy 藍圖。第 9 週留下的門檻是：只有當 Cloud 不符合需求，才值得承接 VPS 的 DNS、firewall、Caddy、PostgreSQL、n8n env、backup 與 public URL 責任。這能避免把「我想 self-host」誤當成「我已經準備好維運 production」。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 09 的成果是一個乾淨的部署選擇模型：先用 Cloud 降低維運面積；只有 custom runtime、host-level control、governance、heavy data 或 advanced scaling 成為硬需求時，才把 self-host 放回桌上。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekTenChapter(week, startIndex) {
  const source = "docs/week-10-vps-docker-compose-caddy.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const composeYaml = `name: n8n-week10-vps

services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    depends_on:
      n8n:
        condition: service_started
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - type: bind
        source: ./Caddyfile
        target: /etc/caddy/Caddyfile
        read_only: true
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - frontdoor

  n8n:
    image: docker.n8n.io/n8nio/n8n:2.22.4
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: \${POSTGRES_DB}
      DB_POSTGRESDB_USER: \${POSTGRES_USER}
      DB_POSTGRESDB_PASSWORD: \${POSTGRES_PASSWORD}
      DB_POSTGRESDB_SCHEMA: public
      N8N_HOST: \${N8N_DOMAIN}
      N8N_PORT: 5678
      N8N_PROTOCOL: https
      WEBHOOK_URL: \${N8N_PUBLIC_URL}
      N8N_EDITOR_BASE_URL: \${N8N_PUBLIC_URL}
      N8N_PROXY_HOPS: 1
      N8N_ENCRYPTION_KEY: \${N8N_ENCRYPTION_KEY}
      N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS: "true"
      N8N_RUNNERS_ENABLED: "true"
      N8N_SECURE_COOKIE: "true"
      GENERIC_TIMEZONE: \${GENERIC_TIMEZONE}
      TZ: \${TZ}
    expose:
      - "5678"
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - frontdoor
      - internal

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal

networks:
  frontdoor:
  internal:
    internal: true

volumes:
  caddy_data:
  caddy_config:
  n8n_data:
  postgres_data:`;

  const caddyfile = `n8n.example.com {
  encode zstd gzip

  reverse_proxy n8n:5678 {
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Host {host}
    header_up X-Forwarded-Proto {scheme}
  }
}`;

  const envExample = `N8N_DOMAIN=n8n.example.com
N8N_PUBLIC_URL=https://n8n.example.com/
GENERIC_TIMEZONE=Asia/Taipei
TZ=Asia/Taipei
POSTGRES_DB=n8n
POSTGRES_USER=n8n
POSTGRES_PASSWORD=CHANGE_ME_postgres_password_32_chars_minimum
N8N_ENCRYPTION_KEY=CHANGE_ME_fixed_n8n_encryption_key_32_chars_minimum`;

  const ufwCommands = `sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose`;

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["VPS 部署藍圖", "完成", "<code>artifacts/week-10-vps-caddy/vps-deployment-blueprint.json</code>"],
      ["Docker Compose 模擬檔", "完成", "<code>artifacts/week-10-vps-caddy/compose.yaml</code>"],
      ["Caddyfile 與 env vars 解說", "完成", "<code>artifacts/week-10-vps-caddy/Caddyfile</code>；本章 10.5"],
      ["firewall / DNS / HTTPS 檢查表", "完成", "<code>artifacts/week-10-vps-caddy/firewall-dns-https-checklist.csv</code>"],
      ["Week 10 驗證腳本", "完成", "<code>scripts/verify-week-ten.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 10 · Week 10",
    "VPS + Docker Compose + Caddy",
    `
      <div class="chapter-summary">
        <div class="week-icon">VPS</div>
        <div>
          <p class="kicker">10.0 本週定位</p>
          <p>Week 10 建立最平衡的 self-hosted n8n production 起點：單台 VPS、Docker Compose、PostgreSQL、Caddy automatic HTTPS。實作結果是完成 <code>https://n8n.example.com</code> 架構模擬，重點驗收是 production webhook URL 不會指回 <code>localhost</code>。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">10.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week10-architecture-strip">
        <div>User / webhook provider</div><span>→</span>
        <div>DNS A record</div><span>→</span>
        <div>VPS public IP</div><span>→</span>
        <div>Firewall 80/443</div><span>→</span>
        <div>Caddy reverse proxy</div><span>→</span>
        <div>n8n 5678</div><span>→</span>
        <div>PostgreSQL 5432</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>第 9 週說明 Cloud 優先；第 10 週只在 Cloud 不適合時才上場。這條路線比 Kubernetes 簡單，但已經承接 production 責任，所以 public URL、TLS、proxy、DB、volume、firewall 和 webhook URL 要一起檢查。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-10"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n reverse proxy webhook URL", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">n8n webhook URL behind proxy</a>", "n8n 在 reverse proxy 後方時，要設定 <code>WEBHOOK_URL</code>，並設定 <code>N8N_PROXY_HOPS=1</code>。"],
      ["n8n Docker + PostgreSQL", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>", "n8n 支援 PostgreSQL；即使使用 PostgreSQL，仍建議持久化 <code>.n8n</code> 目錄，因為其中還有 encryption keys、logs、source control feature assets 等資料。"],
      ["n8n deployment env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">Deployment environment variables</a>", "本週固定 <code>N8N_HOST</code>、<code>N8N_PROTOCOL</code>、<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>、<code>N8N_ENCRYPTION_KEY</code>。"],
      ["n8n database env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">Database environment variables</a>", "PostgreSQL 使用 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_*</code>。"],
      ["n8n security env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/security/\">Security environment variables</a>", "<code>N8N_SECURE_COOKIE=true</code> 適合 HTTPS production；<code>N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true</code> 強化設定檔權限。"]
    ],
    "week10-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Docker Compose", "<a href=\"https://docs.docker.com/compose/\">Docker Compose</a>", "Compose 用單一 YAML 定義 services、networks、volumes，並管理 start/stop/logs/lifecycle。"],
      ["Docker Compose services", "<a href=\"https://docs.docker.com/reference/compose-file/services/\">Compose services</a>", "本週使用 <code>depends_on.condition: service_healthy</code>、named volumes、service networks 與不公開 n8n/PostgreSQL host ports。"],
      ["Caddy reverse proxy", "<a href=\"https://caddyserver.com/docs/caddyfile/directives/reverse_proxy\">Caddy reverse_proxy</a>", "Caddy <code>reverse_proxy</code> 將 request proxy 到 upstream；本週 upstream 是 Docker service name <code>n8n:5678</code>。"],
      ["Caddy automatic HTTPS", "<a href=\"https://caddyserver.com/docs/automatic-https\">Caddy automatic HTTPS</a>", "Caddy 會自動管理憑證並把 HTTP 導向 HTTPS；public domain 需要 DNS 指到機器且 80/443 對外可達。"],
      ["Caddy reverse proxy quick-start", "<a href=\"https://caddyserver.com/docs/quick-starts/reverse-proxy\">Caddy reverse proxy quick-start</a>", "以 domain name 作為 Caddyfile site address，Caddy 會嘗試取得 publicly-trusted certificate。"]
    ],
    "week10-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Ubuntu UFW firewall", "<a href=\"https://ubuntu.com/server/docs/how-to/security/firewalls/\">Ubuntu firewall / UFW</a>", "Ubuntu 預設防火牆工具是 <code>ufw</code>；本週 checklist 僅開 SSH、HTTP、HTTPS，不開 5678/5432。"],
      ["DNS records", "<a href=\"https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/\">Cloudflare DNS records</a>", "DNS 需建立 <code>A</code> record，將 <code>n8n.example.com</code> 指向 VPS public IPv4；是否代理需依 provider 與 TLS 策略決定。"]
    ],
    "week10-source-table"
  );

  addPage(
    "Chapter 10 · Section 10.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">10.2</div>
        <div>
          <h3>n8n reverse proxy、PostgreSQL、deployment env 與 security env</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">10.2</div>
        <div>
          <h3>Compose 與 Caddy</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">10.2</div>
        <div>
          <h3>Firewall 與 DNS</h3>
          ${sourceRowsC}
          <div class="note-band">
            <strong>來源判讀</strong>
            <p>Week 10 的事實基礎是「n8n 在 Caddy 後方，Caddy 是唯一 public HTTP/HTTPS 入口，PostgreSQL 和 n8n application port 都不直接暴露」。只要這條邊界被破壞，就不是本週設計的 VPS 路線。</p>
          </div>
        </div>
      </section>
    `
  );

  const blueprintRows = renderReportTable(
    ["Layer", "設計", "對外暴露", "持久化"],
    [
      ["DNS", "<code>A n8n.example.com -> VPS_PUBLIC_IPV4</code>", "public DNS", "DNS provider"],
      ["Firewall", "allow <code>22/tcp</code>、<code>80/tcp</code>、<code>443/tcp</code>；deny public <code>5678/tcp</code>、<code>5432/tcp</code>", "22/80/443 only", "OS firewall rules"],
      ["Caddy", "<code>caddy:2-alpine</code>，接收 80/443，reverse proxy 到 <code>n8n:5678</code>", "80/443", "<code>caddy_data</code>、<code>caddy_config</code>"],
      ["n8n", "<code>docker.n8n.io/n8nio/n8n:2.22.4</code>，只在 Docker network expose 5678", "no host port", "<code>n8n_data</code>"],
      ["PostgreSQL", "<code>postgres:16-alpine</code>，只在 internal Docker network 5432", "no host port", "<code>postgres_data</code>"]
    ],
    "blueprint-table"
  );

  const principleRows = renderReportTable(
    ["原則", "具體做法"],
    [
      ["Public traffic 只走 Caddy", "Compose 只有 <code>caddy</code> publish <code>80:80</code> 與 <code>443:443</code>。"],
      ["n8n 不直接對外", "<code>n8n</code> 使用 <code>expose: 5678</code>，不使用 <code>ports: 5678:5678</code>。"],
      ["PostgreSQL 不直接對外", "<code>postgres</code> 沒有 host <code>ports</code>，且只接到 <code>internal</code> Docker network。"],
      ["Webhook URL 必須是 public HTTPS", "<code>WEBHOOK_URL=https://n8n.example.com/</code>，不是 <code>http://localhost:5678/</code>。"],
      ["Editor URL 必須是 public HTTPS", "<code>N8N_EDITOR_BASE_URL=https://n8n.example.com/</code>。"],
      ["Proxy hop 明確", "<code>N8N_PROXY_HOPS=1</code>，代表 n8n 信任前方一層 Caddy reverse proxy。"],
      ["Encryption key 固定", "<code>N8N_ENCRYPTION_KEY</code> 由 <code>.env</code> 提供，不能讓 n8n 隨機生成後遺失。"]
    ],
    "principle-table"
  );

  addPage(
    "Chapter 10 · Section 10.3",
    "交付物一：VPS 部署藍圖",
    `
      <section class="chapter-section full">
        <div class="section-number">10.3</div>
        <div>
          <h3>VPS 部署藍圖</h3>
          ${blueprintRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.3 continued",
    "架構原則",
    `
      <section class="chapter-section full">
        <div class="section-number">10.3</div>
        <div>
          <h3>架構原則</h3>
          ${principleRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.3 continued",
    "Public / Private 邊界圖",
    `
      <section class="chapter-section full">
        <div class="section-number">10.3</div>
        <div>
          <h3>Public / Private 邊界圖</h3>
          <div class="week10-boundary-map">
            <div><span>Public edge</span><strong>DNS + VPS + Firewall</strong><p>只允許 SSH、HTTP、HTTPS；不開 5678/5432。</p></div>
            <div><span>Reverse proxy</span><strong>Caddy</strong><p>唯一 public HTTP/HTTPS 入口，負責 automatic HTTPS 與 reverse proxy。</p></div>
            <div><span>Private Docker networks</span><strong>n8n + PostgreSQL</strong><p>n8n 只 expose 5678；PostgreSQL 只在 internal network。</p></div>
          </div>
          <div class="tip-callout">
            <strong>設計重點</strong>
            <p>Week 10 的安全感不是來自「服務能開」，而是來自「只有該公開的東西公開」。Caddy 可以被 internet 看到，n8n application port 和 PostgreSQL 不可以。</p>
          </div>
        </div>
      </section>
    `
  );

  const composeRowsA = renderReportTable(
    ["Compose 區塊", "設計", "解說"],
    [
      ["<code>services.caddy</code>", "<code>image: caddy:2-alpine</code>，publish 80/443", "VPS 的唯一 public HTTP/HTTPS 入口。"],
      ["<code>services.caddy.volumes</code>", "bind <code>./Caddyfile</code>，named volumes <code>caddy_data</code>、<code>caddy_config</code>", "Caddyfile 由版本控管；certificate 與 Caddy runtime data 持久化。"],
      ["<code>services.n8n</code>", "no host ports，<code>expose: 5678</code>", "只讓 Caddy 在 Docker network 內連到 n8n。"],
      ["<code>services.n8n.environment</code>", "<code>DB_TYPE=postgresdb</code>、<code>WEBHOOK_URL=https://n8n.example.com/</code>", "同時處理 state layer 與 public URL layer。"],
      ["<code>services.n8n.volumes</code>", "<code>n8n_data:/home/node/.n8n</code>", "保存 n8n user folder 內的重要資料。"]
    ],
    "compose10-table"
  );

  const composeRowsB = renderReportTable(
    ["Compose 區塊", "設計", "解說"],
    [
      ["<code>services.postgres</code>", "<code>postgres:16-alpine</code>，healthcheck <code>pg_isready</code>", "n8n 要等 PostgreSQL healthy 後才啟動。"],
      ["<code>networks.frontdoor</code>", "caddy + n8n", "reverse proxy 到 app。"],
      ["<code>networks.internal</code>", "n8n + postgres，<code>internal: true</code>", "DB network 不接 public gateway。"],
      ["<code>volumes</code>", "<code>caddy_data</code>、<code>caddy_config</code>、<code>n8n_data</code>、<code>postgres_data</code>", "更新 container 不等於刪除 state。"]
    ],
    "compose10-table"
  );

  addPage(
    "Chapter 10 · Section 10.4",
    "Docker Compose 架構解說 I",
    `
      <section class="chapter-section full">
        <div class="section-number">10.4</div>
        <div>
          <h3>Caddy 與 n8n service</h3>
          ${composeRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.4 continued",
    "Docker Compose 架構解說 II",
    `
      <section class="chapter-section full">
        <div class="section-number">10.4</div>
        <div>
          <h3>PostgreSQL、networks 與 volumes</h3>
          ${composeRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.4 continued",
    "Docker Compose 模擬檔",
    `
      <section class="chapter-section full">
        <div class="section-number">10.4</div>
        <div>
          <h3>部署模擬檔</h3>
          ${renderCodeBlock("artifacts/week-10-vps-caddy/compose.yaml", "short")}
          <p>這份 Compose 檔是 production-shaped blueprint，不會在本機直接啟動 public domain，因為 <code>n8n.example.com</code> 必須先有真實 DNS A record 指向 VPS public IP。驗證腳本會用 <code>docker compose config</code> 確認 YAML、env interpolation、services、ports、networks、volumes 都能正確 render。</p>
          <div class="note-band">
            <strong>驗證邏輯</strong>
            <p>這裡驗證的是架構可部署、public ports 正確、internal networks 清楚、env vars render 正確，而不是假裝本機已經擁有 <code>n8n.example.com</code> 的公開 DNS。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.4 continued",
    "compose.yaml 全文",
    `
      <section class="chapter-section full">
        <div class="section-number">10.4</div>
        <div>
          <h3><code>artifacts/week-10-vps-caddy/compose.yaml</code></h3>
          ${renderCodeBlock(composeYaml, "compose10-block")}
        </div>
      </section>
    `
  );

  const caddyRows = renderReportTable(
    ["行為", "解說"],
    [
      ["<code>n8n.example.com</code>", "Caddy 的 site address；有真實 public DNS 且 80/443 可達時，Caddy 會嘗試自動 HTTPS。"],
      ["<code>encode zstd gzip</code>", "對支援的 response 做壓縮。"],
      ["<code>reverse_proxy n8n:5678</code>", "Docker network 內用 service name 找到 n8n。"],
      ["<code>X-Forwarded-For</code>", "告訴 n8n 原始 client IP 資訊。"],
      ["<code>X-Forwarded-Host</code>", "告訴 n8n 原始 public host。"],
      ["<code>X-Forwarded-Proto</code>", "告訴 n8n 原始 request 是 HTTPS。"]
    ],
    "caddy10-table"
  );

  addPage(
    "Chapter 10 · Section 10.5",
    "交付物二：Caddyfile",
    `
      <section class="chapter-section full">
        <div class="section-number">10.5</div>
        <div>
          <h3>Caddyfile</h3>
          ${renderCodeBlock(caddyfile, "caddy10-block")}
          ${caddyRows}
        </div>
      </section>
    `
  );

  const envRowsA = renderReportTable(
    ["變數", "範例值", "目的"],
    [
      ["<code>N8N_DOMAIN</code>", "<code>n8n.example.com</code>", "n8n 對外 hostname。"],
      ["<code>N8N_PUBLIC_URL</code>", "<code>https://n8n.example.com/</code>", "同時餵給 <code>WEBHOOK_URL</code> 與 <code>N8N_EDITOR_BASE_URL</code>。"],
      ["<code>N8N_HOST</code>", "<code>${N8N_DOMAIN}</code>", "n8n 自身 public host 設定。"],
      ["<code>N8N_PROTOCOL</code>", "<code>https</code>", "public access protocol。"],
      ["<code>WEBHOOK_URL</code>", "<code>${N8N_PUBLIC_URL}</code>", "webhook node 顯示與外部服務註冊使用的 base URL。"],
      ["<code>N8N_EDITOR_BASE_URL</code>", "<code>${N8N_PUBLIC_URL}</code>", "editor public URL，也會影響部分 redirect URL。"]
    ],
    "env10-table"
  );

  const envRowsB = renderReportTable(
    ["變數", "範例值", "目的"],
    [
      ["<code>N8N_PROXY_HOPS</code>", "<code>1</code>", "n8n 前方有一層 reverse proxy。"],
      ["<code>N8N_ENCRYPTION_KEY</code>", "fixed secret", "加密 credentials；必須備份。"],
      ["<code>N8N_SECURE_COOKIE</code>", "<code>true</code>", "production HTTPS cookie 安全設定。"],
      ["<code>DB_TYPE</code>", "<code>postgresdb</code>", "n8n 使用 PostgreSQL。"],
      ["<code>DB_POSTGRESDB_HOST</code>", "<code>postgres</code>", "Docker network 內的 Postgres service name。"]
    ],
    "env10-table"
  );

  addPage(
    "Chapter 10 · Section 10.5 continued",
    "env vars 解說 I",
    `
      <section class="chapter-section full">
        <div class="section-number">10.5</div>
        <div>
          <h3>Public URL 相關環境變數</h3>
          ${envRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.5 continued",
    "env vars 解說 II",
    `
      <section class="chapter-section full">
        <div class="section-number">10.5</div>
        <div>
          <h3>Proxy、安全與 PostgreSQL 相關環境變數</h3>
          ${envRowsB}
          <div class="tip-callout">
            <strong>重要判斷</strong>
            <p><code>N8N_PROTOCOL=https</code> 與 <code>WEBHOOK_URL=https://n8n.example.com/</code> 描述的是 public side；n8n container 內部仍然聽 <code>5678</code>，由 Caddy 在 Docker network 內用 HTTP 代理。這是正常的 reverse proxy pattern。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.5 continued",
    ".env.example 全文",
    `
      <section class="chapter-section full">
        <div class="section-number">10.5</div>
        <div>
          <h3><code>artifacts/week-10-vps-caddy/.env.example</code></h3>
          ${renderCodeBlock(envExample, "dotenv-block")}
          <div class="note-band">
            <strong>部署前必改</strong>
            <p><code>CHANGE_ME</code> 不能進 production。正式部署前要替換 PostgreSQL password 與固定的 <code>N8N_ENCRYPTION_KEY</code>，並把 secret 備份到受控位置。</p>
          </div>
        </div>
      </section>
    `
  );

  const checklistRowsA = renderReportTable(
    ["Layer", "檢查", "預期結果"],
    [
      ["DNS", "<code>A n8n.example.com -> VPS_PUBLIC_IPV4</code>", "網域解析到 VPS。"],
      ["DNS", "TTL 合理，例如 300 秒到 1 小時", "初次部署與切換時不會被長 TTL 卡太久。"],
      ["Firewall", "allow <code>22/tcp</code> from admin IP range", "能管理 VPS，且降低 SSH 暴露面。"],
      ["Firewall", "allow <code>80/tcp</code> from internet", "Caddy 可處理 HTTP redirect 與 ACME HTTP challenge。"],
      ["Firewall", "allow <code>443/tcp</code> from internet", "使用者與 webhook provider 走 HTTPS。"],
      ["Firewall", "deny public <code>5678/tcp</code>", "n8n 不繞過 Caddy。"]
    ],
    "firewall-table"
  );

  const checklistRowsB = renderReportTable(
    ["Layer", "檢查", "預期結果"],
    [
      ["Firewall", "deny public <code>5432/tcp</code>", "PostgreSQL 不暴露到 internet。"],
      ["HTTPS", "<code>curl -I https://n8n.example.com</code>", "回應來自 Caddy 後方的 n8n，HTTP status 為 200 或 302。"],
      ["Caddy", "<code>docker compose logs caddy</code>", "可看到 certificate issuance / renewal 或正常 HTTPS serving log。"],
      ["n8n", "editor webhook base URL", "不出現 <code>localhost</code>、<code>127.0.0.1</code>、<code>:5678</code> public host。"],
      ["OAuth", "provider callback URL", "使用 <code>https://n8n.example.com/rest/oauth2-credential/callback</code> 類型的 stable HTTPS URL。"]
    ],
    "firewall-table"
  );

  addPage(
    "Chapter 10 · Section 10.6",
    "交付物三：firewall / DNS / HTTPS 檢查表 I",
    `
      <section class="chapter-section full">
        <div class="section-number">10.6</div>
        <div>
          <h3>DNS 與 Firewall</h3>
          ${checklistRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.6 continued",
    "交付物三：firewall / DNS / HTTPS 檢查表 II",
    `
      <section class="chapter-section full">
        <div class="section-number">10.6</div>
        <div>
          <h3>HTTPS、Caddy、n8n 與 OAuth</h3>
          ${checklistRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.6 continued",
    "UFW 命令草案",
    `
      <section class="chapter-section">
        <div class="section-number">10.6</div>
        <div>
          <h3>UFW 命令草案</h3>
          ${renderCodeBlock(ufwCommands, "bash-block")}
          <p>如果管理者 IP 固定，SSH 應改成只允許該 IP 或 VPN 範圍。<code>5678/tcp</code> 和 <code>5432/tcp</code> 不應開給 internet；Compose 也不 publish 這兩個 port。</p>
          <div class="week10-port-map">
            <div><span>Open</span><strong>22 / 80 / 443</strong><p>SSH、HTTP redirect / ACME、HTTPS。</p></div>
            <div><span>Closed</span><strong>5678 / 5432</strong><p>n8n application port 與 PostgreSQL 不直接公開。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const acceptanceRows = renderReportTable(
    ["驗收項", "模擬方式", "通過條件"],
    [
      ["Compose 可部署", "<code>docker compose --env-file .env.example -f compose.yaml config</code>", "render 後有 <code>caddy</code>、<code>n8n</code>、<code>postgres</code>。"],
      ["Public ports 正確", "檢查 rendered config", "只有 Caddy publish 80/443。"],
      ["n8n 不公開 host port", "檢查 rendered config", "不存在 <code>5678:5678</code>。"],
      ["PostgreSQL 不公開 host port", "檢查 rendered config", "不存在 <code>5432:5432</code>。"],
      ["Caddyfile 語法正確", "<code>caddy validate</code>", "Caddyfile 可被 Caddy 接受。"],
      ["Webhook URL 正確", "檢查 env/rendered config", "<code>WEBHOOK_URL=https://n8n.example.com/</code>。"],
      ["Editor URL 正確", "檢查 env/rendered config", "<code>N8N_EDITOR_BASE_URL=https://n8n.example.com/</code>。"],
      ["localhost 不進入 public URL", "檢查 env/rendered config", "<code>WEBHOOK_URL</code> 與 <code>N8N_EDITOR_BASE_URL</code> 不含 <code>localhost</code>、<code>127.0.0.1</code>、<code>:5678</code>。"]
    ],
    "acceptance10-table"
  );

  addPage(
    "Chapter 10 · Section 10.7",
    "<code>https://n8n.example.com</code> 模擬與驗收",
    `
      <section class="chapter-section full">
        <div class="section-number">10.7</div>
        <div>
          <h3>完整架構模擬</h3>
          <p class="section-lead">本週沒有把 <code>n8n.example.com</code> 指到一台真 VPS，因此驗收採「完整架構模擬」。</p>
          ${acceptanceRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.7 continued",
    "最重要的驗收句",
    `
      <section class="chapter-section">
        <div class="section-number">10.7</div>
        <div>
          <h3>正式 webhook URL 不應顯示 <code>localhost</code></h3>
          <div class="week10-acceptance-card">
            <span>Acceptance sentence</span>
            <strong>如果 webhook node 顯示 <code>http://localhost:5678/webhook/...</code>，代表 public URL layer 沒設好。</strong>
            <p>應先查 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>、DNS、Caddyfile，而不是先改 workflow。</p>
          </div>
        </div>
      </section>
    `
  );

  const runbookRowsA = renderReportTable(
    ["步驟", "命令或動作", "驗收"],
    [
      ["1", "建立 VPS，取得 public IPv4", "能 SSH 登入。"],
      ["2", "建立 DNS A record：<code>n8n.example.com -> VPS_PUBLIC_IPV4</code>", "<code>dig n8n.example.com</code> 回 VPS IP。"],
      ["3", "安裝 Docker Engine 與 Compose plugin", "<code>docker compose version</code> 成功。"],
      ["4", "放置 <code>compose.yaml</code>、<code>Caddyfile</code>、<code>.env</code> 到部署目錄", "<code>ls</code> 可看到三個檔案。"],
      ["5", "編輯 <code>.env</code>，替換 password 與 <code>N8N_ENCRYPTION_KEY</code>", "不使用 <code>CHANGE_ME</code>。"],
      ["6", "設定 firewall", "只開 22/80/443。"]
    ],
    "runbook10-table"
  );

  const runbookRowsB = renderReportTable(
    ["步驟", "命令或動作", "驗收"],
    [
      ["7", "驗證 Compose render", "<code>docker compose --env-file .env -f compose.yaml config</code> 成功。"],
      ["8", "啟動 stack", "<code>docker compose --env-file .env -f compose.yaml up -d</code>。"],
      ["9", "查看 Caddy logs", "憑證取得或 HTTPS serving 無錯誤。"],
      ["10", "開啟 <code>https://n8n.example.com</code>", "能進入 n8n editor setup/login。"],
      ["11", "建立 webhook workflow", "Production URL 顯示 <code>https://n8n.example.com/webhook/...</code>。"],
      ["12", "打外部 POST webhook", "HTTP 200 或 workflow 預期 response。"]
    ],
    "runbook10-table"
  );

  addPage(
    "Chapter 10 · Section 10.8",
    "VPS 部署 runbook I",
    `
      <section class="chapter-section full">
        <div class="section-number">10.8</div>
        <div>
          <h3>建立 VPS 到 firewall</h3>
          ${runbookRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.8 continued",
    "VPS 部署 runbook II",
    `
      <section class="chapter-section full">
        <div class="section-number">10.8</div>
        <div>
          <h3>Compose render 到外部 webhook</h3>
          ${runbookRowsB}
        </div>
      </section>
    `
  );

  const forbiddenRows = renderReportTable(
    ["禁止項", "原因"],
    [
      ["不固定 <code>N8N_ENCRYPTION_KEY</code>", "credential backup/restore 會失去可預期性。"],
      ["不開 public <code>5678/tcp</code>", "n8n 應在 Caddy 後方。"],
      ["不開 public <code>5432/tcp</code>", "PostgreSQL 不需要暴露給 internet。"],
      ["不用 random tunnel URL 當 production callback", "會破壞 OAuth callback 與長期 webhook。"],
      ["不讓 <code>WEBHOOK_URL</code> 指向 localhost", "外部服務無法呼叫使用者本機的 localhost。"]
    ],
    "forbidden10-table"
  );

  addPage(
    "Chapter 10 · Section 10.8 continued",
    "部署前禁止項",
    `
      <section class="chapter-section full">
        <div class="section-number">10.8</div>
        <div>
          <h3>部署前禁止項</h3>
          ${forbiddenRows}
        </div>
      </section>
    `
  );

  const troubleshootingRowsA = renderReportTable(
    ["症狀", "優先檢查"],
    [
      ["Caddy 拿不到憑證", "DNS A record 是否指向 VPS；80/443 是否開放；Caddy logs 是否出現 ACME challenge 錯誤。"],
      ["<code>https://n8n.example.com</code> 打不開", "VPS firewall、cloud provider security group、Caddy container、Caddyfile domain。"],
      ["editor 開了但 webhook URL 是 localhost", "<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>、container env。"],
      ["OAuth callback mismatch", "OAuth provider callback 是否使用 stable HTTPS domain；n8n editor URL 是否也一致。"]
    ],
    "troubleshooting10-table"
  );

  const troubleshootingRowsB = renderReportTable(
    ["症狀", "優先檢查"],
    [
      ["n8n 起不來", "<code>docker compose logs n8n</code>、PostgreSQL healthcheck、DB env vars、encryption key。"],
      ["workflow 或 credential 更新後消失", "named volumes 是否存在；是否誤刪 <code>n8n_data</code> 或 <code>postgres_data</code>。"],
      ["database connection refused", "<code>postgres</code> service health、internal network、<code>DB_POSTGRESDB_HOST=postgres</code>。"]
    ],
    "troubleshooting10-table"
  );

  addPage(
    "Chapter 10 · Section 10.9",
    "故障排除入口 I",
    `
      <section class="chapter-section full">
        <div class="section-number">10.9</div>
        <div>
          <h3>Public URL、HTTPS 與 OAuth</h3>
          ${troubleshootingRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.9 continued",
    "故障排除入口 II",
    `
      <section class="chapter-section full">
        <div class="section-number">10.9</div>
        <div>
          <h3>n8n、volume 與 database</h3>
          ${troubleshootingRowsB}
          <div class="tip-callout">
            <strong>排查順序</strong>
            <p>先確認入口層：DNS、firewall、Caddy、HTTPS。入口層通了，再查 n8n env、PostgreSQL health、volume 與 workflow。不要看到 webhook 失敗就先改 workflow，很多時候真正壞的是 public URL layer。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 10 · Section 10.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">10.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 11 會比較 Railway、Zeabur、Render、Fly.io。第 10 週的底線會沿用到 PaaS：服務能啟動不等於 state 可長期存活，網址能開不等於 webhook URL 正確。任何平台都必須回答 persistent storage、managed PostgreSQL、custom domain、TLS、env vars 與 redeploy 後 state 是否保存。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 10 的成果是一個 production-shaped VPS blueprint：Caddy 是唯一 public 入口，n8n 與 PostgreSQL 留在 Docker network，public webhook URL 固定為 HTTPS domain，state 由 named volumes 與 PostgreSQL 承接。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekElevenChapter(week, startIndex) {
  const source = "docs/week-11-paas-persistence-platforms.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["PaaS 平台比較表", "完成", "<code>artifacts/week-11-paas/week-11-paas-platform-matrix.json</code>；本章 11.3"],
      ["persistent storage risk card", "完成", "<code>artifacts/week-11-paas/week-11-persistent-storage-risk-card.json</code>；本章 11.4"],
      ["平台選型建議", "完成", "<code>artifacts/week-11-paas/week-11-platform-selection-recommendations.csv</code>；本章 11.5"],
      ["n8n PaaS env vars 檢查表", "完成", "本章 11.7"],
      ["Week 11 驗證腳本", "完成", "<code>scripts/verify-week-eleven.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 11 · Week 11",
    "Railway、Zeabur、Render、Fly.io",
    `
      <div class="chapter-summary">
        <div class="week-icon">PaaS</div>
        <div>
          <p class="kicker">11.0 本週定位</p>
          <p>Week 11 比較 Railway、Zeabur、Render、Fly.io 在 n8n self-host 情境下能省下的維運，以及最容易踩到的持久化陷阱。驗收重點鎖定在一句話：服務能啟動不代表 n8n state 能在 redeploy 後存活。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">11.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week11-state-flow">
        <div>n8n container starts</div><span>→</span>
        <div>State layer configured?</div><span>→</span>
        <div>Database and user folder durable?</div><span>→</span>
        <div>Public URL stable?</div><span>→</span>
        <div>Redeploy-safe baseline</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Week 10 把 VPS 的 DNS、firewall、Caddy、PostgreSQL、volume、env vars 攤開；Week 11 轉到 PaaS 後，平台替你省掉部分入口層維運，但 n8n 的 state layer 仍然要明確指定。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-11"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n Docker + PostgreSQL", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>", "n8n 支援 PostgreSQL；即使用 PostgreSQL，仍建議持久化 <code>.n8n</code> user folder，因為其中包含 encryption keys、logs、source control assets 等資料。"],
      ["n8n reverse proxy webhook URL", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">n8n webhook URL behind proxy</a>", "reverse proxy 或 PaaS ingress 後方要設定 <code>WEBHOOK_URL</code>，讓 editor 與外部服務註冊正確 public webhook URL。"],
      ["n8n encryption key", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/\">n8n encryption key</a>", "self-host 時應固定 <code>N8N_ENCRYPTION_KEY</code>；credentials 依賴 encryption key 可解密。"]
    ],
    "week11-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Railway volumes", "<a href=\"https://docs.railway.com/reference/volumes\">Railway volumes</a>", "Railway volume 可讓服務有持久化資料，但一個 service 只能掛一個 volume，且使用 volume 會限制 replicas。"],
      ["Railway PostgreSQL", "<a href=\"https://docs.railway.com/databases/postgresql/\">Railway PostgreSQL</a>", "Railway PostgreSQL template 能快速建立 PostgreSQL service，會提供 <code>DATABASE_URL</code> 與 <code>PG*</code> 連線變數；Railway database templates 屬於平台模板，不等於完全代管資料庫營運。"],
      ["Railway public networking", "<a href=\"https://docs.railway.com/reference/public-networking\">Railway public networking</a>", "Railway 提供 Railway domain、custom domain 與自動 SSL。"],
      ["Railway variables", "<a href=\"https://docs.railway.com/variables\">Railway variables</a>", "Railway 以 service variables、shared variables、reference variables 管理環境變數與 secrets。"]
    ],
    "week11-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Render n8n guide", "<a href=\"https://render.com/docs/deploy-n8n/\">Render deploy n8n</a>", "Render 有 n8n 官方部署指南；建議使用 Render Postgres 儲存 workflow data，並提醒 free web service 會 idle spin down、free Postgres 會過期。"],
      ["Render persistent disks", "<a href=\"https://render.com/docs/disks\">Render disks</a>", "Render service 預設 filesystem 是 ephemeral；persistent disk 只保存掛載路徑下的資料，且 disk 會取消 zero-downtime deploy。"],
      ["Render custom domains", "<a href=\"https://render.com/docs/custom-domains/\">Render custom domains</a>", "Render custom domain 會自動建立與更新 TLS certificates，HTTP 會 redirect 到 HTTPS。"],
      ["Render env vars", "<a href=\"https://render.com/docs/configure-environment-variables/\">Render environment variables</a>", "Render 使用 dashboard 或 environment groups 管理 service env vars 與 secrets。"]
    ],
    "week11-source-table"
  );

  const sourceRowsD = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Zeabur volumes", "<a href=\"https://zeabur.com/docs/en-US/data-management/volumes\">Zeabur volumes</a>", "Zeabur service 預設偏 stateless；需要持久化時必須把目錄掛到 Volume；啟用 Volume 後 restart 不再是 zero-downtime。"],
      ["Zeabur public networking", "<a href=\"https://zeabur.com/docs/en-US/networking/public\">Zeabur public networking</a>", "Zeabur 支援 <code>*.zeabur.app</code> domain 與 custom domain。"],
      ["Zeabur env vars", "<a href=\"https://zeabur.com/docs/en-US/deploy/special-variables\">Zeabur variables</a>", "Zeabur 可在 service Variables tab 設定環境變數，並自動注入服務與資料庫相關變數。"],
      ["Zeabur templates", "<a href=\"https://zeabur.com/docs/template\">Zeabur templates</a>", "Zeabur templates 可一鍵部署 n8n、Postgres 等服務，並預先定義 service、env vars 與連線關係。"],
      ["Zeabur pricing", "<a href=\"https://zeabur.com/docs/en-US/billing/pricing\">Zeabur pricing</a>", "Zeabur 使用 usage-based pricing，包含 memory、egress、persistent volume 等項目。"]
    ],
    "week11-source-table"
  );

  const sourceRowsE = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Fly.io volumes", "<a href=\"https://fly.io/docs/volumes/overview/\">Fly.io volumes</a>", "Fly Machine root filesystem 是 ephemeral；Fly Volumes 是 local persistent storage，volume 位於單一 server/region，且不自動複製。"],
      ["Fly.io Managed Postgres", "<a href=\"https://fly.io/docs/mpg\">Fly Managed Postgres</a>", "Fly.io Managed Postgres 是 fully-managed database service，包含 HA、automatic failover、backups、monitoring、support 等能力。"],
      ["Fly Postgres unmanaged warning", "<a href=\"https://fly.io/docs/postgres/getting-started/what-you-should-know/\">Fly Postgres warning</a>", "傳統 Fly Postgres 不是 managed database；production 應優先使用 Managed Postgres 或外部 managed PostgreSQL。"],
      ["Fly.io custom domains", "<a href=\"https://fly.io/docs/networking/custom-domain/\">Fly custom domains</a>", "Fly.io 支援 custom domain、DNS setup 與 TLS certificates。"],
      ["Fly.io secrets", "<a href=\"https://www.fly.io/docs/apps/secrets/\">Fly secrets</a>", "<code>fly secrets</code> 會把 secrets 注入 Fly App 的 Machines runtime environment。"]
    ],
    "week11-source-table"
  );

  addPage(
    "Chapter 11 · Section 11.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">11.2</div>
        <div>
          <h3>n8n state、public URL 與 encryption key</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">11.2</div>
        <div>
          <h3>Railway</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">11.2</div>
        <div>
          <h3>Render</h3>
          ${sourceRowsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.2 continued",
    "官方來源核對 IV",
    `
      <section class="chapter-section full">
        <div class="section-number">11.2</div>
        <div>
          <h3>Zeabur</h3>
          ${sourceRowsD}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.2 continued",
    "官方來源核對 V",
    `
      <section class="chapter-section full">
        <div class="section-number">11.2</div>
        <div>
          <h3>Fly.io</h3>
          ${sourceRowsE}
        </div>
      </section>
    `
  );

  const platformCard = (name, rows) => renderReportTable(["維度", name], rows, "paas-platform-card");

  addPage(
    "Chapter 11 · Section 11.3",
    "交付物一：PaaS 平台比較表 I",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>Railway</h3>
          ${platformCard("Railway", [
            ["持久化模型", "App service filesystem 不能當 durable state；需要 volume 掛到 n8n user folder，PostgreSQL service 另有 volume。Volume 有 service-scoped、single volume、no replicas 等限制。"],
            ["PostgreSQL 模型", "PostgreSQL template 快速建立 service 並提供 <code>DATABASE_URL</code>、<code>PGHOST</code>、<code>PGUSER</code> 等變數；官方文件也提醒 database templates 屬 unmanaged service，需要自己處理 backups、monitoring、maintenance。"],
            ["custom domain / TLS", "支援 Railway domain、custom domain、自動 SSL。"],
            ["env vars / secrets", "Service variables、shared variables、reference variables，可引用 Postgres service 的連線變數。"],
            ["usage pricing / always-on 成本", "subscription + usage；always-on n8n 會持續吃 compute、memory、volume、egress。"],
            ["n8n 適配判斷", "適合 prototype、solo builder、小型 production，但要明確加 volume、Postgres、backup policy、固定 <code>N8N_ENCRYPTION_KEY</code>。"]
          ])}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.3 continued",
    "交付物一：PaaS 平台比較表 II",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>Zeabur</h3>
          ${platformCard("Zeabur", [
            ["持久化模型", "預設服務 restart 會回到預設 state；需要把持久化目錄掛到 Volumes。啟用 Volume 後 restart 不支援 zero-downtime。"],
            ["PostgreSQL 模型", "templates 與 Databases 流程可建立 PostgreSQL；n8n template 很快，但仍要確認 template 是 PostgreSQL 還是 SQLite/volume 路線。"],
            ["custom domain / TLS", "支援 <code>*.zeabur.app</code>、custom domain 與 public networking；custom domain 需照 dashboard DNS 設定。"],
            ["env vars / secrets", "Service Variables tab 設定，平台會注入 service host、port 與資料庫相關變數。"],
            ["usage pricing / always-on 成本", "usage-based，memory、egress、persistent volume 會累積費用；suspend 可停 compute，但 volume 仍需檢查保留與費用。"],
            ["n8n 適配判斷", "最 beginner-friendly 的 PaaS 候選之一，尤其適合 template deployment；風險在於把「模板成功啟動」誤當成「state model 已驗證」。"]
          ])}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.3 continued",
    "交付物一：PaaS 平台比較表 III",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>Render</h3>
          ${platformCard("Render", [
            ["持久化模型", "預設 filesystem 是 ephemeral。可選 Render Postgres 儲存 workflow data，或 paid persistent disk 儲存 SQLite/n8n local files；disk 只保存 mount path。"],
            ["PostgreSQL 模型", "Render 官方 n8n guide 推薦 Render Postgres；free Postgres 會過期，production 需 paid DB。"],
            ["custom domain / TLS", "支援 custom domain、自動 TLS、HTTP redirect HTTPS。"],
            ["env vars / secrets", "Environment variables、secrets、environment groups；Blueprint 可一起定義 service 與 DB。"],
            ["usage pricing / always-on 成本", "free web service idle 會 spin down，free Postgres 30 天過期；paid always-on 才適合 production。"],
            ["n8n 適配判斷", "最適合用「Render Postgres + n8n web service」當 low-maintenance PaaS 路線；不要用 free DB 做長期 state。"]
          ])}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.3 continued",
    "交付物一：PaaS 平台比較表 IV",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>Fly.io</h3>
          ${platformCard("Fly.io", [
            ["持久化模型", "Machine root filesystem 是 ephemeral。Fly Volumes 是 local persistent storage，單一 volume 綁單一 Machine/server/region，不自動複製。"],
            ["PostgreSQL 模型", "可用 Fly.io Managed Postgres；傳統 Fly Postgres 是 unmanaged，不適合沒有 DB ops 能力的 production。"],
            ["custom domain / TLS", "支援 <code>.fly.dev</code> 與 custom domain，透過 Fly Proxy 管理 TLS。"],
            ["env vars / secrets", "<code>fly secrets</code> 注入 runtime env；<code>fly.toml</code> 管理 app config。"],
            ["usage pricing / always-on 成本", "按 Machines、volumes、egress、Managed Postgres 計費；長期 always-on 和 Managed Postgres 會比簡單 VPS 更需要成本估算。"],
            ["n8n 適配判斷", "適合有工程能力、需要 global edge / Machines 控制的人；對 beginner 不是最低風險路線。"]
          ])}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.3 continued",
    "一眼辨認圖",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>n8n on PaaS decision map</h3>
          <div class="week11-quadrant">
            <div class="q q1"><span>Good managed fit</span><strong>Render Postgres</strong><em>Lower persistence risk / more platform-managed</em></div>
            <div class="q q2"><span>Powerful but needs discipline</span><strong>Fly.io Managed Postgres</strong><em>Lower persistence risk / more operator-controlled</em></div>
            <div class="q q3"><span>Fast but verify state</span><strong>Railway + Postgres + volume<br>Zeabur template verified</strong><em>模板快，但要做 redeploy persistence test</em></div>
            <div class="q q4"><span>Avoid for production state</span><strong>SQLite on ephemeral FS<br>Unmanaged DB without backups</strong><em>啟動成功也可能資料不存活</em></div>
          </div>
        </div>
      </section>
    `
  );

  const savedOpsRows = renderReportTable(
    ["維運項", "PaaS 通常會省下", "仍需自己確認"],
    [
      ["Public ingress", "不用自己裝 Caddy/Nginx；平台提供 domain、routing、TLS。", "<code>WEBHOOK_URL</code> 是否是 public HTTPS URL；proxy headers 是否正確。"],
      ["Build/deploy", "Git push、Docker image 或 template deploy 可自動化。", "image tag 是否 pin；更新後 workflows 是否回歸測試。"],
      ["Secrets UI", "Dashboard 管理 env vars。", "<code>N8N_ENCRYPTION_KEY</code>、DB password、OAuth secrets 是否可備份與輪替。"],
      ["Database creation", "多數平台有 PostgreSQL template 或 managed DB。", "是 managed DB 還是 unmanaged template；backup/restore/RPO/RTO 誰負責。"],
      ["Monitoring basics", "Logs、metrics、restart controls 較容易。", "n8n execution backlog、DB storage growth、workflow failure alerts 仍要設計。"]
    ],
    "paas-ops-table"
  );

  const notSavedRows = renderReportTable(
    ["責任", "為什麼重要"],
    [
      ["n8n state 分層", "workflows、credentials、executions 多在 DB；encryption key 與部分 user folder assets 仍不可忽略。"],
      ["Redeploy persistence", "container image 更新常會建立新 instance；沒有 persistent DB/volume 時，啟動成功只是新空白實例成功。"],
      ["Backup / restore", "volume 存在不等於有可用備份；DB snapshot 也要演練 restore。"],
      ["Public URL stability", "webhook、OAuth callback、AI tool callback 都依賴 stable HTTPS domain。"],
      ["成本上限", "usage-based 平台容易因 always-on、memory、volume、egress、DB plan 而超過預期。"]
    ],
    "paas-ops-table"
  );

  addPage(
    "Chapter 11 · Section 11.3 continued",
    "平台省下的維運",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>PaaS 通常會省下什麼</h3>
          ${savedOpsRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.3 continued",
    "PaaS 沒有自動省下的責任",
    `
      <section class="chapter-section full">
        <div class="section-number">11.3</div>
        <div>
          <h3>PaaS 沒有自動省下的責任</h3>
          ${notSavedRows}
        </div>
      </section>
    `
  );

  const riskRowsA = renderReportTable(
    ["Risk ID", "風險卡", "典型症狀", "影響", "第一個檢查", "降低風險做法"],
    [
      ["<code>ephemeral-filesystem</code>", "把 n8n state 寫在 ephemeral filesystem", "redeploy 後 workflow/credential/execution 不見，或回到 setup 畫面", "高", "平台是否明說 filesystem ephemeral；n8n user folder 是否有 volume", "使用 PostgreSQL 儲存主要 state，並為 <code>/home/node/.n8n</code> 或平台等價 user folder 掛 durable storage 或固定 key/env。"],
      ["<code>managed-db-without-app-volume</code>", "有 DB 但忽略 n8n user folder", "workflow 還在，但 encryption key、binary data、source-control assets、logs 或本機檔案相關功能異常", "高", "是否固定 <code>N8N_ENCRYPTION_KEY</code>；是否保存 <code>.n8n</code> user folder", "固定 <code>N8N_ENCRYPTION_KEY</code>，掛載 user folder，檢查 binary data mode。"],
      ["<code>app-volume-without-db-backup</code>", "只掛 volume，沒有 DB backup", "redeploy 沒事，但 DB 壞掉或誤刪後無法還原", "高", "有沒有 Postgres backup/snapshot/restore drill", "設定 managed Postgres backup 或外部備份，建立 restore runbook。"]
    ],
    "risk11-table"
  );

  const riskRowsB = renderReportTable(
    ["Risk ID", "風險卡", "典型症狀", "影響", "第一個檢查", "降低風險做法"],
    [
      ["<code>free-or-sleeping-service</code>", "使用 free tier 跑 production webhook", "webhook 延遲、timeout、DB 到期、service idle spin down", "高", "plan 是否會 sleep；free DB 是否會 expire", "production 使用 paid always-on web service 與 paid DB。"],
      ["<code>single-region-local-volume</code>", "把 volume 視為跨區 durable storage", "region/host 問題時 service 或資料不可用", "中到高", "volume 是否 local to single host/region；是否自動 replication", "對 production 使用 managed DB 或多副本策略；設計 off-platform backup。"],
      ["<code>redeploy-reset</code>", "只驗證初次啟動，沒有驗證 redeploy", "第一次能登入，下一次 deploy 後資料消失", "高", "手動觸發 redeploy 後 workflows/credentials 是否仍在", "建立 smoke test：新增 workflow、credential mock、redeploy、確認仍存在。"]
    ],
    "risk11-table"
  );

  const riskRowsC = renderReportTable(
    ["Risk ID", "風險卡", "典型症狀", "影響", "第一個檢查", "降低風險做法"],
    [
      ["<code>custom-domain-mismatch</code>", "URL 能開但 n8n webhook base URL 不對", "webhook node 顯示平台臨時 URL、localhost、http 或舊 domain", "中到高", "<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、domain/TLS", "固定 custom domain，設定 public HTTPS URL，更新 OAuth callback。"],
      ["<code>secret-loss-or-rotation</code>", "secrets 沒有備份或亂輪替", "credentials 解不開，OAuth token 失效", "高", "<code>N8N_ENCRYPTION_KEY</code> 是否固定且存在 secret manager", "secrets 變更前備份 DB，記錄 rotation plan。"],
      ["<code>binary-data-location</code>", "binary data 寫到不持久的路徑", "檔案節點、附件、AI document processing 重跑或下載失敗", "中", "workflow 是否產生 binary files；binary data mode 與 storage path", "把 binary data path 放在 durable volume；Enterprise 可評估 external storage。"],
      ["<code>execution-history-growth</code>", "execution history 長期膨脹", "Postgres storage 增長、備份變慢、費用上升", "中", "executions retention、DB storage trend", "設定 execution pruning、監控 DB size、定期驗證備份大小。"]
    ],
    "risk11-table"
  );

  addPage(
    "Chapter 11 · Section 11.4",
    "交付物二：persistent storage risk card I",
    `
      <section class="chapter-section full">
        <div class="section-number">11.4</div>
        <div>
          <h3>Ephemeral、user folder 與 backup</h3>
          ${riskRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.4 continued",
    "交付物二：persistent storage risk card II",
    `
      <section class="chapter-section full">
        <div class="section-number">11.4</div>
        <div>
          <h3>Free tier、local volume 與 redeploy</h3>
          ${riskRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.4 continued",
    "交付物二：persistent storage risk card III",
    `
      <section class="chapter-section full">
        <div class="section-number">11.4</div>
        <div>
          <h3>Domain、secrets、binary data 與 execution growth</h3>
          ${riskRowsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.4 continued",
    "風險卡摘要",
    `
      <section class="chapter-section full">
        <div class="section-number">11.4</div>
        <div>
          <h3>風險卡摘要</h3>
          <div class="week11-risk-map">
            <div><span>Database durability</span><strong>PostgreSQL backup and restore</strong></div>
            <div><span>User folder durability</span><strong>Volume mount path and encryption key</strong></div>
            <div><span>Public URL correctness</span><strong>WEBHOOK_URL and custom domain</strong></div>
            <div><span>Cost and always-on behavior</span><strong>Paid plan, sleep policy, volume billing</strong></div>
          </div>
          <div class="note-band">
            <strong>最危險的誤判</strong>
            <p>把「平台會幫我 deploy container」理解成「平台會理解 n8n 的 state model」。PaaS 只知道 container、port、env、disk、DB，它不知道哪些 workflows 是生意流程、哪些 credentials 不能失效、哪些 binary files 是客戶資料。</p>
          </div>
        </div>
      </section>
    `
  );

  const selectionRowsA = renderReportTable(
    ["情境", "首選", "次選", "不建議", "理由"],
    [
      ["beginner / 非工程團隊", "n8n Cloud", "Render Postgres blueprint", "Fly.io unmanaged Postgres", "最低維運是 Cloud；如果要 PaaS，選有明確 n8n guide 與 Postgres blueprint 的路線。"],
      ["solo creator 想快速公開 webhook", "Railway 或 Zeabur", "Render paid service + Postgres", "free tier 長期 production", "Railway/Zeabur 上手快，但要檢查 volume、Postgres、custom domain、<code>WEBHOOK_URL</code>。"],
      ["需要低維運又要官方 n8n PaaS guide", "Render Postgres", "Railway + Postgres", "SQLite on ephemeral FS", "Render 有 n8n guide，且文件直接區分 Postgres 與 persistent disk 儲存方法。"],
      ["有工程能力、想靠近 global edge", "Fly.io + Managed Postgres", "Railway", "Fly Postgres unmanaged without backup", "Fly 強在 Machines/networking，但 DB 與 local volumes 要更懂操作。"]
    ],
    "selection11-table"
  );

  const selectionRowsB = renderReportTable(
    ["情境", "首選", "次選", "不建議", "理由"],
    [
      ["需要 template 一鍵啟動", "Zeabur n8n template，並確認 PostgreSQL/volume", "Railway template", "不明 template state model", "template 可省 setup，但 template 內容要核對，不可只看 deploy 成功。"],
      ["長期 production with low ops", "n8n Cloud 或 managed DB PaaS", "VPS + Compose + Caddy", "free/sleeping PaaS", "production 需要 always-on、backup、restore、stable domain、monitoring。"],
      ["想學真實 self-host ops", "Week 10 VPS route", "Fly.io advanced route", "只用 PaaS dashboard 但不懂 state", "VPS 能完整理解 DNS、proxy、DB、volume；PaaS 可作為下一層抽象比較。"]
    ],
    "selection11-table"
  );

  addPage(
    "Chapter 11 · Section 11.5",
    "交付物三：平台選型建議 I",
    `
      <section class="chapter-section full">
        <div class="section-number">11.5</div>
        <div>
          <h3>beginner、solo creator、Render guide 與 Fly edge</h3>
          ${selectionRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.5 continued",
    "交付物三：平台選型建議 II",
    `
      <section class="chapter-section full">
        <div class="section-number">11.5</div>
        <div>
          <h3>template、long-term production 與 self-host learning</h3>
          ${selectionRowsB}
        </div>
      </section>
    `
  );

  const conclusions = renderReportTable(
    ["結論", "建議"],
    [
      ["最低維運", "n8n Cloud。若必須 self-host，Render Postgres 是文件最清楚的低維運 PaaS 起點。"],
      ["最快 PaaS 上手", "Zeabur 或 Railway，但必須完成 redeploy persistence test。"],
      ["最佳學習深度", "VPS + Compose + Caddy，因為每個 layer 都看得見。"],
      ["最適合工程玩家", "Fly.io + Managed Postgres，適合願意處理 Machines、volumes、regions、secrets 的人。"],
      ["最應避免", "SQLite 或 user folder 寫在 ephemeral filesystem，尤其又搭配 free/sleeping service。"]
    ],
    "selection-summary-table"
  );

  addPage(
    "Chapter 11 · Section 11.5 continued",
    "選型結論",
    `
      <section class="chapter-section full">
        <div class="section-number">11.5</div>
        <div>
          <h3>選型結論</h3>
          ${conclusions}
        </div>
      </section>
    `
  );

  const modelTable = (rows) => renderReportTable(["Layer", "應設定", "檢查重點"], rows, "model11-table");

  addPage(
    "Chapter 11 · Section 11.6",
    "四個平台的 n8n 狀態保存模型 I",
    `
      <section class="chapter-section full">
        <div class="section-number">11.6</div>
        <div>
          <h3>Railway</h3>
          ${modelTable([
            ["n8n container", "Docker image 或 repo deploy", "pin image tag，不要長期漂在 untracked <code>latest</code>。"],
            ["DB", "Railway PostgreSQL service 或外部 managed Postgres", "確認 <code>DB_TYPE=postgresdb</code>、<code>DB_POSTGRESDB_*</code> 或 <code>DATABASE_URL</code> 對應方式，並建立 backup strategy。"],
            ["User folder", "Railway volume mount 到 n8n user folder", "Railway 一個 service 只能掛一個 volume，replicas 不能與 volume 一起用。"],
            ["Secrets", "Railway service variables", "固定 <code>N8N_ENCRYPTION_KEY</code>，用 reference variables 接 DB credentials。"],
            ["Domain", "Railway custom domain + automatic SSL", "設 <code>WEBHOOK_URL=https://你的網域/</code>。"]
          ])}
          <p class="section-lead">Railway 的優點是速度快、UI 清楚、Postgres template 方便；主要風險是把 template database 當成完全免責任 managed database。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.6 continued",
    "四個平台的 n8n 狀態保存模型 II",
    `
      <section class="chapter-section full">
        <div class="section-number">11.6</div>
        <div>
          <h3>Zeabur</h3>
          ${modelTable([
            ["n8n container/template", "選 n8n template 或 Docker image", "確認 template 使用 PostgreSQL 還是 SQLite 路線。"],
            ["DB", "Databases / PostgreSQL template", "確認 service variables 自動注入後，n8n 真的連到 Postgres。"],
            ["User folder", "Zeabur Volume", "Zeabur 文件明說 service 預設 restart 後會 reset data；需要持久化就掛 Volume。"],
            ["Secrets", "Service Variables", "固定 <code>N8N_ENCRYPTION_KEY</code>，不要只依賴一次性生成。"],
            ["Domain", "<code>*.zeabur.app</code> 或 custom domain", "production 用 stable custom domain，並同步 <code>WEBHOOK_URL</code>。"]
          ])}
          <p class="section-lead">Zeabur 的優點是 template-centric，上手很快；主要風險是「一鍵部署」讓人以為檢查結束。template 啟動後仍要做 redeploy persistence test。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.6 continued",
    "四個平台的 n8n 狀態保存模型 III",
    `
      <section class="chapter-section full">
        <div class="section-number">11.6</div>
        <div>
          <h3>Render</h3>
          ${modelTable([
            ["n8n web service", "official n8n Docker image", "使用 Render n8n guide 或 Blueprint，pin n8n image tag。"],
            ["DB", "Render Postgres", "Render guide 推薦 Postgres 儲存 workflow data；free DB 會過期，production 要 paid。"],
            ["User folder", "依部署模式決定", "Postgres 保存 workflows/credentials/executions；仍需固定 <code>N8N_ENCRYPTION_KEY</code>，若使用 filesystem/binary data 要掛 disk。"],
            ["Persistent disk", "若用 SQLite 或需要 local files", "Render disk only preserves mount path，且 disables zero-downtime deploy。"],
            ["Domain", "custom domain + TLS", "設定 <code>WEBHOOK_URL</code> 為 <code>https://你的網域/</code> 或 service public URL。"]
          ])}
          <p class="section-lead">Render 是四個平台中對 n8n 文件最直白的一個：它直接告訴使用者 storage method 有 Render Postgres 和 persistent disk 兩種，也直接說 free service/DB 的限制。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.6 continued",
    "四個平台的 n8n 狀態保存模型 IV",
    `
      <section class="chapter-section full">
        <div class="section-number">11.6</div>
        <div>
          <h3>Fly.io</h3>
          ${modelTable([
            ["n8n Machine", "Docker image + <code>fly.toml</code>", "root filesystem ephemeral，不可放 durable state。"],
            ["DB", "Fly.io Managed Postgres 或外部 managed Postgres", "傳統 Fly Postgres 是 unmanaged；沒有 DB ops 能力不要作為 production 預設。"],
            ["User folder", "Fly Volume", "volume local to single server/region，一個 volume attach one Machine，不自動 replication。"],
            ["Secrets", "<code>fly secrets</code>", "secrets 更新會使 Machine 更新或重啟，要回歸 credential 解密。"],
            ["Domain", "<code>.fly.dev</code> 或 custom domain", "<code>fly certs add</code>，DNS 與 TLS 檢查完成後設定 <code>WEBHOOK_URL</code>。"]
          ])}
          <p class="section-lead">Fly.io 的價值是控制力與全球網路，而不是 beginner 省心。n8n 可以跑在 Fly，但 production 應使用 Managed Postgres 或外部 managed DB。</p>
        </div>
      </section>
    `
  );

  const envRowsA = renderReportTable(
    ["env var", "必要性", "建議值或來源", "為什麼重要"],
    [
      ["<code>DB_TYPE</code>", "PostgreSQL route 必填", "<code>postgresdb</code>", "避免 n8n 使用預設 SQLite 寫到 ephemeral filesystem。"],
      ["<code>DB_POSTGRESDB_HOST</code>", "PostgreSQL route 必填", "平台 DB host 或 private hostname", "連到 durable DB，不連到 container local DB。"],
      ["<code>DB_POSTGRESDB_PORT</code>", "PostgreSQL route 必填", "通常 <code>5432</code>", "明確連線到 PostgreSQL。"],
      ["<code>DB_POSTGRESDB_DATABASE</code>", "PostgreSQL route 必填", "<code>n8n</code> 或平台建立的 database", "workflows、credentials、executions 的主要 state。"],
      ["<code>DB_POSTGRESDB_USER</code>", "PostgreSQL route 必填", "平台 DB user", "DB auth。"],
      ["<code>DB_POSTGRESDB_PASSWORD</code>", "PostgreSQL route 必填", "platform secret/reference variable", "DB auth secret 不進 Git。"]
    ],
    "env11-table"
  );

  const envRowsB = renderReportTable(
    ["env var", "必要性", "建議值或來源", "為什麼重要"],
    [
      ["<code>DB_POSTGRESDB_SSL_ENABLED</code> 或平台等價設定", "視平台而定", "managed DB 若要求 TLS 則開啟", "外部 DB 連線常需要 TLS。"],
      ["<code>N8N_ENCRYPTION_KEY</code>", "production 必填", "固定、長度足夠、保存在 secret manager", "credentials 解密依賴它；遺失會造成嚴重事故。"],
      ["<code>WEBHOOK_URL</code>", "public webhook 必填", "<code>https://n8n.example.com/</code>", "外部服務註冊與 editor 顯示 production webhook URL。"],
      ["<code>N8N_EDITOR_BASE_URL</code>", "建議設定", "<code>https://n8n.example.com/</code>", "editor redirect 與 public base URL 一致。"],
      ["<code>N8N_HOST</code>", "建議設定", "<code>n8n.example.com</code>", "public hostname。"]
    ],
    "env11-table"
  );

  const envRowsC = renderReportTable(
    ["env var", "必要性", "建議值或來源", "為什麼重要"],
    [
      ["<code>N8N_PROTOCOL</code>", "建議設定", "<code>https</code>", "public side protocol。"],
      ["<code>N8N_PROXY_HOPS</code>", "reverse proxy/PaaS ingress 建議", "<code>1</code> 或依 ingress hops 調整", "告訴 n8n 信任前方 proxy headers。"],
      ["<code>N8N_SECURE_COOKIE</code>", "HTTPS production 建議", "<code>true</code>", "強化 cookie 安全。"],
      ["<code>N8N_RUNNERS_ENABLED</code>", "新版 self-host 建議", "<code>true</code>", "對應 n8n Docker 文件中的 runner 建議。"],
      ["<code>EXECUTIONS_DATA_PRUNE</code> 與相關 retention vars", "長期 production 建議", "依資料保留政策設定", "控制 execution history 成長與 DB 成本。"]
    ],
    "env11-table"
  );

  addPage(
    "Chapter 11 · Section 11.7",
    "n8n PaaS env vars 檢查表 I",
    `
      <section class="chapter-section full">
        <div class="section-number">11.7</div>
        <div>
          <h3>PostgreSQL connection</h3>
          ${envRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.7 continued",
    "n8n PaaS env vars 檢查表 II",
    `
      <section class="chapter-section full">
        <div class="section-number">11.7</div>
        <div>
          <h3>Encryption key 與 public URL</h3>
          ${envRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.7 continued",
    "n8n PaaS env vars 檢查表 III",
    `
      <section class="chapter-section full">
        <div class="section-number">11.7</div>
        <div>
          <h3>Protocol、proxy、cookie、runner 與 execution retention</h3>
          ${envRowsC}
        </div>
      </section>
    `
  );

  const startupRows = renderReportTable(
    ["啟動成功代表", "不代表"],
    [
      ["container process 活著", "DB 是 durable，且有 backup。"],
      ["editor 可開", "workflows、credentials、executions 已寫到 persistent PostgreSQL。"],
      ["可以建立帳號", "下一次 redeploy 不會回到空白 setup。"],
      ["webhook URL 能顯示", "URL 是 stable custom domain，而不是暫時平台 domain 或 localhost。"],
      ["service restart 正常", "volume mount path 正確，binary data 和 encryption key 都能保留。"]
    ],
    "startup11-table"
  );

  addPage(
    "Chapter 11 · Section 11.8",
    "為什麼服務能啟動不代表 state 能在 redeploy 後存活",
    `
      <section class="chapter-section full">
        <div class="section-number">11.8</div>
        <div>
          <h3>啟動成功只證明 runtime 起來了</h3>
          <p class="section-lead">PaaS 的成功啟動通常只證明五件事：image 能拉下來、port 有 listen、health check 通過、env vars 基本可讀、平台 ingress 能連到服務。這些都不等於 n8n 的 state layer 被保存。</p>
          ${startupRows}
        </div>
      </section>
    `
  );

  const acceptanceRows = renderReportTable(
    ["步驟", "動作", "通過條件"],
    [
      ["1", "部署 n8n service + PostgreSQL + volume/secret", "n8n editor 可開，DB env vars 生效。"],
      ["2", "設定 <code>N8N_ENCRYPTION_KEY</code>、<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>", "editor 顯示 public HTTPS URL。"],
      ["3", "建立測試 workflow 與測試 credential", "workflow、credential 能儲存。"],
      ["4", "觸發一次 production webhook", "外部 request 成功打到 n8n。"],
      ["5", "手動 redeploy 或 restart service", "redeploy 完成後不是空白 instance。"],
      ["6", "重新登入檢查 workflow、credential、execution", "workflow 還在，credential 可用，execution history 符合保留政策。"],
      ["7", "檢查 DB backup 與 volume backup", "至少有明確可操作的 restore path。"]
    ],
    "acceptance11-table"
  );

  addPage(
    "Chapter 11 · Section 11.8 continued",
    "正確驗收流程",
    `
      <section class="chapter-section full">
        <div class="section-number">11.8</div>
        <div>
          <h3>正確驗收流程</h3>
          ${acceptanceRows}
          <div class="tip-callout">
            <strong>驗收結論</strong>
            <p>服務能啟動只代表 runtime 起來了，不代表 n8n state 能在 redeploy 後存活。n8n 的持久化要同時檢查 PostgreSQL、user folder volume、<code>N8N_ENCRYPTION_KEY</code>、binary data storage、backup/restore、stable public URL。</p>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 PaaS 平台比較表", "通過", "<code>week-11-paas-platform-matrix.json</code> 與第 3 節"],
      ["完成 persistent storage risk card", "通過", "<code>week-11-persistent-storage-risk-card.json</code> 與第 4 節"],
      ["完成平台選型建議", "通過", "<code>week-11-platform-selection-recommendations.csv</code> 與第 5 節"],
      ["檢查 persistent volume、managed PostgreSQL、custom domain、TLS、env vars", "通過", "第 2、3、6、7 節"],
      ["辨認 Render/Fly/Zeabur/Railway 狀態保存模型", "通過", "第 6 節"],
      ["理解 usage pricing 與 always-on 成本", "通過", "第 3、5 節"],
      ["能說明服務能啟動不代表 state 能在 redeploy 後存活", "通過", "第 8 節"]
    ],
    "week11-completion-table"
  );

  addPage(
    "Chapter 11 · Section 11.9",
    "Week 11 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">11.9</div>
        <div>
          <h3>Week 11 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 11 · Section 11.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">11.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 12 會進入 Cloud Run、AWS App Runner、Lightsail、EC2、RDS 的比較。Week 11 的判斷會繼續沿用：任何平台選型都先問 state layer。Cloud Run 與 App Runner 更偏 stateless service，Lightsail/EC2 更像 VPS，RDS 則是 managed PostgreSQL 的典型選項。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 11 的成果，是把「PaaS 比 VPS 省事」拆成可驗證的判斷：入口層可能省事，但 state、secret、volume、DB backup、public URL、成本與 redeploy persistence 仍要逐一驗收。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekTwelveChapter(week, startIndex) {
  const source = "docs/week-12-cloud-run-aws-hyperscaler.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["Cloud Run durable 架構圖", "完成", "<code>artifacts/week-12-hyperscaler/week-12-cloud-run-durable-architecture.json</code>；本章 12.3"],
      ["AWS 三階段演進圖", "完成", "<code>artifacts/week-12-hyperscaler/week-12-aws-three-stage-evolution.json</code>；本章 12.4"],
      ["hyperscaler adoption checklist", "完成", "<code>artifacts/week-12-hyperscaler/week-12-hyperscaler-adoption-checklist.csv</code>；本章 12.5"],
      ["Cloud Run easy mode vs durable mode 判斷", "完成", "本章 12.3"],
      ["AWS Lightsail/EC2/ECS/RDS/Secrets Manager/ALB/CloudWatch 階梯", "完成", "本章 12.4"],
      ["Week 12 驗證腳本", "完成", "<code>scripts/verify-week-twelve.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 12 · Week 12",
    "Cloud Run Durable 與 AWS 路線",
    `
      <div class="chapter-summary">
        <div class="week-icon">HYP</div>
        <div>
          <p class="kicker">12.0 本週定位</p>
          <p>Week 12 判斷何時值得使用 hyperscaler，而不是普通 VPS 或 PaaS。實作結果是完成 Cloud Run durable 架構圖、AWS 三階段演進圖、hyperscaler adoption checklist，並把驗收重點鎖定在「AWS 的強大來自 building blocks，也帶來組裝與維運成本」。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">12.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week12-decision-strip">
        <div>Need public n8n</div><span>→</span>
        <div>Ordinary VPS or PaaS enough?</div><span>→</span>
        <div>Need managed cloud building blocks?</div><span>→</span>
        <div>Cloud Run durable or AWS stages</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Week 11 說明 PaaS 能省下 ingress、TLS、deploy UI、logs、secrets UI，但 state layer 仍要明確設計。Week 12 往 hyperscaler 推進，判斷標準不是「GCP/AWS 比較大所以一定比較好」，而是你是否真的需要 managed database、IAM、secret manager、load balancer、observability、autoscaling、VPC controls、backup/restore 與 multi-environment governance。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-12"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n on Google Cloud Run", "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run/\">n8n Cloud Run guide</a>", "n8n 官方 Cloud Run guide 區分 Easy mode 與 Durable mode；Durable mode 加入 Cloud SQL、Secret Manager、service account 與正確 env vars。"],
      ["Cloud Run to Cloud SQL PostgreSQL", "<a href=\"https://docs.cloud.google.com/sql/docs/postgres/connect-run\">Cloud Run connect to Cloud SQL</a>", "Cloud SQL 是 fully-managed database；Cloud Run 連 Cloud SQL 需要設定 instance connection，建議同區以降低 latency、成本與跨區故障風險。"],
      ["Cloud Run Secret Manager", "<a href=\"https://docs.cloud.google.com/run/docs/configuring/services/secrets\">Cloud Run secrets</a>", "Cloud Run 可把 Secret Manager secrets 掛成檔案或注入為環境變數；服務身分需要 <code>roles/secretmanager.secretAccessor</code>。"],
      ["Cloud Run service identity", "<a href=\"https://docs.cloud.google.com/run/docs/configuring/services/service-identity\">Cloud Run service identity</a>", "Cloud Run service identity 是 container 存取 Google Cloud API 的 service account；應使用 least-privilege user-managed service account。"],
      ["Cloud Run environment variables", "<a href=\"https://docs.cloud.google.com/run/docs/configuring/services/environment-variables\">Cloud Run environment variables</a>", "Cloud Run env vars 綁定到 service revision；敏感值不應直接放普通環境變數，應使用 Secret Manager。"]
    ],
    "week12-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Lightsail containers", "<a href=\"https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-container-services.html\">Lightsail container services</a>", "Lightsail container services 提供 container、default domain、custom domain、logs、metrics，比 ECS/Fargate 更像簡化的 AWS 入口。"],
      ["Lightsail custom domains", "<a href=\"https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-enabling-container-services-custom-domains.html\">Lightsail custom domains</a>", "Lightsail container service 可啟用 custom domains，需建立並驗證 SSL/TLS certificate。"],
      ["EC2 security groups", "<a href=\"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html\">EC2 security groups</a>", "EC2 security group 是 instance 的 virtual firewall；入站與出站 rules 仍由使用者設計。"],
      ["ECS Fargate tasks", "<a href=\"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-tasks-services.html\">ECS Fargate tasks</a>", "Fargate task 使用 <code>awsvpc</code> network mode，並有 task definition、CPU/memory/network/logging/storage 限制。"],
      ["RDS automated backups", "<a href=\"https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ManagingAutomatedBackups.html\">RDS automated backups</a>", "RDS 自動備份依 backup window 與 retention policy 執行；production 需要明確 retention、restore、maintenance window。"]
    ],
    "week12-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["AWS Secrets Manager", "<a href=\"https://docs.aws.amazon.com/secretsmanager/\">AWS Secrets Manager</a>", "Secrets Manager 用於加密、儲存、取回 database credentials 與其他 secrets，並支援 rotation。"],
      ["ALB target groups", "<a href=\"https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html\">ALB target groups</a>", "Application Load Balancer 透過 target groups 將 request route 到 registered targets，並用 health checks 判斷 target 狀態。"],
      ["ECS logs to CloudWatch", "<a href=\"https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html\">ECS awslogs</a>", "ECS/Fargate tasks 可透過 <code>awslogs</code> log driver 將 container logs 發送到 CloudWatch Logs。"],
      ["CloudWatch Container Insights", "<a href=\"https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html\">CloudWatch Container Insights</a>", "Container Insights 可收集、彙總 containerized applications 的 metrics/logs，支援 ECS/EKS/Fargate。"]
    ],
    "week12-source-table"
  );

  addPage(
    "Chapter 12 · Section 12.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">12.2</div>
        <div>
          <h3>Google Cloud Run durable mode</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">12.2</div>
        <div>
          <h3>AWS compute、network 與 RDS</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">12.2</div>
        <div>
          <h3>AWS secrets、ALB 與 CloudWatch</h3>
          ${sourceRowsC}
          <div class="note-band">
            <strong>來源判讀</strong>
            <p>Cloud Run durable 與 AWS Stage 2/3 都把 n8n 拆成多個 building blocks。這會提升治理能力，也會增加 IAM、網路、備份、監控、成本與 release runbook 的責任。</p>
          </div>
        </div>
      </section>
    `
  );

  const cloudRunModeRows = renderReportTable(
    ["模式", "適用", "state model", "主要資源", "最大風險"],
    [
      ["Easy mode", "demo、短期試跑、教學展示", "容器內暫存或非 durable state", "Cloud Run service + n8n image", "scale to zero、redeploy、revision replacement 後資料不可靠。"],
      ["Durable mode", "production-oriented self-host", "Cloud SQL PostgreSQL 保存主要 state；Secret Manager 保存 secrets；service account 控制權限", "Cloud Run、Cloud SQL、Secret Manager、service account、env vars、public URL", "組件設定較多；如果 DB backup、IAM、secrets、public URL 沒設好，仍會 production 事故。"]
    ],
    "cloudrun-mode-table"
  );

  addPage(
    "Chapter 12 · Section 12.3",
    "交付物一：Cloud Run durable 架構圖 I",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Cloud Run easy mode vs durable mode</h3>
          ${cloudRunModeRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.3 continued",
    "Cloud Run durable 架構圖",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Durable architecture</h3>
          <div class="week12-cloudrun-map">
            <div><span>User / webhook provider</span><strong>HTTP requests</strong></div>
            <div><span>Cloud Run service</span><strong>n8n container</strong><p>editor、webhook、API request。</p></div>
            <div><span>Cloud SQL PostgreSQL</span><strong>main state</strong><p>workflows、credentials、executions。</p></div>
            <div><span>Secret Manager</span><strong>secret env vars</strong><p>DB password、N8N_ENCRYPTION_KEY。</p></div>
            <div><span>Service account</span><strong>runtime identity</strong><p>cloudsql.client + secretAccessor。</p></div>
            <div><span>Logging / URL</span><strong>observability + public base URL</strong><p>WEBHOOK_URL、N8N_EDITOR_BASE_URL。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const durableComponentsA = renderReportTable(
    ["Component", "目的", "n8n 對應設定"],
    [
      ["Cloud Run service", "執行 n8n container，處理 editor、webhook、API request", "n8n image、port <code>5678</code>、CPU/memory/concurrency/min instances 依 workload 設定。"],
      ["Cloud SQL PostgreSQL", "保存 workflows、credentials、executions 等主要 state", "<code>DB_TYPE=postgresdb</code>、<code>DB_POSTGRESDB_HOST=/cloudsql/PROJECT:REGION:n8n-db</code>、<code>DB_POSTGRESDB_DATABASE=n8n</code>。"],
      ["Secret Manager", "保存 DB password、<code>N8N_ENCRYPTION_KEY</code> 與 OAuth/API secrets", "Cloud Run <code>--update-secrets</code> 或 revision secret references。"],
      ["Service account", "Cloud Run runtime identity，以最小權限存取 Cloud SQL 與 secrets", "<code>roles/cloudsql.client</code>、<code>roles/secretmanager.secretAccessor</code>，不要把 broad Editor role 當預設做法。"]
    ],
    "durable12-table"
  );

  const durableComponentsB = renderReportTable(
    ["Component", "目的", "n8n 對應設定"],
    [
      ["Public URL", "讓 webhook/OAuth callback 對外穩定", "<code>WEBHOOK_URL=https://n8n.example.com/</code>、<code>N8N_EDITOR_BASE_URL=https://n8n.example.com/</code>。"],
      ["Health endpoint", "避免 Cloud Run reserved path 衝突", "n8n guide 提到 Cloud Run 保留 <code>/healthz</code>，應改 <code>N8N_ENDPOINT_HEALTH</code>。"],
      ["Cloud Logging/Monitoring", "觀察 revision、errors、latency、request count、container logs", "建立 dashboard、alerts、error budget 與 incident playbook。"]
    ],
    "durable12-table"
  );

  addPage(
    "Chapter 12 · Section 12.3 continued",
    "Durable components I",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Cloud Run、Cloud SQL、Secret Manager、service account</h3>
          ${durableComponentsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.3 continued",
    "Durable components II",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Public URL、health endpoint、logging/monitoring</h3>
          ${durableComponentsB}
        </div>
      </section>
    `
  );

  const envRowsA = renderReportTable(
    ["env var", "Cloud Run durable 建議", "說明"],
    [
      ["<code>DB_TYPE</code>", "<code>postgresdb</code>", "強制 n8n 使用 PostgreSQL，不把主 state 放在 container filesystem。"],
      ["<code>DB_POSTGRESDB_HOST</code>", "<code>/cloudsql/PROJECT:REGION:n8n-db</code>", "Cloud SQL Unix socket route；具體 connection name 依專案而定。"],
      ["<code>DB_POSTGRESDB_DATABASE</code>", "<code>n8n</code>", "n8n database name。"],
      ["<code>DB_POSTGRESDB_USER</code>", "<code>n8n-user</code>", "Cloud SQL DB user。"],
      ["<code>DB_POSTGRESDB_PASSWORD</code>", "Secret Manager reference", "不放普通 env var，不寫入 image。"]
    ],
    "env12-table"
  );

  const envRowsB = renderReportTable(
    ["env var", "Cloud Run durable 建議", "說明"],
    [
      ["<code>N8N_ENCRYPTION_KEY</code>", "Secret Manager reference", "credentials 解密與敏感資料保護的核心 key。"],
      ["<code>WEBHOOK_URL</code>", "<code>https://n8n.example.com/</code>", "production webhook base URL。"],
      ["<code>N8N_EDITOR_BASE_URL</code>", "<code>https://n8n.example.com/</code>", "editor public base URL。"],
      ["<code>N8N_ENDPOINT_HEALTH</code>", "<code>health</code> 或其他非 <code>/healthz</code> path", "避免 Cloud Run reserved path 衝突。"],
      ["<code>N8N_PROXY_HOPS</code>", "<code>1</code> 或依實際 proxy hops 調整", "Cloud Run/外部 proxy 後方要讓 n8n 正確理解 forwarded headers。"]
    ],
    "env12-table"
  );

  addPage(
    "Chapter 12 · Section 12.3 continued",
    "Durable env var baseline I",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Database env vars</h3>
          ${envRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.3 continued",
    "Durable env var baseline II",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Secrets、public URL、health 與 proxy</h3>
          ${envRowsB}
        </div>
      </section>
    `
  );

  const cloudRunAcceptance = renderReportTable(
    ["驗收項", "通過條件"],
    [
      ["Cloud SQL", "n8n 實際連到 Cloud SQL PostgreSQL；redeploy 後 workflows/credentials/executions 不消失。"],
      ["Secret Manager", "DB password 與 <code>N8N_ENCRYPTION_KEY</code> 由 Secret Manager 注入，service account 有最小必要權限。"],
      ["Service account", "Cloud Run runtime 使用專用 service account，不依賴 broad default identity。"],
      ["URL", "webhook node 顯示 stable HTTPS public URL，不是 localhost 或臨時 URL。"],
      ["Health", "Cloud Run health check 不使用 <code>/healthz</code> 與 n8n reserved/conflicting route。"],
      ["Backup", "Cloud SQL production 設定 backup retention、restore drill、maintenance window。"]
    ],
    "acceptance12-table"
  );

  addPage(
    "Chapter 12 · Section 12.3 continued",
    "Cloud Run durable 驗收",
    `
      <section class="chapter-section full">
        <div class="section-number">12.3</div>
        <div>
          <h3>Cloud Run durable 驗收</h3>
          ${cloudRunAcceptance}
          <div class="tip-callout">
            <strong>重要提醒</strong>
            <p>n8n 官方 Durable mode guide 的範例偏向教學起點。真正 production 應補上 automated backups、restore drill、region choice、connection limits、cost alert、Cloud Logging alert、image pinning 與 release rollback。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.4",
    "交付物二：AWS 三階段演進圖",
    `
      <section class="chapter-section full">
        <div class="section-number">12.4</div>
        <div>
          <h3>AWS evolution map</h3>
          <div class="week12-aws-evolution">
            <div><span>Stage 1</span><strong>Lightsail or EC2 single-server</strong><p>Docker Compose / local Postgres / simple domain。</p></div>
            <span class="arrow">→</span>
            <div><span>Stage 2</span><strong>EC2 + RDS + Secrets Manager + ALB + CloudWatch</strong><p>Managed DB、separated secrets、load balancer、logs。</p></div>
            <span class="arrow">→</span>
            <div><span>Stage 3</span><strong>ECS/Fargate + RDS + Secrets Manager + ALB + CloudWatch Container Insights</strong><p>Task definitions、services、target groups、autoscaling。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const awsStages = renderReportTable(
    ["Stage", "適用情境", "AWS building blocks", "優點", "組裝與維運成本"],
    [
      ["Stage 1：Lightsail 或 EC2 single-server", "想要 AWS 帳號內的 VPS-like 起點；流量小；團隊仍在學 self-host", "Lightsail instance/container service，或 EC2 + security group + EBS + Docker Compose + domain/TLS", "Mental model 接近 Week 10 VPS，成本與架構較容易理解。", "仍要自己管理 OS patch、Docker update、firewall/security group、backup、Caddy/TLS 或 Lightsail certificate。"],
      ["Stage 2：EC2 + RDS + Secrets Manager + ALB + CloudWatch", "n8n 已承載重要流程，需要 managed DB、分離 secrets、健康檢查、集中 logs", "EC2、RDS PostgreSQL、Secrets Manager、Application Load Balancer、target groups、CloudWatch Logs/Metrics", "DB、secrets、ingress、monitoring 開始拆成專門元件，資料層比單機更可靠。", "VPC/subnet/security group/IAM/ALB/target group/RDS/backup/logs 都要設計，費用項目變多。"],
      ["Stage 3：ECS/Fargate + RDS + Secrets Manager + ALB + CloudWatch", "需要 container orchestration、rolling deploy、scaling、task isolation、multi-environment pipeline", "ECS cluster/service/task definition、Fargate、ECR、RDS、Secrets Manager、ALB target groups、CloudWatch Logs、Container Insights", "不再手管 EC2 host；部署、擴縮、observability 與 IAM boundary 更雲原生。", "task definition、IAM execution role/task role、network mode、log driver、autoscaling、DB connection limits、deployment rollback 都要成熟管理。"]
    ],
    "aws-stage-table"
  );

  addPage(
    "Chapter 12 · Section 12.4 continued",
    "三階段說明",
    `
      <section class="chapter-section full">
        <div class="section-number">12.4</div>
        <div>
          <h3>三階段說明</h3>
          ${awsStages}
        </div>
      </section>
    `
  );

  const awsLadder = renderReportTable(
    ["從", "移到", "當這些訊號出現"],
    [
      ["Lightsail/EC2 single-server", "EC2 + RDS + Secrets Manager", "SQLite 或 local Postgres 已不夠；需要 automated backups、DB restore、secret rotation、集中 logs。"],
      ["EC2 + RDS", "EC2 + ALB + CloudWatch", "需要健康檢查、TLS termination、domain routing、instance replacement、incident metrics。"],
      ["EC2 + ALB + RDS", "ECS/Fargate + RDS", "deploy 頻率上升；需要 immutable task revisions、service autoscaling、container-level logs、清楚分離 execution role/task role。"],
      ["ECS/Fargate single service", "ECS queue-mode architecture", "workflow execution concurrency、webhook burst、worker separation、Redis queue mode 變成瓶頸議題。"]
    ],
    "aws-ladder-table"
  );

  addPage(
    "Chapter 12 · Section 12.4 continued",
    "AWS 階梯判斷",
    `
      <section class="chapter-section full">
        <div class="section-number">12.4</div>
        <div>
          <h3>AWS 階梯判斷</h3>
          ${awsLadder}
        </div>
      </section>
    `
  );

  const prematureRows = renderReportTable(
    ["情境", "比較合理的路線"],
    [
      ["只有個人自動化、低流量 webhook、沒有合規要求", "n8n Cloud、VPS + Compose、Render Postgres、Railway/Zeabur verified template。"],
      ["團隊還不能解釋 security group、IAM role、target group、RDS backup", "先做 Week 10 VPS 或 Week 11 PaaS，再進 AWS。"],
      ["只是想要 custom domain + HTTPS", "VPS+Caddy 或 PaaS 已足夠。"],
      ["沒有人會看 CloudWatch alerts 或操作 restore", "managed building blocks 只會變成未維護的帳單項目。"]
    ],
    "premature12-table"
  );

  addPage(
    "Chapter 12 · Section 12.4 continued",
    "不該過早進 AWS/ECS 的情境",
    `
      <section class="chapter-section full">
        <div class="section-number">12.4</div>
        <div>
          <h3>不該過早進 AWS/ECS 的情境</h3>
          ${prematureRows}
        </div>
      </section>
    `
  );

  const adoptionRowsA = renderReportTable(
    ["類別", "採用前問題", "通過訊號", "未通過時建議"],
    [
      ["Durable state", "workflows、credentials、executions 是否需要 managed PostgreSQL 與 restore drill？", "已定義 RPO/RTO、backup retention、restore owner。", "留在 VPS/PaaS，先完成 Postgres backup/restore。"],
      ["Secrets", "<code>N8N_ENCRYPTION_KEY</code>、DB password、OAuth secrets 是否需要 secret manager 與 rotation？", "Secret Manager/Secrets Manager 權限和 rotation plan 已明確。", "先用平台 secrets 或 password manager，避免把 AWS/GCP 當保險箱但沒設 IAM。"],
      ["IAM/service account", "是否能清楚分辨 deployer identity、runtime service account、task role？", "least privilege role 已列出，沒有 broad admin runtime identity。", "先不要進 Stage 3，否則 debug 權限會吃掉大量時間。"],
      ["Ingress", "是否需要 ALB/Cloud Run custom domain、health check、TLS、target group routing？", "health path、TLS、domain、webhook URL 都可驗證。", "若只需一個 domain，Caddy/PaaS 即可。"],
      ["Observability", "是否有人會維護 CloudWatch/Cloud Logging dashboards 與 alerts？", "有 alert threshold、on-call owner、log retention policy。", "不要只打開 logs，要先定義誰會看。"]
    ],
    "adoption12-table"
  );

  const adoptionRowsB = renderReportTable(
    ["類別", "採用前問題", "通過訊號", "未通過時建議"],
    [
      ["Scaling", "是否真的需要 autoscaling、multiple tasks、worker separation？", "有 execution volume、concurrency、webhook burst 證據。", "單機或 PaaS paid plan 可能更穩。"],
      ["Cost guardrails", "是否能估算 compute、DB、load balancer、egress、logs、secret、backup 成本？", "有 monthly estimate、budget alert、tagging policy。", "先不要用多 building blocks，避免小系統變複雜帳單。"],
      ["Operations", "是否有 patch、upgrade、rollback、backup、restore、incident runbook？", "runbook 可演練，不只是架構圖。", "先完成 Week 10/11 的基本 runbook。"],
      ["Compliance", "是否有 audit logs、IAM boundary、private networking、data residency 需求？", "需求明確且普通 VPS/PaaS 無法合理滿足。", "無合規需求時，不要為了品牌感進 hyperscaler。"],
      ["Team skill", "團隊是否能 debug VPC、security group、IAM、target group、DB connection limits？", "至少一人能操作，一人能 review。", "選 n8n Cloud 或低維運 PaaS。"]
    ],
    "adoption12-table"
  );

  addPage(
    "Chapter 12 · Section 12.5",
    "交付物三：hyperscaler adoption checklist I",
    `
      <section class="chapter-section full">
        <div class="section-number">12.5</div>
        <div>
          <h3>State、secrets、IAM、ingress、observability</h3>
          ${adoptionRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.5 continued",
    "交付物三：hyperscaler adoption checklist II",
    `
      <section class="chapter-section full">
        <div class="section-number">12.5</div>
        <div>
          <h3>Scaling、cost、operations、compliance、team skill</h3>
          ${adoptionRowsB}
        </div>
      </section>
    `
  );

  const goNoGo = renderReportTable(
    ["結果", "判斷"],
    [
      ["多數需求是「穩定 URL、Postgres、HTTPS、便宜」", "不需要 hyperscaler；VPS、PaaS 或 n8n Cloud 更合理。"],
      ["需求包含 IAM、managed DB、central logs、autoscaling、private network、audit、multi-env", "可以進 Cloud Run durable 或 AWS Stage 2。"],
      ["需求包含 container orchestration、rolling deploy、task isolation、worker autoscaling", "可以評估 AWS Stage 3 ECS/Fargate。"],
      ["團隊不會維護 alerts、backup、IAM、cost", "暫停 hyperscaler adoption；先補操作能力。"]
    ],
    "go-nogo12-table"
  );

  addPage(
    "Chapter 12 · Section 12.5 continued",
    "Go / No-Go 判斷",
    `
      <section class="chapter-section full">
        <div class="section-number">12.5</div>
        <div>
          <h3>Go / No-Go 判斷</h3>
          ${goNoGo}
        </div>
      </section>
    `
  );

  const routeCompare = renderReportTable(
    ["路線", "適合誰", "最小合理組合", "主要限制"],
    [
      ["Cloud Run durable", "想用 GCP managed serverless container，但願意接受 stateless runtime + external state", "Cloud Run + Cloud SQL PostgreSQL + Secret Manager + service account + Cloud Logging", "本機 filesystem 不應當主要 state；DB connection limits、cold start、revision/env var 管理要理解。"],
      ["AWS Stage 1", "想留在 AWS，但仍要 VPS-like mental model", "Lightsail container service 或 EC2 + Docker Compose + domain/TLS + backup", "AWS building blocks 用得少，省心有限；仍有 server patch 與單點問題。"],
      ["AWS Stage 2", "需要 managed DB/secrets/ingress/observability，但還不需要 ECS", "EC2 + RDS + Secrets Manager + ALB + CloudWatch", "組裝元件多，IAM/security group/VPC/ALB/RDS 都要設計。"],
      ["AWS Stage 3", "需要 container orchestration 與 production pipeline", "ECS/Fargate + RDS + Secrets Manager + ALB + CloudWatch Container Insights", "學習曲線與營運成本最高；DB connection pooling、task sizing、log costs 不能忽略。"]
    ],
    "route12-table"
  );

  addPage(
    "Chapter 12 · Section 12.6",
    "Cloud Run 與 AWS 路線比較",
    `
      <section class="chapter-section full">
        <div class="section-number">12.6</div>
        <div>
          <h3>Cloud Run 與 AWS 路線比較</h3>
          ${routeCompare}
        </div>
      </section>
    `
  );

  const costRows = renderReportTable(
    ["成本類型", "Cloud Run durable", "AWS Stage 2/3"],
    [
      ["Compute", "Cloud Run request/instance configuration 與 min instances 影響成本。", "EC2/Fargate 持續任務、service desired count、CPU/memory 直接影響成本。"],
      ["Database", "Cloud SQL tier、storage、backup、region 設定。", "RDS instance class、storage、backup retention、Multi-AZ、I/O。"],
      ["Secrets", "Secret Manager secret versions/access。", "Secrets Manager secret count、API calls、rotation Lambda 或 managed rotation。"],
      ["Ingress", "Cloud Run domain/load balancing/network egress 規則。", "ALB hourly/LCU、Route 53、ACM、egress。"],
      ["Logs", "Cloud Logging retention 與 ingest volume。", "CloudWatch Logs ingest/storage、Container Insights metrics。"],
      ["People", "GCP IAM、Cloud SQL、Cloud Run revision 操作能力。", "VPC/IAM/security groups/ALB/ECS/RDS/CloudWatch 操作能力。"]
    ],
    "cost12-table"
  );

  addPage(
    "Chapter 12 · Section 12.7",
    "成本與維運摘要",
    `
      <section class="chapter-section full">
        <div class="section-number">12.7</div>
        <div>
          <h3>成本與維運摘要</h3>
          ${costRows}
          <div class="tip-callout">
            <strong>真正貴的是沒有人負責的小組件</strong>
            <p>真正貴的通常不是單一 VM，而是「很多小 building blocks 每個都啟用一點點，再加上沒有人負責檢查」。hyperscaler 的價值要靠治理回收：標籤、budget alert、log retention、backup retention、least privilege、runbook、release rollback。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.8",
    "驗收說明：AWS 的強大與代價",
    `
      <section class="chapter-section">
        <div class="section-number">12.8</div>
        <div>
          <h3>AWS 的強大來自 building blocks</h3>
          <p>AWS 的強大來自 building blocks：你可以把 compute、networking、database、secrets、load balancing、logs、metrics、IAM、backup、container orchestration 拆成專門服務，再依需求組合。這種拆分讓 production 架構能逐步升級：從 Lightsail/EC2 single-server，到 EC2 + RDS + Secrets Manager + ALB + CloudWatch，再到 ECS/Fargate + RDS + ALB + Container Insights。</p>
          <div class="week12-building-blocks">
            <div>compute</div>
            <div>networking</div>
            <div>database</div>
            <div>secrets</div>
            <div>load balancing</div>
            <div>logs / metrics</div>
            <div>IAM</div>
            <div>backup</div>
            <div>orchestration</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.8 continued",
    "組裝與維運成本",
    `
      <section class="chapter-section">
        <div class="section-number">12.8</div>
        <div>
          <h3>每多一個 building block，就多一份責任</h3>
          <p>但這也帶來組裝與維運成本。每多一個 building block，就多一組 IAM 權限、網路邊界、健康檢查、計費項目、告警規則、備份策略、故障模式與文件責任。普通 VPS 或 PaaS 的價值是把很多選項收起來；hyperscaler 的價值是把每個選項交還給你。</p>
          <div class="note-band">
            <strong>驗收句</strong>
            <p>只有當你的可靠性、安全性、合規、擴展或治理需求真的需要這些選項時，進 AWS/GCP 才是升級，不是繞遠路。</p>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 Cloud Run durable 架構圖", "通過", "第 3 節與 <code>week-12-cloud-run-durable-architecture.json</code>"],
      ["完成 AWS 三階段演進圖", "通過", "第 4 節與 <code>week-12-aws-three-stage-evolution.json</code>"],
      ["完成 hyperscaler adoption checklist", "通過", "第 5 節與 <code>week-12-hyperscaler-adoption-checklist.csv</code>"],
      ["說明 Cloud Run easy mode vs durable mode", "通過", "第 3 節"],
      ["說明 Cloud SQL、Secret Manager、service account", "通過", "第 2、3 節"],
      ["說明 AWS Lightsail/EC2/ECS/RDS/Secrets Manager/ALB/CloudWatch 階梯", "通過", "第 4、6 節"],
      ["說明何時用簡單平台，何時值得進 AWS/GCP", "通過", "第 5、6、8 節"],
      ["說明 AWS building blocks 與組裝維運成本", "通過", "第 8 節"]
    ],
    "week12-completion-table"
  );

  addPage(
    "Chapter 12 · Section 12.9",
    "Week 12 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">12.9</div>
        <div>
          <h3>Week 12 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 12 · Section 12.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">12.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 13 會進入資料庫、binary data 與容量規劃。Week 12 已經把 Cloud SQL/RDS 放進 durable state layer，下一週要更細地回答：PostgreSQL 應該怎麼備份、execution history 如何影響容量、binary data 應該放 DB、filesystem 還是 external storage，以及什麼時候需要 Redis queue mode 與 workers。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 12 的成果，是把 hyperscaler 從「比較大的雲」拆成可驗收的 building blocks。只有 state、secrets、IAM、ingress、observability、scaling、cost、operations、compliance 與 team skill 都有答案，Cloud Run durable 或 AWS Stage 2/3 才是升級。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekThirteenChapter(week, startIndex) {
  const source = "docs/week-13-database-binary-capacity-planning.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["sizing recommendation table", "完成", "<code>artifacts/week-13-capacity/week-13-sizing-recommendation-table.json</code>；本章 13.3"],
      ["binary-heavy workflow 風險說明", "完成", "<code>artifacts/week-13-capacity/week-13-binary-heavy-risk-register.json</code>；本章 13.4"],
      ["容量觀察指標清單", "完成", "<code>artifacts/week-13-capacity/week-13-capacity-observation-metrics.csv</code>；本章 13.5"],
      ["server sizing table 解讀", "完成", "本章 13.2、13.3"],
      ["frequency、concurrency、binary size、wait states、AI calls、browser automation 影響整理", "完成", "本章 13.6"],
      ["Week 13 驗證腳本", "完成", "<code>scripts/verify-week-thirteen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 13 · Week 13",
    "資料庫、binary data 與容量規劃",
    `
      <div class="chapter-summary">
        <div class="week-icon">CAP</div>
        <div>
          <p class="kicker">13.0 本週定位</p>
          <p>Week 13 回答如何為不同負載選擇初始規格，並避免 binary-heavy workflow 拖垮記憶體。實作結果是完成 sizing recommendation table、binary-heavy workflow 風險說明、容量觀察指標清單，驗收重點鎖定在 small business 的 <code>4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring</code> 合理起點與調整理由。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">13.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week13-workload-flow">
        <div>Workload profile</div><span>→</span>
        <div>frequency + concurrency</div><span>→</span>
        <div>binary size + wait states</div><span>→</span>
        <div>AI calls + browser automation</div><span>→</span>
        <div>sizing recommendation</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>核心判斷不是「規格越大越安全」，而是先看 workflow 的資料形狀與執行模式，再用觀察指標決定是否升級。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-13"
  );

  const sourcesA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["server sizing table 與資源考量", "<a href=\"https://docs.n8n.io/hosting/oem-deployment/prerequisites/\">n8n prerequisites</a>", "n8n 官方 prerequisites 提醒需求會依 users、workflows、executions 而變；CPU 通常不是最先卡住的資源，memory 與資料形狀更關鍵。"],
      ["performance factors", "<a href=\"https://docs.n8n.io/hosting/scaling/performance-benchmarking/\">n8n performance benchmarking</a>", "n8n 官方 performance page 把 workflow type、available resources、scaling configuration 列為效能因素；精準估算應做 benchmark。"],
      ["scaling overview", "<a href=\"https://docs.n8n.io/hosting/scaling/overview/\">n8n scaling overview</a>", "大量 users、workflows、executions 時需要調整設定；queue mode 是主要 scaling 路線，execution data/pruning 會影響 database performance。"],
      ["supported databases", "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">Supported databases</a>", "n8n self-host 預設 SQLite，也支援 PostgreSQL；重要流程與多人使用應優先把 state 放在 PostgreSQL。"],
      ["database environment variables", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">Database environment variables</a>", "<code>DB_TYPE=postgresdb</code> 是切換到 PostgreSQL 的核心設定。"],
      ["queue mode", "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>", "queue mode 用 Redis 與 workers 拆分 execution；n8n 建議 queue mode 使用 Postgres 13+，不建議 SQLite。"]
    ],
    "week13-source-table"
  );

  const sourcesB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["concurrency control", "<a href=\"https://docs.n8n.io/hosting/scaling/concurrency-control/\">Concurrency control</a>", "regular mode 預設不限制 production executions，同時過多會造成 event loop thrash；可用 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code> 控制。"],
      ["execution data", "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>", "execution data pruning 預設啟用，會依 age 與 count 清理；<code>waiting</code> 狀態不會被 pruning。"],
      ["executions env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/executions/\">Executions environment variables</a>", "<code>EXECUTIONS_DATA_PRUNE</code>、<code>EXECUTIONS_DATA_MAX_AGE</code>、<code>EXECUTIONS_DATA_PRUNE_MAX_COUNT</code>、<code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code> 是容量控制重點。"],
      ["binary data", "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data</a>", "n8n 預設把 binary data 放在 memory，處理大檔可能 crash；filesystem mode 可把資料寫到 disk；queue mode 不支援 filesystem mode。"],
      ["binary data env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/binary-data/\">Binary data environment variables</a>", "<code>N8N_DEFAULT_BINARY_DATA_MODE</code> 可設為 <code>filesystem</code>、<code>s3</code> 或 <code>database</code>；active mode 會影響 binary data pruning。"],
      ["external storage", "<a href=\"https://docs.n8n.io/hosting/scaling/external-storage/\">External storage</a>", "Self-hosted Enterprise 可把 binary data 放到 S3，用來避免依賴 filesystem 承載大量 binary data。"]
    ],
    "week13-source-table"
  );

  const sourcesC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["memory-related errors", "<a href=\"https://docs.n8n.io/hosting/scaling/memory-errors/\">Memory-related errors</a>", "memory 問題通常來自 workflow 資料量、binary files、複製資料、並發與 node 行為，需要以 workload 方式分析。"],
      ["monitoring", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/monitoring/\">Monitoring</a>", "production 要開監控指標與健康檢查，尤其是 execution、queue、worker、process 指標。"],
      ["logging", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/logging/\">Logging</a>", "logs 是定位 crash、timeout、queue backlog、DB connection、external API error 的第一層證據。"],
      ["waiting", "<a href=\"https://docs.n8n.io/flow-logic/waiting/\">Waiting in n8n</a>", "Wait node 會讓 workflow 暫停後再從同一份資料恢復，會把 execution state 留在系統裡。"],
      ["AI workflows", "<a href=\"https://docs.n8n.io/advanced-ai/intro-tutorial/\">n8n AI workflows</a>", "AI workflow 會引入 model latency、token payload、tool calls 與評估資料，容量規劃要把外部 API 時間與資料大小納入。"],
      ["host command execution", "<a href=\"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/\">Execute Command</a>", "Execute Command 會在 host/container/worker 上執行 shell command；browser automation 若透過外部程序執行，會消耗 worker 所在節點的 CPU 與 memory。"]
    ],
    "week13-source-table"
  );

  addPage(
    "Chapter 13 · Section 13.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">13.2</div>
        <div>
          <h3>sizing、performance、database 與 queue mode</h3>
          ${sourcesA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">13.2</div>
        <div>
          <h3>concurrency、execution data、binary data 與 external storage</h3>
          ${sourcesB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">13.2</div>
        <div>
          <h3>memory、monitoring、logging、waiting、AI 與 browser automation</h3>
          ${sourcesC}
          <div class="note-band">
            <strong>來源判讀</strong>
            <p>本週的規格表不是把官方最小需求當 production 建議，而是把官方限制轉成操作規則：先用 workload profile 選一個保守起點，再用 metrics 決定升級。</p>
          </div>
        </div>
      </section>
    `
  );

  const sizingRowsA = renderReportTable(
    ["Profile", "初始規格", "Database", "Binary data mode", "Backup", "Monitoring", "合理使用範圍"],
    [
      ["learning", "1 vCPU / 1 到 2 GB RAM", "SQLite 可接受", "default 或 filesystem", "手動 export workflows + credentials key 保存", "local logs", "學習 n8n UI、少量 manual executions、無重要 production webhook。"],
      ["personal", "2 vCPU / 4 GB RAM", "SQLite 可用；重要流程改 PostgreSQL", "filesystem 優先", "每日 volume snapshot 或 DB dump", "基本 uptime + logs", "個人自動化、低頻 schedule、少量 webhook、binary file 偶發。"],
      ["freelancer", "2 vCPU / 4 GB RAM 起；客戶流程多時升到 4 vCPU / 8 GB RAM", "PostgreSQL 建議", "filesystem；queue mode 時改 database", "每日 PostgreSQL backup + restore drill", "HTTP、CPU、memory、disk、DB size", "多個客戶 workflow、需要穩定 webhook、仍是單機或低併發。"]
    ],
    "sizing13-table"
  );

  const sizingRowsB = renderReportTable(
    ["Profile", "初始規格", "Database", "Binary data mode", "Backup", "Monitoring", "合理使用範圍"],
    [
      ["small business", "4 vCPU / 8 GB RAM", "PostgreSQL", "filesystem；高併發或 queue mode 改 database/S3", "每日自動備份 + 每月 restore drill", "monitoring dashboard + alerts", "多人使用、固定 business workflow、moderate webhook、需要可恢復資料層。"],
      ["agency", "4 到 8 vCPU / 16 GB RAM 起；依 worker 數拆分", "Managed PostgreSQL", "database 或 S3；避免單機 filesystem 鎖死 workers", "PITR 或快照 + restore runbook", "Prometheus/CloudWatch/Grafana + log alert", "多客戶、多 workflow、併發 webhook、需要 worker separation 與環境隔離。"],
      ["AI-heavy", "8 vCPU / 16 到 32 GB RAM 起；worker 獨立 sizing", "Managed PostgreSQL + Redis queue mode", "S3 或 database；大檔不放 memory", "DB + object storage backup + retention policy", "model latency、error rate、queue depth、worker memory", "RAG、document processing、multi-step agents、browser automation、長 latency external API calls。"]
    ],
    "sizing13-table"
  );

  addPage(
    "Chapter 13 · Section 13.3",
    "交付物一：sizing recommendation table I",
    `
      <section class="chapter-section full">
        <div class="section-number">13.3</div>
        <div>
          <h3>learning、personal、freelancer</h3>
          ${sizingRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.3 continued",
    "交付物一：sizing recommendation table II",
    `
      <section class="chapter-section full">
        <div class="section-number">13.3</div>
        <div>
          <h3>small business、agency、AI-heavy</h3>
          ${sizingRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.3 continued",
    "規格升級路徑",
    `
      <section class="chapter-section full">
        <div class="section-number">13.3</div>
        <div>
          <h3>sizing ladder</h3>
          <div class="week13-sizing-ladder">
            <div><span>learning</span><strong>1 vCPU / 1-2 GB</strong></div>
            <div><span>personal</span><strong>2 vCPU / 4 GB</strong></div>
            <div><span>freelancer</span><strong>2-4 vCPU / 4-8 GB</strong></div>
            <div><span>small business</span><strong>4 vCPU / 8 GB + PostgreSQL + backup + monitoring</strong></div>
            <div><span>agency</span><strong>workers + Redis + managed PostgreSQL</strong></div>
            <div><span>AI-heavy</span><strong>larger workers + S3/database binary mode</strong></div>
          </div>
        </div>
      </section>
    `
  );

  const smallBusinessReasons = renderReportTable(
    ["層面", "判斷"],
    [
      ["CPU", "n8n 官方指出 CPU 通常不是最先卡住的資源，但 business workflow 會有多個 trigger、HTTP requests、transform、webhook response，4 vCPU 給 event loop、PostgreSQL client、background jobs、OS/container 留出餘裕。"],
      ["Memory", "binary data、Code node、large JSON payload、AI response、browser automation 都會推高 memory，8 GB 比 2 到 4 GB 更能承受 business burst。"],
      ["Database", "SQLite 適合學習與低風險個人使用；small business 需要 workflows、credentials、executions 可備份、可還原、可遷移，因此 PostgreSQL 是合理起點。"],
      ["Backup", "business 不是只要「今天能跑」，而是要能從錯誤升級、誤刪 workflow、DB corruption、host failure 裡恢復；每日 backup 與 restore drill 是基本線。"],
      ["Monitoring", "沒有 monitoring 就無法知道是 CPU、memory、DB、binary disk、queue、AI API 還是 webhook latency 卡住；small business 起點必須把 alerts 納入，不是等事故後再看 logs。"]
    ],
    "smallbiz13-table"
  );

  addPage(
    "Chapter 13 · Section 13.3 continued",
    "small business 起點結論",
    `
      <section class="chapter-section full">
        <div class="section-number">13.3</div>
        <div>
          <h3><code>4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring</code></h3>
          ${smallBusinessReasons}
        </div>
      </section>
    `
  );

  const adjustRows = renderReportTable(
    ["若觀察到", "調整"],
    [
      ["CPU 長時間高於 70%，execution latency 上升，但 memory 與 DB 正常", "增加 vCPU，或把重 CPU workflow 拆到 queue workers。"],
      ["memory RSS 長時間高於 70%，有 container restart 或 JavaScript heap error", "降低 concurrency、改 binary filesystem/database/S3、拆分大型 Code node、增加 RAM。"],
      ["PostgreSQL CPU、connection、storage 增長快", "調整 execution data save/prune、升級 DB tier、檢查長時間 waiting executions。"],
      ["webhook burst 導致 response time 升高", "設 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code>，或進 queue mode + workers + Redis。"],
      ["binary data disk 增長快", "啟用 pruning、改 external storage、限制檔案大小、縮短 retention。"],
      ["AI calls 與 browser automation 佔用時間長", "以 worker pool 隔離，設定 timeout/retry/rate limit，避免拖慢一般 webhook。"]
    ],
    "adjust13-table"
  );

  addPage(
    "Chapter 13 · Section 13.3 continued",
    "調整理由",
    `
      <section class="chapter-section full">
        <div class="section-number">13.3</div>
        <div>
          <h3>從觀察到調整</h3>
          ${adjustRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.4",
    "交付物二：binary-heavy workflow 風險說明",
    `
      <section class="chapter-section">
        <div class="section-number">13.4</div>
        <div>
          <h3>什麼是 binary-heavy workflow</h3>
          <p>binary-heavy workflow 指的是會處理 image、PDF、audio、video、large CSV、zip、document extraction、screenshots、headless browser downloads、AI document processing 的 workflow。這類 workflow 最大問題不是「檔案能不能進 n8n」，而是檔案在 execution 過程中會經過 memory、temporary storage、execution data、binary data mode、backup、pruning、download/upload API，每一層都可能被放大。</p>
          <div class="week13-binary-map">
            <div><span>default</span><strong>Memory pressure</strong><p>Crash or restart risk。</p></div>
            <div><span>filesystem</span><strong>Disk pressure</strong><p>Volume durability / disk full。</p></div>
            <div><span>database</span><strong>DB size pressure</strong><p>Large backups / restore delay。</p></div>
            <div><span>s3</span><strong>Object lifecycle</strong><p>Bucket policy / retention / cleanup。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const binaryRisksA = renderReportTable(
    ["風險", "為什麼危險", "早期訊號", "降低風險"],
    [
      ["default memory mode 處理大檔", "n8n 預設 binary data 在 memory；大檔與多併發會讓 process crash。", "memory RSS 上升、container restart、workflow 卡在同一個 binary step。", "production 改 <code>N8N_DEFAULT_BINARY_DATA_MODE=filesystem</code>；queue mode 改 database 或 external storage。"],
      ["filesystem mode disk 增長", "大量檔案會吃掉 volume；volume 沒持久化會在 redeploy 後遺失。", "disk usage 持續上升、binaryData 目錄過大、backup 時間增加。", "使用 persistent volume、disk alert、pruning、retention policy。"],
      ["database mode 放大 DB", "binary data 進 DB 會讓 storage、backup、restore、vacuum、query latency 都變重。", "DB size 快速成長、backup window 拉長、PostgreSQL I/O 高。", "只在 queue mode 或共享 worker 需要時使用；大檔優先 external storage。"]
    ],
    "binary-risk13-table"
  );

  const binaryRisksB = renderReportTable(
    ["風險", "為什麼危險", "早期訊號", "降低風險"],
    [
      ["S3/external storage lifecycle 不清楚", "object storage 可減輕 filesystem，但權限、retention、pruning mode 一定要一致。", "DB execution 已清理但 bucket 仍成長，或 workflow 找不到 object。", "bucket lifecycle、IAM least privilege、mode migration checklist、restore test。"],
      ["Wait node 與 binary data 結合", "<code>waiting</code> status 不會被 execution pruning 清掉；暫停的 execution 會保留資料直到恢復。", "waiting executions 數量上升、old execution data 保留、DB/storage 未下降。", "對 wait states 設計上限，避免把大型 binary data 帶進長等待。"],
      ["AI calls 處理文件", "AI workflow 會疊加文件抽取、prompt payload、response、tool calls、external API latency。", "AI API latency 上升、retry 多、execution duration 拉長。", "先縮小文件、分段處理、把長任務放 queue worker，設定 timeout 與 retry。"]
    ],
    "binary-risk13-table"
  );

  const binaryRisksC = renderReportTable(
    ["風險", "為什麼危險", "早期訊號", "降低風險"],
    [
      ["browser automation", "headless browser、screenshots、downloads 會在 host/container/worker 上吃 CPU、RAM、disk。", "worker memory spike、Chrome process 殘留、download 目錄暴增。", "worker 隔離、限制並發、清理 temp files、把 browser automation 與普通 webhook 分池。"],
      ["大 webhook payload", "外部服務一次送大檔或高頻 burst，會同時壓 memory、disk、DB 與 response time。", "webhook latency 上升、HTTP timeout、queue backlog。", "前置檔案大小限制、signed upload URL、queue mode、concurrency limit。"]
    ],
    "binary-risk13-table"
  );

  addPage(
    "Chapter 13 · Section 13.4 continued",
    "binary-heavy workflow 風險 I",
    `
      <section class="chapter-section full">
        <div class="section-number">13.4</div>
        <div>
          <h3>memory、filesystem、database</h3>
          ${binaryRisksA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.4 continued",
    "binary-heavy workflow 風險 II",
    `
      <section class="chapter-section full">
        <div class="section-number">13.4</div>
        <div>
          <h3>S3、Wait node、AI calls</h3>
          ${binaryRisksB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.4 continued",
    "binary-heavy workflow 風險 III",
    `
      <section class="chapter-section full">
        <div class="section-number">13.4</div>
        <div>
          <h3>browser automation 與大 webhook payload</h3>
          ${binaryRisksC}
        </div>
      </section>
    `
  );

  const metricsA = renderReportTable(
    ["指標", "為什麼要看", "警訊", "對應動作"],
    [
      ["CPU usage", "判斷 event loop、transform、browser automation 是否吃滿 CPU", "5 到 15 分鐘平均高於 70% 且 latency 上升", "增加 vCPU、拆 worker、降低並發。"],
      ["memory RSS / heap", "binary data、large JSON、Code node、AI payload 會推高 memory", "高於 70% 且持續上升，或出現 restart", "調整 binary mode、增加 RAM、拆 workflow。"],
      ["container restarts / OOM", "直接反映 crash 與容量不足", "任意非預期 restart", "查 logs、降低 concurrency、增加 memory、拆重任務。"],
      ["PostgreSQL storage", "execution data 與 binary data 會讓 DB 成長", "DB 每週增長超出預期或 backup window 變長", "調整 <code>EXECUTIONS_DATA_MAX_AGE</code>、prune count、改 binary storage。"],
      ["PostgreSQL connections", "queue mode、workers、webhook burst 會增加 DB connection", "接近 DB limit 或連線等待", "降低 worker 數、調 pool、升級 DB。"]
    ],
    "metrics13-table"
  );

  const metricsB = renderReportTable(
    ["指標", "為什麼要看", "警訊", "對應動作"],
    [
      ["execution count and duration", "直接描述實際 workload", "duration p95 上升或 failed execution 增加", "找出慢 workflow，拆分與加上 timeout。"],
      ["active / waiting executions", "waiting executions 會保留 state", "waiting 數量持續增加", "設等待上限，避免長時間保留大型 payload。"],
      ["queue depth / worker backlog", "queue mode 是否處理得過來", "queue depth 持續增加", "增加 workers、調整 concurrency、拆分重任務。"],
      ["webhook latency", "外部系統最直接感受到的 SLA", "p95 超過外部 provider timeout 風險", "快速回應，重任務放 background queue。"],
      ["binary storage size", "filesystem/S3/database 的容量風險", "binary storage 持續上升且 pruning 未下降", "檢查 active mode、lifecycle、retention、檔案大小。"]
    ],
    "metrics13-table"
  );

  const metricsC = renderReportTable(
    ["指標", "為什麼要看", "警訊", "對應動作"],
    [
      ["AI API latency/error rate", "外部 model 會拖長 execution", "latency 或 429/5xx 上升", "rate limit、retry backoff、fallback model。"],
      ["browser automation duration/memory", "headless browser 容易吃掉 worker", "duration 拉長、worker memory spike", "限制並發、獨立 worker pool、清 temp files。"],
      ["backup success and duration", "backup 是可恢復性的底線", "backup 失敗或 restore 未演練", "立即修復 backup，定期 restore drill。"],
      ["log error rate", "最早暴露 DB、queue、credentials、API、storage 問題", "同類 error 增加", "建立 alert，回到相關 runbook。"]
    ],
    "metrics13-table"
  );

  addPage(
    "Chapter 13 · Section 13.5",
    "交付物三：容量觀察指標清單 I",
    `
      <section class="chapter-section full">
        <div class="section-number">13.5</div>
        <div>
          <h3>CPU、memory、restart、PostgreSQL</h3>
          ${metricsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.5 continued",
    "交付物三：容量觀察指標清單 II",
    `
      <section class="chapter-section full">
        <div class="section-number">13.5</div>
        <div>
          <h3>execution、queue、webhook、binary storage</h3>
          ${metricsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.5 continued",
    "交付物三：容量觀察指標清單 III",
    `
      <section class="chapter-section full">
        <div class="section-number">13.5</div>
        <div>
          <h3>AI、browser automation、backup、logs</h3>
          ${metricsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.6",
    "負載因素如何改變初始規格 I",
    `
      <section class="chapter-section">
        <div class="section-number">13.6</div>
        <div>
          <h3>frequency</h3>
          <p>frequency 是 workflow 啟動頻率。每分鐘一個 schedule 與每天一次 manual run 的容量模型完全不同。高 frequency 會累積 execution count、DB writes、logs、API calls；如果每次又保存完整 execution data，PostgreSQL 與 backup 會比 CPU 更早成為瓶頸。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">13.6</div>
        <div>
          <h3>concurrency</h3>
          <p>concurrency 是同時間執行數。n8n regular mode 預設不限制 production executions，同時太多會讓 event loop thrash。small business 起點可先用 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code> 控制 burst；如果 webhook burst 變成常態，才進 queue mode、Redis、workers。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.6 continued",
    "負載因素如何改變初始規格 II",
    `
      <section class="chapter-section">
        <div class="section-number">13.6</div>
        <div>
          <h3>binary size</h3>
          <p>binary size 直接決定 memory、disk、DB、backup 壓力。default mode 下大檔會進 memory，filesystem mode 會壓 disk，database mode 會壓 DB，S3 mode 會壓 object lifecycle 與 permissions。binary-heavy workload 不應只看 vCPU/RAM，必須看檔案大小、保存時間、active binary mode 與 pruning。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">13.6</div>
        <div>
          <h3>wait states</h3>
          <p>wait states 會把 execution 暫停，再用同一份資料恢復。這對 rate limit 與人工確認很有用，但 <code>waiting</code> status 不會被 pruning，長時間等待加大型 payload 會讓 DB/storage 保留資料。設計時要避免把大型 binary data 帶入長等待。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.6 continued",
    "負載因素如何改變初始規格 III",
    `
      <section class="chapter-section">
        <div class="section-number">13.6</div>
        <div>
          <h3>AI calls</h3>
          <p>AI calls 的容量瓶頸常常不是 CPU，而是外部 API latency、token payload、retry、rate limit、document extraction 與 response size。AI-heavy workflow 應使用 queue workers、分段文件、timeout、retry backoff、model error monitoring，不要讓一般 webhook 和長 AI execution 搶同一個單機 process。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">13.6</div>
        <div>
          <h3>browser automation</h3>
          <p>browser automation 若透過 Execute Command、自建 node 或 worker 外部程序跑 headless browser，CPU、RAM、download directory、temp files 會在執行節點上爆量。它要獨立 worker pool、低 concurrency、明確 cleanup、process timeout；不要把它當普通 HTTP Request node 估容量。</p>
        </div>
      </section>
    `
  );

  const smallBizStart = renderReportTable(
    ["項目", "建議"],
    [
      ["Runtime", "4 vCPU / 8 GB RAM"],
      ["Database", "PostgreSQL，避免把 business state 放在 SQLite"],
      ["Binary data", "一般情境用 filesystem + persistent volume；queue mode 時改 database 或 external storage"],
      ["Backup", "每日 automated backup，至少每月一次 restore drill"],
      ["Monitoring", "CPU、memory、restart、HTTP status、webhook latency、DB storage、DB connections、execution failures、binary storage、backup status"],
      ["Concurrency", "先設定保守 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code>，觀察後再增加"],
      ["Upgrade trigger", "p95 latency 上升、memory 高水位、DB 增長過快、backup 超時、queue backlog、binary storage 成長不可控"]
    ],
    "smallbiz-start13-table"
  );

  addPage(
    "Chapter 13 · Section 13.7",
    "small business 起點建議",
    `
      <section class="chapter-section full">
        <div class="section-number">13.7</div>
        <div>
          <h3>建議起點</h3>
          ${smallBizStart}
        </div>
      </section>
    `
  );

  const upgradeRoutes = renderReportTable(
    ["狀態", "升級路線"],
    [
      ["單機 CPU/RAM 偶爾尖峰，但平均正常", "先調 workflow、pruning、concurrency，不急著加 workers。"],
      ["webhook latency 受重任務影響", "把重任務轉 background workflow，或使用 queue mode。"],
      ["execution 量增加，DB writes/reads 明顯上升", "升級 PostgreSQL、調 retention、避免保存不必要成功 execution data。"],
      ["binary data 成為主要容量來源", "轉 S3/external storage 或縮短 retention，並測 restore。"],
      ["AI-heavy 或 browser automation 成為主業務", "建立獨立 worker pool，規格從 8 vCPU / 16 GB RAM 起測。"]
    ],
    "upgrade13-table"
  );

  addPage(
    "Chapter 13 · Section 13.7 continued",
    "為什麼不是直接 2 vCPU / 4 GB RAM",
    `
      <section class="chapter-section">
        <div class="section-number">13.7</div>
        <div>
          <h3>8 GB RAM 是事故緩衝，不是浪費</h3>
          <p>2 vCPU / 4 GB RAM 可以跑很多 personal 或 freelancer 場景，但 small business 有幾個差異：多人使用、重要 webhook、固定工作流、更多 execution history、更多 credentials、更多錯誤重試、需要可預測 backup。8 GB RAM 不是浪費，而是給 binary data、large JSON、AI response、browser automation、Node.js heap、PostgreSQL client、OS/container 留一個事故緩衝。</p>
        </div>
      </section>
      <section class="chapter-section full">
        <div class="section-number">13.7</div>
        <div>
          <h3>什麼時候升級</h3>
          ${upgradeRoutes}
        </div>
      </section>
    `
  );

  const runbookA = renderReportTable(
    ["步驟", "動作"],
    [
      ["1", "先分類 workflow：learning、personal、freelancer、small business、agency、AI-heavy。"],
      ["2", "填 frequency、concurrency、binary size、wait states、AI calls、browser automation 六項影響因素。"],
      ["3", "選初始規格：small business 以 <code>4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring</code> 起步。"],
      ["4", "設 execution data policy：成功 execution 是否保存、保存多久、最多保存幾筆、manual executions 是否保存。"],
      ["5", "設 binary data mode：default 只適合小型與低風險；production binary-heavy 不使用 default memory mode。"]
    ],
    "runbook13-table"
  );

  const runbookB = renderReportTable(
    ["步驟", "動作"],
    [
      ["6", "設 alerts：CPU、memory、restart、DB storage、DB connections、disk、binary storage、queue depth、failed executions、backup failure。"],
      ["7", "跑 7 到 14 天觀察：看 p95 latency、memory high-water mark、DB growth、binary growth、backup duration。"],
      ["8", "按瓶頸調整：CPU 加 vCPU，memory 加 RAM 或改 binary mode，DB 升級或 prune，webhook burst 進 queue mode，AI/browser automation 拆 worker。"],
      ["9", "每次調整後做 restore drill，確認 backup 與 object storage lifecycle 沒有被規格變更破壞。"]
    ],
    "runbook13-table"
  );

  addPage(
    "Chapter 13 · Section 13.8",
    "規格調整 runbook I",
    `
      <section class="chapter-section full">
        <div class="section-number">13.8</div>
        <div>
          <h3>分類、填因素、選規格、設 policy</h3>
          ${runbookA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.8 continued",
    "規格調整 runbook II",
    `
      <section class="chapter-section full">
        <div class="section-number">13.8</div>
        <div>
          <h3>alerts、觀察、調整、restore drill</h3>
          ${runbookB}
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["讀 server sizing table", "通過", "第 2、3 節，採用 n8n prerequisites 與 performance 官方說明"],
      ["整理 learning、personal、freelancer、small business、agency、AI-heavy 初始規格", "通過", "第 3 節與 <code>week-13-sizing-recommendation-table.json</code>"],
      ["辨認 frequency、concurrency、binary size、wait states、AI calls、browser automation 影響", "通過", "第 6 節"],
      ["完成 sizing recommendation table", "通過", "第 3 節與 JSON artifact"],
      ["完成 binary-heavy workflow 風險說明", "通過", "第 4 節與 risk register JSON"],
      ["完成容量觀察指標清單", "通過", "第 5 節與 CSV artifact"],
      ["能為 small business 提出 4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring 起點或調整理由", "通過", "第 3、7、8 節"]
    ],
    "week13-completion-table"
  );

  addPage(
    "Chapter 13 · Section 13.9",
    "Week 13 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">13.9</div>
        <div>
          <h3>Week 13 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 13 · Section 13.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">13.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 14 會進入備份、還原與更新流程。Week 13 已定義 PostgreSQL、binary data、execution data、backup、monitoring 的容量基線，下一週要把這些基線變成可演練的 restore drill、upgrade runbook、rollback checklist 與版本更新節奏。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 13 的成果，是把容量規劃從「買大一點」轉成「看 workload、設 baseline、量 metrics、按瓶頸調整」。small business 的合理起點是 4 vCPU / 8 GB RAM / PostgreSQL / backup / monitoring，但 binary-heavy、AI-heavy、browser automation 都可能要求更早拆 worker 或改 storage mode。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekFourteenChapter(week, startIndex) {
  const source = "docs/week-14-backup-restore-update-runbook.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const backupCommandA = `set -euo pipefail

APP_DIR="artifacts/week-10-vps-caddy"
BACKUP_ID="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="backups/\${BACKUP_ID}"

cd "\${APP_DIR}"
mkdir -p "\${BACKUP_DIR}"
chmod 700 "\${BACKUP_DIR}"

set -a
. ./.env
set +a

docker compose --env-file .env -f compose.yaml config > "\${BACKUP_DIR}/docker-compose.rendered.yaml"
cp compose.yaml .env Caddyfile "\${BACKUP_DIR}/"
awk -F= '/^N8N_ENCRYPTION_KEY=/{print $2}' .env > "\${BACKUP_DIR}/n8n-encryption-key.txt"
chmod 600 "\${BACKUP_DIR}/.env" "\${BACKUP_DIR}/n8n-encryption-key.txt"

docker compose --env-file .env -f compose.yaml exec -T postgres \\
  pg_dump -U "\${POSTGRES_USER}" -d "\${POSTGRES_DB}" -Fc --no-owner --no-acl \\
  > "\${BACKUP_DIR}/database.dump"`;

  const backupCommandB = `docker run --rm \\
  -v n8n-week10-vps_n8n_data:/source:ro \\
  -v "\${PWD}/\${BACKUP_DIR}":/backup \\
  alpine:3.20 \\
  tar -czf /backup/n8n_data.tgz -C /source .

docker run --rm \\
  -v n8n-week10-vps_caddy_data:/source:ro \\
  -v "\${PWD}/\${BACKUP_DIR}":/backup \\
  alpine:3.20 \\
  tar -czf /backup/caddy_data.tgz -C /source .

docker run --rm \\
  -v n8n-week10-vps_caddy_config:/source:ro \\
  -v "\${PWD}/\${BACKUP_DIR}":/backup \\
  alpine:3.20 \\
  tar -czf /backup/caddy_config.tgz -C /source .

shasum -a 256 "\${BACKUP_DIR}"/* > "\${BACKUP_DIR}/SHA256SUMS"
find "\${BACKUP_DIR}" -maxdepth 1 -type f -print | sort`;

  const restoreCommandA = `set -euo pipefail

APP_DIR="artifacts/week-10-vps-caddy"
BACKUP_DIR="backups/20260528T000000Z"
RESTORE_PROJECT="n8n-week14-restore-drill"

cd "\${APP_DIR}"

shasum -a 256 -c "\${BACKUP_DIR}/SHA256SUMS"

docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" down --remove-orphans

docker volume rm "\${RESTORE_PROJECT}_n8n_data" "\${RESTORE_PROJECT}_caddy_data" "\${RESTORE_PROJECT}_caddy_config" "\${RESTORE_PROJECT}_postgres_data" 2>/dev/null || true
docker volume create "\${RESTORE_PROJECT}_n8n_data"
docker volume create "\${RESTORE_PROJECT}_caddy_data"
docker volume create "\${RESTORE_PROJECT}_caddy_config"
docker volume create "\${RESTORE_PROJECT}_postgres_data"

docker run --rm \\
  -v "\${RESTORE_PROJECT}_n8n_data":/target \\
  -v "\${PWD}/\${BACKUP_DIR}":/backup:ro \\
  alpine:3.20 \\
  sh -c 'cd /target && tar -xzf /backup/n8n_data.tgz'`;

  const restoreCommandB = `docker run --rm \\
  -v "\${RESTORE_PROJECT}_caddy_data":/target \\
  -v "\${PWD}/\${BACKUP_DIR}":/backup:ro \\
  alpine:3.20 \\
  sh -c 'cd /target && tar -xzf /backup/caddy_data.tgz'

docker run --rm \\
  -v "\${RESTORE_PROJECT}_caddy_config":/target \\
  -v "\${PWD}/\${BACKUP_DIR}":/backup:ro \\
  alpine:3.20 \\
  sh -c 'cd /target && tar -xzf /backup/caddy_config.tgz'

set -a
. "\${BACKUP_DIR}/.env"
set +a

docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" up -d postgres

docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" exec -T postgres \\
  sh -c "dropdb -U \\"\${POSTGRES_USER}\\" --if-exists \\"\${POSTGRES_DB}\\" && createdb -U \\"\${POSTGRES_USER}\\" \\"\${POSTGRES_DB}\\""

docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" exec -T postgres \\
  pg_restore -U "\${POSTGRES_USER}" -d "\${POSTGRES_DB}" --no-owner --no-acl --exit-on-error \\
  < "\${BACKUP_DIR}/database.dump"

docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" up -d n8n
docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" ps
docker compose -p "\${RESTORE_PROJECT}" --env-file "\${BACKUP_DIR}/.env" -f "\${BACKUP_DIR}/compose.yaml" logs --tail=120 n8n`;

  const updateCommand = `set -euo pipefail

docker compose --env-file .env -f compose.yaml pull n8n
docker compose --env-file .env -f compose.yaml up -d n8n
docker compose --env-file .env -f compose.yaml ps
docker compose --env-file .env -f compose.yaml logs --tail=120 n8n`;

  const rollbackCommand = `set -euo pipefail

PREVIOUS_IMAGE="docker.n8n.io/n8nio/n8n:2.22.4"

perl -0pi -e "s#docker\\\\.n8n\\\\.io/n8nio/n8n:[0-9]+\\\\.[0-9]+\\\\.[0-9]+#\${PREVIOUS_IMAGE}#g" compose.yaml
docker compose --env-file .env -f compose.yaml pull n8n
docker compose --env-file .env -f compose.yaml up -d n8n
docker compose --env-file .env -f compose.yaml ps
docker compose --env-file .env -f compose.yaml logs --tail=120 n8n`;

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["backup runbook", "完成", "<code>artifacts/week-14-recovery/week-14-backup-runbook.json</code>；本章 14.3"],
      ["restore runbook", "完成", "<code>artifacts/week-14-recovery/week-14-restore-runbook.json</code>；本章 14.4"],
      ["update / rollback checklist", "完成", "<code>artifacts/week-14-recovery/week-14-update-rollback-checklist.csv</code>；本章 14.5"],
      ["pg_dump 與 volume archive", "完成", "本章 14.3、14.4"],
      ["restore command 與演練", "完成", "本章 14.4、14.6"],
      ["release notes、image pinning、pull、restart、test、rollback", "完成", "本章 14.5、14.7"],
      ["Week 14 驗證腳本", "完成", "<code>scripts/verify-week-fourteen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 14 · Week 14",
    "備份、還原與更新流程",
    `
      <div class="chapter-summary">
        <div class="week-icon">REC</div>
        <div>
          <p class="kicker">14.0 本週定位</p>
          <p>Week 14 回答如何讓 n8n 不只會跑，還能在升級失敗或資料遺失時回得來。本週完成 backup runbook、restore runbook、update / rollback checklist，並明確保存 database、volume、encryption key、Compose/env/proxy config，設計一次隔離還原演練。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">14.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week14-flow">
        <div>Backup database</div><span>→</span>
        <div>Archive volumes</div><span>→</span>
        <div>Save encryption key + config</div><span>→</span>
        <div>Restore drill</div><span>→</span>
        <div>Pinned update / rollback</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Week 13 說 small business 要有 backup / monitoring；Week 14 把 backup 變成四個不可缺項：database dump、volume archive、encryption key 保存、Compose/env/proxy config 保存。缺任何一項，都可能造成「服務能起來，但回不到可用狀態」。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-14"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n Docker installation", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">n8n Docker installation</a>", "n8n Docker guide 建議 self-host 使用 Docker，並把 <code>n8n_data</code> volume 掛到 <code>/home/node/.n8n</code> 以保存資料；使用 PostgreSQL 時 <code>.n8n</code> 仍包含 encryption keys、logs、source control assets 等重要資料。"],
      ["n8n Docker Compose updating", "<a href=\"https://docs.n8n.io/hosting/installation/docker/#updating-docker-compose\">Updating Docker Compose</a>", "n8n 官方更新 Docker Compose 的基本流程是進 compose 目錄、<code>docker compose pull</code>、<code>docker compose down</code>、<code>docker compose up -d</code>；production 需要加上 backup、image pinning、smoke test 與 rollback。"],
      ["n8n release notes", "<a href=\"https://docs.n8n.io/release-notes/\">n8n release notes</a>", "n8n 發布節奏頻繁，release notes 說明 stable/beta、semantic versioning 與版本變更；升級前必須閱讀目標版本與中間版本資訊。"],
      ["n8n encryption key", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/\">n8n encryption key</a>", "n8n 用 encryption key 加密 credentials；若 key 遺失或更換，資料庫仍在也可能無法解密既有 credentials；queue mode 所有 workers 都要同一把 key。"]
    ],
    "week14-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n database env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">Database environment variables</a>", "PostgreSQL 模式需要保存 <code>DB_TYPE=postgresdb</code>、host、database、user、password、schema 等設定，還原時要與 backup 對應。"],
      ["n8n webhook URL", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Webhook URL</a>", "proxy/custom domain 後方要保存 <code>WEBHOOK_URL</code> 與 editor base URL，否則還原後 webhook 或 OAuth callback 會指錯位置。"],
      ["n8n binary data", "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data</a>", "binary data mode 會影響要備份的 storage；filesystem mode 需要 volume archive，database mode 會進 database dump，S3 mode 要另有 bucket/lifecycle/restore 策略。"],
      ["PostgreSQL pg_dump", "<a href=\"https://www.postgresql.org/docs/current/app-pgdump.html\">pg_dump</a>", "<code>pg_dump</code> 可匯出 PostgreSQL database；custom format <code>-Fc</code> 搭配 <code>pg_restore</code> 更適合還原演練與選擇性 restore。"]
    ],
    "week14-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["PostgreSQL pg_restore", "<a href=\"https://www.postgresql.org/docs/current/app-pgrestore.html\">pg_restore</a>", "<code>pg_restore</code> 可把 custom format dump 還原到指定 database；restore drill 應在隔離 database/project 中驗證，不直接覆蓋 production。"],
      ["Docker volumes", "<a href=\"https://docs.docker.com/engine/storage/volumes/\">Docker volumes</a>", "Docker volumes 是持久化資料層；volume archive 可用臨時容器把 volume 掛進去後用 tar 打包或解開。"],
      ["Docker Compose pull", "<a href=\"https://docs.docker.com/reference/cli/docker/compose/pull/\">docker compose pull</a>", "<code>docker compose pull</code> 取得 service image；本 runbook 要求先 pin 目標 tag 再 pull。"],
      ["Docker Compose up/down", "<a href=\"https://docs.docker.com/reference/cli/docker/compose/up/\">docker compose up</a> 與 <a href=\"https://docs.docker.com/reference/cli/docker/compose/down/\">docker compose down</a>", "<code>up -d</code> 啟動或重建 service；<code>down</code> 停止並移除 containers/networks，但不能搭配 <code>-v</code> 用在一般更新，避免誤刪 volumes。"]
    ],
    "week14-source-table"
  );

  addPage(
    "Chapter 14 · Section 14.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">14.2</div>
        <div>
          <h3>n8n Docker、更新、release notes 與 encryption key</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">14.2</div>
        <div>
          <h3>database、webhook URL、binary data、pg_dump</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">14.2</div>
        <div>
          <h3>pg_restore、Docker volumes、Compose pull/up/down</h3>
          ${sourceRowsC}
          <div class="note-band">
            <strong>架構對應</strong>
            <p>本週文件採用 Week 10 的 VPS + Docker Compose + Caddy 架構作為範本；如果實際 production 是 Cloud Run、AWS、Railway、Zeabur、Render 或 Fly.io，四個不可缺項仍相同，只是工具換成平台的 managed backup、volume snapshot、secret manager export policy 與 IaC config backup。</p>
          </div>
        </div>
      </section>
    `
  );

  const backupScope = renderReportTable(
    ["類別", "必須保存", "原因"],
    [
      ["database", "PostgreSQL dump：<code>database.dump</code>", "workflows、credentials metadata、executions、users、settings 等主要 state。"],
      ["volume", "<code>n8n_data.tgz</code>、必要時 <code>caddy_data.tgz</code>、<code>caddy_config.tgz</code>", "<code>/home/node/.n8n</code> 仍可能保存 encryption keys、logs、source control assets；proxy volumes 可能保存 certificates 或 Caddy state。"],
      ["encryption key", "<code>N8N_ENCRYPTION_KEY</code> 的受控副本", "credentials 解密依賴同一把 key；database 還原但 key 遺失仍會造成 credentials 無法使用。"],
      ["Compose/env/proxy config", "<code>compose.yaml</code>、<code>.env</code>、<code>Caddyfile</code>、<code>docker-compose.rendered.yaml</code>、checksum manifest", "還原時要重建相同 image、env vars、DB connection、WEBHOOK_URL、N8N_EDITOR_BASE_URL、proxy routing 與 TLS 設定。"]
    ],
    "backup-scope14-table"
  );

  addPage(
    "Chapter 14 · Section 14.3",
    "交付物一：backup runbook",
    `
      <section class="chapter-section full">
        <div class="section-number">14.3</div>
        <div>
          <h3>備份範圍</h3>
          ${backupScope}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.3 continued",
    "備份命令範本 I",
    `
      <section class="chapter-section full">
        <div class="section-number">14.3</div>
        <div>
          <h3>prepare、config、secret、database dump</h3>
          <p class="section-lead">以下命令以 <code>artifacts/week-10-vps-caddy</code> 架構為範本，production 使用前要在真正 compose 目錄執行，並確認 backup 目的地是加密磁碟、受控 object storage 或離線保管空間。</p>
          ${renderCodeBlock(backupCommandA, "backup14-block")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.3 continued",
    "備份命令範本 II",
    `
      <section class="chapter-section full">
        <div class="section-number">14.3</div>
        <div>
          <h3>volume archive、checksum、file list</h3>
          ${renderCodeBlock(backupCommandB, "backup14-block")}
        </div>
      </section>
    `
  );

  const backupAcceptance = renderReportTable(
    ["檢查", "通過條件"],
    [
      ["database dump", "<code>database.dump</code> 非空，<code>pg_restore -l database.dump</code> 可列出 archive contents。"],
      ["volume archive", "<code>n8n_data.tgz</code> 非空，<code>tar -tzf n8n_data.tgz</code> 可列出檔案；若使用 filesystem binary data，能看到對應 binary data 路徑或設定。"],
      ["encryption key", "<code>n8n-encryption-key.txt</code> 與 <code>.env</code> 中 <code>N8N_ENCRYPTION_KEY</code> 相同，檔案權限為 owner-only。"],
      ["Compose/env/proxy config", "<code>compose.yaml</code>、<code>.env</code>、<code>Caddyfile</code>、rendered compose 都在同一份 backup set。"],
      ["checksum", "<code>SHA256SUMS</code> 可在搬移後重新驗證。"],
      ["storage policy", "backup set 已移到 production host 以外的位置，且存放位置加密、有存取紀錄、有 retention。"]
    ],
    "backup-accept14-table"
  );

  addPage(
    "Chapter 14 · Section 14.3 continued",
    "備份驗收與失敗規則",
    `
      <section class="chapter-section full">
        <div class="section-number">14.3</div>
        <div>
          <h3>備份驗收</h3>
          ${backupAcceptance}
          <div class="tip-callout">
            <strong>失敗規則</strong>
            <p>若 <code>database.dump</code>、<code>n8n_data.tgz</code>、<code>N8N_ENCRYPTION_KEY</code>、<code>compose.yaml</code>、<code>.env</code>、<code>Caddyfile</code>、<code>docker-compose.rendered.yaml</code> 任一項缺失，本次 backup 不算完成。不能在 backup 不完整時進行 production upgrade。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.4",
    "交付物二：restore runbook",
    `
      <section class="chapter-section">
        <div class="section-number">14.4</div>
        <div>
          <h3>還原原則</h3>
          <p>還原演練必須在隔離 project 中進行，例如 <code>n8n-week14-restore-drill</code>。隔離的意思是：不使用 production container name，不接 production domain，不覆蓋 production volume，不讓外部 webhook provider 打到演練環境。演練目標是證明 backup set 可以重建出可登入、可解密 credentials、可查看 workflows、可連 PostgreSQL、可使用正確 proxy/env config 的 n8n。</p>
          <div class="week14-restore-map">
            <div>Verify checksums</div>
            <div>Create isolated project</div>
            <div>Restore volumes</div>
            <div>Restore database</div>
            <div>Start n8n with same key</div>
            <div>Smoke test</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.4 continued",
    "隔離還原命令範本 I",
    `
      <section class="chapter-section full">
        <div class="section-number">14.4</div>
        <div>
          <h3>checksum、isolated project、volume restore</h3>
          ${renderCodeBlock(restoreCommandA, "restore14-block")}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.4 continued",
    "隔離還原命令範本 II",
    `
      <section class="chapter-section full">
        <div class="section-number">14.4</div>
        <div>
          <h3>PostgreSQL restore、n8n start、logs</h3>
          ${renderCodeBlock(restoreCommandB, "restore14-block")}
        </div>
      </section>
    `
  );

  const restoreAcceptance = renderReportTable(
    ["驗收項", "通過條件"],
    [
      ["checksum", "<code>shasum -a 256 -c SHA256SUMS</code> 全部通過。"],
      ["PostgreSQL restore", "<code>pg_restore</code> exit code 為 0，logs 沒有 schema/owner/permission fatal error。"],
      ["n8n starts", "<code>docker compose ps</code> 顯示 <code>n8n</code> 與 <code>postgres</code> running 或 healthy。"],
      ["credentials decrypt", "登入演練環境後，既有 credentials 不出現 encryption key 相關錯誤。"],
      ["workflows visible", "既有 workflows、tags、users、settings 可見。"],
      ["volume data", "<code>.n8n</code> 相關資料存在；若使用 filesystem binary data，抽樣 execution 可讀取 binary data。"],
      ["Compose/env/proxy config", "<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>、Caddy reverse proxy 設定與 production 設計一致。"],
      ["isolation", "演練環境未接 production DNS，沒有外部 provider 對它送 production webhook。"]
    ],
    "restore-accept14-table"
  );

  addPage(
    "Chapter 14 · Section 14.4 continued",
    "還原演練驗收",
    `
      <section class="chapter-section full">
        <div class="section-number">14.4</div>
        <div>
          <h3>還原演練驗收</h3>
          ${restoreAcceptance}
        </div>
      </section>
    `
  );

  const failureDiagnosis = renderReportTable(
    ["症狀", "第一個檢查"],
    [
      ["n8n 起來但 credentials 無法使用", "<code>N8N_ENCRYPTION_KEY</code> 是否與 backup 時完全相同。"],
      ["workflows 不見", "PostgreSQL restore 是否用錯 database、schema、project 或 <code>.env</code>。"],
      ["webhook URL 指錯位置", "<code>.env</code>、<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、proxy config 是否保存並還原。"],
      ["binary data 讀不到", "binary data mode 是 filesystem、database 或 S3；對應 volume、DB 或 bucket 是否一起還原。"],
      ["Caddy/TLS 失效", "<code>Caddyfile</code>、<code>caddy_data</code>、<code>caddy_config</code>、domain DNS 是否一致。"]
    ],
    "restore-failure14-table"
  );

  addPage(
    "Chapter 14 · Section 14.4 continued",
    "還原失敗時的定位順序",
    `
      <section class="chapter-section full">
        <div class="section-number">14.4</div>
        <div>
          <h3>還原失敗時的定位順序</h3>
          ${failureDiagnosis}
        </div>
      </section>
    `
  );

  const updateChecklistA = renderReportTable(
    ["階段", "必做事項", "通過訊號", "失敗時動作"],
    [
      ["release notes", "閱讀 n8n release notes、目標版本與中間版本，標記 breaking changes、deprecated nodes、migration notes。", "upgrade ticket 中列出版本差異與風險。", "不升級，先補測試案例或等 patch release。"],
      ["image pinning", "把 <code>docker.n8n.io/n8nio/n8n:2.22.4</code> 這類明確 tag 寫進 compose，不用浮動 <code>latest</code> 當 production 依據。", "<code>docker compose config</code> 顯示 pinned tag。", "停止流程，先 pin tag。"],
      ["backup", "執行第 3 節 backup runbook，確認 database、volume、encryption key、Compose/env/proxy config 都保存。", "backup set 完整且 checksum 通過。", "不升級。"],
      ["restore drill", "用第 4 節 restore runbook 在隔離 project 演練。", "登入、credentials、workflows、webhook URL、logs 都通過。", "不升級，先修 backup 或 restore。"]
    ],
    "update-check14-table"
  );

  const updateChecklistB = renderReportTable(
    ["階段", "必做事項", "通過訊號", "失敗時動作"],
    [
      ["pull", "先 pull pinned target image。", "<code>docker compose pull n8n</code> 成功，image digest 已記錄。", "不重啟 production。"],
      ["restart", "用 <code>docker compose up -d n8n</code> 重建 n8n service；必要時依官方流程使用 <code>docker compose down</code> 再 <code>up -d</code>，但一般更新不能加 <code>-v</code>。", "service 起來，<code>docker compose ps</code> 正常。", "立即看 logs，必要時 rollback。"],
      ["test", "測 editor、login、workflow list、credential decrypt、manual execution、production webhook、proxy HTTPS、logs。", "smoke tests 全部通過。", "啟動 rollback。"],
      ["rollback", "把 compose image tag 改回 previous version，<code>docker compose pull n8n</code>，<code>docker compose up -d n8n</code>，用 backup set 驗證資料未被破壞。", "previous version 起來，smoke tests 通過。", "若 DB migration 已不可逆，改走 full restore plan。"],
      ["record", "記錄版本、image digest、backup id、restore drill result、測試結果、是否 rollback。", "release log 有完整證據。", "不關閉 change window。"]
    ],
    "update-check14-table"
  );

  addPage(
    "Chapter 14 · Section 14.5",
    "交付物三：update / rollback checklist I",
    `
      <section class="chapter-section full">
        <div class="section-number">14.5</div>
        <div>
          <h3>release notes、image pinning、backup、restore drill</h3>
          ${updateChecklistA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.5 continued",
    "交付物三：update / rollback checklist II",
    `
      <section class="chapter-section full">
        <div class="section-number">14.5</div>
        <div>
          <h3>pull、restart、test、rollback、record</h3>
          ${updateChecklistB}
        </div>
      </section>
    `
  );

  const drillData = renderReportTable(
    ["資料", "來源"],
    [
      ["<code>database.dump</code>", "<code>pg_dump -Fc</code> 產生的 PostgreSQL dump。"],
      ["<code>n8n_data.tgz</code>", "Docker volume archive，來源為 <code>n8n_data:/home/node/.n8n</code>。"],
      ["<code>caddy_data.tgz</code>、<code>caddy_config.tgz</code>", "proxy volume archive。"],
      ["<code>n8n-encryption-key.txt</code>", "<code>.env</code> 中的 <code>N8N_ENCRYPTION_KEY</code>。"],
      ["<code>compose.yaml</code>、<code>.env</code>、<code>Caddyfile</code>、<code>docker-compose.rendered.yaml</code>", "Compose/env/proxy config。"],
      ["<code>SHA256SUMS</code>", "備份完整性檢查。"]
    ],
    "drill-data14-table"
  );

  addPage(
    "Chapter 14 · Section 14.6",
    "還原演練設計 I",
    `
      <section class="chapter-section">
        <div class="section-number">14.6</div>
        <div>
          <h3>演練名稱與目標</h3>
          <p><strong>演練名稱：</strong><code>week-14-restore-drill-small-business-compose-postgres</code></p>
          <p>證明一份 backup set 可以在隔離 project 重建 n8n，並且 database、volume、encryption key、Compose/env/proxy config 都能一起工作。這不是只測 <code>pg_restore</code>，而是測「使用者真的能回到可用狀態」。</p>
        </div>
      </section>
      <section class="chapter-section full">
        <div class="section-number">14.6</div>
        <div>
          <h3>演練資料</h3>
          ${drillData}
        </div>
      </section>
    `
  );

  const drillTimeline = renderReportTable(
    ["時間", "動作"],
    [
      ["T-30 分鐘", "宣告演練，不接 production DNS，不使用 production project name。"],
      ["T-20 分鐘", "驗證 backup set 完整性與 checksum。"],
      ["T-15 分鐘", "建立隔離 volumes，解開 <code>n8n_data</code> 與 proxy archives。"],
      ["T-10 分鐘", "啟動 PostgreSQL，drop/create 演練 database，執行 <code>pg_restore</code>。"],
      ["T-5 分鐘", "啟動 n8n，確認 logs 沒有 encryption、DB、migration、permission fatal error。"],
      ["T+0 分鐘", "登入 editor，確認 workflows、credentials、webhook URL、manual execution。"],
      ["T+15 分鐘", "記錄 RTO、restore duration、錯誤、修正項。"],
      ["T+20 分鐘", "停止並清理演練 project，保留演練紀錄。"]
    ],
    "drill-timeline14-table"
  );

  addPage(
    "Chapter 14 · Section 14.6 continued",
    "還原演練設計 II",
    `
      <section class="chapter-section full">
        <div class="section-number">14.6</div>
        <div>
          <h3>演練時間線</h3>
          ${drillTimeline}
        </div>
      </section>
    `
  );

  const drillPass = renderReportTable(
    ["序號", "演練通過條件"],
    [
      ["1", "<code>SHA256SUMS</code> 完整通過。"],
      ["2", "<code>pg_restore</code> exit code 為 0。"],
      ["3", "<code>n8n</code> 起動後 logs 沒有 credentials decryption error。"],
      ["4", "workflows、credentials、users、settings 可見。"],
      ["5", "<code>WEBHOOK_URL</code> 與 <code>N8N_EDITOR_BASE_URL</code> 仍指向預期 production domain 或演練覆寫 domain，沒有變成 localhost。"],
      ["6", "若 binary data 使用 filesystem mode，至少抽樣一筆含 binary data 的 execution 可以讀取附件。"],
      ["7", "RTO 與 restore duration 有記錄，且不超過 small business 允許停機窗口。"]
    ],
    "drill-pass14-table"
  );

  addPage(
    "Chapter 14 · Section 14.6 continued",
    "還原演練設計 III",
    `
      <section class="chapter-section full">
        <div class="section-number">14.6</div>
        <div>
          <h3>演練通過條件</h3>
          ${drillPass}
        </div>
      </section>
    `
  );

  const updateBefore = renderReportTable(
    ["步驟", "更新前動作"],
    [
      ["1", "看 n8n release notes：確認 target version、previous version、semantic versioning 風險、breaking changes、deprecated nodes、migration notes。"],
      ["2", "固定 image tag：把 <code>docker.n8n.io/n8nio/n8n:2.22.4</code> 改成目標版本，例如 <code>docker.n8n.io/n8nio/n8n:2.23.0</code>。"],
      ["3", "生成 rendered compose：<code>docker compose --env-file .env -f compose.yaml config > docker-compose.pre-update.yaml</code>。"],
      ["4", "執行 backup runbook，確認 database、volume、encryption key、Compose/env/proxy config 都在 backup set。"],
      ["5", "執行 restore drill，確認 backup set 真的可用。"]
    ],
    "update-before14-table"
  );

  addPage(
    "Chapter 14 · Section 14.7",
    "更新與 rollback runbook I",
    `
      <section class="chapter-section full">
        <div class="section-number">14.7</div>
        <div>
          <h3>更新前</h3>
          ${updateBefore}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.7 continued",
    "更新與 rollback runbook II",
    `
      <section class="chapter-section full">
        <div class="section-number">14.7</div>
        <div>
          <h3>更新中</h3>
          ${renderCodeBlock(updateCommand, "update14-block")}
          <p class="section-lead">若此次更新涉及 database migration、major version、queue workers 或 schema 變更，先在 staging 或 restore drill project 跑一次，再進 production change window。</p>
        </div>
      </section>
    `
  );

  const smokeTests = renderReportTable(
    ["測試", "通過條件"],
    [
      ["editor", "可登入 n8n editor。"],
      ["workflows", "workflow list 可讀取，重要 workflow 可打開。"],
      ["credentials", "既有 credentials 不出現 decrypt error。"],
      ["manual execution", "一條低風險 workflow 可手動執行成功。"],
      ["webhook", "測試 webhook 回傳預期 HTTP status，production URL 不指 localhost。"],
      ["proxy", "HTTPS、Caddy reverse proxy、headers、<code>N8N_PROXY_HOPS</code> 正常。"],
      ["logs", "沒有 migration fatal error、DB connection error、permission error、encryption key error。"],
      ["monitoring", "failed execution rate、latency、restart count 沒有異常上升。"]
    ],
    "smoke14-table"
  );

  addPage(
    "Chapter 14 · Section 14.7 continued",
    "更新後 smoke test",
    `
      <section class="chapter-section full">
        <div class="section-number">14.7</div>
        <div>
          <h3>更新後 smoke test</h3>
          ${smokeTests}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.7 continued",
    "rollback",
    `
      <section class="chapter-section full">
        <div class="section-number">14.7</div>
        <div>
          <h3>rollback</h3>
          ${renderCodeBlock(rollbackCommand, "update14-block")}
          <div class="tip-callout">
            <strong>rollback 不是萬能</strong>
            <p>若新版本已執行不可逆 database migration，單純改回 image tag 可能不夠，這時要走 full restore：停止 service、還原 database dump、還原 volumes、放回 encryption key、放回 Compose/env/proxy config，再用 previous image 起動。這也是為什麼本週要求更新前必須先做 restore drill。</p>
          </div>
        </div>
      </section>
    `
  );

  const assets = renderReportTable(
    ["資產", "若遺失會發生什麼", "保存方式"],
    [
      ["PostgreSQL database", "workflows、credentials metadata、executions、users 可能消失。", "<code>pg_dump -Fc</code>、managed backup、restore drill。"],
      ["<code>n8n_data</code> volume", "<code>.n8n</code> 目錄內 encryption keys、logs、source control assets、binary data 可能遺失。", "Docker volume tar archive、persistent volume snapshot。"],
      ["<code>N8N_ENCRYPTION_KEY</code>", "credentials 可能無法解密，workflow 雖在但無法連外部服務。", "<code>.env</code> 受控備份、secret manager、離線密鑰保管。"],
      ["<code>compose.yaml</code>", "service、image、volumes、networks、env mapping 無法重建。", "Git/IaC、backup set、rendered compose。"],
      ["<code>.env</code>", "DB password、public URL、timezone、encryption key、runtime settings 遺失。", "加密備份、secret manager、權限 600。"],
      ["<code>Caddyfile</code>", "reverse proxy、HTTPS、headers、upstream routing 遺失。", "Git/IaC、backup set。"],
      ["<code>caddy_data</code> / <code>caddy_config</code>", "Caddy certificates/state 可能重新申請或失效。", "volume archive，或確保可由 DNS/TLS 自動重建。"],
      ["release log", "無法知道哪個版本、backup id、image digest、測試結果與 rollback 決策。", "變更紀錄與 artifact checksum。"]
    ],
    "assets14-table"
  );

  addPage(
    "Chapter 14 · Section 14.8",
    "不可遺失資產清單",
    `
      <section class="chapter-section full">
        <div class="section-number">14.8</div>
        <div>
          <h3>不可遺失資產清單</h3>
          ${assets}
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 backup runbook", "通過", "第 3 節與 <code>week-14-backup-runbook.json</code>"],
      ["完成 restore runbook", "通過", "第 4、6 節與 <code>week-14-restore-runbook.json</code>"],
      ["完成 update / rollback checklist", "通過", "第 5、7 節與 <code>week-14-update-rollback-checklist.csv</code>"],
      ["包含 pg_dump 與 volume archive", "通過", "第 3、4 節"],
      ["包含 restore command 與演練", "通過", "第 4、6 節"],
      ["包含 release notes、image pinning、pull、restart、test、rollback", "通過", "第 5、7 節"],
      ["明確保存 database、volume、encryption key、Compose/env/proxy config", "通過", "第 3、8 節"],
      ["做一次還原演練設計", "通過", "第 6 節"]
    ],
    "week14-completion-table"
  );

  addPage(
    "Chapter 14 · Section 14.9",
    "Week 14 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">14.9</div>
        <div>
          <h3>Week 14 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 14 · Section 14.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">14.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 15 會進入安全責任、使用者管理與 patch cadence。Week 14 已經定義更新前必須 backup、restore drill、image pinning、smoke test、rollback，下一週要把這套流程延伸到 access control、2FA、user lifecycle、secret rotation、patch cadence 與安全事件責任分工。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 14 的成果，是把「有備份」變成「能演練還原」：database、volume、encryption key、Compose/env/proxy config 必須在同一個 backup set 裡，並且要先在隔離 project 驗證成功，才有資格進 production update。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekFifteenChapter(week, startIndex) {
  const source = "docs/week-15-security-responsibility-patch-cadence.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["security responsibility matrix", "完成", "<code>artifacts/week-15-security/week-15-security-responsibility-matrix.json</code>；本章 15.3"],
      ["public exposure hardening checklist", "完成", "<code>artifacts/week-15-security/week-15-public-exposure-hardening-checklist.csv</code>；本章 15.4"],
      ["patch cadence policy", "完成", "<code>artifacts/week-15-security/week-15-patch-cadence-policy.json</code>；本章 15.5"],
      ["Cloud/local/tunnel/VPS/PaaS/hyperscaler 責任分界", "完成", "本章 15.3、15.6"],
      ["HTTPS-only、secure cookies、SMTP/user management、2FA、SSO、secrets", "完成", "本章 15.4、15.7"],
      ["2026 之後 public instance 的 aggressively update 原則", "完成", "本章 15.5、15.8"],
      ["Week 15 驗證腳本", "完成", "<code>scripts/verify-week-fifteen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 15 · Week 15",
    "安全責任、使用者管理與 Patch Cadence",
    `
      <div class="chapter-summary">
        <div class="week-icon">SEC</div>
        <div>
          <p class="kicker">15.0 本週定位</p>
          <p>執行日期：2026-05-28。本週目標是回答公開 self-hosted n8n 時，哪些責任會回到自己身上。Week 14 已把 backup、restore drill、image pinning、smoke test、rollback 定成更新前底線；Week 15 把更新放回安全語境，明確定義 public instance 的責任分界、hardening checklist 與 patch cadence。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">15.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week15-flow">
        <div>Ingress<br><span>HTTPS-only / proxy</span></div><span>→</span>
        <div>Identity<br><span>users / SMTP / 2FA / SSO</span></div><span>→</span>
        <div>Secrets<br><span>key / vault / env</span></div><span>→</span>
        <div>Runtime<br><span>API / SSRF / risky nodes</span></div><span>→</span>
        <div>Operations<br><span>audit / backup / patch</span></div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>公開 n8n instance 不是「workflow 工具開到網路上」而已。它同時接收 webhook、登入請求、API requests、OAuth callbacks、檔案、workflow data、credentials 與第三方 token。只要 self-host，安全邊界就回到部署方手上。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-15"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["選擇 Cloud 或 self-host", "<a href=\"https://docs.n8n.io/choose-n8n/\">Choose n8n</a>", "n8n 明確說 self-hosting 需要設定伺服器、資源、security、configuration；若沒有 server 管理經驗，建議 n8n Cloud。"],
      ["n8n Cloud", "<a href=\"https://docs.n8n.io/choose-n8n/cloud/\">n8n Cloud</a>", "n8n Cloud 是 hosted solution，提供 no technical setup/maintenance、uptime monitoring、managed OAuth、one-click upgrades；但 workflow、credentials、users、資料處理仍要由使用者治理。"],
      ["n8n Cloud 更新", "<a href=\"https://docs.n8n.io/manage-cloud/update-cloud-version/\">Update Cloud version</a>", "n8n Cloud 也建議 regular updates、檢查 release notes、先測試；Cloud instance 長期不更新會被通知並自動更新。"],
      ["Docker self-host", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">Docker installation</a>", "n8n Docker guide 說 self-hosting mistakes can lead to data loss, security issues, downtime；tunnel 是 local development/testing，不安全於 production。"],
      ["self-host 更新", "<a href=\"https://docs.n8n.io/hosting/installation/updating/\">Updating n8n</a>", "n8n 官方建議 keep version up to date、frequent update、check release notes、至少每月一次、先用 test instance。"]
    ],
    "week15-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["release notes", "<a href=\"https://docs.n8n.io/release-notes/\">Release notes</a>", "n8n 發布頻率高，stable/beta 與 semantic versioning 會影響 public instance 的風險判斷；patch cadence 必須看 release notes。"],
      ["Securing n8n", "<a href=\"https://docs.n8n.io/hosting/securing/overview/\">Securing overview</a>", "官方安全總覽包含 security audit、SSL、SSO、2FA、redact execution data、disable public API、block nodes、SSRF protection、restrict account registration 等方向。"],
      ["Security audit", "<a href=\"https://docs.n8n.io/hosting/securing/security-audit/\">Security audit</a>", "n8n audit 可檢查 credentials、database、filesystem、nodes、instance，包括 unprotected webhooks、missing security settings、outdated instance。"],
      ["Disable public API", "<a href=\"https://docs.n8n.io/hosting/securing/disable-public-api/\">Disable public API</a>", "若不用 public REST API，官方建議設定 <code>N8N_PUBLIC_API_DISABLED=true</code>；API playground 也可停用。"],
      ["User management", "<a href=\"https://docs.n8n.io/user-management/\">User management</a>", "n8n user management 包含 login/password、adding/removing users、Owner/Admin/Member。"]
    ],
    "week15-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Self-hosted user management", "<a href=\"https://docs.n8n.io/hosting/configuration/user-management-self-hosted/\">Self-hosted user management</a>", "Self-hosted n8n 建議設定 SMTP 以支援 invites 與 password resets；沒有 SMTP 時使用者不能 reset password。"],
      ["Manage users", "<a href=\"https://docs.n8n.io/user-management/manage-users/\">Manage users</a>", "刪除 active user 時要決定移轉或永久刪除 workflows/credentials；offboarding 必須有資料歸屬決策。"],
      ["Account types", "<a href=\"https://docs.n8n.io/user-management/account-types/\">Account types</a>", "Owner、Admin、Member 權限不同；官方建議 owner 建立 member-level account 做日常工作，降低覆寫他人工作風險。"],
      ["User management SMTP and 2FA env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/user-management-smtp-2fa/\">SMTP and 2FA env vars</a>", "<code>N8N_EMAIL_MODE</code>、SMTP variables、<code>N8N_MFA_ENABLED</code>、<code>N8N_INVITE_LINKS_EMAIL_ONLY</code> 都是公開 instance 的 identity hardening 重點。"],
      ["SSO", "<a href=\"https://docs.n8n.io/hosting/securing/set-up-sso/\">Set up SSO</a>", "Business/Enterprise 可用 SAML/OIDC SSO；可用環境變數管理 SSO。"]
    ],
    "week15-source-table"
  );

  const sourceRowsD = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Security env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/security/\">Security env vars</a>", "<code>N8N_SECURE_COOKIE</code>、<code>N8N_SAMESITE_COOKIE</code>、<code>N8N_BLOCK_ENV_ACCESS_IN_NODE</code>、<code>N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS</code>、security policy env vars 都屬於公開 instance hardening。"],
      ["SSRF protection", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/ssrf-protection/\">SSRF protection</a>", "<code>N8N_SSRF_PROTECTION_ENABLED</code> 與 blocked/allowed ranges 用來限制 workflow nodes 連到內網或 metadata services。"],
      ["Nodes env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/nodes/\">Nodes env vars</a>", "<code>NODES_EXCLUDE</code> 可封鎖高風險 nodes，community packages 與 unverified packages 也可用環境變數控制。"],
      ["Community node risks", "<a href=\"https://docs.n8n.io/integrations/community-nodes/risks/\">Community node risks</a>", "community nodes 可能有 system security、data security、breaking changes 風險；self-host 可停用 community nodes。"],
      ["External secrets", "<a href=\"https://docs.n8n.io/external-secrets/\">External secrets</a>", "Enterprise 可用 1Password、AWS Secrets Manager、Azure Key Vault、GCP Secrets Manager、HashiCorp Vault 管理 secrets，並用 project vaults 限制範圍。"]
    ],
    "week15-source-table"
  );

  addPage(
    "Chapter 15 · Section 15.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">15.2</div>
        <div>
          <h3>Cloud、self-host、Docker 與更新責任</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">15.2</div>
        <div>
          <h3>release notes、security audit、public API 與 user management</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">15.2</div>
        <div>
          <h3>SMTP、offboarding、account types、2FA 與 SSO</h3>
          ${sourceRowsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.2 continued",
    "官方來源核對 IV",
    `
      <section class="chapter-section full">
        <div class="section-number">15.2</div>
        <div>
          <h3>security env vars、SSRF、nodes、community nodes 與 secrets</h3>
          ${sourceRowsD}
          <div class="note-band">
            <strong>本週安全立場</strong>
            <p>public exposure 不是只要 Caddy/HTTPS 起來就完成。公開 instance 的安全邊界由版本新舊、登入與使用者管理、cookies、SMTP、2FA/SSO、secrets、API、SSRF、risky nodes、community nodes、logs、backup、audit、patch cadence 一起構成。</p>
          </div>
        </div>
      </section>
    `
  );

  const responsibilityRowsA = renderReportTable(
    ["架構", "平台承擔", "使用者仍要承擔", "不可誤解"],
    [
      ["n8n Cloud", "Hosting、基礎維運、uptime monitoring、managed OAuth、one-click upgrades、自動更新過舊 Cloud instances。", "workflow 設計、credentials hygiene、user access、2FA/SSO 設定、execution data 管理、版本測試與 release notes 判讀。", "Cloud 不是把所有安全責任交給 n8n；你的 workflow 仍可外洩資料或誤用 credentials。"],
      ["local only", "幾乎沒有公開 ingress；主要由本機 Docker/Desktop 與 OS 提供隔離。", "本機帳號、Docker Desktop、volume、credentials、<code>.env</code>、backup、版本更新。", "local only 不代表不需要 security，只是 attack surface 比 public instance 小。"],
      ["local tunnel", "tunnel 服務提供暫時 public URL。", "所有 n8n security、webhook exposure、credentials、版本更新、log review、關閉 tunnel。", "n8n 官方 tunnel 是 local development/testing，不安全於 production。"]
    ],
    "week15-responsibility-table"
  );

  const responsibilityRowsB = renderReportTable(
    ["架構", "平台承擔", "使用者仍要承擔", "不可誤解"],
    [
      ["VPS + Docker Compose + Caddy", "VPS provider 提供 VM 與網路；Caddy 可處理 reverse proxy/HTTPS；Docker 提供 container packaging。", "OS patch、firewall、Docker update、n8n update、PostgreSQL、backup/restore、Caddy config、secrets、users、2FA、audit、monitoring。", "80/443 開出去後，安全責任大部分都在你身上。"],
      ["PaaS", "平台通常處理 deploy、TLS、custom domain、logs、部分 secrets UI、managed PostgreSQL 選項。", "state persistence、env vars、database backup、n8n version、user access、2FA/SSO、public URL、cost、vendor limits。", "服務能啟動不代表 state、安全設定、update cadence 正確。"],
      ["hyperscaler", "Cloud Run/AWS 等提供 IAM、managed DB、secret manager、load balancer、logs、metrics、network controls。", "IAM least privilege、service account、security groups、secret scope、patch cadence、image pinning、backup/restore、incident response、cost controls。", "building blocks 強大，但組裝錯就是更大的 attack surface。"]
    ],
    "week15-responsibility-table"
  );

  addPage(
    "Chapter 15 · Section 15.3",
    "交付物一：security responsibility matrix I",
    `
      <section class="chapter-section full">
        <div class="section-number">15.3</div>
        <div>
          <h3>Cloud、local only、local tunnel</h3>
          ${responsibilityRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.3 continued",
    "交付物一：security responsibility matrix II",
    `
      <section class="chapter-section full">
        <div class="section-number">15.3</div>
        <div>
          <h3>VPS、PaaS、hyperscaler</h3>
          ${responsibilityRowsB}
          <div class="week15-responsibility-lens">
            <div><span>Cloud</span><strong>shared workflow governance</strong></div>
            <div><span>Local</span><strong>small public surface, real secrets</strong></div>
            <div><span>Tunnel</span><strong>testing only, no production boundary</strong></div>
            <div><span>VPS</span><strong>operator owns the edge</strong></div>
            <div><span>PaaS</span><strong>state and patching still yours</strong></div>
            <div><span>Hyperscaler</span><strong>powerful blocks, careful assembly</strong></div>
          </div>
        </div>
      </section>
    `
  );

  const responsibilitySummary = renderReportTable(
    ["責任", "Cloud", "local", "tunnel", "VPS", "PaaS", "hyperscaler"],
    [
      ["HTTPS-only", "Cloud 平台處理大多數 ingress", "通常不公開", "暫時 URL，不做 production", "Caddy/proxy/firewall", "平台或自訂 domain", "LB/Cloud Run/ALB/API Gateway"],
      ["n8n upgrade", "Cloud dashboard + 自動更新政策", "使用者", "使用者", "使用者", "使用者或平台 image", "使用者 image/revision/task"],
      ["user management", "使用者", "使用者", "使用者", "使用者", "使用者", "使用者"],
      ["2FA/SSO", "使用者設定", "使用者設定", "使用者設定", "使用者設定", "使用者設定", "使用者設定"],
      ["SMTP/invite/password reset", "Cloud 或使用者設定依方案", "使用者", "使用者", "使用者", "使用者", "使用者"],
      ["secrets", "Cloud features + 使用者治理", "<code>.env</code>/password manager", "<code>.env</code>/password manager", "<code>.env</code>/secret store", "platform secrets", "Secret Manager/Secrets Manager"],
      ["backup/restore", "依 Cloud plan 與 export 能力", "使用者", "使用者", "使用者", "使用者確認", "使用者設計"],
      ["audit/monitoring", "Cloud 提供部分能力", "使用者", "使用者", "使用者", "平台 + 使用者", "Cloud logs + 使用者"]
    ],
    "week15-summary-table"
  );

  addPage(
    "Chapter 15 · Section 15.3 continued",
    "責任分界摘要",
    `
      <section class="chapter-section full">
        <div class="section-number">15.3</div>
        <div>
          <h3>責任分界摘要</h3>
          ${responsibilitySummary}
          <div class="tip-callout">
            <strong>視覺化總結</strong>
            <p>越接近 Cloud，平台承擔越多 infrastructure；越接近 VPS/hyperscaler，你得到越多控制權，也接手更多 patch、user lifecycle、secret scope、backup、monitoring 與 incident response。</p>
          </div>
        </div>
      </section>
    `
  );

  const hardeningRowsA = renderReportTable(
    ["類別", "檢查項", "必要設定或證據", "失敗時風險"],
    [
      ["HTTPS-only", "所有 editor、webhook、OAuth callback 都走 HTTPS", "<code>WEBHOOK_URL=https://n8n.example.com/</code>、<code>N8N_EDITOR_BASE_URL=https://n8n.example.com/</code>、proxy TLS 通過", "cookie、token、OAuth callback 暴露，外部 provider 指錯 URL。"],
      ["secure cookies", "cookies 只在 HTTPS 傳送", "<code>N8N_SECURE_COOKIE=true</code>，<code>N8N_SAMESITE_COOKIE=lax</code> 或更嚴格", "session cookie 可在錯誤 transport 下暴露。"],
      ["reverse proxy", "proxy headers 正確", "<code>N8N_PROXY_HOPS</code> 依實際 hops 設定，Caddy/ALB/Cloud Run headers 通過 smoke test", "n8n 生成 URL、IP、redirect 判斷錯誤。"],
      ["owner account", "Owner 不做日常 workflow 編輯", "owner 建立 member-level account 供日常使用", "owner 權限過大，誤改他人 workflow/credentials。"],
      ["user lifecycle", "invite、remove、transfer 都有流程", "<code>Settings &gt; Users</code> 清單月檢；offboarding 決定 workflow/credentials 移轉或刪除", "離職帳號仍可登入或資料歸屬不明。"],
      ["SMTP", "user invites/password reset 可用", "<code>N8N_EMAIL_MODE=smtp</code>、<code>N8N_SMTP_HOST</code>、<code>N8N_SMTP_SENDER</code>、SSL/STARTTLS", "無法安全邀請、無法 reset password，導致人工分享 invite links。"]
    ],
    "week15-hardening-table"
  );

  const hardeningRowsB = renderReportTable(
    ["類別", "檢查項", "必要設定或證據", "失敗時風險"],
    [
      ["invite links", "invite links 不從 API 暴露", "<code>N8N_INVITE_LINKS_EMAIL_ONLY=true</code>", "高權限或程式化存取可取得 invite URL。"],
      ["2FA", "所有互動使用者啟用 MFA", "<code>N8N_MFA_ENABLED=true</code>，Business/Enterprise 可用 <code>N8N_MFA_ENFORCED_ENABLED=true</code>", "密碼外洩後沒有第二層防線。"],
      ["SSO", "有 IdP 的組織使用 SAML/OIDC", "Business/Enterprise 啟用 SSO，role provisioning 決策已記錄", "帳號 lifecycle 與企業 IdP 脫節。"],
      ["secrets", "credentials secrets 不散落在 workflow text 或 <code>.env</code>", "<code>N8N_ENCRYPTION_KEY</code> 保存；Enterprise 使用 external secrets 或平台 secret manager", "secrets 複製、外洩、旋轉困難。"],
      ["environment access", "workflow 使用者不能任意讀 env vars", "<code>N8N_BLOCK_ENV_ACCESS_IN_NODE=true</code>，敏感 env 改用 secret store", "Code node/expression 可能讀取 secrets。"],
      ["file access", "限制 workflow 讀寫檔案", "<code>N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES=true</code>，<code>N8N_RESTRICT_FILE_ACCESS_TO</code>", "workflow 可碰到不該碰的 host/container 檔案。"]
    ],
    "week15-hardening-table"
  );

  const hardeningRowsC = renderReportTable(
    ["類別", "檢查項", "必要設定或證據", "失敗時風險"],
    [
      ["SSRF", "HTTP 類 nodes 不可打 metadata/internal ranges", "<code>N8N_SSRF_PROTECTION_ENABLED=true</code>，blocked ranges 包含 default", "workflow 可探測內網或 cloud metadata service。"],
      ["public API", "不用就關閉", "<code>N8N_PUBLIC_API_DISABLED=true</code>，<code>N8N_PUBLIC_API_SWAGGERUI_DISABLED=true</code>", "暴露不必要的管理 API surface。"],
      ["risky nodes", "高風險 nodes 要封鎖或限縮", "<code>NODES_EXCLUDE</code> 至少包含 <code>n8n-nodes-base.executeCommand</code> 與不信任的自訂風險 nodes", "workflow 可在 host/container 執行命令或碰 filesystem。"],
      ["community nodes", "不信任供應鏈時停用或只允許 verified", "<code>N8N_COMMUNITY_PACKAGES_ENABLED=false</code> 或 <code>N8N_UNVERIFIED_PACKAGES_ENABLED=false</code>", "安裝來自 npm 的未驗證程式碼。"],
      ["audit", "定期跑 n8n audit", "<code>n8n audit</code> 或 API audit，記錄 credentials、database、filesystem、nodes、instance findings", "unprotected webhooks、missing security settings、outdated instance 不被看見。"],
      ["execution data", "敏感 output 不長期保存", "redact execution data、成功 execution retention、manual execution discipline", "logs/executions 成為敏感資料倉庫。"]
    ],
    "week15-hardening-table"
  );

  const hardeningRowsD = renderReportTable(
    ["類別", "檢查項", "必要設定或證據", "失敗時風險"],
    [
      ["backup", "security change 前可還原", "Week 14 backup + restore drill 通過", "patch 失敗或帳號誤刪後不能回復。"],
      ["patch cadence", "public instance aggressive update", "每週 release note triage；critical 24 到 48 小時；high 7 天內；routine 至少每月", "公開安全邊界長期停在舊漏洞面。"],
      ["monitoring", "登入、errors、restart、audit findings 可追蹤", "logs、alerts、failed execution rate、restart count、HTTP 5xx", "攻擊、錯誤、版本問題無人發現。"],
      ["data ownership", "user/project/workflow/credential ownership 清楚", "project roles、account type、offboarding checklist", "credentials 留在個人帳號，無法交接。"],
      ["webhook exposure", "public webhooks 經過 authentication 或 secret path", "random path、shared secret、HMAC、provider signature、rate limit", "webhook 被猜測、濫用或重放。"],
      ["change record", "安全設定有版本紀錄", "<code>.env</code>/compose/proxy config in Git or encrypted change log", "設定漂移後無法復原。"]
    ],
    "week15-hardening-table"
  );

  addPage(
    "Chapter 15 · Section 15.4",
    "交付物二：public exposure hardening checklist I",
    `
      <section class="chapter-section full">
        <div class="section-number">15.4</div>
        <div>
          <h3>ingress、cookie、proxy、owner、user lifecycle、SMTP</h3>
          <p class="section-lead">公開 instance 的 hardening 要把 ingress、identity、secrets、runtime、workflow、operations 放在同一張表，不要只做一個 reverse proxy 就宣稱 production-ready。</p>
          ${hardeningRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.4 continued",
    "交付物二：public exposure hardening checklist II",
    `
      <section class="chapter-section full">
        <div class="section-number">15.4</div>
        <div>
          <h3>invite、2FA、SSO、secrets、env/file access</h3>
          ${hardeningRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.4 continued",
    "交付物二：public exposure hardening checklist III",
    `
      <section class="chapter-section full">
        <div class="section-number">15.4</div>
        <div>
          <h3>SSRF、public API、risky nodes、community nodes、audit、execution data</h3>
          ${hardeningRowsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.4 continued",
    "交付物二：public exposure hardening checklist IV",
    `
      <section class="chapter-section full">
        <div class="section-number">15.4</div>
        <div>
          <h3>backup、patch cadence、monitoring、ownership、webhook、change record</h3>
          ${hardeningRowsD}
          <div class="week15-hardening-map">
            <div>Ingress</div>
            <div>Identity</div>
            <div>Secrets</div>
            <div>Runtime</div>
            <div>Data</div>
            <div>Operations</div>
          </div>
        </div>
      </section>
    `
  );

  const principleRows = renderReportTable(
    ["序號", "原則"],
    [
      ["1", "每週檢查 n8n release notes、Docker image、OS packages、reverse proxy、database、PaaS/hyperscaler runtime。"],
      ["2", "每月至少完成一次 n8n stable update 或明確記錄為何不更新。"],
      ["3", "security-related release、authentication、SSRF、API、webhook、credentials、community nodes、risky nodes、sandbox、dependency CVE 相關修補，不能等到功能更新窗口。"],
      ["4", "critical public exposure 風險在 24 到 48 小時內處理；high 風險 7 天內處理；routine stable update 30 天內處理。"],
      ["5", "每次更新都走 Week 14 流程：backup、restore drill、image pinning、pull、restart、test、rollback。"]
    ],
    "week15-principle-table"
  );

  addPage(
    "Chapter 15 · Section 15.5",
    "交付物三：patch cadence policy 原則",
    `
      <section class="chapter-section full">
        <div class="section-number">15.5</div>
        <div>
          <h3>2026-05-28 起的 aggressively update 原則</h3>
          ${principleRows}
          <div class="tip-callout">
            <strong>安全邊界句</strong>
            <p>公開 instance 不更新就是安全邊界破洞，升級不是只有新功能。更新也包含 bug fixes、security hardening、dependency fixes、permission model changes、SSRF/identity/API/node safety improvements。</p>
          </div>
        </div>
      </section>
    `
  );

  const cadenceRows = renderReportTable(
    ["風險級別", "例子", "SLA", "必要動作"],
    [
      ["Critical", "public auth bypass、RCE、SSRF to cloud metadata、credential leakage、actively exploited CVE", "24 到 48 小時", "緊急 maintenance window、backup、restore drill、patch、smoke test、監控、事後紀錄。"],
      ["High", "webhook/API/security hardening bug、dependency security fix、risky node sandbox fix、cookie/session fix", "7 天內", "staging 或 restore drill project 測試，production 更新，security audit。"],
      ["Medium", "minor security improvement、new policy setting、community package supply-chain improvement", "14 天內", "排入本週或下週更新批次，確認設定是否需要變更。"],
      ["Routine", "feature release、bug fixes、performance fixes", "30 天內", "至少每月更新，避免跨太多版本造成 disruptive update。"],
      ["Deferred", "與部署無關或明確有重大相容性風險", "每週重新評估", "記錄 deferred reason、owner、next review date、mitigation。"]
    ],
    "week15-cadence-table"
  );

  addPage(
    "Chapter 15 · Section 15.5 continued",
    "Patch cadence SLA table",
    `
      <section class="chapter-section full">
        <div class="section-number">15.5</div>
        <div>
          <h3>cadence table</h3>
          ${cadenceRows}
          <div class="week15-patch-flow">
            <div><span>Monday</span><strong>release/security triage</strong></div>
            <div><span>Critical</span><strong>24-48h</strong></div>
            <div><span>High</span><strong>7 days</strong></div>
            <div><span>Routine</span><strong>30 days</strong></div>
            <div><span>Gate</span><strong>Week 14 backup + restore drill</strong></div>
            <div><span>Close</span><strong>smoke test + record</strong></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.5 continued",
    "Public instance security boundary",
    `
      <section class="chapter-section">
        <div class="section-number">15.5</div>
        <div>
          <h3>public instance security boundary</h3>
          <p>公開 instance 不更新就是安全邊界破洞，升級不是只有新功能。原因是 public n8n 同時暴露 editor login、webhooks、API、OAuth callbacks、execution data、credentials usage、nodes that call external systems、possibly community code。</p>
          <p>更新不只帶來新節點或 UI 改善，也會包含 bug fixes、security hardening、dependency fixes、permission model changes、SSRF/identity/API/node safety improvements。越久不更新，公開邊界與現行威脅之間的距離越大。</p>
          <div class="week15-boundary-stack">
            <div>editor login</div>
            <div>webhooks</div>
            <div>API</div>
            <div>OAuth callbacks</div>
            <div>execution data</div>
            <div>credentials usage</div>
            <div>external calls</div>
            <div>community code</div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.6",
    "Cloud / local / tunnel 責任分界",
    `
      <section class="chapter-section">
        <div class="section-number">15.6</div>
        <div>
          <h3>Cloud</h3>
          <p>n8n Cloud 替你收掉 infrastructure maintenance、uptime monitoring、managed OAuth、one-click upgrades 等基礎工作。你仍要管理 users、2FA/SSO、workflow sharing、credentials、execution data、release timing、workflow security。Cloud 讓責任少很多，但不會替你判斷某個 workflow 是否把 customer data 發錯 API，也不會替你完成每個 user offboarding 決策。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">15.6</div>
        <div>
          <h3>local</h3>
          <p>local n8n 的 public exposure 最小，但資料和 secrets 都在本機。你要保護 Docker Desktop、volume、<code>.env</code>、<code>N8N_ENCRYPTION_KEY</code>、local credentials、backup。local 適合 learning、prototype、private automation，不適合作為未 harden 的公開服務。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">15.6</div>
        <div>
          <h3>tunnel</h3>
          <p>tunnel 只適合 local development/testing。它能快速讓 webhook provider 打到本機，但它不是 production boundary。若 tunnel URL 被外部知道，你仍承擔 n8n login、webhook path、credentials、workflow behavior、版本更新與關閉 tunnel 的責任。</p>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.6 continued",
    "VPS / PaaS / hyperscaler 責任分界",
    `
      <section class="chapter-section">
        <div class="section-number">15.6</div>
        <div>
          <h3>VPS</h3>
          <p>VPS 是最直覺的 self-host production 起點，也是責任最容易被低估的地方。OS patch、firewall、Docker、Caddy、PostgreSQL、n8n image、volume、backup、logs、users、2FA、SMTP、SSRF、API、nodes 都要自己管。這也是為什麼 Week 10 到 Week 15 一路要求 Caddy、PostgreSQL、backup、restore、update、hardening 連成一套。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">15.6</div>
        <div>
          <h3>PaaS</h3>
          <p>PaaS 會替你處理 deploy、TLS、custom domain、logs、secrets UI、managed database 的一部分，但 n8n state、environment variables、backup/restore、user management、2FA/SSO、image tag、patch cadence 還是你的工作。PaaS 省掉一些主機維運，不會自動讓公開 instance 安全。</p>
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">15.6</div>
        <div>
          <h3>hyperscaler</h3>
          <p>hyperscaler 給你 IAM、service account、Secret Manager/Secrets Manager、managed database、load balancer、CloudWatch/Cloud Logging、VPC/security group 等 building blocks。它讓安全治理更可控，也讓錯誤配置更危險。你的責任變成 least privilege、secret scope、network boundaries、image pinning、audit logs、cost guardrails、patch cadence、incident response。</p>
        </div>
      </section>
    `
  );

  const runbookRowsA = renderReportTable(
    ["步驟", "公開 instance hardening runbook"],
    [
      ["1", "確認 hosting model：Cloud、local、tunnel、VPS、PaaS、hyperscaler。"],
      ["2", "若是 tunnel，標記為 development/testing，不進 production checklist。"],
      ["3", "設 HTTPS-only：<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROXY_HOPS</code>、proxy TLS、secure redirect。"],
      ["4", "設 cookies：<code>N8N_SECURE_COOKIE=true</code>，<code>N8N_SAMESITE_COOKIE=lax</code> 或更嚴格。"],
      ["5", "設 user management：Owner/Admin/Member 最小權限，owner 日常使用 member account。"],
      ["6", "設 SMTP：<code>N8N_EMAIL_MODE=smtp</code>、<code>N8N_SMTP_HOST</code>、<code>N8N_SMTP_SENDER</code>、SSL/STARTTLS。"],
      ["7", "設 invite 安全：<code>N8N_INVITE_LINKS_EMAIL_ONLY=true</code>。"],
      ["8", "設 MFA：<code>N8N_MFA_ENABLED=true</code>，可用 policy 時啟用 <code>N8N_MFA_ENFORCED_ENABLED=true</code>。"],
      ["9", "有企業 IdP 時設定 SAML/OIDC SSO，並記錄 role provisioning 與手動登入例外。"],
      ["10", "設 secrets：固定 <code>N8N_ENCRYPTION_KEY</code>，優先用 secret manager 或 external secrets，不把 secrets 寫進 workflow text。"]
    ],
    "week15-runbook-table"
  );

  const runbookRowsB = renderReportTable(
    ["步驟", "公開 instance hardening runbook"],
    [
      ["11", "限制 env/file access：<code>N8N_BLOCK_ENV_ACCESS_IN_NODE=true</code>、<code>N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES=true</code>、<code>N8N_RESTRICT_FILE_ACCESS_TO</code>。"],
      ["12", "啟用 SSRF protection：<code>N8N_SSRF_PROTECTION_ENABLED=true</code>，使用 default blocked ranges，再加上組織內網範圍。"],
      ["13", "若不用 public REST API，設定 <code>N8N_PUBLIC_API_DISABLED=true</code> 與 <code>N8N_PUBLIC_API_SWAGGERUI_DISABLED=true</code>。"],
      ["14", "封鎖 risky nodes：用 <code>NODES_EXCLUDE</code> 管理 <code>executeCommand</code>、local file 類 nodes 與任何不信任的自訂高風險 node。"],
      ["15", "控制 community nodes：不需要時停用；需要時只允許 verified 或固定版本與 checksum。"],
      ["16", "設 execution data policy：敏感資料 redaction、成功 executions retention、manual execution discipline。"],
      ["17", "跑 security audit：<code>n8n audit</code>，把 credentials、database、filesystem、nodes、instance findings 轉成 action items。"],
      ["18", "接上 Week 14：backup、restore drill、image pinning、smoke test、rollback。"],
      ["19", "接上 monitoring：HTTP 5xx、login anomalies、failed executions、restart count、audit findings、outdated version。"],
      ["20", "接上 patch cadence：每週 triage，每月 update，critical/high security 依 SLA 處理。"]
    ],
    "week15-runbook-table"
  );

  addPage(
    "Chapter 15 · Section 15.7",
    "公開 instance hardening runbook I",
    `
      <section class="chapter-section full">
        <div class="section-number">15.7</div>
        <div>
          <h3>步驟 1-10：入口、身份、SMTP、MFA、secrets</h3>
          ${runbookRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.7 continued",
    "公開 instance hardening runbook II",
    `
      <section class="chapter-section full">
        <div class="section-number">15.7</div>
        <div>
          <h3>步驟 11-20：runtime、audit、backup、monitoring、patch</h3>
          ${runbookRowsB}
        </div>
      </section>
    `
  );

  const weeklyTriageRows = renderReportTable(
    ["項目", "證據"],
    [
      ["n8n release notes", "目標版本、目前版本、跳過版本、breaking changes、security relevance。"],
      ["Docker image", "pinned tag、digest、是否有 base image 或 dependency risk。"],
      ["OS/packages", "VPS host patch、Docker Engine/Compose、Caddy、PostgreSQL patch。"],
      ["platform", "PaaS/hyperscaler runtime、managed database、secret manager、load balancer updates。"],
      ["audit", "<code>n8n audit</code> findings，尤其 outdated instance、missing security settings、risky nodes。"]
    ],
    "week15-triage-table"
  );

  addPage(
    "Chapter 15 · Section 15.8",
    "2026 之後 aggressively update 實務節奏 I",
    `
      <section class="chapter-section full">
        <div class="section-number">15.8</div>
        <div>
          <h3>weekly triage</h3>
          <p class="section-lead">每週固定一天檢查 release notes、image、host packages、platform runtime 與 audit findings。這不是形式作業，而是讓 public edge 不落後於安全修補。</p>
          ${weeklyTriageRows}
        </div>
      </section>
      <section class="chapter-section">
        <div class="section-number">15.8</div>
        <div>
          <h3>monthly minimum</h3>
          <p>若沒有 critical/high security update，公開 instance 仍要每月至少更新一次或記錄延後理由。官方 self-host update guidance 建議至少每月更新，因為跨太多版本會提高 disruptive update 風險。對 public instance，月更是最低線，不是最佳線。</p>
        </div>
      </section>
    `
  );

  const emergencyRows = renderReportTable(
    ["步驟", "emergency patch 動作"],
    [
      ["1", "宣告 change window。"],
      ["2", "執行 Week 14 backup。"],
      ["3", "在 restore drill/staging project 測 target image。"],
      ["4", "更新 production pinned image。"],
      ["5", "跑 smoke tests：login、credentials decrypt、workflow list、manual execution、webhook、proxy、logs、monitoring。"],
      ["6", "若失敗，先 rollback；若 DB migration 已不可逆，走 full restore。"],
      ["7", "記錄版本、digest、backup id、測試結果、SLA 是否達成。"]
    ],
    "week15-emergency-table"
  );

  addPage(
    "Chapter 15 · Section 15.8 continued",
    "2026 之後 aggressively update 實務節奏 II",
    `
      <section class="chapter-section full">
        <div class="section-number">15.8</div>
        <div>
          <h3>emergency patch</h3>
          <p class="section-lead">若 release note、security advisory、dependency CVE、node sandbox、auth/session、SSRF、API、webhook、credential handling 相關修補出現，直接啟動 emergency patch。</p>
          ${emergencyRows}
          <div class="tip-callout">
            <strong>更新門檻</strong>
            <p>emergency patch 仍然要經過 Week 14 的 recovery gate。快，不等於跳過 backup；快，是把 backup、restore drill、smoke test、rollback 做成固定肌肉記憶。</p>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 security responsibility matrix", "通過", "第 15.3、15.6 節與 <code>week-15-security-responsibility-matrix.json</code>"],
      ["完成 public exposure hardening checklist", "通過", "第 15.4、15.7 節與 <code>week-15-public-exposure-hardening-checklist.csv</code>"],
      ["完成 patch cadence policy", "通過", "第 15.5、15.8 節與 <code>week-15-patch-cadence-policy.json</code>"],
      ["覆蓋 Cloud/local/tunnel/VPS/PaaS/hyperscaler 責任分界", "通過", "第 15.3、15.6 節"],
      ["覆蓋 HTTPS-only、secure cookies、SMTP/user management、2FA、SSO、secrets", "通過", "第 15.4、15.7 節"],
      ["覆蓋 2026 之後 public instance 的 aggressively update 原則", "通過", "第 15.5、15.8 節"],
      ["能明確說出公開 instance 不更新就是安全邊界破洞，升級不是只有新功能", "通過", "第 15.1、15.5、15.9 節"]
    ],
    "week15-completion-table"
  );

  addPage(
    "Chapter 15 · Section 15.9",
    "Week 15 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">15.9</div>
        <div>
          <h3>Week 15 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 15 · Section 15.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">15.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 16 會進入 Scaling：單機、Redis queue、workers。Week 15 已定義公開 instance 的安全與 patch cadence，下一週要在這條安全基線上拆解 scaling：regular mode、Redis queue、workers、concurrency、webhook response、DB connections、worker separation 與 queue-mode security boundaries。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 15 的成果，是把 public n8n 的安全責任具體化：平台選型只決定誰負責哪一層，不能消除 user lifecycle、secrets、SSRF、risky nodes、audit、backup、monitoring 與 patch cadence。公開 instance 不更新，就是安全邊界停在舊世界。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekSixteenChapter(week, startIndex) {
  const source = "docs/week-16-scaling-single-queue-workers.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["scaling ladder", "完成", "<code>artifacts/week-16-scaling/week-16-scaling-ladder.json</code>；本章 16.3"],
      ["queue mode architecture diagram", "完成", "<code>artifacts/week-16-scaling/week-16-queue-mode-architecture.json</code>；本章 16.4"],
      ["anti-overengineering checklist", "完成", "<code>artifacts/week-16-scaling/week-16-anti-overengineering-checklist.csv</code>；本章 16.5"],
      ["single instance first", "完成", "本章 16.3、16.6"],
      ["PostgreSQL first", "完成", "本章 16.3、16.6"],
      ["Redis queue mode 與 workers", "完成", "本章 16.4、16.7"],
      ["separate webhook processors、managed DB/Redis、centralized logs", "完成", "本章 16.4、16.7、16.8"],
      ["Week 16 驗證腳本", "完成", "<code>scripts/verify-week-sixteen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 16 · Week 16",
    "Scaling：單機、Redis queue、workers",
    `
      <div class="chapter-summary">
        <div class="week-icon">SCALE</div>
        <div>
          <p class="kicker">16.0 本週定位</p>
          <p>執行日期：2026-05-28。本週目標是回答何時該加大單機，何時該上 queue mode，何時才值得 Kubernetes。Week 15 的結論是公開 instance 的安全邊界要靠 hardening 與 patch cadence 維持；Week 16 把 scaling 放在這條安全基線上處理。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">16.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week16-flow">
        <div>single container</div><span>→</span>
        <div>single + PostgreSQL</div><span>→</span>
        <div>bigger instance + concurrency limit</div><span>→</span>
        <div>Redis queue + workers</div><span>→</span>
        <div>Kubernetes only when justified</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>Scaling 不是「一看到慢就拆服務」。先讓單機和 PostgreSQL 正確，再看 concurrency、execution data、binary data、logs、backup、worker pool。Kubernetes 是成熟後的承載方式，不是最小 production 起點。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-16"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Scaling overview", "<a href=\"https://docs.n8n.io/hosting/scaling/overview/\">Scaling overview</a>", "n8n 官方說大量 users、workflows、executions 時需要調整配置；queue mode 提供最佳 scalability，execution data/pruning 也影響 database performance。"],
      ["Queue mode", "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>", "queue mode 使用 main instance、Redis message broker、workers、PostgreSQL；main 產生 execution，Redis 排隊，worker 從 DB 取 workflow information，完成後寫回 DB 並通知 Redis。"],
      ["Queue mode env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/queue-mode/\">Queue mode env vars</a>", "<code>EXECUTIONS_MODE=queue</code>、<code>QUEUE_BULL_REDIS_HOST</code>、<code>QUEUE_BULL_REDIS_PORT</code>、<code>OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS</code>、<code>N8N_MULTI_MAIN_SETUP_ENABLED</code> 等設定決定 queue mode 行為。"],
      ["Concurrency control", "<a href=\"https://docs.n8n.io/hosting/scaling/concurrency-control/\">Concurrency control</a>", "regular mode 預設不限制 production executions；可用 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code> 控制 production concurrency；queue mode 的 worker concurrency 是另一層機制。"]
    ],
    "week16-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Execution data", "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>", "execution data 保存與 pruning 會影響 database size/performance；scale 前應先確認是否保存太多成功 execution data。"],
      ["Binary data", "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data</a>", "binary data 預設在 memory；queue mode 不支援 filesystem binary data，需改 database 或 S3 external storage。"],
      ["External storage", "<a href=\"https://docs.n8n.io/hosting/scaling/external-storage/\">External storage</a>", "Enterprise 可用 S3 作為 binary data external storage，避免大量 binary data 依賴 local filesystem。"],
      ["Prometheus metrics", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/prometheus/\">Prometheus metrics</a>", "<code>N8N_METRICS=true</code> 可啟用 metrics；queue metrics 可追蹤 active、completed、failed、waiting jobs，main 與 workers 都可暴露 metrics。"]
    ],
    "week16-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Monitoring", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/monitoring/\">Monitoring</a>", "production scaling 要看 health、metrics、queue、worker 與 process 指標，而不是只看容器是否 running。"],
      ["Logging", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/logging/\">Logging</a>", "多 process/multi-worker deployment 需要 centralized logs；只有本機 stdout 會讓 worker 問題難以追蹤。"],
      ["Task runners", "<a href=\"https://docs.n8n.io/hosting/configuration/task-runners/\">Task runners</a>", "production task runners 建議 external mode；queue mode 下每個 worker 需要自己的 task runner sidecar。"],
      ["Execute Command", "<a href=\"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executecommand/\">Execute Command</a>", "queue mode 下 production Execute Command 會在執行任務的 worker 上跑；manual execution 除非 offload，否則在 main 上跑。"],
      ["Kubernetes/OpenShift example", "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/openshift-crc/\">OpenShift example</a>", "n8n 的 OpenShift/Kubernetes 範例使用 shared database、message queue、object storage、worker pods、webhook processors、multi-main；這證明 Kubernetes 是多組件成熟後的承載方式，不是最小 production 起點。"]
    ],
    "week16-source-table"
  );

  addPage(
    "Chapter 16 · Section 16.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">16.2</div>
        <div>
          <h3>scaling、queue mode、env vars、concurrency</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">16.2</div>
        <div>
          <h3>execution data、binary data、external storage、metrics</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">16.2</div>
        <div>
          <h3>monitoring、logging、task runners、Execute Command、Kubernetes example</h3>
          ${sourceRowsC}
          <div class="note-band">
            <strong>本週採用判斷</strong>
            <p>先 single instance first，再 PostgreSQL first，然後用 metrics 判斷是否加大單機、設定 regular concurrency、清 execution data、移 binary data；只有當 worker separation 和 queue backlog 是真瓶頸，才進 Redis queue mode 與 workers。</p>
          </div>
        </div>
      </section>
    `
  );

  const ladderRowsA = renderReportTable(
    ["階段", "架構", "進入條件", "主要設定", "不要跳過的檢查"],
    [
      ["0", "local / learning single container", "學習、demo、低風險 manual workflow", "SQLite 或 local volume，沒有 public production webhook", "不放 business-critical credentials，不公開 tunnel 當 production。"],
      ["1", "single container + PostgreSQL", "workflow 開始承載真資料，需要 durable state", "<code>DB_TYPE=postgresdb</code>、固定 <code>N8N_ENCRYPTION_KEY</code>、backup/restore", "PostgreSQL backup、volume、env/proxy config 保存。"],
      ["2", "larger single instance + PostgreSQL", "CPU/memory 偶爾尖峰，但瓶頸仍可由單機處理", "4 vCPU / 8 GB RAM 起，<code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code>，execution pruning", "p95 latency、memory high-water mark、DB growth、binary storage。"],
      ["3", "single instance + managed PostgreSQL/Redis-ready observability", "workload 穩定成長，需要先把 state/monitoring 做穩", "managed PostgreSQL、centralized logs、Prometheus metrics、alerts", "先證明 DB/backup/logs 可營運，再加 workers。"]
    ],
    "week16-ladder-table"
  );

  const ladderRowsB = renderReportTable(
    ["階段", "架構", "進入條件", "主要設定", "不要跳過的檢查"],
    [
      ["4", "Redis queue mode + workers", "production executions 重疊且單機 event loop 或 webhook response 被重任務拖慢", "<code>EXECUTIONS_MODE=queue</code>、Redis、workers、shared <code>N8N_ENCRYPTION_KEY</code>、worker <code>--concurrency</code>", "Redis/DB readiness、worker health、DB connection pool、binary data mode。"],
      ["5", "separate webhook processors + worker pools", "webhook burst 是入口瓶頸，需要獨立接收 webhook", "webhook processors、load balancer route <code>/webhook/*</code> 與 <code>/webhook-waiting/*</code>，<code>N8N_DISABLE_PRODUCTION_MAIN_PROCESS=true</code>", "main 不進 webhook LB pool，manual <code>/webhook-test/*</code> route 回 main。"],
      ["6", "managed DB/Redis + centralized logs + multi-main evaluation", "queue mode 已是核心生產架構，需要 HA 與操作治理", "managed PostgreSQL、managed Redis、centralized logs、metrics、backups、multi-main eligibility", "all main/worker same version、sticky sessions、leader/follower 行為、cost。"],
      ["7", "Kubernetes / OpenShift / EKS style orchestration", "需要 pod scheduling、replicas、rolling deploy、worker autoscaling、standard platform ops", "main pods、worker pods、webhook processor pods、DB/Redis/object storage、Ingress/LB、secrets、logs", "沒有 platform skill、DB/Redis/logs/backup 成熟前，不進 Kubernetes。"]
    ],
    "week16-ladder-table"
  );

  addPage(
    "Chapter 16 · Section 16.3",
    "交付物一：scaling ladder I",
    `
      <section class="chapter-section full">
        <div class="section-number">16.3</div>
        <div>
          <h3>Stage 0-3：先把單機、PostgreSQL、觀測做穩</h3>
          ${ladderRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.3 continued",
    "交付物一：scaling ladder II",
    `
      <section class="chapter-section full">
        <div class="section-number">16.3</div>
        <div>
          <h3>Stage 4-7：queue、webhook processors、managed state、Kubernetes</h3>
          ${ladderRowsB}
          <div class="week16-ladder-map">
            <div><span>0</span><strong>learning</strong></div>
            <div><span>1</span><strong>PostgreSQL</strong></div>
            <div><span>2</span><strong>scale up</strong></div>
            <div><span>3</span><strong>observe</strong></div>
            <div><span>4</span><strong>queue</strong></div>
            <div><span>5</span><strong>webhook split</strong></div>
            <div><span>6</span><strong>managed ops</strong></div>
            <div><span>7</span><strong>Kubernetes</strong></div>
          </div>
        </div>
      </section>
    `
  );

  const acceptanceRoute = renderReportTable(
    ["序號", "驗收路線"],
    [
      ["1", "<code>single container + Postgres</code>：n8n + PostgreSQL + persistent volume + fixed <code>N8N_ENCRYPTION_KEY</code> + backup。"],
      ["2", "<code>larger single instance + Postgres</code>：先加 CPU/RAM、設定 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code>、修 pruning 與 binary data。"],
      ["3", "<code>observability first</code>：啟用 logs/metrics，確認 p95 latency、memory、DB connections、execution failures、binary storage。"],
      ["4", "<code>Redis queue mode + workers</code>：加 Redis，把 production executions 丟給 workers，main 保持 UI/triggers/webhook coordination。"],
      ["5", "<code>separate webhook processors</code>：入口流量高時再把 webhook processors 與 load balancer routing 拆出來。"],
      ["6", "<code>managed DB/Redis + centralized logs</code>：把 state、queue、logs、backup 變成可營運服務。"],
      ["7", "<code>Kubernetes</code>：只有當你需要 replicas、rolling updates、worker autoscaling、pod scheduling、multi-service platform governance 時才進。"]
    ],
    "week16-route-table"
  );

  addPage(
    "Chapter 16 · Section 16.3 continued",
    "驗收路線",
    `
      <section class="chapter-section full">
        <div class="section-number">16.3</div>
        <div>
          <h3>從 single container + Postgres 到 Redis workers</h3>
          ${acceptanceRoute}
          <div class="tip-callout">
            <strong>視覺化總結</strong>
            <p>合理路線是先把 durable state、recovery、observability 做好，再讓 queue mode 接手 execution 壓力。Kubernetes 不是為了顯得正式，而是為了解決已被證明存在的 orchestration 問題。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.4",
    "交付物二：queue mode architecture diagram",
    `
      <section class="chapter-section full">
        <div class="section-number">16.4</div>
        <div>
          <h3>Queue mode 架構圖</h3>
          <div class="week16-queue-arch">
            <div class="ui">Users / editor<br><span>UI · API · triggers</span></div>
            <div class="webhook">Webhook providers<br><span>public ingress</span></div>
            <div class="main">main n8n process<br><span>execution creation</span></div>
            <div class="lb">load balancer<br><span>route webhooks</span></div>
            <div class="processor">webhook processor pool<br><span>optional ingress scale</span></div>
            <div class="redis">Redis<br><span>queue / message broker</span></div>
            <div class="worker">workers<br><span>n8n worker --concurrency=5</span></div>
            <div class="pg">PostgreSQL<br><span>workflows · credentials · executions</span></div>
            <div class="storage">S3/database binary storage<br><span>queue-compatible</span></div>
            <div class="logs">centralized logs + metrics<br><span>main · workers · Redis · DB · LB</span></div>
          </div>
        </div>
      </section>
    `
  );

  const processRowsA = renderReportTable(
    ["Process", "責任", "關鍵設定"],
    [
      ["main", "UI、API、trigger coordination、execution creation、non-HTTP triggers、pruning；queue mode 時不直接跑 production execution。", "<code>EXECUTIONS_MODE=queue</code>、<code>N8N_ENCRYPTION_KEY</code>、PostgreSQL env vars、Redis env vars。"],
      ["Redis", "message broker，保存 pending executions queue，讓可用 worker 取 job。", "<code>QUEUE_BULL_REDIS_HOST</code>、<code>QUEUE_BULL_REDIS_PORT</code>、username/password/db/timeout。"],
      ["worker", "從 Redis 取 execution ID，從 PostgreSQL 讀 workflow information，執行後寫結果回 PostgreSQL，通知 Redis。", "<code>EXECUTIONS_MODE=queue</code>、shared <code>N8N_ENCRYPTION_KEY</code>、DB/Redis access、<code>n8n worker --concurrency=5</code> 起測。"],
      ["webhook processor", "optional scaling layer，接大量 webhook request，送 execution 到 Redis；不把 main 放進 webhook pool。", "<code>EXECUTIONS_MODE=queue</code>、<code>WEBHOOK_URL</code>、load balancer route <code>/webhook/*</code>、<code>/webhook-waiting/*</code>。"]
    ],
    "week16-process-table"
  );

  const processRowsB = renderReportTable(
    ["Process", "責任", "關鍵設定"],
    [
      ["PostgreSQL", "durable state：workflows、credentials、executions、users、settings。", "Postgres 13+、connection pool、backup/restore、execution pruning。"],
      ["binary storage", "queue mode 不使用 filesystem binary data；改 database 或 S3 external storage。", "<code>N8N_DEFAULT_BINARY_DATA_MODE=database</code> 或 <code>s3</code>；S3 lifecycle。"],
      ["centralized logs/metrics", "對 main、webhook processors、workers、Redis、DB 進行 observability。", "<code>N8N_METRICS=true</code>、<code>N8N_METRICS_INCLUDE_QUEUE_METRICS=true</code>、集中 logs、alerts。"]
    ],
    "week16-process-table"
  );

  addPage(
    "Chapter 16 · Section 16.4 continued",
    "process responsibility I",
    `
      <section class="chapter-section full">
        <div class="section-number">16.4</div>
        <div>
          <h3>main、Redis、worker、webhook processor</h3>
          ${processRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.4 continued",
    "process responsibility II",
    `
      <section class="chapter-section full">
        <div class="section-number">16.4</div>
        <div>
          <h3>PostgreSQL、binary storage、logs/metrics</h3>
          ${processRowsB}
        </div>
      </section>
    `
  );

  const sequenceRows = renderReportTable(
    ["順序", "動作"],
    [
      ["1", "Main 在 PostgreSQL 建立 execution record。"],
      ["2", "Main 把 execution ID enqueue 到 Redis。"],
      ["3", "Worker 從 Redis claim next job。"],
      ["4", "Worker 從 PostgreSQL 載入 workflow and credentials metadata。"],
      ["5", "Worker 執行 workflow。"],
      ["6", "Worker 把 result and status 寫回 PostgreSQL。"],
      ["7", "Worker 在 Redis publish completion。"],
      ["8", "Redis 通知 Main completion。"],
      ["9", "Main 與 Worker 都把 logs/metrics 暴露給 centralized observability。"]
    ],
    "week16-sequence-table"
  );

  const routeRows = renderReportTable(
    ["Route", "目標"],
    [
      ["<code>/webhook/*</code>", "webhook processor pool"],
      ["<code>/webhook-waiting/*</code>", "webhook processor pool"],
      ["<code>/webhook-test/*</code>", "main process，用於 manual/test executions"],
      ["editor static files、internal API、settings", "main process"]
    ],
    "week16-route-table"
  );

  addPage(
    "Chapter 16 · Section 16.4 continued",
    "queue mode sequence 與 webhook routing",
    `
      <section class="chapter-section full">
        <div class="section-number">16.4</div>
        <div>
          <h3>queue mode sequence</h3>
          ${sequenceRows}
        </div>
      </section>
      <section class="chapter-section full">
        <div class="section-number">16.4</div>
        <div>
          <h3>webhook processor routing</h3>
          ${routeRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.4 continued",
    "webhook processor routing 補充",
    `
      <section class="chapter-section">
        <div class="section-number">16.4</div>
        <div>
          <h3>main 不放進 webhook load balancer pool</h3>
          <p>n8n 官方提醒不建議把 main process 加進 webhook load balancer pool。若 main 同時承接大量 webhook，UI、API、trigger coordination 會被入口流量拖慢。當你已有 webhook processors 時，可以用 <code>N8N_DISABLE_PRODUCTION_MAIN_PROCESS=true</code> 讓 production webhooks 不在 main process 上處理。</p>
          <div class="week16-routing-map">
            <div><span>production webhooks</span><strong>/webhook/*<br>/webhook-waiting/*</strong><em>webhook processor pool</em></div>
            <div><span>manual tests</span><strong>/webhook-test/*</strong><em>main process</em></div>
            <div><span>editor and API</span><strong>static / settings / internal API</strong><em>main process</em></div>
          </div>
        </div>
      </section>
    `
  );

  const antiRowsA = renderReportTable(
    ["問題", "若答案是否定", "若答案是肯定"],
    [
      ["是否已經使用 PostgreSQL，而不是仍在 SQLite/local-only state？", "不上 Redis、不上 Kubernetes，先做 PostgreSQL。", "繼續看 execution volume。"],
      ["是否已做 backup/restore drill？", "不上多節點，先完成 Week 14。", "繼續看 metrics。"],
      ["是否知道 p95 execution latency、active executions、failed executions、DB connections？", "不上 Kubernetes，先啟用 logs/metrics。", "繼續看瓶頸層。"],
      ["問題是 CPU/RAM 偶發尖峰，而不是持續 queue/backlog？", "先加大單機、降 concurrency、修 workflow。", "可評估 workers。"]
    ],
    "week16-anti-table"
  );

  const antiRowsB = renderReportTable(
    ["問題", "若答案是否定", "若答案是肯定"],
    [
      ["是否已設定 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code>？", "先用 regular mode concurrency control。", "看是否仍有 event loop thrash。"],
      ["execution data 或 binary data 是否造成 DB/storage 壓力？", "先調 retention、pruning、binary mode。", "若重任務仍拖慢，再加 workers。"],
      ["webhook burst 是否拖慢 editor/UI？", "不拆 webhook processors，先觀察。", "可拆 webhook processors 與 LB route。"],
      ["是否有 Redis、PostgreSQL、workers 的 health/readiness 與 centralized logs？", "不上 Kubernetes，先補 observability。", "可進 queue mode production。"]
    ],
    "week16-anti-table"
  );

  const antiRowsC = renderReportTable(
    ["問題", "若答案是否定", "若答案是肯定"],
    [
      ["是否已有 managed DB/Redis 或能營運自管 DB/Redis？", "不上 Kubernetes，否則 state/queue 會成為事故點。", "可評估 orchestration。"],
      ["是否需要 rolling deploy、worker autoscaling、pod scheduling、multi-service governance？", "不上 Kubernetes，VPS/PaaS/queue workers 足夠。", "Kubernetes 開始有理由。"],
      ["團隊是否能 debug Redis queue、DB connection pool、worker logs、LB routing？", "不上 Kubernetes，先練 queue mode runbook。", "可建立 Kubernetes spike。"],
      ["是否能接受 Kubernetes 的成本與維運責任？", "不上 Kubernetes，避免把小系統變成平台工程。", "用 staging 先驗證。"]
    ],
    "week16-anti-table"
  );

  addPage(
    "Chapter 16 · Section 16.5",
    "交付物三：anti-overengineering checklist I",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>state、recovery、observability、single instance</h3>
          ${antiRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.5 continued",
    "交付物三：anti-overengineering checklist II",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>regular mode、data policy、webhook burst、readiness</h3>
          ${antiRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.5 continued",
    "交付物三：anti-overengineering checklist III",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>managed state、Kubernetes need、team skill、cost</h3>
          ${antiRowsC}
          <div class="week16-anti-gate">
            <div><span>DB?</span><strong>PostgreSQL first</strong></div>
            <div><span>Recovery?</span><strong>Week 14 first</strong></div>
            <div><span>Metrics?</span><strong>observe first</strong></div>
            <div><span>Queue?</span><strong>worker need proven</strong></div>
            <div><span>K8s?</span><strong>platform need proven</strong></div>
          </div>
        </div>
      </section>
    `
  );

  const csvRowsA = renderReportTable(
    ["category", "question", "evidence_required", "decision"],
    [
      ["state", "Are workflows and credentials already on PostgreSQL instead of SQLite?", "<code>DB_TYPE=postgresdb</code> and restore drill evidence", "PostgreSQL first"],
      ["recovery", "Has Week 14 backup and restore drill passed?", "Backup ID and restore drill result", "Recovery before scale"],
      ["observability", "Do you know p95 latency, failed executions, active executions, memory, CPU, DB storage, and DB connections?", "Dashboard or metric export", "Observe before scale"],
      ["regular_mode", "Have you tried <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code> in regular mode?", "Configured limit and execution queue behavior", "Tune single instance first"],
      ["single_instance", "Is pressure only occasional CPU or memory spike?", "CPU and memory trend", "Scale up before scale out"]
    ],
    "week16-csv-table"
  );

  const csvRowsB = renderReportTable(
    ["category", "question", "evidence_required", "decision"],
    [
      ["execution_data", "Is database growth caused by execution data retention?", "Execution data settings and DB growth chart", "Fix data policy first"],
      ["binary_data", "Is binary data mode queue-compatible?", "<code>N8N_DEFAULT_BINARY_DATA_MODE</code> value", "Binary mode before workers"],
      ["webhook_latency", "Are heavy executions slowing webhook response or editor/API responsiveness?", "Webhook p95 and editor/API latency", "Separate only real bottlenecks"],
      ["redis_readiness", "Can Redis be monitored, backed up when relevant, patched, and secured?", "Redis health, auth, metrics, alerting", "Redis readiness"],
      ["db_connections", "Can PostgreSQL handle worker concurrency and connection count?", "DB connection pool and max connections", "DB capacity gates workers"]
    ],
    "week16-csv-table"
  );

  const csvRowsC = renderReportTable(
    ["category", "question", "evidence_required", "decision"],
    [
      ["worker_logs", "Will worker logs and metrics be centralized?", "Central log sink and worker metrics", "Logs before distributed execution"],
      ["webhook_processors", "Is webhook ingress volume the bottleneck after queue mode?", "Route map and webhook p95", "Ingress split only when needed"],
      ["load_balancer", "Can load balancer route <code>/webhook/*</code>, <code>/webhook-waiting/*</code>, and <code>/webhook-test/*</code> correctly?", "LB route tests", "Route correctness"],
      ["managed_state", "Are DB and Redis managed or operated with mature runbooks?", "Managed service configs or runbooks", "State operations first"],
      ["centralized_logs", "Are main, webhook processors, workers, Redis, DB, and LB logs centralized?", "Log source list and alert rules", "Central logs before Kubernetes"]
    ],
    "week16-csv-table"
  );

  const csvRowsD = renderReportTable(
    ["category", "question", "evidence_required", "decision"],
    [
      ["team_skill", "Can the team debug Redis queue, worker backlog, DB pool exhaustion, and LB routing?", "Runbook exercise results", "Skill before platform"],
      ["kubernetes_need", "Do you need rolling deploys, pod scheduling, worker autoscaling, and platform governance?", "Written platform requirement", "Kubernetes last"],
      ["cost", "Can the team explain the cost and on-call burden of Kubernetes?", "Cost estimate and on-call owner", "Cost is part of architecture"],
      ["security", "Does scaling preserve Week 15 hardening and patch cadence?", "Hardening checklist and patch policy", "Security boundary travels with scale"],
      ["acceptance", "Can you describe a path from single container + Postgres to Redis workers without starting with Kubernetes?", "Documented ladder and runbook", "Gradual route accepted"]
    ],
    "week16-csv-table"
  );

  addPage(
    "Chapter 16 · Section 16.5 continued",
    "CSV checklist 全文 I",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>state、recovery、observability、regular mode、single instance</h3>
          ${csvRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.5 continued",
    "CSV checklist 全文 II",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>execution data、binary data、webhook latency、Redis、DB connections</h3>
          ${csvRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.5 continued",
    "CSV checklist 全文 III",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>worker logs、webhook processors、load balancer、managed state、central logs</h3>
          ${csvRowsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.5 continued",
    "CSV checklist 全文 IV",
    `
      <section class="chapter-section full">
        <div class="section-number">16.5</div>
        <div>
          <h3>team skill、Kubernetes need、cost、security、acceptance</h3>
          ${csvRowsD}
        </div>
      </section>
    `
  );

  const singleFirstRows = renderReportTable(
    ["問題", "應先處理"],
    [
      ["workflow 保存太多 execution data", "execution data pruning、成功 execution 不保存、DB storage monitoring。"],
      ["binary data 讓 memory 爆掉", "filesystem/database/S3 mode，限制檔案大小，避免 default memory mode。"],
      ["webhook response 慢", "workflow 拆分、早回應、concurrency limit、background processing。"],
      ["DB 未備份", "PostgreSQL backup、restore drill、RPO/RTO。"],
      ["logs 看不到", "centralized logs、metrics、alerts。"],
      ["公開 instance 太舊", "Week 15 patch cadence。"]
    ],
    "week16-single-table"
  );

  addPage(
    "Chapter 16 · Section 16.6",
    "single instance first",
    `
      <section class="chapter-section full">
        <div class="section-number">16.6</div>
        <div>
          <h3>先把最少 moving parts 做對</h3>
          <p class="section-lead">single instance first 的意思不是永遠單機，而是先把最少 moving parts 做對。大多數 early production n8n 問題不是 Kubernetes 不夠，而是 state、資料保留、binary data、webhook response、backup、logs 或 patch cadence 還沒有做好。</p>
          ${singleFirstRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.6 continued",
    "PostgreSQL first",
    `
      <section class="chapter-section">
        <div class="section-number">16.6</div>
        <div>
          <h3>PostgreSQL 是 queue mode 前置條件</h3>
          <p>PostgreSQL first 是進 queue mode 的前置條件。官方 queue mode 文件說分散式 queue setup 不支援 SQLite，並建議 Postgres 13+。PostgreSQL 讓 workflows、credentials、executions、users、settings 有 durable state，也讓 workers 可以共享 execution state。若還沒把 database 做穩，就先上 Redis workers，只會把資料層問題放大。</p>
          <div class="week16-postgres-first">
            <div><span>SQLite/local</span><strong>learning state</strong><p>不適合 distributed queue。</p></div>
            <div><span>PostgreSQL</span><strong>shared durable state</strong><p>workers 能共享 execution state。</p></div>
            <div><span>Redis workers</span><strong>distributed execution</strong><p>建立在穩定 DB 之上。</p></div>
          </div>
        </div>
      </section>
    `
  );

  const singleUpgradeRows = renderReportTable(
    ["順序", "單機升級動作"],
    [
      ["1", "固定 <code>N8N_ENCRYPTION_KEY</code>。"],
      ["2", "使用 PostgreSQL。"],
      ["3", "設 <code>WEBHOOK_URL</code> 與 <code>N8N_EDITOR_BASE_URL</code>。"],
      ["4", "設 backup/restore drill。"],
      ["5", "開 logs 與 metrics。"],
      ["6", "調整 execution pruning。"],
      ["7", "設 <code>N8N_CONCURRENCY_PRODUCTION_LIMIT</code>。"],
      ["8", "增加 vCPU/RAM。"],
      ["9", "移除重 workflow 的同步 webhook 路徑。"],
      ["10", "用 metrics 判斷是否真的需要 queue mode。"]
    ],
    "week16-upgrade-table"
  );

  addPage(
    "Chapter 16 · Section 16.6 continued",
    "單機升級順序",
    `
      <section class="chapter-section full">
        <div class="section-number">16.6</div>
        <div>
          <h3>先 scale up，再證明需要 scale out</h3>
          ${singleUpgradeRows}
        </div>
      </section>
    `
  );

  const queueSignals = renderReportTable(
    ["訊號", "解讀"],
    [
      ["production executions 長時間重疊，regular mode concurrency control 造成等待但仍可觀察到 backlog", "需要 worker pool。"],
      ["重 workflow 拖慢 editor/UI 或 webhook response", "需要把 execution 從 main 拆到 workers。"],
      ["CPU/memory 壓力來自 execution，而不是 UI/API", "workers 可以水平擴充。"],
      ["已有 PostgreSQL、Redis、centralized logs、backup/restore", "queue mode 的 state/queue/logs 基礎已具備。"],
      ["binary data 已改 database/S3，不依賴 local filesystem mode", "符合 queue mode binary data 限制。"]
    ],
    "week16-signal-table"
  );

  addPage(
    "Chapter 16 · Section 16.7",
    "何時該上 queue mode",
    `
      <section class="chapter-section full">
        <div class="section-number">16.7</div>
        <div>
          <h3>Redis queue mode 與 workers 的進場訊號</h3>
          ${queueSignals}
        </div>
      </section>
    `
  );

  const queueBaselineRows = renderReportTable(
    ["設定", "baseline"],
    [
      ["Execution mode", "<code>EXECUTIONS_MODE=queue</code> 用在 main、workers、webhook processors。"],
      ["Redis", "<code>QUEUE_BULL_REDIS_HOST</code>、<code>QUEUE_BULL_REDIS_PORT</code>、username/password/db/timeout。"],
      ["Encryption key", "main、workers、webhook processors 使用同一個 <code>N8N_ENCRYPTION_KEY</code>。"],
      ["Worker command", "<code>n8n worker --concurrency=5</code> 起測，官方建議 worker concurrency 5 或更高，避免低 concurrency + 大量 workers 耗盡 DB connections。"],
      ["Worker health", "啟用 worker health/readiness endpoints，確認 DB/Redis ready。"],
      ["Metrics", "<code>N8N_METRICS=true</code>、<code>N8N_METRICS_INCLUDE_QUEUE_METRICS=true</code>。"],
      ["Binary data", "<code>N8N_DEFAULT_BINARY_DATA_MODE=database</code> 或 S3；不使用 filesystem mode。"],
      ["Task runners", "queue mode 下每個 worker 需要自己的 task runner sidecar。"]
    ],
    "week16-baseline-table"
  );

  addPage(
    "Chapter 16 · Section 16.7 continued",
    "queue mode baseline",
    `
      <section class="chapter-section full">
        <div class="section-number">16.7</div>
        <div>
          <h3>main、workers、webhook processors 的共同 baseline</h3>
          ${queueBaselineRows}
        </div>
      </section>
    `
  );

  const noWorkerRows = renderReportTable(
    ["情境", "更合理的處理"],
    [
      ["只有一兩條慢 workflow", "拆 workflow、優化 API calls、加 timeout/retry、把大檔分批。"],
      ["DB storage 成長太快", "先調 execution retention、pruning、binary storage。"],
      ["webhook response 只是需要立即回覆", "使用 Respond to Webhook/早回應模式或拆 background workflow。"],
      ["memory 爆是 binary data default mode", "先改 binary mode。"],
      ["沒有 centralized logs", "先補 logs，否則 workers 只會讓故障更分散。"]
    ],
    "week16-noworker-table"
  );

  addPage(
    "Chapter 16 · Section 16.7 continued",
    "不該急著加 workers 的情境",
    `
      <section class="chapter-section full">
        <div class="section-number">16.7</div>
        <div>
          <h3>先修 workflow、data policy 與 observability</h3>
          ${noWorkerRows}
          <div class="tip-callout">
            <strong>小補充</strong>
            <p>workers 可以分散 execution 壓力，但不能替你修掉爛 workflow、過大的 execution history、錯誤 binary mode 或看不到 logs 的維運盲點。</p>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.8",
    "separate webhook processors",
    `
      <section class="chapter-section">
        <div class="section-number">16.8</div>
        <div>
          <h3>webhook processors 是 queue mode 的下一層 scaling</h3>
          <p>webhook processors 是 queue mode 的下一層 scaling。當入口 webhook burst 很高時，webhook processors 可以把接收 request 的工作從 main 拆出去。load balancer 要把 <code>/webhook/*</code>、<code>/webhook-waiting/*</code> 送到 webhook processor pool，把 editor、internal API、settings、manual <code>/webhook-test/*</code> 留給 main。</p>
          <div class="week16-webhook-split">
            <div><span>LB</span><strong>/webhook/*</strong><p>webhook processor pool</p></div>
            <div><span>LB</span><strong>/webhook-waiting/*</strong><p>webhook processor pool</p></div>
            <div><span>LB</span><strong>/webhook-test/*</strong><p>main process</p></div>
            <div><span>LB</span><strong>editor / API</strong><p>main process</p></div>
          </div>
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.8 continued",
    "managed DB/Redis",
    `
      <section class="chapter-section">
        <div class="section-number">16.8</div>
        <div>
          <h3>DB 與 Redis 變成主系統</h3>
          <p>一旦 Redis queue mode 變成 production path，PostgreSQL 與 Redis 不再是附屬元件，而是主系統。managed DB/Redis 的價值不是品牌，而是 backup、restore、metrics、patch、availability、access control、connection limits、alerting。如果團隊選擇自管，也要有同等的 runbook。</p>
          <div class="week16-managed-state">
            <div>backup</div>
            <div>restore</div>
            <div>metrics</div>
            <div>patch</div>
            <div>availability</div>
            <div>access control</div>
            <div>connection limits</div>
            <div>alerting</div>
          </div>
        </div>
      </section>
    `
  );

  const logRows = renderReportTable(
    ["Log source", "必看內容"],
    [
      ["main", "trigger、API、UI、pruning、queue enqueue、Redis notification。"],
      ["webhook processors", "request volume、route、HTTP status、latency。"],
      ["workers", "execution start/end、node errors、memory、timeouts、Execute Command location。"],
      ["Redis", "connectivity、timeout、queue pressure、restarts。"],
      ["PostgreSQL", "connection count、slow queries、storage、backup。"],
      ["load balancer", "route mapping、5xx、timeout、sticky/session behavior。"]
    ],
    "week16-logs-table"
  );

  addPage(
    "Chapter 16 · Section 16.8 continued",
    "centralized logs",
    `
      <section class="chapter-section full">
        <div class="section-number">16.8</div>
        <div>
          <h3>多 workers 後，本機 container logs 不夠</h3>
          <p class="section-lead">多 workers 之後，本機 container logs 已不足以定位問題。至少要集中 main、webhook processors、workers、Redis、PostgreSQL、load balancer 的 logs。</p>
          ${logRows}
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 scaling ladder", "通過", "第 16.3 節與 <code>week-16-scaling-ladder.json</code>"],
      ["完成 queue mode architecture diagram", "通過", "第 16.4 節與 <code>week-16-queue-mode-architecture.json</code>"],
      ["完成 anti-overengineering checklist", "通過", "第 16.5 節與 <code>week-16-anti-overengineering-checklist.csv</code>"],
      ["覆蓋 single instance first", "通過", "第 16.3、16.6 節"],
      ["覆蓋 PostgreSQL first", "通過", "第 16.3、16.6 節"],
      ["覆蓋 Redis queue mode 與 workers", "通過", "第 16.4、16.7 節"],
      ["覆蓋 separate webhook processors、managed DB/Redis、centralized logs", "通過", "第 16.4、16.8 節"],
      ["提出 single container + Postgres 到 Redis workers 漸進路線", "通過", "第 16.3 節「驗收路線」"],
      ["避免一開始就上 Kubernetes", "通過", "第 16.3、16.5、16.8 節"]
    ],
    "week16-completion-table"
  );

  addPage(
    "Chapter 16 · Section 16.9",
    "Week 16 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">16.9</div>
        <div>
          <h3>Week 16 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 16 · Section 16.10",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">16.10</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 17 會進入故障排除演練。Week 16 已經建立 single instance、PostgreSQL、queue mode、workers、webhook processors、DB/Redis/logs 的 scaling ladder，下一週要把這些元件轉成故障情境：DB down、Redis down、worker backlog、webhook 5xx、binary storage missing、memory OOM、version mismatch、load balancer route 錯誤。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 16 的成果，是把 scaling 變成有門檻的漸進路線：先 single container + PostgreSQL，接著加大單機與 concurrency control，再補 observability，最後才用 Redis queue mode、workers、webhook processors，Kubernetes 留給真的需要 orchestration 的階段。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekSeventeenChapter(week, startIndex) {
  const source = "docs/week-17-troubleshooting-drills.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["12 張故障排除卡", "完成", "<code>artifacts/week-17-troubleshooting/week-17-troubleshooting-cards.json</code>；本章 17.4"],
      ["log/env/DNS/proxy/DB 檢查順序", "完成", "<code>artifacts/week-17-troubleshooting/week-17-check-order.json</code>；本章 17.5"],
      ["incident note 範本", "完成", "<code>artifacts/week-17-troubleshooting/week-17-incident-note-template.md</code>；本章 17.6"],
      ["troubleshooting table 演練", "完成", "本章 17.4、17.7"],
      ["常見問題第一檢查點", "完成", "本章 17.3、17.4、17.7"],
      ["症狀轉排查流程", "完成", "本章 17.3、17.5"],
      ["Week 17 驗證腳本", "完成", "<code>scripts/verify-week-seventeen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 17 · Week 17",
    "故障排除演練",
    `
      <div class="chapter-summary">
        <div class="week-icon">FIX</div>
        <div>
          <p class="kicker">17.0 本週定位</p>
          <p>執行日期：2026-05-28。本週目標是遇到錯誤時，快速判斷是 container、DB、URL、proxy、OAuth、security 還是 resource 問題。Week 17 把前 16 週累積的部署知識轉成故障排除肌肉記憶。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">17.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <div class="week17-flow">
        <div>Symptom</div><span>→</span>
        <div>log</div><span>→</span>
        <div>env</div><span>→</span>
        <div>DNS</div><span>→</span>
        <div>proxy</div><span>→</span>
        <div>DB</div><span>→</span>
        <div>incident note</div>
      </div>
      <div class="tip-callout">
        <strong>Codex 小提示</strong>
        <p>不要一開始就改 workflow、重啟所有服務或重建容器。先拿 log、env、DNS、proxy、DB 的客觀證據，避免把單一設定錯誤擴大成資料遺失、憑證失效或公開服務中斷。</p>
      </div>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-17"
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Webhook URL behind proxy", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Webhook URL</a>", "n8n behind reverse proxy 時要手動設定 <code>WEBHOOK_URL</code>，並設定 <code>N8N_PROXY_HOPS=1</code> 與 forwarded headers，否則 editor 顯示與第三方註冊的 webhook URL 可能錯。"],
      ["Webhook node common issues", "<a href=\"https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/\">Webhook common issues</a>", "Test URL 和 Production URL 行為不同；production webhook 需要 workflow active；同一路徑與 HTTP method 只能有一個 webhook。"],
      ["Telegram trigger issue", "<a href=\"https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.telegramtrigger/common-issues/\">Telegram trigger common issues</a>", "Telegram 要求 HTTPS webhook；behind proxy 時 wrong webhook URL 或 TLS 終止錯誤會造成 bad webhook。"],
      ["Database env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/database/\">Database env vars</a>", "<code>DB_TYPE=postgresdb</code>、<code>DB_POSTGRESDB_HOST</code>、port、user、password、pool size、SSL 設定是 database connection failed 的第一組檢查點。"]
    ],
    "week17-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Supported databases", "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">Supported databases</a>", "self-hosted 預設 SQLite，也可設定 PostgreSQL；production 事故要先確認實際 DB 類型與 state 位置。"],
      ["Logging", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/logging/\">Logging</a>", "log level 可用 <code>error</code>、<code>warn</code>、<code>info</code>、<code>debug</code>；排查時先讀 container logs，再必要時提升到 debug。"],
      ["Logs env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/logs/\">Logs env vars</a>", "<code>N8N_LOG_LEVEL</code>、<code>N8N_LOG_OUTPUT</code>、<code>N8N_LOG_FORMAT=json</code>、<code>DB_LOGGING_ENABLED</code> 能讓 production incident 更可追。"],
      ["Monitoring", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/monitoring/\">Monitoring</a>", "<code>/healthz</code> 只代表 instance reachable，<code>/healthz/readiness</code> 才能驗證 DB 已連線且 migration ready；metrics 要用 <code>N8N_METRICS=true</code> 啟用。"]
    ],
    "week17-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Security env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/security/\">Security env vars</a>", "<code>N8N_SECURE_COOKIE=true</code> 代表 cookie 只透過 HTTPS 傳送；secure cookie error 先查 scheme、proxy headers、TLS。"],
      ["SSL setup", "<a href=\"https://docs.n8n.io/hosting/securing/set-up-ssl/\">SSL setup</a>", "官方建議用 reverse proxy 處理 TLS；也可用 <code>N8N_SSL_CERT</code>、<code>N8N_SSL_KEY</code> 讓 n8n 直接提供 HTTPS。"],
      ["Custom encryption key", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/\">Custom encryption key</a>", "n8n 首次啟動會生成 encryption key，credentials 依賴該 key；queue workers 也必須使用同一個 <code>N8N_ENCRYPTION_KEY</code>。"],
      ["Encryption key rotation", "<a href=\"https://docs.n8n.io/hosting/securing/encryption-key-rotation/\">Encryption key rotation</a>", "rotation 是針對 data encryption key，instance <code>N8N_ENCRYPTION_KEY</code> 不應變更；啟用前要備份 DB，且所有 main/workers 共用同一 instance key。"]
    ],
    "week17-source-table"
  );

  const sourceRowsD = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Deployment env vars", "<a href=\"https://docs.n8n.io/hosting/configuration/environment-variables/deployment/\">Deployment env vars</a>", "<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_PROTOCOL</code>、<code>N8N_HOST</code>、<code>N8N_PORT</code>、<code>N8N_ENCRYPTION_KEY</code>、proxy 相關 env 都會影響 URL、OAuth、cookie 與 credentials。"],
      ["OAuth credentials", "<a href=\"https://docs.n8n.io/integrations/builtin/credentials/httprequest/\">OAuth credentials</a>", "OAuth1/OAuth2 credentials 需要把 n8n 顯示的 OAuth Redirect URL 填到外部服務；callback mismatch 先比對 redirect URI。"],
      ["Memory errors", "<a href=\"https://docs.n8n.io/hosting/scaling/memory-errors/\">Memory errors</a>", "<code>Problem running workflow</code>、<code>Connection Lost</code>、<code>503 Service Temporarily Unavailable</code>、heap out of memory 都可能是 resource 問題。"],
      ["Queue mode", "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>", "queue mode 下 main、workers、webhook processors 要共享 DB、Redis 與 <code>N8N_ENCRYPTION_KEY</code>；worker 故障要分別查 Redis、DB、worker logs。"]
    ],
    "week17-source-table"
  );

  addPage(
    "Chapter 17 · Section 17.2",
    "官方來源核對 I",
    `
      <section class="chapter-section full">
        <div class="section-number">17.2</div>
        <div>
          <h3>webhook、proxy、Telegram、database env</h3>
          ${sourceRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.2 continued",
    "官方來源核對 II",
    `
      <section class="chapter-section full">
        <div class="section-number">17.2</div>
        <div>
          <h3>database、logging、logs env、monitoring</h3>
          ${sourceRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.2 continued",
    "官方來源核對 III",
    `
      <section class="chapter-section full">
        <div class="section-number">17.2</div>
        <div>
          <h3>security cookies、SSL、encryption key、rotation</h3>
          ${sourceRowsC}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.2 continued",
    "官方來源核對 IV",
    `
      <section class="chapter-section full">
        <div class="section-number">17.2</div>
        <div>
          <h3>deployment env、OAuth、memory、queue mode</h3>
          ${sourceRowsD}
        </div>
      </section>
    `
  );

  const symptomRows = renderReportTable(
    ["層", "常見症狀", "第一檢查點"],
    [
      ["container", "n8n 無法打開、重啟循環、<code>Connection refused</code>", "<code>docker ps</code>、<code>docker logs</code>、volume mount、image tag。"],
      ["DB", "<code>/healthz</code> 200 但 <code>/healthz/readiness</code> 不是 200、startup log 有 connection failed", "<code>DB_TYPE</code>、<code>DB_POSTGRESDB_HOST</code>、port、password、SSL、DB container/network。"],
      ["URL", "webhook 或 OAuth callback 指到 localhost、舊 domain、http", "<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、editor 中顯示的 URL。"],
      ["proxy", "IP whitelist 失準、secure cookie、websocket 卡住、502/504", "<code>N8N_PROXY_HOPS</code>、<code>X-Forwarded-*</code> headers、TLS termination、route。"],
      ["OAuth", "provider 回傳 redirect URI mismatch、connect account 失敗", "外部 provider redirect URI 與 n8n OAuth Redirect URL 是否完全相同。"],
      ["security", "secure cookie error、session 不保留、public API 暴露", "<code>N8N_SECURE_COOKIE</code>、HTTPS、<code>N8N_SAMESITE_COOKIE</code>、security audit。"],
      ["resource", "503、Connection Lost、heap out of memory、worker backlog", "CPU/RAM、binary data、execution size、worker logs、queue metrics。"]
    ],
    "week17-symptom-table"
  );

  addPage(
    "Chapter 17 · Section 17.3",
    "症狀轉排查流程",
    `
      <section class="chapter-section full">
        <div class="section-number">17.3</div>
        <div>
          <h3>七層分類</h3>
          <p class="section-lead">故障排除要先把「看到的錯誤」轉成「可能的層」。這一步會決定你先查 logs、env、DNS、proxy、DB，還是進一步看 credentials、OAuth、security、resource、queue、workflow。</p>
          ${symptomRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.3 continued",
    "症狀流程圖",
    `
      <section class="chapter-section">
        <div class="section-number">17.3</div>
        <div>
          <h3>從錯誤到修復紀錄</h3>
          <div class="week17-symptom-flow">
            <div><span>1</span><strong>Capture exact symptom and timestamp</strong></div>
            <div><span>2</span><strong>Check logs first</strong></div>
            <div><span>3</span><strong>Startup?</strong><p>env and DB readiness</p></div>
            <div><span>4</span><strong>Runtime?</strong><p>URL, proxy, resource, workflow</p></div>
            <div><span>5</span><strong>Webhook or OAuth?</strong><p>URL, active workflow, redirect URI</p></div>
            <div><span>6</span><strong>Write incident note</strong></div>
          </div>
          <div class="tip-callout">
            <strong>排查原則</strong>
            <p>先確認現象與最新變更，再用固定順序排除。每一步要能留下證據，否則 incident 結束後只會留下「好像修好了」的口頭印象。</p>
          </div>
        </div>
      </section>
    `
  );

  const cardRowsA = renderReportTable(
    ["卡片", "症狀", "第一檢查點", "修復方向"],
    [
      ["T01 wrong webhook URL", "第三方打到 localhost、舊 domain、http URL 或回傳 bad webhook", "比對 editor 顯示的 webhook URL、<code>WEBHOOK_URL</code>、proxy 公開 URL", "設 <code>WEBHOOK_URL=https://n8n.example.com/</code>，重啟 n8n，重新啟用 workflow 或重新註冊 webhook。"],
      ["T02 lost credentials", "重建容器或搬 DB 後 credentials 無法解密", "確認 <code>N8N_ENCRYPTION_KEY</code> 是否與建立 credentials 時一致", "還原原 instance key；若 key 遺失，從含原 key 的備份還原；不要用新 key 覆蓋 production。"],
      ["T03 database connection failed", "startup log 顯示 DB connect failed 或 readiness 不通過", "查 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_*</code> env、DB container/network、SSL", "修正 host、port、user、password、database、SSL；確認 DB ready 後重啟 n8n。"],
      ["T04 secure cookie error", "瀏覽器無法登入、session 不保留、HTTP 環境 cookie 失敗", "查外部 URL 是否 HTTPS、proxy 是否送 <code>X-Forwarded-Proto=https</code>、<code>N8N_SECURE_COOKIE</code>", "production 保持 HTTPS；local 測試可明確設 <code>N8N_SECURE_COOKIE=false</code>，不要把此設定帶到 public production。"]
    ],
    "week17-card-table"
  );

  const cardRowsB = renderReportTable(
    ["卡片", "症狀", "第一檢查點", "修復方向"],
    [
      ["T05 OAuth callback mismatch", "Connect account 後 provider 拒絕 redirect URI", "比對 n8n 顯示的 OAuth Redirect URL 與 provider 設定", "修正 <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code> 或 provider redirect URI，然後重新授權 credential。"],
      ["T06 proxy forwarded headers", "IP whitelist、websocket、scheme 或 client IP 判斷錯", "查 <code>N8N_PROXY_HOPS</code> 與 <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code>", "在最後一層 proxy 補 headers，設定正確 proxy hops，重測 webhook/IP whitelist。"],
      ["T07 DNS or TLS failure", "domain 無法解析、憑證錯誤、HTTPS 不通", "<code>dig</code>/<code>nslookup</code> domain，<code>curl -Iv https://domain/healthz</code>", "修正 DNS A/AAAA/CNAME、TLS certificate、reverse proxy virtual host。"],
      ["T08 container restart loop", "container 一直 restarting 或 n8n UI 開不起來", "<code>docker ps</code>、<code>docker logs</code>、volume mount、env file path", "修正 env、volume、permission、port collision；避免刪除資料 volume。"]
    ],
    "week17-card-table"
  );

  const cardRowsC = renderReportTable(
    ["卡片", "症狀", "第一檢查點", "修復方向"],
    [
      ["T09 resource exhaustion", "<code>503</code>、<code>Connection Lost</code>、heap out of memory、workflow 中斷", "查 memory/CPU、container OOM、execution size、binary data mode", "增加資源、拆 workflow、降低 concurrency、調整 binary data 與 execution pruning。"],
      ["T10 queue worker stalled", "queue mode 有 backlog，executions 不被 worker 消化", "查 worker logs、<code>EXECUTIONS_MODE=queue</code>、<code>QUEUE_BULL_REDIS_HOST</code>、DB connectivity、shared <code>N8N_ENCRYPTION_KEY</code>", "修 Redis/DB env，確認 workers 與 main 同版同 key，調整 worker concurrency 與 DB pool。"],
      ["T11 webhook path or method conflict", "webhook 顯示路徑被占用或 production URL 沒反應", "查 workflow active、Test URL/Production URL、path + method 是否重複", "停用衝突 workflow，換 path/method，production 前啟用 workflow。"],
      ["T12 missing logs or evidence", "事故後無法知道錯在哪個 process", "查 <code>N8N_LOG_LEVEL</code>、<code>N8N_LOG_OUTPUT</code>、<code>N8N_LOG_FORMAT</code>、centralized logs", "設 <code>N8N_LOG_FORMAT=json</code>，集中 main/worker/proxy/DB logs，incident note 保留時間線。"]
    ],
    "week17-card-table"
  );

  addPage(
    "Chapter 17 · Section 17.4",
    "交付物一：12 張故障排除卡 I",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>T01-T04：webhook、credentials、DB、cookie</h3>
          ${cardRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.4 continued",
    "交付物一：12 張故障排除卡 II",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>T05-T08：OAuth、proxy、DNS/TLS、container</h3>
          ${cardRowsB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.4 continued",
    "交付物一：12 張故障排除卡 III",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>T09-T12：resource、queue、workflow、observability</h3>
          ${cardRowsC}
        </div>
      </section>
    `
  );

  const cardDetailA = renderReportTable(
    ["卡片", "likely causes", "check commands", "evidence required"],
    [
      ["T01", "<ul><li><code>WEBHOOK_URL</code> unset/wrong</li><li>HTTPS proxy but internal HTTP URL</li><li>workflow reactivated before URL fix</li></ul>", "<code>docker inspect ... WEBHOOK_URL|N8N_PROXY_HOPS|N8N_EDITOR_BASE_URL</code><br><code>curl -Iv https://n8n.example.com/healthz</code><br><code>curl -Iv https://n8n.example.com/webhook/path</code>", "Editor Production URL、container env、provider registration、curl result"],
      ["T02", "<ul><li><code>N8N_ENCRYPTION_KEY</code> changed</li><li>original <code>.n8n</code> settings not preserved</li><li>workers use different key</li></ul>", "<code>docker inspect ... N8N_ENCRYPTION_KEY</code><br><code>docker logs ... credential|encryption|decrypt</code><br><code>grep -R N8N_ENCRYPTION_KEY .env ...</code>", "current key source、original key source、credential error text、backup timestamp"],
      ["T03", "<ul><li><code>DB_TYPE</code> or host wrong</li><li>password/database/SSL wrong</li><li>Docker network mismatch</li></ul>", "<code>docker logs ... database|postgres|connection</code><br><code>curl ... /healthz/readiness</code><br><code>docker compose ps postgres</code>", "DB env、DB logs、startup logs、readiness status"],
      ["T04", "<ul><li>HTTP public access with secure cookie</li><li>missing <code>X-Forwarded-Proto</code></li><li>local copied production cookie settings</li></ul>", "<code>curl -I https://n8n.example.com</code><br><code>docker inspect ... N8N_SECURE_COOKIE|N8N_PROXY_HOPS|N8N_PROTOCOL</code><br><code>docker logs ... cookie|secure|session</code>", "response headers、proxy headers、cookie settings、browser console"]
    ],
    "week17-detail-table"
  );

  const cardDetailB = renderReportTable(
    ["卡片", "likely causes", "check commands", "evidence required"],
    [
      ["T05", "<ul><li>provider redirect URI mismatch</li><li>stale domain</li><li>proxy rewrites scheme/host</li></ul>", "<code>docker inspect ... WEBHOOK_URL|N8N_EDITOR_BASE_URL|N8N_PROTOCOL|N8N_HOST</code><br><code>curl -Iv https://n8n.example.com/rest/oauth2-credential/callback</code>", "n8n redirect URL、provider redirect URI、public base URL、provider error"],
      ["T06", "<ul><li><code>N8N_PROXY_HOPS</code> unset</li><li>missing <code>X-Forwarded-*</code></li><li>wrong hop count</li></ul>", "<code>docker inspect ... N8N_PROXY_HOPS</code><br><code>curl -Iv https://n8n.example.com/healthz</code>", "proxy config、n8n env、access log、failing behavior"],
      ["T07", "<ul><li>DNS record wrong</li><li>certificate mismatch</li><li>firewall/LB not forwarding 443</li></ul>", "<code>dig n8n.example.com</code><br><code>curl -Iv https://n8n.example.com/healthz</code><br><code>curl -Iv http://n8n.example.com/healthz</code>", "DNS answer、certificate SAN、HTTP status、proxy access log"],
      ["T08", "<ul><li>invalid env</li><li>volume permission/mount issue</li><li>port collision/image failure</li></ul>", "<code>docker ps --filter name=n8n</code><br><code>docker logs --tail 200 n8n</code><br><code>docker inspect n8n --format '{{json .Mounts}}'</code>", "restart count、startup error、mount list、image tag"]
    ],
    "week17-detail-table"
  );

  const cardDetailC = renderReportTable(
    ["卡片", "likely causes", "check commands", "evidence required"],
    [
      ["T09", "<ul><li>too much data in one execution</li><li>binary data in memory</li><li>concurrency too high</li></ul>", "<code>docker stats --no-stream</code><br><code>docker logs ... heap|memory|503|Connection Lost</code><br><code>docker inspect n8n --format '{{.State.OOMKilled}}'</code>", "OOM state、memory usage、execution id、payload size"],
      ["T10", "<ul><li>Redis connection failed</li><li>workers cannot reach DB</li><li>worker key mismatch</li><li>DB pool mismatch</li></ul>", "<code>docker logs --since 30m n8n-worker</code><br><code>docker inspect n8n-worker ... EXECUTIONS_MODE|QUEUE_BULL_REDIS|DB_POSTGRESDB|N8N_ENCRYPTION_KEY</code><br><code>curl ... /healthz/readiness</code>", "worker logs、Redis env、DB readiness、shared key"],
      ["T11", "<ul><li>same path and method already active</li><li>workflow inactive</li><li>caller uses test URL for production</li></ul>", "<code>curl -Iv https://n8n.example.com/webhook/path</code><br><code>docker logs ... webhook|path|method</code>", "workflow active state、path、method、caller URL"],
      ["T12", "<ul><li>log level too low</li><li>local stdout rotated away</li><li>main/worker/proxy/DB/Redis logs not correlated</li></ul>", "<code>docker logs --since 2h n8n</code><br><code>docker inspect ... N8N_LOG_LEVEL|N8N_LOG_OUTPUT|N8N_LOG_FORMAT|DB_LOGGING_ENABLED</code><br><code>curl -s http://localhost:5687/healthz</code>", "log configuration、incident timestamp、process list、alert link"]
    ],
    "week17-detail-table"
  );

  addPage(
    "Chapter 17 · Section 17.4 continued",
    "故障卡細節 I",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>T01-T04：likely causes、commands、evidence</h3>
          ${cardDetailA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.4 continued",
    "故障卡細節 II",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>T05-T08：likely causes、commands、evidence</h3>
          ${cardDetailB}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.4 continued",
    "故障卡細節 III",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>T09-T12：likely causes、commands、evidence</h3>
          ${cardDetailC}
        </div>
      </section>
    `
  );

  const requiredFourRows = renderReportTable(
    ["必考情境", "第一步", "修復方向"],
    [
      ["wrong webhook URL", "先比對 editor 中 webhook URL 與公開 domain，確認 <code>WEBHOOK_URL</code> 是否設定為 HTTPS public base URL。", "修正 <code>WEBHOOK_URL</code> 與 proxy headers，重啟後重新啟用 workflow 或重新註冊第三方 webhook。"],
      ["lost credentials", "先確認 <code>N8N_ENCRYPTION_KEY</code> 是否與原 instance key 一致，並停止任何會覆蓋 key 的部署。", "還原原 key 或從含原 key 的備份恢復；若原 key 不存在，既有 credentials 無法可靠解密，必須重新建立 credentials。"],
      ["database connection failed", "先打 <code>/healthz/readiness</code> 並讀 startup log，定位是 host、port、password、database、SSL 或 network。", "修 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_*</code>，確認 DB reachable、migration ready，再重啟 n8n。"],
      ["secure cookie error", "先確認使用者進站 URL 是 HTTPS，且最後一層 proxy 有 <code>X-Forwarded-Proto=https</code>。", "production 修 TLS/proxy；local-only 測試可設 <code>N8N_SECURE_COOKIE=false</code>，並在公開前改回安全設定。"]
    ],
    "week17-four-table"
  );

  addPage(
    "Chapter 17 · Section 17.4 continued",
    "必考四題第一步",
    `
      <section class="chapter-section full">
        <div class="section-number">17.4</div>
        <div>
          <h3>wrong webhook URL、lost credentials、DB failed、secure cookie</h3>
          ${requiredFourRows}
        </div>
      </section>
    `
  );

  const checkRowsA = renderReportTable(
    ["順序", "Gate", "目的", "代表性檢查"],
    [
      ["1", "log", "先拿客觀錯誤與時間線", "<code>docker logs --since 30m n8n</code>、centralized logs query、<code>N8N_LOG_LEVEL</code>。"],
      ["2", "env", "確認 instance identity 與連線設定", "<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_ENCRYPTION_KEY</code>、<code>DB_POSTGRESDB_*</code>。"],
      ["3", "DNS", "確認 public hostname 指到正確入口", "<code>dig n8n.example.com</code>、<code>curl -Iv https://n8n.example.com/healthz</code>。"],
      ["4", "proxy", "確認 TLS、forwarded headers、routes", "<code>X-Forwarded-Proto</code>、<code>X-Forwarded-Host</code>、<code>N8N_PROXY_HOPS</code>、<code>/webhook/*</code> route。"],
      ["5", "DB", "確認 durable state ready", "<code>/healthz/readiness</code>、PostgreSQL network、password、SSL、pool。"],
      ["6", "container", "確認 process 與 volume", "image tag、restart count、volume mount、port mapping。"]
    ],
    "week17-order-table"
  );

  const checkRowsB = renderReportTable(
    ["順序", "Gate", "目的", "代表性檢查"],
    [
      ["7", "credentials", "確認 encryption key 與 credential state", "原 <code>N8N_ENCRYPTION_KEY</code>、credential decrypt error、DB backup。"],
      ["8", "OAuth", "確認 redirect URI 與 provider 設定", "n8n OAuth Redirect URL、provider redirect URI、public base URL。"],
      ["9", "security", "確認 cookie、SSO、API exposure", "<code>N8N_SECURE_COOKIE</code>、HTTPS、SameSite、security audit。"],
      ["10", "resource", "確認 CPU、memory、binary data、execution size", "OOM logs、503、execution payload、binary data mode。"],
      ["11", "queue", "確認 Redis 與 workers", "Redis host/port/password、worker logs、shared key、queue metrics。"],
      ["12", "workflow", "最後才改 workflow", "node error、retry、timeout、webhook response mode、external API status。"]
    ],
    "week17-order-table"
  );

  addPage(
    "Chapter 17 · Section 17.5",
    "交付物二：log/env/DNS/proxy/DB 檢查順序 I",
    `
      <section class="chapter-section full">
        <div class="section-number">17.5</div>
        <div>
          <h3>順序 1-6：log、env、DNS、proxy、DB、container</h3>
          <p class="section-lead">固定順序是 <code>log -&gt; env -&gt; DNS -&gt; proxy -&gt; DB</code>。這五步先跑完，再進 container、credentials、OAuth、security、resource、queue、workflow。</p>
          ${checkRowsA}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.5 continued",
    "交付物二：log/env/DNS/proxy/DB 檢查順序 II",
    `
      <section class="chapter-section full">
        <div class="section-number">17.5</div>
        <div>
          <h3>順序 7-12：credentials、OAuth、security、resource、queue、workflow</h3>
          ${checkRowsB}
          <div class="week17-check-chain">
            <div>log</div>
            <div>env</div>
            <div>DNS</div>
            <div>proxy</div>
            <div>DB</div>
            <div>container</div>
            <div>credentials</div>
            <div>OAuth</div>
            <div>security</div>
            <div>resource</div>
            <div>queue</div>
            <div>workflow</div>
          </div>
        </div>
      </section>
    `
  );

  const commandRowsA = renderReportTable(
    ["Gate", "commands", "pass signal", "fail action"],
    [
      ["log", "<code>docker logs --since 30m n8n</code><br><code>docker logs --tail 200 n8n</code><br>centralized logs query", "能說出第一個失敗 process 與 timestamp。", "在受控窗口暫時提高到 <code>N8N_LOG_LEVEL=debug</code> 再抓 log。"],
      ["env", "<code>docker inspect n8n --format '{{range .Config.Env}}{{println .}}{{end}}'</code><br>compare <code>.env</code> against deployed secrets<br>check <code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>、<code>N8N_ENCRYPTION_KEY</code>、<code>DB_POSTGRESDB_*</code>", "public URL、key、DB target、security flags 都已知。", "從 deployment source of truth 修 env，再依文件順序 restart。"],
      ["DNS", "<code>dig n8n.example.com</code><br><code>nslookup n8n.example.com</code><br><code>curl -Iv https://n8n.example.com/healthz</code>", "public hostname resolves and reaches expected TLS endpoint。", "修 DNS、TTL、firewall、certificate 或 ingress target。"]
    ],
    "week17-command-table"
  );

  const commandRowsB = renderReportTable(
    ["Gate", "commands", "pass signal", "fail action"],
    [
      ["proxy", "inspect Caddy/Nginx/Traefik/LB config<br>check <code>X-Forwarded-For</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-Proto</code><br>check <code>N8N_PROXY_HOPS</code>", "proxy forwards HTTPS scheme and host，webhook routes reach correct process。", "修 forwarded headers、proxy hops、TLS termination、<code>/webhook</code> route。"],
      ["DB", "<code>curl -s -o /dev/null -w '%{http_code}' http://localhost:5687/healthz/readiness</code><br><code>docker compose ps postgres</code><br><code>docker logs --since 30m postgres</code>", "<code>/healthz/readiness</code> returns 200，DB 無 authentication/network failure。", "修 <code>DB_TYPE</code>、host、port、database、user、password、SSL、network 或 readiness。"],
      ["container", "<code>docker ps --filter name=n8n --format '{{.Names}} {{.Status}} {{.Ports}}'</code><br><code>docker inspect n8n --format '{{json .Mounts}}'</code><br><code>docker inspect n8n --format '{{.Config.Image}}'</code>", "container stable，image、mounts、ports 符合預期。", "修 startup、image tag、port conflict、volume mount 或 permission，不刪 state。"]
    ],
    "week17-command-table"
  );

  const commandRowsC = renderReportTable(
    ["Gate", "commands", "pass signal", "fail action"],
    [
      ["credentials", "compare <code>N8N_ENCRYPTION_KEY</code> across main/workers/deployment secret<br>review credential decrypt errors<br>verify restore notes include original key", "credentials decrypt，所有 process 同 key。", "還原原 key 或 DB+key；確認 key loss 後才重建 credentials。"],
      ["OAuth", "copy n8n OAuth Redirect URL<br>compare provider redirect URI<br>check <code>WEBHOOK_URL</code> and <code>N8N_EDITOR_BASE_URL</code>", "provider redirect URI 完全等於 n8n OAuth Redirect URL。", "修 public URL 或 provider redirect URI，重新連 credential。"],
      ["security", "<code>curl -I https://n8n.example.com</code><br>check <code>N8N_SECURE_COOKIE</code> and <code>N8N_SAMESITE_COOKIE</code><br>run n8n audit in maintenance window", "cookie、session、security posture 符合 public exposure。", "修 TLS、secure cookie、public API exposure、audit findings。"]
    ],
    "week17-command-table"
  );

  const commandRowsD = renderReportTable(
    ["Gate", "commands", "pass signal", "fail action"],
    [
      ["resource", "<code>docker stats --no-stream</code><br><code>docker inspect n8n --format '{{.State.OOMKilled}}'</code><br>review execution payload and binary data mode", "resource usage and execution size 在預期範圍。", "降 concurrency、拆 workflow、移 binary data、prune execution data 或加資源。"],
      ["queue", "<code>docker logs --since 30m n8n-worker</code><br>check <code>EXECUTIONS_MODE=queue</code><br>check <code>QUEUE_BULL_REDIS_HOST</code> and <code>QUEUE_BULL_REDIS_PORT</code>", "workers 能連 Redis/DB、處理 jobs、shared key。", "修 Redis、DB、worker env、version mismatch 或 worker concurrency。"],
      ["workflow", "open failed execution<br>identify first failed node<br>check retry、timeout、response mode、external API status", "第一個 workflow-level failure 已由 execution evidence 定位。", "修 node config、拆 workflow、加 retries 或改 webhook response behavior。"]
    ],
    "week17-command-table"
  );

  addPage("Chapter 17 · Section 17.5 continued", "檢查順序命令 I", `<section class="chapter-section full"><div class="section-number">17.5</div><div><h3>log、env、DNS</h3>${commandRowsA}</div></section>`);
  addPage("Chapter 17 · Section 17.5 continued", "檢查順序命令 II", `<section class="chapter-section full"><div class="section-number">17.5</div><div><h3>proxy、DB、container</h3>${commandRowsB}</div></section>`);
  addPage("Chapter 17 · Section 17.5 continued", "檢查順序命令 III", `<section class="chapter-section full"><div class="section-number">17.5</div><div><h3>credentials、OAuth、security</h3>${commandRowsC}</div></section>`);
  addPage("Chapter 17 · Section 17.5 continued", "檢查順序命令 IV", `<section class="chapter-section full"><div class="section-number">17.5</div><div><h3>resource、queue、workflow</h3>${commandRowsD}</div></section>`);

  const incidentRowsA = renderReportTable(
    ["區塊", "必填內容"],
    [
      ["Incident header", "incident id、owner、severity、start time、detect time、affected workflow、affected users。"],
      ["Symptom", "exact error text、HTTP status、browser message、provider response、execution id、container name。"],
      ["Architecture context", "deployment type、public URL、proxy、DB、Redis/workers、n8n version、last deploy。"],
      ["Check sequence", "log、env、DNS、proxy、DB 的結果與時間。"],
      ["Hypothesis matrix", "每個可能層的 evidence、status、next action。"],
      ["Fix", "實際變更、指令、env diff、restarts、rollback point。"],
      ["Verification", "health/readiness、webhook test、OAuth reconnect、credential decrypt、execution success。"],
      ["Root cause", "direct cause、contributing cause、missed detection。"],
      ["Prevention", "monitoring、backup、runbook、deployment guard、owner。"]
    ],
    "week17-incident-table"
  );

  addPage(
    "Chapter 17 · Section 17.6",
    "交付物三：incident note 範本",
    `
      <section class="chapter-section full">
        <div class="section-number">17.6</div>
        <div>
          <h3>incident note 的必填區塊</h3>
          <p class="section-lead">incident note 的功能不是寫漂亮報告，而是留下可重演證據。它刻意把「已排除」和「仍需追蹤」分開，避免 incident 結束後只留下口頭印象。</p>
          ${incidentRowsA}
        </div>
      </section>
    `
  );

  const incidentHeaderRows = renderReportTable(
    ["Section", "Fields"],
    [
      ["Incident Header", "Incident ID、Owner、Severity、Start time、Detected time、Resolved time、Affected workflow、Affected users or systems。"],
      ["Symptom", "Exact error text、HTTP status、Execution id、Container or process、First observed by。"],
      ["Architecture Context", "Deployment type、Public URL、Proxy、Database、Redis or workers、n8n version、Last deploy or config change。"],
      ["Check Sequence", "Order 1-12：log、env、DNS、proxy、DB、container、credentials、OAuth、security、resource、queue、workflow；每列填 Result 與 Evidence link or command output。"]
    ],
    "week17-template-table"
  );

  const incidentAnalysisRows = renderReportTable(
    ["Section", "Fields"],
    [
      ["Hypothesis Matrix", "Layer、Hypothesis、Evidence、Status、Next action；layers 至少包含 container、DB、URL、proxy、OAuth、security、resource、workflow。"],
      ["Fix Applied", "Change owner、Change description、Commands or deployment link、Environment diff、Rollback point。"],
      ["Verification", "<code>/healthz</code>、<code>/healthz/readiness</code>、Webhook test、OAuth reconnect、Credential decrypt、Successful execution id、User-facing confirmation。"],
      ["Root Cause", "Direct cause、Contributing cause、Detection gap、Recovery gap。"],
      ["Prevention / Closure", "Action、Owner、Due date、Verification；Final status、Follow-up owner、Follow-up location、Closed time。"]
    ],
    "week17-template-table"
  );

  addPage("Chapter 17 · Section 17.6 continued", "incident note 範本 I", `<section class="chapter-section full"><div class="section-number">17.6</div><div><h3>header、symptom、context、check sequence</h3>${incidentHeaderRows}</div></section>`);
  addPage("Chapter 17 · Section 17.6 continued", "incident note 範本 II", `<section class="chapter-section full"><div class="section-number">17.6</div><div><h3>hypothesis、fix、verification、root cause、prevention</h3>${incidentAnalysisRows}</div></section>`);

  const drillA = renderReportTable(
    ["項目", "操作"],
    [
      ["症狀", "外部服務打 webhook 失敗，或 provider 顯示 webhook URL 必須是 HTTPS。"],
      ["第一檢查點", "看 n8n editor 中 Webhook node 顯示的 Production URL，再比對 <code>WEBHOOK_URL</code> 與 public domain。"],
      ["證據", "<code>curl -Iv https://n8n.example.com/webhook/path</code>、provider webhook 設定截圖、container env。"],
      ["修復方向", "設 <code>WEBHOOK_URL=https://n8n.example.com/</code>、<code>N8N_PROXY_HOPS=1</code>，proxy 補 <code>X-Forwarded-*</code> headers，重啟後重新註冊 webhook。"],
      ["驗證", "workflow active 後，Production URL 收到 2xx，execution list 有新 execution。"]
    ],
    "week17-drill-table"
  );

  const drillB = renderReportTable(
    ["項目", "操作"],
    [
      ["症狀", "migration 或 container recreation 後，credentials 顯示無法解密，OAuth/token 失效。"],
      ["第一檢查點", "立即查目前 <code>N8N_ENCRYPTION_KEY</code>，與原部署 secret、備份、worker env 比對。"],
      ["證據", "deployment secret history、old <code>.n8n</code> settings file、DB backup timestamp、worker env。"],
      ["修復方向", "還原原 <code>N8N_ENCRYPTION_KEY</code>；若原 key 遺失，從含原 key 的備份還原或重新建立 credentials。"],
      ["驗證", "Credential test success，既有 workflow 可讀 credentials，queue workers 使用同一 key。"]
    ],
    "week17-drill-table"
  );

  const drillC = renderReportTable(
    ["項目", "操作"],
    [
      ["症狀", "n8n startup log 有 database connection failed，或 <code>/healthz/readiness</code> 回傳非 200。"],
      ["第一檢查點", "查 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_HOST</code>、port、database、user、password、SSL 是否與 DB service 一致。"],
      ["證據", "<code>docker compose ps</code>、DB logs、n8n startup logs、readiness status、network name。"],
      ["修復方向", "修正 DB env、Docker network、SSL CA、DB password；確認 DB ready 後重啟 n8n。"],
      ["驗證", "<code>/healthz/readiness</code> 200，n8n UI 可登入，existing workflows 可讀。"]
    ],
    "week17-drill-table"
  );

  const drillD = renderReportTable(
    ["項目", "操作"],
    [
      ["症狀", "使用 HTTP public URL、behind proxy、或 browser console 顯示 secure cookie 相關錯誤，登入 session 不保留。"],
      ["第一檢查點", "確認使用者進站為 HTTPS，proxy 給 n8n 的 forwarded proto 是 <code>https</code>，<code>N8N_SECURE_COOKIE</code> 沒被錯誤關閉或錯誤保留。"],
      ["證據", "<code>curl -I https://n8n.example.com</code>、proxy access log、response headers、container env。"],
      ["修復方向", "production 修 TLS 與 proxy headers；local-only 測試可暫設 <code>N8N_SECURE_COOKIE=false</code>，但 public production 必須回到 HTTPS cookie。"],
      ["驗證", "login session 穩定，browser 不再拒收 cookie，security env 與 public URL 一致。"]
    ],
    "week17-drill-table"
  );

  addPage("Chapter 17 · Section 17.7", "troubleshooting table 演練 A", `<section class="chapter-section full"><div class="section-number">17.7</div><div><h3>Drill A：wrong webhook URL</h3>${drillA}</div></section>`);
  addPage("Chapter 17 · Section 17.7 continued", "troubleshooting table 演練 B", `<section class="chapter-section full"><div class="section-number">17.7</div><div><h3>Drill B：lost credentials</h3>${drillB}</div></section>`);
  addPage("Chapter 17 · Section 17.7 continued", "troubleshooting table 演練 C", `<section class="chapter-section full"><div class="section-number">17.7</div><div><h3>Drill C：database connection failed</h3>${drillC}</div></section>`);
  addPage("Chapter 17 · Section 17.7 continued", "troubleshooting table 演練 D", `<section class="chapter-section full"><div class="section-number">17.7</div><div><h3>Drill D：secure cookie error</h3>${drillD}</div></section>`);

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 12 張故障排除卡", "通過", "第 17.4 節與 <code>week-17-troubleshooting-cards.json</code>"],
      ["完成 log/env/DNS/proxy/DB 檢查順序", "通過", "第 17.5 節與 <code>week-17-check-order.json</code>"],
      ["完成 incident note 範本", "通過", "第 17.6 節與 <code>week-17-incident-note-template.md</code>"],
      ["wrong webhook URL 有第一步與修復方向", "通過", "第 17.4、17.7 節 T01/Drill A"],
      ["lost credentials 有第一步與修復方向", "通過", "第 17.4、17.7 節 T02/Drill B"],
      ["database connection failed 有第一步與修復方向", "通過", "第 17.4、17.7 節 T03/Drill C"],
      ["secure cookie error 有第一步與修復方向", "通過", "第 17.4、17.7 節 T04/Drill D"],
      ["症狀可轉成排查流程", "通過", "第 17.3、17.5 節"]
    ],
    "week17-completion-table"
  );

  addPage(
    "Chapter 17 · Section 17.8",
    "Week 17 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">17.8</div>
        <div>
          <h3>Week 17 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 17 · Section 17.9",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">17.9</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 18 會進入平台選型與成本風險評估。Week 17 的 incident notes 可以回餵 Week 18：哪一類事故最常發生、哪一層最難維運、哪個平台能降低 DB/proxy/OAuth/security/resource 的操作風險。選型不只看月費，也要看它能不能減少真實事故的 MTTR。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 17 的成果，是把排錯從直覺改成證據流程：先 log、env、DNS、proxy、DB，再看 container、credentials、OAuth、security、resource、queue、workflow。每一次修復都要用 incident note 留下時間線、證據、修復與預防。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekEighteenChapter(week, startIndex) {
  const source = "docs/week-18-platform-selection-cost-risk.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["deployment recommendation matrix", "完成", "<code>artifacts/week-18-platform-selection/week-18-deployment-recommendation-matrix.json</code>；本章 18.3"],
      ["cost-risk worksheet", "完成", "<code>artifacts/week-18-platform-selection/week-18-cost-risk-worksheet.csv</code>；本章 18.4"],
      ["AWS vs PaaS decision memo", "完成", "<code>artifacts/week-18-platform-selection/week-18-aws-vs-paas-decision-memo.md</code>；本章 18.5"],
      ["beginner、freelancer、agency、production team 選型", "完成", "本章 18.3、18.6"],
      ["AWS 與 simpler cloud options 比較", "完成", "本章 18.5"],
      ["usage-priced RAM/CPU/storage/egress 風險整理", "完成", "本章 18.4"],
      ["Week 18 驗證腳本", "完成", "<code>scripts/verify-week-eighteen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 18 · Week 18",
    "平台選型與成本風險評估",
    `
      <div class="chapter-summary">
        <div class="week-icon">COST</div>
        <div>
          <p class="kicker">18.1 本週交付總覽</p>
          <p>執行日期：2026-05-28。本週目標是說清楚不同使用者類型應該選哪條部署路線，並把成本與維運責任攤開。實作結果包含 deployment recommendation matrix、cost-risk worksheet、AWS vs PaaS decision memo，並為 beginner、freelancer、agency、production team 分別提出首選、替代方案、避免事項。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">18.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-18"
  );

  addPage(
    "Chapter 18 · Section 18.1 continued",
    "本週決策主線",
    `
      <section class="chapter-section">
        <div class="section-number">18.1</div>
        <div>
          <h3>從使用者類型走到成本 worksheet</h3>
          <div class="week18-flow">
            <div><strong>beginner</strong><span>n8n Cloud first</span></div>
            <div><strong>freelancer</strong><span>VPS Compose or small PaaS</span></div>
            <div><strong>agency</strong><span>standardized client blueprint</span></div>
            <div><strong>production team</strong><span>AWS/GCP or Enterprise</span></div>
            <div class="wide"><strong>cost-risk worksheet</strong><span>RAM · CPU · storage · egress · labor · budget alerts</span></div>
            <div class="wide"><strong>AWS vs PaaS memo</strong><span>simpler cloud by default, hyperscaler only after maturity gates</span></div>
          </div>
          <div class="tip-callout">
            <strong>Codex 小提示</strong>
            <p>Week 18 的判斷基準不是「哪個平台最酷」，而是「誰要承擔維運責任」。同一個 n8n 可以放在 n8n Cloud、單機 VPS、PaaS、Cloud Run、AWS ECS/Fargate 或 Kubernetes；錯誤選型會把 Week 14 的 backup、Week 15 的 security、Week 16 的 scaling、Week 17 的 troubleshooting 變成長期成本。</p>
          </div>
        </div>
      </section>
    `
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n Docker install", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">Docker install</a>", "n8n 官方 Docker 文件明確要求 persistent volume；這是 VPS/Docker Compose 路線的最低基礎，也提醒 beginner 不能把 container 當 state。"],
      ["n8n scaling overview", "<a href=\"https://docs.n8n.io/hosting/scaling/overview/\">Scaling overview</a>", "大量 users、workflows、executions 時才進入 scaling 設定；queue mode 是擴展路線，不是 beginner 起點。"],
      ["n8n queue mode", "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>", "queue mode 需要 PostgreSQL、Redis、workers，且 main/worker 要共享資料層與 encryption key；production team 才應把它當主要架構。"],
      ["n8n execution data", "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>", "execution retention 會影響 database size 與效能；成本 worksheet 必須包含 DB storage、pruning、backup growth。"]
    ],
    "week18-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n binary data", "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data</a>", "binary data 會影響 memory、storage、execution behavior；平台選型不能只看 app compute。"],
      ["n8n external storage", "<a href=\"https://docs.n8n.io/hosting/scaling/external-storage/\">External storage</a>", "大量 binary data 需要外部物件儲存；這會增加 storage、request、egress、lifecycle policy 風險。"],
      ["n8n logging", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/logging/\">Logging</a>", "多 process/multi-worker deployment 要 centralized logs；log level 與 retention 是成本項，也是 Week 17 排錯證據來源。"],
      ["n8n monitoring", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/monitoring/\">Monitoring</a>", "production 需要 health/readiness/metrics；監控與告警是維運責任，不是可省略項。"]
    ],
    "week18-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Render pricing", "<a href=\"https://render.com/pricing\">Render pricing</a>", "Render 以服務、Postgres、disk、bandwidth 等項目組合成本；適合簡化部署，但仍需看 persistent disk 與 DB plan。"],
      ["Render free usage", "<a href=\"https://render.com/free\">Render free</a>", "free tier 有使用限制；不能把 free service 當 production webhook 承載，也不能放真客戶 credentials。"],
      ["Railway pricing", "<a href=\"https://railway.com/pricing\">Railway pricing</a>", "Railway 採 usage-based credits，RAM、CPU、storage、egress 會直接影響月費；適合快速部署但要設 usage alerts。"],
      ["Fly.io pricing", "<a href=\"https://fly.io/pricing/\">Fly pricing</a>", "Fly 以 machines、volumes、bandwidth 等項目計價；多 region 或 volume 成長會改變成本。"],
      ["Google Cloud Run pricing", "<a href=\"https://cloud.google.com/run/pricing\">Cloud Run pricing</a>", "Cloud Run 依 CPU、memory、requests、networking 等項目計費；scale-to-zero 有價值，但長時間常駐與 egress 要估算。"]
    ],
    "week18-source-table"
  );

  const sourceRowsD = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["AWS Fargate pricing", "<a href=\"https://aws.amazon.com/fargate/pricing/\">Fargate pricing</a>", "Fargate 以 vCPU、memory、OS/CPU architecture、running time 計費；需搭配 RDS、logs、load balancer、data transfer 看總成本。"],
      ["Amazon RDS pricing", "<a href=\"https://aws.amazon.com/rds/pricing/\">RDS pricing</a>", "RDS 成本包含 instance、storage、I/O、backup、data transfer；production team 才應承擔完整雲端資料層。"],
      ["AWS data transfer pricing", "<a href=\"https://aws.amazon.com/ec2/pricing/on-demand/#Data_Transfer\">Data transfer pricing</a>", "AWS egress 與跨區流量會變成成本風險；自動化傳大檔或 binary data 時要特別估算。"],
      ["Amazon Lightsail pricing", "<a href=\"https://aws.amazon.com/lightsail/pricing/\">Lightsail pricing</a>", "Lightsail 提供比較固定的 VPS 套餐；適合作為簡單 VPS 路線對照，但仍需自行維運 Docker、backup、安全更新。"]
    ],
    "week18-source-table"
  );

  addPage("Chapter 18 · Section 18.2", "官方來源核對 I", `<section class="chapter-section full"><div class="section-number">18.2</div><div><h3>n8n Docker、scaling、queue、execution data</h3>${sourceRowsA}</div></section>`);
  addPage("Chapter 18 · Section 18.2 continued", "官方來源核對 II", `<section class="chapter-section full"><div class="section-number">18.2</div><div><h3>binary data、external storage、logging、monitoring</h3>${sourceRowsB}</div></section>`);
  addPage("Chapter 18 · Section 18.2 continued", "官方來源核對 III", `<section class="chapter-section full"><div class="section-number">18.2</div><div><h3>Render、Railway、Fly、Cloud Run</h3>${sourceRowsC}</div></section>`);
  addPage("Chapter 18 · Section 18.2 continued", "官方來源核對 IV", `<section class="chapter-section full"><div class="section-number">18.2</div><div><h3>AWS Fargate、RDS、data transfer、Lightsail</h3>${sourceRowsD}</div></section>`);

  const recommendationRowsA = renderReportTable(
    ["User type", "首選", "替代方案", "避免事項"],
    [
      ["beginner", "n8n Cloud", "Local Docker Desktop for learning volume, credentials, and workflow export behavior", "<ul><li>public tunnel as production</li><li>self-hosted VPS with real client credentials before backup and security are understood</li><li>AWS, Kubernetes, or queue mode as the first deployment</li></ul>"],
      ["freelancer", "Single VPS with Docker Compose, PostgreSQL, Caddy, backup, and patch cadence", "Railway, Render, or Fly with managed PostgreSQL；n8n Cloud when the client pays for low operations", "<ul><li>free tier production</li><li>usage-priced platform without monthly budget alerts</li><li>AWS ECS/RDS or Kubernetes for a small client workflow</li><li>single Docker container without PostgreSQL backup</li></ul>"],
      ["agency", "Standardized client blueprint using isolated Compose or PaaS instances, managed PostgreSQL, backup, patch cadence, and incident notes", "n8n Cloud Business or Enterprise for low-operations client delivery", "<ul><li>multiple clients on one unisolated instance</li><li>shared credentials across clients</li><li>manual one-off deployments without a runbook</li><li>usage-priced platform without per-client budget ownership</li></ul>"],
      ["production team", "AWS or GCP production architecture with managed PostgreSQL, Redis queue, workers, centralized logs, IaC, budgets, and on-call", "n8n Cloud Enterprise or mature PaaS with managed database and Redis during transition", "<ul><li>single VM for high-SLO workloads</li><li>queue mode without centralized logs and DB capacity planning</li><li>autoscaling without maximum instance limits and budget alerts</li><li>production platform without RPO, RTO, and security review</li></ul>"]
    ],
    "week18-recommend-table"
  );

  addPage(
    "Chapter 18 · Section 18.3",
    "交付物一：deployment recommendation matrix I",
    `
      <section class="chapter-section full">
        <div class="section-number">18.3</div>
        <div>
          <h3>四類 user type 的首選、替代、避免事項</h3>
          ${recommendationRowsA}
        </div>
      </section>
    `
  );

  const recommendationRowsB = renderReportTable(
    ["User type", "為什麼", "成本風險", "維運責任"],
    [
      ["beginner", "The beginner should learn automation semantics before owning hosting, backups, public URLs, secure cookies, and database operations.", "Subscription cost is easier to understand than variable infrastructure cost；主要風險是 workflows 還沒證明價值前就 overbuying。", "<ul><li>workflow design</li><li>credential hygiene</li><li>basic execution review</li></ul>"],
      ["freelancer", "The freelancer needs a clear client bill, predictable maintenance scope, and a deployment that can be restored without a platform team.", "VPS is mostly fixed but labor-heavy；PaaS is faster but RAM, CPU, storage, egress, and database plan can drift.", "<ul><li>patching</li><li>backup and restore drill</li><li>Caddy or proxy configuration</li><li>incident response</li><li>client cost explanation</li></ul>"],
      ["agency", "The agency optimizes for repeatability, client isolation, handoff, and maintenance margins rather than a single lowest monthly bill.", "最大風險是 many small incidents 的 hidden labor；per-client budgets、support terms、standardized restore drills 比少一點 compute 更重要。", "<ul><li>client isolation</li><li>maintenance retainer</li><li>backup evidence</li><li>patch cadence</li><li>incident notes</li><li>budget alerts</li></ul>"],
      ["production team", "The production team has compliance, private networking, IAM, SLO, queue workers, logs, and disaster recovery requirements that justify cloud architecture complexity.", "AWS and GCP cost is a stack total：compute, RDS, Redis, logs, load balancer, NAT, egress, backup, storage, support, and operations labor.", "<ul><li>IaC</li><li>FinOps</li><li>on-call</li><li>RPO/RTO</li><li>security review</li><li>centralized observability</li><li>capacity planning</li></ul>"]
    ],
    "week18-recommend-table"
  );

  addPage(
    "Chapter 18 · Section 18.3 continued",
    "交付物一：deployment recommendation matrix II",
    `
      <section class="chapter-section full">
        <div class="section-number">18.3</div>
        <div>
          <h3>why、costRisk、operationalResponsibility</h3>
          ${recommendationRowsB}
        </div>
      </section>
    `
  );

  const firstNinetyRows = renderReportTable(
    ["User type", "first 90 days"],
    [
      ["beginner", "<ul><li>Build workflows on n8n Cloud or local Docker</li><li>Export important workflows weekly</li><li>Document credentials and owners</li><li>Avoid public self-hosting until backup and restore are practiced</li></ul>"],
      ["freelancer", "<ul><li>Use PostgreSQL rather than SQLite for paid work</li><li>Set <code>WEBHOOK_URL</code> and HTTPS correctly</li><li>Schedule monthly update windows</li><li>Add storage and execution pruning alerts</li></ul>"],
      ["agency", "<ul><li>Define one supported blueprint per client tier</li><li>Separate each client database and encryption key</li><li>Price maintenance hours explicitly</li><li>Use Week 17 incident note for every incident</li></ul>"],
      ["production team", "<ul><li>Define RPO and RTO</li><li>Implement centralized logs and metrics</li><li>Set budgets and anomaly alerts</li><li>Run restore drill</li><li>Load-test queue workers before production cutover</li></ul>"]
    ],
    "week18-first90-table"
  );

  addPage(
    "Chapter 18 · Section 18.3 continued",
    "交付物一：前 90 天行動",
    `
      <section class="chapter-section full">
        <div class="section-number">18.3</div>
        <div>
          <h3>first90Days：把選型落到第一季</h3>
          <p class="section-lead">選平台不是一次性答案。前 90 天要用 export、backup、restore drill、budget alert、incident note、logs、metrics，把「我選了這個平台」變成「我能維運這條路線」。</p>
          ${firstNinetyRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 18 · Section 18.3 continued",
    "交付物一：選型流程圖",
    `
      <section class="chapter-section">
        <div class="section-number">18.3</div>
        <div>
          <h3>從維運 owner 走到平台</h3>
          <div class="week18-decision-flow">
            <div><span>1</span><strong>Who owns operations?</strong><p>沒有 ops owner 時先選 n8n Cloud。</p></div>
            <div><span>2</span><strong>Need fixed client cost?</strong><p>需要清楚報價時優先 VPS Compose。</p></div>
            <div><span>3</span><strong>Need fast managed deploy?</strong><p>可選 Railway、Render、Fly 加 managed PostgreSQL。</p></div>
            <div><span>4</span><strong>Need VPC/IAM/compliance?</strong><p>需求跨過 maturity gate 後才進 AWS/GCP。</p></div>
            <div><span>5</span><strong>Can you operate queue?</strong><p>Redis workers、centralized logs、RPO/RTO 要有人負責。</p></div>
            <div><span>6</span><strong>Document the decision</strong><p>把成本、avoid list、90 天行動寫進 handoff。</p></div>
          </div>
          <div class="tip-callout">
            <strong>讀圖方式</strong>
            <p>先問 owner，再問成本模型，最後才問平台名稱。只要沒有 backup、security、scaling、troubleshooting 的 owner，平台越強大，事故面也越大。</p>
          </div>
        </div>
      </section>
    `
  );

  const quickRows = renderReportTable(
    ["User type", "30 秒建議"],
    [
      ["beginner", "先用 n8n Cloud；只在本機 Docker 學 state、volume、credentials，不要自己公開 production。"],
      ["freelancer", "有基本 Linux/Docker 能力就用 VPS Compose；若不想維護 VM，就用 PaaS 但設 monthly budget、backup、DB storage alert。"],
      ["agency", "建立一份標準交付藍圖，每個客戶獨立 instance、獨立 DB、獨立 credentials、獨立 backup；不要把多客戶塞進同一個省錢 instance。"],
      ["production team", "用 AWS/GCP 不是因為高級，而是因為你真的需要 VPC/IAM/audit/logging/queue/worker/DR；若沒有這些需求，PaaS 或 n8n Cloud 更理性。"]
    ],
    "week18-quick-table"
  );

  addPage(
    "Chapter 18 · Section 18.3 continued",
    "交付物一：四類使用者決策摘要",
    `
      <section class="chapter-section full">
        <div class="section-number">18.3</div>
        <div>
          <h3>30 秒推薦答案</h3>
          ${quickRows}
          <div class="week18-user-map">
            <div><strong>Learning</strong><span>Cloud / Local</span></div>
            <div><strong>Paid client</strong><span>VPS / PaaS</span></div>
            <div><strong>Repeatable delivery</strong><span>Blueprint / Enterprise</span></div>
            <div><strong>Production operations</strong><span>Hyperscaler / Enterprise</span></div>
          </div>
        </div>
      </section>
    `
  );

  const costTypeRows = renderReportTable(
    ["類型", "說明", "常見失控點"],
    [
      ["Fixed baseline", "即使沒有 executions 也會付的費用。", "VPS、RDS instance、Redis instance、persistent disk、support plan。"],
      ["Usage variable", "用量增加才上升的費用。", "CPU/RAM runtime、egress、request count、storage growth、logs ingestion、object storage operations。"],
      ["Human operations", "人工維護與事故處理成本。", "patch、backup restore、incident response、security review、client support。"]
    ],
    "week18-cost-table"
  );

  addPage(
    "Chapter 18 · Section 18.4",
    "交付物二：cost-risk worksheet I",
    `
      <section class="chapter-section full">
        <div class="section-number">18.4</div>
        <div>
          <h3>成本風險三層</h3>
          ${costTypeRows}
          <div class="week18-cost-stack">
            <div><span>01</span><strong>Fixed baseline</strong><p>服務還沒忙也要付。</p></div>
            <div><span>02</span><strong>Usage variable</strong><p>RAM、CPU、storage、egress 隨量漂移。</p></div>
            <div><span>03</span><strong>Human operations</strong><p>人的維運時間常比雲端帳單更貴。</p></div>
          </div>
          <p class="section-lead">成本 worksheet 的功能不是做精準報價，而是防止漏算：app 看起來便宜，但 DB、backup、logs、egress、Redis、load balancer、support、maintenance hours 才是長期責任。</p>
        </div>
      </section>
    `
  );

  const riskRowsA = renderReportTable(
    ["成本項", "風險", "控制方式"],
    [
      ["App RAM", "workflow 讀大 payload、binary data in memory、並行 executions。", "限制 concurrency、拆 workflow、設定 binary data mode、監控 memory high-water mark。"],
      ["App CPU", "大量 transformation、code node、PDF/image processing、crypto/API batching。", "將重工作排程化、queue workers、限制 execution timeout、觀察 CPU throttling。"],
      ["DB compute", "execution history、credentials、workflow metadata、queue workers 共用 DB。", "PostgreSQL first、connection pool、execution pruning、slow query 與 readiness monitoring。"],
      ["DB storage", "保存太多 success executions、大量 binary metadata、backup snapshots。", "retention policy、pruning、storage alert、定期 restore drill。"],
      ["Object storage", "binary data、attachments、workflow generated files。", "lifecycle policy、檔案大小限制、避免無限保存 debug artifacts。"],
      ["Egress", "webhook 回傳大檔、跨區傳輸、第三方 API 同步大量資料。", "設 response size policy、避免跨區 DB/app、評估 CDN 或直接讓 client 拉檔。"]
    ],
    "week18-cost-table"
  );

  const riskRowsB = renderReportTable(
    ["成本項", "風險", "控制方式"],
    [
      ["Logs", "debug level 長期開啟、多 workers、多 requests。", "incident 才短期 debug、JSON logs、retention days、sampling。"],
      ["Autoscaling", "scale-to-zero 或 horizontal scale 沒有上限。", "設 max instances、monthly budget alerts、queue backlog 門檻。"],
      ["Redis/queue", "worker 增加造成 DB connections 與 Redis plan 升級。", "worker concurrency、DB pool、queue metrics、Redis memory alert。"],
      ["Public IPv4/LB", "cloud load balancer、公網 IP、TLS endpoint。", "小案用 Caddy/VPS/PaaS managed endpoint；production 才上雲端 LB。"],
      ["Backup", "DB backup、volume snapshot、object storage versioning。", "決定 RPO/RTO、保留週期、restore drill，不只看備份大小。"],
      ["Support and SLO", "商業支援、on-call、incident SLA。", "把支援成本寫進報價，不把 response time 當免費承諾。"]
    ],
    "week18-cost-table"
  );

  addPage("Chapter 18 · Section 18.4 continued", "交付物二：RAM/CPU/storage/egress 風險 I", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>App、DB、object storage、egress</h3>${riskRowsA}</div></section>`);
  addPage("Chapter 18 · Section 18.4 continued", "交付物二：RAM/CPU/storage/egress 風險 II", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>logs、autoscaling、queue、LB、backup、support</h3>${riskRowsB}</div></section>`);

  addPage(
    "Chapter 18 · Section 18.4 continued",
    "交付物二：最低估算公式",
    `
      <section class="chapter-section">
        <div class="section-number">18.4</div>
        <div>
          <h3>monthly_total 的最低拆法</h3>
          ${renderCodeBlock(`
monthly_total =
  app_compute_baseline
  + db_compute_baseline
  + persistent_storage
  + backup_storage
  + object_storage
  + egress
  + logs_and_metrics
  + redis_or_queue
  + public_endpoint_or_load_balancer
  + support_plan
  + maintenance_hours
          `, "week18-formula")}
          <div class="tip-callout">
            <strong>公式重點</strong>
            <p>PaaS 的表面月費常常沒有包含全部 variable；AWS 的服務單價也不是總價。RDS、CloudWatch、NAT/LB、data transfer、backup、Redis、on-call 都要一起看。</p>
          </div>
        </div>
      </section>
    `
  );

  const csvRowsA = renderReportTable(
    ["category", "cost_driver", "applies_to", "risk", "how_it_surprises", "control", "evidence"],
    [
      ["app_ram", "RAM allocated or consumed by the n8n process", "PaaS, Cloud Run, AWS Fargate, VPS", "high", "Large payloads, binary data, and concurrent executions can force a bigger instance or higher memory allocation", "Set concurrency limits, move binary data out of memory, split workflows, monitor memory high-water mark", "memory chart, execution size, binary data mode"],
      ["app_cpu", "vCPU allocation, CPU seconds, or burst CPU", "PaaS, Cloud Run, AWS Fargate, VPS", "medium", "Code nodes, transformations, PDF/image work, and high concurrency can increase runtime cost or require larger compute", "Schedule heavy jobs, use queue workers only after Week 16 gates, cap autoscaling", "CPU chart, slow workflow list, queue backlog"],
      ["db_compute", "Managed PostgreSQL instance size or database service tier", "PaaS, AWS RDS, Cloud SQL, self-managed Postgres", "high", "The app may be cheap while the database tier becomes the real baseline cost", "Right-size DB, monitor connections, use connection pool, review slow queries", "DB instance tier, connection count, readiness history"],
      ["db_storage", "Execution data, workflow metadata, credential metadata, indexes", "All production deployments", "high", "Saved success executions and binary metadata grow quietly until storage or performance degrades", "execution pruning, retention policy, storage alerts, restore drill", "DB storage graph, pruning settings, backup size"]
    ],
    "week18-csv-table"
  );

  const csvRowsB = renderReportTable(
    ["category", "cost_driver", "applies_to", "risk", "how_it_surprises", "control", "evidence"],
    [
      ["backup_storage", "Database backups, volume snapshots, object versioning", "VPS, PaaS, AWS, GCP", "medium", "Backups are often omitted in cheap estimates but required for production RPO/RTO", "Define retention windows, test restore, separate hot and archive backups", "backup schedule, restore proof, retention policy"],
      ["object_storage", "External storage for binary data and generated files", "AWS S3, GCS, PaaS add-ons, n8n external storage", "medium", "Attachments and workflow-generated files can grow independently of DB size", "Lifecycle rules, file size policy, storage alerts", "bucket size, lifecycle policy, object count"],
      ["egress", "Outbound bandwidth to users, third-party APIs, or cross-region services", "Cloud Run, AWS, Fly, Render, Railway, VPS", "high", "Large webhook responses, binary downloads, or cross-region traffic can make a small app expensive", "Avoid cross-region app/DB, cap response size, budget alerts, direct-to-object-storage links", "egress graph, region map, large response audit"],
      ["logs", "Log ingestion, retention, and search", "AWS CloudWatch, GCP Logging, PaaS logs, centralized logging", "medium", "Debug logs left on in production create log cost and noise", "Use info level by default, short debug windows, retention rules, structured JSON logs", "log volume, retention days, log level"]
    ],
    "week18-csv-table"
  );

  const csvRowsC = renderReportTable(
    ["category", "cost_driver", "applies_to", "risk", "how_it_surprises", "control", "evidence"],
    [
      ["metrics_alerts", "Monitoring service and alerting volume", "Production PaaS, AWS, GCP, self-hosted Prometheus", "medium", "More workers and services create more metrics and alert paths", "Monitor only actionable signals, define owner and severity", "alert list, dashboard, owner map"],
      ["redis_queue", "Redis service, memory, persistence, worker connectivity", "Queue mode deployments", "high", "Adding workers creates a Redis baseline cost and can force DB connection upgrades", "Use queue mode only after Week 16 gates, monitor Redis memory and queue metrics", "Redis plan, queue metrics, worker count"],
      ["queue_workers", "Additional worker processes and their CPU/RAM", "Queue mode, AWS Fargate, Cloud Run jobs, PaaS workers", "high", "Horizontal workers increase compute and DB pressure together", "Set worker concurrency, DB pool, max replicas, autoscaling limits", "worker logs, DB connections, queue backlog"],
      ["autoscaling", "Scale-to-zero, max instances, or horizontal replicas", "Cloud Run, AWS, Fly, Render, Railway", "high", "Autoscaling can protect availability but multiply compute, DB, logs, and egress cost", "Set max instances, budget alerts, load test before raising limits", "max instance setting, budget alert, load-test result"]
    ],
    "week18-csv-table"
  );

  const csvRowsD = renderReportTable(
    ["category", "cost_driver", "applies_to", "risk", "how_it_surprises", "control", "evidence"],
    [
      ["persistent_disk", "Volume or disk attached to app or database", "VPS, Render, Fly, self-managed DB", "medium", "A cheap app plan may not include durable disk or disk expansion can be manual", "Use managed DB where possible, monitor disk, document volume restore", "disk size, mount path, snapshot proof"],
      ["public_endpoint_lb", "Load balancer, public IPv4, TLS endpoint, static IP", "AWS, GCP, VPS, PaaS", "medium", "Small apps can pay nontrivial baseline for LB or public network resources", "Use simpler managed endpoint for small cases, share only where isolation remains safe", "LB config, certificate, DNS record"],
      ["support_plan", "Vendor support, paid SLA, enterprise features", "n8n Cloud, AWS, GCP, PaaS", "medium", "Support expectations may be promised to clients without being priced", "Match client SLA to paid support and maintenance contract", "support plan, SLA, client contract"],
      ["maintenance_labor", "Patch, backup, incident response, security review", "All self-hosted and semi-managed routes", "high", "Human time can exceed infrastructure bill, especially for agencies and freelancers", "Retainer, update windows, incident note discipline, standard blueprint", "hours log, patch calendar, incident notes"]
    ],
    "week18-csv-table"
  );

  const csvRowsE = renderReportTable(
    ["category", "cost_driver", "applies_to", "risk", "how_it_surprises", "control", "evidence"],
    [
      ["security_compliance", "SSO, audit logs, private networking, secrets management", "Agency and production deployments", "high", "Compliance requirements can force enterprise plans or hyperscaler architecture", "Decide compliance boundary before platform choice", "security requirements, audit needs, secret inventory"],
      ["vendor_lock_in", "Platform-specific deploy model, databases, secrets, networking", "PaaS, AWS, GCP, n8n Cloud", "medium", "Migration later can require DNS, env, DB, storage, credentials, and OAuth changes", "Keep workflow exports, DB backups, env inventory, migration runbook", "export date, backup date, env inventory"],
      ["client_isolation", "Per-client instance, DB, credentials, domains, logs", "Agency deployments", "high", "Saving money by sharing instances creates privacy and blast-radius risk", "One client per instance or strict tenant boundary, separate backups and keys", "client map, instance id, DB id, encryption key owner"],
      ["free_tier_limits", "Free service sleep, low resources, usage caps, deleted inactive resources", "Render, Railway, Fly, Cloud free tiers", "high", "Free tiers are learning tools; production webhooks may sleep, throttle, or hit caps", "Use paid plans for production, define uptime and support expectations", "plan name, sleep behavior, uptime proof"]
    ],
    "week18-csv-table"
  );

  addPage("Chapter 18 · Section 18.4 continued", "交付物二：cost-risk worksheet CSV I", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>app 與 database 成本項</h3>${csvRowsA}</div></section>`);
  addPage("Chapter 18 · Section 18.4 continued", "交付物二：cost-risk worksheet CSV II", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>backup、object storage、egress、logs</h3>${csvRowsB}</div></section>`);
  addPage("Chapter 18 · Section 18.4 continued", "交付物二：cost-risk worksheet CSV III", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>metrics、Redis、workers、autoscaling</h3>${csvRowsC}</div></section>`);
  addPage("Chapter 18 · Section 18.4 continued", "交付物二：cost-risk worksheet CSV IV", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>disk、endpoint、support、maintenance</h3>${csvRowsD}</div></section>`);
  addPage("Chapter 18 · Section 18.4 continued", "交付物二：cost-risk worksheet CSV V", `<section class="chapter-section full"><div class="section-number">18.4</div><div><h3>security、lock-in、client isolation、free tier</h3>${csvRowsE}</div></section>`);

  const defaultRows = renderReportTable(
    ["Situation", "Default"],
    [
      ["Learning and early automation", "n8n Cloud or Local Docker Desktop"],
      ["First paid client", "VPS Docker Compose + PostgreSQL, or PaaS + managed PostgreSQL"],
      ["Repeatable agency delivery", "Standardized isolated client blueprint"],
      ["Production platform team", "AWS/GCP with managed PostgreSQL, Redis queue, centralized logs, IaC, budgets, and on-call"]
    ],
    "week18-memo-table"
  );

  addPage(
    "Chapter 18 · Section 18.5",
    "交付物三：AWS vs PaaS decision memo I",
    `
      <section class="chapter-section full">
        <div class="section-number">18.5</div>
        <div>
          <h3>Decision：預設從 simpler cloud options 開始</h3>
          <p class="section-lead">Use simpler cloud options by default. Choose AWS or GCP only when the workload, team, compliance, networking, and operations maturity justify the extra moving parts.</p>
          ${defaultRows}
          <div class="week18-maturity-grid">
            <div><span>Learning</span><strong>Cloud or Local</strong></div>
            <div><span>First paid automation</span><strong>VPS or PaaS</strong></div>
            <div><span>Repeatable delivery</span><strong>Blueprint</strong></div>
            <div><span>Production operations</span><strong>AWS/GCP</strong></div>
          </div>
        </div>
      </section>
    `
  );

  const paasAdvantageRows = renderReportTable(
    ["Advantage", "Why it matters"],
    [
      ["Faster deployment", "Reduces setup time for freelancer and agency delivery."],
      ["Managed public endpoint", "Simplifies TLS, domain, and routing compared with raw VM networking."],
      ["Managed database options", "Reduces the chance that SQLite or unmanaged Postgres becomes the hidden production risk."],
      ["Lower cognitive load", "Fewer services to debug during Week 17-style incidents."],
      ["Easier client explanation", "Costs can be explained as app, database, storage, and usage rather than a large AWS bill of materials."]
    ],
    "week18-memo-table"
  );

  const paasRiskRows = renderReportTable(
    ["Risk", "Control"],
    [
      ["Usage-priced RAM/CPU/storage/egress drift", "Set monthly budgets, usage alerts, storage alerts, and max instance limits."],
      ["Free tier behavior", "Do not use free tier for production webhooks or client credentials."],
      ["Platform-specific migration", "Keep workflow exports, env inventory, PostgreSQL backups, and OAuth redirect documentation."],
      ["Limited low-level control", "Move to AWS/GCP only when private networking, IAM, queue workers, or compliance require it."]
    ],
    "week18-memo-table"
  );

  addPage("Chapter 18 · Section 18.5 continued", "交付物三：PaaS advantages", `<section class="chapter-section full"><div class="section-number">18.5</div><div><h3>Use PaaS when speed and lower cognitive load matter</h3>${paasAdvantageRows}</div></section>`);
  addPage("Chapter 18 · Section 18.5 continued", "交付物三：PaaS risks", `<section class="chapter-section full"><div class="section-number">18.5</div><div><h3>PaaS 的成本與遷移風險</h3>${paasRiskRows}</div></section>`);

  const awsAdvantageRows = renderReportTable(
    ["Advantage", "Why it matters"],
    [
      ["VPC and private networking", "Required for internal APIs, private DBs, and enterprise network boundaries."],
      ["IAM and audit controls", "Required for production teams with compliance and access governance."],
      ["Managed PostgreSQL and Redis", "Supports queue mode, HA, backup, and operational dashboards."],
      ["Centralized logs and metrics", "Supports SLO, incident response, and capacity planning."],
      ["Infrastructure as code", "Makes production changes reviewable and repeatable."]
    ],
    "week18-memo-table"
  );

  const awsRiskRows = renderReportTable(
    ["Risk", "Control"],
    [
      ["Cost stack complexity", "Estimate app compute, RDS, Redis, logs, LB, NAT, egress, backup, storage, support, and labor together."],
      ["More troubleshooting layers", "Require Week 17 incident process, centralized logs, and runbooks before production cutover."],
      ["Overengineering small workloads", "Keep small freelancer/client projects on VPS/PaaS unless compliance or networking proves otherwise."],
      ["Autoscaling bill shock", "Set max instances, queue thresholds, budget alerts, and anomaly detection before launch."]
    ],
    "week18-memo-table"
  );

  addPage("Chapter 18 · Section 18.5 continued", "交付物三：AWS/GCP advantages", `<section class="chapter-section full"><div class="section-number">18.5</div><div><h3>Use AWS/GCP when control is truly required</h3>${awsAdvantageRows}</div></section>`);
  addPage("Chapter 18 · Section 18.5 continued", "交付物三：AWS/GCP risks", `<section class="chapter-section full"><div class="section-number">18.5</div><div><h3>AWS/GCP 的複雜度與帳單風險</h3>${awsRiskRows}</div></section>`);

  const gateRows = renderReportTable(
    ["Gate", "Choose PaaS or VPS if", "Choose AWS/GCP if"],
    [
      ["Operations owner", "No dedicated cloud ops exists", "A production team owns IaC, on-call, and FinOps"],
      ["Networking", "Public HTTPS webhook is enough", "Private VPC, internal APIs, peering, or IAM boundaries are required"],
      ["Data layer", "Managed Postgres plan is enough", "RDS/Cloud SQL with explicit RPO/RTO and backup governance is required"],
      ["Scaling", "Single instance or simple worker process is enough", "Redis queue, worker pools, central logs, and separate webhook processors are required"],
      ["Cost model", "Client needs predictable simple billing", "Team can manage multi-service budgets and anomaly alerts"],
      ["Compliance", "Basic credential hygiene and backups are enough", "Audit, SSO, private networking, data residency, or formal review is required"]
    ],
    "week18-gate-table"
  );

  addPage(
    "Chapter 18 · Section 18.5 continued",
    "交付物三：Decision Gates",
    `
      <section class="chapter-section full">
        <div class="section-number">18.5</div>
        <div>
          <h3>何時留在 PaaS/VPS，何時進 AWS/GCP</h3>
          ${gateRows}
        </div>
      </section>
    `
  );

  const avoidAwsRows = renderReportTable(
    ["不要因為這個理由選 AWS", "更好的選擇"],
    [
      ["想看起來 enterprise", "n8n Cloud Business/Enterprise 或標準化 PaaS 交付更可靠。"],
      ["以為 AWS 一定便宜", "先把 RDS、egress、logs、LB、NAT、backup、maintenance hours 算進去。"],
      ["只有一兩個客戶 workflow", "VPS Compose 或 PaaS 比多服務 AWS 更好維護。"],
      ["還沒有 backup/restore drill", "Week 14 完成前，不要擴大平台複雜度。"],
      ["還沒有 troubleshooting runbook", "Week 17 完成前，AWS 只會增加排查層數。"]
    ],
    "week18-memo-table"
  );

  addPage("Chapter 18 · Section 18.5 continued", "交付物三：Do not choose AWS just because", `<section class="chapter-section full"><div class="section-number">18.5</div><div><h3>AWS 不是成熟的替代品，而是成熟之後的工具</h3>${avoidAwsRows}<div class="tip-callout"><strong>決策提醒</strong><p>AWS/GCP 的價值是 VPC/IAM/compliance/observability/managed state/queue/region/networking 的完整控制。沒有這些需求時，PaaS 的速度、少維運與較少基礎設施決策更符合課程主線。</p></div></div></section>`);

  const maturityRows = renderReportTable(
    ["Maturity", "Platform"],
    [
      ["Learning", "n8n Cloud 或 Local Docker Desktop。"],
      ["First paid automation", "VPS Compose + PostgreSQL 或 PaaS + managed PostgreSQL。"],
      ["Repeatable client delivery", "Standardized PaaS/VPS blueprint + backup + incident note + budget alerts。"],
      ["Production operations", "AWS/GCP + managed PostgreSQL + Redis queue + logs + IaC + budget + on-call。"]
    ],
    "week18-memo-table"
  );

  addPage(
    "Chapter 18 · Section 18.5 continued",
    "交付物三：Final Recommendation",
    `
      <section class="chapter-section full">
        <div class="section-number">18.5</div>
        <div>
          <h3>Recommendation by maturity</h3>
          ${maturityRows}
          <p class="section-lead">Beginner should use n8n Cloud. Freelancer should use VPS Compose or a small PaaS with managed PostgreSQL. Agency should standardize isolated client blueprints or use n8n Cloud Business/Enterprise. Production team should choose AWS/GCP only when they have the operational maturity to own managed state, queue mode, logs, budgets, and incident response.</p>
        </div>
      </section>
    `
  );

  const acceptanceRows = renderReportTable(
    ["User type", "首選", "替代方案", "避免事項"],
    [
      ["beginner", "n8n Cloud，因為先避開 hosting、backup、public URL、secure cookie、database 維運。", "Local Docker Desktop 學習 volume、credentials、workflow 匯出。", "public tunnel 當 production、自架 VPS 放真客戶 credentials、跳 AWS/Kubernetes。"],
      ["freelancer", "VPS Docker Compose + PostgreSQL + Caddy，成本固定、可控、容易向客戶說明。", "Railway/Render/Fly + managed PostgreSQL；或客戶願付時用 n8n Cloud。", "沒 backup 的單容器、free tier production、未設 budget 的 usage-priced 平台、AWS multi-service 起手。"],
      ["agency", "標準化 blueprint：每客戶獨立 instance、獨立 DB、backup、patch cadence、incident note。", "n8n Cloud Business/Enterprise，或 PaaS + managed DB 作為低維運交付。", "多客戶共用未隔離 instance、同一組 credentials、手工散裝部署、沒有維護合約。"],
      ["production team", "AWS/GCP production stack：managed PostgreSQL、Redis queue、workers、centralized logs、IaC、budget alerts。", "n8n Cloud Enterprise；或成熟 PaaS + managed DB/Redis 作為過渡。", "單台 VPS 承擔高 SLO、沒有 RPO/RTO、未控 autoscaling、無 logs/alerts 的 queue mode。"]
    ],
    "week18-acceptance-table"
  );

  addPage(
    "Chapter 18 · Section 18.6",
    "驗收：四類 user type 的首選、替代、避免事項",
    `
      <section class="chapter-section full">
        <div class="section-number">18.6</div>
        <div>
          <h3>四類使用者的最終選型</h3>
          ${acceptanceRows}
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成 deployment recommendation matrix", "通過", "第 18.3 節與 <code>week-18-deployment-recommendation-matrix.json</code>"],
      ["完成 cost-risk worksheet", "通過", "第 18.4 節與 <code>week-18-cost-risk-worksheet.csv</code>"],
      ["完成 AWS vs PaaS decision memo", "通過", "第 18.5 節與 <code>week-18-aws-vs-paas-decision-memo.md</code>"],
      ["beginner 有首選、替代、避免事項", "通過", "第 18.3、18.6 節"],
      ["freelancer 有首選、替代、避免事項", "通過", "第 18.3、18.6 節"],
      ["agency 有首選、替代、避免事項", "通過", "第 18.3、18.6 節"],
      ["production team 有首選、替代、避免事項", "通過", "第 18.3、18.6 節"],
      ["usage-priced 平台 RAM/CPU/storage/egress 風險已整理", "通過", "第 18.4 節"],
      ["AWS 與 simpler cloud options 已比較", "通過", "第 18.5 節"]
    ],
    "week18-completion-table"
  );

  addPage(
    "Chapter 18 · Section 18.7",
    "Week 18 完成檢查",
    `
      <section class="chapter-section full">
        <div class="section-number">18.7</div>
        <div>
          <h3>Week 18 完成檢查</h3>
          ${completionRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 18 · Section 18.8",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">18.8</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 19 會進入 Capstone：建立可複製部署作品。Week 18 的結論會變成作品包的入口選單：先選 user type，再套用對應 blueprint、成本 worksheet、incident note、backup checklist、security cadence。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 18 的成果，是把平台選型從「平台喜好」改成「維運責任、成本風險與成熟度門檻」。Capstone 不只要能部署，還要能交接給下一個維護者。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekNineteenChapter(week, startIndex) {
  const source = "docs/week-19-capstone-replicable-deployment-package.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["部署作品包", "完成", "<code>artifacts/week-19-capstone/deployment-package/</code>"],
      ["README-style handoff", "完成", "<code>artifacts/week-19-capstone/deployment-package/README.md</code>；本章 19.4"],
      ["final demo checklist", "完成", "<code>artifacts/week-19-capstone/deployment-package/final-demo-checklist.csv</code>；本章 19.7"],
      ["deployment package manifest", "完成", "<code>artifacts/week-19-capstone/week-19-deployment-package-manifest.json</code>；本章 19.3、19.4"],
      ["env template", "完成", "<code>artifacts/week-19-capstone/deployment-package/.env.template</code>；本章 19.5"],
      ["architecture、DNS/TLS notes、backup/update/troubleshooting", "完成", "本章 19.3、19.5、19.6 與作品包 runbooks"],
      ["Week 19 驗證腳本", "完成", "<code>scripts/verify-week-nineteen.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 19 · Week 19",
    "Capstone：建立可複製部署作品",
    `
      <div class="chapter-summary">
        <div class="week-icon">CAP</div>
        <div>
          <p class="kicker">19.1 本週交付總覽</p>
          <p>執行日期：2026-05-28。本週目標是把前 18 週學到的內容變成另一位同仁可以接手的部署作品包。主路線選擇 <strong>VPS Docker Compose + PostgreSQL + Caddy</strong>，實作結果包含 deployment package、README-style handoff、final demo checklist，以及 architecture、env template、DNS/TLS notes、backup/update/troubleshooting。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">19.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-19"
  );

  addPage(
    "Chapter 19 · Section 19.1 continued",
    "本週作品包主線",
    `
      <section class="chapter-section">
        <div class="section-number">19.1</div>
        <div>
          <h3>從 VPS 到 handoff 的完整交接路徑</h3>
          <div class="week19-flow">
            <div><strong>DNS</strong><span>n8n.example.com points to VPS</span></div>
            <div><strong>Caddy</strong><span>TLS and reverse proxy</span></div>
            <div><strong>n8n</strong><span>internal 5678</span></div>
            <div><strong>PostgreSQL</strong><span>internal 5432 and state</span></div>
            <div><strong>Runbooks</strong><span>backup · update · troubleshooting</span></div>
            <div><strong>Handoff</strong><span>README and final demo checklist</span></div>
          </div>
          <div class="tip-callout">
            <strong>Codex 小提示</strong>
            <p>Week 19 選 VPS Docker Compose + PostgreSQL + Caddy，不是因為它永遠最好，而是因為它最適合做成可複製作品：成本相對固定、架構容易理解、可以完整演示 DNS/TLS、persistent state、PostgreSQL、backup/restore、update、troubleshooting，也能自然接到 Week 20 的最終建議。</p>
          </div>
        </div>
      </section>
    `
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Docker self-hosting", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">Docker install</a>", "n8n 官方建議 Docker 適合多數 self-hosting；persistent volume 必須保存 <code>/home/node/.n8n</code>。"],
      ["Docker Compose setup", "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/docker-compose/\">Docker Compose setup</a>", "Compose 範例把 n8n data volume 視為 state；作品包用 Compose 固化 <code>n8n</code>、<code>postgres</code>、<code>caddy</code>。"],
      ["DigitalOcean Caddy route", "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/digital-ocean/\">DigitalOcean Caddy route</a>", "官方 Caddy 範例使用 <code>reverse_proxy n8n:5678</code>；作品包沿用 Caddy 作為 TLS reverse proxy。"],
      ["Webhook URL behind proxy", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Webhook URL</a>", "reverse proxy 後要設定 <code>WEBHOOK_URL</code>、<code>N8N_PROXY_HOPS=1</code> 與 <code>X-Forwarded-*</code> headers；作品包把它放入 env template 與 DNS/TLS notes。"]
    ],
    "week19-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["SSL setup", "<a href=\"https://docs.n8n.io/hosting/securing/set-up-ssl/\">SSL setup</a>", "production 要使用 HTTPS；Caddy 自動處理 TLS，n8n 內部仍以 <code>n8n:5678</code> 服務。"],
      ["Database settings", "<a href=\"https://docs.n8n.io/hosting/configuration/supported-databases-settings/\">Database settings</a>", "self-hosted 可使用 PostgreSQL；作品包使用 <code>DB_TYPE=postgresdb</code> 與 <code>DB_POSTGRESDB_*</code>。"],
      ["Custom encryption key", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/\">Custom encryption key</a>", "<code>N8N_ENCRYPTION_KEY</code> 是 credentials 可解密的關鍵；handoff 明確要求保存與交接。"],
      ["Update self-hosted n8n", "<a href=\"https://docs.n8n.io/hosting/installation/updating/\">Update self-hosted n8n</a>", "更新前要檢查 release notes、測試環境、備份；作品包提供 update runbook。"]
    ],
    "week19-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Logging", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/logging/\">Logging</a>", "作品包預設 <code>N8N_LOG_FORMAT=json</code>，incident 時可短期提高 log level。"],
      ["Monitoring", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/monitoring/\">Monitoring</a>", "作品包用 <code>/healthz</code> 與 <code>/healthz/readiness</code> 做啟動與交接驗收。"],
      ["Execution data", "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>", "handoff 要說明 execution data retention 與 DB storage 風險。"],
      ["Binary data", "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data</a>", "作品包預設 <code>N8N_DEFAULT_BINARY_DATA_MODE=database</code>，避免把 binary data 放在 ephemeral memory。"]
    ],
    "week19-source-table"
  );

  addPage("Chapter 19 · Section 19.2", "官方來源核對 I", `<section class="chapter-section full"><div class="section-number">19.2</div><div><h3>Docker、Compose、Caddy、webhook URL</h3>${sourceRowsA}</div></section>`);
  addPage("Chapter 19 · Section 19.2 continued", "官方來源核對 II", `<section class="chapter-section full"><div class="section-number">19.2</div><div><h3>SSL、PostgreSQL、encryption key、update</h3>${sourceRowsB}</div></section>`);
  addPage("Chapter 19 · Section 19.2 continued", "官方來源核對 III", `<section class="chapter-section full"><div class="section-number">19.2</div><div><h3>logging、monitoring、execution data、binary data</h3>${sourceRowsC}</div></section>`);

  const routeRows = renderReportTable(
    ["決策", "選擇"],
    [
      ["User type", "freelancer / agency baseline，可被 production team 擴展。"],
      ["Primary route", "VPS Docker Compose + PostgreSQL + Caddy。"],
      ["Runtime", "Docker Compose 管理 <code>n8n</code>、<code>postgres</code>、<code>caddy</code>。"],
      ["Public endpoint", "Caddy 對外 80/443，自動 TLS，反代到 <code>n8n:5678</code>。"],
      ["State", "<code>postgres_data</code> 保存 PostgreSQL；<code>n8n_data</code> 保存 n8n local state 與設定檔。"],
      ["Secrets", "<code>.env</code> 由 <code>.env.template</code> 建立，必須安全保存 <code>N8N_ENCRYPTION_KEY</code> 與 DB password。"],
      ["Backup", "<code>pg_dump</code> + volume snapshot/export + env secret archive。"],
      ["Update", "backup -> pull image -> compose up -> readiness -> rollback path。"],
      ["Troubleshooting", "Week 17 的 <code>log -> env -> DNS -> proxy -> DB</code> 順序。"]
    ],
    "week19-route-table"
  );

  addPage(
    "Chapter 19 · Section 19.3",
    "主部署路線與架構",
    `
      <section class="chapter-section full">
        <div class="section-number">19.3</div>
        <div>
          <h3>Primary route：VPS Docker Compose + PostgreSQL + Caddy</h3>
          ${routeRows}
        </div>
      </section>
    `
  );

  addPage(
    "Chapter 19 · Section 19.3 continued",
    "Architecture map",
    `
      <section class="chapter-section">
        <div class="section-number">19.3</div>
        <div>
          <h3>作品包架構圖</h3>
          <div class="week19-architecture-map">
            <div><span>Public</span><strong>Browser or webhook provider</strong></div>
            <i>DNS</i>
            <div><span>Domain</span><strong>n8n.example.com</strong><p>A/AAAA to VPS public IP</p></div>
            <i>80/443</i>
            <div><span>Proxy</span><strong>Caddy container</strong><p>TLS and forwarded headers</p></div>
            <i>5678</i>
            <div><span>App</span><strong>n8n container</strong><p>internal service only</p></div>
            <div class="wide"><span>Database</span><strong>PostgreSQL container</strong><p><code>postgres_data</code> volume stores workflows, credentials metadata, executions, users, settings</p></div>
            <div class="wide"><span>Local state</span><strong>n8n_data volume</strong><p>settings and local files; must be included in restore evidence</p></div>
            <div class="wide"><span>TLS state</span><strong>caddy_data and caddy_config</strong><p>certificate state and Caddy configuration</p></div>
          </div>
        </div>
      </section>
    `
  );

  const manifestRows = renderReportTable(
    ["Manifest 欄位", "內容"],
    [
      ["primaryRoute", "VPS Docker Compose + PostgreSQL + Caddy"],
      ["acceptanceTarget", "A teammate can understand architecture, startup, backup, risks, and next steps by reading only the deployment package."],
      ["publicEntry", "DNS points <code>n8n.example.com</code> to the VPS public IP. Caddy owns ports 80 and 443."],
      ["reverseProxy", "Caddy terminates TLS and forwards traffic to <code>n8n:5678</code> inside the Docker network."],
      ["application", "n8n runs as a Docker Compose service with PostgreSQL database configuration."],
      ["database", "PostgreSQL stores workflows, credentials metadata, executions, users, and settings."],
      ["state", "<code>postgres_data</code> volume stores PostgreSQL data；<code>n8n_data</code> volume stores n8n local state and settings；<code>caddy_data</code> and <code>caddy_config</code> store TLS state and Caddy config。"],
      ["operations", "<code>backup-restore-runbook.md</code>、<code>update-runbook.md</code>、<code>troubleshooting-playbook.md</code>、<code>final-demo-checklist.csv</code>。"]
    ],
    "week19-manifest-table"
  );

  addPage(
    "Chapter 19 · Section 19.3 continued",
    "deployment package manifest",
    `
      <section class="chapter-section full">
        <div class="section-number">19.3</div>
        <div>
          <h3>Manifest：作品包可交接的定義</h3>
          ${manifestRows}
        </div>
      </section>
    `
  );

  const packageRows = renderReportTable(
    ["檔案", "用途", "接手者要知道什麼"],
    [
      ["<code>README.md</code>", "README-style handoff", "先讀這份，理解架構、啟動、備份、風險與下一步。"],
      ["<code>compose.yaml</code>", "Docker Compose runtime", "啟動 <code>postgres</code>、<code>n8n</code>、<code>caddy</code>，使用 named volumes 保存 state。"],
      ["<code>.env.template</code>", "env template", "建立 <code>.env</code> 的來源；不得提交真實 secrets。"],
      ["<code>Caddyfile</code>", "DNS/TLS reverse proxy", "對外 domain 綁 Caddy，內部反代 <code>n8n:5678</code>。"],
      ["<code>backup-restore-runbook.md</code>", "備份與還原", "說明 backup scope、pg_dump、volume、env secret、restore verification。"],
      ["<code>update-runbook.md</code>", "更新流程", "說明 update 前後檢查、rollback point、readiness 驗收。"],
      ["<code>troubleshooting-playbook.md</code>", "故障排除", "直接接 Week 17 的檢查順序與四個高風險情境。"],
      ["<code>final-demo-checklist.csv</code>", "期末展示清單", "逐項驗證架構、啟動方式、備份方式、風險與下一步。"]
    ],
    "week19-package-table"
  );

  addPage(
    "Chapter 19 · Section 19.4",
    "部署作品包內容",
    `
      <section class="chapter-section full">
        <div class="section-number">19.4</div>
        <div>
          <h3>8 個 handoff 必備檔案</h3>
          ${packageRows}
        </div>
      </section>
    `
  );

  const startupRows = renderReportTable(
    ["順序", "README Startup 步驟"],
    [
      ["1", "Provision a VPS with Docker Engine and Docker Compose installed."],
      ["2", "Point DNS <code>A</code> or <code>AAAA</code> record for <code>N8N_DOMAIN</code> to the VPS public IP."],
      ["3", "Open firewall ports <code>80</code> and <code>443</code>; do not expose <code>5678</code> publicly."],
      ["4", "Create <code>.env</code> from <code>.env.template</code>."],
      ["5", "Replace every <code>CHANGE_ME</code> value in <code>.env</code>, especially <code>POSTGRES_PASSWORD</code> and <code>N8N_ENCRYPTION_KEY</code>."],
      ["6", "Run <code>docker compose --env-file .env -f compose.yaml up -d</code>."],
      ["7", "Verify <code>docker compose ps</code>."],
      ["8", "Verify <code>https://N8N_DOMAIN/healthz</code> and <code>https://N8N_DOMAIN/healthz/readiness</code>."],
      ["9", "Create the owner account in the n8n UI."],
      ["10", "Create a test workflow and verify a webhook Production URL uses <code>https://N8N_DOMAIN/</code>."]
    ],
    "week19-startup-table"
  );

  addPage("Chapter 19 · Section 19.4 continued", "README handoff：Startup", `<section class="chapter-section full"><div class="section-number">19.4</div><div><h3>另一位同仁照做即可啟動</h3>${startupRows}</div></section>`);

  const readOrderRows = renderReportTable(
    ["順序", "最低閱讀動作"],
    [
      ["1", "讀 <code>README.md</code> 的 architecture summary。"],
      ["2", "檢查 <code>.env.template</code> 的 secrets 與 public URL。"],
      ["3", "對照 <code>compose.yaml</code> 確認 state volumes。"],
      ["4", "對照 <code>Caddyfile</code> 確認 DNS/TLS route。"],
      ["5", "跑 final demo checklist 的 dry run。"],
      ["6", "看 backup/update/troubleshooting runbooks，確認能交接給下一位維護者。"]
    ],
    "week19-readorder-table"
  );

  addPage(
    "Chapter 19 · Section 19.4 continued",
    "README handoff：最低閱讀順序",
    `
      <section class="chapter-section">
        <div class="section-number">19.4</div>
        <div>
          <h3>交接時不要從 compose 開始，而要從 owner 視角開始</h3>
          ${readOrderRows}
          <div class="tip-callout">
            <strong>交接提醒</strong>
            <p>README 的功能不是替代 runbook，而是讓接手者知道先讀什麼、哪些資料不能遺失、哪個 URL 是公開入口、哪個 volume 是 state、哪個 secret 會影響 credentials。</p>
          </div>
        </div>
      </section>
    `
  );

  const stateRows = renderReportTable(
    ["State", "Owner", "Backup requirement"],
    [
      ["PostgreSQL data", "<code>postgres_data</code> volume", "Required before update and at scheduled backup interval."],
      ["n8n local state", "<code>n8n_data</code> volume", "Required because settings and local files can affect restore."],
      ["Caddy state", "<code>caddy_data</code> and <code>caddy_config</code> volumes", "Required for stable TLS operations and proxy recovery."],
      ["Secrets", "<code>.env</code> and secret store", "Required because credentials depend on <code>N8N_ENCRYPTION_KEY</code>."]
    ],
    "week19-state-table"
  );

  const envRuleRows = renderReportTable(
    ["Rule", "Reason"],
    [
      ["Keep <code>N8N_ENCRYPTION_KEY</code> stable forever for this instance.", "Changing it breaks existing credential decryption."],
      ["Keep <code>WEBHOOK_URL=https://N8N_DOMAIN/</code>.", "Reverse proxy deployments need the public URL to generate correct webhook URLs."],
      ["Keep <code>N8N_PROXY_HOPS=1</code>.", "Caddy is the trusted proxy hop in this blueprint."],
      ["Keep <code>N8N_SECURE_COOKIE=true</code> in production.", "Public production access must use HTTPS cookies."],
      ["Keep <code>N8N_DEFAULT_BINARY_DATA_MODE=database</code> for this baseline.", "This makes binary behavior explicit and easier to back up with PostgreSQL."]
    ],
    "week19-envrule-table"
  );

  addPage("Chapter 19 · Section 19.4 continued", "README handoff：State Ownership", `<section class="chapter-section full"><div class="section-number">19.4</div><div><h3>state ownership 與 backup requirement</h3>${stateRows}</div></section>`);
  addPage("Chapter 19 · Section 19.4 continued", "README handoff：Environment Rules", `<section class="chapter-section full"><div class="section-number">19.4</div><div><h3>五條 production env 規則</h3>${envRuleRows}</div></section>`);

  const composeBlock = `name: n8n-capstone

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER} -d \${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 10

  n8n:
    image: \${N8N_IMAGE:-docker.n8n.io/n8nio/n8n:stable}
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_PORT: 5432
      DB_POSTGRESDB_DATABASE: \${POSTGRES_DB}
      DB_POSTGRESDB_USER: \${POSTGRES_USER}
      DB_POSTGRESDB_PASSWORD: \${POSTGRES_PASSWORD}
      N8N_HOST: \${N8N_DOMAIN}
      N8N_PROTOCOL: https
      N8N_PORT: 5678`;

  const composeBlockB = `      WEBHOOK_URL: https://\${N8N_DOMAIN}/
      N8N_EDITOR_BASE_URL: https://\${N8N_DOMAIN}/
      N8N_PROXY_HOPS: 1
      N8N_SECURE_COOKIE: "true"
      N8N_ENCRYPTION_KEY: \${N8N_ENCRYPTION_KEY}
      N8N_RUNNERS_ENABLED: "true"
      N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS: "true"
      N8N_DEFAULT_BINARY_DATA_MODE: database
      N8N_LOG_LEVEL: \${N8N_LOG_LEVEL:-info}
      N8N_LOG_OUTPUT: console
      N8N_LOG_FORMAT: json
      GENERIC_TIMEZONE: \${GENERIC_TIMEZONE}
      TZ: \${TZ}
    volumes:
      - n8n_data:/home/node/.n8n
    expose:
      - "5678"
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:5678/healthz >/dev/null 2>&1"]
      interval: 30s
      timeout: 5s
      retries: 10`;

  const composeBlockC = `  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    depends_on:
      n8n:
        condition: service_healthy
    environment:
      N8N_DOMAIN: \${N8N_DOMAIN}
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config

volumes:
  postgres_data:
  n8n_data:
  caddy_data:
  caddy_config:`;

  addPage("Chapter 19 · Section 19.4 continued", "compose.yaml I", `<section class="chapter-section full"><div class="section-number">19.4</div><div><h3>PostgreSQL 與 n8n 基礎 runtime</h3>${renderCodeBlock(composeBlock, "week19-codeblock")}</div></section>`);
  addPage("Chapter 19 · Section 19.4 continued", "compose.yaml II", `<section class="chapter-section full"><div class="section-number">19.4</div><div><h3>n8n public URL、security、logs、healthcheck</h3>${renderCodeBlock(composeBlockB, "week19-codeblock")}</div></section>`);
  addPage("Chapter 19 · Section 19.4 continued", "compose.yaml III", `<section class="chapter-section full"><div class="section-number">19.4</div><div><h3>Caddy 與 named volumes</h3>${renderCodeBlock(composeBlockC, "week19-codeblock")}</div></section>`);

  const envCategoryRows = renderReportTable(
    ["類別", "代表設定", "風險"],
    [
      ["Public URL", "<code>N8N_DOMAIN</code>、<code>WEBHOOK_URL</code>、<code>N8N_EDITOR_BASE_URL</code>", "wrong webhook URL、OAuth callback mismatch、secure cookie error。"],
      ["Database", "<code>POSTGRES_USER</code>、<code>POSTGRES_PASSWORD</code>、<code>DB_POSTGRESDB_*</code>", "database connection failed、DB restore mismatch。"],
      ["Encryption", "<code>N8N_ENCRYPTION_KEY</code>", "lost credentials；此值遺失會導致既有 credentials 無法可靠解密。"],
      ["Runtime", "<code>GENERIC_TIMEZONE</code>、<code>TZ</code>、<code>N8N_RUNNERS_ENABLED</code>", "schedule nodes、task execution、runtime consistency。"],
      ["Logs/security", "<code>N8N_LOG_FORMAT=json</code>、<code>N8N_SECURE_COOKIE=true</code>", "troubleshooting evidence、HTTPS session behavior。"]
    ],
    "week19-env-table"
  );

  addPage("Chapter 19 · Section 19.5", "env template、DNS/TLS notes", `<section class="chapter-section full"><div class="section-number">19.5</div><div><h3>.env.template 五類必填設定</h3>${envCategoryRows}</div></section>`);

  const envBlock = `N8N_DOMAIN=n8n.example.com
GENERIC_TIMEZONE=Asia/Taipei
TZ=Asia/Taipei

POSTGRES_USER=n8n
POSTGRES_PASSWORD=CHANGE_ME_LONG_RANDOM_POSTGRES_PASSWORD
POSTGRES_DB=n8n

N8N_ENCRYPTION_KEY=CHANGE_ME_64_CHARACTER_RANDOM_INSTANCE_KEY
N8N_IMAGE=docker.n8n.io/n8nio/n8n:stable
N8N_LOG_LEVEL=info

WEBHOOK_URL=https://n8n.example.com/
N8N_EDITOR_BASE_URL=https://n8n.example.com/
N8N_PROXY_HOPS=1
N8N_SECURE_COOKIE=true
N8N_DEFAULT_BINARY_DATA_MODE=database`;

  addPage(
    "Chapter 19 · Section 19.5 continued",
    ".env.template",
    `
      <section class="chapter-section full">
        <div class="section-number">19.5</div>
        <div>
          <h3>env template 全文</h3>
          ${renderCodeBlock(envBlock, "week19-codeblock")}
        </div>
      </section>
    `
  );

  const dnsRows = renderReportTable(
    ["項目", "規則"],
    [
      ["DNS", "<code>N8N_DOMAIN</code> 必須解析到 VPS public IP。"],
      ["Firewall", "VPS 必須開 80/443 給 Caddy；5678 不對外開。"],
      ["TLS", "Caddy 取得與更新 certificate；n8n 內部只接受 Caddy 反代。"],
      ["Proxy headers", "Caddy 要帶 <code>X-Forwarded-Proto</code>、<code>X-Forwarded-Host</code>、<code>X-Forwarded-For</code>。"],
      ["Webhook URL", "<code>WEBHOOK_URL=https://N8N_DOMAIN/</code> 必須與實際 HTTPS domain 一致。"]
    ],
    "week19-dns-table"
  );

  const caddyBlock = `{\$N8N_DOMAIN} {
    encode gzip zstd

    reverse_proxy n8n:5678 {
        flush_interval -1
        header_up X-Forwarded-Host {host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-For {remote_host}
    }
}`;

  addPage("Chapter 19 · Section 19.5 continued", "DNS/TLS notes", `<section class="chapter-section full"><div class="section-number">19.5</div><div><h3>DNS、Firewall、TLS、headers、Webhook URL</h3>${dnsRows}</div></section>`);
  addPage("Chapter 19 · Section 19.5 continued", "Caddyfile", `<section class="chapter-section full"><div class="section-number">19.5</div><div><h3>Caddyfile 全文</h3>${renderCodeBlock(caddyBlock, "week19-codeblock")}</div></section>`);

  const backupScopeRows = renderReportTable(
    ["Scope", "Required artifact"],
    [
      ["PostgreSQL", "Compressed <code>pg_dump</code> output."],
      ["n8n local state", "<code>n8n_data</code> Docker volume archive or host snapshot."],
      ["Caddy state", "<code>caddy_data</code> and <code>caddy_config</code> volume archive or host snapshot."],
      ["Secrets", "<code>.env</code> plus secret-store record for <code>N8N_ENCRYPTION_KEY</code> and <code>POSTGRES_PASSWORD</code>."],
      ["Documentation", "Current <code>README.md</code>, <code>compose.yaml</code>, <code>Caddyfile</code>, and runbooks."]
    ],
    "week19-runbook-table"
  );

  addPage("Chapter 19 · Section 19.6", "backup、update、troubleshooting 交接 I", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>Backup Scope</h3>${backupScopeRows}</div></section>`);

  const backupCommands = `mkdir -p backups
docker compose --env-file .env -f compose.yaml exec -T postgres \\
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" \\
  | gzip > "backups/n8n-postgres-$(date +%Y%m%d-%H%M%S).sql.gz"
docker compose --env-file .env -f compose.yaml ps > "backups/compose-status-$(date +%Y%m%d-%H%M%S).txt"
docker volume ls > "backups/docker-volumes-$(date +%Y%m%d-%H%M%S).txt"`;

  addPage("Chapter 19 · Section 19.6 continued", "Backup Commands", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>backup-restore-runbook.md：Backup Commands</h3>${renderCodeBlock(backupCommands, "week19-codeblock")}</div></section>`);

  const secretRows = renderReportTable(
    ["Secret", "Rule"],
    [
      ["<code>N8N_ENCRYPTION_KEY</code>", "Store in a managed secret store and include in restore drills."],
      ["<code>POSTGRES_PASSWORD</code>", "Store in a managed secret store and rotate only with a planned DB credential change."],
      ["<code>.env</code>", "Do not commit to source control; store encrypted with deployment records."]
    ],
    "week19-runbook-table"
  );

  const restoreRows = renderReportTable(
    ["順序", "Restore Order"],
    [
      ["1", "Provision a clean host with Docker and Docker Compose."],
      ["2", "Restore <code>compose.yaml</code>, <code>Caddyfile</code>, <code>.env</code>, and runbooks."],
      ["3", "Create Docker volumes or restore host volume snapshots."],
      ["4", "Start only PostgreSQL with <code>docker compose --env-file .env -f compose.yaml up -d postgres</code>."],
      ["5", "Restore the PostgreSQL dump into the <code>postgres</code> service."],
      ["6", "Start n8n and Caddy with <code>docker compose --env-file .env -f compose.yaml up -d</code>."],
      ["7", "Verify <code>https://N8N_DOMAIN/healthz</code>."],
      ["8", "Verify <code>https://N8N_DOMAIN/healthz/readiness</code>."],
      ["9", "Verify credentials can decrypt by running a known workflow that uses a saved credential."],
      ["10", "Verify a Production URL webhook reaches the expected workflow."]
    ],
    "week19-restore-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Secret Backup Rules", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>不能漏掉的 secrets</h3>${secretRows}</div></section>`);
  addPage("Chapter 19 · Section 19.6 continued", "Restore Order", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>restore 要按順序復原 state 與 credentials</h3>${restoreRows}</div></section>`);

  const restoreVerificationRows = renderReportTable(
    ["Check", "Pass condition"],
    [
      ["Container state", "<code>postgres</code>, <code>n8n</code>, and <code>caddy</code> are running."],
      ["Health", "<code>/healthz</code> returns 200."],
      ["Readiness", "<code>/healthz/readiness</code> returns 200."],
      ["Credentials", "Existing credential-backed workflow succeeds."],
      ["Webhook", "Production URL uses <code>https://N8N_DOMAIN/</code> and creates an execution."],
      ["Logs", "No database connection, encryption, cookie, or proxy errors in recent logs."]
    ],
    "week19-runbook-table"
  );

  const recoveryRiskRows = renderReportTable(
    ["Risk", "Prevention"],
    [
      ["Lost credentials", "Preserve the original <code>N8N_ENCRYPTION_KEY</code>."],
      ["Empty database", "Verify PostgreSQL dump size and restore output."],
      ["Wrong domain", "Verify DNS and <code>WEBHOOK_URL</code> before enabling production workflows."],
      ["Broken TLS", "Restore Caddy config and confirm ports 80/443 are reachable."]
    ],
    "week19-runbook-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Restore Verification", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>restore 完不是啟動而已，要驗證 credentials 與 webhook</h3>${restoreVerificationRows}</div></section>`);
  addPage("Chapter 19 · Section 19.6 continued", "Recovery Risks", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>restore 事故的預防點</h3>${recoveryRiskRows}</div></section>`);

  const updateChecklistRows = renderReportTable(
    ["Check", "Required evidence"],
    [
      ["Release notes reviewed", "Version being installed and breaking changes recorded."],
      ["Backup completed", "PostgreSQL dump, volume evidence, and <code>.env</code> secret archive exist."],
      ["Current version recorded", "<code>docker compose --env-file .env -f compose.yaml exec n8n n8n --version</code>."],
      ["Rollback image known", "Previous <code>N8N_IMAGE</code> tag recorded in the update note."],
      ["Maintenance window approved", "Owner and expected impact recorded."]
    ],
    "week19-runbook-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Update Policy 與 Pre-update Checklist", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>update 前一定先有 release notes、backup、rollback point</h3>${updateChecklistRows}</div></section>`);

  const updateStepRows = renderReportTable(
    ["Step", "動作"],
    [
      ["1", "Set <code>N8N_IMAGE</code> in <code>.env</code> to the target stable image tag."],
      ["2", "Run <code>docker compose --env-file .env -f compose.yaml pull n8n</code>."],
      ["3", "Run <code>docker compose --env-file .env -f compose.yaml up -d n8n</code>."],
      ["4", "Wait for <code>docker compose --env-file .env -f compose.yaml ps</code> to show n8n healthy."],
      ["5", "Check <code>https://N8N_DOMAIN/healthz</code>."],
      ["6", "Check <code>https://N8N_DOMAIN/healthz/readiness</code>."],
      ["7", "Run one manual workflow."],
      ["8", "Run one production webhook test."],
      ["9", "Review logs for database, migration, encryption, cookie, proxy, and credential errors."],
      ["10", "Record final version and update result."]
    ],
    "week19-update-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Update Steps", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>update-runbook.md：安全更新順序</h3>${updateStepRows}</div></section>`);

  const rollbackRows = renderReportTable(
    ["Step", "Rollback Steps"],
    [
      ["1", "Set <code>N8N_IMAGE</code> back to the previous image tag."],
      ["2", "Run <code>docker compose --env-file .env -f compose.yaml pull n8n</code>."],
      ["3", "Run <code>docker compose --env-file .env -f compose.yaml up -d n8n</code>."],
      ["4", "If migrations or data changes broke compatibility, stop n8n and restore the PostgreSQL dump."],
      ["5", "Verify <code>/healthz</code>, <code>/healthz/readiness</code>, credentials, and webhook execution."],
      ["6", "Record root cause in an incident note."]
    ],
    "week19-runbook-table"
  );

  const postUpdateRows = renderReportTable(
    ["Check", "Pass condition"],
    [
      ["n8n version", "Expected target version is running."],
      ["UI login", "Owner can log in through HTTPS."],
      ["Readiness", "<code>/healthz/readiness</code> returns 200."],
      ["Credentials", "Credential-backed workflow succeeds."],
      ["Webhook URL", "Production URL uses public HTTPS domain."],
      ["Logs", "No new startup or migration errors."]
    ],
    "week19-runbook-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Rollback Steps", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>rollback 要能回 image，也要能回 DB</h3>${rollbackRows}</div></section>`);
  addPage("Chapter 19 · Section 19.6 continued", "Post-update Verification", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>更新後驗收</h3>${postUpdateRows}</div></section>`);

  const updateRiskRows = renderReportTable(
    ["Risk", "Control"],
    [
      ["Breaking changes", "Read release notes and test first."],
      ["Migration failure", "Back up PostgreSQL before update."],
      ["Credential decrypt error", "Preserve <code>N8N_ENCRYPTION_KEY</code>."],
      ["Public URL regression", "Recheck <code>WEBHOOK_URL</code> and Caddy route after update."]
    ],
    "week19-runbook-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Update Risks", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>update 風險控制</h3>${updateRiskRows}</div></section>`);

  const fixedOrderRows = renderReportTable(
    ["Order", "Gate", "First action"],
    [
      ["1", "log", "Read <code>docker compose --env-file .env -f compose.yaml logs --since 30m</code>."],
      ["2", "env", "Compare <code>.env</code> with <code>.env.template</code> and secret-store records."],
      ["3", "DNS", "Confirm <code>N8N_DOMAIN</code> resolves to the VPS public IP."],
      ["4", "proxy", "Confirm Caddy owns 80/443 and reverse proxies to <code>n8n:5678</code>."],
      ["5", "DB", "Check <code>/healthz/readiness</code> and PostgreSQL logs."],
      ["6", "container", "Check <code>docker compose --env-file .env -f compose.yaml ps</code>."],
      ["7", "credentials", "Confirm <code>N8N_ENCRYPTION_KEY</code> matches the original instance key."],
      ["8", "OAuth", "Confirm OAuth Redirect URL uses the public HTTPS domain."],
      ["9", "security", "Confirm <code>N8N_SECURE_COOKIE=true</code> with HTTPS."],
      ["10", "resource", "Check memory, CPU, disk, DB storage, and binary data growth."],
      ["11", "queue", "Not enabled in this baseline; if added later, check Redis and workers."],
      ["12", "workflow", "Inspect failed execution and first failed node."]
    ],
    "week19-order-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Troubleshooting Fixed Check Order", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>log -> env -> DNS -> proxy -> DB，再往下排</h3>${fixedOrderRows}</div></section>`);

  const incidentRows = renderReportTable(
    ["Incident", "First check", "Repair direction"],
    [
      ["wrong webhook URL", "Compare editor Production URL, <code>WEBHOOK_URL</code>, <code>N8N_DOMAIN</code>, and Caddy route.", "Set <code>WEBHOOK_URL=https://N8N_DOMAIN/</code>, keep <code>N8N_PROXY_HOPS=1</code>, restart n8n, reactivate or re-register webhook."],
      ["lost credentials", "Confirm current <code>N8N_ENCRYPTION_KEY</code> matches original deployment secret.", "Restore the original key or restore DB and key from backup; recreate credentials only after confirming key loss."],
      ["database connection failed", "Check <code>/healthz/readiness</code>, PostgreSQL logs, and <code>DB_POSTGRESDB_*</code>.", "Fix DB host, database, user, password, Docker network, or SSL settings; restart n8n after DB is healthy."],
      ["secure cookie error", "Confirm user enters through HTTPS and Caddy passes the correct forwarded scheme.", "Keep production HTTPS, keep <code>N8N_SECURE_COOKIE=true</code>, fix Caddy/DNS/TLS rather than weakening cookie security."]
    ],
    "week19-incident-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Required Incident Cards", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>四個必考 incident</h3>${incidentRows}</div></section>`);

  const commonCommands = `docker compose --env-file .env -f compose.yaml ps
docker compose --env-file .env -f compose.yaml logs --since 30m n8n
docker compose --env-file .env -f compose.yaml logs --since 30m postgres
docker compose --env-file .env -f compose.yaml logs --since 30m caddy
curl -I "https://\${N8N_DOMAIN}/healthz"
curl -I "https://\${N8N_DOMAIN}/healthz/readiness"`;

  addPage("Chapter 19 · Section 19.6 continued", "Common Commands", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>troubleshooting-playbook.md：常用排查命令</h3>${renderCodeBlock(commonCommands, "week19-codeblock")}</div></section>`);

  const escalationRows = renderReportTable(
    ["Symptom", "Escalate to"],
    [
      ["DB cannot restore", "Backup owner and database maintainer."],
      ["Credentials cannot decrypt", "Secret owner and deployment owner."],
      ["TLS cannot renew", "DNS owner and VPS owner."],
      ["Memory or storage repeatedly exceeds limits", "Platform owner for Week 16 scaling review."],
      ["Client-facing outage exceeds SLA", "Incident owner and business owner."]
    ],
    "week19-runbook-table"
  );

  const preventionRows = renderReportTable(
    ["Risk", "Preventive action"],
    [
      ["wrong webhook URL", "Verify public URL after every DNS/proxy change."],
      ["lost credentials", "Store <code>N8N_ENCRYPTION_KEY</code> in the secret store and include it in restore drills."],
      ["database connection failed", "Keep DB env in one source of truth and monitor readiness."],
      ["secure cookie error", "Keep HTTPS enabled and test browser login after proxy changes."],
      ["noisy incidents", "Keep logs structured with <code>N8N_LOG_FORMAT=json</code>."]
    ],
    "week19-runbook-table"
  );

  addPage("Chapter 19 · Section 19.6 continued", "Escalation", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>何時升級給 owner</h3>${escalationRows}</div></section>`);
  addPage("Chapter 19 · Section 19.6 continued", "Prevention", `<section class="chapter-section full"><div class="section-number">19.6</div><div><h3>把 incident 變成預防規則</h3>${preventionRows}</div></section>`);

  const demoRowsA = renderReportTable(
    ["order", "demo_item", "expected_evidence", "pass_condition"],
    [
      ["1", "Show deployment package directory", "README.md, compose.yaml, .env.template, Caddyfile, runbooks, final-demo-checklist.csv", "Reviewer can see every package file"],
      ["2", "Explain chosen route", "VPS Docker Compose + PostgreSQL + Caddy", "Reviewer understands why this route was selected"],
      ["3", "Explain architecture", "DNS -> Caddy -> n8n -> PostgreSQL -> volumes", "Reviewer can identify public entry, app, database, and state"],
      ["4", "Explain env template", "N8N_DOMAIN, WEBHOOK_URL, N8N_ENCRYPTION_KEY, DB_POSTGRESDB_*", "Reviewer knows which values are secrets and which values are public URL settings"],
      ["5", "Explain DNS/TLS", "Caddy owns ports 80/443 and reverse proxies to n8n:5678", "Reviewer knows 5678 is not public"],
      ["6", "Explain startup", "docker compose --env-file .env -f compose.yaml up -d", "Reviewer can repeat the startup path"]
    ],
    "week19-demo-table"
  );

  const demoRowsB = renderReportTable(
    ["order", "demo_item", "expected_evidence", "pass_condition"],
    [
      ["7", "Explain health checks", "/healthz and /healthz/readiness", "Reviewer can distinguish reachable from DB-ready"],
      ["8", "Explain backup", "pg_dump, named volumes, Caddy state, .env, N8N_ENCRYPTION_KEY", "Reviewer knows what must be backed up"],
      ["9", "Explain restore", "restore DB, restore secrets, start services, verify health and credentials", "Reviewer can describe restore order"],
      ["10", "Explain update", "release notes, backup, pull image, up, readiness, rollback", "Reviewer can describe update and rollback"],
      ["11", "Explain troubleshooting", "log -> env -> DNS -> proxy -> DB", "Reviewer can start incident response in the correct order"]
    ],
    "week19-demo-table"
  );

  const demoRowsC = renderReportTable(
    ["order", "demo_item", "expected_evidence", "pass_condition"],
    [
      ["12", "Answer wrong webhook URL", "Check WEBHOOK_URL, N8N_DOMAIN, Caddy route, editor Production URL", "Reviewer hears first step and repair direction"],
      ["13", "Answer lost credentials", "Check original N8N_ENCRYPTION_KEY", "Reviewer hears why the key must be preserved"],
      ["14", "Answer database connection failed", "Check /healthz/readiness and DB_POSTGRESDB_*", "Reviewer hears first step and repair direction"],
      ["15", "Answer secure cookie error", "Check HTTPS, Caddy forwarded scheme, N8N_SECURE_COOKIE", "Reviewer hears first step and repair direction"],
      ["16", "Explain risks", "encryption key, webhook URL, DB, cookie, storage growth, update failure", "Reviewer can name top operational risks"],
      ["17", "Explain next steps", "n8n Cloud, PaaS, queue mode, AWS/GCP based on user type and maturity", "Reviewer can map future platform moves"]
    ],
    "week19-demo-table"
  );

  addPage("Chapter 19 · Section 19.7", "final demo checklist I", `<section class="chapter-section full"><div class="section-number">19.7</div><div><h3>展示作品包、路線、架構、env、DNS/TLS、startup</h3>${demoRowsA}</div></section>`);
  addPage("Chapter 19 · Section 19.7 continued", "final demo checklist II", `<section class="chapter-section full"><div class="section-number">19.7</div><div><h3>展示 health、backup、restore、update、troubleshooting</h3>${demoRowsB}</div></section>`);
  addPage("Chapter 19 · Section 19.7 continued", "final demo checklist III", `<section class="chapter-section full"><div class="section-number">19.7</div><div><h3>回答四個 incident、風險、下一步</h3>${demoRowsC}</div></section>`);

  const nextStepRows = renderReportTable(
    ["Trigger", "Next platform move"],
    [
      ["Beginner needs low operations", "Use n8n Cloud."],
      ["Freelancer needs faster deploy and less VM maintenance", "Use Railway, Render, or Fly with managed PostgreSQL and budgets."],
      ["Agency needs repeatability", "Turn this package into a client blueprint with separate instance, DB, key, backup, and incident notes per client."],
      ["Production team needs VPC, IAM, audit, queue workers, and RPO/RTO", "Move toward AWS/GCP or n8n Cloud Enterprise with managed state and centralized logs."]
    ],
    "week19-next-table"
  );

  addPage(
    "Chapter 19 · Section 19.7 continued",
    "README handoff：Next Steps",
    `
      <section class="chapter-section full">
        <div class="section-number">19.7</div>
        <div>
          <h3>展示最後要能回答「下一步去哪裡」</h3>
          ${nextStepRows}
        </div>
      </section>
    `
  );

  const readinessRows = renderReportTable(
    ["handoffReadiness", "說明"],
    [
      ["Architecture is visible in README.md and this manifest.", "接手者能從 README 與 manifest 看到 public entry、reverse proxy、application、database、state、operations。"],
      ["Startup path is documented with Docker Compose commands.", "接手者能照 <code>docker compose --env-file .env -f compose.yaml up -d</code> 啟動。"],
      ["Backup path covers PostgreSQL, volumes, Caddy state, and secrets.", "備份範圍涵蓋 DB、named volumes、TLS state、<code>.env</code>、<code>N8N_ENCRYPTION_KEY</code>。"],
      ["Risk section covers encryption key, wrong webhook URL, database connection, secure cookie, storage growth, and updates.", "Week 17 的 incident 類型已經被放回作品包風險清單。"],
      ["Next steps explain when to move toward PaaS, n8n Cloud, queue mode, or AWS/GCP.", "Week 18 的平台矩陣成為 Week 20 導入排序的入口。"]
    ],
    "week19-readiness-table"
  );

  addPage("Chapter 19 · Section 19.7 continued", "handoff readiness", `<section class="chapter-section full"><div class="section-number">19.7</div><div><h3>只看作品包也能接手的五個證據</h3>${readinessRows}</div></section>`);

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成部署作品包", "通過", "<code>artifacts/week-19-capstone/deployment-package/</code>"],
      ["完成 README-style handoff", "通過", "<code>deployment-package/README.md</code>"],
      ["完成 final demo checklist", "通過", "<code>deployment-package/final-demo-checklist.csv</code>"],
      ["選定一條主部署路線", "通過", "VPS Docker Compose + PostgreSQL + Caddy"],
      ["整理 architecture", "通過", "第 19.3 節與 package README"],
      ["整理 env template", "通過", "第 19.5 節與 <code>.env.template</code>"],
      ["整理 DNS/TLS notes", "通過", "<code>Caddyfile</code>、README、第 19.5 節"],
      ["整理 backup/update/troubleshooting", "通過", "第 19.6 節與三份 runbook"],
      ["另一位同仁只看作品包即可接手", "通過", "README + manifest + checklist 覆蓋架構、啟動、備份、風險、下一步"]
    ],
    "week19-completion-table"
  );

  addPage("Chapter 19 · Section 19.8", "Week 19 完成檢查", `<section class="chapter-section full"><div class="section-number">19.8</div><div><h3>Week 19 完成檢查</h3>${completionRows}</div></section>`);

  addPage(
    "Chapter 19 · Section 19.9",
    "下一週銜接",
    `
      <section class="chapter-section">
        <div class="section-number">19.9</div>
        <div>
          <h3>下一週銜接</h3>
          <p>Week 20 會做期末驗收與下一階段導入排序。Week 19 的作品包會成為 Week 20 的展示核心：先證明可交接，再提出 90 天維運節奏、平台升級路線與最後建議。</p>
          <div class="tip-callout">
            <strong>本週總結</strong>
            <p>Week 19 的成果不是一堆設定檔，而是一個可以被另一位同仁接手的部署作品包。它把前 18 週的 state、URL、PostgreSQL、Caddy、backup、update、troubleshooting、platform choice 都收束成一條可展示、可複製、可交接的路線。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekTwentyChapter(week, startIndex) {
  const source = "docs/week-20-final-acceptance-next-stage.md";
  const pages = [];
  const addPage = (chapterLabel, sectionTitle, body, id = "") => {
    pages.push(renderChapterShell(week, startIndex + pages.length, chapterLabel, sectionTitle, body, id));
  };

  const deliverables = renderReportTable(
    ["交付物", "狀態", "檔案或章節"],
    [
      ["最終建議報告", "完成", "<code>artifacts/week-20-final/final-recommendation-report.md</code>；本章 20.3"],
      ["90 天維運節奏", "完成", "<code>artifacts/week-20-final/week-20-90-day-maintenance-cadence.csv</code>；本章 20.4"],
      ["導入候選清單與 owner", "完成", "<code>artifacts/week-20-final/week-20-adoption-candidates-and-owners.csv</code>；本章 20.5"],
      ["3 小時成果交流 agenda", "完成", "<code>artifacts/week-20-final/week-20-three-hour-showcase-agenda.json</code>；本章 20.2"],
      ["Gate 05 final scorecard", "完成", "<code>artifacts/week-20-final/week-20-final-scorecard.json</code>；本章 20.6"],
      ["Week 20 驗證腳本", "完成", "<code>scripts/verify-week-twenty.mjs</code>"]
    ],
    "compact-table"
  );

  addPage(
    "Chapter 20 · Week 20",
    "期末驗收與下一階段導入排序",
    `
      <div class="chapter-summary">
        <div class="week-icon">FIN</div>
        <div>
          <p class="kicker">20.1 本週交付總覽</p>
          <p>執行日期：2026-05-28。本週目標是把 20 週部署能力轉成下一階段導入判斷。實作結果包含最終建議報告、90 天維運節奏、導入候選清單與 owner，並把期末驗收從「n8n 有跑」提升到能回答「為什麼選這條路、風險在哪、如何備份、如何更新、何時擴展」。</p>
        </div>
      </div>
      <section class="chapter-section">
        <div class="section-number">20.1</div>
        <div>
          <h3>本週交付物總覽</h3>
          ${deliverables}
        </div>
      </section>
      <p class="source-note">整合來源：<a href="../${source}">${source}</a></p>
    `,
    "week-20"
  );

  addPage(
    "Chapter 20 · Section 20.1 continued",
    "期末驗收主線",
    `
      <section class="chapter-section">
        <div class="section-number">20.1</div>
        <div>
          <h3>從 Week 19 作品包走到下一階段決策</h3>
          <div class="week20-flow">
            <div><strong>Week 19 package</strong><span>handoff-ready baseline</span></div>
            <div><strong>Final report</strong><span>recommended route and alternatives</span></div>
            <div><strong>90-day cadence</strong><span>owners, drills, audit, metrics</span></div>
            <div><strong>Adoption owners</strong><span>who acts next and when</span></div>
            <div><strong>Gate 05 scorecard</strong><span>why, risks, backup, update, scale</span></div>
            <div><strong>Rollout decision</strong><span>next-stage priority and evidence</span></div>
          </div>
          <div class="tip-callout">
            <strong>Codex 小提示</strong>
            <p>Week 20 的重點不是再多做一個部署，而是把前 19 週的所有證據整理成決策能力。最後要能向決策者說清楚：第一條路線是什麼、誰負責、哪些風險要先控、90 天內要驗收什麼、什麼條件才值得擴展。</p>
          </div>
        </div>
      </section>
    `
  );

  const sourceRowsA = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["n8n Cloud pricing and plan shape", "<a href=\"https://n8n.io/pricing/\">n8n pricing</a>", "n8n Cloud 以 workflow executions 估用量，並提供 Cloud/Self-hosted/Enterprise 等不同操作責任；beginner 與低維運團隊可優先評估。"],
      ["Docker self-hosting", "<a href=\"https://docs.n8n.io/hosting/installation/docker/\">Docker installation</a>", "self-hosting 需要技術能力，Docker 需要 persistent volume；不是只啟動容器就算 production。"],
      ["Docker Compose setup", "<a href=\"https://docs.n8n.io/hosting/installation/server-setups/docker-compose/\">Docker Compose setup</a>", "Compose route 可作為 VPS 作品包基礎，但 state、env、backup 要交接清楚。"],
      ["Webhook URL behind proxy", "<a href=\"https://docs.n8n.io/hosting/configuration/configuration-examples/webhook-url/\">Webhook URL behind proxy</a>", "reverse proxy 後要設定 <code>WEBHOOK_URL</code>、<code>N8N_PROXY_HOPS</code> 與 forwarded headers；這是 wrong webhook URL 的第一風險。"]
    ],
    "week20-source-table"
  );

  const sourceRowsB = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Updating self-hosted n8n", "<a href=\"https://docs.n8n.io/hosting/installation/updating/\">Updating self-hosted n8n</a>", "更新要查 release notes、測試與備份；90 天維運節奏必須包含每月更新窗口。"],
      ["Security audit", "<a href=\"https://docs.n8n.io/hosting/securing/security-audit/\">Security audit</a>", "production 前要能跑 security audit，檢查 credentials、database、file system、nodes、instance 風險。"],
      ["Logging", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/logging/\">Logging</a>", "incident response 需要 logs，不能只靠 UI 現象；維運節奏要包含 log review。"],
      ["Monitoring", "<a href=\"https://docs.n8n.io/hosting/logging-monitoring/monitoring/\">Monitoring</a>", "<code>/healthz</code> 與 <code>/healthz/readiness</code> 是基本營運驗收，metrics 則支撐 scale decision。"]
    ],
    "week20-source-table"
  );

  const sourceRowsC = renderReportTable(
    ["主題", "官方來源", "本週採用的判斷"],
    [
      ["Scaling overview", "<a href=\"https://docs.n8n.io/hosting/scaling/overview/\">Scaling overview</a>", "大量 users、workflows、executions 會推動 scaling；queue mode 是 scale path，不是初始答案。"],
      ["Queue mode", "<a href=\"https://docs.n8n.io/hosting/scaling/queue-mode/\">Queue mode</a>", "queue mode 需要 PostgreSQL、Redis、workers 與 shared encryption key；列為 90 天後依負載評估的候選。"],
      ["Concurrency control", "<a href=\"https://docs.n8n.io/hosting/scaling/concurrency-control/\">Concurrency control</a>", "擴展前先控制 production concurrency，觀察 active executions 與 queue 行為。"],
      ["Execution data", "<a href=\"https://docs.n8n.io/hosting/scaling/execution-data/\">Execution data</a>", "execution retention 會影響 DB size/performance；維運節奏要包含 pruning 與 storage review。"],
      ["Binary data", "<a href=\"https://docs.n8n.io/hosting/scaling/binary-data/\">Binary data</a>", "binary data 會影響 memory/storage；導入候選需標記 binary-heavy workflow 風險。"]
    ],
    "week20-source-table"
  );

  addPage("Chapter 20 · Section 20.2", "官方來源核對 I", `<section class="chapter-section full"><div class="section-number">20.2</div><div><h3>Cloud、Docker、Compose、Webhook URL</h3>${sourceRowsA}</div></section>`);
  addPage("Chapter 20 · Section 20.2 continued", "官方來源核對 II", `<section class="chapter-section full"><div class="section-number">20.2</div><div><h3>update、security audit、logging、monitoring</h3>${sourceRowsB}</div></section>`);
  addPage("Chapter 20 · Section 20.2 continued", "官方來源核對 III", `<section class="chapter-section full"><div class="section-number">20.2</div><div><h3>scaling、queue、concurrency、execution、binary data</h3>${sourceRowsC}</div></section>`);

  const agendaRowsA = renderReportTable(
    ["時間", "主題", "期望產出"],
    [
      ["00:00-00:20", "Executive summary", "決策者知道首選路線、替代方案、避免事項。"],
      ["00:20-01:00", "部署作品展示", "看到 Week 19 作品包、architecture、env template、DNS/TLS。"],
      ["01:00-01:35", "Runbook drill", "能說明 backup、restore、update、rollback、troubleshooting。"],
      ["01:35-02:10", "風險與成本", "看懂 Week 18 cost-risk worksheet 與主要失控點。"],
      ["02:10-02:40", "Scaling gate", "說清楚何時留在 VPS/PaaS，何時上 queue mode，何時評估 AWS/GCP。"],
      ["02:40-03:00", "下一步排序", "確認 90 天節奏、導入候選、owner、驗收指標。"]
    ],
    "week20-agenda-table"
  );

  addPage(
    "Chapter 20 · Section 20.2 continued",
    "3 小時成果交流 agenda",
    `
      <section class="chapter-section full">
        <div class="section-number">20.2</div>
        <div>
          <h3>180 分鐘把部署能力轉成決策會議</h3>
          ${agendaRowsA}
        </div>
      </section>
    `
  );

  const agendaRowsB = renderReportTable(
    ["section", "evidence", "requiredAnswer"],
    [
      ["Executive summary", "<code>final-recommendation-report.md</code>、<code>week-18-deployment-recommendation-matrix.json</code>", "Why the recommended route is VPS Docker Compose + PostgreSQL + Caddy for self-hosted baseline, and when n8n Cloud is better."],
      ["Deployment package demo", "<code>deployment-package/README.md</code>、<code>compose.yaml</code>、<code>.env.template</code>、<code>Caddyfile</code>", "How DNS, TLS, n8n, PostgreSQL, and volumes fit together."],
      ["Runbook drill", "<code>backup-restore-runbook.md</code>、<code>update-runbook.md</code>、<code>troubleshooting-playbook.md</code>", "How to back up, restore, update, roll back, and investigate incidents."],
      ["Risk and cost review", "<code>week-18-cost-risk-worksheet.csv</code>、<code>week-20-adoption-candidates-and-owners.csv</code>", "Where cost and operational risk can grow: RAM, CPU, storage, egress, logs, DB, backups, maintenance labor."],
      ["Scaling gate", "<code>week-16-scaling-ladder.json</code>、<code>week-20-final-scorecard.json</code>", "When to stay single instance, when to add concurrency control, when to evaluate queue mode, and when AWS/GCP is justified."],
      ["Next-stage owner review", "<code>week-20-90-day-maintenance-cadence.csv</code>、<code>week-20-adoption-candidates-and-owners.csv</code>", "Which owner is accountable for each next action and what evidence proves completion."]
    ],
    "week20-agenda-detail-table"
  );

  addPage("Chapter 20 · Section 20.2 continued", "3 小時成果交流 evidence", `<section class="chapter-section full"><div class="section-number">20.2</div><div><h3>每段展示都要有 evidence 與必答句</h3>${agendaRowsB}</div></section>`);

  const primaryRows = renderReportTable(
    ["Decision", "Recommendation"],
    [
      ["Primary self-hosted baseline", "VPS Docker Compose + PostgreSQL + Caddy"],
      ["Beginner or no ops owner", "n8n Cloud"],
      ["Freelancer", "VPS baseline or small PaaS with managed PostgreSQL"],
      ["Agency", "Standardized isolated client blueprint"],
      ["Production team", "AWS/GCP or n8n Enterprise after operational gates are met"]
    ],
    "week20-primary-table"
  );

  addPage(
    "Chapter 20 · Section 20.3",
    "交付物一：最終建議報告摘要",
    `
      <section class="chapter-section full">
        <div class="section-number">20.3</div>
        <div>
          <h3>Executive Recommendation</h3>
          <p class="section-lead">Adopt the Week 19 <code>VPS Docker Compose + PostgreSQL + Caddy</code> deployment package as the first self-hosted baseline for teams that can own basic operations. Use n8n Cloud when the team does not have an operations owner. Use PaaS when speed and lower VM maintenance matter more than fixed baseline cost. Consider AWS/GCP only after VPC, IAM, audit, RPO/RTO, queue workers, centralized logs, and FinOps are real requirements.</p>
          ${primaryRows}
        </div>
      </section>
    `
  );

  const whyRows = renderReportTable(
    ["Reason", "Evidence"],
    [
      ["It is handoff-ready", "Week 19 package includes README, compose, env template, Caddyfile, backup, update, troubleshooting, and demo checklist."],
      ["It preserves durable state", "PostgreSQL and named volumes are explicit."],
      ["It controls public URL risk", "Caddy, <code>WEBHOOK_URL</code>, <code>N8N_PROXY_HOPS</code>, and HTTPS are documented."],
      ["It protects credentials", "<code>N8N_ENCRYPTION_KEY</code> is treated as a critical secret."],
      ["It can scale gradually", "Week 16 defines the path from single instance to Redis queue workers."],
      ["It avoids premature complexity", "Kubernetes and AWS/GCP are reserved for proven requirements."]
    ],
    "week20-why-table"
  );

  addPage("Chapter 20 · Section 20.3 continued", "為什麼選這條路", `<section class="chapter-section full"><div class="section-number">20.3</div><div><h3>Why This Path</h3>${whyRows}</div></section>`);

  const riskRows = renderReportTable(
    ["Risk", "First control"],
    [
      ["wrong webhook URL", "Verify <code>WEBHOOK_URL</code>, <code>N8N_DOMAIN</code>, Caddy route, and editor Production URL."],
      ["lost credentials", "Preserve and restore the original <code>N8N_ENCRYPTION_KEY</code>."],
      ["database connection failed", "Check <code>/healthz/readiness</code>, PostgreSQL logs, and <code>DB_POSTGRESDB_*</code>."],
      ["secure cookie error", "Keep HTTPS and <code>N8N_SECURE_COOKIE=true</code>; fix proxy headers."],
      ["DB storage growth", "Set execution retention and review database size monthly."],
      ["binary data growth", "Keep binary mode explicit and monitor storage."],
      ["unsafe update", "Backup first, review release notes, keep rollback image tag."],
      ["cost drift", "Track RAM, CPU, storage, egress, logs, Redis, and maintenance labor."]
    ],
    "week20-risk-table"
  );

  addPage("Chapter 20 · Section 20.3 continued", "Key Risks", `<section class="chapter-section full"><div class="section-number">20.3</div><div><h3>風險在哪：第一控制點</h3>${riskRows}</div></section>`);

  const answerRows = renderReportTable(
    ["期末必答", "答案"],
    [
      ["Backup Answer", "Back up PostgreSQL, <code>n8n_data</code>, Caddy volumes, <code>.env</code>, <code>N8N_ENCRYPTION_KEY</code>, and current deployment package files. A backup is not accepted until a restore drill proves <code>/healthz</code>, <code>/healthz/readiness</code>, credential decryption, and a Production URL webhook."],
      ["Update Answer", "Update in a maintenance window. Review release notes, create backup, record current image tag, pull target image, start n8n, verify health/readiness, test credential-backed workflow, test production webhook, then record the result. Roll back by restoring the previous image tag and database backup if needed."],
      ["Scaling Answer", "Do not start with Kubernetes. First measure p95 execution latency, active executions, DB connections, memory, storage, and webhook response time. Then apply pruning, concurrency control, and workflow tuning. Move to Redis queue mode and workers only when production executions or webhook latency repeatedly exceed the single-instance capacity. Evaluate AWS/GCP only when queue operations, managed state, centralized logs, security, and FinOps are mature."]
    ],
    "week20-answer-table"
  );

  addPage("Chapter 20 · Section 20.3 continued", "Backup、Update、Scaling Answer", `<section class="chapter-section full"><div class="section-number">20.3</div><div><h3>三個不可含糊的營運答案</h3>${answerRows}</div></section>`);

  const decisionRows = renderReportTable(
    ["Scenario", "Decision"],
    [
      ["Individual learning", "n8n Cloud or Local Docker Desktop"],
      ["First paid automation", "VPS package or PaaS with managed PostgreSQL"],
      ["Repeatable agency delivery", "Standardize Week 19 package per client"],
      ["Low-ops client", "n8n Cloud Business or Enterprise"],
      ["Heavy production workload", "PostgreSQL + Redis queue mode + workers after scaling gate"],
      ["Enterprise governance", "AWS/GCP or n8n Enterprise after security and FinOps review"]
    ],
    "week20-decision-table"
  );

  addPage("Chapter 20 · Section 20.3 continued", "Final Decision Table", `<section class="chapter-section full"><div class="section-number">20.3</div><div><h3>依場景決定下一步</h3>${decisionRows}</div></section>`);

  const mustRows = renderReportTable(
    ["問題", "答案"],
    [
      ["為什麼選這條路？", "因為它能在固定成本、可交接性、可維運性之間取得平衡，並覆蓋 DNS/TLS、PostgreSQL、backup、update、troubleshooting。"],
      ["風險在哪？", "<code>N8N_ENCRYPTION_KEY</code> 遺失、wrong webhook URL、DB connection failed、secure cookie error、execution data growth、binary data storage、更新失敗。"],
      ["如何備份？", "備份 PostgreSQL dump、<code>n8n_data</code>、Caddy state、<code>.env</code>、<code>N8N_ENCRYPTION_KEY</code>，並用 staging restore 驗證。"],
      ["如何更新？", "先看 release notes，備份，維護窗口 pull image，啟動後檢查 <code>/healthz</code>、<code>/healthz/readiness</code>、credentials、webhook，失敗則 rollback。"],
      ["何時擴展？", "當 p95 latency、active executions、DB connections、worker backlog、memory/storage growth 連續超過門檻時，先調 concurrency，再導入 queue mode 與 workers。"]
    ],
    "week20-must-table"
  );

  addPage("Chapter 20 · Section 20.3 continued", "期末必答五題", `<section class="chapter-section full"><div class="section-number">20.3</div><div><h3>Gate 05 口試答案</h3>${mustRows}</div></section>`);

  const cadenceSummaryRows = renderReportTable(
    ["階段", "天數", "主題", "主要產出"],
    [
      ["Phase 1", "Day 1-14", "Stabilize baseline", "owner、secrets、backup、health checks、first restore drill。"],
      ["Phase 2", "Day 15-30", "Operate safely", "patch cadence、security audit、incident note、cost baseline。"],
      ["Phase 3", "Day 31-60", "Measure and tune", "execution pruning、DB/storage review、workflow risk register、monitoring。"],
      ["Phase 4", "Day 61-90", "Decide next stage", "queue mode gate、PaaS/n8n Cloud/AWS comparison、owner sign-off。"]
    ],
    "week20-cadence-summary-table"
  );

  addPage(
    "Chapter 20 · Section 20.4",
    "交付物二：90 天維運節奏",
    `
      <section class="chapter-section full">
        <div class="section-number">20.4</div>
        <div>
          <h3>90 天分成四段，每段都要有證據</h3>
          ${cadenceSummaryRows}
          <div class="week20-cadence-map">
            <div><span>Day 1-14</span><strong>Stabilize</strong><p>owners, secrets, backup, restore</p></div>
            <div><span>Day 15-30</span><strong>Operate</strong><p>patch, audit, incidents, cost</p></div>
            <div><span>Day 31-60</span><strong>Measure</strong><p>DB, executions, storage, workflows</p></div>
            <div><span>Day 61-90</span><strong>Decide</strong><p>queue, Cloud/PaaS/AWS, sign-off</p></div>
          </div>
        </div>
      </section>
    `
  );

  const cadenceRowsA = renderReportTable(
    ["phase", "days", "cadence", "owner", "activity", "evidence", "acceptance_gate"],
    [
      ["stabilize", "1-3", "once", "deployment_owner", "Confirm deployment package owner and secret owner", "owner map with deployment_owner, operations_owner, security_owner, finance_owner", "Every critical area has one accountable owner"],
      ["stabilize", "1-7", "once", "deployment_owner", "Deploy Week 19 package to staging or selected baseline host", "compose ps output, HTTPS URL, /healthz status", "n8n reachable through HTTPS"],
      ["stabilize", "1-7", "once", "operations_owner", "Verify /healthz and /healthz/readiness checks", "timestamped health and readiness output", "/healthz and /healthz/readiness return 200"],
      ["stabilize", "4-10", "once", "security_owner", "Store N8N_ENCRYPTION_KEY and POSTGRES_PASSWORD in secret store", "secret inventory and access owner", "Secrets are recoverable and not stored in plaintext repo"],
      ["stabilize", "8-14", "once", "operations_owner", "Run first backup and restore drill", "pg_dump file, restore notes, credential-backed workflow test", "Restore proves DB, credentials, and webhook work"]
    ],
    "week20-cadence-table"
  );

  const cadenceRowsB = renderReportTable(
    ["phase", "days", "cadence", "owner", "activity", "evidence", "acceptance_gate"],
    [
      ["operate", "15-21", "weekly", "operations_owner", "Review logs and incident notes", "log review notes and open incidents", "No unresolved P0/P1 incidents"],
      ["operate", "15-30", "monthly", "security_owner", "Run n8n security audit", "audit output and remediation list", "Risky findings have owners and dates"],
      ["operate", "15-30", "monthly", "deployment_owner", "Run update window with backup first", "release notes, previous image tag, target image tag, readiness evidence", "Update or deferred update has explicit reason"],
      ["operate", "22-30", "monthly", "finance_owner", "Set baseline cost and budget alerts", "cost baseline, storage alert, egress alert", "Budget alert exists for chosen platform"]
    ],
    "week20-cadence-table"
  );

  const cadenceRowsC = renderReportTable(
    ["phase", "days", "cadence", "owner", "activity", "evidence", "acceptance_gate"],
    [
      ["measure", "31-45", "biweekly", "data_owner", "Review execution data retention and DB growth", "DB size trend and pruning settings", "Retention policy is documented and applied"],
      ["measure", "31-60", "biweekly", "operations_owner", "Review memory, CPU, active executions, and webhook latency", "metrics snapshot or log-derived trend", "No sustained capacity breach without owner"],
      ["measure", "45-60", "monthly", "workflow_owner", "Review top workflows by risk and business value", "workflow risk register", "High-value workflows have owner and failure path"],
      ["measure", "45-60", "monthly", "security_owner", "Review credentials and unused credentials", "credential inventory and cleanup note", "Unused or risky credentials are removed or justified"]
    ],
    "week20-cadence-table"
  );

  const cadenceRowsD = renderReportTable(
    ["phase", "days", "cadence", "owner", "activity", "evidence", "acceptance_gate"],
    [
      ["decide", "61-75", "once", "platform_owner", "Evaluate concurrency control before queue mode", "active executions trend and N8N_CONCURRENCY_PRODUCTION_LIMIT decision", "Concurrency decision is recorded"],
      ["decide", "61-90", "once", "platform_owner", "Evaluate queue mode gate", "Redis/worker spike plan, DB connection review, rollback plan", "Queue mode is approved, deferred, or rejected with evidence"],
      ["decide", "75-90", "once", "product_owner", "Evaluate n8n Cloud or PaaS for low-ops cases", "execution estimate and plan fit", "Low-ops route has owner and migration note"],
      ["decide", "75-90", "once", "platform_owner", "Evaluate AWS/GCP only if enterprise gates are true", "VPC/IAM/audit/RPO/RTO/FinOps checklist", "AWS/GCP decision is evidence-based"],
      ["decide", "85-90", "once", "business_owner", "Hold 90-day review and next-stage sign-off", "scorecard, owner list, next 90-day backlog", "Next-stage decision has owner, budget, and deadline"]
    ],
    "week20-cadence-table"
  );

  addPage("Chapter 20 · Section 20.4 continued", "90-day cadence：stabilize", `<section class="chapter-section full"><div class="section-number">20.4</div><div><h3>Day 1-14：baseline、owners、secrets、restore</h3>${cadenceRowsA}</div></section>`);
  addPage("Chapter 20 · Section 20.4 continued", "90-day cadence：operate", `<section class="chapter-section full"><div class="section-number">20.4</div><div><h3>Day 15-30：logs、audit、update、budget</h3>${cadenceRowsB}</div></section>`);
  addPage("Chapter 20 · Section 20.4 continued", "90-day cadence：measure", `<section class="chapter-section full"><div class="section-number">20.4</div><div><h3>Day 31-60：execution、DB、workflow、credentials</h3>${cadenceRowsC}</div></section>`);
  addPage("Chapter 20 · Section 20.4 continued", "90-day cadence：decide", `<section class="chapter-section full"><div class="section-number">20.4</div><div><h3>Day 61-90：concurrency、queue、Cloud/PaaS、AWS/GCP、sign-off</h3>${cadenceRowsD}</div></section>`);

  const adoptionRowsA = renderReportTable(
    ["priority", "candidate", "owner", "why_now", "entry_condition", "first_action", "success_metric", "avoid_until"],
    [
      ["P0", "Adopt Week 19 VPS package as self-hosted baseline", "deployment_owner", "It is the completed handoff-ready package", "A team can own Docker, DNS, backup, updates, and incidents", "Deploy to staging using compose.yaml and .env.template", "Teammate can explain architecture, startup, backup, risks, and next steps", "Do not put business-critical workflows on it before restore drill"],
      ["P0", "Monthly backup restore drill", "operations_owner", "Credentials and workflow state must be recoverable", "Any production workflow stores real credentials or business data", "Run pg_dump and restore to staging", "Restore proves /healthz/readiness, credential decrypt, and webhook execution", "Do not rely on backups that were never restored"],
      ["P0", "Security audit cadence", "security_owner", "Public automation instance increases risk", "Instance is reachable from the internet or uses sensitive credentials", "Run n8n audit and record findings", "Findings have severity, owner, and due date", "Do not expand public workflows before high-risk items are owned"]
    ],
    "week20-adoption-table"
  );

  const adoptionRowsB = renderReportTable(
    ["priority", "candidate", "owner", "why_now", "entry_condition", "first_action", "success_metric", "avoid_until"],
    [
      ["P1", "Execution data retention and DB pruning", "data_owner", "Database growth is the most likely silent cost and performance risk", "DB size trend or execution count grows each week", "Set retention and review saved success executions", "DB growth trend is stable and documented", "Do not increase workflow volume with unlimited retention"],
      ["P1", "Centralized logs and incident notes", "operations_owner", "Week 17 showed logs are required for fast diagnosis", "Incidents cannot be diagnosed from local logs alone", "Route n8n, Caddy, and PostgreSQL logs to a searchable place", "Incident note includes exact timestamp and process evidence", "Do not add workers before logs are searchable"],
      ["P1", "Cost-risk budget alerts", "finance_owner", "Usage-priced platforms and storage can drift", "PaaS, Cloud Run, AWS, object storage, or multi-client delivery is used", "Create budget and storage alerts", "Monthly cost has owner and alert threshold", "Do not accept open-ended autoscaling without budget"]
    ],
    "week20-adoption-table"
  );

  const adoptionRowsC = renderReportTable(
    ["priority", "candidate", "owner", "why_now", "entry_condition", "first_action", "success_metric", "avoid_until"],
    [
      ["P1", "n8n Cloud fit check", "product_owner", "Some teams should not own infrastructure", "No dedicated operations owner exists", "Estimate executions and compare Cloud plan fit", "Decision records execution estimate and owner", "Do not self-host only to avoid subscription cost"],
      ["P2", "Queue mode evaluation", "platform_owner", "Scale path should be evidence-based", "p95 latency, active executions, or webhook backlog breaches threshold twice", "Run Redis/worker staging spike", "Queue mode decision includes DB connection and rollback plan", "Do not add Redis/workers before PostgreSQL, logs, and backup are stable"],
      ["P3", "AWS/GCP production architecture evaluation", "platform_owner", "Enterprise requirements may justify complexity", "VPC, IAM, audit, SSO, RPO/RTO, and on-call are real requirements", "Create architecture and FinOps estimate", "Security and finance approve or defer", "Do not move to AWS/GCP for appearance or premature scale"]
    ],
    "week20-adoption-table"
  );

  addPage("Chapter 20 · Section 20.5", "交付物三：導入候選清單與 owner I", `<section class="chapter-section full"><div class="section-number">20.5</div><div><h3>P0：baseline、restore drill、security audit</h3>${adoptionRowsA}</div></section>`);
  addPage("Chapter 20 · Section 20.5 continued", "交付物三：導入候選清單與 owner II", `<section class="chapter-section full"><div class="section-number">20.5</div><div><h3>P1：DB pruning、centralized logs、budget alerts</h3>${adoptionRowsB}</div></section>`);
  addPage("Chapter 20 · Section 20.5 continued", "交付物三：導入候選清單與 owner III", `<section class="chapter-section full"><div class="section-number">20.5</div><div><h3>P1-P3：n8n Cloud、queue mode、AWS/GCP</h3>${adoptionRowsC}</div></section>`);

  const scorecardRows = renderReportTable(
    ["Gate 05 問題", "結論", "證據"],
    [
      ["是否能提出合理部署建議？", "通過", "Week 18 選型矩陣 + Week 20 最終建議報告。"],
      ["是否能展示部署作品包？", "通過", "Week 19 deployment package。"],
      ["是否能回答架構？", "通過", "README architecture + compose + Caddyfile。"],
      ["是否能回答啟動方式？", "通過", "README Startup + final demo checklist。"],
      ["是否能回答備份方式？", "通過", "backup-restore-runbook + 90 天 restore drill。"],
      ["是否能回答風險？", "通過", "Week 17 cards + Week 18 cost-risk + Week 20 risk register。"],
      ["是否能回答如何更新？", "通過", "update-runbook + monthly patch cadence。"],
      ["是否能回答何時擴展？", "通過", "Week 16 scaling ladder + Week 20 scaling gate。"],
      ["是否能排出 90 天導入優先順序？", "通過", "90 天維運節奏 + adoption candidates and owners。"]
    ],
    "week20-scorecard-table"
  );

  addPage(
    "Chapter 20 · Section 20.6",
    "Gate 05 final scorecard",
    `
      <section class="chapter-section full">
        <div class="section-number">20.6</div>
        <div>
          <h3>Can the team provide a reasonable deployment recommendation and next-stage adoption plan?</h3>
          ${scorecardRows}
        </div>
      </section>
    `
  );

  const mustAnswerRowsA = renderReportTable(
    ["question", "answer", "evidence", "status"],
    [
      ["Why choose this route?", "It balances handoff readiness, fixed baseline cost, PostgreSQL durability, DNS/TLS clarity, backup discipline, and a gradual scaling path.", "<code>README.md</code>；<code>docs/week-18-platform-selection-cost-risk.md</code>", "pass"],
      ["Where are the risks?", "Risks are wrong webhook URL, lost credentials, database connection failure, secure cookie behavior, execution data growth, binary data storage, update failure, logs, and cost drift.", "<code>week-17-troubleshooting-cards.json</code>；<code>week-18-cost-risk-worksheet.csv</code>；<code>final-recommendation-report.md</code>", "pass"],
      ["How do we back up?", "Back up PostgreSQL, n8n_data, Caddy state, .env, N8N_ENCRYPTION_KEY, and deployment files, then prove restore through readiness, credential decryption, and webhook execution.", "<code>backup-restore-runbook.md</code>；<code>week-20-90-day-maintenance-cadence.csv</code>", "pass"]
    ],
    "week20-mustanswer-table"
  );

  const mustAnswerRowsB = renderReportTable(
    ["question", "answer", "evidence", "status"],
    [
      ["How do we update?", "Review release notes, back up, record previous image tag, update in a maintenance window, verify health/readiness and workflow execution, then roll back if needed.", "<code>update-runbook.md</code>；<code>week-20-90-day-maintenance-cadence.csv</code>", "pass"],
      ["When do we scale?", "Scale after metrics show sustained pressure. Apply pruning and concurrency control first; evaluate queue mode after PostgreSQL, logs, backup, RPO/RTO, and owner readiness are stable.", "<code>week-16-scaling-ladder.json</code>；<code>week-20-adoption-candidates-and-owners.csv</code>", "pass"]
    ],
    "week20-mustanswer-table"
  );

  addPage("Chapter 20 · Section 20.6 continued", "Gate 05 mustAnswer I", `<section class="chapter-section full"><div class="section-number">20.6</div><div><h3>Why、Risks、Backup</h3>${mustAnswerRowsA}</div></section>`);
  addPage("Chapter 20 · Section 20.6 continued", "Gate 05 mustAnswer II", `<section class="chapter-section full"><div class="section-number">20.6</div><div><h3>Update、Scale</h3>${mustAnswerRowsB}</div></section>`);

  const artifactRows = renderReportTable(
    ["finalArtifacts", "用途"],
    [
      ["<code>artifacts/week-20-final/final-recommendation-report.md</code>", "最終建議報告，回答 route、risk、backup、update、scale。"],
      ["<code>artifacts/week-20-final/week-20-90-day-maintenance-cadence.csv</code>", "90-day maintenance 節奏，安排 owner、活動、證據、acceptance gate。"],
      ["<code>artifacts/week-20-final/week-20-adoption-candidates-and-owners.csv</code>", "導入候選清單與 owner，將下一步拆成 P0-P3。"],
      ["<code>artifacts/week-20-final/week-20-three-hour-showcase-agenda.json</code>", "三小時成果交流 agenda，定義每段 evidence 與 required answer。"]
    ],
    "week20-artifact-table"
  );

  addPage("Chapter 20 · Section 20.6 continued", "Gate 05 final artifacts", `<section class="chapter-section full"><div class="section-number">20.6</div><div><h3>scorecard 引用的最終 artifact</h3>${artifactRows}</div></section>`);

  const nextStageRows = renderReportTable(
    ["階段", "nextStageDecision"],
    [
      ["days1to14", "Stabilize baseline, owners, secrets, backup, restore."],
      ["days15to30", "Operate safely with update window, security audit, logs, cost baseline."],
      ["days31to60", "Measure execution data, DB growth, workflow risk, memory, CPU, storage."],
      ["days61to90", "Decide whether to stay baseline, move to n8n Cloud/PaaS, evaluate queue mode, or prepare AWS/GCP with explicit RPO/RTO and FinOps."]
    ],
    "week20-nextstage-table"
  );

  addPage(
    "Chapter 20 · Section 20.6 continued",
    "nextStageDecision",
    `
      <section class="chapter-section">
        <div class="section-number">20.6</div>
        <div>
          <h3>下一階段不是口號，而是 90 天節奏</h3>
          ${nextStageRows}
          <div class="week20-gate-map">
            <div><span>1</span><strong>Stabilize</strong></div>
            <div><span>2</span><strong>Operate</strong></div>
            <div><span>3</span><strong>Measure</strong></div>
            <div><span>4</span><strong>Decide</strong></div>
            <div><span>Gate 05</span><strong>Owner, budget, deadline</strong></div>
          </div>
        </div>
      </section>
    `
  );

  const completionRows = renderReportTable(
    ["驗收條件", "結果", "證據"],
    [
      ["完成最終建議報告", "通過", "<code>final-recommendation-report.md</code>"],
      ["完成 90 天維運節奏", "通過", "<code>week-20-90-day-maintenance-cadence.csv</code>"],
      ["完成導入候選清單與 owner", "通過", "<code>week-20-adoption-candidates-and-owners.csv</code>"],
      ["完成 3 小時成果交流", "通過", "<code>week-20-three-hour-showcase-agenda.json</code>"],
      ["能回答為什麼選這條路", "通過", "第 20.3、20.6 節"],
      ["能回答風險在哪", "通過", "第 20.3、20.5、20.6 節"],
      ["能回答如何備份", "通過", "第 20.3、20.4、20.6 節"],
      ["能回答如何更新", "通過", "第 20.3、20.4、20.6 節"],
      ["能回答何時擴展", "通過", "第 20.3、20.5、20.6 節"]
    ],
    "week20-completion-table"
  );

  addPage("Chapter 20 · Section 20.7", "Week 20 完成檢查", `<section class="chapter-section full"><div class="section-number">20.7</div><div><h3>Week 20 完成檢查</h3>${completionRows}</div></section>`);

  addPage(
    "Chapter 20 · Section 20.8",
    "20 週結論",
    `
      <section class="chapter-section">
        <div class="section-number">20.8</div>
        <div>
          <h3>最終成果：可交接的部署判斷能力</h3>
          <p>20 週的最終成果不是一個跑起來的 n8n instance，而是一套可交接的部署判斷能力：能從 user type 選平台，能從 state 判斷資料風險，能用 DNS/TLS 正確公開 webhook，能用 PostgreSQL 保存 production state，能備份與還原，能用 runbook 排查事故，能在成本和維運責任之間做選擇，最後能把下一階段導入拆成 owner、節奏與驗收指標。</p>
          <div class="tip-callout">
            <strong>課程總結</strong>
            <p>這份報告最後要服務的不是單次部署，而是後續每一次導入決策。只要能回答「為什麼、風險、備份、更新、擴展」，n8n 才真正從工具變成可維運的自動化平台。</p>
          </div>
        </div>
      </section>
    `
  );

  return pages;
}

function renderWeekPage(week, source, index) {
  const phase = phaseById(week.phase);
  const lineCount = countLines(source);
  return `
    <section class="page week-page" id="week-${week.number}">
      <div class="rh">
        <span>${escapeHtml(metadata.title)}</span>
        <span>${escapeHtml(phase.weeks)}</span>
      </div>
      <div class="week-hero">
        <div class="week-icon">${escapeHtml(week.icon)}</div>
        <div>
          <p class="kicker">${escapeHtml(phase.label)} · Week ${week.number}</p>
          <h2>${escapeHtml(week.title)}</h2>
          <p class="mission">${escapeHtml(week.mission)}</p>
        </div>
      </div>
      <div class="week-panels">
        <article>
          <h3>閱讀重點</h3>
          ${list(week.read)}
        </article>
        <article>
          <h3>製作任務</h3>
          ${list(week.make)}
        </article>
        <article>
          <h3>跟做路線</h3>
          ${list(week.practice)}
        </article>
      </div>
      <div class="acceptance">
        <strong>本週驗收</strong>
        <p>${escapeHtml(week.acceptance)}</p>
      </div>
      <div class="outputs">
        ${week.outputs.map((output) => `<span>${escapeHtml(output)}</span>`).join("")}
      </div>
      <details class="source-panel" open>
        <summary>
          <span>本週完整原文講義</span>
          <a href="${escapeAttr(sourceLink(week.doc))}">${escapeHtml(week.doc)}</a>
          <em>${lineCount} lines</em>
        </summary>
        <pre><code>${escapeHtml(source)}</code></pre>
      </details>
      ${pageNumber(index)}
    </section>`;
}

function renderSourceIndex(sources) {
  return weeks
    .map((week) => {
      const source = sources.get(week.doc);
      const lineCount = countLines(source);
      return `
        <tr>
          <td>Week ${week.number}</td>
          <td><a href="#week-${week.number}">${escapeHtml(week.title)}</a></td>
          <td>${lineCount}</td>
          <td><a href="${escapeAttr(sourceLink(week.doc))}">${escapeHtml(week.doc)}</a></td>
        </tr>`;
    })
    .join("");
}

const sources = new Map();
for (const week of weeks) {
  const file = path.join(rootDir, week.doc);
  sources.set(week.doc, await fs.readFile(file, "utf8"));
}

const totalSourceLines = Array.from(sources.values()).reduce((sum, source) => {
  return sum + countLines(source);
}, 0);

const reportPages = [];

reportPages.push(`
  <section class="page cover">
    <div class="cover-grid">
      <div>
        <p class="kicker">NUVA Course Outcome Report</p>
        <h1><span>[課程成果]搬家：</span>n8n 部署全攻略</h1>
        <p class="lead">20 週逐步閱讀、製作、驗收與交接的 n8n 部署課程成果報告。每週都包含導讀、實作任務、驗收標準與完整原文講義。</p>
      </div>
      <aside class="cover-card">
        <span>Report Date</span>
        <strong>2026-05-28</strong>
        <p>Period: 2026/05/27-2026/05/28</p>
        <p>Category: 課程成果</p>
        <p>Client: NUVA</p>
      </aside>
    </div>
    <div class="cover-strip">
      <span>Cloud</span>
      <span>Local Docker</span>
      <span>PostgreSQL</span>
      <span>VPS</span>
      <span>PaaS</span>
      <span>Runbook</span>
      <span>Security</span>
      <span>Scale</span>
    </div>
    <div class="cover-bottom">
      <div>
        <strong>20</strong>
        <span>週完整課程</span>
      </div>
      <div>
        <strong>5</strong>
        <span>階段學習路線</span>
      </div>
      <div>
        <strong>${totalSourceLines}</strong>
        <span>行原始週講義全文收錄</span>
      </div>
    </div>
    ${pageNumber(1)}
  </section>`);

reportPages.push(`
  <section class="page">
    <div class="rh">
      <span>${escapeHtml(metadata.title)}</span>
      <span>Course Map</span>
    </div>
    <p class="kicker">How to read this report</p>
    <h2>這份報告的閱讀方式</h2>
    <p class="intro">這不是把 20 份文件簡單合併成長文，而是把整套 n8n 部署學習路線整理成「每週可閱讀、可製作、可驗收」的課程報告。每一週先看導讀與任務，再展開完整原文講義核對細節。</p>
    ${renderFlowDiagram()}
    <div class="reader-grid">
      <article>
        <h3>每週固定節奏</h3>
        <p>先理解本週要解決的部署問題，再完成本週交付物，最後用驗收句確認成果能接到下一週。</p>
      </article>
      <article>
        <h3>原文完整收錄</h3>
        <p>每週頁面下方都放入來源週文件全文，包含表格、Mermaid 圖、檢查清單、官方來源與交付物說明。</p>
      </article>
      <article>
        <h3>實作導向</h3>
        <p>報告會不斷追問 state 在哪裡、public URL 是否正確、誰負責更新、如何備份、何時需要擴展。</p>
      </article>
    </div>
    <div class="source-table-wrap">
      <table class="source-table">
        <thead>
          <tr><th>週次</th><th>主題</th><th>原文行數</th><th>來源文件</th></tr>
        </thead>
        <tbody>${renderSourceIndex(sources)}</tbody>
      </table>
    </div>
    ${pageNumber(2)}
  </section>`);

reportPages.push(`
  <section class="page">
    <div class="rh">
      <span>${escapeHtml(metadata.title)}</span>
      <span>Five Phases</span>
    </div>
    <p class="kicker">Learning Architecture</p>
    <h2>5 個階段，把 n8n 從本機搬到可維運</h2>
    <p class="intro">整套課程的主線是「搬家」：從只會打開 n8n，搬到能說明部署選擇、保護資料、公開 webhook、選平台、維護更新、演練事故，最後交出可複製作品包。</p>
    <div class="phase-grid">${renderPhaseCards()}</div>
    <div class="diagram-block">
      <h3>決策階梯</h3>
      ${renderDecisionLadder()}
    </div>
    ${pageNumber(3)}
  </section>`);

reportPages.push(`
  <section class="page">
    <div class="rh">
      <span>${escapeHtml(metadata.title)}</span>
      <span>Weekly Navigation</span>
    </div>
    <p class="kicker">Week by Week</p>
    <h2>20 週學習導覽</h2>
    <p class="intro">點選任一週可直接跳到對應課程頁。建議每週按順序完成，因為後面的 runbook、troubleshooting 與 final recommendation 都會引用前面建立的 state、URL、database、backup 與 platform decision 模型。</p>
    <div class="week-mini-grid">${renderWeekMiniMap()}</div>
    <div class="checkpoint-band">
      <div><span>Gate 01</span><strong>懂部署選項</strong></div>
      <div><span>Gate 02</span><strong>能本機實作</strong></div>
      <div><span>Gate 03</span><strong>能公開與選平台</strong></div>
      <div><span>Gate 04</span><strong>能維運與擴展</strong></div>
      <div><span>Gate 05</span><strong>能交接與導入</strong></div>
    </div>
    ${pageNumber(4)}
  </section>`);

let pageIndex = 5;
for (const week of weeks) {
  if (week.number === "01") {
    const weekOnePages = renderWeekOneChapter(week, pageIndex);
    reportPages.push(...weekOnePages);
    pageIndex += weekOnePages.length;
  } else if (week.number === "02") {
    const weekTwoPages = renderWeekTwoChapter(week, pageIndex);
    reportPages.push(...weekTwoPages);
    pageIndex += weekTwoPages.length;
  } else if (week.number === "03") {
    const weekThreePages = renderWeekThreeChapter(week, pageIndex);
    reportPages.push(...weekThreePages);
    pageIndex += weekThreePages.length;
  } else if (week.number === "04") {
    const weekFourPages = renderWeekFourChapter(week, pageIndex);
    reportPages.push(...weekFourPages);
    pageIndex += weekFourPages.length;
  } else if (week.number === "05") {
    const weekFivePages = renderWeekFiveChapter(week, pageIndex);
    reportPages.push(...weekFivePages);
    pageIndex += weekFivePages.length;
  } else if (week.number === "06") {
    const weekSixPages = renderWeekSixChapter(week, pageIndex);
    reportPages.push(...weekSixPages);
    pageIndex += weekSixPages.length;
  } else if (week.number === "07") {
    const weekSevenPages = renderWeekSevenChapter(week, pageIndex);
    reportPages.push(...weekSevenPages);
    pageIndex += weekSevenPages.length;
  } else if (week.number === "08") {
    const weekEightPages = renderWeekEightChapter(week, pageIndex);
    reportPages.push(...weekEightPages);
    pageIndex += weekEightPages.length;
  } else if (week.number === "09") {
    const weekNinePages = renderWeekNineChapter(week, pageIndex);
    reportPages.push(...weekNinePages);
    pageIndex += weekNinePages.length;
  } else if (week.number === "10") {
    const weekTenPages = renderWeekTenChapter(week, pageIndex);
    reportPages.push(...weekTenPages);
    pageIndex += weekTenPages.length;
  } else if (week.number === "11") {
    const weekElevenPages = renderWeekElevenChapter(week, pageIndex);
    reportPages.push(...weekElevenPages);
    pageIndex += weekElevenPages.length;
  } else if (week.number === "12") {
    const weekTwelvePages = renderWeekTwelveChapter(week, pageIndex);
    reportPages.push(...weekTwelvePages);
    pageIndex += weekTwelvePages.length;
  } else if (week.number === "13") {
    const weekThirteenPages = renderWeekThirteenChapter(week, pageIndex);
    reportPages.push(...weekThirteenPages);
    pageIndex += weekThirteenPages.length;
  } else if (week.number === "14") {
    const weekFourteenPages = renderWeekFourteenChapter(week, pageIndex);
    reportPages.push(...weekFourteenPages);
    pageIndex += weekFourteenPages.length;
  } else if (week.number === "15") {
    const weekFifteenPages = renderWeekFifteenChapter(week, pageIndex);
    reportPages.push(...weekFifteenPages);
    pageIndex += weekFifteenPages.length;
  } else if (week.number === "16") {
    const weekSixteenPages = renderWeekSixteenChapter(week, pageIndex);
    reportPages.push(...weekSixteenPages);
    pageIndex += weekSixteenPages.length;
  } else if (week.number === "17") {
    const weekSeventeenPages = renderWeekSeventeenChapter(week, pageIndex);
    reportPages.push(...weekSeventeenPages);
    pageIndex += weekSeventeenPages.length;
  } else if (week.number === "18") {
    const weekEighteenPages = renderWeekEighteenChapter(week, pageIndex);
    reportPages.push(...weekEighteenPages);
    pageIndex += weekEighteenPages.length;
  } else if (week.number === "19") {
    const weekNineteenPages = renderWeekNineteenChapter(week, pageIndex);
    reportPages.push(...weekNineteenPages);
    pageIndex += weekNineteenPages.length;
  } else if (week.number === "20") {
    const weekTwentyPages = renderWeekTwentyChapter(week, pageIndex);
    reportPages.push(...weekTwentyPages);
    pageIndex += weekTwentyPages.length;
  } else {
    reportPages.push(renderWeekPage(week, sources.get(week.doc), pageIndex));
    pageIndex += 1;
  }
}

reportPages.push(`
  <section class="page closing">
    <div class="rh">
      <span>${escapeHtml(metadata.title)}</span>
      <span>Next Stage</span>
    </div>
    <p class="kicker">After Week 20</p>
    <h2>下一階段使用這份報告的方法</h2>
    <div class="closing-grid">
      <article>
        <span>01</span>
        <h3>當作課本</h3>
        <p>每週先讀導讀，再照製作任務完成本週交付物，最後展開完整原文核對所有細節與來源。</p>
      </article>
      <article>
        <span>02</span>
        <h3>當作交接包</h3>
        <p>用 Week 19 的 deployment package 當基準，把 README、compose、env、Caddyfile、runbook 與 checklist 交給下一位 owner。</p>
      </article>
      <article>
        <span>03</span>
        <h3>當作導入評估</h3>
        <p>用 Week 18 與 Week 20 的 scorecard 排出 Cloud、VPS、PaaS、hyperscaler 與 Enterprise 的採用順序。</p>
      </article>
      <article>
        <span>04</span>
        <h3>當作維運節奏</h3>
        <p>把 Week 14 的 backup/update runbook、Week 15 的 patch cadence、Week 16 的 scaling signals 放進 90 天維運節奏。</p>
      </article>
    </div>
    <div class="final-answer">
      <strong>期末必答句</strong>
      <p>這套 n8n 部署課程的成果，不是只有把服務跑起來，而是能回答：為什麼選這條部署路線、資料在哪裡、public URL 是否正確、如何備份還原、如何更新修補、出事如何排查、成本風險如何說明、下一階段誰負責。</p>
    </div>
    ${pageNumber(pageIndex)}
  </section>`);

const html = `<!DOCTYPE html>
<html lang="zh-Hant">
<!-- report-meta
${JSON.stringify(metadata, null, 2)}
-->

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metadata.title)}</title>
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Space+Mono:wght@400;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --paper: #ffffff;
      --desk: #f7faff;
      --ink: #13213f;
      --muted: #51617f;
      --faint: #8390ad;
      --line: rgba(31, 80, 168, .16);
      --line-strong: rgba(21, 51, 112, .42);
      --navy: #102a5f;
      --blue: #2563eb;
      --blue-dark: #123f95;
      --blue-soft: #eaf2ff;
      --sky: #dbeafe;
      --mint: #dff7ee;
      --mint-ink: #176b55;
      --amber: #fff3d6;
      --amber-ink: #8a5a00;
      --rose: #ffe4ea;
      --rose-ink: #9f1239;
      --shadow: rgba(23, 63, 148, .17);
      --report-bg-base: #f8fbff;
      --report-bg-line: rgba(37, 99, 235, .035);
      --report-bg-line-strong: rgba(96, 165, 250, .06);
      --report-bg-size: 42px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      min-height: 100vh;
      background:
        linear-gradient(90deg, var(--report-bg-line-strong) 1px, transparent 1px),
        linear-gradient(0deg, var(--report-bg-line) 1px, transparent 1px),
        var(--report-bg-base);
      background-size: var(--report-bg-size) var(--report-bg-size);
      color: var(--ink);
      font-family: "Noto Sans TC", sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 34px 0;
    }

    a {
      color: var(--blue-dark);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .page {
      position: relative;
      width: min(210mm, calc(100vw - 28px));
      min-height: 297mm;
      margin: 0 auto 30px;
      overflow: hidden;
      background: var(--paper);
      box-shadow: 0 10px 36px var(--shadow);
      padding: 21mm 19mm 16mm;
    }

    .page::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(90deg, transparent 23mm, rgba(37, 99, 235, .12) 23mm, rgba(37, 99, 235, .12) calc(23mm + 1px), transparent calc(23mm + 1px));
    }

    .page::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(135deg, rgba(239, 246, 255, .62), transparent 35%);
      opacity: .82;
    }

    .page > * {
      position: relative;
      z-index: 1;
    }

    .rh,
    .kicker,
    .pgn,
    .cover-card span,
    .phase-topline,
    .week-icon,
    .flow-node span,
    .checkpoint-band span,
    .ladder span,
    .closing-grid span {
      font-family: "Space Mono", monospace;
      text-transform: uppercase;
    }

    .rh {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--faint);
      font-size: 10px;
      margin-bottom: 28px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 10px;
    }

    .kicker {
      color: var(--blue);
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    h1,
    h2,
    h3 {
      font-family: "Archivo", "Noto Sans TC", sans-serif;
      letter-spacing: 0;
      color: var(--navy);
    }

    h1 {
      font-size: clamp(48px, 7vw, 82px);
      line-height: .94;
      font-weight: 900;
      max-width: 12ch;
    }

    h1 span {
      display: block;
      color: var(--blue-dark);
    }

    h2 {
      font-size: 34px;
      line-height: 1.12;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 18px;
      line-height: 1.25;
      margin-bottom: 10px;
    }

    p {
      color: var(--muted);
      font-size: 15px;
      line-height: 1.75;
    }

    .lead {
      max-width: 620px;
      margin-top: 24px;
      color: var(--muted);
      font-size: 19px;
      line-height: 1.7;
    }

    .intro {
      max-width: 760px;
      font-size: 16px;
      margin-bottom: 22px;
    }

    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 230px;
      gap: 28px;
      align-items: start;
    }

    .cover-card {
      border: 1px solid var(--line);
      background: rgba(234, 242, 255, .82);
      padding: 18px;
      border-radius: 8px;
    }

    .cover-card strong {
      display: block;
      margin: 8px 0 18px;
      color: var(--navy);
      font-family: "Archivo", sans-serif;
      font-size: 26px;
    }

    .cover-card p {
      font-size: 12px;
      line-height: 1.7;
    }

    .cover-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 1px solid var(--line);
      margin: 40px 0;
    }

    .cover-strip span {
      min-height: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      color: var(--blue-dark);
      font-weight: 800;
    }

    .cover-strip span:nth-child(4n) {
      border-right: 0;
    }

    .cover-bottom {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .cover-bottom div {
      border-top: 4px solid var(--blue);
      padding-top: 12px;
    }

    .cover-bottom strong {
      display: block;
      font-family: "Archivo", sans-serif;
      color: var(--navy);
      font-size: 44px;
      line-height: 1;
    }

    .cover-bottom span {
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }

    .flow-row {
      display: grid;
      grid-template-columns: 1fr 28px 1fr 28px 1fr 28px 1fr;
      align-items: stretch;
      gap: 10px;
      margin: 24px 0;
    }

    .flow-node {
      border: 1px solid var(--line);
      background: var(--blue-soft);
      padding: 16px;
      border-radius: 8px;
      min-height: 150px;
    }

    .flow-node span {
      display: inline-block;
      color: var(--blue);
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .flow-node strong {
      display: block;
      color: var(--navy);
      font-size: 24px;
      margin-bottom: 8px;
    }

    .flow-node p {
      font-size: 13px;
      line-height: 1.55;
    }

    .flow-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-size: 24px;
      font-family: "Space Mono", monospace;
      font-weight: 700;
    }

    .reader-grid,
    .week-panels,
    .closing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 20px 0;
    }

    .reader-grid article,
    .week-panels article,
    .closing-grid article,
    .phase-card {
      border: 1px solid var(--line);
      background: rgba(255, 255, 255, .78);
      border-radius: 8px;
      padding: 16px;
    }

    .reader-grid p,
    .closing-grid p {
      font-size: 13px;
      line-height: 1.65;
    }

    .source-table-wrap {
      max-height: 370px;
      overflow: auto;
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-top: 20px;
    }

    .source-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    th,
    td {
      border-bottom: 1px solid var(--line);
      padding: 9px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background: var(--blue-soft);
      color: var(--navy);
      font-size: 11px;
      font-family: "Space Mono", monospace;
      text-transform: uppercase;
    }

    .phase-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin-top: 24px;
    }

    .phase-card:nth-child(5) {
      grid-column: 1 / -1;
    }

    .phase-topline {
      display: flex;
      justify-content: space-between;
      color: var(--blue);
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 18px;
    }

    .phase-card p {
      font-size: 14px;
      line-height: 1.65;
    }

    .week-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .week-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 30px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--blue-soft);
      font-family: "Space Mono", monospace;
      font-size: 11px;
      font-weight: 700;
    }

    .diagram-block {
      margin-top: 26px;
    }

    .ladder {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-top: 12px;
      align-items: stretch;
    }

    .ladder div {
      border-left: 4px solid var(--blue);
      background: var(--blue-soft);
      padding: 12px;
      min-height: 150px;
    }

    .ladder span {
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
    }

    .ladder strong {
      display: block;
      margin: 8px 0;
      color: var(--navy);
      font-size: 14px;
      line-height: 1.35;
    }

    .ladder p {
      font-size: 12px;
      line-height: 1.5;
    }

    .week-mini-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 24px;
    }

    .week-mini {
      min-height: 96px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .82);
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .week-mini span {
      font-family: "Archivo", sans-serif;
      font-size: 26px;
      color: var(--blue);
      line-height: 1;
    }

    .week-mini strong {
      color: var(--navy);
      font-size: 13px;
      line-height: 1.35;
    }

    .week-mini em {
      color: var(--faint);
      font-style: normal;
      font-size: 11px;
      font-family: "Space Mono", monospace;
    }

    .checkpoint-band {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0;
      border: 1px solid var(--line);
      margin-top: 28px;
    }

    .checkpoint-band div {
      padding: 14px;
      border-right: 1px solid var(--line);
      background: var(--blue-soft);
    }

    .checkpoint-band div:last-child {
      border-right: 0;
    }

    .checkpoint-band span {
      display: block;
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .checkpoint-band strong {
      color: var(--navy);
      font-size: 13px;
      line-height: 1.35;
    }

    .week-hero {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 18px;
      align-items: start;
      margin-bottom: 18px;
    }

    .week-icon {
      width: 88px;
      height: 88px;
      border: 1px solid var(--line);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      background: var(--blue-soft);
      font-size: 18px;
      font-weight: 700;
    }

    .mission {
      max-width: 720px;
      font-size: 16px;
    }

    .week-panels {
      grid-template-columns: repeat(3, 1fr);
      align-items: start;
    }

    .week-panels article {
      min-height: 210px;
    }

    .week-panels ul {
      padding-left: 18px;
    }

    .week-panels li {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.62;
      margin-bottom: 7px;
    }

    .acceptance {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 16px;
      align-items: start;
      margin: 18px 0 12px;
      border-left: 4px solid var(--blue);
      background: var(--blue-soft);
      padding: 14px 16px;
    }

    .acceptance strong {
      color: var(--navy);
      font-size: 14px;
    }

    .acceptance p {
      font-size: 13px;
      line-height: 1.65;
    }

    .outputs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 14px;
    }

    .outputs span {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 5px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--blue-dark);
      background: rgba(255, 255, 255, .85);
      font-size: 12px;
      font-weight: 700;
    }

    .chapter-head {
      display: grid;
      grid-template-columns: 128px 1fr;
      gap: 18px;
      align-items: start;
      margin-bottom: 20px;
    }

    .chapter-head span,
    .section-number,
    .source-note,
    .decision-chain span,
    .route-map span,
    .three-rules strong {
      font-family: "Space Mono", monospace;
      text-transform: uppercase;
    }

    .chapter-head span {
      color: var(--blue);
      font-size: 11px;
      font-weight: 700;
      padding-top: 8px;
    }

    .chapter-summary {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 18px;
      align-items: start;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--blue-soft);
      padding: 16px;
      margin-bottom: 20px;
    }

    .chapter-section {
      display: grid;
      grid-template-columns: 64px 1fr;
      gap: 16px;
      margin: 18px 0;
      align-items: start;
    }

    .chapter-section.full {
      margin-top: 0;
    }

    .section-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--blue-soft);
      color: var(--blue);
      font-size: 14px;
      font-weight: 700;
    }

    .chapter-section p {
      font-size: 13px;
      line-height: 1.68;
      margin-bottom: 12px;
    }

    .subsection-title {
      margin-top: 16px;
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 10.8px;
      background: rgba(255, 255, 255, .84);
      border: 1px solid var(--line);
    }

    .report-table th,
    .report-table td {
      padding: 7px 8px;
      line-height: 1.48;
      word-break: break-word;
    }

    .report-table td {
      color: var(--muted);
    }

    .report-table code {
      font-family: "Space Mono", monospace;
      color: var(--blue-dark);
      background: var(--blue-soft);
      padding: 1px 4px;
      border-radius: 4px;
    }

    .compact-table {
      font-size: 10px;
    }

    .matrix-table {
      font-size: 7.8px;
    }

    .matrix-table th,
    .matrix-table td {
      padding: 4px 4px;
      line-height: 1.38;
    }

    .risk-table {
      font-size: 8.9px;
    }

    .check-table {
      max-width: 520px;
    }

    .note-band {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 14px;
      align-items: start;
      margin-top: 16px;
      border-left: 5px solid var(--blue);
      background: var(--blue-soft);
      padding: 14px 16px;
      border-radius: 8px;
    }

    .note-band strong {
      color: var(--navy);
      font-size: 13px;
    }

    .note-band p {
      font-size: 12.5px;
      line-height: 1.65;
      margin: 0;
    }

    .source-note {
      margin-top: 14px;
      color: var(--faint);
      font-size: 10px;
      font-weight: 700;
    }

    #week-04 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-04 .chapter-section {
      margin: 14px 0;
    }

    #week-04 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-04 .source-note {
      margin-top: 8px;
    }

    #week-05 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-05 .chapter-section {
      margin: 14px 0;
    }

    #week-05 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-05 .source-note {
      margin-top: 8px;
    }

    #week-06 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-06 .chapter-section {
      margin: 14px 0;
    }

    #week-06 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-06 .source-note {
      margin-top: 8px;
    }

    #week-07 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-07 .chapter-section {
      margin: 14px 0;
    }

    #week-07 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-07 .source-note {
      margin-top: 8px;
    }

    #week-07 .compact-table {
      font-size: 8.7px;
    }

    #week-07 .compact-table th,
    #week-07 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-08 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-08 .chapter-section {
      margin: 14px 0;
    }

    #week-08 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-08 .source-note {
      margin-top: 8px;
    }

    #week-08 .compact-table {
      font-size: 8.7px;
    }

    #week-08 .compact-table th,
    #week-08 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-09 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-09 .chapter-section {
      margin: 14px 0;
    }

    #week-09 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-09 .source-note {
      margin-top: 8px;
    }

    #week-09 .compact-table {
      font-size: 8.7px;
    }

    #week-09 .compact-table th,
    #week-09 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-10 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-10 .chapter-section {
      margin: 14px 0;
    }

    #week-10 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-10 .source-note {
      margin-top: 8px;
    }

    #week-10 .compact-table {
      font-size: 8.7px;
    }

    #week-10 .compact-table th,
    #week-10 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-11 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-11 .chapter-section {
      margin: 14px 0;
    }

    #week-11 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-11 .source-note {
      margin-top: 8px;
    }

    #week-11 .compact-table {
      font-size: 8.7px;
    }

    #week-11 .compact-table th,
    #week-11 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-12 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-12 .chapter-section {
      margin: 14px 0;
    }

    #week-12 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-12 .source-note {
      margin-top: 8px;
    }

    #week-12 .compact-table {
      font-size: 8.7px;
    }

    #week-12 .compact-table th,
    #week-12 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-13 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-13 .chapter-section {
      margin: 14px 0;
    }

    #week-13 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-13 .source-note {
      margin-top: 8px;
    }

    #week-13 .compact-table {
      font-size: 8.7px;
    }

    #week-13 .compact-table th,
    #week-13 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-14 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-14 .chapter-section {
      margin: 14px 0;
    }

    #week-14 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-14 .source-note {
      margin-top: 8px;
    }

    #week-14 .compact-table {
      font-size: 8.7px;
    }

    #week-14 .compact-table th,
    #week-14 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-15 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-15 .chapter-section {
      margin: 14px 0;
    }

    #week-15 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-15 .source-note {
      margin-top: 8px;
    }

    #week-15 .compact-table {
      font-size: 8.7px;
    }

    #week-15 .compact-table th,
    #week-15 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-16 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-16 .chapter-section {
      margin: 14px 0;
    }

    #week-16 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-16 .source-note {
      margin-top: 8px;
    }

    #week-16 .compact-table {
      font-size: 8.7px;
    }

    #week-16 .compact-table th,
    #week-16 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-17 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-17 .chapter-section {
      margin: 14px 0;
    }

    #week-17 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-17 .source-note {
      margin-top: 8px;
    }

    #week-17 .compact-table {
      font-size: 8.7px;
    }

    #week-17 .compact-table th,
    #week-17 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-18 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-18 .chapter-section {
      margin: 14px 0;
    }

    #week-18 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-18 .source-note {
      margin-top: 8px;
    }

    #week-18 .compact-table {
      font-size: 8.7px;
    }

    #week-18 .compact-table th,
    #week-18 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-19 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-19 .chapter-section {
      margin: 14px 0;
    }

    #week-19 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-19 .source-note {
      margin-top: 8px;
    }

    #week-19 .compact-table {
      font-size: 8.7px;
    }

    #week-19 .compact-table th,
    #week-19 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    #week-20 .chapter-summary {
      padding: 14px;
      margin-bottom: 14px;
    }

    #week-20 .chapter-section {
      margin: 14px 0;
    }

    #week-20 .tip-callout {
      margin-top: 12px;
      padding: 12px 14px;
    }

    #week-20 .source-note {
      margin-top: 8px;
    }

    #week-20 .compact-table {
      font-size: 8.7px;
    }

    #week-20 .compact-table th,
    #week-20 .compact-table td {
      padding: 4px;
      line-height: 1.32;
    }

    .three-rules {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 16px;
    }

    .three-rules div {
      min-height: 76px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--blue-soft);
      padding: 12px;
    }

    .three-rules strong {
      display: block;
      color: var(--blue);
      font-size: 12px;
      margin-bottom: 8px;
    }

    .three-rules span {
      display: block;
      color: var(--navy);
      font-size: 12px;
      line-height: 1.5;
      font-weight: 700;
    }

    .decision-chain,
    .route-map {
      display: grid;
      gap: 8px;
      margin: 14px 0;
    }

    .decision-chain {
      grid-template-columns: repeat(3, 1fr);
    }

    .route-map {
      grid-template-columns: repeat(5, 1fr);
    }

    .decision-chain div,
    .route-map div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 12px;
      min-height: 96px;
    }

    .decision-chain span,
    .route-map span {
      display: block;
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .decision-chain strong,
    .route-map strong {
      display: block;
      color: var(--navy);
      font-size: 13px;
      line-height: 1.35;
      margin-bottom: 8px;
    }

    .decision-chain em {
      display: block;
      color: var(--muted);
      font-style: normal;
      font-size: 11px;
      line-height: 1.45;
    }

    .route-map p {
      font-size: 11px;
      line-height: 1.5;
      margin: 0;
    }

    .script-box {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfdff;
      padding: 16px;
    }

    .script-box p {
      font-size: 12px;
      line-height: 1.72;
      margin-bottom: 10px;
    }

    .tip-callout {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 14px;
      align-items: start;
      margin-top: 16px;
      border: 1px solid rgba(23, 107, 85, .28);
      border-left: 5px solid var(--mint-ink);
      background: var(--mint);
      padding: 14px 16px;
      border-radius: 8px;
    }

    .tip-callout strong {
      color: var(--mint-ink);
      font-size: 13px;
    }

    .tip-callout p {
      margin: 0;
      font-size: 12.5px;
      line-height: 1.65;
      color: #254f45;
    }

    .runtime-diagram,
    .queue-map {
      display: grid;
      align-items: stretch;
      gap: 10px;
      margin: 18px 0;
    }

    .runtime-diagram {
      grid-template-columns: 1fr 1fr 28px 1.2fr 28px 1.5fr;
    }

    .queue-map {
      grid-template-columns: 1fr 28px 1fr 28px 1fr 28px 1.2fr;
    }

    .diagram-card,
    .diagram-stack div,
    .worker-stack div,
    .mini-architecture div,
    .three-layer-map div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 12px;
      color: var(--navy);
      font-weight: 800;
      font-size: 13px;
      line-height: 1.35;
    }

    .diagram-card span,
    .diagram-stack span,
    .mini-architecture small {
      display: block;
      margin-top: 6px;
      color: var(--muted);
      font-size: 10.5px;
      font-weight: 500;
      line-height: 1.4;
    }

    .diagram-card.actor {
      background: var(--blue-soft);
    }

    .diagram-card.process {
      background: var(--amber);
    }

    .diagram-card.storage {
      background: var(--mint);
    }

    .diagram-stack,
    .worker-stack {
      display: grid;
      gap: 8px;
    }

    .state-equation,
    .shared-state-band,
    .migration-bundle {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-top: 16px;
    }

    .state-equation span,
    .shared-state-band span,
    .migration-bundle span {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 5px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--blue-soft);
      color: var(--blue-dark);
      font-size: 11px;
      font-weight: 800;
    }

    .state-equation strong,
    .migration-bundle strong {
      color: var(--navy);
      font-size: 14px;
    }

    .mini-architecture {
      display: grid;
      grid-template-columns: 1fr 58px 1fr 58px 1.2fr 58px 1.2fr;
      gap: 8px;
      align-items: stretch;
      margin: 12px 0 2px;
    }

    .mini-architecture span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
    }

    .three-layer-map {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 12px;
    }

    .three-layer-map span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .three-layer-map strong {
      display: block;
      margin-bottom: 8px;
    }

    .three-layer-map p {
      margin: 0;
      font-size: 11px;
      line-height: 1.5;
    }

    .inventory-table {
      font-size: 7.65px;
    }

    .inventory-table th,
    .inventory-table td {
      padding: 4px 4px;
      line-height: 1.35;
    }

    .risk-card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 14px;
    }

    .risk-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 12px;
    }

    .risk-card h3 {
      font-size: 14px;
      margin-bottom: 10px;
    }

    .risk-card-table {
      font-size: 8px;
    }

    .risk-card-table th,
    .risk-card-table td {
      padding: 4px;
      line-height: 1.34;
    }

    .migration-bundle {
      border-top: 1px solid var(--line);
      padding-top: 16px;
    }

    .migration-bundle strong {
      display: block;
      width: 100%;
      border: 1px solid var(--line-strong);
      border-radius: 8px;
      background: var(--blue-soft);
      padding: 14px;
      text-align: center;
    }

    .decision-table,
    .backup-table,
    .coverage-table,
    .binary-table {
      font-size: 7.7px;
    }

    .decision-table th,
    .decision-table td,
    .backup-table th,
    .backup-table td,
    .coverage-table th,
    .coverage-table td,
    .binary-table th,
    .binary-table td {
      padding: 4px;
      line-height: 1.34;
    }

    .db-flow,
    .backup-flow {
      display: grid;
      align-items: stretch;
      gap: 8px;
      margin: 14px 0;
    }

    .db-flow {
      grid-template-columns: repeat(5, 1fr);
    }

    .backup-flow {
      grid-template-columns: 1fr 22px 1fr 22px 1fr 22px 1fr 22px 1fr 22px 1fr 22px 1fr;
    }

    .db-flow div,
    .backup-flow div,
    .mistake-grid div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 11px;
      color: var(--navy);
      font-size: 12px;
      line-height: 1.45;
      font-weight: 800;
    }

    .db-flow span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .db-flow strong {
      display: block;
      margin-bottom: 8px;
    }

    .db-flow p {
      margin: 0;
      font-size: 10.5px;
      line-height: 1.45;
    }

    .backup-flow span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 13px;
      font-weight: 700;
    }

    .mistake-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 12px;
    }

    .mistake-grid div:nth-child(5) {
      grid-column: 1 / -1;
      background: var(--blue-soft);
    }

    .url-table,
    .oauth-table,
    .glossary-table {
      font-size: 7.7px;
    }

    .url-table th,
    .url-table td,
    .oauth-table th,
    .oauth-table td,
    .glossary-table th,
    .glossary-table td {
      padding: 4px;
      line-height: 1.34;
    }

    .url-flow {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 14px 0;
    }

    .url-flow div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 9px;
      min-height: 96px;
    }

    .url-flow span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .url-flow strong {
      display: block;
      color: var(--navy);
      font-size: 12px;
      line-height: 1.35;
      margin-bottom: 6px;
    }

    .url-flow p {
      margin: 0;
      font-size: 10.3px;
      line-height: 1.35;
      color: var(--muted);
    }

    .public-url-model,
    .callback-flow {
      display: grid;
      grid-template-columns: 1fr 22px 1fr 22px 1fr 22px 1fr 22px 1fr 22px 1fr;
      align-items: stretch;
      gap: 8px;
      margin: 14px 0;
    }

    .public-url-model div,
    .callback-flow div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 10px;
      color: var(--navy);
      font-size: 11.5px;
      line-height: 1.4;
      font-weight: 800;
    }

    .public-url-model div {
      display: flex;
      min-height: 74px;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }

    .callback-flow div {
      min-height: 82px;
    }

    .public-url-model small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 10px;
      line-height: 1.35;
      font-weight: 500;
    }

    .public-url-model span,
    .callback-flow span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 13px;
      font-weight: 700;
    }

    .command-block {
      margin: 8px 0;
      border: 1px solid rgba(15, 23, 42, .18);
      border-radius: 8px;
      background: #111827;
      color: #e5eefb;
      padding: 10px 12px;
      font-family: "Space Mono", monospace;
      font-size: 8.7px;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .command-block.short {
      padding: 8px 10px;
      font-size: 9.2px;
    }

    .command-block.output {
      background: #10251f;
      color: #d8f3e8;
    }

    .week5-source-table,
    .env-table,
    .docker-table,
    .evidence-table,
    .week5-completion-table {
      font-size: 7.7px;
    }

    .week5-source-table th,
    .week5-source-table td,
    .env-table th,
    .env-table td,
    .docker-table th,
    .docker-table td,
    .evidence-table th,
    .evidence-table td,
    .week5-completion-table th,
    .week5-completion-table td {
      padding: 4px;
      line-height: 1.34;
    }

    .command-grid,
    .ops-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 12px;
    }

    .command-grid > div,
    .ops-grid > div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 10px;
    }

    .command-grid h3,
    .ops-grid span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .docker-path-map {
      display: grid;
      grid-template-columns: 1fr 18px 1fr 18px 1fr 18px 1fr 18px 1fr 18px 1fr;
      align-items: stretch;
      gap: 6px;
      margin: 14px 0;
    }

    .docker-path-map div,
    .persistence-flow div,
    .least-friction-flow div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .docker-path-map div {
      display: flex;
      min-height: 62px;
      flex-direction: column;
      justify-content: center;
      padding: 7px;
      text-align: center;
      font-size: 10px;
    }

    .docker-path-map span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 11px;
      font-weight: 700;
    }

    .docker-path-map small,
    .persistence-flow small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 9px;
      line-height: 1.35;
      font-weight: 500;
    }

    .persistence-flow {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 14px 0;
    }

    .persistence-flow div {
      min-height: 88px;
      padding: 9px;
      font-size: 11px;
    }

    .persistence-flow span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .least-friction-flow {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-top: 14px;
    }

    .least-friction-flow div {
      min-height: 74px;
      padding: 9px;
      font-size: 10.5px;
    }

    .least-friction-flow div:last-child {
      background: var(--mint);
      color: var(--mint-ink);
    }

    .week6-source-table,
    .week6-observation-table,
    .week6-comparison-table,
    .stop-table,
    .upgrade-table,
    .week6-completion-table {
      font-size: 7.65px;
    }

    .week6-source-table th,
    .week6-source-table td,
    .week6-observation-table th,
    .week6-observation-table td,
    .week6-comparison-table th,
    .week6-comparison-table td,
    .stop-table th,
    .stop-table td,
    .upgrade-table th,
    .upgrade-table td,
    .week6-completion-table th,
    .week6-completion-table td {
      padding: 4px;
      line-height: 1.34;
    }

    .week6-decision-flow {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin: 14px 0;
    }

    .week6-decision-flow div,
    .state-map-compare div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week6-decision-flow div {
      min-height: 132px;
      padding: 10px;
      font-size: 11px;
    }

    .week6-decision-flow span,
    .state-map-compare span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 7px;
      text-transform: uppercase;
    }

    .week6-decision-flow strong,
    .state-map-compare strong {
      display: block;
      margin-bottom: 8px;
    }

    .week6-decision-flow p,
    .state-map-compare p {
      margin: 0;
      color: var(--muted);
      font-size: 10.5px;
      line-height: 1.45;
      font-weight: 500;
    }

    .state-map-compare {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 14px;
    }

    .state-map-compare div {
      min-height: 180px;
      padding: 14px;
    }

    .week7-source-table,
    .week7-stack-table,
    .compose-explain-table,
    .env-var-table,
    .production-shape-table,
    .production-gap-table,
    .week7-completion-table {
      font-size: 7.55px;
    }

    .week7-source-table th,
    .week7-source-table td,
    .week7-stack-table th,
    .week7-stack-table td,
    .compose-explain-table th,
    .compose-explain-table td,
    .env-var-table th,
    .env-var-table td,
    .production-shape-table th,
    .production-shape-table td,
    .production-gap-table th,
    .production-gap-table td,
    .week7-completion-table th,
    .week7-completion-table td {
      padding: 4px;
      line-height: 1.32;
    }

    .command-block.yaml-block,
    .command-block.dotenv-block,
    .command-block.sql-block {
      font-size: 7.7px;
      line-height: 1.32;
      padding: 9px 11px;
    }

    .week8-source-table,
    .week8-env-table,
    .tunnel-table,
    .webhook-test-table,
    .readiness-table,
    .week8-completion-table {
      font-size: 7.55px;
    }

    .week8-source-table th,
    .week8-source-table td,
    .week8-env-table th,
    .week8-env-table td,
    .tunnel-table th,
    .tunnel-table td,
    .webhook-test-table th,
    .webhook-test-table td,
    .readiness-table th,
    .readiness-table td,
    .week8-completion-table th,
    .week8-completion-table td {
      padding: 4px;
      line-height: 1.32;
    }

    .command-block.json-block {
      font-size: 8.2px;
      line-height: 1.38;
      padding: 10px 12px;
    }

    .week8-public-pipeline {
      display: grid;
      grid-template-columns: 1fr 18px 1fr 18px 1fr 18px 1fr 18px 1fr 18px 1fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week8-public-pipeline div {
      min-height: 62px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 10px;
      font-weight: 800;
      line-height: 1.35;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week8-public-pipeline span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week8-decision-flow {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin: 14px 0;
    }

    .week8-decision-flow div {
      min-height: 118px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 10px;
      color: var(--navy);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.35;
    }

    .week8-decision-flow span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 7px;
      text-transform: uppercase;
    }

    .week8-decision-flow strong {
      display: block;
      margin-bottom: 8px;
    }

    .week8-decision-flow p {
      margin: 0;
      color: var(--muted);
      font-size: 10.5px;
      font-weight: 500;
      line-height: 1.45;
    }

    .week8-success-card {
      margin-top: 16px;
      border: 1px solid var(--line-strong);
      border-radius: 8px;
      background: var(--mint);
      padding: 16px;
    }

    .week8-success-card span {
      display: block;
      color: var(--mint-ink);
      font-family: "Space Mono", monospace;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .week8-success-card strong {
      color: var(--navy);
      font-size: 14px;
      line-height: 1.45;
    }

    .week9-source-table,
    .cloud-fit-table,
    .execution-table,
    .formula-table,
    .responsibility-table,
    .cloud-plan-table,
    .cloud-limit-table,
    .beginner-table,
    .minimal-rule-table,
    .workload-table,
    .week9-completion-table {
      font-size: 7.55px;
    }

    .week9-source-table th,
    .week9-source-table td,
    .cloud-fit-table th,
    .cloud-fit-table td,
    .execution-table th,
    .execution-table td,
    .formula-table th,
    .formula-table td,
    .responsibility-table th,
    .responsibility-table td,
    .cloud-plan-table th,
    .cloud-plan-table td,
    .cloud-limit-table th,
    .cloud-limit-table td,
    .beginner-table th,
    .beginner-table td,
    .minimal-rule-table th,
    .minimal-rule-table td,
    .workload-table th,
    .workload-table td,
    .week9-completion-table th,
    .week9-completion-table td {
      padding: 4px;
      line-height: 1.32;
    }

    .week9-routing-map {
      display: grid;
      grid-template-columns: 1.15fr 18px 1.15fr 18px 1.15fr 18px 1.15fr;
      gap: 8px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week9-routing-map div {
      min-height: 76px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 10px;
      color: var(--navy);
      line-height: 1.35;
    }

    .week9-routing-map span,
    .week9-cloud-flow span,
    .week9-error-surface span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 7px;
      text-transform: uppercase;
    }

    .week9-routing-map strong,
    .week9-cloud-flow strong,
    .week9-error-surface strong {
      display: block;
      color: var(--navy);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.38;
    }

    .week9-routing-map i {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 11px;
      font-style: normal;
      font-weight: 700;
    }

    .week9-cloud-flow {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin: 14px 0;
    }

    .week9-cloud-flow div {
      min-height: 132px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 10px;
    }

    .week9-cloud-flow p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 10.3px;
      font-weight: 500;
      line-height: 1.45;
    }

    .week9-error-surface {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .week9-error-surface div {
      min-height: 150px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--blue-soft);
      padding: 16px;
    }

    .week9-error-surface div:last-child {
      background: var(--mint);
    }

    .week10-source-table,
    .blueprint-table,
    .principle-table,
    .compose10-table,
    .caddy10-table,
    .env10-table,
    .firewall-table,
    .acceptance10-table,
    .runbook10-table,
    .forbidden10-table,
    .troubleshooting10-table {
      font-size: 7.55px;
    }

    .week10-source-table th,
    .week10-source-table td,
    .blueprint-table th,
    .blueprint-table td,
    .principle-table th,
    .principle-table td,
    .compose10-table th,
    .compose10-table td,
    .caddy10-table th,
    .caddy10-table td,
    .env10-table th,
    .env10-table td,
    .firewall-table th,
    .firewall-table td,
    .acceptance10-table th,
    .acceptance10-table td,
    .runbook10-table th,
    .runbook10-table td,
    .forbidden10-table th,
    .forbidden10-table td,
    .troubleshooting10-table th,
    .troubleshooting10-table td {
      padding: 4px;
      line-height: 1.32;
    }

    .week10-architecture-strip {
      display: grid;
      grid-template-columns: 1fr 14px 1fr 14px 1fr 14px 1fr 14px 1fr 14px 1fr 14px 1fr;
      gap: 5px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week10-architecture-strip div {
      min-height: 58px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 7px;
      color: var(--navy);
      font-size: 9.2px;
      font-weight: 800;
      line-height: 1.35;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week10-architecture-strip span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week10-boundary-map,
    .week10-port-map {
      display: grid;
      gap: 10px;
      margin-top: 14px;
    }

    .week10-boundary-map {
      grid-template-columns: repeat(3, 1fr);
    }

    .week10-port-map {
      grid-template-columns: repeat(2, 1fr);
    }

    .week10-boundary-map div,
    .week10-port-map div {
      min-height: 140px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 14px;
    }

    .week10-port-map div:first-child {
      background: var(--mint);
    }

    .week10-port-map div:last-child {
      background: var(--blue-soft);
    }

    .week10-boundary-map span,
    .week10-port-map span,
    .week10-acceptance-card span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .week10-boundary-map strong,
    .week10-port-map strong {
      display: block;
      color: var(--navy);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .week10-boundary-map p,
    .week10-port-map p {
      margin: 0;
      color: var(--muted);
      font-size: 10.5px;
      font-weight: 500;
      line-height: 1.48;
    }

    .command-block.compose10-block {
      font-size: 6.35px;
      line-height: 1.18;
      padding: 7px 9px;
      margin-top: 6px;
    }

    .command-block.caddy10-block,
    .command-block.bash-block {
      font-size: 8.1px;
      line-height: 1.36;
      padding: 10px 12px;
    }

    .week10-acceptance-card {
      border: 1px solid var(--line-strong);
      border-radius: 8px;
      background: var(--mint);
      padding: 18px;
    }

    .week10-acceptance-card strong {
      display: block;
      color: var(--navy);
      font-size: 15px;
      line-height: 1.45;
      margin-bottom: 10px;
    }

    .week10-acceptance-card p {
      margin: 0;
      color: var(--mint-ink);
      font-size: 12.2px;
      line-height: 1.62;
      font-weight: 600;
    }

    .week11-source-table,
    .paas-platform-card,
    .paas-ops-table,
    .risk11-table,
    .selection11-table,
    .selection-summary-table,
    .model11-table,
    .env11-table,
    .startup11-table,
    .acceptance11-table,
    .week11-completion-table {
      font-size: 7.45px;
    }

    .week11-source-table th,
    .week11-source-table td,
    .paas-platform-card th,
    .paas-platform-card td,
    .paas-ops-table th,
    .paas-ops-table td,
    .risk11-table th,
    .risk11-table td,
    .selection11-table th,
    .selection11-table td,
    .selection-summary-table th,
    .selection-summary-table td,
    .model11-table th,
    .model11-table td,
    .env11-table th,
    .env11-table td,
    .startup11-table th,
    .startup11-table td,
    .acceptance11-table th,
    .acceptance11-table td,
    .week11-completion-table th,
    .week11-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week11-state-flow {
      display: grid;
      grid-template-columns: 1fr 16px 1fr 16px 1fr 16px 1fr 16px 1fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week11-state-flow div {
      min-height: 64px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 9.6px;
      font-weight: 800;
      line-height: 1.34;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week11-state-flow span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
    }

    .paas-platform-card td:first-child {
      width: 28%;
      color: var(--navy);
      font-weight: 800;
    }

    .week11-quadrant {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, minmax(180px, 1fr));
      gap: 10px;
      margin-top: 14px;
    }

    .week11-quadrant .q {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .week11-quadrant .q1,
    .week11-quadrant .q2 {
      background: var(--mint);
    }

    .week11-quadrant .q4 {
      background: var(--blue-soft);
    }

    .week11-quadrant span,
    .week11-risk-map span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .week11-quadrant strong,
    .week11-risk-map strong {
      display: block;
      color: var(--navy);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.45;
    }

    .week11-quadrant em {
      color: var(--muted);
      font-size: 10.5px;
      font-style: normal;
      font-weight: 600;
      line-height: 1.45;
    }

    .week11-risk-map {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 14px 0;
    }

    .week11-risk-map div {
      min-height: 132px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 12px;
    }

    .week12-source-table,
    .cloudrun-mode-table,
    .durable12-table,
    .env12-table,
    .acceptance12-table,
    .aws-stage-table,
    .aws-ladder-table,
    .premature12-table,
    .adoption12-table,
    .go-nogo12-table,
    .route12-table,
    .cost12-table,
    .week12-completion-table {
      font-size: 7.45px;
    }

    .week12-source-table th,
    .week12-source-table td,
    .cloudrun-mode-table th,
    .cloudrun-mode-table td,
    .durable12-table th,
    .durable12-table td,
    .env12-table th,
    .env12-table td,
    .acceptance12-table th,
    .acceptance12-table td,
    .aws-stage-table th,
    .aws-stage-table td,
    .aws-ladder-table th,
    .aws-ladder-table td,
    .premature12-table th,
    .premature12-table td,
    .adoption12-table th,
    .adoption12-table td,
    .go-nogo12-table th,
    .go-nogo12-table td,
    .route12-table th,
    .route12-table td,
    .cost12-table th,
    .cost12-table td,
    .week12-completion-table th,
    .week12-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week12-decision-strip {
      display: grid;
      grid-template-columns: 1fr 16px 1.2fr 16px 1.2fr 16px 1.2fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week12-decision-strip div {
      min-height: 64px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 9.6px;
      font-weight: 800;
      line-height: 1.34;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week12-decision-strip span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week12-cloudrun-map {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 14px;
    }

    .week12-cloudrun-map div {
      min-height: 150px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 14px;
    }

    .week12-cloudrun-map div:nth-child(3),
    .week12-cloudrun-map div:nth-child(4) {
      background: var(--mint);
    }

    .week12-cloudrun-map span,
    .week12-aws-evolution span,
    .week12-building-blocks div {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .week12-cloudrun-map strong,
    .week12-aws-evolution strong {
      display: block;
      color: var(--navy);
      font-size: 12.5px;
      font-weight: 800;
      line-height: 1.4;
      margin-bottom: 8px;
    }

    .week12-cloudrun-map p,
    .week12-aws-evolution p {
      margin: 0;
      color: var(--muted);
      font-size: 10.4px;
      font-weight: 500;
      line-height: 1.48;
    }

    .week12-aws-evolution {
      display: grid;
      grid-template-columns: 1fr 20px 1.15fr 20px 1.2fr;
      gap: 8px;
      align-items: stretch;
      margin-top: 14px;
    }

    .week12-aws-evolution div {
      min-height: 210px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 14px;
    }

    .week12-aws-evolution div:nth-of-type(2) {
      background: var(--blue-soft);
    }

    .week12-aws-evolution div:nth-of-type(3) {
      background: var(--mint);
    }

    .week12-aws-evolution .arrow {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week12-building-blocks {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
      margin-top: 16px;
    }

    .week12-building-blocks div {
      min-height: 72px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--blue-soft);
      padding: 12px;
      color: var(--navy);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .week13-source-table,
    .sizing13-table,
    .smallbiz13-table,
    .adjust13-table,
    .binary-risk13-table,
    .metrics13-table,
    .smallbiz-start13-table,
    .upgrade13-table,
    .runbook13-table,
    .week13-completion-table {
      font-size: 7.45px;
    }

    .week13-source-table th,
    .week13-source-table td,
    .sizing13-table th,
    .sizing13-table td,
    .smallbiz13-table th,
    .smallbiz13-table td,
    .adjust13-table th,
    .adjust13-table td,
    .binary-risk13-table th,
    .binary-risk13-table td,
    .metrics13-table th,
    .metrics13-table td,
    .smallbiz-start13-table th,
    .smallbiz-start13-table td,
    .upgrade13-table th,
    .upgrade13-table td,
    .runbook13-table th,
    .runbook13-table td,
    .week13-completion-table th,
    .week13-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week13-workload-flow {
      display: grid;
      grid-template-columns: 1fr 16px 1fr 16px 1fr 16px 1.15fr 16px 1fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week13-workload-flow div {
      min-height: 64px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 9.2px;
      font-weight: 800;
      line-height: 1.34;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week13-workload-flow span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week13-sizing-ladder {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 14px;
    }

    .week13-sizing-ladder div,
    .week13-binary-map div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 14px;
    }

    .week13-sizing-ladder div {
      min-height: 118px;
    }

    .week13-sizing-ladder div:nth-child(4) {
      background: var(--mint);
    }

    .week13-sizing-ladder span,
    .week13-binary-map span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .week13-sizing-ladder strong,
    .week13-binary-map strong {
      display: block;
      color: var(--navy);
      font-size: 12.4px;
      font-weight: 800;
      line-height: 1.42;
    }

    .week13-binary-map {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 9px;
      margin-top: 16px;
    }

    .week13-binary-map div {
      min-height: 142px;
    }

    .week13-binary-map div:first-child {
      background: var(--blue-soft);
    }

    .week13-binary-map div:nth-child(4) {
      background: var(--mint);
    }

    .week13-binary-map p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 10.4px;
      line-height: 1.45;
      font-weight: 500;
    }

    .week14-source-table,
    .backup-scope14-table,
    .backup-accept14-table,
    .restore-accept14-table,
    .restore-failure14-table,
    .update-check14-table,
    .drill-data14-table,
    .drill-timeline14-table,
    .drill-pass14-table,
    .update-before14-table,
    .smoke14-table,
    .assets14-table,
    .week14-completion-table {
      font-size: 7.45px;
    }

    .week14-source-table th,
    .week14-source-table td,
    .backup-scope14-table th,
    .backup-scope14-table td,
    .backup-accept14-table th,
    .backup-accept14-table td,
    .restore-accept14-table th,
    .restore-accept14-table td,
    .restore-failure14-table th,
    .restore-failure14-table td,
    .update-check14-table th,
    .update-check14-table td,
    .drill-data14-table th,
    .drill-data14-table td,
    .drill-timeline14-table th,
    .drill-timeline14-table td,
    .drill-pass14-table th,
    .drill-pass14-table td,
    .update-before14-table th,
    .update-before14-table td,
    .smoke14-table th,
    .smoke14-table td,
    .assets14-table th,
    .assets14-table td,
    .week14-completion-table th,
    .week14-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week14-flow {
      display: grid;
      grid-template-columns: 1fr 16px 1fr 16px 1.25fr 16px 1fr 16px 1.2fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week14-flow div {
      min-height: 64px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 9.2px;
      font-weight: 800;
      line-height: 1.34;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week14-flow span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week14-restore-map {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
      margin-top: 16px;
    }

    .week14-restore-map div {
      min-height: 86px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 12px;
      color: var(--navy);
      font-size: 10.6px;
      font-weight: 800;
      line-height: 1.38;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .week14-restore-map div:nth-child(5) {
      background: var(--mint);
    }

    .command-block.backup14-block,
    .command-block.restore14-block {
      font-size: 6.2px;
      line-height: 1.18;
      padding: 7px 9px;
      margin-top: 6px;
    }

    .command-block.update14-block {
      font-size: 7.6px;
      line-height: 1.32;
      padding: 9px 11px;
    }

    .week15-source-table,
    .week15-responsibility-table,
    .week15-summary-table,
    .week15-hardening-table,
    .week15-principle-table,
    .week15-cadence-table,
    .week15-runbook-table,
    .week15-triage-table,
    .week15-emergency-table,
    .week15-completion-table {
      font-size: 7.35px;
    }

    .week15-source-table th,
    .week15-source-table td,
    .week15-responsibility-table th,
    .week15-responsibility-table td,
    .week15-summary-table th,
    .week15-summary-table td,
    .week15-hardening-table th,
    .week15-hardening-table td,
    .week15-principle-table th,
    .week15-principle-table td,
    .week15-cadence-table th,
    .week15-cadence-table td,
    .week15-runbook-table th,
    .week15-runbook-table td,
    .week15-triage-table th,
    .week15-triage-table td,
    .week15-emergency-table th,
    .week15-emergency-table td,
    .week15-completion-table th,
    .week15-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week15-flow {
      display: grid;
      grid-template-columns: 1fr 16px 1fr 16px 1fr 16px 1fr 16px 1fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week15-flow div {
      min-height: 66px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 9.3px;
      font-weight: 800;
      line-height: 1.33;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .week15-flow div:last-child {
      background: var(--mint);
    }

    .week15-flow span,
    .week15-patch-flow span,
    .week15-responsibility-lens span {
      font-family: "Space Mono", monospace;
      text-transform: uppercase;
    }

    .week15-flow > span {
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week15-flow div span {
      color: var(--muted);
      font-size: 7.3px;
      font-weight: 700;
      margin-top: 5px;
    }

    .week15-responsibility-lens,
    .week15-hardening-map,
    .week15-boundary-stack {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .week15-responsibility-lens {
      grid-template-columns: repeat(3, 1fr);
    }

    .week15-responsibility-lens div,
    .week15-hardening-map div,
    .week15-boundary-stack div,
    .week15-patch-flow div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week15-responsibility-lens div {
      min-height: 66px;
      padding: 10px;
    }

    .week15-responsibility-lens span,
    .week15-patch-flow span {
      display: block;
      color: var(--blue);
      font-size: 9px;
      font-weight: 700;
      margin-bottom: 7px;
    }

    .week15-responsibility-lens strong {
      display: block;
      font-size: 10.5px;
    }

    .week15-hardening-map {
      grid-template-columns: repeat(6, 1fr);
    }

    .week15-hardening-map div {
      min-height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 8px;
      font-size: 9.5px;
    }

    .week15-hardening-map div:nth-child(2),
    .week15-hardening-map div:nth-child(6) {
      background: var(--mint);
    }

    .week15-patch-flow {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 14px;
    }

    .week15-patch-flow div {
      min-height: 78px;
      padding: 11px;
    }

    .week15-patch-flow div:nth-child(2) {
      background: #fff4e8;
    }

    .week15-patch-flow div:nth-child(5) {
      background: var(--mint);
    }

    .week15-patch-flow strong {
      display: block;
      font-size: 11px;
      line-height: 1.36;
    }

    .week15-boundary-stack {
      grid-template-columns: repeat(4, 1fr);
    }

    .week15-boundary-stack div {
      min-height: 54px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 10px;
    }

    .week15-boundary-stack div:nth-child(1),
    .week15-boundary-stack div:nth-child(2),
    .week15-boundary-stack div:nth-child(3),
    .week15-boundary-stack div:nth-child(8) {
      background: var(--blue-soft);
    }

    .week16-source-table,
    .week16-ladder-table,
    .week16-route-table,
    .week16-process-table,
    .week16-sequence-table,
    .week16-anti-table,
    .week16-csv-table,
    .week16-single-table,
    .week16-upgrade-table,
    .week16-signal-table,
    .week16-baseline-table,
    .week16-noworker-table,
    .week16-logs-table,
    .week16-completion-table {
      font-size: 7.35px;
    }

    .week16-source-table th,
    .week16-source-table td,
    .week16-ladder-table th,
    .week16-ladder-table td,
    .week16-route-table th,
    .week16-route-table td,
    .week16-process-table th,
    .week16-process-table td,
    .week16-sequence-table th,
    .week16-sequence-table td,
    .week16-anti-table th,
    .week16-anti-table td,
    .week16-csv-table th,
    .week16-csv-table td,
    .week16-single-table th,
    .week16-single-table td,
    .week16-upgrade-table th,
    .week16-upgrade-table td,
    .week16-signal-table th,
    .week16-signal-table td,
    .week16-baseline-table th,
    .week16-baseline-table td,
    .week16-noworker-table th,
    .week16-noworker-table td,
    .week16-logs-table th,
    .week16-logs-table td,
    .week16-completion-table th,
    .week16-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week16-flow {
      display: grid;
      grid-template-columns: 1fr 16px 1.05fr 16px 1.4fr 16px 1.1fr 16px 1.35fr;
      gap: 6px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week16-flow div {
      min-height: 66px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 8.6px;
      font-weight: 800;
      line-height: 1.34;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week16-flow div:nth-child(7) {
      background: var(--mint);
    }

    .week16-flow div:last-child {
      background: #fff4e8;
    }

    .week16-flow span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week16-ladder-map,
    .week16-anti-gate,
    .week16-postgres-first,
    .week16-routing-map,
    .week16-webhook-split,
    .week16-managed-state {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .week16-ladder-map {
      grid-template-columns: repeat(4, 1fr);
    }

    .week16-ladder-map div,
    .week16-anti-gate div,
    .week16-postgres-first div,
    .week16-routing-map div,
    .week16-webhook-split div,
    .week16-managed-state div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week16-ladder-map div {
      min-height: 58px;
      padding: 9px;
    }

    .week16-ladder-map span,
    .week16-anti-gate span,
    .week16-postgres-first span,
    .week16-routing-map span,
    .week16-webhook-split span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 9px;
      font-weight: 700;
      margin-bottom: 7px;
      text-transform: uppercase;
    }

    .week16-ladder-map strong {
      display: block;
      font-size: 10.3px;
    }

    .week16-queue-arch {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-auto-rows: minmax(72px, auto);
      gap: 8px;
      margin-top: 14px;
    }

    .week16-queue-arch div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      padding: 10px;
      font-size: 10.2px;
      font-weight: 800;
      line-height: 1.35;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }

    .week16-queue-arch span {
      display: block;
      color: var(--muted);
      font-size: 8.4px;
      font-weight: 600;
      margin-top: 5px;
    }

    .week16-queue-arch .main,
    .week16-queue-arch .redis,
    .week16-queue-arch .worker {
      background: var(--mint);
    }

    .week16-queue-arch .pg,
    .week16-queue-arch .storage {
      background: var(--blue-soft);
    }

    .week16-anti-gate {
      grid-template-columns: repeat(5, 1fr);
    }

    .week16-anti-gate div {
      min-height: 64px;
      padding: 9px;
    }

    .week16-anti-gate div:nth-child(4) {
      background: var(--mint);
    }

    .week16-anti-gate strong {
      display: block;
      font-size: 10px;
      line-height: 1.32;
    }

    .week16-postgres-first {
      grid-template-columns: repeat(3, 1fr);
    }

    .week16-postgres-first div {
      min-height: 110px;
      padding: 13px;
    }

    .week16-postgres-first div:nth-child(2) {
      background: var(--mint);
    }

    .week16-postgres-first strong {
      display: block;
      font-size: 12px;
    }

    .week16-postgres-first p,
    .week16-webhook-split p {
      color: var(--muted);
      font-size: 10px;
      line-height: 1.45;
      margin: 7px 0 0;
    }

    .week16-routing-map,
    .week16-webhook-split {
      grid-template-columns: repeat(3, 1fr);
    }

    .week16-webhook-split {
      grid-template-columns: repeat(4, 1fr);
    }

    .week16-routing-map div,
    .week16-webhook-split div {
      min-height: 96px;
      padding: 12px;
    }

    .week16-routing-map div:first-child,
    .week16-webhook-split div:nth-child(-n+2) {
      background: var(--mint);
    }

    .week16-routing-map strong,
    .week16-webhook-split strong {
      display: block;
      font-size: 11px;
      line-height: 1.4;
    }

    .week16-routing-map em {
      display: block;
      margin-top: 8px;
      color: var(--muted);
      font-size: 9.5px;
      font-style: normal;
      line-height: 1.4;
    }

    .week16-managed-state {
      grid-template-columns: repeat(4, 1fr);
    }

    .week16-managed-state div {
      min-height: 48px;
      padding: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 10px;
    }

    .week16-managed-state div:nth-child(1),
    .week16-managed-state div:nth-child(2),
    .week16-managed-state div:nth-child(7),
    .week16-managed-state div:nth-child(8) {
      background: var(--blue-soft);
    }

    .week17-source-table,
    .week17-symptom-table,
    .week17-card-table,
    .week17-detail-table,
    .week17-four-table,
    .week17-order-table,
    .week17-command-table,
    .week17-incident-table,
    .week17-template-table,
    .week17-drill-table,
    .week17-completion-table {
      font-size: 7.35px;
    }

    .week17-source-table th,
    .week17-source-table td,
    .week17-symptom-table th,
    .week17-symptom-table td,
    .week17-card-table th,
    .week17-card-table td,
    .week17-detail-table th,
    .week17-detail-table td,
    .week17-four-table th,
    .week17-four-table td,
    .week17-order-table th,
    .week17-order-table td,
    .week17-command-table th,
    .week17-command-table td,
    .week17-incident-table th,
    .week17-incident-table td,
    .week17-template-table th,
    .week17-template-table td,
    .week17-drill-table th,
    .week17-drill-table td,
    .week17-completion-table th,
    .week17-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week17-detail-table ul {
      margin: 0;
      padding-left: 12px;
    }

    .week17-detail-table li {
      margin-bottom: 2px;
    }

    .week17-flow {
      display: grid;
      grid-template-columns: 1fr 14px .7fr 14px .7fr 14px .7fr 14px .8fr 14px .7fr 14px 1fr;
      gap: 5px;
      align-items: stretch;
      margin: 14px 0;
    }

    .week17-flow div {
      min-height: 58px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      padding: 8px;
      color: var(--navy);
      font-size: 8.5px;
      font-weight: 800;
      line-height: 1.32;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week17-flow div:first-child,
    .week17-flow div:last-child {
      background: var(--blue-soft);
    }

    .week17-flow div:nth-child(11) {
      background: var(--mint);
    }

    .week17-flow span {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 9px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week17-symptom-flow,
    .week17-check-chain {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .week17-symptom-flow {
      grid-template-columns: repeat(3, 1fr);
    }

    .week17-symptom-flow div,
    .week17-check-chain div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week17-symptom-flow div {
      min-height: 94px;
      padding: 12px;
    }

    .week17-symptom-flow div:nth-child(6) {
      background: var(--mint);
    }

    .week17-symptom-flow span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 9px;
      font-weight: 700;
      margin-bottom: 7px;
      text-transform: uppercase;
    }

    .week17-symptom-flow strong {
      display: block;
      font-size: 11px;
    }

    .week17-symptom-flow p {
      color: var(--muted);
      font-size: 10px;
      line-height: 1.45;
      margin: 7px 0 0;
    }

    .week17-check-chain {
      grid-template-columns: repeat(6, 1fr);
    }

    .week17-check-chain div {
      min-height: 42px;
      padding: 8px;
      font-size: 8.7px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .week17-check-chain div:nth-child(-n+5) {
      background: var(--mint);
    }

    .week17-check-chain div:last-child {
      background: #fff4e8;
    }

    .week18-source-table,
    .week18-recommend-table,
    .week18-first90-table,
    .week18-quick-table,
    .week18-cost-table,
    .week18-memo-table,
    .week18-gate-table,
    .week18-acceptance-table,
    .week18-completion-table {
      font-size: 7.35px;
    }

    .week18-source-table th,
    .week18-source-table td,
    .week18-recommend-table th,
    .week18-recommend-table td,
    .week18-first90-table th,
    .week18-first90-table td,
    .week18-quick-table th,
    .week18-quick-table td,
    .week18-cost-table th,
    .week18-cost-table td,
    .week18-memo-table th,
    .week18-memo-table td,
    .week18-gate-table th,
    .week18-gate-table td,
    .week18-acceptance-table th,
    .week18-acceptance-table td,
    .week18-completion-table th,
    .week18-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week18-recommend-table ul,
    .week18-first90-table ul {
      margin: 0;
      padding-left: 12px;
    }

    .week18-recommend-table li,
    .week18-first90-table li {
      margin-bottom: 2px;
    }

    .week18-csv-table {
      font-size: 5.9px;
    }

    .week18-csv-table th,
    .week18-csv-table td {
      padding: 2.3px;
      line-height: 1.2;
    }

    .command-block.week18-formula {
      font-size: 9.5px;
      line-height: 1.42;
      padding: 14px 16px;
    }

    .week18-flow {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
      margin: 14px 0;
    }

    .week18-flow div,
    .week18-decision-flow div,
    .week18-user-map div,
    .week18-cost-stack div,
    .week18-maturity-grid div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week18-flow div {
      min-height: 64px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }

    .week18-flow div:nth-child(1),
    .week18-flow div:nth-child(2) {
      background: var(--blue-soft);
    }

    .week18-flow div:nth-child(3),
    .week18-flow div:nth-child(4) {
      background: var(--mint);
    }

    .week18-flow div.wide {
      grid-column: span 2;
      min-height: 58px;
      background: #fff4e8;
    }

    .week18-flow strong,
    .week18-user-map strong,
    .week18-cost-stack strong,
    .week18-maturity-grid strong {
      display: block;
      font-size: 10.5px;
    }

    .week18-flow span,
    .week18-user-map span,
    .week18-cost-stack span,
    .week18-maturity-grid span,
    .week18-decision-flow span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 8.7px;
      font-weight: 700;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .week18-flow span {
      color: var(--muted);
      font-family: "Noto Sans TC", sans-serif;
      font-size: 8.8px;
      margin: 5px 0 0;
      text-transform: none;
    }

    .week18-decision-flow {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 14px;
    }

    .week18-decision-flow div {
      min-height: 90px;
      padding: 10px;
    }

    .week18-decision-flow div:nth-child(6) {
      background: var(--mint);
    }

    .week18-decision-flow strong {
      display: block;
      font-size: 10.8px;
    }

    .week18-decision-flow p,
    .week18-cost-stack p {
      color: var(--muted);
      font-size: 9.4px;
      line-height: 1.42;
      margin: 7px 0 0;
    }

    .week18-user-map,
    .week18-cost-stack,
    .week18-maturity-grid {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .week18-user-map,
    .week18-maturity-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .week18-cost-stack {
      grid-template-columns: repeat(3, 1fr);
    }

    .week18-user-map div,
    .week18-cost-stack div,
    .week18-maturity-grid div {
      min-height: 70px;
      padding: 10px;
      text-align: center;
    }

    .week18-user-map div:nth-child(3),
    .week18-cost-stack div:nth-child(2),
    .week18-maturity-grid div:nth-child(4) {
      background: var(--mint);
    }

    .week19-source-table,
    .week19-route-table,
    .week19-manifest-table,
    .week19-package-table,
    .week19-startup-table,
    .week19-readorder-table,
    .week19-state-table,
    .week19-envrule-table,
    .week19-env-table,
    .week19-dns-table,
    .week19-runbook-table,
    .week19-restore-table,
    .week19-update-table,
    .week19-order-table,
    .week19-incident-table,
    .week19-demo-table,
    .week19-next-table,
    .week19-readiness-table,
    .week19-completion-table {
      font-size: 7.35px;
    }

    .week19-source-table th,
    .week19-source-table td,
    .week19-route-table th,
    .week19-route-table td,
    .week19-manifest-table th,
    .week19-manifest-table td,
    .week19-package-table th,
    .week19-package-table td,
    .week19-startup-table th,
    .week19-startup-table td,
    .week19-readorder-table th,
    .week19-readorder-table td,
    .week19-state-table th,
    .week19-state-table td,
    .week19-envrule-table th,
    .week19-envrule-table td,
    .week19-env-table th,
    .week19-env-table td,
    .week19-dns-table th,
    .week19-dns-table td,
    .week19-runbook-table th,
    .week19-runbook-table td,
    .week19-restore-table th,
    .week19-restore-table td,
    .week19-update-table th,
    .week19-update-table td,
    .week19-order-table th,
    .week19-order-table td,
    .week19-incident-table th,
    .week19-incident-table td,
    .week19-demo-table th,
    .week19-demo-table td,
    .week19-next-table th,
    .week19-next-table td,
    .week19-readiness-table th,
    .week19-readiness-table td,
    .week19-completion-table th,
    .week19-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .command-block.week19-codeblock {
      font-size: 6.15px;
      line-height: 1.25;
      padding: 8px 10px;
    }

    .week19-flow {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 7px;
      margin-top: 14px;
    }

    .week19-flow div,
    .week19-architecture-map div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week19-flow div {
      min-height: 74px;
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .week19-flow div:nth-child(2),
    .week19-flow div:nth-child(5) {
      background: var(--blue-soft);
    }

    .week19-flow div:nth-child(4),
    .week19-flow div:nth-child(6) {
      background: var(--mint);
    }

    .week19-flow strong,
    .week19-architecture-map strong {
      display: block;
      font-size: 10.5px;
    }

    .week19-flow span,
    .week19-architecture-map span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 8.7px;
      font-weight: 700;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .week19-flow span {
      color: var(--muted);
      font-family: "Noto Sans TC", sans-serif;
      font-size: 8.5px;
      margin: 5px 0 0;
      text-transform: none;
    }

    .week19-architecture-map {
      display: grid;
      grid-template-columns: 1fr 22px 1fr 22px 1fr 22px 1fr;
      gap: 7px;
      align-items: stretch;
      margin-top: 14px;
    }

    .week19-architecture-map div {
      min-height: 82px;
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .week19-architecture-map div:nth-child(5),
    .week19-architecture-map div:nth-child(7),
    .week19-architecture-map div.wide {
      background: var(--mint);
    }

    .week19-architecture-map div.wide {
      grid-column: span 2;
      min-height: 94px;
    }

    .week19-architecture-map i {
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 9px;
      font-style: normal;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .week19-architecture-map p {
      color: var(--muted);
      font-size: 9px;
      line-height: 1.4;
      margin: 6px 0 0;
    }

    .week20-source-table,
    .week20-agenda-table,
    .week20-agenda-detail-table,
    .week20-primary-table,
    .week20-why-table,
    .week20-risk-table,
    .week20-answer-table,
    .week20-decision-table,
    .week20-must-table,
    .week20-cadence-summary-table,
    .week20-cadence-table,
    .week20-adoption-table,
    .week20-scorecard-table,
    .week20-mustanswer-table,
    .week20-artifact-table,
    .week20-nextstage-table,
    .week20-completion-table {
      font-size: 7.35px;
    }

    .week20-source-table th,
    .week20-source-table td,
    .week20-agenda-table th,
    .week20-agenda-table td,
    .week20-agenda-detail-table th,
    .week20-agenda-detail-table td,
    .week20-primary-table th,
    .week20-primary-table td,
    .week20-why-table th,
    .week20-why-table td,
    .week20-risk-table th,
    .week20-risk-table td,
    .week20-answer-table th,
    .week20-answer-table td,
    .week20-decision-table th,
    .week20-decision-table td,
    .week20-must-table th,
    .week20-must-table td,
    .week20-cadence-summary-table th,
    .week20-cadence-summary-table td,
    .week20-cadence-table th,
    .week20-cadence-table td,
    .week20-adoption-table th,
    .week20-adoption-table td,
    .week20-scorecard-table th,
    .week20-scorecard-table td,
    .week20-mustanswer-table th,
    .week20-mustanswer-table td,
    .week20-artifact-table th,
    .week20-artifact-table td,
    .week20-nextstage-table th,
    .week20-nextstage-table td,
    .week20-completion-table th,
    .week20-completion-table td {
      padding: 4px;
      line-height: 1.31;
    }

    .week20-cadence-table,
    .week20-adoption-table {
      font-size: 5.85px;
    }

    .week20-cadence-table th,
    .week20-cadence-table td,
    .week20-adoption-table th,
    .week20-adoption-table td {
      padding: 2.4px;
      line-height: 1.2;
    }

    .week20-flow {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 7px;
      margin-top: 14px;
    }

    .week20-flow div,
    .week20-cadence-map div,
    .week20-gate-map div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .week20-flow div {
      min-height: 74px;
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .week20-flow div:nth-child(2),
    .week20-flow div:nth-child(4) {
      background: var(--blue-soft);
    }

    .week20-flow div:nth-child(5),
    .week20-flow div:nth-child(6) {
      background: var(--mint);
    }

    .week20-flow strong,
    .week20-cadence-map strong,
    .week20-gate-map strong {
      display: block;
      font-size: 10.5px;
    }

    .week20-flow span,
    .week20-cadence-map span,
    .week20-gate-map span {
      display: block;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 8.7px;
      font-weight: 700;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .week20-flow span {
      color: var(--muted);
      font-family: "Noto Sans TC", sans-serif;
      font-size: 8.3px;
      margin: 5px 0 0;
      text-transform: none;
    }

    .week20-cadence-map,
    .week20-gate-map {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .week20-cadence-map {
      grid-template-columns: repeat(4, 1fr);
    }

    .week20-gate-map {
      grid-template-columns: repeat(5, 1fr);
    }

    .week20-cadence-map div,
    .week20-gate-map div {
      min-height: 78px;
      padding: 10px;
      text-align: center;
    }

    .week20-cadence-map div:nth-child(4),
    .week20-gate-map div:nth-child(5) {
      background: var(--mint);
    }

    .week20-cadence-map p {
      color: var(--muted);
      font-size: 9px;
      line-height: 1.4;
      margin: 6px 0 0;
    }

    .compose-architecture-map {
      display: grid;
      grid-template-columns: 1fr 20px 1fr 20px 1.2fr 20px 1.2fr;
      gap: 8px;
      align-items: stretch;
      margin: 14px 0;
    }

    .compose-architecture-map div,
    .compose-startup-flow div {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      color: var(--navy);
      font-weight: 800;
      line-height: 1.35;
    }

    .compose-architecture-map div {
      display: flex;
      min-height: 70px;
      flex-direction: column;
      justify-content: center;
      padding: 9px;
      text-align: center;
      font-size: 11px;
    }

    .compose-architecture-map div.wide {
      grid-column: span 3;
      background: var(--blue-soft);
    }

    .compose-architecture-map span {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--blue);
      font-family: "Space Mono", monospace;
      font-size: 12px;
      font-weight: 700;
    }

    .compose-architecture-map small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 9.5px;
      line-height: 1.35;
      font-weight: 500;
    }

    .compose-startup-flow {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 14px 0;
    }

    .compose-startup-flow div {
      min-height: 70px;
      padding: 10px;
      font-size: 10.5px;
    }

    .source-panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fbfdff;
      overflow: hidden;
    }

    .source-panel summary {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 12px;
      align-items: center;
      cursor: pointer;
      padding: 12px 14px;
      color: var(--navy);
      background: var(--blue-soft);
      font-weight: 800;
      list-style: none;
    }

    .source-panel summary::-webkit-details-marker {
      display: none;
    }

    .source-panel summary a,
    .source-panel summary em {
      font-size: 11px;
      font-style: normal;
      font-weight: 700;
      color: var(--blue-dark);
    }

    .source-panel pre {
      max-height: 320px;
      overflow: auto;
      padding: 16px;
      background: #0f172a;
      color: #e5eefb;
      font-family: "Space Mono", monospace;
      font-size: 10.5px;
      line-height: 1.65;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .closing-grid {
      grid-template-columns: repeat(2, 1fr);
      margin-top: 26px;
    }

    .closing-grid span {
      color: var(--blue);
      font-size: 12px;
      font-weight: 700;
    }

    .final-answer {
      margin-top: 28px;
      border: 1px solid var(--line-strong);
      border-left: 8px solid var(--blue);
      padding: 20px;
      background: var(--blue-soft);
      border-radius: 8px;
    }

    .final-answer strong {
      display: block;
      color: var(--navy);
      font-size: 18px;
      margin-bottom: 8px;
    }

    .pgn {
      position: absolute;
      right: 19mm;
      bottom: 10mm;
      color: var(--faint);
      font-size: 11px;
      font-weight: 700;
    }

    @media (max-width: 900px) {
      body {
        padding: 18px 0;
      }

      .page {
        padding: 24px 18px 52px;
      }

      .cover-grid,
      .flow-row,
      .reader-grid,
      .week-panels,
      .phase-grid,
      .ladder,
      .week-mini-grid,
      .checkpoint-band,
      .cover-bottom,
      .closing-grid,
      .chapter-head,
      .chapter-summary,
      .chapter-section,
      .note-band,
      .three-rules,
      .decision-chain,
      .route-map,
      .tip-callout,
      .runtime-diagram,
      .queue-map,
      .mini-architecture,
      .three-layer-map,
      .risk-card-grid,
      .db-flow,
      .backup-flow,
      .mistake-grid,
      .url-flow,
      .public-url-model,
      .callback-flow,
      .command-grid,
      .ops-grid,
      .docker-path-map,
      .persistence-flow,
      .least-friction-flow,
      .week6-decision-flow,
      .state-map-compare,
      .week8-decision-flow,
      .week10-boundary-map,
      .week10-port-map,
      .week11-quadrant,
      .week11-risk-map,
      .week12-aws-evolution,
      .week18-flow,
      .week18-decision-flow,
      .week18-user-map,
      .week18-cost-stack,
      .week18-maturity-grid,
      .week19-flow,
      .week19-architecture-map,
      .week20-flow,
      .week20-cadence-map,
      .week20-gate-map,
      .compose-architecture-map,
      .compose-startup-flow {
        grid-template-columns: 1fr;
      }

      .flow-arrow {
        transform: rotate(90deg);
      }

      .cover-strip {
        grid-template-columns: repeat(2, 1fr);
      }

      .cover-strip span:nth-child(2n) {
        border-right: 0;
      }

      .week-hero {
        grid-template-columns: 1fr;
      }

      .acceptance,
      .source-panel summary {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 48px;
      }
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
      }

      .page {
        width: 210mm;
        min-height: auto;
        margin: 0;
        box-shadow: none;
        break-after: page;
        overflow: visible;
      }

      .source-panel pre {
        max-height: none;
        overflow: visible;
      }
    }
  </style>
</head>

<body>
  ${reportPages.join("\n")}
  <script src="../assets/report-reader.js"></script>
  <script src="../assets/report-actions.js"></script>
</body>
</html>
`;

await fs.writeFile(outputFile, html.replace(/[ \t]+$/gm, ""), "utf8");
console.log(`Generated ${path.relative(rootDir, outputFile)} with ${reportPages.length} pages.`);
