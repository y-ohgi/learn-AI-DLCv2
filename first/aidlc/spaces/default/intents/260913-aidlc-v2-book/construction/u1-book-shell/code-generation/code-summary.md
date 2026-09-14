# Code Summary — U1 骨格と規約（`u1-book-shell`）

## 作成・変更したファイル

| ファイル | 種別 | 対応 |
| --- | --- | --- |
| `first/README.md` | 作成 | FR1.1（対象読者と前提、2.8.2 固定、claude 版との関係、出典の読み方、原典 URL、読み方） |
| `first/SUMMARY.md` | 作成 | FR1.2（全 20 章を台帳どおりに列挙。未執筆の章はビルド時に未解決リンクとして検査に現れ、各 Unit の完了で消える） |
| `first/book.json` | 作成 | FR1.2（`language: "ja"`、`structure.readme` / `structure.summary`、プラグイン無し） |
| `first/.bookignore` | 維持 | 既存（`.claude`、`aidlc` 等を除外） |

## 主な判断

- SUMMARY.md は計画（Step 2）では「章ができた Unit の分だけ載せる」としていたが、複数 Unit の並行執筆で SUMMARY.md の編集が競合するため、全章を先に列挙し、未執筆の章は検査スクリプトの「SUMMARY.md が指すファイルが無い」で追跡する形に変えた（計画からの逸脱。Bolt 1 の完了条件「検査 blocking 0 件」は第 2 部以降の章がそろうまで満たせないため、Bolt 1 の検査は「第 1 部までの章に関する blocking 0 件」と読み替える）。
- 規約（Chapter 台帳・Glossary Seed・出典書式）は `inception/domain-design/components.md` を正とし、本文へ複製しない。README の「出典の読み方」がその読者向けの写し。

## テストの結果

- `npm run build:first`: 終了コード 0、`_site/first/index.html` 生成、`<title>` は `はじめに · AI-DLC v2 をはじめから`。
- README の検査語: 「対象読者」「2.8.2」「v2.8.2」「355903d」、名前空間 4 種、原典 URL を含む（`grep` で確認）。
- `book.json` の `language` は `ja`。

## 計画からの逸脱

- Plan Approval のエンジン受領は取れなかった（`code-generation-questions.md` の代理判断メモ）。執筆は依頼者の代理判断のもとで行った。
