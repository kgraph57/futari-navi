import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "結婚手続き用語集",
  description:
    "婚姻届・戸籍・名義変更・税金控除など、結婚手続きでよく出てくる用語をわかりやすく解説。",
};

interface GlossaryTerm {
  readonly term: string;
  readonly reading: string;
  readonly description: string;
  readonly relatedLink?: { readonly href: string; readonly label: string };
}

interface GlossaryGroup {
  readonly heading: string;
  readonly terms: readonly GlossaryTerm[];
}

const GLOSSARY: readonly GlossaryGroup[] = [
  {
    heading: "婚姻届・戸籍",
    terms: [
      {
        term: "婚姻届",
        reading: "こんいんとどけ",
        description:
          "法律上の夫婦になるために市区町村役場に提出する届出書。証人2名の署名が必要。届出日が入籍日となる。",
        relatedLink: { href: "/checklists", label: "手続きチェックリスト" },
      },
      {
        term: "戸籍謄本（全部事項証明書）",
        reading: "こせきとうほん",
        description:
          "戸籍に記載されている全員の情報を証明する書類。本籍地以外の市区町村に婚姻届を出す場合に必要。マイナンバーカードがあればコンビニ交付も可能。",
      },
      {
        term: "本籍地",
        reading: "ほんせきち",
        description:
          "戸籍が置かれている場所。婚姻届提出時に新しい本籍地を自由に決められる。実際の住所と異なっていてもよい。",
      },
      {
        term: "入籍",
        reading: "にゅうせき",
        description:
          "婚姻届が受理され、新しい戸籍が編製されること。一般的には「結婚した日」として使われる。婚姻届の届出日＝入籍日となる。",
      },
      {
        term: "証人",
        reading: "しょうにん",
        description:
          "婚姻届に署名する立会人。成年2名が必要。親族・友人など誰でもなれる。住所・本籍の記入と署名が必要。",
      },
    ],
  },
  {
    heading: "名義変更・届出",
    terms: [
      {
        term: "転入届・転居届",
        reading: "てんにゅうとどけ・てんきょとどけ",
        description:
          "引っ越しに伴う届出。異なる市区町村への引っ越しは転入届（14日以内）、同じ市区町村内は転居届。婚姻届と同時に提出できる場合も。",
      },
      {
        term: "氏名変更（改姓）",
        reading: "しめいへんこう",
        description:
          "結婚により姓が変わった場合に必要な各種手続き。運転免許証・パスポート・銀行口座・クレジットカード・保険など、多岐にわたる。",
        relatedLink: { href: "/checklists", label: "名義変更チェックリスト" },
      },
      {
        term: "届出印",
        reading: "とどけでいん",
        description:
          "銀行口座開設時に届け出た印鑑。姓が変わる場合は届出印の変更手続きが必要。届出印を紛失している場合は再登録が必要。",
      },
      {
        term: "マイナンバーカード",
        reading: "まいなんばーかーど",
        description:
          "個人番号が記載されたICカード。姓や住所が変わったら市区町村窓口で券面記載事項変更の手続きが必要。電子証明書の再発行も同時に行う。",
      },
    ],
  },
  {
    heading: "保険・年金",
    terms: [
      {
        term: "健康保険の被扶養者",
        reading: "けんこうほけんのひふようしゃ",
        description:
          "配偶者の健康保険に扶養として入ること。年収130万円未満（60歳未満）が条件。扶養に入ると保険料の自己負担なし。",
      },
      {
        term: "国民年金の第3号被保険者",
        reading: "こくみんねんきんのだいさんごうひほけんしゃ",
        description:
          "会社員・公務員（第2号被保険者）の配偶者で年収130万円未満の場合に該当。保険料の自己負担なしで将来の年金を受け取れる。",
      },
      {
        term: "受取人変更",
        reading: "うけとりにんへんこう",
        description:
          "生命保険・医療保険の保険金受取人を配偶者に変更する手続き。結婚後に忘れがちだが、万一の際に重要。保険会社への連絡で手続きできる。",
      },
    ],
  },
  {
    heading: "税金・控除",
    terms: [
      {
        term: "配偶者控除",
        reading: "はいぐうしゃこうじょ",
        description:
          "配偶者の年間合計所得が48万円以下（給与収入103万円以下）の場合に適用される所得控除。最大38万円が控除される。",
        relatedLink: { href: "/simulator", label: "給付金シミュレーター" },
      },
      {
        term: "配偶者特別控除",
        reading: "はいぐうしゃとくべつこうじょ",
        description:
          "配偶者の所得が48万円超133万円以下の場合に段階的に適用される控除。配偶者控除の対象外でも一定の控除が受けられる。",
      },
      {
        term: "扶養控除等申告書",
        reading: "ふようこうじょとうしんこくしょ",
        description:
          "勤務先に提出する書類で、配偶者や扶養親族の情報を申告する。結婚したら速やかに会社に届け出て、書類を更新する。",
      },
      {
        term: "年末調整",
        reading: "ねんまつちょうせい",
        description:
          "会社が年末に行う税金の精算手続き。結婚した年は配偶者控除が適用される可能性がある。年の途中で結婚した場合も12月31日時点の状況で判定。",
      },
    ],
  },
  {
    heading: "住まい・生活",
    terms: [
      {
        term: "世帯合併",
        reading: "せたいがっぺい",
        description:
          "同じ住所に住む別世帯を一つにまとめる届出。結婚して同居する場合に行う。世帯主をどちらにするか決める必要がある。",
      },
      {
        term: "住民票",
        reading: "じゅうみんひょう",
        description:
          "住所地の市区町村が発行する住所・氏名・世帯構成などの証明書。名義変更の際に新姓の住民票が求められることが多い。",
      },
      {
        term: "印鑑登録",
        reading: "いんかんとうろく",
        description:
          "実印として使う印鑑を市区町村に届け出ること。姓が変わった場合は旧姓の印鑑登録は自動的に廃止されるため、新姓で再登録が必要。",
      },
    ],
  },
] as const;

