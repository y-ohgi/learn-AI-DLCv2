# 3.3 フェーズとステージ

3.2 でエンジンが `run-stage` ディレクティブで「次のステージ」を名指しすることを見ました。この章はその名指しされる側、つまり 5 つのフェーズに分かれた 33 のステージを一覧し、1 つのステージ定義ファイルを開いて「誰が主導し、何を作り、何を消費するか」を読み取る方法を説明します。後半では、どのステージにも共通する進め方（質問ファイル、要約確認、承認ゲート、完了報告）を扱います。

## この章で学ぶこと

- 5 フェーズ 33 ステージの全体像を、各フェーズの目的とともに説明できる。
- ステージ定義ファイルのフロントマター（`lead_agent`、`mode`、`produces`、`consumes`、`reviewer`、`sensors`）を読んで、そのステージの担当・成果物・入力・検査を読み取れる。
- ステージプロトコルの共通手順（質問ファイルと `[Answer]:`、Consolidated Summary Confirmation、承認ゲート、完了報告）を順に説明できる。

## 5 フェーズ 33 ステージ

AI-DLC のライフサイクルは 5 つのフェーズに分かれ、合計 33 のステージを持ちます。フェーズは順に実行され、Initialization → Ideation 以外のフェーズ境界では、成果物の欠落やトレーサビリティ（要件から設計、設計から実装へと辿れる紐づけ）の切れ目を自動検査する検証ゲートが走ります。

```text
   INITIALIZATION  -->  IDEATION  -->  INCEPTION  -->  CONSTRUCTION  -->  OPERATION
    0.1-0.3 (3)        1.1-1.7 (7)    2.1-2.9 (9)     3.1-3.7 (7)        4.1-4.7 (7)
    auto-proceed       gate 1         gate 2          gate 3             feedback -> 1.1
```

図の下段の数字はステージ番号と数、`gate N` はフェーズ境界の検証ゲートです。以下、各フェーズのステージを slug（ステージを一意に指す英小文字の識別子で、コマンドやファイル名に使われます）とリードエージェント（そのステージを主導するエージェント）とともに挙げます。エージェントの役割分担は 3.5 で扱うので、ここでは名前だけ眺めてください。

**Initialization（0.1〜0.3）** は、作業記録のディレクトリを作り、ワークスペースを検出し、状態ファイルを初期化する準備フェーズです。3 ステージすべてが 1 回の決定論的なツール呼び出しの中で完了し、承認ゲートはありません。

| # | slug | リード |
| --- | --- | --- |
| 0.1 | `workspace-scaffold` | orchestrator |
| 0.2 | `workspace-detection` | orchestrator |
| 0.3 | `state-init` | orchestrator |

**Ideation（1.1〜1.7）** は、意図を捉え、実現可能性を評価し、スコープを定め、チームを組み、着手の承認を得るフェーズです。

| # | slug | リード |
| --- | --- | --- |
| 1.1 | `intent-capture` | `aidlc-product-agent` |
| 1.2 | `market-research` | `aidlc-product-agent` |
| 1.3 | `feasibility` | `aidlc-architect-agent` |
| 1.4 | `scope-definition` | `aidlc-product-agent` |
| 1.5 | `team-formation` | `aidlc-delivery-agent` |
| 1.6 | `rough-mockups` | `aidlc-design-agent` |
| 1.7 | `approval-handoff` | `aidlc-delivery-agent` |

**Inception（2.1〜2.9）** は、既存コードを分析し、チームの実践を確立し、要件を引き出し、設計し、作業単位（Unit）に分解して、配送計画を立てるフェーズです。

| # | slug | リード |
| --- | --- | --- |
| 2.1 | `reverse-engineering` | `aidlc-developer-agent` |
| 2.2 | `practices-discovery` | `aidlc-pipeline-deploy-agent` |
| 2.3 | `requirements-analysis` | `aidlc-product-agent` |
| 2.4 | `user-stories` | `aidlc-product-agent` |
| 2.5 | `refined-mockups` | `aidlc-design-agent` |
| 2.6 | `domain-design` | `aidlc-architect-agent` |
| 2.7 | `units-generation` | `aidlc-architect-agent` |
| 2.8 | `contract-design` | `aidlc-architect-agent` |
| 2.9 | `delivery-planning` | `aidlc-delivery-agent` |

