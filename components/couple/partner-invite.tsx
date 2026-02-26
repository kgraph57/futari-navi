"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { useCoupleContext } from "@/lib/couple/provider";
import {
  createCouple,
  joinCouple,
  getMyPendingCouple,
} from "@/lib/couple/queries";

type InviteMode = "choose" | "create" | "join";

interface PartnerInviteProps {
  readonly onPaired?: () => void;
}

export function PartnerInvite({ onPaired }: PartnerInviteProps) {
  const { user } = useAuth();
  const { refreshCouple } = useCoupleContext();

  const [mode, setMode] = useState<InviteMode>("choose");
  const [inviteCode, setInviteCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCode = useCallback(async () => {
    if (!user) return;
    setCreating(true);
    setError("");

    // Check if user already has a pending invite
    const pending = await getMyPendingCouple(user.id);
    if (pending.data) {
      setInviteCode(pending.data.inviteCode);
      setMode("create");
      setCreating(false);
      return;
    }

    const result = await createCouple(user.id);
    if (result.error) {
      setError(result.error);
      setCreating(false);
      return;
    }
    if (result.data) {
      setInviteCode(result.data.inviteCode);
      setMode("create");
    }
    setCreating(false);
  }, [user]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [inviteCode]);

  const handleShareLine = useCallback(() => {
    const text = encodeURIComponent(
      `ふたりナビで一緒に毎日の質問に答えよう！\n招待コード: ${inviteCode}`,
    );
    window.open(`https://line.me/R/share?text=${text}`, "_blank");
  }, [inviteCode]);

  const handleJoinSubmit = useCallback(async () => {
    if (!user || joinCode.trim().length === 0) return;
    setJoining(true);
    setError("");

    const result = await joinCouple(joinCode.trim(), user.id);
    if (result.error) {
      setError(result.error);
      setJoining(false);
      return;
    }

    await refreshCouple();
    setJoining(false);
    onPaired?.();
  }, [user, joinCode, onPaired, refreshCouple]);

  if (!user) {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 shadow-sm">
        <div className="text-center">
          <p className="text-3xl">💑</p>
          <h3 className="mt-2 font-heading text-base font-bold text-sage-800">
            パートナーとつながろう
          </h3>
          <p className="mt-2 text-xs text-muted">
            ログインしてパートナーと一緒に質問に答えよう
          </p>
        </div>
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 shadow-sm">
        <div className="mb-5 text-center">
          <p className="text-3xl">💑</p>
          <h3 className="mt-2 font-heading text-base font-bold text-sage-800">
            パートナーとつながろう
          </h3>
          <p className="mt-1 text-xs text-muted">
            ふたりで同じ質問に答えて、お互いを深く知ろう
          </p>
        </div>

        {error && (
          <p className="mb-3 text-center text-xs text-emergency">{error}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCreateCode}
            disabled={creating}
            className="flex w-full items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 p-4 text-left transition-colors hover:bg-sage-100 disabled:opacity-50"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-600 text-lg text-white">
              +
            </span>
            <div>
              <p className="text-sm font-bold text-sage-800">
                {creating ? "作成中..." : "招待コードを作成"}
              </p>
              <p className="text-xs text-muted">
                パートナーに共有するコードを作ります
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode("join")}
            className="flex w-full items-center gap-3 rounded-xl border border-coral-200 bg-coral-50 p-4 text-left transition-colors hover:bg-coral-100"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral-500 text-lg text-white">
              &rarr;
            </span>
            <div>
              <p className="text-sm font-bold text-coral-700">
                コードを入力して参加
              </p>
              <p className="text-xs text-muted">
                パートナーからもらったコードで接続
              </p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 shadow-sm">
        <button
          onClick={() => setMode("choose")}
          className="mb-4 text-xs text-muted transition-colors hover:text-sage-600"
        >
          &larr; 戻る
        </button>

        <div className="mb-5 text-center">
          <p className="text-2xl">📨</p>
          <h3 className="mt-2 font-heading text-base font-bold text-sage-800">
            招待コードを共有しよう
          </h3>
          <p className="mt-1 text-xs text-muted">
            このコードをパートナーに送ってね
          </p>
        </div>

        {/* Invite code display */}
        <div className="mb-4 rounded-xl bg-sage-50 p-4 text-center">
          <p className="font-heading text-2xl font-bold tracking-[0.3em] text-sage-800">
            {inviteCode}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-sage-700"
          >
            {copied ? "コピーしました!" : "コードをコピー"}
          </button>

          <button
            onClick={handleShareLine}
            className="w-full rounded-xl bg-[#06C755] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#05b34d]"
          >
            LINEで送る
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          パートナーがコードを入力すると自動で接続されます
        </p>
      </div>
    );
  }

  // mode === "join"
  return (
    <div className="rounded-2xl border border-ivory-200 bg-gradient-to-br from-white to-ivory-50 p-6 shadow-sm">
      <button
        onClick={() => {
          setMode("choose");
          setError("");
        }}
        className="mb-4 text-xs text-muted transition-colors hover:text-sage-600"
      >
        &larr; 戻る
      </button>

      <div className="mb-5 text-center">
        <p className="text-2xl">🔗</p>
        <h3 className="mt-2 font-heading text-base font-bold text-sage-800">
          招待コードを入力
        </h3>
        <p className="mt-1 text-xs text-muted">
          パートナーからもらったコードを入力してね
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={joinCode}
          onChange={(e) => {
            setJoinCode(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="例: a1b2c3d4e5f6"
          maxLength={12}
          className="w-full rounded-xl border border-ivory-200 bg-white p-4 text-center font-heading text-xl font-bold tracking-[0.15em] text-sage-800 placeholder:text-sage-300 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm focus:border-sage-400 focus:outline-none focus:ring-1 focus:ring-sage-400"
        />

        {error && (
          <p className="text-center text-xs text-emergency">{error}</p>
        )}

        <button
          onClick={handleJoinSubmit}
          disabled={joinCode.trim().length === 0 || joining}
          className="w-full rounded-xl bg-coral-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-600 disabled:opacity-40"
        >
          {joining ? "接続中..." : "参加する"}
        </button>
      </div>
    </div>
  );
}
