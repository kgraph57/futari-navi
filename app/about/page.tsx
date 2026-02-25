import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { getAllArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "ふたりナビとは",
  description:
    "ふたりナビは、結婚に伴う届出・手続き・給付金をわかりやすくナビゲートする情報サイトです。",
};

const VALUES = [
  {
    iconName: "shield" as const,
    title: "網羅的な情報",
    description:
      "婚姻届から名義変更、給付金、税制優遇まで必要な手続きを網羅。漏れなくチェックできます。",
  },
  {
    iconName: "book" as const,
    title: "わかりやすい解説",
    description:
      "行政用語をかみ砕き、具体的な手順と必要書類を明示。「次に何をすればいいか」がすぐわかります。",
  },
  {
    iconName: "heart" as const,
    title: "無料で利用可能",
    description:
      "会員登録なしですべての情報にアクセスできます。",
  },
];

const FEATURES_DETAIL = [
  "結婚に必要な届出・手続きのチェックリスト",
  "結婚新生活支援事業（最大60万円）の受給判定",
  "配偶者控除・社会保険扶養の制度解説",
  "手続きスケジュールのタイムライン管理",
  "名義変更の全体像と優先順位ガイド",
  "東京都ふたり結婚応援パスポートの案内",
] as const;

export default function AboutPage() {
  const allArticles = getAllArticles();

  return (
    <div className="px-4 py-12 sm:py-16">
      {/* ─── ミッション ─── */}
      <section className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-sage-200/60 bg-sage-50/50 px-6 py-8 text-center sm:px-10">
          <p className="text-xs font-medium uppercase tracking-widest text-sage-600">
            Mission
          </p>
          <p className="mt-3 font-heading text-lg font-bold leading-relaxed text-foreground sm:text-xl">
            結婚という人生の大きな節目を、
            <br className="hidden sm:inline" />
            手続きの煩雑さで台無しにしない。
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            届出・名義変更・給付金申請──
            結婚後にやるべき手続きは20以上。ふたりナビが全体像と最適な順序をガイドします。
          </p>
        </div>
      </section>

      {/* ─── Introduction ─── */}
      <section className="mx-auto mt-16 max-w-3xl text-center sm:mt-24">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          ふたりナビとは
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          ふたりナビは、結婚に伴う届出・名義変更・給付金・税制優遇など、新婚カップルが知っておくべき情報をまとめた無料のナビゲーションサイトです。
        </p>
      </section>

      {/* ─── Values ─── */}
      <section className="mx-auto mt-16 max-w-4xl sm:mt-24">
        <SectionHeading>大切にしていること</SectionHeading>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-sage-50">
                <WatercolorIcon name={value.iconName} size={40} />
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="mx-auto mt-16 max-w-3xl rounded-xl border border-border bg-card p-8 sm:mt-24">
        <SectionHeading>ふたりナビでできること</SectionHeading>
        <ul className="mt-8 space-y-3">
          {FEATURES_DETAIL.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm text-foreground"
            >
              <WatercolorIcon
                name="check"
                size={16}
                className="mt-0.5 shrink-0 text-sage-500"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-muted">
          現在 {allArticles.length} 本の記事を公開中
        </p>
      </section>

      {/* ─── Disclaimer ─── */}
      <section className="mx-auto mt-16 max-w-3xl rounded-xl bg-warm-100 p-6 sm:mt-24">
        <h3 className="font-heading text-base font-bold text-foreground">
          免責事項
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          本サイトの情報は一般的な行政手続きに関する情報提供を目的としており、個別の法律相談・税務相談を行うものではありません。正確な情報は各自治体の窓口や専門家（税理士・社会保険労務士等）にご確認ください。
        </p>
      </section>

      {/* ─── CTA ─── */}
      <section className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
        <Link
          href="/my/timeline"
          className="inline-flex items-center gap-2 rounded-full bg-sage-600 px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-sage-600/25 transition-all hover:bg-sage-700 hover:shadow-xl"
        >
          結婚日を登録して始める
          <WatercolorIcon name="arrow_right" size={16} />
        </Link>
      </section>
    </div>
  );
}
