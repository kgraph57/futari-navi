import type { Metadata } from "next";
import Link from "next/link";
import {
  ExternalLink,
  Stethoscope,
  Calendar,
  ShieldAlert,
  Globe,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { AlertsClient } from "./alerts-client";

export const metadata: Metadata = {
  title: "感染症アラート・流行情報",
  description:
    "東京・港区で今流行している感染症の情報。季節ごとの感染症リスク、リアルタイム情報へのリンク、インフルエンザ・RSウイルス・手足口病などの最新動向。",
};

// ---------------------------------------------------------------------------
// Seasonal disease data
// ---------------------------------------------------------------------------

export type DiseaseSeverity = "high" | "medium";
export type DiseaseColor =
  | "red"
  | "orange"
  | "yellow"
  | "blue"
  | "purple"
  | "pink";

export interface SeasonalDisease {
  readonly name: string;
  readonly slug: string;
  readonly peakMonths: readonly number[];
  readonly warningMonths: readonly number[];
  readonly severity: DiseaseSeverity;
  readonly description: string;
  readonly icon: string;
  readonly color: DiseaseColor;
  readonly articleSlug: string | null;
}

export const SEASONAL_DISEASES: readonly SeasonalDisease[] = [
  {
    name: "インフルエンザ",
    slug: "influenza",
    peakMonths: [12, 1, 2, 3],
    warningMonths: [11, 4],
    severity: "high",
    description:
      "毎年12月〜2月に流行のピーク。38℃以上の急な発熱と全身倦怠感が特徴。",
    icon: "thermometer",
    color: "red",
    articleSlug: "influenza-basics",
  },
  {
    name: "RSウイルス感染症",
    slug: "rsv",
    peakMonths: [9, 10, 11, 12],
    warningMonths: [8, 1],
    severity: "high",
    description: "乳幼児に重篤な呼吸器症状を起こすことがある。秋〜冬に流行。",
    icon: "wind",
    color: "orange",
    articleSlug: "rsv-and-bronchiolitis",
  },
  {
    name: "手足口病",
    slug: "hfmd",
    peakMonths: [6, 7, 8],
    warningMonths: [5, 9],
    severity: "medium",
    description: "夏季に流行。手・足・口の発疹が特徴。5歳未満に多い。",
    icon: "hand",
    color: "yellow",
    articleSlug: "hand-foot-mouth-disease",
  },
  {
    name: "ヘルパンギーナ",
    slug: "herpangina",
    peakMonths: [6, 7, 8],
    warningMonths: [5],
    severity: "medium",
    description: "夏の三大感染症のひとつ。口の奥に水疱ができ、高熱が出る。",
    icon: "flame",
    color: "orange",
    articleSlug: "herpangina",
  },
  {
    name: "咽頭結膜熱（プール熱）",
    slug: "pharyngoconjunctival-fever",
    peakMonths: [6, 7, 8],
    warningMonths: [5, 9],
    severity: "medium",
    description: "アデノウイルスによる夏風邪。発熱・結膜炎・咽頭炎の三徴候。",
    icon: "eye",
    color: "yellow",
    articleSlug: "adenovirus",
  },
  {
    name: "溶連菌感染症",
    slug: "strep",
    peakMonths: [3, 4, 5, 11, 12],
    warningMonths: [2, 6, 10],
    severity: "medium",
    description: "春と初冬に多い。のどの痛みと高熱。抗菌薬で早期治癒できる。",
    icon: "alert-circle",
    color: "purple",
    articleSlug: "strep-throat",
  },
  {
    name: "ノロウイルス感染症",
    slug: "norovirus",
    peakMonths: [11, 12, 1, 2],
    warningMonths: [10, 3],
    severity: "medium",
    description: "冬季の嘔吐下痢症。感染力が非常に強い。脱水に注意。",
    icon: "droplets",
    color: "blue",
    articleSlug: "norovirus-basics",
  },
  {
    name: "水痘（みずぼうそう）",
    slug: "chickenpox",
    peakMonths: [12, 1, 2, 3, 4],
    warningMonths: [11, 5],
    severity: "medium",
    description: "冬〜春に流行。水疱性の発疹が全身に出る。ワクチンで予防可能。",
    icon: "circle-dot",
    color: "pink",
    articleSlug: "chickenpox",
  },
] as const;

// ---------------------------------------------------------------------------
// Month labels for the calendar
// ---------------------------------------------------------------------------

const MONTH_LABELS = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
] as const;

