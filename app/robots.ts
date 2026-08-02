import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://autonomous-giving-incorporated.vercel.app/sitemap.xml" }; }
