import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "記事",
  description: "Orifolioの単独記事一覧。シリーズの記事は各シリーズ内で読めます。",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
};

export default function ArticlesPage() {
  return <ArticleIndex />;
}
