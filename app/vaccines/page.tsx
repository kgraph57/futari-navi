import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Image from "next/image";
import Link from "next/link";
import {
  getAllVaccines,
  getRoutineVaccines,
  getOptionalVaccines,
  VACCINE_TYPE_LABELS,
  VACCINE_TYPE_COLORS,
  formatAgeMonths,
} from "@/lib/vaccines";
import {
  getVaccinationSteps,
  getVaccinationFaqs,
  getVaccinationEvidence,
} from "@/lib/vaccinations";
import { getArticlesByCategory } from "@/lib/content";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScheduleTable } from "@/components/vaccination/schedule-table";
import { StepsGuide } from "@/components/vaccination/steps-guide";
import { FaqSection } from "@/components/vaccination/faq-section";
import { EvidenceSection } from "@/components/vaccination/evidence-section";
import { Badge } from "@/components/shared/badge";
import type { Vaccine } from "@/lib/types";
import { withBasePath } from "@/lib/image-path";

export const metadata: Metadata = {
  title: "予防接種ガイド",
  description:
    "港区の予防接種スケジュール、接種の手順、よくある質問、科学的エビデンスをまとめた総合ガイド。小児科医おかもんが解説します。",
};

const JUMP_LINKS = [
  { href: "#schedule", iconName: "calendar" as const, label: "スケジュール" },
  { href: "#vaccines", iconName: "syringe" as const, label: "ワクチン一覧" },
  { href: "#steps", iconName: "mappin" as const, label: "港区での手順" },
  { href: "#faq", iconName: "help" as const, label: "よくある質問" },
  { href: "#evidence", iconName: "shield" as const, label: "エビデンス" },
] as const;

