# 3.4 スコープとコンポーザー

3.3 で見た 33 のステージを、毎回すべて通るわけではありません。バグ修正に市場調査は要らず、概念実証に配備パイプラインは要りません。どのステージを実行しどれを飛ばすかを決めるのがスコープで、それを作業に合わせて調整するのがコンポーザーです。この章では 11 の標準スコープ、Depth と Test Strategy、自動検出、`compose` の提案と承認ゲートを説明し、本書のワークフローがなぜ `docs-book` というカスタムスコープで走ったのかを記録から読みます。

## この章で学ぶこと

- 11 の標準スコープの EXECUTE / SKIP 表の読み方と、スコープが Depth・Test Strategy の既定値を決めることを説明できる。
- 説明文からの自動検出と、`compose` が提案を作って承認ゲートで止まる流れを説明できる。
- 自分の作業に標準スコープが合わないとき、カスタムスコープがどこに何として作られるかを、本書の `docs-book` を例に説明できる。

## スコープとは何か

スコープは「どのステージを実行するか」を決める名前つきの設定です。2.8.2 のコアには 11 の標準スコープが同梱され、それぞれがステージの集合、既定の Depth、既定の Change Control（承認後に入力が変わったときの扱い）を持ちます。スコープの正体はファイルで、`.claude/scopes/aidlc-<name>.md` がスコープの名前・キーワード・既定値を、各ステージ定義の `scopes:` フロントマター（3.3）がそのステージがどのスコープに属するかを宣言し、両者をコンパイルしたものが `.claude/tools/data/scope-grid.json` です。エンジン（3.2）はこのコンパイル済みの表を読んでルーティングします。

| スコープ | EXECUTE / 33 | Depth | Test Strategy | 用途 |
| --- | --- | --- | --- | --- |
| `enterprise` | 33 | Comprehensive | Comprehensive | 規制対象の企業機能。完全な監査証跡 |
| `feature` | 33 | Standard | Standard | 新機能のフルライフサイクル |
| `mvp` | 23 | Standard | Standard | 新規プロダクトの最小版。後期の運用ステージを飛ばす |
| `poc` | 8 | Minimal | Minimal | 実現可能性を素早く示す |
| `bugfix` | 9 | Minimal | Minimal | 特定のバグを直して配備する |
| `refactor` | 10 | Minimal | Minimal | 既存コードを整理して配備する |
| `infra` | 13 | Standard | Standard | インフラ変更 |
| `security-patch` | 10 | Minimal | Minimal | CVE 対応 |
| `classic` | 26 | Standard | Standard | Ideation を持たないライフサイクル。暗黙の既定 |
| `workshop` | 26 | Standard | Minimal | 教育向けの進行 |
| `express` | 10 | Minimal | Minimal | 要件から条件付き配備まで。設計とレビュアー無し |

EXECUTE / SKIP の考え方は、ステージ単位で「この作業にこのステージの成果物は要るか」を問うことです。たとえば `bugfix` は Ideation を丸ごと飛ばし（発見すべき新しいプロダクトが無い）、2.1 Reverse Engineering で現状のコードを理解し、2.3 で「直った」の定義を書き、3.5 と 3.6 で修正と検証をし、4.1 と 4.3 で配備します。表の Total が 9 なのは Initialization の 3 ステージを含むためで、Initialization はどのスコープでも常に走ります。全 33 ステージの EXECUTE / SKIP を並べた表（Stage-by-Scope Matrix）はガイドにあり、自分のプロジェクトでは `aidlc engine gen scope-table` でコンパイル済みの表を出せます。

ワークフローを始めるとき、確認の 1 行に「N of 33 stages, M approval gates」とステージ数と承認ゲート数が表示されます。コンパイル済みの表から計算された数で、見積もりではありません。始める前に何に同意しているのかが分かるようになっています。

## Depth と Test Strategy

スコープが決めるのは「どのステージが走るか」だけではありません。各ステージが**どれだけ詳しく**成果物を書くかが Depth（深さ）、**どれだけの量の試験**を生成するかが Test Strategy で、どちらもスコープが既定値を持ち、あとから上書きできます。

| Depth | 成果物の詳しさ |
| --- | --- |
| Minimal | 核となる要点だけ。1〜2 ページ、重要な決定のみ、任意の節は省く |
| Standard | 必要な節をすべて備えた完全な成果物。理由は簡潔に |
| Comprehensive | 任意の節も含む拡張版。詳細な正当化、コンプライアンスの相互参照 |

