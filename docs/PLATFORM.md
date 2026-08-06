# AGI suite platform canon

Single source of truth for **where** the suite lives so work does not fragment across hosts, projects, or databases.

## Product (locked)

- **AGI** sells multi-tenant Fund Intel + Impact Relay + agentic framework.
- **AGI admin** provisions clients; each client has isolated login and data.
- **autogive.app** public site is brand + evidence narrative — not the admin console.

See [superpowers/specs/2026-08-06-agi-suite-vercel-public-design.md](./superpowers/specs/2026-08-06-agi-suite-vercel-public-design.md).

## Hosting (public surfaces)

| Surface | Path on apex | Vercel project | Repo |
| --- | --- | --- | --- |
| AGI workbench | `/` | `autonomous-giving-incorporated` | Autonomous-Giving-Incorporated |
| Fund Intel public | `/fund-intel/` | `fund-intel` → https://fund-intel-ten.vercel.app | Fund-Intel |
| Impact Relay public | `/impact-relay/` | `impact-relay` → https://impact-relay.vercel.app | Impact-Relay |

**Apex domain:** `https://autogive.app` (www also attached).  
**Team:** `scrimshawlife-8819s-projects`.

GitHub Pages remains optional fallback only.

## Supabase (data plane)

| Role | Project ref | Host |
| --- | --- | --- |
| **Platform (canonical)** | `utdioxwiskzatwoejgiu` | `https://utdioxwiskzatwoejgiu.supabase.co` |
| **Dashboard** | — | https://supabase.com/dashboard/project/utdioxwiskzatwoejgiu |
| **Legacy HD staging (freeze)** | `ecxkhihlbrcwpavfoaoq` | `https://ecxkhihlbrcwpavfoaoq.supabase.co` |

**Rules:**

1. New tenancy, AGI admin, and multi-client work use **platform** only.
2. Do not create a third Supabase project without updating this file first.
3. Browser may use **anon** key only; never commit service-role keys.
4. Schema source of truth: Fund-Intel `supabase/migrations` (link to platform when applying).

## Shared identifiers

- Fund Intel `clients.id` = Impact Relay `tenant_id`.
- Reference regression tenant: Hacker Dojo (`org_hacker_dojo`) — fixture, not global default.

## Smoke

From AGI repo after public deploys:

```bash
./scripts/smoke-public-suite.sh
```

## Phase map

| Phase | Deliverable |
| --- | --- |
| Public (now) | Path-prefixed static FI/IR under autogive.app + smoke |
| Phase 2 | Platform Supabase + AGI admin + tenant director login |
| Phase 3+ | Agentic ops, allocation middleware, live every.org |
