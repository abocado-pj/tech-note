import type { Metadata } from "next";
import { ContentCatalog } from "@/components/content-catalog";
import { getSeries } from "@/lib/articles";
import { getSeriesArtwork } from "@/lib/collection-artwork";
import { SERIES_DESCRIPTION } from "@/lib/reading-formats";

export const metadata: Metadata = {
  title: "シリーズ",
  description: SERIES_DESCRIPTION,
};
export default function SeriesPage() {
  return (
    <ContentCatalog
      kind="series"
      items={getSeries().map((series) => ({
        title: series.name,
        description: series.subtitle,
        url: `/series/${series.slug}`,
        category: series.category,
        thumbnail: getSeriesArtwork(series.slug),
        articleCount: series.articles.length,
        tags: [
          ...new Set(series.articles.flatMap((article) => article.tags)),
        ].slice(0, 3),
        date: series.articles.reduce(
          (latest, article) => (article.date > latest ? article.date : latest),
          "",
        ),
      }))}
    />
  );
}
