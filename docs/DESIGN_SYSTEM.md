# Zero State design system

AGI is the explanatory entry point to the Zero State product suite. It introduces the allocation-to-evidence journey and links directly to Fund Intel and Impact Relay without collapsing their distinct jobs.

## Shared brand foundation

- Paper `#fbf9f4`; raised surface `#ffffff`; stone `#f4f0e8`.
- Carbon `#1d2321`; muted ink `#626b67`; rule `#b9b2a7`.
- Signal yellow `#f2c200` for attention and focus; deep teal `#486f6a` for verified state and suite links.
- Georgia for display type, Inter for body and interface copy, and IBM Plex Mono for metadata.
- Two- and four-pixel corners, thin rules, and no decorative elevation.

All implementation values originate in [`tokens.css`](../tokens.css). Components consume named variables rather than one-off colors.

## Identity hierarchy

The masthead always reads in this order:

1. Zero State mark and wordmark
2. Autonomous Giving Incorporated product name
3. Current page or workflow context

Fund Intel and Impact Relay appear as reciprocal suite links. Tenant or campaign identity may add context but never replace the Zero State or product identity.

## Composition

AGI retains its public workbench structure: restrained paper surfaces, a graphite proof section, sequential lifecycle content, and evidence-led rows. The page avoids floating navigation, decorative cards, gradients, and motion-only affordances.

## Status and interaction

- `verified` uses deep teal and an explicit label.
- `waiting` uses signal yellow with carbon text.
- `blocked` or `danger` uses the shared danger token and an explicit label.
- Focus is visible, status never relies on color alone, and reduced-motion preferences suppress nonessential transitions.

The responsive contract is no horizontal scrolling from 320–1920 px, reachable suite navigation, and single-column evidence layouts below tablet widths.

## Copy contract

The public experience must distinguish demonstration data, public aggregate signals, and unavailable evidence. Never imply live payments, one-to-one donor attribution, or donor-level evidence when those capabilities do not exist.
