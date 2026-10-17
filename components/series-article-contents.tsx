import Link from "next/link";
import type { SeriesItem } from "@/lib/articles";

export function SeriesArticleContents({
  series,
  currentSlug,
}: {
  series: SeriesItem;
  currentSlug: string;
}) {
  return (
    <nav
      className="series-article-contents"
      aria-label="所属シリーズの記事目次"
    >
      <Link
        href={`/series/${series.slug}`}
        className="series-article-contents__title"
      >
        {series.name}
      </Link>
      <details>
        <summary>シリーズの目次（全{series.articles.length}記事）</summary>
        <ol>
          {series.articles.map((article, index) => (
            <li key={article.slug}>
              <Link
                href={article.url}
                aria-current={article.slug === currentSlug ? "page" : undefined}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {article.title}
              </Link>
            </li>
          ))}
        </ol>
      </details>
      <Link
        href={`/series/${series.slug}`}
        className="series-article-contents__return"
      >
        シリーズの入口へ戻る →
      </Link>
    </nav>
  );
}
