# Evidence — Practices Discovery（AI-DLC v2 教材 first 版）

> 状態: Step 5 統合版（aidlc-pipeline-deploy-agent）。Greenfield のため `consumes` の上流成果物（reverse-engineering の 6 成果物）は存在せず、証拠は「AI-DLC 2.8.2 の一次情報」「本ワークフローの記録」「親リポジトリの実態」の 3 系統から集めた。Step 2 のリード調査に、Step 3 の支援 3 名（quality / developer / devsecops）の所見と Step 4 のインタビュー決定（Q1〜Q14、全問 A）を統合した。

## 調査した一次情報（AI-DLC 2.8.2）

project.md `## Corrections` の解釈（成果物を書く前に 2.8.2 の一次情報を読み直し、参照パスを記録する）に従い、以下を読んだ。クローンは `scratchpad/aidlc-workflows`、統合時点でタグ `v2.8.2`（commit `355903d`）をチェックアウト済み。

| 参照先 | 何を確認したか |
| --- | --- |
| クローンの `git describe --tags`、`git rev-parse` | 統合時点で `v2.8.2` = `355903d`。リードが Step 2 で参照した HEAD `a0ee441` はタグより進んでおり（`git diff --stat 355903d a0ee441`: 全体 103 ファイル、`docs/` + `core/` で 39 ファイル、+3839 / -310 行）、2.8.2 の一次情報としては使えない。以降の照合先はタグの木に固定した |
| クローン `CHANGELOG.md` `[2.8.2] - 2026-09-10` | 「**Upgrade:** `aidlc update`, or `install.sh --version 2.8.2`」の記述。`install.sh` の `--version` フラグの裏取り（devsecops の「未裏取り」指摘への回答） |
| クローン `scripts/install.sh`（タグ `v2.8.2`） | usage 行 `Usage: install.sh [--version <x.y.z\|...>] [--from <dir>] [--offline] [--profile <startup-file>] [--json\|--quiet] [--no-color] [--yes]`。`--version` は実在するフラグ |
| クローン `docs/guide/18-install-and-lifecycle.md`（タグ `v2.8.2`） | 実在を `git cat-file -e` で確認。ハンズオン章のインストール手順の出典候補 |
| インストール済みランタイム `aidlc --version`（`first/` で実行） | `aidlc 2.8.2 (runtime 2.8.2)` |
| インストール済み `aidlc config --help` | 「Every interactive question has an equivalent flag for non-interactive use.」、`--yes` フラグ。SM1 合格線 (3) の非対話実行の裏取り |
| `first/.claude/tools/aidlc-state.ts` とタグ `v2.8.2` の `core/tools/aidlc-state.ts` の `diff` | 同一（0 行差）。`first/.claude/` はタグ `v2.8.2` の投影である（developer の確認をリードも再現） |
| `first/.claude/aidlc-common/stages/inception/practices-discovery.md` とタグの同名ファイルの `diff` | `{{INVOKE}}` → `aidlc` の置換以外は同一。ステージ定義は 2.8.2 のまま |
| クローン `docs/reference/04-stages/inception.md` § Stage 2.2 | 四成果物の定義（`team-practices.md` は五節・`Methodology` / `Ordering` 必須、`discovered-rules.md` は `ALWAYS` / `NEVER`、`evidence.md`、timestamp）。昇格は `team.md` へ section-replace、`project.md` へ append-under-heading |
| クローン `docs/guide/09-rules-and-the-learning-loop.md`、`docs/reference/08-rule-system.md` | strict-additive の 5 層（org → team → project → phase → stage）。practices-discovery の昇格は org との衝突チェックを走らせず、事後の drift は `--doctor` が advisory で検出 |
| クローン `docs/guide/14-artifacts-reference.md` | 2.2 の成果物一覧と昇格先 |
| `first/.claude/tools/aidlc-state.ts` `handlePracticesPromote` | `TEAM_SECTIONS` の五見出しを抽出して置換（節が無ければ既存を温存）。`## Mandated` / `## Forbidden` 配下の空行・`<!--`・`#` 以外の全行を `(affirmed <日付>)` 付きで `project.md` に追記。支援 3 名の `contributions/<agent>.md` と先頭行 `**Collaborator:** <agent>` を再検証 |
| `first/.claude/tools/aidlc-testing-posture.ts` `mixedOrdering` | Ordering 文に「実装前」系と「実装後」系の英語語句が混在すると `custom` に読み替える判定がある（quality の指摘）。本プロジェクトの Ordering は日本語 1 文で、英語の before / after 語を混在させない |
| `first/.claude/sensors/aidlc-required-sections.md`、`first/.claude/tools/aidlc-sensor-required-sections.ts`、`aidlc-upstream-coverage.md` | 成果物ごとに H2 が 2 つ以上（advisory・gate 発火）。実装上、`*-timestamp.md` はテンプレート適用からは除外されるが汎用の H2 床からは除外されない（`pass = h2_count >= 2`）。ステージ契約は timestamp を「1 行」と定めるため 1 行のまま書き、ゲートで advisory が出る可能性を受容する。upstream-coverage は `*-timestamp.md` / `*-questions.md` / `memory.md` を除外。本ステージの `consumes` は全て `conditional_on: brownfield` のため Greenfield では未参照でも欠落にならない |
| `first/.claude/knowledge/aidlc-shared/rules-reading.md` | 空テンプレート判定と、project → team → org → ハードコード既定のフォールバック |
| `first/.claude/knowledge/aidlc-pipeline-deploy-agent/branching-strategies.md`、`cicd-patterns.md`、`deployment-strategies.md` | トランクベース既定（base `main` / target `main` / squash）、CI ゲート、ロールバック要件 |
| `first/.claude/aidlc-common/protocols/stage-protocol.md` § Template overrides、§ ASCII Diagram Standards | `aidlc/spaces/default/memory/templates/` は存在せず、テンプレート上書きは無し。図の ASCII 記法規則（許可文字 `+ - \| ^ v < > / \`、Unicode 罫線禁止、各行同じ文字数） |

## 検査したワークフロー記録

| 参照先 | 事実 |
| --- | --- |
| `<record>/aidlc-state.md` | Project Type **Greenfield**、Scope `docs-book`、Depth Standard、Test Strategy Minimal、Change Control relaxed。Current Stage practices-discovery、Next Stage requirements-analysis |
| `aidlc/spaces/default/memory/org.md` | 五節の既定値: トランクベース + squash、`skeleton:` はスコープ依存、test-after + Minimal、on-merge デプロイ + 本番は手動承認、リンタ設定に従う |
| `aidlc/spaces/default/memory/team.md` | 五節すべて空（テンプレートの見出しのみ）。よって org.md は「提案の既定値」であり、チームの事実ではない |
| `aidlc/spaces/default/memory/project.md` | `## Forbidden` 1 件（claude 版の再利用禁止 + 2.8.2 一次情報のみで裏取り）、`## Corrections` 4 件（代理回答と根拠、日本語、毎フェーズの調査・レビューの解釈、章末出典節）。すべて拘束力あり |
| `aidlc/spaces/default/memory/phases/inception.md` | 要件は検証可能に、ADR は代替案 2 つ以上、トレーサビリティ。章の学習目標（`## この章で学ぶこと`）の根拠 |
| `.claude/scopes/aidlc-docs-book.md` | `skeleton: on`、`review_cap: advisory`、`change_control: relaxed`、`testStrategy: Minimal`。「既存の GitHub Actions → GitHub Pages のパイプラインで公開」「ソロ実行」「functional-design で主張→一次資料引用のマップを執筆前にゲート審査」「practices-discovery: 文体・引用ルール・章テンプレ・事実確認/リンク確認の姿勢」 |
| `<record>/ideation/intent-capture/intent-capture-questions.md` Q9 | 依頼者の指示の原文（逐語）。公開パス、ペルソナ、「調査とレビューは毎フェーズ」「1次情報とコードをもとに間違った情報は取り込まない」「私は一切介入しません」「Pagesへのデプロイまで完了させてください」 |
| `<record>/ideation/intent-capture/intent-statement.md` | SM1（クリーン環境で最初の承認ゲートまで）、SM2（未裏取りの断定ゼロ）、SM3（`/first/` 公開・`honkit build` 成功・リンク全解決） |
| `<record>/ideation/scope-definition/scope-document.md` | In / Out、住み分け（claude 版へはリンク参照のみ）、事実の裏取り方式（章末出典節、別表無し、推定は明示）、毎フェーズの調査とレビュー、build-and-test の 4 検証、最初の Bolt は walking skeleton、期限は本セッション内 |
| `<record>/ideation/scope-definition/intent-backlog.md` | P1 骨格 → P2 現在地 → P3 概念 → P4 仕組み → P5 ハンズオン / P6 ケーススタディ → P7 付録 / P8 導入・比較（Could）。walking skeleton = P1 + P2 の最小版。ディレクトリ命名の入力 |
| `<record>/inception/practices-discovery/practices-discovery-questions.md` | Q1〜Q14 全問 A、各設問末尾に根拠、Consolidated Summary Confirmation = Looks correct |

