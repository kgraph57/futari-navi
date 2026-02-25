import Link from "next/link"
import { WatercolorIcon } from "@/components/icons/watercolor-icon"
import type { ArticleFrontmatter, ArticleCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  benefits: "bg-green-50 text-green-700 border-green-200",
  procedures: "bg-blue-50 text-blue-700 border-blue-200",
  tax: "bg-orange-50 text-orange-700 border-orange-200",
  insurance: "bg-purple-50 text-purple-700 border-purple-200",
  housing: "bg-sage-50 text-sage-700 border-sage-200",
  lifestyle: "bg-pink-50 text-pink-700 border-pink-200",
} as const

const CATEGORY_ACCENT: Record<ArticleCategory, string> = {
  benefits: "border-l-green-400",
  procedures: "border-l-blue-400",
  tax: "border-l-orange-400",
  insurance: "border-l-purple-400",
  housing: "border-l-sage-400",
  lifestyle: "border-l-pink-400",
} as const

function CategoryBadge({ category }: { readonly category: ArticleCategory }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}

interface ArticleCardProps {
  readonly frontmatter: ArticleFrontmatter
}

export function ArticleCard({ frontmatter }: ArticleCardProps) {
  const { slug, vol, title, description, category } = frontmatter
  const keyPoints = frontmatter.keyPoints ?? []

  return (
    <Link
      href={`/articles/${slug}`}
      className={`group flex flex-col rounded-xl border border-border border-l-4 bg-card p-5 transition-all hover:border-sage-200 hover:shadow-md ${CATEGORY_ACCENT[category]}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-bold text-sage-700">
          Vol.{vol}
        </span>
        <CategoryBadge category={category} />
      </div>

      <h3 className="mt-3 font-heading text-[1.05rem] font-semibold leading-snug text-card-foreground group-hover:text-sage-700">
        {title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {description}
      </p>

      {keyPoints.length > 0 && (
        <ul className="mt-3 space-y-1.5 rounded-lg bg-sage-50 px-3 py-2.5">
          {keyPoints.slice(0, 2).map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-xs leading-relaxed text-muted"
            >
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-500" />
              <span className="line-clamp-1">{point}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-1 text-xs text-muted">
          <WatercolorIcon name="tag" size={12} />
          <span>{CATEGORY_LABELS[category]}</span>
        </div>
        <span className="flex items-center gap-0.5 text-xs font-medium text-sage-600 opacity-0 transition-opacity group-hover:opacity-100">
          読む <WatercolorIcon name="arrow_right" size={12} />
        </span>
      </div>
    </Link>
  )
}

export { CategoryBadge, CATEGORY_COLORS }
