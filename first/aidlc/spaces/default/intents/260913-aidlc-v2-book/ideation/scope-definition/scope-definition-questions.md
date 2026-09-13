# Scope Definition & Prioritization — 質問ファイル

入力: `../intent-capture/intent-statement.md`（Intent Statement）。実現可能性評価・制約レジスタは本スコープでは作成していない（feasibility は SKIP）。

> 回答者について: 依頼者は介入しないため、コンダクターが代理で回答し、根拠を各回答の末尾に記す（根拠は claude 版の該当箇所、または intent-capture の Q9 に登録した依頼文の原文）。

## Q1. 価値を届けられる最小のスコープ（MVP）はどこまでですか？

（Intent Statement の成功指標 SM1〜SM3 を満たすために、初版に必ず含める範囲を決めます）

A. AI-DLC v2 の特徴解説のみ（ハンズオン無し）
B. 特徴解説 + ハンズオン（インストール〜最初の承認ゲート）
C. B に加えて、本書自身を AI-DLC で作った記録（要件・Unit・レビュー所見・監査ログ）をケーススタディとして収録
D. C に加えて、チーム導入ガイドと他手法との比較まで
E. Not yet defined
X. Other (please specify)

[Answer]: C

根拠: 依頼文（Q9）「AI-DLCv2を元に新しいhonkitを作ってください」と Intent Statement の Initiative Trigger 第2項（記録ごと教材にする）。claude 版が第4部でチーム導入・比較を既に扱っており、first 版で重複させる価値は低い（住み分けは Q3）。

## Q2. どの章が Must / Should / Could / Won't ですか？（MoSCoW）

A. Must: 読者の現在地（AI 開発の歴史と方法論が必要になった理由の短い導入）、AI-DLC の概念（方法論 v1 → 実装 v2）、v2 の仕組み（2.8.2 の事実）、ハンズオン、ケーススタディ（本書の制作記録） / Should: 用語集・コマンド早見・つまずきポイント / Could: チーム導入・他手法比較（claude 版へのリンクで代替） / Won't: サンプルアプリ・演習リポジトリ・英語版
B. Must: v2 の仕組みとハンズオンのみ / Should: 概念 / Could: ケーススタディ
C. すべて Must
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: claude 版 README「読み方」（第1部は背景、第2部が本体、第3部がハンズオン）と 1.4 失敗5（儀式・ドキュメントの過剰を避ける）。ケーススタディは Intent Statement の Problem Statement 第3項（比較実例が無い）を直接解く差別化要素なので Must。

## Q3. 既存の claude 版との住み分け（再利用方針）はどうしますか？

（Intent Capture の開いた問い R-07 を確定させます）

A. 独立に書き下ろす。claude 版の文章は再利用せず、重複しやすい話題（歴史・比較・チーム導入）は claude 版の該当章へのリンクで参照する
B. claude 版の章を出典明記のうえ再利用・改稿する
C. 完全に独立し、claude 版へのリンクも置かない
D. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Intent Statement の前提「claude 版は意図・読者像・ゴールの代理回答の根拠に限って用い、AI-DLC の事実記述は 2.8.2 の一次情報で裏取りする」。claude 版は 2.7.1 時点の記述を含むため文章の再利用は事実誤りを持ち込むリスクがある（claude 版 README 冒頭の追記）。ランディングページで 2 冊を比較する意図（Q9 原文）から、リンク参照は残す。

## Q4. 事実記述の裏取り（SM2）をどの成果物で示しますか？

（Intent Capture の開いた問い R-06 を確定させます）

A. 各章末に「出典」節を置き、主張ごとに 2.8.2 の一次情報のファイルパス（`docs/guide/...`、`core/...`、または本リポジトリの実行記録）を列挙する。別途の対応表は作らない
B. 付録に全章分の「主張→出典」対応表を 1 枚作る
C. 本文中の脚注のみ
D. 裏取りは執筆者の内部作業とし、成果物にはしない
X. Other (please specify)

[Answer]: A

根拠: claude 版 2.9「成果物を負債にしないために」（読む人が実在するものだけ作る）、および claude 版 付録 C の方式（出典を章単位で集約）。章末の出典節は読者が辿れ、build-and-test で章ごとに検査できる。

## Q5. 「調査とレビューは毎フェーズ行う」（依頼文）をこのワークフローでどう解釈しますか？

（Intent Capture の所見 R-08 を確定させます）

