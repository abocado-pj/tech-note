import type { CSSProperties } from "react";
import { Database, Code2, Workflow, type LucideIcon } from "lucide-react";
import type { Book } from "@/lib/books";
import { withBasePath } from "@/lib/site";
import { LAMBDA_SERIES_SLUG } from "@/lib/lambda-inspection";
import { LambdaJacketEmblem } from "./lambda-boundary-glyph";

type PhysicalBookProps = {
  title: string;
  subtitle?: string;
  category: string;
  artwork: string;
  wrap?: boolean;
  tone?: "auth" | "database" | "neutral";
};

/** The wrap's x=120 fold joins the spine and front at one shared scale. */
export function PhysicalBook({
  title,
  subtitle,
  category,
  artwork,
  wrap = true,
  tone = "neutral",
}: PhysicalBookProps) {
  const style = {
    "--book-art": `url("${withBasePath(artwork)}")`,
  } as CSSProperties;
  return (
    <div
      className={`physical-book-stage physical-book-stage--${tone}`}
      aria-hidden="true"
    >
      <div
        className={`physical-book${wrap ? " physical-book--wrap" : ""}`}
        style={style}
      >
        <div className="physical-book__back" />
        <div className="physical-book__pages" />
        <div className="physical-book__spine">
          <span>{title}</span>
          <small>orifolio</small>
        </div>
        <div className="physical-book__front">
          <div className="physical-book__title">
            <small>{category}</small>
            <strong>{title}</strong>
            {subtitle ? <span>{subtitle}</span> : null}
          </div>
          <span className="physical-book__imprint">orifolio</span>
        </div>
      </div>
    </div>
  );
}

type JacketBook = Pick<Book, "title" | "subtitle" | "slug">;

const jackets: Record<string, { tone: string; Icon: LucideIcon }> = {
  "database-internal": { tone: "database", Icon: Database },
  "lambda-api-boundaries": { tone: "lambda", Icon: Code2 },
  "rails-raw-sql": { tone: "rails", Icon: Workflow },
};

export function BookJacket({ book }: { book: JacketBook }) {
  if (book.slug === LAMBDA_SERIES_SLUG) {
    return (
      <span className="book-jacket book-jacket--lambda book-jacket--inspection">
        <span className="night-book__spine" aria-hidden="true">
          <span>{book.title}</span>
          <small>ORIFOLIO · AWS</small>
        </span>
        <span className="night-book__cover">
          <small>ORIFOLIO / INSPECTION FILES</small>
          <strong>{book.title}</strong>
          <span className="lambda-jacket-subtitle">{book.subtitle}</span>
          <LambdaJacketEmblem />
          <span className="lambda-jacket-plate">入口・実行・権限・認可</span>
          <span className="night-book__imprint">orifolio</span>
        </span>
      </span>
    );
  }
  const { tone, Icon } = jackets[book.slug] ?? {
    tone: "database",
    Icon: Database,
  };
  return (
    <span className={`book-jacket book-jacket--${tone}`}>
      <span className="night-book__spine" aria-hidden="true">
        {book.title}
      </span>
      <span className="night-book__cover">
        <small>ORIFOLIO / TECHNOLOGY</small>
        <strong>{book.title}</strong>
        <span>{book.subtitle}</span>
        <Icon
          strokeWidth={0.7}
          aria-hidden="true"
          className="night-book__icon"
        />
        <span className="night-book__imprint">orifolio</span>
      </span>
    </span>
  );
}

export function BookCover({ book }: { book: JacketBook }) {
  return (
    <div className="book-cover-stage" aria-hidden="true">
      <div className="night-book book-cover-volume">
        <BookJacket book={book} />
      </div>
    </div>
  );
}
