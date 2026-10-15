import Link from "next/link";
import type { ReadingWorld } from "@/lib/worlds";
import { WorldObjectArt } from "./world-specimen";

export function WorldReaderIntro({ world, slug }: { world: ReadingWorld; slug: string }) {
  const objects = world.groups.flatMap((group) => group.objects);
  const selected = objects.find((item) => item.articles.includes(slug)) ?? objects.find((item) => item.specimen);
  return <div className="world-reader-intro"><div><Link href={world.id === "formats" ? "/series/world-file-extensions" : `/worlds/${world.id}`}>← {world.title}に戻る</Link><span>FIELD NOTES / {selected?.label ?? world.title}</span><p>{world.subtitle}</p></div>{selected ? <WorldObjectArt item={selected} /> : null}</div>;
}
