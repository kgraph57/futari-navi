"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/auth-provider";
import { getMyCouple, getPartnerProfile } from "./queries";
import { getTodaysCoupleAnswers } from "./daily-queries";
import type { Couple, PartnerProfile, CoupleAnswer } from "@/lib/types";

export function useCouple() {
  const { user } = useAuth();
  const [couple, setCouple] = useState<Couple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setCouple(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const result = await getMyCouple(user.id);
    setCouple(result.data);
    setError(result.error);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { couple, loading, error, refresh } as const;
}

export function usePartnerProfile(coupleId: string | null) {
  const { user } = useAuth();
  const [partner, setPartner] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId || !user) {
      setPartner(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await getPartnerProfile(coupleId, user.id);
      if (!cancelled) {
        setPartner(result.data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [coupleId, user]);

  return { partner, loading } as const;
}

export function useCoupleAnswers(
  coupleId: string | null,
  questionId: string | null,
  date: string,
) {
  const { user } = useAuth();
  const [myAnswer, setMyAnswer] = useState<CoupleAnswer | null>(null);
  const [partnerAnswer, setPartnerAnswer] = useState<CoupleAnswer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!coupleId || !questionId || !user) {
      setLoading(false);
      return;
    }
    const result = await getTodaysCoupleAnswers(coupleId, questionId, date);
    if (result.data) {
      const mine = result.data.find((a) => a.userId === user.id) ?? null;
      const theirs = result.data.find((a) => a.userId !== user.id) ?? null;
      setMyAnswer(mine);
      setPartnerAnswer(theirs);
    }
    setLoading(false);
  }, [coupleId, questionId, date, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime subscription for partner's answer
  useEffect(() => {
    if (!coupleId || !questionId || !user) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`couple-answers-${coupleId}-${date}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "couple_answers",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload) => {
          const row = payload.new;
          if (
            row.question_id === questionId &&
            row.question_date === date
          ) {
            const mapped: CoupleAnswer = {
              id: row.id,
              coupleId: row.couple_id,
              questionId: row.question_id,
              questionDate: row.question_date,
              userId: row.user_id,
              answerText: row.answer_text,
              answeredAt: row.answered_at,
            };
            if (row.user_id === user.id) {
              setMyAnswer(mapped);
            } else {
              setPartnerAnswer(mapped);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, questionId, date, user]);

  return {
    myAnswer,
    partnerAnswer,
    bothAnswered: Boolean(myAnswer && partnerAnswer),
    loading,
    refresh,
  } as const;
}
