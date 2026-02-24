import Link from "next/link"
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface DoctorBylineProps {
  readonly qaCount: number
  readonly referenceCount: number
}

export function DoctorByline({ qaCount, referenceCount }: DoctorBylineProps) {
  return (
    <Link
      href="/about"
      className="group mb-8 flex items-center gap-4 rounded-xl border border-sage-100 bg-sage-50/50 p-4 transition-colors hover:border-sage-200 hover:bg-sage-50"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-600 shadow-sm">
        <WatercolorIcon name="stethoscope" size={24} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-semibold text-foreground">
            おかもん先生
          </span>
          <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
            小児科専門医
          </span>
          <span className="rounded-full bg-white border border-sage-100 px-2 py-0.5 text-xs text-muted">
            愛育病院 小児科
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          参考文献 {referenceCount}件
          <span className="mx-1.5 text-border">·</span>
          Q&amp;A {qaCount}問収録
        </p>
      </div>

      <span className="shrink-0 text-xs text-sage-600 group-hover:text-sage-700 group-hover:underline">
        プロフィール →
      </span>
    </Link>
  )
}
