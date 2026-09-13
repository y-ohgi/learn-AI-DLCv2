# Intent Capture & Framing — 質問ファイル

## Sources

- [desc] Initial description: "AI-DLC v1/v2 を知らないエンジニア向けに、AI-DLC v2 を学ぶ HonKit 教材を作り GitHub Pages で公開する"
- [scope] Workflow-selected scope: `docs-book`.

> 回答者について: 依頼者は「一切介入しない」と宣言しているため、以下の回答はコンダクターが依頼者の代理として、既存の教材（`../claude/`、以下「claude 版」）の記述を根拠に記入した。各回答の末尾に根拠箇所を記す。

## Q1. この取り組みが解こうとしているビジネス上の問題は何ですか？

（初期説明には「教材を作って公開する」とだけあり、なぜ必要かが書かれていないため確認します）

A. AI Agent は実務で使っているが AI-DLC を知らないエンジニア向けの、AI-DLC v2 を体系的に学べる日本語教材が存在しない
B. 既存の claude 版教材が AI-DLC 2.7.1 時点の情報に基づいており、2.8.0 以降の配布方法変更（ネイティブ `aidlc` コマンド）を反映していない
C. 「AI に直接書かせた教材」と「AI-DLC のワークフローで作った教材」を読み比べられる実例が存在しない
D. A・B・C のすべて
E. Not yet defined
X. Other (please specify)

[Answer]: D

根拠: claude 版 README「この教材のゴール」「想定読者」（A）、claude 版 README 冒頭の 2026-09-13 追記（B）、ランディングページ `site/index.html` の「2冊の違い」（C）。

## Q2. 読者（顧客）は誰で、どんな痛みを抱えていますか？

A. AI Agent（Claude Code / Cursor / Codex CLI など）を日常的に使うが、AI 駆動開発の方法論には触れてこなかったエンジニア。素の Agent 利用が個人では効くのにチームでスケールしない痛みを持つ。社内外を問わず公開
B. AI-DLC をすでに使っている実務者（リファレンス目的）
C. 導入判断を行う意思決定者（マネージャー・テックリード）
D. Not identified
X. Other (please specify)

[Answer]: A

根拠: claude 版 README「想定読者」表（AI Agent の実務利用 ✅ 必要／方法論の知識 ❌ 不要）、claude 版 1.1「個人では効くが、チームとプロジェクトではスケールしない」。

## Q3. 成功とは何で、どの指標で測りますか？

A. 読了後に読者が AI-DLC v2 を自分の環境にインストールし、1 つのワークフローを承認ゲートまで通せる（ハンズオン完走可能性）
B. 教材中の AI-DLC に関する事実記述が、すべて 2.8.2 の一次情報（公式ドキュメントまたはコード）で裏取りされている（未裏取りの断定ゼロ）
C. GitHub Pages の `/first/` で公開され、`honkit build` が成功し、教材内のリンクがすべて解決する
D. A・B・C のすべて
E. Not yet defined
X. Other (please specify)

[Answer]: D

根拠: claude 版 README「この教材のゴール」（1. 説明できる 2. 判断できる 3. 動かせる → A）、claude 版 README 末尾の注意書きと付録 C「一次情報の出典」（B）、claude 版 3.4「成果物を読む」および本リポジトリの deploy.yml（C）。

## Q4. この取り組みのトリガーは何ですか（なぜ今か）？

A. AI-DLC 2.8.0（2026-09-08）で配布方法がネイティブインストーラに変わり、既存教材の手順が陳腐化した
B. 「AI-DLC そのものを使って教材を作る」ことで、方法論を実地検証し、その記録ごと教材にしたい
C. A と B の両方
D. Not yet defined
X. Other (please specify)

[Answer]: C

根拠: claude 版 README 冒頭の追記（A）、依頼文「AI-DLCv2を元に新しいhonkitを作ってください」および claude 版 2.11「判断基準：成果物を半年後に他人が読むか」（B: 記録に価値がある）。

## Q5. 主要なステークホルダーは誰で、それぞれ何を重視しますか？

A. 依頼者（リポジトリオーナー）: `/first/` での公開完了、事実の正確性、claude 版との住み分け
B. 読者: 短時間で概念とハンズオンを掴めること、手順が現行バージョンで動くこと
C. A と B の両方
D. Not identified
X. Other (please specify)

[Answer]: C

根拠: 依頼文（公開パス・ペルソナ・「間違った情報は取り込まない」）、claude 版 README「読み方」（所要時間の目安）。

## Q6. スコープや優先度を決めるのは誰で、誰が影響を与えますか？

A. 決定者は依頼者。ただし本ワークフロー中は介入しないため、コンダクターが claude 版を参照して代理で判断する。影響者は AI-DLC の一次情報（awslabs/aidlc-workflows 2.8.2 のドキュメントとコード）
B. 決定者はコンダクター単独で、参照先は不問
C. Not identified
X. Other (please specify)

[Answer]: A

根拠: 依頼文「私は一切介入しません」「AI-DLCv2からの質問は既存のhonkitを参照させてください」「1次情報とコードをもとに間違った情報は取り込まない」。

## Q7. コミュニケーション要件や報告の頻度はありますか？

A. 各ステージの成果物・質問ファイル・監査ログを記録ディレクトリ（`first/aidlc/`）に残し、完了時に PR とチャットの要約で報告する。途中の定期報告は不要
B. ステージごとに人間へ報告し、応答を待つ
C. None
X. Other (please specify)

[Answer]: A

根拠: 依頼文「私は一切介入しません。Pagesへのデプロイまで完了させてください」、claude 版 2.9「成果物は git にコミットする」「PR に成果物の差分を含める」。

