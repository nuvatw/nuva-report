# Week 11 回饋報告

## 問題：Zeabur pricing source drift

第 11 週原本引用 `https://zeabur.com/docs/en-US/billing/pricing` 來支持「Zeabur 使用 usage-based pricing，包含 memory、egress、persistent volume」。

重新查核時，該 docs 路徑目前主要說明 Zeabur 的 subscription tiers，並引導讀者到最新 pricing page。Zeabur 目前的公開 pricing page `https://zeabur.com/en-US/pricing` 才直接呈現 subscription fee 加 resource usage fee 的結構，且 resource usage fee 包含 memory、network egress、persistent volume 等項目。

## 判斷

第 11 週的架構結論仍正確：Zeabur 上的 n8n production 候選仍需估算常駐服務、memory、network egress、persistent volume 與資料庫相關成本。

需要修正的是來源連結與措辭：不要只寫成單純 usage-based pricing；應寫成 subscription tier + resource usage fee，並以最新 pricing page 為準。

## 修正範圍

- `docs/week-11-paas-persistence-platforms.md`
- `artifacts/week-11-paas/week-11-paas-platform-matrix.json`
- `scripts/build-n8n-deployment-course-report.mjs`
- `reports/2026-05-28-n8n-deployment-complete-guide.html` 由 build script 重新產生
- `scripts/verify-week-eleven.mjs` 加入回饋報告檢查

## 重新檢查標準

第 11 週重新檢查時，應確認 Zeabur pricing 來源改為 `https://zeabur.com/en-US/pricing`，正文不再把 Zeabur 成本模型簡化為單純 usage-based，而是明確寫成 subscription tier + resource usage fee。
