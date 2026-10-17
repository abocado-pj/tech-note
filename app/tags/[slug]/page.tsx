import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getArticlesByTag, getTags, getSeries } from "@/lib/articles";
import { slugify } from "@/lib/slug";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getTags().map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTags().find((item) => item.slug === slug);

  if (!tag) return {};

  return {
    title: `#${tag.name}`,
    description: `#${tag.name} の記事一覧。`,
    alternates: {
      canonical: absoluteUrl(`/tags/${tag.slug}`),
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = getTags().find((item) => item.slug === slug);
  const articles = getArticlesByTag(slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="page-shell">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tags", href: "/tags" }, { label: tag.name }]} />
      <header className="mb-10 mt-8">
        <h1 className="page-heading">#{tag.name}</h1>
        <p className="page-subtitle">単独記事 {tag.count}件</p>
      </header>
      {articles.length === 0 ? <p>このタグの単独記事はありません。シリーズの記事は、シリーズ内で読めます。</p> : null}
      <nav className="taxonomy-series-links" aria-label="このタグのシリーズ">{getSeries().filter((series) => series.articles.some((article) => article.tags.some((name) => slugify(name) === slug))).map((series) => <Link href={`/series/${series.slug}`} key={series.slug}>{series.name}（全{series.articles.length}記事）→</Link>)}</nav>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