## 検査した親リポジトリの実態

すべて `/home/user/learn-AI-DLCv2` で実行。リード（Step 2）の観察に、支援 3 名の実測（寄稿から取り込み）を加えた。

| コマンド / ファイル | 観察 | 出所 |
| --- | --- | --- |
| `git log --oneline`、`git log --format='%h %an %s'` | `init`（y-ohgi）→ `docs:`（claude 版追加）→ `Merge pull request #1`（y-ohgi、GitHub 上でマージ）→ `chore:`（2 冊構成へ再編 + ランタイム導入）→ `aidlc:` ×n（ワークフロー記録）。種別プレフィックス `docs:` / `chore:` / `aidlc:` が一貫。統合時点の HEAD は `e97b13b` | リード |
| `git branch -a`、`git status -sb`、`git rev-list --left-right --count origin/main...HEAD` | ローカルは `claude/ai-dlcv2-honkit-pages-1ylg3o`。HEAD は `origin/main` から先行のみ（Step 2 時点で 6 コミット）、遅れ無し。merge-base は `2d2db5a`（PR #1 のマージコミット） | リード |
| `git cat-file -p 2d2db5a` | 親 2 つ。PR #1 は **マージコミット** で取り込まれた（squash ではない）。committer は GitHub | リード |
| `git ls-tree origin/main`、`git show origin/main:.github/workflows/deploy.yml`、`git show origin/main:package.json` | `main` の現行公開物は **単一ブック**（ルート直下に `SUMMARY.md` / `book.json` / `docs/`、`honkit build . _book`）。ランディングページも `/claude/` も `/first/` もまだ `main` に無い | リード |
| `.github/workflows/deploy.yml`（現ブランチ） | トリガー: `push: main`、`pull_request: main`、`workflow_dispatch`。`build` ジョブ: Node 22、`npm ci`、`npm run build`、PR 以外で `actions/upload-pages-artifact@v3`（`_site`）。`deploy` ジョブ: PR 以外、`environment: github-pages`、`actions/deploy-pages@v4`。`concurrency: group: pages, cancel-in-progress: false`。`permissions`（`contents: read` / `pages: write` / `id-token: write`）は **ワークフロー全体レベル** にあり `build` ジョブにも `pages: write` / `id-token: write` が付く（G-1） | リード / devsecops |
| `scripts/build-site.mjs` | `_site/` を作り直し、`claude/` と `first/` を `npx honkit build` で `_site/<dir>` へ。`<dir>/SUMMARY.md` が無ければ **警告してスキップし終了コード 0**。`site/` をコピーし `.nojekyll` を置く | リード / quality（実測） |
| `package.json`、`package-lock.json`、`node_modules/honkit/package.json` | `honkit ^6.0.4`、インストール済みは 6.2.2。lockfile は `lockfileVersion: 3`、239 パッケージ全件に `resolved`（すべて `https://registry.npmjs.org/`）と `integrity`。`npm ci` が lockfile 逸脱を拒む（A-1、A-2）。lint / format の設定と依存は無し（`.markdownlint*`、`.prettierrc*`、`.editorconfig`、`.textlintrc*` いずれも無い） | リード / devsecops |
| `npm audit` | high 2 件: `honkit`（直接依存）経由の `immutable` 3.8.4（`<4.3.9`、GHSA-v56q-mh7h-f735）、`fixAvailable: false`。devDependency のビルド時限定、出力は静的 HTML（G-2） | devsecops |
| honkit 6.2.2 の実挙動（使い捨てブックで `npx honkit build`） | (a) ブック内の既存 `.md` へのリンクは `.html` に書き換わる。(b) 存在しないブック内 `.md` へのリンクは `.md` のまま残り、警告も出ず終了コード 0。(c) ブック外（`../claude/docs/x.md`）へのリンクは `.md` のまま残る。`.html` と書けばそのまま残る。(d) `SUMMARY.md` に無い章はビルドされない。(e) ```` ```mermaid ```` は `Error: Unknown language: "mermaid"` を出すが終了コード 0 で生テキストとして描画される。(f) 見出し ID は本文から生成され、番号付き見出しは番号を含む（`# 1.1 章1` → `id="11-章1"`）。(g) `> **注意** —` の引用ブロックは通常どおり描画。目次が存在しないファイルを指しても警告なし・終了コード 0 | quality / developer（実測） |
| `first/` 直下 | `.bookignore`（`.claude`、`aidlc`、`node_modules`、`.gitignore`、`.mcp.json`、`CLAUDE.md`、`aidlc.settings*.json` を除外。除外ディレクトリは `_site/first/` にコピーされない = 公開物へのランタイム混入防止、A-7）、`.gitignore`（AI-DLC 生成ブロック。`git status --ignored` で `.aidlc-clone-id`、`active-space`、`active-intent`、`runtime-graph.json` 等が実際に除外されている、A-5）。`README.md` / `SUMMARY.md` / `book.json` / `docs/` は未作成 | リード / devsecops / quality |
| `git ls-files first/.claude`（291 ファイル）、`git ls-files first/aidlc`（21 ファイル） | 両方コミット対象。メールアドレス・`/home/…`・`/root/`・鍵形式の走査でヒット無し（A-6）。監査シャード名 `audit/vm-a9d1eb8f1a6a.md` はホスト名 `vm` を含む（設計どおり、汎用名） | developer / devsecops |
| 追跡ファイル全件の秘密情報走査（`AKIA…` / `ghp_` / `github_pat_` / `sk-ant-` / `AWS_SECRET_ACCESS_KEY` 等） | 実値のヒット無し。`first/.claude/settings.json` の `env` は `CLAUDE_CODE_USE_BEDROCK`、`AWS_REGION`、Bedrock モデル ID、`AWS_AIDLC_DEFAULT_SCOPE` のみ。`first/.claude/settings.local.json` と `first/.mcp.json` は存在しない（`aidlc-manifest.json` は `"mcpMode": "none"`）（A-4） | devsecops |
| `first/.claude/tools/data/aidlc-stamp.json`、`aidlc-manifest.json` | `"frameworkVersion": "2.8.2"`、配布ファイルごとの `sha256:`。`first/.claude/tools/aidlc-install-paths.ts` にリリース manifest の `assets[].sha256` と実行ファイルのハッシュを比較する処理（A-8） | devsecops |
| `actions/*` の固定方式 | `checkout@v4`、`setup-node@v4`、`upload-pages-artifact@v3`、`deploy-pages@v4` のメジャータグ固定（SHA 固定ではない）。first-party のため受容（G-3） | devsecops |
| `claude/book.json`、`claude/SUMMARY.md`、`claude/docs/**`（体裁のみ。文章は再利用しない） | `language: "ja"`、`structure`。目次は部を `##`、章を「N.M タイトル」+ `docs/NN-部/NN-章.md` の相対リンク、ネスト無し。章は `# N.M` → 導入 → `##` 本文 → `## この章のまとめ`、見出しは `###` まで、箇条書きは `-`、フェンスは `bash` 49 / `powershell` 2 / `python` 1 / `markdown` 1、図は Unicode 罫線。章間の相対 `.md` リンクは無く外部 URL のみ。和欧間スペースは **不統一**（約 600 対 約 420） | リード / developer |
| `site/index.html` | `./claude/`・`./first/` への相対リンク（「first 版を読む」）。`main` へ取り込まれるまでは公開されない | リード / developer |
| `curl -sS -L -o /dev/null -w '%{http_code} %{url_effective}'` で 3 URL | `https://y-ohgi.github.io/learn-AI-DLCv2/` → 301 → `https://y-ohgi.com/learn-AI-DLCv2/` で最終 200。`/claude/`、`/first/` は転送後 404（未公開のため正常）。リダイレクトを追わずに 200 を判定すると永久に失敗する | quality / コンダクター / リード（統合時に再測） |
| プロキシ経由の外部到達性 | `github.com` の HTML ページ（`/tree/v2.8.2`、`/releases/tag/v2.8.2`）は 403、`raw.githubusercontent.com` は 200。外部 URL 検査を blocking にすると偽陰性が出る | quality |
| `gh` | この環境に無い（`command not found`）。PR の作成・マージは GitHub の MCP ツールまたは Web UI が必要 | リード |
| `scratchpad/guide/` | クローンとは別系統の `docs/guide` コピーがあり内容が食い違う（`03-core-concepts.md` の本文が `404: Not Found` 等）。出典検証の入力に混ぜない | developer |

