# Discovered Rules — AI-DLC v2 教材（first 版）

> 入力: `<record>/ideation/intent-capture/intent-capture-questions.md` Q9（依頼者の指示の原文）、`<record>/ideation/scope-definition/scope-document.md`、`aidlc/spaces/default/memory/project.md` の `## Forbidden` / `## Corrections`、`.claude/scopes/aidlc-docs-book.md`、完了したインタビュー `practices-discovery-questions.md`。
>
> 状態: Step 5 統合版。`## Mandated` と `## Forbidden` には、記録上すでに人（依頼者）の発言またはゲート承認済みのスコープ文書に根拠がある **ハード制約だけ** を置く（3 + 3 件）。インタビューで確定した慣行はルールではなく `team-practices.md` の本文に書いた。昇格ツール（`aidlc engine state practices-promote`）はこの 2 節の配下にある空行・コメント以外のすべての行を project.md に追記するため、注記・確定事項・出典はこの 2 節の外に置いている。各ルール末尾の `[...]` は根拠。

## Mandated

- ALWAYS first 版の公開先は GitHub Pages の `https://y-ohgi.github.io/learn-AI-DLCv2/first/`（リポジトリの `first/` を HonKit でビルドしたもの）とし、公開は既存の GitHub Actions ワークフロー（`.github/workflows/deploy.yml` → `scripts/build-site.mjs`）で行う。新しいパイプラインは作らない [依頼文 Q9・scope docs-book]
- ALWAYS ワークフローの完了条件を GitHub Pages への公開完了（`/first/` がリダイレクト追従後に最終ステータス 200 を返すこと）とし、依頼者の介入を待たずにそこまで進める [依頼文 Q9「Pagesへのデプロイまで完了させてください」]
- ALWAYS 読者を「AI-DLC v1/v2 を知らないエンジニア」として書く [依頼文 Q9]

## Forbidden

- NEVER AI-DLC 2.8.2 の一次情報（`awslabs/aidlc-workflows` のタグ `v2.8.2` のドキュメントとコード、または本リポジトリのインストール済みランタイムと実行記録）で確認できない AI-DLC の事実を断定として書かない。推定を書く場合は「推定」と明示する [依頼文 Q9「1次情報とコードをもとに間違った情報は取り込まないでください」・scope-document「事実の裏取り方式」]
- NEVER ワークフロー中の判断（質問への回答、要約確認、前提の受け入れ、承認ゲート、学びの保存）を依頼者本人の応答待ちで止めない。代理判断と根拠の記録は project.md `## Corrections` の方針に従う [依頼文 Q9「私は一切介入しません」]
- NEVER スコープ外の成果物（アプリケーションコード、クラウドインフラ、サンプルアプリ、読者用の演習リポジトリ、英語版、動画、ランディングページの新規作成や現行版の `/claude/` 再配置）を本ワークフローで作らない [scope-document「スコープ境界（In / Out）」]

## 記録済みのため再掲しない制約

以下はすでに `aidlc/spaces/default/memory/project.md` に人が承認した学びとして記録されており、ルール解決器が毎ステージ読み込む。重複追記を避けるため上の 2 節には再掲しない。

- `## Forbidden`: claude 版（`../claude/`）の文章を first 版に再利用・改稿しない。AI-DLC の事実は 2.8.2 の一次情報だけで裏取りする（cid: `260913-aidlc-v2-book:scope-definition:a3418a05…`）
- `## Corrections`: 依頼者が介入しないワークフローでは、質問への回答はコンダクターが代理で行い、各回答に根拠を明記する（cid: `…:intent-capture:bd00ee6d…`）
- `## Corrections`: 会話言語は日本語。固定トークンだけを英語のまま残す（cid: `…:intent-capture:f2f17f25…`）
- `## Corrections`: 毎フェーズの「調査」は一次情報の読み直しと参照パスの記録、「レビュー」は宣言レビュアーに加えてコンダクターの代理精読と判断理由の記録（cid: `…:scope-definition:3366c838…`）
- `## Corrections`: 各章末に「出典」節を置き、事実主張ごとに一次情報のファイルパスを列挙する。別途の対応表は作らない（cid: `…:scope-definition:00190d2e…`）

## インタビューで確定した慣行（ルールにはせず team-practices.md に反映）

リードドラフトの提案 P-1〜P-9 はインタビュー（Q1〜Q14、全問 A）で確定し、`team-practices.md` の該当節に断定形で書いた。依頼者の発言に基づかない慣行であるため `## Mandated` / `## Forbidden` には昇格させない。

- P-1 → Q1: Bolt はセッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` から切り squash で同ブランチへ戻す。`main` へは最後に 1 本の PR（`## Way of Working`）
- P-2 → Q2: `main` への最終 PR はマージコミット、コミットメッセージは `aidlc:` / `docs:` / `chore:`（`## Way of Working`）
- P-3 → Q3 / Q4: walking skeleton = 骨格 + 章 1 本 + 検査スクリプト。完了条件はローカルビルド + `_site/first/index.html` + `check:first` + PR ビルド成功。以降は gate every Bolt（`## Walking Skeleton`）
- P-4 → Q5〜Q8: 検証 4 種の定義、`test-after` と Ordering、`scripts/check-first.mjs` / `npm run check:first`、SM1 の合格線 (1)〜(5)（`## Testing Posture`）
- P-5 → Q11: 出典行の書式、名前空間 4 種、タグ `v2.8.2` を正、食い違いの優先順位 4 段、claude 版へは `.html` リンク（`## Code Style`）
- P-6 → Q12: 図は ASCII、```` ```mermaid ```` 禁止、章テンプレート、フェンス言語と引用ラベルの閉じた集合（`## Code Style`）
- P-7 → Q13: markdownlint は入れず、org.md の「リンタを CI で」を 3 検査の CI 実行に読み替える（`## Code Style`）
- P-8 → Q9 / Q10: 既存ワークフローの変更は検査ステップ追加と `permissions` のジョブ単位化まで。`main` 取り込みはコンダクターが代理で PR 作成・マージ。完了判定はリダイレクト追従後の最終ステータス 200（`## Deployment`）
- P-9 → Q14: マスキング規約、外部スクリプトの教え方、日本語表記規則、対訳表は domain-design で確定（`## Code Style`）

## 出典

- 依頼者の指示の原文: `aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/intent-capture-questions.md`（Q9）
- スコープ境界・裏取り方式・毎フェーズの調査とレビュー: `aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/scope-definition/scope-document.md`
- 記録済みの学び: `aidlc/spaces/default/memory/project.md`（`## Forbidden`、`## Corrections`）
- スコープ定義（`skeleton: on`、既存パイプラインで公開）: `.claude/scopes/aidlc-docs-book.md`
- インタビューの回答と根拠: `aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/practices-discovery/practices-discovery-questions.md`（Q1〜Q14）
- 昇格ツールの解析規則（2 節配下の全行をルールとして追記）: `.claude/tools/aidlc-state.ts` の `handlePracticesPromote`（`parseRules`、`TEAM_SECTIONS`）
- ステージ定義: `.claude/aidlc-common/stages/inception/practices-discovery.md`（タグ `v2.8.2` の `core/aidlc-common/stages/inception/practices-discovery.md` と `{{INVOKE}}` 置換以外同一）
