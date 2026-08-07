import type { PublicSignals, SignalSourceState } from "@/integration/public-sources";

const STATUS_LABEL: Record<SignalSourceState, string> = {
  live: "Live public projection",
  stale: "Live projection · delayed sources",
  fallback: "Deterministic fallback",
  malformed: "Deterministic fallback · malformed source",
  policy_rejected: "Deterministic fallback · policy rejected",
};

function formatAge(ageMs: number | null): string | null {
  if (ageMs === null) return null;
  const hours = Math.floor(ageMs / (60 * 60 * 1000));
  if (hours < 24) return `${hours}h old`;
  const days = Math.floor(hours / 24);
  return `${days}d old`;
}

export function PublicSignals({ signals }: { signals: PublicSignals }) {
  const statusLabel = STATUS_LABEL[signals.source];
  const fundAge = formatAge(signals.fundIntel.freshness.ageMs);
  const impactAge = formatAge(signals.impactRelay.freshness.ageMs);

  return (
    <section className="signals section" id="signals">
      <div className="page-shell">
        <div className="signals-head">
          <div>
            <p className="kicker">Published public signals</p>
            <h2 className="section-heading">Evidence without donor data.</h2>
          </div>
          <span className="status-chip">
            <span className="status-dot" aria-hidden="true" />
            {statusLabel}
          </span>
        </div>

        {signals.reason ? (
          <p className="signal-reason" role="status">
            {signals.reason}
          </p>
        ) : null}

        <div className="signal-table" aria-label="Public evidence signals">
          <article className="signal-row">
            <p className="signal-source">Portfolio Signals</p>
            <p className="signal-value">
              Execution: {signals.fundIntel.executionState}
            </p>
            <p className="signal-detail">
              Advisory only. No campaign or donor record is inferred.
              {signals.fundIntel.allocationId
                ? ` · ${signals.fundIntel.allocationId}`
                : ""}
              {fundAge ? ` · ${fundAge}` : ""}
              {signals.fundIntel.freshness.label !== "fresh"
                ? ` · ${signals.fundIntel.freshness.label.replace("_", " ")}`
                : ""}
            </p>
            <time className="signal-date">{signals.fundIntel.updatedAt}</time>
          </article>
          <article className="signal-row">
            <p className="signal-source">Impact Relay</p>
            <p className="signal-value">
              {signals.impactRelay.participants} participants verified
            </p>
            <p className="signal-detail">
              {signals.impactRelay.programName} ·{" "}
              {signals.impactRelay.organizationName} ·{" "}
              {signals.impactRelay.allocationName}
              {signals.impactRelay.allocationId
                ? ` · ${signals.impactRelay.allocationId}`
                : ""}
              {impactAge ? ` · ${impactAge}` : ""}
              {signals.impactRelay.freshness.label !== "fresh"
                ? ` · ${signals.impactRelay.freshness.label.replace("_", " ")}`
                : ""}
            </p>
            <time className="signal-date">{signals.impactRelay.updatedAt}</time>
          </article>
        </div>
      </div>
    </section>
  );
}
