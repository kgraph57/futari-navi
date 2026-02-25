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

export const PROGRAM_CATEGORY_LABELS: Record<string, string> = {
  給付金: "給付金",
  税制優遇: "税制優遇",
  "優待・割引": "優待・割引",
  社会保険: "社会保険",
} as const;

export const PROGRAM_CATEGORY_ORDER: readonly string[] = [
  "給付金",
  "税制優遇",
  "社会保険",
  "優待・割引",
] as const;
