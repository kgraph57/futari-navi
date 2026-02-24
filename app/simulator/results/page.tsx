"use client";

import { useSearchParams } from "next/navigation";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { runSimulation } from "@/lib/simulator/engine";
import { ResultCard } from "@/components/simulator/result-card";
import { LifePlanTimeline } from "@/components/simulator/life-plan-timeline";
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
            className="mx-auto   text-blush-500"
          />
          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
            データが見つかりません
          </h1>
          <p className="mt-2 text-sm text-muted">
            シミュレーションの入力データが見つかりませんでした。もう一度お試しください。
          </p>
          <Link
            href="/simulator/start"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-sage-700"
          >
            シミュレーションをやり直す
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
              シミュレーション結果
            </h1>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-sage-200">年間推定受給額</p>
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

          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sage-100">
              対象制度: {result.eligiblePrograms.length}件
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sage-100">
              お子さん: {input.children.length}人
            </span>
          </div>
        </div>

        {financialPrograms.length > 0 && (
          <section className="mt-8">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              受給できる給付金・助成
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
              利用できるサービス・制度
            </h2>
            <p className="mt-1 text-sm text-muted">
              金額は利用状況によって変わる制度です。
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
            お子さんのライフプラン
          </h2>
          <p className="mt-1 text-sm text-muted">
            年齢ごとに受けられる制度の一覧です。
          </p>
          <div className="mt-4">
            <LifePlanTimeline
              children={input.children}
              eligiblePrograms={result.eligiblePrograms}
            />
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/simulator/start"
            className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
          >
            <WatercolorIcon name="plus" size={16} />
            もう一度シミュレーション
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
          >
            すべての制度を見る
          </Link>
          <ShareButton
            title="給付金シミュレーター結果 | すくすくナビ"
            text={`港区の子育て給付金シミュレーション結果：年間推定 ${formatTotalAmount(result.totalAnnualEstimate)}（対象制度${result.eligiblePrograms.length}件）`}
            url="https://kgraph57.github.io/sukusuku-navi/simulator"
            contentType="simulator_result"
            contentId="simulator"
          />
        </div>

        <div className="mt-8 rounded-xl border border-border bg-ivory-100 p-4">
          <p className="text-xs leading-relaxed text-muted">
            本シミュレーション結果は港区の公開情報に基づく概算です。実際の受給額は個別の状況や制度の詳細条件によって異なります。正確な情報は港区の各担当窓口やウェブサイトでご確認ください。入力された情報はブラウザ上でのみ処理され、サーバーに送信・保存されることはありません。
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            シミュレーターのトップに戻る
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
              className="mx-auto   animate-pulse text-sage-600"
            />
            <p className="mt-4 text-sm text-muted">計算中...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
