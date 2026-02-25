import type { GamificationState } from "@/lib/types";
import { getInitialLoveTankState } from "./love-tank-engine";

const STORAGE_KEY = "futari-gamification";

function getInitialState(): GamificationState {
  return {
    loveTank: getInitialLoveTankState(),
    earnedBadges: [],
    totalPoints: 0,
    weeklyPoints: 0,
    firstUsedDate: new Date().toISOString(),
  };
}

export function getGamificationState(): GamificationState {
  if (typeof window === "undefined") return getInitialState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    return JSON.parse(raw) as GamificationState;
  } catch {
    return getInitialState();
  }
}

export function saveGamificationState(state: GamificationState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage errors
  }
}
