"use client";

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { TimelineItem, TimelineUrgency } from "@/lib/timeline-engine";

const URGENCY_LABELS: Record<TimelineUrgency, string> = {
  overdue: "期限超過",
  urgent: "今週中",
  soon: "今月中",
  upcoming: "3ヶ月以内",
  future: "今後",
};

const URGENCY_COLORS: Record<
  TimelineUrgency,
  { readonly bg: string; readonly text: string; readonly border: string }
> = {
  overdue: { bg: "bg-red-50", text: "text-red-700", border: "border-l-red-500" },
  urgent: { bg: "bg-orange-50", text: "text-orange-700", border: "border-l-orange-400" },
  soon: { bg: "bg-amber-50", text: "text-amber-700", border: "border-l-amber-400" },
  upcoming: { bg: "bg-sage-50", text: "text-sage-700", border: "border-l-sage-400" },
  future: { bg: "bg-gray-50", text: "text-gray-600", border: "border-l-gray-300" },
};

const CATEGORY_ICONS: Record<string, { readonly name: string; readonly color: string }> = {
  admin: { name: "building", color: "text-blue-600" },
  medical: { name: "stethoscope", color: "text-sage-600" },
  vaccination: { name: "syringe", color: "text-purple-600" },
  support: { name: "heart", color: "text-rose-500" },
};

interface Top3ViewProps {
  readonly items: readonly TimelineItem[];
  readonly childName: string;
  readonly onToggleComplete: (itemId: string) => void;
  readonly onShowAll: () => void;
}

export function Top3View({
  items,
  childName,
  onToggleComplete,
  onShowAll,
}: Top3ViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/30 px-6 py-14 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="check" size={32} className="text-sage-500" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
          すべて完了しています
        </h3>
        <p className="mt-2 text-sm text-muted">
          {childName}ちゃんの今やるべきことはありません。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <WatercolorIcon name="star" size={20} className="text-amber-500" />
        <h2 className="font-heading text-base font-semibold text-foreground">
          {childName}ちゃんの今週やること
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const urgencyColor = URGENCY_COLORS[item.urgency];
          const categoryIcon = CATEGORY_ICONS[item.category] ?? { name: "star", color: "text-gray-500" };
          const isExternal =
            item.actionUrl.startsWith("https://") ||
            item.actionUrl.startsWith("http://");

          return (
            <div
              key={item.id}
              className={`rounded-2xl border border-border shadow-sm overflow-hidden border-l-4 ${urgencyColor.border} bg-card`}
            >
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-100 font-heading text-sm font-bold text-sage-600">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <WatercolorIcon
                        name={categoryIcon.name as any}
                        size={16}
                        className={categoryIcon.color}
                      />
                      <h3 className="font-heading text-base font-semibold text-card-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <span
                      className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColor.bg} ${urgencyColor.text}`}
                    >
                      {URGENCY_LABELS[item.urgency]}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                    {item.tip != null && (
                      <p className="mt-2 flex items-start gap-1 text-xs italic text-sage-600">
                        <WatercolorIcon
                          name="lightbulb"
                          size={12}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{item.tip}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleComplete(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-2 text-xs font-medium text-sage-700 transition-colors hover:bg-sage-50"
                  >
                    <WatercolorIcon name="check" size={14} />
                    完了にする
                  </button>
                  {isExternal ? (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-sage-600 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-700"
                    >
                      {item.actionLabel}
                      <WatercolorIcon name="arrow_right" size={14} />
                    </a>
                  ) : (
                    <Link
                      href={item.actionUrl}
                      className="inline-flex items-center gap-1.5 rounded-full bg-sage-600 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-700"
                    >
                      {item.actionLabel}
                      <WatercolorIcon name="arrow_right" size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onShowAll}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2.5 text-sm font-medium text-muted transition-colors hover:bg-ivory-50 hover:text-foreground"
      >
        すべてのタスクを見る
        <WatercolorIcon name="arrow_right" size={16} />
      </button>
    </div>
  );
}
