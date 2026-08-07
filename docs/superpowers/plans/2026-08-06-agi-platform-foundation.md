# AGI Platform Foundation + Workspace Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Fund-Intel schema to Supabase platform `utdioxwiskzatwoejgiu`, appoint `scrimshawlife@gmail.com` as `master_admin`, seed synthetic tenants, and enable magic-link login to `https://autogive.app/portfolio-signals/workspace` via anon-only Vercel runtime config.

**Architecture:** Single data plane on platform Supabase. Existing migrations in Fund-Intel are the schema source of truth. Workspace static shell already exists; only config generation and host allowlisting need retargeting from legacy staging. Public AGI/FI/IR shells stay anon-free of service role.

**Tech Stack:** Supabase (Auth + Postgres + RLS), Fund-Intel static workspace + `runtime-config.js`, Vercel project `fund-intel`, Node 22, Bash operator scripts.

**Spec:** `docs/superpowers/specs/2026-08-06-agi-platform-foundation-design.md`

## Global Constraints

- Platform Supabase ref: `utdioxwiskzatwoejgiu` only (`https://utdioxwiskzatwoejgiu.supabase.co`).
- Legacy `ecxkhihlbrcwpavfoaoq` is frozen for new tenancy.
- Browser and Vercel env: **anon key only** — never service role.
- First master_admin email: `scrimshawlife@gmail.com` (Qi Diaz later without redesign).
- Synthetic tenants only — no real CRM/workbook import.
- Do not put secrets in git; `runtime-config.js` stays gitignored.
- Public suite smoke must still pass: `./scripts/smoke-public-suite.sh` in AGI repo.
- Keep multi-tenant rules: `master_admin` does not auto-grant private CRM of all clients.

## File map

| Path | Responsibility |
| --- | --- |
| `Fund-Intel/scripts/staging/generate-runtime-config.mjs` | Emit anon-only `runtime-config.js`; allow platform host |
| `Fund-Intel/scripts/staging/apply-migrations.sh` | Confirm remote push target is platform ref |
| `Fund-Intel/scripts/staging/bootstrap.env.example` | Document platform URL/ref env names |
| `Fund-Intel/scripts/staging/runtime-config.staging.example.js` | Example browser config for platform |
| `Fund-Intel/scripts/platform/bootstrap-master-admin.sql` | Idempotent SQL template to appoint master_admin by user id |
| `Fund-Intel/scripts/platform/verify-platform-isolation.sql` | Isolation smoke SQL (synthetic second tenant) |
| `Fund-Intel/vercel.json` | Optional buildCommand to generate runtime-config on Vercel |
| `Fund-Intel/.github/workflows/validate-and-deploy.yml` | Pass platform env into generate step if Pages still used |
| `Fund-Intel/docs/STAGING-BOOTSTRAP.md` | Retarget to platform |
| `Fund-Intel/docs/AUTHENTICATED-WORKSPACE.md` | Platform host + workspace URL |
| `Fund-Intel/docs/PLATFORM.md` | Phase 2 status |
| `Autonomous-Giving-Incorporated/docs/PLATFORM.md` | Phase 2 checklist link |
| `Autonomous-Giving-Incorporated/scripts/smoke-public-suite.sh` | Unchanged regression |

---

### Task 1: Unlock runtime-config generator for platform host

**Files:**
- Modify: `Fund-Intel/scripts/staging/generate-runtime-config.mjs`
- Modify: `Fund-Intel/.github/workflows/local-security-contract.yml` (assertions that mention non-staging refuse)
- Test: run generator with env vars locally (no secrets committed)

**Interfaces:**
- Consumes: `STAGING_SUPABASE_URL` or `PLATFORM_SUPABASE_URL`, `STAGING_SUPABASE_ANON_KEY` or `PLATFORM_SUPABASE_ANON_KEY`
- Produces: `runtime-config.js` with `window.HACKER_DOJO_CONFIG = { supabaseUrl, supabaseAnonKey, defaultClientSlug }`

- [ ] **Step 1: Replace host allowlist in generator**

Replace the hard-coded legacy-only check with platform-first allowlist:

