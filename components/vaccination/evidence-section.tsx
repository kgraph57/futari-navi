import type { VaccinationEvidence } from "@/lib/types";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface EvidenceSectionProps {
  readonly evidence: readonly VaccinationEvidence[];
}

export function EvidenceSection({ evidence }: EvidenceSectionProps) {
  return (
    <div className="space-y-4">
      {evidence.map((item) => (
        <div
          key={item.claim}
          className="rounded-xl border border-sage-200 bg-sage-50/50 p-5"
        >
          <div className="flex items-start gap-3">
            <WatercolorIcon name="shield" size={20} className="mt-0.5   shrink-0 text-sage-600" />
            <div className="flex-1">
              <h4 className="font-heading text-sm font-semibold text-sage-800">
                {item.claim}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.evidence}
              </p>
              <p className="mt-3 text-xs text-muted">
                出典:{" "}
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sage-600 underline hover:text-sage-700"
                  >
                    {item.source}
                    <WatercolorIcon name="external" size={12} />
                  </a>
                ) : (
                  <span>{item.source}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
