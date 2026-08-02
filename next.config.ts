import type { NextConfig } from "next";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/Autonomous-Giving-Incorporated" : "";
const nextConfig: NextConfig = { reactStrictMode: true, output: "export", basePath, assetPrefix: basePath || undefined };
export default nextConfig;
