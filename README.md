# ClickFix — Cloudflare Turnstile PoC

A security-awareness Proof of Concept demonstrating how a fake "Verify you are human" page can imitate a Cloudflare Turnstile verification flow and present OS-specific instructions to the user.

The project is intended for authorized red-team exercises, security research, and phishing-awareness training.

---

## Overview

ClickFix demonstrates a common social-engineering technique in which a malicious or misleading verification page attempts to convince a visitor to perform an action on their local machine.

The PoC:

- Detects the visitor's operating system
- Displays OS-specific verification instructions
- Demonstrates clipboard interaction
- Mimics the visual appearance of a Cloudflare Turnstile verification page
- Provides a standalone page for controlled laboratory testing
- Can also be used as an overlay demonstration on an existing test page

---

## Supported Operating Systems

| Operating System | Detection | Demonstration |
|------------------|-----------|---------------|
| Windows | Yes | Windows Run dialog workflow |
| macOS | Yes | Spotlight workflow |
| Linux | Yes | Terminal workflow |

---

## Project Structure

| File | Description |
|------|-------------|
| `index.html` | Standalone ClickFix demonstration |
| `clickfix.js` | Drop-in overlay for an authorized test environment |

---

## Configuration

The demonstration can be configured through the `CONFIG` object in the JavaScript source.

```js
const CONFIG = {
  domain: '',
  windows: 'YOUR-WINDOWS-TEST-COMMAND',
  mac:     'YOUR-MAC-TEST-COMMAND',
  linux:   'YOUR-LINUX-TEST-COMMAND',
  redirectUrl: null
};

| Option        | Description                               |
| ------------- | ----------------------------------------- |
| `domain`      | Domain used by the demonstration          |
| `windows`     | Command displayed for Windows testing     |
| `mac`         | Command displayed for macOS testing       |
| `linux`       | Command displayed for Linux testing       |
| `redirectUrl` | Optional URL used after the demonstration |


ddddd
