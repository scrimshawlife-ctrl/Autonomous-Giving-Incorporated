import type { PublicSignals } from "./public-sources";

/**
 * Privacy-safe diagnostic summary for build logs and CI.
 * Never includes raw payloads, donor data, or evidence URLs.
 */
export type PublicSignalDiagnostic = {
  source: PublicSignals["source"];
  reason?: string;
  fundIntel: {
    updatedAt: string;
    executionState: string;
    freshness: PublicSignals["fundIntel"]["freshness"]["label"];
    ageMs: number | null;
  };
  impactRelay: {
    updatedAt: string;
    verified: boolean;
    freshness: PublicSignals["impactRelay"]["freshness"]["label"];
    ageMs: number | null;
    organizationName: string;
    programName: string;
  };
};

export function toDiagnostic(signals: PublicSignals): PublicSignalDiagnostic {
  return {
    source: signals.source,
    reason: signals.reason,
    fundIntel: {
      updatedAt: signals.fundIntel.updatedAt,
      executionState: signals.fundIntel.executionState,
      freshness: signals.fundIntel.freshness.label,
      ageMs: signals.fundIntel.freshness.ageMs,
    },
    impactRelay: {
      updatedAt: signals.impactRelay.updatedAt,
      verified: signals.impactRelay.verified,
      freshness: signals.impactRelay.freshness.label,
      ageMs: signals.impactRelay.freshness.ageMs,
      organizationName: signals.impactRelay.organizationName,
      programName: signals.impactRelay.programName,
    },
  };
}

/** Single-line log string safe for CI output. */
export function formatDiagnosticLine(signals: PublicSignals): string {
  const d = toDiagnostic(signals);
  const parts = [
    `agi.public_signals source=${d.source}`,
    d.reason ? `reason="${d.reason}"` : null,
    `fund=${d.fundIntel.freshness}`,
    `impact=${d.impactRelay.freshness}`,
    `fund_updated=${d.fundIntel.updatedAt}`,
    `impact_updated=${d.impactRelay.updatedAt}`,
  ].filter(Boolean);
  return parts.join(" ");
}
