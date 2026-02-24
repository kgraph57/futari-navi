import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  ArticleFrontmatter,
  Article,
  ArticleCategory,
  AgeGroup,
} from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export function getArticleSlugs(): readonly string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
  };
}

export function getAllArticles(): readonly Article[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map(getArticleBySlug)
    .filter((a): a is Article => a !== null);

  return articles.sort((a, b) => a.frontmatter.vol - b.frontmatter.vol);
}

export function getArticlesByCategory(
  category: ArticleCategory,
): readonly Article[] {
  return getAllArticles().filter((a) => a.frontmatter.category === category);
}

export function getArticlesByAgeGroup(ageGroup: AgeGroup): readonly Article[] {
  return getAllArticles().filter((a) => {
    const ageGroups = a.frontmatter.ageGroups ?? [];
    return ageGroups.includes(ageGroup) || ageGroups.includes("all");
  });
}

export function searchArticles(query: string): readonly Article[] {
  const lower = query.toLowerCase();
  return getAllArticles().filter(
    (a) =>
      a.frontmatter.title.toLowerCase().includes(lower) ||
      a.frontmatter.description.toLowerCase().includes(lower) ||
      (a.frontmatter.keyPoints ?? []).some((kp) =>
        kp.toLowerCase().includes(lower),
      ) ||
      a.content.toLowerCase().includes(lower),
  );
}

export function getRelatedArticles(
  slug: string,
  limit = 3,
): readonly Article[] {
  const article = getArticleBySlug(slug);
  if (!article) return [];

  const relatedSlugs = article.frontmatter.relatedSlugs ?? [];
  const { category } = article.frontmatter;

  const related = relatedSlugs
    .map(getArticleBySlug)
    .filter((a): a is Article => a !== null);

  if (related.length >= limit) return related.slice(0, limit);

  const sameCategory = getArticlesByCategory(category).filter(
    (a) =>
      a.frontmatter.slug !== slug && !relatedSlugs.includes(a.frontmatter.slug),
  );

  return [...related, ...sameCategory].slice(0, limit);
}
