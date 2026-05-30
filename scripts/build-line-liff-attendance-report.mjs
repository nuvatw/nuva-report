#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as OpenCC from 'opencc-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcePath = process.env.LINE_LIFF_SOURCE_MD || '/Users/linshangche/Desktop/line_liff_attendance_playbook.md';
const outputPath = path.join(root, 'reports/2026-05-30-line-liff-attendance-playbook.html');

const converter = OpenCC.Converter({ from: 'cn', to: 'twp' });

const taiwanTermReplacements = [
  ['後臺', '後台'],
  ['賬號', '帳號'],
  ['許可權', '權限'],
  ['繫結', '綁定'],
  ['計劃', '計畫'],
  ['平臺', '平台'],
  ['官方檔案', '官方文件'],
  ['狀態列', '狀態欄'],
  ['日誌', '記錄'],
  ['分區', '區段'],
  ['視窗', '窗口'],
  ['透過', '透過']
];

const visualDeck = [
  {
    label: 'ARCH',
    title: '三層責任分工',
    body: 'Flex / LIFF / API 分開看，入口、互動與資料真相各自清楚。',
    lanes: ['Flex 入口', 'LIFF 介面', 'API + DB']
  },
  {
    label: 'MVP',
    title: '從可開啟到可營運',
    body: '先驗證 LIFF 身份，再做狀態、打卡、進度、後台與正式化。',
    lanes: ['健康檢查', '狀態頁', '打卡', 'Sections', '生產化']
  },
  {
    label: 'AUTH',
    title: '後端驗證是信任邊界',
    body: '前端取得 ID token，後端驗證後才決定使用者與資料權限。',
    lanes: ['ID token', 'Verify', 'Session', 'Audit']
  },
  {
    label: 'DATA',
    title: '資料模型服務狀態機',
    body: 'Employee、Attendance Session、Audit Event 共同支撐爭議排查。',
    lanes: ['Employee', 'Session', 'Section', 'Audit']
  },
  {
    label: 'FLOW',
    title: '所有入口都進確認頁',
    body: 'Flex / Rich Menu 可以帶 action，但不能打開即自動打卡。',
    lanes: ['URI', 'LIFF', '確認', '寫入']
  },
  {
    label: 'QA',
    title: '測試要覆蓋重送與重複操作',
    body: 'Webhook 重送、連點、網路重試、跨日與時區都是打卡系統核心風險。',
    lanes: ['重送', '連點', '時區', '權限']
  }
];

function convertTaiwan(text) {
  let output = converter(text);
  for (const [from, to] of taiwanTermReplacements) output = output.split(from).join(to);
  return output;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value, fallback = 'section') {
  const ascii = value
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return ascii || fallback;
}

function renderInline(value = '') {
  let html = escapeHtml(value);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(
    /(https?:\/\/[^\s<)]+)/g,
    '<a href="$1" target="_blank" rel="noreferrer">$1</a>'
  );
  return html;
}

function isHeading(line) {
  return /^#{1,4}\s+/.test(line);
}

