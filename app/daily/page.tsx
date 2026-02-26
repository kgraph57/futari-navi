"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCoupleContext } from "@/lib/couple/provider";
import { CoupleDailyQuestionCard } from "@/components/couple/daily-question-card";
import { DailyQuestionHistory } from "@/components/daily/daily-question-history";

export default function DailyPage() {
  const { couple } = useCoupleContext();

  const [stats, setStats] = useState({
    totalAnswered: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("futari-daily-questions");
      if (raw) {
        const parsed = JSON.parse(raw);
        setStats({
          totalAnswered: parsed.answeredIds?.length ?? 0,
          currentStreak: parsed.currentStreak ?? 0,
          longestStreak: parsed.longestStreak ?? 0,
        });
      }
    } catch {
      // ignore
    }
  }, []);

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
          今日のふたりの質問
        </h1>
        <p className="mt-1 text-sm text-muted">
          毎日5分。ふたりの会話がもっと深まる質問を。
        </p>
      </div>

      {/* Today's Question (couple mode) */}
      <div className="mb-8">
        <CoupleDailyQuestionCard />
      </div>

      {/* Couple Streak Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-ivory-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-sage-700">
            {stats.totalAnswered}
          </p>
          <p className="mt-1 text-[10px] text-muted">回答数</p>
        </div>
        <div className="rounded-xl border border-ivory-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-coral-600">
            {stats.currentStreak}
          </p>
          <p className="mt-1 text-[10px] text-muted">連続日数</p>
        </div>
        <div className="rounded-xl border border-ivory-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gold-600">
            {stats.longestStreak}
          </p>
          <p className="mt-1 text-[10px] text-muted">最長記録</p>
        </div>
      </div>

      {/* History */}
      {couple && (
        <div>
          <h2 className="mb-4 font-heading text-lg font-bold text-sage-800">
            これまでの質問
          </h2>
          <DailyQuestionHistory />
        </div>
      )}
    </div>
  );
}
