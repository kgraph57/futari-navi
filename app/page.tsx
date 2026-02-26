"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { useCoupleContext } from "@/lib/couple/provider";
import { useCoupleAnswers } from "@/lib/couple/hooks";
import { getTodaysQuestion } from "@/lib/daily-questions/engine";
import { CoupleStatusBar } from "@/components/home/couple-status-bar";
import { QuickActionGrid } from "@/components/home/quick-action-grid";
import { ActivityFeed } from "@/components/home/activity-feed";
import { PartnerInvite } from "@/components/couple/partner-invite";
import type { DailyQuestion } from "@/lib/types";
import questionsData from "@/data/daily-questions.json";

function TodayQuestionStatus({
  myAnswered,
  bothAnswered,
}: {
  readonly myAnswered: boolean;
  readonly bothAnswered: boolean;
}) {
  if (bothAnswered) {
    return (
      <span className="rounded-full bg-safe/10 px-2.5 py-0.5 text-[10px] font-semibold text-safe">
        回答済み
      </span>
    );
  }
  if (myAnswered) {
    return (
      <span className="rounded-full bg-caution/10 px-2.5 py-0.5 text-[10px] font-semibold text-caution">
        パートナー待ち
      </span>
    );
  }
  return (
    <span className="rounded-full bg-blush-50 px-2.5 py-0.5 text-[10px] font-semibold text-blush-400">
      未回答
    </span>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { couple, partner, loading } = useCoupleContext();

  const questions = questionsData as readonly DailyQuestion[];
  const todaysQuestion = getTodaysQuestion(questions, [], new Date());
  const todayStr = new Date().toISOString().slice(0, 10);

  const { myAnswer, bothAnswered } = useCoupleAnswers(
    couple?.id ?? null,
    todaysQuestion?.id ?? null,
    todayStr,
  );

  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("futari-daily-questions");
      if (raw) {
        const parsed = JSON.parse(raw);
        setStreak(parsed.currentStreak ?? 0);
        setTotalAnswered(parsed.answeredIds?.length ?? 0);
      }
    } catch {
      // ignore
    }
  }, []);

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-8">
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "0ms" }} />
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "150ms" }} />
            <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-sage-400" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-sage-900">
          ふたりナビ
        </h1>
        <p className="mt-0.5 text-xs text-gold-500">
          ふたりの毎日を、もっと深く。
        </p>
      </div>

      {/* Partner connection status or invite */}
      {couple ? (
        <div className="mb-6">
          <CoupleStatusBar
            partnerName={partner?.displayName ?? null}
            currentStreak={streak}
          />
        </div>
      ) : user ? (
        <div className="mb-6">
          <PartnerInvite />
        </div>
      ) : null}

      {/* Today's question card */}
      {todaysQuestion && (
        <Link href="/daily" className="group mb-6 block">
          <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-sage-50 p-5 transition-all group-hover:border-sage-300 group-hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-100">
                  <MessageCircle size={16} className="text-sage-600" />
                </div>
                <span className="text-xs font-semibold text-sage-600">
                  今日の質問
                </span>
              </div>
              <TodayQuestionStatus
                myAnswered={Boolean(myAnswer)}
                bothAnswered={bothAnswered}
              />
            </div>
            <p className="mb-3 font-heading text-base font-bold leading-relaxed text-sage-900">
              {todaysQuestion.text}
            </p>
            <div className="flex items-center gap-1 text-xs font-medium text-sage-500 transition-colors group-hover:text-sage-700">
              回答する
              <ChevronRight size={14} />
            </div>
          </div>
        </Link>
      )}

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-gold-500">
          やってみよう
        </h2>
        <QuickActionGrid />
      </div>

      {/* Streak & Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-ivory-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-sage-700">{streak}</p>
          <p className="mt-1 text-[10px] text-gold-500">連続日数</p>
        </div>
        <div className="rounded-2xl border border-ivory-200 bg-white p-4 text-center">
          <p className="text-3xl font-bold text-blush-400">{totalAnswered}</p>
          <p className="mt-1 text-[10px] text-gold-500">回答した質問</p>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-gold-500">
          最近のアクティビティ
        </h2>
        <div className="rounded-2xl border border-ivory-200 bg-white p-2">
          <ActivityFeed coupleId={couple?.id ?? null} />
        </div>
      </div>
    </div>
  );
}
