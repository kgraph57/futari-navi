"use client";

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { useStore } from "@/lib/store";
import type {
  FamilyProfile,
  ChildProfile,
  VaccinationRecord,
} from "@/lib/store";
import {
  getAllVaccines,
  VACCINE_TYPE_LABELS,
  formatAgeMonths,
} from "@/lib/vaccines";
import { getChildAge, formatAge } from "@/lib/utils/age";
import { getUpcomingVaccinations } from "@/lib/vaccination-schedule";
import type { Vaccine, VaccineDose } from "@/lib/types";
import {
  trackVaccineScheduleViewed,
  trackVaccineDoseToggled,
} from "@/lib/analytics/events";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DoseStatus {
  readonly dose: VaccineDose;
  readonly record: VaccinationRecord | null;
  readonly isCompleted: boolean;
}

// ---------------------------------------------------------------------------
// Child selector
// ---------------------------------------------------------------------------

function ChildSelector({
  children,
  selectedId,
  onSelect,
}: {
  readonly children: readonly ChildProfile[];
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {children.map((child) => {
        const isActive = child.id === selectedId;
        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onSelect(child.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-sage-500 text-white"
                : "bg-ivory-100 text-muted hover:bg-ivory-200"
            }`}
          >
            <WatercolorIcon name="user" size={12} className=".5 .5" />
            <span>{child.nickname}</span>
            <span className="text-xs opacity-80">
              ({formatAge(child.birthDate)})
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress summary
// ---------------------------------------------------------------------------

function ProgressSummary({
  vaccines,
  records,
}: {
  readonly vaccines: readonly Vaccine[];
  readonly records: readonly VaccinationRecord[];
}) {
  const totalDoses = vaccines.reduce((sum, v) => sum + v.doses.length, 0);
  const completedDoses = records.filter((r) => r.status === "completed").length;
  const percent =
    totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-card-foreground">
          接種進捗: {completedDoses}/{totalDoses}回完了
        </span>
        <span className="font-medium text-sage-600">{percent}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-ivory-100">
        <div
          className="h-full rounded-full bg-sage-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Upcoming vaccinations summary
// ---------------------------------------------------------------------------

function UpcomingVaccinationsSummary({
  birthDate,
  records,
}: {
  readonly birthDate: string;
  readonly records: readonly VaccinationRecord[];
}) {
  const upcoming = getUpcomingVaccinations(birthDate, records);
  const nextItems = upcoming.slice(0, 3);

  if (nextItems.length === 0) {
    return (
      <div className="rounded-xl border border-sage-200 bg-sage-50/50 p-5 text-center">
        <WatercolorIcon
          name="check"
          size={24}
          className="mx-auto text-sage-500"
        />
        <p className="mt-2 text-sm font-medium text-sage-700">
          直近で予定されている予防接種はありません
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-800">
        <WatercolorIcon name="clock" size={16} />
        次の予防接種
      </h3>
      <div className="mt-3 space-y-2">
        {nextItems.map((item) => (
          <div
            key={`${item.vaccine.slug}-${item.dose.doseNumber}`}
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              item.isOverdue
                ? "border-red-200 bg-red-50"
                : "border-border bg-white"
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100">
              <WatercolorIcon
                name="syringe"
                size={14}
                className="text-purple-600"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-card-foreground">
                {item.vaccine.nameShort} {item.dose.label}
              </p>
              <p className="text-xs text-muted">
                標準時期: {formatAgeMonths(item.dose.ageMonthsStandard)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {item.isOverdue ? (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  期限超過
                </span>
              ) : item.daysUntilStandard <= 0 ? (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                  今が接種時期
                </span>
              ) : (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                  あと約{item.daysUntilStandard}日
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/vaccines"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
      >
        全スケジュールを見る
        <WatercolorIcon name="arrow_right" size={12} className="rotate-180" />
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dose row with toggle
// ---------------------------------------------------------------------------

function DoseRow({
  vaccineSlug,
  childId,
  doseStatus,
  onToggle,
}: {
  readonly vaccineSlug: string;
  readonly childId: string;
  readonly doseStatus: DoseStatus;
  readonly onToggle: (
    vaccineSlug: string,
    dose: VaccineDose,
    currentRecord: VaccinationRecord | null,
  ) => void;
}) {
  const { dose, record, isCompleted } = doseStatus;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
        isCompleted ? "border-sage-200 bg-sage-50/50" : "border-border"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(vaccineSlug, dose, record)}
        className="shrink-0"
        aria-label={isCompleted ? "接種を取り消す" : "接種済みにする"}
      >
        {isCompleted ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sage-500 bg-sage-500 text-white">
            <WatercolorIcon name="check" size={16} />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
            <WatercolorIcon name="check" size={16} className="text-gray-300" />
          </div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            isCompleted ? "text-sage-700 line-through" : "text-card-foreground"
          }`}
        >
          {dose.label}
        </p>
        <p className="text-xs text-muted">
          標準:{" "}
          {dose.ageMonthsStandard < 12
            ? `${dose.ageMonthsStandard}ヶ月`
            : `${Math.floor(dose.ageMonthsStandard / 12)}歳${dose.ageMonthsStandard % 12 > 0 ? `${dose.ageMonthsStandard % 12}ヶ月` : ""}`}
        </p>
      </div>

      {record?.administeredDate && (
        <div className="flex items-center gap-1 text-xs text-sage-600">
          <WatercolorIcon name="calendar" size={12} />
          <span>{record.administeredDate}</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vaccine card (expandable)
// ---------------------------------------------------------------------------

function VaccineCard({
  vaccine,
  childId,
  records,
  onToggleDose,
}: {
  readonly vaccine: Vaccine;
  readonly childId: string;
  readonly records: readonly VaccinationRecord[];
  readonly onToggleDose: (
    vaccineSlug: string,
    dose: VaccineDose,
    currentRecord: VaccinationRecord | null,
  ) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const doseStatuses: readonly DoseStatus[] = vaccine.doses.map((dose) => {
    const record =
      records.find(
        (r) =>
          r.vaccineSlug === vaccine.slug && r.doseNumber === dose.doseNumber,
      ) ?? null;
    return {
      dose,
      record,
      isCompleted: record?.status === "completed",
    };
  });

  const completedCount = doseStatuses.filter((d) => d.isCompleted).length;
  const totalCount = doseStatuses.length;
  const allCompleted = completedCount === totalCount;
  const isRoutine = vaccine.type === "routine";

  return (
    <div
      className={`rounded-xl border bg-card transition-all ${
        allCompleted ? "border-sage-200" : "border-border"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isRoutine
              ? "bg-sage-50 text-sage-600"
              : "bg-blush-50 text-blush-500"
          }`}
        >
          <WatercolorIcon name="syringe" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-card-foreground">
              {vaccine.nameShort}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                isRoutine
                  ? "bg-sage-50 text-sage-700"
                  : "bg-blush-50 text-blush-600"
              }`}
            >
              {VACCINE_TYPE_LABELS[vaccine.type]}
            </span>
            {vaccine.relatedProgramSlug && (
              <span className="rounded-full border border-blush-200 bg-blush-50 px-2 py-0.5 text-[10px] font-medium text-blush-600">
                港区助成
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ivory-100">
              <div
                className="h-full rounded-full bg-sage-500 transition-all"
                style={{
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <WatercolorIcon
            name="star"
            size={16}
            className="shrink-0 text-muted"
          />
        ) : (
          <WatercolorIcon
            name="arrow_right"
            size={16}
            className="shrink-0 text-muted"
          />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          <p className="mb-3 text-xs text-muted">{vaccine.disease}</p>
          <div className="space-y-2">
            {doseStatuses.map((ds) => (
              <DoseRow
                key={ds.dose.doseNumber}
                vaccineSlug={vaccine.slug}
                childId={childId}
                doseStatus={ds}
                onToggle={onToggleDose}
              />
            ))}
          </div>
          <Link
            href={`/vaccines/${vaccine.slug}`}
            className="mt-3 inline-block text-xs font-medium text-sage-600 hover:text-sage-700"
          >
            詳細を見る →
          </Link>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function VaccinationsPage() {
  const store = useStore();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [records, setRecords] = useState<readonly VaccinationRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const vaccines = getAllVaccines();

  // Load profile
  useEffect(() => {
    let cancelled = false;
    store.getFamilyProfile().then((loaded) => {
      if (cancelled) return;
      setProfile(loaded);
      if (loaded && loaded.children.length > 0) {
        setSelectedChildId(loaded.children[0].id);
      }
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  // Load vaccination records when child changes
  useEffect(() => {
    if (!selectedChildId) return;
    let cancelled = false;
    store.getVaccinationRecords(selectedChildId).then((loaded) => {
      if (!cancelled) {
        setRecords(loaded);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedChildId, store]);

  // Track vaccine schedule page view
  useEffect(() => {
    if (!isLoaded || !profile || !selectedChildId) return;
    const child = profile.children.find((c) => c.id === selectedChildId);
    if (!child) return;
    const { years, months } = getChildAge(child.birthDate);
    const totalDoses = vaccines.reduce((sum, v) => sum + v.doses.length, 0);
    const completedDoses = records.filter(
      (r) => r.status === "completed",
    ).length;
    trackVaccineScheduleViewed(years * 12 + months, completedDoses, totalDoses);
  }, [isLoaded, profile, selectedChildId, vaccines, records]);

  const handleToggleDose = useCallback(
    async (
      vaccineSlug: string,
      dose: VaccineDose,
      currentRecord: VaccinationRecord | null,
    ) => {
      if (!selectedChildId) return;

      const isCurrentlyCompleted = currentRecord?.status === "completed";
      const today = new Date().toISOString().split("T")[0];

      trackVaccineDoseToggled(
        vaccineSlug,
        dose.doseNumber,
        !isCurrentlyCompleted,
      );

      await store.upsertVaccinationRecord({
        childId: selectedChildId,
        vaccineSlug,
        doseNumber: dose.doseNumber,
        administeredDate: isCurrentlyCompleted ? null : today,
        scheduledDate: null,
        clinicName: null,
        lotNumber: null,
        notes: null,
        status: isCurrentlyCompleted ? "scheduled" : "completed",
      });

      // Reload records
      const updated = await store.getVaccinationRecords(selectedChildId);
      setRecords(updated);
    },
    [selectedChildId, store],
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ivory-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-48 animate-pulse rounded bg-ivory-200" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-ivory-200"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile || profile.children.length === 0) {
    return (
      <div className="min-h-screen bg-ivory-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/my"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
            マイページに戻る
          </Link>
          <div className="mt-8 rounded-2xl border-2 border-dashed border-sage-200 bg-white/60 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
              <WatercolorIcon name="baby" size={28} className="text-sage-600" />
            </div>
            <h1 className="mt-4 font-heading text-lg font-semibold text-foreground">
              お子さんを登録してください
            </h1>
            <p className="mt-2 text-sm text-muted">
              予防接種記録を管理するには、まずお子さんの登録が必要です。
            </p>
            <Link
              href="/my"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
            >
              <WatercolorIcon name="baby" size={16} />
              お子さんを登録する
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedChild =
    profile.children.find((c) => c.id === selectedChildId) ?? null;
  const routineVaccines = vaccines.filter((v) => v.type === "routine");
  const optionalVaccines = vaccines.filter((v) => v.type === "optional");

  return (
    <>
      <section className="bg-gradient-to-b from-purple-50 to-ivory-50 px-4 pb-6 pt-8 sm:pb-8 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/my"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
            マイページ
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            <WatercolorIcon
              name="syringe"
              size={28}
              className="mr-2 inline-block   text-purple-600"
            />
            予防接種記録
          </h1>
          <p className="mt-2 text-sm text-muted">
            お子さんの予防接種の接種状況を記録・管理できます。
          </p>
        </div>
      </section>

      <section className="px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Child selector */}
          {profile.children.length > 1 && selectedChildId && (
            <ChildSelector
              children={profile.children}
              selectedId={selectedChildId}
              onSelect={setSelectedChildId}
            />
          )}

          {/* Child info & progress */}
          {selectedChild && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                <WatercolorIcon
                  name="baby"
                  size={20}
                  className="text-purple-600"
                />
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-card-foreground">
                  {selectedChild.nickname}
                </p>
                <p className="text-xs text-muted">
                  {formatAge(selectedChild.birthDate)}
                </p>
              </div>
            </div>
          )}

          <ProgressSummary vaccines={vaccines} records={records} />

          {/* Next upcoming vaccinations */}
          {selectedChild && (
            <UpcomingVaccinationsSummary
              birthDate={selectedChild.birthDate}
              records={records}
            />
          )}

          {/* Medical supervision notice */}
          <div className="rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-blue-800">
              <WatercolorIcon
                name="shield"
                size={14}
                className="mt-0.5 shrink-0"
              />
              <span>
                このスケジュールは日本小児科学会の推奨スケジュール（2024年版）と港区の公費助成情報に基づいています。
              </span>
            </p>
          </div>

          {/* Routine vaccines */}
          <div>
            <h2 className="flex items-center gap-1.5 font-heading text-base font-semibold text-sage-700">
              <WatercolorIcon name="shield" size={16} />
              {VACCINE_TYPE_LABELS.routine}（公費・無料）
            </h2>
            <div className="mt-3 space-y-3">
              {routineVaccines.map((vaccine) => (
                <VaccineCard
                  key={vaccine.slug}
                  vaccine={vaccine}
                  childId={selectedChildId ?? ""}
                  records={records}
                  onToggleDose={handleToggleDose}
                />
              ))}
            </div>
          </div>

          {/* Optional vaccines */}
          <div>
            <h2 className="flex items-center gap-1.5 font-heading text-base font-semibold text-blush-600">
              <WatercolorIcon name="star" size={16} />
              {VACCINE_TYPE_LABELS.optional}（一部助成あり）
            </h2>
            <div className="mt-3 space-y-3">
              {optionalVaccines.map((vaccine) => (
                <VaccineCard
                  key={vaccine.slug}
                  vaccine={vaccine}
                  childId={selectedChildId ?? ""}
                  records={records}
                  onToggleDose={handleToggleDose}
                />
              ))}
            </div>
          </div>

          {/* Link to vaccine info */}
          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="text-sm text-muted">
              各ワクチンの詳細情報は予防接種ページで確認できます
            </p>
            <Link
              href="/vaccines"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700"
            >
              予防接種一覧を見る
              <WatercolorIcon
                name="arrow_right"
                size={12}
                className=".5 .5 rotate-180"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
