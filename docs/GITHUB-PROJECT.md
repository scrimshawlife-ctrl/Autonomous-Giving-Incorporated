# AGI suite — GitHub Project

One **Projects (v2)** board owns delivery across all suite repositories.

## Linked repositories

| Repo | Role |
| --- | --- |
| [Autonomous-Giving-Incorporated](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated) | Public workbench + suite narrative |
| [Fund-Intel](https://github.com/scrimshawlife-ctrl/Fund-Intel) | Decision workspace + allocation middleware host |
| [Impact-Relay](https://github.com/scrimshawlife-ctrl/Impact-Relay) | Evidence / ledger / receipts |
| [Autonomous-Giving-Specs](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs) | Platform specs (no app code) |

## Board fields (recommended)

| Field | Purpose |
| --- | --- |
| **Status** | Todo · In Progress · In Review · Done |
| **Repo** (single select) | Specs · Fund-Intel · Impact-Relay · AGI · Cross-repo |
| **Track** (single select) | Allocation middleware · HD-OI pilot · Platform specs · Public workbench · Ops |
| **Priority** | P0 · P1 · P2 |

## Status columns

1. **Backlog** — accepted but not started  
2. **Ready** — unblocked, next up  
3. **In Progress** — active engineering  
4. **In Review** — PR open / acceptance  
5. **Done** — merged + verified  

## Tracks (current)

### Allocation middleware (active)

- MVP package in Fund-Intel `services/allocation-middleware/`  
- Docker Compose default host; Fly/Render optional  
- AGI shell UI  
- Remaining: public host (optional), director Supabase membership, live every.org webhook, director acceptance  

### Hacker Dojo campaign (HD-OI)

- HD-OI-019 hardening, import gates, evidence boundary  
- Separate from allocation middleware but same campaign tenant  

### Platform specs

- Specs v1.x pin, conformance manifests, design docs under `docs/superpowers/`  

### Public suite surfaces

- AGI Pages, Fund Intel portal, Impact Relay public aggregate  

## Bootstrap

```bash
# once: grant project scopes
gh auth refresh -h github.com -s read:project,project

# create/link project + seed items
./scripts/setup-github-project.sh
```

Script location: [`scripts/setup-github-project.sh`](../scripts/setup-github-project.sh).

## Conventions

- Prefer **issues** as the project item (not only PRs).  
- Cross-repo work: issue in AGI or Specs with checklist linking the other repos.  
- Allocation middleware work lives primarily in **Fund-Intel** issues; Specs holds design-only items.  
- Do not put secrets, donor PII, or operator tokens in issue bodies.  
