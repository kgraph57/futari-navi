import { createClient } from "@/lib/supabase/client";
import type {
  QuizPack,
  QuizQuestion,
  QuizSession,
  QuizAnswer,
} from "@/lib/types";

function mapPack(row: Record<string, unknown>): QuizPack {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as QuizPack["category"],
    icon: row.icon as string,
    questionCount: row.question_count as number,
    isPremium: row.is_premium as boolean,
  };
}

function mapQuestion(row: Record<string, unknown>): QuizQuestion {
  return {
    id: row.id as string,
    packId: row.pack_id as string,
    text: row.text as string,
    sortOrder: row.sort_order as number,
  };
}

function mapSession(row: Record<string, unknown>): QuizSession {
  return {
    id: row.id as string,
    coupleId: row.couple_id as string,
    packId: row.pack_id as string,
    status: row.status as QuizSession["status"],
    compatibilityScore: (row.compatibility_score as number) ?? null,
    startedAt: row.started_at as string,
    completedAt: (row.completed_at as string) ?? null,
  };
}

function mapAnswer(row: Record<string, unknown>): QuizAnswer {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    questionId: row.question_id as string,
    userId: row.user_id as string,
    score: row.score as number,
    answeredAt: row.answered_at as string,
  };
}

export async function getQuizPacks(): Promise<{
  data: readonly QuizPack[];
  error: string | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_packs")
    .select("*")
    .order("sort_order");

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapPack), error: null };
}

export async function getQuizQuestions(
  packId: string,
): Promise<{ data: readonly QuizQuestion[]; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("pack_id", packId)
    .order("sort_order");

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapQuestion), error: null };
}

export async function startQuizSession(
  coupleId: string,
  packId: string,
): Promise<{ data: QuizSession | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({ couple_id: coupleId, pack_id: packId })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapSession(data), error: null };
}

export async function submitQuizAnswer(
  sessionId: string,
  questionId: string,
  userId: string,
  score: number,
): Promise<{ data: QuizAnswer | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_answers")
    .insert({
      session_id: sessionId,
      question_id: questionId,
      user_id: userId,
      score,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapAnswer(data), error: null };
}

export async function getQuizSessionAnswers(
  sessionId: string,
): Promise<{ data: readonly QuizAnswer[]; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_answers")
    .select("*")
    .eq("session_id", sessionId);

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapAnswer), error: null };
}

export async function completeQuizSession(
  sessionId: string,
  compatibilityScore: number,
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase
    .from("quiz_sessions")
    .update({
      status: "completed",
      compatibility_score: compatibilityScore,
      completed_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return { error: error?.message ?? null };
}

export async function getQuizHistory(
  coupleId: string,
): Promise<{ data: readonly QuizSession[]; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("couple_id", coupleId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(20);

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapSession), error: null };
}

export function calculateCompatibility(
  myAnswers: readonly QuizAnswer[],
  partnerAnswers: readonly QuizAnswer[],
): number {
  if (myAnswers.length === 0 || partnerAnswers.length === 0) return 0;

  const partnerMap = new Map(
    partnerAnswers.map((a) => [a.questionId, a.score]),
  );

  let totalDiff = 0;
  let count = 0;

  for (const my of myAnswers) {
    const partnerScore = partnerMap.get(my.questionId);
    if (partnerScore !== undefined) {
      totalDiff += Math.abs(my.score - partnerScore);
      count++;
    }
  }

  if (count === 0) return 0;

  const maxDiff = 4 * count;
  const similarity = 1 - totalDiff / maxDiff;
  return Math.round(similarity * 100);
}
