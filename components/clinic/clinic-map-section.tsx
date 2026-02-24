"use client";

import dynamic from "next/dynamic";
import type { Clinic } from "@/lib/clinics";

const ClinicLeafletMap = dynamic(
  () =>
    import("./clinic-leaflet-map").then((mod) => ({
      default: mod.ClinicLeafletMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-border bg-ivory-100 sm:h-[500px]">
        <p className="text-sm text-muted">地図を読み込み中...</p>
      </div>
    ),
  },
);

interface ClinicMapSectionProps {
  readonly clinics: readonly Clinic[];
}

export function ClinicMapSection({ clinics }: ClinicMapSectionProps) {
  return <ClinicLeafletMap clinics={clinics} />;
}
