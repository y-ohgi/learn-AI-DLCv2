# Delivery Planning Questions

このファイルは、first 版（AI-DLC v2 ベースの新規教材）の 8 つの Unit（`../units-generation/unit-of-work.md`）を、どの順に、どのくらいの大きさの Bolt で作るかを決める質問です。Bolt とは、いくつかの Unit を 1 回の作業で設計・執筆・検査して「動く状態」（ここでは `_site/first/` がビルドされ検査に通る状態）で終える区切りのことです。順序は依存関係（`../units-generation/unit-of-work-dependency.md`）を守ったうえで、価値とリスクの判断で決めます。依頼者は本ワークフローに介入しないため（依頼文 Q9）、コンダクターが依頼者の代理として回答し、根拠を明記します。回答は `[Answer]:` の後に選択肢の英字を書いてください。当てはまらない場合は `X` を選び、続けて内容を書いてください。

参照した上流成果物: `../requirements-analysis/requirements.md`（`requirements`）、`../domain-design/components.md`（`components`）、`../units-generation/unit-of-work.md`（`unit-of-work`）、`../units-generation/unit-of-work-dependency.md`（`unit-of-work-dependency`）、`../units-generation/unit-of-work-story-map.md`（`unit-of-work-story-map`）、`../../ideation/scope-definition/intent-backlog.md`（順序付け方針）、`aidlc/spaces/default/memory/team.md`（`## Way of Working`、`## Walking Skeleton`、`## Deployment`）。Depth は Standard で 6 問です。

## Q1. 何を最初に作りますか？ 薄い一本通し（walking skeleton: 目次と設定・検査スクリプト・章 1 本を `_site/first/` のビルドと検査まで通す最小版）を先に作り、その後はどの基準で並べますか？

A. 最初の Bolt を walking skeleton（U1 骨格と規約 + U2 ビルドと検査 + U3 第 1 部）にし、以後は「事実誤りのリスクが高いものを先に」（U4 概念 → U5 仕組み → U6 ハンズオン → U7 ケーススタディ → U8 付録）。依存関係（U4 → U5 → U6 / U7 → U8）とも一致する
B. 価値の高い順（U6 ハンズオン → U5 仕組み → …）。依存を満たすために U4・U5 を先に済ませる必要があり、実質 A と同じ順になる
C. 目次の順（U3 → U4 → U5 → U6 → U7 → U8）で、walking skeleton は作らない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: team.md `## Walking Skeleton`（Bolt 1 = 骨格 + 章 1 本 + 検査スクリプト、`skeleton: on`）、intent-backlog「順序付け方針」（最初は walking skeleton、次に事実誤りのリスクが最も高い P4 → P5 → P6、P3 は P4 の前提として先行）、`unit-of-work-dependency.md` の DAG。C は team.md に反する。

## Q2. 作業を点数で並べる正式なモデル（WSJF のような「価値 + 緊急度 + リスク低減 ÷ 大きさ」）を使いますか？

A. 使わない。順序は「依存関係を満たす → 事実誤りのリスクが高いものを先に → 付録は最後」の 3 つの言葉の規則で決め、理由を文章で記録する
B. WSJF で点数を付け、リスクに最も重みを置く
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Unit は 8 つで依存 DAG が順序をほぼ決めており（並行できる組は U2 / U3 / U4 と U6 / U7 だけ）、点数化しても順序は変わらない。claude 版 1.4「失敗 5: 儀式の過剰」と同じ趣旨で、読者向けの記録でも言葉の規則のほうが追いやすい。

## Q3. 1 つの Bolt の大きさはどうしますか？

