"use client";

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { LoveTank } from "@/components/gamification/love-tank";
import { BadgeGrid } from "@/components/gamification/badge-grid";

export default function GamificationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Back */}
      <Link
        href="/my"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
      >
        <WatercolorIcon name="chevron_left" size={16} />
        マイページへ戻る
      </Link>

      <h1 className="mb-8 font-heading text-2xl font-bold text-sage-900">
        ふたりの成長記録
      </h1>

      {/* Love Tank */}
      <div className="mb-8">
        <LoveTank />
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h2 className="mb-4 font-heading text-lg font-bold text-sage-800">
          バッジコレクション
        </h2>
        <BadgeGrid />
      </div>

      {/* Points Info */}
      <div className="rounded-2xl border border-ivory-200 bg-white p-6">
        <h2 className="mb-3 font-heading text-base font-bold text-sage-800">
          ポイントの貯め方
        </h2>
        <ul className="space-y-2 text-sm text-sage-600">
          <li className="flex items-center gap-2">
            <span className="text-base">💬</span>
            デイリー質問に回答 — +10pt
          </li>
          <li className="flex items-center gap-2">
            <span className="text-base">👫</span>
            パートナーも回答 — +5pt ボーナス
          </li>
          <li className="flex items-center gap-2">
            <span className="text-base">📖</span>
            記事を読む — +3pt
          </li>
          <li className="flex items-center gap-2">
            <span className="text-base">✅</span>
            チェックリスト完了 — +5pt
          </li>
          <li className="flex items-center gap-2">
            <span className="text-base">🔍</span>
            シミュレーター利用 — +3pt
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted">
          ※ 1日利用しないと愛情タンクが-5pt減少します
        </p>
      </div>
    </div>
  );
}
