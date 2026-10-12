import Link from "next/link";
import { READING_FORMATS } from "@/lib/reading-formats";

export function ReadingFormats() {
  return (
    <section className="library-section" aria-labelledby="reading-formats-heading">
      <div className="section-heading">
        <h2 id="reading-formats-heading">読む深さから選ぶ</h2>
      </div>
      <nav aria-label="読み物の種類" className="reading-formats">
        {READING_FORMATS.map((format) => (
          <Link key={format.id} href={format.href} className="reading-format">
            <strong>{format.title}</strong>
            <span>{format.description}</span>
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
