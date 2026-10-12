"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/logo";
import { Menu, Search, X } from "lucide-react";
import { useRef, useState } from "react";

const navItems = [
  { href: "/articles", label: "記事" },
  { href: "/books", label: "ブック" },
  { href: "/series", label: "シリーズ" },
  { href: "/notes", label: "ノート" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  return (
    <header className="reading-header" onKeyDown={event => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }}>
      <div className="reading-header__inner">
        <SiteLogo />
        <nav id="main-navigation" aria-label="メインナビゲーション" data-open={menuOpen}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="reading-header__actions">
          <Link href="/search" aria-label="検索"><Search size={22} aria-hidden /></Link>
          <ThemeToggle />
          <button ref={menuButton} type="button" className="mobile-menu-toggle" aria-controls="main-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"} onClick={() => setMenuOpen(current => !current)}>
            {menuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
