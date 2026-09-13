**Collaborator:** aidlc-devsecops-agent

## Contribution

観点: lint / format、秘密情報と依存の走査、サプライチェーン統制、外部スクリプト実行の教え方。対象は「GitHub Actions で HonKit をビルドし GitHub Pages に公開する文書リポジトリ」と、その中に同梱された AI-DLC 2.8.2 ランタイム（`first/.claude/`）とワークフロー記録（`first/aidlc/`）。すべて `/home/user/learn-AI-DLCv2` で実測した。リードドラフト（`team-practices.md`、`discovered-rules.md`、`evidence.md`）は一次情報の読み直しと Way of Working / Deployment の実態把握が丁寧だが、**秘密情報・依存固定・パイプライン権限・公開物への混入という統制面の検査がまったく無い**。以下の A 節はそのまま `evidence.md`「検査した親リポジトリの実態」に追記できる形で書いた。

### A. すでに整っている統制（証拠パス付き）

| # | 統制 | 証拠 | 所見 |
| --- | --- | --- | --- |
| A-1 | npm 依存の完全固定 | `package-lock.json`（`lockfileVersion: 3`）。239 パッケージ全件に `resolved` と `integrity` があり、`resolved` はすべて `https://registry.npmjs.org/`。`.github/workflows/deploy.yml` は `npm ci`（lockfile 厳守） | `package.json` の `honkit ^6.0.4` は caret だが、lockfile が 6.2.2 に固定し `npm ci` が lockfile 逸脱を拒むため、ビルドの再現性と改竄検知（integrity）は確保されている |
| A-2 | ビルド時の追加ダウンロード無し | `scripts/build-site.mjs` の `npx honkit build` は `npm ci` 済みの `node_modules/.bin/honkit` を解決する | 現状は lockfile 外の取得が起きない。ただし `npx` は依存が無いときレジストリ解決を試みる挙動を持つので、`node_modules/.bin/honkit` または `npm exec --no -- honkit` に書き換えると「lockfile 外は取らない」意図が明示になる（任意） |
| A-3 | ワークフロー権限の明示 | `.github/workflows/deploy.yml` 9〜12 行: `permissions: contents: read / pages: write / id-token: write` | 既定の write-all ではない。トリガーは `pull_request`（`pull_request_target` ではない）なので、fork からの PR は read-only トークンで `build` のみ走り `deploy` はスキップ（`if: github.event_name != 'pull_request'`）。`environment: github-pages` と `concurrency: group: pages` も適切 |
| A-4 | 追跡ファイルに秘密情報無し | `git ls-files` 全件（`package-lock.json` 除く）を `AKIA…` / `ghp_` / `github_pat_` / `sk-ant-` / `AWS_SECRET_ACCESS_KEY` / `api_key` / `token` / `secret` / `password` で走査 | 実値のヒット無し（ヒットは語句としての言及のみ）。`first/.claude/settings.json` の `env` は `CLAUDE_CODE_USE_BEDROCK`、`AWS_REGION`、Bedrock モデル ID、`AWS_AIDLC_DEFAULT_SCOPE` のみで資格情報を含まない。`first/.claude/settings.local.json` は存在せず、`first/.mcp.json` も存在しない（`first/.claude/tools/data/aidlc-manifest.json` は `"mcpMode": "none"`） |
| A-5 | `.gitignore` の AI-DLC ブロック | `first/.gitignore`（`# BEGIN AI-DLC:gitignore` 〜 `# END`）: `aidlc/active-space`、`aidlc/spaces/*/intents/active-intent`、`aidlc/.aidlc-clone-id`、`aidlc/.aidlc-sessions/`、`aidlc/spaces/*/intents/*/.aidlc-*`、`runtime-graph.json`、`.claude/settings.local.json`。ルート `.gitignore`: `node_modules/`、`_site/`、`_book/` | `git status --ignored` で `.aidlc-clone-id`、`active-space`、`active-intent`、`.aidlc-steering-token-key`、`runtime-graph.json`、`.aidlc-hooks-health/` 等が実際に除外されていること、`git ls-files first/aidlc` にそれらが一つも入っていないことを確認。ビルド出力（`_site/`、`_book/`）もコミットされない |
| A-6 | コミット済みワークフロー記録の内容 | `git ls-files first/aidlc`（21 ファイル）をメールアドレス・`/home/…`・`/Users/…`・`/root/`・鍵形式で走査 | ヒット無し。監査シャード名 `audit/vm-a9d1eb8f1a6a.md` はホスト名 `vm` を含む（設計上 `<host>-<clone-id>.md`）。汎用名なので問題無いが、公開リポジトリではホスト名がそのまま出ることを執筆者は知っておく |
| A-7 | 公開物へのランタイム混入防止 | `first/.bookignore`: `.claude`、`aidlc`、`node_modules`、`.gitignore`、`.mcp.json`、`CLAUDE.md`、`aidlc.settings.json`、`aidlc.settings.local.json` | HonKit 出力（`_site/first/`）に設定ファイル・監査ログ・ランタイムが混入しない |
| A-8 | AI-DLC 版の固定と改竄検知 | `first/.claude/tools/data/aidlc-stamp.json` と `aidlc-manifest.json` の `"frameworkVersion": "2.8.2"`。manifest は配布ファイルごとの `sha256:` を保持。`aidlc --version` → `aidlc 2.8.2 (runtime 2.8.2)` | 一次情報の版が機械的に固定されている。`first/.claude/tools/aidlc-install-paths.ts` 372〜380 行付近には、リリース manifest の `assets[].sha256` と実行ファイルのハッシュを比較する処理がある（ハンズオンで「インストールの検証」を説明する際の出典候補） |

