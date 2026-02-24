import checklistsData from "@/data/checklists.json"

export interface ChecklistItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly deadline: string | null
  readonly where: string
  readonly documents: readonly string[]
  readonly relatedProgram: string | null
  readonly tips: string
}

export interface Checklist {
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly order: number
  readonly items: readonly ChecklistItem[]
}

export function getAllChecklists(): readonly Checklist[] {
  return ([...checklistsData] as Checklist[]).sort(
    (a, b) => a.order - b.order
  )
}

export function getChecklistBySlug(slug: string): Checklist | null {
  const found = checklistsData.find(
    (c: { slug: string }) => c.slug === slug
  )
  return (found as Checklist) ?? null
}