A. 最初の Bolt だけ 3 Unit（U1 + U2 + U3）を束ね、以後は 1 Bolt = 1 Unit（U4、U5、U6、U7、U8 で計 6 Bolt）
B. すべて 1 Bolt = 1 Unit（U1、U2、U3 も別々の Bolt。計 8 Bolt）
C. 2 Bolt（骨格 + 第 1〜2 部、第 3〜5 部 + 付録）
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: team.md `## Walking Skeleton` の完了条件（ローカルビルド + `_site/first/index.html` + `check:first` 通過 + PR ビルド成功）は U1・U2・U3 がそろわないと満たせない。以後 1 Unit ずつにするのは、team.md「gate every Bolt」でコンダクターが代理で精読する単位を部（FR{n}）に揃えるため。C は精読の単位が大きすぎる。

## Q4. 複数の Bolt を同時に進めますか？

A. 進めない。1 つのセッション（コンダクター）が 1 Bolt ずつ、Bolt ごとにゲートで精読・承認してから次へ進む。並行できる組（U6 と U7）も順に作る
B. 依存の無い Unit は並行に進める
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: team.md `## Walking Skeleton`「以降の Bolt ごとにコンダクターが依頼者の代理で成果物を精読・承認」。作業者は 1 セッションで、並行にしても精読が直列になる。

## Q5. チームの外にある、進行を止め得るものは何ですか？（所有者・所要時間・止める Bolt・遅れたときの手）

A. 4 つ。(1) aidlc 2.8.2 のリリース配布（GitHub Releases の `install.sh` と runtime アーカイブ）: 所有者は awslabs、ハンズオン再現（NFR1、Bolt 4）が依存。遅延・削除時は再現を「本セッションでのインストール記録」で代替し、章に注意書きを置く。(2) GitHub Actions と GitHub Pages: 所有者は GitHub、Bolt 1 の PR ビルドと最終公開が依存。障害時はローカルビルドと検査で Bolt を閉じ、公開を待つ。(3) 公開ホストの `y-ohgi.com` への転送: 所有者は依頼者、完了判定（リダイレクト追従後 200）が依存。転送先が変わっても最終ステータスで判定するため影響しない。(4) 方法論の原典（AWS ブログ）の公開: 所有者は AWS、Bolt 2（2.1）が依存。到達不能なら `00-introduction.md` の記述だけを引き、URL は「執筆時点で到達可」と注記する
B. 外部依存は無い
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: requirements.md の Assumptions A2〜A4、components.md の External Dependencies、team.md `## Deployment`（リダイレクト追従後の最終ステータス）。すべて所有者が外部で、遅れたときの手を先に決めておく。

## Q6. この制作でいちばん心配なことは何ですか？（早めに手を打つために）

A. AI-DLC の事実の誤り（第 3 部・第 4 部）。2.8.2 の一次情報で裏取りしていない断定が混ざること。手: U5・U6 を Bolt 3・4 で早めに作り、functional-design の章仕様で「主張 → 出典」を先に列挙し、レビュアーとゲートの精読で確認する。次に心配なのはハンズオンがクリーン環境で再現しないこと（NFR1）で、手: U2 の再現モードを Bolt 1 で用意し、Bolt 4 で実行する
B. 分量が多すぎて読まれないこと
C. 公開が失敗すること
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）「1 次情報とコードをもとに間違った情報は取り込まないでください」と intent-statement SM1・SM2。B は NFR4 で上限を置いた。C は既存の公開経路が claude 版で実証済み。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾）:

- 最初の Bolt は walking skeleton（U1 + U2 + U3）、以後は事実誤りのリスクが高い順（U4 → U5 → U6 → U7 → U8）（Q1: A）
- 点数モデルは使わず、3 つの言葉の規則（依存 → リスク → 付録は最後）で並べる（Q2: A）
- Bolt 1 は 3 Unit、以後は 1 Bolt = 1 Unit で計 6 Bolt（Q3: A）
- Bolt は 1 つずつ直列、Bolt ごとにゲート（Q4: A）
- 外部依存は 4 つ（aidlc リリース配布、GitHub Actions / Pages、公開ホストの転送、原典ブログ）と遅れたときの手（Q5: A）
- いちばんの心配は事実の誤り。U5・U6 を早めに、章仕様で主張 → 出典を先に列挙（Q6: A）

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
