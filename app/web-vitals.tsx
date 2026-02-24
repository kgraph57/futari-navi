"use client";

import { useReportWebVitals } from "next/web-vitals";
import posthog from "posthog-js";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.capture("web_vitals", {
      metric_name: metric.name,
      metric_value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value,
      ),
      metric_id: metric.id,
      metric_rating: metric.rating,
    });
  });

  return null;
}
