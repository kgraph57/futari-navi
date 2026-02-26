"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { useCoupleContext } from "@/lib/couple/provider";
import { LikertScale } from "@/components/quiz/likert-scale";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { QuizResult } from "@/components/quiz/quiz-result";
import { QuizWaiting } from "@/components/quiz/quiz-waiting";
import {
  startQuizSession,
  submitQuizAnswer,
  getQuizSessionAnswers,
  completeQuizSession,
  calculateCompatibility,
} from "@/lib/quiz/queries";
import type {
  QuizCategory,
  QuizQuestion,
  QuizQuestionResult,
  QuizPack,
  QuizAnswer,
} from "@/lib/types";
import quizData from "@/data/quiz-packs.json";

type SessionPhase = "quiz" | "submitting" | "waiting" | "result";

interface PackWithQuestions {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: QuizCategory;
  readonly icon: string;
  readonly questionCount: number;
  readonly isPremium: boolean;
  readonly questions: readonly QuizQuestion[];
}

export default function QuizSessionPage() {
  const params = useParams();
  const packId = params.packId as string;
  const { user } = useAuth();
  const { couple } = useCoupleContext();

  const pack = useMemo(
    () =>
      (quizData.packs as readonly PackWithQuestions[]).find(
        (p) => p.id === packId,
      ),
    [packId],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<readonly number[]>([]);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [phase, setPhase] = useState<SessionPhase>("quiz");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [partnerAnswers, setPartnerAnswers] = useState<readonly QuizAnswer[]>([]);

  const questions = pack?.questions ?? [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] as QuizQuestion | undefined;

  // Start quiz session when component mounts and couple exists
  useEffect(() => {
    if (!couple || !user || sessionId) return;

    (async () => {
      const result = await startQuizSession(couple.id, packId);
      if (result.data) {
        setSessionId(result.data.id);
      }
    })();
  }, [couple, user, packId, sessionId]);

  const handleSelect = useCallback(
    (score: number) => {
      if (isTransitioning) return;
      setSelectedScore(score);

      setIsTransitioning(true);
      setTimeout(() => {
        const nextAnswers = [...answers, score];
        setAnswers(nextAnswers);

        // Submit answer to Supabase
        if (sessionId && user && currentQuestion) {
          submitQuizAnswer(sessionId, currentQuestion.id, user.id, score);
        }

        if (currentIndex + 1 >= totalQuestions) {
          setPhase("submitting");

          // After submitting all answers, check for partner and compute results
          (async () => {
            if (sessionId) {
              const allAnswers = await getQuizSessionAnswers(sessionId);
              const myAnswerObjs = allAnswers.data.filter(
                (a) => a.userId === user?.id,
              );
              const partnerAnswerObjs = allAnswers.data.filter(
                (a) => a.userId !== user?.id,
              );

              if (partnerAnswerObjs.length >= totalQuestions) {
                // Partner already done - show results
                const compat = calculateCompatibility(myAnswerObjs, partnerAnswerObjs);
                await completeQuizSession(sessionId, compat);
                setPartnerAnswers(partnerAnswerObjs);
                setPhase("result");
              } else {
                // Wait for partner
                setPhase("waiting");
                // Poll every 3 seconds for partner answers
                const interval = setInterval(async () => {
                  const updated = await getQuizSessionAnswers(sessionId);
                  const partnerUpdated = updated.data.filter(
                    (a) => a.userId !== user?.id,
                  );
                  if (partnerUpdated.length >= totalQuestions) {
                    clearInterval(interval);
                    const myUpdated = updated.data.filter(
                      (a) => a.userId === user?.id,
                    );
                    const compat = calculateCompatibility(myUpdated, partnerUpdated);
                    await completeQuizSession(sessionId, compat);
                    setPartnerAnswers(partnerUpdated);
                    setPhase("result");
                  }
                }, 3000);
              }
            } else {
              // No session (no couple) - show mock results after delay
              setPhase("waiting");
              setTimeout(() => setPhase("result"), 2000);
            }
          })();
        } else {
          setCurrentIndex(currentIndex + 1);
          setSelectedScore(null);
        }
        setIsTransitioning(false);
      }, 400);
    },
    [answers, currentIndex, totalQuestions, isTransitioning, sessionId, user, currentQuestion],
  );

  if (!pack) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted">クイズパックが見つかりません</p>
        <Link
          href="/quiz"
          className="mt-4 inline-flex items-center gap-1 text-sm text-sage-600 hover:text-sage-800"
        >
          <ChevronLeft size={16} />
          クイズ一覧へ戻る
        </Link>
      </div>
    );
  }

  const quizPack: QuizPack = {
    id: pack.id,
    title: pack.title,
    description: pack.description,
    category: pack.category as QuizCategory,
    icon: pack.icon,
    questionCount: pack.questionCount,
    isPremium: pack.isPremium,
  };

  // Waiting phase
  if (phase === "waiting" || phase === "submitting") {
    const avg =
      answers.length > 0
        ? answers.reduce((a, b) => a + b, 0) / answers.length
        : 0;

    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <Link
          href="/quiz"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
        >
          <ChevronLeft size={16} />
          クイズ一覧へ戻る
        </Link>
        <QuizWaiting averageScore={avg} />
      </div>
    );
  }

  // Result phase
  if (phase === "result") {
    // Build partner scores - either from real data or generate mock
    const partnerScoreMap = new Map(
      partnerAnswers.map((a) => [a.questionId, a.score]),
    );

    const questionResults: readonly QuizQuestionResult[] = questions.map(
      (q, i) => {
        const myScore = answers[i] ?? 0;
        const pScore = partnerScoreMap.get(q.id) ?? generateFallbackScore(i);
        return {
          question: q,
          myScore,
          partnerScore: pScore,
          difference: Math.abs(myScore - pScore),
        };
      },
    );

    const compatibility =
      answers.length > 0
        ? Math.round(
            ((4 * answers.length -
              questionResults.reduce((sum, r) => sum + r.difference, 0)) /
              (4 * answers.length)) *
              100,
          )
        : 0;

    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <Link
          href="/quiz"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
        >
          <ChevronLeft size={16} />
          クイズ一覧へ戻る
        </Link>
        <QuizResult
          pack={quizPack}
          compatibilityScore={compatibility}
          questionResults={questionResults}
        />
      </div>
    );
  }

  // Quiz phase
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Link
        href="/quiz"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
      >
        <ChevronLeft size={16} />
        クイズ一覧へ戻る
      </Link>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-xl">{pack.icon}</span>
        <h1 className="font-heading text-lg font-bold text-sage-900">
          {pack.title}
        </h1>
      </div>

      <div className="mb-8">
        <QuizProgress current={currentIndex + 1} total={totalQuestions} />
      </div>

      <div
        className={`rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 shadow-sm transition-all duration-300 ${
          isTransitioning
            ? "translate-x-[-8px] opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-600">
            {currentIndex + 1}
          </span>
          <span className="text-[10px] text-muted">
            {totalQuestions}問中{currentIndex + 1}問目
          </span>
        </div>

        <p className="mb-8 font-heading text-lg font-bold leading-relaxed text-sage-900">
          {currentQuestion?.text}
        </p>

        <LikertScale
          value={selectedScore}
          onSelect={handleSelect}
          disabled={isTransitioning}
        />
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        直感で選んでOK！深く考えなくて大丈夫です
      </p>
    </div>
  );
}

/** Fallback score for demo mode when partner hasn't answered */
function generateFallbackScore(index: number): number {
  const base = 3;
  const offset = ((index * 7 + 13) % 5) - 2;
  return Math.max(1, Math.min(5, base + offset));
}
