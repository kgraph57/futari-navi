import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "相談窓口・サポート",
  description:
    "結婚手続きで困ったときの相談先一覧。市区町村窓口、法テラス、税務署、年金事務所などの連絡先。",
};

const CONSULTATION_CONTACTS = [
  {
    name: "市区町村の戸籍課・住民課",
    description: "婚姻届の提出、住民票の異動、印鑑登録など、基本的な届出手続き全般。",
    color: "teal",
    iconName: "building" as const,
    note: "お住まいの市区町村役場の窓口へ。多くの自治体でオンライン予約が可能。",
  },
  {
    name: "年金事務所",
    description:
      "国民年金の氏名変更、第3号被保険者への切替、扶養手続きなど。",
    color: "blue",
    iconName: "shield" as const,
    note: "最寄りの年金事務所へ。電話予約で待ち時間を短縮できます。",
  },
  {
    name: "税務署",
    description:
      "配偶者控除・配偶者特別控除、確定申告に関する相談。",
    color: "orange",
    iconName: "clipboard" as const,
    note: "確定申告期間（2〜3月）以外でも電話相談が可能です。",
  },
] as const;

const SUPPORT_SERVICES = [
  {
    name: "法テラス（日本司法支援センター）",
    number: "0570-078374",
    hours: "平日 9:00〜21:00、土曜 9:00〜17:00",
    description: "法的なトラブル全般の無料相談。婚姻に関する法律相談も。",
  },
  {
    name: "よりそいホットライン",
    number: "0120-279-338",
    hours: "24時間対応",
    description: "DVやパートナーとの問題、生活の悩みなど、なんでも相談できる窓口。",
  },
  {
    name: "配偶者暴力相談支援センター",
    number: "0570-0-55210（最寄りのセンターへ接続）",
    hours: "各センターにより異なる",
    description: "DV被害に関する相談、一時保護、自立支援の情報提供。",
  },
] as const;

const USEFUL_LINKS = [
  {
    label: "マイナポータル（行政手続きオンライン）",
    url: "https://myna.go.jp/",
  },
  {
    label: "日本年金機構",
    url: "https://www.nenkin.go.jp/",
  },
  {
    label: "国税庁（確定申告等作成コーナー）",
    url: "https://www.keisan.nta.go.jp/",
  },
  {
    label: "法テラス",
    url: "https://www.houterasu.or.jp/",
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  teal: "border-teal-200 bg-teal-50",
  blue: "border-blue-200 bg-blue-50",
  orange: "border-orange-200 bg-orange-50",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  teal: "text-teal-600",
  blue: "text-blue-600",
  orange: "text-orange-600",
};

export default function EmergencyPage() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading subtitle="結婚手続きで困ったときの相談先">
          相談窓口・サポート
        </SectionHeading>

        {/* Main consultation contacts */}
        <div className="mt-10 space-y-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            主な相談先
          </h2>
          {CONSULTATION_CONTACTS.map((item) => (
            <div
              key={item.name}
              className={`flex items-start gap-4 rounded-xl border-2 p-5 ${COLOR_MAP[item.color]}`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${TEXT_COLOR_MAP[item.color]}`}
              >
                <WatercolorIcon name={item.iconName} size={24} />
              </div>
              <div>
                <h3
                  className={`font-heading text-base font-bold ${TEXT_COLOR_MAP[item.color]}`}
                >
                  {item.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                  {item.description}
                </p>
                {item.note && (
                  <p className="mt-2 rounded-lg bg-white/60 px-3 py-2 text-xs leading-relaxed text-muted">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Support services */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <WatercolorIcon name="phone" size={20} className="text-sage-600" />
            電話相談窓口
          </h2>
          <div className="mt-4 space-y-3">
            {SUPPORT_SERVICES.map((service) => (
              <div
                key={service.name}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {service.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-sm font-bold text-sage-700">
                    {service.number}
                  </span>
                  <span className="text-xs text-muted">{service.hours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist link */}
        <div className="mt-10 rounded-xl border border-sage-200 bg-gradient-to-r from-sage-50 to-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-100">
              <WatercolorIcon
                name="clipboard"
                size={24}
                className="text-sage-600"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-base font-bold text-foreground">
                手続きの漏れがないかチェック
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                婚姻届から名義変更まで、やることリストで確認
              </p>
            </div>
            <Link
              href="/checklists"
              className="shrink-0 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700"
            >
              チェックリスト
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
          ※ 掲載情報は2025年4月時点のものです。受付時間・対応内容は変更される場合があります。最新情報は各機関のウェブサイトでご確認ください。
        </div>
      </div>
    </div>
  );
}
