import type { ReactNode } from "react"

interface SectionHeadingProps {
  readonly children: ReactNode
  readonly subtitle?: string
  readonly align?: "left" | "center"
}

export function SectionHeading({
  children,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left"

  return (
    <div className={alignClass}>
      <h2 className="font-heading text-2xl font-semibold tracking-wide text-foreground sm:text-3xl">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-muted">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-5 h-px w-12 bg-gradient-to-r from-gold-500 to-transparent ${
          align === "center" ? "mx-auto" : ""
        }`}
        aria-hidden="true"
      />
    </div>
  )
}
