import { createClient } from "@/lib/supabase/client";
import type { Couple, PartnerProfile } from "@/lib/types";

function mapCouple(row: Record<string, unknown>): Couple {
  return {
    id: row.id as string,
    partnerA: row.partner_a as string,
    partnerB: (row.partner_b as string) ?? null,
    inviteCode: row.invite_code as string,
    status: row.status as Couple["status"],
    createdAt: row.created_at as string,
    pairedAt: (row.paired_at as string) ?? null,
  };
}

export async function getMyCouple(
  userId: string,
): Promise<{ data: Couple | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("couples")
    .select("*")
    .or(`partner_a.eq.${userId},partner_b.eq.${userId}`)
    .eq("status", "active")
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data ? mapCouple(data) : null, error: null };
}

export async function getMyPendingCouple(
  userId: string,
): Promise<{ data: Couple | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("couples")
    .select("*")
    .eq("partner_a", userId)
    .eq("status", "pending")
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data ? mapCouple(data) : null, error: null };
}

export async function createCouple(
  userId: string,
): Promise<{ data: Couple | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("couples")
    .insert({ partner_a: userId })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapCouple(data), error: null };
}

export async function joinCouple(
  inviteCode: string,
  userId: string,
): Promise<{ data: Couple | null; error: string | null }> {
  const supabase = createClient();

  const { data: existing, error: findError } = await supabase
    .from("couples")
    .select("*")
    .eq("invite_code", inviteCode)
    .eq("status", "pending")
    .maybeSingle();

  if (findError) return { data: null, error: findError.message };
  if (!existing) return { data: null, error: "招待コードが見つかりません" };
  if (existing.partner_a === userId) {
    return { data: null, error: "自分の招待コードです" };
  }

  const { data, error } = await supabase
    .from("couples")
    .update({
      partner_b: userId,
      status: "active",
      paired_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapCouple(data), error: null };
}

export async function getPartnerProfile(
  coupleId: string,
  myUserId: string,
): Promise<{ data: PartnerProfile | null; error: string | null }> {
  const supabase = createClient();

  const { data: couple, error: coupleError } = await supabase
    .from("couples")
    .select("partner_a, partner_b")
    .eq("id", coupleId)
    .single();

  if (coupleError) return { data: null, error: coupleError.message };

  const partnerId =
    couple.partner_a === myUserId ? couple.partner_b : couple.partner_a;

  if (!partnerId) return { data: null, error: null };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", partnerId)
    .single();

  if (profileError) return { data: null, error: profileError.message };

  return {
    data: {
      id: profile.id,
      displayName: profile.display_name,
    },
    error: null,
  };
}

export async function dissolveCouple(
  coupleId: string,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("couples")
    .update({ status: "dissolved" })
    .eq("id", coupleId);

  return { error: error?.message ?? null };
}
