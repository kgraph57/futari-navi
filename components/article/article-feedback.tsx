"use client";

import { useState, useCallback } from "react";
import { trackFeedbackSubmitted } from "@/lib/analytics/events";

interface ArticleFeedbackProps {
  readonly articleSlug: string;
}

export function ArticleFeedback({ articleSlug }: ArticleFeedbackProps) {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleRate = useCallback(
    (rating: number) => {
      setSelected(rating);
      setSubmitted(true);
      trackFeedbackSubmitted(rating, `article:${articleSlug}`);
    },
    [articleSlug],
  );

  if (submitted) {
    return (
      <div className="mt-8 rounded-xl border border-teal-100 bg-teal-50/30 px-5 py-4 text-center">
        <p className="text-sm font-medium text-teal-800">
          フィードバックありがとうございます
        </p>
        <p className="mt-1 text-xs text-muted">
          今後の記事作成の参考にさせていただきます。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-ivory-100/50 px-5 py-5 text-center">
      <p className="font-heading text-sm font-semibold text-foreground">
        この記事は役に立ちましたか？
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        {[
          { rating: 5, label: "とても役立った", emoji: "\u2b50" },
          { rating: 4, label: "役立った", emoji: "\ud83d\udc4d" },
          { rating: 3, label: "普通", emoji: "\ud83e\udd14" },
          { rating: 2, label: "あまり", emoji: "\ud83d\ude15" },
        ].map((opt) => (
          <button
            key={opt.rating}
            type="button"
            onClick={() => handleRate(opt.rating)}
            className={`flex min-h-[44px] flex-col items-center gap-1 rounded-lg border px-3 py-2 text-xs transition-all hover:border-teal-300 hover:bg-teal-50 ${
              selected === opt.rating
                ? "border-teal-400 bg-teal-50"
                : "border-border bg-white"
            }`}
            aria-label={opt.label}
          >
            <span className="text-lg">{opt.emoji}</span>
            <span className="text-muted">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
