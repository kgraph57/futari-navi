"use client"

;

import { useState, useMemo, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import dynamic from "next/dynamic";

const NurseryMap = dynamic(
  () => import("./nursery-map").then((mod) => ({ default: mod.NurseryMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-ivory-100 sm:h-[500px]">
        <p className="text-sm text-muted">地図を読み込み中...</p>
      </div>
    ),
  },
);
import type { Nursery, NurseryType, NurseryArea } from "@/lib/types";
import { NURSERY_TYPE_LABELS, NURSERY_AREA_LABELS } from "@/lib/nurseries";
import {
  NURSERY_TYPE_ICON_MAP,
  NURSERY_TYPE_COLOR_MAP,
} from "@/lib/nursery-constants";
import { NurseryCompare } from "./nursery-compare";

interface NurseryFilterProps {
  readonly nurseries: readonly Nursery[];
}

type AgeFilter = "all" | "0" | "1" | "3";

const MAX_COMPARE = 3;

function NurseryCard({
  nursery,
  isSelected,
  canSelect,
  onToggleCompare,
}: {
  readonly nursery: Nursery;
  readonly isSelected: boolean;
  readonly canSelect: boolean;
  readonly onToggleCompare: (slug: string) => void;
}) {
  const colorClass =
    NURSERY_TYPE_COLOR_MAP[nursery.type] ??
    "bg-gray-50 text-gray-600 border-gray-200";
  const iconName = NURSERY_TYPE_ICON_MAP[nursery.type] ?? "building";

  return (
    <div
      className={`group flex gap-4 rounded-xl border bg-card p-5 transition-all ${
        isSelected
          ? "border-blue-300 ring-1 ring-blue-200"
          : "border-border hover:border-sage-200 hover:shadow-md"
      }`}
    >
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colorClass}`}
        >
          <WatercolorIcon name={iconName} size={20} />
        </div>
        <button
          type="button"
          onClick={() => onToggleCompare(nursery.slug)}
          disabled={!isSelected && !canSelect}
          className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
            isSelected
              ? "border-blue-400 bg-blue-500 text-white"
              : canSelect
                ? "border-gray-300 bg-white text-gray-400 hover:border-blue-300 hover:text-blue-500"
                : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
          }`}
          aria-label={isSelected ? "比較から外す" : "比較に追加"}
          title={
            isSelected
              ? "比較から外す"
              : canSelect
                ? "比較に追加"
                : `最大${MAX_COMPARE}園まで`
          }
        >
          {isSelected ? (
            <WatercolorIcon name="check" size={12} className=".5 .5" />
          ) : (
            <WatercolorIcon name="star" size={12} className=".5 .5" />
          )}
        </button>
      </div>

      <Link href={`/nurseries/${nursery.slug}`} className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-card-foreground">
            {nursery.name}
          </h3>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {NURSERY_TYPE_LABELS[nursery.type]}
          </span>
          {nursery.hasGarden && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
              <WatercolorIcon name="star" size={12} />
              園庭
            </span>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="mappin" size={12} className=".5 .5 shrink-0" />
            {nursery.address}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="star" size={12} className=".5 .5 shrink-0" />
            {nursery.nearestStation}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="clock" size={12} className=".5 .5 shrink-0" />
            {nursery.hours.standard}
            {nursery.hours.extended != null && (
              <span className="text-xs text-sage-600">
                （延長 〜{nursery.hours.extended.split("-")[1]}）
              </span>
            )}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="user" size={12} className=".5 .5 shrink-0" />
            定員{nursery.capacity}名 ・ {nursery.ageMin}歳〜{nursery.ageMax}歳
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {nursery.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-ivory-100 px-2 py-0.5 text-xs text-muted"
            >
              {feature}
            </span>
          ))}
        </div>

        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          詳細を見る
          <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </Link>
    </div>
  );
}

const ALL_TYPES: readonly NurseryType[] = [
  "licensed",
  "certified",
  "small-scale",
  "kodomoen",
  "minato-room",
];

const ALL_AREAS: readonly NurseryArea[] = [
  "shiba-mita",
  "azabu",
  "akasaka-aoyama",
  "takanawa-shirokane",
  "daiba-shibaura",
];

const AGE_FILTER_LABELS: Record<AgeFilter, string> = {
  all: "すべて",
  "0": "0歳から",
  "1": "1歳から",
  "3": "3歳から",
};

type ViewMode = "list" | "map";