### B. ギャップと推奨（優先度順）

**G-1 `permissions` がワークフロー全体レベル（重要・差分 5 行）**
`deploy.yml` の `permissions:` はトップレベルにあるため、`build` ジョブにも `pages: write` と `id-token: write` が付与される。`build` は `npm ci` で 239 パッケージのコードを取り込み、honkit と `scripts/build-site.mjs` を実行する場所であり、依存が侵害された場合に OIDC トークンを取得して Pages に任意の内容を配置できる。推奨: トップレベルを `permissions: contents: read` に縮め、`deploy` ジョブにのみ `permissions: pages: write / id-token: write` を置く。これは既存ワークフローの最小権限化であり、scope-document の「新しいパイプラインは作らない」には抵触しない。`team-practices.md` `## Deployment` にその旨を一文加えること（後述 OBJECT）。任意の追加: `actions/checkout@v4` に `persist-credentials: false`（`contents: read` なので低リスク）。

**G-2 Dependabot 無し・`npm audit` に high 2 件（fix 無し）**
`.github/dependabot.yml` が無い。`npm audit` の現状: `honkit`（直接依存）経由の `immutable` 3.8.4（`<4.3.9`、GHSA-v56q-mh7h-f735、Immutable.js `List` の DoS）で high 2 件、`fixAvailable: false`。honkit は devDependency のビルド時限定で、出力は静的 HTML、読者に届く実行コードは無いため、実害は CI ビルドの DoS に限られる。推奨: (a) `npm` と `github-actions` の 2 エコシステムを週次で監視する `dependabot.yml`、(b) この 2 件を期限付きの受容リスクとして `evidence.md` に記録、(c) `npm audit` を CI でブロックにすると現状で赤になるため advisory 運用。

**G-3 `actions/*` はメジャータグ固定（SHA 固定ではない）**
`actions/checkout@v4`、`actions/setup-node@v4`、`actions/upload-pages-artifact@v3`、`actions/deploy-pages@v4`。first-party action のためリスクは限定的で、SHA 固定を必須とはしない。G-2 の Dependabot（`github-actions`）を入れるならタグ運用で許容、入れないなら SHA 固定を検討、と二択でインタビューへ。

**G-4 Markdown の lint / format 設定がゼロ（リード C-3 と見解が異なる）**
リポジトリに `.markdownlint*`、`.prettierrc*`、`.editorconfig`、`.textlintrc*` はいずれも無く、CI は `honkit build` の成否だけを見る。本プロジェクトの「ソースコード」は Markdown であり、`org.md` `## Code Style` の既定は「Linter は CI で走らせ、失敗は PR をブロック」である。リード提案 C-3「導入しない」をそのまま肯定すると、`org.md` の「リンタ設定に従う」が空振りしたまま固定される。推奨は両論提示:
- 導入案: `markdownlint-cli2` を devDependency として lockfile 経由で固定し、`.markdownlint-cli2.jsonc` で日本語散文向けに `MD013`（行長）を off、HonKit が要求する範囲で `MD033`（inline HTML）を緩め、対象は `first/**/*.md`（`first/.claude/**`、`first/aidlc/**` は除外）。`deploy.yml` の `build` ジョブに 1 ステップ追加。HonKit 固有のテンプレート構文（`{% … %}`）で誤検知が出る可能性は要検証。
- 非導入案: 「フォーマッタ無し。リンタ相当は build / リンク検査 / 出典検査の 3 スクリプト」と `team-practices.md` に明記し、`org.md` の該当行を意図的に読み替えたことを記録する。
どちらでも、「日本語と英数字の間の半角スペース」「コードブロックの言語名」など人手の表記規約は機械検査されないことを明示する。

