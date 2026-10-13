import type { CSSProperties } from "react";
import type { Book } from "@/lib/books";
import { withBasePath } from "@/lib/site";

type PhysicalBookProps = {
  title: string;
  subtitle?: string;
  category: string;
  artwork: string;
  wrap?: boolean;
  tone?: "auth" | "database" | "neutral";
};

/** The wrap's x=120 fold joins the spine and front at one shared scale. */
export function PhysicalBook({
  title,
  subtitle,
  category,
  artwork,
  wrap = true,
  tone = "neutral",
}: PhysicalBookProps) {
  const style = {
    "--book-art": `url("${withBasePath(artwork)}")`,
  } as CSSProperties;
  return (
    <div
      className={`physical-book-stage physical-book-stage--${tone}`}
      aria-hidden="true"
    >
      <div
        className={`physical-book${wrap ? " physical-book--wrap" : ""}`}
        style={style}
      >
        <div className="physical-book__back" />
        <div className="physical-book__pages" />
        <div className="physical-book__spine">
          <span>{title}</span>
          <small>orifolio</small>
        </div>
        <div className="physical-book__front">
          <div className="physical-book__title">
            <small>{category}</small>
            <strong>{title}</strong>
            {subtitle ? <span>{subtitle}</span> : null}
          </div>
          <span className="physical-book__imprint">orifolio</span>
        </div>
      </div>
    </div>
  );
}

export function BookCover({
  book,
}: {
  book: Pick<Book, "title" | "category" | "slug" | "cover">;
}) {
  const database = book.slug === "database-internal";
  return (
    <PhysicalBook
      title={book.title}
      category={book.category}
      artwork={
        database
          ? "/images/orifolio/database-cover-wrap.webp"
          : (book.cover ?? "/images/books/rails-raw-sql-cover.png")
      }
      wrap={database}
      tone={database ? "database" : "neutral"}
    />
  );
}
