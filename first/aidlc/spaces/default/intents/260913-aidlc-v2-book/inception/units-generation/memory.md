<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-14T03:20:00Z — User Stories が SKIP のため story-map は USx.y ではなく requirements.md の FR ID を Unit に対応付けた; ステージ定義「stories.md が無ければ FR を列挙する」に従う。

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-14T03:20:00Z — traceability センサー（advisory）が全 32 FR を GAP と報告した; `.claude/tools/aidlc-sensor-traceability.ts` の storyAssignments は行から `US\d+\.\d+` だけを抽出するため、FR ID で書いた story-map を読めない（上流 ID の取得は FR にフォールバックするのに、割り当ての抽出はフォールバックしない）。成果物は正しく全 FR を Unit に割り当てており、advisory の失敗として承認ゲートで受容する。2.8.2 の実装上の制約であり、ケーススタディ（5.3 逸脱と限界）の素材にする。

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-14T03:20:00Z — Glossary と SourceRegister を独立 Unit にせず U1（骨格と規約）に束ねた; 単独で「動く」成果物が無く、完了条件は README と付録 A/C の形で現れるため。並行の機会（U2 / U3 / U4、U6 / U7）は記録したが、順序は Delivery Planning に委ねた。

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
