import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { getAllPrograms } from "@/lib/programs";
import { getAllChecklists } from "@/lib/checklists";

export const dynamic = "force-static";

const BASE_URL = "https://kgraph57.github.io/futari-navi";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const programs = getAllPrograms();
  const checklists = getAllChecklists();

  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/simulator`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/checklists`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  const articlePages = articles.map((a) => ({
    url: `${BASE_URL}/articles/${a.frontmatter.slug}`,
    lastModified: new Date(a.frontmatter.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const programPages = programs.map((p) => ({
    url: `${BASE_URL}/programs/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const checklistPages = checklists.map((c) => ({
    url: `${BASE_URL}/checklists/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...programPages,
    ...checklistPages,
  ];
}
