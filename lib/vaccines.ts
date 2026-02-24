import type { Vaccine } from "./types";
import vaccinesData from "@/data/vaccines.json";

export function getAllVaccines(): readonly Vaccine[] {
  return vaccinesData as readonly Vaccine[];
}

export function getVaccineBySlug(slug: string): Vaccine | null {
  const vaccines = getAllVaccines();
  const found = vaccines.find((v) => v.slug === slug);
  return found ?? null;
}

export function getRoutineVaccines(): readonly Vaccine[] {
  return getAllVaccines().filter((v) => v.type === "routine");
}

export function getOptionalVaccines(): readonly Vaccine[] {
  return getAllVaccines().filter((v) => v.type === "optional");
}

export const VACCINE_TYPE_LABELS: Record<Vaccine["type"], string> = {
  routine: "定期接種",
  optional: "任意接種",
} as const;

export const VACCINE_TYPE_COLORS: Record<Vaccine["type"], string> = {
  routine: "bg-sage-50 text-sage-700 border-sage-200",
  optional: "bg-orange-50 text-orange-700 border-orange-200",
} as const;

export function formatAgeMonths(months: number): string {
  if (months >= 999) return "毎年";
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years}歳`;
    return `${years}歳${remainingMonths}ヶ月`;
  }
  return `${months}ヶ月`;
}
