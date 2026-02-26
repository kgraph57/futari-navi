"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import {
  generateMarriageTimeline,
  groupByCategory,
  parseLocalDate,
} from "@/lib/marriage-timeline-engine";
import type {
  MarriageTimelineItem,
  MarriageUrgency,
  MarriageTimelineOptions,
} from "@/lib/marriage-timeline-engine";
import {
  CategorySection,
  UrgencySection,
} from "@/components/timeline/marriage-sections";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY_DATE = "futari-navi-marriage-date";
const STORAGE_KEY_OPTIONS = "futari-navi-marriage-options";
const STORAGE_KEY_COMPLETED = "futari-navi-completed-items";

type ViewMode = "category" | "urgency" | "schedule";

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
          className="w-full rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-40"
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard (big completion rate)
// ---------------------------------------------------------------------------

function Dashboard({
  marriageDate,
  items,
  onEditSettings,
}: {
  readonly marriageDate: Date;
  readonly items: readonly MarriageTimelineItem[];
  readonly onEditSettings: () => void;
}) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = marriageDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const pct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const overdueCount = items.filter(
    (i) => !i.completed && i.urgency === "overdue",
  ).length;
  const urgentCount = items.filter(
    (i) => !i.completed && i.urgency === "urgent",
  ).length;
  const soonCount = items.filter(
    (i) => !i.completed && i.urgency === "soon",
  ).length;
  const needsActionCount = overdueCount + urgentCount + soonCount;

  const circumference = 2 * Math.PI * 54;
  const strokeOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <WatercolorIcon name="heart" size={18} className="text-sage-600" />
          <span className="text-sm font-medium text-muted">
            {diffDays > 0
              ? `結婚日まであと ${diffDays} 日`
              : diffDays === 0
                ? "今日が結婚日です"
                : `結婚してから ${Math.abs(diffDays)} 日`}
          </span>
        </div>
        <button
          type="button"
          onClick={onEditSettings}
          className="text-xs text-sage-500 underline hover:text-sage-700"
        >
          設定変更
        </button>
      </div>

      <div className="mt-6 flex items-center gap-8">
        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke={pct === 100 ? "#10B981" : "#0D9488"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 64 64)"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-sage-800">{pct}%</span>
            <span className="text-[10px] text-sage-500">完了</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-ivory-50 px-3 py-2">
            <span className="text-xs text-muted">完了</span>
            <span className="text-sm font-bold text-sage-700">
              {completedCount} / {totalCount}
            </span>
          </div>
          {needsActionCount > 0 && (
            <div
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                overdueCount > 0
                  ? "bg-red-50"
                  : urgentCount > 0
                    ? "bg-amber-50"
                    : "bg-teal-50"
              }`}
            >
              <span className="text-xs text-muted">
                {overdueCount > 0
                  ? "期限超過"
                  : urgentCount > 0
                    ? "急ぎ"
                    : "今すぐ"}
              </span>
              <span
                className={`text-sm font-bold ${
                  overdueCount > 0
                    ? "text-red-600"
                    : urgentCount > 0
                      ? "text-amber-600"
                      : "text-teal-600"
                }`}
              >
                {overdueCount > 0
                  ? overdueCount
                  : urgentCount > 0
                    ? urgentCount
                    : soonCount}{" "}
                件
              </span>
            </div>
          )}
          {pct === 100 && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
              すべて完了しました!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Model schedule (1日で終わるスケジュール)
// ---------------------------------------------------------------------------

interface ScheduleSlot {
  readonly time: string;
  readonly location: string;
  readonly tasks: readonly MarriageTimelineItem[];
  readonly duration: string;
}

function buildModelSchedule(
  items: readonly MarriageTimelineItem[],
): readonly ScheduleSlot[] {
  const pending = items.filter((i) => !i.completed);

  const cityHallTasks = pending.filter(
    (i) =>
      i.location.includes("市区町村") ||
      i.location.includes("窓口") ||
      i.location.includes("役所") ||
      i.location.includes("役場"),
  );
  const policeTasks = pending.filter(
    (i) => i.location.includes("警察署") || i.location.includes("運転免許"),
  );
  const bankTasks = pending.filter(
    (i) =>
      i.location.includes("銀行") ||
      i.location.includes("カード会社") ||
      i.location.includes("キャリア"),
  );
  const workTasks = pending.filter(
    (i) => i.location.includes("勤務先") || i.location.includes("人事"),
  );
  const webTasks = pending.filter(
    (i) =>
      i.location.includes("Web") ||
      i.location.includes("電話") ||
      i.location.includes("アプリ") ||
      i.location.includes("プロバイダー") ||
      i.location.includes("各事業者"),
  );

  const slots: ScheduleSlot[] = [];

  if (cityHallTasks.length > 0) {
    slots.push({
      time: "9:00",
      location: "市区町村の窓口",
      tasks: cityHallTasks,
      duration: `約${Math.max(30, cityHallTasks.length * 20)}分`,
    });
  }

  if (policeTasks.length > 0) {
    slots.push({
      time: cityHallTasks.length > 0 ? "10:30" : "9:00",
      location: "警察署 / 免許センター",
      tasks: policeTasks,
      duration: "約30分",
    });
  }

  if (bankTasks.length > 0) {
    const startTime =
      cityHallTasks.length > 0 && policeTasks.length > 0
        ? "11:30"
        : cityHallTasks.length > 0
          ? "10:30"
          : "9:00";
    slots.push({
      time: startTime,
      location: "銀行・カード会社",
      tasks: bankTasks,
      duration: `約${bankTasks.length * 20}分`,
    });
  }

  if (workTasks.length > 0) {
    slots.push({
      time: "翌営業日",
      location: "勤務先の人事部",
      tasks: workTasks,
      duration: "約15分",
    });
  }

  if (webTasks.length > 0) {
    slots.push({
      time: "自宅（夜でもOK）",
      location: "Web / 電話",
      tasks: webTasks,
      duration: `約${webTasks.length * 10}分`,
    });
  }

  return slots;
}

function ModelScheduleView({
  items,
  onToggleComplete,
}: {
  readonly items: readonly MarriageTimelineItem[];
  readonly onToggleComplete: (id: string) => void;
}) {
  const slots = useMemo(() => buildModelSchedule(items), [items]);
  const pendingCount = items.filter((i) => !i.completed).length;

  if (pendingCount === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 py-12 text-center">
        <WatercolorIcon
          name="check"
          size={48}
          className="mx-auto text-emerald-500"
        />
        <p className="mt-3 font-heading text-lg font-semibold text-emerald-700">
          すべての手続きが完了しました!
        </p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-ivory-50 p-6 text-center text-sm text-muted">
        窓口手続きが見つかりません。カテゴリビューで個別にご確認ください。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-sage-200 bg-sage-50 p-4">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-sage-800">
          <WatercolorIcon name="calendar" size={16} className="text-sage-600" />
          1日で回れるモデルスケジュール
        </h3>
        <p className="mt-1 text-xs text-sage-600">
          効率的に窓口を回る順番を提案します。完了したらチェックを入れましょう。
        </p>
      </div>

      {slots.map((slot, idx) => (
        <div
          key={`${slot.time}-${slot.location}`}
          className="relative rounded-xl border border-border bg-card p-5"
        >
          {/* Timeline connector */}
          {idx < slots.length - 1 && (
            <div className="absolute -bottom-4 left-8 h-4 w-0.5 bg-sage-200" />
          )}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-700">
              {slot.time.length <= 5 ? slot.time : (idx + 1).toString()}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {slot.location}
              </p>
              <p className="text-xs text-muted">
                {slot.time.length > 5 ? slot.time : ""} {slot.duration}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2 pl-[52px]">
            {slot.tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-start gap-2.5 rounded-lg border border-border bg-ivory-50 px-3 py-2.5 transition-colors hover:bg-ivory-100"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task.id)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border text-sage-600 focus:ring-sage-500"
                />
                <div className="flex-1">
                  <span
                    className={`text-sm font-medium ${
                      task.completed
                        ? "text-muted line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.requiredDocuments.length > 0 && !task.completed && (
                    <p className="mt-1 text-[11px] text-sage-500">
                      持ち物: {task.requiredDocuments.join("、")}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-700">
        <strong>持ち物まとめ:</strong>{" "}
        {Array.from(
          new Set(
            slots
              .flatMap((s) => s.tasks)
              .filter((t) => !t.completed)
              .flatMap((t) => t.requiredDocuments),
          ),
        ).join("、") || "なし"}
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
  const [viewMode, setViewMode] = useState<ViewMode>("schedule");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from localStorage
    setMarriageDateStr(loadStoredDate());
    setOptions(loadStoredOptions());
    setCompletedIds(loadCompletedIds());
    setIsLoading(false);
  }, []);

  const marriageDate = useMemo(() => {
    if (marriageDateStr == null) return null;
    const d = parseLocalDate(marriageDateStr);
    return isNaN(d.getTime()) ? null : d;
  }, [marriageDateStr]);

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
      "overdue",
      "urgent",
      "soon",
      "upcoming",
      "future",
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

      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-6 pt-8 sm:pb-8 sm:pt-12">
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
            結婚前後の手続きをタイムラインで管理。完了したらチェック。
          </p>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : showSetup ? (
            <SetupForm onSubmit={handleSetup} />
          ) : (
            <>
              {/* Dashboard */}
              {marriageDate != null && timelineItems != null && (
                <Dashboard
                  marriageDate={marriageDate}
                  items={timelineItems}
                  onEditSettings={() => setIsEditing(true)}
                />
              )}

              {/* View mode tabs */}
              <div className="flex gap-1 rounded-lg border border-border bg-ivory-50 p-1">
                {(
                  [
                    {
                      mode: "schedule" as const,
                      icon: "calendar" as const,
                      label: "スケジュール",
                    },
                    {
                      mode: "category" as const,
                      icon: "clipboard" as const,
                      label: "カテゴリ",
                    },
                    {
                      mode: "urgency" as const,
                      icon: "alert" as const,
                      label: "緊急度",
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.mode}
                    type="button"
                    onClick={() => setViewMode(tab.mode)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                      viewMode === tab.mode
                        ? "bg-white text-sage-700 shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <WatercolorIcon name={tab.icon} size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Schedule view */}
              {viewMode === "schedule" && timelineItems != null && (
                <ModelScheduleView
                  items={timelineItems}
                  onToggleComplete={handleToggleComplete}
                />
              )}

              {/* Category view */}
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

              {/* Urgency view */}
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

              {/* Simulator CTA */}
              <div className="rounded-xl border border-sage-200 bg-sage-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sage-100">
                    <WatercolorIcon
                      name="calculator"
                      size={20}
                      className="text-sage-600"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-sage-800">
                      もらえる給付金をチェック
                    </p>
                    <p className="mt-0.5 text-xs text-sage-600">
                      最大60万円の補助。申請しないともらえません。
                    </p>
                  </div>
                  <Link
                    href="/simulator"
                    className="flex-shrink-0 rounded-full bg-sage-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-700"
                  >
                    診断する
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
