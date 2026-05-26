(() => {
  const storageKey = 'nuva-report-auth';
  const cookieKey = 'nuva_report_auth';
  const passwordHash = '6e65b61d030e5ac6492802c6f619a63006e5b0e2cafc0170ab92a68083162528';
  const gateId = 'nuva-auth-gate';
  const logoutId = 'nuva-auth-logout';

  function injectStyle() {
    if (document.getElementById('nuva-auth-style')) return;

    const style = document.createElement('style');
    style.id = 'nuva-auth-style';
    style.textContent = `
      html.auth-locked,
      html.auth-locked body {
        min-height: 100%;
        overflow: hidden;
      }

      html.auth-locked body > :not(.auth-gate):not(script):not(style) {
        display: none !important;
      }

      .auth-gate {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          linear-gradient(90deg, rgba(22, 32, 36, .045) 1px, transparent 1px),
          linear-gradient(0deg, rgba(22, 32, 36, .035) 1px, transparent 1px),
          #f4f6f2;
        background-size: 42px 42px;
        color: #162024;
        font-family: "Noto Sans TC", sans-serif;
      }

      .auth-panel {
        width: min(420px, 100%);
        border: 1px solid #162024;
        border-radius: 8px;
        background: #fff;
        padding: 28px;
        box-shadow: 10px 12px 0 rgba(22, 32, 36, .12);
      }

      .auth-kicker,
      .auth-submit,
      .auth-logout {
        font-family: "Archivo", "Noto Sans TC", sans-serif;
        font-weight: 800;
      }

      .auth-kicker {
        color: #1f6e72;
        font-size: .78rem;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .auth-title {
        margin: 12px 0 8px;
        font-family: "Noto Serif TC", "Noto Sans TC", serif;
        font-size: 2rem;
        font-weight: 900;
        line-height: 1.2;
      }

      .auth-copy {
        margin: 0 0 22px;
        color: #687271;
        font-size: .95rem;
        line-height: 1.75;
      }

      .auth-field {
        display: grid;
        gap: 8px;
      }

      .auth-field span {
        color: #687271;
        font-size: .82rem;
        font-weight: 700;
      }

      .auth-input {
        width: 100%;
        min-height: 48px;
        border: 1px solid #162024;
        border-radius: 8px;
        background: #fff;
        padding: 0 14px;
        color: #162024;
        outline: none;
      }

      .auth-input:focus {
        border-color: #bd3f30;
        box-shadow: 0 0 0 3px rgba(189, 63, 48, .12);
      }

      .auth-submit {
        width: 100%;
        min-height: 48px;
        margin-top: 14px;
        border: 1px solid #162024;
        border-radius: 8px;
        background: #162024;
        color: #fff;
        cursor: pointer;
      }

      .auth-submit:hover,
      .auth-submit:focus-visible,
      .auth-logout:hover,
      .auth-logout:focus-visible {
        transform: translateY(-2px);
      }

      .auth-error {
        min-height: 20px;
        margin: 10px 0 0;
        color: #bd3f30;
        font-size: .86rem;
        font-weight: 700;
      }

      .auth-logout {
        position: fixed;
        left: 50%;
        bottom: 18px;
        z-index: 1001;
        min-height: 38px;
        border: 1px solid rgba(22, 32, 36, .22);
        border-radius: 999px;
        background: rgba(255, 255, 255, .92);
        color: #162024;
        padding: 0 16px;
        cursor: pointer;
        font-size: .78rem;
        letter-spacing: .08em;
        transform: translateX(-50%);
        box-shadow: 0 8px 22px rgba(22, 32, 36, .12);
        transition: transform .16s ease, background .16s ease;
      }

      .auth-logout:hover,
      .auth-logout:focus-visible {
        background: #fff;
        transform: translateX(-50%) translateY(-2px);
        outline: none;
      }

      html.auth-locked .auth-logout {
        display: none;
      }

      @media (max-width: 560px) {
        .auth-panel {
          padding: 24px 20px;
        }

        .auth-title {
          font-size: 1.7rem;
        }

        .auth-logout {
          bottom: 72px;
        }
      }

      @media print {
        .auth-gate,
        .auth-logout {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function isAuthenticated() {
    return readAuthToken() === passwordHash;
  }

  function readAuthToken() {
    try {
      if (window.localStorage?.getItem(storageKey)) {
        return window.localStorage.getItem(storageKey);
      }
    } catch {
      // Fall back to cookies in restricted browser contexts.
    }

    const cookie = String(document.cookie || '')
      .split('; ')
      .find((item) => item.startsWith(`${cookieKey}=`));
    if (cookie) return decodeURIComponent(cookie.split('=').slice(1).join('='));

    try {
      const windowNameToken = String(window.name || '')
        .split('|')
        .find((item) => item.startsWith(`${cookieKey}=`));
      return windowNameToken ? decodeURIComponent(windowNameToken.split('=').slice(1).join('=')) : '';
    } catch {
      return '';
    }
  }

  function writeAuthToken() {
    try {
      window.localStorage?.setItem(storageKey, passwordHash);
    } catch {
      // Cookie storage below keeps the one-time login behavior available.
    }

    try {
      document.cookie = `${cookieKey}=${encodeURIComponent(passwordHash)}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Some embedded browsers expose cookie as read-only.
    }

    writeWindowNameToken(passwordHash);
  }

  function clearAuthToken() {
    try {
      window.localStorage?.removeItem(storageKey);
    } catch {
      // Continue clearing the cookie fallback.
    }

    try {
      document.cookie = `${cookieKey}=; path=/; max-age=0; SameSite=Lax`;
    } catch {
      // Continue clearing the window.name fallback.
    }

    writeWindowNameToken('');
  }

  function writeWindowNameToken(value) {
    try {
      const parts = String(window.name || '')
        .split('|')
        .filter((item) => item && !item.startsWith(`${cookieKey}=`));

      if (value) parts.push(`${cookieKey}=${encodeURIComponent(value)}`);
      window.name = parts.join('|');
    } catch {
      // If every persistent storage option is unavailable, the current unlock still works.
    }
  }

  async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  function unlock() {
    document.documentElement.classList.remove('auth-locked');
    document.getElementById(gateId)?.remove();
    mountLogout();
  }

  function logout() {
    clearAuthToken();
    window.location.reload();
  }

  function mountLogout() {
    if (document.getElementById(logoutId) || !document.body || !isAuthenticated()) return;

    const button = document.createElement('button');
    button.id = logoutId;
    button.className = 'auth-logout';
    button.type = 'button';
    button.textContent = '登出';
    button.setAttribute('aria-label', '登出成果報告網站');
    button.addEventListener('click', logout);
    document.body.appendChild(button);
  }

  function mountGate() {
    if (document.getElementById(gateId) || !document.body) return;

    document.documentElement.classList.add('auth-locked');
    const gate = document.createElement('section');
    gate.id = gateId;
    gate.className = 'auth-gate';
    gate.setAttribute('aria-label', '成果報告登入');
    gate.innerHTML = `
      <form class="auth-panel" autocomplete="off">
        <div class="auth-kicker">NUVA REPORT</div>
        <h1 class="auth-title">請輸入密碼</h1>
        <p class="auth-copy">登入後此瀏覽器會記住狀態，直到你按下登出。</p>
        <label class="auth-field">
          <span>密碼</span>
          <input class="auth-input" name="password" type="password" inputmode="numeric" autocomplete="current-password" autofocus>
        </label>
        <button class="auth-submit" type="submit">進入報告</button>
        <p class="auth-error" role="alert" aria-live="polite"></p>
      </form>
    `;

    const form = gate.querySelector('form');
    const input = gate.querySelector('input');
    const error = gate.querySelector('.auth-error');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      error.textContent = '';

      if (!window.crypto?.subtle) {
        error.textContent = '此瀏覽器不支援安全登入，請改用最新版瀏覽器。';
        return;
      }

      const enteredHash = await sha256(input.value);
      if (enteredHash !== passwordHash) {
        input.value = '';
        input.focus();
        error.textContent = '密碼不正確，請再試一次。';
        return;
      }

      writeAuthToken();
      unlock();
    });

    document.body.appendChild(gate);
    input.focus();
  }

  function init() {
    injectStyle();
    if (isAuthenticated()) {
      unlock();
      return;
    }

    mountGate();
  }

  if (!isAuthenticated()) {
    document.documentElement.classList.add('auth-locked');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
