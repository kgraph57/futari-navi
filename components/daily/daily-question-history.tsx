"use client";

import { useEffect, useState } from "react";
import type { DailyQuestion, DailyAnswer, QuestionCategory } from "@/lib/types";
import { QUESTION_CATEGORY_LABELS } from "@/lib/types";
import { getDailyState } from "@/lib/daily-questions/store";
import questionsData from "@/data/daily-questions.json";

const CATEGORY_DOT: Record<QuestionCategory, string> = {
  communication: "bg-blue-400",
  dreams: "bg-purple-400",
  memories: "bg-pink-400",
  values: "bg-sage-400",
  fun: "bg-yellow-400",
  newlywed: "bg-coral-400",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function DailyQuestionHistory() {
  const [answers, setAnswers] = useState<readonly DailyAnswer[]>([]);
  const questions = questionsData as readonly DailyQuestion[];

  useEffect(() => {
    const state = getDailyState();
    setAnswers([...state.answers].reverse());
  }, []);

  if (answers.length === 0) {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-white p-8 text-center">
        <p className="text-2xl">📝</p>
        <p className="mt-2 font-heading text-sm font-bold text-sage-700">
          まだ回答がありません
        </p>
        <p className="mt-1 text-xs text-muted">
          今日の質問から始めよう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {answers.map((answer) => {
        const q = questions.find((qq) => qq.id === answer.questionId);
        if (!q) return null;

        return (
          <div
            key={answer.date}
            className="rounded-xl border border-ivory-200 bg-white p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-muted">
                {formatDate(answer.date)}
              </span>
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[q.category]}`}
              />
              <span className="text-xs text-muted">
                {QUESTION_CATEGORY_LABELS[q.category]}
              </span>
            </div>

            <p className="mb-3 text-sm font-bold text-sage-800">{q.text}</p>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg bg-sage-50 p-3">
                <p className="mb-0.5 text-[10px] font-medium text-sage-400">
                  あなた
                </p>
                <p className="text-xs leading-relaxed text-sage-700">
                  {answer.myAnswer}
                </p>
              </div>
              {answer.partnerAnswer ? (
                <div className="rounded-lg bg-coral-50 p-3">
                  <p className="mb-0.5 text-[10px] font-medium text-coral-400">
                    パートナー
                  </p>
                  <p className="text-xs leading-relaxed text-coral-700">
                    {answer.partnerAnswer}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-ivory-200 p-3">
                  <p className="text-[10px] text-muted">
                    パートナー未回答
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
