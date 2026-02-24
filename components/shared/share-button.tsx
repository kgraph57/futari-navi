"use client";

import { useShare } from "@/lib/hooks/use-share";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface ShareButtonProps {
  readonly title: string;
  readonly text: string;
  readonly url: string;
  readonly contentType: string;
  readonly contentId: string;
  readonly label?: string;
  readonly className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  contentType,
  contentId,
  label,
  className,
}: ShareButtonProps) {
  const { share, copied } = useShare();

  return (
    <button
      type="button"
      onClick={() => share({ title, text, url, contentType, contentId })}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-2 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
      }
      aria-label={label ?? "共有する"}
    >
      <WatercolorIcon name="send" size={16} />
      {copied ? "コピーしました" : label ?? "共有する"}
    </button>
  );
}
