# 2.1 AI-DLC とは何か

第 1 部では、個人の AI 利用がチームでは崩れる理由と、この本で「方法論」と呼ぶものを確認しました。この章では、その方法論の 1 つである AI-DLC が何であり、どこから来て、この本が扱う「2.8.2」がその歩みのどこに位置するかを整理します。あわせて、本書で使う「v2」「v1」という言葉が何を指し得るかを、2.8.2 の一次情報に基づいて位置づけます。

## この章で学ぶこと

- AI-DLC という方法論と、それを実装したリポジトリ `awslabs/aidlc-workflows` の関係を説明できる。
- 本書で「v2」と呼ぶものの範囲と、「v1」という呼称の扱いを、一次情報に基づいて区別できる。
- リポジトリの 0.1.0 から 2.8.2 までの歩みと、配布方式の転換点がどの版かを説明できる。
- 設計原則「Small Mob, Broad Agents」と Core Principles の要点、とくに「User decides, AI executes」を説明できる。

## 方法論と実装 — 2 つのものを区別する

AI-DLC は AI-Driven Development Life Cycle の略で、日本語にすれば「AI 駆動開発ライフサイクル」です。2.8.2 のユーザーガイドは、これを「AI 支援によるソフトウェア開発を、反復可能で追跡可能なフェーズに構造化するための方法論」と定義しています。フェーズとは、開発の流れを目的ごとに区切った大きな段階のことです（フェーズの具体的な中身は次章で扱います）。

ここで押さえてほしいのは、「AI-DLC」という言葉が指し得るものが 2 つあることです。

1. **方法論としての AI-DLC。** AWS が公開した AI-DLC 方法論に由来します。ユーザーガイドは、その原典としてブログ記事 `https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/` を参照しています。本書はこの記事の内容を詳述しません。原典は方法論の出発点であり、以降の章で説明する仕組みの「考え方の元」だと位置づけておけば十分です。
2. **実装としての AI-DLC。** GitHub の `awslabs/aidlc-workflows` リポジトリは、この方法論を「ハーネス中立のコア」から実装したものです。ハーネスとは、Claude Code のように、AI エージェントを動かすためのコマンドラインの実行環境のことです。2.8.2 のガイドは、Claude Code、Kiro CLI、Kiro IDE、Codex CLI、Cursor、opencode、GitHub Copilot の 7 つで動くと述べています。コアとは、ステージやエージェントの定義など、どのハーネスにも依存しない中身のことで、各ハーネス向けの配布物はそこから生成されます。

本書で扱うのは主に後者です。「AI-DLC のステージは 33 ある」「承認ゲートで止まる」といった事実は、方法論一般の話ではなく、`awslabs/aidlc-workflows` の特定の版の話として書きます。

> **注意** — 原典では Mob Elaboration などの独自の用語を使いますが、本書はそれらを 2.8.2 の用語と混同しないよう、「原典では…と呼ぶ」の形でしか触れません。2.8.2 の実装が定義する用語は次章で整理します。

## 本書の「v2」と「v1」

本書で「v2」と書くときは、`awslabs/aidlc-workflows` の 2.x 系を指します。この本は、そのうち 2.8.2 を対象にしています。GitHub 上のタグは `v2.8.2`、コミットは `355903d` で、以降の章の `[2.8.2]` の出典はすべてこのタグの内容を指します。読者が自分の環境で確認するときも、この版を入れれば本書の記述と一致します（導入手順は第 4 部）。

一方、「v1」は本書の依頼者と姉妹本の claude 版が使ってきた呼称で、2.8.2 の一次情報（ユーザーガイド、開発者リファレンス、`CHANGELOG.md`）には「v1」を版として定義する箇所がありません。`CHANGELOG.md` は 0.1.0 から始まり、1.x 系という節はありません。近い言及は、`classic` スコープを「Ideation の無い v1-style のライフサイクル」と形容する一文（開発者リファレンスと `CHANGELOG.md` の 2.6.18 の節）だけで、そこでも v1 が何を指すかは説明されていません。そのため本書は、「v1 とはこういうものだ」と断定する書き方をしません。方法論の歴史的な流れ、つまり原典の記事に書かれた考え方から現在の実装に至る変化に関心がある人は、claude 版の次の 2 章を読んでください。

- [claude 版 2.2 v1 の方法論](../../../claude/docs/02-aidlc/02-v1-methodology.html)
- [claude 版 2.3 v1 から v2 へ](../../../claude/docs/02-aidlc/03-v1-to-v2.html)

本書での使い分けをまとめると次のとおりです。

