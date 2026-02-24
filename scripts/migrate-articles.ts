/**
 * メルマガ vol*.md → content/articles/*.mdx 移行スクリプト
 *
 * Usage: npx tsx scripts/migrate-articles.ts
 */

import fs from "fs"
import path from "path"

const SOURCE_DIR = "/Users/kenokamoto/Desktop/AI MEDICINE/04_メルマガ/メルマガ"
const OUTPUT_DIR = path.join(process.cwd(), "content", "articles")

interface ArticleMeta {
  readonly slug: string
  readonly category: string
  readonly ageGroups: readonly string[]
  readonly description: string
}

// vol番号 → メタデータ手動マッピング
const ARTICLE_META: Record<number, ArticleMeta> = {
  1: {
    slug: "influenza-basics",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "インフルエンザの受診タイミング、検査の精度、A型vsB型の違いをQ&Aで解説",
  },
  2: {
    slug: "influenza-medication-and-abnormal-behavior",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "タミフルと異常行動の真実、ゾフルーザの耐性問題、48時間ルールの柔軟性を解説",
  },
  3: {
    slug: "influenza-vaccine-guide",
    category: "vaccination",
    ageGroups: ["all"],
    description: "注射vsフルミスト、効果、接種時期、卵アレルギーとワクチンの疑問に回答",
  },
  4: {
    slug: "influenza-home-care",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "インフルエンザ時の食事、入浴、登校基準などホームケアの疑問に回答",
  },
  5: {
    slug: "infant-influenza",
    category: "infectious-disease",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "赤ちゃん・乳幼児のインフルエンザ、けいれん・脳症のリスクと対処法",
  },
  6: {
    slug: "norovirus-basics",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "ノロウイルスの症状、感染経路、ホームケアをQ&Aで解説",
  },
  7: {
    slug: "norovirus-disinfection",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "ノロウイルスの消毒方法と二次感染予防の実践ガイド",
  },
  8: {
    slug: "minato-childcare-support",
    category: "municipal-service",
    ageGroups: ["all"],
    description: "港区の子育て支援・助成制度を網羅的にまとめた特集号",
  },
  9: {
    slug: "skincare-basics",
    category: "skin",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "赤ちゃんのスキンケアの基礎知識",
  },
  10: {
    slug: "one-month-checkup-faq",
    category: "checkup",
    ageGroups: ["0-6mo"],
    description: "1ヶ月健診でよくある質問と回答",
  },
  11: {
    slug: "fever-and-antipyretics",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "子どもの発熱と解熱剤にまつわる誤解を正す",
  },
  12: {
    slug: "antibiotics-for-cold-myth",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "風邪に抗生物質は効かない。正しい理解のためのQ&A",
  },
  13: {
    slug: "topical-steroids",
    category: "skin",
    ageGroups: ["all"],
    description: "ステロイド外用薬の正しい使い方と誤解の解消",
  },
  14: {
    slug: "febrile-seizures",
    category: "emergency",
    ageGroups: ["6-12mo", "1-3yr", "3-6yr"],
    description: "熱性けいれんの正しい対処法と知っておくべきこと",
  },
  15: {
    slug: "food-allergy-testing-myths",
    category: "allergy",
    ageGroups: ["all"],
    description: "食物アレルギー検査にまつわる誤解を解説",
  },
  16: {
    slug: "rsv-prevention",
    category: "infectious-disease",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "RSウイルスの予防と対策",
  },
  17: {
    slug: "infant-eczema-vs-atopic",
    category: "skin",
    ageGroups: ["0-6mo", "6-12mo"],
    description: "乳児湿疹とアトピー性皮膚炎の違いと見分け方",
  },
  18: {
    slug: "febrile-delirium",
    category: "emergency",
    ageGroups: ["1-3yr", "3-6yr", "6-12yr"],
    description: "熱せん妄の症状と対処法",
  },
  19: {
    slug: "simultaneous-vaccination-safety",
    category: "vaccination",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "同時接種の安全性についてエビデンスに基づいて解説",
  },
  20: {
    slug: "vitamin-k-and-breastfeeding",
    category: "nutrition",
    ageGroups: ["0-6mo"],
    description: "ビタミンKと母乳栄養の関係",
  },
  21: {
    slug: "hiccups-gas-straining",
    category: "checkup",
    ageGroups: ["0-6mo"],
    description: "赤ちゃんのしゃっくり、おなら、いきみについて",
  },
  22: {
    slug: "positional-plagiocephaly",
    category: "development",
    ageGroups: ["0-6mo"],
    description: "向き癖と頭の形の心配に答える",
  },
  23: {
    slug: "when-to-visit-er",
    category: "emergency",
    ageGroups: ["all"],
    description: "夜間受診の判断基準をわかりやすく解説",
  },
  24: {
    slug: "baby-food-allergy-prevention",
    category: "allergy",
    ageGroups: ["0-6mo", "6-12mo"],
    description: "離乳食とアレルギー予防の最新エビデンス",
  },
  25: {
    slug: "influenza-b-type-myths",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "インフルエンザB型にまつわる誤解を正す",
  },
  26: {
    slug: "breastmilk-vs-formula",
    category: "nutrition",
    ageGroups: ["0-6mo", "6-12mo"],
    description: "母乳とミルクの科学的な比較",
  },
  27: {
    slug: "sleep-training-safety",
    category: "development",
    ageGroups: ["0-6mo", "6-12mo"],
    description: "ネントレは脳に有害？エビデンスで検証",
  },
  28: {
    slug: "gastroenteritis-home-care",
    category: "infectious-disease",
    ageGroups: ["all"],
    description: "感染性胃腸炎のホームケア完全ガイド",
  },
  29: {
    slug: "choking-prevention-checklist",
    category: "emergency",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "子どもの窒息事故防止チェックリスト",
  },
  30: {
    slug: "one-month-checkup-mouth",
    category: "checkup",
    ageGroups: ["0-6mo"],
    description: "1ヶ月健診FAQ: 口の中の心配に答える",
  },
  31: {
    slug: "nursery-cold-rush",
    category: "infectious-disease",
    ageGroups: ["1-3yr"],
    description: "保育園入園後の風邪ラッシュへの対処法",
  },
  32: {
    slug: "kawasaki-disease-signs",
    category: "emergency",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr", "3-6yr"],
    description: "川崎病の6つのサインと早期発見のポイント",
  },
  33: {
    slug: "reverse-wave-is-ok",
    category: "development",
    ageGroups: ["6-12mo", "1-3yr"],
    description: "逆さバイバイは発達障害のサイン？心配しすぎないために",
  },
  34: {
    slug: "baby-blood-in-stool",
    category: "emergency",
    ageGroups: ["0-6mo", "6-12mo"],
    description: "赤ちゃんの血便の原因と対処法",
  },
  35: {
    slug: "three-four-month-checkup-faq",
    category: "checkup",
    ageGroups: ["0-6mo"],
    description: "3-4ヶ月健診でよくある質問と回答",
  },
  36: {
    slug: "childhood-constipation",
    category: "nutrition",
    ageGroups: ["6-12mo", "1-3yr", "3-6yr"],
    description: "子どもの便秘の原因と対処法",
  },
  37: {
    slug: "exanthem-subitum",
    category: "infectious-disease",
    ageGroups: ["6-12mo", "1-3yr"],
    description: "突発性発疹の経過と対処法",
  },
  38: {
    slug: "rsv-and-bronchiolitis",
    category: "infectious-disease",
    ageGroups: ["0-6mo", "6-12mo"],
    description: "RSウイルスと細気管支炎の症状・治療・予防",
  },
  39: {
    slug: "hand-foot-mouth-disease",
    category: "infectious-disease",
    ageGroups: ["6-12mo", "1-3yr", "3-6yr"],
    description: "手足口病の症状と家庭でのケア",
  },
  40: {
    slug: "herpangina",
    category: "infectious-disease",
    ageGroups: ["6-12mo", "1-3yr", "3-6yr"],
    description: "ヘルパンギーナの特徴と対処法",
  },
  41: {
    slug: "diaper-rash-vs-candida",
    category: "skin",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "おむつかぶれとカンジダの見分け方",
  },
  42: {
    slug: "otitis-media",
    category: "infectious-disease",
    ageGroups: ["6-12mo", "1-3yr", "3-6yr"],
    description: "子どもの中耳炎の原因・治療・予防",
  },
  43: {
    slug: "nosebleed-in-children",
    category: "emergency",
    ageGroups: ["1-3yr", "3-6yr", "6-12yr"],
    description: "子どもの鼻血の正しい止め方と注意点",
  },
  44: {
    slug: "childhood-headache",
    category: "emergency",
    ageGroups: ["3-6yr", "6-12yr"],
    description: "子どもの頭痛の種類と受診の目安",
  },
  45: {
    slug: "vaccination-schedule",
    category: "vaccination",
    ageGroups: ["0-6mo", "6-12mo", "1-3yr"],
    description: "予防接種スケジュールの考え方と組み立てのコツ",
  },
  46: {
    slug: "iron-deficiency-anemia",
    category: "nutrition",
    ageGroups: ["6-12mo", "1-3yr", "3-6yr"],
    description: "子どもの鉄欠乏性貧血の症状・原因・予防",
  },
  47: {
    slug: "chickenpox",
    category: "infectious-disease",
    ageGroups: ["1-3yr", "3-6yr"],
    description: "水ぼうそう（水痘）の症状・治療・予防接種",
  },
  48: {
    slug: "mumps-vaccine",
    category: "vaccination",
    ageGroups: ["1-3yr", "3-6yr"],
    description: "おたふくかぜワクチンの必要性と接種時期",
  },
  49: {
    slug: "mumps-complications",
    category: "infectious-disease",
    ageGroups: ["1-3yr", "3-6yr", "6-12yr"],
    description: "おたふく風邪の合併症とリスク",
  },
  50: {
    slug: "arfid",
    category: "nutrition",
    ageGroups: ["1-3yr", "3-6yr", "6-12yr"],
    description: "ARFID（回避・制限性食物摂取症）の症状・診断・治療",
  },
}

