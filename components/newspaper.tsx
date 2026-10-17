"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type PointerEvent, type MouseEvent } from "react";
import { ArticleThumbnail } from "./article-thumbnail";
import type { CatalogItem } from "./catalog-item";
import "./newspaper-fold.css";

type NewspaperItem = CatalogItem & { minutes: number };

function PaperStories({ stories, continuation }: { stories: NewspaperItem[]; continuation?: NewspaperItem }) {
  const entries = continuation ? [...stories, continuation] : stories;
  return <div className="newspaper-grid">{entries.map((item, index) => <article key={`${index}-${item.url}`} className={`newspaper-story story-${index}`}>
    {index === 0 ? <h2><Link href={item.url}>{item.title}</Link></h2> : null}
    {item.thumbnail ? <Link href={item.url} tabIndex={-1} aria-hidden="true"><ArticleThumbnail article={item} framed={false} priority={index === 0} /></Link> : null}
    {index !== 0 ? <h2><Link href={item.url}>{item.title}</Link></h2> : null}
    <p className="newspaper-meta">{item.category}<span>|</span>{item.minutes}分{index === 4 ? " · 次の紙面から" : ""}</p>
    <p className="newspaper-description">{item.description}</p><Link className="newspaper-read" href={item.url}>記事を読む ↗</Link>
  </article>)}</div>;
}