```javascript
import { writeFileSync } from 'node:fs';

const supabaseUrl = (
  process.env.PLATFORM_SUPABASE_URL || process.env.STAGING_SUPABASE_URL || ''
).trim();
const supabaseAnonKey = (
  process.env.PLATFORM_SUPABASE_ANON_KEY || process.env.STAGING_SUPABASE_ANON_KEY || ''
).trim();

const ALLOWED_HOSTS = new Set([
  'https://utdioxwiskzatwoejgiu.supabase.co',
  // legacy freeze: emit only if explicitly forced for emergency Pages rollback
  'https://ecxkhihlbrcwpavfoaoq.supabase.co',
]);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'PLATFORM_SUPABASE_URL (or STAGING_SUPABASE_URL) and matching ANON_KEY are required',
  );
}

if (!ALLOWED_HOSTS.has(supabaseUrl)) {
  throw new Error(`Refusing to emit runtime config for unlisted Supabase host: ${supabaseUrl}`);
}

if (
  supabaseUrl === 'https://ecxkhihlbrcwpavfoaoq.supabase.co' &&
  process.env.ALLOW_LEGACY_STAGING_RUNTIME !== '1'
) {
  throw new Error(
    'Legacy staging host blocked. Set PLATFORM_* to utdioxwiskzatwoejgiu or ALLOW_LEGACY_STAGING_RUNTIME=1',
  );
}

const runtimeConfig = [
  '// Generated runtime config — browser-public Supabase values only. Never service-role.',
  'window.HACKER_DOJO_CONFIG = {',
  `  supabaseUrl: ${JSON.stringify(supabaseUrl)},`,
  `  supabaseAnonKey: ${JSON.stringify(supabaseAnonKey)},`,
  '  defaultClientSlug: "hacker-dojo"',
  '};',
  '',
].join('\n');

writeFileSync('runtime-config.js', runtimeConfig, { encoding: 'utf8', mode: 0o600 });
```

- [ ] **Step 2: Update security-contract grep expectations**

In `local-security-contract.yml`, change the grep that requires the old refuse string to match the new refuse/allowlist strings (still assert no `SUPABASE_SERVICE_ROLE_KEY` in the generator).

- [ ] **Step 3: Dry-run generator (expect fail without env)**

Run:

```bash
cd Fund-Intel
node scripts/staging/generate-runtime-config.mjs
```

Expected: throws missing URL/key error.

- [ ] **Step 4: Dry-run with dummy platform URL shape (optional offline)**

Only if you have a throwaway anon key in shell (do not commit):

```bash
export PLATFORM_SUPABASE_URL=https://utdioxwiskzatwoejgiu.supabase.co
export PLATFORM_SUPABASE_ANON_KEY=eyJhbGciOi...dummy
node scripts/staging/generate-runtime-config.mjs
test -f runtime-config.js
grep -q utdioxwiskzatwoejgiu runtime-config.js
grep -vq SERVICE_ROLE runtime-config.js
rm -f runtime-config.js
```

- [ ] **Step 5: Commit**

```bash
cd Fund-Intel
git checkout -b ops/platform-foundation
git add scripts/staging/generate-runtime-config.mjs .github/workflows/local-security-contract.yml
git commit -m "feat: allow platform Supabase host in runtime-config generator"
```

---

### Task 2: Retarget migration apply script + env examples to platform

**Files:**
- Modify: `Fund-Intel/scripts/staging/apply-migrations.sh`
- Modify: `Fund-Intel/scripts/staging/bootstrap.env.example`
- Modify: `Fund-Intel/scripts/staging/runtime-config.staging.example.js`
- Modify: `Fund-Intel/scripts/staging/verify-policy-suite.sh` (EXPECTED_STAGING_REF if present)

**Interfaces:**
- Consumes: `PLATFORM_CONFIRM_PROJECT_REF=utdioxwiskzatwoejgiu` for remote push
- Produces: safe remote `supabase db push` only when linked ref matches platform

- [ ] **Step 1: Update `apply-migrations.sh` remote-linked mode**

Change expected ref from `ecxkhihlbrcwpavfoaoq` to `utdioxwiskzatwoejgiu`, and require `PLATFORM_CONFIRM_PROJECT_REF` (accept legacy alias `STAGING_CONFIRM_PROJECT_REF` only if equal to platform).

```bash
remote-linked)
  expected_ref="utdioxwiskzatwoejgiu"
  confirm="${PLATFORM_CONFIRM_PROJECT_REF:-${STAGING_CONFIRM_PROJECT_REF:-}}"
  linked_ref="$(cat supabase/.temp/project-ref 2>/dev/null || true)"
  if [[ "$confirm" != "$expected_ref" || "$linked_ref" != "$expected_ref" ]]; then
    echo "Remote migration requires linked project $expected_ref and PLATFORM_CONFIRM_PROJECT_REF=$expected_ref" >&2
    exit 1
  fi
  echo "Pushing migrations to platform project $expected_ref..."
  supabase db push
  ;;
```