export function NurseryFilter({ nurseries }: NurseryFilterProps) {
  const [selectedType, setSelectedType] = useState<NurseryType | "all">("all");
  const [selectedArea, setSelectedArea] = useState<NurseryArea | "all">("all");
  const [selectedAge, setSelectedAge] = useState<AgeFilter>("all");
  const [gardenOnly, setGardenOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [compareSlugs, setCompareSlugs] = useState<readonly string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const resetFilters = () => {
    setSelectedType("all");
    setSelectedArea("all");
    setSelectedAge("all");
    setGardenOnly(false);
  };

  const handleToggleCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < MAX_COMPARE
          ? [...prev, slug]
          : prev,
    );
  }, []);

  const handleRemoveFromCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const compareNurseries = useMemo(
    () => nurseries.filter((n) => compareSlugs.includes(n.slug)),
    [nurseries, compareSlugs],
  );

  const filtered = useMemo(() => {
    return nurseries.filter((n) => {
      if (selectedType !== "all" && n.type !== selectedType) return false;
      if (selectedArea !== "all" && n.area !== selectedArea) return false;
      if (selectedAge !== "all" && n.ageMin > Number(selectedAge)) return false;
      if (gardenOnly && !n.hasGarden) return false;
      return true;
    });
  }, [nurseries, selectedType, selectedArea, selectedAge, gardenOnly]);

  const activeFilterCount = [
    selectedType !== "all",
    selectedArea !== "all",
    selectedAge !== "all",
    gardenOnly,
  ].filter(Boolean).length;

  return (
    <div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <WatercolorIcon name="star" size={16} className="text-sage-600" />
          絞り込み
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
              {activeFilterCount}件
            </span>
          )}
        </div>

        <div className="mt-3 space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">種別</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedType === "all"
                    ? "bg-sage-600 text-white"
                    : "bg-ivory-100 text-muted hover:bg-ivory-200"
                }`}
              >
                すべて
              </button>
              {ALL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSelectedType((prev) => (prev === type ? "all" : type))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedType === type
                      ? "bg-sage-600 text-white"
                      : "bg-ivory-100 text-muted hover:bg-ivory-200"
                  }`}
                >
                  {NURSERY_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium text-muted">エリア</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedArea("all")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedArea === "all"
                    ? "bg-sage-600 text-white"
                    : "bg-ivory-100 text-muted hover:bg-ivory-200"
                }`}
              >
                すべて
              </button>
              {ALL_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() =>
                    setSelectedArea((prev) => (prev === area ? "all" : area))
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedArea === area
                      ? "bg-sage-600 text-white"
                      : "bg-ivory-100 text-muted hover:bg-ivory-200"
                  }`}
                >
                  {NURSERY_AREA_LABELS[area]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted">
                受け入れ年齢
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  Object.entries(AGE_FILTER_LABELS) as [AgeFilter, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedAge(key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedAge === key
                        ? "bg-sage-600 text-white"
                        : "bg-ivory-100 text-muted hover:bg-ivory-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-muted">その他</p>
              <button
                type="button"
                onClick={() => setGardenOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  gardenOnly
                    ? "bg-green-600 text-white"
                    : "bg-ivory-100 text-muted hover:bg-ivory-200"
                }`}
              >
                <WatercolorIcon name="star" size={12} />
                園庭あり
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted">{filtered.length}件の保育施設</p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-sage-600 hover:text-sage-700"
            >
              フィルターをリセット
            </button>
          )}
        </div>

        <div className="flex rounded-lg border border-border bg-card">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 rounded-l-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "list"
                ? "bg-sage-600 text-white"
                : "text-muted hover:bg-ivory-100"
            }`}
          >
            <WatercolorIcon name="star" size={12} className=".5 .5" />
            リスト
          </button>
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 rounded-r-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "map"
                ? "bg-sage-600 text-white"
                : "text-muted hover:bg-ivory-100"
            }`}
          >
            <WatercolorIcon name="map" size={14} />
            マップ
          </button>
        </div>
      </div>

      <div className={`mt-4 ${compareSlugs.length > 0 ? "pb-20" : ""}`}>
        {viewMode === "list" ? (
          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((nursery) => (
                <NurseryCard
                  key={nursery.slug}
                  nursery={nursery}
                  isSelected={compareSlugs.includes(nursery.slug)}
                  canSelect={compareSlugs.length < MAX_COMPARE}
                  onToggleCompare={handleToggleCompare}
                />
              ))
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-sm text-muted">
                  条件に一致する保育施設が見つかりませんでした。
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-2 text-sm font-medium text-sage-600 hover:text-sage-700"
                >
                  フィルターをリセット
                </button>
              </div>
            )}
          </div>
        ) : filtered.length > 0 ? (
          <NurseryMap nurseries={filtered} />
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">
              条件に一致する保育施設が見つかりませんでした。
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 text-sm font-medium text-sage-600 hover:text-sage-700"
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </div>

      {/* Floating compare bar */}
      {compareSlugs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <WatercolorIcon name="star" size={20} className="text-blue-600" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {compareSlugs.length}園を選択中
                </p>
                <p className="text-xs text-muted">
                  最大{MAX_COMPARE}園まで選べます
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareSlugs([])}
                className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-ivory-100"
              >
                <WatercolorIcon name="check" size={12} />
                クリア
              </button>
              <button
                type="button"
                onClick={() => setShowCompare(true)}
                disabled={compareSlugs.length < 2}
                className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <WatercolorIcon name="star" size={12} className=".5 .5" />
                比較する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare modal */}
      {showCompare && compareNurseries.length >= 2 && (
        <NurseryCompare
          nurseries={compareNurseries}
          onClose={() => setShowCompare(false)}
          onRemove={(slug) => {
            handleRemoveFromCompare(slug);
            if (compareSlugs.length <= 2) {
              setShowCompare(false);
            }
          }}
        />
      )}
    </div>
  );
}
