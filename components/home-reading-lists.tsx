import Link from "next/link";
import type { Article } from "@/lib/articles";
import type { Note } from "@/lib/notes";
import { ArticleThumbnail } from "./article-thumbnail";

export function HomeReadingLists({ articles, notes }: { articles: Article[]; notes: Note[] }) {
  return (
    <div className="home-reading-columns">
      <section aria-labelledby="home-articles-heading">
        <div className="section-heading">
          <h2 id="home-articles-heading">記事から探す</h2>
          <Link href="/articles">すべての記事を見る <span aria-hidden>→</span></Link>
        </div>
        {articles.map(article => (
          <article className="home-article-row" key={article.slug}>
            <Link href={article.url} className="home-reading-image" tabIndex={-1} aria-hidden>
              <ArticleThumbnail article={article} framed={false} />
            </Link>
            <div className="home-reading-copy">
              <h3><Link href={article.url}>{article.title}</Link></h3>
              {article.series && <p className="home-reading-series">シリーズ：{article.series.name}</p>}
              <p>{article.description}</p>
              <div className="tag-chips" aria-label="記事のタグ">
                {article.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </section>
      <section aria-labelledby="home-notes-heading">
        <div className="section-heading">
          <h2 id="home-notes-heading">小さなノート</h2>
          <Link href="/notes">すべてのノートを見る <span aria-hidden>→</span></Link>
        </div>
        {notes.map(note => (
          <article className="home-note-row" key={note.slug}>
            <Link href={note.url} className="home-reading-image" tabIndex={-1} aria-hidden>
              <ArticleThumbnail article={note} framed={false} />
            </Link>
            <div className="home-reading-copy">
              <h3><Link href={note.url}>{note.title}</Link></h3>
              <p>{note.description}</p>
              <time dateTime={note.date}>{note.date.replaceAll("-", ".")}</time>
            </div>
          </article>
        ))}
        <Link className="home-series-link" href="/series">シリーズをたどる <span aria-hidden>→</span></Link>
      </section>
    </div>
  );
}
