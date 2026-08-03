import { communityHardwareFixture } from "./fixtures";
import {
  assessFreshness,
  isStaleLabel,
  type FreshnessAssessment,
} from "./freshness";
import {
  validatePublicCampaign,
  validatePublicImpact,
  type ValidationFailure,
} from "./validate-public";

const fundIntelUrl =
  "https://raw.githubusercontent.com/scrimshawlife-ctrl/Fund-Intel/main/data/public-campaign.json";
const impactRelayUrl =
  "https://raw.githubusercontent.com/scrimshawlife-ctrl/Impact-Relay/main/data/public-impact.json";

/** Explicit source states for the public projection seam. */
export type SignalSourceState =
  | "live"
  | "stale"
  | "fallback"
  | "malformed"
  | "policy_rejected";

export type PublicSignals = {
  source: SignalSourceState;
  /** Human-readable reason when not fully live. Safe for UI and build logs. */
  reason?: string;
  fundIntel: {
    updatedAt: string;
    executionState: string;
    /** First published allocation id when Fund-Intel registry is present. */
    allocationId: string | null;
    freshness: FreshnessAssessment;
  };
  impactRelay: {
    updatedAt: string;
    organizationName: string;
    programName: string;
    allocationName: string;
    allocationId: string | null;
    participants: number;
    verified: boolean;
    freshness: FreshnessAssessment;
  };
};

const fallbackBase = {
  fundIntel: {
    updatedAt: communityHardwareFixture.decision.publishedAt,
    executionState: communityHardwareFixture.decision.status,
    allocationId: communityHardwareFixture.decision.allocationId,
  },
  impactRelay: {
    updatedAt:
      communityHardwareFixture.events.at(-1)?.occurredAt ??
      communityHardwareFixture.decision.publishedAt,
    organizationName: "Hacker Dojo",
    programName: "Intro to Robotics",
    allocationName: communityHardwareFixture.decision.fundName,
    allocationId: communityHardwareFixture.decision.allocationId,
    participants: 18,
    verified: true,
  },
} as const;

function buildFallback(
  source: Extract<
    SignalSourceState,
    "fallback" | "malformed" | "policy_rejected"
  >,
  reason: string,
  nowMs: number = Date.now(),
): PublicSignals {
  return {
    source,
    reason,
    fundIntel: {
      ...fallbackBase.fundIntel,
      freshness: assessFreshness(fallbackBase.fundIntel.updatedAt, nowMs),
    },
    impactRelay: {
      ...fallbackBase.impactRelay,
      freshness: assessFreshness(fallbackBase.impactRelay.updatedAt, nowMs),
    },
  };
}

function failureToFallback(
  failure: ValidationFailure,
  nowMs: number,
): PublicSignals {
  return buildFallback(failure.kind, failure.reason, nowMs);
}

export async function getPublicSignals(
  nowMs: number = Date.now(),
): Promise<PublicSignals> {
  try {
    const [campaignResponse, impactResponse] = await Promise.all([
      fetch(fundIntelUrl, { cache: "force-cache" }),
      fetch(impactRelayUrl, { cache: "force-cache" }),
    ]);

    if (!campaignResponse.ok || !impactResponse.ok) {
      return buildFallback(
        "fallback",
        `source HTTP failure (campaign ${campaignResponse.status}, impact ${impactResponse.status})`,
        nowMs,
      );
    }

    let campaignRaw: unknown;
    let impactRaw: unknown;
    try {
      campaignRaw = await campaignResponse.json();
      impactRaw = await impactResponse.json();
    } catch {
      return buildFallback("malformed", "JSON parse failure", nowMs);
    }

    const campaign = validatePublicCampaign(campaignRaw);
    if ("kind" in campaign) {
      return failureToFallback(campaign, nowMs);
    }

    const impact = validatePublicImpact(impactRaw);
    if ("kind" in impact) {
      return failureToFallback(impact, nowMs);
    }

    const fundFreshness = assessFreshness(campaign.updatedAt, nowMs);
    const impactFreshness = assessFreshness(impact.updatedAt, nowMs);
    const anyStale =
      isStaleLabel(fundFreshness.label) || isStaleLabel(impactFreshness.label);

    return {
      source: anyStale ? "stale" : "live",
      reason: anyStale
        ? `one or more sources exceeded freshness threshold (fund=${fundFreshness.label}, impact=${impactFreshness.label})`
        : undefined,
      fundIntel: {
        updatedAt: campaign.updatedAt,
        executionState: campaign.execution.state,
        allocationId: campaign.allocations[0]?.allocationId ?? null,
        freshness: fundFreshness,
      },
      impactRelay: {
        updatedAt: impact.updatedAt,
        organizationName: impact.outcome.organizationName,
        programName: impact.outcome.programName,
        allocationName: impact.outcome.allocationName,
        allocationId: impact.outcome.allocationId,
        participants: impact.outcome.participantsPublic,
        verified: true,
        freshness: impactFreshness,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown fetch error";
    return buildFallback("fallback", message, nowMs);
  }
}
