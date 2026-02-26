"use client";

import { Users, Flame, UserPlus } from "lucide-react";

interface CoupleStatusBarProps {
  readonly partnerName?: string | null;
  readonly currentStreak?: number;
}

export function CoupleStatusBar({
  partnerName,
  currentStreak = 0,
}: CoupleStatusBarProps) {
  if (!partnerName) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-blush-200 bg-blush-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-blush-400" />
          <p className="text-sm font-medium text-sage-800">
            パートナーを招待しよう!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-ivory-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <Users size={18} className="text-sage-500" />
        <p className="text-sm font-medium text-sage-800">
          {partnerName} とつながっています
        </p>
      </div>
      {currentStreak > 0 && (
        <div className="flex items-center gap-1 rounded-full bg-sage-50 px-2.5 py-1">
          <Flame size={14} className="text-blush-400" />
          <span className="text-xs font-bold text-sage-700">
            {currentStreak}日連続
          </span>
        </div>
      )}
    </div>
  );
}
