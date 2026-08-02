import type { PublicSignals } from "@/integration/public-sources";

export function PublicSignals({ signals }: { signals: PublicSignals }) {
  const isLive = signals.source === "live";

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
            {isLive ? "Live public projection" : "Deterministic fallback"}
          </span>
        </div>
        <div className="signal-table" aria-label="Public evidence signals">
          <article className="signal-row">
            <p className="signal-source">Fund Intel</p>
            <p className="signal-value">
              Execution: {signals.fundIntel.executionState}
            </p>
            <p className="signal-detail">
              Advisory only. No campaign or donor record is inferred.
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
            </p>
            <time className="signal-date">{signals.impactRelay.updatedAt}</time>
          </article>
        </div>
      </div>
    </section>
  );
}