## Q8. ワークフローは `docs-book` スコープ（14/33 ステージ: 意図把握・スコープ定義・実践発見・要件分析・ドメイン設計・Unit 分解・デリバリー計画・機能設計・執筆・ビルド検証・公開確認）で開始されました。これは意図した製品の境界と一致しますか？

A. 一致する。製品は「HonKit 教材とその公開」のみで、アプリケーションコード・クラウドインフラ・運用面は含まない
B. 別の製品境界を定義する（例: 読者用の演習リポジトリやサンプルアプリも含める）
C. Not yet defined
X. Other (please specify)

[Answer]: A

根拠: 依頼文の成果物定義（honkit と GitHub Pages の公開のみ）、claude 版 1.4「失敗5: 儀式が目的化する」（不要ステージを持ち込まない）。

## Q9. 依頼者から本ワークフロー（および親リポジトリの再構成）に対して与えられた指示の原文は何ですか？

（レビュー所見 R-02/R-01 への対応: Q4〜Q8 の回答を実質的に決めている依頼者の指示を、要約ではなく原文のまま permitted source として登録するための質問です）

A. 初期説明（[desc]）以外に指示は無い
B. Not applicable
X. Other (please specify)

[Answer]: X. Other (please specify) — 依頼者の指示は以下の原文のとおり（2026-09-13、チャットで受領。誤字を含めて逐語）

> AI-DLCv2を元に新しいhonkitを作ってください
>
> https://y-ohgi.github.io/learn-AI-DLCv2/
> このページから現行のhonkitと新規honkitに飛べるようにしてください。
> また、このページではそれぞれの概要を書いてください。
>
> 現行のhonkitは以下のパスになるようにリポジトリのディレクトリ構成ととビルド結果を変更してください
> https://y-ohgi.github.io/learn-AI-DLCv2/claude/
>
> 新規でAI-DLCベースで作るものは以下のパスにしてください。
> https://y-ohgi.github.io/learn-AI-DLCv2/first/
>
> 新規でAI-DLCv2ベースで作るものは私のようなAI-DLCv2/v1を知らない人をペルソナにしたものにしてください。
> 調査とレビューは毎フェーズ行い、1時情報とコードをもとに間違った情報は取り込まないでください。
> AI-DLCv2からの質問は既存のhonkitを参照させてください。
>
> 私は一切介入しません。
> Pagesへのデプロイまで完了させてください。

補足（代理判断の方針）: 「私は一切介入しません」「Pagesへのデプロイまで完了させてください」により、承認ゲートを含むワークフロー中のすべての判断（質問への回答、要約確認、前提の受け入れ、ゲートの承認／差し戻し、学びの保存）をコンダクターが依頼者の代理として行い、その根拠を「AI-DLCv2からの質問は既存のhonkitを参照させてください」に従って既存教材（claude 版）の該当箇所または本原文に求める。

## Consolidated Summary Confirmation

回答の要約（すべて代理回答・根拠は各設問の末尾。改訂1: Q9 を追加）:

- 解く問題: AI-DLC を知らないエンジニア向けの日本語教材が無い／既存 claude 版が 2.7.1 時点で陳腐化／「直接書かせた版」と「AI-DLC で作った版」の比較実例が無い（Q1: D）
- 読者: AI Agent は実務利用するが方法論は未経験のエンジニア。公開教材（Q2: A）
- 成功指標: ハンズオン完走可能／事実記述はすべて 2.8.2 の一次情報で裏取り／`/first/` で公開・ビルド成功・リンク全解決（Q3: D）
- トリガー: 2.8.0 の配布方法変更による陳腐化と、AI-DLC 自体で教材を作って実地検証したい動機（Q4: C）
- ステークホルダー: 依頼者（公開完了・正確性・住み分け）と読者（短時間で掴める・手順が動く）（Q5: C）
- 決定者: 依頼者。ワークフロー中はコンダクターが claude 版を参照して代理判断。影響者は 2.8.2 の一次情報（Q6: A）
- コミュニケーション: 記録ディレクトリに全成果物と監査ログを残し、完了時に PR とチャットで報告（Q7: A）
- 製品境界: `docs-book` スコープどおり、教材とその公開のみ（Q8: A）
- 依頼者の指示の原文を登録し、承認ゲートを含む全判断を代理で行う方針を明記（Q9: X. Other）

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct

## Assumption Confirmation

成果物の `## Assumptions & Open Questions` に残った前提（改訂1・原文どおり）:

- 読者は日本語で読む。初期説明・依頼文・既存教材が日本語であることから推定したもので、多言語対応は求められていないと解釈している。[assumption]
- 依頼者の代理として行った回答（特に SM1〜SM3 の成功指標と製品境界）は、依頼者本人が後日この記録を見て修正する可能性がある。修正が入った場合は新しいワークフロー（intent）で扱う。[assumption]
- claude 版は意図・読者像・ゴールに関する代理回答の根拠に限って用い、AI-DLC の事実記述は claude 版ではなく 2.8.2 の一次情報で裏取りする（Q6 の影響者と整合）。[assumption]
- 開いた問い: SM2 の確認手段として「主張→出典の対応表」を成果物に採用するかは scope-definition で決める。[assumption]
- 開いた問い: claude 版との住み分け（独立執筆／出典明記の再利用／リンク参照のみ）は scope-definition で確定する。[assumption]
- 依頼者以外に、公開前に確認を求めるべきレビュアーは存在しないと解釈している。[assumption]

A. Accept assumptions
B. Convert to follow-up questions

[Answer]: A. Accept assumptions
