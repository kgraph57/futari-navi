"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import {
  generateMarriageTimeline,
  groupByCategory,
} from "@/lib/marriage-timeline-engine";
import type {
  MarriageTimelineItem,
  MarriageUrgency,
  MarriageTimelineOptions,
} from "@/lib/marriage-timeline-engine";
import { CategorySection, UrgencySection } from "@/components/timeline/marriage-sections";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_DATE = "futari-navi-marriage-date";
const STORAGE_KEY_OPTIONS = "futari-navi-marriage-options";
const STORAGE_KEY_COMPLETED = "futari-navi-completed-items";

type ViewMode = "category" | "urgency";

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function loadStoredDate(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY_DATE);
}

function loadStoredOptions(): MarriageTimelineOptions {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OPTIONS);
    if (raw == null) return {};
    return JSON.parse(raw) as MarriageTimelineOptions;
  } catch {
    return {};
  }
}

function loadCompletedIds(): ReadonlySet<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    if (raw == null) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveDate(date: string): void {
  localStorage.setItem(STORAGE_KEY_DATE, date);
}

function saveOptions(options: MarriageTimelineOptions): void {
  localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
}

function saveCompletedIds(ids: ReadonlySet<string>): void {
  localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify([...ids]));
}

// ---------------------------------------------------------------------------
// Setup form
// ---------------------------------------------------------------------------

function SetupForm({
  onSubmit,
}: {
  readonly onSubmit: (date: string, options: MarriageTimelineOptions) => void;
}) {
  const [dateValue, setDateValue] = useState("");
  const [includeMoving, setIncludeMoving] = useState(false);
  const [nameChanged, setNameChanged] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sage-200 bg-sage-50/50 px-6 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
        <WatercolorIcon name="calendar" size={32} className="text-sage-600" />
      </div>
      <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
        結婚予定日を登録しましょう
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        結婚日（予定日）を登録すると、
        <br />
        やるべき手続きをタイムラインで確認できます。
      </p>

      <div className="mt-6 w-full max-w-xs space-y-4">
        <div>
          <label
            htmlFor="marriage-date"
            className="block text-left text-sm font-medium text-foreground"
          >
            結婚日（予定日）
          </label>
          <input
            id="marriage-date"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
          />
        </div>

        <div className="space-y-2 text-left">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={includeMoving}
              onChange={(e) => setIncludeMoving(e.target.checked)}
              className="h-4 w-4 rounded border-border text-sage-600 focus:ring-sage-500"
            />
            引越し予定あり
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={nameChanged}
              onChange={(e) => setNameChanged(e.target.checked)}
              className="h-4 w-4 rounded border-border text-sage-600 focus:ring-sage-500"
            />
            姓変更あり
          </label>
        </div>

        <button
          type="button"
          disabled={dateValue === ""}
          onClick={() => onSubmit(dateValue, { includeMoving, nameChanged })}
          className="w-full rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          タイムラインを作成
        </button>
      </div>
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
// Progress header
// ---------------------------------------------------------------------------

function ProgressHeader({
  marriageDate,
  items,
  onEditSettings,
}: {
  readonly marriageDate: Date;
  readonly items: readonly MarriageTimelineItem[];
  readonly onEditSettings: () => void;
}) {
  const today = new Date();
  const diffMs = marriageDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WatercolorIcon name="heart" size={20} className="text-sage-600" />
          <span className="font-heading text-sm font-semibold text-foreground">
            {diffDays > 0
              ? `結婚日まであと${diffDays}日`
              : diffDays === 0
                ? "今日が結婚日です"
                : `結婚してから${Math.abs(diffDays)}日`}
          </span>
        </div>
        <button
          type="button"
          onClick={onEditSettings}
          className="text-xs text-sage-600 hover:text-sage-700 underline"
        >
          設定を変更
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>完了 {completedCount}/{totalCount}件</span>
          <span>{progressPct}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ivory-200">
          <div
            className="h-full rounded-full bg-sage-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function TimelinePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [marriageDateStr, setMarriageDateStr] = useState<string | null>(null);
  const [options, setOptions] = useState<MarriageTimelineOptions>({});
  const [completedIds, setCompletedIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("category");

  useEffect(() => {
    setMarriageDateStr(loadStoredDate());
    setOptions(loadStoredOptions());
    setCompletedIds(loadCompletedIds());
    setIsLoading(false);
  }, []);

  const marriageDate = useMemo(
    () => (marriageDateStr != null ? new Date(marriageDateStr) : null),
    [marriageDateStr],
  );

  const timelineItems = useMemo(() => {
    if (marriageDate == null) return null;
    return generateMarriageTimeline(marriageDate, options, completedIds);
  }, [marriageDate, options, completedIds]);

  const categoryGroups = useMemo(
    () => (timelineItems != null ? groupByCategory(timelineItems) : []),
    [timelineItems],
  );

  const urgencyGroups = useMemo(() => {
    if (timelineItems == null) return [];
    const order: readonly MarriageUrgency[] = [
      "overdue", "urgent", "soon", "upcoming", "future",
    ];
    return order
      .map((u) => ({
        urgency: u,
        items: timelineItems.filter((item) => item.urgency === u),
      }))
      .filter((g) => g.items.length > 0);
  }, [timelineItems]);

  const handleSetup = useCallback(
    (date: string, opts: MarriageTimelineOptions) => {
      saveDate(date);
      saveOptions(opts);
      setMarriageDateStr(date);
      setOptions(opts);
      setIsEditing(false);
    },
    [],
  );

  const handleToggleComplete = useCallback(
    (itemId: string) => {
      const next = new Set(completedIds);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      const frozen: ReadonlySet<string> = next;
      setCompletedIds(frozen);
      saveCompletedIds(frozen);
    },
    [completedIds],
  );

  const showSetup = !isLoading && (marriageDateStr == null || isEditing);

  return (
    <>
      <title>タイムライン | ふたりナビ</title>

      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <WatercolorIcon
              name="calendar"
              size={24}
              className="mr-2 inline-block text-sage-600"
            />
            タイムライン
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            結婚前後の手続きをタイムラインで管理できます。
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : showSetup ? (
            <SetupForm onSubmit={handleSetup} />
          ) : (
            <>
              {marriageDate != null && timelineItems != null && (
                <ProgressHeader
                  marriageDate={marriageDate}
                  items={timelineItems}
                  onEditSettings={() => setIsEditing(true)}
                />
              )}

              <div className="flex gap-1 rounded-lg border border-border bg-ivory-50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("category")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "category"
                      ? "bg-white text-sage-700 shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <WatercolorIcon name="clipboard" size={16} />
                  カテゴリ
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("urgency")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                    viewMode === "urgency"
                      ? "bg-white text-sage-700 shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <WatercolorIcon name="alert" size={16} />
                  緊急度
                </button>
              </div>

              {viewMode === "category" && (
                <div className="space-y-6">
                  {categoryGroups.map((group) => (
                    <CategorySection
                      key={group.category}
                      category={group.category}
                      label={group.label}
                      items={group.items}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              )}

              {viewMode === "urgency" && (
                <div className="space-y-6">
                  {urgencyGroups.map((group) => (
                    <UrgencySection
                      key={group.urgency}
                      urgency={group.urgency}
                      items={group.items}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
