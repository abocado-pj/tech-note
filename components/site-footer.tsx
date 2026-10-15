import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/site";
import { SiteLogo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteFooter() {
  return (
    <footer className="reading-footer">
      <SiteLogo placement="footer" />
      <nav aria-label="補助ナビゲーション">
        <Link href="/articles">記事</Link>
        <Link href="/books">本</Link>
        <Link href="/series">シリーズ</Link>
        <Link href="/notes">ノート</Link>
        <Link href="/drafts">下書き</Link>
        <Link href="/reading">読書メモ</Link>
        <Link href="/profile">プロフィール</Link>
        <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </nav>
      <small>Orifolio · 気づきから、深い理解へ。</small>
      <ThemeToggle />
    </footer>
  );
}