- [ ] **Step 2: Update bootstrap.env.example**

Set:

```bash
PLATFORM_SUPABASE_URL=https://utdioxwiskzatwoejgiu.supabase.co
PLATFORM_SUPABASE_ANON_KEY=
PLATFORM_CONFIRM_PROJECT_REF=utdioxwiskzatwoejgiu
# Optional aliases used by older scripts:
# STAGING_SUPABASE_URL=$PLATFORM_SUPABASE_URL
# STAGING_SUPABASE_ANON_KEY=$PLATFORM_SUPABASE_ANON_KEY
```

- [ ] **Step 3: Update runtime-config.staging.example.js host comment + URL**

Point example URL at `https://utdioxwiskzatwoejgiu.supabase.co` and comment "platform".

- [ ] **Step 4: Update verify-policy-suite EXPECTED ref** if it hardcodes legacy.

- [ ] **Step 5: Commit**

```bash
git add scripts/staging/apply-migrations.sh scripts/staging/bootstrap.env.example \
  scripts/staging/runtime-config.staging.example.js scripts/staging/verify-policy-suite.sh
git commit -m "chore: retarget staging scripts to platform Supabase ref"
```

---

### Task 3: Operator SQL — master_admin bootstrap + isolation check

**Files:**
- Create: `Fund-Intel/scripts/platform/bootstrap-master-admin.sql`
- Create: `Fund-Intel/scripts/platform/verify-platform-isolation.sql`
- Create: `Fund-Intel/scripts/platform/README.md` (how to run; no secrets)

**Interfaces:**
- Consumes: Auth user uuid for `scrimshawlife@gmail.com` after invite
- Produces: row in `platform_administrators`; isolation verification queries

- [ ] **Step 1: Write bootstrap SQL**

```sql
-- scripts/platform/bootstrap-master-admin.sql
-- Run in Supabase SQL editor as postgres (dashboard) AFTER auth user exists.
-- Replace :operator_user_id with the uuid from Authentication → Users.

-- Ensure profile row exists (adjust if trigger already creates profiles)
insert into public.profiles (id, active, mfa_enforced)
values (:'operator_user_id'::uuid, true, false)
on conflict (id) do update set active = true;

insert into public.platform_administrators (user_id, active, rationale)
values (
  :'operator_user_id'::uuid,
  true,
  'Initial AGI platform master_admin bootstrap for suite operations'
)
on conflict (user_id) do update
set active = true,
    revoked_at = null,
    rationale = excluded.rationale;

-- Reference tenant should already exist from migration 012
select id, slug, state from public.clients where id = 'org_hacker_dojo';
```

Note: If `profiles` columns differ, match `007_identity_hardening.sql` / actual table. Implementer must open the profiles create migration and align columns before running.

- [ ] **Step 2: Write isolation verification SQL**

```sql
-- scripts/platform/verify-platform-isolation.sql
-- Expect: org_hacker_dojo exists; second synthetic org exists or create:
insert into public.clients (id, slug, display_name, state, reference_tenant)
values ('org_platform_isolation', 'platform-isolation', 'Platform Isolation Fixture', 'active', false)
on conflict (id) do nothing;

select count(*) as client_count from public.clients;
-- Manual: as director-only user, select * from clients should not return other tenants
-- (use supabase/tests/007_agi_tenant_foundation.sql patterns under auth.uid() context)
```

- [ ] **Step 3: README for operators**

Document:

1. Dashboard invite `scrimshawlife@gmail.com`
2. Copy user uuid
3. Run bootstrap SQL
4. Set Auth redirect URLs to `https://autogive.app/portfolio-signals/workspace` and `.../workspace.html`
5. Never paste service role into README

- [ ] **Step 4: Commit**

```bash
git add scripts/platform/
git commit -m "docs(sql): platform master_admin bootstrap and isolation checks"
```

---

### Task 4: Apply migrations to platform (operator + agent assisted)

**Files:** none in git (remote state). Script usage only.

**Interfaces:**
- Consumes: Supabase access token, platform project
- Produces: remote schema matching migrations

- [ ] **Step 1: Install/pin Supabase CLI if missing**

```bash
npx supabase --version
# or install 2.31.8 to match CI pin when possible
```

- [ ] **Step 2: Link**

```bash
cd Fund-Intel
npx supabase link --project-ref utdioxwiskzatwoejgiu
# confirm supabase/.temp/project-ref contains utdioxwiskzatwoejgiu
```

- [ ] **Step 3: Push migrations**

