"use client"

;

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useStore } from "@/lib/store";

interface BookmarkButtonProps {
  readonly articleSlug: string;
}

export function BookmarkButton({ articleSlug }: BookmarkButtonProps) {
  const store = useStore();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    store.getFamilyProfile().then((profile) => {
      if (!cancelled && profile) {
        setIsSaved(profile.savedArticles.includes(articleSlug));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [articleSlug, store]);

  const handleToggle = useCallback(async () => {
    let profile = await store.getFamilyProfile();
    if (!profile) {
      profile = await store.createFamilyProfile();
    }
    const updated = await store.toggleSavedArticle(articleSlug);
    setIsSaved(updated.savedArticles.includes(articleSlug));
  }, [articleSlug, store]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        isSaved
          ? "bg-sage-100 text-sage-700 hover:bg-sage-200"
          : "bg-ivory-100 text-muted hover:bg-ivory-200 hover:text-foreground"
      }`}
      aria-label={isSaved ? "ブックマークを解除" : "ブックマークに追加"}
    >
      <WatercolorIcon name="bookmark" size={12} />
      {isSaved ? "保存済み" : "保存する"}
    </button>
  );
}
