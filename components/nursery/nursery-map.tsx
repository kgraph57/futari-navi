"use client"

;

import { useCallback, useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { Nursery } from "@/lib/types";
import { NURSERY_TYPE_LABELS } from "@/lib/nurseries";
import { NURSERY_TYPE_HEX_MAP } from "@/lib/nursery-constants";
import { createNurseryIcon } from "./nursery-map-marker";
import { NurseryMapPopup } from "./nursery-map-popup";

const MINATO_CENTER: [number, number] = [35.658, 139.7514];
const DEFAULT_ZOOM = 14;

function LocateButton() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = useCallback(() => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 16 });
    map.once("locationfound", () => setLocating(false));
    map.once("locationerror", () => setLocating(false));
  }, [map]);

  return (
    <button
      type="button"
      onClick={handleLocate}
      disabled={locating}
      className="absolute right-3 top-3 z-[1000] flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white shadow-md transition-colors hover:bg-ivory-100 disabled:opacity-50"
      aria-label="現在地を表示"
      title="現在地を表示"
    >
      <WatercolorIcon name="mappin" size={16} />
    </button>
  );
}

interface NurseryMapProps {
  readonly nurseries: readonly Nursery[];
}

export function NurseryMap({ nurseries }: NurseryMapProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border">
      <MapContainer
        center={MINATO_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-[400px] w-full sm:h-[500px] lg:h-[600px]"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocateButton />

        {nurseries.map((nursery) => (
          <Marker
            key={nursery.slug}
            position={[nursery.lat, nursery.lng]}
            icon={createNurseryIcon(nursery.type)}
          >
            <Popup>
              <NurseryMapPopup nursery={nursery} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 border-t border-border bg-card px-4 py-2.5 text-xs text-muted">
        {(
          Object.entries(NURSERY_TYPE_HEX_MAP) as [string, string][]
        ).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            {NURSERY_TYPE_LABELS[type as keyof typeof NURSERY_TYPE_LABELS]}
          </span>
        ))}
      </div>
    </div>
  );
}
