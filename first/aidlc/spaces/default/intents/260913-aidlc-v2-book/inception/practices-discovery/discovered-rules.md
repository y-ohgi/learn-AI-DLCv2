# Discovered Rules — AI-DLC v2 教材（first 版）

> 入力: `<record>/ideation/intent-capture/intent-capture-questions.md` Q9（依頼者の指示の原文）、`<record>/ideation/scope-definition/scope-document.md`、`aidlc/spaces/default/memory/project.md` の `## Forbidden` / `## Corrections`、`.claude/scopes/aidlc-docs-book.md`。
>
> 状態: Step 2 リードドラフト。`## Mandated` と `## Forbidden` には、記録上すでに人（依頼者）の発言またはゲート承認済みのスコープ文書に根拠がある **ハード制約だけ** を置く。昇格ツール（`aidlc engine state practices-promote`）はこの 2 節の配下にある空行・コメント以外のすべての行を project.md に追記するため、注記・提案・出典はこの 2 節の外に置いている。各ルール末尾の `[...]` は根拠。

## Mandated

- ALWAYS first 版の公開先は GitHub Pages の `https://y-ohgi.github.io/learn-AI-DLCv2/first/`（リポジトリの `first/` を HonKit でビルドしたもの）とし、公開は既存の GitHub Actions ワークフロー（`.github/workflows/deploy.yml` → `scripts/build-site.mjs`）で行う。新しいパイプラインは作らない [依頼文 Q9・scope docs-book]
- ALWAYS ワークフローの完了条件を GitHub Pages への公開完了（`/first/` が HTTP 200 を返すこと）とし、依頼者の介入を待たずにそこまで進める [依頼文 Q9「Pagesへのデプロイまで完了させてください」]
- ALWAYS 読者を「AI-DLC v1/v2 を知らないエンジニア」として書く [依頼文 Q9]

## Forbidden

- NEVER AI-DLC 2.8.2 の一次情報（`awslabs/aidlc-workflows` のドキュメントとコード、または本リポジトリのインストール済みランタイムと実行記録）で確認できない AI-DLC の事実を断定として書かない。推定を書く場合は「推定」と明示する [依頼文 Q9「1次情報とコードをもとに間違った情報は取り込まないでください」・scope-document「事実の裏取り方式」]
- NEVER ワークフロー中の判断（質問への回答、要約確認、前提の受け入れ、承認ゲート、学びの保存）を依頼者本人の応答待ちで止めない。代理判断と根拠の記録は project.md `## Corrections` の方針に従う [依頼文 Q9「私は一切介入しません」]
- NEVER スコープ外の成果物（アプリケーションコード、クラウドインフラ、サンプルアプリ、読者用の演習リポジトリ、英語版、動画、ランディングページの新規作成や現行版の `/claude/` 再配置）を本ワークフローで作らない [scope-document「スコープ境界（In / Out）」]

## 記録済みのため再掲しない制約

以下はすでに `aidlc/spaces/default/memory/project.md` に人が承認した学びとして記録されており、ルール解決器が毎ステージ読み込む。重複追記を避けるため上の 2 節には再掲しない。

- `## Forbidden`: claude 版（`../claude/`）の文章を first 版に再利用・改稿しない。AI-DLC の事実は 2.8.2 の一次情報だけで裏取りする（cid: `260913-aidlc-v2-book:scope-definition:a3418a05…`）
- `## Corrections`: 依頼者が介入しないワークフローでは、質問への回答はコンダクターが代理で行い、各回答に根拠を明記する（cid: `…:intent-capture:bd00ee6d…`）
- `## Corrections`: 会話言語は日本語。固定トークンだけを英語のまま残す（cid: `…:intent-capture:f2f17f25…`）
- `## Corrections`: 毎フェーズの「調査」は一次情報の読み直しと参照パスの記録、「レビュー」は宣言レビュアーに加えてコンダクターの代理精読と判断理由の記録（cid: `…:scope-definition:3366c838…`）
- `## Corrections`: 各章末に「出典」節を置き、事実主張ごとに一次情報のファイルパスを列挙する。別途の対応表は作らない（cid: `…:scope-definition:00190d2e…`）

## 提案（人の発言に基づかないためルールにしない・インタビューで確定）

以下は証拠から推論した慣行の候補であり、依頼者の発言には無い。Step 4 のインタビューで確定したものだけを Step 5 で `team-practices.md` の本文（または必要なら上の 2 節）に反映する。

- P-1 Construction の Bolt ワークツリーの base/target をセッションブランチ `claude/ai-dlcv2-honkit-pages-1ylg3o` にするか、先に `main` へ取り込んで org.md どおり `main` にするか（`evidence.md` W-1）
- P-2 `main` への取り込み方式: squash（org.md 既定）か、マージコミット（PR #1 の実績）か（`evidence.md` W-2）
- P-3 walking skeleton の完了条件を PR ビルド成功までとするか `/first/` の HTTP 200 までとするか（`evidence.md` S-1）、その後のラダー選択を gate every Bolt とするか（S-2）
- P-4 リンク検査の手段と置き場所（`evidence.md` T-2）、ハンズオン再現（SM1）の実施方法（T-3）
- P-5 章末「出典」節のパス書式と、クローンとインストール済みランタイムが食い違う場合の優先順位（`evidence.md` C-1）
- P-6 図は Mermaid を使わず ASCII 記法かテキスト表にする（`evidence.md` C-2）
- P-7 markdownlint 等の導入（`evidence.md` C-3）
- P-8 コミットメッセージの種別プレフィックス（`aidlc:` / `docs:` / `chore:`）は観察された実績であり、依頼者の指示ではない
- P-9 章テンプレートの見出し（`## この章のまとめ`、`## 出典`）と `SUMMARY.md` 上の章番号体裁（`evidence.md` C-4）

## 出典

- 依頼者の指示の原文: `aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/intent-capture-questions.md`（Q9）
- スコープ境界・裏取り方式・毎フェーズの調査とレビュー: `aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/scope-definition/scope-document.md`
- 記録済みの学び: `aidlc/spaces/default/memory/project.md`（`## Forbidden`、`## Corrections`）
- スコープ定義（`skeleton: on`、既存パイプラインで公開）: `.claude/scopes/aidlc-docs-book.md`
- 昇格ツールの解析規則（2 節配下の全行をルールとして追記）: `.claude/tools/aidlc-state.ts` の `handlePracticesPromote`（`parseRules`、`TEAM_SECTIONS`）
- ステージ定義: `.claude/aidlc-common/stages/inception/practices-discovery.md`（2.8.2 クローン `core/aidlc-common/stages/inception/practices-discovery.md` と `{{INVOKE}}` 置換以外同一）
