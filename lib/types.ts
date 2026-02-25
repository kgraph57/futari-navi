export type ArticleCategory =
  | "benefits"
  | "procedures"
  | "tax"
  | "insurance"
  | "housing"
  | "lifestyle";

export interface ArticleFrontmatter {
  readonly slug: string;
  readonly vol: number;
  readonly title: string;
  readonly description: string;
  readonly category: ArticleCategory;
  readonly publishedAt: string;
  readonly keyPoints: readonly string[];
  readonly qaCount: number;
  readonly referenceCount: number;
  readonly relatedSlugs: readonly string[];
}

export interface Article {
  readonly frontmatter: ArticleFrontmatter;
  readonly content: string;
}

export interface ProgramApplicationStep {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly tip: string | null;
}

export interface ProgramRequiredDocument {
  readonly name: string;
  readonly obtainHow: string;
  readonly notes: string | null;
  readonly downloadUrl: string | null;
}

export interface ProgramApplicationMethod {
  readonly method: "online" | "counter" | "mail";
  readonly label: string;
  readonly description: string;
  readonly url: string | null;
  readonly address: string | null;
  readonly hours: string | null;
}

export interface ProgramFaq {
  readonly question: string;
  readonly answer: string;
}

export interface Program {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly category: "benefits" | "tax" | "insurance" | "housing" | "support";
  readonly eligibility: ProgramEligibility;
  readonly amount: ProgramAmount;
  readonly applicationUrl: string;
  readonly deadline: string | null;
  readonly notes: string;
  readonly applicationSteps?: ReadonlyArray<ProgramApplicationStep>;
  readonly requiredDocuments?: ReadonlyArray<ProgramRequiredDocument>;
  readonly applicationMethods?: ReadonlyArray<ProgramApplicationMethod>;
  readonly faq?: ReadonlyArray<ProgramFaq>;
  readonly relatedProgramSlugs?: readonly string[];
  readonly processingTime?: string;
}

export interface ProgramEligibility {
  readonly maxAge: number | null;
  readonly minAge: number | null;
  readonly incomeLimit: number | null;
  readonly residency: "minato" | "tokyo" | "japan";
  readonly conditions: readonly string[];
}

export interface ProgramAmount {
  readonly type: "fixed" | "variable" | "subsidy";
  readonly value: number | null;
  readonly unit: "yen" | "percent" | "yen-per-month";
  readonly description: string;
}

export interface SimulatorInput {
  readonly marriageDate: string;
  readonly partnerAAge: number;
  readonly partnerBAge: number;
  readonly householdIncome: IncomeRange;
  readonly isMoving: boolean;
  readonly nameChanged: boolean;
  readonly district: string;
}

export type IncomeRange =
  | "under-300"
  | "300-500"
  | "500-700"
  | "700-1000"
  | "over-1000";

export interface SimulatorResult {
  readonly totalAnnualEstimate: number;
  readonly eligiblePrograms: readonly EligibleProgram[];
}

export interface EligibleProgram {
  readonly program: Program;
  readonly estimatedAmount: number;
  readonly actionItems: readonly string[];
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  benefits: "給付金・助成",
  procedures: "届出・手続き",
  tax: "税金・控除",
  insurance: "保険・年金",
  housing: "住まい",
  lifestyle: "暮らし",
} as const;

/* ── Daily Question Types ── */

export type QuestionCategory =
  | "communication"
  | "dreams"
  | "memories"
  | "values"
  | "fun"
  | "newlywed";

export interface DailyQuestion {
  readonly id: string;
  readonly category: QuestionCategory;
  readonly text: string;
  readonly depth: "light" | "medium" | "deep";
  readonly weekday?: number;
}

export interface DailyAnswer {
  readonly date: string;
  readonly questionId: string;
  readonly myAnswer: string;
  readonly partnerAnswer: string | null;
  readonly answeredAt: string;
}

export interface DailyQuestionState {
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly totalAnswered: number;
  readonly answers: readonly DailyAnswer[];
  readonly lastAnsweredDate: string | null;
}

export const QUESTION_CATEGORY_LABELS: Record<QuestionCategory, string> = {
  communication: "コミュニケーション",
  dreams: "夢・将来",
  memories: "思い出",
  values: "価値観",
  fun: "遊び心",
  newlywed: "新婚生活",
} as const;

/* ── Gamification Types ── */

export interface LoveTankState {
  readonly level: number;
  readonly lastUpdated: string;
  readonly history: readonly LoveTankEntry[];
}

export interface LoveTankEntry {
  readonly date: string;
  readonly points: number;
  readonly actions: readonly string[];
}

export type BadgeId =
  | "first-question"
  | "streak-3"
  | "streak-7"
  | "streak-30"
  | "explorer"
  | "planner"
  | "simulator-pro"
  | "all-categories"
  | "love-tank-full"
  | "first-week";

export interface BadgeDefinition {
  readonly id: BadgeId;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly tier: "bronze" | "silver" | "gold";
}

export interface GamificationState {
  readonly loveTank: LoveTankState;
  readonly earnedBadges: readonly EarnedBadge[];
  readonly totalPoints: number;
  readonly weeklyPoints: number;
  readonly firstUsedDate: string;
}

export interface EarnedBadge {
  readonly badgeId: BadgeId;
  readonly earnedAt: string;
}
