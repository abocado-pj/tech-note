import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeries } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { getSeriesArtwork } from "@/lib/collection-artwork";
import { ArticleCard } from "@/components/article-card";
import { ReadingWorldView } from "@/components/reading-world";
import { getReadingWorld } from "@/lib/worlds";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSeries().map((series) => ({
    slug: series.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);

  if (!series) return {};

  return {
    title: series.name,
    description: series.description,
    alternates: {
      canonical: absoluteUrl(`/series/${series.slug}`),
    },
  };
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeries().find((item) => item.slug === slug);
  if (!series) notFound();
  const world = slug === "world-file-extensions" ? getReadingWorld("formats") : undefined;
  return (
    <>{world ? <ReadingWorldView world={world} articles={series.articles.map(({ slug, title, url }) => ({ slug, title, url }))} /> : null}<div className="page-shell narrow-collection">
      <header className="collection-header series-detail-heading">
        <nav className="reader-breadcrumb" aria-label="パンくず">
          <Link href="/series">シリーズ</Link>
          <span aria-hidden>/</span>
          <span>{series.category}</span>
        </nav>
        {world ? <h2 className="page-heading">{series.name}</h2> : <h1 className="page-heading">{series.name}</h1>}
        <p className="page-subtitle">{series.description}</p>
        <ArticleThumbnail
          article={{
            title: series.name,
            thumbnail: getSeriesArtwork(series.slug),
          }}
          framed={false}
        />
        <p className="publication-badge">
          全{series.articles.length}記事 · どの記事からでも
        </p>
      </header>
      <p className="reader-description">
        共通テーマの独立した記事です。関心のある記事から読めます。
      </p>
      {series.sections.map((section) => (
        <section className="series-collection" key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          <div className="article-list series-article-grid">
            {section.articles.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </section>
      ))}
      <Link className="text-link" href="/books">
        広いテーマを体系的に読むブックへ →
      </Link>
    </div></>
  );
}