function GlossaryJsonLd() {
  const allTerms = GLOSSARY.flatMap((group) => group.terms);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "ふたりナビ 結婚手続き用語集",
    description:
      "結婚手続きでよく出てくる用語をわかりやすく解説",
    hasDefinedTerm: allTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.description,
      inDefinedTermSet: "ふたりナビ 結婚手続き用語集",
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function GlossaryPage() {
  return (
    <>
      <GlossaryJsonLd />
      <div className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <SectionHeading subtitle="結婚手続きでよく出てくる用語をわかりやすく解説">
            結婚手続き用語集
          </SectionHeading>

          {/* Jump navigation */}
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="カテゴリ移動">
            {GLOSSARY.map((group) => (
              <a
                key={group.heading}
                href={`#glossary-${group.heading}`}
                className="inline-flex rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50"
              >
                {group.heading}
              </a>
            ))}
          </nav>

          <div className="mt-10 space-y-12">
            {GLOSSARY.map((group) => (
              <section key={group.heading} id={`glossary-${group.heading}`} className="scroll-mt-20">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <WatercolorIcon
                    name="book"
                    size={20}
                    className="text-teal-600"
                  />
                  {group.heading}
                </h2>
                <dl className="mt-4 space-y-4">
                  {group.terms.map((t) => (
                    <div
                      key={t.term}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <dt className="font-heading text-sm font-semibold text-foreground">
                        {t.term}
                        <span className="ml-2 text-xs font-normal text-muted">
                          （{t.reading}）
                        </span>
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted">
                        {t.description}
                      </dd>
                      {t.relatedLink && (
                        <dd className="mt-2">
                          <Link
                            href={t.relatedLink.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
                          >
                            {t.relatedLink.label}
                            <WatercolorIcon name="arrow_right" size={12} />
                          </Link>
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-10 rounded-lg bg-ivory-100 p-4 text-xs leading-relaxed text-muted">
            ※
            この用語集は一般的な説明を目的としたものです。個別の手続きについては、お住まいの市区町村窓口や専門家にご相談ください。
          </div>
        </div>
      </div>
    </>
  );
}
