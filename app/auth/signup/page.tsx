"use client"

;

import { useState } from "react";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-provider";

export default function SignupPage() {
  const { signUpWithEmail, signInWithOAuth, configured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!configured) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="baby" size={28} className="text-sage-600" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
          アカウント登録は準備中です
        </h1>
        <p className="mt-2 text-sm text-muted">
          現在はログインなしでご利用いただけます。データはお使いのブラウザに保存されます。
        </p>
        <Link
          href="/my"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-sage-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
        >
          <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
          マイページへ
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);
    const result = await signUpWithEmail(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: "google" | "line") => {
    setError(null);
    const result = await signInWithOAuth(provider);
    if (result.error) {
      setError(result.error);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="check" size={28} className="text-sage-600" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
          メールを確認してください
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">{email}</span>{" "}
          に確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700"
        >
          <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <WatercolorIcon name="baby" size={28} className="text-sage-600" />
        </div>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
          新規登録
        </h1>
        <p className="mt-2 text-sm text-muted">
          アカウントを作成して、お子さんのデータをクラウドに保存しましょう
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-ivory-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Googleで登録
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("line")}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#06C755] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          LINEで登録
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">または</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            メールアドレス
          </label>
          <div className="relative mt-1">
            <WatercolorIcon name="mail" size={16} className="absolute left-3 top-1/2   -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-ivory-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm placeholder:text-ivory-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-foreground"
          >
            パスワード（確認）
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="もう一度入力"
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm placeholder:text-ivory-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sage-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "登録中..." : "メールで登録"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href="/auth/login"
          className="font-medium text-sage-600 hover:text-sage-700 hover:underline"
        >
          ログイン
        </Link>
      </p>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <WatercolorIcon name="arrow_right" size={12} className=".5 .5" />
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
