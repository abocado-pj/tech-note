import type { CSSProperties } from "react";
import Image from "next/image";
import type { Book } from "@/lib/books";
import { withBasePath } from "@/lib/site";
import { getBookArtwork } from "@/lib/book-artwork";

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

type JacketBook = Pick<Book, "title" | "subtitle" | "slug">;

export function BookJacket({ book, eager = false }: { book: JacketBook; eager?: boolean }) {
  const artwork = getBookArtwork(book.slug);
  return (
    <span className={`book-jacket book-jacket--illustrated book-jacket--${artwork?.tone ?? "database"}`} data-book-cover-slug={book.slug}>
      <span className="book-jacket__page-edge" aria-hidden="true" />
      <span className="night-book__spine" aria-hidden="true">
        <span>{book.title}</span>
        <small>orifolio</small>
      </span>
      <span className="night-book__cover">
        {artwork ? <Image className="book-jacket__art" src={withBasePath(artwork.image)} width={1024} height={1536} sizes="(max-width: 680px) 240px, 320px" loading={eager ? "eager" : "lazy"} decoding={eager ? "sync" : "async"} alt="" draggable={false} /> : null}
        <small className="book-jacket__eyebrow">ORIFOLIO / TECHNICAL COLLECTION</small>
        <strong className="book-jacket__title">{artwork ? artwork.lines.map((line, index) => <span key={line}>{index > 0 && book.title.includes(" ") && book.slug !== "lambda-api-boundaries" ? " " : ""}{line}</span>) : book.title}</strong>
        <span className="book-jacket__subject">{artwork?.label}</span>
        <span className="night-book__imprint">orifolio</span>
      </span>
    </span>
  );
}

export function BookCover({ book }: { book: JacketBook }) {
  return (
    <div className="book-cover-stage" aria-hidden="true">
      <div className="night-book book-cover-volume">
        <BookJacket book={book} />
      </div>
    </div>
  );
}
