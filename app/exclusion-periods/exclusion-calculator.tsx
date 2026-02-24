"use client";

import { useState } from "react";
import { CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DiseaseId =
  | "influenza"
  | "measles"
  | "mumps"
  | "pharyngoconjunctival"
  | "streptococcal";

type AgeGroup = "nursery" | "elementary";

interface DiseaseConfig {
  readonly id: DiseaseId;
  readonly label: string;
  readonly reading: string;
  readonly color: {
    readonly badge: string;
    readonly result: string;
    readonly border: string;
    readonly icon: string;
  };
  readonly ruleBasis: string;
}

interface CalculatorState {
  readonly selectedDisease: DiseaseId;
  // Influenza
  readonly onsetDate: string;
  readonly feverFreeDate: string;
  readonly ageGroup: AgeGroup;
  // Measles
  readonly measlesFeverFreeDate: string;
  // Mumps
  readonly swellingDate: string;
  // Pharyngoconjunctival
  readonly symptomFreeDate: string;
  // Streptococcal
  readonly antibioticStartDate: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DISEASE_CONFIGS: readonly DiseaseConfig[] = [
  {
    id: "influenza",
    label: "インフルエンザ",
    reading: "インフルエンザ",
    color: {
      badge: "bg-teal-100 text-teal-800 ring-teal-200",
      result: "bg-teal-50 border-teal-200 text-teal-900",
      border: "border-teal-400",
      icon: "text-teal-600",
    },
    ruleBasis:
      "学校保健安全法施行規則：発症後5日かつ解熱後2日（幼稚園・保育園は3日）を経過するまで",
  },
  {
    id: "measles",
    label: "麻疹（はしか）",
    reading: "ましん",
    color: {
      badge: "bg-rose-100 text-rose-800 ring-rose-200",
      result: "bg-rose-50 border-rose-200 text-rose-900",
      border: "border-rose-400",
      icon: "text-rose-600",
    },
    ruleBasis:
      "学校保健安全法施行規則：解熱した後3日を経過するまで",
  },
  {
    id: "mumps",
    label: "流行性耳下腺炎（おたふくかぜ）",
    reading: "りゅうこうせいじかせんえん",
    color: {
      badge: "bg-amber-100 text-amber-800 ring-amber-200",
      result: "bg-amber-50 border-amber-200 text-amber-900",
      border: "border-amber-400",
      icon: "text-amber-600",
    },
    ruleBasis:
      "学校保健安全法施行規則：耳下腺等の腫脹発現後5日を経過し、全身状態が良好になるまで",
  },
  {
    id: "pharyngoconjunctival",
    label: "咽頭結膜熱（プール熱）",
    reading: "いんとうけつまくねつ",
    color: {
      badge: "bg-blue-100 text-blue-800 ring-blue-200",
      result: "bg-blue-50 border-blue-200 text-blue-900",
      border: "border-blue-400",
      icon: "text-blue-600",
    },
    ruleBasis:
      "学校保健安全法施行規則：主要症状（発熱・咽頭炎・結膜炎）消退後2日を経過するまで",
  },
  {
    id: "streptococcal",
    label: "溶連菌感染症",
    reading: "ようれんきんかんせんしょう",
    color: {
      badge: "bg-violet-100 text-violet-800 ring-violet-200",
      result: "bg-violet-50 border-violet-200 text-violet-900",
      border: "border-violet-400",
      icon: "text-violet-600",
    },
    ruleBasis:
      "抗菌薬服用開始後24時間（1日）を経過し、解熱・症状改善後",
  },
];

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"] as const;

// ---------------------------------------------------------------------------
// Pure calculation functions (no side effects, immutable)
// ---------------------------------------------------------------------------

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatResultDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS_JA[date.getDay()];
  return `${month}月${day}日（${weekday}）`;
}

function calculateInfluenzaReturnDate(
  onsetDate: string,
  feverFreeDate: string,
  ageGroup: AgeGroup
): Date | null {
  const onset = parseLocalDate(onsetDate);
  const feverFree = parseLocalDate(feverFreeDate);
  if (!onset || !feverFree) return null;

  // "after N days" means day N+1 is the first allowed day
  const fromOnset = addDays(onset, 5);
  const daysAfterFeverFree = ageGroup === "nursery" ? 3 : 2;
  const fromFeverFree = addDays(feverFree, daysAfterFeverFree);

  return fromOnset > fromFeverFree ? fromOnset : fromFeverFree;
}

function calculateMeaslesReturnDate(feverFreeDate: string): Date | null {
  const feverFree = parseLocalDate(feverFreeDate);
  if (!feverFree) return null;
  return addDays(feverFree, 3);
}

function calculateMumpsReturnDate(swellingDate: string): Date | null {
  const swelling = parseLocalDate(swellingDate);
  if (!swelling) return null;
  return addDays(swelling, 5);
}

function calculatePharyngoconjunctivalReturnDate(
  symptomFreeDate: string
): Date | null {
  const symptomFree = parseLocalDate(symptomFreeDate);
  if (!symptomFree) return null;
  return addDays(symptomFree, 2);
}

function calculateStreptococcalReturnDate(
  antibioticStartDate: string
): Date | null {
  const start = parseLocalDate(antibioticStartDate);
  if (!start) return null;
  return addDays(start, 1);
}

function computeReturnDate(state: CalculatorState): Date | null {
  switch (state.selectedDisease) {
    case "influenza":
      return calculateInfluenzaReturnDate(
        state.onsetDate,
        state.feverFreeDate,
        state.ageGroup
      );
    case "measles":
      return calculateMeaslesReturnDate(state.measlesFeverFreeDate);
    case "mumps":
      return calculateMumpsReturnDate(state.swellingDate);
    case "pharyngoconjunctival":
      return calculatePharyngoconjunctivalReturnDate(state.symptomFreeDate);
    case "streptococcal":
      return calculateStreptococcalReturnDate(state.antibioticStartDate);
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE: CalculatorState = {
  selectedDisease: "influenza",
  onsetDate: "",
  feverFreeDate: "",
  ageGroup: "nursery",
  measlesFeverFreeDate: "",
  swellingDate: "",
  symptomFreeDate: "",
  antibioticStartDate: "",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface LabelProps {
  readonly htmlFor: string;
  readonly children: React.ReactNode;
}

function FieldLabel({ htmlFor, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-foreground"
    >
      {children}
    </label>
  );
}

interface DateInputProps {
  readonly id: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}

function DateInput({ id, value, onChange }: DateInputProps) {
  return (
    <input
      type="date"
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
    />
  );
}

// ---------------------------------------------------------------------------
// Disease-specific input panels
// ---------------------------------------------------------------------------

interface InfluenzaInputsProps {
  readonly state: CalculatorState;
  readonly onUpdate: (partial: Partial<CalculatorState>) => void;
}

function InfluenzaInputs({ state, onUpdate }: InfluenzaInputsProps) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel htmlFor="onset-date">発症日</FieldLabel>
        <DateInput
          id="onset-date"
          value={state.onsetDate}
          onChange={(v) => onUpdate({ onsetDate: v })}
        />
        <p className="mt-1 text-xs text-muted">
          症状が最初に出た日（または検査陽性の日）
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="fever-free-date">解熱日</FieldLabel>
        <DateInput
          id="fever-free-date"
          value={state.feverFreeDate}
          onChange={(v) => onUpdate({ feverFreeDate: v })}
        />
        <p className="mt-1 text-xs text-muted">
          解熱剤なしで37.5℃未満が続いた最初の日
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="age-group">年齢区分</FieldLabel>
        <div className="mt-1 flex gap-2">
          {(
            [
              { value: "nursery", label: "幼稚園・保育園" },
              { value: "elementary", label: "小学生以上" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onUpdate({ ageGroup: value })}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                state.ageGroup === value
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-border bg-white text-muted hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted">
          幼稚園・保育園は解熱後3日、小学生以上は解熱後2日
        </p>
      </div>
    </div>
  );
}

interface MeaslesInputsProps {
  readonly state: CalculatorState;
  readonly onUpdate: (partial: Partial<CalculatorState>) => void;
}

function MeaslesInputs({ state, onUpdate }: MeaslesInputsProps) {
  return (
    <div>
      <FieldLabel htmlFor="measles-fever-free-date">解熱日</FieldLabel>
      <DateInput
        id="measles-fever-free-date"
        value={state.measlesFeverFreeDate}
        onChange={(v) => onUpdate({ measlesFeverFreeDate: v })}
      />
      <p className="mt-1 text-xs text-muted">
        解熱剤なしで37.5℃未満が続いた最初の日
      </p>
    </div>
  );
}

interface MumpsInputsProps {
  readonly state: CalculatorState;
  readonly onUpdate: (partial: Partial<CalculatorState>) => void;
}

function MumpsInputs({ state, onUpdate }: MumpsInputsProps) {
  return (
    <div>
      <FieldLabel htmlFor="swelling-date">腫脹発現日</FieldLabel>
      <DateInput
        id="swelling-date"
        value={state.swellingDate}
        onChange={(v) => onUpdate({ swellingDate: v })}
      />
      <p className="mt-1 text-xs text-muted">
        耳下腺・顎下腺・舌下腺のはれが始まった日
      </p>
    </div>
  );
}

interface PharyngoconjunctivalInputsProps {
  readonly state: CalculatorState;
  readonly onUpdate: (partial: Partial<CalculatorState>) => void;
}

function PharyngoconjunctivalInputs({
  state,
  onUpdate,
}: PharyngoconjunctivalInputsProps) {
  return (
    <div>
      <FieldLabel htmlFor="symptom-free-date">主要症状消退日</FieldLabel>
      <DateInput
        id="symptom-free-date"
        value={state.symptomFreeDate}
        onChange={(v) => onUpdate({ symptomFreeDate: v })}
      />
      <p className="mt-1 text-xs text-muted">
        発熱・咽頭炎・結膜炎の全症状が治まった日
      </p>
    </div>
  );
}

interface StreptococcalInputsProps {
  readonly state: CalculatorState;
  readonly onUpdate: (partial: Partial<CalculatorState>) => void;
}

function StreptococcalInputs({ state, onUpdate }: StreptococcalInputsProps) {
  return (
    <div>
      <FieldLabel htmlFor="antibiotic-start-date">抗菌薬服用開始日</FieldLabel>
      <DateInput
        id="antibiotic-start-date"
        value={state.antibioticStartDate}
        onChange={(v) => onUpdate({ antibioticStartDate: v })}
      />
      <p className="mt-1 text-xs text-muted">
        処方された抗菌薬を最初に飲んだ日
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result panel
// ---------------------------------------------------------------------------

interface ResultPanelProps {
  readonly returnDate: Date | null;
  readonly config: DiseaseConfig;
  readonly isStreptococcal: boolean;
}

function ResultPanel({ returnDate, config, isStreptococcal }: ResultPanelProps) {
  if (!returnDate) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-white/60 px-5 py-4 text-sm text-muted">
        <CalendarDays className="h-5 w-5 shrink-0 text-border" />
        <span>日付を入力すると登園可能日が表示されます</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border-2 p-5 ${config.color.result} ${config.color.border}`}
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${config.color.icon}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted">登園・登校可能日</p>
          <p className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
            {formatResultDate(returnDate)}から
          </p>
          <p className="mt-0.5 text-sm font-medium">登園できます</p>

          {isStreptococcal && (
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/70 px-3 py-2.5 text-xs leading-relaxed text-muted">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
              <span>
                かつ解熱・症状改善後であることが条件です。
                この日付はあくまで抗菌薬開始後1日を計算したものです。
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ExclusionCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  function updateState(partial: Partial<CalculatorState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function handleDiseaseSelect(id: DiseaseId) {
    setState({ ...INITIAL_STATE, selectedDisease: id });
  }

  const selectedConfig =
    DISEASE_CONFIGS.find((d) => d.id === state.selectedDisease) ??
    DISEASE_CONFIGS[0];

  const returnDate = computeReturnDate(state);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      {/* Disease selector */}
      <div className="border-b border-border px-5 py-5 sm:px-6">
        <p className="mb-3 text-sm font-semibold text-foreground">
          感染症を選んでください
        </p>
        <div className="flex flex-wrap gap-2">
          {DISEASE_CONFIGS.map((config) => (
            <button
              key={config.id}
              type="button"
              onClick={() => handleDiseaseSelect(config.id)}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ring-inset transition-all ${
                state.selectedDisease === config.id
                  ? config.color.badge
                  : "bg-white text-muted ring-border hover:ring-border"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="px-5 py-6 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Left: inputs */}
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className={`h-4 w-4 ${selectedConfig.color.icon}`} />
              日付を入力
            </p>

            {state.selectedDisease === "influenza" && (
              <InfluenzaInputs state={state} onUpdate={updateState} />
            )}
            {state.selectedDisease === "measles" && (
              <MeaslesInputs state={state} onUpdate={updateState} />
            )}
            {state.selectedDisease === "mumps" && (
              <MumpsInputs state={state} onUpdate={updateState} />
            )}
            {state.selectedDisease === "pharyngoconjunctival" && (
              <PharyngoconjunctivalInputs state={state} onUpdate={updateState} />
            )}
            {state.selectedDisease === "streptococcal" && (
              <StreptococcalInputs state={state} onUpdate={updateState} />
            )}
          </div>

          {/* Right: result */}
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2
                className={`h-4 w-4 ${selectedConfig.color.icon}`}
              />
              登園可能日
            </p>

            <ResultPanel
              returnDate={returnDate}
              config={selectedConfig}
              isStreptococcal={state.selectedDisease === "streptococcal"}
            />

            {/* Rule basis */}
            <div className="rounded-lg border border-border bg-stone-50 px-4 py-3">
              <p className="text-xs font-semibold text-stone-600">根拠</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {selectedConfig.ruleBasis}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800">
            <strong className="font-semibold">最終判断は医師にご確認ください。</strong>
            この計算機は法令上の基準を目安として表示するものです。
            お子さんの状態・検査結果・園の規則によって異なる場合があります。
          </p>
        </div>
      </div>
    </div>
  );
}
