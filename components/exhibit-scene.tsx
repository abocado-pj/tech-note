"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useRef, useState } from "react";
import { WorldToolbar } from "./world-toolbar";
import { withBasePath } from "@/lib/site";
import type { ReadingWorld, WorldObject } from "@/lib/worlds";
import type { WorldArticle } from "./reading-world";
import "./exhibit-scene.css";

type SceneId = "oss" | "network" | "database";
const atlas: Record<SceneId, { width: number; height: number; crops: string[] }> = {
  oss: { width: 2172, height: 724, crops: ["0 0 581 724", "581 0 406 724", "987 0 430 724", "1417 0 290 724", "1707 0 465 724"] },
  network: { width: 2197, height: 716, crops: ["0 0 472 716", "472 0 494 716", "966 0 336 716", "1302 0 485 716", "1787 0 410 716"] },
  database: { width: 1536, height: 1024, crops: ["0 0 768 512", "768 0 768 512", "0 512 968 512", "1040 480 380 544"] },
};

export function SceneObjectArt({ scene, index, className = "" }: { scene: SceneId; index: number; className?: string }) {
  const art = atlas[scene];
  const clipId = useId();
  const [x,y,width,height] = art.crops[index].split(" ");
  return <svg className={`scene-object-art ${className}`} viewBox={art.crops[index]} preserveAspectRatio={scene === "database" && index === 3 ? "none" : "xMidYMid meet"} aria-hidden="true" focusable="false">
    <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
    <image clipPath={`url(#${clipId})`} href={withBasePath(`/images/worlds/${scene}-parts-v2.webp`)} width={art.width} height={art.height} />
  </svg>;
}

export function ExhibitScene({ world, articles }: { world: ReadingWorld; articles: WorldArticle[] }) {
  const scene = world.id as SceneId;
  const objects = world.groups.flatMap((group) => group.objects);
  const [selectedId, setSelectedId] = useState(scene === "oss" ? "parser" : scene === "network" ? "http" : "indexes");
  const selected = objects.find((item) => item.id === selectedId) ?? objects[0];
  const detailId = useId();
  const detail = useRef<HTMLElement>(null);
  const linkedArticles = articles.filter((article) => selected.articles.includes(article.slug));

  function select(item: WorldObject) {
    setSelectedId(item.id);
    if (window.matchMedia("(max-width: 900px)").matches) detail.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }

  function step(direction: number) {
    const index = objects.findIndex((item) => item.id === selectedId);
    select(objects[(index + direction + objects.length) % objects.length]);
  }

  return <section className={`exhibit-scene exhibit-scene--${scene}`} data-selected={selectedId} aria-labelledby="exhibit-scene-title">
    <div className="exhibit-environment" aria-hidden="true" />
    <div className="exhibit-stage">
      <WorldToolbar title={world.title} />
      <div className="exhibit-objects" role="group" aria-label={world.groups[0].name}>
        {objects.map((item, index) => <button key={item.id} className={`scene-object scene-object--${item.id}`} aria-pressed={selectedId === item.id} aria-controls={detailId} onClick={() => select(item)}>
          <SceneObjectArt scene={scene} index={index} />
          <strong className="scene-object-label">{item.label}</strong>
          {scene === "network" && item.id === "tcp" ? <span className="meter-labels" aria-hidden="true"><span>送信</span><span>受信</span></span> : null}
          {scene === "network" && item.id === "dns" ? <span className="dial-labels" aria-hidden="true">{["com","jp","org","net","io"].map((name) => <span key={name} className={`dial-domain--${name}`}>.{name}</span>)}</span> : null}
          {scene === "network" && item.id === "http" ? <span className="http-roll-copy" aria-hidden="true"><strong>HTTPの入口</strong><small>関連する公開記事</small><span>リクエストとレスポンス</span></span> : null}
          {scene === "network" && item.id === "cdn" ? <span className="drawer-labels" aria-hidden="true"><span>東京</span><span>大阪</span><span>シンガポール</span><span>フランクフルト</span><span>ニューヨーク</span></span> : null}
          <span className="sr-only">{item.articles.length ? "記事を選ぶ" : "準備中"}</span>
        </button>)}
      </div>
      <aside ref={detail} id={detailId} className="scene-detail" aria-live="polite" aria-atomic="true">
        <span>{selected.related ? "関連する既存記事" : linkedArticles.length ? "公開記事" : "準備中"}</span>
        <h2>{selected.label}を読む</h2><p>{selected.detail}</p>
        {linkedArticles.length ? linkedArticles.map((article) => <Link href={article.url} key={article.slug}>{article.title}<b aria-hidden="true"> ↗</b></Link>) : <p className="scene-preparing">解説記事は準備中です</p>}
      </aside>
      {scene === "network" ? <label className="scene-knob">つまみを回し、通信をたどる<input type="range" min={0} max={objects.length - 1} value={objects.findIndex((item) => item.id === selectedId)} aria-valuetext={selected.label} onChange={(event) => select(objects[Number(event.target.value)])} /></label> : <footer className="scene-instruction"><button aria-label="前の機構" onClick={() => step(-1)}><ChevronLeft /></button><span>{world.instruction}</span><button aria-label="次の機構" onClick={() => step(1)}><ChevronRight /></button></footer>}
      <p className="scene-metaphor">学習のための比喩表現です。実際の構成図ではありません。</p>
    </div>
  </section>;
}