```bash
export PLATFORM_CONFIRM_PROJECT_REF=utdioxwiskzatwoejgiu
./scripts/staging/apply-migrations.sh remote-linked
# or: npx supabase db push
```

Expected: success; no error about wrong project.

- [ ] **Step 4: Record migration list**

```bash
npx supabase migration list
```

Expected: local and remote aligned for all files under `supabase/migrations/`.

- [ ] **Step 5: Commit nothing secret; optional commit of link docs only if needed**

No commit of `.temp` credentials.

---

### Task 5: Create Auth user + promote master_admin + Auth URLs

**Files:** none (dashboard / SQL editor).

- [ ] **Step 1: Dashboard → Authentication → Users → Invite `scrimshawlife@gmail.com`**

- [ ] **Step 2: Copy user UUID**

- [ ] **Step 3: Run bootstrap SQL with that UUID** (Task 3 file)

- [ ] **Step 4: Authentication → URL configuration**

Add:
- Site URL: `https://autogive.app/portfolio-signals/workspace` (or project default + additional redirects)
- Redirect allow list:
  - `https://autogive.app/portfolio-signals/workspace`
  - `https://autogive.app/portfolio-signals/workspace.html`
  - `https://fund-intel-ten.vercel.app/workspace`
  - `https://fund-intel-ten.vercel.app/workspace.html`

- [ ] **Step 5: Verify SQL**

```sql
select pa.user_id, pa.active, p.id
from platform_administrators pa
join profiles p on p.id = pa.user_id
where pa.active and pa.revoked_at is null;
```

Expected: one row for operator.

---

### Task 6: Vercel fund-intel runtime-config on deploy

**Files:**
- Modify: `Fund-Intel/vercel.json` (buildCommand)
- Optional: `Fund-Intel/scripts/vercel-build.sh`

**Interfaces:**
- Consumes: Vercel project env `PLATFORM_SUPABASE_URL`, `PLATFORM_SUPABASE_ANON_KEY`
- Produces: `runtime-config.js` in deployment output root

- [ ] **Step 1: Add vercel-build script**

Create `Fund-Intel/scripts/vercel-build.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
node scripts/staging/generate-runtime-config.mjs
echo "runtime-config.js generated for Vercel static publish"
```

- [ ] **Step 2: Point vercel.json buildCommand at it**

```json
"installCommand": "echo skip-install",
"buildCommand": "bash scripts/vercel-build.sh",
"outputDirectory": "."
```

- [ ] **Step 3: Set Vercel env (CLI or dashboard) — anon only**

```bash
cd Fund-Intel
# values from Supabase dashboard → Settings → API (anon public)
vercel env add PLATFORM_SUPABASE_URL production --scope scrimshawlife-8819s-projects
vercel env add PLATFORM_SUPABASE_ANON_KEY production --scope scrimshawlife-8819s-projects
# also preview if desired
```

Also set aliases if generator falls back: same values for `STAGING_*` optional.

- [ ] **Step 4: Deploy production**

```bash
vercel deploy --prod --yes --scope scrimshawlife-8819s-projects
```

- [ ] **Step 5: Confirm config present on host (without printing secrets)**

```bash
curl -sS https://fund-intel-ten.vercel.app/runtime-config.js | head -5
# Expect: window.HACKER_DOJO_CONFIG and utdioxwiskzatwoejgiu host; no service_role string
```

- [ ] **Step 6: Commit scripts + vercel.json**

```bash
git add scripts/vercel-build.sh vercel.json
git commit -m "feat: generate platform runtime-config on Vercel build"
```

---

### Task 7: GitHub Actions / vars retarget (Fund-Intel)

**Files:**
- Modify: `.github/workflows/validate-and-deploy.yml` only if env names change
- GitHub repo settings (not in git): variables/secrets

- [ ] **Step 1: Update GitHub variable**

```bash
gh variable set PLATFORM_SUPABASE_URL -R scrimshawlife-ctrl/Fund-Intel \
  -b "https://utdioxwiskzatwoejgiu.supabase.co"
# Keep STAGING_SUPABASE_URL in sync for transition OR update workflow to PLATFORM_*
gh variable set STAGING_SUPABASE_URL -R scrimshawlife-ctrl/Fund-Intel \
  -b "https://utdioxwiskzatwoejgiu.supabase.co"
```

- [ ] **Step 2: Update GitHub secret ANON key** (operator pastes from dashboard)

```bash
gh secret set PLATFORM_SUPABASE_ANON_KEY -R scrimshawlife-ctrl/Fund-Intel
# and/or STAGING_SUPABASE_ANON_KEY to same platform anon value
```

