"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }

    // Use Next.js basePath for GitHub Pages compatibility
    const basePath =
      (window as unknown as { __NEXT_DATA__?: { basePath?: string } })
        .__NEXT_DATA__?.basePath ?? "";
    const swUrl = `${basePath}/sw.js`;

    navigator.serviceWorker
      .register(swUrl, { scope: `${basePath}/` })
      .catch(() => {
        // Service worker registration failed silently
      });
  }, []);

  return null;
}
