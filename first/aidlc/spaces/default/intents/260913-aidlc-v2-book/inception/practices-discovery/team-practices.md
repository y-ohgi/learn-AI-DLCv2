# Team Practices — AI-DLC v2 教材（first 版）

> 入力: `aidlc/spaces/default/memory/org.md`（五節の既定値）、`<record>/aidlc-state.md`（Project Type: Greenfield / Scope: docs-book / Depth: Standard / Test Strategy: Minimal）、`.claude/scopes/aidlc-docs-book.md`（`skeleton: on`）、親リポジトリの実態、支援 3 名の寄稿（`contributions/`）、完了したインタビュー `practices-discovery-questions.md`（Q1〜Q14、全問 A、Consolidated Summary Confirmation = Looks correct）。検査の詳細と決定の根拠は `evidence.md` を参照。
>
> 状態: Step 5 統合版（aidlc-pipeline-deploy-agent）。以下の五節は肯定後にそのまま `aidlc/spaces/default/memory/team.md` の同名節を置き換える。

## Way of Working

私たちは **トランクベース開発** を採用する。トランクは `main` であり、`main` への push が唯一の公開トリガーである（`.github/workflows/deploy.yml`）。作業は短命なブランチで行い、Pull Request で `main` に取り込む。PR では同じワークフローの `build` ジョブが走り（`deploy` ジョブはスキップ）、ビルドと検査が通ることを取り込み前に確認する。

- 本ワークフローでは、依頼者が用意したセッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` を Construction の統合ブランチとする。Bolt ワークツリーはこのブランチを基点（base）とし、Bolt ごとに **squash** で同じブランチへ戻す（統合先 target も同ブランチ）。「Bolt = 統合ブランチ上の 1 コミット」という対応関係は org.md の既定どおり保つ。
- org.md の既定（base / target = `main`）と異なる理由は 2 つある。第一に、`origin/main` には first 版の公開経路（2 冊構成の `scripts/build-site.mjs`、AI-DLC 2.8.2 ランタイム `first/.claude/`、ワークフロー記録 `first/aidlc/`）が無く、セッションブランチが `origin/main` から 6 コミット先行している。`main` を基点にすると骨格の無い木から分岐する。第二に、依頼者は介入せず「Pages へのデプロイまで完了させる」ことを求めているため、公開（`main` への取り込み）は完成物を 1 回で行い、未完成の章を段階的に公開しない。この差は本ワークフロー限りの特例であり、`main` へ取り込んだ後は org.md の既定に戻る。
- セッションブランチから `main` への取り込みは deployment-execution で **1 本の PR** として行い、マージ方式は **マージコミット**（依頼者自身が行った PR #1 と同じ）とする。
- コミットメッセージは `<種別>: <要約>` とし、種別はワークフロー記録の更新が `aidlc:`、教材本文が `docs:`、ビルド・配線が `chore:` である。
- `first/aidlc/` の記録（状態・監査ログ・成果物）と `first/.claude/` のインストール済みランタイムは教材本文と同じブランチにコミットし続ける。読者が章末の出典（`[runtime]` / `[record]`）を GitHub 上で辿れる前提であり、PR には成果物の差分を含める。

## Walking Skeleton

- スコープ `docs-book` は `skeleton: on` を宣言している。Bolt 1 は walking skeleton として単独・ゲート付きで実行し、承認後に残りの Bolt を走らせる。
- walking skeleton の内容は「HonKit の骨格（`README.md`・`SUMMARY.md`・`book.json`）+ 章 1 本（intent-backlog の P2 の最小版）+ 検査スクリプト（親リポジトリ `scripts/check-first.mjs` と `npm run check:first`）」である。検査の実行手段（ランナー）を最初の検査より前に用意し、Bolt 2 以降の code-generation 計画が「実行コマンドの無い検査ステップ」にならないようにする。
- Bolt 1 の完了条件は、ローカルで `npm run build` が終了コード 0 で終わり **かつ** `_site/first/index.html` が存在し **かつ** `npm run check:first` が通り **かつ** PR 上の GitHub Actions `build` ジョブが成功すること、である。`main` への取り込みは行わない。`_site/first/index.html` の存在を条件に含めるのは、`scripts/build-site.mjs` が `first/SUMMARY.md` 不在時に first 版をスキップして終了コード 0 で終わるためである。
- Bolt 1 の後のラダープロンプトでは **gate every Bolt** を選ぶ。以降の Bolt ごとにコンダクターが依頼者の代理で成果物を精読・承認し、判断理由を残す。

## Testing Posture

- **Methodology**: test-after
- **Ordering**: Bolt ごとに、骨格・章本文・章末の出典節・ハンズオン手順の各層を書き終えた直後にその層の検査（ビルドと `_site/first/index.html` の存在 → 内部リンク解決 → 出典節の存在と参照先の実在 → ハンズオン手順のクリーン環境再現）を実行し、Bolt 完了前に全章分を再実行する。
- 本プロジェクトにアプリケーションコードとユニットテストフレームワークは無い。「テスト」とは次の 4 種の検証を指す。
  1. ビルド: `npm run build` が終了コード 0 で終わり、`_site/first/index.html` が存在する。honkit 6.2.2 は目次に無いファイルも未解決リンクも警告なしで終了コード 0 になるため、終了コードだけでは合否にしない。
  2. リンク: `_site/first/` 配下の HTML の `href` に `.md` が残っていない（honkit は解決できたリンクだけ `.html` に書き換えるので、`.md` が残る = 未解決）。内部リンクの参照先が `_site/` 配下に実在する（`../claude/` は `_site/claude/` に対して解決する）。
  3. 出典: 各章末に `## 出典` 節があり、列挙したパスがすべて実在する。照合先は、`[2.8.2]` が `awslabs/aidlc-workflows` のタグ `v2.8.2`（commit `355903d`）の木（`git cat-file -e v2.8.2:<path>`。クローンの場所は環境変数で指定し、無ければ一時ディレクトリへ `--depth 1 --branch v2.8.2` の浅いクローンを行う）、`[runtime]` / `[record]` が本リポジトリの作業木である。
  4. ハンズオン再現（SM1）: クリーンな一時ディレクトリで、章本文の `bash` フェンスに書いたとおり (1) `install.sh` を `--version 2.8.2` 固定で実行し (2) `aidlc version` が `aidlc 2.8.2 (runtime 2.8.2)` を返し (3) `aidlc config --harness claude` をフラグ指定（非対話）で実行し (4) `aidlc doctor` の runtime / hooks 系の検査が通り（Bedrock 資格情報に依存する検査は失敗を許容し、その旨を章に書く） (5) `aidlc engine orchestrate next` が最初の run-stage ディレクティブを返す、までを機械的に確認して記録する。ここまでを「最初の承認ゲートに到達できる」の合格線とする。
