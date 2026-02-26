"use client";

import Link from "next/link";
import { MessageCircle, Target, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickAction {
  readonly href: string;
  readonly label: string;
  readonly Icon: LucideIcon;
  readonly badge?: string;
  readonly iconColor: string;
  readonly bgColor: string;
}

const ACTIONS: readonly QuickAction[] = [
  {
    href: "/daily",
    label: "今日の質問",
    Icon: MessageCircle,
    badge: "New!",
    iconColor: "text-sage-600",
    bgColor: "bg-sage-50",
  },
  {
    href: "/quiz",
    label: "クイズ",
    Icon: Target,
    iconColor: "text-blush-400",
    bgColor: "bg-blush-50",
  },
  {
    href: "/prediction",
    label: "予測ゲーム",
    Icon: Sparkles,
    badge: "Play!",
    iconColor: "text-gold-500",
    bgColor: "bg-ivory-100",
  },
] as const;

export function QuickActionGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group relative flex flex-col items-center rounded-2xl border border-ivory-200 bg-white p-4 transition-all hover:border-sage-300 hover:shadow-sm"
        >
          {action.badge && (
            <span className="absolute -right-1 -top-1 rounded-full bg-blush-400 px-2 py-0.5 text-[9px] font-bold text-white">
              {action.badge}
            </span>
          )}
          <div
            className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${action.bgColor}`}
          >
            <action.Icon size={24} className={action.iconColor} />
          </div>
          <span className="text-xs font-semibold text-sage-800">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
