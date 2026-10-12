import type { Metadata } from "next";
import Link from "next/link";
import { getSeries } from "@/lib/articles";
import { SERIES_DESCRIPTION } from "@/lib/reading-formats";
import { CollectionHero } from "@/components/collection-hero";
import { PaperScene } from "@/components/paper-scene";

export const metadata: Metadata = {
  title: "シリーズ",
  description: SERIES_DESCRIPTION,
};

export default function SeriesPage() {
  const series = getSeries();
  return (
    <div className="page-shell narrow-collection">
      <CollectionHero title="シリーズ" description={SERIES_DESCRIPTION} subject="code" />
      <div className="series-catalog">
      {series.map((item) => (
        <section className="series-collection" key={item.slug}>
          <Link href={`/series/${item.slug}`} tabIndex={-1} aria-hidden><PaperScene subject={item.slug === "world-file-extensions" ? "code" : "layers"} /></Link>
          <p className="eyebrow">{item.category}</p>
          <h2>
            <Link href={`/series/${item.slug}`}>{item.name}</Link>
          </h2>
          <p>{item.description}</p>
          <ol>
            {item.articles.slice(0, 4).map((article) => (
              <li key={article.slug}>
                <Link href={article.url}>
                  {article.title}
                  <span>{article.readingTimeMinutes}分</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link className="text-link" href={`/series/${item.slug}`}>
            テーマから記事を選ぶ →
          </Link>
        </section>
      ))}
      </div>
      {series.length === 0 ? <p>公開シリーズはまだありません。</p> : null}
    </div>
  );
}
