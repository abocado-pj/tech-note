import { Newspaper } from "./newspaper";
import { getAllArticles } from "@/lib/articles";

export const ARTICLES_PER_PAGE = 4;
export function ArticleIndex({ page = 1 }: { page?: number }) {
  const items = getAllArticles().map((article) => ({
    title: article.title,
    description: article.description,
    url: article.url,
    thumbnail: article.thumbnail,
    category: article.category,
    tags: article.tags,
    date: article.updated ?? article.date,
    minutes: article.readingTimeMinutes,
  }));
  return (
    <Newspaper initialPage={page} items={items} />
  );
}
