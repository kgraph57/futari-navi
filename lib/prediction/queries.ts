import { createClient } from "@/lib/supabase/client";
import type { PredictionRound, Prediction } from "@/lib/types";

function mapRound(row: Record<string, unknown>): PredictionRound {
  return {
    id: row.id as string,
    coupleId: row.couple_id as string,
    questionId: row.question_id as string,
    roundDate: row.round_date as string,
    status: row.status as PredictionRound["status"],
    winnerUserId: (row.winner_user_id as string) ?? null,
    createdAt: row.created_at as string,
  };
}

function mapPrediction(row: Record<string, unknown>): Prediction {
  return {
    id: row.id as string,
    roundId: row.round_id as string,
    userId: row.user_id as string,
    myAnswer: row.my_answer as string,
    predictedPartnerAnswer: row.predicted_partner_answer as string,
    accuracyScore: (row.accuracy_score as number) ?? null,
    answeredAt: row.answered_at as string,
  };
}

export async function createPredictionRound(
  coupleId: string,
  questionId: string,
): Promise<{ data: PredictionRound | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prediction_rounds")
    .insert({ couple_id: coupleId, question_id: questionId })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapRound(data), error: null };
}

export async function submitPrediction(
  roundId: string,
  userId: string,
  myAnswer: string,
  predictedPartnerAnswer: string,
): Promise<{ data: Prediction | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("predictions")
    .insert({
      round_id: roundId,
      user_id: userId,
      my_answer: myAnswer,
      predicted_partner_answer: predictedPartnerAnswer,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapPrediction(data), error: null };
}

export async function getPredictionRound(
  roundId: string,
): Promise<{
  data: {
    round: PredictionRound;
    predictions: readonly Prediction[];
  } | null;
  error: string | null;
}> {
  const supabase = createClient();

  const { data: round, error: roundError } = await supabase
    .from("prediction_rounds")
    .select("*")
    .eq("id", roundId)
    .single();

  if (roundError) return { data: null, error: roundError.message };

  const { data: predictions, error: predError } = await supabase
    .from("predictions")
    .select("*")
    .eq("round_id", roundId);

  if (predError) return { data: null, error: predError.message };

  return {
    data: {
      round: mapRound(round),
      predictions: (predictions ?? []).map(mapPrediction),
    },
    error: null,
  };
}

export async function completePredictionRound(
  roundId: string,
  winnerUserId: string | null,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("prediction_rounds")
    .update({
      status: "completed",
      winner_user_id: winnerUserId,
      completed_at: new Date().toISOString(),
    })
    .eq("id", roundId);

  return { error: error?.message ?? null };
}

export function calculateAccuracy(
  predicted: string,
  actual: string,
): number {
  const predLower = predicted.toLowerCase().trim();
  const actualLower = actual.toLowerCase().trim();

  if (predLower === actualLower) return 100;

  const predWords = new Set(predLower.split(/\s+/));
  const actualWords = new Set(actualLower.split(/\s+/));

  let overlap = 0;
  for (const word of predWords) {
    if (actualWords.has(word)) overlap++;
  }

  const total = Math.max(predWords.size, actualWords.size);
  if (total === 0) return 0;

  return Math.round((overlap / total) * 100);
}

export async function getPredictionHistory(
  coupleId: string,
  limit = 20,
): Promise<{
  data: ReadonlyArray<{
    round: PredictionRound;
    predictions: readonly Prediction[];
  }>;
  error: string | null;
}> {
  const supabase = createClient();
  const { data: rounds, error } = await supabase
    .from("prediction_rounds")
    .select("*")
    .eq("couple_id", coupleId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return { data: [], error: error.message };
  if (!rounds || rounds.length === 0) return { data: [], error: null };

  const roundIds = rounds.map((r) => r.id as string);
  const { data: allPredictions, error: predError } = await supabase
    .from("predictions")
    .select("*")
    .in("round_id", roundIds);

  if (predError) return { data: [], error: predError.message };

  const predByRound = new Map<string, Prediction[]>();
  for (const p of allPredictions ?? []) {
    const mapped = mapPrediction(p);
    const existing = predByRound.get(mapped.roundId) ?? [];
    predByRound.set(mapped.roundId, [...existing, mapped]);
  }

  return {
    data: rounds.map((r) => ({
      round: mapRound(r),
      predictions: predByRound.get(r.id as string) ?? [],
    })),
    error: null,
  };
}

export async function getTodaysPredictionRound(
  coupleId: string,
): Promise<{
  data: { round: PredictionRound; predictions: readonly Prediction[] } | null;
  error: string | null;
}> {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = createClient();

  const { data: round, error } = await supabase
    .from("prediction_rounds")
    .select("*")
    .eq("couple_id", coupleId)
    .eq("round_date", today)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  if (!round) return { data: null, error: null };

  const { data: predictions, error: predError } = await supabase
    .from("predictions")
    .select("*")
    .eq("round_id", round.id);

  if (predError) return { data: null, error: predError.message };

  return {
    data: {
      round: mapRound(round),
      predictions: (predictions ?? []).map(mapPrediction),
    },
    error: null,
  };
}
