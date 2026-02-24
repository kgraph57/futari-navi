"use client"

;

import { useState, useEffect } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { ChildProfile } from "@/lib/store";
import { getChildAge } from "@/lib/utils/age";
import { generateTimeline } from "@/lib/timeline-engine";
import type { TimelineItem, TimelineCategory } from "@/lib/timeline-engine";

import type { WatercolorIconName } from "@/components/icons/watercolor-icon";

const CATEGORY_ICON: Record<TimelineCategory, WatercolorIconName> = {
  admin: "clipboard",
  medical: "stethoscope",
  vaccination: "syringe",
  support: "heart",
};

const CATEGORY_COLOR: Record<TimelineCategory, string> = {
  admin: "bg-blue-50 text-blue-600",
  medical: "bg-sage-50 text-sage-600",
  vaccination: "bg-purple-50 text-purple-600",
  support: "bg-rose-50 text-rose-500",
};

const URGENCY_BORDER: Record<string, string> = {
  overdue: "border-l-red-500",
  urgent: "border-l-orange-400",
  soon: "border-l-amber-400",
  upcoming: "border-l-sage-400",
};

function DigestItem({ item }: { readonly item: TimelineItem }) {
  const iconName = CATEGORY_ICON[item.category];
  const colorClass = CATEGORY_COLOR[item.category];
  const borderClass = URGENCY_BORDER[item.urgency] ?? "border-l-gray-300";

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-border bg-white p-3 border-l-4 ${borderClass}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
      >
        <WatercolorIcon name={iconName} size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        <p className="mt-0.5 text-xs text-muted line-clamp-1">
          {item.description}
        </p>
      </div>
      {item.urgency === "overdue" && (
        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          期限超過
        </span>
      )}
      {item.urgency === "urgent" && (
        <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
          至急
        </span>
      )}
    </div>
  );
}

export function WeeklyDigest() {
  const store = useStore();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [urgentItems, setUrgentItems] = useState<readonly TimelineItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    store.getFamilyProfile().then((profile) => {
      if (cancelled) return;

      if (profile == null || profile.children.length === 0) {
        setIsLoaded(true);
        return;
      }

      const firstChild = profile.children[0];
      setChild(firstChild);

      const timeline = generateTimeline(
        firstChild.birthDate,
        firstChild.completedItems,
      );

      const actionable = timeline.filter(
        (item) =>
          !item.completed &&
          (item.urgency === "overdue" ||
            item.urgency === "urgent" ||
            item.urgency === "soon"),
      );

      setUrgentItems(actionable.slice(0, 5));
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  if (!isLoaded) {
    return null;
  }

  if (child == null) {
    return (
      <section className="border-t border-border bg-gradient-to-br from-sage-50 to-ivory-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-sage-200 bg-white/60 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
              <WatercolorIcon name="star" size={28} className="text-sage-600" />
            </div>
            <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
              お子さんに合わせた「今週やること」を表示
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              生年月日を登録するだけで、手続きの期限・健診・予防接種を自動で表示。もう「やり忘れ」はありません。
            </p>
            <Link
              href="/my"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
            >
              <WatercolorIcon name="baby" size={16} />
              お子さんを登録する
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { years, months } = getChildAge(child.birthDate);
  const ageLabel = years === 0 ? `${months}ヶ月` : `${years}歳${months}ヶ月`;

  if (urgentItems.length === 0) {
    return (
      <section className="border-t border-border bg-gradient-to-br from-sage-50 to-ivory-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-sage-100 bg-white/80 p-6 text-center">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {child.nickname}ちゃん（{ageLabel}）
            </h2>
            <p className="mt-2 text-sm text-sage-600">
              直近でやるべき手続きはすべて完了しています
            </p>
            <Link
              href="/my/timeline"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sage-600 hover:text-sage-700"
            >
              タイムラインで今後の予定を確認
              <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const overdueCount = urgentItems.filter(
    (i) => i.urgency === "overdue",
  ).length;

  return (
    <section className="border-t border-border bg-gradient-to-br from-sage-50 to-ivory-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
              <WatercolorIcon name="calendar" size={20} className="text-sage-600" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {child.nickname}ちゃんの今週やること
              </h2>
              <p className="text-xs text-muted">{ageLabel}</p>
            </div>
          </div>
          {overdueCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              <WatercolorIcon name="alert" size={12} />
              {overdueCount}件期限超過
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {urgentItems.map((item) => (
            <DigestItem key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/my/timeline"
            className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-5 py-2 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
          >
            すべてのタスクを見る
            <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
