import Link from "next/link";
import { Search } from "lucide-react";
import { CatalogCard } from "@/components/catalog-item";
import { ArticleThumbnail } from "@/components/article-thumbnail";
import { NightBookshelf } from "@/components/night-bookshelf";
import { getAllNotes } from "@/lib/notes";
import { getStandaloneArticles } from "@/lib/articles";
import { getAllBooks } from "@/lib/books";
import { withBasePath } from "@/lib/site";

export default function HomePage() {
  const allArticles = getStandaloneArticles();
  const featuredSlugs = [
    "architecture/auth/authentication-types",
    "sql/internal/explain-analyze",
  ];
  const articles = featuredSlugs.flatMap((slug) =>
    allArticles.filter((article) => article.slug === slug),
  );
  const books = getAllBooks().sort(
    (a, b) =>
      Number(b.slug === "database-internal") -
      Number(a.slug === "database-internal"),
  );
  return (
    <div className="page-shell midnight-home">
      <div className="night-hero home-night-hero">
        <header className="home-night-intro">
          <div>
            <h1>
              読みたい一冊に、
              <br />
              出会う。
            </h1>
            <p>しくみを知り、実装へつなぐ。</p>
          </div>
          <div className="home-search">
            <form
              className="night-search"
              action={withBasePath("/search/")}
              role="search"
            >
              <Search aria-hidden size={25} />
              <label htmlFor="home-query" className="sr-only">
                気になる技術やテーマを検索
              </label>
              <input
                id="home-query"
                type="search"
                name="q"
                placeholder="気になる技術やテーマを検索"
              />
              <button type="submit" aria-label="検索する">
                →
              </button>
            </form>
            <nav className="home-topic-chips" aria-label="テーマから検索">
              {["認証", "Rails", "Flutter", "データベース"].map((topic) => (
                <Link
                  key={topic}
                  href={{ pathname: "/search", query: { q: topic } }}
                >
                  {topic}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <NightBookshelf
          books={books.map((book) => ({
            title: book.title,
            subtitle: book.subtitle,
            slug: book.slug,
            url: book.url,
            headings: book.headings
              .filter((heading) => heading.depth === 2)
              .map(({ id, text }) => ({ id, text })),
          }))}
        />
      </div>
      <div className="home-reading-columns">
        <section>
          <div className="section-heading">
            <h2>記事から探す</h2>
            <Link href="/articles">すべての記事を見る　→</Link>
          </div>
          {articles.map((article) => (
            <CatalogCard
              key={article.slug}
              item={{
                title: article.title,
                description: article.description,
                url: article.url,
                thumbnail: article.thumbnail,
                category: article.category,
                date: article.date,
                tags: article.tags,
              }}
            />
          ))}
        </section>
        <section>
          <div className="section-heading">
            <h2>小さなノート</h2>
            <Link href="/notes">すべてのノートを見る　→</Link>
          </div>
          {getAllNotes()
            .slice(0, 2)
            .map((note) => (
              <article className="home-note-row" key={note.slug}>
                <Link href={note.url} tabIndex={-1} aria-hidden>
                  <ArticleThumbnail article={note} framed={false} />
                </Link>
                <div>
                  <h3>
                    <Link href={note.url}>{note.title}</Link>
                  </h3>
                  <p>{note.description}</p>
                  <time dateTime={note.date}>
                    {note.date.replaceAll("-", ".")}
                  </time>
                </div>
              </article>
            ))}
          <Link className="home-series-link" href="/series">
            シリーズをたどる　→
          </Link>
        </section>
      </div>
    </div>
  );
}
