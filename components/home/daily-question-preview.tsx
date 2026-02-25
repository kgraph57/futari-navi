"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DailyQuestion } from "@/lib/types";
import { QUESTION_CATEGORY_LABELS } from "@/lib/types";
import { getTodaysQuestion } from "@/lib/daily-questions/engine";
import { getDailyState } from "@/lib/daily-questions/store";
import { StreakBadge } from "@/components/daily/streak-badge";
import questionsData from "@/data/daily-questions.json";

export function DailyQuestionPreview() {
  const [mounted, setMounted] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [question, setQuestion] = useState<DailyQuestion | null>(null);

  useEffect(() => {
    setMounted(true);
    const state = getDailyState();
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysAnswer = state.answers.find((a) => a.date === todayStr);
    setHasAnswered(Boolean(todaysAnswer));
    setStreak(state.currentStreak);

    const questions = questionsData as readonly DailyQuestion[];
    const answeredIds = state.answers.map((a) => a.questionId);

    if (todaysAnswer) {
      const q = questions.find((qq) => qq.id === todaysAnswer.questionId);
      setQuestion(q ?? null);
    } else {
      setQuestion(getTodaysQuestion(questions, answeredIds));
    }
  }, []);

  if (!mounted) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-ivory-100" />
    );
  }

  return (
    <Link href="/daily" className="group block">
      <div className="rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 to-ivory-50 p-6 transition-all group-hover:border-sage-300 group-hover:shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span className="text-xs font-bold text-sage-600">
              今日のふたりの質問
            </span>
          </div>
          <StreakBadge streak={streak} />
        </div>

        {question && (
          <span className="mb-2 inline-flex rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-medium text-sage-500">
            {QUESTION_CATEGORY_LABELS[question.category]}
          </span>
        )}

        <p className="mb-4 font-heading text-base font-bold leading-relaxed text-sage-900">
          {question?.text ?? "今日の質問を見てみよう"}
        </p>

        {hasAnswered ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-sage-500">
            ✓ 回答済み — パートナーの回答を確認
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-sage-600 transition-colors group-hover:text-sage-800">
            今日の質問に答える →
          </span>
        )}
      </div>
    </Link>
  );
}
