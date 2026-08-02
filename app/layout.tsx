import type { Metadata } from "next";
import { SITE_ORIGIN, absoluteSiteUrl } from "@/site";
import "./globals.css";

const description =
  "Autonomous Giving Incorporated shows how contributions move from funding intent to verified community impact through Fund Intel and Impact Relay.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Autonomous Giving Incorporated",
    template: "%s | AGI",
  },
  description,
  alternates: { canonical: absoluteSiteUrl() },
  openGraph: {
    title: "Autonomous Giving Incorporated",
    description: "Giving should not end with a receipt.",
    type: "website",
    url: absoluteSiteUrl(),
    siteName: "Autonomous Giving Incorporated",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonomous Giving Incorporated",
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
