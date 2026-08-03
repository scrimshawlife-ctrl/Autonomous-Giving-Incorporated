import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assessFreshness,
  FRESHNESS_HARD_MS,
  FRESHNESS_SOFT_MS,
  isStaleLabel,
  parseUpdatedAt,
} from "./freshness.ts";

const NOW = Date.parse("2026-08-03T12:00:00.000Z");

describe("parseUpdatedAt", () => {
  it("parses date-only as UTC midnight", () => {
    assert.equal(parseUpdatedAt("2026-08-02"), Date.parse("2026-08-02T00:00:00.000Z"));
  });

  it("parses full ISO timestamps", () => {
    assert.equal(
      parseUpdatedAt("2026-08-02T16:00:00.000Z"),
      Date.parse("2026-08-02T16:00:00.000Z"),
    );
  });

  it("returns null for empty or invalid values", () => {
    assert.equal(parseUpdatedAt(""), null);
    assert.equal(parseUpdatedAt("not-a-date"), null);
  });
});

describe("assessFreshness", () => {
  it("labels fresh data within the soft window", () => {
    const updatedAt = new Date(NOW - FRESHNESS_SOFT_MS + 60_000).toISOString();
    const result = assessFreshness(updatedAt, NOW);
    assert.equal(result.label, "fresh");
    assert.ok(result.ageMs !== null && result.ageMs < FRESHNESS_SOFT_MS);
  });

  it("labels stale data past the soft window", () => {
    const updatedAt = new Date(NOW - FRESHNESS_SOFT_MS - 60_000).toISOString();
    const result = assessFreshness(updatedAt, NOW);
    assert.equal(result.label, "stale");
  });

  it("labels very_stale data past the hard window", () => {
    const updatedAt = new Date(NOW - FRESHNESS_HARD_MS - 60_000).toISOString();
    const result = assessFreshness(updatedAt, NOW);
    assert.equal(result.label, "very_stale");
  });

  it("labels unknown when the timestamp cannot be parsed", () => {
    const result = assessFreshness("bogus", NOW);
    assert.equal(result.label, "unknown");
    assert.equal(result.ageMs, null);
  });
});

describe("isStaleLabel", () => {
  it("treats stale, very_stale, and unknown as stale", () => {
    assert.equal(isStaleLabel("fresh"), false);
    assert.equal(isStaleLabel("stale"), true);
    assert.equal(isStaleLabel("very_stale"), true);
    assert.equal(isStaleLabel("unknown"), true);
  });
});
