import { WatercolorIcon } from "@/components/icons/watercolor-icon"
import type { WatercolorIconName } from "@/components/icons/watercolor-icon"
import { getAllArticles } from "@/lib/content"
import { getAllPrograms } from "@/lib/programs"
import { getAllChecklists } from "@/lib/checklists"

interface StatItem {
  readonly icon: WatercolorIconName
  readonly value: string
  readonly label: string
}

function buildStats(): readonly StatItem[] {
  const articleCount = getAllArticles().length
  const programCount = getAllPrograms().length
  const checklistCount = getAllChecklists().length

  return [
    {
      icon: "book",
      value: `${String(articleCount)}本`,
      label: "解説記事",
    },
    {
      icon: "clipboard",
      value: `${String(programCount)}種類`,
      label: "支援制度",
    },
    {
      icon: "clipboard",
      value: `${String(checklistCount)}項目`,
      label: "手続きチェック",
    },
  ]
}

export function ImpactStats() {
  const stats = buildStats()

  return (
    <div className="rounded-xl border border-sage-100 bg-white p-6">
      <h2 className="text-center font-heading text-sm font-semibold text-muted">
        ふたりナビのコンテンツ
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1.5">
            <WatercolorIcon
              name={stat.icon}
              size={24}
              className="text-sage-600"
            />
            <span className="font-heading text-xl font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-xs text-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
