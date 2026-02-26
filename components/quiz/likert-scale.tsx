"use client";

import { LIKERT_LABELS } from "@/lib/types";
import clsx from "clsx";

interface LikertScaleProps {
  readonly value: number | null;
  readonly onSelect: (score: number) => void;
  readonly disabled?: boolean;
}

const SCORE_COLORS: readonly string[] = [
  "bg-sage-200 border-sage-300 text-sage-800",
  "bg-sage-300 border-sage-400 text-sage-900",
  "bg-sage-400 border-sage-500 text-white",
  "bg-sage-500 border-sage-600 text-white",
  "bg-sage-600 border-sage-700 text-white",
] as const;

const SELECTED_RING: readonly string[] = [
  "ring-sage-300",
  "ring-sage-400",
  "ring-sage-500",
  "ring-sage-600",
  "ring-sage-700",
] as const;

export function LikertScale({ value, onSelect, disabled }: LikertScaleProps) {
  return (
    <div className="space-y-3">
      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-2 sm:hidden">
        {LIKERT_LABELS.map((label, index) => {
          const score = index + 1;
          const isSelected = value === score;

          return (
            <button
              key={score}
              type="button"
              onClick={() => onSelect(score)}
              disabled={disabled}
              className={clsx(
                "flex min-h-[48px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200",
                isSelected
                  ? `${SCORE_COLORS[index]} ring-2 ${SELECTED_RING[index]} scale-[1.02] shadow-md`
                  : "border-ivory-200 bg-white text-sage-700 hover:border-sage-200 hover:bg-sage-50",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  isSelected
                    ? "bg-white/30 text-current"
                    : "bg-sage-100 text-sage-600",
                )}
              >
                {score}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: horizontal row */}
      <div className="hidden sm:flex sm:gap-2">
        {LIKERT_LABELS.map((label, index) => {
          const score = index + 1;
          const isSelected = value === score;

          return (
            <button
              key={score}
              type="button"
              onClick={() => onSelect(score)}
              disabled={disabled}
              className={clsx(
                "flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-center transition-all duration-200",
                isSelected
                  ? `${SCORE_COLORS[index]} ring-2 ${SELECTED_RING[index]} scale-105 shadow-md`
                  : "border-ivory-200 bg-white text-sage-700 hover:border-sage-200 hover:bg-sage-50",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  isSelected
                    ? "bg-white/30 text-current"
                    : "bg-sage-100 text-sage-600",
                )}
              >
                {score}
              </span>
              <span className="text-[11px] leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
