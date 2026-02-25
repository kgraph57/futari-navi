import type { Metadata } from "next"
import { SearchPageClient } from "./search-client"
import { getAllArticles } from "@/lib/content"
import { getAllPrograms } from "@/lib/programs"
import { getAllChecklists } from "@/lib/checklists"

export const metadata: Metadata = {
  title: "検索",
  description:
    "ふたりナビの記事・制度・チェックリストをキーワードで横断検索できます。",
}

interface QaPair {
  readonly question: string
  readonly answer: string
}

interface SearchArticleData {
  readonly type: "article"
  readonly slug: string
  readonly vol: number
  readonly title: string
  readonly description: string
  readonly category: string
  readonly publishedAt: string
  readonly keyPoints: readonly string[]
  readonly qaCount: number
  readonly qaPairs: readonly QaPair[]
}

interface SearchProgramData {
  readonly type: "program"
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly category: string
  readonly amountDescription: string
}

interface SearchChecklistData {
  readonly type: "checklist"
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly itemCount: number
}

export type SearchItem =
  | SearchArticleData
  | SearchProgramData
  | SearchChecklistData

function extractQaPairs(content: string): readonly QaPair[] {
  const lines = content.split("\n")
  const pairs: QaPair[] = []
  let currentQuestion: string | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const speakerMatch =
      trimmed.match(/^\*\*(.+?)\*\*[「『](.+)[」』]$/) ??
      trimmed.match(/^\*\*(.+?)\*\*(.+)$/)

    if (speakerMatch) {
      const speaker = speakerMatch[1]
      const text = speakerMatch[2]
      const isExpert =
        speaker.includes("専門家") || speaker.includes("先生")

      if (!isExpert) {
        currentQuestion = text
      } else if (currentQuestion) {
        pairs.push({ question: currentQuestion, answer: text.slice(0, 120) })
        currentQuestion = null
      }
    }
  }

  return pairs.slice(0, 12)
}

export default function SearchPage() {
  const allArticles = getAllArticles()
  const allPrograms = getAllPrograms()
  const allChecklists = getAllChecklists()

  const articles: readonly SearchArticleData[] = allArticles.map((article) => ({
    type: "article" as const,
    slug: article.frontmatter.slug,
    vol: article.frontmatter.vol,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    category: article.frontmatter.category,
    publishedAt: article.frontmatter.publishedAt,
    keyPoints: article.frontmatter.keyPoints,
    qaCount: article.frontmatter.qaCount,
    qaPairs: extractQaPairs(article.content),
  }))

  const programs: readonly SearchProgramData[] = allPrograms.map((p) => ({
    type: "program" as const,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    amountDescription: p.amount.description,
  }))

  const checklists: readonly SearchChecklistData[] = allChecklists.map((c) => ({
    type: "checklist" as const,
    slug: c.slug,
    name: c.name,
    description: c.description,
    itemCount: c.items.length,
  }))

  const allItems: readonly SearchItem[] = [
    ...articles,
    ...programs,
    ...checklists,
  ]

  return <SearchPageClient items={allItems} />
}
