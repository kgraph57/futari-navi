import type {
  BadgeId,
  BadgeDefinition,
  EarnedBadge,
  DailyQuestionState,
  GamificationState,
  QuestionCategory,
} from "@/lib/types";
import badgesData from "@/data/badges.json";

const ALL_BADGES = badgesData as readonly BadgeDefinition[];
const ALL_CATEGORIES: readonly QuestionCategory[] = [
  "communication",
  "dreams",
  "memories",
  "values",
  "fun",
  "newlywed",
];

export function getBadgeDefinition(
  badgeId: BadgeId,
): BadgeDefinition | undefined {
  return ALL_BADGES.find((b) => b.id === badgeId);
}

export function getAllBadges(): readonly BadgeDefinition[] {
  return ALL_BADGES;
}

export function checkNewBadges(
  questionState: DailyQuestionState,
  gamificationState: GamificationState,
  answeredCategories?: readonly QuestionCategory[],
): readonly BadgeId[] {
  const earned = new Set(gamificationState.earnedBadges.map((b) => b.badgeId));
  const newBadges: BadgeId[] = [];

  // First question
  if (!earned.has("first-question") && questionState.totalAnswered >= 1) {
    newBadges.push("first-question");
  }

  // Streaks
  if (!earned.has("streak-3") && questionState.currentStreak >= 3) {
    newBadges.push("streak-3");
  }
  if (!earned.has("streak-7") && questionState.currentStreak >= 7) {
    newBadges.push("streak-7");
  }
  if (!earned.has("streak-30") && questionState.currentStreak >= 30) {
    newBadges.push("streak-30");
  }

  // All categories
  if (!earned.has("all-categories") && answeredCategories) {
    const categoriesSet = new Set(answeredCategories);
    const hasAll = ALL_CATEGORIES.every((c) => categoriesSet.has(c));
    if (hasAll) {
      newBadges.push("all-categories");
    }
  }

  // Love tank full
  if (
    !earned.has("love-tank-full") &&
    gamificationState.loveTank.level >= 100
  ) {
    newBadges.push("love-tank-full");
  }

  // First week
  if (!earned.has("first-week") && gamificationState.firstUsedDate) {
    const firstUsed = new Date(gamificationState.firstUsedDate).getTime();
    const now = Date.now();
    const daysSinceFirst = (now - firstUsed) / 86_400_000;
    if (daysSinceFirst >= 7) {
      newBadges.push("first-week");
    }
  }

  return newBadges;
}

export function awardBadges(
  state: GamificationState,
  badgeIds: readonly BadgeId[],
): GamificationState {
  if (badgeIds.length === 0) return state;

  const now = new Date().toISOString();
  const newEarned: readonly EarnedBadge[] = badgeIds.map((badgeId) => ({
    badgeId,
    earnedAt: now,
  }));

  return {
    ...state,
    earnedBadges: [...state.earnedBadges, ...newEarned],
  };
}
