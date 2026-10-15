"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { ArticleThumbnail } from "./article-thumbnail";
import type { CatalogItem } from "./catalog-item";

type NewspaperItem = CatalogItem & { minutes: number };
export function Newspaper({ items, initialPage = 1 }: { items: NewspaperItem[]; initialPage?: number }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(initialPage);
  const [fold, setFold] = useState(0);
  const [turn, setTurn] = useState(0);
  const dragStart = useRef<number | null>(null);
  const ignoreClick = useRef(false);
  const categories = [...new Set(items.map((item) => item.category))];
  const terms = query.normalize("NFKC").toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = items.filter((item) => (!category || item.category === category) && terms.every((term) => [item.title, item.description, ...item.tags].join(" ").normalize("NFKC").toLocaleLowerCase().includes(term)));
  const pages = Math.max(1, Math.ceil(results.length / 4));
  const current = Math.min(page, pages);
  const visible = results.slice((current - 1) * 4, current * 4);
  function changePage(next: number) {
    const value = Math.max(1, Math.min(next, pages));
    if (value !== current) { setPage(value); setTurn((value) => value + 1); }
    setFold(0);
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
      <header className="newspaper-masthead"><div><p>THE ORIFOLIO JOURNAL</p><h1 id="newspaper-heading">記事一覧</h1></div><label>記事を検索<input type="search" placeholder="キーワードを探す" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label></header>
      <div className="newspaper-edition"><p>日々の発見を、ひとつの紙面に。</p><span>{items[0]?.date.replaceAll("-", ".")}　 |　 {results.length} ARTICLES</span></div>
      <nav className="newspaper-categories" aria-label="記事の分野">{["", ...categories].map((name) => <button key={name} aria-pressed={category === name} onClick={() => { setCategory(name); setPage(1); }}>{name || "すべて"}</button>)}</nav>
      <div className="newspaper-sheet" style={{ "--fold": `${fold}px` } as CSSProperties}>
        <div className="newspaper-grid" key={`${current}-${turn}`}>
          {visible.map((item, index) => <article key={item.url} className={`newspaper-story story-${index}`}>
            {index === 0 ? <h2><Link href={item.url}>{item.title}</Link></h2> : null}
            {item.thumbnail ? <Link href={item.url} tabIndex={-1} aria-hidden="true"><ArticleThumbnail article={item} framed={false} priority={index === 0} /></Link> : null}
            {index !== 0 ? <h2><Link href={item.url}>{item.title}</Link></h2> : null}
            <p className="newspaper-meta">{item.category}<span>|</span>{item.minutes}分</p>
            <p className="newspaper-description">{item.description}</p><Link className="newspaper-read" href={item.url}>記事を読む ↗</Link>
          </article>)}
        </div>
        {visible.length === 0 ? <p className="newspaper-empty" role="status">一致する記事はありません。検索語や分野を変えてください。<button onClick={() => { setQuery(""); setCategory(""); setPage(1); }}>絞り込みをリセット</button></p> : null}
        {current < pages ? <button className="newspaper-corner" aria-label="角をドラッグ、またはクリックして次のページ" onClick={() => { if (ignoreClick.current) { ignoreClick.current = false; return; } changePage(current + 1); }} onPointerDown={(event) => { ignoreClick.current = false; dragStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (dragStart.current !== null) setFold(Math.max(0, Math.min(370, dragStart.current - event.clientX))); }} onPointerUp={(event) => { const distance = dragStart.current === null ? 0 : dragStart.current - event.clientX; dragStart.current = null; if (distance > 35) { ignoreClick.current = true; changePage(current + 1); event.preventDefault(); } else setFold(0); }} onPointerCancel={() => { dragStart.current = null; setFold(0); }}><span>めくる ↗</span></button> : null}
        <div className="paper-curl" aria-hidden="true" />
      </div>
      <nav className="newspaper-pagination" aria-label="新聞のページ送り"><button onClick={() => changePage(current - 1)} disabled={current === 1}>← 前のページ</button><span aria-live="polite">{String(current).padStart(2, "0")} / {String(pages).padStart(2, "0")}</span><button onClick={() => changePage(current + 1)} disabled={current === pages}>次のページ →</button></nav>
      <p className="newspaper-help">記事を選んで読む · 角をドラッグしてめくる · 紙面にフォーカスして左右キー</p>
      <nav className="newspaper-crosslinks" aria-label="読む入口"><Link href="/series">シリーズ・展示室から探す →</Link><Link href="/search">すべての読み物を検索 →</Link></nav>
    </div>
  </section>;
}