**G-5 リンク検査の設計（リード T-2 を補強）**
`honkit build` はリンクを検査しない点はリードと同意見。依存追加なしの `scripts/check-links.mjs` にも同意（サプライチェーン表面を増やさない）。追加の観点: 外部 URL の HTTP 確認はネットワーク依存・レート制限で不安定なので、内部リンク（`_site/first/**` の `href` / `src`、フラグメントを含む）は blocking、外部 URL は advisory（build-and-test で 1 回、CI では走らせないか許容リスト）に分ける。章末「出典」節のパス実在検査は、`first/.claude/...` と `first/aidlc/...` はリポジトリ内で完結し、`awslabs/aidlc-workflows` 側の `docs/...` / `core/...` はこの環境にクローンが無い（`find / -name aidlc-workflows` でヒット無し）ため、2.8.2 タグの raw URL への HEAD 確認か、同一内容の `first/.claude/aidlc-common/...` への写像で検査する方針を決める必要がある（リード C-1 と連動）。

**G-6 秘密検知の運用と、教材固有の混入経路**
pre-commit / CI の secret scan は無い。GitHub の公開リポジトリは secret scanning と push protection を無料で使えるが、有効化状態はこの環境から確認できない（インタビュー項目）。追加ツール（gitleaks 等）は任意。本プロジェクトで秘密情報が混入し得る経路は限定的で、コードではなく**章本文への貼り付け**である: (a) ケーススタディ章に監査ログや `aidlc --doctor --export` の出力を貼るとき（`aidlc/diagnostics/` は gitignore 済みだが、章に貼れば公開される）、(b) ハンズオン章の実行ログに AWS アカウント ID・ARN・`AWS_PROFILE` 名・絶対パスが残るとき。推奨の執筆規約: 「ログ・コマンド出力を章に貼る際は、アカウント ID・ARN・トークン・ホスト名・ホームディレクトリの絶対パスをマスクする」。人の発言に基づかないので `## Mandated` には入れず、インタビューで確認のうえ `team-practices.md` `## Code Style` へ。

**G-7 Bedrock 既定と資格情報の教え方**
`first/.claude/settings.json` は `CLAUDE_CODE_USE_BEDROCK=1` と `AWS_REGION=us-east-1` を同梱するため、読者の Claude Code は Bedrock に向く。ハンズオン章は「資格情報は AWS 既定クレデンシャルチェーン（環境変数・`~/.aws`・SSO）から読まれ、`settings.json` には書かない。リージョンやプロファイルの個人設定は `settings.local.json`（`first/.gitignore` 末尾で除外済み）に置く」を明示すべき（出典: `first/.claude/settings.local.json.example`、`first/.claude/CLAUDE.md` § Prerequisites）。

**G-8 `curl | sh` の責任ある教え方（ハンズオン章の執筆規約）**
scope-document はハンズオンを `install.sh` → `aidlc config` → `aidlc doctor` → `/aidlc` と定めている。教材としての推奨型:
1. 一次情報のコマンドを逐語で示し、改変しない。
2. 直後に「ダウンロード → 中身の確認 → 実行」の 2 段階版を併記する（`curl -fsSL -o install.sh <URL>` → `less install.sh` → 実行）。公表されたチェックサムがあれば `sha256sum` で照合する手順を添える。公表の有無は 2.8.2 一次情報で確認してから書く。
3. 版を固定して実行する。リード T-3 は `install.sh --version 2.8.2` と書いているが、このフラグの実在は `evidence.md` の一次情報一覧に無く未裏取りである。`project.md` `## Forbidden` に従い、裏取りするか「推定」と明示する。
4. 実行後の検証を必ず書く: `aidlc --version` が `2.8.2` を返すこと、`aidlc doctor` が通ること。ランタイムが manifest の sha256 で実行ファイルを照合する仕組み（A-8）に触れるなら該当行を出典に。
5. `sudo` を付けない、HTTPS のみ、URL のホストを目で確認する、の 3 点を一文で添える。`bun.sh/install | bash` や `claude.ai/install.sh | bash` を書く場合も同じ型にする。
6. 仕組み章では、`settings.json` の `permissions.allow` に `Bash(aidlc engine *)` があること、フックが `aidlc engine hook …` を自動実行することを示し、「読者が何を信頼して実行しているか」を理解させる（出典: `first/.claude/settings.json`）。

