import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import {
  getAllClinics,
  getEmergencyClinics,
  CLINIC_TYPE_LABELS,
} from "@/lib/clinics";
import type { Clinic } from "@/lib/clinics";
import { TYPE_ICON_MAP, TYPE_COLOR_MAP } from "@/lib/clinic-constants";
import { ClinicMapSection } from "@/components/clinic/clinic-map-section";

export const metadata: Metadata = {
  title: "港区の小児科マップ",
  description:
    "港区の小児科クリニック・病院の一覧。夜間・休日対応の医療機関、予防接種、アレルギー外来など12の医療機関をまとめて確認できます。",
};

function ClinicCard({ clinic }: { readonly clinic: Clinic }) {
  const colorClass =
    TYPE_COLOR_MAP[clinic.type] ?? "bg-gray-50 text-gray-600 border-gray-200";
  const iconName = TYPE_ICON_MAP[clinic.type] ?? "stethoscope";

  return (
    <Link
      href={`/clinics/${clinic.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${colorClass}`}
      >
        <WatercolorIcon name={iconName} size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-card-foreground">
            {clinic.name}
          </h3>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {CLINIC_TYPE_LABELS[clinic.type]}
          </span>
          {clinic.emergencyAvailable && (
            <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              救急対応
            </span>
          )}
          {clinic.nightHours != null && (
            <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
              夜間対応
            </span>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="mappin" size={12} className=".5 .5 shrink-0" />
            {clinic.address}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="star" size={12} className=".5 .5 shrink-0" />
            {clinic.nearestStation}
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <WatercolorIcon name="clock" size={12} className=".5 .5 shrink-0" />
            平日 {clinic.hours.weekday}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {clinic.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-ivory-100 px-2 py-0.5 text-xs text-muted"
            >
              {feature}
            </span>
          ))}
        </div>

        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          詳細を見る
          <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </div>
    </Link>
  );
}

export default function ClinicsPage() {
  const allClinics = getAllClinics();
  const emergencyClinics = getEmergencyClinics();
  const regularClinics = allClinics.filter((c) => !c.emergencyAvailable);

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            <WatercolorIcon name="mappin" size={32} className="mr-2 inline-block   text-sage-600" />
            港区の小児科マップ
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            港区で小児科のある病院・クリニックをまとめました。全
            {allClinics.length}
            施設を確認できます。
          </p>
        </div>
      </section>

      <section className="border-b border-border px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <ClinicMapSection clinics={allClinics} />
        </div>
      </section>

      <section className="border-b border-border bg-red-50 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-red-700">
            <WatercolorIcon name="alert" size={20} />
            緊急連絡先
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-red-200 bg-white p-3">
              <p className="text-sm font-medium text-red-700">救急車</p>
              <a href="tel:119" className="text-xl font-bold text-red-600">
                119
              </a>
              <p className="text-xs text-muted">意識がない、呼吸困難など</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-white p-3">
              <p className="text-sm font-medium text-red-700">救急相談</p>
              <a href="tel:#7119" className="text-xl font-bold text-red-600">
                #7119
              </a>
              <p className="text-xs text-muted">救急車を呼ぶか迷ったら</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-white p-3">
              <p className="text-sm font-medium text-red-700">
                小児救急電話相談
              </p>
              <a href="tel:#8000" className="text-xl font-bold text-red-600">
                #8000
              </a>
              <p className="text-xs text-muted">夜間・休日の子どもの急病</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <div className="flex items-center gap-3">
              <WatercolorIcon name="building" size={24} className="text-red-600" />
              <h2 className="font-heading text-xl font-semibold text-foreground">
                救急対応のある病院
              </h2>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                {emergencyClinics.length}件
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {emergencyClinics.map((clinic) => (
                <ClinicCard key={clinic.slug} clinic={clinic} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <WatercolorIcon name="stethoscope" size={24} className="text-sage-600" />
              <h2 className="font-heading text-xl font-semibold text-foreground">
                クリニック
              </h2>
              <span className="rounded-full bg-ivory-200 px-2 py-0.5 text-xs font-medium text-muted">
                {regularClinics.length}件
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {regularClinics.map((clinic) => (
                <ClinicCard key={clinic.slug} clinic={clinic} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
