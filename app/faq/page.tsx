import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "ふたりナビの使い方、結婚手続き、給付金シミュレーター、名義変更などに関するよくある質問と回答。",
};

interface FaqItem {
  readonly question: string;
  readonly answer: string;
  readonly link?: { readonly href: string; readonly label: string };
}

interface FaqCategory {
  readonly title: string;
  readonly iconName: "book" | "syringe" | "calculator" | "stethoscope" | "calendar" | "users" | "shield" | "mail";
  readonly items: readonly FaqItem[];
}

const FAQ_DATA: readonly FaqCategory[] = [
  {
    title: "ふたりナビの使い方",
    iconName: "book",
    items: [
      {
        question: "ふたりナビとは何ですか？",
        answer:
          "新婚カップル向けの行政手続き・給付金ナビゲーターです。婚姻届の提出から名義変更、税金の手続きまで、やるべきことが一目でわかります。",
        link: { href: "/about", label: "詳しくはこちら" },
      },
      {
        question: "利用料はかかりますか？",
        answer:
          "すべての機能を無料でお使いいただけます。アカウント登録なしでも多くの機能をご利用いただけます。",
      },
      {
        question: "スマホのホーム画面に追加できますか？",
        answer:
          "はい。ブラウザのメニューから「ホーム画面に追加」を選ぶと、アプリのように使えます。",
      },
      {
        question: "データはどこに保存されますか？",
        answer:
          "手続きの進捗情報はお使いのスマホのブラウザ内（ローカルストレージ）に保存されます。サーバーに送信されることはありません。アカウント登録した場合は、暗号化された状態でクラウドに同期されます。",
      },
    ],
  },
  {
    title: "結婚手続き・チェックリスト",
    iconName: "calendar",
    items: [
      {
        question: "チェックリストには何が表示されますか？",
        answer:
          "婚姻届の提出、氏名・住所変更、保険・年金の手続き、銀行口座やクレジットカードの名義変更など、結婚に伴う手続きが時系列で表示されます。",
        link: { href: "/checklists", label: "チェックリストを見る" },
      },
      {
        question: "港区以外でも使えますか？",
        answer:
          "記事や一般的な手続きガイドは全国共通で使えます。ただし、助成金・支援制度の一部は港区に特化しているため、他の地域では該当しない場合があります。",
      },
    ],
  },
  {
    title: "給付金シミュレーター",
    iconName: "calculator",
    items: [
      {
        question: "シミュレーターの結果は正確ですか？",
        answer:
          "港区の公式情報に基づいて算出していますが、あくまで目安です。実際の受給額は申請先の窓口でご確認ください。",
        link: { href: "/simulator", label: "シミュレーターを試す" },
      },
      {
        question: "どのような制度に対応していますか？",
        answer:
          "結婚新生活支援事業、住居費補助、引っ越し費用助成など、港区の新婚カップル向け支援制度をカバーしています。",
        link: { href: "/programs", label: "制度一覧を見る" },
      },
    ],
  },
  {
    title: "メルマガ・お問い合わせ",
    iconName: "mail",
    items: [
      {
        question: "メルマガの配信停止はどうすればよいですか？",
        answer:
          "メール下部にある「Unsubscribe」リンクから、いつでも解除できます。解除後すぐに配信が停止されます。",
      },
      {
        question: "記事の内容について質問できますか？",
        answer:
          "はい。お問い合わせページからメールでご質問いただけます。ただし、個別の法律・税務相談にはお答えできません。",
        link: { href: "/contact", label: "お問い合わせへ" },
      },
      {
        question: "取り上げてほしいテーマのリクエストはできますか？",
        answer:
          "ぜひお送りください。読者の皆さまの声を参考に、今後のテーマを検討しています。",
        link: { href: "/contact", label: "リクエストを送る" },
      },
    ],
  },
] as const;

function FaqJsonLd() {
  const allItems = FAQ_DATA.flatMap((cat) => cat.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />
      <div className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading subtitle="ふたりナビの使い方や機能について">
            よくある質問
          </SectionHeading>

          <div className="mt-10 space-y-10">
            {FAQ_DATA.map((category) => (
              <section key={category.title}>
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <WatercolorIcon
                    name={category.iconName}
                    size={20}
                    className="text-teal-600"
                  />
                  {category.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {category.items.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <p className="font-heading text-sm font-semibold text-foreground">
                        Q. {item.question}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        A. {item.answer}
                      </p>
                      {item.link && (
                        <Link
                          href={item.link.href}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
                        >
                          {item.link.label}
                          <WatercolorIcon name="arrow_right" size={12} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-10 rounded-xl bg-ivory-100 p-6 text-center">
            <p className="font-heading text-base font-semibold text-foreground">
              お探しの答えが見つかりませんでしたか？
            </p>
            <p className="mt-2 text-sm text-muted">
              お気軽にお問い合わせください。
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              <WatercolorIcon name="mail" size={16} />
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
