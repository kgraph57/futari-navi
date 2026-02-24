"use client";

import type {
  DataStore,
  FamilyProfile,
  ChildProfile,
  VaccinationRecord,
  MilestoneRecord,
} from "./types";

const FAMILY_KEY = "sukusuku-family";
const VACCINATION_KEY = "sukusuku-vaccinations";
const MILESTONE_KEY = "sukusuku-milestones";

function isSSR(): boolean {
  return typeof window === "undefined";
}

function now(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return crypto.randomUUID();
}

function readJson<T>(key: string): T | null {
  if (isSSR()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (isSSR()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
}

function getProfile(): FamilyProfile | null {
  const parsed = readJson<FamilyProfile>(FAMILY_KEY);
  if (!parsed) return null;
  return {
    ...parsed,
    savedArticles: parsed.savedArticles ?? [],
  };
}

function saveProfile(profile: FamilyProfile): void {
  writeJson(FAMILY_KEY, profile);
}

export function createLocalStore(): DataStore {
  return {
    async getFamilyProfile() {
      return getProfile();
    },

    async saveFamilyProfile(profile) {
      saveProfile(profile);
    },

    async createFamilyProfile() {
      const timestamp = now();
      const profile: FamilyProfile = {
        id: generateId(),
        children: [],
        savedArticles: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      saveProfile(profile);
      return profile;
    },

    async addChild(nickname, birthDate) {
      const profile = getProfile();
      if (!profile) {
        throw new Error("No family profile found");
      }

      const child: ChildProfile = {
        id: generateId(),
        nickname,
        birthDate,
        completedItems: [],
      };

      const updated: FamilyProfile = {
        ...profile,
        children: [...profile.children, child],
        updatedAt: now(),
      };
      saveProfile(updated);
      return updated;
    },

    async removeChild(childId) {
      const profile = getProfile();
      if (!profile) {
        throw new Error("No family profile found");
      }

      const updated: FamilyProfile = {
        ...profile,
        children: profile.children.filter((c) => c.id !== childId),
        updatedAt: now(),
      };
      saveProfile(updated);
      return updated;
    },

    async toggleCompletedItem(childId, itemId) {
      const profile = getProfile();
      if (!profile) {
        throw new Error("No family profile found");
      }

      const updated: FamilyProfile = {
        ...profile,
        children: profile.children.map((child) => {
          if (child.id !== childId) return child;
          const hasItem = child.completedItems.includes(itemId);
          return {
            ...child,
            completedItems: hasItem
              ? child.completedItems.filter((id) => id !== itemId)
              : [...child.completedItems, itemId],
          };
        }),
        updatedAt: now(),
      };
      saveProfile(updated);
      return updated;
    },

    async toggleSavedArticle(slug) {
      const profile = getProfile();
      if (!profile) {
        throw new Error("No family profile found");
      }

      const hasSaved = profile.savedArticles.includes(slug);
      const updated: FamilyProfile = {
        ...profile,
        savedArticles: hasSaved
          ? profile.savedArticles.filter((s) => s !== slug)
          : [...profile.savedArticles, slug],
        updatedAt: now(),
      };
      saveProfile(updated);
      return updated;
    },

    async getVaccinationRecords(childId) {
      const all =
        readJson<Record<string, readonly VaccinationRecord[]>>(
          VACCINATION_KEY,
        ) ?? {};
      return all[childId] ?? [];
    },

    async upsertVaccinationRecord(record) {
      const all =
        readJson<Record<string, VaccinationRecord[]>>(
          VACCINATION_KEY,
        ) ?? {};
      const childRecords = all[record.childId] ?? [];

      const existingIndex = childRecords.findIndex(
        (r) =>
          r.vaccineSlug === record.vaccineSlug &&
          r.doseNumber === record.doseNumber,
      );

      const newRecord: VaccinationRecord = {
        ...record,
        id: existingIndex >= 0 ? childRecords[existingIndex].id : generateId(),
      };

      const updatedRecords =
        existingIndex >= 0
          ? childRecords.map((r, i) => (i === existingIndex ? newRecord : r))
          : [...childRecords, newRecord];

      writeJson(VACCINATION_KEY, {
        ...all,
        [record.childId]: updatedRecords,
      });

      return newRecord;
    },

    async getMilestoneRecords(childId) {
      const all =
        readJson<Record<string, readonly MilestoneRecord[]>>(
          MILESTONE_KEY,
        ) ?? {};
      return all[childId] ?? [];
    },

    async upsertMilestoneRecord(record) {
      const all =
        readJson<Record<string, MilestoneRecord[]>>(MILESTONE_KEY) ?? {};
      const childRecords = all[record.childId] ?? [];

      const existingIndex = childRecords.findIndex(
        (r) => r.milestoneId === record.milestoneId,
      );

      const newRecord: MilestoneRecord = {
        ...record,
        id: existingIndex >= 0 ? childRecords[existingIndex].id : generateId(),
      };

      const updatedRecords =
        existingIndex >= 0
          ? childRecords.map((r, i) => (i === existingIndex ? newRecord : r))
          : [...childRecords, newRecord];

      writeJson(MILESTONE_KEY, {
        ...all,
        [record.childId]: updatedRecords,
      });

      return newRecord;
    },
  };
}
