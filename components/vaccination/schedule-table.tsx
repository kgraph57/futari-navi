"use client"

;

import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { Vaccine } from "@/lib/types";
import { VACCINE_TYPE_LABELS } from "@/lib/vaccines";

interface ScheduleTableProps {
  readonly vaccines: readonly Vaccine[];
}

const AGE_COLUMNS = [
  { key: "0m", label: "出生", months: 0 },
  { key: "2m", label: "2ヶ月", months: 2 },
  { key: "3m", label: "3ヶ月", months: 3 },
  { key: "4m", label: "4〜5ヶ月", months: 4 },
  { key: "8m", label: "7〜8ヶ月", months: 8 },
  { key: "1y", label: "1歳", months: 12 },
  { key: "1.5y", label: "1歳半", months: 18 },
  { key: "3y", label: "3歳", months: 36 },
  { key: "5y", label: "5〜6歳", months: 66 },
  { key: "9y", label: "9歳", months: 108 },
  { key: "11y", label: "11歳", months: 132 },
  { key: "12y", label: "12〜16歳", months: 144 },
] as const;

function getDoseColumn(standardMonth: number): string | null {
  if (standardMonth <= 0) return "0m";
  if (standardMonth <= 2) return "2m";
  if (standardMonth <= 3) return "3m";
  if (standardMonth <= 5) return "4m";
  if (standardMonth <= 8) return "8m";
  if (standardMonth <= 14) return "1y";
  if (standardMonth <= 24) return "1.5y";
  if (standardMonth <= 48) return "3y";
  if (standardMonth <= 84) return "5y";
  if (standardMonth <= 120) return "9y";
  if (standardMonth <= 140) return "11y";
  return "12y";
}

function formatAge(months: number): string {
  if (months < 12) return `${months}ヶ月`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years}歳`;
  return `${years}歳${rem}ヶ月`;
}

function DoseMarker({
  doseNumber,
  label,
  isRoutine,
}: {
  readonly doseNumber: number;
  readonly label: string;
  readonly isRoutine: boolean;
}) {
  const bg = isRoutine ? "bg-sage-500 text-white" : "bg-blush-400 text-white";

  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${bg}`}
      title={label}
    >
      {doseNumber}
    </span>
  );
}

