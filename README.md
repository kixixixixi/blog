# kixixixixi log

https://blog.kixixixixi.com の個人ブログ。Next.js Static Export + MDX。DB・API なし。

## コマンド

```bash
pnpm dev        # 開発サーバー
pnpm build      # validate → 静的書き出し (out/)
pnpm start      # out/ をローカル配信
pnpm validate   # posts.json / MDX / 内部リンク・画像の検証
pnpm lint
pnpm typecheck
pnpm test
```

## 記事を追加する

1. `content/posts/xxx.mdx` を作成（本文のみ。タイトルは posts.json から出るので `#` 見出しは使わず `##` から）
2. `content/posts.json` に追記

   ```json
   {
     "id": 6,
     "slug": "xxx",
     "title": "タイトル",
     "description": "概要",
     "date": "2026-10-01",
     "tags": ["読書"],
     "path": "posts/xxx.mdx",
     "published": true
   }
   ```

   必須: `id` `slug` `title` `date` `path` `published` / 任意: `description` `updated` `tags` `category` `image`

   `pnpm dev` 中は下書き（`published: false`）も表示され、MDX / posts.json の保存が約1秒でブラウザに反映される。記事ページ右側のエディタでも本文を編集できる（入力 0.3 秒後に自動保存してプレビューへ即反映。MDX エラー時は保存されず、直前の正常なプレビューのままエラー表示）。ヘッダーの「新規作成」（`/new/`）で slug・タイトルを入れると mdx と posts.json エントリ（下書き）を作成してエディタへ移動。

3. `pnpm build` → `main` に push すると GitHub Actions が GitHub Pages へデプロイ

## MDX で使えるもの

- GFM（表・打ち消し等）、コード（Shiki、ビルド時ハイライト）、数式 `$…$` / `$$…$$`（KaTeX）
- コンポーネント（`components/mdx/`）:
  - `<YouTube id="…" />`
  - `<Embed url="…" title="…" description="…" />`
  - `<GitHubRepo repository="owner/name" />`
  - `<Tweet url="https://x.com/…">本文</Tweet>`
  - `<Figure src="/images/…" alt="…" caption="…" />`
  - `<Note type="note|warning">…</Note>`

安全のため、上記以外の JSX / HTML タグ（`<iframe>` `<script>` 等）、`import`/`export`、`{式}`、式属性はビルドエラーになる。文字としての `{` は `\{` と書く。画像の alt は必須。

コンポーネントを追加するときは `lib/mdx.ts` の `mdxComponentNames` と `components/mdx/index.tsx` の両方に登録する（型で同期を強制）。

## デプロイ

`out/` は任意の静的ホスティングに置ける。GitHub Pages の場合は Settings → Pages で Custom domain に `blog.kixixixixi.com` を設定する。
