import Link from "next/link";
import type { Book } from "@/lib/books";
import { BookCover } from "./book-cover";
import { InspectionTitle } from "./inspection-title";

export function BookCard({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  return (
    <article className={`book-entry${compact ? " book-entry--compact" : ""}`}>
      {book.cover ? (
        <Link
          href={book.url}
          className="book-entry__cover"
          tabIndex={-1}
          aria-label={`${book.title}を読む`}
        >
          <BookCover book={book} />
        </Link>
      ) : null}
      <div>
        <p className="eyebrow">
          {book.category} · {book.headings.filter(heading => heading.depth === 2).length}章
        </p>
        <h2>
          <Link href={book.url}><InspectionTitle title={book.title} /></Link>
        </h2>
        <p>{book.subtitle}</p>
        <Link href={book.url} className="text-link">
          目次から読む →
        </Link>
      </div>
    </article>
  );
}