## 参加者ごとの所見

- **aidlc-pipeline-deploy-agent（リード）**: 2.8.2 の一次情報（ステージ定義、リファレンス、昇格ツール、センサー、知識ファイル）とワークフロー記録、親リポジトリの git 履歴・ブランチ・ワークフロー・ビルドスクリプト・姉妹ブックの体裁を検査。推論: トランクベース + PR、`main` に公開経路が無いことによる Bolt base/target の問題（W-1）、walking skeleton の完了条件（S-1）、test-after、既存 Actions による on-merge デプロイ、HonKit 規約。Step 5 で developer の指摘を受けて照合先をタグ `v2.8.2` に固定し、自身で `355903d` と `a0ee441` の分岐（103 ファイル）、`install.sh --version` の実在、`aidlc config` の非対話フラグ、公開ホストのリダイレクトを再確認した。
- **aidlc-quality-agent**: Testing Posture と品質ゲートを検査。honkit 6.2.2 を使い捨てブックで実測し、(1) `build-site.mjs` は `first/SUMMARY.md` 不在で first 版をスキップして終了コード 0、(2) 目次の欠落ファイルも未解決リンクも警告なしで終了コード 0、(3) 未解決リンクは HTML に `.md` のまま残る、(4) 別ブックへの `.md` リンクは書き換えられず 404、(5) `.bookignore` の除外先へのリンクは必ず 404、(6) プロキシ経由で `github.com` の HTML は 403、(7) 公開ホストは 301 で `y-ohgi.com` へ転送、を確認。`aidlc engine testing-posture resolve` が org 既定の `test-after` に解決されること、Testing Contract が最初のテストの前にランナーを要求すること、build-and-test は後段委譲を「本番相当環境が必要かつ後段が明示的に所有」に限ること（それ以外は `Unverified`）を一次情報で確認。推論: Ordering の 1 文、検証 10 項目の機械 / 判断の切り分け、SM1 の合格線 (1)〜(5)、Testing Contract の測定目標。
- **aidlc-developer-agent**: Code Style / 構造を検査。honkit の実挙動 (a)〜(g) を実測。クローン HEAD `a0ee441` がタグ `v2.8.2`（`355903d`）から `docs/` と `core/` で約 40 ファイル進んでいること、インストール済み `first/.claude/tools/aidlc-state.ts` と `knowledge/aidlc-shared/audit-format.md` がタグと 0 行差でありインストール済みランタイムがタグの投影であること、`scratchpad/guide/` が別系統で信頼できないことを `git diff` で確認。claude 版の体裁（和欧間スペースの不統一を含む）を計数。推論: ディレクトリ命名、`SUMMARY.md` 規約、リンク規約（claude 版へは `.html`）、Markdown 様式（フェンス言語の閉じた集合、```` ```mermaid ```` 禁止、引用ラベル 4 種）、章テンプレート（`## この章で学ぶこと` / `## まとめ` / `## 出典`）、出典書式（名前空間 4 種、位置は見出し名かシンボル名、行番号不使用）、食い違いの優先順位 4 段、事実が確認できないときの扱い、`scripts/check-first.mjs` を規約の強制手段にすること。
- **aidlc-devsecops-agent**: 統制面を検査。すでに整っている統制 8 件（A-1 lockfile の完全固定と `npm ci`、A-2 ビルド時の追加ダウンロード無し、A-3 ワークフロー権限の明示と `pull_request` トリガー、A-4 追跡ファイルに秘密情報無し、A-5 `.gitignore` の AI-DLC ブロック、A-6 コミット済み記録に個人情報無し、A-7 `.bookignore` による公開物への混入防止、A-8 版の固定と manifest の sha256）と、ギャップ 9 件（G-1 `permissions` がワークフロー全体、G-2 Dependabot 無し・`npm audit` high 2 件、G-3 `actions/*` のタグ固定、G-4 Markdown lint 無し、G-5 リンク検査の設計、G-6 章本文への貼り付けによる秘密情報混入、G-7 Bedrock 資格情報の教え方、G-8 `curl | sh` の教え方、G-9 GitHub 側設定が未確認）を報告。`install.sh --version 2.8.2` が Step 2 の証拠一覧に無いことを指摘（統合時にタグの `scripts/install.sh` と CHANGELOG で裏取り済み）。

