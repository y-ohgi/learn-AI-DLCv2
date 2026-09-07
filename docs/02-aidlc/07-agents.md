# 2.7 14エージェントの布陣

## 設計思想：Small Mob, Broad Agents

AI-DLC は「30個の狭い専門エージェント」ではなく **「11個の広く有能なエージェント」** を選びました。理由が明示されています。

> 狭い専門家を多数並べるアプローチは、ウォーターフォールの引き継ぎの連鎖を再現してしまう

具体的な根拠は3つ。

1. **エージェント境界は情報が失われる場所** — 同じ architect エージェントが Domain Design と Functional Design の両方をリードすれば、明示的な引き継ぎ成果物なしで文脈が保たれる
2. **知識ベースの重複を避ける** — architect は7ステージをリードする。狭い専門家に分けると、ほぼ同じ知識ベースを持つエージェントが7個できる
3. **支援ロール（support）で増殖を防ぐ** — 「セキュリティレビュアー」「コンプライアンスレビュアー」「コストレビュアー」を作る代わりに、devsecops と compliance が**他のエージェントがリードするステージに支援として参加する**

人間のチームで 3〜5 人の Mob が機能横断的に1機能を担当するのと同じモデル、という説明です。

## 内訳：14 = 11 + 2 + 1

| 分類 | 数 | 役割 |
| --- | --- | --- |
| ドメイン専門エージェント | 11 | ステージの実務を担当 |
| レビュー専用エージェント | 2 | ステージ成果物に対する品質ゲート |
| コンポーザー | 1 | アダプティブなステージプランを提案 |

## 11のドメインエージェント

| エージェント | 役割 | リードするステージ | 支援するステージ |
| --- | --- | --- | --- |
| `aidlc-product-agent` | プロダクトマネージャー／ビジネスアナリスト | intent-capture, market-research, scope-definition, requirements-analysis, user-stories | rough-mockups, approval-handoff, refined-mockups |
| `aidlc-design-agent` | UX デザイナー | rough-mockups, refined-mockups | user-stories, domain-design |
| `aidlc-delivery-agent` | エンジニアリングマネージャー | team-formation, approval-handoff, delivery-planning | scope-definition, units-generation |
| `aidlc-architect-agent` | ソリューションアーキテクト（**最も広い**） | feasibility, domain-design, units-generation, contract-design, functional-design, nfr-requirements, nfr-design | intent-capture, reverse-engineering, delivery-planning |
| `aidlc-aws-platform-agent` | AWS プラットフォーム | infrastructure-design, environment-provisioning | feasibility, domain-design, contract-design, nfr-design, feedback-optimization |
| `aidlc-compliance-agent` | コンプライアンス（**支援専用**） | なし | feasibility, nfr-requirements, infrastructure-design, environment-provisioning |
| `aidlc-devsecops-agent` | DevSecOps（**支援専用**） | なし | practices-discovery, nfr-requirements, infrastructure-design, build-and-test, environment-provisioning |
| `aidlc-developer-agent` | 開発者 | reverse-engineering（コードスキャン）, code-generation | practices-discovery, user-stories, functional-design, deployment-execution |
| `aidlc-quality-agent` | QA エンジニア | build-and-test, performance-validation | practices-discovery, user-stories, nfr-requirements |
| `aidlc-pipeline-deploy-agent` | CI/CD・リリース | practices-discovery, ci-pipeline, deployment-pipeline, deployment-execution | なし |
| `aidlc-operations-agent` | SRE | observability-setup, incident-response, feedback-optimization | performance-validation |

**架構上の要点**

- `aidlc-architect-agent` が3フェーズ・10ステージにまたがる最大の担当。設計の中央権限
- `aidlc-compliance-agent` と `aidlc-devsecops-agent` は**リードステージを持たない**。純粋に助言者として他のステージに入る
- `aidlc-operations-agent` が 4.7 で運用知見を `aidlc-product-agent` に戻し、**ライフサイクルの輪を閉じる**

## 情報の流れ

