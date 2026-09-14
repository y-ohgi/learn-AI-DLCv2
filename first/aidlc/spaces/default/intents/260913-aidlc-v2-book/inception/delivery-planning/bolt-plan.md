# Bolt Plan — AI-DLC v2 教材（first 版）

入力: `../requirements-analysis/requirements.md`（`requirements`）、`../domain-design/components.md`（`components`）、`../units-generation/unit-of-work.md`（`unit-of-work`）、`../units-generation/unit-of-work-dependency.md`（`unit-of-work-dependency`）、`../units-generation/unit-of-work-story-map.md`（`unit-of-work-story-map`）、`../practices-discovery/team-practices.md`（`team-practices`）、`aidlc/spaces/default/memory/team.md`、`delivery-planning-questions.md`（Q1〜Q6）。

Bolt とは、いくつかの Unit（作業のまとまり）を 1 回の作業で設計・執筆・検査して、「動く状態」（ここでは `_site/first/` がビルドされ `npm run check:first` に通る状態）で終える区切りである。以下は順序付きの Bolt の列で、順序は依存関係（`unit-of-work-dependency.md`）を守ったうえで「事実誤りのリスクが高いものを先に」という判断で決めた（理由は `risk-and-sequencing-rationale.md`）。

## 作業の進め方（team.md から）

- **ブランチ**: Bolt ごとのワークツリーはセッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` を基点・統合先とし、squash で戻す。`main` へは最後に 1 本の PR（マージコミット）。
- **walking skeleton**: Bolt 1 は薄い一本通し（目次と設定・検査スクリプト・章 1 本を公開経路の手前まで通す最小版）で、単独・ゲート付き。完了後のラダープロンプト（残りの Bolt をどう進めるかの問い）では「Bolt ごとにゲート」を選ぶ。
- **公開**: Bolt ごとの完了はローカルビルドと PR 上のビルドで確認し、公開（`main` への取り込み）は全 Bolt 完了後に deployment-execution で 1 回。

## Bolt の列

| Bolt | 含む Unit | 種別 | 完了条件（Definition of Done） | 検証する仮説（出荷して分かること） | デモ |
| --- | --- | --- | --- | --- | --- |
| Bolt 1 | U1 骨格と規約、U2 ビルドと検査、U3 第 1 部 | walking skeleton | `npm run build` が終了コード 0 で `_site/first/index.html` が存在。`npm run check:first` の blocking 0 件（内部リンク、SUMMARY と章の一致、必須節、フェンス言語、出典行、付録見出し、文字数）。PR 上の `build` ジョブが成功。README・SUMMARY・book.json・1.1 の章が台帳・対訳表・出典書式に従う。`deploy.yml` に `check:first` の 1 ステップと `permissions` のジョブ単位化 | 「HonKit の骨格 + 章 1 本 + 検査スクリプトで、公開経路の手前まで機械的に通せる」。検査スクリプトが出典行の `[2.8.2]` をタグ `v2.8.2` の木に対して実在確認できる | ローカルで `_site/first/index.html` を開き、1.1 から claude 版へのリンクが `.html` で解決する |
| Bolt 2 | U4 第 2 部 概念 | 通常 | 2.1・2.2 が章テンプレートに従い、出典行がすべて実在。「v1」を断定していない。原典の URL が 2.1 本文に 1 回。対訳表の (2)(3) 分類の初出が 2.2 に揃う。全章の検査を再実行して blocking 0 件 | 「2.8.2 の一次情報だけで AI-DLC の位置づけと用語を説明でき、v1 の枝は claude 版へのリンクで足りる」 | 2.1 の歩み（0.1.0 → 2.0.0 → 2.7.2 → 2.8.0 → 2.8.2）が CHANGELOG の節で裏取りされている |
| Bolt 3 | U5 第 3 部 仕組み | 通常 | 3.1〜3.8 の 8 章。各章に `[record]` の抜粋が 1 つ以上（マスキング済み）。ディレクティブ種別・`.claude/CLAUDE.md`・14 エージェント・33 ステージ・11 スコープの数値が一次情報と一致。各章 2,000〜6,000 文字。検査 blocking 0 件 | 「2.8.2 の仕組みを、コードを引用せずに読者が実物を開いて確認できる粒度で説明できる」 | 3.2 の抜粋（本ワークフローの run-stage ディレクティブ）を読者が自分の `aidlc engine orchestrate next` の出力と見比べられる |
| Bolt 4 | U6 第 4 部 ハンズオン | 通常 | 4.1・4.2 の bash フェンスを U2 の再現モードでクリーンな一時ディレクトリに対して実行し、NFR1 の (1)〜(5) が全通過。Bedrock 既定と他プロバイダの手順が `01-getting-started.md` と一致。`## つまずきポイント` 節がある。検査 blocking 0 件 | 「読者が章の手順だけで 2.8.2 を導入し、最初の質問まで到達できる」（SM1） | 一時ディレクトリでの再現ログ（`aidlc version` の出力と最初の run-stage ディレクティブ） |
| Bolt 5 | U7 第 5 部 ケーススタディ | 通常 | 5.1〜5.3。抜粋の範囲と `[record]` 出典が実在し、マスキング済み。逸脱と限界の節に回避フラグ・代理判断・v1 枠組み・センサーの偽陰性が書かれている。各節末に「自分のワークフローで同じものを見る場所」。検査 blocking 0 件 | 「AI-DLC で作った記録は、読者が自分のワークフローと照らして読める」（Problem Statement 第 3 項） | 5.2 の R-01〜R-10 と redo-jump の流れを監査ログの行で追える |
| Bolt 6 | U8 付録 A〜D | 通常 | A（対訳表。初出章は Chapter）、B（`--help` と `12-cli-commands.md` で確認したコマンドのみ）、C（全章の出典一覧と GitHub URL の組み立て方、原典 URL）、D（つまずきの横断再掲）。付録は上限のみ（NFR4 (b)）。検査 blocking 0 件、advisory の報告を確認。全 20 章が SUMMARY.md に載る | 「読者が用語・コマンド・出典・つまずきを引ける」（P7） | 付録 C の出典一覧から `[2.8.2]` の GitHub URL を開ける |

Bolt 6 の後、Build and Test（3.6）で全章の検査と NFR1〜NFR8 の計測を行い、deployment-execution（4.3）で `main` への PR・マージ・公開・ランディングページの概要文更新・smoke test を行う。

## Bolt ごとの担当

すべての Bolt はコンダクター（この `/aidlc` セッション）が `aidlc-developer-agent` として執筆し、依頼者の代理として Bolt ごとのゲートで精読・承認する（`team-allocation.md`）。

## 依存との整合

Bolt の順序 1 → 2 → 3 → 4 → 5 → 6 は `unit-of-work-dependency.md` の DAG（U3 / U4 → U1、U5 → U4、U6 / U7 → U5、U8 → U3〜U7）のトポロジカル順序の 1 つで、逸脱は無い。U6 と U7 は互いに独立だが直列に作る（Q4）。