function isTableLine(line) {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isListLine(line) {
  return /^(\s*)[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line);
}

function stripListMarker(line) {
  return line.replace(/^\s*[-*]\s+/, '').replace(/^\s*\d+\.\s+/, '').trim();
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const fenceMatch = line.match(/^```([A-Za-z0-9_-]*)\s*$/);
    if (fenceMatch) {
      const language = fenceMatch[1] || 'text';
      const content = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        content.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', language, content: content.join('\n') });
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim()
      });
      i += 1;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      blocks.push({ type: 'rule' });
      i += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && (/^\s*>\s?/.test(lines[i]) || !lines[i].trim())) {
        if (lines[i].trim()) quoteLines.push(lines[i].replace(/^\s*>\s?/, '').trim());
        i += 1;
      }
      blocks.push({ type: 'quote', lines: quoteLines });
      continue;
    }

    if (isTableLine(line)) {
      const tableLines = [];
      while (i < lines.length && isTableLine(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'table', rows: tableLines });
      continue;
    }

    if (isListLine(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      while (i < lines.length && (isListLine(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (isListLine(lines[i])) items.push(stripListMarker(lines[i]));
        else if (items.length > 0) items[items.length - 1] += ` ${lines[i].trim()}`;
        i += 1;
      }
      blocks.push({ type: ordered ? 'ol' : 'ul', items });
      continue;
    }

    const paragraphLines = [];
    while (
      i < lines.length
      && lines[i].trim()
      && !isHeading(lines[i])
      && !/^```/.test(lines[i])
      && !isTableLine(lines[i])
      && !isListLine(lines[i])
      && !/^\s*>\s?/.test(lines[i])
      && !/^---+\s*$/.test(lines[i])
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function parseTable(rows) {
  const parsed = rows
    .map((row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()));
  const hasSeparator = parsed[1]?.every((cell) => /^:?-{3,}:?$/.test(cell));
  return {
    headers: parsed[0] || [],
    body: hasSeparator ? parsed.slice(2) : parsed.slice(1)
  };
}

function blockWeight(block) {
  if (block.type === 'heading') return block.level <= 3 ? 1.6 : 1;
  if (block.type === 'paragraph') return Math.max(1, block.text.length / 72);
  if (block.type === 'quote') return 1.2 + block.lines.join(' ').length / 80;
  if (block.type === 'ul' || block.type === 'ol') {
    const text = block.items.join(' ');
    return 1.2 + block.items.length * 0.58 + text.length / 130;
  }
  if (block.type === 'table') return 2 + Math.max(1, block.rows.length) * 0.8;
  if (block.type === 'code') return 2.2 + block.content.split('\n').length * 0.42;
  return 0.4;
}

function groupSections(blocks) {
  const topBlocks = [];
  const sections = [];
  let current = null;
  let headingOne = 'LINE LIFF 打卡系統 Playbook';

  for (const block of blocks) {
    if (block.type === 'heading' && block.level === 1) {
      headingOne = block.text;
      continue;
    }

    if (block.type === 'heading' && block.level === 2) {
      current = {
        title: block.text,
        id: slugify(block.text, `section-${sections.length + 1}`),
        blocks: []
      };
      sections.push(current);
      continue;
    }

    if (current) current.blocks.push(block);
    else topBlocks.push(block);
  }

  return { headingOne, topBlocks, sections };
}

function chunkSection(section, sectionIndex) {
  const chunks = [];
  let current = [];
  let weight = 0;
  const maxWeight = sectionIndex >= 14 ? 18 : 16.4;

  for (const block of section.blocks) {
    const nextWeight = blockWeight(block);
    const startsNewSubsection = block.type === 'heading' && block.level === 3;
    if (
      current.length > 0
      && (weight + nextWeight > maxWeight || (startsNewSubsection && weight > maxWeight * 0.7))
    ) {
      chunks.push(current);
      current = [];
      weight = 0;
    }
    current.push(block);
    weight += nextWeight;
  }
  if (current.length > 0) chunks.push(current);
  return chunks.length > 0 ? chunks : [[]];
}

function extractKeyValueRows(topBlocks) {
  const quote = topBlocks.find((block) => block.type === 'quote');
  if (!quote) return [];
  return quote.lines
    .flatMap((line) => line.split(/\s{2,}/))
    .map((line) => line.replace(/^\s*[-*]\s+/, '').trim())
    .map((line) => {
      const match = line.match(/^([^：:]+)[：:]\s*(.+)$/);
      return match ? { key: match[1], value: match[2] } : null;
    })
    .filter(Boolean);
}

function renderBlock(block) {
  if (block.type === 'heading') {
    const level = Math.min(Math.max(block.level, 3), 4);
    return `<h${level} class="content-heading h${level}">${renderInline(block.text)}</h${level}>`;
  }

  if (block.type === 'paragraph') return `<p class="body-copy">${renderInline(block.text)}</p>`;

  if (block.type === 'quote') {
    return `<aside class="quote-box">${block.lines.map((line) => `<p>${renderInline(line)}</p>`).join('')}</aside>`;
  }

  if (block.type === 'ul' || block.type === 'ol') {
    const tag = block.type;
    return `<${tag} class="source-list">${block.items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</${tag}>`;
  }

  if (block.type === 'table') {
    const table = parseTable(block.rows);
    return `<div class="table-wrap"><table>
      <thead><tr>${table.headers.map((cell) => `<th>${renderInline(cell)}</th>`).join('')}</tr></thead>
      <tbody>${table.body.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>`;
  }

  if (block.type === 'code') {
    const language = escapeHtml(block.language || 'text');
    const lineCount = block.content ? block.content.split('\n').length : 0;
    return `<figure class="code-card">
      <figcaption><span>${language}</span><span>${lineCount} lines</span></figcaption>
      <pre><code>${escapeHtml(block.content)}</code></pre>
    </figure>`;
  }

  if (block.type === 'rule') return '<hr class="soft-rule">';
  return '';
}

function renderVisual(sectionIndex, chunkIndex, title) {
  const visual = visualDeck[(sectionIndex + chunkIndex) % visualDeck.length];
  const caption = chunkIndex === 0 ? title : `${title} / 續讀 ${chunkIndex + 1}`;
  return `<aside class="visual-card">
    <div class="visual-meta"><span>${visual.label}</span><span>${renderInline(caption)}</span></div>
    <div class="visual-title">${renderInline(visual.title)}</div>
    <p>${renderInline(visual.body)}</p>
    <div class="visual-lanes">
      ${visual.lanes.map((lane, index) => `<span style="--i:${index + 1}">${renderInline(lane)}</span>`).join('')}
    </div>
  </aside>`;
}

function renderSectionPage({ section, sectionIndex, chunk, chunkIndex, pageNumber }) {
  const pageId = chunkIndex === 0 ? section.id : `${section.id}-${chunkIndex + 1}`;
  const continuation = chunkIndex === 0 ? '' : '<span class="continuation">continued</span>';
  return `<section class="page report-page" id="${pageId}">
    <div class="rh"><span>${String(sectionIndex).padStart(2, '0')} / ${renderInline(section.title)}</span><span>LINE LIFF Attendance</span></div>
    <div class="section-shell">
      <div class="sec-num">${String(sectionIndex).padStart(2, '0')}</div>
      <div>
        ${continuation}
        <h2>${renderInline(section.title)}</h2>
      </div>
    </div>
    ${renderVisual(sectionIndex, chunkIndex, section.title)}
    <div class="content-flow">
      ${chunk.map(renderBlock).join('\n')}
    </div>
    <div class="pgn">${String(pageNumber).padStart(2, '0')}</div>
  </section>`;
}

function renderToc(sections) {
  const rows = sections.map((section, index) => `<a class="toc-sub" href="#${section.id}">
      <span class="ts-c">${String(index).padStart(2, '0')}</span>
      <span class="ts-t">${renderInline(section.title)}</span>
      <span class="ts-p">${String(section.pageNumber || index + 4).padStart(2, '0')}</span>
    </a>`);

  return `<section class="page toc-page" id="toc">
    <div class="toc-head"><span>00.0</span><span>目錄</span></div>
    <h2>閱讀路線</h2>
    <p class="toc-intro">這份 report 依照原始 playbook 的 20 個章節完整展開。左側 reader 會吃這一頁的 curated links，讓長篇技術文件仍然可以快速跳轉。</p>
    <div class="toc-grid">${rows.join('\n')}</div>
    <div class="toc-note">
      <b>Source fidelity</b>
      <span>章節、清單、表格、程式碼區塊、參考連結皆由原始 Markdown 轉入 report；文字轉為台灣繁中，API 路徑與程式碼符號保留。</span>
    </div>
    <div class="pgn">02</div>
  </section>`;
}

function renderCodexSummary({ rows, sections, sourceLineCount }) {
  const assumptions = rows.slice(0, 4);
  return `<section class="page summary-page" id="codex-summary">
    <div class="rh"><span>01 / Codex 小總結</span><span>reader first</span></div>
    <div class="summary-hero">
      <span>Codex 小總結</span>
      <h2>這不是一個 LINE Bot 專案，而是一套打卡狀態系統。</h2>
      <p>最重要的心智模型是：Flex Message 只做入口，LIFF 做互動介面，後端與資料庫才保存真正的出勤狀態。照 playbook 走，團隊可以從 1 天 health check 推進到可稽核、可補卡、可營運的正式打卡系統。</p>
    </div>
    <div class="summary-grid">
      <div><b>${sourceLineCount}</b><span>source lines preserved</span></div>
      <div><b>${sections.length}</b><span>curated chapters</span></div>
      <div><b>6</b><span>MVP milestones</span></div>
      <div><b>10</b><span>course lessons</span></div>
    </div>
    <div class="route-map">
      <div><span>01</span><b>先讓 LIFF 開得起來</b><p>確認 LINE client、SDK、profile、ID token 與外部瀏覽器登入。</p></div>
      <div><span>02</span><b>後端驗證身份</b><p>前端不可自己決定 userId，所有寫入都從 verified ID token 進入。</p></div>
      <div><span>03</span><b>把狀態機做穩</b><p>同一時間只能有一段未關閉 session，所有操作都要可重試、可稽核。</p></div>
      <div><span>04</span><b>再接 Flex / Rich Menu</b><p>入口帶 action，但 LIFF 內要顯示確認頁，避免誤觸與預載。</p></div>
    </div>
    <div class="assumption-table">
      ${assumptions.map((row) => `<div><span>${renderInline(row.key)}</span><p>${renderInline(row.value)}</p></div>`).join('')}
    </div>
    <div class="pgn">03</div>
  </section>`;
}

function renderCover({ title, rows, sourceLineCount }) {
  const rowMap = new Map(rows.map((row) => [row.key, row.value]));
  return `<section class="page cover-page" id="cover">
    <div class="cover-top">
      <div class="brand-lockup"><img src="../blue_logo_nuva.png" alt="nuva"><span>技術手冊視覺報告</span></div>
      <span>2026 / 05 / 30</span>
    </div>
    <div class="cover-main">
      <span class="cover-kicker">LINE LIFF Attendance Playbook</span>
      <h1>${renderInline(title.replace('Playbook', 'Playbook 視覺報告'))}</h1>
      <p>${renderInline(rowMap.get('目標') || '從 MVP 開始，逐步做出完整的 LINE LIFF 打卡系統。')}</p>
    </div>
    <div class="cover-metrics">
      <div><span>版本</span><b>${renderInline(rowMap.get('版本') || '2026-05-30')}</b></div>
      <div><span>語言</span><b>繁體中文</b></div>
      <div><span>來源行數</span><b>${sourceLineCount} lines</b></div>
    </div>
  </section>`;
}

function renderCss() {
  return `<style>
    :root {
      --paper: oklch(99% 0.004 250);
      --paper-soft: oklch(96.8% 0.014 252);
      --desk: #f8fbff;
      --ink: #13203c;
      --muted: #4c5873;
      --faint: #8791a8;
      --line: rgba(19, 32, 60, .16);
      --line-strong: rgba(19, 32, 60, .42);
      --blue: #1d4ed8;
      --blue-deep: #12286a;
      --blue-soft: #eaf1ff;
      --blue-wash: #f3f7ff;
      --shadow: rgba(20, 40, 90, .18);
      --report-bg-base: #f8fbff;
      --report-bg-line: rgba(29, 78, 216, .034);
      --report-bg-line-strong: rgba(29, 78, 216, .046);
      --report-bg-size: 42px;
      --ease-out: cubic-bezier(.23, 1, .32, 1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
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
    .page {
      position: relative;
      width: min(210mm, calc(100vw - 28px));
      min-height: 297mm;
      margin: 0 auto 30px;
      overflow: hidden;
      background: var(--paper);
      box-shadow: 0 10px 36px var(--shadow);
      padding: 18mm 17mm 15mm;
    }
    .page::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(90deg, transparent 20mm, rgba(29, 78, 216, .1) 20mm, rgba(29, 78, 216, .1) calc(20mm + 1px), transparent calc(20mm + 1px)),
        linear-gradient(0deg, transparent 0, transparent calc(100% - 15mm), rgba(19, 32, 60, .08) calc(100% - 15mm), rgba(19, 32, 60, .08) calc(100% - 15mm + 1px), transparent calc(100% - 15mm + 1px));
    }
    .page > * { position: relative; z-index: 1; }
    .rh,
    .pgn,
    .cover-kicker,
    .cover-top,
    .cover-metrics span,
    .toc-head,
    .toc-sub,
    .visual-meta,
    .code-card figcaption,
    .summary-hero span,
    .summary-grid span,
    .route-map span,
    .assumption-table span,
    .continuation {
      font-family: "Space Mono", "Noto Sans TC", monospace;
      font-weight: 700;
      letter-spacing: 0;
    }
    .rh {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      padding-bottom: 9px;
      border-bottom: 2px solid var(--ink);
      color: var(--muted);
      font-size: 10px;
    }
    .pgn {
      position: absolute;
      right: 17mm;
      bottom: 12mm;
      color: var(--ink);
      font-size: 11px;
    }
    .cover-page {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 18px;
      min-height: 297mm;
    }
    .cover-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--ink);
      padding-bottom: 12px;
      color: var(--muted);
      font-size: 11px;
    }
    .brand-lockup { display: flex; align-items: center; gap: 12px; color: var(--ink); font-weight: 900; }
    .brand-lockup img { width: 94px; height: auto; display: block; }
    .cover-main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 8mm 0 4mm;
    }
    .cover-kicker {
      align-self: flex-start;
      border: 1.5px solid var(--blue);
      color: var(--blue);
      padding: 7px 12px;
      font-size: 11px;
    }
    h1 {
      max-width: 155mm;
      margin-top: 22px;
      color: var(--ink);
      font-size: 58px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: 0;
    }
    .cover-main p {
      max-width: 150mm;
      margin-top: 20px;
      color: var(--muted);
      font-size: 17px;
      font-weight: 600;
      line-height: 1.85;
    }
    .cover-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      border: 2px solid var(--ink);
    }
    .cover-metrics div { padding: 16px 18px; border-right: 1px solid var(--line-strong); }
    .cover-metrics div:last-child { border-right: 0; }
    .cover-metrics span { display: block; color: var(--blue); font-size: 10px; margin-bottom: 8px; }
    .cover-metrics b { display: block; font-size: 18px; line-height: 1.35; }
    .toc-head {
      display: flex;
      justify-content: space-between;
      color: var(--blue);
      border-bottom: 1px solid var(--line);
      padding-bottom: 8px;
      font-size: 10px;
    }
    .toc-page h2,
    .summary-page h2 {
      margin-top: 22px;
      font-size: 34px;
      line-height: 1.22;
      font-weight: 900;
      letter-spacing: 0;
    }
    .toc-intro {
      margin-top: 12px;
      max-width: 140mm;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.8;
      font-weight: 500;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 18px;
      margin-top: 24px;
      border-top: 2px solid var(--ink);
    }
    .toc-sub {
      display: grid;
      grid-template-columns: 34px 1fr 28px;
      gap: 8px;
      align-items: baseline;
      padding: 9px 0;
      border-bottom: 1px solid var(--line);
      color: var(--ink);
      text-decoration: none;
      transition: padding 160ms var(--ease-out), background 160ms var(--ease-out);
      font-size: 9.5px;
    }
    .toc-sub:hover { padding-left: 7px; background: var(--blue-soft); }
    .ts-c { color: var(--blue); }
    .ts-p { color: var(--faint); text-align: right; }
    .toc-note {
      display: grid;
      grid-template-columns: 34mm 1fr;
      gap: 16px;
      margin-top: 22px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 11.5px;
      line-height: 1.65;
    }
    .toc-note b { color: var(--blue); font-family: "Space Mono", monospace; }
    .summary-hero {
      margin-top: 18px;
      padding: 24px 26px;
      border: 2px solid var(--ink);
      background: var(--blue-deep);
      color: var(--paper);
    }
    .summary-hero span { color: #9bb8ff; font-size: 10px; }
    .summary-hero h2 { margin-top: 10px; color: var(--paper); }
    .summary-hero p { margin-top: 14px; color: #d7e2ff; font-size: 13px; line-height: 1.9; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 2px solid var(--ink);
      border-top: 0;
    }
    .summary-grid div { padding: 16px 14px; border-right: 1px solid var(--line-strong); }
    .summary-grid div:last-child { border-right: 0; }
    .summary-grid b { display: block; color: var(--blue); font-size: 30px; line-height: 1; }
    .summary-grid span { display: block; margin-top: 8px; color: var(--muted); font-size: 9px; }
    .route-map {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      margin-top: 22px;
      border-top: 2px solid var(--ink);
    }
    .route-map div { padding: 16px 18px; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .route-map div:nth-child(2n) { border-right: 0; }
    .route-map span { color: var(--blue); font-size: 10px; }
    .route-map b { display: block; margin-top: 6px; font-size: 15px; line-height: 1.45; }
    .route-map p { margin-top: 7px; color: var(--muted); font-size: 11px; line-height: 1.7; }
    .assumption-table {
      margin-top: 18px;
      border-top: 1px solid var(--line-strong);
    }
    .assumption-table div {
      display: grid;
      grid-template-columns: 30mm 1fr;
      gap: 14px;
      padding: 10px 0;
      border-bottom: 1px solid var(--line);
    }
    .assumption-table span { color: var(--blue); font-size: 10px; }
    .assumption-table p { color: var(--muted); font-size: 11px; line-height: 1.65; }
    .section-shell {
      display: grid;
      grid-template-columns: 42px 1fr;
      gap: 16px;
      margin-top: 28px;
      padding-bottom: 13px;
      border-bottom: 2px solid var(--ink);
    }
    .sec-num {
      color: var(--blue);
      font-family: "Archivo", sans-serif;
      font-size: 36px;
      font-weight: 900;
      line-height: .95;
    }
    .continuation {
      display: inline-block;
      color: var(--blue);
      font-size: 9px;
      margin-bottom: 7px;
    }
    .section-shell h2 {
      font-size: 25px;
      font-weight: 900;
      line-height: 1.28;
      letter-spacing: 0;
    }
    .visual-card {
      margin-top: 16px;
      border: 1.6px solid var(--ink);
      background:
        linear-gradient(135deg, rgba(29, 78, 216, .13), transparent 42%),
        var(--blue-wash);
      padding: 14px 16px;
    }
    .visual-meta {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      color: var(--blue);
      font-size: 9px;
    }
    .visual-title { margin-top: 8px; font-size: 18px; line-height: 1.3; font-weight: 900; }
    .visual-card p { margin-top: 5px; color: var(--muted); font-size: 11.2px; line-height: 1.65; }
    .visual-lanes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
      gap: 7px;
      margin-top: 12px;
    }
    .visual-lanes span {
      min-height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--line-strong);
      background: color-mix(in oklch, var(--paper) calc(100% - var(--i) * 7%), var(--blue-soft));
      color: var(--ink);
      font-size: 10.5px;
      font-weight: 800;
      text-align: center;
      line-height: 1.35;
      padding: 6px;
    }
    .content-flow { margin-top: 14px; }
    .content-heading {
      color: var(--ink);
      font-weight: 900;
      line-height: 1.36;
      letter-spacing: 0;
    }
    .content-heading.h3 { margin: 14px 0 8px; font-size: 17px; }
    .content-heading.h4 { margin: 12px 0 7px; font-size: 14px; color: var(--blue-deep); }
    .body-copy {
      color: var(--muted);
      font-size: 11.7px;
      font-weight: 500;
      line-height: 1.78;
      margin-top: 8px;
    }
    .body-copy strong,
    .source-list strong,
    .quote-box strong { color: var(--ink); font-weight: 900; }
    code {
      font-family: "Space Mono", monospace;
      font-size: .92em;
      background: var(--blue-soft);
      color: var(--blue-deep);
      padding: 1px 4px;
      border-radius: 4px;
    }
    .source-list {
      margin: 8px 0 0 18px;
      color: var(--muted);
      font-size: 11.3px;
      line-height: 1.64;
    }
    .source-list li { margin-top: 4px; padding-left: 2px; }
    .quote-box {
      margin-top: 10px;
      padding: 13px 15px;
      border: 1px solid var(--line-strong);
      background: var(--blue-wash);
      color: var(--muted);
    }
    .quote-box p { font-size: 11.4px; line-height: 1.75; margin-top: 6px; }
    .quote-box p:first-child { margin-top: 0; }
    .table-wrap {
      width: 100%;
      overflow: hidden;
      margin-top: 10px;
      border-top: 2px solid var(--ink);
    }
    table { width: 100%; border-collapse: collapse; }
    th,
    td {
      border-bottom: 1px solid var(--line);
      border-right: 1px solid var(--line);
      padding: 8px 9px;
      text-align: left;
      vertical-align: top;
      font-size: 10.8px;
      line-height: 1.55;
    }
    th:last-child,
    td:last-child { border-right: 0; }
    th { color: var(--blue); font-weight: 900; background: var(--blue-wash); }
    td { color: var(--muted); }
    .code-card {
      margin-top: 10px;
      border: 1.5px solid var(--ink);
      background: #f7faff;
    }
    .code-card figcaption {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 7px 10px;
      border-bottom: 1px solid var(--line-strong);
      color: var(--blue);
      font-size: 9px;
    }
    pre {
      max-width: 100%;
      overflow: auto;
      padding: 11px 12px;
      color: #14213b;
      font-size: 8.4px;
      line-height: 1.55;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-family: "Space Mono", monospace;
    }
    pre code { background: transparent; color: inherit; padding: 0; border-radius: 0; font-size: inherit; }
    .soft-rule { border: 0; border-top: 1px solid var(--line); margin: 10px 0; }
    a { color: var(--blue); text-decoration: none; border-bottom: 1px solid rgba(29, 78, 216, .28); }
    *[id] { scroll-margin-top: 24px; }
    @page { size: A4; margin: 0; }
    @media print {
      body { background: #fff; padding: 0; }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 0;
        box-shadow: none;
        break-after: page;
      }
      .page:last-of-type { break-after: auto; }
      .visual-card,
      .summary-hero,
      .summary-grid,
      .route-map,
      .cover-metrics,
      .table-wrap,
      .quote-box,
      .code-card {
        break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    @media screen and (max-width: 880px) {
      body { padding: 14px 0; }
      .page {
        transform: scale(.62);
        transform-origin: top center;
        margin-bottom: calc(-297mm * .38 + 18px);
      }
    }
  </style>`;
}

function renderHtml({ title, rows, sections, pages, sourceLineCount }) {
  const pageCount = pages.length + 3;
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<!-- report-meta
{
  "title": "LINE LIFF 打卡系統 Playbook",
  "subtitle": "從 MVP 到生產化的 A4 視覺工程手冊",
  "date": "2026-05-30",
  "period": "2026/05/30",
  "category": "研究摘要",
  "client": "nuva 內部技術整理",
  "clientGroup": "企業與研究機構",
  "timeline": "2026 五月",
  "tags": ["LINE LIFF", "打卡系統", "Messaging API", "Rich Menu", "Flex Message", "Webhook", "工程手冊"],
  "visibility": "internal"
}
-->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LINE LIFF 打卡系統 Playbook 視覺報告</title>
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Space+Mono:wght@400;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet">
  ${renderCss()}
  <script src="../assets/report-theme.js"></script>
</head>
<body>
  ${renderCover({ title, rows, sourceLineCount })}
  ${renderToc(sections)}
  ${renderCodexSummary({ rows, sections, sourceLineCount })}
  ${pages.join('\n')}
  <script src="../assets/report-reader.js" defer></script>
  <script src="../assets/report-actions.js" defer></script>
</body>
</html>
<!-- Generated from ${escapeHtml(sourcePath)} with ${sourceLineCount} source lines into ${pageCount} A4 report pages. -->
`;
}

async function main() {
  const rawMarkdown = await fs.readFile(sourcePath, 'utf8');
  const sourceLineCount = rawMarkdown.replace(/\r\n/g, '\n').split('\n').length;
  const markdown = convertTaiwan(rawMarkdown);
  const blocks = parseMarkdown(markdown);
  const { headingOne, topBlocks, sections } = groupSections(blocks);
  const rows = extractKeyValueRows(topBlocks);
  let pageNumber = 4;
  const pages = [];

  sections.forEach((section, sectionIndex) => {
    const chunks = chunkSection(section, sectionIndex);
    chunks.forEach((chunk, chunkIndex) => {
      if (chunkIndex === 0) section.pageNumber = pageNumber;
      pages.push(renderSectionPage({
        section,
        sectionIndex,
        chunk,
        chunkIndex,
        pageNumber
      }));
      pageNumber += 1;
    });
  });

  const html = renderHtml({
    title: headingOne,
    rows,
    sections,
    pages,
    sourceLineCount
  });

  await fs.writeFile(outputPath, html, 'utf8');
  console.log(`Wrote ${path.relative(root, outputPath)} (${pages.length + 3} pages, ${sourceLineCount} source lines)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
