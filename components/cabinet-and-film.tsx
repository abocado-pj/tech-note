"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useRef, useState } from "react";
import { WorldToolbar } from "./world-toolbar";
import { withBasePath } from "@/lib/site";
import type { ReadingWorld } from "@/lib/worlds";
import type { WorldArticle } from "./reading-world";
import "./exhibit-scene.css";
import "./cabinet-and-film.css";

const cabinetCrops: Record<string, [number, number, number, number]> = {
  ec2:[0,0,306,224],ecs:[306,0,288,224],eks:[594,0,260,224],lambda:[1200,224,336,196],
  s3:[0,224,314,196],ebs:[314,224,280,196],efs:[594,224,295,196],rds:[889,224,311,196],aurora:[1200,224,336,196],dynamodb:[0,420,314,184],elasticache:[314,420,280,184],
  vpc:[594,420,295,184],route53:[889,420,311,184],cloudfront:[1200,420,336,184],elb:[0,604,314,199],"api-gateway":[314,604,280,199],
  iam:[594,604,295,199],cognito:[889,604,311,199],kms:[1200,604,336,199],"secrets-manager":[0,803,256,221],
  sqs:[256,803,292,221],sns:[548,803,250,221],eventbridge:[798,803,213,221],"step-functions":[1011,803,274,221],
  cloudwatch:[1285,803,251,221],cloudtrail:[594,224,295,196],athena:[1200,604,336,199],glue:[1250,0,286,224],redshift:[854,0,396,224],
};
const dedicatedMechanisms: Record<string, { width: number; height: number; crop: [number,number,number,number] }> = {
  aurora: {width:1774,height:887,crop:[57,168,1660,535]},
  cloudtrail: {width:1536,height:1024,crop:[253,16,1030,1008]},
  athena: {width:1295,height:1215,crop:[133,57,1059,1099]},
};

export function CabinetMechanism({ id, className = "" }: { id: string; className?: string }) {
  const dedicated = dedicatedMechanisms[id];
  const crop = dedicated?.crop ?? cabinetCrops[id] ?? cabinetCrops.ec2;
  const clipId = useId();
  return <svg className={`cabinet-mechanism ${className}`} viewBox={crop.join(" ")} aria-hidden="true" focusable="false"><defs><clipPath id={clipId}><rect x={crop[0]} y={crop[1]} width={crop[2]} height={crop[3]} /></clipPath></defs><image clipPath={`url(#${clipId})`} href={withBasePath(`/images/worlds/${dedicated ? `aws-${id}` : "aws-parts"}-v2.webp`)} width={dedicated?.width ?? 1536} height={dedicated?.height ?? 1024} /></svg>;
}

export function AwsCabinet({ world, articles }: { world: ReadingWorld; articles: WorldArticle[] }) {
  const objects = world.groups.flatMap((group) => group.objects);
  const [selectedId, setSelectedId] = useState("sqs");
  const [query, setQuery] = useState("");
  const selected = objects.find((item) => item.id === selectedId) ?? objects[0];
  const detailId = useId();
  const detail = useRef<HTMLElement>(null);
  const linkedArticles = articles.filter((article) => selected.articles.includes(article.slug));
  const matches = (text: string) => text.toLocaleLowerCase().includes(query.toLocaleLowerCase());

  return <section className="exhibit-scene exhibit-scene--aws" aria-labelledby="exhibit-scene-title">
    <div className="exhibit-environment" aria-hidden="true" />
    <div className="exhibit-stage">
      <WorldToolbar title={world.title} article />
      <div className="cabinet-heading"><h1 id="exhibit-scene-title">AWS機構図鑑</h1><p>{world.subtitle}</p></div>
      <label className="cabinet-search">サービス索引<input type="search" placeholder="SQS、Lambda、IAM…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <div className="cabinet-columns">
        {world.groups.map((group) => <section className="cabinet-column" key={group.name} aria-label={group.name}>
          <h2>{group.name}</h2>
          <div className="cabinet-compartments">
            {group.objects.map((item) => <button key={item.id} className="cabinet-object" hidden={!matches(`${item.label} ${item.detail}`)} aria-pressed={selectedId === item.id} aria-controls={detailId} onClick={() => { setSelectedId(item.id); if (innerWidth <= 900) detail.current?.scrollIntoView({block:"nearest",behavior:"instant"}); }}>
              <CabinetMechanism id={item.id} /><strong>{item.label}</strong><span className="sr-only">{item.articles.length ? "記事を選ぶ" : "準備中"}</span>
            </button>)}
          </div>
        </section>)}
      </div>
      {query && !objects.some((item) => matches(`${item.label} ${item.detail}`)) ? <p role="status" className="cabinet-empty">一致する機構はありません。</p> : null}
      <aside ref={detail} id={detailId} className="cabinet-note" aria-live="polite" aria-atomic="true">
        <span>{selected.related ? "関連する既存記事" : linkedArticles.length ? "公開記事" : "準備中"}</span><h2>{selected.label}</h2><p>{selected.detail}</p><CabinetMechanism id={selected.id} />
        {linkedArticles.length ? linkedArticles.map((article) => <Link href={article.url} key={article.slug}>{article.title} <b aria-hidden="true">→</b></Link>) : <p className="cabinet-preparing">解説本文はまだ公開していません。<Link href="/articles">公開済みの記事を探す →</Link></p>}
      </aside>
      <footer className="cabinet-instruction">{world.instruction}<small>学習用の比喩表現です。実際の構成図ではありません。</small></footer>
    </div>
  </section>;
}

