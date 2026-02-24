"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { DataStore, FamilyProfile } from "./types";
import { createLocalStore } from "./local-store";
import { createSupabaseStore } from "./supabase-store";

export function createHybridStore(
  client: SupabaseClient,
  user: User | null,
): DataStore {
  const localStore = createLocalStore();

  if (!user) {
    return localStore;
  }

  return createSupabaseStore(client);
}

export async function migrateLocalToSupabase(
  client: SupabaseClient,
): Promise<{ migratedChildren: number }> {
  const localStore = createLocalStore();
  const supabaseStore = createSupabaseStore(client);

  const localProfile = await localStore.getFamilyProfile();
  if (!localProfile || localProfile.children.length === 0) {
    return { migratedChildren: 0 };
  }

  let migratedChildren = 0;

  for (const child of localProfile.children) {
    const supabaseProfile = await supabaseStore.addChild(
      child.nickname,
      child.birthDate,
    );

    const newChild = supabaseProfile.children.at(-1);
    if (!newChild) continue;

    for (const itemId of child.completedItems) {
      await supabaseStore.toggleCompletedItem(newChild.id, itemId);
    }

    const localVaccinations =
      await localStore.getVaccinationRecords(child.id);
    for (const vax of localVaccinations) {
      await supabaseStore.upsertVaccinationRecord({
        childId: newChild.id,
        vaccineSlug: vax.vaccineSlug,
        doseNumber: vax.doseNumber,
        administeredDate: vax.administeredDate,
        scheduledDate: vax.scheduledDate,
        clinicName: vax.clinicName,
        lotNumber: vax.lotNumber,
        notes: vax.notes,
        status: vax.status,
      });
    }

    const localMilestones =
      await localStore.getMilestoneRecords(child.id);
    for (const ms of localMilestones) {
      await supabaseStore.upsertMilestoneRecord({
        childId: newChild.id,
        milestoneId: ms.milestoneId,
        achievedDate: ms.achievedDate,
        notes: ms.notes,
      });
    }

    migratedChildren++;
  }

  for (const slug of localProfile.savedArticles) {
    await supabaseStore.toggleSavedArticle(slug);
  }

  return { migratedChildren };
}

export function clearLocalData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("sukusuku-family");
    localStorage.removeItem("sukusuku-vaccinations");
    localStorage.removeItem("sukusuku-milestones");
  } catch {
    // Ignore localStorage errors
  }
}