**Construction（3.1〜3.7）** は、設計・実装・テストを Unit ごとに行うフェーズです。3.1〜3.5 は Unit ごとに走り、3.6 と 3.7 は全 Unit が終わってから 1 回だけ走ります。進め方の詳細は 3.8 で扱います。

| # | slug | リード |
| --- | --- | --- |
| 3.1 | `functional-design` | `aidlc-architect-agent` |
| 3.2 | `nfr-requirements` | `aidlc-architect-agent` |
| 3.3 | `nfr-design` | `aidlc-architect-agent` |
| 3.4 | `infrastructure-design` | `aidlc-aws-platform-agent` |
| 3.5 | `code-generation` | `aidlc-developer-agent` |
| 3.6 | `build-and-test` | `aidlc-quality-agent` |
| 3.7 | `ci-pipeline` | `aidlc-pipeline-deploy-agent` |

**Operation（4.1〜4.7）** は、配備パイプラインを整え、環境を用意し、配備し、監視と改善のループを回すフェーズです。7 ステージすべてが条件付きで、4.7 が終端です。

| # | slug | リード |
| --- | --- | --- |
| 4.1 | `deployment-pipeline` | `aidlc-pipeline-deploy-agent` |
| 4.2 | `environment-provisioning` | `aidlc-aws-platform-agent` |
| 4.3 | `deployment-execution` | `aidlc-pipeline-deploy-agent` |
| 4.4 | `observability-setup` | `aidlc-operations-agent` |
| 4.5 | `incident-response` | `aidlc-operations-agent` |
| 4.6 | `performance-validation` | `aidlc-quality-agent` |
| 4.7 | `feedback-optimization` | `aidlc-operations-agent` |

33 のうち、どれが実際に走るかはスコープが決めます（3.4）。本書のワークフローは 14 ステージだけを実行しました。

## ステージ定義ファイルを読む

各ステージは 1 つの Markdown ファイルで定義され、`core/aidlc-common/stages/<phase>/<slug>.md` に置かれています。あなたのプロジェクトでは `aidlc config` がそれを `.claude/aidlc-common/stages/` に投影しています。ファイルの先頭にある YAML フロントマターは機械（グラフのコンパイラ）が読み、本文の手順は LLM エージェントが読みます。両者を 1 ファイルに置くのは、レビューする人がグラフ上の辺と実行手順を並べて見られるようにするためです。

本書のワークフローで実際に走った 2.2 Practices Discovery のフロントマターを、本書のランタイムから短く抜粋します。

```yaml
slug: practices-discovery
phase: inception
execution: CONDITIONAL
lead_agent: aidlc-pipeline-deploy-agent
support_agents:
  - aidlc-quality-agent
  - aidlc-developer-agent
  - aidlc-devsecops-agent
mode: subagent
summary_confirmation: required
produces:
  - team-practices
  - discovered-rules
  - evidence
  - practices-discovery-timestamp
consumes:
  - artifact: code-structure
    required: false
    conditional_on: brownfield
sensors:
  - required-sections
  - upstream-coverage
```

読み取るべきフィールドは次のとおりです。

| フィールド | 読み方 |
| --- | --- |
| `lead_agent` / `support_agents` | このステージを主導するエージェントと、視点を加える支援エージェント。値は `.claude/agents/*.md` に実在するエージェントに対してコンパイル時に検証される |
| `mode` | 会話の形。`inline`（コンダクター自身が会話の中で進める）、`subagent`（リードを別のサブエージェントに委譲するハブ&スポーク）、`pipeline`（順番に受け渡す鎖）、`mob`（支援エージェントが並列に寄稿する）の 4 つが有効。詳細は 3.5 |
| `produces` | このステージが作る成果物の名前。承認時にこれらが無ければエンジンは `approved` を拒否する |
| `consumes` | 読む入力の成果物名。`required: false` は無くてもよい入力、`conditional_on: brownfield` は既存コードがあるプロジェクトでだけ期待される入力 |
| `reviewer` | 成果物ができたあと、承認ゲートの前に呼ばれる検査役のエージェント。この抜粋には無いが、たとえば 1.1 `intent-capture` は `reviewer: aidlc-product-lead-agent` と `review_class: advisory` を宣言する。宣言する場合は必ず `review_artifact` で検査対象の成果物を 1 つ名指しする |
| `sensors` | 書き込み時やゲートで自動的に走る検査（センサー）の ID。3.7 で扱う |