Test Strategy は Depth とは独立で、Minimal は「要件 1 つにつき試験 1 つ + コンポーネントごとに正常系 1 つ」という最小限、Standard はコンポーネントごとに 5〜8 個で単体と統合を含む、Comprehensive はコンポーネントごとに 10〜15 個で全種類、という目安です。独立にしてあるので、成果物は Standard の詳しさで書きつつ試験は Minimal に留める、という組み合わせができます。上書きは `/aidlc --depth <level>` と `/aidlc --test-strategy <level>` のフラグ、スコープ確認時の返答、そして任意の承認ゲートでのフィードバックの 3 か所で可能です。

## 自動検出

スコープを明示しなくても始められます。`/aidlc Build a REST API for inventory management` のように説明文だけを渡すと、エンジンはキーワードでスコープを推定します。「fix」「bug」「broken」なら `bugfix`、「refactor」なら `refactor`、「security」「CVE」なら `security-patch`、「poc」「prototype」なら `poc`、といった対応表があります。

ただし、この推定は 5 語以下の短い説明でのみ素直に働きます。5 語を超える説明文は原則として、キーワードが当たっても次節の compose の提案に回されます（`refactor`、`mvp`、`poc`、`CVE` のような強いキーワードだけは長さに関わらずそのスコープを提案します）。これは語彙的なヒューリスティックなので、提案されたプランが意図に合うかを確認する前提です。キーワードが 1 つも当たらないときの既定は `classic` で、`AWS_AIDLC_DEFAULT_SCOPE` で変えられます。本書のランタイムの `settings.json` でもこの変数が `classic` に設定されています。

## `compose`: コンポーザーの提案と承認ゲート

標準スコープのどれも作業に合わないとき、コンポーザーがあなたの作業に合わせた EXECUTE / SKIP の表を提案します。コンポーザーは 14 エージェントの 1 つ（`aidlc-composer-agent`、3.5）で、`/aidlc compose "<task>"` で明示的に呼べます。前節の「長い説明文は compose の提案に回される」挙動も、同じコンポーザーが動いています。

```text
   /aidlc compose "<task>"
        |
        v
   composer: read task, run read-only detect scan,
             estimate 5 entropy components,
             build minimum viable EXECUTE/SKIP grid
        |
        v
   validate grid (aidlc-graph validate-grid) --> nearest stock scope?
        |
        v
   GATE: approve / edit / reject      <-- nothing written before this
        |
        +-- matched stock scope  --> create workflow with that scope
        +-- custom grid          --> write scopes/aidlc-<name>.md
                                     + scope-grid.json entry, then create
```

コンポーザーは作業内容を読み、読み取り専用のワークスペース走査を行い、5 つの「実装のエントロピー」（意図の曖昧さ、コード構造の不確かさ、検証の難しさ、リスク、未解決の前提）を見積もって、成果物の依存関係を満たす最小の EXECUTE / SKIP 表を組みます。提案には各成分のスコアと LOW / MED / HIGH の帯、そして**すべての EXECUTE と SKIP に対する理由**が付き、コンパイル済みのステージ集合に対して検証されます。あなたは承認・編集・却下のゲートで判断し、承認するまで何も書かれずワークフローも始まりません。

承認後の分岐が重要です。提案が標準スコープに一致すれば、そのスコープでワークフローが作られます。一致しないカスタムの表なら、コンポーザーは本物のスコープとして 2 つのファイル、`scopes/aidlc-<name>.md` と `scope-grid.json` の項目を書き、同じターンでそのスコープのワークフローを作ります。作られたカスタムスコープは以後 `/aidlc --scope <name>` で標準スコープと同じように選べ、グラフの再コンパイルでも消えません。ただし `keywords: []` で作られるので、一度きりの計画が将来の自動検出に紛れ込むことはありません。

ワークフローの途中でも `/aidlc compose` は使えます。このときは新しいスコープを作らず、まだ走っていないステージの EXECUTE / SKIP を反転する提案になり、完了済み・進行中のステージは凍結されます。承認すると `recompose` という決定論的な操作が計画を書き換え、`RECOMPOSED` イベントを監査ログに残します。

> **補足** — コンポーザーの提案画面（ARS スコア表と各ステージの判定表）の読み方は、第 5 部の 5.1 で本書のワークフローの例を使って扱います。

## 記録から: なぜ `docs-book` を作ったか

本書のワークフローは、上の 11 スコープのどれでも走っていません。産物が HonKit の教材でアプリケーションコードもインフラも無いため、`feature` や `classic` では NFR やインフラ設計、CI パイプラインといった「静的な書籍には無いもの」のステージまで走り、逆に `poc` や `express` では読者像と学習目標を固める設計ステージが抜けます。そこでカスタムスコープ `docs-book` が本書のランタイムに置かれています。フロントマターを抜粋します。

