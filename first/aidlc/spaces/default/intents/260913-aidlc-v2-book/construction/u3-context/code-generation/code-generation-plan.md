# Code Generation Plan — U3 第 1 部 読者の現在地（`u3-context`）

入力: `../../../inception/requirements-analysis/requirements.md`（FR2.1、FR8.1）、`../../../inception/domain-design/components.md`（ContextPart、Chapter Ledger、Glossary Seed）、`../../../inception/practices-discovery/team-practices.md`。kind `spec` の functional-design は、章仕様を requirements.md の FR2.1 の必須内容 (1)〜(6) とし、主張 → 出典の事前列挙を本計画に含めた。Plan Approval は依頼者の代理判断（U1 と同じ）。

## 主張 → 出典（執筆前の列挙）

| 主張 | 出典 |
| --- | --- |
| AI-DLC は AI 支援開発を反復可能で追跡可能なフェーズに構造化する方法論で、AWS の方法論に由来 | `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?` |
| エンジンが次を決め、コンダクターが実行し、各ステージ後に承認ゲート | `[2.8.2] docs/guide/00-introduction.md § How the Orchestrator Works` |
| 「User decides, AI executes」 | `[2.8.2] core/knowledge/aidlc-shared/ai-dlc-principles.md § Core Principles` |
| 読者像と「個人では効くがチームではスケールしない」痛み | `[record] …/ideation/intent-capture/intent-statement.md § Target Customer` |

## 実装ステップ

- [x] **Step 1** — `first/docs/01-context/01-where-you-are.md` を章テンプレートで書く（必須内容 (1)〜(6)、claude 版 1.1〜1.3、2.12、4.1 への `.html` リンク）。
- [x] **Step 2** — テスト（test-after）: `npm run build:first && node scripts/check-first.mjs --no-external` で 1.1 の blocking 0 件（文字数 2,870、出典 4 行）。

## Testing Contract

U1 の計画に埋め込んだものと同一（`../../u1-book-shell/code-generation/code-generation-plan.md § Testing Contract`）。
