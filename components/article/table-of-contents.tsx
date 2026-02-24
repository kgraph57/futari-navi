"use client";

import { useState, useEffect, useCallback } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

interface TocItem {
  readonly id: string;
  readonly text: string;
  readonly level: number;
}

function extractHeadings(): readonly TocItem[] {
  const article = document.querySelector(".article-content");
  if (!article) return [];

  const headings = article.querySelectorAll("h2, h3");
  return Array.from(headings)
    .filter((h) => h.id)
    .map((h) => ({
      id: h.id,
      text: h.textContent ?? "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
}

export function TableOfContents() {
  const [items, setItems] = useState<readonly TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(extractHeadings());
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  }, []);

  if (items.length < 3) return null;

  return (
    <nav className="my-8 rounded-xl border border-teal-100 bg-teal-50/30 p-5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 font-heading text-sm font-semibold text-teal-800">
          <WatercolorIcon name="clipboard" size={16} />
          この記事の目次
        </span>
        <WatercolorIcon
          name="chevron_down"
          size={16}
          className={`text-teal-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <ol className="mt-4 space-y-1.5 border-l-2 border-teal-200 pl-4">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left text-sm transition-colors hover:text-teal-700 ${
                  item.level === 3 ? "pl-4 text-xs" : ""
                } ${activeId === item.id ? "font-semibold text-teal-700" : "text-muted"}`}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
