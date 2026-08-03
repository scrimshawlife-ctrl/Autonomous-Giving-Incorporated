# Product: Allocation middleware

**Status:** Design approved 2026-08-03  
**Canonical design:** [Autonomous-Giving-Specs design doc](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/main/docs/superpowers/specs/2026-08-03-allocation-middleware-design.md)

## One-sentence pitch

AGI sits **between** donation platforms (starting with **every.org**) and human decision-makers: show **enough numbers to allocate**, keep a **use-of-funds trail**, and run day-to-day as an **exception inbox**—not as accounting software.

## Who it is for

| Persona | Care about |
| --- | --- |
| Nonprofit / program director | Allocate without re-keying gifts |
| Foundation / funder staff | Trust the trail without PDF chase |
| Board / campaign director | One packet that matches the numbers |

## What clients do not get

- Bank/Plaid/QuickBooks depth  
- Payment checkout replacement  
- Three separate products to learn  

## Client language

Campaign **pots** (from every.org fundraisers) → program **slices** (from designations) → **allocate** → **proof** → **packet**.

## Screens

Available · Allocate · Inbox · Trail · Packet · Settings (every.org + mapping)

## Suite roles

| Surface | Contribution |
| --- | --- |
| **AGI** | Brand + primary client UX entry (this product story) |
| **Fund Intel** | Observation / recommendation patterns; may host intelligence modules later |
| **Impact Relay** | Proof, public-safe trail projections, evidence discipline |

Platform pin: Specs **v1.x** capability-first modular monolith ([SPEC-002A](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/main/specs/SPEC-002A-architectural-principles.md), [SPEC-020](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/main/specs/SPEC-020-reference-deployment-profiles.md)).

## Connector priority

1. **every.org** (canonical)  
2. Manual pots + CSV  
3. Givebutter, Donorbox, …  

## Success (first client)

Gifts credit **Available** automatically; allocate in minutes; inbox is daily ops; board packet needs no spreadsheet rebuild.
