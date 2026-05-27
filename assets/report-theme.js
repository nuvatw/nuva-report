(() => {
  const storageKey = 'nuva-report-background-settings';
  const styleId = 'nuva-report-theme-style';
  const allowedPatterns = new Set(['grid', 'dot', 'ruled', 'none']);
  const legacyWarmColors = new Set(['#f1ede3', '#ece7d8', '#eee9dd', '#e8ece1']);
  const legacyLineColors = new Set(['#172025', '#162024', '#182124', '#15223f']);
  const defaults = {
    pattern: 'grid',
    color: '#f8fbff',
    lineColor: '#1d4ed8',
    opacity: 0.034,
    brightness: 1.04,
    contrast: 0.92,
    size: 42
  };

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.min(max, Math.max(min, number));
  }

  function normalizeHex(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    const shortMatch = /^#?([0-9a-f]{3})$/i.exec(trimmed);
    if (shortMatch) {
      return `#${shortMatch[1].split('').map((char) => char + char).join('')}`.toLowerCase();
    }
    const fullMatch = /^#?([0-9a-f]{6})$/i.exec(trimmed);
    if (fullMatch) return `#${fullMatch[1]}`.toLowerCase();
    return fallback;
  }

  function hexToRgb(hex) {
    const normalized = normalizeHex(hex, defaults.color).slice(1);
    const value = Number.parseInt(normalized, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, '0')).join('')}`;
  }

  function applyBrightness(hex, brightness) {
    const rgb = hexToRgb(hex);
    const target = brightness >= 1 ? 255 : 0;
    const amount = Math.abs(brightness - 1);
    return rgbToHex({
      r: rgb.r + (target - rgb.r) * amount,
      g: rgb.g + (target - rgb.g) * amount,
      b: rgb.b + (target - rgb.b) * amount
    });
  }

  function rgba(hex, opacity) {
    const rgb = hexToRgb(hex);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }

  function normalizeSettings(input = {}) {
    const pattern = allowedPatterns.has(input.pattern) ? input.pattern : defaults.pattern;
    const normalizedColor = normalizeHex(input.color, defaults.color);
    const color = legacyWarmColors.has(normalizedColor) ? defaults.color : normalizedColor;
    const normalizedLineColor = normalizeHex(input.lineColor, defaults.lineColor);
    const lineColor = legacyLineColors.has(normalizedLineColor) ? defaults.lineColor : normalizedLineColor;
    const opacity = clamp(input.opacity ?? defaults.opacity, 0, 0.12);
    const brightness = clamp(input.brightness ?? defaults.brightness, 0.88, 1.12);
    const contrast = clamp(input.contrast ?? defaults.contrast, 0.7, 1.2);
    const size = Math.round(clamp(input.size ?? defaults.size, 28, 72));

    return {
      pattern,
      color,
      lineColor,
      opacity,
      brightness,
      contrast,
      size
    };
  }

  function readStoredSettings() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeStoredSettings(settings) {
    const normalized = normalizeSettings(settings);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(normalized));
    } catch {
      // 背景偏好屬於本機設定；儲存失敗時仍保留當頁套用效果。
    }
    return normalized;
  }

  function backgroundImageFor(settings) {
    if (settings.pattern === 'none') return 'none';
    if (settings.pattern === 'dot') {
      return 'radial-gradient(circle, var(--report-bg-line-strong) 1px, transparent 1.25px)';
    }
    if (settings.pattern === 'ruled') {
      return 'linear-gradient(0deg, var(--report-bg-line) 1px, transparent 1px)';
    }
    return [
      'linear-gradient(90deg, var(--report-bg-line-strong) 1px, transparent 1px)',
      'linear-gradient(0deg, var(--report-bg-line) 1px, transparent 1px)'
    ].join(', ');
  }

  function injectThemeStyle() {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      :root {
        --report-bg-base: ${defaults.color};
        --report-bg-line: rgba(29, 78, 216, .034);
        --report-bg-line-strong: rgba(29, 78, 216, .046);
        --report-bg-size: ${defaults.size}px;
        --report-bg-size-y: ${defaults.size}px;
        --report-bg-image: linear-gradient(90deg, var(--report-bg-line-strong) 1px, transparent 1px), linear-gradient(0deg, var(--report-bg-line) 1px, transparent 1px);
        --report-paper: #ffffff;
        --report-ink: #172025;
        --report-blue: #1d4ed8;
      }

      body {
        background-color: var(--report-bg-base) !important;
        background-image: var(--report-bg-image) !important;
        background-size: var(--report-bg-size) var(--report-bg-size-y) !important;
      }

      @media print {
        body {
          background: #fff !important;
          background-image: none !important;
          background-size: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function applyTheme(input) {
    const settings = normalizeSettings(input || readStoredSettings());
    const baseColor = applyBrightness(settings.color, settings.brightness);
    const lineOpacity = settings.opacity * settings.contrast;
    const strongOpacity = Math.min(0.16, lineOpacity * 1.35);
    const ySize = settings.pattern === 'ruled' ? Math.round(settings.size * 0.72) : settings.size;
    const root = document.documentElement;

    injectThemeStyle();
    root.dataset.reportThemePattern = settings.pattern;
    root.style.setProperty('--report-bg-base', baseColor);
    root.style.setProperty('--report-bg-line', rgba(settings.lineColor, Number(lineOpacity.toFixed(4))));
    root.style.setProperty('--report-bg-line-strong', rgba(settings.lineColor, Number(strongOpacity.toFixed(4))));
    root.style.setProperty('--report-bg-size', `${settings.size}px`);
    root.style.setProperty('--report-bg-size-y', `${ySize}px`);
    root.style.setProperty('--report-bg-image', backgroundImageFor(settings));
    root.style.setProperty('--surface', baseColor);
    root.style.setProperty('--desk', baseColor);
    root.style.setProperty('--report-paper', '#ffffff');
    root.style.setProperty('--report-ink', '#172025');
    root.style.setProperty('--report-blue', '#1d4ed8');

    return settings;
  }

  function saveTheme(input) {
    const settings = writeStoredSettings(input);
    applyTheme(settings);
    return settings;
  }

  function resetTheme() {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // localStorage 可能不可用，仍回到預設外觀。
    }
    return applyTheme(defaults);
  }

  window.NUVA_REPORT_THEME = {
    defaults: { ...defaults },
    storageKey,
    read: () => normalizeSettings(readStoredSettings()),
    apply: applyTheme,
    save: saveTheme,
    reset: resetTheme
  };

  applyTheme();
})();
