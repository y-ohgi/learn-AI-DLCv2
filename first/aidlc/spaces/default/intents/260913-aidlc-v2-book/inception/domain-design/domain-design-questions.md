# Domain Design Questions

このファイルは、first 版（AI-DLC v2 ベースの新規教材）の「構成要素（コンポーネント）」と、その間の依存・所有関係を決める質問です。教材にはアプリケーションコードが無いため、ここでの「コンポーネント」は「私たちが書く、独立した責務を持つまとまり」（部・目次と設定・対訳表・出典の仕組み・検査スクリプト・ビルド）と読み替えます。依頼者は本ワークフローに介入しないため（依頼文 Q9）、コンダクターが依頼者の代理として回答し、各回答の末尾に根拠を明記します。回答は `[Answer]:` の後に選択肢の英字を書いてください。当てはまらない場合は `X` を選び、続けて内容を書いてください。

参照した上流成果物: `../requirements-analysis/requirements.md`（FR1〜FR8、NFR1〜NFR8、OQ1〜OQ6）、`../practices-discovery/team-practices.md`（章テンプレート、出典 4 名前空間、リンク規約、`check-first.mjs`）。調査した一次情報（タグ `v2.8.2`）: `docs/guide/glossary.md`（用語の定義）、`docs/guide/00-introduction.md`（原典の参照）、`core/tools/aidlc-orchestrate.ts`（ディレクティブ種別）。Depth は Standard で 5 問です。

## Q1. 教材をどの「まとまり」に分けて設計・執筆・検査しますか？

A. 12 個のまとまりに分ける。内容の 6 つ（第 1 部 現在地 / 第 2 部 概念 / 第 3 部 仕組み / 第 4 部 ハンズオン / 第 5 部 ケーススタディ / 付録）と、横断の 6 つ（目次と設定の骨格 `BookShell`、対訳表 `Glossary`、出典と抜粋の仕組み `SourceRegister`、検査スクリプト `CheckScript`、サイトビルド `SiteBuild`、ランディングページの概要文 `LandingPage`）。内容のまとまりは対訳表と出典の仕組みに依存し、骨格は内容のまとまりを目次に載せ、ビルドは骨格とランディングページを入力にし、検査はビルド出力と骨格と出典の仕組みを検査する
B. 教材全体を 1 つのまとまりとし、章は単なるファイルとして扱う
C. 章（20 本）をそれぞれ 1 つのまとまりとする
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: requirements.md は部ごとに `FR{n}`、章ごとに `FR{n}.{m}` を置き、team-practices.md は「コンポーネント = 章ファイル」を検査単位、Unit の候補を intent-backlog のプロト Unit（= 部）としている。A なら部 = Unit の候補、章 = 検査対象ファイルという 2 段が保たれ、横断のまとまり（対訳表・出典・検査・ビルド）は複数の部から使われるため独立させないと所有が曖昧になる。B は units-generation で分割できず walking skeleton（骨格 + 章 1 本 + 検査）を切り出せない。C は 20 個の依存関係を管理する負担に対して得るものが無い。

## Q2. 章ファイルの名前と付録の見出しの形はどうしますか？（OQ3）

A. 部ディレクトリと章ファイルを次に固定する。`docs/01-context/01-where-you-are.md`（1.1）、`docs/02-concepts/01-what-is-aidlc.md`（2.1）、`docs/02-concepts/02-terms-in-2-8-2.md`（2.2）、`docs/03-mechanics/01-install-and-config.md`（3.1）、`02-engine-and-conductor.md`（3.2）、`03-phases-and-stages.md`（3.3）、`04-scopes-and-composer.md`（3.4）、`05-agents-and-delegation.md`（3.5）、`06-gates-presence-audit.md`（3.6）、`07-rules-learning-sensors.md`（3.7）、`08-construction-flow.md`（3.8）、`docs/04-handson/01-setup.md`（4.1）、`02-first-workflow.md`（4.2）、`docs/05-case-study/01-planning.md`（5.1）、`02-review-and-hub-spoke.md`（5.2）、`03-reading-the-record.md`（5.3）、`docs/99-appendix/01-glossary.md`（A）、`02-commands.md`（B）、`03-sources.md`（C）、`04-troubleshooting.md`（D）。付録は `SUMMARY.md` で `## 付録` + `* [A. 用語集](docs/99-appendix/01-glossary.md)` の形、章の見出しは `# A. 用語集` とし、`check-first.mjs` の許容集合に「付録は `# <A〜D>. タイトル`」を加える
B. 章ファイル名は日本語にする（例: `docs/01-現在地/01-あなたのAI利用.md`）
C. 章ファイル名は執筆時に各章で決める
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: team-practices.md `## Code Style`（英語 kebab-case、`docs/<NN-部>/<NN-章>.md` の 1 段構成、日本語は `SUMMARY.md` のタイトルと `# ` 見出しにだけ）と requirements.md OQ3 の候補（`01-context` … `99-appendix`）。付録の形は claude 版と同形（`SUMMARY.md` の `## 付録`、`A.`〜）で、レビュー所見 R-05 の要求どおり許容集合に加える。B は URL のパーセントエンコードと検査の複雑化を招く。

