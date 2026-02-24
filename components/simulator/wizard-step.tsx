"use client"

import { WatercolorIcon } from "@/components/icons/watercolor-icon";
interface WizardStepProps {
  readonly currentStep: number
  readonly totalSteps: number
  readonly stepLabels: readonly string[]
}

export function WizardStep({
  currentStep,
  totalSteps,
  stepLabels,
}: WizardStepProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isFuture = stepNumber > currentStep

          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    isCompleted
                      ? "bg-sage-600 text-white"
                      : isCurrent
                        ? "bg-sage-600 text-white ring-4 ring-sage-100"
                        : "bg-ivory-200 text-muted"
                  }`}
                >
                  {isCompleted ? (
                    <WatercolorIcon name="check" size={16} />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    isCurrent
                      ? "text-sage-700"
                      : isFuture
                        ? "text-muted"
                        : "text-sage-600"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < totalSteps - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    isCompleted ? "bg-sage-500" : "bg-ivory-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ivory-200">
        <div
          className="h-full rounded-full bg-sage-500 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
