import type { Clinic } from "./clinics";
import type { WatercolorIconName } from "@/components/icons/watercolor-icon";

export const TYPE_ICON_MAP: Record<Clinic["type"], WatercolorIconName> = {
  hospital: "building",
  clinic: "stethoscope",
};

export const TYPE_COLOR_MAP: Record<Clinic["type"], string> = {
  hospital: "bg-red-50 text-red-600 border-red-200",
  clinic: "bg-sage-50 text-sage-600 border-sage-200",
};
