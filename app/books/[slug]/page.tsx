import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookReader } from "@/components/book-reader";
import { MdxContent } from "@/components/mdx-content";
import { TableOfContents } from "@/components/toc";
import { getAllBooks, getBookBySlug } from "@/lib/books";
import { absoluteUrl } from "@/lib/site";
import { BookCover } from "@/components/book-cover";
import { LAMBDA_SERIES_SLUG, LAMBDA_SERIES_URL } from "@/lib/lambda-inspection";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllBooks().map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) return {};

  const ogImage = book.cover ?? "/tech-note-mark.svg";

  return {
    title: book.title,
    description: book.description,
    alternates: {
      canonical: book.canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: book.canonicalUrl,
      title: book.title,
      description: book.description,
      publishedTime: book.date,
      modifiedTime: book.updated ?? book.date,
      images: [
        {
          url: absoluteUrl(ogImage),
          width: 1200,
          height: book.cover ? 675 : 630,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.description,
      images: [absoluteUrl(ogImage)],
    },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();
  const lambdaBook = slug === LAMBDA_SERIES_SLUG;
  return (
    <article className={`page-shell reader-shell${lambdaBook ? " lambda-book" : ""}`}>
      <header className="reader-heading book-heading">
        <div className="book-heading__text">
        <nav className="reader-breadcrumb" aria-label="パンくず">
          <Link href="/books">ブック</Link>
          <span aria-hidden>/</span>
          {lambdaBook ? <Link href={LAMBDA_SERIES_URL}>Lambdaの点検机</Link> : <span>{book.category}</span>}
        </nav>
        {lambdaBook ? <p className="inspection-kicker">BOUND INSPECTION FILES / AWS</p> : null}
        <h1>{book.title}</h1>
        <p className="reader-description">{book.subtitle}</p>
        <div className="reader-meta">
          <span>
            {book.headings.filter((heading) => heading.depth === 2).length}章
          </span>
        </div>
        </div>
        {book.cover ? (
          <div className="reader-cover"><BookCover book={book} /></div>
        ) : null}
      </header>
      {lambdaBook ? <p className="inspection-book-context">藍色の一冊に、入口・実行・AWSへの権限・利用者の認可を分けて綴じています。<Link href={LAMBDA_SERIES_URL}>独立した2記事から読む →</Link></p> : null}
      <section className="book-overview" aria-labelledby="book-outline-heading">
        <div className="section-heading"><h2 id="book-outline-heading">このブックの構成</h2></div>
        <p>{book.description}</p>
        <ol>{book.headings.filter(heading => heading.depth === 2).map((heading, index) => <li key={heading.id}><a href={`#${heading.id}`}><span aria-hidden>{String(index + 1).padStart(2, "0")}</span>{heading.text}</a></li>)}</ol>
      </section>
      <div className="reading-layout book-page-layout">
        <div className="min-w-0">
          <BookReader chapters={book.headings} title={book.title}>
            <div className="book-prose prose">
              <MdxContent source={book.content} paginateBook />
            </div>
          </BookReader>
        </div>
        <aside className="book-sidebar">
          <TableOfContents headings={book.headings} />
        </aside>
      </div>
      {book.references.length ? (
        <section className="related-reading">
          <div className="section-heading">
            <h2>関連する記事・資料</h2>
          </div>
          {book.references.map((reference) => (
            <div className="article-row" key={reference.href}>
              <div className="article-row__body">
                <h2>
                  {reference.href.startsWith("http") ? (
                    <a href={reference.href} target="_blank" rel="noreferrer">
                      {reference.title} ↗
                    </a>
                  ) : (
                    <Link href={reference.href}>{reference.title}</Link>
                  )}
                </h2>
                {reference.note ? <p>{reference.note}</p> : null}
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </article>
  );
}
