"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import {
  generateMarriageTimeline,
  getThisWeekEvents,
  getThisMonthEvents,
  type MarriageTimelineOptions,
} from "@/lib/marriage-timeline-engine";

const STORAGE_KEY = "futari-marriage-date";
const OPTIONS_KEY = "futari-timeline-options";
const COMPLETED_KEY = "futari-completed-items";

function loadStoredDate(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

function loadCompletedIds(): ReadonlySet<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function loadOptions(): MarriageTimelineOptions {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OPTIONS_KEY);
    return raw ? (JSON.parse(raw) as MarriageTimelineOptions) : {};
  } catch {
    return {};
  }
}

interface TaskStats {
  readonly total: number;
  readonly completed: number;
  readonly thisWeek: number;
  readonly thisMonth: number;
  readonly overdue: number;
  readonly percent: number;
}

function computeStats(dateStr: string): TaskStats | null {
  if (!dateStr) return null;
  const marriageDate = new Date(dateStr);
  if (isNaN(marriageDate.getTime())) return null;

  const completedIds = loadCompletedIds();
  const options = loadOptions();
  const items = generateMarriageTimeline(marriageDate, options, completedIds);
  const weekItems = getThisWeekEvents(items);
  const monthItems = getThisMonthEvents(items);
  const overdue = items.filter(
    (i) => !i.completed && i.urgency === "overdue",
  ).length;
  const completed = items.filter((i) => i.completed).length;

  return {
    total: items.length,
    completed,
    thisWeek: weekItems.length,
    thisMonth: monthItems.length,
    overdue,
    percent: items.length > 0 ? Math.round((completed / items.length) * 100) : 0,
  };
}

export function HeroDateInput() {
  const router = useRouter();
  const [dateStr, setDateStr] = useState("");
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadStoredDate();
    if (stored) {
      setDateStr(stored);
      setStats(computeStats(stored));
    }
  }, []);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDateStr(value);
      if (value) {
        localStorage.setItem(STORAGE_KEY, value);
        setStats(computeStats(value));
      } else {
        setStats(null);
      }
    },
    [],
  );

  const handleStart = useCallback(() => {
    if (dateStr) {
      localStorage.setItem(STORAGE_KEY, dateStr);
      router.push("/my/timeline");
    }
  }, [dateStr, router]);

  if (!mounted) {
    return <HeroDateInputSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-sage-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:p-8">
        <label
          htmlFor="marriage-date"
          className="block text-center text-sm font-medium text-sage-700"
        >
          婚姻届を出した日（または予定日）
        </label>
        <input
          id="marriage-date"
          type="date"
          value={dateStr}
          onChange={handleDateChange}
          className="mt-3 w-full rounded-xl border border-sage-200 bg-ivory-50 px-4 py-3.5 text-center text-lg font-semibold text-sage-800 transition-colors focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100"
        />

        {stats && (
          <div className="mt-5 space-y-3">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-sage-600">
                <span>
                  手続き完了率
                </span>
                <span className="font-bold text-sage-800">
                  {stats.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-sage-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-sage-500">
                {stats.completed} / {stats.total} 件完了
              </p>
            </div>

            {/* Urgency stats */}
            <div className="grid grid-cols-3 gap-2">
              {stats.overdue > 0 && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-red-600">
                    {stats.overdue}
                  </p>
                  <p className="text-[10px] font-medium text-red-500">
                    期限超過
                  </p>
                </div>
              )}
              <div
                className={`rounded-lg bg-amber-50 px-3 py-2 text-center ${stats.overdue === 0 ? "col-span-1" : ""}`}
              >
                <p className="text-lg font-bold text-amber-600">
                  {stats.thisWeek}
                </p>
                <p className="text-[10px] font-medium text-amber-500">
                  今週やること
                </p>
              </div>
              <div className="rounded-lg bg-sage-50 px-3 py-2 text-center">
                <p className="text-lg font-bold text-sage-600">
                  {stats.thisMonth}
                </p>
                <p className="text-[10px] font-medium text-sage-500">
                  今月やること
                </p>
              </div>
              {stats.overdue === 0 && (
                <div className="rounded-lg bg-teal-50 px-3 py-2 text-center">
                  <p className="text-lg font-bold text-teal-600">
                    {stats.total - stats.completed}
                  </p>
                  <p className="text-[10px] font-medium text-teal-500">
                    残りの手続き
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={!dateStr}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-sage-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-sage-200 disabled:text-sage-400"
        >
          <WatercolorIcon name="calendar" size={18} />
          {stats ? "タイムラインを見る" : "やることリストを作成"}
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-sage-400">
        <span className="flex items-center gap-1">
          <WatercolorIcon name="check" size={12} />
          登録不要
        </span>
        <span className="flex items-center gap-1">
          <WatercolorIcon name="check" size={12} />
          無料
        </span>
        <span className="flex items-center gap-1">
          <WatercolorIcon name="check" size={12} />
          3秒で開始
        </span>
      </div>
    </div>
  );
}

function HeroDateInputSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-sage-200 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:p-8">
        <div className="mx-auto h-4 w-48 animate-pulse rounded bg-sage-100" />
        <div className="mt-3 h-12 w-full animate-pulse rounded-xl bg-sage-50" />
        <div className="mt-5 h-12 w-full animate-pulse rounded-xl bg-sage-100" />
      </div>
    </div>
  );
}
