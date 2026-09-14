# Requirement → Unit Map — AI-DLC v2 教材（first 版）

入力: `unit-of-work.md`、`unit-of-work-dependency.md`、`../requirements-analysis/requirements.md`（`requirements`）。User Stories ステージは docs-book スコープで SKIP のため、`USx.y` の代わりに requirements.md の `FR` ID（部 = `FR{n}`、章 = `FR{n}.{m}`）を実装 Unit に対応付ける。

## 対応表

| Requirement ID | Unit ID | Directory | 種別 |
| --- | --- | --- | --- |
| FR1 | U1 | `u1-book-shell` | 部全体（章 FR の親） |
| FR1.1 | U1 | `u1-book-shell` | 章 |
| FR1.2 | U1 | `u1-book-shell` | 章 |
| FR1.3 | U2 | `u2-build-and-check` | 章 |
| FR2 | U3 | `u3-context` | 部全体（章 FR の親） |
| FR2.1 | U3 | `u3-context` | 章 |
| FR3 | U4 | `u4-concepts` | 部全体（章 FR の親） |
| FR3.1 | U4 | `u4-concepts` | 章 |
| FR3.2 | U4 | `u4-concepts` | 章 |
| FR4 | U5 | `u5-mechanics` | 部全体（章 FR の親） |
| FR4.1 | U5 | `u5-mechanics` | 章 |
| FR4.2 | U5 | `u5-mechanics` | 章 |
| FR4.3 | U5 | `u5-mechanics` | 章 |
| FR4.4 | U5 | `u5-mechanics` | 章 |
| FR4.5 | U5 | `u5-mechanics` | 章 |
| FR4.6 | U5 | `u5-mechanics` | 章 |
| FR4.7 | U5 | `u5-mechanics` | 章 |
| FR4.8 | U5 | `u5-mechanics` | 章 |
| FR5 | U6 | `u6-handson` | 部全体（章 FR の親） |
| FR5.1 | U6 | `u6-handson` | 章 |
| FR5.2 | U6 | `u6-handson` | 章 |
| FR6 | U7 | `u7-case-study` | 部全体（章 FR の親） |
| FR6.1 | U7 | `u7-case-study` | 章 |
| FR6.2 | U7 | `u7-case-study` | 章 |
| FR6.3 | U7 | `u7-case-study` | 章 |
| FR7 | U8 | `u8-appendix` | 部全体（章 FR の親） |
| FR7.1 | U8 | `u8-appendix` | 章 |
| FR7.2 | U8 | `u8-appendix` | 章 |
| FR7.3 | U8 | `u8-appendix` | 章 |
| FR7.4 | U8 | `u8-appendix` | 章 |
| FR8 | U3 | `u3-context` | 部全体（章 FR の親） |
| FR8.1 | U3 | `u3-context` | 章 |

## 複数 Unit にまたがる要件（横断）

- FR1.3（公開経路）は U2 が `_site/first/` の生成と `deploy.yml` を担い、公開そのものは deployment-execution で行う。ランディングページの概要文更新も U2 の LandingPage が担う。
- FR7.1（付録 A 用語集）と FR7.3（付録 C 出典一覧）は章ファイルを U8 が書くが、元データ（対訳表、出典書式）は U1 が所有する（ADR-002、ADR-003）。
- NFR1〜NFR8 は Unit ではなく検査（U2）とゲートの精読で横断的に満たす。NFR1（ハンズオン再現）は U6 の手順を U2 の再現モードが検査する。

## Unit 内の実装順序

| Unit | 章の順序 | 理由 |
| --- | --- | --- |
| U1 | README → SUMMARY / book.json → 台帳・対訳表・出典書式の確定 | 他 Unit が従う規約を先に固定する |
| U2 | 検査スクリプトの blocking 規則 → advisory 規則 → 再現モード → `deploy.yml` の 2 点変更 → 概要文更新（deployment-execution） | walking skeleton で blocking 規則が必要。再現モードは U6 の後でよい |
| U3 | 1.1 のみ | — |
| U4 | 2.1 → 2.2 | 2.2 の用語は 2.1 の位置づけを前提にする |
| U5 | 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7 → 3.8 | 章番号順 = 前方参照なし（NFR5） |
| U6 | 4.1 → 4.2 | 環境準備 → 最初のワークフロー |
| U7 | 5.1 → 5.2 → 5.3 | 計画 → レビュー → 記録の読み方 |
| U8 | A → C → B → D | 用語集と出典一覧は全章の集約、コマンド早見とつまずきは独立 |

## 網羅性の確認

- requirements.md の FR ID は 32 件（FR1〜FR8 と章の FR）。すべて 1 つの Unit に割り当てた（上表）。
- 8 Unit すべてに 1 件以上の FR が割り当てられている（U1: FR1 系、U2: FR1.3、U3: FR2 系と FR8 系、U4: FR3 系、U5: FR4 系、U6: FR5 系、U7: FR6 系、U8: FR7 系）。
