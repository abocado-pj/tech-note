import Link from "next/link";
import { ArticleThumbnail } from "./article-thumbnail";
import { formatDate } from "@/lib/format";

export type CatalogItem = {
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  category: string;
  date: string;
  tags: string[];
  articleCount?: number;
};

export function CatalogCard({
  item,
  kind = "articles",
}: {
  item: CatalogItem;
  kind?: "articles" | "notes" | "series";
}) {
  return (
    <article className={`catalog-card catalog-card--${kind}`}>
      {item.thumbnail ? (
        <Link
          href={item.url}
          className="catalog-card__image"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ArticleThumbnail article={item} framed={false} />
        </Link>
      ) : null}
      <div className="catalog-card__body">
        <div className="article-row__meta">
          <span>
            {item.category}
            {item.articleCount !== undefined
              ? ` / ${item.articleCount}記事`
              : ""}
          </span>
        </div>
        <h2>
          <Link href={item.url}>{item.title}</Link>
        </h2>
        <p>{item.description}</p>
        <div className="catalog-card__bottom">
          {kind === "notes" ? (
            <time dateTime={item.date}>{formatDate(item.date)}</time>
          ) : (
            <div className="tag-chips">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <Link href={item.url} className="catalog-read">
            {kind === "notes"
              ? "ノートを開く"
              : kind === "series"
                ? "記事を選ぶ"
                : "読む"}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
