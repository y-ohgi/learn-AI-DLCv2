# Units Generation Questions

このファイルは、first 版（AI-DLC v2 ベースの新規教材）の 12 の構成要素（`../domain-design/components.md`）を、Construction で 1 つずつ作る「Unit（作業のまとまり）」にどう束ねるかを決める質問です。ここでは「何が何に依存するか」（トポロジー）だけを決め、「どの順に作るか」は次の Delivery Planning で決めます。依頼者は本ワークフローに介入しないため（依頼文 Q9）、コンダクターが依頼者の代理として回答し、根拠を明記します。回答は `[Answer]:` の後に選択肢の英字を書いてください。当てはまらない場合は `X` を選び、続けて内容を書いてください。

参照した上流成果物: `../domain-design/components.md`（12 コンポーネント、依存、Chapter 台帳）、`../domain-design/decisions.md`（ADR-001〜005）、`../requirements-analysis/requirements.md`（FR1〜FR8）、`../practices-discovery/team-practices.md`（walking skeleton = 骨格 + 章 1 本 + 検査スクリプト、Bolt は squash で統合ブランチへ）。Depth は Standard で 5 問です。

## Q1. Unit の境界はどの基準で切りますか？

A. 部（第 1〜5 部・付録）を 1 Unit ずつにし、横断の構成要素は「骨格と規約」（BookShell + Glossary + SourceRegister）と「ビルドと検査」（CheckScript + SiteBuild + LandingPage）の 2 Unit に束ねる。合計 8 Unit
B. 12 コンポーネントをそれぞれ 1 Unit にする（12 Unit）
C. 内容（第 1〜5 部 + 付録）を 1 Unit、横断を 1 Unit の 2 Unit にする
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: ADR-001（部 = プロト Unit = FR{n}）と team-practices.md の walking skeleton（骨格 + 章 1 本 + 検査スクリプト）。A なら walking skeleton は「骨格と規約」+「ビルドと検査」+ 第 1 部の 3 Unit で切り出せる。B は Glossary と SourceRegister が単独で「動く」成果物を持たず（付録 A・C や README の一部として現れる）、Unit として完了条件を置きにくい。C は Bolt ごとのゲート（team-practices）で精読する単位が大きすぎる。

## Q2. Unit の粒度と種類（kind）はどうしますか？

（AI-DLC は Unit に kind を付け、Construction でどの設計文書を要求するかを決めます。`service` = 配備される実行物、`spec` = その場で使われる契約・仕様、`ui` = 画面、`packaging` = ビルド・配布の成果物、`library` = 単独では動かない再利用コード）

A. 内容の 6 Unit（第 1〜5 部、付録）は `spec`（章 Markdown はその場で読まれる文書で、ビジネスロジックやスケーラビリティ設計を持たない）。「骨格と規約」は `packaging`（README・SUMMARY・book.json と規約文書）。「ビルドと検査」は `library`（`scripts/check-first.mjs` は Node の実行スクリプトだが単独で配備される実行物ではなく、`deploy.yml` の変更は 2 点）。複雑度は第 3 部が L、第 5 部が M、他は S
B. すべて `spec`
C. kind を付けない（全 Unit が完全な設計文書の組を要求される）
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: ステージ定義の kind の定義。C にすると各章 Unit にスケーラビリティ設計などコードのための文書が求められ、docs-book スコープ（nfr 系ステージは SKIP）と食い違う。「ビルドと検査」を `library` にするのは、`check-first.mjs` が `npm run check:first` から呼ばれる再利用コードで、公開される実行物ではないため（`packaging` は骨格側に使う）。

## Q3. Unit 間の依存はどう置きますか？ 独立した Unit の並行作業は許しますか？

