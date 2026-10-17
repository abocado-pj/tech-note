import type { Metadata } from "next";
import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { getAllBooks } from "@/lib/books";
import { CollectionHero } from "@/components/collection-hero";

export const metadata: Metadata = {
  title: "ブック",
  description: "複数の知見を統合し、広いテーマを体系的に読む長い読み物。",
};

export default function BooksPage() {
  const books = getAllBooks();
  return (
    <div className="page-shell book-catalog">
      <CollectionHero title="ブック" description="ひとつのテーマを、基礎から実践まで。複数の知見を統合し、体系的に深く読む。" />
      <section className="book-publication-context">
        <p className="page-subtitle">
          現在公開しているブックには、テーマを絞った既存のガイドも含みます。
          新しい広いテーマの企画は、本文が完成するまで公開ブックに数えません。
        </p>
      </section>
      <div className="book-catalog__heading"><h2 className="collection-section-title">公開中のブック</h2><span>{books.length}冊</span></div>
      <div className="book-list book-list--gallery">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} />
        ))}
      </div>
      <section className="book-plans" aria-labelledby="book-plans-heading">
        <h2 id="book-plans-heading">準備中の企画</h2>
        <p>以下は構成を検討している企画です。本文は未完成で、公開ブックの件数や検索結果には含めていません。</p>
        <ul>{["Flutterエラーハンドリング設計", "RSpec実践ガイド", "Railsデータ処理設計"].map(title => <li key={title}><span className="publication-badge">未公開・構成検討中</span><strong>{title}</strong></li>)}</ul>
      </section>
      <p className="mt-10">
        <Link className="text-link" href="/series">
          共通テーマの独立記事を束ねたシリーズも見る →
        </Link>
      </p>
    </div>
  );
}
