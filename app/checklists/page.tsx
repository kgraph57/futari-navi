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
    "出産前から小学校入学まで、港区で必要な手続きをステップごとにガイド。妊娠届、出生届、児童手当、保育園申込など。",
};

const ICON_MAP: Record<string, WatercolorIconName> = {
  baby: "baby",
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
    label: "妊娠中",
    period: "妊娠判明〜出産",
    items: [
      "妊娠届出・母子手帳の受取",
      "妊婦健診（14回）",
      "出産準備クラス・両親学級",
      "分娩施設の予約",
      "産前休業の手続き",
    ],
    checklistSlug: "pregnancy",
    color: "bg-pink-500",
  },
  {
    label: "出産直後",
    period: "出生〜2週間以内",
    items: [
      "出生届の提出（14日以内）",
      "健康保険の加入",
      "児童手当の申請（15日以内）",
      "子ども医療費助成の申請",
      "出産育児一時金の手続き",
    ],
    checklistSlug: "birth",
    color: "bg-sage-500",
  },
  {
    label: "1ヶ月",
    period: "生後1ヶ月頃",
    items: [
      "1ヶ月健診",
      "出産・子育て応援交付金（出産後分）",
      "育児休業給付金の申請",
    ],
    checklistSlug: "birth",
    color: "bg-sage-500",
  },
  {
    label: "3〜4ヶ月",
    period: "生後2〜4ヶ月",
    items: [
      "予防接種スタート（生後2ヶ月〜）",
      "3-4ヶ月健診",
      "産後ケアの利用",
      "こんにちは赤ちゃん訪問",
    ],
    checklistSlug: "infant",
    color: "bg-blue-500",
  },
  {
    label: "1歳",
    period: "生後6ヶ月〜1歳",
    items: [
      "BCG接種",
      "6-7ヶ月健診・9-10ヶ月健診",
      "離乳食の開始",
      "保活スタート（情報収集）",
    ],
    checklistSlug: "infant",
    color: "bg-blue-500",
  },
  {
    label: "3歳",
    period: "1歳〜就学前",
    items: [
      "おたふくかぜワクチン接種",
      "保育園・幼稚園の申込",
      "幼児教育・保育の無償化手続き",
    ],
    checklistSlug: "nursery",
    color: "bg-purple-500",
  },
  {
    label: "就学前",
    period: "5〜6歳",
    items: [
      "就学時健康診断",
      "入学通知書の確認",
      "学童保育の申込",
      "入学準備品の購入",
    ],
    checklistSlug: "school",
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
            出産前から小学校入学まで、必要な手続きをステップごとにガイドします。
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
              妊娠中から就学前まで、いつ何をすればよいか一目でわかります。
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
    </>
  );
}
