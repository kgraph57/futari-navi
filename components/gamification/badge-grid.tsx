"use client";

import { useEffect, useState } from "react";
import type { BadgeDefinition, EarnedBadge } from "@/lib/types";
import { getAllBadges } from "@/lib/gamification/badge-engine";
import { getGamificationState } from "@/lib/gamification/store";

const TIER_RING: Record<string, string> = {
  bronze: "ring-amber-200",
  silver: "ring-gray-300",
  gold: "ring-yellow-300",
};

const TIER_BG: Record<string, string> = {
  bronze: "bg-amber-50",
  silver: "bg-gray-50",
  gold: "bg-yellow-50",
};

export function BadgeGrid() {
  const [earnedBadges, setEarnedBadges] = useState<readonly EarnedBadge[]>([]);
  const allBadges = getAllBadges();

  useEffect(() => {
    const state = getGamificationState();
    setEarnedBadges(state.earnedBadges);
  }, []);

  const earnedIds = new Set(earnedBadges.map((b) => b.badgeId));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {allBadges.map((badge: BadgeDefinition) => {
        const isEarned = earnedIds.has(badge.id);
        const earned = earnedBadges.find((b) => b.badgeId === badge.id);

        return (
          <div
            key={badge.id}
            className={`rounded-xl border p-4 text-center transition-all ${
              isEarned
                ? `border-ivory-200 ${TIER_BG[badge.tier]} ring-1 ${TIER_RING[badge.tier]}`
                : "border-dashed border-ivory-200 bg-ivory-50 opacity-50"
            }`}
          >
            <span className="text-2xl">{isEarned ? badge.icon : "❓"}</span>
            <p
              className={`mt-2 text-xs font-bold ${
                isEarned ? "text-sage-800" : "text-muted"
              }`}
            >
              {isEarned ? badge.name : "???"}
            </p>
            {isEarned && earned ? (
              <p className="mt-0.5 text-[10px] text-muted">
                {new Date(earned.earnedAt).toLocaleDateString("ja-JP", {
                  month: "short",
                  day: "numeric",
                })}
                に獲得
              </p>
            ) : (
              <p className="mt-0.5 text-[10px] text-muted">未獲得</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
