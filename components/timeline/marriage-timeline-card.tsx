"use client";

import { useState } from "react";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { WatercolorIconName } from "@/components/icons/watercolor-icon";
import type {
  MarriageTimelineItem,
  MarriageCategory,
  MarriageUrgency,
} from "@/lib/marriage-timeline-engine";

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const URGENCY_BORDER: Record<MarriageUrgency, string> = {
  overdue: "border-l-red-500",
  urgent: "border-l-orange-400",
  soon: "border-l-amber-400",
  upcoming: "border-l-sage-400",
  future: "border-l-gray-300",
} as const;

export const URGENCY_LABELS: Record<MarriageUrgency, string> = {
  overdue: "期限超過",
  urgent: "至急",
  soon: "もうすぐ",
  upcoming: "近日中",
  future: "今後",
} as const;

export const URGENCY_BADGE_STYLES: Record<
  MarriageUrgency,
  { readonly bg: string; readonly text: string }
> = {
  overdue: { bg: "bg-red-100", text: "text-red-700" },
  urgent: { bg: "bg-orange-100", text: "text-orange-700" },
  soon: { bg: "bg-amber-100", text: "text-amber-700" },
  upcoming: { bg: "bg-sage-100", text: "text-sage-700" },
  future: { bg: "bg-gray-100", text: "text-gray-600" },
} as const;

export const CATEGORY_ICONS: Record<MarriageCategory, WatercolorIconName> = {
  registration: "building",
  name_change: "book",
  moving: "home",
  work: "users",
  tax: "calculator",
  benefits: "heart",
} as const;

// ---------------------------------------------------------------------------
// Document list (collapsible)
// ---------------------------------------------------------------------------

function DocumentList({
  documents,
}: {
  readonly documents: readonly string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (documents.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
      >
        <WatercolorIcon name="clipboard" size={12} />
        必要書類（{documents.length}点）
        <WatercolorIcon
          name={isOpen ? "chevron_down" : "chevron_right"}
          size={12}
        />
      </button>
      {isOpen && (
        <ul className="mt-1 space-y-0.5 pl-4">
          {documents.map((doc) => (
            <li key={doc} className="text-xs text-muted list-disc">
              {doc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timeline item card
// ---------------------------------------------------------------------------

export function TimelineItemCard({
  item,
  onToggleComplete,
}: {
  readonly item: MarriageTimelineItem;
  readonly onToggleComplete: (itemId: string) => void;
}) {
  const borderClass = URGENCY_BORDER[item.urgency];
  const isExternal =
    item.actionUrl.startsWith("https://") ||
    item.actionUrl.startsWith("http://");

  return (
    <div
      className={`flex gap-0 rounded-xl border border-border shadow-sm overflow-hidden border-l-4 ${
        item.completed
          ? "border-l-gray-200 bg-ivory-50 opacity-70"
          : `bg-card ${borderClass}`
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
            <WatercolorIcon
              name="check"
              size={24}
              className={
                item.completed
                  ? "text-sage-500"
                  : "text-gray-300 hover:text-sage-400"
              }
            />
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
            </div>

            <p className="mt-1 text-xs leading-relaxed text-muted">
              {item.description}
            </p>

            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <WatercolorIcon name="mappin" size={12} className="shrink-0" />
              {item.location}
            </p>

            <DocumentList documents={item.requiredDocuments} />

            {!item.completed && item.tip != null && (
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
