import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAllSymptoms, getSymptomBySlug } from "@/lib/triage/engine"
import { TriageFlow } from "@/components/triage/triage-flow"

interface PageProps {
  readonly params: Promise<{ symptom: string }>
}

export async function generateStaticParams() {
  const symptoms = getAllSymptoms()
  return symptoms.map((s) => ({
    symptom: s.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { symptom: slug } = await params
  const symptom = getSymptomBySlug(slug)
  if (!symptom) return { title: "症状が見つかりません" }

  return {
    title: `${symptom.name} - 症状チェック`,
    description: symptom.description,
  }
}

export default async function TriageSymptomPage({ params }: PageProps) {
  const { symptom: slug } = await params
  const symptom = getSymptomBySlug(slug)

  if (!symptom) {
    notFound()
  }

  return <TriageFlow symptom={symptom} />
}
