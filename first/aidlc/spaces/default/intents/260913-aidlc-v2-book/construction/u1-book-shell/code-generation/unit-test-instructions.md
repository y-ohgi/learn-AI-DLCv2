# Unit Test Instructions — U1 骨格と規約（`u1-book-shell`）

## テストの枠組み

本 Unit にユニットテストフレームワークは無い。「テスト」は HonKit のビルドと生成物の検査で、Minimal 戦略（要件ごとに 1 つの検証）に従う。検査スクリプト `scripts/check-first.mjs` は U2 で作るため、U1 の時点では次のコマンドで検査する。

## 実行コマンド（この Unit だけに限定）

親リポジトリのルート（`/home/user/learn-AI-DLCv2`）で実行する。

```bash
npm run build:first && test -f _site/first/index.html && grep -c "はじめに" _site/first/index.html
```

- `npm run build:first` は `honkit build first _site/first` を実行する（`package.json` の既存スクリプト）。
- `test -f _site/first/index.html` は骨格がビルドされたことの検査（`scripts/build-site.mjs` は `SUMMARY.md` が無いと first 版を飛ばして終了コード 0 になるため、存在確認を必須にする）。
- `grep -c "はじめに"` は README が目次に載ったことの検査。

## 期待する結果

| 検査 | 要件 | 合否 |
| --- | --- | --- |
| ビルド終了コード 0 | FR1.2 | 0 以外なら失敗 |
| `_site/first/index.html` の存在 | FR1.2 | 無ければ失敗 |
| README に「対象読者」の表、「2.8.2」「v2.8.2」「355903d」、名前空間 4 種、原典 URL が含まれる | FR1.1、NFR6、NFR8 | `grep` で各語が 1 回以上 |
| `book.json` の `language` が `ja` | FR1.2 | `node -e` で JSON を読んで確認 |

## カバレッジ目標

Minimal: 要件 3 件（FR1、FR1.1、FR1.2）それぞれに 1 つ以上の検査。行カバレッジの床は無い（docs-book スコープ）。

## モック・テストデータ

不要。入力は `first/` の実ファイルのみ。
