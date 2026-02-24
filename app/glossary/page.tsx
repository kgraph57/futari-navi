import type { Metadata } from "next";
import Link from "next/link";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "小児科用語集",
  description:
    "子育てでよく出てくる医学用語・小児科用語をわかりやすく解説。予防接種、感染症、発達、アレルギーなどの用語一覧。",
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
    heading: "予防接種",
    terms: [
      {
        term: "定期接種",
        reading: "ていきせっしゅ",
        description:
          "予防接種法に基づき、対象年齢の間は無料で受けられるワクチン接種。BCG、四種混合、MR（麻しん風しん）などが該当。",
        relatedLink: { href: "/vaccines", label: "予防接種ガイド" },
      },
      {
        term: "任意接種",
        reading: "にんいせっしゅ",
        description:
          "定期接種以外のワクチン。おたふくかぜ、インフルエンザなど。港区では一部に助成あり。費用は自己負担の場合がある。",
      },
      {
        term: "副反応",
        reading: "ふくはんのう",
        description:
          "ワクチン接種後に起こる体の反応。接種部位の腫れや発熱が一般的。多くは数日で治まるが、高熱やぐったりする場合は医療機関へ。",
      },
      {
        term: "同時接種",
        reading: "どうじせっしゅ",
        description:
          "複数のワクチンを1回の受診で接種すること。安全性は確立されており、接種スケジュールの効率化につながる。",
      },
      {
        term: "追加接種（ブースター）",
        reading: "ついかせっしゅ",
        description:
          "初回接種後に免疫を強化するために行う追加のワクチン接種。時間が経つと免疫が低下するため、定められた時期に接種する。",
      },
    ],
  },
  {
    heading: "感染症",
    terms: [
      {
        term: "潜伏期間",
        reading: "せんぷくきかん",
        description:
          "病原体に感染してから症状が現れるまでの期間。感染症によって異なり、インフルエンザは1〜3日、水痘は14〜16日程度。",
        relatedLink: {
          href: "/infection-alerts",
          label: "感染症アラート",
        },
      },
      {
        term: "飛沫感染",
        reading: "ひまつかんせん",
        description:
          "咳やくしゃみで飛び散る唾液の粒（飛沫）を吸い込んで感染すること。インフルエンザ、RSウイルスなどが代表的。",
      },
      {
        term: "接触感染",
        reading: "せっしょくかんせん",
        description:
          "ウイルスや細菌が付着したものに触れ、その手で目・鼻・口を触ることで感染すること。手洗いが最も効果的な予防法。",
      },
      {
        term: "出席停止期間",
        reading: "しゅっせきていしきかん",
        description:
          "感染症にかかった場合に学校・保育園を休む期間。学校保健安全法で疾患ごとに定められている。",
        relatedLink: {
          href: "/exclusion-periods",
          label: "出席停止期間を確認",
        },
      },
      {
        term: "抗菌薬（抗生物質）",
        reading: "こうきんやく",
        description:
          "細菌感染症を治療する薬。ウイルス感染症（風邪・インフルエンザ等）には効かない。医師の処方に従い、最後まで飲み切ることが大切。",
      },
    ],
  },
  {
    heading: "健診・発達",
    terms: [
      {
        term: "乳幼児健診",
        reading: "にゅうようじけんしん",
        description:
          "乳幼児の発育・発達を定期的にチェックする健康診査。港区では3〜4か月、6〜7か月、9〜10か月、1歳6か月、3歳児健診などを実施。",
        relatedLink: { href: "/checkups", label: "健診ガイド" },
      },
      {
        term: "発達マイルストーン",
        reading: "はったつまいるすとーん",
        description:
          "首すわり、寝返り、つかまり立ち、初語など、成長過程で多くの子どもが通る発達の節目。個人差が大きいため、目安として考える。",
        relatedLink: { href: "/my/timeline", label: "タイムライン" },
      },
      {
        term: "パーセンタイル（成長曲線）",
        reading: "ぱーせんたいる",
        description:
          "同じ月齢の子どもと比較した身長・体重の位置。例えば50パーセンタイルは真ん中。3〜97パーセンタイルの範囲内であれば標準的とされる。",
      },
      {
        term: "母子健康手帳",
        reading: "ぼしけんこうてちょう",
        description:
          "妊娠届出時に交付される手帳。妊婦健診、出産、予防接種、乳幼児健診の記録を一元管理する。2024年からデジタル化も進行中。",
      },
    ],
  },
  {
    heading: "アレルギー",
    terms: [
      {
        term: "アナフィラキシー",
        reading: "あなふぃらきしー",
        description:
          "アレルギー反応が全身に急速に広がった重篤な状態。じんましん、呼吸困難、血圧低下などが起こる。エピペン（アドレナリン自己注射薬）の使用と119番通報が必要。",
      },
      {
        term: "食物経口負荷試験",
        reading: "しょくもつけいこうふかしけん",
        description:
          "食物アレルギーの診断のため、医療機関でアレルゲン食品を少量ずつ食べて反応を確認する検査。専門医のもとで安全に行う。",
      },
      {
        term: "IgE抗体",
        reading: "あいじーいーこうたい",
        description:
          "アレルギー反応に関わる免疫グロブリン。血液検査で特定の食物やアレルゲンに対するIgE値を測定し、アレルギーの可能性を評価する。",
      },
      {
        term: "アトピー性皮膚炎",
        reading: "あとぴーせいひふえん",
        description:
          "かゆみのある湿疹が慢性的に繰り返される皮膚疾患。乳児期に多く、適切なスキンケアとステロイド外用薬による治療が基本。",
      },
    ],
  },
  {
    heading: "行政・制度",
    terms: [
      {
        term: "乳幼児医療費助成（マル乳・マル子）",
        reading: "にゅうようじいりょうひじょせい",
        description:
          "港区では中学3年生まで医療費の自己負担が無料。健康保険証と医療証を窓口で提示する。",
        relatedLink: { href: "/programs", label: "制度一覧" },
      },
      {
        term: "児童手当",
        reading: "じどうてあて",
        description:
          "中学校卒業まで（15歳到達後の最初の3月31日まで）の児童を養育する家庭に支給される手当。所得制限あり。出生後15日以内の申請が推奨。",
        relatedLink: { href: "/simulator", label: "給付金シミュレーター" },
      },
      {
        term: "出産育児一時金",
        reading: "しゅっさんいくじいちじきん",
        description:
          "出産にかかる費用の経済的負担を軽減するため、健康保険から支給される一時金。2023年4月から50万円に増額。",
      },
      {
        term: "産後ケア事業",
        reading: "さんごけあじぎょう",
        description:
          "産後の体調回復や育児を支援する事業。港区では宿泊型、デイサービス型、訪問型を実施。助産師による授乳指導や育児相談が受けられる。",
      },
    ],
  },
] as const;

function GlossaryJsonLd() {
  const allTerms = GLOSSARY.flatMap((group) => group.terms);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "すくすくナビ 小児科用語集",
    description:
      "子育てでよく出てくる医学用語・小児科用語をわかりやすく解説",
    hasDefinedTerm: allTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.description,
      inDefinedTermSet: "すくすくナビ 小児科用語集",
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
          <SectionHeading subtitle="子育てでよく出てくる医学用語をわかりやすく解説">
            小児科用語集
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
            この用語集は一般的な説明を目的としたものです。個別の症状や治療については、かかりつけの小児科医にご相談ください。
          </div>
        </div>
      </div>
    </>
  );
}