- 検査手段は親リポジトリの `scripts/check-first.mjs`（`build-site.mjs` と同じ ESM・Node 22 標準 API のみ、依存追加なし）で、`npm run check:first` で呼ぶ。first 版（`_site/index.html` と `_site/first/`）の内部リンク・章の体裁（Code Style の閉じた集合）・出典は **blocking**、`_site/claude/` の内部リンクと外部 URL は **advisory**（報告のみ。この環境ではプロキシ経由で `github.com` の HTML が 403 になるため外部 URL は偽陰性を生む）。既存の `deploy.yml` の `build` ジョブに `npm run check:first` を 1 ステップ追加し、失敗で PR を止める。
- 執筆前の検証として、functional-design（章仕様）で章内の事実主張とその出典を列挙し、ゲートで審査する。これは仕様であってテストではないため Methodology は test-after の単一値とする。読者向けの別表（主張→出典の対応表）は作らず、章末の出典節が読者向けの成果物である。
- Test Strategy は **Minimal** で、スコープ `docs-book` は追加のカバレッジ床を持たない。読み替えは「要件 = requirements-analysis の各 FR（章の学習目標）、コンポーネント = 章ファイル、happy path = その章が上記 1〜3 を通ること（ハンズオン章は 4 を含む）」とし、FR ID → 章ファイルパスを traceability の target とする規約は requirements-analysis / units-generation で決める。「既存スイートを緑に保つ」= 新しい章を加えるごとに全章分の検査を再実行する。
- code-generation-plan の Testing Contract には測定可能な目標を明示する: 未解決内部リンク 0 件、出典節の欠落章 0 件、実在しない出典パス 0 件、`_site/first/index.html` の存在、SM1 の手順 (1)〜(5) の全通過、公開 URL のリダイレクト追従後の最終ステータス 200。
- 一次情報で確認できない主張は書かない。推定を書く場合は本文に「（推定）」を付し、出典節に `[推定]` 行で根拠と確定できない理由を残す。検証を通過させるために検査項目を弱めたり省いたりしない。

## Deployment

