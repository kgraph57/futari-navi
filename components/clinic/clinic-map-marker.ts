import L from "leaflet";
import type { Clinic } from "@/lib/clinics";

const iconCache = new Map<string, L.DivIcon>();

export function createClinicIcon(clinic: Clinic): L.DivIcon {
  const key = clinic.emergencyAvailable ? "emergency" : "regular";
  const cached = iconCache.get(key);
  if (cached) return cached;

  const color = clinic.emergencyAvailable ? "#dc2626" : "#0D9488";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36"><path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}" stroke="#fff" stroke-width="2"/><path d="M12 8h4v4h4v4h-4v4h-4v-4H8v-4h4V8z" fill="#fff"/></svg>`;

  const icon = L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });

  iconCache.set(key, icon);
  return icon;
}
