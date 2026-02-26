"use client";

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";

const SUPPORT_OPTIONS = [
  {
    href: "/emergency",
    iconName: "alert" as const,
    label: "相談窓口・サポート",
    description: "各種相談先一覧",
    color: "bg-blue-50",
  },
  {
    href: "tel:0570-064-370",
    iconName: "phone" as const,
    label: "法テラス（法律相談）",
    description: "平日 9:00〜21:00",
    color: "bg-sage-50",
    external: true,
  },
  {
    href: "/glossary",
    iconName: "book" as const,
    label: "用語集",
    description: "手続き用語を確認",
    color: "bg-purple-50",
  },
];

export function EmergencyFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3 md:bottom-6">
      {isOpen && (
        <div className="mb-2 w-72 rounded-2xl border border-sage-100 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              困ったときは
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
            {SUPPORT_OPTIONS.map((option) => {
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
                    className="block rounded-xl border border-border p-3 transition-colors hover:border-sage-200 hover:bg-sage-50/30"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={option.label}
                  href={option.href}
                  className="block rounded-xl border border-border p-3 transition-colors hover:border-sage-200 hover:bg-sage-50/30"
                  onClick={() => setIsOpen(false)}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-sage-600 hover:bg-sage-700"
        }`}
        aria-label={isOpen ? "サポートメニューを閉じる" : "困ったときは"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <WatercolorIcon name="check" size={24} className="text-white" />
        ) : (
          <WatercolorIcon name="book" size={24} className="text-white" />
        )}
      </button>
    </div>
  );
}