| 言葉 | 本書での意味 | 根拠 |
| --- | --- | --- |
| AI-DLC | 方法論の名前。文脈により `awslabs/aidlc-workflows` の実装も指す | `docs/guide/00-introduction.md` |
| v2 | `awslabs/aidlc-workflows` の 2.x 系。本書は 2.8.2 | `CHANGELOG.md` |
| v1 | 依頼者と claude 版の呼称。2.8.2 の一次情報に版としての定義が無いため断定しない | — |
| 2.8.2 | 本書が固定する版。タグ `v2.8.2`、コミット `355903d` | クローンの `git log` |

## リポジトリの歩み — 0.1.0 から 2.8.2 まで

`CHANGELOG.md` は版ごとに節を持ち、それぞれに日付と変更点が書かれています。本書に関係する節だけを抜き出すと、歩みは次のようになります。

```text
0.1.0 -----> 2.0.0 -----> 2.2.0 -----> 2.7.0 --> 2.7.1 --> 2.7.2 -----> 2.8.0 --> 2.8.1 --> 2.8.2
2026-04-24   2026-06-18   2026-07-04   2026-09-01          2026-09-07   2026-09-08          2026-09-10
32 stages    13 agents    14 agents    33 stages           install.sh   baseline           this book
11 agents    reviewers    composer     dist/<harness>      --version    native only
9 scopes                               (copy)              (native)
```

各行は上から順に、版、日付、その版の主な変化を示しています。以下、各節の要点です。

- **0.1.0（2026-04-24）** — 初回公開。`/aidlc` オーケストレーターは 5 フェーズ 32 ステージを持ち、エージェントは 11 の専門家、スコープは 9 でした。ここで言うスコープとは、作業の種類に応じて実行するステージの組み合わせを決める設定です。承認ゲート、監査ログ、Bolt による Construction など、後の章で扱う仕組みの多くが初版から存在しています。
- **2.0.0（2026-06-18）** — レビュアーの導入。ステージの本体が成果物を作った後に、別のエージェントが品質を確認する仕組みで、`aidlc-product-lead-agent` と `aidlc-architecture-reviewer-agent` の 2 名が追加され、エージェントは 11 から 13 になりました。レビュアーは助言型（advisory）で、最終判断は人の承認ゲートに残ります。
- **2.2.0（2026-07-04）** — `aidlc-composer-agent` の追加でエージェントが 14 になりました。コンポーザーは、既存のスコープが作業に合わないときにステージの組み合わせを提案する役です（第 3 部で扱います）。
- **2.7.0（2026-09-01）** — 2.6.x 系を束ねた baseline。ステージが 33 になり、Classic と Express がスコープとして加わりました。導入方法は「`dist/<harness>/` のツリーを丸ごと置き換える」、つまりリポジトリから生成した配布物を自分のプロジェクトへ複製する方式でした。
- **2.7.1（2026-09-01）** — Plan Approval のデッドロック修正。この節の Upgrade も「`dist/<harness>/` のツリーを置き換える」と書かれており、2.7.1 までは複製方式が導入手段だったことが分かります。
- **2.7.2（2026-09-07）** — Upgrade の案内が `install.sh --version 2.7.2`（Windows は `install.ps1 -Version 2.7.2`）に変わります。ネイティブの `aidlc` コマンドと版を指定して導入するインストーラが `CHANGELOG.md` に初めて現れるのがこの節で、**配布方式の転換点を一語で言うなら 2.7.2 です。** 同じ節には、リリース資産が `aidlc-runtime-X.Y.Z.tar.gz` と名付けられ、それが生成された `dist/<harness>/` の「リリース版の等価物」だとも書かれています。
- **2.8.0（2026-09-08）** — 2.7.x 系を束ねた最初の baseline で、2.7.2 からランタイムの挙動は変えていません。Upgrade は `install.sh --version 2.8.0` か、`aidlc-runtime-2.8.0.tar.gz` の `runtime/<harness>/` で手動の複製を置き換える、の 2 つです。2.8.1 の節はこの導入方式を「2.8.0 native install」と呼んでいます。つまり、ネイティブ導入は 2.7.2 で登場し、2.8.0 系がその方式で配布された最初の baseline です。
- **2.8.1（2026-09-08）** — 2.8.0 のネイティブ導入を実際に使って見つかった不具合の修正。`aidlc doctor` の案内が「`dist/<harness>/` から複製する」から「`aidlc config` を実行する」に変わったのもこの節です。
- **2.8.2（2026-09-10）** — 本書の版。要約確認の受領が特定の区切り線で失われる不具合と、レビュー所見の表の診断メッセージの改善が主です。`aidlc version` は `2.8.2` を返します。

