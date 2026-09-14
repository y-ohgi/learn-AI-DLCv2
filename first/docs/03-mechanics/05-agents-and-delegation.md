# 3.5 エージェントと委譲

前の章までで、エンジンが「次に何をするか」を決め、コンダクター（あなたと会話している `/aidlc` セッション）がそれを実行する、という往復を見てきました。この章では、コンダクターが各ステージで「誰の立場で」仕事をするのか、つまりエージェントという仕組みを見ます。あわせて、ほとんどのステージではコンダクターが一人で役を演じるのに対し、4 つのステージだけは本物の別プロセスに仕事を委譲する、という区別を説明します。

## この章で学ぶこと

- 14 のエージェントを「11 の専門家・2 のレビュアー・1 のコンポーザー」に分け、それぞれの役割を説明できる。
- ステージの実行形態 inline / subagent / pipeline / mob の 4 つを区別し、どの 4 ステージが委譲を使うかを言える。
- レビュアーの助言型（advisory）と対抗型（adversarial）の違いと、支援エージェントの寄稿ファイルの形（`**Collaborator:**`、`AGREE:` / `OBJECT:`）を読める。

## 14 のエージェント

AI-DLC のエージェントとは、「ソリューションアーキテクト」「QA エンジニア」のような人格（ペルソナ）と、その人格が読み込む知識の束を Markdown ファイルとして定義したものです。2.8.2 には 14 のエージェントが同梱されており、インストール済みランタイムでは `first/.claude/agents/` に、配布物のソースでは `core/agents/` に、エージェント slug と同じ名前のファイルとして置かれています。14 は次の 3 群に分かれます。

| 群 | 数 | エージェント slug |
| --- | --- | --- |
| 専門家（ステージの作業を実行する） | 11 | `aidlc-product-agent`、`aidlc-design-agent`、`aidlc-delivery-agent`、`aidlc-architect-agent`、`aidlc-aws-platform-agent`、`aidlc-compliance-agent`、`aidlc-devsecops-agent`、`aidlc-developer-agent`、`aidlc-quality-agent`、`aidlc-pipeline-deploy-agent`、`aidlc-operations-agent` |
| レビュアー（成果物を作らず、審査だけする） | 2 | `aidlc-product-lead-agent`、`aidlc-architecture-reviewer-agent` |
| コンポーザー（適応型ワークフローの提案） | 1 | `aidlc-composer-agent` |

専門家が 11 人であることには設計上の理由があります。ガイドは「小さな mob、広いエージェント」と呼び、数十の狭い専門家を並べるとウォーターフォールの引き渡し連鎖を再現してしまうので、人間の 3〜5 人のチームが要件から配備までを見るように、1 人のエージェントが複数のステージとフェーズにまたがって参加する、と説明しています。たとえば `aidlc-architect-agent` は feasibility、domain-design、units-generation、contract-design、functional-design、nfr-requirements、nfr-design の 7 ステージをリードし、3 つのフェーズにまたがります。

各ステージには **リードエージェント**（そのステージの成果物を所有する 1 人）と、必要なら **支援エージェント**（協力者）が定義されています。`aidlc-compliance-agent` と `aidlc-devsecops-agent` はリードするステージを持たず、支援としてだけ参加します。前の章で見た `aidlc-composer-agent` は、`/aidlc compose` などの compose 要求のときにだけコンダクターから呼び出され、ステージの作業はしません。

## 4 つの実行形態

エージェントの一覧を見ると、「14 の AI が並行して走っている」ように想像するかもしれません。実際はそうではありません。ステージ定義の `mode` という項目が、そのステージの「通信の形」を決めており、2.8.2 に同梱される 33 ステージの内訳は 29 inline / 2 subagent / 1 pipeline / 1 mob です。

| `mode` | 形 | 何が起きるか | 該当ステージ |
| --- | --- | --- | --- |
| `inline` | 1 人芝居 | コンダクターがリードの人格を読み込み、この会話の中で直接作業する。支援エージェントは「声」として演じるだけで、別ファイルは書かない | 29 ステージ |
| `subagent` | ハブ&スポーク | リードを別のサブエージェントとして起動し、支援エージェントもそれぞれ独立に起動する。各支援は互いに見えない状態で寄稿ファイルを書き、最後にリードが統合する | 2.2 practices-discovery、3.5 code-generation |
| `pipeline` | 連鎖 | リード → 支援の順に 1 つずつ起動し、各リンクが上流の結果を見て成果物を直接前進させる。寄稿ファイルは無い | 2.1 reverse-engineering（開発者が走査し、アーキテクトが統合して書く） |
| `mob` | メッシュ | リードが草案を書き、全支援エージェントが並行に起動して寄稿ファイルを書く。リードが統合し、残った異論を仕分ける | 2.4 user-stories |

