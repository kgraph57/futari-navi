# 子育て支援サイト「すくすくナビ」実装プラン

## Context

港区の小児科医（おかもん）が、メルマガ60号分の医療コンテンツと港区の行政サービス情報を統合した子育て支援サイトを構築する。日本には「医療情報＋行政サービス＋給付金シミュレーター」を1つにまとめたサービスが存在しないため、この空白を埋める。

- 技術: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
- ブランド名: すくすくナビ（Sukusuku Navi）— 全国展開を見据えた地域非依存の名前
- 本番URL: https://kgraph57.github.io/sukusuku-navi/
- GitHub: https://github.com/kgraph57/sukusuku-navi
- デプロイ: GitHub Pages + GitHub Actions 自動デプロイ

---

## 現在のステータス（2026-02-21 時点）

| 機能 | 完成度 | 備考 |
|------|--------|------|
| 医療記事 60本 (MDX) | 95% | Q&A形式、参考文献付き |
| 給付金シミュレーター | 90% | 20+制度、4ステップウィザード |
| 受診判断トリアージ | 85% | 17症状、4段階判定 |
| 小児科マップ | 90% | Leaflet、12+クリニック |
| 手続きチェックリスト | 80% | 子どもごと進捗管理 |
| 保育園検索 | 90% | 80+施設、フィルタ |
| 乳幼児健診ガイド | 85% | 1ヶ月〜5歳 |
| 予防接種情報 | 80% | 20+ワクチン |
| マイページ | 70% | タイムライン、接種記録、マイルストーン |
| Supabase Auth | 90% | メール認証、ログインなしでも利用可 |
| PWA | 80% | Service Worker、インストール可能 |
| PostHog分析 | 70% | ページビュー + カスタムイベント11種 |
| OGP / Twitter Card | 80% | 動的OG画像生成 |
| フィードバックボタン | 80% | 5段階評価 + コメント |
| 全文検索 | 80% | /search |

### 技術スタック

- **フロントエンド**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **UIライブラリ**: shadcn/ui
- **コンテンツ**: MDX（60記事）+ JSON（構造化データ）
- **認証**: Supabase Auth（ログインなしでもlocalStorageで利用可）
- **永続化**: localStorage + Supabase ハイブリッド
- **地図**: Leaflet + React Leaflet
- **分析**: PostHog（ページビュー + カスタムイベント11種）
- **デプロイ**: GitHub Pages + GitHub Actions（静的エクスポート）
- **PWA**: Service Worker + manifest.json

---

## Phase 1: 基盤 + 記事 + シミュレーター — ✅ 完了

### 1-1. プロジェクト基盤

- ✅ Next.js 16 + TypeScript strict + Tailwind v4 + App Router
- ✅ shadcn/ui ベースUI
- ✅ フォント: Zen Maru Gothic（見出し）+ Noto Sans JP（本文）
- ✅ カラーシステム: ティール（信頼）+ コーラル（親しみ）+ オフホワイト背景
- ✅ レスポンシブ基盤 (mobile-first)
- ✅ PWA対応 (Service Worker + manifest.json)

### 1-2. メルマガMDX移行

- ✅ 移行スクリプト作成 (md → mdx + frontmatter)
- ✅ vol001-060 一括変換 (60記事)
- ✅ frontmatter定義 (slug, category, ageGroups, keyPoints)
- ✅ カテゴリ分類マッピング (10カテゴリ)

### 1-3. 記事表示システム

- ✅ `/articles` — 一覧（カテゴリ・年齢フィルター・検索）
- ✅ `/articles/[slug]` — 個別記事（MDXレンダリング）
- ✅ QABlock（LINE風チャットバブル）
- ✅ KeyPointsBox、CitationList、RelatedArticles
- ✅ ブックマーク機能

### 1-4. 給付金シミュレーター

- ✅ `/simulator/start` — 4ステップウィザード
- ✅ `/simulator/results` — 結果表示 + ライフプランタイムライン
- ✅ `/programs` — 制度一覧（20+制度）
- ✅ シミュレーション計算エンジン

---

## Phase 2: パーソナライズ + トリアージ + 地図 — ✅ 完了

### 2-1. パーソナライズ

- ✅ `/my` マイページ（子ども登録・チェックリスト進捗）
- ✅ localStorage + Supabase ハイブリッドストア
- ✅ Supabase Auth (メール認証)
- ✅ タイムラインエンジン（40+項目、緊急度分類）
- ✅ `/my/timeline` リスト表示 + カレンダー表示
- ✅ `/my/vaccinations` 予防接種記録
- ✅ `/my/milestones` 成長マイルストーン

### 2-2. 受診判断トリアージ

- ✅ ガイド付きフロー（緊急確認→年齢→症状→判定）
- ✅ 17症状の個別チェック
- ✅ 判定結果（4段階: 救急/今日中/翌日/ホームケア）

### 2-3. 港区小児科マップ

- ✅ `/clinics` Leafletインタラクティブ地図（12+クリニック）

### 2-4. 手続きチェックリスト

- ✅ `/checklists` 手続き一覧 + 子どもごと進捗管理

### 2-5. 追加実装

- ✅ `/vaccines` 予防接種情報（20+ワクチン）
- ✅ `/checkups` 乳幼児健診ガイド（1ヶ月〜5歳）
- ✅ `/nurseries` 保育園検索（80+施設）
- ✅ `/search` 全文検索

### 2-6. 分析・フィードバック

- ✅ PostHogカスタムイベント（11種: simulator, triage, timeline, feedback）
- ✅ OGP動的画像生成 + Twitter Card
- ✅ フィードバックボタン（5段階評価 + コメント）

---

