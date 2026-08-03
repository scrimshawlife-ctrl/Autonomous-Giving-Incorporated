# Contract governance (Phase C draft)

This document proposes ownership, identifier rules, and vocabulary alignment for the shared public narrative contracts across the AGI suite. It is a **proposal** until named owners confirm and all three repositories publish matching fixtures.

Related: [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md) · [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md) · [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md)

Contract version under discussion: `2026-08-02` (AGI `integration/contracts.ts`).

---

## C1 — Proposed field ownership

### FundingDecision

| Field | Proposed owner | Source system | Notes |
|-------|----------------|---------------|-------|
| `schemaVersion` | AGI (contract steward) | AGI contracts package | Date string; bump on breaking change |
| `allocationId` | Fund-Intel | Decision / allocation record | Must be stable once published |
| `fundName` | Fund-Intel | Campaign / fund registry | Human-readable; may change display only |
| `rationale` | Fund-Intel | Approved decision text | Public-safe; no donor or private notes |
| `status` | Fund-Intel | Decision workflow | Currently AGI only models `"approved"` |
| `publishedAt` | Fund-Intel | Publication timestamp | ISO-8601 preferred |

### ImpactEvent

| Field | Proposed owner | Source system | Notes |
|-------|----------------|---------------|-------|
| `schemaVersion` | AGI (contract steward) | AGI contracts package | Same version as decision |
| `allocationId` | Fund-Intel (join key) | Must match decision | Join only by this id |
| `eventId` | Impact-Relay | Impact / program event | Stable public event identity |
| `type` | Impact-Relay | Domain event taxonomy | See vocabulary map below |
| `occurredAt` | Impact-Relay | Event timestamp | ISO-8601 preferred |
| `verificationStatus` | Impact-Relay | Evidence workflow | Normalized to contract enum |
| `evidenceReference` | Impact-Relay | Public-safe pointer only | Never raw receipt, PII, or secret URL |

### Ownership confirmation checklist

- [ ] Fund-Intel owner confirms decision fields
- [ ] Impact-Relay owner confirms event fields
- [ ] AGI owner confirms contract steward role and versioning process

---

## C2 — Identifier and vocabulary alignment

### Observed current shapes (2026-08-03)

| Concern | AGI contract | Fund-Intel public campaign | Impact-Relay public impact |
|---------|--------------|----------------------------|----------------------------|
| Allocation join key | `allocationId` (e.g. `alloc_community_hardware_001`) | Not present in public-campaign.json | `allocationName` only (display string) |
| Verification | `pending` \| `verified` \| `rejected` | N/A | `evidenceState: "VERIFIED"` (uppercase) |
| Event identity | `eventId` | N/A | `impactEventId` / `publicId` (`imp_…`) |
| Event types | `purchase_approved`, `receipt_attached`, `equipment_delivered`, `program_held`, `attendance_verified`, `notification_delivered` | N/A | Domain values e.g. `CLASS_HELD` |
| Authority | N/A (narrative layer) | `advisory_only` | `public_aggregate_only` |

### Proposed `allocationId` format

```text
alloc_<slug>_<nnn>
```

- `slug`: lowercase snake_case fund or allocation label (ASCII, no spaces)
- `nnn`: zero-padded sequence unique within the tenant
- Example: `alloc_community_hardware_001`
- **Owner of issuance:** Fund-Intel at decision publish time
- **Consumer rule:** Impact-Relay must store and export the same `allocationId` on public outcomes; AGI joins only on this value

Until Impact-Relay exports `allocationId`, AGI continues to project the narrower live slice (execution state + verified aggregate) and uses the fixture for full narrative demos.

### Proposed verification status map

| Impact-Relay `evidenceState` | AGI `verificationStatus` |
|------------------------------|--------------------------|
| `VERIFIED` | `verified` |
| `PENDING` (or equivalent) | `pending` |
| `REJECTED` / retracted | `rejected` |

AGI public UI may continue to require a `VERIFIED` outcome for the live projection path.

### Proposed event type map (initial)

| Impact-Relay domain / export | AGI `ImpactEventType` |
|------------------------------|------------------------|
| expense / purchase approval | `purchase_approved` |
| receipt attached | `receipt_attached` |
| equipment / asset delivery | `equipment_delivered` |
| `CLASS_HELD` / program occurrence | `program_held` |
| attendance verified | `attendance_verified` |
| notification delivered | `notification_delivered` |

Unmapped domain types must not be silently coerced; leave out of the public narrative or extend the contract with a version bump.

---

## C3 — Public-data rules (proposal for sign-off)

These restatements bind all three repositories for public surfaces:

1. Join only by `allocationId` (or documented public aggregate keys). Never by donor identity.
2. Accept only documented authority values (`advisory_only`, `public_aggregate_only`).
3. Evidence references are public-safe identifiers only — never raw documents, personal data, or secret URLs.
4. `verified` / `VERIFIED` is a source-system state, not one-to-one donor attribution.
5. Do not infer evidence from missing, delayed, malformed, or rejected records.
6. Public exports must remain free of PII, contact data, individual gift amounts, and private notes.
7. Retention and redaction of underlying private records are owned by Fund-Intel (CRM) and Impact-Relay (ledger/evidence); public projections inherit only what those systems publish.

**Sign-off required from:** Fund-Intel owner, Impact-Relay owner, AGI product/eng, and leadership for retention/redaction policy.

---

## C4 — Representative fixtures

| Repo | Fixture location | Status |
|------|------------------|--------|
| AGI | `integration/fixtures.ts` (`communityHardwareFixture`) | Present |
| Fund-Intel | TBD public-safe decision fixture aligned to `allocationId` | Needed |
| Impact-Relay | `data/public-impact.json` + domain fixtures | Present aggregate; needs `allocationId` field when contract adopted |

Target: one shared narrative example (Community Hardware / Hacker Dojo) valid against the same `allocationId` in all three repos.

---

## C5 — Versioning and change management

1. Contract version is the date string in `INTEGRATION_CONTRACT_VERSION`.
2. Breaking changes (field remove/rename, enum narrowing, authority change) require a new version string and coordinated PR notes in all affected repos.
3. Additive optional fields may ship under the same version if consumers treat unknown fields as ignorable.
4. Every contract change updates: AGI contracts + fixtures, this governance doc, THREE_REPO_INTEGRATION checklist, and source-system public exporters as needed.
5. AGI fail-closed behavior must remain intact across version bumps.

---

## Immediate engineering follow-ups (no leadership block)

1. Add optional `allocationId` to Impact-Relay public outcome rows when domain data has it.
2. Publish a Fund-Intel public-safe decision/allocation stub that includes `allocationId`.
3. Keep AGI live adapter on the current narrow projection until both sources emit the join key.
4. After owners confirm the tables above, mark Phase C exit criteria complete in CONTINUATION_PLAN.

---

Last updated: 2026-08-03  
Status: **draft proposal — awaiting owner confirmation**
