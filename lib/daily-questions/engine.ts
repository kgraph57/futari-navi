import type {
  DailyQuestion,
  DailyAnswer,
  DailyQuestionState,
} from "@/lib/types";

function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getTodaysQuestion(
  questions: readonly DailyQuestion[],
  answeredIds: readonly string[],
  date?: Date,
): DailyQuestion | null {
  if (questions.length === 0) return null;

  const today = date ?? new Date();
  const dateStr = toDateString(today);
  const weekend = isWeekend(dateStr);

  const answeredSet = new Set(answeredIds);
  const available = questions.filter((q) => !answeredSet.has(q.id));
  const pool = available.length > 0 ? available : questions;

  const preferred = weekend
    ? pool.filter((q) => q.depth === "deep" || q.depth === "medium")
    : pool.filter((q) => q.depth === "light" || q.depth === "medium");

  const finalPool = preferred.length > 0 ? preferred : pool;
  const index = hashDate(dateStr) % finalPool.length;

  return finalPool[index];
}

export function calculateStreak(
  answers: readonly DailyAnswer[],
): { readonly currentStreak: number; readonly longestStreak: number } {
  if (answers.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...answers].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const today = toDateString(new Date());
  const yesterday = toDateString(new Date(Date.now() - 86_400_000));

  let currentStreak = 0;
  if (sorted[0].date === today || sorted[0].date === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].date);
      const curr = new Date(sorted[i].date);
      const diff = (prev.getTime() - curr.getTime()) / 86_400_000;
      if (Math.round(diff) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  let longestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diff = (prev.getTime() - curr.getTime()) / 86_400_000;
    if (Math.round(diff) === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
}

export function submitAnswer(
  state: DailyQuestionState,
  questionId: string,
  answer: string,
): DailyQuestionState {
  const today = toDateString(new Date());
  const now = new Date().toISOString();

  const newAnswer: DailyAnswer = {
    date: today,
    questionId,
    myAnswer: answer,
    partnerAnswer: null,
    answeredAt: now,
  };

  const updatedAnswers = [...state.answers, newAnswer];
  const { currentStreak, longestStreak } = calculateStreak(updatedAnswers);

  return {
    currentStreak,
    longestStreak,
    totalAnswered: state.totalAnswered + 1,
    answers: updatedAnswers,
    lastAnsweredDate: today,
  };
}

export function addPartnerAnswer(
  state: DailyQuestionState,
  date: string,
  partnerAnswer: string,
): DailyQuestionState {
  return {
    ...state,
    answers: state.answers.map((a) =>
      a.date === date ? { ...a, partnerAnswer } : a,
    ),
  };
}
