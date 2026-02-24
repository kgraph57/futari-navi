import { getAllArticles } from "@/lib/content";
import { MyPageClient } from "./my-page-client";

export default function MyPage() {
  const allArticles = getAllArticles();

  const articleTitles: Record<string, string> = {};
  for (const article of allArticles) {
    articleTitles[article.frontmatter.slug] = article.frontmatter.title;
  }

  return <MyPageClient articleTitles={articleTitles} />;
}
