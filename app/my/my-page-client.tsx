"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { FamilyProfileSetup } from "@/components/family/family-profile-setup";
import { MigrationDialog } from "@/components/auth/migration-dialog";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth/auth-provider";
import type { FamilyProfile, ChildProfile } from "@/lib/store";
import { getChildAge } from "@/lib/utils/age";
import { getAllChecklists } from "@/lib/checklists";
import { generateTimeline } from "@/lib/timeline-engine";
import type { TimelineItem } from "@/lib/timeline-engine";

interface MyPageClientProps {
  readonly articleTitles: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Account status banner
// ---------------------------------------------------------------------------

function AccountBanner() {
  const { user, signOut, configured } = useAuth();

  // Supabase 未設定時はログインバナーを非表示
  if (!configured) {
    return null;
  }

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
              ログインすると、お子さんのデータがクラウドに保存され、どのデバイスからでもアクセスできます。
            </p>
            <Link
              href="/auth/login"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sage-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-700"
            >
              <WatercolorIcon name="shield" size={12} className=".5 .5" />
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
// Checklist progress card
// ---------------------------------------------------------------------------

function ChecklistProgressCard({ child }: { readonly child: ChildProfile }) {
  const checklists = getAllChecklists();
  const { years, months } = getChildAge(child.birthDate);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="baby" size={20} className="text-sage-600" />
        </div>
        <div>
          <h3 className="font-heading text-base font-semibold text-card-foreground">
            {child.nickname}
          </h3>
          <p className="text-xs text-muted">
            {years}歳{months}ヶ月
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {checklists.map((checklist) => {
          const totalItems = checklist.items.length;
          const completedCount = checklist.items.filter((item) =>
            child.completedItems.includes(item.id),
          ).length;
          const percentage =
            totalItems > 0
              ? Math.round((completedCount / totalItems) * 100)
              : 0;
          const isComplete = completedCount === totalItems;

          return (
            <Link
              key={checklist.slug}
              href={`/checklists/${checklist.slug}`}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-sage-200 hover:bg-sage-50/50"
            >
              {isComplete ? (
                <WatercolorIcon
                  name="check"
                  size={20}
                  className="shrink-0 text-sage-500"
                />
              ) : (
                <WatercolorIcon
                  name="check"
                  size={20}
                  className="shrink-0 text-gray-300"
                />
              )}
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
// Saved articles section
// ---------------------------------------------------------------------------

function SavedArticlesSection({
  savedSlugs,
  articleTitles,
}: {
  readonly savedSlugs: readonly string[];
  readonly articleTitles: Record<string, string>;
}) {
  if (savedSlugs.length === 0) {
    return null;
  }

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
              <WatercolorIcon name="star" size={16} className="text-sage-600" />
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
// Summary dashboard
// ---------------------------------------------------------------------------

function SummaryDashboard({ child }: { readonly child: ChildProfile }) {
  const timeline = useMemo(
    () => generateTimeline(child.birthDate, child.completedItems),
    [child.birthDate, child.completedItems],
  );

  const pendingItems = timeline.filter(
    (item) => !item.completed && !item.isExpired,
  );

  const nextVaccination = pendingItems.find(
    (item) => item.category === "vaccination",
  );

  const thisMonthAdmin = pendingItems.filter(
    (item) =>
      item.category === "admin" &&
      (item.urgency === "overdue" ||
        item.urgency === "urgent" ||
        item.urgency === "soon"),
  );

  const thisMonthMedical = pendingItems.find(
    (item) =>
      item.category === "medical" &&
      (item.urgency === "overdue" ||
        item.urgency === "urgent" ||
        item.urgency === "soon"),
  );

  const incompleteCount = pendingItems.filter(
    (item) =>
      item.urgency === "overdue" ||
      item.urgency === "urgent" ||
      item.urgency === "soon",
  ).length;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/my/timeline"
        className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 transition-all hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100">
            <WatercolorIcon
              name="syringe"
              size={16}
              className="text-purple-600"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">次の予防接種</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-card-foreground">
              {nextVaccination ? nextVaccination.title : "予定なし"}
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
            <p className="text-xs text-muted">今月の手続き</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {thisMonthAdmin.length > 0
                ? `${thisMonthAdmin.length}件`
                : "なし"}
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
            <WatercolorIcon
              name="stethoscope"
              size={16}
              className="text-sage-600"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">今月の健診</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {thisMonthMedical ? thisMonthMedical.title : "なし"}
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="/my/timeline"
        className={`rounded-xl border p-4 transition-all hover:shadow-md ${
          incompleteCount > 0
            ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
            : "border-border bg-gradient-to-br from-ivory-50 to-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              incompleteCount > 0 ? "bg-orange-100" : "bg-ivory-100"
            }`}
          >
            <WatercolorIcon
              name="alert"
              size={16}
              className={incompleteCount > 0 ? "text-orange-600" : "text-muted"}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">未完了アクション</p>
            <p className="mt-0.5 text-sm font-semibold text-card-foreground">
              {incompleteCount > 0 ? `${incompleteCount}件` : "なし"}
            </p>
          </div>
        </div>
      </Link>
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
        href="/my/vaccinations"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-purple-200 bg-purple-50">
          <WatercolorIcon
            name="syringe"
            size={20}
            className="text-purple-600"
          />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            予防接種記録
          </h3>
          <p className="text-xs text-muted">接種記録を管理する</p>
        </div>
      </Link>
      <Link
        href="/my/timeline"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sage-200 bg-sage-50">
          <WatercolorIcon name="calendar" size={20} className="text-sage-600" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            タイムライン
          </h3>
          <p className="text-xs text-muted">
            今やるべき手続き・健診・予防接種を時系列で確認
          </p>
        </div>
      </Link>
      <Link
        href="/my/milestones"
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50">
          <WatercolorIcon name="star" size={20} className="text-rose-500" />
        </div>
        <div>
          <h3 className="font-heading text-sm font-semibold text-card-foreground">
            成長マイルストーン
          </h3>
          <p className="text-xs text-muted">「はじめて」の記録をつける</p>
        </div>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MyPageClient({ articleTitles }: MyPageClientProps) {
  const store = useStore();
  const { user } = useAuth();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMigration, setShowMigration] = useState(false);

  const loadProfile = useCallback(async () => {
    const loaded = await store.getFamilyProfile();
    setProfile(loaded);
    setIsLoading(false);
  }, [store]);

  useEffect(() => {
    loadProfile();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "sukusuku-family") {
        loadProfile();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadProfile]);

  // Show migration dialog when user just logged in and has local data
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem("sukusuku-family");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.children && data.children.length > 0) {
          setShowMigration(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [user]);

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
      {/* Migration dialog */}
      {showMigration && (
        <MigrationDialog
          onComplete={() => {
            setShowMigration(false);
            loadProfile();
          }}
        />
      )}

      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <WatercolorIcon
              name="user"
              size={28}
              className="mr-2 inline-block   text-sage-600"
            />
            マイページ
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            お子さんの登録と手続きの進捗管理ができます。
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Account status */}
          <AccountBanner />

          {/* Timeline teaser for unregistered users */}
          {(!profile || profile.children.length === 0) && (
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
                  お子さんの生年月日を登録してください
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                  登録すると、今週やること・今月やることが自動で表示されます。
                  予防接種・健診・届出の期限が近づくとお知らせします。
                </p>
                <div className="mt-5 grid w-full max-w-sm gap-2 text-left sm:grid-cols-3">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-card-foreground shadow-sm">
                    <WatercolorIcon
                      name="syringe"
                      size={16}
                      className="shrink-0 text-purple-600"
                    />
                    <span>予防接種</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-card-foreground shadow-sm">
                    <WatercolorIcon
                      name="stethoscope"
                      size={16}
                      className="shrink-0 text-sage-600"
                    />
                    <span>健診</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-card-foreground shadow-sm">
                    <WatercolorIcon
                      name="building"
                      size={16}
                      className="shrink-0 text-blue-600"
                    />
                    <span>届出・申請</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(
                      "family-profile-section",
                    );
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-sage-700 hover:shadow-lg"
                >
                  <WatercolorIcon name="baby" size={18} />
                  登録する
                </button>
              </div>
            </div>
          )}

          {/* Family profile */}
          <div id="family-profile-section">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              お子さんの登録
            </h2>
            <div className="mt-4">
              <FamilyProfileSetup onProfileChange={loadProfile} />
            </div>
          </div>

          {/* Timeline shortcut for registered users */}
          {profile && profile.children.length > 0 && (
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
                  手続き・健診・予防接種のタイムラインを見る
                </p>
              </div>
              <WatercolorIcon
                name="arrow_right"
                size={20}
                className="shrink-0 text-sage-400"
              />
            </Link>
          )}

          {/* Summary dashboard */}
          {profile && profile.children.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                サマリー
              </h2>
              <div className="mt-4 space-y-4">
                {profile.children.map((child) => (
                  <div key={child.id}>
                    {profile.children.length > 1 && (
                      <p className="mb-2 text-sm font-medium text-muted">
                        {child.nickname}
                      </p>
                    )}
                    <SummaryDashboard child={child} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checklist progress */}
          {profile && profile.children.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                手続きの進捗
              </h2>
              <div className="mt-4 space-y-4">
                {profile.children.map((child) => (
                  <ChecklistProgressCard key={child.id} child={child} />
                ))}
              </div>
            </div>
          )}

          {/* Saved articles */}
          {profile != null && profile.savedArticles.length > 0 && (
            <SavedArticlesSection
              savedSlugs={profile.savedArticles}
              articleTitles={articleTitles}
            />
          )}

          {/* Quick actions */}
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
