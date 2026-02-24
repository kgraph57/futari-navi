import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "すくすくナビに関するお問い合わせはこちらから。メールでご連絡ください。",
};

const INQUIRY_TYPES = [
  {
    iconName: "users" as const,
    label: "保護者の方からの質問・フィードバック",
    description:
      "記事の内容に関するご質問、テーマのリクエスト、誤りのご指摘など。",
    subject: "【すくすくナビ】質問・フィードバック",
  },
  {
    iconName: "building" as const,
    label: "医療機関・自治体との連携について",
    description:
      "退院時資料への掲載、保健センターでの配布、データ連携などのご相談。",
    subject: "【すくすくナビ】連携のご相談",
  },
  {
    iconName: "message" as const,
    label: "メディア・取材について",
    description: "すくすくナビに関する取材・掲載のお問い合わせ。",
    subject: "【すくすくナビ】取材・メディア掲載",
  },
] as const;

const GUIDELINES = [
  {
    iconName: "shield" as const,
    title: "個人情報の保護",
    description:
      "お問い合わせの際は、お子さまの氏名や具体的な症状など、個人を特定できる情報の記載はお控えください。",
  },
  {
    iconName: "message" as const,
    title: "お問い合わせの範囲",
    description:
      "サイトの内容に関するご質問、記事のリクエスト、誤りのご指摘、メルマガに関するお問い合わせ等を受け付けています。",
  },
  {
    iconName: "clock" as const,
    title: "回答について",
    description:
      "お問い合わせへの回答は通常3～5営業日以内にメールで行います。内容によっては回答にお時間をいただく場合があります。",
  },
];

export default function ContactPage() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading subtitle="ご質問・ご意見をお待ちしています">
          お問い合わせ
        </SectionHeading>

        {/* Important Notice */}
        <div className="mt-10 rounded-xl border-2 border-red-100 bg-red-50/50 p-5">
          <p className="text-sm font-medium text-red-800">
            個別の医療相談にはお答えできません
          </p>
          <p className="mt-1 text-sm leading-relaxed text-red-700/80">
            お子さまの具体的な症状や治療に関するご質問は、かかりつけの小児科にご相談ください。緊急時は迷わず119番に電話してください。
          </p>
        </div>

        {/* Inquiry Type Cards */}
        <div className="mt-10">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            お問い合わせの種別
          </h2>
          <p className="mt-2 text-sm text-muted">
            ご用件に合ったカテゴリをお選びください。件名が自動で入力されます。
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {INQUIRY_TYPES.map((type) => (
              <a
                key={type.label}
                href={`mailto:contact@sukusuku-navi.jp?subject=${encodeURIComponent(type.subject)}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <WatercolorIcon name={type.iconName} size={28} />
                </div>
                <h3 className="mt-3 font-heading text-sm font-semibold text-foreground group-hover:text-teal-700">
                  {type.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {type.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                  メールを送る
                  <WatercolorIcon name="arrow_right" size={12} />
                </span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            送信先: contact@sukusuku-navi.jp
          </p>
        </div>

        {/* Guidelines */}
        <div className="mt-10">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            お問い合わせの際のお願い
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {GUIDELINES.map((guideline) => (
              <div key={guideline.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-50">
                  <WatercolorIcon name={guideline.iconName} size={32} />
                </div>
                <h3 className="mt-3 font-heading text-sm font-semibold text-foreground">
                  {guideline.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {guideline.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ-like section */}
        <div className="mt-10 rounded-xl bg-ivory-100 p-6">
          <h2 className="font-heading text-base font-semibold text-foreground">
            よくあるお問い合わせ
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Q. メルマガの配信停止はどうすればよいですか？
              </p>
              <p className="mt-1 text-sm text-muted">
                A.
                Substackのメール下部にある「Unsubscribe」リンクから、いつでも解除できます。解除後すぐに配信が停止されます。
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Q. 記事の内容について質問したいのですが。
              </p>
              <p className="mt-1 text-sm text-muted">
                A.
                記事の医学的内容に関するご質問はメールでお送りください。今後の記事の参考にさせていただきます。ただし、個別の医療相談にはお答えできません。
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Q. 取り上げてほしいテーマのリクエストはできますか？
              </p>
              <p className="mt-1 text-sm text-muted">
                A.
                はい、ぜひリクエストをお送りください。読者の皆さまの声を参考に、今後のテーマを検討しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
