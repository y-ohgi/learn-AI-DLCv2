# 3.2 エンジンとコンダクター

1.1 で「AI-DLC は順序と判断の地点をソフトウェアとして実装している」と書きました。この章はその実装の中心、つまり決定論的なエンジンと、あなたの会話相手であるコンダクターの往復を、実際のディレクティブの種別と監査ログの行を見ながら説明します。ここが分かると、以降の章で出てくる「ステージ」「承認ゲート」「状態ファイル」がすべて同じ 1 つのループの部品だと見えてきます。

## この章で学ぶこと

- 「エンジンが次を決め、コンダクターが実行して報告する」往復を、`next` と `report` の 2 つのサブコマンドで説明できる。
- `aidlc engine orchestrate next` が返すディレクティブの種別を列挙し、読者が普段目にするものとそうでないものを区別できる。
- `report --result` に渡す結果値と、それがステージの状態遷移と監査イベントにどう対応するかを説明できる。
- `aidlc-state.md` の `Current Stage` を見て、ワークフローがどこにいるかを読み取れる。

## 1 つのループ

AI-DLC の中核は単純なループです。**エンジン**は決定論的なプログラム（`aidlc-orchestrate.ts`）で、次に何が起きるべきかを決めます。**コンダクター**は `/aidlc` を打ったときに動く Claude Code のセッションそのもので、エンジンの指示を実行し、終わったら結果を報告して次の指示を求めます。

```text
   +-------------+   next    +----------------------+   directive
   |  conductor  | --------> |  engine (orchestrate)| --------------+
   | (/aidlc     |           |  reads state-graph,  |               |
   |  session)   | <-------- |  scope-grid, state   | <--+          |
   +-------------+  report   +----------------------+    |          v
        |  ^                                              |   run-stage / ask /
        v  |                                              |   print / done ...
   [stage work, questions, gate with you]                 |
        |                                                 |
        +-------- report --stage <slug> --result <...> ---+
```

図の上段が「コンダクターが `next` を呼び、エンジンがディレクティブを返す」往路、下段が「コンダクターがステージの仕事をして `report` で結果を返す」復路です。エンジンが受け持つのは配線です。どのステージが次か、どのスコープか、いつ止まるか、ゲートが開いているか、ワークフローが完了したか。これらの判断はエンジンと、エンジンが読むコンパイル済みデータ（`tools/data/stage-graph.json` と `tools/data/scope-grid.json`）にあります。コンダクターが受け持つのは実行の質です。ステージをうまく進める、よい質問をする、決めるべきことをあなたに見せる。2.8.2 のリファレンスはこれを「SKILL.md は制御プレーンではない」と言い切っています。

エンジンのサブコマンドは `next`、`continue`、`report`、`park`、`team-board` の 5 つに固定されています。読者が意識するのは `next`（次の指示をもらう）と `report`（結果を報告する）の 2 つで、`continue` はルールを分割配送する内部用、`park` はワークフローを区切りの良いところで一時停止する、`team-board` はチーム構成の Construction の読み取り専用の掲示板です。

## ディレクティブの種別

`aidlc engine orchestrate next` が返すのは `kind` というフィールドで型が決まる JSON で、これをディレクティブと呼びます。ディレクティブの型は `core/tools/aidlc-directive.ts` の `VALID_KINDS` に 11 種が定義され、そのうち 9 種が 2.8.2 のエンジンから実際に発行されます。残り 2 種（`dispatch-subagent` と `present-gate`）は将来のための予約で、発行されません。

読者が本書のハンズオンで目にするのは次の 5 種です。

| `kind` | コンダクターがすること |
| --- | --- |
| `load-steering` | `rules_content` に入ってきたルール（3.7 で扱うメモリ層の内容）を順に適用し、すぐ `continue` を呼んで続きを受け取る。人には見せない |
| `run-stage` | 名指しされたステージを実行する。ステージ定義ファイルのパス、読むべき入力、ゲートの有無、次のステージ名などがフィールドで届く |
| `print` | `message` のとおりにする。`--status` や `--help` のような読み取り専用ユーティリティの実行と表示に使われる |
| `ask` | `question` を Claude Code の構造化質問として表示し、答えを受け取る。エンジンは自分では人に質問せず、必ずコンダクターに委ねる |
| `done` | ワークフロー（または単一ステージ実行）が完了した。完了サマリーを表示して止まる |

残りの発行される 4 種は、状況が限られています。`error` はメッセージをそのまま表示して止まるもので、取り繕わずに見せるのが約束です。`parked` は `park` で一時停止されたワークフローに `next` を打ったときの終端応答で、再開方法を案内して止まります。`notice` はチーム所有の Unit が別の場所で進んでいるときの情報表示です。そして `invoke-swarm` は、Construction を自律（autonomous）モードで走らせているときにエンジンが Unit のバッチをまとめてコンダクターに渡し、並列に fan-out させるためのもので、本書のワークフローでは使いません。

