# 3.8 Construction の進め方

ここまでの章はフェーズを問わず共通する仕組みを扱ってきました。この章では Construction、つまり実際に作る段階に固有の進め方を見ます。登場する言葉は Unit、Bolt、walking skeleton、ラダープロンプト、ワークツリーの 5 つで、いずれも Inception の最後の 2 ステージが作る計画から始まります。本書自身の計画を例に関係を説明します。

## この章で学ぶこと

- Units Generation と Delivery Planning がそれぞれ何を作り、Unit と Bolt がどう違うかを説明できる。
- Bolt 1 = walking skeleton とラダープロンプトの選択肢、Bolt のワークツリーと統合の関係を説明できる。
- Code Generation の Plan Approval と Build and Test が、Construction の中でどこで人を止めるかを説明できる。

## Units Generation — 何が何に依存するか

**Unit**（Unit of Work）とは、Construction で設計・実装する作業のまとまりで、Inception の units-generation ステージが決めます。リードは `aidlc-architect-agent` で、4 つの成果物を作ります。

| 成果物 | 内容 |
| --- | --- |
| `unit-of-work.md` | Unit の定義。`U{n}` の ID と `u{n}-{description}` のディレクトリ名、責務、複雑さ（S/M/L/XL）、種別 `kind`（`service` / `spec` / `ui` / `packaging` / `library`） |
| `unit-of-work-dependency.md` | Unit 間の依存の有向グラフ（DAG）、統合点、並行作業の機会。機械が読む `yaml` の辺ブロックが必須 |
| `unit-of-work-story-map.md` | ユーザーストーリー（または FR）と Unit の対応 |
| `traceability.json` | 上流 ID ごとの網羅状況（`OK` / `GAP`）と対応先 |

このステージの制約は、**トポロジー（何が何に依存できるか）だけを書き、作る順序や critical path は決めない**ことです。順序は経済的な判断で、次の delivery-planning が決めます。`kind` はその Unit に要る設計文書を決め（`spec` にスケーラビリティ文書は要りません）、`yaml` の辺ブロックは並行実行の単位（バッチ）を計算する入力で、`required-sections` センサーがゲートで検査します。

本書の記録から辺ブロックの前半を抜粋します。章を書く単位が Unit で、第 3 部（`u5-mechanics`）は第 2 部（`u4-concepts`）の用語に依存します。

```yaml
units:
  - name: u1-book-shell
    kind: packaging
    depends_on: []
  - name: u2-build-and-check
    kind: library
    depends_on: [u1-book-shell]
  - name: u4-concepts
    kind: spec
    depends_on: [u1-book-shell]
  - name: u5-mechanics
    kind: spec
    depends_on: [u1-book-shell, u4-concepts]
```

## Delivery Planning — どの順で出荷するか

**Bolt** とは、1 つ以上の依存で結ばれた Unit をまとめて 1 回で設計・実装・検証し、「動く状態」で終える Construction の反復単位です（原典の用語で、スプリントに似た区切りです）。Inception の最後のステージ delivery-planning（リード `aidlc-delivery-agent`、支援 `aidlc-architect-agent`）が、units-generation の DAG を入力に Bolt の列を決め、5 つの成果物を作ります。

- `bolt-plan.md` — 順序つきの Bolt の列。各 Bolt に含む Unit、walking skeleton の印、完了条件（Definition of Done）、「これを出荷すると何が分かるか」という仮説、デモ。
- `team-allocation.md` — Bolt と担当の対応。
- `risk-and-sequencing-rationale.md` — その順序にした理由（リスク優先、価値優先など）。
- `external-dependency-map.md` — 外部依存（外部 API、承認のリードタイムなど）と、それを消費する Bolt。
- `delivery-planning-questions.md` — このステージの質問と回答。

本書の `bolt-plan.md` の表から、最初の 2 行を短くして抜粋します。

| Bolt | 含む Unit | 種別 | 完了条件（要約） | 検証する仮説 |
| --- | --- | --- | --- | --- |
| Bolt 1 | U1 骨格と規約、U2 ビルドと検査、U3 第 1 部 | walking skeleton | `npm run build` が終了コード 0 で `_site/first/index.html` が存在。`npm run check:first` の blocking 0 件。PR 上の `build` ジョブが成功 | HonKit の骨格 + 章 1 本 + 検査スクリプトで、公開経路の手前まで機械的に通せる |
| Bolt 2 | U4 第 2 部 概念 | 通常 | 2.1・2.2 が章テンプレートに従い、出典行がすべて実在。全章の検査を再実行して blocking 0 件 | 2.8.2 の一次情報だけで AI-DLC の位置づけと用語を説明できる |

