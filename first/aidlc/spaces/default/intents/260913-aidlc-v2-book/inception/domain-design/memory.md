<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-14T02:10:00Z — 「コンポーネント = 書くコードのまとまり」を「私たちが書く、独立した責務を持つ教材のまとまり」と読み替え、部 6 + 横断 6 の 12 個にした; 部 = FR{n} = Unit 候補、章 = 検査対象ファイルの 2 段を保つため。エンティティは所有 + 形だけを記録し、型や制約は functional-design に残した。

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-09-14T02:10:00Z — inline ステージのため支援エージェント（aws-platform、design）は委譲せず、コンダクターがその視点（公開経路の既存資産の扱い、読者の読み順と目次の形）を取り込んで書いた; ステージプロトコル ensemble の inline 規則どおり。要約確認の受領は文書化された回避フラグ 2 つで記録した。

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-14T02:10:00Z — components.md の Component Diagram は記録用の成果物なので mermaid を使い、テキスト版を併記した; 本文の章では mermaid を禁止しているが、記録は HonKit で公開されない（.bookignore）ため team-practices の禁止対象外と判断。

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-14T02:10:00Z — Bolt の区切り（walking skeleton に BookShell + ContextPart + CheckScript を入れるか）は delivery-planning で決める。Glossary Seed の初出章は執筆順で変わり得るため付録 A 執筆時に確定する。

