"use client";

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import type { Clinic } from "@/lib/clinics";

// Minato-ku bounding box (approximate)
const BOUNDS = {
  minLat: 35.625,
  maxLat: 35.675,
  minLng: 139.72,
  maxLng: 139.775,
} as const;

function toPercent(value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

interface ClinicMapProps {
  readonly clinics: readonly Clinic[];
}

export function ClinicMap({ clinics }: ClinicMapProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedClinic =
    selectedSlug != null
      ? (clinics.find((c) => c.slug === selectedSlug) ?? null)
      : null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-sage-50/30 sm:aspect-[16/9]">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0D9488 1px, transparent 1px), linear-gradient(to bottom, #0D9488 1px, transparent 1px)",
            backgroundSize: "10% 10%",
          }}
        />

        {/* Area label */}
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-sage-700 shadow-sm backdrop-blur-sm">
          港区エリア
        </span>

        {/* Clinic pins */}
        {clinics.map((clinic) => {
          const left = toPercent(clinic.lng, BOUNDS.minLng, BOUNDS.maxLng);
          const top = 100 - toPercent(clinic.lat, BOUNDS.minLat, BOUNDS.maxLat);
          const isSelected = selectedSlug === clinic.slug;

          return (
            <button
              key={clinic.slug}
              type="button"
              onClick={() => setSelectedSlug(isSelected ? null : clinic.slug)}
              className="absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={clinic.name}
            >
              <WatercolorIcon name="mappin" size={24} />
              {isSelected && (
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white ring-2 ring-sage-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 px-1 text-xs text-muted">
        <span className="flex items-center gap-1">
          <WatercolorIcon
            name="mappin"
            size={12}
            className=".5 .5 fill-sage-600 text-sage-600"
          />
          クリニック
        </span>
        <span className="flex items-center gap-1">
          <WatercolorIcon
            name="mappin"
            size={12}
            className=".5 .5 fill-red-500 text-red-500"
          />
          救急対応
        </span>
      </div>

      {/* Selected clinic detail */}
      {selectedClinic != null && (
        <div className="rounded-xl border border-sage-100 bg-sage-50/40 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/clinics/${selectedClinic.slug}`}
                className="font-heading text-sm font-semibold text-foreground hover:text-sage-700"
              >
                {selectedClinic.name}
              </Link>
              {selectedClinic.emergencyAvailable && (
                <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                  救急対応
                </span>
              )}
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedClinic.lat},${selectedClinic.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sage-600 px-3 py-1 text-xs font-medium text-white hover:bg-sage-700"
            >
              <WatercolorIcon name="external" size={12} />
              地図で開く
            </a>
          </div>
          <div className="mt-2 space-y-1 text-xs text-muted">
            <p className="flex items-center gap-1.5">
              <WatercolorIcon name="mappin" size={12} className="shrink-0" />
              {selectedClinic.address}
            </p>
            <p className="flex items-center gap-1.5">
              <WatercolorIcon name="phone" size={12} className="shrink-0" />
              <a
                href={`tel:${selectedClinic.phone}`}
                className="hover:text-sage-600"
              >
                {selectedClinic.phone}
              </a>
            </p>
            {selectedClinic.hours.weekday != null && (
              <p className="flex items-center gap-1.5">
                <WatercolorIcon name="clock" size={12} className="shrink-0" />
                平日 {selectedClinic.hours.weekday}
              </p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {selectedClinic.features.slice(0, 4).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-white px-2 py-0.5 text-xs text-muted"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
