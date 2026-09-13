<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-09-13T13:30:57Z — 依頼文の「調査とレビューは毎フェーズ行う」を、調査＝一次情報の読み直しと出典記録、レビュー＝宣言レビュアー＋ゲートでの代理精読、と解釈して scope-document に固定した; Intent Capture の所見 R-08 を引き継いだもの。
- 2026-09-13T13:30:57Z — ランディングページ作成と /claude/ 再配置はワークフロー開始前に完了済みのため範囲外とし、first 版概要文の更新だけを deployment-execution に含めた; 所見 R-09 の確定。

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-09-13T13:30:57Z — claude 版の文章を再利用せず独立執筆し、重複話題はリンク参照にした; 再利用は執筆を速めるが 2.7.1 時点の事実誤りを持ち込むリスクがあり、SM2（一次情報での裏取り）と両立しない。
- 2026-09-13T13:30:57Z — 事実の裏取りは各章末の「出典」節（一次情報のファイルパス）で示し、別途の対応表は作らない; 読者が辿れ、build-and-test で章ごとに機械的に検査できる最小の形。

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-09-13T13:30:57Z — プロト Unit P2（読者の現在地）をどこまで短くするかは requirements-analysis で章の学習目標として決める; claude 版 第1部と重複させない範囲を定量化していない。

