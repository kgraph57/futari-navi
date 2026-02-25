"use client";

import { useSearchParams } from "next/navigation";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { runSimulation } from "@/lib/simulator/engine";
import { ResultCard } from "@/components/simulator/result-card";
import type { SimulatorInput, SimulatorResult } from "@/lib/types";
import { trackSimulatorResultsViewed } from "@/lib/analytics/events";
import { ShareButton } from "@/components/shared/share-button";

function formatTotalAmount(amount: number): string {
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000);
    return `${man.toLocaleString()}万円`;
  }
  return `${amount.toLocaleString()}円`;
}

function parseFormData(searchParams: URLSearchParams): SimulatorInput | null {
  try {
    const raw = searchParams.get("data");
    if (!raw) return null;
    const decoded = decodeURIComponent(atob(raw));
    return JSON.parse(decoded) as SimulatorInput;
  } catch {
    return null;
  }
}

const MARRIAGE_SCHEDULE_ITEMS = [
  {
    period: "婚姻届提出前",
    items: [
      "TOKYOふたり結婚応援パスポートに登録（特典を活用）",
      "結婚新生活支援事業の対象自治体か確認",
    ],
  },
  {
    period: "婚姻届提出後〜2週間",
    items: [
      "社会保険の扶養手続き（該当する場合）",
      "姓変更に伴う各種届出（銀行・免許証等）",
      "引越しに伴う転入届・転出届",
    ],
  },
  {
    period: "年末調整・確定申告時",
    items: [
      "配偶者控除・配偶者特別控除の申告",
      "結婚新生活支援事業の補助金申請（該当する場合）",
    ],
  },
] as const;

function ResultsContent() {
  const searchParams = useSearchParams();

  const { input, result } = useMemo<{
    input: SimulatorInput | null;
    result: SimulatorResult | null;
  }>(() => {
    const parsed = parseFormData(searchParams);
    if (!parsed) return { input: null, result: null };
    return {
      input: parsed,
      result: runSimulation(parsed),
    };
  }, [searchParams]);

  useEffect(() => {
    if (result) {
      trackSimulatorResultsViewed(
        result.eligiblePrograms.length,
        result.totalAnnualEstimate,
      );
    }
  }, [result]);

  if (!input || !result) {
    return (
      <div className="min-h-screen bg-ivory-50 px-4 pb-16 pt-12">
        <div className="mx-auto max-w-2xl text-center">
          <WatercolorIcon
            name="alert"
            size={48}
            className="mx-auto text-sage-500"
          />
          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
            データが見つかりません
          </h1>
          <p className="mt-2 text-sm text-muted">
            チェッカーの入力データが見つかりませんでした。もう一度お試しください。
          </p>
          <Link
            href="/simulator/start"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-sage-700"
          >
            チェックをやり直す
          </Link>
        </div>
      </div>
    );
  }

  const financialPrograms = result.eligiblePrograms.filter(
    (ep) => ep.estimatedAmount > 0,
  );
  const servicePrograms = result.eligiblePrograms.filter(
    (ep) => ep.estimatedAmount === 0,
  );

  return (
    <div className="min-h-screen bg-ivory-50 px-4 pb-16 pt-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-gradient-to-br from-sage-600 to-sage-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center gap-3">
            <WatercolorIcon
              name="calculator"
              size={24}
              className="text-sage-200"
            />
            <h1 className="font-heading text-lg font-semibold">
              チェック結果
            </h1>
          </div>

          {result.totalAnnualEstimate > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-sage-200">推定受給額</p>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <WatercolorIcon name="star" size={32} className="text-sage-200" />
                <span className="font-heading text-5xl font-semibold tracking-tight sm:text-6xl">
                  {formatTotalAmount(result.totalAnnualEstimate)}
                </span>
              </div>
              <p className="mt-3 text-xs text-sage-200">
                ※ 金額は概算です。実際の受給額とは異なる場合があります。
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sage-100">
              対象制度: {result.eligiblePrograms.length}件
            </span>
          </div>
        </div>

        {financialPrograms.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              受給できる給付金・補助
            </h2>
            <p className="mt-1 text-sm text-muted">
              金額が推定できる制度です。
            </p>
            <div className="mt-4 space-y-4">
              {financialPrograms.map((ep) => (
                <ResultCard key={ep.program.slug} eligibleProgram={ep} />
              ))}
            </div>
          </section>
        )}

        {servicePrograms.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              利用できる制度・優遇
            </h2>
            <p className="mt-1 text-sm text-muted">
              状況に応じて活用できる制度です。
            </p>
            <div className="mt-4 space-y-4">
              {servicePrograms.map((ep) => (
                <ResultCard key={ep.program.slug} eligibleProgram={ep} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            結婚後の手続きスケジュール
          </h2>
          <p className="mt-1 text-sm text-muted">
            時期ごとにやるべき手続きの目安です。
          </p>
          <div className="mt-4 space-y-4">
            {MARRIAGE_SCHEDULE_ITEMS.map((schedule) => (
              <div
                key={schedule.period}
                className="rounded-xl border border-border bg-card p-4"
              >
                <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-sage-700">
                  <WatercolorIcon name="clock" size={16} />
                  {schedule.period}
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {schedule.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-card-foreground"
                    >
                      <WatercolorIcon
                        name="check"
                        size={14}
                        className="mt-0.5 shrink-0 text-sage-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/simulator/start"
            className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
          >
            <WatercolorIcon name="plus" size={16} />
            もう一度チェック
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
          >
            すべての制度を見る
          </Link>
          <ShareButton
            title="結婚制度チェッカー結果 | ふたりナビ"
            text={`結婚制度チェック結果：対象制度${result.eligiblePrograms.length}件${result.totalAnnualEstimate > 0 ? `（推定受給額 ${formatTotalAmount(result.totalAnnualEstimate)}）` : ""}`}
            url="https://futari-navi.com/simulator"
            contentType="simulator_result"
            contentId="simulator"
          />
        </div>

        <div className="mt-8 rounded-xl border border-border bg-ivory-100 p-4">
          <p className="text-xs leading-relaxed text-muted">
            本チェック結果は公開情報に基づく概算です。実際の受給額や対象要件は個別の状況や制度の詳細条件によって異なります。正確な情報は各制度の公式サイトや担当窓口でご確認ください。入力された情報はブラウザ上でのみ処理され、サーバーに送信・保存されることはありません。
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            チェッカーのトップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SimulatorResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ivory-50">
          <div className="text-center">
            <WatercolorIcon
              name="calculator"
              size={32}
              className="mx-auto animate-pulse text-sage-600"
            />
            <p className="mt-4 text-sm text-muted">チェック中...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
