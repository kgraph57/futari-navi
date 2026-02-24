"use client"

;

import { useState, useMemo } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { TimelineItem, TimelineUrgency } from "@/lib/timeline-engine";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;

const URGENCY_DOT: Record<TimelineUrgency, string> = {
  overdue: "bg-red-500",
  urgent: "bg-orange-400",
  soon: "bg-amber-400",
  upcoming: "bg-sage-400",
  future: "bg-gray-300",
};

const URGENCY_LABEL: Record<TimelineUrgency, string> = {
  overdue: "期限超過",
  urgent: "至急",
  soon: "今月中",
  upcoming: "3ヶ月以内",
  future: "今後",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getItemDate(birthDate: string, daysFromBirth: number): Date {
  const birth = new Date(birthDate);
  return new Date(birth.getTime() + daysFromBirth * 86400000);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay();
  const grid: (Date | null)[] = Array.from({ length: startDow }, () => null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    grid.push(new Date(year, month, d));
  }
  return grid;
}

// ---------------------------------------------------------------------------
// CalendarView
// ---------------------------------------------------------------------------

interface CalendarViewProps {
  readonly items: readonly TimelineItem[];
  readonly birthDate: string;
  readonly onToggleComplete?: (itemId: string) => void;
}

export function CalendarView({
  items,
  birthDate,
  onToggleComplete,
}: CalendarViewProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const itemsWithDates = useMemo(
    () =>
      items.map((item) => ({
        item,
        date: getItemDate(birthDate, item.daysFromBirth),
      })),
    [items, birthDate],
  );

  const grid = useMemo(
    () => buildCalendarGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  function getItemsForDate(date: Date): readonly TimelineItem[] {
    return itemsWithDates
      .filter(({ date: d }) => isSameDay(d, date))
      .map(({ item }) => item);
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDate(null);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDate(null);
  }

  const selectedItems =
    selectedDate != null ? getItemsForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between rounded-lg bg-ivory-50 px-4 py-3">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          aria-label="前の月"
        >
          <WatercolorIcon name="arrow_right" size={16} className="text-muted" />
        </button>
        <span className="font-heading text-sm font-semibold text-foreground">
          {viewYear}年{viewMonth + 1}月
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          aria-label="次の月"
        >
          <WatercolorIcon name="arrow_right" size={16} className="text-muted" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAY_LABELS.map((label, i) => (
            <div
              key={label}
              className={`py-2 text-center text-xs font-medium ${
                i === 0
                  ? "text-red-500"
                  : i === 6
                    ? "text-blue-500"
                    : "text-muted"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {grid.map((date, idx) => {
            if (date == null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[52px] border-b border-r border-border/40 last:border-r-0"
                />
              );
            }

            const dayItems = getItemsForDate(date);
            const hasItems = dayItems.length > 0;
            const isToday = isSameDay(date, today);
            const isSelected =
              selectedDate != null && isSameDay(date, selectedDate);
            const pendingItems = dayItems.filter((item) => !item.completed);
            const allCompleted =
              dayItems.length > 0 && pendingItems.length === 0;
            const topUrgencies = pendingItems
              .slice(0, 3)
              .map((item) => item.urgency);
            const dow = date.getDay();

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDate(isSelected ? null : date)}
                className={`relative flex min-h-[52px] flex-col items-center gap-1 border-b border-r border-border/40 p-1 transition-colors last:border-r-0 ${
                  isSelected
                    ? "bg-sage-50"
                    : hasItems
                      ? "cursor-pointer hover:bg-ivory-50"
                      : "hover:bg-ivory-50/50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-sage-600 text-white"
                      : isSelected
                        ? "font-bold text-sage-700"
                        : dow === 0
                          ? "text-red-500"
                          : dow === 6
                            ? "text-blue-500"
                            : "text-foreground"
                  }`}
                >
                  {date.getDate()}
                </span>
                {hasItems &&
                  (allCompleted ? (
                    <WatercolorIcon name="check" size={12} className="text-sage-400" />
                  ) : (
                    <div className="flex flex-wrap justify-center gap-0.5 px-0.5">
                      {topUrgencies.map((urgency, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[urgency]}`}
                        />
                      ))}
                    </div>
                  ))}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {(["overdue", "urgent", "soon", "upcoming", "future"] as const).map(
          (u) => (
            <span
              key={u}
              className="flex items-center gap-1 text-xs text-muted"
            >
              <span className={`h-2 w-2 rounded-full ${URGENCY_DOT[u]}`} />
              {URGENCY_LABEL[u]}
            </span>
          ),
        )}
      </div>

      {/* Selected day panel */}
      {selectedDate != null && (
        <div className="rounded-xl border border-sage-100 bg-sage-50/40 p-4">
          <p className="font-heading text-sm font-semibold text-foreground">
            {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
          </p>
          {selectedItems.length === 0 ? (
            <p className="mt-2 text-sm text-muted">この日の予定はありません</p>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border border-border p-3 ${
                    item.completed ? "bg-ivory-50 opacity-70" : "bg-card"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {onToggleComplete != null ? (
                      <button
                        type="button"
                        onClick={() => onToggleComplete(item.id)}
                        className="mt-0.5 shrink-0"
                        aria-label={
                          item.completed ? "未完了に戻す" : "完了にする"
                        }
                      >
                        {item.completed ? (
                          <WatercolorIcon name="check" size={16} className="text-sage-500" />
                        ) : (
                          <WatercolorIcon name="check" size={16} className="text-gray-300 hover:text-sage-400" />
                        )}
                      </button>
                    ) : (
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT[item.urgency]}`}
                      />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          item.completed
                            ? "text-muted line-through"
                            : "text-card-foreground"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
