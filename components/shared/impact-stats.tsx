import { WatercolorIcon } from "@/components/icons/watercolor-icon"
import type { WatercolorIconName } from "@/components/icons/watercolor-icon"
import { getAllArticles } from "@/lib/content"
import { getAllPrograms } from "@/lib/programs"
import { getAllVaccines } from "@/lib/vaccines"
import { getAllCheckups } from "@/lib/checkups"

interface StatItem {
  readonly icon: WatercolorIconName
  readonly value: string
  readonly label: string
}

function buildStats(): readonly StatItem[] {
  const articleCount = getAllArticles().length
  const programCount = getAllPrograms().length
  const vaccineCount = getAllVaccines().length
  const checkupCount = getAllCheckups().length

  return [
    {
      icon: "book",
      value: `${String(articleCount)}本`,
      label: "医師監修記事",
    },
    {
      icon: "clipboard",
      value: `${String(programCount)}種類`,
      label: "制度・手続きガイド",
    },
    {
      icon: "syringe",
      value: `${String(vaccineCount)}種類`,
      label: "予防接種スケジュール",
    },
    {
      icon: "stethoscope",
      value: `${String(checkupCount)}回分`,
      label: "健診ガイド",
    },
  ]
}

export function ImpactStats() {
  const stats = buildStats()

  return (
    <div className="rounded-xl border border-sage-100 bg-white p-6">
      <h2 className="text-center font-heading text-sm font-semibold text-muted">
        すくすくナビのコンテンツ
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
