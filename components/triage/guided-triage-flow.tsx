"use client";

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useRouter } from "next/navigation";
import { SEVERITY_CONFIG } from "@/lib/triage/engine";
import type { SeverityResult } from "@/lib/triage/engine";
import guidedData from "@/data/guided-triage.json";
import {
  trackTriageStarted,
  trackTriageEmergencyAnswer,
  trackTriageAgeSelected,
  trackTriageSymptomSelected,
  trackTriageResultViewed,
} from "@/lib/analytics/events";

type GuidedStep =
  | "emergency-screening"
  | "age-select"
  | "symptom-group"
  | "sub-symptom"
  | "result";

interface EmergencyQuestion {
  readonly id: string;
  readonly text: string;
  readonly helpText: string;
  readonly yesResult: SeverityResult;
}

interface AgeGroup {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

interface SymptomGroup {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
  readonly symptomSlugs: readonly string[];
}

import type { WatercolorIconName } from "@/components/icons/watercolor-icon";

const ICON_MAP: Record<string, WatercolorIconName> = {
  Thermometer: "activity",
  Droplets: "heart",
  Wind: "activity",
  CircleDot: "alert",
  AlertTriangle: "alert",
  Stethoscope: "stethoscope",
  Frown: "help",
  Eye: "stethoscope",
  Zap: "sparkles",
};

const AGE_ICONS: WatercolorIconName[] = ["baby", "baby", "baby", "baby"];

const emergencyQuestions =
  guidedData.emergencyScreening as readonly EmergencyQuestion[];
const ageGroups = guidedData.ageGroups as readonly AgeGroup[];
const symptomGroups = guidedData.symptomGroups as readonly SymptomGroup[];
const ageOverrides = guidedData.ageOverrides as Record<
  string,
  Record<string, SeverityResult>
>;

const STEP_LABELS: Record<GuidedStep, string> = {
  "emergency-screening": "緊急確認",
  "age-select": "年齢の選択",
  "symptom-group": "症状の選択",
  "sub-symptom": "症状の詳細",
  result: "判定結果",
};

const STEP_ORDER: readonly GuidedStep[] = [
  "emergency-screening",
  "age-select",
  "symptom-group",
  "sub-symptom",
  "result",
];

function getStepProgress(step: GuidedStep, screeningIndex: number): number {
  if (step === "emergency-screening") {
    return Math.round(((screeningIndex + 1) / emergencyQuestions.length) * 20);
  }
  const index = STEP_ORDER.indexOf(step);
  return Math.min(100, 20 + index * 20);
}

function MinatoEmergencyInfo({
  severity,
}: {
  readonly severity: SeverityResult["severity"];
}) {
  if (severity !== "emergency" && severity !== "call-8000") return null;

  return (
    <div className="mt-4 rounded-lg border border-red-200 bg-white p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-red-700">
        <WatercolorIcon name="alert" size={14} />
        港区の夜間・休日救急
      </h3>
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground">港区夜間小児初期救急</span>
          <a
            href="tel:03-3436-5765"
            className="font-bold text-red-600 underline"
          >
            03-3436-5765
          </a>
        </div>
        <p className="text-xs text-muted">
          みなと保健所（三田1-4-10）平日19:30-22:30
        </p>
        <div className="flex justify-between">
          <span className="text-foreground">東京都こども医療ガイド</span>
          <a
            href="https://www.guide.metro.tokyo.lg.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-red-600 underline"
          >
            Web検索
          </a>
        </div>
      </div>
    </div>
  );
}

function SupervisionBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-3 py-1">
      <WatercolorIcon name="stethoscope" size={14} className="text-sage-600" />
      <span className="text-xs font-medium text-sage-700">小児科医監修</span>
    </div>
  );
}

