import { withBasePath } from "@/lib/site";
import type { Specimen, WorldObject } from "@/lib/worlds";

export function WorldObjectArt({ item }: { item: WorldObject }) {
  if (item.specimen?.source === "formats" && (item.id === "json" || item.id === "yaml")) {
    return <span className={`tablet-data tablet-data--${item.id}`} aria-hidden="true"><b>{item.label}</b><code>{item.id === "json" ? '{\n  "message": "hello",\n  "count": 3\n}' : 'theme: light\nlanguage: ja\nfeatures:\n  - search'}</code><small>{item.id === "json" ? "通信データの例" : "設定の例"}</small></span>;
  }
  return item.specimen ? <WorldSpecimen specimen={item.specimen} /> : null;
}

// The approved artwork supplies individual photographic specimens. All controls,
// labels, descriptions and article content remain semantic HTML.
export function WorldSpecimen({ specimen, className = "" }: { specimen: Specimen; className?: string }) {
  const [x, y, width, height] = specimen.crop;
  const canvas = specimen.source === "aws" ? [1586, 992] : [1536, 1024];
  return (
    <svg className={`world-specimen ${className}`} viewBox={`${x} ${y} ${width} ${height}`} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <image href={withBasePath(`/images/worlds/${specimen.source}.png`)} width={canvas[0]} height={canvas[1]} />
    </svg>
  );
}
