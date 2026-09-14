<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-14T04:00:00Z — Bolt 1 を U1 + U2 + U3 の walking skeleton、以後 1 Bolt = 1 Unit の計 6 Bolt とし、順序は依存 → 事実誤りのリスク → 付録は最後の 3 規則で決めた; WSJF は Unit 8 個の DAG では順序を変えないため使わない。
- 2026-09-14T04:00:00Z — Construction は unit-major（Unit ごとに設計と執筆）・solo（1 セッション）とし、`set-construction-iteration unit-major` と `set-unit-ownership solo` を記録した; walking skeleton が先に動くこと、team.md の gate every Bolt と整合する。

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-14T04:00:00Z — フェーズ境界検証で units-generation の traceability センサーは advisory の fail を報告するが、表を story-map と 1 対 1 で照合して不足が無いことを確認し PASS とした; センサーの割り当て抽出が US ID 限定という 2.8.2 の実装上の制約。

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-14T04:00:00Z — ケーススタディの記録の締め（Bolt 4 完了時点）は U7 の functional-design で確定する。

