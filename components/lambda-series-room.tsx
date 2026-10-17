import Link from "next/link";
import type { SeriesItem } from "@/lib/articles";
import {
  LAMBDA_BOOK_URL,
  LAMBDA_BOUNDARIES,
  LAMBDA_INSPECTIONS,
} from "@/lib/lambda-inspection";
import { LambdaBoundaryGlyph } from "./lambda-boundary-glyph";
import { LambdaInspectionDevice } from "./lambda-inspection-art";

export function LambdaBoundaryIndex() {
  return (
    <ol
      className="inspection-boundaries"
      aria-label="区別して読む4つの確認項目"
    >
      {LAMBDA_BOUNDARIES.map((boundary) => (
        <li key={boundary.id}>
          <LambdaBoundaryGlyph boundary={boundary.id} />
          <div>
            <span>{boundary.number}</span>
            <strong>{boundary.label}</strong>
            <p>{boundary.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function LambdaSeriesRoom({ series }: { series: SeriesItem }) {
  return (
    <div className="lambda-room">
      <header className="inspection-room-heading">
        <nav aria-label="パンくず">
          <Link href="/series">シリーズ</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/worlds/aws">AWS機構図鑑</Link>
          <span aria-hidden="true"> / </span>
          <span>Lambdaの点検机</span>
        </nav>
        <div className="inspection-room-intro">
          <div>
            <p className="inspection-kicker">ORIFOLIO · AWS INSPECTION DESK</p>
            <h1>{series.name}</h1>
            <p className="inspection-lead">{series.subtitle}</p>
            <p className="inspection-intro-copy">
              入口で受け取るもの。実行するコード。
              <br />
              同じ机の上で、異なる確認をひとつずつ。
            </p>
            <a className="inspection-brass-link" href="#inspection-files">
              2つの点検票から記事を選ぶ <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="inspection-room-specimen">
            <span className="inspection-specimen-tag">
              LAMBDA / FIELD COLLECTION
            </span>
            <LambdaInspectionDevice kind="entry" />
            <div className="inspection-specimen-caption">
              <span>観察するもの</span>
              <strong>呼び出す入口と、動くコード。</strong>
              <p>
                機械の姿は学習用の比喩です。
                <br />
                実際の構成・処理は本文の図とコードで確認します。
              </p>
            </div>
          </div>
        </div>
        <LambdaBoundaryIndex />
      </header>
      <section
        id="inspection-files"
        className="inspection-desk"
        aria-labelledby="inspection-files-heading"
      >
        <div className="inspection-section-heading">
          <div>
            <p className="inspection-kicker">TWO INSPECTION FILES</p>
            <h2 id="inspection-files-heading">机に並ぶ、2つの点検票</h2>
          </div>
          <p>
            公開中の全{series.articles.length}記事。
            <br />
            関心のある票から読めます。
          </p>
        </div>
        <div className="inspection-file-grid">
          {LAMBDA_INSPECTIONS.map((inspection) => {
            const article = series.articles.find(
              (item) => item.slug === inspection.slug,
            );
            if (!article) return null;
            return (
              <Link
                href={article.url}
                key={article.slug}
                className="inspection-file"
              >
                <span className="inspection-file__clip" aria-hidden="true" />
                <div className="inspection-file__topline">
                  <span>点検票 {inspection.number}</span>
                  <span>{article.readingTimeMinutes}分で読めます</span>
                </div>
                <LambdaInspectionDevice kind={inspection.kind} />
                <p className="inspection-file__label">{inspection.label}</p>
                <h3>{article.title}</h3>
                <p className="inspection-file__focus">{inspection.focus}</p>
                <ul>
                  {inspection.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
                <span className="inspection-file__open">
                  この点検票を読む <span aria-hidden="true">↗</span>
                </span>
              </Link>
            );
          })}
        </div>
        <aside className="inspection-scope">
          <strong>この机で確かめる範囲</strong>
          <p>{series.notes[0].body}</p>
        </aside>
        <div className="inspection-book-invitation">
          <div>
            <p className="inspection-kicker">BOUND VOLUME</p>
            <h2>境界をつなげて読む、一冊。</h2>
            <p>既存のブックでは、文書APIの合成例を6章に分けて読みます。</p>
          </div>
          <Link href={LAMBDA_BOOK_URL} className="inspection-brass-link">
            ブックの表紙と目次へ <span aria-hidden="true">→</span>
          </Link>
        </div>
        <nav className="inspection-exit" aria-label="ほかの読み方">
          <Link href="/worlds/aws">AWS機構図鑑へ →</Link>
          <Link href="/articles">通常の記事一覧へ →</Link>
        </nav>
      </section>
    </div>
  );
}
