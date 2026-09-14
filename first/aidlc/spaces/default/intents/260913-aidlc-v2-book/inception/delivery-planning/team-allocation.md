# Team Allocation — AI-DLC v2 教材（first 版）

入力: `bolt-plan.md`、`../units-generation/unit-of-work.md`（`unit-of-work`）、`../practices-discovery/team-practices.md`（`team-practices`）。Team Formation（1.5）は docs-book スコープで SKIP のため、チームは 1 つ（AI のコンダクター）である。

Bolt とは、いくつかの Unit を 1 回の作業で設計・執筆・検査して動く状態で終える区切り。mob とは、その Bolt を担当する小さなチームのこと。本プロジェクトでは mob は 1 つで、`/aidlc` セッション（コンダクター）が `aidlc-developer-agent` の役で執筆し、`aidlc-quality-agent` の視点で検査し、依頼者の代理としてゲートで精読・承認する。

## 割り当て

| Bolt | Unit | 担当 mob | 執筆 | 検査 | 承認（代理） |
| --- | --- | --- | --- | --- | --- |
| Bolt 1 | U1、U2、U3 | コンダクター | aidlc-developer-agent | `npm run check:first`（U2）+ 代理精読 | コンダクター（依頼者の代理） |
| Bolt 2 | U4 | コンダクター | 同上 | 同上 | 同上 |
| Bolt 3 | U5 | コンダクター | 同上 | 同上 | 同上 |
| Bolt 4 | U6 | コンダクター | 同上 | 同上 + 再現モード（NFR1） | 同上 |
| Bolt 5 | U7 | コンダクター | 同上 | 同上 | 同上 |
| Bolt 6 | U8 | コンダクター | 同上 | 同上 | 同上 |

## 進め方

- チームが 1 つなので Program Board（複数チームの調整表）は不要。Bolt は直列で、同時に進める Bolt は無い（Q4）。
- Construction の per-unit ステージ（functional-design、code-generation）は Unit ごとに設計と執筆を続けて行い、次の Unit に進む（unit-major。Bolt 1 が walking skeleton として先に「動く」ためにこの順が必要）。
- 各 Unit の functional-design（章仕様）で「主張 → 出典」を先に列挙し、code-generation（執筆）後に検査、Bolt ごとのゲートで代理精読する（team-practices `## Testing Posture`）。
- レビュアー（functional-design / code-generation にレビュアーが宣言されている場合）は各ステージの advisory / adversarial 契約に従って別エージェントとして起動する。
