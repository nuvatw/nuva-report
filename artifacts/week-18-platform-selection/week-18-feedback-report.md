# Week 18 Feedback Report｜Railway managed database wording

## Finding

第 18 週原文把 freelancer 的 PaaS 替代方案寫成 `Railway/Render/Fly + managed PostgreSQL`。這個合併說法容易讓 Railway 的 database template 被誤讀成 fully managed database。

## Evidence

Railway 官方 Databases 文件目前說 Railway-provided database templates are unmanaged services，使用者仍需負責 backups/disaster recovery、performance tuning、security/access control、monitoring/maintenance。若有 managed database 或 compliance 需求，應考慮 Enterprise 或外部 managed database provider。

官方 pricing 文件也把 Railway 成本模型描述為 base subscription fee + resource usage，而不是單純 usage-based credits。

## Correction

1. 將 Railway pricing 來源改為 `https://docs.railway.com/pricing`，並補充 base subscription fee + resource usage。
2. 新增 Railway databases 來源 `https://docs.railway.com/databases`。
3. 將 `Railway/Render/Fly + managed PostgreSQL` 改為 `Railway/Render/Fly + managed/external PostgreSQL`，並明確註記 Railway template DB 需自行處理 backup、DR、security、monitoring/maintenance。
4. 同步更新 Week 18 artifacts、AWS vs PaaS memo、Week 19/20 作品包與最終建議中的相關提及。

## Recheck Scope

修正後重新檢查 Week 18 官方來源、正文、recommendation matrix、AWS vs PaaS memo、build script 產出的 HTML，以及 Week 18 驗證腳本。
