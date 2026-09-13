**Collaborator:** aidlc-developer-agent

## Contribution

観点: Code Style / 構造。本プロジェクトの「コード」は HonKit ブックなので、章ファイルとディレクトリの命名、`SUMMARY.md` 駆動の構造、リンク規約、Markdown 様式、日本語本文と英語固定トークンの扱い、章テンプレート、出典の書式、そして「事実が確認できないときの扱い」（エラーハンドリングの相当物）を独立に検査した。リードドラフトの Code Style 節は方向として妥当だが、リンク規約と出典のバージョン固定に実装上の穴があり、そのまま書き始めると公開後にリンク切れと版ずれを生む。以下は統合にそのまま使える粒度で書く。

### 1. 検査した証拠

| 参照先 | 確認したこと |
| --- | --- |
| HonKit の実挙動（`npx honkit build` を使い捨てブックで実行。`scratchpad/honkit-probe/`） | (a) ブック内の既存 `.md` へのリンクは `.html` に書き換わる。(b) 存在しないブック内 `.md` へのリンクは `.md` のまま残り、警告も出ず終了コード 0。(c) ブック外（`../other/docs/x.md`）へのリンクは `.md` のまま残る。`.html` と書けばそのまま残る。(d) `SUMMARY.md` に無い章ファイルはビルドされない（`found 2 pages`、HTML 未生成）。(e) ```` ```mermaid ```` は `Error: Unknown language: "mermaid"` を標準出力に吐くが終了コード 0 で、`<pre><code class="lang-mermaid">` の生テキストとして描画される。(f) 見出し ID は本文から生成され、`# はじめに` → `id="はじめに"`、`# 1.1 章1` → `id="11-章1"`（`.` 除去、空白は `-`）。(g) `> **注意** — …` の引用ブロックは通常どおり描画 |
| `scripts/build-site.mjs`、`site/index.html`、`_site/claude/docs/02-aidlc/*.html` | 出力は `_site/<book>/` 配下に章ディレクトリ構造をそのまま保つ。ランディングは `./claude/`・`./first/` の相対リンク |
| 姉妹ブック `claude/`（体裁のみ。文章は再利用しない） | `book.json` は `title` / `description` / `author` / `language: "ja"` / `structure`。`SUMMARY.md` は部を `##`、章を `* [N.M タイトル](docs/NN-部/NN-章.md)`。章は `# N.M タイトル` → 導入段落 → `##` 本文 → `## この章のまとめ`。見出しは `###` まで。箇条書きは `-`。コードフェンスは `bash` 49 / `powershell` 2 / `python` 1 / `markdown` 1。図は Unicode 罫線（`┌─┐│▼`）。章間の相対 `.md` リンクは無く外部 URL のみ。和欧間スペースは **不統一**（「日本語 + 半角スペース + 英字」約 600 箇所に対し、スペース無し約 420 箇所。例:「AI駆動開発」「APIを作る」） |
| `awslabs/aidlc-workflows` クローン（`scratchpad/aidlc-workflows/`、HEAD `a0ee441`）と `git fetch` したタグ `v2.8.2`（peeled commit `355903d`） | HEAD は **2.8.2 ではない**。`git diff --stat 355903d a0ee441` は 103 ファイル差分、うち `docs/` と `core/` に 40 ファイル（`docs/guide/12-cli-commands.md` +84 行、`docs/reference/03-orchestrator.md`、`core/tools/aidlc-orchestrate.ts` +83 行、`core/tools/aidlc-attest.ts` 新規 1861 行、`docs/reference/20-commit-provenance.md` 新規 など）。CHANGELOG の先頭が `[2.8.2]` なのは HEAD が未リリース分を含むためで、先頭エントリの版番号は「HEAD = 2.8.2」の証拠にならない |
| インストール済みランタイム `first/.claude/` と上記 2 リビジョンの比較 | `tools/aidlc-state.ts` はタグと **0 行差**・HEAD と 54 行差。`knowledge/aidlc-shared/audit-format.md` はタグと 0 行差・HEAD と 16 行差。`aidlc-common/stages/inception/practices-discovery.md` は両者と 0 行差（`{{INVOKE}}` 置換後）。`aidlc-common/protocols/stage-protocol.md`（28 行差）と `agents/aidlc-developer-agent.md`（7 行差）はハーネス投影による差分。結論: `first/.claude/` は **タグ `v2.8.2` の投影** であり、クローン HEAD の投影ではない |
| `scratchpad/guide/` | クローンとは別系統の `docs/guide` コピーが存在し、内容が食い違う（`03-core-concepts.md` の本文が `404: Not Found`、`18-install-and-lifecycle.md` が無い等）。出典検証の入力に混ぜてはならない |
| `git ls-files first/.claude`（291 ファイル）、`git ls-files first/aidlc`（21 ファイル） | 両方ともコミット対象。読者は GitHub 上で `first/.claude/...`・`first/aidlc/...` のパスをそのまま辿れる |
| `first/.bookignore` | `.claude`・`aidlc`・`node_modules`・`.gitignore`・`.mcp.json` 等を除外。`CLAUDE.md`・`aidlc.settings*.json` は `first/` 直下に存在しないが無害 |
| `<record>/ideation/scope-definition/intent-backlog.md` | P1 骨格 / P2 現在地 / P3 概念 / P4 仕組み / P5 ハンズオン / P6 ケーススタディ / P7 付録 / P8 導入・比較（Could）。ディレクトリ命名の入力 |
| `.claude/scopes/aidlc-docs-book.md` | practices-discovery の責務を「文体・引用ルール・章テンプレ・事実確認/リンク確認の姿勢」と明記。本節はこの 4 点を確定する場 |
| `first/.claude/aidlc-common/protocols/stage-protocol.md` § ASCII Diagram Standards（993 行付近） | 許可文字 `+ - \| ^ v < > / \` と英数字・空白。Unicode 罫線（U+2500〜U+257F）は禁止。箱の各行は同じ文字数 |
| `aidlc/spaces/default/memory/phases/inception.md` | 「要件は検証可能に」。章の学習目標にも適用する根拠 |

### 2. ディレクトリと章ファイルの命名（提案）

```
first/
  README.md                 # はじめに（対象読者、2.8.2 固定の宣言、claude 版との関係、出典の読み方）
  SUMMARY.md                # 唯一の目次
  book.json                 # title / description / author / language: "ja" / structure
  .bookignore               # 既存
  docs/
    01-context/             # P2 読者の現在地
    02-concepts/            # P3 AI-DLC の概念
    03-mechanics/           # P4 v2 の仕組み
    04-handson/             # P5 ハンズオン
    05-case-study/          # P6 ケーススタディ（本書自身の制作記録）
    06-adoption/            # P8（Could）。作る場合のみ
    99-appendix/            # P7 付録
      01-glossary.md  02-commands.md  03-sources.md  04-troubleshooting.md
