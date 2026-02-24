import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { getAllNurseries, NURSERY_TYPE_LABELS } from "@/lib/nurseries";
import type { NurseryType } from "@/lib/types";
import { NurseryFilter } from "@/components/nursery/nursery-filter";

export const metadata: Metadata = {
  title: "港区の保育園を探す｜保活ガイド",
  description:
    "港区の認可保育園・認証保育所・小規模保育・認定こども園を一覧で検索。エリア・種別・年齢でフィルタリング。保活のスケジュール・必要書類・利用調整指数も解説。",
};

const HOKATSU_STEPS = [
  {
    month: "4〜9月",
    title: "情報収集・見学",
    description:
      "港区HPで保育施設一覧を確認。気になる園に電話して見学予約。複数園（5〜10園）を比較しましょう。港区は全国でも競争率が高いエリアです。",
  },
  {
    month: "10月上旬",
    title: "「入園のごあんない」公開・書類準備",
    description:
      "港区HPで「保育園入園のごあんない」が公開されます。就労証明書（勤務先に依頼）・課税証明書等を早めに準備。",
  },
  {
    month: "11月上旬〜下旬",
    title: "4月入園の一次申込（締切厳守）",
    description:
      "郵送・電子申請は11月上旬〜下旬、窓口は12月上旬まで。電子申請が便利です。希望園は優先順位をつけて記入。",
  },
  {
    month: "1月末",
    title: "一次選考結果通知",
    description:
      "内定の場合は面接・健康診断へ。不承諾の場合は二次募集（1月下旬〜2月上旬締切）に申込可能。",
  },
  {
    month: "3月",
    title: "入園準備・慣らし保育",
    description:
      "内定園の入園説明会に参加。持ち物の準備、慣らし保育（1〜2週間）のスケジュール確認。職場と復帰日を調整。",
  },
] as const;

const REQUIRED_DOCS = [
  {
    name: "子どものための教育・保育給付認定申請書 + 家庭状況調査表",
    note: "港区HPからダウンロード、または電子申請で入力",
  },
  {
    name: "保育所入所等申込書 + 児童の健康状況申告書",
    note: "希望園を優先順位で記入。お子さんの健康状態も申告",
  },
  {
    name: "就労証明書",
    note: "勤務先に作成依頼（自営業は確定申告書の写し等）。転職予定の場合は内定証明書",
  },
  {
    name: "課税（非課税）証明書",
    note: "保育料の算定に使用。マイナンバー提示で省略可能な場合あり",
  },
  {
    name: "復職に関する誓約書（育休中の場合）",
    note: "育休からの復職時期を証明する書類",
  },
  {
    name: "その他（世帯状況による）",
    note: "ひとり親：戸籍謄本、障害：手帳の写し、疾病：診断書など",
  },
] as const;

const INDEX_EXAMPLES = [
  {
    condition: "就労（週5日以上・1日8h以上＝週40h以上）",
    points: "各20点",
    note: "父母それぞれに算出。両親フルタイムで合計40点",
  },
  {
    condition: "就労（週5日以上・1日6h〜8h未満）",
    points: "各18点",
    note: "時短勤務の場合",
  },
  {
    condition: "きょうだい同時入園・在園児きょうだい",
    points: "+1点",
    note: "加点項目。同じ園を希望する場合",
  },
  {
    condition: "双子以上の同時入園",
    points: "+1点",
    note: "加点項目",
  },
  {
    condition: "勤務実績3ヶ月未満",
    points: "−2点",
    note: "減点項目。転職直後は注意",
  },
  {
    condition: "同居の祖父母等が保育可能",
    points: "−3点",
    note: "減点項目。65歳未満の同居親族がいる場合",
  },
] as const;

function TypeSummaryCard({
  type,
  count,
}: {
  readonly type: NurseryType;
  readonly count: number;
}) {
  const descriptions: Record<NurseryType, string> = {
    licensed:
      "国の基準を満たした保育施設。保育料は世帯所得に応じて決定。最も一般的な選択肢。",
    certified:
      "東京都独自の基準で認証された施設。0〜2歳が中心。認可より小規模で延長保育が充実。",
    "small-scale":
      "定員6〜19名の小規模施設。0〜2歳対象。家庭的な雰囲気できめ細やかな保育。",
    kodomoen:
      "教育と保育を一体的に行う施設。幼稚園の教育機能と保育園の保育機能を併せ持つ。",
    "minato-room":
      "港区独自の保育施設。認可園に入れなかった方の受け皿。認可園申込時に加点あり。",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-card-foreground">
          {NURSERY_TYPE_LABELS[type]}
        </h3>
        <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-medium text-sage-700">
          {count}園
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        {descriptions[type]}
      </p>
    </div>
  );
}

