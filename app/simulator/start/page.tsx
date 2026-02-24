"use client"

;

import { useState, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useRouter } from "next/navigation";
import { WizardStep } from "@/components/simulator/wizard-step";
import type { ChildInfo, IncomeRange } from "@/lib/types";
import {
  trackSimulatorStarted,
  trackSimulatorStepCompleted,
  trackSimulatorSubmitted,
} from "@/lib/analytics/events";

const STEP_LABELS = ["お子さん", "世帯情報", "お住まい", "確認"] as const;
const TOTAL_STEPS = 4;

const CARE_TYPE_OPTIONS = [
  { value: "home", label: "自宅保育" },
  { value: "nursery", label: "保育園" },
  { value: "kindergarten", label: "幼稚園" },
  { value: "school", label: "学校（小学生以上）" },
] as const;

const INCOME_OPTIONS: readonly { value: IncomeRange; label: string }[] = [
  { value: "under-300", label: "300万円未満" },
  { value: "300-500", label: "300〜500万円" },
  { value: "500-700", label: "500〜700万円" },
  { value: "700-1000", label: "700〜1,000万円" },
  { value: "over-1000", label: "1,000万円以上" },
] as const;

const HOUSEHOLD_TYPE_OPTIONS = [
  { value: "two-parent", label: "ふたり親世帯" },
  { value: "single-parent", label: "ひとり親世帯" },
] as const;

const WORK_STATUS_OPTIONS = [
  { value: "both-working", label: "共働き" },
  { value: "one-working", label: "片方が就労" },
  { value: "neither", label: "どちらも非就労" },
] as const;

const DISTRICT_OPTIONS = [
  "芝地区",
  "麻布地区",
  "赤坂地区",
  "高輪地区",
  "芝浦港南地区",
  "台場地区",
] as const;

interface FormState {
  readonly children: readonly ChildInfo[];
  readonly householdIncome: IncomeRange;
  readonly householdType: "two-parent" | "single-parent";
  readonly workStatus: "both-working" | "one-working" | "neither";
  readonly district: string;
}

const INITIAL_CHILD: ChildInfo = {
  birthDate: "",
  careType: "home",
};

const INITIAL_STATE: FormState = {
  children: [INITIAL_CHILD],
  householdIncome: "500-700",
  householdType: "two-parent",
  workStatus: "both-working",
  district: "芝地区",
};

