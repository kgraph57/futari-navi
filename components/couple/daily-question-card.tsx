"use client";

import { useState, useCallback, useEffect } from "react";
import type { DailyQuestion, QuestionCategory } from "@/lib/types";
import { QUESTION_CATEGORY_LABELS } from "@/lib/types";
import { getTodaysQuestion } from "@/lib/daily-questions/engine";
import { useAuth } from "@/lib/auth/auth-provider";
import { useCoupleContext } from "@/lib/couple/provider";
import { useCoupleAnswers } from "@/lib/couple/hooks";
import { submitCoupleAnswer } from "@/lib/couple/daily-queries";
import { StreakBadge } from "@/components/daily/streak-badge";
import { PartnerInvite } from "./partner-invite";
import { WaitingForPartner } from "./waiting-for-partner";
import { AnswerReveal } from "./answer-reveal";
import questionsData from "@/data/daily-questions.json";

/* ── Types ── */

type CardState =
  | "loading"
  | "not-logged-in"
  | "no-partner"
  | "waiting-to-answer"
  | "waiting-for-partner"
  | "both-answered"
  | "viewed-today";

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  communication: "bg-blue-50 text-blue-700",
  dreams: "bg-purple-50 text-purple-700",
  memories: "bg-pink-50 text-pink-700",
  values: "bg-sage-50 text-sage-700",
  fun: "bg-yellow-50 text-yellow-700",
  newlywed: "bg-coral-50 text-coral-700",
};

const MAX_CHARS = 200;

/* ── Component ── */

export function CoupleDailyQuestionCard() {
  const { user, loading: authLoading } = useAuth();
  const { couple, partner, loading: coupleLoading } = useCoupleContext();

  const questions = questionsData as readonly DailyQuestion[];
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysQuestion = getTodaysQuestion(questions, [], new Date());

  const {
    myAnswer,
    partnerAnswer,
    bothAnswered,
    loading: answersLoading,
    refresh: refreshAnswers,
  } = useCoupleAnswers(
    couple?.id ?? null,
    todaysQuestion?.id ?? null,
    todayStr,
  );

  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasViewedReveal, setHasViewedReveal] = useState(false);
  const [streak, setStreak] = useState(0);

  // Load streak from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("futari-daily-questions");
      if (raw) {
        const parsed = JSON.parse(raw);
        setStreak(parsed.currentStreak ?? 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Determine card state
  let cardState: CardState;
  if (authLoading || coupleLoading || answersLoading) {
    cardState = "loading";
  } else if (!user) {
    cardState = "not-logged-in";
  } else if (!couple) {
    cardState = "no-partner";
  } else if (!myAnswer) {
    cardState = "waiting-to-answer";
  } else if (!bothAnswered) {
    cardState = "waiting-for-partner";
  } else if (!hasViewedReveal) {
    cardState = "both-answered";
  } else {
    cardState = "viewed-today";
  }

  const handleSubmit = useCallback(async () => {
    if (!user || !couple || !todaysQuestion || answerText.trim().length === 0 || submitting) return;
    setSubmitting(true);
    const result = await submitCoupleAnswer(
      couple.id,
      todaysQuestion.id,
      user.id,
      answerText.trim(),
    );
    if (!result.error) {
      await refreshAnswers();
      setAnswerText("");
      setStreak((s) => s + 1);
    }
    setSubmitting(false);
  }, [user, couple, todaysQuestion, answerText, submitting, refreshAnswers]);

  /* -- Loading -- */
  if (cardState === "loading") {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-white p-8 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "0ms" }} />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "150ms" }} />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  /* -- Not logged in — show login-free demo mode -- */
  if (cardState === "not-logged-in" || cardState === "no-partner") {
    return <PartnerInvite />;
  }

  /* -- Card wrapper for all other states -- */
  return (
    <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span className="font-heading text-sm font-bold text-sage-800">
            今日のふたりの質問
          </span>
        </div>
        <StreakBadge streak={streak} />
      </div>

      {/* Category badge */}
      {todaysQuestion && (
        <span
          className={`mb-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[todaysQuestion.category]}`}
        >
          {QUESTION_CATEGORY_LABELS[todaysQuestion.category]}
        </span>
      )}

      {/* Question text */}
      <p className="mb-6 font-heading text-lg font-bold leading-relaxed text-sage-900">
        {todaysQuestion?.text}
      </p>

      {/* State-specific content */}
      {cardState === "waiting-to-answer" && (
        <AnswerInput
          value={answerText}
          onChange={setAnswerText}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}

      {cardState === "waiting-for-partner" && myAnswer && (
        <WaitingForPartner
          answeredAt={myAnswer.answeredAt}
          partnerName={partner?.displayName ?? undefined}
        />
      )}

      {cardState === "both-answered" && myAnswer && partnerAnswer && (
        <div>
          <AnswerReveal
            myAnswer={myAnswer.answerText}
            partnerAnswer={partnerAnswer.answerText}
            partnerName={partner?.displayName ?? undefined}
          />
          <button
            onClick={() => setHasViewedReveal(true)}
            className="mt-4 w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-700"
          >
            確認した
          </button>
        </div>
      )}

      {cardState === "viewed-today" && myAnswer && partnerAnswer && (
        <div className="space-y-4">
          <AnswerReveal
            myAnswer={myAnswer.answerText}
            partnerAnswer={partnerAnswer.answerText}
            partnerName={partner?.displayName ?? undefined}
          />
          <p className="text-center text-xs text-muted">
            また明日！ 明日の質問をお楽しみに
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Sub-component: Answer Input ── */

interface AnswerInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly submitting: boolean;
}

function AnswerInput({
  value,
  onChange,
  onSubmit,
  submitting,
}: AnswerInputProps) {
  const remaining = MAX_CHARS - value.length;

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              onChange(e.target.value);
            }
          }}
          placeholder="あなたの答えを書いてね..."
          className="w-full resize-none rounded-xl border border-ivory-200 bg-white p-4 pb-8 text-sm text-sage-800 placeholder:text-sage-300 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400"
          rows={3}
        />
        <span
          className={`absolute bottom-2.5 right-3 text-xs ${
            remaining <= 20 ? "text-emergency" : "text-muted"
          }`}
        >
          {remaining}
        </span>
      </div>

      <button
        onClick={onSubmit}
        disabled={value.trim().length === 0 || submitting}
        className="w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-700 disabled:opacity-40"
      >
        {submitting ? "送信中..." : "回答する"}
      </button>
    </div>
  );
}
