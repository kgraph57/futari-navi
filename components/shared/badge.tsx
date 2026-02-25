import clsx from "clsx"
import type { ArticleCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  benefits: "bg-green-50 text-green-700 ring-green-200",
  procedures: "bg-blue-50 text-blue-700 ring-blue-200",
  tax: "bg-orange-50 text-orange-700 ring-orange-200",
  insurance: "bg-purple-50 text-purple-700 ring-purple-200",
  housing: "bg-sage-50 text-sage-700 ring-sage-200",
  lifestyle: "bg-pink-50 text-pink-700 ring-pink-200",
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
