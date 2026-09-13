# Evidence — Practices Discovery（AI-DLC v2 教材 first 版）

> 状態: Step 2 リードドラフト（aidlc-pipeline-deploy-agent）。Greenfield のため `consumes` の上流成果物（reverse-engineering の 6 成果物）は存在せず、証拠は「2.8.2 の一次情報」「本ワークフローの記録」「親リポジトリの実態」の 3 系統から集めた。支援エージェント 3 名の所見（Step 3）とインタビューの決定（Step 4）は Step 5 の統合で本ファイルに追記する。

## 調査した一次情報（AI-DLC 2.8.2）

project.md `## Corrections` の解釈（成果物を書く前に 2.8.2 の一次情報を読み直し、参照パスを記録する）に従い、以下を読んだ。

| 参照先 | 何を確認したか |
| --- | --- |
| クローン `aidlc-workflows` の `CHANGELOG.md` 先頭 | 最新エントリが `[2.8.2] - 2026-09-10`。クローン HEAD は `a0ee441`（タグ未取得、`package.json` の version は `0.0.0`）。2.8.2 より新しいリリースエントリは無い |
| インストール済みランタイム `aidlc --version`（`first/` で実行） | `aidlc 2.8.2 (runtime 2.8.2)` |
| クローン `core/aidlc-common/stages/inception/practices-discovery.md` と `first/.claude/aidlc-common/stages/inception/practices-discovery.md` の `diff` | `{{INVOKE}}` → `aidlc` の置換 4 箇所以外は同一。ステージ定義は 2.8.2 のまま |
| クローン `docs/reference/04-stages/inception.md` § Stage 2.2 | 四成果物の定義（`team-practices.md` は五節・`Methodology` / `Ordering` 必須、`discovered-rules.md` は `ALWAYS` / `NEVER`、`evidence.md`、timestamp）。昇格は `team.md` へ section-replace、`project.md` へ append-under-heading |
| クローン `docs/guide/09-rules-and-the-learning-loop.md`、`docs/reference/08-rule-system.md` | strict-additive の 5 層（org → team → project → phase → stage）。practices-discovery の昇格は org との衝突チェックを走らせず、事後の drift は `--doctor` が advisory で検出 |
| クローン `docs/guide/14-artifacts-reference.md`（190 行目） | 2.2 の成果物一覧と昇格先 |
| `first/.claude/tools/aidlc-state.ts` `handlePracticesPromote`（6597 行付近） | `TEAM_SECTIONS` の五見出しを抽出して置換（節が無ければ既存を温存）。`## Mandated` / `## Forbidden` 配下の空行・`<!--`・`#` 以外の全行を `(affirmed <日付>)` 付きで `project.md` に追記。支援 3 名の `contributions/<agent>.md` と先頭行 `**Collaborator:** <agent>` を再検証 |
| `first/.claude/sensors/aidlc-required-sections.md`、`first/.claude/tools/aidlc-sensor-required-sections.ts`、`aidlc-upstream-coverage.md` | 成果物ごとに H2 が 2 つ以上（advisory・gate 発火）。実装上、`*-timestamp.md` はテンプレート適用からは除外されるが汎用の H2 床からは除外されない（`pass = h2_count >= 2`）。ステージ契約は timestamp を「1 行」と定めるため 1 行のまま書き、ゲートで advisory が出る可能性を受容する（Step 5 で見直し可）。upstream-coverage は `*-timestamp.md` / `*-questions.md` / `memory.md` を除外。本ステージの `consumes` は全て `conditional_on: brownfield` のため Greenfield では未参照でも欠落にならない |
| `first/.claude/knowledge/aidlc-shared/rules-reading.md` | 空テンプレート判定（本文の非空行がすべて `<!--` なら空）と、project → team → org → ハードコード既定のフォールバック |
| `first/.claude/knowledge/aidlc-pipeline-deploy-agent/branching-strategies.md`、`cicd-patterns.md`、`deployment-strategies.md` | トランクベース既定（base `main` / target `main` / squash）、CI ゲート、ロールバック要件 |
| `first/.claude/aidlc-common/protocols/stage-protocol.md` § Template overrides、§ ASCII Diagram Standards | `aidlc/spaces/default/memory/templates/` は存在せず、テンプレート上書きは無し（汎用の H2 ≥ 2 床だけが効く）。図の ASCII 記法規則 |

## 検査したワークフロー記録

