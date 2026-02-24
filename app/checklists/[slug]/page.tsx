import type { Metadata } from "next";
import { WatercolorIcon } from "@/components/icons/watercolor-icon";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChecklists, getChecklistBySlug } from "@/lib/checklists";
import { ChecklistContent } from "@/components/checklist/checklist-content";

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const checklists = getAllChecklists();
  return checklists.map((checklist) => ({
    slug: checklist.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const checklist = getChecklistBySlug(slug);
  if (!checklist) return { title: "チェックリストが見つかりません" };

  return {
    title: `${checklist.name} - 手続きチェックリスト`,
    description: checklist.description,
  };
}

export default async function ChecklistDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const checklist = getChecklistBySlug(slug);

  if (!checklist) {
    notFound();
  }

  const allChecklists = getAllChecklists();
  const currentIndex = allChecklists.findIndex((c) => c.slug === slug);
  const prevChecklist =
    currentIndex > 0 ? allChecklists[currentIndex - 1] : null;
  const nextChecklist =
    currentIndex < allChecklists.length - 1
      ? allChecklists[currentIndex + 1]
      : null;

  return (
    <>
      <section className="bg-gradient-to-b from-sage-50 to-ivory-50 px-4 pb-8 pt-8 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/checklists"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
          >
            <WatercolorIcon name="arrow_right" size={16} />
            チェックリスト一覧に戻る
          </Link>

          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            {checklist.name}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted">
            {checklist.description}
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <ChecklistContent slug={checklist.slug} items={checklist.items} />

          <div className="mt-8 flex items-center justify-between gap-4">
            {prevChecklist ? (
              <Link
                href={`/checklists/${prevChecklist.slug}`}
                className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
              >
                <WatercolorIcon name="arrow_right" size={16} />
                {prevChecklist.name}
              </Link>
            ) : (
              <div />
            )}
            {nextChecklist ? (
              <Link
                href={`/checklists/${nextChecklist.slug}`}
                className="flex items-center gap-1 text-sm text-sage-600 transition-colors hover:text-sage-700"
              >
                {nextChecklist.name}
                <WatercolorIcon name="arrow_right" size={16} className="rotate-180" />
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-4 pt-4">
            <Link
              href="/checklists"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-sage-600"
            >
              <WatercolorIcon name="arrow_right" size={16} />
              チェックリスト一覧に戻る
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
