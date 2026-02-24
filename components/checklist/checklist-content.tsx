"use client";

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import type { ChecklistItem } from "@/lib/checklists";
import { useStore } from "@/lib/store";
import type { FamilyProfile, ChildProfile } from "@/lib/store";
import { formatAge } from "@/lib/utils/age";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChecklistContentProps {
  readonly slug: string;
  readonly items: readonly ChecklistItem[];
}

// ---------------------------------------------------------------------------
// Stamp animation style (injected once via inline <style>)
// ---------------------------------------------------------------------------

const STAMP_KEYFRAMES = `
@keyframes stamp {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
`;

// ---------------------------------------------------------------------------
// Local-only checked items hook (fallback when no family profile)
// ---------------------------------------------------------------------------

function useLocalCheckedItems(slug: string) {
  const [checkedItems, setCheckedItems] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`checklist-${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setCheckedItems(new Set(parsed));
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, [slug]);

  const toggle = useCallback(
    (itemId: string) => {
      setCheckedItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        try {
          localStorage.setItem(`checklist-${slug}`, JSON.stringify([...next]));
        } catch {
          // Ignore localStorage errors
        }
        return next;
      });
    },
    [slug],
  );

  const setAll = useCallback(
    (itemIds: readonly string[]) => {
      const next = new Set(itemIds);
      setCheckedItems(next);
      try {
        localStorage.setItem(`checklist-${slug}`, JSON.stringify([...next]));
      } catch {
        // Ignore localStorage errors
      }
    },
    [slug],
  );

  const clearAll = useCallback(() => {
    setCheckedItems(new Set());
    try {
      localStorage.setItem(`checklist-${slug}`, JSON.stringify([]));
    } catch {
      // Ignore localStorage errors
    }
  }, [slug]);

  return { checkedItems, isLoaded, toggle, setAll, clearAll };
}

// ---------------------------------------------------------------------------
// Badge computation for checklist items
// ---------------------------------------------------------------------------

interface ItemBadge {
  readonly label: string;
  readonly className: string;
}

// High-value program slugs (programs with significant monetary amounts)
const HIGH_VALUE_PROGRAM_SLUGS = new Set([
  "child-allowance",
  "childbirth-lump-sum",
  "birth-childcare-grant",
  "child-medical-subsidy",
  "unlicensed-nursery-subsidy",
  "multi-child-nursery-reduction",
  "private-kindergarten-subsidy",
]);

// Minato-ku exclusive program slugs
const MINATO_EXCLUSIVE_SLUGS = new Set([
  "child-medical-subsidy",
  "mumps-vaccine-subsidy",
  "influenza-vaccine-subsidy",
  "postnatal-care-stay",
  "postnatal-care-day",
  "postnatal-care-visit",
  "unlicensed-nursery-subsidy",
  "multi-child-nursery-reduction",
  "komusubi-project",
  "child-development-support",
]);

// Patterns that indicate strict time limits
const STRICT_DEADLINE_PATTERNS = [/\d+日以内/, /\d+ヶ月以内/, /\d+週/, /すぐ/];

function computeBadges(item: ChecklistItem): readonly ItemBadge[] {
  const badges: ItemBadge[] = [];

  // "期限あり" badge for items with strict deadlines
  if (item.deadline) {
    const isStrict = STRICT_DEADLINE_PATTERNS.some((p) =>
      p.test(item.deadline ?? ""),
    );
    if (isStrict) {
      badges.push({
        label: "期限あり",
        className: "bg-red-50 text-red-600 border border-red-200",
      });
    }
  }

  // "金額大" badge for high-value programs
  if (
    item.relatedProgram &&
    HIGH_VALUE_PROGRAM_SLUGS.has(item.relatedProgram)
  ) {
    badges.push({
      label: "金額大",
      className: "bg-amber-50 text-amber-700 border border-amber-200",
    });
  }

  // "港区限定" badge for Minato-ku exclusive programs
  if (item.relatedProgram && MINATO_EXCLUSIVE_SLUGS.has(item.relatedProgram)) {
    badges.push({
      label: "港区限定",
      className: "bg-blue-50 text-blue-600 border border-blue-200",
    });
  }

  return badges;
}

// ---------------------------------------------------------------------------
// Stamp circle component
// ---------------------------------------------------------------------------

function StampCircle({
  isChecked,
  justStamped,
  onToggle,
}: {
  readonly isChecked: boolean;
  readonly justStamped: boolean;
  readonly onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-0.5 shrink-0"
      aria-label={isChecked ? "チェックを外す" : "スタンプを押す"}
    >
      {isChecked ? (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sage-500 bg-sage-500 text-white"
          style={
            justStamped
              ? { animation: "stamp 0.4s ease-out forwards" }
              : undefined
          }
        >
          <WatercolorIcon name="check" size={20} />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
          <WatercolorIcon name="check" size={20} className="text-gray-300" />
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Stamp-style item card
// ---------------------------------------------------------------------------

function StampItemCard({
  item,
  isChecked,
  justStamped,
  onToggle,
}: {
  readonly item: ChecklistItem;
  readonly isChecked: boolean;
  readonly justStamped: boolean;
  readonly onToggle: () => void;
}) {
  const badges = computeBadges(item);

  return (
    <div
      className={`rounded-xl border bg-card p-4 transition-all ${
        isChecked ? "border-sage-200 bg-sage-50/50" : "border-border"
      }`}
    >
      <div className="flex gap-3">
        <StampCircle
          isChecked={isChecked}
          justStamped={justStamped}
          onToggle={onToggle}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-heading text-base font-semibold ${
                isChecked
                  ? "text-sage-700 line-through"
                  : "text-card-foreground"
              }`}
            >
              {item.title}
            </h3>
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {item.description}
          </p>

          <div className="mt-3 space-y-2">
            {item.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <WatercolorIcon
                  name="calendar"
                  size={12}
                  className=".5 .5 shrink-0 text-blush-500"
                />
                <span className="font-medium text-blush-600">
                  {item.deadline}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <WatercolorIcon
                name="mappin"
                size={12}
                className=".5 .5 shrink-0 text-muted"
              />
              <span className="text-muted">{item.where}</span>
            </div>

            {item.documents.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <WatercolorIcon
                  name="star"
                  size={12}
                  className="mt-0.5 .5 .5 shrink-0 text-muted"
                />
                <div className="flex flex-wrap gap-1">
                  {item.documents.map((doc) => (
                    <span
                      key={doc}
                      className="rounded bg-ivory-100 px-1.5 py-0.5 text-xs text-muted"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.relatedProgram && (
              <div className="flex items-center gap-2 text-sm">
                <WatercolorIcon
                  name="arrow_right"
                  size={12}
                  className=".5 .5 shrink-0 text-sage-600"
                />
                <Link
                  href={`/programs/${item.relatedProgram}`}
                  className="font-medium text-sage-600 hover:text-sage-700 hover:underline"
                >
                  関連制度を見る
                </Link>
              </div>
            )}
          </div>

          {item.tips && (
            <div className="mt-3 flex gap-2 rounded-lg bg-yellow-50 p-3">
              <WatercolorIcon
                name="lightbulb"
                size={16}
                className="shrink-0 text-yellow-600"
              />
              <p className="text-sm leading-relaxed text-yellow-800">
                {item.tips}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Celebration banner
// ---------------------------------------------------------------------------

function CelebrationBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-sage-300 bg-gradient-to-r from-sage-50 via-white to-sage-50 p-6 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: "10%", left: "5%", bg: "bg-sage-400", delay: "0s" },
          { top: "20%", left: "85%", bg: "bg-blush-400", delay: "0.2s" },
          { top: "60%", left: "15%", bg: "bg-yellow-400", delay: "0.4s" },
          { top: "30%", left: "70%", bg: "bg-sage-300", delay: "0.1s" },
          { top: "70%", left: "80%", bg: "bg-blush-300", delay: "0.3s" },
          { top: "15%", left: "45%", bg: "bg-yellow-300", delay: "0.5s" },
          { top: "80%", left: "35%", bg: "bg-sage-500", delay: "0.15s" },
          { top: "50%", left: "92%", bg: "bg-blush-500", delay: "0.35s" },
        ].map((dot, i) => (
          <div
            key={i}
            className={`absolute h-2 w-2 rounded-full ${dot.bg}`}
            style={{
              top: dot.top,
              left: dot.left,
              animation: `stamp 0.6s ease-out ${dot.delay} forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <p className="relative text-lg font-bold text-sage-700">
        おめでとうございます！すべての手続きが完了しました
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Child selector tabs
// ---------------------------------------------------------------------------

function ChildSelector({
  children,
  selectedChildId,
  onSelect,
}: {
  readonly children: readonly ChildProfile[];
  readonly selectedChildId: string;
  readonly onSelect: (childId: string) => void;
}) {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {children.map((child) => {
        const isActive = child.id === selectedChildId;
        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onSelect(child.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-sage-500 text-white"
                : "bg-ivory-100 text-muted hover:bg-ivory-200"
            }`}
          >
            <WatercolorIcon name="user" size={12} className=".5 .5" />
            <span>{child.nickname}</span>
            <span className="text-xs opacity-80">
              ({formatAge(child.birthDate)})
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({
  completed,
  total,
}: {
  readonly completed: number;
  readonly total: number;
}) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-card-foreground">
          進捗: {completed}/{total}項目完了
        </span>
        <span className="font-medium text-sage-600">{percent}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-ivory-100">
        <div
          className="h-full rounded-full bg-sage-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ChecklistContent({ slug, items }: ChecklistContentProps) {
  const store = useStore();

  // Family profile state
  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(
    null,
  );
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Track recently stamped items for animation
  const [justStampedId, setJustStampedId] = useState<string | null>(null);

  // Local-only fallback
  const localStore = useLocalCheckedItems(slug);

  // Load family profile on mount
  useEffect(() => {
    let cancelled = false;
    store.getFamilyProfile().then((profile) => {
      if (cancelled) return;
      setFamilyProfile(profile);
      if (profile && profile.children.length > 0) {
        setSelectedChildId(profile.children[0].id);
      }
      setProfileLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  // Clear animation after delay
  useEffect(() => {
    if (justStampedId === null) {
      return;
    }

    const timer = setTimeout(() => {
      setJustStampedId(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [justStampedId]);

  // Determine which child is selected
  const selectedChild =
    familyProfile?.children.find((c) => c.id === selectedChildId) ?? null;

  // Build the set of completed item IDs
  const checkedItems: ReadonlySet<string> = selectedChild
    ? new Set(selectedChild.completedItems)
    : localStore.checkedItems;

  const isLoaded =
    profileLoaded && (selectedChild ? true : localStore.isLoaded);

  // Toggle handler
  const handleToggle = useCallback(
    async (itemId: string) => {
      setJustStampedId(itemId);

      if (familyProfile && selectedChildId) {
        const updated = await store.toggleCompletedItem(
          selectedChildId,
          itemId,
        );
        setFamilyProfile(updated);
      } else {
        localStore.toggle(itemId);
      }
    },
    [familyProfile, selectedChildId, localStore, store],
  );

  // Toggle all handler
  const handleToggleAll = useCallback(async () => {
    const allIds = items.map((item) => item.id);
    const allCompleted = allIds.every((id) => checkedItems.has(id));

    if (familyProfile && selectedChildId) {
      let current = familyProfile;
      for (const id of allIds) {
        const isCompleted = checkedItems.has(id);
        if (allCompleted ? isCompleted : !isCompleted) {
          current = await store.toggleCompletedItem(selectedChildId, id);
        }
      }
      setFamilyProfile(current);
    } else {
      if (allCompleted) {
        localStore.clearAll();
      } else {
        localStore.setAll(allIds);
      }
    }
  }, [items, checkedItems, familyProfile, selectedChildId, localStore, store]);

  // Computed values
  const checkedCount = items.filter((item) => checkedItems.has(item.id)).length;
  const totalCount = items.length;
  const allCompleted = checkedCount === totalCount && totalCount > 0;

  // Loading skeleton
  if (!isLoaded) {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="h-40 animate-pulse rounded-xl border border-border bg-ivory-50"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Inject stamp animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: STAMP_KEYFRAMES }} />

      {/* Family profile banner (no profile) */}
      {!familyProfile && (
        <div className="mb-4 rounded-xl border border-sage-200 bg-sage-50/60 p-4">
          <div className="flex items-center gap-2">
            <WatercolorIcon name="user" size={20} className="text-sage-600" />
            <p className="text-sm text-sage-800">
              お子さんを登録すると、進捗を保存できます
            </p>
          </div>
          <Link
            href="/my"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-sage-600 hover:text-sage-700 hover:underline"
          >
            登録はこちら
            <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
          </Link>
        </div>
      )}

      {/* Child selector */}
      {familyProfile &&
        familyProfile.children.length > 0 &&
        selectedChildId && (
          <ChildSelector
            children={familyProfile.children}
            selectedChildId={selectedChildId}
            onSelect={setSelectedChildId}
          />
        )}

      {/* Progress bar + toggle all */}
      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <ProgressBar completed={checkedCount} total={totalCount} />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleToggleAll}
            className="text-xs font-medium text-sage-600 hover:text-sage-700"
          >
            {allCompleted ? "すべてリセット" : "すべて完了"}
          </button>
        </div>
      </div>

      {/* Celebration banner */}
      {allCompleted && <CelebrationBanner />}

      {/* Checklist items */}
      <div className={`space-y-4 ${allCompleted ? "mt-4" : ""}`}>
        {items.map((item) => (
          <StampItemCard
            key={item.id}
            item={item}
            isChecked={checkedItems.has(item.id)}
            justStamped={justStampedId === item.id && checkedItems.has(item.id)}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