| 参照先 | 事実 |
| --- | --- |
| `<record>/aidlc-state.md` | Project Type **Greenfield**、Scope `docs-book`、Depth Standard、Test Strategy Minimal、Change Control relaxed。Current Stage practices-discovery、Next Stage requirements-analysis |
| `aidlc/spaces/default/memory/org.md` | 五節の既定値: トランクベース + squash、`skeleton:` はスコープ依存、test-after + Minimal、on-merge デプロイ + 本番は手動承認、リンタ設定に従う |
| `aidlc/spaces/default/memory/team.md` | 五節すべて空（テンプレートの見出しのみ）。よって org.md は「提案の既定値」であり、チームの事実ではない |
| `aidlc/spaces/default/memory/project.md` | `## Forbidden` 1 件（claude 版の再利用禁止 + 2.8.2 一次情報のみで裏取り）、`## Corrections` 4 件（代理回答と根拠、日本語、毎フェーズの調査・レビューの解釈、章末出典節）。すべて拘束力あり |
| `aidlc/spaces/default/memory/phases/inception.md` | 要件は検証可能に、ADR は代替案 2 つ以上、トレーサビリティ。本ステージの成果物にも適用 |
| `.claude/scopes/aidlc-docs-book.md` | `skeleton: on`、`review_cap: advisory`、`change_control: relaxed`、`testStrategy: Minimal`。「既存の GitHub Actions → GitHub Pages のパイプラインで公開」「ソロ実行」「functional-design で主張→一次資料引用のマップを執筆前にゲート審査」 |
| `<record>/ideation/intent-capture/intent-capture-questions.md` Q9 | 依頼者の指示の原文（逐語）。公開パス、ペルソナ、「調査とレビューは毎フェーズ」「1次情報とコードをもとに間違った情報は取り込まない」「私は一切介入しません」「Pagesへのデプロイまで完了させてください」 |
| `<record>/ideation/intent-capture/intent-statement.md` | SM1（クリーン環境で最初の承認ゲートまで）、SM2（未裏取りの断定ゼロ）、SM3（`/first/` 公開・`honkit build` 成功・リンク全解決） |
| `<record>/ideation/scope-definition/scope-document.md` | In / Out、住み分け（claude 版へはリンク参照のみ）、事実の裏取り方式（章末出典節、別表無し、推定は明示）、毎フェーズの調査とレビュー、build-and-test の 4 検証、最初の Bolt は walking skeleton、期限は本セッション内 |
| `<record>/ideation/scope-definition/intent-backlog.md` | P1 骨格 → P2 現在地 → P3 概念 → P4 仕組み → P5 ハンズオン / P6 ケーススタディ → P7 付録。walking skeleton = P1 + P2 の最小版 |

## 検査した親リポジトリの実態

すべて `/home/user/learn-AI-DLCv2` で実行。

