"use client"

import Link from "next/link"
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface LifePlanTimelineProps {
  readonly children: readonly { readonly birthDate: string }[]
  readonly eligiblePrograms: readonly {
    readonly program: {
      readonly slug: string
      readonly name: string
      readonly category: string
      readonly eligibility: {
        readonly minAge: number | null
        readonly maxAge: number | null
      }
      readonly applicationUrl: string
    }
    readonly estimatedAmount: number
  }[]
}

const AGE_MARKERS = [0, 1, 2, 3, 6, 12, 15, 18] as const

const CATEGORY_COLORS: Record<string, { readonly bg: string; readonly border: string; readonly text: string; readonly bar: string }> = {
  financial: { bg: "bg-sage-50", border: "border-sage-300", text: "text-sage-700", bar: "bg-sage-400" },
  medical: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", bar: "bg-blue-400" },
  childcare: { bg: "bg-blush-50", border: "border-blush-300", text: "text-blush-600", bar: "bg-blush-400" },
  support: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", bar: "bg-purple-400" },
} as const

const DEFAULT_COLORS = {
  bg: "bg-gray-50",
  border: "border-gray-300",
  text: "text-gray-700",
  bar: "bg-gray-400",
} as const

function computeChildAgeYears(birthDate: string): number {
  const birth = new Date(birthDate)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  return diffMs / (365.25 * 24 * 60 * 60 * 1000)
}

function formatAmount(amount: number): string {
  if (amount >= 10000) {
    const man = Math.floor(amount / 10000)
    return `約${man.toLocaleString()}万円/年`
  }
  if (amount > 0) {
    return `約${amount.toLocaleString()}円/年`
  }
  return ""
}

function getAgePosition(age: number): number {
  const maxAge = 18
  return Math.min(Math.max((age / maxAge) * 100, 0), 100)
}

function getCategoryColors(category: string) {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLORS
}

function ProgramBar({
  program,
  estimatedAmount,
}: {
  readonly program: LifePlanTimelineProps["eligiblePrograms"][number]["program"]
  readonly estimatedAmount: number
}) {
  const minAge = program.eligibility.minAge ?? 0
  const maxAge = program.eligibility.maxAge ?? 18
  const left = getAgePosition(minAge)
  const width = getAgePosition(maxAge) - left
  const colors = getCategoryColors(program.category)

  return (
    <div className="group relative mb-3">
      <div className="flex items-center gap-2 sm:hidden">
        <div className={`h-2 w-2 rounded-full ${colors.bar}`} />
        <span className={`text-xs font-medium ${colors.text}`}>
          {program.name}
        </span>
        {estimatedAmount > 0 && (
          <span className="text-xs text-muted">
            {formatAmount(estimatedAmount)}
          </span>
        )}
      </div>

      <div className="mt-1 sm:mt-0">
        <div className="relative h-10 w-full sm:h-12">
          <div
            className={`absolute top-1 h-8 rounded-lg border ${colors.bg} ${colors.border} flex items-center overflow-hidden px-2 transition-opacity sm:top-2 sm:h-8`}
            style={{
              left: `${left}%`,
              width: `${Math.max(width, 8)}%`,
            }}
          >
            <div className="hidden items-center gap-1.5 overflow-hidden sm:flex">
              <span
                className={`truncate text-xs font-medium ${colors.text}`}
              >
                {program.name}
              </span>
              {estimatedAmount > 0 && (
                <span className="shrink-0 text-xs text-muted">
                  {formatAmount(estimatedAmount)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Link
        href={`/programs/${program.slug}`}
        className={`mt-0.5 inline-flex items-center gap-0.5 text-xs ${colors.text} opacity-70 transition-opacity hover:opacity-100`}
      >
        <span>詳しく見る</span>
        <WatercolorIcon name="arrow_right" size={12} />
      </Link>
    </div>
  )
}

function ChildAgeMarker({
  ageYears,
  index,
}: {
  readonly ageYears: number
  readonly index: number
}) {
  if (ageYears < 0 || ageYears > 18) return null

  const position = getAgePosition(ageYears)

  return (
    <div
      className="absolute -top-1 z-10 flex flex-col items-center"
      style={{ left: `${position}%`, transform: "translateX(-50%)" }}
    >
      <div className="flex flex-col items-center">
        <span className="whitespace-nowrap rounded-full bg-blush-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
          今ここ
        </span>
        <div className="mt-0.5 h-3 w-0.5 bg-blush-400" />
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blush-500 shadow-sm">
          <WatercolorIcon name="baby" size={8} className=".5 .5 text-white" />
        </div>
        {index > 0 && (
          <span className="mt-0.5 text-xs text-muted">
            第{index + 1}子
          </span>
        )}
      </div>
    </div>
  )
}

export function LifePlanTimeline({
  children: childrenProp,
  eligiblePrograms,
}: LifePlanTimelineProps) {
  const childAges = childrenProp.map((child) =>
    computeChildAgeYears(child.birthDate)
  )

  const oldestChildAge = Math.max(...childAges, 0)

  const sortedPrograms = [...eligiblePrograms].sort((a, b) => {
    const aMin = a.program.eligibility.minAge ?? 0
    const bMin = b.program.eligibility.minAge ?? 0
    if (aMin !== bMin) return aMin - bMin
    const aMax = a.program.eligibility.maxAge ?? 18
    const bMax = b.program.eligibility.maxAge ?? 18
    return aMax - bMax
  })

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <WatercolorIcon name="calendar" size={20} className="text-sage-600" />
        <h3 className="font-heading text-base font-semibold text-card-foreground">
          0歳〜18歳の制度タイムライン
        </h3>
      </div>

      <div className="relative">
        <div className="relative mb-6 h-8">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
          {AGE_MARKERS.map((age) => {
            const position = getAgePosition(age)
            return (
              <div
                key={age}
                className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${position}%` }}
              >
                <div className="h-3 w-0.5 bg-border" />
                <span className="mt-1 text-xs text-muted">{age}歳</span>
              </div>
            )
          })}
          {childAges.map((age, idx) => (
            <ChildAgeMarker key={idx} ageYears={age} index={idx} />
          ))}
        </div>

        <div className="mt-8">
          {sortedPrograms.map((ep) => {
            const minAge = ep.program.eligibility.minAge ?? 0
            const isFuture = minAge > oldestChildAge

            return (
              <div
                key={ep.program.slug}
                className={isFuture ? "opacity-50" : "opacity-100"}
              >
                <ProgramBar
                  program={ep.program}
                  estimatedAmount={ep.estimatedAmount}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4">
        {Object.entries(CATEGORY_COLORS).map(([key, colors]) => {
          const labels: Record<string, string> = {
            financial: "給付金・手当",
            medical: "医療",
            childcare: "保育・預かり",
            support: "子育て支援",
          }
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-sm ${colors.bar}`} />
              <span className="text-xs text-muted">
                {labels[key] ?? key}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
