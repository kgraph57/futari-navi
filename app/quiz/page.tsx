"use client";

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { QuizPackCard } from "@/components/quiz/quiz-pack-card";
import type { QuizCategory } from "@/lib/types";
import quizData from "@/data/quiz-packs.json";

interface PackData {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: QuizCategory;
  readonly icon: string;
  readonly questionCount: number;
  readonly isPremium: boolean;
}

export default function QuizPage() {
  const packs = quizData.packs as readonly PackData[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
      >
        <WatercolorIcon name="chevron_left" size={16} />
        ホームへ戻る
      </Link>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          <h1 className="font-heading text-2xl font-bold text-sage-900">
            カップルクイズ
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted">
          ふたりで同じ質問に答えて、相性をチェックしよう。
          <br />
          それぞれ回答すると結果が見られます。
        </p>
      </div>

      {/* Quiz Pack Grid */}
      <div className="grid grid-cols-2 gap-3">
        {packs.map((pack) => (
          <QuizPackCard
            key={pack.id}
            id={pack.id}
            title={pack.title}
            description={pack.description}
            category={pack.category}
            icon={pack.icon}
            questionCount={pack.questionCount}
            isPremium={pack.isPremium}
          />
        ))}
      </div>

      {/* Info footer */}
      <div className="mt-8 rounded-xl bg-ivory-100 p-4 text-center">
        <p className="text-xs leading-relaxed text-muted">
          各クイズは6問構成。所要時間は約2分です。
          <br />
          パートナーと同じクイズに答えて相性を確認しましょう！
        </p>
      </div>
    </div>
  );
}
