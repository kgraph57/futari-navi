import type { LoveTankState, LoveTankEntry } from "@/lib/types";

const DECAY_PER_DAY = 5;
const MAX_LEVEL = 100;

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.floor(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay,
  );
}

export function calculateTankLevel(state: LoveTankState): number {
  const today = toDateString(new Date());
  const daysSinceUpdate = daysBetween(
    state.lastUpdated.slice(0, 10),
    today,
  );

  if (daysSinceUpdate <= 0) return state.level;

  const decayed = state.level - daysSinceUpdate * DECAY_PER_DAY;
  return Math.max(0, Math.min(MAX_LEVEL, decayed));
}

export function addPoints(
  state: LoveTankState,
  points: number,
  action: string,
): LoveTankState {
  const today = toDateString(new Date());
  const currentLevel = calculateTankLevel(state);
  const newLevel = Math.min(MAX_LEVEL, currentLevel + points);

  const existingEntry = state.history.find((e) => e.date === today);

  const updatedHistory: readonly LoveTankEntry[] = existingEntry
    ? state.history.map((e) =>
        e.date === today
          ? {
              ...e,
              points: e.points + points,
              actions: [...e.actions, action],
            }
          : e,
      )
    : [
        ...state.history,
        { date: today, points, actions: [action] },
      ];

  return {
    level: newLevel,
    lastUpdated: new Date().toISOString(),
    history: updatedHistory,
  };
}

export function getTankColor(
  level: number,
): string {
  if (level <= 30) return "from-coral-300 to-coral-400";
  if (level <= 60) return "from-gold-300 to-gold-400";
  return "from-sage-300 to-sage-400";
}

export function getTankMessage(level: number): string {
  if (level === 0) return "今日からふたりの愛情を育てよう！";
  if (level <= 20) return "少しずつ始めよう。毎日の積み重ねが大切。";
  if (level <= 40) return "いい調子！ふたりの絆が深まっています。";
  if (level <= 60) return "順調です！この調子で続けよう。";
  if (level <= 80) return "すばらしい！ふたりの愛情がたっぷり。";
  if (level < 100) return "あと少しで満タン！";
  return "愛情満タン！ふたりは最高のパートナー。";
}

export function getInitialLoveTankState(): LoveTankState {
  return {
    level: 0,
    lastUpdated: new Date().toISOString(),
    history: [],
  };
}
