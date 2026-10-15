# OrifolioのVercel移行

- [要点](#要点)
- [現行構成](#現行構成)
- [ビルドとURL](#ビルドとurl)
- [検証手順](#検証手順)
- [公開と切戻し](#公開と切戻し)
- [参考リンク](#参考リンク)

## 要点

- 既存の `appar377/tech-note` をVercelへ接続する。
- `/tech-note/`、記事・本・ノート・シリーズのslug、本文、ロゴと画像を引き継ぐ。
- GitHub Pagesの公開とデータを保持し、Vercel URLで先に比較する。
- コメントDB・認証・コメント投稿APIは今回の移行に含めない。
- 正規URLの変更と本番の切替判断は、検証結果を確認してから行う。

## 現行構成

2026-10-15に公開main `7b81d73865a8b2126dc76bf631869f5982af728e` を調査した。

| 対象 | 確認結果 |
| --- | --- |
| リポジトリ | [appar377/tech-note](https://github.com/appar377/tech-note)（公開） |
| サイト | [GitHub PagesのOrifolio](https://appar377.github.io/tech-note/) |
| スタック | Next.js 16.2.9 / React 19.2.4 / TypeScript / MDX |
| 本文 | `articles/**/*.mdx`、`books/*.mdx`、`notes/**/*.mdx` |
| シリーズ | `lib/series-books.ts` と公開記事の対応から生成 |
| 公開件数 | 記事84、本3、ノート3、シリーズ3 |
| 下書き | 今回取得した公開mainには0件 |
| DB・サーバー認証 | なし |
| 読書状態 | ブラウザ内の保存。サーバーへ移すデータはない |
| 公開処理 | `.github/workflows/pages.yml` がmainを静的ビルドして配信 |

Vercelの接続先は `appar377s-projects`、プロジェクトは `tech-note` である。
既存の `dev-log` は `appar377/dev-log` の別プロジェクトと確認した。
公開repoへの接続に新たなGitHub認可は追加していない。

## ビルドとURL

| 環境 | コマンド・判定 | 出力 |
| --- | --- | --- |
| GitHub Pages | `npm run build`（`VERCEL`未設定） | `out/` への静的export |
| Vercel | `npm ci` → `npm run build`（組込みの `VERCEL=1`） | Next.js通常ビルド |
| ローカルでVercel相当 | `VERCEL=1 npm run build` → `npm start` | Next.jsサーバー |

- 両環境の `basePath` は `/tech-note`、末尾スラッシュは有効のままとする。
- `vercel.json` はNext.js検出、既存のinstall/buildコマンド、`/` → `/tech-note/` の一時転送だけを定義する。
- VercelのOutput Directoryに `out` を上書き設定しない。
- リンク、画像、アンカー、`reader=pages&page=N` を書き換えない。
- `lib/site.ts` のcanonical・OGP・sitemapは、検証期間中は既存のGitHub Pagesを指す。
- 依存の追加、本文の編集、外部DBへのデータ転送は行わない。

通常ビルドへ分岐するのは、将来のコメントAPIで静的exportの制限を受けないためである。
今回のページは引き続き静的生成される。
この変更だけでコメント機能やDBが有効になることはない。

## 検証手順

1. リリース対象のcommit、Vercel team・project・environmentを確認する。
2. `npm run lint`、`npm run typecheck`、`npm test` を実行する。
3. 通常ビルドでGitHub Pages用の `out/` が生成されることを確認する。
4. Vercel相当ビルドとPreviewのReady状態を確認する。
5. 現行サイトのsitemap全件とシリーズ全件を同じパスで取得し、HTTP状態と主要本文を比較する。
6. ホーム、一覧、記事、本のページ送り、ノート、シリーズ、検索、ダーク表示を実ブラウザで確認する。
7. ロゴ・表紙・画像・CSS・JSの読み込みと、小画面の表示を確認する。
8. 秘密情報と下書きの混入を確認する。

秘密情報の確認では、追跡ファイルに `.env` や秘密鍵がないこと、既知のトークン形式が検出されないことを調べる。
記事・ノートの `draft`、本の `status` による除外と、本番でレビュー機能が無効であることも確認する。
`TECH_NOTE_PREVIEW=1` は本番の閲覧認可には使えない。
公開Gitリポジトリには、`draft: true` でも秘密の原稿を置かない。

PreviewにVercel Authenticationがある場合は既存の認可で検証する。
検証のために保護を無効化したり、恒久的な公開権限を追加したりしない。

## 公開と切戻し

| 段階 | 実施すること |
| --- | --- |
| 今回 | GitHub repo接続、Vercel URLへの配置、現行との比較、設計記録 |
| 切替前 | 正規ホスト、canonical、OGP、sitemap、インデックス方針を揃える |
| コメント着手前 | [コメント設計の未決事項](../comments/README.md#未決事項)を決める |

- DNS変更、独自ドメイン移管、旧サイト・旧データ削除は行わない。
- GitHub Pagesのworkflowと静的exportを残すため、既存公開先へ戻れる。
- Vercelの変更はこのブランチに限定する。
  mainへ取り込むとGitHub Pagesのworkflowも従来どおり動く。
- 本番切替後の切戻しでは、Vercelの直前の検証済みdeploymentと正規URL設定を戻す。
  コメント導入後はDBを含む切戻し手順を別に用意する。

## 参考リンク

- 開発手順: [リポジトリREADME](../../README.md)
- 設計案: [コメントDB設計](../comments/README.md)
- 仕様: [Next.jsの静的export](https://nextjs.org/docs/app/guides/static-exports)
- 仕様: [Next.jsのbasePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)
- 仕様: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