function FilmStripArt({ index }: { index: number }) {
  const patternId = useId();
  const clipId = useId();
  const paths = ["M0 30 C150 35 450 15 600 20 L600 120 C450 115 150 140 0 120Z", "M0 90 C140 -5 380 -5 600 90 L600 150 C380 70 140 70 0 150Z", "M0 0 C160 110 380 110 600 0 L600 75 C380 170 160 170 0 75Z", "M0 50 C160 10 350 20 600 40 L600 130 C350 110 160 100 0 120Z"];
  return <svg viewBox="-10 -15 620 200" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id={patternId} patternUnits="userSpaceOnUse" width="125" height="180"><image href={withBasePath("/images/worlds/git-film-frames-v2.webp")} width="250" height="180" x={index > 1 ? -125 : 0}/></pattern><clipPath id={clipId}><path d={paths[index]}/></clipPath></defs><path d={paths[index]} fill={`url(#${patternId})`} stroke={index === 1 ? "#253e65" : "#342214"} strokeWidth="22"/><path d={paths[index]} fill="none" stroke="#e7cea5" strokeDasharray="6 8" strokeWidth="5"/><g clipPath={`url(#${clipId})`} stroke="#1c1511" strokeWidth="5">{[125,250,375,500].map((x) => <path key={x} d={`M${x} -15V200`}/>)}</g></svg>;
}

export function GitEditingRoom({ world, articles }: { world: ReadingWorld; articles: WorldArticle[] }) {
  const objects = world.groups.flatMap((group) => group.objects);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const selected = objects[selectedIndex];
  const detailId = useId();
  const linkedArticles = articles.filter((article) => selected.articles.includes(article.slug));
  function step(direction: number) { setSelectedIndex((value) => (value + direction + objects.length) % objects.length); }
  return <section className="exhibit-scene exhibit-scene--git" aria-labelledby="exhibit-scene-title">
    <div className="exhibit-environment" aria-hidden="true" />
    <div className="exhibit-stage">
      <WorldToolbar title={world.title} />
      <div className="film-projection" aria-hidden="true"><div className="film-comparison" /><strong>変更を見比べる</strong></div>
      <div className="editing-films" role="group" aria-label="編集台のフィルム">
        {objects.map((item, index) => <button key={item.id} className={`editing-film editing-film--${item.id}`} aria-pressed={index === selectedIndex} aria-controls={detailId} onClick={() => setSelectedIndex(index)}>
          <FilmStripArt index={index} /><strong>{item.label}</strong><span className="sr-only">記事を選ぶ</span>
        </button>)}
      </div>
      <aside id={detailId} className="editing-note" aria-live="polite" aria-atomic="true"><span>{selected.related ? "関連する既存記事" : "公開記事"}</span><h2>{selected.label}を読む</h2><p>{selected.detail}</p>{linkedArticles.map((article) => <Link href={article.url} key={article.slug}>{article.title} <b aria-hidden="true">↗</b></Link>)}</aside>
      <div className="editing-controls"><p>{world.instruction}</p><button aria-label="前のフィルム" onClick={() => step(-1)}><ChevronLeft /></button><span aria-live="polite">{String(selectedIndex + 1).padStart(2,"0")} / 04</span><button aria-label="次のフィルム" onClick={() => step(1)}><ChevronRight /></button></div>
      <p className="scene-metaphor">学習のための比喩表現です。実際の構成図ではありません。</p>
    </div>
  </section>;
}