> **補足** — 本書の要件定義の段階では、この集合を `aidlc-orchestrate.ts` に現れる 7 種として整理していました。執筆時に `aidlc-directive.ts` の `VALID_KINDS` を正として数え直したため、本文は 11 種（発行 9 種）としています。

## `report --result` の結果値

コンダクターがステージの仕事を終えたら、`aidlc engine orchestrate report --stage <slug> --result <outcome>` で結果を返します。`--result` に渡せる値の集合はエンジンのコードで固定されていて、知らない値は黙って無視されずにエラーになります。

| 結果値 | 意味 | エンジンが刻む監査イベント |
| --- | --- | --- |
| `awaiting-approval` | ステージの成果物ができたので承認ゲートを開く | `STAGE_AWAITING_APPROVAL` |
| `approved` | あなたが Approve を選んだ。`completed` / `complete` / `done` も同義語として受理される | `GATE_APPROVED` + `STAGE_COMPLETED`、次のステージの `STAGE_STARTED` |
| `rejected` | あなたが Request Changes を選んだ。`--reason` にフィードバックを添える | `GATE_REJECTED` + `STAGE_REVISING` |
| `revised` | 差し戻し後の修正を終え、ゲートを再び開く | `STAGE_AWAITING_APPROVAL` |
| `skipped` | ステージを飛ばす。`--reason` が必須 | `STAGE_SKIPPED` |
| `resumed`（`resume`） | セッション再開メニューの選択を渡す。`--user-input` が必須 | （選択に応じたルーティング） |

`approved` と `rejected` には `--user-input "<exact choice>"` が必須です。あなたが選んだ選択肢のラベルをそのまま渡すことで、監査ログの `User Input` に人の選択が逐語で残ります。コンダクターが要約して書き換えることは禁じられています。3.6 で見る「なぜ AI が勝手に承認できないのか」の仕組みの一端がここにあります。

状態遷移の側から見ると、ステージは `[ ]`（未着手）→ `[-]`（進行中）→ `[?]`（承認待ち）→ `[x]`（完了）と進み、差し戻されると `[?]` → `[R]`（修正中）→ `[?]` と戻ります。チェックボックスの記号を書き換えるのはエンジンだけで、コンダクターは `report` で結果を告げるだけです。

## 状態ファイルの `Current Stage`

エンジンが読み書きする状態ファイルが、作業記録の直下にある `aidlc-state.md` です。3.1 で冒頭を見たこのファイルの `## Current Status` 節に、いま何が起きているかが 1 か所にまとまっています。本書のワークフローの執筆開始時点では次のようになっていました。

```markdown
## Current Status
- **Lifecycle Phase**: CONSTRUCTION
- **Current Stage**: functional-design
- **Next Stage**: code-generation
- **Status**: Running
- **Last Updated**: 2026-09-14T02:10:41Z
```

`Current Stage` はエンジンが `approved` を受け取って次のステージへ進めるたびに書き換えられ、`Next Stage` も同時に更新されます。セッションをまたいで `/aidlc` を打ち直したとき、コンダクターはこの値と監査ログを突き合わせて再開点を決めます。`## Runtime State` 節には差し戻しの回数（`Revision Count`）などの実行時の値が入り、本書のワークフローでは `Revision Count: 3` でした。3 回の差し戻しの中身は第 5 部のケーススタディで読みます。

## 記録から: 1 つのステージが往復した跡

本書のワークフローが発行したディレクティブそのものは記録ディレクトリには保存されません。エンジンは `next` の出力を標準出力に返すだけで、ファイルに残すのは状態ファイルと監査ログだからです。その代わり、監査ログ（`audit/` の下にマシンごとに 1 ファイル置かれる監査シャード）に、往復の結果が時刻つきで残ります。1.4 Scope Definition の 1 往復を抜き出すと次のとおりです。

```markdown
## Stage Start
**Timestamp**: 2026-09-13T13:27:23Z
**Event**: STAGE_STARTED
**Stage**: scope-definition
**Agent**: aidlc-product-agent

---

## Stage Awaiting Approval
**Timestamp**: 2026-09-13T13:31:33Z
**Event**: STAGE_AWAITING_APPROVAL
**Stage**: scope-definition

---

## Gate Approved
**Timestamp**: 2026-09-13T13:31:33Z
**Event**: GATE_APPROVED
**Stage**: scope-definition
**User Input**: Approve
```

読み方はこうです。`STAGE_STARTED` は前のステージの `approved` を受けたエンジンが次のステージを `[-]` にした瞬間で、`Agent` にこのステージを主導するエージェント（3.5 で扱います）が入ります。4 分後の `STAGE_AWAITING_APPROVAL` はコンダクターが `report --result awaiting-approval` を呼んだ結果、`GATE_APPROVED` は `report --result approved --user-input "Approve"` の結果で、`User Input` に選択肢のラベルが逐語で残っています。この 3 行の間に、質問ファイルの作成と回答、成果物の執筆、要約確認（3.3 で扱います）が挟まっています。