> **補足** — `CHANGELOG.md` には 2.8.2 の下に「2.8.6（2026-09-09）」という節がありますが、その節自身が「公開されなかった開発版の項で、意図したリリース版は 2.8.2」と明記しています。版番号の順に並んでいないのはそのためで、本書は 2.8.6 を版として扱いません。

この歩みから分かるのは、本書を読む時点で「AI-DLC を入れる」と言ったときの手順が、2.7.1 以前の説明（リポジトリを取得して `dist/` を複製する）とは違う、ということです。第 4 部のハンズオンは 2.7.2 以降のネイティブ導入だけを扱います。

## 設計原則 — Small Mob, Broad Agents と Core Principles

AI-DLC の実装がどんな考え方で作られているかは、2.8.2 に同梱された方法論の知識ファイル `core/knowledge/aidlc-shared/ai-dlc-principles.md` に短くまとまっています。エージェントが各ステージの開始時に読み込む文書で、読者が方法論の「態度」を知るには一番短い入口です。

まず設計原則は **Small Mob, Broad Agents** です。mob とは、少人数の職能横断のグループが一緒に速く進む働き方のことで、AI-DLC はこの mob モデルの上に作られています。数十の狭い専門家エージェントを並べると、ウォーターフォールの引き継ぎの連鎖を再現してしまうので、代わりに **幅広い能力を持つ 11 のエージェント** を定義し、それぞれが複数のステージとフェーズにまたがって参加します。実際のアーキテクトや開発者が mob のセッションでそうするように、各エージェントはステージを越えて文脈を持ち続けるため、引き継ぎがなくなり、調整のコストが減ります。ユーザーガイドの導入章も、これを「3〜5 人の mob が 1 つの機能全体をカバーする」人間のチームの働き方に重ねています。なお、ここで言う 11 は専門家の数で、2.0.0 と 2.2.0 で加わったレビュアー 2 名とコンポーザーを含めた総数が 14 です。

次に Core Principles は 7 項目です。

1. **User decides, AI executes** — 重要な決定はすべて承認ゲートを通り、ユーザーが確認し、修正し、あるいは覆す。承認ゲートとは、各ステージの終わりに置かれる対話式の確認地点です。
2. **Adaptive depth** — 単純なプロジェクトは重いステージを飛ばし、複雑なプロジェクトは全体をカバーする。ワークフローがプロジェクトに合わせて変わる。
3. **Traceable artifacts** — 各ステージは版管理された Markdown 文書を作り、完全な決定の記録になる。
4. **Multi-role expertise** — 各ステージは専門家のエージェント人格に導かれる。
5. **No emergent behavior** — エージェントは定められたプロトコルに従い、承認メニュー、完了メッセージ、状態遷移は標準化されている。
6. **Questions before assumptions** — 迷ったら聞く。不完全な回答は貧しい設計につながる。
7. **Contradiction detection** — 回答同士をスコープ、リスク、技術の観点で照合し、矛盾を見つける。

この中で本書が最も重視するのが 1 番目の「User decides, AI executes」です。第 1 部で見た「止まるべき場所で止まらない」という問題に対して、AI-DLC は「止まる場所を承認ゲートとして実装し、AI が勝手に通過できないようにする」という答えを出しています。第 3 部で見る仕組みの多く、たとえば人間の在席を刻印するフックや監査ログは、この原則を守るためのものだと読むと理解しやすくなります。

> **参照** — Core Principles の 3 番目は成果物の置き場所を `aidlc-docs/` と書いていますが、2.8.2 のユーザーガイドの用語集は成果物の置き場所を `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` としています。読者が実際に目にするのは後者のパスです。

## まとめ

- AI-DLC は AI 支援開発を反復可能で追跡可能なフェーズに構造化する方法論で、AWS の原典に由来し、`awslabs/aidlc-workflows` はそれをハーネス中立のコアから実装したものである。
- 本書の「v2」は `awslabs/aidlc-workflows` の 2.x 系を指し、対象は 2.8.2（タグ `v2.8.2`）。「v1」は 2.8.2 の一次情報に版としての定義が無い呼称なので断定せず、歴史は claude 版へ委ねる。
- 歩みは 0.1.0（32 ステージ、11 エージェント、9 スコープ）→ 2.0.0（レビュアー 2 名で 13）→ 2.2.0（コンポーザーで 14）→ 2.7.0（33 ステージ）→ 2.7.2（ネイティブ `install.sh --version` の初出、配布方式の転換点）→ 2.8.0（ネイティブ導入だけの最初の baseline）→ 2.8.2 と進んだ。
- 設計原則は Small Mob, Broad Agents で、Core Principles の筆頭が「User decides, AI executes」。承認ゲートはこの原則の実装である。

