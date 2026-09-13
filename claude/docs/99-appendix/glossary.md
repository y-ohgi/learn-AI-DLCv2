# A. 用語集

AI-DLC の用語を、**この教材の文脈で必要な範囲**に絞って整理しました。公式の完全な用語集は[公式 Glossary](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/glossary.md) にあります。

## 方法論の用語（v1 由来）

| 用語 | 意味 |
| --- | --- |
| **AI-DLC** | AI-Driven Development Life Cycle。AWS が定義した AI-native な開発ライフサイクルの方法論 |
| **Intent** | ビジネス上の意図。「何をしたいか」の出発点。v2 では1つの取り組みを表す単位でもある |
| **Unit of Work** | **WHAT**。Intent を分解した、独立して実装可能な成果物の単位。2.7 で生成され `unit-of-work-dependency.md` に列挙される |
| **Bolt** | スプリントの置き換え。1つ以上の依存関係でつながった Unit にまたがる Construction のイテレーション。数時間〜数日。2.9 で計画されるが、**既定の実行では順序決定に使われない** |
| **Mob Elaboration** | 要件の集団詳細化。AI が質問と草案を出し、プロダクト・開発・QA が同じ場で検証する同期セッション |
| **Mob Construction** | 設計・実装の集団構築。同じことを Construction フェーズで行う |
| **Walking Skeleton** | 最初の Bolt。すべての結合点を薄く1本通す最小のエンドツーエンドスライス。常にゲートされ対話的 |

## v2 実装の用語

### 制御

| 用語 | 意味 |
| --- | --- |
| **Engine（エンジン）** | 決定論的なオーケストレーションツール（`aidlc-orchestrate.ts`）。ステージ間のルーティングをすべて所有する。サブコマンドは `next` / `continue` / `report` / `park` / `team-board` |
| **Conductor（コンダクター）** | `/aidlc` セッション自体（`SKILL.md`）。LLM 側。実行の品質を所有し、ルーティングは所有しない |
| **Directive** | エンジンが `next` のたびに発行する型付き命令（`run-stage` / `ask` / `print` / `done` / `invoke-swarm` など） |
| **Orchestrator** | エンジン＋コンダクターの総称 |
| **Control loop** | ルール（事前適用）とセンサー（事後検査）のフィードフォワード／フィードバックの対 |

### 構造

| 用語 | 意味 |
| --- | --- |
| **Phase（フェーズ）** | ライフサイクルの5大区分。Initialization(0) / Ideation(1) / Inception(2) / Construction(3) / Operation(4) |
| **Stage（ステージ）** | 33個の個別ステップ。リードエージェント・入出力・条件が定義される。`1.1`、`2.7` のように番号付け |
| **Scope（スコープ）** | 11個の名前付き設定。どのステージを実行するかと既定深度を決める |
| **Depth（深度）** | Minimal / Standard / Comprehensive。各ステージの成果物の詳細度 |
| **Test strategy** | Minimal / Standard / Comprehensive。テストの量と種類。深度から独立 |
| **Workflow profile** | ユーザーガイドにおけるスコープの呼び名（Classic、Express など） |

### ワークスペース

| 用語 | 意味 |
| --- | --- |
| **Space（スペース）** | `aidlc/spaces/<space>/` のチーム単位ワークスペース。独自の `memory/`・`knowledge/`・`intents/` を持つ。単一チームなら `default` だけ |
| **Record dir（記録ディレクトリ）** | 1つの Intent の成果物・状態・監査を持つディレクトリ。`aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` |
| **State file** | `aidlc-state.md`。6状態のチェックボックス（`[ ]` `[-]` `[?]` `[R]` `[x]` `[S]`）で進捗を持つ |
| **Artifact（成果物）** | ステージが生成するバージョン管理された Markdown（`requirements.md`、`decisions.md` など） |
| **memory.md** | ステージごとの観察ダイアリー。Interpretations / Deviations / Tradeoffs / Open questions を記録。**手編集禁止**。学習ループの入力 |
| **Audit trail（監査ログ）** | `audit/` の追記専用イベントログ。91種類のイベント型、ISO タイムスタンプ、ホスト別シャード |
| **Runtime graph** | `runtime-graph.json`。承認ゲートごとに監査ログから生成される実行実績のミラー |
| **Recovery breadcrumb** | `.aidlc-recovery.md`。`PreCompact` フックが書く、状態破損検知用のファイル |

### 実行

