import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleReader } from "@/components/article-reader";
import { ArticleCard } from "@/components/article-card";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { getAllBooks } from "@/lib/books";
import { getAllNotes } from "@/lib/notes";
import { getBooksUsingArticle, getNotesForArticle } from "@/lib/reading-relations";
import { getSeriesBookDefinition } from "@/lib/series-books";
import { absoluteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slugSegments,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  const socialImage = article.thumbnail
    ? {
        url: absoluteUrl(article.thumbnail),
        width: 1200,
        height: 675,
        alt: article.title,
      }
    : {
        url: absoluteUrl("/tech-note-mark.svg"),
        width: 1200,
        height: 630,
        alt: article.title,
      };

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: article.canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: article.canonicalUrl,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updated ?? article.date,
      tags: article.tags,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [socialImage.url],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const related = getRelatedArticles(article, 3);
  const adjacent = getAdjacentArticles(article);
  const series = article.series
    ? getSeriesBookDefinition(article.series.slug)
    : undefined;
  const books = getBooksUsingArticle(article, getAllBooks());
  const notes = getNotesForArticle(article, getAllNotes());
  return (
    <article className="page-shell reader-shell">
      <ArticleReader article={article} />
      {notes.length ? (
        <section className="reading-context" aria-labelledby="related-notes-heading">
          <h2 id="related-notes-heading">関連する短いノート</h2>
          {notes.map((note) => (
            <p key={note.slug}><Link href={note.url}>{note.title} →</Link></p>
          ))}
        </section>
      ) : null}
      {books.length ? (
        <section className="reading-context" aria-labelledby="related-books-heading">
          <h2 id="related-books-heading">この知見を含むブック</h2>
          {books.map((book) => (
            <p key={book.slug}><Link href={book.url}>{book.title} →</Link></p>
          ))}
        </section>
      ) : null}
      {series ? (
        <section className="reading-context">
          <h2>同じテーマのシリーズ</h2>
          <Link href={`/series/${series.slug}`}>
            {series.name} →
          </Link>
        </section>
      ) : null}
      <nav className="reading-adjacent" aria-label="関連する前後の記事">
        {adjacent.previous ? (
          <Link href={adjacent.previous.url}>
            <span>← 同じテーマの前の記事</span>
            <strong>{adjacent.previous.title}</strong>
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link href={adjacent.next.url}>
            <span>同じテーマの次の記事 →</span>
            <strong>{adjacent.next.title}</strong>
          </Link>
        ) : null}
      </nav>
      {related.length ? (
        <section className="related-reading">
          <div className="section-heading">
            <h2>あわせて読む</h2>
          </div>
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} compact />
          ))}
        </section>
      ) : null}
    </article>
  );
}