```

- ディレクトリ名・ファイル名は **英語 kebab-case の ASCII** に限る（URL のパーセントエンコード回避、HonKit の検索索引と GitHub Pages のパス安定性、`git` 上の可読性）。日本語は `SUMMARY.md` のタイトルと章の `# ` 見出しにだけ置く。
- 章ファイルは `docs/<NN-part-slug>/<NN-chapter-slug>.md`。`NN` は部内の 2 桁連番（`01` から）。部番号は `SUMMARY.md` 上の表示番号と一致させる（`03-mechanics/02-engine-and-conductor.md` ↔ 「3.2 エンジンとコンダクター」）。付録も同じ `NN-slug.md` で並べ、表示は「付録 A 用語集」のように文字を振る。
- 章の並び替えはファイル名・`SUMMARY.md`・`# ` 見出しの 3 箇所を同時に変える。ケーススタディや付録から章を参照するときは **ページ単位のリンク** にし、見出しアンカーには依存しない（番号付き見出しの ID は `11-章1` のように番号を含むため、番号変更で壊れる）。

### 3. `SUMMARY.md` 規約

- `SUMMARY.md` に無い章はビルドされず（実験 (d)）、その章へのリンクは `.md` のまま残って公開後 404 になる。**章ファイルを追加したら同じコミットで `SUMMARY.md` に載せる**。
- 形式は claude 版と同じ体裁: 先頭 `# 目次`、`* [はじめに](README.md)`、部は `## 第N部 …`、章は `* [N.M タイトル](docs/NN-part/NN-chapter.md)`。ネスト（サブ章）は使わない。
- 検査: `docs/**/*.md` の集合と `SUMMARY.md` のリンク先集合が一致すること（孤児章ゼロ・リンク先不在ゼロ）を build-and-test の検査項目に入れる。

