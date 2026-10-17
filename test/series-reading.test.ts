import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticleBySlug,
  getArticleSeriesDefinition,
  getArticlesByCategory,
  getArticlesBySeries,
  getArticlesByTag,
  getCategories,
  getRelatedArticles,
  getSearchIndex,
  getSeries,
  getStandaloneArticles,
  getTags,
  paginateArticles,
} from "../lib/articles";
import { SERIES_BOOKS } from "../lib/series-books";
import { searchContent } from "../lib/search";
import { READING_WORLDS } from "../lib/worlds";

describe("standalone journal and series reading boundaries", () => {
  const all = getAllArticles();
  const standalone = getStandaloneArticles();
  const series = getSeries();

  it("uses explicit membership in the three registered series, with no missing or multiple assignment", () => {
    assert.equal(all.length, 84);
    assert.equal(standalone.length, 69);
    assert.equal(series.length, 3);
    const assigned = new Set<string>();
    for (const definition of SERIES_BOOKS) {
      const expected = definition.sections.flatMap(
        (section) => section.articleSlugs,
      );
      const members = getArticlesBySeries(definition.slug);
      assert.deepEqual(
        members.map((article) => article.slug),
        expected,
      );
      for (const [index, article] of members.entries()) {
        assert.ok(
          !assigned.has(article.slug),
          `${article.slug}: multiple assignment`,
        );
        assigned.add(article.slug);
        assert.equal(article.series?.slug, definition.slug);
        assert.equal(article.series?.order, index + 1);
      }
    }
    assert.equal(assigned.size, 15);
    for (const article of all) {
      if (article.series)
        assert.ok(
          getArticleSeriesDefinition(article),
          `${article.slug}: unregistered series`,
        );
      assert.equal(
        assigned.has(article.slug),
        Boolean(getArticleSeriesDefinition(article)),
      );
    }
    const lambda = all.find(
      (article) =>
        article.slug === "aws/lambda/typescript-handler-and-api-entry",
    )!;
    assert.equal(
      getArticleSeriesDefinition({ ...lambda, series: undefined }),
      undefined,
    );
  });

  it("does not infer series membership from a world exhibition or a related article", () => {
    const aws = READING_WORLDS.find((world) => world.id === "aws")!;
    const s3 = aws.groups
      .flatMap((group) => group.objects)
      .find((object) => object.id === "s3")!;
    assert.ok(s3.articles.length > 0);
    for (const slug of s3.articles) {
      const article = all.find((candidate) => candidate.slug === slug)!;
      assert.ok(article);
      assert.equal(getArticleSeriesDefinition(article), undefined);
      assert.ok(standalone.some((candidate) => candidate.slug === slug));
    }
  });

  it("counts and lists only standalone articles in categories and tags, preserving empty taxonomy URLs", () => {
    assert.equal(
      getCategories().reduce((sum, category) => sum + category.count, 0),
      69,
    );
    for (const category of getCategories()) {
      const articles = getArticlesByCategory(category.slug);
      assert.equal(articles.length, category.count);
      assert.ok(
        articles.every((article) => !getArticleSeriesDefinition(article)),
      );
    }
    assert.equal(
      getCategories().find((category) => category.slug === "aws")?.count,
      0,
    );
    assert.equal(
      getCategories().find((category) => category.slug === "file-formats")
        ?.count,
      0,
    );
    for (const tag of getTags()) {
      const articles = getArticlesByTag(tag.slug);
      assert.equal(articles.length, tag.count);
      assert.ok(
        articles.every((article) => !getArticleSeriesDefinition(article)),
      );
    }
  });

  it("paginates all 69 standalone articles into 18 pages without missing, repeating, or admitting series articles", () => {
    const collected: string[] = [];
    for (let page = 1; page <= 18; page++) {
      const result = paginateArticles(standalone, page, 4);
      assert.equal(result.totalPages, 18);
      assert.equal(result.currentPage, page);
      assert.equal(result.articles.length, page === 18 ? 1 : 4);
      collected.push(...result.articles.map((article) => article.slug));
    }
    assert.deepEqual(
      collected,
      standalone.map((article) => article.slug),
    );
    assert.equal(new Set(collected).size, 69);
    assert.equal(paginateArticles(standalone, 0, 4).currentPage, 1);
    assert.equal(paginateArticles(standalone, 19, 4).currentPage, 18);
  });

  it("keeps each series in order and stops at its first and last articles", () => {
    for (const group of series) {
      group.articles.forEach((article, index) => {
        const adjacent = getAdjacentArticles(article);
        assert.equal(adjacent.previous?.slug, group.articles[index - 1]?.slug);
        assert.equal(adjacent.next?.slug, group.articles[index + 1]?.slug);
        assert.ok(
          getRelatedArticles(article).every(
            (related) => related.series?.slug === group.slug,
          ),
        );
      });
    }
    for (const article of standalone) {
      const adjacent = getAdjacentArticles(article);
      for (const other of [
        adjacent.previous,
        adjacent.next,
        ...getRelatedArticles(article),
      ]) {
        if (other) assert.equal(getArticleSeriesDefinition(other), undefined);
      }
    }
  });

  it("retains every published direct URL and full-text search, identifying the series on each member", () => {
    const index = getSearchIndex();
    assert.equal(index.length, 84);
    for (const article of all) {
      assert.equal(getArticleBySlug(article.slugSegments)?.url, article.url);
      const entry = index.find((item) => item.url === article.url);
      assert.ok(entry);
      const definition = getArticleSeriesDefinition(article);
      assert.equal(entry.series, definition?.name);
      assert.equal(
        entry.seriesUrl,
        definition ? `/series/${definition.slug}` : undefined,
      );
      assert.ok(
        searchContent(index, article.title).some(
          (item) => item.url === article.url,
        ),
      );
    }
  });
});
