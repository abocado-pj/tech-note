import Link from "next/link";
import { READING_FORMATS } from "@/lib/reading-formats";

export function ReadingFormats() {
  return (
    <section
      className="library-section"
      aria-labelledby="reading-formats-heading"
    >
      <div className="section-heading">
        <h2 id="reading-formats-heading">気づきから、深い理解へ。</h2>
      </div>
      <nav aria-label="読み物の種類" className="reading-formats">
        {READING_FORMATS.map((format, index) => (
          <Link key={format.id} href={format.href} className="reading-format">
            <span className="format-number" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <strong>{format.id === "books" ? "本" : format.title}</strong>
              <span>{format.description}</span>
            </span>
          </Link>
        ))}
      </nav>
      <p className="page-subtitle">
        <Link href="/series">シリーズ</Link>
        は、共通テーマの記事を束ねる入口。関心のある記事から読めます。
      </p>
    </section>
  );
}
