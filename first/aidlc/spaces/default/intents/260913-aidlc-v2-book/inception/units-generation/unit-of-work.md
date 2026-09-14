# Units of Work — AI-DLC v2 教材（first 版）

入力: `../domain-design/components.md`（`components`: 12 コンポーネント、Chapter 台帳、Glossary Seed）、`../domain-design/decisions.md`（`decisions`: ADR-001〜005）、`../requirements-analysis/requirements.md`（`requirements`: FR1〜FR8）、`units-generation-questions.md`（Q1〜Q5、Approve Plan）。Unit（作業のまとまり）は Construction で 1 つずつ設計・執筆・検査される単位で、ここでは何を含み何に依存するか（トポロジー）だけを定め、作る順序は Delivery Planning が決める。

## Unit 一覧

| Unit ID | Directory | Unit 名 | 含むコンポーネント | kind | 複雑度 | 配備 |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | `u1-book-shell` | 骨格と規約 | BookShell、Glossary、SourceRegister | packaging | S | embedded（1 冊の一部） |
| U2 | `u2-build-and-check` | ビルドと検査 | CheckScript、SiteBuild、LandingPage | library | M | shared（親リポジトリの `scripts/` と `deploy.yml`） |
| U3 | `u3-context` | 第 1 部 読者の現在地 | ContextPart | spec | S | embedded |
| U4 | `u4-concepts` | 第 2 部 AI-DLC の概念 | ConceptsPart | spec | S | embedded |
| U5 | `u5-mechanics` | 第 3 部 v2 の仕組み | MechanicsPart | spec | L | embedded |
| U6 | `u6-handson` | 第 4 部 ハンズオン | HandsOnPart | spec | M | embedded |
| U7 | `u7-case-study` | 第 5 部 ケーススタディ | CaseStudyPart | spec | M | embedded |
| U8 | `u8-appendix` | 付録 A〜D | AppendixPart | spec | S | embedded |

kind の意味（ステージ定義）: `spec` = その場で読まれる契約・仕様（章 Markdown。ビジネスロジックやスケーラビリティ設計を持たない）、`packaging` = ビルド・配布の成果物（README・SUMMARY・book.json と規約文書）、`library` = 単独では配備されない再利用コード（`scripts/check-first.mjs`）。

## Unit の定義

### U1 骨格と規約（`u1-book-shell`、packaging、S）

- **境界**: `first/README.md`、`first/SUMMARY.md`、`first/book.json`、`first/.bookignore`（既存維持）と、章の台帳（Chapter Ledger）、対訳表（Glossary Seed）、出典行・抜粋の書式（SourceRegister）。
- **責務と納品物**: README（FR1.1）、SUMMARY と book.json（FR1.2）、台帳・対訳表・出典書式の確定版（他 Unit が従う規約。`components.md` の該当節を functional-design で章仕様に写す）。
- **制約**: SUMMARY.md は claude 版と同形（`## 第N部 …`、`* [N.M タイトル](docs/…)`、付録は `## 付録` + `* [A. 用語集](…)`）。`.bookignore` で `.claude` と `aidlc` を除外し続ける。README は Chapter ではない（ADR-002）。
- **実装メモ**: walking skeleton の中核。SUMMARY.md には全 20 章を最初から列挙せず、章ファイルができた Unit の分だけ載せる（HonKit は欠落ファイルを警告なしで通すため、未執筆の章を載せるとリンク切れが検査で落ちる）。

### U2 ビルドと検査（`u2-build-and-check`、library、M）

- **境界**: 親リポジトリの `scripts/check-first.mjs`、`package.json` の `check:first`、`.github/workflows/deploy.yml` の 2 点変更（`npm run check:first` の 1 ステップ追加、`permissions` のジョブ単位化）、`site/index.html` の first 版概要文（deployment-execution で更新）。
- **責務と納品物**: 検査規則（CheckRule）の実装: blocking（内部リンク、SUMMARY と章の一致、必須節、フェンス言語、`mermaid` 禁止、引用ラベル、ルート絶対パス禁止、出典行の書式と参照先の実在、付録見出し、文字数 NFR4）と advisory（`_site/claude/` の内部リンク、外部 URL）、ハンズオン再現モード（NFR1: bash フェンスの抽出と一時ディレクトリでの実行）、終了コード。
- **制約**: Node 22 標準 API のみ、依存追加なし（team-practices）。`deploy.yml` の変更は 2 点まで（project.md `## Mandated`）。`[2.8.2]` の照合先はタグ `v2.8.2` の木（`git cat-file -e v2.8.2:<path>`）。
- **実装メモ**: 検査対象の規約は U1 が確定させる。U1 の章が 1 本も無い状態でも `_site/first/index.html` の存在検査が動くこと。

### U3 第 1 部 読者の現在地（`u3-context`、spec、S）

