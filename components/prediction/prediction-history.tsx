"use client";

import { useState } from "react";
import { ChevronRight, Trophy, Minus } from "lucide-react";

interface PredictionHistoryEntry {
  readonly id: string;
  readonly question: string;
  readonly date: string;
  readonly winner: "me" | "partner" | "tie";
  readonly myAccuracy: number;
  readonly partnerAccuracy: number;
}

const MOCK_HISTORY: readonly PredictionHistoryEntry[] = [
  {
    id: "1",
    question: "次の休日に何をしたい？",
    date: "2026-02-26",
    winner: "me",
    myAccuracy: 85,
    partnerAccuracy: 72,
  },
  {
    id: "2",
    question: "今いちばん食べたいものは？",
    date: "2026-02-25",
    winner: "partner",
    myAccuracy: 60,
    partnerAccuracy: 90,
  },
  {
    id: "3",
    question: "10年後どこに住んでいたい？",
    date: "2026-02-24",
    winner: "tie",
    myAccuracy: 75,
    partnerAccuracy: 75,
  },
  {
    id: "4",
    question: "最近いちばん感謝していることは？",
    date: "2026-02-23",
    winner: "me",
    myAccuracy: 92,
    partnerAccuracy: 68,
  },
  {
    id: "5",
    question: "パートナーの好きなところ Top 3 は？",
    date: "2026-02-22",
    winner: "partner",
    myAccuracy: 55,
    partnerAccuracy: 80,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

function WinnerBadge({ winner }: { readonly winner: "me" | "partner" | "tie" }) {
  if (winner === "me") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-semibold text-sage-700">
        <Trophy size={10} />
        勝ち
      </span>
    );
  }
  if (winner === "partner") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-blush-50 px-2 py-0.5 text-[10px] font-semibold text-blush-500">
        <Trophy size={10} />
        負け
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-ivory-100 px-2 py-0.5 text-[10px] font-semibold text-gold-500">
      <Minus size={10} />
      引き分け
    </span>
  );
}

interface HistoryDetailProps {
  readonly entry: PredictionHistoryEntry;
  readonly onClose: () => void;
}

function HistoryDetail({ entry, onClose }: HistoryDetailProps) {
  return (
    <div className="rounded-2xl border border-ivory-200 bg-white p-5">
      <button
        onClick={onClose}
        className="mb-3 text-xs font-medium text-sage-500 transition-colors hover:text-sage-700"
      >
        ← 一覧に戻る
      </button>
      <p className="mb-1 text-xs text-gold-400">{formatDate(entry.date)}</p>
      <h4 className="mb-4 font-heading text-base font-bold text-sage-900">
        {entry.question}
      </h4>
      <div className="mb-4 flex items-center justify-center">
        <WinnerBadge winner={entry.winner} />
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-sage-700">あなたの的中度</span>
            <span className="font-bold text-sage-700">{entry.myAccuracy}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
            <div
              className="h-full rounded-full bg-sage-500"
              style={{ width: `${entry.myAccuracy}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-sage-700">パートナーの的中度</span>
            <span className="font-bold text-sage-700">{entry.partnerAccuracy}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ivory-200">
            <div
              className="h-full rounded-full bg-blush-400"
              style={{ width: `${entry.partnerAccuracy}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PredictionHistory() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEntry = MOCK_HISTORY.find((e) => e.id === selectedId);

  if (selectedEntry) {
    return (
      <HistoryDetail
        entry={selectedEntry}
        onClose={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="space-y-2">
      {MOCK_HISTORY.map((entry) => (
        <button
          key={entry.id}
          onClick={() => setSelectedId(entry.id)}
          className="flex w-full items-center gap-3 rounded-xl border border-ivory-200 bg-white p-4 text-left transition-all hover:border-sage-300 hover:shadow-sm"
        >
          <div className="flex-1">
            <p className="text-xs text-gold-400">{formatDate(entry.date)}</p>
            <p className="mt-0.5 text-sm font-medium text-sage-800">
              {entry.question}
            </p>
          </div>
          <WinnerBadge winner={entry.winner} />
          <ChevronRight size={16} className="text-gold-400" />
        </button>
      ))}
    </div>
  );
}