// ---------------------------------------------------------------------------
// Official sources
// ---------------------------------------------------------------------------

const OFFICIAL_SOURCES = [
  {
    name: "東京都感染症情報センター",
    description: "東京都内の感染症発生状況をリアルタイムで公開",
    url: "https://idsc.tmiph.metro.tokyo.lg.jp/",
    domain: "idsc.tmiph.metro.tokyo.lg.jp",
    color: "blue",
  },
  {
    name: "国立感染症研究所 感染症週報",
    description: "全国の感染症サーベイランス情報（週単位で更新）",
    url: "https://www.niid.go.jp/niid/ja/idwr.html",
    domain: "www.niid.go.jp",
    color: "purple",
  },
  {
    name: "港区保健センター（みなと保健所）",
    description: "港区内の感染症情報・保健センターからの注意喚起",
    url: "https://www.city.minato.tokyo.jp/hokenyobou/doukou/",
    domain: "www.city.minato.tokyo.jp",
    color: "sage",
  },
  {
    name: "こどもの感染症情報（小児科学会）",
    description: "日本小児科学会による小児感染症の最新情報",
    url: "https://www.jpeds.or.jp/",
    domain: "www.jpeds.or.jp",
    color: "blush",
  },
] as const;

// ---------------------------------------------------------------------------
// Color helpers (server-safe, no dynamic class generation)
// ---------------------------------------------------------------------------

function getSourceIconColor(color: string): string {
  const map: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    sage: "bg-sage-50 text-sage-600 border-sage-200",
    blush: "bg-blush-50 text-blush-500 border-blush-200",
  };
  return map[color] ?? "bg-gray-50 text-gray-600 border-gray-200";
}

function getSourceLinkColor(color: string): string {
  const map: Record<string, string> = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    sage: "text-sage-600",
    blush: "text-blush-500",
  };
  return map[color] ?? "text-gray-600";
}

// ---------------------------------------------------------------------------
// Annual calendar section (server component)
// ---------------------------------------------------------------------------

function DiseaseCalendarRow({
  disease,
}: {
  readonly disease: SeasonalDisease;
}) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="w-36 shrink-0 text-xs font-medium text-foreground sm:w-44">
        {disease.name}
      </div>
      <div className="flex flex-1 gap-0.5">
        {months.map((month) => {
          const isPeak = disease.peakMonths.includes(month);
          const isWarning = disease.warningMonths.includes(month);
          let cellClass = "h-5 flex-1 rounded-sm transition-colors";
          if (isPeak) {
            cellClass +=
              disease.severity === "high" ? " bg-red-400" : " bg-orange-300";
          } else if (isWarning) {
            cellClass +=
              disease.severity === "high" ? " bg-red-100" : " bg-orange-100";
          } else {
            cellClass += " bg-ivory-100";
          }
          return <div key={month} className={cellClass} title={`${month}月`} />;
        })}
      </div>
    </div>
  );
}