A. 調査 = 各フェーズの成果物を書く前に、そのフェーズが扱う AI-DLC 2.8.2 の一次情報（ドキュメントとコード）を読み直し、出典を記録する。レビュー = ステージが宣言するレビュアーによる検査に加え、各承認ゲートでコンダクターが代理で成果物を精読する。Construction では build-and-test に事実確認を含める
B. 調査 = Web 検索、レビュー = 依頼者による確認
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）「調査とレビューは毎フェーズ行い、1時情報とコードをもとに間違った情報は取り込まないでください」「私は一切介入しません」。claude 版 4.2「レビューの優先順位」（前提と分解を精読）。

## Q6. ランディングページ（両版への導線と概要）と現行版の `/claude/` への再配置は、このワークフローの範囲に含めますか？

（Intent Capture の所見 R-09 を確定させます）

A. 範囲外（本ワークフロー開始前にリポジトリ側で完了済み）。ただし first 版の完成後にランディングページの first 版の概要文を実態に合わせて更新する作業だけを deployment-execution に含める
B. すべて範囲内として Unit を切る
C. すべて範囲外
X. Other (please specify)

[Answer]: A

根拠: 依頼文（Q9）の要求のうち、ランディングページ作成と `/claude/` 再配置はワークフロー開始前のコミット（`chore: restructure site for two books`）で完了している。概要文の更新は公開確認と一体なので deployment-execution に含める。

## Q7. 章（能力）間の依存関係はありますか？

A. ある。HonKit の骨格（README/SUMMARY/book.json）が全章の前提。概念章は仕組み章の前提。ハンズオン章とケーススタディ章は仕組み章に依存。付録は全章の後
B. 無い。すべて独立に書ける
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: claude 版 SUMMARY.md の部構成（背景 → 本体 → ハンズオン → 導入 → 付録）と、claude 版 README「読み方」。

## Q8. 順序付けの方針は何ですか？

A. 依存関係優先 + walking skeleton（骨格 + 1 章を先に公開経路まで通す）。その後は事実誤りのリスクが高い章（v2 の仕組み・ハンズオン）を先に書く（risk-first）
B. 価値優先（読者が最も読む章から）
C. 順序は問わない
X. Other (please specify)

[Answer]: A

根拠: claude 版 2.5「最初の Construction 実行ステージのゲートが walking skeleton」、2.2「Walking Skeleton」、および Intent Statement SM2（事実誤りが最大のリスク）。

## Q9. 特定の章に結びついた期限はありますか？

A. 無い。ただし本セッション内で公開まで完了させる（依頼文「Pagesへのデプロイまで完了させてください」）
B. ある（具体的な日付）
C. None
X. Other (please specify)

[Answer]: A

根拠: 依頼文（intent-capture Q9）。

## Q10. 成功指標 SM1（読者が自分の環境でインストールし最初のゲートまで到達できる）の検証は、誰がいつ行いますか？

A. コンダクターが build-and-test で、クリーンな一時ディレクトリに aidlc 2.8.2 を導入し、ハンズオン章の手順どおりに進めて最初の承認ゲートに到達することを確認する
B. 読者に委ねる（検証しない）
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: Intent Statement SM1 の合否条件、Q5 の解釈（Construction の build-and-test に事実確認を含める）。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾）:

- MVP は「特徴解説 + ハンズオン + 本書自身の制作記録（ケーススタディ）」まで（Q1: C）
- Must: 現在地の導入・概念・v2 の仕組み・ハンズオン・ケーススタディ / Should: 用語集・コマンド早見・つまずき / Could: チーム導入・比較（claude 版へリンク） / Won't: サンプルアプリ・演習リポジトリ・英語版（Q2: A）
- claude 版とは独立執筆。重複話題はリンク参照、文章の再利用はしない（Q3: A）
- 事実の裏取りは各章末の「出典」節（一次情報のファイルパス）で示す（Q4: A）
- 毎フェーズの調査 = 一次情報の読み直しと出典記録、レビュー = レビュアー + ゲートでの代理精読、build-and-test に事実確認（Q5: A）
- ランディングページ作成と /claude/ 再配置は範囲外（完了済み）。first 版の概要文更新だけ deployment-execution に含める（Q6: A）
- 依存: 骨格 → 概念 → 仕組み → ハンズオン/ケーススタディ → 付録（Q7: A）
- 順序: 依存関係優先 + walking skeleton、その後 risk-first（Q8: A）
- 期限: 本セッション内に公開まで（Q9: A）
- SM1 の検証はコンダクターが build-and-test でクリーン環境により実施（Q10: A）

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
