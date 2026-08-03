# Autonomously Giving Incorporated

[![CI](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/workflows/ci.yml/badge.svg)](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/workflows/deploy-pages.yml)

Autonomously Giving Incorporated (AGI) is the corporate brand and public, evidence-first entry point for its giving platform. It explains how a funding decision can become an inspectable impact story without exposing donor records or claiming that this site moves money. Zero State is the software builder and appears only in the footer credit.

**[Visit autogive.app](https://autogive.app/)** · [GitHub Pages fallback](https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/)

## Product suite

| Product      | Role                                     | Live surface                                                                             |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| AGI          | Explains the funding-to-evidence journey | [Public workbench](https://autogive.app/)             |
| Fund Intel   | Publishes decision and campaign signals  | [Decision workspace](https://autogive.app/fund-intel/) |
| Impact Relay | Publishes verified aggregate outcomes    | [Public evidence](https://autogive.app/impact-relay/) |

The visitor journey is **AGI → Fund Intel → Impact Relay**. The data narrative is **Fund Intel decision → AGI explanation → Impact Relay evidence**.

## Current status

AGI is a static Next.js export deployed from `main` to GitHub Pages. During the production build it requests two approved public aggregate documents:

- Fund Intel `data/public-campaign.json`
- Impact Relay `data/public-impact.json`

The build accepts only the expected public authority declarations and a verified aggregate outcome. Network failures, malformed data, missing evidence, or disallowed authority values fail closed to the deterministic local scenario.

AGI does **not** collect donations, authenticate users, persist records, expose donor-level evidence, or write to either source repository.

## Local development

### Prerequisites

- Node.js 22
- npm, using the committed `package-lock.json`

### Setup

```bash
git clone https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated.git
cd Autonomous-Giving-Incorporated
npm ci
npm run dev
```

Open `http://localhost:3000`. The site remains usable when the public sources are unavailable because the canonical scenario is bundled locally.

### Commands

| Command                             | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| `npm run dev`                       | Start the local Next.js development server   |
| `npm run lint`                      | Run ESLint                                   |
| `npm run typecheck`                 | Type-check without emitting files            |
| `npm run build`                     | Create the static export in `out/`           |
| `GITHUB_ACTIONS=true npm run build` | Reproduce the GitHub Pages base path locally |
| `npm run format`                    | Format supported files with Prettier         |

Before opening a pull request, run lint, typecheck, and the GitHub Pages-mode build.

## Repository map

```text
app/                       App Router pages, metadata, robots, and sitemap
components/                Navigation, public signals, and deterministic demo UI
demo/scenario.ts           Canonical local scenario
integration/contracts.ts   Versioned narrative contracts
integration/fixtures.ts    Public-safe deterministic fixtures
integration/public-sources.ts
                           Build-time public-source adapter and fail-closed fallback
public/brand/              AGI corporate identity assets
docs/                      Product, architecture, delivery, and release records
site.ts                    Canonical production URL helpers
tokens.css                 Shared design-token source of truth
```

See [Architecture](docs/ARCHITECTURE.md) for system boundaries and [Integration contracts](docs/INTEGRATION_CONTRACTS.md) for the public-data rules.

## Trust and data boundaries

- Join records only through public allocation identifiers—never donor identity.
- Treat source documents as untrusted input and validate authority before display.
- Never fetch raw receipts, private evidence, contact data, or secret URLs.
- Never turn missing or rejected source data into inferred evidence.
- Treat `verified` as a source-system state, not one-to-one donor attribution.
- Keep the contribution demo explicitly deterministic; it is not a payment flow.

## Documentation

Start with the [documentation index](docs/README.md). Key references include:

- [Product definition](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Integration contracts](docs/INTEGRATION_CONTRACTS.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Continuation plan](docs/CONTINUATION_PLAN.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Release record](docs/RELEASES.md)

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing application behavior or documentation. Preserve the static, read-only MVP boundary unless a separately reviewed plan explicitly expands it.
