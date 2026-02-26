"use client";

import Link from "next/link";
import clsx from "clsx";
import type { QuizCategory } from "@/lib/types";
import { QUIZ_CATEGORY_LABELS } from "@/lib/types";

interface QuizPackCardProps {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: QuizCategory;
  readonly icon: string;
  readonly questionCount: number;
  readonly isPremium: boolean;
  readonly completedScore?: number | null;
}

const CATEGORY_COLORS: Record<QuizCategory, string> = {
  communication: "bg-blue-50 text-blue-700",
  dreams: "bg-purple-50 text-purple-700",
  intimacy: "bg-pink-50 text-pink-700",
  values: "bg-sage-50 text-sage-700",
  support: "bg-green-50 text-green-700",
  fun: "bg-yellow-50 text-yellow-700",
} as const;

export function QuizPackCard({
  id,
  title,
  description,
  category,
  icon,
  questionCount,
  isPremium,
  completedScore,
}: QuizPackCardProps) {
  const hasCompleted = completedScore != null;

  if (isPremium) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-5 opacity-75">
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-gold-400/20 px-2.5 py-1 text-[10px] font-bold text-gold-600">
            Premium
          </span>
        </div>
        <div className="mb-3 text-3xl">{icon}</div>
        <h3 className="font-heading text-base font-bold text-sage-900">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={clsx(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
              CATEGORY_COLORS[category],
            )}
          >
            {QUIZ_CATEGORY_LABELS[category]}
          </span>
          <span className="text-[10px] text-muted">{questionCount}問</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/quiz/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-5 transition-all duration-200 group-hover:border-sage-300 group-hover:shadow-md group-hover:-translate-y-0.5">
        {hasCompleted && (
          <div className="absolute right-3 top-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-500 text-xs font-bold text-white shadow-sm">
              {completedScore}%
            </div>
          </div>
        )}
        <div className="mb-3 text-3xl">{icon}</div>
        <h3 className="font-heading text-base font-bold text-sage-900">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={clsx(
              "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
              CATEGORY_COLORS[category],
            )}
          >
            {QUIZ_CATEGORY_LABELS[category]}
          </span>
          <span className="text-[10px] text-muted">{questionCount}問</span>
        </div>
      </div>
    </Link>
  );
}