どの形でも共通する原則が 2 つあります。第一に、**コンダクターがすべての委譲を行う**ことです。エージェント同士が直接呼び合うことはなく、Claude Code 上では各エージェントに `disallowedTools: Task` が設定されて入れ子の委譲が塞がれています。第二に、**リードだけがステージの成果物を編集する**ことです。支援エージェントは自分の寄稿ファイルにだけ書き、リードがそれを読んで成果物に取り込みます。

```text
        inline              subagent (hub-and-spoke)        pipeline            mob
   +-----------+            +-----------+              +----+  +----+     +-----------+
   | conductor |            | conductor |              |lead|->|sup |     | conductor |
   | as lead   |            +-----+-----+              +----+  +----+     +-----+-----+
   +-----------+           /      |      \                                /   |   \
                      +----+  +----+  +----+                         +----+ +----+ +----+
                      |lead|  |sup1|  |sup2|                         |lead| |sup1| |sup2|
                      +----+  +----+  +----+                         +----+ +----+ +----+
```

図の `conductor` はコンダクター、`lead` はリードエージェント、`sup` は支援エージェントです。subagent と mob では支援が並行に起動され、pipeline では順に 1 本の鎖になります。

## 寄稿ファイル

subagent と mob のステージで支援エージェントが書くファイルを **寄稿**（contribution）と呼びます。置き場所は記録の `<phase>/<stage>/contributions/<agent-slug>.md` で、形は決まっています。1 行目は必ず `**Collaborator:** <agent-slug>` という識別行、続いて `## Contribution`（リードが成果物に取り込める本文）と `## Positions`（草案への立場表明）です。`## Positions` の各行は `AGREE:` か `OBJECT:` で始まり、賛成または反対する点と一行の理由を書きます。全面賛成なら `None` と書きます。

この識別行は飾りではありません。エンジンは mob と支援付き subagent のステージで、寄稿ファイルがそろっていることを完了の証拠として検査し、1 つでも欠けていれば承認を拒みます。また `OBJECT:` の行は、mob の異論仕分けの材料になります。判断の問題は人にステージ途中で問われ、知識の争いは異論を出したエージェントだけで 2 巡目に回り、それでも残った反対意見はゲートで逐語的に引用されます。

本書の制作ワークフローでは、practices-discovery（チームの開発慣行を発見して確認するステージ）が subagent 形態で走り、リード `aidlc-pipeline-deploy-agent` の草案に対して `aidlc-developer-agent`、`aidlc-devsecops-agent`、`aidlc-quality-agent` の 3 名が寄稿しました。`aidlc-quality-agent` の寄稿の `## Positions` から、賛成と反対を 1 行ずつ抜粋します。

```markdown
**Collaborator:** aidlc-quality-agent

## Positions
- AGREE: Methodology `test-after` — 4 種の検証はすべて執筆後にしか走らず、functional-design の事前列挙は仕様審査でテストではない。…
- OBJECT: 「ビルド成功」の定義が終了コードだけ — `scripts/build-site.mjs` は `first/SUMMARY.md` 不在で first 版をスキップして 0 で終わるため、`_site/first/index.html` の存在確認を合否に含めない限り PR ビルドの緑は first 版の証明にならない。
```

この `OBJECT:` は実際にリードの草案を訂正し、確認された慣行を保存するファイル `team.md`（3.7 で扱います）の Walking Skeleton の完了条件に「`_site/first/index.html` が存在すること」が入りました。支援エージェントの反対が成果物を変えた具体例で、第 5 部で他の 2 点とあわせて追います。

## レビュアー

11 の専門家とは別に、2 つのレビュアーがいます。レビュアーは成果物を作りません。ステージ定義に `reviewer:` が宣言されているときだけ、ステージ本体が成果物を書き終えた後、学びの儀式と承認ゲートの前に、コンダクターが **別のサブエージェントとして** 起動します。`aidlc-product-lead-agent` は rough-mockups、refined-mockups、requirements-analysis、user-stories を、`aidlc-architecture-reviewer-agent` は domain-design、units-generation、functional-design、nfr-requirements、nfr-design、infrastructure-design、code-generation を審査します。

レビュアーはステージ定義・質問と回答・成果物を読みますが、作った側の `memory.md` や計画は読みません（独立した判断を保つためです）。判定は `READY` か `NOT-READY` のどちらかで、所見の表とともに、コンダクターが指定したレビューファイルに書きます。レビュアーは審査対象の成果物を編集せず、エンジンはレビューを記録の `.aidlc-reviews/` 配下に保管し、成果物が変わった後の判定は受け付けません。判定の扱いは、ステージの **レビュー種別** で変わります。

- **助言型（advisory）** — Ideation / Inception の文章系ステージの既定。通常の流れで 1 回だけ審査し、判定が何であれリードを再起動しません。所見は承認ゲートで重大度順に逐語引用され、人が仕分けます。所見を修正に変えたいなら、ゲートで Request Changes を選びます。
- **対抗型（adversarial）** — Construction の設計・実装系ステージの既定。`NOT-READY` ならリードが所見に対処して再実行し、レビュアーが再確認する、というループを `reviewer_max_iterations`（既定 2）回まで回します。上限に達しても所見が残れば、未解決の所見を添えて承認ゲートに進みます。