## Q3. 英語のまま残す固定トークンと日本語に訳す用語の対訳表（OQ2）は、どの方針で作りますか？

A. 三分類で作る。(1) 英語のまま・コードスパン: コマンド（`aidlc doctor`、`/aidlc`）、フラグ、ファイルパス、ステージ slug（`intent-capture`）、監査イベント名（`STAGE_COMPLETED`）、状態ファイルのフィールド（`Current Stage`）、スコープ名（`express`、`docs-book`）、エージェント slug、YAML キー、レビュー判定（`READY`）、ディレクティブ種別（`run-stage`）。(2) 英語のまま・固有名詞（初出で一文の説明）: AI-DLC、HonKit、GitHub Pages、Claude Code、Amazon Bedrock、Bolt、Unit、Intent、Space、walking skeleton、Ideation / Inception / Construction / Operation / Initialization。(3) 日本語に訳す（1 語 1 訳）: stage → ステージ、phase → フェーズ、scope → スコープ、depth → 深さ（Depth）、engine → エンジン、conductor → コンダクター、directive → ディレクティブ、approval gate → 承認ゲート、summary confirmation → 要約確認、questions file → 質問ファイル、audit log → 監査ログ、audit shard → 監査シャード、human presence → 人間の在席、sensor → センサー、learnings → 学び、rule → ルール、memory（layers）→ メモリ層、harness → ハーネス、reviewer → レビュアー、advisory → 助言型（advisory）、adversarial → 対抗型（adversarial）、lead / support agent → リード / 支援エージェント、contribution → 寄稿、hub-and-spoke → ハブ&スポーク、mob → mob 実行、ladder prompt → ラダープロンプト、worktree → ワークツリー、compose / composer → compose / コンポーザー、primary source → 一次情報、record → 記録、traceability → トレーサビリティ。表は `components.md` の対訳表を種にして付録 A で完成させ、章の執筆時に追記された語は同じ表に足す
B. 英語をすべてカタカナに訳す（Bolt → ボルト、Unit → ユニット など）
C. 訳さず英語のまま書き、訳語は付けない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: team-practices.md `## Code Style`「固定トークンの区分」と「訳語は 1 語 1 訳」、requirements.md NFR7 と OQ2。分類 (2) は 2.8.2 の `docs/guide/glossary.md` が見出し語として定義する用語（Bolt、Unit、walking skeleton など）で、訳すと読者が原典を検索できなくなる。分類 (3) は claude 版でも同じ訳語が用いられている一般語（ステージ、スコープ、承認ゲート、監査ログ）で、読者が 2 冊を行き来しても揺れない。B は原典との対応が切れ、C はペルソナ（方法論を知らない読者）に負担が大きい。

## Q4. 方法論の原典（AWS ブログ）はどう引きますか？（OQ1）

A. 出典節では `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?`（原典へのリンク元）で引き、原典の URL は 2.1 の本文に 1 回と付録 C の出典一覧に書く。原典の内容は「原典では…と呼ぶ」の形で紹介し、2.8.2 が定義する用語と混同させない。名前空間 4 種は増やさない
B. 出典節に第 5 の名前空間 `[origin]` を追加して原典を直接引く
C. 原典には触れない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: requirements.md OQ1 の提案と FR3.1 の必須内容 (1)(4)。team-practices.md が出典の名前空間を 4 つに固定し `check-first.mjs` で検査すると定めたため、B は承認済みの慣行を変える。C は依頼文のペルソナ（v1/v2 を知らない読者）が原典の存在を知る機会を失う。

## Q5. 章に載せる「出典行」と「記録からの抜粋」は、どのまとまりが所有しますか？

A. 出典と抜粋の仕組み（`SourceRegister`）が所有する。出典行（名前空間・パス・位置・主張）と抜粋（記録ファイル・範囲・マスキング済みか）は各章が書くが、その形式・検査・付録 C の一覧は `SourceRegister` の責務とし、各部は参照するだけにする
B. 各部がそれぞれ自分の出典と抜粋の形式を決める
C. 出典は付録 C にだけ集約し、章末には置かない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: project.md `## Corrections`（各章末に出典節。別表は作らない）と team-practices.md の出典行の書式・4 名前空間・検査。所有者を 1 つにしないと章ごとに形式が揺れて `check-first.mjs` の許容集合が定まらない（ステージ定義「所有の曖昧さは設計の匂い」）。C は承認済みの慣行に反する。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾）:

- 12 のまとまり: 内容 6（第 1〜5 部 + 付録）と横断 6（BookShell / Glossary / SourceRegister / CheckScript / SiteBuild / LandingPage）（Q1: A）
- 章ファイル名は英語 kebab-case で 20 本を固定。付録は `## 付録` + `A.`〜`D.`（Q2: A）
- 対訳表は三分類（コードスパンの英語 / 固有名詞の英語 / 1 語 1 訳の日本語）で作り、付録 A の種にする（Q3: A）
- 原典（AWS ブログ）は `00-introduction.md` 経由で引き、URL は 2.1 と付録 C に書く。名前空間は 4 種のまま（Q4: A）
- 出典行と抜粋の形式・検査・一覧は SourceRegister が所有し、各部は参照するだけ（Q5: A）

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
