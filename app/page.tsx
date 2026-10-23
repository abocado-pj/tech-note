import Link from "next/link";
import { Search } from "lucide-react";
import { HomeReadingLists } from "@/components/home-reading-lists";
import { RelatedMedia } from "@/components/related-media";
import { NightBookshelf } from "@/components/night-bookshelf";
import { getAllNotes } from "@/lib/notes";
import { getAllArticles } from "@/lib/articles";
import { getAllBooks } from "@/lib/books";
import { withBasePath } from "@/lib/site";

export default function HomePage() {
  const allArticles = getAllArticles();
  const featuredSlugs = [
    "architecture/auth/authentication-types",
    "aws/lambda/typescript-handler-and-api-entry",
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
      <HomeReadingLists articles={articles} notes={getAllNotes().slice(0, 2)} />
      <RelatedMedia />
    </div>
  );
}