function extractVolNumber(filename: string): number | null {
  const match = filename.match(/vol(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

function extractTitle(content: string): string {
  const lines = content.split("\n")
  for (const line of lines) {
    if (line.startsWith("## ")) {
      return line.replace(/^## /, "").trim()
    }
  }
  return ""
}

function extractKeyPoints(content: string): readonly string[] {
  const points: string[] = []
  const lines = content.split("\n")
  let inPointsBlock = false

  for (const line of lines) {
    if (line.includes("今号のポイント")) {
      inPointsBlock = true
      continue
    }
    if (inPointsBlock) {
      const pointMatch = line.match(/>\s*\d+\.\s*(.+)/)
      if (pointMatch) {
        points.push(pointMatch[1].trim())
      } else if (line.trim() === "" || (!line.startsWith(">") && line.trim() !== "")) {
        if (points.length > 0) break
      }
    }
  }

  return points
}

function countQA(content: string): number {
  const matches = content.match(/###\s*Q\d+/g)
  return matches ? matches.length : 0
}

function countReferences(content: string): number {
  const refSection = content.match(/##\s*参考文献[\s\S]*$/m)
  if (!refSection) return 0
  const refs = refSection[0].match(/\[\d+\]/g)
  return refs ? new Set(refs).size : 0
}

function buildRelatedSlugs(vol: number, meta: Record<number, ArticleMeta>): readonly string[] {
  const current = meta[vol]
  if (!current) return []

  return Object.entries(meta)
    .filter(
      ([v, m]) =>
        parseInt(v) !== vol &&
        m.category === current.category
    )
    .slice(0, 3)
    .map(([, m]) => m.slug)
}

function migrate() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.startsWith("vol") && f.endsWith(".md"))

  let converted = 0
  let skipped = 0

  for (const file of files) {
    const vol = extractVolNumber(file)
    if (vol === null || !ARTICLE_META[vol]) {
      console.log(`SKIP: ${file} (no metadata mapping)`)
      skipped++
      continue
    }

    const meta = ARTICLE_META[vol]
    const content = fs.readFileSync(path.join(SOURCE_DIR, file), "utf-8")
    const title = extractTitle(content)
    const keyPoints = extractKeyPoints(content)
    const qaCount = countQA(content)
    const referenceCount = countReferences(content)
    const relatedSlugs = buildRelatedSlugs(vol, ARTICLE_META)

    const frontmatter = [
      "---",
      `slug: "${meta.slug}"`,
      `vol: ${vol}`,
      `title: "${title.replace(/"/g, '\\"')}"`,
      `description: "${meta.description.replace(/"/g, '\\"')}"`,
      `category: "${meta.category}"`,
      `ageGroups: [${meta.ageGroups.map((a) => `"${a}"`).join(", ")}]`,
      `publishedAt: "2026-02-01"`,
      `keyPoints:`,
      ...keyPoints.map((kp) => `  - "${kp.replace(/"/g, '\\"')}"`),
      `qaCount: ${qaCount}`,
      `referenceCount: ${referenceCount}`,
      `relatedSlugs: [${relatedSlugs.map((s) => `"${s}"`).join(", ")}]`,
      "---",
    ].join("\n")

    const mdxContent = `${frontmatter}\n\n${content}`
    const outputPath = path.join(OUTPUT_DIR, `${meta.slug}.mdx`)

    fs.writeFileSync(outputPath, mdxContent, "utf-8")
    console.log(`OK: vol${String(vol).padStart(3, "0")} → ${meta.slug}.mdx (Q&A: ${qaCount}, refs: ${referenceCount})`)
    converted++
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped`)
}

migrate()
