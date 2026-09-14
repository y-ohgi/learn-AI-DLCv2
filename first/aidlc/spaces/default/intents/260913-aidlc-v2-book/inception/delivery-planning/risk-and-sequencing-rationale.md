# Risk and Sequencing Rationale — AI-DLC v2 教材（first 版）

入力: `bolt-plan.md`、`../units-generation/unit-of-work-dependency.md`（`unit-of-work-dependency`）、`../requirements-analysis/requirements.md`（`requirements`: NFR1〜NFR8、A6〜A8）、`../../ideation/scope-definition/intent-backlog.md`（順序付け方針）、`delivery-planning-questions.md`（Q1〜Q6）。

Bolt（いくつかの Unit を 1 回で設計・執筆・検査して動く状態で終える区切り）の順序は、依存関係が許す範囲で価値とリスクの判断により決める。ここではその「なぜ」を書く。

## 使った規則

点数モデル（WSJF: 価値 + 緊急度 + リスク低減 ÷ 大きさ）は使わない（Q2）。Unit は 8 つで依存 DAG が順序をほぼ決めており、点数化しても順序は変わらない。代わりに 3 つの言葉の規則を上から順に適用する。

1. **依存を満たす** — `unit-of-work-dependency.md` の DAG に逆行しない。
2. **事実誤りのリスクが高いものを先に** — 依頼文「1 次情報とコードをもとに間違った情報は取り込まない」と SM2。AI-DLC の事実を最も多く含む部を早く書き、レビューと検査で誤りを早く見つける（risk-first。Cohn の「リスクの高いものを先に」の考え方）。
3. **付録は最後** — 全章を横断して集約するため（DAG でも最後）。

規則 2 は 2.7 の DAG が決めない経済的判断で、intent-backlog「順序付け方針」（最初は walking skeleton、次に P4 → P5 → P6、P3 は P4 の前提として先行）を引き継ぐ。

## walking skeleton を先にする理由（Bolt 1）

- team.md `## Walking Skeleton`（`skeleton: on`）: 目次と設定・検査スクリプト・章 1 本を公開経路の手前（PR 上のビルド）まで通し、部品がつながることを先に証明する。
- U2（検査スクリプト）を Bolt 1 に入れるのは、Testing Contract が「最初の検査より前に実行手段がそろっていること」を求めるため（team-practices `## Walking Skeleton`）。以後の Bolt は `npm run check:first` を最初から使える。
- 章 1 本に U3（第 1 部、1 章）を選ぶのは、依存が U1 だけで最も薄く、AI-DLC の事実主張が最も少ない（事実誤りのリスクが低く、骨格の検証に集中できる）ため。

## Bolt 2〜6 の順序の理由

| Bolt | Unit | 規則 1（依存） | 規則 2（リスク） | 補足 |
| --- | --- | --- | --- | --- |
| 2 | U4 概念 | U5 の前提（用語） | 中: 「v1」の扱い、原典の引き方、歩みの年月 | U3 と独立だが、Bolt 1 に入れると walking skeleton が太る |
| 3 | U5 仕組み | U4 の後、U6 / U7 の前 | 最高: 8 章すべてが 2.8.2 の事実。数値・パス・種別の誤りが最も起きやすい | 最初の「通常 Bolt」の中で最初に置き、レビューの学びを U6 / U7 に活かす |
| 4 | U6 ハンズオン | U5 の後 | 高: 手順の再現性（NFR1）。クリーン環境で落ちる手順を早く見つける | U7 と独立だが、再現に外部（リリース配布）が絡むため先に |
| 5 | U7 ケーススタディ | U5 の後 | 中: 記録の抜粋の正確さとマスキング。記録は Construction 中も増えるので、締めを早く決めすぎない | U6 の後にすることで Bolt 4 の再現ログも抜粋の候補になる |
| 6 | U8 付録 | U3〜U7 の後 | 低: 集約 | — |

トポロジカル順序からの逸脱は無い。並行できる組（U2 / U3 / U4、U6 / U7）は直列にした（Q4: 作業者が 1 セッションで、精読が直列になるため）。

## Units Generation のレビュー所見への回答（DAG に関する説明）

- **CheckScript → HandsOnPart の辺（R-01）**: `components.md` の CheckScript は HandsOnPart に依存する（bash フェンスの再現）が、`unit-of-work-dependency.md` には u2 → u6 の辺を置いていない。理由: 再現モードは実行時に `docs/04-handson/*.md` の bash フェンスを読む「テスト入力」であり、章が無ければ「対象なし」を報告して終了する設計にする。U2 を先に作れることが walking skeleton の前提で、構築時の依存ではない。Bolt 4 の完了条件（再現モードの全通過）で両者の契約を検証する。
- **辺の由来（R-03）**: u5 → u4、u6 → u5、u7 → u5、u8 → u3〜u7 は `components.md` にはなく、NFR5（前方参照なし）と intent-backlog の依存（P4 → P5、P4 → P6）から導いた。u4 → u3 と u7 → u6 を置かないのは、第 2 部は第 1 部の内容を前提にせず（第 1 部は読み方の案内）、第 5 部は第 4 部の手順を前提にしない（記録の読み方は第 3 部の説明で足りる）ため。
- **順序表現（R-05）**: `unit-of-work.md` の「walking skeleton の中核」「章 1 本の候補」「最後」は本ステージで確定した順序の先取りだった。確定はここ（Bolt 1 = U1 + U2 + U3、Bolt 6 = U8）で行う。

## 主なリスクと手（Q6）

| リスク | 影響 | 手 | どの Bolt で |
| --- | --- | --- | --- |
| AI-DLC の事実の誤り（数値・パス・挙動） | SM2 を満たさない。読者に誤情報 | functional-design で章ごとに「主張 → 出典」を先に列挙し、出典はタグ `v2.8.2` の木で実在確認。レビュアーとゲートの代理精読 | Bolt 2〜5（特に 3） |
| ハンズオンがクリーン環境で再現しない | SM1 を満たさない | U2 の再現モードを Bolt 1 で用意し、Bolt 4 で実行。root 制約など本セッション固有の事情は章に書かず、読者の手順で再現する | Bolt 1、4 |
| 章数 20・文字数の上限に収まらない（A6） | NFR4 違反 | 章仕様で分量を見積もり、超過が見えたら必須内容の削減か上限改定をゲートで代理提案（章の分割はしない） | 各 Bolt の functional-design |
| 記録が Construction 中も増え、ケーススタディの締めが決まらない | 5.x の抜粋が古くなる | Bolt 5 の functional-design で「Bolt 4 完了時点までの記録」を締めとし、以後の出来事は 5.3 の末尾に「その後」として一段落で追記 | Bolt 5 |
| センサーの偽陰性（traceability が FR ID を読まない） | ゲートで advisory 失敗が続く | 成果物側の対処は無く受容。ケーススタディ 5.3 に書く | 全 Bolt |
