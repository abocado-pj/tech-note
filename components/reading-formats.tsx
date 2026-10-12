import Link from "next/link";
import { READING_FORMATS } from "@/lib/reading-formats";
import { PaperScene } from "./paper-scene";

export function ReadingFormats() {
  return (
    <section className="library-section" aria-labelledby="reading-formats-heading">
      <div className="section-heading">
        <h2 id="reading-formats-heading">読みたい深さから探す</h2>
      </div>
      <nav aria-label="読み物の種類" className="reading-formats">
        {READING_FORMATS.map((format) => (
          <Link key={format.id} href={format.href} className="reading-format">
            <PaperScene subject={format.id === "notes" ? "note" : format.id === "articles" ? "html" : "layers"} />
            <span><strong>{format.title}</strong><span>{format.description}</span></span>
          </Link>
        ))}
      </nav>
      <p className="page-subtitle">
        必ずノートから記事、ブックへ作り替える必要はありません。
        シリーズは読む深さとは別に、共通のテーマから記事を探す入口です。
      </p>
    </section>
  );
}
