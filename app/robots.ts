import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/sitemap.xml" }; }
