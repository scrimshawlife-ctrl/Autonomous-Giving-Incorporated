/** Read-only public integration contracts proposed for v0.2; this is not a live client. */
export const INTEGRATION_CONTRACT_VERSION = "2026-08-02" as const;
export type PublicVerificationStatus = "pending" | "verified" | "rejected";
export type ImpactEventType = "purchase_approved" | "receipt_attached" | "equipment_delivered" | "program_held" | "attendance_verified" | "notification_delivered";
export type FundingDecision = { schemaVersion: typeof INTEGRATION_CONTRACT_VERSION; allocationId: string; fundName: string; rationale: string; status: "approved"; publishedAt: string };
export type ImpactEvent = { schemaVersion: typeof INTEGRATION_CONTRACT_VERSION; allocationId: string; eventId: string; type: ImpactEventType; occurredAt: string; verificationStatus: PublicVerificationStatus; /** Public-safe reference only; never a raw receipt, personal data, or secret URL. */ evidenceReference?: string };
export type PublicImpactNarrative = { decision: FundingDecision; events: readonly ImpactEvent[] };
