import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCheckups,
  getCheckupBySlug,
  CHECKUP_VENUE_LABELS,
  CHECKUP_VENUE_COLORS,
} from "@/lib/checkups";
import type { Checkup } from "@/lib/types";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const checkups = getAllCheckups();
  return checkups.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const checkup = getCheckupBySlug(slug);
  if (!checkup) return { title: "健診が見つかりません" };
  return {
    title: `${checkup.name}の内容と準備`,
    description: checkup.description,
  };
}

export default async function CheckupDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const checkup = getCheckupBySlug(slug);

  if (!checkup) {
    notFound();
  }

  const venueColorClass =
    CHECKUP_VENUE_COLORS[checkup.venue] ??
    "bg-gray-50 text-gray-700 border-gray-200";

  const nextCheckupData: Checkup | null = checkup.nextCheckup
    ? getCheckupBySlug(checkup.nextCheckup)
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/checkups"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            健診一覧に戻る
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${venueColorClass}`}
            >
              <WatercolorIcon name="stethoscope" size={24} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${venueColorClass}`}
                >
                  {CHECKUP_VENUE_LABELS[checkup.venue]}
                </span>
                <span className="inline-flex rounded-full border border-sage-200 bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-700">
                  {checkup.cost}
                </span>
                {checkup.isMandatory ? (
                  <span className="inline-flex rounded-full border border-blush-200 bg-blush-50 px-2.5 py-0.5 text-xs font-medium text-blush-600">
                    必須
                  </span>
                ) : (
                  <span className="inline-flex rounded-full border border-border bg-ivory-50 px-2.5 py-0.5 text-xs font-medium text-muted">
                    任意
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                {checkup.name}
              </h1>
              <p className="mt-1 text-sm text-muted">{checkup.ageLabel}</p>
            </div>
          </div>

          <p className="mt-4 text-base leading-relaxed text-muted">
            {checkup.description}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* What Doctor Checks Section */}
          {checkup.whatDoctorChecks.length > 0 && (
            <div
              id="doctor-checks"
              className="scroll-mt-20 rounded-xl border border-border bg-card p-6"
            >
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="stethoscope" size={20} className="text-sage-600" />
                医師のチェックポイント
              </h2>
              <div className="mt-4 space-y-0 divide-y divide-border">
                {checkup.whatDoctorChecks.map((check, i) => (
                  <div
                    key={i}
                    className={`py-5 first:pt-0 last:pb-0 ${
                      i % 2 === 1 ? "bg-ivory-50 -mx-6 px-6" : ""
                    }`}
                  >
                    <h3 className="text-sm font-bold text-card-foreground">
                      {check.area}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {check.detail}
                    </p>
                    <div className="mt-3 rounded-lg border border-sage-200 bg-sage-50 p-4">
                      <div className="flex items-start gap-2">
                        <WatercolorIcon name="stethoscope" size={16} className="mt-0.5   shrink-0 text-sage-600" />
                        <div>
                          <p className="text-xs font-bold text-sage-700">
                            おかもん先生のひとこと
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-sage-800">
                            {check.doctorNote}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preparation Section */}
          {checkup.preparation.length > 0 && (
            <div
              id="preparation"
              className="scroll-mt-20 rounded-xl border border-border bg-card p-6"
            >
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="star" size={20} className="text-sage-600" />
                持ち物・準備リスト
              </h2>
              <ul className="mt-4 space-y-4">
                {checkup.preparation.map((prep, i) => (
                  <li key={i} className="flex gap-3">
                    <WatercolorIcon name="check" size={20} className="mt-0.5   shrink-0 text-sage-500" />
                    <div>
                      <p className="text-sm font-bold text-card-foreground">
                        {prep.item}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted">
                        {prep.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ Section */}
          {checkup.faq.length > 0 && (
            <div
              id="faq"
              className="scroll-mt-20 rounded-xl border border-border bg-card p-6"
            >
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="help" size={20} className="text-sage-600" />
                よくある質問
              </h2>
              <div className="mt-4 space-y-5">
                {checkup.faq.map((item, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-card-foreground">
                      Q. {item.question}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      A. {item.answer}
                    </p>
                    {item.actionUrl != null && (
                      <Link
                        href={item.actionUrl}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sage-50 px-4 py-1.5 text-xs font-medium text-sage-700 transition-colors hover:bg-sage-100"
                      >
                        {item.actionLabel ?? "詳細を見る"}
                        <WatercolorIcon name="arrow_right" size={12} />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips Section */}
          {checkup.tips.length > 0 && (
            <div
              id="tips"
              className="scroll-mt-20 rounded-xl border border-border bg-card p-6"
            >
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="lightbulb" size={20} className="text-sage-600" />
                ワンポイントアドバイス
              </h2>
              <ul className="mt-4 space-y-3">
                {checkup.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <WatercolorIcon name="shield" size={16} className="mt-0.5   shrink-0 text-sage-500" />
                    <p className="text-sm leading-relaxed text-card-foreground">
                      {tip}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Official URL Link */}
          {checkup.officialUrl != null && (
            <a
              href={checkup.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-sage-200 bg-white px-6 py-3.5 text-base font-bold text-sage-600 shadow-sm transition-colors hover:bg-sage-50"
            >
              <WatercolorIcon name="external" size={20} />
              港区公式ページで詳細を見る
            </a>
          )}

          {/* Developmental Support CTA (5-year checkup only) */}
          {checkup.slug === "5year" && (
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-amber-900">
                <WatercolorIcon name="help" size={20} className="text-amber-600" />
                発達が気になったら
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-amber-800">
                健診で「経過観察」と言われた場合や、日頃からお子さんの発達に気になることがある場合は、港区の児童発達支援センター「ぱお」にご相談ください。心理士・作業療法士・言語聴覚士などの専門職が、お子さんの状況を評価し、必要な支援を一緒に考えてくれます。
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:03-6277-3903"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                >
                  <WatercolorIcon name="phone" size={16} />
                  ぱおに電話する（03-6277-3903）
                </a>
                <Link
                  href="/programs/child-development-support"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-white px-5 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
                >
                  詳細を見る
                  <WatercolorIcon name="arrow_right" size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* Next Checkup CTA */}
          {nextCheckupData && (
            <Link
              href={`/checkups/${nextCheckupData.slug}`}
              className="flex items-center justify-between rounded-xl border border-sage-200 bg-sage-50 p-5 transition-colors hover:bg-sage-100"
            >
              <div>
                <p className="text-xs font-medium text-sage-600">次の健診</p>
                <p className="mt-1 font-heading text-base font-semibold text-sage-800">
                  {nextCheckupData.name}
                </p>
                <p className="mt-0.5 text-sm text-sage-600">
                  {nextCheckupData.ageLabel}
                </p>
              </div>
              <WatercolorIcon name="arrow_right" size={20} className="shrink-0 text-sage-600" />
            </Link>
          )}

          {/* Navigation Footer */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/checkups"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
            >
              <WatercolorIcon name="arrow_right" size={16} />
              健診一覧に戻る
            </Link>
            <Link
              href="/clinics"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-sage-700"
            >
              医療機関を探す
              <WatercolorIcon name="arrow_right" size={16} />
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-border bg-ivory-50 p-4">
            <p className="text-xs leading-relaxed text-muted">
              ※
              この情報は一般的な医学情報の提供を目的としており、個別の診断・治療を行うものではありません。
              健診の時期や内容についてはかかりつけの小児科医にご相談ください。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
