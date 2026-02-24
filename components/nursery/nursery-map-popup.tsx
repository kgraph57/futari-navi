"use client"

;

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { NURSERY_TYPE_LABELS } from "@/lib/nurseries";
import { NURSERY_TYPE_COLOR_MAP } from "@/lib/nursery-constants";
import type { Nursery } from "@/lib/types";

interface NurseryMapPopupProps {
  readonly nursery: Nursery;
}

export function NurseryMapPopup({ nursery }: NurseryMapPopupProps) {
  const colorClass =
    NURSERY_TYPE_COLOR_MAP[nursery.type] ??
    "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="min-w-[200px] max-w-[260px]">
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
      >
        {NURSERY_TYPE_LABELS[nursery.type]}
      </span>
      <p className="mt-1 text-sm font-bold leading-tight text-foreground">
        {nursery.name}
      </p>
      <div className="mt-1.5 space-y-0.5 text-xs text-muted">
        <p>{nursery.address}</p>
        <p>{nursery.nearestStation}</p>
        <p>
          定員{nursery.capacity}名 / {nursery.ageMin}〜{nursery.ageMax}歳
        </p>
      </div>
      <div className="mt-2 flex gap-2">
        <Link
          href={`/nurseries/${nursery.slug}`}
          className="inline-flex items-center rounded-full bg-sage-600 px-3 py-1 text-xs font-medium text-white hover:bg-sage-700"
        >
          詳細を見る
        </Link>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${nursery.lat},${nursery.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted hover:bg-ivory-100"
        >
          <WatercolorIcon name="external" size={12} />
          Maps
        </a>
      </div>
    </div>
  );
}
