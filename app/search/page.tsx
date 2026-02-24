import type { Metadata } from "next";
import { SearchPageClient } from "./search-client";
import { getAllArticles } from "@/lib/content";
import { getAllPrograms } from "@/lib/programs";
import { getAllVaccines } from "@/lib/vaccines";
import { getAllClinics } from "@/lib/clinics";
import { getAllNurseries } from "@/lib/nurseries";

export const metadata: Metadata = {
  title: "検索",
  description:
    "すくすくナビの記事・制度・ワクチン・小児科・保育園をキーワードで横断検索できます。",
};

interface QaPair {
  readonly question: string;
  readonly answer: string;
}

interface SearchArticleData {
  readonly type: "article";
  readonly slug: string;
  readonly vol: number;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly publishedAt: string;
  readonly keyPoints: readonly string[];
  readonly qaCount: number;
  readonly qaPairs: readonly QaPair[];
}

interface SearchProgramData {
  readonly type: "program";
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly amountDescription: string;
}

interface SearchVaccineData {
  readonly type: "vaccine";
  readonly slug: string;
  readonly name: string;
  readonly nameShort: string;
  readonly vaccineType: string;
  readonly disease: string;
  readonly description: string;
}

interface SearchClinicData {
  readonly type: "clinic";
  readonly slug: string;
  readonly name: string;
  readonly address: string;
  readonly features: readonly string[];
  readonly emergencyAvailable: boolean;
  readonly nearestStation: string;
}

interface SearchNurseryData {
  readonly type: "nursery";
  readonly slug: string;
  readonly name: string;
  readonly address: string;
  readonly nurseryType: string;
  readonly area: string;
  readonly features: readonly string[];
}

export type SearchItem =
  | SearchArticleData
  | SearchProgramData
  | SearchVaccineData
  | SearchClinicData
  | SearchNurseryData;

function extractQaPairs(content: string): readonly QaPair[] {
  const lines = content.split("\n");
  const pairs: QaPair[] = [];
  let currentQuestion: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const speakerMatch =
      trimmed.match(/^\*\*(.+?)\*\*[「『](.+)[」』]$/) ??
      trimmed.match(/^\*\*(.+?)\*\*(.+)$/);

    if (speakerMatch) {
      const speaker = speakerMatch[1];
      const text = speakerMatch[2];
      const isDoctor =
        speaker.includes("おかもん") || speaker.includes("先生");

      if (!isDoctor) {
        currentQuestion = text;
      } else if (currentQuestion) {
        pairs.push({ question: currentQuestion, answer: text.slice(0, 120) });
        currentQuestion = null;
      }
    }
  }

  return pairs.slice(0, 12);
}

export default function SearchPage() {
  const allArticles = getAllArticles();
  const allPrograms = getAllPrograms();
  const allVaccines = getAllVaccines();
  const allClinics = getAllClinics();
  const allNurseries = getAllNurseries();

  const articles: readonly SearchArticleData[] = allArticles.map((article) => ({
    type: "article" as const,
    slug: article.frontmatter.slug,
    vol: article.frontmatter.vol,
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    category: article.frontmatter.category,
    publishedAt: article.frontmatter.publishedAt,
    keyPoints: article.frontmatter.keyPoints,
    qaCount: article.frontmatter.qaCount,
    qaPairs: extractQaPairs(article.content),
  }));

  const programs: readonly SearchProgramData[] = allPrograms.map((p) => ({
    type: "program" as const,
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    amountDescription: p.amount.description,
  }));

  const vaccines: readonly SearchVaccineData[] = allVaccines.map((v) => ({
    type: "vaccine" as const,
    slug: v.slug,
    name: v.name,
    nameShort: v.nameShort,
    vaccineType: v.type,
    disease: v.disease,
    description: v.description,
  }));

  const clinics: readonly SearchClinicData[] = allClinics.map((c) => ({
    type: "clinic" as const,
    slug: c.slug,
    name: c.name,
    address: c.address,
    features: c.features,
    emergencyAvailable: c.emergencyAvailable,
    nearestStation: c.nearestStation,
  }));

  const nurseries: readonly SearchNurseryData[] = allNurseries.map((n) => ({
    type: "nursery" as const,
    slug: n.slug,
    name: n.name,
    address: n.address,
    nurseryType: n.type,
    area: n.area,
    features: n.features,
  }));

  const allItems: readonly SearchItem[] = [
    ...articles,
    ...programs,
    ...vaccines,
    ...clinics,
    ...nurseries,
  ];

  return <SearchPageClient items={allItems} />;
}
