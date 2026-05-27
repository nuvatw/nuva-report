# 維運手冊

這份手冊用來規範每次新增成果報告、每月整理與擴充決策。

## 新增一份報告

1. 複製 `templates/report-template.html`。
2. 依 `docs/report-delivery-standard.md` 命名檔案。
3. 放到 `reports/`。
4. 填寫完整 `report-meta`。
5. 執行：

```bash
npm run build
npm run release:check
```

6. 開啟首頁人工抽查：
   - 最新報告是否出現在第一張卡。
   - 搜尋客戶名稱是否找得到。
   - 分類、年度、月份是否合理。
   - 報告頁右下角是否有「更多 AI 課程」與「下載 PDF」。
   - 手機版是否沒有水平捲動。

## 每月整理

每月或每新增 5 份報告後執行：

```bash
npm run audit:maintenance
npm run release:check
```

檢查：

- 是否有過多 `其他成果`。
- 是否有空白或過長的 tags。
- 是否需要新增 clientGroup 篩選。
- 是否已有正式 PDF 可填入 metadata.pdf，讓報告頁按鈕直接下載。
- 是否有報告該轉為 internal 或 private。

## 背景設定

首頁登入後可以調整全站背景。

可調整項目：

- 紋路：格線、點陣、橫線、無紋路。
- 底色：色票或自訂顏色。
- 透明度：紋路深淺。
- 亮度：背景亮暗。
- 密度：紋路間距。

設定會存在目前瀏覽器的 `localStorage`，key 為：

```text
nuva-report-background-settings
```

登入狀態仍使用 `sessionStorage`，關閉頁面後需重新登入；背景偏好不會因登出而清掉。

若背景設定異常，可登入首頁後按「重設背景」，或清除上述 localStorage key。

## 可見性規則

`visibility` 是資料標籤，不是權限。

- `public`：可以公開展示。
- `internal`：內部使用，不應部署到公開網址。
- `private`：需權限系統，不建議放在純靜態公開網站。

若出現 `internal` 或 `private` 報告，發布前需人工確認部署環境。

## 擴充評估節奏

- 報告數 1-8：維持目前首頁，不新增複雜 UI。
- 報告數 9-20：加入 clientGroup 篩選，並評估首頁卡片是否也顯示 PDF 下載。
- 報告數 20+：評估縮圖、標籤頁、搜尋權重與分站。

## 常見問題

首頁沒有新報告：先跑 `npm run build`。

release check 卡住：先單獨跑 `npm run check:links` 與 `npm run check:visual`。

手機版破版：檢查 `artifacts/qa/home-mobile.png`，再調整首頁 responsive CSS。

外部連結失敗：外部抽查通常是警告；若是重要佐證連結，人工確認是否需更換。
