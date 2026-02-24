interface QaBubbleProps {
  readonly speaker: string
  readonly children: React.ReactNode
}

function isDoctor(speaker: string): boolean {
  return speaker.includes("おかもん") || speaker.includes("先生")
}

export function QaBubble({ speaker, children }: QaBubbleProps) {
  const doctor = isDoctor(speaker)

  if (doctor) {
    return (
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-600 text-sm font-bold text-white shadow-sm">
          医
        </div>
        <div className="max-w-[82%]">
          <p className="mb-1.5 text-xs font-semibold text-sage-600">{speaker}</p>
          <div className="rounded-2xl rounded-tl-sm bg-sage-50 px-5 py-4 text-base leading-[1.9] text-foreground shadow-sm">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-row-reverse items-start gap-3 sm:gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blush-400 text-sm font-bold text-white shadow-sm">
        親
      </div>
      <div className="max-w-[82%]">
        <p className="mb-1.5 text-right text-xs font-semibold text-blush-500">
          {speaker}
        </p>
        <div className="rounded-2xl rounded-tr-sm bg-blush-50 px-5 py-4 text-base leading-[1.9] text-foreground shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}

interface QaBlockProps {
  readonly children: React.ReactNode
}

export function QaBlock({ children }: QaBlockProps) {
  return (
    <div className="my-8 space-y-5 rounded-xl border border-border bg-ivory-50 p-5 sm:p-7">
      {children}
    </div>
  )
}
