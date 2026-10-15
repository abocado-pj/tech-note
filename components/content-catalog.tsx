"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { CatalogCard, type CatalogItem } from "./catalog-item";

type CatalogKind = "articles" | "notes" | "series";
const copy = {
  articles: {
    title: "記事",
    description: "ひとつの問いを、深く読む。",
    placeholder: "記事のキーワードを検索",
  },
  series: {
    title: "シリーズ",
    description: "ひとつのテーマを、いろいろな角度から。",
    placeholder: "シリーズのテーマを検索",
  },
  notes: {
    title: "ノート",
    description: "小さな気づきを、残しておく。",
    placeholder: "ノートのキーワードを検索",
  },
};
const normalize = (text: string) => text.normalize("NFKC").toLocaleLowerCase();

export function ContentCatalog({
  items,
  kind,
  initialPage = 1,
  sidebar,
}: {
  items: CatalogItem[];
  kind: CatalogKind;
  initialPage?: number;
  sidebar?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(initialPage);
  const inputId = useId();
  const categories = [...new Set(items.map((item) => item.category))];
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const results = items.filter(
    (item) =>
      (!category || item.category === category) &&
      terms.every((term) =>
        normalize(
          [item.title, item.description, ...item.tags].join(" "),
        ).includes(term),
      ),
  );
  if (sort === "oldest") results.sort((a, b) => a.date.localeCompare(b.date));
  if (sort === "title")
    results.sort((a, b) => a.title.localeCompare(b.title, "ja"));
  const perPage = kind === "articles" ? 4 : 12;
  const pages = Math.max(1, Math.ceil(results.length / perPage));
  const currentPage = Math.min(page, pages);
  const visible = results.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );
  const content = copy[kind];
  function filterCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  return (
    <div className={`page-shell catalog-page catalog-page--${kind}`}>
      <header className="night-hero collection-night-hero">
        <div>
          <nav className="night-breadcrumb" aria-label="パンくず">
            <Link href="/">ホーム</Link>
            <span>/</span>
            <span>{content.title}</span>
          </nav>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          {kind === "notes" ? (
            <p className="hero-support">
              実装の途中で考えたこと、確かめたこと。
            </p>
          ) : kind === "series" ? (
            <p className="hero-support">
              共通の問いでつながる記事を、まとめて探す。
            </p>
          ) : null}
        </div>
        <div className="night-search">
          <Search aria-hidden size={24} />
          <label htmlFor={inputId} className="sr-only">
            {content.placeholder}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            placeholder={content.placeholder}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
          {query ? (
            <button
              aria-label="検索をクリア"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
            >
              <X aria-hidden size={18} />
            </button>
          ) : null}
        </div>
      </header>
      <div
        className={
          kind === "series"
            ? "catalog-layout catalog-layout--wide"
            : "catalog-layout"
        }
      >
        <div className="catalog-main">
          <div className="catalog-controls">
            <div
              className="filter-chips"
              role="group"
              aria-label="分野で絞り込む"
            >
              {["", ...categories].map((name) => (
                <button
                  key={name}
                  aria-pressed={category === name}
                  onClick={() => filterCategory(name)}
                >
                  {name || "すべて"}
                </button>
              ))}
            </div>
            <label className="catalog-sort">
              <span className="sr-only">並び順</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >
                <option value="newest">新しい順</option>
                <option value="oldest">古い順</option>
                <option value="title">タイトル順</option>
              </select>
            </label>
          </div>
          {kind === "series" ? (
            <h2 className="catalog-section-title">テーマを選ぶ</h2>
          ) : null}
          {query || category ? (
            <p className="result-count" role="status">
              {results.length}件
            </p>
          ) : null}
          <div className={`catalog-items catalog-items--${kind}`}>
            {visible.map((item) => (
              <CatalogCard key={item.url} item={item} kind={kind} />
            ))}
          </div>
          {visible.length === 0 ? (
            <div className="empty-state">
              <p>一致する{content.title}はありません。</p>
              <button
                onClick={() => {
                  setQuery("");
                  filterCategory("");
                }}
              >
                検索と絞り込みをリセット
              </button>
            </div>
          ) : null}
          {pages > 1 ? (
            <nav className="catalog-pagination" aria-label="ページ送り">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                ← 前へ
              </button>
              <span aria-live="polite">
                {currentPage} / {pages}
              </span>
              <button
                disabled={currentPage === pages}
                onClick={() => setPage(currentPage + 1)}
              >
                次へ →
              </button>
            </nav>
          ) : null}
        </div>
        {kind !== "series" ? (
          <aside className="catalog-sidebar">
            <h2>{kind === "notes" ? "分野から探す" : "テーマから探す"}</h2>
            <nav aria-label="分野一覧">
              {categories.map((name) => (
                <button
                  key={name}
                  aria-pressed={category === name}
                  onClick={() => filterCategory(name)}
                >
                  {name}
                  <span aria-hidden>›</span>
                </button>
              ))}
            </nav>
            {sidebar ?? (
              <>
                <h2>ノートの読み方</h2>
                <p>ひとつの気づきや、検討中の判断を短くまとめています。</p>
                <Link className="sidebar-next" href="/articles">
                  詳しく読むなら
                  <br />
                  <strong>記事一覧 →</strong>
                </Link>
                <Link className="sidebar-next" href="/series">
                  テーマをたどる
                  <br />
                  <strong>シリーズ一覧 →</strong>
                </Link>
              </>
            )}
          </aside>
        ) : null}
      </div>
      {kind === "series" ? (
        <nav className="catalog-crosslinks" aria-label="ほかの読み物">
          <Link href="/articles">一記事から探したいときは　記事一覧へ →</Link>
          <Link href="/notes">短い気づきを読む　ノート一覧へ →</Link>
        </nav>
      ) : null}
    </div>
  );
}
