"use client"

;

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface CitationListProps {
  readonly citations: readonly string[];
}

export function CitationList({ citations }: CitationListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (citations.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-border bg-card">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <WatercolorIcon name="book" size={16} className=".5 .5 text-sage-600" />
          <span className="font-heading text-sm font-semibold text-foreground">
            参考文献（{citations.length}件）
          </span>
        </div>
        <WatercolorIcon name="arrow_right" size={20} />
      </button>

      {isOpen && (
        <div className="border-t border-border px-5 pb-5 pt-3">
          <ol className="space-y-2">
            {citations.map((citation, index) => (
              <li
                key={`citation-${String(index)}`}
                className="flex items-start gap-2 text-xs leading-relaxed text-muted"
              >
                <span className="shrink-0 font-medium text-foreground">
                  [{index + 1}]
                </span>
                <span>{citation}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
