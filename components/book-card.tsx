import type { Book } from "@/lib/books";
import { BookCover } from "./book-cover";
import { InspectionTitle } from "./inspection-title";
import { BookOpenLink } from "./book-opening";
import { bookOpeningDetails } from "@/lib/book-artwork";

export function BookCard({
  book,
  compact = false,
}: {
  book: Book;
  compact?: boolean;
}) {
  const presentation = bookOpeningDetails(book);
  return (
    <article className={`book-entry${compact ? " book-entry--compact" : ""}`}>
      {book.cover ? (
        <BookOpenLink
          book={presentation}
          className="book-entry__cover"
          tabIndex={-1}
          aria-label={`${book.title}を読む`}
        >
          <BookCover book={book} />
        </BookOpenLink>
      ) : null}
      <div>
        <p className="eyebrow">
          {book.category} · {book.headings.filter(heading => heading.depth === 2).length}章
        </p>
        <h2>
          <BookOpenLink book={presentation}><InspectionTitle title={book.title} /></BookOpenLink>
        </h2>
        <p>{book.subtitle}</p>
        <BookOpenLink book={presentation} className="text-link">
          目次から読む →
        </BookOpenLink>
      </div>
    </article>
  );
}
