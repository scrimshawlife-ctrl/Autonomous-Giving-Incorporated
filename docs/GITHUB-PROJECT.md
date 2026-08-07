# AGI suite — GitHub Project

One **Projects (v2)** board owns delivery across all suite repositories.

**Live board:** https://github.com/users/scrimshawlife-ctrl/projects/3  

## Linked repositories

| Repo | Role |
| --- | --- |
| [Autonomous-Giving-Incorporated](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated) | Public workbench + suite narrative |
| [Fund-Intel](https://github.com/scrimshawlife-ctrl/Fund-Intel) | Decision workspace + allocation middleware host |
| [Impact-Relay](https://github.com/scrimshawlife-ctrl/Impact-Relay) | Evidence / ledger / receipts |
| [Autonomous-Giving-Specs](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs) | Platform specs (no app code) |

## Board fields (configured)

| Field | Options |
| --- | --- |
| **Status** | Todo · In Progress · Done |
| **Track** | Allocation middleware · HD-OI pilot · Platform specs · Public workbench · Ops · Cross-repo |
| **Priority** | P0 · P1 · P2 |
| **Suite Repo** | AGI · Fund-Intel · Impact-Relay · Specs · Cross-repo |
| **Repository** | Built-in (source repo of the issue/PR) |

## Status columns

Use the board **Status** field (Todo → In Progress → Done). Filter by **Track** or **Suite Repo** for swimlanes.

## Allocation pilot (Fund-Intel)

| Issue | Priority | Status |
| --- | --- | --- |
| [#71](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/71) optional public host | P1 | Todo |
| [#72](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/72) Supabase director membership | P0 | Todo |
| [#73](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/73) live every.org webhook | P0 | Todo |
| [#74](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/74) director acceptance | P0 | Todo |

## Tracks (current)

### Allocation middleware (active)

- MVP package in Fund-Intel `services/allocation-middleware/`  
- Docker Compose default host; Fly/Render optional  
- AGI shell UI  
- Remaining: [#71](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/71)–[#74](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/74)

### Hacker Dojo campaign (HD-OI)

- HD-OI-019 hardening, import gates, evidence boundary  
- Separate from allocation middleware but same campaign tenant  

### Platform specs

- Specs v1.x pin, conformance manifests, design docs under `docs/superpowers/`  

### Public suite surfaces

- AGI Pages, Portfolio Signals portal, Impact Relay public aggregate  

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
