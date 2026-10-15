"use client";

import Link from "next/link";
import { Hand, Search, Menu } from "lucide-react";
import { useId, useRef, useState } from "react";
import { SiteLogo } from "./logo";
import { withBasePath } from "@/lib/site";
import type { ReadingWorld, WorldObject } from "@/lib/worlds";
import type { WorldArticle } from "./reading-world";
import "./formats-workbench.css";

type ObjectArtId = "jpeg" | "png" | "svg" | "tablet" | "xlsx" | "csv" | "zip";
const objectCrops: Record<ObjectArtId, string> = {
  jpeg: "79 61 1440 915",
  png: "145 66 1283 889",
  svg: "167 58 1150 963",
  tablet: "187 66 1115 893",
  xlsx: "52 113 1442 835",
  csv: "204 19 1147 987",
  zip: "44 53 1472 936",
};

function DeskObjectArt({ id }: { id: ObjectArtId }) {
  return <svg className="desk-object-art" viewBox={objectCrops[id]} aria-hidden="true" focusable="false">
    <image href={withBasePath(`/images/worlds/desk-${id}-v2.png`)} width={id === "svg" ? "1430" : "1536"} height={id === "svg" ? "1100" : "1024"} />
  </svg>;
}

export function FormatsWorkbench({ world, articles }: { world: ReadingWorld; articles: WorldArticle[] }) {
  const objects = world.groups.flatMap((group) => group.objects);
  const [selectedId, setSelectedId] = useState("svg");
  const selected = objects.find((item) => item.id === selectedId) ?? objects[0];
  const detailId = useId();
  const detail = useRef<HTMLElement>(null);
  const firstObject = useRef<HTMLButtonElement>(null);
  const linkedArticles = articles.filter((article) => selected.articles.includes(article.slug));

  function select(item: WorldObject) {
    setSelectedId(item.id);
    if (window.matchMedia("(max-width: 760px)").matches) detail.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }

  function selectionProps(item: WorldObject) {
    return { "aria-pressed": item.id === selectedId, "aria-controls": detailId, onClick: () => select(item) };
  }

  return <section className="formats-workbench" aria-labelledby="formats-workbench-title">
    <div className="formats-environment" aria-hidden="true" />
    <div className="formats-canvas">
      <header className="formats-toolbar">
        <SiteLogo placement="header" />
        <nav aria-label="作業机のナビゲーション">
          <Link href="/search"><Search size={20} aria-hidden="true" />検索</Link>
          <Link href="/articles"><Menu size={20} aria-hidden="true" />記事一覧</Link>
        </nav>
      </header>
      <header className="formats-title">
        <h1 id="formats-workbench-title">拡張子の作業机<span aria-hidden="true">❧</span></h1>
        <p>ファイルのかたちから、つくる楽しさを見つけよう</p>
      </header>
      <div className="formats-tools" role="group" aria-label="形式を知る道具">
        {objects.filter((item) => item.id !== "json" && item.id !== "yaml").map((item, index) => <button
          key={item.id}
          ref={index === 0 ? firstObject : undefined}
          className={`desk-object desk-object--${item.id}`}
          {...selectionProps(item)}
        >
          <DeskObjectArt id={item.id as ObjectArtId} />
          <span className="desk-object-label">{item.label}</span>
          {item.id === "csv" ? <span className="desk-csv-values" aria-hidden="true">id, name<br />1, note<br />2, pen</span> : null}
          <span className="sr-only">{item.articles.length ? "記事を選ぶ" : "準備中の形式"}</span>
        </button>)}
        <div className="desk-tablet">
          <DeskObjectArt id="tablet" />
          <div className="desk-tablet-screen">
            {objects.filter((item) => item.id === "json" || item.id === "yaml").map((item) => <button key={item.id} className={`desk-data desk-data--${item.id}`} {...selectionProps(item)}>
              <strong>{item.label}</strong>
              <code>{item.id === "json" ? '{\n "type": "note",\n "id": 3\n}' : 'theme: light\nlanguage: ja\nfeatures:\n  - search'}</code>
              <small>{item.id === "json" ? "通信データの形式" : "設定を記述する形式"}</small>
            </button>)}
          </div>
        </div>
        <aside ref={detail} id={detailId} className="desk-detail" aria-live="polite" aria-atomic="true">
          <h2>{selected.label}<span aria-hidden="true"> ›</span></h2>
          <p>{selected.detail}</p>
          {linkedArticles.length ? linkedArticles.map((article) => <Link href={article.url} key={article.slug} aria-label={article.title}>記事を読む <span aria-hidden="true">↗</span></Link>) : <span className="desk-preparing">解説記事は準備中</span>}
        </aside>
      </div>
      <button className="formats-instruction" onClick={() => firstObject.current?.focus()}><Hand aria-hidden="true" /><span>道具に触れて、形式を知る</span><span aria-hidden="true"> ›</span></button>
      <footer className="formats-footnote"><Link href="/series">← シリーズへ</Link><span>記事のある道具から読めます。未執筆の形式は準備中です。</span></footer>
    </div>
  </section>;
}
