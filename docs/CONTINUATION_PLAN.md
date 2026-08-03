# Continuation plan

This plan starts from the deployed GitHub Pages experience. Every new capability must make the path from funding intent to verified impact more legible without overstating attribution or exposing private data.

## Current baseline

AGI is a static Next.js export deployed from `main` to GitHub Pages. It includes a replayable deterministic scenario and reads two approved public aggregate documents during the build: a Fund Intel advisory state and an Impact Relay verified outcome. Invalid, unavailable, or unapproved source data falls back to the local canonical scenario.

The site does not collect donations, persist records, authenticate people, expose donor-level evidence, or perform write operations against either source system.

## Phase A — Launch hardening (complete)

**Goal:** make the current public experience dependable without expanding product scope.

- Keep canonical, sitemap, robots, favicon, and social-preview assets aligned with the GitHub Pages URL and current visual system.
- Complete a deployed desktop/mobile smoke test, keyboard-only demo replay, reduced-motion review, and metadata preview.
- Record the release owner, commit, deployment run, and verification timestamp.
- Add privacy-preserving analytics only after documenting a measurement question and privacy review.

**Exit criteria:** correct production metadata, a successful Pages deployment, a completed release record, and no new backend dependency.

**Status:** completed on 2026-08-02 through [PR #7](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/pull/7). CI and the GitHub Pages deployment passed for the merged commit.

## Phase B — Public-source reliability (next)

**Goal:** make the existing read-only source seam operationally explicit.

- Define a freshness threshold for both public documents and show when a build contains delayed data.
- Distinguish live, fallback, stale, malformed, and policy-rejected states without inventing evidence.
- Add tests for source validation and fallback selection.
- Document build-time observability for source freshness and validation failures without sensitive data in logs.

**Exit criteria:** deterministic state coverage, reviewed freshness semantics, monitored fallback behavior, and accessible status copy.

## Phase C — Contract governance

**Goal:** finish the organizational decisions around the existing versioned TypeScript contracts.

- Confirm ownership for every `FundingDecision` and `ImpactEvent` field.
- Review the shared identifier and status vocabulary with Fund Intel and Impact Relay owners.
- Approve evidence-access, retention, redaction, and public-publication rules.
- Validate representative fixtures from both source systems against the public narrative.

**Exit criteria:** reviewed schemas, approved public-data rules, deterministic fixtures, and named field owners.

## Phase D — Runtime read-only narrative

**Goal:** move beyond build-time public documents only when a runtime host and operational policy are approved.

- Add a narrow read-only server integration layer; do not introduce accounts, payments, or write operations.
- Preserve the canonical fallback and clear source/freshness labeling.
- Add loading, empty, delayed, and verification-failure states.
- Add structured observability with no sensitive data in logs.

**Exit criteria:** one production-safe runtime narrative, monitored fallback behavior, and an accessibility review.

## Future — Authenticated products

Donor history, organization evidence workflows, payments, and notification delivery remain separately scoped workstreams. They require an approved threat model, consent and privacy review, retention policy, audit requirements, and service ownership before implementation.

## Decision gates

Pause or narrow scope if public data cannot be published safely, identifiers do not join reliably, verification semantics differ between systems, freshness cannot be explained honestly, or the experience implies one-to-one attribution that the evidence cannot support.

## Ownership and sequencing

| Area                                       | First owner             | Sequence |
| ------------------------------------------ | ----------------------- | -------- |
| Pages metadata and release verification    | AGI product/design      | Phase A  |
| Public-source freshness and fallback tests | AGI engineering         | Phase B  |
| Fund Intel decision contract               | Fund Intel owner        | Phase C  |
| Impact Relay event contract                | Impact Relay owner      | Phase C  |
| Runtime adapter and observability          | AGI engineering         | Phase D  |
| Auth, payments, and notifications          | Product/security owners | Future   |