### 4. リンク規約（ドラフトの訂正を含む）

| 種類 | 書き方 | 根拠 |
| --- | --- | --- |
| first 版内の章 | 相対パスで `.md` を指す（`../02-concepts/01-what-is-aidlc.md`）。HonKit が `.html` に書き換える | 実験 (a) |
| claude 版の章 | **`.html` で書く**。`first/README.md` からは `../claude/docs/02-aidlc/12-comparison.html`、`first/docs/NN/NN.md` からは `../../../claude/docs/02-aidlc/12-comparison.html`。ブック外の `.md` リンクは書き換えられず 404 になる | 実験 (c)、出力構造の保持 |
| ランディングページ | README から `../`、章から `../../../` | `_site/index.html` の位置 |
| 外部（GitHub 等） | `https://` の絶対 URL。2.8.2 の一次情報を URL で示すときは `https://github.com/awslabs/aidlc-workflows/blob/v2.8.2/<path>` の **タグ付き URL** に限る（`main` の URL は将来ずれる） | §7 |
| 禁止 | ルート絶対パス（`/first/...`、`/claude/...`）。公開先は `https://y-ohgi.github.io/learn-AI-DLCv2/` のサブパス配下で、`_site/` でのローカル確認でも解決しない | Pages のサブパス公開 |
| 見出しアンカー | 使う場合は番号無し見出し（`#はじめに`）に限る。原則ページ単位 | 実験 (f) |

- 章の階層を `docs/NN/NN.md` の 1 段に固定しているのは、claude 版・ランディングへの相対プレフィックスを「README からは `../`、章からは `../../../`」の 2 種類に固定するためでもある。
- `honkit build` はリンク切れを検出しない（実験 (b)）ので、リンク検査は別スクリプトが必須（§9）。

### 5. Markdown 様式

- `# ` 見出しは章に 1 つだけで、`SUMMARY.md` のタイトルと同一文字列。本文の節は `## `、小節は `### ` まで。`####` は使わない。
- 箇条書きは `- `。番号付きは `1. `。表は GFM パイプ表で区切り行は `| --- |`。表のセル内でパイプが要るときは `\|`。
- コードフェンスは **必ず言語名を付ける**。使う言語名を `bash` / `text`（コマンド出力・図・ディレクトリツリー）/ `json` / `yaml` / `markdown` / `diff` に限定し、```` ```mermaid ```` は **禁止**（HonKit 標準テーマは描画せず、ビルドはエラーを出しつつ成功扱いになるため見落としやすい。実験 (e)）。
- 補足・注意は引用ブロックで `> **注意** — 本文` の 1 段落。ラベルは `注意` / `補足` / `推定` / `参照` の 4 種に固定する（§8 の検査対象になる）。絵文字は使わない。
- 図は ASCII 記法（`+ - | ^ v < > / \`）。**箱の中のラベルは英数字に限り、日本語の説明は図の直下に通常段落で書く**。日本語は 2 桁幅なので箱の中に入れると stage-protocol の文字幅規則（各行同じ文字数）が崩れる。claude 版の Unicode 罫線は採らない（stage-protocol § ASCII Diagram Standards の禁止字。体裁の統一より描画の一貫性を優先）。
- 段落内で改行しない（1 段落 = 1 行）。Markdown の段落内改行は HTML では空白になり、和文の途中に半角空白が入るかどうかがブラウザ依存になる。
- HTML タグは書かない（`<br>`・`<details>` 等）。プレースホルダの `<slug>` はコードスパンの中でだけ使う。

### 6. 日本語本文と英語固定トークン

- 和文と英数字（英単語・数字・コードスパン）の間に半角スペースを置く。claude 版は不統一なので「claude 版と同じ」は規約にならない。例外は複合語として定着した固有名詞だけとし、用語集に列挙する（例: 「AI駆動開発」を採るなら用語集で宣言し、本文では一貫させる）。
- 句読点・括弧は全角（`、。（）「」`）。数字は半角。コロンは見出しラベルで使うなら全角 `：`、コードやパスの中は半角のまま。
- 英語のまま残す（コードスパンで囲む）もの: コマンド（`aidlc doctor`、`/aidlc`）、フラグ、ファイル・ディレクトリパス、ステージ slug（`practices-discovery`）、監査イベント名（`STAGE_COMPLETED`）、状態ファイルのフィールドと値（`Current Stage`、`[?]`）、スコープ名（`express`）、エージェント slug、YAML キー、レビュー判定（`READY`）。
- 英語のまま残す（コードスパン無し・固有名詞）もの: AI-DLC、HonKit、GitHub Pages、Claude Code、Bolt、Unit、Intent、Space、フェーズ名（Ideation / Inception / Construction / Operation）。いずれも **初出で一文の説明** を添え、以降は同じ表記を使う。
- 訳語は 1 語 1 訳に固定する（「承認ゲート」と「gate」を混在させない）。対訳表（英語トークン → 採用する日本語 → 初出章）は domain-design で確定し、`docs/99-appendix/01-glossary.md` の元にする。
- 依頼者の指示の逐語引用（ケーススタディ）は原文どおり。整形しない。

### 7. 章テンプレート（`README.md` を除く全章）

```markdown
# N.M 章タイトル

