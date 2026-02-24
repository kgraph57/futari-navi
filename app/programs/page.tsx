import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { WatercolorIconName } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import {
  getAllPrograms,
  PROGRAM_CATEGORY_LABELS,
  PROGRAM_CATEGORY_ORDER,
} from "@/lib/programs";
import type { Program } from "@/lib/types";

export const metadata: Metadata = {
  title: "制度一覧",
  description:
    "港区の子育て支援制度・給付金・助成金の一覧。医療費助成、児童手当、産後ケア、一時保育など17の制度をまとめて確認できます。",
};

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

const CATEGORY_HEADER_COLOR_MAP: Record<string, string> = {
  medical: "text-red-600",
  financial: "text-sage-600",
  childcare: "text-blue-600",
  support: "text-purple-600",
};

function formatAgeRange(program: Program): string {
  const { minAge, maxAge } = program.eligibility;
  if (minAge === null && maxAge === null) return "制限なし";
  if (minAge === null && maxAge !== null) return `${maxAge}歳まで`;
  if (minAge !== null && maxAge === null) return `${minAge}歳以上`;
  return `${minAge}歳〜${maxAge}歳`;
}

function getApplicationMethodLabel(program: Program): string | null {
  if (!program.applicationMethods || program.applicationMethods.length === 0)
    return null;
  return program.applicationMethods.map((m) => m.label).join(" / ");
}

function ProgramCard({ program }: { readonly program: Program }) {
  const colorClass =
    CATEGORY_COLOR_MAP[program.category] ??
    "bg-gray-50 text-gray-600 border-gray-200";
  const iconName = CATEGORY_ICON_MAP[program.category] ?? "heart";
  const ageRange = formatAgeRange(program);
  const methodLabel = getApplicationMethodLabel(program);

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${colorClass}`}
      >
        <WatercolorIcon name={iconName} size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-base font-semibold text-card-foreground">
          {program.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
          {program.description}
        </p>
        {program.amount.description && (
          <p className="mt-2 text-xs font-medium text-sage-600">
            {program.amount.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <WatercolorIcon name="user" size={10} />
            {ageRange}
          </span>
          {methodLabel && (
            <span className="inline-flex items-center gap-1">
              <WatercolorIcon name="clipboard" size={10} />
              {methodLabel}
            </span>
          )}
          {program.eligibility.residency === "minato" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600">
              港区限定
            </span>
          )}
        </div>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          詳細を見る
          <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </div>
    </Link>
  );
}

// Programs commonly applied for (high priority for most families)
const RECOMMENDED_SLUGS = [
  "child-allowance",
  "child-medical-subsidy",
  "birth-childcare-grant",
  "childbirth-lump-sum",
  "infant-health-checkup",
] as const;

export default function ProgramsPage() {
  const allPrograms = getAllPrograms();

  const recommendedPrograms = RECOMMENDED_SLUGS.map((slug) =>
    allPrograms.find((p) => p.slug === slug),
  ).filter((p): p is Program => p !== undefined);

  const programsByCategory = PROGRAM_CATEGORY_ORDER.map((category) => ({
    category,
    label: PROGRAM_CATEGORY_LABELS[category],
    programs: allPrograms.filter((p) => p.category === category),
  }));

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            港区の子育て支援制度
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            港区で利用できる子育て支援制度・給付金・助成金をカテゴリ別にまとめました。全
            {allPrograms.length}制度を確認できます。
          </p>
          <Link
            href="/simulator/start"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blush-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blush-600"
          >
            <WatercolorIcon name="calculator" size={16} />
            あなたの対象制度を調べる
          </Link>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 rounded-xl border border-sage-200 bg-sage-50/40 p-6">
            <div className="flex items-center gap-2">
              <WatercolorIcon
                name="sparkles"
                size={20}
                className="text-sage-600"
              />
              <h2 className="font-heading text-lg font-semibold text-foreground">
                よく申請されています
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted">
              ほとんどの子育て家庭が利用する基本的な制度です。まずはこちらを確認しましょう。
            </p>
            <div className="mt-4 space-y-3">
              {recommendedPrograms.map((program) => (
                <ProgramCard key={program.slug} program={program} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:pb-16">
        <div className="mx-auto max-w-4xl">
          {programsByCategory.map(({ category, label, programs }) => {
            if (programs.length === 0) return null;
            const iconName = CATEGORY_ICON_MAP[category] ?? "heart";
            const headerColor =
              CATEGORY_HEADER_COLOR_MAP[category] ?? "text-gray-600";

            return (
              <div key={category} className="mb-12 last:mb-0">
                <div className="flex items-center gap-3">
                  <WatercolorIcon
                    name={iconName}
                    size={24}
                    className={headerColor}
                  />
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    {label}
                  </h2>
                  <span className="rounded-full bg-ivory-200 px-2 py-0.5 text-xs font-medium text-muted">
                    {programs.length}件
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {programs.map((program) => (
                    <ProgramCard key={program.slug} program={program} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
