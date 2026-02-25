import { ImageResponse } from "next/og";

export const runtime = "edge";
/** Required for static export (GitHub Pages) */
export const dynamic = "force-static";
export const alt = "ふたりナビ - 結婚手続き、もう迷わない";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FEFDFB",
          borderRadius: 32,
          padding: "60px 80px",
          maxWidth: 1000,
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: "#0D9488",
            marginBottom: 16,
            letterSpacing: "0.04em",
          }}
        >
          ふたりナビ
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#1A1A2E",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          結婚手続き、もう迷わない。
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            "手続きチェックリスト",
            "給付金シミュレーター",
            "届出ガイド",
            "名義変更ナビ",
          ].map((label) => (
            <div
              key={label}
              style={{
                background: "#F0FDFA",
                border: "1px solid #99F6E4",
                borderRadius: 12,
                padding: "8px 20px",
                fontSize: 20,
                color: "#0F766E",
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 18,
            color: "#6B7280",
          }}
        >
          ふたりの新生活をスムーズにスタート
        </div>
      </div>
    </div>,
    { ...size },
  );
}
