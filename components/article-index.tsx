import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { Pagination } from "@/components/pagination";
import { CollectionHero } from "./collection-hero";
import {
  getAllArticles,
  getCategories,
  paginateArticles,
} from "@/lib/articles";

export const ARTICLES_PER_PAGE = 4;

export function ArticleIndex({ page = 1 }: { page?: number }) {
  const paginated = paginateArticles(getAllArticles(), page, ARTICLES_PER_PAGE);
  return (
    <div className="page-shell">
      <CollectionHero title="記事" description="気になる問いを、具体例と詳しい解説から読む。" />
      <div className="collection-links">
        <Link className="text-link" href="/search">
          キーワードで検索 →
        </Link>
      </div>
      <div className="library-columns">
        <div>
          <div className="article-list">
            {paginated.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              currentPage={paginated.currentPage}
              totalPages={paginated.totalPages}
            />
          </div>
        </div>
        <aside className="library-sidebar">
          <h2>分野から探す</h2>
          <nav aria-label="記事の分野" className="topic-links">
            {getCategories().map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                {category.name}
                <span aria-hidden>↗</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
