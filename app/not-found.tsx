import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-50">
        <WatercolorIcon name="search" size={36} className="text-sage-400" />
      </div>
      <h1 className="mt-6 font-heading text-2xl font-bold text-foreground">
        ページが見つかりません
      </h1>
      <p className="mt-3 max-w-sm text-center text-base leading-relaxed text-muted">
        お探しのページは移動または削除された可能性があります。トップページか検索からお探しください。
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-sage-600 px-7 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sage-700 active:bg-sage-800"
        >
          <WatercolorIcon name="home" size={16} />
          トップに戻る
        </Link>
        <Link
          href="/search"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-ivory-50 active:bg-ivory-100"
        >
          <WatercolorIcon name="search" size={16} />
          記事を検索する
        </Link>
      </div>
      <div className="mt-10">
        <p className="text-sm text-muted">よく見られているページ</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {[
            { href: "/articles", label: "記事一覧" },
            { href: "/triage", label: "受診判断" },
            { href: "/vaccines", label: "予防接種" },
            { href: "/simulator", label: "給付金シミュレーター" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-sage-200 hover:text-sage-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
