# Team Practices — AI-DLC v2 教材（first 版）

> 入力: `aidlc/spaces/default/memory/org.md`（五節の既定値）、`<record>/aidlc-state.md`（Project Type: Greenfield / Scope: docs-book / Depth: Standard / Test Strategy: Minimal）、`.claude/scopes/aidlc-docs-book.md`（`skeleton: on`）、親リポジトリの実態（`git log`、`.github/workflows/deploy.yml`、`scripts/build-site.mjs`、`package.json`、姉妹ブック `claude/`）。検査の詳細と未解決の論点は `evidence.md` を参照。
>
> 状態: Step 2 リードドラフト（aidlc-pipeline-deploy-agent）。`team.md` に肯定済みの内容は無いため、以下は org.md の既定値を「アプリケーションコードを持たない文書プロジェクト」に読み替えた提案であり、チームの確定事実ではない。`［要確認］` を付した箇条はインタビュー（Step 4）で確定し、統合（Step 5）で印を外す。

## Way of Working

私たちは **トランクベース開発** を採用する。トランクは `main` であり、`main` への push が唯一の公開トリガーである（`.github/workflows/deploy.yml`）。

- 作業は短命なブランチで行い、Pull Request で `main` に取り込む。PR では同じワークフローの `build` ジョブが走り（`deploy` ジョブはスキップ）、`honkit build` が通ることを取り込み前に確認する。
- 本ワークフローの作業は、依頼者が用意したセッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` 上で進んでいる。このブランチは `origin/main` から 6 コミット先行しており（2 冊構成への再編、AI-DLC 2.8.2 ランタイムの導入、ワークフロー記録）、`main` にはまだ first 版の公開経路が存在しない。
- Construction の Bolt ワークツリーは、このセッションブランチを基点（base）かつ統合先（target）とし、Bolt ごとに **squash** で取り込む。「Bolt = トランク上の 1 コミット」という org.md の対応関係は保つ。［要確認］（代替案: 先にセッションブランチを `main` へ取り込み、以降は org.md どおり `main` を base/target にして Bolt ごとに PR → `main` → 公開する。`evidence.md` 論点 W-1）
- セッションブランチから `main` への取り込みは deployment-execution で行う。マージ方式は squash を提案する。唯一の実績である PR #1 はマージコミットで取り込まれているため、依頼者の慣習と異なる可能性がある。［要確認］（`evidence.md` 論点 W-2）
- コミットメッセージは実績に合わせ `<種別>: <要約>` とする。ワークフロー記録の更新は `aidlc:`、教材本文は `docs:`、ビルド・配線は `chore:` を用いる。
- `first/aidlc/` の記録（状態・監査ログ・成果物）は教材本文と同じブランチにコミットし、PR に成果物の差分を含める。

## Walking Skeleton

- スコープ `docs-book` は `skeleton: on` を宣言している。したがって Bolt 1 は walking skeleton として単独・ゲート付きで実行し、承認後に残りの Bolt を走らせる。
- 本プロジェクトの walking skeleton は「HonKit の骨格（`README.md`・`SUMMARY.md`・`book.json`・`.bookignore`）と 1 章の最小版（intent-backlog の P1 + P2）を、`npm run build` → `_site/first/` の生成 → PR ビルド成功まで通す」ことである。`scripts/build-site.mjs` は `first/SUMMARY.md` が無い間は first 版のビルドをスキップするため、骨格が置かれた時点で初めて公開経路が実際に動く。
- 公開 URL（`/first/`）での確認は `main` への取り込み後にしか行えない。Bolt 1 の完了条件を「ローカルと PR ビルドの成功」までとするか、「`main` へ取り込んで `/first/` が HTTP 200 を返す」までとするかを決める。［要確認］（`evidence.md` 論点 S-1）
- Bolt 1 の後のラダープロンプト（残りの Bolt をどう走らせるか）には **gate every Bolt** を選ぶことを提案する。依頼者は介入しないが、project.md の Corrections（各ゲートでコンダクターが代理で成果物を精読し判断理由を残す）に従い、Bolt ごとにレビュー点を残すためである。［要確認］（`evidence.md` 論点 S-2）

## Testing Posture

- **Methodology**: test-after
- **Ordering**: 章を書き終えるごとに `honkit build` → リンク検査 → 章末「出典」節の検査を実行し、ハンズオン章についてはさらに Bolt 完了前にクリーン環境での手順再現を行う。
- 本プロジェクトにアプリケーションコードとユニットテストフレームワークは無い。「テスト」とは次の 4 種の検証を指す。
  1. ビルド: `npx honkit build first _site/first`（`npm run build:first`）がエラー無く完了する。全体ビルド `npm run build` も通る。
  2. リンク検査: 教材内の相対リンク（章間、`SUMMARY.md` のエントリ、`../claude/` への参照）がすべて解決する。外部リンクは HTTP 到達性を確認する。検査手段（スクリプトの置き場所とツール）は未決。［要確認］（`evidence.md` 論点 T-2）
  3. 出典節の検査: 各章の末尾に「出典」節があり、列挙された一次情報のファイルパス（`awslabs/aidlc-workflows` 2.8.2 のドキュメント・コード、`first/.claude/` のインストール済みランタイム、`first/aidlc/` の実行記録）がすべて実在する。
  4. ハンズオン再現（SM1）: クリーンな一時ディレクトリに aidlc 2.8.2 を導入し、ハンズオン章の手順どおりに最初の承認ゲートへ到達する。再現の実施方法は未決。［要確認］（`evidence.md` 論点 T-3）
- 執筆前の検証として、functional-design（章仕様）で章内の事実主張とその出典を列挙し、ゲートで審査する。これは仕様であってテストではないため Methodology は test-after のままとする。読者向けの別表（主張→出典の対応表）は作らず、章末の出典節が読者向けの成果物となる。［要確認］（`evidence.md` 論点 T-1）
- Test Strategy は **Minimal**。スコープ `docs-book` は追加のカバレッジ床を持たない。章ごとの合否条件は上記 1〜3（ハンズオン章は 4 を含む）であり、新しい章を加えても既存の全章のビルドとリンクが引き続き通ること（既存テストが緑のまま）を要求する。
- 一次情報で確認できない主張は書かない。推定を書く場合は「推定」と明示する。検証を通過させるために検査項目を弱めたり省いたりしない。

## Deployment

- 公開は **`main` へのマージで自動デプロイ** する。既存の GitHub Actions ワークフロー `.github/workflows/deploy.yml` が `npm ci` → `npm run build`（`scripts/build-site.mjs`: ランディングページ + `claude/` + `first/` を `_site/` に組み立て）→ `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4` を実行する。新しいパイプラインや環境は作らない。
- ステージング相当は 2 つ。ローカルの `npm run build`（`_site/first/` の目視と検査）と、PR で走る同ワークフローの `build` ジョブ（`deploy` はスキップ）である。
- 本番ゲートは PR の `main` への取り込み。依頼者は介入しないため、取り込みはコンダクターが依頼者の代理として行う。実行手段（GitHub の PR マージ。`gh` CLI はこの環境に無い）と権限（ブランチ保護の有無）は未確認。［要確認］（`evidence.md` 論点 D-1）
- デプロイ完了の判定は smoke test で行う。`https://y-ohgi.github.io/learn-AI-DLCv2/first/` が HTTP 200 を返し、公開サイト上でリンク検査が通り、ランディングページから first 版へ遷移できること。deployment-execution ではさらにランディングページの first 版概要文を実態に合わせて更新する（scope-document）。
- ロールバックは `main` 上の revert コミット → 同ワークフローによる再デプロイ。GitHub Pages に独立したロールバック手段は無い。`concurrency: group: pages, cancel-in-progress: false` により同時デプロイは直列化される。
- リリースのバージョン付けやタグは行わない。教材は継続的に公開され、`main` の最新が常に公開版である。［要確認］（`evidence.md` 論点 D-2）

