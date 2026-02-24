export interface ChildProfile {
  readonly id: string;
  readonly nickname: string;
  readonly birthDate: string;
  readonly completedItems: readonly string[];
}

export interface FamilyProfile {
  readonly id: string;
  readonly children: readonly ChildProfile[];
  readonly savedArticles: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface VaccinationRecord {
  readonly id: string;
  readonly childId: string;
  readonly vaccineSlug: string;
  readonly doseNumber: number;
  readonly administeredDate: string | null;
  readonly scheduledDate: string | null;
  readonly clinicName: string | null;
  readonly lotNumber: string | null;
  readonly notes: string | null;
  readonly status: "scheduled" | "completed" | "skipped";
}

export interface MilestoneRecord {
  readonly id: string;
  readonly childId: string;
  readonly milestoneId: string;
  readonly achievedDate: string | null;
  readonly notes: string | null;
}

export type ActionStatus = "not_started" | "in_progress" | "completed";

export interface ActionRecord {
  readonly id: string;
  readonly childId: string;
  readonly actionId: string;
  readonly status: ActionStatus;
  readonly deadline: string | null;
  readonly reminderDate: string | null;
  readonly notes: string | null;
}

export interface DataStore {
  readonly getFamilyProfile: () => Promise<FamilyProfile | null>;
  readonly saveFamilyProfile: (
    profile: FamilyProfile,
  ) => Promise<void>;
  readonly createFamilyProfile: () => Promise<FamilyProfile>;
  readonly addChild: (
    nickname: string,
    birthDate: string,
  ) => Promise<FamilyProfile>;
  readonly removeChild: (childId: string) => Promise<FamilyProfile>;
  readonly toggleCompletedItem: (
    childId: string,
    itemId: string,
  ) => Promise<FamilyProfile>;
  readonly toggleSavedArticle: (
    slug: string,
  ) => Promise<FamilyProfile>;
  readonly getVaccinationRecords: (
    childId: string,
  ) => Promise<readonly VaccinationRecord[]>;
  readonly upsertVaccinationRecord: (
    record: Omit<VaccinationRecord, "id">,
  ) => Promise<VaccinationRecord>;
  readonly getMilestoneRecords: (
    childId: string,
  ) => Promise<readonly MilestoneRecord[]>;
  readonly upsertMilestoneRecord: (
    record: Omit<MilestoneRecord, "id">,
  ) => Promise<MilestoneRecord>;
}
