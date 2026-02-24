import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { getAllArticles } from "@/lib/content";
import { ArticleFilter } from "@/components/article/article-filter";
import { ImpactStats } from "@/components/shared/impact-stats";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "小児科医おかもんが書いたQ&A形式の子育て・医療記事。感染症、アレルギー、予防接種、発達など50本以上。",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const frontmatters = articles.map((a) => a.frontmatter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-50">
          <WatercolorIcon name="book" size={20} className="text-sage-600" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            記事一覧
          </h1>
          <p className="mt-1 text-sm text-muted">
            小児科医おかもんのQ&A記事（全{frontmatters.length}本）
          </p>
        </div>
      </div>

      {/* おかもん先生からの一言 */}
      <Link
        href="/about"
        className="group mt-6 flex items-start gap-4 rounded-xl border border-sage-100 bg-sage-50/50 p-5 transition-colors hover:border-sage-200 hover:bg-sage-50"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-600 shadow-sm">
          <WatercolorIcon name="stethoscope" size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading text-sm font-semibold text-foreground">
            おかもん先生より
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            外来で何度も聞かれる質問を、Q&A形式でまとめました。
            「夜中に熱が出た」「発疹が出た」など、すぐに答えが見つかるように書いています。
            すべての記事に参考文献をつけていますので、安心してお読みください。
          </p>
          <span className="mt-2 inline-block text-xs font-medium text-sage-600 group-hover:underline">
            プロフィールを見る →
          </span>
        </div>
      </Link>

      {/* コンテンツ統計 */}
      <div className="mt-6">
        <ImpactStats />
      </div>

      <div className="mt-8">
        <ArticleFilter articles={frontmatters} />
      </div>
    </div>
  );
}
