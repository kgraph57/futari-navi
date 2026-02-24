import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface KeyPointsBoxProps {
  readonly points: readonly string[];
  readonly title?: string;
}

export function KeyPointsBox({
  points,
  title = "今号のポイント",
}: KeyPointsBoxProps) {
  if (!points || points.length === 0) return null;

  return (
    <div className="my-8 overflow-hidden rounded-xl border-2 border-sage-200 bg-gradient-to-br from-sage-50 to-sage-50/20 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-sage-200 bg-sage-600 px-6 py-4">
        <WatercolorIcon name="lightbulb" size={20} className="text-white" />
        <h3 className="font-heading text-base font-semibold text-white">
          {title}
        </h3>
      </div>
      <ol className="space-y-0 divide-y divide-sage-100 px-6 py-2">
        {points.map((point, index) => (
          <li
            key={`point-${String(index)}`}
            className="flex items-start gap-4 py-4"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-600 text-sm font-bold text-white">
              {index + 1}
            </span>
            <span className="text-base leading-[1.85] text-foreground">
              {point}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