A. 依存は「参照する」方向で置く: 内容の 6 Unit → 骨格と規約（章は台帳・対訳表・出典規約に従う）、ビルドと検査 → 骨格と規約（SUMMARY と章の一致を検査する）、第 3 部 → 第 2 部（用語の定義を前提にする）、第 4 部 → 第 3 部（仕組みの説明を前提にする）、第 5 部 → 第 3 部（記録の読み方は仕組みの説明を前提にする）、付録 → 第 1〜5 部（横断して集約する）、第 1 部 → 骨格のみ。依存の無い Unit 同士（例: 第 1 部と第 2 部、ビルドと検査と第 2 部）の並行作業は許す
B. 第 1 部 → 第 2 部 → 第 3 部 → 第 4 部 → 第 5 部 → 付録 の一直線にし、並行は許さない
C. 骨格以外は互いに独立とし、すべて並行可能にする
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: components.md の depends_on（各部 → BookShell / Glossary / SourceRegister、AppendixPart → HandsOnPart、CheckScript → BookShell / SourceRegister）と requirements.md NFR5（前方参照しない: 後の章は前の章の用語だけで読める）。B は intent-backlog の依存（P4 → P5、P4 → P6）より厳しく、並行の余地を無くす。C は NFR5 を守れない（第 4 部が第 3 部の説明に依存する）。Bolt の順序（何を先に作るか）はここでは決めず Delivery Planning に委ねる。

## Q4. Unit 間の統合点（インターフェース）は何ですか？

A. 4 つ。(1) Chapter 台帳（`components.md` の Chapter Ledger。章のパス・番号・タイトル・FR）: 骨格と規約が所有し、内容の各 Unit と検査が従う。(2) 対訳表（Glossary Seed）: 骨格と規約が所有し、内容の各 Unit が従い、付録が描く。(3) 出典行と抜粋の書式（SourceRegister）: 骨格と規約が所有し、内容の各 Unit が書き、検査が検査し、付録が一覧にする。(4) `_site/` のビルド出力: ビルドと検査が生成・検査する。統合点はすべて Markdown の規約とファイルパスで、API やイベントは無い
B. 統合点は `SUMMARY.md` だけ
C. 統合点は定義しない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: components.md のエンティティ所有（Part / Chapter は BookShell、Term は Glossary、SourceEntry / RecordExcerpt は SourceRegister、CheckRule は CheckScript）。Contract Design ステージは docs-book スコープで SKIP のため、統合点はここで文章として固定し、functional-design が章仕様でこれに従う。

## Q5. 配備の形はどうしますか？

A. すべての Unit は 1 冊の HonKit 教材として一括で配備される（`_site/first/` として 1 回のビルド・1 回の公開）。Unit ごとの個別配備は無く、Bolt ごとの完了はローカルビルドと PR 上のビルドで確認し、公開は最後に 1 回（team-practices `## Way of Working`）。ただし「ビルドと検査」の変更（`deploy.yml`、`scripts/`）は親リポジトリの CI に即時反映される
B. 部ごとに別のブック（別の `/first-part1/` など）として配備する
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: project.md `## Mandated`（公開先は `/first/`、既存ワークフローで公開）と team-practices.md `## Deployment`（main への取り込みは最後に 1 本の PR）。B は依頼文（Q9）の公開先パスと合わない。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾）:

- Unit は 8 つ: 骨格と規約（BookShell + Glossary + SourceRegister）、ビルドと検査（CheckScript + SiteBuild + LandingPage）、第 1〜5 部、付録（Q1: A）
- kind: 内容 6 Unit は spec、骨格と規約は packaging、ビルドと検査は library。複雑度は第 3 部 L、第 5 部 M、他 S（Q2: A）
- 依存は参照方向（内容 → 骨格、検査 → 骨格、第 3 部 → 第 2 部、第 4 部・第 5 部 → 第 3 部、付録 → 第 1〜5 部）。独立 Unit の並行は可（Q3: A）
- 統合点は Chapter 台帳・対訳表・出典書式・`_site/` の 4 つ（Q4: A）
- 配備は 1 冊一括、公開は最後に 1 回（Q5: A）
- 分解計画は Approve Plan で承認済み

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
