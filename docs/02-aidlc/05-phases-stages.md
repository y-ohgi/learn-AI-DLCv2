# 2.5 5フェーズ33ステージ

全体像です。**すべてを暗記する必要はありません。**「どのフェーズで何が決まるか」と「自分のスコープではどこが動くか」が分かれば十分です。

## 全体フロー

```
INITIALIZATION (0.1-0.3)  3ステージ  ゲートなし・自動
        │ auto-proceed
        ▼
IDEATION (1.1-1.7)        7ステージ  やるべきか？を決める
        │ 検証ゲート 1
        ▼
INCEPTION (2.1-2.9)       9ステージ  何を作るか？を決める
        │ 検証ゲート 2
        ▼
CONSTRUCTION (3.1-3.7)    7ステージ  作る
        │ 検証ゲート 3
        ▼
OPERATION (4.1-4.7)       7ステージ  届けて運用する
        │
        └──── フィードバックループ ────▶ IDEATION 1.1 へ
```

フェーズ境界（Initialization→Ideation を除く）では **検証ゲート（verification gate）** が走り、成果物の存在・トレーサビリティのリンク切れ・孤立した成果物・矛盾を自動チェックします。失敗した場合、進むか戻って直すかを聞かれます。

## Phase 0: Initialization（3ステージ）

ワークスペースの初期化。**承認ゲートなし、1秒未満で完了**します。

| # | ステージ | 内容 |
| --- | --- | --- |
| 0.1 | Workspace Scaffold | Intent の記録ディレクトリを作る |
| 0.2 | Workspace Detection | 言語・設定ファイル・パッケージマニフェストからプロジェクト種別を判定（ルールベース、LLM 不使用） |
| 0.3 | State Initialization | `aidlc-state.md` と `audit/` を作る |

ここで **greenfield（新規）か brownfield（既存コードあり）か**が判定され、後段の Reverse Engineering ステージの実行有無に影響します。

## Phase 1: Ideation（7ステージ）— 「やるべきか」

| # | ステージ | リード | 主な成果物 | 実行 |
| --- | --- | --- | --- | --- |
| 1.1 | Intent Capture & Framing | product | 意図の記述、ステークホルダーマップ | 常時 |
| 1.2 | Market Research | product | 競合分析、build vs buy | 条件付き |
| 1.3 | Feasibility & Constraints | architect | 実現可能性評価、制約レジスタ、RAID ログ | 条件付き |
| 1.4 | Scope Definition | product | スコープ定義、Intent バックログ | 常時 |
| 1.5 | Team Formation | delivery | チーム評価、Mob 編成計画 | 条件付き |
| 1.6 | Rough Mockups | design | ワイヤーフレーム、ユーザーフロー | 条件付き |
| 1.7 | Approval & Handoff | delivery | イニシアチブ概要、決定ログ | 常時 |

**1.1 の設計が示唆的です**：意図の記述とステークホルダーマップには**主張ごとに出典タグ**が付き、前提と未解決の問いが明示されます。残った前提は、Product Lead レビュアーと承認ゲートを通る前に**明示的な確認が必要**です。「AI が勝手に埋めた前提」を人間に踏ませないための設計です。

バグ修正・リファクタ・インフラ・セキュリティパッチのスコープでは、このフェーズは丸ごと飛びます。

## Phase 2: Inception（9ステージ）— 「何を作るか」

**AI-DLC の心臓部**です。ここの出力の質が Construction の質を決めます。

| # | ステージ | リード | 主な成果物 | 実行 |
| --- | --- | --- | --- | --- |
| 2.1 | Reverse Engineering | developer → architect | 9種の RE 成果物 | brownfield のみ |
| 2.2 | Practices Discovery | pipeline-deploy | `team-practices.md`、`discovered-rules.md`、`evidence.md` | 条件付き |
| 2.3 | Requirements Analysis | product | `requirements.md` | 常時 |
| 2.4 | User Stories | product | `stories.md`、`personas.md` | ユーザー向け機能がある場合 |
| 2.5 | Refined Mockups | design | ハイファイモックアップ、インタラクション仕様 | UI がある場合 |
| 2.6 | Domain Design | architect | `components.md`、`decisions.md`（ADR） | 実行計画次第 |
| 2.7 | **Units Generation** | architect | `unit-of-work.md`、`unit-of-work-dependency.md`（DAG）、`unit-of-work-story-map.md` | 常時 |
| 2.8 | Contract Design | architect | `contract-summary.md` | 条件付き |
| 2.9 | Delivery Planning | delivery | `bolt-plan.md`、`team-allocation.md`、`risk-and-sequencing-rationale.md` | 常時 |

### 注目すべき3ステージ

**2.1 Reverse Engineering（pipeline トポロジー）**
既存コードがある場合のみ実行。2リンクの連鎖で、まず developer エージェントがコードをスキャンし、次に architect エージェントが統合して成果物を書きます。複数リポジトリの場合は**リポジトリごとに完全な連鎖が1本必要**です。
既存システムに AI-DLC を入れるとき、実質ここが最初の関門になります。

**2.2 Practices Discovery（subagent ハブ&スポーク）**
「このチームは実際どうやっているか」を発見するステージ。リードが草案を書き、quality / developer / devsecops の3エージェントが**互いに見えない状態で**独立に検査し、人間へのインタビューでギャップを埋め、リードが統合します。
確認された内容は `aidlc/spaces/<space>/memory/team.md` や `project.md` に**昇格**します。つまり**チームの流儀が恒久的なルールになる**。

