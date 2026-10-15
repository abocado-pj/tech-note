# Orifolio

2.3.0 は承認画像に基づき、新聞・シリーズ世界・記事本文を再構成した版です。[変更・検証・戻し方](docs/releases/v2.3.0.md)を記録しています。既存の本文・URL・ロゴ・本棚を保持します。

旧 Tech Note の本文と公開 URL を引き継ぐ、技術のノート・記事・本・シリーズの本棚です。v2.2.1 は承認案 A「夜の書架」を基準に、紺の外枠・本棚と明るい一覧・本文を組み合わせています。既存の3つの曲線の O と orifolio のロゴを維持しています。

本棚には公開済みの本3冊だけを表示します。シリーズは本の表紙を使わず、テーマごとの画像から記事を選べます。ノートにも個別のサムネイルがあります。[公開記録と戻し方](docs/releases/v2.2.1.md)、[画像の仕様](public/images/orifolio/README.md) を参照してください。

個人の技術知識を蓄積・公開するためのNext.js製ナレッジベースです。

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX
- Static export for GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

`next.config.ts` はGitHub Pages向けに `output: "export"` と `basePath: "/tech-note"` を設定しています。`npm run build` 後、静的ファイルは `out/` に生成されます。

## Articles

記事は `articles/**/*.mdx` に配置します。

```yaml
---
title: 記事タイトル
description: 記事の説明
date: 2026-06-25
updated: 2026-06-25
tags:
  - SQL
category: Rails
level: 1
articleType: practical
series:
  name: Railsで生SQLを書くときに知っておきたいSQL
  order: 1
draft: false
popular: true
---
```

`draft: true` の記事は公開対象から除外されます。

## Books

Booksは記事の集合ではなく、記事で増えた知識を1つの目的に向けて再構成した本文です。調査メモとしての記事は参考リンクに留め、Book本文の中で章立て、説明順、図解、まとめ直しを行います。

Booksは `books/*.mdx` に配置します。

```yaml
---
title: Database Internal
subtitle: SQLが実行される流れから、実行計画を読めるようになる
description: Parser、Optimizer、Execution Plan、Storage Engineの流れを軸に整理するBook。
date: 2026-06-27
category: Database
level: 2
cover: /images/books/database-internal-cover.svg
access: free
status: published
featured: true
aliases:
  - Database Internal
references:
  - articleSlug: sql/internal/explain-analyze
    note: EXPLAINとEXPLAIN ANALYZEの調査メモ。
---
```

- `cover` はBookの表紙画像として、一覧、詳細、OGPで利用します。
- `access` は将来用のメタデータです。現時点では課金処理や公開画面のバッジ表示には使いません。
- `references` はBookの参考記事リンクとして表示します。本文はBook側で再構成します。
- Seriesは共通テーマの独立記事を束ねる分類です。Bookとそれぞれ別の入口を持ち、シリーズの記事は任意の順番で読めます。

### Knowledge Domains

Orifolioは単発ブログではなく、技術書をWeb化した知識サイトとして運用します。カテゴリは次の技術領域を中心に並びます。

- Git
- SQL
- Database
- Linux
- Docker
- AWS
- Rails
- Flutter
- Computer Science

既存運用に必要な補助カテゴリとして、Next.jsも扱います。

### Article Structure

記事は読者の問いに沿って構成します。`editorialProfile: question-led-v1` は、説明・一次資料への出典・具体例・見出しとコードの整合性を検査します。見出し名、最低文字数、図の有無だけで品質を判定しません。未完成の雛形、閉じていないコードブロック、出典のない本文は検査で拒否します。

公開本文・表紙・出典・metadataの整合性は `test/fixtures/content-integrity.json` とテストで確認します。内容を変更するときは一次資料と具体例を再確認してから対応する期待値を更新してください。ハッシュの更新だけで技術検証が完了するわけではありません。

## Reading UI

トップと検索から記事・ブック・ノートへ進めます。ノートは短い一つのページ、記事は構成した詳しい解説、ブックは複数の知見を統合して広いテーマを体系的に扱う長い本文です。それぞれ目的に合わせて書き、必ず順に変換する工程にはしません。既存のテーマを絞ったBook本文とURLも維持します。新しいブックの企画を、完成した公開本文として一覧や検索へ追加しません。

記事の前後移動は同じシリーズまたは同じフォルダの文脈を保ちます。Seriesは共通テーマの独立記事への入口で、Bookの章本文とは異なります。記事の関連ノート、知見を含むBook、所属Seriesをそれぞれ表示します。関連ノートはノートの`related_article_ids`（記事slugの配列）で明示し、宣言がなければ欄を表示しません。Bookとの関係は既存の`references`で明示された参照だけを使用します。

記事とBookでは本文の目次を使えます。記事の目次はPCでは本文の左、モバイルでは導入文の後で折りたたんで表示します。ノートに章目次やページ送り、大きな装飾表紙を付けず、単一本文を読みます。本文中の既存画像・図は保持します。Bookの章移動、読書モード、ダーク表示を利用できます。

ブックの「ページで読む」は、章の先頭と段落・コード・表などのブロック量を目安に紙面を区切ります。長いコードや表を途中で分割せず、紙面内でスクロールできます。前後、章の目次、現在位置、左右キー・Page Up/Down・Home/End、本文の横スワイプを使えます。URLの `reader=pages&page=N` と見出しのhashで、再読込や戻るときの位置を復元します。本文選択、リンク、コード、表や図の横移動中にはスワイプでページをめくりません。動きを減らす設定では切替アニメーションを止めます。通常表示・印刷・JavaScript無効時は全文を読めます。

ノートは可変幅の罫線紙面です。スマホでは固定A4を縮小せず、余白を調整します。標準Markdownの画像・表に加え、必要な箇所で次のMDX部品を使えます。通常記事へ紙面の装飾を一律には付けません。

```mdx
<StickyNote tone="blue" title="判断の軸">確認することを短く書く。</StickyNote>
<RedUnderline>読み違えやすい条件</RedUnderline>
<BlueUnderline>中心となる判断</BlueUnderline>
<Notebook title="確認メモ">小さな検討を残す。</Notebook>
```

シリーズは `lib/series-books.ts` の収録順と、記事側の `series.name`・`slug`・`order` を合わせます。拡張子、Lambda API、Rails SQLの各入口は、収録している記事だけを説明します。

Mermaidは時間順にシーケンス図、分岐にフロー図、関係に依存図を選びます。図には `accTitle`・`accDescr` と本文の説明を添え、読み順や矢印の意味を示します。図の文字を小画面へ無理に縮めず、図の枠内で横へスクロールします。

## Private Drafts

`draft: true` は静的サイトの一覧・検索・本文出力から除外されます。ただし公開Gitリポジトリへcommitした原稿はソースとして閲覧できます。未公開原稿と内部検証記録は、この公開リポジトリの外で保管してください。

ローカル下書きレビューはdevelopment環境で `TECH_NOTE_PREVIEW=1` の場合だけ有効です。このスイッチは認証機能ではありません。本番ビルドでは有効になりません。

## Deployment

既存の `.github/workflows/pages.yml` がmainへのpush時にNode22で依存導入・lint・型検査・テスト・静的ビルドを行い、GitHub Pagesへ公開します。公開先は https://appar377.github.io/tech-note/ です。
