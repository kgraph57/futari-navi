"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-provider";
import { getAllChecklists } from "@/lib/checklists";
import {
  generateMarriageTimeline,
  getThisWeekEvents,
  getThisMonthEvents,
} from "@/lib/marriage-timeline-engine";
import type {
  MarriageTimelineItem,
  MarriageTimelineOptions,
} from "@/lib/marriage-timeline-engine";

interface MyPageClientProps {
  readonly articleTitles: Record<string, string>;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEYS = {
  date: "futari-navi-marriage-date",
  options: "futari-navi-marriage-options",
  completed: "futari-navi-completed-items",
  savedArticles: "futari-saved-articles",
} as const;

function loadStoredDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.date);
  } catch {
    return null;
  }
}

function loadStoredOptions(): MarriageTimelineOptions {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.options);
    return raw ? (JSON.parse(raw) as MarriageTimelineOptions) : {};
  } catch {
    return {};
  }
}

function loadCompletedIds(): ReadonlySet<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.completed);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function loadSavedArticles(): readonly string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.savedArticles);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Account banner
// ---------------------------------------------------------------------------

function AccountBanner() {
  const { user, signOut, configured } = useAuth();

  if (!configured) return null;

  if (!user) {
    return (
      <div className="rounded-xl border border-sage-200 bg-gradient-to-r from-sage-50 to-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
            <WatercolorIcon name="star" size={20} className="text-sage-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-sm font-semibold text-card-foreground">
              ログインでデータをクラウド保存
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              ログインすると、進捗データがクラウドに保存され、どのデバイスからでもアクセスできます。
            </p>
            <Link
              href="/auth/login"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sage-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-700"
            >
              <WatercolorIcon name="shield" size={12} />
              ログイン / 新規登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sm font-bold text-sage-700">
            {user.email?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">
              {user.email}
            </p>
            <p className="flex items-center gap-1 text-xs text-sage-600">
              <WatercolorIcon name="star" size={12} />
              クラウド同期オン
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-ivory-50 hover:text-foreground"
          aria-label="ログアウト"
        >
          <WatercolorIcon name="arrow_right" size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marriage summary dashboard
// ---------------------------------------------------------------------------

function MarriageSummaryDashboard({
  items,
}: {
  readonly items: readonly MarriageTimelineItem[];
}) {
  const weekItems = getThisWeekEvents(items);
  const monthItems = getThisMonthEvents(items);
  const overdueItems = items.filter(
    (i) => !i.completed && i.urgency === "overdue",
  );
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/my/timeline"
        className={`rounded-xl border p-4 transition-all hover:shadow-md ${
          overdueItems.length > 0
            ? "border-red-200 bg-gradient-to-br from-red-50 to-white"
            : "border-border bg-gradient-to-br from-ivory-50 to-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              overdueItems.length > 0 ? "bg-red-100" : "bg-ivory-100"
            }`}
          >
            <WatercolorIcon
              name="alert"
              size={16}
              className={
                overdueItems.length > 0 ? "text-red-600" : "text-muted"
              }
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">期限超過</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {overdueItems.length > 0
                ? `${overdueItems.length}件`
                : "なし"}
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="/my/timeline"
        className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
            <WatercolorIcon
              name="calendar"
              size={16}
              className="text-orange-600"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">今週やること</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {weekItems.length > 0 ? `${weekItems.length}件` : "なし"}
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="/my/timeline"
        className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <WatercolorIcon
              name="building"
              size={16}
              className="text-blue-600"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">今月やること</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {monthItems.length > 0 ? `${monthItems.length}件` : "なし"}
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="/my/timeline"
        className="rounded-xl border border-sage-200 bg-gradient-to-br from-sage-50 to-white p-4 transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-100">
            <WatercolorIcon name="check" size={16} className="text-sage-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">完了済み</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {completedCount}件
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checklist progress
// ---------------------------------------------------------------------------

function ChecklistProgressSection() {
  const checklists = getAllChecklists();
  const [completedMap, setCompletedMap] = useState<
    Record<string, ReadonlySet<string>>
  >({});

  useEffect(() => {
    const map: Record<string, ReadonlySet<string>> = {};
    for (const cl of checklists) {
      try {
        const raw = localStorage.getItem(`checklist-${cl.slug}`);
        map[cl.slug] = raw ? new Set(JSON.parse(raw) as string[]) : new Set();
      } catch {
        map[cl.slug] = new Set();
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from localStorage
    setCompletedMap(map);
  }, [checklists]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="space-y-3">
        {checklists.map((checklist) => {
          const completed = completedMap[checklist.slug] ?? new Set();
          const totalItems = checklist.items.length;
          const completedCount = checklist.items.filter((item) =>
            completed.has(item.id),
          ).length;
          const percentage =
            totalItems > 0
              ? Math.round((completedCount / totalItems) * 100)
              : 0;

          return (
            <Link
              key={checklist.slug}
              href={`/checklists/${checklist.slug}`}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-sage-200 hover:bg-sage-50/50"
            >
              <WatercolorIcon
                name="check"
                size={20}
                className={`shrink-0 ${
                  completedCount === totalItems
                    ? "text-sage-500"
                    : "text-gray-300"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-card-foreground">
                  {checklist.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ivory-100">
                    <div
                      className="h-full rounded-full bg-sage-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted">
                    {completedCount}/{totalItems}
                  </span>
                </div>
              </div>
              <WatercolorIcon
                name="arrow_right"
                size={16}
                className="shrink-0 text-muted"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Saved articles
// ---------------------------------------------------------------------------

function SavedArticlesSection({
  savedSlugs,
  articleTitles,
}: {
  readonly savedSlugs: readonly string[];
  readonly articleTitles: Record<string, string>;
}) {
  if (savedSlugs.length === 0) return null;

  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
        <WatercolorIcon name="bookmark" size={20} className="text-sage-600" />
        保存した記事
        <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
          {savedSlugs.length}件
        </span>
      </h2>
      <div className="mt-4 space-y-2">
        {savedSlugs.map((slug) => (
          <Link
            key={slug}
            href={`/articles/${slug}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-sage-200 hover:bg-sage-50/50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-50">
              <WatercolorIcon
                name="star"
                size={16}
                className="text-sage-600"
              />
            </div>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-card-foreground">
              {articleTitles[slug] ?? slug}
            </p>
            <WatercolorIcon
              name="arrow_right"
              size={16}
              className="shrink-0 text-muted"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/simulator/start"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sage-200 bg-sage-50">
          <WatercolorIcon
            name="calculator"
            size={20}
            className="text-sage-600"
          />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            給付金シミュレーション
          </h3>
          <p className="text-xs text-muted">受給額を確認する</p>
        </div>
      </Link>
      <Link
        href="/checklists"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blush-200 bg-blush-50">
          <WatercolorIcon name="star" size={20} className="text-blush-600" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            手続きガイド
          </h3>
          <p className="text-xs text-muted">やることを確認する</p>
        </div>
      </Link>
      <Link
        href="/my/timeline"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sage-200 bg-sage-50">
          <WatercolorIcon
            name="calendar"
            size={20}
            className="text-sage-600"
          />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            タイムライン
          </h3>
          <p className="text-xs text-muted">手続きの期限を時系列で確認</p>
        </div>
      </Link>
      <Link
        href="/glossary"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-200 bg-purple-50">
          <WatercolorIcon name="book" size={20} className="text-purple-600" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            用語集
          </h3>
          <p className="text-xs text-muted">手続き用語を確認する</p>
        </div>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MyPageClient({ articleTitles }: MyPageClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [marriageDateStr, setMarriageDateStr] = useState<string | null>(null);
  const [options, setOptions] = useState<MarriageTimelineOptions>({});
  const [completedIds, setCompletedIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [savedArticles, setSavedArticles] = useState<readonly string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from localStorage
    setMarriageDateStr(loadStoredDate());
    setOptions(loadStoredOptions());
    setCompletedIds(loadCompletedIds());
    setSavedArticles(loadSavedArticles());
    setIsLoading(false);
  }, []);

  const marriageDate = useMemo(() => {
    if (marriageDateStr == null) return null;
    const d = new Date(marriageDateStr);
    return isNaN(d.getTime()) ? null : d;
  }, [marriageDateStr]);

  const timelineItems = useMemo(() => {
    if (marriageDate == null) return null;
    return generateMarriageTimeline(marriageDate, options, completedIds);
  }, [marriageDate, options, completedIds]);

  const handleDateSave = useCallback((dateStr: string) => {
    try {
      localStorage.setItem(STORAGE_KEYS.date, dateStr);
    } catch {
      // Ignore
    }
    setMarriageDateStr(dateStr);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-48 animate-pulse rounded bg-ivory-200" />
          <div className="mt-6 h-64 animate-pulse rounded-xl bg-ivory-200" />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <WatercolorIcon
              name="user"
              size={28}
              className="mr-2 inline-block text-sage-600"
            />
            マイページ
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            結婚手続きの進捗管理と各種ツールへのアクセス
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <AccountBanner />

          {marriageDate == null ? (
            <div className="rounded-2xl border border-sage-200 bg-gradient-to-br from-sage-50 to-white p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
                  <WatercolorIcon
                    name="calendar"
                    size={32}
                    className="text-sage-600"
                  />
                </div>
                <h2 className="mt-4 font-heading text-lg font-bold text-foreground sm:text-xl">
                  入籍日（予定日）を登録してください
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                  登録すると、今週やること・今月やることが自動で表示されます。届出・名義変更の期限が近づくとお知らせします。
                </p>
                <div className="mt-5 grid w-full max-w-sm gap-2 text-left sm:grid-cols-3">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-card-foreground shadow-sm">
                    <WatercolorIcon
                      name="clipboard"
                      size={16}
                      className="shrink-0 text-blue-600"
                    />
                    <span>届出・申請</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-card-foreground shadow-sm">
                    <WatercolorIcon
                      name="building"
                      size={16}
                      className="shrink-0 text-sage-600"
                    />
                    <span>名義変更</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-card-foreground shadow-sm">
                    <WatercolorIcon
                      name="calculator"
                      size={16}
                      className="shrink-0 text-purple-600"
                    />
                    <span>控除・給付</span>
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <label className="text-sm font-medium text-sage-700">
                    入籍日（予定日）
                  </label>
                  <input
                    type="date"
                    className="rounded-lg border border-sage-300 px-4 py-2 text-sm text-foreground shadow-sm focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleDateSave(e.target.value);
                      }
                    }}
                  />
                  <p className="text-xs text-muted">あとから変更できます</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/my/timeline"
                className="flex items-center gap-4 rounded-xl border border-sage-200 bg-gradient-to-r from-sage-50 to-white p-5 transition-all hover:border-sage-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-100">
                  <WatercolorIcon
                    name="calendar"
                    size={24}
                    className="text-sage-600"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-base font-semibold text-card-foreground">
                    今週やることを確認する
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    届出・名義変更・申請のタイムラインを見る
                  </p>
                </div>
                <WatercolorIcon
                  name="arrow_right"
                  size={20}
                  className="shrink-0 text-sage-400"
                />
              </Link>

              {timelineItems != null && (
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    サマリー
                  </h2>
                  <div className="mt-4">
                    <MarriageSummaryDashboard items={timelineItems} />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              手続きの進捗
            </h2>
            <div className="mt-4">
              <ChecklistProgressSection />
            </div>
          </div>

          <SavedArticlesSection
            savedSlugs={savedArticles}
            articleTitles={articleTitles}
          />

          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              クイックアクション
            </h2>
            <div className="mt-4">
              <QuickActions />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
