"use client";

import type { ReadingWorld } from "@/lib/worlds";
import { FormatsWorkbench } from "./formats-workbench";
import { ExhibitScene } from "./exhibit-scene";
import { AwsCabinet, GitEditingRoom } from "./cabinet-and-film";

export type WorldArticle = { slug: string; title: string; url: string };
export function ReadingWorldView(props: { world: ReadingWorld; articles: WorldArticle[] }) {
  if (props.world.id === "formats") return <FormatsWorkbench {...props} />;
  if (props.world.id === "aws") return <AwsCabinet {...props} />;
  if (props.world.id === "git") return <GitEditingRoom {...props} />;
  return <ExhibitScene {...props} />;
}