## インタビューの決定（Q1〜Q14）

| Q | 領域 | 回答（全問 A） | 根拠の要点 | 採用した寄稿 / 採用しなかった OBJECT |
| --- | --- | --- | --- | --- |
| Q1 | Way of Working | Bolt はセッションブランチから切り squash で同ブランチへ戻す。`main` へは最後に 1 本の PR | 依頼文「介入しない・Pages まで完了」。B は未完成章の段階公開、C は Bolt 履歴が残らずケーススタディ素材を失う。org.md との差は理由付きで明記 | リード W-1 案 (a)。org.md 既定（base/target = `main`）からの特例 |
| Q2 | Way of Working | `main` への最終 PR はマージコミット、コミットメッセージは種別付き | 依頼者自身の PR #1 がマージコミット。履歴は既に種別付きで統一 | リード W-2 の提案（squash）は **不採用**、依頼者の実績を優先 |
| Q3 | Walking Skeleton | 骨格 + 章 1 本 + 検査スクリプトで薄く通す | `skeleton: on`、scope-document、Testing Contract のランナー要件 | quality OBJECT「skeleton に検査スクリプトが無い」を採用 |
| Q4 | Walking Skeleton | 完了条件 = ローカルビルド + `_site/first/index.html` + `check:first` + PR ビルド成功。以降は Bolt ごとに代理で精読・承認 | Q1 と整合（`main` 取り込みは最後）。`index.html` は quality の実測。Bolt ごとの承認は project.md Corrections | quality OBJECT「ビルド成功の定義が終了コードだけ」を採用。リード S-1 の案 B（HTTP 200 まで）は不採用 |
| Q5 | Testing Posture | 検証 4 種（ビルド + `index.html` / 未解決 `.md` リンク 0 件 / 出典節と参照先の実在 / ハンズオン再現） | SM1〜SM3 に対応。具体条件は quality の実測 | quality の検証定義を採用。C（文体チェック）は Q13 へ |
| Q6 | Testing Posture | test-after。Ordering は層ごとに書き終えた直後に検査し Bolt 完了前に全章再実行 | 事前の主張→出典列挙は仕様であってテストではない（リード T-1、quality 同意）。org.md 既定と Minimal | quality の Ordering 文を採用。custom は不採用 |
| Q7 | Testing Posture | `scripts/check-first.mjs`（依存追加なし）を `npm run check:first` で実行。first 版は blocking、`_site/claude/` と外部 URL は advisory。照合先は `v2.8.2` タグの木。`deploy.yml` に 1 ステップ追加 | 依頼文「間違った情報は取り込まない」に機械検査が必要。外部 URL は 403 の実測。タグ固定はクローン分岐の確認 | quality OBJECT「照合先が未定義」を採用（タグの木）。developer の `check-first.mjs` 名と検査項目を採用。developer の「CI 組み込みは見送り」は **不採用**（Q13 の読み替えを空文にしないため）。quality T-4 の raw URL 案は不採用（クローンで照合） |
| Q8 | Testing Posture | SM1 合格線 = install `--version 2.8.2` → `aidlc version` → 非対話 `aidlc config` → `aidlc doctor`（provider 系は許容）→ `aidlc engine orchestrate next` のディレクティブ発行 | SM1。本セッションのインストールは読者手順と一致しない。(5) までなら決定論的に判定でき `Unverified` にならない | quality の (a) 案を採用。devsecops OBJECT「`--version` 未裏取り」は裏取りで解消（タグの `scripts/install.sh` usage 行、CHANGELOG 2.8.2 項） |
| Q9 | Deployment | 既存 Actions のみ。変更は `check:first` の追加と `permissions` のジョブ単位化まで。Dependabot 追加せず、`npm audit` high 2 件は受容リスク | Mandated 第 1 項。権限縮小は devsecops G-1。Dependabot は Forbidden 第 3 項（スコープ外成果物） | devsecops OBJECT「権限縮小を禁じると読める」を採用（許容 2 点を明記）。G-2 Dependabot と G-3 SHA 固定は **不採用**（受容リスクとして記録） |
| Q10 | Deployment | コンダクターが代理で PR 作成・確認・マージ。完了判定はリダイレクト追従後の最終ステータス 200 + 公開サイトで `check:first` blocking 0 件 + ランディングから両版へ遷移。タグ無し。GitHub 側設定は PR 作成時に確認 | 依頼文「介入しない・Pages まで完了」。301 転送は quality とコンダクターの実測 | quality OBJECT「HTTP 200 では検査が成立しない」を採用（discovered-rules.md Mandated 第 2 項も修正）。devsecops G-9 を未解決欄へ |
| Q11 | Code Style | 出典行の書式・名前空間 4 種・タグ `v2.8.2` を正・位置は見出し名かシンボル名・食い違い 4 段。claude 版へは `.html` リンク。GitHub URL は README と付録に 1 回 | project.md Corrections。クローン HEAD の分岐と `first/.claude/` がタグの投影であることの確認。`.bookignore` 除外先へのリンクは 404 | developer §8 と OBJECT「インストール済みを正 → タグを正」「`../claude/<パス>` → `.html`」「行番号不使用」を採用。quality OBJECT「出典とリンク検査の衝突」「相互リンクの書式」を採用。B（`.bookignore` 変更）は devsecops A-7 に反し不採用 |
| Q12 | Code Style | 図は ASCII、```` ```mermaid ```` 禁止、kebab-case `docs/NN-部/NN-章.md`、`SUMMARY.md` は claude 版と同じ体裁、章テンプレートは学ぶこと → 本文 → まとめ → 出典、フェンス言語と引用ラベルは閉じた集合、HTML 不使用 | developer 実測 (e)、scope-document の学習目標、機械検査のための閉じた集合 | developer OBJECT「学習目標の節が無い」「フェンス言語に `text` が無く `mermaid` 禁止が無い」を採用。リード C-4 の `## この章のまとめ` は **不採用**（`## まとめ` に変更） |
| Q13 | Code Style | markdownlint は入れない。org.md の「リンタを CI で」を 3 検査の CI 実行に読み替えて明記 | SM に体裁基準は無い。B は依存を増やし claude 版にも波及 | devsecops OBJECT「両論提示のうえ人が決める」に応じ両論を提示して A を選択。developer §10（リポジトリ内スクリプトをリンタ相当にする）を採用 |
| Q14 | Code Style | マスキング規約、外部スクリプトは逐語 + 版固定 + 検証、日本語表記規則、対訳表は domain-design で確定 | devsecops G-6 / G-8。developer §5〜§6。claude 版は表記が不統一で規約にならない | devsecops OBJECT「`curl \| sh` の教え方」「マスキング規約」を採用。developer OBJECT「claude 版と同じ表記は規約にならない」を採用 |

