# AGI Suite — Public Vercel Surfaces (testable today)

**Date:** 2026-08-06  
**Status:** Design approved for implementation planning  
**Owner:** Zero State / AGI suite  
**Scope bar:** Public suite only — path prefixes under `autogive.app`  
**Explicit non-goals today:** Supabase auth, allocation middleware host, every.org live webhooks, Impact Relay Cloud Run API  

---

## 1. Problem

Autonomously Giving Incorporated must stay **demoable and operable daily**. AGI is already live on Vercel at **https://autogive.app**. Fund Intel and Impact Relay still only ship on GitHub Pages, so suite links under `autogive.app/fund-intel/` and `autogive.app/impact-relay/` break. We need one domain, three public surfaces, and a short smoke path that proves the product story without private backends.

## 2. Goals (today)

1. Serve three **public static** products under one apex domain with path prefixes.
2. Preserve existing privacy contracts (`advisory_only`, `public_aggregate_only`).
3. Keep independent repos and independent deploys.
4. Provide an automated/scriptable smoke checklist that can be run in minutes.
5. Leave Supabase and money movement as **Phase 2**.

## 3. Non-goals (today)

| Out of scope | Why |
| --- | --- |
| Director login / MFA / RLS | Requires staging Supabase env + acceptance beyond public bar |
| Allocation middleware host | Separate pilot; not required for public narrative |
| Live every.org webhooks | Operator + platform credentials |
| IR durable Postgres API / Cloud Run | Public tracker is static aggregates |
| Merging the three repositories | Ownership boundaries stay |

## 4. Current state (audit)

| Component | Hosting (before this work) | Notes |
| --- | --- | --- |
| AGI | Vercel production + `autogive.app` | Next.js static export; domain verified |
| Fund Intel | GitHub Pages `.../Fund-Intel/` | Relative assets; `data/public-campaign.json` |
| Impact Relay | GitHub Pages `.../Impact-Relay/` | Relative assets; `data/public-impact.json` |
| AGI signal fetch | `raw.githubusercontent.com/.../main/data/*.json` | Fail-closed validation already implemented |
| Supabase staging | Project provisioned | Not required for public shell |

## 5. Architecture

### 5.1 Topology

```text
autogive.app  →  Vercel project: autonomous-giving-incorporated (AGI)
      │
      ├── /                         AGI static export (Next out/)
      ├── /fund-intel/*             rewrite → fund-intel Vercel project
      └── /impact-relay/*           rewrite → impact-relay Vercel project

GitHub main remains source of truth for code + public JSON.
GitHub Pages remains optional fallback mirrors.
```

### 5.2 Approach chosen

**Three Vercel projects + path rewrites on the AGI (domain owner) project.**

Rejected:

- Single combined `out/` tree (couples release cadence, packaging debt).
- Subdomains only (more DNS work; mismatches existing path links).

### 5.3 Projects

| Product | GitHub repo | Vercel project name | Framework | Output |
| --- | --- | --- | --- | --- |
| AGI | `scrimshawlife-ctrl/Autonomous-Giving-Incorporated` | `autonomous-giving-incorporated` | Other / null + Next export | `out/` |
| Fund Intel | `scrimshawlife-ctrl/Fund-Intel` | `fund-intel` | Other / null (static root) | `.` (repo root static files) |
| Impact Relay | `scrimshawlife-ctrl/Impact-Relay` | `impact-relay` | Other / null (static root) | `.` (public HTML + `data/`) |

Node for AGI: **22.x**. FI/IR: no Node build required for public static publish (CI validation may still run Node/Python in GitHub Actions).

### 5.4 Routing (AGI `vercel.json`)

Rules (order matters conceptually: redirects before rewrites):

1. Redirect `^/fund-intel$` → `/fund-intel/`
2. Redirect `^/impact-relay$` → `/impact-relay/`
3. Rewrite `/fund-intel/:path*` → `https://<fund-intel-production-host>/:path*`
4. Rewrite `/impact-relay/:path*` → `https://<impact-relay-production-host>/:path*`

Trailing-slash redirects are **required** so relative asset URLs (`styles.css`, `app.js`, `sponsors.html`) resolve under the path prefix.

Rewrite destinations use each project’s stable production hostname (e.g. `fund-intel.vercel.app` or the project’s production alias). Do not hardcode ephemeral deployment IDs.

### 5.5 Asset and path assumptions

Fund Intel and Impact Relay use **relative** `href`/`src` paths. Served under `/fund-intel/` and `/impact-relay/` with trailing slashes, browsers request assets under the same prefix, which rewrites correctly.

Do **not** force `GITHUB_PAGES_BASE_PATH`-style prefixes into FI/IR for Vercel path hosting; relative paths are correct.

### 5.6 Data flow

**AGI build time (unchanged authority rules):**

