"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { BookJacket } from "./book-cover";

export type ShelfBook = {
  title: string;
  subtitle: string;
  slug: string;
  url: string;
  headings: { id: string; text: string }[];
};

function ShelfContents({ book, onNavigate }: { book: ShelfBook; onNavigate?: () => void }) {
  return (
    <>
      <p className="shelf-preview__eyebrow">目次をひらく</p>
      <h2>{book.title}</h2>
      <p className="shelf-preview__subtitle">{book.subtitle}</p>
      <ol>
        {book.headings.slice(0, 3).map((heading, index) => (
          <li key={heading.id}>
            <Link
              href={`${book.url}#${heading.id}`}
              onClick={onNavigate}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {heading.text}
              <span aria-hidden>›</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link
        href={book.url}
        className="blue-button"
        onClick={onNavigate}
      >
        この本を読む <span aria-hidden>→</span>
      </Link>
    </>
  );
}

export function NightBookshelf({ books }: { books: ShelfBook[] }) {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const book = books[selected];
  if (!book) return null;
  return (
    <section className="night-bookshelf" aria-label="公開中の本棚">
      <div className="night-bookshelf__row">
        <div className="night-bookshelf__books">
          {books.map((item, index) => {
            return (
              <div
                className="night-book-item"
                key={item.slug}
                onMouseEnter={() => setSelected(index)}
                onFocus={() => setSelected(index)}
              >
                <Link
                  className="night-book"
                  href={item.url}
                  aria-label={`${item.title}を読む`}
                >
                  <BookJacket book={item} />
                </Link>
                <button
                  className="book-contents-button"
                  onClick={() => {
                    setSelected(index);
                    dialog.current?.showModal();
                  }}
                  aria-label={`${item.title}の目次を見る`}
                >
                  目次を見る <span aria-hidden>›</span>
                </button>
              </div>
            );
          })}
        </div>
        <aside className="shelf-preview" aria-label={`${book.title}の目次`}>
          {books.map((preview, index) => (
            <div
              className="shelf-preview__panel"
              key={preview.slug}
              aria-hidden={index !== selected}
              inert={index !== selected}
            >
              <ShelfContents book={preview} />
            </div>
          ))}
        </aside>
      </div>
      <div className="shelf-caption">
        <Link href="/books">↗　本で体系的に読む</Link>
        <span>本に触れて、目次をプレビュー</span>
      </div>
      <dialog
        className="shelf-dialog"
        aria-label={`${book.title}の目次`}
        ref={dialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="shelf-dialog__close"
          aria-label="目次を閉じる"
          onClick={() => dialog.current?.close()}
        >
          <X aria-hidden />
        </button>
        <ShelfContents book={book} onNavigate={() => dialog.current?.close()} />
      </dialog>
    </section>
  );
}
