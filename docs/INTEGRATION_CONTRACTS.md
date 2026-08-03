# Integration contracts

AGI has two distinct contract layers: an implemented build-time public projection and versioned narrative contracts for future governed integration. Neither layer authorizes writes, payments, or access to private evidence.

The complete cross-repository checklist lives in [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md).

## Implemented public projection

`integration/public-sources.ts` retrieves these fixed sources during the static build:

| Source                                 | Required authority      | Data used by AGI                                      |
| -------------------------------------- | ----------------------- | ----------------------------------------------------- |
| Fund Intel `data/public-campaign.json` | `advisory_only`         | update timestamp and execution state                  |
| Impact Relay `data/public-impact.json` | `public_aggregate_only` | update timestamp and one `VERIFIED` aggregate outcome |

The adapter normalizes accepted data into `PublicSignals`. Any failed request, parsing error, unexpected authority, or missing verified outcome returns the bundled deterministic fallback.

The current TypeScript checks are intentionally narrow but are not a full runtime schema validator. Adding explicit schema validation and freshness policy is the next reliability phase (Phase B).

## Versioned narrative contracts

`integration/contracts.ts` defines:

- `FundingDecision`: a public allocation identifier, fund, approved rationale, status, and publication time;
- `ImpactEvent`: the same allocation identifier, event identity and type, occurrence time, verification status, and optional public-safe evidence reference;
- `PublicImpactNarrative`: a decision plus its ordered impact events.

The contract version is an explicit date string. Deterministic examples live in `integration/fixtures.ts`. These contracts describe the intended governed narrative seam; the current public-source adapter does not yet deserialize remote data directly into them.

## Public-data rules

- Join only by `allocationId`, never donor identity.
- Accept only documented public authority values.
- Evidence references identify approved public records; they are not raw documents, personal data, or secret URLs.
- Treat `verified` as a source-system state, not individual donor attribution.
- Do not infer evidence from unknown, delayed, malformed, or rejected records.
- Keep the deterministic fixture available for development and failure handling.

## Change management

A contract change must include:

1. a version change when compatibility is affected;
2. updated deterministic fixtures;
3. source ownership for every new field;
4. public-data, retention, and redaction review;
5. validation and fallback tests;
6. corresponding updates in Fund Intel and Impact Relay when the shared vocabulary changes.

Runtime APIs, authentication, credentials, and write operations remain outside this contract. See [ARCHITECTURE.md](ARCHITECTURE.md), [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md), and [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md).