> **注意** — 本書のワークフローは依頼者が介入しない前提で走ったため、この `Approve` はコンダクターが依頼者の代理として入力したものです。人が在席していたことをフックが刻印する仕組みと、無人ワークフローでそれがどう扱われたかは 3.6 と 5.3 で扱います。

## まとめ

- エンジン（`aidlc-orchestrate.ts`、サブコマンドは `next` / `continue` / `report` / `park` / `team-board` の 5 つ）が配線を決め、コンダクター（`/aidlc` セッション）が実行の質を受け持ち、`next` と `report` で往復する。
- ディレクティブは `kind` で型が決まり、11 種のうち 9 種が発行される。読者が目にするのは `load-steering` / `run-stage` / `print` / `ask` / `done` で、`invoke-swarm` は自律モードの Construction 専用。
- `report --result` の値は `awaiting-approval` / `approved` / `rejected` / `revised` / `skipped` / `resumed` などに固定され、それぞれが `[?]` `[x]` `[R]` `[S]` の状態遷移と `STAGE_AWAITING_APPROVAL` / `GATE_APPROVED` などの監査イベントに対応する。
- `aidlc-state.md` の `## Current Status` にある `Current Stage` と `Next Stage` が現在地で、ディレクティブ自体は保存されない代わりに監査シャードに往復の跡が残る。

## 出典

- [2.8.2] `docs/guide/00-introduction.md` § How the Orchestrator Works — 決定論的なエンジンが次を決めコンダクターが実行する往復、エンジンが配線を・コンダクターが実行の質を受け持つこと、29 inline / 2 subagent / 1 pipeline / 1 mob の内訳
- [2.8.2] `docs/reference/03-orchestrator.md` § Orchestrator（冒頭） — `aidlc-orchestrate.ts` の 5 サブコマンド `next` / `continue` / `report` / `park` / `team-board` とそれぞれの役割、ルーティングがエンジンとコンパイル済みデータ（`stage-graph.json`、`scope-grid.json`）にあり SKILL.md が制御プレーンではないこと
- [2.8.2] `docs/reference/17-skill-system.md` § directive kinds table — 11 種のディレクティブ、発行される 9 種と予約 2 種（`dispatch-subagent`、`present-gate`）、各 `kind` に対するコンダクターの動作、`invoke-swarm` が自律モードの Construction バッチにのみ発行されること
- [2.8.2] `core/tools/aidlc-directive.ts` VALID_KINDS — ディレクティブ種別の全集合
- [2.8.2] `core/tools/aidlc-orchestrate.ts` REPORT_RESULTS — `report --result` が受理する値の集合（`approved` / `completed` / `complete` / `done` の同義、`awaiting-approval` / `rejected` / `revised`、`resume` / `resumed`、`skipped`）と未知の値がエラーになること
- [2.8.2] `docs/reference/03-orchestrator.md` § Stage Lifecycle — `[ ]` `[-]` `[?]` `[R]` `[x]` `[S]` の遷移と `report` の各結果値・監査イベントの対応、遷移をエンジンだけが行うこと
- [2.8.2] `docs/reference/03-orchestrator.md` § When a stage completes — `report --result awaiting-approval` / `approved --user-input` / `rejected --user-input --reason` / `revised` の呼び方と、`approved` 時に次ステージの `STAGE_STARTED` と Current Stage の更新が行われること
- [2.8.2] `docs/reference/04-stage-protocol.md` § Critical Compliance Checklist — ユーザー入力を要約せず選択肢のラベルを逐語で渡すこと、`skipped` に `--reason` が要ること
- [2.8.2] `docs/reference/03-orchestrator.md` § State File Schema — `aidlc-state.md` の節構成（Current Status、Runtime State の Revision Count など）とチェックボックス 6 状態
- [2.8.2] `docs/reference/03-orchestrator.md` § Resume Options — `report --result resumed --user-input` で再開メニューの選択を渡すこと
- [2.8.2] `docs/reference/04-stage-protocol.md` § Stage Protocol Reference（冒頭の Path convention 注記） — 監査ログがマシンごとのシャード `<record>/audit/<host>-<clone>.md` に分かれること
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/inception/requirements-analysis/requirements.md` FR4.2 — 要件定義の段階でディレクティブ種別を 7 種として整理していたこと
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Current Status — 抜粋した `Current Stage` / `Next Stage`
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/aidlc-state.md` § Runtime State — `Revision Count: 3`
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` STAGE_STARTED — scope-definition の開始行
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` STAGE_AWAITING_APPROVAL — scope-definition のゲート開放行
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/audit/vm-a9d1eb8f1a6a.md` GATE_APPROVED — scope-definition の承認行と `User Input: Approve`
- [record] `first/aidlc/spaces/default/intents/260913-aidlc-v2-book/ideation/intent-capture/intent-capture-questions.md` § Q9 — 依頼者が介入せずコンダクターが代理で判断する方針
