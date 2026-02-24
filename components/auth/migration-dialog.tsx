"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import { migrateLocalToSupabase, clearLocalData } from "@/lib/store";

interface MigrationDialogProps {
  readonly onComplete: () => void;
}

export function MigrationDialog({ onComplete }: MigrationDialogProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"prompt" | "migrating" | "done" | "error">(
    "prompt",
  );
  const [migratedCount, setMigratedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const hasLocalData = useCallback(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("sukusuku-family");
      if (!raw) return false;
      const data = JSON.parse(raw);
      return data.children && data.children.length > 0;
    } catch {
      return false;
    }
  }, []);

  const handleMigrate = useCallback(async () => {
    if (!user) return;

    setStep("migrating");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const client = createClient();
      const result = await migrateLocalToSupabase(client);
      setMigratedCount(result.migratedChildren);
      clearLocalData();
      setStep("done");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "移行中にエラーが発生しました",
      );
      setStep("error");
    }
  }, [user]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (!hasLocalData()) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {step === "prompt" && (
          <>
            <div className="mb-4 text-center text-3xl">📦</div>
            <h2 className="font-heading text-center text-lg font-semibold text-gray-900">
              データの移行
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              このデバイスに保存されているお子さまの情報が見つかりました。
              クラウドに移行すると、どのデバイスからでもアクセスできるようになります。
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleMigrate}
                className="w-full rounded-lg bg-sage-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700"
              >
                クラウドに移行する
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                後で移行する
              </button>
            </div>
          </>
        )}

        {step === "migrating" && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-sage-200 border-t-sage-600" />
            <p className="text-sm text-gray-600">データを移行しています...</p>
          </div>
        )}

        {step === "done" && (
          <>
            <div className="mb-4 text-center text-3xl">🎉</div>
            <h2 className="font-heading text-center text-lg font-semibold text-gray-900">
              移行完了
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {migratedCount}人のお子さまのデータをクラウドに移行しました。
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="mt-6 w-full rounded-lg bg-sage-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700"
            >
              はじめる
            </button>
          </>
        )}

        {step === "error" && (
          <>
            <div className="mb-4 text-center text-3xl">⚠️</div>
            <h2 className="font-heading text-center text-lg font-semibold text-gray-900">
              移行エラー
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {errorMessage}
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleMigrate}
                className="w-full rounded-lg bg-sage-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700"
              >
                再試行
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                後で移行する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
