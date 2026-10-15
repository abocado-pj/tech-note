import Link from "next/link";
import { Monitor, UserRound, ShieldCheck } from "lucide-react";
import { MdxContent } from "./mdx-content";
import { TableOfContents } from "./toc";
import { ReaderControls } from "./reader-controls";
import { WorldToolbar } from "./world-toolbar";
import { SceneObjectArt } from "./exhibit-scene";
import { CabinetMechanism } from "./cabinet-and-film";
import { withBasePath } from "@/lib/site";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/articles";
import type { ReadingWorld } from "@/lib/worlds";
import "./world-article-reader.css";

type Guide = { title: string; steps: [string, string, string]; note: string; mechanisms?: [string,string,string] };
const guides: Record<string, Guide> = {
  "aws/lambda/typescript-handler-and-api-entry": { title: "HTTPの入口と、配置したコードの実行", steps: ["ブラウザ\nGET /hello", "API Gateway\nHTTPイベントへ変換", "Lambdaのhandler\n配置済みJavaScript"], mechanisms:["browser","api-gateway","lambda"], note: "HTTPリクエストとhandlerの入力は、API Gatewayで形式が変わります。TypeScriptの型検査は実行前の工程です。" },
  "aws/iam/execution-role-and-user-authorization": { title: "異なる主体について、別々に判断する", steps: ["認証済み利用者\n文書ID", "アプリの認可\n利用者と文書の関係", "S3の読取り\n実行ロール等の評価"], mechanisms:["principal","authorization","s3"], note: "この例では、利用者が文書の所有者でないときはS3を読みません。関数の権限から、利用者の閲覧権限は決まりません。" },
  "rails/rspec/real-vs-mock-boundary": { title: "この例で本物にする境界", steps: ["登録処理\n本物のモデル", "PostgreSQL\n一意制約・巻き戻し", "通知先のfake\n要求だけを記録"], note: "DBに残った状態と通知先へ渡した要求までを確かめます。受信側への配送成功は、このテストの範囲に含みません。" },
  "file-formats/extensions/json": { title: "構文と、使う項目の検証を分ける", steps: ["JSONのテキスト", "JSON.parse\n値へ変換", "項目の検証\nid・publishedの型"], note: "JSONとして読めても、アプリが必要とする項目や業務の条件が満たされるとは限りません。" },
};

function ProcessMechanism({ world, index, mechanism }: {world: ReadingWorld; index: number; mechanism?: string}) {
  if (mechanism === "browser") return <Monitor className="process-neutral-icon" strokeWidth={1} />;
  if (mechanism === "principal") return <UserRound className="process-neutral-icon" strokeWidth={1} />;
  if (mechanism === "authorization") return <ShieldCheck className="process-neutral-icon" strokeWidth={1} />;
  if (world.id === "aws" && mechanism) return <CabinetMechanism id={mechanism} />;
  if (world.id === "oss") return <SceneObjectArt scene="oss" index={index + 1} />;
  return <span>{["{ }", "→", "✓"][index]}</span>;
}

function ReaderMechanism({ world, slug }: { world: ReadingWorld; slug: string }) {
  const objects = world.groups.flatMap((group) => group.objects);
  const index = Math.max(0, objects.findIndex((item) => item.articles.includes(slug)));
  const object = objects[index];
  if (world.id === "aws") return <CabinetMechanism id={object.id} />;
  if (world.id === "oss") return <svg viewBox="0 0 1536 1024" aria-hidden="true"><image href={withBasePath("/images/worlds/oss-reader-hero-v2.webp")} width="1536" height="1024" /></svg>;
  if (world.id === "network" || world.id === "database") return <SceneObjectArt scene={world.id} index={index} />;
  if (world.id === "git") return <div className="reader-film-art" aria-hidden="true" />;
  const asset = ["json", "yaml"].includes(object.id) ? "tablet" : object.id === "csv" ? "csv" : "svg";
  // The labels and article title are real text; this image is only a physical illustration.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={withBasePath(`/images/worlds/desk-${asset}-v2.webp`)} width="1536" height="1024" alt="" />;
}

export function WorldArticleReader({ article, world, nextArticle }: { article: Article; world: ReadingWorld; nextArticle?: Pick<Article,"url"|"title"|"slug"> }) {
  const guide = guides[article.slug];
  const worldUrl = world.id === "formats" ? "/series/world-file-extensions" : `/worlds/${world.id}`;
  return <>
    <WorldToolbar title={world.title} article />
    <div className="world-document">
      <header className="world-document-heading">
        <div className="world-document-title"><Link href={worldUrl}>← {world.title}に戻る</Link><p className="world-document-kicker">{article.category} / FIELD NOTES</p><h1>{article.title}</h1><p>{article.description}</p><div className="world-document-meta"><time dateTime={article.updated ?? article.date}>{formatDate(article.updated ?? article.date)}</time><span>{article.readingTimeMinutes}分で読めます</span><ReaderControls /></div></div>
        <div className="world-document-hero"><ReaderMechanism world={world} slug={article.slug} /><span>ORIFOLIO · {world.id.toUpperCase()}</span></div>
      </header>
      <div className="world-document-columns">
        <aside className="world-document-toc"><div id="article-contents"><TableOfContents headings={article.headings} /></div><div className="document-blueprint" aria-hidden="true"><svg viewBox="0 0 200 220"><g fill="none" stroke="currentColor" strokeWidth=".7"><circle cx="95" cy="90" r="65"/><circle cx="95" cy="90" r="42"/><circle cx="95" cy="90" r="18"/><path d="M95 8v164M10 90h170M30 25l130 130M30 155L160 25M30 180h135M30 175v10M165 175v10"/></g></svg><span>ORIFOLIO<br />OBSERVATION NOTES</span></div></aside>
        <div className="world-document-body">
          {guide ? <figure className="world-process"><figcaption>{guide.title}</figcaption><ol>{guide.steps.map((step,index) => <li key={step}><div className="process-mechanism" aria-hidden="true"><ProcessMechanism world={world} index={index} mechanism={guide.mechanisms?.[index]} /></div><strong>{step}</strong>{index < 2 ? <span className="process-arrow" aria-hidden="true">→</span> : null}</li>)}</ol><p>本文で扱う範囲の見取り図。機械の姿は学習用の比喩です。</p></figure> : null}
          <div className="prose reading-prose"><MdxContent source={article.content} /></div>
        </div>
        <aside className="world-document-notes"><section className="document-note"><h2>読むポイント</h2><p>{guide?.note ?? article.description}</p><small>本文の説明に沿って、境界と条件を確認してください。</small></section>{nextArticle ? <section className="document-next"><h2>次に読む</h2><div className="document-next-art"><ReaderMechanism world={world} slug={nextArticle.slug} /></div><Link href={nextArticle.url}>{nextArticle.title}<span aria-hidden="true"> →</span></Link></section> : null}<Link className="document-world-return" href={worldUrl}>展示室へ戻る →</Link></aside>
      </div>
      <nav className="reader-return" aria-label="読み終えた後の移動"><Link href="/articles">← 記事一覧へ</Link><a href="#article-contents">目次 ↑</a></nav>
    </div>
  </>;
}
