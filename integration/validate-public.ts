/**
 * Structural validation for the two public documents AGI consumes at build time.
 *
 * This is intentional scaffolding: field presence, authority constants, and the
 * minimum shape required to project public signals. Full JSON Schema (ajv)
 * validation against the upstream schemas is the natural next step once the
 * source documents and this adapter have stabilized together.
 */

export type ValidationFailure = {
  kind: "malformed" | "policy_rejected";
  reason: string;
};

export type ValidatedCampaignAllocation = {
  allocationId: string;
  fundName: string;
  status: string;
};

export type ValidatedCampaign = {
  updatedAt: string;
  authority: "advisory_only";
  execution: { state: string; reason: string };
  /** Optional public allocation registry when Fund-Intel publishes it. */
  allocations: ValidatedCampaignAllocation[];
};

export type ValidatedImpactOutcome = {
  organizationName: string;
  programName: string;
  allocationName: string;
  /** Optional suite join key when Impact-Relay exports it. */
  allocationId: string | null;
  participantsPublic: number;
  evidenceState: "VERIFIED";
  eventDate: string;
};

export type ValidatedImpact = {
  updatedAt: string;
  authority: "public_aggregate_only";
  outcome: ValidatedImpactOutcome;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function validatePublicCampaign(
  value: unknown,
): ValidatedCampaign | ValidationFailure {
  if (!isRecord(value)) {
    return { kind: "malformed", reason: "campaign document is not an object" };
  }

  if (value.authority !== "advisory_only") {
    return {
      kind: "policy_rejected",
      reason: `campaign authority must be advisory_only (got ${String(value.authority)})`,
    };
  }

  if (!isNonEmptyString(value.updatedAt)) {
    return { kind: "malformed", reason: "campaign.updatedAt missing or empty" };
  }

  if (!isRecord(value.execution)) {
    return { kind: "malformed", reason: "campaign.execution missing or invalid" };
  }

  if (!isNonEmptyString(value.execution.state)) {
    return { kind: "malformed", reason: "campaign.execution.state missing or empty" };
  }

  if (!isNonEmptyString(value.execution.reason)) {
    return { kind: "malformed", reason: "campaign.execution.reason missing or empty" };
  }

  const allocations: ValidatedCampaignAllocation[] = [];
  if (value.allocations !== undefined) {
    if (!Array.isArray(value.allocations)) {
      return { kind: "malformed", reason: "campaign.allocations must be an array when present" };
    }
    for (const item of value.allocations) {
      if (!isRecord(item)) {
        return { kind: "malformed", reason: "campaign.allocations entry is not an object" };
      }
      if (!isNonEmptyString(item.allocationId)) {
        return { kind: "malformed", reason: "campaign.allocations.allocationId missing" };
      }
      if (!isNonEmptyString(item.fundName)) {
        return { kind: "malformed", reason: "campaign.allocations.fundName missing" };
      }
      if (!isNonEmptyString(item.status)) {
        return { kind: "malformed", reason: "campaign.allocations.status missing" };
      }
      allocations.push({
        allocationId: item.allocationId,
        fundName: item.fundName,
        status: item.status,
      });
    }
  }

  return {
    updatedAt: value.updatedAt,
    authority: "advisory_only",
    execution: {
      state: value.execution.state,
      reason: value.execution.reason,
    },
    allocations,
  };
}

export function validatePublicImpact(
  value: unknown,
): ValidatedImpact | ValidationFailure {
  if (!isRecord(value)) {
    return { kind: "malformed", reason: "impact document is not an object" };
  }

  if (value.authority !== "public_aggregate_only") {
    return {
      kind: "policy_rejected",
      reason: `impact authority must be public_aggregate_only (got ${String(value.authority)})`,
    };
  }

  if (!isNonEmptyString(value.updatedAt)) {
    return { kind: "malformed", reason: "impact.updatedAt missing or empty" };
  }

  if (!Array.isArray(value.outcomes)) {
    return { kind: "malformed", reason: "impact.outcomes must be an array" };
  }

  const verified = value.outcomes.find((item) => {
    if (!isRecord(item)) return false;
    return item.evidenceState === "VERIFIED";
  });

  if (!verified || !isRecord(verified)) {
    return {
      kind: "policy_rejected",
      reason: "no outcome with evidenceState VERIFIED",
    };
  }

  if (!isNonEmptyString(verified.organizationName)) {
    return { kind: "malformed", reason: "verified outcome.organizationName missing" };
  }
  if (!isNonEmptyString(verified.programName)) {
    return { kind: "malformed", reason: "verified outcome.programName missing" };
  }
  if (!isNonEmptyString(verified.allocationName)) {
    return { kind: "malformed", reason: "verified outcome.allocationName missing" };
  }
  if (!isFiniteNumber(verified.participantsPublic)) {
    return { kind: "malformed", reason: "verified outcome.participantsPublic invalid" };
  }
  if (!isNonEmptyString(verified.eventDate)) {
    return { kind: "malformed", reason: "verified outcome.eventDate missing" };
  }

  const allocationId = isNonEmptyString(verified.allocationId)
    ? verified.allocationId
    : null;

  return {
    updatedAt: value.updatedAt,
    authority: "public_aggregate_only",
    outcome: {
      organizationName: verified.organizationName,
      programName: verified.programName,
      allocationName: verified.allocationName,
      allocationId,
      participantsPublic: verified.participantsPublic,
      evidenceState: "VERIFIED",
      eventDate: verified.eventDate,
    },
  };
}