Unit は「作るもの」の境界、Bolt は「出荷する」区切りで、1 つの Bolt に複数の Unit が入ることがあります（Bolt 1 に U1〜U3）。また、2.8.2 のエンジンは `bolt-plan.md` を Unit のまとめ方や歩く順序の入力には **使いません**。実行時のバッチは `unit-of-work-dependency.md` の DAG から計算され、`bolt-plan.md` は人が読む計画です。

## 歩く順序 — stage-major と unit-major

Construction には Unit ごとに走る設計ステージ（functional-design、nfr-requirements、nfr-design、infrastructure-design）と code-generation があります。これらを「どの順で歩くか」には 2 通りあります。

- **stage-major**（既定） — 1 つの設計ステージをすべての Unit について実行し、次の設計ステージへ進み、最後に code-generation をすべての Unit について実行する。
- **unit-major**（任意） — 1 つの Unit について 4 つの設計ステージと code-generation を続けて実行し、その Unit を **作り終えてから** 次の Unit に進む。最初に動くコードが「全 Unit の設計の後」ではなく「1 つの Unit の設計の後」に得られる。

delivery-planning は、承認された `bolt-plan.md` が「Unit を 1 つずつ完成させる」「walking skeleton を先に」と読める場合にだけ `aidlc engine state set-construction-iteration unit-major` を実行し、状態ファイルの `## Runtime State` に `Construction Iteration: unit-major` を記録します。unit-major でもゲートの数と仕組みは変わりませんが、各ステージのゲートは Unit の設計と実装がそろった後にまとめて現れます。本書の状態ファイルは `Construction Iteration: unit-major` で、Bolt 1 の Unit `u1-book-shell` から歩き始めています。

## Bolt 1 = walking skeleton とラダープロンプト

**walking skeleton** とは、計画上の最初の Bolt で、すべての統合点を一度通す最も薄い一本通しのことです。常にゲート付きで対話的に実行されます。skeleton を実行するかどうかは、`org.md` → `team.md` → `project.md` の `## Walking Skeleton` 節を読んで最も具体的な記述が決め、「スコープ次第」ならスコープ定義の `skeleton:` の値を使います。本書のスコープ `docs-book` は `skeleton: on` で、`team.md` は walking skeleton の内容を「HonKit の骨格 + 章 1 本 + 検査スクリプト」と定めています。

walking skeleton のゲートが承認された直後に、エンジンは一度だけ **ラダープロンプト**（ladder prompt）を出します。

```text
The walking skeleton shipped. How should the remaining Bolts run?
  - Continue autonomously  — 残りを止まらずに作る。失敗したときは止まって尋ねる
  - Gate every Bolt        — Bolt（または並行バッチ）ごとに承認を求める
```

答えは状態ファイルに `Construction Autonomy Mode: autonomous` か `gated` として記録されます。`autonomous` は残りの Construction ステージのゲートを省き（Code Generation の失敗時の halt-and-ask と Build and Test の差し戻しは除く）、`gated` はステージごとのゲートを保ちます。この選択は人の新しい入力を要求します。本書の `team.md` は「ラダープロンプトでは gate every Bolt を選ぶ」と定めています。

## Bolt のワークツリーと統合

**ワークツリー**（worktree）とは、git が 1 つのリポジトリに対して作る別の作業ディレクトリで、AI-DLC では Bolt が自律モードで並行に走るときの隔離の手段です。各 Bolt は `bolt-<slug>` ブランチのワークツリーで実行され、ワークツリーもブランチも Bolt そのものではなく、走らせる場所です。`org.md` の既定では、ワークツリーの基点と統合先は `main` で、Bolt のブランチは **squash マージ** で戻されます。1 つの Bolt がトランク上の 1 コミットになり、`main` の履歴が Bolt の列と 1 対 1 に対応します。中間コミットが消えることは監査ログが全経緯を保持するので受け入れる、と org.md は述べます。本書の `team.md` はこれを「基点と統合先はセッションブランチ、Bolt ごとに squash で戻す」と特殊化しています（理由は 5.1 で扱います）。

Build and Test（3.6）と CI Pipeline（3.7）は Bolt ごとには走らず、すべての Bolt が完了した後に 1 回だけ走ります。

## Code Generation の Plan Approval

