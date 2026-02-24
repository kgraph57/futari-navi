"use client";

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useStore } from "@/lib/store";
import type { FamilyProfile } from "@/lib/store";
import { formatAge } from "@/lib/utils/age";
import { trackChildRegistered } from "@/lib/analytics/events";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

function EmptyState({ onAdd }: { readonly onAdd: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage-50">
        <WatercolorIcon name="baby" size={32} className="text-sage-600" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-card-foreground">
        お子さんの情報を登録しましょう
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        お子さんのプロフィールを登録すると、年齢に合わせた記事やチェックリストが表示されます。
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
      >
        <WatercolorIcon name="plus" size={16} />
        お子さんを追加
      </button>
    </div>
  );
}

function AddChildForm({
  onSubmit,
  onCancel,
}: {
  readonly onSubmit: (nickname: string, birthDate: string) => void;
  readonly onCancel: () => void;
}) {
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = nickname.trim();
    if (!trimmed || !birthDate) {
      return;
    }

    onSubmit(trimmed, birthDate);
  };

  const isValid = nickname.trim().length > 0 && birthDate.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-sage-200 bg-sage-50/50 p-5"
    >
      <h4 className="font-heading text-base font-semibold text-card-foreground">
        お子さんの情報
      </h4>

      <div className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="child-nickname"
            className="block text-sm font-medium text-card-foreground"
          >
            ニックネーム
          </label>
          <input
            id="child-nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="例: たろう"
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-card-foreground placeholder:text-ivory-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100"
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="child-birthdate"
            className="block text-sm font-medium text-card-foreground"
          >
            生年月日
          </label>
          <input
            id="child-birthdate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-card-foreground focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex items-center gap-2 rounded-lg bg-sage-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <WatercolorIcon name="plus" size={16} />
          追加
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-ivory-50"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}

function ChildCard({
  nickname,
  birthDate,
  onRemove,
}: {
  readonly nickname: string;
  readonly birthDate: string;
  readonly onRemove: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    onRemove();
    setShowConfirm(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-50">
            <WatercolorIcon name="baby" size={20} className="text-sage-600" />
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-card-foreground">
              {nickname}
            </h4>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <WatercolorIcon
                name="calendar"
                size={12}
                className=".5 .5 shrink-0"
              />
              <span>{formatDate(birthDate)}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-sage-600">
              {formatAge(birthDate)}
            </p>
          </div>
        </div>

        {!showConfirm && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="shrink-0 rounded-lg p-1.5 text-ivory-200 transition-colors hover:bg-ivory-50 hover:text-blush-500"
            aria-label={`${nickname}を削除`}
          >
            <WatercolorIcon name="plus" size={16} />
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-blush-50 p-3">
          <p className="flex-1 text-sm text-blush-600">
            {nickname}のデータを削除しますか？
          </p>
          <button
            type="button"
            onClick={handleRemove}
            className="rounded-lg bg-blush-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blush-600"
          >
            削除
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-white"
          >
            キャンセル
          </button>
        </div>
      )}
    </div>
  );
}

interface FamilyProfileSetupProps {
  readonly onProfileChange?: () => void;
}

export function FamilyProfileSetup({
  onProfileChange,
}: FamilyProfileSetupProps) {
  const store = useStore();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    store.getFamilyProfile().then((loaded) => {
      if (!cancelled) {
        setProfile(loaded);
        setIsLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const handleAddChild = useCallback(
    async (nickname: string, birthDate: string) => {
      try {
        setError(null);
        if (!profile) {
          await store.createFamilyProfile();
        }
        const updated = await store.addChild(nickname, birthDate);
        setProfile(updated);
        setShowForm(false);
        trackChildRegistered(updated.children.length);
        onProfileChange?.();
      } catch {
        setError("登録に失敗しました。もう一度お試しください。");
      }
    },
    [profile, store, onProfileChange],
  );

  const handleRemoveChild = useCallback(
    async (childId: string) => {
      try {
        setError(null);
        const updated = await store.removeChild(childId);
        setProfile(updated);
        onProfileChange?.();
      } catch {
        setError("削除に失敗しました。もう一度お試しください。");
      }
    },
    [store, onProfileChange],
  );

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded-xl border border-border bg-ivory-50" />
      </div>
    );
  }

  const children = profile?.children ?? [];
  const hasChildren = children.length > 0;

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-foreground">
        家族プロフィール
      </h2>
      <p className="mt-1 text-sm text-muted">
        お子さんの年齢に合わせた情報をお届けします
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-blush-50 px-4 py-3 text-sm text-blush-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {!hasChildren && !showForm && (
          <EmptyState onAdd={() => setShowForm(true)} />
        )}

        {children.map((child) => (
          <ChildCard
            key={child.id}
            nickname={child.nickname}
            birthDate={child.birthDate}
            onRemove={() => handleRemoveChild(child.id)}
          />
        ))}

        {showForm && (
          <AddChildForm
            onSubmit={handleAddChild}
            onCancel={() => setShowForm(false)}
          />
        )}

        {hasChildren && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sage-300 bg-sage-50/30 px-4 py-3 text-sm font-medium text-sage-600 transition-colors hover:border-sage-400 hover:bg-sage-50"
          >
            <WatercolorIcon name="plus" size={16} />
            お子さんを追加
          </button>
        )}
      </div>
    </div>
  );
}