寄稿の OBJECT のうち上表に現れないものの扱い:

- devsecops「`evidence.md` に統制検査が無い」→ **採用**。A 節 8 件を「検査した親リポジトリの実態」に取り込んだ。
- devsecops G-7（Bedrock 資格情報の教え方: `settings.json` に書かない、既定クレデンシャルチェーン、個人設定は `settings.local.json`）→ チームの慣行ではなくハンズオン章の内容要件のため、requirements-analysis / functional-design で扱う。
- quality T-5（`.bookignore` を変えて記録を公開するか）→ 不採用。出典はコードスパンで書く（Q11）。
- quality「Test Strategy Minimal の読み替え、FR ID → 章パスの traceability 規約、Testing Contract の測定目標」→ 採用し `## Testing Posture` に書いた。規約の確定は requirements-analysis / units-generation / code-generation-plan へ。

## 論点の解決（Step 2 の W-1〜C-4）

| ID | 領域 | 論点 | 決定 |
| --- | --- | --- | --- |
| W-1 | Way of Working | Bolt ワークツリーの base/target | (a) セッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` を base/target、最後に 1 本の PR で `main` へ（Q1）。org.md 既定との差は本ワークフロー限りの特例として理由付きで明記。`--doctor` の rule-drift が advisory を出す可能性は受容 |
| W-2 | Way of Working | `main` への取り込み方式 | マージコミット（Q2）。Bolt → セッションブランチは squash |
| S-1 | Walking Skeleton | Bolt 1 の完了条件 | ローカル `npm run build` 成功 + `_site/first/index.html` 存在 + `npm run check:first` 通過 + PR ビルド成功。`main` 取り込みはしない（Q4） |
| S-2 | Walking Skeleton | ラダー選択 | gate every Bolt（Q4） |
| T-1 | Testing Posture | Methodology | test-after 単一値。事前列挙は仕様（Q6） |
| T-2 | Testing Posture | リンク検査の手段と置き場所 | 親リポジトリ `scripts/check-first.mjs`、`npm run check:first`、first 版 blocking / claude 版と外部 URL advisory、`deploy.yml` に 1 ステップ追加（Q7） |
| T-3 | Testing Posture | SM1 の実施方法 | 一時ディレクトリで (1)〜(5) を機械的に確認（Q8）。`--version 2.8.2` は裏取り済み |
| D-1 | Deployment | 本番ゲートの実行者と手段 | コンダクターが代理で PR 作成・マージ。GitHub 側設定は PR 作成時に GitHub MCP で確認して記録（Q10） |
| D-2 | Deployment | バージョン付け | 行わない（Q10） |
| C-1 | Code Style | 出典パスの書式と優先順位 | 名前空間 4 種、リポジトリ相対パス、位置は見出し名かシンボル名、**タグ `v2.8.2` を正**（Step 2 の「インストール済みを正」を置き換え）、食い違い 4 段（Q11） |
| C-2 | Code Style | 図の記法 | ASCII（箱内ラベル英数字のみ）か表、```` ```mermaid ```` 禁止（Q12） |
| C-3 | Code Style | lint 導入 | 導入しない。org.md の該当行を 3 検査の CI 実行に読み替え（Q13） |
| C-4 | Code Style | 章テンプレートと番号体裁 | `# N.M` → 導入 → `## この章で学ぶこと` → 本文 → `## まとめ` → `## 出典`。`SUMMARY.md` の体裁と番号は claude 版と揃える（Q12） |

