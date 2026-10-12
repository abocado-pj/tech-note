import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAllArticles } from "../lib/articles";
import { getAllBooks } from "../lib/books";
import { getAllNotes } from "../lib/notes";
import { getArticlesForNote, getBooksUsingArticle, getNotesForArticle } from "../lib/reading-relations";

describe("reading relationships", () => {
  it("shows a note relationship only when explicitly declared", () => {
    const articles = getAllArticles();
    const article = articles.find((item) => item.slug === "aws/iam/execution-role-and-user-authorization")!;
    const note = getAllNotes().find((item) => item.slug === "aws/lambda-permission-checklist")!;
    assert.ok(article && note);
    assert.deepEqual(getNotesForArticle(article, [note]), []);
    assert.deepEqual(getArticlesForNote(note, articles), []);

    const linkedNote = { ...note, relatedArticleSlugs: [article.slug, "unpublished/missing"] };
    assert.deepEqual(getNotesForArticle(article, [linkedNote]), [linkedNote]);
    assert.deepEqual(getArticlesForNote(linkedNote, articles).map((item) => item.slug), [article.slug]);
  });

  it("uses published books' explicit source references rather than a shared category", () => {
    const books = getAllBooks();
    const article = getAllArticles().find((item) => item.slug === "aws/iam/execution-role-and-user-authorization")!;
    assert.ok(article);
    assert.deepEqual(getBooksUsingArticle(article, books).map((book) => book.slug), ["lambda-api-boundaries"]);
    assert.deepEqual(getBooksUsingArticle({ slug: "aws/unrelated", url: "/articles/aws/unrelated" }, books), []);
  });
});
