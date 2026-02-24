"use client";

import Link from "next/link";
import { AlertTriangle, Info, ArrowRight } from "lucide-react";
import type { SeasonalDisease } from "./page";

// ---------------------------------------------------------------------------
// Color maps (no dynamic class generation)
// ---------------------------------------------------------------------------

const SEVERITY_BADGE: Record<string, string> = {
  peak_high:
    "bg-red-50 text-red-700 ring-red-200",
  peak_medium:
    "bg-orange-50 text-orange-700 ring-orange-200",
  warning_high:
    "bg-red-50/60 text-red-600 ring-red-100",
  warning_medium:
    "bg-amber-50 text-amber-600 ring-amber-100",
};

const CARD_BORDER: Record<string, string> = {
  peak_high: "border-red-200 bg-red-50/30",
  peak_medium: "border-orange-200 bg-orange-50/30",
  warning_high: "border-red-100 bg-red-50/10",
  warning_medium: "border-amber-100 bg-amber-50/10",
};

const ICON_COLOR: Record<string, string> = {
  peak_high: "text-red-500",
  peak_medium: "text-orange-400",
  warning_high: "text-red-400",
  warning_medium: "text-amber-400",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AlertsClientProps {
  readonly diseases: readonly SeasonalDisease[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AlertsClient({ diseases }: AlertsClientProps) {
  const currentMonth = new Date().getMonth() + 1;

  const peakDiseases = diseases.filter((d) =>
    d.peakMonths.includes(currentMonth)
  );
  const warningDiseases = diseases.filter(
    (d) =>
      d.warningMonths.includes(currentMonth) &&
      !d.peakMonths.includes(currentMonth)
  );

  const hasAlerts = peakDiseases.length > 0 || warningDiseases.length > 0;

  if (!hasAlerts) {
    return (
      <div className="flex items-start gap-4 rounded-xl border border-sage-200 bg-sage-50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-100">
          <Info className="h-5 w-5 text-sage-600" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-sage-800">
            今月は感染症の特別な注意時期ではありません
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            通常の手洗い・うがい・室内換気を心がけてください。
            年間カレンダーで季節ごとのリスクをご確認いただけます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Peak alerts */}
      {peakDiseases.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <h3 className="text-sm font-bold text-foreground">
              現在流行ピーク期
            </h3>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {peakDiseases.length}件
            </span>
          </div>
          <div className="space-y-3">
            {peakDiseases.map((disease) => {
              const key = `peak_${disease.severity}`;
              return (
                <AlertCard
                  key={disease.slug}
                  disease={disease}
                  statusKey={key}
                  statusLabel={
                    disease.severity === "high" ? "流行ピーク・注意" : "流行ピーク"
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Warning alerts */}
      {warningDiseases.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">
              注意期間（流行の始まり・終わり）
            </h3>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {warningDiseases.length}件
            </span>
          </div>
          <div className="space-y-3">
            {warningDiseases.map((disease) => {
              const key = `warning_${disease.severity}`;
              return (
                <AlertCard
                  key={disease.slug}
                  disease={disease}
                  statusKey={key}
                  statusLabel="注意期間"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Alert card sub-component
// ---------------------------------------------------------------------------

function AlertCard({
  disease,
  statusKey,
  statusLabel,
}: {
  readonly disease: SeasonalDisease;
  readonly statusKey: string;
  readonly statusLabel: string;
}) {
  const borderClass = CARD_BORDER[statusKey] ?? "border-border bg-card";
  const iconClass = ICON_COLOR[statusKey] ?? "text-muted";
  const badgeClass =
    SEVERITY_BADGE[statusKey] ??
    "bg-gray-50 text-gray-600 ring-gray-200";

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 ${borderClass}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60">
          <AlertTriangle className={`h-4 w-4 ${iconClass}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-heading text-sm font-semibold text-foreground">
              {disease.name}
            </h4>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {disease.description}
          </p>
          {disease.articleSlug && (
            <Link
              href={`/articles/${disease.articleSlug}`}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
            >
              詳しく読む
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
