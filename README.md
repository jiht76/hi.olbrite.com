# Olbrite — Conversational AI Agents & Automation Platform

[![Status](https://img.shields.io/badge/status-active-success.svg)](https://hi.olbrite.com)
[![Website](https://img.shields.io/badge/website-hi.olbrite.com-754be7.svg)](https://hi.olbrite.com)
[![Stack](https://img.shields.io/badge/stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES%20Modules-blue.svg)](https://hi.olbrite.com)
[![Hosting](https://img.shields.io/badge/hosted%20on-here.now-black.svg)](https://here.now)

Official presentation microsite for **Olbrite** ([https://hi.olbrite.com](https://hi.olbrite.com)).  
Olbrite unifies AI agents, CRM and conversation automation (WhatsApp, Instagram, Messenger, SMS, and more) into an intelligent growth engine.

---

## 🚀 Key Features & Highlights

- **Cinematic Entry & Glass Doors**: Frosted glass doors with dual brand engraving parting open on entry to reveal the active holographic office.
- **Hardware-Accelerated Canvas Scrubbing**: 80 ultra-crisp HD frames rendered on an accelerated `<canvas>` at 8.5 FPS transitioning seamlessly into an infinite HD ambient video loop.
- **Mindy AI Concierge Avatar**: Interactive greeting avatar with real-time audio playback and smooth shrink-to-corner exit animation.
- **LeadConnector Live Chat Integration**: Automatic on-demand initialization of the official customer conversation chat widget.
- **"What is an Agent?" Architecture Explorer**: Interactive 3D desk explorer showcasing the 5 pillars of modern autonomous agents (Model, Skills, Tools, Harness, Loops).
- **"Why Choose Olbrite" Pillars**: Enterprise credibility, security, frictionless integration, and measurable business ROI.
- **Infinite Bidirectional Integrations Marquee**: 20 official vector brand logos (OpenAI, Gemini, Anthropic, WhatsApp, Telegram, HubSpot, Shopify, etc.).
- **Zero Heavy Frameworks (100% Vanilla Web)**: Pure semantic HTML5, Vanilla CSS with custom properties, and native ES Modules. Loads in sub-seconds with Lighthouse 95+ score.
- **Auxiliary Debug Mode (`?intro=off`)**: Instant bypass of the intro sequence for development, responsive layout checks, and fast review.

---

## 🛠️ Quick Start & Local Development

No build step or Node package installation is needed. You can run it with any static server:

```bash
# Start local server
python3 -m http.server 3030

# Open in browser:
# Standard entry with cinematic flow:
http://localhost:3030

# Fast inspection mode (bypasses intro sequence):
http://localhost:3030/?intro=off
```

---

## 📁 Repository Structure

```text
hi.olbrite.com/
├── assets/
│   ├── branding/         # Logos, icons, and multi-resolution glass favicons
│   ├── hero-frames/      # 80 HD cinematic frames (frame_001.jpg to frame_080.jpg)
│   ├── logos/            # 20 official SVG vector integration logos
│   └── videos/           # HD ambient loop and Mindy transparent avatar video
├── css/
│   └── style.css         # Design tokens, glassmorphism, responsive grid, animations
├── js/
│   ├── hero-controller.js# Canvas frame controller, status pill, loop handoff, Mindy
│   └── main.js           # Navigation accordion and architecture explorer logic
├── docs/                 # Detailed technical specifications and historical development log
├── dist/                 # Clean distribution folder for production deployments
├── index.html            # Semantic landing page markup
├── AGENTS.md             # Developer & AI Agent pair-programming consistency guide
└── README.md             # Project documentation
```

---

## 🚢 Deployment to Production

The site is hosted on **here.now** under the `olbrite` workspace:

```bash
# 1. Sync assets and markup into dist/
rsync -av --exclude='.git*' --exclude='.DS_Store' --exclude='dist' --exclude='docs' . dist/

# 2. Deploy to the official slug linked to hi.olbrite.com
~/.agents/skills/here-now/scripts/publish.sh dist --slug gilded-mortar-r7an --workspace olbrite --overwrite --client gemini
```

---

## 🤖 Guidelines for AI Agents

Refer to [AGENTS.md](AGENTS.md) for full context, conventions, design tokens, and guidelines before making architectural changes.
