# Proposed read-only integration contracts

These Phase 1 artifacts are not endpoints, credentials, or an implemented connection to Fund Intel or Impact Relay.

`FundingDecision` comes from Fund Intel and contains a public allocation ID, fund name, approved rationale, and published timestamp. `ImpactEvent` comes from Impact Relay and contains that allocation ID, event type, timestamp, verification status, and optional public-safe evidence reference. The TypeScript source is [`integration/contracts.ts`](../integration/contracts.ts); deterministic examples are in [`integration/fixtures.ts`](../integration/fixtures.ts).

## Public-data rules

- Join only by `allocationId`, never donor identity.
- Evidence references identify approved public records; they do not expose raw documents, personal data, or secret URLs.
- `verified` reflects source-system verification, not individual donor attribution.
- Unknown, delayed, or rejected records must never become inferred evidence.

Before implementation, both source-system owners must approve semantic fields, identifiers, freshness, retention/redaction, and publication authorization. v0.2 remains read-only and retains the deterministic scenario as fallback.