- 公開は **`main` へのマージで自動デプロイ** する。既存の GitHub Actions ワークフロー `.github/workflows/deploy.yml` が `npm ci` → `npm run build`（`scripts/build-site.mjs`: ランディングページ + `claude/` + `first/` を `_site/` に組み立て）→ `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4` を実行する。新しいワークフロー・公開先・環境は作らない。
- 既存ワークフローへの変更は次の 2 点までとする。(1) `build` ジョブへの `npm run check:first` の 1 ステップ追加。(2) `permissions` をワークフロー全体からジョブ単位に縮める（`build` は `contents: read` のみ、`deploy` にだけ `pages: write` / `id-token: write`）。Dependabot などの新しい設定ファイルは追加しない。`npm audit` の high 2 件（`honkit` 経由の `immutable`、修正版なし、ビルド時限定）は受容リスクとして `evidence.md` に記録する。
- ステージング相当は 2 つ。ローカルの `npm run build` + `npm run check:first`（`_site/first/` の目視と検査）と、PR で走る同ワークフローの `build` ジョブ（`deploy` はスキップ）である。
- 本番ゲートは PR の `main` への取り込みである。依頼者は介入しないため、コンダクターが依頼者の代理で GitHub 上に PR を作成し、PR 上のビルドと検査の成功を確認してからマージコミットで取り込む。ブランチ保護・Pages の公開元・secret scanning など GitHub 側の設定は PR 作成時に GitHub MCP で確認し、結果を `evidence.md` に記録する。
- 公開の完了判定は smoke test で行う。`https://y-ohgi.github.io/learn-AI-DLCv2/`、同 `/claude/`、同 `/first/` が **リダイレクト追従後に最終ステータス 200** を返し（`curl -sS -L`。現在このホストは 301 で `https://y-ohgi.com/learn-AI-DLCv2/` に転送される。依頼者の GitHub Pages 設定であり本ワークフローでは変更しない）、公開サイト上で `check:first` を再実行して blocking 項目が 0 件で、ランディングページから両版へ遷移できること。deployment-execution ではさらにランディングページの first 版概要文を実態に合わせて更新する。
- ロールバックは `main` 上の revert コミット → 同ワークフローによる再デプロイである。GitHub Pages に独立したロールバック手段は無い。`concurrency: group: pages, cancel-in-progress: false` により同時デプロイは直列化される。
- リリースのバージョン付けや git タグは行わない。教材は継続的に公開され、`main` の最新が常に公開版である。

## Code Style

