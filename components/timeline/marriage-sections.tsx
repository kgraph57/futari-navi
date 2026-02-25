"use client";

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type {
  MarriageTimelineItem,
  MarriageCategory,
  MarriageUrgency,
} from "@/lib/marriage-timeline-engine";
import {
  TimelineItemCard,
  URGENCY_LABELS,
  URGENCY_BADGE_STYLES,
  CATEGORY_ICONS,
} from "@/components/timeline/marriage-timeline-card";

// ---------------------------------------------------------------------------
// Category section
// ---------------------------------------------------------------------------

export function CategorySection({
  category,
  label,
  items,
  onToggleComplete,
}: {
  readonly category: MarriageCategory;
  readonly label: string;
  readonly items: readonly MarriageTimelineItem[];
  readonly onToggleComplete: (itemId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = items.filter((i) => i.completed).length;
  const iconName = CATEGORY_ICONS[category];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-lg bg-ivory-100 px-4 py-2.5 font-heading text-sm font-semibold text-foreground"
        aria-expanded={isExpanded}
      >
        <WatercolorIcon name={iconName} size={20} />
        <span className="flex-1 text-left">{label}</span>
        <span className="text-xs text-muted">
          {completedCount}/{items.length}件完了
        </span>
        <WatercolorIcon
          name={isExpanded ? "chevron_down" : "chevron_right"}
          size={16}
        />
      </button>

      {isExpanded && (
        <div className="space-y-3">
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
// Urgency section
// ---------------------------------------------------------------------------

export function UrgencySection({
  urgency,
  items,
  onToggleComplete,
}: {
  readonly urgency: MarriageUrgency;
  readonly items: readonly MarriageTimelineItem[];
  readonly onToggleComplete: (itemId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const badge = URGENCY_BADGE_STYLES[urgency];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`flex w-full items-center gap-2 rounded-lg px-4 py-2.5 font-heading text-sm font-semibold ${badge.bg} ${badge.text}`}
        aria-expanded={isExpanded}
      >
        <span className="flex-1 text-left">
          {URGENCY_LABELS[urgency]}
        </span>
        <span className="text-xs opacity-70">{items.length}件</span>
        <WatercolorIcon
          name={isExpanded ? "chevron_down" : "chevron_right"}
          size={16}
        />
      </button>

      {isExpanded && (
        <div className="space-y-3">
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
