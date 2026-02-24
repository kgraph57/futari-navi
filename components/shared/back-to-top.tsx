"use client";

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur-sm transition-all hover:bg-sage-50 hover:shadow-lg md:bottom-8"
      aria-label="ページの先頭に戻る"
    >
      <WatercolorIcon name="chevron_down" size={20} className="rotate-180" />
    </button>
  );
}