- **境界**: `docs/01-context/01-where-you-are.md`（1.1）。
- **責務と納品物**: FR2.1 の必須内容 (1)〜(6) と FR8.1 の導線（claude 版への `.html` リンク）。章テンプレート・出典節・対訳表に従う。
- **制約**: AI 開発の歴史と種類は要点のみ（数文）、詳細は claude 版 第 1 部へリンク。文章の再利用禁止。
- **実装メモ**: walking skeleton の「章 1 本」の候補（Delivery Planning で確定）。

### U4 第 2 部 AI-DLC の概念（`u4-concepts`、spec、S）

- **境界**: `docs/02-concepts/01-what-is-aidlc.md`（2.1）、`docs/02-concepts/02-terms-in-2-8-2.md`（2.2）。
- **責務と納品物**: FR3.1（原典・実装・v2/v1 の呼称・リポジトリの歩み）、FR3.2（2.8.2 が定義する用語）。対訳表の (2)(3) 分類の用語の初出を担う。
- **制約**: 「v1」は断定しない（project.md `## Decided`）。原典は `[2.8.2] docs/guide/00-introduction.md § What is AI-DLC?` 経由、URL は 2.1 本文と付録 C にのみ。配布方式の転換点は 2.7.2 初出・2.8.0 baseline（CHANGELOG § [2.7.0] § [2.7.1] § [2.7.2] § [2.8.0] § [2.8.1]）。

### U5 第 3 部 v2 の仕組み（`u5-mechanics`、spec、L）

- **境界**: `docs/03-mechanics/01-install-and-config.md` … `08-construction-flow.md`（3.1〜3.8）。
- **責務と納品物**: FR4.1〜FR4.8。各章は概念と手順の説明 + 本ワークフローの記録からの短い抜粋（`[record]`）。TypeScript コードは引用せず、関数名・サブコマンド名を出典に書く。
- **制約**: ディレクティブ種別は `core/tools/aidlc-orchestrate.ts` の kind の全集合と揃える。`aidlc config` が作るのは `.claude/CLAUDE.md`（ルートの `CLAUDE.md` ではない）。抜粋はマスキング規約に従う。
- **実装メモ**: 事実誤りのリスクが最も高い Unit。functional-design の章仕様で主張 → 出典を先に列挙する。

### U6 第 4 部 ハンズオン（`u6-handson`、spec、M）

- **境界**: `docs/04-handson/01-setup.md`（4.1）、`docs/04-handson/02-first-workflow.md`（4.2）。
- **責務と納品物**: FR5.1、FR5.2。bash フェンスの手順（HandsOnStep）と期待出力、`## つまずきポイント` 節、Bedrock 既定と他プロバイダの手順。
- **制約**: `install.sh` は `--version 2.8.2` 固定、逐語コマンド + 確認手順（ADR-005 セキュリティ上の含意）。到達点は「Claude Code 上で最初の質問が提示される」（A8）。手順は U2 の再現モードでクリーン環境により検査される（NFR1）。

### U7 第 5 部 ケーススタディ（`u7-case-study`、spec、M）

- **境界**: `docs/05-case-study/01-planning.md`（5.1）、`02-review-and-hub-spoke.md`（5.2）、`03-reading-the-record.md`（5.3）。
- **責務と納品物**: FR6.1〜FR6.3。記録ファイルからの抜粋（RecordExcerpt）+ `[record]` 出典、各節末の「自分のワークフローで同じものを見る場所」、逸脱と限界の節。
- **制約**: マスキング規約。抜粋の範囲を明示。依頼者の指示の逐語引用は原文どおり。
- **実装メモ**: 本ワークフローの記録は Construction 中も増えるため、抜粋する記録の締め（どの時点までを載せるか）を functional-design で決める。

### U8 付録 A〜D（`u8-appendix`、spec、S）

- **境界**: `docs/99-appendix/01-glossary.md`（A）、`02-commands.md`（B）、`03-sources.md`（C）、`04-troubleshooting.md`（D）。
- **責務と納品物**: FR7.1〜FR7.4。A は Glossary の Term を表に描く（初出章は R-10 のとおり Chapter に振り直す）、B は `aidlc --help` / `aidlc engine --help`（`[runtime]`）と `docs/guide/12-cli-commands.md`（`[2.8.2]`）で確認したコマンドのみ、C は全章の SourceEntry の一覧と GitHub URL の組み立て方と原典 URL、D は 4.1・4.2 の再掲と `[record]` の事象。
- **制約**: 文字数の下限なし・上限のみ（NFR4 (b)）。付録見出しは `# <A〜D>. タイトル`。
- **実装メモ**: U3〜U7 の完成後に集約する。

## 配備モデル

すべての Unit は 1 冊の HonKit 教材として `_site/first/` に一括でビルド・公開される（Q5）。U2 だけは親リポジトリの `scripts/` と `deploy.yml` を変更するため、PR 上の CI に即時反映される（shared）。Unit ごとの個別配備は無い。
