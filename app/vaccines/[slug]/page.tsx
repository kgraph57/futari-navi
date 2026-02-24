import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllVaccines,
  getVaccineBySlug,
  VACCINE_TYPE_LABELS,
  VACCINE_TYPE_COLORS,
  formatAgeMonths,
} from "@/lib/vaccines";
import { getProgramBySlug } from "@/lib/programs";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const vaccines = getAllVaccines();
  return vaccines.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vaccine = getVaccineBySlug(slug);
  if (!vaccine) return { title: "ワクチンが見つかりません" };
  return {
    title: `${vaccine.name}の接種スケジュール`,
    description: vaccine.description,
  };
}

export default async function VaccineDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const vaccine = getVaccineBySlug(slug);

  if (!vaccine) {
    notFound();
  }

  const colorClass =
    VACCINE_TYPE_COLORS[vaccine.type] ??
    "bg-gray-50 text-gray-700 border-gray-200";
  const relatedProgram = vaccine.relatedProgramSlug
    ? getProgramBySlug(vaccine.relatedProgramSlug)
    : null;

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/vaccines"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            予防接種一覧に戻る
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}
            >
              <WatercolorIcon name="syringe" size={24} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
                >
                  {VACCINE_TYPE_LABELS[vaccine.type]}
                </span>
                {relatedProgram && (
                  <span className="inline-flex rounded-full border border-blush-200 bg-blush-50 px-2.5 py-0.5 text-xs font-medium text-blush-600">
                    港区助成あり
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                {vaccine.name}
              </h1>
              <p className="mt-1 text-sm text-muted">{vaccine.disease}</p>
            </div>
          </div>

          <p className="mt-4 text-base leading-relaxed text-muted">
            {vaccine.description}
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="clock" size={20} className="text-sage-600" />
              接種スケジュール
            </h2>
            <ol className="mt-4 space-y-4">
              {vaccine.doses.map((dose) => (
                <li key={dose.doseNumber} className="flex gap-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-bold text-sage-700">
                    {dose.doseNumber}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium text-card-foreground">
                      {dose.label}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-sage-50 px-2 py-0.5 text-xs text-sage-700">
                        標準:{" "}
                        {dose.ageMonthsStandard >= 999
                          ? "毎年"
                          : formatAgeMonths(dose.ageMonthsStandard)}
                      </span>
                      {dose.ageMonthsMax < 999 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-ivory-100 px-2 py-0.5 text-xs text-muted">
                          接種可能期間: {formatAgeMonths(dose.ageMonthsMin)}〜
                          {formatAgeMonths(dose.ageMonthsMax)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="star" size={20} className="text-sage-600" />
              主な副反応
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-card-foreground">
              {vaccine.sideEffects}
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-amber-800">
              <WatercolorIcon name="star" size={20} />
              接種の注意事項・禁忌
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-amber-900">
              {vaccine.contraindications}
            </p>
          </div>

          {relatedProgram && (
            <div className="rounded-xl border border-blush-200 bg-blush-50 p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-blush-600">
                <WatercolorIcon name="shield" size={20} />
                港区の助成制度
              </h2>
              <p className="mt-3 text-sm font-medium text-blush-600">
                {relatedProgram.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-blush-600">
                {relatedProgram.description}
              </p>
              <Link
                href={`/programs/${relatedProgram.slug}`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blush-600 underline hover:text-blush-600"
              >
                助成制度の詳細を見る
                <WatercolorIcon name="external" size={12} />
              </Link>
            </div>
          )}

          {vaccine.faq && vaccine.faq.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="help" size={20} className="text-sage-600" />
                よくある質問
              </h2>
              <div className="mt-4 space-y-5">
                {vaccine.faq.map((item, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-card-foreground">
                      Q. {item.question}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      A. {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vaccine.relatedArticleSlug && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="check" size={20} className="text-sage-600" />
                関連記事
              </h2>
              <Link
                href={`/articles/${vaccine.relatedArticleSlug}`}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-sage-200 bg-sage-50 px-4 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
              >
                おかもん先生の予防接種解説記事を読む
                <WatercolorIcon name="arrow_right" size={16} className="rotate-180" />
              </Link>
            </div>
          )}

          {vaccine.knowVpdUrl && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="book" size={20} className="text-sage-600" />
                公式情報・参考サイト
              </h2>
              <p className="mt-2 text-sm text-muted">
                このワクチンについての詳しい情報は、以下の公式サイトもあわせてご参照ください。
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={vaccine.knowVpdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-sage-200 bg-sage-50 px-4 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-100"
                >
                  <WatercolorIcon name="shield" size={16} className="shrink-0" />
                  Know VPD! で{vaccine.nameShort}の詳細を見る
                  <WatercolorIcon name="external" size={12} className="ml-auto .5 .5 shrink-0" />
                </a>
                <a
                  href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-ivory-50 px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-ivory-100"
                >
                  <WatercolorIcon name="star" size={16} className="shrink-0" />
                  厚生労働省 予防接種情報
                  <WatercolorIcon name="external" size={12} className="ml-auto .5 .5 shrink-0" />
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vaccines"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
            >
              <WatercolorIcon name="arrow_right" size={16} />
              予防接種一覧に戻る
            </Link>
            {relatedProgram && (
              <a
                href={relatedProgram.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-sage-700"
              >
                助成申請ページを開く
                <WatercolorIcon name="external" size={16} />
              </a>
            )}
          </div>

          <div className="rounded-xl border border-border bg-ivory-50 p-4">
            <p className="text-xs leading-relaxed text-muted">
              ※
              この情報は一般的な医学情報の提供を目的としており、個別の診断・治療を行うものではありません。
              接種時期や可否についてはかかりつけの小児科医にご相談ください。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