function DesktopTable({
  routineVaccines,
  optionalVaccines,
}: {
  readonly routineVaccines: readonly Vaccine[];
  readonly optionalVaccines: readonly Vaccine[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="bg-ivory-100">
            <th className="sticky left-0 z-10 bg-ivory-100 px-4 py-3 text-left text-sm font-bold text-foreground">
              ワクチン名
            </th>
            {AGE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-2 py-3 text-center text-xs font-medium text-muted"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={AGE_COLUMNS.length + 1}
              className="bg-sage-50 px-4 py-2 text-sm font-bold text-sage-700"
            >
              <span className="flex items-center gap-1.5">
                <WatercolorIcon name="shield" size={16} />
                {VACCINE_TYPE_LABELS.routine}（公費・無料）
              </span>
            </td>
          </tr>
          {routineVaccines.map((vaccine) => (
            <VaccineRow key={vaccine.slug} vaccine={vaccine} />
          ))}
          <tr>
            <td
              colSpan={AGE_COLUMNS.length + 1}
              className="bg-blush-50 px-4 py-2 text-sm font-bold text-blush-600"
            >
              <span className="flex items-center gap-1.5">
                <WatercolorIcon name="star" size={16} />
                {VACCINE_TYPE_LABELS.optional}（一部助成あり）
              </span>
            </td>
          </tr>
          {optionalVaccines.map((vaccine) => (
            <VaccineRow key={vaccine.slug} vaccine={vaccine} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VaccineRow({ vaccine }: { readonly vaccine: Vaccine }) {
  const dosesByColumn: Record<string, (typeof vaccine.doses)[number][]> = {};

  for (const dose of vaccine.doses) {
    const col = getDoseColumn(dose.ageMonthsStandard);
    if (col) {
      const existing = dosesByColumn[col] ?? [];
      dosesByColumn[col] = [...existing, dose];
    }
  }

  const isRoutine = vaccine.type === "routine";

  return (
    <tr className="border-t border-border transition-colors hover:bg-ivory-50/50">
      <td className="sticky left-0 z-10 bg-white px-4 py-3 text-sm font-medium text-foreground">
        <div className="flex flex-col">
          <span>{vaccine.nameShort}</span>
          <span className="text-xs text-muted">{vaccine.disease}</span>
        </div>
      </td>
      {AGE_COLUMNS.map((col) => {
        const doses = dosesByColumn[col.key];
        return (
          <td key={col.key} className="px-2 py-3 text-center">
            {doses ? (
              <div className="flex items-center justify-center gap-0.5">
                {doses.map((dose) => (
                  <DoseMarker
                    key={dose.doseNumber}
                    doseNumber={dose.doseNumber}
                    label={dose.label}
                    isRoutine={isRoutine}
                  />
                ))}
              </div>
            ) : null}
          </td>
        );
      })}
    </tr>
  );
}

function MobileCards({
  routineVaccines,
  optionalVaccines,
}: {
  readonly routineVaccines: readonly Vaccine[];
  readonly optionalVaccines: readonly Vaccine[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-sage-700">
          <WatercolorIcon name="shield" size={16} />
          {VACCINE_TYPE_LABELS.routine}（公費・無料）
        </div>
        <div className="space-y-3">
          {routineVaccines.map((vaccine) => (
            <MobileVaccineCard key={vaccine.slug} vaccine={vaccine} />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-blush-600">
          <WatercolorIcon name="star" size={16} />
          {VACCINE_TYPE_LABELS.optional}（一部助成あり）
        </div>
        <div className="space-y-3">
          {optionalVaccines.map((vaccine) => (
            <MobileVaccineCard key={vaccine.slug} vaccine={vaccine} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileVaccineCard({ vaccine }: { readonly vaccine: Vaccine }) {
  const isRoutine = vaccine.type === "routine";
  const borderColor = isRoutine ? "border-sage-200" : "border-blush-200";

  return (
    <div className={`rounded-lg border ${borderColor} bg-card p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-heading text-sm font-semibold text-card-foreground">
            {vaccine.name}
          </h4>
          <p className="mt-0.5 text-xs text-muted">{vaccine.disease}</p>
        </div>
        <WatercolorIcon name="syringe" size={16} className="shrink-0 text-muted" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {vaccine.doses.map((dose) => (
          <div
            key={dose.doseNumber}
            className="flex items-center gap-1.5 rounded-full bg-ivory-100 px-2.5 py-1"
          >
            <DoseMarker
              doseNumber={dose.doseNumber}
              label={dose.label}
              isRoutine={isRoutine}
            />
            <span className="text-xs text-foreground">
              {dose.label}
              <span className="ml-1 text-muted">
                ({formatAge(dose.ageMonthsStandard)})
              </span>
            </span>
          </div>
        ))}
      </div>
      {vaccine.relatedArticleSlug && (
        <Link
          href={`/articles/${vaccine.relatedArticleSlug}`}
          className="mt-3 inline-block text-xs font-medium text-sage-600 hover:text-sage-700"
        >
          関連記事を読む →
        </Link>
      )}
    </div>
  );
}

export function ScheduleTable({ vaccines }: ScheduleTableProps) {
  const routineVaccines = vaccines.filter((v) => v.type === "routine");
  const optionalVaccines = vaccines.filter((v) => v.type === "optional");

  return (
    <>
      <div className="hidden sm:block">
        <DesktopTable
          routineVaccines={routineVaccines}
          optionalVaccines={optionalVaccines}
        />
        <div className="mt-3 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sage-500 text-[10px] font-bold text-white">
              1
            </span>
            定期接種
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blush-400 text-[10px] font-bold text-white">
              1
            </span>
            任意接種
          </span>
          <span>丸数字 = 接種回</span>
        </div>
      </div>
      <div className="sm:hidden">
        <MobileCards
          routineVaccines={routineVaccines}
          optionalVaccines={optionalVaccines}
        />
      </div>
    </>
  );
}
