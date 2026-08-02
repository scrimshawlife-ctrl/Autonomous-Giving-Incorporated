# Autonomous Giving Incorporated

A dark-first deterministic public demonstration of how donations move from intent to verified community impact. AGI is the public experience between **Fund Intel** (decision intelligence) and **Impact Relay** (execution transparency).

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Click **Donate $250** to replay Jane's local story: Community Hardware Fund → Raspberry Pi Kits → Intro to Robotics → 18 verified students → delivered notification. It is allocation-backed transparency, not a payment system or claim of one-to-one attribution.

`app/` is the App Router site; `components/` holds presentation and the demo; `demo/` holds typed local scenario data; `docs/` holds product and technical decisions. Vercel deployment needs no environment variables or services.

v0.1 intentionally excludes accounts, APIs, databases, payments, CMS, dashboards, real notifications, analytics, and live integrations. See [docs](docs/) for the roadmap.
