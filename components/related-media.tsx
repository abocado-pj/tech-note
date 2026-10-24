import Image from "next/image";
import { withBasePath } from "@/lib/site";
import { OssBrandMark, YomisakiBrandMark, YomisakiEditorialArtwork } from "./media-brand-assets";
import styles from "./related-media.module.css";

export function RelatedMedia() {
  return (
    <section className={`related-media ${styles.section}`} aria-labelledby="related-media-heading">
      <header className={styles.heading}>
        <h2 id="related-media-heading">この書架の、もう少し先へ</h2>
        <p>ソースコードの奥へ。世界の動きの、その先へ。</p>
      </header>
      <div className={styles.grid}>
        <article className={`${styles.card} ${styles.oss}`} aria-labelledby="oss-media-heading">
          <div className={styles.identity}>
            <p className={styles.status}>独立メディア</p>
            <div className={styles.brand}>
              <OssBrandMark className={styles.ossMark} />
              <div>
                <h3 id="oss-media-heading" className={styles.ossName}>OSS解剖学</h3>
                <p>ソースをたどり、設計の理由を学ぶ。</p>
              </div>
            </div>
          </div>
          <div className={styles.workshop} aria-hidden>
            <Image src={withBasePath("/images/worlds/oss-reader-hero-v2.webp")} width={1536} height={1024} sizes="(max-width: 680px) 100vw, 50vw" alt="" />
            <span className={styles.workshopCaption}>部品を外して、コードの奥へ。</span>
          </div>
          <div className={styles.content}>
            <p className={styles.eyebrow}>観察するところ</p>
            <p className={styles.topics}>公開API <span>／</span> 内部構造 <span>／</span> テスト <span>／</span> 依存関係</p>
            <div className={styles.action}>
              <a href="https://oss-kaibougaku.vercel.app/">OSS解剖学をひらく <span aria-hidden>↗</span></a>
              <p>固定版のソースと図解を、独立した図書館で読めます。</p>
            </div>
          </div>
        </article>
        <article className={`${styles.card} ${styles.yomisaki}`} aria-labelledby="yomisaki-media-heading">
          <div className={styles.identity}>
            <p className={styles.status}>独立メディア</p>
            <div className={styles.brand}>
              <YomisakiBrandMark className={styles.yomisakiMark} />
              <div>
                <h3 id="yomisaki-media-heading" className={styles.yomisakiName}>YOMISAKI</h3>
                <p>世界を読み、次を考える。</p>
              </div>
            </div>
          </div>
          <YomisakiEditorialArtwork className={styles.editorialArtwork} />
          <div className={styles.content}>
            <p className={styles.eyebrow}>世界を読み解く</p>
            <p className={styles.topics}>IT <span>／</span> 金融 <span>／</span> 科学 <span>／</span> 社会</p>
            <div className={styles.action}>
              <a href="https://yomisaki.vercel.app/">YOMISAKIをひらく <span aria-hidden>↗</span></a>
              <p>出典に基づく独自の要約と解説を、日本語で読めます。</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
