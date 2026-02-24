"use client"

;

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import type { VaccinationFaq, VaccinationFaqCategory } from "@/lib/types";
import { FAQ_CATEGORY_LABELS } from "@/lib/vaccinations";

interface FaqSectionProps {
  readonly faqs: readonly VaccinationFaq[];
}

const CATEGORY_ORDER: readonly VaccinationFaqCategory[] = [
  "schedule",
  "safety",
  "side-effects",
  "practical",
] as const;

const CATEGORY_COLORS: Record<VaccinationFaqCategory, string> = {
  schedule: "bg-blue-50 text-blue-700 border-blue-200",
  safety: "bg-sage-50 text-sage-700 border-sage-200",
  "side-effects": "bg-amber-50 text-amber-700 border-amber-200",
  practical: "bg-purple-50 text-purple-700 border-purple-200",
} as const;

function FaqItem({ faq }: { readonly faq: VaccinationFaq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-ivory-50"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <WatercolorIcon name="help" size={16} className="mt-0.5   shrink-0 text-sage-500" />
        <span className="flex-1 text-sm font-medium text-foreground">
          {faq.question}
        </span>
        <WatercolorIcon name="arrow_right" size={16} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pl-11">
          <p className="text-sm leading-relaxed text-muted">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const groupedFaqs = CATEGORY_ORDER.map((category) => ({
    category,
    label: FAQ_CATEGORY_LABELS[category],
    color: CATEGORY_COLORS[category],
    items: faqs.filter((f) => f.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-6">
      {groupedFaqs.map((group) => (
        <div
          key={group.category}
          className="overflow-hidden rounded-xl border border-border"
        >
          <div className="border-b border-border bg-ivory-50 px-4 py-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${group.color}`}
            >
              {group.label}
            </span>
          </div>
          {group.items.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}
        </div>
      ))}
    </div>
  );
}
