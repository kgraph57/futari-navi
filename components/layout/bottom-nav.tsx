"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Target, Sparkles, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavTab {
  readonly href: string;
  readonly label: string;
  readonly Icon: LucideIcon;
}

const TABS: readonly NavTab[] = [
  { href: "/", label: "ホーム", Icon: Home },
  { href: "/daily", label: "質問", Icon: MessageCircle },
  { href: "/quiz", label: "クイズ", Icon: Target },
  { href: "/prediction", label: "予測", Icon: Sparkles },
  { href: "/my", label: "マイ", Icon: User },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur-sm md:hidden"
      aria-label="メインナビゲーション"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-center transition-colors ${
                active ? "text-sage-700" : "text-muted hover:text-sage-600"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <tab.Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? "opacity-100" : "opacity-70"}
              />
              <span
                className={`text-[10px] leading-tight ${
                  active ? "font-bold" : "font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
}
