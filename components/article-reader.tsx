import Link from "next/link";
import { ArticleThumbnail } from "./article-thumbnail";
import { MdxContent } from "./mdx-content";
import { TableOfContents } from "./toc";
import { ReaderControls } from "./reader-controls";
import type { Article } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export function ArticleReader({
  article,
  review = false,
  collection = "articles",
}: {
  article: Pick<
    Article,
    | "title"
    | "description"
    | "updated"
    | "date"
    | "category"
    | "categorySlug"
    | "readingTimeMinutes"
    | "content"
    | "headings"
    | "thumbnail"
  >;
  review?: boolean;
  collection?: "articles" | "notes";
}) {
  return (
    <>
      <nav className="reader-breadcrumb reader-path" aria-label="パンくず">
        <Link href="/">ホーム</Link>
        <span>/</span>
        <Link href={review ? "/drafts" : `/${collection}`}>
          {review ? "下書き" : collection === "notes" ? "ノート" : "記事"}
        </Link>
        <span>/</span>
        <span>{article.category}</span>
      </nav>
      <div className="night-reader-frame">
        <aside className="night-reader-sidebar">
          <div id="article-contents">
            <TableOfContents headings={article.headings} />
          </div>
          {article.thumbnail ? (
            <div className="reader-aside-image">
              <ArticleThumbnail article={article} framed={false} />
              <Link href="/books">↗　本で体系的に読む</Link>
            </div>
          ) : null}
        </aside>
        <header className="reader-heading">
          <div className="reader-topline">
            <div className="tag-chips">
              <span>{collection === "notes" ? "ノート" : "記事"}</span>
              <span>{article.category}</span>
            </div>
            <ReaderControls />
          </div>
          {review ? (
            <p className="review-notice">レビュー用の下書き · 未公開</p>
          ) : null}
          <h1>{article.title}</h1>
          <p className="reader-description">{article.description}</p>
          <div className="reader-meta">
            <time dateTime={article.updated ?? article.date}>
              {article.updated ? "更新 " : ""}
              {formatDate(article.updated ?? article.date)}
            </time>
            <span>{article.readingTimeMinutes}分で読めます</span>
          </div>
        </header>
        <div className="prose reading-prose night-reader-body">
          <MdxContent source={article.content} />
        </div>
      </div>
      <nav className="reader-return" aria-label="読み終えた後の移動">
        <Link href={`/${collection}`}>
          ←　{collection === "notes" ? "ノート" : "記事"}一覧へ
        </Link>
        <a href="#article-contents">目次 ↑</a>
      </nav>
    </>
  );
}
