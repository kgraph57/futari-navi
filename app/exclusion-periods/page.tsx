import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  Info,
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import exclusionPeriodsData from "@/data/exclusion-periods.json";
import { ExclusionCalculator } from "./exclusion-calculator";

export const metadata: Metadata = {
  title: "学校・保育園の出席停止期間一覧",
  description:
    "インフルエンザ、水痘、おたふくかぜなど感染症の出席停止期間を一覧でわかりやすく解説。学校保健安全法に基づく法定疾患と、保育園・幼稚園でよく適用される疾患を網羅。",
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Disease {
  readonly name: string;
  readonly reading?: string;
  readonly period: string;
  readonly note?: string;
}

const CLASS2_DISEASES: readonly Disease[] = exclusionPeriodsData.class2;
const CLASS3_DISEASES: readonly Disease[] = exclusionPeriodsData.class3;
const OTHER_DISEASES: readonly Disease[] = exclusionPeriodsData.other;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SectionBadgeProps {
  readonly label: string;
  readonly colorClass: string;
}

function SectionBadge({ label, colorClass }: SectionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${colorClass}`}
    >
      {label}
    </span>
  );
}

interface DiseaseCardProps {
  readonly disease: Disease;
  readonly index: number;
  readonly accentClass: string;
  readonly indexBgClass: string;
}

function DiseaseCard({
  disease,
  index,
  accentClass,
  indexBgClass,
}: DiseaseCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Index number */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white ${indexBgClass}`}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Name row */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="font-heading text-base font-semibold text-card-foreground">
            {disease.name}
          </h3>
          {disease.reading && disease.reading !== disease.name && (
            <span className="text-sm text-muted">（{disease.reading}）</span>
          )}
        </div>

        {/* Period */}
        <p
          className={`mt-2 text-sm font-medium leading-relaxed ${accentClass}`}
        >
          {disease.period}
        </p>

        {/* Note */}
        {disease.note && (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {disease.note}
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const JUMP_LINKS = [
  { href: "#calculator", label: "登園日を計算する" },
  { href: "#class2", label: "第二種感染症（法定）" },
  { href: "#class3", label: "第三種感染症（法定）" },
  { href: "#other", label: "その他の感染症" },
] as const;

export default function ExclusionPeriodsPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-gradient-to-b from-teal-50 to-ivory-50 px-4 pb-10 pt-10 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
            <ShieldAlert className="h-7 w-7 text-teal-600" />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            学校・保育園の出席停止期間
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
            感染症にかかったとき、いつから登校・登園できるか一覧でわかります。
            学校保健安全法に基づく法定疾患と、保育園・幼稚園でよく適用される疾患を網羅しています。
          </p>

          {/* Jump links */}
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {JUMP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Doctor's note                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-4 rounded-xl border border-teal-200 bg-teal-50/60 p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-600">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-teal-800">
                おかもん先生より
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                出席停止期間はお子さんを守るためだけでなく、クラスメートや周囲の方への感染拡大を防ぐための大切なルールです。
                ここに示す期間はあくまで目安です。
                <strong className="font-semibold text-teal-700">
                  登園・登校の最終判断は必ずかかりつけ医にご相談ください。
                </strong>
                お子さんの体調や検査結果によっては、期間が変わることがあります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Cross-link: infection-alerts                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="mx-auto max-w-4xl mb-2 px-4">
        <Link
          href="/infection-alerts"
          className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-3.5 text-sm transition-colors hover:bg-amber-100"
        >
          <span className="font-medium text-amber-800">
            今、港区で流行している感染症を確認する
          </span>
          <span className="text-amber-600">→</span>
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Calculator                                                          */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="calculator"
        className="scroll-mt-20 border-t border-border bg-teal-50/30 px-4 py-10 sm:py-16"
      >
        <div className="mx-auto max-w-3xl">
          <SectionHeading subtitle="発症日・解熱日を入れると登園可能日が自動で計算されます">
            登園可能日を計算する
          </SectionHeading>
          <div className="mt-8">
            <ExclusionCalculator />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 1: 第二種感染症                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="class2"
        className="scroll-mt-20 border-t border-border px-4 py-14"
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <SectionBadge
              label="学校保健安全法 第二種"
              colorClass="bg-teal-50 text-teal-700 ring-teal-200"
            />
            <SectionHeading
              subtitle="法律（学校保健安全法施行規則）で出席停止期間が定められている感染症です"
              align="left"
            >
              第二種感染症
            </SectionHeading>
          </div>

          <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
              <p className="text-sm leading-relaxed text-teal-800">
                第二種感染症は飛沫感染するもので、学校での感染拡大のリスクが高いため、
                出席停止期間が法令で規定されています。医師の診断に基づき判断してください。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {CLASS2_DISEASES.map((disease, index) => (
              <DiseaseCard
                key={disease.name}
                disease={disease}
                index={index}
                accentClass="text-teal-700"
                indexBgClass="bg-teal-500"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: 第三種感染症                                              */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="class3"
        className="scroll-mt-20 border-t border-border bg-blue-50/30 px-4 py-14"
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <SectionBadge
              label="学校保健安全法 第三種"
              colorClass="bg-blue-50 text-blue-700 ring-blue-200"
            />
            <SectionHeading
              subtitle="法令で規定された感染症ですが、出席停止期間は学校・園の判断に委ねられます"
              align="left"
            >
              第三種感染症
            </SectionHeading>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-sm leading-relaxed text-blue-800">
                第三種感染症は学校において流行を広げる可能性があるものとして規定されており、
                各学校が感染症の種類や蔓延状況に応じて出席停止の措置を判断します。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {CLASS3_DISEASES.map((disease, index) => (
              <DiseaseCard
                key={disease.name}
                disease={disease}
                index={index}
                accentClass="text-blue-700"
                indexBgClass="bg-blue-500"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: その他の感染症                                            */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="other"
        className="scroll-mt-20 border-t border-border px-4 py-14"
      >
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <SectionBadge
              label="学校・園の裁量"
              colorClass="bg-amber-50 text-amber-700 ring-amber-200"
            />
            <SectionHeading
              subtitle="法律上の規定はありませんが、多くの学校・保育園で登園停止が求められる疾患です"
              align="left"
            >
              その他のよくある感染症
            </SectionHeading>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-800">
                これらの疾患には学校保健安全法上の法的規定はありません。
                期間は各学校・保育園のルールや医師の判断によって異なります。
                必ず通っている施設のルールと、かかりつけ医の指示を確認してください。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {OTHER_DISEASES.map((disease, index) => (
              <DiseaseCard
                key={disease.name}
                disease={disease}
                index={index}
                accentClass="text-stone-700"
                indexBgClass="bg-stone-400"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom note + CTA                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-border bg-blush-50/40 px-4 py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Important note */}
          <div className="flex gap-4 rounded-xl border border-blush-200 bg-white p-5 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-100">
              <AlertTriangle className="h-5 w-5 text-blush-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-blush-800">
                登校・登園の判断は必ず主治医に確認してください
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                このページの情報は一般的な目安です。
                お子さんの状態や検査結果によって判断が変わることがあります。
                心配なときは症状から受診の緊急度を確認できます。
              </p>
              <Link
                href="/triage"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blush-600"
              >
                受診判断トリアージ
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Source */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <div>
                <p className="text-xs font-semibold text-foreground">
                  参考・出典
                </p>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted">
                  <li>
                    学校保健安全法施行規則（文部科学省）第18条・第19条・別表
                  </li>
                  <li>
                    <a
                      href="https://www.mext.go.jp/a_menu/kenko/hoken/1353344.htm"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-600 underline-offset-2 hover:underline"
                    >
                      文部科学省「学校において予防すべき感染症の解説」
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.niid.go.jp/niid/ja/route/school.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-600 underline-offset-2 hover:underline"
                    >
                      国立感染症研究所「学校における感染症対策」
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
