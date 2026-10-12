import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { BookCard } from "@/components/book-card";
import { SearchPanel } from "@/components/search-panel";
import { ReadingFormats } from "@/components/reading-formats";
import { PaperScene } from "@/components/paper-scene";
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
  const featuredSlugs = ["file-formats/extensions/css", "file-formats/extensions/json", "file-formats/extensions/html"];
  const articles = featuredSlugs.flatMap(slug => allArticles.filter(article => article.slug === slug));
  const series = getSeries().sort((a, b) => Number(b.slug === "world-file-extensions") - Number(a.slug === "world-file-extensions"));
  return (
    <div className="page-shell library-home">
      <header className="library-intro">
        <div className="home-hero">
          <div><h1 className="page-heading">小さな記録から、<br />深い理解へ。</h1><p className="page-subtitle">いま知りたいことを、ちょうどいい深さで。</p></div>
          <PaperScene />
        </div>
        <SearchPanel
          compact
          index={[
            ...getSearchIndex(),
            ...getBookSearchIndex(),
            ...getNoteSearchIndex(),
          ]}
        />
        <nav className="home-topics" aria-label="技術分野から探す">
          {getCategories().map(category => <Link key={category.slug} href={`/categories/${category.slug}`}>{category.name}</Link>)}
        </nav>
      </header>
      <ReadingFormats />
      <div className="library-columns">
        <div className="min-w-0">
          <section aria-labelledby="recent-heading">
            <div className="section-heading">
              <h2 id="recent-heading">最近の記事</h2>
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
              <h2 id="series-heading">テーマ別のシリーズ</h2>
              <Link href="/series">すべてのシリーズ →</Link>
            </div>
            <p className="page-subtitle">
              共通テーマの独立した記事を、関心のあるものから読む。
            </p>
            <div className="series-list">
              {series.map((item) => (
                <Link key={item.slug} className="series-link" href={`/series/${item.slug}`}>
                  {item.articles[0]?.thumbnail ? (
                    <ArticleThumbnail article={item.articles[0]} framed={false} />
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
              <h2 id="books-heading">ブックで読む</h2>
              <Link href="/books">すべてのブック →</Link>
            </div>
            <div className="book-list">
              {getFeaturedBooks(2).map((book) => (
                <BookCard key={book.slug} book={book} compact />
              ))}
            </div>
          </section>
          <section className="library-section" aria-labelledby="notes-heading">
            <div className="section-heading"><h2 id="notes-heading">短いノート</h2><Link href="/notes">すべてのノート →</Link></div>
            {getAllNotes().slice(0, 2).map(note => <article className="note-home-row" key={note.slug}><div><h3><Link href={note.url}>{note.title}</Link></h3><p>{note.description}</p></div><Link href={note.url}>ノートを読む →</Link></article>)}
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
