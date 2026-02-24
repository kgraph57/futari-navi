import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Image from "next/image";
import Link from "next/link";
import {
  getAllCheckups,
  CHECKUP_VENUE_LABELS,
  CHECKUP_VENUE_COLORS,
} from "@/lib/checkups";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Checkup } from "@/lib/types";
import { withBasePath } from "@/lib/image-path";

export const metadata: Metadata = {
  title: "乳幼児健診ガイド",
  description:
    "港区の乳幼児健診スケジュール、各健診の内容・準備物・よくある質問、医師がチェックしているポイントをまとめた総合ガイド。小児科医おかもんが解説します。",
};

const JUMP_LINKS = [
  { href: "#schedule", iconName: "calendar" as const, label: "スケジュール" },
  { href: "#checkups", iconName: "clipboard" as const, label: "健診一覧" },
  { href: "#preparation", iconName: "clipboard" as const, label: "準備するもの" },
  { href: "#faq", iconName: "help" as const, label: "よくある質問" },
  { href: "#doctor-perspective", iconName: "stethoscope" as const, label: "医師の視点" },
] as const;

const TIMELINE_ITEMS = [
  { slug: "1month", ageLabel: "1ヶ月", ageMonths: 1 },
  { slug: "3-4month", ageLabel: "3〜4ヶ月", ageMonths: 3 },
  { slug: "6-7month", ageLabel: "6〜7ヶ月", ageMonths: 6 },
  { slug: "9-10month", ageLabel: "9〜10ヶ月", ageMonths: 9 },
  { slug: "18month", ageLabel: "1歳半", ageMonths: 18 },
  { slug: "3year", ageLabel: "3歳", ageMonths: 36 },
  { slug: "preschool", ageLabel: "就学時", ageMonths: 66 },
] as const;

const COMMON_PREPARATIONS = [
  {
    item: "母子健康手帳",
    detail:
      "すべての健診で必要です。過去の健診記録、予防接種歴の確認に使用します。",
  },
  {
    item: "健康保険証・乳幼児医療証",
    detail:
      "万が一異常が見つかった場合の追加検査に必要です。毎回持参しましょう。",
  },
  {
    item: "健診受診票（問診票）",
    detail:
      "港区から送付されます。事前に記入しておくと当日スムーズに進みます。",
  },
  {
    item: "おむつ・着替え・ミルク",
    detail:
      "特に集団健診は待ち時間が長くなることがあります。多めに準備しましょう。",
  },
  {
    item: "質問メモ",
    detail:
      "聞きたいことを事前にメモしておくと、限られた時間を有効に使えます。発達で気になること、生活の悩みなども遠慮なくどうぞ。",
  },
  {
    item: "バスタオル",
    detail:
      "身体測定時に使用します。特に集団健診では大判のタオルがあると便利です。",
  },
] as const;

const GENERAL_FAQS = [
  {
    question: "健診を受けないとどうなりますか？",
    answer:
      "法律で義務づけられた1歳半健診と3歳児健診を受けない場合、保健センターから連絡があります。お子さんの健康と安全を確認するためですので、必ず受診してください。日程が合わない場合は振替の相談ができます。",
  },
  {
    question: "体調が悪い場合、健診は延期できますか？",
    answer:
      "発熱や体調不良の場合は延期可能です。集団健診の場合は港区みなと保健所（03-6400-0081）に連絡してください。個別健診の場合はかかりつけの医療機関に連絡して日程を変更しましょう。",
  },
  {
    question: "集団健診と個別健診の違いは何ですか？",
    answer:
      "集団健診は保健センターで決められた日時に多くのお子さんが一緒に受けます。保健師による育児相談も受けられ、他の保護者との交流の機会にもなります。個別健診はかかりつけの小児科で受けるため、より個別的な相談がしやすいのが特徴です。",
  },
  {
    question: "「要経過観察」と言われたら、どうすればいいですか？",
    answer:
      "「要経過観察」は必ずしも異常があるという意味ではなく、成長の個人差の範囲内で少し見守りが必要という判断です。指示されたフォローアップの受診や相談を受けることが、お子さんの健やかな発達をサポートする最善の方法です。",
  },
  {
    question: "パートナーや祖父母が連れて行っても大丈夫ですか？",
    answer:
      "大丈夫です。ただし、普段のお子さんの様子（食事、睡眠、発達の状況）を把握している方が同行すると、医師や保健師への質問・回答がスムーズです。事前に伝えたいことをメモに書いて持たせるのも良い方法です。",
  },
] as const;

