import { getAllVaccines } from "./vaccines";
import type { Vaccine, VaccineDose } from "./types";
import type { VaccinationRecord } from "./store/types";

export interface UpcomingVaccination {
  readonly vaccine: Vaccine;
  readonly dose: VaccineDose;
  readonly daysUntilStandard: number;
  readonly isOverdue: boolean;
  readonly isWithinWindow: boolean;
}

/**
 * Given a child's birth date and their vaccination records,
 * returns the list of upcoming (not yet completed) vaccinations
 * sorted by urgency (overdue first, then soonest standard date).
 */
export function getUpcomingVaccinations(
  birthDate: string,
  records: readonly VaccinationRecord[],
): readonly UpcomingVaccination[] {
  const vaccines = getAllVaccines();
  const today = new Date();
  const birth = new Date(birthDate);
  const ageInMonths =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth());

  const completedSet = new Set(
    records
      .filter((r) => r.status === "completed")
      .map((r) => `${r.vaccineSlug}:${r.doseNumber}`),
  );

  const upcoming: UpcomingVaccination[] = [];

  for (const vaccine of vaccines) {
    for (const dose of vaccine.doses) {
      const key = `${vaccine.slug}:${dose.doseNumber}`;
      if (completedSet.has(key)) continue;

      const standardMonth = dose.ageMonthsStandard;
      const maxMonth = dose.ageMonthsMax;
      const daysUntilStandard = Math.round(
        (standardMonth - ageInMonths) * 30.44,
      );
      const isOverdue = maxMonth != null && ageInMonths > maxMonth;
      const isWithinWindow =
        ageInMonths >= dose.ageMonthsMin &&
        (maxMonth == null || ageInMonths <= maxMonth);

      // Only include doses that are relevant (within window, overdue, or coming within 6 months)
      if (isOverdue || isWithinWindow || daysUntilStandard <= 180) {
        upcoming.push({
          vaccine,
          dose,
          daysUntilStandard,
          isOverdue,
          isWithinWindow,
        });
      }
    }
  }

  return upcoming.sort((a, b) => {
    // Overdue first
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    // Then by days until standard
    return a.daysUntilStandard - b.daysUntilStandard;
  });
}

/**
 * Returns a formatted summary for timeline display.
 * Example: "次の予防接種: 五種混合 2回目 あと14日"
 */
export function getNextVaccinationSummary(
  birthDate: string,
  records: readonly VaccinationRecord[],
): string | null {
  const upcoming = getUpcomingVaccinations(birthDate, records);
  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  if (next.isOverdue) {
    return `${next.vaccine.nameShort} ${next.dose.label} (接種期限を過ぎています)`;
  }
  if (next.daysUntilStandard <= 0) {
    return `${next.vaccine.nameShort} ${next.dose.label} (接種推奨時期です)`;
  }
  return `${next.vaccine.nameShort} ${next.dose.label} あと約${next.daysUntilStandard}日`;
}