function InlineResult({
  result,
  onReset,
}: {
  readonly result: SeverityResult;
  readonly onReset: () => void;
}) {
  const config = SEVERITY_CONFIG[result.severity];

  return (
    <div className="space-y-6">
      <div
        className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} p-6`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-sm font-bold ${config.color} ${config.bgColor} ${config.borderColor}`}
          >
            {config.label}
          </span>
          {config.phone && (
            <a
              href={`tel:${config.phone}`}
              className={`inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-sm font-bold ${config.color} ${config.borderColor}`}
            >
              <WatercolorIcon name="phone" size={12} />
              {config.phone}
            </a>
          )}
          <SupervisionBadge />
        </div>

        <h2
          className={`mt-4 font-heading text-xl font-semibold ${config.color}`}
        >
          {result.title}
        </h2>

        <div className="mt-3 rounded-lg border border-border bg-white/60 p-3">
          <h3 className="text-xs font-bold text-muted">判断の根拠</h3>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            {result.description}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-bold text-foreground">対応方法</h3>
          <ul className="mt-2 space-y-2">
            {result.actions.map((action, index) => (
              <li key={index} className="flex gap-2 text-sm">
                <span className={`mt-0.5 shrink-0 font-bold ${config.color}`}>
                  {index + 1}.
                </span>
                <span className="text-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <MinatoEmergencyInfo severity={result.severity} />
      </div>

      <div className="flex gap-2 rounded-lg border border-border bg-ivory-50 p-4">
        <WatercolorIcon
          name="alert"
          size={16}
          className="shrink-0 text-muted"
        />
        <p className="text-xs leading-relaxed text-muted">
          この判定は医師の診断に代わるものではありません。あくまで受診の目安としてご利用ください。心配な場合はいつでも医療機関にご相談ください。
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
      >
        <WatercolorIcon name="star" size={16} />
        最初からやり直す
      </button>
    </div>
  );
}

export function GuidedTriageFlow() {
  const router = useRouter();
  const [step, setStep] = useState<GuidedStep>("emergency-screening");
  const [screeningIndex, setScreeningIndex] = useState(0);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SymptomGroup | null>(null);
  const [result, setResult] = useState<SeverityResult | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const progress = result ? 100 : getStepProgress(step, screeningIndex);
  const currentScreening = emergencyQuestions[screeningIndex];

  const handleEmergencyAnswer = (answer: "yes" | "no") => {
    if (!currentScreening) return;
    trackTriageEmergencyAnswer(currentScreening.id, answer);

    if (answer === "yes") {
      setResult(currentScreening.yesResult);
      setStep("result");
      trackTriageResultViewed("emergency", currentScreening.yesResult.severity);
      return;
    }

    const nextIndex = screeningIndex + 1;
    if (nextIndex < emergencyQuestions.length) {
      setScreeningIndex(nextIndex);
      setShowHelp(false);
    } else {
      setStep("age-select");
      setShowHelp(false);
    }
  };

  const handleAgeSelect = (ageId: string) => {
    trackTriageAgeSelected(ageId);
    setSelectedAge(ageId);
    setStep("symptom-group");
  };

  const handleSymptomGroupSelect = (group: SymptomGroup) => {
    trackTriageSymptomSelected(group.id);
    setSelectedGroup(group);

    // Check for age override
    if (selectedAge && ageOverrides[selectedAge]) {
      const overrideForGroup = ageOverrides[selectedAge][group.id];
      if (overrideForGroup) {
        setResult(overrideForGroup);
        setStep("result");
        return;
      }
    }

    // If group has exactly 1 symptom slug → go straight to triage flow
    if (group.symptomSlugs.length === 1) {
      router.push(`/triage/${group.symptomSlugs[0]}`);
      return;
    }

    // Multiple slugs → show sub-symptom selection
    setStep("sub-symptom");
  };

  const handleSubSymptomSelect = (slug: string) => {
    router.push(`/triage/${slug}`);
  };

  const handleReset = () => {
    setStep("emergency-screening");
    setScreeningIndex(0);
    setSelectedAge(null);
    setSelectedGroup(null);
    setResult(null);
    setShowHelp(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      {/* Progress bar */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {STEP_LABELS[step]}
          </span>
          <span className="text-muted">{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-ivory-100">
          <div
            className="h-full rounded-full bg-sage-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step breadcrumbs */}
        <div className="mt-2 flex items-center gap-1 text-xs text-muted">
          {STEP_ORDER.slice(0, -1).map((s, i) => {
            const isActive = STEP_ORDER.indexOf(step) >= i;
            const isCurrent = step === s;
            return (
              <span key={s} className="flex items-center gap-1">
                {i > 0 && <WatercolorIcon name="arrow_right" size={12} />}
                <span
                  className={
                    isCurrent
                      ? "font-medium text-sage-600"
                      : isActive
                        ? "text-foreground"
                        : ""
                  }
                >
                  {STEP_LABELS[s]}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* STEP: Emergency Screening */}
        {step === "emergency-screening" && currentScreening && (
          <div className="space-y-5">
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <WatercolorIcon
                name="alert"
                size={20}
                className="shrink-0 text-red-600"
              />
              <div>
                <p className="text-sm font-medium text-red-800">
                  まず緊急性の確認をします
                </p>
                <p className="mt-0.5 text-xs text-red-600">
                  質問 {screeningIndex + 1} / {emergencyQuestions.length}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                {currentScreening.text}
              </h3>

              {showHelp && (
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm leading-relaxed text-blue-800">
                    {currentScreening.helpText}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowHelp((prev) => !prev)}
                className="mt-3 inline-flex items-center gap-1 text-xs text-muted hover:text-sage-600"
              >
                <WatercolorIcon name="help" size={12} className=".5 .5" />
                {showHelp ? "ヒントを閉じる" : "判断のヒント"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleEmergencyAnswer("yes")}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-6 py-4 text-base font-bold text-red-700 transition-all hover:border-red-300 hover:bg-red-100"
              >
                <WatercolorIcon name="check" size={20} />
                はい
              </button>
              <button
                type="button"
                onClick={() => handleEmergencyAnswer("no")}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-sage-200 bg-sage-50 px-6 py-4 text-base font-bold text-sage-700 transition-all hover:border-sage-300 hover:bg-sage-100"
              >
                <WatercolorIcon name="star" size={20} />
                いいえ
              </button>
            </div>
          </div>
        )}

        {/* STEP: Age Selection */}
        {step === "age-select" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                お子さんの年齢を選んでください
              </h3>
              <p className="mt-1 text-sm text-muted">
                年齢によって受診の目安が変わります
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((ag, index) => (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => handleAgeSelect(ag.id)}
                  className="flex flex-col items-center gap-2 rounded-xl border-2 border-border bg-white p-4 transition-all hover:border-sage-300 hover:bg-sage-50 hover:shadow-sm"
                >
                  {AGE_ICONS[index] && (
                    <WatercolorIcon
                      name="baby"
                      size={24}
                      className="text-sage-600"
                    />
                  )}
                  <span className="text-base font-bold text-foreground">
                    {ag.label}
                  </span>
                  <span className="text-xs text-muted">{ag.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: Symptom Group Selection */}
        {step === "symptom-group" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                一番気になる症状を選んでください
              </h3>
              <p className="mt-1 text-sm text-muted">
                当てはまるものをひとつ選んでください
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {symptomGroups.map((group) => {
                const iconName = ICON_MAP[group.icon] ?? "stethoscope";
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleSymptomGroupSelect(group)}
                    className="flex items-start gap-3 rounded-xl border-2 border-border bg-white p-4 text-left transition-all hover:border-sage-300 hover:bg-sage-50 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-50">
                      <WatercolorIcon name={iconName} size={20} />
                    </div>
                    <div>
                      <span className="text-base font-bold text-foreground">
                        {group.label}
                      </span>
                      <p className="mt-0.5 text-xs text-muted">
                        {group.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP: Sub-symptom Selection */}
        {step === "sub-symptom" && selectedGroup && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-white p-5">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                もう少し詳しく教えてください
              </h3>
              <p className="mt-1 text-sm text-muted">
                「{selectedGroup.label}
                」のうち、もっとも当てはまるものを選んでください
              </p>
            </div>

            <div className="grid gap-3">
              {selectedGroup.symptomSlugs.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => handleSubSymptomSelect(slug)}
                  className="flex items-center gap-3 rounded-xl border-2 border-border bg-white p-4 text-left transition-all hover:border-sage-300 hover:bg-sage-50 hover:shadow-sm"
                >
                  <WatercolorIcon
                    name="arrow_right"
                    size={20}
                    className="shrink-0 text-sage-600"
                  />
                  <span className="text-base font-medium text-foreground">
                    {formatSlugLabel(slug)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP: Result (Emergency/Age Override) */}
        {step === "result" && result && (
          <InlineResult result={result} onReset={handleReset} />
        )}

        {/* Back / Reset buttons */}
        {step !== "result" && step !== "emergency-screening" && (
          <div className="mt-6 border-t border-border pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
            >
              <WatercolorIcon name="star" size={12} className=".5 .5" />
              最初からやり直す
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Map symptom slug to a human-readable Japanese label */
function formatSlugLabel(slug: string): string {
  const SLUG_LABELS: Record<string, string> = {
    fever: "発熱",
    vomiting: "嘔吐（吐いた）",
    diarrhea: "下痢",
    cough: "咳",
    "breathing-difficulty": "呼吸が苦しそう",
    rash: "発疹・ブツブツ",
    "allergic-reaction": "アレルギー反応",
    "head-injury": "頭を打った",
    burn: "やけど",
    "accidental-ingestion": "誤飲・誤食",
    "abdominal-pain": "腹痛",
    headache: "頭痛",
    "ear-pain": "耳が痛い",
    "sore-throat": "のどが痛い",
    "eye-symptoms": "目の症状",
    seizure: "けいれん",
    nosebleed: "鼻血",
  };
  return SLUG_LABELS[slug] ?? slug;
}