## 出典

- [2.8.2] `docs/guide/00-introduction.md` § What is AI-DLC? — AI-DLC の定義（反復可能で追跡可能なフェーズへの構造化）、AWS の AI-DLC 方法論への由来と原典 URL、ハーネス中立のコアからの実装、対応する 7 ハーネス
- [2.8.2] `docs/guide/00-introduction.md` § Philosophy: Small Mob, Broad Agents — 11 の幅広いエージェントと、3〜5 人の mob になぞらえた説明
- [2.8.2] `docs/guide/00-introduction.md` § Key Numbers — エージェント 14 = 11 専門家 + 2 レビュアー + コンポーザー
- [2.8.2] `core/knowledge/aidlc-shared/ai-dlc-principles.md` § Design Principle: Small Mob, Broad Agents — mob モデル、11 エージェントがステージを越えて文脈を持つこと
- [2.8.2] `core/knowledge/aidlc-shared/ai-dlc-principles.md` § Core Principles — 7 項目の原則と「User decides, AI executes」、成果物の置き場所を `aidlc-docs/` と書いていること
- [2.8.2] `docs/guide/glossary.md` § Artifact — 成果物の置き場所が `aidlc/spaces/<space>/intents/<YYMMDD>-<label>/` であること
- [2.8.2] `docs/guide/glossary.md` § Approval gate — 承認ゲートが各ステージの終わりの対話式の確認地点であること
- [2.8.2] `docs/guide/glossary.md` § Harness — ハーネスが AI-DLC のコアを載せるコマンドラインの配布先であること
- [2.8.2] `CHANGELOG.md` § [0.1.0] — 2026-04-24 の初回公開、5 フェーズ 32 ステージ、11 エージェント、9 スコープ、承認ゲートと監査ログと Bolt の初版からの存在
- [2.8.2] `CHANGELOG.md` § [2.0.0] — 2026-06-18、レビュアー 2 名の導入で 11 から 13 エージェント、レビュアーが助言型で人の承認ゲートが最終であること
- [2.8.2] `CHANGELOG.md` § [2.2.0] — 2026-07-04、`aidlc-composer-agent` の追加で 14 エージェント
- [2.8.2] `CHANGELOG.md` § [2.7.0] — 2026-09-01、2.6.x を束ねた baseline、33 ステージ、Classic と Express のスコープ、Upgrade が `dist/<harness>/` ツリーの置き換えであること
- [2.8.2] `CHANGELOG.md` § [2.7.1] — 2026-09-01、Plan Approval のデッドロック修正、Upgrade が `dist/<harness>/` ツリーの置き換えであること
- [2.8.2] `CHANGELOG.md` § [2.7.2] — 2026-09-07、`install.sh --version 2.7.2` / `install.ps1 -Version 2.7.2` の初出、`aidlc-runtime-X.Y.Z.tar.gz` が `dist/<harness>/` のリリース版の等価物であること
- [2.8.2] `CHANGELOG.md` § [2.8.0] — 2026-09-08、2.7.x を束ねた最初の baseline、2.7.2 から挙動を変えないこと、`install.sh --version 2.8.0` と `runtime/<harness>/` による置き換え
- [2.8.2] `CHANGELOG.md` § [2.8.1] — 2026-09-08、「2.8.0 native install」という呼称、`aidlc doctor` の案内が `dist/<harness>/` の複製から `aidlc config` に変わったこと
- [2.8.2] `CHANGELOG.md` § [2.8.2] — 2026-09-10、要約確認の受領とレビュー所見の表の診断の修正、`aidlc version` が `2.8.2` を返すこと
- [2.8.2] `docs/reference/03-orchestrator.md` § Detailed Scope Breakdown — `classic` スコープを「v1-style lifecycle with no Ideation」と形容する一文があり、v1 の定義はないこと
- [2.8.2] `CHANGELOG.md` § [2.6.18] — Classic と Express の追加、既定スコープが `classic` になったこと、「v1-style lifecycle」という形容
- [2.8.2] `CHANGELOG.md` § [2.8.6] — 公開されなかった開発版の項であり、意図したリリース版が 2.8.2 であること
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/requirements-analysis/requirements.md` § Assumptions — A7（配布方式の転換点は 2.7.2 で、2.8.0 系がネイティブ導入だけで配布された最初の baseline）、A5（「v1」の説明は claude 版へのリンクで足りるという代理判断）
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/requirements-analysis/requirements.md` § Non-functional requirements — NFR8（本書の事実を 2.8.2、タグ `v2.8.2`、コミット `355903d` に固定すること）
