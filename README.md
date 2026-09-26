<div align="center">

# 🛡️ ClickFix — Cloudflare Turnstile Style PoC

**A pixel-accurate ClickFix proof-of-concept for authorized red team engagements.**

OS-aware clipboard injection · Standalone HTML · Injectable JavaScript · Dark mode native

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-f7df1e?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![For Authorized Testing](https://img.shields.io/badge/Use-Authorized%20Testing%20Only-red)](#-disclaimer)

</div>

---

## 📖 Overview

**ClickFix** is a research-grade proof-of-concept that renders a pixel-accurate replica of Cloudflare's *"Verify you are human"* Turnstile challenge. It is designed to help red teams, blue teams, and security researchers demonstrate and study modern **social-engineering–driven clipboard injection** techniques.

When a visitor clicks the checkbox, the script:

1. 🔍 Detects the visitor's **operating system** (Windows, macOS, or Linux)
2. 📋 Automatically copies an **OS-specific command** to the clipboard
3. 📝 Displays tailored **step-by-step instructions** for that OS
4. ✅ Simulates a successful verification flow

The result is a convincing, single-click experience that mirrors the real Cloudflare challenge — useful for awareness training, phishing simulations, and detection engineering.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **OS Detection** | Reliably identifies Windows, macOS, and Linux via `userAgent` + `platform` |
| 📋 **Auto Clipboard Copy** | Uses the modern Clipboard API with a legacy `execCommand` fallback |
| 🎨 **Pixel-Accurate UI** | Faithfully reproduces the Cloudflare Turnstile layout, typography, and logo |
| 🌓 **Dark / Light Mode** | Auto-adapts to the visitor's system theme |
| 📱 **Mobile Responsive** | Works flawlessly on phones and tablets |
| 🧩 **Two Delivery Modes** | Standalone HTML page **or** injectable JavaScript overlay |
| 🛡️ **Style Isolation** | The overlay uses `all: initial` so host-page CSS never interferes |
| 🔒 **Runs Once** | Guarded against double injection |
| ⚙️ **Single Config Block** | Change your payload URLs in one place |

---

## 📂 Repository Structure