function CheckupCard({ checkup }: { readonly checkup: Checkup }) {
  const venueColorClass =
    CHECKUP_VENUE_COLORS[checkup.venue] ??
    "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <Link
      href={`/checkups/${checkup.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${venueColorClass}`}
      >
        <WatercolorIcon name="clipboard" size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-card-foreground">
            {checkup.name}
          </h3>
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${venueColorClass}`}
          >
            {CHECKUP_VENUE_LABELS[checkup.venue]}
          </span>
          {checkup.isMandatory && (
            <span className="inline-flex rounded-full border border-blush-200 bg-blush-50 px-2 py-0.5 text-xs font-medium text-blush-600">
              法定健診
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted">
          対象: {checkup.ageLabel} ／ {checkup.cost}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
          {checkup.description}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          詳しく見る
          <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </div>
    </Link>
  );
}

function ScheduleTimeline({
  checkups,
}: {
  readonly checkups: readonly Checkup[];
}) {
  const checkupMap = new Map(checkups.map((c) => [c.slug, c]));

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-sage-200 sm:left-8" />

      <div className="space-y-6">
        {TIMELINE_ITEMS.map((item, index) => {
          const checkup = checkupMap.get(item.slug);
          if (!checkup) return null;

          const venueColorClass =
            CHECKUP_VENUE_COLORS[checkup.venue] ??
            "bg-gray-50 text-gray-700 border-gray-200";
          const isFree = checkup.cost.includes("無料");

          return (
            <div key={checkup.slug} className="relative flex gap-4 sm:gap-6">
              {/* Timeline dot */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sage-400 bg-white sm:h-16 sm:w-16">
                <span className="text-xs font-bold text-sage-700 sm:text-sm">
                  {item.ageLabel}
                </span>
              </div>

              {/* Content */}
              <Link
                href={`/checkups/${checkup.slug}`}
                className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-sage-200 hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-semibold text-card-foreground sm:text-base">
                      {checkup.name}
                    </h3>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${venueColorClass}`}
                    >
                      {checkup.venue === "hospital"
                        ? "出産病院"
                        : checkup.venue === "public"
                          ? "集団"
                          : checkup.venue === "clinic"
                            ? "個別"
                            : "小学校"}
                    </span>
                    {isFree ? (
                      <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        無料
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                        自費
                      </span>
                    )}
                    {checkup.isMandatory && (
                      <span className="inline-flex rounded-full border border-blush-200 bg-blush-50 px-2 py-0.5 text-xs font-medium text-blush-600">
                        法定
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted sm:text-sm">
                    {checkup.venueLabel}
                  </p>
                </div>
                <WatercolorIcon name="arrow_right" size={16} className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CheckupsPage() {
  const allCheckups = getAllCheckups();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-10 pt-10 sm:pb-16 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-center sm:gap-8">
            <div className="hidden sm:block">
              <Image
                src={withBasePath("/characters/poses/pankun_happy.png")}
                alt="ぱんくん"
                width={110}
                height={110}
                className="drop-shadow-sm"
              />
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100">
                <WatercolorIcon name="clipboard" size={28} className="text-sage-600" />
              </div>
              <h1 className="mt-5 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                乳幼児健診ガイド
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
                生まれてから就学前まで、全{allCheckups.length}
                回の健診スケジュール・内容・準備物・医師の視点をまとめた総合ガイドです。
              </p>
            </div>
            <div className="hidden sm:block">
              <Image
                src={withBasePath("/characters/poses/amara_reading.png")}
                alt="アマラ"
                width={100}
                height={100}
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

      {/* Doctor's Message */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-4 rounded-xl border border-sage-200 bg-sage-50/50 p-5 sm:p-6">
            <div className="shrink-0">
              <Image
                src={withBasePath("/characters/poses/konkon_thinking.png")}
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
                乳幼児健診は、お子さんの成長を確認する大切な節目です。
                「異常を見つけるための検査」と思われがちですが、実は「順調に育っていますよ」と安心していただくための機会でもあります。
                発達の個人差は大きく、健診の時点で「できない」ことがあっても、それだけで問題があるとは限りません。
                大切なのは、健診をきっかけにお子さんの成長を一緒に見守り、必要なサポートを早めに届けること。
                このページでは、各健診で私たち医師が何を見ているのか、保護者の方に何を準備していただきたいのかを、できるだけ分かりやすくお伝えします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Timeline */}
      <section id="schedule" className="scroll-mt-20 px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <SectionHeading
            subtitle="お子さんの年齢に応じた健診スケジュールの全体像です"
            align="left"
          >
            健診スケジュール
          </SectionHeading>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-3">
            {(
              Object.entries(CHECKUP_VENUE_COLORS) as ReadonlyArray<
                [string, string]
              >
            ).map(([venue, colorClass]) => (
              <span
                key={venue}
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${colorClass}`}
              >
                {CHECKUP_VENUE_LABELS[venue as keyof typeof CHECKUP_VENUE_LABELS]}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <ScheduleTimeline checkups={allCheckups} />
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted">
            ※
            港区から届く案内をご確認のうえ、指定の日時・会場で受診してください。個別健診は受診票の有効期限内にかかりつけ医療機関で受けましょう。
          </p>
        </div>
      </section>

      {/* Checkup Cards List */}
      <section
        id="checkups"
        className="scroll-mt-20 border-t border-border bg-ivory-100/50 px-4 py-16"
      >
        <div className="mx-auto max-w-4xl space-y-10">
          <SectionHeading
            subtitle="各健診の詳細情報・医師のチェックポイント・よくある質問はこちら"
            align="left"
          >
            健診一覧
          </SectionHeading>

          <div className="rounded-xl border border-sage-200 bg-sage-50 p-5">
            <div className="flex items-start gap-3">
              <WatercolorIcon name="star" size={20} className="mt-0.5   shrink-0 text-sage-600" />
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-sage-800">
                  乳幼児健診の基本
                </p>
                <ul className="space-y-1 text-sm text-sage-700">
                  <li className="flex items-start gap-1.5">
                    <WatercolorIcon name="check" size={12} className="mt-0.5 .5 .5 shrink-0 text-sage-500" />
                    1歳半健診と3歳児健診は法律で義務づけられた健診です。必ず受診してください
                  </li>
                  <li className="flex items-start gap-1.5">
                    <WatercolorIcon name="check" size={12} className="mt-0.5 .5 .5 shrink-0 text-sage-500" />
                    港区では3〜4ヶ月・6〜7ヶ月・9〜10ヶ月の健診も公費（無料）で受けられます
                  </li>
                  <li className="flex items-start gap-1.5">
                    <WatercolorIcon name="check" size={12} className="mt-0.5 .5 .5 shrink-0 text-sage-500" />
                    健診で「要経過観察」と言われても慌てないでください。早めのフォローがお子さんの発達をサポートします
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {allCheckups.map((checkup) => (
              <CheckupCard key={checkup.slug} checkup={checkup} />
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Overview */}
      <section id="preparation" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="すべての健診に共通する持ち物と準備のポイント"
            align="left"
          >
            準備するもの
          </SectionHeading>
          <div className="mt-8 space-y-3">
            {COMMON_PREPARATIONS.map((prep) => (
              <div
                key={prep.item}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-50">
                  <WatercolorIcon name="star" size={20} className="text-sage-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-sm font-semibold text-card-foreground">
                    {prep.item}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {prep.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            ※
            健診によっては追加の持ち物（尿検体、歯ブラシ、上履きなど）が必要です。各健診の詳細ページでご確認ください。
          </p>
        </div>
      </section>

      {/* FAQ Overview */}
      <section
        id="faq"
        className="scroll-mt-20 border-t border-border bg-ivory-100/50 px-4 py-16"
      >
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="乳幼児健診について保護者の方からよく寄せられる質問"
            align="left"
          >
            よくある質問
          </SectionHeading>
          <div className="mt-8 space-y-3">
            {GENERAL_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border bg-card"
              >
                <summary className="flex cursor-pointer items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-50">
                    <WatercolorIcon name="star" size={16} className="text-sage-600" />
                  </div>
                  <span className="flex-1 text-sm font-bold text-card-foreground">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-muted transition-transform group-open:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor's Perspective Section */}
      <section id="doctor-perspective" className="scroll-mt-20 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            subtitle="各健診で小児科医がどこを見ているのか、その視点をご紹介します"
            align="left"
          >
            医師はどこを見ているのか
          </SectionHeading>
          <div className="mt-8">
            <div className="flex gap-4 rounded-xl border border-sage-200 bg-sage-50/50 p-5 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-600">
                <WatercolorIcon name="star" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-sage-800">
                  おかもん先生の解説
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  健診では体重や身長を測るだけではありません。私たち小児科医は、お子さんの全身を診ながら「この月齢で期待される発達のマイルストーンに達しているか」を総合的に判断しています。
                  たとえば3〜4ヶ月健診では首すわりと追視、1歳半健診では指差しと有意語、3歳児健診では視力と社会性。
                  それぞれの健診ページでは、「医師が実際に何を見て、何を考えているか」を詳しく解説しています。
                  保護者の方がこの視点を知ることで、ご家庭での観察ポイントも明確になり、健診をより有意義な時間にしていただけると思います。
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {allCheckups.map((checkup) => (
                <Link
                  key={checkup.slug}
                  href={`/checkups/${checkup.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-sage-200 hover:shadow-md"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-50">
                    <WatercolorIcon name="star" size={16} className="text-sage-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-card-foreground group-hover:text-sage-700">
                      {checkup.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted">
                      チェックポイント: {checkup.whatDoctorChecks.length}項目
                    </p>
                  </div>
                  <WatercolorIcon name="arrow_right" size={16} className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-4 py-16">
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
                  健診できる医療機関を探す
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
                  子育て支援制度を確認する
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  港区の助成金・サービス
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
