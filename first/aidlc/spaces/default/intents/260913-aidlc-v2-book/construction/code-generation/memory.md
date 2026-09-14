<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-14T02:15:00Z — AI-DLC 2.8.2 の設計原則「User decides, AI executes」は Code Generation で最も強く実装されている（フック由来のチャレンジ/レスポンス受領）; 無人運転を想定しない設計であり、`AIDLC_UNATTENDED=1` はゲートを待たせるための宣言で、通すためのものではない（docs/guide/07-interaction-modes.md）。ケーススタディ 5.3「逸脱と限界」の中心的な事実。

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-14T02:15:00Z — Plan Approval（u1-book-shell）の受領が取れない; `log answer --checkpoint plan-approval` は「requires the actual offered choice from this prompt and session」で拒否。応答は人のプロンプト入力をフックが記録して成立するため、依頼者不介入の本ワークフローでは原理的に得られない（文書化されたバイパスも無く、break-glass も人のタイプが必要）。unit pause を記録し、以降の執筆は依頼者の代理判断のもとエンジンの生成権限の外で行う。計画・テスト指示・要約・traceability・source-manifest は各 Unit ごとに記録ディレクトリへ書き続ける。

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