導入段落（この章が何を扱い、前の章とどうつながるか。2〜4 文）。

## この章で学ぶこと

- 読み終えたら「…できる」の形で 2〜4 個（requirements-analysis の学習目標をここに置く）

## 本文の節（2〜6 個）

## まとめ

- 「この章で学ぶこと」に 1 対 1 で対応する箇条書き

## 出典

- [2.8.2] `docs/guide/05-scopes-and-depth.md` § Depth — 深度 3 段階の定義
- [2.8.2] `core/tools/aidlc-orchestrate.ts` `next` — サブコマンドが 5 つであること
- [runtime] `first/.claude/aidlc-common/stages/inception/practices-discovery.md` — 四成果物と支援 3 名
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` — `STAGE_COMPLETED` の実例
- [推定] … — 推定の内容と、一次情報で確定できない理由
```

- 「この章で学ぶこと」は inception ルール「要件は検証可能に」の章への写像であり、「まとめ」との 1 対 1 対応を検査可能にする。ドラフトの `導入 → 本文 → まとめ → 出典` には学習目標が無い。
- ハンズオン章は `## つまずきポイント` を「まとめ」の前に置いてよい（任意節）。
- 「まとめ」の見出し名は `## まとめ` に固定する（claude 版の `## この章のまとめ` と揃える必要は無い。文章の非再利用を体裁でも示す）。`## 出典` は全章必須（`project.md` `## Corrections`）。

### 8. 出典の書式（C-1 の具体化）

- 出典 1 行の形: `- [<名前空間>] <パス> <位置> — <その出典が裏付ける主張>`。
- 名前空間は 4 つに固定し、書式検査の対象にする:
  - `[2.8.2]` — `awslabs/aidlc-workflows` の **タグ `v2.8.2`（commit `355903d`）** のリポジトリ相対パス。`docs/…` と `core/…` はここ。
  - `[runtime]` — 本リポジトリにコミット済みのインストール済みランタイム `first/.claude/…`。「実際に何が入っているか」（`aidlc --version` の出力、ハーネス投影後のステージ定義など）にだけ使う。
  - `[record]` — 本ワークフローの実行記録 `first/aidlc/…`（監査シャード、状態ファイル、質問ファイル、レビュー所見）。ケーススタディの根拠。
  - `[推定]` — 一次情報で確定できないが書く価値のある推論。本文側にも「（推定）」を付す（§9）。
- 位置の示し方は **見出し名（`§ …`）またはシンボル名（関数名・サブコマンド名・イベント名）**。行番号は使わない（タグ内でも読者が開くリビジョン次第でずれる。`evidence.md` の「6597 行付近」は内部証拠としては良いが、章には書かない）。
- GitHub URL は章ごとに繰り返さず、`README.md` と `docs/99-appendix/03-sources.md` に「`[2.8.2]` は `https://github.com/awslabs/aidlc-workflows/blob/v2.8.2/<path>`」と 1 回だけ書く。
- **食い違いの優先順位**（ドラフト C-1 の訂正）: 「クローンとインストール済みが食い違えばインストール済みを正とする」では足りない。クローン HEAD は 2.8.2 より進んでおり（§1）、そこから引くと 2.8.2 に無い事実（`aidlc attest` 等）が混入する。規約は次の順にする。
  1. 事実確認の前にクローンを `git checkout v2.8.2`（`355903d`）にする。HEAD や `scratchpad/guide/` は入力にしない。
  2. `docs/` の記述と `core/` のコードが食い違えば **コード（`core/`）を正** とし、docs 側の記述は引かない。
  3. `core/` と `first/.claude/`（同じタグの投影）が食い違えば投影差分なので、書くのは `core/` の内容にし、投影固有の事柄（`{{INVOKE}}` → `aidlc` など）だけ `[runtime]` で示す。
  4. 実行記録（`[record]`）とドキュメントが食い違えば、記録を事実として書き、食い違いを `> **注意**` で明示する（ケーススタディの価値はここにある）。

