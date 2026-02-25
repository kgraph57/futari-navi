"use client"

import { useState, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useRouter } from "next/navigation";
import { WizardStep } from "@/components/simulator/wizard-step";
import type { IncomeRange } from "@/lib/types";
import {
  trackSimulatorStarted,
  trackSimulatorStepCompleted,
  trackSimulatorSubmitted,
} from "@/lib/analytics/events";

const STEP_LABELS = ["結婚情報", "世帯情報", "確認"] as const;
const TOTAL_STEPS = 3;

const INCOME_OPTIONS: readonly { value: IncomeRange; label: string }[] = [
  { value: "under-300", label: "300万円未満" },
  { value: "300-500", label: "300〜500万円" },
  { value: "500-700", label: "500〜700万円" },
  { value: "700-1000", label: "700〜1,000万円" },
  { value: "over-1000", label: "1,000万円以上" },
] as const;

interface FormState {
  readonly marriageDate: string;
  readonly partnerAAge: number;
  readonly partnerBAge: number;
  readonly householdIncome: IncomeRange;
  readonly isMoving: boolean;
  readonly nameChanged: boolean;
}

const INITIAL_STATE: FormState = {
  marriageDate: "",
  partnerAAge: 30,
  partnerBAge: 30,
  householdIncome: "500-700",
  isMoving: false,
  nameChanged: false,
};

export default function SimulatorStartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

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
        return form.marriageDate !== "" && form.partnerAAge > 0 && form.partnerBAge > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  const handleSubmit = useCallback(() => {
    trackSimulatorSubmitted();
    const params = new URLSearchParams();
    params.set("data", btoa(encodeURIComponent(JSON.stringify(form))));
    router.push(`/simulator/results?${params.toString()}`);
  }, [form, router]);

  const formatIncome = (income: IncomeRange): string => {
    const found = INCOME_OPTIONS.find((o) => o.value === income);
    return found?.label ?? income;
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
                <WatercolorIcon name="heart" size={24} />
                <h2 className="font-heading text-xl font-semibold">
                  結婚情報
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted">
                結婚予定日とおふたりの年齢を教えてください。
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="marriageDate"
                    className="block text-sm font-medium text-card-foreground"
                  >
                    結婚予定日
                  </label>
                  <input
                    id="marriageDate"
                    type="date"
                    value={form.marriageDate}
                    onChange={(e) => updateField("marriageDate", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="partnerAAge"
                    className="block text-sm font-medium text-card-foreground"
                  >
                    パートナーAの年齢
                  </label>
                  <input
                    id="partnerAAge"
                    type="number"
                    min={18}
                    max={100}
                    value={form.partnerAAge}
                    onChange={(e) =>
                      updateField("partnerAAge", Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="partnerBAge"
                    className="block text-sm font-medium text-card-foreground"
                  >
                    パートナーBの年齢
                  </label>
                  <input
                    id="partnerBAge"
                    type="number"
                    min={18}
                    max={100}
                    value={form.partnerBAge}
                    onChange={(e) =>
                      updateField("partnerBAge", Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-sage-500 focus:ring-2 focus:ring-sage-100"
                  />
                </div>
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
                世帯年収と引越し・姓変更の予定を教えてください。
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
                    引越し予定
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField("isMoving", true)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        form.isMoving
                          ? "border-sage-500 bg-sage-50 text-sage-700"
                          : "border-border bg-white text-foreground hover:border-sage-200"
                      }`}
                    >
                      あり
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("isMoving", false)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        !form.isMoving
                          ? "border-sage-500 bg-sage-50 text-sage-700"
                          : "border-border bg-white text-foreground hover:border-sage-200"
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground">
                    姓変更予定
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField("nameChanged", true)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        form.nameChanged
                          ? "border-sage-500 bg-sage-50 text-sage-700"
                          : "border-border bg-white text-foreground hover:border-sage-200"
                      }`}
                    >
                      あり
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("nameChanged", false)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        !form.nameChanged
                          ? "border-sage-500 bg-sage-50 text-sage-700"
                          : "border-border bg-white text-foreground hover:border-sage-200"
                      }`}
                    >
                      なし
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 text-sage-700">
                <WatercolorIcon name="clipboard" size={24} />
                <h2 className="font-heading text-xl font-semibold">
                  入力内容の確認
                </h2>
              </div>
              <p className="mt-2 text-sm text-muted">
                以下の内容でチェックを実行します。
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-border bg-ivory-50 p-4">
                  <h3 className="text-sm font-bold text-muted">結婚情報</h3>
                  <div className="mt-2 space-y-1 text-sm text-card-foreground">
                    <p>結婚予定日: {form.marriageDate || "未入力"}</p>
                    <p>パートナーAの年齢: {form.partnerAAge}歳</p>
                    <p>パートナーBの年齢: {form.partnerBAge}歳</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-ivory-50 p-4">
                  <h3 className="text-sm font-bold text-muted">世帯情報</h3>
                  <div className="mt-2 space-y-1 text-sm text-card-foreground">
                    <p>世帯年収: {formatIncome(form.householdIncome)}</p>
                    <p>引越し予定: {form.isMoving ? "あり" : "なし"}</p>
                    <p>姓変更予定: {form.nameChanged ? "あり" : "なし"}</p>
                  </div>
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
                className="flex items-center gap-2 rounded-full bg-sage-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sage-700"
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
