import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";

export const dynamic = "force-static";
import { getAllPrograms } from "@/lib/programs";
import { getAllClinics } from "@/lib/clinics";
import { getAllChecklists } from "@/lib/checklists";
import { getAllSymptoms } from "@/lib/triage/engine";
import { getAllVaccines } from "@/lib/vaccines";
import { getAllNurseries } from "@/lib/nurseries";
import { getAllCheckups } from "@/lib/checkups";

const BASE_URL = "https://kgraph57.github.io/sukusuku-navi";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const programs = getAllPrograms();
  const clinics = getAllClinics();
  const checklists = getAllChecklists();
  const symptoms = getAllSymptoms();
  const vaccines = getAllVaccines();
  const nurseries = getAllNurseries();
  const checkups = getAllCheckups();

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
      url: `${BASE_URL}/triage`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/clinics`,
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
      url: `${BASE_URL}/vaccines`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/nurseries`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/checkups`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
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

  const clinicPages = clinics.map((c) => ({
    url: `${BASE_URL}/clinics/${c.slug}`,
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

  const symptomPages = symptoms.map((s) => ({
    url: `${BASE_URL}/triage/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const vaccinePages = vaccines.map((v) => ({
    url: `${BASE_URL}/vaccines/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const nurseryPages = nurseries.map((n) => ({
    url: `${BASE_URL}/nurseries/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const checkupPages = checkups.map((c) => ({
    url: `${BASE_URL}/checkups/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...programPages,
    ...clinicPages,
    ...checklistPages,
    ...symptomPages,
    ...vaccinePages,
    ...nurseryPages,
    ...checkupPages,
  ];
}
