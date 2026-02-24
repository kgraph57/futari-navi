import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Image from "next/image";
import { withBasePath } from "@/lib/image-path";
import Link from "next/link";

export const metadata: Metadata = {
  title: "給付金シミュレーター",
  description:
    "お子さんの年齢と世帯情報を入力するだけで、港区で受けられる給付金・助成制度を一括検索。約2分で結果がわかります。",
};

const FEATURES = [
  {
    iconName: "clock" as const,
    title: "約2分で完了",
    description: "4ステップの簡単な質問に答えるだけ。",
    character: "/characters/poses/haruto_running.png",
    charAlt: "ハルト",
  },
  {
    iconName: "shield" as const,
    title: "個人情報不要",
    description: "入力内容はサーバーに保存されません。",
    character: "/characters/poses/pochi_sitting.png",
    charAlt: "ぽち",
  },
  {
    iconName: "check" as const,
    title: "17制度を一括チェック",
    description: "港区の子育て支援制度をまとめて確認。",
    character: "/characters/poses/risu_acorn.png",
    charAlt: "りすちゃん",
  },
];

export default function SimulatorPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blush-50 to-ivory-50 px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-center sm:gap-8">
            {/* キャラクター左 */}
            <div className="hidden sm:block">
              <Image
                src={withBasePath("/characters/poses/pankun_pointing.png")}
                alt="ぱんくん"
                width={130}
                height={130}
                className="drop-shadow-sm"
              />
            </div>
            {/* テキスト中央 */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blush-500 text-white">
                <WatercolorIcon name="calculator" size={32} />
              </div>

              <h1 className="mt-6 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                給付金シミュレーター
              </h1>

              <div className="mx-auto mt-4 max-w-xl rounded-xl bg-blush-50 border border-blush-200 px-4 py-3">
                <p className="text-center text-base font-semibold leading-relaxed text-blush-700 sm:text-lg">
                  港区の新生児家庭が受け取れる給付金・助成の合計は
                  <span className="font-heading text-xl sm:text-2xl">
                    最大約84万円/年
                  </span>
                  。
                  <br className="hidden sm:block" />
                  申請漏れを防ぎましょう。
                </p>
              </div>

              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                お子さんの年齢と世帯の情報から、港区で受けられる
                <strong className="text-foreground">
                  給付金・助成・子育て支援制度
                </strong>
                を一括検索します。
              </p>

              <Link
                href="/simulator/start"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-blush-500 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-blush-600"
              >
                シミュレーションを始める
                <WatercolorIcon name="arrow_right" size={20} />
              </Link>
            </div>
            {/* キャラクター右 */}
            <div className="hidden sm:block">
              <Image
                src={withBasePath("/characters/poses/usagi_happy.png")}
                alt="うさぎーさん"
                width={120}
                height={120}
                className="drop-shadow-sm"
              />
            </div>
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
                <div className="mx-auto mb-3 flex justify-center">
                  <Image
                    src={withBasePath(feature.character)}
                    alt={feature.charAlt}
                    width={72}
                    height={72}
                    className="drop-shadow-sm"
                  />
                </div>
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
            本シミュレーターの結果は概算です。実際の受給額や対象要件は、制度ごとの詳細条件により異なる場合があります。正確な情報は港区の窓口またはウェブサイトでご確認ください。入力された情報はブラウザ上でのみ処理され、サーバーに送信・保存されることはありません。
          </p>
        </div>
      </section>
    </>
  );
}
