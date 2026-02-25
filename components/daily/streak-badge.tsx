"use client";

interface StreakBadgeProps {
  readonly streak: number;
  readonly className?: string;
}

export function StreakBadge({ streak, className = "" }: StreakBadgeProps) {
  if (streak <= 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-coral-50 px-2.5 py-1 text-xs font-bold text-coral-600 ring-1 ring-inset ring-coral-200 ${className}`}
    >
      <span className="animate-pulse">🔥</span>
      {streak}日連続
    </span>
  );
}
