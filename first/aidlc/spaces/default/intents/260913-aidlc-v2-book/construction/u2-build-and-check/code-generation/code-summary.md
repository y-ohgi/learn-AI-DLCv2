# Code Summary — U2 ビルドと検査（`u2-build-and-check`）

## 作成・変更したファイル

| ファイル | 種別 | 内容 |
| --- | --- | --- |
| `scripts/check-first.mjs` | 作成 | 検査規則（CheckRule）の実装。blocking / advisory / `--handson` |
| `scripts/build-site.mjs` | 変更 | 単冊ビルドの引数（`node scripts/build-site.mjs first`）。honkit の相対出力パスがブック基準になる問題を回避 |
| `package.json` | 変更 | `check:first`、`check:first:handson`、`build:first` / `build:claude` の実装変更 |
| `.github/workflows/deploy.yml` | 変更 | `check:first` ステップの追加、`permissions` のジョブ単位化（許容された 2 点） |

## 主な判断

- 文字数は本文から `## 出典` 節・コードフェンス・表の行を除いた Unicode コードポイント数（requirements.md OQ6）。
- 外部 URL と `_site/claude/` は advisory（team-practices）。CI では `--no-external` で外部 URL を省く。
- `[2.8.2]` の照合は `git cat-file -e v2.8.2:<path>`。クローンは `AIDLC_WORKFLOWS_DIR` か一時ディレクトリへの浅いクローン。
- 再現モードは非 root ユーザー `aidlc` があれば `runuser` で実行し、`HOME` を一時ディレクトリにする。

## テストの結果

骨格 + 1.1 で `check-first: blocking 0 / advisory 0`。第 2 部以降の未執筆章は「SUMMARY.md が指すファイルが無い」として正しく検出された。
