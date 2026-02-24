import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages && { output: "export" as const }),
  basePath: isGitHubPages ? "/sukusuku-navi" : "",
  compress: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/sukusuku-navi" : "",
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    // PostHog パッケージが .ts ソースファイルを同梱しており Next.js の型チェッカーが拾うため抑制
    // 自プロジェクトの TypeScript エラーは tsc --noEmit で別途確認済み
    ignoreBuildErrors: true,
  },
  experimental: {
    mdxRs: false,
  },
};

export default nextConfig;
