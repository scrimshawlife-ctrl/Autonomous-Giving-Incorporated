import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export const alt = "Autonomous Giving Incorporated — Giving should not end with a receipt.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() { return new ImageResponse(<div style={{ background: "#07090d", color: "#f8fafc", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "72px", width: "100%" }}><div style={{ color: "#f6c85f", display: "flex", fontFamily: "Arial", fontSize: 28, fontWeight: 700, letterSpacing: 7 }}>AGI.</div><div style={{ display: "flex", flexDirection: "column", gap: 24 }}><div style={{ display: "flex", fontFamily: "Arial", fontSize: 72, fontWeight: 700, letterSpacing: -4, lineHeight: 1.04 }}>Giving should not end<br/>with a receipt.</div><div style={{ color: "#cbd5e1", display: "flex", fontFamily: "Arial", fontSize: 28 }}>From funding intent to verified community impact.</div></div><div style={{ color: "#86efac", display: "flex", fontFamily: "Arial", fontSize: 22 }}>Fund Intel - AGI - Impact Relay</div></div>, size); }