export default function SimulatorStartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  const addChild = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      children: [...prev.children, INITIAL_CHILD],
    }));
  }, []);

  const removeChild = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  }, []);

  const updateChild = useCallback(
    (index: number, field: keyof ChildInfo, value: string) => {
      setForm((prev) => ({
        ...prev,
        children: prev.children.map((child, i) =>
          i === index ? { ...child, [field]: value } : child,
        ),
      }));
    },
    [],
  );

  const updateField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const goNext = useCallback(() => {
    trackSimulatorStepCompleted(step, STEP_LABELS[step - 1]);
    if (step === 1) trackSimulatorStarted();
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  }, [step]);

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return form.children.every((child) => child.birthDate !== "");
      case 2:
        return true;
      case 3:
        return form.district !== "";
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  const handleSubmit = useCallback(() => {
    trackSimulatorSubmitted(form.children.length);
    const params = new URLSearchParams();
    params.set("data", btoa(encodeURIComponent(JSON.stringify(form))));
    router.push(`/simulator/results?${params.toString()}`);
  }, [form, router]);

  const formatCareType = (type: string): string => {
    const found = CARE_TYPE_OPTIONS.find((o) => o.value === type);
    return found?.label ?? type;
  };

  const formatIncome = (income: IncomeRange): string => {
    const found = INCOME_OPTIONS.find((o) => o.value === income);
    return found?.label ?? income;
  };

  const formatHouseholdType = (type: string): string => {
    const found = HOUSEHOLD_TYPE_OPTIONS.find((o) => o.value === type);
    return found?.label ?? type;
  };

  const formatWorkStatus = (status: string): string => {
    const found = WORK_STATUS_OPTIONS.find((o) => o.value === status);
    return found?.label ?? status;
  };

  return (
    <div className="min-h-screen bg-ivory-50 px-4 pb-16 pt-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <WizardStep
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            stepLabels={STEP_LABELS}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 text-sage-700">
                <WatercolorIcon name="baby" size={24} />
                <h2 className="font-heading text-xl font-semibold">
                  お子さんの情報
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted">
                お子さんの生年月日と保育状況を教えてください。
              </p>

              <div className="mt-6 space-y-6">
                {form.children.map((child, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-ivory-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-sm font-semibold text-card-foreground">
                        {index + 1}人目のお子さん
                      </h3>
                      {form.children.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChild(index)}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-50"
                        >
                          <WatercolorIcon name="plus" size={12} className=".5 .5" />
                          削除
                        </button>
                      )}
                    </div>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor={`birthDate-${index}`}
                          className="block text-sm font-medium text-card-foreground"
                        >
                          生年月日
                        </label>
                        <input
                          id={`birthDate-${index}`}
                          type="date"
                          value={child.birthDate}
                          onChange={(e) =>
                            updateChild(index, "birthDate", e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`careType-${index}`}
                          className="block text-sm font-medium text-card-foreground"
                        >
                          保育状況
                        </label>
                        <select
                          id={`careType-${index}`}
                          value={child.careType}
                          onChange={(e) =>
                            updateChild(index, "careType", e.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
                        >
                          {CARE_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addChild}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted transition-colors hover:border-sage-300 hover:text-sage-600"
                >
                  <WatercolorIcon name="plus" size={16} />
                  お子さんを追加
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 text-sage-700">
                <WatercolorIcon name="home" size={24} />
                <h2 className="font-heading text-xl font-semibold">世帯情報</h2>
              </div>
              <p className="mt-2 text-sm text-muted">
                世帯の収入帯と家族構成を教えてください。
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground">
                    世帯年収（税込み目安）
                  </label>
                  <div className="mt-2 space-y-2">
                    {INCOME_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                          form.householdIncome === option.value
                            ? "border-sage-500 bg-sage-50 text-sage-700"
                            : "border-border bg-white text-foreground hover:border-sage-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="income"
                          value={option.value}
                          checked={form.householdIncome === option.value}
                          onChange={(e) =>
                            updateField(
                              "householdIncome",
                              e.target.value as IncomeRange,
                            )
                          }
                          className="h-4 w-4 accent-sage-600"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground">
                    世帯タイプ
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {HOUSEHOLD_TYPE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                          form.householdType === option.value
                            ? "border-sage-500 bg-sage-50 text-sage-700"
                            : "border-border bg-white text-foreground hover:border-sage-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="householdType"
                          value={option.value}
                          checked={form.householdType === option.value}
                          onChange={(e) =>
                            updateField(
                              "householdType",
                              e.target.value as "two-parent" | "single-parent",
                            )
                          }
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground">
                    就労状況
                  </label>
                  <div className="mt-2 space-y-2">
                    {WORK_STATUS_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                          form.workStatus === option.value
                            ? "border-sage-500 bg-sage-50 text-sage-700"
                            : "border-border bg-white text-foreground hover:border-sage-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="workStatus"
                          value={option.value}
                          checked={form.workStatus === option.value}
                          onChange={(e) =>
                            updateField(
                              "workStatus",
                              e.target.value as
                                | "both-working"
                                | "one-working"
                                | "neither",
                            )
                          }
                          className="h-4 w-4 accent-sage-600"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 text-sage-700">
                <WatercolorIcon name="mappin" size={24} />
                <h2 className="font-heading text-xl font-semibold">
                  お住まいの地区
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted">
                港区内のお住まいの地区を選択してください。
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {DISTRICT_OPTIONS.map((district) => (
                  <label
                    key={district}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-4 text-sm font-medium transition-colors ${
                      form.district === district
                        ? "border-sage-500 bg-sage-50 text-sage-700"
                        : "border-border bg-white text-foreground hover:border-sage-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="district"
                      value={district}
                      checked={form.district === district}
                      onChange={(e) => updateField("district", e.target.value)}
                      className="sr-only"
                    />
                    {district}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 text-sage-700">
                <WatercolorIcon name="clipboard" size={24} />
                <h2 className="font-heading text-xl font-semibold">
                  入力内容の確認
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted">
                以下の内容でシミュレーションを実行します。
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-border bg-ivory-50 p-4">
                  <h3 className="text-sm font-bold text-muted">
                    お子さん（{form.children.length}人）
                  </h3>
                  <div className="mt-2 space-y-2">
                    {form.children.map((child, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm text-card-foreground"
                      >
                        <span>
                          {index + 1}人目: {child.birthDate || "未入力"}
                        </span>
                        <span className="text-muted">
                          {formatCareType(child.careType)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-ivory-50 p-4">
                  <h3 className="text-sm font-bold text-muted">世帯情報</h3>
                  <div className="mt-2 space-y-1 text-sm text-card-foreground">
                    <p>世帯年収: {formatIncome(form.householdIncome)}</p>
                    <p>世帯タイプ: {formatHouseholdType(form.householdType)}</p>
                    <p>就労状況: {formatWorkStatus(form.workStatus)}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-ivory-50 p-4">
                  <h3 className="text-sm font-bold text-muted">お住まい</h3>
                  <p className="mt-2 text-sm text-card-foreground">
                    港区 {form.district}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-ivory-100 hover:text-foreground"
              >
                <WatercolorIcon name="arrow_right" size={16} />
                戻る
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 rounded-full bg-sage-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sage-700 disabled:bg-ivory-200 disabled:text-muted"
              >
                次へ
                <WatercolorIcon name="arrow_right" size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-full bg-blush-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blush-600"
              >
                結果を見る
                <WatercolorIcon name="arrow_right" size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          入力された情報はブラウザ上でのみ処理されます。サーバーへの送信は行われません。
        </p>
      </div>
    </div>
  );
}
