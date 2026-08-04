# AGI agent guidance

Preserve v0.1 scope. No backend, authentication, database, payments, monorepo, or unnecessary packages. Keep the demo deterministic and local. Maintain semantic color roles. Prefer simple components. Run lint, typecheck, and build before completion, and update docs with architecture changes.

Stack: **Next.js 16** App Router with static `output: "export"` for GitHub Pages. Prefer Turbopack defaults (`next dev` / `next build`). Do not reintroduce npm `overrides` for postcss/sharp unless a future Next release re-vendors vulnerable versions.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