## Phase 0-S: 社会実装の基盤固め — 🔥 最優先（2026年3月）

**目標: 「測れる状態」と「10人の実ユーザー」を作る**

### 分析基盤

- ✅ PostHogカスタムイベント実装（11イベント）
- ☐ PostHogファネル設計（TOP→機能利用→マイページ登録→定期利用）
- ☐ PostHogダッシュボード作成

### 初期ユーザー獲得

- ☐ 同僚3名にテスト利用依頼
- ☐ ユーザーインタビュー3名分を実施・記録
- ☐ 愛育病院でQRコード付き紹介カードを配布
- ☐ 10名の実ユーザー達成

### コミュニティ接点

- ☐ Code for Japan Slack 参加
- ☐ 港区子育て支援課への連絡

### ビルド修正

- ☐ PostHog @posthog/core 型エラー修正

---

## Phase 1-S: プロダクト完成 — 2026年4月目標

**目標: 「今週やること」が生年月日だけでわかる状態。50ユーザー**

### タイムラインMVP

- ☐ 「今週やること」3件に絞った表示
- ☐ 締切ベースの優先度ソート
- ☐ リマインド通知 (PWA push or email)

### LINE公式アカウント

- ☐ LINE公式アカウント開設
- ☐ 友だち追加→生年月日入力フロー
- ☐ 週1「今週のやること」プッシュ配信

---

## Phase 2-S: 社会実装の実績づくり — 2026年5-7月

**目標: 行政連携と外部認知の獲得。200ユーザー**

- ☐ 港区子育て支援課への説明・フィードバック取得
- ☐ 港区子育て応援サイトからのリンク獲得
- ☐ Code for Japan Brigadeで発表
- ☐ グッドデザイン賞2026応募（応募期間: 4-5月）
- ☐ 愛育病院での正式配布開始
- ☐ インパクトデータ収集
- ☐ ユーザー数200人達成

---

## Phase 3-S: 認知拡大と実績発信 — 2026年8-12月

**目標: 受賞・学会発表・他自治体展開準備。500ユーザー**

- ☐ 日本小児科学会 地方会で発表
- ☐ 総務省 地域情報化大賞 応募
- ☐ デジタル庁 Good Digital Award 応募
- ☐ 他自治体ホワイトラベル提案準備（品川区・渋谷区）
- ☐ 英語版の基盤構築
- ☐ ユーザー数500人達成

---

## ルートマップ（全ページ一覧）

```text
/                       トップページ
/articles               記事一覧
/articles/[slug]        個別記事（MDX）
/simulator              シミュレーターLP
/simulator/start        4ステップウィザード
/simulator/results      結果表示
/programs               制度一覧（20+制度）
/programs/[slug]        個別制度
/triage                 受診判断トリアージ
/triage/[symptom]       症状別チェック（17症状）
/clinics                港区小児科マップ
/vaccines               予防接種情報（20+ワクチン）
/checkups               乳幼児健診ガイド
/checkups/[slug]        個別健診
/nurseries              保育園検索（80+施設）
/nurseries/[slug]       個別保育園
/checklists             手続きチェックリスト
/checklists/[slug]      個別チェックリスト
/my                     マイページ
/my/timeline            パーソナライズドタイムライン
/my/vaccinations        予防接種記録
/my/milestones          成長マイルストーン
/my/settings            設定
/search                 全文検索
/about                  サイト紹介
/auth/login             ログイン
/auth/register          新規登録
/privacy                プライバシーポリシー
```

---

## ディレクトリ構成

```text
sukusuku-navi/
├── app/
│   ├── page.tsx, layout.tsx, providers.tsx
│   ├── opengraph-image.tsx
│   ├── articles/ [slug]/
│   ├── simulator/ start/ results/
│   ├── programs/ [slug]/
│   ├── triage/ [symptom]/
│   ├── clinics/
│   ├── vaccines/
│   ├── checkups/ [slug]/
│   ├── nurseries/ [slug]/
│   ├── checklists/ [slug]/
│   ├── my/ timeline/ vaccinations/ milestones/ settings/
│   ├── auth/ login/ register/ callback/
│   └── search/ about/ privacy/
├── components/
│   ├── ui/ layout/ article/ simulator/
│   ├── triage/ personalization/ clinic/
│   ├── nursery/ feedback/ pwa/ shared/
├── content/articles/          # 60 MDXファイル
├── data/                      # programs.json, clinics.json, nurseries.json,
│                              # checkups.json, vaccines.json, triage/
├── lib/
│   ├── content.ts             # MDX読み込み
│   ├── types.ts               # 型定義
│   ├── simulator/engine.ts    # シミュレーター計算
│   ├── triage/engine.ts       # トリアージ判断
│   ├── auth/                  # Supabase Auth
│   ├── store/                 # localStorage + Supabase
│   ├── analytics/             # PostHog + カスタムイベント
│   └── pwa/                   # Service Worker
├── docs/
│   ├── progress/TODO.yaml
│   ├── requirements/
│   └── research/
└── public/
```

---

## 参照ファイル

- `docs/progress/TODO.yaml` — 進捗・ロードマップ管理
- `docs/requirements/企画書.md` — 初期企画書
- `docs/business-plan/事業計画書_2026.html` — 事業計画書

---

## 検証

1. 60本全記事が正しくレンダリング
2. シミュレーター: テストケース（子1人/0歳/港区/年収500万）で全対象制度表示
3. トリアージ: 「発熱」フロー完走で適切な判断表示
4. レスポンシブ: iPhone SE〜iPad Proで動作
5. Lighthouse: Performance 90+, Accessibility 95+, SEO 95+
6. PostHogイベントがダッシュボードに反映
7. OG画像がSNSシェア時に正しく表示
