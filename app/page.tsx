import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { BookCard } from "@/components/book-card";
import { SearchPanel } from "@/components/search-panel";
import { ReadingFormats } from "@/components/reading-formats";
import {
  getAllArticles,
  getCategories,
  getSearchIndex,
  getSeries,
} from "@/lib/articles";
import { getFeaturedBooks, getBookSearchIndex } from "@/lib/books";
import { getNoteSearchIndex } from "@/lib/notes";

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);
  const series = getSeries();
  return (
    <div className="page-shell library-home">
      <header className="library-intro">
        <h1 className="page-heading">技術の記事を探す</h1>
        <p className="page-subtitle">記事・ブック・ノートを検索できます。</p>
        <SearchPanel
          compact
          index={[
            ...getSearchIndex(),
            ...getBookSearchIndex(),
            ...getNoteSearchIndex(),
          ]}
        />
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
