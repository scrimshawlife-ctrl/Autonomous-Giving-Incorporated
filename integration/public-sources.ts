import { communityHardwareFixture } from "./fixtures";

const fundIntelUrl = "https://raw.githubusercontent.com/scrimshawlife-ctrl/Fund-Intel/main/data/public-campaign.json";
const impactRelayUrl = "https://raw.githubusercontent.com/scrimshawlife-ctrl/Impact-Relay/main/data/public-impact.json";

type PublicCampaign = { updatedAt: string; authority: "advisory_only"; execution: { state: string; reason: string } };
type PublicImpact = { updatedAt: string; authority: "public_aggregate_only"; outcomes: Array<{ organizationName: string; programName: string; allocationName: string; participantsPublic: number; evidenceState: string; eventDate: string }> };
export type PublicSignals = { source: "live" | "fallback"; fundIntel: { updatedAt: string; executionState: string }; impactRelay: { updatedAt: string; organizationName: string; programName: string; allocationName: string; participants: number; verified: boolean } };

const fallback: PublicSignals = { source: "fallback", fundIntel: { updatedAt: communityHardwareFixture.decision.publishedAt, executionState: communityHardwareFixture.decision.status }, impactRelay: { updatedAt: communityHardwareFixture.events.at(-1)?.occurredAt ?? communityHardwareFixture.decision.publishedAt, organizationName: "Hacker Dojo", programName: "Intro to Robotics", allocationName: communityHardwareFixture.decision.fundName, participants: 18, verified: true } };

export async function getPublicSignals(): Promise<PublicSignals> {
  try {
    const [campaignResponse, impactResponse] = await Promise.all([fetch(fundIntelUrl, { cache: "force-cache" }), fetch(impactRelayUrl, { cache: "force-cache" })]);
    if (!campaignResponse.ok || !impactResponse.ok) return fallback;
    const campaign = await campaignResponse.json() as PublicCampaign;
    const impact = await impactResponse.json() as PublicImpact;
    const outcome = impact.outcomes.find((item) => item.evidenceState === "VERIFIED");
    if (campaign.authority !== "advisory_only" || impact.authority !== "public_aggregate_only" || !outcome) return fallback;
    return { source: "live", fundIntel: { updatedAt: campaign.updatedAt, executionState: campaign.execution.state }, impactRelay: { updatedAt: impact.updatedAt, organizationName: outcome.organizationName, programName: outcome.programName, allocationName: outcome.allocationName, participants: outcome.participantsPublic, verified: true } };
  } catch { return fallback; }
}
