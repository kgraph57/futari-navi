"use client";

import { useState, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { trackNewsletterSignupClicked } from "@/lib/analytics/events";

const SUBSTACK_URL = process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed || !SUBSTACK_URL) return;

      trackNewsletterSignupClicked("newsletter_form");
      window.open(
        `${SUBSTACK_URL}/subscribe?email=${encodeURIComponent(trimmed)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setSubmitted(true);
    },
    [email],
  );

  if (!SUBSTACK_URL) {
    return null;
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-sage-200 bg-white px-6 py-10 text-center shadow-sm sm:px-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="check" size={28} className="text-sage-600" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
          登録ページが開きました
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Substackの画面でメールアドレスを確認し、登録を完了してください。
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setEmail("");
          }}
          className="mt-4 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          別のアドレスで登録する
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-teal-100 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
      <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
        メルマガに登録しませんか？
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">
        おかもん先生が月2回、最新の小児医療トピックをわかりやすく解説します。登録は無料、いつでも解除できます。
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          required
          className="w-full rounded-full border border-teal-200 bg-white px-5 py-3 text-sm text-foreground placeholder:text-ivory-200 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 sm:flex-1"
        />
        <button
          type="submit"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-medium text-white shadow-lg shadow-teal-600/25 transition-all hover:bg-teal-700 hover:shadow-xl sm:w-auto"
        >
          <WatercolorIcon name="mail" size={18} />
          無料で登録
        </button>
      </form>
    </div>
  );
}
