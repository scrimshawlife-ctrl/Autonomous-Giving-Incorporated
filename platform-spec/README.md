# Platform specification pin

This repository **pins** the Autonomous Giving Platform Specification at:

| Field | Value |
| --- | --- |
| Repository | [scrimshawlife-ctrl/Autonomous-Giving-Specs](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs) |
| Version | **1.0.0** |
| Release | https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/releases/tag/v1.0.0 |
| Service role | Governance surface (`autonomous-giving`) |

Do **not** track floating `main` of the specs repository for production behavior. Consume the tagged release package or git tag `v1.0.0`.

## Manifest

[`conformance.yml`](conformance.yml) declares the platform artifacts this product surface aligns with. Schema:

https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/v1.0.0/schemas/meta/conformance-manifest.schema.json

## Boundary note

AGI’s public site explains the funding-to-evidence journey and fails closed on public aggregates. Allocation and Approval **authority** remain governed by platform rules (human approval before allocation). This site does not move money or store donor PII.

## Updating the pin

1. Review the specs release notes and migration guide.
2. Bump `platform_spec.version` in `conformance.yml`.
3. Confirm public narrative and demo scenario still match the pinned lifecycle and glossary.
