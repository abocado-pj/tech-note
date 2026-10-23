import Link from "next/link";
import { BookOpen, CodeXml } from "lucide-react";

export function RelatedMedia() {
  return (
    <section className="related-media" aria-labelledby="related-media-heading">
      <header className="related-media__heading">
        <h2 id="related-media-heading">この書架の、もう少し先へ</h2>
        <p>コードの奥をたどる読み物と、これから育てるメディア。</p>
      </header>
      <div className="related-media__grid">
        <article className="related-media__card related-media__card--oss">
          <p className="related-media__status">Orifolio内で公開中</p>
          <div className="related-media__identity">
            <CodeXml className="related-media__mark" strokeWidth={1.2} aria-hidden />
            <div>
              <h3>OSS解剖学</h3>
              <p>ソースをたどり、設計の理由を学ぶ。</p>
            </div>
          </div>
          <div className="related-media__action">
            <Link href="/worlds/oss">OSS解剖学をひらく <span aria-hidden>→</span></Link>
            <p>公開中の関連記事と、準備中のテーマを案内します。</p>
          </div>
        </article>
        <article className="related-media__card related-media__card--yomisaki">
          <p className="related-media__status">独立メディア・公開プレビュー</p>
          <div className="related-media__identity">
            <BookOpen className="related-media__mark" strokeWidth={1.2} aria-hidden />
            <div>
              <h3>YOMISAKI</h3>
              <p>世界の動きを、日本語で読み解く。</p>
            </div>
          </div>
          <div className="related-media__action">
            <a href="https://yomisaki.vercel.app/">公開プレビューをひらく <span aria-hidden>↗</span></a>
            <p>自作SAMPLEによるデザイン検証版です。実ニュースの配信は準備中です。</p>
          </div>
        </article>
      </div>
    </section>
  );
}
