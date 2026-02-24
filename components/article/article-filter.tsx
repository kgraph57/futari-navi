"use client"

;

import { useState, useMemo } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type {
  ArticleFrontmatter,
  ArticleCategory,
  AgeGroup,
} from "@/lib/types";
import { CATEGORY_LABELS, AGE_GROUP_LABELS } from "@/lib/types";
import { ArticleCard } from "@/components/article/article-card";

interface ArticleFilterProps {
  readonly articles: readonly ArticleFrontmatter[];
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as ArticleCategory[];
const ALL_AGE_GROUPS = Object.keys(AGE_GROUP_LABELS) as AgeGroup[];

export function ArticleFilter({ articles }: ArticleFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ArticleCategory | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(
    null,
  );

  const filteredArticles = useMemo(() => {
    const lower = searchQuery.toLowerCase();

    return articles.filter((fm) => {
      if (selectedCategory && fm.category !== selectedCategory) {
        return false;
      }

      const ageGroups = fm.ageGroups ?? [];
      if (
        selectedAgeGroup &&
        !ageGroups.includes(selectedAgeGroup) &&
        !ageGroups.includes("all")
      ) {
        return false;
      }

      const keyPoints = fm.keyPoints ?? [];
      if (
        lower &&
        !fm.title.toLowerCase().includes(lower) &&
        !(fm.description ?? "").toLowerCase().includes(lower) &&
        !keyPoints.some((kp) => kp.toLowerCase().includes(lower))
      ) {
        return false;
      }

      return true;
    });
  }, [articles, searchQuery, selectedCategory, selectedAgeGroup]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== null ||
    selectedAgeGroup !== null;

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedAgeGroup(null);
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative">
        <WatercolorIcon name="search" size={16} className="absolute left-3 top-1/2 .5 .5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="記事を検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-100"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            aria-label="検索をクリア"
          >
            <WatercolorIcon name="check" size={16} />
          </button>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-muted">カテゴリ</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === null
                ? "bg-sage-600 text-white"
                : "border border-border bg-card text-muted hover:border-sage-200 hover:text-sage-600"
            }`}
          >
            すべて
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setSelectedCategory((prev) => (prev === cat ? null : cat))
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-sage-600 text-white"
                  : "border border-border bg-card text-muted hover:border-sage-200 hover:text-sage-600"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Age group filter */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted">対象年齢</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedAgeGroup(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedAgeGroup === null
                ? "bg-sage-600 text-white"
                : "border border-border bg-card text-muted hover:border-sage-200 hover:text-sage-600"
            }`}
          >
            すべて
          </button>
          {ALL_AGE_GROUPS.map((ag) => (
            <button
              key={ag}
              type="button"
              onClick={() =>
                setSelectedAgeGroup((prev) => (prev === ag ? null : ag))
              }
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedAgeGroup === ag
                  ? "bg-sage-600 text-white"
                  : "border border-border bg-card text-muted hover:border-sage-200 hover:text-sage-600"
              }`}
            >
              {AGE_GROUP_LABELS[ag]}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters / result count */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-muted">
          {filteredArticles.length}件の記事
          {hasActiveFilters && (
            <>
              <span className="mx-1">|</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sage-600 hover:underline"
              >
                フィルターをクリア
              </button>
            </>
          )}
        </p>
      </div>

      {/* Articles grid */}
      {filteredArticles.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((fm) => (
            <ArticleCard key={fm.slug} frontmatter={fm} />
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center">
          <p className="text-base font-medium text-foreground">
            条件に合う記事が見つかりませんでした
          </p>
          <p className="mt-2 text-sm text-muted">
            検索キーワードやフィルターを変更してみてください
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-4 rounded-full bg-sage-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-700"
          >
            フィルターをクリア
          </button>
        </div>
      )}
    </div>
  );
}
