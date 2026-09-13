---
name: docs-book
depth: Standard
testStrategy: Minimal
keywords: []
description: "事実確認済みの HonKit 教材を書き、既存の GitHub Pages パイプラインで公開する"
skeleton: on
review_cap: advisory
change_control: relaxed
---

# docs-book scope

読者向けの教材（HonKit ブック: Markdown 章 + SUMMARY.md + book.json）を、
一次資料に基づく事実確認付きで書き上げ、すでに存在する GitHub Actions →
GitHub Pages のパイプラインで公開するための composed scope。アプリケーション
コード・クラウドインフラ・データベースは持たない。

Change Control は relaxed: 承認後に入力が変わっても再承認を開き直さず、変更を
1 行で記録・通知して進む。

## Why these stages, why skip those

Ideation は intent-capture と scope-definition だけを残す。読者像と「学べた」
の成功指標、そして既存の姉妹ブックとの境界・優先トピックが本タスク最大の
未決事項であり、market-research / feasibility / team-formation /
rough-mockups / approval-handoff はそれぞれ「市場が無い」「実現性は公開済み
ブックで証明済み」「ソロ実行」「表示層は HonKit 標準テーマ」「同内容の重複
ゲート」の理由で畳み込む。

Inception は greenfield の規約確立（practices-discovery: 文体・引用ルール・
章テンプレ・事実確認/リンク確認の姿勢）、章ごとの学習目標
（requirements-analysis）、書籍アーキテクチャと決定記録（domain-design）、
unit 分解と Bolt 計画（units-generation / delivery-planning、walking skeleton
でスキャフォールドの公開を最初に証明）を残す。単一ペルソナなので
user-stories は requirements に畳み込み、UI 設計が無いので refined-mockups、
章間の正式 API が無いので contract-design を SKIP。reverse-engineering は
greenfield のためステージ条件で SKIP。

Construction は unit ごとの章仕様（functional-design: 主張→一次資料引用の
マップを執筆前にゲート審査）、執筆（code-generation）、`honkit build` +
リンク確認 + 事実確認（build-and-test）。NFR・インフラ・CI は「静的な書籍に
NFR は無い」「Pages/Actions は既存」「CI は既に両ブックをビルドしている」ため
SKIP。

Operation は deployment-execution のみ: タスクの DONE は「公開」であり、
Pages サブパス配下の実サイトで smoke test / health check を行う。CD・環境・
監視・インシデント・性能・フィードバックの各ステージは、静的サイトに
運用面が無く、パイプラインと環境が既存であるため SKIP。

`testStrategy: Minimal` は、ユニットテスト可能なコードが無く、検証が
ビルド成功・リンク解決・一次資料との照合で構成されることを反映する。

## Membership

Initialization 3 ステージ、intent-capture、scope-definition、
practices-discovery、requirements-analysis、domain-design、units-generation、
delivery-planning、functional-design、code-generation、build-and-test、
deployment-execution が EXECUTE（14）。その他 19 ステージは SKIP。
keywords は空で、`--scope docs-book` の明示指定でのみ選択される。
