"use client";

import { Trophy, Minus } from "lucide-react";

interface ScoreboardData {
  readonly myName: string;
  readonly partnerName: string;
  readonly myPoints: number;
  readonly partnerPoints: number;
  readonly myWins: number;
  readonly partnerWins: number;
  readonly ties: number;
}

interface PredictionScoreboardProps {
  readonly data?: ScoreboardData;
}

const MOCK_DATA: ScoreboardData = {
  myName: "あなた",
  partnerName: "パートナー",
  myPoints: 42,
  partnerPoints: 38,
  myWins: 7,
  partnerWins: 5,
  ties: 3,
};

export function PredictionScoreboard({ data }: PredictionScoreboardProps) {
  const scores = data ?? MOCK_DATA;
  const totalPoints = Math.max(scores.myPoints + scores.partnerPoints, 1);
  const myRatio = Math.round((scores.myPoints / totalPoints) * 100);
  const partnerRatio = 100 - myRatio;

  return (
    <div className="rounded-2xl border border-ivory-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Trophy size={18} className="text-blush-400" />
        <h3 className="font-heading text-base font-bold text-sage-900">
          スコアボード
        </h3>
      </div>

      {/* Points comparison */}
      <div className="mb-5 flex items-end justify-between">
        <div className="text-center">
          <p className="text-3xl font-bold text-sage-700">{scores.myPoints}</p>
          <p className="mt-1 text-xs font-medium text-gold-500">
            {scores.myName}
          </p>
        </div>
        <div className="mb-1 text-sm font-medium text-gold-400">VS</div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blush-400">
            {scores.partnerPoints}
          </p>
          <p className="mt-1 text-xs font-medium text-gold-500">
            {scores.partnerName}
          </p>
        </div>
      </div>

      {/* Bar visualization */}
      <div className="mb-5 flex h-4 overflow-hidden rounded-full">
        <div
          className="bg-sage-500 transition-all"
          style={{ width: `${myRatio}%` }}
        />
        <div
          className="bg-blush-400 transition-all"
          style={{ width: `${partnerRatio}%` }}
        />
      </div>

      {/* Win/Loss/Tie */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-sage-50 px-3 py-2">
          <p className="text-lg font-bold text-sage-700">{scores.myWins}</p>
          <p className="text-[10px] text-gold-500">勝ち</p>
        </div>
        <div className="rounded-lg bg-ivory-100 px-3 py-2">
          <div className="flex items-center justify-center">
            <Minus size={14} className="mr-1 text-gold-400" />
            <p className="text-lg font-bold text-gold-500">{scores.ties}</p>
          </div>
          <p className="text-[10px] text-gold-500">引き分け</p>
        </div>
        <div className="rounded-lg bg-blush-50 px-3 py-2">
          <p className="text-lg font-bold text-blush-400">
            {scores.partnerWins}
          </p>
          <p className="text-[10px] text-gold-500">負け</p>
        </div>
      </div>
    </div>
  );
}