```yaml
name: docs-book
depth: Standard
testStrategy: Minimal
keywords: []
description: "事実確認済みの HonKit 教材を書き、既存の GitHub Pages パイプラインで公開する"
skeleton: on
review_cap: advisory
change_control: relaxed
```

そして `scope-grid.json` の `docs-book` 項は、33 ステージそれぞれに `EXECUTE` か `SKIP` を割り当てた表で、EXECUTE は Initialization の 3 つに `intent-capture`、`scope-definition`、`practices-discovery`、`requirements-analysis`、`domain-design`、`units-generation`、`delivery-planning`、`functional-design`、`code-generation`、`build-and-test`、`deployment-execution` を加えた 14、残る 19 が SKIP です。状態ファイルの `## Scope Configuration` にも同じ 14 と 19 が `Stages to Execute` / `Stages to Skip` として写っています。

スコープファイルの本文には「なぜこのステージを残し、なぜあれを飛ばすか」が書かれています。要約すると、Ideation は読者像と成功指標、姉妹本との境界が最大の未決事項なので `intent-capture` と `scope-definition` を残し、市場調査（市場が無い）、実現可能性（公開済みの本で証明済み）、チーム編成（単独実行）、モックアップ（表示は HonKit 標準テーマ）を畳む。Inception は規約確立、章ごとの学習目標、書籍の構造と決定記録、Unit 分解と配送計画を残し、単一ペルソナなので `user-stories` を要件に畳み、章間に正式な API が無いので `contract-design` を飛ばす。Construction は章仕様（`functional-design`）、執筆（`code-generation`）、ビルドとリンク確認と事実確認（`build-and-test`）を残し、NFR・インフラ・CI は「静的な書籍に NFR は無い」「Pages と Actions は既存」なので飛ばす。Operation は「完了 = 公開」なので `deployment-execution` だけを残す。`testStrategy: Minimal` は、ユニットテスト可能なコードが無く検証がビルド・リンク・出典照合で構成されることの反映です。

フロントマターの残りの項目は、あとの章で出てくる仕組みへの入力です。`skeleton: on` は Construction の最初の Bolt を walking skeleton（端から端まで通る最も薄い一片）として単独・ゲート付きで走らせる宣言で、本書のチームルールでも「Bolt 1 は骨格 + 章 1 本 + 検査スクリプト」と定めています（3.8）。`review_cap: advisory` はステージが宣言するレビュアーの検査を助言型（advisory）までに抑える上限で（3.5）、`change_control: relaxed` は承認後に入力が変わっても再承認を開き直さず 1 行の記録で進む設定です。

> **注意** — 本書のワークフローの記録には、`docs-book` を作った compose の提案そのもの（ARS スコア表）は残っていません。監査ログの最初の行 `WORKFLOW_STARTED` の時点で既に `Scope: docs-book` であり、1.1 の質問ファイルも `[scope] Workflow-selected scope: docs-book` から始まっています。つまりこのスコープはワークフロー開始前に用意されていました。読者が自分で `compose` を使ったときには、ゲートに提案が表示され、承認すると同じ形の 2 ファイルが `.claude/` の下に作られます。

## まとめ

- スコープは「どのステージを実行するか」を決める名前つきの設定で、11 の標準スコープが `.claude/scopes/aidlc-<name>.md` と各ステージの `scopes:` からコンパイルされた `scope-grid.json` の EXECUTE / SKIP 表として動く。スコープは Depth（成果物の詳しさ）と Test Strategy（試験の量）の既定値も決め、どちらも `--depth` / `--test-strategy` やゲートで上書きできる。
- 短い説明文はキーワードで自動検出され、長い説明文や当たらない説明文は compose の提案に回る。コンポーザーは 5 つのエントロピー成分を見積もって最小の EXECUTE / SKIP 表を提案し、承認・編集・却下のゲートで止まる。承認前には何も書かれない。
- 標準スコープに一致しなければ、承認時に `scopes/aidlc-<name>.md` と `scope-grid.json` の項目が本物のスコープとして書かれる。本書の `docs-book` はその形のカスタムスコープで、静的な書籍に不要なステージ 19 を飛ばし 14 を実行し、理由はスコープファイル自身に書かれている。

## 出典

