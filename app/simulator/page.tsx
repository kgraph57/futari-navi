import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "結婚の届出・給付金チェッカー",
  description:
    "結婚予定日と世帯情報を入力するだけで、利用できる制度・給付金を一括チェック。約2分で結果がわかります。",
};

const FEATURES = [
  {
    iconName: "clock" as const,
    title: "約2分で完了",
    description: "3ステップの簡単な質問に答えるだけ。",
  },
  {
    iconName: "shield" as const,
    title: "個人情報不要",
    description: "入力内容はサーバーに保存されません。",
  },
  {
    iconName: "check" as const,
    title: "6つの制度を一括チェック",
    description: "結婚に関する制度・給付金をまとめて確認。",
  },
];

export default function SimulatorPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-600 text-white">
              <WatercolorIcon name="calculator" size={32} />
            </div>

            <h1 className="mt-6 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              結婚の届出・給付金チェッカー
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              結婚予定日と世帯情報を入力するだけで、利用できる
              <strong className="text-foreground">
                制度・給付金
              </strong>
              を一括チェックできます。
            </p>

            <Link
              href="/simulator/start"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-sage-600 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-sage-700"
            >
              チェックを始める
              <WatercolorIcon name="arrow_right" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-2xl font-semibold text-foreground">
            かんたん3つのポイント
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sage-50 text-sage-600">
                  <WatercolorIcon name={feature.iconName} size={28} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-ivory-100/50 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs leading-relaxed text-muted">
            本チェッカーの結果は概算です。実際の受給額や対象要件は、制度ごとの詳細条件により異なる場合があります。正確な情報は各制度の公式サイトや窓口でご確認ください。入力された情報はブラウザ上でのみ処理され、サーバーに送信・保存されることはありません。
          </p>
        </div>
      </section>
    </>
  );
}
