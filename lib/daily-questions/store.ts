import type { DailyQuestionState } from "@/lib/types";

const STORAGE_KEY = "futari-daily-questions";

function getInitialState(): DailyQuestionState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalAnswered: 0,
    answers: [],
    lastAnsweredDate: null,
  };
}

export function getDailyState(): DailyQuestionState {
  if (typeof window === "undefined") return getInitialState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    return JSON.parse(raw) as DailyQuestionState;
  } catch {
    return getInitialState();
  }
}

export function saveDailyState(state: DailyQuestionState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage errors
  }
}
