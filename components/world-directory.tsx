import Link from "next/link";
import { READING_WORLDS } from "@/lib/worlds";
import { WorldSpecimen } from "./world-specimen";

export function WorldDirectory() {
  return <section className="world-directory" aria-labelledby="world-directory-title">
    <div className="world-directory-heading"><p>READ BY EXPLORING</p><h2 id="world-directory-title">しくみの展示室</h2><p>道具、機構、フィルム。気になるものから、記事へ。</p></div>
    <div className="world-directory-grid">{READING_WORLDS.map((world) => <Link key={world.id} href={world.id === "formats" ? "/series/world-file-extensions" : `/worlds/${world.id}`} className={`world-directory-card directory--${world.id}`}>
      <WorldSpecimen specimen={world.groups[0].objects[world.id === "oss" ? 1 : 0].specimen!} />
      <span><strong>{world.title}</strong><small>{world.subtitle}</small><b>展示を開く →</b></span>
    </Link>)}</div>
  </section>;
}
