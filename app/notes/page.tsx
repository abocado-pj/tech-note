import type { Metadata } from "next";
import { ContentCatalog } from "@/components/content-catalog";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "ノート",
  description: "ひとつの気づきや検討を残した短い読み物。",
};
export default function NotesPage() {
  return (
    <ContentCatalog
      kind="notes"
      items={getAllNotes().map((note) => ({
        title: note.title,
        description: note.description,
        url: note.url,
        thumbnail: note.thumbnail,
        category: note.area,
        date: note.updated ?? note.date,
        tags: note.tags,
      }))}
    />
  );
}
