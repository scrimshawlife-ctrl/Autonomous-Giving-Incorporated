/**
 * Freshness policy for AGI public projections.
 *
 * Soft threshold (24h): data is still usable but labeled stale.
 * Hard threshold (7d): data is still shown if otherwise valid, but clearly marked;
 * we do not invent evidence or silently upgrade authority.
 *
 * Clock assumption: build-time `Date.now()` is the reference instant.
 * Source timestamps are treated as UTC date or date-time strings.
 */

export const FRESHNESS_SOFT_MS = 24 * 60 * 60 * 1000;
export const FRESHNESS_HARD_MS = 7 * 24 * 60 * 60 * 1000;

export type FreshnessLabel = "fresh" | "stale" | "very_stale" | "unknown";

export type FreshnessAssessment = {
  label: FreshnessLabel;
  ageMs: number | null;
  updatedAt: string;
};

/**
 * Parse a source `updatedAt` value into epoch ms.
 * Accepts date-only (YYYY-MM-DD) and full ISO date-time strings.
 * Returns null when the value cannot be parsed honestly.
 */
export function parseUpdatedAt(value: string): number | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  // Date-only: treat as UTC midnight so age is stable across timezones.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const ms = Date.parse(`${value}T00:00:00.000Z`);
    return Number.isFinite(ms) ? ms : null;
  }

  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export function assessFreshness(
  updatedAt: string,
  nowMs: number = Date.now(),
): FreshnessAssessment {
  const parsed = parseUpdatedAt(updatedAt);
  if (parsed === null) {
    return { label: "unknown", ageMs: null, updatedAt };
  }

  const ageMs = Math.max(0, nowMs - parsed);

  if (ageMs > FRESHNESS_HARD_MS) {
    return { label: "very_stale", ageMs, updatedAt };
  }
  if (ageMs > FRESHNESS_SOFT_MS) {
    return { label: "stale", ageMs, updatedAt };
  }
  return { label: "fresh", ageMs, updatedAt };
}

export function isStaleLabel(label: FreshnessLabel): boolean {
  return label === "stale" || label === "very_stale" || label === "unknown";
}
