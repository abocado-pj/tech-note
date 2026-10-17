import Link from "next/link";
import type { Article, SeriesItem } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import {
  LAMBDA_BOOK_URL,
  LAMBDA_SERIES_URL,
  type LambdaInspection,
} from "@/lib/lambda-inspection";
import { LambdaBoundaryGlyph } from "./lambda-boundary-glyph";
import { LambdaInspectionDevice } from "./lambda-inspection-art";
import { MdxContent } from "./mdx-content";
import { ReaderControls } from "./reader-controls";
import { TableOfContents } from "./toc";
import { WorldToolbar } from "./world-toolbar";
import { SeriesArticleContents } from "./series-article-contents";

function InspectionProcess({ inspection }: { inspection: LambdaInspection }) {
  const entry = inspection.kind === "entry";
  const steps = entry
    ? ([
        {
          boundary: "entry",
          title: "HTTPリクエスト",
          detail: "ブラウザから要求を送る",
        },
        {
          boundary: "entry",
          title: "API Gateway",
          detail: "HTTPの要求をイベントへ変換",
        },
        {
          boundary: "execution",
          title: "Lambdaのhandler",
          detail: "配置したJavaScriptを実行",
        },
      ] as const)
    : ([
        {
          boundary: "authorization",
          title: "認証済みの利用者",
          detail: "文書IDからサーバー側の情報を探す",
        },
        {
          boundary: "authorization",
          title: "アプリで対象を認可",
          detail: "本文の例では、文書の所有者かを確認",
        },
        {
          boundary: "role",
          title: "許可した場合にS3を読む",
          detail: "AWS側では実行ロール等を別途評価",
        },
      ] as const);
  return (
    <figure className="inspection-process">
      <figcaption>
        <span>PROCESS NOTE / {inspection.number}</span>
        <strong>
          {entry
            ? "HTTPの入口と、配置したコードの実行"
            : "利用者の認可と、AWS側のアクセス評価"}
        </strong>
      </figcaption>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title}>
            <LambdaBoundaryGlyph boundary={step.boundary} />
            <span className="inspection-process__number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
            {index < steps.length - 1 ? (
              <span className="inspection-process__arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="inspection-process__boundary">
        {entry
          ? "実行前の別工程：TypeScriptをJavaScriptへ変換し、配置します。"
          : "認可しない場合：S3を読まず、本文を返さず終了します。"}
      </p>
      <p className="inspection-process__caption">
        本文の説明用の例を整理した図です。AWSへ配置した構成や稼働状態を示すものではありません。
      </p>
    </figure>
  );
}

export function LambdaInspectionArticle({
  article,
  inspection,
  companion,
  series,
}: {
  article: Article;
  inspection: LambdaInspection;
  companion?: Article;
  series?: SeriesItem;
}) {
  return (
    <>
      <WorldToolbar title="Lambdaの点検机" article />
      <header className="inspection-article-heading">
        <div className="inspection-article-heading__copy">
          <Link href={LAMBDA_SERIES_URL} className="inspection-back">
            ← Lambdaの点検机に戻る
          </Link>
          <p className="inspection-kicker">
            LAMBDA INSPECTION FILE / {inspection.number}
          </p>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="inspection-article-meta">
            <time dateTime={article.updated ?? article.date}>
              {formatDate(article.updated ?? article.date)}
            </time>
            <span>{article.readingTimeMinutes}分で読めます</span>
            <ReaderControls />
          </div>
        </div>
        <div className="inspection-article-specimen">
          <div className="inspection-file__topline">
            <span>点検票 {inspection.number}</span>
            <span>{inspection.label}</span>
          </div>
          <LambdaInspectionDevice kind={inspection.kind} />
          <p>{inspection.focus}</p>
        </div>
      </header>
      <div className="inspection-document">
        <aside className="inspection-document__toc">
          {series ? (
            <SeriesArticleContents series={series} currentSlug={article.slug} />
          ) : null}
          <div id="article-contents">
            <TableOfContents headings={article.headings} />
          </div>
          <div className="inspection-margin-seal" aria-hidden="true">
            {inspection.boundaries.map((boundary) => (
              <LambdaBoundaryGlyph key={boundary} boundary={boundary} />
            ))}
            <span>
              ORIFOLIO
              <br />
              BOUNDARY OBSERVATIONS
            </span>
          </div>
        </aside>
        <div className="inspection-document__body">
          <InspectionProcess inspection={inspection} />
          <div className="prose reading-prose">
            <MdxContent source={article.content} />
          </div>
        </div>
        <aside className="inspection-document__notes">
          <section className="inspection-note">
            <p className="inspection-kicker">
              CHECKPOINT / {inspection.number}
            </p>
            <h2>分けて確認すること</h2>
            <ul>
              {inspection.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <p>{inspection.note}</p>
          </section>
          {companion ? (
            <section className="inspection-companion">
              <p className="inspection-kicker">OTHER INSPECTION FILE</p>
              <h2>もう一つの点検票</h2>
              <Link href={companion.url}>
                {companion.title}
                <span aria-hidden="true"> →</span>
              </Link>
            </section>
          ) : null}
          <Link className="inspection-volume-link" href={LAMBDA_BOOK_URL}>
            一冊で境界をたどる
            <br />
            <strong>ブックの表紙と目次へ →</strong>
          </Link>
        </aside>
      </div>
      <nav
        className="inspection-reading-return"
        aria-label="点検票を読んだ後の移動"
      >
        <Link href={LAMBDA_SERIES_URL}>← Lambdaの点検机へ</Link>
        <Link href="/articles">通常の記事一覧へ →</Link>
        <a href="#article-contents">この記事の目次 ↑</a>
      </nav>
    </>
  );
}
