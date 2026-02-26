"use client";

interface QuizWaitingProps {
  readonly averageScore: number;
}

export function QuizWaiting({ averageScore }: QuizWaitingProps) {
  return (
    <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-8 text-center shadow-sm">
      <div className="mb-4 text-4xl">🎉</div>
      <h2 className="font-heading text-xl font-bold text-sage-900">
        あなたのクイズは完了！
      </h2>
      <p className="mt-2 text-sm text-muted">
        パートナーが回答中...
      </p>

      {/* Gentle pulse animation */}
      <div className="mx-auto my-6 flex items-center justify-center gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-sage-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-sage-500 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-sage-600 [animation-delay:300ms]" />
      </div>

      {/* Preview score */}
      <div className="mx-auto max-w-[200px] rounded-xl bg-sage-50 p-4">
        <p className="text-[10px] font-medium text-sage-500">
          あなたの平均スコア
        </p>
        <p className="mt-1 font-heading text-2xl font-bold text-sage-700">
          {averageScore.toFixed(1)}{" "}
          <span className="text-sm font-normal text-muted">/ 5.0</span>
        </p>
      </div>

      <p className="mt-6 text-xs text-muted">
        パートナーが回答すると結果が表示されます
      </p>
    </div>
  );
}
