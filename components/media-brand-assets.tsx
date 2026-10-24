import { withBasePath } from "@/lib/site";

const yomisakiArtwork = withBasePath("/images/media/yomisaki-approved-home.jpg");

/** The layered source pages from the approved OSS mark, reconstructed as vectors. */
export function OssBrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 124" aria-hidden focusable="false" data-media-brand="oss">
      <path d="M43 15 106 36v80L43 94Z" fill="#fcfaf5" stroke="#7195b3" strokeWidth="3" strokeLinejoin="round" />
      <path d="m29 23 63 21v78L29 101Z" fill="#fcfaf5" stroke="#345a7a" strokeWidth="3" strokeLinejoin="round" />
      <path d="m57 53 20 7m-20 6 20 7m-20 6 20 7m-20 6 14 5" fill="none" stroke="#7195b3" strokeWidth="3" />
      <path d="M10 31 62 51v70l-52-20Z" fill="#102e50" />
      <path d="m28 63-9 9 9 15m17-18 9 15-9 9m-6-30-6 26" fill="none" stroke="#fffdf7" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="61" cy="9" r="5.5" fill="#dc6c53" />
    </svg>
  );
}

/** Exact approved pixels, crop and paper mask used by the public YOMISAKI masthead. */
export function YomisakiBrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="56 65 94 51" aria-hidden focusable="false" data-media-brand="yomisaki">
      <defs>
        <filter id="related-yomisaki-logo-paper" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -8 -8 -8 0 22" />
        </filter>
      </defs>
      <image href={yomisakiArtwork} width="1536" height="1024" filter="url(#related-yomisaki-logo-paper)" />
    </svg>
  );
}

export function YomisakiEditorialArtwork({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="530 189 327 414" preserveAspectRatio="xMidYMid slice" focusable="false">
        <image href={yomisakiArtwork} width="1536" height="1024" />
      </svg>
      <svg viewBox="58 688 333 127" preserveAspectRatio="xMidYMid slice" focusable="false">
        <image href={yomisakiArtwork} width="1536" height="1024" />
      </svg>
      <svg viewBox="792 688 331 127" preserveAspectRatio="xMidYMid slice" focusable="false">
        <image href={yomisakiArtwork} width="1536" height="1024" />
      </svg>
    </div>
  );
}
