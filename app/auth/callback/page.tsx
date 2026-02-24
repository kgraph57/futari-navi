"use client"

;

import { useEffect, useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const next = params.get("next") ?? "/my";

      if (!code) {
        setError("認証コードが見つかりません");
        return;
      }

      try {
        const supabase = createClient();
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }

        router.replace(next);
      } catch {
        setError("認証処理中にエラーが発生しました");
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => router.replace("/auth/login")}
          className="mt-4 text-sm font-medium text-sage-600 hover:text-sage-700"
        >
          ログインページに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
        <WatercolorIcon name="baby" size={28} className="text-sage-600" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <WatercolorIcon name="plus" size={16} className="animate-spin text-sage-600" />
        <p className="text-sm text-muted">認証処理中...</p>
      </div>
    </div>
  );
}
