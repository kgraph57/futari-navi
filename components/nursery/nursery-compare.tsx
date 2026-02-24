"use client"

;

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { Nursery } from "@/lib/types";
import { NURSERY_TYPE_LABELS, NURSERY_AREA_LABELS } from "@/lib/nurseries";

interface NurseryCompareProps {
  readonly nurseries: readonly Nursery[];
  readonly onClose: () => void;
  readonly onRemove: (slug: string) => void;
}

interface CompareRow {
  readonly label: string;
  readonly render: (nursery: Nursery) => React.ReactNode;
}

const COMPARE_ROWS: readonly CompareRow[] = [
  {
    label: "種別",
    render: (n) => NURSERY_TYPE_LABELS[n.type],
  },
  {
    label: "エリア",
    render: (n) => NURSERY_AREA_LABELS[n.area],
  },
  {
    label: "住所",
    render: (n) => (
      <span className="flex items-start gap-1">
        <WatercolorIcon name="mappin" size={12} className="mt-0.5   shrink-0 text-muted" />
        <span>{n.address}</span>
      </span>
    ),
  },
  {
    label: "最寄駅",
    render: (n) => (
      <span className="flex items-start gap-1">
        <WatercolorIcon name="star" size={12} className="mt-0.5   shrink-0 text-muted" />
        <span>{n.nearestStation}</span>
      </span>
    ),
  },
  {
    label: "定員",
    render: (n) => `${n.capacity}名`,
  },
  {
    label: "受入年齢",
    render: (n) => `${n.ageMin}歳〜${n.ageMax}歳`,
  },
  {
    label: "開園時間",
    render: (n) => (
      <span className="flex items-start gap-1">
        <WatercolorIcon name="clock" size={12} className="mt-0.5   shrink-0 text-muted" />
        <span>{n.hours.standard}</span>
      </span>
    ),
  },
  {
    label: "延長保育",
    render: (n) =>
      n.hours.extended != null ? (
        <span className="text-sage-600">{n.hours.extended}</span>
      ) : (
        <span className="text-muted">なし</span>
      ),
  },
  {
    label: "短時間保育",
    render: (n) =>
      n.hours.shortTime != null ? (
        <span className="text-sage-600">{n.hours.shortTime}</span>
      ) : (
        <span className="text-muted">なし</span>
      ),
  },
  {
    label: "園庭",
    render: (n) =>
      n.hasGarden ? (
        <span className="flex items-center gap-1 text-green-600">
          <WatercolorIcon name="check" size={16} />
          あり
        </span>
      ) : (
        <span className="flex items-center gap-1 text-muted">
          <WatercolorIcon name="star" size={16} />
          なし
        </span>
      ),
  },
  {
    label: "特徴",
    render: (n) => (
      <div className="flex flex-wrap gap-1">
        {n.features.map((f) => (
          <span
            key={f}
            className="rounded-full bg-ivory-100 px-2 py-0.5 text-[10px] text-muted"
          >
            {f}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: "運営",
    render: (n) => n.operator,
  },
];

export function NurseryCompare({
  nurseries,
  onClose,
  onRemove,
}: NurseryCompareProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-t-2xl bg-card shadow-xl sm:mx-4 sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            保育園を比較（{nurseries.length}園）
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-ivory-100 hover:text-foreground"
            aria-label="閉じる"
          >
            <WatercolorIcon name="check" size={20} />
          </button>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "calc(85vh - 56px)" }}>
          <table className="w-full min-w-[600px] border-collapse text-sm">
            {/* Nursery name headers */}
            <thead>
              <tr className="border-b border-border bg-ivory-50">
                <th className="sticky left-0 z-10 bg-ivory-50 px-3 py-3 text-left text-xs font-medium text-muted sm:px-4">
                  項目
                </th>
                {nurseries.map((n) => (
                  <th
                    key={n.slug}
                    className="px-3 py-3 text-left sm:px-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/nurseries/${n.slug}`}
                        className="font-heading text-sm font-semibold text-sage-700 hover:underline"
                      >
                        {n.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => onRemove(n.slug)}
                        className="shrink-0 rounded-full p-0.5 text-muted hover:bg-ivory-200 hover:text-foreground"
                        aria-label={`${n.name}を比較から外す`}
                      >
                        <WatercolorIcon name="check" size={12} className=".5 .5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row, index) => (
                <tr
                  key={row.label}
                  className={`border-b border-border ${index % 2 === 0 ? "bg-white" : "bg-ivory-50/50"}`}
                >
                  <td className="sticky left-0 z-10 whitespace-nowrap px-3 py-2.5 text-xs font-medium text-muted sm:px-4" style={{ backgroundColor: index % 2 === 0 ? "white" : "rgb(250 249 247 / 0.5)" }}>
                    {row.label}
                  </td>
                  {nurseries.map((n) => (
                    <td key={n.slug} className="px-3 py-2.5 text-xs text-foreground sm:px-4">
                      {row.render(n)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Action row */}
              <tr className="border-b border-border bg-sage-50/50">
                <td className="sticky left-0 z-10 bg-sage-50/50 px-3 py-3 text-xs font-medium text-muted sm:px-4">
                  リンク
                </td>
                {nurseries.map((n) => (
                  <td key={n.slug} className="px-3 py-3 sm:px-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/nurseries/${n.slug}`}
                        className="inline-flex items-center rounded-full bg-sage-600 px-3 py-1 text-xs font-medium text-white hover:bg-sage-700"
                      >
                        詳細を見る
                      </Link>
                      {n.website != null && (
                        <a
                          href={n.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:bg-ivory-100"
                        >
                          <WatercolorIcon name="external" size={12} />
                          HP
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${n.lat},${n.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:bg-ivory-100"
                      >
                        <WatercolorIcon name="mappin" size={12} />
                        Maps
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
