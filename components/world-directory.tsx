import Link from "next/link";
import { READING_WORLDS } from "@/lib/worlds";
import { SceneObjectArt } from "./exhibit-scene";
import { CabinetMechanism } from "./cabinet-and-film";
import { withBasePath } from "@/lib/site";

export function WorldDirectory() {
  return <section className="world-directory" aria-labelledby="world-directory-title">
    <div className="world-directory-heading"><p>READ BY EXPLORING</p><h2 id="world-directory-title">しくみの展示室</h2><p>道具、機構、フィルム。気になるものから、記事へ。</p></div>
    <div className="world-directory-grid">{READING_WORLDS.map((world) => <Link key={world.id} href={world.id === "formats" ? "/series/world-file-extensions" : `/worlds/${world.id}`} className={`world-directory-card directory--${world.id}`}>
      <div className="directory-scene-art" aria-hidden="true">
        {world.id === "aws" ? <CabinetMechanism id="sqs" /> : world.id === "oss" || world.id === "network" || world.id === "database" ? <SceneObjectArt scene={world.id} index={world.id === "oss" ? 1 : 0} /> : world.id === "git" ? <div className="reader-film-art" /> : <svg viewBox="0 0 1430 1100"><image href={withBasePath("/images/worlds/desk-svg-v2.webp")} width="1430" height="1100" /></svg>}
      </div>
      <span><strong>{world.title}</strong><small>{world.subtitle}</small><b>展示を開く →</b></span>
    </Link>)}</div>
  </section>;
}