Construction の実装ステージ code-generation（リード `aidlc-developer-agent`、subagent 形態）には、承認ゲートとは別の、もう 1 つの人の判断地点があります。Step 3 の **Plan Approval** です。コンダクターは実装計画 `code-generation-plan.md`（テストの契約を含む）と `unit-test-instructions.md` を書き、`code-generation-questions.md` に「この計画を承認するか」という質問を、計画の内容から計算したハッシュ（`[Approval Fingerprint]`）とともに記録します。選択肢は **Approve Plan** と **Request Changes** の 2 つで、**人が「Approve Plan」を選ぶまでコードの生成は始まりません**。ステージ定義はこれを「あらゆる実行モードでの必須の停止」と呼び、自律モードの Construction でも例外はありません。計画や手順書を承認後に 1 バイトでも変えれば、ハッシュが変わって承認が再び必要になります。

> **注意** — 本書の制作ワークフローは、この停止に実際に突き当たっています。3.6 で述べたようにフックが無いセッションでは人の入力が記録されず、Plan Approval の受領は拒否されました。状態ファイルの `## Runtime State` には `Unit State: paused` と、その理由「Plan Approval の受領は人がハーネスに入力した回答をフックが記録して初めて成立し、無人セッションでは得られない」が記録されています。本書の執筆はエンジンの生成権限の外で計画どおりに行い、逸脱として記録に残しました。詳細は 5.3 で扱います。

## Build and Test

すべての Unit の code-generation が終わると、Build and Test（リード `aidlc-quality-agent`、支援 `aidlc-devsecops-agent`）が 1 回走ります。ビルド手順書と各種テスト手順書を作り、Step 9 で実際にビルドとテストを実行します。単体テストのコマンドは各 Unit の `unit-test-instructions.md` から集めて重複を除き、1 回ずつ実行します。結果は `test-results.md` に、ビルドの成否、テストの合計・成功・失敗・スキップ、失敗の詳細、そして **Target Verification Matrix**（品質目標ごとの実測値と `Met` / `Not Met` / `Unverified` の判定）として書かれます。

ビルドかテストのコマンドが失敗するか、どれか 1 つの目標が `Not Met` か `Unverified` なら、Build and Test は失敗です。本番相当の環境が要る検査を後段に委ねられるのは、後のステージがその検査を明示的に所有するときだけです。そして「品質目標を弱める・緩める・無効にすることは、決して受け入れられる修正ではない」とステージ定義は書いています。本書の `team.md` の「検査項目を弱めたり省いたりしない」は、この規則の言い直しです。

## まとめ

- Units Generation は Unit の定義と依存の DAG（`yaml` の辺ブロック）を作り順序は決めない。Delivery Planning は DAG の上に Bolt の列（含む Unit、完了条件、仮説）を決める。Unit は作るものの境界、Bolt は出荷の区切りで、エンジンは Bolt plan ではなく DAG からバッチを計算する。歩く順序は既定の stage-major と任意の unit-major がある。
- Bolt 1 は walking skeleton（最も薄い一本通し）として常にゲート付きで走り、承認直後のラダープロンプトで「Continue autonomously」か「Gate every Bolt」を人が選ぶ。自律モードの Bolt は `bolt-<slug>` ブランチのワークツリーで走り、squash マージで統合先の 1 コミットになる。
- Code Generation の Plan Approval は、人が「Approve Plan」を選ぶまで生成を始めない必須の停止で、自律モードでも省かれない。Build and Test は全 Bolt の後に 1 回走り、目標ごとに `Met` / `Not Met` / `Unverified` を判定し、目標を弱めることを修正として認めない。

## 出典

