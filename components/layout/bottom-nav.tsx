"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { WatercolorIconName } from "@/components/icons/watercolor-icon";

interface NavTab {
  readonly href: string;
  readonly label: string;
  readonly icon: WatercolorIconName;
}

const TABS: readonly NavTab[] = [
  { href: "/", label: "ホーム", icon: "home" },
  { href: "/my/timeline", label: "タイムライン", icon: "calendar" },
  { href: "/articles", label: "記事", icon: "book" },
  { href: "/triage", label: "受診判断", icon: "alert" },
  { href: "/my", label: "マイページ", icon: "user" },
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
                active
                  ? "text-sage-700"
                  : "text-muted hover:text-sage-600"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <WatercolorIcon
                name={tab.icon}
                size={22}
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
