import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { getAllArticles } from "@/lib/content";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import type { ArticleCategory } from "@/lib/types";
/* ── Features ── */
const FEATURES = [
  {
    href: "/my/timeline",
    iconName: "calendar" as const,
    title: "パーソナライズドタイムライン",
    description: "婚姻届日を入れるだけで、やるべきことを自動生成。",
  },
  {
    href: "/simulator",
    iconName: "calculator" as const,
    title: "給付金シミュレーター",
    description: "最大60万円。対象かどうか3分で判定。",
  },
  {
    href: "/checklists",
    iconName: "clipboard" as const,
    title: "手続きチェックリスト",
    description: "名義変更から届出まで、漏れなく完了。",
  },
] as const;

/* ── Benefits people miss ── */
const MISSED_BENEFITS = [
  {
    title: "結婚新生活支援事業",
    amount: "最大60万円",
    description: "住居費・引越費用の補助",
    href: "/programs",
  },
  {
    title: "配偶者控除",
    amount: "最大38万円控除",
    description: "年末調整で所得税・住民税を軽減",
    href: "/programs",
  },
  {
    title: "社会保険の扶養",
    amount: "保険料免除",
    description: "年収130万円未満なら健保・年金の負担ゼロ",
    href: "/programs",
  },
] as const;

export default function HomePage() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-100 to-ivory-50">
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
          <p className="mb-4 text-sm font-medium tracking-widest text-sage-500 uppercase">
            Futari Navi
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-sage-900 sm:text-5xl md:text-6xl">
            ふたりの新生活、
            <br />
            もう迷わない。
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gold-600">
            婚姻届を出したその日から、やるべきことを一つずつ。
            <br className="hidden sm:block" />
            手続き漏れも、もらい忘れも、ゼロに。
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/my/timeline"
              className="inline-flex items-center gap-2 rounded-xl bg-sage-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-sage-700 hover:shadow-md"
            >
              <WatercolorIcon name="calendar" size={18} />
              タイムラインを始める
            </Link>
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 rounded-xl border border-sage-300 bg-white/80 px-8 py-4 text-base font-semibold text-sage-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm"
            >
              <WatercolorIcon name="calculator" size={18} />
              給付金をチェック
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="border-b border-ivory-200 bg-white/60 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <SectionHeading align="center">
            こんな悩み、ありませんか？
          </SectionHeading>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              "結婚の手続き、何からやればいい？",
              "もらえる給付金、見逃してない？",
              "名義変更、効率的な順番は？",
            ].map((pain) => (
              <div
                key={pain}
                className="rounded-2xl border border-ivory-200 bg-ivory-50 px-6 py-8"
              >
                <p className="text-base font-medium leading-relaxed text-sage-800">
                  {pain}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 Features ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading align="center">ふたりナビの3つの特徴</SectionHeading>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <div className="rounded-2xl border border-ivory-200 bg-white p-8 transition-all group-hover:border-sage-300 group-hover:shadow-md">
                  <div className="mb-6 inline-flex rounded-xl bg-sage-50 p-3">
                    <WatercolorIcon
                      name={feature.iconName}
                      size={28}
                      className="text-sage-600"
                    />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-sage-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gold-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Missed Benefits ── */}
      <section className="border-y border-ivory-200 bg-ivory-100/50 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            subtitle="申請しないともらえない制度、まだ間に合います"
            align="center"
          >
            「知らなくて損した」を防ぐ
          </SectionHeading>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {MISSED_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-ivory-200 bg-white p-8"
              >
                <p className="text-2xl font-bold text-sage-600">
                  {benefit.amount}
                </p>
                <h3 className="mt-2 font-heading text-base font-bold text-sage-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-gold-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
            >
              制度一覧を見る
              <WatercolorIcon name="chevron_right" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Articles ── */}
      {latestArticles.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <SectionHeading
              subtitle="結婚の手続き・制度をわかりやすく解説"
              align="center"
            >
              最新記事
            </SectionHeading>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {latestArticles.map((article) => (
                <Card
                  key={article.frontmatter.slug}
                  href={`/articles/${article.frontmatter.slug}`}
                  variant="outlined"
                >
                  <div className="p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        category={
                          article.frontmatter.category as ArticleCategory
                        }
                      />
                      <span className="text-xs text-gold-500">
                        Vol.{article.frontmatter.vol}
                      </span>
                    </div>
                    <CardTitle className="text-base">
                      {article.frontmatter.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      {article.frontmatter.description}
                    </CardDescription>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
              >
                すべての記事を見る
                <WatercolorIcon name="chevron_right" size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Sukusuku-navi Link ── */}
      <section className="border-t border-ivory-200 bg-ivory-100/30 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm text-gold-500">妊娠・出産を考え始めたら</p>
          <p className="mt-2 font-heading text-lg font-bold text-sage-800">
            スクスクなび — 港区の子育て支援ナビゲーター
          </p>
          <a
            href="https://kgraph57.github.io/sukusuku-navi/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
          >
            スクスクなびを見る
            <WatercolorIcon name="chevron_right" size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