## Code Style

- 言語: 日本語で書く。コマンド名・ファイルパス・AI-DLC の識別子（ステージ名、イベント名、フラグ）などの固定トークンは英語のまま、原則としてバッククォートで囲む。日本語と英数字の間には半角スペースを置く（姉妹ブック claude 版と同じ表記）。
- 読者: AI-DLC v1/v2 を知らないエンジニア。AI-DLC 固有の用語は初出で一文の説明を添える。
- 構成: HonKit 標準。`README.md`（はじめに）、`SUMMARY.md`（目次。部を `##`、章を相対リンク付きの箇条書きで並べる）、`book.json`（`language: "ja"`、`structure.readme` / `structure.summary`）、`.bookignore`（`.claude`・`aidlc`・`node_modules` などビルド対象外を列挙。既に配置済み）。章ファイルは `docs/<NN-部スラッグ>/<NN-章スラッグ>.md` の 2 桁番号付き kebab-case とし、`SUMMARY.md` が唯一の目次である（`SUMMARY.md` に無い章は公開されない）。
- リンク: 教材内は相対パス。claude 版への参照は `../claude/<パス>` の相対リンク（claude 版の README が `../first/` を指すのと対称）。GitHub Pages のサブパス配下で動くよう、ルート絶対パス（`/first/...`）は使わない。
- 章テンプレート: `# <章タイトル>` → 導入 → 本文 `##` → `## この章のまとめ` → `## 出典`。「出典」節は必須で、章内の事実主張ごとに一次情報のファイルパス（`docs/guide/...`、`core/...`、`first/.claude/...`、`first/aidlc/...`）を列挙する。パスの書式（リポジトリ相対パスのみか、2.8.2 に固定した GitHub URL を併記するか）は未決。［要確認］（`evidence.md` 論点 C-1）
- claude 版の文章は再利用・改稿しない（project.md `## Forbidden`）。重複する話題は要点のみ述べ、claude 版の該当章へリンクする。
- 図: HonKit 標準テーマは Mermaid を描画しないため、図は ASCII 記法（stage-protocol の ASCII Diagram Standards: `+ - | ^ v < > / \` と英数字のみ）またはテキスト表で表現する。［要確認］（`evidence.md` 論点 C-2）
- 表は GFM のパイプ表。コードブロックには言語名（`bash`、`json`、`yaml`、`markdown`）を付ける。
- Lint / Formatter: リポジトリに Markdown の lint 設定は無い。CI は `honkit build` の成否のみを検査する。markdownlint 等の導入は任意であり未決。［要確認］（`evidence.md` 論点 C-3）
- 命名: `SUMMARY.md` 上の章タイトルには「1.1 …」のように部.章番号を付ける（claude 版と同じ体裁。文章の再利用ではなく体裁の統一）。［要確認］（`evidence.md` 論点 C-4）