## 未解決の不確定要素

| 項目 | 現状 | 扱い |
| --- | --- | --- |
| GitHub 側の設定（`main` のブランチ保護、`github-pages` 環境のデプロイ元ブランチ制限、secret scanning / push protection、Pages の公開元） | この環境（`gh` 無し）からは確認できない | deployment-execution で PR 作成時に GitHub MCP で確認し、結果を本ファイルに追記する（Q10、devsecops G-9） |
| `npm audit` の high 2 件（`honkit` → `immutable` 3.8.4、GHSA-v56q-mh7h-f735、`fixAvailable: false`） | 修正版が無い。devDependency のビルド時限定、出力は静的 HTML、実害は CI ビルドの DoS に限られる | **受容リスク**。Dependabot は追加しない（Q9）。修正版が出た場合の更新は本ワークフローの範囲外。`npm audit` を CI でブロックにはしない |
| `aidlc doctor` の provider（Bedrock 資格情報）系の検査 | クリーンな一時ディレクトリには資格情報が無く失敗し得る | SM1 合格線では runtime / hooks 系を必須、provider 系は失敗を許容し、その旨をハンズオン章に書く（Q8） |
| 公開ホストのカスタムドメイン転送 | `https://y-ohgi.github.io/learn-AI-DLCv2/` は 301 で `https://y-ohgi.com/learn-AI-DLCv2/` へ転送（統合時に再測） | 依頼者の GitHub Pages 設定であり変更しない。完了判定は「リダイレクト追従後の最終ステータス 200」で行う（Q10） |
| `actions/*` のメジャータグ固定（SHA 固定ではない） | first-party action | 受容。既存ワークフローの変更は Q9 の 2 点までに限る（devsecops G-3） |
| 監査シャード名にホスト名 `vm` が含まれる | 設計どおり `<host>-<clone-id>.md`。汎用名 | 受容。ケーススタディ章で監査ログを引用する際はマスキング規約に従う（devsecops A-6、Q14） |
| `required-sections` センサーの timestamp マーカーへの H2 床 | 実装上マーカーにも汎用の床が掛かる（advisory） | ステージ契約どおり 1 行を維持。ゲートで advisory が出た場合は受容 |
| 固定トークンの対訳表と用語集の元 | 未作成 | domain-design で確定（Q14） |
| FR ID → 章ファイルパスの traceability 規約、Testing Contract の測定目標の記載 | 未作成 | requirements-analysis / units-generation / code-generation-plan で確定（quality §5） |
