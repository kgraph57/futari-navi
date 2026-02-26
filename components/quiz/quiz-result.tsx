"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { QuizQuestionResult, QuizPack } from "@/lib/types";

interface QuizResultProps {
  readonly pack: QuizPack;
  readonly compatibilityScore: number;
  readonly questionResults: readonly QuizQuestionResult[];
}

function getScoreColor(difference: number): string {
  if (difference <= 1) return "text-green-600";
  if (difference <= 2) return "text-yellow-600";
  return "text-red-500";
}

function getBarColor(difference: number): string {
  if (difference <= 1) return "bg-green-400";
  if (difference <= 2) return "bg-yellow-400";
  return "bg-red-400";
}

function getInterpretation(score: number): string {
  if (score >= 80) return "とても息が合っています！お互いの価値観がしっかり共有されています。";
  if (score >= 60) return "良い相性です。少しの違いが、お互いを知るきっかけになります。";
  if (score >= 40) return "考え方に違いがあるようです。じっくり話し合うチャンスですね。";
  return "見方が大きく異なる部分があります。お互いの気持ちを聴いてみましょう。";
}

function CircularProgress({ score }: { readonly score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 128 128">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="var(--color-ivory-200)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="var(--color-sage-500)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-sage-800">
          {animatedScore}
          <span className="text-lg">%</span>
        </span>
        <span className="text-[10px] text-muted">相性スコア</span>
      </div>
    </div>
  );
}

export function QuizResult({
  pack,
  compatibilityScore,
  questionResults,
}: QuizResultProps) {
  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 text-center shadow-sm">
        <div className="mb-2 text-3xl">{pack.icon}</div>
        <h2 className="font-heading text-lg font-bold text-sage-900">
          {pack.title}
        </h2>
        <p className="mb-4 mt-1 text-xs text-muted">ふたりの回答を比較しました</p>

        <CircularProgress score={compatibilityScore} />

        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-sage-700">
          {getInterpretation(compatibilityScore)}
        </p>
      </div>

      {/* Per-question comparison */}
      <div className="rounded-2xl border border-ivory-200 bg-white p-5">
        <h3 className="mb-4 font-heading text-sm font-bold text-sage-800">
          質問ごとの比較
        </h3>
        <div className="space-y-4">
          {questionResults.map((result, index) => (
            <div key={result.question.id} className="space-y-2">
              <p className="text-xs leading-relaxed text-sage-700">
                <span className="mr-1.5 font-bold text-sage-500">
                  Q{index + 1}.
                </span>
                {result.question.text}
              </p>
              <div className="flex items-center gap-3">
                {/* My score bar */}
                <div className="flex flex-1 items-center gap-2">
                  <span className="w-8 text-right text-[10px] font-medium text-sage-500">
                    自分
                  </span>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-ivory-200">
                    <div
                      className="h-full rounded-full bg-sage-400 transition-all duration-500"
                      style={{ width: `${(result.myScore / 5) * 100}%` }}
                    />
                  </div>
                  <span className="w-4 text-xs font-bold text-sage-600">
                    {result.myScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Partner score bar */}
                <div className="flex flex-1 items-center gap-2">
                  <span className="w-8 text-right text-[10px] font-medium text-coral-500">
                    相手
                  </span>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-ivory-200">
                    <div
                      className="h-full rounded-full bg-coral-400 transition-all duration-500"
                      style={{
                        width: `${(result.partnerScore / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-4 text-xs font-bold text-coral-500">
                    {result.partnerScore}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <span
                  className={clsx(
                    "text-[10px] font-medium",
                    getScoreColor(result.difference),
                  )}
                >
                  差: {result.difference}
                  {result.difference <= 1 && " (ぴったり!)"}
                </span>
              </div>
              {index < questionResults.length - 1 && (
                <div className="border-b border-ivory-100" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <span className={clsx("inline-block h-2 w-2 rounded-full", getBarColor(0))} />
          差 0-1: ぴったり
        </span>
        <span className="flex items-center gap-1">
          <span className={clsx("inline-block h-2 w-2 rounded-full", getBarColor(2))} />
          差 2: ふつう
        </span>
        <span className="flex items-center gap-1">
          <span className={clsx("inline-block h-2 w-2 rounded-full", getBarColor(3))} />
          差 3+: 要トーク
        </span>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-xl bg-sage-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sage-700 hover:shadow-md"
        >
          もう一つクイズに挑戦！
        </Link>
      </div>
    </div>
  );
}
