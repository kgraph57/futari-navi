"use client";

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";

const EMERGENCY_OPTIONS = [
  {
    href: "/triage",
    iconName: "stethoscope" as const,
    label: "受診判断ガイド",
    description: "症状から判断",
    color: "bg-orange-50",
  },
  {
    href: "tel:03-5285-8898",
    iconName: "phone" as const,
    label: "#8000（小児救急相談）",
    description: "夜間・休日の相談",
    color: "bg-red-50",
    external: true,
  },
  {
    href: "/clinics",
    iconName: "alert" as const,
    label: "夜間・休日対応の病院",
    description: "近くの医療機関を探す",
    color: "bg-blue-50",
  },
];

export function EmergencyFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3 md:bottom-6">
      {isOpen && (
        <div className="mb-2 w-72 rounded-2xl border border-red-100 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              緊急・受診相談
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted hover:bg-ivory-100"
              aria-label="閉じる"
            >
              <WatercolorIcon name="check" size={16} />
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {EMERGENCY_OPTIONS.map((option) => {
              const content = (
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${option.color}`}
                  >
                    <WatercolorIcon name={option.iconName} size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {option.label}
                    </p>
                    <p className="text-xs text-muted">{option.description}</p>
                  </div>
                </div>
              );

              if ("external" in option) {
                return (
                  <a
                    key={option.label}
                    href={option.href}
                    className="block rounded-xl border border-border p-3 transition-colors hover:border-red-200 hover:bg-red-50/30"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={option.label}
                  href={option.href}
                  className="block rounded-xl border border-border p-3 transition-colors hover:border-red-200 hover:bg-red-50/30"
                  onClick={() => setIsOpen(false)}
                >
                  {content}
                </Link>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-red-500">
            命に関わる緊急時は迷わず119番
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-red-500 hover:bg-red-600 animate-pulse hover:animate-none"
        }`}
        aria-label={isOpen ? "緊急メニューを閉じる" : "緊急・受診相談"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <WatercolorIcon name="check" size={24} className="text-white" />
        ) : (
          <WatercolorIcon name="phone" size={24} className="text-white" />
        )}
      </button>
    </div>
  );
}