どちらの種別でも、レビュアーが最終決定をすることはありません。ガイドの言葉を借りれば「レビュアーは決して塞がない。人が常に最終決定権を持つ」です。レビュアーには `maxTurns: 60` の上限があり、判定が読み取れないまま終わった場合はコンダクターが 1 回だけ再依頼し、2 回目も不完全なら「審査がターン予算内に完了しなかった」という所見つきの `NOT-READY` として記録されます。沈黙が「見えない失敗」にならず、ゲートで見える所見になる設計です。本書の制作記録では、intent-capture のレビュアー所見 R-01〜R-10 が Request Changes につながっており、これも第 5 部で読みます。

## まとめ

- 14 のエージェントは、ステージの作業を実行する 11 の専門家、成果物を作らず審査だけする 2 のレビュアー、compose 要求のときだけ動く 1 のコンポーザーから成る。
- ステージの `mode` は inline / subagent / pipeline / mob の 4 つで、33 ステージの内訳は 29 / 2 / 1 / 1。委譲を使うのは 2.1 reverse-engineering（pipeline）、2.2 practices-discovery（subagent）、2.4 user-stories（mob）、3.5 code-generation（subagent）の 4 つで、どの形でもコンダクターが委譲を行い、リードだけが成果物を編集する。
- レビュアーは助言型なら 1 回の審査結果をゲートで人に引用し、対抗型なら `NOT-READY` に対してリードの再実行と再審査を上限回数まで繰り返す。支援エージェントの寄稿は `**Collaborator:**` の識別行で始まり、`## Positions` の `AGREE:` / `OBJECT:` が異論の仕分けとゲートでの引用の材料になる。

## 出典

- [2.8.2] `docs/guide/06-agents.md` § Agents — 14 エージェント = 11 の専門家 + 2 のレビュー専用 + コンポーザー、という構成
- [2.8.2] `docs/guide/06-agents.md` § Philosophy: Small Mob, Broad Agents — 11 人の理由（引き渡し連鎖の回避）、`aidlc-architect-agent` が 7 ステージをリードすること、`mode` が支援エージェントの参加形を決めること
- [2.8.2] `docs/guide/06-agents.md` § The 11 Domain Agents — 各エージェントの Leads / Supports、`aidlc-compliance-agent` と `aidlc-devsecops-agent` が支援専任であること
- [2.8.2] `docs/guide/06-agents.md` § Agent Tool Access — Claude Code 上で `disallowedTools: Task` により入れ子の委譲が塞がれること
- [2.8.2] `docs/guide/06-agents.md` § Reviewer Agents — 2 レビュアーの担当ステージ、別サブエージェントとしての起動、`READY` / `NOT-READY`、`.aidlc-reviews/`、advisory / adversarial の扱い、`reviewer_max_iterations` 既定 2、`maxTurns: 60` と再依頼、「レビュアーは決して塞がない」
- [2.8.2] `docs/guide/06-agents.md` § The Composer Agent — `aidlc-composer-agent` が compose 要求のときにだけ起動されること
- [2.8.2] `docs/guide/00-introduction.md` § How the Orchestrator Works — ほとんどのステージが inline で、4 ステージが委譲形態（practices-discovery と code-generation が subagent、reverse-engineering が pipeline、user-stories が mob）、内訳 29 / 2 / 1 / 1
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-ensemble.md` § 5. Multi-agent stages (ensemble topologies) — リードが成果物を所有し、支援が自分の作業を書き、コンダクターがすべての委譲を行いエージェント同士は呼び合わないこと
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-ensemble.md` § Collaborator contribution files (ensemble topologies) — 寄稿ファイルの置き場所と形（`**Collaborator:**` の識別行、`## Contribution`、`## Positions` の `AGREE:` / `OBJECT:`、`None`）、完了証拠としての検査、異論の仕分け
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-ensemble.md` § Claude Code — 4 形態それぞれの実行手順（inline は声として演じる、subagent は互いに見えない並行起動、pipeline は寄稿ファイル無し、mob は有界の巡回）とエンジンが寄稿欠落時に承認を拒むこと
- [2.8.2] `core/aidlc-common/protocols/stage-protocol-reviewer.md` § 12a. Reviewer Invocation — レビュアーが別サブエージェントとして本体の後・§13 の前に起動されること、adversarial と advisory の定義
- [2.8.2] `core/agents/` — 14 のエージェント定義ファイル（slug と同名）
- [runtime] `first/.claude/agents/` — インストール済みの 14 エージェント定義ファイル
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/practices-discovery/contributions/aidlc-quality-agent.md` § Positions — 抜粋した `AGREE:` / `OBJECT:` の行と、3 名の支援エージェントの寄稿が存在すること
- [record] `first/aidlc/spaces/default/memory/team.md` § Walking Skeleton — 寄稿の `OBJECT:` を反映した完了条件（`_site/first/index.html` の存在）