このほか `execution: CONDITIONAL` は「スコープに含まれていても条件次第で飛ばされ得る」、`summary_confirmation: required` は後述の要約確認を必須にする、という意味です。

> **補足** — フロントマターが正しいかどうかは `aidlc doctor` の Schema validation と Graph references の検査が見ています（3.1）。`consumes` の成果物名がどのステージの `produces` にも無ければ、そこで失敗します。

## どのステージにも共通する進め方

ステージ本文の手順はステージごとに違いますが、その周りを囲む儀式はステージプロトコルとして共通です。ここでは読者が Claude Code の画面で実際に目にする 4 つを、起きる順に説明します。

### 質問ファイルと `[Answer]:`

ステージがあなたの判断を必要とするとき、コンダクターは作業記録の下に質問ファイルを作ります。各設問は A〜E の選択肢と `X. Other (please specify)` を持ち、末尾に空の `[Answer]:` タグが置かれます。作ったあとコンダクターは答え方を 3 つから選ばせます。**Guide me**（1 問ずつ対話で答える）、**I'll edit the file**（自分でファイルに書き込み、終わったら done と言う）、**Chat**（自由に話し、コンダクターが決定を抽出する）。どの方式でも、最終的にファイルの `[Answer]:` がすべて埋まっていることをコンダクターが確認し、空欄が残っていれば先に進みません。ファイルが正の記録です。

本書のワークフローの 1.4 Scope Definition の質問ファイルから、設問 1 つを抜粋します。

```markdown
## Q1. 価値を届けられる最小のスコープ（MVP）はどこまでですか？

A. AI-DLC v2 の特徴解説のみ（ハンズオン無し）
B. 特徴解説 + ハンズオン（インストール〜最初の承認ゲート）
C. B に加えて、本書自身を AI-DLC で作った記録（要件・Unit・レビュー所見・監査ログ）をケーススタディとして収録
D. C に加えて、チーム導入ガイドと他手法との比較まで
E. Not yet defined
X. Other (please specify)

[Answer]: C
```

この回答は依頼者ではなくコンダクターが代理で記入したもので、原文では各回答の末尾に根拠が書かれています（第 5 部で扱います）。

### Consolidated Summary Confirmation（要約確認）

回答が揃うと、コンダクターは回答の要約を提示し、**Looks correct** / **Request changes** の 2 択で確認を求めます。この確認は口頭で済ませてはいけない決まりで、質問ファイルの末尾に `## Consolidated Summary Confirmation` という専用の項が追加され、そこにも空の `[Answer]:` が置かれます。人が選んだ結果がそこに書き込まれ、あわせてフックが受領を記録します。この受領は質問ファイルの内容のダイジェストに紐づくので、確認のあとで回答を書き換えれば無効になります。本書のワークフローの質問ファイルにも、この項が `[Answer]: Looks correct` で残っています。

### 承認ゲート

成果物ができると、コンダクターは `report --result awaiting-approval` でゲートを開き（3.2）、**Approve** / **Request Changes** の 2 択を提示します。Approve なら次のステージへ、Request Changes ならフィードバックを受けて成果物を直し、`revised` でゲートを再び開きます。Ideation と Inception のステージでは、飛ばされたステージを追加する 3 つ目の選択肢が条件付きで加わることがあります。Initialization の 3 ステージだけはゲートを持ちません。

### 完了報告

ゲートを提示する直前、コンダクターは決まった構成の完了メッセージを出します。見出し（`# [emoji] [Stage Name] Complete`）、成果物の要約表、レビュー先のパス、そしてゲートです。承認後には `Progress: N/33 overall | ...` の形で進捗が表示されます。セッション内で最初の完了メッセージには、現在の Depth と Test Strategy（3.4）が添えられ、ゲートで変更を頼めることが案内されます。

## まとめ

