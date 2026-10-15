"use client";

import Link from "next/link";
import { Database, Code2, Workflow, X } from "lucide-react";
import { useRef, useState } from "react";

export type ShelfBook = {
  title: string;
  subtitle: string;
  slug: string;
  url: string;
  headings: { id: string; text: string }[];
};
const icons = [Database, Code2, Workflow];

export function NightBookshelf({ books }: { books: ShelfBook[] }) {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const book = books[selected];
  if (!book) return null;
  const contents = (
    <>
      <p className="shelf-preview__eyebrow">目次をひらく</p>
      <h2>{book.title}</h2>
      <p className="shelf-preview__subtitle">{book.subtitle}</p>
      <ol>
        {book.headings.slice(0, 3).map((heading, index) => (
          <li key={heading.id}>
            <Link
              href={`${book.url}#${heading.id}`}
              onClick={() => dialog.current?.close()}
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
        onClick={() => dialog.current?.close()}
      >
        この本を読む <span aria-hidden>→</span>
      </Link>
    </>
  );
  return (
    <section className="night-bookshelf" aria-label="公開中の本棚">
      <div className="night-bookshelf__row">
        <div className="night-bookshelf__books">
          {books.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                className="night-book-item"
                key={item.slug}
                onMouseEnter={() => setSelected(index)}
                onFocus={() => setSelected(index)}
              >
                <Link
                  className={`night-book night-book--${index}`}
                  href={item.url}
                  aria-label={`${item.title}を読む`}
                >
                  <span className="night-book__spine" aria-hidden>
                    {item.title}
                  </span>
                  <span className="night-book__cover">
                    <small>ORIFOLIO / TECHNOLOGY</small>
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                    <Icon
                      strokeWidth={0.7}
                      aria-hidden
                      className="night-book__icon"
                    />
                    <span className="night-book__imprint">orifolio</span>
                  </span>
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
        <aside className="shelf-preview">{contents}</aside>
      </div>
      <div className="shelf-caption">
        <Link href="/books">↗　本で体系的に読む</Link>
        <span>本に触れて、目次をプレビュー</span>
      </div>
      <dialog
        className="shelf-dialog"
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
        {contents}
      </dialog>
    </section>
  );
}
