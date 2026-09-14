# Unit Test Instructions — U2 ビルドと検査（`u2-build-and-check`）

## 実行コマンド（この Unit だけに限定）

```bash
cd /home/user/learn-AI-DLCv2 && npm run build:first && node scripts/check-first.mjs --no-external
```

`AIDLC_WORKFLOWS_DIR` に `v2.8.2` をチェックアウトしたクローンの場所を渡すと、`[2.8.2]` の実在確認にそれを使う（無ければ一時ディレクトリへ浅いクローン）。

## 期待する結果

| 検査 | 合否 |
| --- | --- |
| 骨格と 1.1 について BLOCKING 0 件 | 終了コード 0（第 2 部以降の未執筆章による「ファイルが無い」「未解決 .md リンク」は Bolt 2 以降で消える） |
| 意図的な違反を検出する | 一時的に 1.1 の `## 出典` を消すと `sections` の BLOCKING が出る（手動で確認） |
| `--handson` | ハンズオン章が無い間は skip を報告する |

## カバレッジ目標

Minimal: 検査規則ごとに 1 つの正例（骨格と 1.1）で確認。誤検知の無いことをゲートの精読で確認。
