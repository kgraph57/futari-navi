import type { Program } from "./types";
import programsData from "@/data/programs.json";

export function getAllPrograms(): readonly Program[] {
  return programsData as readonly Program[];
}

export function getProgramBySlug(slug: string): Program | null {
  const programs = getAllPrograms();
  const found = programs.find((p) => p.slug === slug);
  return found ?? null;
}

export function getProgramsByCategory(
  category: Program["category"],
): readonly Program[] {
  const programs = getAllPrograms();
  return programs.filter((p) => p.category === category);
}

export const PROGRAM_CATEGORY_LABELS: Record<Program["category"], string> = {
  medical: "医療",
  childcare: "保育・預かり",
  financial: "給付金・手当",
  support: "子育て支援",
} as const;

export const PROGRAM_CATEGORY_ORDER: readonly Program["category"][] = [
  "financial",
  "medical",
  "childcare",
  "support",
] as const;
