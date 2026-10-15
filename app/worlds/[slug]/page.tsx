import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { READING_WORLDS, getReadingWorld } from "@/lib/worlds";
import { getAllArticles } from "@/lib/articles";
import { ReadingWorldView } from "@/components/reading-world";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() { return READING_WORLDS.map(({ id }) => ({ slug: id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const world = getReadingWorld(slug);
  return world ? { title: world.title, description: world.subtitle, alternates: { canonical: absoluteUrl(`/worlds/${slug}`) } } : {};
}
export default async function WorldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const world = getReadingWorld(slug);
  if (!world) notFound();
  return <ReadingWorldView world={world} articles={getAllArticles().map(({ slug, title, url }) => ({ slug, title, url }))} />;
}
