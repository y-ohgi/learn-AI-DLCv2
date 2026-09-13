# Scope Document — AI-DLC v2 教材（first 版）

入力: `../intent-capture/intent-statement.md`（Intent Statement）。本書は Intent Statement の Problem Statement・Target Customer・Success Metrics（SM1〜SM3）を、初版で何を作り何を作らないかに落としたものである。

## スコープ境界（In / Out）

| 区分 | 内容 | 根拠 |
| --- | --- | --- |
| In | HonKit 教材 `first/`（README・SUMMARY・book.json・章 Markdown）と、その GitHub Pages `/first/` への公開 | Intent Statement「user-confirmed product boundary」、Q1 |
| In | 読者の現在地を示す短い導入（AI 開発の歴史と、方法論が必要になった理由） | Q2（Must） |
| In | AI-DLC の概念（方法論 v1 → 実装 v2、用語） | Q2（Must） |
| In | AI-DLC v2 の仕組み（2.8.2 の一次情報に基づく: インストールと設定、エンジンとコンダクター、フェーズとステージ、スコープとコンポーザー、エージェント、ゲート、監査、学習ループ） | Q2（Must）、SM2 |
| In | ハンズオン（`install.sh` → `aidlc config` → `aidlc doctor` → `/aidlc` → 最初の承認ゲート） | Q2（Must）、SM1 |
| In | ケーススタディ: 本書自身を AI-DLC で制作した記録（compose 提案、質問と代理回答、レビュー所見と差し戻し、監査ログ、代理判断ログ） | Q1（C）、Q2（Must） |
| In（Should） | 用語集、コマンド早見、つまずきポイント | Q2 |
| In（deployment-execution の一部） | first 版完成後にランディングページの first 版概要文を実態に合わせて更新すること | Q6 |
| Out | チーム導入ガイド、他手法との詳細比較（claude 版 第4部・2.12 へのリンクで代替） | Q2（Could）、Q3 |
| Out | サンプルアプリ、読者用の演習リポジトリ、英語版、動画 | Q2（Won't） |
| Out | ランディングページの新規作成と現行版の `/claude/` 再配置（ワークフロー開始前に完了済み） | Q6 |
| Out | アプリケーションコード、クラウドインフラ、運用面 | Intent Statement「user-confirmed product boundary」 |

## 住み分けと再利用方針

- first 版は claude 版とは独立に書き下ろす。claude 版の文章は再利用・改稿しない。（Q3）
- 重複しやすい話題（AI 開発の歴史の詳細、他手法との比較、チーム導入）は、first 版では要点のみ述べ、claude 版の該当章へリンクで参照する。（Q3）
- claude 版は意図・読者像・ゴールに関する代理回答の根拠として用い、AI-DLC の事実記述の根拠にはしない。事実は 2.8.2 の一次情報（`awslabs/aidlc-workflows` のドキュメントとコード、および本リポジトリの実行記録）で裏取りする。（Intent Statement の前提、Q3）

## 事実の裏取り方式（SM2 の実現）

- 各章の末尾に「出典」節を置き、章内の事実主張ごとに一次情報のファイルパス（例: `docs/guide/05-scopes-and-depth.md`、`core/tools/aidlc-orchestrate.ts`、`first/aidlc/spaces/default/intents/.../audit/*.md`）を列挙する。（Q4）
- 別途の「主張→出典」対応表は作らない。build-and-test で章ごとに出典節の存在と参照先の実在を検査する。（Q4、Q5）
- 一次情報で確認できない主張は書かない。推定を書く場合は「推定」と明示する。（依頼文「間違った情報は取り込まない」）

## 毎フェーズの調査とレビュー（依頼文の解釈）

- 調査: 各フェーズの成果物を書く前に、そのフェーズが扱う AI-DLC 2.8.2 の一次情報を読み直し、参照したパスを成果物または出典節に記録する。（Q5）
- レビュー: ステージが宣言するレビュアー（advisory / adversarial）による検査に加え、各承認ゲートでコンダクターが依頼者の代理として成果物を精読し、差し戻し理由または承認理由を判断ログに残す。（Q5）
- Construction では build-and-test に、`honkit build` の成功・リンク検査・章末出典節の検査・ハンズオン手順のクリーン環境での再現（SM1）を含める。（Q5、Q10）

## 成功指標の検証

| 指標 | 検証者 | タイミング | 方法 |
| --- | --- | --- | --- |
| SM1 ハンズオン再現性 | コンダクター | build-and-test | クリーンな一時ディレクトリに aidlc 2.8.2 を導入し、ハンズオン章の手順どおりに最初の承認ゲートへ到達する（Q10） |
| SM2 事実の裏取り | コンダクター + レビュアー | functional-design（章仕様）、build-and-test | 章末出典節の検査、出典パスの実在確認（Q4） |
| SM3 公開とリンク解決 | コンダクター | build-and-test、deployment-execution | `honkit build` 成功、リンク検査、公開 URL の HTTP 200 |

## 制約と期限

- 期限: 本セッション内に GitHub Pages への公開まで完了する。章単位の個別期限は無い。（Q9）
- 順序: 依存関係優先。最初の Bolt は walking skeleton（HonKit 骨格 + 1 章を公開経路まで通す）。以降は事実誤りのリスクが高い章（v2 の仕組み、ハンズオン）を先に書く。（Q8）
- 言語: 日本語。固定トークン（コマンド名、ファイルパス、AI-DLC の識別子）は英語のまま。
