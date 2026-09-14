<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-13T14:25:00Z — 要件を「部 = FR{n}、章 = FR{n}.{m}、学習目標 = 章の『この章で学ぶこと』」と読み替えた; 教材にはシステム機能が無く、team-practices の traceability 規約（要件 = FR、コンポーネント = 章ファイル）に合わせるため。
- 2026-09-13T14:25:00Z — 「v1 → v2」はタグ v2.8.2 の一次情報に「v1」が現れないため、first 版では『v2 = aidlc-workflows 2.x（本書は 2.8.2）』と定義し、v1 の歴史的説明は claude 版へのリンクに留める判断をした（Q3）; 原典の AWS ブログは docs/guide/00-introduction.md 経由で引く。
- 2026-09-14T01:40:00Z — advisory レビューの所見 8 件（Major 2 / Minor 6）を Accepted risk にせず Request Changes で取り込んだ; R-04（`.claude/CLAUDE.md`）と R-08（配布方式の転換点）は事実の正確さに関わり、依頼文「間違った情報は取り込まない」に直結するため。改訂後に advisory の再レビューを 1 回だけ行う（Part 0 revision path）。

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-13T14:25:00Z — 質問の回答と要約確認はコンダクターが依頼者の代理として行い、要約確認の受領は文書化された回避フラグ 2 つで記録した; セッションに AI-DLC のフックが無いため。

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-13T14:25:00Z — 章数を 20（上限）に収めるため、概念の部を 2 章、ハンズオンを 2 章にまとめ、つまずきポイントは章内の任意節と付録 D の再掲に分けた; 各章 2,000〜6,000 文字に収まるかは functional-design で見直す（A6）。

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-13T14:25:00Z — 方法論の原典（AWS ブログ）の出典表記（OQ1）と対訳表（OQ2）は domain-design で確定する。
- 2026-09-14T01:40:00Z — CHANGELOG によれば `install.sh --version` の初出は 2.7.2 で、2.8.0 はそれを含む最初の baseline。intent-statement の Initiative Trigger と、親リポジトリのランディングページ・claude 版 README の追記に残る「2.8.0 で配布方法が変わった」という表現は、deployment-execution でランディングページの概要文を更新するときに同じ精度に直す（A7）。

