import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPrograms,
  getProgramBySlug,
  PROGRAM_CATEGORY_LABELS,
} from "@/lib/programs";
import type { Program } from "@/lib/types";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programs = getAllPrograms();
  return programs.map((program) => ({
    slug: program.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return { title: "制度が見つかりません" };

  return {
    title: program.name,
    description: program.description,
  };
}

import type { WatercolorIconName } from "@/components/icons/watercolor-icon";

const CATEGORY_ICON_MAP: Record<string, WatercolorIconName> = {
  medical: "heart",
  financial: "calculator",
  childcare: "baby",
  support: "users",
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  medical: "bg-red-50 text-red-600 border-red-200",
  financial: "bg-sage-50 text-sage-600 border-sage-200",
  childcare: "bg-blue-50 text-blue-600 border-blue-200",
  support: "bg-purple-50 text-purple-600 border-purple-200",
};

function formatAgeRange(program: Program): string {
  const { minAge, maxAge } = program.eligibility;
  if (minAge === null && maxAge === null) return "制限なし";
  if (minAge === null && maxAge !== null) return `${maxAge}歳まで`;
  if (minAge !== null && maxAge === null) return `${minAge}歳以上`;
  return `${minAge}歳〜${maxAge}歳`;
}

function formatResidency(residency: string): string {
  switch (residency) {
    case "minato":
      return "港区在住";
    case "tokyo":
      return "東京都在住";
    case "japan":
      return "日本国内";
    default:
      return residency;
  }
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const allPrograms = getAllPrograms();
  const relatedPrograms = (program.relatedProgramSlugs ?? [])
    .map((s) => allPrograms.find((p) => p.slug === s))
    .filter((p): p is Program => p !== undefined);

  const categoryLabel = PROGRAM_CATEGORY_LABELS[program.category];
  const colorClass =
    CATEGORY_COLOR_MAP[program.category] ??
    "bg-gray-50 text-gray-600 border-gray-200";
  const iconName = CATEGORY_ICON_MAP[program.category] ?? "heart";

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            制度一覧に戻る
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}
            >
              <WatercolorIcon name={iconName} size={24} />
            </div>
            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
              >
                {categoryLabel}
              </span>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                {program.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 text-base leading-relaxed text-muted">
            {program.description}
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="user" size={20} className="text-sage-600" />
              対象者
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-sm font-medium text-muted">
                  年齢
                </span>
                <span className="text-sm text-card-foreground">
                  {formatAgeRange(program)}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-sm font-medium text-muted">
                  居住要件
                </span>
                <span className="text-sm text-card-foreground">
                  {formatResidency(program.eligibility.residency)}
                </span>
              </div>
              {program.eligibility.incomeLimit !== null && (
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-sm font-medium text-muted">
                    所得制限
                  </span>
                  <span className="text-sm text-card-foreground">
                    {program.eligibility.incomeLimit.toLocaleString()}円
                  </span>
                </div>
              )}
              {program.eligibility.incomeLimit === null && (
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-sm font-medium text-muted">
                    所得制限
                  </span>
                  <span className="text-sm font-medium text-sage-600">
                    なし
                  </span>
                </div>
              )}
              {program.eligibility.conditions.length > 0 && (
                <div className="flex items-start gap-3">
                  <span className="shrink-0 text-sm font-medium text-muted">
                    条件
                  </span>
                  <ul className="space-y-1">
                    {program.eligibility.conditions.map((condition) => (
                      <li
                        key={condition}
                        className="text-sm text-card-foreground"
                      >
                        ・{condition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="star" size={20} className="text-sage-600" />
              支給額・内容
            </h2>
            <div className="mt-4">
              <p className="text-sm leading-relaxed text-card-foreground">
                {program.amount.description}
              </p>
              {program.amount.value !== null && program.amount.value > 0 && (
                <div className="mt-3 inline-flex items-baseline gap-1 rounded-lg bg-sage-50 px-4 py-2">
                  <span className="text-sm text-sage-700">
                    {program.amount.unit === "yen-per-month" ? "月額" : "金額"}
                  </span>
                  <span className="font-heading text-2xl font-semibold text-sage-700">
                    {program.amount.value.toLocaleString()}円
                  </span>
                  {program.amount.unit === "yen-per-month" && (
                    <span className="text-sm text-sage-600">/月</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {(program.deadline ?? program.processingTime) && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="calendar" size={20} className="text-sage-600" />
                申請期限・処理期間
              </h2>
              <div className="mt-3 space-y-3">
                {program.deadline && (
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 text-sm font-medium text-muted">
                      期限
                    </span>
                    <span className="text-sm text-card-foreground">
                      {program.deadline}
                    </span>
                  </div>
                )}
                {program.processingTime && (
                  <div className="flex items-start gap-3">
                    <WatercolorIcon name="clock" size={16} className="mt-0.5   shrink-0 text-sage-500" />
                    <span className="text-sm text-card-foreground">
                      {program.processingTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {program.notes && (
            <div className="rounded-xl border border-blush-200 bg-blush-50 p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-blush-600">
                <WatercolorIcon name="star" size={20} />
                注意事項
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-blush-600">
                {program.notes}
              </p>
            </div>
          )}

          {program.applicationSteps && program.applicationSteps.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="star" size={20} className="text-sage-600" />
                申請の流れ
              </h2>
              <ol className="mt-4 space-y-4">
                {program.applicationSteps.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-bold text-sage-700">
                      {step.step}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-card-foreground">
                        {step.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {step.description}
                      </p>
                      {step.tip && (
                        <p className="mt-1 rounded bg-sage-50 px-2 py-1 text-xs text-sage-700">
                          💡 {step.tip}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {program.requiredDocuments &&
            program.requiredDocuments.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                  <WatercolorIcon name="star" size={20} className="text-sage-600" />
                  必要書類
                </h2>
                <ul className="mt-4 space-y-3">
                  {program.requiredDocuments.map((doc) => (
                    <li
                      key={doc.name}
                      className="flex items-start gap-3 rounded-lg border border-border bg-ivory-50 p-3"
                    >
                      <WatercolorIcon name="check" size={16} className="mt-0.5   shrink-0 text-sage-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">
                          {doc.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {doc.obtainHow}
                        </p>
                        {doc.notes && (
                          <p className="mt-0.5 text-xs text-blush-600">
                            ※ {doc.notes}
                          </p>
                        )}
                        {doc.downloadUrl && (
                          <a
                            href={doc.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-sage-600 underline hover:text-sage-700"
                          >
                            ダウンロード
                            <WatercolorIcon name="external" size={12} />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {program.applicationMethods &&
            program.applicationMethods.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                  <WatercolorIcon name="building" size={20} className="text-sage-600" />
                  申請方法
                </h2>
                <div className="mt-4 space-y-3">
                  {program.applicationMethods.map((method) => {
                    const methodIconName =
                      method.method === "online"
                        ? "external"
                        : method.method === "mail"
                          ? "mail"
                          : "building";
                    return (
                      <div
                        key={method.method}
                        className="rounded-lg border border-border p-4"
                      >
                        <div className="flex items-center gap-2">
                          <WatercolorIcon name={methodIconName} size={16} />
                          <span className="text-sm font-medium text-card-foreground">
                            {method.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted">
                          {method.description}
                        </p>
                        {method.url && (
                          <a
                            href={method.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
                          >
                            申請ページへ
                            <WatercolorIcon name="external" size={12} />
                          </a>
                        )}
                        {method.address && (
                          <p className="mt-1 text-xs text-muted">
                            📍 {method.address}
                          </p>
                        )}
                        {method.hours && (
                          <p className="mt-0.5 text-xs text-muted">
                            🕐 {method.hours}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {program.faq && program.faq.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                <WatercolorIcon name="help" size={20} className="text-sage-600" />
                よくある質問
              </h2>
              <div className="mt-4 space-y-4">
                {program.faq.map((item) => (
                  <div
                    key={item.question}
                    className="border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <p className="text-sm font-medium text-card-foreground">
                      Q. {item.question}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      A. {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedPrograms.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
                関連する制度
              </h2>
              <div className="mt-4 space-y-2">
                {relatedPrograms.map((rp) => {
                  const rpColor =
                    CATEGORY_COLOR_MAP[rp.category] ??
                    "bg-gray-50 text-gray-600 border-gray-200";
                  const rpIconName = CATEGORY_ICON_MAP[rp.category] ?? "heart";
                  return (
                    <Link
                      key={rp.slug}
                      href={`/programs/${rp.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-sage-200 hover:bg-sage-50/50"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${rpColor}`}
                      >
                        <WatercolorIcon name={rpIconName} size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-card-foreground">
                          {rp.name}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {rp.amount.description}
                        </p>
                      </div>
                      <WatercolorIcon name="arrow_right" size={16} className="shrink-0 text-muted" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={program.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-sage-700"
            >
              申請ページを開く
              <WatercolorIcon name="external" size={16} />
            </a>
            <Link
              href="/simulator/start"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
            >
              <WatercolorIcon name="calculator" size={16} />
              シミュレーションする
            </Link>
          </div>

          <div className="pt-4">
            <Link
              href="/programs"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
            >
              <WatercolorIcon name="arrow_right" size={16} />
              制度一覧に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
