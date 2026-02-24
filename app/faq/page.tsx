import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "すくすくナビの使い方、予防接種、給付金シミュレーター、受診判断ガイドなどに関するよくある質問と回答。",
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
    title: "すくすくナビの使い方",
    iconName: "book",
    items: [
      {
        question: "すくすくナビとは何ですか？",
        answer:
          "愛育病院の小児科医が開発した、港区の子育て支援情報サイトです。お子さんの生年月日を登録するだけで、予防接種・届出・健診などのやるべきことが自動で表示されます。",
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
          "はい。ブラウザのメニューから「ホーム画面に追加」を選ぶと、アプリのように使えます。プッシュ通知にも対応予定です。",
      },
      {
        question: "データはどこに保存されますか？",
        answer:
          "お子さんの情報はお使いのスマホのブラウザ内（ローカルストレージ）に保存されます。サーバーに送信されることはありません。アカウント登録した場合は、暗号化された状態でクラウドに同期されます。",
      },
    ],
  },
  {
    title: "タイムライン・手続き",
    iconName: "calendar",
    items: [
      {
        question: "タイムラインには何が表示されますか？",
        answer:
          "お子さんの月齢に応じた予防接種、乳幼児健診、届出・申請の期限、発達マイルストーンなどが時系列で表示されます。",
        link: { href: "/my/timeline", label: "タイムラインを見る" },
      },
      {
        question: "子どもを複数人登録できますか？",
        answer:
          "はい。マイページから複数のお子さんを登録できます。お子さんごとにタイムラインが切り替わります。",
        link: { href: "/my", label: "マイページへ" },
      },
      {
        question: "港区以外でも使えますか？",
        answer:
          "記事や受診判断ガイドは全国共通で使えます。ただし、助成金・支援制度・保育園情報は港区に特化しているため、他の地域では一部の情報が該当しない場合があります。",
      },
    ],
  },
  {
    title: "予防接種",
    iconName: "syringe",
    items: [
      {
        question: "予防接種のスケジュールはどう確認できますか？",
        answer:
          "「予防接種ガイド」ページで、定期接種・任意接種の一覧とスケジュールを確認できます。タイムラインに生年月日を登録すると、接種時期が自動で表示されます。",
        link: { href: "/vaccines", label: "予防接種ガイドへ" },
      },
      {
        question: "任意接種はどれを受けるべきですか？",
        answer:
          "おたふくかぜ、インフルエンザなどの任意接種は、かかりつけ医に相談して決めましょう。港区では一部の任意接種に助成があります。詳しくは予防接種ガイドをご覧ください。",
      },
      {
        question: "予防接種の副反応が心配です。",
        answer:
          "各ワクチンの詳細ページで、よくある副反応と対処法を説明しています。発熱や接種部位の腫れは一般的な反応ですが、ぐったりしている場合は医療機関を受診してください。",
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
          "児童手当、出産・子育て応援給付金、医療費助成、保育料補助など、港区の主な子育て支援制度をカバーしています。",
        link: { href: "/programs", label: "制度一覧を見る" },
      },
    ],
  },
  {
    title: "受診判断ガイド",
    iconName: "stethoscope",
    items: [
      {
        question: "受診判断ガイドの結果に従えばいいですか？",
        answer:
          "本ガイドは一般的な目安を示すもので、個別の診断ではありません。お子さんの状態が心配な場合は、結果に関わらずかかりつけ医にご相談ください。",
        link: { href: "/triage", label: "受診判断ガイドへ" },
      },
      {
        question: "夜間や休日に子どもが急病のときはどうすればいいですか？",
        answer:
          "まず#7119（救急安心センター東京）に電話してください。24時間、看護師に相談できます。意識がない・呼吸がおかしいなど緊急時は迷わず119番を呼んでください。",
        link: { href: "/emergency", label: "緊急連絡先を見る" },
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
          "Substackのメール下部にある「Unsubscribe」リンクから、いつでも解除できます。解除後すぐに配信が停止されます。",
      },
      {
        question: "記事の内容について質問できますか？",
        answer:
          "はい。お問い合わせページからメールでご質問いただけます。ただし、個別の医療相談にはお答えできません。",
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
          <SectionHeading subtitle="すくすくナビの使い方や機能について">
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
