"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type { FamilyProfile, ChildProfile } from "@/lib/store";
import { getChildAge } from "@/lib/utils/age";
import {
  generateTimeline,
  groupTimelineByUrgency,
  getTop3Items,
} from "@/lib/timeline-engine";
import type { TimelineItem, TimelineUrgency } from "@/lib/timeline-engine";
import { CalendarView } from "@/components/timeline/calendar-view";
import { Top3View } from "@/components/timeline/top3-view";
import {
  trackTimelineViewed,
  trackTimelineItemCompleted,
  trackTop3Viewed,
} from "@/lib/analytics/events";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const URGENCY_STYLES: Record<
  TimelineUrgency,
  {
    readonly accentBar: string;
    readonly headerBg: string;
    readonly badgeBg: string;
    readonly badgeText: string;
  }
> = {
  overdue: {
    accentBar: "border-l-red-500",
    headerBg: "bg-red-50",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
  },
  urgent: {
    accentBar: "border-l-orange-400",
    headerBg: "bg-orange-50",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
  soon: {
    accentBar: "border-l-amber-400",
    headerBg: "bg-amber-50",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
  upcoming: {
    accentBar: "border-l-sage-400",
    headerBg: "bg-sage-50",
    badgeBg: "bg-sage-100",
    badgeText: "text-sage-700",
  },
  future: {
    accentBar: "border-l-gray-300",
    headerBg: "bg-gray-50",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-600",
  },
} as const;

// ---------------------------------------------------------------------------
// Category icon component
// ---------------------------------------------------------------------------

function CategoryIcon({
  category,
}: {
  readonly category: TimelineItem["category"];
}) {
  switch (category) {
    case "admin":
      return (
        <WatercolorIcon name="building" size={20} className="text-blue-600" />
      );
    case "medical":
      return (
        <WatercolorIcon
          name="stethoscope"
          size={20}
          className="text-sage-600"
        />
      );
    case "vaccination":
      return (
        <WatercolorIcon name="syringe" size={20} className="text-purple-600" />
      );
    case "support":
      return (
        <WatercolorIcon name="heart" size={20} className="text-rose-500" />
      );
  }
}

// ---------------------------------------------------------------------------
// TimelineItemCard
// ---------------------------------------------------------------------------

function TimelineItemCard({
  item,
  onToggleComplete,
}: {
  readonly item: TimelineItem;
  readonly onToggleComplete: (itemId: string) => void;
}) {
  const styles = URGENCY_STYLES[item.urgency];
  const isExternal =
    item.actionUrl.startsWith("https://") ||
    item.actionUrl.startsWith("http://");

  const showDeadlineBadge =
    !item.completed &&
    item.deadlineDaysFromBirth != null &&
    ["overdue", "urgent", "soon"].includes(item.urgency);

  return (
    <div
      className={`flex gap-0 rounded-xl border border-border shadow-sm overflow-hidden border-l-4 ${
        item.completed
          ? "border-l-gray-200 bg-ivory-50 opacity-70"
          : `bg-card ${styles.accentBar}`
      }`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => onToggleComplete(item.id)}
            className="mt-0.5 shrink-0 transition-colors"
            aria-label={item.completed ? "未完了に戻す" : "完了にする"}
          >
            {item.completed ? (
              <WatercolorIcon
                name="check"
                size={24}
                className="text-sage-500"
              />
            ) : (
              <WatercolorIcon
                name="check"
                size={24}
                className="text-gray-300 hover:text-sage-400"
              />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`font-heading text-sm font-semibold ${
                  item.completed
                    ? "text-muted line-through"
                    : "text-card-foreground"
                }`}
              >
                {item.title}
              </h3>
              {item.completed && (
                <span className="inline-flex shrink-0 items-center rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
                  完了
                </span>
              )}
              {showDeadlineBadge && (
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles.badgeBg} ${styles.badgeText}`}
                >
                  期限: {item.deadlineDaysFromBirth}日以内
                </span>
              )}
            </div>

            <p className="mt-1 text-xs leading-relaxed text-muted">
              {item.description}
            </p>

            {!item.completed && item.tip != null && (
              <p className="mt-2 flex items-start gap-1 text-xs italic text-sage-600">
                <WatercolorIcon
                  name="lightbulb"
                  size={12}
                  className="mt-0.5 .5 .5 shrink-0"
                />
                <span>{item.tip}</span>
              </p>
            )}
          </div>
        </div>

        {!item.completed && (
          <div className="mt-3 flex justify-end">
            {isExternal ? (
              <a
                href={item.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-sage-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sage-700"
              >
                {item.actionLabel}
              </a>
            ) : (
              <Link
                href={item.actionUrl}
                className="inline-flex items-center rounded-full bg-sage-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-sage-700"
              >
                {item.actionLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header types
// ---------------------------------------------------------------------------

type SectionKey =
  | "overdueUrgent"
  | "soon"
  | "upcoming"
  | "future"
  | "completed";

interface SectionConfig {
  readonly key: SectionKey;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly headerTextColor: string;
  readonly headerBg: string;
  readonly collapsible: boolean;
}

const SECTIONS: readonly SectionConfig[] = [
  {
    key: "overdueUrgent",
    label: "今すぐやること",
    icon: <WatercolorIcon name="alert" size={20} />,
    headerTextColor: "text-red-700",
    headerBg: "bg-red-50",
    collapsible: false,
  },
  {
    key: "soon",
    label: "今月中に",
    icon: <WatercolorIcon name="clock" size={20} />,
    headerTextColor: "text-amber-700",
    headerBg: "bg-amber-50",
    collapsible: false,
  },
  {
    key: "upcoming",
    label: "この3ヶ月で",
    icon: <WatercolorIcon name="calendar" size={20} />,
    headerTextColor: "text-sage-700",
    headerBg: "bg-sage-50",
    collapsible: false,
  },
  {
    key: "future",
    label: "今後の予定",
    icon: <WatercolorIcon name="arrow_right" size={20} />,
    headerTextColor: "text-gray-600",
    headerBg: "bg-gray-50",
    collapsible: true,
  },
  {
    key: "completed",
    label: "完了済み",
    icon: <WatercolorIcon name="check" size={20} />,
    headerTextColor: "text-sage-600",
    headerBg: "bg-sage-50",
    collapsible: true,
  },
] as const;

// ---------------------------------------------------------------------------
// Grouped items type
// ---------------------------------------------------------------------------

interface GroupedSections {
  readonly overdueUrgent: readonly TimelineItem[];
  readonly soon: readonly TimelineItem[];
  readonly upcoming: readonly TimelineItem[];
  readonly future: readonly TimelineItem[];
  readonly completed: readonly TimelineItem[];
}

function buildGroupedSections(items: readonly TimelineItem[]): GroupedSections {
  const grouped = groupTimelineByUrgency(items);
  const completedItems = items.filter((item) => item.completed);
  const pending = (list: readonly TimelineItem[]) =>
    list.filter((item) => !item.completed);
  return {
    overdueUrgent: pending([
      ...(grouped.overdue ?? []),
      ...(grouped.urgent ?? []),
    ]),
    soon: pending(grouped.soon ?? []),
    upcoming: pending(grouped.upcoming ?? []),
    future: pending(grouped.future ?? []),
    completed: completedItems,
  };
}

// ---------------------------------------------------------------------------
// TimelineSection
// ---------------------------------------------------------------------------

function TimelineSection({
  config,
  items,
  onToggleComplete,
}: {
  readonly config: SectionConfig;
  readonly items: readonly TimelineItem[];
  readonly onToggleComplete: (itemId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(!config.collapsible);

  const pendingCount = items.filter((item) => !item.completed).length;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 ${config.headerBg} ${config.headerTextColor}`}
      >
        {config.collapsible ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex w-full items-center gap-2 font-heading text-sm font-semibold"
            aria-expanded={isExpanded}
          >
            {config.icon}
            <span className="flex-1 text-left">{config.label}</span>
            <span className="text-xs opacity-70">
              {pendingCount}/{items.length}件
            </span>
            {isExpanded ? (
              <WatercolorIcon name="star" size={16} />
            ) : (
              <WatercolorIcon name="arrow_right" size={16} />
            )}
          </button>
        ) : (
          <div className="flex w-full items-center gap-2">
            {config.icon}
            <span className="font-heading text-sm font-semibold flex-1">
              {config.label}
            </span>
            <span className="text-xs opacity-70">
              {pendingCount}/{items.length}件
            </span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-3 pl-0">
          {items.map((item) => (
            <TimelineItemCard
              key={item.id}
              item={item}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Child selector tabs
// ---------------------------------------------------------------------------

function ChildTabs({
  children,
  selectedId,
  onSelect,
}: {
  readonly children: readonly ChildProfile[];
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}) {
  if (children.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {children.map((child) => {
        const isSelected = child.id === selectedId;
        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onSelect(child.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-sage-600 text-white"
                : "bg-ivory-100 text-muted hover:bg-sage-50 hover:text-sage-700"
            }`}
          >
            <WatercolorIcon name="baby" size={12} className=".5 .5" />
            {child.nickname}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Age badge
// ---------------------------------------------------------------------------

function ChildAgeBadge({ child }: { readonly child: ChildProfile }) {
  const { years, months } = getChildAge(child.birthDate);

  const ageLabel = years === 0 ? `${months}ヶ月` : `${years}歳${months}ヶ月`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
        <WatercolorIcon name="baby" size={20} className="text-sage-600" />
      </div>
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {child.nickname}ちゃん
        </h2>
        <span className="inline-flex items-center rounded-full bg-sage-50 px-2.5 py-0.5 text-xs font-medium text-sage-700">
          {ageLabel}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// No profile CTA
// ---------------------------------------------------------------------------

function NoProfileCTA() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/50 px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
        <WatercolorIcon name="baby" size={32} className="text-sage-600" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
        お子さんの情報を登録しましょう
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        お子さんの生年月日を登録すると、
        <br />
        今やるべき手続きを時系列で確認できます。
      </p>
      <Link
        href="/my"
        className="mt-6 inline-flex items-center rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
      >
        プロフィールを設定する
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-full bg-ivory-200" />
      <div className="h-10 w-full animate-pulse rounded-lg bg-ivory-200" />
      <div className="h-28 w-full animate-pulse rounded-xl bg-ivory-200" />
      <div className="h-28 w-full animate-pulse rounded-xl bg-ivory-200" />
      <div className="h-28 w-full animate-pulse rounded-xl bg-ivory-200" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type ViewMode = "top3" | "list" | "calendar";
type TimeFilter = "week" | "month" | "all";

function filterItemsByTime(
  items: readonly TimelineItem[],
  filter: TimeFilter,
): readonly TimelineItem[] {
  if (filter === "all") return items;

  return items.filter((item) => {
    if (item.completed) return true;

    if (filter === "week") {
      return item.urgency === "overdue" || item.urgency === "urgent";
    }
    // month
    return (
      item.urgency === "overdue" ||
      item.urgency === "urgent" ||
      item.urgency === "soon"
    );
  });
}

function TimeFilterEmptyState({ filter }: { readonly filter: TimeFilter }) {
  const label = filter === "week" ? "今週" : "今月";
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/30 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
        <WatercolorIcon name="check" size={28} className="text-sage-500" />
      </div>
      <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
        {label}やることはありません
      </h3>
      <p className="mt-2 text-sm text-muted">
        期限が迫っている手続き・健診・予防接種はありません。
      </p>
    </div>
  );
}

export default function TimelinePage() {
  const store = useStore();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("top3");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  useEffect(() => {
    let cancelled = false;
    store.getFamilyProfile().then((loaded) => {
      if (cancelled) return;
      setProfile(loaded);
      if (loaded && loaded.children.length > 0) {
        setSelectedChildId(loaded.children[0].id);
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const hasChildren = profile != null && profile.children.length > 0;

  const selectedChild =
    hasChildren && selectedChildId != null
      ? (profile.children.find((c) => c.id === selectedChildId) ??
        profile.children[0])
      : null;

  const timelineItems: readonly TimelineItem[] | null =
    selectedChild != null
      ? generateTimeline(selectedChild.birthDate, selectedChild.completedItems)
      : null;

  const filteredItems = useMemo(
    () =>
      timelineItems != null
        ? filterItemsByTime(timelineItems, timeFilter)
        : null,
    [timelineItems, timeFilter],
  );

  const top3Items = useMemo(
    () => (timelineItems != null ? getTop3Items(timelineItems) : []),
    [timelineItems],
  );

  const groupedSections: GroupedSections | null =
    filteredItems != null ? buildGroupedSections(filteredItems) : null;

  const hasFilteredPendingItems =
    filteredItems != null &&
    filteredItems.some((item) => !item.completed && !item.isExpired);

  const handleToggleComplete = useCallback(
    async (itemId: string) => {
      if (profile == null || selectedChild == null) return;

      const item = timelineItems?.find((t) => t.id === itemId);
      if (item && !item.completed) {
        trackTimelineItemCompleted(itemId, item.category);
      }

      const updated = await store.toggleCompletedItem(selectedChild.id, itemId);
      setProfile(updated);
    },
    [profile, selectedChild, store, timelineItems],
  );

  return (
    <>
      <title>タイムライン | すくすくナビ</title>

      {/* Hero */}
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <WatercolorIcon
              name="calendar"
              size={24}
              className="mr-2 inline-block   text-sage-600"
            />
            タイムライン
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            今やるべき手続き・受診・予防接種を時系列で確認できます。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !hasChildren ? (
            <NoProfileCTA />
          ) : (
            <>
              {profile.children.length > 1 && (
                <ChildTabs
                  children={profile.children}
                  selectedId={selectedChildId ?? profile.children[0].id}
                  onSelect={setSelectedChildId}
                />
              )}

              {selectedChild != null && <ChildAgeBadge child={selectedChild} />}

              {selectedChild != null && (
                <div className="flex gap-1 rounded-lg border border-border bg-ivory-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("top3")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                      viewMode === "top3"
                        ? "bg-white text-sage-700 shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <WatercolorIcon name="star" size={16} />
                    今週の3つ
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-sage-700 shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <WatercolorIcon name="star" size={16} />
                    リスト
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                      viewMode === "calendar"
                        ? "bg-white text-sage-700 shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <WatercolorIcon name="calendar" size={16} />
                    カレンダー
                  </button>
                </div>
              )}

              {viewMode === "list" && selectedChild != null && (
                <div className="flex gap-1 rounded-lg border border-border bg-ivory-50 p-1">
                  {(
                    [
                      { key: "week", label: "今週" },
                      { key: "month", label: "今月" },
                      { key: "all", label: "すべて" },
                    ] as const
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTimeFilter(key)}
                      className={`flex flex-1 items-center justify-center rounded-md py-1.5 text-sm font-medium transition-colors ${
                        timeFilter === key
                          ? "bg-white text-sage-700 shadow-sm"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {viewMode === "top3" &&
                selectedChild != null &&
                timelineItems != null && (
                  <Top3View
                    items={top3Items}
                    childName={selectedChild.nickname}
                    onToggleComplete={handleToggleComplete}
                    onShowAll={() => setViewMode("list")}
                  />
                )}

              {viewMode === "calendar" &&
                timelineItems != null &&
                selectedChild != null && (
                  <CalendarView
                    items={timelineItems}
                    birthDate={selectedChild.birthDate}
                    onToggleComplete={handleToggleComplete}
                  />
                )}

              {viewMode === "list" && groupedSections != null && (
                <>
                  {!hasFilteredPendingItems && timeFilter !== "all" && (
                    <TimeFilterEmptyState filter={timeFilter} />
                  )}
                  <div className="space-y-6">
                    {SECTIONS.map((sectionConfig) => (
                      <TimelineSection
                        key={sectionConfig.key}
                        config={sectionConfig}
                        items={groupedSections[sectionConfig.key]}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
