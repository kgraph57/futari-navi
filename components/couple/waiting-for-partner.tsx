"use client";

interface WaitingForPartnerProps {
  readonly answeredAt: string;
  readonly onRemind?: () => void;
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function WaitingForPartner({
  answeredAt,
  onRemind,
}: WaitingForPartnerProps) {
  return (
    <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-coral-50/50 to-ivory-50 p-6 text-center">
      {/* Pulsing heart */}
      <div className="mb-4">
        <span className="animate-pulse-heart inline-block text-4xl">
          💌
        </span>
      </div>

      <p className="font-heading text-sm font-bold text-sage-800">
        あなたの回答は送信済み
      </p>

      {/* Floating dots */}
      <div className="my-3 flex items-center justify-center gap-1.5">
        <span className="animate-float-dot-1 inline-block h-1.5 w-1.5 rounded-full bg-coral-400" />
        <span className="animate-float-dot-2 inline-block h-1.5 w-1.5 rounded-full bg-coral-400" />
        <span className="animate-float-dot-3 inline-block h-1.5 w-1.5 rounded-full bg-coral-400" />
      </div>

      <p className="text-xs text-muted">
        パートナーの回答を待っています...
      </p>

      <p className="mt-3 text-xs text-muted">
        あなたは{" "}
        <span className="font-semibold text-sage-600">
          {formatTime(answeredAt)}
        </span>{" "}
        に回答しました
      </p>

      {onRemind && (
        <button
          onClick={onRemind}
          className="mt-4 rounded-lg border border-coral-200 bg-white px-4 py-2 text-xs font-medium text-coral-600 transition-colors hover:bg-coral-50"
        >
          リマインドする
        </button>
      )}
    </div>
  );
}
