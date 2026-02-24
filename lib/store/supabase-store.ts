"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DataStore,
  FamilyProfile,
  ChildProfile,
  VaccinationRecord,
  MilestoneRecord,
} from "./types";

function toChildProfile(row: {
  id: string;
  nickname: string;
  birth_date: string;
  completed_items?: Array<{ item_id: string }>;
}): ChildProfile {
  return {
    id: row.id,
    nickname: row.nickname,
    birthDate: row.birth_date,
    completedItems: (row.completed_items ?? []).map((ci) => ci.item_id),
  };
}

function toVaccinationRecord(row: {
  id: string;
  child_id: string;
  vaccine_slug: string;
  dose_number: number;
  administered_date: string | null;
  scheduled_date: string | null;
  clinic_name: string | null;
  lot_number: string | null;
  notes: string | null;
  status: string;
}): VaccinationRecord {
  return {
    id: row.id,
    childId: row.child_id,
    vaccineSlug: row.vaccine_slug,
    doseNumber: row.dose_number,
    administeredDate: row.administered_date,
    scheduledDate: row.scheduled_date,
    clinicName: row.clinic_name,
    lotNumber: row.lot_number,
    notes: row.notes,
    status: row.status as VaccinationRecord["status"],
  };
}

function toMilestoneRecord(row: {
  id: string;
  child_id: string;
  milestone_id: string;
  achieved_date: string | null;
  notes: string | null;
}): MilestoneRecord {
  return {
    id: row.id,
    childId: row.child_id,
    milestoneId: row.milestone_id,
    achievedDate: row.achieved_date,
    notes: row.notes,
  };
}

export function createSupabaseStore(client: SupabaseClient): DataStore {
  async function getUserId(): Promise<string> {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    return user.id;
  }

  return {
    async getFamilyProfile() {
      const userId = await getUserId();

      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("id, display_name, created_at, updated_at")
        .eq("id", userId)
        .single();

      if (profileError || !profile) return null;

      const { data: children } = await client
        .from("children")
        .select("id, nickname, birth_date, completed_items(item_id)")
        .eq("family_id", userId)
        .order("created_at");

      const { data: savedArticles } = await client
        .from("saved_articles")
        .select("article_slug")
        .eq("profile_id", userId);

      return {
        id: profile.id,
        children: (children ?? []).map(toChildProfile),
        savedArticles: (savedArticles ?? []).map((sa) => sa.article_slug),
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    },

    async saveFamilyProfile(_profile) {
      // Individual operations handle their own saves
    },

    async createFamilyProfile() {
      const userId = await getUserId();

      const { data: profile, error } = await client
        .from("profiles")
        .select("id, created_at, updated_at")
        .eq("id", userId)
        .single();

      if (error || !profile) {
        throw new Error("Failed to get profile");
      }

      return {
        id: profile.id,
        children: [],
        savedArticles: [],
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    },

    async addChild(nickname, birthDate) {
      const userId = await getUserId();

      const { error } = await client.from("children").insert({
        family_id: userId,
        nickname,
        birth_date: birthDate,
      });

      if (error) throw new Error(`Failed to add child: ${error.message}`);

      const result = await this.getFamilyProfile();
      if (!result) throw new Error("Profile not found after adding child");
      return result;
    },

    async removeChild(childId) {
      const { error } = await client
        .from("children")
        .delete()
        .eq("id", childId);

      if (error) throw new Error(`Failed to remove child: ${error.message}`);

      const result = await this.getFamilyProfile();
      if (!result) throw new Error("Profile not found after removing child");
      return result;
    },

    async toggleCompletedItem(childId, itemId) {
      const { data: existing } = await client
        .from("completed_items")
        .select("id")
        .eq("child_id", childId)
        .eq("item_id", itemId)
        .maybeSingle();

      if (existing) {
        await client.from("completed_items").delete().eq("id", existing.id);
      } else {
        await client
          .from("completed_items")
          .insert({ child_id: childId, item_id: itemId });
      }

      const result = await this.getFamilyProfile();
      if (!result) throw new Error("Profile not found after toggling item");
      return result;
    },

    async toggleSavedArticle(slug) {
      const userId = await getUserId();

      const { data: existing } = await client
        .from("saved_articles")
        .select("id")
        .eq("profile_id", userId)
        .eq("article_slug", slug)
        .maybeSingle();

      if (existing) {
        await client.from("saved_articles").delete().eq("id", existing.id);
      } else {
        await client
          .from("saved_articles")
          .insert({ profile_id: userId, article_slug: slug });
      }

      const result = await this.getFamilyProfile();
      if (!result) throw new Error("Profile not found after toggling article");
      return result;
    },

    async getVaccinationRecords(childId) {
      const { data, error } = await client
        .from("vaccination_records")
        .select("*")
        .eq("child_id", childId)
        .order("dose_number");

      if (error) throw new Error(`Failed to get records: ${error.message}`);
      return (data ?? []).map(toVaccinationRecord);
    },

    async upsertVaccinationRecord(record) {
      const { data, error } = await client
        .from("vaccination_records")
        .upsert(
          {
            child_id: record.childId,
            vaccine_slug: record.vaccineSlug,
            dose_number: record.doseNumber,
            administered_date: record.administeredDate,
            scheduled_date: record.scheduledDate,
            clinic_name: record.clinicName,
            lot_number: record.lotNumber,
            notes: record.notes,
            status: record.status,
          },
          { onConflict: "child_id,vaccine_slug,dose_number" },
        )
        .select()
        .single();

      if (error || !data)
        throw new Error(
          `Failed to upsert vaccination: ${error?.message ?? "no data"}`,
        );
      return toVaccinationRecord(data);
    },

    async getMilestoneRecords(childId) {
      const { data, error } = await client
        .from("milestone_records")
        .select("*")
        .eq("child_id", childId)
        .order("created_at");

      if (error) throw new Error(`Failed to get milestones: ${error.message}`);
      return (data ?? []).map(toMilestoneRecord);
    },

    async upsertMilestoneRecord(record) {
      const { data, error } = await client
        .from("milestone_records")
        .upsert(
          {
            child_id: record.childId,
            milestone_id: record.milestoneId,
            achieved_date: record.achievedDate,
            notes: record.notes,
          },
          { onConflict: "child_id,milestone_id" },
        )
        .select()
        .single();

      if (error || !data)
        throw new Error(
          `Failed to upsert milestone: ${error?.message ?? "no data"}`,
        );
      return toMilestoneRecord(data);
    },
  };
}