- [ ] **Step 3: Align workflow env if it still only reads STAGING_***

Ensure generate step has:

```yaml
env:
  PLATFORM_SUPABASE_URL: ${{ vars.PLATFORM_SUPABASE_URL || vars.STAGING_SUPABASE_URL }}
  PLATFORM_SUPABASE_ANON_KEY: ${{ secrets.PLATFORM_SUPABASE_ANON_KEY || secrets.STAGING_SUPABASE_ANON_KEY }}
  STAGING_SUPABASE_URL: ${{ vars.STAGING_SUPABASE_URL }}
  STAGING_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
```

- [ ] **Step 4: Commit workflow if changed**

```bash
git commit -am "ci: prefer PLATFORM_SUPABASE_* for runtime-config generation"
```

---

### Task 8: End-to-end acceptance

**Files:** none required; use AGI smoke + manual login.

- [ ] **Step 1: Public suite regression**

```bash
cd Autonomous-Giving-Incorporated
./scripts/smoke-public-suite.sh
```

Expected: SMOKE PASSED (or 200s for suite paths when DNS hits Vercel).

- [ ] **Step 2: Unauthenticated workspace gate**

```bash
curl -sS https://autogive.app/portfolio-signals/workspace | grep -qi 'sign in'
curl -sS https://autogive.app/portfolio-signals/workspace.html | grep -qi 'sign in'
```

Expected: auth gate copy visible; no private table dumps.

- [ ] **Step 3: Magic-link login (manual)**

Open `https://autogive.app/portfolio-signals/workspace`, enter `scrimshawlife@gmail.com`, complete email link, land in workspace.

- [ ] **Step 4: Confirm master admin context**

In browser network or UI: `get_workspace_context` / equivalent shows `is_master_admin: true`.

- [ ] **Step 5: Isolation SQL** (dashboard SQL as service role or test users)

Run `scripts/platform/verify-platform-isolation.sql` checks / foundation test intent.

- [ ] **Step 6: Env hygiene**

```bash
vercel env ls --scope scrimshawlife-8819s-projects | grep -i supabase || true
# Ensure no SERVICE_ROLE names on fund-intel project
```

---

### Task 9: Project-wide documentation cutover

**Files:**
- Modify: `Fund-Intel/docs/STAGING-BOOTSTRAP.md`
- Modify: `Fund-Intel/docs/AUTHENTICATED-WORKSPACE.md`
- Modify: `Fund-Intel/docs/PLATFORM.md`
- Modify: `Fund-Intel/docs/DATA-PLACEMENT.md` (already partly updated)
- Modify: `Autonomous-Giving-Incorporated/docs/PLATFORM.md`
- Modify: `Autonomous-Giving-Incorporated/docs/superpowers/specs/2026-08-06-agi-platform-foundation-design.md` status → Implemented (after ship)

- [ ] **Step 1: Replace legacy-as-default language with platform-as-default**

Every "staging ref ecxkhihl…" intro becomes "platform ref utdioxwiskzatwoejgiu; legacy frozen".

- [ ] **Step 2: Document workspace production URL**

`https://autogive.app/portfolio-signals/workspace`

- [ ] **Step 3: Note second admin**

"Add Qi Diaz via platform_administrators insert with rationale ≥ 12 chars."

- [ ] **Step 4: Commit across repos**

```bash
# Fund-Intel
git add docs/
git commit -m "docs: platform foundation cutover from legacy HD staging"

# AGI
cd ../Autonomous-Giving-Incorporated
git add docs/PLATFORM.md
git commit -m "docs: Phase 2 platform foundation status and links"
```

- [ ] **Step 5: Open/merge PRs for Fund-Intel + AGI**

Titles:
- Fund-Intel: `feat: platform foundation for utdioxwiskzatwoejgiu + workspace runtime-config`
- AGI: `docs: platform foundation plan and status`

---

## Spec coverage checklist

| Spec requirement | Task |
| --- | --- |
| Migrations on utdioxwiskzatwoejgiu | 2, 4 |
| master_admin scrimshawlife@gmail.com | 3, 5 |
| Synthetic tenants / isolation | 3, 8 |
| Magic-link workspace on autogive.app | 5, 6, 8 |
| Anon-only Vercel config | 1, 6, 7 |
| Public suite remains green | 8 |
| Legacy freeze docs | 2, 9 |
| No service role in browser | 1, 6, 8 |
| Qi Diaz deferred | 9 |

## Placeholder scan

No TBD/TODO steps; operator secret values stay out of the plan body on purpose.
