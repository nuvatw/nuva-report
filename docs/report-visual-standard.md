# Report 視覺標準：背景與第一週統一規格

這份文件定義第一週要先落地的視覺基礎，重點是讓首頁、登入頁、AI MV report 與未來 template 先吃同一套背景與色彩 token。後續第二週再把所有既有 report 全面套用。

## 1. 視覺盤點

目前專案裡的 report 有兩種主要語氣：

| 類型 | 代表頁面 | 目前特徵 | 要保留的部分 |
| --- | --- | --- | --- |
| 成果報告型 | 新北站、工研院 n8n | 藍色系、A4 白紙、粗黑分隔線、頁碼與左側目錄明確。 | 報告感、資訊密度、乾淨的頁面節奏。 |
| 教學手冊型 | 初學 AI MV | 淡灰綠格線背景、影片、prompt 編輯區、checklist、實作導向段落。 | 實作感、可操作區塊、格線桌面背景。 |
| 提案型 | 統一 AI workshop proposal | 同樣保留 A4 紙張與粗線，色彩比成果報告更活。 | 商務感、層次感、重點色節制。 |

第一週不重做排版，而是先把「背景、紙張、墨色、互動藍」抽成共用基礎，讓後續調整有統一入口。

## 2. 共通視覺語言

所有 report 應該共同保留：

- `A4 paper`：主要內容在白色紙面上閱讀。
- `ink line`：使用深墨色線條建立報告秩序。
- `editorial type`：標題使用 `Noto Serif TC`，標籤、數字與工具文字使用 `Archivo`。
- `quiet interface`：互動元件可以清楚，但不能像一般 app UI 一樣過度裝飾。
- `print safe`：列印或另存 PDF 時背景回白底。

AI MV report 可以保留：

- 可播放影片區。
- prompt 可編輯、可複製。
- 發布前 checklist 可勾選。
- 實作導向文字與工具流程。

AI MV report 第二週要收斂：

- 移除橘紅色，章節編號與重點標記統一改用藍色。
- 強化藍色作為共用互動色。
- 格線背景改成白色與淡藍色。
- 表格與 prompt 區不要滿版硬撐，維持 report 的呼吸感。

## 3. 第一週背景標準

預設背景採用白色與淡藍色格線：

| Token | 預設值 | 用途 |
| --- | --- | --- |
| `--report-bg-base` | `#f8fbff` | 全站頁面背景底色。 |
| `--report-bg-line` | `rgba(29, 78, 216, .034)` | 淡藍格線。 |
| `--report-bg-line-strong` | `rgba(29, 78, 216, .046)` | 垂直格線或點陣主線。 |
| `--report-bg-size` | `42px` | 紋路密度。 |
| `--report-paper` | `#ffffff` | A4 報告紙面。 |
| `--report-ink` | `#172025` | 文字與粗線。 |
| `--report-blue` | `#1d4ed8` | 共用互動色。 |

背景規則：

```css
body {
  background:
    linear-gradient(90deg, var(--report-bg-line-strong) 1px, transparent 1px),
    linear-gradient(0deg, var(--report-bg-line) 1px, transparent 1px),
    var(--report-bg-base);
  background-size: var(--report-bg-size) var(--report-bg-size);
}
```

列印規則：

```css
@media print {
  body {
    background: #fff;
    background-image: none;
  }
}
```

## 4. 背景設定資料

第一週先建立資料格式，第三週再做登入後控制台。

```json
{
  "pattern": "grid",
  "color": "#f8fbff",
  "lineColor": "#1d4ed8",
  "opacity": 0.034,
  "brightness": 1.04,
  "contrast": 0.92,
  "size": 42
}
```

規則：

- `pattern` 支援 `grid`、`dot`、`ruled`、`none`。
- `color` 與 `lineColor` 必須是 hex 色碼。
- `opacity` 控制紋路透明度，建議範圍 `0` 到 `0.12`。
- `brightness` 控制底色亮度，建議範圍 `0.88` 到 `1.12`。
- `contrast` 控制紋路對比，建議範圍 `0.7` 到 `1.2`。
- `size` 控制紋路密度，建議範圍 `28` 到 `72`。

## 5. 第一週落地範圍

第一週先接入：

- `index.html`
- `login.html`
- `reports/2026-05-27-ai-experience-sharing.html`
- `templates/report-template.html`

第一週先不全面改其他三份 report，原因是其他 report 的主色與版面差異較大，應該在第二週做完整比對後一起調整。

## 6. 第二週落地範圍

第二週已把共用背景延伸到全部既有 report，並同步處理共用工具與 AI MV report 的視覺收斂。

已接入共用背景：

- `reports/2026-05-12-nuva-new-taipei.html`
- `reports/2026-05-22-itri-n8n-lv1.html`
- `reports/2026-05-27-uni-president-ai-workshop-proposal.html`

已同步共用工具：

- `assets/report-reader.js` 的左側目錄、搜尋彈窗、private report 擋板改用 `--report-*` 背景與色彩 token。
- `assets/report-actions.js` 的右下角 action button 改用 `--report-blue` 與 `--report-paper`。

AI MV report 第二週調整：

- 影片區從黑灰改為深藍報告語氣。
- 工具標籤、資料指標、prompt 工作台操作色收斂到藍色。
- checklist 的完成狀態改用藍色，維持整份文件只使用白色與藍色。
- 章節編號等高層級標記統一改用藍色。

## 7. 第一週驗收清單

- 首頁背景變成白色與淡藍色格線。
- AI MV report 背景變成同一套白藍格線。
- 登入頁背景一致。
- 新 report template 已經載入共用背景腳本。
- 關閉 JS 時仍有可接受的 CSS fallback。
- 列印模式仍為白底。
- 現有搜尋、登入、report 目錄、右下角 action button、prompt 與 checklist 不受影響。

## 8. 第二週驗收清單

- 所有既有 report 都載入 `assets/report-theme.js`。
- 所有 report 的桌面背景都使用同一套白藍淡格線。
- 每份 report 的 A4 紙面、主色與內容結構不被抹平。
- AI MV report 的工具區、影片區與 prompt 工作台更接近其他 report 的藍色報告語言。
- checklist 完成狀態使用藍色勾選與進度標記。
- 共用目錄、搜尋彈窗、private report 擋板與右下角 action button 不再脫離背景系統。

## 9. 第三週背景控制台

第三週已在首頁登入後新增背景控制台。未登入時首頁仍只顯示「登入」，登入後才顯示背景設定工具。

控制項：

- 紋路：格線、點陣、橫線、無紋路。
- 底色：常用色票與自訂 color input。
- 透明度：控制紋路深淺。
- 亮度：控制背景偏亮或偏暗。
- 密度：控制格線、點陣或橫線間距。
- 重設背景：清除本機背景設定並回到預設白藍格線。

儲存規則：

- 背景設定存在 `localStorage` 的 `nuva-report-background-settings`。
- 登入狀態仍存在 `sessionStorage` 的 `nuva-report-admin-auth`。
- 關閉頁面後需要重新登入，但背景偏好會留在同一台瀏覽器。

第三週驗收重點：

- 首頁登入後可即時改變背景。
- 重新開啟任一 report 會套用同一背景。
- 登出後控制台隱藏，但已套用的背景仍保留。
- 重設後回到白藍淡格線。
