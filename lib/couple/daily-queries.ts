import { createClient } from "@/lib/supabase/client";
import type { CoupleAnswer } from "@/lib/types";

function mapAnswer(row: Record<string, unknown>): CoupleAnswer {
  return {
    id: row.id as string,
    coupleId: row.couple_id as string,
    questionId: row.question_id as string,
    questionDate: row.question_date as string,
    userId: row.user_id as string,
    answerText: row.answer_text as string,
    answeredAt: row.answered_at as string,
  };
}

export async function getTodaysCoupleAnswers(
  coupleId: string,
  questionId: string,
  date: string,
): Promise<{ data: readonly CoupleAnswer[]; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("couple_answers")
    .select("*")
    .eq("couple_id", coupleId)
    .eq("question_id", questionId)
    .eq("question_date", date);

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(mapAnswer), error: null };
}

export async function submitCoupleAnswer(
  coupleId: string,
  questionId: string,
  userId: string,
  answer: string,
): Promise<{ data: CoupleAnswer | null; error: string | null }> {
  const supabase = createClient();
  const date = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("couple_answers")
    .insert({
      couple_id: coupleId,
      question_id: questionId,
      question_date: date,
      user_id: userId,
      answer_text: answer,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: mapAnswer(data), error: null };
}

export async function getCoupleAnswerHistory(
  coupleId: string,
  limit = 30,
): Promise<{
  data: ReadonlyArray<{
    readonly questionId: string;
    readonly questionDate: string;
    readonly answers: readonly CoupleAnswer[];
  }>;
  error: string | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("couple_answers")
    .select("*")
    .eq("couple_id", coupleId)
    .order("question_date", { ascending: false })
    .limit(limit * 2);

  if (error) return { data: [], error: error.message };

  const grouped = new Map<
    string,
    { questionId: string; questionDate: string; answers: CoupleAnswer[] }
  >();

  for (const row of data ?? []) {
    const mapped = mapAnswer(row);
    const key = `${mapped.questionDate}-${mapped.questionId}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.answers.push(mapped);
    } else {
      grouped.set(key, {
        questionId: mapped.questionId,
        questionDate: mapped.questionDate,
        answers: [mapped],
      });
    }
  }

  return {
    data: Array.from(grouped.values()).slice(0, limit),
    error: null,
  };
}

export async function hasPartnerAnswered(
  coupleId: string,
  questionId: string,
  date: string,
  partnerUserId: string,
): Promise<boolean> {
  const supabase = createClient();
  const { count } = await supabase
    .from("couple_answers")
    .select("*", { count: "exact", head: true })
    .eq("couple_id", coupleId)
    .eq("question_id", questionId)
    .eq("question_date", date)
    .eq("user_id", partnerUserId);

  return (count ?? 0) > 0;
}
