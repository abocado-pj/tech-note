import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { SiteLogo } from "./logo";

export function WorldToolbar({ title, article = false }: { title: string; article?: boolean }) {
  return <header className="exhibit-toolbar">
    <SiteLogo placement="header" />
    <Link className="exhibit-series" href="/series">シリーズ ›</Link>
    {article ? <p className="exhibit-toolbar-title">{title}</p> : <h1 id="exhibit-scene-title">{title}</h1>}
    <nav aria-label="展示のナビゲーション"><Link href="/search"><Search size={19} aria-hidden="true" />検索</Link><Link href="/articles"><Menu size={19} aria-hidden="true" />記事一覧</Link></nav>
  </header>;
}