| コマンド / ファイル | 観察 |
| --- | --- |
| `git log --oneline -15`、`git log --format='%h %an %s'` | 9 コミット。`init`（y-ohgi）→ `docs:`（claude 版追加）→ `Merge pull request #1`（y-ohgi、GitHub 上でマージ）→ `chore:`（2 冊構成へ再編 + ランタイム導入）→ `aidlc:` ×5（ワークフロー記録）。種別プレフィックス `docs:` / `chore:` / `aidlc:` が一貫 |
| `git branch -a`、`git status -sb` | ローカルは `claude/ai-dlcv2-honkit-pages-1ylg3o`（= `origin/` 同名と同期）。`main` と `origin/main` あり |
| `git rev-list --left-right --count origin/main...HEAD` | `0 6`: HEAD は `origin/main` から 6 コミット先行、遅れ無し。merge-base は `2d2db5a`（PR #1 のマージコミット） |
| `git cat-file -p 2d2db5a` | 親 2 つ（`fc626b8`、`dca89ea`）。PR #1 は **マージコミット** で取り込まれた（squash ではない）。committer は GitHub |
| `git ls-tree origin/main --name-only`、`git show origin/main:.github/workflows/deploy.yml`、`git show origin/main:package.json` | `main` の現行公開物は **単一ブック**（ルート直下に `SUMMARY.md` / `book.json` / `docs/`、`honkit build . _book`、`_book` を Pages にアップロード）。ランディングページも `/claude/` も `/first/` もまだ `main` に無い |
| `.github/workflows/deploy.yml`（現ブランチ） | トリガー: `push: main`、`pull_request: main`、`workflow_dispatch`。`build` ジョブ: Node 22、`npm ci`、`npm run build`、PR 以外で `actions/upload-pages-artifact@v3`（`_site`）。`deploy` ジョブ: PR 以外、`environment: github-pages`、`actions/deploy-pages@v4`。`concurrency: group: pages, cancel-in-progress: false` |
| `scripts/build-site.mjs` | `_site/` を消して作り直し、`claude/` と `first/` をそれぞれ `npx honkit build` で `_site/<dir>` へ。`<dir>/SUMMARY.md` が無ければ **警告してスキップ**。`site/` をコピーし `.nojekyll` を置く |
| `package.json`、`node_modules/honkit/package.json` | `honkit ^6.0.4`、実際にインストールされているのは 6.2.2。scripts: `build`、`build:claude`、`build:first`、`serve:claude`、`serve:first`。lint / format の設定と依存は無し |
| `first/` 直下 | `.bookignore`（`.claude`、`aidlc`、`node_modules`、`.gitignore`、`.mcp.json`、`CLAUDE.md`、`aidlc.settings*.json` を除外）、`.gitignore`（AI-DLC 生成）、`.claude/`、`aidlc/` のみ。`README.md` / `SUMMARY.md` / `book.json` / `docs/` は未作成 |
| `claude/book.json`、`claude/SUMMARY.md`、`claude/docs/**` | `language: "ja"`、`structure.readme` / `structure.summary`。目次は部を `##`、章を「1.1 …」の番号付きタイトル + `docs/NN-部/NN-章.md` への相対リンク。章末に `## この章のまとめ`。章本文に章間の相対 `.md` リンクは見つからず（外部 URL のみ）。README は `../first/` への相対リンクを使用 |
| `site/index.html` | `./first/` への導線（「first 版を読む」）が既にある。`main` へ取り込まれるまでは公開されず、取り込み直後は first 版の骨格が無ければ `/first/` は 404 になる |
| `.gitignore`（ルート） | `node_modules/`、`_site/`、`_book/` を除外 |
| `gh` | この環境に無い（`command not found`）。PR の作成・マージは GitHub の MCP ツールまたは Web UI が必要 |

## 推論（証拠から導いた提案）

- **Way of Working**: 公開トリガーが `main` への push のみ、作業ブランチが 1 本、PR #1 → `main` の実績があることから、トランクベース（`main`）+ PR 取り込みが実態に合う。ただしセッションブランチが `main` から 6 コミット先行し、`main` には first 版の公開経路が無いため、Bolt の base/target を org.md どおり `main` にすると骨格・ランタイムを持たないツリーから分岐してしまう。セッションブランチを Bolt の base/target とする案と、先に `main` へ取り込む案を並記した（W-1）。マージ方式は org.md の squash を提案するが、依頼者の唯一の実績はマージコミット（W-2）。
- **Walking Skeleton**: スコープが `skeleton: on` を明示し、scope-document / intent-backlog が「骨格 + 1 章を公開経路まで」と定めている。`build-site.mjs` は `first/SUMMARY.md` が無い間ビルドをスキップするので、骨格の投入がそのまま公開経路の初回起動になる。公開 URL の確認は `main` 取り込み後にしかできない（S-1）。
- **Testing Posture**: ユニットテスト対象のコードが無く、検証は build / リンク / 出典 / ハンズオン再現の 4 種。いずれも執筆後に走るため test-after。functional-design での主張→出典の事前列挙は仕様であってテストではないと解釈した（T-1）。リンク検査は `honkit build` では行われない（未解決リンクでもビルドは通る）ため別手段が要る（T-2）。
- **Deployment**: 既存ワークフローがそのまま CD であり、PR ビルドがステージング相当、`main` 取り込みが本番ゲート。依頼者は介入しないため本番ゲートの実行者はコンダクター（代理）になる（D-1）。ロールバックは revert のみ。
- **Code Style**: リポジトリに lint 設定が無いため org.md の「リンタ設定に従う」は空振りする。姉妹ブックの HonKit 構成・日本語表記・相対リンクを「体裁の統一」として提案し、文章の再利用は project.md `## Forbidden` に従って行わない。章末「出典」節は project.md `## Corrections` により必須。

## 未解決の論点（インタビューで確定）

