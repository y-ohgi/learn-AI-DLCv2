# learn-AI-DLCv2

AWS の **AI-DLC（AI-Driven Development Life Cycle）v2** を学ぶための教材サイトです。

公開先: https://y-ohgi.github.io/learn-AI-DLCv2/

| パス | 内容 | 作り方 |
| --- | --- | --- |
| [`/`](https://y-ohgi.github.io/learn-AI-DLCv2/) | ランディングページ。2つの教材の概要と入口 | `site/index.html` |
| [`/claude/`](https://y-ohgi.github.io/learn-AI-DLCv2/claude/) | **claude 版**。Claude Code に直接依頼して一気に書いた初版（30ページ） | `claude/` を HonKit でビルド |
| [`/first/`](https://y-ohgi.github.io/learn-AI-DLCv2/first/) | **first 版**。AI-DLC v2 のワークフローそのものを回して作った版。生成過程の成果物・監査ログも同梱 | `first/` を HonKit でビルド。`first/aidlc/` に AI-DLC の記録 |

## ローカルでビルドする

```bash
npm ci
npm run build          # _site/ に全体を組み立てる（ランディング + claude + first）
npm run serve:claude   # claude 版だけプレビュー
npm run serve:first    # first 版だけプレビュー
```

## リポジトリ構成

```
site/index.html            ランディングページ
claude/                    HonKit 教材（claude 版）
first/                     HonKit 教材（first 版）= AI-DLC v2 のプロジェクトルート
  .claude/                 AI-DLC v2 の Claude Code 用ランタイム（aidlc config --harness claude が生成）
  aidlc/                   AI-DLC v2 のワークスペース（状態・成果物・監査ログ・チーム知識）
scripts/build-site.mjs     2冊をビルドして _site/ に配置
.github/workflows/         main への push で GitHub Pages に公開
```

`main` へ push すると GitHub Actions が `_site/` をビルドして GitHub Pages に公開します。
