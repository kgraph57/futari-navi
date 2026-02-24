import type {
  VaccinationStep,
  VaccinationFaq,
  VaccinationFaqCategory,
  VaccinationEvidence,
} from "./types";
import vaccinationsData from "@/data/vaccinations.json";

interface VaccinationGuideData {
  readonly steps: readonly VaccinationStep[];
  readonly faq: readonly VaccinationFaq[];
  readonly evidence: readonly VaccinationEvidence[];
}

const data = vaccinationsData as unknown as VaccinationGuideData;

export function getVaccinationSteps(): readonly VaccinationStep[] {
  return data.steps;
}

export function getVaccinationFaqs(): readonly VaccinationFaq[] {
  return data.faq;
}

export function getVaccinationEvidence(): readonly VaccinationEvidence[] {
  return data.evidence;
}

export const FAQ_CATEGORY_LABELS: Record<VaccinationFaqCategory, string> = {
  schedule: "スケジュール",
  safety: "安全性",
  "side-effects": "副反応",
  practical: "実践的な質問",
} as const;
