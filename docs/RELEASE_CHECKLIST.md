# Public release checklist

Use this checklist for every material production release. Copy the completed evidence into `RELEASES.md`; do not mark the canonical checklist itself complete.

## Scope and data safety

- [ ] The change remains within the approved static, read-only product scope or links an approved expansion plan.
- [ ] No donor-level data, private evidence, credentials, internal addresses, or environment values enter the static output.
- [ ] Public claims identify their provenance and do not imply payments, causal impact, or one-to-one attribution.
- [ ] Source failures and rejected authority values remain fail-closed.

## Local verification

- [ ] Run `npm ci` from the committed lockfile.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `GITHUB_ACTIONS=true npm run build`.
- [ ] Run `git diff --check`.
- [ ] Confirm the generated export uses `/Autonomous-Giving-Incorporated` exactly once for repository-hosted assets and metadata.

## Product and accessibility review

- [ ] Review the homepage at narrow mobile and desktop widths without horizontal overflow.
- [ ] Complete and reset the deterministic scenario by keyboard.
- [ ] Confirm focus visibility, heading order, landmarks, contrast, and status labels.
- [ ] Enable reduced motion and verify that the experience remains usable.
- [ ] Review both live-public-projection and deterministic-fallback states.
- [ ] Verify AGI, Fund Intel, and Impact Relay navigation destinations.

## Pull request and deployment

- [ ] The pull request explains what changed, why, user impact, and validation.
- [ ] Required GitHub checks pass against the final head commit.
- [ ] The reviewed commit is merged to `main`.
- [ ] The GitHub Pages workflow completes successfully.
- [ ] The production URL, mark, favicon, Open Graph image, robots, and sitemap resolve.
- [ ] A release record includes owner, date, merge commit, PR, CI run, Pages run, and production verification.