function SeasonalCalendar() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px]">
        {/* Month header */}
        <div className="flex items-center gap-2 pb-2">
          <div className="w-36 shrink-0 sm:w-44" />
          <div className="flex flex-1 gap-0.5">
            {MONTH_LABELS.map((label) => (
              <div
                key={label}
                className="flex-1 text-center text-xs text-muted"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Disease rows */}
        {SEASONAL_DISEASES.map((disease) => (
          <DiseaseCalendarRow key={disease.slug} disease={disease} />
        ))}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-6 rounded-sm bg-red-400" />
            <span>流行ピーク（重症度：高）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-6 rounded-sm bg-orange-300" />
            <span>流行ピーク（重症度：中）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-6 rounded-sm bg-red-100" />
            <span>注意期間（高）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-6 rounded-sm bg-orange-100" />
            <span>注意期間（中）</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-6 rounded-sm bg-ivory-100 border border-border" />
            <span>通常期</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Disease detail cards (server component)
// ---------------------------------------------------------------------------

function DiseaseDetailCard({ disease }: { readonly disease: SeasonalDisease }) {
  const peakLabel = disease.peakMonths.map((m) => `${m}月`).join("・");

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ivory-100">
          <ShieldAlert className="h-4.5 w-4.5 text-muted" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-card-foreground">
              {disease.name}
            </h3>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                disease.severity === "high"
                  ? "bg-red-50 text-red-700 ring-red-200"
                  : "bg-orange-50 text-orange-700 ring-orange-200"
              }`}
            >
              {disease.severity === "high" ? "重症度：高" : "重症度：中"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            流行時期：{peakLabel}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {disease.description}
          </p>
          {disease.articleSlug && (
            <Link
              href={`/articles/${disease.articleSlug}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
            >
              <BookOpen className="h-3 w-3" />
              詳しい記事を読む
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page (server component)
// ---------------------------------------------------------------------------

export default function InfectionAlertsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blush-50 to-ivory-50 px-4 pb-10 pt-10 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blush-100">
            <ShieldAlert className="h-7 w-7 text-blush-500" />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            感染症アラート・流行情報
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            今の季節に注意すべき感染症と、リアルタイムの公式情報へのリンクをまとめています。
          </p>

          {/* Jump links */}
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { href: "#current-alerts", label: "今月のアラート" },
              { href: "#calendar", label: "年間カレンダー" },
              { href: "#official-sources", label: "公式情報" },
              { href: "#diseases", label: "疾患別詳細" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-blush-200 bg-white px-4 py-2 text-sm font-medium text-blush-600 transition-colors hover:bg-blush-50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Doctor's note */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-4 rounded-xl border border-sage-200 bg-sage-50/50 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-600">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-sage-800">
                おかもん先生より
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                感染症には「流行の季節」があります。シーズン前に正しい知識を持ち、
                手洗い・うがい・ワクチンで予防することが大切です。
                このページは季節の傾向を示すものです。実際の発生状況は下記の公式情報でご確認ください。
                症状が出た場合は、かかりつけの小児科を受診してください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Alerts — client component for dynamic month */}
      <section
        id="current-alerts"
        className="scroll-mt-20 border-t border-border bg-ivory-100/50 px-4 py-16"
      >
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            subtitle="現在の月に基づいた感染症リスク（端末の時刻から自動計算）"
            align="left"
          >
            今月の感染症アラート
          </SectionHeading>
          <div className="mt-8">
            <AlertsClient diseases={SEASONAL_DISEASES} />
          </div>
        </div>
      </section>

      {/* Annual Calendar */}
      <section id="calendar" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            subtitle="東京での感染症の流行時期の目安です（年によって変動あり）"
            align="left"
          >
            年間の感染症カレンダー
          </SectionHeading>
          <div className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
            <SeasonalCalendar />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            ※
            過去の傾向に基づく目安です。実際の流行状況は気候・年度により異なります。
            最新情報は東京都感染症情報センターでご確認ください。
          </p>
        </div>
      </section>

      {/* Official Sources */}
      <section
        id="official-sources"
        className="scroll-mt-20 border-t border-border bg-ivory-100/50 px-4 py-16"
      >
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            subtitle="リアルタイムの発生状況は公式機関でご確認ください"
            align="left"
          >
            リアルタイム情報へのリンク
          </SectionHeading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {OFFICIAL_SOURCES.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getSourceIconColor(source.color)}`}
                >
                  <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-sm font-semibold text-card-foreground group-hover:text-sage-700">
                    {source.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {source.description}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${getSourceLinkColor(source.color)}`}
                  >
                    {source.domain}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Disease Details */}
      <section id="diseases" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            subtitle="各感染症の流行時期・特徴・関連記事"
            align="left"
          >
            感染症ごとの詳細
          </SectionHeading>

          <div className="mt-8 space-y-3">
            {SEASONAL_DISEASES.map((disease) => (
              <DiseaseDetailCard key={disease.slug} disease={disease} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/triage"
              className="flex flex-1 items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-red-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-card-foreground">
                  受診すべき？判断に迷ったら
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  症状を入力して受診判断を確認
                </p>
              </div>
            </Link>
            <Link
              href="/vaccines"
              className="flex flex-1 items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-sage-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-card-foreground">
                  予防接種でウイルスを防ぐ
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  インフルエンザ・水痘ワクチンのガイド
                </p>
              </div>
            </Link>
            <Link
              href="/exclusion-periods"
              className="flex flex-1 items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-teal-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-card-foreground">
                  出席停止期間を確認する
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  学校・保育園の登園停止ルール一覧
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
