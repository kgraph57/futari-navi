import type { NurseryType } from "./types";
import type { WatercolorIconName } from "@/components/icons/watercolor-icon";

/** Hex colors for map marker SVGs */
export const NURSERY_TYPE_HEX_MAP: Record<NurseryType, string> = {
  licensed: "#0D9488",
  certified: "#2563eb",
  "small-scale": "#9333ea",
  kodomoen: "#ea580c",
  "minato-room": "#db2777",
} as const;

export const NURSERY_TYPE_ICON_MAP: Record<NurseryType, WatercolorIconName> = {
  licensed: "building",
  certified: "building",
  "small-scale": "home",
  kodomoen: "graduation",
  "minato-room": "baby",
};

export const NURSERY_TYPE_COLOR_MAP: Record<NurseryType, string> = {
  licensed: "bg-sage-50 text-sage-600 border-sage-200",
  certified: "bg-blue-50 text-blue-600 border-blue-200",
  "small-scale": "bg-purple-50 text-purple-600 border-purple-200",
  kodomoen: "bg-orange-50 text-orange-600 border-orange-200",
  "minato-room": "bg-pink-50 text-pink-600 border-pink-200",
};

export const NURSERY_AREA_COLOR_MAP: Record<string, string> = {
  "shiba-mita": "bg-emerald-50 text-emerald-700",
  azabu: "bg-rose-50 text-rose-700",
  "akasaka-aoyama": "bg-violet-50 text-violet-700",
  "takanawa-shirokane": "bg-amber-50 text-amber-700",
  "daiba-shibaura": "bg-sky-50 text-sky-700",
};
