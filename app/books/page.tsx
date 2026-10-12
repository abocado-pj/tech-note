import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { getAllBooks } from "@/lib/books";

export const metadata: Metadata = {
  title: "ブック",
  description: "複数の知見を統合し、広いテーマを体系的に読む長い読み物。",
};

export default function BooksPage() {
  return (
    <div className="page-shell narrow-collection">
      <header className="collection-header">
        <h1 className="page-heading">ブック</h1>
        <p className="page-subtitle">
          複数の記事の知見を統合し、広いテーマを体系的に深く読む。
        </p>
        <p className="page-subtitle">
          現在公開しているブックには、テーマを絞った既存のガイドも含みます。
          新しい広いテーマの企画は、本文が完成するまで公開ブックに数えません。
        </p>
      </header>
      <div className="book-list">
        {getAllBooks().map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
      <p className="mt-10">
        <Link className="text-link" href="/series">
          共通テーマの独立記事を束ねたシリーズも見る →
        </Link>
      </p>
    </div>
  );
}
