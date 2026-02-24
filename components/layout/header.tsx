"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { WatercolorIconName } from "@/components/icons/watercolor-icon";
import { useAuth } from "@/lib/auth/auth-provider";

interface NavGroup {
  readonly label: string;
  readonly items: readonly {
    readonly href: string;
    readonly label: string;
    readonly icon: WatercolorIconName;
    readonly description: string;
  }[];
}

const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "調べる",
    items: [
      {
        href: "/articles",
        label: "記事一覧",
        icon: "book",
        description: "小児科医監修の子育て情報",
      },
      {
        href: "/vaccines",
        label: "予防接種",
        icon: "syringe",
        description: "接種スケジュールと詳細",
      },
      {
        href: "/checkups",
        label: "健診ガイド",
        icon: "stethoscope",
        description: "乳幼児健診の時期と内容",
      },
      {
        href: "/infection-alerts",
        label: "感染症アラート",
        icon: "alert" as const,
        description: "今流行している感染症と予防情報",
      },
    ],
  },
  {
    label: "手続き",
    items: [
      {
        href: "/programs",
        label: "制度一覧",
        icon: "clipboard",
        description: "助成金・給付金・支援制度",
      },
      {
        href: "/simulator",
        label: "給付金シミュレーター",
        icon: "calculator",
        description: "受給額をかんたん計算",
      },
      {
        href: "/checklists",
        label: "手続きガイド",
        icon: "clipboard",
        description: "出産前後のやることリスト",
      },
    ],
  },
  {
    label: "探す",
    items: [
      {
        href: "/clinics",
        label: "小児科マップ",
        icon: "mappin",
        description: "港区の小児科・夜間対応",
      },
      {
        href: "/nurseries",
        label: "保育園探し",
        icon: "building",
        description: "認可・認証保育園の情報",
      },
    ],
  },
] as const;

const STANDALONE_NAV = {
  href: "/triage",
  label: "受診判断",
  icon: "alert" as WatercolorIconName,
} as const;

function DropdownMenu({
  group,
  isOpen,
  onOpen,
  onClose,
}: {
  readonly group: NavGroup;
  readonly isOpen: boolean;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onOpen();
  }, [onOpen]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(onClose, 150);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isOpen
            ? "bg-sage-50 text-sage-700"
            : "text-muted hover:bg-sage-50 hover:text-sage-700"
        }`}
        onClick={isOpen ? onClose : onOpen}
        aria-expanded={isOpen}
      >
        {group.label}
        <WatercolorIcon
          name="chevron_down"
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border bg-white p-2 shadow-lg">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-sage-50"
              onClick={onClose}
            >
              <WatercolorIcon
                name={item.icon}
                size={16}
                className="mt-0.5 shrink-0 text-sage-600"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile auth links
// ---------------------------------------------------------------------------

function MobileAuthLinks({ onClose }: { readonly onClose: () => void }) {
  const { user, loading, signOut, configured } = useAuth();

  if (!configured) {
    return (
      <Link
        href="/my"
        className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-sage-50 hover:text-sage-700 active:bg-sage-100"
        onClick={onClose}
      >
        <WatercolorIcon name="user" size={16} className="text-sage-600" />
        マイページ
      </Link>
    );
  }

  if (loading) {
    return <div className="h-11 animate-pulse rounded-lg bg-ivory-50" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-sage-600 transition-colors hover:bg-sage-50 active:bg-sage-100"
        onClick={onClose}
      >
        <WatercolorIcon name="user" size={16} />
        ログイン
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/my"
        className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-sage-50 hover:text-sage-700 active:bg-sage-100"
        onClick={onClose}
      >
        <WatercolorIcon name="user" size={16} className="text-sage-600" />
        マイページ
      </Link>
      <button
        type="button"
        onClick={async () => {
          await signOut();
          onClose();
        }}
        className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted transition-colors hover:bg-ivory-50 hover:text-foreground active:bg-ivory-100"
      >
        <WatercolorIcon name="logout" size={16} />
        ログアウト
      </button>
    </>
  );
}

// ---------------------------------------------------------------------------
// Desktop user menu (auth-aware)
// ---------------------------------------------------------------------------

function UserMenu() {
  const { user, loading, signOut, configured } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!configured) {
    return (
      <Link
        href="/my"
        className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-sage-50 hover:text-sage-700"
      >
        マイページ
      </Link>
    );
  }

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-ivory-100" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-lg px-3 py-2 text-sm font-medium text-sage-600 transition-colors hover:bg-sage-50 hover:text-sage-700"
      >
        ログイン
      </Link>
    );
  }

  const initial = user.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sm font-bold text-sage-700 transition-colors hover:bg-sage-200"
        aria-label="ユーザーメニュー"
        aria-expanded={isOpen}
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-white p-2 shadow-lg">
          <Link
            href="/my"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sage-50"
            onClick={() => setIsOpen(false)}
          >
            <WatercolorIcon name="user" size={16} className="text-sage-600" />
            マイページ
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-ivory-50 hover:text-foreground"
          >
            <WatercolorIcon name="logout" size={16} />
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main header
// ---------------------------------------------------------------------------

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/search");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
            <span className="font-heading text-sm font-bold leading-none text-white">
              す
            </span>
          </div>
          <span className="font-heading text-lg tracking-wide text-foreground">
            すくすくナビ
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_GROUPS.map((group) => (
            <DropdownMenu
              key={group.label}
              group={group}
              isOpen={openDropdown === group.label}
              onOpen={() => setOpenDropdown(group.label)}
              onClose={() => setOpenDropdown(null)}
            />
          ))}
          <Link
            href={STANDALONE_NAV.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            {STANDALONE_NAV.label}
          </Link>
          <div className="mx-1 h-5 w-px bg-border" />
          <UserMenu />
          <Link
            href="/search"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-sage-50 hover:text-sage-700"
            aria-label="検索"
          >
            <WatercolorIcon name="search" size={20} />
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/search"
            className="rounded-lg p-2 text-muted"
            aria-label="検索"
          >
            <WatercolorIcon name="search" size={20} />
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-muted"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <WatercolorIcon name="x" size={24} />
            ) : (
              <WatercolorIcon name="menu" size={24} />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-sm md:hidden">
          <div className="flex h-full flex-col px-6 pt-6 pb-8">
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg tracking-wide text-foreground">
                すくすくナビ
              </span>
              <button
                type="button"
                className="rounded-lg p-2 text-muted"
                onClick={() => setIsMenuOpen(false)}
                aria-label="メニューを閉じる"
              >
                <WatercolorIcon name="x" size={24} />
              </button>
            </div>
            <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-1 pb-2 text-xs font-medium uppercase tracking-[0.15em] text-muted">
                    {group.label}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 font-heading text-lg tracking-wide text-foreground transition-colors hover:text-sage-700 active:bg-sage-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <WatercolorIcon
                        name={item.icon}
                        size={16}
                        className="text-sage-600"
                      />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <Link
                  href={STANDALONE_NAV.href}
                  className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 font-heading text-lg tracking-wide text-red-600 transition-colors hover:text-red-700 active:bg-red-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <WatercolorIcon name={STANDALONE_NAV.icon} size={16} />
                  {STANDALONE_NAV.label}
                </Link>
                <MobileAuthLinks onClose={() => setIsMenuOpen(false)} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
