"use client";

import { useState, useCallback } from "react";
import { trackShareClicked } from "@/lib/analytics/events";

interface ShareConfig {
  readonly title: string;
  readonly text: string;
  readonly url: string;
  readonly contentType: string;
  readonly contentId: string;
}

export function useShare() {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async (config: ShareConfig) => {
    const canNativeShare =
      typeof navigator !== "undefined" && "share" in navigator;

    if (canNativeShare) {
      try {
        await navigator.share({
          title: config.title,
          text: config.text,
          url: config.url,
        });
        trackShareClicked(config.contentType, config.contentId, "native");
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${config.text}\n${config.url}`);
      trackShareClicked(config.contentType, config.contentId, "clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in insecure contexts
    }
  }, []);

  return { share, copied } as const;
}