### 9. 事実が確認できないときの扱い（エラーハンドリングの相当物）

| 事象 | 対処 | 検出手段 |
| --- | --- | --- |
| 一次情報（`[2.8.2]` / `[runtime]` / `[record]`）に無い AI-DLC の事実 | 書かない。読者に必要なら「（推定）」を付けて書き、出典節に `[推定]` 行で根拠と確定できない理由を残す | 出典節の `[推定]` 行と本文の「（推定）」の対応を検査 |
| 2.8.2 以外の版の事実（クローン HEAD の追加分、claude 版が依拠した 2.7.1 の手順） | 書かない。版差を述べる必要があるときも `v2.8.2` タグで確認できる範囲に限る | `git checkout v2.8.2` の徹底。出典パスの存在検査はタグの木（`git cat-file -e v2.8.2:<path>`）に対して行う |
| 出典パスが存在しない | 章を完成させない（build-and-test で fail） | `[2.8.2]` はタグの木、`[runtime]` / `[record]` は作業木で存在確認 |
| リンク切れ（ブック内・claude 版・ランディング） | 章を完成させない。`honkit build` は検出しないので別検査で終了コード非 0 にする | `_site/first/**/*.html` の `href` を `_site/` 内で解決 |
| ハンズオンの手順が再現できなかった | 掲載しない（SM1 はクリーン環境での再現を要求）。再現できた版・環境を章内に明記 | build-and-test の再現ログ |
| 章が `SUMMARY.md` に無い / 必須節が無い / フェンスに言語名が無い / ```` ```mermaid ```` / ルート絶対リンク / 未知の引用ラベル | 章を完成させない | 同じ検査スクリプトで機械検出 |

### 10. 検査の置き場所と形（C-3 の代替案）

- markdownlint 等の外部リンタは導入しない（ドラフトに同意）。ただし `org.md` の Code Style は「プロジェクトのリンタ設定を読む」前提なので、設定が無いままだと本節の規約は一切強制されない。代わりに **リポジトリ内スクリプト** を「リンタ」とする。
- 置き場所は親リポジトリの `scripts/check-first.mjs`（`build-site.mjs` と同じ ESM・Node 22・依存追加なし）。`package.json` に `"check:first": "node scripts/check-first.mjs"` を足し、build-and-test では `npm run build:first && npm run check:first` を実行する。CI への組み込みは ci-pipeline が SKIP なので本ワークフローでは行わず、deployment-execution で任意提案に留める。
- 検査内容（すべて決定的、終了コード非 0 で失敗）: §3 の孤児・不在検査、§4 のリンク解決とルート絶対パス禁止、§5 の `# ` 1 つ・`##`〜`###` のみ・フェンス言語名・`mermaid` 禁止・引用ラベル集合、§7 の必須節（`## この章で学ぶこと` / `## まとめ` / `## 出典`）、§8 の出典行書式と名前空間とパス存在、§9 の「（推定）」↔ `[推定]` 対応。
- リンク検査の手段そのもの（T-2）は quality の領分なので、ここでは「置き場所と検査項目の列挙」までを提案する。

### 11. インタビューで確定すべき事項（Code Style 観点。代理回答用の既定値付き）

