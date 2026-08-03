import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt =
  "Autonomously Giving Incorporated — Giving should not end with a receipt.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  paper: "#f7f9fc",
  ink: "#162235",
  muted: "#64748b",
  rule: "#cbd5e1",
  accent: "#2563eb",
  verified: "#167b58",
};

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: colors.paper,
        color: colors.ink,
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "64px 72px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderBottom: `2px solid ${colors.ink}`,
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 5,
          }}
        >
          AGI<span style={{ color: colors.accent }}>/</span>
        </div>
        <div
          style={{
            color: colors.muted,
            display: "flex",
            fontSize: 18,
            letterSpacing: 3,
          }}
        >
          PUBLIC EVIDENCE SYSTEM
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -4,
            lineHeight: 0.98,
          }}
        >
          Giving should not end
        </div>
        <div
          style={{
            color: colors.accent,
            display: "flex",
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -4,
            lineHeight: 0.98,
          }}
        >
          with a receipt.
        </div>
        <div
          style={{
            color: colors.muted,
            display: "flex",
            fontSize: 26,
            marginTop: 10,
          }}
        >
          From funding intent to verified community impact.
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${colors.rule}`,
          display: "flex",
          paddingTop: 22,
        }}
      >
        {[
          ["01", "Fund Intel", "decision"],
          ["02", "AGI", "experience"],
          ["03", "Impact Relay", "verified"],
        ].map(([index, label, state], position) => (
          <div
            key={label}
            style={{
              borderLeft: position ? `1px solid ${colors.rule}` : "none",
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 8,
              paddingLeft: position ? 28 : 0,
            }}
          >
            <div style={{ color: colors.muted, display: "flex", fontSize: 16 }}>
              {index}
            </div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 600 }}>
              {label}
            </div>
            <div
              style={{
                color: state === "verified" ? colors.verified : colors.accent,
                display: "flex",
                fontSize: 16,
                textTransform: "uppercase",
              }}
            >
              {state}
            </div>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
