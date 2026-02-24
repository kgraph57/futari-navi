import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { VaccinationStep } from "@/lib/types";

interface StepsGuideProps {
  readonly steps: readonly VaccinationStep[];
}

export function StepsGuide({ steps }: StepsGuideProps) {
  return (
    <div className="relative space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={step.step} className="relative flex gap-4 pb-8">
            {!isLast && (
              <div
                className="absolute left-[19px] top-10 h-[calc(100%-24px)] w-0.5 bg-sage-200"
                aria-hidden="true"
              />
            )}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sage-400 bg-white text-sm font-bold text-sage-700">
              {step.step}
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-heading text-base font-semibold text-foreground">
                {step.title}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
              {step.where && (
                <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                  <WatercolorIcon name="mappin" size={12} />
                  {step.where}
                </p>
              )}
              {step.tip && (
                <div className="mt-3 rounded-lg border border-sage-200 bg-sage-50 p-3">
                  <p className="flex items-start gap-1.5 text-xs leading-relaxed text-sage-800">
                    <WatercolorIcon name="lightbulb" size={12} className="mt-0.5 .5 .5 shrink-0" />
                    {step.tip}
                  </p>
                </div>
              )}
              {step.url && (
                <Link
                  href={step.url}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
                >
                  詳しく見る
                  <WatercolorIcon name="external" size={12} />
                </Link>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-3 rounded-lg border border-sage-200 bg-sage-50 p-4">
        <WatercolorIcon name="check" size={20} className="shrink-0 text-sage-600" />
        <p className="text-sm font-medium text-sage-800">
          すべての定期接種を完了すると、お子さんは主要な感染症から守られます。
        </p>
      </div>
    </div>
  );
}
