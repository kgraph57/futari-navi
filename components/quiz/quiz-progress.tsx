"use client";

import clsx from "clsx";

interface QuizProgressProps {
  readonly current: number;
  readonly total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-sage-600">
          質問 {current} / {total}
        </span>
        <span className="text-xs text-muted">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 pt-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={clsx(
              "h-2 w-2 rounded-full transition-all duration-300",
              i < current
                ? "bg-sage-500 scale-100"
                : i === current
                  ? "bg-sage-300 scale-110"
                  : "bg-ivory-200",
            )}
          />
        ))}
      </div>
    </div>
  );
}