- 5 フェーズ（Initialization / Ideation / Inception / Construction / Operation）に 33 ステージがあり、フェーズ境界では検証ゲートが走る。Initialization の 3 ステージは自動で進み、残りはすべて承認ゲートを持つ。
- ステージ定義の YAML フロントマターで、`lead_agent` が主導者、`mode` が会話の形、`produces` / `consumes` が成果物と入力、`reviewer` が検査役、`sensors` が自動検査を宣言する。
- 共通の進め方は、質問ファイル（`[Answer]:` を埋める）→ Consolidated Summary Confirmation（Looks correct / Request changes）→ 完了報告 → 承認ゲート（Approve / Request Changes）の順で、いずれも記録に残る。

## 出典

- [2.8.2] `docs/guide/04-phases-and-stages.md` § Lifecycle Overview — 5 フェーズ 33 ステージ、フェーズ境界の検証ゲート、Initialization → Ideation が自動で進むこと
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Phase 0: Initialization — 3 ステージが 1 回の決定論的ツール呼び出しで完了し承認ゲートが無いこと、リードが orchestrator であること
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Phase 1: Ideation — 1.1〜1.7 のステージ名とリード
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Phase 2: Inception — 2.1〜2.9 のステージ名とリード
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Phase 3: Construction — 3.1〜3.7 のステージ名とリード、3.1〜3.5 が Unit ごと・3.6〜3.7 が最後に 1 回であること
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Phase 4: Operation — 4.1〜4.7 のステージ名とリード、全ステージが条件付きで 4.7 が終端であること
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Stage Execution Modes Reference — inline / subagent / pipeline / mob の内訳
- [2.8.2] `core/aidlc-common/stages/` — 5 フェーズのディレクトリと 33 の slug（ファイル名）
- [2.8.2] `docs/reference/15-stage-definition.md` § Two audiences, one file — フロントマターをパーサが、本文を LLM エージェントが読むこと、1 ファイルに置く理由
- [2.8.2] `docs/reference/15-stage-definition.md` § `mode` — inline / subagent / pipeline / mob の意味と `agent-team` が予約であること
- [2.8.2] `docs/reference/15-stage-definition.md` § `lead_agent` and `support_agents` — 値が `.claude/agents/*.md` に対してコンパイル時に検証されること、`orchestrator` が擬似エージェントであること
- [2.8.2] `docs/reference/15-stage-definition.md` § `reviewer`, `review_artifact`, `reviewer_max_iterations`, and `review_class` — レビュアーがゲート前に呼ばれること、`review_artifact` が必須であること、advisory / adversarial
- [2.8.2] `docs/reference/15-stage-definition.md` § `consumes[].required` — `required: false` の意味
- [2.8.2] `docs/reference/15-stage-definition.md` § `consumes[].conditional_on` — `conditional_on: brownfield` の意味
- [2.8.2] `docs/reference/03-orchestrator.md` § When a stage completes — `produces` の成果物が無ければ `approved` が拒否されること
- [2.8.2] `docs/guide/12-cli-commands.md` § `/aidlc --doctor` — Schema validation と Graph references の検査
- [2.8.2] `docs/reference/04-stage-protocol.md` § Question Flow — 質問ファイルの `[Answer]:` 形式、A〜E と `X. Other (please specify)`、Guide me / I'll edit the file / Chat の 3 モード、完全性の確認、ファイルが正の記録であること、Consolidated Summary Confirmation の専用項と受領がダイジェストに紐づくこと
- [2.8.2] `docs/reference/04-stage-protocol.md` § Approval Gates — Approve / Request Changes の 2 択、Initialization を除く全ステージがゲートを持つこと、Ideation / Inception での条件付き 3 択
- [2.8.2] `docs/reference/04-stage-protocol.md` § Completion Messages — 完了メッセージの構成、`Progress:` 行、最初の完了メッセージに Depth と Test Strategy が添えられること
- [runtime] `first/.claude/aidlc-common/stages/inception/practices-discovery.md` frontmatter — 抜粋したフロントマター（`lead_agent`、`support_agents`、`mode: subagent`、`produces`、`consumes`、`sensors`）
- [runtime] `first/.claude/aidlc-common/stages/ideation/intent-capture.md` frontmatter — `reviewer: aidlc-product-lead-agent`、`review_artifact: intent-statement`、`review_class: advisory` の実例
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Scope Configuration — 実行したステージが 14 であること
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/scope-definition/scope-definition-questions.md` § Q1 — 抜粋した設問と代理回答
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/scope-definition/scope-definition-questions.md` § Consolidated Summary Confirmation — 要約確認の項と `[Answer]: Looks correct`
