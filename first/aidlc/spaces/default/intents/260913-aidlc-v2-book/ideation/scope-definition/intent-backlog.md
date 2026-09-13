# Intent Backlog — AI-DLC v2 教材（first 版）

入力: `../intent-capture/intent-statement.md`（Intent Statement の SM1〜SM3）と `scope-document.md`。ここでの項目はプロト Unit（章のまとまり）であり、Units Generation（2.7）で正式な Unit に分解される。

## プロト Unit 一覧（MoSCoW）

| ID | プロト Unit | 内容 | 優先度 | 満たす指標 | 依存 |
| --- | --- | --- | --- | --- | --- |
| P1 | HonKit 骨格 | `README.md`（はじめに）、`SUMMARY.md`、`book.json`、`.bookignore`、ビルド通過、`/first/` への公開経路 | Must | SM3 | なし |
| P2 | 読者の現在地 | AI 開発の歴史と種類の要点、なぜ方法論が必要か（詳細は claude 版 第1部へリンク） | Must | — | P1 |
| P3 | AI-DLC の概念 | 方法論としての AI-DLC（3 フェーズ、Mob、Bolt、Unit）→ 実装 v1 → v2、用語 | Must | SM2 | P1, P2 |
| P4 | v2 の仕組み | 2.8.2 の事実: ネイティブインストールと `aidlc config`、エンジンとコンダクター、5 フェーズ 33 ステージ、11 スコープとコンポーザー、14 エージェント、承認ゲートと人間の在席確認、監査ログ、学習ループ | Must | SM2 | P3 |
| P5 | ハンズオン | `install.sh` → `aidlc config --harness claude` → `aidlc doctor` → `/aidlc` → 最初の承認ゲート。つまずきポイント | Must | SM1, SM2 | P4 |
| P6 | ケーススタディ | 本書自身の制作記録: compose 提案と ARS、Q&A と代理回答、レビュー所見と差し戻し、redo-jump、監査ログの読み方、代理判断ログ | Must | SM2 | P4 |
| P7 | 付録 | 用語集、コマンド早見、出典一覧、つまずきポイント | Should | SM2 | P3〜P6 |
| P8 | チーム導入・他手法比較 | claude 版 第4部・2.12 へのリンクと要点のみ | Could | — | P2 |
| P9 | サンプルアプリ・演習リポジトリ・英語版 | 作らない | Won't | — | — |

## 依存関係（トポロジー）

```
P1 骨格 ---> P2 現在地 ---> P3 概念 ---> P4 仕組み ---> P5 ハンズオン
                 |                          |
                 |                          +---> P6 ケーススタディ
                 |                                     |
                 +---> P8 導入・比較（リンク）           |
                                                       v
                          P7 付録 <---- P3, P4, P5, P6 の完成後
```

## バリューストリームマップ（読者の旅路）

| 読者の段階 | 読者が得るもの | 対応するプロト Unit |
| --- | --- | --- |
| 現在地を知る | 「自分の AI Agent 利用はどの世代か、なぜ方法論の話になるのか」が分かる | P2 |
| 概念を掴む | AI-DLC が何を主張し、v1 と v2 が何を指すかを説明できる | P3 |
| 仕組みを理解する | 2.8.2 の実際の構成要素と挙動を、出典付きで把握する | P4 |
| 手を動かす | 自分の環境にインストールし、最初の承認ゲートまで到達する | P5 |
| 実物を読む | 実際に AI-DLC で作られた記録（質問・所見・監査ログ）を読み、ゲートでの判断を追体験する | P6 |
| 参照する | 用語・コマンド・出典・つまずきを引く | P7 |

## 順序付け方針

- 最初の Bolt は walking skeleton: P1 と P2 の最小版を公開経路（`honkit build` → `_site/first/`）まで通す。
- 次に事実誤りのリスクが最も高い P4 → P5 → P6 の順（risk-first）。P3 は P4 の前提として先行する。
- P7 は全章の完成後。P8 は余力があれば。P9 は作らない。
- Bolt の具体的な区切りと Definition of Done は Delivery Planning（2.9）で決める。
