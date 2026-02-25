import type { Metadata } from "next";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/header";
import { TrustBar } from "@/components/shared/trust-bar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { BackToTop } from "@/components/shared/back-to-top";
import { Providers } from "./providers";
import "./globals.css";

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ふたりナビ | 新婚カップルの行政手続き・給付金ガイド",
    template: "%s | ふたりナビ",
  },
  description:
    "婚姻届を出したその日から、やるべきことを一つずつ。手続きチェックリスト、給付金シミュレーター、パーソナライズドタイムラインで新生活をサポート。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://kgraph57.github.io/futari-navi"),
  ),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ふたりナビ",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ふたりナビ",
    title: "ふたりナビ | 新婚カップルの行政手続き・給付金ガイド",
    description:
      "婚姻届を出したその日から、やるべきことを一つずつ。手続きチェックリスト、給付金シミュレーター、タイムラインで新生活をサポート。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ふたりナビ - ふたりの新生活、もう迷わない",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ふたりナビ | 新婚カップルの行政手続き・給付金ガイド",
    description:
      "婚姻届を出したその日から、やるべきことを一つずつ。手続き・給付金を漏れなくサポート。",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#0D9488" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body
        className={`${zenMaruGothic.variable} ${notoSansJP.variable} antialiased`}
      >
        <Providers>
          <a href="#main-content" className="skip-to-content">
            コンテンツへスキップ
          </a>
          <Header />
          <TrustBar />
          <main id="main-content" className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
