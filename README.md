# Autonomous Giving Incorporated

A light, evidence-first public demonstration of how donations move from intent to verified community impact. AGI is the public experience between **Fund Intel** (decision intelligence) and **Impact Relay** (execution transparency).

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

Click **Donate $250** to replay Jane's local story: Community Hardware Fund → Raspberry Pi Kits → Intro to Robotics → 18 verified students → delivered notification. It is allocation-backed transparency, not a payment system or claim of one-to-one attribution.

`app/` is the App Router site; `components/` holds presentation and the demo; `demo/` holds typed local scenario data; `tokens.css` is the design-token source of truth; and `docs/` holds product and technical decisions. GitHub Pages deploys static output from `main`; no environment variables or services are required.

v0.1 intentionally excludes accounts, APIs, databases, payments, CMS, dashboards, real notifications, and analytics. AGI now reads approved public aggregate projections from Fund Intel and Impact Relay, with a deterministic fallback; it does not read donor-level or raw-evidence data. Before publishing, follow the [release checklist](docs/RELEASE_CHECKLIST.md). See the [roadmap](docs/ROADMAP.md), [continuation plan](docs/CONTINUATION_PLAN.md), and [integration contracts](docs/INTEGRATION_CONTRACTS.md).
