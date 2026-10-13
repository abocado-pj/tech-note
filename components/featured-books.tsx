import Link from "next/link";
import { BookCover, PhysicalBook } from "@/components/book-cover";
import { getAllBooks } from "@/lib/books";

export function FeaturedBooks() {
  const database = getAllBooks().find(
    (book) => book.slug === "database-internal",
  );
  return (
    <section className="editorial-shelf" aria-labelledby="shelf-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE BOOKSHELF</p>
          <h2 id="shelf-heading">ひとつのテーマを、本で深める。</h2>
        </div>
        <Link href="/books">本の一覧へ ↗</Link>
      </div>
      <p className="shelf-intro">
        章をたどり、知識をつなぐ。基礎から実践まで、じっくり読む。
      </p>
      <div className="editorial-shelf__books">
        <article className="shelf-book shelf-book--planned">
          <PhysicalBook
            title="Webの認証"
            subtitle="基礎から実装まで"
            category="WEB & STATE"
            artwork="/images/orifolio/auth-cover-wrap.webp"
            tone="auth"
          />
          <div className="shelf-book__body">
            <p className="eyebrow">本の企画 · 制作予定</p>
            <h3>
              Webの認証
              <br />
              <span>基礎から実装まで</span>
            </h3>
            <p>
              認証のしくみを理解し、小さな実装につなげる本を計画しています。
            </p>
            <p className="planned-status">本文は未制作です</p>
          </div>
        </article>
        {database ? (
          <article className="shelf-book">
            <Link
              href={database.url}
              className="shelf-book__cover"
              aria-label={`${database.title}を読む`}
              tabIndex={-1}
            >
              <BookCover book={database} />
            </Link>
            <div className="shelf-book__body">
              <p className="eyebrow">
                本 · 公開中 ·{" "}
                {database.headings.filter((h) => h.depth === 2).length}章
              </p>
              <h3>
                <Link href={database.url}>{database.title}</Link>
              </h3>
              <p>{database.subtitle}</p>
              <ol>
                {database.headings
                  .filter((h) => h.depth === 2)
                  .slice(0, 3)
                  .map((h) => (
                    <li key={h.id}>{h.text}</li>
                  ))}
              </ol>
              <Link className="text-link" href={database.url}>
                目次から読む ↗
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
