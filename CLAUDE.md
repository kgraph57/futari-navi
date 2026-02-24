# CLAUDE.md - すくすくナビ

## Project Overview

港区の小児科医（おかもん）が運営する子育て支援サイト。メルマガ50号分の医療コンテンツ、港区の行政サービス情報、給付金シミュレーター、受診判断トリアージを統合。

## Tech Stack

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4
- MDX (next-mdx-remote) for article rendering
- shadcn/ui for base components
- Vercel for deployment
- Fonts: Zen Maru Gothic (headings) + Noto Sans JP (body)
- Colors: teal (trust) + coral (warmth) + off-white background

## Directory Structure

```
app/                    # Next.js App Router pages
  articles/             # メルマガ記事一覧・個別
  simulator/            # 給付金シミュレーター
  programs/             # 制度一覧
  triage/               # 受診判断トリアージ
  clinics/              # 小児科マップ
  checklists/           # 手続きチェックリスト
  my/                   # パーソナライズダッシュボード
components/
  ui/                   # shadcn/ui base components
  layout/               # Header, Footer, Navigation
  article/              # QABlock, KeyPointsBox, CitationList
  simulator/            # Wizard steps, result cards
  triage/               # Symptom selector, decision flow
  personalization/      # Age-based recommendations
  clinic/               # Map, clinic cards
  shared/               # Reusable across features
content/articles/       # 50+ MDX files (from newsletter)
data/                   # JSON: programs, clinics, triage rules, vaccines
lib/
  content.ts            # MDX loading & parsing
  simulator/engine.ts   # Benefits calculation
  triage/engine.ts      # Triage decision logic
  types.ts              # Shared TypeScript types
docs/
  requirements/         # 企画書, implementation plan
  research/             # 海外調査, サンプル, tools
  progress/             # TODO, progress logs
```

## Commands

```bash
npm run dev             # Start dev server
npm run build           # Production build
npm run lint            # ESLint
```

## Content Source

メルマガ原稿: `/Users/kenokamoto/Desktop/AI MEDICINE/04_メルマガ/メルマガ/vol*.md`
- 50号分 (vol001-vol050)
- Q&A対話形式、参考文献付き
- MDXに変換して content/articles/ に配置

## Design Principles

- Mobile-first (primary audience: parents on smartphones)
- Japanese language (lang="ja")
- Medical accuracy: all claims backed by citations
- Accessibility: WCAG 2.1 AA
- Performance: Lighthouse 90+ across all metrics

## Phase Plan

1. **Phase 1**: Foundation + Articles + Simulator (current)
2. **Phase 2**: Personalization + Triage + Clinic Map
3. **Phase 3**: Vaccine scheduler + English + Supabase auth
