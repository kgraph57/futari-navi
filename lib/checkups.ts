import type { Checkup, CheckupVenue } from "./types";
import checkupsData from "@/data/checkups.json";

export function getAllCheckups(): readonly Checkup[] {
  return checkupsData as readonly Checkup[];
}

export function getCheckupBySlug(slug: string): Checkup | null {
  const checkups = getAllCheckups();
  const found = checkups.find((c) => c.slug === slug);
  return found ?? null;
}

export function getPublicCheckups(): readonly Checkup[] {
  return getAllCheckups().filter((c) => c.venue === "public");
}

export function getClinicCheckups(): readonly Checkup[] {
  return getAllCheckups().filter((c) => c.venue === "clinic");
}

export const CHECKUP_VENUE_LABELS: Record<CheckupVenue, string> = {
  hospital: "出産病院",
  public: "集団健診（保健センター）",
  clinic: "個別健診（医療機関）",
  school: "小学校",
} as const;

export const CHECKUP_VENUE_COLORS: Record<CheckupVenue, string> = {
  hospital: "bg-blue-50 text-blue-700 border-blue-200",
  public: "bg-sage-50 text-sage-700 border-sage-200",
  clinic: "bg-purple-50 text-purple-700 border-purple-200",
  school: "bg-orange-50 text-orange-700 border-orange-200",
} as const;
