import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { BookCard } from "@/components/book-card";
import { SearchPanel } from "@/components/search-panel";
import { ReadingFormats } from "@/components/reading-formats";
import { FeaturedBooks } from "@/components/featured-books";
import { getAllNotes } from "@/lib/notes";
import {
  getAllArticles,
  getCategories,
  getSearchIndex,
  getSeries,
} from "@/lib/articles";
import { getFeaturedBooks, getBookSearchIndex } from "@/lib/books";
import { getNoteSearchIndex } from "@/lib/notes";

export default function HomePage() {
  const allArticles = getAllArticles();
  const articles = allArticles.slice(0, 3);
  const featured = allArticles.find(
    (article) => article.slug === "architecture/auth/authentication-types",
  );
  const relatedFeatures = [
    "flutter/auth/single-flight-token-refresh-concurrent-401",
    "flutter/auth/access-token-memory-refresh-token-secure-storage",
  ].flatMap((slug) => allArticles.filter((article) => article.slug === slug));
  const series = getSeries().sort(
    (a, b) =>
      Number(b.slug === "world-file-extensions") -
      Number(a.slug === "world-file-extensions"),
  );
  return (
    <div className="page-shell library-home">
      <header className="library-intro">
        <div className="editorial-intro">
          <div>
            <p className="eyebrow">IDEAS, OPENED.</p>
            <h1 className="page-heading">知るほど、見方が変わる。</h1>
            <p className="page-subtitle">
              小さな気づきを残し、しくみを読み、実装へつなぐ。
            </p>
          </div>
          <p className="intro-note">
            いま知りたいことを、
            <br />
            ちょうどいい深さで。
          </p>
        </div>
        {featured ? (
          <div className="editorial-feature">
            <Link
              href={featured.url}
              className="editorial-feature__image"
              tabIndex={-1}
              aria-label={`${featured.title}を読む`}
            >
              <ArticleThumbnail article={featured} priority framed={false} />
            </Link>
            <div className="editorial-feature__body">
              <p className="eyebrow">今日、ひらく問い — 記事</p>
              <h2>
                <Link href={featured.url}>{featured.title}</Link>
              </h2>
              <p>{featured.description}</p>
              <Link href={featured.url} className="text-link">
                記事を読む ↗
              </Link>
              <div className="feature-connections">
                <p>この問いから、実装へ</p>
                {relatedFeatures.map((article) => (
                  <Link href={article.url} key={article.slug}>
                    {article.title}
                    <span aria-hidden>↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        <SearchPanel
          compact
          index={[
            ...getSearchIndex(),
            ...getBookSearchIndex(),
            ...getNoteSearchIndex(),
          ]}
        />
        <nav className="home-topics" aria-label="技術分野から探す">
          {getCategories().map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </nav>
      </header>
      <ReadingFormats />
      <FeaturedBooks />
      <div className="library-columns">
        <div className="min-w-0">
          <section aria-labelledby="recent-heading">
            <div className="section-heading">
              <h2 id="recent-heading">記事で、理解を深める。</h2>
              <Link href="/articles">すべての記事 →</Link>
            </div>
            <div className="article-list">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
          <section className="library-section" aria-labelledby="series-heading">
            <div className="section-heading">
              <h2 id="series-heading">同じテーマを、いろいろな角度から。</h2>
              <Link href="/series">すべてのシリーズ →</Link>
            </div>
            <p className="page-subtitle">
              共通テーマの独立した記事を、関心のあるものから読む。
            </p>
            <div className="series-list">
              {series.map((item) => (
                <Link
                  key={item.slug}
                  className="series-link"
                  href={`/series/${item.slug}`}
                >
                  {item.articles[0]?.thumbnail ? (
                    <ArticleThumbnail
                      article={item.articles[0]}
                      framed={false}
                    />
                  ) : null}
                  <strong>{item.name}</strong>
                  <span>{item.subtitle}</span>
                  <span>{item.articles.length}記事 · 記事を選ぶ →</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="library-section" aria-labelledby="books-heading">
            <div className="section-heading">
              <h2 id="books-heading">公開中の本</h2>
              <Link href="/books">すべてのブック →</Link>
            </div>
            <div className="book-list">
              {getFeaturedBooks(2).map((book) => (
                <BookCard key={book.slug} book={book} compact />
              ))}
            </div>
          </section>
          <section className="library-section" aria-labelledby="notes-heading">
            <div className="section-heading">
              <h2 id="notes-heading">短いノート</h2>
              <Link href="/notes">すべてのノート →</Link>
            </div>
            {getAllNotes()
              .slice(0, 2)
              .map((note) => (
                <article className="note-home-row" key={note.slug}>
                  <div>
                    <h3>
                      <Link href={note.url}>{note.title}</Link>
                    </h3>
                    <p>{note.description}</p>
                  </div>
                  <Link href={note.url}>ノートを読む →</Link>
                </article>
              ))}
          </section>
        </div>
        <aside className="library-sidebar">
          <section>
            <h2>分野から探す</h2>
            <nav aria-label="技術分野" className="topic-links">
              {getCategories().map((category) => (
                <Link key={category.slug} href={`/categories/${category.slug}`}>
                  {category.name}
                  <span aria-hidden>↗</span>
                </Link>
              ))}
            </nav>
          </section>
          <Link className="text-link" href="/notes">
            短いノートを読む →
          </Link>
        </aside>
      </div>
    </div>
  );
}
