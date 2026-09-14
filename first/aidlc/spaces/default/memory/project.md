# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Change Control

<!-- Project-specific. Mode: strict or relaxed. Strict here holds for every intent and cannot be changed from chat. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

- AI-DLC の事実確認と章末の出典は awslabs/aidlc-workflows のタグ v2.8.2（commit 355903d）の木と、コミット済みの first/.claude/（同タグの投影）・first/aidlc/（実行記録）に対して行う。クローンの HEAD やスクラッチパッドの別コピーは入力にしない (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:practices-discovery:4750c6251bb95651e5f8e570566f037ad0669e0cd1556934570e31596cac48a0 -->

- first 版で「v2」は awslabs/aidlc-workflows の 2.x 系（本書は 2.8.2）を指す。「v1」はタグ v2.8.2 の一次情報に現れない呼称なので first 版では断定せず、歴史的説明は claude 版へのリンクに留める。方法論の原典（AWS ブログ）は docs/guide/00-introduction.md が参照するものとして引く (learned 2026-09-14) <!-- cid:260913-aidlc-v2-book:requirements-analysis:1b434e2444140950e69a42b46120d19b5eb57d5e9491e0713336403bd57ec903 -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

- NEVER claude 版（../claude/）の文章を first 版に再利用・改稿しない。重複話題は claude 版の該当章へのリンクで参照し、AI-DLC の事実は 2.8.2 の一次情報だけで裏取りする (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:scope-definition:a3418a057317935f939f63188de9be8dfdb2d2728866739377d6c5028925f33f -->

- NEVER AI-DLC 2.8.2 の一次情報（`awslabs/aidlc-workflows` のタグ `v2.8.2` のドキュメントとコード、または本リポジトリのインストール済みランタイムと実行記録）で確認できない AI-DLC の事実を断定として書かない。推定を書く場合は「推定」と明示する [依頼文 Q9「1次情報とコードをもとに間違った情報は取り込まないでください」・scope-document「事実の裏取り方式」] (affirmed 2026-09-13)

- NEVER ワークフロー中の判断（質問への回答、要約確認、前提の受け入れ、承認ゲート、学びの保存）を依頼者本人の応答待ちで止めない。代理判断と根拠の記録は project.md `## Corrections` の方針に従う [依頼文 Q9「私は一切介入しません」] (affirmed 2026-09-13)

- NEVER スコープ外の成果物（アプリケーションコード、クラウドインフラ、サンプルアプリ、読者用の演習リポジトリ、英語版、動画、ランディングページの新規作成や現行版の `/claude/` 再配置）を本ワークフローで作らない [scope-document「スコープ境界（In / Out）」] (affirmed 2026-09-13)

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

- ALWAYS first 版の公開先は GitHub Pages の `https://y-ohgi.github.io/learn-AI-DLCv2/first/`（リポジトリの `first/` を HonKit でビルドしたもの）とし、公開は既存の GitHub Actions ワークフロー（`.github/workflows/deploy.yml` → `scripts/build-site.mjs`）で行う。新しいパイプラインは作らない [依頼文 Q9・scope docs-book] (affirmed 2026-09-13)

- ALWAYS ワークフローの完了条件を GitHub Pages への公開完了（`/first/` がリダイレクト追従後に最終ステータス 200 を返すこと）とし、依頼者の介入を待たずにそこまで進める [依頼文 Q9「Pagesへのデプロイまで完了させてください」] (affirmed 2026-09-13)

- ALWAYS 読者を「AI-DLC v1/v2 を知らないエンジニア」として書く [依頼文 Q9] (affirmed 2026-09-13)

## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
- 依頼者が介入しないワークフローでは、質問への回答はコンダクターが依頼者の代理として行い、各回答に根拠（既存教材 claude 版の該当箇所、または依頼文）を明記する (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:intent-capture:bd00ee6d9526d4a069ece320fabdd23b3b5ed7e61b846d386655bbed9c05c358 -->
- 会話言語は日本語。人が読む成果物・質問・レビュー依頼・委譲ブリーフの説明文はすべて日本語で書き、プロトコルが英語表記を指定する固定トークンだけを英語のまま残す (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:intent-capture:f2f17f258e1bdc9840dad27e5c8197b4f92d9f177c4bca3629169b0f320161a6 -->
- 毎フェーズの「調査」は、そのフェーズの成果物を書く前に AI-DLC 2.8.2 の一次情報を読み直して参照パスを記録すること、「レビュー」は宣言レビュアーの検査に加えて各ゲートでコンダクターが代理で成果物を精読し判断理由を残すこと、と解釈する (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:scope-definition:3366c838a4e470eb360fbc193beb63b5476978f5666ffaa57a88b7ce1bdad000 -->
- first 版の各章末に「出典」節を置き、事実主張ごとに一次情報のファイルパスを列挙する。別途の主張→出典対応表は作らない (learned 2026-09-13) <!-- cid:260913-aidlc-v2-book:scope-definition:00190d2ef5824d901e2c24078719fe47ea5b619ea97f245b57c108ffa352022e -->
