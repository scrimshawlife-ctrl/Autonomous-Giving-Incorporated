import type { Metadata } from "next";
import { SITE_ORIGIN, absoluteSiteUrl } from "@/site";
import "./globals.css";

const description =
  "Autonomously Giving Incorporated shows how contributions move from funding intent to verified community impact through Fund Intel and Impact Relay.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Autonomously Giving Incorporated",
    template: "%s | AGI",
  },
  description,
  alternates: { canonical: absoluteSiteUrl() },
  openGraph: {
    title: "Autonomously Giving Incorporated",
    description: "Giving should not end with a receipt.",
    type: "website",
    url: absoluteSiteUrl(),
    siteName: "Autonomously Giving Incorporated",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonomously Giving Incorporated",
    description: "Giving should not end with a receipt.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