```
                        ┌─────────────┐
                        │ コンダクター  │ (すべての委譲を実行)
                        └──────┬──────┘
                               │ delegates
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  ┌──────────┐           ┌──────────┐          ┌──────────┐
  │ product  │──要件/──▶ │architect │──仕様──▶ │developer │
  │          │  ストーリー │          │          │          │
  └────▲─────┘           └────┬─────┘          └────┬─────┘
       │                      │ NFR目標              │ コード
       │                      ▼                      ▼
       │                ┌──────────┐          ┌──────────┐
       │                │aws-       │          │ quality  │
       │                │platform   │          │          │
       │                └────┬─────┘          └────┬─────┘
       │                     │ インフラ         テスト結果│
       │                     ▼                        │
       │               ┌──────────┐                   │
       │               │pipeline- │◀──────────────────┘
       │               │deploy    │
       │               └────┬─────┘
       │                    │ デプロイ済みサービス
       │                    ▼
       │              ┌──────────┐
       └───────────────│operations│
         フィードバックループ└──────────┘
         （運用知見）
```

**重要**：どのトポロジーでも**委譲を行うのは常にコンダクター**です。**エージェント同士は互いを呼び出しません**。これは制御の一元化のためで、暴走的な連鎖起動を防ぎます。

## 2つのレビュアー

ステージ本体が成果物を作った**後**に、別のサブエージェントとして起動される品質ゲートです。

| レビュアー | 対象 |
| --- | --- |
| `aidlc-product-lead-agent` | 要件・ストーリー・モックアップ |
| `aidlc-architecture-reviewer-agent` | 技術設計 |

ステージが `reviewer:` と明示的な `review_artifact:` を宣言している場合に起動され、その成果物に **`## Review` セクションを1つだけ追記**して **READY / NOT-READY** の判定を書きます。
自分では成果物を書き換えません。**判定を書き残すだけ**という制約が、レビューと実装の責任分離になっています。

## モデル階層（judgment / templated）

エージェントには2つの階層があります。

- **judgment 階層**（8エージェント：architect, product, design, developer, quality, devsecops, compliance, aws-platform）
  → **あなたのセッションのモデルと effort をそのまま継承**する。判断が要るので、選んだモデルより下げられることがない
- **templated 階層**（3エージェント：delivery, pipeline-deploy, operations）
  → 出力が定型的（計画、CI/CD の YAML、ランブックの骨組み）なので、中規模モデル・低 effort で回る（Claude Code / Codex / opencode 上。Kiro / Cursor / Copilot では全階層がセッションのモデルを継承）

**コストと品質のトレードオフが設計に組み込まれている**という点で、実務的な配慮です。

## ツールアクセス

Claude Code 上では、全エージェントが**セッションのツールセット全部＋MCP ツール**を継承します。唯一の制約が `disallowedTools: Task` で、**入れ子の委譲を禁止**しています（前述の「エージェント同士は呼び合わない」の実装）。

各エージェントが実際に使うことを想定されているツール：

| ツール | 使うエージェント |
| --- | --- |
| Read, Edit, Write, Glob, Grep, AskUserQuestion | 全14エージェント |
| Bash | aws-platform, devsecops, developer, quality, pipeline-deploy, operations |
| WebSearch | product, design, compliance |

## カスタマイズの正しい方法

> **`.claude/agents/*.md` の14ファイルは編集しないでください。** フレームワークのファイルなので、アップグレードで上書きされます。

代わりに、**スペースレベルの `aidlc/knowledge/<agent-name>/` に自社標準を置きます**（詳細は 2.10）。
新しいエージェントを追加したい場合は `.claude/agents/<slug>.md` を作ります。こちらはユーザー所有のファイルです。

## この章のまとめ

- 11の広いエージェント＋2レビュアー＋1コンポーザー = 14
- 「狭い専門家を並べると引き継ぎの連鎖になる」という理由で、広いエージェントを選んでいる
- compliance と devsecops はリードなしの支援専用。operations がフィードバックループを閉じる
- 委譲はコンダクターのみ。エージェントは互いを呼ばない
- judgment 階層はセッションのモデルを継承、templated 階層は軽いモデルで回る
- カスタマイズは agents ファイルではなく knowledge ディレクトリで行う
