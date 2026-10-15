"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { ReadingWorld, WorldObject } from "@/lib/worlds";
import { WorldSpecimen, WorldObjectArt } from "./world-specimen";

export type WorldArticle = { slug: string; title: string; url: string };
export function ReadingWorldView({ world, articles }: { world: ReadingWorld; articles: WorldArticle[] }) {
  const objects = world.groups.flatMap((group) => group.objects);
  const [selectedId, setSelectedId] = useState(world.id === "aws" ? "sqs" : objects.find((item) => item.articles.length)?.id ?? objects[0].id);
  const [query, setQuery] = useState("");
  const [frame, setFrame] = useState(0);
  const panelId = useId();
  const panel = useRef<HTMLElement>(null);
  const selected = objects.find((item) => item.id === selectedId) ?? objects[0];
  const linkedArticles = selected.articles.flatMap((slug) => articles.filter((article) => article.slug === slug));
  const matches = (item: WorldObject) => `${item.label} ${item.detail}`.toLocaleLowerCase().includes(query.toLocaleLowerCase());

  function select(item: WorldObject) {
    setSelectedId(item.id);
    if (window.matchMedia("(max-width: 760px)").matches) panel.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function step(direction: number) {
    const index = objects.findIndex((item) => item.id === selectedId);
    setSelectedId(objects[(index + direction + objects.length) % objects.length].id);
    setFrame((value) => value + direction);
  }
  return (
    <section className={`reading-world world--${world.id}`} aria-labelledby="world-title">
      <nav className="world-navigation" aria-label="展示のナビゲーション">
        <Link href="/series">← シリーズ</Link>
        <span>EXHIBITION / {world.id.toUpperCase()}</span>
        <Link href="/search">検索</Link><Link href="/articles">記事一覧</Link>
      </nav>
      <header className="world-heading">
        <div><p className="world-eyebrow">ORIFOLIO · しくみの展示室</p><h1 id="world-title">{world.title}</h1><p>{world.subtitle}</p></div>
        {world.id === "aws" ? <label className="world-search">サービス・役割で探す<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SQS、Lambda、IAM…" /></label> : null}
      </header>
      {world.id === "git" ? <div className="projection" aria-label="選択したフィルム"><WorldSpecimen className="projector-art" specimen={{source:"git",crop:[0,85,295,430]}} /><div className="projection-screen"><WorldSpecimen specimen={{source:"git",crop:[475,127,580,225]}} /><span>TAKE {String(Math.abs(frame) + 1).padStart(2, "0")}</span><h2>{selected.label}</h2><p>{selected.detail}</p></div><WorldSpecimen className="reel-art" specimen={{source:"git",crop:[1153,170,130,316]}} /></div> : null}
      <div className="world-workspace">
        <div className="world-exhibits">
          {world.groups.map((group) => <section className="world-group" key={group.name} aria-label={group.name}>
            <h2>{group.name}</h2>
            <div className="world-object-grid">
              {group.objects.filter(matches).map((item, index) => <button key={item.id} className={`world-object object--${item.id}`} aria-pressed={selectedId === item.id} aria-controls={panelId} onClick={() => select(item)}>
                <span className="object-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <WorldObjectArt item={item} />
                {world.id === "network" && item.id === "http" ? <span className="http-scroll"><b>リクエスト</b><span>↓</span><b>レスポンス</b><small>通信の往復を読む</small></span> : null}
                <strong className="object-plaque">{item.label}</strong>
                <span className="object-availability">{item.articles.length ? item.related ? "関連する記事" : "記事あり" : "準備中"}</span>
              </button>)}
            </div>
          </section>)}
          {query && !objects.some(matches) ? <p role="status" className="world-empty">一致する機構はありません。名前を変えて探してください。</p> : null}
        </div>
        {world.id === "formats" ? <div className="workbench-props" aria-hidden="true"><WorldSpecimen className="desk-plant-left" specimen={{source:"formats",crop:[0,75,140,215]}} /><WorldSpecimen className="desk-plant-right" specimen={{source:"formats",crop:[1135,75,210,180]}} /></div> : null}
        {world.id === "oss" ? <div className="workshop-props" aria-hidden="true"><WorldSpecimen specimen={{source:"oss",crop:[15,563,370,253]}} /><WorldSpecimen specimen={{source:"oss",crop:[1020,700,475,200]}} /></div> : null}
        {world.id === "network" ? <div className="switchboard-controls"><WorldSpecimen specimen={{source:"network",crop:[275,650,950,183]}} /><label>つまみで機構を選ぶ<input type="range" min={0} max={objects.length - 1} value={objects.findIndex((item) => item.id === selectedId)} aria-valuetext={selected.label} onChange={(event) => setSelectedId(objects[Number(event.target.value)].id)} /></label></div> : null}
        <aside ref={panel} id={panelId} className="world-object-detail" aria-label="選んだ道具の詳細" aria-live="polite" aria-atomic="true">
          <span className="detail-kicker">{selected.related ? "関連する既存記事" : linkedArticles.length ? "公開記事" : "準備中"}</span>
          <h2>{selected.label}</h2><p>{selected.detail}</p>
          <WorldObjectArt item={selected} />
          {linkedArticles.length ? <ul>{linkedArticles.map((article) => <li key={article.slug}><Link href={article.url}><span>{article.title}</span><b aria-hidden="true">↗</b></Link></li>)}</ul> : <p className="world-preparing">解説本文はまだ公開していません。<Link href="/articles">公開済みの記事を探す →</Link></p>}
        </aside>
      </div>
      <footer className="world-instruction">
        {world.id === "git" ? <div className="film-controls"><button onClick={() => step(-1)} aria-label="前のフィルム">◀</button><button onClick={() => step(1)} aria-label="次のフィルム">▶</button></div> : null}
        <p>{world.instruction}</p>
        <small>学習のための比喩表現です。実際の構成図ではありません。</small>
      </footer>
    </section>
  );
}
