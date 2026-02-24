import triageData from "@/data/triage.json"

export interface SeverityResult {
  readonly severity: "emergency" | "call-8000" | "next-day" | "home-care"
  readonly title: string
  readonly description: string
  readonly actions: readonly string[]
}

export interface TriageQuestion {
  readonly id: string
  readonly text: string
  readonly helpText: string
  readonly yesResult: SeverityResult | string
  readonly noResult: SeverityResult | string
}

export interface TriageSymptom {
  readonly slug: string
  readonly name: string
  readonly icon: string
  readonly description: string
  readonly ageNote: string
  readonly questions: readonly TriageQuestion[]
}

export function getAllSymptoms(): readonly TriageSymptom[] {
  return triageData as readonly TriageSymptom[]
}

export function getSymptomBySlug(slug: string): TriageSymptom | null {
  const found = triageData.find((s: { slug: string }) => s.slug === slug)
  return (found as TriageSymptom) ?? null
}

export function getQuestionById(
  symptom: TriageSymptom,
  questionId: string
): TriageQuestion | null {
  const found = symptom.questions.find(
    (q: { id: string }) => q.id === questionId
  )
  return (found as TriageQuestion) ?? null
}

export const SEVERITY_CONFIG: Record<
  SeverityResult["severity"],
  {
    readonly label: string
    readonly color: string
    readonly bgColor: string
    readonly borderColor: string
    readonly phone: string | null
  }
> = {
  emergency: {
    label: "緊急",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    phone: "119",
  },
  "call-8000": {
    label: "電話相談",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    phone: "#8000",
  },
  "next-day": {
    label: "翌日受診",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    phone: null,
  },
  "home-care": {
    label: "自宅ケア",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    phone: null,
  },
} as const
