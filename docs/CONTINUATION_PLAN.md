# Continuation plan

This plan starts after the merged v0.1 public demonstration. It protects the current product principle: every new capability must make the path from funding intent to verified impact more legible.

## Current baseline

v0.1 is a deployed-code-ready, static Next.js experience with one replayable local scenario. It does not collect donations, persist records, authenticate people, or claim a live connection to Fund Intel or Impact Relay.

## Phase 0 — Operational readiness (1–2 days)

**Goal:** make the existing public experience launch-ready without changing its product scope.

- Configure the production Vercel project and replace the placeholder canonical URL with the production domain.
- Add a real favicon and Open Graph image.
- Establish a lightweight release checklist: desktop and mobile smoke test, keyboard-only demo replay, reduced-motion review, and metadata preview.
- Add privacy-preserving page analytics only after a clear measurement question and privacy review.

**Exit criteria:** production domain, metadata assets, an accessible release checklist, and no new backend dependency.

## Phase 1 — Integration contract discovery (3–5 days)

**Goal:** define the smallest stable data contract before building a connected experience.

- Document a versioned `FundingDecision` shape from Fund Intel: allocation ID, fund, rationale, confidence/status, and published timestamp.
- Document a versioned `ImpactEvent` shape from Impact Relay: allocation ID, event type, evidence reference, verification status, and occurred timestamp.
- Define the shared identifiers, status vocabulary, evidence-access rules, and retention/redaction policy.
- Produce sample fixtures from both systems and validate them against the public narrative without exposing sensitive donor or beneficiary data.

**Exit criteria:** reviewed schemas, deterministic fixtures, ownership for each field, and explicit rules for what can be public.

## Phase 2 — Read-only live narrative (v0.2, 1–2 weeks)

**Goal:** replace only the demo inputs with approved live outputs while preserving a safe fallback.

- Add a narrow read-only server integration layer; do not introduce donor accounts, payments, or write operations.
- Render approved decision and verified-event records using the Phase 1 schemas.
- Keep the local canonical scenario as an offline/demo fallback and clearly label which experience is live.
- Add loading, empty, delayed, and verification-failure states that never invent evidence.
- Add structured observability for freshness and integration errors, with no sensitive data in logs.

**Exit criteria:** one production-safe end-to-end narrative driven by approved source data, clear freshness labeling, monitored fallback behavior, and an accessibility review.

## Phase 3 — Authenticated products (v1.0, separately scoped)

**Goal:** introduce donor and organization workflows only after the read-only public narrative is reliable.

- Independently design authorization, consent, data-retention, and audit requirements.
- Scope donor history and organization evidence workflows as separate vertical slices.
- Evaluate payments and notification delivery as dedicated workstreams, not additions to the public-site integration.

**Exit criteria:** approved threat model, privacy review, service ownership, and a product-specific delivery plan.

## Decision gates

Do not begin the next phase until its predecessor exits cleanly. Pause or narrow scope if live source data cannot be published safely, identifiers do not join reliably, verification semantics differ between systems, or the new experience makes an attribution claim that the evidence cannot support.

## Ownership and sequencing

| Area | First owner | Sequence |
| --- | --- | --- |
| Production domain and launch checklist | AGI product/design | Phase 0 |
| Fund Intel decision contract | Fund Intel owner | Phase 1 |
| Impact Relay event contract | Impact Relay owner | Phase 1 |
| Public integration adapter and fallback | AGI engineering | Phase 2 |
| Auth, payments, and notifications | Product/security owners | Phase 3 |