function VaccineCard({ vaccine }: { readonly vaccine: Vaccine }) {
  const colorClass =
    VACCINE_TYPE_COLORS[vaccine.type] ??
    "bg-gray-50 text-gray-700 border-gray-200";
  const firstDose = vaccine.doses[0];
  const lastDose = vaccine.doses[vaccine.doses.length - 1];

  return (
    <Link
      href={`/vaccines/${vaccine.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${colorClass}`}
      >
        <WatercolorIcon name="syringe" size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-card-foreground">
            {vaccine.name}
          </h3>
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {VACCINE_TYPE_LABELS[vaccine.type]}
          </span>
          {vaccine.relatedProgramSlug && (
            <span className="inline-flex rounded-full border border-blush-200 bg-blush-50 px-2 py-0.5 text-xs font-medium text-blush-600">
              港区助成あり
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted">{vaccine.disease}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
          {vaccine.description}
        </p>
        {firstDose && (
          <p className="mt-2 text-xs font-medium text-sage-600">
            接種時期:{" "}
            {vaccine.doses.length === 1
              ? formatAgeMonths(firstDose.ageMonthsStandard)
              : `${formatAgeMonths(firstDose.ageMonthsStandard)}〜${formatAgeMonths(lastDose.ageMonthsStandard)}`}{" "}
            ／ 計{vaccine.doses.length}回
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          詳細・接種スケジュール
          <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </div>
    </Link>
  );
}

export default function VaccinesPage() {
  const routineVaccines = getRoutineVaccines();
  const optionalVaccines = getOptionalVaccines();
  const allVaccines = getAllVaccines();
  const steps = getVaccinationSteps();
  const faqs = getVaccinationFaqs();
  const evidence = getVaccinationEvidence();
  const vaccinationArticles = getArticlesByCategory("vaccination");

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-10 pt-10 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-center sm:gap-8">
            {/* キャラクター左 */}
            <div className="hidden sm:block">
              <Image
                src={withBasePath("/characters/poses/konkon_thumbsup.png")}
                alt="コンコン先生"
                width={120}
                height={120}
                className="drop-shadow-sm"
              />
            </div>
            {/* テキスト中央 */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100">
                <WatercolorIcon
                  name="syringe"
                  size={28}
                  className="text-sage-600"
                />
              </div>
              <h1 className="mt-5 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                予防接種ガイド
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
                全{allVaccines.length}
                種類のワクチン情報と接種スケジュール、港区での手順、科学的エビデンスをまとめた総合ガイドです。
              </p>
            </div>
            {/* キャラクター右 */}
            <div className="hidden sm:block">
              <Image
                src={withBasePath("/characters/poses/usagi_cheering.png")}
                alt="うさぎーさん"
                width={110}
                height={110}
                className="drop-shadow-sm"
              />
            </div>
          </div>

          {/* Jump Links */}
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {JUMP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
              >
                <WatercolorIcon name={link.iconName} size={16} />
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Medical Supervision Notice */}
      <section className="px-4 pt-10 pb-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-blue-800">
              <WatercolorIcon
                name="shield"
                size={14}
                className="mt-0.5 shrink-0"
              />
              <span>
                このスケジュールは
                <a
                  href="https://www.jpeds.or.jp/modules/activity/index.php?content_id=138"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-blue-900"
                >
                  日本小児科学会の推奨スケジュール（2024年版）
                </a>
                と港区の公費助成情報に基づいています。監修：小児科専門医おかもん先生
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Doctor's Message */}
      <section className="px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-4 rounded-xl border border-sage-200 bg-sage-50/50 p-5 sm:p-6">
            <div className="shrink-0">
              <Image
                src={withBasePath("/characters/poses/konkon_reading.png")}
                alt="コンコン先生"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-sage-800">
                おかもん先生より
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                予防接種は、お子さんを重篤な感染症から守る最も効果的な手段です。
                ワクチンは世界中で年間数百万人の命を救っており、その安全性と有効性は膨大な科学的エビデンスで裏付けられています。
                「接種しない自由」もありますが、それは同時にお子さんだけでなく、まだワクチンを打てない赤ちゃんや免疫が弱い方々をリスクにさらすことにもなります。
                このページでは、エビデンスに基づいた正確な情報をお届けします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Overview */}
      <section id="schedule" className="scroll-mt-20 px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            subtitle="お子さんの年齢に応じた接種スケジュールの全体像です"
            align="left"
          >
            接種スケジュール
          </SectionHeading>
          <div className="mt-8">
            <ScheduleTable vaccines={allVaccines} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            ※
            スケジュールは標準的な接種時期を示しています。お子さんの体調や個別の事情に応じて、かかりつけ医と相談のうえスケジュールを調整してください。
          </p>
        </div>
      </section>

      {/* Vaccine List */}
      <section
        id="vaccines"
        className="scroll-mt-20 border-t border-border bg-ivory-100/50 px-4 py-16"
      >
        <div className="mx-auto max-w-4xl space-y-10">
          <SectionHeading
            subtitle="各ワクチンの詳細情報・副反応・よくある質問はこちら"
            align="left"
          >
            ワクチン一覧
          </SectionHeading>

          <div className="rounded-xl border border-sage-200 bg-sage-50 p-5">
            <div className="flex items-start gap-3">
              <WatercolorIcon
                name="star"
                size={20}
                className="mt-0.5   shrink-0 text-sage-600"
              />
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-sage-800">
                  予防接種の基本ルール
                </p>
                <ul className="space-y-1 text-sm text-sage-700">
                  <li className="flex items-start gap-1.5">
                    <WatercolorIcon
                      name="check"
                      size={12}
                      className="mt-0.5 .5 .5 shrink-0 text-sage-500"
                    />
                    生後2ヶ月から開始。五種混合・肺炎球菌・B型肝炎・ロタを同時接種するのが標準的なスタートです
                  </li>
                  <li className="flex items-start gap-1.5">
                    <WatercolorIcon
                      name="check"
                      size={12}
                      className="mt-0.5 .5 .5 shrink-0 text-sage-500"
                    />
                    同時接種は安全です。複数のワクチンを1回の来院でまとめて受けることで、早く免疫をつけられます
                  </li>
                  <li className="flex items-start gap-1.5">
                    <WatercolorIcon
                      name="check"
                      size={12}
                      className="mt-0.5 .5 .5 shrink-0 text-sage-500"
                    />
                    定期接種は公費（無料）で受けられます。対象年齢・期間内に接種しましょう
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100">
                <WatercolorIcon
                  name="syringe"
                  size={12}
                  className=".5 .5 text-sage-700"
                />
              </span>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                定期接種
                <span className="ml-2 text-sm font-normal text-muted">
                  （公費・無料）
                </span>
              </h3>
              <span className="rounded-full bg-ivory-200 px-2 py-0.5 text-xs font-medium text-muted">
                {routineVaccines.length}種
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {routineVaccines.map((vaccine) => (
                <VaccineCard key={vaccine.slug} vaccine={vaccine} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
                <WatercolorIcon
                  name="syringe"
                  size={12}
                  className=".5 .5 text-orange-700"
                />
              </span>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                任意接種
                <span className="ml-2 text-sm font-normal text-muted">
                  （原則自費・一部港区助成あり）
                </span>
              </h3>
              <span className="rounded-full bg-ivory-200 px-2 py-0.5 text-xs font-medium text-muted">
                {optionalVaccines.length}種
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {optionalVaccines.map((vaccine) => (
                <VaccineCard key={vaccine.slug} vaccine={vaccine} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="港区にお住まいの方向け、予防接種の流れ"
            align="left"
          >
            港区での接種手順
          </SectionHeading>
          <div className="mt-8">
            <StepsGuide steps={steps} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="scroll-mt-20 border-t border-border bg-ivory-100/50 px-4 py-16"
      >
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="保護者の方からよく寄せられる質問にお答えします"
            align="left"
          >
            よくある質問
          </SectionHeading>
          <div className="mt-8">
            <FaqSection faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Evidence Section */}
      <section id="evidence" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="予防接種の有効性と安全性を支える科学的根拠"
            align="left"
          >
            科学的エビデンス
          </SectionHeading>
          <div className="mt-8">
            <EvidenceSection evidence={evidence} />
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {vaccinationArticles.length > 0 && (
        <section className="border-t border-border bg-ivory-100/50 px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              subtitle="予防接種に関する詳しい記事もあわせてお読みください"
              align="left"
            >
              関連記事
            </SectionHeading>
            <div className="mt-8 space-y-3">
              {vaccinationArticles.map((article) => (
                <Link
                  key={article.frontmatter.slug}
                  href={`/articles/${article.frontmatter.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-sage-200 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-sage-600">
                    <WatercolorIcon name="book" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge category="vaccination" />
                      <span className="text-xs text-muted">
                        Vol.{article.frontmatter.vol}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-card-foreground group-hover:text-sage-700">
                      {article.frontmatter.title}
                    </h3>
                  </div>
                  <WatercolorIcon
                    name="arrow_right"
                    size={16}
                    className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Official Resources Section */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="国や学会の公式情報もあわせてご確認ください"
            align="left"
          >
            公式情報・参考サイト
          </SectionHeading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href="https://www.know-vpd.jp/feature/vc_schedule.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sage-200 bg-sage-50">
                <WatercolorIcon
                  name="shield"
                  size={20}
                  className="text-sage-600"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-sm font-semibold text-card-foreground group-hover:text-sage-700">
                  Know VPD!
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  予防接種スケジュール・各ワクチン詳細（日本ワクチン産業協会）
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600">
                  www.know-vpd.jp
                  <WatercolorIcon name="external" size={12} />
                </span>
              </div>
            </a>
            <a
              href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kekkaku-kansenshou/yobou-sesshu/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50">
                <WatercolorIcon
                  name="shield"
                  size={20}
                  className="text-blue-600"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-sm font-semibold text-card-foreground group-hover:text-sage-700">
                  厚生労働省 予防接種情報
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  定期接種制度・接種スケジュール・法制度の公式情報
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                  www.mhlw.go.jp
                  <WatercolorIcon name="external" size={12} />
                </span>
              </div>
            </a>
            <a
              href="https://id-info.jihs.go.jp/relevant/vaccine/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-200 bg-purple-50">
                <WatercolorIcon
                  name="book"
                  size={20}
                  className="text-purple-600"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-sm font-semibold text-card-foreground group-hover:text-sage-700">
                  国立感染症研究所（JIHS）
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  感染症・ワクチンに関する科学的情報と研究データ
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-purple-600">
                  id-info.jihs.go.jp
                  <WatercolorIcon name="external" size={12} />
                </span>
              </div>
            </a>
            <a
              href="https://www.jpeds.or.jp/modules/activity/index.php?content_id=138"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blush-200 bg-blush-50">
                <WatercolorIcon
                  name="stethoscope"
                  size={20}
                  className="text-blush-600"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-sm font-semibold text-card-foreground group-hover:text-sage-700">
                  日本小児科学会
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  同時接種の考え方・接種スケジュール推奨（専門医向け）
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blush-600">
                  www.jpeds.or.jp
                  <WatercolorIcon name="external" size={12} />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/clinics"
              className="flex flex-1 items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <WatercolorIcon name="mappin" size={20} />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-card-foreground">
                  予防接種できる医療機関を探す
                </h3>
                <p className="mt-0.5 text-xs text-muted">港区の小児科マップ</p>
              </div>
            </Link>
            <Link
              href="/programs"
              className="flex flex-1 items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blush-50 text-blush-500">
                <WatercolorIcon name="heart" size={20} />
              </div>
              <div>
                <h3 className="font-heading text-sm font-semibold text-card-foreground">
                  ワクチン助成金を確認する
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  おたふくかぜ・インフルエンザ
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