1. ディレクトリ・ファイル名は英語 kebab-case ASCII、`docs/NN-part/NN-chapter.md` の 1 段構成にするか（既定: はい。§2）
2. claude 版へのリンクは `.html` 固定・相対プレフィックス 2 種にするか（既定: はい。§4）
3. 章テンプレートの節名を `## この章で学ぶこと` / `## まとめ` / `## 出典` に固定するか（既定: はい。§7。C-4 の `## この章のまとめ` は採らない）
4. 出典の名前空間 `[2.8.2]` / `[runtime]` / `[record]` / `[推定]` と、`v2.8.2` タグ（`355903d`）への固定、行番号不使用（既定: はい。§8。C-1 の「インストール済みを正」は「タグを正」に置き換える）
5. 図は ASCII 記法かつ箱内ラベル英数字のみ、```` ```mermaid ```` 禁止（既定: はい。§5。C-2 に追記）
6. 和欧間スペースあり・全角句読点・1 段落 1 行（既定: はい。§5〜6）
7. 英語のまま残す固定トークンの範囲と、1 語 1 訳の対訳表を domain-design で確定すること（既定: §6 の区分。用語集は付録 A）
8. 外部リンタは入れず `scripts/check-first.mjs` を規約の強制手段とするか（既定: はい。§10。C-3 に置き換え）
9. `first/.claude/` と `first/aidlc/` をコミットし続けること（`[runtime]` / `[record]` の出典が読者に辿れる前提。既定: はい。現状 291 + 21 ファイルがコミット済み）

## Positions

- AGREE: HonKit 標準構成と `SUMMARY.md` を唯一の目次とすること、`docs/<NN-部>/<NN-章>.md` の 2 桁 kebab-case — 実験 (d) で `SUMMARY.md` 未掲載の章はビルドされないことを確認した。構造の根拠として正しい。
- AGREE: 全章末に `## 出典` を必須とし、別表を作らないこと — `project.md` `## Corrections` の記録どおりで、出典行を機械検査できる形（§8）にすれば build-and-test の検査対象にもなる。
- AGREE: 図は Mermaid を使わず ASCII 記法にすること（C-2） — 実験 (e) で ```` ```mermaid ```` はエラーを出しつつビルド成功扱いになり見落としやすいことを確認した。箱内ラベルを英数字に限る追記（§5）が要る。
- AGREE: markdownlint 等を導入しないこと（C-3） — ただし規約が無強制になるので、リポジトリ内スクリプトを「リンタ」として置く（§10）ことを条件にする。
- AGREE: claude 版の文章を再利用せず、体裁の統一に留めること — 章ファイル命名・`SUMMARY.md` の体裁は揃え、節名（`## まとめ`）と図の記法は意図的に変える提案（§5、§7）と両立する。
- OBJECT: 「claude 版への参照は `../claude/<パス>` の相対リンク」 — ブック外の `.md` リンクは HonKit が書き換えず公開後 404 になる（実験 (c)）。`.html` で書き、README からは `../claude/…`、章からは `../../../claude/…` と深さで分ける規約（§4）に置き換えるべき。
- OBJECT: C-1 提案「クローンとインストール済みが食い違えばインストール済みを正とする」 — クローン HEAD `a0ee441` はタグ `v2.8.2`（`355903d`）から `docs/`・`core/` 40 ファイル進んでおり、インストール済み `first/.claude/` はタグと一致する。規約は「事実確認前に `v2.8.2` をチェックアウトし、`scratchpad/guide/` の別コピーは使わない」であるべきで、食い違い時の優先順位は §8 の 4 段にする。
- OBJECT: 「日本語と英数字の間には半角スペース（claude 版と同じ表記）」 — claude 版は約 600 対 約 420 で不統一であり「同じ表記」は検証可能な規約にならない。スペースあり・例外は用語集で列挙、と独立に定める（§6）。
- OBJECT: 章テンプレート `導入 → 本文 → まとめ → 出典` に学習目標の節が無い — scope は requirements-analysis で章ごとの学習目標を定めると宣言しており、inception ルールは検証可能性を求める。`## この章で学ぶこと` を置き、`## まとめ` と 1 対 1 対応させる（§7）。
- OBJECT: 「コードブロックには言語名（`bash`、`json`、`yaml`、`markdown`）」 — 出力・図・ツリー用の `text` が無く、`mermaid` の禁止も明記されていない。許可集合を §5 のとおり閉じ、検査対象にする。
- OBJECT: 出典パスの位置指定が未定義（`evidence.md` は行番号を使用） — 章では行番号を使わず見出し名またはシンボル名で示す（§8）。行番号は読者が開くリビジョンでずれる。
