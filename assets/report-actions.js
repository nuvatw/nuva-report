(() => {
  const learnUrl = 'https://www.meetnuva.com/learn';
  const styleId = 'nuva-report-actions-style';
  const actionsClass = 'report-actions';

  const icons = {
    learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>'
  };

  function injectStyle() {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .${actionsClass} {
        position: fixed;
        right: 26px;
        bottom: 26px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
        justify-content: flex-end;
        width: 148px;
      }

      .report-action {
        min-height: 48px;
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        border: 1px solid rgba(255, 255, 255, .2);
        border-radius: 0;
        background: var(--report-blue, var(--blue, #1d4ed8));
        color: #fff;
        cursor: pointer;
        font-family: 'Space Mono', 'Archivo', 'Noto Sans TC', sans-serif;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: .08em;
        padding: 15px 20px;
        text-decoration: none;
        box-shadow: 0 8px 26px rgba(29, 78, 216, .34);
        transition: background-color .2s ease, border-color .2s ease, box-shadow .2s ease, color .2s ease, transform .2s ease;
        white-space: nowrap;
      }

      .report-action:hover,
      .report-action:focus-visible {
        background: var(--blue-deep, #12286a);
        color: #fff;
        transform: translateY(-2px);
        outline: none;
      }

      .report-action:focus-visible {
        box-shadow: 0 0 0 3px rgba(255, 255, 255, .85), 0 8px 26px rgba(29, 78, 216, .34);
      }

      .report-action svg {
        width: 15px;
        height: 15px;
        flex: 0 0 auto;
      }

      .report-action--learn {
        border-color: color-mix(in srgb, var(--report-blue, var(--blue, #1d4ed8)) 28%, transparent);
        background: var(--report-paper, #fff);
        color: var(--report-blue, var(--blue, #1d4ed8));
        box-shadow: 0 8px 22px rgba(21, 34, 63, .14);
      }

      .report-action--learn:hover,
      .report-action--learn:focus-visible {
        border-color: rgba(18, 40, 106, .38);
        background: var(--blue-tint, #eef3fd);
        color: var(--blue-deep, #12286a);
      }

      @media screen and (max-width: 760px) {
        .${actionsClass} {
          right: 10px;
          bottom: calc(10px + env(safe-area-inset-bottom, 0px));
          left: 10px;
          width: auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          align-items: stretch;
        }

        .report-action {
          min-width: 0;
          min-height: 52px;
          padding: 13px 10px;
          font-size: 12px;
          letter-spacing: .04em;
          box-shadow: 0 8px 24px rgba(29, 78, 216, .24);
        }

        .report-action svg {
          width: 16px;
          height: 16px;
        }
      }

      @media screen and (max-width: 360px) {
        .report-action {
          font-size: 11px;
          padding-inline: 8px;
        }
      }

      @media print {
        .${actionsClass} {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function readPdfUrlFromMeta() {
    const comments = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
    let metaComment = null;

    while (comments.nextNode()) {
      if (/report-meta/i.test(comments.currentNode.nodeValue || '')) {
        metaComment = comments.currentNode;
        break;
      }
    }

    if (!metaComment) return '';

    const json = (metaComment.nodeValue || '').replace(/^\s*report-meta/i, '').trim();
    try {
      const meta = JSON.parse(json);
      return typeof meta.pdf === 'string' ? meta.pdf.trim() : '';
    } catch {
      return '';
    }
  }

  function removeLegacyPrintButton() {
    document.querySelectorAll('.printbtn').forEach((button) => {
      if (!button.closest(`.${actionsClass}`)) button.remove();
    });
  }

  function createActionBar() {
    if (document.querySelector(`.${actionsClass}`)) return;

    const actions = document.createElement('nav');
    actions.className = actionsClass;
    actions.setAttribute('aria-label', '報告操作');

    const learn = document.createElement('a');
    learn.className = 'report-action report-action--learn';
    learn.href = learnUrl;
    learn.target = '_blank';
    learn.rel = 'noopener';
    learn.setAttribute('aria-label', '前往更多 AI 課程');
    learn.innerHTML = `${icons.learn}<span>更多 AI 課程</span>`;

    const pdfUrl = readPdfUrlFromMeta();
    const pdf = document.createElement(pdfUrl ? 'a' : 'button');
    pdf.className = 'report-action report-action--pdf';
    pdf.setAttribute('aria-label', pdfUrl ? '下載文件' : '列印文件');
    pdf.innerHTML = `${icons.pdf}<span>${pdfUrl ? '下載文件' : '列印文件'}</span>`;

    if (pdfUrl) {
      pdf.href = pdfUrl;
      pdf.setAttribute('download', '');
    } else {
      pdf.type = 'button';
      pdf.addEventListener('click', () => window.print());
    }

    actions.append(learn, pdf);
    document.body.appendChild(actions);
  }

  function init() {
    if (window.NUVA_REPORT_ACCESS_BLOCKED) return;
    injectStyle();
    removeLegacyPrintButton();
    createActionBar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