export default function NurseriesPage() {
  const allNurseries = getAllNurseries();

  const countByType = (type: NurseryType) =>
    allNurseries.filter((n) => n.type === type).length;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-12 pt-12 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            <WatercolorIcon name="building" size={32} className="mr-2 inline-block   text-sage-600" />
            港区の保育園を探す
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            港区内の保育施設を種別・エリア・年齢で検索できます。全
            {allNurseries.length}
            施設の情報と、保活のスケジュール・必要書類も解説。
          </p>
        </div>
      </section>

      {/* Type Summary */}
      <section className="border-b border-border px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            保育施設の種類
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TypeSummaryCard type="licensed" count={countByType("licensed")} />
            <TypeSummaryCard
              type="certified"
              count={countByType("certified")}
            />
            <TypeSummaryCard
              type="small-scale"
              count={countByType("small-scale")}
            />
            <TypeSummaryCard type="kodomoen" count={countByType("kodomoen")} />
            <TypeSummaryCard
              type="minato-room"
              count={countByType("minato-room")}
            />
          </div>
        </div>
      </section>

      {/* Nursery List with Filters */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            保育施設一覧
          </h2>
          <div className="mt-4">
            <NurseryFilter nurseries={allNurseries} />
          </div>
        </div>
      </section>

      {/* 保活ガイド */}
      <section className="border-t border-border bg-sage-50/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
            <WatercolorIcon name="calendar" size={24} className="text-sage-600" />
            保活ガイド：4月入園までのスケジュール
          </h2>
          <p className="mt-2 text-sm text-muted">
            港区で4月入園を目指す場合の一般的なスケジュールです。年度により変動があるため、必ず港区HPで最新情報をご確認ください。
          </p>

          <div className="mt-6 space-y-4">
            {HOKATSU_STEPS.map((step, i) => (
              <div
                key={step.month}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-700">
                      {step.month}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-card-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 必要書類 */}
      <section className="border-t border-border px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
            <WatercolorIcon name="star" size={24} className="text-sage-600" />
            申込に必要な書類
          </h2>
          <div className="mt-6 space-y-2">
            {REQUIRED_DOCS.map((doc) => (
              <div
                key={doc.name}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <WatercolorIcon name="arrow_right" size={16} className="mt-0.5   shrink-0 text-sage-600" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {doc.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{doc.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted">
            ※上記は一般的な必要書類です。世帯の状況により追加書類が必要な場合があります。詳しくは港区役所にお問い合わせください。
          </p>
        </div>
      </section>

      {/* 利用調整指数 */}
      <section className="border-t border-border bg-ivory-100/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
            <WatercolorIcon name="help" size={24} className="text-sage-600" />
            利用調整指数（選考のしくみ）
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            認可保育園の選考は「利用調整指数」に基づいて行われます。基本指数（保育の必要性）と調整指数（加点・減点）の合計が高い順に内定が決まります。
          </p>

          <div className="mt-6 space-y-2">
            {INDEX_EXAMPLES.map((item) => (
              <div
                key={item.condition}
                className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground">
                    {item.condition}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{item.note}</p>
                </div>
                <span className="shrink-0 rounded-full bg-sage-100 px-3 py-1 text-sm font-bold text-sage-700">
                  {item.points}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-relaxed text-amber-800">
              <strong>ポイント：</strong>
              港区は全国でも特に競争率が高いエリアです。両親フルタイム（基本指数40点）だけでは人気園は難しく、きょうだい加点を含む41点以上が実質的なボーダーラインです。同点の場合は13項目の優先基準（港区在住・ひとり親・心身障害者世帯等）で調整されます。
            </p>
          </div>
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm leading-relaxed text-blue-800">
              <strong>問い合わせ先：</strong>
              子ども家庭支援部
              保育課（03-3578-2441）。各地区総合支所でも相談可能です。
            </p>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://www.city.minato.tokyo.jp/kodomo/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sage-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700"
            >
              港区 子ども家庭支援部のページ
              <WatercolorIcon name="arrow_right" size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
