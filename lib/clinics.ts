import clinicsData from "@/data/clinics.json";

export interface ClinicHours {
  readonly weekday: string | null;
  readonly saturday: string | null;
  readonly sunday: string | null;
  readonly holiday: string | null;
}

export interface Clinic {
  readonly slug: string;
  readonly name: string;
  readonly type: "hospital" | "clinic";
  readonly address: string;
  readonly phone: string;
  readonly hours: ClinicHours;
  readonly nightHours: string | null;
  readonly features: readonly string[];
  readonly emergencyAvailable: boolean;
  readonly website: string;
  readonly onlineBookingUrl: string | null;
  readonly lat: number;
  readonly lng: number;
  readonly nearestStation: string;
  readonly parkingAvailable: boolean;
  readonly requiredItems: readonly string[];
  readonly notes: string;
}

export function getAllClinics(): readonly Clinic[] {
  return clinicsData as readonly Clinic[];
}

export function getClinicBySlug(slug: string): Clinic | null {
  const found = clinicsData.find((c: { slug: string }) => c.slug === slug);
  return (found as Clinic) ?? null;
}

export function getClinicsByFeature(feature: string): readonly Clinic[] {
  return clinicsData.filter((c: { features: string[] }) =>
    c.features.includes(feature),
  ) as readonly Clinic[];
}

export function getEmergencyClinics(): readonly Clinic[] {
  return clinicsData.filter(
    (c: { emergencyAvailable: boolean }) => c.emergencyAvailable,
  ) as readonly Clinic[];
}

export const CLINIC_TYPE_LABELS: Record<Clinic["type"], string> = {
  hospital: "病院",
  clinic: "クリニック",
} as const;
