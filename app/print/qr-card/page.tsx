import QRCode from "qrcode";
import { PrintButton } from "@/components/print/print-button";

const SITE_URL = "https://kgraph57.github.io/sukusuku-navi/";

async function generateQRDataURL(): Promise<string> {
  return QRCode.toDataURL(SITE_URL, {
    width: 300,
    margin: 1,
    color: { dark: "#0D9488", light: "#FFFFFF" },
  });
}

export default async function PrintQRCardPage() {
  const qrDataUrl = await generateQRDataURL();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 print:max-w-none print:p-0">
      {/* ─── Screen-only instructions ─── */}
      <div className="mb-8 rounded-xl border border-sage-200 bg-sage-50 p-6 print:hidden">
        <h1 className="font-heading text-xl font-bold text-foreground">
          配布用カード・チラシ
        </h1>
        <p className="mt-2 text-sm text-muted">
          ブラウザの印刷機能（Ctrl+P / Cmd+P）でPDFに保存できます。
          余白を「なし」に設定するときれいに印刷されます。
        </p>
        <div className="mt-4">
          <PrintButton />
        </div>
      </div>

      {/* ─── Business Card (名刺サイズ 91mm × 55mm) ─── */}
      <section className="mb-12 print:mb-0 print:break-after-page">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground print:hidden">
          名刺サイズカード（91mm × 55mm）
        </h2>
        <div
          className="mx-auto overflow-hidden rounded-lg border border-gray-200 bg-white print:rounded-none print:border-0"
          style={{ width: "91mm", height: "55mm" }}
        >
          <div className="flex h-full items-center gap-3 px-4 py-3">
            {/* Left: Text */}
            <div className="flex-1">
              <p className="font-heading text-[11px] font-bold leading-tight text-teal-700">
                すくすくナビ
              </p>
              <p className="mt-1 text-[9px] font-bold leading-snug text-foreground">
                港区の助成金、
                <br />
                もらい忘れていませんか？
              </p>
              <div className="mt-1.5 h-px w-12 bg-teal-200" />
              <p className="mt-1 text-[7px] leading-tight text-muted">
                給付金シミュレーター・受診判断
                <br />
                予防接種スケジュール・60本以上の記事
              </p>
              <div className="mt-1.5">
                <p className="text-[7px] font-medium text-teal-600">
                  おかもん先生（岡本 賢）
                </p>
                <p className="text-[6px] text-muted">愛育病院 小児科</p>
              </div>
            </div>
            {/* Right: QR Code */}
            <div className="flex shrink-0 flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QRコード"
                style={{ width: "30mm", height: "30mm" }}
              />
              <p className="mt-0.5 text-center text-[5px] text-muted">
                無料でご利用いただけます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── A5 Flyer (148mm × 210mm) ─── */}
      <section className="print:break-after-page">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground print:hidden">
          A5チラシ（148mm × 210mm）
        </h2>
        <div
          className="mx-auto overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-b from-teal-50 to-white print:rounded-none print:border-0"
          style={{ width: "148mm", height: "210mm" }}
        >
          <div className="flex h-full flex-col px-6 py-6">
            {/* Header badge */}
            <div className="text-center">
              <p className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-[10px] font-medium text-teal-700">
                愛育病院 小児科医が作りました
              </p>
              <h1 className="mt-3 font-heading text-[18px] font-bold leading-tight text-foreground">
                港区の助成金、
                <br />
                もらい忘れて
                <br />
                いませんか？
              </h1>
              <p className="mt-2 text-[10px] text-muted">
                港区在住なら年間最大84万円の助成金があります
              </p>
            </div>

            {/* Features list */}
            <div className="mt-5 space-y-2.5">
              {[
                {
                  label: "給付金シミュレーター",
                  desc: "2分で受けられる助成金がわかる",
                },
                {
                  label: "受診判断ガイド",
                  desc: "30秒で救急か明日かがわかる",
                },
                {
                  label: "予防接種スケジュール",
                  desc: "接種漏れを防ぐリマインド",
                },
                {
                  label: "60本以上の医療記事",
                  desc: "小児科医が書き下ろし",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="mt-0.5 text-[8px] text-teal-500">●</span>
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="text-[9px] text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code */}
            <div className="mt-auto flex flex-col items-center pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QRコード"
                style={{ width: "40mm", height: "40mm" }}
              />
              <p className="mt-1.5 text-center text-[9px] font-medium text-teal-600">
                スマホでスキャンして今すぐチェック
              </p>
              <p className="mt-0.5 text-center text-[7px] text-muted">
                すくすくナビ　無料・登録不要
              </p>
            </div>

            {/* Doctor info */}
            <div className="mt-4 border-t border-teal-100 pt-3 text-center">
              <p className="text-[10px] font-medium text-foreground">
                おかもん先生 / 岡本 賢
              </p>
              <p className="text-[8px] text-muted">
                愛育病院 小児科 ・ 港区在住 ・ 2児の父
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
