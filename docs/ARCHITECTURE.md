# Architecture

This is a static Next.js App Router site. `demo/scenario.ts` is the single typed source of canonical data. `DonationDemo` owns a small deterministic client-state sequence and only renders evidence when its lifecycle step completes. Fund Intel outputs and Impact Relay events are future replacement seams. There is no backend because v0.1 neither collects money nor persists data.

The planned v0.2 seam is intentionally read-only: a small server integration layer may consume reviewed `FundingDecision` and `ImpactEvent` records, while the local scenario remains a fallback. Authentication, payments, write operations, and personal data are not part of that seam. See [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md).
