import { PaperScene, type PaperSubject } from "./paper-scene";

export function CollectionHero({ title, description, subject = "layers" }: { title: string; description: string; subject?: PaperSubject }) {
  return <header className="collection-header collection-hero"><div><h1 className="page-heading">{title}</h1><p className="page-subtitle">{description}</p></div><PaperScene subject={subject} /></header>;
}