**G-9 GitHub 側の保護設定は未確認**
`main` のブランチ保護（直接 push 禁止・PR 必須）、`github-pages` 環境のデプロイ元ブランチ制限、secret scanning / push protection の有効化は、この環境（`gh` 無し）から確認できない。リード D-1 のインタビュー項目に統合する。

### C. インタビューで確定すべき問い（DevSecOps 観点）

- Q-DS1: `deploy.yml` の `permissions` をジョブレベルに縮める変更（G-1）を本ワークフロー内で行うか。行うならどの Bolt / ステージか。
- Q-DS2: Dependabot（`npm` + `github-actions`）を追加するか。`npm audit` の high 2 件（fix 無し）を受容リスクとして記録するか。
- Q-DS3: markdownlint を導入するか。導入しないなら、`org.md` `## Code Style` の「リンタは CI でブロック」を本プロジェクトで「build / リンク / 出典の 3 検査」に読み替えることを明記するか。
- Q-DS4: 章に貼るログ・出力のマスキング規約（G-6）を執筆規約に入れるか。
- Q-DS5: GitHub 側設定（secret scanning + push protection、`main` のブランチ保護、Pages 環境のブランチ制限）の現状（G-9、D-1 と統合）。
- Q-DS6: ハンズオンの外部スクリプト実行は「一次情報の逐語 + ダウンロード→確認→実行→版の検証」の型（G-8）にするか。

## Positions

- AGREE: `## Deployment` で既存ワークフロー（`deploy.yml` → `build-site.mjs`）を流用し新設しない — `npm ci` + 全件 integrity 付き lockfile、明示 `permissions`、PR では `deploy` スキップ、`concurrency` 直列化と、統制の骨格はすでに妥当で、新設は表面を増やすだけ。
- AGREE: `## Testing Posture` の 4 検証（build / リンク / 出典 / ハンズオン再現）と `Methodology: test-after` — セキュリティ観点で追加のテスト種別は不要で、検証は build-and-test に集約してよい。
- AGREE: T-2 のリンク検査を依存追加なしの自前スクリプトで行う — サプライチェーン表面を増やさない選択として正しい。外部 URL は advisory に分ける補強を推奨（G-5）。
- AGREE: `## Code Style` の「ルート絶対パスを使わず相対リンク」と `.bookignore` の維持 — Pages サブパス対応に加え、内部リンクの機械検査と公開物へのランタイム非混入（A-7）を両立する。
- AGREE: `discovered-rules.md` が `## Mandated` / `## Forbidden` を人の発言に限定している — 本稿の推奨はすべて「提案」欄相当であり、インタビューを経ずにルール化してはならない。
- OBJECT: `evidence.md` に秘密情報・依存固定・パイプライン権限・公開物混入の検査が無い — `first/.claude/settings.json`、`first/.gitignore` の AI-DLC ブロック、`package-lock.json` の integrity、`deploy.yml` の `permissions` は本ステージの証拠として不可欠。A 節をそのまま「検査した親リポジトリの実態」に追記すること。
- OBJECT: C-3 の既定候補が「markdownlint は導入しない」に寄っている — 本プロジェクトのソースは Markdown であり、`org.md` `## Code Style` の「リンタは CI でブロック」既定から後退する判断は両論提示のうえ人が決めるべき（G-4）。
- OBJECT: `## Deployment` の「新しいパイプラインや環境は作らない」が、既存ワークフローの最小権限化（G-1: `build` から `pages: write` / `id-token: write` を外す）まで禁じると読める — 「既存ワークフローの権限縮小・依存監視の追加は許容」を一文追記すること。
- OBJECT: ハンズオン章の外部スクリプト実行（`curl | sh`）の教え方が `## Code Style` に無い — 執筆規約として「一次情報の逐語コマンドと、ダウンロード→確認→版固定で実行→`aidlc --version` で検証、の手順を併記する」を加えること（G-8）。
- OBJECT: T-3 の `install.sh --version 2.8.2` は一次情報で未裏取り — `evidence.md` の調査一覧にインストール手順の参照が無い。`project.md` `## Forbidden`（未裏取りの断定禁止）に従い、裏取りするか「推定」と明示すること。
- OBJECT: 章本文への貼り付けによる秘密情報混入（監査ログ・`--doctor --export`・実行ログ中のアカウント ID / ARN / 絶対パス）への備えが無い — `## Code Style` にマスキング規約（G-6）をインタビュー確認のうえ加えること。