- Fetch Fund Intel `public-campaign.json` from GitHub raw (or later from `https://autogive.app/fund-intel/data/public-campaign.json` once rewrites are stable).
- Fetch Impact Relay `public-impact.json` similarly.
- Accept only expected `authority` values; otherwise deterministic local scenario.

**Browser:**

- AGI page renders narrative + signal chips (live projection or fallback).
- FI portal and IR tracker are independent static apps under path prefixes.
- Public JSON is also HTTP-fetchable under each path for human and tooling inspection.

### 5.7 Privacy / trust boundary (unchanged)

- Public surfaces never include donor identity, contact lists, workbooks, or private evidence blobs.
- FI authority on public campaign projection: `advisory_only`.
- IR authority on public impact projection: `public_aggregate_only`.
- `verified` remains source-system state, not one-to-one donor attribution.

## 6. Deployment plan

### 6.1 Fund Intel project

1. Create Vercel project `fund-intel` under team `scrimshawlife-8819s-projects`.
2. Connect GitHub repo `Fund-Intel`, production branch `main`.
3. Settings: Framework **Other**, no build command (or a no-op), output directory empty / root, include only public static paths (default full root is OK if repo already excludes private data via `.gitignore` + CI prohibit rules).
4. Deploy production; record production URL.
5. Optional: add `vercel.json` with security headers mirroring AGI (nosniff, frame deny, referrer policy).

### 6.2 Impact Relay project

Same as Fund Intel for static public HTML + `data/`. Python package, Docker, and Postgres services are **not** deployed in this project.

### 6.3 AGI project updates

1. Extend `vercel.json` with redirects + rewrites to FI/IR production hosts.
2. Redeploy AGI production (domain already `autogive.app` / `www`).
3. Keep deployment protection off for public marketing surfaces.

### 6.4 Git integration

All three projects: GitHub connected so `main` pushes auto-deploy. GitHub Pages workflows may remain as fallback; Pages outage must not block Vercel.

## 7. Test plan — “testable today”

### 7.1 Automated smoke (scriptable)

| # | Request | Expect |
| --- | --- | --- |
| 1 | `GET https://autogive.app/` | 200, Vercel, AGI title |
| 2 | `GET https://autogive.app/fund-intel/` | 200, HTML shell, CSS/JS under same prefix |
| 3 | `GET https://autogive.app/impact-relay/` | 200, HTML shell |
| 4 | `GET https://autogive.app/fund-intel/data/public-campaign.json` | 200, JSON, `authority === "advisory_only"` |
| 5 | `GET https://autogive.app/impact-relay/data/public-impact.json` | 200, JSON, `authority === "public_aggregate_only"` |
| 6 | `GET https://www.autogive.app/` | 200 or redirect to apex; valid TLS |
| 7 | AGI homepage body | Contains signal status (live or deterministic fallback), not empty main |

Deliverable: `scripts/smoke-public-suite.sh` (or equivalent) in AGI repo exit 0/1.

### 7.2 Manual walk (5 minutes)

1. Open AGI → read hero → open suite links to Fund Intel and Impact Relay.
2. Confirm FI panels render without console 404 on CSS.
3. Confirm IR evidence sections render.
4. Confirm public JSON opens in browser and is parseable.

### 7.3 Pass criteria for “today”

All automated smoke checks pass. Manual walk finds no broken primary navigation between the three surfaces under `autogive.app`.

## 8. Failure modes

| Failure | User impact | Mitigation |
| --- | --- | --- |
| FI or IR project down | Path 502/404; AGI home still up | Fix that project; AGI independent |
| Rewrite destination wrong | Path content wrong or loop | Fix AGI `vercel.json`; redeploy AGI only |
| Public JSON invalid | AGI shows deterministic fallback | Existing fail-closed adapter |
| GitHub Actions runner outage | Does not block Vercel git deploys | Prefer Vercel for production path |
| Missing trailing slash | Broken relative assets | Redirect rules |

## 9. Phase 2 (documented, not implemented now)

Supabase director path (staging first):

1. Confirm staging project URL + anon key for FI only (never service role in browser).
2. Set Vercel env for `fund-intel` preview/production as needed for `runtime-config.js` generation pattern already used on Pages.
3. Smoke: director login, role visibility, no PII leakage on public routes.
4. Only then: allocation middleware host + every.org webhook.

## 10. Implementation units (for planning)

1. Create + deploy `fund-intel` Vercel project from Fund-Intel `main`.
2. Create + deploy `impact-relay` Vercel project from Impact-Relay `main`.
3. Update AGI rewrites/redirects; production deploy.
4. Add smoke script + run pass criteria.
5. Light doc updates (VERCEL.md, suite architecture note, optional cross-link cleanup).

## 11. Success metrics

- Suite story works on **one domain** without requiring GitHub Pages.
- Operator can re-verify in under five minutes with the smoke script.
- No expansion of public data boundary.
