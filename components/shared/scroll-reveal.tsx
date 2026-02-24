"use client";

import { useRef, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly direction?: "up" | "left" | "right" | "fade";
  readonly threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenClass = {
    up: "opacity-0 translate-y-10",
    left: "opacity-0 -translate-x-16",
    right: "opacity-0 translate-x-16",
    fade: "opacity-0",
  }[direction];

  const visibleClass = {
    up: "opacity-100 translate-y-0",
    left: "opacity-100 translate-x-0",
    right: "opacity-100 translate-x-0",
    fade: "opacity-100",
  }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? visibleClass : hiddenClass
      } ${className ?? ""}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
