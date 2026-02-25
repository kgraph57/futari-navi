"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { WatercolorIcon } from "@/components/icons/watercolor-icon"
import Link from "next/link"
import { Badge } from "@/components/shared/badge"
import { SectionHeading } from "@/components/shared/section-heading"
import type { ArticleCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { useDebounce } from "@/lib/hooks/use-debounce"
import type { SearchItem } from "./page"

type ContentType = "all" | "article" | "program" | "checklist"

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  all: "すべて",
  article: "記事",
  program: "制度",
  checklist: "チェックリスト",
}

interface SearchPageClientProps {
  readonly items: readonly SearchItem[]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

function matchesQuery(item: SearchItem, lower: string): boolean {
  switch (item.type) {
    case "article":
      return (
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.keyPoints.some((kp) => kp.toLowerCase().includes(lower)) ||
        item.qaPairs.some(
          (qa) =>
            qa.question.toLowerCase().includes(lower) ||
            qa.answer.toLowerCase().includes(lower),
        )
      )
    case "program":
      return (
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.amountDescription.toLowerCase().includes(lower)
      )
    case "checklist":
      return (
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower)
      )
  }
}

function ArticleResult({
  item,
  query,
}: {
  readonly item: SearchItem & { type: "article" }
  readonly query: string
}) {
  const lower = query.toLowerCase()
  const matchingQa =
    item.qaPairs.find(
      (qa) =>
        qa.question.toLowerCase().includes(lower) ||
        qa.answer.toLowerCase().includes(lower),
    ) ?? null

  return (
    <Link
      href={`/articles/${item.slug}`}
      className="group block rounded-xl border border-border bg-white p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <Badge category={item.category as ArticleCategory} />
        <span className="text-xs text-muted">Vol.{item.vol}</span>
      </div>
      <h3 className="mt-2 font-heading text-base font-semibold text-card-foreground group-hover:text-sage-700 sm:text-lg">
        {item.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
        {item.description}
      </p>

      {matchingQa && (
        <div className="mt-3 rounded-lg border border-sage-100 bg-sage-50/60 p-3">
          <div className="flex items-start gap-2">
            <WatercolorIcon
              name="message"
              size={12}
              className="mt-0.5 shrink-0 text-blush-400"
            />
            <p className="text-xs font-medium text-blush-600 line-clamp-1">
              Q: {matchingQa.question}
            </p>
          </div>
          <div className="mt-1.5 flex items-start gap-2">
            <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-sage-600 text-[8px] font-bold text-white">
              A
            </div>
            <p className="text-xs leading-relaxed text-muted line-clamp-2">
              {matchingQa.answer}
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <WatercolorIcon name="calendar" size={12} />
          {formatDate(item.publishedAt)}
        </span>
        <span className="flex items-center gap-1">
          <WatercolorIcon name="message" size={12} />
          Q&amp;A {item.qaCount}問
        </span>
        <span className="ml-auto flex items-center gap-1 text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          読む
          <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </div>
    </Link>
  )
}

function ProgramResult({
  item,
}: {
  readonly item: SearchItem & { type: "program" }
}) {
  return (
    <Link
      href={`/programs/${item.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sage-200 bg-sage-50">
        <WatercolorIcon name="star" size={20} className="text-sage-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-medium text-sage-700">
            制度
          </span>
        </div>
        <h3 className="mt-1 font-heading text-base font-semibold text-card-foreground group-hover:text-sage-700">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {item.description}
        </p>
        {item.amountDescription && (
          <p className="mt-1 text-xs font-medium text-sage-600">
            {item.amountDescription}
          </p>
        )}
      </div>
    </Link>
  )
}

function ChecklistResult({
  item,
}: {
  readonly item: SearchItem & { type: "checklist" }
}) {
  return (
    <Link
      href={`/checklists/${item.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-border bg-white p-5 transition-all hover:border-sage-200 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sage-200 bg-sage-50">
        <WatercolorIcon name="clipboard" size={20} className="text-sage-600" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-medium text-sage-700">
            チェックリスト
          </span>
        </div>
        <h3 className="mt-1 font-heading text-base font-semibold text-card-foreground group-hover:text-sage-700">
          {item.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {item.description}
        </p>
        <p className="mt-1 text-xs font-medium text-sage-600">
          {item.itemCount}項目
        </p>
      </div>
    </Link>
  )
}

function SearchResultItem({
  item,
  query,
}: {
  readonly item: SearchItem
  readonly query: string
}) {
  switch (item.type) {
    case "article":
      return <ArticleResult item={item} query={query} />
    case "program":
      return <ProgramResult item={item} />
    case "checklist":
      return <ChecklistResult item={item} />
  }
}

export function SearchPageClient({ items }: SearchPageClientProps) {
  const [query, setQuery] = useState("")
  const [activeType, setActiveType] = useState<ContentType>("all")
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const results = useMemo(() => {
    if (debouncedQuery.length === 0) return []
    const lower = debouncedQuery.toLowerCase()
    const matched = items.filter((item) => matchesQuery(item, lower))

    if (activeType === "all") return matched
    return matched.filter((item) => item.type === activeType)
  }, [items, debouncedQuery, activeType])

  const typeCounts = useMemo(() => {
    if (debouncedQuery.length === 0) return {}
    const lower = debouncedQuery.toLowerCase()
    const matched = items.filter((item) => matchesQuery(item, lower))
    const counts: Record<string, number> = {}
    for (const item of matched) {
      counts[item.type] = (counts[item.type] ?? 0) + 1
    }
    return counts
  }, [items, debouncedQuery])

  const totalCount = Object.values(typeCounts).reduce((a, b) => a + b, 0)
  const hasQuery = debouncedQuery.length > 0

  const articleCount = items.filter((i) => i.type === "article").length
  const programCount = items.filter((i) => i.type === "program").length
  const checklistCount = items.filter((i) => i.type === "checklist").length

  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading subtitle="記事・制度・チェックリストをまとめて検索">
          横断検索
        </SectionHeading>

        <div className="mt-6 flex items-center gap-2 rounded-lg border border-sage-100 bg-sage-50/50 px-4 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-600">
            <WatercolorIcon
              name="search"
              size={12}
              className="text-white"
            />
          </div>
          <p className="text-xs text-muted">
            <span className="font-medium text-foreground">
              {articleCount}本の記事
            </span>
            ・
            <span className="font-medium text-foreground">
              {programCount}件の制度
            </span>
            ・
            <span className="font-medium text-foreground">
              {checklistCount}件のチェックリスト
            </span>
            を横断検索
          </p>
        </div>

        <div className="relative mt-4">
          <WatercolorIcon
            name="search"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            ref={inputRef}
            type="search"
            placeholder="例: 結婚新生活支援、名義変更、配偶者控除..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-white py-4 pl-12 pr-20 text-base text-foreground shadow-sm outline-none transition-all placeholder:text-muted/60 focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20"
            autoFocus
          />
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-sage-50 px-2 py-1 text-xs text-muted sm:flex">
            <span className="text-[10px]">&#8984;</span>K
          </kbd>
        </div>

        {hasQuery && totalCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(
              Object.entries(CONTENT_TYPE_LABELS) as [ContentType, string][]
            ).map(([type, label]) => {
              const count =
                type === "all" ? totalCount : (typeCounts[type] ?? 0)
              if (type !== "all" && count === 0) return null

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeType === type
                      ? "bg-sage-600 text-white"
                      : "border border-border bg-white text-muted hover:border-sage-200 hover:text-sage-700"
                  }`}
                >
                  {label}
                  <span className="ml-1 opacity-70">{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {hasQuery && (
          <p className="mt-4 text-sm text-muted">
            {totalCount > 0
              ? `「${debouncedQuery}」の検索結果: ${results.length}件`
              : `「${debouncedQuery}」に一致する結果が見つかりませんでした`}
          </p>
        )}

        {hasQuery && results.length > 0 && (
          <div className="mt-6 space-y-4">
            {results.map((item) => (
              <SearchResultItem
                key={`${item.type}-${item.slug}`}
                item={item}
                query={debouncedQuery}
              />
            ))}
          </div>
        )}

        {hasQuery && totalCount === 0 && (
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-50">
              <WatercolorIcon name="search" size={28} className="text-muted" />
            </div>
            <p className="mt-4 text-base text-muted">
              別のキーワードで検索してみてください
            </p>
          </div>
        )}

        {!hasQuery && (
          <div className="mt-12">
            <p className="text-center text-sm font-medium text-muted">
              人気のキーワード
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                ...Object.entries(CATEGORY_LABELS).map(([, label]) => label),
                "結婚新生活支援",
                "名義変更",
                "婚姻届",
                "配偶者控除",
                "引越し",
                "港区",
              ].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setQuery(keyword)}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm text-foreground transition-colors hover:border-sage-200 hover:bg-sage-50 hover:text-sage-700"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