- 言語と表記: 日本語で書く。和文と英数字・コードスパンの間に半角スペースを置き、句読点と括弧は全角（`、。（）「」`）、数字は半角、1 段落 1 行（段落内で改行しない）。例外となる複合語は用語集で列挙し本文で一貫させる。依頼者の指示の逐語引用は原文どおりとし整形しない。
- 固定トークンの区分: コマンド・フラグ・ファイルパス・ステージ slug・監査イベント名・状態ファイルのフィールドと値・スコープ名・エージェント slug・YAML キー・レビュー判定はコードスパンで英語のまま書く。AI-DLC・HonKit・GitHub Pages・Claude Code・Bolt・Unit・Intent・Space・フェーズ名（Ideation / Inception / Construction / Operation）は固有名詞として英語のまま書き、初出で一文の説明を添える。訳語は 1 語 1 訳に固定し、対訳表（英語トークン → 採用する日本語 → 初出章）は domain-design で確定して付録の用語集の元にする。
- 読者: AI-DLC v1/v2 を知らないエンジニア。AI-DLC 固有の用語は初出で一文の説明を添える。
- 構成: HonKit 標準。`README.md`（はじめに）、`SUMMARY.md`（唯一の目次。`# 目次`、`* [はじめに](README.md)`、部は `## 第N部 …`、章は `* [N.M タイトル](docs/NN-part/NN-chapter.md)`、ネスト無し）、`book.json`（`language: "ja"`、`structure.readme` / `structure.summary`）、`.bookignore`（既存を維持し `.claude`・`aidlc` を除外）。ディレクトリ名・ファイル名は英語 kebab-case の ASCII に限り、章ファイルは `docs/<NN-部スラッグ>/<NN-章スラッグ>.md` の 1 段構成、`NN` は 2 桁連番とする。日本語は `SUMMARY.md` のタイトルと章の `# ` 見出しにだけ置く。`SUMMARY.md` に無い章はビルドされないため、章ファイルを追加したら同じコミットで `SUMMARY.md` に載せる。
- 章テンプレート（`README.md` を除く全章）: `# N.M タイトル`（章に 1 つ、`SUMMARY.md` のタイトルと同一文字列）→ 導入段落 → `## この章で学ぶこと`（「…できる」の形で 2〜4 個。requirements-analysis の学習目標を置く）→ 本文の節（`##`〜`###`。`####` は使わない）→ `## まとめ`（「この章で学ぶこと」と 1 対 1 対応）→ `## 出典`。ハンズオン章は `## まとめ` の前に `## つまずきポイント` を任意で置く。
- 出典の書式: 1 行を `- [<名前空間>] <パス> <位置> — <その出典が裏付ける主張>` の形で書き、パスはコードスパンにしてリンクにはしない（`.bookignore` が `aidlc` と `.claude` を除外するため、それらへの Markdown リンクは公開サイトで必ず 404 になる）。名前空間は 4 つに固定する: `[2.8.2]`（`awslabs/aidlc-workflows` のタグ `v2.8.2`、commit `355903d` のリポジトリ相対パス。`docs/…`、`core/…`）、`[runtime]`（コミット済みのインストール済みランタイム `first/.claude/…`）、`[record]`（本ワークフローの記録 `first/aidlc/…`）、`[推定]`（一次情報で確定できない推論。本文側にも「（推定）」を付す）。位置は見出し名（`§ …`）またはシンボル名（関数名・サブコマンド名・イベント名）で示し、行番号は使わない。GitHub URL（`https://github.com/awslabs/aidlc-workflows/blob/v2.8.2/<path>`）は `README.md` と付録の出典一覧に 1 回だけ書く。
- 食い違いの優先順位: (1) 事実確認の前にクローンを `v2.8.2` にチェックアウトする（HEAD や別コピーは入力にしない）。(2) `docs/` の記述と `core/` のコードが食い違えばコード（`core/`）を正とし、docs 側の記述は引かない。(3) `core/` と `first/.claude/`（同じタグの投影）が食い違えば投影差分なので `core/` の内容を書き、投影固有の事柄（`{{INVOKE}}` → `aidlc` など）だけ `[runtime]` で示す。(4) 実行記録（`[record]`）とドキュメントが食い違えば記録を事実として書き、食い違いを `> **注意**` で明示する。
- リンク: first 版内の章は相対パスで `.md` を指す（HonKit が `.html` に書き換える）。claude 版の章へは公開後の HTML パスで書く（`first/README.md` からは `../claude/docs/<部>/<章>.html`、章ファイルからは `../../../claude/docs/<部>/<章>.html`。ブック外の `.md` リンクは書き換えられず 404 になる）。ランディングページへは README から `../`、章から `../../../`。ルート絶対パス（`/first/…`、`/claude/…`）は使わない。見出しアンカーは番号無し見出しに限り、原則ページ単位でリンクする。
- Markdown 様式: 箇条書きは `- `、番号付きは `1. `、表は GFM のパイプ表。コードフェンスは言語名必須で `bash` / `text` / `json` / `yaml` / `markdown` / `diff` に限定し、```` ```mermaid ```` は禁止する。補足は `> **注意** — 本文` の形の引用ブロック 1 段落とし、ラベルは `注意` / `補足` / `推定` / `参照` の 4 種に固定する。HTML タグと絵文字は使わない。
- 図: Mermaid を使わず ASCII 記法（`+ - | ^ v < > / \` と英数字・空白のみ。Unicode 罫線は使わない）か表で表現する。箱の中のラベルは英数字に限り、日本語の説明は図の直下の段落に書く。箱の各行は同じ文字数にする。
- マスキング規約: 章に貼るログ・コマンド出力からはアカウント ID・ARN・トークン・メールアドレスを除き、絶対パスは `~/…` などに短縮する。
- 外部スクリプトの教え方: 一次情報の逐語コマンドを改変せずに示したうえで、「ダウンロードして内容を確認 → `--version 2.8.2` で固定して実行 → `aidlc version` で検証」の手順を併記する。`sudo` を付けない、HTTPS のみ、URL のホストを目で確認する、の 3 点を一文で添える。
- claude 版の文章は再利用・改稿しない（project.md `## Forbidden`）。重複する話題は要点のみ述べ、claude 版の該当章へリンクする。体裁（`SUMMARY.md` の形、番号付け）は 2 冊を並べて読む読者のために揃えるが、節名（`## まとめ`）と図の記法は意図的に変える。
- Lint / Formatter: markdownlint 等の外部リンタとフォーマッタは導入しない。org.md の「リンタを CI で実行し、失敗で PR を止める」は、本プロジェクトでは「ビルド・リンク・出典の 3 検査（`npm run check:first`）を CI で実行し、失敗で PR を止める」と読み替える。`check-first.mjs` は上記の閉じた集合（必須節、フェンス言語、```` ```mermaid ```` 禁止、引用ラベル、ルート絶対パス、出典行の書式と名前空間、`SUMMARY.md` との一致）を機械検査する。和欧間スペースなど人手の表記規約は機械検査されず、ゲートでの精読で確認する。
