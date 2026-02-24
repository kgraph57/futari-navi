import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "緊急連絡先・夜間休日診療",
  description:
    "港区の子どもの急病・けが時の緊急連絡先一覧。#7119、救急車、中毒110番、夜間休日診療所の情報。",
};

const EMERGENCY_NUMBERS = [
  {
    number: "119",
    label: "救急車",
    description: "意識がない、呼吸がおかしい、けいれんが止まらないなど、命に関わる緊急時。",
    color: "red",
    iconName: "alert" as const,
  },
  {
    number: "#7119",
    label: "救急安心センター東京",
    description:
      "救急車を呼ぶか迷ったとき、24時間看護師に電話相談できます。小児の相談にも対応。",
    color: "orange",
    iconName: "phone" as const,
  },
  {
    number: "#8000",
    label: "小児救急電話相談",
    description:
      "子どもの急な病気・けがについて、小児科医や看護師に電話相談できます。東京都では毎日18時〜翌朝8時（休日は8時〜翌朝8時）。",
    color: "teal",
    iconName: "phone" as const,
  },
] as const;

const POISON_CENTERS = [
  {
    name: "日本中毒情報センター（大阪）",
    number: "072-727-2499",
    hours: "24時間対応",
  },
  {
    name: "日本中毒情報センター（つくば）",
    number: "029-852-9999",
    hours: "9時〜21時",
  },
] as const;

const NIGHT_CLINICS = [
  {
    name: "港区休日診療所（小児科）",
    address: "港区三田1-4-10 みなと保健所2階",
    hours: "日曜・祝日 10:00〜12:00、13:00〜16:30",
    note: "受付は終了30分前まで。健康保険証・医療証を持参。",
  },
  {
    name: "東京都小児救急（広尾病院）",
    address: "渋谷区恵比寿2-34-10",
    hours: "平日夜間 17:00〜翌8:00、休日 8:00〜翌8:00",
    note: "港区から最も近い都立小児救急。事前に#7119で相談推奨。",
  },
  {
    name: "済生会中央病院 救急外来",
    address: "港区三田1-4-17",
    hours: "24時間（救急外来）",
    note: "小児科常駐ではないため、事前電話確認を推奨。03-3451-8211。",
  },
] as const;

const USEFUL_LINKS = [
  {
    label: "東京消防庁 救急相談センター",
    url: "https://www.tfd.metro.tokyo.lg.jp/lfe/kyuu-adv/soudan-center.htm",
  },
  {
    label: "東京都こども医療ガイド",
    url: "https://www.guide.metro.tokyo.lg.jp/",
  },
  {
    label: "港区 子どもの急病ガイド",
    url: "https://www.city.minato.tokyo.jp/kodomokyufu/kenko/ninshin/kodomo/kyubyou.html",
  },
  {
    label: "日本中毒情報センター",
    url: "https://www.j-poison-ic.jp/",
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  red: "border-red-200 bg-red-50",
  orange: "border-orange-200 bg-orange-50",
  teal: "border-teal-200 bg-teal-50",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  red: "text-red-600",
  orange: "text-orange-600",
  teal: "text-teal-600",
};

export default function EmergencyPage() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading subtitle="お子さんの急病・けが時の相談先">
          緊急連絡先
        </SectionHeading>

        {/* Emergency notice */}
        <div className="mt-8 rounded-xl border-2 border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <WatercolorIcon
              name="alert"
              size={24}
              className="shrink-0 text-red-600"
            />
            <div>
              <p className="font-heading text-sm font-bold text-red-800">
                意識がない・呼吸がおかしい・大量出血時は迷わず119番
              </p>
              <p className="mt-1 text-sm leading-relaxed text-red-700/80">
                お子さんの状態が明らかにおかしいと感じたら、まず救急車を呼んでください。判断に迷ったときは#7119に電話してください。
              </p>
            </div>
          </div>
        </div>

        {/* Emergency numbers */}
        <div className="mt-10 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            緊急電話番号
          </h2>
          {EMERGENCY_NUMBERS.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number.replace("#", "")}`}
              className={`flex items-start gap-4 rounded-xl border-2 p-5 transition-all hover:shadow-md ${COLOR_MAP[item.color]}`}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${TEXT_COLOR_MAP[item.color]}`}
              >
                <span className="text-lg font-bold">{item.number}</span>
              </div>
              <div>
                <h3
                  className={`font-heading text-base font-bold ${TEXT_COLOR_MAP[item.color]}`}
                >
                  {item.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Poison center */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <WatercolorIcon name="shield" size={20} className="text-purple-600" />
            誤飲・中毒時の相談
          </h2>
          <p className="mt-2 text-sm text-muted">
            お子さんが薬品・洗剤・たばこなどを飲み込んでしまったとき。
          </p>
          <div className="mt-4 space-y-3">
            {POISON_CENTERS.map((center) => (
              <a
                key={center.number}
                href={`tel:${center.number}`}
                className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50/50 p-4 transition-all hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {center.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{center.hours}</p>
                </div>
                <span className="shrink-0 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-bold text-purple-700">
                  {center.number}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Night/holiday clinics */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <WatercolorIcon name="building" size={20} className="text-blue-600" />
            夜間・休日診療（港区近辺）
          </h2>
          <div className="mt-4 space-y-4">
            {NIGHT_CLINICS.map((clinic) => (
              <div
                key={clinic.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {clinic.name}
                </h3>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm text-muted">
                    <WatercolorIcon
                      name="building"
                      size={14}
                      className="mt-0.5 shrink-0"
                    />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted">
                    <WatercolorIcon
                      name="clock"
                      size={14}
                      className="mt-0.5 shrink-0"
                    />
                    <span>{clinic.hours}</span>
                  </div>
                  {clinic.note && (
                    <p className="mt-2 rounded-lg bg-ivory-100 px-3 py-2 text-xs leading-relaxed text-muted">
                      {clinic.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triage link */}
        <div className="mt-10 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
              <WatercolorIcon
                name="stethoscope"
                size={24}
                className="text-red-600"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                症状から受診判断をチェック
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                今すぐ救急？明日でいい？30秒で判断できます
              </p>
            </div>
            <Link
              href="/triage"
              className="shrink-0 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              症状チェック
            </Link>
          </div>
        </div>

        {/* Useful links */}
        <div className="mt-10">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            参考リンク
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {USEFUL_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-sage-200 hover:shadow-md"
              >
                <WatercolorIcon
                  name="arrow_right"
                  size={16}
                  className="shrink-0 text-sage-500"
                />
                <span className="text-sm font-medium text-foreground">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 rounded-lg bg-ivory-100 p-4 text-xs leading-relaxed text-muted">
          ※ 掲載情報は2025年4月時点のものです。診療時間・対応内容は変更される場合があります。受診前に電話で確認することをおすすめします。
        </div>
      </div>
    </div>
  );
}
