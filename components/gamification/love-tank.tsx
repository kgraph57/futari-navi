"use client";

import { useEffect, useState } from "react";
import {
  calculateTankLevel,
  getTankColor,
  getTankMessage,
} from "@/lib/gamification/love-tank-engine";
import { getGamificationState } from "@/lib/gamification/store";

interface LoveTankProps {
  readonly compact?: boolean;
}

export function LoveTank({ compact = false }: LoveTankProps) {
  const [level, setLevel] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const state = getGamificationState();
    setLevel(calculateTankLevel(state.loveTank));
  }, []);

  const color = getTankColor(level);
  const message = getTankMessage(level);

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-ivory-200 bg-white p-4">
        {/* Mini tank */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-ivory-200 bg-ivory-50">
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${color} transition-all duration-1000`}
            style={{ height: mounted ? `${level}%` : "0%" }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-lg">
            💖
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-sage-800">{level}%</p>
          <p className="truncate text-xs text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 text-center">
      <p className="mb-4 font-heading text-sm font-bold text-sage-800">
        ふたりの愛情タンク
      </p>

      {/* Tank visualization */}
      <div className="relative mx-auto mb-4 h-40 w-32 overflow-hidden rounded-2xl border-2 border-ivory-200 bg-ivory-50">
        {/* Water fill */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${color} transition-all duration-1000 ease-out`}
          style={{ height: mounted ? `${level}%` : "0%" }}
        >
          {/* Wave effect */}
          <div className="absolute -top-2 left-0 right-0 h-4">
            <svg
              viewBox="0 0 120 8"
              className="w-full opacity-30"
              preserveAspectRatio="none"
            >
              <path
                d="M0,4 Q15,0 30,4 T60,4 T90,4 T120,4 V8 H0 Z"
                fill="currentColor"
                className="animate-pulse text-white"
              />
            </svg>
          </div>
        </div>

        {/* Heart overlay */}
        <span className="absolute inset-0 flex items-center justify-center text-3xl drop-shadow-sm">
          💖
        </span>

        {/* Level text */}
        <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold text-white drop-shadow-md">
          {level}%
        </span>
      </div>

      <p className="text-sm leading-relaxed text-sage-600">{message}</p>
    </div>
  );
}
