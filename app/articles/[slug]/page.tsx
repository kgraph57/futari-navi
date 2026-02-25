import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/content";
import { CATEGORY_LABELS } from "@/lib/types";
import { extractCitations } from "@/lib/extract-citations";
import { createMdxComponents } from "@/components/article/mdx-components";
import { KeyPointsBox } from "@/components/article/key-points-box";
import { CitationList } from "@/components/article/citation-list";
import { ArticleCard } from "@/components/article/article-card";
import { CategoryBadge } from "@/components/article/article-card";
import { DoctorByline } from "@/components/article/doctor-byline";
import { BookmarkButton } from "@/components/article/bookmark-button";
import { ShareButton } from "@/components/shared/share-button";
import { TableOfContents } from "@/components/article/table-of-contents";
import { ArticleFeedback } from "@/components/article/article-feedback";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { estimateReadingTime } from "@/lib/reading-time";

interface ArticlePageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

const SITE_URL = "https://kgraph57.github.io/futari-navi";

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { title, description, publishedAt, category } = article.frontmatter;

  return {
    title,
    description,
    authors: [{ name: "ふたりナビ編集部" }],
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: publishedAt,
      authors: ["ふたりナビ編集部"],
      tags: [
        CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS],
        "結婚",
        "手続き",
        "港区",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@kgraph_",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;
  const { vol, title, description, category, publishedAt } = frontmatter;
  const keyPoints = frontmatter.keyPoints ?? [];

  const citations = extractCitations(content);
  const relatedArticles = getRelatedArticles(slug, 3);
  const readingTime = estimateReadingTime(content);

  const contentWithoutCitations = content.split(/##\s*参考文献/)[0] ?? content;

  const mdxComponents = createMdxComponents();

  const categoryLabel = CATEGORY_LABELS[category];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: frontmatter.title,
    description: frontmatter.description,
    url: `${SITE_URL}/articles/${frontmatter.slug}`,
    datePublished: frontmatter.publishedAt,
    author: {
      "@type": "Organization",
      name: "ふたりナビ編集部",
    },
    publisher: {
      "@type": "Organization",
      name: "ふたりナビ",
      url: SITE_URL,
    },
    inLanguage: "ja",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "記事一覧",
        item: `${SITE_URL}/articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: `${SITE_URL}/articles/category/${category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav aria-label="パンくずリスト" className="mb-10">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <li>
            <Link href="/" className="transition-colors hover:text-sage-600">
              ホーム
            </Link>
          </li>
          <li aria-hidden="true">
            <WatercolorIcon
              name="chevron_down"
              size={12}
              className="-rotate-90"
            />
          </li>
          <li>
            <Link
              href="/articles"
              className="transition-colors hover:text-sage-600"
            >
              記事一覧
            </Link>
          </li>
          <li aria-hidden="true">
            <WatercolorIcon
              name="chevron_down"
              size={12}
              className="-rotate-90"
            />
          </li>
          <li>
            <Link
              href={`/articles/category/${category}`}
              className="transition-colors hover:text-sage-600"
            >
              {categoryLabel}
            </Link>
          </li>
          <li aria-hidden="true">
            <WatercolorIcon
              name="chevron_down"
              size={12}
              className="-rotate-90"
            />
          </li>
          <li aria-current="page" className="line-clamp-1 text-foreground">
            {title}
          </li>
        </ol>
      </nav>

      {/* Article header */}
      <header className="mb-10 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sage-600 px-3 py-1 text-xs font-bold text-white">
            Vol.{vol}
          </span>
          <CategoryBadge category={category} />
        </div>

        <h1 className="mt-5 font-heading text-2xl font-semibold leading-[1.45] text-foreground sm:text-3xl sm:leading-[1.4]">
          {title}
        </h1>

        <p className="mt-4 text-base leading-[1.85] text-muted">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1">
            <WatercolorIcon name="calendar" size={12} className=".5 .5" />
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <WatercolorIcon name="tag" size={12} className=".5 .5" />
            <Link
              href={`/articles/category/${category}`}
              className="hover:text-sage-600 hover:underline"
            >
              {CATEGORY_LABELS[category]}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <WatercolorIcon name="clock" size={12} />
            <span>約{readingTime}分で読めます</span>
          </div>
          <BookmarkButton articleSlug={frontmatter.slug} />
          <ShareButton
            title={title}
            text={`${title} | ふたりナビ`}
            url={`${SITE_URL}/articles/${slug}`}
            contentType="article"
            contentId={slug}
          />
        </div>
      </header>

      {/* Doctor byline */}
      <DoctorByline
        qaCount={frontmatter.qaCount}
        referenceCount={frontmatter.referenceCount}
      />

      {/* Key points */}
      <KeyPointsBox points={keyPoints} />

      {/* Table of contents */}
      <TableOfContents />

      {/* MDX content */}
      <div className="article-content">
        <MDXRemote
          source={contentWithoutCitations}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>

      {/* Citations */}
      <CitationList citations={citations} />

      {/* Feedback */}
      <ArticleFeedback articleSlug={slug} />

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg bg-ivory-100 p-4 text-xs leading-relaxed text-muted">
        ※
        この記事は一般的な行政手続き・制度情報の提供を目的としています。個別の状況により適用条件が異なる場合がありますので、詳細はお住まいの自治体窓口にご確認ください。
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12 border-t border-border pt-10">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            関連記事
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((ra) => (
              <ArticleCard
                key={ra.frontmatter.slug}
                frontmatter={ra.frontmatter}
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <div className="mt-12">
        <NewsletterForm />
      </div>

      {/* Back to list */}
      <div className="mt-12 text-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-6 py-3 text-sm font-medium text-sage-700 transition-colors hover:bg-sage-50"
        >
          <WatercolorIcon name="arrow_right" size={16} />
          記事一覧に戻る
        </Link>
      </div>
    </article>
  );
}
