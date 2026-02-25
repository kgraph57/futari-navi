# CLAUDE.md - ふたりナビ

## Project Overview

結婚手続き・届出・給付金ナビ。婚姻届の提出から名義変更・保険・税金まで、結婚に伴う手続きをステップごとにガイド。給付金シミュレーター、手続きチェックリスト、用語集を統合。

## Tech Stack

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4
- MDX (next-mdx-remote) for article rendering
- shadcn/ui for base components
- GitHub Pages for deployment (static export)
- Fonts: Zen Maru Gothic (headings) + Noto Sans JP (body)
- Colors: teal (trust) + coral (warmth) + off-white background

## Directory Structure

```text
app/                    # Next.js App Router pages
  articles/             # 記事一覧・個別
  simulator/            # 給付金シミュレーター
  programs/             # 制度一覧
  checklists/           # 手続きチェックリスト
  glossary/             # 結婚手続き用語集
  emergency/            # 相談窓口・サポート
  my/                   # パーソナライズダッシュボード
components/
  ui/                   # shadcn/ui base components
  layout/               # Header, Footer, Navigation
  article/              # QABlock, KeyPointsBox, CitationList
  simulator/            # Wizard steps, result cards
  checklist/            # Checklist progress, items
  shared/               # Reusable across features
content/articles/       # MDX files (marriage procedure articles)
data/                   # JSON: programs, checklists
lib/
  content.ts            # MDX loading & parsing
  simulator/engine.ts   # Benefits calculation
  types.ts              # Shared TypeScript types
docs/
  requirements/         # 企画書, implementation plan
  research/             # 調査, サンプル
```

## Commands

```bash
npm run dev             # Start dev server
npm run build           # Production build
npm run lint            # ESLint
```

## Design Principles

- Mobile-first (primary audience: newlyweds on smartphones)
- Japanese language (lang="ja")
- Accuracy: all claims backed by citations and official sources
- Accessibility: WCAG 2.1 AA
- Performance: Lighthouse 90+ across all metrics
