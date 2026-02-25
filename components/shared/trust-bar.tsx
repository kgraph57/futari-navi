import { WatercolorIcon } from "@/components/icons/watercolor-icon"

const TRUST_SIGNALS = [
  {
    icon: "clipboard" as const,
    text: "専門家監修",
  },
  {
    icon: "book" as const,
    text: "公的制度準拠",
  },
  {
    icon: "refresh" as const,
    text: "毎月更新",
  },
  {
    icon: "mappin" as const,
    text: "港区特化",
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
