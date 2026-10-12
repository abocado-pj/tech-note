import type { Article } from "./articles";
import type { Book } from "./books";
import type { Note } from "./notes";

export function getNotesForArticle(article: Pick<Article, "slug">, notes: Note[]) {
  return notes.filter((note) => note.relatedArticleSlugs.includes(article.slug));
}

export function getBooksUsingArticle(article: Pick<Article, "slug" | "url">, books: Book[]) {
  return books.filter((book) =>
    book.references.some((reference) =>
      reference.articleSlug === article.slug || reference.href === article.url,
    ),
  );
}

export function getArticlesForNote(note: Pick<Note, "relatedArticleSlugs">, articles: Article[]) {
  const relatedSlugs = new Set(note.relatedArticleSlugs);
  return articles.filter((article) => relatedSlugs.has(article.slug));
}
