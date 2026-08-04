import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validatePublicCampaign,
  validatePublicImpact,
} from "./validate-public.ts";

const validCampaign = {
  updatedAt: "2026-08-02",
  authority: "advisory_only",
  execution: { state: "blocked", reason: "consent unresolved" },
};

const validImpact = {
  updatedAt: "2026-08-02",
  authority: "public_aggregate_only",
  outcomes: [
    {
      organizationName: "Hacker Dojo",
      programName: "Beginner Electronics Class",
      allocationName: "Community Hardware Fund",
      allocationId: "alloc_community_hardware",
      participantsPublic: 18,
      evidenceState: "VERIFIED",
      eventDate: "2026-09-02",
    },
  ],
};

describe("validatePublicCampaign", () => {
  it("accepts a valid advisory_only document", () => {
    const result = validatePublicCampaign(validCampaign);
    assert.ok(!("kind" in result));
    assert.equal(result.authority, "advisory_only");
    assert.equal(result.execution.state, "blocked");
    assert.equal(result.allocations.length, 0);
  });

  it("accepts optional allocations registry", () => {
    const result = validatePublicCampaign({
      ...validCampaign,
      allocations: [
        {
          allocationId: "alloc_community_hardware",
          fundName: "Community Hardware Fund",
          status: "approved",
        },
      ],
    });
    assert.ok(!("kind" in result));
    assert.equal(result.allocations[0]?.allocationId, "alloc_community_hardware");
  });

  it("rejects non-objects as malformed", () => {
    const result = validatePublicCampaign(null);
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
  });

  it("rejects wrong authority as policy_rejected", () => {
    const result = validatePublicCampaign({
      ...validCampaign,
      authority: "public_aggregate_only",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
  });

  it("rejects missing execution state as malformed", () => {
    const result = validatePublicCampaign({
      updatedAt: "2026-08-02",
      authority: "advisory_only",
      execution: { reason: "x" },
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
  });
});

describe("validatePublicImpact", () => {
  it("accepts a document with a VERIFIED outcome and allocationId", () => {
    const result = validatePublicImpact(validImpact);
    assert.ok(!("kind" in result));
    assert.equal(result.outcome.participantsPublic, 18);
    assert.equal(result.outcome.evidenceState, "VERIFIED");
    assert.equal(result.outcome.allocationId, "alloc_community_hardware");
  });

  it("accepts VERIFIED outcomes without allocationId", () => {
    const outcome = { ...validImpact.outcomes[0] };
    delete outcome.allocationId;
    const result = validatePublicImpact({
      ...validImpact,
      outcomes: [outcome],
    });
    assert.ok(!("kind" in result));
    assert.equal(result.outcome.allocationId, null);
  });

  it("rejects wrong authority as policy_rejected", () => {
    const result = validatePublicImpact({
      ...validImpact,
      authority: "advisory_only",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
  });

  it("rejects missing VERIFIED outcome as policy_rejected", () => {
    const result = validatePublicImpact({
      ...validImpact,
      outcomes: [
        {
          ...validImpact.outcomes[0],
          evidenceState: "PENDING",
        },
      ],
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
  });

  it("rejects malformed outcome fields", () => {
    const result = validatePublicImpact({
      ...validImpact,
      outcomes: [
        {
          ...validImpact.outcomes[0],
          participantsPublic: "eighteen",
        },
      ],
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
  });
});
