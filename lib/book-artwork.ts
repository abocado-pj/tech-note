export const BOOK_ARTWORK = {
  "database-internal": {
    image: "/images/books/collector-database-v1.webp",
    tone: "database",
    lines: ["Database", "Internal"],
    label: "QUERY · PLAN · EXECUTION",
  },
  "lambda-api-boundaries": {
    image: "/images/books/collector-lambda-v1.webp",
    tone: "lambda",
    lines: ["Lambda APIの", "入口と権限を", "分ける"],
    label: "INPUT · RUNTIME · PERMISSION",
  },
  "rails-raw-sql": {
    image: "/images/books/collector-rails-v1.webp",
    tone: "rails",
    lines: ["Rails Raw", "SQL"],
    label: "SELECT · APPLY · REPEAT",
  },
} as const;

export function getBookArtwork(slug: string) {
  return BOOK_ARTWORK[slug as keyof typeof BOOK_ARTWORK];
}

export type BookPresentation = { slug: string; title: string; subtitle: string; url: string };

export function bookOpeningDetails(book: BookPresentation): BookPresentation {
  return { slug: book.slug, title: book.title, subtitle: book.subtitle, url: book.url };
}
