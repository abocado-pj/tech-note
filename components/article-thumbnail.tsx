import type { Article } from "@/lib/articles";
import { PaperScene, paperSubject } from "@/components/paper-scene";

type ArticleThumbnailProps = {
  article: Pick<Article, "title" | "thumbnail">;
  priority?: boolean;
  framed?: boolean;
};

export function ArticleThumbnail({
  article,
  framed = true,
}: ArticleThumbnailProps) {
  if (!article.thumbnail) {
    return null;
  }

  return (
    <div
      className={
        framed
          ? "tech-thumbnail aspect-video w-full overflow-hidden rounded-lg border"
          : "tech-thumbnail aspect-video w-full overflow-hidden"
      }
    >
      <PaperScene subject={paperSubject(article.thumbnail)} />
    </div>
  );
}
