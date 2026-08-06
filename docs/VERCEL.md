# Vercel deployment

Primary production host for the AGI public workbench is **Vercel**, with canonical origin **https://autogive.app**.

The app is a **static Next.js export** (`output: "export"` → `out/`). No serverless functions, no runtime secrets, no auth.

## Project settings

| Setting | Value |
| --- | --- |
| Framework | **Other** / none (static export — not the Next.js serverless preset) |
| Install | `npm ci` |
| Build | `npm run build` (`next build` with `output: "export"`) |
| Output directory | `out` |
| Node | 22 (see `.node-version` / `engines`) |
| Root directory | `.` (repo root) |

> Do not set the Vercel framework preset to **Next.js** while using `output: "export"`. That preset expects a server build and fails looking for `routes-manifest.json` under `out/`.

Config in repo: [`vercel.json`](../vercel.json).

## Link & deploy (CLI)

```bash
# once per machine (team scope)
vercel link --yes --scope scrimshawlife-8819s-projects --project autonomous-giving-incorporated

# preview
vercel --yes --scope scrimshawlife-8819s-projects

# production
vercel --prod --yes --scope scrimshawlife-8819s-projects
```

Git integration (recommended): import `scrimshawlife-ctrl/Autonomous-Giving-Incorporated` in the Vercel dashboard so `main` → production and PRs → previews.

## Custom domain: autogive.app

### In Vercel

1. Project → **Settings → Domains**
2. Add `autogive.app` and `www.autogive.app`
3. Prefer **Redirect www → apex** (or the reverse — pick one canonical)

### DNS at Namecheap

Nameservers are currently Namecheap **hosting** DNS. Edit records in that panel (or switch the domain to BasicDNS first).

**Option A — apex A record (common)**

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` (or the A targets from `vercel domains verify`) |
| CNAME | `www` | `cname.vercel-dns.com` |

Live production URL (until custom domain verifies):  
https://autonomous-giving-incorporated.vercel.app

**Option B — Vercel nameservers**

In the Domains UI, use the nameservers Vercel shows for the domain (full DNS on Vercel). Keep/recreate **MX** / **TXT** for email if needed.

Remove LiteSpeed / parking A records that still point at Namecheap hosting.

### Do not dual-point the apex

DNS for `autogive.app` can target **either** Vercel **or** GitHub Pages, not both. Choose Vercel as production; keep GitHub Pages as the github.io fallback only.

## Local verification before ship

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
# out/ must contain index.html and CNAME is optional for Vercel
ls out/index.html
```

## Relationship to GitHub Pages

| Surface | Role |
| --- | --- |
| Vercel + `autogive.app` | Production |
| `scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/` | Fallback mirror (workflow still deploys) |
| `public/CNAME` | GitHub Pages custom-domain helper; harmless static file on Vercel |

Legacy project-site path (github.io only):

```bash
GITHUB_PAGES_BASE_PATH=1 npm run build
```

Vercel builds must keep **empty** `basePath` (default).

## Security / trust boundary (unchanged)

- Build-time fetch of public Fund Intel / Impact Relay aggregates only
- Fail closed to deterministic local scenario
- No donor PII, no payments, no server writes