| ID | 領域 | 論点 | 証拠 | 提案 |
| --- | --- | --- | --- | --- |
| W-1 | Way of Working | Construction の Bolt ワークツリーの base/target。(a) セッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` を base/target にし、最後に 1 本の PR で `main` へ。(b) 先にセッションブランチを `main` へ取り込み、以降は org.md どおり `main` を base/target にして Bolt ごとに PR → `main` → 公開 | `origin/main` から 6 コミット先行、`main` に公開経路無し。org.md は base/target `main` | (a) を既定候補。ただし (a) を肯定すると org.md「worktree base branch is `main` / merge target is `main`」と食い違う狭い記述になり、strict-additive 上は `--doctor` の rule-drift に advisory として現れる。(b) は walking skeleton を「公開まで」で証明でき org.md と整合するが、`main` への取り込み権限が前提 |
| W-2 | Way of Working | `main` への取り込み方式: squash か マージコミットか | PR #1 はマージコミット。org.md は squash | squash（履歴 1:1）を提案。依頼者の慣習と異なるため確認 |
| S-1 | Walking Skeleton | Bolt 1 の完了条件を「ローカル + PR ビルド成功」までとするか「`/first/` HTTP 200」までとするか | 公開は `main` 取り込み後のみ。`site/index.html` は既に `/first/` へ導線あり | W-1 の選択に連動。(a) なら PR ビルド成功まで、(b) なら HTTP 200 まで |
| S-2 | Walking Skeleton | Bolt 1 後のラダー選択: gate every Bolt か continue autonomously か | project.md `## Corrections`（各ゲートで代理精読）。依頼者は介入しない | gate every Bolt（コンダクターが代理で承認） |
| T-1 | Testing Posture | Methodology を test-after とするか、事前の主張→出典列挙を含めて custom とするか | scope docs-book「執筆前にゲート審査」、scope-document Q4 | test-after（事前列挙は仕様） |
| T-2 | Testing Posture | リンク検査の手段（`_site/first/**/*.html` の内部 href 解決 + 外部 URL の HTTP 確認）と置き場所（親リポジトリ `scripts/` か `first/` 内か） | `honkit build` はリンクを検査しない。リポジトリに検査スクリプト無し | 親リポジトリ `scripts/check-links.mjs` を build-and-test で実行（依存追加なし） |
| T-3 | Testing Posture | SM1 のクリーン環境再現をどう実施するか（一時ディレクトリ + `install.sh --version 2.8.2` + `aidlc config` + `aidlc doctor` + 最初のゲートまで）。外向き HTTPS はプロキシ経由、モデル呼び出しを要する部分の扱い | intent-statement SM1、scope-document Q10 | build-and-test で手順を機械的に追い、ゲート到達は `aidlc engine orchestrate next` の run-stage ディレクティブ発行までを確認する案 |
| D-1 | Deployment | `main` への取り込み（本番ゲート）の実行者と手段、ブランチ保護の有無 | `gh` 無し、GitHub MCP ツールあり、保護設定は未確認 | コンダクターが代理で PR を作成・マージ。保護があれば依頼者へ報告して停止 |
| D-2 | Deployment | バージョン付け・タグの要否 | 実績無し。教材は継続公開 | 行わない |
| C-1 | Code Style | 章末「出典」節のパス書式（リポジトリ相対パスのみ / 2.8.2 固定の GitHub URL 併記）と、クローンとインストール済みランタイムが食い違う場合の優先順位 | クローンはタグ未取得（HEAD `a0ee441`）、インストール済みは 2.8.2 | 相対パスを主、URL は任意。食い違いはインストール済み `first/.claude/` を正とする |
| C-2 | Code Style | 図の記法（Mermaid を使わず ASCII / 表） | HonKit 標準テーマに Mermaid 描画無し。stage-protocol の ASCII 規則 | ASCII 記法または表 |
| C-3 | Code Style | markdownlint 等の導入 | リポジトリに lint 設定無し。CI は `honkit build` のみ | 導入しない（`honkit build` + リンク検査 + 出典検査で足りる） |
| C-4 | Code Style | 章テンプレートの見出し（`## この章のまとめ`、`## 出典`）と `SUMMARY.md` の章番号体裁 | claude 版の体裁。文章は再利用しない | 体裁のみ統一 |

## 参加者ごとの所見

- **aidlc-pipeline-deploy-agent（リード）**: 本ファイルの全節。Step 2 時点の所見であり、支援エージェントの所見は未受領。
- **aidlc-quality-agent / aidlc-developer-agent / aidlc-devsecops-agent**: Step 3 で `contributions/<agent>.md` に独立に記入。Step 5 の統合時に要約を本節へ追記する。
- **インタビューの決定（Step 4）**: `practices-discovery-questions.md` に記録し、Step 5 で本節へ反映する。
