"use client"

;

import { useState, useEffect } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { useStore } from "@/lib/store";

const ONBOARDING_STEPS = [
  {
    href: "/my",
    icon: "sparkles",
    title: "お子さんを登録",
    description: "生年月日を登録するとパーソナライズされた情報が届きます",
    color: "bg-sage-50 text-sage-600",
  },
  {
    href: "/my/timeline",
    icon: "calendar",
    title: "タイムラインを確認",
    description: "今やるべき手続き・健診・予防接種を時系列で表示",
    color: "bg-blue-50 text-blue-600",
  },
  {
    href: "/vaccines",
    icon: "syringe",
    title: "予防接種スケジュール",
    description: "お子さんの月齢に合わせた接種スケジュールを確認",
    color: "bg-purple-50 text-purple-600",
  },
  {
    href: "/simulator/start",
    icon: "calculator",
    title: "給付金を調べる",
    description: "受けられる行政サービス・助成金を一括検索",
    color: "bg-blush-50 text-blush-500",
  },
] as const;

const DISMISSED_KEY = "sukusuku-onboarding-dismissed";

export function OnboardingBanner() {
  const store = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed === "true") return;

    store.getFamilyProfile().then((profile) => {
      if (!cancelled && profile === null) {
        setIsVisible(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  if (!isVisible) {
    return null;
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsVisible(false);
  }

  return (
    <section className="border-t border-border bg-gradient-to-br from-sage-50/80 to-ivory-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-2xl border border-sage-200 bg-white/80 p-6 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1.5 text-muted transition-colors hover:bg-ivory-100 hover:text-foreground"
            aria-label="閉じる"
          >
            <WatercolorIcon name="check" size={16} />
          </button>

          <div className="text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-sage-100/70 px-3 py-1 text-xs font-medium text-sage-700">
              <WatercolorIcon name="star" size={12} />
              はじめての方へ
            </p>
            <h2 className="mt-3 font-heading text-lg font-semibold text-foreground sm:text-xl">
              4ステップで始めるすくすくナビ
            </h2>
            <p className="mt-1 text-sm text-muted">
              お子さんに合わせた情報を受け取るための簡単ガイド
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {ONBOARDING_STEPS.map((step, index) => (
              <Link
                key={step.href}
                href={step.href}
                className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-sage-200 hover:shadow-md"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${step.color}`}
                  >
                    <WatercolorIcon name={step.icon as import("@/components/icons/watercolor-icon").WatercolorIconName} size={20} />
                  </div>
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-card-foreground group-hover:text-sage-700">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">
                    {step.description}
                  </p>
                </div>
                <WatercolorIcon name="arrow_right" size={16} className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/my"
              className="inline-flex items-center gap-2 rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
            >
              まずはお子さんを登録する
              <WatercolorIcon name="arrow_right" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
