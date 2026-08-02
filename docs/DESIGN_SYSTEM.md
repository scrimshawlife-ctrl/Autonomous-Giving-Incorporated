# Design system

AGI uses a Hallmark **Workbench** composition: a restrained public interface that lets donors and philanthropic operators inspect the connection between allocation decisions, contribution state, and outcome evidence.

## Visual direction

- **Genre:** modern minimal
- **Theme:** Cobalt
- **Navigation:** detached floating pill (N5)
- **Footer:** large closing statement (Ft5)
- **Primary surface:** cool paper with graphite type
- **Proof surface:** graphite workbench with a sequential lifecycle and evidence ledger
- **Accent semantics:** cobalt for actions and intelligence; green only for verified state

The page is deliberately not a card dashboard. Sections use rules, rows, state labels, and surface shifts to create hierarchy. Icons are limited to directional or control meaning; they do not decorate feature claims.

## Tokens

All colors, type families, spacing, radii, motion, and elevation originate in [`tokens.css`](../tokens.css). Colors are expressed in OKLCH. Components must consume named variables and must not introduce one-off color values.

Typography follows a 2+1 system:

- Space Grotesk for display type
- IBM Plex Sans for body and interface copy
- JetBrains Mono only for the AGI wordmark and integration contract

## Interaction and accessibility

Interactive controls provide visible focus, hover, active, and disabled states. Controls do not use color as their only state cue. Motion is limited to deterministic lifecycle progression and brief affordance feedback; reduced-motion preferences suppress transitions.

The responsive contract is no horizontal scrolling from 320–1920 px, single-line clickable labels, a collapsed mobile navigation, and single-column evidence layouts below tablet widths.

## Copy contract

The public experience is explicit about what is demonstration data, what is a public aggregate signal, and what is not inferred. Never imply live payments, one-to-one donor attribution, or donor-level evidence when those capabilities do not exist.
