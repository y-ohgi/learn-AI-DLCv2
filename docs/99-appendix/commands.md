# B. コマンドリファレンス

## ハーネス別の起動方法

| ハーネス | インストール（プロジェクトへコピー） | 起動コマンド |
| --- | --- | --- |
| **Claude Code** | `dist/claude/.claude/` + `dist/claude/aidlc/` | `/aidlc` |
| **Kiro IDE** | `dist/kiro-ide/.kiro/` + `dist/kiro-ide/aidlc/` + `AGENTS.md` | `/aidlc` |
| **Kiro CLI** (≥2.6) | `dist/kiro/.kiro/` + `dist/kiro/aidlc/` + `AGENTS.md` | `/aidlc` |
| **Codex CLI** (≥0.145.0) | `dist/codex/`（`.codex/` + `.agents/` + `aidlc/` + `AGENTS.md`） | `$aidlc`（または `/skills` → aidlc） |
| **Cursor** | `bun dist/cursor/install.ts <project>` | `/aidlc` |
| **opencode** (≥1.17) | `dist/opencode/`（`.aidlc/` + `.opencode/` + `aidlc/` + `opencode.json` + `AGENTS.md`） | `/aidlc` |
| **GitHub Copilot** | `dist/copilot/`（`.aidlc/` + `aidlc/` + `AGENTS.md`、`.github/` はマージ） | `/aidlc` |

**共通の前提**：bun。**共通の注意**：`aidlc/` はエンジンディレクトリの**兄弟**として置く。

## ワークフローの開始

```
/aidlc <自由記述>                     # スコープを自動検出
/aidlc --scope <name> <自由記述>       # スコープを明示
/aidlc <scope-name>                   # 例: /aidlc bugfix
/aidlc --scope feature --depth comprehensive <自由記述>
```

## スコープ一覧

| コマンド | ステージ数 | 既定深度 |
| --- | --- | --- |
| `--scope enterprise` | 33 | Comprehensive |
| `--scope feature` | 33 | Standard |
| `--scope mvp` | 23 | Standard |
| `--scope poc` | 8 | Minimal |
| `--scope bugfix` | 9 | Minimal |
| `--scope refactor` | 10 | Minimal |
| `--scope infra` | 13 | Standard |
| `--scope security-patch` | 10 | Minimal |
| `--scope classic` | 26 | Standard |
| `--scope workshop` | 26 | Standard（テストは Minimal） |
| `--scope express` | 10 | Minimal |

## コンポーザー

```
/aidlc compose "<タスクの説明>"        # 最小十分なプランを提案
/aidlc compose --report sonar.json    # スキャンレポートから組む
/aidlc compose                        # 走行中：未実行ステージを組み替え
/aidlc --new-scope "<説明>"           # 既製スコープに一致してもカスタムを強制
```

走行中は「market research は飛ばせない？」のような普通の会話でも再構成要求として認識されます（同じゲートと検証を通ります）。

## ユーティリティ

```
/aidlc --doctor              # 環境の健康診断（最初に実行する）
/aidlc --status              # 現在の状態
/aidlc --version             # バージョン
/aidlc --stage <slug>        # 任意のステージへジャンプ
/aidlc --phase <name>        # 任意のフェーズへジャンプ
/aidlc --scope <name>        # 走行中にスコープ変更
/aidlc --depth <level>       # 深度変更（minimal / standard / comprehensive）
/aidlc plugin sync           # 配布物更新後にプラグインのステージを復元
```

## CLI ツールの直接実行

ハーネスによっては、セッション外から直接叩けます。

```bash
# Claude Code
bun .claude/tools/aidlc-utility.ts doctor
bun .claude/tools/aidlc-utility.ts scope-table     # 現在有効なスコープ表
bun .claude/tools/aidlc-utility.ts help            # 各スコープの一行説明

# Codex CLI
bun .codex/tools/aidlc-utility.ts doctor

# opencode
bun .aidlc/tools/aidlc-utility.ts doctor

# Cursor
bun .cursor/tools/aidlc-utility.ts doctor
```

## 環境変数

| 変数 | 用途 |
| --- | --- |
| `AWS_AIDLC_DEFAULT_SCOPE` | プロジェクトの既定スコープを上書き（`.claude/settings.json` に設定） |
| `AIDLC_UNATTENDED` | 無人自動化の宣言。設定すると `HUMAN_TURN` が発行されず、ゲートが待ち続ける |
| `AWS_REGION` | Bedrock を使う場合のリージョン |
| `BUN_INSTALL` / `PATH` | bun を非対話シェルから見えるようにする（`~/.zshenv` / `~/.bashrc`） |

## ステージのスラッグ（ジャンプ用）

`--stage` に渡す主なスラッグです。

| フェーズ | スラッグ |
| --- | --- |
| Ideation | `intent-capture`, `market-research`, `feasibility`, `scope-definition`, `team-formation`, `rough-mockups`, `approval-handoff` |
| Inception | `reverse-engineering`, `practices-discovery`, `requirements-analysis`, `user-stories`, `refined-mockups`, `domain-design`, `units-generation`, `contract-design`, `delivery-planning` |
| Construction | `functional-design`, `nfr-requirements`, `nfr-design`, `infrastructure-design`, `code-generation`, `build-and-test`, `ci-pipeline` |
| Operation | `deployment-pipeline`, `environment-provisioning`, `deployment-execution`, `observability-setup`, `incident-response`, `performance-validation`, `feedback-optimization` |

## 主な成果物のパス

```
aidlc/spaces/<space>/
├── memory/{org,team,project}.md                        # ルール
├── knowledge/<agent-name>/*.md                         # チーム知識
└── intents/<YYMMDD>-<label>/
    ├── aidlc-state.md                                  # 状態
    ├── runtime-graph.json                              # 実行実績
    ├── audit/<host>-<clone>.md                         # 監査ログ
    ├── <phase>/<stage>/questions.md                    # 決定の一次記録
    ├── <phase>/<stage>/memory.md                       # 観察ダイアリー
    └── inception/
        ├── requirements.md  stories.md  personas.md
        ├── components.md  decisions.md
        ├── unit-of-work.md
        ├── unit-of-work-dependency.md                  # ★ 実行を決める DAG
        ├── unit-of-work-story-map.md
        ├── contract-summary.md
        ├── bolt-plan.md                                # 計画（実行には使われない）
        ├── team-allocation.md
        └── risk-and-sequencing-rationale.md
```

## よく使う調査コマンド

```bash
INTENT=$(ls -d aidlc/spaces/default/intents/*/ | tail -1)

# 状態の要約
grep -iE 'scope|depth|test strategy|autonomy' "$INTENT"aidlc-state.md

# 決定の一次記録
find "$INTENT" -name 'questions.md' -exec cat {} +

# AI の解釈と未解決事項
find "$INTENT" -name 'memory.md' -exec cat {} +

# ゲートの統計
grep -c 'GATE_APPROVED' "$INTENT"audit/*.md
grep -c 'GATE_REJECTED' "$INTENT"audit/*.md
grep -c 'HUMAN_TURN'    "$INTENT"audit/*.md

# センサーの発火
grep 'SENSOR_' "$INTENT"audit/*.md

# 監査ログを時系列で通し読み
cat "$INTENT"audit/*.md | sort | less
```
