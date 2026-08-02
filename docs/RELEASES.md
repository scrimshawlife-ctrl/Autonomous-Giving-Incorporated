# Release record

## 2026-08-02 — Evidence Workbench

- **Owner:** AGI product/engineering
- **Commit:** `fdbe59e0d4a969fc9a58805bfdc7d6ced4b66d84`
- **Pull request:** [#6](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/pull/6)
- **CI:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30770655489)
- **Pages deployment:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30770655507)
- **Production:** [scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated](https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/)

### Verification

- GitHub Pages returned HTTP 200 after deployment.
- The deployed page rendered the Workbench homepage and approved public aggregate signals.
- Pull-request verification, post-merge CI, and Pages build/deploy jobs passed.
- Local browser checks covered 320, 360, 375, 390, 414, 768, 1024, 1280, and 1440 px with no horizontal overflow or console errors.

### Known follow-up

The deployed commit still carries the pre-redesign social-preview assets and malformed Open Graph path. The `feat/launch-metadata-hardening` continuation branch corrects that metadata without changing the application runtime.
