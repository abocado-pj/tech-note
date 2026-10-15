import Link from "next/link";
import { ContentCatalog } from "./content-catalog";
import { ArticleThumbnail } from "./article-thumbnail";
import { getAllArticles } from "@/lib/articles";
import { getSeriesArtwork } from "@/lib/collection-artwork";

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
  }));
  return (
    <ContentCatalog
      kind="articles"
      initialPage={page}
      items={items}
      sidebar={
        <>
          <h2>シリーズから探す</h2>
          <Link className="sidebar-series" href="/series/world-file-extensions">
            <ArticleThumbnail
              article={{
                title: "ファイル形式のテーマ画像",
                thumbnail: getSeriesArtwork("world-file-extensions"),
              }}
              framed={false}
            />
            <strong>世界の拡張子　→</strong>
            <p>文書・設定・表・画像・Webコードの中身と処理を読む。</p>
          </Link>
        </>
      }
    />
  );
}
