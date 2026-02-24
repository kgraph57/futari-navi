import clsx from "clsx"
import type { ArticleCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  "infectious-disease": "bg-red-50 text-red-700 ring-red-200",
  allergy: "bg-amber-50 text-amber-700 ring-amber-200",
  skin: "bg-pink-50 text-pink-700 ring-pink-200",
  vaccination: "bg-blue-50 text-blue-700 ring-blue-200",
  development: "bg-purple-50 text-purple-700 ring-purple-200",
  nutrition: "bg-green-50 text-green-700 ring-green-200",
  emergency: "bg-red-100 text-red-800 ring-red-300",
  checkup: "bg-sage-50 text-sage-700 ring-sage-200",
  "mental-health": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "municipal-service": "bg-cyan-50 text-cyan-700 ring-cyan-200",
} as const

interface BadgeProps {
  readonly category: ArticleCategory
  readonly size?: "sm" | "md"
  readonly className?: string
}

export function Badge({ category, size = "sm", className }: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  } as const

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium ring-1 ring-inset",
        sizeStyles[size],
        CATEGORY_COLORS[category],
        className
      )}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