| 用語 | 意味 |
| --- | --- |
| **Inline execution** | 既定の実行モード（29ステージ）。コンダクターがエージェントの人格を被り会話の中で実行 |
| **Subagent execution** | ハブ&スポーク（2ステージ）。別コンテキストのサブエージェントに委譲。2.2 と 3.5 |
| **Pipeline execution** | 連鎖（1ステージ）。順序付きのリンク。2.1 Reverse Engineering |
| **Mob execution** | メッシュ（1ステージ）。リードが草案、協力者が並行して寄稿ファイルを書き、リードが統合。2.4 User Stories |
| **Walk order** | Construction の歩き方。既定 = **stage-major**（1ステージを全 Unit に実行してから次のステージ）。オプトイン = **unit-major** |
| **Parallel batch** | DAG から決まる、互いに依存しない実行可能な Unit のグループ。**Bolt 計画のグルーピングとは別物** |
| **Ladder prompt** | walking skeleton のゲート直後に1度だけ出る質問。「自律で続ける」か「全ステージでゲートする」か |
| **Autonomy mode** | `aidlc-state.md` の `Construction Autonomy Mode`。`autonomous` / `gated` / `unset` |
| **Worktree** | 自律 swarm モードで Bolt を隔離する git worktree（`bolt-<slug>` ブランチ） |

### 品質と統制

| 用語 | 意味 |
| --- | --- |
| **Approval gate（承認ゲート）** | 各ステージ末の対話的チェックポイント。承認 / 変更要求 / （3回目以降）現状受け入れ。Initialization にはない |
| **Phase boundary verification** | フェーズ遷移時の自動トレーサビリティ検査。リンク切れ・孤立成果物・矛盾を検出 |
| **Reviewer（レビュアー）** | 品質ゲートエージェント。`aidlc-product-lead-agent`（要件・ストーリー・モック）と `aidlc-architecture-reviewer-agent`（技術設計）。`## Review` に READY / NOT-READY を追記するのみ |
| **Rule（ルール）** | `aidlc/spaces/<space>/memory/` に書く恒久的な振る舞い規則。`## Forbidden` / `## Mandated` のガードレールを持つ。org → team → project の順で解決 |
| **Guardrail** | ルールファイル内の規範的な制約セクション |
| **Sensor（センサー）** | `.claude/sensors/` のマニフェストで定義される決定論的検査。Write/Edit またはゲートで実行。blocking な指摘は修正か監査に残るオーバーライドが必要 |
| **Knowledge（知識）** | エージェントがステージ開始時に読む参考資料。メソドロジー知識（フレームワーク所有）とチーム知識（`aidlc/spaces/<space>/knowledge/`、ユーザー所有）の2階層 |
| **Learning loop（学習ループ）** | ステージ中の指摘を `memory.md` に記録し、ゲートで提示して恒久的な practice やセンサーに変える仕組み |
| **HUMAN_TURN** | 人間が対話したことを示す監査イベント。承認の前提条件 |
| **AIDLC_UNATTENDED** | 無人自動化の宣言用環境変数。設定すると `HUMAN_TURN` が発行されず、ゲートが待ち続ける |

### 基盤

| 用語 | 意味 |
| --- | --- |
| **Harness（ハーネス）** | AI-DLC コアを載せる CLI 環境。Claude Code / Kiro IDE / Kiro CLI / Codex CLI / Cursor / opencode / GitHub Copilot |
| **Core** | `core/` の手書きハーネス非依存ソース。方法論の本体 |
| **Distribution** | 生成された `dist/<harness>/` ツリー。ユーザーがコピーするもの。**手編集禁止** |
| **Packager** | `scripts/package.ts`。Core + Manifest から Distribution を再生成するビルド |
| **Manifest** | `harness/<name>/manifest.ts`。Core をそのハーネスの Distribution に投影する契約 |
| **Composer（コンポーザー）** | アダプティブワークフローのエージェント。エントロピーを推定して最小十分なステージプランを提案（`/aidlc compose`） |
| **Hook（フック）** | ハーネスがイベントに応じて自動実行する TypeScript スクリプト。17個が `settings.json` に登録 |
| **Compaction** | コンテキストウィンドウが埋まったときの自動要約。AI-DLC は状態ファイルで越える |

## 混同しやすいペア

| ペア | 違い |
| --- | --- |
| **Unit of Work / Bolt** | Unit は **WHAT**（何を作るか）、Bolt は **WHEN/HOW**（いつどうまとめて作るか） |
| **Bolt / Parallel batch** | Bolt は 2.9 の計画上のグルーピング、batch は 2.7 の DAG から決まる実行時のグループ。**実行を決めるのは後者** |
| **Rule / Knowledge** | Rule は「守るべき規則」、Knowledge は「参照する背景情報」 |
| **Rule / Sensor** | Rule は事前に LLM に適用（守られないことがある）、Sensor は事後に決定論的に検査（確実） |
| **Engine / Conductor** | Engine はルーティング（TS・決定論的）、Conductor は実行品質（LLM） |
| **Space / Intent** | Space はチーム単位のワークスペース、Intent はその中の1つの取り組み |
| **Depth / Test strategy** | Depth はドキュメントの詳細度、Test strategy はテストの量。**独立している** |
