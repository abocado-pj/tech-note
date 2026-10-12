import type { Metadata } from "next";
import Link from "next/link";
import { getSeries } from "@/lib/articles";
import { SERIES_DESCRIPTION } from "@/lib/reading-formats";

export const metadata: Metadata = {
  title: "シリーズ",
  description: SERIES_DESCRIPTION,
};

export default function SeriesPage() {
  const series = getSeries();
  return (
    <div className="page-shell narrow-collection">
      <header className="collection-header">
        <h1 className="page-heading">シリーズ</h1>
        <p className="page-subtitle">{SERIES_DESCRIPTION}</p>
      </header>
      {series.map((item) => (
        <section className="series-collection" key={item.slug}>
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
      {series.length === 0 ? <p>公開シリーズはまだありません。</p> : null}
    </div>
  );
}
