import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllClinics,
  getClinicBySlug,
  CLINIC_TYPE_LABELS,
} from "@/lib/clinics";
import type { Clinic } from "@/lib/clinics";
import { TYPE_ICON_MAP, TYPE_COLOR_MAP } from "@/lib/clinic-constants";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const clinics = getAllClinics();
  return clinics.map((clinic) => ({
    slug: clinic.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);
  if (!clinic) return { title: "医療機関が見つかりません" };

  return {
    title: `${clinic.name} - 港区の小児科`,
    description: `${clinic.name}（${clinic.address}）の診療時間、対応科目、アクセス情報。`,
  };
}

function HoursRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="text-sm text-card-foreground">{value ?? "休診"}</span>
    </div>
  );
}

export default async function ClinicDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const clinic = getClinicBySlug(slug);

  if (!clinic) {
    notFound();
  }

  const colorClass =
    TYPE_COLOR_MAP[clinic.type] ?? "bg-gray-50 text-gray-600 border-gray-200";
  const iconName = TYPE_ICON_MAP[clinic.type] ?? "stethoscope";

  const allClinics = getAllClinics();
  const relatedClinics = allClinics
    .filter((c) => c.slug !== clinic.slug && c.type === clinic.type)
    .slice(0, 3);

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/clinics"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            小児科一覧に戻る
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}
            >
              <WatercolorIcon name={iconName} size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
                >
                  {CLINIC_TYPE_LABELS[clinic.type]}
                </span>
                {clinic.emergencyAvailable && (
                  <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                    救急対応
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                {clinic.name}
              </h1>
            </div>
          </div>

          {clinic.notes && (
            <p className="mt-4 text-base leading-relaxed text-muted">
              {clinic.notes}
            </p>
          )}
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {clinic.emergencyAvailable && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-red-700">
                <WatercolorIcon name="alert" size={20} />
                救急対応あり
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-red-800">
                この病院は救急対応を行っています。夜間・休日の急な症状にも対応可能です。受診前にお電話でご確認ください。
              </p>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="mappin" size={20} className="text-sage-600" />
              基本情報
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-sm font-medium text-muted">
                  住所
                </span>
                <span className="text-sm text-card-foreground">
                  {clinic.address}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-sm font-medium text-muted">
                  電話
                </span>
                <a
                  href={`tel:${clinic.phone}`}
                  className="flex items-center gap-1 text-sm font-medium text-sage-600 hover:text-sage-700"
                >
                  <WatercolorIcon name="phone" size={12} className=".5 .5" />
                  {clinic.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-sm font-medium text-muted">
                  最寄駅
                </span>
                <span className="flex items-center gap-1 text-sm text-card-foreground">
                  <WatercolorIcon name="star" size={12} className=".5 .5 shrink-0 text-sage-600" />
                  {clinic.nearestStation}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 text-sm font-medium text-muted">
                  駐車場
                </span>
                <span className="flex items-center gap-1 text-sm text-card-foreground">
                  <WatercolorIcon name="star" size={12} className=".5 .5 shrink-0 text-sage-600" />
                  {clinic.parkingAvailable ? "あり" : "なし"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="clock" size={20} className="text-sage-600" />
              診療時間
            </h2>
            <div className="mt-4">
              <HoursRow label="平日" value={clinic.hours.weekday} />
              <HoursRow label="土曜" value={clinic.hours.saturday} />
              <HoursRow label="日曜" value={clinic.hours.sunday} />
              <HoursRow label="祝日" value={clinic.hours.holiday} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-card-foreground">
              対応科目・特徴
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {clinic.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-sage-200 bg-sage-50 px-3 py-1 text-sm font-medium text-sage-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              src={`https://maps.google.com/maps?q=${clinic.lat},${clinic.lng}&z=16&output=embed&hl=ja`}
              className="h-64 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${clinic.name}の地図`}
              sandbox="allow-scripts allow-same-origin"
            />
            <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
              <p className="text-sm text-muted">
                <WatercolorIcon name="mappin" size={12} className="mr-1 inline-block .5 .5" />
                {clinic.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-sage-600 hover:text-sage-700"
              >
                Googleマップで開く
                <WatercolorIcon name="external" size={12} className=".5 .5" />
              </a>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-sage-700"
          >
            <WatercolorIcon name="star" size={20} />
            現在地からルート案内
          </a>

          {clinic.nightHours !== null && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-indigo-700">
                <WatercolorIcon name="star" size={20} />
                夜間診療
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-indigo-700">
                {clinic.nightHours}
              </p>
            </div>
          )}

          {clinic.requiredItems.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-amber-700">
                <WatercolorIcon name="star" size={20} />
                受診に必要な持ち物
              </h2>
              <ul className="mt-4 space-y-2">
                {clinic.requiredItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-amber-800"
                  >
                    <WatercolorIcon name="star" size={16} className="shrink-0 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {clinic.onlineBookingUrl !== null && (
              <a
                href={clinic.onlineBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-sage-700"
              >
                <WatercolorIcon name="calendar" size={20} />
                Web予約する
              </a>
            )}
            <a
              href={clinic.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-sage-200 bg-white px-6 py-3.5 text-base font-bold text-sage-600 shadow-sm transition-colors hover:bg-sage-50"
            >
              <WatercolorIcon name="external" size={20} />
              病院のウェブサイトを開く
            </a>
          </div>

          {relatedClinics.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                同じタイプの医療機関
              </h2>
              <div className="mt-3 space-y-2">
                {relatedClinics.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/clinics/${related.slug}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-sage-200"
                  >
                    <WatercolorIcon name="stethoscope" size={16} className="shrink-0 text-sage-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-card-foreground">
                        {related.name}
                      </p>
                      <p className="text-xs text-muted">{related.address}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/clinics"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
            >
              <WatercolorIcon name="arrow_right" size={16} />
              小児科一覧に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