- [2.8.2] `core/aidlc-common/stages/inception/units-generation.md` § Units Generation — 2.7 がトポロジーだけを作り、順序と critical path は 2.9 が決めること
- [2.8.2] `core/aidlc-common/stages/inception/units-generation.md` § Step 5: Execute Plan — Generate Unit Artifacts — 4 成果物の内容、`U{n}` / `u{n}-{description}`、`kind` の 5 値と意味、`yaml` 辺ブロックが必須でバッチ計算の入力になり `required-sections` センサーが検査すること
- [2.8.2] `core/aidlc-common/stages/inception/delivery-planning.md` § Step 4: Generate Artifacts — 4 成果物の内容（`bolt-plan.md` の各 Bolt の項目を含む）と、初出の用語に一文の説明を添える規則
- [2.8.2] `core/aidlc-common/stages/inception/delivery-planning.md` § Step 6: Completion Handoff — Construction iteration の分類、`set-construction-iteration unit-major`、既定が stage-major であること、unit-major でもゲートの数は変わらず遅れて現れること
- [2.8.2] `core/aidlc-common/stages/inception/delivery-planning.md` § Step 2: Generate Clarifying Questions — Bolt の定義と、エンジンが `bolt-plan.md` を Unit のまとめ方や歩く順序に使わず、バッチが `unit-of-work-dependency.md` から来ること
- [2.8.2] `docs/guide/glossary.md` § Bolt — Bolt が Unit・ワークツリー・swarm と別のものであること、Build and Test と CI Pipeline が全 Bolt の後に 1 回走ること
- [2.8.2] `docs/guide/glossary.md` § Walking skeleton — 最も薄い一本通し、常にゲート付き、承認直後にラダープロンプト
- [2.8.2] `docs/guide/glossary.md` § Ladder prompt — 選択肢「continue autonomously」「gate every Bolt」と autonomy mode としての記録
- [2.8.2] `docs/guide/glossary.md` § Worktree — 自律 swarm モードで Bolt が走るときの git の隔離、`bolt-<slug>` ブランチ
- [2.8.2] `docs/guide/glossary.md` § Walk order — stage-major 既定と `Construction Iteration: unit-major`、skeleton の stance が `org.md` → `team.md` → `project.md` で解決されること
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-construction.md` § Construction Bolt gates (walking skeleton + ladder + halt-and-ask) — walking skeleton のゲート、ラダープロンプトの文言と 2 選択肢、`Construction Autonomy Mode` の記録、autonomous が省くゲートと省かないもの、ラダーの答えが人の新しい入力を要すること
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-construction.md` § Claude Code — `gate: "unresolved"` のときの stance 分類（`org.md` → `team.md` → `project.md`、scope-dependent ならスコープの `skeleton:`）
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-construction.md` Unit-major iteration — stage-major と unit-major の歩き方の違い、最初のコードが 1 Unit の設計の後に得られること、Plan Approval が Unit ごとに停止すること
- [2.8.2] `core/aidlc-common/stages/construction/code-generation.md` § Step 3: Plan Approval — `code-generation-questions.md` の Plan Approval、`[Approval Fingerprint]`、選択肢 Approve Plan / Request Changes、承認後の変更で再承認が要ること
- [2.8.2] `core/aidlc-common/stages/construction/code-generation.md` § Code Generation Complete — Plan Approval が全実行モードでの必須の停止であり、人が Approve Plan を選ぶ前に生成を始めないこと
- [2.8.2] `core/aidlc-common/stages/construction/build-and-test.md` § Build and Test — リードと支援、全 Unit の後に 1 回走ること、成果物一覧
- [2.8.2] `core/aidlc-common/stages/construction/build-and-test.md` § Step 9: Execute Build and Tests — 単体テストの重複除去、`test-results.md` の内容、Target Verification Matrix の `Met` / `Not Met` / `Unverified`、失敗の定義、後段委譲の条件、目標を弱めることを修正として認めないこと
- [2.8.2] `docs/guide/04-phases-and-stages.md` § Phase 3: Construction — Construction のステージ構成
- [record] `first/aidlc/spaces/default/memory/org.md` § Way of Working — ワークツリーの基点と統合先が `main`、Bolt ブランチの squash マージ、Bolt = トランク上の 1 コミット、中間コミットの喪失を監査ログで補うこと
- [record] `first/aidlc/spaces/default/memory/org.md` § Walking Skeleton — `skeleton: on` / `off` の扱いとラダープロンプトの 2 選択肢
- [runtime] `first/.claude/scopes/aidlc-docs-book.md` `skeleton: on` — スコープ `docs-book` が walking skeleton を宣言していること
- [record] `first/aidlc/spaces/default/memory/team.md` § Walking Skeleton — `docs-book` が `skeleton: on` であること、walking skeleton の内容、ラダーで gate every Bolt を選ぶこと
- [record] `first/aidlc/spaces/default/memory/team.md` § Way of Working — 基点と統合先をセッションブランチとし Bolt ごとに squash で戻す特殊化
- [record] `first/aidlc/spaces/default/memory/team.md` § Testing Posture — 「検査項目を弱めたり省いたりしない」
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/units-generation/unit-of-work-dependency.md` § 依存関係 — 抜粋した `yaml` 辺ブロック
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/delivery-planning/bolt-plan.md` § Bolt の列 — 抜粋した Bolt 1・Bolt 2 の行
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Runtime State — `Construction Iteration: unit-major`、`Active Unit: u1-book-shell`、`Unit State: paused` とその理由
