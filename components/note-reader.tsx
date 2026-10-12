import Link from "next/link";
import { MdxContent } from "@/components/mdx-content";
import { formatDate } from "@/lib/format";
import type { Note } from "@/lib/notes";
import styles from "./note-reader.module.css";

type NoteReaderProps = {
  note: Pick<
    Note,
    | "title"
    | "description"
    | "area"
    | "date"
    | "updated"
    | "readingTimeMinutes"
    | "content"
  >;
};

export function NoteReader({ note }: NoteReaderProps) {
  return (
    <div className={styles.reader}>
      <nav className={styles.breadcrumb} aria-label="パンくず">
        <Link href="/notes">ノート</Link>
        <span aria-hidden>/</span>
        <span>{note.area}</span>
      </nav>
      <div className={styles.layout}>
        <div className={styles.paper}>
          <header className={styles.heading}>
            <p className={styles.paperLabel} aria-hidden>
              ノート
            </p>
            <h1>{note.title}</h1>
            <p className={styles.description}>{note.description}</p>
            <div className={styles.meta}>
              <time dateTime={note.updated ?? note.date}>
                {note.updated ? "更新 " : ""}
                {formatDate(note.updated ?? note.date)}
              </time>
            </div>
          </header>
          <div className={`prose ${styles.body}`}>
            <MdxContent source={note.content} variant="notebook" />
          </div>
        </div>
      </div>
    </div>
  );
}