- [2.8.2] `docs/guide/05-scopes-and-depth.md` § The 11 Core Scopes — 11 スコープがステージ集合・既定 Depth・既定 Change Control を持つこと、各スコープの用途とステージ数
- [2.8.2] `docs/guide/05-scopes-and-depth.md` § Scope Routing Table — スコープの正体が `.claude/scopes/aidlc-<name>.md` と各ステージの `scopes:` フロントマターで、`scope-grid.json` にコンパイルされること、EXECUTE 数・Depth・Test Strategy の表、確認行がコンパイル済みの表から計算されること、`aidlc engine gen scope-table`、`AWS_AIDLC_DEFAULT_SCOPE`
- [2.8.2] `docs/guide/05-scopes-and-depth.md` § Stage-by-Scope Matrix — 全 33 ステージの EXECUTE / SKIP 表、Initialization が全スコープで走ること、カスタムスコープの表が `scope-grid.json` にあること
- [2.8.2] `core/scopes/aidlc-bugfix.md` § Why these stages, why skip those — `bugfix` が Ideation を飛ばし reverse-engineering / requirements-analysis / code-generation / build-and-test / deployment-pipeline / deployment-execution を実行する理由
- [2.8.2] `core/scopes/aidlc-bugfix.md` § bugfix scope — Change Control relaxed が「承認後に入力が変わっても再承認を開き直さず 1 行で記録・通知する」ことを意味すること
- [2.8.2] `docs/guide/05-scopes-and-depth.md` § The 3 Depth Levels — Minimal / Standard / Comprehensive の意味と 3 つの上書き方法
- [2.8.2] `docs/guide/05-scopes-and-depth.md` § The 3 Test Strategy Levels — Test Strategy が Depth と独立であること、Minimal / Standard / Comprehensive の目安、`--test-strategy` による上書き
- [2.8.2] `docs/guide/05-scopes-and-depth.md` § Auto-Detection from Freeform Intent — キーワード表、5 語を超える説明が compose の提案に回ること、強いキーワードの例外、語彙的ヒューリスティックであること
- [2.8.2] `docs/guide/05-scopes-and-depth.md` § The Adaptive Composer — 既定が `classic` であること、5 つのエントロピー成分、承認前に何も書かれないこと、標準一致とカスタム表の分岐、2 ファイル（`scopes/aidlc-<name>.md` と `scope-grid.json` の項目）、`/aidlc --scope <name>` で選べること、再コンパイルで消えないこと、`keywords: []`、途中の recompose と `RECOMPOSED`、会話からの認識
- [2.8.2] `docs/reference/03-orchestrator.md` § `/aidlc compose` -- The Adaptive Composer — 読み取り専用の `detect` 走査、`aidlc-graph.ts validate-grid` による検証、ゲートの表示構成、in-flight ではスコープを作らないこと
- [2.8.2] `docs/guide/12-cli-commands.md` § `/aidlc compose` - The adaptive composer — 3 つの呼び方と、承認・編集・却下のゲート
- [2.8.2] `docs/reference/15-stage-definition.md` § `reviewer`, `review_artifact`, `reviewer_max_iterations`, and `review_class` — スコープの `review_cap` がレビューの種別を下げる上限であること
- [runtime] `first/.claude/settings.json` env — `AWS_AIDLC_DEFAULT_SCOPE` が `classic` に設定されていること
- [runtime] `first/.claude/scopes/aidlc-docs-book.md` frontmatter — 抜粋したフロントマター（`depth`、`testStrategy`、`keywords: []`、`skeleton: on`、`review_cap`、`change_control`）
- [runtime] `first/.claude/scopes/aidlc-docs-book.md` § Why these stages, why skip those — 各ステージを残す・飛ばす理由と `testStrategy: Minimal` の理由
- [runtime] `first/.claude/scopes/aidlc-docs-book.md` § Membership — EXECUTE 14 と SKIP 19、`--scope docs-book` の明示指定でのみ選ばれること
- [runtime] `first/.claude/tools/data/scope-grid.json` docs-book — 33 ステージへの EXECUTE / SKIP 割り当て
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Scope Configuration — `Stages to Execute` 14 と `Stages to Skip` 19、Depth Standard、Test Strategy Minimal、Change Control relaxed
- [record] `first/aidlc/spaces/default/memory/team.md` § Walking Skeleton — `docs-book` が `skeleton: on` で Bolt 1 が骨格 + 章 1 本 + 検査スクリプトであること
- [record] `first/aidlc/spaces/default/memory/org.md` § Walking Skeleton — `skeleton: on` / `off` の意味
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` WORKFLOW_STARTED — 開始時点で `Scope: docs-book` であったこと
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/intent-capture-questions.md` § Q8 — 先頭の `[scope] Workflow-selected scope: docs-book` タグと 14/33 ステージの確認設問