export function Newspaper({ items, initialPage = 1 }: { items: NewspaperItem[]; initialPage?: number }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(initialPage);
  const [fold, setFold] = useState(0);
  const dragStart = useRef<{x:number;y:number;width:number;moved:boolean} | null>(null);
  const ignoreClick = useRef(false);
  const categories = [...new Set(items.map((item) => item.category))];
  const terms = query.normalize("NFKC").toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = items.filter((item) => (!category || item.category === category) && terms.every((term) => [item.title, item.description, ...item.tags].join(" ").normalize("NFKC").toLocaleLowerCase().includes(term)));
  const pages = Math.max(1, Math.ceil(results.length / 4));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * 4, current * 4);
  const nextStories = results.slice(current * 4, (current + 1) * 4);
  function changePage(next: number) {
    setPage(Math.max(1, Math.min(next, pages)));
    setFold(0);
  }
  function beginFold(event: PointerEvent<HTMLButtonElement>) {
    ignoreClick.current = false;
    dragStart.current = {x:event.clientX,y:event.clientY,width:event.currentTarget.parentElement?.clientWidth ?? 900,moved:false};
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveFold(event: PointerEvent<HTMLButtonElement>) {
    const gesture = dragStart.current;
    if (!gesture) return;
    if (Math.hypot(gesture.x - event.clientX,gesture.y - event.clientY) > 3) gesture.moved = true;
    setFold(Math.max(0,Math.min(.86,(gesture.x - event.clientX) / (gesture.width * .7))));
  }
  function finishFold(event: PointerEvent<HTMLButtonElement>) {
    const gesture = dragStart.current;
    const distance = gesture ? gesture.x - event.clientX : 0;
    dragStart.current = null;
    ignoreClick.current = gesture?.moved ?? false;
    if (distance > 35) {
      ignoreClick.current = true;
      changePage(current + 1);
      event.preventDefault();
      return;
    }
    setFold(0);
    if (gesture?.moved) event.preventDefault();
  }
  function cancelFold() {
    dragStart.current = null;
    ignoreClick.current = false;
    setFold(0);
  }
  function clickCorner(event: MouseEvent<HTMLButtonElement>) {
    // Pointer release may emit a click after either completing or cancelling a drag.
    // Keyboard activation has detail=0 and remains available after either gesture.
    if (ignoreClick.current && event.detail !== 0) {
      ignoreClick.current = false;
      return;
    }
    ignoreClick.current = false;
    changePage(current + 1);
  }
  return <section className="newspaper-wrap" aria-labelledby="newspaper-heading">
    <div className="newspaper" tabIndex={0} aria-label="新聞形式の記事一覧。左右キーでページをめくれます" onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (["ArrowRight", "PageDown", "ArrowLeft", "PageUp", "Home", "End"].includes(event.key)) event.preventDefault();
      if (["ArrowRight", "PageDown"].includes(event.key)) changePage(current + 1);
      if (["ArrowLeft", "PageUp"].includes(event.key)) changePage(current - 1);
      if (event.key === "Home") changePage(1);
      if (event.key === "End") changePage(pages);
    }}>
      <header className="newspaper-masthead"><div><p>THE ORIFOLIO JOURNAL</p><h1 id="newspaper-heading">記事一覧</h1></div><label>記事を検索<input type="search" placeholder="キーワードを探す" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); setFold(0); }} /></label></header>
      <div className="newspaper-edition"><p>単独で読める記事を、ひとつの紙面に。</p><span>{items[0]?.date.replaceAll("-", ".")}　 |　 {results.length} ARTICLES</span></div>
      <nav className="newspaper-categories" aria-label="記事の分野">{["", ...categories].map((name) => <button key={name} aria-pressed={category === name} onClick={() => { setCategory(name); setPage(1); setFold(0); }}>{name || "すべて"}</button>)}</nav>
      <div className={`newspaper-sheet${fold > 0 ? " is-folding" : ""}`} style={{ "--fold-progress": fold, "--fold-size": `${Math.max(65,fold * 980)}px` } as CSSProperties}>
        {fold > 0 && current < pages ? <div className="newspaper-under-sheet" aria-hidden="true" inert><PaperStories stories={nextStories} continuation={results[(current + 1) * 4]} /></div> : null}
        <div className="newspaper-current-sheet"><PaperStories stories={visible} continuation={results[current * 4]} />
          {visible.length === 0 ? <p className="newspaper-empty" role="status">一致する記事はありません。検索語や分野を変えてください。<button onClick={() => { setQuery(""); setCategory(""); setPage(1); }}>絞り込みをリセット</button></p> : null}
        </div>
        {current < pages ? <button className="newspaper-corner" aria-label="角をドラッグ、またはクリックして次のページ" onClick={clickCorner} onPointerDown={beginFold} onPointerMove={moveFold} onPointerUp={finishFold} onPointerCancel={cancelFold}><span>めくる ↗</span></button> : null}
        <div className="paper-curl" aria-hidden="true"><svg viewBox="0 0 1000 780" preserveAspectRatio="none"><defs><linearGradient id="paper-back" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c6beae"/><stop offset=".3" stopColor="#fffdf8"/><stop offset=".68" stopColor="#f5f0e4"/><stop offset="1" stopColor="#a79b83"/></linearGradient></defs><path d="M1000 0 Q790 255 445 460 Q230 600 0 780 Q245 790 310 630 Q355 355 1000 0Z" fill="url(#paper-back)"/><path d="M1000 0 Q790 255 445 460 Q230 600 0 780" fill="none" stroke="#fffdf8" strokeWidth="3"/></svg><span>角をドラッグしてめくる</span></div>
      </div>
      <nav className="newspaper-pagination" aria-label="新聞のページ送り"><button onClick={() => changePage(current - 1)} disabled={current === 1}>← 前のページ</button><span aria-live="polite">{String(current).padStart(2, "0")} / {String(pages).padStart(2, "0")}</span><button onClick={() => changePage(current + 1)} disabled={current === pages}>次のページ →</button></nav>
      <p className="newspaper-help">記事を選んで読む · 角をドラッグしてめくる · 紙面にフォーカスして左右キー</p>
      <nav className="newspaper-crosslinks" aria-label="読む入口"><Link href="/series">シリーズの記事は、シリーズ内で読む →</Link><Link href="/search">シリーズ記事も含めて検索 →</Link></nav>
    </div>
  </section>;
}
