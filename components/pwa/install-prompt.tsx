"use client"

;

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface BeforeInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>;
  readonly userChoice: Promise<{ readonly outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "sukusuku-pwa-dismissed";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY) === "true") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg animate-slide-up">
      <div className="flex items-center gap-3 rounded-2xl border border-sage-200 bg-white p-4 shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="download" size={20} className="text-sage-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            ホーム画面に追加
          </p>
          <p className="text-xs text-muted">
            アプリのようにすぐアクセスできます
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 rounded-lg bg-sage-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-sage-700"
        >
          追加
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-ivory-100"
          aria-label="閉じる"
        >
          <WatercolorIcon name="check" size={16} />
        </button>
      </div>
    </div>
  );
}
