import milestonesData from "@/data/milestones.json";

export type MilestoneCategory = "motor" | "language" | "social" | "daily";

export interface MilestoneDefinition {
  readonly id: string;
  readonly category: MilestoneCategory;
  readonly title: string;
  readonly description: string;
  readonly ageMonthsTypical: number;
  readonly ageMonthsRange: readonly [number, number];
  readonly icon: string;
}

const milestones = milestonesData as unknown as readonly MilestoneDefinition[];

export function getAllMilestones(): readonly MilestoneDefinition[] {
  return milestones;
}

export function getMilestoneById(id: string): MilestoneDefinition | null {
  return milestones.find((m) => m.id === id) ?? null;
}

export function getMilestonesByCategory(
  category: MilestoneCategory,
): readonly MilestoneDefinition[] {
  return milestones.filter((m) => m.category === category);
}

export const MILESTONE_CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  motor: "からだの発達",
  language: "ことばの発達",
  social: "こころ・社会性",
  daily: "生活の自立",
} as const;

export const MILESTONE_CATEGORY_COLORS: Record<MilestoneCategory, string> = {
  motor: "bg-blue-50 text-blue-600",
  language: "bg-purple-50 text-purple-600",
  social: "bg-rose-50 text-rose-500",
  daily: "bg-amber-50 text-amber-600",
} as const;
