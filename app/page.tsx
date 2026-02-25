import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { getAllArticles } from "@/lib/content";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardTitle, CardDescription } from "@/components/shared/card";
import { Badge } from "@/components/shared/badge";
import { HeroDateInput } from "@/components/home/hero-date-input";
import type { ArticleCategory } from "@/lib/types";

/* ── How it works ── */
const STEPS = [
  {
    num: "1",
    title: "日付を入れる",
    description: "婚姻届の提出日（または予定日）を入力。",
  },
  {
    num: "2",
    title: "やることが出る",
    description: "あなたの状況に合わせたタスクリストを自動生成。",
  },
  {
    num: "3",
    title: "一つずつ消す",
    description: "完了したらチェック。進捗が見えるから漏れない。",
  },
] as const;

/* ── Benefits people miss ── */
const MISSED_BENEFITS = [
  {
    title: "結婚新生活支援事業",
    amount: "最大60万円",
    description: "住居費・引越費用の補助。申請しないともらえない。",
    href: "/programs",
  },
  {
    title: "配偶者控除",
    amount: "最大38万円控除",
    description: "年末調整で所得税・住民税を軽減。年内に届出すれば適用。",
    href: "/programs",
  },
  {
    title: "社会保険の扶養",
    amount: "保険料免除",
    description: "年収130万円未満なら健保・年金の負担ゼロに。",
    href: "/programs",
  },
] as const;

export default function HomePage() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ── Hero: Action Engine ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-100 to-ivory-50">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-sage-900 sm:text-4xl md:text-5xl">
            結婚手続き、
            <br className="sm:hidden" />
            全部終わらせよう。
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gold-600 sm:text-lg">
            日付を入れるだけで、やるべきことが全部わかる。
          </p>
          <div className="mt-10">
            <HeroDateInput />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b border-ivory-200 bg-white/60 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading align="center">3ステップで完了</SectionHeading>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-600 text-lg font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-sage-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Missed Benefits ── */}
      <section className="border-b border-ivory-200 bg-ivory-100/50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading
            subtitle="申請しないともらえない制度、まだ間に合います"
            align="center"
          >
            「知らなくて損した」を防ぐ
          </SectionHeading>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {MISSED_BENEFITS.map((benefit) => (
              <Link key={benefit.title} href={benefit.href} className="group">
                <div className="rounded-2xl border border-ivory-200 bg-white p-7 transition-all group-hover:border-sage-300 group-hover:shadow-md">
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
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/simulator"
              className="inline-flex items-center gap-2 rounded-xl border border-sage-300 bg-white px-6 py-3 text-sm font-semibold text-sage-700 transition-all hover:bg-sage-50 hover:shadow-sm"
            >
              <WatercolorIcon name="calculator" size={16} />
              給付金シミュレーターで詳しく診断
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features: Checklist + Glossary + FAQ ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading align="center">困ったらすぐ引ける</SectionHeading>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Link href="/checklists" className="group">
              <div className="rounded-2xl border border-ivory-200 bg-white p-7 transition-all group-hover:border-sage-300 group-hover:shadow-md">
                <div className="mb-5 inline-flex rounded-xl bg-sage-50 p-3">
                  <WatercolorIcon
                    name="clipboard"
                    size={28}
                    className="text-sage-600"
                  />
                </div>
                <h3 className="font-heading text-lg font-bold text-sage-900">
                  手続きチェックリスト
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-600">
                  婚姻届から名義変更まで、カテゴリ別に漏れなく確認。
                </p>
              </div>
            </Link>
            <Link href="/glossary" className="group">
              <div className="rounded-2xl border border-ivory-200 bg-white p-7 transition-all group-hover:border-sage-300 group-hover:shadow-md">
                <div className="mb-5 inline-flex rounded-xl bg-sage-50 p-3">
                  <WatercolorIcon
                    name="book"
                    size={28}
                    className="text-sage-600"
                  />
                </div>
                <h3 className="font-heading text-lg font-bold text-sage-900">
                  用語集
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-600">
                  戸籍謄本？配偶者控除？はじめて聞く言葉もすぐわかる。
                </p>
              </div>
            </Link>
            <Link href="/emergency" className="group">
              <div className="rounded-2xl border border-ivory-200 bg-white p-7 transition-all group-hover:border-sage-300 group-hover:shadow-md">
                <div className="mb-5 inline-flex rounded-xl bg-sage-50 p-3">
                  <WatercolorIcon
                    name="phone"
                    size={28}
                    className="text-sage-600"
                  />
                </div>
                <h3 className="font-heading text-lg font-bold text-sage-900">
                  相談窓口
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gold-600">
                  役所・年金事務所・法テラス。困ったときの連絡先まとめ。
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest Articles ── */}
      {latestArticles.length > 0 && (
        <section className="border-t border-ivory-200 bg-ivory-100/50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <SectionHeading
              subtitle="手続き・制度をわかりやすく解説"
              align="center"
            >
              最新記事
            </SectionHeading>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
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
            <div className="mt-8 text-center">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 transition-colors hover:text-sage-800"
              >
                全53記事を見る
                <WatercolorIcon name="chevron_right" size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA: Repeat the core action ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-sage-900 sm:text-3xl">
            まずは日付を入れてみよう
          </h2>
          <p className="mt-3 text-sm text-gold-600">
            婚姻届の提出日を入力するだけ。あなた専用のやることリストが自動で作られます。
          </p>
          <div className="mt-8">
            <Link
              href="/my/timeline"
              className="inline-flex items-center gap-2 rounded-xl bg-sage-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-sage-700 hover:shadow-md"
            >
              <WatercolorIcon name="calendar" size={18} />
              タイムラインを始める
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related Project ── */}
      <section className="border-t border-ivory-200 bg-ivory-100/30 py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs text-gold-400">関連プロジェクト</p>
          <p className="mt-1 text-sm font-medium text-sage-700">
            すくすくナビ — 港区の子育て支援ナビゲーター
          </p>
          <a
            href="https://kgraph57.github.io/sukusuku-navi/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-sage-500 transition-colors hover:text-sage-700"
          >
            すくすくナビを見る
            <WatercolorIcon name="chevron_right" size={12} />
          </a>
        </div>
      </section>
    </div>
  );
}
