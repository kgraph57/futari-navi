"use client"

;

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { trackFeedbackSubmitted } from "@/lib/analytics/events";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating == null) return;
    trackFeedbackSubmitted(rating, comment || undefined);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setRating(null);
      setComment("");
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-sage-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-sage-700 sm:bottom-6"
        aria-label="フィードバックを送る"
      >
        <WatercolorIcon name="message" size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 rounded-2xl border border-border bg-card p-5 shadow-xl sm:bottom-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-card-foreground">
          ご感想を聞かせてください
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-1 text-muted hover:bg-ivory-100"
          aria-label="閉じる"
        >
          <WatercolorIcon name="check" size={16} />
        </button>
      </div>

      {submitted ? (
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-sage-600">
            ありがとうございます!
          </p>
          <p className="mt-1 text-xs text-muted">
            いただいたご意見を改善に活かします。
          </p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-xs text-muted">
            すくすくナビはいかがですか?
          </p>

          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-all ${
                  rating === n
                    ? "border-sage-500 bg-sage-50 text-sage-700"
                    : "border-border bg-white text-muted hover:border-sage-200"
                }`}
                aria-label={`${n}点`}
              >
                {n <= 2 ? "😔" : n === 3 ? "😐" : n === 4 ? "😊" : "🤩"}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ご意見・ご要望があればお聞かせください（任意）"
            className="mt-3 w-full rounded-lg border border-border bg-ivory-50 px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-100"
            rows={2}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={rating == null}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-sage-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:bg-ivory-200 disabled:text-muted"
          >
            <WatercolorIcon name="send" size={16} />
            送信する
          </button>
        </>
      )}
    </div>
  );
}
