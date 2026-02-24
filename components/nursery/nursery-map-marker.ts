import L from "leaflet";
import { NURSERY_TYPE_HEX_MAP } from "@/lib/nursery-constants";
import type { NurseryType } from "@/lib/types";

const iconCache = new Map<NurseryType, L.DivIcon>();

export function createNurseryIcon(type: NurseryType): L.DivIcon {
  const cached = iconCache.get(type);
  if (cached) return cached;

  const color = NURSERY_TYPE_HEX_MAP[type] ?? "#0D9488";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}" stroke="#fff" stroke-width="2"/><circle cx="14" cy="13" r="5" fill="#fff"/></svg>`;

  const icon = L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });

  iconCache.set(type, icon);
  return icon;
}
