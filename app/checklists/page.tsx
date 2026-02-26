import type { Metadata } from "next";
import {
  WatercolorIcon,
  type WatercolorIconName,
} from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { getAllChecklists } from "@/lib/checklists";

export const metadata: Metadata = {
  title: "手続きチェックリスト",
  description:
    "婚姻届の提出から名義変更・保険・税金まで、結婚に伴う手続きをステップごとにガイド。",
};

const ICON_MAP: Record<string, WatercolorIconName> = {
  baby: "heart",
  "file-text": "clipboard",
  heart: "heart",
  school: "building",
  "graduation-cap": "lightbulb",
};

const ORDER_COLORS: readonly string[] = [
  "bg-pink-500",
  "bg-sage-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
];

interface TimelinePhase {
  readonly label: string;
  readonly period: string;
  readonly items: readonly string[];
  readonly checklistSlug: string;
  readonly color: string;
}

const TIMELINE_PHASES: readonly TimelinePhase[] = [
  {
    label: "婚姻届の提出",
    period: "入籍日前後",
    items: [
      "婚姻届の入手・記入",
      "戸籍謄本の取得（本籍地以外に届出する場合）",
      "証人2名のサイン",
      "婚姻届の提出",
    ],
    checklistSlug: "marriage-registration",
    color: "bg-pink-500",
  },
  {
    label: "氏名・住所変更",
    period: "入籍後〜2週間以内",
    items: [
      "転入届・転居届の提出（引っ越しがある場合）",
      "マイナンバーカードの氏名・住所変更",
      "運転免許証の氏名・住所変更",
      "パスポートの氏名変更",
    ],
    checklistSlug: "marriage-registration",
    color: "bg-sage-500",
  },
  {
    label: "保険・年金",
    period: "入籍後〜1ヶ月以内",
    items: [
      "健康保険の氏名変更・扶養手続き",
      "国民年金の氏名変更",
      "生命保険・医療保険の受取人変更",
    ],
    checklistSlug: "marriage-registration",
    color: "bg-blue-500",
  },
  {
    label: "銀行・カード等",
    period: "入籍後〜1ヶ月以内",
    items: [
      "銀行口座の氏名・届出印変更",
      "クレジットカードの氏名変更",
      "携帯電話の契約名義変更",
      "各種会員サービスの登録情報変更",
    ],
    checklistSlug: "marriage-registration",
    color: "bg-purple-500",
  },
  {
    label: "税金・届出",
    period: "年末調整 or 確定申告時",
    items: [
      "配偶者控除・配偶者特別控除の確認",
      "扶養控除等申告書の更新",
      "会社への届出（結婚届・家族手当など）",
    ],
    checklistSlug: "marriage-registration",
    color: "bg-orange-500",
  },
];

export default function ChecklistsPage() {
  const checklists = getAllChecklists();

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            <WatercolorIcon
              name="clipboard"
              size={32}
              className="mr-2 inline-block   text-sage-600"
            />
            手続きチェックリスト
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            婚姻届の提出から名義変更・保険・税金まで、必要な手続きをステップごとにガイドします。
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute left-5 top-0 hidden h-full w-0.5 bg-ivory-200 sm:block" />

            <div className="space-y-6">
              {checklists.map((checklist, index) => {
                const iconName = ICON_MAP[checklist.icon] ?? "clipboard";
                const color = ORDER_COLORS[index % ORDER_COLORS.length];

                return (
                  <Link
                    key={checklist.slug}
                    href={`/checklists/${checklist.slug}`}
                    className="group relative flex gap-4 sm:gap-6"
                  >
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
                    >
                      {checklist.order}
                    </div>

                    <div className="flex-1 rounded-xl border border-border bg-card p-5 transition-all group-hover:border-sage-200 group-hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <WatercolorIcon name={iconName} size={28} />
                        <h2 className="font-heading text-lg font-semibold text-card-foreground">
                          {checklist.name}
                        </h2>
                        <span className="rounded-full bg-ivory-100 px-2 py-0.5 text-xs font-medium text-muted">
                          {checklist.items.length}項目
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {checklist.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
                        チェックリストを開く
                        <WatercolorIcon name="arrow_right" size={12} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-ivory-50/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              <WatercolorIcon
                name="calendar"
                size={28}
                className="mr-2 inline-block text-sage-600"
              />
              時系列ガイド
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              婚姻届の提出から税金の手続きまで、いつ何をすればよいか一目でわかります。
            </p>
          </div>

          <div className="relative mt-8">
            <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-ivory-200 sm:block" />

            <div className="space-y-6">
              {TIMELINE_PHASES.map((phase) => (
                <div key={phase.label} className="relative flex gap-4 sm:gap-6">
                  <div
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${phase.color}`}
                  />

                  <div className="flex-1 rounded-xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-heading text-lg font-semibold text-card-foreground">
                        {phase.label}
                      </h3>
                      <span className="text-sm text-muted">{phase.period}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {phase.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted"
                        >
                          <WatercolorIcon
                            name="check"
                            size={12}
                            className="mt-0.5 shrink-0 text-sage-400"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/checklists/${phase.checklistSlug}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
                    >
                      チェックリストを開く
                      <WatercolorIcon name="arrow_right" size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline CTA */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-sage-200 bg-gradient-to-r from-sage-50 to-ivory-50 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-sage-100">
                <WatercolorIcon
                  name="calendar"
                  size={28}
                  className="text-sage-600"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-base font-bold text-foreground">
                  結婚日を入れて、パーソナライズされたタイムラインを作成
                </h3>
                <p className="mt-1 text-sm text-muted">
                  期限付きのタスクを自動生成。完了率で進捗を管理できます。
                </p>
              </div>
              <Link
                href="/my/timeline"
                className="flex-shrink-0 rounded-full bg-sage-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700"
              >
                タイムラインへ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
