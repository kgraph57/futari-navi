"use client";

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blush-50">
        <WatercolorIcon name="baby" size={40} className="text-blush-400" />
      </div>
      <h1 className="mt-6 font-heading text-2xl font-bold text-foreground">
        あれ、うまくいきませんでした
      </h1>
      <p className="mt-3 max-w-sm text-center text-base leading-relaxed text-muted">
        ページの読み込み中にちょっとした問題が起きました。下のボタンからもう一度お試しください。
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-gold-400">参照コード: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-sage-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sage-700 active:bg-sage-800"
        >
          <WatercolorIcon name="refresh" size={16} />
          もう一度読み込む
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-ivory-50 active:bg-ivory-100"
        >
          <WatercolorIcon name="home" size={16} />
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
