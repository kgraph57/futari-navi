"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCoupleContext } from "@/lib/couple/provider";
import { getTodaysQuestion } from "@/lib/daily-questions/engine";
import { PredictionGameCard } from "@/components/prediction/prediction-game-card";
import { PredictionScoreboard } from "@/components/prediction/prediction-scoreboard";
import { PredictionHistory } from "@/components/prediction/prediction-history";
import { PartnerInvite } from "@/components/couple/partner-invite";
import type { DailyQuestion } from "@/lib/types";
import questionsData from "@/data/daily-questions.json";

export default function PredictionPage() {
  const { couple, loading } = useCoupleContext();

  const questions = questionsData as readonly DailyQuestion[];
  const todaysQuestion = getTodaysQuestion(questions, [], new Date());

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "0ms" }} />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "150ms" }} />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
      >
        <ChevronLeft size={16} />
        ホームへ戻る
      </Link>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-sage-900">
          予測ゲーム
        </h1>
        <p className="mt-1 text-sm text-muted">
          パートナーの答えを予想しよう。どれだけ相手をわかっているかな？
        </p>
      </div>

      {/* Need partner to play */}
      {!couple ? (
        <div className="mb-8">
          <PartnerInvite />
        </div>
      ) : (
        <>
          {/* Today's Challenge */}
          {todaysQuestion && (
            <div className="mb-8">
              <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-gold-500">
                今日のチャレンジ
              </h2>
              <PredictionGameCard
                question={todaysQuestion.text}
                questionId={todaysQuestion.id}
              />
            </div>
          )}

          {/* Scoreboard */}
          <div className="mb-8">
            <PredictionScoreboard />
          </div>

          {/* History */}
          <div>
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-gold-500">
              過去の結果
            </h2>
            <PredictionHistory />
          </div>
        </>
      )}
    </div>
  );
}
