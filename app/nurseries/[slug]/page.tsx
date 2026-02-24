import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllNurseries,
  getNurseryBySlug,
  NURSERY_TYPE_LABELS,
  NURSERY_AREA_LABELS,
} from "@/lib/nurseries";
import {
  NURSERY_TYPE_ICON_MAP,
  NURSERY_TYPE_COLOR_MAP,
} from "@/lib/nursery-constants";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const nurseries = getAllNurseries();
  return nurseries.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const nursery = getNurseryBySlug(slug);
  if (!nursery) return { title: "保育施設が見つかりません" };

  return {
    title: `${nursery.name} - 港区の保育園`,
    description: `${nursery.name}（${nursery.address}）の保育時間、定員、特徴、アクセス情報。${NURSERY_TYPE_LABELS[nursery.type]}。`,
  };
}

function InfoRow({
  label,
  value,
}: {
  readonly label: string;
  readonly value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-20 shrink-0 text-sm font-medium text-muted">
        {label}
      </span>
      <span className="text-sm text-card-foreground">{value}</span>
    </div>
  );
}

export default async function NurseryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const nursery = getNurseryBySlug(slug);

  if (!nursery) {
    notFound();
  }

  const colorClass =
    NURSERY_TYPE_COLOR_MAP[nursery.type] ??
    "bg-gray-50 text-gray-600 border-gray-200";
  const iconName = NURSERY_TYPE_ICON_MAP[nursery.type] ?? "building";

  const allNurseries = getAllNurseries();
  const relatedNurseries = allNurseries
    .filter((n) => n.slug !== nursery.slug && n.area === nursery.area)
    .slice(0, 3);

  const ageLabel =
    nursery.ageMin === 0
      ? `生後57日〜${nursery.ageMax}歳児クラス`
      : `${nursery.ageMin}歳〜${nursery.ageMax}歳児クラス`;

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/nurseries"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            保育園一覧に戻る
          </Link>

          <div className="mt-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorClass}`}
            >
              <WatercolorIcon name={iconName} size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
                >
                  {NURSERY_TYPE_LABELS[nursery.type]}
                </span>
                <span className="rounded-full bg-ivory-200 px-2.5 py-0.5 text-xs font-medium text-muted">
                  {NURSERY_AREA_LABELS[nursery.area]}
                </span>
                {nursery.hasGarden && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                    <WatercolorIcon name="star" size={12} />
                    園庭あり
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                {nursery.name}
              </h1>
            </div>
          </div>

          {nursery.notes && (
            <p className="mt-4 text-base leading-relaxed text-muted">
              {nursery.notes}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* 基本情報 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="mappin" size={20} className="text-sage-600" />
              基本情報
            </h2>
            <div className="mt-4 space-y-3">
              <InfoRow label="住所" value={nursery.address} />
              <InfoRow
                label="電話"
                value={
                  <a
                    href={`tel:${nursery.phone}`}
                    className="flex items-center gap-1 font-medium text-sage-600 hover:text-sage-700"
                  >
                    <WatercolorIcon name="phone" size={12} className=".5 .5" />
                    {nursery.phone}
                  </a>
                }
              />
              <InfoRow
                label="最寄駅"
                value={
                  <span className="flex items-center gap-1">
                    <WatercolorIcon name="star" size={12} className=".5 .5 shrink-0 text-sage-600" />
                    {nursery.nearestStation}
                  </span>
                }
              />
              <InfoRow label="運営" value={nursery.operator} />
              <InfoRow
                label="対象年齢"
                value={
                  <span className="flex items-center gap-1">
                    <WatercolorIcon name="user" size={12} className=".5 .5 shrink-0 text-sage-600" />
                    {ageLabel}
                  </span>
                }
              />
              <InfoRow
                label="定員"
                value={`${nursery.capacity}名`}
              />
            </div>
          </div>

          {/* 保育時間 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="clock" size={20} className="text-sage-600" />
              保育時間
            </h2>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between border-b border-border py-2">
                <span className="text-sm font-medium text-muted">
                  通常保育
                </span>
                <span className="text-sm text-card-foreground">
                  {nursery.hours.standard}
                </span>
              </div>
              {nursery.hours.extended != null && (
                <div className="flex items-center justify-between border-b border-border py-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-muted">
                    <WatercolorIcon name="star" size={12} className=".5 .5 text-indigo-500" />
                    延長保育
                  </span>
                  <span className="text-sm text-card-foreground">
                    {nursery.hours.extended}
                  </span>
                </div>
              )}
              {nursery.hours.shortTime != null && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-muted">
                    短時間利用
                  </span>
                  <span className="text-sm text-card-foreground">
                    {nursery.hours.shortTime}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 特徴 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-card-foreground">
              <WatercolorIcon name="star" size={20} className="text-sage-600" />
              特徴・対応
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {nursery.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-sage-200 bg-sage-50 px-3 py-1 text-sm font-medium text-sage-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* 地図 */}
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              src={`https://maps.google.com/maps?q=${nursery.lat},${nursery.lng}&z=16&output=embed&hl=ja`}
              className="h-64 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${nursery.name}の地図`}
              sandbox="allow-scripts allow-same-origin"
            />
            <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
              <p className="text-sm text-muted">
                <WatercolorIcon name="mappin" size={12} className="mr-1 inline-block .5 .5" />
                {nursery.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${nursery.lat},${nursery.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-sage-600 hover:text-sage-700"
              >
                Googleマップで開く
                <WatercolorIcon name="external" size={12} className=".5 .5" />
              </a>
            </div>
          </div>

          {/* ルート案内ボタン */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${nursery.lat},${nursery.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-6 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-sage-700"
          >
            <WatercolorIcon name="star" size={20} />
            現在地からルート案内
          </a>

          {/* 外部リンク */}
          <div className="flex flex-col gap-3">
            {nursery.website != null && (
              <a
                href={nursery.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-sage-200 bg-white px-6 py-3.5 text-base font-bold text-sage-600 shadow-sm transition-colors hover:bg-sage-50"
              >
                <WatercolorIcon name="external" size={20} />
                施設のウェブサイトを開く
              </a>
            )}
          </div>

          {/* 同エリアの保育施設 */}
          {relatedNurseries.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {NURSERY_AREA_LABELS[nursery.area]}エリアの他の保育施設
              </h2>
              <div className="mt-3 space-y-2">
                {relatedNurseries.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/nurseries/${related.slug}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-sage-200"
                  >
                    <WatercolorIcon name="building" size={16} className="shrink-0 text-sage-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-card-foreground">
                        {related.name}
                      </p>
                      <p className="text-xs text-muted">
                        {NURSERY_TYPE_LABELS[related.type]} ・{" "}
                        {related.address}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Link
              href="/nurseries"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
            >
              <WatercolorIcon name="arrow_right" size={16} />
              保育園一覧に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
