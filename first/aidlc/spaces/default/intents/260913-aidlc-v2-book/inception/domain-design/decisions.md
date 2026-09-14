# Architecture Decisions — AI-DLC v2 教材（first 版）

入力: `components.md`、`../requirements-analysis/requirements.md`（`requirements`）、`../practices-discovery/team-practices.md`（`team-practices`）、`domain-design-questions.md`。Inception フェーズの規則（ADR は Context / Decision / Consequences / Alternatives Rejected を持つ）に従う。

## ADR-001: 教材を 12 のまとまり（部 6 + 横断 6）に分ける

- **Context** — requirements.md は部ごとに `FR{n}`、章ごとに `FR{n}.{m}` を置き、team-practices.md は「コンポーネント = 章ファイル」を検査単位、Unit の候補を部（プロト Unit）としている。walking skeleton は「骨格 + 章 1 本 + 検査スクリプト」で、骨格と検査は内容と独立に切り出せる必要がある。対訳表・出典の書式は全部が従う必要がある。
- **Decision** — 内容 6（第 1〜5 部、付録）と横断 6（BookShell、Glossary、SourceRegister、CheckScript、SiteBuild、LandingPage）の 12 のまとまりに分ける（Q1）。
- **Consequences** — 部 = Unit の候補、章 = 検査対象ファイルの 2 段が保たれ、Units Generation は部を単位に Unit を切れる。横断のまとまりは複数の部から参照されるため、変更時に全部への影響を確認する義務が生じる。12 個の依存関係を `components.md` で管理する。
- **Alternatives Rejected** — (B) 教材全体を 1 個: Units Generation で分割できず walking skeleton を切り出せない。(C) 章ごとに 20 個: 依存関係の管理負担に見合う利点が無く、部内の章は同じ規約と同じ出典体系を共有する。

## ADR-002: 章の台帳（Part / Chapter）は BookShell が所有し、各部は内容だけを持つ

- **Context** — HonKit は単一の `SUMMARY.md` だけを目次として読み、`SUMMARY.md` に無い章はビルドされない（practices-discovery の実測）。章のパス・番号・タイトル・対応 FR は検査（`SUMMARY.md` と `docs/**/*.md` の一致、FR → 章ファイルの traceability）の鍵になる。
- **Decision** — Part と Chapter のエンティティは BookShell が所有し、章ファイル名 20 本と付録の見出し形を `components.md` の Chapter Ledger で固定する（Q2、OQ3）。各部は自分の章の本文と手順だけを持つ。
- **Consequences** — 章を追加・改名するときは BookShell（`SUMMARY.md` と台帳）を同じコミットで更新する義務が生じる。traceability の target は台帳のファイルパスで決まる。付録の見出し `# <A〜D>. タイトル` を `check-first.mjs` の許容集合に加える。
- **Alternatives Rejected** — 各部が自分の目次断片を持つ案: HonKit の制約で成立しない。章ファイル名を日本語にする案: URL のパーセントエンコードと検査の複雑化。執筆時に各章で決める案: traceability の target が Units Generation 時点で定まらない。

## ADR-003: 出典行と記録抜粋は SourceRegister が単独で所有する

- **Context** — project.md `## Corrections` は各章末の出典節を求め、team-practices.md は出典行の書式・4 名前空間・食い違いの優先順位・検査を定めた。出典と抜粋は 6 つの部すべてに現れ、所有者が複数だと書式が揺れて `check-first.mjs` の許容集合が定まらない（ステージ定義「所有の曖昧さは設計の匂い」）。
- **Decision** — SourceEntry と RecordExcerpt は SourceRegister が所有し、各部は参照するだけとする（Q5）。方法論の原典（AWS ブログ）は `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?`（原典へのリンク元）経由で引き、URL は 2.1 の本文と付録 C にだけ書く。名前空間は 4 種のまま増やさない（Q4、OQ1）。
- **Consequences** — 出典の書式変更は 1 か所で済み、付録 C は SourceRegister の一覧をそのまま描く。原典の内容は「原典では…と呼ぶ」の形でしか書けないため、原典の詳細は claude 版へのリンクに委ねる。
- **Alternatives Rejected** — 各部が形式を決める案: 揺れる。付録 C にだけ集約する案: 承認済み慣行（章末の出典節）に反する。第 5 の名前空間 `[origin]` を追加する案: team.md の閉じた集合を変え、practices の再承認が必要になる。

## ADR-004: 対訳表は Glossary が所有し、三分類の規則で運用する

- **Context** — NFR7（訳語の揺れ 0 件）と team-practices.md「訳語は 1 語 1 訳」。2.8.2 の `docs/guide/glossary.md` が見出し語として定義する用語（Bolt、Unit、walking skeleton など）は、訳すと読者が原典を検索できなくなる。
- **Decision** — Term は Glossary が所有し、(1) コードスパンで英語のまま、(2) 固有名詞として英語のまま（初出で一文の説明）、(3) 1 語 1 訳の日本語、の三分類で運用する（Q3、OQ2）。`components.md` の Glossary Seed を初期値とし、執筆で新語が出たら同じ表に足す。付録 A はこの表を描いたもの。
- **Consequences** — 各部の執筆者（コンダクター）は初出の用語を表に照らす義務を負う。表の更新は付録 A（AppendixPart）に自動的に伝わる。機械検査はしない（人手規約としてゲートで精読）。
- **Alternatives Rejected** — すべてカタカナに訳す案（Bolt → ボルト）: 原典との対応が切れる。訳さず英語のまま書く案: ペルソナ（方法論を知らない読者）への負担。

## ADR-005: 検査スクリプトとサイトビルドを内容から分離し、ビルドは既存資産のまま使う

- **Context** — team-practices.md は検査を `scripts/check-first.mjs`（依存追加なし）に集約し、walking skeleton に含めると定めた。公開経路は既存の `deploy.yml` と `build-site.mjs` で、変更は 2 点（検査ステップ追加、`permissions` のジョブ単位化）まで。検査はビルド出力（`_site/`）と章ファイルと出典の照合先（タグ `v2.8.2` の木）を入力にする。
- **Decision** — CheckScript（規則 CheckRule を所有）と SiteBuild（BuildTarget を所有）を内容の部から分離し、CheckScript → SiteBuild → BookShell の一方向の依存にする。LandingPage は SiteBuild の入力として独立させ、変更は deployment-execution の概要文更新に限る。
- **Consequences** — 章の変更は検査の再実行だけを要求し、検査規則の変更は章に影響しない。ハンズオン再現（NFR1）は CheckScript の別モードとして HandsOnPart の bash フェンスを抽出する。依存グラフは非循環。
- **Alternatives Rejected** — 外部リンタの導入（practices-discovery Q13 で不採用）。CI だけで検査（ローカルで再現できず、Bolt ごとのゲートで確認できない）。first 版専用のワークフロー（禁止事項）。
