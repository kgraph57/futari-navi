"use client";

interface AnswerRevealProps {
  readonly myAnswer: string;
  readonly partnerAnswer: string;
  readonly myName?: string;
  readonly partnerName?: string;
}

export function AnswerReveal({
  myAnswer,
  partnerAnswer,
  myName = "あなた",
  partnerName = "パートナー",
}: AnswerRevealProps) {
  return (
    <div className="space-y-4">
      {/* Reveal header */}
      <div className="text-center">
        <span className="inline-block text-2xl">💕</span>
        <p className="mt-1 font-heading text-xs font-bold text-sage-600">
          ふたりの回答が揃いました
        </p>
      </div>

      {/* Side-by-side answers */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* My answer */}
        <div className="animate-reveal-scale rounded-xl bg-sage-50 p-4">
          <p className="mb-1.5 text-xs font-medium text-sage-500">
            {myName}
          </p>
          <p className="text-sm leading-relaxed text-sage-800">{myAnswer}</p>
        </div>

        {/* Partner answer */}
        <div className="animate-reveal-scale-delay rounded-xl bg-coral-50 p-4">
          <p className="mb-1.5 text-xs font-medium text-coral-500">
            {partnerName}
          </p>
          <p className="text-sm leading-relaxed text-coral-700">
            {partnerAnswer}
          </p>
        </div>
      </div>

      {/* Conversation prompt */}
      <div className="rounded-xl border border-dashed border-ivory-200 bg-white/60 p-3 text-center">
        <p className="text-xs text-muted">
          💬 感想を話そう！「そう思ってたんだ」の一言から会話が広がるよ
        </p>
      </div>
    </div>
  );
}
