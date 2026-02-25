"use client";

import { useState, useEffect, useCallback } from "react";
import type { DailyQuestion, QuestionCategory } from "@/lib/types";
import { QUESTION_CATEGORY_LABELS } from "@/lib/types";
import {
  getTodaysQuestion,
  submitAnswer,
  addPartnerAnswer,
} from "@/lib/daily-questions/engine";
import { getDailyState, saveDailyState } from "@/lib/daily-questions/store";
import { StreakBadge } from "./streak-badge";
import questionsData from "@/data/daily-questions.json";

const CATEGORY_COLORS: Record<QuestionCategory, string> = {
  communication: "bg-blue-50 text-blue-700",
  dreams: "bg-purple-50 text-purple-700",
  memories: "bg-pink-50 text-pink-700",
  values: "bg-sage-50 text-sage-700",
  fun: "bg-yellow-50 text-yellow-700",
  newlywed: "bg-coral-50 text-coral-700",
};

export function DailyQuestionCard() {
  const [state, setState] = useState(getDailyState);
  const [answer, setAnswer] = useState("");
  const [partnerInput, setPartnerInput] = useState("");
  const [showPartnerField, setShowPartnerField] = useState(false);

  const questions = questionsData as readonly DailyQuestion[];
  const answeredIds = state.answers.map((a) => a.questionId);
  const question = getTodaysQuestion(questions, answeredIds);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysAnswer = state.answers.find((a) => a.date === todayStr);
  const hasAnsweredToday = Boolean(todaysAnswer);

  const handleSubmit = useCallback(() => {
    if (!question || answer.trim().length === 0) return;
    const next = submitAnswer(state, question.id, answer.trim());
    saveDailyState(next);
    setState(next);
    setAnswer("");
  }, [question, answer, state]);

  const handlePartnerSubmit = useCallback(() => {
    if (partnerInput.trim().length === 0) return;
    const next = addPartnerAnswer(state, todayStr, partnerInput.trim());
    saveDailyState(next);
    setState(next);
    setPartnerInput("");
    setShowPartnerField(false);
  }, [partnerInput, state, todayStr]);

  useEffect(() => {
    setState(getDailyState());
  }, []);

  if (!question && !hasAnsweredToday) {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-white p-8 text-center">
        <p className="text-sm text-muted">質問を準備中です...</p>
      </div>
    );
  }

  const displayQuestion = hasAnsweredToday
    ? questions.find((q) => q.id === todaysAnswer?.questionId)
    : question;

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
        <StreakBadge streak={state.currentStreak} />
      </div>

      {/* Category Badge */}
      {displayQuestion && (
        <span
          className={`mb-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[displayQuestion.category]}`}
        >
          {QUESTION_CATEGORY_LABELS[displayQuestion.category]}
        </span>
      )}

      {/* Question */}
      <p className="mb-6 font-heading text-lg font-bold leading-relaxed text-sage-900">
        {displayQuestion?.text}
      </p>

      {/* Answer Area */}
      {hasAnsweredToday ? (
        <div className="space-y-4">
          {/* My answer */}
          <div className="rounded-xl bg-sage-50 p-4">
            <p className="mb-1 text-xs font-medium text-sage-500">
              あなたの回答
            </p>
            <p className="text-sm leading-relaxed text-sage-800">
              {todaysAnswer?.myAnswer}
            </p>
          </div>

          {/* Partner answer */}
          {todaysAnswer?.partnerAnswer ? (
            <div className="rounded-xl bg-coral-50 p-4">
              <p className="mb-1 text-xs font-medium text-coral-500">
                パートナーの回答
              </p>
              <p className="text-sm leading-relaxed text-coral-800">
                {todaysAnswer.partnerAnswer}
              </p>
            </div>
          ) : showPartnerField ? (
            <div className="space-y-2">
              <textarea
                value={partnerInput}
                onChange={(e) => setPartnerInput(e.target.value)}
                placeholder="パートナーの回答を入力..."
                className="w-full resize-none rounded-xl border border-ivory-200 bg-white p-3 text-sm text-sage-800 placeholder:text-sage-300 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400"
                rows={2}
              />
              <button
                onClick={handlePartnerSubmit}
                disabled={partnerInput.trim().length === 0}
                className="rounded-lg bg-coral-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-40"
              >
                回答を記録
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPartnerField(true)}
              className="w-full rounded-xl border border-dashed border-coral-200 bg-coral-50/50 p-4 text-center text-sm font-medium text-coral-500 transition-colors hover:bg-coral-50"
            >
              🔒 パートナーの回答を入力する
            </button>
          )}

          <p className="text-center text-xs text-muted">
            ✓ 回答済み — また明日会いましょう！
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="あなたの答えを書いてね..."
            className="w-full resize-none rounded-xl border border-ivory-200 bg-white p-4 text-sm text-sage-800 placeholder:text-sage-300 focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={answer.trim().length === 0}
            className="w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-700 disabled:opacity-40"
          >
            回答する
          </button>
        </div>
      )}
    </div>
  );
}
