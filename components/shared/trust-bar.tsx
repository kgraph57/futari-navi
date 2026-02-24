import { WatercolorIcon } from "@/components/icons/watercolor-icon"

const TRUST_SIGNALS = [
  {
    icon: "stethoscope" as const,
    text: "愛育病院 小児科医監修",
  },
  {
    icon: "book" as const,
    text: "医学論文に基づく情報",
  },
  {
    icon: "refresh" as const,
    text: "定期的に内容を更新",
  },
  {
    icon: "mappin" as const,
    text: "港区特化の子育て情報",
  },
] as const

export function TrustBar() {
  return (
    <div className="border-b border-sage-100 bg-sage-50/60">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 overflow-x-auto px-4 py-2 sm:gap-6">
        {TRUST_SIGNALS.map((signal) => (
          <div
            key={signal.text}
            className="flex shrink-0 items-center gap-1.5"
          >
            <WatercolorIcon
              name={signal.icon}
              size={14}
              className="text-sage-600"
            />
            <span className="text-xs font-medium text-sage-700">
              {signal.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
