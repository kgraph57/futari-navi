import nurseriesData from "@/data/nurseries.json";
import type { Nursery, NurseryType, NurseryArea } from "./types";

export function getAllNurseries(): readonly Nursery[] {
  return nurseriesData as readonly Nursery[];
}

export function getNurseryBySlug(slug: string): Nursery | null {
  const found = nurseriesData.find((n: { slug: string }) => n.slug === slug);
  return (found as Nursery) ?? null;
}

export function getNurseriesByType(type: NurseryType): readonly Nursery[] {
  return nurseriesData.filter(
    (n: { type: string }) => n.type === type,
  ) as readonly Nursery[];
}

export function getNurseriesByArea(area: NurseryArea): readonly Nursery[] {
  return nurseriesData.filter(
    (n: { area: string }) => n.area === area,
  ) as readonly Nursery[];
}

export function getNurseriesByAge(ageMonths: number): readonly Nursery[] {
  return nurseriesData.filter(
    (n: { ageMin: number; ageMax: number }) =>
      ageMonths >= n.ageMin && ageMonths <= n.ageMax,
  ) as readonly Nursery[];
}

export const NURSERY_TYPE_LABELS: Record<NurseryType, string> = {
  licensed: "認可保育園",
  certified: "認証保育所",
  "small-scale": "小規模保育",
  kodomoen: "認定こども園",
  "minato-room": "港区保育室",
} as const;

export const NURSERY_AREA_LABELS: Record<NurseryArea, string> = {
  "shiba-mita": "芝・三田",
  azabu: "麻布",
  "akasaka-aoyama": "赤坂・青山",
  "takanawa-shirokane": "高輪・白金",
  "daiba-shibaura": "台場・芝浦",
} as const;
