export const READING_FORMATS = [
  {
    id: "notes",
    title: "ノート",
    description: "ひとつの気づきや検討を、1ページに短く残す。",
    href: "/notes",
  },
  {
    id: "articles",
    title: "記事",
    description: "単独で読める、具体例のある詳しい解説。",
    href: "/articles",
  },
  {
    id: "books",
    title: "ブック",
    description: "複数の知見を統合し、広いテーマを体系的に深く読む。",
    href: "/books",
  },
] as const;

export const SERIES_DESCRIPTION =
  "共通テーマの記事を、シリーズの中で探して読みます。どの記事からでも始められます。";
