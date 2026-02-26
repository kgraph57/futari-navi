"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCoupleAnswerHistory } from "@/lib/couple/daily-queries";

interface ActivityItem {
  readonly id: string;
  readonly type: "question" | "quiz" | "prediction";
  readonly text: string;
  readonly date: string;
  readonly Icon: LucideIcon;
  readonly iconColor: string;
}

interface ActivityFeedProps {
  readonly coupleId: string | null;
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return `${diffDays}日前`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function ActivityFeed({ coupleId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<readonly ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coupleId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const result = await getCoupleAnswerHistory(coupleId, 5);
      if (cancelled) return;

      if (result.data && result.data.length > 0) {
        const items: ActivityItem[] = result.data.map((entry) => {
          const bothAnswered = entry.answers.length >= 2;
          const latestAnswer = entry.answers[0];
          return {
            id: `${entry.questionDate}-${entry.questionId}`,
            type: "question" as const,
            text: bothAnswered
              ? "2人で質問に回答しました"
              : "質問に回答しました",
            date: formatRelativeDate(
              latestAnswer?.answeredAt ?? entry.questionDate,
            ),
            Icon: bothAnswered ? Check : MessageCircle,
            iconColor: bothAnswered ? "text-sage-500" : "text-gold-500",
          };
        });

        setActivities(items);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [coupleId]);

  if (loading) {
    return (
      <div className="py-4 text-center">
        <p className="text-xs text-muted">読み込み中...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-xs text-muted">
          まだアクティビティがありません。質問に答えてみよう!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory-100">
            <item.Icon size={14} className={item.iconColor} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-sage-800">{item.text}</p>
          </div>
          <span className="shrink-0 text-[10px] text-gold-400">
            {item.date}
          </span>
        </div>
      ))}
    </div>
  );
}