**2.7 Units Generation**
Unit of Work への分解と**依存関係の DAG** 生成。この DAG が Construction の実行順序と並行可能性を決めます。**v2 の実行単位はここで決まる**、という点が重要です（後述）。

## Phase 3: Construction（7ステージ）— 作る

| # | ステージ | リード | 主な成果物 | 実行 |
| --- | --- | --- | --- | --- |
| 3.1 | Functional Design | architect | `entities.md`、`rules.md`、`functional-spec.md` | Unit ごと |
| 3.2 | NFR Requirements | architect | 性能・セキュリティ・拡張性・信頼性・可観測性の NFR | Unit ごと |
| 3.3 | NFR Design | architect | NFR 設計仕様 | Unit ごと |
| 3.4 | Infrastructure Design | aws-platform | インフラ仕様、IaC 設計 | Unit ごと |
| 3.5 | **Code Generation** | developer | アプリケーションコード＋コードドキュメント | Unit ごと（常時） |
| 3.6 | Build and Test | quality | テスト結果、品質レポート | 最後に1回 |
| 3.7 | CI Pipeline | pipeline-deploy | CI 設定、品質ゲート | 最後に1回（条件付き） |

### stage-major という歩き方

ここは v2 の設計判断が最も見えるところなので、経緯ごと説明します。

**当初**：Unit ごとにステージを回し、全ステージでゲート。3 Unit なら 15 回のゲート。→ ユーザーから「子守りみたいだ」という反応。

**次の修正**：全 Unit の質問をまとめ、全設計をまとめ、全コード生成をまとめ、最後に1回レビュー。→ 15 Unit の場合、ゲートで 15,000 行が一度に出てくる。**1回でレビューできる量を超えた**。

**現在（v2 の既定）**：**stage-major** ＝ **1つのステージを全 Unit に対して実行し、次のステージへ進む**。

```
【stage-major（既定）】
  3.1 を Unit A,B,C に実行 → ゲート → 3.2 を A,B,C に実行 → ゲート → ...

【unit-major（オプトイン）】
  Unit A を 3.1〜3.5 まで実行 → Unit B を 3.1〜3.5 → ...
```

そして**最初の Construction 実行ステージのゲートが walking skeleton のゲート**になります。ここを通ると、**ladder prompt** が一度だけ出ます。

```
▸ 以降の Construction をどう進めますか？
  (1) 自律的に続ける（残りのステージゲートをスキップ）
  (2) 残りのステージすべてでゲートする
```

答えは `aidlc-state.md` の `Construction Autonomy Mode` に記録され、セッション再開後も維持されます。
**早い段階で1回だけ確信を確認し、その後の自律度を意識的に選ばせる**という設計です。

注意点：**`bolt-plan.md`（2.9 の成果物）は計画のドキュメントであり、実行時の Unit のグルーピングや順序にはエンジンが使いません。** 実行時のバッチは `unit-of-work-dependency.md`（2.7 の DAG）から決まります。v1 由来の「Bolt 単位で回る」という説明を見かけたら、この点を思い出してください。

### 並行実行と停止

依存の前提が同じで互いに依存しない Unit（例：B と C がどちらも A のみに依存）は **バッチ**になり、Code Generation で並行実行されうる（自律モード時は worktree で隔離）。
ただし**失敗は必ず Construction を止めます**（自律モードでも）。単独 Unit の失敗なら即停止し、**retry / skip / abort** を聞かれます。バッチの一部が失敗した場合は、成功した Unit の成果物を残したうえで、失敗した Unit だけについて同じ選択を聞かれます。

## Phase 4: Operation（7ステージ）— 届けて運用する

| # | ステージ | リード | 主な成果物 |
| --- | --- | --- | --- |
| 4.1 | Deployment Pipeline | pipeline-deploy | CD 設定、デプロイ戦略、ロールバック手順 |
| 4.2 | Environment Provisioning | aws-platform | 環境インベントリ、検証レポート |
| 4.3 | Deployment Execution | pipeline-deploy | デプロイログ、スモークテスト、ヘルスチェック |
| 4.4 | Observability Setup | operations | ダッシュボード、アラーム、SLO 設定 |
| 4.5 | Incident Response | operations | ランブック、インシデント計画、エスカレーション表 |
| 4.6 | Performance Validation | quality | 負荷試験結果、NFR 検証マトリクス |
| 4.7 | Feedback & Optimization | operations | SLO レポート、コスト分析、フィードバックループ文書 |

7ステージすべて条件付きで、`mvp` や `poc` スコープではフェーズごと飛びます。
**4.7 が終端ステージ**で、承認すればワークフロー完了、あるいは 1.1 に戻って次のサイクルを開始します。

## この章のまとめ

- 5フェーズ33ステージ。フェーズ境界に自動の検証ゲートがある
- Ideation = やるべきか、Inception = 何を作るか、Construction = 作る、Operation = 届けて運用する
- Inception の 2.7 Units Generation が実行単位（DAG）を決める最重要ステージ
- Construction は既定で stage-major。最初のゲートが walking skeleton で、直後の ladder prompt で自律度を選ぶ
- 失敗は自律モードでも必ず止まる
