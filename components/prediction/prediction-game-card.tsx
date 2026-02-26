"use client";

import { useState, useCallback, useEffect } from "react";
import { Send, Clock, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { useCoupleContext } from "@/lib/couple/provider";
import {
  createPredictionRound,
  submitPrediction,
  getTodaysPredictionRound,
  calculateAccuracy,
  completePredictionRound,
} from "@/lib/prediction/queries";
import type { Prediction } from "@/lib/types";

type GameStep = "loading" | "my-answer" | "predict-partner" | "waiting" | "results";

interface PredictionResultData {
  readonly myAnswer: string;
  readonly partnerAnswer: string;
  readonly myPrediction: string;
  readonly partnerPrediction: string;
  readonly myAccuracy: number;
  readonly partnerAccuracy: number;
  readonly winner: "me" | "partner" | "tie";
}

interface PredictionGameCardProps {
  readonly question: string;
  readonly questionId: string;
}

function StepIndicator({ current }: { readonly current: number }) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`h-2 rounded-full transition-all ${
            step === current
              ? "w-8 bg-sage-500"
              : step < current
                ? "w-2 bg-sage-300"
                : "w-2 bg-ivory-200"
          }`}
        />
      ))}
    </div>
  );
}

function MyAnswerStep({
  question,
  onSubmit,
  submitting,
}: {
  readonly question: string;
  readonly onSubmit: (answer: string) => void;
  readonly submitting: boolean;
}) {
  const [answer, setAnswer] = useState("");

  return (
    <div>
      <StepIndicator current={1} />
      <p className="mb-2 text-center text-sm font-medium text-sage-600">
        Step 1
      </p>
      <h3 className="mb-4 text-center font-heading text-lg font-bold text-sage-900">
        あなたはどう思う？
      </h3>
      <div className="mb-6 rounded-xl border border-ivory-200 bg-ivory-50 p-4">
        <p className="text-center text-base font-medium text-sage-800">
          {question}
        </p>
      </div>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="あなたの回答を入力..."
        className="mb-4 w-full resize-none rounded-xl border border-ivory-200 bg-white p-4 text-sm text-sage-900 placeholder:text-gold-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
        rows={3}
      />
      <button
        onClick={() => onSubmit(answer)}
        disabled={answer.trim().length === 0 || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sage-700 disabled:opacity-40"
      >
        <Send size={16} />
        {submitting ? "送信中..." : "回答する"}
      </button>
    </div>
  );
}

function PredictPartnerStep({
  question,
  onSubmit,
  submitting,
}: {
  readonly question: string;
  readonly onSubmit: (prediction: string) => void;
  readonly submitting: boolean;
}) {
  const [prediction, setPrediction] = useState("");

  return (
    <div>
      <StepIndicator current={2} />
      <p className="mb-2 text-center text-sm font-medium text-sage-600">
        Step 2
      </p>
      <h3 className="mb-4 text-center font-heading text-lg font-bold text-sage-900">
        パートナーはなんて答えると思う？
      </h3>
      <div className="mb-6 rounded-xl border border-ivory-200 bg-ivory-50 p-4">
        <p className="text-center text-base font-medium text-sage-800">
          {question}
        </p>
      </div>
      <textarea
        value={prediction}
        onChange={(e) => setPrediction(e.target.value)}
        placeholder="パートナーの回答を予想..."
        className="mb-4 w-full resize-none rounded-xl border border-ivory-200 bg-white p-4 text-sm text-sage-900 placeholder:text-gold-400 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
        rows={3}
      />
      <button
        onClick={() => onSubmit(prediction)}
        disabled={prediction.trim().length === 0 || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-sage-700 disabled:opacity-40"
      >
        <Send size={16} />
        {submitting ? "送信中..." : "予想を送信"}
      </button>
    </div>
  );
}

function WaitingStep() {
  return (
    <div>
      <StepIndicator current={3} />
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-50">
          <Clock size={32} className="text-sage-400" />
        </div>
        <h3 className="mb-2 font-heading text-lg font-bold text-sage-900">
          パートナーの回答を待っています...
        </h3>
        <p className="text-sm text-gold-500">
          パートナーが回答すると結果が表示されます
        </p>
      </div>
    </div>
  );
}

function ResultsStep({ data }: { readonly data: PredictionResultData }) {
  const winnerLabel =
    data.winner === "me"
      ? "あなたの勝ち!"
      : data.winner === "partner"
        ? "パートナーの勝ち!"
        : "引き分け!";

  return (
    <div>
      <StepIndicator current={4} />

      {/* Winner announcement */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blush-50">
          {data.winner === "tie" ? (
            <Sparkles size={28} className="text-blush-400" />
          ) : (
            <Trophy size={28} className="text-blush-400" />
          )}
        </div>
        <h3 className="font-heading text-xl font-bold text-sage-900">
          {winnerLabel}
        </h3>
      </div>

      {/* 2x2 grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-ivory-200 bg-white p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold-500">
            私の回答
          </p>
          <p className="text-sm text-sage-800">{data.myAnswer}</p>
        </div>
        <div className="rounded-xl border border-ivory-200 bg-white p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold-500">
            パートナーの回答
          </p>
          <p className="text-sm text-sage-800">{data.partnerAnswer}</p>
        </div>
        <div
          className={`rounded-xl border p-3 ${
            data.myAccuracy >= 70
              ? "border-safe/30 bg-safe/5 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
              : "border-ivory-200 bg-white"
          }`}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold-500">
            私の予想
          </p>
          <p className="text-sm text-sage-800">{data.myPrediction}</p>
          <p className="mt-1 text-xs font-semibold text-sage-600">
            的中度: {data.myAccuracy}%
          </p>
        </div>
        <div
          className={`rounded-xl border p-3 ${
            data.partnerAccuracy >= 70
              ? "border-safe/30 bg-safe/5 shadow-[0_0_12px_rgba(34,197,94,0.15)]"
              : "border-ivory-200 bg-white"
          }`}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gold-500">
            パートナーの予想
          </p>
          <p className="text-sm text-sage-800">{data.partnerPrediction}</p>
          <p className="mt-1 text-xs font-semibold text-sage-600">
            的中度: {data.partnerAccuracy}%
          </p>
        </div>
      </div>

      {/* Accuracy bars */}
      <div className="rounded-xl border border-ivory-200 bg-ivory-50 p-4">
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-sage-700">あなたの的中度</span>
            <span className="font-bold text-sage-700">{data.myAccuracy}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
            <div
              className="h-full rounded-full bg-sage-500 transition-all"
              style={{ width: `${data.myAccuracy}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-sage-700">パートナーの的中度</span>
            <span className="font-bold text-sage-700">
              {data.partnerAccuracy}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
            <div
              className="h-full rounded-full bg-blush-400 transition-all"
              style={{ width: `${data.partnerAccuracy}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PredictionGameCard({
  question,
  questionId,
}: PredictionGameCardProps) {
  const { user } = useAuth();
  const { couple } = useCoupleContext();

  const [step, setStep] = useState<GameStep>("loading");
  const [roundId, setRoundId] = useState<string | null>(null);
  const [myAnswerText, setMyAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultData, setResultData] = useState<PredictionResultData | null>(null);

  // Load existing round state on mount
  useEffect(() => {
    if (!couple || !user) {
      setStep("my-answer");
      return;
    }

    let cancelled = false;

    (async () => {
      const existing = await getTodaysPredictionRound(couple.id);
      if (cancelled) return;

      if (!existing.data) {
        setStep("my-answer");
        return;
      }

      const { round, predictions } = existing.data;
      setRoundId(round.id);

      const myPred = predictions.find((p) => p.userId === user.id);
      const partnerPred = predictions.find((p) => p.userId !== user.id);

      if (round.status === "completed" && myPred && partnerPred) {
        setResultData(buildResultData(myPred, partnerPred, user.id));
        setStep("results");
      } else if (myPred && partnerPred) {
        // Both answered but not yet scored - compute and complete
        const result = buildResultData(myPred, partnerPred, user.id);
        const winnerId =
          result.winner === "me" ? user.id
            : result.winner === "partner" ? partnerPred.userId
            : null;
        await completePredictionRound(round.id, winnerId);
        setResultData(result);
        setStep("results");
      } else if (myPred) {
        setStep("waiting");
      } else {
        setStep("my-answer");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [couple, user]);

  const handleMyAnswer = useCallback(
    async (answer: string) => {
      setMyAnswerText(answer);

      if (!couple || !user) {
        setStep("predict-partner");
        return;
      }

      setStep("predict-partner");
    },
    [couple, user],
  );

  const handlePrediction = useCallback(
    async (prediction: string) => {
      if (!couple || !user) return;
      setSubmitting(true);

      // Ensure round exists
      let currentRoundId = roundId;
      if (!currentRoundId) {
        const roundResult = await createPredictionRound(couple.id, questionId);
        if (roundResult.error || !roundResult.data) {
          setSubmitting(false);
          return;
        }
        currentRoundId = roundResult.data.id;
        setRoundId(currentRoundId);
      }

      // Submit prediction
      const result = await submitPrediction(
        currentRoundId,
        user.id,
        myAnswerText,
        prediction,
      );

      if (result.error) {
        setSubmitting(false);
        return;
      }

      // Check if partner has already answered
      const roundData = await getTodaysPredictionRound(couple.id);
      if (roundData.data) {
        const { predictions } = roundData.data;
        const partnerPred = predictions.find((p) => p.userId !== user.id);
        const myPred = predictions.find((p) => p.userId === user.id);

        if (myPred && partnerPred) {
          const resultDisplay = buildResultData(myPred, partnerPred, user.id);
          const winnerId =
            resultDisplay.winner === "me" ? user.id
              : resultDisplay.winner === "partner" ? partnerPred.userId
              : null;
          await completePredictionRound(currentRoundId, winnerId);
          setResultData(resultDisplay);
          setStep("results");
        } else {
          setStep("waiting");
        }
      } else {
        setStep("waiting");
      }

      setSubmitting(false);
    },
    [couple, user, roundId, questionId, myAnswerText],
  );

  if (step === "loading") {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
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
    <div className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
      {step === "my-answer" && (
        <MyAnswerStep
          question={question}
          onSubmit={handleMyAnswer}
          submitting={submitting}
        />
      )}
      {step === "predict-partner" && (
        <PredictPartnerStep
          question={question}
          onSubmit={handlePrediction}
          submitting={submitting}
        />
      )}
      {step === "waiting" && <WaitingStep />}
      {step === "results" && resultData && <ResultsStep data={resultData} />}
    </div>
  );
}

function buildResultData(
  myPred: Prediction,
  partnerPred: Prediction,
  myUserId: string,
): PredictionResultData {
  const myAccuracy = calculateAccuracy(
    myPred.predictedPartnerAnswer,
    partnerPred.myAnswer,
  );
  const partnerAccuracy = calculateAccuracy(
    partnerPred.predictedPartnerAnswer,
    myPred.myAnswer,
  );

  const winner: "me" | "partner" | "tie" =
    myAccuracy > partnerAccuracy
      ? "me"
      : partnerAccuracy > myAccuracy
        ? "partner"
        : "tie";

  return {
    myAnswer: myPred.myAnswer,
    partnerAnswer: partnerPred.myAnswer,
    myPrediction: myPred.predictedPartnerAnswer,
    partnerPrediction: partnerPred.predictedPartnerAnswer,
    myAccuracy,
    partnerAccuracy,
    winner,
  };
}
