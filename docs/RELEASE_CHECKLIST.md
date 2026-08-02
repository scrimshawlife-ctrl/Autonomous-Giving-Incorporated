# Public launch checklist

Use before each production release.

## Configuration

- [ ] Confirm the production Vercel project and custom domain.
- [ ] Set the production domain in `metadataBase`, `robots.ts`, and `sitemap.ts`.
- [ ] Confirm the favicon and Open Graph image resolve from the production URL.
- [ ] Verify no environment variables, preview URLs, or internal contact addresses are exposed.

## Product and accessibility smoke test

- [ ] Review the homepage at narrow mobile and desktop widths.
- [ ] Complete the $250 scenario by keyboard only, then reset and replay it.
- [ ] Confirm lifecycle status updates are intelligible with a screen reader.
- [ ] Enable reduced motion and verify the demo remains usable.
- [ ] Check focus states, contrast, heading order, and CTA destinations.

## Publishing and verification

- [ ] Verify title, description, canonical URL, favicon, Open Graph image, robots, and sitemap.
- [ ] Run `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- [ ] Review the live page after deployment and record release owner and timestamp.

This checklist does not authorize payments, personal-data collection, or live integrations.
