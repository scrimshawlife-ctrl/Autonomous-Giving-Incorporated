import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Autonomous Giving Incorporated", template: "%s | AGI" },
  description: "Autonomous Giving Incorporated is a transparency-first platform showing how donations move from funding intent to verified community impact through Fund Intel and Impact Relay.",
  metadataBase: new URL("https://autonomous-giving-incorporated.vercel.app"),
  openGraph: { title: "Autonomous Giving Incorporated", description: "Giving should not end with a receipt.", type: "website" },
  twitter: { card: "summary_large_image", title: "Autonomous Giving Incorporated", description: "Giving should not end with a receipt." },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
