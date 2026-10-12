import type { Book } from "@/lib/books";
import { LogoMark } from "./logo";
import { PaperScene, paperSubject } from "./paper-scene";

export function BookCover({ book }: { book: Pick<Book, "title" | "category" | "slug"> }) {
  return <div className="book-cover-art" aria-hidden><span className="book-cover-art__category">{book.category}</span><strong>{book.title}</strong><PaperScene subject={paperSubject(book.slug)} /><span className="book-cover-art__brand"><LogoMark />tech note</span></div>;
}
